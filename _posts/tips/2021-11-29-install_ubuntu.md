---
layout: single
title: "윈도우10에서 리눅스(Linux) 설치하기 (Ubuntu on WSL2)"
excerpt: "AWS에서 가상의 환경을 작업하던 중, 내 PC에서 구동해 보았으면 싶어서 설치를 진행해 보았습니다. 윈도우10 환경에서 wsl2를 설치해봅니다."
categories: tips
date: 2022-07-16
tags: [linux, ubuntu, windows 10, WSL2, 우분투, 리눅스, wsl, 윈도우10, 설치, 오류, 사용법, 정리, 윈도우, 도커, docker]

toc: true
toc_sticky: true

last_modified_at: 2026-10-11

sidebar_main: false
---

> 이 글은 2022년 당시 WSL2(Windows 10 21H2) 기준으로 작성된 설치/사용 기록이다. 최신 버전에서는 명령이 다를 수 있다.

- **Update(20220714)**
  - 윈도우 11 또는 윈도우 10 21H2 이상에서는 `wsl --install` 한 줄로 설치할 수 있다. 아래처럼 수동으로 설치하는 방식은 윈도우 10 1903(빌드 18362) 이상이면 동작한다. [^2]
- AWS에서 가상의 환경을 작업하던 중, 내 PC에서 구동해 보았으면 싶어서 설치를 진행해 보았다.

![image](/assets/images/legacy/c121b521b4.webp)


## 1. Linux용 Windows 하위 시스템

- 제어판 -> 프로그램 및 기능 -> Windows 기능 켜기/끄기 -> Linux용 Windows 하위 시스템 선택 -> 확인

![image](/assets/images/legacy/4e66f19cd6.webp)


## 2. 개발자 모드

- 설정 -> 업데이트 및 보안 -> 개발자용 -> 개발자 모드 켬 -> 그 후 컴퓨터 재시작

![image](/assets/images/legacy/0788e7a3e7.webp)


## 3. Windows 10 최신 업데이트하기

![image](/assets/images/legacy/1fae2a75f3.webp)

- **추가(20220717)**
  - 설정 -> Windows 업데이트 -> 고급 옵션 -> "Window를 업데이트할 때 다른 Microsoft 제품에 대한 업데이트 받기" 활성화


## 4. powershell 관리자 실행

- powershell 검색 -> 관리자 권한으로 실행

![image](/assets/images/legacy/3c97df8768.webp)


## 5. 코드 복사 -> 붙여넣기

```shell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

![image](/assets/images/legacy/73922d9018.webp)

- 이 코드는 WSL 시스템을 활성화하는 단계이다.


## 6. 코드 복사 -> 붙여넣기

```shell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

![image](/assets/images/legacy/d1aee23098.webp)

- 이 코드는  Virtual Machine 기능을 활성화하는 단계이다.


## 7. Linux 커널 업데이트 패키지 다운로드

- [x64 머신용 최신 WSL2 Linux 커널 업데이트 패키지](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)

- 링크를 누르면 자동으로 다운받아지고 설치를 진행하면 된다.


## 8. WSL 2 기본 버전 세팅

- `wsl --set-default-version 2`

![image](/assets/images/legacy/dc20c483e4.webp)

- 이 코드는 WSL 2를 기본 버전으로 세팅하는 단계이다.

![image](/assets/images/legacy/cc56429c98.webp)

> 만약 위와 같이 에러가 난다면 `bcdedit /set hypervisorlaunchtype auto` 를 친 후 재부팅을 한다.

![image](/assets/images/legacy/7d509d7177.webp)

![image](/assets/images/legacy/40f878389e.webp)


## 9. Ubuntu 설치

![image](/assets/images/legacy/46d8bd744d.webp)

- Microsoft Store에서 Ubuntu를 검색해 다운받는다.
- 새로 설치된 Linux 배포를 처음 시작하면 콘솔 창이 열리고 파일이 압축 해제되어 PC에 저장될 때까지 1~2분 정도 기다려야 한다.

![ubuntu](/assets/images/legacy/27aff2d6d1.webp)

![ubuntu1](/assets/images/legacy/9536806c5e.webp)

- 새 Linux 배포를 위한 사용자 계정 및 암호를 만들어야 하는데 계정 이름은 소문자로 생성한다.


> WslRegisterDistribution failed with error: 0x800701bc
> Error: 0x800701bc WSL 2? ?? ?? ?? ????? ?????. ??? ??? https://aka.ms/wsl2kernel? ??????.  에러가 난다면

- <https://docs.microsoft.com/ko-kr/windows/wsl/install-manual>로 가서 `ARM64 패키지`를 다운받는다.

![image](/assets/images/legacy/132909a6f6.webp)


## 10. 최종

- Windows Terminal을 설치해주면 커스텀마이징을 할 수 있다.

![image](/assets/images/legacy/58d024cc52.webp)

![image](/assets/images/legacy/257889b09c.webp)

- 초기에 `sudo apt update`, `sudo apt upgrade` 명령어 실행한다.
  - alsa 오류가 난다면 `sudo apt-get install alsa-utils` 명령어 실행한다.


## Appendix A

- 만약 wsl를 vscode와 연동시키려면, command에 `code .` 명령어를 실행해주면 된다.

![image](/assets/images/legacy/8e8341f166.webp)


- 또는 vscode에 `ctrl+shift+p`를 눌러 Remote-WSL: New WSL Window를 실행해주면 된다.

![image](/assets/images/legacy/bf9b1cb3d5.webp)


## 한계 및 주의사항

- WSL2는 가상 머신(Hyper-V VM) 환경에서 독립적인 Linux 커널로 동작하므로, Windows 호스트 드라이브(`/mnt/c/`)에 위치한 프로젝트 파일에 교차 접근할 때 파일 시스템 I/O 성능이 저하된다. 빠른 파일 처리가 필요한 프로젝트 소스와 개발 환경은 WSL Linux 내부 파일 시스템(`~/`)에 보관해야 한다. [^1] [^4]
- WSL2 가상 하드 디스크(`ext4.vhdx`)는 사용량에 따라 자동으로 커지지만, Linux 내부에서 파일을 지우더라도 Windows 호스트의 가상 디스크 파일 용량은 자동으로 줄어들지 않는다. 용량을 회수하려면 `wsl --shutdown` 후 Windows `diskpart` 유틸리티의 `compact vdisk` 작업을 수행해야 한다. [^3]
- WSL2는 가상화된 전용 네트워크 어댑터를 통해 별도의 가상 IP 주소를 할당받으므로, Windows 호스트와 포트 포워딩이나 로컬 서버 통신을 구성할 때 WSL 1과 다른 네트워킹 설정(localhost 바인딩 특성)을 고려해야 한다. [^4]

## References

[^1]: [Microsoft Learn - WSL 개발 환경 설정 모범 사례](https://learn.microsoft.com/ko-kr/windows/wsl/setup/environment)
[^2]: [Microsoft Learn - 이전 버전의 WSL 수동 설치 단계](https://learn.microsoft.com/ko-kr/windows/wsl/install-manual)
[^3]: [Microsoft Learn - WSL 가상 하드 디스크(VHD) 공간 관리](https://learn.microsoft.com/ko-kr/windows/wsl/disk-space)
[^4]: [Microsoft Learn - WSL 버전 비교 (WSL 1과 WSL 2)](https://learn.microsoft.com/ko-kr/windows/wsl/compare-versions)
