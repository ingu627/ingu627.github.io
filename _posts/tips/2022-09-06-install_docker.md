---
layout: single
title: "Window10 또는 Ubuntu 22.04 내 도커(docker) 설치하기"
excerpt : "윈도우10 또는 우분투 내에서 도커를 설치하는 과정을 정리할 필요가 있다고 느꼈습니다. 설치에 도움이 되었으면 합니다."
categories: tips
tag : [리눅스, 우분투, window10, 윈도우, 도커, docker, linux, 설치, ubuntu, 윈도우10, wsl2, docker desktop, 사용법]

toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-09-06
---

윈도우10 또는 우분투 내에서 도커를 설치하는 과정을 정리할 필요가 있다고 느꼈습니다. <br> 설치에 도움이 되었으면 합니다. <br><br> **참조** 1. <br> [Install Docker Engine on Ubuntu - 공식사이트](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository) <br> 2. [윈도우10에서 리눅스(Linux) 설치하기 (Ubuntu on WSL2) - poeun](https://ingu627.github.io/tips/install_ubuntu/) <br> 3. [Install Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/)
{: .notice--danger} 

<br>
<br>

## 1. 도커 설치하기 (Ubuntu 22.04)

- 먼저 우분투 내 도커를 설치하기 위해 OS 요구 사항을 충족시켜야 한다.
  - **Ubuntu Jammy 22.04 (LTS)**
  - **Ubuntu Impish 21.10**
  - **Ubuntu Focal 20.04 (LTS)**
  - **Ubuntu Bionic 18.04 (LTS)**
- 위 요구사항에 해당이 된다면 터미널(terminal)을 실행한다.

<br>

### 1.1 오래된 버전 삭제

```shell
$ sudo apt-get remove docker docker-engine docker.io containerd runc
```

<br>

### 1.2 repository 설정

```shell
$ sudo apt-get update \
    upgrade

$ sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

<br>

### 1.3 도커 공식 GPG 키 추가

```shell
$ sudo mkdir -p /etc/apt/keyrings
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

<br>

### 1.4 도커 repository 등록

```shell
$ echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

<br>

### 1.5 도커 엔진 설치

```shell
$ sudo apt-get update
$ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

- 여기까지 하면 도커 설치는 끝이 난다.

<br>

### 1.6 내 repository 내 가능한 버전 목록 확인

```shell
$ apt-cache madison docker-ce
```

- **실행결과**

    ![Screenshot from 2022-09-06 19-32-53](https://user-images.githubusercontent.com/78655692/188613643-bc66f127-8d29-4cd6-9e14-b11652dbbe9b.png)

<br>

### 1.7 appendix

- 도커 명령어를 자세히 알고 싶다면 아래 링크를 참조한다.
  - [터미널 내 도커(docker) 컨테이너 명령어, 옵션 정리 - poeun](https://ingu627.github.io/docker/docker_command/)
- 도커를 이용해 파이썬 가상환경 구축을 자세히 알고 싶다면 아래 링크를 참조한다.
  - [도커(docker)를 이용해 파이썬 가상환경 구축을 위한 이미지 배포하기 - poeun](https://ingu627.github.io/docker/docker_overview_venv/)

<br>
<br>

## 2. 도커 설치하기 (WINDOW 10)

- 먼저 윈도우10 내 리눅스를 사용하기 위해 WSL2를 설치해야 한다.
- 윈도우10 내 WSL2를 설치하는 방법은 아래 링크를 참조한다.
  - 링크 : [윈도우10에서 리눅스(Linux) 설치하기 (Ubuntu on WSL2) - poeun](https://ingu627.github.io/tips/install_ubuntu/)
- 또한 WSL2 backend의 요구 사항도 충족하는지 살펴본다.

![Screenshot from 2022-09-06 19-43-13](https://user-images.githubusercontent.com/78655692/188615539-4843b1ea-eb24-40d6-ad4d-51283a1a49fa.png) <br> 이미지 출처 [^1]


<br>

- 설치가 완료되었으면, **Docker Deesktop**을 설치한다.
  - [Install Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/)

![ss](https://user-images.githubusercontent.com/78655692/188615378-13cd3547-23e6-4cb0-ad04-630af651e859.png)

<br>

### [에러 해결] Got permission denied while trying to connect to the Docker daemon socket

- 권한이 없다고 뜬다면, 아래 명령어들을 실행해 docker group에 유저를 추가해 준다. [^2]

```shell
$ sudo groupadd docker
$ sudo usermod -aG docker $USER
$ newgrp docker
```


<br>
<br>
<br>
<br>

## References

[^1]: [Install Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/)
[^2]: [도커 권한문제 해결하기: "Got permission denied while trying to connect to the Docker daemon socket" - seul chan](https://seulcode.tistory.com/557)