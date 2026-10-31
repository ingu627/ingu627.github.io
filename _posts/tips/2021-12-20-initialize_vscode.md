---
layout: single
title: "vscode 설정 셋팅 초기화하는 방법"
excerpt: "vsocde를 하도 지웠다 설치를 반복해서 글로 남긴다. 2가지 단계만 거치면 초기화가 가능하다. (단순 vscode를 삭제한다 해도 local pc에 설정들이 남아있다.)"
categories: tips
tags: [tip, vscode, 초기화, 윈도우, 설치]
toc: True
sidebar_main: false

last_modified_at: 2026-10-11
---

Visual Studio Code(VS Code)를 제어판에서 삭제한 뒤 다시 설치해도 이전 설정과 확장 프로그램이 그대로 복원되어 초기화되지 않는 현상이 발생한다. 이는 VS Code의 프로그램 본체(실행 파일)와 사용자 데이터 디렉터리가 서로 다른 경로에 분리되어 관리되기 때문이다[^1]. 단순 프로그램 삭제는 실행 파일만 제거할 뿐 로컬에 저장된 사용자 설정 파일과 확장 프로그램 캐시를 보존하도록 설계되어 있다. 이 글은 Windows 환경을 기준으로 VS Code의 사용자 구성 파일과 확장 데이터를 정리하고 클린 재설치(Clean Reinstall)를 수행하는 절차를 정리한다.

## 1. VS Code 프로세스 및 데이터 분리 구조

VS Code는 일렉트론(Electron) 기반의 멀티 프로세스 모델로 설계되어 있으며, UI 렌더링을 담당하는 렌더러 프로세스(Renderer Process)와 확장 기능을 실행하는 확장 호스트(Extension Host Process), 시스템 전역 서비스를 담당하는 메인 프로세스(Main Process) 및 공유 프로세스(Shared Process)가 상호 격리되어 구동된다. 이러한 아키텍처 특성으로 인해 프로그램 바이너리와 사용자 설정 데이터, 확장 프로그램 저장소가 물리적으로 분리되어 관리된다.


## 2. Windows 환경 초기화 및 재설치 단계

공식 문서 권장 절차에 따라 사용자 확장 디렉터리와 로컬 구성 폴더를 삭제한 후 프로그램을 재설치한다[^1].

*1.* `C:\Users\<사용자명>\.vscode` 폴더를 삭제한다.

실제 사용자 계정 경로인 `%USERPROFILE%\.vscode` 폴더를 삭제한다. 이 폴더에는 마켓플레이스에서 내려받은 확장 프로그램(Extensions) 파일들이 저장되어 있다. 또한 최신 환경에 따라 `%USERPROFILE%\.vscode-shared` 폴더가 존재하는 경우 함께 삭제한다.

![image](/assets/images/legacy/2de942868f.webp)

*2.* `C:\Users\<사용자명>\AppData\Roaming\Code` 폴더를 모두 지운다.

실행 창(`Win + R`)에서 `%APPDATA%\Code`를 입력하거나 직접 이동하여 해당 폴더를 삭제한다. 이 폴더에는 사용자의 `settings.json`, `keybindings.json`, UI 레이아웃 상태, 작업 영역 캐시, LevelDB 데이터베이스 등 핵심 구성 정보가 저장되어 있다.

![image](/assets/images/legacy/4544cfa946.webp)

*3.* 제어판에 가서 vscode 프로그램을 삭제한다.

Windows '설정 > 앱 > 설치된 앱' 또는 '제어판 > 프로그램 및 기능'으로 이동하여 `Microsoft Visual Studio Code`를 찾아 제거(Uninstall)한다. 사용자 설치 관리자(User Installer) 기준 `%LOCALAPPDATA%\Programs\Microsoft VS Code` 경로의 실행 파일 바이너리가 삭제된다.

*4.* 다시 vscode를 os 환경에 맞게 설치해준다.

공식 웹사이트에서 운영체제에 맞는 최신 설치 관리자를 내려받아 재설치한다. [VS Code 공식 다운로드](https://code.visualstudio.com/download)

### 타 운영체제(macOS / Linux) 경로 비교

- **macOS**:
  - 사용자 데이터: `~/Library/Application Support/Code`
  - 확장 프로그램: `~/.vscode` 및 `~/.vscode-shared`
  - 프로그램 삭제: `/Applications/Visual Studio Code.app` 휴지통 이동
- **Linux(Ubuntu / Debian)**:
  - 사용자 데이터: `~/.config/Code`
  - 확장 프로그램: `~/.vscode` 및 `~/.vscode-shared`
  - 패키지 삭제: `sudo apt-get purge code`

## 3. 한계 및 주의사항

1. **로컬 커스텀 설정의 영구 유실**: `settings.json`, `keybindings.json`, 사용자 정의 코드 스니펫, 로컬 작업 영역 히스토리가 백업 없이 영구 삭제되므로, 초기화 전 필요한 설정 파일은 수동 백업하거나 버전 관리 저장소에 보관해야 한다.
2. **Settings Sync(설정 동기화) 재적용 문제**: GitHub 또는 Microsoft 계정 기반 설정 동기화(Settings Sync) 기능이 켜져 있는 상태라면, 로컬 디렉터리를 모두 삭제한 후 재설치하여 다시 로그인하는 순간 클라우드에 백업되어 있던 이전 설정과 확장이 자동으로 다시 동기화된다. 클라우드에 저장된 설정까지 정리하려면 VS Code 내에서 `Settings Sync: Turn Off`를 실행하고 클라우드 데이터 삭제(`Clear Data in Cloud`)를 사전에 완료해야 한다[^2].
3. **원격 개발(Remote Development) 캐시 잔존**: 로컬의 `.vscode`와 `%APPDATA%\Code`를 삭제하더라도, SSH 호스트, WSL(Windows Subsystem for Linux), Dev Containers 등의 원격 환경에 설치된 VS Code Server(`~/.vscode-server`)의 설정과 확장 프로그램은 삭제되지 않는다. 원격 환경까지 초기화하려면 해당 원격 머신에서 `~/.vscode-server` 디렉터리를 직접 삭제해야 한다[^3].
4. **프로세스 잔존 시 파일 잠금 오류**: 백그라운드에서 VS Code 관련 프로세스(`Code.exe`, Electron Main Process, Extension Host 등)가 여전히 실행 중인 상태에서 폴더 삭제를 시도하면 파일 잠금(File Lock)으로 인해 일부 캐시 파일이 삭제되지 않을 수 있으므로, 작업 관리자에서 관련 프로세스가 종료되었는지 확인한 뒤 삭제를 진행해야 한다.

## 4. 참고 자료

[^1]: Microsoft, "Clean Uninstall," Visual Studio Code Documentation, <https://code.visualstudio.com/docs/setup/uninstall>.
[^2]: Microsoft, "Settings Sync," Visual Studio Code Documentation, <https://code.visualstudio.com/docs/editor/settings-sync>.
[^3]: Microsoft, "Remote Development Overview," Visual Studio Code Documentation, <https://code.visualstudio.com/docs/remote/remote-overview>.