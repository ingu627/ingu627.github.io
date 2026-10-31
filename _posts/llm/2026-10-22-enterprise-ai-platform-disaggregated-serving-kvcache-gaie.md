---
layout: single
title: "엔터프라이즈 AI 플랫폼 설계 (3): KVCache 중심 분리형 서빙(llm-d·Dynamo·Mooncake)과 Gateway API 추론 라우팅"
excerpt: "단일 파드(Colocated) 서빙에서 발생하는 프리필·디코드 자원 간섭과 20~40%의 GPU 유휴 낭비를 어떻게 해결할 것인가? 수리적 손익분기점 모델링, Kubernetes Gateway API Inference Extension(GAIE) 기반 캐시 인식 라우팅, NVIDIA Dynamo 1.0과 CNCF llm-d v0.5 오케스트레이션, 그리고 Mooncake·LMCache 제로카피 KV 전송 아키텍처를 정리한다."
categories: [llm]
tags: [llm, vllm, k8s, llmops, architecture, pd-disaggregation, mooncake, lmcache, dynamo, llm-d, gaie, 정리, 설명]
toc: true
toc_sticky: true
sidebar_main: true
date: 2026-10-22
last_modified_at: 2026-10-31
---

앞선 [엔터프라이즈 AI 플랫폼 설계 1편](/llm/enterprise-ai-platform-distributed-serving-architecture/)[^1]에서는 사설망 제로 트러스트 경계와 텐서·파이프라인 병렬화의 통신 수식을 다루었고, [엔터프라이즈 AI 플랫폼 설계 2편](/agent/enterprise-ai-platform-fault-tolerance-operations/)[^2]에서는 슬라이딩 윈도우 서킷 브레이커와 투기적 헤지드 요청(Hedged Requests)을 통한 무중단 장애 격리를 살펴보았다. 인프라 격리와 고가용성 제어면이 준비된 이후 Day-2 운영 단계에서 마주하는 핵심 과제는 **클러스터 단위의 GPU 자원 효율 극대화와 KVCache 중심의 데이터플레인 재설계**다.

단일 서빙 파드 내부에서 프롬프트 처리(Prefill)와 토큰 생성(Decode)을 함께 실행하는 기존 일체형(Colocated) 아키텍처는 워크로드 특성이 상반된 두 단계를 동일 가속기에 묶어 두기 때문에 전체 GPU 시간의 20~40%를 구조적으로 낭비한다. 동시에 KVCache가 특정 파드의 로컬 HBM에만 고립되면서, 기존 L7 로드밸런서가 캐시 위치와 큐 깊이를 무시한 채 요청을 분배하여 중복 프리필 연산과 꼬리 지연(Tail Latency)을 유발한다.

분산 추론 클러스터의 데이터플레인을 재설계하면서 KVCache 전송 계층(Mooncake, LMCache)과 쿠버네티스 추론 라우팅 표준(GAIE, llm-d, NVIDIA Dynamo)을 통합 정리해 두기 위해 이 글을 작성했습니다. 프리필·디코드 분리의 수리적 손익분기점부터 레이어별 스트리밍 전송, 그리고 TypeSafe System One(Jev)을 결합한 결정론적 라우팅 제어를 차례대로 해부한다.

---

## 1. 단일 파드(Colocated) 서빙의 구조적 낭비와 분리 역설

대규모 언어 모델(LLM)의 자기회귀(Autoregressive) 추론은 연산 특성이 판이하게 다른 두 단계로 나뉜다[^3][^4].

![엔터프라이즈 KVCache 중심 분리형 서빙(PD Disaggregation)과 GAIE·EPP 추론 라우팅 아키텍처](/assets/images/llm/disaggregated-serving-kvcache-gaie-cognition.webp)

### 1.1 Prefill(Compute-bound) vs Decode(Memory-bound) 비대칭성

- **프리필 단계(Prefill Phase — Compute-bound)**: 사용자의 입력 시퀀스 $S_{\text{in}}$ 전체를 한 번의 순전파(Forward Pass)로 병렬 처리하여 초기 **키-값 캐시(Key-Value Cache, KVCache)**를 생성한다. 대규모 행렬 곱셈(GEMM)이 지배적이므로 GPU의 텐서 코어(Tensor Core) 연산량(FLOPs)이 병목이 되며, 산술 강도(Arithmetic Intensity, $\text{FLOPs/Byte}$)가 수백 이상으로 높다.
- **디코드 단계(Decode Phase — Memory-bound)**: 직전에 생성된 토큰 단 1개를 입력으로 받아 전체 모델 가중치와 누적된 KVCache를 HBM에서 읽어 들인 뒤 다음 토큰 1개를 생성한다. 행렬-벡터 곱셈(GEMV) 위주로 동작하므로 산술 강도가 $1 \sim 4\text{ FLOPs/Byte}$ 수준으로 떨어지며, 텐서 코어는 대부분 유휴 상태로 남고 **고대역폭 메모리(High Bandwidth Memory, HBM)** 대역폭만 포화된다.

동일한 파드와 GPU에서 두 단계를 연속 배칭(Continuous Batching)으로 혼합 실행하면 다음과 같은 구조적 손실이 발생한다.

1. **자원 불일치로 인한 20~40% GPU 시간 낭비**: 프리필이 실행되는 동안에는 HBM 대역폭이 남고, 디코드가 실행되는 동안에는 텐서 코어 연산 유닛의 70% 이상이 유휴 상태로 대기한다. 결과적으로 클러스터 전체 기준 약 20~40%의 GPU 사이클이 두 단계 간 하드웨어 요구사항 불일치로 소실된다[^3].
2. **단계 간 간섭과 TPOT 스파이크**: 디코드 배치가 진행되는 도중 수천 토큰 규모의 신규 프롬프트가 유입되면, 프리필 연산이 수백 밀리초 동안 GPU를 독점하여 기존 사용자들의 **출력 토큰당 생성 시간(Time-Per-Output-Token, TPOT)**이 순간적으로 5~10배 치솟는다.
3. **병렬화 전략의 강제 결합**: 프리필은 높은 처리량을 위해 작은 텐서 병렬화($TP$)와 데이터 병렬화($DP$) 조합이 유리한 반면, 디코드는 HBM 대역폭 확보와 대규모 전문가 병렬화(Expert Parallelism, EP)를 위해 넓은 노드 분산이 유리하다. 일체형 파드에서는 두 단계에 서로 다른 병렬화 토폴로지를 적용할 수 없다.

### 1.2 PD 분리의 수리적 손익분기점(Break-Even Point) 모델링

**프리필-디코드 분리(Prefill-Decode Disaggregation, PD 분리)**는 프리필 전용 워커 풀과 디코드 전용 워커 풀을 물리적으로 격리하고, 프리필 풀에서 생성된 KVCache를 네트워크를 통해 디코드 풀로 전달한다[^1][^3]. 그러나 모든 워크로드에서 PD 분리가 유리한 것은 아니다. 프리필 노드에서 디코드 노드로 KVCache 텐서를 복사하는 **전송 세금(Transfer Tax)**이 발생하기 때문이다.

레이어 수 $L$, KV 헤드 수 $H_{kv}$, 헤드 차원 $d_h$, 정밀도 바이트 수 $b$ (FP16이면 $2$, FP8이면 $1$)인 모델에서 입력 길이 $S_{\text{in}}$에 대한 KVCache 볼륨 $V_{\text{KV}}$는 다음과 같다.

$$V_{\text{KV}}(S_{\text{in}}) = 2 \cdot L \cdot H_{kv} \cdot d_h \cdot b \cdot S_{\text{in}}$$

유효 네트워크 전송 대역폭을 $B_{\text{net}}$, RDMA 핸드셰이크 및 메타데이터 동기화 지연을 $L_{\text{setup}}$이라 할 때, KVCache 전송 시간 $T_{\text{transfer}}$는 다음과 같이 정의된다.

$$T_{\text{transfer}}(S_{\text{in}}) = \frac{V_{\text{KV}}(S_{\text{in}})}{B_{\text{net}}} + L_{\text{setup}}$$

일체형 서빙에서 프리필과 디코드가 같은 배치를 공유할 때 발생하는 간섭 지연을 $\Delta T_{\text{interference}}(S_{\text{in}}, S_{\text{out}})$, 전용 하드웨어·병렬화 최적화를 통해 절감되는 연산 시간을 $\Delta T_{\text{compute}}(S_{\text{in}}, S_{\text{out}})$라 하면, PD 분리가 순이득(Net Gain)을 달성하는 수리적 조건은 다음과 같다.

$$\Delta T_{\text{interference}}(S_{\text{in}}, S_{\text{out}}) + \Delta T_{\text{compute}}(S_{\text{in}}, S_{\text{out}}) > \frac{2 \cdot L \cdot H_{kv} \cdot d_h \cdot b \cdot S_{\text{in}}}{B_{\text{net}}} + L_{\text{setup}}$$

이 부등식은 명확한 운영 경계를 제시한다.

| 워크로드 프로파일 | 입력/출력 토큰 규모 | 전송 오버헤드 대비 분리 이득 | 권장 서빙 모드 |
|---|---|---|---|
| **단문 질의응답 및 단순 분류** | $S_{\text{in}} < 512$, $S_{\text{out}} < 200$ | $T_{\text{transfer}} + L_{\text{setup}}$이 간섭 제거 이득을 초과하여 전체 지연 시간 8~15% 악화 | 일체형(Colocated) 파드 서빙 |
| **장문 RAG 및 문서 분석** | $S_{\text{in}} \ge 8,192$, $S_{\text{out}} \in [256, 1024]$ | 대형 프리필의 디코드 배치 블로킹 제거로 p99 TPOT 50% 이상 단축 | PD 분리 + 레이어별 KV 스트리밍 |
| **다중 턴 에이전트 루프** | $S_{\text{in}} \ge 16,384$ (누적 컨텍스트) | 글로벌 KV 스토어 히트 시 프리필 연산 자체를 생략하고 디코드 직행 | PD 분리 + 계층형 KV 캐시 풀링 |
| **대규모 MoE 모델 (DeepSeek-V3/Kimi K2)** | 가변 길이, 대규모 동시 배치 | 프리필(DP+TP)과 디코드(광역 EP)의 비대칭 병렬화로 Goodput 2~3배 향상 | 멀티노드 EP 결합 PD 분리 |

특히 [DeepSeek-V3/R1의 Multi-Head Latent Attention(MLA) 아키텍처](/llm/multi-head-latent-attention-mla-deepseek-sglang/)[^5]처럼 KV 텐서를 저차원 잠재 벡터($d_c = 512$)로 압축하는 모델에서는 $V_{\text{KV}}$ 자체가 표준 GQA 대비 70% 이상 줄어들기 때문에 $T_{\text{transfer}}$가 감소하여 PD 분리의 손익분기점이 더 짧은 시퀀스 영역까지 내려간다. 반면 프롬프트 512 토큰 미만·출력 200 토큰 미만의 단문 트래픽에서는 RPC 설정 비용($L_{\text{setup}}$)과 NIC 복사 오버헤드가 분리 이득을 잠식하므로, 게이트웨이 계층에서 요청 특성에 따라 일체형 풀과 분리형 풀을 동적으로 분기해야 한다.

**핵심 요약 — 단일 파드 서빙은 프리필(연산 바운드)과 디코드(메모리 바운드)의 자원 불일치로 GPU 시간의 20~40%를 낭비하지만, 512 토큰 미만의 단문 요청에서는 KV 전송 세금이 이득을 초과하므로 수리적 손익분기점에 기반한 선택적 PD 분리가 필수적이다.**

---

## 2. 쿠버네티스 추론 라우팅의 표준화: GAIE와 Endpoint Picker(EPP)

PD 분리 클러스터를 구축하더라도 앞단의 인그레스 프록시가 기존 웹 트래픽 방식으로 동작하면 분리 아키텍처의 이점은 사라진다. 앞서 [EKS Gateway API 마이그레이션과 Cilium 통합 실전](/k8s/gateway-api-migration-cilium/)[^6]에서 살펴본 표준 쿠버네티스 `Gateway`와 `HTTPRoute`는 L7 경로·헤더 분기와 라운드로빈 가중치 분배를 표준화했지만, LLM 추론 워크로드의 내부 상태는 인지하지 못한다.

### 2.1 전통적 L7 게이트웨이의 한계와 추론 트래픽의 비대칭성

기존 Envoy나 NGINX 인그레스가 사용하는 라운드로빈(Round-Robin) 또는 최소 연결(Least-Connections) 알고리즘은 **HTTP 요청 1건의 무게를 동일하게 취급**한다. 그러나 LLM 서빙에서 200 토큰짜리 단문 요청 1건과 20,000 토큰짜리 장문 요약 요청 1건은 연산량과 HBM 점유량에서 100배 이상 차이가 난다.

더 큰 문제는 **캐시 비인식(Cache-Oblivious) 라우팅**이다. [Kubernetes 환경에서 vLLM과 SGLang의 접두사 캐싱(Prefix Caching) 비교](/llm/k8s/k8s-low-latency-llm-serving-vllm-sglang/)[^8]에서 분석했듯, 다중 턴 대화나 동일한 시스템 프롬프트를 공유하는 RAG 요청이 이전에 처리된 워커 파드로 다시 라우팅되면 KVCache 히트를 통해 TTFT를 60~80% 줄일 수 있다. 반면 단순 라운드로빈 라우터가 요청을 매번 다른 파드로 흩뿌리면, 클러스터 전체에서 동일한 프리필 연산이 중복 수행되고 HBM 공간이 중복 KV 블록으로 채워진다.

### 2.2 Gateway API Inference Extension(GAIE)과 EPP 스케줄링 파이프라인

이 문제를 해결하기 위해 Kubernetes SIG Network는 표준 Gateway API 위에 추론 전용 리소스(`InferencePool`, `InferenceModel`)와 확장 스케줄러를 결합한 **게이트웨이 API 추론 확장(Gateway API Inference Extension, GAIE)**을 표준화했다[^7].

![EPP 스케줄링 흐름: 요청 criticality와 LoRA 적합성, 대기 큐 길이 및 KV 캐시 사용률을 단계적으로 평가해 최적 파드를 선택하는 흐름](/assets/images/llm/official-kubernetes-inference-extension-epp.webp)
*출처: [Kubernetes Blog — Introducing Gateway API Inference Extension](https://kubernetes.io/blog/2025/06/05/introducing-gateway-api-inference-extension/), CC BY 4.0*

GAIE 아키텍처는 Envoy 프록시와 `ext_proc`(External Processing) gRPC 프로토콜로 통신하는 **엔드포인트 선택기(Endpoint Picker, EPP)** 및 **흐름 제어(Flow Control)** 계층으로 구성된다.

1. **흐름 제어(Flow Control) 및 Criticality 큐잉**: 요청에 부여된 중요도(`criticality`: `Critical`, `Standard`, `Sheddable`)를 기준으로 클러스터 과부하 시 배치성(`Sheddable`) 요청을 대기열에 보류하거나 조기 거절(Load Shedding)하여 실시간 대화형(`Critical`) SLO를 방어한다.
2. **단계적 필터링 및 스코어링 파이프라인**: EPP는 각 서빙 파드로부터 주기적으로 수집한 프로메테우스 메트릭(대기 큐 깊이 `waiting_queue_depth`, KV 캐시 블록 사용률 `kv_cache_usage_perc`, 로드된 LoRA 어댑터 목록, 프리픽스 해시 인덱스)을 바탕으로 최적의 엔드포인트를 선택한다.

복합 스코어링 함수 $S_{\text{EPP}}(p, q)$는 후보 파드 $p$와 요청 $q$에 대해 프리픽스 캐시 히트율 $H_{\text{prefix}}(p, q) \in [0, 1]$, LoRA 어댑터 상주 여부 $I_{\text{LoRA}}(p, q) \in \{0, 1\}$, 정규화된 대기 큐 길이 $\tilde{Q}(p) \in [0, 1]$, KV 캐시 사용률 $U_{\text{KV}}(p) \in [0, 1]$을 가중 합산하여 계산한다.

$$S_{\text{EPP}}(p, q) = w_{\text{cache}} \cdot H_{\text{prefix}}(p, q) + w_{\text{lora}} \cdot I_{\text{LoRA}}(p, q) - w_{\text{queue}} \cdot \tilde{Q}(p) - w_{\text{kv}} \cdot U_{\text{KV}}(p)$$

### 2.3 캐시 인식 라우터와 PD 분리의 결합: Prefill Bypass

GAIE의 EPP를 PD 분리 아키텍처와 결합하면 중요한 최적화 경로가 열린다. 일반적인 PD 분리 흐름에서는 모든 요청이 `라우터 -> 프리필 풀 -> KV 전송 -> 디코드 풀` 순서로 이동한다. 그러나 EPP가 클러스터의 분산 KV 캐시 인덱스를 조회했을 때, **요청 프롬프트의 프리픽스 캐시 히트율이 임계치(예: 90% 이상)를 넘고 해당 KV 블록이 이미 특정 디코드 파드(또는 디코드 노드의 로컬 DRAM 티어)에 상주하고 있다면**, 프리필 풀을 거칠 이유가 없다.

이 경우 라우터는 프리필 워커 디스패치와 네트워크 KV 전송 단계를 통째로 우회(Bypass)하고, 해당 디코드 파드로 요청을 직행시켜 남은 미스 토큰(Suffix)만 로컬에서 짧게 계산한 뒤 즉시 토큰 생성을 시작한다.

### 2.4 TypeSafe System One(Jev) 기반 초저지연 라우팅 분기 제어

프롬프트의 단순 토큰 길이($S_{\text{in}}$)만으로는 **출력 시퀀스 길이($S_{\text{out}}$)와 추론 복잡도**를 사전에 알 수 없다. 예를 들어 입력은 300 토큰에 불과하지만 `"주어진 스키마를 바탕으로 5개 마이크로서비스의 전체 OpenAPI 명세와 마이그레이션 코드를 작성하라"`는 요청은 수천 토큰의 긴 디코드 세션을 유발한다.

라우터 앞단에서 무거운 생성형 LLM을 호출해 이를 분류하면 수백 밀리초의 지연이 추가되므로, TypeSafe AI의 비생성형 판정 엔진인 **System One(Jev)**[^9]을 인바운드 라우터에 결합한다. `POST /v1/systemone` 엔드포인트는 단일 순전파 패스로 70~120ms 내에 타입화된 판정 결과를 반환하며, 호스트 코드는 이 결과를 바탕으로 **일체형 단문 풀(Colocated Short Pool)**, **PD 분리 파이프라인(Disaggregated PD Pool)**, **디코드 직행(Decode Direct Bypass)** 중 어느 경로로 디스패치할지 결정론적으로 분기한다.

**1) `/v1/systemone` HTTP 요청 페이로드 구조**: 런타임 메트릭과 프롬프트 원문은 `state`에만 격리하고, `questions`에는 오직 판단 기준만 선언한다[^9].

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

**2) Python SDK 선언 및 호스트 코드 분기 제어**:

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

    # 홀드아웃 검증 데이터셋으로 보정된 임계값 기반 결정론적 호스트 분기
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

**핵심 요약 — GAIE와 EPP는 큐 깊이와 KV 캐시 히트율을 결합해 추론 요청을 스케줄링하며, TypeSafe System One(Jev)을 앞단에 결합하면 단문 일체형 경로·PD 분리 경로·프리필 우회 직행 경로를 100ms 내외의 단일 패스로 결정론적 분기할 수 있다.**

---

## 3. 분산 추론 오케스트레이터 해부: NVIDIA Dynamo 1.0 vs CNCF llm-d v0.5

PD 분리와 캐시 인식 라우팅을 엔터프라이즈 쿠버네티스 클러스터에서 운영하기 위해, 오픈소스 생태계는 크게 두 가지 레퍼런스 오케스트레이터를 중심으로 수렴하고 있다. 하나는 NVIDIA가 주도하는 데이터센터 스케일 추론 프레임워크인 **NVIDIA Dynamo(v1.0 GA)**[^10]이고, 다른 하나는 Red Hat·Google·IBM·CoreWeave 등이 공동 발족하여 2026년 3월 CNCF 샌드박스 프로젝트로 채택된 **llm-d(v0.5)**[^11]이다.

### 3.1 NVIDIA Dynamo 1.0 vs CNCF llm-d v0.5 아키텍처 비교

| 비교 항목 | NVIDIA Dynamo (v1.0 GA) | CNCF llm-d (v0.5) |
|---|---|---|
| **아키텍처 포지셔닝** | 추론 엔진(vLLM, SGLang, TensorRT-LLM) 상위에서 동작하는 범용 분산 런타임 계층 (Stack-above) | KServe 컨트롤 플레인과 vLLM 서빙 엔진 사이를 잇는 쿠버네티스 네이티브 데이터플레인 |
| **코어 구현체 및 컴포넌트** | Rust 기반 고성능 런타임 코어 + Python 확장성 레이어 (`DynamoGraphDeployment`) | 쿠버네티스 표준 GAIE + EPP + `LeaderWorkerSet`(LWS) + vLLM 네이티브 통합 |
| **스케줄링 및 배포 단위** | 단일 그래프 선언 내에서 Frontend, Router, Prefill Worker, Decode Worker 생명주기 통합 관리 | Prefill, Decode, Router를 각각 독립된 K8s `Service` 및 `LeaderWorkerSet`으로 분리 배포 |
| **오토스케일링 시그널** | **Planner Profiler + SLA Planner**: 목표 TTFT/ITL SLO에 맞춰 Prefill:Decode 비율 자동 재조정 | 역할별 분리 HPA: 프리필 풀은 **Queue Depth**, 디코드 풀은 **KV Cache Utilization** 기반 독립 스케일링 |
| **KV 캐시 전송 계층** | **NIXL(NVIDIA Inference Transfer Library)**: GPUDirect RDMA/InfiniBand 우선, UCX/TCP 자동 폴백 | vLLM NIXL 커넥터, **LMCache**, **UCCL**(컨테이너 레벨 집합 통신 및 전송) 플러그인 지원 |
| **핵심 특화 기능** | 글로벌 KV 캐시 관리자(GPU HBM ↔ CPU DRAM ↔ 로컬/네트워크 SSD 티어링), 이기종 엔진 통합 | 계층형 KV 오프로딩, 캐시 인식 LoRA 어댑터 라우팅, 토폴로지 랙 패킹(`packDomain: rack`), Scale-to-Zero |

### 3.2 NVIDIA Dynamo 1.0: SLA Planner와 NIXL 전송 추상화

NVIDIA Dynamo[^10]는 특정 서빙 엔진에 종속되지 않고 vLLM, SGLang, TensorRT-LLM 위에 공통 분산 제어면을 씌우는 **상위 계층(Stack-above)** 설계를 택한다. 지연 시간에 민감한 라우터와 이벤트 루프는 Rust로 작성되어 마이크로초 단위의 디스패치 성능을 보장하고, 오케스트레이션 정책과 커스텀 파이프라인은 Python으로 확장할 수 있다.

Dynamo의 핵심 차별점은 **SLA Planner**와 **NIXL(NVIDIA Inference Transfer Library)**이다.

1. **Planner Profiler & SLA Planner**: 배포 전 모델과 하드웨어 조합에 대해 입력/출력 길이별 보간 곡선(Interpolation Curve)을 프로파일링한다. 운영 중 트래픽의 평균 입력 길이($\bar{S}_{\text{in}}$)가 길어져 TTFT가 목표 SLO에 근접하면 프리필 워커 복제본 수를 늘리고, 반대로 동시 디코드 세션이 누적되어 토큰 간 지연(ITL)이 상승하면 디코드 워커 비율을 실시간으로 확장한다.
2. **NIXL(NVIDIA Inference Transfer Library)**: GPU HBM, 호스트 CPU DRAM, 로컬 NVMe SSD, 원격 노드의 HBM에 걸친 비동기 점대점(Point-to-Point) 데이터 이동을 단일 API로 추상화한다. 하드웨어가 GPUDirect RDMA(InfiniBand 또는 RoCE v2)를 지원하면 제로카피 RDMA 경로를 자동 선택하고, 일반 이더넷 환경에서는 TCP/소켓 백엔드로 투명하게 폴백한다.

### 3.3 CNCF llm-d v0.5: LeaderWorkerSet(LWS)과 쿠버네티스 네이티브 토폴로지 제어

반면 CNCF **llm-d**[^11]는 새로운 자체 런타임을 발명하는 대신, 쿠버네티스 공식 표준 API들(GAIE, LeaderWorkerSet, HPA)을 조합하여 KServe와 vLLM 사이의 간극을 메우는 **K8s-native 데이터플레인** 전략을 취한다.

![LeaderWorkerSet 구조: 리더 StatefulSet과 워커 StatefulSet이 그룹 단위로 묶여 멀티노드 추론 레플리카를 형성하는 구조](/assets/images/llm/official-custom-model-serving-pipeline.webp)
*출처: [LeaderWorkerSet 공식 문서 — Concepts](https://lws.sigs.k8s.io/docs/concepts/leaderworkerset/), CC BY 4.0*

초거대 MoE 모델(예: DeepSeek-V3 671B, Kimi K2)을 서빙할 때는 단일 추론 복제본(Replica) 하나가 노드 2~4대(GPU 16~32장)에 걸쳐 실행되어야 한다. 기존 쿠버네티스 `Deployment`는 개별 파드를 독립 단위로 취급하고, `StatefulSet`은 전체 파드를 하나의 직렬 집합으로만 다루기 때문에 **"멀티노드로 묶인 파드 그룹(Super-pod)을 하나의 추론 복제본 단위로 오토스케일링"**하기 어렵다.

이를 해결하기 위해 llm-d는 Kubernetes SIG Apps의 **LeaderWorkerSet(LWS)**[^12]을 기본 워크로드 컨트롤러로 사용한다.

- **그룹 단위 원자적 생명주기(All-or-Nothing Topology)**: 1개의 리더 파드(Rank 0, 인그레스 요청 수신 및 분산 조정)와 $N-1$개의 워커 파드(텐서/전문가 병렬 샤드 실행)를 단일 복제본 그룹으로 묶어 함께 생성·재시작·스케일링한다. 2026년 7월 릴리스된 **LWS v1.2**에서는 동적 토폴로지 조정과 우선순위 어노테이션이 추가되어 부분 노드 장애 시 그룹 재스케줄링 속도가 개선되었다.
- **물리적 랙 인식 배치(`packDomain: rack`)**: LWS 매니페스트의 `topologyConstraint`에 `packDomain: rack`을 선언하면, 쿠버네티스 스케줄러가 동일 복제본 그룹에 속한 리더·워커 파드들을 동일한 Top-of-Rack(ToR) 스위치 하단의 물리 노드에 밀집 배치하여 Spine 스위치를 거치는 홉(Hop) 지연을 차단한다.
- **역할별 비대칭 오토스케일링**: llm-d는 프리필과 디코드를 별도의 쿠버네티스 `Service`로 노출한다. 프리필 풀의 HPA는 **대기 큐 길이(Queue Depth)**를 주 시그널로 삼아 스파이크 유입에 즉각 반응하고, 디코드 풀의 HPA는 **KV 캐시 메모리 사용률(KV Utilization)**을 주 시그널로 삼아 장기 생성 세션의 HBM 고갈을 방어한다.
- **llm-d v0.5 확장 기능**: 계층형 KV 오프로딩(HBM $\to$ CPU RAM $\to$ 원격 스토리지), 어댑터 상주 위치를 추적하는 캐시 인식 LoRA 라우팅, 컨테이너 네트워크 환경의 집합 통신을 가속하는 **UCCL** 통합, 그리고 유휴 시간대 GPU 비용을 제거하는 **Scale-to-Zero**를 지원한다.

**핵심 요약 — NVIDIA Dynamo 1.0은 SLA Planner와 NIXL을 통해 다중 서빙 엔진 위에서 Prefill:Decode 비율과 전송 계층을 통합 제어하며, CNCF llm-d v0.5는 GAIE와 LeaderWorkerSet(LWS)을 결합해 쿠버네티스 네이티브 표준 위에서 멀티노드 복제본과 역할별 HPA를 구현한다.**

---

## 4. KVCache를 일급 시민으로: Mooncake와 LMCache 제로카피 전송

PD 분리 아키텍처의 성패는 결국 **"수 기가바이트에서 수십 기가바이트에 달하는 KVCache 텐서를 어떻게 지연 없이 이동시키고 재사용할 것인가"**에 달려 있다. 현대 추론 시스템은 KVCache를 일회성 중간 연산 부산물이 아니라, 클러스터 전역에서 주소 지정과 계층 이동이 가능한 **일급 시민(First-Class Citizen)**으로 승격시키고 있다.

### 4.1 운영체제 가상 메모리 및 GFS 아키텍처와의 설계 대조

KVCache 중심 서빙 아키텍처는 전통적인 운영체제(OS) 메모리 관리 및 분산 파일 시스템의 고전적 원리를 GPU 클러스터 스케일로 재해석한 결과물이다.

- **OS 페이징·스왑 및 NUMA 지역성과의 대응**: 과거 정리했던 [운영체제 메인 메모리 관리와 페이징](/os/os9_10th/)[^13] 및 [가상 메모리와 요구 페이징(Demand Paging), 워킹셋 모델](/os/os10_10th/)[^14]에서 OS 커널은 물리 프레임 단편화를 막기 위해 고정 크기 페이지 테이블을 두고, 워킹셋에서 밀려난 콜드 페이지를 디스크 스왑 영역으로 내린다(Page-out). vLLM의 PagedAttention이 단일 GPU 내의 페이지 테이블이라면, Mooncake와 LMCache는 **GPU HBM(L1 캐시) $\leftrightarrow$ 호스트 CPU DRAM(메인 메모리) $\leftrightarrow$ 로컬 NVMe 및 원격 RDMA 메모리 풀(스왑 스토리지)**로 이어지는 클러스터 단위의 가상 메모리 계층이다. 특히 다중 소켓 서버에서 CPU-NIC-GPU 간 PCIe 루트 컴플렉스를 가로지르면 대역폭이 반감되므로, OS의 **비균일 메모리 접근(NUMA)** 지역성 스케줄링과 동일하게 GPU와 동일한 NUMA 노드에 직결된 RDMA NIC(RNIC)와 핀 고정 메모리(Pinned Memory)만 바인딩해야 제로카피 대역폭이 온전히 나온다.
- **Google File System(GFS)과의 대응**: [Google File System(GFS) 논문 리뷰](/paper/gfs/)[^15]에서 살펴본 GFS의 핵심 설계는 두 가지였다. 첫째, 작은 블록 대신 **64MB의 대형 청크(Chunk)** 단위로 데이터를 묶어 메타데이터 오버헤드와 네트워크 TCP/RPC 왕복 비용을 상각(Amortize)한다. 둘째, **제어 흐름(마스터 노드의 청크 위치 메타데이터 조회)과 데이터 흐름(클라이언트와 청크서버 간 직접 파이프라인 스트리밍)을 철저히 분리**한다. Mooncake의 Conductor(메타데이터 스케줄러)와 Transfer Engine(직접 RDMA 전송), 그리고 LMCache의 소형 페이지를 대형 청크로 병합하는 아키텍처는 GFS의 이 두 가지 설계 원칙을 KVCache 전송에 그대로 이식한 구조다.

### 4.2 전송 계층 병목 해부: Post-prefill Pull vs Layer-by-layer 스트리밍

PD 분리 환경에서 KVCache를 언제, 어떤 단위로 전송하느냐에 따라 사용자가 체감하는 **첫 토큰 생성 시간(Time-To-First-Token, TTFT)**이 크게 달라진다. 최근 분리형 서빙 전송 계층을 실측 비교한 연구(arXiv:2610.18444)[^16]는 두 가지 대조적인 전송 패턴의 차이를 명확히 보여준다.

1. **기본 vLLM NIXL 커넥터의 Post-prefill Pull 방식**:
   프리필 워커가 $L$개 트랜스포머 레이어의 순전파 연산을 끝까지 완료하면, 디코드 워커로 완료 알림을 보내고 디코드 워커가 원격 읽기(RDMA Read / Pull)로 전체 KVCache를 가져온다. 이 방식에서는 프리필 연산 시간 $T_{\text{prefill}}$과 네트워크 전송 시간 $T_{\text{transfer}}$가 직렬로 이어진다.
   $$\text{TTFT}_{\text{pull}} = T_{\text{prefill}} + T_{\text{transfer}} + T_{\text{decode\_step1}}$$
   입력 컨텍스트가 32K~128K 토큰으로 커지면 $T_{\text{transfer}}$가 수백 밀리초에 달해 TTFT가 그대로 증가한다.

2. **Mooncake 및 LMCache의 Layer-by-layer 비동기 스트리밍(Push) 방식**:
   트랜스포머의 $l$번째 레이어($l = 1, \dots, L$) 프리필 연산이 끝나는 즉시, 별도의 CUDA 스트림(Stream)과 비동기 RDMA 전송 스레드가 $l$번째 레이어의 KV 텐서를 디코드 노드로 즉시 푸시(Push)한다. 그와 동시에 GPU 연산 스트림은 멈추지 않고 $l+1$번째 레이어 연산을 수행한다.

$$T_{\text{effective\_transfer}} = \max\left(0, \; \sum_{l=1}^{L} T_{\text{transfer}}^{(l)} - \sum_{l=2}^{L} T_{\text{compute}}^{(l)}\right) + T_{\text{transfer}}^{(L)}$$

연산 시간 동안 $1 \sim L-1$번째 레이어의 전송이 백그라운드에서 오버랩(Overlap)되어 은닉되므로, 외부로 노출되는 순수 전송 지연은 **마지막 단일 레이어($L$)의 KV 전송 시간 $T_{\text{transfer}}^{(L)}$** 수준으로 수렴한다[^16].

### 4.3 Mooncake 아키텍처와 USENIX FAST 2025 실측 지표

Moonshot AI와 칭화대 연구진이 설계한 **Mooncake**[^17]는 KVCache 중심 분리형 아키텍처를 정립하여 **USENIX FAST 2025 최우수 논문상(Best Paper Award)**을 수상했으며, 2026년 2월 PyTorch 생태계에 공식 합류한 데 이어 2026년 8월 vLLM(v0.31.0) 및 LMDeploy(v0.18.0)에 기본 통합되었다.

Mooncake의 핵심 엔진인 **Transfer Engine**은 서버 내부에 장착된 다수의 RDMA NIC(예: 4×200Gbps 또는 8×400Gbps RoCE v2 / InfiniBand)를 단일 논리적 전송 파이프로 병합(Multi-NIC Aggregation)하고, GPU-CPU-NIC 간의 NUMA 토폴로지를 자동 탐색하여 크로스 소켓 QPI/UPI 병목을 우회한다.

| 벤치마크 시나리오 및 환경 | 비교 기준 (Baseline) | Mooncake 실측 성능 | 핵심 기술 요인 |
|---|---|---|---|
| **LLaMA3-70B 12.8만 토큰 (40GB KV) 전송 (4×200Gbps RoCE)** | TCP 소켓 전송 (약 36 GB/s) | **최대 87 GB/s** (TCP 대비 2.4배 가속) | NUMA 인식 다중 RNIC 대역폭 병합 및 제로카피 RDMA Write |
| **LLaMA3-70B 12.8만 토큰 (40GB KV) 전송 (8×400Gbps RoCE)** | TCP 소켓 전송 (약 41 GB/s) | **최대 190 GB/s** (TCP 대비 4.6배 가속) | 8개 400G NIC 스트라이핑 및 PCIe Gen5 Direct P2P 전송 |
| **장문 컨텍스트 시뮬레이션 및 실 프로덕션 부하** | 기존 일체형 vLLM 기준선 | 시뮬레이션 처리량 **최대 525% 증가**, 실 Kimi 워크로드 **75% 더 많은 요청 처리** | SLO 인식 조기 거절(Early Rejection) + 글로벌 DRAM KV 풀 재사용 |
| **128대 H200 클러스터 Kimi K2 (대규모 MoE) 배포** | 단일 역할 대칭 배포 | **프리필 22.4만 tok/s, 디코드 28.8만 tok/s** 달성 | PD 분리 + 대규모 전문가 병렬화(EP) 결합 및 무손실 KV 스트리밍 |

또한 Mooncake는 클러스터 내 모든 노드의 유휴 CPU DRAM과 로컬 SSD를 묶어 분산 KV 객체 저장소(**Mooncake Store**)를 형성한다. 특정 파드의 HBM에서 축출(Evict)된 KV 블록이라도 원격 DRAM 풀에 남아 있으면, 다음 턴 요청이 들어올 때 재연산하는 대신 RDMA로 읽어 들여 프리필 GPU 소비를 절감한다.

### 4.4 LMCache: 소형 페이지 병목 극복을 위한 대형 청크 병합과 CUDA 스트림 파이프라이닝

vLLM 생태계에서 널리 쓰이는 **LMCache**[^18]는 PagedAttention의 구조적 I/O 단위 불일치를 해결하는 데 집중한다.

vLLM의 기본 페이지 크기(보통 16 토큰 블록)는 모델 구조에 따라 개당 **20KB~63KB** 수준에 불과하다. 이처럼 잘게 쪼개진 수천 개의 비연속 메모리 포인터를 그대로 RDMA나 NVMe I/O 큐에 던지면, 드라이버 인터럽트와 디스크립터 생성 오버헤드 때문에 400Gbps NIC 대역폭의 15%도 채우지 못한다.

LMCache는 이를 두 단계로 해결한다.

1. **가변 대형 청크 병합(Configurable Chunk Coalescing)**: 20KB~63KB 단위의 파편화된 KV 페이지들을 전송 직전 **256 토큰 이상의 연속된 대형 청크(수 메가바이트 단위)**로 병합하여 단일 벌크 DMA/RDMA 트랜잭션으로 밀어 넣는다.
2. **별도 CUDA 스트림 기반 레이어별 파이프라이닝**: 추론 연산을 담당하는 기본 CUDA 스트림과 분리된 전용 I/O CUDA 스트림(`cudaStreamNonBlocking`)을 생성하여, 트랜스포머 레이어 연산이 돌아가는 동안 백그라운드에서 CPU RAM, 로컬 디스크, NIXL, 또는 Mooncake Store 백엔드로 KV 청크를 비동기 스트리밍한다.

**핵심 요약 — Mooncake와 LMCache는 OS 가상 메모리 계층화와 GFS의 대형 청크·데이터 경로 분리 원리를 적용해 소형 KV 페이지를 대형 청크로 병합하고, 레이어별 비동기 스트리밍과 다중 RDMA NIC 병합으로 40GB KV 캐시를 최대 190GB/s 속도로 은닉 전송한다.**

---

## 5. 실전 배포 토폴로지: DynamoGraphDeployment와 LMCacheEngine 매니페스트

실제 프로덕션 쿠버네티스 클러스터에서 NVIDIA Dynamo 오케스트레이터와 LMCache(및 Mooncake Store 백엔드)를 결합하여 멀티프로세스 PD 분리 파이프라인을 배포하는 `disagg_lmcache_mp.yaml` 스타일의 선언적 매니페스트 구조다.

### 5.1 쿠버네티스 `DynamoGraphDeployment` 및 `LMCacheEngine` 통합 매니페스트

```yaml
apiVersion: nvidia.com/v1alpha1
kind: DynamoGraphDeployment
metadata:
  name: llama3-70b-disagg-lmcache
  namespace: llm-serving
spec:
  slaPlanner:
    enabled: true
    targetTtftMs: 800
    targetItlMs: 25
    minPrefillWorkers: 2
    maxPrefillWorkers: 12
    minDecodeWorkers: 4
    maxDecodeWorkers: 24
  services:
    Frontend:
      dynamoNamespace: llama3-disagg
      componentType: main
      replicas: 2
    KvRouter:
      dynamoNamespace: llama3-disagg
      componentType: router
      replicas: 2
      env:
        - { name: DYNAMO_ROUTER_KV_OVERLAP_WEIGHT, value: "1.5" }
        - { name: DYNAMO_ROUTER_QUEUE_PENALTY_WEIGHT, value: "0.8" }
    PrefillWorker:
      dynamoNamespace: llama3-disagg
      componentType: worker
      replicas: 4
      topologyConstraint: { packDomain: rack }
      resources:
        limits: { nvidia.com/gpu: "8", rdma/roce_gdr: "4" }
      env:
        - { name: VLLM_USE_V1, value: "1" }
        - { name: LMCACHE_USE_EXPERIMENTAL, value: "True" }
        - { name: LMCACHE_CONFIG_FILE, value: "/etc/lmcache/lmcache-prefill.yaml" }
      args:
        - "vllm"
        - "serve"
        - "/models/Meta-Llama-3.1-70B-Instruct"
        - "--tensor-parallel-size=8"
        - "--enable-prefix-caching"
        - "--kv-transfer-config"
        - '{"kv_connector":"LMCacheConnectorV1","kv_role":"kv_producer","kv_parallel_size":8}'
    DecodeWorker:
      dynamoNamespace: llama3-disagg
      componentType: worker
      replicas: 8
      topologyConstraint: { packDomain: rack }
      resources:
        limits: { nvidia.com/gpu: "8", rdma/roce_gdr: "4" }
      env:
        - { name: VLLM_USE_V1, value: "1" }
        - { name: LMCACHE_USE_EXPERIMENTAL, value: "True" }
        - { name: LMCACHE_CONFIG_FILE, value: "/etc/lmcache/lmcache-decode.yaml" }
      args:
        - "vllm"
        - "serve"
        - "/models/Meta-Llama-3.1-70B-Instruct"
        - "--tensor-parallel-size=8"
        - "--max-num-seqs=512"
        - "--kv-transfer-config"
        - '{"kv_connector":"LMCacheConnectorV1","kv_role":"kv_consumer","kv_parallel_size":8}'
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: lmcache-engine-config
  namespace: llm-serving
data:
  lmcache-prefill.yaml: |
    chunk_size: 256
    local_cpu: true
    max_local_cpu_size: 64.0
    enable_async_loading: true
    transfer_channel: "nixl"
    remote_url: "mooncakestore://mooncake-master.llm-serving.svc:50051"
    remote_serde: "naive"
    pipelined_backend: true
    numa_bind_policy: "auto_strict"
```

### 5.2 프로덕션 배포 시 핵심 검증 포인트

1. **청크 크기(`chunk_size: 256`)와 레이어 파이프라이닝**: vLLM의 기본 16 토큰 블록을 256 토큰 단위로 묶어 NIXL 및 Mooncake Store로 전송함으로써 소형 패킷 오버헤드를 제거한다.
2. **GPUDirect RDMA 리소스 바인딩(`rdma/roce_gdr: "4"`)**: 쿠버네티스 SR-IOV 또는 RDMA Shared Device Plugin을 통해 파드에 RNIC 디바이스를 직접 할당하고, `numa_bind_policy: "auto_strict"`를 통해 GPU와 동일 PCIe 루트 아래의 NIC만 매핑한다.
3. **랙 단위 토폴로지 고정(`packDomain: rack`)**: 프리필과 디코드 워커 그룹이 물리적 랙 경계를 넘어가지 않도록 스케줄링 제약을 걸어 RoCE v2 PFC(Priority Flow Control) 스톰과 크로스 랙 지연 변동을 억제한다.

**핵심 요약 — 프로덕션 배포 매니페스트에서는 vLLM의 `LMCacheConnectorV1`을 통해 생산자(Prefill)와 소비자(Decode) 역할을 분리하고, 256 토큰 청크 병합·NUMA 바인딩·랙 패킹(`packDomain: rack`)을 선언적으로 결합해야 설계된 RDMA 처리량이 달성된다.**

---

## 6. 엔지니어링 한계와 트레이드오프

KVCache 중심 PD 분리 아키텍처와 GAIE 라우팅은 대규모 클러스터의 Goodput을 끌어올리지만, 도입 전 반드시 검토해야 할 4가지 운영상 한계와 트레이드오프가 존재한다.

1. **단문 워크로드에서의 역성능(Transfer Tax Dominance)**:
   1.2절의 수리적 손익분기점 모델에서 증명했듯, 입력 512 토큰 미만·출력 200 토큰 미만의 단답형 트래픽에서는 KVCache 직렬화, RDMA 메타데이터 협상($L_{\text{setup}}$), 워커 간 홉 지연이 분리 이득보다 크다. 따라서 모든 트래픽에 획일적으로 PD 분리를 강제하면 단문 요청의 평균 TTFT가 오히려 8~15% 악화되므로, 일체형 패스트패스(Fast-path) 풀을 병행 운영해야 한다.
2. **RDMA 패브릭 및 NUMA 하드웨어 의존성**:
   Mooncake가 보여준 87~190GB/s의 KV 전송 속도는 4×200Gbps 또는 8×400Gbps RoCE v2 / InfiniBand와 GPUDirect RDMA가 갖춰진 베어메탈·고성능 클러스터를 전제로 한다. 일반 25~100GbE TCP 네트워크나 PCIe P2P가 비활성화된 가상화 환경에서는 전송 계층이 즉시 병목이 되어 프리필 워커의 출력 버퍼가 블로킹(Backpressure stall)된다.
3. **트래픽 급변 시 Prefill:Decode 비율 리밸런싱 지연**:
   문서 요약 배치 작업이 몰려 입력 길이 분포가 급격히 길어지면 프리필 풀이 포화되고, 반대로 긴 코드 생성이 몰리면 디코드 풀의 HBM이 고갈된다. Dynamo의 SLA Planner나 llm-d의 역할별 HPA가 워커 비율을 재조정하더라도, 수백 기가바이트의 모델 가중치를 새 파드 HBM에 로드하는 데 수십 초에서 수 분의 지연(Scaling Lag)이 발생한다.
4. **TypeSafe System One(Jev) 라우팅 임계값 보정과 타입 안정성의 한계**:
   2.4절의 Jev 라우팅 코드에서 사용한 확률 임계값(`can_bypass_prefill_pool.prob >= 0.88`)이나 위험도 점수(`score <= 1`)는 고정 불변의 상수가 아니다. **타입 안정성(Type Safety)은 응답 스키마가 깨지지 않음을 보장할 뿐 모델의 판정이 항상 참(Infallibility)임을 의미하지 않는다**[^9]. 따라서 실제 운영 트래픽에서 추출한 홀드아웃(Held-out) 검증 데이터셋을 바탕으로 오분류 시 발생하는 꼬리 지연 비용을 측정하고, 도메인별로 임계값을 주기적으로 재보정(Calibration)해야 한다.

**핵심 요약 — PD 분리 아키텍처는 단문 요청의 전송 세금, 400Gbps급 RDMA 하드웨어 강제성, 가중치 로딩으로 인한 오토스케일링 지연이라는 물리적 제약을 안고 있으므로, 홀드아웃 데이터셋으로 보정된 라우팅 정책과 일체형 풀 병행 전략이 함께 설계되어야 한다.**

---

## References

[^1]: ingu627.github.io: *엔터프라이즈 AI 플랫폼 설계 (1): 프라이빗 인프라 격리와 초거대 분산 서빙 토폴로지* (2026). [/llm/enterprise-ai-platform-distributed-serving-architecture/](/llm/enterprise-ai-platform-distributed-serving-architecture/)
[^2]: ingu627.github.io: *엔터프라이즈 AI 플랫폼 설계 (2): 무중단 장애 격리와 프로덕션 운영화(LLMOps)* (2026). [/agent/enterprise-ai-platform-fault-tolerance-operations/](/agent/enterprise-ai-platform-fault-tolerance-operations/)
[^3]: Zhong et al.: *DistServe: Disaggregating Prefill and Decoding for Goodput-optimized Large Language Model Serving*, USENIX OSDI (2024). [arXiv:2401.09670](https://arxiv.org/abs/2401.09670)
[^4]: Patel et al.: *Splitwise: Efficient Generative LLM Inference Using Phase Splitting*, ACM/IEEE ISCA (2024). [arXiv:2311.18677](https://arxiv.org/abs/2311.18677)
[^5]: ingu627.github.io: *Multi-Head Latent Attention(MLA)과 DeepSeek-V3/R1 추론 최적화: SGLang 서빙 아키텍처 해부* (2026). [/llm/multi-head-latent-attention-mla-deepseek-sglang/](/llm/multi-head-latent-attention-mla-deepseek-sglang/)
[^6]: ingu627.github.io: *EKS 인그레스에서 Gateway API로의 마이그레이션: Cilium CNI 통합 실전* (2026). [/k8s/gateway-api-migration-cilium/](/k8s/gateway-api-migration-cilium/)
[^7]: Kubernetes Blog: *Introducing Gateway API Inference Extension* (2025). [https://kubernetes.io/blog/2025/06/05/introducing-gateway-api-inference-extension/](https://kubernetes.io/blog/2025/06/05/introducing-gateway-api-inference-extension/)
[^8]: ingu627.github.io: *Kubernetes 환경에서 초저지연 LLM 서빙: vLLM vs SGLang 접두사 캐싱 아키텍처와 처리량 심층 비교* (2026). [/llm/k8s/k8s-low-latency-llm-serving-vllm-sglang/](/llm/k8s/k8s-low-latency-llm-serving-vllm-sglang/)
[^9]: TypeSafe AI Official Documentation: *System One API & Jev Question Design Guide* (2026). [https://docs.typesafe.ai](https://docs.typesafe.ai)
[^10]: NVIDIA Developer & GitHub: *NVIDIA Dynamo: A Datacenter Scale Distributed Inference Serving Framework (v1.0 GA)* (2026). [https://github.com/ai-dynamo/dynamo](https://github.com/ai-dynamo/dynamo)
[^11]: CNCF Sandbox Project: *llm-d: Kubernetes-native Distributed LLM Inference Serving (v0.5)* (2026). [https://github.com/llm-d/llm-d](https://github.com/llm-d/llm-d)
[^12]: Kubernetes SIGs: *LeaderWorkerSet (LWS) Concepts and v1.2 Release Documentation* (2026). [https://lws.sigs.k8s.io/docs/concepts/leaderworkerset/](https://lws.sigs.k8s.io/docs/concepts/leaderworkerset/)
[^13]: ingu627.github.io: *운영체제(OS) - Main Memory (9)* (2022). [/os/os9_10th/](/os/os9_10th/)
[^14]: ingu627.github.io: *운영체제(OS) - Virtual Memory (10)* (2022). [/os/os10_10th/](/os/os10_10th/)
[^15]: ingu627.github.io: *[논문 리뷰] The Google File System (GFS) 아키텍처 정리* (2022). [/paper/gfs/](/paper/gfs/)
[^16]: *Disaggregated LLM Serving Transfer-Layer Analysis: Post-prefill Pull vs Layer-by-layer Streaming* (2026). [arXiv:2610.18444](https://arxiv.org/abs/2610.18444)
[^17]: Qin et al.: *Mooncake: A KVCache-Centric Disaggregated Architecture for LLM Serving*, USENIX FAST Best Paper (2025). [https://www.usenix.org/conference/fast25/presentation/qin](https://www.usenix.org/conference/fast25/presentation/qin)
[^18]: LMCache Team: *LMCache: Efficient KV Cache Offloading and Disaggregated Transfer for vLLM* (2026). [https://github.com/LMCache/LMCache](https://github.com/LMCache/LMCache)
