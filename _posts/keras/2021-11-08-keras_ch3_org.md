---
layout: single
title: "케라스 3장: 신경망 시작하기 (1)"
excerpt: "케라스 창시자에게 배우는 딥러닝 - 신경망의 구조"
categories: keras
tags: [python, keras, DL, ML, AI, 인고지능, 딥러닝, 케라스, 층, 텐서, imdb, 리뷰, 정리, 이해, 모델, 케라스 창시자에게 배우는 딥러닝]
toc: true
sidebar_main: false
classes: wide

last_modified_at: 2025-09-27
---

<img align='right' width='200' height='200' src='https://user-images.githubusercontent.com/78655692/147629300-4d7acc5e-225a-454a-92cd-4da82f6828f6.png
'>
본 글은 [케라스 창시자에게 배우는 딥러닝] - (박해선 옮김) 책을 개인공부하기 위해 요약, 정리한 내용입니다. <br>전체 코드는 [https://github.com/ingu627/deep-learning-with-python-notebooks](https://github.com/ingu627/deep-learning-with-python-notebooks)에 기재했습니다.(원본 코드 fork) <br> 뿐만 아니라 책에서 설명이 부족하거나 이해가 안 되는 것들은 외부 자료들을 토대로 메꿔 놓았습니다. 즉, 딥러닝은 이걸로 끝을 내보는 겁니다. <br> 오타나 오류는 알려주시길 바라며, 도움이 되길 바랍니다.
{: .notice--info}

<br>

## 3_1. 신경망의 구조

- 요소들
  - 네트워크(또는 모델)를 구성하는 층
  - 입력 데이터와 그에 상응하는 타깃
  - 학습에 사용할 피드백 신호를 정의하는 손실 함수
  - 학습 진행 방식을 결정하는 옵티마이저

<br>

<img src='https://user-images.githubusercontent.com/78655692/148705082-1a23b111-b335-4cff-afbc-651609bd75c2.png' width=450>

<br>

## 3_1_1. 층: 딥러닝의 구성 단위

- **층** : 하나 이상의 텐서를 입력을 받아 하나 이상의 텐서를 출력하는 <b><span style="color:red">데이터 처리 모듈</span></b>
  - 어떤 종류의 층은 상태가 없지만 대부분의 경우 **가중치**라는 층의 상태를 가진다.
- **가중치** : 확률적 경사 하강법에 의해 학습되는 하나 이상의 텐서이며, 여기에 네트워크가 학습한 지식이 담겨 있다. 

<br>

### 층이 2D텐서일때

- `(samples, features)` 크기의 2D텐서가 저장된 간단한 벡터 데이터는 완전 연결층(fully connected layer)이나 밀집 층(dense layer)이라고도 불리는 밀집 연결 층(densely connected layer)에 의해 처리되는 경우가 많다. (**Dense**)

<br>

### 층이 3D 텐서일때

- `(samples, timesteps, features)` 크기의 3D 텐서로 저장된 시퀀스 데이터는 보통 **LSTM** 같은 순환 층(recurrent layer)에 의해 처리된다.

<br>

### 층이 4D 텐서일때

- 4D 텐서로 저장되어 있는 이미지 데이터는 일반적으로 2D 합성곱 층(convolution layer)에 의해 처리된다. (**Conv2D**)

<br/>

- **층 호환성(layer compatibility)** : 각 층이 특정 크기의 입력텐서만 받고 특정 크기의 출력 텐서를 반환한다는 사실을 말한다.

```python
from tensorflow.keras import models, layers

model = models.Sequential()
# 출력층은 32개, 인풋은 (1x784)
model.add(layers.Dense(32, input_shape=(784,))) 
## 32개의 유닛으로 된 밀집 층
model.add(layers.Dense(10))
```

<br>

## 3_1_2. 모델: 층의 네트워크

- 네트워크 구조는 **가설 공간(hypothesis space)**을 정의한다.
  - <u>머신 러닝</u> : 가능성 있는 공간을 사전에 정의하고 피드백 신호의 도움을 받아 입력 데이터에 대한 유용한 변환을 찾는 것
- 네트워크 구조를 선택함으로써 가능성 있는 공간(가설 공간)을 입력 데이터에서 출력 데이터로 매핑하는 일련의 특정 텐서 연산으로 제한하게 된다.

<br>

## 3_1_3. 손실 함수와 옵티마이저 : 학습 과정을 조절하는 열쇠

- 네트워크 구조를 정의하고 나면 두 가지를 더 선택해야 한다.
- **손실 함수**(loss function) (= 목적함수(objective function)) : <b><span style="color:red">훈련하는 동안 최소화될 값.</span></b> 주어진 문제에 대한 성공 지표가 된다.
  - **binary crossentropy** : 2개의 클래스가 있는 분류 문제
  - **categorical crossentropy** : 여러 개의 클래스가 있는 분류 문제
  - **MSE(mean square error)** : 회귀 문제
  - **CTC(connection temporal classfication)** : 시퀀스 학습 문제


- **옵티마이저**(optimizer) : **손실 함수를 기반으로 네트워크가 어떻게 업데이트될지 결정한다.**
  - 특정 종류의 확률적 경사 하강법(SGD; Stochastic Gradient Descent)을 구현한다.

- **지표**(metrics) : 훈련과 테스트 단계를 평가하기 위해 사용

<br>

## 3_2_1. 케라스, 텐서플로, 씨아노, CNTK

- **케라스**(keras) : 딥러닝 모델을 만들기 위한 고수준의 구성 요소를 제공하는 모델 수준의 라이브러리
  - 텐서 조작이나 미분 같은 저수준의 연산을 다루지 않는다.
  - 그 대신 케라스의 백엔드 엔진에서 제공하는 최적화되고 특화된 텐서 라이브러리를 사용한다.

<br>

## 3_2_2. 케라스를 사용한 개발: 빠르게 둘러보기

- <b><span style="color:red">전형적인 케라스 작업 흐름</span></b>
    1. 입력 텐서와 타깃 텐서로 이루어진 훈련 데이터를 정의한다.
    2. 입력과 타깃을 매핑하는 층으로 이루어진 네트워크(또는 모델)를 정의한다.
    3. 손실 함수, 옵티마이저, 모니터링하기 위한 측정 지표를 선택하여 학습 과정을 설정한다.
    4. 훈련 데이터에 대해 모델의 `fit()` 메서드를 반복적으로 호출한다.

<br>

### 모델을 정의하는 방법

<br>

**1. Sequential 클래스**

  - **sequential()** : 가장 자주 사용하는 구조인 층을 순서대로 쌓아 올린 네트워크
  - Neural Network의 각 층을 순서대로 쌓을 수 있도록 도와줌.

    ```python
    model = models.Sequential()
    model.add(layers.Dense(32, activation='relu', input_shape=(784,)))
    model.add(layers.Dense(10, activation='softmax'))
    ```

  - `tf.keras.layers`는 Neural Network의 모든 레이어 객체가 상속하는 클래스이다.
  - `model.layers`는 구성한 Neural Network 모델의 (입력층을 제외한) 뉴런층 레이어 객체를 리스트의 형태로 반환한다.

  <br>

**2. 함수형 API**

  - 완전히 임의의 구조를 만들 수 있는 비순환 유향 그래프를 만든다.
  - 함수형 API를 사용하면 모델이 처리할 데이터 텐서를 만들고 마치 함수처럼 이 텐서에 층을 적용한다.

    ```python
    input_tensor = layers.Input(shape=(784,))
    x = layers.Dense(32, activation='relu')(input_tensor)
    output_tensor = layers.Dense(10, activation='softmax')(x)

    model = models.Model(inputs=input_tensor, outputs=output_tensor)
    ```

<br>

## 3_4. 영화 리뷰 분류: 이진 분류 예제

## 3_4_1. IMDB 데이터셋

```python
from tensorflow.keras.datasets import imdb

(train_data, train_labels), (test_data, test_labels) = imdb.load_data(
    num_words=10000 # 훈련 데이터에서 가장 자주 나타나는 단어 1만 개만 사용
)
```

```python
print(train_data[0]) # 각 리뷰는 단어 인덱스의 리스트(단어 시퀀스가 인코딩된 것)
print(train_labels[0]) # 부정(0)과 긍정(1)을 나타내는 1의 리스트

# 결과
# [1, 14, 22, 16, 43, 530, 973, 1622, 1385, 65, 458, 4468, 66, 3941, 4, 173, 36, 256, 5, 25, 100, 43, 838, 112, 50, 670, 2, 9, 35, 480, 284, 5, 150, 4, 172, 112, 167, 2, 336, 385, 39, 4, 172, 4536, 1111, 17, 546, 38, 13, 447, 4, 192, 50, 16, 6, 147, 2025, 19, 14, 22, 4, 1920, 4613, 469, 4, 22, 71, 87, 12, 16, 43, 530, 38, 76, 15, 13, 1247, 4, 22, 17, 515, 17, 12, 16, 626, 18, 2, 5, 62, 386, 12, 8, 316, 8, 106, 5, 4, 2223, 5244, 16, 480, 66, 3785, 33, 4, 130, 12, 16, 38, 619, 5, 25, 124, 51, 36, 135, 48, 25, 1415, 33, 6, 22, 12, 215, 28, 77, 52, 5, 14, 407, 16, 82, 2, 8, 4, 107, 117, 5952, 15, 256, 4, 2, 7, 3766, 5, 723, 36, 71, 43, 530, 476, 26, 400, 317, 46, 7, 4, 2, 1029, 13, 104, 88, 4, 381, 15, 297, 98, 32, 2071, 56, 26, 141, 6, 194, 7486, 18, 4, 226, 22, 21, 134, 476, 26, 480, 5, 144, 30, 5535, 18, 51, 36, 28, 224, 92, 25, 104, 4, 226, 65, 16, 38, 1334, 88, 12, 16, 283, 5, 16, 4472, 113, 103, 32, 15, 16, 5345, 19, 178, 32]
# 1
```

<br>

### word_index

- **word_index()** : 단어와 정수 인덱스를 매핑한 딕셔너리 
- `word_index = imdb.get_word_index()`으로 할당

```python
word_index = imdb.get_word_index() # word_index는 단어와 정수 
word_index

# 결과
# {'fawn': 34701,
#  'tsukino': 52006,
#  'nunnery': 52007,
#  'sonja': 16816,
#  'vani': 63951,
#  'woods': 1408,
#  'spiders': 16115,
#  'hanging': 2345,
#  'woody': 2289,
# ....
```

- 정수 인덱스와 단어를 매핑하도록 뒤집는다.

```python
reverse_word_index = dict([(value, key) for (key, value) in word_index.items()])
reverse_word_index

# 결과
# {34701: 'fawn',
#  52006: 'tsukino',
#  52007: 'nunnery',
#  16816: 'sonja',
#  63951: 'vani',
#  1408: 'woods',
#  16115: 'spiders',
#  2345: 'hanging',
#  2289: 'woody',
#  52008: 'trawling',
#  52009: "hold's",
#  11307: 'comically',
#  40830: 'localized',
# ...
```

<br>

### get()

- **get(x)** 함수는 x라는 Key에 대응되는 Value를 돌려준다. 앞에서 살펴보았듯이 a.get('name')은 a['name']을 사용했을 때와 동일한 결괏값을 돌려받는다.
  - 매칭이 안되면 `None`으로 반환해준다.
- `reverse_word_index = dict([(value, key) for (key, value) in word_index.items()])`으로 할당

```python
a = {'name':'pey', 'phone':'0119993323', 'birth': '1118'}
print(a.get('name'))
print(a.get('phone'))

# 결과
# pey
# 0119993323
```

- 리뷰를 디코딩한다. 0,1,2는 '패딩', '문서 시작', '사전에 없음'을 위한 인덱스이므로 3을 뺀다.
- `decoded_review = ' '.join([reverse_word_index.get(i - 3, '?') for i in train_data[0]])` 로 할당

```python
decoded_review = ' '.join([reverse_word_index.get(i - 3, '?') for i in train_data[0]])
decoded_review

# 결과
# "? this film was just brilliant casting location scenery story 
# direction everyone's really suited the part they played and 
# you could just imagine being there robert ? is an amazing actor 
# and now the same being director ? father came from the same scottish island 
# as myself so i loved the fact there was a real connection 
# with this film the witty remarks throughout the film were great 
# it was just brilliant so much that i bought the film as soon as
# ...
```

<br>

## 3_4_2. 데이터 준비

- 신경망에 숫자 리스트를 주입할 수는 없다.
- 리스트를 텐서로 바꿔야 하는 데 2가지 방법이 있다.

1. 같은 길이가 되도록 리스트에 패딩(padding)을 추가하고 (samples, sequence_length) 크기의 정수 텐서로 변환한다. 
- 그 다음 이 정수 텐서를 다룰 수 있는 층을 신경망의 첫 번째 층으로 사용한다. (=`Embedding`)
1. 리스트를 원-핫 인코딩(one-hot encoding)하여 0과 1의 벡터로 변환한다. 
- 그 다음 부동 소수 벡터 데이터를 다룰 수 있는 Dense 층을 신경망의 첫 번째 층으로 사용한다.

<br>

### 원-핫 벡터로 만들기

- `np.zeros((len(), dimension))` : 크기가 (len(), dimension)이고 모든 원소가 0인 행렬을 만든다.
  - `tf.zeros()`는 모든 요소가 0인 텐서를 만든다.
  - `tf.zeros()`에 만들어질 텐서의 형태(shape)를 입력한다.

```python
import numpy as np 

def vectorize_sequences(sequences, dimension=10000):
    results = np.zeros((len(sequences), dimension))
    for i, sequence in enumerate(sequences):
        results[i, sequence] = 1
    return results

x_train = vectorize_sequences(train_data)
x_test = vectorize_sequences(test_data)

y_train = np.asarray(train_labels).astype('float32')
y_test = np.asarray(test_labels).astype('float32')

print(x_train[0])
print(len(x_train[0]))

# 결과
# [0. 1. 1. ... 0. 0. 0.]
# 10000
```

<br>

## 3_4_3. 신경망 모델 만들기

- `Dense(16, activation='relu')` : Dense 층에 전달한 매개변수(16)은 은닉 유닛(hidden unit)의 개수이다. 하나의 은닉 유닛은 층이 나타내는 표현 공간에서 하나의 차원이 된다.
  - `tf.keras.layers`모듈의 `Dense` 클래스는 (완전 연결된) 하나의 뉴런층을 구현한다. 
- `output = relu(dot(W, input) + b)` : 16개의 은닉 유닛이 있다는 것은 가중치 행렬 W의 크기가 (input_dimension, 16)이라는 뜻이다.
  - 입력 데이터와 W를 점곱하면 입력 데이터가 16차원으로 표현된 공간으로 투영된다. (그리고 편향 벡터 b를 더하고 relu 연산을 적용한다.)
- 표현 공간의 차원을 <b><span style="color:red">'신경망이 내재된 표현을 학습할 때 가질 수 있는 자유도'</span></b>로 이해할 수 있다.
- 은닉 유닛을 늘리면 신경망이 더욱 복잡한 표현을 학습할 수 있지만 계산 비용이 커지고 원하지 않는 패턴을 학습할 수도 있다.
- **가설 공간** : 입력 데이터를 16차원의 공간으로 바꾸는 가능한 모든 선형 변환의 집합
- 가설 공간을 풍부하게 만들어 층을 깊게 만드는 장점을 살리기 위해서는 비선형성 또는 활성화 함수를 추가해야 한다. 
  - 그중 `relu`는 딥러닝에서 가장 인기 있는 활성화 함수이다.
- `units`는 뉴런 또는 **출력** 노드의 개수를 의미하며, 양의 정수로 설정한다.
- `input_shape`는 **입력** 데이터의 형태를 결정한다.


<br>

- Dense 층을 쌓을 때 두 가지 중요한 구조상의 결정이 필요하다.

1. 얼마나 많은 층을 사용할 것인가?
2. 각 층에 얼마나 많은 은닉 유닛을 둘 것인가?

<br>

### 보편화된 구조

- 16개의 은닉 유닛을 가진 2개의 은닉 층
- 현재 리뷰의 감정을 스칼라 값의 예측으로 출력하는 세 번째 층

```python
from tensorflow.keras import models
from tensorflow.keras import layers

model = models.Sequential()
model.add(layers.Dense(16, activation='relu', input_shape=(10000,)))
model.add(layers.Dense(16, activation='relu'))
model.add(layers.Dense(1, activation='sigmoid'))

model.summary()

# 결과
# Model: "sequential"
# _________________________________________________________________
# Layer (type)                 Output Shape              Param #   
# =================================================================
# dense (Dense)                (None, 16)                160016    
# _________________________________________________________________
# dense_1 (Dense)              (None, 16)                272       
# _________________________________________________________________
# dense_2 (Dense)              (None, 1)                 17        
# =================================================================
# Total params: 160,305
# Trainable params: 160,305
# Non-trainable params: 0
# _________________________________________________________________
```

- 3개의 층으로 된 신경망
- 입력 : 벡터로 변환된 텍스트

<br>

- 마지막으로 손실 함수와 옵티마이저를 선택한다.
- **크로스엔트로피(Crossentropy)** : 확률 분포 간의 차이를 측정 (원본 분포와 예측 분포 사이를 측정)

<br>

### 모델 컴파일하기

- **compile** : 모델이 학습할 방법

```python
model.compile(
    optimizer='rmsprop',
    loss='binary_crossentropy',
    metrics=['accuracy']
)
```

<br>

## 3_4_4. 훈련 검증

### 검증 세트 준비하기

```python
x_val = x_train[:10000]
partial_x_train = x_train[10000:]
y_val = y_train[:10000]
partial_y_train = y_train[10000:]
```

- 이제 모델을 512개의 샘플씩 미니 배치를 만들어 20번의 에포크 동안 훈련시킨다.
  - **에포크(epochs)**는 x_train과 y_train 텐서에 있는 모든 샘플에 대해 20번 반복한다.
- **에포크 (epoch)** : <b><span style="color:red">주어진 데이터를 한번 훈련하는 단위</span></b>
  - **전체 데이터를 몇 번 반복하여 학습할 것인가?**
- 동시에 따로 떼어 놓은 1만 개의 샘플에서 손실과 정확도를 측정한다. validation_data 매개 변수에 검증 데이터를 전달한다.

<br>

### 모델 훈련하기

```python
history = model.fit(
    partial_x_train,
    partial_y_train,
    batch_size=512,
    epochs=20,
    validation_data=(x_val, y_val)
)

# 결과 
# Epoch 1/20
# 30/30 [==============================] - 5s 101ms/step - loss: 0.5917 - accuracy: 0.7208 - val_loss: 0.3967 - val_accuracy: 0.8669
# Epoch 2/20
# 30/30 [==============================] - 1s 40ms/step - loss: 0.3279 - accuracy: 0.9040 - val_loss: 0.3090 - val_accuracy: 0.8845
# Epoch 3/20
# 30/30 [==============================] - 1s 39ms/step - loss: 0.2295 - accuracy: 0.9322 - val_loss: 0.2791 - val_accuracy: 0.8921
# Epoch 4/20
# 30/30 [==============================] - 1s 34ms/step - loss: 0.1800 - accuracy: 0.9429 - val_loss: 0.2863 - val_accuracy: 0.8848
# Epoch 5/20
# 30/30 [==============================] - 1s 30ms/step - loss: 0.1427 - accuracy: 0.9577 - val_loss: 0.2932 - val_accuracy: 0.8849
# Epoch 6/20
# 30/30 [==============================] - 1s 30ms/step - loss: 0.1190 - accuracy: 0.9653 - val_loss: 0.3049 - val_accuracy: 0.8815
# Epoch 7/20
# 30/30 [==============================] - 1s 33ms/step - loss: 0.0959 - accuracy: 0.9746 - val_loss: 0.3071 - val_accuracy: 0.8830
# Epoch 8/20
# 30/30 [==============================] - 1s 34ms/step - loss: 0.0835 - accuracy: 0.9760 - val_loss: 0.3244 - val_accuracy: 0.8805
# Epoch 9/20
# 30/30 [==============================] - 1s 32ms/step - loss: 0.0658 - accuracy: 0.9833 - val_loss: 0.3475 - val_accuracy: 0.8797
# Epoch 10/20
# 30/30 [==============================] - 1s 31ms/step - loss: 0.0512 - accuracy: 0.9894 - val_loss: 0.3719 - val_accuracy: 0.8758
# Epoch 11/20
# 30/30 [==============================] - 1s 32ms/step - loss: 0.0464 - accuracy: 0.9899 - val_loss: 0.4137 - val_accuracy: 0.8764
# Epoch 12/20
# 30/30 [==============================] - 1s 30ms/step - loss: 0.0338 - accuracy: 0.9931 - val_loss: 0.4296 - val_accuracy: 0.8764
# Epoch 13/20
# show more (open the raw output data in a text editor) 
# ...

# 30/30 [==============================] - 1s 31ms/step - loss: 0.0073 - accuracy: 0.9996 - val_loss: 0.6421 - val_accuracy: 0.8679
# Epoch 19/20
# 30/30 [==============================] - 1s 31ms/step - loss: 0.0072 - accuracy: 0.9992 - val_loss: 0.6577 - val_accuracy: 0.8669
# Epoch 20/20
# 30/30 [==============================] - 1s 33ms/step - loss: 0.0043 - accuracy: 0.9997 - val_loss: 0.7006 - val_accuracy: 0.8655
```

```python
history_dict = history.history
history_dict.keys()

# 결과
# dict_keys(['loss', 'accuracy', 'val_loss', 'val_accuracy'])
```

- Sequantial 클래스의 `fit()` 메서드는 주어진 입출력 데이터에 대해 지정한 횟수만큼 Neural Network를 훈련한다.
  - 훈련이 이루어질 때마다, Neural Network는 주어진 입력에 대해 주어진 출력값에 더 가까운 값을 출력하게 된다.
  - 훈련 진행 상황과 현재의 손실값을 반환한다.

<br>

### 훈련 결과 

```py
results = model.evaluate(x_test, y_test)
results

# 결과
# 782/782 [==============================] - 5s 7ms/step - loss: 0.7558 - accuracy: 0.8521
# [0.7557754516601562, 0.8520799875259399]
```

- accuracy : 84.9%
- **evaluate()** : 예측값과 관측값 사이의 손실값을 반환한다.
- `evaluate()` 메서드를 호출하면 손실 값(loss)을 출력한다.

<br>

### 훈련과 검증 손실 그리기

- `plt.clf()` : 그래프 초기화

```python
import matplotlib.pyplot as plt

history.history.keys()
# dict_keys(['loss', 'accuracy', 'val_loss', 'val_accuracy'])

accuracy = history.history['accuracy']
val_accuracy = history.history['val_accuracy']
loss = history.history['loss']
val_loss = history.history['val_loss']

epochs = range(1, len(loss) + 1)

fig = plt.figure(figsize=(20,10))
ax1 = fig.add_subplot(1, 2, 1)
plt.plot(epochs, accuracy, 'bo', label='Training accuracy')
plt.plot(epochs, val_accuracy, 'b', label='Validaion accuracy')
plt.title('Training and validation accuracy')
plt.xlabel('Epochs')
plt.ylabel('accuracy')
plt.legend()


ax1 = fig.add_subplot(1, 2, 2)
plt.plot(epochs, loss, 'bo', label='Training loss')
plt.plot(epochs, val_loss, 'b', label='Validaion loss')
plt.title('Training and validation loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()

plt.show()
```

![image](https://user-images.githubusercontent.com/78655692/143211008-513255d4-a096-46d3-a9c8-dff2b6919ab8.png)

<br>

## 3_4_5. 훈련된 모델로 새로운 데이터에 대해 예측하기

- `predict` 메서드를 사용해서 어떤 리뷰가 긍정일 확률을 **예측**할 수 있다.

```python
model.predict(x_test)

# 결과
# array([[0.00650245],
#        [1.        ],
#        [0.9879919 ],
#        ...,
#        [0.00318435],
#        [0.01397818],
#        [0.80801654]], dtype=float32)
```

<br>

## 정리 

- 원본 데이터를 신경망에 텐서로 주입하기 위해서는 꽤 많은 전처리가 필요하다.
- **(출력 클래스가 2개인) 이진 분류 문제에서 네트워크는 하나의 유닛과 sigmoid 활성화 함수를 가진 Dense 층으로 끝나야 한다. 이 신경망의 출력은 확률을 나타내는 0과 1 사이의 스칼라 값이다.**

<br>

## 3_5. 뉴스 기사 분류: 다중 분류 문제 

- **로이터(Reuter)** 뉴스를 46개의 상호 배타적인 토픽으로 분류하는 신경망을 만들어 본다.
- 클래스가 많기 때문에 이 문제는 **다중 분류**(multiclass classification)의 예이다.

<br>

- **단일 레이블 다중 분류**(single-label, multicalss classification) : 각 데이터 포인트가 정확히 하나의 범주로 분류 

- **다중 레이블 다중 분류**(multi-label, multiclass classification) : 각 데이터 포인트가 여러 개의 범주에 속할 때 분류

<br>

### 레이블을 벡터로 바꾸는 방법

1. 레이블의 리스트를 정수 텐서로 변환하는 것
2. 원-핫 인코딩을 사용 <b><span style="color:red">=범주형 인코딩(categorical encoding)</span></b>

<br>

```python
from tensorflow.keras.datasets import reuters
import numpy as np
from tensorflow.keras.utils import to_categorical
import matplotlib.pyplot as plt 
from tensorflow.keras import models, layers

(train_data, train_labels), (test_data, test_labels) = reuters.load_data(
    num_words=10000
)

# 8982개의 훈련 샘플과 2246개의 테스트 샘플이 있다.
print(len(train_data))
print(len(test_data))

# IMDB 리뷰처럼 각 샘플은 정수 리스트이다. (단어 인덱스)
print(train_data[0])
# 결과 값
# [1, 2, 2, 8, 43, 10, 447, 5, 25, 207, 270, 5, 3095, 111, 16, 369, 186, 90, 67, 7, 89, 5, 19, 
# 102, 6, 19, 124, 15, 90, 67, 84, 22, 482, 26, 7, 48, 4, 49, 8, 864, 39, 209, 154, 6, 151, 6, 83, 
# 11, 15, 22, 155, 11, 15, 7, 48, 9, 4579, 1005, 504, 6, 258, 6, 272, 11, 15, 22, 134, 44, 11, 15, 16, 
# 8, 197, 1245, 90, 67, 52, 29, 209, 30, 32, 132, 6, 109, 15, 17, 12]

# 로이터 데이터셋을 텍스트로 디코딩하기
word_index = reuters.get_word_index()
reverse_word_index = dict([(value, key) for (key, value) in word_index.items()])
decoded_newswire = ' '.join([reverse_word_index.get(i-3, '?') for i in train_data[0]])

# 샘플에 연결된 레이블은 토픽의 인덱스로 0과 45 사이의 정수이다.
print(train_labels[10]) # 3

# 데이터 준비

def vectorize_sequences(sequences, dimension=10000):
    results = np.zeros((len(sequences), dimension))
    for i, sequence in enumerate(sequences):
        results[i, sequence] = 1
    return results

x_train = vectorize_sequences(train_data) # 훈련 데이터 벡터 변환
x_test = vectorize_sequences(test_data)

# def to_one_hot(labels, dimension=46):
#     results = np.zeros((len(labels), dimension))
#     for i, label in enumerate(labels):
#         results[i, label] = 1
#     return results

# one_hot_train_labels = to_one_hot(train_labels) # 훈련 레이블 벡터 변환 
# one_hot_test_labels = to_one_hot(test_labels)

one_hot_train_labels = to_categorical(train_labels)
one_hot_test_labels = to_categorical(test_labels)

# 출력 클래스의 개수가 46개로 늘어났다. 출력 공간의 차원이 훨씬 커졌다.
# 16차원 공간은 46개의 클래스를 구분하기에는 너무 제약이 많기 때문에 64개의 유닛을 이용한다.

# 모델 정의하기
model = models.Sequential()
model.add(layers.Dense(64, activation='relu', input_shape=(10000,)))
model.add(layers.Dense(64, activation='relu'))
model.add(layers.Dense(46, activation='softmax'))

# 마지막 Dense 층의 크기가 46이다. 각 입력 샘플에 대해서 46차원의 벡터를 출력한다는 뜻이다.
# 이 벡터의 각 원소(각 차원)는 각기 다른 출력 클래스가 인코딩된 것이다.

# softmax -> 각 입력 샘플마다 46개의 출력 클래스에 대한 확률 분포를 출력한다.
# 즉, 46차원의 출력 벡터를 만들며 output[i]는 어떤 샘플이 클래스 i에 속할 확률이다.
# 46개의 값을 모두 더하면 1이 된다.

# 손실 함수 : categorical_crossentropy 
# 이 함수는 두 확률 분포 사이의 거리를 측정한다.
# 여기에서는 네트워크가 출력한 확률 분포와 진짜 레이블의 분포 사이의 거리이다.
# 두 분포 사이의 거리를 최소화하면 진짜 레이블에 가능한 가까운 출력을 내도록 모델을 훈련하게 된다.

# 모델 컴파일하기
model.compile(
    optimizer='rmsprop',
    loss='categorical_crossentropy',
    metrics=['accuracy'])

# 훈련 데이터에서 1000개의 샘플을 따로 떼어서 검증 세트로 사용한다.
# 검증 세트 준비하기
x_val = x_train[:1000]
partial_x_train = x_train[1000:]

y_val = one_hot_train_labels[:1000]
partial_y_train = one_hot_train_labels[1000:]

# 모델 훈련하기
history = model.fit(
    partial_x_train,
    partial_y_train,
    batch_size=512,
    epochs=9, # epochs가 9부터 과대적합이 일어나므로 9로 설정
    validation_data=(x_val, y_val)
)

results = model.evaluate(x_test, one_hot_test_labels)
print(results) # 약 78%의 정확도 
# [1.0235412120819092, 0.7849510312080383]


history.history.keys()
# dict_keys(['loss', 'accuracy', 'val_loss', 'val_accuracy'])

accuracy = history.history['accuracy']
val_accuracy = history.history['val_accuracy']
loss = history.history['loss']
val_loss = history.history['val_loss']

epochs = range(1, len(loss) + 1)

fig = plt.figure(figsize=(15,5))
ax1 = fig.add_subplot(1, 2, 1)
plt.plot(epochs, accuracy, 'bo', label='Training accuracy')
plt.plot(epochs, val_accuracy, 'b', label='Validaion accuracy')
plt.title('Training and validation loss')
plt.xlabel('Epochs')
plt.ylabel('accuracy')
plt.legend()


ax1 = fig.add_subplot(1, 2, 2)
plt.plot(epochs, loss, 'bo', label='Training loss')
plt.plot(epochs, val_loss, 'b', label='Validaion loss')
plt.title('Training and validation loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()

plt.show()

# 새로운 데이터에 대해 예측하기
predictions = model.predict(x_test)

print(predictions[0].shape) # (46,)
print(np.sum(predictions[0])) # 0.99999994
print(np.argmax(predictions[0])) # 3
```

<br>

![output](https://user-images.githubusercontent.com/78655692/151475436-296d4539-3f6f-43f2-a556-c9df0803baf5.png)

<br>

### 레이블과 손실을 다루는 다른 방법

- **정수 텐서로 변환하기**
- 정수 레이블을 사용할 때는 `sparse_categorical_corssentropy`를 사용하면 된다.

<script src="https://gist.github.com/ingu627/e0e6baa4556bda016b8ec809e7842afd.js"></script>

<br>

### 정리

- N개의 클래스로 데이터 포인트를 분류하려면 네트워크의 마지막 Dense 층의 크기는 N이어야 한다. 
- 단일 레이블, 다중 분류 문제에서는 N개의 클래스에 대한 확률 분포를 출력하기 위해 `softmax` 활성화 함수를 사용해야 한다. 
- 이런 문제에서는 항상 범주형 크로스엔트로피를 사용해야 한다. 이 함수는 모델이 출력한 확률 분포와 타깃 분포 사이의 거리를 최소화 한다. 
- 많은 수의 범주를 분류할 때 중간층의 크기가 너무 작아 네트워크에 정보의 병목이 생기지 않도록 해야 한다.

<br>

## 3_6. 주택 가격 예측: 회귀 문제

- **(boston_housing)보스턴 주택 가격 데이터셋**
- 1970년 중반 보스턴 외곽 지역의 범죄율, 지방세율 등의 데이터가 주어졌을 때 주택 가격의 중간 값을 예측해 본다.

<br>

### 보스턴 주택 데이터셋 로드하기 

- 13개의 수치 특성이 있다.

```python
from tensorflow.keras.datasets import boston_housing

(train_data, train_targets), (test_data, test_targets) = boston_housing.load_data()

print(train_data.shape)
print(test_data.shape)
print(train_targets)

# 결과 

# (404, 13)
# (102, 13)
# [15.2 42.3 50.  21.1 17.7 18.5 11.3 15.6 15.6 14.4 12.1 17.9 23.1 19.9
#  15.7  8.8 50.  22.5 24.1 27.5 10.9 30.8 32.9 24.  18.5 13.3 22.9 34.7
#  16.6 17.5 22.3 16.1 14.9 23.1 34.9 25.  13.9 13.1 20.4 20.  15.2 24.7
#  22.2 16.7 12.7 15.6 18.4 21.  30.1 15.1 18.7  9.6 31.5 24.8 19.1 22.
#  14.5 11.  32.  29.4 20.3 24.4 14.6 19.5 14.1 14.3 15.6 10.5  6.3 19.3
#  19.3 13.4 36.4 17.8 13.5 16.5  8.3 14.3 16.  13.4 28.6 43.5 20.2 22.
#  23.  20.7 12.5 48.5 14.6 13.4 23.7 50.  21.7 39.8 38.7 22.2 34.9 22.5
#  31.1 28.7 46.  41.7 21.  26.6 15.  24.4 13.3 21.2 11.7 21.7 19.4 50.
#  22.8 19.7 24.7 36.2 14.2 18.9 18.3 20.6 24.6 18.2  8.7 44.  10.4 13.2
#  21.2 37.  30.7 22.9 20.  19.3 31.7 32.  23.1 18.8 10.9 50.  19.6  5.
#  14.4 19.8 13.8 19.6 23.9 24.5 25.  19.9 17.2 24.6 13.5 26.6 21.4 11.9
#  22.6 19.6  8.5 23.7 23.1 22.4 20.5 23.6 18.4 35.2 23.1 27.9 20.6 23
# ...
```

<br>

## 3_6_2. 데이터 준비

- 특성별로 정규화를 한다.
- 주의할 점은 정규화할 때 사용한 값이 훈련 데이터에서 계산한 값이라는 것.
  - 머신 러닝 작업 과정에서 절대로 테스트 데이터에서 어떤 값도 사용해서는 안된다.

```python
# 데이터 정규화하기
mean = train_data.mean(axis=0)
train_data -= mean
std = train_data.std(axis=0)
train_data /= std

test_data -= mean
test_data /= std
```

<br>

## 3_6_3. 모델 구성 

- 샘플 개수가 적기 때문에 64개의 유닛을 가진 2개의 은닉 층으로 작은 네트워크를 구성하여 사용.

```python
from tensorflow.keras import models, layers

def build_model():
    model = models.Sequential()
    model.add(layers.Dense(
        64, activation='relu',
        input_shape=(train_data.shape[1],)))
    model.add(layers.Dense(64, activation='relu'))
    model.add(layers.Dense(1))
    model.compile(optimizer='rmsprop', loss='mse', metrics=['mae'])
    return model
```

- 이 네트워크의 마지막 층은 하나의 유닛을 가지고 있고 활성화 함수가 없다. (**선형 층**)
- 마지막 층이 순수한 선형이므로 <b><span style="color:red">네트워크가 어떤 범위의 값이라도 예측하도록 자유롭게 학습된다.</span></b>
- **MAE(mean absolute error)** : 예측과 타깃 사이 거리의 절댓값

<br>

## 3_6_4. K-겹 검증을 사용한 훈련 검증

- **K-겹 교차 검증**(K-fold cross-validation) : 데이터를 K개의 분할(즉 폴드(fold))로 나누고(일반적으로 K=4, K=5), K개의 모델을 각각 만들어 K-1개의 분할에서 훈련하고 나머지 분할에서 평가하는 방법
  - 모델의 검증 점수는 K개의 검증 점수 평균이 된다.

![image](https://user-images.githubusercontent.com/78655692/140815069-1a9c61c4-4d17-4b46-96e2-34e3ff0fd70a.png)

```python
# K-겹 검증하기 
import numpy as np 

k = 4
num_val_samples = len(train_data) // k
num_epochs = 100 
all_scores = []
for i in range(k):
    print('처리중인 폴드 #', i)
    val_data = train_data[i * num_val_samples: (i+1) * num_val_samples]
    val_targets = train_targets[i * num_val_samples: (i+1) * num_val_samples]
    
    partial_train_data = np.concatenate(
        [train_data[:i * num_val_samples],
         train_data[(i+1) * num_val_samples:]],
        axis=0)
    partial_train_targets = np.concatenate(
        [train_targets[:i * num_val_samples],
         train_targets[(i+1) * num_val_samples:]],
        axis=0)
    
    model = build_model()
    model.fit(
        partial_train_data, partial_train_targets,
        batch_size=1, epochs=1, verbose=0
    )
    val_mse, val_mae = model.evaluate(val_data, val_targets, verbose=0)
    all_scores.append(val_mae)

# 결과
# 처리중인 폴드 # 0
# 처리중인 폴드 # 1
# 처리중인 폴드 # 2
# 처리중인 폴드 # 3
```

- `build_model()` : 케라스 모델 구성(컴파일 포함)
- `verbose=0`이므로 훈련 과정이 출력되지 않는다.

```python
print(all_scores)
print(np.mean(all_scores))

# 결과
# [4.616418361663818, 4.768833160400391, 4.236837387084961, 5.337116718292236]
# 4.739801406860352

```

<br>

### 정리 

- 입력 데이터의 특성이 서로 다른 범위를 가지면 전처리 단계에서 각 특성을 개별적으로 스케일 조정해야 한다.
- 가용한 데이터가 적다면 K-겹 검증을 사용하는 것이 신뢰할 수 있는 모델 평가 방법이다.
- 가용한 훈련 데이터가 적다면 과대적합을 피하기 위해 은닉 층의 수를 줄인 모델이 좋다. (일반적으로 1개 또는 2개)

<br>

## References

- [케라스 창시자에게 배우는 딥러닝](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=173992478)    
- [점프 투 파이썬](https://wikidocs.net/16)
- [2. 간단한 신경망 만들기](https://codetorial.net/tensorflow/simple_neural_network.html)
- [3. 손실 함수 살펴보기](https://codetorial.net/tensorflow/basics_of_loss_function.html)