---
layout: single
title: "Jekyll 블로그: 포스트 작성법"
excerpt: YAML을 이용하여 글의 제목, 날짜, 카테고리, 태그, 레이아웃 등을 정의해봅니다.
categories: git_blog
tags: [git, blog, post]

toc: true
toc_sticky: true
toc_label: 짧지만 써보는 목차

last_modified_at: 2022-01-21

sidebar_main: false

header:
    overlay_image: /assets/images/Almond_Blossom_1280.webp
    over_filter: 0.4
    caption: "꽃피는 아몬드 나무"
    actions:
        - label: "More info"
        - url: "https://www.vangoghmuseum.nl/en/collection/s0176V1962"
---

## 예시

<script src="https://gist.github.com/ingu627/93a69be54393c57f58eedc9b33024876.js"></script>

<br>
<br>

## Front-matter

- **Front-matter**는 파일 시작 시 작성하는 YAML 또는 JSON 구역이다.
- 게시물에 대한 환경 설정을 이 곳에서 한다.
- Front-matter가 끝나는 부분은 YAML의 경우 세 개의 대시(-) 로, JSON의 경우 세 개의 세미콜론(;)을 넣어서 구분한다.
- **YAML**(YAML Front Matter)은 오픈 소스 프로젝트에서 많이 사용하는 구조화된 데이터 형식이다.
- YFM은 이 YAML을 사용해서 글의 제목, 날짜, 카테고리, 태그, 레이아웃 등을 정의할 수 있다.

<br>
<br>

### 환경설정 및 기본 값

|설정| 설명|
|---|---|
|layout|레이아웃|
|title|타이틀|
|excerpt| 텍스트의 첫번째 문구로 나타내줌|
|date|발행일 - 파일이 생성된 날짜|
|tags| 해당 게시물의 세부 정보를 키워드로 설명|
|categories|제목이나 유형으로 분류할 때 사용|
|toc|tabe of contents의 약자.<br>H1~H6의 헤더 목록을 표시해주는 기능
|toc_sticky|TOC를 사이드바에 고정하는 역할|
|toc_label|페이지 주요 목차 <br>(default : On this page)|
|last_modified_at| 마지막으로 수정된 날짜를 의미|
|canonical_url|페이지를 특정 url로 지정할 때 |
|classes: wide| 페이지를 넓게 쓰고자 할때|

**sidebar_main: false**는 기본문법에서 수정된 버전입니다.
{: .notice--danger}

<br>

```markdown
---
layout: single
title: "Git Blog - POST 글 작성하는 방법"
excerpt: YAML을 이용하여 글의 제목, 날짜, 카테고리, 태그, 레이아웃 등을 정의해봅니다.
categories: git_blog
date: 2021-11-19
tag: [git, blog, post]

toc: true
toc_sticky: true
toc_label: 짧지만 써보는 목차

last_modified_at: 2021-11-19

sidebar_main: false
# canonical_url:
# classes: wide
---
```

<br>
<br>

### header

- 헤더는 `single page`의 제목을 이미지와 함께 제시하여 보여줄 때 사용한다.

|설정|설명|
|---|---|
|overlay_image|이미지의 주소나 위치를 설정
|overlay_filter|필터 부분에 흐릿한 정도나 색깔을 입힘
|caption|그림에 대한 설명을 넣음
|actions|실행부분 삽입

<br>

- 위 글에 설정한 예시이다.

```markdown
---
header:
    overlay_image: /assets/images/Almond_Blossom_1280.webp
    over_filter: 0.4
    caption: "꽃피는 아몬드 나무"
    actions:
        - label: "More info"
        - url: "https://www.vangoghmuseum.nl/en/collection/s0176V1962"
---
```




<br>
<br>
<br>
<br>

## References

- [Minimal Mistakes - Layouts ](https://mmistakes.github.io/minimal-mistakes/docs/layouts/)
- [빠르고 간단하고 강력한 블로그 프레임워크 - Front-matter](https://hexo.io/ko/docs/front-matter.html)
- [jekyll 공식사이트- Front Matter](https://jekyllrb.com/docs/front-matter/)
- [WithMaster Ver 2.0 - 깃허브 post 글 작성하기](https://withmaster.com/%EB%B8%94%EB%A1%9C%EA%B7%B8/posts/)