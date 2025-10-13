---
layout: single
title: "CS231n 강의 10-1: RNN 구조 & 시퀀스 모델링 기초"
excerpt: "본 글은 2022년 4월에 강의한 스탠포드 대학의 Recurrent Neural Networks 2022년 강의를 듣고 정리한 내용입니다. Lecture 10 RNN, LSTM 등이 그 예입니다."
categories: cs231n
tags: [이미지, cnn, cs231n, 리뷰, 정리, 요약, 정의, 란, 딥러닝, Recurrent Neural Network, rnn, many to one, many to many, one to many, image captioning, sequence, 시퀀스, seq2seq, video classifcation, 원리, 설명, multilayer]
toc: true 
toc_sticky: false
sidebar_main: false

last_modified_at: 2022-06-14
---

<img align='right' width='400' src='https://user-images.githubusercontent.com/78655692/173232201-2db4fd2b-327f-4810-89f0-d4dc12c9acbf.png'>
본 글은 2022년 4월에 강의한 스탠포드 대학의 Recurrent Neural Networks 2022년 강의를 듣고 정리한 내용입니다. <br> 개인 공부 목적으로 작성되었으며, 설명이 맞지 않거나 글 오타가 있으면 알려주시길 바랍니다.
{: .notice--info}

원본 링크 : [cs231n.stanford.edu](http://cs231n.stanford.edu/)<br> 한글 번역 링크 : [aikorea.org - cs231n](http://aikorea.org/cs231n/) <br> 강의 링크 : [youtube - 2017 Spring (English)](https://www.youtube.com/playlist?list=PL3FW7Lu3i5JvHM8ljYj-zLfQRF3EO8sYv)
{: .notice--warning}

<br>
<br>
<br>

## Introduction to RNN

- 일반적으로, 신경망은 고정된 크기의 입력 벡터가 주어지고, 히든 레이어로 처리하고 고정된 크기의 출력 벡터를 생성한다.
  - 이를 **one to one**라 하고, vanilla neural network에 해당한다.
- 하지만, RNN은 신경망(NN; neural network) 아키텍처를 연결하는 방법에 대해 많은 유연성을 제공한다.
  - 즉, feedback 연결선을 만들어 순차적인 데이터의 이전 정보를 다음 레이어에 반영해 학습하는 것이다.
  - 시간이라는 축도 고려하는 가중치가 하나 더 추가된 것이다.

![image](https://user-images.githubusercontent.com/78655692/173232861-33412924-fbe1-42ea-99c5-2b866043c37c.png) <br> 이미지 출처 [^1]

- **one-to-many** : Image Captioning이 대표적인 예
  - 고정된 크기의 이미지가 주어지고 RNN을 통해 해당 이미지의 내용을 설명
  - image -> sequence of words
- **many-to-one** : Action prediction, NLP의 감정 분석이 대표적인 예
  - 단일 이미지 대신 비디오 프레임 시퀀스를 보고 비디오에서 어떤 작업이 발생했는지에 대한 레이블을 생성
  - sequence of video frames -> action class
- **many-to-many** : Video-Captioning이 대표적인 예
  - 비디오 프레임 시퀀스이고 출력이 비디오에 있는 내용을 설명
  - sequence of video frames -> caption
- **variation of many-to-many** : Video Classification이 대표적인 예
  - 모든 시간 단계에서 출력을 생성

<br>
<br>

## Recurrent Neural Network

<img src='https://user-images.githubusercontent.com/78655692/173238474-3a3fd5ed-e399-4ddc-be50-e568d972ae2b.png' width=600>

- RNN은 시퀀스가 처리될 때 업데이트되는 내부 상태(internal state)를 가지고 있다.
- 모든 single timestep에서, 입력 벡터를 RNN에 넣어 해당 함수로 상태를 수정한다. 

<img src='https://user-images.githubusercontent.com/78655692/173240242-e698a0f9-a8ed-4ba4-b777-b384f00c5bfa.png' width=600>

- 위 그림은 RNN 모델을 펼쳤(unroll)을 때를 나타낸 것이다.
- 각 timestep에서 RNN은 입력 프레임 $x_i$와 이전 표현(history) 두개의 인풋을 가진다.
- **모든 RNN 블록은 동일한 파라미터를 공유하지만 각 timestamp에서 input과 history가 다른 동일한 블록이다.**

<br>

<img src='https://user-images.githubusercontent.com/78655692/173241643-2be7d44e-a090-4260-a323-a039b48175b6.png' width=600>

- 다음은 RNN을 수식으로 나타낸 것이다.
  - $h_{t-1}$ : 이전 timestep $t-1$ 반복에서의 이전 상태
  - $x_t$ : 현재 입력 벡터
  - $f_w$ : 각 단일 timestep마다 적용되는 가중치 $W$를 가진 고정된 함수
    - 입력 또는 출력 시퀀스가 얼마나 길든 매 단일 시간 단계에서 정확히 동일한 함수를 적용하기 때문에 시퀀스의 크기에 상관없이 시퀀스에서 순환 신경망을 사용할 수 있다.
  - $h_t$ : 현재 상태

<br>

<img src='https://user-images.githubusercontent.com/78655692/173242762-01027f86-287e-45ea-aee8-700973177611.png' width=600>

- 위 그림은 앞서 소개한 식을 좀 더 구체화한 것이다.
- 모든 timestep에서 이전 반복 시간 단계 $t-1$의 벡터 $h_{t-1}$과 현재 입력 벡터 $x_t$를 수신(received)하여 현재 상태를 벡터 $h_t$로 생성한다.
- $W_{hh}$ : 이전 timestep의 hidden state $h_{t-1}$일 때 가중치 행렬
- $W_{xh}$ : 현재 입력 벡터 $x_t$일 때 가중치 행렬


  ![image](https://user-images.githubusercontent.com/78655692/173243138-4dfb9a4b-316a-41d9-b4a0-acda80123324.png)

- $W_{hy}$ : 현재 상태 $h_t$에서 y로 넘어갈 가중치 행렬


<br>

<img src='https://user-images.githubusercontent.com/78655692/173242716-aa269c5e-c701-49f4-93bc-8081b04b6a1f.png' width=600>

- 그렇게 $h_t$를 얻고, 다시 $h$ 상태를 업데이트한다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/173243215-a862310c-b239-4b6a-81b2-2785f0465bd9.png' width=600>

- 각 $x_i$가 들어가지만, 가중치 행렬 $W$는 매 timestep마다 동일하게 사용된다.

<br>
<br>

### many-to-many

<img src='https://user-images.githubusercontent.com/78655692/173243312-7d5fb68b-1076-404e-82a2-7affbbb83bc3.png' width=650>

- many-to-many 모델에서 각 timestep마다 y를 출력하고 $L_1, L_2, ..., L_T$를 계산한다. 
- 그리고 최종 loss $L$은 각 개별 loss의 합을 의미한다.
- 모델을 학습시키기 위해 역전파(backpropagation) 과정을 보면, loss는 각 timestep에서 이루어졌기 때문에 각 timestep마다 가중치 행렬 $w$에 대한 local gradient를 계산할 수 있다. [^2]
- 따라서, 각각 계산된 local gradient를 최종 gradient에 더한다.

<br>

### many-to-one

<img src='https://user-images.githubusercontent.com/78655692/173243541-44e5728e-31b2-429a-8dd1-4e31974d5c23.png' width=650>

- many-to-one 경우에는 최종 hidden state $h_T$에 전체 시퀀스에 대한 정보를 가지고 있다.

<br>

### one-to-many

<img src='https://user-images.githubusercontent.com/78655692/173265699-b774e7f9-0002-472f-a993-0301325bf244.png' width=650>

- one-to-many 경우에는 입력 벡터는 고정이지만 출력 벡터는 각각 변한다. 이 때 입력 벡터는 모델의 initial hidden 상태를 초기화 시키는 용도로 사용한다. [^2]

<br>

### sequence to sequence

<img src='https://user-images.githubusercontent.com/78655692/173267524-2feed7d4-d35c-4973-867c-5a911f9102fe.png' width=650>

- 시퀀스2시퀀스(sequence to sequence) 모델은 many-to-one와 one-to-many 를 합친 모델이다.
- many-to-one을 인코더(encoder)라 부르며, 입력 문장의 모든 단어들을 순차적으로 입력받은 뒤, 마지막에 모든 단어 정보들을 압축해서 하나의 벡터로 만든다. [^3]
  - 이를 컨텍스트 벡터(context vector)라 한다.
- 디코더는 컨텍스트 벡터를 받아 한 개씩 순차적으로 출력한다.
  - 매 timestep마다 적절한 단어를 출력한다.

<br>
<br>

## Example: character-level language model

<img src='https://user-images.githubusercontent.com/78655692/173268458-2bc8697e-e63d-4780-9008-13815fe16ed8.png' width=650>

- RNN의 작동 방식은 일련의 문자를 RNN에 주고 모든 단일 timestep에서 RNN에게 시퀀스의 다음 문자를 예측하는 것이다.
- 학습 시퀀스로 hello가 있고 'h', 'e', 'l', 'o' 4개 알파벳을 가지고 있다.
- 입력 레이어에서는 이를 원핫 인코딩으로 바꿔 준 다음, hidden layer에서 순차적으로 계산한다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/173271094-8d397865-3fb7-4876-939d-71efb0e22c4a.png' width=650>

- 테스트 때는 하나의 알파벳을 하나씩 던져주는데,
- 예를 들어, h가 주어졌다면 모든 알파벳에 대한 score가 output 레이어에 출력되고, softmax를 거쳐 다음 알파벳을 유추한다. 
  - softmax를 사용해 확률 분포를 알아낸다.

<br>
<br>

## Backpropagation through time

<img src='https://user-images.githubusercontent.com/78655692/173272749-3c2475aa-13f6-4b64-a5bc-be6543c40aae.png' width=650>

- 하지만, loss를 계산하기 위해 전체 시퀀스를 forward하면, gradient를 계산하기 위해 전체 시퀀스를 backward해야 한다.
  - 시간도 오래 걸리고 비효율적이다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/173272922-b37302ea-bf0b-4a0c-98db-8185453d1b61.png' width=650>

- 따라서, 전체 시퀀스 대신에 시퀀스를 부분 부분 (chunk) 단위로 나눠 forward와 backward를 진행한다.

<br>
<br>

## Pros and Cons

- **Pros**
  - 입력 데이터가 어떤 길이든 상관없다.
  - step t에 대한 계산은 많은 step들의 정보를 사용할 수 있다.
  - 입력이 길어져도 모델 크기는 증가하지 않는다.
  - 모든 timestep에 동일한 가중치가 적용되므로 입력 방식에 대칭성(symmetry)이 있다.
- **Cons**
  - 순한 계산(recurrent computation)이 느리다.
  - 실제로 여러 단계에서 정보에 접근하는 것이 어렵다.

<br>
<br>

## Image Captioning

<img src='https://user-images.githubusercontent.com/78655692/173274715-29524ef6-869f-41bf-ae2c-08ba8aba77bf.png' width=650>

- 이미지 캡션(image captioning)은 CNN과 RNN를 결합한 방법이다.
- 입력은 이미지가 들어가지만 출력은 자연어 단어가 나온다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/173275151-606d3060-f57d-40cd-add8-7c9db88d3a93.png' width=650>

- CNN 구조의 펼치는 부분과 softmax를 지우고 RNN으로 대체한다.
- $W_{ih}*v$는 이미지에 대한 정보이다.

<img src='https://user-images.githubusercontent.com/78655692/173275399-9526ca5a-9a1d-4820-8284-e5a2f40e5291.png' width=650>

- hidden 상태를 계산할 때마다 모든 스텝에 이미지 정보를 추가해주면, 샘플링된 단어가 나오고 이를 반복 작업한다. 
- <END> 토큰을 넣으면 더 이상 단어를 생성하지 않는다. 그럼 이미지 캡션이 완성된다.

<br>
<br>

## Multilayer RNNs

![image](https://user-images.githubusercontent.com/78655692/173283567-55c99778-72af-4bbd-9ab4-2b0cf3b9a2c9.png)

- 그러나 오늘날 RNN은 단일 계층 아키텍처에 국한되지 않고 여러 개를 쌓는 방식을 쓴다.
- RNN을 여러 계층으로 쌓일 수 있어 깊이가 더 있으며, 실제로 더 깊을수록 아키텍처가 잘 작동된다.

<br>
<br>
<br>
<br>

## References

[^1]: [CS231n Convolutional Neural Networks for Visual Recognition](https://cs231n.github.io/rnn/)
[^2]: [cs231n 2017 강의 10강 RNN 정리](https://lsjsj92.tistory.com/411)
[^3]: [1) 시퀀스-투-시퀀스(Sequence-to-Sequence, seq2seq) - 딥러닝을 이용한 자연어 처리 입문](https://wikidocs.net/24996)