---
layout: single
title: "vscode 설정 셋팅 초기화하는 방법"
excerpt: "vsocde를 하도 지웠다 설치를 반복해서 글로 남긴다. 2가지 단계만 거치면 초기화가 가능하다. (단순 vscode를 삭제한다 해도 local pc에 설정들이 남아있다.)"
categories: tips
tags: [tip, vscode, 초기화, 윈도우, 설치]
toc: True
sidebar_main: false

last_modified_at: 2026-10-09
---

vsocde를 하도 지웠다 설치를 반복해서 글로 남깁니다. 2가지 단계만 거치면 초기화가 가능합니다. (단순 vscode를 삭제한다 해도 local pc에 설정들이 남아있습니다.)

vscode를 삭제하고 다시 설치해도 로컬 PC에 설정 파일이 남아 초기화되지 않는 경우가 있다. 이 글은 vscode 설정을 완전히 초기화하고 다시 설치하는 순서를 정리한다.

*1.* `C:\User\user\.vscode` 폴더를 삭제한다.

![image](https://user-images.githubusercontent.com/78655692/146772823-6cec0b09-4022-484c-9cd8-802beefa527d.png)

*2.* `C:\User\user\AppData\Roaming\Code` 폴더를 모두 지운다.

![image](https://user-images.githubusercontent.com/78655692/146773025-2808144d-1025-42c0-8dad-ff980a0dbe5b.png)

*3.* 제어판에 가서 vscode 프로그램을 삭제한다.

*4.* 다시 vscode를 os 환경에 맞게 설치 해준다. https://code.visualstudio.com/download