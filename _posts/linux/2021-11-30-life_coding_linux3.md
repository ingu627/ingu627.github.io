---
layout: single
title: "Linux 기초 정리 (3) - directory, 파일찾는 법"
excerpt: "생활 코딩 강의 내용을 요약 및 정리한 글입니다. - 디렉토리 구조"
categories: linux
tag: [linux, basic, ubuntu]

toc: true
toc_sticky: true

last_modified_at: 2021-11-30

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

### `/`  

- root directory
- Linux 시스템의 모든 것은 루트 디렉토리로 알려진 `/` 디렉토리 아래에 있다.
- Linux에는 드라이브 문자가 없다.

### `root`

- root home directory
- 루트 사용자의 홈 디렉토리이다. /home/root에 있는 대신 /root에 있다.

### `/bin` 

- Essential User Binaries
- 시스템이 단일 사용자 모드로 마운트될 때 있어야 하는 필수 사용자 바이너리(프로그램)가 들어가 있다.
- 컴퓨터는 0과 1로 되어 있다. 실행가능한 것을 컴퓨터에서는 binary라고 한다.
  - 사용자들이 사용하는 명령들이 위치하고 있다.
- Firefox와 같은 응용 프로그램은 /usr/bin에 저장되고 bash 셸과 같은 중요한 시스템 프로그램과 유틸리티는 /bin에 저장된다.

### `sbin`

- System Binaries
- 시스템 프로그램
- root 사용자가 쓰는 프로그램들은 sbin에 있다.

### `/etc`

- Configuration Files
- 일반적으로 텍스트 편집기에서 손으로 편집할 수 있는 구성 파일이 있다.

### `/lib`

- Essential Shared Libraries
- /bin 및 /sbin 폴더의 필수 바이너리에 필요한 라이브러리가 포함되어 있다.

### `/home`

- 각 사용자의 홈 폴더가 있다.
- `cd ~`를 하면 홈 디렉토리로 한방에 이동할 수 있다.
- 예를 들어, 사용자 이름이 bob인 경우 /home/bob에 홈 폴더가 있다. 이 홈 폴더에는 사용자의 데이터 파일과 사용자별 구성 파일이 들어 있다. 각 사용자는 자신의 홈 폴더에 대한 쓰기 권한만 가지며 시스템의 다른 파일을 수정하려면 높은 권한(루트 사용자가 됨)을 얻어야 한다.

![image](https://user-images.githubusercontent.com/78655692/144047937-4bfdea67-7903-4f77-a6da-891553d1859a.png)

### `/var`

- Variable Files
- 내용이 바뀔 수 있는 파일들이 있다.
-  로그 파일 및 정상 작동 중에 일반적으로 /usr에 기록되는 기타 모든 내용은 /var 디렉토리에 기록된다.

### `/tmp`

- Temporary Files
- 여기에 있는 파일들은 reboot되면 없어진다.

### `/opt`

- Optional add-on Applications
- 선택적 소프트웨어 패키지에 대한 하위 디렉토리가 있다.

### `/usr`

- User Programs
- 시스템에서 사용하는 응용 프로그램 및 파일과 달리 사용자가 사용하는 응용 프로그램 및 파일이 포함되어 있다.
- 예를 들어, 비필수 응용 프로그램은 /bin 디렉토리 대신 /usr/bin 디렉토리에 있고, 비필수 시스템 관리 바이너리는 /sbin 디렉토리 대신 /usr/sbin 디렉토리에 있다. 
- 각각의 라이브러리는 /usr/lib 디렉토리에 있다.

<br>
<br>

## 파일 찾는 법 - locate 와 find

- [https://www.tecmint.com/35-practical-examples-of-linux-find-command/](https://www.tecmint.com/35-practical-examples-of-linux-find-command/) 참고

### locate

- `locate 파일명`
  - 실행이 안된다면 `sudo apt install mlocate`로 설치
- 컴퓨터 안에 저장되어 있는 파일들에 대한 정보를 가지고 있는 데이터베이스를 찾는다.
- locate가 사용하는 데이터베이스를 `mlcate`를 이용한다.
  - `sudo updatedb` 이 명령을 수행

### find

- `find()` 함수는 실제로 파일들을 뒤진다.
- `find /` : 루트 디렉토리부터 찾겠다.
  - ex. `sudo find / -name *.log`
- `find .` : 현재 디렉토리부터 하위디렉토리까지 찾겠다. 
- `find ~` : 자신의 홈 디렉토리부터 찾겠다.

### whereis

- 어디에 있냐

![image](https://user-images.githubusercontent.com/78655692/144065331-604a7b07-1e70-419c-ac09-0cf742c5ccb1.png)

- `ls: /usr/bin/ls` : ls의 위치
- `/usr/share/man/man1/ls.1.gz` : `man ls` 했을 때의 사용설명서 내용
  - `echo $PATH` : 환경변수들의 경로인 path를 출력하는 명령어
    - path들은 전부 : (콜론)으로 구별되어 있다.
    - 리눅스에서 사용하는 명령어들도 결국 일종의 실행파일인데 명령어 입력 시 환경변수에 잡혀있는 PATH를 따라가서 해당 파일이 실행되는 원리로 명령어가 작동된다는 것
    - 결국 mkdir, ls 등의 명령어도 결국 저 path 경로에 저장되어 있다는 얘기이다.


## References

- [The Linux Directory Structure, Explained](https://www.howtogeek.com/117435/htg-explains-the-linux-directory-structure-explained/){: target="_blank"}
- [35 Practical Examples of Linux Find Command](https://www.tecmint.com/35-practical-examples-of-linux-find-command/){: target="_blank"}
- [5. 리눅스 환경변수(path) 설정](https://m.blog.naver.com/occidere/220821140420){: target="_blank"}