---
layout: single
title: "R 기초 ~ 심화 문법 총정리 (3) - 데이터 정제, 분석 모형 선택"
excerpt: "+ ADsP, 빅데이터분석기사 실기 작업형 대비"
categories: R
tag : [R, visualization, adsp, certificate]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2021-11-16
---

## + 빅데이터분석기사 실기 작업형 대비 (데이터 정제, 분석 모형 선택)

본 글은 빅데이터분석기사 실기 작업형에 대비하여 요약 및 실습한 것을 작성한 글입니다. 해당 글의 코드를 보고 싶으신 분들은 [빅데이터 분석기사 R 코드](https://github.com/ingu627/BigDataAnalysis)를 참고하시길 바랍니다.
{: .notice--info}

# 데이터 정제

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

## 데이터의 범위 변환

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

# 분석 모형 선택

- **데이터 탐색**은 수집한 데이터를 분석하기 전에 그래프나 통계적인 방법을 이용하여 다양한 각도에서 데이터의 특징을 파악하고 자료를 직관적으로 바라보는 분석방법

## 범주형 데이터

- `table()` : 범주형 데이터에 대하여 빈도수를 탐색하는 함수
- `length()` : 전체 데이터의 개수를 구하는 함수
- `barplot()` : 빈도수에 대한 시각화(범주)
- `pie()` : 백분율 및 비율에 대해 시각화(범주)

![image](https://user-images.githubusercontent.com/78655692/141936746-95ae8e28-2990-4e4b-a058-6da5a3e5f2e8.png)

![image](https://user-images.githubusercontent.com/78655692/141936804-5fb66ef8-dbe2-45e6-94d6-9f7bf23e368d.png)

![image](https://user-images.githubusercontent.com/78655692/141939239-82f5f24c-4791-42cc-a77f-dfbaeca98f87.png)

![image](https://user-images.githubusercontent.com/78655692/141939286-47584e54-3bd5-4d4b-a744-fdcc271ce004.png)

## 수치형 데이터

*<u>요약 통계량</u>*

|함수 | 설명 |
|---|---|
|summary() | 요약 통계량 출력|
|head() | 데이터 앞부분 출력 |
|tail() | 데이터 뒷부분 출력 |
|str() | 데이터의 속성 출력 |
|View() | 뷰어 창에서 데이터 확인|
|dim() | 데이터의 차원(행, 열)을 출력

![image](https://user-images.githubusercontent.com/78655692/141940041-926cc46d-d9e4-4d2d-a455-d4c954be16af.png)

- `hist()` : 데이터에 대한 분포 시각화(수치)
- `boxplot()` : 데이터에 대한 분포 시각화(수치)

## 다차원 데이터 탐색 

### 1. 범주형 - 범주형 데이터

- `table()` : 빈도수와 비율 탐색 
- `prop.table()` : 비율에 대한 탐색
- `addmargins(x, margin)` : 빈도수와 비율 탐색
- `barplot()` 으로 시각화



### 2. 수치형 - 수치형 데이터

- `cor(x, y, method)` : 상관관계
  - `method=pearson` : 피어슨 상관 계수 (default)
    -  두 변수가 연속형 자료일 때
  - `method=kendall` : 켄달 순위 상관 계수
    - 두 변수가 순서 데이터일 때
  - `method=spearman` : 스피어만 순위 상관 계수 
    - 두 변수가 순서적 데이터일 때 
- `plot()` : 산점도를 통해 시각화

### 3. 범주형 - 수치형 데이터

- `aggregate(formula, data, FUN, ...)` : 그룹 간의 기술 통계량

|주요 파라미터|설명|
|---|---|
|formula | y~x 형식의 공식|
|data|분석 대상 데이터|
|FUN | 적용할 함수(mean, median 등)|

- `boxplot()` : 그룹 간의 시각화

## 상관 분석 

- **상관 분석**은 두 변수 사이에 존재하는 상호 연관성의 존재 여부와 연관성의 강도를 측정하여 분석하는 방법
- **공분산** : 2개의 변수 사이의 상관 정도를 나타내는 값
- `corrplot()` : 상관 계수 시각화 함수
- `cor.test(x, y, method)` : 상관 계수 검정 

### 변수 선택 

- 데이터의 독립변수(x) 중 종속변수(y)에 가장 관련성이 높은 변수(Feature)만을 선정하는 방법 

*<u>변수 선택을 위한 알고리즘 유형</u>*

|알고리즘 | 설명| 함수 |
|---|---|---|
|전진 선택법 | 모형을 가장 많이 향상시키는 변수를 하나씩 점진적으로 추가하는 방법|forward|
|후진 소거법| 모두 포함된 상태에서 시작하며 가장 적은 영향을 주는 변수부터 하나씩 제거하는 방법|backward|
|단계적 방법 | 전진 선택과 후진 소거를 함께 사용하는 방법|both|

- `step(object, scope, direction)` : AIC가 작아지는 방향으로 단계적으로 변수를 선택하는 함수
- `formula(x)` : step함수를 수행한 뒤 반환 값을 파라미터로 전달받아 포뮬러(종속변수 ~ 독립변수) 형태를 구하는 함수

![image](https://user-images.githubusercontent.com/78655692/141943481-7428bce8-7298-4f96-8e14-384c4c58e9f9.png)

- `lm(hp~., data=mtcars)` 에서 `.`의 의미는 모든 독립변수를 넣겠다를 의미.

### 더미 변수(Dummy Variable) 생성 

- 회귀 분석에서 범주형 변수의 각 범주를 0과 1의 값만으로 표현하여 생성한 변수 

![image](https://user-images.githubusercontent.com/78655692/141943958-57578bb4-6c20-4c5d-ba11-c20b1a23a72d.png)




## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264) 