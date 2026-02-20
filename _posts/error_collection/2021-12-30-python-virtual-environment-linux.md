---
layout: single
title: "에러 해결: 리눅스 Python 가상환경 생성(venv) 오류 & 권한 해결"
excerpt: "Linux에서 venv 생성 실패(권한/누락 패키지) 발생 시 의존 패키지 설치 및 권한 정비"
categories: error
tags: [error, solution, linux, venv, 가상환경, 파이썬, 설치, 리눅스, wsl]
toc: true
sidebar_main: false

last_modified_at: 2022-04-03
redirect_from:
  - /error_collection/venv_inLinux/
---

<br>

## 원인 : Package 'python3.8-venv' has no installation candidate라고 뜸

![image](https://user-images.githubusercontent.com/78655692/147743481-c73e25f9-2639-4382-8cbf-9d78d620fa9d.png)

<br>
<br>

## 해결 방법

```linux
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install python3-venv
```

![image](https://user-images.githubusercontent.com/78655692/147743640-f2ef0b0a-c77b-4fec-b7a1-a0bb6e6cd460.png)

<br>

> 파일 위치 확인
> 탐색기에서 `\\wsl$`로 네트워크 환경으로 접속하기

<br>
<br>

## References

- <https://community.home-assistant.io/t/package-it-missed-in-installation-in-python-virtual-environment/48788>




