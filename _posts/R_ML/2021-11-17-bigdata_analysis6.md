---
layout: single
title: "빅데이터분석기사 실기 작업형(6) - 앙상블부터 연관성분석까지"
excerpt: "본 글은 빅데이터분석기사 실기 작업형에 대비하여 요약 및 실습한 것을 작성한 글입니다. 기출문제의 데이터는 https://github.com/ingu627/BigDataAnalysis에 데이터 셋을 남겨놨습니다."
categories: R_ML
tag : [R, adsp, certificate, 빅데이터 분석기사, 실기, 앙상블, 배깅, 부스팅, 랜덤 포레스트, 군집 분석, 연관성 분석, 작업형, 필답형, 자격증, dataq, 정리, pdf, 기출문제]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-03-31
---

<img align='right' width='200' height='200' src='https://user-images.githubusercontent.com/78655692/148633895-2be87d4e-7edb-4391-b583-eb2888b19bbb.png
'>
본 글은 빅데이터분석기사 실기 작업형에 대비하여 요약 및 실습한 것을 작성한 글입니다. <br>기출문제의 데이터는 출처는 [https://github.com/ingu627/BigDataAnalysis](https://github.com/ingu627/BigDataAnalysis){: target="_blank"}에 데이터 셋을 남겨놨습니다.<br> 또한 해당 전체 코드는 `/concept/R_basic_to_pro_6.R` 파일에 담겨져 있습니다.
{: .notice--info}

2021.12.31 : 제 3회 빅데이터 분석기사 실기를 합격했습니다. <br> [빅데이터 분석기사(R)](https://ingu627.github.io/categories/R_ML) 시리즈를 보시고 도움이 되길 바랍니다.
{: .notice--danger}

혹시 해당 글을 pdf로 받고 싶으신 분은 이메일과 함께 댓글로 남겨주세요~
{: .notice--success}

<br>
<br>
<br>
<br>

## 앙상블

- **앙상블**은 여러 가지 동일한 종류 또는 서로 상이한 모형들의 예측/분류 결과를 종합하여 최종적인 의사결정에 활용하는 기법이다. 

<br>
<br>

## 배깅(Bagging)

![image](https://user-images.githubusercontent.com/78655692/142348954-39333baf-69d3-47ee-b724-7db5f3854cce.png)

- **배깅(Bagging; BootStrap Aggregating)**은 훈련 데이터에서 다수의 부트스트랩 자료를 생성하고, 각 자료를 모델링한 후 결합하여 최종 예측 모형을 만드는 알고리즘이다. 
- **부트스트랩**은 주어진 자료에서 동일한 크기의 표본을 랜덤 복원 추출로 뽑은 자료를 의미.
- `bagging(formula, data, mfinal, control)`

|파라미터|설명|
|---|---|
|formula|종속변수~독립변수 형식의 수식|
|mfinal|반복수 또는 트리의 수 (default = 100)|
|control | 의사결정나무 옵션|

<br>
<br>

### 분석 함수 결과 

|결과변수|설명|
|---|---|
|formula|분석에 사용된 모형|
|trees|bagging을 통해 생성된 의사결정나무들을 확인|
|votes|각 의사결정나무들이 1행 데이터에 대해 1 또는 2열의 분류를 가진다는 것에 대한 투표를 진행한 것|
|prob|각 행에 대해 1 또는 2열의 특정으로 분류되는 확률|
|class|bagging 기법을 활용해 각 행의 분류를 예측한 것|
|samples|각 의사결정나무 부트스트랩 데이터의 레코드 번호|
|importance|변수의 상대적인 중요도를 나타내며, 지니 지수의 이익(gain) 도는 불확실성의 감소량을 고려한 측도|

<br>
<br>

### 1. 데이터 탐색

```R
library(mlbench)
data(PimaIndiansDiabetes2)
str(PimaIndiansDiabetes2)
head(PimaIndiansDiabetes2)
summary(PimaIndiansDiabetes2)

#     pregnant         glucose         pressure         triceps     
#  Min.   : 0.000   Min.   : 44.0   Min.   : 24.00   Min.   : 7.00
#  1st Qu.: 1.000   1st Qu.: 99.0   1st Qu.: 64.00   1st Qu.:22.00  
#  Median : 3.000   Median :117.0   Median : 72.00   Median :29.00
#  Mean   : 3.845   Mean   :121.7   Mean   : 72.41   Mean   :29.15  
#  3rd Qu.: 6.000   3rd Qu.:141.0   3rd Qu.: 80.00   3rd Qu.:36.00
#  Max.   :17.000   Max.   :199.0   Max.   :122.00   Max.   :99.00  
#                   NA's   :5       NA's   :35       NA's   :227    
#     insulin            mass          pedigree           age        diabetes
#  Min.   : 14.00   Min.   :18.20   Min.   :0.0780   Min.   :21.00   neg:500  
#  1st Qu.: 76.25   1st Qu.:27.50   1st Qu.:0.2437   1st Qu.:24.00   pos:268
#  Median :125.00   Median :32.30   Median :0.3725   Median :29.00
#  Mean   :155.55   Mean   :32.46   Mean   :0.4719   Mean   :33.24
#  3rd Qu.:190.00   3rd Qu.:36.60   3rd Qu.:0.6262   3rd Qu.:41.00
#  Max.   :846.00   Max.   :67.10   Max.   :2.4200   Max.   :81.00
#  NA's   :374      NA's   :11
```

<br>
<br>

### 2. 데이터 전처리

```R
PimaIndiansDiabetes2 = na.omit(PimaIndiansDiabetes2)
summary(PimaIndiansDiabetes2)

#     pregnant         glucose         pressure         triceps     
#  Min.   : 0.000   Min.   : 56.0   Min.   : 24.00   Min.   : 7.00
#  1st Qu.: 1.000   1st Qu.: 99.0   1st Qu.: 62.00   1st Qu.:21.00
#  Median : 2.000   Median :119.0   Median : 70.00   Median :29.00
#  Mean   : 3.301   Mean   :122.6   Mean   : 70.66   Mean   :29.15  
#  3rd Qu.: 5.000   3rd Qu.:143.0   3rd Qu.: 78.00   3rd Qu.:37.00  
#  Max.   :17.000   Max.   :198.0   Max.   :110.00   Max.   :63.00
#     insulin            mass          pedigree           age        diabetes
#  Min.   : 14.00   Min.   :18.20   Min.   :0.0850   Min.   :21.00   neg:262  
#  1st Qu.: 76.75   1st Qu.:28.40   1st Qu.:0.2697   1st Qu.:23.00   pos:130
#  Median :125.50   Median :33.20   Median :0.4495   Median :27.00
#  Mean   :156.06   Mean   :33.09   Mean   :0.5230   Mean   :30.86
#  3rd Qu.:190.00   3rd Qu.:37.10   3rd Qu.:0.6870   3rd Qu.:36.00
#  Max.   :846.00   Max.   :67.10   Max.   :2.4200   Max.   :81.00
```

<br>
<br>

### 3. 분석 모형 구축 

```R
train.idx = sample(
    1:nrow(PimaIndiansDiabetes2),
    size=nrow(PimaIndiansDiabetes2)*2/3
)
train = PimaIndiansDiabetes2[train.idx,]
test = PimaIndiansDiabetes2[-train.idx, ]
```

```R
library(ipred)
md.bagging = bagging(
    diabetes~.,
    data=train, nbagg = 25
)
# md.bagging
# Bagging classification trees with 25 bootstrap replications

# Call: bagging.data.frame(formula = diabetes ~ ., data = train, nbagg = 25)
```

<br>
<br>

### 4. 분석 모형 평가 

```R
pred = predict(md.bagging, test)
library(caret)
confusionMatrix(
    as.factor(pred),
    test$diabetes,
    positive='pos'
)

# Confusion Matrix and Statistics

#           Reference
# Prediction neg pos
#        neg  80  21
#        pos   6  24

#                Accuracy : 0.7939
#                  95% CI : (0.7145, 0.8596)
#     No Information Rate : 0.6565
#     P-Value [Acc > NIR] : 0.0004151

#                   Kappa : 0.5036

#  Mcnemar's Test P-Value : 0.0070536

#             Sensitivity : 0.5333
#             Specificity : 0.9302
#          Pos Pred Value : 0.8000
#          Neg Pred Value : 0.7921
#              Prevalence : 0.3435
#          Detection Rate : 0.1832
#    Detection Prevalence : 0.2290
#       Balanced Accuracy : 0.7318

#        'Positive' Class : pos
```

<br>
<br>

## 부스팅

![image](https://user-images.githubusercontent.com/78655692/142349340-89c63dd0-a949-41c5-83a7-fb2c7637bd3d.png)

- **부스팅**(Boosting)은 예측력이 약한 모형들을 결합하여 강한 예측 모형을 만드는 방법이다. 

<br>
<br>

## XGBoost

- **XGBoost**(eXtreme Gradient Boosting)는 병렬 처리가 지원되도록 지원되도록 구현하여 훈련과 분류 속도가 빠른 알고리즘이다. 
- 부스팅 기법을 사용하는 알고리즘에는 AdaBoost, GBM, LightGBM, XGBoost(xXtreme Gradient Boosting), CatBoost 등이 있다. 
- `XGBoost` : 병렬 처리가 지원되도록 구현하여 훈련과 분류 속도가 빠른 알고리즘이다.
- `xgb.train(params, data, nrounds, early_stopping_rounds, watchlist)` : xgboost 모델의 훈련을 위한 함수

|파라미터|설명|
|---|---|
|params|파라미터 리스트|
|data|xgb.DMatrix 객체|
|nrounds|최대 부스팅 반복 횟수|
|early_stopping_rounds|early stopping 횟수 지정<br>지정된 회수 이상 성능 향상이 없을 경우 중지|
|watchlist|모형의 성능을 평가하기 위하여 사용하는 xgb.DMatrix 이름|

- xgb.train 함수는 독립변수가 **수치형 데이터**만 사용이 가능하며, 명목형인 경우에는 **One Hot Encoding**을 수행하여 수치형으로 변환한 후 사용한다.
- 종속변수가 팩터형인 경우에는 숫자로 변환한 후 0부터 시작하기 위해 1을 뺀다.

|주요 파라미터 | 설명 |
|---|---|
|booster|부스터 방법 설정 (default:gbree)|
|eta|학습률(learning rate) (default:0.3)<br>작을수록 과대 적합에 강건|
|gamma|information Gain에 패널티를 부여하는 숫자<br>클수록 트리의 깊이가 줄어서 보수적인 알고리즘|
|max_depth|한 트리의 최대 깊이 (default:6)|
|subsample|훈련 데이터의 샘플 비율 (default:1)|
|colsample_bytree|개별 트리 구성할 때 컬럼의 subsample 비율 (default:1:)|
|objective|목적 함수 지정 (default - reg:squarederror)|
|eval_mteric|모델의 평가 함수 (default는 목적 함수에 따라 할당)|

- `xgb.DMatrix(data, info,...)`

|파라미터|설명|
|---|---|
|data|Martix 객체, dgCMatrix 객체 또는 파일명|
|info|xgb.DMatrix에 저장될 추가적인 정보들의 리스트|

<br>
<br>

### 분석 모형 구축

```R
# install.packages('xgboost')
library(xgboost)
train.label=as.integer(train$diabetes)-1
mat_train.data=as.matrix(train[, -9])
mat_test.data=as.matrix(test[, -9])
```

```R
# install.packages('xgboost')
library(xgboost)
train.label=as.integer(train$diabetes)-1
mat_train.data=as.matrix(train[, -9])
mat_test.data=as.matrix(test[, -9])

xgb.train = xgb.DMatrix(
    data = mat_train.data,
    label = train.label
)
xgb.test = xgb.DMatrix(
    data = mat_test.data
)
param_list = list(
    booster = 'gbtree',
    eta = 0.001,
    max_depth = 10,
    gamma = 5,
    subsample = 0.8,
    colsample_bytree = 0.8,
    objective = 'binary:logistic',
    eval_metric = 'auc'
)
md.xgb = xgb.train(
    params = param_list,
    data = xgb.train,
    nrounds = 200,
    early_stopping_rounds = 10,
    watchlist = list(val1 = xgb.train),
    verbose=1
)

# [1]     val1-auc:0.792313 
# Will train until val1_auc hasn't improved in 10 rounds.

# [2]     val1-auc:0.859459 
# [3]     val1-auc:0.859459
# [4]     val1-auc:0.878610 
# [5]     val1-auc:0.882152 
# [6]     val1-auc:0.881150 
# [7]     val1-auc:0.890742
# [8]     val1-auc:0.891009 
# [9]     val1-auc:0.890909 
# [10]    val1-auc:0.892914
# [11]    val1-auc:0.894318 
# [12]    val1-auc:0.893082 
# [13]    val1-auc:0.892413 
# [14]    val1-auc:0.893783
# [15]    val1-auc:0.893048 
# [16]    val1-auc:0.891377 
# [17]    val1-auc:0.892112
# [18]    val1-auc:0.892513 
# [19]    val1-auc:0.889472
# [20]    val1-auc:0.889873 
# [21]    val1-auc:0.890241 
# Stopping. Best iteration:
# [11]    val1-auc:0.894318
```

<br>
<br>

### 분석 모형 평가

```R
library(dplyr)
xgb.pred = predict(
    md.xgb,
    newdata = xgb.test
)
xgb.pred2 = ifelse(
    xgb.pred >= 0.5,
    xgb.pred <- 'pos',
    xgb.pred <- 'neg'
)
# ifelse 안에서는 = 로 하면 에러가 난다. 반드시 <-로 해줘야 함.
xgb.pred2 = as.factor(xgb.pred2)
library(caret)
confusionMatrix(
    xgb.pred2,
    test$diabetes,
    positive= 'pos'
)

# Confusion Matrix and Statistics

#           Reference
# Prediction neg pos
#        neg  78  23
#        pos   8  22

#                Accuracy : 0.7634
#                  95% CI : (0.6812, 0.8332)
#     No Information Rate : 0.6565
#     P-Value [Acc > NIR] : 0.005436

#                   Kappa : 0.43

#  Mcnemar's Test P-Value : 0.011921

#             Sensitivity : 0.4889
#             Specificity : 0.9070
#          Pos Pred Value : 0.7333
#          Neg Pred Value : 0.7723
#              Prevalence : 0.3435
#          Detection Rate : 0.1679
#    Detection Prevalence : 0.2290
#       Balanced Accuracy : 0.6979

#        'Positive' Class : pos
```

<br>
<br>

## 랜덤 포레스트

<img src="https://user-images.githubusercontent.com/78655692/143412154-aa6f9e63-2bc6-4f08-868b-711c5a2c520f.png" width="500" alt="image">

- **랜덤 포레스트**(Random Forest)는 의사결정나무의 특징인 분산이 크다는 점을 고렿여 배깅과 부스팅보다 더 많은 무작위성을 주어 약한 학습기들을 생성한 후 이를 선형 결합하여 최종 학습기를 만드는 방법이다.
- 랜덤 포레스트 패키지는 랜덤 입력에 따른 여러 트리의 집합인 포레스트를 이용한 분류방법이다.
- `randomForest(formula, data, ntree, mtry)`

|파라미터|설명|
|---|---|
|formula|종속변수~독립변수 형식의 수식|
|data|데이터 프레임|
|ntree|사용할 트리의 수|
|mtry|각 분할에서 랜덤으로 뽑인 변수의 수|

<br>
<br>

### 1. 분석 모형 구축

```R
# install.packages('randomForest')
library(randomForest)
md.rf = randomForest(
    diabetes ~.,
    data = train,
    ntree=100,
    proximity=TRUE
)
print(md.rf)

# Call:
#  randomForest(formula = diabetes ~ ., data = train, ntree = 100,      proximity = TRUE) 
#                Type of random forest: classification
#                      Number of trees: 100
# No. of variables tried at each split: 2

#         OOB estimate of  error rate: 24.52%
# Confusion matrix:
#     neg pos class.error
# neg 154  22   0.1250000
# pos  42  43   0.4941176
```

<br>
<br>

### 2. 중요도 확인

```R
importance(md.rf)
#          MeanDecreaseGini
# pregnant        10.760140
# glucose         25.962516
# pressure         8.373628
# triceps         10.613116
# insulin         18.244292
# mass            13.511800
# pedigree        10.673620
# age             15.948628
```

<br>
<br>

### 3. 혼동 행렬 및 예측 

```R
library(caret)
pred = predict(md.rf, test)
confusionMatrix(
    as.factor(pred),
    test$diabetes,
    positive= 'pos'
)

# Confusion Matrix and Statistics

#           Reference
# Prediction neg pos
#        neg  81  24
#        pos   5  21

#                Accuracy : 0.7786
#                  95% CI : (0.6978, 0.8465)
#     No Information Rate : 0.6565
#     P-Value [Acc > NIR] : 0.0016311

#                   Kappa : 0.4542

#  Mcnemar's Test P-Value : 0.0008302

#             Sensitivity : 0.4667
#             Specificity : 0.9419
#          Pos Pred Value : 0.8077
#          Neg Pred Value : 0.7714
#              Prevalence : 0.3435
#          Detection Rate : 0.1603
#    Detection Prevalence : 0.1985
#       Balanced Accuracy : 0.7043

#        'Positive' Class : pos
```

<br>
<br>

## 군집 분석

- **군집 분석**은 관측된 여러 개의 변숫값으로부터 유사성에만 기초하여 n개의 군집으로 집단화하고, 형성된 집단의 특성으로부터 관계를 분석하는 다변량 분석기법이다.
- **연속형 변수 거리**로는 유클리드 거리, 맨하튼 거리, 민코우스키 거리, 표준화 거리, 마할라노비스 거리 등이 있다.
- **명목형 변수 거리**는 개체 i와 j 간의 거리의 정의이다.
  - `d(i,j)=(개체 i와 j에서 다른 값을 가지는 변수의 수)/ (총 변수의 수)`
- **순서형 변수 거리**는 순위 상관 계수(Rank Correlation Coefficient)를 이용하여 거리를 측정한다.

<br>
<br>

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

<br>
<br>

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

<br>
<br>

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

<br>
<br>

### 3. 분석 모형 구축 - 계층적 군집 분석

```R
US.single = hclust(US.dist_euclidean^2, method="single")
plot(US.single)
```

![image](https://user-images.githubusercontent.com/78655692/142362743-03621758-0305-4846-9c6a-f3fd459848d0.png)

<br>
<br>

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

<br>
<br>

## 비계층적 군집 분석 - k평균 군집 분석 

- **k-평균**(k-means)는 k개만큼 원하는 군집 수를 초깃값으로 지정하고, 각 개체를 가까운 초깃값에 할당하여 군집을 형성하고 각 군집의 평균을 재계산하여 초깃값을 갱신한다. 갱신 과정을 반복하여 k개의 최종군집을 형성한다.
- `kmeans(data, centers)` 

<br>
<br>

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

<br>
<br>

### 2. 분석 모형 활용

```R
plot(df, col=fit.km$cluster)
points(
    fit.km$center, col=1:3, 
    pch=8, cex=1.5)
```

![image](https://user-images.githubusercontent.com/78655692/142364885-d55766e8-4c7c-454c-ac8d-b7b5c71635e2.png)

<br>
<br>

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

<br>
<br>

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

<br>
<br>

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

<br>
<br>

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

<br>
<br>

## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264) 