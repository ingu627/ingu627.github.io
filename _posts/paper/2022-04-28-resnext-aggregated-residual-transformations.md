---
layout: single
title: "논문 리뷰: Aggregated Residual Transformations for Deep Neural Networks (ResNeXt)"
excerpt: "ResNeXt는 ResNet 성능을 한 단계 향상시켜 ILSVRC 2016 대회에서 2등을 차지한 모델입니다."
categories: paper
tags : [resnext, residual, vggnet, inception, cardinality, depth, 딥러닝, cv, block, 리뷰, 설명, 란, grouped convolution, flops, 논문, 컴퓨티 비전, 정리, paper]
toc: true
toc_sticky: false
sidebar_main: false

last_modified_at: 2022-04-28
redirect_from:
  - /paper/ResNext/
---

![image](https://user-images.githubusercontent.com/78655692/165512958-0a7ae7ff-cd38-4005-b665-a6dab30039df.png)

"Aggregated Residual Transformations for Deep Neural Networks" 논문을 개인 공부 및 리뷰를 위해 쓴 글입니다. <br>
논문 링크 : <https://arxiv.org/abs/1611.05431>
{: .notice--info}

<br>
<br>

## 1. Introduction

- Visual Recognition 연구는 "feature engineering"에서 "network engineering"으로 바뀌고 있다.
- 하지만, 레이어가 많아질 수록, 하이퍼파라미터(width, filter size, stride 등)의 수는 증가하여 architecture 설계는 점점 더 어려워진다.
- **VGGNet**은 간단하지는 않지만, 같은 형태의 블록을 쌓음으로써 레이어를 깊게 쌓을 수 있다.
  - 이 전략은 ResNet 모델을 이어받아 같은 토폴로지 모델을 쌓는 ResNeXt로 발전한다.
- **인셉션(Inception)** 모델의 주요 특성으로 *split-transform-merge*가 있다.
  - 입력은 몇 개의 저차원 임베딩(1x1 conv)으로 분할(split)된다.
  - 특정 필터셋(3x3, 5x5)에 의해 변환(transform)된다.
  - 연결(concatenate)에 의해 병합(merge)친다.
  - 다시 말해, Conv 레이어를 분할해서 연산을 진행한 후, 서로 다른 가중치 $W$를 구한 뒤 합친다.
- **ResNeXt**는 VGG/ResNet의 반복 계층 전략을 채택하는 동시에 **카디널리티(cardinality)**방법을 이용한 쉽고(easy) 확장가능한(extensible) 방식인 **split-transform-merge** 전략을 활용한다.
  - 각각은 저차원 임베딩에서 변환을 수행하며, 각 변환은 합산으로 집계된다.
  - 집계될 변환은 모두 동일한 토폴로지 처리 계층이다.
  - **카디널리티(cardinality)** : path를 결정하는 변환 그룹의 크기
  - **깊이(depth)** : 각 그룹 당 가지고 있는 채널 수

<br>
<br>

![image](https://user-images.githubusercontent.com/78655692/165716945-004e4a6a-5fc7-4e12-b3b4-d0b5a73499b4.png)

- 위의 그림의 정보는 다음과 같다.
  - **cardinality** : 32
  - **depth** : 4
  - **block** : 3

![image](https://user-images.githubusercontent.com/78655692/165717848-71632b0f-ac53-4b6a-9117-309a63cb0e3b.png)

- 위 3가지 ResNeXt의 building block는 모두 동일하다.
- (a) : cardinality가 32, depth가 4(=채널수)로 병렬 실행된 후 합쳐진다.
- (b) : cardinality가 32, depth가 4(=채널수)로 병렬 실행된 후 연결(concatenate)하여 1x1 conv 레이어를 연산한다.
- (c) : **grouped convolution**을 실행한다.

<br>
<br>

### Grouped convolution

<img src='https://user-images.githubusercontent.com/78655692/165738913-e461bbf5-fce4-4fee-8122-46cbeca6d143.png' width=650>

- **Grouped convolution**은 컨볼루션 그룹(레이어당 여러 커널)을 사용하여 레이어당 여러 채널의 출력을 생성한다.
- ResNeXt에서 이 모듈을 사용하면 분류 정확도를 향상시킬 수 있다.

<br>
<br>

## 2. ResNeXt Architecture

<img src='https://user-images.githubusercontent.com/78655692/165744729-90f91c27-8f8a-45f1-b173-1660aa51e843.png' width=500>

- 다음은 ResNet-50과 비교한 ResNeXt-50 구조이다.
- 이 구조는 2개의 규칙이 있다.
  1. 같은 크기의 공간 맵(spatial map)을 만드는 경우 블록(block)은 동일한 하이퍼파라미터(ex. width, filter size)를 공유한다.
  2. 공간 맵이 2의 인수로 downsample될 때마다 블록의 width는 2의 인수로 곱해진다.
  - 이 규칙은 FLOPs 측면에서 계산 복잡성이 모든 블록에 대해 거의 동일하다.
  - **FLOPs** : 초당 부동소수점 연산 [^1].
  - 딥러닝에서 FLOPs는 단위 시간이 아닌 절대적인 연산량(덧셈, 곱셈, 나눗셈 등)의 횟수를 지칭 [^2]

<br>

![image](https://user-images.githubusercontent.com/78655692/165746546-54df9ea5-eb9a-49f8-9a14-5ce39a5de5f1.png)

- 기본 블록에서 2개의 conv 레이어의 깊이는 2였다.
- 하지만, 깊이가 2가 되면, grouped convolution을 사용할 수 없으므로, 깊이가 최소 3이상이여야 된다는 것을 의미한다.

<br>
<br>

## 3. Implementation details

<img src='https://user-images.githubusercontent.com/78655692/165747721-40bb954f-43a7-4f20-b7c1-f8d1e19e8ad3.png' width=450>

- 위의 결과는 cardinality가 1부터 32까지 증가했을 때, top-1 error가 점차 줄어드는 것을 알 수 있다.
  - ResNeXt50 : 23.9% -> 22.2%
  - ResNeXt101 : 22.0% -> 21.2%

<br>

<img src='https://user-images.githubusercontent.com/78655692/165747834-9c4f35be-27ce-4543-bb23-8061b77b36ce.png' width=450>

- 위의 결과는 cardinality, deeper, wider를 비교했다.
- 먼저 200층까지 깊게(deeper) 만들었다. -> ResNet-200
- 그리고 병목 너비(bottleneck width)를 넓게 만들었다. -> ResNet-101, wider
- 마지막으로, cardinality를 증가시켜 보았다. -> ResNeXt-101
- 그 결과, cardinality를 증가시킨 것이 deeper나 wider보다 에러율이 작았다.
  - 20.4(increasing cardinality) > 21.7(deeper) or 21.3(wider)



<br>
<br>
<br>
<br>

## References

[^1]: [플롭스 - 위키백과](https://ko.wikipedia.org/wiki/%ED%94%8C%EB%A1%AD%EC%8A%A4)
[^2]: [FLOPS (FLoating point OPerationS)-플롭스 - 홍러닝](https://hongl.tistory.com/31)




