---
layout: single
title: "핸즈온 머신러닝 13장: 대용량 데이터 적재·전처리 파이프라인 구축"
excerpt: "part 2 신경망과 딥러닝 부분을 개인공부를 목적으로 내용 요약 및 정리한 글입니다. - 텐서플로에서 데이터 적재와 전처리하기"
categories: hands_on
tags: [python, tensorflow, DL, 텐서플로, 적재, 전처리, 연쇄 변환, TFRecord]
toc: true
sidebar_main: false
classes: wide

last_modified_at: 2022-03-21
redirect_from:
  - /ho_ML/TDL4/
---

<img align='right' width='200' height='200' src='https://user-images.githubusercontent.com/78655692/147628941-a1aeb296-324e-4a60-816b-e4cc6666d13e.png
'>
본 글은 [핸즈온 머신러닝 2판 (Hands-On Machine Learning with Scikit-Learn, keras & TensorFlow)] - (박해선 옮김) 책을 개인공부하기 위해 요약, 정리한 내용입니다. <br>전체 코드는 <https://github.com/ingu627/handson-ml2>에 기재했습니다.(원본 코드 fork) <br> 뿐만 아니라 책에서 설명이 부족하거나 이해가 안 되는 것들은 외부 자료들을 토대로 메꿔 놓았습니다. <br> 오타나 오류는 알려주시길 바라며, 도움이 되길 바랍니다.
{: .notice--info}

<br>

## 13 텐서플로에서 데이터 적재와 전처리하기

- 텐서플로는 데이터 API로 대규모 데이터셋을 쉽게 처리할 수 있다.
- `TFRecord`는 프로토콜 버퍼(protocol buffer)를 담은 유연하고 효율적인 이진 포맷이다.
- **TF 변환(tf.Transform)** : (실행 속도를 높이기 위해) 훈련 전에 전체 훈련 세트에 대해 실행하는 전처리 함수를 작성할 수 있다.
- **TF 데이터셋 (TFDS)** : 각종 데이터셋을 다운로드할 수 있는 편리한 함수를 제공한다.
  - 이미지넷과 같은 대용량 데이터셋도 포함된다.
  - 데이터 API로 조작할 수 있는 편리한 데이터셋 객체도 제공한다.

<br>

## 13.1 데이터 API

- 데이터셋(dataset)은 연속된 데이터 샘플을 나타낸다.
- `tf.data.Dataset.from_tensor_slices()` : 를 이용해 메모리에서 전체 데이터셋을 생성

```python
import tensorflow as tf

X = tf.range(10)
dataset = tf.data.Dataset.from_tensor_slices(X)
dataset
# <TensorSliceDataset shapes: (), types: tf.int32>

for item in dataset:
    print(item)
    
# tf.Tensor(0, shape=(), dtype=int32)
# tf.Tensor(1, shape=(), dtype=int32)
# tf.Tensor(2, shape=(), dtype=int32)
# tf.Tensor(3, shape=(), dtype=int32)
# tf.Tensor(4, shape=(), dtype=int32)
# tf.Tensor(5, shape=(), dtype=int32)
# tf.Tensor(6, shape=(), dtype=int32)
# tf.Tensor(7, shape=(), dtype=int32)
# tf.Tensor(8, shape=(), dtype=int32)
# tf.Tensor(9, shape=(), dtype=int32)
```

- `from_tensor_slices()` : 텐서를 받아 X의 각 원소가 아이템(item)으로 표현되는 tf.data.Dataset을 만든다.

<br>

### 13.1.1 연쇄 변환

```python
dataset =  dataset.repeat(3).batch(7)
for item in dataset:
    print(item)

# tf.Tensor([0 1 2 3 4 5 6], shape=(7,), dtype=int32)
# tf.Tensor([7 8 9 0 1 2 3], shape=(7,), dtype=int32)
# tf.Tensor([4 5 6 7 8 9 0], shape=(7,), dtype=int32)
# tf.Tensor([1 2 3 4 5 6 7], shape=(7,), dtype=int32)
# tf.Tensor([8 9], shape=(2,), dtype=int32)
```

- `repeat()` : 원본 데이터셋의 아이템을 세 차례 반복하는 새로운 데이터셋을 반환한다.
- 새로운 데이터셋에서 `batch()`를 호출하면 다시 새로운 데이터셋이 만들어진다.
  - batch() 메서드를 `drop_remainder=True`로 호출하면 길이가 모자란 마지막 배치를 버리고 모든 배치를 동일한 크기로 맞춘다.

<br>

- `map()` 메서드를 호출하여 아이템을 변환할 수도 있다.

```python
dataset = dataset.map(lambda x: x* 2)
```

- `filter()` 메서드를 사용하여 데이터셋을 필터링 한다.

```python
dataset = dataset.filter(lambda x: x < 10)
```

- 몇 개의 아이템만 보고 싶을 땐 `take()` 메서드 사용

```python
for item in dataset.take(3):
    print(item)

# tf.Tensor([ 0  8 16 24 32 40 48], shape=(7,), dtype=int32)
# tf.Tensor([56 64 72  0  8 16 24], shape=(7,), dtype=int32)
# tf.Tensor([32 40 48 56 64 72  0], shape=(7,), dtype=int32)
```

<br>

### 13.1.2 데이터 셔플링

- **경사 하강법**은 훈련 세트에 있는 샘플이 독립적이고 동일한 분포일 때 최고의 성능을 발휘한다.
  - `shuffle()`을 이용하여 샘플을 섞는다.

```python
dataset = tf.data.Dataset.range(10).repeat(3) # 0에서 9까지 세 번 반복
dataset = dataset.shuffle(buffer_size=5, seed=42).batch(7)
for item in dataset:
    print(item)

# tf.Tensor([0 2 3 6 7 9 4], shape=(7,), dtype=int64)
# tf.Tensor([5 0 1 1 8 6 5], shape=(7,), dtype=int64)
# tf.Tensor([4 8 7 1 2 3 0], shape=(7,), dtype=int64)
# tf.Tensor([5 4 2 7 8 9 9], shape=(7,), dtype=int64)
# tf.Tensor([3 6], shape=(2,), dtype=int64)
```

- 메모리 용량보다 큰 대규모 데이터셋은 버퍼가 데이터셋에 비해 작기 때문에 해결책으로 원본 데이터 자체를 섞는다.

<br>

## 13.2 TFRecord 포맷

- TFRecord는 대용량 데이터를 저장하고 효율적으로 읽기 위해 텐서플로가 선호하는 포맷
- TFRecord는 크기가 다른 연속된 이진 레코드를 저장하는 단순한 이진 포맷이다.
- `tf.io.TFecordWriter` 클래스를 사용해 TRecord를 손쉽게 만들 수 있다.

