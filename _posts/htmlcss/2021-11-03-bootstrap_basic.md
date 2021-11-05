---
layout: single
title: 'Bootstrap(부트스트랩) 기초 총정리'
categories: web
tag : [web, frontend, concept, bootstrap]
toc: true
author_profile: false
sidebar:
    nav: "docs"
date: 2021-11-03
last_modified_at: 2021-11-03
---

# 부트스트랩

### 앞서 복습.

![image](https://user-images.githubusercontent.com/78655692/140278709-914156c3-7c51-4d64-b268-95ba3b4c3acd.png)

<script src="https://gist.github.com/ingu627/d41f5a78b102c075de18876944b56fa7.js"></script>

<script src="https://gist.github.com/ingu627/f79bb58cb7ff219727facf7b384ca33c.js"></script>

- `<div class="btn">Click!</div>` : btn은 button의 약어이다.
- `display:` : 요소가 화면에 보여지는 특성
- `cursor: pointer;` : 눌러보는 커서로 바꿈


## 프로젝트 생성

![](https://user-images.githubusercontent.com/78655692/140280656-15652562-c7d9-4d73-8354-4f1fa620a8b9.png)

<script src="https://gist.github.com/ingu627/39e468eafc42544ac926b84756129d76.js"></script>

- 하나의 요소에는 여러 개의 class를 넣을 수 있다.
- 부트스트랩을 도입하면 이미 구현이 되어져 있는 UI를 프로젝트에 가져올 수 있다.


- Layout - Containers

## Layout - Columns

![image](https://user-images.githubusercontent.com/78655692/140313418-0debb790-517f-4cae-8f2b-193c72d2e1a6.png)

<script src="https://gist.github.com/ingu627/09243f1afd3104f755e3047e9e35e536.js"></script>

<script src="https://gist.github.com/ingu627/640f33779b136811924800527310b398.js"></script>

-`<div class="row"></div>` : row는 하나의 줄을 의미 (줄 = 행)
  - 하나의 행당 12개의 열이 기본적으로 차지.
  - `class="col-3 col-md-7 box"` : 총 3개의 class를 가지고 있다.
    - `md` 는 medium의 약자. viewport의 가로가 medium이 될 때

![image](https://user-images.githubusercontent.com/78655692/140315174-94b0440e-4a84-4a33-af25-d32487a7b756.png)

## Forms

![image](https://user-images.githubusercontent.com/78655692/140316778-86e7fe9c-e473-483b-8a5a-587a12af286a.png)

<script src="https://gist.github.com/ingu627/011a2494605e05991c2492e93ab7c49c.js"></script>


- `placeholder` : 칸에 힌트를 주는
- `value` : 미리 입력된 값
- `disabled` : 비활성화 처리

#### sass (scss) : css 전처리기
- css가 처리되기 전에 처리할 수 있는 또 다른 스타일 작업할 수 있는 도구


## Components

- 버튼을 만들 때는 `div`보다 `button` 태그로 만든다.
- Offcanvas : 숨겨져 있는 네비게이션을 쓸 때 사용
- toggle : 껐다 켰다를 반복함

## Utilities
- `d-none` == `display: none`
- 어디까지나 유틸은 편리성을 위한 작성된 것.

# github 예제로 실습 

<script src="https://gist.github.com/ingu627/28c8a3cb0b9760dbaf1d14857c6fb100.js"></script>

- `favicon'` : favorite icon의 약어 (html)
- `rel` : relation의 약어 (html)
  - `rel:"icon"` : icon을 가져온다.
- `link` : 외부에서 특정한 문서를 가져올 때 (html)
- `stylesheet` : css파일을 가져올 때 쓰는 명칭 (html)

<script src="https://gist.github.com/ingu627/524a26d8c275e6f43f93042769f62f2a.js"></script>

- `font-family` : 글꼴 설정 (css)
  - `sans-serif` : 고딕체
- `font-weight` : 글꼴의 가중치(두께)


## Header

- `<a calss="logo" href="#">` : \#은 경로가 아직 준비되지 않았다를 의미
- `<ul class="nav"></ul>` : nav = navigation (내부 경로)

- `align-items: center` : 수직 정렬을 가운데로
- `padding-top:` : 요소의 위쪽 내부 여백
- `padding-bottom:` : 요소의 아래쪽 내부 여백 
- `me-2` : margin end(=right) (bootstrap)
- `text-light`가 li 태그에 있는데 a태그에 이미 색깔이 부여되어 있으므로 적용 X -> 바로 a태그에 붙여준다.
#### CSS를 건드리지 않아도 부트스트랩으로 테마 적용할 수 있다.

## Reference
[fastcampus](https://fastcampus.co.kr/dev_online_pyweb)
[bootstrap 공식링크](https://getbootstrap.com/)