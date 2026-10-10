---
layout: single
title: "IaC와 GitOps: Terraform·Helm·Argo CD·CI/CD"
excerpt: "인프라를 코드로 정의하고(IaC) 그 코드를 단일 진실 공급원으로 삼아 클러스터 상태를 지속적으로 수렴시키는(GitOps) 흐름을 정리한다. Terraform의 state·plan·apply, Helm/Kustomize 선택 기준, Argo CD·Flux의 드리프트 감지, CI/CD 파이프라인과 릴리스 전략을 실전 함정 중심으로 다룬다."
categories: [cloud]
tags: [iac, gitops, terraform, helm, kustomize, argocd, flux, cicd, 정리]
toc: true
toc_sticky: true
sidebar_main: true

date: 2026-07-18
last_modified_at: 2026-10-10
---

이 시리즈는 쿠버네티스와 클라우드(AWS·GCP·Azure 공통 개념)를 실무 관점에서 정리한 기록이다. 핵심 개념·코드 예제·실전 함정(gotcha) 중심으로, 학습과 설계 리뷰·장애 대응에 바로 쓸 수 있게 구성했다. 각 편은 독립적으로 읽을 수 있고, 순서대로 보면 클러스터 내부 구조에서 클라우드 운영까지 하나의 흐름으로 이어진다.

이번 편에서는 인프라를 코드로 정의하고(IaC), 그 코드를 단일 진실 공급원(single source of truth)으로 삼아 클러스터 상태를 지속적으로 수렴시키는(GitOps) 전체 흐름을 다룬다. Terraform으로 클라우드 리소스를, Helm·Kustomize로 쿠버네티스 워크로드를 선언하고, Argo CD·Flux가 Git과 클러스터의 차이를 감지·복구하며, CI 파이프라인이 이미지를 빌드해 매니페스트를 갱신하는 순환 구조를 이해하는 것이 목표다. 클라우드의 기본 경계(리전·VPC·IAM·관리형 DB)가 필요하면 [클라우드 기초](https://ingu627.github.io/cloud/cloud-fundamentals/)를 먼저 보고, 권한·정책 자동화는 다음 편인 [클라우드 보안과 거버넌스](https://ingu627.github.io/cloud/cloud-security-governance/)에서 이어서 정리한다.

- IaC의 네 가지 가치와 수동 변경(hotfix) 함정을 확인한다
- Terraform의 state·plan·apply 워크플로와 원격 백엔드, 모듈 버전 고정 기준을 세운다
- Helm과 Kustomize의 선택 기준, Argo CD·Flux의 드리프트 감지를 비교한다
- CI(빌드·스캔·bump)와 CD(GitOps 컨트롤러)의 책임 분리, 이미지 태그 고정 원칙을 정리한다
- 릴리스 전략(Rolling/Blue-Green/Canary)과 실전 함정·체크리스트를 정리한다

---

## 1. IaC(Infrastructure as Code) 개념

IaC는 서버·네트워크·권한 같은 인프라를 콘솔 클릭이나 수동 명령이 아니라 버전 관리되는 코드로 정의하는 방식이다. 핵심 가치는 다음 네 가지다.

### 1.1 네 가지 핵심 가치

- **재현성(reproducibility)**: 동일 코드로 동일 환경을 몇 번이든 다시 만들 수 있다. 재해 복구(DR)와 신규 리전 확장이 "복사-붙여넣기"가 아니라 "apply 한 번"이 된다.
- **리뷰 가능성(reviewability)**: 변경이 PR(Pull Request)로 들어오므로 승인·이력·롤백이 모두 Git 히스토리에 남는다. "지난주에 누가 보안 그룹을 열었나"에 즉시 답할 수 있다.
- **드리프트(drift) 감지**: 코드와 실제 상태가 벌어진 정도를 도구가 계산해 보여준다.
- **멱등성(idempotency)**: 같은 코드를 여러 번 실행해도 결과가 같다. 선언적(declarative) 도구는 "원하는 최종 상태"를 기술하고, 절차적(imperative) 스크립트는 "명령 순서"를 기술한다. 실무에서는 선언적 도구를 기본으로 두고, 불가피한 일회성 작업만 절차적으로 처리한다.

### 1.2 함정

- **수동 변경(hotfix)이 최악의 적이다.** 급한 장애 복구로 콘솔에서 직접 고친 뒤 코드에 반영하지 않으면 다음 apply에서 되돌아가거나, 더 나쁘게는 리소스가 중복 생성된다. 수동 변경은 반드시 같은 날 코드로 역류(backport)시킨다.
- **비밀값(secret)을 state나 Git에 평문 커밋.** Terraform state에는 비밀번호가 평문으로 들어간다. state 버킷 암호화·접근 제어는 필수이고, Git에는 SOPS/Sealed Secrets/External Secrets를 쓴다.

---

## 2. Terraform

Terraform은 클라우드 리소스를 HCL(HashiCorp Configuration Language)로 선언하는 대표적인 IaC 도구다. 워크플로·state·모듈이라는 세 축으로 이해하면 나머지는 부속이다.

![Terraform state·plan·apply와 워크스페이스 구조](/assets/images/cloud/terraform-workflow.png)

위 다이어그램은 Terraform이 코드를 읽어 원격 백엔드의 state와 비교하고(plan), 승인된 plan을 실제 API 호출로 반영하며(apply), 환경·레이어별로 state를 분리해 블라스트 반경을 줄이는 구조를 보여준다.

### 2.1 기본 워크플로: init / plan / apply

`init`은 provider·모듈·백엔드를 내려받고, `plan`은 변경 계획을 만들며, `apply`가 실행한다. CI에서는 `plan` 산출물을 아티팩트로 남기고 사람이 검토한 뒤 동일한 plan 파일을 `apply`하는 것이 정석이다.

```bash
# 백엔드 초기화 및 락 테이블/버킷은 사전에 별도 부트스트랩으로 생성
export TF_IN_AUTOMATION=1
terraform init -input=false -upgrade
terraform validate
terraform plan -input=false -lock-timeout=5m -out=tfplan
# 리뷰 승인 후, plan 파일을 그대로 적용(재계획으로 인한 드리프트 방지)
terraform apply -input=false -auto-approve tfplan
```

### 2.2 State와 원격 백엔드(remote backend)

state는 "코드 ↔ 실제 리소스" 매핑 테이블이다. 로컬 파일로 두면 팀 협업이 불가능하므로 원격 백엔드 + 락(lock)을 쓴다.

```hcl
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.60"
    }
  }
  backend "s3" {
    bucket         = "acme-tfstate-apne2"
    key            = "prod/network/terraform.tfstate"
    region         = "ap-northeast-2"
    dynamodb_table = "acme-tfstate-lock" # 상태 락
    encrypt        = true
  }
}
```

블라스트 반경(blast radius)을 줄이려면 state를 환경·레이어별로 쪼갠다. 예: `prod/network`, `prod/eks`, `prod/data`. 한 state에 전부 넣으면 무관한 변경이 예기치 않은 리소스를 재생성한다.

### 2.3 모듈(module)과 provider

모듈은 재사용 가능한 리소스 묶음이다. 버전을 고정(`version`)하지 않으면 상류 저장소의 변경이 어느 날 운영을 깨뜨린다.

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.8.1"

  name = "prod-vpc"
  cidr = "10.0.0.0/16"
  azs  = ["ap-northeast-2a", "ap-northeast-2c"]

  private_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets   = ["10.0.101.0/24", "10.0.102.0/24"]
  enable_nat_gateway = true
  single_nat_gateway = false # prod는 AZ별 NAT로 가용성 확보

  tags = { Environment = "prod", ManagedBy = "terraform" }
}
```

provider는 리전·계정을 `alias`로 나눠 다중 리전/다중 계정 배포를 처리한다. `default_tags`를 쓰면 태그 누락을 구조적으로 막을 수 있다.

### 2.4 흔한 에러 → 원인 → 해결

| 에러 | 원인 | 해결 |
| :--- | :--- | :--- |
| `Error acquiring the state lock` | 이전 실행이 비정상 종료되어 락이 남음 | 실행자가 죽었는지 확인 후 `terraform force-unlock <ID>` |
| `Error: Resource already exists` | 콘솔/CLI로 만든 리소스가 이미 존재 | `terraform import`로 state에 편입, 이후 코드로 관리 |
| plan이 매번 리소스를 교체하려 함 | `ignore_changes` 대상 필드가 외부에서 변경됨 | `lifecycle { ignore_changes = [...] }` 또는 실제 원인 제거 |
| `Invalid provider version constraint` | lock 파일/모듈 요구 버전 충돌 | `.terraform.lock.hcl` 커밋, `terraform init -upgrade`로 해소 |

### 2.5 대안: Terragrunt / Pulumi / CDK

| 도구 | 접근 | 강점 | 약점 |
| :--- | :--- | :--- | :--- |
| Terraform | HCL, 선언적 | 생태계·provider 최대 | 반복 코드, state 관리 부담 |
| Terragrunt | Terraform 래퍼 | DRY 계층 구성, 백엔드/의존성 자동화 | 학습 곡선, 추상화 누수 |
| Pulumi | TS/Python/Go | 실제 언어, 단위 테스트·타입 | 언어 런타임 의존, provider 성숙도 편차 |
| CDK (CDKTF/AWS CDK) | 언어 + 합성 | 익숙한 언어, 고수준 추상화 | 생성된 코드 디버깅 난이도 |

여러 환경·계정을 반복 구성한다면 Terragrunt가, 복잡한 로직·테스트가 필요하면 Pulumi가 유리하다.

---

## 3. Helm vs Kustomize

쿠버네티스 매니페스트를 환경별로 다루는 두 축이 Helm(템플릿 + values)과 Kustomize(패치 오버레이)다. 둘은 경쟁 관계라기보다 계층이 다르다.

### 3.1 Helm 차트(chart) 구조

```javascript
mychart/
├── Chart.yaml          # 이름/버전/appVersion
├── values.yaml         # 기본 값
├── templates/
│   ├── _helpers.tpl     # 이름/라벨 매크로
│   ├── deployment.yaml
│   └── service.yaml
└── charts/             # 의존 차트
```

```yaml
{% raw %}
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "mychart.fullname" . }}
  labels: {{- include "mychart.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels: {{- include "mychart.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels: {{- include "mychart.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: app
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          ports:
            - containerPort: {{ .Values.service.port }}
          resources: {{- toYaml .Values.resources | nindent 12 }}
{% endraw %}
```

```bash
helm lint ./mychart
helm template myapp ./mychart -f values/prod.yaml | kubeconform -strict -
helm upgrade --install myapp ./mychart -n prod --create-namespace \
  -f values/prod.yaml --atomic --timeout 5m
helm diff upgrade myapp ./mychart -f values/prod.yaml   # helm-diff 플러그인
```

`--atomic`은 실패 시 자동 롤백한다. 운영에서는 `helm upgrade` 대신 GitOps 컨트롤러가 Helm을 렌더링하도록 두는 편이 드리프트에 강하다.

### 3.2 Kustomize base/overlay

```yaml
# base/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources: [deployment.yaml, service.yaml]

---
# overlays/prod/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: prod
resources: [../../base]
images:
  - name: myapp
    newName: 123456789012.dkr.ecr.ap-northeast-2.amazonaws.com/myapp
    newTag: "a1b2c3d"
replicas:
  - name: myapp
    count: 6
patches:
  - path: patch-resources.yaml
    target: { kind: Deployment, name: myapp }
```

### 3.3 선택 기준

| 기준 | Helm | Kustomize |
| :--- | :--- | :--- |
| 단위 | 템플릿 + values | 패치 오버레이 |
| 외부 차트 소비 | 강함(Artifact Hub) | 약함(렌더 후 패치) |
| 학습 비용 | Go template·nindent 함정 | 낮음, kubectl 내장 |
| 조건부 분기 | 풍부하나 복잡 | 제한적 |
| 권장 조합 | Helm으로 패키징 → Kustomize/Argo CD로 환경 오버레이 | |

표의 우열 표기는 각 도구 공식 문서의 기능 서술을 정리한 것으로, 독립 벤치마크 결과가 아니다. "학습 비용" 같은 항목은 팀의 Go template 숙련도에 따라 달라진다.

### 3.4 함정

- **Helm 렌더 결과를 커밋하지 않는다.** 렌더 결과(`helm template`)를 Git에 넣으면 소스와 산출물이 이중 관리된다. Argo CD가 렌더링하도록 `repoURL + chart` 또는 `chart` 소스를 쓴다.
- **Kustomize `images.newTag`를 수동 편집하지 않는다.** CI가 태그를 갱신해야 하며, `name: myapp`은 base의 이미지 이름과 정확히 일치해야 치환된다.

---

## 4. GitOps 원칙과 드리프트 감지

GitOps는 "Git을 단일 진실 공급원으로 두고, 에이전트가 클러스터를 그 상태로 계속 수렴시킨다"는 운영 모델이다.

![IaC와 GitOps 전체 흐름](/assets/images/cloud/iac-gitops-flow.png)

위 다이어그램은 애플리케이션 저장소에서 CI가 이미지를 빌드·스캔·테스트하고 매니페스트 태그를 커밋하면, CD(Argo CD)가 Git을 읽어 클러스터에 sync하고 다시 라이브 상태와 비교하는 순환 루프를 보여준다. 사람은 Git에 PR을 올릴 뿐 클러스터에 `kubectl apply`를 치지 않는다.

GitOps는 도구 제공 진영이 아니라 CNCF OpenGitOps 워킹그룹이 정리한 네 가지 원칙으로 정의된다.

1. **선언적 기술**: 시스템 전체 상태를 선언적으로 표현한다.
2. **버전 관리 + 불변 이력**: Git이 유일한 진실 공급원이며, 배포 이력은 커밋 이력이다.
3. **자동 적용**: 승인된 변경은 사람이 `kubectl`을 치지 않아도 클러스터에 반영된다.
4. **지속적 조정(continuous reconciliation)**: 에이전트가 주기적으로 원하는 상태와 실제 상태를 비교해 수렴시킨다.

드리프트 감지는 "desired(Git 렌더 결과) vs live(클러스터)"의 diff다. 감지 결과는 세 갈래로 처리한다.

- **자동 복구(selfHeal)**: `kubectl edit` 같은 즉흥 변경을 되돌린다. 운영에서는 기본 켜기를 권장한다.
- **경보만**: 규제 환경에서 변경 자체를 관찰하려면 알림만 보낸다.
- **무시 대상 등록**: HPA가 조정하는 `replicas`, webhook이 주입하는 사이드카 등은 무시 규칙에 넣는다. 이걸 안 하면 Argo CD가 영원히 `OutOfSync`로 표시된다.

풀(pull) 모델은 클러스터 내 컨트롤러가 Git을 읽으므로 외부에서 클러스터 API 접근이 필요 없다. 푸시(push) 모델(`kubectl apply` in CI)은 자격 증명이 CI에 남고, 클러스터가 닫힌 망에 있으면 아예 성립하지 않는다. 그래서 폐쇄망·규제 환경일수록 pull 모델이 더 적합하다.

---

## 5. Argo CD

Argo CD(ArgoCD)는 클러스터 안에 상주하며 Git을 watch하고, Application 단위로 sync 상태를 관리하는 GitOps 컨트롤러다.

### 5.1 Application

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp-prod
  namespace: argocd
  finalizers: [resources-finalizer.argocd.argoproj.io]  # 삭제 시 자식 리소스 정리
spec:
  project: prod-team
  source:
    repoURL: https://github.com/acme/gitops-manifests.git
    targetRevision: main
    path: apps/myapp/overlays/prod
  destination:
    server: https://kubernetes.default.svc
    namespace: prod
  syncPolicy:
    automated:
      prune: true      # Git에서 사라진 리소스 삭제
      selfHeal: true   # 라이브 드리프트 자동 복구
    syncOptions:
      - CreateNamespace=true
      - ServerSideApply=true
      - ApplyOutOfSyncOnly=true
    retry:
      limit: 5
      backoff: { duration: 5s, factor: 2, maxDuration: 3m }
```

### 5.2 ApplicationSet

클러스터/환경이 늘어날 때 Application을 손으로 복제하지 않고 생성기(generator)로 찍어낸다.

```yaml
{% raw %}
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: cluster-addons
  namespace: argocd
spec:
  generators:
    - clusters:
        selector:
          matchLabels: { env: prod }
  template:
    metadata:
      name: '{{name}}-metrics-server'
    spec:
      project: default
      source:
        repoURL: https://github.com/acme/gitops-manifests.git
        targetRevision: main
        path: addons/metrics-server
      destination:
        server: '{{server}}'
        namespace: kube-system
      syncPolicy:
        automated: { prune: true, selfHeal: true }
{% endraw %}
```

`clusters` 생성기 외에 `list`, `git`(디렉터리 스캔), `matrix`/`merge`(조합) 생성기를 쓴다. `git` files 생성기로 디렉터리별 Application을 자동 생성하면 신규 서비스 온보딩이 "디렉터리 추가"로 끝난다.

### 5.3 App of Apps

루트 Application이 `apps/` 디렉터리의 Application 매니페스트들을 관리하는 패턴이다. 루트 하나만 부트스트랩하면 나머지가 연쇄 생성된다. 단, `prune`이 켜진 루트는 실수 한 번에 하위 Application 전체를 지울 수 있으므로 루트에는 `prune: false`를 두는 경우가 많다.

### 5.4 흔한 에러 → 원인 → 해결

| 증상 | 원인 | 해결 |
| :--- | :--- | :--- |
| 계속 `OutOfSync`(HPA 대상) | HPA가 `replicas`를 바꿈 | `ignoreDifferences`에 `/spec/replicas` 추가 |
| `ComparisonError: Failed to load target state` | 차트 버전 미지정/Repo 인증 만료 | `targetRevision` 고정, Repository 자격 증명 갱신 |
| `Sync failed: CRD not found` | CRD 적용 순서 문제 | `sync-wave` 어노테이션으로 CRD를 `-1`로 먼저 적용 |
| 삭제했는데 리소스가 남음 | finalizer/prune 미설정 | `prune: true`, 전파 정책(`PrunePropagationPolicy=foreground`) 확인 |

---

## 6. Flux 개요

Flux는 GitOps 툴킷을 컨트롤러 집합으로 분해한 구조다. `source-controller`(Git/Helm/OOCI 수집), `kustomize-controller`(렌더·적용), `helm-controller`(Helm 릴리스), `notification-controller`(이벤트·알림), `image-reflector/automation`(이미지 태그 자동 반영)이 각각 CRD를 관리한다.

![Flux GitOps Toolkit 컨트롤러 구조 — source·kustomize·helm·notification 컨트롤러가 각각 CRD를 watch하고 클러스터 상태를 수렴시킨다](/assets/images/cloud/official-flux-gitops-toolkit.webp)

출처: GitOps Toolkit Components — Flux (https://fluxcd.io/flux/components/)

```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata: { name: gitops, namespace: flux-system }
spec:
  interval: 1m
  url: https://github.com/acme/gitops-manifests
  ref: { branch: main }
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata: { name: apps, namespace: flux-system }
spec:
  interval: 10m
  path: ./apps/prod
  prune: true
  sourceRef: { kind: GitRepository, name: gitops }
  wait: true
  timeout: 5m
```

| 항목 | ArgoCD | Flux |
| :--- | :--- | :--- |
| UI/가시성 | 웹 UI·앱 트리 제공 | CLI 중심, Weave GitOps 등 별도 |
| 아키텍처 | 중앙 서버 + 단일 Application | 다중 컨트롤러 + 다중 CRD |
| 멀티테넌시 | AppProject·RBAC | 네임스페이스별 Kustomization |
| 이미지 자동 갱신 | ArgoCD Image Updater | image-automation 내장 |
| 적합 | 플랫폼 팀·다수 앱 | 컨트롤러 조합·OOCI 중심 |

두 도구의 비교는 각 프로젝트 공식 문서의 기능 서술을 정리한 것으로, 제3자 벤치마크가 아니라 프로젝트 진영의 자체 설명이다. "적합" 행 역시 절대 기준이 아니며, UI 필요성·멀티테넌시 요구·이미 OCI 저장소를 쓰는지에 따라 선택이 갈린다.

---

## 7. CI/CD 파이프라인 설계

GitOps에서 CI와 CD의 책임은 분리된다. **CI는 이미지를 빌드·서명하고 매니페스트의 이미지 태그를 커밋**할 뿐이며, 클러스터 반영은 컨트롤러가 한다. CI에 클러스터 자격 증명을 두지 않는 것이 핵심 보안 이점이다.

```yaml
{% raw %}
name: build-and-bump
on:
  push:
    branches: [main]
permissions:
  contents: write
  id-token: write   # OIDC 키리스 인증
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/gha-ecr-push
          aws-region: ap-northeast-2
      - uses: docker/login-action@v3
        with:
          registry: 123456789012.dkr.ecr.ap-northeast-2.amazonaws.com
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: 123456789012.dkr.ecr.ap-northeast-2.amazonaws.com/myapp:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          provenance: true
          sbom: true
      - name: Bump manifest tag
        run: |
          git config user.name  "ci-bot"
          git config user.email "ci-bot@users.noreply.github.com"
          cd gitops
          yq -i '.images[0].newTag = strenv(GITHUB_SHA)' overlays/prod/kustomization.yaml
          git commit -am "chore(prod): myapp ${GITHUB_SHA:0:7}" && git push
{% endraw %}
```

태그는 `latest`가 아니라 커밋 SHA 또는 이미지 다이제스트(`@sha256:...`)로 고정한다. 그래야 롤백이 "어떤 이미지로 되돌릴지"가 아니라 "어떤 커밋으로 되돌릴지"로 명확해진다.

### 7.1 컨테이너 이미지 빌드(멀티스테이지·캐시)

```docker
# syntax=docker/dockerfile:1.7
FROM golang:1.22-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download
COPY . .
RUN --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/app ./cmd/app

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=builder /out/app /app
USER nonroot:nonroot
ENTRYPOINT ["/app"]
```

캐시가 깨지는 전형적 원인은 **`COPY . .`을 의존성 설치보다 먼저 두는 것**이다. 소스 한 줄만 바뀌어도 `go mod download` 레이어가 무효화된다. 레이어 순서를 "변경이 적은 것 → 많은 것"으로 배치하고, BuildKit `RUN --mount=type=cache`와 GHA/registry 캐시를 병행한다.

최종 이미지는 distroless로 줄인다. distroless `static-debian12` 베이스는 셸·패키지 관리자·일반 배포판 유틸리티를 담지 않으므로, 같은 바이너리를 `debian`/`alpine` 베이스에 올린 이미지보다 크기가 작고 공격 표면(쉘 탈출에 쓸 실행 파일)도 줄어든다. 대신 트레이드오프가 있다. 컨테이너 안에 셸이 없어 `kubectl exec -it ... sh`로 들어갈 수 없고, 장애 분석은 `kubectl debug`의 임시(ephemeral) 컨테이너에 의존해야 한다. 이미지 크기·공격 표면 감소는 베이스 이미지 구성에서 오는 정성적 이점이며, 절감 폭은 바이너리와 기존 베이스에 따라 달라 직접 측정해 확인하는 편이 좋다.

### 7.2 레지스트리

- **ECR / GAR / ACR**: OIDC 기반 키리스 인증, 리포지토리별 수명주기 정책(오래된 태그 자동 삭제)을 설정한다.
- **불변 태그(immutable tag)**: 같은 태그 덮어쓰기를 막아 "이미지가 조용히 바뀌는" 사고를 차단한다.
- **공급망 보안**: SBOM 생성, `cosign` 서명, 배포 시 서명 검증(admission policy), 취약점 스캔(Trivy/Grype)을 파이프라인 게이트로 둔다.

---

## 8. 릴리스 전략

| 전략 | 롤백 속도 | 리소스 비용 | 검증 정밀도 | 적합한 경우 |
| :--- | :--- | :--- | :--- | :--- |
| Rolling | 보통(재배포) | 1x(서지(surge) 포함) | 낮음 | 일반 무상태 서비스 |
| Blue-Green | 즉시(트래픽 스위치) | 2x | 중간 | DB 스키마 호환성 이슈 |
| Canary | 빠름 | 1x + α | 높음(메트릭 기반) | 트래픽 민감·매출 직결 |

표의 리소스 비용은 상시 운영 파드를 1x로 둔 상대값이다. Rolling의 1x는 surge로 잠시 늘어나는 파드까지 포함한 값이고, Blue-Green의 2x는 두 버전을 동시에 유지하는 비용, Canary의 α는 분석·가중치용 추가 파드와 관측(메트릭·로그) 비용이다. "검증 정밀도"는 자동 분석 파이프라인을 붙였을 때를 전제로 한 값이라, analysis 없이 가중치만 올리는 카나리는 정밀도 이점이 거의 없다.

Argo Rollouts는 `Rollout` CRD로 단계적 가중치와 자동 분석(analysis)을 정의한다.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata: { name: myapp, namespace: prod }
spec:
  replicas: 10
  selector:
    matchLabels: { app: myapp }
  template:
    metadata:
      labels: { app: myapp }
    spec:
      containers:
        - name: app
          image: 123456789012.dkr.ecr.ap-northeast-2.amazonaws.com/myapp:v1.2.3
  strategy:
    canary:
      canaryService: myapp-canary
      stableService: myapp-stable
      trafficRouting:
        istio:
          virtualService: { name: myapp-vsvc, routes: [primary] }
      steps:
        - setWeight: 10
        - pause: { duration: 5m }
        - analysis:
            templates: [{ templateName: success-rate }]
        - setWeight: 50
        - pause: { duration: 10m }
```

```bash
kubectl argo rollouts get rollout myapp -n prod --watch
kubectl argo rollouts promote myapp -n prod        # 일시정지 수동 해제
kubectl argo rollouts abort   myapp -n prod        # 즉시 중단·안정 버전 복귀
```

Flagger는 서비스 메시/인그레스와 결합해 트래픽 가중치를 자동 조정하고, 프로메테우스 메트릭 기반으로 실패 시 자동 롤백한다. 두 도구의 차이는 "누가 단계를 진행하나"에 있다(양쪽 공식 문서 서술 기준). Argo Rollouts는 단계 정의 + 수동/자동 promote, Flagger는 메트릭 임계값 기반 자동 진행에 강하다. 실제로는 어느 쪽이든 `successCondition`·최소 표본 수를 잘못 잡으면 자동 판정이 무의미해지므로, 도구 선택보다 분석 지표 설계가 먼저다.

### 8.1 실전 함정

- **분석(analysis)이 항상 성공한다.** 메트릭 쿼리가 "데이터 없음"을 성공으로 해석하면 카나리는 조용히 전체 배포된다. `failureLimit`·`successCondition`을 명시하고, 최소 표본 수를 요구한다.
- **프로브(probe) 없는 카나리.** readiness/liveness가 없으면 새 버전이 실제로 준비되기 전에 트래픽을 받는다. 트래픽 전환 전 `pause`와 readiness gate를 함께 둔다.
- **동시 배포.** 두 파이프라인이 같은 Application을 동시에 갱신하면 sync 충돌이 난다. 환경별 동시성 그룹(concurrency group)과 `argocd app wait` 기반 게이트를 둔다.

---

## 9. 실무 체크리스트

- [ ] state 백엔드(S3/GCS/Blob)에 암호화·버전 관리·락이 설정되어 있고, state 버킷 접근 권한이 최소 권한으로 제한되어 있는가.
- [ ] `.terraform.lock.hcl`이 커밋되어 provider 버전이 재현 가능한가. 모듈 버전이 모두 고정(`version =`)되어 있는가.
- [ ] state를 환경·레이어 단위로 분리해 블라스트 반경을 제한했는가.
- [ ] 모든 매니페스트가 Git에만 존재하고, 운영 클러스터에 수동 `kubectl apply`가 발생하지 않는가.
- [ ] Argo CD/Flux의 `selfHeal`(자동 복구)이 켜져 있고, HPA·사이드카 주입 등 의도된 변동은 `ignoreDifferences`에 등록되어 있는가.
- [ ] 이미지 태그가 커밋 SHA 또는 다이제스트로 고정되어 있고, ECR/GAR에 불변 태그 정책이 적용되어 있는가.
- [ ] Dockerfile이 멀티스테이지·비루트 사용자·distroless 기반이며, 레이어 순서와 캐시 마운트로 빌드 시간이 최적화되어 있는가.
- [ ] CI가 OIDC 키리스 인증을 사용하고, 클러스터 자격 증명이 CI에 저장되어 있지 않은가.
- [ ] Argo Rollouts/Flagger의 분석 단계에 `successCondition`·`failureLimit`·최소 표본 수가 명시되어 있는가.
- [ ] 배포 알림(실패·드리프트·롤백)이 슬랙/온콜로 연결되어 있고, 롤백 절차가 문서화·훈련되어 있는가.
- [ ] 비밀값이 Git 평문으로 존재하지 않고 SOPS/Sealed Secrets/External Secrets로 관리되는가.

---

## 10. 정리

- **코드가 진실이다.** 수동 변경은 반드시 코드로 역류시키고, 비밀값은 state·Git에 평문으로 두지 않는다.
- **state는 원격에 격리한다.** 원격 백엔드 + 락으로 협업하고, 환경·레이어별로 쪼개 블라스트 반경을 줄인다.
- **패키징과 오버레이를 분리한다.** Helm으로 패키징하고, Kustomize/Argo CD로 환경 오버레이를 얹는다.
- **CI와 CD의 책임을 나눈다.** CI는 이미지를 빌드·서명하고 태그만 커밋하며, CD는 컨트롤러가 Git에서 클러스터로 수렴시킨다.
- **자동 복구와 무시 규칙을 함께 둔다.** selfHeal을 기본으로 켜되 HPA·사이드카처럼 의도된 변동은 ignoreDifferences로 등록한다.

---

## References

도구의 동작·설정 서술은 아래 도구 공식 문서(도구 진영이 직접 쓴 문서)를 근거로 했고, GitOps의 정의·원칙과 선언적 관리 개념은 도구 중립 문서를 근거로 했다. 도구 비교 표의 우열 표기는 벤더 문서의 기능 서술이므로 독립 검증 결과가 아니다.

**도구 중립·독립 문서**

- OpenGitOps (CNCF) — [GitOps Principles (선언적·버전 관리·자동 적용·지속적 조정)](https://opengitops.dev/)
- Kubernetes — [Declarative Management of Kubernetes Objects Using Configuration Files](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/) (문서 라이선스 CC BY 4.0)
- Kubernetes — [Debugging with an ephemeral debug container (셸 없는 이미지 진단)](https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/) (문서 라이선스 CC BY 4.0)

**도구 공식 문서(벤더 문서)**

- HashiCorp Terraform — [Backend configuration: S3 (DynamoDB 락·암호화)](https://developer.hashicorp.com/terraform/language/backend/s3)
- HashiCorp Terraform — [Modules (버전 고정·재사용)](https://developer.hashicorp.com/terraform/language/modules)
- Argo CD — [Sync Options (prune·selfHeal·ServerSideApply)](https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/)
- Flux — [GitOps Toolkit Components (source/kustomize/helm controller)](https://fluxcd.io/flux/components/) (본문 도식: <https://fluxcd.io/img/diagrams/gitops-toolkit.png>)
- Helm — [Charts (템플릿·values·의존성)](https://helm.sh/docs/topics/charts/)
- Argo Rollouts — [Canary Strategy (가중치·analysis)](https://argo-rollouts.readthedocs.io/en/stable/features/canary/)
- Flagger — [How It Works (메트릭 기반 분석·자동 롤백)](https://docs.flagger.app/usage/how-it-works)
- GoogleContainerTools/distroless — [distroless 이미지 (셸·패키지 관리자 미포함)](https://github.com/GoogleContainerTools/distroless)
