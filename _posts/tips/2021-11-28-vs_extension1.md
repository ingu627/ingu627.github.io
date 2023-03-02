---
layout: single
title: "빅데이터 분석가를 위한 VSCode extensions 14개 추천"
excerpt : "파이썬, 주피터를 vscode에서 더 전문적이고 생산적으로 활용하는 방법(+자동 완성)"
categories: tips
tag : [tip, vscode, extension, 파이썬, 주피터, Tabnine, Pylance, IntelliCode, MagicPython, Jupyter, Settings Sync, GitLens, GitGraph, 자동완성, 확장]
toc: True
toc_sticky: True
sidebar_main: false

last_modified_at: 2022-03-20
---

많은 글들이 extension을 추천했지만 이글은 딥러닝 코드를 vscode에서 할 때 생산적으로 활용할 수 있는 extension들을 추천하고자 썼습니다.
{: .notice--danger}

## 1. Tabnine

![image](https://user-images.githubusercontent.com/78655692/143766991-a6441e63-3725-4cbc-9aeb-37ceaa92efaf.png)

![tabnine](https://user-images.githubusercontent.com/78655692/143767185-26b2646a-a734-4029-b47f-3bc00855f61e.gif)

- Tabnine은 더 빠른 코딩을 도와줄 올인원 AI 도우미이다. 현재까지 2백만 개 이상의 설치가 있는 이 플러그인은 머신 러닝으로 구동되며 프로젝트의 기존 패턴과 함께 작동한다. 예측 코드 자동 완성에서 Tabnine은 플러그인을 다운로드하고 사용하는 다른 모든 사람의 지식을 결합하여 사용한다.
- 대학생은 `Tabnine pro`를 1년동안 무료로 사용할 수 있다. 자세한 내용은 홈페이지를 참고하면 된다.

<br>
<br>
<br>

## 2. Pylance

![image](https://user-images.githubusercontent.com/78655692/143767482-c095f3fb-6920-4c1a-9e86-2922e5c174d2.png)

![pylance](https://user-images.githubusercontent.com/78655692/143767592-a3ed1164-3076-4d15-b6b4-ea83c025d576.gif)

- Python을 위한 빠르고 기능이 풍부한 언어 지원 Pylance는 Visual Studio Code에서 Python과 함께 작동하여 뛰어난 언어 지원을 제공하는 확장이다. 내부적으로 Pylance는 Microsoft의 정적 유형 검사 도구인 Pyright를 기반으로 한다. Pylance는 Pyright를 사용하여 풍부한 유형 정보로 Python IntelliSense 경험을 강화하여 더 나은 코드를 더 빠르게 작성할 수 있도록 지원한다.
- settings에 들어가서 `Python > Analysis: Type Checking Mode`를 basic으로 변경해 준다.

<br>

- **(2022.02.08) 만약 이전에 다른 언어로 세팅되어 있다면, settings.json에 들어가 "python.languageServer": "Default" or "Pylance"을 설정해 준다.**
  - settings.json은 `사용자\AppData\Roaming\Code\User\settings.json`에 위치해 있다.

<br>
<br>
<br>

## 3. python snippets

![image](https://user-images.githubusercontent.com/78655692/143767786-eda7dd16-dcea-43a0-9a5b-a89c1513cd30.png)

![python_snippets](https://user-images.githubusercontent.com/78655692/143767760-1a3b4040-0ca5-474a-9e65-518ce2d7f6f5.gif)

- python snippets는 파이썬 언어의 함수들을 효율적으로 쓸 수 있게 도와준다.

<br>
<br>
<br>

## 4. Python Extension Pack

![image](https://user-images.githubusercontent.com/78655692/143767877-b6bb793c-8a04-4755-8c33-861eb7fea162.png)

![image](https://user-images.githubusercontent.com/78655692/143767907-b891b6ca-91f4-4d2e-af11-0ff11899a9a8.png)

- **포함된 항목**
- `Python Docstring Generator`
- `Python`
- `Jinja`
- `Django`
- `Visual Studio IntelliCode`
- `Python Indent`

<br>
<br>
<br>

## 5. Visual Studio IntelliCode

![image](https://user-images.githubusercontent.com/78655692/143767934-6c0f0fb9-5721-447e-b4dc-97d7a91f3972.png)

![intellicode](https://user-images.githubusercontent.com/78655692/143767977-dba36a84-db11-41b5-b78b-0f05edde6fec.gif)

- Visual Studio IntelliCode 확장은 Python, TypeScript/JavaScript 및 Visual Studio Code의 Java 개발자를 위한 AI 지원 개발 기능을 제공하며, 기계 학습과 결합된 코드 컨텍스트 이해를 기반으로 하는 통찰력을 제공한다.
- 딥러닝을 지원하려면 settings에 가서 딥러닝 부분을 enabled 해준다.

![image](https://user-images.githubusercontent.com/78655692/143768026-8fa8a240-5b4a-4c0b-9d90-c914fb18af99.png)

<br>
<br>
<br>

## 6. Visual Studio IntelliCode API Usage Examples

![image](https://user-images.githubusercontent.com/78655692/143768051-27ab622a-c777-45ca-a964-044c68db786e.png)

![examples](https://user-images.githubusercontent.com/78655692/143768095-a674da80-cf66-4999-b6cf-285998ac2ff4.gif)

- example을 보여 준다.

<br>
<br>
<br>

## 7. MagicPython

![image](https://user-images.githubusercontent.com/78655692/143768171-4eaf53f3-ff3d-4dff-a3e4-a88fc7fe9688.png)

![image](https://user-images.githubusercontent.com/78655692/143768184-58a83670-217d-40e6-b410-5a1841e75987.png)

- MagicPython은 GitHub에서 Python을 강조 표시하는 데 사용된다. 유형 주석, f-문자열 및 정규식을 포함하여 모든 Python 3 구문 기능을 올바르게 강조 표시해 준다.

<br>
<br>
<br>

## 8. Jupyter

![image](https://user-images.githubusercontent.com/78655692/143768813-0d93b404-1f8e-419e-a7bc-c935d79bb481.png)

![image](https://user-images.githubusercontent.com/78655692/143768837-c3a18aaa-8542-4d6c-94d3-590d975513b5.png)

<br>
<br>
<br>

## 9. Settings Sync

![image](https://user-images.githubusercontent.com/78655692/143767355-8495d260-f750-400d-952c-5a857d03bd3d.png)

![image](https://user-images.githubusercontent.com/78655692/143767408-2eeeba7e-3988-4375-983c-030a85fa1fa5.png)

- Settings Sync은 여러 기기에서 작업할 때 사용 가능한 작업 공간을 설정해 준다.
- `sync` : 어떤 특정 컴퓨터에 있는 내용을 다른 컴퓨터에 올려서 한 쪽의 변경사항이 다른 쪽에 변경사항이 반영되도록 하는 것.
- 원격으로 독립되어있는 컴퓨터끼리 인터넷을 통해 sync할 수 있게 해 주는 것이다.
- `Shift + Alt + U`를 누르면 현재 설정이 업로드 된다.
- `Shift + Alt + D`를 누르면 업로드 된 설정을 다운로드한다.
- 자세한 사용법은 <https://developer-carmel.tistory.com/4> 참고

<br>

- vscode에서 자체적으로 동기화를 지원하기 시작했다. 설치 안해도 될 것 같다. (2021.12.20)

<br>
<br>
<br>

## 9. GitLens

![image](https://user-images.githubusercontent.com/78655692/143768425-6367afed-f8d4-44af-bf82-c166f2ca45b2.png)

![gitlens](https://user-images.githubusercontent.com/78655692/143768524-c02ad8e7-1f7d-4041-8bdc-987f3a43f4d0.gif)

- GitLens는 소스 코드에서 마우스로 클릭해서 라인을 볼 때 해당 라인에 커밋 시 작성한 코멘트를 볼 수 있게 해준다.
- Git 주석 및 코드 렌즈를 통해 코드 작성자를 한 눈에 시각화하고, Git 리포지토리를 원활하게 탐색 및 탐색하고, 강력한 비교 명령을 통해 귀중한 통찰력을 얻는 데 도움을 준다.

<br>
<br>
<br>

## 10. Git Graph

![image](https://user-images.githubusercontent.com/78655692/143768669-c4afcbc2-e957-479e-9d63-46a786003096.png)

![gitGraph](https://user-images.githubusercontent.com/78655692/143768685-f9d64f88-0628-412f-9139-05587ba45af5.gif)

- 저장소의 Git 그래프를 보고 그래프에서 Git 작업을 쉽게 수행할 수 있게 도와준다.

<br>
<br>
<br>

## 11. Git Extension Pack

![image](https://user-images.githubusercontent.com/78655692/143768754-386f0497-4c18-400a-b313-7bf7be5a33f3.png)

![image](https://user-images.githubusercontent.com/78655692/143768769-bf983f6b-c3e3-4182-894d-1c05dbd5bce8.png)

- **포함된 항목**
- `Git History (git log)`
- `Project Manager`
- `GitLens`
- `gitignore`

<br>
<br>
<br>

## 12. Better Comments

![image](https://user-images.githubusercontent.com/78655692/143768903-7653cb41-ccd8-44cb-847d-112aa37fa355.png)

![image](https://user-images.githubusercontent.com/78655692/143768924-faefbce4-54f3-4256-9e4c-f577b768d490.png)

- 주석에 색깔을 더해주는 프로그램이다. 코드를 작성할 때 의외로 많이 쓰게 된다. 

<br>
<br>
<br>

## 13. Rainbow CSV

![image](https://user-images.githubusercontent.com/78655692/146767188-205fa52c-cdfc-4a9d-9cee-da19e85821cf.png)

![image](https://user-images.githubusercontent.com/78655692/146767240-87082a97-e1c4-4088-bf9d-68957b8c92a3.png)

![image](https://user-images.githubusercontent.com/78655692/146767366-aeee43ac-ab34-4bbc-9f56-476064025640.png)


<br>
<br>
<br> 

## 14. PyTorch Snippets

![image](https://user-images.githubusercontent.com/78655692/152934058-d82ad55a-c214-46e0-af22-e4a643cdbfa1.png)

- **PyTorch Snippets**은 vscode에서 Pytorch안 torchvision을 사용할 때 빠른 작업을 할 수있도록 제공한다.

<br>

- 코드창에 pytorch를 치고 tab을 누르면 아래 그림처럼 나온다.

![image](https://user-images.githubusercontent.com/78655692/152934361-7ab888e7-4250-4df2-bcee-a1f9225d9cc7.png)



