---
layout: single
title: "쿠버네티스 AI 추론 스택 추상화: kro(Kube Resource Orchestrator) ResourceGraphDefinition과 Crossplane v2 아키텍처 비교"
excerpt: "현대 쿠버네티스 AI 추론 서비스 하나를 배포하기 위해 DRA GPU 할당, LeaderWorkerSet, GAIE 라우팅, Tetragon 보안 등 6개 이상의 CRD를 수백 줄로 엮어야 하는 매니페스트 파편화 문제를 해부한다. CEL 기반 유향 비순환 그래프(DAG)로 인클러스터 리소스를 합성하는 kro(Kube Resource Orchestrator)의 ResourceGraphDefinition 메커니즘과, 네임스페이스 스코프 Managed Resource로 재설계된 Crossplane v2의 아키텍처 및 플랫폼 엔지니어링 역할 분담을 비교한다."
categories: [cloud]
tags: [cloud, k8s, kubernetes, kro, crossplane, platform-engineering, crd, cel, gitops, 정리, 설명]
toc: true
toc_sticky: true
sidebar_main: true
date: 2026-10-30
last_modified_at: 2026-10-31
---

엔터프라이즈 환경에서 대규모 언어 모델(LLM)이나 멀티모달 에이전트 서비스를 쿠버네티스(Kubernetes) 클러스터 위에 프로덕션 수준으로 배포하는 작업은 더 이상 단일 `Deployment`와 `Service` 두 개의 YAML 파일로 끝나지 않는다. 앞서 살펴본 [쿠버네티스 DRA(Dynamic Resource Allocation) 기반 GPU 스케줄링](/k8s/kubernetes-dra-dynamic-resource-allocation-gpu/)[^1]을 통해 NVLink 및 RDMA NIC 토폴로지를 할당하고, [분리형 서빙(Disaggregated Serving) 및 Gateway API Inference Extension(GAIE)](/llm/enterprise-ai-platform-disaggregated-serving-kvcache-gaie/)[^2]으로 프리필(Prefill)과 디코드(Decode) 파드 풀을 제어하며, [Cilium Tetragon eBPF 커널 보안 및 OTel GenAI 관측성](/k8s/ebpf-ai-observability-cilium-tetragon-otel-genai-trajectory-eval/)[^3]까지 결합하면 단일 모델을 서빙하기 위해 최소 6개 이상의 **사용자 정의 리소스 정의(CustomResourceDefinition, CRD)** 인스턴스를 상호 참조로 엮어야 한다.

문제는 플랫폼 위에서 모델을 배포하려는 애플리케이션 엔지니어와 ML 연구원에게 이러한 하부 인프라 CRD의 세부 스펙을 직접 작성하도록 요구할 때 발생한다. 서비스 하나당 400~700줄에 달하는 YAML 보일러플레이트가 수십 개 팀의 Git 저장소로 복제되면서 레이블 셀렉터 불일치, 보안 정책 누락, 버전 파편화 같은 **설정 드리프트(Configuration Drift)**가 일상화된다. 기존 [IaC와 GitOps 실전 아키텍처(Terraform·Helm·ArgoCD·Flux)](/cloud/iac-gitops/)[^4]에서 표준으로 쓰이던 Helm 차트는 정적 문자열 치환에 기반하므로, 선행 리소스의 런타임 상태(`status`)를 읽어 후행 리소스의 스펙(`spec`)에 주입하는 동적 의존성 오케스트레이션을 수행하지 못한다.

인클러스터 AI 추론 스택과 클라우드 외부 리소스를 플랫폼 엔지니어링 관점에서 어떻게 단일 추상화 API로 캡슐화할 것인지 고민하면서, 쿠버네티스 네이티브 리소스 합성기인 **kro(Kube Resource Orchestrator)**[^5]와 2025년 하반기에 아키텍처를 전면 개편한 **Crossplane v2**[^6]의 내부 동작 원리 및 조합 패턴을 개인 연구 및 아키텍처 리뷰 목적으로 정리해 보았습니다.

---

## 1. AI 서비스 하나를 배포하기 위해 왜 6개의 CRD를 손으로 엮어야 하는가

현대 쿠버네티스 기반 AI 플랫폼은 워크로드의 하드웨어 친화성(Hardware Affinity), 멀티노드 분산 통신, KV 캐시 인지형 라우팅, 커널 샌드박싱을 각각 독립된 도메인 오퍼레이터(Operator)로 분리하여 진화해 왔다. 이 모듈화 전략은 개별 컴포넌트의 전문성을 높였으나, 최종 사용자 관점에서는 심각한 **매니페스트 파편화(Manifest Fragmentation)**를 초래했다.

### 1.1 현대 쿠버네티스 AI 추론 스택의 매니페스트 파편화와 설정 드리프트

프로덕션 클러스터에 70B 이상의 LLM 추론 서비스 하나를 온보딩할 때 플랫폼이 요구하는 표준 리소스 그래프는 다음 6종의 CRD로 구성된다.

1. **하드웨어 토폴로지 할당 (`ResourceClaimTemplate`, `resource.k8s.io/v1`)**:
   - 쿠버네티스 DRA 드라이버를 호출하여 동일 NVSwitch 도메인 내의 GPU 4~8장과 RoCE v2 RDMA NIC를 원자적으로 묶어 요청한다[^1].
2. **멀티노드 분산 추론 워크로드 (`LeaderWorkerSet`, `leaderworkerset.x-k8s.io/v1`)**:
   - 텐서 병렬화(TP)와 파이프라인 병렬화(PP)를 수행하는 리더(Leader) 파드와 워커(Worker) 파드 세트를 단일 라이프사이클 단위로 묶고, gang 스케줄링과 토폴로지 정렬 재시작을 보장한다[^7].
3. **KV 캐시 및 큐 깊이 인식 백엔드 풀 (`InferencePool`, `inference.networking.x-k8s.io/v1alpha2`)**:
   - GAIE 엔드포인트 피커(Endpoint Picker, EPP)가 추론 워커들의 실시간 KV 캐시 점유율과 대기열 길이를 수집할 대상 파드 셀렉터와 포트를 정의한다[^2].
4. **L7 추론 트래픽 라우팅 (`InferenceModel` 및 `HTTPRoute`, `gateway.networking.k8s.io/v1`)**:
   - 외부에 노출되는 모델 이름(예: `deepseek-r1-70b`), 어댑터(LoRA) 버전별 가중치 분할, 테넌트 우선순위(Criticality)를 `InferencePool`과 연결한다.
5. **커널 수준 런타임 샌드박싱 (`TracingPolicyNamespaced`, `cilium.io/v1alpha1`)**:
   - 추론 컨테이너 내부에서 비인가 바이너리 실행(`sys_execve`)이나 사설망 외부로의 무단 소켓 연결(`tcp_connect`)을 eBPF 커널 훅에서 즉시 차단(`Sigkill`)한다[^3].
6. **메트릭 기반 오토스케일링 및 가용성 보장 (`HorizontalPodAutoscaler` / `PodDisruptionBudget`)**:
   - 토큰 생성 지연 시간(TPOT)이나 프리필 큐 깊이에 따라 `LeaderWorkerSet`의 복제본 수를 조절하고 노드 드레인 시 최소 가용 복제본을 방어한다.

클러스터에서 운영하는 모델 서비스의 수를 $M$, 서비스당 결합되는 이기종 CRD의 수를 $K$($K \ge 6$), 리소스 쌍 사이에 존재하는 평균 이름·레이블·시크릿 참조 간선 수를 $\bar{p}_{\text{ref}}$라고 하자. 수동 YAML 관리 환경에서 전체 상호 참조 간선 수 $E_{\text{total}}$은 다음과 같이 증가한다.

$$E_{\text{total}}(M, K) = M \times \binom{K}{2} \bar{p}_{\text{ref}} = \frac{M \cdot K(K - 1)}{2} \bar{p}_{\text{ref}}$$

개별 참조 간선 하나를 사람이 수정할 때 오타나 셀렉터 불일치가 발생할 확률을 $\epsilon$($0 < \epsilon \ll 1$)이라 할 때, 한 번의 릴리스 배포에서 클러스터 내 최소 1개 이상의 서비스에서 참조 불일치 장애가 발생할 확률 $P_{\text{drift}}$는 다음과 같이 수렴한다.

$$P_{\text{drift}}(M, K) = 1 - (1 - \epsilon)^{E_{\text{total}}(M, K)} \approx 1 - \exp\left(-\frac{\epsilon \cdot \bar{p}_{\text{ref}} \cdot M \cdot K(K - 1)}{2}\right)$$

예를 들어 $M = 25$개 모델 서비스, $K = 6$개 CRD, $\bar{p}_{\text{ref}} = 1.6$, 간선당 휴먼 에러율 $\epsilon = 0.002$(0.2%)인 환경에서도 $E_{\text{total}} = 600$개에 달하여, 릴리스마다 설정 불일치가 발생할 확률은 $P_{\text{drift}} \approx 1 - (0.998)^{600} \approx 69.9\%$까지 치솟는다.

### 1.2 Helm 템플릿 엔진의 구조적 한계: 문자열 치환과 단발성 렌더링

전통적으로 플랫폼 팀은 이러한 다중 리소스 보일러플레이트를 감추기 위해 **헬름(Helm)** 차트를 작성해 왔다. 그러나 Go 템플릿(`text/template`)에 기반한 Helm 아키텍처는 현대 AI 추론 스택을 추상화할 때 세 가지 구조적 한계를 드러낸다.

- **비타입화 문자열 치환(Untyped Text Interpolation)**:
  - Helm은 쿠버네티스 리소스의 **추상 구문 트리(Abstract Syntax Tree, AST)**나 OpenAPI v3 스키마를 이해하지 못한 채 공백 들여쓰기(`nindent 4`)와 문자열 이어붙이기를 수행한다. `values.yaml`에 정수 대신 문자열을 넣거나 존재하지 않는 CRD 필드 경로를 작성해도 차트 패키징 시점에는 검출되지 않으며, 실제 클러스터 API 서버에 적용될 때야 실패한다.
- **런타임 상태 전파(Status Propagation) 및 순서 제어 부재**:
  - Helm은 클라이언트(또는 GitOps 컨트롤러)에서 YAML 텍스트를 한 번 렌더링하여 API 서버로 던지는 **단발성 렌더러(One-shot Renderer)**다. 예를 들어 선행 리소스인 `InferencePool`이나 클라우드 스토리지가 프로비저닝된 후 `.status.addresses[0].value`에 기록되는 런타임 동적 값을 읽어들여 후행 `LeaderWorkerSet`의 환경 변수에 주입하는 작업은 Helm 템플릿만으로는 불가능하다.
- **하위 리소스 드리프트 미감지**:
  - 누군가 운영 중인 클러스터에서 `kubectl edit tracingpolicynamespaced` 명령으로 eBPF 보안 정책을 임의 수정하더라도, Helm은 새로운 차트 리비전 배포가 트리거되기 전까지 이를 감지하거나 원래 상태로 되돌리는 상시 조정 루프(Reconciliation Loop)를 갖지 않는다.

**핵심 요약 — 단일 AI 추론 서비스를 위해 6개 이상의 CRD를 수동이나 Helm 문자열 템플릿으로 엮는 방식은 참조 간선 수에 비례해 설정 불일치 확률을 높이므로, 정적 타입 검증과 런타임 상태 전파를 지원하는 인클러스터 오케스트레이터가 필수적이다.**

---

## 2. kro(Kube Resource Orchestrator) 해부: ResourceGraphDefinition과 CEL DAG

이러한 인클러스터 리소스 합성 문제를 해결하기 위해 AWS, Google Cloud, Microsoft Azure가 공동으로 설계하여 쿠버네티스 생태계에 공개한 오픈소스 컨트롤러가 **kro(Kube Resource Orchestrator)**다[^5]. `kro`는 클라우드 벤더 종속성 없이 표준 쿠버네티스 API만으로 복수의 리소스를 하나의 고수준 API로 캡슐화한다.

![클라우드 외부 인프라를 프로비저닝하는 Crossplane v2와 인클러스터 AI 추론 스택을 합성하는 kro(Kube Resource Orchestrator) 아키텍처 비교](/assets/images/cloud/kubernetes-ai-stack-abstraction-kro-crossplane-v2-cognition.webp)

### 2.1 ResourceGraphDefinition(RGD)과 동적 CRD 합성 메커니즘

`kro`의 핵심 추상화 단위는 **`ResourceGraphDefinition`(RGD, `kro.run/v1alpha1`)**이라는 단일 CRD다. 플랫폼 엔지니어가 클러스터에 RGD 매니페스트를 선언하면 `kro` 컨트롤러는 내부적으로 다음 4단계 파이프라인을 수행한다.

1. **스키마 컴파일 및 동적 CRD 등록**:
   - RGD의 `spec.schema`에 정의된 간결한 타입 선언(`SimpleSchema`)을 파싱하여 표준 쿠버네티스 `CustomResourceDefinition`(`apiextensions.k8s.io/v1`) OpenAPI v3 스키마로 변환한 뒤 API 서버에 즉시 등록한다.
2. **하위 리소스 OpenAPI 스키마 인트로스펙션(Introspection)**:
   - RGD의 `spec.resources` 배열에 나열된 대상 리소스들(`LeaderWorkerSet`, `ResourceClaimTemplate`, `InferencePool` 등)의 스키마를 쿠버네티스 API 서버의 Discovery 엔드포인트에서 조회하여 메모리 상에 타입 심볼 테이블을 구축한다.
3. **정적 표현식 검증 및 유향 비순환 그래프(DAG) 컴파일**:
   - 리소스 간에 작성된 모든 **공통 표현식 언어(Common Expression Language, CEL)**[^8] 참조식을 파싱하여 참조 대상 필드의 존재 여부와 출력·입력 타입 일치 여부를 정적으로 검증하고, 리소스 간 실행 순서 그래프를 생성한다.
4. **동적 마이크로 컨트롤러(Dynamic Controller) 기동**:
   - 검증이 통과되면 RGD 상태가 `Active`로 전환되며, `kro` 프로세스 내부의 동적 인포머(Informer) 및 리컨실러 루프가 새로 등록된 커스텀 리소스(예: `DisaggregatedLLMService`)의 생성·수정·삭제 이벤트와 하위 리소스들의 변화를 상시 감시한다.

### 2.2 SimpleSchema와 튜링 불완전 CEL(Common Expression Language) 정적 타입 검증

수백 줄의 장황한 OpenAPI v3 JSON Schema를 손으로 작성해야 하는 기존 CRD 개발과 달리, `kro`는 **`SimpleSchema`** 문법을 채택하여 스키마 정의 분량을 90% 이상 줄인다[^5].

- **SimpleSchema 타입 선언 예시**:
  - `modelId: string | required=true description="서빙할 모델 식별자"`
  - `gpusPerWorker: integer | default=4 minimum=1 maximum=8`
  - `enableKernelSandbox: boolean | default=true`

더 중요한 아키텍처적 결정은 템플릿 언어로 Go 템플릿이나 범용 스크립트 언어 대신 **튜링 불완전(Turing-incomplete)** 언어인 **CEL(Common Expression Language)**을 채택했다는 점이다[^8].

- **정지 문제(Halting Problem) 원천 배제와 선형 시간 복잡도**:
  - CEL은 무한 루프(`while`), 임의 재귀 호출, 외부 네트워크 I/O를 문법 수준에서 금지한다. 표현식의 추상 구문 트리(AST) 노드 수를 $N_{\text{ast}}$, 컬렉션 크기를 $C$라 할 때, 모든 CEL 표현식의 평가 시간 $T_{\text{eval}}$은 엄격한 상한을 갖는다.
    $$T_{\text{eval}} = \mathcal{O}(N_{\text{ast}} \cdot C)$$
  - 따라서 `kro` 컨트롤러가 수천 개의 리소스 인스턴스를 조정하더라도 특정 표현식 평가가 컨트롤 플레인 스레드를 블로킹(Starvation)하지 않는다.
- **생성 전(Pre-admission) 정적 타입 체킹**:
  - 개발자가 RGD 내부에서 `${lwsCluster.status.readyReplicas}`를 참조하여 정수 연산을 수행하거나, `${draTemplate.metadata.name}`을 문자열 필드에 대입할 때, `kro`는 API 서버의 OpenAPI 스키마와 대조하여 `readyReplicas`가 실제 `integer` 타입인지 RGD 등록 시점에 검증한다. 만약 오타로 `${lwsCluster.status.readyReplica}`(단수형)라고 적으면 인스턴스를 배포하기도 전에 RGD 자체가 거부된다.

### 2.3 유향 비순환 그래프(DAG) 위상 정렬과 런타임 조정 루프(Reconciliation Loop)

`kro`에서는 리소스 간의 생성 순서를 `dependsOn` 같은 수동 배열로 하드코딩할 필요가 없다. 컨트롤러가 CEL 표현식 내부의 심볼 참조를 분석하여 자동으로 **유향 비순환 그래프(Directed Acyclic Graph, DAG)** $G = (V, E)$를 구축한다.

- **의존성 간선 추출 규칙**:
  - RGD 내의 리소스 집합을 $V = \{r_1, r_2, \dots, r_K\}$라 하자. 리소스 $r_j$의 매니페스트 정의 내부에 포함된 CEL 표현식 집합 $\Phi(r_j)$가 리소스 $r_i$의 메타데이터나 상태 필드를 참조하면($\text{ref}(r_i) \in \Phi(r_j)$), `kro`는 유향 간선 $e_{i \to j} = (r_i, r_j) \in E$를 추가한다.
- **순환 참조 검출과 위상 정렬(Topological Sort)**:
  - 칸 알고리즘(Kahn's Algorithm)을 통해 인디그리(In-degree) $\deg^-(r) = 0$인 루트 노드부터 계층 $L_1, L_2, \dots, L_D$로 분할한다. 만약 그래프 내에 순환 경로($r_i \to \dots \to r_i$)가 존재하여 방문된 정점 수가 $|V|$보다 작으면 즉시 `CyclicDependencyDetected` 오류를 반환한다.

위상 정렬된 그래프 깊이 $D$와 각 계층 $L_d$($d = 1, \dots, D$)에 속한 리소스 $r$의 API 적용 시간 $t_{\text{apply}}(r)$ 및 상태 준비 대기 시간(`readyWhen` 조건 충족 시간) $t_{\text{ready}}(r)$에 대해, 전체 추론 스택의 프로비저닝 완료 시간 $T_{\text{provision}}(G)$은 다음과 같이 결정된다.

$$T_{\text{provision}}(G) = \sum_{d=1}^{D} \max_{r \in L_d} \left( t_{\text{apply}}(r) + t_{\text{ready}}(r) \right)$$

즉, 서로 의존성이 없는 리소스들(예: $L_1$ 계층의 `ResourceClaimTemplate`, `TracingPolicyNamespaced`, `InferencePool`)은 병렬로 생성되고, 선행 리소스의 출력이나 준비 상태(`readyWhen: [${lwsCluster.status.readyReplicas >= 1}]`)에 의존하는 후행 리소스는 정확히 해당 조건이 참이 되는 즉시 프로비저닝된다. 또한 `includeWhen` 조건식(예: `${schema.spec.enableKernelSandbox == true}`)을 통해 조건부 리소스 생성 및 제거까지 단일 그래프 안에서 결정론적으로 처리된다.

**핵심 요약 — kro는 SimpleSchema와 튜링 불완전 CEL 표현식을 결합하여 RGD 등록 시점에 정적 타입 안전성을 검증하고, 심볼 참조에서 자동 추론한 DAG 위상 정렬을 통해 인클러스터 리소스들의 생성 순서와 드리프트 복구를 보장한다.**

---

## 3. Crossplane v2(2025.08+) 아키텍처 개편: 네임스페이스 Managed Resources와 Claims의 폐기

`kro`가 쿠버네티스 클러스터 **내부(In-cluster)**의 리소스들을 합성하는 데 집중한다면, 클러스터 **외부(External Cloud)**의 관리형 인프라(VPC, S3 버킷, IAM Role, RDS, Azure CosmosDB 등)를 쿠버네티스 API로 프로비저닝하고 생명주기를 관리하는 사실상의 표준 도구는 CNCF 프로젝트인 **크로스플레인(Crossplane)**이다[^6].

![Flux GitOps Toolkit 컨트롤러 구조: source·kustomize·helm·notification 컨트롤러가 각각 CRD를 감시하고 클러스터 상태를 수렴시키는 구조](/assets/images/cloud/official-flux-gitops-toolkit.webp)
*출처: [GitOps Toolkit Components — Flux 공식 문서](https://fluxcd.io/flux/components/), Apache-2.0 License*

위 Flux GitOps Toolkit 아키텍처[^9]에서 볼 수 있듯, 현대 쿠버네티스 GitOps 파이프라인(`source-controller`가 Git 저장소를 폴링하고 `kustomize-controller`가 네임스페이스별 매니페스트를 조정하는 구조)은 **네임스페이스(Namespace) 기반 멀티테넌시**를 기본 전제로 동작한다[^4]. 그러나 2025년 이전의 Crossplane v1 아키텍처는 이 네임스페이스 경계 모델과 정면으로 충돌하는 구조적 한계를 안고 있었다.

### 3.1 Crossplane v1의 구조적 부채: 클러스터 스코프 MR과 3계층 Claim 보일러플레이트

Crossplane v1에서는 AWS S3 버킷이나 IAM 역할 같은 모든 **관리형 리소스(Managed Resource, MR)**가 예외 없이 **클러스터 스코프(Cluster-scoped)**였다. 이로 인해 실제 운영 환경에서는 세 가지 심각한 엔지니어링 부채가 발생했다.

1. **XR과 Claim(XRC)의 이중 추상화 강제**:
   - 애플리케이션 팀에게 특정 네임스페이스(`team-alpha`) 권한만 부여한 상태에서는 클러스터 스코프인 MR이나 **복합 리소스(Composite Resource, XR)**를 직접 생성하게 할 수 없었다.
   - 결과적으로 플랫폼 팀은 클러스터 스코프 XR 위에 네임스페이스 스코프 프록시 객체인 **클레임(Claim, XRC)**을 얹는 3계층 구조($\text{Claim} \to \text{XR} \to \text{MR}$)를 모든 추상화마다 강제로 작성해야 했다.
2. **네이티브 Patch-and-Transform(P&T)의 가독성 저하**:
   - XR의 필드 값을 하위 MR로 복사하기 위해 `FromCompositeFieldPath`, `ToCompositeFieldPath`, 정규식 변환을 수백 줄의 YAML 배열로 나열하는 네이티브 P&T 방식을 사용했다. 조건문 하나나 리스트 반복문을 표현하기 위해 YAML 코드가 기하급수적으로 비대해졌다.
3. **GitOps 동기화 및 RBAC 병목**:
   - Flux `Kustomization`이나 ArgoCD `Application`이 네임스페이스 단위로 격리되어 있을 때, 네임스페이스 내부의 Claim이 클러스터 스코프의 XR과 MR을 간접 생성하면서 소유권 추적(`ownerReferences`는 네임스페이스 리소스가 클러스터 스코프 리소스를 소유하는 것을 금지함)과 삭제 순서(Finalizer 교착) 문제가 빈번하게 발생했다.

### 3.2 Crossplane v2의 3대 핵심 변화: 네임스페이스 MR, Claims 폐기, Composition Functions

2025년 8월 정식 릴리스된 **Crossplane v2**(`apiextensions.crossplane.io/v2`)는 이러한 v1의 구조적 복잡성을 걷어내고 쿠버네티스 네이티브 멀티테넌시 모델로 아키텍처를 전면 재설계했다[^6].

- **1. 관리형 리소스(Managed Resources)의 네임스페이스 스코프 전환**:
  - Crossplane v2 프로바이더(AWS, Azure, GCP)의 MR들은 이제 기본적으로 **네임스페이스 스코프(Namespaced)**로 동작한다. 애플리케이션 네임스페이스 안에 `Pod`, `Service`와 나란히 S3 `Bucket`이나 IAM `Role`을 직접 배치할 수 있으며, 쿠버네티스 표준 `Role` 및 `RoleBinding`만으로 팀별 클라우드 인프라 접근 통제가 완결된다.
- **2. Claims(XRC) 계층의 완전 폐기와 네임스페이스 XR**:
  - `CompositeResourceDefinition`(XRD v2)에서 생성하는 복합 리소스(XR) 자체가 네임스페이스 스코프(`scope: Namespaced`)를 직접 지원한다.
  - 이에 따라 v1에서 단지 네임스페이스 노출을 위해 존재했던 **Claims(`claimNames`) 메커니즘이 폐기(Deprecated & Removed in v2 API)**되었다. 복합 인프라 하나를 배포할 때 API 서버(etcd)에 생성되는 객체 수가 $\text{Claim} + \text{XR} + K \cdot \text{MR}$에서 $\text{XR} + K \cdot \text{MR}$로 단축되고, 교차 스코프 참조로 인한 GitOps 상태 추적 불일치가 사라졌다.
- **3. 네이티브 Patch-and-Transform 제거와 Composition Functions 전면 도입**:
  - v2의 `Composition`에서는 레거시 YAML 패치 배열(`resources[].patches`)이 제거되고, 모든 합성 로직이 **`mode: Pipeline` 기반의 컴포지션 함수(Composition Functions)**로 일원화되었다[^10].
  - 플랫폼 엔지니어는 Go 템플릿(`function-go-templating`), KCL(`function-kcl`), CEL(`function-cel-filter`), 또는 범용 Python/Go 컨테이너로 작성된 gRPC 함수를 파이프라인 단계로 연결하여 외부 클라우드 리소스들을 프로그래밍 방식으로 조합한다.

### 3.3 클라우드 외부 리소스 프로비저닝을 위한 Crossplane v2 XRD & Composition 예시

AI 추론 워크로드가 모델 가중치(Safetensors)와 LoRA 어댑터를 로드하기 위해 필요한 외부 클라우드 인프라(AWS S3 전용 버킷, KMS 암호화 키, EKS Pod Identity IAM Role)를 프로비저닝하는 Crossplane v2 매니페스트 예시는 다음과 같다.

{% raw %}
```yaml
apiVersion: apiextensions.crossplane.io/v2
kind: CompositeResourceDefinition
metadata:
  name: xaimodelstorages.platform.ingu627.dev
spec:
  # Crossplane v2: Claim 없이 XR 자체를 네임스페이스 스코프로 직접 선언
  scope: Namespaced
  group: platform.ingu627.dev
  names:
    kind: XAIModelStorage
    plural: xaimodelstorages
  versions:
    - name: v1alpha1
      served: true
      referenceable: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              required: [region, modelBucketPrefix, serviceAccountName]
              properties:
                region:
                  type: string
                  default: ap-northeast-2
                modelBucketPrefix:
                  type: string
                serviceAccountName:
                  type: string
            status:
              type: object
              properties:
                bucketArn:
                  type: string
                iamRoleArn:
                  type: string
---
apiVersion: apiextensions.crossplane.io/v2
kind: Composition
metadata:
  name: xaimodelstorage-aws-v2
spec:
  compositeTypeRef:
    apiVersion: platform.ingu627.dev/v1alpha1
    kind: XAIModelStorage
  mode: Pipeline
  pipeline:
    - step: render-aws-storage-and-irsa
      functionRef:
        name: function-go-templating
      input:
        apiVersion: gotemplating.fn.crossplane.io/v1beta1
        kind: GoTemplate
        source: Inline
        inline:
          template: |
            apiVersion: s3.aws.m.upbound.io/v1beta1
            kind: Bucket
            metadata:
              name: {{ .observed.composite.resource.metadata.name }}-weights
              namespace: {{ .observed.composite.resource.metadata.namespace }}
              annotations:
                gotemplating.fn.crossplane.io/composition-resource-name: model-bucket
            spec:
              forProvider:
                region: {{ .observed.composite.resource.spec.region }}
            ---
            apiVersion: v1
            kind: Secret
            metadata:
              name: {{ .observed.composite.resource.metadata.name }}-cloud-env
              namespace: {{ .observed.composite.resource.metadata.namespace }}
              annotations:
                gotemplating.fn.crossplane.io/composition-resource-name: cloud-env-secret
            stringData:
              MODEL_S3_BUCKET_ARN: {{ dig "resources" "model-bucket" "resource" "status" "atProvider" "arn" "" .observed | quote }}
    - step: auto-detect-readiness
      functionRef:
        name: function-auto-ready
```
{% endraw %}

위 예시에서 주목할 점은 `s3.aws.m.upbound.io/v1beta1` API 그룹(Crossplane v2의 네임스페이스 스코프 Managed Resource 그룹 규칙인 `*.m.upbound.io`)을 통해 S3 `Bucket`과 출력 `Secret`이 동일한 애플리케이션 네임스페이스 안에 생성되며, 별도의 Claim 없이 `XAIModelStorage` 자체가 네임스페이스 리소스로 동작한다는 것이다.

**핵심 요약 — Crossplane v2는 관리형 리소스(MR)와 복합 리소스(XR)를 네임스페이스 스코프로 전환하고 불필요한 Claims 계층과 레거시 패치 문법을 제거함으로써, 클라우드 외부 인프라를 GitOps 멀티테넌시 경계에 맞춰 프로비저닝한다.**

---

## 4. 아키텍처 비교와 역할 분담: kro vs Crossplane v2 vs Helm

클라우드 네이티브 플랫폼을 설계할 때 가장 흔히 범하는 오류는 하나의 도구로 모든 계층의 문제를 해결하려는 것이다. Crossplane으로 인클러스터 파드와 서비스까지 전부 감싸거나, 반대로 Helm 차트 하나에 Terraform 역할까지 우겨넣으면 유지보수 비용이 급증한다.

### 4.1 3대 쿠버네티스 추상화 도구 정량·정성 비교 매트릭스

| 비교 항목 | Helm (v3 / v4) | kro (`kro.run/v1alpha1`) | Crossplane v2 (`apiextensions.crossplane.io/v2`) |
|---|---|---|---|
| **주 추상화 타깃** | 정적 매니페스트 패키징 및 릴리스 배포 | **인클러스터(In-cluster)** K8s 네이티브 리소스 및 오퍼레이터 CRD 합성 | **클라우드 외부(External Cloud)** 인프라(AWS, Azure, GCP) 프로비저닝 및 멀티클라우드 추상화 |
| **스키마 정의 방식** | `values.yaml` + 선택적 `values.schema.json` (강제성 낮음) | **`SimpleSchema`** (선언 즉시 OpenAPI v3 CRD로 자동 컴파일) | 표준 **OpenAPI v3 Schema** (`CompositeResourceDefinition`) |
| **템플릿 및 합성 엔진** | Go `text/template` (비타입화 문자열 치환) | **CEL(Common Expression Language)** 인라인 표현식 (`${...}`) | **Composition Functions** gRPC 파이프라인 (Go, KCL, Python, CEL) |
| **의존성 그래프(DAG) 추론** | 미지원 (훅 가중치 `helm.sh/hook-weight` 수동 지정) | **자동 추론** (CEL 심볼 참조 분석 후 Kahn 위상 정렬 수행) | 함수 파이프라인 내부에서 순차/조건부 준비 상태(`Readiness`) 제어 |
| **정적 타입 안전성 검증** | 미지원 (렌더링 후 API 서버 적용 시점에 오류 발견) | **RGD 등록 시점 정적 검증** (대상 CRD OpenAPI 스키마와 대조) | XRD 스키마 검증 지원 (단, 함수 컨테이너 내부 로직은 런타임 검증) |
| **런타임 드리프트 자가 치유** | 미지원 (수동 `helm upgrade` 전까지 하위 리소스 변경 방치) | **상시 지원** (인포머가 하위 리소스 변경 감지 시 수 초 내 원복) | **상시 지원** (클라우드 API 주기적 폴링 및 인클러스터 상태 수렴) |
| **컨트롤 플레인 메모리 부하** | 낮음 (릴리스당 Secret 1개 저장, 상주 컨트롤러 없음) | **매우 낮음** (단일 바이너리, RGD당CRD 1개 등록, 외부 파드 불필요) | **높음** (클라우드 프로바이더 CRD 수백 개 등록 및 함수 파드 상주) |

### 4.2 API 서버(etcd) 부하 수식 모델링과 플랫폼 엔지니어링 역할 분담 패턴

왜 인클러스터 AI 추론 스택 합성에는 Crossplane 대신 `kro`를 쓰고, 클라우드 외부 리소스에는 Crossplane v2를 써야 하는지 쿠버네티스 API 서버(`kube-apiserver`)의 메모리 및 워치(Watch) 오버헤드 수식으로 증명할 수 있다.

클러스터에 등록된 전체 CRD 개수를 $N_{\text{CRD}}$, CRD 1개당 API 서버가 OpenAPI v3 검증기 및 디스커버리 캐시를 유지하는 데 소모하는 평균 힙 메모리를 $m_{\text{schema}}$(실측 약 $1.8 \sim 3.5\text{ MB}$), $k$번째 CRD의 활성 객체 수를 $N_{\text{obj}, k}$, 객체당 평균 직렬화 크기를 $s_{\text{obj}, k}$, 해당 리소스를 감시하는 컨트롤러 인포머(Watch) 배수를 $W_{\text{informer}, k}$라 할 때, API 서버의 CRD 관련 메모리 점유량 $M_{\text{apiserver}}$는 다음과 같이 근사된다.

$$M_{\text{apiserver}} = N_{\text{CRD}} \cdot m_{\text{schema}} + \sum_{k=1}^{N_{\text{CRD}}} N_{\text{obj}, k} \cdot s_{\text{obj}, k} \cdot \left(1 + W_{\text{informer}, k}\right)$$

- **클라우드 외부 계층 (Crossplane v2)**:
  - AWS나 Azure의 외부 API를 제어하려면 패밀리 프로바이더(`provider-upjet-aws-s3`, `provider-upjet-aws-iam` 등)를 설치하고 gRPC `Composition Function` 러너 파드를 띄워야 한다. 이는 외부 클라우드 API와 쿠버네티스 상태 머신을 동기화하기 위한 합당한 비용이며, 앞서 다룬 [2026 엔터프라이즈 에이전트 호스팅 & AI FinOps 아키텍처](/cloud/enterprise-agent-hosting-ai-finops-aws-azure/)[^11]의 클라우드 스토리지·네트워크·권한 경계를 코드로 관리할 때 핵심 역할을 수행한다.
- **인클러스터 AI 스택 계층 (`kro`)**:
  - 반면 이미 클러스터 내부에 설치된 `LeaderWorkerSet`, `ResourceClaimTemplate`, `InferencePool`, `TracingPolicyNamespaced`를 묶는 작업은 외부 클라우드 API 호출이 전혀 없다. 이를 위해 별도의 gRPC 함수 러너 파드 네트워크 홉을 거치는 대신, `kro`의 단일 프로세스 메모리 안에서 CEL AST 평가($< 2\text{ ms}$)와 자동 DAG 위상 정렬로 처리하면 컨트롤 플레인 지연 시간과 메모리 오버헤드를 최소화할 수 있다.

따라서 가장 실용적인 **플랫폼 엔지니어링 2계층 역할 분담(Two-Tier Abstraction Pattern)**은 다음과 같이 정립된다.

1. **Outer Infrastructure Loop (Crossplane v2 담당)**:
   - `XAIModelStorage` XR을 통해 S3/Blob 모델 저장소, KMS 암호화 키, IAM 워크로드 아이덴티티를 생성하고, 연결 메타데이터(버킷 ARN, 리전, 엔드포인트)를 해당 네임스페이스의 `Secret`(`*-cloud-env`)으로 출력한다.
2. **Inner AI Stack Loop (`kro` `ResourceGraphDefinition` 담당)**:
   - Crossplane v2가 생성한 `Secret` 이름을 입력 파라미터로 받아, DRA GPU 클레임 템플릿 + LWS 분산 추론 파드 + GAIE 추론 풀 및 라우트 + Tetragon eBPF 샌드박스 + HPA를 단일 `DisaggregatedLLMService` CRD로 합성한다.

**핵심 요약 — 클라우드 외부 리소스(S3·IAM·RDS)는 네임스페이스 MR과 함수 파이프라인을 갖춘 Crossplane v2로 프로비저닝하여 Secret으로 연결 정보를 넘기고, 인클러스터 6종 AI CRD 조합은 CEL DAG 기반의 kro로 추상화하는 2계층 분담이 컨트롤 플레인 효율을 극대화한다.**

---

## 5. 실전 매니페스트와 TypeSafe Jev 기반 플랫폼 PR 정책 검증

이제 앞서 설계한 2계층 아키텍처를 실제 배포 가능한 코드로 구현한다. 먼저 6개의 인클러스터 AI CRD를 하나로 묶는 `kro` `ResourceGraphDefinition`을 작성하고, 이어서 개발자가 GitOps 저장소에 제출한 커스텀 리소스 PR의 아키텍처·보안·비용 정합성을 **TypeSafe System One(`Jev`)**[^12]으로 스냅 판정하는 파이프라인을 구축한다.

### 5.1 DRA + LWS + GAIE + Tetragon을 하나로 묶는 kro ResourceGraphDefinition 명세

아래 매니페스트는 플랫폼 팀이 클러스터에 단 한 번 등록하는 `ResourceGraphDefinition`이다. 이 RGD가 등록되면 애플리케이션 팀은 단 15줄짜리 `DisaggregatedLLMService` 리소스 하나만 작성하여 전체 추론 스택을 배포할 수 있다.

{% raw %}
```yaml
apiVersion: kro.run/v1alpha1
kind: ResourceGraphDefinition
metadata:
  name: disaggregated-llm-service.ai.ingu627.dev
spec:
  schema:
    apiVersion: v1alpha1
    group: ai.ingu627.dev
    kind: DisaggregatedLLMService
    spec:
      modelName: string | required=true description="외부 라우팅 및 GAIE에 등록할 모델 식별자"
      image: string | default="vllm/vllm-openai:v0.31.0"
      workerGroupReplicas: integer | default=2 minimum=1 maximum=16
      nodesPerGroup: integer | default=2 minimum=1 maximum=8
      gpusPerNode: integer | default=8 minimum=1 maximum=8
      cloudEnvSecretName: string | required=true description="Crossplane v2가 생성한 클라우드 환경 Secret 이름"
      enableKernelSandbox: boolean | default=true description="Tetragon eBPF 런타임 커널 격리 활성화 여부"
      maxScaleReplicas: integer | default=6 minimum=1 maximum=32
    status:
      readyWorkerGroups: ${lwsCluster.status.readyReplicas}
      inferencePoolName: ${gaiePool.metadata.name}
  resources:
    # 1. [Layer 1] 쿠버네티스 DRA GPU 및 RDMA NIC 토폴로지 클레임 템플릿
    - id: draGpuTemplate
      template:
        apiVersion: resource.k8s.io/v1
        kind: ResourceClaimTemplate
        metadata:
          name: ${schema.metadata.name}-gpu-claim
          namespace: ${schema.metadata.namespace}
        spec:
          spec:
            devices:
              requests:
                - name: h100-rdma-slice
                  deviceClassName: gpu.nvidia.com
                  count: ${schema.spec.gpusPerNode}

    # 2. [Layer 2] 멀티노드 분산 추론 워크로드 (draGpuTemplate 참조 -> 자동 DAG 간선 생성)
    - id: lwsCluster
      readyWhen:
        - ${lwsCluster.status.readyReplicas >= 1}
      template:
        apiVersion: leaderworkerset.x-k8s.io/v1
        kind: LeaderWorkerSet
        metadata:
          name: ${schema.metadata.name}-lws
          namespace: ${schema.metadata.namespace}
        spec:
          replicas: ${schema.spec.workerGroupReplicas}
          leaderWorkerTemplate:
            size: ${schema.spec.nodesPerGroup}
            workerTemplate:
              metadata:
                labels:
                  app.kubernetes.io/name: ${schema.metadata.name}
                  ai.ingu627.dev/role: inference-worker
              spec:
                envFrom:
                  - secretRef:
                      name: ${schema.spec.cloudEnvSecretName}
                containers:
                  - name: vllm-worker
                    image: ${schema.spec.image}
                    ports:
                      - containerPort: 8000
                        name: http-infer
                    resources:
                      claims:
                        - name: gpu-topology
                resourceClaims:
                  - name: gpu-topology
                    resourceClaimTemplateName: ${draGpuTemplate.metadata.name}

    # 3. [Layer 3] GAIE InferencePool (lwsCluster 준비 완료 후 활성화)
    - id: gaiePool
      template:
        apiVersion: inference.networking.x-k8s.io/v1alpha2
        kind: InferencePool
        metadata:
          name: ${schema.metadata.name}-pool
          namespace: ${schema.metadata.namespace}
        spec:
          targetPortNumber: 8000
          selector:
            app.kubernetes.io/name: ${lwsCluster.metadata.name}
          extensionRef:
            name: ${schema.metadata.name}-epp

    # 4. [Layer 4] Gateway API HTTPRoute (gaiePool 참조)
    - id: gaieRoute
      template:
        apiVersion: gateway.networking.k8s.io/v1
        kind: HTTPRoute
        metadata:
          name: ${schema.metadata.name}-route
          namespace: ${schema.metadata.namespace}
        spec:
          parentRefs:
            - name: internal-ai-gateway
              namespace: ai-gateway-system
          rules:
            - backendRefs:
                - group: inference.networking.x-k8s.io
                  kind: InferencePool
                  name: ${gaiePool.metadata.name}
                  port: 8000

    # 5. [Layer 1 Conditional] Cilium Tetragon eBPF 커널 샌드박스 정책 (조건부 활성화)
    - id: tetragonPolicy
      includeWhen:
        - ${schema.spec.enableKernelSandbox == true}
      template:
        apiVersion: cilium.io/v1alpha1
        kind: TracingPolicyNamespaced
        metadata:
          name: ${schema.metadata.name}-sandbox
          namespace: ${schema.metadata.namespace}
        spec:
          podSelector:
            matchLabels:
              app.kubernetes.io/name: ${schema.metadata.name}
          kprobes:
            - call: "sys_execve"
              syscall: true
              selectors:
                - matchBinaries:
                    - operator: "NotIn"
                      values: ["/usr/bin/python3", "/vllm-workspace/entrypoint.sh"]
                  matchActions:
                    - action: Sigkill

    # 6. [Layer 3] 수평 파드 오토스케일러 (lwsCluster 참조)
    - id: lwsHpa
      template:
        apiVersion: autoscaling/v2
        kind: HorizontalPodAutoscaler
        metadata:
          name: ${schema.metadata.name}-hpa
          namespace: ${schema.metadata.namespace}
        spec:
          scaleTargetRef:
            apiVersion: leaderworkerset.x-k8s.io/v1
            kind: LeaderWorkerSet
            name: ${lwsCluster.metadata.name}
          minReplicas: ${schema.spec.workerGroupReplicas}
          maxReplicas: ${schema.spec.maxScaleReplicas}
          metrics:
            - type: Pods
              pods:
                metric:
                  name: vllm:num_requests_waiting
                target:
                  type: AverageValue
                  averageValue: "15"
```
{% endraw %}

위 RGD에서 `kro`는 표현식 참조를 스캔하여 다음과 같은 3단계 위상 정렬 계층을 자동으로 도출한다.
- $L_1 = \{\text{draGpuTemplate}, \text{tetragonPolicy}\}$ (외부 리소스 참조 없음, 즉시 병렬 생성)
- $L_2 = \{\text{lwsCluster}\}$ (`draGpuTemplate.metadata.name`에 의존, 파드 Ready 대기)
- $L_3 = \{\text{gaiePool}, \text{lwsHpa}\} \to L_4 = \{\text{gaieRoute}\}$ (`lwsCluster` 준비 완료 후 순차 프로비저닝)

### 5.2 GitOps PR 단계의 시맨틱 정책 검증: CEL 정적 검사와 TypeSafe System One(Jev) 결합

`kro`의 CEL 검증기와 쿠버네티스 `ValidatingAdmissionPolicy`는 `gpusPerNode <= 8` 같은 **구문론적(Syntactic)·수치적 제약**은 결정론적으로 걸러낸다. 그러나 GitOps Pull Request(PR) 단계에서는 수치 규칙만으로 판단할 수 없는 **의미론적(Semantic) 맥락 검증**이 요구된다.

- **시맨틱 불일치 사례**:
  1. 개발자가 8B 소형 양자화 모델(`llama-3.1-8b-instruct-fp8`)을 배포하면서 `nodesPerGroup: 4`, `gpusPerNode: 8`(그룹당 H100 32장)을 요청하고 PR 본문에는 "단순 사내 FAQ 챗봇 테스트용"이라고 기술한 경우 (구문상으로는 유효하나 심각한 GPU 과할당).
  2. 개발자가 `enableKernelSandbox: false`로 Tetragon eBPF 샌드박스를 해제하면서 PR 사유란에 구체적인 커널 프로파일링 티켓 번호 없이 "속도 개선 목적"이라고만 적은 경우.

이러한 PR 컨텍스트를 거대 생성형 LLM(CoT)으로 심사하면 건당 4~8초의 지연과 비결정론적 JSON 파싱 오류가 발생한다. 반면 **TypeSafe System One(`Jev`)**의 `/v1/systemone` 엔드포인트는 단일 포워드 패스(Single-pass) 토큰 확률 분포 평가만으로 70~150ms 내에 세 가지 원자적 질문을 병렬 판정(Speculative Fan-Out)한다[^12].

**1) HTTP 엔드포인트(`/v1/systemone`) 요청 페이로드 구조**

```json
{
  "state": {
    "pr_author_team": "customer-support-bot-team",
    "pr_description": "사내 복지 규정 FAQ 챗봇 베타 테스트 배포입니다. 빠른 배포를 위해 커널 샌드박스는 잠시 껐습니다.",
    "requested_cr_spec": {
      "kind": "DisaggregatedLLMService",
      "modelName": "meta-llama/Llama-3.1-8B-Instruct-FP8",
      "workerGroupReplicas": 2,
      "nodesPerGroup": 4,
      "gpusPerNode": 8,
      "enableKernelSandbox": false,
      "maxScaleReplicas": 8
    },
    "namespace_finops_budget": {
      "monthly_gpu_hour_limit": 1200,
      "estimated_monthly_gpu_hours_requested": 46080
    }
  },
  "questions": {
    "sizing_alignment": {
      "type": "choice",
      "instructions": "요청된 모델 파라미터 규모와 할당된 멀티노드 GPU 토폴로지(nodesPerGroup * gpusPerNode) 간의 정합성을 판정하시오."
    },
    "sandbox_exemption_validity": {
      "type": "score",
      "instructions": "enableKernelSandbox가 false일 때 PR 설명에 기재된 보안 예외 사유의 타당성을 평가하시오."
    },
    "block_gitops_merge": {
      "type": "noul",
      "instructions": "해당 PR이 하드웨어 과할당, FinOps 예산 초과, 또는 무인가 보안 샌드박스 해제를 포함하여 자동 병합을 차단해야 하는가?"
    }
  }
}
```

### 5.3 Python SDK 루브릭 선언 및 결정론적 GitOps 게이트 쿡북

`typesafe-house-style`의 5대 원칙에 따라 모든 PR 메타데이터와 YAML 스펙은 `state`에만 격리하고, `questions`에는 구체적 상황으로 기술된 판단 규칙만 선언한다.

```python
from typesafe import SystemOne, Choice, Score, Noul
from dataclasses import dataclass
from typing import Dict, Any

client = SystemOne()

# GitOps PR 시맨틱 거버넌스를 위한 TypeSafe System One 루브릭
KRO_GITOPS_PR_RUBRIC = {
    "sizing_alignment": Choice(
        instructions="요청된 모델 아키텍처(파라미터 크기/정밀도)와 단일 워커 그룹당 GPU 수(nodesPerGroup * gpusPerNode)의 물리적 정합성을 분류하시오.",
        criteria={
            "right_sized": "모델 가중치 및 KV 캐시 요구량에 부합하는 GPU 수량이 할당된 상태 (예: 8B~14B 모델에 1~2 GPU, 70B 모델에 4~8 GPU, 405B+ MoE 모델에 멀티노드 16+ GPU).",
            "over_provisioned": "소형/중형 모델(30B 이하)에 멀티노드(nodesPerGroup >= 2) 또는 8장 이상의 H100 GPU가 과다 할당된 상태.",
            "under_provisioned": "초거대 모델(70B FP16 또는 405B+)에 단일 GPU만 할당되어 런타임 OOM(Out-Of-Memory) 발생이 확실시되는 상태."
        }
    ),
    "sandbox_exemption_validity": Score(
        instructions="enableKernelSandbox 설정과 PR 본문의 보안 예외 승인 근거를 평가하시오.",
        criteria={
            0: "enableKernelSandbox가 false로 비활성화되었으나, 보안팀 승인 티켓 번호(SEC-*)나 구체적인 커널 디버깅 사유가 누락된 상태.",
            1: "enableKernelSandbox가 false이나, PR 본문에 제한된 스테이징 환경 명시와 유효한 보안 예외 티켓 번호(SEC-*)가 함께 기재된 상태.",
            2: "enableKernelSandbox가 true로 설정되어 Tetragon eBPF 커널 샌드박스가 정상 활성화된 상태."
        }
    ),
    "block_gitops_merge": Noul(
        instructions="예상 월간 GPU 시간이 팀 예산 한도를 초과하거나, 모델 대비 GPU 과할당 또는 미승인 샌드박스 해제가 존재하여 PR 병합을 즉시 차단해야 하는가?"
    )
}

@dataclass
class GitOpsGateDecision:
    allowed: bool
    reason: str
    assigned_reviewers: list[str]

def evaluate_disaggregated_llm_pr(pr_state: Dict[str, Any]) -> GitOpsGateDecision:
    # 단일 패스 비생성형 평가 (평균 지연 95ms, 스키마 에러율 0%)
    res = client.evaluate(state=pr_state, questions=KRO_GITOPS_PR_RUBRIC)

    # 1. 보안 가드레일: Tetragon 샌드박스 무단 해제 시 즉시 차단 및 보안팀 호출
    if res.sandbox_exemption_validity.score == 0:
        return GitOpsGateDecision(
            allowed=False,
            reason="Tetragon eBPF 커널 샌드박스(enableKernelSandbox=false) 해제에는 SEC-* 승인 티켓이 필수입니다.",
            assigned_reviewers=["security-platform-oncall"]
        )

    # 2. 토폴로지 과할당/과소할당 및 FinOps 예산 초과 차단 (홀드아웃 보정 임계값 0.82 적용)
    if res.block_gitops_merge.prob >= 0.82 or res.sizing_alignment.choice != "right_sized":
        return GitOpsGateDecision(
            allowed=False,
            reason=f"토폴로지 정합성 위배({res.sizing_alignment.choice}) 또는 FinOps GPU 시간 예산 초과가 감지되었습니다.",
            assigned_reviewers=["ai-infra-capacity-team"]
        )

    # 3. 정합성 통과 시 Flux/ArgoCD 자동 동기화 승인
    return GitOpsGateDecision(
        allowed=True,
        reason="구문(CEL) 및 시맨틱(Jev) 정책 검증을 모두 통과했습니다.",
        assigned_reviewers=[]
    )
```

**핵심 요약 — kro의 ResourceGraphDefinition으로 6종 CRD를 단일 선언형 API로 압축하고, GitOps PR 단계에서 CEL 구문 검증과 TypeSafe System One(Jev)의 100ms급 시맨틱 스냅 판정을 결합하면 하드웨어 과할당과 보안 정책 우회를 배포 전에 차단할 수 있다.**

---

## 6. 엔지니어링 한계와 트레이드오프

`kro`와 Crossplane v2, 그리고 `Jev` 기반 PR 게이트를 실제 프로덕션 플랫폼에 도입할 때는 다음 다섯 가지 운영상 한계와 트레이드오프를 아키텍처에 반드시 반영해야 한다.

1. **kro API 성숙도(`v1alpha1`)와 튜링 불완전 CEL의 반복문 표현 제약**:
   - `kro`는 2025~2026년 기준 `kro.run/v1alpha1` 단계로 발전 중이며, CEL의 튜링 불완전성으로 인해 "사용자가 입력한 가변 길이 배열(`loraAdapters: [...]`)의 원소 수만큼 서로 다른 하위 `ConfigMap`이나 `HTTPRoute` 리소스 개수를 동적으로 N개 복제 생성"하는 동적 팬아웃(Dynamic Resource Fan-out)에는 제약이 따른다. 리소스 개수 자체가 입력 배열 길이에 따라 가변적으로 변해야 하는 복잡한 변환은 Crossplane v2의 `function-kcl` 또는 `function-go-templating` 파이프라인으로 처리하는 것이 적합하다.
2. **동적 생성 CRD의 RBAC 권한 집중과 ArgoCD/Flux 상태 추적 충돌**:
   - `kro` 컨트롤러가 RGD로부터 새로운 CRD를 등록하고 `LeaderWorkerSet`이나 `TracingPolicyNamespaced`를 대신 생성·수정하려면, `kro`의 ServiceAccount에 해당 하위 리소스들에 대한 광범위한 클러스터 권한(ClusterRole)이 부여되어야 한다. 최소 권한 원칙을 지키려면 RGD로 허용할 리소스 그룹만 명시적으로 묶은 Aggregated ClusterRole을 구성해야 한다.
   - 또한 ArgoCD를 사용할 때 `kro`가 동적으로 생성한 하위 리소스들은 부모 인스턴스를 가리키는 `ownerReferences`를 갖는다. ArgoCD `Application`에서 `ServerSideApply=true`와 리소스 무시 규칙을 적절히 설정하지 않으면, 하위 리소스의 런타임 필드 갱신을 두고 ArgoCD와 `kro` 리컨실러가 서로 덮어쓰는 동기화 플래핑(Sync Flapping)이 발생할 수 있다.
3. **Crossplane v2 대규모 Managed Resource 운영 시 API 서버 및 클라우드 Rate Limit 부하**:
   - Crossplane v2가 Claims 계층을 제거하여 객체 수를 줄였더라도, 수천 개의 클라우드 리소스를 단일 쿠버네티스 관리 클러스터의 etcd에 저장하고 주기적으로 클라우드 API(`Describe*`, `Get*`)를 폴링하는 아키텍처 본질은 동일하다. 관리 대상 MR이 5,000개를 넘어가는 환경에서는 모놀리식 프로바이더 대신 필요한 서비스만 분리된 패밀리 프로바이더(`provider-upjet-aws-s3` 등)를 설치하고, 컨트롤러의 `--max-reconcile-rate` 및 `--poll-interval` 파라미터를 보수적으로 튜닝해야 AWS/Azure API 스로틀링(`ThrottlingException`)과 API 서버 OOM을 예방할 수 있다.
4. **TypeSafe Jev 판정 임계값의 홀드아웃 데이터셋 보정(Holdout Calibration) 필수성**:
   - 5.2절의 GitOps PR 게이트 코드에서 사용한 확률 임계값(`prob >= 0.82`)은 임의로 하드코딩해서는 안 된다. 사내에서 실제로 발생했던 과거 PR 반려 이력, OOM 장애 유발 매니페스트, 정상 승인 PR로 구성된 **독립 홀드아웃 검증셋(Held-out Validation Set)**을 구축하여 정밀도(Precision)와 재현율(Recall) 곡선을 측정한 뒤 도메인에 맞게 임계값을 보정해야 한다.
5. **타입 안전성(Type Safety) $\neq$ 무오류성(Infallibility)과 심층 방어(Defense-in-Depth)**:
   - `kro`의 CEL 정적 타입 검사와 `Jev`의 스키마 보장 응답(파싱 에러율 0%)은 어디까지나 **인터페이스 계약의 안전성**을 보장할 뿐, 모델의 시맨틱 판정이 항상 참이거나 런타임 장애가 발생하지 않음을 의미하지 않는다. PR 설명란에 적대적 프롬프트 주입(Adversarial Steering)을 시도하여 `Jev`의 점수를 우회하려 할 수 있으므로, `enableKernelSandbox: false` 금지나 GPU 상한선 같은 핵심 불변식(Invariant)은 반드시 쿠버네티스 네이티브 `ValidatingAdmissionPolicy`(CEL)와 `ResourceQuota`로 이중 강제해야 한다.

**핵심 요약 — kro의 CEL 반복문 제약, 동적 CRD의 RBAC·GitOps 트래킹 설정, Crossplane v2의 etcd 워치 부하를 사전에 설계에 반영하고, Jev 시맨틱 판정은 홀드아웃 임계값 보정 및 쿠버네티스 네이티브 Admission Policy와 다층 방어로 결합해야 한다.**

---

## References

[^1]: ingu627.github.io: *쿠버네티스 DRA(Dynamic Resource Allocation) 기반 차세대 GPU 스케줄링 아키텍처* (2026). [/k8s/kubernetes-dra-dynamic-resource-allocation-gpu/](/k8s/kubernetes-dra-dynamic-resource-allocation-gpu/)
[^2]: ingu627.github.io: *엔터프라이즈 AI 플랫폼 설계: 분리형 서빙(Disaggregated Serving), KV 캐시 오프로딩, Gateway API Inference Extension(GAIE)* (2026). [/llm/enterprise-ai-platform-disaggregated-serving-kvcache-gaie/](/llm/enterprise-ai-platform-disaggregated-serving-kvcache-gaie/)
[^3]: ingu627.github.io: *eBPF 기반 AI 런타임 보안(Cilium Tetragon)과 OpenTelemetry GenAI 에이전트 궤적 평가 아키텍처* (2026). [/k8s/ebpf-ai-observability-cilium-tetragon-otel-genai-trajectory-eval/](/k8s/ebpf-ai-observability-cilium-tetragon-otel-genai-trajectory-eval/)
[^4]: ingu627.github.io: *IaC와 GitOps 실전 가이드: Terraform, Helm, ArgoCD, Flux 아키텍처 비교* (2026). [/cloud/iac-gitops/](/cloud/iac-gitops/)
[^5]: Kubernetes SIGs / kro Official Documentation: *Kube Resource Orchestrator (kro) — ResourceGraphDefinition, SimpleSchema, and CEL DAG Concepts* (2025–2026). [https://kro.run/docs/overview](https://kro.run/docs/overview)
[^6]: Crossplane Official Documentation & Blog: *Announcing Crossplane v2.0 — Namespaced Managed Resources, Direct Composite Resources, and Simplified App Authoring* (2025). [https://docs.crossplane.io](https://docs.crossplane.io)
[^7]: Kubernetes SIGs: *LeaderWorkerSet (LWS) API for Multi-Host AI/ML Inference Workloads on Kubernetes* (2025). [https://github.com/kubernetes-sigs/lws](https://github.com/kubernetes-sigs/lws)
[^8]: Google / Kubernetes API Machinery: *Common Expression Language (CEL) Specification and Kubernetes Validation Rules* (2025). [https://cel.dev](https://cel.dev)
[^9]: Flux CD Official Documentation: *GitOps Toolkit Components (source-controller, kustomize-controller, helm-controller, notification-controller)* (2025). [https://fluxcd.io/flux/components/](https://fluxcd.io/flux/components/)
[^10]: Crossplane Official Documentation: *Composition Functions and Pipeline Mode (`apiextensions.crossplane.io/v2`)* (2025). [https://docs.crossplane.io/latest/concepts/composition-functions/](https://docs.crossplane.io/latest/concepts/composition-functions/)
[^11]: ingu627.github.io: *2026 엔터프라이즈 에이전트 호스팅 & AI FinOps 아키텍처: AWS Bedrock AgentCore와 Azure Foundry 비교* (2026). [/cloud/enterprise-agent-hosting-ai-finops-aws-azure/](/cloud/enterprise-agent-hosting-ai-finops-aws-azure/)
[^12]: TypeSafe AI Official Documentation: *System One (`/v1/systemone`) & Jev Question Design Guide* (2026). [https://docs.typesafe.ai](https://docs.typesafe.ai)
