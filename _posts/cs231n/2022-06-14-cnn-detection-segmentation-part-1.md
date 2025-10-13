---
layout: single
title: "CS231n 강의 11-1: 어텐션 개념 & Self-Attention 구조"
excerpt: "본 글은 2022년 5월에 강의한 스탠포드 대학의 Attention and Transformers 2022년 강의를 듣고 정리한 내용입니다. seq2seq2, attention, image captioning, transformer 등이 그 예입니다."
categories: cs231n
tags: [이미지, cnn, cs231n, 리뷰, 정리, 요약, 정의, 란, 딥러닝, seq2seq, 컨텍스트, rnn, 인코더, 디코더, attention, image caption, 어텐션, alignment, softmax, context vector, positional encoding, self attention, masked self attention, query, key, value, 설명, 원리]
toc: true 
toc_sticky: false
sidebar_main: false

last_modified_at: 2022-06-15
---

<img align='right' width='400' src='https://user-images.githubusercontent.com/78655692/173409001-fde6002c-8070-42b3-8906-2679a8e9f801.png'>
본 글은 2022년 5월에 강의한 스탠포드 대학의 Attention and Transformers 2022년 강의를 듣고 정리한 내용입니다. <br> 개인 공부 목적으로 작성되었으며, 설명이 맞지 않거나 글 오타가 있으면 알려주시길 바랍니다.
{: .notice--info}

원본 링크 : [cs231n.stanford.edu](http://cs231n.stanford.edu/)<br> 한글 번역 링크 : [aikorea.org - cs231n](http://aikorea.org/cs231n/) <br> 강의 링크 : [youtube - 2017 Spring (English)](https://www.youtube.com/playlist?list=PL3FW7Lu3i5JvHM8ljYj-zLfQRF3EO8sYv)
{: .notice--warning}

<br>
<br>
<br>

## Sequence to Sequence 

- Sequence to Sequence(seq2seq)는 many-to-one, one-to-many 두 개의 RNN으로 구성된 모델이다.
  - 기계번역, 챗봇 등에 많이 쓰인다.
- many-to-one을 encoder라 하고 입력 시퀀스를 읽어 단일 벡터를 출력한다. 정보를 압축하기 위함이다. 이때 단일 벡터를 context vector라 한다.
  - **컨텍스트 벡터(context vector)** : 입력 시퀀스의 각 항목을 처리하고 캡처한 정보가 담긴 벡터 
    - 보통 컨텍스트 벡터는 256, 512, 1024 같은 크기로 설정한다. (즉, 입력 시퀀스의 길이와 상관없이 고정된 길이)
    - 가변 길이의 데이터를 **고정 크기**의 데이터로 표현하는 이유는 시퀀스의 길이를 맞춰야 매 단계마다 빠르게 계산할 수 있기 때문이다. [^2] 
    - ex. 왕 - 남자 + 여자 = 여왕
    - ex. 단어 or 어간
- one-to-many를 decoder라 하고 context vector를 읽어 새로운 데이터인 출력 시퀀스를 내보낸다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/173484195-2920bace-3d52-4dd6-b842-cfd827abcc57.gif' width=700> <br> 이미지출처 [^1]

- 위 그림은 seq2seq를 기계 번역을 할 때이다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/173485334-f8f33b17-051a-41ac-9b98-025a40bca855.gif' width=700> <br> 이미지출처 [^1]

- seq2seq를 조금 더 구체적으로 봐본다.
- 인코더와 디코더는 모두 RNN이기 때문에 입력 및 이전 hidden 상태를 기반으로 현재 hidden 상태를 업데이트한다.
  - RNN 내용 참고 : [[CS231n] 강의10 Recurrent Neural Networks 리뷰](https://ingu627.github.io/cs231n/cnn8/)
- 그리고 디코더는 현 timestep 단계에서 다음 timestep 단계로 넘어갈 때 hidden state를 유지한다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/173479526-39a59ea6-69a0-4ce3-afd0-e36d40d79566.png' width=700>

- seq2seq를 수식으로 접근하면,
- **Input** : 시퀀스 $x_1, ..., x_T$
- **Encoder** : $h_t=f_W(x_t, h_{t-1})$
- **Context vector** : $c$
- **Decoder** : $s_t=g_U(y_{t-1},s_{t-1},c)$
  - encoder의 마지막 hidden 상태가 decoder의 초기 hidden 상태로 사용이 된다.
- **Output** : 시퀀스 $y_1, ..., y_T$

<br>
<br>

## Attention

- 하지만, seq2seq2는 입력 시퀀스가 너무 길다면  병목현상(bottleneck)이 일어나는 문제점이 있다. 또한 컨텍스트 벡터는 고정된 길이인데 입력 시퀀스가 길어지면 정보 손실의 문제점도 있다.
- 따라서, 첫번째 아이디어로 디코더의 각 timestep마다 새로운 컨텍스트 벡터를 사용하자는 것이다.
  - 디코더에서 출력 단어를 예측하는 매 시점(time step)마다, 인코더에서의 전체 입력 문장을 다시 한 번 참고한다. 이때, 예측해야 할 단어와 연관이 있는 입력 시퀀스를 좀 더 집중해서 봐보자는 것이다. [^3]
- **어텐션(attention)**은 입력 시퀀스가 길어지면 출력 시퀀스의 정확도가 떨어지는 것을 보정해주기 위해 등장한 기법이다. [^3]
- 이제 그림을 통해 아키텍처를 확인해본다.

<br>

### Sequence to Sequence with RNNs and Attentions

<img src='https://user-images.githubusercontent.com/78655692/173501977-92316426-15f2-4413-864e-3766c016fec1.png' width=700>

- 여기까지는 Vanilla RNN의 인코더부분과 똑같다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/173502991-89d80666-55a0-403f-b660-fbaabe54459e.png' width=700>

- 위 그림과 같이 각 입력 시퀀스마다 hidden 상태가 있는데, alignment score를 계산한다.(= $e$)
  - **Alignment** : (original) 원래의 문장에서 대응하는 번역된 단어와 일치시키는 것 [^4]
  - alignment score = matching score
  - $e_{t,i}=f_{att}(s_{t-1},h_i)$, $f_{att}$=MLP 
  - $e_{t,i}$는 decoder의 timestep $t-1$의 출력이 encoder의 timestep $i$의 출력과 얼마나 유사한지 나타내는지 알아보기 위함이다. [^6]
- alignment score에 softmax를 계산한다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/173512283-4352603f-d823-45ad-9bc2-9bede9db7547.png' width=700>

- 이제 위 그림과 같이 softmax를 거친 $a$ 값과 encoder의 hidden 상태를 각각 곱해서 context vector를 구한다.
  - 수식으로 나타내면 $c_t=\sum_i a_{t,i},h_i$와 같다.
    - $c_t$ : context vector의 약어를 뜻한다.
  - $a_{t,i}$는 현재 decoder의 출력 시퀀스(t)는 어떤 encoder의 출력 시퀀스(i)와 가장 연관이 높은지 알아보기 위함이다. [^6]

<br>

<img src='https://user-images.githubusercontent.com/78655692/173515003-4a082c72-0e99-4060-8619-d354b50e3bda.png' width=700>

- decoder에서 context vector를 사용하게 된다.
  - 수식으로 나타내면 $s_t=g_u(y_{t-1},s_{t-1},c_t)$
    - $s_t$ : decoder의 hidden 상태
  - context vector는 입력 시퀀스의 관련된 부분을 따른다.
  - context vector 값이 높을수록 유지하며, 낮으면 버린다.
- 만들어진 context vector는 이제 decoder의 입력으로 들어간다.
- 한가지 알아둘 점은 **모두 미분가능하다(differentiable)는 것이다.**

<br>

<img src='https://user-images.githubusercontent.com/78655692/173517362-fec90852-70a0-403b-b19a-c8230895a64e.png' width=700>

- 위 과정들을 다시 반복하는데, $s_1$을 사용해서 새로운 context vector $c_2$를 계산한다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/173517785-984f6e97-60ad-4672-81ae-a79aec0576f8.png' width=700>

- 구한 $c_2$를 이용해서 $s_2, y_2$를 계산한다.
- 이런 과정을 계속 반복한다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/173518178-64472961-e104-4d55-94da-b25a24de4c98.png' width=700>

- 따라서 decoder의 각 timestep마다 다른 context vector를 사용하는 것이 핵심이다.
- 그러면 입력 시퀀스는 병목 현상이 일어나지 않으며, 각 decoder의 timestep마다 컨텍스트 벡터는 입력 시퀀스의 다른 부분을 보게 된다.

<br>
<br>

### Example : seq2seq with attention

<img src='https://user-images.githubusercontent.com/78655692/173542951-cf5e189d-9c2a-43a1-a488-dcdb8ad56ad3.png' width=700>

- 영어를 프랑스어로 번역하는 예시인데,
- 그림과 같이 학습 과정에서 입력되는 두 개의 언어를 어떻게 맞출지 학습이 된다.
- 파란색 부분 중 대각선 모양처럼 보이는 것은 단어가 순서대로 대응한다는 것을 의미한다.
- 빨간색 부분처럼 반대 방향의 대각선 보일 때는 attention이 다른 단어의 순서를 알아냄을 의미한다.

<br>
<br>

### Image Caption using spatial features

<img src='https://user-images.githubusercontent.com/78655692/173556100-21b70237-4dc3-44ea-b2c1-81dd87fb92d9.png' width=700>

- 아직 attention을 적용하지 않은 이미지 캡션쪽으로 넘어와본다.
- **input** : image $I$
- **output** : 시퀀스 $y=y_1,y_2,...,y_T$
- **encoder** : $h_0=f_w(z)$
  - $z$ : spatial CNN 특성들(H x W x D)
  - $f_w(.)$ : 다층 퍼셉트론(MLP; multi-layer perceptron)
    - 입력층과 출력층 사이에 하나 이상의 은닉층을 가지고 있는 신경망 [^5]
  - $h_t$ : hidden 상태의 약어
- **decoder** : $y_t=g_v(y_{t-1},h_{t-1},c)$
  - $c$는 context vector의 약어로 초기에 $h_0$이 $c$가 된다.
  - 출력 시퀀스 $y_0$와 $c$의 정보가 hidden 상태 $h_1$에 들어가고 $y_1$를 내보낸다.

<br>

- 하지만, 전과 마찬가지로 입력 시퀀스가 너무 길어지면 병목 현상이 일어나기 때문에 이를 보정할 attention을 도입한다. 
  - 각 timestep마다 새로운 context vector를 생성한다.
  - 각 context vector는 다른 이미지 지역들을 집중(attend to)할 것이다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/173562092-c4ce1c3d-39a1-4c1e-8ed1-647b761e7831.png' width=700>

- **Encoder**
- 먼저 HxW 크기의 alignment score를 계산한다.
  - alignment score : $e_{t,i,j}=f_{att}(h_{t-1},z_{i,j})$
    - $f_{att}$ : MLP
- alignment score가 softmax를 거쳐 HxW 크기의 attention score를 생성한다.
  - $a_{t,:,:} = softmax(e_{t,:,:})$
  - 즉, alignment score를 정규화(normalize)하여 attention weight를 얻는다.
- 그리고 context vector를 계산한다.
  - $c_t=\sum_{i,j}a_{t,i,j}z_{t,i,j}$

<br>

<img src='https://user-images.githubusercontent.com/78655692/173563015-d8588fab-6c92-4551-815f-e8d48d35d07f.png' width=700>

- **Decoder**
- 먼저 decoder식은 다음과 같다.
  - $y_t=g_v(y_{t-1},h_{t-1},c_t)$
- encoder에서 계산한 context vector $c_1$과 출력 시퀀스 $y_0$와 $h_1$(=$h_0$) 3가지 값으로 $y_1$를 구한다.
- $y_1$은 다음 출력을 예측하기 위한 새로운 입력 데이터가 된다. 이 과정을 반복한다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/173567552-0b02f7b4-dd5a-4a0a-937b-7ca1ced5c499.png' width=700>

- 위 그림은 encoder와 decoder의 전체 과정이다.
- 모든 프로세스는 미분이 가능(differentiable)하다.

<br>
<br>

### Recap

<img src='https://user-images.githubusercontent.com/78655692/173573003-f23ce4cb-a094-4ef6-b8c8-7c3dffbfb59e.png' width=450>

- 다시 image captioning에서 attention이 어떻게 작동했는지 확인해본다.
- features $z_{i,j}$ (HxWxD)와 hidden 상태 $h$ (D)가 입력 데이터이며, 이를 통해 alignment score $e_{i,j}$를 생성한다.
- alignment score를 softmax를 거쳐 attention score $a_{i,j}$를 생성하고, 기존 features $z_{i,j}$와 각 요소별 곱한 값을 더한다. (mul+add)
- 그 값이 context vector $c$ (D)가 된다. 

<br>

### General attention layer

<img src='https://user-images.githubusercontent.com/78655692/173574245-c16a3ac5-891b-4e33-abb3-e3251c03766f.png' width=700>

- 하지만, attention 연산은 **순열 불변성(permutation invariant)**이기 때문에 feature의 순서에 크게 신경쓰지 않는다. 따라서 위 그림의 input vector를 보면 HxW를 N으로 쫙 늘린(stretch) 것을 알 수 있다.
  - 그 결과, input vector의 shape은 NxD가 되었다.
- 그리고 원래 alignment $e_{i,j}$를 계산할 때 MLP인 $f_{att}$가 계산되었는데, 이를 간단한 내적 $h\cdot x_i$로 바꾸었다. 그리고 $\sqrt{D}$를 곱하는 이유는, 큰 벡터 크기의 영향을 줄이기 위해서이다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/173578672-5ea2a434-cacc-417c-bf63-3f9e47bc64ae.png' width=700>

- 바뀐 부분이 많아졌는데, 하나씩 분해해본다.
- 먼저 Input쪽에서 Queries가 $q$ (MxD)로 바뀌어졌다. 따라서 Output 쪽도 context vector $y$도 shape가 $D$만큼 출력한다.
- 그리고 input vectors는 alignment score와 attention score를 계산할 때 모두 쓰이는데, 이 두 단계를 가기 전에 다른 FC(fully-connected) 레이어를 추가한다. 그게 $k_i$와 $v_i$이다. 
- 2개의 FC 레이어가 추가 되었기 때문에 inputs의 shape은 $M\times D_k$로 바뀌고, outputs의 shape 또한 $D_v$로 바뀐다. 
- 연산 과정에서도 이에 맞게 바뀐다.

<br>
<br>

## Self attention layer

<img src='https://user-images.githubusercontent.com/78655692/173581106-83c2797f-eef9-488e-8e8e-39ea517811d4.png' width=700>

- 입력 벡터(input vector)로부터 쿼리 벡터(query vector)를 계산할 수 있기 때문에 **self-attention layer**로 정의한다. 
- 쿼리 벡터는 FC 레이어에 의해 계산된다.
- 따라서 이제 입력의 쿼리 벡터는 필요없게 되었다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/173583812-ed8060d6-1183-4543-a3b9-46eded351fbb.png' width=700>

- 위 그림은 self attention layer의 전체를 보여준다.
- 노란색 부분을 self-attention으로 한다면, 오른쪽과 같이 나타낼 수 있다.

<br>

- self-attention을 다시 정리해본다. [^8]
- $N\times D$ 형태의 입력 벡터 $x$가 들어온다. 시퀀스 문장이라 한다면, 각각을 토큰(token)을 한다.
  - **토큰(token)** : 일련의 문자열을 구분할 수 있는 단위 [^7]
- 각각의 입력 벡터(=토큰)로부터 key vector, value vector, query vector를 생성한다.
  - **query vector** : decoder에서 생성된 질의하는(query) 주체 
  - **key vector** : 토큰이 query와 얼마나 연관되었는지 비교하는 가중치
  - **value vector** : 의미에 대한 가중치
- encoder 과정에서 현재 위치의 토큰을 다른 토큰에 비해 얼마나 어텐션(attention)해야할지에 대한 점수를 계산한다. 
  - 어떤 단어와 가장 연관성이 있는지 비율을 알아낸다.

<br>
<br>

## Positional encoding

- attention은 기존 RNN, LSTM과는 달리 **시간적 연속성**을 다루지 않는다.
- 그럼에도 불구하고 단어를 처리할 때 단어의 위치 정보가 필요하기 때문에, 이를 보완하고자 positional encoding이 나왔다. 

<img src='https://user-images.githubusercontent.com/78655692/173727725-4cca61d4-bb9c-467c-8ea4-2dccd384cb39.png' width=700>

- 그렇다면, 어떻게 위치 정보를 부여할 것인지에 대한 과제가 남아 있다.
- positional encoding에서는 특수한 positional encoding $p_j$를 각 입력 벡터 $x_j$에 연결한다.
  - 함수 $pos$를 두어 d-dimensional vector안에 j번째 벡터를 처리한다.
  - $p_j=pos(j)$로 표현한다.
  - 이 과정은 attention layer에 들어가기 전에 진행된다.

<br>

### Desiderata of pos(.)

- $pos()$의 요구되는 조건은 다음과 같다.

1. 각 timestep마다 하나의 유일한(unique) 인코딩 값을 출력해내야 한다.
2. 서로 다른 길이의 문장에 있어서 두 timestep간 거리는 일정해야(consistent) 한다.
3. 모델이 일반화가 되어서 더 긴 길이의 문장도 아무 문제없이 작동되어야 한다. 값들이 특정 범위 내에 있어야 한다.
4. 하나의 key 값처럼 결정되어야 한다. 매번 다른 값이 나와선 안된다. [^10]

<br>

### Options for pos(.)

<img src='https://user-images.githubusercontent.com/78655692/173734052-c457bad1-15fd-4b0f-8ad6-9c03daa8784f.png' width=700>

- $p(t)$에 positional encoding이 적용돼 sin, cot이 들어가 있는 걸 알 수 있다.
- $p(t)$ 식은 다음과 같다.

    <img src='https://user-images.githubusercontent.com/78655692/173734748-7bc2bca4-31e4-4223-8f00-10de2aff0577.png' width=400> <br> 이미지 출처 [^11]

- sin, cos 조합으로 순서값을 표현한다.

<br>
<br>

## Masked self-attention layer

<img src='https://user-images.githubusercontent.com/78655692/173587959-97e6eca0-7963-490f-95b5-66866f9ae752.png' width=700>

- 앞서 self attention의 encoder를 살펴보았다.
- 하지만, decoder로 가면 target 단어 뒤에 위치한 단어가 self-attention에 영향을 주지않기 위해 **masked self-attention**을 쓴다.
- 따라서, 가리고자(mask) 하는 단어에 -infinity 값을 더하여 softmax를 거치게 되면 값이 0이 되기 때문에, attention에 반영되지 않는다.
- 즉, decoder 부분에서 현재 내가 알고 있는 정보까지만 self-attention이 가능하다. [^9]

<br>
<br>

## Multi-head self attention layer

<img src='https://user-images.githubusercontent.com/78655692/173589399-8ff5155f-f431-4ece-a6e3-cde24c312a53.png' width=700>

- 병렬적으로 multi-head에 적용하는 등, self-attention은 다양하게 쓰일 수 있다. 

<br>

### Example: CNN with Self-Attention

<img src='https://user-images.githubusercontent.com/78655692/173589732-a8731c11-944c-4e6f-8aec-6abed5f699ea.png' width=700>

- 위 그림은 cnn과 self-attention을 적용한 내용이다.


<br>
<br>
<br>
<br>

## References

[^1]: [Visualizing A Neural Machine Translation Model (Mechanics of Seq2seq Models With Attention) - Jay Alammar](https://jalammar.github.io/visualizing-neural-machine-translation-mechanics-of-seq2seq-models-with-attention/)
[^2]: [[CS224n] Lecture 14 - Transformer and Self-Attention - tobigs-text1314](https://velog.io/@tobigs-text1314/CS224n-Lecture-14-Transformer-and-Self-Attention)
[^3]: [1) 어텐션 메커니즘 (Attention Mechanism) - 딥 러닝을 이용한 자연어 처리 입문](https://wikidocs.net/22893)
[^4]: [Sequence to Sequence with Attention - Incredible.AI](http://incredible.ai/nlp/2020/02/20/Sequence-To-Sequence-with-Attention/)
[^5]: [MLP 신경망 (Multi-Layer Perceptron) - 헬로월드!](https://jitolit.tistory.com/107)
[^6]: [어텐션 메커니즘과 transfomer(self-attention) - pltfarm tech team](https://medium.com/platfarm/%EC%96%B4%ED%85%90%EC%85%98-%EB%A9%94%EC%BB%A4%EB%8B%88%EC%A6%98%EA%B3%BC-transfomer-self-attention-842498fd3225)
[^7]: [데이터 토큰 (문자열) - 해시넷](http://wiki.hash.kr/index.php/%EB%8D%B0%EC%9D%B4%ED%84%B0_%ED%86%A0%ED%81%B0_(%EB%AC%B8%EC%9E%90%EC%97%B4))
[^8]: [Self-Attention과 Masked Self-Attention - AimB](https://aimb.tistory.com/182)
[^9]: [[NLP] Transformer : Masked Multi-Head Attention - part3 - Acdong](https://acdongpgm.tistory.com/221)
[^10]: [positional encoding이란 무엇인가 - skyjwoo](https://skyjwoo.tistory.com/entry/positional-encoding%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80)
[^11]: [ransformer Architecture: The Positional Encoding - Let's use sinusoidal functions to inject the order of words in our model](https://kazemnejad.com/blog/transformer_architecture_positional_encoding/)

