---
layout: single
title: "[케라스(keras) 이해] 2장. 신경망의 수학적 구성 요소"
excerpt: "케라스 창시자에게 배우는 딥러닝 요약"
categories: keras
tag : [python, keras, DL]
toc: true
# toc_sticky: true
author_profile: false
classes: wide

last_modified_at: 2021-11-11
---

본 글은 [케라스 창시자에게 배우는 딥러닝] - (박해선 옮김) 책을 개인공부하기 위해 요약, 정리한 내용입니다. 전체 코드는 [https://github.com/ingu627/deep-learning-with-python-notebooks](https://github.com/ingu627/deep-learning-with-python-notebooks)에 기재했습니다.(원본 코드 fork) <br>저와 같이 공부하면 좋을 것 같습니다.
{: .notice--info}

## 2_1. 신경망과의 첫 만남

- 신경망의 핵심 구성 요소는 일종의 데이터 처리 필터라고 생각할 수 있는 **층(layer)**이다.
- 층은 주어진 문제에 더 의미 있는 **표현(representation)**을 입력된 데이터로부터 추출한다.

## 컴파일 단계

- **손실 함수(loss function)** : 훈련 데이터에서 신경망의 성능을 측정하는 방법으로 네트워크가 옳은 방향으로 학습될 수 있도록 도와준다. 
- **옵티마이저(optimizer)** : 입력된 데이터와 손실 함수를 기반으로 네트워크를 업데이트하는 메커니즘
- **훈련과 테스트 과정을 모니터링할 지표** : 대표적으로 정확도를 본다.

## 2_2. 신경망을 위한 데이터 표현 

- **텐서(tensor)** : (거의 항상)수치형 데이터를 위한 컨테이너(container)
  - 임의의 차원 개수를 가지는 행렬의 일반화된 모습

<br/>

- **스칼라(scaler)** : 하나의 숫자만 담고 있는 텐서 (0D 텐서)
- **벡터(vector)** : 숫자의 배열 (1D 텐서) (하나의 축)

![image](https://user-images.githubusercontent.com/78655692/140688946-b382ba05-840e-4bf5-b376-6effd2fb4f34.png)

- 이 벡터는 5개의 원소를 가지고 있으므로 5차원 벡터라고 부름 
- 5D 벡터 != 5D 텐서
- **행렬(matrix) : 벡터의 배열 (2D 텐서) (2개의 축 - 행과 열)
  - 행렬은 숫자가 채워진 사각 격자

![image](https://user-images.githubusercontent.com/78655692/140691085-b31bf94a-778f-44a0-abad-735b6fabc9a8.png)

- **3D 텐서** : 행렬들을 하나의 새로운 배열로 합치면 숫자가 채워진 직육면체 형태로 해석할 수 있는 3D 텐서가 만들어짐

![image](https://user-images.githubusercontent.com/78655692/140704311-82c289d0-86ff-4536-8465-db319feb3a51.png)


## 핵심 속성

- **축의 개수(랭크)**
- **크기(shape)** : 텐서의 각 축을 따라 얼마나 많은 차원이 있는지를 나타낸 파이썬의 튜플(tuple) 
- **데이터 타입** : 텐서에 포함된 데이터의 타입

## 텐서의 실제 사례

- **벡터 데이터** : (samples, features) 크기의 2D 텐서
- **시계열 데이터** (또는 시퀀스(sequence) 데이터) : (samples, timesteps, features) 크기의 3D 텐서
- **이미지** : (samples, height, width, channels) 또는 (samples, channels, height, width) 크기의 4D 텐서
- **동영상** : (samples, frames, height, width, channels) 또는 (samples, frames, channels, height, width) 크기의 5D 텐서

## 브로드캐스팅 (broadcasting)

단계 
1. 큰 텐서의 ndim에 맞도록 작은 텐서에 축이 추가된다.
2. 작은 텐서가 새 축을 따라서 큰 텐서의 크기에 맞도록 반복된다.

## 텐서 크기 변환 
- `reshape()` 
- `transpose()`

<span style="color:red">딥러닝 : 기초적인 연산을 길게 연결하여 복잡한 기하하적 변환을 조금씩 분해하는 방식</span>

## 훈련 반복 루프 (training loop) 
1. 훈련 샘플 x와 이에 상응하는 타깃 y의 배치를 추출한다.
2. x를 사용하여 네트워크를 실행하고(정방향 패스 단계), 예측 y_pred를 구한다.
3. y_pred와 y의 차이를 측정하여 이 배치에 대한 네트워크의 손실을 계산한다.
4. 배치에 대한 손실이 조금 감소되도록 네트워크의 모든 가중치를 업데이트한다.

## 확률적 경사 하강법
- 미분 가능한 함수가 주어지면 이론적으로 이 함수의 최솟값을 해석적으로 구할 수 있다.

1. 훈련 샘플 배치 x와 이에 상응하는 타깃 y를 추출한다.
2. x로 네트워크를 실행하고 예측 y_pred를 구한다.
3. 이 배치에서 y_pred와 y 사이의 오차를 측정하여 네트워크의 손실을 계산한다.
4. 네트워크의 파라미터에 대한 손실 함수의 그래디언트를 계산한다.(역방향 패스 (backward pass))
5. 그래디언트의 반대 방향으로 파라미터를 조금 이동시킨다.

## 변화율 연결: 역전파 알고리즘 
- 역전파는 최종 손실 값에서부터 시작한다.
- 손실 값에 각 파라미터가 기여한 정도를 계산하기 위해 연쇄 법칙을 적용하여 최상위 층에서 하위 층까지 거꾸로 진행된다. 

![image](https://user-images.githubusercontent.com/78655692/140705045-69b7e24f-f246-42ae-917c-9620ef973190.png)

## 요약
- **학습**은 훈련 데이터 샘플과 그에 상응하는 타깃이 주어졌을 때 손실 함수를 최소화하는 모델 파라미터의 조합을 찾는 것을 의미
- 데이터 샘플과 타깃의 배치를 랜덤하게 뽑고 이 배치에서 손실에 대한 파라미터의 그래디언트를 계산함으로써 학습이 진행된다. 네트워크의 파라미터는 그래디언트의 반대 방향으로 조금씩(학습률에 의해 정의된 크기만큼) 움직인다.
- 전체 학습 과정은 신경망이 미분 가능한 텐서 연산으로 연결되어 있기 때문에 가능하다. 현재 파라미터와 배치 데이터를 그래디언트 값에 매핑해 주는 그래디언트 함수를 구성하기 위해 미분의 연쇄 법칙을 사용한다.


## References
[케라스 창시자에게 배우는 딥러닝](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=173992478)  
[딥러닝의 핵심 개념 - 역전파 이해하기1](https://m.blog.naver.com/samsjang/221033626685)
