---
layout: single
title: "[에러 해결 방법]  ExecutableNotFound: failed to execute 'dot', make sure the Graphviz executables are on your systems' PATH 일때"
categories: error
tags: [error, ExecutableNotFound, graphviz]
toc: true
sidebar_main: false

last_modified_at: 2026-10-09
---

graphviz를 `pip install graphviz`로 설치한 뒤 `dot` 실행 파일을 찾지 못해 발생하는 ExecutableNotFound 에러가 있다. 이 글은 해당 에러의 원인과 해결 방법을 정리한다.

> 이 글은 2022년 당시 conda 환경 기준으로 작성된 설치 기록이다. 최신 버전에서는 명령이 다를 수 있다.

## 에러 메시지

```
ExecutableNotFound: failed to execute 'dot', make sure the Graphviz executables are on your systems' PATH
```

## 원인

- graphviz를 import해 쓰면 이런 에러가 뜰 수 있다.
- `pip install graphviz`로 설치해서 그렇다.

## 해결 방법

1. 먼저 `pip uninstall graphviz`를 해 기존 버전을 제거해 준다.
2. 명렬 프롬프트에서 `conda install python-graphviz`로 설치해준다.