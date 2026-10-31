---
layout: single
title: "[에러 해결 방법] ImportError: cannot import name 'get_config' from 'tensorflow.python.eager.context'"
categories: error
tags: [error, ImportError]
toc: true
sidebar_main: false

last_modified_at: 2026-10-09
---

## 원인 : ImportError: cannot import name 'get_config' from 'tensorflow.python.eager.context'

![image](/assets/images/legacy/556d5fa698.webp)

```python
from keras.datasets import mnist
```

- tensorflow 버전 (2.2 기준)에서 에러 발생

## 해결 방법 

```python
from tensorflow.keras.datasets import mnist
```

- 앞에 tensorflow를 붙여준다.