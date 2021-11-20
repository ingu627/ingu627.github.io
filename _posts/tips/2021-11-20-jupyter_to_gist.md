---
layout: single
title: "Jupyter Notebook 파일 Git 블로그에 업로드하는 방법"
excerpt : "주피터 노트북 파일을 한번에 업로드하여 블로그 글에 보여주기"
categories: tips
tag : [tip, jupyter_notebook]
toc : True
sidebar_main: true

last_modified_at: 2021-11-20
---

## 개요

- 코드들을 하나 하나 gist에 넣다가 이것을 더 간편화하기 위해 알아보던 중 해당 사항을 알게 되었다.

## 방법 

### 1. Gist로 가기

- Gist 사이트로 간다.
- [https://gist.github.com/](https://gist.github.com/)

![image](https://user-images.githubusercontent.com/78655692/142720184-f8f4c58c-5828-479a-b31a-bd95bff8b769.png)

### 2. Spaces를 Tabs로 전환

- 주피터 파일은 각 코드가 탭으로 되어 있으므로 Tabs로 바꿔준다.

![image](https://user-images.githubusercontent.com/78655692/142720235-56498dbf-1283-4bdf-a325-fbc4f1ae0227.png)

### 3. 파일 드래그하기

![image](https://user-images.githubusercontent.com/78655692/142720300-66928521-acc4-4fa3-a0e6-834469e0d692.png)

- 드래그 후 `제목.ipynb`로 바꾼 후 `Create secret gist` 클릭 

![image](https://user-images.githubusercontent.com/78655692/142720413-36db5e62-e2d8-4517-a3e8-d227eda50af6.png)

### 4. 해당 코드 복사 후 .md 파일에 복사하기

![image](https://user-images.githubusercontent.com/78655692/142720445-ca0425aa-f0ed-4316-b86b-2cfb8cedb626.png)


### 5. 출력 확인 

<script src="https://gist.github.com/ingu627/21e05ca24c0e2187c1456cfaa2b7e1d2.js"></script>


## References 

- [<GITHUB> GIST를 사용하여 JUPYTER NOTEBOOK 포스팅하기](https://databuzz-team.github.io/2018/10/21/Github-Gist/)
