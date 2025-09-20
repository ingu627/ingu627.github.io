---
layout: single
title: 'Bootstrap(부트스트랩) 기초 실습'
excerpt: '본 글은 패스트캠퍼스의 한 번에 끝내는 파이썬 웹 개발 초격차 패키지 강의를 개인 실습하여 정리했습니다. 문법 및 github 예제로 실습' 
categories: web
tags: [web, frontend, concept, bootstrap, 정리, 웹, 기초, 예제]
toc: true
sidebar_main: false

date: 2021-11-03
last_modified_at: 2025-09-20
---

본 글은 패스트캠퍼스의 "한 번에 끝내는 파이썬 웹 개발 초격차 패키지" 강의를 개인 실습하여 따라 한 것입니다. <br>
기타 완성용 파일을 원하시는 분은 [https://github.com/ParkYoungWoong/bootstrap5-github-landing](https://github.com/ParkYoungWoong/bootstrap5-github-landing) 링크로 가주시면 됩니다. 
{: .notice--info}

<br>
<br>

## 부트스트랩

### 앞서 복습.

![image](https://user-images.githubusercontent.com/78655692/140278709-914156c3-7c51-4d64-b268-95ba3b4c3acd.png)

<script src="https://gist.github.com/ingu627/d41f5a78b102c075de18876944b56fa7.js"></script>

<script src="https://gist.github.com/ingu627/f79bb58cb7ff219727facf7b384ca33c.js"></script>

- `<div class="btn">Click!</div>` : btn은 button의 약어이다.
- `display:` : 요소가 화면에 보여지는 특성
- `cursor: pointer;` : 눌러보는 커서로 바꿈

<br>

## 프로젝트 생성

![](https://user-images.githubusercontent.com/78655692/140280656-15652562-c7d9-4d73-8354-4f1fa620a8b9.png)

<script src="https://gist.github.com/ingu627/39e468eafc42544ac926b84756129d76.js"></script>

- 하나의 요소에는 여러 개의 class를 넣을 수 있다.
- 부트스트랩을 도입하면 이미 구현이 되어져 있는 UI를 프로젝트에 가져올 수 있다.
- Layout - Containers

<br>

## Layout - Columns

![image](https://user-images.githubusercontent.com/78655692/140313418-0debb790-517f-4cae-8f2b-193c72d2e1a6.png)

<script src="https://gist.github.com/ingu627/09243f1afd3104f755e3047e9e35e536.js"></script>

<script src="https://gist.github.com/ingu627/640f33779b136811924800527310b398.js"></script>

-`<div class="row"></div>` : row는 하나의 줄을 의미 (줄 = 행)
  - 하나의 행당 12개의 열이 기본적으로 차지.
  - `class="col-3 col-md-7 box"` : 총 3개의 class를 가지고 있다.
    - `md` 는 medium의 약자. viewport의 가로가 medium이 될 때

![image](https://user-images.githubusercontent.com/78655692/140315174-94b0440e-4a84-4a33-af25-d32487a7b756.png)

<br>

## Forms

![image](https://user-images.githubusercontent.com/78655692/140316778-86e7fe9c-e473-483b-8a5a-587a12af286a.png)

<script src="https://gist.github.com/ingu627/011a2494605e05991c2492e93ab7c49c.js"></script>


- `placeholder` : 칸에 힌트를 주는
- `value` : 미리 입력된 값
- `disabled` : 비활성화 처리

<br>

### sass (scss) : css 전처리기

- css가 처리되기 전에 처리할 수 있는 또 다른 스타일 작업할 수 있는 도구

<br>

## Components

- 버튼을 만들 때는 `div`보다 `button` 태그로 만든다.
- Offcanvas : 숨겨져 있는 네비게이션을 쓸 때 사용
- toggle : 껐다 켰다를 반복함

<br>

## Utilities

- `d-none` == `display: none`
- 어디까지나 유틸은 편리성을 위한 작성된 것.

<br>

## github 예제로 실습 

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

<br>

## Header

- `<a calss="logo" href="#">` : \#은 경로가 아직 준비되지 않았다를 의미
- `<ul class="nav"></ul>` : nav = navigation (내부 경로)

- `align-items: center` : 수직 정렬을 가운데로
- `padding-top:` : 요소의 위쪽 내부 여백
- `padding-bottom:` : 요소의 아래쪽 내부 여백 
- `me-2` : margin end(=right) (bootstrap)
- `text-light`가 li 태그에 있는데 a태그에 이미 색깔이 부여되어 있으므로 적용 X -> 바로 a태그에 붙여준다.

<br>

### CSS를 건드리지 않아도 부트스트랩으로 테마 적용할 수 있다.

![image](https://user-images.githubusercontent.com/78655692/141642353-47390834-4d47-4e63-962b-35cb0551c53c.png)

- `flex-grow` : 증가 너비의 비율

<br>

![image](https://user-images.githubusercontent.com/78655692/141642363-3ee2b630-bfb9-48a0-8a71-2ad62d70a036.png)


- `d-flex` : 수평으로 맞춰줌

<br>

![image](https://user-images.githubusercontent.com/78655692/141642471-54d02816-c196-4c30-a35f-f59e56c030ce.png)

- `flex-shrink-0` : 감소 너비의 비율 (default = 1)

<br>

![image](https://user-images.githubusercontent.com/78655692/141642573-8c42c4b9-48cc-461b-99e3-b371dda5da83.png)

- `text-decoration-none` : 텍스트에 줄을 넣는 속성인데 제거하겠다. 
- `me-2` : 오른쪽 여백 2 추가

<br>

![image](https://user-images.githubusercontent.com/78655692/141642729-9d188e88-c939-4aba-ade5-1f7a2584870d.png)

<script src="https://gist.github.com/ingu627/d8075e859dc8d20b226790fcba10bcb5.js"></script>

- `rgba()` : red, green, blue, alpha

<br>

## Hero Contents

![image](https://user-images.githubusercontent.com/78655692/141643249-46d9ff5e-8356-47e8-b7ee-c2039fcba0f9.png)

<script src="https://gist.github.com/ingu627/be2a2640cf1f01b6448bc5e49e9535b6.js"></script>

- `form` : 양식
- `input`은 크기가 옆으로 늘어난다. 그에 반해 `button`은 딱 글자 크기만큼만!

<br>

![image](https://user-images.githubusercontent.com/78655692/141644525-b6633dfa-a516-4436-8e39-35d1e81f7993.png)

<script src="https://gist.github.com/ingu627/bbc3702405b807ee9f13019cb52f53f0.js"></script>

- `padding-top` : 여백 위쪽 지정
- `padding-down` : 여백 아래쪽 지정 
- `letter-spacing` : 글자와 글자 사이의 간격을 의미 (-는 서로 좁혀진다.)
- `<p class="text-white-50">` : 50%의 색이 빠져있는 화이트 (html)

<br>

![image](https://user-images.githubusercontent.com/78655692/141644575-06c27fbd-370b-4960-a170-bc67ca577689.png)

- `<div class="col-7">` : 12개의 column 중에 7칸 차지 (row 안에서)

<br>

![image](https://user-images.githubusercontent.com/78655692/141644630-b2afea26-7c62-4d57-a5a1-3f27200b9986.png)

<script src="https://gist.github.com/ingu627/2b6455bf969b5aaf87c203289682ec7d.js"></script>

- `<div class="d-grid">` : 최대한 늘어날 수 있게

<br>

![image](https://user-images.githubusercontent.com/78655692/141644961-5504d875-147f-4a17-98d2-eaa5db95b63b.png)

<script src="https://gist.github.com/ingu627/131ade5c1a11da871366a4418f94314b.js"></script>

- `position: relative;` : 기준이 되는 요소 (css)
- `position: absolute;` : 배치가 될 요소 (css)
- `transform: translate();` : 요소의 위치를 변환시켜주는 함수 (이동)
- `overflow: hidden;` : 컨테이너 영역 안에 만큼만 보이게 (넘친 건 숨긴다.)

<br>

![image](https://user-images.githubusercontent.com/78655692/141645168-e499f8a4-4047-419f-99cc-1ebcd9668d6e.png)

<script src="https://gist.github.com/ingu627/b1919db200ff891542cd792aaf2f001b.js"></script>

<script src="https://gist.github.com/ingu627/e90b83eadcd31ae83e8121ca517a0b15.js"></script>

- `glow` : 번짐 효과

<br>

![image](https://user-images.githubusercontent.com/78655692/141645489-d259d264-7424-4de2-a989-4dc9126a11a4.png)

<script src="https://gist.github.com/ingu627/fce6f770564dd3056709d3b3cbe708d0.js"></script>

<script src="https://gist.github.com/ingu627/711c7452c2d4ee35a0001b98d6561152.js"></script>

## youtube

![image](https://user-images.githubusercontent.com/78655692/141646524-1397cfac-8d10-4fd1-958c-352ae60dac2e.png)

<script src="https://gist.github.com/ingu627/2deb61d1634aae5c2f334deedd941905.js"></script>

<script src="https://gist.github.com/ingu627/7b7def99dad66d367dc914f8f905c3ae.js"></script>

- 유튜브의 영상 비율은 기본적으로 16:9이다. 
- `border-radius:` : 모서리를 둥글게 깎아 준다. 
- css에서 부모요소는 위쪽에 작성한다.

<br>

![image](https://user-images.githubusercontent.com/78655692/141646962-333fa385-7b36-4812-929d-a6a58f5b9eef.png)

<script src="https://gist.github.com/ingu627/010cce714a0d210e47fb62ed30e188c0.js"></script>

<script src="https://gist.github.com/ingu627/7ab7e83d662eb5b0cb7bf74faf4059ad.js"></script>

<br>

## Features

![image](https://user-images.githubusercontent.com/78655692/141679415-1178326c-3cd3-4f48-9d95-4e8ab1c3b7fb.png)

<script src="https://gist.github.com/ingu627/26265d0a098ffeef17f4ad481d7b20ab.js"></script>

<script src="https://gist.github.com/ingu627/9e292618b6e893f0a2168089416bc387.js"></script>

- `<div class="col-3">` : col이 3칸을 차지 (기본적으로 row는 12칸 차지)

<br>

![image](https://user-images.githubusercontent.com/78655692/141679708-b8c22501-6ffa-451d-9b5e-80bd2c7907e5.png)

<script src="https://gist.github.com/ingu627/b6eeedcb03665f738c2c020c4df34b24.js"></script>

<script src="https://gist.github.com/ingu627/bc71c2e25215150faf10ccf20a18cad6.js"></script>

- `strong` : 글씨를 두껍게 만들어 준다. 
- `padding: 30px 60px;` : 패딩은 내부여백을 뜻함. 첫번째 30px은 위아래. 60px은 좌우를 동시에 지정

![image](https://user-images.githubusercontent.com/78655692/141680045-83fc653c-b3d5-4539-a02b-9be164fb1de1.png)

<script src="https://gist.github.com/ingu627/bcb6a511fe853bd120a13cbf3d94665a.js"></script>

<script src="https://gist.github.com/ingu627/cfebe72d19cce05e626d076adabf025c.js"></script>

<br>

## Google Maps

![image](https://user-images.githubusercontent.com/78655692/141680920-75ab22af-57f2-498e-aec0-ce2bfd6f574d.png)

<script src="https://gist.github.com/ingu627/544aa99d5f10163b30b6bcfd1a915956.js"></script>

- `#` : css의 id 선택자는 #으로 시작
  - `<div id="map"></div>`
- id는 고유한 번호(중복X). css에서는 `#map`으로만 명시해줘도 된다. (조상요소 선택할 필요 없다.)
- **자바스크립트의 `?`는 쿼리스트링으로 주소부분에 데이터를 태워서 전송할 수 있다는 의미.** (`key`는 파라미터)
  - `&`는 다음 파라미터를 입력 (callback)
- `const`로 변수를 만듦 (하나의 객체 데이터 할당)
- `new` : 생성자 함수

<br>

## Footer

![image](https://user-images.githubusercontent.com/78655692/141681542-e1ec1b58-ce9d-49e9-b65e-d97509f51af3.png)

<script src="https://gist.github.com/ingu627/094f11f2098780c751319ad5bc40f3b4.js"></script>

<script src="https://gist.github.com/ingu627/e06fdfa97c7b98262e3677ce629bedad.js"></script>

- `footer`는 구분하는 태그
- `webp` 파일 확장명은 구글에서 만든 거임
- `container` : 어떤 특정한 영역을 화면에 가운데로 정렬시켜주는 역할
- `width: 100%;` : css에서 illustration에서 가지고 있는 이미지는 커서 container보다 넘쳐서 출력이 됐었는데 그 이미지의 container 너비 만큼 (100%) 지정
- `transform: scale(-1,1);` : 이미지의 크기를 x, y축으로 지정. -1은 x축기준으로 반전 효과 
- `opacity` : 투명도

<br>

![image](https://user-images.githubusercontent.com/78655692/141681854-3f8e27b5-3d03-4c11-953a-cdba8caea1a3.png)

<script src="https://gist.github.com/ingu627/00f27c92fb7734abc2f74fe07c46e907.js"></script>

<script src="https://gist.github.com/ingu627/4b076a74d7804dfc4b618d88da4c8aaf.js"></script>

- `class="list-unstyled"` : ul과 li 스타일이 제거된다. 
- `a` 태그는 기본적으로 파란색 글씨로 적용되어 있음
- `class="text-decoration-none"` : 밑줄을 제거
  - `text-decoration: none;` : css에서 이 코드를 적용하면 관련 요소 다 적용됨.
- `transition` : 몇 초에 걸쳐서 자연스럽게 변화할 것인가 (css) (전후 상태)
- `d-flex` : 수평 정렬 (html)

<br>

![image](https://user-images.githubusercontent.com/78655692/141682207-c0b0c62b-e458-4a45-92bf-df25350f9559.png)

`display: flex;`
`justify-content: center;` 적용 후

![image](https://user-images.githubusercontent.com/78655692/141682222-685f29e8-f45f-431a-8c76-9c6000499d3c.png)

![image](https://user-images.githubusercontent.com/78655692/141682335-7b31e0ed-e170-467b-812a-993d4f06599e.png)

<script src="https://gist.github.com/ingu627/5bd7446269b01e871d59d7a52741799c.js"></script>

<script src="https://gist.github.com/ingu627/65a12d125d3897a9280475247b76c7b8.js"></script>

- `margin-right: 20px;` : 우측으로 여백이 요소사이에 20만큼 각각 생성
- `href` : 클릭하면 링크따라 이동 
- `margin: 0;` : 마진 초기화 

<br>

## 반응형 - @media

- 예제

```css
@media (max-width: 600px) {
  .box {
    width: 200px;
    height: 200px;
    background-color: orange;
  }
}
```

- `max-width`: 뷰포트의 가로 너비 (~~px 이하일 때)
- `min-width` : ~이상 일 때
- `all` : 모든

<br>

## 반응형 - Offcavnas

<script src="https://gist.github.com/ingu627/f1a58e8466352d19e5710efc78539c54.js"></script>

- `display` : 화면에 보여지는 특성
- `flex-grow: 1;` : 차지하는 영역이 최대한 늘어남
- `ms-2` : 외부여백이 2만큼 증가 

<br>

![image](https://user-images.githubusercontent.com/78655692/141683895-2059ffc3-6f50-4e6f-ac4a-14e4dcb49381.png)

- `mb-4` : margin-bottom 4를 채워줌 
- `col-lg-7` : 뷰포트가 Large Size 보다 크면 컬럼을 7개 사용한다.
  - `<div class="col-lg-7 col-12">` : 뷰포트가 large size보다 크지 않을 때 12개를 쓴다.

<br>

## 최종 완성본

- [https://github.com/ingu627/bootstrap5-github-landing](https://github.com/ingu627/bootstrap5-github-landing)


<br>
<br>

## Reference

- [fastcampus](https://fastcampus.co.kr/dev_online_pyweb)
- [bootstrap 공식링크](https://getbootstrap.com/)