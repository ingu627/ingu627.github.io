---
layout: single
title: "[논문 리뷰] Learning under Concept Drift: an Overview"
excerpt: "컨셉 드리프트는 시간이 지남에 따라 예기치 않은 방식으로 변경되는 것을 의미합니다. 서베이 논문 형식으로 작성되었고, 이것을 리뷰해보았습니다."
categories: paper
tags : [data quality, concept drift, 모델, mlops, data drift, 논문, 리뷰, 정리, 후기, design, 설명, layer, paper]
toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2026-10-11
---

![image](/assets/images/legacy/8071d6d0c4.webp)

"Learning under Concept Drift: an Overview" 논문을 정리하고 검토한 글이다[^1].
논문 링크 : <https://arxiv.org/abs/1010.4784>

머신러닝 시스템이 현실 환경에 배포되면 데이터 분포가 시간에 따라 끊임없이 변화하는 **비정상성(non-stationarity)**에 직면하게 된다. 학습 시점의 데이터 분포와 운영 시점의 데이터 분포가 달라지면서 모델 성능이 급격히 저하되는 병목을 해결하기 위해, 본 서베이 논문은 **컨셉 드리프트(Concept Drift)** 하에서의 점진적 학습 프레임워크와 변화 메커니즘을 통합적으로 정리하고 체계적인 분류 체계(taxonomy)를 제시한다.

## 0. Introduction

운영 환경의 머신러닝 모델은 데이터가 정적(stationary)이라는 전통적인 i.i.d. 가정이 깨지는 현실적 한계에 부딪힌다.

- **Concept drift**: 시간에 따른 비정상(non-stationary) 환경에서 데이터 생성 분포가 변화하는 학습 문제를 의미한다.
- 실제 운영 문제에서는 훈련 데이터와 애플리케이션(운영 환경) 데이터의 분포가 일치하지 않는 현상이 빈번하게 발생한다.

데이터 생성 환경이 변하면 모델의 예측 신뢰도가 하락하므로, 드리프트를 공식화하고 다루는 명확한 프레임워크가 필수적이다.

## 1. Framework and Terminology

컨셉 드리프트 연구를 엄밀히 다루기 위해서는 순차적으로 유입되는 데이터 스트림과 시점별 인스턴스를 표현하는 수학적 표기법이 선행되어야 한다.

인스턴스 시퀀스는 한 번에 한 인스턴스씩 관찰된다 (단, 동일한 시간 간격으로 관찰될 필요는 없다). 주요 기호 정의는 다음과 같다.

- **$X_t\in \mathbb{R}^p$**: 시간 $t$에서 관찰되는 p차원 특징 공간의 벡터
- **$y_t$**: 해당 라벨(label)
- **$X_t$**: 인스턴스(instance)
- **$(X_t,y_t)$**: 레이블된 인스턴스(labeled instance)
- **$(X_1,\dots,X_t)$**: 이력 데이터(historical data)
- **$X_{t+1}$**: 타겟 인스턴스(target instance)
- **$S$**: 데이터 소스(source)

### 1.1 Incremental Learning with Concept Drift

점진적 학습(Incremental Learning) 환경에서는 새로운 데이터가 순차적으로 들어올 때마다 모델을 점진적으로 갱신하며 미래 인스턴스를 예측한다.

- **데이터 수집**: 매 $t$시간마다 레이블된 이력 데이터 $X^H=(X_1,\dots,X_t)$를 획득한다.
- **예측 목표**: 타겟 인스턴스 $X_{t+1}$이 주어지면, 라벨 $y_{t+1}$을 예측해야 한다.
- **러너 구축**: 이력 데이터 $X^H$를 기반으로 러너 $L_t$를 구축한다.
- **예측 수행**: 모델 $L_t$를 적용하여 $X_{t+1}$의 라벨을 예측한다.
- **이력 통합**: 예측 후 실제 라벨 $y_{t+1}$이 확인되면 $(X_{t+1},y_{t+1})$은 이력 데이터의 일부로 편입된다.
- **반복 과정**: 다음 테스트 데이터 $X_{t+2}$를 대상으로 동일한 사이클을 반복한다.

<img src="/assets/images/legacy/9120a49e3a.webp" width=700>

매 시점 인스턴스 $X_t$는 특정 소스 $S_t$에 의해 생성된다.

- 모든 데이터가 동일한 소스로부터 샘플링된다면 ($S_1=S_2=...=S_{t+1}=S$), **컨셉(concept)**은 안정(stable) 상태를 유지한다.
- 두 시점 $i$와 $j$에서 $S_i\ne S_j$일 때, 이를 **컨셉 드리프트(concept drift)**라고 정의한다 (단, 단순 랜덤 노이즈는 드리프트로 간주하지 않는다).
- 컨셉 드리프트 문제를 다룰 때 핵심 가정은 미래 데이터 소스에 대한 불확실성이다.

과거 데이터로 미래를 예측하는 점진적 러너의 성패는 드리프트의 원인을 확률적으로 분해하는 데 달려 있다.

<img src="/assets/images/legacy/7a53c7c2a9.webp" width=700>

### 1.2 Causes of a concept drift

베이지안 결정 이론 관점에서 드리프트는 입력 특징 분포의 변화인지, 결정 경계 자체의 변화인지로 명확히 분해된다.

$X \rightarrow c_i$로 분류하기 위한 베이즈 최적 결정 규칙은 클래스에 대한 사전 확률 $P(c_i)$와 클래스 조건부 확률 밀도 함수 $p(X\mid c_i),\ i=1,\dots,k$에 의해 결정된다.

- 데이터 소스 정의: $S= \{ (P(c_k),p(X\mid c_k)) \}_{k=1}^K$
- 베이지안 의사결정 이론에서 동일한 실수 비용으로 인스턴스 $X$에 대한 분류 결정은 최대 사후 확률(posterior probability)에 기초하며, 클래스 $c_i$의 경우 다음과 같다.
  - $p(c_i\mid X) = \frac{P(c_i)P(X\mid c_i)}{p(X)}$
  - $p(c_i\mid X)$는 클래스 조건부 밀도 $p(X\mid c_i)$에 의존한다.

확률론적으로 컨셉 드리프트는 다음 3가지 요인에 의해 유발된다.

1. **클래스 사전 확률 변화**: 클래스 우선 순위 $P(c)$가 시간이 지남에 따라 변경될 수 있다.
2. **조건부 밀도 함수 변화**: 하나 이상의 클래스 $p(X\mid c)$ 분포가 변경될 수 있다.
3. **사후 확률 분포 변화**: 클래스 멤버십인 $p(c\mid X)$의 사후 분포(posterior distribution)가 변경될 수 있다.

이를 기준으로 실질적 영향에 따라 두 가지 드리프트로 구분한다.

- **가상 드리프트 (virtual drift)**: $p(X\mid c)$의 변화로 입력 분포는 달라지지만 결정 경계는 유지될 수 있는 현상
- **실제 드리프트 (real drift)**: $p(c\mid X)$의 변화로 최적 결정 경계 자체가 직접 변하는 현상

결국 결정 경계가 이동하느냐에 따라 대처 전략의 근본 방향이 갈린다.

## 2. How Do Concept Drift Learners Work?

드리프트 환경에서 작동하는 학습기는 $t+1$ 시간의 데이터에 대해 정확한 예측을 제공하기 위해 네 가지 핵심 설계 문제를 풀어야 한다.

1. **Future assumption**: 디자이너는 데이터 소스 $S_{t+1}$에 대해 가정을 한다.
2. **Change type**: 디자이너는 가능한 변화 패턴을 확인한다.
3. **Model adaptivity**: 디자이너는 변화 유형과 미래 가정을 바탕으로 모델을 적응시키는 메커니즘을 선택한다.
4. **Model selection**: 디자이너는 특정 매개 변수를 선택하기 위한 기준을 필요로 하며, 선택한 학습자를 매 단계마다 선택한다.

<img src="/assets/images/legacy/049d626499.webp" width=700>

### 2.1 Future assumption

미래 가정(Future assumption)은 타겟 인스턴스 $X_{t+1}$의 소스 $S_{t+1}$에 대해 세우는 전제 조건이다.

**미래 소스에 대한 세 가지 기본 전략**:
1. **현재 소스 유지 가정**: $S_{t+1}=S_t$이라고 가정하고 가장 최근 상태가 유지된다고 본다.
2. **인스턴스 기반 추정**: $X_{t+1}$에 기반한 소스를 추정한다.
3. **변화 추세 예측**: 이전 변화 궤적을 분석하여 변화를 예측한다.

### 2.2 Change types

변화 유형(Change type)이란 시간 경과에 따른 데이터 소스의 구성 패턴 변화를 의미한다.

시간이 경과한 두 가지 소스 $S_1, S_2$ 간의 전환 양상에 따라 다음과 같이 구분된다.

- **급격한 드리프트 (sudden drift)**: 시간 $t_0$의 소스 $S_1$가 갑자기 $S_2$로 바뀐 현상
- **점진적 드리프트 (gradual drift)**: 시간이 지날수록 $S_1$ 소스로부터의 샘플링 확률은 감소하고 $S_2$ 소스로부터의 샘플링 확률은 높아지는 현상
- **증분 드리프트 (incremental drift)**: 소스들의 변화가 매우 적기 때문에, 긴 시간 동안 바라만 봐야 인지할 수 있는 현상
- **재발 컨셉 (reoccurring context)**: active한 concept이 시간이 지나 다시 나타나는 현상

<img src="/assets/images/legacy/d28cad3ab2.webp" width=700>

변화의 속도와 주기성은 학습기의 적응 속도 및 메모리 유지 정책을 좌우한다.

### 2.3 Learner adaptivity

학습기 적응성(Learner adaptivity)은 감지된 드리프트에 대응하여 모델이 구조나 파라미터를 갱신하는 방식을 의미한다.

**주요 적응 메커니즘 4가지**:
1. **기본 모델 내부 수정**: 의사결정 트리 노드의 구성 등 기본 모델을 조정(또는 적응)
2. **모델 파라미터 조정**: 서포트 벡터 머신(SVM)에서 훈련 샘플의 가중치를 부여하는 등 모델 파라미터를 조정(또는 적응)
3. **적응형 훈련 세트 구성**: 훈련 세트와 테스트 세트를 나누듯 훈련 윈도우(training windows)나 인스턴스 선택(instance selection) 기법을 사용
4. **앙상블 적응**: 다수 모델 간 가중치 재분배 또는 서브 모델 교체를 통한 적응

<img src="/assets/images/legacy/9f3f97e98f.webp" width=700>

### 2.4 Model selection

모델 선택(Model selection)은 변화하는 환경 속에서 학습기의 성능을 측정하고 최적의 구성을 선택하기 위한 평가 기준을 다룬다.

컨셉 드리프트 학습 성과에 대한 주요 척도로 **일반화 오차(generalization error)**를 사용하며, 다음 두 방식으로 평가된다.

1. **이론적 평가**: 일반화 오차의 이론적 평가
2. **경험적 평가**: 교차 검증(cross validation)을 이용한 일반화 오차의 평가

컨셉 드리프트 학습자 설계의 핵심 이슈는 다음 두 가지 축으로 요약된다.

1. 학습자를 적응시키기 위해 선택된 전략은 데이터에 존재하는 **변화 유형(Change type)**에 대한 가정에 크게 좌우된다.
2. 모델 선택과 평가 전략은 학습자가 적용될 미래 데이터 소스에 대한 **미래 가정(Future assumption)**에 크게 좌우된다.

동작 방식 관점에서 컨셉 드리프트 학습자는 크게 두 그룹으로 분류하는 것이 일반적이다.

1. **트리거 기반 (Trigger-based)**: 학습자 적응성이 특정 트리거 신호에 의해 시작된다.
2. **진화형 (Evolving)**: 학습자가 알람이나 검출기에 의존하지 않고 정기적으로 진화한다.

## 3. Taxonomy of Available Concept Drift Learners

기존의 컨셉 드리프트 학습자들은 변화를 명시적으로 감지하여 재학습을 유발하는 트리거 방식과, 지속적으로 가중치를 갱신하는 진화 방식으로 대별된다. 컨셉 드리프트라는 개념은 1986년 Schlimmer와 Granger의 STAGGER 알고리즘[^2]에서 노이즈 환경의 점진적 학습 문제로 처음 공식화된 이후 본격적인 연구가 촉발되었다.

- **트리거 (trigger)**: 모델 변경의 필요성을 나타내는 명시적 신호가 있음을 의미하며, 새 모델을 구성하는 방법에 직접 영향을 미친다.
- **진화 (evolve)**: 데이터 진행률과 모델 구축 사이의 명시적 연결을 유지하지 않으며, 일반적으로 변화를 직접 감지하지 못한다. 앙상블 가중치(ensemble weights) 또는 프로토타이핑 메커니즘을 유지함으로써 가장 정확한 분류를 구축하는 것을 목표로 한다.

<img src="/assets/images/legacy/72169ef3dd.webp" width=700>

### 3.1 Evolving learners

진화형(evolve) 방법은 트리거의 적응성(detect나 cut)이 아니라, 계산 복잡도(computational complexity)를 줄이는 실용적인 도구다.

### 3.1.1 Adaptive ensembles

컨셉 드리프트를 다루기 위해 가장 많이 사용되는 진화형 기술은 분류기 앙상블(classifier ensemble)이다.

- SVM, 가우시안 혼합 모델(Gaussian mixture models), 퍼셉트론, kNN 등 여러 모델의 분류 출력을 조합하거나 선택하여 최종 결정을 내린다.
- 이력 평가는 sudden과 incremental drift에 제한되며, 교차 검증은 gradual drift와 reoccurring context를 효과적으로 고려할 수 있다.
- 간단한 접근법은 이력 데이터를 블록으로 분할하는 것이다. 블록에는 시간 내에 순차적으로 인스턴스가 포함된다. 이러한 기법은 sudden과 incremental drift에 적합하며, 어느 정도까지는 reoccurring context를 선호한다.
- **대표 앙상블 기법**: SEA(Streaming Ensemble Algorithm)[^6]는 크기 $K=25$의 고정 크기 분류기 풀을 유지하며 데이터 청크마다 새 분류기를 학습시켜 가장 성능이 낮은 기존 분류기와 교체한다. DWM(Dynamic Weighted Majority)[^7]는 인스턴스마다 예측 오답을 낸 기본 분류기의 가중치에 감쇠 인자 $\beta \in [0, 1)$(기본값 0.5)를 곱해 점진적으로 영향력을 축소하고 필요 시 새로운 분류기를 풀에 추가한다.

### 3.2 Learners with triggers

트리거 기반 방식은 성능 저하나 데이터 분포 변화를 나타내는 명시적 신호를 포착하여 모델 구조 변경이나 학습 윈도우 절단(cut)을 즉각 실행한다.

### 3.2.1 Change detectors

가장 일반적인 트리거 기술은 변화 감지(change detection)이며, 이는 급격한 드리프트(sudden drift) 대응에 효과적이다.

- 변화 감지는 원시 데이터, 학습자의 파라미터, 또는 학습자의 오류율 통계에 근거하여 수행된다.
- **DDM (Drift Detection Method)[^3]**: PAC(Probably Approximately Correct) 학습 이론에 기반하여 인스턴스 수 $t$에 따른 오류율 $p_t$와 표준편차 $s_t = \sqrt{p_t(1-p_t)/t}$를 추적한다. 최소 오차 기준 $p_{\min} + 2s_{\min}$에 도달하면 경고(Warning) 단계로 판단해 새 데이터 버퍼를 축적하기 시작하고, $p_{\min} + 3s_{\min}$(약 99% 신뢰 수준)을 초과하면 드리프트로 판정하여 기존 학습기를 버리고 버퍼 데이터로 새 모델을 훈련한다.
- **ADWIN (Adaptive Windowing)[^4]**: 가변 크기 윈도우 $W$ 내에서 임의의 두 서브윈도우 $W_0, W_1$ 간의 평균 차이가 통계적 임계치 $\epsilon_{\text{cut}} = \sqrt{\frac{1}{2m}\ln\frac{4|W|}{\delta}}$를 초과할 때(여기서 $m$은 서브윈도우 크기의 조화 평균, $\delta$는 신뢰도), 통계적 유의수준 하에서 드리프트가 발생한 것으로 보고 가장 오래된 데이터를 윈도우에서 순차 제거한다.

### 3.2.2 Training windows

훈련 윈도우 기법은 최근 데이터의 윈도우 크기를 동적으로 조절하여 드리프트에 적응하는 방식이다.

- **휴리스틱 윈도우 제어**: FLORA 계열[^5]은 고정 윈도우의 정보 손실과 반응 지연 한계를 극복하기 위해, 예측 정확도가 유지되면 윈도우 크기를 확대하고 정확도가 급락하면 윈도우를 축소하여 최근 데이터에만 집중하도록 제어한다.
- 훈련 윈도우는 검색 테이블(lookup table) 원칙을 사용하여 최적 크기로 결정된다.
<img src="/assets/images/legacy/51eb19145e.webp" width=700>

이처럼 러너 설계 기법들은 시간적 맥락, 지식 전이, 모델 적응성을 다루는 주변 연구 분야들과 긴밀하게 맞닿아 있다.

## 4. Related Research Areas

컨셉 드리프트 문제는 독립된 단일 영역이 아니라 시간적 맥락, 지식 전이, 동적 적응성을 공유하는 인접 머신러닝 분야들과 유기적으로 연결되어 있다[^1].


### 4.1 Time context

컨셉 드리프트 문제의 **시간적 맥락(time context)**은 데이터가 시간에서 순차적이며 모델도 시간과 관련이 있으므로 지속적으로 업데이트해야 한다는 점을 의미한다.

- **점진적 학습 (incremental learning)**: 모든 학습 데이터를 한 번에 사용할 수 없는 작업을 머신 러닝으로 학습하는 데 초점을 맞춘다. 데이터가 시간이 지남에 따라 수신되므로 정확성을 높이기 위해 모델을 지속적으로 업데이트하거나 재교육해야 한다.
- **데이터 스트림 마이닝 (data stream mining)**: 수십 년에 걸쳐 점진적 학습은 데이터 흐름이 매우 빠른 데이터 스트림 마이닝에 의해 점차 추월되었다. 데이터 스트림 마이닝은 처리 속도와 복잡성에 초점을 맞추고 있기 때문에 적시 변화 감지(timely change detection)에 대한 관심이 높아졌다.
- **시계열 분석 (time series analysis)**: ARIMA 모델 등을 사용함으로써 시간적 의존성을 모델링하고 처리한다.

### 4.2 Knowledge transfer

**지식 전이(knowledge transfer)**는 훈련 데이터의 분포와 테스트 데이터 사이에 정기적으로 잠재적 차이가 있음을 의미하며, 이전 데이터의 정보를 새 데이터에 맞게 조정해야 한다.

- 컨셉 드리프트 문제에서는 데이터 생성 프로세스의 변경으로 인해 이러한 불일치가 시간 축을 따라 발생한다.
- **데이터셋 시프트 (dataset shift)**: 표본 선택 편향, 측정의 변경으로 인한 영역 이동, 데이터의 불균형으로 인한 모델 이동, 의사결정의 차별 등이 포함된다.
- **전이 학습 (transfer learning)**: 머신 러닝에서 유사한 문제를 해결하기 위해 얻은 지식을 적용하는 과정을 의미한다.
- **능동 학습 (active learning)**: 온디맨드(on-demand) 방식으로 데이터를 라벨링하며, 학습자의 정확성을 높이거나 라벨링 비용을 절감하기 위해 라벨링이 필요한 인스턴스를 선별한다. 컨셉 드리프트와의 접점은 라벨이 없는 인스턴스가 특정 개념에 얼마나 잘 대응하는지 판단하는 방식에 있다.

### 4.3 Model adaptivity

**모델 적응성(Model adaptivity)**은 학습 알고리즘 자체에 통합된 적응 특성을 통해 컨셉 드리프트와 같은 환경 변화에 대응하는 메커니즘을 의미한다.

- **동적 최적화 (Dynamic optimization)**: 진화 연산(evolutionary computation) 분야에서 시간에 따라 동적으로 변화하는 최적점을 추적하는 문제로 활발히 연구된다. 주요 접근법은 다양성을 유지 및 강화하여 최적화 환경이 변경되었을 때 풀(pool)과 함께 사용할 적절한 모델을 찾는 것이며, 다음 단계는 과거 모델과 현재 과제 사이의 관계를 규명하는 것이다.
- **유비쿼터스 지식 발견 (Ubiquitous Knowledge Discovery, UKD)**: 분산 및 모바일 시스템의 학습에 초점을 맞추는 최신 연구 분야다. 시스템은 동적 환경에서 지능적이고 적응적이어야 하며, UKD 시스템의 개체는 시공간 환경에 존재하며 실시간 제약 조건 하에서 작동하고 다른 개체와 정보를 교환한다.

## 5. 핵심 요약 및 시사점

현실 스트림 데이터 환경에서 컨셉 드리프트에 강건한 머신러닝 시스템을 구축하기 위한 핵심 원칙은 다음과 같다.

- **드리프트의 이원화 이해**: 입력 특징 분포만 변하는 가상 드리프트($p(X\mid c)$)와 최적 결정 경계 자체가 이동하는 실제 드리프트($p(c\mid X)$)를 명확히 분리하여 대응해야 한다.
- **변화 패턴 기반 전략 수립**: 급격한 드리프트에는 신속한 에러 기반 변화 감지기(Change detector)와 윈도우 절단이, 점진적·재발 드리프트에는 앙상블 가중치 적응이 효과적이다.
- **트리거와 진화의 트레이드오프**: 명시적 트리거는 즉각적인 모델 갱신을 가능하게 하지만 오경보에 취약하며, 진화형 앙상블은 안정적이지만 급변하는 경계 추적에 지연이 발생할 수 있다.
- **MLOps 관점의 파이프라인 통합**: 단순 주기적 재학습을 넘어 스트림 에러율 통계 모니터링, 가변 윈도우, 능동 학습을 연계한 종단간 적응 체계 구축이 필수적이다.

결국 데이터 분포의 변화를 상수로 가정하는 시스템만이 시간의 흐름 속에서도 예측 정확도 저하를 최소화하고 안정적인 일반화 성능을 유지한다.

### 5.1 한계점 및 트레이드오프 (Limitations & Trade-offs)

서베이 논문에서 지적하는 컨셉 드리프트 대응 기법들의 핵심 한계와 엔지니어링 트레이드오프는 다음과 같다[^1].

1. **미래 소스 가설 의존성**: 미래 시점의 데이터 소스($S_{t+1}$)에 대한 가정(최근 소스 유지 $S_{t+1}=S_t$ 또는 선형 변화 궤적 외삽)이 실제 스트림의 변화 양상과 빗나갈 경우, 적응 메커니즘 자체가 오히려 오차를 가중시킬 수 있다.
2. **지연된 정답 라벨(Delayed Ground Truth)의 현실적 제약**: DDM, ADWIN 등 지도 학습 오차 기반 감지기는 라벨 $y_{t+1}$이 즉시 관측된다는 가정을 요구한다. 신용 평가나 질병 진단처럼 라벨 피드백에 수개월의 지연이 발생하는 현실 환경에서는 지도형 트리거가 즉각 작동할 수 없으므로, 비지도 특징 분포 모니터링이나 능동 학습(Active Learning)과의 복합 설계가 필수적이다.
3. **모델 복잡도 대 오경보(False Alarm) 비용**: 복잡한 앙상블 가중치 재조정 및 빈번한 트리거 리셋은 일시적인 무작위 노이즈를 실제 드리프트로 오판(Type I error)하여 불필요한 모델 재학습 부하를 유발한다. 실무 스트림 환경에서는 지나치게 복잡한 적응기보다 적절히 튜닝된 단순 슬라이딩 윈도우가 연산 효율과 강건성 면에서 더 안정적인 성능을 제공할 수 있다.

## References

[^1]: Indrė Žliobaitė, "Learning under Concept Drift: an Overview", arXiv preprint arXiv:1010.4784, 2010.
[^2]: J. C. Schlimmer and R. H. Granger, "Incremental Learning from Noisy Data", Machine Learning, 1(3):317–354, 1986.
[^3]: J. Gama, P. Medas, G. Castillo, and P. Rodrigues, "Learning with Drift Detection", SBIA 2004, LNAI 3171, pp. 286–295, 2004.
[^4]: A. Bifet and R. Gavaldà, "Learning from Time-Changing Data with Adaptive Windowing", In Proceedings of the 7th SIAM International Conference on Data Mining (SDM), pp. 443–448, 2007.
[^5]: G. Widmer and M. Kubat, "Learning in the Presence of Concept Drift and Hidden Contexts", Machine Learning, 23(1):69–101, 1996.
[^6]: W. N. Street and Y. Kim, "A streaming ensemble algorithm (SEA) for large-scale classification", In Proceedings of the 7th ACM SIGKDD, pp. 377–382, 2001.
[^7]: J. Z. Kolter and M. A. Maloof, "Dynamic weighted majority: An ensemble method for drifting concepts", Journal of Machine Learning Research, 8:2755–2790, 2007.

- Indre Zliobaite, "Learning under Concept Drift: an Overview", arXiv preprint arXiv:1010.4784, 2010.
