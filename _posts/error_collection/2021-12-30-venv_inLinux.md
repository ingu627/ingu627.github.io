---
layout: single
title: "[에러 해결 방법] 리눅스에서 파이썬 가상환경 설치안될 때"
categories: error
tags: [error, solution, linux, venv, 가상환경, 파이썬, 설치, 리눅스, wsl]
toc: true
sidebar_main: false

last_modified_at: 2026-10-09
---

리눅스(WSL)에서 파이썬 가상환경(`venv`)을 설치할 때 `Package 'python3.8-venv' has no installation candidate` 오류가 뜨는 경우가 있다. 이 글은 해당 에러 메시지와 `apt`를 이용한 해결 방법을 정리한다.

## 에러 메시지

```
Package 'python3.8-venv' has no installation candidate
```

![image](/assets/images/legacy/a3962ea2d1.webp)

## 해결 방법

1. `sudo apt-get update`
2. `sudo apt-get upgrade`
3. `sudo apt-get install python3-venv`

![image](/assets/images/legacy/924fc3878a.webp)

> 파일 위치 확인
> 탐색기에서 `\\wsl$`로 네트워크 환경으로 접속하기

## 참고

- <https://community.home-assistant.io/t/package-it-missed-in-installation-in-python-virtual-environment/48788>
