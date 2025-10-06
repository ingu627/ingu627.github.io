---
layout: single
title: "Docker HDP(Hortonworks) 샌드박스: 설치·포트·서비스 기동 가이드"
excerpt: "Docker 기반 HDP 샌드박스 이미지 다운로드부터 메모리/포트 설정, Ambari로 HDFS·YARN·Hive 서비스 기동 확인 단계별 정리"
categories: tips
tags: [tip, 리눅스, 도커, docker, linux, hdp, 호튼웍스, hdp, hortonworks, 설치, wsl2, ambari, hadoop, 하둡, sandbox, 사용법]

toc: true
toc_sticky: true
sidebar_main: false

data: 2022-08-05
last_modified_at: 2022-08-21
---

Hortonworks Data Platform(HDP)는 분산 스토리지 및 대규모 멀티 소스 데이터 세트 처리를 위한 오픈소스 프레임워크입니다. 도커 내 hdp를 설치해봅시다. <br><br> 도커 내 HDP 설치 참고 : [
Cloudera 공식 사이트](https://www.cloudera.com/tutorials/sandbox-deployment-and-install-guide/3.html) <br> HDP 파일 다운로드 : [cloudera - download - hortonworks-sandbox](https://www.cloudera.com/downloads/hortonworks-sandbox.html)
{: .notice--danger}

<br>
<br>

## 윈도우10 내 도커(docker) 설치

- 본 설치에 앞서, 윈도우10 내 도커 설치를 해야 한다. 아래 사이트 참고
  - [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)

    <img src='https://user-images.githubusercontent.com/78655692/183076758-0bee747c-3e8e-4fa3-8f51-dbf2668b9713.png' width=700>

- 윈도우 내 리눅스, 즉 wsl2도 있어야 한다. 아래 사이트 참고
  - [윈도우10에서 리눅스(Linux) 설치하기 (Ubuntu on WSL2)](https://ingu627.github.io/tips/install_ubuntu/)

<br>
<br>

## HDP 설치

- HDP 샌드박스를 사용하면 Apache Hadoop, Apache Spark, Apache Hive, Apache HBase, Druid 및 DAS(Data Analytics Studio)를 쉽게 시작할 수 있는 장점이 있다.
  - 즉, 모든 빅데이터 저장 및 처리를 위한 툴이 모두 설치되어 있다.
- [Get Started with Hortonworks Sandbox](https://www.cloudera.com/downloads/hortonworks-sandbox.html) 를 클릭해 Hortonworks HDP에서 `Download Now`를 클릭한다. 
  - 계정 등록이 있다면 간단히 해준다.

    <img src='https://user-images.githubusercontent.com/78655692/183077480-759d1ad5-ca1b-42ea-8931-616c49659320.png' width=700>

<br>

- Installation TYpe에 `Docker`를 선택해 `LET'S GO!`를 클릭한다.

    <img src='https://user-images.githubusercontent.com/78655692/183077795-5e9a9b43-34f1-4467-bc7a-2fc4e47abd96.png' width=700>

<br>

- 그럼 아래 설치가 뜨는데, 3.0.1은 램이 22GB 이상 필요하기 때문에, 16GB이상 필요한 2.6.5를 설치해준다.(최소는 10GB 이상 필요하다.) 물론, 램이 여유가 있다면 3.0.1을 설치해도 된다. 

    <img src='https://user-images.githubusercontent.com/78655692/183077986-8ee935b0-a505-41e0-98b1-2ff31f9a690b.png' width=700>

<br>

- 2.6.5 버전에 기본 보함된 프로젝트들은 다음과 같다. [^1]

    <img src='https://user-images.githubusercontent.com/78655692/183082732-d00ead14-480d-4bfa-81aa-ae6c2e4bd29f.png' width=700>

<br>

- 다운로드받은 파일은 다음과 같다. 파일을 다운 받아, wsl2 내 경로로 파일을 이동시켜 준다.
  - wsl2 내 우분투 파일 경로는 `\\wsl$\Ubuntu` 이다.
  - 더 자세한 정보는 [윈도우10에서 리눅스(Linux) 설치하기 (Ubuntu on WSL2)](https://ingu627.github.io/tips/install_ubuntu/)를 참고하길 바란다.

    <img src='https://user-images.githubusercontent.com/78655692/183078606-4e081f31-1311-40dd-aaca-8c87e0a38b2d.png' width=500>

<br>

### WSL2 내 명령어 실행

- 다음은 `mkdir HDP_2.6.5`로 HDP_2.6.5 폴더를 생성해 다운받은 파일을 넣은 결과이다.
- 그 후, `bash docker-deploy-hdp265.sh` 명령어로 스크립트를 실행한다.

    ![image](https://user-images.githubusercontent.com/78655692/183079052-5d2a2770-1da3-4370-8953-8d2474168966.png)

<br>

- 설치가 끝나면 자동으로, `sandbox-proxy` 컨테이너와 `sandbox-hdp` 컨테이너 2개가 실행될 것이다.
- 아래는 `docker ps` 명령어를 통해 해당 컨테이너가 실행되는 것을 확인할 수 있다.

    <img src='https://user-images.githubusercontent.com/78655692/183080852-4be96b04-64ab-4a43-b474-bd5cfe921566.png' width=700>

<br>

- docker desktop으로 확인하면 다음과 같다.

    <img src='https://user-images.githubusercontent.com/78655692/183080016-431b5e48-d63d-4085-9136-5e992b2b9b7a.png' width=700>

<br>

### 기타 설정

- 그 후 해당 명령어를 통해 hosts 파일을 수정해준다. [^1]
- `echo '127.0.0.1 sandbox-hdp.hortonworks.com sandbox-hdf.hortonworks.com' | sudo tee -a /etc/hosts` 
- 그리고, port conflict가 있다면, 포트를 변경해준다. 단계는 다음과 같다. [^2]
  - `vi sandbox/proxy/proxy-deploy.sh` 명령어를 실행한다.
  - `6001:6001`를 `16001:6001`로 바꿔준다.

    ![image](https://user-images.githubusercontent.com/78655692/183081968-74869ef2-53be-4f73-8a9d-3edb9ff14816.png)

  - `esc`를 누른 후 `:wq`로 저장 후 파일을 나간다.
  - 그리고 `bash sandbox/proxy/proxy-deploy.sh`로 bash 스크립트를 실행한다. 

<br>

### 기타 명령어

- HDF sandbox를 중지하고 싶다면, 다음 명령어를 실행한다. 
  
    ```shell
    $ docker stop sandbox-hdf
    $ docker stop sandbox-proxy
    ```

- HDF sandbox를 시작하고 싶다면, 다음 명령어를 실행한다. 

    ```shell
    $ docker start sandbox-hdf
    $ docker start sandbox-proxy
    ```

<br>
<br>

## Ambari 접속

- 접속은 `127.0.0.1:8080`로 간다. 
- 그럼, 로그인 화면이 뜨는데, 다음을 입력한다.
  - 계정 : maria_dev
  - 비밀번호 : maria_dev

    <img src='https://user-images.githubusercontent.com/78655692/183083523-ae8400e0-2781-4be1-8cec-8cae005fcdd0.png' width=700>

<br>

- 다음 화면이 뜬다면, 성공적으로 설치가 된거다.

    <img src='https://user-images.githubusercontent.com/78655692/183083645-883d4d6d-33b7-440b-b579-d7b8111c64ed.png' width=700>

<br>
<br>

## 만약 이런 에러가 뜬다면, Ports are not available: listen tcp 0.0.0.0/50070: bind: An attempt was made to access a socket in a way forbidden by its access permissions

- **해결책**
  - 명령 프롬프트에서 다음과 같은 명령어를 실행해준다.

  ```cmd
  net stop winnat
  docker start container_name
  net start winnat
  ```



<br>
<br>
<br>
<br>

## References

[^1]: [[Hadoop] 하둡 설치하기 - gnlenfn](https://velog.io/@gnlenfn/Hadoop-%ED%95%98%EB%91%A1-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0)
[^2]: [cloudera - sandbox-deployment-and-install-guide](https://www.cloudera.com/tutorials/sandbox-deployment-and-install-guide/3.html)

