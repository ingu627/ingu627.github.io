---
layout: single
title: "[케라스(keras) 이해] 2장. 신경망의 수학적 구성 요소"
excerpt: "케라스 창시자에게 배우는 딥러닝 - 신경망과의 첫 만남"
categories: keras
tag : [python, keras, DL, ML, AI, 인고지능, 딥러닝, 케라스, 텐서, 신경망]
toc: true
sidebar_main: true
classes: wide

last_modified_at: 2021-12-29
---

<img align='right' width='200' height='200' src='https://user-images.githubusercontent.com/78655692/147629300-4d7acc5e-225a-454a-92cd-4da82f6828f6.png
'>
본 글은 [케라스 창시자에게 배우는 딥러닝] - (박해선 옮김) 책을 개인공부하기 위해 요약, 정리한 내용입니다. <br>전체 코드는 [https://github.com/ingu627/deep-learning-with-python-notebooks](https://github.com/ingu627/deep-learning-with-python-notebooks)에 기재했습니다.(원본 코드 fork) <br> 뿐만 아니라 책에서 설명이 부족하거나 이해가 안 되는 것들은 외부 자료들을 토대로 메꿔 놓았습니다. 즉, 딥러닝은 이걸로 끝을 내보는 겁니다. <br> 오타나 오류는 알려주시길 바라며, 도움이 되길 바랍니다.
{: .notice--info}

<br>
<br>
<br>
<br>

## 2_1. 신경망과의 첫 만남

- 신경망의 핵심 구성 요소는 일종의 데이터 처리 필터라고 생각할 수 있는 **층(layer)**이다.
- 층은 주어진 문제에 더 의미 있는 **표현(representation)**을 입력된 데이터로부터 추출한다.

## 컴파일 단계

- **손실 함수(loss function)** : 훈련 데이터에서 신경망의 성능을 측정하는 방법으로 네트워크가 옳은 방향으로 학습될 수 있도록 도와준다. 
- **옵티마이저(optimizer)** : 입력된 데이터와 손실 함수를 기반으로 네트워크를 업데이트하는 메커니즘
- **훈련과 테스트 과정을 모니터링할 지표** : 대표적으로 정확도를 본다.

## 2_2. 신경망을 위한 데이터 표현 

![image](https://user-images.githubusercontent.com/78655692/142875666-e2e24749-6fba-4650-acbb-674bca1da7bc.png)

### 텐서

- **텐서(tensor)** : (거의 항상)수치형 데이터를 위한 컨테이너(container)
  - 임의의 차원 개수를 가지는 행렬의 일반화된 모습
  - 텐서는 벡터 (Vector)와 행렬 (Matrix)을 일반화한 것이며, 3차원 이상으로 확장할 수 있다.
  - 텐서는 TensorFlow의 가장 주요한 객체이며, TensorFlow의 작업은 주로 텐서의 연산으로 이루어진다.
- 텐서 scalar, vector, matrix, tensor는 각각 랭크 0, 1, 2, 3를 가진다.
- 텐서 (Tensor)는 NumPy 어레이와 비슷하지만, GPU, TPU와 같은 가속기에서 사용할 수 있고, 값을 변경할 수 없다.

<br/>

- **스칼라(scaler)** : 하나의 숫자만 담고 있는 텐서 (0D 텐서)
- **벡터(vector)** : 숫자의 배열 (1D 텐서) (하나의 축)

```python
x = np.array([12, 3, 6, 14, 7])
print(x)
print(x.ndim)

# 결과 
# [12 3 6 14 7]
# 1
```

### 2D 텐서

- 이 벡터는 5개의 원소를 가지고 있으므로 5차원 벡터라고 부름 
- 5D 벡터 != 5D 텐서
- **행렬(matrix)** : 벡터의 배열 (**2D 텐서**) (2개의 축 - 행과 열)
  - 행렬은 숫자가 채워진 사각 격자
- **2D 텐서** : (batch_size, dim)
  - 행의 크기가 batch_size, 열의 크기가 dim이다.

![image](https://user-images.githubusercontent.com/78655692/143195653-9297e916-7683-4207-9332-6837c4ecc275.png)

```python
x = tf.constant([[
    [5, 78, 2, 34, 0],
    [6, 79, 3, 35, 1],
    [7, 80, 4, 36, 2]
    ]])
print(x)
print(x.ndim)

# 결과 

# tf.Tensor(
# [[[ 5 78  2 34  0]
#   [ 6 79  3 35  1]
#   [ 7 80  4 36  2]]], shape=(1, 3, 5), dtype=int32)
# 3
```

> 옮긴이 주 : 훈련 데이터 하나의 크기를 256이라고 해봅시다. [3, 1, 2, 5, ...] 이런 숫자들의 나열이 256의 길이로 있다고 상상하면됩니다. 다시 말해 훈련 데이터 하나 = 벡터의 차원은 256입니다. 만약 이런 훈련 데이터의 개수가 3000개라고 한다면, 현재 전체 훈련 데이터의 크기는 3,000 × 256입니다. 행렬이니까 2D 텐서네요. 3,000개를 1개씩 꺼내서 처리하는 것도 가능하지만 컴퓨터는 훈련 데이터를 하나씩 처리하는 것보다 보통 덩어리로 처리합니다. 3,000개에서 64개씩 꺼내서 처리한다고 한다면 이 때 batch size를 64라고 합니다. 그렇다면 컴퓨터가 한 번에 처리하는 2D 텐서의 크기는 (batch size × dim) = 64 × 256입니다.
>> "PyTorch로 시작하는 딥 러닝 입문 - 02. 텐서 조작하기(Tensor Manipulation) 1 에서 인용"

### 3D 텐서

- **3D 텐서** : 행렬들을 하나의 새로운 배열로 합치면 숫자가 채워진 직육면체 형태로 해석할 수 있는 3D 텐서가 만들어짐
- (batch_size, width, height) - 비전 분야에서의 3차원 텐서
- 자연어 처리보다 비전 분야(이미지, 영상 처리)를 하시게 된다면 좀 더 복잡한 텐서를 다루게 된다.

![image](https://user-images.githubusercontent.com/78655692/143198512-4bfa9b7f-0a77-460d-bfcb-ac04c5d11129.png)

- (batch_size, length, dim) - NLP 분야에서의 3차원 텐서
  - length : 문장 길이
  - dim : 단어 벡터의 차원

![image](https://user-images.githubusercontent.com/78655692/143198696-4106e5a1-92f5-4fc6-bdb5-76b83a8522ee.png)

```python
x = tf.constant([[
    [5, 78, 2, 34, 0],
    [6, 79, 3, 35, 1],
    [7, 80, 4, 36, 2]
    ],[
    [5, 78, 2, 34, 0],
    [6, 79, 3, 35, 1],
    [7, 80, 4, 36, 2]]])

print(x)
print(x.ndim)
print(x.shape)

# 결과

# tf.Tensor(
# [[[ 5 78  2 34  0]
#   [ 6 79  3 35  1]
#   [ 7 80  4 36  2]]

#  [[ 5 78  2 34  0]
#   [ 6 79  3 35  1]
#   [ 7 80  4 36  2]]], shape=(2, 3, 5), dtype=int32)
# 3
# (2, 3, 5)
```


## 핵심 속성

- **축의 개수(랭크)** : `tf.rank()`
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
- `reshape()` : 텐서의 크기(shape)를 변경해준다.
- `transpose()`
- **`shape=(5,)` 는 (1 x 5)를 의미한다.**

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

<img src="https://user-images.githubusercontent.com/78655692/140705045-69b7e24f-f246-42ae-917c-9620ef973190.png" weight="500" alt="image"/>

## 요약
- **학습**은 훈련 데이터 샘플과 그에 상응하는 타깃이 주어졌을 때 손실 함수를 최소화하는 모델 파라미터의 조합을 찾는 것을 의미
- 데이터 샘플과 타깃의 배치를 랜덤하게 뽑고 이 배치에서 손실에 대한 파라미터의 그래디언트를 계산함으로써 학습이 진행된다. 네트워크의 파라미터는 그래디언트의 반대 방향으로 조금씩(학습률에 의해 정의된 크기만큼) 움직인다.
- 전체 학습 과정은 신경망이 미분 가능한 텐서 연산으로 연결되어 있기 때문에 가능하다. 현재 파라미터와 배치 데이터를 그래디언트 값에 매핑해 주는 그래디언트 함수를 구성하기 위해 미분의 연쇄 법칙을 사용한다.


## References

- [케라스 창시자에게 배우는 딥러닝](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=173992478)  
- [딥러닝의 핵심 개념 - 역전파 이해하기1](https://m.blog.naver.com/samsjang/221033626685)
- [1. 텐서 기초 살펴보기](https://codetorial.net/tensorflow/basics_of_tensor.html)
- [PyTorch로 시작하는 딥 러닝 입문 - 02. 텐서 조작하기(Tensor Manipulation)](https://wikidocs.net/52460)
