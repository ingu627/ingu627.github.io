---
layout: single
title: "CS231n 강의 3-2: 최적화 알고리즘 비교 & 실전 팁"
excerpt: "본 글은 2021년 4월에 강의한 스탠포드 대학의 Convolutional Neural Networks for Visual Recognition 2021년 강의를 듣고 정리한 내용입니다. Lecture3 옵티마이저에 대해 정리했습니다."
categories: cs231n
tags: [이미지, cnn, cs231n, 리뷰, 정리, 요약, 최적화, optimization, loss, 기울기, gradient, 미분, 설명, 경사하강법, gradient descent, 수렴, step, sgd, stochastic gradient descent, 정의, 란, 미니배치, 딥러닝, 머신러닝, 배치, 의미]
toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2022-04-24
---

<img align='right' width='400' src='https://user-images.githubusercontent.com/78655692/164591233-fbae4704-a1e2-4394-bc36-bdeae75c879b.png'>
본 글은 2021년 4월에 강의한 스탠포드 대학의 "Convolutional Neural Networks for Visual Recognition" 2021년 강의를 듣고 정리한 내용입니다. <br> 개인 공부 목적으로 작성되었으며, 설명이 맞지 않거나 글 오타가 있으면 알려주시길 바랍니다.
{: .notice--info}

원본 링크 : [cs231n.stanford.edu](http://cs231n.stanford.edu/)<br> 한글 번역 링크 : [aikorea.org - cs231n](http://aikorea.org/cs231n/) <br> 강의 링크 : [youtube - 2017 Spring (English)](https://www.youtube.com/playlist?list=PL3FW7Lu3i5JvHM8ljYj-zLfQRF3EO8sYv)
{: .notice--warning}

<br>
<br>
<br>

## Optimization

<img src='https://user-images.githubusercontent.com/78655692/164610220-db94ac17-560c-45b2-8719-ea18f43ebf81.png' width=500>

- 우리는 어떻게 해야 실제 loss를 줄일 수 있는 w를 찾을 수 있을까?
- 그림과 같이 골짜기의 밑바닥을 찾아야 한다.
  - 여기서 loss는 위치의 **높이**에 해당한다.
  - 높이는 w의 값에 따라 변한다.

<br>
<br>

### 1. Random Search (Bad idea)

- 단순한 방법으로 무작위 탐색(random search)이 있다.
- 임의로 샘플링한 $W$들을 모아놓고 loss를 계산해 어떤 $W$가 좋은지 찾는 것이다.
- 하지만, 굉장히 좋지 않은 방법이므로 추천하지 않는다.

<br>
<br>

### 2. Follow the slope

- 두 발로 땅의 경사를 느끼고, 어느 방향으로 내려가야 할지 판단한다.
- 그 방향으로 한발자국 내딛고, 다시 두발로 느끼는 방향을 찾는다.
- 구체적으로, 임의의 $W$에서 시작하고, 또 다른 임의의 방향 $\delta W$으로 살짝 움직여본다.
- 만약 움직여간 자리($W+\delta W$)에서의 손실값(loss)가 더 낮으면, 거기로 움직이고 다시 탐색을 시작한다.
- 이런 반복으로, 골짜기를 내려간다.

<br>

- **경사(slope)**: 1차원 공간에서 어떤 함수에 대한 **미분값(derivative)**
  - $\frac{df(x)}{dx}=\lim_{h\to 0}\frac{f(x+h)-f(x)}{h}$
  - 따라서 경사는 방향(direction) 정보를 가지고 있다. 
- x를 입력으로 받으면 출력은 곡선의 높이로 생각할 수 있다.
- 곡선의 일부를 구하면 기울기를 계산할 수 있다.
- **적어도 반지름이 0으로 수렴하는 아주 좁은 근방에서는 가장 가파르게 감소하는 최선의 방향을 구할 수 있고, 이 방향을 따라 가중치 벡터를 움직인다.**
  - 발 밑 지형을 잘 더듬어보고 가장 가파르다는 느낌을 주는 방향으로 내려간다.
- x가 벡터일 경우, 이 때 미분을 **편미분(partial derivatives)**이라 한다.
- **그레이디언트(gradient)** : 각 차원으로의 편미분들을 모아놓은 벡터 (집합)
  - 그레이디언트의 각 요소는 "임의의 방향으로 갈때 함수 f의 경사가 어떤지"의 정보를 알려준다.
- 그레이디언트의 방향은 함수에서 '가장 많이 오름/내림'하는 함수 이다.
- 임의의 방향의 그레이디언트는 그것의 방향의 내적이다.
- 아래 그림처럼, gradient의 각 요소는 한 방향으로 아주 조금씩 이동했을 때, loss값이 어떻게 변하는지를 알려주는 것이다.

<img src='https://user-images.githubusercontent.com/78655692/164625554-f7076983-557c-4c39-82ab-acc627f2034d.png' width=650>

- 하지만, 위의 방법은 시간이 엄청 오래 걸린다.
- 즉, **Numerical gradient**를 사용하지 않고, **Analytic gradient**를 사용한다.
  - **Numerical gradient** : 근사치(approximate), 느림(slow), 쉬운 방법(easy to write)
  - **Analytic gradient** : 정확(fast), 빠름(exact), 실수하기 쉬운(error-prone)
- 그레이디언트를 나타내는 식을 찾고, 그걸 이용해여 한번에 그레이디언트 dW를 계산한다.
- 하지만, 구현하는 데 실수하기 쉽기 때문에, 실제 응용할 때 해석적으로 구한 다음에 수치적으로 구한 것과 비교해보고, 틀린 경우 고치는 작업을 한다.
  - 이것을 **gradient check**라 한다.

<img src='https://user-images.githubusercontent.com/78655692/164626108-0ec0df0f-4514-4038-8c0f-f098cc6e1f2c.png' width=650>

<br>
<br>

## Gradient Descent

<img src='https://user-images.githubusercontent.com/78655692/164642639-54b744a5-8614-4127-bfb7-1ab897e6f54f.png' width=500>

- **경사 하강법(gradient descent)** : 기울기를 반복적으로 평가한 다음 파라미터 업데이트를 수행하는 절차
  - Loss function 값을 최소화하는 값을 찾는 것으로 기울기의 반대 방향으로 일정 크기만큼 이동하는 것을 반복한다. [^1]
  - 경사 하강을 사용하여 함수의 local minimum을 찾으려면 현재 지점에서 함수의 그레이디언트의 음수에 비례하는 단계를 밟는다.
- 다음은 경사하강법의 알고리즘이다.

```python
# Vanilla Gradient Descent

while True:
    weights_grad = evaluate_gradient(loss_fun, data, weights)
    weights += - step_size * weights_grad # perform parameter update
```

<img src='https://user-images.githubusercontent.com/78655692/165062035-bff5281a-c369-4ecc-af3c-4b1fde4ec1bb.png' width=250>

- $W_{i+1}=W_i-\gamma \nabla F(W_i)$
- 먼저 w를 임의의 값으로 초기화한다.
- loss와 gradient를 계산 후, 가중치를 -gradient로 업데이트 해준다.
- 과정을 반복하면 결국 수렴(convergence)해진다.
- **step** : -gradient 방향으로 얼마나 나아가야 하는지 알려준다.

<br>

### Stochastic Gradient Descent

![image](https://user-images.githubusercontent.com/78655692/164877718-32728c4d-963d-4488-a034-152640dc0520.png) <br> 이미지출처 [^3]

- **배치 경사 하강법(Batch Gradient Descent; BGD)** : 손실 함수(loss function)을 계산할 때, 전체 학습 데이터셋을 사용하는 것
  - 즉, 전체 학습 데이터를 하나의 배치로 묶어 학습시킴 [^2]
  - **배치(batch)** : GPU가 한번에 처리하는 데이터의 묶음 [^2]
  - 하나의 step을 위해 전체 데이터를 계산해야 하므로 계산량이 많다.
- **확률적 경사 하강법(Stochastic Gradient Descent; SGD)** : 손실 함수(loss function)을 계산할 때, 전체 데이터(batch) 대신 일부 데이터의 모음(mini-batch)를 사용하는 것 [^1]
- $L(W)=\frac{1}{N}\sum_{i=1}^NL_i(x_i,y_i,W)+\lambda R(W)$ **(SGD)**
  - 사실, 정확한 명칭은 **미니 배치 확률적 경사 하강법(Mini-batch Stochastic Gradient Descent; MSGD)**라고 한다.
    - **SGD**는 전체 학습 데이터 중 하나의 데이터(batch=1)를 이용하는 것.
  - BGD보다는 부정확할 수 있지만, 계산 속도가 훨씬 빠르기 때문에, 같은 시간에 더 많은 step을 나아갈 수 있다.
  - 즉, **미니배치에서 그레이디언트를 구해서 더 자주 가중치를 업데이트하면 더 빠른 수렴 결과를 얻는다.**
  - **확률적(Stochastic)** : 전체 학습 데이터 중 **랜덤하게(randomly)** 선택된 하나의 데이터로 학습한다는 의미 [^2]
  - mini-batch는 보통 2의 제곱이며, 32, 64, 128 등을 사용한다.
- $\nabla_W L(W) =$ $\frac{1}{N}\sum_{i=1}^N\nabla_W L_i(x_i,y_i,W)$ $+\lambda\nabla_W R(W) $ **(BSGD)**
  - $\nabla$ 의미는 편미분들의 벡터 집합으로 이해하면 된다.
- 작은 미니배치를 이용해서 loss의 전체 합의 추정치와 실제 그레이디언트의 추정치를 계산한다.
- 다음은 SGD의 알고리즘이다.

```python
# Vanilla Minibatch Gradient Descent

while True:
    data_batch = sample_training_data(data, 256)
    weights_grad = evaluate_gradient(loss_fun, data_batch, weights)
    weights += - step_size * weights_grad # perform parameter update
```

<br>
<br>
<br>
<br>

## References 

[^1]: [1. Stochastic Gradient Descent(SGD)란? - MangKyu's Diary](https://mangkyu.tistory.com/62)
[^2]: [배치와 미니 배치, 확률적 경사하강법 (Batch, Mini-Batch and SGD) - skyil](https://skyil.tistory.com/68)
[^3]: [수식과 코드로 보는 경사하강법(SGD,Momentum,NAG,Adagrad,RMSprop,Adam,AdaDelta)- 흰고래의꿈](https://twinw.tistory.com/247)