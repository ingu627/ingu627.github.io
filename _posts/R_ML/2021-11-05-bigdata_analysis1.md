---
layout: single
title: "빅데이터분석기사 실기 작업형(1) - R 기본 문법"
excerpt: "본 글은 빅데이터분석기사 실기 작업형에 대비하여 요약 및 실습한 것을 작성한 글입니다. 기출문제의 데이터는 https://github.com/ingu627/BigDataAnalysis에 데이터 셋을 남겨놨습니다."
categories: R_ML
tag : [R, grammar, basic, pro, adsp, certificate, 빅데이터 분석기사, 실기, 작업형, 필답형, 자격증, dataq, 정리, pdf]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-03-31
---

<img align='right' width='200' height='200' src='https://user-images.githubusercontent.com/78655692/148633895-2be87d4e-7edb-4391-b583-eb2888b19bbb.png
'>
본 글은 빅데이터분석기사 실기 작업형에 대비하여 요약 및 실습한 것을 작성한 글입니다. <br>기출문제의 데이터는 [https://github.com/ingu627/BigDataAnalysis](https://github.com/ingu627/BigDataAnalysis){: target="_blank"}에 데이터 셋을 남겨놨습니다.<br> 또한 해당 전체 코드는 `/concept/R_basic_to_pro_1.R` 파일에 담겨져 있습니다. 
{: .notice--info}

혹시 해당 글을 pdf로 받고 싶으신 분은 이메일과 함께 댓글로 남겨주세요~
{: .notice--success}

<br>
<br>
<br>
<br>

## 기본 단축키 

- `ctrl + shift + c` : 해당 줄 주석 처리
- `#` : 해당 줄 주석 처리
- `ctrl + enter` : 해당 줄 실행
- `help(함수명, 데이터 세트)` : 함수명, 데이터 세트 등에 대한 설명을 해 주는 기능
- `ctrl + shift + m` : `%>%` 생성 

<br>
<br>

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

<br>
<br>

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

<br>
<br>

## 논리 연산자(Logic Operator)

|연산자|내용|
|---|---|
|& |모두 참이어야 참.<br/> 아님 거짓 |
|\| |하나만 참이여도 참.<br/> 모두 아닐 경우 거짓 |

<br>
<br>

## 대입 연산자(Assignment Operator)

|연산자|내용|
|---|---|
|= |왼쪽 변수에 오른쪽 값을 대입 |
|<-, <<- |왼쪽 변수에 오른쪽 값을 대입 |
|->, ->>|오른쪽 변수에 왼쪽 값을 대입 |

<br>
<br>

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

<br>
<br>

## 데이터의 값

- `NA` : Not Available의 약자. 데이터의 값이 없음 
- `NULL` : 변수가 초기화되지 않는 경우 
- `NAN` : Not a Number의 약자. 수학적으로 계산할 수 없는 값
- `INF` : INFinite의 약자. 무한대

<br>
<br>

### 변수 생성

- `=` : ~를 ~에 저장하여라 (할당)

```R
a=2
print(a)
# [1] 2
```

<br>
<br>

### == 또는 !=

- == : 맞는지 판단하여라
- != : 틀린지 판단하여라

```R
a = 2
a ==2
# [1] TRUE
a != 2
# [1] FALSE
```

<br>
<br>

## 벡터(Vector)

- c() = combind의 약자
- 벡터의 생성 
- c(값1, 값2...)

```R
x1 = c(1,2,3,4)
x1
# [1] 1 2 3 4
```

<br>
<br>

### seq()

- seq = sequence의 약자
- seq(from = 시작 숫자 , to = 마지막 숫자, by = 증가범위)

```R
x1 = c(1:10)
x1
# [1]  1  2  3  4  5  6  7  8  9 10

x2 = seq(1,10,2)
x2
# [1] 1 3 5 7 9
```

<br>
<br>

### rep()

- rep = repeat의 약자
- rep(반복할 값, 반복할 횟수)

```R
y = rep(1,10)
y
# [1] 1 1 1 1 1 1 1 1 1 1
y2 = rep(c(1,10),2)
y2
# [1]  1 10  1 10
y3 = rep(c(1,100), c(2,2))
y3
# [1]   1   1 100 100
```

<br>
<br>

### 벡터의 인덱싱

|구분 |설명 |
|---|---|
|벡터명[n] |벡터의 n번째 요소 반환|
|벡터명[-n] | 벡터에서 n번째 요소를 제외한 모든 요소 반환|
|벡터명[조건문] | 지정한 조건문을 만족하는 요소 반환|
|벡터명[a:b] | 벡터의 a번째 요소부터 b번째 요소까지 요소 반환|

<br>
<br>

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

<br>
<br>

## 리스트(List)

- 리스트는 (키, 값) 형태로 데이터를 저장하는 R의 모든 객체를 담을 수 있는 데이터 구조
- `list(key=value, key=value...)`

```R
a=list(
  x=c('poeun', 'pouen1'),
  y=c(1,2))
a$x  
# [1] "poeun"  "pouen1"
a$y
# [1] 1 2
```

<br>
<br>

## 행렬 
- **matrix()**: matrix(data = 데이터 , nrow = 행의 수, ncol = 열의 수, byrow = 행/열 기준, dimnames = 행과 열의 이름 리스트)
  - byrow는 TRUE이면 행을 기준으로 입력, FALSE이면 열을 기준으로 입력한다. (default = FALSE)

```R
x1=c(1:8)
x1
# [1] 1 2 3 4 5 6 7 8

MATRIX_R = matrix(
  data =x1,
  nrow =4
)
MATRIX_R
#      [,1] [,2]
# [1,]    1    5
# [2,]    2    6
# [3,]    3    7
# [4,]    4    8

MATRIX_C = matrix(
  data = x1,
  ncol = 4
)
MATRIX_C
#      [,1] [,2] [,3] [,4]
# [1,]    1    3    5    7
# [2,]    2    4    6    8
```

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

<br>
<br>

### data.frame()
- dataframe의 생성
- `data.frame(변수명1=벡터1)`

```R
DATA_SET = data.frame(
  x1 = c(1:10),
  x1_2 = seq(1,10,1),
  x2 = seq(1,10,2),
  y = rep(1,10)
)
head(DATA_SET, 3)
#   x1 x1_2 x2 y
# 1  1    1  1 1
# 2  2    2  3 1
# 3  3    3  5 1
```

- `names(데이터프레임) <- c(열이름1, 열이름2, ...)` : 데이터 프레임의 열 이름 지정
- ex. 특정열 이름을 바꾸고 싶을 때 (2번째 열 이름을 바꾸고자 한다면)
  - `names(데이터프레임)[2] <- c('바꿀 열이름')`

- `colnames(데이터프레임명)` : 데이터프레임의 열 이름 추출

+ head() : 데이터의 상단 부분을 지정해주는 행만큼 출력해주는 함수

<br>
<br>

### length()
- 1차원 벡터일 경우
- 벡터에 속한 원소의 갯수

```R
length(c(1:10))
# [1] 10
```

<br>
<br>

### dim() 
- 2차원 행렬, 데이터프레임인 경우
- 첫번째 : 행의 개수, 두번째 : 열의 개수

```R
dim(MATRIX_R)
# [1] 4 2

dim(DATA_SET)
# [1] 10  4
```

<br>
<br>

## 배열 문법
- 3차원 이상
- `array(data, dim, dimnames)`
  - **data** : 배열에 저장할 데이터 지정
  - **dim** : 배열의 차원을 c()로 묶어서 지정
  - **dimnames** : 배열의 차원 이름 지정

<br>
<br>

## 괄호의 활용
- `()` : 실행 함수와 같이 쓰임. ()안에는 분석하고자 하는 원소값들이 입력되어야 한다.
  - `c()` : 들어오는 값들을 묶어 하나의 벡터로 만드는 기능을 실행
- `{}` : for, if문 등에서 조건식을 삽입할 때

```R
a=c(1,2,3,4,5)
a
# [1] 1 2 3 4 5
```

<br>
<br>

### 1차원 데이터의 경우

```R
for(i in c(1:5)){
  print(i)
}
# [1] 1
# [1] 2
# [1] 3
# [1] 4
# [1] 5
```

```R
B = c() # 빈 공간의 벡터 생성

for(k in seq(1,10,2)){
  B=c(B,k)
}
B
# [1] 1 3 5 7 9
```

- `[]` : Index를 입력해야 될 때

```R
# 1, 2번째 값
a[1:2]
# [1] 1 2
# 3번째 값 빼고
a[-3]
# [1] 1 2 4 5
a[c(1,2,4,5)]
# [1] 1 2 4 5
```

<br>
<br>

### 2차원 데이터의 경우

```R
DATA_SET
#    x1 x1_2 x2 y
# 1   1    1  1 1
# 2   2    2  3 1
# 3   3    3  5 1
# 4   4    4  7 1
# 5   5    5  9 1
# 6   6    6  1 1
# 7   7    7  3 1
# 8   8    8  5 1
# 9   9    9  7 1
# 10 10   10  9 1

# 1행 전부
DATA_SET[1,]
#   x1 x1_2 x2 y
# 1  1    1  1 1

# 1열 전부
DATA_SET[,1]
#  [1]  1  2  3  4  5  6  7  8  9 10

# 1,2,3행 & 2열 빼고 나머지
DATA_SET[c(1,2,3),-2]
#   x1 x2 y
# 1  1  1 1
# 2  2  3 1
# 3  3  5 1
```

<br>
<br>

## 팩터(factor)

- 범주형 자료를 표현하기 위한 데이터 타입
- `factor(x, levels, labels, ordered)`
  - `x` : 범주형 데이터
  - `levels` : 구분하고자 하는 범주(레벨) 목록 지정
  - `labels` : 범주별 표시 값 지정
  - `ordered`
    - TRUE : 순서형
    - FALSE : 명목형 (default)

<br>
<br>

## 데이터 결합 (rbind(), cbind(), merge())

![image](https://user-images.githubusercontent.com/78655692/140970588-0c2b2ef9-75e3-4b45-b8a4-744fa189a4b3.png)

<br>
<br>

## 시간(날짜)형태
### as.Date()

- ‘년-월-일’ 형태
- as.Date(변수, format='날짜 형식')

```R
DATE_O = '2021-11-05'
str(DATE_O)
# chr "2021-11-05"
DATE_C = as.Date(DATE_O, format = '%Y-%m-%d')
str(DATE_C)
# Date[1:1], format: "2021-11-05"
```

<br>
<br>

- `str()` : 저장된 데이터 타입 확인
### as.POSIXct()

- ‘년-월-일 시간:분:초' 형태
- as.POSIXct(날짜, format = “날짜형식”)

```R
DATE_02 = '2021-11-05 23:13:23'
DATE_P = as.POSIXct(DATE_02, format = '%Y-%m-%d %H:%M:%S')
DATE_P
# [1] "2021-11-05 23:13:23 KST"
```

<br>
<br>

### format()
- 날짜정보를 추출해 새로운 변수로 만듦
- format(날짜변수, "형식")

```R
format(DATE_P, '%A')
# [1] "금요일"
format(DATE_P, '%M')
# [1] "13"
format(DATE_P, '%Y')
# [1] "2021"
```

<br>
<br>

### as()
- 변수 x를 ~로 취급하겠다.

```R
x=c(1,2,3,4,5,6,7,8,9,10)
x1 = as.integer(x) ; str(x1)
# int [1:10] 1 2 3 4 5 6 7 8 9 10
x2 = as.numeric(x) ; str(x2)
# num [1:10] 1 2 3 4 5 6 7 8 9 10
x3 = as.factor(x) ; str(x3)
# Factor w/ 10 levels "1","2","3","4",..: 1 2 3 4 5 6 7 8 9 10
x4 = as.character(x) ; str(x4)
# chr [1:10] "1" "2" "3" "4" "5" "6" "7" "8" "9" "10"
summary(x1)
#  Min. 1st Qu.  Median    Mean 3rd Qu.    Max. 
#  1.00    3.25    5.50    5.50    7.75   10.00
```

- `summary()` : 요약통계 한번에 보는 함수

<br>
<br>

## 데이터 타입 확인
- **is()** : 논리문으로써 변수 x가 ~인지 판단하여라
- 결괏값은 TRUE 또는 FALSE가 된다.

```R
x=c(1:5)
y=c("str1", "str2")
is.integer(x)
# [1] TRUE
is.numeric(x)
# [1] TRUE
is.factor(y)
# [1] FALSE
is.character(y)
# [1] TRUE
```

<br>
<br>

### sample()

- sample(데이터 추출 범위, 데이터 추출 갯수 , replace = “FALSE OR ”TRUE")
- `sample(x, size, replace=FALSE, prob=NULL)`
  - `replace=TRUE` : 복원추출 
  - `replace=FALSE` : 비복원추출
    - 주의사항 : TRUE, FALSE는 모두 대문자로!! 

```R
S1 =sample(1:45, 6, replace= FALSE)
S1
# [1] 39 11 35 20 37 27
```

<br>
<br>

### set.seed()

- 무작위 값 결과값 고정할 때
- 결과값이 똑같이 나온다.

```R
S2 = sample(1:45, 6, replace=FALSE)
S2
# [1]  8 31 15  9 42 45
```

<br>
<br>

## 조건문
### if ~ else

- 조건문
- if ~라면 이거 선택. 아니라면(=else) 이거 선택
- `%in%` : ~에 속해 있는지 확인

<br>
<br>

### if ~ else if ~ else

<script src="https://gist.github.com/ingu627/b7d5c72ccad88d81201edbe62cea76fe.js"></script>

<br>
<br>

### ifelse 문법

- `ifelse(조건식, 명령어1, 명령어2)` : 참이면 명령어1, 거짓이면 명령어2

```R
A = c(1,2,3,4,5)
if(7 %in% A){
  print('TRUE')
} else{
  print('FALSE')
}
# [1] "FALSE"
```

<br>
<br>

## switch 문 

- 조건에 따라 여러 개의 경로 중 하나를 선택하여 명령어를 실행하는 명령어

```R
course = "C"
switch(course,
       "A" = "brunch",
       "B" = "lunch",
       "dinner")
# [1] "dinner"
```

<br>
<br>

## 반복문 

### for 문

- 범위에 들어있는 각각의 값을 변수에 할당하고 블록 안의 문장을 수행

```R
for (i in 1:4){
  print(i)
}
# [1] 1
# [1] 2
# [1] 3
# [1] 4
```

<br>
<br>

### while 문 
- 조건문 참일 때 블록 안의 명령어들을 수행

```R
i=1
while (i<=4){
  print(i)
  i=i+1
}
# [1] 1
# [1] 2
# [1] 3
# [1] 4
```

<br>
<br>

### repeat 문 

```R
i=1
repeat {
  print(i)
  if (i>=2){
    break
  }
  i=i+1
}
# [1] 1
# [1] 2
```

<br>
<br>

### break 문 
- 반복문을 중간에 탈추하기 위해 사용하는 명령어

```R
for (i in 1:5){
  print(i)
  if (i>=3){
    break
  }
}
# [1] 1
# [1] 2
# [1] 3
```

<br>
<br>

### next 문 

- 반복문에서 다음 반복으로 넘어갈 수 있도록 하는 명령어
- 파이썬의 continue와 같은 개념

```R
for (i in 1:5){
  if (i == 3){
    next
  }
  print(i)
}
# [1] 1
# [1] 2
# [1] 4
# [1] 5
```

<br>
<br>

## function() 

- 사용자 함수 (직접 함수 만들기)

```R
Plus_One = function(x){
  y=x+1
  return (y)
}
Plus_One(3)
# [1] 4
```

<br>
<br>

### package(패키지) 설치하기
- `install.packages("설치할 패키지명")`
  - 설치할 땐 `""` O
- `library(설치한 패키지)`
  - 불러올 땐 `""` X

```R
install.packages('ggplot2')
# 'C:/Rlib'의 위치에 패키지(들)을 설치합니다.
# (왜냐하면 'lib'가 지정되지 않았기 때문입니다)
# --- 현재 세션에서 사용할 CRAN 미러를 선택해 주세요 ---
# URL 'https://cran.seoul.go.kr/bin/windows/contrib/4.1/ggplot2_3.3.5.zip'을 시도합니다
# Content type 'application/zip' length 4129789 bytes (3.9 MB)
# downloaded 3.9 MB

# package 'ggplot2' successfully unpacked and MD5 sums checked

# The downloaded binary packages are in
#         C:\Users\poeun\AppData\Local\Temp\RtmpCULWCS\downloaded_packages
library(ggplot2)
```

<br>
<br>

## ggplot 패키지

- ggplot 패키지의 기본 문법은 구성요소인 data, aes, geom을 기반으로 사용한다.

|주요 파라미터 | 설명 |
|---|---|
|data | 그래프를 그릴 객체명|
|aes(x,y) | x는 x축에 해당하는 컬럼명, y는 y축에 해당하는 컬럼명|
|geom_xx() | 그래프 지정 함수 |

- `geom_bar` : 막대그래프를 그리는 함수
- `geom_point` : 산점도를 그리는 함수
- `geom_line` : 선을 그리는 함수
- `geom_boxplot` : 박스 그래프를 그리는 함수

<br>
<br>

### geom_boxplot 예시

```R
head(airquality)
#   Ozone Solar.R Wind Temp Month Day
# 1    41     190  7.4   67     5   1
# 2    36     118  8.0   72     5   2
# 3    12     149 12.6   74     5   3
# 4    18     313 11.5   62     5   4
# 5    NA      NA 14.3   56     5   5
# 6    28      NA 14.9   66     5   6
```

```R
library(ggplot2)
ggplot(data=airquality, # 그래프에 필요한 객체인 airquality 대입
       aes(x=Month, # x축에 들어갈 칼럼명으로 Month 대입
           y=Temp, # y축에 들어갈 컬럼명으로 Temp 대입
           group=Month) # Month 기준으로 집계
       ) + geom_boxplot() #Boxplot으로 출력
```

![image](https://user-images.githubusercontent.com/78655692/141499918-c0a24422-60c9-4a8d-a77e-6ab1603bc5af.png)

<br>
<br>

## References

- [Must Learning with R (개정판)](https://wikidocs.net/book/4315)  
- [2021 ADsP 데이터 분석 준전문가](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=260287112)  
- [Do it! 쉽게 배우는 R 데이터 분석](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=113509180)  
- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264)  
- [R, Python 분석과 프로그래밍의 친구 (by R Friend) - R 데이터 프레임 결합 : rbind(), cbind(), merge()](https://rfriend.tistory.com/51)
- [데이터 자료 링크 (출처 : Must Learning with R. 저자 : DoublekPark)](https://www.dropbox.com/sh/vtqlvrgdts2yfez/AAD_cd49dBcvgBNdz-C-A6TFa?dl=0)