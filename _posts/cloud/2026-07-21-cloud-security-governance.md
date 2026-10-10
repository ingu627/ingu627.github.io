---
layout: single
title: "클라우드 보안과 거버넌스: 조직·계정 경계와 정책 자동화"
excerpt: "클라우드 보안은 경계 방어가 아니라 신원·권한·데이터·감사 로그를 코드로 관리하는 문제다. 공동 책임 모델과 IAM 평가 로직, 멀티 계정 전략, 네트워크·데이터 보안, 컴플라이언스·탐지·사고 대응까지 AWS·Azure·GCP 공통 관점으로 정리한다."
categories: [cloud]
tags: [cloud, security, iam, governance, scp, zero-trust, 거버넌스, 보안, 정리]
toc: true
toc_sticky: true
sidebar_main: true

date: 2026-07-21
last_modified_at: 2026-10-10
---

이 시리즈는 쿠버네티스와 클라우드(AWS·GCP·Azure 공통 개념)를 실무 관점에서 정리한 기록이다. 핵심 개념·코드 예제·실전 함정(gotcha) 중심으로, 학습과 설계 리뷰·장애 대응에 바로 쓸 수 있게 구성했다. 각 편은 독립적으로 읽을 수 있고, 순서대로 보면 클러스터 내부 구조에서 클라우드 운영까지 하나의 흐름으로 이어진다.

클라우드 보안(Cloud Security)은 "경계 방어"가 아니라 신원(identity)·권한·데이터·감사 로그를 코드로 관리하는 문제로 바뀌었다. 이번 편에서는 AWS·Azure·GCP에 공통으로 적용되는 보안·거버넌스 모델을 정리하고, IAM 평가 로직·멀티 계정 전략·네트워크/데이터 보안·컴플라이언스·탐지·사고 대응(IR)까지 실무 순서대로 다룬다. 앞 편 [IaC와 GitOps](https://ingu627.github.io/cloud/iac-gitops/)에서 인프라를 코드로 선언하는 흐름을 세웠다면, 이번 편은 그 위에 정책 가드레일과 권한 경계를 얹는 방법을 다루고, 다음 편 [클라우드 비용 최적화(FinOps)](https://ingu627.github.io/cloud/cloud-finops/)에서 그 운영 비용을 단위 경제학으로 다시 본다. 각 절의 코드 예제는 그대로 복사해 검증 환경에서 실행할 수 있는 수준을 목표로 한다.

- 공동 책임 모델로 보안 경계를 어디에 그을지 판단 기준을 세운다
- IAM 정책 평가 로직과 권한 경계·최소 권한 설계 절차를 정리한다
- 계정(구독) 단위 격리와 랜딩 존·SCP 가드레일 구조를 세운다
- 네트워크·데이터 보안과 시크릿 주입 경로를 점검한다
- 컴플라이언스 증적 자동화·탐지·제로 트러스트·IR 플레이북을 정리한다

---

## 1. 공동 책임 모델과 보안 경계

공동 책임 모델(Shared Responsibility Model)은 "누가 무엇을 패치/암호화/감사하는가"를 정하는 계약이다. 클라우드 사업자는 **클라우드 자체의 보안(Security *of* the cloud)** — 데이터센터, 물리 보안, 하이퍼바이저, 관리형 서비스의 제어 플레인 — 을 책임지고, 고객은 **클라우드 안의 보안(Security *in* the cloud)** — 데이터 분류, 신원, 접근 제어, 구성, 워크로드 — 을 책임진다.

| 계층 | IaaS(EC2/VM) | PaaS(관리형 DB, AKS/EKS/GKE) | SaaS |
| :--- | :--- | :--- | :--- |
| 물리·호스트·하이퍼바이저 | CSP | CSP | CSP |
| OS 패치 / 런타임 | 고객 | CSP(관리형) / 고객(노드) | CSP |
| 제어 플레인(K8s API·etcd) | 고객 | CSP(관리형) / 고객(self-managed) | CSP |
| IAM·네트워크 정책·시크릿 | 고객 | 고객 | 공유 |
| 데이터 분류·암호화 키 정책·백업 | 고객 | 고객 | 고객 |

- **가장 흔한 오해**: "관리형이니 암호화·백업·접근 제어도 알아서 해준다". KMS 키 정책(Key Policy), 스냅샷 보존, IAM, 퍼블릭 노출은 끝까지 고객 책임이다.
- **경계를 명시적으로 문서화**한다: 서비스별로 "우리 책임/사업자 책임"을 표로 고정하고, 그 표를 감사 증적으로 쓴다(AWS Artifact, Azure Compliance, GCP Compliance Reports의 상속 통제(inherited control)와 매핑).
- 경계를 넘는 순간이 사고 지점이다. 예: 관리형 DB의 파라미터 그룹(parameter group) 공개 접근, S3 버킷 정책의 와일드카드 주체, AKS 노드 풀의 퍼블릭 LB 노출.

---

## 2. IAM 심화

### 2.1 정책 평가 로직

평가 순서를 모르면 "허용했는데 403"을 영원히 디버깅한다. AWS 계열의 모델은 다음과 같다.

1. **암묵적 거부(implicit deny)** — 명시적 허용이 없으면 항상 거부가 기본값이다.
2. **적용 대상 정책 수집** — 자격 증명 기반(identity-based), 리소스 기반(resource-based), 권한 경계(permissions boundary), 서비스 제어 정책(SCP), 세션 정책(session policy), VPC 엔드포인트 정책.
3. **명시적 거부(explicit deny) 우선** — 어느 한 정책에 `Deny`가 있으면 다른 모든 `Allow`를 무시하고 즉시 거부한다.
4. **유효 권한(effective permissions)** — 신원·경계·SCP·세션 정책의 **허용 교집합(intersection)** 이 실제 통과 범위다. 같은 계정에서 리소스 기반 정책의 허용은 합집합(union)처럼 동작하지만, 교차 계정(cross-account) 접근은 호출 계정의 신원 정책 허용과 대상 계정 리소스 정책 허용이 **둘 다** 필요하다.

정책 유형별 성격: SCP와 권한 경계는 **권한을 부여하지 않고 상한만 깎는다**. 관리 계정(management account)과 서비스 연결 역할(service-linked role)에는 SCP가 적용되지 않는다는 점도 설계 시 반드시 반영한다.

### 2.2 조건 키(Condition Keys)

조건 키는 "같은 API라도 어떤 컨텍스트에서 호출됐는가"를 강제하는 수단이다. 자주 쓰는 것만 정리하면:

| 조건 키 | 용도 | 실무 포인트 |
| :--- | :--- | :--- |
| `aws:SecureTransport` | HTTP 평문 차단 | S3·KMS 정책에서 `false` Deny |
| `aws:SourceVpce` | VPC 엔드포인트 경유 강제 | `aws:SourceIp`(사설 IP)로는 판별 불가 |
| `aws:PrincipalOrgID` | 조직 외부 공유 차단 | 리소스 정책에 `StringNotEquals` Deny |
| `aws:MultiFactorAuthPresent` | MFA 필수 | `BoolIfExists`로 사용 |
| `aws:RequestedRegion` | 리전 제한 | SCP에 조합 |
| `kms:ViaService` | 특정 서비스 경유 암호화만 허용 | 키 오남용 차단 |
| `aws:ResourceTag/...`, `aws:PrincipalTag/...` | 태그 기반 ABAC | 태그 표준(거버넌스) 선행 필요 |

### 2.3 권한 경계(Permissions Boundary)와 최소 권한 설계 절차

권한 경계는 "이 주체가 스스로 권한을 늘리지 못하게" 만드는 상한이다. 권한이 없는 상태에서 경계만 붙여도 아무것도 못 한다. 실제로는 **위임(delegation) 설계**에 쓴다 — 개발자가 IAM 역할을 만들 수 있게 하되, 만든 역할에는 반드시 표준 경계를 요구한다.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowBoundaryAttachedRolesOnly",
      "Effect": "Allow",
      "Action": ["iam:CreateRole", "iam:AttachRolePolicy"],
      "Resource": "arn:aws:iam::*:role/app-*",
      "Condition": {
        "StringEquals": {
          "iam:PermissionsBoundary": "arn:aws:iam::111122223333:policy/AppBoundary",
          "aws:RequestedRegion": "ap-northeast-2"
        }
      }
    },
    {
      "Sid": "DenyOutsideBoundaryAndPlaintext",
      "Effect": "Deny",
      "Action": ["iam:DeleteRolePermissionsBoundary", "iam:PutRolePermissionsBoundary"],
      "Resource": "*"
    }
  ]
}
```

최소 권한 설계는 "추측"이 아니라 관측에서 출발한다.

1. **실사용 액션 수집** — CloudTrail 이벤트(`eventSource`·`eventName`) 또는 IAM Access Analyzer의 CloudTrail 기반 정책 생성으로 실제 호출만 뽑는다.
2. **초안 생성** — Access Analyzer `--generate-policy`로 신원 정책 초안을 만들고, 리소스 ARN 수준까지 좁힌다.
3. **사전 검증** — `simulate-principal-policy`와 검증 계정에서 dry-run으로 확인한다.
4. **배포·관측** — UnusedAccess 발견 항목과 `AccessDenied` 이벤트를 알림으로 연결한다.
5. **자동 축소** — 90일 미사용 권한을 리뷰 대상으로 올리고, 장기 자격 증명 대신 임시 자격 증명(role + STS/OIDC)으로 수렴시킨다.

```bash
# 실제 호출 기반 권한 검증: 특정 주체가 버킷 삭제 가능한가?
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::111122223333:role/app-api \
  --action-names s3:DeleteObject s3:GetObject \
  --resource-arns arn:aws:s3:::app-data/prod/* \
  --query 'EvaluationResults[].{action:EvalActionName,decision:EvalDecision}' \
  --output table

# 90일 이상 미사용 권한/미사용 자격 증명 찾기
aws accessanalyzer list-findings \
  --analyzer-arn arn:aws:access-analyzer:ap-northeast-2:111122223333:analyzer/org-analyzer \
  --filter '{"findingType":{"eq":["UnusedPermission","UnusedIAMRole"]}}' \
  --query 'findings[].{type:findingType,resource:resource}' --output table
```

![IAM 역할 수임과 권한 경계](/assets/images/cloud/cloud-iam-boundary.png)

위 다이어그램은 사람·워크로드 신원이 `sts:AssumeRole`이나 OIDC 페더레이션으로 임시 자격증명을 받아 역할 세션을 시작하고, 그 세션의 유효 권한이 신원 정책·권한 경계·SCP·세션 정책의 허용 교집합으로 좁혀지는 구조를 보여준다. 상한 정책은 권한을 부여하지 않고 깎기만 하므로, 어느 하나에라도 `Deny`가 걸리면 그 즉시 거부된다.

---

## 3. 멀티 계정/프로젝트 전략

계정(또는 GCP 프로젝트, Azure 구독)은 **격리 경계**다. 자원 태그나 네임스페이스가 아니라 계정 단위로 격리해야 정책·로깅·요금·권한이 동시에 분리된다.

- **조직 구조**: 관리/보안(탐지)·로그 아카이브·네트워크·공유 서비스·업무 OU(prod/nonprod)로 분리. 계정이 곧 폭발 반경(blast radius)이다.
- **SCP**: OU 단위 가드레일. 리전 제한, 루트 사용자 금지, CloudTrail 중지 금지, 암호화 미적용 리소스 생성 금지 같은 **부정(Deny) 중심** 정책을 계층적으로 붙인다.
- **랜딩 존(Landing Zone)**: AWS Control Tower / Landing Zone Accelerator, Azure Landing Zone(관리 그룹 + Policy + 허브-스포크), GCP 조직 정책(Org Policy). 계정 생성·기준선 적용·로그 중앙화를 코드로 자동화하는 프레임워크로 이해하면 된다.
- **신규 계정 온보딩 순서**: 계정 생성 → 기준선 SCP/Policy → 중앙 로그 연결(CloudTrail 조직 트레일/진단 설정) → 네트워크 연결 → IAM 역할 위임 → 태그 표준. 이 순서를 뒤집으면 "로그 없는 계정"이 생긴다.

![조직·계정 거버넌스 계층](/assets/images/cloud/cloud-org-governance.png)

위 그림은 조직 루트에서 보안·로그 아카이브 OU와 업무 OU(prod/nonprod)로 계정을 나누고, SCP·Azure Policy·조직 정책이 계층을 따라 상속되는 구조를 나타낸다. 계정이 곧 폭발 반경이므로, 격리는 태그나 네임스페이스가 아니라 계정 단위로 잡는다.

```hcl
# Terraform: OU 단위 SCP — 리전 제한 + 루트 사용자 금지 + 로그 무력화 차단
resource "aws_organizations_policy" "baseline" {
  name = "baseline-guardrails"
  type = "SERVICE_CONTROL_POLICY"

  content = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "DenyOutsideAllowedRegions"
        Effect    = "Deny"
        Action    = "*"
        Resource  = "*"
        Condition = { StringNotEquals = { "aws:RequestedRegion" = ["ap-northeast-2", "us-east-1"] } }
      },
      {
        Sid       = "DenyRootUserActions"
        Effect    = "Deny"
        Action    = "*"
        Resource  = "*"
        Condition = { StringLike = { "aws:PrincipalArn" = "arn:aws:iam::*:root" } }
      },
      {
        Sid       = "ProtectAuditTrail"
        Effect    = "Deny"
        Action    = ["cloudtrail:StopLogging", "cloudtrail:DeleteTrail", "config:DeleteConfigurationRecorder"]
        Resource  = "*"
      }
    ]
  })
}

resource "aws_organizations_policy_attachment" "workloads" {
  policy_id = aws_organizations_policy.baseline.id
  target_id = var.workloads_ou_id
}
```

---

## 4. 네트워크 보안

네트워크 계층은 **엣지(흡수) → 경계(필터) → 내부(마이크로세그멘테이션)** 3단으로 나눠 설계한다.

| 계층 | 대표 도구 | 역할 |
| :--- | :--- | :--- |
| DDoS | AWS Shield Std/Advanced, Azure DDoS Protection, GCP Cloud Armor | L3/L4 볼륨 공격 흡수, 대역폭·L7 방어 |
| WAF | AWS WAF, Front Door/App Gateway WAF, Cloud Armor | OWASP 관리형 룰, 레이트 기반 룰, 봇 차단 |
| 프라이빗 연결 | PrivateLink, Azure Private Link, Private Service Connect | 인터넷 우회 서비스 접근, 데이터 유출 경로 축소 |
| 내부 세그멘테이션 | SG/NACL, NetworkPolicy, 서비스 메시 mTLS | 워크로드 간 기본 거부 |

- WAF는 **관리형 룰 + 레이트 기반 룰**을 먼저 걸고, `Count` 모드로 오탐을 관측한 뒤 `Block`으로 승격한다. 곧바로 Block을 걸면 정상 트래픽이 죽는다.
- 프라이빗 엔드포인트는 **DNS·보안 그룹·정책** 3종 세트를 함께 봐야 한다. 인터페이스 엔드포인트(PrivateLink)는 보안 그룹이 필요하지만 S3/DynamoDB용 게이트웨이 엔드포인트는 보안 그룹이 없고 엔드포인트 정책만 있다.
- 쿠버네티스 내부는 기본 거부 후 명시 허용이 정석이다.

```yaml
# 1) 네임스페이스 전체 인그레스/이그레스 기본 거부
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: payments
spec:
  podSelector: {}
  policyTypes: ["Ingress", "Egress"]
---
# 2) 허용: api -> db(5432), DNS 이그레스만 개방
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-to-db
  namespace: payments
spec:
  podSelector:
    matchLabels: { app: db }
  policyTypes: ["Ingress"]
  ingress:
    - from:
        - podSelector: { matchLabels: { app: api } }
      ports:
        - protocol: TCP
          port: 5432
```

```bash
# 적용 전후 확인: "이 파드가 저 서비스에 붙을 수 있는가?"
kubectl auth can-i --list -n payments --as=system:serviceaccount:payments:api
kubectl run nettest --rm -it --image=nicolaka/netshoot -n payments -- \
  nc -zvw3 db.payments.svc.cluster.local 5432
```

---

## 5. 데이터 보안

- **저장 시 암호화(at rest)**: 관리형 키(SSE-S3/서비스 기본)와 고객 관리 키(CMK, Key Vault key, CMEK)를 구분한다. 규제 대상이면 CMK + 키 정책 + 자동 로테이션을 기본값으로 둔다. KMS 키 정책은 IAM보다 우선하는 리소스 정책이며, 삭제는 대기 기간(deletion window) 이후에만 가능하다.
- **전송 중 암호화(in transit)**: TLS 1.2+ 강제, 인증서 자동화(ACM/Managed Cert), 내부 통신은 mTLS. 평문 차단은 조건 키로 강제한다.
- **시크릿(Secret)**: Secrets Manager처럼 로테이션을 지원하는 저장소를 쓰고, 쿠버네티스에는 External Secrets Operator + IRSA/Workload Identity 또는 CSI Secret Store 드라이버로 **주입 시점에만** 노출한다. DB 비밀번호를 `env`로 넣는 방식은 프로세스 환경변수·`kubectl describe`·크래시 덤프에서 노출된다.
- **etcd 암호화**: 관리형 클러스터도 KMS 제공자 기반 암호화를 켠다(AKS `--enable-encryption-at-host`/KMS 플러그인, EKS envelope encryption).

```hcl
# KMS CMK + S3: 평문 차단 + 기본 SSE-KMS
resource "aws_kms_key" "data" {
  description             = "app data cmk"
  enable_key_rotation     = true
  deletion_window_in_days = 30
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowAccountAdminViaIam"
        Effect    = "Allow"
        Principal = { AWS = "arn:aws:iam::111122223333:root" }
        Action    = "kms:*"
        Resource  = "*"
      },
      {
        Sid       = "AllowS3UseOfKey"
        Effect    = "Allow"
        Principal = { Service = "s3.amazonaws.com" }
        Action    = ["kms:GenerateDataKey", "kms:Decrypt"]
        Resource  = "*"
        Condition = { StringEquals = { "kms:ViaService" = "s3.ap-northeast-2.amazonaws.com" } }
      }
    ]
  })
}

resource "aws_s3_bucket_policy" "deny_plaintext" {
  bucket = aws_s3_bucket.data.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "DenyNonTls"
      Effect    = "Deny"
      Principal = "*"
      Action    = "s3:*"
      Resource  = ["${aws_s3_bucket.data.arn}", "${aws_s3_bucket.data.arn}/*"]
      Condition = { Bool = { "aws:SecureTransport" = "false" } }
    }]
  })
}
```

```yaml
# External Secrets + IRSA: 시크릿을 클러스터 오브젝트로만 관리
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: db-credentials
  namespace: payments
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secretsmanager
    kind: ClusterSecretStore
  target:
    name: db-credentials
    creationPolicy: Owner
  data:
    - secretKey: password
      remoteRef:
        key: prod/payments/db
        property: password
```

---

## 6. 컴플라이언스

| 규제 | 성격 | 핵심 요구 | 클라우드 증적 |
| :--- | :--- | :--- | :--- |
| SOC 2 Type II | 미국 감사(민간) | TSC 5개 영역 통제가 관찰기간(보통 6~12개월) 동안 유지 | 통제 매트릭스, 접근 로그, 변경 이력 |
| ISO/IEC 27001 | 국제 표준 인증 | ISMS 요구사항 + Annex A 통제 | 위험평가서, 내부감사, 시정조치 |
| ISMS-P | 국내 인증 | ISMS 80 + 개인정보 22 = 102개 기준 | 접근권한 대장, 암호화 점검, 처리방침 |
| GDPR | EU 법률 | 적법 근거, DSR 대응, 역외 이전 근거(SCC), 위반 시 72시간 통보 | 처리 활동 기록(RoPA), DPA, 이전 영향평가 |

- 감사 대비의 핵심은 **증적 자동 수집**이다. Config 규칙·Azure Policy·조직 정책의 준수 상태를 리소스 인벤토리와 함께 주기적으로 스냅샷 떠서 증적 버킷(Object Lock)에 적재한다.
- 규제 요구를 **코드화된 통제**로 매핑한다: "MFA 필수" → 조건 키 정책, "전송 암호화" → `aws:SecureTransport` Deny, "접근 검토" → 분기별 권한 리뷰 자동 리포트.

---

## 7. 감사와 탐지

- **감사(Audit)**: CloudTrail 조직 트레일(모든 계정·리전) → 중앙 로그 아카이브 계정 S3, Object Lock(Compliance) + SSE-KMS. 관리 이벤트에 더해 S3 객체·Lambda 호출 같은 데이터 이벤트를 민감 버킷에만 선별 활성화한다(비용 통제). Azure는 진단 설정으로 Activity Log를 중앙으로, GCP는 Cloud Audit Logs를 로그 버킷으로 집계한다.
- **탐지(Detect)**: GuardDuty(EKS Protection·Malware Protection 포함), Security Hub(FSBP·CIS 표준), Inspector(취약점), Macie(PII). Azure는 Defender for Cloud(보안 점수·규제 준수), GCP는 Security Command Center.
- **CSPM(Cloud Security Posture Management)**: 구성 드리프트와 잘못된 설정을 지속 스캔한다. 핵심은 결과를 **티켓이 아니라 자동 교정**으로 연결하는 것.
- **즉시 알림 대상**: 루트 로그인, IAM 정책/역할 변경, SG 0.0.0.0/0 개방, KMS 키 비활성화·삭제, CloudTrail/Config 중지, 조직 외부 계정과의 신뢰 생성.

```bash
# 위험 신호를 EventBridge -> SNS로 즉시 라우팅 (핵심 이벤트만)
aws events put-rule --name prod-security-critical \
  --event-pattern '{"source":["aws.cloudtrail"],"detail-type":["AWS API Call via CloudTrail"],
    "detail":{"eventName":["StopLogging","DeleteTrail","DisableKey","DeleteKey","CreateAccessKey","PutBucketPolicy"],
              "errorCode":[{"exists":false}]}}'

aws events put-targets --rule prod-security-critical \
  --targets 'Id=sec-oncall,Arn=arn:aws:sns:ap-northeast-2:111122223333:sec-oncall'

# 의심 IP의 최근 활동 조회 (사고 초동 분석)
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=ConsoleLogin \
  --start-time "$(date -u -v-1H +%Y-%m-%dT%H:%M:%SZ)" \
  --query 'Events[].CloudTrailEvent' --output text | jq -r \
  '. | {time:eventTime,user:userIdentity.arn,ip:sourceIPAddress,mfa:additionalEventData.MFAUsed}'
```

---

## 8. 제로 트러스트

제로 트러스트(Zero Trust)의 원칙은 "네트워크 위치를 신뢰 근거로 쓰지 않는다(Never trust, always verify)"이다. 구현 요소는 다음 네 가지로 압축된다.

1. **신원 중심 접근**: SSO + MFA + SCIM, 장기 자격 증명(액세스 키) 제거. 워크로드도 사람과 동일하게 OIDC 페더레이션(IRSA/Workload Identity)으로 신원을 부여한다.
2. **디바이스·컨텍스트 검증**: 조건부 액세스(위치, 디바이스 컴플라이언스, 리스크 점수)로 세션을 매번 평가한다.
3. **최소 권한 + JIT(just-in-time)**: 상시 관리자 권한 대신 승인·만료 시간이 있는 임시 승급(sudo/approval workflow).
4. **마이크로세그멘테이션**: 서비스 간 기본 거부 + mTLS, 프라이빗 엔드포인트로 데이터 경로 고정.

실무 함정은 "VPN을 제로 트러스트라고 부르는 것"이다. VPN은 여전히 네트워크 신뢰 모델이며, 신원·디바이스 검증 없이 사내망에 들어가면 동일한 측면 이동(lateral movement)이 가능하다.

---

## 9. 사고 대응(IR) 프로세스

NIST SP 800-61 흐름을 클라우드에 맞춰 축약하면 **준비 → 탐지·분석 → 봉쇄·근절·복구 → 사후 활동**이다. 클라우드에서는 "증거 보존이 격리보다 먼저"라는 점이 온프레미스와 다르다.

1. **준비**: 심각도 기준, 역할(사고 지휘관·기록자·커뮤니케이션), 연락망, 포렌식 계정(전용)과 사전 승인된 격리 플레이북.
2. **탐지·분석**: GuardDuty/Defender/SCC 알림 → CloudTrail·VPC 흐름 로그로 영향 범위 산정. 티켓에 UTC 타임라인을 남긴다.
3. **봉쇄**: 자격 증명 무효화(세션 무효화 → 키 비활성화 → 정책 축소) 순으로, 워크로드는 인스턴스를 **종료하지 말고** 격리 보안 그룹으로 이동.
4. **근절·복구**: 침해 경로 제거 후 신뢰 가능한 이미지로 재배포, IAM 재설정, 시크릿 전면 로테이션.
5. **사후**: 사후 분석(postmortem)과 규제 통보(GDPR 72시간, 국내 개인정보보호법·ISMS-P 신고·통지 기한은 별도 확인).

```bash
# 1) 격리: 아웃바운드 전면 차단 SG를 붙여 네트워크만 끊는다(인스턴스는 유지)
aws ec2 create-security-group --group-name quarantine-noegress \
  --description "IR quarantine" --vpc-id vpc-0abc1234 --query 'GroupId' --output text
aws ec2 modify-instance-attribute --instance-id i-0abc1234 \
  --groups sg-0quarantine1111

# 2) 증거 보존: 볼륨 스냅샷 + (필요 시) 메모리 덤프 후 태깅
aws ec2 create-snapshot --volume-id vol-0abc1234 \
  --description "IR-2026-1010-i-0abc1234" \
  --tag-specifications 'ResourceType=snapshot,Tags=[{Key=case,Value=IR-2026-1010}]'

# 3) 자격 증명 무효화: 활성 키 비활성화 + 세션 정책으로 기존 세션 차단
aws iam update-access-key --access-key-id AKIAEXAMPLE --status Inactive --user-name compromised-user
```

---

## 10. 실전 함정과 트러블슈팅

- **`AccessDenied`인데 정책에 Allow가 있다**: 권한 경계·SCP·세션 정책 중 하나가 상한을 깎았을 가능성이 높다. `simulate-principal-policy`로 어느 정책이 거부했는지 확인한다.
- **새 권한을 추가했는데도 거부**: 자격 증명 정책만 고치고 경계(또는 SCP)를 갱신하지 않았다. 경계 갱신을 배포 파이프라인에 포함시킨다.
- **VPC 엔드포인트로 S3 접근 시 403**: 엔드포인트 정책이 버킷 ARN을 허용하지 않거나, 버킷 정책이 `aws:SourceVpce` 조건으로 막고 있다.
- **KMS `AccessDenied`로 스냅샷 복원 실패**: 키 정책에 복원 역할/서비스가 없거나 리전이 다른 키를 참조했다. 멀티 리전 키(multi-Region key) 또는 키 정책 보완이 필요하다.
- **NetworkPolicy를 적용했는데 트래픽이 그대로**: CNI가 NetworkPolicy를 지원하지 않거나(기본 flannel 등), 적용 시점 이후 기존 커넥션이 유지된 경우다. DNS 이그레스를 잊으면 서비스 디스커버리가 전부 실패한다 — 증상은 "간헐적 타임아웃"으로 나타난다.
- **포드가 AWS API 권한을 못 얻음(IRSA)**: ServiceAccount 어노테이션의 역할 ARN 오타 또는 OIDC 제공자 신뢰 정책의 `sub` 조건 불일치가 원인이다. `aws sts get-caller-identity`를 파드 안에서 실행해 실제 주체를 확인한다.
- **인스턴스 종료 후 조사 불가**: 즉시 terminate하면 메모리·미저장 데이터가 사라진다. 격리 → 스냅샷 → 종료 순서를 플레이북에 명문화한다.

---

## 11. 실무 체크리스트

- [ ] 관리 계정과 워크로드 계정을 분리하고, 루트 사용자는 MFA + 하드웨어 키로 잠그고 사용하지 않는다.
- [ ] 모든 사람·워크로드 신원에 MFA 또는 OIDC 페더레이션을 적용하고, 90일 이상 미사용 키/역할을 분기마다 제거한다.
- [ ] 권한 경계와 SCP를 CI에서 검증하고, `simulate-principal-policy` 결과를 배포 게이트로 사용한다.
- [ ] 모든 계정·리전의 감사 로그(CloudTrail/진단 설정)를 별도 로그 계정으로 중앙화하고 Object Lock으로 불변 보존한다.
- [ ] 보안 서비스(GuardDuty/Defender/Security Hub/SCC)를 조직 전체에서 활성화하고, 위험 신호를 온콜 채널로 라우팅한다.
- [ ] 데이터 분류 후 규제 대상 데이터는 CMK + 자동 로테이션 + 전송 암호화 강제(평문 Deny)를 적용한다.
- [ ] 시크릿은 Secrets Manager/Key Vault에서 쿠버네티스로 주입하고, 로테이션 주기와 주입 경로(External Secrets/CSI)를 문서화한다.
- [ ] 외부 노출 자산의 WAF 룰은 Count → Block 승격 절차를 거치고, 레이트 기반 룰을 기본 포함한다.
- [ ] 최소 권한·경계·태그 표준을 포함한 신규 계정 온보딩을 IaC로 자동화하고 드리프트를 주기 스캔한다.
- [ ] IR 플레이북(격리 → 증거 보존 → 자격 증명 무효화 → 통보)을 최소 1회 리허설하고, 규제별 통보 기한을 문서에 명시한다.

---

## 12. 정리

- **경계는 계약이다.** 공동 책임 모델에서 데이터 분류·IAM·키 정책·백업은 끝까지 고객 책임이다. 이 경계를 넘는 순간이 사고 지점이다.
- **허용의 교집합이 유효 권한이다.** SCP·권한 경계·세션 정책은 권한을 부여하지 않고 상한만 깎으며, 명시적 `Deny` 하나가 모든 `Allow`를 이긴다.
- **계정이 곧 폭발 반경이다.** OU·계정(구독) 단위로 격리하고, 랜딩 존과 SCP로 가드레일을 계층 상속한다.
- **보안 통제를 코드로 옮긴다.** 조건 키·평문 Deny·최소 권한 경계를 IaC와 CI 검증에 넣고, 시크릿은 주입 시점에만 노출한다.
- **증거를 먼저 보존한다.** 감사 로그를 불변 보존하고, 탐지를 온콜로 라우팅하며, IR은 격리 → 스냅샷 → 자격 증명 무효화 순으로 리허설한다.

---

## References

- AWS Documentation — [AWS Identity and Access Management: 정책 평가 로직](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)
- AWS Documentation — [AWS Organizations 서비스 제어 정책(SCP)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)
- AWS Documentation — [IAM Access Analyzer로 최소 권한 정책 생성](https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-policy-generation.html)
- Microsoft Learn — [Azure Landing Zone: 관리 그룹과 Azure Policy](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/)
- Google Cloud — [Organization Policy Service 개요](https://cloud.google.com/resource-manager/docs/organization-policy/overview)
- NIST — [SP 800-61 컴퓨터 보안 인시던트 처리 가이드](https://csrc.nist.gov/pubs/sp/800/61/r2/final)
