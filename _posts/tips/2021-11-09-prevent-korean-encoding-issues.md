---
layout: single
title: "Jupyter·Colab 한글 깨짐: 폰트 설정·unicode_minus 해결 코드"
excerpt: "맑은고딕 폰트 등록과 matplotlib 한글/음수 기호 깨짐을 동시에 해결하는 플랫폼별 설정 스니펫"
categories: tips
tags: [tip, python, korea, colab, 한글 깨짐, 파이썬, 코랩, 주피터]
sidebar_main: false

last_modified_at: 2022-03-30
redirect_from:
  - /tips/prevent_kor/
---

## 파이썬 한글 방지 깨짐 코드

```python
# 한글 깨짐 방지 코드
import matplotlib
from matplotlib import font_manager, rc
import platform
if platform.system()=="Windows":
    font_name=font_manager.FontProperties(fname="c:/Windows/Fonts/malgun.ttf").get_name()
    rc('font', family=font_name)
matplotlib.rcParams['axes.unicode_minus']=False

import warnings
warnings.filterwarnings("ignore")
```

<br>
<br>

## Colab에서 사용 시

```python
!sudo apt-get install -y fonts-nanum
!sudo fc-cache -fv
!rm ~/.cache/matplotlib -rf
```

- 실행 후 (런타임 재시작)

<br>

```python
plt.rc('font', family='NanumBarunGothic')
```

<br>
<br>
<br>
<br>
