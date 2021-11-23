---
layout: single
title: "Linux 기초 정리 (1)"
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

## 리눅스 기초 

### ls

- 현재 디렉토리의 파일 목록을 출력하는 명령어
- `ls -l` : 현재 디렉토리의 파일을 자세히 보여주는 명령어 (l : list)
- `ls -a` : 현재 디렉토리에 있는 파일 + 숨긴 파일(`.파일명`) 다 보여줌
- `ls -al` : -a와 -l 합친 함수

### pwd 

- 현재 위치하고 있는 디렉토리를 알려주는 명령어
  - `directory` : 파일을 잘 정리정돈위한 수납 공간

### mkdir

- `mkdir 새로 생성할 디렉토리명`
- (make directory)
- `-` : 파라미터 (동작하는 방법을 바꾼다) (축약형)
- `--` : 파라미터 (풀네임)
- `-p` : 필요하면 부모 디렉토리를 생성한다. (`--parents`)
  - 예시 : `mkdir -p dir1/dir2/dir3`

![image](https://user-images.githubusercontent.com/78655692/142976212-add56922-2b1d-44e5-aff8-9f9d8d9eccb1.png)

### touch

- `tocuh 새로 생성할 파일`

### cd

- `cd 이동할 디렉토리의 경로명` (cd : change directory)
- `상대경로` : 현재 디렉토리의 위치를 기준으로 다른 디렉토리의 위치를 표현하는 것
- `..` : 부모 디렉토리를 의미
  - `cd ..` : 현재 디렉토리의 부모 디렉토리로 이동하는 명령이 된다.
- `.` : 현재 디렉토리를 의미
- `절대경로` : 최상위 디렉토리를 기준으로 경로를 표현하는 것을 의미
- `최상위 디렉토리` : 루트(root) 디렉토리라고 하고 `/`이다.
  - `cd /`는 최상위 디렉토리로 이동한다는 의미

### rm

- `rm 파일명`
- 파일 제거 (remove)
- - `rm -r 디렉토리명` : 재귀적 디렉토리 제거 (재귀적 : 그 안쪽에서부터 순차적으로)

### --help

- 명령어 뒤에 --help를 붙이면 명령의 사용설명서가 출력
- 예시 `ls --help`
- 간단한 매뉴얼

### man 

- help보다 자세한 사용설명서
- 예시 `man ls`
- `/sort`라 치면 sort를 찾아준다. 
- `q`를 나가면 화면 밖으로 빠져나감

### cp 

- `cp 원본파일 복사할 디렉토리` : 원본파일을 해당 디렉토리로 복사한다. (cp : copy)

### mv

- `mv 파일명 이동할 디렉토리` : 원본파일을 해당 디렉토리로 이동 (mv : move)
- 예시 `mv mv.txt dir1/mv.txt`
- 파일명 바꾸고 싶을 때도 mv 사용
  - 예시 `mv rename.txt rename2.txt`

### sudo 

- sudo = super user do의 약자 (슈퍼 유저가 하는 일) **권한**
- 리눅스는 다중 컴퓨터가 특징 (하나의 운영체제를 여러 사람이 썼음) -> 권한 부여를 나눔
- `super user` 또는 `root user`

![image](https://user-images.githubusercontent.com/78655692/142977414-1280c4e0-91b3-46f2-b80d-0d306f7b416b.png)

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

### wget 

- 파일을 다운로드받는 방법 (url을 통해서)

![image](https://user-images.githubusercontent.com/78655692/142983238-ee773aef-9c7b-41e8-b8dc-c3008849d917.png)

- `wget -O [바꿀이미지명] [이미지링크 주소]` 

![image](https://user-images.githubusercontent.com/78655692/142983505-5ae35d6a-1df0-44ce-a29e-08fcb59aa189.png)


## References 

- [생활코딩 - Linux](https://www.inflearn.com/course/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-%EB%A6%AC%EB%88%85%EC%8A%A4-%EA%B0%95%EC%A2%8C#curriculum)
- [nano에디터 소개 및 사용법](https://junistory.blogspot.com/2017/08/nano.html)