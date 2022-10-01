---
layout: single
title: 'Bootstrap(부트스트랩) 기초 실습 (2)'
excerpt: '본 글은 패스트캠퍼스의 한 번에 끝내는 파이썬 웹 개발 초격차 패키지 강의를 개인 실습하여 정리했습니다. 문법 및 github 예제로 실습'
categories: web
tag : [web, frontend, concept, bootstrap, 정리, 웹, 기초, 예제]
toc: true
sidebar_main: true

last_modified_at: 2022-10-01
---

본 글은 패스트캠퍼스의 "한 번에 끝내는 파이썬 웹 개발 초격차 패키지" 강의를 개인 실습하여 따라 한 것입니다. <br>
기타 완성용 파일을 원하시는 분은 [https://github.com/ParkYoungWoong/bootstrap5-github-landing](https://github.com/ParkYoungWoong/bootstrap5-github-landing) 링크로 가주시면 됩니다. 
{: .notice--info}

<br>
<br>
<br>

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
<br>
<br>

## Reference

- [fastcampus](https://fastcampus.co.kr/dev_online_pyweb)
- [bootstrap 공식링크](https://getbootstrap.com/)