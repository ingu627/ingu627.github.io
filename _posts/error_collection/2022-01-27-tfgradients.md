---
layout: single
title: "[에러 해결 방법]  tf.gradients is not supported when eager execution is enabled 일때"
categories: error
tags: [error, solution, tf.gradients]
toc: true
sidebar_main: false

last_modified_at: 2026-10-09
---

이 글은 TensorFlow에서 tf.gradients 사용 시 eager execution이 활성화되어 발생하는 RuntimeError를 해결한 기록이다. `tf.compat.v1.disable_eager_execution()`를 코드 맨 처음에 실행하는 방법을 정리한다.

> 이 글은 2022년 당시 TensorFlow 기준으로 작성된 설치/사용 기록이다. 최신 버전에서는 명령이 다를 수 있다.

## 에러 메시지

```
RuntimeError: tf.gradients is not supported when eager execution is enabled
```

아래 스크린샷 참고.

![image](https://user-images.githubusercontent.com/78655692/151295186-5bf84602-eb91-41e9-9670-0838027de230.png)

## 해결 방법

1. 해당 코드를 맨 처음 실행

```python
import tensorflow as tf
tf.compat.v1.disable_eager_execution()
```