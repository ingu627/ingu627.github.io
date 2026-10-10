---
layout: single
title: "Window10 또는 Ubuntu 22.04 내 도커(docker) 설치하기"
excerpt : "윈도우10 또는 우분투 내에서 도커를 설치하는 과정을 정리할 필요가 있다고 느꼈습니다. 설치에 도움이 되었으면 합니다."
categories: [tips, docker]
tags: [리눅스, 우분투, window10, 윈도우, 도커, docker, linux, 설치, ubuntu, 윈도우10, wsl2, docker desktop, 사용법]

toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2026-10-09
---

윈도우10 또는 우분투 내에서 도커를 설치하는 과정을 정리할 필요가 있다고 느꼈습니다. 설치에 도움이 되었으면 합니다.

**참조**

1. [Install Docker Engine on Ubuntu - 공식사이트](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)
2. [윈도우10에서 리눅스(Linux) 설치하기 (Ubuntu on WSL2) - poeun](https://ingu627.github.io/tips/install_ubuntu/)
3. [Install Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/) 


이 글은 우분투 22.04와 윈도우10에서 도커를 설치하는 과정을 정리한다. 각 OS별 설치 단계와 도커 권한 에러 해결 방법을 함께 다룬다.

## 1. 도커 설치하기 (Ubuntu 22.04)

- 먼저 우분투 내 도커를 설치하기 위해 OS 요구 사항을 충족시켜야 한다.
  - **Ubuntu Jammy 22.04 (LTS)**
  - **Ubuntu Impish 21.10**
  - **Ubuntu Focal 20.04 (LTS)**
  - **Ubuntu Bionic 18.04 (LTS)**
- 위 요구사항에 해당이 된다면 터미널(terminal)을 실행한다.

도커는 아래 그림처럼 클라이언트(`docker` CLI), 도커 호스트(`dockerd` 데몬), 레지스트리로 나뉜다. 이 글에서 설치하는 `docker-ce-cli`, `docker-ce`, `containerd.io`가 각각 어느 위치에 해당하는지 염두에 두고 보면 이해에 도움이 된다.

![도커 아키텍처 - 클라이언트, 도커 호스트(데몬), 레지스트리](assets/images/tips/official-docker-architecture.webp)

*출처: Docker Docs - Docker architecture (https://docs.docker.com/get-started/docker-overview/#docker-architecture)*


### 1.1 오래된 버전 삭제

```shell
$ sudo apt-get remove docker docker-engine docker.io containerd runc
```


### 1.2 repository 설정

```shell
$ sudo apt-get update
$ sudo apt-get upgrade

$ sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```


### 1.3 도커 공식 GPG 키 추가

```shell
$ sudo mkdir -p /etc/apt/keyrings
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```


### 1.4 도커 repository 등록

```shell
$ echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```


### 1.5 도커 엔진 설치

```shell
$ sudo apt-get update
$ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

- 여기까지 하면 도커 설치는 끝이 난다.


### 1.6 설치 가능한 버전 목록 확인

```shell
$ apt-cache madison docker-ce
```

- **실행결과**

    ![Screenshot from 2022-09-06 19-32-53](https://user-images.githubusercontent.com/78655692/188613643-bc66f127-8d29-4cd6-9e14-b11652dbbe9b.png)


### 1.7 appendix

- 도커 명령어를 자세히 알고 싶다면 아래 링크를 참조한다.
  - [터미널 내 도커(docker) 컨테이너 명령어, 옵션 정리 - poeun](https://ingu627.github.io/docker/docker_command/)
- 도커를 이용해 파이썬 가상환경 구축을 자세히 알고 싶다면 아래 링크를 참조한다.
  - [도커(docker)를 이용해 파이썬 가상환경 구축을 위한 이미지 배포하기 - poeun](https://ingu627.github.io/docker/docker_overview_venv/)


## 2. 도커 설치하기 (Windows 10)

- 먼저 윈도우10 내 리눅스를 사용하기 위해 WSL2를 설치해야 한다.
- 윈도우10 내 WSL2를 설치하는 방법은 아래 링크를 참조한다.
  - 링크 : [윈도우10에서 리눅스(Linux) 설치하기 (Ubuntu on WSL2) - poeun](https://ingu627.github.io/tips/install_ubuntu/)
- 또한 WSL2 backend의 요구 사항도 충족하는지 살펴본다.

![Screenshot from 2022-09-06 19-43-13](https://user-images.githubusercontent.com/78655692/188615539-4843b1ea-eb24-40d6-ad4d-51283a1a49fa.png)

이미지 출처 [^1]



- 설치가 완료되었으면, **Docker Desktop**을 설치한다.
  - [Install Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/)

![ss](https://user-images.githubusercontent.com/78655692/188615378-13cd3547-23e6-4cb0-ad04-630af651e859.png)


### [에러 해결] Got permission denied while trying to connect to the Docker daemon socket

- 권한이 없다고 뜬다면, 아래 명령어들을 실행해 docker group에 유저를 추가해 준다. [^2]

```shell
$ sudo groupadd docker
$ sudo usermod -aG docker $USER
$ newgrp docker
```



### 알아 둘 점과 한계

- 도커 그룹에 사용자를 추가하면 편하지만, 이 그룹은 **root에 준하는 권한**을 부여한다. 보안이 중요한 환경에서는 rootless 모드를 검토한다. [^3]
- 윈도우에서의 WSL2 백엔드는 Windows 10 버전 2004(빌드 19041) 이상과 '가상 머신 플랫폼' 기능 활성화를 요구한다. 아래 글의 명령어를 그대로 쓰려면 이 조건을 먼저 확인해야 한다. [^4]
- **Docker Desktop**은 개인·교육·비상업 오픈소스, 그리고 소규모 사업자(직원 250명 미만이면서 연 매출 1,000만 달러 미만)에게는 무료지만, 그보다 큰 조직의 상업적 사용에는 유료 구독이 필요하다. 같은 조건이 Docker Engine(`docker-ce`)에는 적용되지 않는다. [^5]
- 이 글의 명령과 지원 버전 목록은 2022년 9월 우분투 22.04/윈도우10 기준이다. 배포판 지원 현황과 Docker Desktop 요구 사항은 바뀔 수 있으므로 설치 전에 공식 문서를 확인한다.



## References

[^1]: [Install Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/)
[^2]: [도커 권한문제 해결하기: "Got permission denied while trying to connect to the Docker daemon socket" - seul chan](https://seulcode.tistory.com/557)
[^3]: [Post-installation steps for Linux - Manage Docker as a non-root user](https://docs.docker.com/engine/install/linux-postinstall/) - "The `docker` group grants root-level privileges to the user."
[^4]: [How to install Linux on Windows with WSL](https://learn.microsoft.com/windows/wsl/install) - Windows 10 버전 2004(빌드 19041) 이상 필요
[^5]: [Docker Desktop license agreement](https://docs.docker.com/subscription/desktop-license/)