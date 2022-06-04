---
layout: single
title: "[MLOps] Concept Drift Detection Method 정리"
excerpt: "Concept Drift는 시간이 지남에 따라 데이터의 통계적인 특성이 변하는 것을 말합니다. 이에 학습된 모델은 자연스레 성능이 떨어지기 때문에 drift를 잘 감지해야 합니다. 감지하는 방법들이 무엇이 있는지 살펴봅니다."
categories: mlops
tag : [mlops, concept drift, 컨셉 드리프트, data drift, drift, detection, method, window, error, drift detection method, ddm, early drift detection method, eddm, adaptive windowing, adwin, 리뷰, 설명, 정리, 논문]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-06-04
---

<img align='right' width='250' height='150' src='https://user-images.githubusercontent.com/78655692/171929140-bed18224-f05a-4a1c-bf18-a2607b8412e9.png'> 
Concept Drift는 시간이 지남에 따라 데이터의 통계적인 특성이 변하는 것을 말합니다. 이에 학습된 모델은 자연스레 성능이 떨어지기 때문에 drift를 잘 감지해야 합니다. 감지하는 방법들이 무엇이 있는지 살펴봅니다. <br> 이미지출처 [^7] 
{: .notice--info}

<br>
<br>
<br>
<br>

## Concept Drift 정의

- **Concept Drift**는 데이터 스트림의 통계적인 분포가 시간이 지남에 따라 바뀌는 현상을 말한다.
  - **스트림(stream)** : 시간이 지남에 따라 사용할 수 있게 되는 일련의 데이터 요소
- 기존의 데이터로 학습한 모델은 concept drift가 일어난 데이터에 대해 잘 대응하지 못하고, 모델의 정확도 하락을 야기해 잘못된 예측이나 의사결정을 할 수 있다.

<br>
<br>

## Types of Concept Drift

<img src='https://user-images.githubusercontent.com/78655692/171870491-1f46f984-3b6e-4eeb-8640-f7b6748e64d1.png' width=600> <br> 이미지출처 [^2]

- change concept drift type : 시간 경과에 따른 데이터의 구성 패턴 변화를 의미한다.
- 파란색을 s1, 빨간색을 s2라 할 때,
- **sudden drift** : s1이 갑자기 s2로 바뀐 현상
- **gradual drift** : 시간이 지날수록  s1로부터의 샘플링 확률은 감소하고  s2로부터의 샘플링 확률은 높아지는 현상
- **incremental drift** : 데이터의 변화가 매우 적기 때문에, 긴 시간 동안 바라만 봐야 인지할 수 있는 현상
- **reoccurring context** : s1이 s2에 의해 안 보이다가 시간이 지나 다시 나타나지는 현상

<br>
<br>

## Concept Drift Detection

- 본 글에서는 concept drift에 대해 자세히 다루지는 않는다. 대신에 concept drift detection에 대해 구체적으로 접근해 볼 것이다.
- **concept drift detection** : 데이터 스트림에서 분포의 변화 시점을 감지(detect)하는 알고리즘을 말한다.
  - 대체로 알고리즘들은 시간 경과에 따른 데이터 스트림의 통계치(statistics)를 만들어 변경 시점(change point)를 정의하거나, 구간을 지정한다. [^1]
- concept drift detection은 두 가지 접근법으로 나뉜다.
    1. **statistics-based approaches** : 평균과 표준편차같은 파라미터를 이용해 데이터 스트림의 예측 에러(prediction error)로 drift 여부를  판단한다.
    2. **window-based approaches** : 스트림의 두 개의 window의 예측 에러를 활용한다.

<br>
<br>

## Statistics-based approaches

<br>

### 1. (DDM) Drift detection method [^1]

- 우리 모델의 오류가 관리 상태에 있는지 확인하는 것이다.

<br>

- 입력 데이터의 예측(prediction)에 대한 에러율(error rate)을 monitor한다.
  - **에러율(error rate; $p_n$)** : 1 - 정확도(accuracy) 
  - 각 예측마다 $p_n$은 처음부터 계산되며, 표준 편차 $s_n$은 $\sqrt{p_n(1-p_n)/n}$으로 계산된다.
- $p_n+s_n$ 의 최소 : $p_{min}+s_{min}$
- concept drift의 경고(warning) 수준 : $p_n+s_n>p_{min}+2*s_{min}$ : 
- concept drift가 detect 되었다고 판단, 알람(alarm) 수준 : $p_n+s_n>p_{min}+3*s_{min}$ 

<br>

- **Pros** [^3]
  - DDM은 gradual drift(그러나 느리지 않는), incremental drift, sudden drift 일 때는 좋은 성능을 보여준다.
- **Cons** [^3]
  - graudal drift가 천천히 바뀔 때는 감지를 잘 하지 못한다.
  - 많은 샘플들이 긴 시간 동안 저장되어 저장 공간이 부족할 수 있다.

<br>
<br>

### 2. (EDDM) Early Drift Detection method

<img src='https://user-images.githubusercontent.com/78655692/171878569-2204102d-91de-42a1-a09b-7a350471788e.png' width=600> <br> 이미지 출처 [^3]

- 2개의 연이은(consecutive) 에러의 거리를 측정하는 방법이다.
  - 정확히는 2개 사이의 평균 거리 분포 
- EDDM은 $p_t+s_t>p_{max}+s_{max}$ 일 때 $p_{max}$와 $s_{max}$를 업데이트한다.
- concept drift의 경고(warning) 수준 : $\frac{p_t+2s_t}{p_{max}+s_{max}} < 0.95$
  - 0.95를 보통 $\alpha$라 한다. 
- concept drift가 detect 되었다고 판단, 알람(alarm) 수준 : $\frac{p_t+2s_t}{p_{max}+s_{max}} < 0.90$
  - 0.90을 보통 $\beta$라 한다.

<br>

- **Pros**
  - EDDM은 gradual drift를 잘 확인할 수 있는 DDM의 수정 버전이다.
- **Cons**
  - $\beta$에 대해 고정 임계값을 사용한다. 임의로 잡았기 때문에 다른 유형의 drift를 효율적으로 검출할 수 없다.

<br>
<br>

## Window-based approaches

### 1. (ADWIN) Adaptive WINdowing

- ADWIN은 time window $w$가 있는데, 만약 내용의 변화가 보이지 않는다면 동적으로 window $w$ 크기를 증가하고, 만약 변화가 감지(detect)되면 윈도우 $w$ 크기를 축소한다.
  - **윈도우(window)** : 시계열 데이터가 있을 때 창같은 고정된 크기를 생성해 다음 시간 데이터를 예측

    <img src='https://user-images.githubusercontent.com/78655692/171905685-4200eabb-ac74-4b23-ab11-74c9311efe7a.png' width=550> <br> 이미지출처 [^4]

<br>

- 이 알고리즘은 뚜렷한(distinct) 평균을 나타내는 $w$의 2개의 하위 윈도우(sub window)를 찾으려고 한다.
- 만약 찾았고, 해당 기대값이 다르다면, 윈도우의 오래된 부분은 데이터가 실제보다 분포가 다르다는 의미이므로 삭제한다. [^5]

  <img src='https://user-images.githubusercontent.com/78655692/171906953-3a68ef35-44b9-4dcc-a0f0-4ca19d219b74.png' width=550>

  <br>

- $w$의 하위 윈도우를 $w_0$, $w_1$이라 하고, 각각 크기를 $n_0$, $n_1$, 즉 $w$의 크기 $n$은 $n=n_0+n_1$이다. [^6]
  - $w_0$ : older instances
  - $w_1$ : recent instances
- $\hat \mu_{w_0}$와 $\hat \mu_{w_1}$을 각각 $w_0$, $w_1$의 평균 값이라 한다.
- $\epsilon_{cut}$을 다음과 같이 정의할 수 있다.
  - $\epsilon_{cut}=\sqrt{\frac{1}{2m}\cdot ln{\frac{4n}{\delta}}}$
    - $m=\frac{2}{1/n_o+1/n_1}$
    - $\delta$ : 사용자 정의 신뢰도 수준 (보통 0.2로 설정)
- 변화가 감지될 때 : $\vert\hat \mu_{w_0} - \hat \mu_{w_1}\vert\ge \epsilon_{cut}$
- 따라서, $\vert\hat \mu_{w_0} - \hat \mu_{w_1}\vert < \epsilon_{cut}$ 될때까지 $w$의 오래된 부분을 버린다.

<br>

- **Pros** [^6]
  - FP(false positive)와 FN(false negative) 비율의 bound 형태로 성능에 대한 엄격한 보증을 제공한다.
  - ADWIN은 abrupt drift일 때 좋은 성능을 낸다.
- **Cons** [^6]
  - $\hat \mu_{w_0} \ge \hat \mu_{w_1}$ 일 때, 에러의 평균은 최근 윈도우에서 감소했는데, 이는 learner가 성능을 향상시켰다는 의미이다. 이 경우, ADWIN은 이런 변화를 drift로 잘못 고려할 수 있다. 

<br>
<br>

### 2. (SeqDrift) Sequential Hypothesis Testing Drift Detector [^8]

- 두개의 sliding window는 샘플의 평균을 계산하는데 사용된다.
- 두 개의 샘플 평균의 차이는 **번스타인 부등식(Bernstein inequality)** statistical test에 의해 평가된다.
  - **Bernstein inequality** : $Pr(\vert \frac{1}{n}\sum_{i=1}^n X_i-E[X]\vert > \epsilon)$ $\le 2exp(\frac{-n\epsilon^2}{2\hat \alpha^2+\frac{2}{3}\epsilon (c-a)})$
- 이 부등식은 실제 평균값(true mean)과 샘플 평균값 사이의 차이에 대한 엄격한 경계(bound)를 제공한다.
- 만약 이 차이가 임계값(threshold)보다 크면, 오래된 부분(older instance)은 버려진다.
- 그렇지 않으면 오래된 윈도우는 새로운 인스턴스를 받아들인다.

<br>
<br>








<br>
<br>
<br>
<br>

## References

[^1]: [Nguyen, Viet An. "Performance evaluation of online learning system based on concept drift adaptation scheme for AMI data processing"](https://library.kaist.ac.kr/search/ctlgSearch/posesn/list.do?qf=text&saveHistory=true&viewQuery=%3Cspan+class%3D%27searched_option%27%3E%EC%A0%84%EC%B2%B4%3Ci+class%3D%27i_bl_right%27%3E%3C%2Fi%3E%3C%2Fspan%3E%3Cstrong%3EPerformance+evaluation+of+online+learning+system+based+on+concept+drift+adaptation+scheme+for+AMI+data+processing%3C%2Fstrong%3E&fq=SEARCH_PROVD_YN%3Ay&advancedForm=true&q=Performance+evaluation+of+online+learning+system+based+on+concept+drift+adaptation+scheme+for+AMI+data+processing&_csrf=19973a3a-06fe-4225-8f9a-ca214380f643)
[^2]: [Lu, Jie, et al. "Learning under concept drift: A review." IEEE Transactions on Knowledge and Data Engineering 31.12 (2018): 2346-2363](https://ieeexplore.ieee.org/abstract/document/8496795)
[^3]: [8 Concept Drift Detection Methods - Danny Geyshis](https://www.aporia.com/blog/concept-drift-detection-methods/)
[^4]: [[시계열] Time Series에 대한 머신러닝(ML) 접근 - 다이엔 스페이스](https://diane-space.tistory.com/316)
[^5]: [Gonçalves Jr, Paulo M., et al. "A comparative study on concept drift detectors." Expert Systems with Applications 41.18 (2014): 8144-8156.](https://www.sciencedirect.com/science/article/pii/S0957417414004175?casa_token=J_t_GmNpmVAAAAAA:q4WVlYJzArjTAlq7NxLQfL0u_j51HL0F0pNkOsrjb-wGPo25EMxqFqC9Qd5USMO0gqxhDZRw3-c)
[^6]: [Khamassi, Imen, et al. "Self-adaptive windowing approach for handling complex concept drift." Cognitive Computation 7.6 (2015): 772-790.](https://link.springer.com/article/10.1007/s12559-015-9341-0)
[^7]: [Machine Learning Concept Drift – What is it and Five Steps to Deal With it](https://www.seldon.io/machine-learning-concept-drift)
[^8]: [Sakthithasan, Sripirakas, Russel Pears, and Yun Sing Koh. "One pass concept change detection for data streams." Pacific-Asia conference on knowledge discovery and data mining. Springer, Berlin, Heidelberg, 2013.](https://link.springer.com/chapter/10.1007/978-3-642-37456-2_39)

