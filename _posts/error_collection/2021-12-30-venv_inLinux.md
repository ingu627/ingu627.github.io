---
layout: single
title: "[에러 해결 방법] 리눅스에서 파이썬 가상환경 설치안될 때"
categories: error
tags: [error, solution, linux, venv, 가상환경, 파이썬, 설치, 리눅스, wsl]
toc: true
sidebar_main: false

last_modified_at: 2022-04-03
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




