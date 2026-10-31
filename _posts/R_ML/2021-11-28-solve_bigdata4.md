---
layout: single
title: "빅데이터분석기사(R) - 제2유형 문제풀이"
excerpt: "2021년 제 3회 빅데이터분석기사 실기를 위한 문제풀이 내용입니다."
categories: R_ML
tags : [R, 빅데이터 분석기사, 실기, 작업형, 제2유형, 필답형, 자격증, dataq, 정리, pdf, 기출문제, 정리본, 후기, 설명, 2회, 3회]
toc: true

sidebar_main: false
classes: wide

last_modified_at: 2026-10-11
---

빅데이터 분석기사 실기(작업형 제2유형) 대비 차원에서 작성한 문제풀이 글이다. 실습 데이터는 [GitHub 저장소(BigDataAnalysis)](https://github.com/ingu627/BigDataAnalysis)에 정리해 두었으며, 전체 R 코드는 `sujebi_3.R` 파일에 수록되어 있다.

1. `help()` 함수 활용
2. 주요 패키지: `caret`, `ModelMetrics`, `car`, `randomForest`, `e1071`
3. 분석 절차: 데이터 구조 파악 → 결측값 처리 → 전처리 → 모델 평가 → 모델 예측 → 파일 저장

혹시 해당 글을 pdf로 받고 싶으신 분은 이메일과 함께 댓글로 남겨주세요~

이 글은 빅데이터분석기사 실기 제2유형(작업형) 문제풀이 기록이다. 백화점 고객 데이터, Telco Customer Churn, mtcars 세 가지 예시 문제를 R 코드로 풀이한 과정을 정리한다.

## 1. 백화점 고객의 1년 데이터 (dataq.or.kr 예시 문제)

![image](/assets/images/legacy/b376131dfb.webp)

백화점 고객 3,500명의 1년 구매 데이터를 바탕으로 고객의 성별(`gender`: 0 또는 1)을 예측하는 이진 분류 문제다. `환불금액`의 결측값(NA)을 0으로 대치한 뒤, `caret`[^1] 패키지의 `preProcess()`를 사용해 수치형 변수를 Min-Max 범위([0, 1])로 정규화한다. 분류 모형으로는 `stats` 패키지의 `glm()`[^2] 함수로 로지스틱 회귀를 적합하고, `step()`[^3] 함수를 이용한 단계적 변수 선택으로 AIC 기준 최적 변수 조합을 탐색한다. `ModelMetrics`[^4] 패키지의 `auc()` 함수로 산출한 훈련 데이터 AUC는 약 0.684이며, 최종 테스트 데이터의 예측 확률값을 `cust_id`와 결합해 CSV 파일로 저장한다.

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

- 주어진 데이터는 각 고객이 가입한 서비스와 계정 정보, 인구통계 정보다. 주어진 훈련 데이터를 활용해 모델을 학습한 뒤 테스트 데이터로 고객의 이탈 여부(`Churn`: Yes/No)를 예측하고 CSV 포맷으로 제출한다.

> 데이터 참고 : [https://www.kaggle.com/blastchar/telco-customer-churn](https://www.kaggle.com/blastchar/telco-customer-churn)

결측치를 `na.omit()`으로 제거한 후 `caret`의 `createDataPartition()` 함수를 통해 훈련 및 평가 데이터를 7:3 비율로 분할한다. 분류 모델로는 `e1071`[^5] 패키지의 `svm()`(서포트 벡터 머신)과 `randomForest`[^6] 패키지의 `randomForest()`를 적용해 성능을 비교한다. 테스트 데이터 평가 결과 SVM 모델의 정확도(Accuracy)는 약 79.27%, AUC는 약 0.676을 기록했으며, 300개의 트리를 학습한 랜덤 포레스트의 AUC는 약 0.689를 나타낸다.

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
    ntree=300, do.trace=TRUE)
summary(model_random)

pred1 = predict(model_random, scaled_x_test)

confusionMatrix(pred1, y_test$Churn)
auc(y_test$Churn, pred1) # 0.6890504

write.csv(pred, 'y_test.csv', row.names=FALSE)
```

## 3. mtcars

- 다음은 mtcars 데이터 세트로 32개 자동차의 제원과 성능을 비교한 데이터다. 훈련 데이터와 평가 데이터를 7:3으로 분할한 뒤 연비(mpg)를 예측하는 회귀 모델을 구축하고 RMSE로 평가 결과를 산출한다.

32개 관측치로 구성된 `mtcars` 내장 데이터셋을 7:3으로 분할하고 Min-Max 정규화를 적용한다. `stats` 패키지의 `lm()`[^7] 함수로 전체 독립변수를 포함한 다중 선형 회귀 모형을 구축한 뒤, `step()` 함수를 적용해 전진·후진 단계적 변수 선택을 수행한다. 최종 선택된 변수(`disp`, `am`, `carb`)로 축소 모델을 적합하고 테스트 데이터에 대해 `ModelMetrics`의 `rmse()`로 측정한 RMSE는 약 0.190이다.

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

## 한계 및 주의사항

- **인메모리 연산 한계**: R은 데이터를 기본적으로 메모리(RAM)에 적재하여 처리하므로, 대규모 데이터셋 학습 시 객체 복사 과정에서 Out of Memory(OOM) 오류가 발생할 수 있다.
- **단일 스레드 기본 동작**: R의 기본 인터프리터 및 주요 모델 패키지(`stats`, `e1071`, `randomForest`)는 기본적으로 단일 스레드로 동작하므로 교차 검증이나 하이퍼파라미터 탐색 시 연산 시간이 선형적으로 증가한다.
- **실기 시험 환경의 제약**: 빅데이터분석기사 실기 클라우드 환경은 메모리와 셀 실행 제한 시간(통상 1분 내외)이 엄격하게 제한되므로, 고비용 그리드 탐색이나 복잡한 앙상블 모형보다는 제한 시간 내에 안정적으로 수렴하는 모델을 선정하고 `write.csv()`의 `row.names=FALSE` 옵션을 확인해야 한다.

## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264)
- [R Core Team, "The R Project for Statistical Computing," CRAN](https://cran.r-project.org/)
- [Max Kuhn, "caret: Classification and Regression Training," CRAN Package caret](https://cran.r-project.org/package=caret)
- [R Core Team, "Fitting Generalized Linear Models (glm)," R stats package manual, CRAN](https://stat.ethz.ch/R-manual/R-patched/library/stats/html/glm.html)
- [R Core Team, "Choose a model by AIC in a Stepwise Algorithm (step)," R stats package manual, CRAN](https://stat.ethz.ch/R-manual/R-patched/library/stats/html/step.html)
- [Tyler Hunt, "ModelMetrics: Rapid Calculation of Model Metrics," CRAN Package ModelMetrics](https://cran.r-project.org/package=ModelMetrics)
- [David Meyer et al., "e1071: Misc Functions of the Department of Statistics (svm)," CRAN Package e1071](https://cran.r-project.org/package=e1071)
- [Leo Breiman and Adele Cutler, "randomForest: Breiman and Cutler's Random Forests for Classification and Regression," CRAN Package randomForest](https://cran.r-project.org/package=randomForest)
- [R Core Team, "Fitting Linear Models (lm)," R stats package manual, CRAN](https://stat.ethz.ch/R-manual/R-patched/library/stats/html/lm.html)

[^1]: [Max Kuhn, "caret: Classification and Regression Training," CRAN Package caret](https://cran.r-project.org/package=caret)
[^2]: [R Core Team, "Fitting Generalized Linear Models (glm)," R stats package manual, CRAN](https://stat.ethz.ch/R-manual/R-patched/library/stats/html/glm.html)
[^3]: [R Core Team, "Choose a model by AIC in a Stepwise Algorithm (step)," R stats package manual, CRAN](https://stat.ethz.ch/R-manual/R-patched/library/stats/html/step.html)
[^4]: [Tyler Hunt, "ModelMetrics: Rapid Calculation of Model Metrics," CRAN Package ModelMetrics](https://cran.r-project.org/package=ModelMetrics)
[^5]: [David Meyer et al., "e1071: Misc Functions of the Department of Statistics (svm)," CRAN Package e1071](https://cran.r-project.org/package=e1071)
[^6]: [Leo Breiman and Adele Cutler, "randomForest: Breiman and Cutler's Random Forests for Classification and Regression," CRAN Package randomForest](https://cran.r-project.org/package=randomForest)
[^7]: [R Core Team, "Fitting Linear Models (lm)," R stats package manual, CRAN](https://stat.ethz.ch/R-manual/R-patched/library/stats/html/lm.html)