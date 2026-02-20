---
layout: single
title: "케라스 2장: 텐서 구조·브로드캐스팅·자동미분 작동 원리"
excerpt: "텐서 차원/형상, 연산 그래프와 자동미분 흐름, 가중치 업데이트 수학을 직관 위주로 해부"
categories: keras
tags: [python, keras, DL, ML, AI, 인고지능, 딥러닝, 케라스, 텐서, 신경망, 리뷰, 정리, 이해, 모델, 케라스 창시자에게 배우는 딥러닝]
toc: true
sidebar_main: false
classes: wide

last_modified_at: 2025-09-27
redirect_from:
  - /keras/keras_ch2_org/
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

- **MNIST 샘플로 예제보기**

```python
from tensorflow.keras.datasets import mnist

(train_images, train_labels), (test_images, test_labels) = mnist.load_data()
```

- 훈련 세트(training set) = train_images, train_labels
- 테스트 세트(test set) = test_images, train_labels
- 레이블은 0부터 9까지의 숫자 배열이다.

<br>

```python
train_images.shape # (60000, 28, 28)
len(train_labels) # 60000
train_labels # array([5, 0, 4, ..., 5, 6, 8], dtype=uint8)

test_images.shape # (10000, 28, 28)
len(test_labels) # 10000
test_labels # array([7, 2, 1, ..., 4, 5, 6], dtype=uint8)
```

- **클래스 (class)** = 분류 문제의 범주(category)
- **샘플 (sample)** = 데이터 포인트
- **레이블 (label)** = 특정 샘플의 클래스

<br>

```python
from tensorflow.keras.layers import Dense
from tensorflow.keras.models import Sequential

network = Sequential()
network.add(Dense(512, activation='relu', input_shape=(28 * 28,)))
network.add(Dense(10, activation='softmax'))
```

- 신경망의 핵심 구성 요소는 일종의 <b><span style="color:red">데이터 처리 필터</span></b>라고 생각할 수 있는 **층(layer)**이다.
- 층은 주어진 문제에 더 의미 있는 **표현(representation)**을 입력된 데이터로부터 추출한다.
- 여기서는 완전 연결된 신경망 층인 Dense 층 2개가 연속되어 있다. 
- 두 번째 층은 10개의 확률 점수가 들어 있는 배열을 반환하는 소프트맥스이다.

<br>

```python
network.compile(optimizer='rmsprop',
                loss='categorical_crossentropy',
                metrics=['accuracy'])
```

- **손실 함수(loss function)** : 훈련 데이터에서 신경망의 성능을 측정하는 방법으로 네트워크가 옳은 방향으로 학습될 수 있도록 도와준다. 
- **옵티마이저(optimizer)** : 입력된 데이터와 손실 함수를 기반으로 네트워크를 업데이트하는 메커니즘
- **훈련과 테스트 과정을 모니터링할 지표** : 대표적으로 정확도를 본다.

<br>

```python
train_images = train_images.reshape((60000, 28 * 28))
train_images = train_images.astype('float32') / 255

test_images = test_images.reshape((10000, 28 * 28))
test_images = test_images.astype('float32') / 255

# 레이블을 범주형으로 인코딩하기
from tensorflow.keras.utils import to_categorical

train_labels = to_categorical(train_labels)
test_labels = to_categorical(test_labels)
```

- 데이터를 0과 1 사이로 스케일 조정

<br>

```python
# 훈련 데이터에 모델 학습
network.fit(train_images, train_labels, epochs=5, batch_size=128)

# Epoch 1/5
# 469/469 [==============================] - 5s 8ms/step - loss: 0.4455 - accuracy: 0.8705
# Epoch 2/5
# 469/469 [==============================] - 3s 7ms/step - loss: 0.1127 - accuracy: 0.9673
# Epoch 3/5
# 469/469 [==============================] - 3s 7ms/step - loss: 0.0721 - accuracy: 0.9789
# Epoch 4/5
# 469/469 [==============================] - 5s 11ms/step - loss: 0.0486 - accuracy: 0.9847
# Epoch 5/5
# 469/469 [==============================] - 3s 7ms/step - loss: 0.0368 - accuracy: 0.9888
# <tensorflow.python.keras.callbacks.History at 0x227cb78a198>
```

<br>

```python
test_loss, test_acc = network.evaluate(test_images, test_labels)

# 313/313 [==============================] - 2s 5ms/step - loss: 0.0664 - accuracy: 0.9799

print(test_acc) # 0.9799000024795532
```

<br>
<br>

## 2_2. 신경망을 위한 데이터 표현 

![image](https://user-images.githubusercontent.com/78655692/142875666-e2e24749-6fba-4650-acbb-674bca1da7bc.png) 이미지출처: [^1]

<br>
<br>

### 텐서

- **텐서(tensor)** : (거의 항상)수치형 데이터를 위한 **컨테이너 (container)**
  - 임의의 차원 개수를 가지는 행렬의 일반화된 모습
  - 텐서는 <b><span style="color:red">벡터 (Vector)와 행렬 (Matrix)을 일반화</span></b>한 것이며, 3차원 이상으로 확장할 수 있다.
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

<br>
<br>

### 2D 텐서

- 이 벡터는 5개의 원소를 가지고 있으므로 5차원 벡터라고 부름 
- 5D 벡터 != 5D 텐서
- **행렬(matrix)** : 벡터의 배열 (**2D 텐서**) (2개의 축 - 행과 열)
  - 행렬은 숫자가 채워진 사각 격자
- **2D 텐서** : <b><span style="color:red">(batch_size, dim)</span></b>
  - 행의 크기가 batch_size, 열의 크기가 dim이다.

![image](https://user-images.githubusercontent.com/78655692/143195653-9297e916-7683-4207-9332-6837c4ecc275.png) 이미지출처: [^2]

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

<br>

> 옮긴이 주 : 훈련 데이터 하나의 크기를 256이라고 해봅시다. [3, 1, 2, 5, ...] 이런 숫자들의 나열이 256의 길이로 있다고 상상하면됩니다. 다시 말해 훈련 데이터 하나 = 벡터의 차원은 256입니다. 만약 이런 훈련 데이터의 개수가 3000개라고 한다면, 현재 전체 훈련 데이터의 크기는 3,000 × 256입니다. 행렬이니까 2D 텐서네요. 3,000개를 1개씩 꺼내서 처리하는 것도 가능하지만 컴퓨터는 훈련 데이터를 하나씩 처리하는 것보다 보통 덩어리로 처리합니다. 3,000개에서 64개씩 꺼내서 처리한다고 한다면 이 때 batch size를 64라고 합니다. 그렇다면 컴퓨터가 한 번에 처리하는 2D 텐서의 크기는 (batch size × dim) = 64 × 256입니다.
>> "PyTorch로 시작하는 딥 러닝 입문 - 02. 텐서 조작하기(Tensor Manipulation) 1" 에서 인용

<br>
<br>

### 3D 텐서

- **3D 텐서** : 행렬들을 하나의 새로운 배열로 합치면 숫자가 채워진 직육면체 형태로 해석할 수 있는 3D 텐서가 만들어짐
- <b><span style="color:red">(batch_size, width, height)</span></b> - 비전 분야에서의 3차원 텐서
- 자연어 처리보다 비전 분야(이미지, 영상 처리)를 하시게 된다면 좀 더 복잡한 텐서를 다루게 된다.

![image](https://user-images.githubusercontent.com/78655692/143198512-4bfa9b7f-0a77-460d-bfcb-ac04c5d11129.png) 이미지출처: [^2]

- <b><span style="color:red">(batch_size, length, dim)</span></b> - NLP 분야에서의 3차원 텐서
  - length : 문장 길이
  - dim : 단어 벡터의 차원

![image](https://user-images.githubusercontent.com/78655692/143198696-4106e5a1-92f5-4fc6-bdb5-76b83a8522ee.png) 이미지출처: [^3]

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

<br>
<br>

### 2_2_5. 핵심 속성

- **축의 개수(랭크)** : `tf.rank()`
- **크기(shape)** : 텐서의 각 축을 따라 얼마나 많은 차원이 있는지를 나타낸 파이썬의 튜플(tuple) 
- **데이터 타입 (dtype)** : 텐서에 포함된 데이터의 타입

<br>

### 2_2_6. 넘파이로 텐서 조작하기

- **슬라이싱** (slicing) : 배열에 있는 특정 원소들을 선택하는 것
  - **: (콜론)** : 전체 인덱스 선택

<br>

### 2_2_7. 배치 데이터

- **샘플 축**(sample axis) : 모든 데이터 텐서의 첫 번째 축
- 배치 데이터를 다룰 때는 첫 번째 축(0축)을 **배치 축**(batch axis)이라 한다.

<br>

### 2_2_8. 텐서의 실제 사례

- **벡터 데이터** : (samples, features) 크기의 2D 텐서
- **시계열 데이터** (또는 시퀀스(sequence) 데이터) : (samples, timesteps, features) 크기의 3D 텐서
- **이미지** : <b><span style="color:red">(samples, height, width, channels) 또는 (samples, channels, height, width) 크기의 4D 텐서</span></b>
- **동영상** : (samples, frames, height, width, channels) 또는 (samples, frames, channels, height, width) 크기의 5D 텐서

<br>

### 2_2_9. 벡터 데이터

- 2D 텐서에서 첫 번째 축은 **샘플 축**이고, 두 번째 축은 **특성 축**(feature axis)이다. 


<br>

### 2_2_10. 시계열 데이터 또는 시퀀스 데이터

- 데이터에서 시간이 중요할 때는 시간 축을 포함하여 3D 텐서로 저장된다. 

<br>

<img src='https://user-images.githubusercontent.com/78655692/148701777-89bd49ea-f091-4d61-bb25-42eb7194828d.png' width=400> 이미지출처: [^4]

<br>

### 2_2_11. 이미지 데이터

- 이미지는 전형적으로 높이, 너비, 컬러 채널의 3차원으로 이루어진다.
  - 256 x 256 크기의 흑백 이미지에 대한 128개의 배치는 (128, 256, 256, 1) 크기의 텐서에 저장 가능
  - 256 x 256 크기의 컬러 이미지에 대한 128개의 배치는 (128, 256, 256, 3
  - ) 크기의 텐서에 **저장 가능**

<img src='https://user-images.githubusercontent.com/78655692/148704125-e8a670a0-c0bc-4179-92f0-7ca8adc7ae63.png' width=400> 이미지출처: [^5]

<br>

### 2_2_12. 비디오 데이터

- 하나의 비디오는 프레임의 연속이고 각 프레임은 하나의 컬러 이미지이다.
- 프레임의 연속은 (frames, height, width, color_depth)의 4D 텐서로 저장된다.
- 여러 비디오의 배치는 (samples, frames, height, width, color_depth)의 5D 텐서로 저장된다.
  - ex. 60초짜리 144x256 유튭 비디오 클립을 초당 4프레임으로 샘플링하면 240프레임이 된다. 4개 배치는 (4, 240, 144, 256, 3) 크기에 텐서에 저장된다.


<br>
<br>

## 신경망의 톱니바퀴: 텐서 연산

<br>

### 2_3_2. 브로드캐스팅 (broadcasting)

- 단계 
  1. 큰 텐서의 ndim에 맞도록 작은 텐서에 축이 추가된다.
  2. 작은 텐서가 새 축을 따라서 큰 텐서의 크기에 맞도록 반복된다.

<br>
<br>

### 2_3_4. 텐서 크기 변환 

- **reshape()** : 텐서의 크기(shape)를 변경해준다.
- **transpose()**
- **`shape=(5,)` 는 (1 x 5)를 의미한다.**

<br>

- **딥러닝** : <b><span style="color:red">기초적인 연산을 길게 연결하여 복잡한 기하하적 변환을 조금씩 분해하는 방식</span></b>

<br>
<br>

## 2_4. 신경망의 엔진: 그래디언트 기반 최적화

- 각 층은 입력 데이터를 다음과 같이 변환한다.

```python
output = relu(dot(W, input) + b)
```

- W와 b를 가중치(훈련 데이터를 신경망에 노출시켜서 학습된 정보가 담겨 있다.)라 부른다. 

<br>

- **훈련 반복 루프** (training loop) 
1. 훈련 샘플 x와 이에 상응하는 타깃 y의 배치를 추출한다.
2. x를 사용하여 네트워크를 실행하고(정방향 패스 단계), 예측 y_pred를 구한다.
3. y_pred와 y의 차이를 측정하여 이 배치에 대한 네트워크의 손실을 계산한다.
4. 배치에 대한 손실이 조금 감소되도록 네트워크의 모든 가중치를 업데이트한다.

<br>
<br>

### 2_4_3. 확률적 경사 하강법

- 미분 가능한 함수가 주어지면 이론적으로 이 함수의 최솟값을 해석적으로 구할 수 있다.
  - 함수의 최솟값은 변화율이 0인 지점이다.

1. 훈련 샘플 배치 x와 이에 상응하는 타깃 y를 추출한다.
2. x로 네트워크를 실행하고 예측 y_pred를 구한다.
3. 이 배치에서 y_pred와 y 사이의 오차를 측정하여 네트워크의 손실을 계산한다.
4. 네트워크의 파라미터에 대한 손실 함수의 그래디언트를 계산한다.(역방향 패스 (backward pass))
5. 그래디언트의 반대 방향으로 파라미터를 조금 이동시킨다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/148704685-15c39fd6-e6cb-4737-8389-e1d42eaca16d.png' width=400> 이미지출처: [^6]

- 위의 그림은 SGD가 1D 손실 함수의 값을 낮추는 과정

<br>

<img src='https://user-images.githubusercontent.com/78655692/148704770-fd9c31e5-c860-438a-8938-d728e4687526.png' width=400> 이미지출처: [^7]

- 위의 그림은 SGD가 2D 손실 함수의 값을 낮추는 과정

<br>
<br>

### 2_4_4. 변화율 연결: 역전파 알고리즘 
- 역전파는 최종 손실 값에서부터 시작한다.
- 손실 값에 각 파라미터가 기여한 정도를 계산하기 위해 연쇄 법칙을 적용하여 최상위 층에서 하위 층까지 거꾸로 진행된다. 

<br>

<img src="https://user-images.githubusercontent.com/78655692/140705045-69b7e24f-f246-42ae-917c-9620ef973190.png" width="600" alt="image"/> 이미지출처: [^8]

<br>
<br>

## 요약
- **학습**은 훈련 데이터 샘플과 그에 상응하는 타깃이 주어졌을 때 손실 함수를 최소화하는 모델 파라미터의 조합을 찾는 것을 의미
- 데이터 샘플과 타깃의 배치를 랜덤하게 뽑고 이 배치에서 손실에 대한 파라미터의 그래디언트를 계산함으로써 학습이 진행된다. 네트워크의 파라미터는 그래디언트의 반대 방향으로 조금씩(학습률에 의해 정의된 크기만큼) 움직인다.
- 전체 학습 과정은 신경망이 미분 가능한 텐서 연산으로 연결되어 있기 때문에 가능하다. 현재 파라미터와 배치 데이터를 그래디언트 값에 매핑해 주는 그래디언트 함수를 구성하기 위해 미분의 연쇄 법칙을 사용한다.

<br>
<br>

## References

- [케라스 창시자에게 배우는 딥러닝](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=173992478) 

[^1]: [1. 텐서 기초 살펴보기](https://codetorial.net/tensorflow/basics_of_tensor.html)
[^2]: [PyTorch로 시작하는 딥 러닝 입문 - 02. 텐서 조작하기(Tensor Manipulation)](https://wikidocs.net/52460)
[^3]: [PyTorch로 시작하는 딥 러닝 입문 - 02. 텐서 조작하기(Tensor Manipulation)](https://wikidocs.net/52460)
[^4]: <https://thebook.io/006975/part01/ch02/02/10/>
[^5]: <https://thebook.io/006975/part01/ch02/02/11/>
[^6]: <https://thebook.io/006975/part01/ch02/04/03-01/>
[^7]: <https://thebook.io/006975/part01/ch02/04/03-02/>
[^8]: [딥러닝의 핵심 개념 - 역전파 이해하기1](https://m.blog.naver.com/samsjang/221033626685)
