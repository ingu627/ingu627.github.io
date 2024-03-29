---
layout: single
title: "[생활코딩] Linux 기초 정리 (3) - permission부터 네트워크, 서버까지"
excerpt: "생활 코딩 강의 내용을 요약 및 정리한 글입니다. - 사용자, 권한, 그룹, 인터넷, 네트워크, 서버, SSH, 그룹"
categories: linux
tag: [linux, basic, ubuntu, 다중 사용자, 인터넷, 네트워크, 서버, 그룹, SSH]

toc: true
toc_sticky: true

last_modified_at: 2022-01-18

sidebar_main: false
---

<img align='right' width='200' height='200' src='https://user-images.githubusercontent.com/78655692/149885926-86d336ea-fe65-4bb1-96f8-c556918fbb5a.png
'>
본 글은 "생활 코딩 - Linux" 강의 내용을 요약 및 정리한 글입니다. <br> 리눅스의 기초를 잡기 위해 개인공부 목적으로 정리했으며, 자세한 사항은 [생활코딩 - Linux](https://www.inflearn.com/course/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-%EB%A6%AC%EB%88%85%EC%8A%A4-%EA%B0%95%EC%A2%8C#curriculum)로 참고하시길 바랍니다.
{: .notice--info}

<br>
<br>
<br>
<br>

## 사용자

<br>

### 다중사용자

![image](https://user-images.githubusercontent.com/78655692/144179402-e9622ed6-48b1-416c-a9d9-c4cd4d5a33dc.png)

- `id` : identify의 줄임말
  - `uid` : user의 id
  - `gid` : group의 id
- `who` : 누가 접속했는지 알려줌

<br>
<br>

### 관리자와 일반 관리자

![image](https://user-images.githubusercontent.com/78655692/144180042-9163a4a0-8a06-4685-9822-4579b50b813a.png)

- `sudo` : substitute user do의 약자로 다른 사용자의 권한으로 명령을 이행하라의 뜻
- super(root) user VS user의 차이점
- 슈퍼유저는 root란 이름이 나온다.
- `$`는 일반 유저를 뜻한다.
- `#`는 슈퍼 유저를 뜻한다.
- `su` : change user ID or become superuser
- `su [options] [username]`
- `su - root` : 슈퍼 유저로 변환
  - **우분투에서는 root를 잠가놨다**
  - `sudo passwd -u root`로 lock을 풀어준다. (u = unlock)
  - `-u` 는 unlock을 뜻함
  - 초기 비밀번호 설정은 `sudo passwd`를 입력하면 됨

![image](https://user-images.githubusercontent.com/78655692/144181098-21b32489-325c-46f4-b373-3d0a13e2cc01.png)

- `sudo passwd -l root`를 하면 root를 다시 lock 건다는 의미 (l = lock)

![image](https://user-images.githubusercontent.com/78655692/144181369-744e7b02-f2f1-48e6-985f-a675fc77623e.png)

- `~` : 현재 사용자의 홈 디렉토리

<br>
<br>

### 사용자의 추가

- `sudo useradd -m [사용자]` : 사용자 생성

![image](https://user-images.githubusercontent.com/78655692/144181880-499ea1c8-2b27-4d58-85d2-969ce0403795.png)

- `su - duru`하면 안 들어가진다. 처음에 비밀번호를 생성해 줘야 한다.

![image](https://user-images.githubusercontent.com/78655692/144182135-88249522-5bff-4ffb-9bb6-72b69e312ee9.png)

- 이제 이 duru 사용자도 sudo 권한을 주려고 한다.
- `exit` : 빠져나오기
- `sudo usermod -a -G sudo duru` : duru에게 sudo 권한 주기

<br>
<br>

## 권한 (permission)

- `권한을 지정하다` : 사용자가 파일과 디렉토리에 대해서 어떤 일을 할 수 있게 하거나 할 수 없게 하는 것
  - Read & Write & Excute 에 대해 
- `echo` : 뒤에 오는 문자를 표준 출력해줌. 화면에 print 한다.

![image](https://user-images.githubusercontent.com/78655692/144243244-991be862-b7e2-4836-b89d-763d5a2add2d.png)

- `echo 'hi' > perm.txt` : hi라는 명령어를 redirection해서 perm.txt에 추가하여 저장한다.

![image](https://user-images.githubusercontent.com/78655692/144245148-de4c32ba-87ca-45b9-8e8e-ac19f0c226a9.png)

![KakaoTalk_20211202_113101541](https://user-images.githubusercontent.com/78655692/144346828-4f4fd9d2-8ee6-4481-8b89-8014bc8819cf.jpg)

- 파일 유형 종류
  - `d` : 디렉토리
  - `-` : 파일
  - `l` : 링크 파일
  - `b` : 블록파일
- 권한
  - `r` : 읽기
  - `w` : 쓰기
  - `x` : 실행

<br>
<br>

### chmod

- change mode의 줄임말
- `chmod [options] [mode] [file_name]`


|레퍼런스|	클래스|	설명|
|---|---|---|
|u|	사용자|	파일의 소유자|
|g|	그룹|	그 파일의 그룹 멤버인 사용자|
|o|	다른 사람들|	그 파일의 소유자나 혹은 그 그룹의 멤버가 아닌 사용자|
|a|	모든 사람|	위의 셋 모두, "ugo"와 같다|


|연산자|	설명|
|---|---|
|+|	지정된 모드들은 지정된 클래스들에 더한다|
|-|	지정된 클래스들로부터 지정된 모드들은 지운다|
|=|	지정된 클래스들을 위해서 지정된 모드들이 정확한 모드들로 만들어지게 된다|


|모드|	이름|	설명|
|---|---|---|
|r|	읽기 (read)|	파일을 읽거나 디렉터리 안 내용물의 리스트를 보여준다|
|w|	쓰기 (write)|	파일이나 디렉터리에 쓴다|
|x|	실행하기 (excute)|	파일을 실행하거나 디렉터리 트리로 되돌아간다|


|#|	Sum	|rwx|	Permission|
|---|---|---|---|
|7|	4(r) + 2(w) + 1(x)|	rwx|	read, write and execute|
|6|	4(r) + 2(w)|	rw-	|read and write|
|5|	4(r)        + 1(x)|	r-x|	read and execute|
|4|	4(r)	|r--|	read only|
|3|	       2(w) + 1(x)|	-wx|	write and execute|
|2|	       2(w)	|-w-|	write only|
|1|	              1(x)|	--x|	execute only|
|0|	0|	---|	none|

<br>
<br>

![image](https://user-images.githubusercontent.com/78655692/144347253-e2a259e3-c27c-479d-8122-c54dfc016f3e.png)

- `chmod o-r perm.txt` : others의 read 권한을 빼주겠다.(-)

![image](https://user-images.githubusercontent.com/78655692/144347493-5ddfd2b4-9d49-4a99-9a18-ecb173a38929.png)

- `chmod o+w perm.txt` : others의 write 권한을 주겠다.(+)

![image](https://user-images.githubusercontent.com/78655692/144347641-188c211f-9280-4d11-b240-7a406220c299.png)

- `chmod u-r perm.txt` : user의 read 권한을 빼겠다.(-)

![image](https://user-images.githubusercontent.com/78655692/144356063-9c6f113a-99b5-416b-989c-6eceff76478a.png)

- `chmod a=rwx perm.txt`를 하면 모든 권한자에게 rwx를 부여한다.

<br>
<br>

### excute

![image](https://user-images.githubusercontent.com/78655692/144353232-8f62493d-bf60-40cb-96b7-11e19b45ef30.png)

![image](https://user-images.githubusercontent.com/78655692/144353574-f0eb952c-8cce-4cd5-9129-95e9dd3ccad2.png)

![image](https://user-images.githubusercontent.com/78655692/144353679-d3fa8c9b-509f-423d-bfd9-b51383a9de40.png)

- `chmod u+x hi-machine.sh` : user에게 실행 권한(x)를 준다.
- `#!/bin/bash` 이 코드가 있다면 운영체제는 `./hi-machine.sh`를 실행시켰을 때 제일 먼저 `hi.achine.sh`이 현재 사용자에게 실행가능한지 본다.
- others에게도 실행 권한을 주기 위해선 `chmod o+x hi-machine.sh`를 한다.

<br>
<br>

## 그룹 (group)

- group : 파일과 디렉토리를 여러 사용자들이 공동으로 관리할 수 있는 방법

![KakaoTalk_20211202_132405230](https://user-images.githubusercontent.com/78655692/144357487-30227af2-13af-42f2-988b-30704af3cb57.jpg)

<br>
<br>

## 인터넷

- request한 나의 컴퓨터가 client이고, request를 받아서 response 해주는 컴퓨터가 server이다.
  - cleint는 server에게 요청을 한다. server는 client에게 응답한다.
- `DNS`는 이 세상의 모든 domain이 각각 어떤 ip인지 아는 거대한 서버이다.
- `ip addr`를 치면 현재 자신의 ip를 알려준다. (이 컴퓨터의 실제 부여된 ip)

![image](https://user-images.githubusercontent.com/78655692/144783087-7692d136-4661-45f6-a7a6-922774a9d3b3.png)

- `curl ipinfo.io/ip`를 치면 ip를 알려준다. (온라인 입장에서 결과적인 ip가 뭔지 알려준다.)

<br>
<br>

### apache

- client로 사용하기 위해서는 web browser가 있어야한다.
- 주소란에 google.com/index.html 을 입력하면
google.com에 request를 보낸다. 이때 웹 서버는 요청이 들어오면 요청을 분석한다.
  - 웹 브라우저에 해당하는 제품 : firefox, ie, chrome 등
  - 웹 서버에 속하는 제품 : Apache, nginx, IIS 등

- apache 설치
  - `sudo apt-get update`
  - `sudo apt-get apache2`
- `sudo service apache2 start`를 통해 웹 서버를 켜 준다.

<br>

- `elinks`는 쉘에서 웹브라우징을 할 수 있게 도와주는 프로그램
  - elinks 설치 : `sudo apt-get install elinks`
- unix 계열에서의 설정에 대한 것은 /etc에 저장되어 있다.
  - `cd /etc/apache2` 로 경로 변경 (여기에 아파치에 대한 설정 파일이 있다.)
- 그 중 apache2.conf를 확인하면 `IncludeOptional sites-enabled/\*.conf`가 있는데 `sites-enabled`라는 디렉토리 안의 모든 .conf 파일을 읽고 사용한다는 것이다.
- `/var/www/html` 을 사용하는 이유는 `/etc/apache2/sites-enabled/000-default.conf` 에 설정이 `/var/www/html`로 되어있기 때문이다.
  - 어떤 서버를 설치하건 /etc 밑에 설정 파일이 있고 <u>그 곳의 설정 파일을 바꾸면 동작하는 방식이 달라진다.</u>

- `/etc/apache2/sites-enabled/000-default.conf` 를 확인하면

```linux
ErrorLog ${APACHE\_LOG\_DIR}/error.log
CustomLog ${APACHE\_LOG\_DIR}/access.log combined
```

- `${APACHE\_LOG\_DIR}` 는 아파치 웹 서버가 동작할 때 로그를 확인하기 위해 특정 디렉토리 아래의 error.log 파일과 access.log 파일에 기록하겠다 라는 것이다.
`${APACHE\_LOG\_DIR}` 는 /var/log/apache2/ 이다.
해당 디렉토리를 보면 access.log와 error.log가 존재한다.
- 누군가 웹 서버에 접속할 때 마다 끝에 접속한 사람의 정보가 추가가 된다.
- 실시간으로 확인하기 위해서는 tail을 사용한다.
  - `tail -f /var/log/apache2/access.log` : 실시간으로 이 파일의 끝에 있는 정보가 나타난다.
- elinks를 통해 들어가면 위의 tail이 작동해 access 로그가 찍힌다.
curl 역시 마찬가지로 접속해도 새로운 access 로그가 찍힌다. (200)
- 없는 파일에 접속하면 접속은 확인이 되지만 상태(404)도 같이 나타난다.
이것이 로그를 찾는 것이다. 대부분의 서버 프로그램이 가지는 동작이다.
서버의 로그가 어디에 있을까에 대해 알아야한다.

<br>
<br>

## SSH

- 원격제어는 원격에 있는 컴퓨터를 내 앞에 있는 것처럼 다룰 수 있다.
- `sudo apt-get install openssh-server` : 다른 컴퓨터가 내 컴퓨터에 접속할 때 사용
- `sudo aptget install openssh-client` : 다른 컴퓨터로 원격 접속 할 때 사용
- `ssh poeun@172.29.229.202` : 원격 접속할 시
- 다른 컴퓨터임에도 불구하고 원격으로 다른 컴퓨터에 접속할 수 있다.
이 컴퓨터로 명령을 내리면 ssh로 접속한 컴퓨터를 대상으로 실행되게 된다.

<br>
<br>
<br>
<br>

## References

- [생활코딩 - Linux](https://www.inflearn.com/course/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-%EB%A6%AC%EB%88%85%EC%8A%A4-%EA%B0%95%EC%A2%8C#curriculum)
- [[리숙스] 초기 root 비미번호 설정하기, 사용자 계정 전환하기! - 양햄찌가 만드는 세상](https://jhnyang.tistory.com/136)
- [UNIX Create User Account](https://www.cyberciti.biz/faq/unix-create-user-account/)
- [리눅스 권한과 소유권. 숫자모드와 문자모드 - 무한대로](https://sidepower.tistory.com/12)
- [Chmod -위키백과](https://ko.wikipedia.org/wiki/Chmod)
- [생활코딩 linux 정리 - ddengkun](https://velog.io/@ddengkun/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-linux-%EC%A0%95%EB%A6%AC)