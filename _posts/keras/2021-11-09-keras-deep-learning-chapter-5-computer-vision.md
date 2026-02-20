---
layout: single
title: "케라스 5장: CNN 합성곱·풀링 계층과 데이터 증강 실전"
excerpt: "패딩·스트라이드·필터로 특징 계층화, overfitting 완화를 위한 증강(ImageDataGenerator) 전략 정리"
categories: keras
tags: [python, keras, DL, ML, AI, 인고지능, 딥러닝, 케라스, CV, 합성곱, 풀링, 필터, 컨브넷, ImageDataGenerator, 제너레이터, 증식, 리뷰, 정리, 이해, 모델, 케라스 창시자에게 배우는 딥러닝]
toc: true
sidebar_main: false
classes: wide

last_modified_at: 2025-09-27
redirect_from:
  - /keras/keras_ch5_org/
---

<img align='right' width='200' height='200' src='https://user-images.githubusercontent.com/78655692/147629300-4d7acc5e-225a-454a-92cd-4da82f6828f6.png
'>
본 글은 [케라스 창시자에게 배우는 딥러닝] - (박해선 옮김) 책을 개인공부하기 위해 요약, 정리한 내용입니다. <br>전체 코드는 [https://github.com/ingu627/deep-learning-with-python-notebooks](https://github.com/ingu627/deep-learning-with-python-notebooks)에 기재했습니다.(원본 코드 fork) <br> 뿐만 아니라 책에서 설명이 부족하거나 이해가 안 되는 것들은 외부 자료들을 토대로 메꿔 놓았습니다. 즉, 딥러닝은 이걸로 끝을 내보는 겁니다. <br> 오타나 오류는 알려주시길 바라며, 도움이 되길 바랍니다.
{: .notice--info}

<br>

## 5_1. 합성곱 신경망 소개

- 일반 DNN은 기본적으로 1차원 형태의 데이터를 사용한다. 때문에 이미지가 입력값이 되는 경우, 이것을 **flatten**시켜서 한줄 데이터로 만들어야 하는데 이 과정에서 <b><span style="color:red">이미지의 공간적/지역적 정보(spatial/topological information)가 손실된다.</span></b>
- 추상화과정 없이 바로 연산과정으로 넘어가 버리기 때문에 학습시간과 능률의 효율성이 저하된다.
- **CNN**은 이미지를 날것(raw input) 그대로 받음으로써 공간적/지역적 정보를 유지한 채 특성(feature)들의 계층을 빌드업한다.
- **CNN**의 중요 포인트는 이미지 전체보다는 **부분**을 보는 것, 그리고 이미지의 한 픽셀과 주변 픽셀들의 **연관성**을 살리는 것이다.

![image](https://user-images.githubusercontent.com/78655692/140931554-e3da83fa-233e-47bf-8a2d-87fb728a0ef1.jpg)

<br>

![image](https://user-images.githubusercontent.com/78655692/143213825-c1818923-7100-468d-a43f-8fb5833529f2.png)

- **합성곱 신경망**은 크게 **합성곱층 (Convolution layer)**과 **풀링층 (Pooling layer)**으로 구성

<br>

![image](https://user-images.githubusercontent.com/78655692/140943759-ffa78a7e-4d0e-4ba0-b614-abf7285f316a.png)

- **CONV**는 합성곱 연산을 의미하고, 합성곱 연산의 결과가 활성화 함수 **ReLU**를 지난다. 이 두 과정을 **합성곱층**이라고 한다. 그 후에 POOL이라는 구간을 지나는데 이는 풀링 연산을 의미하며 **풀링층**이라고 한다.

![image](https://user-images.githubusercontent.com/78655692/143215721-fd456b9d-3821-4668-8fa5-ebc96ec27293.png)

<br>

![image](https://user-images.githubusercontent.com/78655692/143215826-78a79147-eaf3-4eee-92e4-6d8567ac9b2d.png)

- `Conv2D`와 `MaxPooling2D`층의 출력은 <b><span style="color:red">(height, width, channels) 크기의 3D 텐서</span></b>이다.
  - 높이와 너비 차원은 네트워크가 깊어질수록 작아지는 경향이 있다.
  - 채널의 수는 Conv2D 층에 전달된 첫 번째 매개변수에 의해 조절된다.(32개 또는 64개)

![image](https://user-images.githubusercontent.com/78655692/140944365-adcafe9c-6f65-4e49-9944-a3ddecdfa35d.png)

- 위와 같이 결과는 변환 전에 가지고 있던 **공간적인 구조(spatial structure) 정보**가 유실된 상태이다.
  - 여기서 공간적인 구조 정보라는 것은 거리가 가까운 어떤 픽셀들끼리는 어떤 연관이 있고, 어떤 픽셀들끼리는 값이 비슷하거나 등을 포함하고 있다. 
- 결국 이미지의 공간적인 구조 정보를 보존하면서 학습할 수 있는 방법이 필요해졌고, 이를 위해 사용하는 것이 **합성곱 신경망**이다.

![image](https://user-images.githubusercontent.com/78655692/142873243-2b5a0196-2bb7-4142-9209-20dbcdbff2ac.png)

- <b><span style="color:red">CNN - activation - Pooling 과정을 통해 이미지 부분 부분의 주요한 Feature 들을 추출한다.</span></b>

<br>

## 5_1_1. 합성곱 연산

- **Dense층**은 입력 특성 공간에 있는 **전역 패턴**을 학습한다.
- **합성곱층**은 입력 특성 공간에 있는 **지역 패턴**을 학습한다.
  - 이미지일 경우 작은 2D 윈도우(window)로 입력에서 패턴을 찾는다. 
  - **이미지**는 에지(edge), 질감(texture) 등 지역 패턴으로 분해될 수 있다.

<br>

### 특징 

1. 학습된 패턴은 <b><span style="color:red">평행 이동 불변성</span></b>을 가진다.
   - 컨브넷이 이미지의 오른쪽 아래 모서리에서 어떤 패턴을 학습했다면 다른 곳에서도 이 패턴을 인식할 수 있다.
   - (완전 연결 네트워크는 새로운 위치에 나타난 것은 새로운 패턴으로 학습해야 한다.)
   - 적은 수의 훈련 샘플을 사용해서 일반화 능력을 가진 표현을 학습할 수 있다. 

2. **컨브넷**은 <b><span style="color:red">패턴의 공간적 계층 구조</span></b>를 학습할 수 있다.
   - 첫 번째 합성곱 층이 에지 같은 작은 지역 패턴을 학습한다.
   - 두 번째 합성곱 층은 첫 번째 층의 특성으로 구성된 더 큰 패턴을 학습한다.
   - 이런 방식을 사용하여 컨브넷은 매우 복잡하고 추상적인 시각적 개념을 효과적으로 학습할 수 있다. 

<br>

![image](https://user-images.githubusercontent.com/78655692/140944632-b37eae0e-93de-45a5-ad6a-0836e479297d.png)

![image](https://user-images.githubusercontent.com/78655692/140944935-dd80e126-2748-43b6-9a3c-d55224af03cf.png)


- 합성곱 연산은 **특성 맵**(feature map)이라고 부르는 3D 텐서에 적용된다.
  - <b><span style="color:red">이 텐서는 2개의 공간(높이와 너비)과 깊이 축(=채널)으로 구성된다.</span></b>
  - RGB 이미지는 3개의 컬러채널을 가지므로 깊이 축의 차원이 3이 된다. 
  - 흑백 이미지는 깊이 축의 차원이 1.
- 합성곱 연산은 입력 특성 맵에서 작은 패치들을 추출하고 이런 모든 패치에 같은 변환을 적용하여 **출력 특성 맵**을 만든다.

![image](https://user-images.githubusercontent.com/78655692/140945274-ac6bcdaf-2985-4139-b04e-9acba677f203.png)

- **특성 맵** : 입력으로부터 커널을 사용하여 합성곱 연산을 통해 나온 결과

<br>

- **필터 (filter)** : 입력 데이터의 어떤 특성을 인코딩한다.
  - 필터 하나의 크기는 `(patch_height, patch_width, input_depth)`이다. 
  - ex. (26, 26, 32) 크기의 특성 맵은 32개의 출력 채널 각각은 26 x 26 크기의 배열 값을 가진다. 
  - 입력에 대해 32개의 필터를 적용 (Conv2D의 첫 번째 매개변수(필터 또는 채널 수)가 추력 특성 맵의 깊이 차원을 결정)

![image](https://user-images.githubusercontent.com/78655692/148865621-a0eff1bd-c823-4244-b639-a3af67e37ceb.png)

<br>

### 2개의 파라미터 정의 

1. **입력으로부터 뽑아낼 패치의 크기** : 전형적으로 3x3 또는 5x5 크기를 사용한다.
2. **특성 맵의 출력 깊이** : 합성곱으로 계산할 필터의 수

- **특성맵 (feature map)** : <b><span style="color:red">입력으로부터 커널을 사용하여 합성곱 연산을 통해 나온 결과</span></b>

- 케라스의 Conv2D 층에서 이 파라미터는 `Conv2D(output_depth, (window_height, window_width))` 처럼 첫 번째와 두 번째 매개변수로 전달된다.
- 3D 특성 맵 위를 3x3 또는 5x5 크기의 윈도우가 슬라이딩(sliding)하면서 모든 위치에서 3D 특성 패치를 추출하는 방식으로 합성곱이 작동한다. 
- **패딩 (padding)** : <b><span style="color:red">입력 특성 맵의 가장자리에 적절한 개수의 행과 열을 추가</span></b>
  - 합성곱 연산 이후에도 특성 맵의 크기가 입력의 크기와 동일하게 유지되도록 하고 싶을 때 패딩을 쓴다.

![image](https://user-images.githubusercontent.com/78655692/140945555-5dbccced-09bd-47b3-88e1-e7e8d014e4d3.png)

- **스트라이드 (stride)** : <b><span style="color:red">필터를 적용하는 위치의 간격 (이동 범위)</span></b>

![image](https://user-images.githubusercontent.com/78655692/148866207-1ae93735-0b4a-4ad2-8282-d7bce2f1c4cf.png)


<br>

## 5_1_2. 최대 풀링 연산 

- 최대 풀링의 역할 : 강제적으로 특성 맵을 다운샘플링하는 것
  - 다운샘플링을 하는 이유는 <b><span style="color:red">처리할 특성 맵의 가중치 개수를 줄이기 위해서</span></b>
- **최대 풀링 (Max pooling)** : <b><span style="color:red">입력 특성 맵에서 윈도우에 맞는 패치를 추출하고 각 채널별로 최댓값을 출력한다.</span></b>
- CNN에서는 padding을 이용해서 사이즈를 보존해주되, 동시에 사이즈를 점점 줄어나가는 것이 중요하다.

<br>

![image](https://user-images.githubusercontent.com/78655692/148876665-72071825-4d17-4f0d-8ca6-500e4a957b36.png)

<br>

## 5_2. 소규모 데이터셋에서 밑바닥부터 컨브넷 훈련하기

- 캐글의 데이터 셋 불러오기 : [https://www.kaggle.com/c/dogs-vs-cats/data](https://www.kaggle.com/c/dogs-vs-cats/data)

<script src="https://gist.github.com/ingu627/163473deb65aec21af5810c38bc943e5.js"></script>

- `os.mkdir()` : 해당 주소에 폴더를 만든다.
- `shutil.rmtree` : 재귀적으로 폴더를 지운다. (존재하면)

<br/>

<script src="https://gist.github.com/ingu627/c9bed47f0d590e52549a844066b1d01a.js"></script>

- `os.path.join` : str들을 붙여준다.
- `shutil.copyfile(src, dst)` : 파일을 src에서 dst로 복사한다.

<br/>

<script src="https://gist.github.com/ingu627/5cfbe9baee00d40f0a62ab63dad3feb6.js"></script>

<br>

## 5_2_3. 네트워크 구성하기 

- `Conv2D`와 `MaxPooling2D`층을 번갈아 쌓은 컨브넷을 만든다.
- `Conv2D`와 `MaxPooling2D` 단계를 하나 더 추가하면 네트워크의 용량을 늘리고 Flatten 층의 크기가 너무 커지지 않도록 특성 맵의 크기를 줄일 수 있다.
- 150x150 크기(임의로 선택)의 입력으로 시작해서 Flatten 층 이전에 7x7 크기의 특성 맵으로 줄어든다.
- <b><span style="color:red">특성 맵의 깊이는 네트워크에서 점진적으로 증가하지만(32에서 128까지), 특성 맵의 크기는 감소한다.(150x150에서 7x7)</span></b>

<br>

### 강아지 vs 고양이 분류를 위한 소규모 컨브넷 만들기

<script src="https://gist.github.com/ingu627/a435ef91fdf1a5c4cab16f61b4a9ac05.js"></script>

![image](https://user-images.githubusercontent.com/78655692/141032969-7b4e3533-3f34-412b-9762-26b364cf73bf.png)

<br>

### 컨브넷 코드 파헤치기

![cnn1](https://user-images.githubusercontent.com/78655692/141250053-8f8d26c1-13de-465a-9681-42caaae3154d.jpg)

![cnn2](https://user-images.githubusercontent.com/78655692/141253732-d5c4b616-fd55-4ef4-b979-f4c8a8586930.jpg)

1. `model.add(layers.Conv2D(32, (3,3), activation='relu', input_shape=(150,150,3)))` -> (None, 148, 148, 32), param : 896
- `Convolution` : 이미지에 kernel이나 필터를 적용하는 과정
- `input_shape=(150, 150 ,3)`: image_height=150, image_width=150, 그리고 color_channels 는 3을 의미
- `activation='relu'`: relu 는 (Rectified Linear Unit의 약자). 보통 활성화 함수로 쓰이고, input값이 0이하이면 0으로 나타내고, input값이 양수이면 input값을 그대로 나타낸다. 
  - 비선형 문제를 해결하기 위해.
- 인풋값(150,150)이 no-padding을 통해 (148,148)로 줄어들었다.
- `(3,3)`: kernel이 3x3 격자무늬
- `32` : kernel 필터의 개수 (feature map이라고도 불리는 convolution 채널을 총 32개 가지게 된다.)
- `Param`의 의미 : R, G, B각각에 3x3 픽셀 kernel을 적용시켰는데, 3x3x3=27개의 픽셀과, bias kernel을 하나 가진다. 따라서 (27+1)x32=896
  - `parameter` 수 : (노드의 수) * (input의 차원) + (노드의 수)

2. `model.add(layers.MaxPooling2D((2,2)))` -> (None,74,74,32)
- `MaxPooling` : convoluted 이미지의 최댓값을 줄이는 것(=**downsampling**)
  - 2X2 kernel을 활용해 최댓값을 뽑는 작업
  - feature 개수는 그대로 32개. 이미지의 크기는 반으로 된다.

3. `model.add(layers.Conv2D(64, (3,3), activation='relu'))` -> (None,72,72,64), param : 18496
- `MaxPooling`을 적용한 74x74 feature map은 convoltion 필터를 통과하며 가장자리가 삭제되어 72x72으로 크기가 줄어든다.
- `convolution layer`는 3x3픽셀로 구성된 kernel을 64개 갖는다.
- `Param`의 의미 : 필터의 사이즈가 3x3이고 개수는 32개 -> (3*3*32+1)*64=18496
- 이 과정을 반복

4. `model.add(layers.Flatten())`    
`model.add(layers.Dense(512, activation='relu'))`    
`model.add(layers.Dense(1, activation='sigmoid'))`
- 분류하기 위해 `dense layer`가 필요. 이 레이어는 1차원 벡터를 갖기 때문에, 앞의 convolutional 레이어의 output을 조개야 한다. (=`layers.Flatten()`)
- 고양이와 강아지를 분류하기 때문에 `sigmoid` 함수 사용

<br>

### 모델의 훈련 선택

<script src="https://gist.github.com/ingu627/351fb628f5b6af5c4c7c590ae51feefb.js"></script>

<br>

## 5_2_4. 데이터 전처리

- JPEG 데이터가 네트워크에 주입하는 과정
    1. 사진 파일을 읽는다.
    2. JPEG 콘텐츠를 RGB 픽세 값으로 디코딩한다.
    3. 그다음 부동 소수 타입의 센서로 변환한다.
    4. 픽셀 값의 스케일을 [0,1] 사이로 조정한다. (**신경망은 작은 입력 값을 선호한다.**)

-> `keras.preprocessing.image`가 이런 단계를 자동으로 처리해준다.
- `ImageDataGenerator` 클래스는 디크스에 있는 이미지 파일을 전처리된 배치 텐처로 자동으로 바꾸어 주는 파이썬 제너레이터(generator)를 만들어 준다.
  - 파이썬 제너레이터(generator) : 특수한 반복자이며 yield 문을 사용하여 만든 경우를 제너레이터 함수, 소괄호와 리스트 내포 구문을 사용하는 경우를 제너레이터 표현식이라고 한다.

<br>

### ImageDataGenerator

- `ImageDataGenerator` : 이미지를 학습시킬 때 학습데이터의 양이 적을 경우 학습데이터를 조금씩 변형시켜서 학습데이터의 양을 늘리는 방식중에 하나이다.
  - `ImageDataGenerator()` - 객체 생성

<script src="https://gist.github.com/ingu627/6c216674682ac773907c86aa90995adb.js"></script>

- `flow_from_directory()` 메서드는 서브 디렉터리의 순서대로 레이블을 할당한다.
  - datagen 이라는 틀에 **flow** 함수를 사용해서 실제 데이터를 파라미터를 넣어주면 이미지 변형이 완료된다.

<script src="https://gist.github.com/ingu627/bf43bb3e009ccb2cc5fdfafc9dd21856.js"></script>

- `target_size` : 이미지 사이즈
- `batch_size` : 배치사이즈
- `class_mode` : Y 값 변화방법 ex) 'categorical'
- `color_mode` : 이미지 채널 수 ex) 'rgb'
- `shuffle` : 랜덤 여부

<br>

### 제너레이터를 사용한 데이터에 모델을 훈련시키기 

- `fit_generator` 메서드는 fit 메서드와 동일하되 데이터 제너레이터를 사용할 수 있다.
- 이 메서드는 첫 번째 매개변수로 입력과 타깃의 배치를 끝없이 반환하는 파이썬 제너레이터를 기대한다.
- 데이터가 끝없이 생성되기 때문에 케라스 모델에 하나의 에포크를 정의하기 위해 제너레이터로부터 얼마나 많은 샘플을 뽑을 것인지 알려주어야 한다.
  - `steps_per_epoch` 매개변수에서 이를 설정한다.
- 제러네이터부터 `steps_per_epoch`개의 배치만큼 뽑은 후, 즉 `steps_per_epoch` 횟수만큼 경사 하강법 단계를 실행한 후에 훈련 프로세스는 다음 에포크로 넘어간다.
- `validation_data`로 제너레이터를 전달하면 검증 데이터의 배치를 끝없이 반환한다.
- 따라서 검증 데이터 제너레이터에서 얼마나 많은 배치를 추추하여 평가할지 `validation_steps` 매개변수에 지정해야 한다.

<script src="https://gist.github.com/ingu627/e6195a13701f62aa147c6d5d23233c7a.js"></script>

- 훈련이 끝나면 항상 모델을 저장하는 것이 좋다.

<script src="https://gist.github.com/ingu627/c6c16545af1d4c898bad1d29b550b523.js"></script>


<script src="https://gist.github.com/ingu627/05793e4347c8047fb842c1340d944ed0.js"></script>

![image](https://user-images.githubusercontent.com/78655692/141060757-0463d4ad-1679-42e6-9895-fdfa6d474052.png)

<br>

## 내용 정리

- 비교적 훈련 샘플의 수(2000개)가 적기 때문에 과대적합이 가장 중요한 문제이다.
- 드롭아웃이나 가중치 감소(L2 규제)처럼 과대적합을 감소시킬 수 있는 방법들이 있다.
- 다음에서는 **데이터 증식**을 시도해 본다.

<br>

## 5_2_5. 데이터 증식 사용하기 

- **과대적합**은 학습할 샘플이 너무 적어 새로운 데이터에 일반화할 수 있는 모델을 훈련시킬 수 없기 때문에 발생한다.
- **데이터 증식**은 기존 훈련 샘플로부터 더 많은 훈련 데이터를 생성하는 방법이다.
  - 이 방법은 그럴듯한 이미지를 생성하도록 여러 가지 랜덤한 변환을 적용하여 샘플을 늘린다.
  - 훈련할 때 모델이 정확히 같은 데이터를 두 번 만나지 않도록 하는 것이 목표이다.
  - <b><span style="color:red">모델이 데이터의 여러 측면을 학습하면 일반화에 도움이 된다.</span></b>

- 케라스에서는 `ImageDataGenerator`가 읽은 이미지에 여러 종류의 랜덤 변환을 적용하도록 설정할 수 있다.

<script src="https://gist.github.com/ingu627/3271f210443549f32c23168af35005aa.js"></script>

- 여기까진 똑같이 해준다.

<br>

### ImageDataGenerator를 사용하여 데이터 증식 설정하기 

<script src="https://gist.github.com/ingu627/e92827892ac20c71fe2eb91544525df4.js"></script>

- `rotation_range` : 랜덤하게 사진을 **회전**시킬 각도 범위 (0~180사이)
- `width_shift_range` or `height_shift_range` : 사진을 수평과 수직으로 랜덤하게 평행 이동 시킬 범위 (전체 **너비**와 **높이**에 대한 비율)
- `shear_range` : 랜덤하게 전단 변환(shearing transformation)을 적용할 각도 범위 (**이미지 굴절**)
  - 전담 변환은 rotation_range로 회전할 때 y축 방향으로 각도를 증가시켜 이미지를 변형시킨다.
- `zoom_range` : 랜덤하게 사진을 **확대**할 범위 
- `horizontal_flip` : 랜덤하게 이미지를 수평으로 뒤집는다. (**반전**)
  - 수평 대칭을 가정할 수 있을 때 사용한다.
- `fill_mode` : 회전이나 가로/세로 이동으로 인해 새롭게 생성해야 할 픽셀을 채울 전략
  - `nearest`는 인접한 픽셀 사용
  - `constant`는 cval 매개변수 값 사용 
  - `reflect`는 wrap 사용

<br>

### 그외 파라미터 설정 

- `rescale`: 이미지의 픽셀 값을 조정
- `featurewise_center`: 데이터 세트에 대해 입력 평균을 0으로 설정여부 
- `samplewise_center`: 각 샘플 평균을 0으로 설정 여부 
- `featurewise_std_normalization`: 데이터 세트의 표준으로 입력을 나눌지 여부
- `samplewise_std_normalization`: 각 입력을 표준으로 나눌지 여부 

<br>

### 랜덤하게 증식된 훈련 이미지 그리기

<script src="https://gist.github.com/ingu627/79b4f985274d758d07e0587af13439ae.js"></script>


- `os.listdir` : 경로를 가져와 리스트형식으로 불러옴
- 파이썬에서 튜플이나 리스트 2개를 더하면 하나의 튜플로 연결된다.
- `flow()` 메서드는 배치 데이터를 기대하기 때문에 샘플 데이터에 배치 차원을 추가하여 4D 텐서로 만든다.

<br>

### 드롭아웃을 포함한 새로운 컨브넷 정의하기

- 적은 수의 원본 이미지는 새로운 정보를 만들어 낼 수 없고 단지 기존 정보의 재조합만 가능하다.
- 과대적합을 더 억제하기 위해 완전 연결 분류기 직전에 `Dropout` 층을 추가한다.

<script src="https://gist.github.com/ingu627/ccecf53beb0cca76de7f3c17ccb0dfe9.js"></script>

![image](https://user-images.githubusercontent.com/78655692/141126641-076d4dae-be77-4222-8ffd-9ae8e1935eea.png)

<br>

### 데이터 증식 제너레이터를 사용하여 컨브넷 훈련하기

- `flow()` 또는 `flow_from_directory()` 또는 `flow_from_dataframe()` 함수로 Numpy Array Iterator 객체를 만들어줌

<script src="https://gist.github.com/ingu627/b3497f45ec7babd26177e84f1245ab73.js"></script>

<br>

### 모델 저장하기

<script src="https://gist.github.com/ingu627/6b16e5df8dfc7d5727fad2fdeef01140.js"></script>

<br>

### 데이터 증식을 사용했을 때 훈련 정확도와 검증 정확도 

<script src="https://gist.github.com/ingu627/05793e4347c8047fb842c1340d944ed0.js"></script>


- 다른 규제 기법을 더 사용하고 네트워크의 파라미터를 튜닝하면(합성곱 층의 필터 수나 네트워크 층의 수 등) 더 높은 정확도를 얻을 수 있다.

## 5_3. 사전 훈련된 컨브넷 사용하기

- 작은 이미지 데이터셋에 딥러닝을 적용하는 일반적이고 매우 효과적인 방법은 사전 훈련된 네트워크를 사용하는 것이다.
- **사전 훈련된 네트워크**(pretrained network) : 대규모 이미지 분류 문제를 위해 대량의 데이터셋에서 미리 훈련되어 저장된 네트워크
- 학습된 특성을 다른 문제에 적용할 수 있는 유연성은 딥러닝의 핵심 장점이다.
- `ImageNet 데이터셋` : 1400만 개의 레이블된 이미지와 1000개의 클래스로 이루어진 데이터셋
- `VGG16` : 간단하고 ImageNet 데이터셋에 널리 사용되는 컨브넷 구조이다.
- 사전 훈련된 네트워크를 사용하는 두 가지 방법 : `특성 추출(feature extraction)` & `미세 조정(fine tuning)`

![image](https://user-images.githubusercontent.com/78655692/148877124-7c107b44-cea5-456b-b0e3-02f7d8e06bca.png) 이미지출처: [^1]


<br>

## 5_3_1. 특성 추출

- **특성 추출 (Feature extraction)** : <b><span style="color:red">사전에 학습된 네트워크의 표현을 사용하여 새로운 샘플에서 흥미로운 특성을 뽑아 내는 것</span></b>
  - 케라스에서 지원하는 모듈: VGG16, VGG19, Inception V3, ResNet50, Xception, MobilNet
- 이런 특성을 사용하여 새로운 분류기를 처음부터 훈련한다.

<br>

- **컨브넷**은 이미지 분류를 위해 두 부분으로 구성된다. 
- 먼저 연속된 합성곱과 풀링 층으로 시작해서 완전 연결 분류기로 끝난다. 
- 첫 번째 부분을 **합성곱 기반 층**이라고 부른다.
- 컨브넷의 경우 특성 추출은 사전에 훈련된 네트워크의 합성곱 기반 층을 선택하여 새로운 데이터를 통과시키고, 그 출력으로 새로운 분류기를 훈련한다.

![cnn3](https://user-images.githubusercontent.com/78655692/141314937-efa9de1a-fb6c-4919-b7f7-5d453efb318f.jpg)

- **합성곱 층에 의해 학습된 표현이 더 일반적이어서 재사용이 가능하다.**
- 컨브넷의 특성 맵은 사진에 대한 일반적인 콘셉트의 존재 여부를 기록한 맵
- (완전 연결 층들은 공간 개념을 제거하지만 합성곱의 특성 맵은 객체 위치를 고려한다.)
- 특성 합성곱 층에서 추출한 표현의 일반성(그리고 재사용성) 수준은 모델에 있는 층의 깊이에 달려 있다.
  - 모델의 하위 층은 (에지, 색깔, 질감 등) 지역적이고 매우 일반적인 특성 맵을 추출한다.
  - 모델의 상위 층은 좀 더 추상적인 개념을 추출한다.

<br>

### VGG16 합성곱 기반 층 만들기

<script src="https://gist.github.com/ingu627/97c9114c0fcd4c1ae386f46d3031a23e.js"></script>

- `weights` : 모델을 초기화할 가중치 체크포인트를 지정
- `include_top` : 네트워크의 최상위 완전 연결 분류기를 포함할지 안 할지 지정한다.
  - 기본값은 ImageNet의 클래스 1000개에 대응되는 완전 연결 분류기를 포함한다. 
- `input_shape` : 네트워크에 주입할 이미지 텐서의 크기
  - 이 매개변수는 선택 사항. 이 값을 지정하지 않으면 네트워크가 어떤 크기의 입력도 처리할 수 있다.

![image](https://user-images.githubusercontent.com/78655692/141317569-1d735a66-2d7b-467d-b08d-6ec10aaa0ccf.png)

<br>

### 데이터 증식을 사용하지 않는 빠른 특성 추출

<br>

### 사전 훈련된 합성곱 기반 층을 사용한 특성 추출하기

<script src="https://gist.github.com/ingu627/b25619e1386c8cd9d993ddc865dd5459.js"></script>

- `rescale = 1./255` : 값을 0과 1 사이로 변경
- 제너레이터는 루프 안에서 무한하게 데이터를 만들어 내므로 모든 이미지를 한 번씩 처리하고 나면 중지한다. (break)

<script src="https://gist.github.com/ingu627/9cc61794e45ca13356681abadc26698b.js"></script>

- 추출된 크기는 (samples, 4, 4, 512)이다. 완전 연결 분류기에 주입하기 위해서 먼저 (samples, 8192) 크기로 펼친다.

<br>

### 완전 연결 분류기를 정의하고 훈련하기 

<script src="https://gist.github.com/ingu627/9fe6c74fb0718644a875b9ca1bd9db72.js"></script>

- 완전 연결 분류기를 정의하고(규제를 위해 드롭아웃을 사용한다) 저장된 데이터와 레이블을 사용하여 훈련한다.

<br>

### 결과 그래프 그리기

<script src="https://gist.github.com/ingu627/05793e4347c8047fb842c1340d944ed0.js"></script>

![image](https://user-images.githubusercontent.com/78655692/141331305-bf73f19f-d62c-46c3-8952-eb7cff60491f.png)

<br>

### 데이터 증식을 사용한 특성 추출

- 이 방법은 훨씬 느리고 비용이 많이 들지만 훈련하는 동안 데이터 증식 기법 을 사용할 수 있다.
- `conv_base` 모델을 확장하고 입력 데이터를 사용하여 엔드-투-엔드로 실행한다.

<br>

### 합성곱 기반 층 위에 완전 연결 분류기 추가하기

<script src="https://gist.github.com/ingu627/f9d73a3cff473116495c955a00c47205.js"></script>

- 모델은 층과 동일하게 작동하므로 층을 추가하듯이 Sequential 모델에 다른 모델을 추가할 수 있다.

![image](https://user-images.githubusercontent.com/78655692/141343228-378bae9d-0007-4f31-b86b-1f7ff1a6890a.png)

- 모델을 컴파일하고 훈련하기 전에 합성곱 기반 층을 동결하는 것이 중요하다.
  - **동결** : 훈련하는 동안 가중치가 업데이트되지 않도록 막는다는 의미
- 이렇게 하지 않으면 합성곱 기반 층에 의해 사전에 학습된 표현이 훈련하는 동안 수정될 것이다.
- 맨 위의 Dense 층은 랜덤하게 초기화되었기 때문에 매우 큰 가중치 업데이트 값이 네트워크에 전파될 것이다. 
- 이는 사전에 학습된 표현을 크게 훼손한다.
- 케라스에서는 `trainable` 속성을 `False`로 설정하여 네트워크를 동결할 수 있다.

<script src="https://gist.github.com/ingu627/51c86f98acf2d64142f88ccb4374073b.js"></script>

- 이렇게 설정하면 추가한 2개의 Dense 층 가중치만 훈련된다. 
- 층마다 2개씩 총 4개의 텐서가 훈련된다.
- 변경 사항을 적용하려면 먼저 모델을 컴파일해야 한다.
- 컴파일 단계 후에 trainable 속성을 변경하면 반드시 모델을 다시 컴파일해야 한다.

<br>

### 동결된 합성곱 기반 층과 함께 모델을 엔드-투-엔드로 훈련하기

- **GPU 사용 권장**

<script src="https://gist.github.com/ingu627/a479aa62ca5380027bc8e12eda44f3f9.js"></script>

<script src="https://gist.github.com/ingu627/05793e4347c8047fb842c1340d944ed0.js"></script>

![image](https://user-images.githubusercontent.com/78655692/141347345-629c15e5-78bf-4d74-bee7-bc0a020f014f.png)

<br>

## 5_3_2. 미세 조정

- **미세 조정 (Fine tuning)** : 특성 추출에 사용했던 동결 모델의 상위 층 몇 개를 동결에서 해제하고 모델에 새로 추가한 층(여기서는 완전 연결 분류기)과 함께 훈련하는 의미.
  - 주어진 문제에 조금 더 밀접하게 재사용 모델의 표현을 일부 조정하기 때문에 미세 조정이라고 부른다. 

![cnn5](https://user-images.githubusercontent.com/78655692/141347912-542bc86c-c53f-4b97-a560-aacfdb42fbfd.jpg)

<br>

### 네트워크를 미세 조정하는 단계

1. 사전에 훈련된 기반 네트워크 위에 새로운 네트워쿼를 추가한다.
2. 기반 네트워크를 동결한다.
3. 새로 추가한 네트워크를 훈련한다.
4. 기반 네트워크에서 일부 층의 동결을 해제한다.
5. 동결을 해제한 층과 새로 추가한 층을 함께 훈련한다.

`conv_base.summary()`

![image](https://user-images.githubusercontent.com/78655692/141348344-81f3eb56-7705-4360-9ef4-4dde61e126ef.png)

- 마지막 3개의 합성곱 층을 미세 조정해본다.
- 즉, block4_pool까지 모든 층은 동결되고 block5_con1, block5_conv2, block5_conv3 층은 학습 대상이 된다.

<br>

### 특정 층까지 모든 층 동결하기

![image](https://user-images.githubusercontent.com/78655692/141348691-66a8ffd1-24e3-46e8-af27-8ee10da73dd7.png)

<script src="https://gist.github.com/ingu627/b97edafae422214100966a1753b112de.js"></script>

<br>

### GPU 사용 

<script src="https://gist.github.com/ingu627/4f00059d18434427910c24581f140a01.js"></script>

<br>

### 모델 미세 조정하기

- 학습률을 낮춘 RMSProp 옵티마이저를 사용한다.
- 학습률을 낮추는 이유는 미세 조정하는 3개의 층에서 학습된 표현을 조금씩 수정하기 위해서
- 변경량이 너무 크면 학습된 표현에 나쁜 영향을 끼칠 수 있다.

<script src="https://gist.github.com/ingu627/b587e9ff4ab9e1206e73910b1e107ff6.js"></script>

<script src="https://gist.github.com/ingu627/05793e4347c8047fb842c1340d944ed0.js"></script>

![image](https://user-images.githubusercontent.com/78655692/141351967-bf9cb694-6b3c-4d2f-b078-58382644d8bd.png)

<br>

### 부드러운 그래프 그리기

- 그래프를 보기 쉽게 하기 위해 **지수 이동 평균**으로 정확도와 손실 값을 부드럽게 표현할 수 있다.

<script src="https://gist.github.com/ingu627/5f2f635e3bc40057f8372ffad1fe79f1.js"></script>

![image](https://user-images.githubusercontent.com/78655692/141352028-67658686-9803-42af-a312-4ed0461ab644.png)

- 그래프는 개별적인 손실 값의 평균을 그린 것. 정확도에 영향을 미치는 것은 손실 값의 분포이지 평균이 아님을 유의.

<br>

### 테스트 데이터로 모델 평가 

<script src="https://gist.github.com/ingu627/f491a3ac00ac3752a327066e9473fce1.js"></script>

![image](https://user-images.githubusercontent.com/78655692/141352095-7e13f2f3-2adf-40fa-aa15-3b475d3d180f.png)

- **정확도 : 약 93.6%**

<br>

## 정리 

- 컨브넷은 컴퓨터 비전 작업에 가장 뛰어난 머신 러닝 모델이다. 아주 작은 데이터셋에서도 처음부터 훈련해서 괜찮은 성능을 낼 수 있다.
- 작은 데이터셋에서는 과대적합이 큰 문제이다. 데이터 증식은 이미지 데이터를 다룰 때 과대적합을 막을 수 있는 강력한 방법
- 특성 추출 방식으로 새로운 데이터셋에 기존 컨브넷을 쉽게 재사용할 수 있다.
- 특성 추출을 보완하기 위해 미세 조정을 사용할 수 있다.

<br>

## 5_4. 컨브넷 학습 시각화 

### 시각화 기법 

1. **컨브넷 중간층의 출력(중간층에 있는 활성화)을 시각화하기** : 연속된 컨브넷 층이 입력을 어떻게 변형시키는지 이해하고 개별적인 컨브넷 필터의 의미를 파악하는 데 도움이 된다.
2. **컨브넷 필터를 시각화하기** : 컨브넷의 필터가 찾으려는 시각적인 패턴과 개념이 무엇인지 상세하게 이해하는 데 도움이 된다.
3. **클래스 활성화에 대한 히트맵을 이미지에 시각화하기** : 이미지의 어느 부분이 주어진 클래스에 속하는 데 기여했는지 이해하고 이미지에서 객체 위치를 추정(localization)하는 데 도움이 된다.

<br>

## 5_4_1. 중간층의 활성화 시각화하기

- **중간층의 활성화 시각화**는 어떤 입력이 주어졌을 때 네트워크에 있는 여러 합성곱과 풀링 층이 출력하는 특성 맵을 그리는 것이다.
- 이 방법은 네트워크에 의해 학습된 필터들이 어떻게 입력을 분해하는지 보여 준다.
- 너비, 높이, 깊이(채널) 3개의 차원에 대해 특성 맵을 시각화하는 것이 좋다.
- 각 채널은 비교적 독립적인 특성을 인코딩하므로 특성 맵의 각 채널 내용을 독립적인 2D 이미지로 그리는 것이 방법

<br>

### 모델 로드

<script src="https://gist.github.com/ingu627/1893ee9988817fdc89ed3a8cf53cca80.js"></script>

![image](https://user-images.githubusercontent.com/78655692/141426913-9f4d62a0-2d8b-485d-b061-e05993e1d999.png)

<br>

### 개별 이미지 전처리하기 

<script src="https://gist.github.com/ingu627/90381ccce0ad1a30e0a4fc4b767a28ff.js"></script>

<br>

### 테스트 사진 출력하기 

<script src="https://gist.github.com/ingu627/242f5aa11383293b275d2fbab591deef.js"></script>

![image](https://user-images.githubusercontent.com/78655692/141429725-29994e99-1fd9-4c3f-bec7-f463517ac0e9.png)

<br>

### 입력 텐서와 출력 텐서의 리스트로 모델 객체 만들기

<script src="https://gist.github.com/ingu627/0cd28a68d9353f63e09e6dc2d5abd83a.js"></script>

- 확인하고 싶은 특성 맵을 추출하기 위해 이미지 배치를 입력으로 받아 모든 합성곱과 풀링 층의 활성화를 출력하는 케라스 모델을 만든다.
- `Model` 클래스로 반환되는 객체는 Sequential과 같은 케라스 모델이지만 특정 입력과 특정 출력을 매핑한다.
- `Model` 클래스를 사용하면 Sequential과는 달리 여러 개의 출력을 가진 모델을 만들 수 있다.
- 이 모델은 하나의 입력과 층의 활성화마다 하나씩 총 8개의 출력을 가진다.

<br>

### 예측 모드로 모델 실행하기 

<script src="https://gist.github.com/ingu627/0809e3b34b05968f244371aa5d30f92b.js"></script>

- 층의 활성화마다 하나씩 8개의 넘파이 배열로 이루어진 리스트를 반환한다.

<br>

### 20번째 채널 시각화하기 

<script src="https://gist.github.com/ingu627/8eb5f8ba49176c144e6ca602e0f2cfc1.js"></script>

- 32개의 채널을 가진 148x148 크기의 특성 맵이다. 
- 이 채널은 대각선 에지를 감지하도록 인코딩되었다.

![Image](https://user-images.githubusercontent.com/78655692/141429093-999032e0-7707-4fa9-9f4e-3165f4078a57.png)

<br>

### 16번째 채널 시각화하기

<script src="https://gist.github.com/ingu627/a61758354e32e1da838166e893afb6a9.js"></script>

- 이 채널은 `밝은 녹색 점`을 감지하는 거 같아 고양이 눈을 인코딩하기 좋다.

![image](https://user-images.githubusercontent.com/78655692/141429839-bb6de544-4c88-478f-8f0f-c09297c63a80.png)

<br>

### 중간층의 모든 활성화에 있는 채널 시각화하기 

<script src="https://gist.github.com/ingu627/4c326dd0da3af7fa94f9ad920b768b96.js"></script>

![image](https://user-images.githubusercontent.com/78655692/141440597-1159db65-3b8d-4be1-acff-a92c89d8370b.png)

- 상위 층으로 갈수록 활성화는 점점 더 추상적으로 되고 시각적으로 이해하기 어려워 진다. 
- 비어 있는 활성화가 층이 깊어짐에 따라 늘어난다. 첫 번째 층에서는 모든 필터가 입력 이미지에 활성화되었지만 층을 올라가면서 활성화되지 않는 필터들이 생긴다.
  - 필터에 인코딩된 패턴이 입력 이미지에 나타나지 않았다는 것을 의미한다.

<br>

## 5_4_2. 컨브넷 필터 시각화하기

- 컨브넷이 학습한 필터를 조사하는 또 다른 간편한 방법은 각 필터가 반응하는 시각적 패턴을 그려 보는 것이다.
- 빈 입력 이미지에서 시작해서 특정 필터의 응답을 최대화하기 위해 컨브넷 입력 이미지에 경사 상승법을 적용한다.
- 결과적으로 입력 이미지는 선택된 필터가 최대로 응답하는 이미지가 될 것이다.
- **경사 상승법**을 적용하여 이미지의 필터가 무엇을 인식하고 있는지 보는 것

<br/>

- **전체 과정**
1. 특정 합성곱 층의 한 필터 값을 최대화하는 손실 함수를 정의한다.
2. 이 활성화 값을 최대화하기 위해 입력 이미지를 변경하도록 확률적 경사 상승법을 사용한다.

<br>

### 피터 시각화를 위한 손실 텐서 정의하기 

<script src="https://gist.github.com/ingu627/8dd95bb1c2d5b5128e9f506434c832d4.js"></script>

<br>

### 그래이던트 정규화하기 

<script src="https://gist.github.com/ingu627/c0c4097ffa418c5604394b35d066b63a.js"></script>

- 경사 하강법 과정을 부드럽게 하기 위해 사용하는 한 가지 기법은 그래디언트 텐서를 L2 노름으로 나누어 정규화하는 것.
- 이렇게 하면 입력 이미지에 적용할 수정량의 크기를 항상 일정 범위 안에 놓을 수 있다.

<br>

### 입력 값에 대한 넘파이 출력 값 추출하기 

<script src="https://gist.github.com/ingu627/ad6523381ca6f34b4776e2186a35ecb4.js"></script>

- `iterate`는 넘파이 텐서(크기가 1인 텐서의 리스트)를 입력으로 받아 손실과 그래디언트 2개의 넘파이 텐서를 반환한다.

<br>

### 확률적 경사 상승법을 사용한 손실 최대화하기

<script src="https://gist.github.com/ingu627/c87233b3748091ae104aebeb74f5fc0d.js"></script>

- 이미지 텐서는 (1, 150, 150, 3) 크기의 부동 소수 텐서이다.

<br>

### 텐서를 이미지 형태로 변환하기 위한 유틸리티 함수 

<script src="https://gist.github.com/ingu627/8a1b21611b10aa608c1078b09cfcdbed.js"></script>

- `numpy.clip(a, a_min, a_max, out=None, **kwargs)` : min ~ max 범위 이외의 값은 모두 자른다. (범위에 맞춰준다.)

<br>

### 필터 시각화 이미지를 만드는 함수

<script src="https://gist.github.com/ingu627/72495d026b34ef3776f482e844eb7c23.js"></script>

- 위의 코드들을 모아서 층의 이름과 필터 번호를 입력으로 받는 함수를 만든다.

![image](https://user-images.githubusercontent.com/78655692/141673729-4b240b8d-1af7-4c6b-8ff1-17babf09d94c.png)

- block3_conv1 층의 필터 0은 물방울 패턴에 반응했다.

<br>

### 층에 있는 각 필터에 반응하는 패턴 생성하기 (수정)

<script src="https://gist.github.com/ingu627/d1095bd6c47fbf46ed6713cd6c7da066.js"></script>

![image](https://user-images.githubusercontent.com/78655692/141674350-bed2f74b-b6bf-467e-ae11-b23802b9a4fb.png)

- 에러가 났다. (이부분) 

- 컨브넷의 각 층은 필터의 조합으로 입력을 표현할 수 있는 일련의 필터를 학습한다.

<br>

## 5_4_3. 클래스 활성화의 히트맵 시각화하기 

- **클래스 활성화 맵**(Class Activation Map, CAM) : '입력 이미지가 각 채널을 활성화하는 정도'에 대한 공간적인 맵을 '클래스에 대한 각 채널의 중요도'로 가중치를 부여하여 '입력 이미지가 클래스를 활성화하는 정도'에 대한 공간적인 맵을 만드는 것
  - 입력 이미지가 주어지면 합성곱 층에 있는 특성 맵의 출력을 추출한다.
  - 그다음 특성 맵의 모든 채널 출력에 채널에 대한 클래스의 그래디언트 평균을 곱한다.

<br>

### 사전 훈련된 가중치로 VGG16 네트워크 로드하기 

<script src="https://gist.github.com/ingu627/585cbfe49ee3229842ef3ba4e2761a4b.js"></script>

<br>

### VGG16을 위해 입력 이미지 전처리하기

<script src="https://gist.github.com/ingu627/0d4511b783be6c4fe0e4aeea4078284c.js"></script>

![image](https://user-images.githubusercontent.com/78655692/141674756-07ce7fd7-d0d7-4ed3-a825-832b0bb0eb82.png)

- 이 이미지에서 사전 훈련된 네트워크를 실행하고 예측 벡터를 이해하기 쉽게 디코딩한다. 
- 아프리카 코끼리 (90%), 코끼리 (7%), 인도 코끼리 (0.4%) 예측
- 예측 벡터에서 최대로 활성화된 항목은 '아프리카 코끼리'클래스에 대한 것으로 386번 인덱스이다. 

<br>

### Grad-CAM 알고리즘 설정하기 

<script src="https://gist.github.com/ingu627/d0ade32798a38d89a5f27162764ff582.js"></script>

![image](https://user-images.githubusercontent.com/78655692/141675032-d6b88190-2884-4c53-bb50-dcf7c9da865f.png)

<br>

### 원본 이미지에 히트맵 덧붙이기 

<script src="https://gist.github.com/ingu627/ddb0232691e9894b4f237639d7bf6058.js"></script>

![image](https://user-images.githubusercontent.com/78655692/141675189-cdfb7f74-3d68-49f3-8222-edbbec835dff.png)


<br>

## References

- [케라스 창시자에게 배우는 딥러닝](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=173992478)  
- [딥러닝 CNN, 개념만 이해하기](https://www.youtube.com/watch?v=9Cu2UfNO-gw)
- [딥 러닝을 이용한 자연어 처리 입문 - 1) 합성곱 신경망(Convolution Neural Network)](https://wikidocs.net/64066)
- [CS231n Convolutional Neural Networks for Visual Recognition](https://cs231n.github.io/convolutional-networks/)
- [[딥러닝/머신러닝] CNN(Convolutional Neural Networks) 쉽게 이해하기](https://halfundecided.medium.com/%EB%94%A5%EB%9F%AC%EB%8B%9D-%EB%A8%B8%EC%8B%A0%EB%9F%AC%EB%8B%9D-cnn-convolutional-neural-networks-%EC%89%BD%EA%B2%8C-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-836869f88375)
- [[딥러닝]CNN(Convolutional Neural Networks)(1)](https://bigdaheta.tistory.com/48?category=975541)
- [[Tensorflow 2.0] 합성곱 신경망: CNN](https://ericabae.medium.com/tensorflow-2-0-%ED%95%A9%EC%84%B1%EA%B3%B1-%EC%8B%A0%EA%B2%BD%EB%A7%9D-cnn-bfd925298c9b)
- [[이미지 전처리]. ImageDataGenerator 클래스 : 이미지 제너레이터](https://acdongpgm.tistory.com/169)
- [[ML] Tensorflow.keras의 flow_from_directory, flow_from_dataframe 사용법](https://techblog-history-younghunjo1.tistory.com/261)
- [3. Convolutional Networks / L2. Convolutional Neural Networks - Pooling Layers](https://kevinthegrey.tistory.com/142)