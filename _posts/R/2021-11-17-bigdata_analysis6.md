---
layout: single
title: "빅데이터분석기사 실기 작업형(6) - 앙상블부터 랜덤포레스트까지"
excerpt: "본 글은 빅데이터분석기사 실기 작업형에 대비하여 요약 및 실습한 것을 작성한 글입니다. 기출문제의 데이터는 https://github.com/ingu627/BigDataAnalysis에 데이터 셋을 남겨놨습니다."
tag : [R, adsp, certificate, 빅데이터 분석기사, 실기]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2021-12-01
---

본 글은 빅데이터분석기사 실기 작업형에 대비하여 요약 및 실습한 것을 작성한 글입니다. <br>기출문제의 데이터는 출처는 [https://github.com/ingu627/BigDataAnalysis](https://github.com/ingu627/BigDataAnalysis){: target="_blank"}에 데이터 셋을 남겨놨습니다.<br> 또한 해당 전체 코드는 `/concept/R_basic_to_pro_6.R` 파일에 담겨져 있습니다.
{: .notice--info}

## 앙상블

- **앙상블**은 여러 가지 동일한 종류 또는 서로 상이한 모형들의 예측/분류 결과를 종합하여 최종적인 의사결정에 활용하는 기법이다. 

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

## 부스팅

![image](https://user-images.githubusercontent.com/78655692/142349340-89c63dd0-a949-41c5-83a7-fb2c7637bd3d.png)

- **부스팅**(Boosting)은 예측력이 약한 모형들을 결합하여 강한 예측 모형을 만드는 방법이다. 

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

## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264) 