---
layout: single
title: "[에러 해결 방법]  tf.gradients is not supported when eager execution is enabled 일때"
categories: error
tag : [error, solution, tf.gradients]
toc: true
sidebar_main: false

last_modified_at: 2022-01-27
---

<br>

## 원인 : RuntimeError: tf.gradients is not supported when eager execution is enabled 라고 에러가 뜸

![image](https://user-images.githubusercontent.com/78655692/151295186-5bf84602-eb91-41e9-9670-0838027de230.png)

<br>
<br>

## 해결 방법

- 해당 코드를 맨 처음 실행

```python
import tensorflow as tf
tf.compat.v1.disable_eager_execution()
```