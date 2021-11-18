---
layout: single
title: "R 기초 ~ 심화 문법 총정리 (7) - 분석 모형 구축"
excerpt: "+ ADsP, 빅데이터분석기사 실기 작업형 대비 - 연관성 분석까지"
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

## 군집 분석

- **군집 분석**은 관측된 여러 개의 변숫값으로부터 유사성에만 기초하여 n개의 군집으로 집단화하고, 형성된 집단의 특성으로부터 관계를 분석하는 다변량 분석기법이다.
- **연속형 변수 거리**로는 유클리드 거리, 맨하튼 거리, 민코우스키 거리, 표준화 거리, 마할라노비스 거리 등이 있다.
- **명목형 변수 거리**는 개체 i와 j 간의 거리의 정의이다.
  - `d(i,j)=(개체 i와 j에서 다른 값을 가지는 변수의 수)/ (총 변수의 수)`
- **순서형 변수 거리**는 순위 상관 계수(Rank Correlation Coefficient)를 이용하여 거리를 측정한다.

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


### 데이터 탐색

![image](https://user-images.githubusercontent.com/78655692/142361894-f6ecf604-bdac-49d1-8723-2d4f27219632.png)

### 유클리디안 거리 측정

![image](https://user-images.githubusercontent.com/78655692/142362077-65ae3bd4-b647-42e6-9097-9375307c85f7.png)

### 분석 모형 구축(계층적 군집 분석)

![image](https://user-images.githubusercontent.com/78655692/142362710-9fe4b525-e30c-45c8-aafd-3ea9147a5698.png)

![image](https://user-images.githubusercontent.com/78655692/142362743-03621758-0305-4846-9c6a-f3fd459848d0.png)

## 군집 분석을 통한 그룹 확인 

- 계층적 군집 분석의 결과는 plot 함수를 통해 덴드로그램으로 시각화할 수 있다.
- 덴드로그램 결과는 cutree 함수로 그룹화를 하거나 rect.hclust 함수를 이용하여 그룹화할 수 있다.

|함수|설명|
|---|---|
|plot(data)|거리 행렬 데이터를 기준으로 덴드로그램 그래프를 출력|
|cutree(tree, k, h)|덴드로그램 tree의 높이(h)나 그룹의 수(k)를 옵션으로 지정하여 그룹 생성|
|rect.hclust(tree, k, which, x, h, border, cluster)|hclust 함수의 결과에서 각 그룹을 사각형으로 구분|

![image](https://user-images.githubusercontent.com/78655692/142363270-e8a12251-ae9e-42ff-8199-9a98a33f04ff.png)

## 비계층적 군집 분석 - k평균 군집 분석 

- **k-평균**(k-means)는 k개만큼 원하는 군집 수를 초깃값으로 지정하고, 각 개체를 가까운 초깃값에 할당하여 군집을 형성하고 각 군집의 평균을 재계산하여 초깃값을 갱신한다. 갱신 과정을 반복하여 k개의 최종군집을 형성한다.
- `kmeans(data, centers)` 

### 분석 모형 구축

![image](https://user-images.githubusercontent.com/78655692/142364618-b4cfd3a2-fac7-478f-9f34-a8fdfa27a244.png)

### 분석 모형 활용

![image](https://user-images.githubusercontent.com/78655692/142364863-b76a23b1-e6f5-4dd0-8c99-93672cb85367.png)

![image](https://user-images.githubusercontent.com/78655692/142364885-d55766e8-4c7c-454c-ac8d-b7b5c71635e2.png)

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

### 데이터 세트 준비

![image](https://user-images.githubusercontent.com/78655692/142368883-77987181-d99c-4776-93ee-52c51129c8b1.png)

### apriori 함수를 통한 연관 규칙 생성 

![image](https://user-images.githubusercontent.com/78655692/142369111-7779a244-9237-46af-a254-3002f8b9b8f2.png)

### inspect 함수를 통해 연관 규칙 확인 

![image](https://user-images.githubusercontent.com/78655692/142369249-6e097798-999b-439b-941a-6edcf4815e07.png)



## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264) 