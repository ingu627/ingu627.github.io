---
layout: single
title: "쿠버네티스 보안: RBAC·Admission·시크릿과 이미지 공급망"
excerpt: "보안은 기능 하나가 아니라 코드가 실행되기까지의 모든 계층에 걸친 통제다. 4C 모델을 뼈대로 인증·인가(RBAC), 어드미션 정책, 워크로드 격리, 시크릿 외부화, 이미지 공급망과 런타임 탐지까지 설계→구현→검증 순서로 정리한다."
categories: [k8s]
tags: [kubernetes, k8s, security, rbac, admission, networkpolicy, secrets, supply-chain, 정리]
toc: true
toc_sticky: true
sidebar_main: true

date: 2026-07-11
last_modified_at: 2026-10-10
---

이 시리즈는 쿠버네티스와 클라우드(AWS·GCP·Azure 공통 개념)를 실무 관점에서 정리한 기록이다. 핵심 개념·코드 예제·실전 함정(gotcha) 중심으로, 학습과 설계 리뷰·장애 대응에 바로 쓸 수 있게 구성했다. 각 편은 독립적으로 읽을 수 있고, 순서대로 보면 클러스터 내부 구조에서 클라우드 운영까지 하나의 흐름으로 이어진다.

이번 편에서는 쿠버네티스(Kubernetes) 보안을 다룬다. 보안은 하나의 기능이 아니라, 코드가 클러스터에 도달해 실행되기까지의 모든 계층에 걸친 통제의 집합이다. 앞 편인 [쿠버네티스 네트워킹](https://ingu627.github.io/k8s/kubernetes-networking/)에서 NetworkPolicy로 트래픽 경계를 세우는 법을 다뤘다면, 이번 편은 4C 모델을 뼈대로 인증·인가, 워크로드 격리, 시크릿 관리, 이미지 공급망(image supply chain), 런타임 탐지, 감사(audit) 로그까지 "설계 → 구현 → 검증" 순서로 정리한다. 다음 편인 [쿠버네티스 관찰성과 디버깅](https://ingu627.github.io/k8s/kubernetes-observability/)에서는 이렇게 세운 통제가 실제로 동작하는지 메트릭·로그·트레이싱으로 확인하는 방법을 이어서 살펴본다. 아래 YAML/CLI 예제는 실제 클러스터에 적용 가능한 최소 형태로 작성했고, 마지막에 실전 함정과 체크리스트를 정리했다.

- 4C 모델로 Cloud·Cluster·Container·Code 각 계층의 위협과 통제를 구분한다
- 인증(x509·OIDC·바운드 토큰)과 인가(RBAC)의 경계, 그리고 어드미션 게이트의 위치를 이해한다
- ServiceAccount·PSS·NetworkPolicy로 워크로드 격리를 최소 권한으로 설계한다
- Secret을 etcd 암호화와 외부 시크릿 저장소로 외부화해 평문 노출을 없앤다
- 이미지 스캔·서명·SBOM과 런타임 탐지·감사 로그까지 공급망과 운영을 정리한다

---

## 1. 4C 보안 모델

4C는 방어 계층을 **Cloud → Cluster → Container → Code** 순으로 나눈다. 바깥 계층이 뚫리면 안쪽 통제는 의미가 없으므로, 항상 가장 바깥부터 점검한다.

| 계층 | 대표 위협 | 핵심 통제 |
| :--- | :--- | :--- |
| Cloud | IAM 키 유출, 노드 메타데이터 접근, 스냅샷 탈취 | 최소 권한 IAM, IMDSv2 강제, KMS 암호화, 사설 서브넷 |
| Cluster | apiserver 무단 접근, etcd 평문 노출, 과도한 RBAC | 인증(OIDC/x509), RBAC 최소화, etcd 암호화, 감사 로그 |
| Container | 취약 이미지, root 실행, 권한 상승 | 이미지 스캔·서명, PSS(restricted), seccomp, capabilities drop |
| Code | 하드코딩 시크릿, 취약 의존성, SSRF | 시크릿 외부화, SAST/SCA, NetworkPolicy로 이그레스 차단 |

핵심 원칙은 **기본 거부(default deny)** 와 **심층 방어(defense in depth)** 다. 어떤 한 계층의 통제가 우회돼도 다음 계층이 피해를 국소화해야 한다.

---

## 2. 인증(Authentication)과 인가(Authorization)

kube-apiserver로 들어온 요청은 인증 → 인가 → 어드미션을 순서대로 통과하고, 세 단계를 모두 통과해야 etcd에 저장된다. 세 게이트가 어디서 갈라지는지 먼저 한 장으로 잡고 들어가면 이후 섹션이 훨씬 수월하다.

![쿠버네티스 요청 처리 파이프라인: 인증 → 인가(RBAC) → 어드미션 → etcd](/assets/images/k8s/k8s-authn-authz-admission.png)

위 다이어그램은 하나의 요청이 kube-apiserver 안에서 인증(Authentication) → 인가(Authorization, RBAC) → 어드미션(Admission)을 통과한 뒤 etcd에 기록되는 파이프라인을 보여준다. 인증 실패는 401, 인가는 통과했지만 권한이 없으면 403이며, 어드미션 단계에서 하나라도 거부되면 객체는 etcd에 저장되지 않는다.

### 2.1 인증: 누구인가

apiserver는 요청을 받으면 먼저 신원을 확인한다. 실무에서 쓰이는 방식은 세 가지다.

- **x509 클라이언트 인증서**: `--client-ca-file`로 서명된 인증서의 CN(사용자)·O(그룹)을 신원으로 사용. 인증서 회수(revocation)가 불가능해 장기 자격증명으로는 부적합하다.
- **OIDC**: `--oidc-issuer-url`/`--oidc-client-id` 설정 후 IdP(예: Entra ID, Keycloak)의 JWT를 검증. 그룹 클레임으로 RBAC을 묶기 때문에 사람 사용자에게는 사실상 표준이다.
- **ServiceAccount 토큰**: 워크로드 신원. 1.24부터 Secret 기반 영구 토큰은 자동 생성되지 않고, `TokenRequest` API로 발급되는 **바운드 토큰(bound token)** 이 기본이다. 토큰은 특정 파드/노드/만료 시간에 묶이므로 유출 시 피해 범위가 작다.

```bash
# 클러스터가 지원하는 인증 방식 확인(관리형 클러스터에서 OIDC 설정 여부 등)
kubectl version -o json | jq '.serverVersion.gitVersion'
kubectl get --raw /.well-known/openid-configuration 2>/dev/null || echo "OIDC 미구성"

# 바운드 토큰 수동 발급(expirationSeconds 로 수명 제한)
kubectl create token deploy-bot -n prod --duration=1h
```

### 2.2 인가: 무엇을 할 수 있는가

RBAC은 `Role`(네임스페이스 스코프)과 `ClusterRole`(클러스터 스코프), 이를 주체에 연결하는 `RoleBinding`/`ClusterRoleBinding`으로 구성된다. 규칙은 **가산적(additive)** 이며 거부 규칙(deny)은 존재하지 않는다. 따라서 "허용하지 않으면 불가"를 전제로 최소 권한을 설계한다.

```yaml
# 네임스페이스 단위 최소 권한: 로그 조회만 허용
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-log-reader
  namespace: prod
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/log"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["pods/exec"]          # 서브리소스는 반드시 명시
    verbs: ["create"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: pod-log-reader
  namespace: prod
subjects:
  - kind: User
    name: alice@example.com
    apiGroup: rbac.authorization.k8s.io
  - kind: ServiceAccount
    name: deploy-bot
    namespace: prod
roleRef:
  kind: Role
  apiGroup: rbac.authorization.k8s.io
  name: pod-log-reader
```

설계 규칙:

1. `resources: ["*"]`, `verbs: ["*"]`는 금지하고, 필요한 서브리소스(`pods/exec`, `pods/portforward`, `secrets`)를 개별 명시한다.
2. 사람에게는 `RoleBinding`, 클러스터 전역 컨트롤러에만 `ClusterRoleBinding`을 쓴다. `ClusterRoleBinding`으로 `system:serviceaccounts` 그룹을 묶는 것은 전체 클러스터 권한 부여와 같다.
3. `edit`/`admin` 같은 기본 ClusterRole은 시크릿 읽기 권한을 포함하므로 무분별하게 붙이지 않는다.
4. 정기적으로 권한을 감사한다: `kubectl auth can-i --list --as=system:serviceaccount:prod:deploy-bot -n prod`.

```bash
# 특정 SA가 클러스터 전체에서 무엇을 할 수 있는지 확인
kubectl auth can-i --list --as=system:serviceaccount:prod:deploy-bot

# 위험한 권한(시크릿/exec) 보유 주체 검색: kubectl-who-can 플러그인 활용
kubectl who-can get secrets --all-namespaces

# 미사용 ServiceAccount 및 RBAC 정리 대상 확인
kubectl get clusterrolebindings -o json \
  | jq -r '.items[] | select(.roleRef.name=="cluster-admin") | .metadata.name'
```

---

## 3. ServiceAccount 최소 권한

모든 파드는 하나의 ServiceAccount로 실행되며, 기본값(`default`)은 아무 권한도 없지만 **토큰이 자동 마운트**된다는 점이 문제다. 토큰이 필요 없는 워크로드는 마운트를 끈다.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: deploy-bot
  namespace: prod
automountServiceAccountToken: false   # 기본값: 마운트 안 함
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: prod
spec:
  template:
    spec:
      serviceAccountName: deploy-bot
      automountServiceAccountToken: false
      containers:
        - name: api
          image: registry.example.com/api@sha256:4f1c...   # 태그가 아닌 다이제스트 고정
          securityContext:
            runAsNonRoot: true
            runAsUser: 10001
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop: ["ALL"]
            seccompProfile:
              type: RuntimeDefault
```

- 토큰이 꼭 필요하면 `automountServiceAccountToken: true`를 **파드 단위로만** 켜고, 해당 SA에는 필요한 API만 허용하는 Role을 바인딩한다.
- 토큰은 파드 볼륨(`/var/run/secrets/kubernetes.io/serviceaccount`)으로 마운트되며 `audience`/`expirationSeconds`를 지정한 프로젝티드 볼륨으로 수명을 줄일 수 있다.
- `runAsUser`를 지정하는 것만으로는 부족하다. 이미지의 USER가 root면 PSS restricted가 파드를 거부한다.

---

## 4. Admission Controller와 정책 엔진

Admission 단계는 인가 이후, etcd 저장 이전에 실행되는 마지막 게이트다. **Mutating → Validating** 순서로 동작하며, Validating 웹훅이 최소 하나라도 거부하면 객체는 저장되지 않는다.

### 4.1 내장 게이트와 ValidatingAdmissionPolicy

- **내장**: `PodSecurity`, `LimitRanger`, `ResourceQuota`, `MutatingAdmissionWebhook`, `ValidatingAdmissionWebhook`.
- **ValidatingAdmissionPolicy(VAP)**: 1.30+ GA. CEL(Common Expression Language)로 작성하는 **내장** 정책으로, 외부 웹훅 없이 동작해 가용성 위험이 낮다.
- **Kyverno**: YAML 선언만으로 작성. mutate/validate/generate/verifyImages까지 한 도구로 처리.
- **OPA Gatekeeper**: Rego 언어 기반. 복잡한 조직 정책·예외 처리에 강하다.

```yaml
# ValidatingAdmissionPolicy: latest 태그 이미지 금지 (CEL, 외부 웹훅 불필요)
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: deny-latest-tag
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
      - apiGroups: [""]
        apiVersions: ["v1"]
        operations: ["CREATE", "UPDATE"]
        resources: ["pods"]
  validations:
    - expression: >-
        object.spec.containers.all(c, !c.image.endsWith(':latest'))
      message: "latest 태그 대신 다이제스트 또는 명시적 버전 태그를 사용하세요."
      reason: Invalid
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: deny-latest-tag
spec:
  policyName: deny-latest-tag
  validationActions: ["Deny", "Audit"]
  matchResources:
    namespaceSelector:
      matchExpressions:
        - key: kubernetes.io/metadata.name
          operator: NotIn
          values: ["kube-system"]
```

### 4.2 Kyverno·Gatekeeper와 웹훅 가용성

```yaml
# Kyverno: 레지스트리 화이트리스트 + 서명 검증(공급망 게이트)
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: verify-images
spec:
  validationFailureAction: Enforce
  background: false
  rules:
    - name: allow-trusted-registry
      match:
        any:
          - resources:
              kinds: ["Pod"]
      validate:
        message: "registry.example.com 이미지만 허용됩니다."
        pattern:
          spec:
            containers:
              - image: "registry.example.com/*"
    - name: verify-cosign-signature
      match:
        any:
          - resources:
              kinds: ["Pod"]
      verifyImages:
        - imageReferences: ["registry.example.com/*"]
          attestors:
            - entries:
                - keyless:
                    subject: "https://github.com/example/*"
                    issuer: "https://token.actions.githubusercontent.com"
```

운영 주의: 웹훅 기반 정책 엔진은 `failurePolicy: Fail`일 때 엔진 장애가 **클러스터 전체 배포 중단**으로 이어진다. 반드시 `namespaceSelector`로 `kube-system`을 제외하고, HA(3 replica) + `timeoutSeconds` 축소 + PDB를 함께 구성한다.

---

## 5. Pod Security Standards

### 5.1 세 단계 프로파일

PSS(Pod Security Standards)는 `privileged` > `baseline` > `restricted` 3단계 프로파일로, 네임스페이스 레이블만으로 클러스터 전체에 적용된다. `enforce`/`audit`/`warn` 세 모드를 독립적으로 설정할 수 있다.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: prod
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: v1.30
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

- **privileged**: 무제한(kube-system 등 시스템 워크로드 전용).
- **baseline**: hostNetwork/hostPID/hostPath, 특권 컨테이너 금지. 기본적인 위험만 차단.
- **restricted**: `runAsNonRoot`, `seccompProfile: RuntimeDefault`, `capabilities.drop: [ALL]`, `allowPrivilegeEscalation: false` 필수.

### 5.2 적용 모드와 도입 순서

도입 순서는 `warn → audit → enforce`가 안전하다. `warn` 모드로 먼저 적용해 어떤 워크로드가 거부될지 로그로 확인한 뒤 승격한다.

---

## 6. NetworkPolicy 심화: 기본 거부

NetworkPolicy는 **허용 목록(allow-list)** 이며, 정책에 선택된 파드만 적용 대상이 된다. 따라서 "모두 차단 후 필요한 것만 허용" 패턴이 기본이다. 전제 조건은 **CNI가 NetworkPolicy를 구현**해야 한다는 점이다(Calico, Cilium, Antrea 등. 일부 CNI는 정책을 무시한다).

### 6.1 기본 거부와 허용 규칙

```yaml
# 1) 네임스페이스 전체 기본 거부 (ingress + egress)
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: prod
spec:
  podSelector: {}
  policyTypes: ["Ingress", "Egress"]
---
# 2) api 파드: 8080 인바운드는 같은 ns의 web에서만, 아웃바운드는 DNS + DB로만
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-allow
  namespace: prod
spec:
  podSelector:
    matchLabels: { app: api }
  policyTypes: ["Ingress", "Egress"]
  ingress:
    - from:
        - podSelector:
            matchLabels: { app: web }
      ports:
        - protocol: TCP
          port: 8080
  egress:
    - to:
        - namespaceSelector:
            matchLabels: { kubernetes.io/metadata.name: kube-system }
      ports:
        - protocol: UDP
          port: 53
    - to:
        - podSelector:
            matchLabels: { app: postgres }
      ports:
        - protocol: TCP
          port: 5432
```

### 6.2 DNS·프로브 함정

함정: 기본 거부만 적용하면 **DNS(kube-system:53)와 kubelet 헬스 프로브**가 막혀 파드가 준비(Ready) 상태에 도달하지 못한다. 이그레스를 차단할 때는 DNS를 반드시 예외로 연다. 또한 `namespaceSelector`와 `podSelector`를 한 항목에 쓰면 AND, 별도 항목으로 나누면 OR로 해석된다.

---

## 7. Secrets 관리

Secret은 etcd에 **base64 인코딩**되어 저장될 뿐 암호화가 아니다. 또 `get secret` 권한 하나로 네임스페이스 전체 시크릿을 읽을 수 있어 RBAC상 가장 민감한 리소스다.

### 7.1 etcd 암호화와 외부 시크릿 저장소

- **etcd 암호화**: `EncryptionConfiguration`으로 `secrets`를 `aescbc` 또는 `kms` 프로바이더로 암호화(Microsoft/KMS envelope encryption 권장).
- **External Secrets Operator(ESO)**: Vault, AWS Secrets Manager, GCP SM 등을 `ExternalSecret` CR로 동기화. Git에는 참조만 남고 값은 남지 않는다.
- **Vault Agent Injector / Secrets Store CSI Driver**: 시크릿을 파일로 마운트해 메모리·파일에만 존재하게 한다.
- **SOPS + age/KMS**: 매니페스트 자체를 암호화해 GitOps(Flux/Argo CD)로 관리. `sops -d`로만 평문이 노출된다.

```yaml
# ESO: AWS Secrets Manager의 값을 k8s Secret으로 동기화
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-sm
  namespace: prod
spec:
  provider:
    aws:
      service: SecretsManager
      region: ap-northeast-2
      auth:
        jwt:
          serviceAccountRef:
            name: eso-sa
---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: db-credentials
  namespace: prod
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-sm
    kind: SecretStore
  target:
    name: db-credentials
    creationPolicy: Owner
  data:
    - secretKey: password
      remoteRef:
        key: prod/db
        property: password
```

### 7.2 SOPS와 평문 노출 점검

```bash
# SOPS 로 시크릿 매니페스트 암호화(.sops.yaml 에 age/KMS 규칙 정의)
sops --encrypt --in-place secrets/db.yaml
sops --decrypt secrets/db.yaml | kubectl apply -f -

# Git 노출 여부 스캔(gitleaks)
gitleaks detect --source . --redact -v
```

원칙: 시크릿은 환경변수보다 **볼륨 마운트**를 선호한다(환경변수는 `kubectl exec env`, 크래시 덤프, 자식 프로세스로 유출된다). 읽기 전용·불변(`immutable: true`)으로 설정하고, 회전(rotation) 주기와 폐기 절차를 문서화한다.

---

## 8. 이미지 공급망(Supply Chain) 보안

공급망 보안은 "무엇이 빌드되어 어떤 이미지로 배포됐는가"를 서명과 증명(attestation)으로 검증하는 작업이다.

| 단계 | 도구 | 목적 |
| :--- | :--- | :--- |
| 스캔 | Trivy, Grype | OS 패키지·언어 의존성 CVE 탐지 |
| SBOM | Syft(SPDX/CycloneDX), Trivy | 구성요소 목록 생성·보관 |
| 서명 | cosign(Sigstore) | 아티팩트 무결성·출처 증명 |
| 증명 | in-toto, SLSA provenance | 빌드 과정의 재현성·변조 방지 |
| 강제 | Kyverno verifyImages, policy-controller | 배포 시점 검증 |

![이미지 공급망 보안 파이프라인: 빌드 → 스캔·SBOM → 서명 → 어드미션 검증 → 런타임](/assets/images/k8s/k8s-supply-chain-security.png)

위 다이어그램은 이미지가 빌드된 뒤 스캔·SBOM 생성·서명을 거쳐 레지스트리에 올라가고, 어드미션에서 서명과 신뢰 레지스트리를 검증한 다음에야 런타임에 도달하는 공급망을 나타낸다. 어느 단계에서 검증하느냐가 아니라, 태그가 아닌 다이제스트를 고정한 상태로 배포 시점(어드미션)에 강제하느냐가 실효를 가른다.

### 8.1 스캔·SBOM·서명 파이프라인

```bash
# 1) 취약점 스캔 (CI 게이트: HIGH/CRITICAL 존재 시 실패)
trivy image --severity HIGH,CRITICAL --exit-code 1 \
  --ignore-unfixed registry.example.com/api:1.4.2

# 2) SBOM 생성 및 이미지에 attestation 으로 첨부
syft registry.example.com/api:1.4.2 -o cyclonedx-json > sbom.json
cosign attest --predicate sbom.json --type cyclonedx \
  registry.example.com/api@sha256:4f1c...

# 3) 키리스(keyless) 서명 — CI 의 OIDC 신원을 Fulcio 인증서로 사용, Rekor 에 투명성 로그 기록
cosign sign --yes registry.example.com/api@sha256:4f1c...

# 4) 배포 전 검증 (로컬/파이프라인)
cosign verify registry.example.com/api@sha256:4f1c... \
  --certificate-identity-regexp 'https://github.com/example/.*' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
```

### 8.2 SLSA와 다이제스트 고정

**SLSA**(Supply-chain Levels for Software Artifacts)는 레벨 1~4로 빌드 무결성을 단계화한다. 실무 목표는 보통 L3(격리된 CI에서 호스팅 빌드, 서명된 provenance)다. 태그가 아닌 **다이제스트로 고정**하고, admission에서 검증해야 서명이 실효를 가진다.

---

## 9. 런타임(Runtime) 보안

정적 정책이 "무엇을 배포할 수 있는가"를 통제한다면, 런타임 보안은 "실행 중 무엇을 하는가"를 탐지·차단한다.

- **Falco**: eBPF/커널 모듈로 시스템 콜을 관찰해 셸 실행, 민감 파일 접근, 컨테이너 내 패키지 설치 등을 탐지. 탐지 결과를 Slack/Alertmanager로 라우팅한다.
- **seccomp**: `RuntimeDefault`로 이미 수백 개 syscall을 차단한다. 더 강하게는 `Localhost` 프로파일을 노드에 배포하고 `profiles` 목록으로 관리한다.
- **rootless / user namespace**: 컨테이너 런타임(containerd, Podman)을 rootless로 구동하고 `usernsMode`를 지원하는 CNI와 함께 쓰면 컨테이너 탈출 시 피해를 줄인다.
- **강화 런타임**: gVisor, Kata Containers로 커널을 격리한다(성능 비용 존재).
- 함께 적용: `readOnlyRootFilesystem: true` + `emptyDir`로 필요한 경로만 마운트, `capabilities.drop: [ALL]`, AppArmor 프로파일.

```yaml
# Falco 커스텀 룰: 컨테이너 내 셸 실행 탐지
- rule: Terminal shell in container
  desc: 컨테이너에서 대화형 셸이 실행됨
  condition: >
    spawned_process and container and
    proc.name in (bash, sh, zsh) and
    not proc.pname in (cron, supervisord) and
    k8s.ns.name != kube-system
  output: >
    셸 실행 (user=%user.name pod=%k8s.pod.name ns=%k8s.ns.name cmd=%proc.cmdline)
  priority: WARNING
  tags: [container, shell]
```

---

## 10. 감사 로그(Audit Log)와 etcd 암호화

감사 로그는 "누가, 언제, 어떤 리소스에, 어떤 요청을 했는가"를 남긴다. apiserver 플래그로 정책을 지정한다.

### 10.1 감사 정책

```yaml
# /etc/kubernetes/audit/policy.yaml
apiVersion: audit.k8s.io/v1
kind: Policy
omitStages: ["RequestReceived"]
rules:
  # 시크릿·exec 은 요청 본문까지 기록(민감하지만 사고 조사에 필수)
  - level: RequestResponse
    resources:
      - group: ""
        resources: ["secrets", "pods/exec", "pods/portforward"]
  - level: Metadata
    resources:
      - group: ""
        resources: ["pods", "configmaps", "serviceaccounts"]
  - level: None
    users: ["system:kube-proxy"]
    verbs: ["watch"]
  - level: Metadata
    omitStages: ["RequestReceived"]
```

### 10.2 etcd 암호화와 데이터 재작성

```yaml
# etcd 암호화: kms v2 (권장) / aescbc (대안)
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources: ["secrets"]
    providers:
      - kms:
          apiVersion: v2
          name: eks-kms
          endpoint: unix:///var/run/kmsplugin/socket.sock
          timeout: 3s
      - identity: {}   # 기존 평문 데이터 읽기 호환용(마지막에 위치)
```

```hcl
# Terraform: EKS envelope encryption + 감사 로그 활성화
resource "aws_eks_cluster" "main" {
  name     = "prod"
  role_arn = aws_iam_role.eks.arn

  encryption_config {
    resources = ["secrets"]
    provider {
      key_arn = aws_kms_key.eks.arn
    }
  }

  enabled_cluster_log_types = [
    "api", "audit", "authenticator", "controllerManager", "scheduler"
  ]

  vpc_config {
    subnet_ids              = var.private_subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = false
  }
}
```

`kms` 프로바이더를 활성화하면 기존 평문 데이터는 재작성(rewrite)이 필요하다: `kubectl get secrets --all-namespaces -o json | kubectl replace -f -`. 감사 로그는 반드시 별도 저장소로 전송하고 보존 기간을 정의한다.

---

## 11. 흔한 에러 → 원인 → 해결

| 에러 메시지 | 원인 | 해결 |
| :--- | :--- | :--- |
| `pods is forbidden: User "..." cannot get resource "pods"` | RBAC Role/Binding 누락 | `kubectl auth can-i`로 실측 후 최소 Role 추가 |
| `container has runAsNonRoot and image will run as root` | 이미지 USER가 root인데 `runAsNonRoot: true` | Dockerfile에 `USER 10001` 추가 또는 `runAsUser` 지정 |
| `violates PodSecurity "restricted": allowPrivilegeEscalation != false` | PSS restricted 미충족 | securityContext 보완, 필요 시 해당 ns만 baseline 적용 |
| `error looking up service account prod/x` | SA 또는 토큰 마운트 문제 | SA 존재 확인, `automountServiceAccountToken` 점검 |
| `x509: certificate signed by unknown authority` | 잘못된 kubeconfig CA | `--certificate-authority` 경로 재확인 |
| `context deadline exceeded` (admission webhook) | 정책 엔진 다운으로 `failurePolicy: Fail` | replica 증설, `namespaceSelector`로 시스템 ns 제외 |
| NetworkPolicy 적용 후 `CrashLoopBackOff` | 이그레스 기본 거부로 DNS 차단 | kube-system:53 UDP/TCP 예외 규칙 추가 |
| 이미지 풀은 되는데 서명 검증 실패 | 태그 불일치 또는 신원 조건 오타 | 다이제스트 고정 + `--certificate-identity-regexp` 확인 |

---

## 12. 실무 체크리스트

- [ ] 사람 사용자는 OIDC로 인증하고, x509 장기 자격증명과 `cluster-admin` ClusterRoleBinding을 제거했는가?
- [ ] RBAC에 `*` 와일드카드와 불필요한 `secrets`/`pods/exec` 권한이 없는가? `kubectl auth can-i --list`로 주기 감사하는가?
- [ ] 모든 워크로드가 전용 ServiceAccount를 사용하고, 토큰이 불필요하면 `automountServiceAccountToken: false`인가?
- [ ] 네임스페이스에 PSS `restricted`(또는 최소 `baseline`)가 enforce되고, 모든 컨테이너에 seccomp `RuntimeDefault` + `drop: [ALL]`이 적용됐는가?
- [ ] NetworkPolicy 기본 거부가 모든 네임스페이스에 적용되고, CNI가 실제로 정책을 강제하는지 검증했는가?
- [ ] Secret이 etcd에 암호화(KMS/envelope)되어 있고, 외부 시크릿 저장소(ESO/Vault/SOPS)로 평문이 Git에 남지 않는가?
- [ ] CI에서 Trivy/Grype 스캔이 HIGH/CRITICAL에서 실패하고, cosign 서명·SBOM 검증이 admission에서 강제되는가?
- [ ] 이미지가 태그가 아닌 다이제스트로 고정되며, 신뢰 레지스트리만 허용되는가?
- [ ] Falco 등 런타임 탐지가 배포되고 알림이 온콜 채널로 연결되어 있는가?
- [ ] 감사 로그가 `RequestResponse` 수준으로 시크릿/exec를 기록하고 별도 저장소에 보존되며, 정책 엔진 웹훅 장애 시 대응 절차가 문서화되어 있는가?

---

## 13. 정리

- **계층으로 나눠 방어한다.** 4C(Cloud → Cluster → Container → Code) 순으로 점검하고, 기본 거부와 심층 방어를 전제로 설계한다.
- **인증은 사람과 워크로드를 분리한다.** 사람은 OIDC, 워크로드는 바운드 토큰(ServiceAccount)을 쓰고, RBAC은 와일드카드 없이 필요한 서브리소스만 허용한다.
- **어드미션은 마지막 게이트다.** Mutating → Validating 순서로 동작하며, VAP(CEL)와 Kyverno/Gatekeeper로 정책을 강제하되 웹훅 장애가 배포 중단으로 번지지 않게 격리한다.
- **워크로드와 시크릿을 조인다.** PSS restricted·NetworkPolicy 기본 거부로 실행 환경을 좁히고, Secret은 etcd 암호화 + 외부 저장소로 외부화한다.
- **공급망은 배포 시점에 강제한다.** 스캔·SBOM·cosign 서명을 CI에 두고, 다이제스트 고정 + 어드미션 검증으로 실효를 만든 뒤 런타임 탐지와 감사 로그로 마무리한다.

---

## References

- Kubernetes Documentation — [Authenticating](https://kubernetes.io/docs/reference/access-authn-authz/authentication/)
- Kubernetes Documentation — [Using RBAC Authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
- Kubernetes Documentation — [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
- Kubernetes Documentation — [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
- Kubernetes Documentation — [Encrypting Confidential Data at Rest](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)
- Kubernetes Documentation — [Auditing](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/)
