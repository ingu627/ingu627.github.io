---
layout: single
title: "마크다운(Markdown): Jupyter(.ipynb) 파일을 .md로 변환"
categories: md
tags: [jupyter, md]
sidebar_main: false

last_modified_at: 2021-11-20
---

1. ipynb 파일이 존재하는 폴더로 갑니다.  
<br/>
2. 해당 폴더에 마우스 커서를 대고 `shift + 오른쪽버튼`을 누릅니다. 
<br/>
3. `여기에 PowerShell 창 열기`를 클릭합니다.

![image](https://user-images.githubusercontent.com/78655692/140633417-ec054b58-d64f-4a06-b77a-a1d062be3146.png)
<br/>
4. `jupyter nbconvert --to markdown [변환할 노트북 파일명].ipynb` 를 치면 md파일이 새롭게 생성됩니다.

![image](https://user-images.githubusercontent.com/78655692/140633456-ffe28a87-e1c9-4462-83ac-b048324a293f.png)
