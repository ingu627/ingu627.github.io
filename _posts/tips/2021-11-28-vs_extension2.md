---
layout: single
title: "생산성 향상을 위한 VSCode extensions 12개 추천"
excerpt: "Ponicode, Dracula Official, Debugger for Chrome, Bracket Pair Colorizer 2, Code Spell Checker, Code Runner, Live Server 등" 
categories: tips
tag : [tip, vscode, extension, Dracula, Debugger, Bracket, Live, Markdown]
toc: True
toc_sticky: True
sidebar_main: true

last_modified_at: 2021-12-20
---

<br>

## 0. Font 설정

- `File - Preferences - Settings - Font Size 설정` 
  - 17이 가장 보기 좋은 것 같다. (개인 의견)

![image](https://user-images.githubusercontent.com/78655692/146759647-4fdf0582-2a93-41d0-a87f-5faf608ffa02.png)


## 1. Ponicode

![image](https://user-images.githubusercontent.com/78655692/143844059-f9135f3e-ccda-4265-805a-f16d818883fa.png)

![ponicode](https://user-images.githubusercontent.com/78655692/143844241-d6083525-233e-4477-9dab-350068f0f383.gif)

- `Ponicode`는 단위 테스트를 생성하는 AI 기반 확장 팩이다. ML 생성 테스트 시나리오와 직관적인 그래픽 인터페이스 덕분에 기능에 대한 단위 테스트를 빠르고 쉽게 생성, 시각화 및 실행할 수 있다.
- `Ponicode`는 가장 테스트해야 하는 기능을 보여주므로 코드의 견고성을 높이고 버그를 조기에 감지하기 위해 테스트 노력을 집중할 수 있다.
- `Ponicode`는 테스트 파일을 작성하여 단위 테스트의 반복적인 부분을 처리한다.
- 또한 테스트 시나리오에 대한 관련 입력을 생성하고 제안해준다.

<br>
<br>
<br>

## 2. Dracula Official

![image](https://user-images.githubusercontent.com/78655692/143773176-851ef945-03af-4601-b8f4-0b504300f9ea.png)

![image](https://user-images.githubusercontent.com/78655692/143773207-7c708b55-d7de-4a28-a8c6-8c21db0cd11f.png)

- 테마이다. 여러가지를 써봤지만 이 테마가 색깔도 아기자기하고 내게 가장 맞았다. 그리고 코드를 작성할 때 집중력을 높여준다.

<br>
<br>
<br>

## 3. Debugger for Chrome

![image](https://user-images.githubusercontent.com/78655692/143773291-acb02066-a6ce-40af-b4cf-0316eb8b4931.png)

![debugger](https://user-images.githubusercontent.com/78655692/143773391-2b0e4121-2916-4f20-8de2-24af6426d488.gif)

<br>
<br>
<br>

## ~~4. Bracket Pair Colorizer 2~~

![image](https://user-images.githubusercontent.com/78655692/143773517-1fdca65d-996f-441d-b393-6284c7f9e84b.png)

![image](https://user-images.githubusercontent.com/78655692/143773557-a0879754-5aa1-4d38-81e4-5701da372b94.png)

- ~~이걸 사용하면 일치하는 브래킷을 색상으로 식별할 수 있다. 괄호가 많아지면 복잡해지는 걸 방지해준다.~~
- 확장 프로그램이던 컬러 브라켓을 vscode에서 직접 지원하기 시작하였다.  
<https://github.com/CoenraadS/Bracket-Pair-Colorizer-2#readme>

- `ctrl + shift + p`를 누른 후 `settings`를 친 후 들어가서 (`settings.json`) 다음과 같이 입력해 준다.

```json
{
    "editor.bracketPairColorization.enabled": true,
    "editor.guides.bracketPairs":"active"
}
```

<br>
<br>
<br>

## 5. Code Spell Checker

![image](https://user-images.githubusercontent.com/78655692/143773697-94e6c2b8-a07d-4f69-b390-827c4dbbd78d.png)

![spell](https://user-images.githubusercontent.com/78655692/143773766-2bdfa30c-c7fe-47c0-a2f3-0c0c1b88e900.gif)

<br>
<br>
<br>

- camelCase 코드와 잘 작동하는 기본 맞춤법 검사기이다.
- 이 맞춤법 검사기의 목표는 잘못된 긍정의 수를 낮게 유지하면서 일반적인 맞춤법 오류를 잡아내는 데 도움이 된다.

## 6. Code Runner

![image](https://user-images.githubusercontent.com/78655692/143773932-8698fa57-1807-49c5-ac32-835cfcec9dbd.png)

![runner](https://user-images.githubusercontent.com/78655692/143773977-61fe38b5-e1e5-44db-b2f9-4b79020a5817.gif)

![image](https://user-images.githubusercontent.com/78655692/143774012-e23344d9-066f-4846-8d8e-a50c14c9f2ac.png)

- **코드를 실행하려면:** 
- 단축키 Ctrl+Alt+N 사용
- 또는 F1 키를 누른 다음 실행 코드를 선택/입력한다.
- 또는 텍스트 편집기를 마우스 오른쪽 버튼으로 클릭한 다음 편집기 컨텍스트 메뉴에서 코드 실행을 클릭한다.
- 또는 편집기 제목 메뉴에서 코드 실행 버튼 클릭
- 또는 파일 탐색기의 컨텍스트 메뉴에서 코드 실행 버튼을 클릭한다.
- **실행 중인 코드를 중지하려면:**
- 단축키 Ctrl+Alt+M 사용
- 또는 F1 키를 누른 다음 Stop Code Run을 선택/입력한다.
- 또는 에디터 타이틀 메뉴에서 Stop Code Run 버튼 클릭
- 또는 출력 채널을 마우스 오른쪽 버튼으로 클릭한 다음 컨텍스트 메뉴에서 코드 실행 중지를 클릭한다.

<br>
<br>
<br>

## 7. Color Picker

![image](https://user-images.githubusercontent.com/78655692/143774079-1510e48d-cc5c-4e8b-9366-8891f6d8bf2c.png)

![picker](https://user-images.githubusercontent.com/78655692/143774128-9fca5027-7b9f-4591-8625-83dadf5190d4.gif)

<br>
<br>
<br>

## 8. Live Server

![image](https://user-images.githubusercontent.com/78655692/143774202-6323e835-b26e-4948-9220-e52b6be9f9fb.png)

![server](https://user-images.githubusercontent.com/78655692/143774272-9be36ed1-5e81-44d2-bcfd-86157fc9409f.gif)

<br>
<br>
<br>

## 9. Live Share

![image](https://user-images.githubusercontent.com/78655692/143774395-5b39040e-d747-4f0f-8218-492e7adf2df3.png)

- 코드를 공동으로 수정, 작업할 수 있다. 팀플이나 협업한다면 굉장히 좋은 도구 중 하나이다. (거의 필수가 아닐까 싶다.)

<br>
<br>
<br>

## 10. Material Icon Theme

![image](https://user-images.githubusercontent.com/78655692/143774499-7aefbf87-308c-435b-aed6-2dae66afc260.png)

![icon](https://user-images.githubusercontent.com/78655692/143774559-9dc16674-244e-4eb7-9514-0b3e272d52f9.gif)

<br>
<br>
<br>

## 11. Markdown Preview Enhanced

![image](https://user-images.githubusercontent.com/78655692/143774616-fe7ec7b2-ee5a-4f97-ab28-d14d9898c3dd.png)

![image](https://user-images.githubusercontent.com/78655692/143774634-5f74fdcb-62e1-46ab-9940-a0f50af185ef.png)

- 마크다운을 vscode에서 실시간으로 보여준다. 블로그 작업할 때 매우 유용하다.

<br>
<br>
<br>

## 12. Markdown All in One

![image](https://user-images.githubusercontent.com/78655692/143774685-659f340e-a228-420d-a4b3-837de4dea3b9.png)

![markdown](https://user-images.githubusercontent.com/78655692/143774740-0477c510-8d4a-4fd0-8b9d-b4eac21a19c1.gif)
