---
layout: single
title: "[생활코딩] Linux 기초 정리 (1) - 문법부터 Shell까지"
excerpt: "생활 코딩 강의 내용을 요약 및 정리한 글입니다. - 기초문법, IO Redirection, shell, shell script"
categories: linux 
tag: [linux, basic, cloud9, 문법, 쉘, 쉘 스크립트]

toc: true
toc_sticky: true

last_modified_at: 2022-01-18

sidebar_main: true
---

<img align='right' width='200' height='200' src='https://user-images.githubusercontent.com/78655692/149885926-86d336ea-fe65-4bb1-96f8-c556918fbb5a.png
'>
본 글은 "생활 코딩 - Linux" 강의 내용을 요약 및 정리한 글입니다. <br> 리눅스의 기초를 잡기 위해 개인공부 목적으로 정리했으며, 자세한 사항은 [생활코딩 - Linux](https://www.inflearn.com/course/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-%EB%A6%AC%EB%88%85%EC%8A%A4-%EA%B0%95%EC%A2%8C#curriculum)로 참고하시길 바랍니다.
{: .notice--info}

<br>
<br>
<br>
<br>

## 리눅스 기초 

<br>

### ls

- 현재 디렉토리의 파일 목록을 출력하는 명령어
- `ls -l` : 현재 디렉토리의 파일을 자세히 보여주는 명령어 (l : list)
- `ls -a` : 현재 디렉토리에 있는 파일 + 숨긴 파일(`.파일명`) 다 보여줌
- `ls -al` : -a와 -l 합친 함수

<br>
<br>

### pwd 

- 현재 위치하고 있는 디렉토리를 알려주는 명령어
  - `directory` : 파일을 잘 정리정돈위한 수납 공간

<br>
<br>

### mkdir

- `mkdir 새로 생성할 디렉토리명`
- (make directory)
- `-` : 파라미터 (동작하는 방법을 바꾼다) (축약형)
- `--` : 파라미터 (풀네임)
- `-p` : 필요하면 부모 디렉토리를 생성한다. (`--parents`)
  - 예시 : `mkdir -p dir1/dir2/dir3`

![image](https://user-images.githubusercontent.com/78655692/142976212-add56922-2b1d-44e5-aff8-9f9d8d9eccb1.png)

<br>
<br>

### touch

- `tocuh 새로 생성할 파일`

<br>
<br>

### cd

- `cd 이동할 디렉토리의 경로명` (cd : change directory)
- `상대경로` : 현재 디렉토리의 위치를 기준으로 다른 디렉토리의 위치를 표현하는 것
- `..` : 부모 디렉토리를 의미
  - `cd ..` : 현재 디렉토리의 부모 디렉토리로 이동하는 명령이 된다.
- `.` : 현재 디렉토리를 의미
- `절대경로` : 최상위 디렉토리를 기준으로 경로를 표현하는 것을 의미
- `최상위 디렉토리` : 루트(root) 디렉토리라고 하고 `/`이다.
  - `cd /`는 최상위 디렉토리로 이동한다는 의미

<br>
<br>

### rm

- `rm 파일명`
- 파일 제거 (remove)
- - `rm -r 디렉토리명` : 재귀적 디렉토리 제거 (재귀적 : 그 안쪽에서부터 순차적으로)

<br>
<br>

### --help

- 명령어 뒤에 --help를 붙이면 명령의 사용설명서가 출력
- 예시 `ls --help`
- 간단한 매뉴얼

<br>
<br>

### man 

- help보다 자세한 사용설명서
- 예시 `man ls`
- `/sort`라 치면 sort를 찾아준다. 
- `q`를 나가면 화면 밖으로 빠져나감

<br>
<br>

### cp 

- `cp 원본파일 복사할 디렉토리` : 원본파일을 해당 디렉토리로 복사한다. (cp : copy)

<br>
<br>

### mv

- `mv 파일명 이동할 디렉토리` : 원본파일을 해당 디렉토리로 이동 (mv : move)
- 예시 `mv mv.txt dir1/mv.txt`
- 파일명 바꾸고 싶을 때도 mv 사용
  - 예시 `mv rename.txt rename2.txt`

<br>
<br>

### sudo 

- sudo = super user do의 약자 (슈퍼 유저가 하는 일) **권한**
- 리눅스는 다중 컴퓨터가 특징 (하나의 운영체제를 여러 사람이 썼음) -> 권한 부여를 나눔
- `super user` 또는 `root user`

![image](https://user-images.githubusercontent.com/78655692/142977414-1280c4e0-91b3-46f2-b80d-0d306f7b416b.png)

<br>
<br>

### nano 

- `파일` : 정보를 저장하는 가장 기본적인 어떤 수단, 저장소이다.
- `nano` : 파일 편집기

![image](https://user-images.githubusercontent.com/78655692/142979879-ec660bd2-061a-402c-9c6f-9d0f6eae08d7.png)

- `^` = ctrl
- `^O` : write out (저장하고 나가기)

|단축키|동작|
|---|---|
|`ctrl+g (F1)`|	도움말 표시	|
|`ctrl+x (F2)`|	nano 종료 (혹은 현재의 file buffer를 닫음)	|
|`ctrl+o (F3)`|	현재 편집 중인 파일 저장	|
|`ctrl+j (F4)`|	문단을 justify(행의 끝을 나란히 맞추다)한다. 즉, 한 문단을 한 줄로 붙인다.	|
|`ctrl+r (F5)`|	현재 file에 다른 file의 내용을 추가한다.	|
|`ctrl+w (F6)`|	text 검색	|
|`ctrl+c (F11)`|	현재의 cursor 위치 표시하기	|
|`ctrl+t (F12)`|	spell check 시작|	
|`ctrl+\`|search and replace	|
|`ctrl+k (F9)`|	현재의 line 혹은 선택된 text 삭제(그리고 저장(copy))	|
|`ctrl+u (F10)`|	붙여넣기 (paste)	|
|`ctrl+6`|현재 cursor 위치부터 text 선택 시작. 이후 alt+6로 복사 후 선택 종료. 아니면 다시 ctrl+6를 입력하면 (복사 없이)단순 종료.	|
|`alt+6	`|선택 구간 복사. 선택 구간이 없다면 현재 caret 이 있는 한 줄을 복사. 이후 ctrl+u 로 붙여넣기 할 수 있음	|
|`PageUP	또는 ctrl+y (F7) `|이전 화면	|
|`PageDown	또는 ctrl+v (F8)`| 다음 화면	|
|`alt+(	`|현재 문단의 시작으로|	
|`alt+)	`|현재 문단의 끝으로	|
|`alt+=	`|한 줄 밑으로 스크롤|	
|`alt+-	`|한 줄 위로 스크롤	|
|`ctrl+space`|한 단어 앞으로	|
|`alt+space`|한 단어 뒤로 (GUI모드가 아닐 경우)	|
|`alt+\	`|file의 첫 line으로	|
|`alt+/	`|file의 마지막 line으로	|
|`alt+]	`|현재 괄호에 match되는 괄호 찾기	|
|`ctrl+-`|줄 번호와 열을 입력한 후 그곳으로 이동|

<br>
<br>

### Package manager

- `패키지` : 우리가 흔히 알고 있는 프로그램 또는 애플리케이션 또는 앱을 의미
- `apt` or `yum`이 있다.
- `sudo apt-get update;` 을 하면 apt 패키지에 접속해서 최신 목록을 다운 받는다

![image](https://user-images.githubusercontent.com/78655692/142982186-84ae9dcf-91d4-4bf8-8460-c803c187749d.png)

- `sudo apt-cache search htop` : htop과 관련된 목록을 보여준다. 
  - `top` : 작업관리자와 비슷한 개념 
  - `q`를 누르면 화면에서 빠져나간다.

![image](https://user-images.githubusercontent.com/78655692/142982254-5a26a1cf-cb9f-4012-a30f-1cafe512bd70.png)

- `clear` : 화면을 깨끗하게 지움
- `sudo apt-get install htop` : htop 설치

- `htop` 실행 (또는 `sudo htop`)

![image](https://user-images.githubusercontent.com/78655692/142982513-8dd236d0-6729-47cb-b928-34d910d649e4.png)

- `sudo apt-get upgrade htop` : htop 업그레이드 실행
- `sudo apt-get remove htop` : htop 제거

<br>
<br>

### wget 

- 파일을 다운로드받는 방법 (url을 통해서)

![image](https://user-images.githubusercontent.com/78655692/142983238-ee773aef-9c7b-41e8-b8dc-c3008849d917.png)

- `wget -O [바꿀이미지명] [이미지링크 주소]` 

![image](https://user-images.githubusercontent.com/78655692/142983505-5ae35d6a-1df0-44ce-a29e-08fcb59aa189.png)

<br>
<br>

## IO Redirection

![image](https://user-images.githubusercontent.com/78655692/143034784-7a084841-cba7-479c-8661-585952a3f6e1.png)

<br>
<br>

### output 

- IO Redirection (입력(input), 출력(output), 방향을 바꾼다(=파일을 저장한다))
- 보통은 화면으로 출력되는 것이 기본. 그 출력되는 방향을 다른 곳으로 돌려(Redirection)하여 파일에 저장시킬 수 있다는 뜻이다.
- 유닉스의 계열의 시스템은 어떤 프로그램이 실행(프로세스)될 때 그 프로세서가 출력하는 결과는 크게 두 가지로 구분된다.
  - 1. 표준 출력(Standard Output)
  - 2. 표준 에러 출력(Standard Error)

- `ls -l > result.txt` : ls -l 결과값을 화면에 출력되는 대신 result.txt로 출력되어 파일로 저장
- `>` : 보통 숫자 1이 생략되어 있는데 이를 표준출력이라고 함
- `2>` : 오류가 난 결과를 파일에 저장하고 싶을 때 사용

<br>
<br>

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

<br>
<br>

### append 

- `>>` : redirection한 결과를 추가, 즉 뒤에다가 덧붙이는 뜻
- `<<` : 여기에 방향이 바뀌면 입력이란 뜻인데 여러 개의 입력을 하나로 합친다.

<br>
<br>

## 쉘과 쉘스크립트

![image](https://user-images.githubusercontent.com/78655692/143039373-251eab2f-ebe1-46d7-9890-c24f1fad54dc.png)

- `하드웨어` : 컴퓨터의 기계적인 부분들
- `kernel` : 물리적인 기계를 직접적으로 제어하는 그 운영체제에서 가장 중심이 되는 그 코어이다. (핵심, 알갱이, 코어)
- `shell` : 사용자가 입력한 명령을 해석하는 프로그램 (껍데기, 주변)
  - 사용자로 리눅스에서 우리가 입력한 명령이 Shell(셸)을 대상으로 해서 명령을 입력해 준다. 
  - 이후 Shell(셸)은 입력한 그 명령을 해석해서 Kernel(커널)이 이해 할 수 있는 방식으로Kernel(커널)에게 전달해준다.
  - 그러면 Kernel(커널)이라고 하는 프로그램은 하드웨어를 제어해서 어떠한 처리를 수행할수 있도록 명령한다.
  - 하드웨어가 동작하여 그 처리결과를 Kernel(커널)에게 알려주면 Kernel(커널)이 다시 Shell(셸)에게 알려주는걸 통해서 우리가 입력하여 실행된 결과를 확인해볼수가 있다.

<br>
<br>

### bash vs zsh

- `sudo apt-get install zsh` : zsh 설치

![image](https://user-images.githubusercontent.com/78655692/143040003-0eebe7b2-dc0b-4a56-b601-aa6a49bb6011.png)

- `echo` : 뒤에 들어온 문자를 화면에 출력하는 명령어
- `echo $0` : bash가 뜬다면 이는 shell 이라는 카테고리에 속하는 구체적인 제품 중에 하나인 bash라고 하는 프로그램을 쓰고 있음을 의미.
- `zsh`는 탭(tab)을 누르면 실행이 된다.
- `pwd`를 누르면 현재 경로를 보여 주는데 zsh에서는 경로의 앞글자만 쓰고 tab를 누르면 자동완성 시켜준다.

<br>
<br>

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

<br>
<br>
<br>
<br>

## References 

- [생활코딩 - Linux](https://www.inflearn.com/course/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-%EB%A6%AC%EB%88%85%EC%8A%A4-%EA%B0%95%EC%A2%8C#curriculum)
- [nano에디터 소개 및 사용법](https://junistory.blogspot.com/2017/08/nano.html)