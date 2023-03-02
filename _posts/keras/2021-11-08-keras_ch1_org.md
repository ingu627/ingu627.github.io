---
layout: single
title: "[케라스(keras) 이해] 1장. 딥러닝이란 무엇인가"
excerpt: "케라스 창시자에게 배우는 딥러닝 - 역사, 분류, 특징"
categories: keras
tag : [python, keras, DL, ML, AI, 인고지능, 딥러닝, 케라스, 리뷰, 정리, 이해, 모델, 케라스 창시자에게 배우는 딥러닝]
toc: true
sidebar_main: false
classes: wide

last_modified_at: 2022-03-28
---

<img align='right' width='200' height='200' src='https://user-images.githubusercontent.com/78655692/147629300-4d7acc5e-225a-454a-92cd-4da82f6828f6.png
'>
본 글은 [케라스 창시자에게 배우는 딥러닝] - (박해선 옮김) 책을 개인공부하기 위해 요약, 정리한 내용입니다. <br>전체 코드는 [https://github.com/ingu627/deep-learning-with-python-notebooks](https://github.com/ingu627/deep-learning-with-python-notebooks)에 기재했습니다.(원본 코드 fork) <br> 뿐만 아니라 책에서 설명이 부족하거나 이해가 안 되는 것들은 외부 자료들을 토대로 메꿔 놓았습니다. 즉, 딥러닝은 이걸로 끝을 내보는 겁니다. <br> 오타나 오류는 알려주시길 바라며, 도움이 되길 바랍니다.
{: .notice--info}

<br>
<br>
<br>
<br>

## 1_1. 인공 지능과 머신 러닝, 딥러닝

### 1_1_1. 인공지능

- **인공지능** : 보통의 사람이 수행하는 지능적인 작업을 자동화하기 위한 연구 활동
  - AI는 머신 러닝과 딥러닝을 포괄하는 종합적인 분야

<br>
<br>

### 1_1_2. 머신러닝

- **머신러닝** : 데이터(샘플)와 이 데이터로부터 기대되는 해답을 입력하면 데이터 처리 작업을 위한 실행 규칙을 찾는다. 다음과 같은 세 가지가 필요
  1. 입력 데이터 포인트
  2. 기대 출력
  3. 알고리즘의 성능을 출력하는 방법
- 머신 러닝과 딥러닝의 핵심 문제는 의미 있는 데이터로의 변환
  - 입력 데이터를 기반으로 기대 출력에 가깝게 만드는 유용한 표현을 학습하는 것
- 전통적인 프로그래밍에서는 규칙(프로그램)과 이 규칙에 따라 처리될 데이터를 입력하면 해답이 출력된다.
- 머신 러닝에서는 데이터와 이 데이터로부터 기대되는 해답을 입력하면 규칙이 출력된다.
  - 이 규칙을 새로운 데이터에 적용하여 창의적인 답을 만들 수 있다.

<img src="https://user-images.githubusercontent.com/78655692/148672305-fb3e2ee5-949c-4d72-92f1-43e04097eb8a.png" width="400" alt="image"> 이미지출처: [^1]

<br>
<br>

### 1_1_3. 데이터에서 표현을 학습하기

- 머신 러닝 모델은 입력 데이터를 <b><span style="color:red">의미 있는</span></b> 출력으로 변환한다.
- 머신 러닝과 딥러닝의 핵심 문제는 의미 있는 데이터로의 변환이다.
- **표현** (representation) : <b><span style="color:red">데이터를 인코딩하거나 묘사하기 위해 데이터를 바라보는 다른 방법</span></b>
  - 컬러 이미지 -> RGB 포맷(빨간색-녹색-파란색), HSV 포맷(색상-채도-명도)
- 모든 머신 러닝 알고리즘은 주어진 작업을 위해 데이터를 더 유용한 표현으로 바꾸는 변환을 자동으로 찾는다.

![image](https://user-images.githubusercontent.com/78655692/148672671-cd8d543e-88ac-4194-8796-4e6a5b7777a0.png) 이미지출처: [^2]

<br>

- **학습 (Learning)** : <b><span style="color:red">더 나은 표현을 찾는 자동화된 과정</span></b>
- **머신 러닝 (Machine Learning)**은 <u>가능성 있는 공간을 사전에 정의하고 피드백 신호의 도움을 받아 입력 데이터에 대한 유용한 변환을 찾는 것이다.</u>

<br>
<br>

### 1_1_4. 딥러닝에서 '딥'이란 무엇일까?

<img src="https://user-images.githubusercontent.com/78655692/140679658-02c1c802-0557-4242-b5c1-501f6d104098.png" width="500" height="400" alt="image"/>

- **딥러닝 (Deep Learning)** : 머신 러닝의 특정한 한 분야로서 연속된 **층 (Layer)**에서 점진적으로 의미 있는 표현을 배우는 데 강점이 있으며, 데이터로부터 표현을 학습하는 새로운 방식 (=층 기반 표현 학습)
  - **딥 (deep)** : 연속된 층으로 표현을 학습한다는 개념
  - <b><span style="color:red">데이터로부터 모델을 만드는 데 얼마나 많은 층을 사용했는지</span></b>가 그 모델의 깊이가 된다.
- 딥러닝은 그냥 데이터로부터 표현을 학습하는 수학 모델일 뿐이다.
- 딥러닝은 기술적으로는 <u>데이터 표현을 학습하기 위한 다단계 처리 방식을 말한다.</u>
- 딥러닝에서는 기본 층을 겹겹이 쌓아 올려 구성한 신경망이라는 모델을 사용하여 표현 층을 학습한다.

<br>

![image](https://user-images.githubusercontent.com/78655692/148672904-a4bb9f66-d10a-4eb3-8b37-ac5dfe541229.png) 이미지출처: [^3]

<br>

- 심층 신경망을 정보가 연속된 필터를 통과하면서 순도 높게 정제되는 다단계 정보 추출 작업이다.

![image](https://user-images.githubusercontent.com/78655692/148672939-f044d555-0acd-4b56-a1a8-0b0cc6343de2.png) 이미지출처: [^4]

<br>
<br>

### 1_1_5. 그림 3개로 딥러닝의 작동 원리 이해하기

- 층에서 입력 데이터가 처리되는 상세 내용은 일련의 숫자로 이루어진 층의 **가중치 (weight)**에 저장되어 있다.
  - 어떤 층에서 일어나는 변환은 그 층의 가중치를 **파라미터 (parameter)**로 가지는 함수로 표현된다.
- **학습**은 <b><span style="color:red">주어진 입력을 정확한 타깃에 매핑하기 위해 신경망의 모든 층에 있는 가중치 값을 찾는 것을 의미.</span></b>

<br>

![image](https://user-images.githubusercontent.com/78655692/148672979-41d04c2e-76ad-4835-acff-a0bea5b6db69.png) 이미지출처: [^5]

<br>

- 목표 : <u>가중치의 정확한 값을 찾는 것</u>
- 신경망이 한 샘플에 대해 얼마나 잘 예측했는지 측정하기 위해 손실 함수가 <b><span style="color:red">신경망의 예측과 진짜 타킷의 차이를 점수로 계산</span></b> (**loss function**)
- 손실 점수를 피드백 신호로 사용하여 현재 샘플의 손실 점수가 감소되는 방향으로 가중치 값을 조금씩 수정
- 수정 과정은 역전파(backpropagation) 알고리즘을 구현한 옵티마이저(optimizer)가 담당

<br>

![image](https://user-images.githubusercontent.com/78655692/148673050-b9bf521b-2681-47a8-863e-813382a05775.png) 이미지출처: [^6]


<br>
<br>

## 1_2. 딥러닝 이전: 머신 러닝의 간략한 역사

<br>

### 서포트 벡터 머신 (SVM - Support Vector Machine)

- **SVM**은 <u>분류 문제를 해결하기 위해 2개의 다른 범주에 속한 데이터 포인트 그룹 사이에 좋은 결정 경계를 찾는다.</u>
- **결정 경계 (decision boundary)**는 <u>훈련 데이터를 2개의 범주에 대응하는 영역으로 나누는 직선이나 표면</u>
- 새로운 데이터 포인트를 분류하려면 결정 경계 어느 쪽에 속하는지를 확인하기만 하면 된다.

<img src='https://user-images.githubusercontent.com/78655692/148673149-e87e3960-0707-4a85-a546-37deff8156e7.png' width=250> 이미지출처: [^7]

- **커널 함수** : 원본 공간에 있는 두 데이터 포인트를 명시적으로 새로운 표현으로 변환하지 않고 타깃 표현 공간에 위치했을 때의 거리를 매핑해 주는 계산 가능 한 연산
  - SVM에서 학습되는 것은 분할 초평면 뿐이다.

<br>
<br>

### 결정 트리 (decision tree)

- 결정 트리는 플로차트 같은 구조를 가지며 입력 데이터 포인트를 분류하거나 주어진 입력에 대해 출력 값을 예측한다.

<img src='https://user-images.githubusercontent.com/78655692/148673196-d828fbce-ee98-4753-98f2-8d220dcaa669.png' width=400> 이미지출처: [^8]

<br>
<br>

### 랜덤 포레스트 (Random Forest)

- 결정 트리 학습에 기초한 것으로 안정적이고 실전에서 유용하다.
- 서로 다른 결정 트리를 만들고 그 출력을 앙상블하는 방법을 사용한다.

<br>
<br>

### 그래디언트 부스팅 머신 (gradient boosting machine)

- 그래디언트 부스팅 머신은 약한 예측 모델인 결정 트리를 앙상블하는 것을 기반으로 하는 머신 러닝 기법
- 알고리즘은 이전 모델에서 놓친 데이터 포인트를 보완하는 새로운 모델을 반복적으로 훈련함으로써 머신 러닝 모델을 향상하는 방법인 그래디언트 부스팅(gradient boosting)을 사용한다.

<br>
<br>

### Training, Validation and Test

![image](https://user-images.githubusercontent.com/78655692/142379924-138ab694-c7e1-4291-9ac8-016ad2132700.png) 이미지출처 : [^9]

![image](https://user-images.githubusercontent.com/78655692/142379989-22f13744-4120-4775-967a-9390c0dc06fd.png) 이미지출처 : [^10]
  
- **Training set(훈련 데이터)**은 모델을 학습하는데 사용된다.
- **Validation set(검정 데이터)**은 training set으로 만들어진 모델의 성능을 측정하기 위해 사용된다. 
- **Test set(테스트 데이터)**은 validation set으로 사용할 모델이 결정 된 후, 마지막으로 딱 한번 해당 모델의 예상되는 성능을 측정하기 위해 사용된다.

<br>
<br>

### 딥러닝의 특징

1. 층을 거치면서 점진적으로 더 복잡한 표현이 만들어 진다
2. 이런 점진적인 중간 표현이 공동으로 학습된다.

- **단순함** : 딥러닝은 특성 공학이 필요하지 않아 복잡하고 불안정한 많은 엔지니어링 과정을 엔드-투-엔드로 훈련시킬 수 있는 모델로 바꾸어 준다. 
- **확장성** : 딥러닝 모델은 작은 배치 데이터에서 반복적으로 훈련되기 때문에 어떤 크기의 데이터셋에세도 훈련될 수 있다.
- **다용도와 재사용성** : 딥러닝 모델은 처음부터 다시 시작하지 않고 추가되는 데이터로도 훈련할 수 있다.

<br>
<br>

## References

- [케라스 창시자에게 배우는 딥러닝](https://tensorflow.blog/)

[^1]: <https://thebook.io/006975/part01/ch01/01/02-02/>
[^2]: <https://thebook.io/006975/part01/ch01/01/03-02/>
[^3]: <https://thebook.io/006975/part01/ch01/01/04-02/>
[^4]: <https://thebook.io/006975/part01/ch01/01/04-03/>
[^5]: <https://thebook.io/006975/part01/ch01/01/05-01/>
[^6]: <https://thebook.io/006975/part01/ch01/01/05-03/>
[^7]: <https://thebook.io/006975/part01/ch01/02/03-01/>
[^8]: <https://thebook.io/006975/part01/ch01/02/04/>
[^9]: <https://modern-manual.tistory.com/19>
[^10]: <https://modern-manual.tistory.com/19>