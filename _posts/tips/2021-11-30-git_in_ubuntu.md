---
layout: single
title: "Ubuntu, Windows10에서 Git 설치하기"
excerpt: "깃은 컴퓨터 파일의 변경사항을 추적하고 여러 명의 사용자들 간에 해당 파일들의 작업을 조율하기 위한 분산 버전 관리 시스템이다."
categories: tips
tag: [git, linux, ubuntu, 윈도우10, WSL2, 리눅스, 우분투, 윈도우, 우분투, 설치, 깃]

toc: true
toc_sticky: true

last_modified_at: 2026-10-11

sidebar_main: false
---

## Git이란? 

![image](https://user-images.githubusercontent.com/78655692/144004525-dd21b094-3c73-405f-9392-389a25ac7105.png)

- **깃(Git)**은 컴퓨터 파일의 변경사항을 추적하고 여러 명의 사용자 간에 해당 파일들의 작업을 조율하기 위한 분산 버전 관리 시스템(DVCS)이다.[^1] 소스 코드 무결성을 암호화 해시로 보장하며 비선형적 브랜치 관리를 지원한다.


- Git은 프로젝트 파일을 관리할 때 작업 디렉터리(Working Tree), 준비 영역(Staging Area), Git 디렉터리(Repository)의 세 가지 핵심 영역을 기반으로 상태(Committed, Modified, Staged)를 전환한다.[^1]


## Ubuntu (linux)에서 설치하기

- 윈도우10에서 WSL2 기반 리눅스 설치 방법은 [Ubuntu 설치 안내](https://ingu627.github.io/linux/install_ubuntu/)를 참고한다.


### 1. sudo apt-get install git

- 리눅스 배포판에서는 먼저 패키지 인덱스를 최신화하기 위해 `sudo apt-get update`를 실행하거나, `sudo apt-get install git`를 입력하여 패키지 의존성 상태를 점검한다.[^2]

![image](https://user-images.githubusercontent.com/78655692/144005380-51876bc0-51cd-4849-aca3-d97445c11441.png)


### 2. sudo apt install git

- `sudo apt install git`를 입력하여 Git 패키지를 설치한다.[^2]

![image](https://user-images.githubusercontent.com/78655692/144005551-83b1ecd0-db34-40db-a69b-18f51f38ead3.png)

- `git --version`을 입력하여 설치가 잘 되었는지 확인한다. (Ubuntu 20.04 LTS 기본 저장소 기준 Git 2.25.1 버전이 확인된다.)

![image](https://user-images.githubusercontent.com/78655692/144006203-202dfdfd-4a00-4c5f-8a61-79b20c3827be.png)


### 3. 사용자 정보 입력

- 커밋 메타데이터에 작성자 정보를 기록하기 위해 전역 사용자 이름과 이메일을 등록한다.[^3]
  - `git config --global user.name "사용자 이름"`
  - `git config --global user.email "사용자 이메일"`
- *주의*: 실습 스크린샷에는 `user.mail`로 기재되어 있으나, Git 공식 환경 설정에서 커밋 작성자 이메일을 인식하는 공식 키는 `user.email`이다.[^3] `user.mail`을 사용할 경우 커밋 시 작성자 식별 오류(`Author identity unknown`)가 발생하므로 반드시 `user.email`로 등록해야 한다.

![image](https://user-images.githubusercontent.com/78655692/144006426-e00e7701-3227-4b43-bd1c-74af6f05ee2d.png)

- `git config --global color.ui "auto"`를 입력하면 깃 명령 출력의 컬러 표시를 활성화한다.
- 설정된 전역 정보는 `git config --global --list`로 확인할 수 있다.


### 4. git 사용법

- 이것으로 Git 설치와 기본 환경 설정을 마친다.
- 이후 저장소 초기화(`git init`), 복제(`git clone`), 커밋 및 브랜치 작업 등 세부 명령어 사용법은 [Git 카테고리](https://ingu627.github.io/categories/git)에서 확인할 수 있다.


## Windows에서 Git 설치하기

### 1. git 사이트

- 공식 배포 사이트([https://git-scm.com/](https://git-scm.com/))에 접속하여 Windows용 설치 바이너리(Git for Windows)를 내려받는다.[^4]

![image](https://user-images.githubusercontent.com/78655692/144007190-9da75d3e-8526-45c8-a984-181b769e2b0c.png)


### 2. 기본사항대로 쭉 클릭한다.

- 설치 프로그램 대화상자에서 기본 텍스트 에디터, 기본 브랜치 이름(`main`), 터미널 환경 및 줄바꿈 변환 설정을 확인하며 설치를 완료한다.
- 설치 완료 후 명령 프롬프트(cmd) 또는 PowerShell에서 `git --version`을 실행하여 정상 설치 여부를 확인한다.


## 한계 및 트레이드오프

- **APT 기본 패키지 버전 고정**: Ubuntu 기본 패키지 저장소(`apt`)를 통해 설치되는 Git은 배포판 릴리스 시점의 안정화 버전(예: Ubuntu 20.04 기준 Git 2.25.1)으로 고정되므로, 최신 Git 기능이 필요할 경우 Ubuntu Git 공식 PPA(`ppa:git-core/ppa`)를 추가하거나 소스 코드를 직접 빌드해야 한다.[^2]
- **OS 간 개행 문자(CRLF/LF) 호환성**: Windows와 Linux(WSL2 포함) 환경을 혼용할 경우 운영체제별 개행 문자 차이로 인해 파일 전체가 변경된 것으로 인식될 수 있다. 이를 방지하기 위해 Windows 환경에서는 `core.autocrlf true`, Linux/macOS 환경에서는 `core.autocrlf input` 설정을 사전에 지정해야 한다.[^3]
- **전역 설정(`--global`)의 계정 분리 한계**: 전역 플래그(`--global`)는 현재 사용자 계정의 모든 저장소에 단일 프로필을 적용하므로, 업무용과 개인용 Git 계정을 하나의 머신에서 병행 운용할 때는 저장소별 로컬 설정(`--local`) 또는 디렉터리 기반 조건부 include(`gitdir` 키워드) 구성을 별도로 적용해야 한다.[^3]


## References 

- [나무위키 - git](https://namu.wiki/w/Git)
- [위키백과 - git](https://ko.wikipedia.org/wiki/%EA%B9%83_(%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4))
- [[Linux] 우분투 Git 설치 / 다운로드 & 사용 방법](https://coding-factory.tistory.com/502?category=760718)
- [[Ubuntu] Ubuntu에 Git 설치하고 사용하기](https://ppost.tistory.com/entry/Ubuntu-Ubuntu%EC%97%90-Git-%EC%84%A4%EC%B9%98%ED%95%98%EA%B3%A0-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)

[^1]: Git SCM - Getting Started - What is Git?, <https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F>
[^2]: Git SCM - Download for Linux and Unix, <https://git-scm.com/download/linux>
[^3]: Git SCM - Customizing Git - Git Configuration, <https://git-scm.com/docs/git-config>
[^4]: Git for Windows, <https://git-scm.com/download/win>