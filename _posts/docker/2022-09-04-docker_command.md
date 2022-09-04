---
layout: single
title: "터미널 내 도커(docker) 컨테이너 명령어, 옵션 정리"
excerpt: "윈도우 프롬프트, 리눅스 터미널 등에서 사용되는 도커 명령어, 옵션들을 정리해보았습니다. pull, run, start, stop, rm"
categories: docker
tag : [docker, 도커, 컨테이너, 설치, 사용법, docker, 명령어, 정리, pull, run, start, stop, rm, 옵션]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-09-04
---


<img align='right' width='300' height='150' src='https://user-images.githubusercontent.com/78655692/179643735-e64c6545-9239-4d81-9e63-d7d8f834d456.png
'>
도커를 사용하면서 명령어를 정리해야겠다는 생각을 했습니다.<br><br> **환경** <br> OS : Ubuntu 22.04 <br> Docker version : 20.10.17 (중요하지 않습니다.) <br> 이미지 사용 : ingu627/hadoop:spark3.3.0
{: .notice--info}


<br>
<br>
<br>

## 0. 명령어 전체 개요

<img src='https://user-images.githubusercontent.com/78655692/188309951-22b9cb91-1dfe-483b-8314-c6458a9bc96b.png' width=650> <br> 이미지출처 [^1]

- **이미지(image)** : 컨테이너 실행에 필요한 파일과 설정값등을 포함하고 있는 파일이다.
  - 이미지는 [도커 허브 링크](hub.docker.com/)에 존재한다.
  - 예시 : [docker hub - ingu627](https://hub.docker.com/u/ingu627)
- **컨테이너(container)** : 프로세스와 비슷한 개념이다. 

<br>

## 1. 도커 이미지 가져오기

- **pull** : 도커 허브로부터 가져오고 싶은 도커 이미지를 가져온다.
  - `계정명/저장소명:태그명`

```shell
$ docker pull ingu627/hadoop:spark3.3.0
```

- **실행결과**

    ![Screenshot from 2022-09-04 20-37-45](https://user-images.githubusercontent.com/78655692/188311366-452fde22-0c2e-45e7-a722-818abe6f1251.png)

<br>
<br>

## 2. 도커 컨테이너 확인

- **docker images** : 이미지를 조회할 때 사용된다. 전체 이미지 목록을 출력해준다. [^2]
- **docker ps** : 컨테이너의 리스트를 반환해준다.
  - 현재 가동중인 컨테이너만 출력해준다.
- **docker ps -a** : 가동중, 멈춘 컨테이너를 모두 다 표현해주는 명령어이다.


- **실행결과**

    ![Screenshot from 2022-09-04 20-39-27](https://user-images.githubusercontent.com/78655692/188311430-0e5d18c4-9f6d-48c4-829c-95339a8bd1c4.png)

<br>
<br>

## 3. 컨테이너 생성 및 시작

- **run**은 여러가지 옵션을 통해 다양한 방식으로 컨테이너를 실행할 수 있도록 해준다.
- 명령어는 다음과 같다.

```shell
$ docker run [옵션] 이미지명:태그명 [명령어] [파라미터]
```

- **[옵션]**
  - **-i, --interactive** : 컨테이너에 attach(접속)하지 않은 상태여도 표준 입력(stdin)을 활성화하고 유지한다.
  - **-t, --tty** : TTY 모드를 사용하는 것으로, 셸에 명령어를 작성할 수 있다.
  - **-it** : `-i`와 `-t`를 모두 적용한 것이다. 즉, 컨테이너를 종료하지 않은 채, 터미널의 입력을 계속해서 컨테이너로 전달하기 위해서 사용한다. [^3]
  - **-d, --detach** : 컨테이너를 백그라운드에서 실행하게 한다. 실행한 컨테이너 id를 출력한다.
    - 보통 데몬(daemon) 모드라 부른다.
  - **--name** : 컨테이너 이름을 설정한다.
  - **-h, --hostname** : 컨테이너의 호스트 이름을 설정한다.
  - **-p, --publish** : 호스트와 컨테이너의 포트를 연결한다.
    - `[호스트 포트]:[컨테이너 포트]`
  - **--privileged** : 컨테이너 안에서 호스트의 리눅스 커널 기능(Capability)을 모두 사용한다. [^4]
    - 호스트의 주요 자원에 접근할 수 있다.
  - **--link** : 컨테이너끼리 연결한다.
    - ex. "[컨테이너명]:[별칭]"
  - **--rm** : 실행이 끝나고 즉시 제거한다.

<br>

```shell
$ docker run -it -d -h spark -p 8080:8080 --privileged=true --name spark ingu627/hadoop:spark /sbin/init
```

<br>
<br>

## 4. 컨테이너 시작

- **start** : 정지된 컨테이너를 시작하게 해준다.
  - `docker start [컨테이너 id]`

```shell
$ docker start spark
```

- **실행결과**

    ![Screenshot from 2022-09-04 21-00-00](https://user-images.githubusercontent.com/78655692/188312283-39e9b7a9-f7a1-4403-955a-f130d0a5609c.png)

<br>

### 4.1 VSCODE 연결하기

- 실행중인 컨테이너를 vscode에서 작업하고 싶다면 다음 과정을 보면 된다.
1. vsocde를 실행하여 `ctrl+shift+p`를 누른다.
2. 검색창에서 `Remote-Containers: Attach to Running Container`를 찾아 클릭한다.

    ![Screenshot from 2022-09-04 21-02-59](https://user-images.githubusercontent.com/78655692/188312440-9c804af7-276d-42ab-ad80-1d41f831aeec.png)

<br>
<br>

## 5. 컨테이너 중지

- **stop** : 실행 중인 컨테이너를 중지하고 싶을 때 이 명령어를 쓴다.
  - `docker stop [컨테이너 id]`

```shell
$ docker stop spark
```

<br>
<br>

## 6. 컨테이너 삭제

- **rm** : 이 명령어를 사용하여 삭제한다.

```shell
$ docker rm [옵션] [컨테이너 id]
```

- **옵션**
  - **-f, --force** : 실행 중인 컨테이너를 강제로 삭제
  - **-v, --volume** : 할당한 불륨을 삭제



<br>
<br>
<br>
<br>

## References

[^1]: [[Docker] 도커 컨테이너 명령어(create, start, stop, rm, run, cp) - JJJJLLLL](https://imjeongwoo.tistory.com/111)
[^2]: [Docker 이미지 관련 커맨드 사용법](https://www.daleseo.com/docker-images/)
[^3]: [docker run 커맨드 사용법](https://www.daleseo.com/docker-run/)
[^4]: [[Docker] Docker run 옵션 종류 - 우노](https://wooono.tistory.com/348)