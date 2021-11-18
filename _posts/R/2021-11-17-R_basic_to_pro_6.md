---
layout: single
title: "R 기초 ~ 심화 문법 총정리 (6) - 분석 모형 구축"
excerpt: "+ ADsP, 빅데이터분석기사 실기 작업형 대비 - 앙상블 기법까지"
categories: R
tag : [R, adsp, certificate]
toc: true
toc_sticky: true
author_profile: false

last_modified_at: 2021-11-18
---

## + 빅데이터분석기사 실기 작업형 대비 (분석 모형 구축)

본 글은 빅데이터분석기사 실기 작업형에 대비하여 요약 및 실습한 것을 작성한 글입니다. 해당 글의 코드를 보고 싶으신 분들은 [빅데이터 분석기사 R 코드](https://github.com/ingu627/BigDataAnalysis)를 참고하시길 바랍니다.
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

![image](https://user-images.githubusercontent.com/78655692/142262817-0562c53d-9470-44eb-bc2a-1a1dd7c74013.png)

![image](https://user-images.githubusercontent.com/78655692/142262868-bc414f75-1e8c-4829-8b72-a43e2387a6c7.png)

![image](https://user-images.githubusercontent.com/78655692/142262918-c460eb23-93f8-44be-b6a5-f01ee47e28ef.png)

### 2. 데이터 전처리

![image](https://user-images.githubusercontent.com/78655692/142263058-34f54a34-4bef-4284-9fb4-a5e8230474a9.png)

### 3. 분석 모형 구축 

![image](https://user-images.githubusercontent.com/78655692/142347904-dfffbf14-67c1-44bc-ba3f-ba615da23abd.png)

### 4. 분석 모형 평가 

![image](https://user-images.githubusercontent.com/78655692/142347966-63b16fa6-64f9-462b-a9b9-99d3b24717b5.png)

## 부스팅

![image](https://user-images.githubusercontent.com/78655692/142349340-89c63dd0-a949-41c5-83a7-fb2c7637bd3d.png)

- **부스팅**(Boosting)은 예측력이 약한 모형들을 결합하여 강한 예측 모형을 만드는 방법이다. 

## XGBoost

- **XGBoost**(eXtreme Gradient Boosting)는 병렬 처리가 지원되도록 지원되도록 구현하여 훈련과 분류 속도가 빠른 알고리즘이다. 
- `xgb.train(params, data, nrounds, early_stopping_rounds, watchlist)` : xgboost 모델의 훈련을 위한 함수

|파라미터|설명|
|---|---|
|params|파라미터 리스트|
|data|xgb.DMatrix 객체|
|nrounds|최대 부스팅 반복 횟수|
|early_stopping_rounds|early stopping 횟수 지정<br>지정된 회수 이상 성능 향상이 없을 경우 중지|
|watchlist|모형의 성능을 평가하기 위하여 사용하는 xgb.DMatrix 이름|

- xgb.train 함수는 독립변수가 수치형 데이터만 사용이 가능하며, 명목형인 경우에는 One Hot Encoding을 수행하여 수치형으로 변환한 후 사용한다.
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

![image](https://user-images.githubusercontent.com/78655692/142352800-5f37c0fc-2af7-4ba3-959a-0ca8a01ad74b.png)

![image](https://user-images.githubusercontent.com/78655692/142355302-5180c68d-292f-4a05-8d8d-690b617222e2.png)

![image](https://user-images.githubusercontent.com/78655692/142355341-2fc9b630-950a-4991-9de6-beae29e3823e.png)

### 분석 모형 평가

**-> 에러**

## 랜덤 포레스트

- **랜덤 포레스트**(Random Forest)는 의사결정나무의 특징인 분산이 크다는 점을 고렿여 배깅과 부스팅보다 더 많은 무작위성을 주어 약한 학습기들을 생성한 후 이를 선형 결합하여 최종 학습기를 만드는 방법이다.
- 랜덤 포레스트 패키지는 랜덤 입력에 따른 여러 트리의 집합인 포레스트를 이용한 분류방법이다.
- `randomForest(formula, data, ntree, mtry)`

|파라미터|설명|
|---|---|
|formula|종속변수~독립변수 형식의 수식|
|data|데이터 프레임|
|ntree|사용할 트리의 수|
|mtry|각 분할에서 랜덤으로 뽑인 변수의 수|

### 분석 모형 구축

![image](https://user-images.githubusercontent.com/78655692/142358544-fdc0a42d-a90d-475a-ae90-77b5d4722280.png)

### 중요도 확인

![image](https://user-images.githubusercontent.com/78655692/142358748-236ddf6e-e450-4b75-9d0a-5bfb4ad6b975.png)

### 혼동 행렬 및 예측 

![image](https://user-images.githubusercontent.com/78655692/142358997-c55667ee-e686-49fc-af0d-984a7d8b4ab9.png)


## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264) 