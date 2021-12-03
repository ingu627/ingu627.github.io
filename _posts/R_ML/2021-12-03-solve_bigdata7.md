---
layout: single
title: "빅데이터분석기사(R) - 필답형 44문제 풀이"
excerpt: "2021년 제 3회 빅데이터분석기사 실기를 위한 문제풀이 내용입니다. - 3단원. 빅데이터 모델링"
categories: R_ML
tag : [R, certificate, 빅데이터 분석기사, 실기, 필답형]
sidebar_main: true
classes: wide

last_modified_at: 2021-12-03
---

빅데이터 분석기사 실기 대비 차원에서 쓴 글입니다. <br> 기출문제의 데이터는 [https://github.com/ingu627/BigDataAnalysis](https://github.com/ingu627/BigDataAnalysis)에 데이터 셋을 남겨놨습니다.
{: .notice--info}

**정답보기는 문제 왼쪽의 토글을 클릭합니다. ▶ 이거.**
{: .notice--danger}

<br>

## 3단원. 빅데이터 모델링

### 1.

<details>
    <summary>두 개 이상의 변수 간에 존재하는 상호 연관성의 정도를 측정하여 분석하는 방법<br>변수의 개수 및 데이터 속성에 따라서 세부 모델들로 분류</summary>
    정답: 상관 분석
</details>
<br>

### 2.

<details>
    <summary>하나 이상의 독립변수들이 종속변수에 미치는 영향을 추정할 수 있는 통계 기법을 무엇이라 하는가?</summary>
    정답: 회귀 분석
</details>
<br>

### 3.

<details>
    <summary>두 개 이상의 집단 간 비교를 수행하고자 할 때 집단 내의 분산, 총평균과 각 집단의 평균 차이에 의해 생긴 집단 간 분산 비교로 얻은 분포를 이용하여 가설 검정을 수행하는 방법은 무엇인가?</summary>
    정답: 분산 분석
</details>
<br>

### 4.

<details>
    <summary>많은 변수의 분산 방식(분산, 공분산)의 패턴을 간결하게 표현하는 주성분 변수를 원래 변수의 선형 결합으로 추출하는 통계 기법은 무엇인가?</summary>
    정답: 주성분 분석
</details>
<br>

### 5.

<details>
    <summary>집단에 대한 정보로부터 집단을 구별할 수 있는 판별규칙 혹은 판별함수를 만들고, 다변량 기법으로 조사된 집단에 대한 정보를 활용하여 새로운 개체가 어떤 집단인지를 탐색하는 통계 기법은 무엇인가?</summary>
    정답: 판별 분석
</details>
<br>

### 6.

<details>
    <summary>( ) 알고리즘은 각 독립변수를 이분화하는 과정을 반복하여 이진 트리 형태를 형성함으로써 분류를 수행하는 방법이다.</summary>
    정답: CART <br><br> CART 알고리즘은 지니 지수 또는 분산의 감소량을 이용하여 이분화(Binary Split)를 수행하는 알고리즘이다.
</details>
<br>

### 7.

<details>
    <summary>의사 결정 규칙을 트리구조로 도표화하여 분류와 예측을 수행하는 분석 방법 <br> 데이터들이 가진 속성들로부터 분할 기준 속성을 관별하고, 분할 기준 속성에 따라 트리 형태로 모델링하는 분류 예측 모델</summary>
    정답: 의사결정나무 <br><br> 의사결정나무는 판별 분석, 회귀 분석 등과 같은 변수 모형을 분석하기 위해 사전에 이상값을 검색할 때 사용한다.
</details>
<br>

### 8.

<details>
    <summary>사람 두뇌의 신경세포인 뉴런이 전기신호를 전달하는 모습을 모방한 예측 모델은 무엇인가?</summary>
    정답: 인공 신경망
</details>
<br>

### 9.

<details>
    <summary>K개 소집단의 중심좌표를 이용하여 각 객체와 중심좌표 간의 거리를 산출하고, 가장 근접한 소집단에 배정한 후 해당 소집단의 중심좌표를 업데이트하는 방식으로 군집화하는 알고리즘은 무엇인가?</summary>
    정답: K-평균 군집화 알고리즘
</details>
<br>

### 10.

<details>
    <summary>머신러닝에서 정답인 레이블(Label)이 포함되어 있는 훈련 데이터를 통해 컴퓨터를 학습시키는 방법을 무엇이라 하는가?</summary>
    정답: 지도 학습
</details>
<br>

### 11.

<details>
    <summary>의사결정나무의 특징인 분산이 크다는 점을 고려하여 배깅과 부스팅보다 더 많은 무작위성을 주어 약한 학습기들을 생성한 후 이를 선형 결합하여 최종 학습기를 만드는 방법은 무엇인가?</summary>
    정답: 랜덤 포레스트
</details>
<br>

### 12.

<details>
    <summary>입력 데이터에 대한 정답인 레이블(Label) 없는 상태에서 데이터가 어떻게 구성되었는지를 알아내는 기계 학습 기법</summary>
    정답: 비지도 학습
</details>
<br>

### 13.

<details>
    <summary>대뇌피질의 시각피질을 모델화한 인공 신경망의 일종으로, 차원 축소(Dimensionality Reduction)와 군집화(Clustering)를 동시에 수행하는 기법은 무엇인가?</summary>
    정답: 자기 조직화 지도
</details>
<br>

### 14.

<details>
    <summary>모델에서 외적인 요소로 데이터 분석을 통해 얻어지는 값이 아니라 사용자가 직접 설정해주는 값을 무엇이라 하는가?</summary>
    정답: 초매개변수(하이퍼 파라미터)
</details>
<br>

### 15.

<details>
    <summary>분석 모형을 구축할 때 적정 수준의 학습이 부족하여 모델이 단순해지는 현상으로 훈련 데이터와 테스트 데이터에 잘 동작하지 않는 것을 무엇이라 하는가?</summary>
    정답: 과소 적합
</details>
<br>

### 16.

<details>
    <summary>독립변수 후보 모두를 포함한 모형에서 출발한 제곱 합의 기준으로 가장 적은 영향을 주는 변수부터 하나씩 제거하면서 더 이상 유의하지 않은 변수가 없을 때까지 설명변수들을 제거하고 이때의 모형을 선택하는 변수 선택 방법은 무엇인가?</summary>
    정답: 후진 소거법
</details>
<br>

### 17.

<details>
    <summary>절편만 있는 상수 모형붙 시작해 중요하다고 생각되는 설명변수를 차례로 모형에 추가하는 변수 선택 기법은 무엇인가?</summary>
    정답: 전진 선택법
</details>
<br>

### 18.

<details>
    <summary>의사결정나무의 분석 과정 중 분석의 목적과 자료구조에 따라서 적절한 분리 규칙(Spliting Rule)을 찾아서 나무를 성장시키는 과정으로 적절한 정지 규칙(Stopping Rule)을 만족하면 중단하는 단계는 무엇인가?</summary>
    정답: 의사결정나무 성장 
</details>
<br>

### 19.

<details>
    <summary>의사결정나무의 분석 과정 중 분류 오류(Classification Error)를 크게 할 위험(Risk)이 높거나 부적절한 추론 규칙을 가지고 있는 가지(Branch) 또는 불필요한 가지를 제거하는 단계는 무엇인가?</summary>
    정답: 가지치기
</details>
<br>

### 20.

<details>
    <summary>가지치기를 사용할 때 학습자료를 사용<br>목표변수가 반드시 범주형이어야 하며, 불순도의 측도로는 엔트로피 지수(Entropy Index) 사용<br>CART와는 다르게 각 마디에서 다지 분리(Multiple Split)가 가능하며 범주형 입력변수에 대해서는 범주의 수만큼 분리가 일어남</summary>
    정답: C4.5와 C5.0 <br><br> C4.5는 ID3 알고리즘의 단점을 보완하고 새로운 기능을 추가한 알고리즘이다. 수치형 속성 처리, 결측치 처리, 속성선택 시 Branch의 수에 대한 가중치 적용, 가지치기(Prunning) 등의 기능을 추가하였다.
</details>
<br>

### 21.

<details>
    <summary>변수의 선택에서 범주의 개수가 많은 범주형 변수로의 편향(Bias)이 심각한 CART의 문제점을 개선한 알고리즘으로, 분리 방법은 이진 분리(Binary Split)를 사용하는 의사결정나무 알고리즘은 무엇인가?</summary>
    정답: QUEST
</details>
<br>

### 22.

<details>
    <summary>입력층과 출력층 사이에 하나 이상의 은닉층을 두어 비선형적으로 분리되는 데이터에 대해 학습이 가능한 기법은 무엇인가?</summary>
    정답: 다층 퍼셉트론
</details>
<br>

### 23.

<details>
    <summary>역방향으로 오차를 전파하면서 각 층의 가중치를 업데이트하고 최적의 학습 결과를 찾아가는 방법은 무엇인가?</summary>
    정답: 역전파 알고리즘
</details>
<br>

### 24.

<details>
    <summary>시그모이드 함수가 역전파를 위해 미분을 수행하는데, 미분 값을 계속 곱하다 보면 0에 가까워져 기울기가 사라지는 현상을 무엇이라 하는가?</summary>
    정답: 기울기 소실
</details>
<br>

### 25.

![image](https://user-images.githubusercontent.com/78655692/144559394-eb269c9b-4e10-4cd5-9b8b-1121b98cb1ad.png)

<details>
    <summary>다음 그래프가 의미하는 활성화 함수는 무엇인가?</summary>
    정답: ReLU
</details>
<br>

### 26.

![image](https://user-images.githubusercontent.com/78655692/144559496-38b5c59b-8ba3-4d48-8353-955cca696d31.png)

<details>
    <summary>다음 그래프가 의미하는 활성화 함수는 무엇인가?</summary>
    정답: 시그모이드 함수
</details>
<br>

### 27.

<details>
    <summary>서포트 벡터 머신에서 마진(Margin)의 안쪽이나 바깥쪽에 절대로 잘못 분류된 오 분류를 허용하지 않는 SVM 종류는 무엇인가?</summary>
    정답: 하드 마진 방식 <br><br> 하드 마진 방식은 매우 엄격하게 두 개의 클래스를 분리하는 초평면을 구하는 방법으로, 모든 입력은 초평면을 사이에 두고 무조건 하나의 클래스에 속해야 하는 방법이다.
</details>
<br>

### 28.

<details>
    <summary>()은/는 벡터 공간에서 훈련 데이터가 속한 2개의 그룹을 분류하기 위해 선형 분리자를 찾는 지도 학습 모델이다. <br> ()은/는 기계 학습의 한 분야로 사물 인식, 패턴 인식, 손 글씨 숫자 인식 등 다양한 분야에서 활용 되고 있는 지도 학습 모델이다. </summary>
    정답: 서포트 벡터 머신(SVM)
</details>
<br>

### 29.

<details>
    <summary>서포트 벡터 머신에서 완벽한 분리가 불가능할 때 선형적으로 분류를 위해 허용된 오차를 위한 변수를 무엇이라 하는가?</summary>
    정답: 슬랙 변수
</details>
<br>

### 30.

<details>
    <summary>데이터 간의 관계에서 조건과 반응을 연결하는 분석으로 장바구니 분석(Market Basket Analysis), 서열 분석(Sequence Analysis)이라고도 하는 용어는 무엇인가?</summary>
    정답: 연관성 분석
</details>
<br>

### 31.

<details>
    <summary>두 집합 사이의 유사도를 측정하는 방법으로, 0과 1사이의 값을 가지며 두 집합이 동일하면 1의 값, 공통의 원소가 하나도 없으면 0의 값을 가지는 계수는 무엇인가?</summary>
    정답: 자카드 계수
</details>
<br>

### 32.

<details>
    <summary>관측되지 않은 잠재변수에 의존하는 확률 모델에서 최대 가능도나 최대사후 확률을 갖는 모수의 추정값을 찾는 반복적인 알고리즘은 무엇인가?</summary>
    정답: EM 알고리즘
</details>
<br>

### 33.

<details>
    <summary>1개의 요인을 대상으로 표본 집단의 분포가 주어진 특정 이론을 따르고 있는지를 검정하는 기법은 무엇인가?</summary>
    정답: 적합도 검정
</details>
<br>

### 34.

<details>
    <summary>각각의 독립적인 부모집단으로부터 정해진 표본의 크기만큼 자료를 추출하는 경우에 관측값들이 정해진 범주 내에서 서로 동질한지(비슷하게 나타나고 있는지) 여부를 검정하는 기법은 무엇인가?</summary>
    정답: 동질성 검정
</details>
<br>

### 35.

<details>
    <summary>시계열 모델 중 자신의 과거 값으 사용하여 설명하는 모형으로 백색 잡음의 현재 분기/반기/연간 단위로 다음 지표를 예측하거나 주간/월간 단위로 지표를 리뷰하여 트렌드를 분석하는 기법은 무엇인가?</summary>
    정답: ARIMA 모델 
</details>
<br>

### 36.

<details>
    <summary>고정된 주기에 따라 자료가 변화할 경우 <br> ex. 요일마다 반복, 일 년 중 각 월에 의한 변화, 사분기 자료에서 각 분기에 의한 변화 등</summary>
    정답: 계절 요인
</details>
<br>

### 37.

<details>
    <summary>딥러닝 알고리즘으로 시각적 이미지를 분석하는 데 주로 사용되는 심층신경망은 무엇인가?</summary>
    정답: CNN 알고리즘
</details>
<br>

### 38.

<details>
    <summary>입력층, 은닉층, 출력층으로 구성되며 은닉층에서 재귀적인 신경망을 갖는 알고리즘이다.<br>음성신호, 연속적 시계열 데이터 분석에 적합핟. <br> 장기 의존성 문제와 기울기 소실문제가 발생하여 학습이 이루어지지 않을 수 있다. </summary>
    정답: RNN 알고리즘
</details>
<br>

### 39.

<details>
    <summary>인간이 이해할 수 있는 언어를 기계가 이해할 수 있게 하는 기술은 무엇이라 하는가?</summary>
    정답: 자연어 처리
</details>
<br>

### 40.

<details>
    <summary>주관적인 의견이 포함된 데이터에서 사용자가 게재한 의견과 감정을 나타내는 패턴을 분석하는 기법은 무엇인가?</summary>
    정답: 오피니언 마이닝
</details>
<br>

### 41.

<details>
    <summary>개인과 집단들 간의 관계를 노드를 링크로 그룹에 속한 사람들 간의 네트워크 특성과 구조를 분석하고 시각화하는 분석 기법은 무엇인가?</summary>
    정답: 사회 연결망 분석
</details>
<br>

### 42.

<details>
    <summary>여러 가지 동일한 종류 또는 서로 상이한 모형들의 예측/분류 결과를 종합하여 최종적인 의사 결정에 활용하는 기법을 무엇이라 하는가?</summary>
    정답: 앙상블 기법
</details>
<br>

### 43.

<details>
    <summary>훈련 데이터에서 다수의 부트스트랩(Bootstrap) 자료를 생성하고, 각 자료를 모델링한 후 결합하여 최종 예측 모형을 만드는 알고리즘은 무엇인가?</summary>
    정답: 배깅(bagging)
</details>
<br>

### 44.

<details>
    <summary>잘못 분류된 개체들에 가중치를 적용, 새로운 분류 규칙을 만들고, 이 과정을 반복해 최종 모형을 만드는 알고리즘은 무엇인지 쓰시오.</summary>
    정답: 부스팅(Boosting)
</details>
<br>


