---
layout: single
title: "맥 m1 환경에서 하둡(Hadoop), 스파크(Spark) 설치 및 환경설정하기"
excerpt : "하둡과 스파크를 로컬환경에서 설치하는 과정을 글로 담기 위해 적어보았습니다."
categories: tips
tag : [하둡, m1, 맥, hadoop, 스파크, 설치, ssh, 자바, 환경설정, hdfs, yarn, 맵리듀스]

toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2023-01-06
---

<br>

<img align='right' width='200' height='200' src='https://user-images.githubusercontent.com/78655692/210795225-fbe262fc-2749-4476-a38d-f74477240eb8.png'>
**노트북 환경** <br> MacBook Pro - M1 <br><br> **하둡, 스파크 버전** <br> 자바(Java): 19.0.1 <br> 하둡(Hadoop): 3.3.4 <br> 스파크(Spark): 3.3.0
{: .notice--info}

<br>
<br>

## 1. 자바(JDK 19) 설치

- **하둡**은 자바 기반의 오브 소스 프레임워크이므로, 자바를 먼저 설치해줘야 한다.
- [[ORACLE JAVA 19]](https://www.oracle.com/java/technologies/downloads/#jdk19-mac) 링크로 가 `Arm 64 DMG Installer`를 다운로드한다.
- **스크린샷**

    <img width="1316" alt="image" src="https://user-images.githubusercontent.com/78655692/210787305-4f3255b9-9a52-4a69-b282-642d8db596cd.png">

<br>

- 또는 azul사의 zulu Open JDK도 맥 m1칩용을 제공한다. 둘 중 아무거나 받아도 상관없다.
- [[AZUL Java 19(STS)]] 링크로 가 macOS arm64버전을 다운로드한다.
- **스크린샷**

    <img width="1304" alt="image" src="https://user-images.githubusercontent.com/78655692/210792060-85a0a650-7219-408b-b6d8-d73988256a46.png">

<br>

- 그 후 `vi ~/.zshrc` 명령어를 통해 파일을 연 뒤, 아래처럼 java 경로를 export 해준다.
  - 또는 `~/.bashrc`
- 완료 후, `source ~/.zshrc` 명령어를 통해 파일을 실행한다.

```shell
export JAVA_HOME="/Library/Java/JavaVirtualMachines/zulu-19.jdk/Contents/Home"
export CLASSPATH=.:$JAVA_HOME/lib/tools.jar
export PATH=${PATH}:$JAVA_HOME/bin
```

- `java -version` 명령어로 아래처럼 나오면 정상적으로 설치가 됐다.

    <img width="722" alt="image" src="https://user-images.githubusercontent.com/78655692/210792461-fd4e4187-c5aa-45a9-b50d-4175fb495fb1.png">

<br>
<br>

## 2. ssh 설정

- 하둡은 네임(마스터) 노드에서 여러 개의 데이터(워커) 노드와 서버 접속이 가능하게 해야 되기 때문에 ssh 통신에 사용할 키 교환을 수행해야 한다.
- `ssh localhost` 명령어를 통해 ssh 설치 여부를 확인할 수 있다.
- 키 수정은 다음과 같다. 
  - 인증키를 미리 생성해서 ssh에 로그인할 때 비밀번호 대신 사용하는 방식이다. [^1] 

```shell
$ ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
$ cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
$ chmod 0600 ~/.ssh/authorized_keys
```

<br>
<br>

## 3. 하둡 설치

- 맥에서 **brew**를 통해 쉽게 설치가 가능하지만, 나중에 리눅스 등 다른 OS에서도 원활히 설치하기 위해 하둡 홈페이지에서 설치를 진행해본다.
- 마찬가지로, 해당 [[Apache Hadoop - Download]](https://hadoop.apache.org/releases.html) 링크로 가 `binary` 파일을 다운받는다.
- **스크린샷**

    <img width="1320" alt="image" src="https://user-images.githubusercontent.com/78655692/210796070-5453d9ad-0cbc-4a16-834e-3a4f7e3f8b10.png">

<br>

- 보통 `Downloads` 경로에 다운로드 받아지므로 이를 root 경로로 변경해준다.
- `mv hadoop-3.3.4 ~/hadoop-3.3.4`

<br>

- 자바 경로처럼 하둡도 `~/.zshrc`로 가 경로를 설정해준다.
  - 이는 하둡을 실행하기 전에 자바가 설치된 위치를 하둡에 알려주어야 하기 때문이다.
  - 하둡 데몬을 실행하는 스크립트는 `sbin` 디렉토리에 있다. 하둡 데몬을 로컬 컴퓨터에서 실행하려면 이 디렉토리를 PATH에 추가해줘야 한다.

```shell
export HADOOP_HOME="/Users/hyunseokjung/hadoop-3.3.4"
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin
export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
```

<br>

### 3.1 그 외 환경설정 

- 하둡의 각 구성요소에 대한 설정은 XML 파일을 이용한다.
  - **etc/hadoop/core-site.xml** : 공통 속성
  - **etc/hadoop/hdfs-site.xml** : HDFS 속성
  - **etc/hadoop/mapred-site.xml** : 맵리듀스 속성
  - **etc/hadoop/yarn-site.xml** : YARN 속성

<br>

- **가상 분산(Pseudo-Distributed) 모드**는 모든 하둡 데몬을 로컬 머신에서 실행하는 방법이다. 지금은 이 모드를 사용해본다.
  - 하둡 데몬을 여러 대의 머신으로 구성된 클러스터에서 실행하는 방법은 추후에 쓰겠다.
- `etc/hadoop` 디렉토리에 다음 내용이 담긴 환경 설정 파일을 만든다.

- **core-site.xml**

```shell
<configuration>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://localhost:9000</value>
    </property>
</configuration>
```

<br>

- **hdfs-site.xml**

```shell
<configuration>
    <property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>
</configuration>
```

<br>

- **mapred-site.xml**

```shell
<configuration>
  <property>
      <name>mapreduce.framework.name</name>
      <value>yarn</value>
  </property>
  <property>
    <name>mapred.job.tracker</name>
    <value>localhost:8021</value>
  </property>
</configuration>
```

<br>

- **yarn-site.xml**

```shell
<configuration>
    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
</configuration>
```

<br>

### 3.2 HDFS 파일시스템 포맷하기

- HDFS를 사용하기 전에 먼저 파일시스템을 포맷해줘야 한다.

```shell
$ bin/hdfs namenode -format
```

<br>

### 3.3 데몬 시작과 중지

- HDFS, 맵리듀스, YARN 데몬을 각각 구동하기 위한 명령어는 다음과 같다.

```shell
$ sbin/start-dfs.sh ## HDFS
$ sbin/mr-jobhistory-daemon.sh start historyserver ## 맵리듀스
$ sbin/start-yarn.sh ## YARN
```

<br>

- `http://locathost:9870` 웹 UI를 통해 데몬 프로세스를 확인할 수 있다.
- **결과**

  <img width="1323" alt="image" src="https://user-images.githubusercontent.com/78655692/210920628-0753f437-9d08-4fb1-9528-acb6da86328e.png">

- 또한, 자바의 `jps` 명령어를 사용해 데몬 동작 여부를 파악할 수 있다.


<br>

- 데몬 중지는 다음과 같다.

```shell
$ sbin/stop-dfs.sh ## HDFS
$ sbin/mr-jobhistory-daemon.sh stop historyserver ## 맵리듀스
$ sbin/stop-yarn.sh ## YARN
```

<br>

### 3.4 사용자 디렉토리 생성

- 다음 명령어를 통해 홈 디렉토리를 생성한다.

```shell
$ hadoop fs -mkdir -p /user/hyunseokjung 
```

<br>
<br>

## 4. 스파크 설치 

- **스파크(Apahce Spark)**는 빅데이터 처리를 위한 오픈 소스 분산 시스템이다.
- 하둡과 마찬가지로 [[Apache Spark Homepage - Download]](https://spark.apache.org/downloads.html) 링크로 가 최신 버전을 설치해준다.
- **스크린샷**

  <img width="1312" alt="image" src="https://user-images.githubusercontent.com/78655692/210923882-6b59709b-be2b-4a95-9a77-cc0b33508a20.png">

<br>

- 보통 `Downloads` 경로에 다운로드 받아지므로 이를 root 경로로 변경해준다.
- `mv spark-3.3.0-bin-hadoop3 ~/spark-3.3.0`
- 그리고 `~/.zshrc` 로 가 spark에 대한 환경설정을 해준다.

```shell
export SPARK_HOME="/Users/hyunseokjung/spark-3.3.0"
export PATH=$PATH:$SPARK_HOME/bin:$SPARK_HOME/sbin
export SPARK_LOCAL_HOSTNAME=localhost
```

> 그 외 스파크에 대한 자세한 내용은 [Category - SPARK](https://ingu627.github.io/categories/spark) 링크로 가 참조하면 된다.


<br>
<br>
<br>
<br>

## References

[^1]: [맥에서 하둡 설치하기](https://jeongxoo.tistory.com/14)