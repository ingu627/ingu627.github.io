---
layout: single
title: "엔터프라이즈 AI 플랫폼 분산 서빙: 제로 트러스트·TP/PP부터 KVCache와 GAIE까지"
excerpt: "사설 AI 클러스터의 보안 경계와 텐서·파이프라인 병렬화 비용을 살펴보고, 프리필·디코드 분리와 KVCache 전송, GAIE 기반 라우팅의 실무 트레이드오프를 정리한다."
categories: [llm]
tags: [llm, vllm, k8s, llmops, architecture, pd-disaggregation, mooncake, lmcache, dynamo, llm-d, gaie, 정리, 설명]
toc: true
toc_sticky: true
sidebar_main: true
date: 2026-10-22
last_modified_at: 2026-11-28
use_math: true
redirect_from:
  - /llm/enterprise-ai-platform-distributed-serving-architecture/
---

## 이 글을 30초에 파악하기

> **한 줄로** — 기밀 데이터를 다루는 사설 GPU 클러스터의 보안 경계와 모델 병렬화를 설계하고, 프리필·디코드 분리와 캐시 재사용의 이득을 전송 비용과 함께 판단한다.

**읽고 나면 알게 되는 것**

- 사설망의 접근·반출 경계와 TP·PP 병렬화의 통신 비용을 어떻게 판단하는지
- 프리필과 디코드의 간섭을 줄이는 이득이 KV 전송 비용을 언제 넘어서는지
- 같은 프롬프트를 이미 계산한 파드로 보내려면 라우터가 무엇을 보고 판단해야 하는지
- Dynamo와 llm-d가 각각 무엇을 맡는지, 실제 매니페스트에서 무엇을 확인해야 하는지

**용어 먼저 보기**

|용어|한 줄 설명|이 글에서의 역할|
|---|---|---|
|KVCache(키-값 캐시)|모델이 앞서 읽은 내용을 다시 계산하지 않도록 GPU 메모리에 남겨 두는 중간 결과|파드 사이를 옮겨 다니는 대상이자 라우팅 판단 기준|
|PD 분리(Prefill-Decode Disaggregation)|입력을 한꺼번에 읽는 단계와 토큰을 하나씩 만드는 단계를 서로 다른 GPU·파드에 나눠 배치하는 구성|글 전체의 주제. 1~3절이 이득과 비용을 계산한다|
|TTFT(첫 토큰까지 걸린 시간)|요청을 보낸 뒤 첫 글자가 나올 때까지의 시간|전송 비용과 라우팅 선택이 사용자 체감으로 드러나는 지표|
|GAIE(게이트웨이 API 추론 확장)|쿠버네티스 표준 Gateway API 위에 추론 서버용 리소스와 확장 스케줄러를 얹은 규격|2절 라우팅 표준화의 기준|
|EPP(엔드포인트 선택기)|대기 큐 길이와 캐시 적합도로 점수를 매겨 요청을 보낼 파드를 고르는 구성요소|2.2절과 2.3절의 캐시 인식 라우팅|
|NIXL|GPU 메모리·호스트 메모리·SSD·원격 노드 사이의 데이터 이동을 하나의 API로 묶은 NVIDIA 전송 라이브러리|3.2절 Dynamo의 KV 전송 계층|
|Mooncake|KVCache를 중심에 두고 프리필과 디코드를 나눈 분산 서빙 아키텍처. 여러 RDMA NIC를 묶어 KV를 옮기는 Transfer Engine이 핵심이다|4.3절 실측 지표의 대상|
|LMCache|서빙 엔진의 KVCache를 파드 밖으로 내보내 다른 요청이 재사용하게 해 주는 오픈소스 계층|4.4절과 5절 매니페스트에 등장|

**이런 분께** — 사내 GPU 추론 서버의 보안 경계와 분산 배치를 정하거나 응답 지연의 원인을 찾는 운영자를 위한 글이다.

기밀 문서가 사설 클러스터를 벗어나면 안 되는데 70B 모델은 GPU 한 장에 들어가지 않는다. 여러 GPU를 연결해도 장문 프롬프트가 기존 생성 요청을 지연시킬 수 있다. 접근 경계와 병렬화 통신을 먼저 설계한 뒤, 프리필·디코드 분리와 캐시 전송이 실제 워크로드에서 이득인지 확인해야 한다.

이 글은 제로 트러스트와 TP·PP에서 시작해 PD 분리, GAIE 라우팅, KVCache 전송과 운영 한계까지 이어진다. 장애 격리와 운영 제어는 별도의 [엔터프라이즈 AI 플랫폼 장애 격리 글](/agent/enterprise-ai-platform-fault-tolerance-operations/)[^2]에서 다룬다.

## 0. 사설 AI 플랫폼의 보안 경계와 모델 병렬화

### 0.1 제로 트러스트와 데이터 반출 경계

사설망에 있다는 사실만으로 접근이 안전해지는 것은 아니다. 권한을 최소화하고 요청과 워크로드의 신원을 검증하는 다층 방어가 필요하다. 아래는 외부 API 호출이 허용되지 않는 환경의 설계 예시다.


- **아웃바운드 기본 차단**: 워커에 퍼블릭 IP를 주지 않고 방화벽에서 인터넷 이그레스를 차단한다. 모델 가중치는 검증과 승인 절차를 거쳐 사내 암호화 객체 저장소의 사설 엔드포인트로 공급한다. 운영에 필요한 예외 경로도 명시적으로 통제한다.
- **신원과 자격 증명**: 코드에 장기 마스터 API 키를 넣지 않는다. 호출자의 단기 OIDC/JWT 토큰을 검증하고, 워크로드 아이덴티티와 mTLS로 게이트웨이와 파드 간 통신을 보호한다. 인증뿐 아니라 테넌트별 인가와 감사가 필요하다.
- **패브릭 격리**: GPU 간 RDMA 통신용 NIC와 관리·로그 트래픽을 분리하고 해당 경로의 접근 권한을 제한한다. 사설 네트워크만으로 데이터 유출이 불가능해지는 것은 아니다. 로그, 캐시, 저장소와 관리자 권한도 통제해야 한다.

### 0.2 텐서 병렬화(TP)의 통신 비용

70B 파라미터 모델의 FP16 가중치는 대략 140GB이며, KV 캐시와 런타임 메모리는 별도다. H100 80GB 한 장에 전부 담기 어렵기 때문에 모델 병렬화가 필요할 수 있다. 텐서 병렬화는 같은 레이어의 행렬을 GPU에 나누고, 파이프라인 병렬화는 레이어를 스테이지별로 나눈다.[^1]

가중치 $W$를 열 방향으로 나누면 각 GPU가 $Y_i = XW_i$를 계산하고 결과를 결합한다. 행 방향 분할에서는 $Y = \sum_{i=1}^{TP} X_iW_i$의 부분합을 All-Reduce로 합친다. 배치 크기 $B$, 시퀀스 길이 $S$, 은닉 차원 $H$, 원소 크기 $b$에 대해 링 All-Reduce 한 번의 GPU당 송신량 모델은 다음과 같다.

$$V_{\text{comm}} = 2 \cdot \frac{TP-1}{TP} \cdot B \cdot S \cdot H \cdot b$$

이는 통신 한 번의 단순 모델이지 레이어 전체의 고정 비용이 아니다. 실제 비용은 collective 횟수·알고리즘·링크 토폴로지·지연에 좌우된다. 빠른 노드 내 링크에 TP를 우선 배치하고 노드 간 TP는 실측한다. TP를 반드시 8 이하로 제한하거나 특정 대역폭이 항상 필요하다고 단정할 수는 없다.

### 0.3 파이프라인 병렬화(PP)의 버블과 선택 기준

PP는 레이어 그룹 사이에 활성화 텐서를 전달하므로 노드 간 잦은 All-Reduce를 줄일 수 있지만 스테이지 불균형과 대기 시간이 생긴다. 균등한 스테이지 $PP$개에 독립 마이크로배치 $M$개를 포워드 전용 파이프라인으로 흘리는 이상화 모델의 유휴 비율은 다음과 같다.

$$F_{\text{bubble}} = \frac{PP-1}{M+PP-1}$$

실제 자기회귀 디코드는 토큰 의존성, 배치 스케줄링, 스테이지별 처리 시간과 통신이 다르므로 이 식만으로 예측하지 않는다. 노드 내 TP와 노드 간 PP 조합을 출발점으로 삼고, 모델 메모리 적합성, TTFT·TPOT SLO, 동시 요청 수와 패브릭 대역폭을 함께 측정한다. Mooncake는 긴 입력의 프리필에 청크 단위 PP를 적용해 노드 간 통신을 줄이는 방식을 설명한다.[^17]

아래는 vLLM의 실험적 분리 프리필 예제다. 프록시가 프리필 인스턴스에 요청을 보내 KV 캐시를 만들고, 이어서 디코드 인스턴스에 요청을 전달한다. 세부 흐름은 커넥터와 버전에 따라 달라질 수 있다.

![vLLM 프록시가 프리필을 요청하고 KV 캐시를 디코드 인스턴스에 전달하는 흐름](/assets/images/llm/official-vllm-disaggregated-prefill.webp)

*출처: [vLLM 프로젝트의 분리 프리필 워크플로 원본](https://github.com/vllm-project/vllm/blob/a1fe24d961d85089c8a254032d35e4bdbca278d6/docs/assets/features/disagg_prefill/overview.jpg), [Apache-2.0](https://github.com/vllm-project/vllm/blob/a1fe24d961d85089c8a254032d35e4bdbca278d6/LICENSE). 원본을 WebP로 변환했다.*

[그림 크게 보기](/assets/images/llm/official-vllm-disaggregated-prefill.webp)

---

## 1. 단일 파드(Colocated) 서빙의 구조적 낭비와 분리 역설

긴 문서 요약 요청이 들어오면 함께 실행 중인 짧은 질문의 토큰 생성이 지연될 수 있다. 실제 간섭과 GPU 활용도는 배칭과 워크로드에 따라 달라진다. LLM의 자기회귀 추론은 연산 특성이 다른 두 단계로 나뉜다.[^3][^4]


### 1.1 Prefill(Compute-bound) vs Decode(Memory-bound) 비대칭성

두 단계는 같은 GPU를 쓰지만 병목 지점이 정반대다. 아래 두 항목이 그 차이를 정리한다.

- **프리필 단계(Prefill Phase — Compute-bound)**: 사용자의 입력 시퀀스 $S_{\text{in}}$ 전체를 한 번의 순전파(Forward Pass)로 병렬 처리한다. 이때 초기 **키-값 캐시(Key-Value Cache, KVCache)**가 만들어진다. 대규모 행렬 곱셈(GEMM)이 지배적이므로 병목은 GPU의 텐서 코어(Tensor Core) 연산량(FLOPs)이다. 산술 강도(Arithmetic Intensity, $\text{FLOPs/Byte}$)는 수백 이상으로 높다.
- **디코드 단계(Decode Phase — Memory-bound)**: 직전에 생성된 토큰 단 1개를 입력으로 받는다. 전체 모델 가중치와 누적된 KVCache를 HBM에서 읽어 들인 뒤 다음 토큰 1개를 만든다. 행렬-벡터 곱셈(GEMV) 위주로 동작하므로 산술 강도가 $1 \sim 4\text{ FLOPs/Byte}$ 수준으로 떨어진다. 텐서 코어는 대부분 유휴 상태로 남고 **고대역폭 메모리(High Bandwidth Memory, HBM)** 대역폭만 포화된다.

저울과 수레를 한 사람이 나눠 쓰는 상황을 떠올려 보자. 저울로 재는 동안 수레는 세워져 있고, 수레로 나르는 동안 저울은 비어 있는데, 두 도구를 동시에 쓸 방법은 없다.

동일한 파드와 GPU에서 두 단계를 연속 배칭(Continuous Batching)으로 혼합 실행하면 구조적 손실이 생긴다. 아래 세 가지가 대표적이다.

1. **자원 요구의 불일치**: 프리필과 디코드는 연산과 메모리 대역폭에 서로 다른 압력을 준다. 이 차이가 곧 GPU 시간의 특정 비율이 낭비된다는 뜻은 아니다.[^3]
2. **단계 간 간섭**: 긴 프리필이 진행되는 동안 기존 디코드 요청의 토큰 간 지연이 늘어날 수 있다. 청크 프리필과 배칭 정책에 따라 크기가 달라진다.
3. **병렬화 전략의 결합**: 일체형 배치는 단계마다 독립적인 자원 배분과 병렬화 토폴로지를 선택하기 어렵다.

### 1.2 PD 분리의 수리적 손익분기점(Break-Even Point) 모델링

**프리필-디코드 분리(Prefill-Decode Disaggregation, PD 분리)**는 프리필과 디코드를 별도 워커 풀에서 실행하고 KVCache를 전송한다.[^3] 모든 워크로드에서 유리한 것은 아니다. 전송에 따른 지연과 자원 비용이 붙기 때문이다.

이 비용이 언제 이득을 넘어서는지 계산으로 확인해 보자. 모델의 레이어 수를 $L$, KV 헤드 수를 $H_{kv}$, 헤드 차원을 $d_h$라 하자. 정밀도 바이트 수 $b$는 FP16이면 $2$, FP8이면 $1$이다. 이때 입력 길이 $S_{\text{in}}$에 대한 KVCache 볼륨 $V_{\text{KV}}$는 다음과 같다.

$$V_{\text{KV}}(S_{\text{in}}) = 2 \cdot L \cdot H_{kv} \cdot d_h \cdot b \cdot S_{\text{in}}$$

유효 네트워크 전송 대역폭을 $B_{\text{net}}$라 하자. RDMA 핸드셰이크 및 메타데이터 동기화 지연은 $L_{\text{setup}}$이다. 이 두 값으로 KVCache 전송 시간 $T_{\text{transfer}}$를 정의한다.

$$T_{\text{transfer}}(S_{\text{in}}) = \frac{V_{\text{KV}}(S_{\text{in}})}{B_{\text{net}}} + L_{\text{setup}}$$

일체형 대비 간섭 감소와 단계별 최적화가 줄이는 시간을 각각 $\Delta T_{\text{interference}}$, $\Delta T_{\text{compute}}$라고 하자. 전송과 연산이 겹치지 않는 단순 모델의 순이득 조건은 다음과 같다.

$$\Delta T_{\text{interference}} + \Delta T_{\text{compute}} > T_{\text{transfer}}$$

실제 판단에는 요청 큐, SLO, 풀별 GPU 비용과 전송·연산 중첩을 포함해야 한다. 아래 길이는 실험할 예시이지 보편적인 경계값이 아니다.

| 워크로드 | 먼저 비교할 선택지 | 확인할 비용 |
|---|---|---|
| 짧은 질의와 출력 | 일체형과 PD 분리 | 고정 연결·전송 지연이 간섭 감소보다 큰지 |
| 장문 RAG·문서 분석 | PD 분리와 청크 프리필 | 디코드 간섭 감소와 큰 KV 전송량 |
| 다중 턴 에이전트 | 캐시 인식 라우팅과 KV 재사용 | 캐시 적중률, 전송 시간, 테넌트 격리 |
| 대규모 MoE | 단계별 병렬화와 PD 분리 | 풀 비율, 전문가 통신, 네트워크 경합 |

[DeepSeek의 MLA](/llm/multi-head-latent-attention-mla-deepseek-sglang/)[^5]처럼 캐시 표현을 압축하는 모델은 전송량이 달라질 수 있다. 위 KV 크기 식은 일반적인 KV 헤드 표현을 가정하므로 MLA에 그대로 적용하지 않는다. 분리 여부는 같은 모델·하드웨어·요청 분포와 SLO에서 일체형 기준선을 측정해 정한다.

**핵심 요약 — PD 분리는 간섭과 병렬화 결합을 줄일 수 있지만 KV 전송 비용을 치른다. 단문과 장문을 포함한 실제 트래픽에서 손익분기점을 측정해야 한다.**

---

## 2. 쿠버네티스 추론 라우팅의 표준화: GAIE와 Endpoint Picker(EPP)

같은 시스템 프롬프트를 쓰는 사내 문서 질의가 매번 다른 파드로 흩어진다. 캐시가 어느 파드에 있는지는 아무도 확인하지 않으니, 각 파드는 같은 문서를 처음부터 다시 읽는다. 이 절은 분리한 파드 중 어디로 요청을 보낼지 정하는 기준을 다룬다.

PD 분리 클러스터를 구축하더라도 앞단의 인그레스 프록시가 기존 웹 트래픽 방식으로 동작하면 이점이 사라진다. 앞서 [EKS Gateway API 마이그레이션과 Cilium 통합 실전](/k8s/gateway-api-migration-cilium/)[^6]에서 본 표준 쿠버네티스 `Gateway`와 `HTTPRoute`를 떠올려 보자. 이 둘은 L7 경로·헤더 분기와 라운드로빈 가중치 분배를 표준화했다.

그러나 LLM 추론 워크로드의 내부 상태는 인지하지 못한다.

### 2.1 전통적 L7 게이트웨이의 한계와 추론 트래픽의 비대칭성

기존 Envoy나 NGINX 인그레스의 라운드로빈과 최소 연결 방식은 토큰 길이와 캐시 위치를 직접 고려하지 않는다. 입력 길이가 서로 다른 요청은 연산량과 메모리 점유량도 다를 수 있다.

**캐시 비인식(Cache-Oblivious) 라우팅**에서는 같은 시스템 프롬프트를 쓰는 요청이 이전 워커로 돌아가지 못할 수 있다. 접두사 캐싱과 TTFT의 관계는 [vLLM과 SGLang 비교](/llm/k8s-low-latency-llm-serving-vllm-sglang/)[^8]에서도 다룬다. 절감폭은 적중 길이와 부하에 따라 달라진다.

반면 단순 라운드로빈 라우터는 요청을 매번 다른 파드로 흩뿌린다. 그러면 클러스터 전체에서 동일한 프리필 연산이 중복 수행된다. HBM 공간도 중복 KV 블록으로 채워진다.

### 2.2 Gateway API Inference Extension(GAIE)과 EPP 스케줄링 파이프라인

이 문제를 해결하기 위해 Kubernetes SIG Network가 나섰다. 표준 Gateway API 위에 추론 전용 리소스(`InferencePool`, `InferenceModel`)와 확장 스케줄러를 결합했다. 이 결합체가 **게이트웨이 API 추론 확장(Gateway API Inference Extension, GAIE)**이며, SIG Network가 이를 표준화했다[^7].

![EPP 스케줄링 흐름: 요청 criticality와 LoRA 적합성, 대기 큐 길이 및 KV 캐시 사용률을 단계적으로 평가해 최적 파드를 선택하는 흐름](/assets/images/llm/official-kubernetes-inference-extension-epp.webp)
*출처: [Kubernetes Blog — Introducing Gateway API Inference Extension](https://kubernetes.io/blog/2025/06/05/introducing-gateway-api-inference-extension/), CC BY 4.0*

GAIE 아키텍처는 두 계층으로 구성된다. Envoy 프록시와 `ext_proc`(External Processing) gRPC 프로토콜로 통신하는 **엔드포인트 선택기(Endpoint Picker, EPP)**가 첫째다. **흐름 제어(Flow Control)** 계층이 둘째다. 두 계층이 함께 동작하는 순서는 아래와 같다.

1. **흐름 제어(Flow Control) 및 Criticality 큐잉**: 요청에 부여된 중요도(`criticality`: `Critical`, `Standard`, `Sheddable`)를 먼저 본다. 클러스터가 과부하 상태면 배치성(`Sheddable`) 요청을 대기열에 보류하거나 조기 거절(Load Shedding)한다. 이렇게 해서 실시간 대화형(`Critical`) SLO를 방어한다.
2. **단계적 필터링 및 스코어링 파이프라인**: EPP는 각 서빙 파드의 프로메테우스 메트릭을 주기적으로 수집한다. 수집 항목은 대기 큐 깊이 `waiting_queue_depth`, KV 캐시 블록 사용률 `kv_cache_usage_perc`, 로드된 LoRA 어댑터 목록, 프리픽스 해시 인덱스다. EPP는 이 값들을 바탕으로 최적의 엔드포인트를 고른다.

이미 재료를 손질해 둔 주방에 주문을 넘기는 것과 같다. 재료가 없는 주방은 같은 손질을 처음부터 다시 해야 하고, 그 시간이 그대로 첫 토큰 지연으로 돌아온다.

복합 스코어링 함수 $S_{\text{EPP}}(p, q)$는 후보 파드 $p$와 요청 $q$마다 값을 계산한다. 입력은 네 가지다. 프리픽스 캐시 히트율 $H_{\text{prefix}}(p, q) \in [0, 1]$과 LoRA 어댑터 상주 여부 $I_{\text{LoRA}}(p, q) \in \{0, 1\}$가 앞의 두 개다.

정규화된 대기 큐 길이 $\tilde{Q}(p) \in [0, 1]$와 KV 캐시 사용률 $U_{\text{KV}}(p) \in [0, 1]$가 나머지다. 네 값을 가중 합산하여 점수를 낸다. 가중치 $w_{\text{cache}}$, $w_{\text{lora}}$는 캐시와 어댑터 적합성에 가산점을 준다.

반대로 $w_{\text{queue}}$, $w_{\text{kv}}$는 큐 적체와 KV 포화에 감점을 준다.

$$S_{\text{EPP}}(p, q) = w_{\text{cache}} \cdot H_{\text{prefix}}(p, q) + w_{\text{lora}} \cdot I_{\text{LoRA}}(p, q) - w_{\text{queue}} \cdot \tilde{Q}(p) - w_{\text{kv}} \cdot U_{\text{KV}}(p)$$

### 2.3 캐시 인식 라우터와 PD 분리의 결합: Prefill Bypass

이 절은 프리필 단계를 아예 건너뛸 수 있는 조건을 정리한다. GAIE의 EPP를 PD 분리 아키텍처와 결합하면 최적화 경로가 하나 더 열린다. 일반적인 PD 분리 흐름에서는 모든 요청이 `라우터 -> 프리필 풀 -> KV 전송 -> 디코드 풀` 순서로 이동한다.

그러나 EPP가 클러스터의 분산 KV 캐시 인덱스를 조회하는 순간이 있다. 그때 **요청 프롬프트의 프리픽스 캐시 히트율이 임계치(예: 90% 이상)를 넘는다면** 상황이 달라진다. 해당 KV 블록이 이미 특정 디코드 파드(또는 디코드 노드의 로컬 DRAM 티어)에 상주하고 있다면 더욱 그렇다.

이 조건이 맞으면 프리필 풀을 거칠 이유가 없다.

이 경우 라우터는 프리필 워커 디스패치와 네트워크 KV 전송 단계를 통째로 우회(Bypass)한다. 그리고 해당 디코드 파드로 요청을 직행시킨다. 남은 미스 토큰(Suffix)만 로컬에서 짧게 계산하고, 곧바로 토큰 생성을 시작한다.

### 2.4 TypeSafe System One(Jev) 기반 초저지연 라우팅 분기 제어

입력 토큰 길이만으로 출력 길이나 추론 복잡도를 확정할 수 없다. 게이트웨이에서 민감도·요청 티어·주입 가능성을 평가한 뒤, 허용된 경로 중 어디로 보낼지 선택하는 설계를 고려할 수 있다.

TypeSafe AI의 System One(Jev)[^9]을 L1 평가 계층으로 사용하는 다음 루브릭은 개념 예시다. 외부 판정 서비스에 원문을 보내는 것 자체가 반출일 수 있으므로 사설망 정책과 서비스 배치·데이터 처리 조건을 먼저 확인해야 한다. 배치가 허용되지 않으면 승인된 내부 통제 수단을 사용한다.

```python
from typesafe import SystemOne, Choice, Noul

client = SystemOne()
ENTERPRISE_GATEWAY_RUBRIC = {
    "data_sensitivity": Choice(
        instructions="입력의 기밀 정보 및 규제 등급을 분류하시오.",
        criteria={
            "public_general": "공개 가능한 일반 질의.",
            "internal_confidential": "사내 코드, 회의록 또는 업무 지침.",
            "restricted_pii": "개인 식별 정보, 재무 결산 또는 감사 대상 데이터.",
        },
    ),
    "compute_tier": Choice(
        instructions="요청에 적합한 서빙 티어를 분류하시오.",
        criteria={
            "l1_cache_or_small": "캐시 또는 소형 모델로 해결 가능한 단순 요청.",
            "l2_standard_70b": "일반 코드 작성이나 문서 구조화 분석.",
            "l3_distributed_frontier": "대규모 분산 추론이 필요한 복잡한 요청.",
        },
    ),
    "is_adversarial_injection": Noul(
        instructions="시스템 지침 우회 또는 비인가 정보 유출 시도가 포함되어 있는가?"
    ),
}
# 판정 결과를 검증된 정책 엔진에 전달한다.
```

예를 들어 호스트 정책은 주입 의심 요청을 검토·거절하고, 제한 정보는 실제로 격리된 엔드포인트만 허용하며, 나머지는 허용 목록 안에서 소형 또는 분산 풀로 보낼 수 있다. 모델 이름만 바꿔서는 격리가 되지 않는다. 판정은 오탐과 누락이 있으므로 인가, DLP, 네트워크 차단을 대체하지 못한다. 실패·타임아웃 시 민감 요청을 외부 경로로 보내지 않도록 정책을 정하고, 라벨링한 홀드아웃 데이터로 분류 품질과 지연을 측정한다.

아래는 출력 길이와 캐시 상태를 이용한 별도 경로 선택 예시다. 지연 수치와 임계값은 서비스·환경·부하에 따라 측정해야 한다.

호스트 코드는 이 결과를 바탕으로 경로를 결정론적으로 나눈다. 경로는 **일체형 단문 풀(Colocated Short Pool)**, **PD 분리 파이프라인(Disaggregated PD Pool)**, **디코드 직행(Decode Direct Bypass)** 세 가지다.

**1) `/v1/systemone` HTTP 요청 페이로드 구조**: 런타임 메트릭과 프롬프트 원문은 `state`에만 격리한다. 그리고 `questions`에는 오직 판단 기준만 선언한다[^9].

```json
{
  "state": {
    "prompt_head": "아래 쿠버네티스 네트워크 장애 로그 14,200줄을 분석하여 패킷 드롭 원인과 Cilium eBPF 맵 수정 패치를 작성하시오...",
    "input_token_count": 11420,
    "prefix_cache_hit_ratio": 0.94,
    "cached_decode_pod_id": "decode-worker-rack2-03",
    "decode_pool_kv_utilization": 0.62
  },
  "questions": {
    "generation_horizon": {
      "type": "choice",
      "instructions": "요청의 작업 지시문을 바탕으로 예상되는 출력 토큰 생성 규모를 분류하시오.",
      "criteria": {
        "short_atomic": "단답형 확인, 단일 명령어 조회 등 200 토큰 미만의 출력으로 완결되는 요청.",
        "medium_structured": "함수 스니펫 작성, 단락 요약 등 200~1,000 토큰 사이의 출력이 예상되는 요청.",
        "long_exhaustive": "전체 모듈 코드 생성, 대규모 로그 전수 분석 등 1,000 토큰 이상의 장기 디코드 세션이 필요한 요청."
      }
    },
    "decode_memory_pressure_risk": {
      "type": "score",
      "instructions": "입력 길이, 캐시 히트율, 예상 출력 규모를 종합하여 디코드 워커 HBM 압박 위험도를 평가하시오.",
      "criteria": {
        "0": "입력 512 토큰 미만이고 단답형 출력이 예상되어 단일 워커 HBM 점유 증가분이 1% 미만인 상태.",
        "1": "입력 512~4,096 토큰 또는 중간 길이 출력이나 기존 프리픽스 캐시 재사용으로 추가 블록 할당이 제한적인 상태.",
        "2": "입력 4,096~16,384 토큰이며 신규 KV 블록 할당과 장기 디코드 점유가 동시에 발생하는 상태.",
        "3": "입력 16,384 토큰 이상이거나 장기 출력이 결합되어 일체형 파드 배치를 블로킹할 위험이 즉각적인 상태."
      }
    },
    "can_bypass_prefill_pool": {
      "type": "noul",
      "instructions": "프리픽스 캐시 히트율이 0.90 이상이고 디코드 풀의 KV 사용률이 0.80 미만이어서 프리필 풀을 우회하고 캐시 보유 디코드 워커로 직행할 수 있는가?"
    }
  }
}
```

**2) Python SDK 선언 및 호스트 코드 분기 제어**: 같은 기준을 Python SDK로 선언하고 호스트 코드에서 분기하는 예시다.

```python
from typesafe import SystemOne, Choice, Score, Noul
import httpx

jev = SystemOne()

DISAGG_ROUTING_RUBRIC = {
    "generation_horizon": Choice(
        instructions="요청의 작업 지시문을 바탕으로 예상되는 출력 토큰 생성 규모를 분류하시오.",
        criteria={
            "short_atomic": "단답형 확인, 단일 명령어 조회 등 200 토큰 미만의 출력으로 완결되는 요청.",
            "medium_structured": "함수 스니펫 작성, 단락 요약 등 200~1,000 토큰 사이의 출력이 예상되는 요청.",
            "long_exhaustive": "전체 모듈 코드 생성, 대규모 로그 전수 분석 등 1,000 토큰 이상의 장기 디코드 세션이 필요한 요청.",
        },
    ),
    "decode_memory_pressure_risk": Score(
        instructions="입력 길이, 캐시 히트율, 예상 출력 규모를 종합하여 디코드 워커 HBM 압박 위험도를 평가하시오.",
        criteria={
            0: "입력 512 토큰 미만이고 단답형 출력이 예상되어 단일 워커 HBM 점유 증가분이 1% 미만인 상태.",
            1: "입력 512~4,096 토큰 또는 중간 길이 출력이나 기존 프리픽스 캐시 재사용으로 추가 블록 할당이 제한적인 상태.",
            2: "입력 4,096~16,384 토큰이며 신규 KV 블록 할당과 장기 디코드 점유가 동시에 발생하는 상태.",
            3: "입력 16,384 토큰 이상이거나 장기 출력이 결합되어 일체형 파드 배치를 블로킹할 위험이 즉각적인 상태.",
        },
    ),
    "can_bypass_prefill_pool": Noul(
        instructions="프리픽스 캐시 히트율이 0.90 이상이고 디코드 풀의 KV 사용률이 0.80 미만이어서 프리필 풀을 우회하고 캐시 보유 디코드 워커로 직행할 수 있는가?"
    ),
}

async def dispatch_inference_request(
    prompt: str, input_tokens: int, prefix_hit_ratio: float,
    cached_decode_pod_url: str | None, decode_kv_util: float, payload: dict,
) -> dict:
    judgment = await jev.evaluate_async(
        state={
            "prompt_head": prompt[:1500],
            "input_token_count": input_tokens,
            "prefix_cache_hit_ratio": prefix_hit_ratio,
            "cached_decode_pod_id": cached_decode_pod_url or "none",
            "decode_pool_kv_utilization": decode_kv_util,
        },
        questions=DISAGG_ROUTING_RUBRIC,
    )

    # 예시 임계값: 실제 홀드아웃 데이터로 보정해야 한다.
    if cached_decode_pod_url and prefix_hit_ratio >= 0.90 and judgment.can_bypass_prefill_pool.prob >= 0.88:
        target_endpoint = f"{cached_decode_pod_url}/v1/chat/completions"
        routing_mode = "DECODE_DIRECT_BYPASS"
    elif input_tokens < 512 and judgment.generation_horizon.choice == "short_atomic" and judgment.decode_memory_pressure_risk.score <= 1:
        target_endpoint = "http://colocated-short-pool.llm-serving.svc:8000/v1/chat/completions"
        routing_mode = "COLOCATED_FAST_PATH"
    else:
        target_endpoint = "http://gaie-epp-disagg-router.llm-serving.svc:8000/v1/chat/completions"
        routing_mode = "PD_DISAGGREGATED_PIPELINE"

    async with httpx.AsyncClient(timeout=120.0) as client:
        resp = await client.post(target_endpoint, json=payload, headers={"X-Routing-Mode": routing_mode})
        return resp.json()
```

**핵심 요약 — GAIE와 EPP의 라우팅에 판정 계층을 결합할 수 있지만, 임계값과 전체 지연은 실측하고 인가·데이터 격리는 별도로 강제해야 한다.**

---

## 3. 분산 추론 오케스트레이터 해부: NVIDIA Dynamo 1.0 vs CNCF llm-d v0.5

노드 4대에 걸친 모델 복제본에서 파드 하나가 재시작되면, 나머지 파드들은 짝을 잃고 트래픽을 받지 못한다. 그룹이 깨지는 순간 GPU 16~32장이 함께 논다. 이 절은 분리형 파드를 실제로 묶어 띄우는 오케스트레이터를 비교한다.

PD 분리와 캐시 인식 라우팅을 쿠버네티스에서 굴리려면 전용 컨트롤러가 필요하다. 오픈소스 생태계는 두 오케스트레이터로 모이고 있다. 하나는 NVIDIA가 주도하는 데이터센터 스케일 추론 프레임워크인 **NVIDIA Dynamo(v1.0 GA)**[^10]다.

다른 하나는 Red Hat·Google·IBM·CoreWeave 등이 공동 발족한 **llm-d(v0.5)**[^11]다. llm-d는 2026년 3월 CNCF 샌드박스 프로젝트로 채택되었다.

### 3.1 NVIDIA Dynamo 1.0 vs CNCF llm-d v0.5 아키텍처 비교

아래 표는 NVIDIA Dynamo와 CNCF llm-d를 아키텍처 포지셔닝, 배포 단위, KV 전송 계층 관점에서 나란히 비교한 결과다.

| 비교 항목 | NVIDIA Dynamo (v1.0 GA) | CNCF llm-d (v0.5) |
|---|---|---|
| **아키텍처 포지셔닝** | 추론 엔진(vLLM, SGLang, TensorRT-LLM) 상위에서 동작하는 범용 분산 런타임 계층 (Stack-above) | KServe 컨트롤 플레인과 vLLM 서빙 엔진 사이를 잇는 쿠버네티스 네이티브 데이터플레인 |
| **코어 구현체 및 컴포넌트** | Rust 기반 고성능 런타임 코어 + Python 확장성 레이어 (`DynamoGraphDeployment`) | 쿠버네티스 표준 GAIE + EPP + `LeaderWorkerSet`(LWS) + vLLM 네이티브 통합 |
| **스케줄링 및 배포 단위** | 단일 그래프 선언 내에서 Frontend, Router, Prefill Worker, Decode Worker 생명주기 통합 관리 | Prefill, Decode, Router를 각각 독립된 K8s `Service` 및 `LeaderWorkerSet`으로 분리 배포 |
| **오토스케일링 시그널** | **Planner Profiler + SLA Planner**: 목표 TTFT/ITL SLO에 맞춰 Prefill:Decode 비율 자동 재조정 | 역할별 분리 HPA: 프리필 풀은 **Queue Depth**, 디코드 풀은 **KV Cache Utilization** 기반 독립 스케일링 |
| **KV 캐시 전송 계층** | **NIXL(NVIDIA Inference Transfer Library)**: GPUDirect RDMA/InfiniBand 우선, UCX/TCP 자동 폴백 | vLLM NIXL 커넥터, **LMCache**, **UCCL**(컨테이너 레벨 집합 통신 및 전송) 플러그인 지원 |
| **핵심 특화 기능** | 글로벌 KV 캐시 관리자(GPU HBM ↔ CPU DRAM ↔ 로컬/네트워크 SSD 티어링), 이기종 엔진 통합 | 계층형 KV 오프로딩, 캐시 인식 LoRA 어댑터 라우팅, 토폴로지 인식 배치, Scale-to-Zero |

### 3.2 NVIDIA Dynamo 1.0: SLA Planner와 NIXL 전송 추상화

NVIDIA Dynamo[^10]는 특정 서빙 엔진에 얽매이지 않는다. vLLM, SGLang, TensorRT-LLM 위에 공통 분산 제어면을 씌우는 **상위 계층(Stack-above)** 설계를 택한다. 지연 시간에 민감한 라우터와 이벤트 루프는 Rust로 작성되어 마이크로초 단위의 디스패치 성능을 보장한다. 반면 오케스트레이션 정책과 커스텀 파이프라인은 Python으로 유연하게 확장할 수 있다.

Dynamo의 핵심 차별점은 **SLA Planner**와 **NIXL(NVIDIA Inference Transfer Library)**이다.

1. **Planner Profiler & SLA Planner**: 배포 전 모델과 하드웨어 조합에 대해 입력/출력 길이별 보간 곡선(Interpolation Curve)을 프로파일링한다. 운영 중 트래픽의 평균 입력 길이($\bar{S}_{\text{in}}$)가 길어져 TTFT가 목표 SLO에 근접하면 프리필 워커 복제본 수를 늘린다. 반대로 동시 디코드 세션이 누적되어 토큰 간 지연(ITL)이 상승하면 디코드 워커 비율을 실시간으로 확장한다.
2. **NIXL(NVIDIA Inference Transfer Library)**: GPU HBM, 호스트 CPU DRAM, 로컬 NVMe SSD, 원격 노드 HBM에 걸친 데이터 이동을 단일 API로 추상화한다. 하드웨어가 GPUDirect RDMA(InfiniBand 또는 RoCE v2)를 지원하면 제로카피 RDMA 경로를 자동 선택한다. 일반 이더넷 환경에서는 TCP/소켓 백엔드로 투명하게 폴백한다.

### 3.3 CNCF llm-d v0.5: LeaderWorkerSet(LWS)과 쿠버네티스 네이티브 토폴로지 제어

반면 CNCF **llm-d**[^11]는 새로운 자체 런타임을 만들지 않는다. 대신 쿠버네티스 공식 표준 API들(GAIE, LeaderWorkerSet, HPA)을 조합한다. KServe와 vLLM 사이의 간극을 메우는 **K8s-native 데이터플레인** 전략이다.

![LeaderWorkerSet 구조: 리더 StatefulSet과 워커 StatefulSet이 그룹 단위로 묶여 멀티노드 추론 레플리카를 형성하는 구조](/assets/images/llm/official-custom-model-serving-pipeline.webp)
*출처: [LeaderWorkerSet 공식 문서 — Concepts](https://lws.sigs.k8s.io/docs/concepts/leaderworkerset/), CC BY 4.0*

초거대 MoE 모델(예: DeepSeek-V3 671B, Kimi K2)을 서빙할 때는 단일 추론 복제본(Replica) 하나가 노드 2~4대(GPU 16~32장)에 걸쳐 실행되어야 한다. 기존 쿠버네티스 `Deployment`는 개별 파드를 독립 단위로 취급한다. `StatefulSet`은 전체 파드를 하나의 직렬 집합으로만 다룬다. 그래서 **"멀티노드로 묶인 파드 그룹(Super-pod)을 하나의 추론 복제본 단위로 오토스케일링"**하기 어렵다.

이를 해결하기 위해 llm-d는 Kubernetes SIG Apps의 **LeaderWorkerSet(LWS)**[^12]을 기본 워크로드 컨트롤러로 사용한다. 아래 네 가지 기능이 그 핵심이다.

- **그룹 단위 원자적 생명주기(All-or-Nothing Topology)**: 1개의 리더 파드(Rank 0)와 $N-1$개의 워커 파드를 단일 복제본 그룹으로 묶어 함께 생성·재시작·스케일링한다. 2026년 7월 릴리스된 **LWS v1.2**에서는 동적 토폴로지 조정과 우선순위 어노테이션이 추가되었다. 부분 노드 장애 시 그룹 재스케줄링 속도가 개선되었다.
- **물리적 토폴로지 인식 배치**: LWS 공식 문서는 `leaderworkerset.sigs.k8s.io/exclusive-topology` 어노테이션에 노드 토폴로지 레이블 키를 지정하는 방식을 설명한다.[^19] 예를 들어 랙을 나타내는 레이블이 모든 관련 노드에 정확히 지정되어 있다면 그룹별로 같은 랙 도메인에 배치할 수 있다. 이 기능은 설치한 LWS 버전과 클러스터의 레이블·스케줄링 조건을 확인해야 하며, 랙 배치만으로 네트워크 경로나 혼잡 방지가 보장되지는 않는다.
- **역할별 비대칭 오토스케일링**: llm-d는 프리필과 디코드를 별도의 쿠버네티스 `Service`로 노출한다. 프리필 풀의 HPA는 **대기 큐 길이(Queue Depth)**를 주 시그널로 삼는다. 디코드 풀의 HPA는 **KV 캐시 메모리 사용률(KV Utilization)**을 주 시그널로 삼아 HBM 고갈을 방어한다.
- **llm-d v0.5 확장 기능**: 계층형 KV 오프로딩(HBM $\to$ CPU RAM $\to$ 원격 스토리지)을 지원한다. 캐시 인식 LoRA 라우팅과 컨테이너 집합 통신 가속을 위한 **UCCL** 통합도 포함한다. 유휴 시간대 GPU 비용을 줄이는 **Scale-to-Zero**도 제공한다.

여객선 한 척을 띄우려면 선원 전원이 함께 타야 한다. 한 명이 늦으면 나머지를 태우고도 출항하지 못하듯, 리더와 워커는 한 그룹 단위로만 뜨고 내린다.

**핵심 요약 — NVIDIA Dynamo 1.0은 SLA Planner와 NIXL을 통해 다중 서빙 엔진 위에서 Prefill:Decode 비율과 전송 계층을 통합 제어한다. CNCF llm-d v0.5는 GAIE와 LeaderWorkerSet(LWS)을 결합해 쿠버네티스 네이티브 표준 위에서 멀티노드 복제본과 역할별 HPA를 구현한다**.

---

## 4. KVCache를 일급 시민으로: Mooncake와 LMCache 제로카피 전송

프리필이 끝났는데도 첫 토큰이 뜨지 않고, 그동안 GPU는 놀면서 네트워크 카드만 바쁘다. 이 구간의 길이가 체감 품질을 좌우한다. 이 절은 생성된 KVCache를 노드 사이에 어떻게 지연 없이 주고받을지 다룬다.

PD 분리 아키텍처의 성패는 네트워크 전송 지연에 달려 있다. 핵심은 수 기가바이트에서 수십 기가바이트에 이르는 KVCache 텐서를 지연 없이 옮기는 일이다. 현대 추론 시스템은 KVCache를 일회성 연산 부산물로 보지 않는다.

클러스터 전역에서 주소를 지정하고 계층을 이동할 수 있는 **일급 시민(First-Class Citizen)**으로 다룬다.

### 4.1 운영체제 가상 메모리 및 GFS 아키텍처와의 설계 대조

KVCache 중심 서빙 아키텍처는 고전 원리를 GPU 클러스터로 옮겨온 결과물이다. 운영체제(OS)의 메모리 관리와 분산 파일 시스템의 지혜가 여기에 쓰인다. 아래 두 항목이 그 대응 관계를 보여준다.

- **OS 페이징·스왑 및 NUMA 지역성과의 대응**: 과거 정리했던 [운영체제 메인 메모리 관리와 페이징](/os/os9_10th/)[^13] 및 [가상 메모리와 요구 페이징(Demand Paging), 워킹셋 모델](/os/os10_10th/)[^14]을 떠올려 보자. OS 커널은 단편화를 막기 위해 고정 크기 페이지 테이블을 둔다. 워킹셋에서 밀려난 콜드 페이지는 디스크 스왑 영역으로 내린다(Page-out). vLLM의 PagedAttention은 단일 GPU 안의 페이지 테이블이다. Mooncake와 LMCache는 이를 클러스터 단위 가상 메모리로 넓힌다. 계층은 **GPU HBM(L1 캐시) $\leftrightarrow$ 호스트 CPU DRAM(메인 메모리) $\leftrightarrow$ 로컬 NVMe 및 원격 RDMA 메모리 풀(스왑 스토리지)**로 이어진다. 다중 소켓 서버에서 PCIe 루트를 가로지르면 대역폭이 반감된다. 따라서 OS의 **비균일 메모리 접근(NUMA)** 스케줄링처럼, GPU와 같은 NUMA 노드에 직결된 RDMA NIC(RNIC)와 핀 고정 메모리(Pinned Memory)만 묶어야 제로카피 대역폭이 온전히 나온다.
- **Google File System(GFS)과의 대응**: [Google File System(GFS) 논문 리뷰](/paper/gfs/)[^15]에서 살펴본 핵심 설계는 두 가지다. 첫째, 작은 블록 대신 **64MB의 대형 청크(Chunk)** 단위로 데이터를 묶는다. 이렇게 해서 메타데이터 오버헤드와 왕복 비용을 상각(Amortize)한다. 둘째, **제어 흐름과 데이터 흐름을 분리**한다. 마스터 노드는 청크 위치 메타데이터만 본다. 클라이언트와 청크서버는 직접 파이프라인으로 데이터를 스트리밍한다. Mooncake의 Conductor(메타데이터 스케줄러)와 Transfer Engine(직접 RDMA 전송)이 이 분리를 따른다. LMCache의 청크 병합 역시 같은 GFS 원칙을 KVCache 전송에 옮긴 구조다.

### 4.2 전송 계층 병목 해부: Post-prefill Pull vs Layer-by-layer 스트리밍

KVCache를 언제, 어떤 단위로 보내느냐에 따라 지연이 바뀐다. 전송은 첫 토큰까지 걸리는 시간(TTFT)에 영향을 줄 수 있다. 광 회선 전환을 프리필에 겹치는 방법도 연구되었으며, 해당 연구의 결과는 H100에서 측정한 프리필 시간을 바탕으로 한 시뮬레이션이다.[^16]

1. **기본 vLLM NIXL 커넥터의 Post-prefill Pull 방식**:
   프리필 워커가 $L$개 레이어의 순전파를 끝까지 완료한다. 그 뒤 디코드 워커로 완료 알림을 보낸다. 디코드 워커는 원격 읽기(RDMA Read / Pull)로 전체 KVCache를 가져온다. 이 방식에서는 연산 시간 $T_{\text{prefill}}$과 전송 시간 $T_{\text{transfer}}$가 직렬로 이어진다.
   $$\text{TTFT}_{\text{pull}} = T_{\text{prefill}} + T_{\text{transfer}} + T_{\text{decode\_step1}}$$
   실제 전송 시간은 캐시 크기, 유효 대역폭, 혼잡에 따라 측정해야 한다.

2. **레이어별 비동기 스트리밍**:
   Mooncake 논문은 레이어별로 생성된 KVCache를 전송하면서 후속 프리필 연산을 이어가는 방식을 설명한다.[^17] 연산과 전송이 겹치면 프리필 완료 후 남는 대기 시간을 줄일 수 있지만, 대역폭이 부족하거나 큐가 쌓이면 마지막 레이어 외에도 전송이 남는다. 실제 중첩과 지연은 엔진·전송 경로·하드웨어별로 확인해야 한다.

이삿짐을 모두 싼 뒤에 트럭을 부르는 방식과, 짐을 싸는 즉시 트럭에 올리는 방식의 차이다. 뒤쪽은 포장이 끝나기를 기다리지 않으므로 트럭이 짐을 다 받는 시점이 앞당겨진다.

### 4.3 Mooncake 아키텍처와 USENIX FAST 2025 실측 지표

Moonshot AI와 칭화대 연구진이 설계한 **Mooncake**[^17]를 보자. KVCache 중심 분리형 아키텍처를 정립하여 **USENIX FAST 2025 최우수 논문상(Best Paper Award)**을 받았다. 2026년 2월 PyTorch 생태계에 공식 합류했다. 이어 2026년 8월 vLLM(v0.31.0) 및 LMDeploy(v0.18.0)에 기본 통합되었다.

Mooncake의 핵심 엔진은 **Transfer Engine**이다. 서버에 장착된 여러 RDMA NIC(예: 4×200Gbps 또는 8×400Gbps RoCE v2 / InfiniBand)를 하나의 논리 전송 파이프로 묶는다(Multi-NIC Aggregation). GPU-CPU-NIC 간 NUMA 토폴로지도 자동으로 탐색한다. 이를 통해 크로스 소켓 QPI/UPI 병목을 피해 간다.

| 실험 조건과 비교 기준 | 논문이 보고한 결과 |
|---|---|
| 16개 8×A800 노드, 실제 대화 트레이스, TTFT·TBT SLO 아래 vLLM 기준선과 비교 | 기준선과 TBT 조건에 따라 유효 요청 용량 59~498% 증가 |
| Kimi 운영의 기존 시스템 대비 저자 측 과거 통계 | A800에서 115%, H800에서 107% 더 많은 요청 처리 |

이는 논문 저자의 특정 환경 결과이며 모든 PD 배포에 적용되는 수치가 아니다.[^17] 흡수된 이전 글의 32개 H100, 입력 4,096·출력 1,024 토큰 표와 p99 63% 감소는 해당 논문에서 같은 실험 조건과 수치를 확인하지 못해 실측 결과로 인용하지 않는다.

또한 Mooncake는 노드들의 유휴 CPU DRAM과 로컬 SSD를 묶어 분산 KV 저장소(**Mooncake Store**)를 만든다. 특정 파드의 HBM에서 쫓겨난(Evict) KV 블록도 원격 DRAM 풀에 남아 있을 수 있다. 그러면 다음 턴 요청이 들어왔을 때 재연산하지 않고 RDMA로 읽는다. 프리필 GPU 연산을 아끼는 방법이다.

### 4.4 LMCache: 소형 페이지 병목 극복을 위한 대형 청크 병합과 CUDA 스트림 파이프라이닝

vLLM 생태계에서 널리 쓰이는 **LMCache**[^18]는 PagedAttention의 구조적 I/O 단위 불일치를 해결하는 데 집중한다.

잘게 쪼개진 비연속 KV 페이지를 개별적으로 전송하면 요청과 메타데이터 처리 오버헤드가 늘 수 있다. 블록 크기와 대역폭 활용률은 모델과 구현에 따라 달라진다.

LMCache는 이를 두 단계로 해결한다.

1. **가변 대형 청크 병합(Configurable Chunk Coalescing)**: 파편화된 KV 페이지들을 전송 직전에 묶는다. **256 토큰 이상의 연속된 대형 청크(수 메가바이트 단위)**로 병합하여 단일 벌크 DMA/RDMA 트랜잭션으로 밀어 넣는다.
2. **별도 CUDA 스트림 기반 레이어별 파이프라이닝**: 추론 연산용 기본 스트림과 분리된 전용 I/O 스트림(`cudaStreamNonBlocking`)을 띄운다. 레이어 연산이 돌아가는 동안 백그라운드에서 CPU RAM, 로컬 디스크, NIXL, 또는 Mooncake Store로 KV 청크를 비동기 전송한다.

**핵심 요약 — Mooncake와 LMCache는 KVCache를 계층화하고 전송을 최적화한다. 전송 속도와 연산 중첩 효과는 하드웨어와 구현 조건에서 따로 측정해야 한다.**

---

## 5. 배포 예시: Dynamo PD 분리와 LMCache CPU 오프로딩

아래 두 예시는 서로 다른 공식 구성을 보여준다. 첫째는 Dynamo의 NIXL 기반 PD 분리이고, 둘째는 별도 vLLM 서버의 LMCache CPU 오프로딩이다. 두 예시를 결합한 통합 매니페스트라고 가정해서는 안 된다.

### 5.1 Dynamo 1.0.0 공식 분리형 배포

다음은 Dynamo **v1.0.0**의 vLLM 분리형 [공식 `disagg.yaml` 예제][^20]다. `nvidia.com/v1alpha1`과 `spec.services`는 이 버전의 API이며, 다른 버전에 그대로 적용한다고 가정하지 않는다. 프론트엔드와 프리필·디코드 워커가 각각 선언되며 프리필 워커의 `NixlConnector`는 LMCache 커넥터가 아니다.

```yaml
# SPDX-FileCopyrightText: Copyright (c) 2025-2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0

apiVersion: nvidia.com/v1alpha1
kind: DynamoGraphDeployment
metadata:
  name: vllm-disagg
spec:
  services:
    Frontend:
      componentType: frontend
      replicas: 1
      extraPodSpec:
        mainContainer:
          image: nvcr.io/nvidia/ai-dynamo/vllm-runtime:1.0.0
    VllmDecodeWorker:
      envFromSecret: hf-token-secret
      componentType: worker
      subComponentType: decode
      replicas: 1
      resources:
        limits:
          gpu: "1"
      extraPodSpec:
        mainContainer:
          image: nvcr.io/nvidia/ai-dynamo/vllm-runtime:1.0.0
          workingDir: /workspace/examples/backends/vllm
          command:
          - python3
          - -m
          - dynamo.vllm
          args:
            - --model
            - Qwen/Qwen3-0.6B
            - --disaggregation-mode
            - decode
    VllmPrefillWorker:
      envFromSecret: hf-token-secret
      componentType: worker
      subComponentType: prefill
      replicas: 1
      resources:
        limits:
          gpu: "1"
      extraPodSpec:
        mainContainer:
          image: nvcr.io/nvidia/ai-dynamo/vllm-runtime:1.0.0
          workingDir: /workspace/examples/backends/vllm
          command:
          - python3
          - -m
          - dynamo.vllm
          args:
            - --model
            - Qwen/Qwen3-0.6B
            - --disaggregation-mode
            - prefill
            - --kv-transfer-config
            - '{"kv_connector":"NixlConnector","kv_role":"kv_both"}'
```

공식 배포 안내[^21]의 전제는 Dynamo Kubernetes 플랫폼 설치, GPU 클러스터와 이미지 레지스트리 접근, 배포 네임스페이스의 `hf-token-secret`이다. 공식 예제는 Hugging Face에서 모델을 받는 구성이다. 외부 연결을 차단한 환경에서는 승인된 모델 공급 경로와 이미지·시크릿을 별도로 준비해야 한다. 위 설정은 SLA Planner나 랙 배치를 선언하지 않는다.

### 5.2 별도 LMCache CPU 오프로딩과 검증 포인트

LMCache 공식 CPU RAM 문서[^22]의 독립 vLLM 예제에서 사용하는 `cpu-offload.yaml` 설정은 다음과 같다. 문서는 특정 LMCache 버전을 고정하지 않으므로 설치 전에 [버전 호환성 안내](https://docs.lmcache.ai/getting_started/compatibility.html)를 확인해야 한다.

```yaml
chunk_size: 256
local_cpu: true
max_local_cpu_size: 5.0
```

같은 공식 예제는 `LMCACHE_CONFIG_FILE`로 이 파일을 지정하고 `LMCACHE_USE_EXPERIMENTAL=True` 환경 변수를 설정한다. vLLM에 `--kv-transfer-config '{"kv_connector":"LMCacheConnectorV1", "kv_role":"kv_both"}'`를 전달하여 로컬 CPU 캐시의 저장·로드를 사용한다. 이는 위 Dynamo PD 배포와 별도인 단일 서버 오프로딩 예제이며, 워커 간 KV 전송이나 Dynamo와의 통합을 검증한 구성은 아니다.

운영 환경에서는 다음을 확인한다.

1. **버전과 캐시**: 설치된 CRD와 엔진·커넥터 버전의 호환성, 모델 접근 경로, 캐시 적중률과 청크 크기에 따른 메모리·전송 비용을 측정한다.
2. **네트워크와 NUMA**: 실제 장치 플러그인이 노출하는 리소스 이름과 GPU·NIC 토폴로지를 확인한다. 워커 간 유효 대역폭, 지연, 패킷 손실과 혼잡, RDMA 경로 및 GPU 직접 전송 사용 여부를 계측한다. 장치 이름이나 NUMA 옵션은 환경과 제품 버전별로 다르다.
3. **토폴로지와 장애**: 노드 레이블 및 LWS 버전에 맞는 배치를 검증하고, 랙 간 경로와 PFC 설정·카운터를 관찰한다. 랙 배치만으로 PFC 스톰이나 혼잡이 억제된다고 보장할 수 없다.

**핵심 요약 — 버전이 고정된 공식 배포를 기준으로 시작하고, LMCache 설정은 별도 예제로 다룬다. 실제 통합 및 네트워크 효과는 해당 조합에서 검증해야 한다.**


---

## 6. 엔지니어링 한계와 트레이드오프

출근 직후에는 짧은 질문만 쏟아지는데, 그 시간대에 오히려 꼬리 지연이 나빠지는 일이 생긴다. 원인은 파드를 나눈 구조 자체가 짧은 요청에서 손해를 보기 때문이다. 이 절은 PD 분리 아키텍처를 도입하기 전에 따져 보아야 할 제약과 비용을 다룬다. KVCache 중심 PD 분리와 GAIE 라우팅은 대규모 클러스터의 Goodput을 끌어올린다. 그러나 운영 현장에서 마주하는 4가지 한계와 트레이드오프가 있다.

1. **단문 워크로드에서의 전송 비용**:
   KVCache 전송과 워커 간 홉의 고정 비용이 간섭 감소보다 크면 일체형보다 느릴 수 있다. 일체형 풀을 기준선으로 유지하고 실제 트래픽에서 비교한다.
2. **네트워크 및 NUMA 의존성**:
   KV 전송량과 유효 대역폭, 혼잡, GPU·NIC 토폴로지가 손익을 좌우한다. RDMA는 유용한 선택지지만 모든 배포에 특정 속도의 RDMA가 필수인 것은 아니다. 일반 이더넷과 가상화 환경에서는 해당 경로를 측정한다.
3. **트래픽 급변 시 Prefill:Decode 비율 리밸런싱 지연**:
   문서 요약 배치가 몰리면 프리필 풀이 먼저 찬다. 반대로 긴 코드 생성이 몰리면 디코드 풀의 HBM이 바닥난다. Dynamo의 SLA Planner나 llm-d의 역할별 HPA가 워커 비율을 재조정할 수 있다. 그러나 새 파드 HBM에 수백 기가바이트의 모델 가중치를 올리는 데 수십 초에서 수 분의 지연(Scaling Lag)이 든다.
4. **TypeSafe System One(Jev) 라우팅 임계값 보정과 타입 안정성의 한계**:
   2.4절의 Jev 라우팅 코드에서 쓴 확률 임계값(`prob >= 0.88`)이나 점수(`score <= 1`)는 고정 상수가 아니다. **타입 안정성(Type Safety)은 스키마 유효성을 보장할 뿐 판정의 무오류성(Infallibility)을 뜻하지 않는다**[^9]. 따라서 운영 트래픽에서 추출한 홀드아웃(Held-out) 데이터셋으로 오분류 시 꼬리 지연을 측정해야 한다. 도메인별로 임계값을 주기적으로 재보정(Calibration)해야 안전하다.

환전할 때 붙는 고정 수수료와 같다. 바꾸는 금액이 작을수록 수수료의 비중이 커져서, 작은 금액을 나눠 바꾸는 쪽이 오히려 손해다.

**핵심 요약 — 전송 비용, 네트워크와 NUMA, 풀 비율 조정 지연, 라우팅 오분류를 같은 SLO와 실제 트래픽 조건에서 평가한다.**

---

## References

[^1]: Narayanan et al.: *Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM* (2021). [arXiv:2104.04473](https://arxiv.org/abs/2104.04473)
[^2]: ingu627.github.io: *엔터프라이즈 AI 플랫폼 설계 (2): 무중단 장애 격리와 프로덕션 운영화(LLMOps)* (2026). [/agent/enterprise-ai-platform-fault-tolerance-operations/](/agent/enterprise-ai-platform-fault-tolerance-operations/)
[^3]: Zhong et al.: *DistServe: Disaggregating Prefill and Decoding for Goodput-optimized Large Language Model Serving*, USENIX OSDI (2024). [arXiv:2401.09670](https://arxiv.org/abs/2401.09670)
[^4]: Patel et al.: *Splitwise: Efficient Generative LLM Inference Using Phase Splitting*, ACM/IEEE ISCA (2024). [arXiv:2311.18677](https://arxiv.org/abs/2311.18677)
[^5]: ingu627.github.io: *Multi-Head Latent Attention(MLA)과 DeepSeek-V3/R1 추론 최적화: SGLang 서빙 아키텍처 해부* (2026). [/llm/multi-head-latent-attention-mla-deepseek-sglang/](/llm/multi-head-latent-attention-mla-deepseek-sglang/)
[^6]: ingu627.github.io: *EKS 인그레스에서 Gateway API로의 마이그레이션: Cilium CNI 통합 실전* (2026). [/k8s/gateway-api-migration-cilium/](/k8s/gateway-api-migration-cilium/)
[^7]: Kubernetes Blog: *Introducing Gateway API Inference Extension* (2025). [https://kubernetes.io/blog/2025/06/05/introducing-gateway-api-inference-extension/](https://kubernetes.io/blog/2025/06/05/introducing-gateway-api-inference-extension/)
[^8]: ingu627.github.io: *Kubernetes 환경에서 초저지연 LLM 서빙: vLLM vs SGLang 접두사 캐싱 아키텍처와 처리량 심층 비교* (2026). [/llm/k8s-low-latency-llm-serving-vllm-sglang/](/llm/k8s-low-latency-llm-serving-vllm-sglang/)
[^9]: TypeSafe AI Official Documentation: *System One API & Jev Question Design Guide* (2026). [https://docs.typesafe.ai](https://docs.typesafe.ai)
[^10]: NVIDIA Developer & GitHub: *NVIDIA Dynamo: A Datacenter Scale Distributed Inference Serving Framework (v1.0 GA)* (2026). [https://github.com/ai-dynamo/dynamo](https://github.com/ai-dynamo/dynamo)
[^11]: CNCF Sandbox Project: *llm-d: Kubernetes-native Distributed LLM Inference Serving (v0.5)* (2026). [https://github.com/llm-d/llm-d](https://github.com/llm-d/llm-d)
[^12]: Kubernetes SIGs: *LeaderWorkerSet (LWS) Concepts and v1.2 Release Documentation* (2026). [https://lws.sigs.k8s.io/docs/concepts/leaderworkerset/](https://lws.sigs.k8s.io/docs/concepts/leaderworkerset/)
[^13]: ingu627.github.io: *운영체제(OS) - Main Memory (9)* (2022). [/os/os9_10th/](/os/os9_10th/)
[^14]: ingu627.github.io: *운영체제(OS) - Virtual Memory (10)* (2022). [/os/os10_10th/](/os/os10_10th/)
[^15]: ingu627.github.io: *[논문 리뷰] The Google File System (GFS) 아키텍처 정리* (2022). [/paper/gfs/](/paper/gfs/)
[^16]: Yoon and Yu: *An Optical KV Cache Network for Disaggregated LLM Serving* (2026). [arXiv:2610.18444](https://arxiv.org/abs/2610.18444)
[^17]: Qin et al.: *Mooncake: A KVCache-Centric Disaggregated Architecture for LLM Serving*, USENIX FAST Best Paper (2025). [https://www.usenix.org/conference/fast25/presentation/qin](https://www.usenix.org/conference/fast25/presentation/qin)
[^18]: LMCache Team: *LMCache: Efficient KV Cache Offloading and Disaggregated Transfer for vLLM* (2026). [https://github.com/LMCache/LMCache](https://github.com/LMCache/LMCache)
[^19]: Kubernetes SIGs: *LeaderWorkerSet — Exclusive Topology Placement*. [공식 문서](https://lws.sigs.k8s.io/docs/concepts/leaderworkerset/topology-placement/)
[^20]: NVIDIA Dynamo v1.0.0: [vLLM 분리형 `disagg.yaml`](https://github.com/ai-dynamo/dynamo/blob/v1.0.0/examples/backends/vllm/deploy/disagg.yaml), [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0).
[^21]: NVIDIA Dynamo v1.0.0: [vLLM Kubernetes Deployment Configurations](https://github.com/ai-dynamo/dynamo/blob/v1.0.0/examples/backends/vllm/deploy/README.md).
[^22]: LMCache: [CPU RAM 오프로딩 공식 문서](https://docs.lmcache.ai/kv_cache/cpu_ram.html).
