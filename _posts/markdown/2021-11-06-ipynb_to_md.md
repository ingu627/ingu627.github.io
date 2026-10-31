---
layout: single
title: "주피터(.ipynb) 마크다운(.md)로 전환하는 방법"
categories: md
tags: [jupyter, md]
sidebar_main: false

last_modified_at: 2026-10-09
---

1. ipynb 파일이 존재하는 폴더로 갑니다.  
2. 해당 폴더에 마우스 커서를 대고 `shift + 오른쪽버튼`을 누릅니다. 
3. `여기에 PowerShell 창 열기`를 클릭합니다.

![image](/assets/images/legacy/74890b3a94.webp)

4. `jupyter nbconvert --to markdown [변환할 노트북 파일명].ipynb` 를 치면 md파일이 새롭게 생성됩니다.

![image](/assets/images/legacy/7abd776d19.webp)
