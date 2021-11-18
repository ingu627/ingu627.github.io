---
layout: single
title: "R 기초 ~ 심화 문법 총정리 (5) - 분석 모형 구축"
excerpt: "+ ADsP, 빅데이터분석기사 실기 작업형 대비 - 나이브베이즈 정리까지"
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


## 의사결정나무

- **의사결정나무**는 데이터들이 가진 속성들로부터 분할 기준 속성을 판별하고, 분할 기준 속성에 따라 트리 형태로 모델링하는 분류 예측 모델이다.
- **의사결정나무 기법**은 분석의 대상을 분류 함수를 활용하여 의사결정 규칙으로 이루어진 나무 모양으로 그리는 기법이다.

### 의사결정나무 분석 함수 종류

|함수|설명|코드|
|---|---|---|
|rpart()|CART 기법 방법을 사용<br>전체 데이터 세트를 가지고 시작하여 모든 예측변수를 사용하여 데이터 세트의 부분집합을 분할해 생성|library(rpart)<br>rpart(formula, data)|
|tree()|불순도의 측도로 엔트로피 지수를 사용|library(tree)<br>tree(formula, data)|
|ctree()|분석 결과에서 별도로 가지치기 할 필요가 없음|library(party)<br>ctree(formula, data)|

### 의사결정나무 예시

*1. 데이터 탐색*

![image](https://user-images.githubusercontent.com/78655692/142234405-ba37714f-bcfc-494b-b919-15eb34b02d0f.png)

*2. 전처리*
*3. 변수선택*

*4. 분석 모형 구축*

![image](https://user-images.githubusercontent.com/78655692/142234950-4dce54e3-a993-4ca8-ba36-05319b1d4aa1.png)

![image](https://user-images.githubusercontent.com/78655692/142235715-8c5fdf97-6263-4af9-82c3-178860fd1785.png)

*5. 분석 모형 평가*

![image](https://user-images.githubusercontent.com/78655692/142238866-4bb1d582-48d9-4d4c-9536-a4d4fe86f2f5.png)

![image](https://user-images.githubusercontent.com/78655692/142239225-992e8f50-8ca0-4934-bb77-ac32ce297cfc.png)

|내부 변수|설명|
|---|---|
|CP|복잡성|
|nsplit|가지의 분기 수|
|rel error|오류율|
|xerror|교차 검증 오류|
|xstd|교차 검증 오류의 표준오차|

*6. 혼동 행렬 확인*

![image](https://user-images.githubusercontent.com/78655692/142240832-71261ded-5873-4398-b207-ab253278a327.png)

- `confusionMatrix(actual, predicted)`

## 서포트 벡터 머신(SVM)

- **서포트 벡터 머신(SVM; Support Vecotr Machine)**은 데이터를 분리하는 초평면(Hyperplane)중에서 데이터들과 거리가 가장 먼 초평면을 선택하여 분리하는 지도 학습 기반의 이진 선형 분류 모델이다.
- 최대 마진(Margin : 여유공간)을 가지는 비확률적 선형 판별에 기초한 이진 분류기이다.
- `svm(formula, data = NULL)`
- `predict(object, data, type)`

|파라미터|설명|
|---|---|
|object|svm의 객체|
|data|예측을 수행할 데이터|
|type|예측 결과의 유형<br>response(예측값), probabilities(확률)을 가짐|

*분석 모형 구축*

![image](https://user-images.githubusercontent.com/78655692/142241954-55e7f3e5-9c68-43a0-b315-a102ae68dea0.png)

*분석 모형 평가*

![image](https://user-images.githubusercontent.com/78655692/142242395-89a64ed9-dae5-45f7-93c3-e35a5b129032.png)

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

### 1. 데이터 세트

![image](https://user-images.githubusercontent.com/78655692/142243645-431a94f9-32b3-4c03-b380-c04128242256.png)

### 2. 변수 할당

![image](https://user-images.githubusercontent.com/78655692/142244539-65f9619e-c80e-4bdf-8949-983e71d69232.png)

### 3. 변수 선택

![image](https://user-images.githubusercontent.com/78655692/142248085-825782c5-9b1d-49b6-af67-a98291a66ed5.png)

![image](https://user-images.githubusercontent.com/78655692/142248144-f137abaa-4b5c-4b74-a579-5d590ec8608a.png)

### 4. 분류 정확도 최적화

![image](https://user-images.githubusercontent.com/78655692/142249334-d37c1574-330b-4683-a8e0-3dbb721223f1.png)

### 5. 모형 평가

![image](https://user-images.githubusercontent.com/78655692/142250178-0898bbcb-f08b-4c8d-9aa2-e5a4ebadeeb7.png)

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

### 1. 전처리

![image](https://user-images.githubusercontent.com/78655692/142252196-32df99cb-aa12-4eef-92bf-ce6d0f8bd1a3.png)

### 2. 분석 모형 구축

![image](https://user-images.githubusercontent.com/78655692/142252485-68d183bd-8744-4fc6-be28-d407375f30c7.png)

> **해석**  
> seed 값은 1234로 설정  
> nnet 함수 생성. 종속변수는 Species이고 독립변수는 Species를 제외하여 수식 설정  
> 데이터는 train, 은닉층(size)은 2로 설정. 반복할 최대 횟수(maxit)는 200으로 설정. 가중치 감소의 모수를 5e-04로 설정  

### 3. 요약 정보 추출

![image](https://user-images.githubusercontent.com/78655692/142253094-c1062827-ca63-4e24-8d77-48aa7856a815.png)

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

### 분석 모형 구축

![image](https://user-images.githubusercontent.com/78655692/142254478-c8df09d0-53c1-499b-9079-0fde827cfee2.png)

![image](https://user-images.githubusercontent.com/78655692/142254543-aaff6ef9-0958-4246-b564-cd481a43cee7.png)

### 분석 모형 평가

![image](https://user-images.githubusercontent.com/78655692/142255014-321e1ebb-f659-4417-835e-df41527d585b.png)


## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264) 