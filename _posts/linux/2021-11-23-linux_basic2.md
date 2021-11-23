---
layout: single
title: "Linux 기초 정리 (2)"
excerpt: "생활 코딩 강의 내용을 요약 및 정리한 글입니다."
categories: linux
date: 2021-11-23
tag: [linux, basic, cloud9]

toc: true
toc_sticky: true

last_modified_at: 2021-11-23

sidebar_main: true
---

본 글은 "생활 코딩 - Linux" 강의 내용을 요약 및 정리한 글입니다. <br> 개인공부 목적이므로 자세한 사항은 [생활코딩 - Linux](https://www.inflearn.com/course/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-%EB%A6%AC%EB%88%85%EC%8A%A4-%EA%B0%95%EC%A2%8C#curriculum)로 참고하시길 바랍니다.
{: .notice--info}

## IO Redirection

![image](https://user-images.githubusercontent.com/78655692/143034784-7a084841-cba7-479c-8661-585952a3f6e1.png)

### output 

- IO Redirection (입력(input), 출력(output), 방향을 바꾼다(=파일을 저장한다))
- 보통은 화면으로 출력되는 것이 기본. 그 출력되는 방향을 다른 곳으로 돌려(Redirection)하여 파일에 저장시킬 수 있다는 뜻이다.
- 유닉스의 계열의 시스템은 어떤 프로그램이 실행(프로세스)될 때 그 프로세서가 출력하는 결과는 크게 두 가지로 구분된다.
  - 1. 표준 출력(Standard Output)
  - 2. 표준 에러 출력(Standard Error)

- `ls -l > result.txt` : ls -l 결과값을 화면에 출력되는 대신 result.txt로 출력되어 파일로 저장
- `>` : 보통 숫자 1이 생략되어 있는데 이를 표준출력이라고 함
- `2>` : 오류가 난 결과를 파일에 저장하고 싶을 때 사용

### input 

- `<` : standard input
- `프로그램` : 컴퓨터의 하드디스크나 ssd에 저장되어 있는 코드
- `프로세스` : 그 프로그램이 실행되면, 실행되고 있는 상태
  - `프로세스`에는 stand output과 standard error라고 하는 두 가지의 출력의 형식을 가진다. 그리고 한 가지의 입력, standard input이 들어가 있다. 즉, 하나의 input과 2개의 output이 존재한다.
- `cat result.txt` : result.txt 읽기 (파일에 저장되어있는 내용을 입력으로 받아 화면에 결과가 출력된다.)
- `cat`은 키보드의 입력을 받아 화면에 출력
  - `cat` 명령을 그냥 실행시키면 프로그램이 끝나지 않고 대기 상태에 있게 되고 사용자가 입력한 정보를 standard input으로 받아 standard output으로 출력해준다.
- `head` : 앞쪽에 있는 일부의 텍스트만을 화면에 출력하는 기능
  - `헤드(head)`는 기본 열줄만 출력을 하는데 옵션으로 마이너스 (-n1) 하면 한 줄만 출력을 해준다.
- `head -n1 < one.txt > two.txt`이 코드에는 표준 입력에 대한 리다이렉션과 표준 입력에 대한 리다이렉션이 모두 포함되어 있다. 먼저 'one.txt'에 있는 내용이 리다이렉션 돼서
헤드(head) 프로세스에 입력되고 그 처리 결과를 'two.txt'에다가 출력을 한다.

### append 

- `>>` : redirection한 결과를 추가, 즉 뒤에다가 덧붙이는 뜻
- `<<` : 여기에 방향이 바뀌면 입력이란 뜻인데 여러 개의 입력을 하나로 합친다.

## 쉘과 쉘스크립트

![image](https://user-images.githubusercontent.com/78655692/143039373-251eab2f-ebe1-46d7-9890-c24f1fad54dc.png)

- `하드웨어` : 컴퓨터의 기계적인 부분들
- `kernel` : 물리적인 기계를 직접적으로 제어하는 그 운영체제에서 가장 중심이 되는 그 코어이다. (핵심, 알갱이, 코어)
- `shell` : 사용자가 입력한 명령을 해석하는 프로그램 (껍데기, 주변)
  - 사용자로 리눅스에서 우리가 입력한 명령이 Shell(셸)을 대상으로 해서 명령을 입력해 준다. 
  - 이후 Shell(셸)은 입력한 그 명령을 해석해서 Kernel(커널)이 이해 할 수 있는 방식으로Kernel(커널)에게 전달해준다.
  - 그러면 Kernel(커널)이라고 하는 프로그램은 하드웨어를 제어해서 어떠한 처리를 수행할수 있도록 명령한다.
  - 하드웨어가 동작하여 그 처리결과를 Kernel(커널)에게 알려주면 Kernel(커널)이 다시 Shell(셸)에게 알려주는걸 통해서 우리가 입력하여 실행된 결과를 확인해볼수가 있다.

### bash vs zsh

- `sudo apt-get install zsh` : zsh 설치

![image](https://user-images.githubusercontent.com/78655692/143040003-0eebe7b2-dc0b-4a56-b601-aa6a49bb6011.png)

- `echo` : 뒤에 들어온 문자를 화면에 출력하는 명령어
- `echo $0` : bash가 뜬다면 이는 shell 이라는 카테고리에 속하는 구체적인 제품 중에 하나인 bash라고 하는 프로그램을 쓰고 있음을 의미.

### Shell Script 

- 여러 개의 명령을 순차적으로 실행하는 걸 통해서 업무가 이루어지는 경우가 많다.
- 그 명령의 스크립트를 어딘가에다가 적어놓고 나중에 재사용할 수 있다면 효율적이다.
- **쉡 스크립트** : 셸에서 실행되는 스크립트 어떤 셸 명령어들이 실행되어야 될 순서를, 실행되어야 될 방법을 각본을 짜서 저장해 놓은 파일

![image](https://user-images.githubusercontent.com/78655692/143042211-c8e955db-663f-48a4-9f98-a11f90cf9b08.png)

![image](https://user-images.githubusercontent.com/78655692/143043518-5b595df9-789b-4358-a332-e62a6bfc09f4.png)

- `nano backup`을 누른 뒤 편집기 실행
- `#!/bin/bash` : 프로그램을 실행 시켰을 때 운영 체제는 이 첫 번째 줄에 있는 #! 기호를 보고 그 뒤에 적혀 있는 /bin/bash를 보고 bin 밑에 있는 bash 라고 하는 프로그램을 통해서 해석되어야 한다.
- `if [ -d bak ]` : 현재 디렉토리가 bak가 존재하는가?
- `if ! [ -d bak ]; then` : 현재 디렉토리에 bak가 존재하지 않는다면
- `fi` : 조건문 종료
- `cp *.log bak` : .log 모든 파일을 bak에 복사한다.
- 그 후 `ctrl + x`를 누르고 엔터를 누르면 화면 밖으로 나와짐

![image](https://user-images.githubusercontent.com/78655692/143044428-82f4a49d-2e40-4617-9e07-15943d805d6e.png)

- `./backup` 하면 Permision  denined가 뜨는데 컴퓨터에게 backup이 실행가능하다고 알려줘야 함 
- `chmod +x backup` : backup 파일에 x, 실행 가능한 모드를 추가하여 바꾼다.