---
layout: single
title: '에러 해결: Conda NonMatchingChecksumError 패키지 검증 실패 조치'
excerpt: 'Conda NonMatchingChecksumError 발생 시 캐시 정리·미러 변경·채널 재구성 절차'
categories: error
tags: [error, NonMatchingChecksumError]
toc: true
sidebar_main: false

date: 2021-11-03
last_modified_at: 2021-11-04
---

## 원인 : NonMatchingChecksumError: Artifact https://drive.google.com/uc?export=download&id=0B7EVK8r0v71pZjFTYXZWM3FlRnM 

tfds (TensorFlow 데이터세트)를 load하는 과정에서 생긴 에러
(celeb_a)

```python
celeb_a = tfds.load('celeb_a')
```

![image](https://user-images.githubusercontent.com/78655692/140298490-78dacbbc-1b79-4299-865d-17c9d9e6b495.png)



## 해결방법

### 구글 공식 사이트 답변
![image](https://user-images.githubusercontent.com/78655692/140298711-f4d0ec60-67a1-4d9a-a179-ae8904687412.png)

[tfds 및 Google 클라우드 스토리지](https://www.tensorflow.org/datasets/gcs)

#### colab에서 실행할 때 이 코드를 실행
```python
from google.colab import auth
auth.authenticate_user()
```

[구글 클라우드 인증](https://cloud.google.com/docs/authentication/getting-started#windows)

### + 만약 KeyError: <ExtractMethod.NO_EXTRACT: 1>가 나왔다면?
(해결 찾는 중) 