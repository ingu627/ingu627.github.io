---
layout: single
title: '[에러 해결 방법] NotImplementedError: Cannot convert a symbolic Tensor (simple_rnn_3/strided_slice:0) to a numpy array'
categories: error
tag : [error, solution]
toc: true
sidebar_main: false

date: 2021-11-03
last_modified_at: 2021-11-03
---
## 원인 : NotImplementedError: Cannot convert a symbolic Tensor (simple_rnn_3/strided_slice:0) to a numpy array

- tensorflow ver 2.2 기준 에러가 났다.  
- 이는 numpy ver >= 1.2 일 때 발생한다.


## 해결 방법

- `conda install numpy=1.19.5 -c conda-forge`로 설치를 진행하면 된다.


