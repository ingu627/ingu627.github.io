---
layout: single
title: "CS231n 강의 8-1: 옵티마이저 동작 메커니즘 & 비교"
excerpt: "본 글은 2021년 4월에 강의한 스탠포드 대학의 Convolutional Neural Networks for Visual Recognition 2021년 강의를 듣고 정리한 내용입니다. Lecture8 신경망 학습 중 옵티마이저, 학습률에 대해 정리했습니다."
categories: cs231n
tags: [이미지, cnn, cs231n, 리뷰, 정리, 요약, 정의, 란, 딥러닝, 머신러닝, 옵티마이저, optimizer, sgd, momentum, nesterov momentum, adagrad, rmsprop, adam, 경사 하강법, learning rate, 학습률, hessian, taylor, bgfs, lbgfs, 의미, 설명]
toc: true 
toc_sticky: false
sidebar_main: false

last_modified_at: 2022-04-25
---

<img align='right' width='400' src='https://user-images.githubusercontent.com/78655692/164892824-f29872ea-f540-478f-9cfc-a7f83747e5d0.png'>
본 글은 2021년 4월에 강의한 스탠포드 대학의 "Convolutional Neural Networks for Visual Recognition" 2021년 강의를 듣고 정리한 내용입니다. <br> 개인 공부 목적으로 작성되었으며, 설명이 맞지 않거나 글 오타가 있으면 알려주시길 바랍니다.
{: .notice--info}

원본 링크 : [cs231n.stanford.edu](http://cs231n.stanford.edu/)<br> 한글 번역 링크 : [aikorea.org - cs231n](http://aikorea.org/cs231n/) <br> 강의 링크 : [youtube - 2017 Spring (English)](https://www.youtube.com/playlist?list=PL3FW7Lu3i5JvHM8ljYj-zLfQRF3EO8sYv)
{: .notice--warning}

<br>
<br>
<br>

## Training Neural Networks 

- 이전 섹션들에서는 레이어를 어떻게 쌓을지, 어떤 손실함수를 써야 하는지 등 정적인 부분을 배웠는데, 이번 섹션부터는 동적인 부분을 알아본다.
- Part2에서 배울 내용은 다음과 같다.
  - **Improve your training error**
    - (Fancier) Optimizers
    - Learning rate schedules
  - **Improve your test error**
    - Regularization
    - Choosing Hyperparameters

<br>
<br>

## (Fancier) Optimizers

- **경사 하강법(Gradient Descent)**에서는 가중치 $W$ 값에 대해서 그레이디언트의 반대 방향으로 step만큼 반복적으로 이동하여 손실함수가 최소가 되게 하는 가중치 $W$ 값을 찾는다.

    <img src='https://user-images.githubusercontent.com/78655692/164910436-ed34f9ec-9abb-471c-9593-0d22ac5d3c57.png' width=300>

```python
# Vanilla Gradient Descent
while True:
    weights_grad = evaluate_gradient(loss_fun, data, weights)
    weights += - step_size * weights_grad
```

- 즉, 미니 배치 안에서 데이터 손실을 계산하고, 그레이디언트의 반대 방향을 이용해서 파라미터(가중치) 벡터를 업데이트 시켜준다.
- 하지만, **SGD**의 문제점들이 있다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/164910754-2db2f8aa-3d72-49a7-98eb-2d347c61d549.png' width=650>

- Q. 손실이 한 방향으로 빠르게 변화고 다른 방향으로 천천히 변화하면 어떻게 될까?

<br>

<img src='https://user-images.githubusercontent.com/78655692/164910844-717600d9-7c64-4f81-b15e-b50911eed27d.png' width=650>

- A. 얕은 차원을 따라 매우 느리게 진행되고, 가파른 방향을 따라 매우 흔들릴 것이다.
  - 손실(loss)는 수직 방향의 가중치 변화에 더 민감하게 반응하여 지그재그 형태로 지점(point)를 찾아간다.
  - 하지만, 수평방향의 가중치는 느리게 변하기 때문에 전체적으로 매우 느려지는 단점이 있다.

<br>
<br>

<img src='https://user-images.githubusercontent.com/78655692/164910992-d0b045c1-873d-443a-a38c-18c516b48a2f.png' width=650>

- 2번째 문제점으로 **지역 최소점(local minima)** 또는 **안장 지점(saddle point)**가 있다.
  - **local minima**는 그레이디언트가 0이 되어 중간에 멈춰버리는 것이고,
  - **saddle point**는 순간적으로 그레이디언트가 0에 가까운 지점에서 멈춰버리는 지점을 말한다.
  - 보통 고차원에서는 saddle point가 많이 발생한다.

<br>
<br>

<img src='https://user-images.githubusercontent.com/78655692/164911160-ed81d37d-7ef2-4066-be50-95f370d79e4e.png' width=650>

- 3번째 문제점으로, 그레이디언트는 각 미니배치에서 오는 것을 매번 업데이트하는데, 이때마다 정확하지 않고 노이즈가 발생할 수 있다는 것이다.

<br>
<br>

### SGD + Momentum

- **SGD**의 정의는 다음과 같다.
  - $x_{t+1}=x_t-\alpha \nabla f(x_t)$

    ```python
    while True:
        dx = compute_gradient(x)
        x -= learning_rate * dx
    ```

- **모멘텀(Momentum)**은 SGD에 일종의 가속도를 주는 것이다. 즉, 그레이디언트가 0인 지점이 나와도 모멘텀으로 인해 계속 나아갈 수 있게 해준다. 
- **SGD+Momentum** 정의는 다음과 같다.
  - $v_{t+1}=\rho v_t+\nabla f(x_t)$
  - $x_{t+1}=x_t - \alpha v_{t+1}$
  - 즉, 그레이디언트(gradient) 방향으로 가는 게 아니라, 속도(velocity) 방향으로 나아가게 된다.

    ```python
    vx = 0
    while True:
        dx = compute_gradient(x)
        vx = rho * vx + dx 
        x -= learning_rate * vx
        # vx = 속도(velocity)
        # rho = 마찰계수
        # 너무 빠르게 가지 않게 마찰을 주는 개념
        # 보통 rho를 0.9나 0.99로 준다.
    ```

- **SGD+Momentum**의 다른 대체 공식도 있다.
  - $v_{t+1}=\rho v_t-\alpha \nabla f(x_t)$
  - $x_{t+1}=x_t+v_{t+1}$

    ```python
    vx = 0
    while True:
        dx = compute_gradient(x)
        vx = rho * vx - learning_rate * dx
        x += vx
    ```

<br>

<img src='https://user-images.githubusercontent.com/78655692/164913501-ee85f878-6d9a-42c8-b34f-a4be5ef54012.png' width=550> <br> 이미지출처 [^1]

- 위 그림의 파란색 선같이 부드럽고 빠르게 이동하는 것을 볼 수 있다.
- **local minima**와 **saddle point**를 극복하여 계속 내려갈 수 있게 되었다.

<br>
<br>

### Nesterov Momentum

<img src='https://user-images.githubusercontent.com/78655692/164913612-e8395a54-0bf9-4699-812e-516cd409d201.png' width=650>

- 위 그림에서 빨간색은 gradient 방향을, 초록색은 velocity 방향을 나타내고, 초록색은 actual step 방향(둘의 가중평균)을 나타낸다. 
- **Nesterov Momentum**은 계산하는 순서를 바꾼 것이다.
  - 속도를 사용하여 업데이트 해야하는 지점까지 간다.
  - 그 지점에서 그레이디언트를 계산하고 속도와 혼합하여 실제 업데이트 방향을 파악한다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/164914223-f2d270e0-9097-4040-9f10-4e98f7376c0d.png' width=650>

- 위 식에서 파란색 부분 $x_t+ \rho v_t$는 미리 속도 방향을 예측해서 그레이디언트를 구한다는 의미다.

<img src='https://user-images.githubusercontent.com/78655692/164915265-bb3e45df-1e51-4c7b-a171-516a4c6c0b88.png' width=500>

<br>
<br>

### AdaGrad

- **Adagrad(Adaptive Gradient)**는 각 차원의 제곱합(sum of squares)에 기반한 그레이디언트의 요소별 스케일링을 추가한 것이다. [^2]
  - 즉, 이전 업데이트의 크기를 기준으로 각 매개 변수에 대한 학습 속도를 조정하는 알고리즘이다. 
  - 업데이트 횟수가 적은 매개 변수에 대해 업데이트를 더 크게 확장
  - 더 많이 업데이트되는 매개 변수에 대해 업데이트를 더 작게 조정
- 공식은 다음과 같다. [^3]
  - $h\leftarrow h+\frac{\partial L}{\partial W}\odot \frac{\partial L}{\partial W}$
  - $W\leftarrow W - \alpha \frac{1}{\sqrt{h}}\frac{\partial L}{\partial W}$
  - h에 이전 그레이디언트의 제곱들이 누적되어 더해지게 되는데, 매개변수를 업데이트할 때, $\frac{1}{\sqrt{h}}$를 통해 학습률을 조정한다.

    ```python
    grad_squared = 0
    while True:
        dx = compute_gradient(x)
        grad_squared += dx * dx
        x -= learning_rate * dx / (np.sqrt(grad_squared) + 1e-7)
    ```

    <img src='https://user-images.githubusercontent.com/78655692/164916307-da65b069-be77-45f9-ac44-14a5ccd895b0.png' width=400>


<br>
<br>

### RMSProp

- 하지만, AdaGrad는 non-convex일 때 saddle point에 걸려 학습이 멈출 수도 있다. 즉, 업데이트가 안되는 현상이 일어날 수 있다.
- 또한, RMSProp는 극단적으로 학습률이 감소하는 것을 해결하기 위한 AdaGrad의 수정본이다.
  - 이 문제점을 해결하기 위해 나온 것이 **RMSProp**이다.

    ```python
    grad_squared = 0
    while True:
        dx = compute_gradient(x)
        grad_squared += decay_rate * grad_squared + (1 - decay_rate) * dx * dx
        x -= learning_rate * dx / (np.sqrt(grad_squared) + 1e-7)
    ```

  - RMSProp는 지금까지의 모든 시간 단계에서 그레이디언트 제곱합을 저장되는 대신 그레이디언트 제곱합에 대한 **decayed moving average**를 사용한다.
  - 보통, decay_rate는 0.9 또는 0.99를 사용한다.
  - 그리고, 현재 그레이디언트 제곱은 (1-decay_rate)를 곱해주고 앞에 연산에 더해준다.
- 이를 통해 속도가 줄어드는 문제를 해결했다.

<br>

- 다음은 소개됐던 방법들을 비교한 그림이다.

<img src='https://user-images.githubusercontent.com/78655692/164916692-eee816b7-c7ce-4443-a63c-8728a958ba83.gif' width=500> 

<img src='https://user-images.githubusercontent.com/78655692/164916705-3fa1a008-0712-4552-8a55-c050e6db952b.gif' width=500>
<br> 이미지출처 [^2]

<br>
<br>

### Adam

- **Adam**은 모멘텀과 Ada 계열을 합친 것이다.
- **Adam**은 first moment와 second moment를 이용해서 이전의 정보를 유지시킨다.
  - 코드는 다음과 같다.

    ```python
    first_moment = 0
    second_moment = 0
    while True:
        dx = compute_gradient(x)
        first_moment = beta1 * first_moment + (1 - beta1) * dx # Momentum 부분
        second_moment = beta2 * second_moment + (1 - beta2) * dx *dx # AdaGrad/RMSProp 부분
        x -= learning_rate * first_moment / (np.sqrt(second_moment) + 1e-7) # AdaGrad/RMSProp 부분
    ```

  - 모멘텀(first_moment) 코드는 그레이디언트의 가중합이다.
  - Ada(second_moment) 코드는 그레이디언트의 제곱을 이용하는 방법이다.
  - 하지만, 초기 step에서 문제가 발생한다. 따라서 보정항을 추가한다.

    ```python
    first_moment = 0
    second_moment = 0
    while True:
        dx = compute_gradient(x)
        first_moment = beta1 * first_moment + (1 - beta1) * dx # Momentum 부분
        second_moment = beta2 * second_moment + (1 - beta2) * dx *dx # AdaGrad/RMSProp 부분
        first_unbias = first_moment / (1 - beta1**t) # Bias correction
        second_unbias = second_moment / (1 - beta2**t)
        x -= learning_rate * first_moment / (np.sqrt(second_moment) + 1e-7) # AdaGrad/RMSProp 부분
    # beta1 = 0.9
    # beta2 = 0.999
    # learning_rate = 1e-3 or 5e-4
    ```

  - first moment와 second moment를 업데이트하고 현재 step에 맞는 적절한 편향(bias)를 추가해 값이 튀지 않게 방지시켜준다.

    <img src='https://user-images.githubusercontent.com/78655692/164919990-95fd5867-c076-4174-b801-3907ab9710bf.png' width=450>

<br>
<br>

### Summary

- **옵티마이저(optimzier)**는 딥러닝에서 신경망이 빠르고 정확하게 학습하는 것을 목표로 한다. 
- 다음은 optimizer의 전반적인 내용이다.

![image](https://user-images.githubusercontent.com/78655692/164929910-6d662c97-b20b-4d02-93d2-de32726b7c0b.png) <br> 이미지출처 [^4]

<br>
<br>

## Learning rate schedules

<img src='https://user-images.githubusercontent.com/78655692/164923884-8712b038-282f-4e0e-b8a1-a158c658cdd8.png' width=450>

- 위의 소개된 옵티마이저들 모두(all) **학습률(learning rate)**를 가지고 있다.
  - **학습률**은 잠깐 뜸들여 방향을 찾는 것을 말한다. 
  - 하지만, 학습률의 하이퍼파라미터 값을 찾는 건 쉽지 않다. 
- 시간의 경과에 따른 **학습률 저하(learning rate decay)**
  - **step decay** : 몇 에포크마다 감소시킨다.
  - **exponential decay** : $\alpha = \alpha_0 e^{-kt}$
  - **1/t decay** : $\alpha = \alpha_0 /(1+kt)$

<br>

<img src='https://user-images.githubusercontent.com/78655692/164936315-74a49685-fb3c-47db-ad99-e1fcdbaab3d3.png' width=500>

- 방법으로 몇몇 고정된 지점에서 학습 속도를 줄여본다.
  - 예시로, ResNet 경우, 에포크 30, 60, 90마다 lr에 0.1씩 곱한다.
- 위 그림에서 갑자기 뚝 떨어지는 이유는 lr을 변경했기 때문이다.

<br>

### Learning Rate Decay

- **learning rate decay** 경우, 처음에 학습률을 높게 설정하고 학습이 진행될수록 점점 낮추는 걸 말한다.
- 다음은 각 함수에 대한 leraning rate 그래프이다.

    <img src='https://user-images.githubusercontent.com/78655692/164936474-2383cee1-0f19-4bed-9793-899573f0f392.png' width=500>

  - **Cosine** : $\alpha_t=\frac{1}{2}\alpha_0$ $(1+cos(t\pi /T))$
  - $\alpha_0$ : 초기 학습률
  - $\alpha_t$ : 에포크 t마다의 학습률
  - $T$ : 전체 에포크 수

    <br>

    <img src='https://user-images.githubusercontent.com/78655692/164936785-3a659110-dbe4-443b-ad72-bc25551ed653.png' width=500>

  - **Linear** : $\alpha_t=\alpha_0(1-t/T)$

    <br>

    <img src='https://user-images.githubusercontent.com/78655692/164937028-da17e21c-47c0-4717-bb97-8683e09d95e4.png' width=500>

  - **Inverse sqrt** : $\alpha_t=\alpha_0 / \sqrt{t}$

<br>
<br>

### Detail

<img src='https://user-images.githubusercontent.com/78655692/164938290-afccc996-2990-4e7b-b5cb-240abbaea91b.png' width=600>

- 지금까지는 모두 1차 미분을 활용한 옵티마이저이다.

<img src='https://user-images.githubusercontent.com/78655692/164938417-c6089ea3-e2f2-4028-940e-461e37bca5f0.png' width=600>

- 여기에 second-order optimization을 사용하는 방법이 있다.
- 이를 이용하면 minima에 잘 근접할 수 있다.
- 이계도함수로 구성된 행렬인 **Hessian matrix**로 계산한다. (역행렬 이용)
  - 예를 들어 해시안 행렬의 고유값이
  - 모두 양수이면 **local minima**
  - 모두 음수이면 **local maxima**
  - 양수와 음수가 동시에 있으면 **saddle point** 이다. [^5]
- **second-order Taylor expansion**
  - $J(\theta)\approx J(\theta_0)+$ $(\theta-\theta_0)^T\nabla_{\theta}J(\theta_0)+$ $\frac{1}{2}(\theta-\theta_0)^TH(\theta-\theta_0)$
- 임계점을 해결함으로써 뉴런 매개변수 업데이트를 얻는다.
  - $\theta^*=\theta_0-H^{-1}\nabla_{\theta}J(\theta_0)$

<br>

- **BGFS** : 헤시안을 invert하는 대신, 시간 경과에 따른 랭킹 1을 업데이트
- **L-BFGS(lmitied memory BFGS)** : full inversed Hessian을 생성/저장하지 않는다.
  - 일반적으로, 전체 배치, 결정론적 모드에서 잘 작동한다.
  - 하지만, 미니배치 설정에선 잘 전송이 되지 않는다.

<br>
<br>

### Summary

- **Momentum** or **RMSProp** : ImageNet을 학습시키기에 충분하다.
- **Adam**은 대부분 경우 가장 좋은 선택이다.
  - 감지(Detection), 분할(segementation) 등에 쓸 때 좋다.
- 하지만, full batch라면 **L-BFGS**도 좋은 선택이 될 수 있다.
- 지금까지 알아본 옵티마이저와 학습률은 training error를 줄이고, loss function을 최소화시키는 게 목적이다.

<br>
<br>
<br>
<br>

## references

[^1]: [[CS231n] Lecture 7 Training Neural Networks II - 남르미누](https://namrmino.tistory.com/entry/CS231n-Lecture-7-Training-Neural-Networks-II)
[^2]: [Gradient Descent Optimization Algorithms 정리](http://shuuki4.github.io/deep%20learning/2016/05/20/Gradient-Descent-Algorithm-Overview.html)
[^3]: [딥러닝 용어정리, Momentum, AdaGrad 설명 - All about](https://light-tree.tistory.com/140)
[^4]: [Optimizer 의 종류와 특성 (Momentum, RMSProp, Adam) - 312 개인 메모장](https://onevision.tistory.com/entry/Optimizer-%EC%9D%98-%EC%A2%85%EB%A5%98%EC%99%80-%ED%8A%B9%EC%84%B1-Momentum-RMSProp-Adam)
[^5]: [[선형대수학] 헤시안(Hessian) 행렬과 극소점, 극대점, 안장점](https://bskyvision.com/661)


