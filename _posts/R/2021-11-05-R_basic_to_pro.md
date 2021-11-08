---
layout: single
title: "R 기초 ~ 심화 문법 총정리"
excerpt: "+ ADsP, 빅데이터분석기사 실기 작업형 대비"
categories: R
tag : [R, grammar, basic, pro, adsp, certificate]
toc: true
toc_sticky: true
author_profile: false

last_modified_at: 2021-11-07
---

[데이터 자료 링크 (출처 : Must Learning with R. 저자 : DoublekPark)](https://www.dropbox.com/sh/vtqlvrgdts2yfez/AAD_cd49dBcvgBNdz-C-A6TFa?dl=0)

## 기본 단축키 
- `ctrl + shift + c` : 해당 줄 주석 처리
- `#` : 해당 줄 주석 처리
- `ctrl + enter` : 해당 줄 실행
- `help(함수명, 데이터 세트)` : 함수명, 데이터 세트 등에 대한 설명을 해 주는 기능


## R 기본문법

### =
- ~를 ~에 저장하여라 (할당)

![image](https://user-images.githubusercontent.com/78655692/140599832-4b217c79-78b1-4108-80d9-f6cb97d7b027.png)

### == 또는 !=
- == : 맞는지 판단하여라
- != : 틀린지 판단하여라

![image](https://user-images.githubusercontent.com/78655692/140600290-53ddd9cd-edfa-4007-90d6-1f581a43ef0e.png)

### c()
- c = combind의 약자
- 벡터의 생성 

![image](https://user-images.githubusercontent.com/78655692/140600214-e213c625-3a71-4b64-a2cd-dbac40eaa4cf.png)

### seq()
- seq = sequence의 약자
- seq(from = 시작 숫자 , to = 마지막 숫자, by = 증가범위)

![image](https://user-images.githubusercontent.com/78655692/140600249-5edf8ff0-ff59-47cf-af6a-cf6f451d87e4.png)

![image](https://user-images.githubusercontent.com/78655692/140600384-01848a0a-36b8-411e-98c7-24ccc68631c7.png)


### rep()
- rep = repeat의 약자
- rep(반복할 값, 반복할 횟수)

![image](https://user-images.githubusercontent.com/78655692/140600401-cd0a31a5-1f42-4c1b-a62e-2e001078823c.png)


### matrix()
- matrix(data = 데이터 , nrow = 행의 수, ncol = 열의 수, byrow = 행/열 기준)

![image](https://user-images.githubusercontent.com/78655692/140600476-324b8339-8ba7-4674-ac43-fb79f29bf61a.png)

### data.frame()
- dataframe의 생성

![image](https://user-images.githubusercontent.com/78655692/140600808-77521ee7-6ff2-42f7-b804-93253a8c1672.png)

+ head() : 데이터의 상단 부분을 지정해주는 행만큼 출력해주는 함수

### length()
- 1차원 벡터일 경우
- 벡터에 속한 원소의 갯수

![image](https://user-images.githubusercontent.com/78655692/140600917-ad66c993-49b3-44f9-bb6a-f267d592458b.png)

### dim() 
- 2차원 행렬, 데이터프레임인 경우
- 첫번째 : 행의 개수, 두번째 : 열의 개수

![image](https://user-images.githubusercontent.com/78655692/140600952-da5ff223-6640-4d06-8ee5-e3feb699b7f5.png)

### 괄호의 활용
- () : 실행 함수와 같이 쓰임. ()안에는 분석하고자 하는 원소값들이 입력되어야 한다.
  - c() : 들어오는 값들을 묶어 하나의 벡터로 만드는 기능을 실행
- \{\} : for, if문 등에서 조건식을 삽입할 때

### 1차원 데이터의 경우
![image](https://user-images.githubusercontent.com/78655692/140601094-6002fc95-d9c0-485c-a0cd-f2e60bcd9436.png)

![image](https://user-images.githubusercontent.com/78655692/140601141-c2f15d1a-417f-4ec5-b27c-7842a410d038.png)

- \[\] : Index를 입력해야 될 때

![image](https://user-images.githubusercontent.com/78655692/140601192-d99cd9cd-7f82-4384-9c27-af24b386f672.png)

### 2차원 데이터의 경우

![image](https://user-images.githubusercontent.com/78655692/140601268-b940387a-15b6-4b05-9271-0fa71d5bf3fc.png)

### 변수 형태 이해하기

|String Type|설명|
|---|---|
|chr | 문자열 형태|
|int | 숫자|
|num | 숫자|
|Factor | 명목형 변수|
|Posixct | 시간 변수|
|Tseries | 시계열 변수|

### 시간(날짜)형태
### as.Date()
- ‘년-월-일’ 형태
- as.Date(변수, format='날짜 형식')

![image](https://user-images.githubusercontent.com/78655692/140601480-e095d17f-2afb-47b8-b79d-7256c22e7b62.png)

- str() : 저장된 데이터 타입 확인
### as.POSIXct()
- ‘년-월-일 시간:분:초' 형태
- as.POSIXct(날짜, format = “날짜형식”)

![image](https://user-images.githubusercontent.com/78655692/140601645-b2c8d183-2927-4ca2-86cf-bfcf3121c833.png)

### format()
- 날짜정보를 추출해 새로운 변수로 만듦
- format(날짜변수, "형식")

![image](https://user-images.githubusercontent.com/78655692/140601665-b69c5fe1-3035-432c-a7d3-eab0bf704877.png)

### as()
- 변수 x를 ~로 취급하겠다.

![image](https://user-images.githubusercontent.com/78655692/140601732-36aee5ab-b0f4-4655-974e-b07aae8c61f3.png)

- summary() : 요약통계 한번에 보는 함수

### is()
- 논리문으로써 변수 x가 ~인지 판단하여라

![image](https://user-images.githubusercontent.com/78655692/140601808-2956a66c-7cc7-4d08-9375-1f6a02d126c9.png)

### sample()
- sample(데이터 추출 범위, 데이터 추출 갯수 , replace = “FALSE OR”TRUE")
  - `replace=TRUE` : 복원추출 
  - `replace=FALSE` : 비복원추출
    - 주의사항 : TRUE, FALSE는 모두 대문자로!! 

![image](https://user-images.githubusercontent.com/78655692/140601885-356b4494-2c1c-476c-8008-cf2ff43335d6.png)

### set.seed()
- 무작위 값 결과값 고정할 때
- 결과값이 똑같이 나온다.

![image](https://user-images.githubusercontent.com/78655692/140601918-8e70869a-4d77-485f-b5bf-6be515f73b11.png)

### if ~ else
- 조건문
- if ~라면 이거 선택. 아니라면(=else) 이거 선택
- `%in%` : ~에 속해 있는지 확인

![image](https://user-images.githubusercontent.com/78655692/140601984-bf276c40-c90e-4a84-a50c-a09d77904295.png)

### function() 
- 사용자 함수 (직접 함수 만들기)

![image](https://user-images.githubusercontent.com/78655692/140602035-b6aa408b-8f42-4136-904c-85f0f5d765c9.png)

### package(패키지) 설치하기
- `install.packages("설치할 패키지명")`
  - 설치할 땐 `""` O
- `library(설치한 패키지)`
  - 불러올 땐 `""` X

![image](https://user-images.githubusercontent.com/78655692/140602188-2a541568-45e8-4bfe-af65-d1968a0a572c.png)






## References
[Must Learning with R (개정판)](https://wikidocs.net/book/4315)  
[2021 ADsP 데이터 분석 준전문가](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=260287112)  
[Do it! 쉽게 배우는 R 데이터 분석](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=113509180)  
[2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264)  

