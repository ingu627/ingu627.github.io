---
layout: single
title: "[에러 해결 방법] ImportError: cannot import name 'get_config' from 'tensorflow.python.eager.context'"
categories: error
tags: [error, ImportError]
toc: true
sidebar_main: false

last_modified_at: 2021-11-08
---

## 원인 : ImportError: cannot import name 'get_config' from 'tensorflow.python.eager.context'

![image](https://user-images.githubusercontent.com/78655692/140678193-1d8873d5-a2f5-48e0-bd46-8c1b5a5c6545.png)

```python
from keras.datasets import mnist
```

- tensorflow 버전 (2.2 기준)에서 에러 발생

## 해결 방법 

```python
from tensorflow.keras.datasets import mnist
```

- 앞에 tensorflow를 붙여준다.