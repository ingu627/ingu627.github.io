---
layout: single
title: "Git Blog에서 글 작성 시 수식 사용하기 (Mathjax)"
categories: git_blog
tag : [git, blog, markdown, 마크다운, Mathjax, 문법]
toc : True
sidebar_main: true

last_modified_at: 2021-11-29
---

![image](https://user-images.githubusercontent.com/78655692/143910921-4b7d1a55-d2b0-49ee-b721-20ce1376df0b.png)

## Mathjax란

- MathML, LaTeX 및 ASCIIMathML 마크 업을 사용하여 웹 브라우저에 수학 표기법을 표시하는 크로스 브라우저 JavaScript 라이브러리이다.
- 웹 사이트에서 수학식 표시가 가능하다.

## 웹에서 Mathjax 설치하기 

- 사실 minimal mistakes 테마를 쓰고 있다면 별도의 추가를 할 필요가 없다.
- `_includes`내에 `mathjax_support.html`이 포함되어 있기 때문에 `_config.yml`에서 `use_math: true` 를 추가해 주면 된다.

![image](https://user-images.githubusercontent.com/78655692/143912853-d285ab04-e93d-49e3-98a5-6ece634980b6.png)

![image](https://user-images.githubusercontent.com/78655692/143913025-dfb7c5f4-dce6-458f-a1ae-0d7a51b942d1.png)

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

## 그 외 수식은 주석에 있으니 참고하면 된다. ($\alpha$나 $\beta$ 같은 것들)

<br>
<br>

## References

- [mathjax.org](https://www.mathjax.org/)
- [위키백과 - 매스잭스](https://ko.wikipedia.org/wiki/%EB%A7%A4%EC%8A%A4%EC%9E%AD%EC%8A%A4)
- [[Github 블로그] Mathjax로 수식(Math Expression) 쓰기](https://ansohxxn.github.io/blog/math-equation/)
- [mathjax 깃헙블로그 적용 및 문법](https://ghdic.github.io/math/default/mathjax-%EB%AC%B8%EB%B2%95/)
- [TeXRefCard.v1.5.pdf](https://github.com/ingu627/Temporary_Storage/files/7619974/TeXRefCard.v1.5.pdf)
