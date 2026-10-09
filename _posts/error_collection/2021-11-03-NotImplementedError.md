---
layout: single
title: '[에러 해결 방법] NotImplementedError: Cannot convert a symbolic Tensor (simple_rnn_3/strided_slice:0) to a numpy array'
categories: error
tags: [error, NotImplementedError]
toc: true
sidebar_main: false

date: 2021-11-03
last_modified_at: 2026-10-09
---

TensorFlow에서 순환 신경망 모델을 실행할 때 아래와 같은 NotImplementedError가 발생할 수 있다. 이 글은 해당 에러의 원인과 numpy 버전을 낮추는 해결 방법을 정리한다.

## 에러 메시지

```
NotImplementedError: Cannot convert a symbolic Tensor (simple_rnn_3/strided_slice:0) to a numpy array
```

## 원인

- tensorflow ver 2.2 기준 에러가 났다.  
- 이는 numpy ver >= 1.2 일 때 발생한다.

## 해결 방법

1. `conda install numpy=1.19.5 -c conda-forge`로 설치를 진행하면 된다.


