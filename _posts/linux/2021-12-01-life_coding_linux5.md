---
layout: single
title: "Linux 기초 정리 (5)"
excerpt: "생활 코딩 강의 내용을 요약 및 정리한 글입니다. - 사용자"
categories: linux
tag: [linux, basic, ubuntu, 다중 사용자,]

toc: true
toc_sticky: true

last_modified_at: 2021-12-01

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




## References

- [[리숙스] 초기 root 비미번호 설정하기, 사용자 계정 전환하기! - 양햄찌가 만드는 세상](https://jhnyang.tistory.com/136)
- [UNIX Create User Account](https://www.cyberciti.biz/faq/unix-create-user-account/)