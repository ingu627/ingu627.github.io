---
layout: single
title: "R 기초 ~ 심화 문법 총정리 (4) - 분석 모형 구축"
excerpt: "+ ADsP, 빅데이터분석기사 실기 작업형 대비 - 로지스틱 회귀분석까지"
categories: R
tag : [R, adsp, certificate]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2021-11-17
---

## + 빅데이터분석기사 실기 작업형 대비 (분석 모형 구축)

본 글은 빅데이터분석기사 실기 작업형에 대비하여 요약 및 실습한 것을 작성한 글입니다. 해당 글의 코드를 보고 싶으신 분들은 [빅데이터 분석기사 R 코드](https://github.com/ingu627/BigDataAnalysis)를 참고하시길 바랍니다.
{: .notice--info}

# 분석 모형 구축 

## 통계 분석 

### 주성분 분석(PCA)

- **주성분 분석**은 서로 상관성이 높은 변수를 상관 관계가 없는 소수의 변수로 변환하는 차원 축소 기법
- 주성분의 선택 방법으로는 주성분의 누적 기여율과 스크리 산점도(Scree Plot)를 주로 사용한다.
  - `주성분 기여율` : 원래 데이터에 대한 주성분의 설명력을 의미
  - `스크리 산점도` : x축에 주성분, y축에 각 주성분의 분산을 표현한 그래프

![image](https://user-images.githubusercontent.com/78655692/142022724-55e0cc93-c775-4e7d-bd3a-8674d68404df.png)

- `princomp(x, cor, scores, ...)` : 주성분 분석 함수 

|파라미터|설명|
|---|---|
|x|데이터(벡터 또는 데이터 프레임)|
|cor|TRUE: 공분산 행렬 사용<br>FALSE: 상관행렬 사용(default)|
|scores|TRUE: 각 주성분의 점수를 계산(default)<br>FALSE: 계산 X|

![image](https://user-images.githubusercontent.com/78655692/142032037-46740e72-d3f6-4d55-a8db-5f2517cef41f.png)

![image](https://user-images.githubusercontent.com/78655692/142031927-8b91552a-e765-4c35-923b-1d549c3c241a.png)

- `loadings` : 주성분 적재 값 분석
- `scores` : 주성분 점수 분석
- `biplot(x)` : x축을 제1 주성분, y축을 제2 주성분으로 하고, 각 변수에 대한 주성분 적재 값을 화살표로 시각화 (주성분 점수 시각화)

![image](https://user-images.githubusercontent.com/78655692/142037980-25eed1ff-99f3-46c2-ad67-b3664c14a1d0.png)

![image](https://user-images.githubusercontent.com/78655692/142038073-e09a6d15-39aa-4c35-8b49-d5ad0c646976.png)

## 요인 분석

- **요인 분석**은 변수 간의 상관관계를 고려하여 서로 유사한 변수들을 묶어 새로운 잠재요인들을 추출하는 분석 방법
- 요인 분석은 변수를 축소하거나, 불피요한 변수 제거, 변수 특성 파악, 측정항목 타당성 평가, 요인 점수를 이용한 변수 생성 등의 목적을 가지고 있다.

# 2. 정형 데이터 분석

## 회귀 분석

- **회귀 분석**은 하나 이상의 독립변수들이 종속변수에 미치는 영향을 추정할 수 있는 통계기법
- `lm(formula, data)` : formula는 종속변수~독립변수 형식으로 지정
- `plot(x, which)` : 회귀 분석 모형 그래프 (which=그래프의 종류 지정)
- `str()` : 데이터 세트 속성 탐색
- `head()` : 데이터의 앞 6행 출력
- `summary()` : 요약 통계량 출력

<br/>

### 데이터 탐색

- str 함수, head 함수, summary 함수를 이용하여 데이터를 탐색한다.

![image](https://user-images.githubusercontent.com/78655692/142039521-cf477d05-bef8-46ee-94e8-e79e54ec9f00.png)

### 전처리 - 결측값 처리

![image](https://user-images.githubusercontent.com/78655692/142039617-63e5cede-541e-4576-acee-11afa33372e6.png)

![image](https://user-images.githubusercontent.com/78655692/142039684-455319a6-1741-434d-b1ba-fe7570a2e6fb.png)

### 분석 모형 구축

- 유의하지 않은 변수 제거
- p-value를 확인하여 유의미한 변수를 선택한다.

![image](https://user-images.githubusercontent.com/78655692/142194496-e448ea25-fdce-4813-80eb-13728022bbe5.png)


### 분석 모형 구축

- 자동화된 변수 선택

![image](https://user-images.githubusercontent.com/78655692/142195433-78ff4279-322f-47fb-8e54-30d34488ff18.png)

### 분석 모형 구축

- 다중공선성 확인 및 문제 해결
- `car` 패키지의 vif 함수를 이용하여 *다중공선성* 문제가 있는지를 확인한다.

![image](https://user-images.githubusercontent.com/78655692/142196080-92195c64-10ab-4f84-99e0-0f60e1c013b2.png)

- AtBat과 Hits 변수에서 VIF가 10보다 크기 때문에 다중공선성 문제가 심각한 것으로 해석된다.
- VIF 수치가 가장 높은 AtBat를 제거한 후 모형을 생성한 후에 다시 다중공선성 문제를 확인한다.

![image](https://user-images.githubusercontent.com/78655692/142196439-c2389c68-c5a5-4c24-aeaa-7f39128b7d75.png)

- AtBat 변수를 제거한 후 다중공선성 문제가 해결되었다.

### 분석 모형 평가

![image](https://user-images.githubusercontent.com/78655692/142196616-d5546d79-d779-4778-859d-ea44175afe55.png)

## 로지스틱 회귀 분석

- **로지스틱 회귀 분석**은 반응변수가 범주형인 경우 적용되는 회귀 분석 모형이다.
- 새로운 설명변수의 값이 주어질 때 반응변수의 각 범주에 속할 확률이 얼마인지를 추정하여 추정 확률을 기준치에 따라 분류하는 목적으로 사용된다. 
- `glm(formula, family, data, ...)` : 일반화 선형모형 함수

|파라미터 | 설명|
|---|---|
|formula|(종속변수~독립변수) 형태로 선택|
|family|모델에서 사용할 분포<br>이항 로지스틱 회귀 분석의 경우 "binomial" 사용
|data|분석 대상 데이터|

## 혼동 행렬

- 분류 모형의 결과를 평가하기 위해서 혼동 행렬(Confusion Matrix)을 이용한 평가지표와 ROC 곡선의 AUC를 주로 이용한다.
- `confusionMatrix(data, reference)`

|파라미터 | 설명|
|---|---|
|data|예측된 분류 데이터 또는 분할표(table 형식)|
|reference|실제 분류 데이터|


## AUC(AUROC; Area Under ROC)

- ROC 곡선의 x축은 FPR(False Positive Ratio), y축은 TPR(True Positive Ratio)로 두고 아랫부분의 면적인 AUC를 기준으로 모형을 평가한다.
- AUC는 항상 1보다 작거나 같으며, 1에 가까울수록 좋은 모형으로 평가한다.
- `auc(actual, predicted, ...)`

|파라미터 | 설명|
|---|---|
|actual|정답인 label의 벡터(numeric, character 또는 factor)|
|predicted|예측된 값의 벡터|

## default 데이터셋 

![image](https://user-images.githubusercontent.com/78655692/142223206-8afe2717-ad95-46ea-9c6e-dd235c904f46.png)


### 1. 데이터 탐색

![image](https://user-images.githubusercontent.com/78655692/142215996-d3e75713-1537-4ad6-a67f-a20c6d5a371d.png)

*2. 전처리*
*3. 변수선택*

### 4. 분석 모형 구축 - 유의성 검정

![image](https://user-images.githubusercontent.com/78655692/142217931-efcfd7f5-fbc3-4c6d-a3f5-79a0c5d6635f.png)

### 5. 분석 모형 구축 - step 함수 이용

![image](https://user-images.githubusercontent.com/78655692/142218247-d1b6635a-be41-4b6e-b42b-f1829a98db25.png)

### 6. 분석 모형 구축 - 변수의 유의성 검정

![image](https://user-images.githubusercontent.com/78655692/142218589-445f8c3e-9cf8-4245-ba9e-66a33b6297b8.png)

### 7. 분석 모형 구축 - 다중공선성 확인

![image](https://user-images.githubusercontent.com/78655692/142219254-55537049-73e0-4567-a0c3-6addce34f79b.png)

- VIF가 4를 초과하면 다중공선성이 존재한다고 판단한다.

### 8. 분석 모형 평가 - 평가용 데이터를 이용한 분류

![image](https://user-images.githubusercontent.com/78655692/142220035-3f8fa943-d747-490f-a362-ad0633c81ddb.png)

- ifelse로 파산 여부를 확인

### 9. 분석 모형 평가 - 혼동 행렬

![image](https://user-images.githubusercontent.com/78655692/142240117-cf1abb73-41ea-4773-b4a5-a87bc5d79234.png)

### 10. 분석 모형 평가 - AUC

![image](https://user-images.githubusercontent.com/78655692/142222847-1653b524-85ca-4861-b7a3-16affb69c95f.png)



## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264) 
- [주성분 분석(Principal Component Analysis)](https://untitled-memo-2019.tistory.com/4)
- [4.3Logistic Regression](https://enook.jbnu.ac.kr/contents/19/#!/p/42)