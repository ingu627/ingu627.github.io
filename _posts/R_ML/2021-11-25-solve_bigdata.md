---
layout: single
title: "빅데이터분석기사(R) - 2021년 2회 기출문제풀이"
excerpt: "2021년 제 3회 빅데이터분석기사 실기를 위한 기출문제풀이 내용입니다."
categories: R_ML
tags : [R, 빅데이터 분석기사, 실기, 작업형, 필답형, 자격증, dataq, 정리, pdf, 기출문제, 정리본, 후기, 설명, 2회, 3회]
sidebar_main: false
classes: wide

last_modified_at: 2026-10-11
---

빅데이터 분석기사 실기 대비 차원에서 정리한 문제풀이다. 기출문제 데이터셋은 [GitHub 저장소](https://github.com/ingu627/BigDataAnalysis)에 수록했으며, 전체 실행 코드는 `2021_2nd.R` 파일에 담겨 있다.

**전체 개요**

1. `help()`를 통한 함수 매뉴얼 확인
2. 주요 라이브러리: `caret`, `ModelMetrics`, `car`, `randomForest`, `e1071`
3. 데이터 구조 파악 -> 결측값 처리 -> 전처리 -> 모델 평가 -> 모델 예측 -> 파일 저장

> 2022.01.08 : 제 3회 빅데이터 분석기사 실기 시험에 합격했다. [빅데이터 분석기사(R)](https://ingu627.github.io/categories/R_ML) 시리즈가 실기 준비에 도움이 되길 바란다.

> 해당 글을 PDF로 받고 싶다면 이메일과 함께 댓글로 남겨주세요.


## 2021.02회 기출 문제

### 필답형 

1. **이상값** : 데이터가 정상의 범주에서 벗어난 값 
2. **평균 대치법** : 결측값 처리를 위한 단순 대치법에서 관측 또는 실험으로 얻어진 자료의 평균값으로 결측값을 대치하는 방법  
3. **하이퍼 파라미터** : 모델에서 외적인 요소로 데이터 분석을 통해 얻어지는 값이 아니라 사용자가 직접 설정해주거나 알고리즘 생성자가 직접 만드는 값 
4. **비지도 학습** : 입력 데이터에 대한 정답인 레이블이 없는 상태에서 데이터가 어떻게 구성되었는지를 알아내는 방법 
5. **과대 적합** : 훈련 데이터에 대해서는 높은 성능을 보이지만 테스트 데이터에 대해서는 낮은 성능을 보이는 경우 
6. **후진 소거법** : 회귀 분석에서 전체 변수에서 시작해 가장 적은 영향을 주는 변수를 하나씩 제거하는 방법 (R `step()` 함수 기반)[^1]
7. **부스팅** : 앙상블 분석에서 잘못 분류된 개체들에 가중치를 적용하여 새로운 분류 규칙을 만들고 이 과정을 반복해 최종 모형을 만드는 알고리즘
8. **GBM** : 경사 하강법을 이용하여 가중치를 업데이트하여 최적화된 결과를 얻는 알고리즘
9. 마지막 은닉층 2개의 값 [0.2, -0.3], 가중치 [0.3, 0.1], bias -0.05, 출력층 1개이다. f(x) = x (단, x >= 0), 그 외 -1일 때 답: (0.2\*-0.3) + (-0.3\*0.1) - 0.05 = -0.14. 결과가 음수이므로 `-1`
10. **ROC 곡선** : 혼동 행렬의 가로와 세로축을 FPR, TPR로 생성한 곡선


### 제 1유형

*11.* crim 항목의 상위에서 10번째 값(즉, 상위 10번째 값 중에서 가장 적은 값)으로 상위 10개의 값을 변환하고, age 80 이상인 값에 대하여 crim 평균을 구하시오. (BostonHousing 데이터 셋) 

```R
library(mlbench)
data(BostonHousing)
boston = BostonHousing
str(boston)

library(dplyr)
top_crim = head(sort(boston$crim, decreasing = TRUE), 10)
ten = top_crim[10]

boston$crim <- ifelse(boston$crim>=ten, ten, boston$crim)

boston = boston %>% filter(age>=80)
result = mean(boston$crim)
print(result)
# [1] 5.759387
```



*12.* 1) 주어진 데이터의 첫 번째 행부터 순서대로 80%까지의 데이터를 훈련 데이터로 추출 후 2) 'total_bedrooms' 변수의 결측값을 'total_bedrooms'변수의 중앙값으로 대체하고 3) 대체 전의 'total_bedrooms' 변수 표준편차 값과 대체 후의 'total_bedrooms' 변수 표준편차 값의 차이의 절댓값을 구하시오. (housing 데이터 셋)

> 데이터 참고 : [https://www.kaggle.com/camnugent/introduction-to-machine-learning-in-r-tutorial](https://www.kaggle.com/camnugent/introduction-to-machine-learning-in-r-tutorial)

```R
housing = read.csv('./data/housing.csv', header=TRUE)
head(housing)
str(housing)
nrow(housing)

train = housing[1:(nrow(housing)*0.8),]
nrow(train)
before_sd = sd(train$total_bedrooms, na.rm = TRUE)

train$total_bedrooms = ifelse(is.na(train$total_bedrooms), median(train$total_bedrooms, na.rm = TRUE), train$total_bedrooms) 
after_sd = sd(train$total_bedrooms)
print(abs(before_sd - after_sd))
# [1] 1.975147
```



*13.* Charges 항목에서 이상값의 합을 구하시오. (이상값은 평균에서 1.5 표준편차 이상인 값) (insurance 데이터 셋)

> 데이터 참고 : [https://www.kaggle.com/mirichoi0218/insurance/version/1](https://www.kaggle.com/mirichoi0218/insurance/version/1)

```R
insurance=read.csv('./data/insurance.csv')
head(insurance)
str(insurance)
summary(insurance)

sum(is.na(insurance$charges))

avg = mean(insurance$charges)  # 13270.42
sd1 =  sd(insurance$charges) # [1] 12110.01

library(dplyr)

insurance %>% 
    select(charges) %>% 
    filter(charges >= avg + 1.5*sd1 | charges <= avg - 1.5*sd1) %>% 
    sum()
# [1] 6421430
```



### 제 2유형

*14.* 전자상거래 배송 데이터
제품 배송 시간에 맞춰 배송되었는지 예측모델 만들기
학습용 데이터 (X_train, y_train)을 이용하여 배송 예측 모형을 만든 후, 이를 평가용 데이터(X_test)에 적용하여 얻은 예측값을 다음과 같은 형식의 CSV파일로 생성하시오. (제출한 모델의 성능은 ROC-AUC 평가지표에 따라 채점)

> 데이터 참고 : [https://www.kaggle.com/prachi13/customer-analytics](https://www.kaggle.com/prachi13/customer-analytics)

데이터 분할과 전처리에는 `caret`[^2] 패키지를 활용하고, 로지스틱 회귀(`glm`)[^3]와 단계적 변수 선택(`step`), 그리고 랜덤 포레스트(`randomForest`)[^4]로 분류 모형을 학습한다. 최종 모델 평가는 `ModelMetrics`[^5]의 ROC-AUC 지표로 산출한다.


```R
Train=read.csv('2021_2nd_data/Train.csv', stringsAsFactors=TRUE)
head(Train)
str(Train)
summary(Train)
dim(Train)
length(Train)

sum(is.na(Train))

names(Train)[1] <- c("ID")

Train$Reached.on.Time_Y.N = as.factor(Train$Reached.on.Time_Y.N)
str(Train$Reached.on.Time_Y.N)

library(caret)
idx=createDataPartition(Train$Reached.on.Time_Y.N, 0.7)
str(idx)
x_train = Train[idx$Resample1,]
x_test = Train[-idx$Resample1,]

prePro_xtrain = preProcess(x_train, method='range')
prePro_xtest = preProcess(x_test, method='range')

scaled_x_train = predict(prePro_xtrain, x_train)
scaled_x_test = predict(prePro_xtest, x_test)

# 로지스틱 회귀분석
model_glm = glm(Reached.on.Time_Y.N ~ .-ID, data=scaled_x_train, family='binomial')
summary(model_glm)

model_step = step(model_glm, direction='both')
summary(model_step)

pred_glm = predict(model_step, newdata=scaled_x_test[, -12], type='response')

pred_glm = ifelse(pred_glm >= 0.5, 1, 0)

confusionMatrix(as.factor(pred_glm), x_test$Reached.on.Time_Y.N)

library(ModelMetrics)
auc(x_test$Reached.on.Time_Y.N, pred_glm) # 0.6187506

# 랜덤포레스트
library(randomForest)
model_rf=randomForest(Reached.on.Time_Y.N ~ .-ID, data=scaled_x_train, ntree=300)
summary(model_rf)

library(caret)
pred_rf = predict(model_rf, newdata=scaled_x_test[, -12], type='response')

confusionMatrix(pred_rf, x_test$Reached.on.Time_Y.N) # Accuracy : 0.6599

library(ModelMetrics)
auc(x_test$Reached.on.Time_Y.N, pred_rf) # 0.662148


total=as.data.frame(cbind(x_test$ID, pred_rf))
names(total) <- c('ID', 'Reached.on.Time_Y.N')
head(total)
summary(total)
write.csv(total, 'Train_result.csv', row.names=FALSE)
```

## 한계 및 주의사항

- **인메모리 연산 한계**: R은 모든 객체를 메모리(RAM)에 상주시켜 처리하므로, 대용량 데이터셋 전처리 및 모형 학습 시 Out of Memory(OOM) 오류가 발생할 수 있다.
- **단일 스레드 기본 동작**: R의 기본 인터프리터 및 주요 모델링 함수(`stats::glm`, `randomForest`)는 기본적으로 단일 CPU 코어에서 동작하므로, 트리 개수 증가나 반복 교차 검증 시 연산 시간이 선형적으로 증가한다.
- **실기 시험 환경의 제약**: 빅데이터분석기사 실기 클라우드 환경은 실행 메모리와 타임아웃(통상 1분 내외)이 엄격히 제한되므로, 과도한 하이퍼파라미터 그리드 탐색보다는 적절한 트리 수(`ntree=300`) 설정과 안정적으로 수렴하는 기본 모델을 우선 선택해야 한다.

## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264)
- [R Core Team, "Choose a Model by AIC in a Stepwise Algorithm (step)," R stats package reference manual, CRAN](https://stat.ethz.ch/R-manual/R-patched/library/stats/html/step.html)
- [Max Kuhn, "caret: Classification and Regression Training," CRAN Package caret](https://cran.r-project.org/package=caret)
- [R Core Team, "Fitting Generalized Linear Models (glm)," R stats package reference manual, CRAN](https://stat.ethz.ch/R-manual/R-patched/library/stats/html/glm.html)
- [Leo Breiman and Adele Cutler, "randomForest: Breiman and Cutler's Random Forests for Classification and Regression," CRAN Package randomForest](https://cran.r-project.org/package=randomForest)
- [James Wharton, "ModelMetrics: Rapid Calculation of Model Metrics," CRAN Package ModelMetrics](https://cran.r-project.org/package=ModelMetrics)

[^1]: [R Core Team, "Choose a Model by AIC in a Stepwise Algorithm (step)," R stats package reference manual, CRAN](https://stat.ethz.ch/R-manual/R-patched/library/stats/html/step.html)
[^2]: [Max Kuhn, "caret: Classification and Regression Training," CRAN Package caret](https://cran.r-project.org/package=caret)
[^3]: [R Core Team, "Fitting Generalized Linear Models (glm)," R stats package reference manual, CRAN](https://stat.ethz.ch/R-manual/R-patched/library/stats/html/glm.html)
[^4]: [Leo Breiman and Adele Cutler, "randomForest: Breiman and Cutler's Random Forests for Classification and Regression," CRAN Package randomForest](https://cran.r-project.org/package=randomForest)
[^5]: [James Wharton, "ModelMetrics: Rapid Calculation of Model Metrics," CRAN Package ModelMetrics](https://cran.r-project.org/package=ModelMetrics)

