---
layout: single
title: "Windows10 KoNLPy 설치: JPype·JAVA 버전 호환 에러 방지 절차"
excerpt: "KoNLPy 형태소 분석기를 사용하기 위해 JDK·JPype 버전 맞춤, 환경변수(JAVA_HOME) 설정과 pip 설치 오류 해결 방법 정리"
categories: tips
tags: [tip, konlpy, nlp, 윈도우10, 설치, jpype, tweepy, 자연어 처리, 환경 변수, 윈도우]
toc: True
toc_sticky: True
sidebar_main: false

last_modified_at: 2022-04-17
---

- **KoNLPy**는 한국어 정보처리를 위한 파이썬 패키지이다. NLP (자연어 처리)를 할 때 쓰이지만 운영체제가 윈도우같은 경우는 설치 버전을 좀 맞춰야 한다.

<br>
<br>

## 1. 자바 설치 (JDK, oracle.com )

- [https://www.oracle.com/java/technologies/downloads/](https://www.oracle.com/java/technologies/downloads/){: target="_blank"} 로 들어가서 자바를 설치한다.
- 오라클 계정이 필요할 수 있으니 참고바람!

주의사항 : JDK 16 이상으로 설치
{: .notice--danger}

![image](https://user-images.githubusercontent.com/78655692/143981136-f51f09ae-15be-48a2-ae6d-40ac1a13cfed.png)

![image](https://user-images.githubusercontent.com/78655692/143981194-042fcfaf-1837-4710-82bc-50cbbf13a44c.png)

<br>
<br>

## 2. 환경 변수 설정

- 환경 변수를 설정하는 이유는 JAVA 설치를 컴퓨터가 인식하기 위함이다. `고급 -> 환경 변수 -> 시스템 변수의 새로만들기 -> 변수 : JAVA_HOME / RKQT : 설치 경로 -> 적용 -> 확인

![image](https://user-images.githubusercontent.com/78655692/143981939-418fc97f-f876-4846-8903-42c90ac5a684.png)

![image](https://user-images.githubusercontent.com/78655692/143982044-946d2401-b843-48d4-81e3-ec1b5cb4839a.png)

![image](https://user-images.githubusercontent.com/78655692/143982229-e8f3ed76-f2f5-43bb-b2f5-8a81cac96e9b.png)

<br>
<br>

## 3. 아나콘다 설치

- [https://www.anaconda.com/products/individual](https://www.anaconda.com/products/individual){: target="_blank"} 로 들어가 `Anaconda Individual Edition` 설치

![image](https://user-images.githubusercontent.com/78655692/143982706-605172cc-7c2a-45bd-97d9-57f11a50bb32.png)

<br>
<br>

## 4. jpype 설치 

- [https://www.lfd.uci.edu/~gohlke/pythonlibs/#jpype](https://www.lfd.uci.edu/~gohlke/pythonlibs/#jpype){: target="_blank"} 사이트로 이동
- 파이썬 버전에 맞게 설치 (3.7x 버전이면 `JPype1‑1.1.2‑cp37‑cp37‑win_amd64.whl`)
- 내 노트북은 3.6이므로 `JPype1‑1.1.2‑cp36‑cp36m‑win_amd64.whl`를 다운받았다.

주의사항 : 호환성 문제로 1.1.2로 설치
{: .notice--danger}

![image](https://user-images.githubusercontent.com/78655692/143982471-834f5fde-9447-4d50-a61a-2a3fb4859b46.png)

- 보통 `Downloads` 폴더에 다운이 받아질 것이다. 설치 경로로 바꾼 다음 pip으로 설치를 진행한다.
- 경로 변경 : 명령 프롬프트에서 `cd` 절대 경로 or 상대 경로로!

![image](https://user-images.githubusercontent.com/78655692/143983386-6e591cf2-b736-4337-94d0-af77761d8aff.png)

<br>
<br>

## 5. konlpy 설치

- `pip install konlpy` 설치를 한다.

![image](https://user-images.githubusercontent.com/78655692/143983473-09a8a522-fdfd-4027-8120-cfcb2c9231fb.png)

<br>
<br>

### 5_1. tweepy오류로 3.10.0로 재설치를 한다.

- `pip uninstall tweepy` 후 `pip install tweepy==3.10.0` 로 설치

![image](https://user-images.githubusercontent.com/78655692/143983649-b277a687-4718-4e6e-81dc-bb2822343f6d.png)

<br>
<br>

## 6. 설치 완료 확인

![image](https://user-images.githubusercontent.com/78655692/143983862-c220dafa-79e7-4cd7-990e-c3ee82978731.png)

<br>
<br>

## References

- [KoNLPy: 파이썬 한국어 NLP](https://konlpy.org/ko/latest/)