---
layout: single
title: "R 기초 ~ 심화 문법 총정리 (7) - 분석 모형 구축"
excerpt: "+ ADsP, 빅데이터분석기사 실기 작업형 대비 - 연관성 분석까지"
categories: R
tag : [R, adsp, certificate, 빅데이터 분석기사, 실기]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2021-11-25
---

## + 빅데이터분석기사 실기 작업형 대비 (분석 모형 구축)

본 글은 빅데이터분석기사 실기 작업형에 대비하여 요약 및 실습한 것을 작성한 글입니다. <br>기출문제의 데이터는 출처는 남겼으나 [https://github.com/ingu627/BigDataAnalysis](https://github.com/ingu627/BigDataAnalysis)에 데이터 셋을 남겨놨습니다.<br> 또한 해당 전체 코드는 `/concept/R_basic_to_pro_7.R` 파일에 담겨져 있습니다.
{: .notice--info}

## 군집 분석

- **군집 분석**은 관측된 여러 개의 변숫값으로부터 유사성에만 기초하여 n개의 군집으로 집단화하고, 형성된 집단의 특성으로부터 관계를 분석하는 다변량 분석기법이다.
- **연속형 변수 거리**로는 유클리드 거리, 맨하튼 거리, 민코우스키 거리, 표준화 거리, 마할라노비스 거리 등이 있다.
- **명목형 변수 거리**는 개체 i와 j 간의 거리의 정의이다.
  - `d(i,j)=(개체 i와 j에서 다른 값을 가지는 변수의 수)/ (총 변수의 수)`
- **순서형 변수 거리**는 순위 상관 계수(Rank Correlation Coefficient)를 이용하여 거리를 측정한다.

### 군집 분석 함수

|함수|설명|
|---|---|
|dist(data, method)|데이터의 군집 간 거리를 측정|
|mahalanobis(data,center,cov)|데이터의 마할라노비스 거리를 측정|
|hclust(data, method)|hclust 함수를 이용하여 생성|
|agnes(data, metric, method)|cluster 패키지에서 계층적 군집방법을 이용하여 분석|
|daisy(data, metric)|cluster 패키지에서 데이터 관측치 사이의 거리를 계산|

- 거리 측정 방법의 `method`에는 "euclidean", "maximum", "manhattan", "'canberra", binary", "minkowski"가 있다.
- 계층적 군집 분석의 `method`는 hclust 함수를 적용하며 "single", "complete", "average", "median", "ward.D"을 사용한다.


### 1. 데이터 탐색

```R
str(USArrests)
# 'data.frame':   50 obs. of  4 variables:
#  $ Murder  : num  13.2 10 8.1 8.8 9 7.9 3.3 5.9 15.4 17.4 ...
#  $ Assault : int  236 263 294 190 276 204 110 238 335 211 ...
#  $ UrbanPop: int  58 48 80 50 91 78 77 72 80 60 ...
#  $ Rape    : num  21.2 44.5 31 19.5 40.6 38.7 11.1 15.8 31.9 25.8 ...

head(USArrests)
#            Murder Assault UrbanPop Rape
# Alabama      13.2     236       58 21.2
# Alaska       10.0     263       48 44.5
# Arizona       8.1     294       80 31.0
# Arkansas      8.8     190       50 19.5
# California    9.0     276       91 40.6
# Colorado      7.9     204       78 38.7

summary(USArrests)
#      Murder          Assault         UrbanPop          Rape      
#  Min.   : 0.800   Min.   : 45.0   Min.   :32.00   Min.   : 7.30  
#  1st Qu.: 4.075   1st Qu.:109.0   1st Qu.:54.50   1st Qu.:15.07
#  Median : 7.250   Median :159.0   Median :66.00   Median :20.10
#  Mean   : 7.788   Mean   :170.8   Mean   :65.54   Mean   :21.23  
#  3rd Qu.:11.250   3rd Qu.:249.0   3rd Qu.:77.75   3rd Qu.:26.18  
#  Max.   :17.400   Max.   :337.0   Max.   :91.00   Max.   :46.00
```

### 2. 유클리디안 거리 측정

```R
US.dist_euclidean = dist(USArrests, 'euclidean')
US.dist_euclidean
#                   Alabama     Alaska    Arizona   Arkansas California
# Alaska          37.177009
# Arizona         63.008333  46.592489
# Arkansas        46.928137  77.197409 108.851918
# California      55.524769  45.102217  23.194180  97.582017
# Colorado        41.932565  66.475935  90.351148  36.734861  73.197131
# Connecticut    128.206942 159.406556 185.159526  85.028289 169.277110
# Delaware        16.806249  45.182961  58.616380  53.010376  49.291480
# Florida        102.001618  79.974496  41.654532 148.735739  60.980735
# ...
```

### 3. 분석 모형 구축 - 계층적 군집 분석

```R
US.single = hclust(US.dist_euclidean^2, method="single")
plot(US.single)
```

![image](https://user-images.githubusercontent.com/78655692/142362743-03621758-0305-4846-9c6a-f3fd459848d0.png)

## 4. 군집 분석을 통한 그룹 확인 

- 계층적 군집 분석의 결과는 plot 함수를 통해 덴드로그램으로 시각화할 수 있다.
- 덴드로그램 결과는 cutree 함수로 그룹화를 하거나 rect.hclust 함수를 이용하여 그룹화할 수 있다.

|함수|설명|
|---|---|
|plot(data)|거리 행렬 데이터를 기준으로 덴드로그램 그래프를 출력|
|cutree(tree, k, h)|덴드로그램 tree의 높이(h)나 그룹의 수(k)를 옵션으로 지정하여 그룹 생성|
|rect.hclust(tree, k, which, x, h, border, cluster)|hclust 함수의 결과에서 각 그룹을 사각형으로 구분|

```R
group = cutree(US.single, k=6)
group
#        Alabama         Alaska        Arizona       Arkansas     California 
#              1              2              1              3              1
#       Colorado    Connecticut       Delaware        Florida        Georgia 
#              3              4              1              5              3 
#         Hawaii          Idaho       Illinois        Indiana           Iowa
#              4              4              1              4              4 
#         Kansas       Kentucky      Louisiana          Maine       Maryland
#              4              4              1              4              1 
#  Massachusetts       Michigan      Minnesota    Mississippi       Missouri 
#              3              1              4              1              3
#        Montana       Nebraska         Nevada  New Hampshire     New Jersey 
#              4              4              1              4              3 
#     New Mexico       New York North Carolina   North Dakota           Ohio
#              1              1              6              4              4 
#       Oklahoma         Oregon   Pennsylvania   Rhode Island South Carolina
#              3              3              4              3              1
#   South Dakota      Tennessee          Texas           Utah        Vermont 
#              4              3              3              4              4 
#       Virginia     Washington  West Virginia      Wisconsin        Wyoming
#              3              3              4              4              3
```

## 비계층적 군집 분석 - k평균 군집 분석 

- **k-평균**(k-means)는 k개만큼 원하는 군집 수를 초깃값으로 지정하고, 각 개체를 가까운 초깃값에 할당하여 군집을 형성하고 각 군집의 평균을 재계산하여 초깃값을 갱신한다. 갱신 과정을 반복하여 k개의 최종군집을 형성한다.
- `kmeans(data, centers)` 

### 1. 분석 모형 구축

```R
# install.packages('NbClust')
library(NbClust)
# install.packages('rattle')
library(rattle)
df=scale(wine[-1])
set.seed(1234)
fit.km = kmeans(df, 3, nstart=25)
fit.km$size
# [1] 62 65 51
fit.km$centers
#      Alcohol      Malic        Ash Alcalinity   Magnesium     Phenols
# 1  0.8328826 -0.3029551  0.3636801 -0.6084749  0.57596208  0.88274724
# 2 -0.9234669 -0.3929331 -0.4931257  0.1701220 -0.49032869 -0.07576891
# 3  0.1644436  0.8690954  0.1863726  0.5228924 -0.07526047 -0.97657548
#    Flavanoids Nonflavanoids Proanthocyanins      Color        Hue   Dilution
# 1  0.97506900   -0.56050853      0.57865427  0.1705823  0.4726504  0.7770551
# 2  0.02075402   -0.03343924      0.05810161 -0.8993770  0.4605046  0.2700025
# 3 -1.21182921    0.72402116     -0.77751312  0.9388902 -1.1615122 -1.2887761
#      Proline
# 1  1.1220202
# 2 -0.7517257
# 3 -0.4059428
```

### 2. 분석 모형 활용

```R
plot(df, col=fit.km$cluster)
points(
    fit.km$center, col=1:3, 
    pch=8, cex=1.5)
```

![image](https://user-images.githubusercontent.com/78655692/142364885-d55766e8-4c7c-454c-ac8d-b7b5c71635e2.png)

## 연관성 분석 

- **연관성 분석**(Association Analysis)은 데이터 내부에 존재하는 항목 간의 상호 관계 혹은 종속 관계를 찾아내는 분석기법이다.
- R에서 연관 분석을 수행할 수 있는 함수는 arules 패키지에 포함되어 있는 `apriori`함수이다. 
  - `aprori`함수는 트랜잭션 데이터를 다루고 데이터 세트 내에서 최소 N 번의 트랜잭션이 일어난 아이템 집합들을 찾아 연관 분석을 수행하는 알고리즘이다.
- `as(data, class)` : 객체들을 리스트로 결합해주는 함수
- `inspect(x, ...)` : transactions 데이터 확인
- `apriori(data, parameter, appearance, control)` : 연관성 분석

|파라미터|설명|
|---|---|
|data|연관 규칙 또는 트랜잭션 또는 아이템 매트릭스 데이터|
|parameter|최소 지지도(supp), 신뢰도(conf), 최대 아이템 개수(maxien), 최소 아이템 개수(minien) 입력|
|appearance|특정 연관규칙 결과를 찾을 수 있음|
|control|결과 보여주기 등의 알고리즘의 성능을 조정할 수 있음|

### 1. 데이터 세트 준비

```R
# install.packages('arules')
# install.packages('arulesViz')

library(arules)
library(arulesViz)
data('Groceries')
summary(Groceries)

# transactions as itemMatrix in sparse format with
#  9835 rows (elements/itemsets/transactions) and
#  169 columns (items) and a density of 0.02609146

# most frequent items:
#       whole milk other vegetables       rolls/buns             soda
#             2513             1903             1809             1715 
#           yogurt          (Other)
#             1372            34055

# element (itemset/transaction) length distribution:
# sizes
#    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16 
# 2159 1643 1299 1005  855  645  545  438  350  246  182  117   78   77   55   46 
#   17   18   19   20   21   22   23   24   26   27   28   29   32 
#   29   14   14    9   11    4    6    1    1    1    1    3    1

#    Min. 1st Qu.  Median    Mean 3rd Qu.    Max. 
#   1.000   2.000   3.000   4.409   6.000  32.000

# includes extended item information - examples:
#        labels  level2           level1
# 1 frankfurter sausage meat and sausage
# 2     sausage sausage meat and sausage
# 3  liver loaf sausage meat and sausage
```

### 2. apriori 함수를 통한 연관 규칙 생성 

```R
apr = apriori(
    Groceries,
    parameter=list(support=0.01,
    confidence=0.3)
    )
# Apriori

# Parameter specification:
#  confidence minval smax arem  aval originalSupport maxtime support minlen
#         0.3    0.1    1 none FALSE            TRUE       5    0.01      1
#  maxlen target  ext
#      10  rules TRUE

# Algorithmic control:
#  filter tree heap memopt load sort verbose
#     0.1 TRUE TRUE  FALSE TRUE    2    TRUE

# Absolute minimum support count: 98

# set item appearances ...[0 item(s)] done [0.00s].
# set transactions ...[169 item(s), 9835 transaction(s)] done [0.01s].
# sorting and recoding items ... [88 item(s)] done [0.00s].
# creating transaction tree ... done [0.00s].
# checking subsets of size 1 2 3 4 done [0.01s].
# writing ... [125 rule(s)] done [0.00s].
# creating S4 object  ... done [0.00s].
# > 
```

### 3. inspect 함수를 통해 연관 규칙 확인 

```R
inspect(sort(apr, by='lift')[1:10])

#      lhs                                   rhs                support   
# [1]  {citrus fruit, other vegetables}   => {root vegetables}  0.01037112
# [2]  {tropical fruit, other vegetables} => {root vegetables}  0.01230300
# [3]  {beef}                             => {root vegetables}  0.01738688
# [4]  {citrus fruit, root vegetables}    => {other vegetables} 0.01037112
# [5]  {tropical fruit, root vegetables}  => {other vegetables} 0.01230300
# [6]  {other vegetables, whole milk}     => {root vegetables}  0.02318251
# [7]  {whole milk, curd}                 => {yogurt}           0.01006609
# [8]  {root vegetables, rolls/buns}      => {other vegetables} 0.01220132
# [9]  {root vegetables, yogurt}          => {other vegetables} 0.01291307
# [10] {tropical fruit, whole milk}       => {yogurt}           0.01514997
#      confidence coverage   lift     count
# [1]  0.3591549  0.02887646 3.295045 102
# [2]  0.3427762  0.03589222 3.144780 121  
# [3]  0.3313953  0.05246568 3.040367 171
# [4]  0.5862069  0.01769192 3.029608 102  
# [5]  0.5845411  0.02104728 3.020999 121
# [6]  0.3097826  0.07483477 2.842082 228
# [7]  0.3852140  0.02613116 2.761356  99
# [8]  0.5020921  0.02430097 2.594890 120  
# [9]  0.5000000  0.02582613 2.584078 127
# [10] 0.3581731  0.04229792 2.567516 149
```

## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264) 