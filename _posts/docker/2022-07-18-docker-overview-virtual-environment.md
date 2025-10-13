---
layout: single
title: "Docker 파이썬 가상환경 이미지 배포 가이드"
excerpt: "도커는 특정 프로그램의 배포 및 관리를 단순하게 해주는 오픈소스 플랫폼입니다. 이번 글에서는 도커를 이용해 간단하게 파이썬 가상환경 이미지를 배포해봅니다."
categories: docker
tags : [docker, 도커, 컨테이너, 파이썬, 파이토치, cuda, cudnn, build, pull, push, commit, run, docker hub, 도커 허브, 설치, 사용법, docker nvidia, gpu, 명령어, 정리]
toc: true
toc_sticky: false
sidebar_main: false

last_modified_at: 2022-07-20
---

<img src='https://user-images.githubusercontent.com/78655692/179643735-e64c6545-9239-4d81-9e63-d7d8f834d456.png' width=650>

<br>
<br>

## Docker

![image](https://user-images.githubusercontent.com/78655692/179672618-f62ebe53-9d24-4f7d-b4c7-a534743e08d5.png) <br> 이미지출처 [^2]

- **도커(Docker)**는 특정 프로그램의 배포 및 관리를 단순하게 해주는 오픈소스 플랫폼으로 리눅스 컨테이너를 기반으로 한다.
  - 서버에서는 도커를 이용해 여러 개의 컨테이너를 실행할 수 있으며 배포 또한 가능하다.
- **이미지(image)**는 도커 컨테이너를 생성하는 지침이 포함된 템플릿이다. Dockerfile등 yml로 만들어 공유할 수 있다. [^1]
  - 이미지에는 실행 가능한 이미지로 애플리케이션을 실행하는 데 필요한 모든 것(코드, 런타임, 라이브러리 등)이 포함된다.
- **컨테이너(container)**는 이미지의 실행가능한 인스턴스이다. 
  - 컨테이는 호스트 시스템의 다른 모든 프로세스와 격리된 시스템의 샌드박스 프로세스이다.
- **도커 허브(docker hub)**는 컨테이너 이미지를 저장하고, 검색하고, 추출하기 위한 리포지토리를 제공한다.

<br>
<br>

## 기본 도커 명령어

> 도커가 설치되었다고 가정합니다.

### build

- `build` 명령어는 로컬 디렉터리에 있는 Dockerfile을 이용해 이미지를 만들고(생성) [account]/[repository]:tag 를 부여한다.
  - Dockerfile이 있는 경로에 있어야 한다.
  - `-t` 또는 `--tag`를 붙인다.

    ```shell
    $ docker build . -t [account]/[repository]:[tag] 
    ```

<br>

### pull

- `pull` 명령어는 docker hub로부터 우분투 도커 이미지를 가져온다.

    ```shell
    $ docker pull ubuntu:20.04
    ```

<br>

### push

- `push` 명령어는 도커 명령어로 만든 컨테이너를 저장소에 푸시하기 위함이다.
  - "업로드한다"고 이해하면 된다.

    ```shell
    $ docker push account/repository:tag
    ```

<br>

### commit

- `commit` 명령어는 종료된 도커 컨테이너 상태 그대로 이미지를 생성해준다. [^3]

  ```shell
  $ docker commit [container ID] [Image name]
  ```

<br>
<br>

## 도커허브로 이미지 배포하기

- 도커허브로 이미지 배포하기까지의 단계는 다음과 같다.

  1. Dockerfile을 작성한다.
  2. 이를 바탕으로 이미지를 생성한다.
  3. 이미지를 도커 허브로 푸시한다.

<br>

- **Dockerfile**은 간단하게 다음과 같이 작성해보았다.
  - `FROM` : 어느 이미지에서부터 시작할 것인지를 정의한다.
  - `RUN` : 새로운 레이어에서 명령어를 실행하고, 새로운 이미지를 생성한다.

```dockerfile
FROM ubuntu:20.04
FROM nvidia/cuda:11.3.0-cudnn8-devel-ubuntu20.04

RUN apt-get -y update -y
RUN apt-get -y upgrade -y
RUN apt-get install git -y
RUN rm -rf /var/lib/apt/lists/*
```

<br>

<img src='https://user-images.githubusercontent.com/78655692/179677177-fcc4776c-8322-4cab-a46f-a0c6eeda3a6e.png' width=600>

- [docker hub](https://hub.docker.com/)에 들어가 `Create Repository`를 클릭한다.
- 1번은 계정(account)이고, 2번은 저장소 이름(repository)이다. 작성한 후 `Create`를 누르면 해당 저장소가 생성된다.

<br>

- 해당 저장소로 dockerfile 내용을 토대로 이미지를 빌드한다.
  - tag를 지정안하면 default 값으로 latest로 된다.

    ```shell
    $ docker build . -t ingu627/venv:0.1
    ```

<br>

- docker hub에 이미지를 업로드하기 전에 도커에 로그인부터 해야 한다.
- 해당 명령어로 로그인을 한다.

    ```shell
    $ docker login
    ```


<br>

- `docker images` 명령어를 실행해 이미지가 잘 만들어졌는지 확인한다.
- 그 후, 다음 명령어를 통해 해당 저장소로 푸시한다.

    ```shell
    $ docker push ingu627/venv:0.1
    ```

<br>

- docker hub로 잘 업로드되었다면, 해당 이미지를 로컬로 불러올 수 있다. 이때 pull 명령어를 쓴다.

    ```shell
    $ docker pull ingu627/venv:0.1
    ```

<br>

- 그 다음, 해당 이미지를 run 명령어로 실행하여 컨테이너를 생성한다.
  - `-d` : 백그라운드 모드로 실행
  - `-it` : 인터랙티브 모드로 실행
  - `--name` : 해당 컨테이너 이름을 생성
  - `-p` : [host port][container port] port 연결
- 만약 실행이 안된다면, docker desktop의 `run`을 실행해본다.

  ```shell
  $ docker run -d -it --name pytorch ingu627/venv:0.1
  ```

- 현재 컨테이너가 실행되고 있는지 확인하고 싶다면 다음 명령어를 사용한다.

    ```shell
    $ docker ps
    ```

<br>

- 처음에 `#`만 나온다면, `/bin/bash`를 통해 해당 터미널을 들어간다.

    ![image](https://user-images.githubusercontent.com/78655692/179680446-acc3cd20-7569-4acf-8a74-edc537ce5348.png)

<br>

- 그 안에서 기존 파이썬 가상환경 만들때처럼 똑같이 하면 된다.

<br>
<br>

## 결론

- 하지만.. 매번 설치할 때마다 힘들었던 것을 도커가 대신 해주지 않는가. 위의 과정이 복잡한 분을 위해 아나콘다 설치까지 모든 과정을 한 이미지를 미리 업로드 해놨다.
- 다음 한줄 코드만 쓰면 된다.

    ```shell
    $ docker pull ingu627/pytorch_venv:pytorch-gpu
    ```

- 해당 이미지 정보 : anaconda, cuda 11.3, cudnn 8.2.1, git, pytorch, ubuntu 20.04 등 설치

<br>
<br>

## 추가 : docker와 vs code 연동

- 그렇다면, docker에 있는 파이썬 가상 환경을 제대로 써봐야 한다.
- 가장 유연하게 쓸 수 있는 툴이 vs code인데, 이 경우 터미널에서 해당 컨테이너 이름을 attach해주면 된다.

  ```shell
  # 해당 이미지를 이용하여 컨테이너 실행
  $ docker run -d -it --gpus all --name pytorch ingu627/pytorch_venv:pytorch-gpu
  ```

  ```shell
  $ docker attach [container name]
  # 예시
  $ docker attach pytorch
  ```

- gpu를 쓰려면, 해당 명령어들을 실행해 설치해준다.

  ```shell
  $ distribution=$(. /etc/os-release;echo $ID$VERSION_ID) \
    && curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add - \
    && curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list

  $ sudo apt-get update
  $ sudo apt-get install -y nvidia-docker2 
  ```

<br>

<img src='https://user-images.githubusercontent.com/78655692/179695593-67e68132-1430-497e-a36c-3e2551004db8.png' width=600>

- 도커 이미지 안에 `tf2.8` 이름의 가상환경이 내장돼 있다.
- `cd ~`
- `source tf2.8/bin/activate` 하면 pytorch 등이 설치된 가상환경이 활성화된다.
- git 도 설치되어 있으니 git clone도 가능하다. 
- 즉, 도커 이미지를 바로 pull해서 사용하면 된다.



<br>
<br>
<br>
<br>

## References

[^1]: [도커 튜토리얼 해보기 - yohanpro](https://yohanpro.com/posts/docker/tutorial)
[^2]: [docker에 대해 알아보자! (docker 기본) - 정찡이](https://ryu-e.tistory.com/3?category=784316)
[^3]: [도커(Docker) : 이미지 커밋(업데이트)하기 - 오늘도 야근](https://tttsss77.tistory.com/230)