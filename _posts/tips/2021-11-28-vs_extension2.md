---
layout: single
title: "생산성 향상을 위한 VSCode extensions 12개 추천"
excerpt: "Ponicode, Dracula Official, Debugger for Chrome, Bracket Pair Colorizer 2, Code Spell Checker, Code Runner, Live Server 등" 
categories: tips
tags: [tip, vscode, extension, Dracula, Debugger, Bracket, Live, Markdown, 확장]
toc: True
toc_sticky: True
sidebar_main: false

last_modified_at: 2026-10-11
---

> 이 글은 2021년 당시 작성된 VSCode 확장 프로그램 설치/사용 기록이다. 최신 버전에서는 명령이 다를 수 있다.

VSCode는 확장 프로그램(extension)을 설치해 개발 생산성을 높일 수 있다. 이 글은 Ponicode, Dracula Official, Code Runner, Live Server, Markdown All in One 등 12개 확장 프로그램과 폰트 설정을 정리한다.

VSCode는 에디터 UI를 담당하는 렌더러 프로세스와 확장 프로그램이 실행되는 확장 호스트(Extension Host) 프로세스를 분리하여 운영한다.[^vscode-sandbox] 이를 통해 특정 확장의 연산 부하가 전체 에디터 인터페이스를 멈추지 않도록 격리한다.


## 0. Font 설정

- `File - Preferences - Settings - Font Size 설정` 
  - 에디터 기본 글꼴 크기(`editor.fontSize`)는 작업 환경과 모니터 해상도에 맞춰 조절할 수 있으며, 예시에서는 17pt로 지정하였다.

![image](/assets/images/legacy/64ba6dab42.webp)


## 1. Ponicode

![image](/assets/images/legacy/277160e7e0.webp)

![ponicode](https://user-images.githubusercontent.com/78655692/143844241-d6083525-233e-4477-9dab-350068f0f383.gif)

- `Ponicode`는 단위 테스트를 생성하는 AI 기반 확장 팩이다.[^ponicode] 머신러닝 기반 테스트 시나리오와 그래픽 인터페이스를 통해 단위 테스트를 생성, 시각화 및 실행할 수 있도록 지원한다.
- 테스트 우선순위가 높은 함수를 시각화하여 테스트 작성 노력을 집중할 수 있도록 돕는다.
- 단위 테스트 파일 작성의 반복 작업을 처리하며, 테스트 시나리오에 필요한 입력 데이터 케이스 생성을 제안한다.


## 2. Dracula Official

![image](/assets/images/legacy/aa593ab654.webp)

![image](/assets/images/legacy/204228b7fa.webp)

- 어두운 배경(다크 테마) 기반의 코드 하이라이팅 테마이다.[^dracula] 대비도가 높은 색상 팔레트를 적용해 구문 요소를 명확히 구분할 수 있도록 돕는다.


## 3. Debugger for Chrome

![image](/assets/images/legacy/265422068c.webp)

![debugger](https://user-images.githubusercontent.com/78655692/143773391-2b0e4121-2916-4f20-8de2-24af6426d488.gif)

- Google Chrome 브라우저와 VSCode 에디터를 연동하여 자바스크립트 소스 코드를 에디터 내에서 중단점(breakpoint) 설정, 변수 조사, 호출 스택(call stack) 추적 등의 기능으로 디버깅할 수 있도록 지원하는 확장 프로그램이다.[^chrome-debug]
- 최신 VSCode(v1.46 이상)에서는 JavaScript Debugger(`js-debug`)가 에디터에 내장됨에 따라 별도 확장 설치 없이도 `pwa-chrome` 환경 디버깅을 직접 수행할 수 있도록 통합되었다.[^js-debug]


## ~~4. Bracket Pair Colorizer 2~~

![image](/assets/images/legacy/9afb2fd971.webp)

![image](/assets/images/legacy/9a4e4efd59.webp)

- 중첩 괄호(브래킷)를 쌍별로 다른 색상으로 표시하여 코드 블록 식별을 돕던 확장 프로그램이다.[^bracket-pair-repo]
- 해당 기능은 VSCode 1.60부터 에디터 코어 기능으로 정식 내장되어 확장 설치 없이 설정만으로 활성화할 수 있다.[^bracket-pair-blog] 코어 내장 구현은 네이티브 괄호 쌍 트리 구조를 사용하여 확장 대비 최대 10,000배 빠른 파싱 성능을 제공한다.
- `Ctrl + Shift + P`를 누른 후 `Preferences: Open User Settings (JSON)`을 선택하여 `settings.json`에 다음과 같이 입력한다.

```json
{
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": "active",
  "bracket-pair-colorizer-2.colors": [
    "Gold",
    "Orchid",
    "LightSkyBlue"
  ]
}
```


## 4. Prettier

![image](/assets/images/legacy/dcbc26a1c2.webp)

- 코드 서식 지정기(Code Formatter)로, 정해진 스타일 규칙에 맞춰 들여쓰기, 줄 바꿈, 따옴표 스타일 등을 자동으로 정렬한다.[^prettier]
- `.prettierrc` 설정 파일을 통해 프로젝트 및 팀 단위의 일관된 코드 포맷팅 규칙을 적용할 수 있다.


## 5. Code Spell Checker

![image](/assets/images/legacy/a4b43b3681.webp)

![spell](https://user-images.githubusercontent.com/78655692/143773766-2bdfa30c-c7fe-47c0-a2f3-0c0c1b88e900.gif)


- `camelCase`, `snake_case` 등 소스 코드 식별자 명명 규칙을 지원하는 맞춤법 검사기이다.[^code-spell-checker]
- 오탐(false positive) 비율을 낮추면서 주석 및 변수명에 포함된 영문 오탈자를 검출하도록 지원한다.

## 6. Code Runner

![image](/assets/images/legacy/3a8865a840.webp)

![runner](https://user-images.githubusercontent.com/78655692/143773977-61fe38b5-e1e5-44db-b2f9-4b79020a5817.gif)

![image](/assets/images/legacy/3b6b2015ca.webp)

- C, C++, Java, JavaScript, Python 등 다양한 언어의 코드 파일이나 선택된 코드 스니펫을 에디터 내에서 즉시 실행하고 출력 창에서 결과를 확인할 수 있는 확장 프로그램이다.[^code-runner]
- **코드를 실행하는 방법:**
  - 단축키: `Ctrl + Alt + N` (macOS: `Control + Option + N`)
  - F1 키를 누른 뒤 `Run Code` 입력 및 선택
  - 텍스트 편집기 마우스 우클릭 후 컨텍스트 메뉴에서 `Run Code` 선택
  - 에디터 우측 상단 재생(Run Code) 버튼 클릭
  - 파일 탐색기의 컨텍스트 메뉴에서 `Run Code` 선택
- **실행 중인 코드를 중지하는 방법:**
  - 단축키: `Ctrl + Alt + M` (macOS: `Control + Option + M`)
  - F1 키를 누른 뒤 `Stop Code Run` 입력 및 선택
  - 에디터 우측 상단 `Stop Code Run` 버튼 클릭
  - 출력 창을 마우스 우클릭 후 컨텍스트 메뉴에서 `Stop Code Run` 선택


## 7. Color Picker

![image](/assets/images/legacy/229c9eb4ba.webp)

![picker](https://user-images.githubusercontent.com/78655692/143774128-9fca5027-7b9f-4591-8625-83dadf5190d4.gif)

- CSS, SCSS, HTML 등의 스타일 코드에서 색상 코드를 직관적인 GUI 색상 팔레트로 선택하고 RGB, HEX, HSL 형식으로 변환할 수 있는 도구이다.[^color-picker] (최신 VSCode는 기본 에디터 상에서도 색상 데코레이터 및 피커를 자체 지원한다).


## 8. Live Server

![image](/assets/images/legacy/624599cdcb.webp)

![server](https://user-images.githubusercontent.com/78655692/143774272-9be36ed1-5e81-44d2-bcfd-86157fc9409f.gif)

- 정적 웹 페이지(HTML, CSS, JS) 개발 시 로컬 개발 서버를 구동하고, 파일 변경 사항을 감지하여 브라우저를 자동으로 새로고침(Live Reload)하는 확장 프로그램이다.[^live-server] 상태 표시줄의 'Go Live' 버튼을 클릭하거나 5500번 포트를 기본으로 로컬 개발 서버를 실행한다.


## 9. Live Share

![image](/assets/images/legacy/465176dfc9.webp)

- 여러 개발자가 동일한 코드베이스에서 실시간으로 함께 편집하고 디버깅할 수 있는 Microsoft 공식 협업 도구이다.[^live-share] 저장소를 복제하거나 개발 환경을 따로 동기화하지 않고도 세션 링크를 통해 협업자의 커서 위치 공유, 터미널 및 로컬 서버 포트 공유가 가능하다.


## 10. Material Icon Theme

![image](/assets/images/legacy/cd3deb2a5f.webp)

![icon](https://user-images.githubusercontent.com/78655692/143774559-9dc16674-244e-4eb7-9514-0b3e272d52f9.gif)

- 파일 탐색기의 파일 확장자 및 폴더 구조에 머티리얼 디자인(Material Design) 기반의 아이콘을 부여하여 파일 유형 식별성을 높여주는 아이콘 테마이다.[^material-icons]


## 11. Markdown Preview Enhanced

![image](/assets/images/legacy/5c330271bc.webp)

![image](/assets/images/legacy/7cc68e61a5.webp)

- 수식(MathJax/KaTeX), 다이어그램(Mermaid, PlantUML), PDF 내보내기 등 확장 기능을 지원하는 마크다운 실시간 미리보기 확장 프로그램이다.[^mpe] 에디터 우측 분할 화면에서 렌더링 결과를 즉시 확인할 수 있다.


## 12. Markdown All in One

![image](/assets/images/legacy/f3f78a1a93.webp)

![markdown](https://user-images.githubusercontent.com/78655692/143774740-0477c510-8d4a-4fd0-8b9d-b4eac21a19c1.gif)

- 마크다운 문서 작성을 위한 단축키, 목차(Table of Contents, TOC) 자동 생성 및 갱신, 목록 서식 자동 서식 지정, 수학 수식 입력 지원 등을 제공하는 종합 마크다운 유틸리티이다.[^markdown-all-in-one]

## 확장 프로그램 운용 시 주의사항 및 트레이드오프

VSCode 확장을 다수 설치해 운용할 때는 다음과 같은 시스템 제약과 성능 영향을 고려해야 한다.

- **확장 호스트(Extension Host) 프로세스 부하:** 모든 확장은 단일 Node.js 기반 확장 호스트 프로세스 내에서 공유 실행되므로, 무거운 확장이 다수 활성화되면 CPU 사용량과 메모리 점유율이 증가하여 자동 완성 및 언어 서버 응답 속도가 저하될 수 있다.[^vscode-perf]
- **서식 지정기(Formatter) 충돌:** Prettier와 언어별 기본 포맷터가 동시에 활성화된 경우 파일 저장 시 서식 지정 충돌이 발생할 수 있으므로, `settings.json`에서 언어별 기본 포맷터(`editor.defaultFormatter`)를 명시적으로 지정해야 한다.
- **폐기 및 코어 내장 전환 관리:** Debugger for Chrome이나 Bracket Pair Colorizer 2처럼 확장이 폐기되고 VSCode 코어 기능으로 내장되는 경우가 있으므로, 정기적으로 확장 관리자(`@deprecated`)를 점검해 불필요한 레거시 확장을 제거해야 한다.
- **원격 개발 및 웹 환경 제약:** Codespaces, Remote-SSH, 또는 VS Code for the Web(`vscode.dev`) 환경에서는 로컬 Node.js API에 의존하는 일부 확장의 실행이 제한되거나 별도의 원격 호스트 설치가 요구된다.[^vscode-remote]

## References

[^vscode-sandbox]: Visual Studio Code Engineering Blog, "Migrating VS Code to Process Sandboxing" (2022). <https://code.visualstudio.com/blogs/2022/11/28/vscode-sandbox>
[^ponicode]: CircleCI (formerly Ponicode), "AI-powered unit testing for JavaScript and TypeScript", Visual Studio Code Marketplace. <https://marketplace.visualstudio.com/items?itemName=ponicode.ponicode>
[^dracula]: Dracula Theme for Visual Studio Code. <https://marketplace.visualstudio.com/items?itemName=dracula-theme.theme-dracula>
[^chrome-debug]: Visual Studio Code Marketplace, "Debugger for Chrome (Deprecated)". <https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome>
[^js-debug]: Visual Studio Code Docs, "JavaScript debugging in VS Code". <https://code.visualstudio.com/docs/nodejs/nodejs-debugging>
[^bracket-pair-blog]: Visual Studio Code Blog, "Bracket Pair Colorization 10,000x Faster" (2021). <https://code.visualstudio.com/blogs/2021/09/29/bracket-pair-colorization>
[^bracket-pair-repo]: CoenraadS, "Bracket Pair Colorizer 2 GitHub Repository". <https://github.com/CoenraadS/Bracket-Pair-Colorizer-2#readme>
[^prettier]: Visual Studio Code Marketplace, "Prettier - Code formatter". <https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode>
[^code-spell-checker]: Visual Studio Code Marketplace, "Code Spell Checker". <https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker>
[^code-runner]: Visual Studio Code Marketplace, "Code Runner". <https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner>
[^color-picker]: Visual Studio Code Marketplace, "Color Picker". <https://marketplace.visualstudio.com/items?itemName=anseki.vscode-color>
[^live-server]: Visual Studio Code Marketplace, "Live Server". <https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer>
[^live-share]: Visual Studio Code Docs, "Collaborate with Live Share". <https://code.visualstudio.com/docs/editor/live-share>
[^material-icons]: Visual Studio Code Marketplace, "Material Icon Theme". <https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme>
[^mpe]: Markdown Preview Enhanced Docs. <https://shd101wyy.github.io/markdown-preview-enhanced/>
[^markdown-all-in-one]: Visual Studio Code Marketplace, "Markdown All in One". <https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one>
[^vscode-perf]: Visual Studio Code Wiki, "Performance Issues and CPU Profiling". <https://github.com/microsoft/vscode/wiki/Performance-Issues>
[^vscode-remote]: Visual Studio Code Docs, "Remote Development Overview". <https://code.visualstudio.com/docs/remote/remote-overview>
