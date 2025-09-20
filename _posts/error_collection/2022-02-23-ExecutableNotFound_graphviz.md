---
layout: single
title: "[에러 해결 방법]  ExecutableNotFound: failed to execute 'dot', make sure the Graphviz executables are on your systems' PATH 일때"
categories: error
tags: [error, ExecutableNotFound, graphviz]
toc: true
sidebar_main: false

last_modified_at: 2022-02-23
---

<br>

## 원인 : ExecutableNotFound: failed to execute 'dot', make sure the Graphviz executables are on your systems' PATH 일때

- graphviz를 import해 쓰면 이런 에러가 뜰 수 있다.
- `pip install graphviz`로 설치해서 그렇다.

<br>
<br>

## 해결 방법

- 먼저 `pip uninstall graphviz`를 해 기존 버전을 제거해 준다.

<br>

- 명렬 프롬프트에서 `conda install python-graphviz`로 설치해준다.