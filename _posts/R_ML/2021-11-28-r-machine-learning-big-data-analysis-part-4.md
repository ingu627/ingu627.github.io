---
layout: single
title: "빅데이터분석기사 실기 제2유형: 통계·모델링 문제 풀이 전략"
excerpt: "2021년 제 3회 빅데이터분석기사 실기를 위한 문제풀이 내용입니다."
categories: R_ML
tags : [R, 빅데이터 분석기사, 실기, 작업형, 제2유형, 필답형, 자격증, dataq, 정리, pdf, 기출문제, 정리본, 후기, 설명, 2회, 3회]
toc: true

sidebar_main: false
classes: wide

last_modified_at: 2022-03-31
---

빅데이터 분석기사 실기 대비용 정리입니다. 기출 데이터는 [GitHub 저장소](https://github.com/ingu627/BigDataAnalysis)에 있으며 전체 코드는 `sujebi_3.R` 파일에 포함되어 있습니다.
{: .notice--info}

### 학습 흐름 체크리스트

1. help() 활용으로 함수/객체 구조 확인
2. 사용 라이브러리: caret, ModelMetrics, car, randomForest, e1071
3. 전체 프로세스: 데이터 구조 파악 → 결측값 처리 → 전처리 → 모델 평가 → 예측 → 파일 저장
{: .notice--danger}

혹시 해당 글을 pdf로 받고 싶으신 분은 이메일과 함께 댓글로 남겨주세요~
{: .notice--success}





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

X_train$환불금액[is.na(X_train$환불금액)] <- 0
X_test$환불금액[is.na(X_test$환불금액)] <- 0

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

 
 

## 3. mtcars

- 다음은 mtcars 데이터 세트로 32개 자동차들의 디자인과 성능 비교한 데이터이다. 훈련 데이터와 평가 데이터를 7:3으로 분할한 후 연비(mpg)를 예측하는 최적 모델을 만들고 RMSE로 평가 결과를 구하시오.

```R
data(mtcars)
head(mtcars)
str(mtcars)
summary(mtcars)
dim(mtcars)

library(caret)
idx=createDataPartition(mtcars$mpg, p=0.7)
str(idx)
x_train = mtcars[idx$Resample1, ]
x_test = mtcars[-idx$Resample1, ]

prePro_x_train = preProcess(x_train, method='range')
prePro_x_test = preProcess(x_test, method='range')

scaled_x_train = predict(prePro_x_train, x_train)
scaled_x_test = predict(prePro_x_test, x_test)

full_model = lm(mpg ~ ., data=scaled_x_train)
summary(full_model)

step_model = step(full_model, direction='both')
summary(step_model)

md_model = lm(mpg ~ disp+am+carb, data=scaled_x_train)
summary(md_model)

pred_lm=predict(md_model, newdata=scaled_x_test[, -1])

library(ModelMetrics)
rmse_lm = rmse(scaled_x_test$mpg, pred_lm)
print(rmse_lm) # 0.189796
```

<br>
<br>

## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264)