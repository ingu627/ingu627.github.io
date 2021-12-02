---
layout: single
title: "Linux 기초 정리 (5) - user, permission, group"
excerpt: "생활 코딩 강의 내용을 요약 및 정리한 글입니다. - 사용자, 권한, 그룹"
categories: linux
tag: [linux, basic, ubuntu, 다중 사용자,]

toc: true
toc_sticky: true

last_modified_at: 2021-12-02

sidebar_main: true
---

본 글은 "생활 코딩 - Linux" 강의 내용을 요약 및 정리한 글입니다. <br> 개인공부 목적이므로 자세한 사항은 [생활코딩 - Linux](https://www.inflearn.com/course/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-%EB%A6%AC%EB%88%85%EC%8A%A4-%EA%B0%95%EC%A2%8C#curriculum)로 참고하시길 바랍니다.
{: .notice--info}

## 사용자

### 다중사용자

![image](https://user-images.githubusercontent.com/78655692/144179402-e9622ed6-48b1-416c-a9d9-c4cd4d5a33dc.png)

- `id` : identify의 줄임말
  - `uid` : user의 id
  - `gid` : group의 id
- `who` : 누가 접속했는지 알려줌

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

### excute

![image](https://user-images.githubusercontent.com/78655692/144353232-8f62493d-bf60-40cb-96b7-11e19b45ef30.png)

![image](https://user-images.githubusercontent.com/78655692/144353574-f0eb952c-8cce-4cd5-9129-95e9dd3ccad2.png)

![image](https://user-images.githubusercontent.com/78655692/144353679-d3fa8c9b-509f-423d-bfd9-b51383a9de40.png)

- `chmod u+x hi-machine.sh` : user에게 실행 권한(x)를 준다.
- `#!/bin/bash` 이 코드가 있다면 운영체제는 `./hi-machine.sh`를 실행시켰을 때 제일 먼저 `hi.achine.sh`이 현재 사용자에게 실행가능한지 본다.
- others에게도 실행 권한을 주기 위해선 `chmod o+x hi-machine.sh`를 한다.

<br>

## 그룹 (group)

- group : 파일과 디렉토리를 여러 사용자들이 공동으로 관리할 수 있는 방법

![KakaoTalk_20211202_132405230](https://user-images.githubusercontent.com/78655692/144357487-30227af2-13af-42f2-988b-30704af3cb57.jpg)


<br>
<br>

## References

- [[리숙스] 초기 root 비미번호 설정하기, 사용자 계정 전환하기! - 양햄찌가 만드는 세상](https://jhnyang.tistory.com/136)
- [UNIX Create User Account](https://www.cyberciti.biz/faq/unix-create-user-account/)
- [리눅스 권한과 소유권. 숫자모드와 문자모드 - 무한대로](https://sidepower.tistory.com/12)
- [Chmod -위키백과](https://ko.wikipedia.org/wiki/Chmod)