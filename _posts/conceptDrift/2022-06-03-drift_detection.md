---
layout: single
title: "Concept Drift Detection Method 정리"
excerpt: "Concept Drift는 시간이 지남에 따라 데이터의 통계적인 특성이 변하는 것을 말합니다. 이에 학습된 모델은 자연스레 성능이 떨어지기 때문에 drift를 잘 감지해야 합니다. 감지하는 방법들이 무엇이 있는지 살펴봅니다."
categories: conceptDrift
tag : [mlops, concept drift, 컨셉 드리프트, data drift, drift, detection, method, window, error, drift detection method, ddm, early drift detection method, eddm, adaptive windowing, adwin, hddm, hoeffding, bernstein, fhddm, 리뷰, 설명, 정리, 논문]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-06-06
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
- concept drift detection은 두 가지 접근법으로 나뉜다. (그러나 두 접근 방법 모두 error-based 이다.)
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
- DDM은 데이터 스트림이 베르누이 분포(Bernoulli distribution)로부터 생성된다고 가정한다.

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

![image](https://user-images.githubusercontent.com/78655692/172005456-669d0222-c340-487f-9985-b5250bc4da21.png) <br> 이미지출처 [^9]

<br>

### 1. (ADWIN) Adaptive WINdowing

- ADWIN은 time window $w$가 있는데, 만약 내용의 변화가 보이지 않는다면 동적으로 window $w$ 크기를 증가하고, 만약 변화가 감지(detect)되면 윈도우 $w$ 크기를 축소한다.
  - **윈도우(window)** : 시계열 데이터가 있을 때 창같은 고정된 크기를 생성해 다음 시간 데이터를 예측
  - **슬라이딩 윈도우(sliding window)** : 고정 사이즈의 윈도우가 이동하면서 윈도우 내에 있는 데이터를 읽는 방법

    <img src='https://user-images.githubusercontent.com/78655692/171905685-4200eabb-ac74-4b23-ab11-74c9311efe7a.png' width=550> <br> 이미지출처 [^4]

<br>

- 이 알고리즘은 뚜렷한(distinct) 평균을 나타내는 $w$의 2개의 하위 윈도우(sub window)를 찾으려고 한다.
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
- 만약 찾았고, 해당 기대값이 다르다면, 윈도우의 오래된 부분은 데이터가 실제보다 분포가 다르다는 의미이므로 삭제한다. [^5]

  <img src='https://user-images.githubusercontent.com/78655692/171906953-3a68ef35-44b9-4dcc-a0f0-4ca19d219b74.png' width=550>

  <br>


<br>

- **Pros** [^6]
  - FP(false positive)와 FN(false negative) 비율의 bound 형태로 성능에 대한 엄격한 보증을 제공한다.
  - ADWIN은 abrupt drift일 때 좋은 성능을 낸다.
- **Cons** [^6]
  - $\hat \mu_{w_0} \ge \hat \mu_{w_1}$ 일 때, 에러의 평균은 최근 윈도우에서 감소했는데, 이는 learner가 성능을 향상시켰다는 의미이다. 이 경우, ADWIN은 이런 변화를 drift로 잘못 고려할 수 있다. 
  - 데이터 스트림 분포가 안정적일 때 큰 위도우 크기를 저장해야 한다.
  - 오직 평균만 사용하여 변화를 특성화(characterize)한다.
  - 상당한 메모리 사용량이 요구된다.

<br>
<br>

### 2. (SeqDrift) Sequential Hypothesis Testing Drift Detector [^8]

- 두개의 sliding window는 샘플의 평균을 계산하는데 사용된다.
- 두 개의 샘플 평균의 차이는 **번스타인 부등식(Bernstein inequality)** statistical test에 의해 평가된다.
  - **Bernstein inequality** : $P(\vert \bar X_i-\mu \vert > \epsilon)$ $\le 2e^{(\frac{-n\epsilon^2}{2\hat \alpha^2+\frac{2}{3}\epsilon (b-a)})}$
- 이 부등식은 실제 평균값(true mean)과 샘플 평균값 사이의 차이에 대한 엄격한 경계(bound)를 제공한다.
- 만약 이 차이가 임계값(threshold)보다 크면, 오래된 부분(older instance)은 버려진다.
- 그렇지 않으면 오래된 윈도우는 새로운 인스턴스를 받아들인다.
  - left 저장소에 저장한다.
  - 새로 들어오는 데이터를 right 저장소에 저장한다.

<br>

- **Pros**
  - cut을 위한 이전 블록 경계를 재검사하지 않고, 새로 도착한 블록과 이전에 도착한 블록의 모음 사이의 경계만 검사한다.
    - 그래서 OnePassSampler는 컷을 검색할 때 메모리 버퍼를 한 번에 통과하기 때문에 붙여진 이름이다.
  - 평균들을 평가하는 데 효율적인 배열 구조에 기반한 랜덤 샘플링을 이용하기 대문에 계산 자원을 줄일 수 있다.
- **Cons**
  - 샘플의 분산을 사용하고 샘플 데이터는 정규 분포를 따른다고 가정하는데, 이는 현실 세계에서 너무 제한적일 수 있다. [^10]
  - 번스타인 부등식은 분산 파라미터값이 필요하다는 점에서 보수적(conservative)이라 할 수 있다. 이는 detection delay가 길어지고 정확도가 떨어질 수 있다.
  - ADWIN과 마찬가지로 SeqDrift 또한 메모리가 많이 필요하다.

<br>
<br>

### 3. (HDDMs) Drift Detection methods based on Hoeffding's Bound

- $HDDMs$은 $HDDM_{A-test}$와 $HDDM_{W-test}$가 있다.
  - $HDDM_{A-test}$ : 이동 평균(moving average)를 이용하여 drift를 detect
  - $HDDM_{W-test}$ : 가중 이동 평균(weighted moving average)를 이용하여 drift를 detect
- 모두 Hoeffding 부등식을 이용하여 상한선을 잡아 평균 사이의 차이의 수준을 정한다.
  - **Hoeffding 부등식** : 변수들의 관찰 평균값($\nu$)이 기대치($\mu$)에서 벗어날 확률을 계산 [^12]
    - $P[\vert \nu - \mu \vert > \epsilon] \le 2e^{-2\epsilon^2N}$
  - 이 부등식은 샘플 데이터가 임의로 선택되었을 때만 적용된다.


<br>

- **Pros**
  - DDM과는 달리 HDDM은 데이터 스트림에 대한 어떤 가정도 하지 않는다.
- **Cons**
  - $HDDM_{A-test}$은 abrupt drift를 detect할 때 유용 
  - $HDDM_{M-test}$은 gradual drift를 detect할 때 유용
  - 즉, 이것은 각각 다르게 사용해야 된다는 점에서 단점이 될 수 있다.

<br>
<br>

### 4. (FHDDM) Fast Hoeffding Drift Detection Method [^11]

- 슬라이딩 윈도우(sliding window) 메커니즘과 Hoeffding 부등식에 기반한다.
- 윈도우 크기 n을 분류 결과에 슬라이드한다.
  - 만약 예측이 맞았다면 숫자 1을 삽입하고, 틀렸다면 숫자 0을 삽입한다.
- 입력 데이터가 들어옴에 따라, 시간 $t$에서 슬라이딩 윈도우에서 $p_t^1$을 관찰할 확률을 계산하고, 1초동안 발생하는 최대 확률 $p_{max}^1$를 유지한다.
- $p_t^1$이 $p_{max}^1$보다 크다면 그 값을 $p_{max}^1$으로 업데이트한다.
  - $if p_{max}^1< p_t^1\Rightarrow $ $p_t^1\rightarrow p_{max}^1$
- $\nabla p = p_{max}^1 - p_t^1 \ge \epsilon_d \Rightarrow Dirft := True$
  - $\epsilon_d=\sqrt{\frac{1}{2n}ln{\frac{1}{\delta}}}$

<br>

![image](https://user-images.githubusercontent.com/78655692/172021181-5a3ca703-981d-4aaa-959d-77782f4f56b4.png) <br> 이미지 출처 [^11]

- 위 그림을 예시로 설명해본다.
- $n$=10, $\delta$=0.2라 하면, 위 정의대로 $\epsilon_d$=0.28이 된다.
- 위 예제에서 real drift가 12번째 인스턴스 직후 발생했다. 
- 윈도우에 $p_{max}^1$가 0으로 삽입된다.
  - 따라서, $p_{10}^1$는 0.7이 된다.
- 11번째부터 예측 정확도가 점점 떨어지는 걸 볼 수 있다.
- 18번째부터 $p_{max}^1$와 $p_t^1$의 차이가 $\epsilon_d$ 보다 커진 것을 알 수 있으므로(0.3>0.28) FHDDM 알고리즘은 drift을 위한 alarm 수준에 이른다.

<br>

- **Pros**
  - 지연(delay)를 다른 윈도우 기반 알고리즘 대비 대폭 증가시켰다.
  - SOTA 정확도를 달성했다. 
- **Cons**
  - 아직 메모리 사용량이 많은 편에 속한다.
  - 슬라이딩 윈도우의 사이즈 크기가 고정되어 있어 상황에 유동적이지 못할 수 있다.



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
[^9]: 논문(thesis of pohang university) : Concept drift detection using SGT and trace clustering in process mining
[^10]: [Pesaranghader, Ali, Herna Viktor, and Eric Paquet. "Reservoir of diverse adaptive learners and stacking fast hoeffding drift detection methods for evolving data streams." Machine Learning 107.11 (2018): 1711-1743.](https://link.springer.com/article/10.1007/s10994-018-5719-z)
[^11]: [Pesaranghader, Ali, and Herna L. Viktor. "Fast hoeffding drift detection method for evolving data streams." Joint European conference on machine learning and knowledge discovery in databases. Springer, Cham, 2016.](https://link.springer.com/chapter/10.1007/978-3-319-46227-1_7)
[^12]: [Learning From Data: 통계 학습 이론 정리](https://jmk.pe.kr/media/attachments/f9fa756278afbeb6bd734f9de99f1c4a/learning-from-data-learning-theory-kr_WuzeGro.pdf)

