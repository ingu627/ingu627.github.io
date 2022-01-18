---
layout: single
title: "[생활코딩] Linux 기초 정리 (2) - directory부터 데몬까지"
excerpt: "생활 코딩 강의 내용을 요약 및 정리한 글입니다. - 디렉토리 구조, 파일 찾는 법(locate, find), 컴퓨터 구조, 프로세스 모니터링, 백그라운드, 데몬, cron"
categories: linux
tag: [linux, basic, ubuntu, 디렉토리, locate, find, ps, top, htop, 백그라운드, 데몬, cron]

toc: true
toc_sticky: true

last_modified_at: 2022-01-18

sidebar_main: true
---

본 글은 "생활 코딩 - Linux" 강의 내용을 요약 및 정리한 글입니다. <br> 개인공부 목적이므로 자세한 사항은 [생활코딩 - Linux](https://www.inflearn.com/course/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-%EB%A6%AC%EB%88%85%EC%8A%A4-%EA%B0%95%EC%A2%8C#curriculum)로 참고하시길 바랍니다.
{: .notice--info}

<br>
<br>

## 디렉토리 구조1

- <u>[The Linux Directory Structure, Explained](https://www.howtogeek.com/117435/htg-explains-the-linux-directory-structure-explained/){: target="_blank"}</u> 참고

<br>

- C:\ 드라이브 및 드라이브 문자가 사라지고 / 및 암호처럼 들리는 디렉토리로 대체되었으며 대부분은 세 개의 문자 이름을 가진다.

![image](https://user-images.githubusercontent.com/78655692/144046213-116b7285-6374-405b-9e54-dea603eda947.png)

![image](https://user-images.githubusercontent.com/78655692/144046822-1609736b-f3b4-442a-8e3c-57e4d7408091.png)

<br>
<br>

### `/`  

- root directory
- Linux 시스템의 모든 것은 루트 디렉토리로 알려진 `/` 디렉토리 아래에 있다.
- Linux에는 드라이브 문자가 없다.

<br>
<br>

### `root`

- root home directory
- 루트 사용자의 홈 디렉토리이다. /home/root에 있는 대신 /root에 있다.

<br>
<br>

### `/bin` 

- Essential User Binaries
- 시스템이 단일 사용자 모드로 마운트될 때 있어야 하는 필수 사용자 바이너리(프로그램)가 들어가 있다.
- 컴퓨터는 0과 1로 되어 있다. 실행가능한 것을 컴퓨터에서는 binary라고 한다.
  - 사용자들이 사용하는 명령들이 위치하고 있다.
- Firefox와 같은 응용 프로그램은 /usr/bin에 저장되고 bash 셸과 같은 중요한 시스템 프로그램과 유틸리티는 /bin에 저장된다.

<br>
<br>

### `sbin`

- System Binaries
- 시스템 프로그램
- root 사용자가 쓰는 프로그램들은 sbin에 있다.

<br>
<br>

### `/etc`

- Configuration Files
- 일반적으로 텍스트 편집기에서 손으로 편집할 수 있는 구성 파일이 있다.

<br>
<br>

### `/lib`

- Essential Shared Libraries
- /bin 및 /sbin 폴더의 필수 바이너리에 필요한 라이브러리가 포함되어 있다.

<br>
<br>

### `/home`

- 각 사용자의 홈 폴더가 있다.
- `cd ~`를 하면 홈 디렉토리로 한방에 이동할 수 있다.
- 예를 들어, 사용자 이름이 bob인 경우 /home/bob에 홈 폴더가 있다. 이 홈 폴더에는 사용자의 데이터 파일과 사용자별 구성 파일이 들어 있다. 각 사용자는 자신의 홈 폴더에 대한 쓰기 권한만 가지며 시스템의 다른 파일을 수정하려면 높은 권한(루트 사용자가 됨)을 얻어야 한다.

![image](https://user-images.githubusercontent.com/78655692/144047937-4bfdea67-7903-4f77-a6da-891553d1859a.png)

<br>
<br>

### `/var`

- Variable Files
- 내용이 바뀔 수 있는 파일들이 있다.
-  로그 파일 및 정상 작동 중에 일반적으로 /usr에 기록되는 기타 모든 내용은 /var 디렉토리에 기록된다.

<br>
<br>

### `/tmp`

- Temporary Files
- 여기에 있는 파일들은 reboot되면 없어진다.

<br>
<br>

### `/opt`

- Optional add-on Applications
- 선택적 소프트웨어 패키지에 대한 하위 디렉토리가 있다.

<br>
<br>

### `/usr`

- User Programs
- 시스템에서 사용하는 응용 프로그램 및 파일과 달리 사용자가 사용하는 응용 프로그램 및 파일이 포함되어 있다.
- 예를 들어, 비필수 응용 프로그램은 /bin 디렉토리 대신 /usr/bin 디렉토리에 있고, 비필수 시스템 관리 바이너리는 /sbin 디렉토리 대신 /usr/sbin 디렉토리에 있다. 
- 각각의 라이브러리는 /usr/lib 디렉토리에 있다.

<br>
<br>

## 파일 찾는 법 - locate 와 find

- [https://www.tecmint.com/35-practical-examples-of-linux-find-command/](https://www.tecmint.com/35-practical-examples-of-linux-find-command/) 참고

<br>
<br>

### locate

- `locate 파일명`
  - 실행이 안된다면 `sudo apt install mlocate`로 설치
- 컴퓨터 안에 저장되어 있는 파일들에 대한 정보를 가지고 있는 데이터베이스를 찾는다.
- locate가 사용하는 데이터베이스를 `mlcate`를 이용한다.
  - `sudo updatedb` 이 명령을 수행

<br>
<br>

### find

- `find()` 함수는 실제로 파일들을 뒤진다.
- `find /` : 루트 디렉토리부터 찾겠다.
  - ex. `sudo find / -name *.log`
- `find .` : 현재 디렉토리부터 하위디렉토리까지 찾겠다. 
- `find ~` : 자신의 홈 디렉토리부터 찾겠다.

<br>
<br>

### whereis

- 어디에 있냐

![image](https://user-images.githubusercontent.com/78655692/144065331-604a7b07-1e70-419c-ac09-0cf742c5ccb1.png)

- `ls: /usr/bin/ls` : ls의 위치
- `/usr/share/man/man1/ls.1.gz` : `man ls` 했을 때의 사용설명서 내용
  - `echo $PATH` : 환경변수들의 경로인 path를 출력하는 명령어
    - path들은 전부 : (콜론)으로 구별되어 있다.
    - 리눅스에서 사용하는 명령어들도 결국 일종의 실행파일인데 명령어 입력 시 환경변수에 잡혀있는 PATH를 따라가서 해당 파일이 실행되는 원리로 명령어가 작동된다는 것
    - 결국 mkdir, ls 등의 명령어도 결국 저 path 경로에 저장되어 있다는 얘기이다.

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

<br>
<br>

### ps

- `ps` : process list를 보여주는 명령어

![image](https://user-images.githubusercontent.com/78655692/144150859-546c743b-9f12-4708-a80a-23ff561b0594.png)

- `ps aux` : process background를 보여주는 명령어

![image](https://user-images.githubusercontent.com/78655692/144150938-256cea14-ca77-46bf-ad61-2f580813a327.png)

- `ps aux | grep apache` : 이 중 apache만을 보여줌

![image](https://user-images.githubusercontent.com/78655692/144151213-741762fd-0c37-4b8a-9004-173b9d3eb3f5.png)

<br>
<br>

### top

- `sudo top` 입력

![image](https://user-images.githubusercontent.com/78655692/144151320-326df3a7-69e2-4cfb-b4b9-08e8dc9a4043.png)

<br>
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

<br>
<br>

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
<br>
<br>

## References

- [생활코딩 - Linux](https://www.inflearn.com/course/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-%EB%A6%AC%EB%88%85%EC%8A%A4-%EA%B0%95%EC%A2%8C#curriculum)
- [The Linux Directory Structure, Explained](https://www.howtogeek.com/117435/htg-explains-the-linux-directory-structure-explained/){: target="_blank"}
- [35 Practical Examples of Linux Find Command](https://www.tecmint.com/35-practical-examples-of-linux-find-command/){: target="_blank"}
- [5. 리눅스 환경변수(path) 설정](https://m.blog.naver.com/occidere/220821140420){: target="_blank"}
- [[컴퓨터구조] 컴퓨터의 기본 구조 - @ 낭람_ ](https://security-nanglam.tistory.com/201)
- [Difference Between Memory and Storage](https://backupeverything.co.uk/difference-between-memory-and-storage/)
- [Linux Daemon ( 1 / x )](https://weicomes.tistory.com/40)
- [리눅스 크론탭(Linux Crontab) 사용법](https://jdm.kr/blog/2)
- [30 Handy Bash Shell Aliases For Linux / Unix / MacOS](https://www.cyberciti.biz/tips/bash-aliases-mac-centos-linux-unix.html)