---
layout: single
title: '마크다운(markdown)문법, 사용법에 대한 거의 모든 것'
excerpt: 'MarkDown (md), 목차 만들기, 크기 지정, 글꼴, 줄바꿈, 띄어쓰기(enter), 글자 색깔, 인용문, 문자 박스(notice), 문자 정렬, 구분선, check box,목록, 코드 블럭, 표 (table), 접기/펼치기 (토글바), 각주, 미주, 유튜브 동영상 넣기, 이미지, 링크, 수식, 그래프로 표시하기'
categories: md
tag : [grammar, tip, md, 마크다운, 문법, 목차, 크기 지정, 글꼴, 줄바꿈, 띄어쓰기, 글자 색깔, 인용문, 문자 박스, 문자 정렬, 구분선, 코드 블럭, 표, 접기, 펼치기, 각주, 미주, 유튜브, 이미지, 링크, 수식, 그래프]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-01-28
---

저도 다 외우지 못합니다. <br>적용할 때마다 그때그때 보기 위해서 모두 정리해보았습니다. <br>보고 적용합시다! 🔥🔥
{: .notice--info}

<br>
<br>

## MarkDown (md) 

- 텍스트에 양식을 입히는 마크업 언어의 일종, **HTML**과 연동이 가능하다. (정의)
- 마크다운은 빨리 작성할 수 있고, 또 인터넷에 글을 쓰는 사람을 위해 만들어졌다.

<img align='right' width='230' height='200' src='https://user-images.githubusercontent.com/78655692/144753588-5f69dac1-8c11-493a-894d-08de24c42493.png'>

- 다양한 협업 툴에서 활용 (Notion, Slack...)
- 다양한 Markdown용 Editor (Typora...)

<br>
<br>

## 목차 만들기 
- (table of contents)
- `[toc] + enter`

<br>
<br>

## 크기 지정
- \# 을 활용하여 크기를 설정하면 됩니다.

![크기](https://user-images.githubusercontent.com/78655692/144753982-1ab3ae97-558f-4a8e-b525-2a288c37a306.gif)

```md
# 이건 h1(header 1)입니다.

## 이건 h2입니다.

### 이건 h3입니다.

#### 이건 h4입니다.

##### h5입니다.

###### h6입니다.

<br>

### tip! 
- \#를 5개 이상 쓴다는 것? -> 잘못된 분류!!
```

<br>
<br>

## 글꼴

- *만약 기울임체(이탤릭체)를 쓰고 싶다면 `*`로 감싸줍니다.* (또는 _로 감싸줘도 됩니다.)
_italic_

- **굵게(보드체)은 `**` 로 감싸줍니다.**
  - **bold**
  - html, css로 적용할 땐?
    1. <b> b 태그 </b> : `<b> b 태그 </b>`
    2. <strong> strong 태그 </strong> : `<strong> strong 태그 </strong>`
    3. font-weight 속성 (css)

- 취소선은 `~~` 로 감싸줍니다.
  - ~~hello~~
- \*\*와 \_를 동시에 감싸줘도 됩니다.
  - **_italic+bold_**

![글꼴](https://user-images.githubusercontent.com/78655692/144753836-1a474192-06c1-421d-baca-c49e3f5f7193.gif)

*그래서* **한번에 쓰고 싶으면**  `ctrl + i`(i는 italic의 약자) / `ctrl + b`(b는 bold의 약자)

- 밑줄을 그어주려면 <u></u>로 글을 감싸줍니다.
<u>우리를 움직이게 하는 건 동기</u>
`<u>우리를 움직이게 하는 건 동기</u>`

<br>
<br>

## 줄바꿈
텍스트 뒤에 `space bar`를 두번 치고 enter를 누른 뒤 다음 텍스트를 씁니다.

<br>
<br>

## 띄어쓰기(enter)
- 텍스트 뒤에 `<br>` 을 치시면 됩니다. 
- `<br/>` 로 치시면 한칸 더 띄어집니다.

<br>
<br>

## 글자 색깔
- html의 부분에 `color:`를 이용하여 색깔을 바꿔주세요.

    <span style="color:red">빨간 글씨</span>  
    <span style="color:blue">파란 글씨</span>  
    <span style="color:green">초록 글씨</span>  
    <span style="color:yellow">노란 글씨</span>  
    <span style="color:purple">보라 글씨</span>  

```html
<span style="color:red">빨간 글씨</span>
<span style="color:blue">파란 글씨</span>
<span style="color:green">초록 글씨</span>
<span style="color:yellow">노란 글씨</span>
<span style="color:purple">보라 글씨</span>
```

<br>

### RGB 색상표

<br>

![image](https://user-images.githubusercontent.com/78655692/149109308-2f5dcb0b-bc09-4edc-b6a1-bc0a63485df8.png)

<br>
<br>

## 형관펜

- html의 `style`부분에 `background-color:`를 이용하여 색깔을 바꿔주세요.

    <span style="background-color:red">빨간 글씨</span>  
    <span style="background-color:blue">파란 글씨</span>  
    <span style="background-color:green">초록 글씨</span>  
    <span style="background-color:yellow">노란 글씨</span>  
    <span style="background-color:purple">보라 글씨</span> 

```html
<span style="background-color:red">빨간 글씨</span>  
<span style="background-color:blue">파란 글씨</span>  
<span style="background-color:green">초록 글씨</span>  
<span style="background-color:yellow">노란 글씨</span>  
<span style="background-color:purple">보라 글씨</span> 
```

<br>
<br>

## 글자 크기 조정

- html의 `style`부분에 `font-size:`를 이용하여 색깔을 바꿔주세요.

    <span style="font-size:250%">폰트사이즈 250</span>  
    <span style="font-size:100%">폰트사이즈 100</span>  
    <span style="font-size:50%">폰트사이즈 50</span>  

```html
<span style="font-size:250%">폰트사이즈 250</span>  
<span style="font-size:100%">폰트사이즈 100</span>  
<span style="font-size:50%">폰트사이즈 50</span>  
```

<br>
<br>

## 위의 3가지 속성을 다 쓰고 싶다면

- `style=" ;  ; "` 형태로 `;`를 쓰면 됩니다.

<br>

<b><span style="color:white; background-color:red; font-size:150%">글자는 흰색, 배경은 빨강, 사이즈는 150, 굵기는 b태그로 설정</span></b>  

```html
<b><span style="color:white; background-color:red; font-size:150%">글자는 흰색, 배경은 빨강, 사이즈는 150, 굵기는 b태그로 설정</span></b>
```

<br>
<br>

## 별표 (이미지)

- 별 이미지는 직접 만들었습니다. 별 갯수에 따라 강조하고픈 내용에 첨가하시면 좋습니다. (마치 마크다운 글을 필기하는 것처럼!)
- 크기 조정은 `width=` 부분을 조정하면 됩니다. (아래 코드는 마크다운 글에 최적화된 크기입니다.)
  - 별 하나에서 일반 글크기 : 25 / 크게는 55
  - 별 둘에서 일반 글크기 : 41 / 크게는 81
  - 별 셋에서 일반 글크기 : 46 / 크게는 91
- **별 하나** 

<img width="25" alt="star1" src="https://user-images.githubusercontent.com/78655692/151471925-e5f35751-d4b9-416b-b41d-a059267a09e3.png">

```html
<img width="25" alt="star1" src="https://user-images.githubusercontent.com/78655692/151471925-e5f35751-d4b9-416b-b41d-a059267a09e3.png">
```

<img width="55" alt="star1" src="https://user-images.githubusercontent.com/78655692/151471925-e5f35751-d4b9-416b-b41d-a059267a09e3.png">

```html
<img width="55" alt="star1" src="https://user-images.githubusercontent.com/78655692/151471925-e5f35751-d4b9-416b-b41d-a059267a09e3.png">
```

<br>

- **별 둘**

<img width="41" alt="star2" src="https://user-images.githubusercontent.com/78655692/151471960-29c5febe-c509-4c6d-99f4-a2203eb193c5.png">

```html
<img width="41" alt="star2" src="https://user-images.githubusercontent.com/78655692/151471960-29c5febe-c509-4c6d-99f4-a2203eb193c5.png">
```

<img width="81" alt="star2" src="https://user-images.githubusercontent.com/78655692/151471960-29c5febe-c509-4c6d-99f4-a2203eb193c5.png">

```html
<img width="81" alt="star2" src="https://user-images.githubusercontent.com/78655692/151471960-29c5febe-c509-4c6d-99f4-a2203eb193c5.png">
```

<br>

- **별 셋**

<img width="46" alt="star3" src="https://user-images.githubusercontent.com/78655692/151471989-9e21d7a8-a7b6-44b0-b598-2bb204b56b00.png">

```html
<img width="46" alt="star3" src="https://user-images.githubusercontent.com/78655692/151471989-9e21d7a8-a7b6-44b0-b598-2bb204b56b00.png">
```

<img width="91" alt="star3" src="https://user-images.githubusercontent.com/78655692/151471989-9e21d7a8-a7b6-44b0-b598-2bb204b56b00.png">

```html
<img width="91" alt="star3" src="https://user-images.githubusercontent.com/78655692/151471989-9e21d7a8-a7b6-44b0-b598-2bb204b56b00.png">
```

<br>

- **예시**

### <img width="91" alt="star3" src="https://user-images.githubusercontent.com/78655692/151471989-9e21d7a8-a7b6-44b0-b598-2bb204b56b00.png"> Virtualization (예시)

<img width="25" alt="star1" src="https://user-images.githubusercontent.com/78655692/151471925-e5f35751-d4b9-416b-b41d-a059267a09e3.png"> Threads and processes can be seen as a way to do more things at the same
time. In effect, they allow us to build (pieces of) programs that appear to be
executed simultaneously. <span style="background-color:yellow">On a single-processor computer, this simultaneous
execution is, of course, an illusion.</span> As there is only a single CPU, only an
instruction from a single thread or process will be executed at a time. By
rapidly switching between threads and processes, the illusion of parallelism
is created.
<img width="41" alt="star2" src="https://user-images.githubusercontent.com/78655692/151471960-29c5febe-c509-4c6d-99f4-a2203eb193c5.png"> This separation between having a single CPU and being able to pretend
there are more can be extended to other resources as well, <span style="background-color:yellow">leading to what
is known as resource virtualization.</span> This virtualization has been applied for
many decades, but has received renewed interest as (distributed) computer
systems have become more commonplace and complex, <img width="46" alt="star3" src="https://user-images.githubusercontent.com/78655692/151471989-9e21d7a8-a7b6-44b0-b598-2bb204b56b00.png"> leading to the situation
that application software is mostly always outliving its underlying
systems software and hardware.




<br>
<br>

## 인용문 : 만약 인용구를 넣고 싶다면?
> `>` + space를 누르면 인용구를 만들 수 있습니다.

> 안녕하세요

> 안녕하세요
>> 안녕하세요
>>> 안녕하세요
>>>> 안녕하세요

더 넣고 싶을 땐 추가로 `>`를 넣습니다.

<br>
<br>

## 문자 박스(notice)

|Notice Type|	Class|
|---|---|
|Default|	.notice|
|Primary|	.notice-\-primary|
|Info|	.notice-\-info|
|Warning|	.notice-\-warning|
|Success|	.notice-\-success|
|Danger|	.notice-\-danger|

- `{: .notice}`으로 적용 (문장 다음 엔터치고)

**이것은 문자박스입니다.**<br>공지사항입니다. 공부를 해봅시다
{: .notice}

**이것은 문자박스입니다.**<br>공지사항입니다. 공부를 해봅시다
{: .notice--primary}

**이것은 문자박스입니다.**<br>공지사항입니다. 공부를 해봅시다
{: .notice--info}

**이것은 문자박스입니다.**<br>공지사항입니다. 공부를 해봅시다
{: .notice--warning}

**이것은 문자박스입니다.**<br>공지사항입니다. 공부를 해봅시다
{: .notice--success}

**이것은 문자박스입니다.**<br>공지사항입니다. 공부를 해봅시다
{: .notice--danger}

<br>
<br>

## 문자 정렬

### 왼쪽 정렬 (Default)
- `{: .text-left}`

안녕하세요
{: .text-left}

<br>
<br>

### 가운데 정렬
- `{: .text-center}` : 글자 쓰고 엔터 누름

안녕하세요
{: .text-center}

- `<center>가운데</center>`
<center> 안녕하세요 </center> 

<br>
<br>

### 오른쪽 정렬
- `{: .text-right}`

안녕하세요
{: .text-right}

<br>
<br>

## 줄을 바꿀 때
띄어쓰기(스페이스)를 2번 누릅니다.

<br>
<br>

## 구분선

-(하이픈)를 3개 작성하고 엔터를 누르면 구분선이 만들어집니다. (또는 *)
`---`, `***`

***
---

<br>
<br>

## 체크박스
- [ ] 체크가 안 되었다. `[ ]`
- [x] 체크가 되었다. `[x]`

<br>
<br>

## 목록

- 하이픈을 입력하고 space bar를 누르면 순서 없는 목록이 만들어 집니다.
- 그리고 엔터를 누르면 하나 더 생기고
  - 엔터를 누르고 tab 키를 누르면 하위 목록을 생성할 수도 있습니다. 
    - tab을 누르니 하나가 더 생겼죠?
  - 엔터를 누르고 계속 쓰시다가 나오고 싶다면? : **shift + tab을 눌러서 나올 수 있습니다.** 
- 만약 완전히 끝내고 싶다면? 엔터를 두번 누르면 됩니다.

1. 숫자를 누르고 .(마침표)를 찍은 다음 space bar를 누르면 만들어집니다.
2. 순서가 없는 목록과 동일하게 enter를 누르면 다음 목록이 만들어 집니다.
   1. tab 키를 눌러서 하위 목록을 생성할 수 있고
   2. 나가고 싶으면 shift + tab을 눌러서 밖으로 나올 수 있습니다.

<br>
<br>

## 코드 블럭

### inline 코드 블록
- `(백틱 -> 숫자 1 왼쪽)을 세 번 누르고 (언어 ex)python 치고) enter
 
```python
def my_sum(a, b):
    return a + b
```

```python
print('Hello World!')
```

- [코드 생성 사이트](https://carbon.now.sh/) 여기에 들어가셔서 코드를 따로 추출해도 됩니다. `https://carbon.now.sh/`

- `https://gist.github.com/` [gist](https://gist.github.com/)
  - 추가 방법 : 조금 더 이쁘게 하고 싶을 때 github의 gist를 들어가시면
  <img src="https://ingu627.github.io/images/gist1.png"></img>
  창이 보일 겁니다.
    1. 제목은 제목명.언어확장자(py, ipynb, java...)로 하시면 해당 언어로 코드가 완성됩니다.
    2. 코드를 썼으면 Create secret gist를 누르시고
  <img src="https://ingu627.github.io/images/gist2.png"></img>
    2_1. private, public 모두 상관없습니다. 공개 여부의 차이만 있을 뿐입니다.
    3. 해당 주소를 카피해서 원하는 줄에 넣으시면 코드가 이쁘게 나오는 걸 볼 수 있습니다.
  <script src="https://gist.github.com/ingu627/58d1f351b58acf3571f5089436a505e6.js"></script>


만약 특정한 문장을 코드 블럭으로 만들고 싶으면 `1 + 2 = 3` (백틱 - [숫자 1 왼쪽]으로 감싸줍니다.)
- \`(백틱)로 감싸주면 배경색을 회색으로 바꿔줍니다.
`백틱 사용하기`

<br>
<br>

### 코드 블럭 (tab 2번)
- tab을 두번 누르면 위의 백틱(`)을 사용한 것과 같습니다.

안녕하세요 활용 (보통 코드 결과에 활용)

    안녕하세요

<br>
<br>

## 표 (table)

`|(파이프)` 를 활용하여 컬럼을 만들 수 있습니다. 

파이프 기호를 만들고자 하는 컬럼으로 감싸줍니다.

`|컬럼1|컬럼2|` + enter 

`|---|` 을 입력해서 표(table) 입력임을 표시합니다. (- 수는 상관없습니다.)
(`|-|` 기호로도 입력할 수 있습니다.)

```markdown
표 정렬

--- 정렬하지 않음
:--- 왼쪽으로 정렬
---: 오른쪽으로 정렬
:---: 가운데 정렬
```

```markdown
| 순번 | 이름   | 나이 |
| :--: | :--- | ---: |
|  1   | 홍길동 | 100  |
|  2   | 김길동 | 120  |
|  3   | 박길동 | 140  |
```

| 순번 | 이름   | 나이 |
| :--: | :--- | ---: |
|  1   | 홍길동 | 100  |
|  2   | 김길동 | 120  |
|  3   | 박길동 | 140  |

<br>
<br>

## 접기/펼치기 (토글바)

- 태그에 `open`에 대한 매개변수를 추가하여 `details`의 토글/드롭다운의 기본 동작을 열린 상태로 설정할 수 있다.
- 처음 보여주는 텍스트는 `summary` 태그 내부에 쓴다.

<details open>
  <summary>이 블로그의 닉네임은?</summary>
  poeun. 열린상태로 보여준다.
</details>
<br>
<details>
  <summary>블로그를 더욱 알고 싶다면?</summary>
  github.com/ingu627 로 이동한다.
</details>

<br>
<br>

### 전체 코드 

```html
<details open>
  <summary>이 블로그의 닉네임은?</summary>
  poeun. 열린상태로 보여준다.
</details>


<details>
  <summary>블로그를 더욱 알고 싶다면?</summary>
  github.com/ingu627 로 이동한다.
</details>
```

<br>
<br>

## 각주, 미주

- 문장 끝에 `[^1]`을 넣으면 위쪽에 작은 숫자가 뜰 것입니다.[^1]
- `[^1]: ` : 참고 문헌은 `[^1]`을 한다음 `:`을 붙이면 자동으로 생성이 됩니다. (주석과 참조 번호가 서로 연결됩니다.)

![주석](https://user-images.githubusercontent.com/78655692/144754771-046a60d6-ff96-427e-ab58-7b3770369c41.gif)


[^1]: 참고 문헌은 이것입니다. <https://sergeswin.com/1013/> (각주, 미주에서)

<br>
<br>

### html 사용할 때

- 각주 : `<sup>[1](#footnote_1)</sup>`
- 미주 : `<a name='footnote_1'>1에 대한 내용</a>`
  - 미주는 글 뒷 부분에 삽입합니다.
- ex.

각주와 미주는 다음의 글을 참고했습니다.<sup>[1](#footnote_1)</sup>

<br>
<br>

## 유튜브 동영상 넣기

### 1. iframe 이용하기

- 유튜브 동영상을 오른쪽 버튼을 누른 후, 소스 코드 복사를 누르면 끝

![image](https://user-images.githubusercontent.com/78655692/143901417-87ed57ea-56db-4dab-a3fc-19820f282d5c.png)

`<iframe width="896" height="504" src="https://www.youtube.com/embed/1xWmteIE3Y8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`

<br>

<iframe width="896" height="504" src="https://www.youtube.com/embed/1xWmteIE3Y8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<br>
<br>

### 2. minimal-mistake 테마 사용시

- 코드 : 


`{ % include video id="v=다음의 id 값" provider="youtube" % }`

![image](https://user-images.githubusercontent.com/78655692/143901643-c64f72d8-c6e7-426a-a723-8319dc927bde.png)

{% include video id="1xWmteIE3Y8&t=2300s" provider="youtube" %}

<br>
<br>

## 이미지

- 문법 : `![이미지가 안 불러졌을때 나타나는 설명문](이미지 주소)`
예시 : `![북두칠성](https://ingu627.github.io/images/2021-10-29-first/bukdu.jpg)`

- 또는 html 언어를 써도 됩니다.
- `<img src="그림 주소" width="가로 길이" height="세로 길이" alt="그림 설명" />`
- `<img src="" width="" height="" alt="" />`


<img src="https://user-images.githubusercontent.com/78655692/149096925-170a1dbe-807d-40d9-b7d2-185dc3d05b38.png" width="400"  alt="matrix4"/>

![image](https://user-images.githubusercontent.com/78655692/149096925-170a1dbe-807d-40d9-b7d2-185dc3d05b38.png)

<br>
<br>

## 이미지를 md 파일에 복사하기

- 제가 가장 많이 하는 방법은 github.com 의 issue나 gist.github.com 을 이용하는 것입니다.
<br/>
해당 이미지를 `ctrl + c`를 누르시고 아래에 `ctrl + v`를 하시면

`![image](https://user-images.githubusercontent.com/78655692/149096925-170a1dbe-807d-40d9-b7d2-185dc3d05b38.png)`

로 나옵니다. 이것을 그대로 md파일에 복사넣기 하면 이미지가 생성됩니다.

<br>
<br>

## 이미지에 링크를 걸고 싶을땐
  `[![이미지설명](이미지 파일 저장 경로)](이미지 주소 링크)`

[![image](https://user-images.githubusercontent.com/78655692/149096925-170a1dbe-807d-40d9-b7d2-185dc3d05b38.png)](https://www.youtube.com/watch?v=22_1CRL35Qk)

<br>
<br>

## 텍스트와 이미지 어울림

- 기존 img 태그를 이용에서 `align`의 `left` 또는 `right`을 넣어, 이미지를 텍스트와 어울리게 할 수 있다.

<img align='right' width='150' height='100' src='https://user-images.githubusercontent.com/78655692/144441367-4855a172-e479-411d-9ec9-8a258ed26a51.png'>

매트릭스 시리즈의 네 번째 작품. 매트릭스 트릴로지의 최종편이었던 3편 레볼루션이 2003년 개봉된 이후 무려 18년 만에 돌아오는 키아누 리브스 주연의 매트릭스 신작이다.2019년 8월 20일, 워너 브라더스가 CNN을 통해 공개한 제작 계획에 따르면, 이전까지 시리즈의 감독을 맡았던 워쇼스키 자매중 언니 라나 워쇼스키가 각본과 연출 그리고 제작을 맡았으며, 이 시리즈의 주인공을 맡은 키아누 리브스와 캐리앤 모스의 출연이 확정되었다. 2019년 12월 12일, 워너 브라더스가 개봉일을 2021년 5월 21일로 정식 발표했다. 제작발표 이후 워낙 매트릭스 시리즈의 인기와 명성이 높다보니, 2021년 최고의 기대작 중 하나로 손꼽히고 있다.

<br>

```html
<img align='right' width='150' height='100' src='https://user-images.githubusercontent.com/78655692/144441367-4855a172-e479-411d-9ec9-8a258ed26a51.png'>

매트릭스 시리즈의 네 번째 작품. 매트릭스 트릴로지의 최종편이었던 3편 레볼루션이 2003년 개봉된 이후 무려 18년 만에 돌아오는 키아누 리브스 주연의 매트릭스 신작이다.2019년 8월 20일, 워너 브라더스가 CNN을 통해 공개한 제작 계획에 따르면, 이전까지 시리즈의 감독을 맡았던 워쇼스키 자매중 언니 라나 워쇼스키가 각본과 연출 그리고 제작을 맡았으며, 이 시리즈의 주인공을 맡은 키아누 리브스와 캐리앤 모스의 출연이 확정되었다. 2019년 12월 12일, 워너 브라더스가 개봉일을 2021년 5월 21일로 정식 발표했다. 제작발표 이후 워낙 매트릭스 시리즈의 인기와 명성이 높다보니, 2021년 최고의 기대작 중 하나로 손꼽히고 있다.
```

<br>
<br>

## 링크

### 주소 링크

- `<https://ingu627.github.io>`
- 주소가 그대로 보이는 링크입니다. (http 형식)

<https://ingu627.github.io>

<br>
<br>

### 일반 링크

- `['글'](링크를 넣어주세요)`

[북두칠성에 더 알고 싶다면??](https://ko.wikipedia.org/wiki/%EB%B6%81%EB%91%90%EC%B9%A0%EC%84%B1)

또는 html로 써도 됩니다<br>
`<a href="naver.com">링크이름</a>`

<br>
<br>

### 새창으로 링크
- `['글'](링크를 넣어주세요){: target="_blank"}`

['네이버'](https://www.naver.com){: target="_blank"}

<br>
<br>

### 새창으로 버튼 링크
- `['글'](링크를 넣어주세요){: .btn.btn-default target="_blank"}`

['네이버'](https://www.naver.com){: .btn.btn-default target="_blank"}

<br>
<br>

## 수식

- \$로 감싸면 수식이 마치 문서처럼 써집니다.
- **이 블로그에서는 적용이 안되네요.**
  - `+2021.11.29` : jekyll은 `mathjax: true`로 해야 수식이 잘 나오는 것 확인. (`$`는 범용 마크다운에서 가능)
  - `+2021.11.30` : `front-matter` 에 `use_math: true`로 설정하면 원래 문법인 `$`를 감싸는 것이 가능

$a+b+c+d=e$ <br>
\\(a+b=c\\)  <br>
\\(y = 3x\\) <br>
\\(a^2+b^2=c^2\\) => `$a^2 + b^2 = c^2$` <br>
\\(3x^2_1 + 3x_2 = 10\\) => `$3x^2_1 + 3x_2 = 10$` 

<br>

- \$\$ 달러 2개는 항상 중앙에 쓰도록 해줍니다.
  - $$a+b=c$$
  - `$$a+b=c$$`
   - $$(\alpha + \beta)^2 = \alpha^2 + 2\alpha\beta+\beta^2 $$
   - `$$(\alpha + \beta)^2 = \alpha^2 + 2\alpha\beta+\beta^2 $$`

- \\(min_a\\) => `\\(min_a\\)` 
- \\(min_b\\) => `\\(min_b\\)`

<br>
<br>

### tip!
만약 특수문자 그대로 사용하고 싶다면 앞에 \(역슬래시)를 추가해주면 됩니다.
\$
`\$`

```markdown
$y=3x$ #수직을 $로 감싸주기
```

<br>
<br>

## 그래프로 표시하기

![mermaid](https://user-images.githubusercontent.com/78655692/144781090-6da2bfae-7655-454e-8135-530b94615a9c.gif)

```markdown
graph LR
  1-->2
  1-->5
  2-->3
  3-->2
  5-->3
```

- (mermaid)

<br>
<br>

## References

- [[토크ON세미나] Git & GitHub Page 블로그 만들기 4강 - Github Page 활용하기 T아카데미](https://www.youtube.com/watch?v=eCv_bh-Ax-Q)
- [마크다운 문법 소개](http://ccl.cckorea.org/syntax/)
- [[Github Blog] minimal mistakes - 포스팅 글 써보기](https://eona1301.github.io/github_blog/GithubBlog-Posting/)
- [[Github 블로그] Mathjax로 수식(Math Expression) 쓰기](https://ansohxxn.github.io/blog/math-equation/)
- [[Github 블로그] 유튜브 동영상 삽입하기](https://ansohxxn.github.io/blog/youtube/)
- [7가지 고급 마크다운 팁!](https://ichi.pro/ko/7gaji-gogeub-makeudaun-tib-98969302646610)
- [마크다운(Markdown) 문법, 사용법, 에디터 - 궁금하신 분! 여기서 한 번에 보세요. - 서지스윈](https://sergeswin.com/1013/)
- [[Markdown] 마크다운 글 색상/형광펜, 이미지 크기조정/캡션삽입](https://geniewishescometrue.tistory.com/101)
- [RGB 색상표](https://freestrokes.tistory.com/19)
- <a name="footnote_1">[Markdown 각주 미주 사용하기](https://lynmp.com/ko/article/nu86c16d8f09c9fbd8)</a>