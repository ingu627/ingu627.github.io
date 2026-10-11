---
layout: single
title: "Jupyter Notebook 단축키 모음"
excerpt : "주피터 노트북 환경에서 명령 모드와 편집 모드의 주요 단축키를 정리한다."
categories: tips
tags: [tip, shortcuts, 단축키, 주피터]
toc : True
sidebar_main: false

last_modified_at: 2026-10-11
---

## Jupyter 주요 단축키 모음

주피터 노트북(Jupyter Notebook)은 웹 브라우저 프론트엔드와 백엔드 서버(Tornado), 언어별 커널(IPython 등)이 분리된 클라이언트-서버 구조로 동작한다.[^1] 브라우저 인터페이스는 vi/Vim과 유사하게 셀 단위 명령을 수행하는 **명령 모드(Command Mode)**와 셀 내부 텍스트를 작성하는 **편집 모드(Edit Mode)**라는 두 가지 모달(modal) 상태를 제공한다.[^2] 키보드 단축키를 활용하면 마우스 조작 없이 두 모드를 오가며 셀을 생성·실행·변환할 수 있다.


## (1) 셀 선택 모드 (Command Mode)

- `[esc]` 또는 `[ctrl] + [m]`을 눌러 셀 좌측 인디케이터가 파란색으로 활성화된 명령 모드(Command Mode) 상태에서 해당 단축키를 누른다.

### 위로 셀 추가

- `[a]`

### 아래로 셀 추가

- `[b]`

### 선택 셀 삭제

- `[d][d]` (d를 두 번 누름)

### 선택 셀 잘라내기 (삭제로 써도 무방)

- `[x]`

### 선택 셀 복사하기 

- `[c]` 

### 선택 셀 아래에 붙여넣기

- `[v]`

### 선택 셀과 아래 셀과 합치기

- `[shift] + [m]`

### 실행결과 열기/닫기

- `[o]`

### Markdown으로 변경

- `[m]`

### Code로 변경

- `[y]`

### 파일 저장

- `[ctrl] + [s]` 또는 `[s]`


### 선택 셀의 코드 입력 모드로 돌아가기

- `[enter]`


## (2) 코드 입력 모드 (Edit Mode)

- `[enter]`를 눌러 셀 테두리와 텍스트 커서가 활성화된 편집 모드(Edit Mode) 상태에서 해당 단축키를 누른다.


### 선택 셀의 코드 전체 선택

- `[ctrl] + [a]`

### 선택 셀 내 실행 취소

- `[ctrl] + [z]`

### 선택 셀 내 다시 실행

- `[ctrl] + [y]`

### 커서 위치 라인 주석처리

- `[ctrl] + [/]`

### 선택 셀 코드 실행

- `[ctrl] + [enter]`

### 선택 셀 코드 실행 후 다음 Cell로 이동 (없으면 새로 추가)

- `[shift] + [enter]`

### 커서 위치에서 셀 둘로 나누기

- `[shift] + [ctrl] + [-]`

### 파일 저장

- `[ctrl] + [s]`

### 셀 선택 모드로 돌아가기

- `[esc]` 또는 `[ctrl] + [m]`


## (3) 한계와 실무 주의사항

- **OS 간 키 매핑 차이**: macOS 환경에서는 대부분의 `[ctrl]` 조합 대신 `[cmd]`(`⌘`) 키를 사용한다. 단, 명령 모드 전환 단축키인 `[ctrl] + [m]` 등 일부 주피터 자체 바인딩은 운영체제와 무관하게 `[ctrl]`을 유지하므로 사용하는 OS 환경의 키맵 설정을 확인해야 한다.[^3]
- **브라우저 예약 단축키 및 확장 프로그램 충돌**: 주피터 노트북은 웹 브라우저에서 실행되므로 `[ctrl] + [w]`(탭 닫기), `[ctrl] + [n]`(새 창 열기) 등 브라우저 기본 단축키와 우선순위 충돌이 발생할 수 있다. 또한 Vimium이나 키보드 탐색 계열 브라우저 확장 프로그램이 활성화되어 있으면 키 이벤트(`keydown`)가 가로채여 단축키가 반응하지 않을 수 있다.
- **셀 삭제 취소(`[z]`)의 유효 범위**: 편집 모드에서의 `[ctrl] + [z]`는 셀 내부 텍스트 수정만 되돌린다. 셀 자체를 실수로 삭제(`[d][d]`)했을 때는 반드시 명령 모드로 전환한 뒤 `[z]`를 눌러야 복구할 수 있으며, 브라우저 세션을 새로고침하면 삭제 내역이 초기화되므로 복구가 불가능하다.
- **Classic Notebook과 JupyterLab/Notebook 7 간 인터페이스 차이**: Classic Notebook(v6 이하)의 단축키 대부분이 JupyterLab 및 Notebook v7+에서도 호환되지만, 단축키 커스터마이징 메뉴(`Settings -> Keyboard Shortcuts`) 경로와 다중 커서 단축키 등 세부 동작에는 버전별 차이가 존재한다.[^4]

## References

- [Project Jupyter Documentation](https://docs.jupyter.org/)
- [Jupyter Notebook Documentation](https://jupyter-notebook.readthedocs.io/en/stable/)
- [JupyterLab Documentation](https://jupyterlab.readthedocs.io/en/stable/)

[^1]: [Project Jupyter Documentation - Architecture](https://docs.jupyter.org/en/latest/projects/architecture/content-architecture.html)
[^2]: [Jupyter Notebook Documentation - UI Components](https://jupyter-notebook.readthedocs.io/en/stable/ui_components.html)
[^3]: [Project Jupyter - JupyterLab Keyboard Shortcuts](https://jupyterlab.readthedocs.io/en/stable/user/shortcuts.html)
[^4]: [Jupyter Notebook Changelog & Migration Guide](https://jupyter-notebook.readthedocs.io/en/stable/changelog.html)