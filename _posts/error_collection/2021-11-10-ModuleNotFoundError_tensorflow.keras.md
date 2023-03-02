---
layout: single
title: "[에러 해결 방법] ModuleNotFoundError: No module named 'tensorflow.keras'"
categories: error
tag : [error, solution]
toc: true
sidebar_main: false

last_modified_at: 2021-11-10
---

## 원인 : ModuleNotFoundError: No module named 'tensorflow.keras'

![image](https://user-images.githubusercontent.com/78655692/141083164-9de945bc-701c-49df-9d01-9f606f89b352.png)

## 해결방법 

- `python` 추가

![image](https://user-images.githubusercontent.com/78655692/141083287-742b8933-0450-45ca-965a-e5f1aad2112e.png)

### + 또 다른 방법

- `pip install keras==2.2.4` 로 설치하면 `keras.layers`, `keras.models`로 해결이 된다.
