---
layout: single
title: "빅데이터분석기사(R) - 제2유형 문제풀이"
excerpt: "2021년 제 3회 빅데이터분석기사 실기를 위한 문제풀이 내용입니다."
categories: R_ML
tag : [R, certificate, 빅데이터 분석기사, 실기, 작업형, 제2유형]
toc: true
sidebar_main: true
classes: wide

last_modified_at: 2021-12-01
---

빅데이터 분석기사 실기 대비 차원에서 쓴 글입니다. <br> 기출문제의 데이터는 [https://github.com/ingu627/BigDataAnalysis](https://github.com/ingu627/BigDataAnalysis)에 데이터 셋을 남겨놨습니다.<br> 또한 해당 전체 코드는 `sujebi_3.R` 파일에 담겨져 있습니다.
{: .notice--info}

## 1. 백화점 고객의 1년 데이터 (dataq.or.kr 예시 문제)

![image](https://user-images.githubusercontent.com/78655692/143578663-d53b1ebf-23c6-4647-93cc-9b2c63c0abc9.png)

```R
X_train=read.csv('example_data/X_train.csv', stringsAsFactors=TRUE)
y_train=read.csv('example_data/y_train.csv', stringsAsFactors=TRUE)
X_test=read.csv('example_data/X_test.csv', stringsAsFactors=TRUE)

str(X_train)
head(X_train)
summary(X_train)
dim(X_train)

class(X_train$주구매지점)

str(y_train)
head(y_train) # cust_id gender

str(X_test)
head(X_test)
summary(X_test)
dim(X_test)

library(caret)

X_train[is.na(X_train$환불금액),]$환불금액 <- 0
X_test[is.na(X_test$환불금액),]$환불금액 <- 0

pre_X_train = preProcess(X_train, method="range")
pre_X_test = preProcess(X_test, method="range")

scaled_X_train = predict(pre_X_train, X_train)
scaled_X_test = predict(pre_X_test, X_test)

summary(scaled_X_train)
summary(scaled_X_test)
str(scaled_X_train)
str(scaled_X_test)

y_train$gender = as.factor(y_train$gender)

model_glm=glm(
    y_train$gender ~ .-cust_id, data=scaled_X_train,
    family='binomial')
summary(model_glm)

step_model = step(model_glm, direction = 'both')
summary(step_model)

pred = predict(step_model, scaled_X_train, type='response')
library(ModelMetrics)
auc(y_train$gender, pred) # 0.6839781

pred_step_glm = predict(step_model, scaled_X_test, type='response')

summary(pred_step_glm)
head(pred_step_glm)

result = as.data.frame(cbind(X_test$cust_id, pred_step_glm))
names(result) <- c('cust_id', 'gender') 
head(result)

write.csv(result, '0000.csv', row.names=FALSE)
```




<br>
<br>

## 2. WA_Fn-UseC_-Telco-Customer-Churn

- 주어진 데이터는 각 고객이 가입한 서비스와 계정 정보, 인구에 대한 통계 정보들이다. 주어진 훈련 데이터를 이용하여 모델을 훈련한 후 테스트 데이터로 고객의 이탈 여부를 예측하고 csv 포맷으로 제출하시오.(단, 이탈:"Yes", 유지:"No")

> 데이터 참고 : [https://www.kaggle.com/blastchar/telco-customer-churn](https://www.kaggle.com/blastchar/telco-customer-churn)

```R
churn = read.csv(
    'sujebi_data/WA_Fn-UseC_-Telco-Customer-Churn.csv',
     stringsAsFactors =TRUE)

head(churn)
str(churn)
summary(churn)
dim(churn)

library(caret)
churn = na.omit(churn)
dim(churn)
idx=createDataPartition(churn$Churn, p=0.7)
str(idx)
x_train=churn[idx$Resample1,]
y_train=churn[idx$Resample1,]
x_test=churn[-idx$Resample1,]
y_test=churn[-idx$Resample1,]

dim(x_train)
dim(x_test)

model_x_train=preProcess(x_train, method="range")
model_x_test=preProcess(x_test, method="range")

scaled_x_train = predict(model_x_train, x_train)
scaled_x_test = predict(model_x_test, x_test)

library(e1071)

model_svm=svm(y_train$Churn ~.-customerID, scaled_x_train)
summary(model_svm)

pred = predict(model_svm, scaled_x_test)

confusionMatrix(pred, y_test$Churn) #  Accuracy : 0.7927

library(ModelMetrics)
auc(y_test$Churn, pred) # 0.6759252

# install.packages('randomForest')
library(randomForest)
model_random=randomForest(
    y_train$Churn ~.-customerID,
    data=scaled_x_train,
    ntree=300, do.trac=TRUE)
summary(model_random)

pred1 = predict(model_random, scaled_x_test)

confusionMatrix(pred1, y_test$Churn)
auc(y_test$Churn, pred1) # 0.6890504

write.csv(pred, 'y_test.csv', row.names=FALSE)
```
<br>
<br>

## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264)