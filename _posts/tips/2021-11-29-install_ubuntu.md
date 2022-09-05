---
layout: single
title: "윈도우10에서 리눅스(Linux) 설치하기 (Ubuntu on WSL2)"
excerpt: "AWS에서 가상의 환경을 작업하던 중, 내 PC에서 구동해 보았으면 싶어서 설치를 진행해 보았습니다. 윈도우10 환경에서 wsl2를 설치해봅니다."
categories: tips
date: 2022-07-16
tag: [linux, ubuntu, windows 10, WSL2, 우분투, 리눅스, wsl, 윈도우10, 설치, 오류, 사용법, 정리, 윈도우]

toc: true
toc_sticky: true

last_modified_at: 2022-07-14

sidebar_main: true
---

- **Update(20220714)**
  - 윈도우 11 또는 윈도우 10의 21H2 버전 이상이어야 WSL2가 설치가 된다.
- AWS에서 가상의 환경을 작업하던 중, 내 PC에서 구동해 보았으면 싶어서 설치를 진행해 보았다.

![image](https://user-images.githubusercontent.com/78655692/143879564-f6e63337-035a-48a0-aba0-b0c658b3b4de.png)

<br>
<br>

## 1. Linux용 Windows 하위 시스템

- 제어판 -> 프로그램 및 기능 -> Windows 기능 켜기/끄기 -> Linux용 Windows 하위 시스템 선택 -> 확인

![image](https://user-images.githubusercontent.com/78655692/143834886-4aa01b2c-ee7b-459a-98ee-e854b613f165.png)

<br>
<br>

## 2. 개발자 모드

- 설정 -> 업데이트 및 보안 -> 개발자용 -> 개발자 모드 켬 -> 그 후 컴퓨터 재시작

![image](https://user-images.githubusercontent.com/78655692/143835224-183bdc3c-752b-4ecd-8637-a26c01781216.png)

<br>
<br>

## 3. Windows 10 최신 업데이트하기

![image](https://user-images.githubusercontent.com/78655692/143835974-0f398f40-6f89-4138-9a44-5a8e7e6aeb3e.png)

- **추가(20220717)**
  - 설정 -> Windows 업데이트 -> 고급 옵션 -> "Window를 업데이트할 때 다른 Microsoft 제품에 대한 업데이트 받기" 활성화

<br>
<br>

## 4. powershell 권리자 실행

- powershell 검색 -> 권리자 권한으로 실행

![image](https://user-images.githubusercontent.com/78655692/143835471-233faab1-2dfd-4ac8-bef7-a65db6ebb1df.png)

<br>
<br>

## 5. 코드 복사 -> 붙여넣기

- `dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart`

![image](https://user-images.githubusercontent.com/78655692/143835757-843a4d19-048b-428e-be6f-1fedad631cfd.png)

- 이 코드는 WSL 시스템을 활성화하는 단계이다.

<br>
<br>

## 6. 코드 복사 -> 붙여넣기

- `dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart`

![image](https://user-images.githubusercontent.com/78655692/143836164-91bd1c3f-db2f-42f9-b9d9-41ba588ed8af.png)

- 이 코드는  Virtual Machine 기능을 활성화하는 단계이다.

<br>
<br>

## 7. Linux 커널 업데이트 패키지 다운로드

- [x64 머신용 최신 WSL2 Linux 커널 업데이트 패키지](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)

- 링크를 누르면 자동으로 다운받아지고 설치를 진행하면 된다.

<br>
<br>

## 8. WSL 2 기본 버전 세팅

- `wsl --set-default-version 2`

![image](https://user-images.githubusercontent.com/78655692/143836849-45502496-adf6-4789-a5f2-7fb80dedcb9f.png)

- 이 코드는 WSL 2를 기본 버전으로 세팅하는 단계이다.

![image](https://user-images.githubusercontent.com/78655692/147727659-42d6b5a5-2fc3-44dc-b456-3af71d4f9161.png)

> 만약 위와 같이 에러가 난다면 `bcdedit /set hypervisorlaunchtype auto` 를 친 후 재부팅을 한다.

![image](https://user-images.githubusercontent.com/78655692/147727746-76747974-c31b-4dba-a51d-c9b7c72c016a.png)

![image](https://user-images.githubusercontent.com/78655692/147727905-7ade9059-f871-4c55-b28a-91e936c905ae.png)

<br>
<br>

## 9. Ubuntu 설치

![image](https://user-images.githubusercontent.com/78655692/143836968-6fc9b49c-c69d-450a-8c41-c147c07ad03e.png)

- Microsoft Store에서 Ubuntu를 검색해 다운받는다.
- 새로 설치된 Linux 배포를 처음 시작하면 콘솔 창이 열리고 파일이 압축 해제되어 PC에 저장될 때까지 1~2분 정도 기다려야 한다.

![ubuntu](https://user-images.githubusercontent.com/78655692/143837239-a2336772-fe3d-452f-bb12-57e872cab988.png)

![ubuntu1](https://user-images.githubusercontent.com/78655692/143837290-e5babcfa-6340-491c-88bb-1f46ffeb4fe1.png)

- 새 Linux 배포를 위한 사용자 계정 및 암호를 만들어야 하는데 계정 이름은 소문자로 생성한다.

<br>

> WslRegisterDistribution failed with error: 0x800701bc
> Error: 0x800701bc WSL 2? ?? ?? ?? ????? ?????. ??? ??? https://aka.ms/wsl2kernel? ??????.  에러가 난다면

- <https://docs.microsoft.com/ko-kr/windows/wsl/install-manual>로 가서 `ARM64 패키지`를 다운받는다.

![image](https://user-images.githubusercontent.com/78655692/147728452-718f41fe-0254-4b88-b86a-ccc4b411f4eb.png)

<br>
<br>

## 10. 최종

- Windows Terminal을 설치해주면 커스텀마이징을 할 수 있다.

![image](https://user-images.githubusercontent.com/78655692/143837531-40e5d018-ccf8-4fa4-b63f-beda5eb4e800.png)

![image](https://user-images.githubusercontent.com/78655692/143837437-b1ceb809-ce61-4d64-9379-b4cd4749759b.png)

- 초기에 `sudo apt update`, `sudo apt upgrade` 명령어 실행한다.
  - aply 오류가 난다면 `sudo apt-get install alsa-utils` 명령어 실행한다.

<br>
<br>

## Appendix A

- 만약 wsl를 vscode와 연동시키려면, command에 `code .` 명령어를 실행해주면 된다.

![image](https://user-images.githubusercontent.com/78655692/178905640-e0217aaa-f25f-4161-9822-b8df67707fd8.png)

<br>

- 또는 vscode에 `ctrl+shift+p`를 눌러 Remote-WSL: New WSL Window를 실행해주면 된다.

![image](https://user-images.githubusercontent.com/78655692/178905818-d0463e55-4bf6-4305-8a95-17a6eb52add9.png)

<br>
<br>
<br>

## References

- [microsoft docs](https://docs.microsoft.com/ko-kr/windows/wsl/install-manual)
- [Windows 10 에서 Linux 환경 구축하기](https://knackin.tistory.com/1)
- [[WSL2] 윈도우에서 리눅스 사용하기](https://blog.naver.com/PostView.naver?blogId=skyshin0304&logNo=222079393598&redirect=Dlog&widgetTypeCall=true&directAccess=false)
- [Wsl 사용시 WslRegisterDistribution Failed With Error: 0x800701bc 해결하기.](https://blog.dalso.org/article/wslregisterdistribution-failed-with-error)
- [WSL & WSL2 설치와 VSCode 연동하기 - gidskql6671](https://velog.io/@gidskql6671/WSL-WSL2-%EC%84%A4%EC%B9%98-VSCode-%EC%97%B0%EB%8F%99)









