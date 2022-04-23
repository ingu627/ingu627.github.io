---
layout: single
title: "빅데이터분석기사 실기 작업형(5) - 의사결정나무부터 나이브 정리까지"
excerpt: "본 글은 빅데이터분석기사 실기 작업형에 대비하여 요약 및 실습한 것을 작성한 글입니다. 기출문제의 데이터는 https://github.com/ingu627/BigDataAnalysis에 데이터 셋을 남겨놨습니다."
categories: R_ML
tag : [R, adsp, certificate, 빅데이터 분석기사, 실기, 작업형, 필답형, 자격증, dataq, 정리, pdf, 기출문제, 정리본]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-03-31
---

<img align='right' width='200' height='200' src='https://user-images.githubusercontent.com/78655692/148633895-2be87d4e-7edb-4391-b583-eb2888b19bbb.png
'>
본 글은 빅데이터분석기사 실기 작업형에 대비하여 요약 및 실습한 것을 작성한 글입니다. <br>기출문제의 데이터는 출처는 [https://github.com/ingu627/BigDataAnalysis](https://github.com/ingu627/BigDataAnalysis){: target="_blank"}에 데이터 셋을 남겨놨습니다.<br> 또한 해당 전체 코드는 `/concept/R_basic_to_pro_5.R` 파일에 담겨져 있습니다.
{: .notice--info}

2021.12.31 : 제 3회 빅데이터 분석기사 실기를 합격했습니다. <br> [빅데이터 분석기사(R)](https://ingu627.github.io/categories/R_ML) 시리즈를 보시고 도움이 되길 바랍니다.
{: .notice--danger}

혹시 해당 글을 pdf로 받고 싶으신 분은 이메일과 함께 댓글로 남겨주세요~
{: .notice--success}

<br>
<br>
<br>
<br>

## 의사결정나무

- **의사결정나무**는 데이터들이 가진 속성들로부터 분할 기준 속성을 판별하고, 분할 기준 속성에 따라 트리 형태로 모델링하는 분류 예측 모델이다.
- **의사결정나무 기법**은 분석의 대상을 분류 함수를 활용하여 의사결정 규칙으로 이루어진 나무 모양으로 그리는 기법이다.

<br>
<br>

### 의사결정나무 분석 함수 종류

|함수|설명|코드|
|---|---|---|
|rpart()|CART 기법 방법을 사용<br>전체 데이터 세트를 가지고 시작하여 모든 예측변수를 사용하여 데이터 세트의 부분집합을 분할해 생성|library(rpart)<br>rpart(formula, data)|
|tree()|불순도의 측도로 엔트로피 지수를 사용|library(tree)<br>tree(formula, data)|
|ctree()|분석 결과에서 별도로 가지치기 할 필요가 없음|library(party)<br>ctree(formula, data)|

<br>
<br>

### 의사결정나무 예시

*1. 데이터 탐색*

```R
str(iris)

# 'data.frame':   150 obs. of  5 variables:
#  $ Sepal.Length: num  5.1 4.9 4.7 4.6 5 5.4 4.6 5 4.4 4.9 ...
#  $ Sepal.Width : num  3.5 3 3.2 3.1 3.6 3.9 3.4 3.4 2.9 3.1 ...
#  $ Petal.Length: num  1.4 1.4 1.3 1.5 1.4 1.7 1.4 1.5 1.4 1.5 ...
#  $ Petal.Width : num  0.2 0.2 0.2 0.2 0.2 0.4 0.3 0.2 0.2 0.1 ...
#  $ Species     : Factor w/ 3 levels "setosa","versicolor",..: 1 1 1 1 1 1 1 1 1 1 ...  

head(iris)
#   Sepal.Length Sepal.Width Petal.Length Petal.Width Species
# 1          5.1         3.5          1.4         0.2  setosa
# 2          4.9         3.0          1.4         0.2  setosa
# 3          4.7         3.2          1.3         0.2  setosa
# 4          4.6         3.1          1.5         0.2  setosa
# 5          5.0         3.6          1.4         0.2  setosa
# 6          5.4         3.9          1.7         0.4  setosa

summary(iris)
#  Sepal.Length    Sepal.Width     Petal.Length    Petal.Width
#  Min.   :4.300   Min.   :2.000   Min.   :1.000   Min.   :0.100
#  1st Qu.:5.100   1st Qu.:2.800   1st Qu.:1.600   1st Qu.:0.300  
#  Median :5.800   Median :3.000   Median :4.350   Median :1.300
#  Mean   :5.843   Mean   :3.057   Mean   :3.758   Mean   :1.199
#  3rd Qu.:6.400   3rd Qu.:3.300   3rd Qu.:5.100   3rd Qu.:1.800  
#  Max.   :7.900   Max.   :4.400   Max.   :6.900   Max.   :2.500
#        Species
#  setosa    :50
#  versicolor:50
#  virginica :50
```

*2. 전처리*
*3. 변수선택*

*4. 분석 모형 구축*

```R
library(rpart)
md = rpart(Species ~. , data=iris)
md
# n= 150

# node), split, n, loss, yval, (yprob)
#       * denotes terminal node

# 1) root 150 100 setosa (0.33333333 0.33333333 0.33333333)
#   2) Petal.Length< 2.45 50   0 setosa (1.00000000 0.00000000 0.00000000) *
#   3) Petal.Length>=2.45 100  50 versicolor (0.00000000 0.50000000 0.50000000)  
#     6) Petal.Width< 1.75 54   5 versicolor (0.00000000 0.90740741 0.09259259) *
#     7) Petal.Width>=1.75 46   1 virginica (0.00000000 0.02173913 0.97826087) *
```

```R
plot(md, compress=TRUE, margin=0.5)
text(md, cex=1)
```

![image](https://user-images.githubusercontent.com/78655692/143397783-49ec836f-fb6a-4f29-b8b1-1d006d71be38.png)

```R
library(rpart.plot)
prp(md, type=2, extra=2)
```

![image](https://user-images.githubusercontent.com/78655692/143397700-37aa3443-8b7d-4c6c-a8a4-f1be158459dc.png)

*5. 분석 모형 평가*

```R
ls(md)
#  [1] "call"                "control"             "cptable"
#  [4] "frame"               "functions"           "method"
#  [7] "numresp"             "ordered"             "parms"
# [10] "splits"              "terms"               "variable.importance"
# [13] "where"               "y"


md$cptable
#     CP nsplit rel error xerror       xstd
# 1 0.50      0      1.00   1.16 0.05127703
# 2 0.44      1      0.50   0.61 0.06016090
# 3 0.01      2      0.06   0.07 0.02583280
```

|내부 변수|설명|
|---|---|
|CP|복잡성|
|nsplit|가지의 분기 수|
|rel error|오류율|
|xerror|교차 검증 오류|
|xstd|교차 검증 오류의 표준오차|

*6. 혼동 행렬 확인*

```R
# install.packages('caret')
library(caret)
tree_pred = predict(
    md, newdata = iris, type = "class"
)
confusionMatrix(tree_pred, iris$Species)

# Confusion Matrix and Statistics

#             Reference
# Prediction   setosa versicolor virginica
#   setosa         50          0         0
#   versicolor      0         49         5
#   virginica       0          1        45

# Overall Statistics
                                         
#                Accuracy : 0.96           
#                  95% CI : (0.915, 0.9852)
#     No Information Rate : 0.3333         
#     P-Value [Acc > NIR] : < 2.2e-16      
                                         
#                   Kappa : 0.94           
                                         
#  Mcnemar's Test P-Value : NA             

# Statistics by Class:

#                      Class: setosa Class: versicolor
# Sensitivity                 1.0000            0.9800
# Specificity                 1.0000            0.9500
# Pos Pred Value              1.0000            0.9074
# Neg Pred Value              1.0000            0.9896
# Prevalence                  0.3333            0.3333
# Detection Rate              0.3333            0.3267
# Detection Prevalence        0.3333            0.3600
# Balanced Accuracy           1.0000            0.9650
#                      Class: virginica
# Sensitivity                    0.9000
# Specificity                    0.9900
# Pos Pred Value                 0.9783
# Neg Pred Value                 0.9519
# Prevalence                     0.3333
# Detection Rate                 0.3000
# Detection Prevalence           0.3067
# Balanced Accuracy              0.9450
```

- `confusionMatrix(predicted, actual)`

<br>
<br>

## 서포트 벡터 머신(SVM)

- **서포트 벡터 머신(SVM; Support Vecotr Machine)**은 데이터를 분리하는 초평면(Hyperplane)중에서 데이터들과 거리가 가장 먼 초평면을 선택하여 분리하는 지도 학습 기반의 이진 선형 분류 모델이다.
- 최대 마진(Margin : 여유공간)을 가지는 비확률적 선형 판별에 기초한 이진 분류기이다.
- `svm(formula, data = NULL)`
- `predict(object(모델), data, type)`

|파라미터|설명|
|---|---|
|object|svm의 객체|
|data|예측을 수행할 데이터|
|type|예측 결과의 유형<br>response(예측값), probabilities(확률)을 가짐|

*분석 모형 구축*

```R
# install.packages('e1071')
library(e1071)

model = svm(Species ~., data=iris)
model

# Call:
# svm(formula = Species ~ ., data = iris)


# Parameters:
#    SVM-Type:  C-classification
#  SVM-Kernel:  radial 
#        cost:  1

# Number of Support Vectors:  51
```

*분석 모형 평가*

```R
pred = predict(model, iris)
library(caret)
confusionMatrix(pred, iris$Species)

# Confusion Matrix and Statistics

#             Reference
# Prediction   setosa versicolor virginica
#   setosa         50          0         0
#   versicolor      0         48         2
#   virginica       0          2        48

# Overall Statistics
                                          
#                Accuracy : 0.9733          
#                  95% CI : (0.9331, 0.9927)
#     No Information Rate : 0.3333          
#     P-Value [Acc > NIR] : < 2.2e-16       
                                          
#                   Kappa : 0.96            
                                          
#  Mcnemar's Test P-Value : NA              

# Statistics by Class:

#                      Class: setosa Class: versicolor
# Sensitivity                 1.0000            0.9600
# Specificity                 1.0000            0.9800
# Pos Pred Value              1.0000            0.9600
# Neg Pred Value              1.0000            0.9800
# Prevalence                  0.3333            0.3333
# Detection Rate              0.3333            0.3200
# Detection Prevalence        0.3333            0.3333
# Balanced Accuracy           1.0000            0.9700
#                      Class: virginica
# Sensitivity                    0.9600
# Specificity                    0.9800
# Pos Pred Value                 0.9600
# Neg Pred Value                 0.9800
# Prevalence                     0.3333
# Detection Rate                 0.3200
# Detection Prevalence           0.3333
# Balanced Accuracy              0.9700
```

<br>
<br>

## K-NN

- **K-NN 알고리즘**은 새로운 데이터 클래스를 해당 데이터와 가장 가까운 k개 데이터들의 클래스로 분류하는 알고리즘이다. 
- K-NN 알고리즘에서는 유클리디안 거리, 맨하탄 거리, 민코우스키 거리 등을 사용할 수 있으며, 일반적으로 유클리디안 거리를 사용한다.
- `knn(train, test, cl, k)` 

|파라미터|설명|
|---|---|
|train|훈련 데이터를 위한 매트릭스 또는 데이터 프레임|
|test|평가 데이터를 위한 매트릭스 또는 데이터 프레임|
|cl|훈련 데이터의 종속변수|
|k|근접 이웃의 수(default=1)|

<br>
<br>

### 1. 데이터 세트

```R
data = iris[, c('Sepal.Length', 'Sepal.Width', 'Species')]
set.seed(1234)
```

<br>
<br>

### 2. 변수 할당

```R
idx = sample(
    x=c('train', 'valid', 'test'),
    size=nrow(data),
    replace=TRUE, prob=c(3,1,1))
train = data[idx == 'train',]
valid = data[idx == 'valid',]
test = data[idx == 'test',]

train_x = train[, -3]
valid_x = valid[, -3]
test_x = test[, -3]

train_y = train[, 3]
valid_y = valid[, 3]
test_y = test[, 3]
```

<br>
<br>

### 3. 변수 선택

```R
accuracy_k = NULL
for(i in c(1:nrow(train_x))){

    set.seed(1234)
    knn_k = knn(
        train = train_x,
        test = valid_x,
        cl = train_y, k = i
    )
    accuracy_k = c(
        accuracy_k, 
        sum(knn_k==valid_y) / length(valid_y))
}
valid_k = data.frame(
    k = c(1:nrow(train_x)),
    accuracy = accuracy_k)
```

```R
plot(
    formula = accuracy ~ k,
    data = valid_k,
    type = 'o',
    pch = 20,
    main = 'validation - optimal k'
)
```

![image](https://user-images.githubusercontent.com/78655692/142248144-f137abaa-4b5c-4b74-a579-5d590ec8608a.png)

<br>
<br>

### 4. 분류 정확도 최적화

```R
min(valid_k[
    valid_k$accuracy %in% 
    max(accuracy_k), 'k'])
# [1] 13
max(accuracy_k)
# [1] 0.8888889
```

<br>
<br>

### 5. 모형 평가

```R
library(caret)
library(e1071)
knn_13 = knn(
    train = train_x,
    test= test_x,
    cl = train_y, k = 13 
)
confusionMatrix(knn_13, test_y)

# Confusion Matrix and Statistics

#             Reference
# Prediction   setosa versicolor virginica
#   setosa         11          0         0
#   versicolor      0          4         2
#   virginica       0          2         5

# Overall Statistics
                                          
#                Accuracy : 0.8333          
#                  95% CI : (0.6262, 0.9526)
#     No Information Rate : 0.4583          
#     P-Value [Acc > NIR] : 0.0001808       
                                          
#                   Kappa : 0.7405          
                                          
#  Mcnemar's Test P-Value : NA              

# Statistics by Class:

#                      Class: setosa Class: versicolor
# Sensitivity                 1.0000            0.6667
# Specificity                 1.0000            0.8889
# Pos Pred Value              1.0000            0.6667
# Neg Pred Value              1.0000            0.8889
# Prevalence                  0.4583            0.2500
# Detection Rate              0.4583            0.1667
# Detection Prevalence        0.4583            0.2500
# Balanced Accuracy           1.0000            0.7778
#                      Class: virginica
# Sensitivity                    0.7143
# Specificity                    0.8824
# Pos Pred Value                 0.7143
# Neg Pred Value                 0.8824
# Prevalence                     0.2917
# Detection Rate                 0.2083
# Detection Prevalence           0.2917
# Balanced Accuracy              0.7983
```

<br>
<br>

## 인공신경망(ANN) 

- **인공 신경망**(ANN; Artificial Neural Network)은 인간의 뉴런 구조를 모방하여 만든 기계학습 모델이다.
- 입력값을 받아서 출력값을 만들기 위해 활성화 함수를 사용한다.
- `nnet(formula, data, size, maxit, decay=5e04, ...)`

|파라미터|설명|
|---|---|
|formula|종속변수~독립변수 형식의 수식|
|data|데이터 프레임|
|size|은닉층의 개수|
|maxit|반복할 학습 횟수|
|decay|가중치 감소의 모수 |

<br>
<br>

### 1. 전처리

```R
# install.packages('nnet')
library(nnet)

data(iris)
iris.scaled = cbind(
    scale(iris[-5]),
    iris[5])

set.seed(1234)

index = c(
    sample(1:50, size=35),
    sample(51:100, size=35),
    sample(101:150, size=35)
)
train = iris.scaled[index,]
test = iris.scaled[-index,]
```

<br>
<br>

### 2. 분석 모형 구축

```R
set.seed(1234)
model.nnet = nnet(
    Species~.,
    data=train,
    size=2,
    maxit=200,
    decay=5e-04
)
# # weights:  19
# initial  value 132.666396 
# iter  10 value 8.209251
# iter  20 value 1.364185
# iter  30 value 0.942394
# iter  40 value 0.730223
# iter  50 value 0.606575
# iter  60 value 0.519214
# iter  70 value 0.426922
# iter  80 value 0.405672
# iter  90 value 0.400552
# iter 100 value 0.394381
# iter 110 value 0.392941
# iter 120 value 0.392316
# iter 130 value 0.392108
# iter 140 value 0.392070
# iter 150 value 0.392048
# iter 160 value 0.392045
# iter 170 value 0.392043
# iter 180 value 0.392042
# iter 190 value 0.392041
# final  value 0.392041
# converged
```

> **해석**  
> seed 값은 1234로 설정  
> nnet 함수 생성. 종속변수는 Species이고 독립변수는 Species를 제외하여 수식 설정  
> 데이터는 train, 은닉층(size)은 2로 설정. 반복할 최대 횟수(maxit)는 200으로 설정. 가중치 감소의 모수를 5e-04로 설정  

<br>
<br>

### 3. 요약 정보 추출

```R
summary(model.nnet)

# a 4-2-3 network with 19 weights
# options were - softmax modelling  decay=5e-04
#  b->h1 i1->h1 i2->h1 i3->h1 i4->h1
#  -8.61  -1.91  -0.78   7.81   7.06
#  b->h2 i1->h2 i2->h2 i3->h2 i4->h2
#   2.29   0.74  -1.51   2.55   2.39 
#  b->o1 h1->o1 h2->o1
#   5.83  -1.57  -8.56
#  b->o2 h1->o2 h2->o2
#  -2.30  -9.83   8.86
#  b->o3 h1->o3 h2->o3
#  -3.53  11.40  -0.30
```

<br>
<br>

## 나이브 베이즈 기법

- **나이브 베이즈 분류**는 특성들 사이의 독립을 가정하는 베이즈 정리를 적용한 확률 분류기이다.
- 나이브 베이즈 분류는 베이즈 정리와 조건부 확률을 이용한다.
- **subset** 매개변수를 지정하면 분석 데이터에서 훈련 데이터를 선정할 수 있다.
- **라플라스** 매개변수는 라플라스 추정기로 중간에 0이 들어가서 모든 확률을 0으로 만들어 버리는 것을 방지하기 위한 인자이다.
- `naiveBayes(formula, data, subset, laplace, ...)`

|파라미터|설명|
|---|---|
|formula|종속변수~독립변수 형식의 수식|
|data|분석할 데이터 세트|
|subset|훈련 데이터에서 사용할 데이터를 지정하는 인덱스 벡터|
|laplace|라플라스 추정기 사용 여부(default 0)|

<br>
<br>

### 분석 모형 구축

```R
library(e1071)
train_data = sample(1:150, size=100)

naive_model = naiveBayes(
    Species ~., data = iris,
    subset=train_data
)
naive_model

# Naive Bayes Classifier for Discrete Predictors

# Call:
# naiveBayes.default(x = X, y = Y, laplace = laplace)

# A-priori probabilities:
# Y
#     setosa versicolor  virginica
#       0.31       0.34       0.35 

# Conditional probabilities:
#             Sepal.Length
# Y                [,1]      [,2]
#   setosa     4.993548 0.3641753
#   versicolor 5.964706 0.5376054
#   virginica  6.594286 0.7012354

#             Sepal.Width
# Y                [,1]      [,2]
#   setosa     3.377419 0.3896235
#   versicolor 2.811765 0.3328160
#   virginica  2.985714 0.3431196

#             Petal.Length
# Y                [,1]      [,2]
#   setosa     1.470968 0.1616448
#   versicolor 4.247059 0.4301059
#   virginica  5.600000 0.5341293

#             Petal.Width
# Y                 [,1]       [,2]
#   setosa     0.2419355 0.09228288
#   versicolor 1.3411765 0.20466920
#   virginica  2.0285714 0.28239671
```

<br>
<br>

### 분석 모형 평가

```R
library(caret)
pred= predict(naive_model, newdata=iris)
confusionMatrix(
    pred, iris$Species
)
# Confusion Matrix and Statistics

#             Reference
# Prediction   setosa versicolor virginica
#   setosa         50          0         0
#   versicolor      0         46         3
#   virginica       0          4        47

# Overall Statistics
                                         
#                Accuracy : 0.9533         
#                  95% CI : (0.9062, 0.981)
#     No Information Rate : 0.3333         
#     P-Value [Acc > NIR] : < 2.2e-16      
                                         
#                   Kappa : 0.93           
                                         
#  Mcnemar's Test P-Value : NA             

# Statistics by Class:

#                      Class: setosa Class: versicolor
# Sensitivity                 1.0000            0.9200
# Specificity                 1.0000            0.9700
# Pos Pred Value              1.0000            0.9388
# Neg Pred Value              1.0000            0.9604
# Prevalence                  0.3333            0.3333
# Detection Rate              0.3333            0.3067
# Detection Prevalence        0.3333            0.3267
# Balanced Accuracy           1.0000            0.9450
#                      Class: virginica
# Sensitivity                    0.9400
# Specificity                    0.9600
# Pos Pred Value                 0.9216
# Neg Pred Value                 0.9697
# Prevalence                     0.3333
# Detection Rate                 0.3133
# Detection Prevalence           0.3400
# Balanced Accuracy              0.9500
```

<br>
<br>

## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264) 