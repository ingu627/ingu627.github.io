---
layout: single
title: "EKS Gateway API 도입 실전: NGINX Ingress 은퇴 대응과 Cilium ENI 게이트웨이"
excerpt: "커뮤니티 ingress-nginx 컨트롤러의 유지보수는 2026년 3월에 끝났다. GatewayClass·Gateway·HTTPRoute의 책임 분리, Ingress 어노테이션을 Gateway API 리소스로 옮기는 기능 대응표, CRD 사전 요구사항과 5단계 전환 절차, Cilium ENI 모드 게이트웨이의 데이터패스와 BGP Control Plane v2까지 운영 관점에서 다시 정리한다."
categories: [k8s]
tags: [eks, gateway-api, ingress-nginx, cilium, eni, migration, bgp, 네트워킹, 정리]
toc: true
toc_sticky: true
sidebar_main: true
date: 2026-09-28
last_modified_at: 2026-10-10
---

클러스터 앞단을 오래 ingress-nginx로 운영해 왔다면, 지금 손에 남은 선택지는 "언제 옮기느냐"뿐이다. 커뮤니티 ingress-nginx 컨트롤러는 2025년 11월에 공식 은퇴(retirement)가 발표됐고, 2026년 3월을 기점으로 유지보수가 끝났다[^1][^5]. 보안 패치가 멈춘 인그레스 컨트롤러를 컴플라이언스 심사 대상 클러스터에 남겨 두는 것은 더 이상 선택 사항이 아니다. 사내 AI 플랫폼 클러스터의 앞단을 정리하면서, 공개된 EKS 운영 매뉴얼(Engineering Playbook)의 Gateway API 문서 네 편을 기준으로 판단 근거를 다시 세워 봤다[^1][^2][^3][^4]. 이 글은 그 기록이다.

순서는 이렇게 잡는다. 왜 지금인지(§1) → Ingress와 Gateway API가 책임을 어떻게 나누는지(§2) → 어떤 구현체를 고를지(§3) → 기존 어노테이션이 어디로 가는지(§4) → 실제 5단계 전환 절차(§5) → Cilium ENI 모드 게이트웨이를 검토할 때의 개념과 설치 개요(§6) → 마지막으로 전환 계획·검증·롤백 표(실무 적용). Azure에서 Ingress 기반 AGIC(Application Gateway Ingress Controller)를 Gateway API 지원 경로로 옮기는 흐름도 같은 맥락이지만, 수치와 버전은 이 글의 범위 밖이므로 AWS 문서 기준으로만 서술한다.

---

## 1. 왜 지금 Gateway API인가

### 1.1 EOL 타임라인과 남은 시간

시간축을 정리하면 이렇다. 2025년 3월 취약점 하나가 공개되면서 교체 논의가 빨라졌고, 2025년 11월 Kubernetes SIG Network가 공식 은퇴를 발표했으며, 2026년 3월에 유지보수가 종료됐다[^1].

| 시점 | 사건 | 운영상 의미 |
|---|---|---|
| 2025-03 | IngressNightmare(CVE-2025-1974) 공개 | 어노테이션 기반 설정 주입이 곧 공격 경로임이 드러남 |
| 2025-11 | 공식 은퇴 발표 | 메인테이너 부족(1~2명)과 Gateway API 성숙도가 이유로 명시됨 |
| 2026-03 | 공식 EOL, 패치 중단 | PCI-DSS·SOC 2·ISO 27001 유지 목적이면 전환은 필수 |

마이그레이션은 이미 늦은 감이 있다. 문서가 제시하는 권장 곡선(계획·PoC → 병렬 운영 → 전환 완료)을 그대로 따라도 최소 4~6주가 걸린다[^1][^3].

### 1.2 취약점이 아니라 구조가 문제다

CVE-2025-1974의 무서운 점은 CVSS 9.8이라는 숫자보다 **공격 경로의 성격**이다. `configuration-snippet`·`server-snippet` 어노테이션은 NGINX 설정 문자열을 그대로 주입하는 통로이고, 이 통로는 인증 없이 원격 코드 실행(RCE)까지 이어진다[^1]. 어노테이션을 쓰지 말자는 규율로 막을 수는 있지만, 규율은 구조가 아니다.

문서가 정리한 위험은 하나가 아니다[^1].

| 취약점 유형 | 심각도 | CVSS | 영향 |
|---|---|---|---|
| Snippets 어노테이션을 통한 임의 설정 주입 | Critical | 9.8 | 인그레스 트래픽 전체 장악 가능 |
| 스키마 검증 부재로 잘못된 설정 전파 | High | 7.5 | 서비스 중단, 정책 우회 |
| 네임스페이스 격리를 무력화하는 RBAC 권한 상승 | Critical | 9.1 | 크로스 네임스페이스 권한 탈취 |
| EOL 이후 제로데이 대응 불가 | Critical | — | 패치 자체가 없음 |

세 번째 항목이 실무에서 가장 불편하다. 인그레스 리소스에는 스니펫뿐 아니라 인증·리다이렉트·CORS 같은 L7 정책이 어노테이션 50여 개로 얹혀 있고, 그 권한은 네임스페이스 단위 Ingress 권한 하나로 전부 열린다[^1]. 애플리케이션 팀이 자기 라우팅만 바꾸려다 앞단 전체 정책을 건드릴 수 있는 구조다.

### 1.3 Gateway API가 바꾸는 것

Gateway API는 스니펫을 없애 주는 도구가 아니다. **설정을 표준 CRD 필드로 끌어올리고, 소유자를 리소스 단위로 쪼개는 표준**이다[^1].

| 측면 | Ingress | Gateway API |
|---|---|---|
| 리소스 구조 | 단일 리소스에 라우팅·TLS·정책을 모두 포함 | GatewayClass·Gateway·HTTPRoute로 관심사 분리 |
| 설정 방식 | 비표준 어노테이션 50개 이상 | 표준 CRD 필드, 확장은 Policy Attachment |
| 권한 | 네임스페이스 Ingress 권한으로 전부 제어 | 리소스별 RBAC 분리(인프라·플랫폼·앱) |
| 컨트롤러 교체 | 전체 Ingress 재작성 | GatewayClass 값만 교체 |
| 확장 | 스니펫 주입 또는 커스텀 컨트롤러 | Policy Attachment 패턴 |

마지막 줄이 전환 비용을 결정한다. 구현체를 바꾸는 일과 라우팅 정의를 바꾸는 일이 분리되므로, 두 번째 구현체부터는 비용이 급격히 낮아진다.

---

## 2. Ingress와 Gateway API의 책임 분리

![Ingress 단일 리소스와 Gateway API의 3계층 역할 분리 비교](/assets/images/k8s/gateway-api-roles.webp)

### 2.1 3계층 리소스 모델

Gateway API의 핵심은 리소스를 셋으로 나눈 것이다. 계층마다 스코프가 다르다는 점이 중요하다[^1].

| 리소스 | 스코프 | 관리 주체 | 책임 | 변경 빈도 |
|---|---|---|---|---|
| GatewayClass | 클러스터 | 인프라 팀(SRE·클러스터 관리자) | 컨트롤러 선택, 전역 정책, 비용 최적화 | 분기 1~2회 |
| Gateway | 네임스페이스 | 플랫폼 팀(네트워크 엔지니어) | 리스너, TLS 인증서, 로드밸런서 설정 | 월 1~2회 |
| HTTPRoute | 네임스페이스 | 애플리케이션 팀 | 서비스별 라우팅, Canary, A/B 테스트 | 일 단위 |
| Service | 네임스페이스 | 애플리케이션 팀 | 백엔드 엔드포인트 | 배포마다 |

![Gateway API의 세 가지 안정 리소스(HTTPRoute·Gateway·GatewayClass)가 클러스터 범위에서 맺는 관계](/assets/images/k8s/official-gateway-api-kind-relationships.webp)

출처: Gateway API — Kubernetes Documentation (https://kubernetes.io/docs/concepts/services-networking/gateway/) · 라이선스: CC BY 4.0

라우팅 변경이 일상 작업인 앱 팀에게는 HTTPRoute만 쥐여 주고, 리스너와 인증서처럼 사고가 나면 파급이 큰 설정은 플랫폼 팀에 남긴다. "누가 인그레스 앞단을 바꿀 수 있는가"라는 질문에 RBAC로 답할 수 있게 되는 것이 Ingress 대비 실질적인 차이다.

### 2.2 RBAC로 책임을 나눈다

계층 분리는 문서 예제처럼 ClusterRole/Role 조합으로 구현한다[^1].

- **인프라 팀**: `gatewayclasses`에 대한 ClusterRole. 클러스터 스코프이므로 여기만 클러스터 권한이 필요하다.
- **플랫폼 팀**: 자기 네임스페이스의 `gateways` + TLS용 `secrets` read Role.
- **앱 팀**: 자기 네임스페이스의 `httproutes`·`referencegrants` + `services` read Role.

크로스 네임스페이스 참조는 기본적으로 막혀 있고, 명시적으로 허용하려면 `ReferenceGrant`를 대상 네임스페이스에 둔다[^1]. Ingress에서는 상상하기 어려운 "참조 허용 목록" 모델이다.

### 2.3 GA 채널과 실험 채널

무엇을 프로덕션에 써도 되는지는 채널과 성숙도로 결정된다. 문서 기준 Gateway API v1.4.0 상태는 아래와 같다[^1].

| 리소스 | 채널 | 상태 | 프로덕션 권장 |
|---|---|---|---|
| GatewayClass · Gateway · HTTPRoute | Standard | GA(v1) | 권장 |
| GRPCRoute | Standard | GA(v1) | 권장 |
| ReferenceGrant | Standard | GA(v1beta1) | 권장 |
| BackendTLSPolicy | Standard | Beta(v1alpha3) | 조건부 |
| TLSRoute · TCPRoute · UDPRoute | Experimental | Alpha(v1alpha2) | 비권장 |

실험 채널 리소스는 마이너 업그레이드에서 필드가 바뀌거나 사라질 수 있다[^1]. 세션 어피니티처럼 표준에 아직 없는 기능을 실험 채널로 당겨 쓸 때는 이 리스크를 전제로 깔아야 한다(§4.3).

---

## 3. 구현체 선택 가이드

### 3.1 AWS Native와 OSS의 경계

선택지는 크게 AWS 관리형 경로와 오픈소스 경로로 갈린다. 기능 자체는 대부분 구현되지만, **정책을 어디에서 집행하는가**가 다르다[^1][^2].

| 구분 | AWS Native(LBC v3 + ALB/NLB) | 오픈소스(Cilium·NGINX GF·Envoy GW·kGateway) |
|---|---|---|
| L7 정책 집행 위치 | AWS WAF 규칙, ALB 기능 | 커널(eBPF) 또는 클러스터 내 프록시(Envoy·NGINX) |
| 인증 | LBC 확장 `ListenerRuleConfiguration`의 JWT 검증, 또는 Lambda | 구현체별 정책 CRD, OAuth2 Proxy 같은 외부 인증 서비스 |
| IP 제어·Rate Limit·본문 제한 | WAF WebACL 규칙(IPSet·Rate-based·SizeConstraint) | CiliumNetworkPolicy·TrafficPolicy·ClientTrafficPolicy 등 |
| 선언적 관리 | ACK(AWS Controllers for Kubernetes)로 WAF 리소스까지 GitOps | 원래 Kubernetes CRD |
| 강점 | 운영 부담 최소, SLA, WAF·Shield·ACM 통합 | 정책 평가 지연 없음, 벤더 종속 회피, 관측성 |
| 주의점 | WebACL은 ALB당 하나만 연결 가능 | 구현체별 정책 모델 학습 필요 |

WAF 규칙을 3개 이상 써야 한다면 단일 WebACL에 `priority`로 규칙을 묶는 구조가 비용·관리 면에서 유리하고, 1~2개면 오픈소스에서 추가 비용 없이 처리할 수 있다는 것이 문서의 정리다[^2]. 다만 WebACL 하나에 규칙을 통합하는 구조는 규칙 간 우선순위 실수가 곧 장애로 이어지므로, 변경 전후 평가 순서를 반드시 리뷰한다.

### 3.2 시나리오별 1·2순위

문서가 제시하는 시나리오별 권장은 다음과 같다[^1]. 조직 상황에 맞는 행만 골라 판단 기준으로 쓰면 된다.

| 시나리오 | 1순위 | 2순위 | 근거 |
|---|---|---|---|
| AWS 올인 + 운영 최소화 | AWS Native | Cilium | 관리형, SLA, 운영 인력 소규모 |
| 고성능 + 관측성 | Cilium | Envoy Gateway | eBPF 처리, Hubble 서비스 맵 |
| NGINX 경험 + 멀티클라우드 | NGINX Gateway Fabric | Envoy Gateway | 기존 NGINX 지식, 클라우드 중립 |
| CNCF 표준 + 서비스 메시 | Envoy Gateway | kGateway | Istio 호환, mTLS·ExtAuth |
| AI/ML 통합 게이트웨이 | kGateway | Cilium | 클러스터 내 추론 라우팅, MCP Gateway |
| 금융·의료 보안 | AWS Native | Cilium | WAF·Shield·감사 추적 |
| 하이브리드·멀티클러스터 | Cilium | kGateway | BGP Control Plane, 멀티사이트 |
| 빠른 PoC | AWS Native | NGINX Gateway Fabric | 설정 속도, 관리형 안정성 |

"외부 LLM API를 프록시하는 LLM 게이트웨이"와 "클러스터 내 추론 파드를 라우팅하는 추론 게이트웨이"는 서로 다른 계층이라는 구분도 문서가 명시한다[^1]. 같은 "AI 게이트웨이"라는 단어로 요구사항을 뭉뚱그리면 구현체를 잘못 고른다.

### 3.3 EKS 사전 요구사항

구현체를 정했으면 클러스터가 준비됐는지부터 확인한다. Cilium을 CNI로 쓰는 경로의 요구사항은 아래와 같다[^4].

| 항목 | 요구사항 | 비고 |
|---|---|---|
| EKS 버전 | 1.28 이상(문서 권장 1.32) | Gateway API v1.4 호환 |
| 컨트롤 플레인 | kube-proxy 비활성화 | Cilium이 kube-proxy를 대체 |
| 노드 OS | Amazon Linux 2023 또는 Ubuntu 22.04 | eBPF 커널 지원(5.10 이상) |
| 컨테이너 런타임 | containerd 1.6 이상 | CRI 호환 |
| VPC CNI | 제거 필수 | Cilium이 CNI 역할 수행 |

여기서 실무 함정이 하나 있다. VPC CNI를 걷어내는 순간 **파드 네트워크가 전면 중단**된다[^4]. 기존 클러스터에서 CNI를 교체하는 작업은 유지보수 창(maintenance window)이나 블루-그린 클러스터 전환으로만 하는 것이 안전하고, 다운타임 자체는 노드 교체·파드 재생성 시간을 포함해 별도로 계획해야 한다.

---

## 4. 기능별 마이그레이션 대응표(annotation → 리소스)

### 4.1 기본 매핑: annotation이 사라진 자리

인벤토리를 뜨고 나면 어노테이션 하나하나가 어디로 가는지 표가 필요하다. 문서의 매핑을 정리하면 이렇다[^3].

| 기존 Ingress 표기 | Gateway API 대응 | 성격 |
|---|---|---|
| `spec.rules[].host` | `HTTPRoute.spec.hostnames` | 직접 매핑 |
| `http.paths[].path` | `rules[].matches[].path` | 직접 매핑 |
| `pathType: Prefix` | `path.type: PathPrefix` | 동일 |
| `rewrite-target` 어노테이션 | `filters[].type: URLRewrite` | 표준으로 승격 |
| rate-limit 어노테이션 | Policy Attachment(구현체별 상이) | 표준화 진행 중 |
| cors-* 어노테이션 | Policy Attachment | 표준화 진행 중 |
| auth-* 어노테이션 | Policy Attachment 또는 외부 인증 | OAuth2 Proxy 등 외부 경로 권장 |
| ssl-redirect 어노테이션 | Gateway TLS 리스너 | 자동 처리 |

URL Rewrite와 헤더 조작은 Gateway API v1 표준이라 구현체를 바꿔도 YAML이 그대로 작동한다[^2]. 반대로 인증·Rate Limiting·IP 제어·세션 어피니티·본문 크기 제한·커스텀 에러 페이지는 구현체별 정책 리소스로 갈린다[^2]. **전환 비용의 대부분은 앞줄이 아니라 이 여섯 기능에서 나온다.**

### 4.2 여덟 기능의 구현체별 대응

문서의 기능 매핑을 압축하면 아래와 같다[^1][^2]. "미지원"은 별도 도구가 필요하다는 뜻이다.

| 기능 | AWS Native | Cilium | NGINX Gateway Fabric | Envoy Gateway | kGateway |
|---|---|---|---|---|---|
| 인증 | LBC 확장 JWT 검증 | 미지원(외부 인증 서비스) | Basic 인증 필터(OIDC 별도) | `SecurityPolicy.extAuth` | `GatewayExtension` JWT |
| Rate Limiting | WAF Rate-based Rule | `CiliumEnvoyConfig` 로컬 필터 | `NginxProxy.rateLimiting` | `BackendTrafficPolicy` | `TrafficPolicy` |
| IP Allowlist | WAF IPSet + WebACL | `CiliumNetworkPolicy` | `NginxProxy.ipFiltering` | `SecurityPolicy.authorization` | NetworkPolicy |
| URL Rewrite | HTTPRoute 필터 | HTTPRoute 필터 | HTTPRoute 필터 | HTTPRoute 필터 | HTTPRoute 필터 |
| 헤더 조작 | HTTPRoute 필터 | HTTPRoute 필터 | HTTPRoute 필터 | HTTPRoute 필터 | HTTPRoute 필터 |
| 세션 어피니티 | Target Group Stickiness | CEC ring hash | HTTPRoute `sessionPersistence` | `BackendTrafficPolicy` consistentHash | HTTPRoute `sessionPersistence` |
| 본문 크기 제한 | WAF SizeConstraint | CEC buffer 필터 | `NginxProxy.clientMaxBodySize` | `ClientTrafficPolicy` | `TrafficPolicy.buffer` |
| 커스텀 에러 페이지 | ALB Fixed Response | 미지원(에러 페이지 서비스) | 에러 서비스 + NginxProxy | `DirectResponse` | `DirectResponse` |

각 행에서 확인해야 할 숫자와 조건이 다르다. 몇 가지만 짚어 두면 이렇다[^2].

- **WAF Rate-based Rule**은 `limit`(예: 500)과 `aggregateKeyType: IP` 조합으로 동작하고, 허용 범위는 100~2,000,000,000이다. ALB당 WebACL은 하나이므로 IP Allowlist·Rate Limit·본문 제한을 한 WebACL에 `priority`로 통합한다.
- **Cilium 로컬 Rate Limit**은 Envoy 프로세스 단위 token bucket이다(문서 예시 `max_tokens: 200`, 초당 100 보충). 클러스터 전체 quota나 사용자별 quota로 쓰면 안 된다.
- **Cilium 본문 제한**은 buffer 필터의 `max_request_bytes`(예: 10485760 = 10 MiB)로, 초과분은 HTTP 413으로 거부된다. 본문 전체를 버퍼링하므로 스트리밍·메모리 영향과 압축 해제 후 payload 크기를 따로 검증한다.
- **Envoy Gateway extAuth**는 `failOpen: false`가 기본 판단에 가까운 설정이다. authorizer가 죽었을 때 트래픽을 통과시키지 않겠다는 뜻이고, 이는 가용성과 보안의 맞바꿈이므로 명시적으로 선택한다.
- **JWT 검증은 인증 브라우저 리다이렉트(OIDC 로그인)와 다른 기능**이다. 토큰이 백엔드로 그대로 전달되는지, identity 헤더를 신뢰 계약 없이 붙이지 않는지 확인한다.

### 4.3 표준 기능과 구현체 확장의 구분

세션 어피니티를 예로 들면 경계가 분명하다. `HTTPRoute`의 `sessionPersistence`를 쓰는 구현체는 Gateway API v1.4.1 실험 채널 CRD가 필요하고, NGINX 경로는 Plus와 experimental 기능 활성화를 전제로 한다[^2]. Cilium은 네이티브 쿠키 어피니티가 없어 Envoy ring hash로 우회하고, AWS Native는 Target Group Stickiness 어노테이션을 쓴다[^2].

정리하면 판단 기준은 두 가지다. 첫째, **라우팅 자체는 표준 리소스로 유지**한다(이식성 확보). 둘째, **정책은 구현체 확장 리소스로 격리**하고, 그 확장이 실험 채널에 의존하면 업그레이드 계획에 그 사실을 적어 둔다. 같은 HTTPRoute에 표준 필터와 확장 정책을 섞을 때 "정책들이 자동으로 합쳐질 것"이라고 가정하지 않는 것도 중요하다[^2].

---

## 5. 5단계 마이그레이션 절차

![Gateway API 마이그레이션 5단계 흐름과 단계별 기간](/assets/images/k8s/gateway-api-migration-phases.webp)

### 5.1 Phase 1 준비: 인벤토리와 리스크

첫 작업은 코드가 아니라 조사다. 전체 Ingress를 JSON으로 덤프해 네임스페이스·클래스·호스트·경로·TLS 유무를 요약하고, 통계로 규모를 확정한다[^3].

```bash
kubectl get ingress -A -o json > ingress-inventory.json
kubectl get ingress -A -o json | jq -r '
  .items[] | {
    namespace: .metadata.namespace,
    name: .metadata.name,
    class: .spec.ingressClassName,
    hosts: [.spec.rules[].host],
    paths: [.spec.rules[].http.paths[].path],
    tls: (.spec.tls != null)
  }' > ingress-summary.json
```

이어서 §4.1 표를 그대로 기능 매핑표로 쓰고, 리스크를 문서화한다[^3]. 문서 예시의 리스크 항목 구조는 실무에 그대로 쓸 만하다.

| ID | 범주 | 리스크 | 심각도 | 완화 |
|---|---|---|---|---|
| RISK-001 | 기능 누락 | rate-limit 어노테이션의 직접 대안 없음 | MEDIUM | WAF 또는 Envoy Rate Limit 서비스로 대체 |
| RISK-002 | 다운타임 | CNI 교체 시 파드 네트워크 중단 | HIGH | 블루-그린 클러스터 전환 또는 유지보수 창 |
| RISK-003 | 학습 곡선 | 팀의 Gateway API 경험 부족 | LOW | Phase 2 PoC 기간 확보 |

### 5.2 Phase 2 구축: CRD와 PoC

CRD는 컨트롤러가 지원하는 버전과 맞춰야 한다. 문서 공통 예시는 Cilium 1.19.3 기준 Gateway API v1.4.1이고, Standard와 Experimental 번들을 서로 다른 릴리스로 덮어쓰지 않는다[^3].

```bash
# Standard 채널 (Cilium 1.19.3 기준)
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.4.1/standard-install.yaml

# 실험 리소스가 필요하면 같은 버전의 번들을 대신 선택
# kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.4.1/experimental-install.yaml
```

컨트롤러 설치는 구현체마다 다르고, 각자의 호환성 문서를 따라야 한다[^3].

- **AWS LBC v3.0.0**: 공식 가이드는 Gateway API v1.3.0 기준이며 LBC Gateway CRD가 추가로 필요하다. IRSA를 만들고 차트 버전을 명시해 설치한 뒤 `ALBGatewayAPI`·`NLBGatewayAPI` feature gate를 켠다.
- **NGINX Gateway Fabric**: 릴리스에 맞는 `crds.yaml`과 `nginx-gateway.yaml`을 적용한다.
- **Envoy Gateway**: Helm 차트(`gateway-helm`)를 버전 고정해 설치한다.
- **Cilium**: `gatewayAPI.enabled=true`로 설치되므로 GatewayClass만 확인하면 된다.

PoC는 dev 네임스페이스에서 Gateway + HTTPRoute 한 쌍으로 시작하고, Gateway 주소가 IP인지 호스트명인지에 따라 Route 53 레코드 타입을 결정한다[^3]. IPv4 주소면 A 레코드, 로드밸런서 호스트명이면 Alias 레코드를 쓴다. 성능은 k6로 부하를 주고 p95·에러율을 기준으로 판단한다(문서 예시: p95 200ms 미만, 실패율 1% 미만)[^3]. 단일 요청의 `time_total`은 벤치마크가 아니다.

### 5.3 Phase 3 병렬 운영: 내부 검증

기존 Ingress를 살려 둔 채 같은 백엔드를 가리키는 Gateway/HTTPRoute를 만든다[^3]. 핵심은 DNS를 건드리지 않고 새 경로를 검증하는 것이다.

```bash
GATEWAY_ADDRESS=$(kubectl get gateway production-gateway -n infra -o jsonpath='{.status.addresses[0].value}')

# --connect-to는 목적지만 바꾸고 Host·TLS SNI·인증서 검증은 유지한다
curl --fail-with-body --connect-to "api.example.com:443:${GATEWAY_ADDRESS}:443" \
  https://api.example.com/api/v1/health
```

여기서 확인할 것은 응답 코드만이 아니다. Gateway가 `Programmed=True`인지, HTTPRoute가 해당 parent에 `Accepted=True`·`ResolvedRefs=True`인지, 백엔드 EndpointSlice에 ready 엔드포인트가 있는지를 함께 본다[^3]. 문서의 검증 스크립트는 이 세 조건을 `observedGeneration`까지 비교해 확인한다[^3].

### 5.4 Phase 4 전환: DNS 가중치

전환은 Route 53 가중치 라우팅으로 단계적으로 한다. 90:10 → 50:50 → 100:0 순서이고, 각 단계에서 24시간~1주 모니터링한다[^3]. 가중치는 DNS 응답 선택 비율이지 HTTP 요청의 정확한 비율이 아니다. 캐시를 고려해 TTL 60초를 유지하는 것이 롤백 속도를 결정한다[^3].

주의할 점도 문서가 짚는다. 기존 simple 레코드가 있으면 같은 이름의 가중 레코드와 충돌하므로 별도 변경 배치로 계획한다. 로드밸런서 호스트명에는 가중 Alias 레코드와 canonical hosted zone ID를 써야 하고, IPv6면 AAAA를 쓴다[^3].

### 5.5 Phase 5 완료: 백업과 제거

성공 기준을 통과했으면 Ingress 리소스와 컨트롤러 구성을 백업한 뒤 제거한다[^3]. 제거는 마이그레이션이 끝난 리소스 이름을 지정해서 하고, Ingress 전체 삭제나 공유 네임스페이스 삭제는 하지 않는다. Helm 릴리스도 그 릴리스를 쓰는 Ingress가 더 없을 때만 uninstall한다. 문서는 제거 시점을 2주 후로 잡는다[^3].

```bash
kubectl get ingress -A -o yaml > backup-ingress-resources-$(date +%Y%m%d).yaml
kubectl get deployment ingress-nginx-controller -n ingress-nginx -o yaml > backup-nginx-controller.yaml
kubectl get cm ingress-nginx-controller -n ingress-nginx -o yaml > backup-nginx-configmap.yaml
```

---

## 6. Cilium ENI 모드 게이트웨이(개념·설치 개요)

고성능·관측성 축에서 자주 검토되는 조합이 Cilium ENI 모드 + Gateway API다. 개념과 운영 포인트만 압축한다[^4].

### 6.1 ENI 모드의 데이터패스

ENI(Elastic Network Interface) 모드는 오버레이 캡슐화 대신 AWS ENI를 직접 써서 파드에 VPC IP를 할당하고, VPC 라우팅 테이블로 네이티브 라우팅한다[^4]. Security Group은 ENI에, NACL은 서브넷에 적용되고 VPC Flow Logs로 흐름을 볼 수 있다. 다만 이 구조가 곧 "파드별 Security Group"을 뜻하지는 않는다(그건 VPC CNI의 별도 기능이다)[^4].

요청이 백엔드 파드까지 가는 경로는 네 단계다[^4].

```text
[Client]
   │  TCP 443
   ▼
1) NLB (L4)              → 헬스체크 기준으로 정상 노드 선택, 5-tuple flow hash로 연결 고정
   ▼
2) eBPF TPROXY           → Service 트래픽을 가로채 연결 추적 맵 확인, 신규 연결만 로컬 Envoy로 전달
   ▼
3) Cilium Envoy (L7)     → HTTPRoute 매칭, 헤더·경로 검증, rewrite·rate limit·인증 정책 적용
   ▼
4) 네이티브 라우팅        → 백엔드 파드의 ENI IP로 직접 전달 (VXLAN/Geneve 캡슐화 없음)
```

구성 요소는 NLB, eBPF TPROXY, Cilium Envoy, Cilium Operator(ENI 생성·삭제, IPAM, CiliumNode 상태), Cilium Agent(DaemonSet, eBPF 프로그램·CNI·정책), ENI, Hubble이다[^4]. 여기서 기억할 제약이 하나 있다. **L7 처리 자체는 사용자 공간 Envoy에서 일어나므로 커널을 완전히 우회하는 구조가 아니다**[^4]. XDP 가속은 지원되는 별도 L4 전달 경로의 옵션이고 TPROXY와 같은 기능이 아니다. 이 아키텍처에서 Cilium Envoy가 GatewayClass 구현체 역할을 하고, HTTPRoute 변경은 Operator를 거쳐 각 노드 Envoy 설정으로 동적으로 반영된다[^4].

또 하나, ENI/파드 IP 한도는 인스턴스 타입이 결정한다(예: m5.large는 ENI 3개, ENI당 IP 10개)[^4]. Prefix Delegation을 켜면 /28 블록(16개 주소) 단위로 할당해 효율을 올릴 수 있지만, 고정된 개선율을 보장하지는 않는다[^4].

### 6.2 설치 개요

신규 클러스터가 훨씬 깔끔하다. VPC CNI가 설치되지 않은 상태에서 Cilium을 올리면 다운타임 없이 진행된다[^4]. eksctl 설정에서 `addonsConfig.disableDefaultAddons: true`로 기본 애드온(VPC CNI, kube-proxy, CoreDNS)을 끄고 클러스터를 만든 뒤, Gateway API CRD(v1.4.1) → Cilium Helm 설치 순으로 간다[^4].

Helm values에서 봐야 할 축은 다섯 가지다[^4].

| 축 | 대표 값 | 의미 |
|---|---|---|
| ENI | `eni.enabled: true`, `awsEnablePrefixDelegation: true`, `awsReleaseExcessIPs: true` | ENI/IPAM을 AWS에 위임, 미사용 IP 반환 |
| IPAM | `ipam.mode: "eni"` | 파드 IP를 VPC에서 직접 할당 |
| 라우팅 | `routingMode: native`, `ipv4NativeRoutingCIDR` | 오버레이 제거, VPC 라우팅 사용 |
| kube-proxy | `kubeProxyReplacement: true`, `k8sServiceHost`·`k8sServicePort` | Service 처리를 eBPF로 이관 |
| Gateway/관측 | `gatewayAPI.enabled: true`, `gatewayAPI.hostNetwork.enabled: false`(NLB 사용 시), `hubble.*` | GatewayClass 제공, Hubble relay/UI/메트릭 |

성능 관련 값(`bpf.preallocateMaps`, `mapDynamicSizeRatio`, `lbMapMax` 등)은 문서가 제시하는 출발점일 뿐이므로, 노드 메모리와 Service 수를 보고 조정한다[^4]. 기존 클러스터 전환은 순서가 더 중요하다. 파드·서비스·인그레스와 `aws-node` DaemonSet 구성을 백업하고, VPC CNI와 kube-proxy DaemonSet을 제거한 뒤 Cilium을 올린다. 이 과정에서 파드 네트워크가 일시적으로 끊긴다는 경고가 문서에 명시돼 있다[^4].

### 6.3 BGP Control Plane v2

BGP Control Plane v2는 LoadBalancer IP를 BGP로 광고해야 하는 온프레미스·하이브리드 환경을 위한 기능이다. 여기서 흔한 오해를 먼저 정리한다. **AWS NLB 주소를 Cilium이 BGP로 광고하는 구성이 아니다.** 라우터에서 노드로 전달 가능한, 겹치지 않는 별도 Service VIP 풀을 소유한 환경의 구성이다[^4].

v2는 세 리소스로 나뉜다. `CiliumBGPClusterConfig`(노드 선택과 BGP 인스턴스·피어 정의, 예: localASN 64512) → `CiliumBGPPeerConfig`(multihop, hold/keepalive 타이머, 광고 family) → `CiliumBGPAdvertisement`(`LoadBalancerIP` 광고와 selector 선택)[^4]. 이전 v1 API인 `CiliumBGPPeeringPolicy`는 별개이므로 예제를 섞지 않는다. VIP 풀은 `CiliumLoadBalancerIPPool`로 정의하고, Service에는 `loadBalancerClass: io.cilium/bgp-control-plane`을 지정한다[^4]. 전제 조건은 `bgpControlPlane.enabled=true`, 선택된 노드, TCP/179 연결, 왕복 데이터 경로, 라우터 설정이다. Direct Connect나 VPN만으로 VIP 라우팅이 자동 구성되지는 않는다[^4].

### 6.4 하이브리드 노드와 AI 워크로드

하이브리드 노드에서 Cilium이 필요해지는 이유는 단순하다. AWS VPC CNI는 VPC 안의 EC2에서만 동작하므로, 온프레미스 GPU 서버를 EKS Hybrid Nodes로 붙이면 클라우드와 온프레미스 노드의 CNI가 갈라진다[^4]. Cilium을 단일 CNI로 쓰면 CNI 단일화 + Hubble 통합 관측성 + Gateway API 내장을 한 번에 가져간다.

다만 여기서도 구분이 필요하다. **Cilium을 CNI로 쓰는 것과 Cilium Gateway가 InferencePool을 지원하는 것은 별개 기능**이다[^4]. 추론 라우팅은 llm-d 계열 스택과 Gateway API Inference Extension 조합으로 구성하고(문서 기준 llm-d v0.8.1, router v0.9.0, GIE v1.5.0, Gateway API v1.5.1), `InferencePool`은 `inference.networking.k8s.io/v1` API를 쓴다[^4]. 프록시 홉이 하나 늘어나는 토폴로지이므로 지연·타임아웃·재시도·스트리밍·인증 헤더 전달을 별도로 검증해야 한다[^4]. Azure 쪽에서도 Azure CNI와 Azure CNI Powered by Cilium 중 무엇을 쓰느냐가 같은 "CNI 단일화" 결정에 해당한다. 데이터패스 구현이 다르므로 이 글의 Cilium 수치를 그대로 옮기지는 않는다.

---

## 실무 적용: 전환 계획·검증·롤백

### 전환 판단표

먼저 "옮길 것인가, 언제 옮길 것인가"를 정한다. 트래픽 규모와 기능 의존도가 기준이다.

| 조건 | 판단 | 이유 |
|---|---|---|
| ingress-nginx 사용 중, EOL 이후 | 즉시 계획 수립 | 패치 부재 상태 |
| 인증·Rate Limit·IP 제어를 어노테이션으로 다수 사용 | Phase 1을 길게(2주 이상) | §4.2 대응표에서 대안이 갈리는 구간 |
| TLS 인증서를 cert-manager Ingress 어노테이션에 의존 | Gateway용 Certificate CRD 전환 선행 | 실측 사례에서 자주 걸리는 지점 |
| 단일 호스트·단순 Prefix 라우팅 | 4주 안에 전환 가능 | 표준 기능만 사용 |
| WAF 규칙 3개 이상 필요 | AWS Native 우선 검토 | WebACL 단일 연결 제약과 규칙 통합 |
| 클러스터 내 추론 트래픽 라우팅 예정 | Implement체 재평가(추론 계층 분리) | 범용 게이트웨이와 추론 게이트웨이는 별개 |

### 기능 대응 체크리스트

인벤토리에서 뽑은 기능마다 "대안이 있는가 / 누가 구현하는가 / 검증 방법이 있는가"를 세 칸으로 채운다. 하나라도 비면 그 기능은 전환 대상에서 빠진다.

| 기능 | 대안 리소스 | 소유 팀 | 검증 |
|---|---|---|---|
| 호스트·경로 라우팅 | HTTPRoute matches | 앱 | `curl --connect-to` 프로브 2xx/3xx |
| TLS 종료 | Gateway listener `tls.mode: Terminate` + Secret | 플랫폼 | Secret 타입 `kubernetes.io/tls`, `tls.crt`·`tls.key` 존재, 만료일 |
| URL Rewrite·헤더 조작 | HTTPRoute filters | 앱 | 리다이렉트·응답 헤더 확인 |
| 인증 | 구현체 정책 또는 외부 인증 서비스 | 플랫폼 | 정상·누락·변조·만료 토큰, authorizer 장애 시 동작 |
| Rate Limit | WAF Rate-based 또는 구현체 정책 | 플랫폼 | 임계 초과 시 429/차단, 프로세스 단위 한계 확인 |
| IP Allowlist | WAF IPSet 또는 정책/NetworkPolicy | 플랫폼 | 허용·차단 대역 각각 실측 |
| 세션 어피니티 | 구현체 어피니티 설정 | 앱 | 쿠키 고정 동작, 실험 채널 의존 여부 기록 |
| 본문 크기 제한 | WAF SizeConstraint 또는 buffer 설정 | 플랫폼 | 초과 요청 413, 압축 해제 후 크기 |
| 커스텀 에러 페이지 | 에러 서비스 라우팅 또는 DirectResponse | 앱 | 점검 경로 응답 코드·본문 |

### 무중단 전환 절차

1. Phase 1 산출물(인벤토리·기능 매핑·리스크) 승인 — 미승인 항목은 별도 티켓으로 분리한다.
2. CRD·컨트롤러 설치(버전 고정), dev PoC에서 Gateway + HTTPRoute 1쌍 기동.
3. PoC 부하 테스트로 p95·에러율 기준선 확정. 단일 요청 지연은 근거로 쓰지 않는다.
4. 운영 백엔드를 가리키는 Gateway/HTTPRoute를 기존 Ingress와 병행 배포.
5. `--connect-to`로 DNS 변경 없이 내부 검증(Gateway `Programmed`, Route `Accepted`/`ResolvedRefs`, ready 엔드포인트).
6. Route 53 가중치 10% 전환, TTL 60초 유지, 24시간 모니터링.
7. 50% 전환, 1주 모니터링. 이 단계에서 에러율·지연이 기준선을 벗어나면 즉시 0%로 되돌린다.
8. 100% 전환 후 2주 유지. 문제 없으면 Ingress 백업 → 리소스 제거 → 문서화.

### 롤백 기준

롤백은 "결정한 사람의 판단"이 아니라 숫자로 트리거한다. 아래 중 하나라도 걸리면 가중치를 직전 값으로 되돌린다.

| 트리거 | 임계(예시) | 조치 |
|---|---|---|
| 5xx 비율 | 전환 전 기준선 대비 유의미한 상승 | 가중치 0% 복귀, Route/정책 조건 재확인 |
| p95 지연 | 기준선 대비 악화 | 가중치 복귀, 프록시 홉·정책 평가 비용 확인 |
| 인증 실패 급증 | 401/403 증가 | 인증 정책 우회 여부 확인 후 복귀 |
| 특정 경로 404/503 | 단일 경로라도 지속 | PathPrefix vs Exact, 엔드포인트 확인 |
| Gateway 상태 이상 | `Programmed=False` 지속 | 컨트롤러 로그·LB 상태 확인 |

TTL을 60초로 유지하는 이유가 여기 있다. 가중치를 되돌려도 DNS 캐시 만료까지 시간이 걸리므로, TTL 300초로 올리는 것은 100% 전환이 안정된 뒤에 한다[^3].

### 검증 명령

구현체별로 먼저 볼 명령이 다르다[^3].

| 구현체 | 상태 확인 | 데이터플레인 확인 |
|---|---|---|
| AWS LBC | `kubectl describe httproute <name> -n <ns>` | NLB 이름 조회 후 `aws elbv2 describe-target-health` |
| Cilium | `cilium status --wait` | `cilium service list`, `cilium envoy config dump`, `hubble observe --protocol http --port 443` |
| NGINX Gateway Fabric | `kubectl describe httproute <name> -n <ns>` | `nginx -T`, 컨트롤러 접근 로그 |
| Envoy Gateway | 컨트롤러·프록시 로그 | Admin 포트(19000) 포워딩 후 `config_dump` |

공통으로는 Gateway/HTTPRoute status, Service Endpoints, Pod Ready, NetworkPolicy, 최근 이벤트를 순서대로 확인한다[^3]. 증상별 원인은 아래 표로 좁힌다[^3].

| 증상 | 원인 후보 | 확인 |
|---|---|---|
| `HTTPRoute Accepted=False` | parentRefs·리스너 불일치, hostname 교집합 없음, allowedRoutes 정책 | `parentRefs`, 리스너 이름, 네임스페이스 정책 |
| `HTTPRoute ResolvedRefs=False` | 백엔드 참조 해석 실패 | Service 이름·포트·kind, ReferenceGrant, 조건 message |
| `Gateway Programmed=False` | 데이터플레인 구성 미완료 | 리스너 조건, 컨트롤러 로그, LB 상태, 인증서 Secret |
| 503 | 백엔드 엔드포인트 없음 | Endpoints, Pod selector, Pod Ready |
| TLS 인증서 오류 | Secret 형식 오류 | `kubernetes.io/tls` 타입, 키 존재, 만료 |
| 404 | 경로 매칭 실패 | PathPrefix vs Exact, 대소문자, URL 인코딩 |
| Gateway 주소 없음 | LB 생성 실패 | 쿼터, 서브넷 IP 고갈, 어노테이션 오타 |

---

## References

[^1]: Engineering Playbook — `docs/eks-best-practices/networking-performance/gateway-api-adoption-guide/index.md` (devfloor9.github.io/engineering-playbook) — NGINX Ingress 은퇴 배경, Gateway API 3계층 모델과 GA 현황, 구현체 비교·시나리오 권장.
[^2]: Engineering Playbook — `docs/eks-best-practices/networking-performance/gateway-api-adoption-guide/feature-implementation-cookbook.md` (devfloor9.github.io/engineering-playbook) — 인증·Rate Limiting·IP 제어·Rewrite·헤더·세션 어피니티·본문 제한·커스텀 에러 페이지의 구현체별 구현과 제약.
[^3]: Engineering Playbook — `docs/eks-best-practices/networking-performance/gateway-api-adoption-guide/migration-execution-strategy.md` (devfloor9.github.io/engineering-playbook) — CRD 사전 요구사항, 5-Phase 절차, 검증 스크립트와 트러블슈팅.
[^4]: Engineering Playbook — `docs/eks-best-practices/networking-performance/gateway-api-adoption-guide/cilium-eni-gateway-api.md` (devfloor9.github.io/engineering-playbook) — Cilium ENI 모드 데이터패스, 설치 흐름, BGP Control Plane v2, 하이브리드 노드와 AI 워크로드.
[^5]: Kubernetes Blog — ingress-nginx retirement 공지(2025-11), 본 문서(주석 [^1])가 인용한 원 발표 자료.
