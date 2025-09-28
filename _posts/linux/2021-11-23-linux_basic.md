---
layout: single
title: "Linux 기초: 셸·디렉터리·프로세스·네트워크 핵심 명령"
excerpt: "생활 코딩 강의 내용을 요약 및 정리한 글입니다. - 기초문법, IO Redirection, shell, shell script"
categories: linux 
tags: [linux, cloud9, 문법, 쉘, 쉘스크립트, bash, zsh, 네트워크, 서버, daemon, cron, 사용자, 권한, 프로세스]

toc: true
toc_sticky: true

date: 2021-11-23
last_modified_at: 2025-09-20

sidebar_main: false
---

<img align='right' width='200' height='200' src='https://user-images.githubusercontent.com/78655692/149885926-86d336ea-fe65-4bb1-96f8-c556918fbb5a.png' alt='Linux 로고'>

본 글은 "생활 코딩 - Linux" 강의 내용을 요약 및 정리한 글입니다. <br> 리눅스의 기초를 잡기 위해 개인공부 목적으로 정리했으며, 자세한 사항은 [생활코딩 - Linux](https://www.inflearn.com/course/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-%EB%A6%AC%EB%88%85%EC%8A%A4-%EA%B0%95%EC%A2%8C#curriculum)로 참고하시길 바랍니다.
{: .notice--info}

<br>

## 리눅스 기초 

<br>

### ls

- 현재 디렉토리의 파일 목록을 출력하는 명령어
- `ls -l` : 현재 디렉토리의 파일을 자세히 보여주는 명령어 (l : list)
- `ls -a` : 현재 디렉토리에 있는 파일 + 숨김 파일(`.파일명`) 다 보여줌
- `ls -al` : -a와 -l 합친 함수

<br>

### pwd 

- 현재 위치하고 있는 디렉토리를 알려주는 명령어
  - `directory` : 파일을 잘 정리정돈하기 위한 수납 공간

<br>

### mkdir

- `mkdir 새로생성할디렉토리명`
- (make directory)
- `-` : 파라미터 (동작하는 방법을 바꾼다) (축약형)
- `--` : 파라미터 (풀네임)
- `-p` : 필요하면 부모 디렉토리를 생성한다. (`--parents`)
  - 예시 : `mkdir -p dir1/dir2/dir3`

![image](https://user-images.githubusercontent.com/78655692/142976212-add56922-2b1d-44e5-aff8-9f9d8d9eccb1.png)

<br>

### touch

- `touch 새로생성할파일`

<br>

### cd

- `cd 이동할디렉토리의경로명` (cd : change directory)
- `상대경로` : 현재 디렉토리의 위치를 기준으로 다른 디렉토리의 위치를 표현하는 것
- `..` : 부모 디렉토리를 의미
  - `cd ..` : 현재 디렉토리의 부모 디렉토리로 이동하는 명령이 된다.
- `.` : 현재 디렉토리를 의미
- `절대경로` : 최상위 디렉토리를 기준으로 경로를 표현하는 것을 의미
- `최상위 디렉토리` : 루트(root) 디렉토리라고 하고 `/`이다.
  - `cd /`는 최상위 디렉토리로 이동한다는 의미

<br>

### rm

- `rm 파일명`
- 파일 제거 (remove)
- `rm -r 디렉토리명` : 재귀적 디렉토리 제거 (재귀적 : 그 안쪽에서부터 순차적으로)

<br>

### --help

- 명령어 뒤에 --help를 붙이면 명령의 사용설명서가 출력
- 예시 `ls --help`
- 간단한 매뉴얼

<br>

### man 

- help보다 자세한 사용설명서
- 예시 `man ls`
- `/sort`라 치면 sort를 찾아준다. 
- `q`를 누르면 화면 밖으로 빠져나감

<br>

### cp 

- `cp 원본파일 복사할디렉토리` : 원본파일을 해당 디렉토리로 복사한다. (cp : copy)

<br>

### mv

- `mv 파일명 이동할디렉토리` : 원본파일을 해당 디렉토리로 이동 (mv : move)
- 예시 `mv mv.txt dir1/mv.txt`
- 파일명 바꾸고 싶을 때도 mv 사용
  - 예시 `mv rename.txt rename2.txt`

<br>

### sudo 

- sudo = super user do의 약자 (슈퍼 유저가 하는 일) **권한**
- 리눅스는 다중 사용자 컴퓨터가 특징 (하나의 운영체제를 여러 사람이 썼음) -> 권한 부여를 나눔
- `super user` 또는 `root user`

![image](https://user-images.githubusercontent.com/78655692/142977414-1280c4e0-91b3-46f2-b80d-0d306f7b416b.png)

<br>

### nano 

- `파일` : 정보를 저장하는 가장 기본적인 어떤 수단, 저장소이다.
- `nano` : 파일 편집기

![image](https://user-images.githubusercontent.com/78655692/142979879-ec660bd2-061a-402c-9c6f-9d0f6eae08d7.png)

- `^` = Ctrl
- `^O` : write out (저장하고 나가기)

|단축키|동작|
|---|---|
|`Ctrl+G (F1)`|	도움말 표시	|
|`Ctrl+X (F2)`|	nano 종료 (혹은 현재의 file buffer를 닫음)	|
|`Ctrl+O (F3)`|	현재 편집 중인 파일 저장	|
|`Ctrl+J (F4)`|	문단을 justify(행의 끝을 나란히 맞추다)한다. 즉, 한 문단을 한 줄로 붙인다.	|
|`Ctrl+R (F5)`|	현재 file에 다른 file의 내용을 추가한다.	|
|`Ctrl+W (F6)`|	text 검색	|
|`Ctrl+C (F11)`|	현재의 cursor 위치 표시하기	|
|`Ctrl+T (F12)`|	spell check 시작|	
|`Ctrl+\`|search and replace	|
|`Ctrl+K (F9)`|	현재의 line 혹은 선택된 text 삭제(그리고 저장(copy))	|
|`Ctrl+U (F10)`|	붙여넣기 (paste)	|
|`Ctrl+6`|현재 cursor 위치부터 text 선택 시작. 이후 Alt+6로 복사 후 선택 종료. 아니면 다시 Ctrl+6를 입력하면 (복사 없이)단순 종료.	|
|`Alt+6`|선택 구간 복사. 선택 구간이 없다면 현재 caret이 있는 한 줄을 복사. 이후 Ctrl+U로 붙여넣기 할 수 있음	|
|`PageUp 또는 Ctrl+Y (F7)`|이전 화면	|
|`PageDown 또는 Ctrl+V (F8)`| 다음 화면	|
|`Alt+(`|현재 문단의 시작으로|	
|`Alt+)`|현재 문단의 끝으로	|
|`Alt+=`|한 줄 밑으로 스크롤|	
|`Alt+-`|한 줄 위로 스크롤	|
|`Ctrl+Space`|한 단어 앞으로	|
|`Alt+Space`|한 단어 뒤로 (GUI모드가 아닐 경우)	|
|`Alt+\`|file의 첫 line으로	|
|`Alt+/`|file의 마지막 line으로	|
|`Alt+]`|현재 괄호에 match되는 괄호 찾기	|
|`Ctrl+-`|줄 번호와 열을 입력한 후 그곳으로 이동|

<br>

### Package manager

- `패키지` : 우리가 흔히 알고 있는 프로그램 또는 애플리케이션 또는 앱을 의미
- `apt` 또는 `yum`이 있다.
- `sudo apt-get update;` 를 하면 apt 패키지에 접속해서 최신 목록을 다운 받는다

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

### wget 

- 파일을 다운로드받는 방법 (URL을 통해서)

![image](https://user-images.githubusercontent.com/78655692/142983238-ee773aef-9c7b-41e8-b8dc-c3008849d917.png)

- `wget -O [바꿀이미지명] [이미지링크주소]` 

![image](https://user-images.githubusercontent.com/78655692/142983505-5ae35d6a-1df0-44ce-a29e-08fcb59aa189.png)

<br>

## IO Redirection

![image](https://user-images.githubusercontent.com/78655692/143034784-7a084841-cba7-479c-8661-585952a3f6e1.png)

<br>

### output 

- IO Redirection (입력(input), 출력(output), 방향을 바꾼다(=파일을 저장한다))
- 보통은 화면으로 출력되는 것이 기본. 그 출력되는 방향을 다른 곳으로 돌려(Redirection)하여 파일에 저장시킬 수 있다는 뜻이다.
- 유닉스 계열의 시스템은 어떤 프로그램이 실행(프로세스)될 때 그 프로세스가 출력하는 결과는 크게 두 가지로 구분된다.
  - 1. 표준 출력(Standard Output)
  - 2. 표준 에러 출력(Standard Error)

- `ls -l > result.txt` : ls -l 결과값을 화면에 출력되는 대신 result.txt로 출력되어 파일로 저장
- `>` : 보통 숫자 1이 생략되어 있는데 이를 표준출력이라고 함
- `2>` : 오류가 난 결과를 파일에 저장하고 싶을 때 사용

<br>

### input 

- `<` : standard input
- `프로그램` : 컴퓨터의 하드디스크나 SSD에 저장되어 있는 코드
- `프로세스` : 그 프로그램이 실행되면, 실행되고 있는 상태
  - `프로세스`에는 standard output과 standard error라고 하는 두 가지의 출력의 형식을 가진다. 그리고 한 가지의 입력, standard input이 들어가 있다. 즉, 하나의 input과 2개의 output이 존재한다.
- `cat result.txt` : result.txt 읽기 (파일에 저장되어있는 내용을 입력으로 받아 화면에 결과가 출력된다.)
- `cat`은 키보드의 입력을 받아 화면에 출력
  - `cat` 명령을 그냥 실행시키면 프로그램이 끝나지 않고 대기 상태에 있게 되고 사용자가 입력한 정보를 standard input으로 받아 standard output으로 출력해준다.
- `head` : 앞쪽에 있는 일부의 텍스트만을 화면에 출력하는 기능
  - `head`는 기본 10줄만 출력을 하는데 옵션으로 마이너스 (-n1) 하면 한 줄만 출력을 해준다.
- `head -n1 < one.txt > two.txt`이 코드에는 표준 입력에 대한 리다이렉션과 표준 출력에 대한 리다이렉션이 모두 포함되어 있다. 먼저 'one.txt'에 있는 내용이 리다이렉션되어서 head 프로세스에 입력되고 그 처리 결과를 'two.txt'에다가 출력을 한다.

<br>

### append 

- `>>` : redirection한 결과를 추가, 즉 뒤에다가 덧붙이는 뜻
- `<<` : 여기에 방향이 바뀌면 입력이란 뜻인데 여러 개의 입력을 하나로 합친다.

<br>

## 쉘과 쉘스크립트

![image](https://user-images.githubusercontent.com/78655692/143039373-251eab2f-ebe1-46d7-9890-c24f1fad54dc.png)

- `하드웨어` : 컴퓨터의 기계적인 부분들
- `kernel` : 물리적인 기계를 직접적으로 제어하는 그 운영체제에서 가장 중심이 되는 그 코어이다. (핵심, 알갱이, 코어)
- `shell` : 사용자가 입력한 명령을 해석하는 프로그램 (껍데기, 주변)
  - 사용자가 리눅스에서 우리가 입력한 명령이 Shell(셸)을 대상으로 해서 명령을 입력해 준다. 
  - 이후 Shell(셸)은 입력한 그 명령을 해석해서 Kernel(커널)이 이해할 수 있는 방식으로 Kernel(커널)에게 전달해준다.
  - 그러면 Kernel(커널)이라고 하는 프로그램은 하드웨어를 제어해서 어떠한 처리를 수행할 수 있도록 명령한다.
  - 하드웨어가 동작하여 그 처리결과를 Kernel(커널)에게 알려주면 Kernel(커널)이 다시 Shell(셸)에게 알려주는 것을 통해서 우리가 입력하여 실행된 결과를 확인해볼 수가 있다.

<br>

### bash vs zsh

- `sudo apt-get install zsh` : zsh 설치

![image](https://user-images.githubusercontent.com/78655692/143040003-0eebe7b2-dc0b-4a56-b601-aa6a49bb6011.png)

- `echo` : 뒤에 들어온 문자를 화면에 출력하는 명령어
- `echo $0` : bash가 뜬다면 이는 shell이라는 카테고리에 속하는 구체적인 제품 중에 하나인 bash라고 하는 프로그램을 쓰고 있음을 의미.
- `zsh`는 탭(tab)을 누르면 실행이 된다.
- `pwd`를 누르면 현재 경로를 보여 주는데 zsh에서는 경로의 앞글자만 쓰고 tab을 누르면 자동완성 시켜준다.

<br>

### Shell Script 

- 여러 개의 명령을 순차적으로 실행하는 것을 통해서 업무가 이루어지는 경우가 많다.
- 그 명령의 스크립트를 어딘가에다가 적어놓고 나중에 재사용할 수 있다면 효율적이다.
- **쉘 스크립트** : 셸에서 실행되는 스크립트 어떤 셸 명령어들이 실행되어야 될 순서를, 실행되어야 될 방법을 각본을 짜서 저장해 놓은 파일

![image](https://user-images.githubusercontent.com/78655692/143042211-c8e955db-663f-48a4-9f98-a11f90cf9b08.png)

![image](https://user-images.githubusercontent.com/78655692/143043518-5b595df9-789b-4358-a332-e62a6bfc09f4.png)

- `nano backup`을 누른 뒤 편집기 실행
- `#!/bin/bash` : 프로그램을 실행시켰을 때 운영 체제는 이 첫 번째 줄에 있는 #! 기호를 보고 그 뒤에 적혀 있는 /bin/bash를 보고 bin 밑에 있는 bash라고 하는 프로그램을 통해서 해석되어야 한다.
- `if [ -d bak ]` : 현재 디렉토리에 bak가 존재하는가?
- `if ! [ -d bak ]; then` : 현재 디렉토리에 bak가 존재하지 않는다면
- `fi` : 조건문 종료
- `cp *.log bak` : .log 모든 파일을 bak에 복사한다.
- 그 후 `Ctrl + X`를 누르고 엔터를 누르면 화면 밖으로 나와짐

![image](https://user-images.githubusercontent.com/78655692/143044428-82f4a49d-2e40-4617-9e07-15943d805d6e.png)

- `./backup` 하면 Permission denied가 뜨는데 컴퓨터에게 backup이 실행가능하다고 알려줘야 함 
- `chmod +x backup` : backup 파일에 x, 실행 가능한 모드를 추가하여 바꾼다.

### `/`  

- root directory
- Linux 시스템의 모든 것은 루트 디렉토리로 알려진 `/` 디렉토리 아래에 있다.
- Linux에는 드라이브 문자가 없다.

<br>

### `/root`

- root home directory
- 루트 사용자의 홈 디렉토리이다. /home/root에 있는 대신 /root에 있다.

<br>

### `/bin` 

- Essential User Binaries
- 시스템이 단일 사용자 모드로 마운트될 때 있어야 하는 필수 사용자 바이너리(프로그램)가 들어가 있다.
- 컴퓨터는 0과 1로 되어 있다. 실행가능한 것을 컴퓨터에서는 binary라고 한다.
  - 사용자들이 사용하는 명령들이 위치하고 있다.
- Firefox와 같은 응용 프로그램은 /usr/bin에 저장되고 bash 셸과 같은 중요한 시스템 프로그램과 유틸리티는 /bin에 저장된다.

<br>

### `/sbin`

- System Binaries
- 시스템 프로그램
- root 사용자가 쓰는 프로그램들은 sbin에 있다.

<br>

### `/etc`

- Configuration Files
- 일반적으로 텍스트 편집기에서 손으로 편집할 수 있는 구성 파일이 있다.

<br>

### `/lib`

- Essential Shared Libraries
- /bin 및 /sbin 폴더의 필수 바이너리에 필요한 라이브러리가 포함되어 있다.

<br>

### `/home`

- 각 사용자의 홈 폴더가 있다.
- `cd ~`를 하면 홈 디렉토리로 한방에 이동할 수 있다.
- 예를 들어, 사용자 이름이 bob인 경우 /home/bob에 홈 폴더가 있다. 이 홈 폴더에는 사용자의 데이터 파일과 사용자별 구성 파일이 들어 있다. 각 사용자는 자신의 홈 폴더에 대한 쓰기 권한만 가지며 시스템의 다른 파일을 수정하려면 높은 권한(루트 사용자가 됨)을 얻어야 한다.

![image](https://user-images.githubusercontent.com/78655692/144047937-4bfdea67-7903-4f77-a6da-891553d1859a.png)

<br>

### `/var`

- Variable Files
- 내용이 바뀔 수 있는 파일들이 있다.
- 로그 파일 및 정상 작동 중에 일반적으로 /usr에 기록되는 기타 모든 내용은 /var 디렉토리에 기록된다.

<br>

### `/tmp`

- Temporary Files
- 여기에 있는 파일들은 reboot되면 없어진다.

<br>

### `/opt`

- Optional add-on Applications
- 선택적 소프트웨어 패키지에 대한 하위 디렉토리가 있다.

<br>

### `/usr`

- User Programs
- 시스템에서 사용하는 응용 프로그램 및 파일과 달리 사용자가 사용하는 응용 프로그램 및 파일이 포함되어 있다.
- 예를 들어, 비필수 응용 프로그램은 /bin 디렉토리 대신 /usr/bin 디렉토리에 있고, 비필수 시스템 관리 바이너리는 /sbin 디렉토리 대신 /usr/sbin 디렉토리에 있다. 
- 각각의 라이브러리는 /usr/lib 디렉토리에 있다.

<br>

## 파일 찾는 법 - locate와 find

- [https://www.tecmint.com/35-practical-examples-of-linux-find-command/](https://www.tecmint.com/35-practical-examples-of-linux-find-command/) 참고

<br>

### locate

- `locate 파일명`
  - 실행이 안된다면 `sudo apt install mlocate`로 설치
- 컴퓨터 안에 저장되어 있는 파일들에 대한 정보를 가지고 있는 데이터베이스를 찾는다.
- locate가 사용하는 데이터베이스를 `mlocate`를 이용한다.
  - `sudo updatedb` 이 명령을 수행

<br>

### find

- `find()` 함수는 실제로 파일들을 뒤진다.
- `find /` : 루트 디렉토리부터 찾겠다.
  - ex. `sudo find / -name *.log`
- `find .` : 현재 디렉토리부터 하위디렉토리까지 찾겠다. 
- `find ~` : 자신의 홈 디렉토리부터 찾겠다.

<br>

### whereis

- 어디에 있냐

![image](https://user-images.githubusercontent.com/78655692/144065331-604a7b07-1e70-419c-ac09-0cf742c5ccb1.png)

- `ls: /usr/bin/ls` : ls의 위치
- `/usr/share/man/man1/ls.1.gz` : `man ls` 했을 때의 사용설명서 내용
  - `echo $PATH` : 환경변수들의 경로인 PATH를 출력하는 명령어
    - PATH들은 전부 :(콜론)으로 구별되어 있다.
    - 리눅스에서 사용하는 명령어들도 결국 일종의 실행파일인데 명령어 입력 시 환경변수에 잡혀있는 PATH를 따라가서 해당 파일이 실행되는 원리로 명령어가 작동된다는 것
    - 결국 mkdir, ls 등의 명령어도 결국 저 PATH 경로에 저장되어 있다는 얘기이다.

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

## 프로세스 모니터링 (ps, top, htop)

- 현재 시스템의 프로세스를 보여주는 것을 실행.

<br>

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
- 화면 상단에 8개의 숫자가 있는데 이는 CPU 숫자를 의미.
- Load average는 부하를 의미

![image](https://user-images.githubusercontent.com/78655692/144151398-18c516f4-83a2-48d5-a282-fbfb8666c2a8.png)

<br>

## 백그라운드

- 멀티태스킹 : 여러 개의 프로그램을 한 화면에서 실행함
- `nano` : 에디터 편집기
  - `Ctrl + Z`는 잠깐 나갔다 오는 것
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

## 데몬 (daemon)

![image](https://user-images.githubusercontent.com/78655692/144158753-c14dbae6-1614-4ea6-81c0-a2813fed1703.png)

- **데몬**의 특성은 항상 실행되고 있다는 것을 의미
- ls, rm, mkdir은 필요할 때만 켰다 킨다. 그러나 server는 데몬을 의미.

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

- `ps aux | grep apache2`

![image](https://user-images.githubusercontent.com/78655692/144164387-1f29c04f-a82a-4db8-8646-f3de83f75db7.png)

- `sudo service apache2 stop` : 서버 멈춤

![image](https://user-images.githubusercontent.com/78655692/144165110-45e9e9c4-4d75-4eca-b6df-0f8bf52c60f5.png)

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
- `Ctrl + C` : 빠져나감

- `*/1 * * * * date >> date.log 2>&1` : 표준에러가 나면 표준출력으로 나타내어 date.log에 추가
  - `2>&1` : 표준에러를 표준출력으로 해줌

<br>

## 쉘을 시작할 때 실행

![image](https://user-images.githubusercontent.com/78655692/144170515-a6601ade-b645-4691-8e28-1ca9e61cf91e.png)

- `alias` : 별명
- `alias l='ls -al'`하고 l만 누르면 `ls -al`이 실행된다.

![image](https://user-images.githubusercontent.com/78655692/144170632-0e80929d-ffe3-4947-aaa7-066d5d04882a.png)

- `cd ~`로 간 다음 `nano .bashrc`로 하면 쉘에 접속할 때 쉘 프로그램이 .bashrc 안에 있는 명령어를 수행한다.

![image](https://user-images.githubusercontent.com/78655692/144171147-3c40a89b-569d-46d7-8238-61df64616b8c.png)

- `Ctrl + End`를 누르면 코드 맨 아래로 가는데 여기서 `Hi, bash`를 쳐본다.
- `exit` : 나가기
- `bash` : bash 실행

![image](https://user-images.githubusercontent.com/78655692/144171389-10e13ef1-b2ef-49df-b233-7029a7971088.png)

## 사용자

<br>

### 다중사용자

![image](https://user-images.githubusercontent.com/78655692/144179402-e9622ed6-48b1-416c-a9d9-c4cd4d5a33dc.png)

- `id` : identify의 줄임말
  - `uid` : user의 id
  - `gid` : group의 id
- `who` : 누가 접속했는지 알려줌

<br>

### 관리자와 일반 사용자

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

### 사용자의 추가

- `sudo useradd -m [사용자]` : 사용자 생성

![image](https://user-images.githubusercontent.com/78655692/144181880-499ea1c8-2b27-4d58-85d2-969ce0403795.png)

- `su - duru`하면 안 들어가진다. 처음에 비밀번호를 생성해 줘야 한다.

![image](https://user-images.githubusercontent.com/78655692/144182135-88249522-5bff-4ffb-9bb6-72b69e312ee9.png)

- 이제 이 duru 사용자도 sudo 권한을 주려고 한다.
- `exit` : 빠져나오기
- `sudo usermod -a -G sudo duru` : duru에게 sudo 권한 주기

<br>

## 권한 (permission)

- `권한을 지정하다` : 사용자가 파일과 디렉토리에 대해서 어떤 일을 할 수 있게 하거나 할 수 없게 하는 것
  - Read & Write & Execute에 대해 
- `echo` : 뒤에 오는 문자를 표준 출력해줌. 화면에 print한다.

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
|x|	실행하기 (execute)|	파일을 실행하거나 디렉터리 트리로 되돌아간다|

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

![image](https://user-images.githubusercontent.com/78655692/144347253-e2a259e3-c27c-479d-8122-c54dfc016f3e.png)

- `chmod o-r perm.txt` : others의 read 권한을 빼주겠다.(-)

![image](https://user-images.githubusercontent.com/78655692/144347493-5ddfd2b4-9d49-4a99-9a18-ecb173a38929.png)

- `chmod o+w perm.txt` : others의 write 권한을 주겠다.(+)

![image](https://user-images.githubusercontent.com/78655692/144347641-188c211f-9280-4d11-b240-7a406220c299.png)

- `chmod u-r perm.txt` : user의 read 권한을 빼겠다.(-)

![image](https://user-images.githubusercontent.com/78655692/144356063-9c6f113a-99b5-416b-989c-6eceff76478a.png)

- `chmod a=rwx perm.txt`를 하면 모든 권한자에게 rwx를 부여한다.

<br>

### execute

![image](https://user-images.githubusercontent.com/78655692/144353232-8f62493d-bf60-40cb-96b7-11e19b45ef30.png)

![image](https://user-images.githubusercontent.com/78655692/144353574-f0eb952c-8cce-4cd5-9129-95e9dd3ccad2.png)

![image](https://user-images.githubusercontent.com/78655692/144353679-d3fa8c9b-509f-423d-bfd9-b51383a9de40.png)

- `chmod u+x hi-machine.sh` : user에게 실행 권한(x)를 준다.
- `#!/bin/bash` 이 코드가 있다면 운영체제는 `./hi-machine.sh`를 실행시켰을 때 제일 먼저 `hi-machine.sh`이 현재 사용자에게 실행가능한지 본다.
- others에게도 실행 권한을 주기 위해선 `chmod o+x hi-machine.sh`를 한다.

<br>

## 그룹 (group)

- group : 파일과 디렉토리를 여러 사용자들이 공동으로 관리할 수 있는 방법

![KakaoTalk_20211202_132405230](https://user-images.githubusercontent.com/78655692/144357487-30227af2-13af-42f2-988b-30704af3cb57.jpg)

<br>

## 인터넷

- request한 나의 컴퓨터가 client이고, request를 받아서 response 해주는 컴퓨터가 server이다.
  - client는 server에게 요청을 한다. server는 client에게 응답한다.
- `DNS`는 이 세상의 모든 domain이 각각 어떤 IP인지 아는 거대한 서버이다.
- `ip addr`를 치면 현재 자신의 IP를 알려준다. (이 컴퓨터의 실제 부여된 IP)

![image](https://user-images.githubusercontent.com/78655692/144783087-7692d136-4661-45f6-a7a6-922774a9d3b3.png)

- `curl ipinfo.io/ip`를 치면 IP를 알려준다. (온라인 입장에서 결과적인 IP가 뭔지 알려준다.)

<br>

### apache

- client로 사용하기 위해서는 web browser가 있어야한다.
- 주소란에 google.com/index.html을 입력하면 google.com에 request를 보낸다. 이때 웹 서버는 요청이 들어오면 요청을 분석한다.
  - 웹 브라우저에 해당하는 제품 : Firefox, IE, Chrome 등
  - 웹 서버에 속하는 제품 : Apache, nginx, IIS 등

- Apache 설치
  - `sudo apt-get update`
  - `sudo apt-get install apache2`
- `sudo service apache2 start`를 통해 웹 서버를 켜 준다.

<br>

- `elinks`는 쉘에서 웹브라우징을 할 수 있게 도와주는 프로그램
  - elinks 설치 : `sudo apt-get install elinks`
- Unix 계열에서의 설정에 대한 것은 /etc에 저장되어 있다.
  - `cd /etc/apache2`로 경로 변경 (여기에 아파치에 대한 설정 파일이 있다.)
- 그 중 apache2.conf를 확인하면 `IncludeOptional sites-enabled/*.conf`가 있는데 `sites-enabled`라는 디렉토리 안의 모든 .conf 파일을 읽고 사용한다는 것이다.
- `/var/www/html`을 사용하는 이유는 `/etc/apache2/sites-enabled/000-default.conf`에 설정이 `/var/www/html`로 되어있기 때문이다.
  - 어떤 서버를 설치하건 /etc 밑에 설정 파일이 있고 **그 곳의 설정 파일을 바꾸면 동작하는 방식이 달라진다.**

- `/etc/apache2/sites-enabled/000-default.conf`를 확인하면

```linux
ErrorLog ${APACHE_LOG_DIR}/error.log
CustomLog ${APACHE_LOG_DIR}/access.log combined
```

- `${APACHE_LOG_DIR}`는 아파치 웹 서버가 동작할 때 로그를 확인하기 위해 특정 디렉토리 아래의 error.log 파일과 access.log 파일에 기록하겠다 라는 것이다.
- `${APACHE_LOG_DIR}`는 /var/log/apache2/이다.
- 해당 디렉토리를 보면 access.log와 error.log가 존재한다.
- 누군가 웹 서버에 접속할 때마다 끝에 접속한 사람의 정보가 추가가 된다.
- 실시간으로 확인하기 위해서는 tail을 사용한다.
  - `tail -f /var/log/apache2/access.log` : 실시간으로 이 파일의 끝에 있는 정보가 나타난다.
- elinks를 통해 들어가면 위의 tail이 작동해 access 로그가 찍힌다.
- curl 역시 마찬가지로 접속해도 새로운 access 로그가 찍힌다. (200)
- 없는 파일에 접속하면 접속은 확인이 되지만 상태(404)도 같이 나타난다.
- 이것이 로그를 찾는 것이다. 대부분의 서버 프로그램이 가지는 동작이다.
- 서버의 로그가 어디에 있을까에 대해 알아야한다.

<br>

## SSH

- 원격제어는 원격에 있는 컴퓨터를 내 앞에 있는 것처럼 다룰 수 있다.
- `sudo apt-get install openssh-server` : 다른 컴퓨터가 내 컴퓨터에 접속할 때 사용
- `sudo apt-get install openssh-client` : 다른 컴퓨터로 원격 접속 할 때 사용
- `ssh poeun@172.29.229.202` : 원격 접속할 시
- 다른 컴퓨터임에도 불구하고 원격으로 다른 컴퓨터에 접속할 수 있다.
- 이 컴퓨터로 명령을 내리면 ssh로 접속한 컴퓨터를 대상으로 실행되게 된다.

<br>

## References 

- [생활코딩 - Linux](https://www.inflearn.com/course/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-%EB%A6%AC%EB%88%85%EC%8A%A4-%EA%B0%95%EC%A2%8C#curriculum)
- [nano 에디터 소개 및 사용법](https://junistory.blogspot.com/2017/08/nano.html)
