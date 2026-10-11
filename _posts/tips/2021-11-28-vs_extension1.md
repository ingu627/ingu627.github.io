---
layout: single
title: "빅데이터 분석가를 위한 VSCode extensions 14개 추천"
excerpt : "파이썬, 주피터를 vscode에서 더 전문적이고 생산적으로 활용하는 방법(+자동 완성)"
categories: tips
tags: [tip, vscode, extension, 파이썬, 주피터, Tabnine, Pylance, IntelliCode, MagicPython, Jupyter, Settings Sync, GitLens, GitGraph, 자동완성, 확장]
toc: True
toc_sticky: True
sidebar_main: false

last_modified_at: 2026-10-11
---

많은 글이 확장을 추천하지만, 이 글은 딥러닝과 데이터 분석 코드를 VSCode에서 작성할 때 생산성을 높여주는 확장 프로그램을 중심으로 정리한다.

> 이 글은 2021년 당시 VSCode 기준으로 작성된 extension 추천 기록이다. 최신 버전에서는 확장의 동작이나 사용법이 다를 수 있다.

이 글은 딥러닝 파이썬 코드를 VSCode에서 작성할 때 생산성을 높여주는 extension 14개를 추천한다. 자동 완성·언어 지원(Tabnine, Pylance, python snippets, IntelliCode, MagicPython), Jupyter, Git 관련(GitLens, Git Graph, Git Extension Pack), 그리고 편의 기능(Better Comments, Rainbow CSV, PyTorch Snippets) 등을 소개한다.

VSCode에서 파이썬 및 데이터 분석 확장을 원활하게 활용하려면 에디터와 언어 서버(Language Server)가 분리되어 동작하는 구조를 이해해두면 도움이 된다. Pylance와 같은 도구는 에디터 본체와 독립된 프로세스에서 실행되며 언어 서버 프로토콜(LSP)을 통해 구문 분석과 타입 검사 결과를 주고받는다.[^lsp_doc]


## 1. Tabnine

![image](https://user-images.githubusercontent.com/78655692/143766991-a6441e63-3725-4cbc-9aeb-37ceaa92efaf.png)

![tabnine](https://user-images.githubusercontent.com/78655692/143767185-26b2646a-a734-4029-b47f-3bc00855f61e.gif)

- Tabnine은 머신러닝 및 딥러닝 모델을 기반으로 프로젝트의 기존 코드 패턴과 문맥을 분석해 인라인 코드 완성을 제공하는 확장이다.[^tabnine_doc] 사전 학습된 오픈소스 코드 패턴과 로컬 프로젝트 컨텍스트를 결합하여 다음 토큰 및 전체 라인 완성을 제안한다.
- 대학생은 `Tabnine pro`를 1년 동안 무료로 사용할 수 있다. 학생 인증 및 세부 플랜 조건은 공식 홈페이지를 참고한다.

## 2. Pylance

![image](https://user-images.githubusercontent.com/78655692/143767482-c095f3fb-6920-4c1a-9e86-2922e5c174d2.png)

![pylance](https://user-images.githubusercontent.com/78655692/143767592-a3ed1164-3076-4d15-b6b4-ea83c025d576.gif)

- Pylance는 Microsoft의 공식 Python 언어 서버 확장이다.[^pylance_doc] 내부적으로 Microsoft의 오픈소스 정적 타입 검사기인 Pyright 엔진을 기반으로 동작한다. 풍부한 타입 어노테이션 정보와 정적 분석을 통해 자동 완성(IntelliSense), 매개변수 정보 안내, 정의로 이동(Go to Definition), 코드 리팩터링 기능을 지원한다.
- settings에 들어가서 `Python > Analysis: Type Checking Mode`를 basic 또는 strict로 변경해 정적 타입 오류를 실시간으로 진단한다.
- 만약 이전에 다른 언어 서버로 세팅되어 있다면 `settings.json`에서 `"python.languageServer": "Pylance"`를 설정한다. 사용자 `settings.json`은 VSCode 명령어 팔레트(`Ctrl+Shift+P` 또는 `Cmd+Shift+P`)에서 `Preferences: Open User Settings (JSON)`을 실행하여 편집할 수 있다 (Windows 기본 경로: `%APPDATA%\Code\User\settings.json`).

## 3. python snippets

![image](https://user-images.githubusercontent.com/78655692/143767786-eda7dd16-dcea-43a0-9a5b-a89c1513cd30.png)

![python_snippets](https://user-images.githubusercontent.com/78655692/143767760-1a3b4040-0ca5-474a-9e65-518ce2d7f6f5.gif)

- python snippets는 자주 사용하는 파이썬 표준 문법(조건문, 반복문, 함수 및 클래스 선언, 예외 처리 등)의 템플릿 코드 조각을 모아둔 확장이다. 접두어 키워드를 입력하고 `Tab` 키를 누르면 보일러플레이트 코드가 자동으로 삽입된다.

## 4. Python Extension Pack

![image](https://user-images.githubusercontent.com/78655692/143767877-b6bb793c-8a04-4755-8c33-861eb7fea162.png)

![image](https://user-images.githubusercontent.com/78655692/143767907-b891b6ca-91f4-4d2e-af11-0ff11899a9a8.png)

- **포함된 주요 확장 번들**:
  - `Python` (Microsoft 공식 언어 지원)
  - `Visual Studio IntelliCode` (AI 보조 완성)
  - `Python Docstring Generator` (docstring 자동 생성)
  - `Python Indent` (파이썬 들여쓰기 자동 보정)
  - `Jinja` 및 `Django` (템플릿 및 웹 프레임워크 지원)

## 5. Visual Studio IntelliCode

![image](https://user-images.githubusercontent.com/78655692/143767934-6c0f0fb9-5721-447e-b4dc-97d7a91f3972.png)

![intellicode](https://user-images.githubusercontent.com/78655692/143767977-dba36a84-db11-41b5-b78b-0f05edde6fec.gif)

- Visual Studio IntelliCode 확장은 GitHub 오픈소스 저장소 수천 개에서 학습된 코드 패턴을 바탕으로 자동 완성 목록 상단에 가장 추천하는 항목을 별표(`★`)로 우선 배치해주는 도구이다.[^intellicode_doc] 현재 작성 중인 코드의 변수 타입과 컨텍스트에 맞춰 빈도 높은 메서드와 속성을 예측한다.
- 딥러닝 지원 활성화를 위해 settings에서 관련 옵션을 활성화(enabled)할 수 있다.

![image](https://user-images.githubusercontent.com/78655692/143768026-8fa8a240-5b4a-4c0b-9d90-c914fb18af99.png)

## 6. Visual Studio IntelliCode API Usage Examples

![image](https://user-images.githubusercontent.com/78655692/143768051-27ab622a-c777-45ca-a964-044c68db786e.png)

![examples](https://user-images.githubusercontent.com/78655692/143768095-a674da80-cf66-4999-b6cf-285998ac2ff4.gif)

- 라이브러리나 API 함수를 사용할 때 공개 GitHub 저장소에서 실제로 작성된 실제 호출 예제 코드를 에디터 내에서 검색해 보여준다. 함수 매개변수 설정법이나 전후 호출 흐름을 웹 브라우저 검색 없이 인라인으로 확인할 수 있다.

## 7. MagicPython

![image](https://user-images.githubusercontent.com/78655692/143768171-4eaf53f3-ff3d-4dff-a3e4-a88fc7fe9688.png)

![image](https://user-images.githubusercontent.com/78655692/143768184-58a83670-217d-40e6-b410-5a1841e75987.png)

- MagicPython은 GitHub과 Atom의 기본 Python 구문 강조 문법으로 채택되었던 TextMate 기반 문법 확장이다. Python 3의 타입 어노테이션(Type Annotations), f-string 포맷팅, 복잡한 정규식, 비동기 키워드(`async`/`await`)를 정확한 토큰으로 분리하여 정밀한 구문 강조(syntax highlighting)를 지원한다.

## 8. Jupyter

![image](https://user-images.githubusercontent.com/78655692/143768813-0d93b404-1f8e-419e-a7bc-c935d79bb481.png)

![image](https://user-images.githubusercontent.com/78655692/143768837-c3a18aaa-8542-4d6c-94d3-590d975513b5.png)

- Microsoft 공식 Jupyter 확장으로, VSCode 내부에서 `.ipynb` 노트북 파일을 웹 브라우저 없이 열고 대화형으로 실행할 수 있게 한다.[^jupyter_doc]
- 현재 활성화된 Python 가상환경(venv, conda)의 커널을 자동 감지하며, 셀 단위 실행(`Shift + Enter`), 인터랙티브 창(Interactive Window), 변수 탐색기(Variable Explorer), 판다스 데이터프레임 뷰어 기능을 지원한다.

## 9. Settings Sync

![image](https://user-images.githubusercontent.com/78655692/143767355-8495d260-f750-400d-952c-5a857d03bd3d.png)

![image](https://user-images.githubusercontent.com/78655692/143767408-2eeeba7e-3988-4375-983c-030a85fa1fa5.png)

- Settings Sync는 여러 기기에서 작업할 때 사용 가능한 작업 공간 설정을 동기화해 준다.
- 원격으로 독립되어 있는 컴퓨터끼리 인터넷을 통해 확장 프로그램, 키 바인딩, 테마, UI 설정을 동기화할 수 있다.
- 단축키: `Shift + Alt + U`로 현재 설정을 업로드하고, `Shift + Alt + D`로 업로드된 설정을 다운로드한다.
- **참고 (내장 기능 안내)**: 과거에는 GitHub Gist 토큰 기반의 Shan Khan 외부 확장을 사용했으나, VSCode v1.48부터 Microsoft/GitHub 계정 기반의 공식 설정 동기화(Settings Sync) 기능이 에디터 본체에 내장되었다.[^settings_sync_doc] 따라서 현재는 외부 확장을 별도로 설치하지 않고 좌측 하단 톱니바퀴 아이콘의 '설정 동기화 켜기(Turn on Settings Sync...)'를 사용하는 것이 권장된다.

## 9. GitLens

![image](https://user-images.githubusercontent.com/78655692/143768425-6367afed-f8d4-44af-bf82-c166f2ca45b2.png)

![gitlens](https://user-images.githubusercontent.com/78655692/143768524-c02ad8e7-1f7d-4041-8bdc-987f3a43f4d0.gif)

- GitLens는 소스 코드의 특정 라인을 클릭했을 때 해당 라인의 최근 커밋 정보, 작성자, 커밋 메시지(git blame)를 코드 줄 위에 인라인으로 보여주는 확장이다.
- Git 주석 및 코드 렌즈를 통해 코드 작성자를 시각화하고, Git 리포지토리를 원활하게 탐색하며, 커밋 간 리비전 비교(Revision Navigation/Diff) 및 히스토리 추적 기능을 에디터 내부에서 통합 제공한다.[^gitlens_doc]

## 10. Git Graph

![image](https://user-images.githubusercontent.com/78655692/143768669-c4afcbc2-e957-479e-9d63-46a786003096.png)

![gitGraph](https://user-images.githubusercontent.com/78655692/143768685-f9d64f88-0628-412f-9139-05587ba45af5.gif)

- Git 저장소의 브랜치 분기 및 병합 히스토리를 직관적인 노드 그래프로 시각화해주는 확장이다.
- 그래프 상에서 커밋을 클릭하여 변경 사항(diff)을 조회하고, 브랜치 생성, 체크아웃, 리베이스(rebase), 체리픽(cherry-pick), 태그 지정 등의 작업을 GUI 환경에서 간편하게 실행할 수 있다.

## 11. Git Extension Pack

![image](https://user-images.githubusercontent.com/78655692/143768754-386f0497-4c18-400a-b313-7bf7be5a33f3.png)

![image](https://user-images.githubusercontent.com/78655692/143768769-bf983f6b-c3e3-4182-894d-1c05dbd5bce8.png)

- **포함된 주요 Git 확장 번들**:
  - `Git History (git log)` (커밋 로그 조회)
  - `Project Manager` (다중 프로젝트 전환 관리)
  - `GitLens` (라인별 blame 및 코드 변경 이력)
  - `gitignore` (`.gitignore` 규칙 작성 지원)

## 12. Better Comments

![image](https://user-images.githubusercontent.com/78655692/143768903-7653cb41-ccd8-44cb-847d-112aa37fa355.png)

![image](https://user-images.githubusercontent.com/78655692/143768924-faefbce4-54f3-4256-9e4c-f577b768d490.png)

- 코드 주석(comment)의 접두어 기호에 따라 색상을 구분해 가독성을 높여주는 확장이다.
- 느낌표(`!`)는 중요 경고, 물음표(`?`)는 질문 및 확인 사항, `TODO`는 작업 예정 항목, 별표(`*`)는 핵심 강조 사항으로 스타일을 자동 분기하여 협업 및 코드 검토 시 유용하다.

## 13. Rainbow CSV

![image](https://user-images.githubusercontent.com/78655692/146767188-205fa52c-cdfc-4a9d-9cee-da19e85821cf.png)

![image](https://user-images.githubusercontent.com/78655692/146767240-87082a97-e1c4-4088-bf9d-68957b8c92a3.png)

![image](https://user-images.githubusercontent.com/78655692/146767366-aeee43ac-ab34-4bbc-9f56-476064025640.png)

- CSV 및 TSV 형식의 표 형태 데이터 파일을 열었을 때 각 열(column)을 무지개 색상으로 구분하여 강조해주는 확장이다.
- 커서가 위치한 열의 이름과 번호를 하단 상태 표시줄에 안내하며, 내장된 RBQL(Rainbow Query Language)을 통해 SQL 형태의 문법으로 CSV 데이터에 대한 SELECT, WHERE 필터링 쿼리를 에디터 내부에서 바로 실행할 수 있다.

## 14. PyTorch Snippets

![image](https://user-images.githubusercontent.com/78655692/152934058-d82ad55a-c214-46e0-af22-e4a643cdbfa1.png)

- **PyTorch Snippets**은 VSCode에서 PyTorch 및 Torchvision 라이브러리를 사용할 때 자주 사용되는 신경망 모듈(`nn.Module`), 데이터로더(`DataLoader`), 학습 루프 템플릿을 빠르게 삽입할 수 있도록 돕는 확장이다.[^pytorch_doc]
- 코드창에 `pytorch`를 입력하고 `Tab` 키를 누르면 아래 그림처럼 템플릿이 자동 완성된다.

![image](https://user-images.githubusercontent.com/78655692/152934361-7ab888e7-4250-4df2-bcee-a1f9225d9cc7.png)


## 한계 및 실무 주의사항

- **언어 서버와 확장 간 충돌**: `MagicPython`과 같은 구문 강조 확장은 최신 VSCode 내장 Python 시맨틱 하이라이팅(Semantic Highlighting) 또는 `Pylance` 언어 서버와 토큰 파싱 규칙이 충돌하여 색상 표시에 왜곡이 생길 수 있다. 또한 여러 AI 완성 확장(Tabnine, IntelliCode, Copilot)을 동시에 켜둘 경우 인라인 추천 팝업이 중첩되고 지연 시간(latency)이 증가할 수 있다.
- **메모리 점유 및 인덱싱 오버헤드**: Pylance(Pyright)는 대형 파이썬 라이브러리(PyTorch, TensorFlow, Pandas)를 인덱싱할 때 상당한 양의 RAM을 점유할 수 있다. 대규모 저장소에서는 `.vscode/settings.json`에서 `python.analysis.indexing: false`나 `python.analysis.exclude` 설정을 통해 불필요한 디렉터리 스캔을 제외해야 한다.
- **Jupyter 커널 및 원격 환경 의존성**: VSCode의 Jupyter 확장은 실행 대상 환경에 `ipykernel` 패키지가 사전에 설치되어 있어야 정상 동작한다. 특히 GPU 서버 환경에서 Remote - SSH 확장을 사용할 경우 에디터 확장이 로컬 머신과 원격 서버(Extension Host)에 나뉘어 설치되므로, 원격 서버의 Python 가상환경 커널을 정확히 선택해야 하며 대용량 셀 출력은 렌더러 메모리 한계로 인해 에디터 응답 지연을 초래할 수 있다.
- **보안 및 라이선스 정책**: Tabnine과 같은 서드파티 AI 확장은 엔터프라이즈 환경에서 외부 서버로의 코드 전송 정책을 검토해야 하며, 구버전 Shan Khan `Settings Sync`는 보안상 토큰 유출 위험이 있으므로 VSCode 공식 계정 동기화로 전환하는 것이 권장된다.

## References

[^lsp_doc]: Visual Studio Code Documentation, "Language Server Extension Guide", <https://code.visualstudio.com/api/language-extensions/language-server-extension-guide>
[^tabnine_doc]: Tabnine Documentation, "AI Code Completion Overview", <https://docs.tabnine.com/>
[^pylance_doc]: Visual Studio Code Marketplace, "Pylance Extension for Visual Studio Code", <https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance>
[^intellicode_doc]: Microsoft Learn, "Visual Studio IntelliCode Overview", <https://learn.microsoft.com/en-us/visualstudio/intellicode/overview>
[^jupyter_doc]: Visual Studio Code Documentation, "Jupyter Notebooks in VS Code", <https://code.visualstudio.com/docs/datascience/jupyter-notebooks>
[^settings_sync_doc]: Visual Studio Code Documentation, "Settings Sync in Visual Studio Code", <https://code.visualstudio.com/docs/editor/settings-sync>
[^gitlens_doc]: Visual Studio Code Marketplace, "GitLens — Git supercharged", <https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens>
[^pytorch_doc]: PyTorch Foundation, "PyTorch Documentation and Tutorials", <https://pytorch.org/docs/stable/index.html>

