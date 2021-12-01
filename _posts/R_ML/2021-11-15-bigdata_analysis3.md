---
layout: single
title: "빅데이터분석기사 실기 작업형(3) - 데이터 정제, 변환"
excerpt: "본 글은 빅데이터분석기사 실기 작업형에 대비하여 요약 및 실습한 것을 작성한 글입니다. 기출문제의 데이터는 https://github.com/ingu627/BigDataAnalysis에 데이터 셋을 남겨놨습니다."
categories: R_ML
tag : [R, visualization, adsp, certificate, 빅데이터 분석기사, 실기]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2021-12-01
---

본 글은 빅데이터분석기사 실기 작업형에 대비하여 요약 및 실습한 것을 작성한 글입니다. <br>기출문제의 데이터는 [https://github.com/ingu627/BigDataAnalysis](https://github.com/ingu627/BigDataAnalysis){: target="_blank"}에 데이터 셋을 남겨놨습니다.<br> 또한 해당 전체 코드는 `/concept/R_basic_to_pro_3.R` 파일에 담겨져 있습니다.
{: .notice--info}

## 데이터 정제

- **결측값(Missing Value)** : 입력이 누락된 값
  - R에서는 결측값을 NA(not avaiable)로 처리한다.
- **결측값 인식 함수**

- 1. `is.na(x)` : 데이터의 각 행(Row)과 변수(Column)별로 결측값이 있을 경우 TRUE, 아니면 FALSE로 출력 (**개별** 데이터의 결측값)

```R
library(dplyr)
ds_NA = airquality %>% 
head(5) %>% is.na()
ds_NA
#   Ozone Solar.R  Wind  Temp Month   Day
# 1 FALSE   FALSE FALSE FALSE FALSE FALSE
# 2 FALSE   FALSE FALSE FALSE FALSE FALSE
# 3 FALSE   FALSE FALSE FALSE FALSE FALSE
# 4 FALSE   FALSE FALSE FALSE FALSE FALSE
# 5  TRUE    TRUE FALSE FALSE FALSE FALSE
```

- 2. `complete.cases(x)` : 데이터의 **행**별로 결측값이 없으면 TRUE, 있으면 FALSE 출력 

```R
complete.cases(ds_NA)
# [1] TRUE TRUE TRUE TRUE FALSE
```

- 3. `colSums()` : 각 **컬럼**별 결측값의 개수는 summary 함수와 colSums 함수를 이용하여 확인이 가능하다.

```R
library(mlbench)
data(PimaIndiansDiabetes2)
pima2 = PimaIndiansDiabetes2
colSums(is.na(pima2))
# pregnant  glucose pressure  triceps  insulin     mass pedigree      age
#        0        5       35      227      374       11        0        0
# diabetes
#        0
```

## 단순 대치법

- 결측값을 그럴듯한 값으로 대체하는 통계적 기법

### 완전 분석법

- 데이터의 결측값이 존재하는 행(Row)을 삭제하여 완전한 데이터만 분석하는 기법 (Complete Analysis)

  - `데이터명[!is.na(데이터명),]`
  - `데이터명[complete.cases(데이터명),]`
  - `데이터명 %>% filter(!is.na(데이터명))`

```R
library(mlbench)
data(PimaIndiansDiabetes2)
pima2 = PimaIndiansDiabetes2
pima3 = pima2 %>% filter(!is.na(glucose) & !is.na(mass))
colSums(is.na(pima3))
# pregnant  glucose pressure  triceps  insulin     mass pedigree      age 
#        0        0       28      218      360        0        0        0
# diabetes
#        0

dim(pima3)
# 752개의 데이터 수 x 각 9개의 특성
# [1] 752   9

pima4=na.omit(pima3)
colSums(is.na(pima4))
# pregnant  glucose pressure  triceps  insulin     mass pedigree      age
#        0        0        0        0        0        0        0        0
# diabetes
#        0

dim(pima4)
# [1] 392   9
```

- `is.na` 함수를 이용하여 결측값이 있는 특정 행을 삭제할 수 있으며 `na.omit`함수를 이용하여 결측값이 있는 전체 행을 삭제할 수도 있다.
  - `na.omit(데이터명)`


### 평균 대치법

- `평균 대치법` : 데이터의 결측값을 평균값으로 변경하는 기법 (mean imputation)

```R
library(mlbench)
data(PimaIndiansDiabetes2)
pima2 = PimaIndiansDiabetes2
head(pima2$pressure)
# [1] 72 66 64 66 40 74
pima2$pressure = ifelse(
    is.na(pima2$pressure),
    mean(pima2$pressure, na.rm = TRUE),
    pima2$pressure
)
table(is.na(pima2$pressure))

# FALSE
#   768
```

## 이상값 

- 관측된 데이터의 범위에서 많이 벗어난 아주 작은 값이나 아주 큰 값
- 이상값은 통계적 기법의 ESD, 기하평균, 사분위수 등을 활용해 확인한다.

### ESD

- `u-3a < X < u+3a`

### 사분위수 활용 

- `Q1 - 1.5x(Q3-Q1) < data < Q3 + 1.5x(Q3-Q1)`
- **제 2사분위(중위수) 기준으로 사분위수 범위(Q3 -Q1 = IQR)의 1.5배를 한 값 이상인 값을 이상값으로 판단한다.**
- 박스 플롯의 `$stats` 변수를 이용하여 5가지 수치 요약에 대한 확인이 가능하다.

|구성요소|설명|
|---|---|
|최솟값|최솟값<br>$stat[1] 이용하여 확인|
|제 1사분위(Q1)|자료들의 하위 25%의 위치<br>$stats[2]|제 2사분위(Q2) (중위수)| 자료들의 50%의 위치로 중위수(Median)를 의미<br> $stats[2] 이용하여 확인|
|제 3사분위(Q3) | 자료들의 하위 75%를 의미<br> $stats[4] 이용하여 확인|
|최댓값|최댓값<br>$stats[5] 이용하여 확인|

- `quantile()` : 0%       25%       50%       75%      100% 로 보여준다.

### IQR 함수를 이용한 이상값 검출

- `IQR(x, na.rm, ...)` 

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

### scale()

- `scale(x, center = TRUE, scale =TRUE)`
  - `x` : 수치형 행렬 
  - `center` : 수치형 데이터 입력 시 center에 지정된 값으로 뺄셈 실행 (default : TRUE)
    - x의 평균으로 값을 빼서 정규화 수행
  - `scale` : 수치형 데이터 입력 시 scale에 지정된 값으로 나눗셈 실행 (default : TRUE)
    - x의 표준편차로 나누어서 정규화 수행
  - **X의 scale 적용 값** : `(X-center)/scale` 

### 최소-최대 정규화

- **최소-최대 정규화**(Min-Max Normalization) : 모든 데이터에 대해 각각의 최솟값 0, 최댓값 1로, 그리고 다른 값들은 0과 1사이의 값으로 변환한다. 
  - R의 scale 함수에서 center 값을 최댓값, scale값을 최댓값과 최솟값의 차이로 지정하면 최소-최대 정규화를 적용할 수 있다.
  - 공식 : `MinMax = (X-Min)/(Max-Min)`
- R에서는 기본 패키지의 scale 함수를 이용하여 정규화와 표준화를 수행할 수 있다.

```R
data=c(1,3,5,7,9)
data_minmax = scale(data, 
    center=1, scale=8)
data_minmax
#      [,1]
# [1,] 0.00
# [2,] 0.25
# [3,] 0.50
# [4,] 0.75
# [5,] 1.00
# attr(,"scaled:center")
# [1] 1
# attr(,"scaled:scale")
# [1] 8
```

### 표준화

- **표준화**(Standardization) : 어떤 특성의 값들이 정규분포를 따른다고 가정하고 값들을 0의 평균, 1의 표준편차를 갖도록 변환해주는 기법이다.
  - 표준화 공식 : `Z-스코어 = (X-u)/a`

```R
data=c(1,3,5,7,9)
data_minmax = scale(data)
data_minmax
#            [,1]
# [1,] -1.2649111
# [2,] -0.6324555
# [3,]  0.0000000
# [4,]  0.6324555
# [5,]  1.2649111
# attr(,"scaled:center")
# [1] 5
# attr(,"scaled:scale")
# [1] 3.162278
```

### preProcess()

- caret 패키지에서는 preProcess 함수를 통해서 표준화 등의 전처리를 수행할 수 있다.

1. preProcess 함수를 사용해서 변수변환에 필요한 parameter를 설정한다.
2. predict 함수를 통해서 실제로 값을 변화시킨다.

- 정규화(Normalization)는 preProcess의 `method="range"`인자로 구현할 수 있다.
- 표준화(Standardization)는 preProcess의 `method = c("center", "scale")` 인자로 구현할 수 있다.
- factor형은 계산 시 자동으로 제외가 된다.
- preProcess 객체를 `predict`함수를 사용해 데이터셋에 적용할 수 있다.

```R
library(caret)
data(iris)
idx = createDataPartition(iris$Species, p=0.6)
df_train = iris[idx$Resample1,]
df_test = iris[-idx$Resample1,]

norm = preProcess(df_train, method="range")
norm
# Created from 90 samples and 5 variables

# Pre-processing:
#   - ignored (1)
#   - re-scaling to [0, 1] (4)
norm$ranges
#      Sepal.Length Sepal.Width Petal.Length Petal.Width
# [1,]          4.4         2.2          1.2         0.1
# [2,]          7.9         4.1          6.9         2.5
scaled_df_train = predict(norm, df_train)
scaled_df_test = predict(norm, df_test)
summary(scaled_df_train)
#   Sepal.Length     Sepal.Width      Petal.Length      Petal.Width     
#  Min.   :0.0000   Min.   :0.0000   Min.   :0.00000   Min.   :0.00000
#  1st Qu.:0.2071   1st Qu.:0.3158   1st Qu.:0.05263   1st Qu.:0.08333
#  Median :0.4286   Median :0.4211   Median :0.57018   Median :0.54167  
#  Mean   :0.4216   Mean   :0.4561   Mean   :0.45068   Mean   :0.45694
#  3rd Qu.:0.5714   3rd Qu.:0.5789   3rd Qu.:0.68421   3rd Qu.:0.70833
#  Max.   :1.0000   Max.   :1.0000   Max.   :1.00000   Max.   :1.00000  
#        Species
#  setosa    :30
#  versicolor:30
#  virginica :30
```


## 표본 추출 및 집약처리 

- `sample(x, size, replace, prob)` : 단순 무작위 추출을 수행하는 함수

> 풀이 : x 범위의 숫자를 size개 추출 (replace 여부에 따라, 각각 확률(prob에 따라))

|주요 파라미터|설명|
|---|---|
|x|데이터 프레임 또는 벡터|
|size|추출 개수를 설정|
|replace|TRUE이면 복원 추출, FALSE이면 비복원 추출 설정(default)|
|prob|가중치 설정|

```R
sample(x=1:10, size=5, replace=FALSE)
# [1] 5 2 4 1 7
```

- `createDataPartition(y, times, p, list)` : 특정 비율로 데이터를 훈련 데이터와 평가 데이터로 랜덤하게 분할하는 함수 (caret 함수)

|주요 파라미터|설명|
|---|---|
|x|분할할 데이터(벡터) **기준**|
|times|생성할 분할의 수|
|p|**훈련 데이터**에서 사용할 데이터의 비율|
|list|결과를 리스트로 반활할지 여부(TRUE: 리스트 반환, FALSE: 행렬 반환)|

```R
library(caret)
ds = createDataPartition(
    iris$Species, times=1, p=0.7
)
ds
# $Resample1
#   [1]   1   2   3   4   5   8   9  11  12  13  16  17  18  19  20  21  26  27
#  [19]  28  29  30  31  33  34  35  36  39  40  43  44  45  46  47  48  49  51
#  [37]  52  53  54  56  58  60  61  62  64  66  67  68  70  72  73  74  75  76
#  [55]  78  81  82  83  84  86  87  88  90  91  92  93  95  96  97 100 101 102
#  [73] 103 105 106 107 108 109 110 111 113 115 117 119 121 122 123 124 125 126
#  [91] 130 131 132 133 135 136 137 138 140 141 144 145 146 147 148
idx = as.vector(ds$Resample1)
ds_train = iris[idx,]
ds_test = iris[-idx,]
```

- `createFolds(y, k, list, returnTrain)` : 데이터를 k-겹(k-fold)으로 교차 검증할 대 데이터를 분할하기 위한 함수
  - 훈련 단계에 따라 1개는 평가 데이터, k-1개는 훈련 데이터로 활용한다.

|주요 파라미터|설명|
|---|---|
|y|분할 대상 데이터(벡터) **기준**|
|k|겹(fold)으로 분할하는 개수(정수)|
|list|결과를 리스트로 반활할지 여부|
|returnTrain|list = TRUE일 경우에 같이 사용 (default: TRUE)<br>TRUE: 훈련 데이터의 위치 반환<br>FALSE: 평가 데이터의 위치 반환 (default: FALSE)|

```R
library(caret)
ds_k_fold = createFolds(
    iris$Species,
    k=3
)
ds_k_fold
$Fold1
#  [1]   1   5   6   8  14  16  18  19  20  24  29  36  37  38  47  49  50  54  56
# [20]  59  63  64  67  70  71  73  74  76  79  88  91  95  97 100 102 103 105 107
# [39] 117 123 124 127 131 135 136 140 144 145 146 149 150

# $Fold2
#  [1]   4   7   9  10  13  15  22  26  27  31  35  42  43  44  45  46  48  52  53
# [20]  57  60  62  65  68  69  72  78  82  83  86  87  89  98  99 101 106 109 112
# [39] 114 115 118 122 125 128 132 134 138 141 143 148

# $Fold3
#  [1]   2   3  11  12  17  21  23  25  28  30  32  33  34  39  40  41  51  55  58
# [20]  61  66  75  77  80  81  84  85  90  92  93  94  96 104 108 110 111 113 116
# [39] 119 120 121 126 129 130 133 137 139 142 147
```

## 기초 통계량 추출

- `mean(x, trim=0 na.rm = FALSE)` : 데이터의 평균을 출력하는 함수

|주요 파라미터|설명|
|---|---|
|x | 평균을 구하려는 값|
|trim | 평균을 구하려는 값에서 양 극단의 일정 부분을 뺄 때 사용.<br>trim=0.10의 의미는 x 양쪽에서 각각 0.10인 10%를 제외한 평균|
|na.rm|결측값을 제거할지 지정하는 논리(TRUE, FALSE) 값 (default: FALSE) |

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

```R
cnt = table(mtcars$cyl)
barplot(
    cnt,
    xlab = "기통",
    ylab = "수량",
    main = "기통별 수량")
```

![image](https://user-images.githubusercontent.com/78655692/141936804-5fb66ef8-dbe2-45e6-94d6-9f7bf23e368d.png)

```R
pie(
    cnt, main = "기통별 비율"
)
```

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

```R
summary(mtcars$wt)
#    Min. 1st Qu.  Median    Mean 3rd Qu.    Max.
#   1.513   2.581   3.325   3.217   3.610   5.424
head(mtcars$wt)
# [1] 2.620 2.875 2.320 3.215 3.440 3.460
str(mtcars)
# 'data.frame':   32 obs. of  11 variables:
#  $ mpg : num  21 21 22.8 21.4 18.7 18.1 14.3 24.4 22.8 19.2 ...
#  $ cyl : num  6 6 4 6 8 6 8 4 4 6 ...
#  $ disp: num  160 160 108 258 360 ...
#  $ hp  : num  110 110 93 110 175 105 245 62 95 123 ...
#  $ drat: num  3.9 3.9 3.85 3.08 3.15 2.76 3.21 3.69 3.92 3.92 ...
#  $ wt  : num  2.62 2.88 2.32 3.21 3.44 ...
#  $ qsec: num  16.5 17 18.6 19.4 17 ...
#  $ vs  : num  0 0 1 1 0 1 0 1 1 1 ...
#  $ am  : num  1 1 1 0 0 0 0 0 0 0 ...
#  $ gear: num  4 4 4 3 3 3 3 4 4 4 ...
#  $ carb: num  4 4 1 1 2 1 4 2 2 4 ...
```

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

```R
data(mtcars)
m1 = lm(hp~., data=mtcars)
m2 = step(m1, direction="both")
# Start:  AIC=216.97
# hp ~ mpg + cyl + disp + drat + wt + qsec + vs + am + gear + carb

#        Df Sum of Sq   RSS    AIC
# - qsec  1      39.6 14204 215.06
# - drat  1      55.6 14220 215.09
# - am    1     140.8 14306 215.28
# - gear  1     164.4 14329 215.34
# - cyl   1     446.2 14611 215.96
# - mpg   1     656.9 14822 216.42
# <none>              14165 216.97
# - vs    1    1140.5 15305 217.45
# - wt    1    1389.7 15554 217.96
# - carb  1    4799.2 18964 224.31
# - disp  1    5839.6 20004 226.01

# Step:  AIC=215.06
# hp ~ mpg + cyl + disp + drat + wt + vs + am + gear + carb

#        Df Sum of Sq   RSS    AIC
# - drat  1      50.6 14255 213.17
# - gear  1     184.3 14389 213.47
# - am    1     216.7 14421 213.54
# - cyl   1     565.0 14769 214.31
# - mpg   1     793.5 14998 214.80
# <none>              14204 215.06
# - vs    1    1133.8 15338 215.52
# + qsec  1      39.6 14165 216.97
# - wt    1    2577.3 16782 218.39
# - carb  1    5653.2 19858 223.78
# - disp  1    7460.7 21665 226.57

# Step:  AIC=213.17
# hp ~ mpg + cyl + disp + wt + vs + am + gear + carb

#        Df Sum of Sq   RSS    AIC
# - gear  1     172.8 14428 211.56
# - am    1     191.5 14446 211.60
# - cyl   1     722.9 14978 212.75
# - mpg   1     848.4 15103 213.02
# <none>              14255 213.17
# - vs    1    1139.2 15394 213.63
# + drat  1      50.6 14204 215.06
# + qsec  1      34.6 14220 215.09
# - wt    1    2528.3 16783 216.40
# - carb  1    5726.5 19981 221.98
# - disp  1    7415.0 21670 224.57

# Step:  AIC=211.56
# hp ~ mpg + cyl + disp + wt + vs + am + carb

#        Df Sum of Sq   RSS    AIC
# - am    1     396.7 14824 210.43
# - cyl   1     564.9 14993 210.79
# - mpg   1     808.0 15236 211.30
# <none>              14428 211.56
# - vs    1    1174.3 15602 212.06
# + gear  1     172.8 14255 213.17
# + qsec  1      53.3 14374 213.44
# + drat  1      39.0 14389 213.47
# - wt    1    3249.9 17678 216.06
# - disp  1    8286.4 22714 224.08
# - carb  1   12801.2 27229 229.88

# Step:  AIC=210.43
# hp ~ mpg + cyl + disp + wt + vs + carb

#        Df Sum of Sq   RSS    AIC
# - cyl   1     303.2 15128 209.07
# - mpg   1     599.2 15424 209.69
# - vs    1     843.7 15668 210.20
# <none>              14824 210.43
# + am    1     396.7 14428 211.56
# + gear  1     378.0 14446 211.60
# + qsec  1     209.5 14615 211.97
# + drat  1       6.7 14818 212.41
# - wt    1    5557.0 20381 218.61
# - disp  1    9845.0 24669 224.72
# - carb  1   23251.5 38076 238.61

# Step:  AIC=209.07
# hp ~ mpg + disp + wt + vs + carb

#        Df Sum of Sq   RSS    AIC
# - vs    1     580.3 15708 208.28
# <none>              15128 209.07
# - mpg   1    1048.7 16176 209.22
# + cyl   1     303.2 14824 210.43
# + qsec  1     256.7 14871 210.53
# + am    1     134.9 14993 210.79
# + drat  1      87.6 15040 210.89
# + gear  1      79.4 15048 210.91
# - wt    1    6327.7 21455 218.26
# - disp  1   17271.9 32400 231.44
# - carb  1   24482.5 39610 237.88

# Step:  AIC=208.28
# hp ~ mpg + disp + wt + carb

#        Df Sum of Sq   RSS    AIC
# - mpg   1     856.1 16564 207.98
# <none>              15708 208.28
# + vs    1     580.3 15128 209.07
# + gear  1     131.3 15577 210.01
# + drat  1      48.7 15659 210.18
# + cyl   1      39.8 15668 210.20
# + am    1      38.4 15669 210.20
# + qsec  1       2.3 15706 210.27
# - wt    1    5792.6 21501 216.32
# - disp  1   20461.9 36170 232.97
# - carb  1   26384.0 42092 237.82

# Step:  AIC=207.98
# hp ~ disp + wt + carb

#        Df Sum of Sq   RSS    AIC
# <none>              16564 207.98
# + mpg   1       856 15708 208.28
# + vs    1       388 16176 209.22
# + cyl   1       276 16288 209.44
# + drat  1       239 16325 209.51
# + qsec  1        67 16497 209.85
# + am    1        12 16552 209.95
# + gear  1         4 16560 209.97
# - wt    1      4961 21525 214.36
# - disp  1     26844 43408 236.81
# - carb  1     36686 53250 243.34

formula(m2)
# hp ~ disp + wt + carb
```

- `lm(hp~., data=mtcars)` 에서 `.`의 의미는 모든 독립변수를 넣겠다를 의미.

### 더미 변수(Dummy Variable) 생성 

- 회귀 분석에서 범주형 변수의 각 범주를 0과 1의 값만으로 표현하여 생성한 변수 

```R
중요도 <- c('상', '중', '하')
df = data.frame(중요도)
df
#   중요도
# 1     상
# 2     중
# 3     하
transform(
    df,
    변수1 = ifelse(중요도=='중', 1, 0),
    변수2 = ifelse(중요도=='하', 1,0))
#   중요도 변수1 변수2
# 1     상     0     0
# 2     중     1     0
# 3     하     0     1
```




## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264) 
- [R-caretpreProcess-수치형-데이터-정규화-표준화](https://yogyui.tistory.com/entry/R-caretpreProcess-%EC%88%98%EC%B9%98%ED%98%95-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%A0%95%EA%B7%9C%ED%99%94-%ED%91%9C%EC%A4%80%ED%99%94)