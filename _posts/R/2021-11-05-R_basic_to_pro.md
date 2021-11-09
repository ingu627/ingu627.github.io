---
layout: single
title: "R 기초 ~ 심화 문법 총정리"
excerpt: "+ ADsP, 빅데이터분석기사 실기 작업형 대비"
categories: R
tag : [R, grammar, basic, pro, adsp, certificate]
toc: true
toc_sticky: true
author_profile: false

last_modified_at: 2021-11-09
---

## 기본 단축키 
- `ctrl + shift + c` : 해당 줄 주석 처리
- `#` : 해당 줄 주석 처리
- `ctrl + enter` : 해당 줄 실행
- `help(함수명, 데이터 세트)` : 함수명, 데이터 세트 등에 대한 설명을 해 주는 기능

## 산술 연산자(Arithmetic Operator)

|연산자|내용|
|---|---|
|+ |값을 더함 |
|- |값을 뺌|
|* |값을 곱함|
|/ |값을 나눔(몫 + 나머지)|
|%% |나머지만 나옴|
|%/% |몫만 나옴|
|^ | 지수 계산 |
|** | 지수 계산|

## 관계 연산자(Relation Operator)
- `TRUE` or `FALSE`로 결과값이 나옴 

|연산자|내용|
|---|---|
|> |크냐 |
|< |작냐 |
|>= |크거나 같냐 |
|<= |작거나 같냐 |
|== |같냐 |
|!= |같지 아니 하느냐 |

## 논리 연산자(Logic Operator)

|연산자|내용|
|---|---|
|& |모두 참이어야 참.<br/> 아님 거짓 |
|\| |하나만 참이여도 참.<br/> 모두 아닐 경우 거짓 |

## 대입 연산자(Assignment Operator)

|연산자|내용|
|---|---|
|= |왼쪽 변수에 오른쪽 값을 대입 |
|<-, <<- |왼쪽 변수에 오른쪽 값을 대입 |
|->, ->>|오른쪽 변수에 왼쪽 값을 대입 |

## 변수 형태 이해하기

- `mode(x)` : 객체 형식 반환 
  - `numeric`, `character`, `logical` 중 하나의 값 출력
- `typeof(x)` : 정수형은 `integer`, 실수형은 `double`로 반환하고, 나머지는 mode함수와 동일

|String Type|설명|
|---|---|
|chr | 문자열 형태|
|int | 숫자|
|num | 숫자|
|Factor | 명목형 변수|
|Posixct | 시간 변수|
|Tseries | 시계열 변수|

## 데이터의 값

- `NA` : Not Available의 약자. 데이터의 값이 없음 
- `NULL` : 변수가 초기화되지 않는 경우 
- `NAN` : Not a Number의 약자. 수학적으로 계산할 수 없는 값
- `INF` : INFinite의 약자. 무한대

### 변수 생성

- `=` : ~를 ~에 저장하여라 (할당)

![image](https://user-images.githubusercontent.com/78655692/140599832-4b217c79-78b1-4108-80d9-f6cb97d7b027.png)

### == 또는 !=
- == : 맞는지 판단하여라
- != : 틀린지 판단하여라

![image](https://user-images.githubusercontent.com/78655692/140600290-53ddd9cd-edfa-4007-90d6-1f581a43ef0e.png)

## 벡터(Vector)

- c() = combind의 약자
- 벡터의 생성 
- c(값1, 값2...)

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

### 벡터의 인덱싱

|구분 |설명 |
|---|---|
|벡터명[n] |벡터의 n번째 요소 반환|
|벡터명[-n] | 벡터에서 n번째 요소를 제외한 모든 요소 반환|
|벡터명[조건문] | 지정한 조건문을 만족하는 요소 반환|
|벡터명[a:b] | 벡터의 a번째 요소부터 b번째 요소까지 요소 반환|

### 벡터 함수 

|함수|설명|
|---|---|
|sqrt(x)|제곱근|
|log(x)|로그|
|abs(x)|절댓값|
|round(x)|반올림|
|trunc(x)|소수점 버림|
|mean(x)|평균|
|sum(x)|합계|
|median(x)|중앙값|
|range(x)|범위(최솟값, 최댓값)출력|
|sd(x)|표준편차|
|var(x)|분산|
|cov(x,y)|공분산|
|cor(x,y)|상관계수|
|min(x)|최솟값|
|max(x)|최댓값|
|union(x,y)|합집합|
|intersect(x,y)|교집합|
|setdiff(x,y)|차집합(방향 고려 필요)|

## 리스트(List)

- 리스트는 (키, 값) 형태로 데이터를 저장하는 R의 모든 객체를 담을 수 있는 데이터 구조
- `list(key=value, key=value...)`

![image](https://user-images.githubusercontent.com/78655692/140793219-4ba4b1c8-66ca-4f83-88ef-1d2ff595e364.png)


## 행렬 
- **matrix()**: matrix(data = 데이터 , nrow = 행의 수, ncol = 열의 수, byrow = 행/열 기준, dimnames = 행과 열의 이름 리스트)
  - byrow는 TRUE이면 행을 기준으로 입력, FALSE이면 열을 기준으로 입력한다. (default = FALSE)

![image](https://user-images.githubusercontent.com/78655692/140600476-324b8339-8ba7-4674-ac43-fb79f29bf61a.png)

|함수|설명|
|---|---|
|dim(x) |x 행렬의 차원 확인 |
|dim(x)<-c(m,n)| x 벡터/행렬을 m x n 행렬로 변환|
|nrow(x) | x 행렬 행의 수 확인 |
|ncol(x) | x 행렬 열의 수 확인 |
|x[m, n] | x 행렬의 m행 n열의 원소 추출|
|x[m, ] | x 행렬의 m행에 접근 |
|x[ ,m] | x 행렬의 n열에 접근 |
|rownames(x) | x 행렬의 행 이름 출력 |
|colnames(x) | x 행렬의 열 이름 출력 |

### data.frame()
- dataframe의 생성
- `data.frame(변수명1=벡터1)`

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

## 배열 문법
- 3차원 이상
- `array(data, dim, dimnames)`
  - **data** : 배열에 저장할 데이터 지정
  - **dim** : 배열의 차원을 c()로 묶어서 지정
  - **dimnames** : 배열의 차원 이름 지정

## 괄호의 활용
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

## 팩터(factor)

- 범주형 자료를 표현하기 위한 데이터 타입
- `factor(x, levels, labels, ordered)`
  - `x` : 범주형 데이터
  - `levels` : 구분하고자 하는 범주(레벨) 목록 지정
  - `labels` : 범주별 표시 값 지정
  - `ordered`
    - TRUE : 순서형
    - FALSE : 명목형 (default)

## 데이터 결합 (rbind(), cbind(), merge())

![image](https://user-images.githubusercontent.com/78655692/140970588-0c2b2ef9-75e3-4b45-b8a4-744fa189a4b3.png)


## 시간(날짜)형태
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

## 데이터 타입 확인
- **is()** : 논리문으로써 변수 x가 ~인지 판단하여라
- 결괏값은 TRUE 또는 FALSE가 된다.

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

## 조건문
### if ~ else
- 조건문
- if ~라면 이거 선택. 아니라면(=else) 이거 선택
- `%in%` : ~에 속해 있는지 확인

### if ~ else if ~ else

<script src="https://gist.github.com/ingu627/b7d5c72ccad88d81201edbe62cea76fe.js"></script>

### ifelse 문법

- `ifelse(조건식, 명령어1, 명령어2)` : 참이면 명령어1, 거짓이면 명령어2

![image](https://user-images.githubusercontent.com/78655692/140601984-bf276c40-c90e-4a84-a50c-a09d77904295.png)

## switch 문 

- 조건에 따라 여러 개의 경로 중 하나를 선택하여 명령어를 실행하는 명령어

![image](https://user-images.githubusercontent.com/78655692/140971669-9bd918b6-8918-41aa-a313-d32dc0e8c771.png)

## 반복문 

### for 문
- 범위에 들어있는 각각의 값을 변수에 할당하고 블록 안의 문장을 수행

![image](https://user-images.githubusercontent.com/78655692/140971992-85405168-9d91-47a4-b82f-a904ced6456f.png)

### while 문 
- 조건문 참일 때 블록 안의 명령어들을 수행

![image](https://user-images.githubusercontent.com/78655692/140972176-4db938d2-b6e8-41e1-8953-e6adbca74b2b.png)

### repeat 문 

![image](https://user-images.githubusercontent.com/78655692/140972514-8afc06e5-48ca-4d03-8ac7-334555e66f9d.png)

### break 문 
- 반복문을 중간에 탈추하기 위해 사용하는 명령어

![image](https://user-images.githubusercontent.com/78655692/140972812-bdde4d92-24e2-424d-873f-e6eeaa39df23.png)

### next 문 
- 반복문에서 다음 반복으로 넘어갈 수 있도록 하는 명령어
- 파이썬의 continue와 같은 개념

![image](https://user-images.githubusercontent.com/78655692/140973004-c75a1f7b-998d-4d69-beaf-f5627fb1dc46.png)


## function() 
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
[R, Python 분석과 프로그래밍의 친구 (by R Friend) - R 데이터 프레임 결합 : rbind(), cbind(), merge()](https://rfriend.tistory.com/51)
[데이터 자료 링크 (출처 : Must Learning with R. 저자 : DoublekPark)](https://www.dropbox.com/sh/vtqlvrgdts2yfez/AAD_cd49dBcvgBNdz-C-A6TFa?dl=0)