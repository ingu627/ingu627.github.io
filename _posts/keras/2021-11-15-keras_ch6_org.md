---
layout: single
title: "케라스 6장: 텍스트·시퀀스 처리 - 임베딩·RNN·LSTM 핵심"
excerpt: "케라스 창시자에게 배우는 딥러닝 - 텍스트 데이터 다루기, 순환 신경망"
categories: keras
tags: [python, keras, DL, ML, AI, 인고지능, 딥러닝, 케라스, NLP, 자연어 처리, 텍스트, 원핫, RNN, 리뷰, 정리, 이해, 모델, 케라스 창시자에게 배우는 딥러닝]
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

## 6_1. 텍스트 데이터 다루기.

- 시퀀스 데이터를 처리하는 기본적인 딥러닝 모델은 **순환 신경망 (recurrent neural network)**과 **1D (1D convnet)** 두 가지이다.
- 텍스트는 가장 흔한 시퀀스 형태의 데이터이다. 단어의 시퀀스나 문자의 시퀀스로 이해할 수 있다. 
- 자연어 처리를 위한 딥러닝은 단어, 문장, 문단에 적용한 패턴 인식이다.
- <b><span style="color:red">딥러닝 모델은 수치형 텐서만 다룰 수 있다.</span></b>
- **텍스트 벡터화 (vectorrizing text)** : 텍스트를 수치형 텐서로 변환하는 과정
  - 텍스트를 단어로 나누고 각 단어를 하나의 벡터로 변환한다.
  - 텍스트를 문자로 나누고 각 문자를 하나의 벡터로 변환한다.
  - 텍스트에서 단어나 문자의 **n-그램**을 추출하여 각 n-그램을 하나의 벡터로 변환한다. 
    - **n-gram** : 연속된 단어나 문자의 그룹으로 텍스트에서 단어나 문자를 하나씩 이동하면서 추출
- **토큰 (token)** : 텍스트를 나누는 단위(단어, 문자, n-그램)
- **토큰화 (tokenization)** : 텍스트를 토큰으로 나누는 작업
- 모든 텍스트 벡터화 과정은 어떤 종류의 토관화를 적용하고 생성된 토큰에 수치형 벡터를 연결하는 것으로 이루어진다.
- 이런 벡터는 시퀀스 텐서로 묶여져서 심층 신경망에 주입된다.
- 토큰과 벡터를 연결하는 방법
  - 원-핫 인코딩 (one-hot encoding)
  - 토큰 임베딩 (token embedding)

<br>

### n-그램과 BoW

- **단어 n-그램** : 문장에서 추출한 N개의 연속된 단어 그룹.
- **가방 (bag)** : 다루고자 하는 것이 리스트나 시퀀스가 아니라 토큰의 집합을 의미. 특정한 순서가 없는데 이런 종류의 토큰화 방법을 **BoW**

<br>

## 6_1_1. 단어와 문자의 원-핫 인코딩 

- **원-핫 인코딩** : 모든 단어에 고유한 정수 인덱스를 부여하고 이 정수 인덱스 i를 크기가 N(어휘 사전의 크기)인 이진 벡터로 변환한다.
  - 이 벡터는 i번째 원소만 1이고 나머지는 모두 0이다. 

<br>

### 단어 수준의 원-핫 인코딩하기

<script src="https://gist.github.com/ingu627/9718fa6fae18c5c7c56f543f24040c73.js"></script>

<br>

### 문자 수준 원-핫 인코딩하기 

<script src="https://gist.github.com/ingu627/55c68a0220b767a51a32cfce7b879d4b.js"></script>

<br>

### 케라스를 사용한 단어 수준의 원-핫 인코딩하기

<script src="https://gist.github.com/ingu627/146f1ccee1a1fe3d29377ba348e84c72.js"></script>

![image](https://user-images.githubusercontent.com/78655692/141731087-21a7bc72-ed72-4227-9d4c-24e9c18e7031.png)

![image](https://user-images.githubusercontent.com/78655692/142895189-7ea3b23f-4fc0-408b-87b3-204570a88636.png)

- `Tokenizer` : 문장으로부터 단어를 토큰화하고 숫자에 대응시키는 딕셔너리를 사용할 수 있도록 한다.
-`fit_on_texts` : 문자 데이터를 입력받아서 리스트의 형태로 변환한다.
- `word_index ` : tokenizer의 word_index 속성은 단어와 숫자의 키-값 쌍을 포함하는 딕셔너리를 반환한다.

![image](https://user-images.githubusercontent.com/78655692/142895314-2f539154-3ffa-4343-acb8-e2689c744a48.png)

- `texts_to_sequences() ` : 텍스트 안의 단어들을 숫자의 시퀀스의 형태로 변환
- `texts_to_matrix()` : 텍스트를 시퀀스 리스트로 바꾸어 주는 texts_to_sequences() 메서드와 시퀀스 리스트를 넘파이 배열로 바꾸어 주는 sequences_to_matrix() 메서드를 차례대로 호출한다.
  - `mode` 매개변수에서 지원하는 값은 기본값 `binary`외에 `count`(단어의 출현 횟수), `freq`(출현 횟수를 전체 시퀀스의 길이로 나누어 정규화), `tfidf`(TF-IDF)가 있다.

<br>

### 해싱 기법을 사용한 단어 수준의 원-핫 인코딩하기

- 이 방식은 어휘 사전에 있는 고유한 토큰의 수가 너무 커서 모두 다루기 어려울 때 사용한다.
- 각 단어에 명시적으로 인덱스를 할당하고 이 인덱스를 딕셔너리에 저장하는 대신에 단어를 해싱하여 고정된 크기의 벡터로 변환한다.

<script src="https://gist.github.com/ingu627/ae076fe88617a895987d5fd7e92c87f0.js"></script>

<br>

## 6_1_2. 단어 임베딩 사용하기 

- 단어 임베딩 == 밀집 단어 벡터
- 원-핫 인코딩으로 만든 벡터는 희소(sparse)하고(대부분 0으로 채워진다) 고차원이다.(어휘 사전에 있는 단어의 수와 차원이 같다.)
- 반면에 단어 임베딩은 저차원의 실수형 벡터이다.(희소 벡터의 반대인 밀집 벡터이다.)

<br>

### Embedding 층을 사용하여 단어 임베딩 학습하기

- **단어 임베딩**은 언어를 기하학적 공간에 매핑하는 것이다.

![image](https://user-images.githubusercontent.com/78655692/141734235-8f1e039b-eb4f-48ac-be66-6c962f74f447.png)

- 단어 임베딩 공간은 전형적으로 이런 해석 가능하고 잠재적으로 유용한 수천 개의 벡터를 특성으로 가진다. 
- `Embedding Layer(임베딩 층)` : 가지고 있는 훈련 데이터 -> 처음부터 학습(Embedding)s

<br>

### Embedding 층의 객체 생성하기

<script src="https://gist.github.com/ingu627/52b53893a7334fba7e351bd12e33e634.js"></script>

- Embedding 층은 적어도 2개의 매개변수를 받는다. 가능한 토큰의 개수(여기서는 1000으로 단어 인덱스 최댓값 +1)와 임베딩 차원이다.
- **Embedding 층을 (특정 단어를 나타내는) 정수 인덱스를 밀집 벡터로 매핑하는 딕셔너리로 이해하면 된다.**
  - 정수를 입력으로 받아 내부 딕셔너리에서 이 정수에 연관된 벡터를 찾아 반환한다.
- 단어 인덱스 -> Embedding 층 -> 연관된 단어 벡터 

<br>

### 원리

- Embedding 층은 크기가 `(samples, sequence_length)`인 2D 정수 텐서를 입력으로 받는다. 각 샘플은 정수의 시퀀스이다. 가변 길이의 시퀀스를 임베딩할 수 있다.
  - 예를 들어 Embedding 층에 (32, 10) 크기의 배치(=길이가 10인 시퀀스 32개로 이루어진 배치)나 (64, 15) 크기의 배치(=길이가 15인 시퀀스 64개로 이루어진 배치)를 주입할 수 있다. 
  - 배치에 있는 모든 시퀀스는 길이가 같아야 하므로(하나의 텐서에 담아야 하기 때문에) 작은 길이의 시퀀스는 0으로 패딩되고 길이가 더 긴 시퀀스는 잘린다.
- Embedding 층은 크기가 `(samples, sequence_length, embedding_dimensionality)`인 3D 실수형 텐서를 반환한다.
  - 이런 텐서는 RNN 층이나 1D 합성곱 층에서 처리된다.
- Embedding 층의 객체를 생성할 때 가중치(토큰 벡터를 위한 내부 딕셔너리)는 다른 층과 마찬가지로 랜덤하게 초기화된다.
  - 훈련하면서 이 단어 벡터는 역전파를 통해 점차 조정되어 이어지는 모델이 사용할 수 있도록 임베딩 공간을 구성한다.
  - 훈련이 끝나면 임베딩 공간은 특정 문제에 특화된 구조를 많이 가지게 된다.
- **`Embedding(단어종류개수, 임베딩 벡터 차원, 문서(최대) 길이)`**

<br>

### IMDB 영화 리뷰 감성 예측 문제 적용해보기 

<script src="https://gist.github.com/ingu627/c20e02b4aa1c54c4345a6280c15df65b.js"></script>

- 영화 리뷰에서 가장 빈도가 높은 1만 개의 단어를 추출하고 리뷰에서 20개가 넘는 단어는 버린다.
- 이 네트워크는 1만 개의 단어에 대해 8차원의 임베딩을 학습하여 정수 시퀀스 입력(2D 정수 텐서)을 임베딩 시퀀스(3D 실수형 텐서)로 바꾼다.
- 그 다음 이 텐서를 2D로 펼쳐서 분류를 위한 Dense 층을 훈련한다.

![image](https://user-images.githubusercontent.com/78655692/142895411-527e6b55-aff5-4a0f-94cc-a29ad8aa171b.png)

- `pad_sequences` : 서로 다른 개수의 단어로 이루어진 문장을 같은 길이로 만들어주기 위해 패딩을 사용한다. 이 함수에 이 시퀀스를 입력하면 숫자 0을 이용해서 같은 길이의 시퀀스로 변환한다.
  - `padding` :  model에 데이터를 정형화하여 넣어줘야하기 때문에 최대 길이를 정하고, 이에 못미치는 굉장히 짧은 문장에 대해서는 0이라는 값으로 채워주며, 최대 길이를 넘어가는 문장에 대해서는 잘라내버리는 작업 
  - *옵션 값들*
  - `truncating= post/pre`: 문장의 길이가 maxlen보다 길 때, 뒷 / 앞 부분을 잘라준다. 
  -  `padding= post/pre`: 문장의 길이가 maxlen보다 길 때, 뒷 / 앗 부분을 잘라준다. 
  -  `maxlen` : 최대 문장 길이 정의 
- `Embedding(10000, 8, input_length=maxlen)` : 10000개의 개수(10000개의 단어 종류가 있다)를 입력 받아 (예를 들어 [0,1,0,0,...0]) -> 신경망(임베딩) 학습 -> 8차원 임베딩 벡터(출력의 차원)->  input_length는 한 번에 학습하고자 하는 문장의 길이를 의미. maxlen는 각 문서에 대해 패딩을 수행한 이후 최대 문서의 길이
  - 다시 해석: vocab_size=10000으로 정의되어 있기 때문에 단어들은 10000차원 공간안에 정의되어 있다고 볼 수 있다. 이를 8차원으로 내려 `Data Sparsity`를 해결하고 효율적으로 학습할 수 있도록 한다.

![image](https://user-images.githubusercontent.com/78655692/141738923-e285c39e-a909-46d0-b85c-0e2d4010f557.png)

<br>

## 6_1_3. 모든 내용을 적용하기: 원본 텍스트에서 단어 임베딩까지

### IMDB 원본 데이터 전처리하기

<script src="https://gist.github.com/ingu627/95ea16f59c4ed5844633a4878aa70aed.js"></script>

<br>

### 데이터 토큰화 

<script src="https://gist.github.com/ingu627/77ff463a95d6592a7faec248f4c6a76e.js"></script>

- `label을 np.array로 변환` : list 타입은 허용하지 않기 때문에, `labels`를 np.array로 변환 

<br>

### GloVe 단어 임베딩 내려받기

- [https://nlp.stanford.edu/projects/glove](https://nlp.stanford.edu/projects/glove) 들어가서 `glove.6B.zip` 다운 받기
- 그 후 datasets 폴더 아래에 파일의 압축 풀기

![image](https://user-images.githubusercontent.com/78655692/142385645-e713ca38-63e1-4e7c-b1c1-782a6678d739.png)

<br>

### GloVe 단어 임베딩 파일 파싱하기

<script src="https://gist.github.com/ingu627/106e48ab528a0ee163a64e97f88a2a0c.js"></script>

<br>

### GloVe 단어 임베딩 행렬 준비하기

<script src="https://gist.github.com/ingu627/a9b31684946660f9081ec3bce3ec1da7.js"></script>

<br>

### 모델 정의하기 

<script src="https://gist.github.com/ingu627/3523b10ebf9345843481b3ba94fc4cee.js"></script>

<br>

### 사전 훈련된 단어 임베딩을 Embedding 층에 로드하기 

- `Embedding` 층은 하나의 가중치 행렬을 가진다. 이 행렬은 2D 부동 소수 행렬이고 각 i번째 원소는 i번째 인덱스에 상응하는 단어 벡터이다.

<script src="https://gist.github.com/ingu627/5e1f5f3e4ed7dcf1e672400abb254ef2.js"></script>

<br>

### 훈련과 평가하기 

<script src="https://gist.github.com/ingu627/ed175d901d08c1b816419811362dd920.js"></script>

<br>

### 결과 그래프 그리기

<script src="https://gist.github.com/ingu627/05793e4347c8047fb842c1340d944ed0.js"></script>

![image](https://user-images.githubusercontent.com/78655692/142393519-81cb9d57-b91c-4f9c-b507-a04958710ec2.png)

<br>

## 6_2. 순환 신경망 이해하기

## RNN

- **순환 신경망**(Recurrent Neural Network, RNN)은 입력과 출력을 시퀀스 단위로 처리하는 모델이다.
- 시퀀스의 원소를 순회하면서 지금까지 처리한 정보를 **상태**(state)에 저장한다.
- RNN의 상태는 2개의 다른 시퀀스를 처리하는 사이에 재설정된다.
- 하나의 시퀀스가 여전히 하나의 데이터 포인트로 간주된다.
- 또 다른 정의로는 히든 노드가 방향을 가진 엣지로 연결돼 순환구조를 이루는(directed cycle) 인공신경망의 한 종류이다.
- 시퀀스 길이에 관계없이 인풋과 아웃풋을 받아들일 수 있는 네트워크 구조이기 때문에 필요에 따라 다양하고 유연하게 구조를 만들 수 있다는 점이 RNN의 가장 큰 장점이다.

> 용어는 비슷하지만 순환 신경망과 재귀 신경망(Recursive Neural Network)은 전혀 다른 개념이다.

![image](https://user-images.githubusercontent.com/78655692/142578699-9154e73c-9c09-4f1d-902a-6f69c4045699.png)

<br>

### 예시

![image](https://user-images.githubusercontent.com/78655692/142586146-148b0c31-5ea1-44b4-9af8-1243ad12f9f7.png)


<br>

### 의사코드로 표현한 RNN

<script src="https://gist.github.com/ingu627/b9678d05c8e5e41b3ecddfde2cbf9afe.js"></script>

> 해석
- 이 RNN은 크기가 (timesteps, input_features)인 2D 텐서로 인코딩된 벡터의 시퀀스를 입력받는다. 
- 이 시퀀스는 타임스텝을 따라서 반복한다. 
- 각 타임스텝 t에서 현재 상태와 (input_features,) 크기의 입력을 연결하여 출력을 계산한다.
- 그다음 이 출력을 다음 스텝의 상태로 설정한다. 
- f 함수는 입력과 상태를 출력으로 변환한다.

<br>

### 넘파이로 구현한 간단한 RNN 

<script src="https://gist.github.com/ingu627/4baf15b829c78253f4bc190f07e00271.js"></script>

<br>

## 6_2_1. 케라스의 순환 층

- 넘파이로 간단하게 구현한 과정이 실제 케라스의 `SimpleRNN` 층에 해당한다.
- `SimpleRNN`은 (batch_size, timesteps, input_features) 크기의 입력을 받는다.
- 케라스에 있는 모든 순환 층과 마찬가지로 `SimpleRNN`은 두 가지 모드로 실행할 수 있다.
  - *1.* 각 타임스텝의 출력을 모은 전체 시퀀스를 반환(크기가 (batch_size, timesteps, output_features)인 3D 텐서)
    - `return_sequences=True`
  - *2.* 입력 시쿤스에 대한 마지막 출력만 반환 (크기가 (batch_size, output_features))
- 이 모드는 객체를 생성할 때 `return_sequences` 매개변수로 선택할 수 있다.

<br>

### IMDB 데이터 전처리하기 

<script src="https://gist.github.com/ingu627/f33b7ee720beccb43c412846b409310b.js"></script>

<br>

### Embedding 층과 SimpleRNN 층을 사용한 모델 훈련하기

<script src="https://gist.github.com/ingu627/14cb9a366908c9c1e87770eb5178d58a.js"></script>

<br>

### 결과 그래프 그리기 

<script src="https://gist.github.com/ingu627/05793e4347c8047fb842c1340d944ed0.js"></script>

<br>

## 6_2_2. LSTM과 GRU 층 이해하기 

- `SimpleRNN`은 이론적으로 시간 t에서 이전의 모든 타임스텝의 정보를 유지할 수 있었다.
- 하지만 실제로는 긴 시간에 걸친 의존성은 학습할 수 없는 것이 문제이다.
  - 층이 많은 일반 네트워크에서 나타는 것과 비슷한 현상인 **그래디언트 소실 문제** 때문이다.
    - **그래디언트 소실 문제** : 관련 정보와 그 정보를 사용하는 지점 사이 거리가 멀 경우 역전파시 그래디언트가 점차 줄어 학습능력이 크게 저하되는 것
- `LSTM`은 RNN의 히든 state에 cell-state를 추가한 구조이다. (정보를 여러 타임스텝에 걸쳐 나르는 방법이 추가된다.)
- 나중을 위해 정보를 컨베이어 벨터 의에 정보를 저장함으로써 처리 과정에서 오래된 시그널이 점차 소실되는 것을 막아 준다.
- **LSTM 셀의 역할은 과거 정보를 나중에 다시 주입하여 그래디언트 소실 문제를 해결하는 것이다.**



<br>

### 케라스에서 LSTM 층 사용하기

<br>

<img src="https://user-images.githubusercontent.com/78655692/142591414-28cdc1b6-3e07-40d1-957b-3059eb4275f6.png" width="500" height="400" alt="LSTM 구조">

- **SimpleRNN** 코드

```python
from tensorflow.keras.layers import Embedding, SimpleRNN, Dense
from tensorflow.keras.models import Sequential

model = Sequential()
model.add(Embedding(max_features, 32))
model.add(SimpleRNN(32))
model.add(Dense(1, activation='sigmoid'))
```

<br>

- **LSTM** 코드

```python
from tensorflow.keras.layers import Embedding, LSTM, Dense
from tensorflow.keras.models import Sequential

model = Sequential()
model.add(Embedding(max_features, 32))
model.add(LSTM(32))
model.add(Dense(1, activation='sigmoid'))
```

<br>

![image](https://user-images.githubusercontent.com/78655692/148879286-1643011d-16bc-4fe0-9dff-246903b3479f.png)

- **GRU** 코드

```python
from tensorflow.keras.layers import Embedding, GRU, Dense
from tensorflow.keras.models import Sequential

model = Sequential()
model.add(Embedding(max_features, 32))
model.add(GRU(32))
model.add(Dense(1, activation='sigmoid'))
```

## 6_3. 순환 신경망의 고급 사용법

- **순환 드롭아웃**(recurrent dropout): 순환 층에서 과대적합을 방지하기 위해 케라스에 내장되어 있는 드롭아웃을 사용한다. 
- **스태킹 순환 층**(stacking recurrent layer): 네트워크의 표현 능력을 증가시킨다. (그 대신 계산 비용이 많이 든다.)
- **양방향 순환 층**(bidirectional recurrent layer): 순환 네트워크에 같은 정보를 다른 방향으로 주입하여 정확도를 높이고 기억을 좀 더 오래 유지시킨다.

<br>

## 6_3_1. 기온 예측 문제 

### 데이터 다운 받기

<script src="https://gist.github.com/ingu627/84201460377a7bc0a8b9838f018fe47e.js"></script>

- unzip 안될 시 [https://ingu627.github.io/error/unzip/](https://ingu627.github.io/error/unzip/) 참고 
- 그래도 안될 시 [https://s3.amazonaws.com/keras-datasets/jena_climate_2009_2016.csv.zip](https://s3.amazonaws.com/keras-datasets/jena_climate_2009_2016.csv.zip) 수동 다운
- **+추가** `datasets` 폴더에 있다.. 다운받을 필요 없다.

<br>

### 예나의 날씨 데이터셋 조사하기 

<script src="https://gist.github.com/ingu627/110d937200b33f155516a7b91466110f.js"></script>

- 출력된 줄 수는 42만 551이다.

<br>

### 데이터 파싱하기 

<script src="https://gist.github.com/ingu627/b912f1938485bd0866e62c5e68ce21e7.js"></script>

![image](https://user-images.githubusercontent.com/78655692/142636345-875e45b5-c660-4cf9-9067-3a9527dd957b.png)

<br>

## 6_3_2. 데이터 준비

- **일자별 수준의 시계열 데이터를 예측 해본다.**
- lookback 타임스텝만큼 이전으로 돌아가서 매 steps 타입스탭마다 샘플링한다.
- `lookback = 1440` : 10일 전 데이터로 돌아간다.
- `steps = 6` : 1시간마다 데이터 포인트 하나를 샘플링한다.
- `delay = 144` : 24시간이 지난 데이터가 타깃이 된다. 

<br>

### 데이터 정규화하기

<script src="https://gist.github.com/ingu627/949e2eca763ce4988989074858f4d142.js"></script>

<br>

### 시계열 데이터와 타깃을 반환하는 제너레이터 함수 

<script src="https://gist.github.com/ingu627/356b0a798e9f68e72a786efc0fe89289.js"></script>

- 이 제너레이터 함수는 (samples, targets) 튜프을 반복적으로 반환한다.
- samples는 입력 데이터로 사용할 배치고 targets는 이에 대응되는 타깃 온도의 배열이다.
- **매개 변수**
- `data`: 정규화한 부동 소수 데이터로 이루어진 원본 배열
- `lookback`: 입력으로 사용하기 위해 거슬러 올라갈 타임스텝
- `delay`: 타깃으로 사용할 미래의 타임스텝
- `min_index`와 `max_index`: 추출할 타임스텝의 범위를 지정하기 위한 data 배열의 인덱스, 검증 데이터와 테스트 데이터를 분리하는 데 사용한다. 
- `shuffle`: 샘플을 섞을지, 시간 순서대로 추출할지 결정
- `batch_size`: 배치의 샘플 수 
- `step`: 데이터를 샘플링할 타임스텝 간격.

<br>

### 훈련, 검증, 테스트 제너레이터 준비하기

<script src="https://gist.github.com/ingu627/715cebc82fb6dd217db0c27a7ab09bff.js"></script>

<br>

## 6_3_4. 기본적인 머신 러닝 방법

- 복잡하고 연산 비용이 많이 드는 모델을 시도하기 전에 간단하고 손쉽게 만들 수 있는 머신 러닝 모델을 먼저 만드는 것이 좋다.
- 이를 바탕으로 더 복잡한 방법을 도입하는 근거가 마련되고 실제적인 이득도 얻게 된다.

<br>

### 완전 연결 모델을 훈련하고 평가하기

<script src="https://gist.github.com/ingu627/8f028dabba4f9e78729c707d24af1083.js"></script>

### 결과 그래프 그리기

<script src="https://gist.github.com/ingu627/bcbc2a6c61f2f6b6f62dbc6b0372291e.js"></script>

![image](https://user-images.githubusercontent.com/78655692/142822403-8fddba77-cd4d-4e0c-865e-12d1f50b4046.png)

<br>

## 6_3_5. 첫 번째 순환 신경망

- GRU(Gated Recurrent Unit) 층은 LSTM과 같은 원리로 작동하지만 조금 더 간결하고, 계산비용이 덜 든다.

<br>

### GRU를 사용한 모델을 훈련하고 평가하기

<script src="https://gist.github.com/ingu627/7f78101cca717415a8ae6c993092c41f.js"></script>

<br>

### 결과 그래프 그리기

![image](https://user-images.githubusercontent.com/78655692/142823987-bb805703-bce9-4d67-9557-6cd147060971.png)

<br>

## 6_3_6. 과대적합을 감소하기 위해 순환 드롭아웃 사용하기

- **드롭 아웃 기법**은 훈련 데이터를 층에 주입할 때 데이터에 있는 우연한 상관관계를 깨뜨리기 위해 입력 층의 유닛을 랜덤하게 끄는 기법이다.

<script src="https://gist.github.com/ingu627/22b26324a04745ffb3d7823c850fcc12.js"></script>

<br>

## 6_3_7. 스태킹 순환 층 

- 네트워크의 용량을 늘리려면 일반적으로 층에 있는 유닛의 수를 늘리거나 층을 더 많이 추가한다.
- 예를 들어 구글 번역 알고리즘의 현재 성능은 7개의 대규모 LSTM 층을 쌓은 대규모 모델에서 나온 것이다.
- `return_sequences=True` : 모든 중간층이 전체 시퀀스를 출력해야 할 때

<script src="https://gist.github.com/ingu627/8a23ce4e0c69423bab613cf1898ebbc6.js"></script>

<br>

## 6_3_8. 양방향 RNN 사용하기 

- RNN은 특히 순서 또는 시간에 민감하다. 양방향 RNN(bidirectional RNN)은 RNN이 순서에 민감하다는 성질을 사용한다. 
- GRU나 LSTM 같은 RNN 2개를 사용하는데 각 RNN은 입력 시퀀스를 한 방향(시간 순서나 반대 순서)으로 처리한 후 각 표현을 합친다.
- 시퀀스를 양쪽 방향으로 처리하기 때문에 양방향 RNN은 단방향 RNN이 놓치기 쉬운 패턴을 감지할 수 있다.

<img src="https://user-images.githubusercontent.com/78655692/142826896-d902f7a0-1497-4e91-9bb7-d3806e8f563e.png" width="500" height="400" alt="동작 원리" />

<script src="https://gist.github.com/ingu627/4b18c0331129eae4dbf537af7b302d61.js"></script>


순환 어텐션(attention)과 시퀀스 마스킹(sequence masking) 공부하기
{: .notice--danger}

<br>

### 그외 함수들 (순환신경망)

- tf.data.Dataset의 `from_tensor_slices()`는 주어진 텐서들을 첫번째 차원을 따라 슬라이스한다.

![image](https://user-images.githubusercontent.com/78655692/142894665-a34c7ebb-67d1-4226-927d-51efa9ab056b.png)

<br>

## 6_4. 컨브넷을 사용한 시퀀스 처리

- **1D 컨브넷**(1D Convnet)은 특정 시퀀스 처리 문제에서 RNN과 결줄 만한다.
- 일반적으로 계산 비용이 훨씬 싸다.
- 1D 컨브넷은 전형적으로 **팽창된 커널**(dilated kernel)과 함께 사용된다.
  - **팽창 합성곱**은 커널에 구멍을 추가하여 입력을 건너뛰면서 합성곱하는 것과 같다.
- **1D 합성곱** : 시퀀스에서 1D 패치(부분 시퀀스)를 추출하여 1D 합성곱을 적용한다.

<img src="https://user-images.githubusercontent.com/78655692/142854777-41f8c287-0473-48d4-8943-bd7be31bad0b.png" width="500" height="400" alt="동작 원리" />

- 이런 1D 합성곱 층은 시퀀스에 있는 지역 패턴을 인식할 수 있다.
- 동일한 변환이 시퀀스에 있는 모든 패치에 적용되기 때문에 특정 위치에서 학스한 패턴을 나중에 다른 위치에서 인식할 수 있다.
- 이는 **1D 컨브넷**(시간의 이동에 대한) 이동 불변성(translation invariant)을 제공한다. 
  - 예를 들어 크기 5인 윈도우를 사용하여 문자 시퀀스를 처리하는 1D 컨브넷은 5개 이하의 단어나 단어의 부분을 학습한다.
  - 이 컨브넷은 이 단어가 입력 시퀀스의 어느 문장에 있더라도 인식할 수 있다.
  - 따라서 문자 수준의 1D 컨브넷은 단어 형태학(word morphology)에 관해 학습할 수 있다.
- 1D 풀링 연산은 2D 풀링 연산과 동일하다. 입력에서 1D 패치(부분 시퀀스)를 추출하고 최댓값(최대 풀링)을 출력하거나 평균값(평균 풀링)을 출력한다.
- 2D 컨브넷과 마찬가지로 1D 입력의 길이를 줄이기 위해 사용한다. (서브샘플링)

<br>

## 6_4_3. 1D 컨브넷 구현 

- 케라스에서 1D 컨브넷은 Conv1D 층을 사용하여 구현한다.
- (samples, time, features) 크기의 3D 텐서를 입력받고 비슷한 형태의 3D 텐서를 반환한다. 
- **합성곱 윈도우**는 1D 윈도우이다. 즉, 입력 텐서의 두 번째 축이다.

<br>

### IMDB 데이터 전처리하기 

<script src="https://gist.github.com/ingu627/e7f2794e87d5860fc172ab2555c294be.js"></script>

<br>

### IMDB 데이터에 1D 컨브넷을 훈련하고 평가받기

<script src="https://gist.github.com/ingu627/fcb2770b9933c658413003a195554dd0.js"></script>

- Conv1D와 MaxPooling1D층을 쌓고 전역 풀링 층이나 Flatten 층으로 마친다.
  - **GlobalAveragePooling1D**, **GlobalMaxPooling1D**은 (sammples, timesteps, features) 크기의 텐서를 입력받고 (samples, features) 크기의 텐서를 출력한다. 즉 시간 축 전체에 풀링을 적용한다.
  - **GlobalAveragePooling2D**, **GlobalMaxPooling2D** 풀링은 (samples, height, width, channels) 크기의 텐서를 입력받고 (samples, channels) 크기의 텐서를 출력한다. 즉 특성 맵의 공간 차원 전체에 대한 풀링이다.
- 이 구조는 3D 입력을 2D 출력으로 바꾸므로 분류나 회귀를 위해 모델에 하나 이상의 Dense 층을 추가할 수 있다.

![image](https://user-images.githubusercontent.com/78655692/142859707-a26439ee-fe83-4577-b15b-c388e4ac41db.png)

<br>

## 6_4_4. CNN과 RNN을 연결하여 긴 시퀀스를 처리하기 

- 1D 컨브넷이 입력 패치를 독립적으로 처리하기 때문에 RNN과 달리 (합성곱 윈도우 크기의 범위를 넘어서는) 타임스탭의 순서에 민감하지 않다.
- 물론 장기간 패턴을 인식하기 위해 많은 합성곱 층과 풀링 층을 쌓을 수 있다.
- 컨브넷의 속도와 경량함을 RNN의 순서 감지 능력과 결합하는 한 가지 전략은 1D 컨브넷을 RNN 이전에 전처리 단계로 사용하는 것이다.
  - 수천 개의 스텝을 가진 시퀀스 같이 RNN으로 처리하기에는 현실적으로 너무 긴 시퀀스를 다룰 때 특별히 도움이 된다.
  - 컨브넷이 긴 입력 시퀀스를 더 짧은 고수준 특성의 (다운샘플된) 시퀀스로 변환한다.
  - 추출된 특성의 시퀀스는 RNN 파트의 입력이 된다.

<img src="https://user-images.githubusercontent.com/78655692/142860349-542446c7-1441-4e82-b439-854d9b3eb45f.png" width="500" height="400" alt="결합 동작 원리" />


<br>

## References

- [케라스 창시자에게 배우는 딥러닝](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=173992478) 
- [Word2Vec 으로 단어 임베딩하기 (Word2Vec word embeddings)](https://medium.com/@jennyamy2531/word2vec-%EC%9C%BC%EB%A1%9C-%EB%8B%A8%EC%96%B4-%EC%9E%84%EB%B2%A0%EB%94%A9%ED%95%98%EA%B8%B0-word2vec-word-embeddings-96725bfb2580)
- [RNN과 LSTM을 이해해보자!](https://ratsgo.github.io/natural%20language%20processing/2017/03/09/rnnlstm/)
- [딥 러닝을 이용한 자연어 처리 입문 - 순환 신경망](https://wikidocs.net/22886)
- [GRU-정리 - guide333](https://velog.io/@guide333/GRU-%EC%A0%95%EB%A6%AC)