---
layout: single
title: "[에러 해결 방법] ModuleNotFoundError: No module named 'tensorflow.keras'"
categories: error
tags: [error, ModuleNotFoundError]
toc: true
sidebar_main: false

last_modified_at: 2026-10-09
---

`ModuleNotFoundError: No module named 'tensorflow.keras'` 에러를 해결하는 방법을 정리한다. `python` 환경을 추가하거나 `pip`로 특정 버전의 `keras`를 설치하는 방법을 다룬다.

> 이 글은 2021년 당시 keras 2.2.4 기준으로 작성된 설치/사용 기록이다. 최신 버전에서는 명령이 다를 수 있다.

## 에러 메시지

```
ModuleNotFoundError: No module named 'tensorflow.keras'
```

![image](https://user-images.githubusercontent.com/78655692/141083164-9de945bc-701c-49df-9d01-9f606f89b352.png)

## 해결 방법

1. `python` 추가

![image](https://user-images.githubusercontent.com/78655692/141083287-742b8933-0450-45ca-965a-e5f1aad2112e.png)

### + 또 다른 방법

1. `pip install keras==2.2.4` 로 설치하면 `keras.layers`, `keras.models`로 해결이 된다.
