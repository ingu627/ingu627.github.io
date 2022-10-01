---
layout: single
title: 'HTML 기초 총정리'
excerpt: '본 글은 패스트캠퍼스의 한 번에 끝내는 파이썬 웹 개발 초격차 패키지 강의를 개인 실습하여 정리했습니다.'
categories: web
tag : [web, frontend, 개념, html, 웹, 정리, 기초, 예제]
toc: true
toc_sticky: true
sidebar_main: true

date: 2021-11-02
last_modified_at: 2022-10-01
---

본 글은 패스트캠퍼스의 "한 번에 끝내는 파이썬 웹 개발 초격차 패키지" 강의를 개인 실습하여 정리했습니다.
{: .notice--info}

<br>
<br>

## 기초 개념

### HTML (Hyper Text Markup Language)

- 페이지의 제목, 문단, 표, 이미지, 동영상 등 웹의 구조를 담당
(안에 들어있는 구조들만 작성)

### CSS (Cascading Style Sheets)

- 실제 화면에 표시되는 방법(색상, 크기, 폰트, 레이아웃 등)을 지정해 콘텐츠를 꾸며주는 시각적인 표현(정적)을 담당

### JS (JavaScript)

- 콘텐츠를 바꾸고 움직이는 등 페이지를 동작시키는 동적 처리를 담당

<br>

## 동작 원리

- User, Client (요청)-> <-(응답)Server, DataBase
- 웹 표준(Web Standard) : 웹에서 사용되는 표준 기술이나 규칙
  - W3C의 표준화 제정 단계의 '권고안(REC)'에 해당하는 기술
- 크로스 브라우징(Cross Browsing) : 조금은 다르게 구동되는 여러 브라우저에서 동일한 사용자 경험(같은 화면, 같은 동작 등)을 줄 수 있도록 제작하는 기술, 방법

<br>

## 특수 문자 용어

- **`** : Backtick, Grave (백틱, 그레이브)
- **~** : Tilde (틸드, 물결 표시)
- **!** : Exclamation mark (엑스클러메이션, 느낌표)
- **@** : At sign (앳, 골뱅이)
- **#** : Sharp, Number sign (샵, 넘버, 우물 정)
- **$** : Dollar sign (달러)
- **%** : Percent sign (퍼센트)
- **^** : Caret (캐럿)
- **&** : Ampersand (엠퍼센드)
- **\*** : Asterisk (에스터리스크, 별표)
- **-** : Hyphen, Dash (하이픈, 대시, 마이너스)
- **_** : Underscore, Low dash (언더스코어, 로대시, 밑줄)
- **=** : Equals sign (이퀄, 동등)
- **"** : Quotation mark (쿼테이션, 큰 따옴표)
- **'** : Apostrophe (아포스트로피, 작은 따옴표)
- **:** : Colon (콜론)
- **;** : Semicolon (세미콜론)
- **,** : Comma (콤마, 쉼표)
- **.** : Period, Dot (피리어드, 닷, 점, 마침표)
- **?** : Question mark (퀘스천, 물음표)
- **/** : Slash (슬래시)
- **\\** : Bachslash (백슬래시, 역 슬래시)
- **\|** : Vertical bar (버티컬 바)
- **\(\)**: Parenthesis (퍼렌서시스, 소괄호, 괄호)
- **\{\}** : Brace (브레이스, 중괄호) 
- **\[\]** : Bracket (브래킷, 대괄호)
- **\<\>** : Angle Bracket (앵글 브래킷, 꺽쇠괄호)

<br>

## HTML 기본 문법

1. `<태그>내용</태그>` = `<h1>Hello world!</h1>`
   - 이 전체를 요소(Element)라 부른다. 앞에 태그를 열린 태그라 하고, 뒤에 태그를 종료 태그라 한다.
2. `<태크 속성="값">내용</태그>`
   - 속성(Atrribute) \| 값(Value) -> 기능의 확장
3. `<태그>`: 빈(Empty) 태그
4. `<태그/>` : 태그를 시작하자마자 종료를 시킨다. (XHTML 또는 HTML5에서 가능)

<br>

## HTML 요소의 관계 

- `<div>Contents</div>`
  - div = division 무언가를 분할한다.
- `<div><div>Contents</div></div>`
  - 부모 요소와 자식 요소 파악!!
  - 한줄로 적으면 알아보기 힘들다
  - 상위(조상) 요소는 나를 감싸는 모든 상위 요소. 반대는 하위(후손) 요소

<script src="https://gist.github.com/ingu627/4256b16fa5afebf34f3fd48aa9595af7.js"></script>

- tab (Indent, 들여쓰기)
- shift + tab (Outdent, 내어쓰기)
- 형제 요소

<br>

## 글자와 상자

- 요소가 화면에 출력되는 특성, 크게 2가지로 구분

- 인라인(Inline) 요소 : 글자를 만들기 위한 요소들
- 블록(Block) 요소 : 상자(레이아웃)를 만들기 위한 요소들

<br>

### 인라인

- `<span></span>` : 대표적인 인라인 요소 (본질적으로 아무것도 나타내지 않는, 콘텐츠 영역을 설정하는 용도)
- 요소가 수평으로 쌓이는 특징
- 포함한 콘텐츠 크기만큼 자동으로 줄어듦! 
- 포함한 콘텐츠 크기만큼 자동으로 줄어듦!

- `<span style='width: 100px>Hello</span>` : 요소에 가로 사이즈를 100픽셀 만큼 지정하겠다. (css 속성)
- `<span style='height: 100px>World</span>` : 요소에 세로 사이즈를 100픽셀 만큼 지정하겠다. (css 속성)
-> 인라인 크기는 모양을 지정할 수 없다.

- `<span style="margin: 20px 20px;">Hello</span>` : 요소의 외부 여백을 지정하는 CSS 속성 (위 아래는 X)
- `<span style="padding: 20px 20px;">Hello</span>` : 요소의 내부 여백을 지정하는 CSS 속성 (위 아래는 X)
-> 인라인은 글씨를 다루는 것이다.

- 인라인 요소의 내부는 블록 요소는 넣을 수 없다.
- `<span><div></div></span>` : x
- `<span><span></span></span>` : o

<br>

### 블록

- `<div></div>` : 대표적인 블록 요소 (본질적으로 아무것도 나타내지 않는, 콘텐츠 영역을 설정하는 용도)
- 요소가 수직으로 쌓이는 특징
- 부모 요소의 크기만큼 자동으로 늘어남! (가로) (최대한 늘어나려고 한다)
- 포함한 콘텐츠 크기만큼 자동으로 줄어듦! (세로) (최대한 줄어드려고 한다)
- `<div style="width": 100px>Hello</div>` : 요소의 가로 너비를 지정하는 CSS 속성 
- `<div style="height": 100px>Hello</div>` : 요소의 세로 너비를 지정하는 CSS 속성
- `<div style="margin: 20px 20px;">Hello</div>` : 요소의 외부 여백을 지정하는 CSS 속성 (위 아래는 X)
- `<div style="padding: 20px 20px;">Hello</div>` : 요소의 내부 여백을 지정하는 CSS 속성 (위 아래는 X)
-> 블록 요소는 모두 가능하다. (레이아웃을 잡는 용도이기 때문에 별도의 제약이 있으면 안된다.)

- `<div><div></div></div>` : o
- `<div><span></span></div>` : o

<br>

## 주요 요소 정리 - 정보 태그

### !를 눌러 기본 구조를 완성한다.

<script src="https://gist.github.com/ingu627/e2ac8871efc989a5a86e9169bbcb1c6e.js"></script>

- `<html></html>` : 문서의 전체 범위 (HTML 문서가 어디에서 시작하고, 어디에서 끝나는지 알려주는 역할)
- `<head></head>` : 문서의 정보를 나타내는 범위
  - 웹 브라우저가 해석해야 할 웹 페이지의 제목, 설명, 사용할 파일 위치, 스타일(CSS) 같은, 웹페이지의 보이지 않는 정보를 작성하는 범위
- `<body></body>` : 문서의 구조를 나타내는 범위
  - 사용자 화면을 통해 보여지는 로고, 헤더, 푸터, 내비게이션, 메뉴, 버튼. 이미지 같은, 웹페이지의 보여지는 구조를 작성하는 범위
-> HTML은 크게 정보과 구조로 나뉘어져 있다. 
- `<!DOCTYPE html>` : 문서의 HTML 버전을 지정
  - DOCTYPE(DTD, Document Type Definition)은 마크업 언어에서 문서 형식을 정의하며, 웹 브라우저가 어떤 HTML 버전의 해석 방식으로 페이지를 이해하면 되는지를 알려주는 용도 
- `<meta />` : HTML 문서(웹페이지)의 제작자, 내용, 키워드 같은, 여러 정보를 검색엔진이나 브라우저에게 제공
  - 빈 테크 (닫힌 테그가 없다.)
  - `charset=` : 문자인코딩 방식
  - `name=` : 정보의 종류
    - `author` : 저자
    - `viewport` : 실제로 화면이 출력되는 영역
  - `content` : 정보의 값
- `<title></title>` : HTML 문서의 제목(title)을 정의
  - 웹 브라우저 탭에 표시됨
- `<link />` : 외부 문서를 가져와 연결할 때 사용 (대부분 CSS 파일)
  - `rel` : 가져올 문서와 관계 (relation의 약자)
  - `href` : 가져올 문서의 경로 (hypertext reference의 약자)
    - `./` : 현재 문서 경로

- `style` : 스타일(CSS)를 HTML 문서 안에서 작성하는 경우에 사용.

- `<script src=" "></script>` : 자바스크립트(JS)파일 가져오는 경우
- `<script>console.log('Hello world!')</script>` : 자바스크립트(JS)를 HTML 문서 안에서 작성하는 경우

- 요소 == 태그
  - 요소 : 시작하는 태그와 끝나는 태그의 전체 코드
  - 태그 : 그 코드가 가지고 있는 이름 정도

<br>

## 주요 요소 정리 - 구조 태그

<script src="https://gist.github.com/ingu627/d4260db13f9a21abe81cadfa8957159f.js"></script>

- `<div></div>` : 특별한 의미가 없는 구분을 위한 요소. (block element)  (Division) (한마디로 막 사용할 수 있는 태그)
- `<h1></h1>` : 제목을 의미하는 요소 (block element) (Heading) 
  - h 다음 숫자는 제목 크기를 뜻함 (숫자가 작을수록 더 중요한 제목을 정의)
- `<p></p>` : 문장을 의미하는 요소 (block element) (Paragraph)
- `<img />` : 이미지를 삽입하는 요소 (inline element) (Image)
  - `src` : 삽입할 이미지의 경로
  - `alt` : 삽입할 이미지의 이름 (이미지 대신에 나타날 글자)


- `<ul></ul>` : 순서가 필요없는 목록의 집합을 의미 (block element) (Unordered List)
- `<li></li>` : 목록 내 각 항목 (block element) (List Item)

- `<a></a>` : 다른/같은 페이지로 이동하는 하이퍼링크를 지정하는 요소 (inline element) (Anchor)
  - `target=` : 링크 URL의 표시(브라우저 탭) 위치 
- `<span></span>` : 특별한 의미가 없는 구분을 위한 요소 (inline element)
  - 스타일(CSS) 추가 가능
- `<br/>` : 줄바꿈 요소. (inline element) (Break)
  - enter 키와 동일한 기능
- `<input />` : 사용자가 데이터를 입력하는 요소 (inline-block element)
  - `type="text"` : 입력받을 데이터의 타입
    - 텍스트를 입력할 수 있는 UI 제공
    - `value=` : 미리 입력된 값(데이터)
    - `placeholder=` : 사용자가 입력할 값(데이터)의 힌트
    - `disabled` : 입력 요소 비활성화
      - 상황에 따라 JS로 제어한다.
      - 별도의 입력 값이 존재하지 않는다.

<br>

## HTML 주석과 전역 속성

- `<!--Comment-->` : 수정사항이나 설명 등을 작성(주석).
  - 브라우저는 이 태그를 해석하지 않기 때문에 화면에 내용이 표시되지 않음
  - `ctrl + /`

<br>

### 전역

- 어떤 요소에도 상관없는, 전체 영역에 쓸 수있는
- `<태그 style="스타일"></태그>` : 요소에 적용할 스타일(CSS)을 지정
  - style은 어떤 태그에도 쓸 수 있다.
- `<태그 class="이름"></태그>` : 요소를 지칭하는 중복 가능한 이름
- `<태그 id="이름"></태그>` : 요소를 지칭하는 고유한 이름

<br>
<br>
<br>
<br>

## References

- [fastcampus](https://fastcampus.co.kr/dev_online_pyweb)