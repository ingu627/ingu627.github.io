---
layout: single
title: "파이썬 한글 방지 깨짐 코드 [Jupyter, Colab]"
excerpt: "주피터 노트북 환경이나 코랩 환경에서 파이썬 한글이 깨질 때에 대한 해결책입니다."
categories: tips
tags: [tip, python, korea, colab, 한글 깨짐, 파이썬, 코랩, 주피터]
sidebar_main: false

last_modified_at: 2026-10-11
---

이 글은 Jupyter·Colab 환경에서 파이썬(matplotlib) 한글이 깨질 때 사용하는 설정 코드를 정리한다. 로컬 환경에서 폰트를 지정하는 코드와 Colab에서 나눔 폰트를 설치하는 방법을 다룬다.

Matplotlib의 기본 폰트 패밀리는 `sans-serif`(기본값 `DejaVu Sans`)로 설정되어 있어 한글 유니코드 영역(U+AC00~U+D7A3) 글리프가 포함되어 있지 않다[^1]. 따라서 제목(Title), 축 레이블(xlabel·ylabel), 눈금(Ticks), 범례(Legend) 등 텍스트 아티스트(Text Artist)를 렌더링할 때 `Glyph missing from current font` 경고와 함께 네모 박스(tofu) 형태로 글자가 깨진다[^1][^4]. 또한 기본 음수 부호 기호(`U+2212`, `−`) 역시 한글 폰트에서 지원하지 않는 경우가 많아 음수 눈금이 깨지므로 `axes.unicode_minus=False` 설정이 동반되어야 한다[^2].

![Matplotlib 시각화 구조와 텍스트 아티스트 구성 요소](/assets/images/tips/official-prevent_kor.webp)

*출처: [Matplotlib Documentation - Anatomy of a figure](https://matplotlib.org/stable/gallery/showcase/anatomy.html), Matplotlib License*

## 파이썬 한글 방지 깨짐 코드

로컬 환경(Windows·macOS·Linux)에서는 시스템에 설치된 폰트를 `font_manager`와 `rc` 설정으로 연결한다[^1].

```python
# 한글 깨짐 방지 코드
import matplotlib
from matplotlib import font_manager, rc
import platform

if platform.system() == "Windows":
    font_name = font_manager.FontProperties(fname="c:/Windows/Fonts/malgun.ttf").get_name()
    rc('font', family=font_name)
elif platform.system() == "Darwin":  # macOS
    rc('font', family='AppleGothic')
else:  # Linux
    rc('font', family='NanumGothic')

matplotlib.rcParams['axes.unicode_minus'] = False

import warnings
warnings.filterwarnings("ignore")
```

## Colab에서 사용 시

리눅스 기반인 Google Colab 환경에는 한글 폰트가 기본 설치되어 있지 않으므로 `fonts-nanum` 패키지를 설치하고 폰트 캐시를 갱신해야 한다[^3].

```python
!sudo apt-get install -y fonts-nanum
!sudo fc-cache -fv
!rm ~/.cache/matplotlib -rf
```

- 위 명령을 실행한 후 런타임을 재시작(Ctrl+M .)하고 아래 코드로 폰트를 지정한다.

```python
import matplotlib.pyplot as plt

plt.rc('font', family='NanumBarunGothic')
plt.rcParams['axes.unicode_minus'] = False
```

## 한계와 주의사항

- **운영체제 간 폰트 파일 경로 종속성**: Windows 전용 파일 경로(`c:/Windows/Fonts/malgun.ttf`)를 직접 지정하면 macOS나 Linux 환경에서 `FileNotFoundError`가 발생하므로, 운영체제별 분기(`platform.system()`)를 적용하거나 시스템 폰트 패밀리 이름을 등록해야 한다[^1].
- **Google Colab 세션 비영속성**: Colab 가상머신은 세션 단위로 초기화되므로 런타임 연결이 종료되거나 새로 할당될 때마다 `fonts-nanum` apt 패키지 설치와 폰트 캐시 삭제 명령을 다시 실행해야 한다[^3].
- **Matplotlib 폰트 캐시 미갱신 문제**: 시스템에 폰트를 새로 설치하더라도 Matplotlib 캐시 디렉터리(`~/.cache/matplotlib`) 내 `fontlist-*.json`이 갱신되지 않으면 기존 폰트 목록을 계속 참조하여 글리프 누락 경고가 지속될 수 있으므로 캐시 파일 삭제와 런타임 재시작이 필요하다[^1].

## References

[^1]: Matplotlib Development Team, "Configuring the font family", Matplotlib Documentation. <https://matplotlib.org/stable/tutorials/text/text_props.html>
[^2]: Matplotlib Development Team, "Customizing Matplotlib with style sheets and rcParams - axes.unicode_minus", Matplotlib Documentation. <https://matplotlib.org/stable/users/explain/customizing.html>
[^3]: Ubuntu Packages, "fonts-nanum - Nanum Korean fonts", Ubuntu 20.04 LTS Package Repository. <https://packages.ubuntu.com/focal/fonts-nanum>
[^4]: Matplotlib Development Team, "Anatomy of a figure", Matplotlib Documentation. <https://matplotlib.org/stable/gallery/showcase/anatomy.html>
