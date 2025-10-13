---
layout: single
title: "논문 리뷰: Squeeze-and-Excitation Networks (SENet)"
excerpt: "SENet은 Squeeze와 Excitation이라는 연산작업으로 정보의 압축하고 재조정하여 ILSVRC 2017에서 우승합니다."
categories: paper
tags : [senet, cnn, squeeze, excitation, network, embedding, feature recalibration, local receptive field, SE block, global, 논문, 리뷰, 정리, 후기, design, 설명, layer, 딥러닝, cv, 컴퓨티 비전, paper]
toc: true
toc_sticky: false
sidebar_main: false

last_modified_at: 2022-04-15
---

![image](https://user-images.githubusercontent.com/78655692/163437572-a7a7d129-f67a-4944-a370-f528e6534d76.png)

"Squeeze-and-Excitation Networks" 논문을 개인 공부 및 리뷰를 위해 쓴 글입니다. <br>
논문 링크 : <https://arxiv.org/abs/1709.01507v4>
{: .notice--info}

<br>
<br>

## 1. Introduction

- **컨볼루션 신경망(Convolutional neural network; CNN)**은 다양한 시각적 작업을 처리하는 데 효과적인 모델로 입증되었다.
- 각 컨볼루션 레이어에 대해서, 입력 채널(input channel)을 따라 로컬 공간 연결 패턴(local spatial connectivity pattern)을 표현하기 위해 일련의 필터가 학습된다.
- 컨볼루션 필터(convolutional filter)는 로컬 수용 필트(local receptive field) 내에서 공간(spatial) 및 채널별 정보를 통합하여 유익한(informative) 조합이 된다.
- 비선형성(non-linearity)과 다운샘플링(downsampling)으로 맞춰진(interleaved) 일련의(series) 컨볼루션 레이어를 쌓음으로써, CNN은 글로벌 수용 필드(global receptive field)를 강력한 이미지 설명을 해주는 계층적 패턴을 보인다.

<br>

- 최근 연구에서 모델의 성능은 명시적으로 학습 메커니즘을 **임베딩(embedding)**함으로써 향상되었다.
  - **임베딩**은 고차원 벡터를 변환할 수 있는 저차원 공간 [^1]
  - 학습 메커니즘은 추가 supervision없이 공간의 상관관계를 포착하는데 도움을 주는 걸 말한다.
  - **Squeeze-and-Excitation (SE) block** 도입
- 이 논문의 목표는 컨볼루션 특징의 채널들 사이의 명시적으로 상호의존적으로 모델링 함으로써 네트워크의 표현력을 개선하는 것이다.
  - 이것을 달성하기 위해, **특성 재보정(feature recalibration)**을 네트워크에 수행한다.
    - **feature recalibration을 통해 글로벌 정보(global information)를 사용하여 정보 특징을 선택적으로(selectively) 강조하고 덜 유용한 특징을 억제하는 방법이다.**

<br>

![image](https://user-images.githubusercontent.com/78655692/163572418-4da81ce8-5306-4fe4-824c-89d281c2c932.png)

- CNN 네트워크에서 각 컨볼루션 필터(convolution filter)는 특징맵(feature map)의 "local"을 학습한다.
- 이것은 **국부수용장(local receptive field)**에 있는 정보들의 조합이다.
  - **수용장(receptive field)**는 출력 레이어의 뉴런 하나에 영향을 미치는 입력 뉴런들의 공간 크기[^3]
- 이 조합들을 activation function에 통과시켜 비선형적인 관계를 추론하고 pooling과 같은 방법을 사용해 큰 특징들을 작게 만들어 한 번에 볼 수 있게 한다. [^2]

- (Fig. 1)은 **SE block**의 구조를 말한다.
  - $F_{tr}:X\to U$
  - $X\in \mathbb{R}^{H^{'} \times W^{'} \times C^{'}}$
  - $U\in \mathbb{R}^{H \times W \times C}$
- 특성 $U$는 **squeeze**을 먼저 통과한다.
  - **squeeze operation**는 공간 차원 $H\times W$에 걸친 특징 맵을 집계하여 **channel descriptor**를 생성해준다.
  - 즉, **squeeze operation**은 각 채널들의 중요한 정보만 추출해서 가져가겠다는 의미.
  - descriptor는 채널별 특징 응답을 글로벌 분포로 임베드하여, 정보를 global receptive field에서 낮은 층으로 영향을 준다.
- **excitation operation**은 각 채널에 대해 학습된 샘플 특정 활성화가 각 채널의 excitation을 제어하는 역할.
  - 즉, **excitation operation**은 채널 간 의존성(dependence)을 계산
- 그런 다음 특징 맵 $U$는 가중치를 조정하여 SE block의 출력을 생성한 다음 바로 다음 층으로 직접 보내진다.

<br>
<br>

## 2. Related Work 

- **VGGNet**과 **Inception 모델**은 증가하는 층의 깊이를 보여주었다.
- **BN(Batch normalization)**은 입력을 조정하기 위해 삽입함으로써, 그레이디언트 전파를 개선하여 프로세스를 안정화시켰다.
- **ResNet**은 identity기반 skip connection를 사용하여 심층망을 학습하는 효과를 보여주었다.
- **Hightway network**는 shortcut connection을 조정하기 위해 gating mechanism을 사용했다.

<br>

- **명시적 동적 모델(explicit dynamic model)**은 전역 정보를 사용하는 채널 간 비선형 의존성이 학습 프로세스를 용이하게 해줄 것이다.

<br>
<br>

## 3. Squeeze-and-Excitation Blocks

- **SE block**은 어느 모델이든 구축할 수 있다.
- $F_{tr}:X\to U$, $X\in \mathbb{R}^{H^{'} \times W^{'} \times C^{'}}$, $U\in \mathbb{R}^{H \times W \times C}$
- $F_{tr}$ : Convolution layer
- $V=[v_1,v_2,...,v_c]$ : learned set of filter kernels
  - $v_c$는 c번째 필터의 파라미터를 의미
- $U=[u_1,u_2,...,u_c]$ : $F_{tr}$의 출력
  - $u_c=v_c\*X= \sum_{s=1}^{C^{'}}v_c^s*x^s$
    - $*$ : convolution
  - 출력은 모든 채널의 합산으로 생성되므로 채널 종속성은 $V_c$에 implicitly 내장된다.
  - 하지만, 이러한 종속성은 필터에 의해 캡처된 공간 상관과 얽혀 있다.

- **SE block**은 네트워크가 정보 특징의 민감도를 높여 후속 변환(subsequent transformation)에 의해 이용되고, 덜 유용한 특징은 억제하는 것이 목표이다.
  - 채널 상호의존성을 명시적으로 모델링하여 필터 응답이 다음 변환으로 가기 전에, squeeze와 excitation 두 단계로 재보정한다.

<br>

### 3.1. Squeeze: GLobal Information Embedding

- 학습된 각 필터는 local receptive field에서 작동하며, 결과적으로 변환 출력 $U$의 각 유닛은 이 영역 밖의 상황 정보를 이용할 수 없다.
- 이 문제를 완화하기 위해서, **전역 공간 정보(global spatial information)**를 채널 설명자(channel descriptor)로 압축(squeeze)한다.
  - 방법으로 **global average pooling**을 사용하여 채널별 통계를 생성한다.
- $z_c=F_{sq}(u_c)=\frac{1}{H\times W}\sum_{i=1}^H\sum_{j=1}^Wu_c(i,j)$

<br>

### 3.2 Excitation: Adaptive Recalibration

- 이제는 채널별 의존성을 capture하는 일이 남았다.
- 이를 만족하기 위해 함수는 다음의 2가지 기준을 충족해야 된다.
  1. 채널 간의 비선형 상호 작용을 학습할 수 있을 정도로 유연해야 한다.
  2. 여러 채널이 강조돼야 하기 때문에 비선형 관계를 학습해야 한다.
- 이 기준을 만족하기 위해 시그모이드(sigmoid) 활성화 함수를 도입한다.
  - $s=F_{ex}(z,W)=\sigma(g(z,W))=\sigma(W_2\delta(W_1z))$
    - $\delta$ : ReLU
    - $W_1\in \mathbb{R}^{\frac{C}{r}\times C}$ : fully-connected layer
    - $W_2\in \mathbb{R}^{C\times \frac{C}{r}}$ : fully-connected layer

  <img src='https://user-images.githubusercontent.com/78655692/163590060-5e447a08-3be8-40b6-ba17-edf19c3cd76d.png' width=500> <br> 이미지출처[^4]


- 블록의 최종 출력은 활성화와 함께 변환 출력 $U$의 크기를 조정하여 얻는다.
  - $\tilde x_c = F_{scale}(u_c,s_c)=s_c\cdot u_c$
    - $\tilde X = [\tilde x_1, \tilde x_2,...,\tilde x_c]$
    - $F_{scale}(u_c,s_c)$ : $u_c\in \mathbb{R}^{H\times W}$와 스칼라 $s_c$간 채널별 곱셈

<br>

### 3.3. Examples: SE-Inception and SE-ResNet

<img src='https://user-images.githubusercontent.com/78655692/163589747-6cc364eb-b0e1-4360-9ed6-11d662a352aa.png' width=550>

<img src='https://user-images.githubusercontent.com/78655692/163589802-a160e0d1-95f1-4ec6-8797-c8b04868efa8.png' width=550>

<br>
<br>

## 4. Model and Computational Complexity

- 이 부분은 생략

<br>

## 5. Implementation

![image](https://user-images.githubusercontent.com/78655692/163590437-38abe3c2-d1ec-4093-af20-641bbabafd3d.png)

<br>

![image](https://user-images.githubusercontent.com/78655692/163590472-631d6757-f81a-44ef-a583-fe9319924c3f.png)


<br>
<br>
<br>
<br>

## References

[^1]: [Embeddings](https://developers.google.com/machine-learning/crash-course/embeddings/video-lecture?hl=ko)
[^2]: [SENet(Squeeze and excitation networks) - Jaeyun's Blog](https://jayhey.github.io/deep%20learning/2018/07/18/SENet/)
[^3]: [receptive field(수용영역, 수용장)과 dilated convolution(팽창된 컨볼루션)](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=sogangori&logNo=220952339643)
[^4]: [SENet(Squeeze and excitation networks) - Jaeyun's Blog](https://jayhey.github.io/deep%20learning/2018/07/18/SENet/)