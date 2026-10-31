---
layout: single
title: "[Mathjax] Github Pages에서 수식 문법 사용하기"
excerpt: "Mathjax란 MathML, LaTeX 및 ASCIIMathML 마크 업을 사용하여 웹 브라우저에 수학 표기법을 표시하는 크로스 브라우저 JavaScript 라이브러리이다. 웹 사이트에서 수학식 표시가 가능하다."
categories: git_blog
tags: [git, blog, markdown, 마크다운, mathjax, 문법, 깃블로그, github pages, 수식, 적용, 명령어, tex, latex, 수학, 표기, katex]
sidebar_main: false
classes: wide

last_modified_at: 2026-10-09
---

<img src="/assets/images/legacy/ca03c71998.webp" width=650 alt="mathjax">

## Mathjax란

- MathML, LaTeX 및 ASCIIMathML 마크 업을 사용하여 웹 브라우저에 수학 표기법을 표시하는 크로스 브라우저 JavaScript 라이브러리이다.
- 웹 사이트에서 수학식 표시가 가능하다.


## 웹에서 Mathjax 설치하기 

- 사실 minimal mistakes 테마를 쓰고 있다면 별도의 추가를 할 필요가 없다.
- `_includes`내에 `mathjax_support.html`이 포함되어 있기 때문에 `_config.yml`에서 `use_math: true` 를 추가해 주면 된다.

![image](/assets/images/legacy/2d72db5741.webp)

![image](/assets/images/legacy/4bcf403858.webp)


## 쓰는 방법

### `$` 사용하기

- `$`로 쓰고자 하는 수식을 감싸준다.
- 예를 들어 $a+b=c$ 이렇게 말이다. (`$a+b=c$`)
- `$$`로 수식을 감싸주면 가운데 정렬이 된다.
- `$$x^2+3*x+5 는 이차함수이다.$$`

$$x^2+3*x+5=0 는 이차함수이다.$$


### `\\(   \\)` 사용하기

- `\\(` 와 `\\)` 로 수식을 감싸 줘도 똑같다.
- \\(a+b=c\\) => `\\(a+b=c\\)`


## 그 외 수식은 pdf 파일에 있으니 참고하면 된다. ($\alpha$나 $\beta$ 같은 것들)

- [TeXRefCard.v1.5.pdf](https://drive.google.com/file/d/1GWa-Syt3nvB_fGDiUHXpNWFSABmDscdx/view?usp=sharing)


- [위키백과:TeX 문법](https://ko.wikipedia.org/wiki/%EC%9C%84%ED%82%A4%EB%B0%B1%EA%B3%BC:TeX_%EB%AC%B8%EB%B2%95)


- [MathJax에서 유용한 TEX 명령어](https://www.onemathematicalcat.org/MathJaxDocumentation/MathJaxKorean/TeXSyntax_ko.html)


- [Symbols and Functions in KaTeX](https://utensil-site.github.io/available-in-katex/)


![mathjax1](/assets/images/legacy/1e6e2d333a.webp)

![mathjax2](/assets/images/legacy/06009a2de1.webp)

![mathjax3](/assets/images/legacy/619a0f6023.webp)

![mathjax4](/assets/images/legacy/02e2e24889.webp)

![mathjax5](/assets/images/legacy/04a9fdba4d.webp)

![mathjax6](/assets/images/legacy/045adc3ffd.webp)

![mathjax7](/assets/images/legacy/56bed568b1.webp)


- *1.* 여러 개 쓸 때 : $x_{i,j}^{next}$
   - `$x_{i,j}^{next}$`
- *2.* hat : $\hat y$
   - `$\hat y$`
- *3.* 띄어쓰기 : `$\ $`
- *4.* 경우 나누기 : mbox error (`$$` 로 묶지 않고 `\\( \\)`로 묶으면 가능한 것 같다.)
- *5.* dcases 이용하여 경우 나누기

```md
\begin{dcases}
   a &\text{if } b  \\
   c &\text{if } d
\end{dcases}
```

- *6.* 빈칸 조정

|기능|	문법|	나타나는 모양|
|---|---|---|
|double quad space|	`a \qquad b`	|$a \qquad b$
|quad space|	`a \quad b`	|$a \quad b$
|text space|	`a\ b`	|$a\ b$
|large space|	`a\;b`	|$a\;b$
|medium space|	`a\>b`	|[not supported]
|small space|	`a\,b`	|$a\,b$
|no space|	`ab`	|$ab$
|negative space|	`a\!b`	|$a\!b$

- *7.*
  - $\le$ : `$\le$`
  - $\ge$ : `$\ge$`
  - $\leftarrow$ : `$\leftarrow$`
  - $\rightarrow$ : `$\rightarrow$`

- *8.*
  - $\mathbb{RX}$ = `$\mathbb{RX}$`
  - $\sum_{k=1}^N k^2$ = `$\sum_{k=1}^N k^2$`
  - $\prod_{i=1}^N x_i$ = `$\prod_{i=1}^N x_i$`
  - $\lim_{n \to \infty}x_n$ = `$\lim_{n \to \infty}x_n$`
  - $\int_{-N}^{N} e^x\, dx$ = `$\int_{-N}^{N} e^x\, dx$`

- *9.*
  - ${\color{Blue}x^2}+{\color{Red}2x}-{\color{Green}1}$ = `${\color{Blue}x^2}+{\color{Red}2x}-{\color{Green}1}$`



## References

- [mathjax.org](https://www.mathjax.org/)
- [위키백과 - 매스잭스](https://ko.wikipedia.org/wiki/%EB%A7%A4%EC%8A%A4%EC%9E%AD%EC%8A%A4)
- [[Github 블로그] Mathjax로 수식(Math Expression) 쓰기](https://ansohxxn.github.io/blog/math-equation/)
- [mathjax 깃헙블로그 적용 및 문법](https://ghdic.github.io/math/default/mathjax-%EB%AC%B8%EB%B2%95/)
