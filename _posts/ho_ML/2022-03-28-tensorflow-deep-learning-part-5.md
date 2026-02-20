---
layout: single
title: "핸즈온 머신러닝 14장: CNN 기반 컴퓨터 비전 핵심 개념 & 실전 팁"
excerpt: "part 2 신경망과 딥러닝 부분을 개인공부를 목적으로 내용 요약 및 정리한 글입니다. - 합성곱 신경망을 사용한 컴퓨터 비전"
categories: hands_on
tags: [python, tensorflow, DL, 텐서플로, 딥러닝, 합성곱, 필터, 풀링, 스트라이드, pooling, stride, cnn, 케라스, feature map, 핸즈온]
toc: true
sidebar_main: false
classes: wide

last_modified_at: 2022-04-17
redirect_from:
  - /ho_ML/TDL5/
---

<img align='right' width='200' height='200' src='https://user-images.githubusercontent.com/78655692/147628941-a1aeb296-324e-4a60-816b-e4cc6666d13e.png
'>
본 글은 [핸즈온 머신러닝 2판 (Hands-On Machine Learning with Scikit-Learn, keras & TensorFlow)] - (박해선 옮김) 책을 개인공부하기 위해 요약, 정리한 내용입니다. <br>전체 코드는 <https://github.com/ingu627/handson-ml2>에 기재했습니다.(원본 코드 fork) <br> 뿐만 아니라 책에서 설명이 부족하거나 이해가 안 되는 것들은 외부 자료들을 토대로 메꿔 놓았습니다. <br> 오타나 오류는 알려주시길 바라며, 도움이 되길 바랍니다. 
{: .notice--info}

**more info** <br><br> 1. 이미지 자료 : [formal.hknu.ac.kr](https://formal.hknu.ac.kr/handson-ml2/slides/handson-ml2-14-1.slides.html#/) <br> 2. [딥러닝을 위한 콘볼루션 계산 가이드](https://goo.gl/qvNTyu)
{: .notice--warning}


<br>

## 합성곱 신경망을 사용한 컴퓨터 비전

<br>

## 14.1 시각 피질 구조

- 원숭이들은 시각 피질 안의 많은 뉴런이 작은 **국부 수용장(local receptive field)**을 가진다.
  - 즉, 뉴런들이 시야의 일부 범위 안에 있는 시각 자극에만 반응한다는 뜻
  - 시각 피질의 국부 수용장은 수용장이라 불리는 시야의 작은 영역에 있는 특정 패턴에 반응한다.
  - 시각 신호가 연속적인 뇌 모듈을 통과하면서 뉴런이 더 큰 수용장에 있는 더 복잡한 패턴에 반응한다.

<img src="https://user-images.githubusercontent.com/78655692/160230824-2f0e940f-5d3f-4a2b-b6fe-fb5fe10f30a3.png" width="700"/>

<br>

## 14.2 합성곱 층

- **합성곱 층**은 완전연결층(fully-connected layer)과 달리 데이터의 형상을 유지하며 다음 계층으로 전달할 수 있다. [^1]
  - 이미지를 완전연결층으로 학습하면 과적합(overfitting)이 일어난다.[^5]
  - **합성곱 레이어**는 이미지 픽셀 사이의 관계를 고려한다.
  - **형상에 대해 특징(feature)만 뽑아서** 효율적으로 이미지 학습이 가능하다.
- 첫 번째 합성곱 층의 뉴런은 입력 이미지의 모든 픽셀에 연결되는 것이 아니라 합성곱 층 뉴런의 수용장 안에 있는 픽셀에만 연결된다.
  - 작은 저수준 특성에 집중
- 두 번째 합성곱 층에 있는 각 뉴런은 첫 번째 층의 작은 사각 영역 안에 위치한 뉴런에 연결된다.
  - 더 큰 고수준 특성으로 조합해나가도록 도와줌

<img src="https://user-images.githubusercontent.com/78655692/160231030-58a75f29-5423-48d4-a058-e325428707dc.png" width="500"/>

<br>

> **합성곱** : 한 함수가 다른 함수 위를 이동하면서 원소별 곱셈의 적분을 계산하는 수학 연산이다. <br> 이 연산은 푸리에 변환(Fourier transform) 및 라플라스 변환(Laplace transform)과 깊은 관계가 있으며 신호 처리 분야에서 많이 사용된다.

<br>

<img src="https://user-images.githubusercontent.com/78655692/160231421-c21426d0-b75d-49e7-b3f0-1ed58a20b587.png" width="500"/>

- **제로 패딩(zero padding)** : 높이와 너비를 이전 층과 같게 하기 위해 입력의 주위에 0을 추가
  - 위의 그림은 **층과 제로 패딩 사이의 연결**, code= `padding=SAME`

<br>

<img src="https://user-images.githubusercontent.com/78655692/160231714-1ca4e3da-7fb1-4cbc-9334-6d58fdf3a412.png" width="500"/>

- **스트라이드(stride)** : 한 수용장과 다음 수용장 사이 간격
  - 기능 : 출력 데이터의 출력 조정 

<br>

### 14.2.1 필터

- **필터 (합성곱 커널)** : 입력뉴런에 사용될 **가중치** 역할 수행
  - 필터의 모양과 크기가 국부수용장의 모양과 크기를 지정
  - 결국 딥러닝은 학습하면서 필터의 값을 찾는 것이다.

- **특성맵(feature map)** : 필터 각각을 사용하여 생성된 **출력값(=결과값)**
  - 각 특성지도의 픽셀이 하나의 뉴런에 해당
  - 필터에 포함된 모든 뉴런은 동일한 가중치와 편향 사용
  - 이 맵은 필터를 가장 크게 활성화시키는 이미지의 영역을 강조한다.
- 훈련하는 동안 합성곱 층이 자동으로 해당 문제에 가장 유용한 필터를 찾고 상위층은 이들을 연결하여 더 복잡한 패턴을 학습

<img src="https://user-images.githubusercontent.com/78655692/160232600-7cc79480-5b7d-42b8-85c9-617aa8f97aa8.png" width="550"/>

<br>

### 14.2.2 여러 가지 특성 맵 쌓기

- 각 특성 맵의 픽셀은 하나의 뉴런에 해당하고 하나의 특성 맵 안에서는 모든 뉴런이 같은 파라미터를 공유
  - 다른 특성 맵에 있는 뉴런은 다른 파라미터를 사용
  - 한 뉴런의 수용장은 이전 층에 있는 모든 특성 맵에 걸쳐 확장된다.
- **하나의 합성곱 층이 입력에 따라 필터를 동시에 적용하여 입력에 있는 여러 특성을 감지**

<br>

<img src="https://user-images.githubusercontent.com/78655692/160402706-cfc56512-9687-4c0b-9c41-9180c07488f7.png" width="500"/>

- **합성곱 층에 있는 뉴런의 출력 계산**
- $z_{i,j,k}$
- = $b_k+\sum_{u=0}^{f_h-1}\sum_{v=0}^{f_w-1}\sum_{k'=0}^{f_{n'}-1}x_{i',j',k'}\times w_{u,v,k',k}$
  - 여기서 $i'=i\times s_h + u$, $\ j'=j\times s_w+v$
  - 컬러 채널 : 빨강, 초록, 파랑(RGB)으로 3개 \| 흑백 채널 : 1개
  - $z_{i,j,k}$는 합성곱 층($l$층)의 $k$특성 맵에서 $i$행, $j$열에 위치한 뉴런의 출력
  - $s_h$, $s_w$ : 수직과 수평 스트라이드
  - $f_h$, $f_w$ : 수용장의 높이와 너비
  - $f_{n'}$ : 이전 층($l -1$층)에 있는 특성 맵의 수
  - $x_{i',j',k'}$ : $l-1$층의 $i'$행, $j'$열, $k'$특성 맵에 있는 뉴런의 출력
  - $b_k$ : ($l$레이어에 있는) $k$특성 맵의 편향
  - $w_{u,v,k',k}$ : $l$층의 $k$ 특성 맵에 있는 모든 뉴런과 (뉴런의 수용장에 연관된) $u$행, $v$열, 그리고 $k'$ 특성 맵에 위치한 입력 사이의 연결 가중치

<br>

<img src='https://user-images.githubusercontent.com/78655692/163717158-eadfdd06-8632-4ac4-a112-3afba9f4d3e4.gif' width=550> <br>이미지출처[^4]

- 필터의 각 커널은 각각의 입력 채널을 합성곱 연산을 통해 처리한다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/163717265-670b5b69-6085-49ec-9a88-854c607df25e.gif' width=550> <br>이미지출처[^4]

- 채널별로 연산된 특성맵은 하나로 합쳐져서 하나의 채널을 형성한다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/163717324-4d63cf2f-5d87-406c-a955-db5515313449.gif' width=250> <br>이미지출처[^4]
 
- 여기에 편향(bias)를 추가하여 최종 출력 채널을 생성한다. 


<br>

### 14.2.3 텐서플로 구현

- 각 입력 이미지 : [높이, 너비, 채널]형태의 3D 텐서
- 하나의 미니배치 : [미니배치 크기, 높이, 너비, 채널] 형태의 4D 텐서
- 합성곱 층의 가중치 : [$f_h, f_w, f_{n'}, f_n$] 형태의 4D 텐서
- 합성곱 층의 편향 : [$f_n$]형태의 1D 텐서

```python
from sklearn.datasets import load_sample_image
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt

# 샘플 이미지 로드
china = load_sample_image('china.jpg') / 255
flower = load_sample_image("flower.jpg") / 255
images = np.array([china, flower])
batch_size, height, width, channels = images.shape

filters = np.zeros(shape=(7, 7, channels, 2), dtype=np.float32)
filters[:, 3, :, 0] = 1 # 수직선
filters[3, :, :, 1] = 1 # 수평선

outputs = tf.nn.conv2d(images, filters, strides=1, padding='SAME') # 저수준 API에서 padding의 매개변수를 항상 대문자로!

plt.imshow(outputs[0, :, :, 1], cmap='gray') # 첫번째 이미지의 두 번째 특성 맵 선택
plt.show()

```

<img src="https://user-images.githubusercontent.com/78655692/160413165-5d50b986-d980-4a06-bf32-bc89349ee944.png" width="350"/>

<br>

- `keras.layers.Conv2D` 사용

```python
# 3x3개의 필터 32개, padding='same'은 제로 패딩 사용
conv = keras.layers.Conv2D(filters=32, kernel_size=3, strides=1,
                           padding='same', activation='relu')
```

<br>

## 14.3 풀링 층

- **풀링 층(pooling layer)**의 목적 : 계산량과 메모리 사용량, 파라미터 수를 줄이기 위해 입력 이미지의 부표본(subsample)을 만들기 위해
  - 풀링 층의 각 뉴런은 이전 층의 작은 사각 영역의 수용장 안에 있는 뉴런의 출력과 연결되어 있다.
- **최대 풀링 층(max pooling layer)**을 통해 각 수용장에서 가장 큰 입력값이 다음 층으로 전달되고 다른 값은 버려진다.
  - 특징맵(feature map)의 크기를 절반으로 줄여준다.
  - 큰 특징들만 추출. 즉, 점점 샘플링해서 줄여주는 역할
  - 계산량, 메모리 사용량을 줄어준다.
  - 많은 정보를 잃게 되지만 그대로 잘 작동된다.

<br>

```python
# 최대 풀링 층(2x2 풀링 커널, 스트라이드 2, 패딩 X)
tf.keras.layers.MaxPool2D(
    pool_size=(2, 2), strides=None, padding='valid', data_format=None
)
```

<img src="https://user-images.githubusercontent.com/78655692/160415531-1d9736f3-eb5d-42f9-a1d8-5070834606ba.png" width="500"/>

<br>

- 최대 풀링은 작은 변화에도 일정 수준의 **불변성(invariance)**을 만들어준다.

<img src="https://user-images.githubusercontent.com/78655692/160416360-0304ac7c-38eb-4f57-ab35-dcc3c450949b.png" width="500"/>

<br>

- **평균 풀링 층(average pooling layer)** : AvgPool2D 사용 
  - 하지만 최대 풀링층에 비해 성능이 떨어짐
- **전역 평균 풀링 층(global average pooling layer)** : 각 특성 맵의 평균을 계산

    ```python
    global_avg_pool = keras.layers.GlobalAvgPool2D()
    ```

<br>

### CNN Architecture

![image](https://user-images.githubusercontent.com/78655692/163704871-45b74475-afd8-4a4b-98dd-0b2617511109.png) <br> 이미지출처[^2]

<br>

![image](https://user-images.githubusercontent.com/78655692/163705028-0d51ec05-f875-475a-ac6d-968091c3c188.png) <br> 이미지출처[^3]

- **출력 크기 계산 : (N-F+2P)/S + 1**
  - N : input size
  - F : filter
  - P : padding
  - S : stride

## 14.4 CNN 구조

- 전형적인 CNN 구조 : 합성곱 층을 몇 개 쌓고(각각 ReLU 층을 그 뒤에 놓고), 그다음에 풀링층을 쌓고, 그다음에 또 합성곱 층(+ReLU)을 몇 개 더 쌓고, 그다음에 다시 풀링 층을 쌓는 식.

<img src="https://user-images.githubusercontent.com/78655692/160418640-3e77e1cc-371d-4051-9ce5-9d77d71288ad.png" width="700"/>

<br>

```python
# 다음은 패션 MNIST 데이터셋에 대한 CNN

model = keras.models.Sequential([
    DefaultConv2D(filters=64, kernel_size=7, input_shape=[28, 28, 1]), # filter:7x7인 64개를 의미, stride:1, image:28x28, 하나의 컬러채널:1 => [28,28,1] 
    keras.layers.MaxPooling2D(pool_size=2), # 공간 방향 차원을 절반으로 줄임
    DefaultConv2D(filters=128), # 풀링 층 다음에 필터 개수를 두 배로 늘리는 것이 일반적인 방법
    DefaultConv2D(filters=128),
    keras.layers.MaxPooling2D(pool_size=2),
    DefaultConv2D(filters=256),
    DefaultConv2D(filters=256),
    keras.layers.MaxPooling2D(pool_size=2),
    keras.layers.Flatten(),
    keras.layers.Dense(units=128, activation='relu'),
    keras.layers.Dropout(0.5), # 밀집 층 사이에 과대적합을 줄이기위해 드롭아웃 사용
    keras.layers.Dense(units=64, activation='relu'),
    keras.layers.Dropout(0.5),
    keras.layers.Dense(units=10, activation='softmax'),
])
```

<br>

### 14.4.1 LeNet-5

- 자세한 내용은 [LeNet-5 사이트 참고](http://yann.lecun.com/exdb/lenet/index.html)

<img src="https://user-images.githubusercontent.com/78655692/160420673-9a10abf3-d67f-4ec8-a450-4b978432ab0a.png" width="700"/>

<br>

### 14.4.2 AlexNets

- 자세한 내용은 [LSVRC 사이트 참고](https://image-net.org/challenges/LSVRC/#:~:text=The%20ImageNet%20Large%20Scale%20Visual,image%20classification%20at%20large%20scale.&text=Another%20motivation%20is%20to%20measure,indexing%20for%20retrieval%20and%20annotation.)

![image](https://user-images.githubusercontent.com/78655692/160421851-7f682d11-e4d9-4117-9c58-d1022d476658.png)

- LeNet과 비슷하지만, AlexNet은
1. max pooling, ReLU 비선형을 썼다.
2. 데이터가 더 많고 더 큰 모델이다.
3. GPU로 구현했다.
4. dropout 규제를 활용했다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/174039900-594eabb3-6834-4d07-b5cd-e30e0afd2938.png' width=700> <br> 이미지출처 [^1]

<br>

- 두 가지 규제 기법 사용 (과대적합을 줄이기 위해)
  1. 훈련하는 동안 F9과 F10의 출력에 드롭아웃을 50% 비율로 적용
  2. 데이터 증식(Data Augmentation) 사용

  <img src="https://user-images.githubusercontent.com/78655692/160422690-a998bc1a-17ff-4660-9cbf-5a1cdd47f1b4.png" width="350"/>

- C1과 C3 층의 ReLU 단계 후에 바로 **LRN(local response normalization)** 정규화 사용
  - 뉴런의 출력값을 보다 경쟁적으로 만드는 정규화 기법
  - 어떤 특성 지도에 속한 하나의 뉴런의 활성화 함수의 반환값이 클 경우 주변 특성지도의 동일한 위치에 뉴런의 활성화 함수값을 크게 만들어줌
- 식 : $b_i=a_i(k+\alpha\sum_{j=j_{low}}^{j_{high}}a_j^2)^{-\beta}$
  - 여기서 $j_{high}=min(i+\frac{r}{2},f_n-1)$
  - $j_{low}=max(0,i-\frac{r}{2})$
  - $b_i$ = $i$ 특성 맵, $u$행, $v$열에 위치한 뉴런의 정규화된 출력
  - $a_i$ = ReLU 단계를 지나고 정규화 단계는 거치기 전인 뉴런의 활성화 값
  - $k, \alpha, \beta, r$ : 하이퍼파라미터, $k$=편향, $r$=깊이 반경
  - $f_n$ = 특성 맵의 수

<br>

### 14.4.3 GoogLeNet

- **인셉션 모듈(inception module)** 서브 네트워크 사용 
  - 수용적 필드 크기와 연산이 다른 병렬(parallel) 경로는 feature map의 stack에서 희소(sparse) 상관 관계 패턴을 캡처하는 것을 의미한다.

  ![image](https://user-images.githubusercontent.com/78655692/160424823-e4e59d8e-9f36-4b3b-9ad0-291a261c069a.png)

  - ex. 3x3+1(S) : 3x3 커널, stride 1, 'same' 패딩
  - 모든 합성곱 층은 ReLU 활성화 함수를 사용한다.
  - 둘째 층은 다양한 패턴을 다양한 스케일로 파악하기 위한 용도

<br>

  ![image](https://user-images.githubusercontent.com/78655692/174094645-a9b50d9a-b92c-49fb-aab1-c6685da6b61e.png)

  - 하지만 보다시피 파라미터 수가 엄청 많아져 엄청난 계산이 요구된다.
  - 또한 pooling 레이어는 feature depth를 보존하는데 concatenation 후 총 depth는 모든 레이어에서만 증가할 수 있다는 의미이다.
  - 따라서 1x1 커널 사용 층을 사용하는데, 깊이별 패턴을 확인하며, 다른 합성곱 층과 연계하는 역할 수행한다.
    - 값비싼 컨볼루션에 들어가기 전에 치수(dimension) 감소를 위해 1x1 컨볼루션을 사용한다.
    
<br>

  ![image](https://user-images.githubusercontent.com/78655692/160425239-9f5da110-7322-442d-bb84-0dd0e60162ed.png)

<br>

### 14.4.4 VGGNet

![image](https://user-images.githubusercontent.com/78655692/174040823-4dfb4e99-9fa8-4f6f-9db3-c2051f4fe0fe.png) <br> 이미지출처 [^2]

- (2~3개의 합성곱 층+풀링층)의 단순 반복
- VGGNet 종류에 따라 총 16개 또는 19개의 합성곱 층이 있다.
- 밀집 네트워크는 2개의 은닉층과 출력층으로 이루어진다.
- 3x3 필터만 사용
  - 왜 그럴까?
  - Answer : 3개의 3x3 컨볼루션 레이어의 스택은 하나의 7x7 컨볼루션 레이어와 동일한 효과적인 수용 필드(receptive field)를 갖는다.
  - 깊어질수록, 더 많은 비선형 함수가 더 많이 들어가서 decision function이 더 잘 학습된다. [^3]
  - 그리고 7x7 컨볼루션보다 더 적은 파라미터로 학습할 수 있다.

<br>

### 14.4.5 ResNet

- **잔차 네트워크(Residual Network)** 사용
- 우승한 네트워크는 152개 층으로 구성된 극도로 깊은 CNN 사용(ResNet-152)
- 이런 깊은 네트워크를 훈련시킬 수 있는 핵심 요소는 **스킵 연결(skip connection)**
  - 어떤 층에 주입되는 신호가 상위 층의 출력에도 더해진다.
- **잔차 학습(Residual Learning)** : 신경망을 훈련시킬 때는 목적 함수 h(x)를 모델링하는 것이 목표인데, 입력 x를 네트워크의 출력에 더한다면(=스킵 연결 추가) 네트워크는 h(x)대신 f(x)=h(x)-x를 학습
- 일반적인 신경망을 초기화할 때는 가중치가 0에 가깝기 때문에 네트워크도 0에 가까운 값을 출력한다.
- 스킵 연결을 추가하면 이 네트워크는 입력과 같은 값을 출력한다.

- **잔차 유닛(residual unit)** : 스킵 연결을 가진 작은 신경망

![image](https://user-images.githubusercontent.com/78655692/160428399-46e26455-a55b-4f65-ba39-ae5c98020463.png)

<br>

- RU를 활용한 잔차학습으로 스킵 연결로 인한 보다 수월한 학습 가능
- 
![image](https://user-images.githubusercontent.com/78655692/160428750-2a427d47-b736-4c81-85c2-bf637c6ccc02.png)

<br>

- **ResNet** 구조

![image](https://user-images.githubusercontent.com/78655692/160429004-d13c396b-3f2e-4065-bfbe-88f1493333de.png)

- GoogLeNet과 똑같이 시작하고 종료하지만 중간에 단순한 잔차 유닛을 매우 깊게 쌓았다.

<br>

![image](https://user-images.githubusercontent.com/78655692/160429318-66098142-d3c6-4078-8610-1c686dc2e42e.png)

- 특성 맵의 수는 몇 개의 잔차 유닛마다 두 배로 늘어남
- 반면 높이와 너비는 절반이 된다.
  - 이러한 경우 입력과 출력의 크기가 다르기 때문에 입력이 잔차 유닛의 출력에 바로 더해질 수 없다.
  - 이 문제를 해결하기 위해 stride 2이고 출력 틍성 맵의 수가 같은 1x1 합성곱 층으로 입력을 통과시킴 (위의 그림)

<br>

- **Inception-v4** : GooLeNet + ResNet 모델의 합성

<br>

### 14.4.6 Xception

- extreme inception을 의미
- GooLeNet + ResNet But 인셉션 모듈 대신 **깊이별 분리 합성곱 층(depthwise separable convolution layer)** 사용
  - 공간별 패턴인식 합성곱 층과 깊이별 패턴인식 합성곱 층을 분리하여 연속적으로 활용
  - 공간별 패턴인식 : 형태 인식(입력 특성지도마다 한개만 탐색)
  - 깊이별 패턴인식 : 채널 사이의 패턴 인식(1x1 필터 사용)
- 분리 합성곱 층은 입력 채널마다 하나의 공간 필터만 가지기 때문에 입력층에 많은 채널(특성맵)가 존재할 경우에만 활용

![image](https://user-images.githubusercontent.com/78655692/160430859-8edceeba-3a42-49c1-a0df-a2aba6de28b9.png)

<br>

- **Xception 구조**

![image](https://user-images.githubusercontent.com/78655692/160431424-18286b92-3659-4c26-b9e6-a04c86a6039c.png)

<br>

### 14.4.7 SENet

- GoogLeNet + ResNet
- GoogLeNet의 인셉션 모듈 또는 ResNet의 잔차유닛에 SE block을 추가하여 성능 향상

![image](https://user-images.githubusercontent.com/78655692/160432271-ff52d040-cb7f-4065-aed5-8fbab4530e1d.png)

<br>

- SE 블록이 추가된 부분의 유닛의 출력을 깊이 차원에 초점을 맞추어 분석한다.
- SE block은 입력된 특성 지도를 대상으로 깊이별 패턴 특성 분석한다.
  - 패턴 특성들을 파악한 후 출력값 보정한다.
  - ex. 입과 코 특성 맵이 강하게 활성되고 눈 특성 맵만 크게 활성화되지 않았을 경우 눈 특성 맵의 출력 강화한다.

![image](https://user-images.githubusercontent.com/78655692/160432468-3ec4cd88-1c07-4fb0-842f-9f98516d3d56.png)


<br>

- **SE block 구조**

![image](https://user-images.githubusercontent.com/78655692/160432866-cde38684-e277-4b7b-9796-fada99e7cda1.png)

- 첫째 밀집 층 : 뉴런 수를 1/16로 줄임 -> 특성맵들 사이의 연관성 학습 강요
- 둘째 밀집 층 : 뉴런 수를 정상화시킴 -> 학습된 연관성을 이용하여 입력 특성지도를 보정할 가중치 출력

<br>

## 14.5 케라스를 사용해 ResNet-34 CNN 구현하기

- 먼저 **ResidualUnit** 층 만들기 (그림 참고)

![image](https://user-images.githubusercontent.com/78655692/160429318-66098142-d3c6-4078-8610-1c686dc2e42e.png)

```python
import tensorflow as tf

class ResidualUnit(tf.keras.layers.Layer):
    def __init__(self, filters, strides=1, activation='relu', **kwargs):
        super().__init__(**kwargs)
        self.activation = tf.keras.activations.get(activation)
        self.main_layers = [
            tf.keras.layers.Conv2D(filters, 3, strides=strides,
                                   padding='same', use_bias=False),
            tf.keras.layers.BatchNormalization(),
            self.activation,
            tf.keras.layers.Conv2D(filters, 3, strides=1,
                                   padding='same', use_bias=False),
            tf.keras.layers.BatchNormalization()
            ]
        self.skip_layers = []
        if strides > 1:
            self.skip_layers = [
                tf.keras.layers.Conv2D(filters, 1, strides=strides,
                                       padding='same', use_bias=False),
                tf.keras.layers.BatchNormalization()
            ]
    
    def call(self, inputs):
        Z = inputs
        for layer in self.main_layers:
            Z = layer(Z)
        skip_Z = inputs
        for layer in self.skip_layers:
            skip_Z = layer(skip_Z)
        return self.activation(Z + skip_Z)
```

<br>

- 이 네트워크는 연속되어 길게 연결된 층이기 때문에 Sequential 클래스를 사용해 ResNet-34 모델을 만들 수 있다.

<br>

```python
model = tf.keras.models.Sequential()
model.add(tf.keras.layers.Conv2D(64, 7, strides=2, input_shape=[224, 224, 3],
                                 padding='same', use_bias=False))
model.add(tf.keras.layers.BatchNormalization())
model.add(tf.keras.layers.Activation('relu'))
model.add(tf.keras.layers.MaxPool2D(pool_size=3, strides=2, padding='same'))
prev_filters = 64
for filters in [64] * 3 + [128] * 4 + [256] * 6 +[512] * 3:
    strides = 1 if filters == prev_filters else 2
    model.add(ResidualUnit(filters, strides=strides))
    prev_filters = filters
model.add(tf.keras.layers.GlobalAvgPool2D())
model.add(tf.keras.layers.Flatten())
model.add(tf.keras.layers.Dense(10, activation='softmax'))
```

- `model.summary()`

<img src='https://user-images.githubusercontent.com/78655692/162778564-01de3a8d-1ed2-486b-a564-88ee08614ab1.png' width=450>



<br>

## 14.6 케라스에서 제공하는 사전훈련된 모델 사용하기

- `keras.applications` 패키지에서 사전훈련된 모델을 가져올 수 있다.
- ex)

```python
model= tf.keras.applications.resnet50.ResNet50(weights='imagenet')
# ResNet-50 모델을 만들고 이미지넷 데이터셋에서 사전훈련된 가중치를 다운로드
```

<br>

```python
images_resized = tf.image.resize(images, [224, 224])
# 적재한 이미지의 크기를 바꿈

inputs = tf.keras.applications.resnet50.preprocess_input(images_resized * 255)
# preprocess_input() : 모델마다 이미지를 전처리 해줌

Y_proba = model.predict(inputs)
# 예측
```

<br>

## 14.7 사전훈련된 모델을 사용한 전이 학습

```python
import tensorflow_datasets as tfds

dataset, info = tfds.load('tf_flowers', as_supervised=True, with_info=True)
# with_info=True : 데이터셋에 대한 정보 얻기
dataset_size = info.splits['train'].num_examples
class_names = info.features['label'].names
n_classes = info.features['label'].num_classes
```

<br>

```python
test_set_raw, valid_set_raw, train_set_raw = tfds.load(
    "tf_flowers",
    split=["train[:10%]", "train[10%:25%]", "train[25%:]"],
    as_supervised=True)
# 모델 나누기
```

<br>

```python
def preprocess(image, label):
    resized_image = tf.image.resize(image, [224, 224]) # 크기 조정
    final_image = tf.keras.applications.xception.preprocess_input(resized_image) # 이미지 전처리
    return final_image, label
```

<br>

```python
batch_size = 32
train_set_raw = train_set_raw.shuffle(1000)

# 배치 크기 정함 & 프리패츠 적용
train_set = train_set_raw.map(preprocess).batch(batch_size).prefetch(1)
valid_set = valid_set_raw.map(preprocess).batch(batch_size).prefetch(1)
test_set = test_set_raw.map(preprocess).batch(batch_size).prefetch(1)
```

<br>

```python
base_model = tf.keras.applications.xception.Xception(weights='imagenet',
                                                     include_top=False)
# include_top=False : 네트워크의 최상층에 해당하는 전역 평균 풀링 층과 밀집 출력 층을 제외                                                    
avg = tf.keras.layers.GlobalAveragePooling2D()(base_model.output)
output = tf.keras.layers.Dense(n_classes, activation='softmax')(avg)
model = tf.keras.Model(inputs=base_model.input, outputs=output)
```

<br>


```python
# 사전훈련된 층의 가중치 동결
for layer in base_model.layers:
    layer.trainable = False
```

<br>

```python
# 모델을 컴파일하고 훈련 시작
optimizer = tf.keras.optimizers.SGD(lr=0.2, momentum=0.9, decay=0.01)
model.compile(loss='sparse_categorical_crossentropy', optimizer=optimizer,
              metrics=['accuracy'])
history = model.fit(train_set, epochs=5, validation_data=valid_set)
```

<br>

```python
# 모델을 몇 번의 에포크 동안 훈련하는 것은 새로 추가한 최상위 층을 훈련했다는 의미.add()# 다시 모든 층의 동결을 해제하고 훈련을 계속한다.

for layer in base_model.layers:
    layer.trainable = True

optimizer = tf.keras.optimizers.SGD(lr=0.01, momentum=0.9, decay=0.001)
model.compile(loss='sparse_categorical_crossentropy', optimizer=optimizer,
              metrics=['accuracy'])
history = model.fit(train_set, epochs=10, validation_data=valid_set)
```

<br>

## References

[^1]: [06. 합성곱 신경망 - Convolutional Neural Networks - EXCELSIOR](https://excelsior-cjh.tistory.com/180?category=940400)
[^2]: [A Framework for Designing the Architectures of Deep Convolutional Neural Networks](https://www.mdpi.com/1099-4300/19/6/242)
[^3]: [06. 합성곱 신경망 - Convolutional Neural Networks - EXCELSIOR](https://excelsior-cjh.tistory.com/180?category=940400)
[^4]: [Intuitively Understanding Convolutions for Deep Learning](https://towardsdatascience.com/intuitively-understanding-convolutions-for-deep-learning-1f6f42faee1)
[^5]: [컨볼루션 신경망 (ConvNet)](http://aikorea.org/cs231n/convolutional-networks/)