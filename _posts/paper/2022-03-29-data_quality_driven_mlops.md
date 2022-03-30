---
layout: single
title: "[논문 리뷰] A Data Quality-Driven View of MLOps"
excerpt: "이 논문은 데이터 품질의 다양한 측면이 ML development 단계를 통해 어떻게 전파되는지를 고민했습니다. 이에 대한 요약 및 리뷰입니다."
categories: paper
tag : [mlops, data quality, 데이터 품질, concept shift, ML, 머신 러닝, 자동화,]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-03-29
---

"A Data Quality-Driven View of MLOps" 논문을 개인 공부 및 리뷰를 위해 쓴 글입니다. <br>
논문 링크 : <https://arxiv.org/abs/2102.07750>
{: .notice--info}

<br>
<br>

## 1. Introduction

- ML 모델(Machine Learning Model)은 데이터에서 컴파일된 software artifact이다.
- ML 모델은 불가피하게 DevOps 프로세스를 거친다.
  - **DevOps** : 시스템 개발 라이프 사이클(life cycle)을 단축하고 소프트웨어 품질로 지속적인 전달을 제공하는 것.
- ML 모델(accuracy, fairness, robustness)의 품질은 기초 데이터(noises, imbalances, additional adversarial perturbations)의 품질과도 같다.
- ML 모델을 향상 시키는 주요 방법으로 data cleaning, integration, label acquisition 같이 데이터셋의 품질을 높이는 것이다.
- 따라서, MLOps를 이해하고, 측정하고, 향상시키기 위해, **data quality**는 MLOps에서 매우 중요한 역할을 한다.

<br>

- 기타 Data Quality 관련해서 지금까지 많은 연구자들이 연구해 온 것들
  - data acquistion with weak supervision (Snorkel)
  - ML engineering pipelines (TFX)
  - data cleaning (ActiveClean)
  - data quality verification (Deequ)
  - interaction (Northstar)
  - fine-grained monitoring and improvement (Overton)

<br>

### Data Quality에 대한 4가지 측면

|속성|설명|
|---|---|
|정확성(accuracy)|데이터가 정확하고 신뢰할 수 있으며, 작업에 대해 인증된 정도|
|완전성(completeness)|특정 데이터 수집에 대응(corresponding)하는 데이터를 포함하는 정도|
|일관성(consistency)|데이터 집합에서 정의된 의미 규칙 위반의 정도|
|적시성(timeliness)|작업을 위한 데이터가 최신인 정도|

<br>

<img src='https://user-images.githubusercontent.com/78655692/160605964-77fdd705-bdb1-4330-8fed-a48320c75d39.png' width=700>


<br>

### 전체 개요

![image](https://user-images.githubusercontent.com/78655692/160606677-c3663f3f-8317-45f0-9d2d-56a5cc0ae774.png)

<br>
<br>

## 2. Machine Learning Preliminaries

- 이 논문에서는 머신 러닝에 관한 선수 지식을 소개한다. 기본 사항은 여기서는 생략하겠다.

<br>

### Concept Shift

- $P(X,Y)$ 의 확률 분포가 시간이 지나도 고정되어 있는 경우, 실제에 잘 적용이 되지 않을 때가 있다. 이렇게 시간의 변동에 따른 분포의 변화를 **concept shift**라고 한다.
- 특징 공간 $X$와 라벨 공간 $Y$가 모두 분포의 변경에 걸쳐 동일하게 유지된다고 가정하는 경우가 있는데, 이는 잘못될 수 있다. $X$ 또는 $Y$의 변경을 **data drift**라고 하고, 이로 인해 모델을 학습하거나 평가하기 위한 값이 누락될 수 있다.
- $p(X)$의 변화가 $p(Y\mid X)$를 수정하는 경우를, **real drift** 또는 **model drift**라고 한다.
- 반면 $p(Y\mid X)$가 온전히 유지한다면, 이를 **virtual drift**라고 한다.
  - $X$ feature에 걸쳐 posterior probability distribution이 근사한다고 가정할때, **virtual drift**는 ML 모델을 훈련할 때 어떠한 영향이 없다.

<br>

![image](https://user-images.githubusercontent.com/78655692/160668799-e3f44621-e83a-457f-8a7d-9afa5c9516c5.png)

<br>

### 추가 : 어떻게 방지해야 하나? [^1]

1. **Online learning** : 모델이 한 번에 하나의 샘플을 처리함에 따라 학습자가 즉시 업데이트
2. **Periodically re-train the model** : 다양한 instance에서 trigger에 발생될 수 있는 모델 재학습
   - 모델 성능이 지정된 임계값 미만으로 저하되거나, 두개의 window 사이의 주요 drift가 관찰되거나
3. **Periodically re-train on a representative subsample**
   - concept drift가 발견되면, sample이 모집단을 대표하고, 원래 데이터 분포와 동일한 확률 분포를 따르는 인스턴스를 선택
4. **Ensemble learning with model weighting** : 여러 모델이 앙상블되고 출력이 일반적으로 개별 모델 출력에 걸쳐 가중 평균인 모델 가중치를 갖는 앙상블 학습
5. **Feature dropping** : 한 번에 하나의 기능을 사용하여 여러 모델을 제작하고 AUC-ROC 응답이 기대에 미치지 못할 경우 해당 기능을 폐기한다.


<br>
<br>

## 3. MLOps Task 1: Effective ML Quality Optimization

- MLOps의 핵심 작업 중 하나로 모델의 품질을 개선하는 방법을 찾는 것이다. 새로운 아키텍처나 모델을 찾는 것 외에도, 학습 데이터의 양질을 높이는 것도 중요하다.
  - data cleaning, noisy나 dirty한 샘플을 고치거나 제거하는 것이 이에 해당.

<br>

### MLOps Challenge 

- MLOps로 오면, 모든 noisy나 dirty 샘플들이 최종 ML 모델의 품질과 동일하게 중요하지 않을 수 있다는 문제가 있다.
  - 이는 MLOps에서 sub-optimal 개선 사항일 수 있다.
- 이러한 작업은 인간에 의한 semi-automatically하게 수행되기 때문에, 자동화 도구의 지침에 따라, MLOps 관점에서 성공적인 cleaning 전략은 인간의 노력을 최소화하는 것이다.

<br>

### A Data Quality View

- 위의 과제에 대한 원칙적인 해결책을 제시하기 위해서는 훈련 셋의 불완전하고 노이즈가 많은 데이터가 훈련된 ML 모델의 품질에 미치는 영향에 대한 공동 분석이 필요하다.
  - ActiveClean이 이 문제를 연구했다.
  - sequential information maximization에 기반한 principled cleaning algorithm과 함께 이러한 noise propagation process를 모델링하고 분석하는 CPClean이 도입했다.

<br>
<br>

## 4. MLOps Task 2: Preventing Unrealistic Expectations

- DevOps에서, 새로운 프로젝트는 일반적으로 성공 가능성을 평가하고 이해하기 위한 타당성 조사를 통해 시작된다. 목적은 비현실적인 기대를 가진 사용자들이 실패할 수 밖에 없는 솔루션을 개발하는 데 많은 비용과 시간을 들이는 것을 막는 데에 있다.
  - 하지만 MLOps에서는 이런 실현 가능성 조사는 거의 없다.

<br>

### MLOps Challenge

- 훈련 및 검증 셋이 정의된 ML 작업이 주어진다면, 비용이 많이 드는 ML 훈련을 하지 않고 오류를 어떻게 추정할 것인지 생각해야 한다.
  - 이것은 Bayes 오류율(축소할 수 없는 오류라고도 한다.)을 추정하는 것과 관련 있다.
- 실용적인 BER estimator를 제공하는 것은 여전히 연구 주제이다.
- 실현 가능성 조사를 실용적인 MLOps 단계로 만들기 위한 중요한 과제 
  1. BER estimator에 대한 수십 년간의 이론적 연구를 활용하는 방법
  2. 어떤 타협과 최적화를 수행해야 하는지를 이해

<br>

### Non-Zero Bayes Error and Data Quality Issues

- zero가 아닌 BER의 원인을 구성하는 두 가지 표준 데이터 품질 차원
  1. 데이터의 완전성(completeness), feature space나 label space의 불충분한 정의
  2. 데이터의 정확성 (accuracy), 노이즈가 많은 라벨의 양에 반영되는
- 수학적인 수준에서, BER이 0이 아닌 이뉴는 실현 가능한 입력 특징이 주어진 다른 클래스에 대한 **중복된 사후 확률(overlapping posterior probabilities)**에 있다.
  - 주어진 표본에 대해 레이블이 고유하지 않을 수 있다.

![image](https://user-images.githubusercontent.com/78655692/160673572-e2711f74-e41b-47b9-99d5-f100fe8e4fc3.png)

<br>

### A Data Quality View

- ML 모델을 위한 실용적인 BER estimator를 구축하기 위한 2가지 주요 과제
  1. **연산 요구 사항** : 정확성 측면에서 합리적인 추정치를 제공하기 위해 대량의 데이터가 필요하며, 이로 인해 높은 계산 비용 발생
  2. **하이퍼 파라미터의 선택** : 타당성 연구를 하기 전에 데이터의 정보가 알려져 있지 않기 때문에 실제 추정치는 하이퍼 파라미터에 민감하지 않아야 한다.

<br>
<br>


## 5. MLOps Task 3: Rigorous Model Testing Against Overfitting

- **Continuous Integration(CI)** : 소프트웨어 개발 프로세스에서 빠르고(fast) 견고한(robust) 사이클을 실행
  - 소프트웨어가 실제 가동에 들어가기 전에 매번 성공적으로 통과해야 하는 테스트 형식으로 일련의 조건을 신중하게 정의하고 실행
  - 따라서, 시스템의 견고성이 확보되어 갱신중에서도 예기치 않은 코드의 실패를 방지.
- 하지만 MLOps의 경우, 동일한 테스트 케이스를 반복적으로 재사용하는 기존의 방법은 심각한 과적합(overfitting) 위험을 초래하여 테스트 결과를 손상시킬 수 있다.

<br>

### MLOps Challenge

- 새로운 ML 모델의 최종 테스트 단계는 1) 테스트 세트당 한번 만 실행되거나, 2) 개발자에 의해 완전히 obfuscated 한다.
  - 하지만, 현실에서 비현실적인 경우가 많다.

<br>

### A Data Quality View

- production에서 ML 모델을 지속적으로 테스트하고 통합하는 것을 채택하는 데는 2가지 이슈가 있다.
1. ML 작업 및 모데의 특성상 테스트 결과는 무작위
   - 통계 이론에서 알려진 잘 확립된 concentration bound를 사용하여 해결
2. 테스트 결과를 개발자에게 공개하면 과적합이 일어남
   - 개발자에 대한 피드백과 함께 동일한 테스트 세트를 여러 번 재사용하게 한다.
   - 한정된 데이터 집합의 일반화 특성에 대해 최소한의 신뢰도를 요구하면 실제로 재사용할 수 있는 횟수가 제한

<br>

### Limitations

- 첫번째로, 개발자가 숨겨진 테스트 세트에 과적합하는 것을 목표로 할 때의 한계
- 두번째로, concept shift를 처리할 능력이 부족하다는 한계

<br>
<br>

## 6. MLOps Task 4: Efficient Continuous Quality Testing

- DevOps는 빠른 사이클을 수행하고 변화에 신속하게 적응함으로써 시스템의 견고성을 지속적으로 보장할 수 있는 능력이다.
- 많은 MLOps 실무자들이 직면한 과제 중 하나는 모델이 실제 가동 중일 때 데이터 배포의 변화에 대처해야 한다는 것이다.
  - 새로운 실가동 데이터가 알 수 없는 분포에서 오는 경우, 학습된 모델 성능이 더 이상 향상되지 않을 수 있다.

<br>

### MLOps Challenge

- 라벨이 부착되지 않은 production 데이터 스트림이 주어질 경우 가장 성능이 좋은 모델을 선택하는 것이 과제이다.
- MLOps 관점에서, 이러한 구별을 하기 위해 필요한 라벨의 양을 최소한으로 억제하는 것이 목표이다.

<br>

### A Data Quality View

- Concept shift는 데이터의 적시성(timeliness) 속성에 따라 이루어진다.
  - 사용 가능한 사전훈련 모델(pre-trained model)은 시간 경과에 따른 훈련 데이터의 변화를 캡쳐하기 위한 것이다. 
- 충분한 크기의 테스트 세트에 대한 라벨을 수집하는 것은 비용이 많이 든다. 그 이유는 사람이 직접 주석을 달아야 하기 때문이다.
- 따라서, 필요한 최소한의 라벨링 노력으로 현재 가장 적합한 모델을 선택
- 그리고, 불완전한 테스트 데이터에 의존하는 문제를 해결해야 한다.

<br>
<br>
<br>
<br>

## References

[^1]: [Best Practices for Dealing With Concept Drift](https://neptune.ai/blog/concept-drift-best-practices)
