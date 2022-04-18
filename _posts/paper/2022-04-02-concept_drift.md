---
layout: single
title: "[논문 리뷰] Learning under Concept Drift: an Overview"
excerpt: "컨셉 드리프트는 시간이 지남에 따라 예기치 않은 방식으로 변경되는 것을 의미합니다. 서베이 논문 형식으로 작성되었고, 이것을 리뷰해보았습니다."
categories: paper
tag : [data quality, concept drift, 모델, mlops, data drift, 논문, 리뷰, 정리, 후기, design, 설명, layer]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-04-13
---

![image](https://user-images.githubusercontent.com/78655692/163179465-84498a7b-65b6-4389-ab68-e2d64f1aefd9.png)

"Learning under Concept Drift: an Overview" 논문을 개인 공부 및 리뷰를 위해 쓴 글입니다. <br>
논문 링크 : <https://arxiv.org/abs/1010.4784>
{: .notice--info}

<br>
<br>

## 0. Introduction

- **Concept drift**는 시간에 따른 비정상(non stationary) 학습 문제를 말한다.
- 실제 문제에서 훈련 데이터와 애플리케이션 데이터가 일치하지 않는 경우가 많다.

<br>
<br>

## 1. Framework and Terminology

- instance의 sequence는 한 번에 한 instance씩 관찰된다. (단, 동일한 시간 간격으로 관찰될 필요는 없다.)
- 다음은 기호에 대한 이해
  - $X_t\in \Re^p$ : 시간 $t$에서 관찰되는 p차원 특징 공간의 벡터
  - $y_t$ : 해당 라벨(label)
  - $X_t$ : 인스턴스(instance)
  - $(X_t,y_t)$ : 레이블된 인스턴스(labeled instance)
  - $(X_1,...,X_t)$ : 이력 데이터(historical data)
  - $X_{t+1}$ : 타겟 인스턴스(target instance)
  - $S$ : source

<br>
<br>

### 1.1 Incremental Learning with Concept Drift

- Incremental Learning framework 사용 
  - 매 $t$시간마다 레이블된 이력 데이터 $X^H=(X1,...,X_t)$를 얻는다.
  - 타겟 인스턴스 $X_{t+1}$가 오면, 우리는 라벨 $y_{t+1}$를 예측해야 한다.
  - 우리는 $X^H$를 가지고 러너 $L_t$를 짓는다. (여기서는 러너라 했지만 학습한다?로 추정)
  - 모델 $L_t$을 적용하여 $X_{t+1}$의 라벨을 예측
  - 이제 $y_{t+1}$와 $X_{t+1}$은 이력 데이터의 한 부분이 됨
  - 다음 테스트 데이터는 $X_{t+2}$이다. (반복)

<img src="https://user-images.githubusercontent.com/78655692/161387973-b28b58b0-f8ee-401f-82b3-b64bc171ed86.png" width=700>

<br>

- 매번 인스턴스 $X_t$는 소스 $S_t$에 의해 생성된다.
- 만약 모든 데이터가 같은 소스로부터 샘플된다면 ($S_1=S_2=...=S_{t+1}=S$), **concept**은 stable하다고 할 수 있다. 
- 만약 두 시점 시점 $i$와 $j$에서 $S_i\ne S_j$일 때, 우리는 **concept drift**라 말한다.
  - 여기서 랜덤 노이즈는 고려되지 않았다.
- concept drift 문제를 다룰 때 핵심 가정은 미래에 대한 불확실성이다.

<img src="https://user-images.githubusercontent.com/78655692/161388300-5dad5531-cdd7-4139-862c-27e9e3310d82.png" width=700>

<br>
<br>

### 1.2 Causes of a concept drift

- $X \rightarrow c_i$로 분류하기 위한 최적의 분류는 온전히 **클래스에 대한 사전 확률** $P(c_i)$와 **클래스 조건부 확률 밀도 함수** $p(X\mid c_i),\ i=1,...,k$로 결정된다.
  - $S= {(P(c_k),p(X\mid c_k))}$
- 베이지안 의사결정 이론에서 동일한 실수 비용으로 인스턴스 $X$에 대한 분류 결정은 최대 사후 확률(posterior probability)에 기초하며, 클래스 $c_i$의 경우 다음과 같다.
  - $p(c_i\mid X) = \frac{P(c_i)P(X\mid c_i)}{p(X)}$
  - $p(c\mid X)$는 $p(X\mid c))$에 의존한다.

<br>

- concept drift는 3가지 방식으로 일어난다.
  1. 클래스 우선 순위 $P(c)$는 시간이 지남에 따라 변경될 수 있다.
  2. 하나 이상의 클래스 $p(X\mid c)$ 분포가 변경될 수 있다.
  3. 클래스 멤버십인 $p(c\mid X)$의 사후 분포(posterior distribution)는 변경될 수 있다.

- **virtual drift** : $p(X\mid c)$의 변화
- **real drift** : $p(c\mid X)$의 변화

<br>
<br>

## 2. How Do Concept Drift Learners Work?

- 모델은 $t+1$ 시간의 데이터를 정확한 예측을 제공해야 한다.
- 이러한 모델을 만들기 위해, 4가지 문제를 풀어야 한다.
  1. **Future assumption** : 디자이너는 데이터 소스 $S_{t+1}$에 대해 가정을 한다.
  2. **Change type** : 디자이너는 가능한 변화 패턴을 확인한다.
  3. **Model adaptivity** : 디자이너는 변화 유형과 미래 가정을 바탕으로 모델을 적응시키는 메커니즘을 선택한다.
  4. **Model selection** : 디자이너는 특정 매개 변수를 선택하기 위한 기준을 필요로 한다. 선택한 학습자를 매 단계마다 선택한다.

<img src="https://user-images.githubusercontent.com/78655692/161389131-c448933f-7fe1-476e-a9fd-f0b43283ce3f.png" width=700>

<br>
<br>

### 2.1 Future assumption

- **Future assumption**은 타겟 인스턴스 $X_{t+1}$의 소스 $S_{t+1}$에 대한 가정이다.
  1. $S_{t+1}=S_t$이라고 가정
  2. $X_{t+1}$에 기반한 소스 추정
  3. 변화 예측

<br>

### 2.2 Change types

- **Change type**란 시간 경과에 따른 데이터 소스의 구성 패턴 변화를 의미한다.
- 시간이 경과한 두 가지 소스 $S_1, S_2$가 있다고 가정해본다. 
  - **sudden drift** : 시간 $t_0$의 소스 $S_1$가 갑자기 $S_2$로 바뀐 현상
  - **gradual drift** : 시간이 지날수록 $S_1$ 소스로부터의 샘플링 확률은 감소하고 $S_2$ 소스로부터의 샘플링 확률은 높아지는 현상
  - **incremental drift** : 소스들의 변화가 매우 적기 때문에, 긴 시간 동안 바라만 봐야 인지할 수 있는 현상
  - **reoccurring context** : active한 concept이 시간이 지나 다시 나타나는 현상

<img src="https://user-images.githubusercontent.com/78655692/161389933-ff670f7e-ae15-4240-bd29-058be9a3a31f.png" width=700>

<br>
<br>

### 2.3 Learner adaptivity

- 4개의 주요 적응성 확인
  1. 기본 모델은 조정(또는 적응)할 수 있다. (ex. 의사결정 트리 노드의 구성)
  2. 모델의 파라미터들은 조정(또는 적응)할 수 있다. (ex. 서포트 벡터 기계에서 훈련 샘플의 가중치 부여)
  3. 적응형 훈련 세트 구성을 사용할 수 있다. (ex. training windows, instance selection) (training set과 test set을 나눌 수 있듯이)
  4. 앙상블 적응

<img src="https://user-images.githubusercontent.com/78655692/161390121-12f9c6a3-bdaf-499d-986d-f90c252d3d0a.png" width=700>

<br>
<br>

### 2.4 Model selection

- 우리는 concept drift 학습 성과에 대한 주요 척도로 **일반화 오류**를 사용한다.
  1. 일반화 오차의 이론적 평가
  2. cross validation을 이용한 일반화 오차의 평가

- 다음 2가지가 concept drift 학습자의 핵심 이슈이다.
  1. 학습자를 적응시키기 위해 선택된 전략은 데이터에 존재하는 변화 유형에 대한 가정에 크게 좌우된다.
  2. 모델 선택과 평가 전략은 학습자가 적용될 미래 데이터 소스에 대한 가정에 크게 좌우된다.

- concept drift 학습자는 크게 두 그룹으로 분류하는 것이 일반적이다.
  1. 학습자 적응성은 트리거에 의해 시작된다.
  2. 학습자는 알람이나 검출기에 의존하지 않고 정기적으로 진화한다.

<br>
<br>

## 3. Taxonomy of Available Concept Drift Learners

- **trigger** : 모델 변경의 필요성을 나타내는 신호가 있음을 의미한다.  
  - 트리거는 새 모델을 구성하는 방법에 직접 영향을 미친다.
- **evolve** : 데이터 진행률과 모델 구축 사이의 명시적 연결을 유지하지 않으며, 일반적으로 변화를 감지하지 못한다.
  - 이들은 ensemble weights 또는 prototyping mechanism을 유지함으로써 가장 정확한 분류를 구축하는 것을 목표로 한다.

<img src="https://user-images.githubusercontent.com/78655692/161390741-fcc97d7e-60ca-4c4b-b49f-94b31613ccdb.png" width=700>

<br>
<br>

### 3.1 Evolving learners

- evolve 방법은 trigger의 적응성(detect나 cut)이 아니라, 계산 복잡도(computational complexity)를 줄이는 툴이다.

<br>

### 3.1.1 Adaptive ensembles

- concept drift를 다루기 위해 가장 많이 사용되는 evolving 기술은 classier ensemble이다. 
  - 여러 모델의 분류 출력을 조합하거나 선택하여 최종 결정을 내린다. (SVM, Gaussian mixture models, 퍼셉트론, kNN 등)
- 이력 평가는 sudden과 incremental drift에 제한되며, 교차 검증은 gradual drift와 reoccurring context를 고려할 수 있다.

<br>

- 간단한 접근법은 이력 데이터를 블록으로 분할하는 것이다. 블록에는 시간 내에 순차적으로 인스턴스가 포함된다.
  - 이러한 기법은 sudden와 incremental drift에 적합하며, 어느 정도까지는 reoccuring context를 선호한다.

<br>
<br>

### 3.2.1 Change detectors

- 가장 일반적인 트리거 기술은 변화 감지(change detection)이며, 이는 암묵적으로 sudden drift와 관련이 있다. 
  - 변화 감지는 원시 데이터, 학습자의 파라미터, 학습자의 오류에 근거할 수 있다.

<br>
<br>

### 3.2.2 Training windows

- training window 크기를 결정하기 위해 휴리스틱을 사용하는 방법이 있다.
- 휴리스틱은 에러 모니터링과 관련되어 있다.
- training window는 검색 테이블 원칙을 사용하여 결정된다.

<img src="https://user-images.githubusercontent.com/78655692/161392034-ed3e6d1a-f20f-434a-b2d0-361fa3b49752.png" width=700>

<br>
<br>

## 4. Related Research Areas

### 4.1 Time context

- concept drift 문제의 **time context**는 데이터가 시간에서 순차적이며 모델도 시간과 관련이 있으므로 지속적으로 업데이트해야 한다는 것이다.

<br>

- **incremental learning**은 모든 학습 데이터를 한 번에 사용할 수 없는 작업을 머신 러닝으로 학습하는 데 초점을 맞춘다.
  - 데이터는 시간이 지남에 따라 수신되므로 정확성을 높이기 위해 모델을 업데이트하거나 재교육해야 한다.
- 하지만 수십 년에 걸쳐 incremental learning 영역은 덜 활발히 연구되었다. 이것은 데이터 흐름이 지속적으로 빠른 데이터 스트림 마이닝에 의해 점차 추월되었다.
- 데이터 스트림 마이닝은 처리 속도와 복잡성에 초점을 맞추고 있기 때문에 timely change detection에 대한 관심이 높아졌다.
- 마지막으로 time series 분석은 ARIMA 모델을 사용함으로써 처리한다.

<br>
<br>

### 4.2 Knowledge transfer

- **knowledge transfer**는 훈련 데이터의 분포와 테스트 데이터 사이에 정기적으로 잠재적 차이가 있음을 의미한다.
  - 따라서 이전 데이터의 정보를 새 데이터에 맞게 조정해야 한다.
- concept drift 문제에서는 데이터 생성 프로세스의 변경으로 인해 이 불일치가 시간 내에 발생한다.
- dataset shift에는 표본 선택 편향, 측정의 변경으로 인한 영역 이동, 데이터의 불균형으로 인한 모델 이동, 의사결정의 차별 등이 있을 것이다.
- 기계 학습에서 유사한 문제를 해결하기 위해 얻은 지식을 적용하는 과정을 **transfer learning**이라고 한다.
- 마지막으로 **active learning**은 concept drift와 다르게 관련된다.
  - active learning에서 데이터는 on-demand 방식으로 라벨링되며, 학습자의 정확성을 높이거나 라벨링 비용을 절감하기 위해 라벨링이 필요한 인스턴스를 선택한다.
- concept drift 문제와의 관계는 라벨이 없는 인스턴스가 특정 개념에 얼마나 잘 대응하는지의 방식에 있다.

<br>
<br>

### 4.3 Model adaptivity

- **모델 적응성**은 학습에 통합된 적응 특성을 가진 모델을 의미한다.
  - concept drift처럼 변화에 적응할 수 있다.
- evolutionary 계산에서 동적 최적화 문제가 활발히 연구된다. 이것의 목표는 시간에 따라 동적으로 변화하는 최적화를 추적하는 것이다.
  - 주요 접근법으로 다양성을 유지 및 강화와 관련이 있으며, 일단 최적화가 변경되면 pool과 함께 사용할 수 있는 적절한 모델을 찾는다.
  - 이 방향의 다음 단계는 과거 모델과 현재 과제 사이의 관계를 찾는 것이다.
- **ubiquitous** 방식은 새로운 분야로, 분산 및 모바일 시스템의 학습에 초점을 맞추고 있다.
  - 시스템은 환경에서 작동하며 intelligent하고 적응력이 있어야 한다.
  - UKD 시스템의 개체는 동적으로 변화하는 환경에 시간과 공간에 존재하며 위치를 변경할 수 있다.
  - 개체는 정보 처리 기능을 가지고 있으며 실시간 제약 조건 하에서 작동하며 다른 개체와 정보를 교환할 수 있다.

<br>
<br>
<br>
<br>


