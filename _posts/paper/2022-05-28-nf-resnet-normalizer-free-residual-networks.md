---
layout: single
title: "논문 리뷰: Characterizing signal propagation to close the performance gap in unnormalized resnets (NF-ResNet)"
excerpt: "배치 정규화는 SOTA 이미지 분류기에서 대다수 사용하고 있었습니다. NF-Resnet은 배치 정규화의 단점들을 명시하고 이를 대체해 당시 SOTA인 EfficientNet과 경쟁을 이뤘습니다."
categories: paper
tags : [resnet, residual, batch normalization, 배치 정규화, nfresnet, spp, Scaled Weight Standardization, 논문, 리뷰, 정리, 후기, design, 설명, 딥러닝, cv, 컴퓨티 비전, paper]
toc: true
toc_sticky: false
sidebar_main: false

last_modified_at: 2022-05-29
redirect_from:
  - /paper/NFResnet/
---

![image](https://user-images.githubusercontent.com/78655692/170853996-32fc069f-717c-42e7-a991-152e7b18c0db.png)

"Characterizing signal propagation to close the performance gap in unnormalized resnets" 논문을 개인 공부 및 리뷰를 위해 쓴 글입니다. <br><br> **논문 순서** <br> 1. Batch Normalization Biases Residual Blocks towards the Identity Function in Deep Networks, De and Smith, NeurIPS 2020 <br> **2. Characterizing Signal Propagation to Close the Performance Gap in Unnormalized ResNets, Brock et al., ICLR 2021** <br> 3. High Performance Large-Scale Image Recognition without Normalization, Brock et al., ICMR 2021 <br><br> 논문 링크 : <https://arxiv.org/abs/2101.08692>
{: .notice--info}

<br>
<br>

## 1. Introduction

- 배치 정규화(Batch Normalization)은 딥러닝의 핵심이 되었으며, 거의 모든 SOTA 이미지 분류기에 사용되고 있다.
  - **배치 정규화(Batch Normalization)** : 평균과 분산을 조정하는 과정이 별도의 과정으로 떼어진 것이 아니라, 신경망 안에 포함되어 학습 시 평균과 분산을 조정하는 과정 [^4]
  - 즉, 각 레이어마다 정규화 하는 레이어를 두어, 변형된 분포가 나오지 않도록 조절하게 하는 것
  - 감마(Scale;$\gamma$)와 베타(Shift;$\beta$) 변환을 통해 비선형 성질을 유지하면서 학습될 수 있게 해준다.

    <img src='https://user-images.githubusercontent.com/78655692/170859864-3da7193c-f92f-42e1-9862-486ee1be6dba.png' width=450> <br> 이미지 출처 [^5]

- 다음은 배치 정규화의 pros and cons 이다.

<br>

### Pros

1. loss landscope를 더 매끄럽게 하여 더 큰 학습률로 학습을 가능하게 해준다.
   - 배치 통계의 미니 배치 추정치에서 발생하는 노이즈(noise)는 implicit regularization을 도입한다.

    <img src='https://user-images.githubusercontent.com/78655692/170826892-4a87660f-ef59-498f-9dda-5c53914da8e2.png' width=400> <br> Loss Landscope 이미지 출처 [^1] 
 
1. 배치 정규화는 identity skip connection을 가진 deep residual network에서 초기화(initialization)할 때 좋은 신호 전파(signal propagation)를 보장하여, 깊은 레이어로 resnet을 학습할 수 있게 해준다.

<br>

### Cons

1. 장치(device)당 배치 크기가 너무 작거나 너무 클 때 성능이 저하되는 등, 배치 크기에 따라 동작이 크게 달라지며, training 및 추론 시간(inference time) 모델의 동작 사이에 불일치를 초래한다.

   - 추론 시간(inference time) : 기계 학습 모델이 새로운 데이터를 처리하고 예측을 하는데 걸리는 시간의 양 [^2]

    <img src='https://user-images.githubusercontent.com/78655692/170869410-b8d43fbf-450a-4b8d-9e98-4eb2ea35cc7d.png' width=550> <br> 이미지 출처 [^6]

2. 배치 정규화는 메모리 오버헤드가 추가로 발생할 수 있다.

3. 다른 하드웨어에서 학습된 배치 정규화 모델을 복제(replication)하는 것은 어렵다.

<br>

### Contribution

- 그들은 정규화 레이어없이 깊은 ResNet을 학습할 수 있는 방안을 찾아, SOTA와 대적할 수 있는 test accuracy을 찾는 것이다.
- 그들의 contribution은 다음과 같다.

1. deep residual network에서 forward pass에서 초기화 시 신호 전파를 검사하는 데 도움이 되는 시각화 세트인 신호 전파 플롯(SPP)을 소개한다.
2. ReLU 또는 Swish 활성화 및 Gaussian 가중치를 사용하여 unnormalized ResNets에서 주요 고장(failure) 모드(신호 전파 식별)를 식별한다.
   -  이러한 비선형성의 평균 출력은 양수이기 때문에, 각 채널의 숨겨진 활성화의 제곱 평균은 네트워크 깊이가 증가함에 따라 빠르게 증가한다. 
   - 이를 해결하기 위해, **Scaleed Weight Standardization**을 제안한다.

> Gaussian Distribution = 정규 분포(Normal Distribution)

<br>
<br>

### Alternate normalizers

- unnormalized 네트워크에서, 0으로 초기화된 각 잔차 분기의 끝에 학습 가능한(learnable) 스칼라(scalar)를 도입하여 대체하기도 한다.
- 서로 다른 상황에서 배치 정규화의 한계를 극복하기 위해 다양한 대체 정규화 체계가 제안되었으며, 각각은 hidden activation의 서로 다른 구성 요소에서 작동한다. 
  - LayerNorm(Ba 등, 2016), InstanceNorm(Ulyanov 등, 2016), GroupNorm(Wu & He, 2018) 등이 그 예
  - 이러한 대안은 배치 크기에 대한 의존성을 제거하고 일반적으로 매우 작은 배치 크기에 대해 배치 정규화보다 더 잘 작동하지만, 추론 시간 동안 추가 계산 비용을 도입하는 등 자체적인 한계를 도입하기도 한다. 

<br>
<br>

## 2. Signal Propagation Plots

- **Signal propagation** : 파동이 한 지점에서 다른 지점으로 전파의 이동 [^3]
- random Gaussian inputs 또는 real training samples로 조건화될 때 네트워크 내의 다른 지점에서 hidden activations의 통계를 표시하는 것이 매우 유익하다.
- Signal Propagation Plots (SPPs) 도입하는 이유이다.

![image](https://user-images.githubusercontent.com/78655692/170832140-07b0bb14-cbbc-4147-abfb-01f345870e75.png) <br>

- **Average Channel Squared Mean** : NHW 축에 걸친 평균의 제곱으로 계산한 다음 C 축에 걸쳐 평균을 구한다.
  - 전파가 좋을수록, 각 채널의 평균 활성화가 0에 가까워짐
- **Average Channel Variance** : NHW 축에 대한 채널 분산을 취한 다음 C 축에 대한 평균을 구하여 계산된다.
  - 신호 폭발(explosion) 또는 감쇠(attenuation)를 명확하게 보여줌
- **Residual Average Channel Variance** : 잔차 가지(residual branch)의 레이어가 올바르게 초기화되었는지 여부를 평가하는 데 도움이 된다.

<br>
<br>

## 3. Normalizer-Free Resnets (NF-RESNETS)

<center><img src='https://user-images.githubusercontent.com/78655692/170853972-1dee94f6-2378-44fa-896a-3de219022d9a.png' width=200></center>

- 이제 SPP를 이용하여 신호 전파가 좋고 안정적인 unnormalized resnet을 개발해본다.
- SPP를 통해 확인한 바로는, 표준 초기화의 경우, **배치 정규화**는 각 잔차 블록에 대한 입력을 입력 신호의 표준 편차에 비례하는 인수로 다운스케일링(downscaling;축소)한다. 그리고, 각 잔차 블록은 신호의 분산을 거의 일정한 요인만큼 증가시킨다.
- 이런 효과를 흉내내기 위해서, $x_{l+1}=x_l+\alpha f_l(x_l/\beta_l)$ 형태의 잔차 블록을 사용한다.
  - $x_l$ : $l$번째 잔차 블록에 대한 입력
  - $f_l(\cdot)$ : $l$번째 잔차 가지(residual branch)
    - 잔차 가지에 의해 계산된 함수 $f_l(\cdot)$는 초기화 시 분산 보존으로 매개 변수화된다.
    - $Var(f_l(z))=Var(z)$
    - 이러한 제약을 통해 네트워크의 신호 성장에 대해 추론하고 분산을 분석적으로 추정할 수 있다.
  - $\beta_l$ : $\sqrt{Var(x_l)}$인 고정된 스칼라 값
    - 초기화 시 활성화 $x_l$의 예상 경험적 표준 편차
    - 이렇게 하면 $f_l(\cdot)$에 대한 입력이 단위 분산(unit variance)이 되게 해준다.
  - $\alpha$ : 블록 간의 분산 성장률을 제어하는 스칼라 하이퍼파라미터 값
- $Var(x_l)=Var(x_{l-1}+\alpha^2)$와 초기 값 $Var(x_0)=1$, $\beta=\sqrt{Var(x_l)}$로 설정해 잔차 블록 $l$에서 expected empirical variance를 계산한다.
- normalized ResNet의 신호 분산은 normalized 입력을 수신하는 shortcut convolution으로 인해 각 전이 레이어(transition layer)에서 재설정된다.
  - 이 논문에서는 전이 레이어(transition layer)의 shortcut convolution이 $(x_l/\beta_l)$에서 작동하도록 하여 이 재설정(reset)을 모방한다.
- 이것을 Normalizer-Free ResNet (NF-ResNets)이라 부른다.

<br>

### 4.1 ReLU Activations Induce Mean Shifts

![image](https://user-images.githubusercontent.com/78655692/170851027-c81044fc-c932-402c-a402-bc234cfb47ba.png) <br>

- 위에서 초록색 선이 He 초기화를 이용한 가우시안 가중치로 초기화한 NF-ResNet이다.
- 제곱 채널 평균의 평균 값(Avg Squared Channel Mean)은 깊이에 따라 빠르게 증가하여 평균 채널 분산을 초과하는 큰 값을 달성한다.
  - 이는 서로 다른 훈련 입력에 대한 hidden activation이 강한 상관관계를 갖는 "mean shift"을 나타낸다.
- ReLU 활성화가 제거되면 Avg Squared Channel Mean은 모든 블록 깊이에 대해 0에 가깝게 유지되며 잔차 가지(residual branch)에 대한 경험적 분산은 1을 중심으로 변동한다.
- 결론은, He-초기화된 가중치를 가진 NF-ResNet 모델은 불안정하며, 깊이가 증가함에 따라 훈련하기가 점점 더 어렵다.

<br>

### 4.2 Scaled Weight Standardization

- mean shift 현상을 막고 잔차 가지 $f_l(\cdot)$이 분산을 보존하기 위해, scaled weight standardization을 제안한다.
- $\hat W_{i,j}=\gamma\cdot \frac{W_{i,j}-\mu w_{i,\cdot}}{\sigma w_{i,\cdot}\sqrt{N}}$
  - 평균 $\mu$와 분산 $\sigma$는 컨볼루션 필터의 팬인(fan-in) 정도에 걸쳐 계산된다.
  - $W$ : gaussian 가중치로 초기화
  - $\gamma$ : 고정 상수
- Scaled WS를 적용한 변형의 출력, $z=\hat W g(x)$는 $\mathbb{E}(z_i)=0$을 가져, mean shift를 제거한다.
- Scaled WS는 학습 중에 저렴하고 추론에서 자유롭고, (활성화보다는 매개 변수의 수에 따라) 잘 조정되며, 배치 요소 간의 의존성과 training 및 test 동작의 불일치를 초래하지 않으며, 분산 훈련에서 구현이 다르지 않다.
- 4.1 그리메서 Scaled WS는 초기화시 avg channel squared mean의 성장을 제거한다.

<br>

### Summary of NF-ResNet

1. 계산 후 예상 신호 분산인 $\beta_l^2$를 전파한다.
   - $\beta_l^2$는 각 잔여 블록($\beta_0=1$) 후 $\alpha^2$에 의해 성장.
   - $\beta_l$에 의해 각 잔차 가지(residual branch)에 대한 입력 축소(downscale)
2. 추가로, $\beta_l$에 의한 전환 블록(transition block)에 있는 스킵 경로의 컨볼루션에 대한 입력 축소하고 전환 블록 뒤에 나오는 $\beta_{l+1}=1+\alpha^2$를 재조정
3. 모든 컨볼루션 레이어에 Scaled WS를 사용하여 활성화 함수 g(x)에 특정한 이득(gain)을 계산한다.

<br>
<br>

## 5. Experiments

- 다음은 각 ResNet의 변형들에 대한 정확도를 비교한 결과이다.

![image](https://user-images.githubusercontent.com/78655692/170852298-3f2eda75-b42c-46f6-9efa-199dbe1a472d.png)

<br>

- 배치 정규화의 한계로 장치당 배치 크기가 작을 때 성능이 하락한다는 것이다.
- 다음은 배치 크기에 따른 NF-ResNet과 BN-ReseNet의 성능 비교이다.

![image](https://user-images.githubusercontent.com/78655692/170852344-401bf376-b22a-470f-af93-d5f69b5aaa36.png)

<br>

- 다음 그림은 다양한 FLOP budget 범위에서, NF-Nesnet은 ImageNet의 SOTA EfficientNets와 경쟁력 있는 성능을 달성한 것을 보여준다.

<img src='https://user-images.githubusercontent.com/78655692/170852401-9c481fbf-1cfe-432b-a41f-b53cff578e7e.png' width=400>




<br>
<br>
<br>
<br>

## references

[^1]: [Visualizing the Loss Landscape of Neural Nets - Seongkyun Han's blog](https://seongkyun.github.io/papers/2019/02/21/Vis_Loss_NN/)
[^2]: [What is inference time in deep learning? - Quora](https://www.quora.com/What-is-inference-time-in-deep-learning)
[^3]: [What is Signal Propagation - IGI Global](https://www.igi-global.com/dictionary/a-review-of-wireless-positioning-from-past-and-current-to-emerging-technologies/100209)
[^4]: [[Deep Learning] Batch Normalization (배치 정규화) - Enough is not enough](https://eehoeskrap.tistory.com/430)
[^5]: [Batch normalization Accelerating deep network training by reducing internal covariate shift](http://proceedings.mlr.press/v37/ioffe15.html)
[^6]: [Inference: The Next Step in GPU-Accelerated Deep Learning](https://developer.nvidia.com/blog/inference-next-step-gpu-accelerated-deep-learning/)
