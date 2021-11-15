---
layout: single
title: "R 기초 ~ 심화 문법 총정리 (3) - 데이터 정제"
excerpt: "+ ADsP, 빅데이터분석기사 실기 작업형 대비"
categories: R
tag : [R, visualization, adsp, certificate]
toc: true
toc_sticky: true
author_profile: false

last_modified_at: 2021-11-15
---

## + 빅데이터분석기사 실기 작업형 대비

## 데이터 정제

- **결측값(Missing Value)** : 입력이 누락된 값
  - R에서는 결측값을 NA(not avaiable)로 처리한다.
- **결측값 인식 함수**
1. `is.na(x)` : 데이터의 각 행(Row)과 변수(Column)별로 결측값이 있을 경우 TRUE, 아니면 FALSE로 출력 
2. `complete.cases(x)` : 데이터의 행별로 결측값이 없으면 TRUE, 있으면 FALSE 출력 

![image](https://user-images.githubusercontent.com/78655692/141804732-4be2759a-66da-491d-b979-3c68f1a08d6f.png)

## 완전 분석법

- `is.na` 함수를 이용하여 결측값이 있는 특정 행을 삭제할 수 있으며 `na.omit`함수를 이용하여 결측값이 있는 전체 행을 삭제할 수도 있다.

## 단순 대치법

- 결측값을 그럴듯한 값으로 대체하는 통계적 기법
- `평균 대치법` : 데이터의 결측값을 평균값으로 변경하는 기법

## 이상값 

- 관측된 데이터의 범위에서 많이 벗어난 아주 작은 값이나 아주 큰 값
- 이상값은 통계적 기법의 ESD, 기하평균, 사분위수 등을 활용해 확인한다.

## 데이터 변환 

|함수|설명|
|---|---|
|as.character()|문자형으로 변환|
|as.numeric()|숫자형으로 변환|
|as.double()|실수형으로 변환|
|as.logical()|논리형으로 변환|
|as.integer()|정수형으로 변환|

## 자료구조 변환 

|함수| 설명|
|---|---| 
|as.data.frame()|데이터를 데이터 프레임으로 변환|
|as.list()|데이터를 리스트로 변환|
|as.matrix()|데이터를 행렬로 변환|
|as.vector()|데이터를 벡터로 변환|
|as.factor()|데이터를 요인으로 변환|

# 데이터의 범위 변환

- R에서는 기본 패키지의 scale 함수를 이용하여 정규화와 표준화를 수행할 수 있다.
- `sacle(x, center = TRUE, scale =TRUE)`
  - `x` : 수치형 행렬 
  - `center` : 수치형 데이터 입력 시 center에 지정된 값으로 뺄셈 실행 (default : TRUE)
    - x의 평균으로 값을 빼서 정규화 수행
  - `scale` : 수치형 데이터 입력 시 scale에 지정된 값으로 나눗셈 실행 (default : TRUE)
    - x의 표준편차로 나누어서 정규화 수행

## 표본 추출 및 집약처리 

- `sample(x, size, replace, prob)` : 단순 무작위 추출을 수행하는 함수

|주요 파라미터|설명|
|---|---|
|x|데이터 프레임 또는 벡터|
|size|추출 개수를 설정|
|replace|TRUE이면 복원 추출, FALSE이면 비복원 추출 설정(default)|
|prob|가중치 설정|

- `createDataPartition(y, times, p, list)` : 특정 비율로 데이터를 훈련 데이터와 평가 데이터로 랜덤하게 분할하는 함수

|주요 파라미터|설명|
|---|---|
|x|분할할 데이터(벡터)|
|times|생성할 분할의 수|
|p|훈련 데이터에서 사용할 데이터의 비율|
|list|결과를 리스트로 반활할지 여부(TRUE: 리스트 반환, FALSE: 행렬 반환)|

- `createFolds(y, k, list, returnTrain)` : 데이터를 k-겹(k-fold)으로 교차 검증할 대 데이터를 분할하기 위한 함수
  - 훈련 단계에 따라 1개는 평가 데이터, k-1개는 훈련 데이터로 활용한다.

|주요 파라미터|설명|
|---|---|
|y|분할 대상 데이터(벡터)|
|k|겹(fold)으로 분할하는 개수(정수)|
|list|결과를 리스트로 반활할지 여부|
|returnTrain|list = TRUE일 경우에 같이 사용<br>TRUE: 훈련 데이터의 위치 반환<br>FALSE: 평가 데이터의 위치 반환|

## 기초 통계량 추출

- `mean(x, trim=0 na.rm = FALSE)` : 데이터의 평균을 출력하는 함수

|주요 파라미터|설명|
|---|---|
|x | 평균을 구하려는 값|
|trim | 평균을 구하려는 값에서 양 극단의 일정 부분을 뺄 때 사용.<br>trim=0.10의 의미는 x 양쪽에서 각각 0.10인 10%를 제외한 평균|
|na.rm|결측값을 제거할지 지정하는 논리(TRUE, FALSE) 값 |

- `median(x, na.rm = FALSE)` : 데이터의 중위수를 출력하는 함수
- `var()` : 분산
- `sd()` : 표준편차
- `row_number(x)` : 데이터값의 순위 index를 출력하는 함수

## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264) 