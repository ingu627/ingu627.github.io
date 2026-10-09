---
layout: single
title: '[에러 해결 방법] NonMatchingChecksumError: Artifact https://drive.google.com/uc?export=download&id=0B7EVK8r0v71pZjFTYXZWM3FlRnM'
categories: error
tags: [error, NonMatchingChecksumError]
toc: true
sidebar_main: false

date: 2021-11-03
last_modified_at: 2026-10-09
---

> 이 글은 2021년 당시 작성된 설치/사용 기록이다. 최신 버전에서는 명령이 다를 수 있다.

tfds로 celeb_a 데이터셋을 불러오는 과정에서 NonMatchingChecksumError가 발생했다. 이 글은 구글 공식 답변을 바탕으로 한 해결 방법을 정리한다.

## 에러 메시지

```
NonMatchingChecksumError: Artifact https://drive.google.com/uc?export=download&id=0B7EVK8r0v71pZjFTYXZWM3FlRnM
```

![image](https://user-images.githubusercontent.com/78655692/140298490-78dacbbc-1b79-4299-865d-17c9d9e6b495.png)

## 원인

tfds (TensorFlow 데이터세트)를 load하는 과정에서 생긴 에러
(celeb_a)

```python
celeb_a = tfds.load('celeb_a')
```

## 해결 방법

1. 구글 공식 사이트 답변을 참고한다.

   ![image](https://user-images.githubusercontent.com/78655692/140298711-f4d0ec60-67a1-4d9a-a179-ae8904687412.png)

   - [tfds 및 Google 클라우드 스토리지](https://www.tensorflow.org/datasets/gcs)

2. colab에서 실행할 때 다음 코드를 실행한다.

   ```python
   from google.colab import auth
   auth.authenticate_user()
   ```

   - [구글 클라우드 인증](https://cloud.google.com/docs/authentication/getting-started#windows)

## 참고

- 만약 KeyError: <ExtractMethod.NO_EXTRACT: 1>가 나왔다면? (해결 찾는 중) 