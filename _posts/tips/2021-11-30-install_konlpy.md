---
layout: single
title: "윈도우10 환경에서 konlpy 설치하는 방법"
excerpt: "KoNLPy는 한국어 정보처리를 위한 파이썬 패키지입니다. NLP (자연어 처리)를 할 때 쓰이지만 운영체제가 윈도우같은 경우는 설치 버전을 좀 맞춰야 합니다."
categories: tips
tags: [tip, konlpy, nlp, 윈도우10, 설치, jpype, tweepy, 자연어 처리, 환경 변수, 윈도우]
toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2026-10-11
---

- **KoNLPy**는 한국어 정보처리를 위한 파이썬 패키지이다. NLP (자연어 처리)를 할 때 쓰이지만 운영체제가 윈도우같은 경우는 설치 버전을 좀 맞춰야 한다.

> 이 글은 2021년 당시 JDK 16, JPype1 1.1.2, tweepy 3.10.0 기준으로 작성된 설치/사용 기록이다. 최신 버전에서는 명령이 다를 수 있다.

## 1. 자바 설치 (JDK, oracle.com )

- [https://www.oracle.com/java/technologies/downloads/](https://www.oracle.com/java/technologies/downloads/){: target="_blank"} 로 들어가서 자바를 설치한다.
- 오라클 계정이 필요할 수 있으니 참고하길 바란다.

> 주의사항 : JDK 16 이상으로 설치

![image](/assets/images/legacy/fc601f524b.webp)

![image](/assets/images/legacy/3c838bd486.webp)


## 2. 환경 변수 설정

- 환경 변수를 설정하는 이유는 JAVA 설치를 컴퓨터가 인식하기 위함이다. `고급 -> 환경 변수 -> 시스템 변수의 새로만들기 -> 변수 : JAVA_HOME / 값 : 설치 경로 -> 적용 -> 확인`

![image](/assets/images/legacy/0dac1ba71c.webp)

![image](/assets/images/legacy/3f539343e8.webp)

![image](/assets/images/legacy/bc2bdcfa68.webp)


## 3. 아나콘다 설치

- [https://www.anaconda.com/products/individual](https://www.anaconda.com/products/individual){: target="_blank"} 로 들어가 `Anaconda Individual Edition` 설치

![image](/assets/images/legacy/ff804ef27c.webp)


## 4. jpype 설치 

- [https://www.lfd.uci.edu/~gohlke/pythonlibs/#jpype](https://www.lfd.uci.edu/~gohlke/pythonlibs/#jpype){: target="_blank"} 사이트로 이동
- 파이썬 버전에 맞게 설치 (3.7x 버전이면 `JPype1‑1.1.2‑cp37‑cp37‑win_amd64.whl`)
- 내 노트북은 3.6이므로 `JPype1‑1.1.2‑cp36‑cp36m‑win_amd64.whl`를 다운받았다.

> 주의사항 : 호환성 문제로 1.1.2로 설치

![image](/assets/images/legacy/df973b7fd5.webp)

- 보통 `Downloads` 폴더에 다운이 받아질 것이다. 설치 경로로 바꾼 다음 pip으로 설치를 진행한다.
- 경로 변경 : 명령 프롬프트에서 `cd` 절대 경로 or 상대 경로로!

![image](/assets/images/legacy/b9b15f37c7.webp)


## 5. konlpy 설치

- `pip install konlpy` 설치를 한다.

![image](/assets/images/legacy/11bed053e1.webp)


### 5.1. tweepy 오류로 3.10.0으로 재설치한다.

- `pip uninstall tweepy` 후 `pip install tweepy==3.10.0` 로 설치

![image](/assets/images/legacy/8e1cc05d27.webp)


## 6. 설치 완료 확인

![image](/assets/images/legacy/13ede833d6.webp)


## 한계 및 주의사항

- KoNLPy 공식 문서에 따르면 운영체제(Windows), Python, Java, JPype의 아키텍처(32-bit 또는 64-bit)가 모두 일치해야 한다. 아키텍처 비트 수가 어긋나면 JPype 가상머신 초기화 단계에서 로드 오류가 발생한다. [^1]
- KoNLPy는 Java 1.7 이상을 요구하며, JPype1 공식 문서는 Java 1.8부터 13 버전까지의 호환성을 검증하고 있으므로 설치 환경의 Java 버전을 확인해야 한다. [^1] [^2]
- 5개 형태소 분석기 중 `Mecab()` 클래스는 Windows 운영체제에서 공식적으로 지원되지 않는다(Kkma, Komoran, Hannanum, Okt는 지원). [^1]

## References

[^1]: [KoNLPy 공식 문서 - 설치 가이드](https://konlpy.org/ko/latest/install/)
[^2]: [JPype1 공식 문서 - Troubleshooting Guide](https://jpype.readthedocs.io/en/latest/install.html)