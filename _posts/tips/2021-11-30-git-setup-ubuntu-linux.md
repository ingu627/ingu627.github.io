---
layout: single
title: "Ubuntu·Windows10: Git 설치 & 기본 설정 (user.name·SSH 키)"
excerpt: "Ubuntu/WSL·Windows에서 Git 설치 후 전역 user/email, SSH 키/credential 캐시까지 초기 설정을 완료하는 실무 시작 가이드"
categories: tips
tag: [git, linux, ubuntu, 윈도우10, WSL2, 리눅스, 우분투, 윈도우, 우분투, 설치, 깃]

toc: true
toc_sticky: false

last_modified_at: 2022-03-20

sidebar_main: false
---

## Git이란? 

![image](https://user-images.githubusercontent.com/78655692/144004525-dd21b094-3c73-405f-9392-389a25ac7105.png)

- **깃(Git)**은 컴퓨터 파일의 변경사항을 추적하고 여러 명의 사용자들 간에 해당 파일들의 작업을 조율하기 위한 분산 버전 관리 시스템이다. 또는 이러한 명령어를 가리킨다.

<br>
<br>

## Ubuntu (linux)에서 설치하기

- 윈도우10에서 리눅스 설치는 [https://ingu627.github.io/linux/install_ubuntu/](https://ingu627.github.io/linux/install_ubuntu/) 이 링크로 가면 된다.

<br>
<br>

### 1. sudo apt-get install git

- `sudo apt-get install git`를 입력하여 패키지 리스트를 업데이트해준다.

![image](https://user-images.githubusercontent.com/78655692/144005380-51876bc0-51cd-4849-aca3-d97445c11441.png)

<br>
<br>

### 2. sudo apt install git

- `sudo apt install git`를 입력하여 git를 설치한다.

![image](https://user-images.githubusercontent.com/78655692/144005551-83b1ecd0-db34-40db-a69b-18f51f38ead3.png)

- `git --version`을 입력하여 설치가 잘 되었는지 확인한다.

![image](https://user-images.githubusercontent.com/78655692/144006203-202dfdfd-4a00-4c5f-8a61-79b20c3827be.png)

<br>
<br>

### 3. 사용자 정보 입력

- `git config --global user.name 사용자 계정 이름`
- `git config --global user.mail 사용자 계정 이메일`

![image](https://user-images.githubusercontent.com/78655692/144006426-e00e7701-3227-4b43-bd1c-74af6f05ee2d.png)

- `git config --global color.ui "auto"` 를 입력하면 깃 출력물의 컬러를 지정해준다.

<br>
<br>

### 4. git 사용법

- 여기까지면 설치와 설정까지 다 맞춘 거다.
- [https://ingu627.github.io/categories/git](https://ingu627.github.io/categories/git) 여기에서 확인바란다.

<br>
<br>

## Windows에서 Git 설치하기

### 1. git 사이트

- [https://git-scm.com/](https://git-scm.com/)

![image](https://user-images.githubusercontent.com/78655692/144007190-9da75d3e-8526-45c8-a984-181b769e2b0c.png)

<br>
<br>

### 2. 기본사항대로 쭉 클릭한다.

- 끝!

<br>
<br>

## References 

- [나무위키 - git](https://namu.wiki/w/Git)
- [위키백과 - git](https://ko.wikipedia.org/wiki/%EA%B9%83_(%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4))
- [[Linux] 우분투 Git 설치 / 다운로드 & 사용 방법](https://coding-factory.tistory.com/502?category=760718)
- [[Ubuntu] Ubuntu에 Git 설치하고 사용하기](https://ppost.tistory.com/entry/Ubuntu-Ubuntu%EC%97%90-Git-%EC%84%A4%EC%B9%98%ED%95%98%EA%B3%A0-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)