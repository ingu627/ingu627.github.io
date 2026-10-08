---
name: ingu627-blog-style
description: "Use when writing, editing, or reviewing posts for ingu627.github.io (Jekyll + minimal-mistakes Korean tech blog): front-matter contract, genre selection, outline, and voice conventions."
---

# ingu627 블로그 포스트 스타일 가이드

ingu627.github.io — Jekyll + minimal-mistakes, `_posts/<카테고리>/YYYY-MM-DD-slug.md`. 215편 전수 분석(2026-10)으로 검증한 규약이다. "공부한 걸 정리해 남기는 학습 기록"이 뿌리이고, 2025년부터는 "남에게 보여주는 자기완결 개념 문서"로 진화 중이다.

## 페르소나
- 분산 시스템·ML 박사과정을 거친 개발자. OS, 스파크, cs231n, keras → SQL → LLM/RAG/K8s로 관심사 확장.
- 배우면서 정리하는 학습자 시점: "개인 공부 및 리뷰를 위해 쓴 글입니다", "공부하면서 자연스럽게 나온 것들을 정리해보았습니다".
- 본문은 전부 한국어, 한다체. 도입부(excerpt·첫 문단)만 ~습니다체 혼용.
- 어려운 용어는 겁내지 않고 비유로 푼다: "RAG는 오픈북 시험과 같다. LLM은 학생이고 청킹은 참고서를 요약 노트로 만드는 과정이다."

## 프론트매터 계약 (215/215 준수 확인)
```yaml
---
layout: single
layout: single        # ← 실제로는 이 값 하나만
title: "..."
excerpt: "본문 요약 1~2문장. 예전 스타일은 '+ 키워드, 키워드, ...' 나열 추가"
categories: [llm]     # 2025 스타일 배열. 구글(posts)은 categories: R_ML 처럼 스칼라
tags: [llm, rag, 청킹, chunking, 정리, 설명]
toc: true
toc_sticky: true      # 긴 글/시리즈면 true
sidebar_main: true
date: 2025-09-21
last_modified_at: 2025-09-21
---
```
- 6키는 무조건: `layout: single`, `title`, `excerpt`, `categories`, `sidebar_main`, `last_modified_at`.
- `toc: true`가 기본. `tags`는 인라인 배열, 소문자 기술명 + 한글 태그(정리/설명/란/리뷰/정의/기초) 섞기.
- 카테고리는 기존 목록에서만 선택: llm, web, tips, sql, docker, paper, code, python, OS, DS, cs231n, keras, spark, R_ML, mlops, error, git, git_blog, hadoop, linux, java, md.

## 장르 고르기 (전체 분포 기준)
| 장르 | 언제 | 예시 |
|---|---|---|
| study_notes (59%) | 강의·책·공식문서를 따라 정리 | "운영체제(OS) - CPU Scheduling (4)", "[CS231n] 강의10 LSTM 리뷰" |
| howto (16%) | 설치·세팅·명령어 절차 | tips/, docker, git. "~ 설치", "~ 사용법" |
| paper_review (9%) | 논문 1편 리뷰. 제목에 `[논문 리뷰]` 접두어, 본문 첫머리에 논문 출처 링크 | paper/ |
| concept (2025 신형) | 단일 주제를 자기 말로 재구성한 완결 문서 | llm/, web/의 "~ 완벽 가이드: 기초부터 고급 전략까지" |
| troubleshooting | 겪은 오류 기록. 파일명 = 오류 메시지 | error_collection/ |
| reference | 문법·명령어 조각 모음 | "MySQL 문법 및 예제 정리 - 윈도우 함수, LAG, LEAD" |

## 구조 (핵심: 2단 개요)
- `##` 큰 섹션 4~8개, 각 섹션 아래 `###` 하위절. 평균 h2 6개 × h3 7개.
- 학습노트는 원본의 챕터 구조와 번호를 그대로 보존: `## 1. Introduction`.
- concept 글: 비유로 시작하는 서론 → `## 파트 1: 주제 — 왜 ~인가` → `### 1.1`, `### 1.2` → 파트 반복.
- 섹션 사이 빈 줄 + `<br>` 한 줄.
- 연재 시리즈는 제목 끝에 (1) (2) (3) 넘버링.

## 시그니처 동작 (본문 패턴)
- 용어 첫 등장: **한글 (English)** 병기 → 필요하면 바로 아래 하위 불릿으로 정의.
- 계층 불릿: 상위 불릿 = 서술, 하위 불릿 = **용어**: 풀이.
- 목차/출처 안내는 본문 첫머리에 수동 나열 + `{: .notice--info}` 박스:
  ```
  논문 출처 : [NSDI 12 paper](https://...)
  {: .notice--info}
  ```
- 인용은 각주 `[^N]` (2025 스타일). 구글은 본문 inline 정의.
- 대표 이미지는 본문 첫 줄 right-align: `<img align='right' width='250' src='...'>`.
- 긴 코드는 gist 임베드(`<script src="https://gist.github.com/ingu627/....js"></script>`), 짧은 코드는 ``` 블록. 평균 코드블록 1~2개 — 글 대부분은 설명이 주체.
- 수식은 필요할 때만($$, 전체의 13%). mathjax 플래그는 필요시에만.

## 제목·excerpt 패턴
- 학습노트: `[강의/책 이름] 강의N 주제 리뷰`, `주제 - 소주제 (N)`
- 정리: `A 정리`, `MySQL 문법 및 예제 정리 - 주제`
- 구현: `~ 구현해보기`, `~ 살펴보기`
- concept: `A 완벽 가이드: 기초부터 고급 전략까지`
- excerpt는 본문을 요약한 1~2문장. 예전 글은 키워드 나열을 덧붙임.

## 하지 말 것
- 영어 본문, 소제목 없는 장문 단락, 원본 챕터 번호 임의 변경.
- 새 카테고리/레이아웃 변수 임의 추가, 프론트매터 키 생략.
- 과도한 코드 나열(블로그 문법 리뷰 글이 아니면 설명이 주인공).

## 집필 전 체크리스트
1. 장르 정했나? → 제목/구조가 그 장르 패턴과 일치?
2. 프론트매터 6키 + toc/tags 완비?
3. 처음 나오는 영어 용어 병기했나?
4. 섹션 2단 개요(## + ###) 유지? 섹션 사이 `<br>`?
5. 학습자 시점 문장 한 줄(왜 이 글을 썼는지) 들어갔나?
6. 참고 자료 출처를 notice--info 박스나 각주로 남겼나?
