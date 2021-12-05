---
layout: single
title: "Linux 기초 정리 (4) - process, daemon"
excerpt: "생활 코딩 강의 내용을 요약 및 정리한 글입니다. - 프로세스와 실행"
categories: linux
tag: [linux, basic, ubuntu, 모니터링, 백그라운드, 데몬, cron]

toc: true
toc_sticky: true

last_modified_at: 2021-12-01

sidebar_main: true
---

본 글은 "생활 코딩 - Linux" 강의 내용을 요약 및 정리한 글입니다. <br> 개인공부 목적이므로 자세한 사항은 [생활코딩 - Linux](https://www.inflearn.com/course/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-%EB%A6%AC%EB%88%85%EC%8A%A4-%EA%B0%95%EC%A2%8C#curriculum)로 참고하시길 바랍니다.
{: .notice--info}

<br>
<br>

## 컴퓨터의 구조 

![image](https://user-images.githubusercontent.com/78655692/144157022-85550156-7635-4c3d-89bd-282bc49153d6.png)

- 프로그램은 storage에 깔려 있다. 깔려 있는 프로그램을 실제로 사용할 때는 그 프로그램을 읽어서 memory에 적재시킨다. 실행 안하는 것은 memory에 올라오지 않는다. 올라온 것을 cpu가 거기에 적혀있는 대로 읽어서 로딩한다.

- `program` : 파일에 저장된 형태
- `process` : 실행되고 있는 상태의 프로그램
- `processor` : process를 처리하는 것
- `CPU` : 프로그램 실행과 데이터 처리를 담당하는 핵심 요소이다.
- `memory` : 프로그램 코드와 데이터를 저장하는 장치


<br>
<br>

## 프로세스 모니터링 (ps, top, htop)

- 현재 시스템의 프로세스를 보여주는 것을 실행.

### ps

- `ps` : process list를 보여주는 명령어

![image](https://user-images.githubusercontent.com/78655692/144150859-546c743b-9f12-4708-a80a-23ff561b0594.png)

- `ps aux` : process background를 보여주는 명령어

![image](https://user-images.githubusercontent.com/78655692/144150938-256cea14-ca77-46bf-ad61-2f580813a327.png)

- `ps aux | grep apache` : 이 중 apache만을 보여줌

![image](https://user-images.githubusercontent.com/78655692/144151213-741762fd-0c37-4b8a-9004-173b9d3eb3f5.png)

<br>

### top

- `sudo top` 입력

![image](https://user-images.githubusercontent.com/78655692/144151320-326df3a7-69e2-4cfb-b4b9-08e8dc9a4043.png)

<br>

### htop

- `htop` 입력
- 화면 상단에 8개의 숫자가 있는데 이는 cpu 숫자를 의미.
- Load average는 부하를 의미

![image](https://user-images.githubusercontent.com/78655692/144151398-18c516f4-83a2-48d5-a282-fbfb8666c2a8.png)

<br>
<br>

## 백그라운드

- 멀티태스킹 : 여러 개의 화면을 한 화면에 나타냄
- `nano` : 에디터 편집기
  - `ctrl + z`는 잠깐 나갔다 오는 것
  - `fg`로 치면 방금 실행한 것으로 감

![image](https://user-images.githubusercontent.com/78655692/144155141-681f9798-f9b8-427f-a64e-1908eaace69e.png)

- `jobs` : 현재 진행중인 프로그램 알려줌
- `+`는 fg를 했을 때 되돌아가는 프로그램
- `fg %숫자` : 그 프로그램으로 돌아감

![image](https://user-images.githubusercontent.com/78655692/144155319-c600bd7d-23bb-4fcd-aca3-2acf4ffe1018.png)

- `kill %숫자` : 그 프로그램 종료
- `kill -9 %숫자` : 좀 더 강력하게 프로그램 종료

![image](https://user-images.githubusercontent.com/78655692/144155681-9caf1a43-857f-4ac3-907b-a73f0e289d91.png)

<br>
<br>

## 데몬 (daemon)

![image](https://user-images.githubusercontent.com/78655692/144158753-c14dbae6-1614-4ea6-81c0-a2813fed1703.png)

- **데몬**의 특성은 항상 실행되고 있다.를 의미
- ls, rm, mkdir은 필요할 때만 켰다 킨다. 그러나 server는 데몬을 의미.

### service와 자동실행

- `service [데몬] [상태]` : 현재 실행중인 데몬을 제어한다.
  - `start`: 실행
  - `stop` : 중지  

![image](https://user-images.githubusercontent.com/78655692/144159075-0232a11d-ba2a-424a-aed6-d41a478a8a35.png)

- `sudo apt-get install apache2` 하면 아파치라는 웹서버를 설치한다.
  - 에러가 나면 `sudo apt-get update` 해준다.
  - `/etc/init.d/`에는 데몬 프로그램들이 있는 곳이다.

![image](https://user-images.githubusercontent.com/78655692/144159849-f1cf8143-66bf-4b8c-9468-533131e4476a.png)

<br>

- `sudo service apache2 start`를 입력하면 apache2 웹서버가 시작된다.

![image](https://user-images.githubusercontent.com/78655692/144164335-5b233049-9a93-4405-8a10-43d34890bd06.png)

- `px aux | grep apache2`

![image](https://user-images.githubusercontent.com/78655692/144164387-1f29c04f-a82a-4db8-8646-f3de83f75db7.png)

- `sudo service apache2 stop` : 서버 멈춤

![image](https://user-images.githubusercontent.com/78655692/144165110-45e9e9c4-4d75-4eca-b6df-0f8bf52c60f5.png)

<br>
<br>

## cron

- 정기적으로 명령을 실행시켜 주는 소프트웨어 (ex. 정기적으로 백업, 전송...)
- `crontab -e` : 하고자 하는 일을 정의할 수 있다.
  - 정기적으로 실행하고 싶을 때 여기에 적는다.

![image](https://user-images.githubusercontent.com/78655692/144168386-d6402ea2-ded9-427a-a04b-023a9cf643ce.png)

![image](https://user-images.githubusercontent.com/78655692/144168863-9001e6c0-c0c2-4626-8d9d-a3f7ae85deff.png)

- `m` : 실행되는 분의 주기
  - `*/1` : 1분마다
- `h` : 실행되는 시간의 주기
- `dom` : day of month (일)
- `mon` : 달 주기
- `dow` : 요일

<br>

- `date` : 현재 시간을 알려줌 

![image](https://user-images.githubusercontent.com/78655692/144169018-066539b4-54d6-4a5a-b456-f5fdc37de1c2.png)

![image](https://user-images.githubusercontent.com/78655692/144169112-ef157412-2f44-4f42-8be6-b9e4c8630454.png)

- `>>` : 실행할 때마다 date가 date.log 끝에 추가

- `crontab -l` : 우리가 처리한 내용을 화면에 출력

![image](https://user-images.githubusercontent.com/78655692/144169479-c90d36ce-6b76-4706-b4bf-4d693f331d32.png)

- `tail -f date.log` : tail은 끝부분을 보여주는데 -f를 하여 감시하고 있다가 date.log의 끝부분이 나타나면 출력해줌.
    `ctrl + c` : 빠져나감

- `*/1 * * * * date >> date.log 2>&1` : 표준에러가 나면 표준출력으로 나타내어 date.log에 추가
  - `2>&1` : 표준에러를 표준출력으로 해줌

<br>
<br>

## 쉘을 시작할 때 실행

![image](https://user-images.githubusercontent.com/78655692/144170515-a6601ade-b645-4691-8e28-1ca9e61cf91e.png)

- `alias` : 별명
- `alias l='ls -al'`하고 l만 누르면 `ls -al`이 실행된다.

![image](https://user-images.githubusercontent.com/78655692/144170632-0e80929d-ffe3-4947-aaa7-066d5d04882a.png)

- `cd ~`로 간 다음 `nano .bashrc`로 하면 쉘에 접속할 때 쉘 프로그램이 .bashrc 안에 있는 명령어를 수행한다.

![image](https://user-images.githubusercontent.com/78655692/144171147-3c40a89b-569d-46d7-8238-61df64616b8c.png)

- `crtl + End`을 누르면 코드 맨 아래로 가는데 여기서 `Hi, bash`를 쳐본다.
- `exit` : 나가기
- `bash` : bash 실행

![image](https://user-images.githubusercontent.com/78655692/144171389-10e13ef1-b2ef-49df-b233-7029a7971088.png)

<br>
<br>

## References

- [생활코딩 - Linux](https://www.inflearn.com/course/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-%EB%A6%AC%EB%88%85%EC%8A%A4-%EA%B0%95%EC%A2%8C#curriculum)
- [[컴퓨터구조] 컴퓨터의 기본 구조 - @ 낭람_ ](https://security-nanglam.tistory.com/201)
- [Difference Between Memory and Storage](https://backupeverything.co.uk/difference-between-memory-and-storage/)
- [Linux Daemon ( 1 / x )](https://weicomes.tistory.com/40)
- [리눅스 크론탭(Linux Crontab) 사용법](https://jdm.kr/blog/2)
- [30 Handy Bash Shell Aliases For Linux / Unix / MacOS](https://www.cyberciti.biz/tips/bash-aliases-mac-centos-linux-unix.html)




