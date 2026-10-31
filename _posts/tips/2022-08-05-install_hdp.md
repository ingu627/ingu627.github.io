---
layout: single
title: "도커(docker) 환경 내 Hortonworks Data Platform(HDP) 설치하기"
excerpt : "Hortonworks Data Platform(HDP)는 분산 스토리지 및 대규모 멀티 소스 데이터 세트 처리를 위한 오픈소스 프레임워크입니다. 도커 내 hdp를 설치해봅시다."
categories: tips
tags: [tip, 리눅스, 도커, docker, linux, hdp, 호튼웍스, hdp, hortonworks, 설치, wsl2, ambari, hadoop, 하둡, sandbox, 사용법]

toc: true
toc_sticky: true
sidebar_main: false

date: 2022-08-05
last_modified_at: 2026-10-11
---

> 이 글은 2022년 당시 HDP 2.6.5 버전 기준으로 작성된 설치 기록이다. 최신 버전에서는 명령이 다를 수 있다.

Hortonworks Data Platform(HDP)는 분산 스토리지 및 대규모 멀티 소스 데이터 세트 처리를 위한 오픈소스 프레임워크다. 도커 내에 HDP를 설치해본다.

- 도커 내 HDP 설치 참고 : [Cloudera 공식 사이트](https://www.cloudera.com/tutorials/sandbox-deployment-and-install-guide/3.html)
- HDP 파일 다운로드 : [cloudera - download - hortonworks-sandbox](https://www.cloudera.com/downloads/hortonworks-sandbox.html)


## 윈도우10 내 도커(docker) 설치

- 본 설치에 앞서, 윈도우10 내 도커 설치를 해야 한다. 아래 사이트 참고
  - [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)

    <img src='/assets/images/legacy/6b97294275.webp' width=700>

- 윈도우 내 리눅스, 즉 wsl2도 있어야 한다. 아래 사이트 참고
  - [윈도우10에서 리눅스(Linux) 설치하기 (Ubuntu on WSL2)](https://ingu627.github.io/tips/install_ubuntu/)


## HDP 설치

- HDP 샌드박스를 사용하면 Apache Hadoop, Apache Spark, Apache Hive, Apache HBase, Druid 및 DAS(Data Analytics Studio)를 쉽게 시작할 수 있는 장점이 있다.
  - 즉, 모든 빅데이터 저장 및 처리를 위한 툴이 모두 설치되어 있다.
- [Get Started with Hortonworks Sandbox](https://www.cloudera.com/downloads/hortonworks-sandbox.html) 를 클릭해 Hortonworks HDP에서 `Download Now`를 클릭한다. 
  - 계정 등록이 있다면 간단히 해준다.

    <img src='/assets/images/legacy/2894cd7f0c.webp' width=700>


- Installation TYpe에 `Docker`를 선택해 `LET'S GO!`를 클릭한다.

    <img src='/assets/images/legacy/9165a99ff4.webp' width=700>


- 그럼 아래 설치가 뜨는데, 3.0.1은 램이 22GB 이상 필요하기 때문에, 16GB이상 필요한 2.6.5를 설치해준다.(최소는 10GB 이상 필요하다.) 물론, 램이 여유가 있다면 3.0.1을 설치해도 된다. 

    <img src='/assets/images/legacy/39b85b947e.webp' width=700>


- 2.6.5 버전에 기본 포함된 프로젝트들은 다음과 같다. [^1]

    <img src='/assets/images/legacy/4b7b598b68.webp' width=700>


- 다운로드받은 파일은 다음과 같다. 파일을 다운 받아, wsl2 내 경로로 파일을 이동시켜 준다.
  - wsl2 내 우분투 파일 경로는 `\\wsl$\Ubuntu` 이다.
  - 더 자세한 정보는 [윈도우10에서 리눅스(Linux) 설치하기 (Ubuntu on WSL2)](https://ingu627.github.io/tips/install_ubuntu/)를 참고하길 바란다.

    <img src='/assets/images/legacy/abb5bb5e81.webp' width=500>


### WSL2 내 명령어 실행

- 다음은 `mkdir HDP_2.6.5`로 HDP_2.6.5 폴더를 생성해 다운받은 파일을 넣은 결과이다.
- 그 후, `bash docker-deploy-hdp265.sh` 명령어로 스크립트를 실행한다.

    ![image](/assets/images/legacy/2d97cf5018.webp)


- 설치가 끝나면 자동으로, `sandbox-proxy` 컨테이너와 `sandbox-hdp` 컨테이너 2개가 실행될 것이다.
- 아래는 `docker ps` 명령어를 통해 해당 컨테이너가 실행되는 것을 확인할 수 있다.

    <img src='/assets/images/legacy/ee3b853177.webp' width=700>


- docker desktop으로 확인하면 다음과 같다.

    <img src='/assets/images/legacy/880677a18d.webp' width=700>


### 기타 설정

- 그 후 해당 명령어를 통해 hosts 파일을 수정해준다. [^1]
- `echo '127.0.0.1 sandbox-hdp.hortonworks.com sandbox-hdf.hortonworks.com' | sudo tee -a /etc/hosts` 
- 그리고, port conflict가 있다면, 포트를 변경해준다. 단계는 다음과 같다. [^1]
  - `vi sandbox/proxy/proxy-deploy.sh` 명령어를 실행한다.
  - `6001:6001`를 `16001:6001`로 바꿔준다.

    ![image](/assets/images/legacy/1050d28d55.webp)

  - `esc`를 누른 후 `:wq`로 저장 후 파일을 나간다.
  - 그리고 `bash sandbox/proxy/proxy-deploy.sh`로 bash 스크립트를 실행한다. 


### 기타 명령어

- HDF sandbox를 중지하고 싶다면, 다음 명령어를 실행한다. 
  
    ```shell
    $ docker stop sandbox-hdp
    $ docker stop sandbox-proxy
    ```

- HDF sandbox를 시작하고 싶다면, 다음 명령어를 실행한다. 

    ```shell
    $ docker start sandbox-hdp
    $ docker start sandbox-proxy
    ```


## Ambari 접속

- 접속은 `127.0.0.1:8080`로 간다. 
- 그럼, 로그인 화면이 뜨는데, 다음을 입력한다.
  - 계정 : maria_dev
  - 비밀번호 : maria_dev

    <img src='/assets/images/legacy/5f06eca4b9.webp' width=700>


- 다음 화면이 뜬다면 설치가 완료된 것이다.

    <img src='/assets/images/legacy/4ebd5226b9.webp' width=700>


## 만약 이런 에러가 뜬다면, Ports are not available: listen tcp 0.0.0.0/50070: bind: An attempt was made to access a socket in a way forbidden by its access permissions

- **해결책**
  - 명령 프롬프트에서 다음과 같은 명령어를 실행해준다.

  ```cmd
  net stop winnat
  docker start container_name
  net start winnat
  ```




## 한계 및 주의사항

- HDP 2.6.5 샌드박스는 2018년 Hortonworks와 Cloudera 합병 이후 CDP(Cloudera Data Platform)로 통합되어 더 이상 갱신되지 않는다. 학습·재현 목적 외에는 최신 배포판 사용을 검토해야 한다. [^1]
- 샌드박스는 컨테이너 2개(2.6.5는 10GB 이상, 3.0.1은 22GB 이상 램)를 요구하므로, WSL2에 할당한 메모리가 부족하면 컨테이너가 시작되지 않는다.
- Windows의 winnat 포트 예약 문제로 `50070` 같은 포트 바인딩이 막힐 수 있어, `net stop winnat` / `net start winnat`으로 예약을 풀어야 하는 경우가 있다.
- Ambari(8080) 외의 서비스(Hive 10000, YARN ResourceManager 8088 등)는 hosts 파일 수정과 프록시 포트 매핑에 의존하므로, 프록시 스크립트의 포트를 바꾸면 접속 주소도 함께 바꿔야 한다.

## References

[^1]: [Cloudera Tutorials - Hortonworks Sandbox Deployment and Install Guide](https://www.cloudera.com/tutorials/sandbox-deployment-and-install-guide/3.html)

