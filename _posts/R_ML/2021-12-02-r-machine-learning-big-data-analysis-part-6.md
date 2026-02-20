---
layout: single
title: "빅데이터분석기사 실기 2단원: 빅데이터 탐색 핵심 39문제 정리"
excerpt: "2021년 제 3회 빅데이터분석기사 실기를 위한 문제풀이 내용입니다. - 2단원. 빅데이터 탐색"
categories: R_ML
tags : [R, 빅데이터 분석기사, 실기, 필답형, 자격증, dataq, 정리, pdf, 기출문제, 정리본, 후기, 설명, 2회, 3회]
sidebar_main: false
classes: wide

last_modified_at: 2022-03-31
redirect_from:
  - /R_ML/solve_bigdata6/
---

빅데이터 분석기사 실기 대비 차원에서 쓴 글입니다. <br> 기출문제의 데이터는 [https://github.com/ingu627/BigDataAnalysis](https://github.com/ingu627/BigDataAnalysis)에 데이터 셋을 남겨놨습니다.
{: .notice--info}

**정답보기는 문제 왼쪽의 토글을 클릭합니다. ▶ 이거.**
{: .notice--danger}

혹시 해당 글을 pdf로 받고 싶으신 분은 이메일과 함께 댓글로 남겨주세요~
{: .notice--success}

<br>

## 2단원. 빅데이터 탐색

### 1.

<details>
    <summary>( )은/는 결측값을 채우거나 이상값을 제거하는 과정을 통해 데이터의 신뢰도를 높이는 작업이다.</summary>
    정답: 데이터 정제
</details>
<br>

### 2.

<details>
    <summary>( )은/는 필수적인 데이터가 입력되지 않고 누락된 값이다.</summary>
    정답: 결측값
</details>
<br>

### 3.

<details>
    <summary>데이터 오류의 원인 중 데이터의 범위에서 많이 벗어난 아주 작은 값이나 아주 큰 값은 ()(이)라고 한다. 괄호 ()안에 들어갈 용어를 쓰시오.</summary>
    정답: 이상값(Outlier)
</details>
<br>

### 4.

<details>
    <summary>괄호 ()안에 들어갈 가장 정확한 용어를 쓰시오. <br><br> ()은/는 데이터 일관성을 유지를 위한 정제 기법으로 데이터를 정제 규칙을 적용하기 위한 유의미한 최소 단위로 분할하는 작업이다.</summary>
    정답: 파싱(Parsing)
</details>
<br>

### 5.

<details>
    <summary>()은/는 데이터를 기준에 따라 나누고, 선택한 매개변수를 기반으로 유사한 데이터를 그룹화하여 효율적으로 사용할 수 있도록 사용하는 프로세스이다.</summary>
    정답: 데이터 세분화 (Data Segmentation)
</details>
<br>

### 6.

<details>
    <summary>데이터 세분화 방법 중 계층적 방법으로 각 개체를 하나의 소집단으로 간주하고 단계적으로 유사한 소집단들을 합쳐 새로운 소집단을 구성해가는 기법을 무엇이라고 하는가?</summary>
    정답: 응집분석법
</details>
<br>

### 7.

<details>
    <summary>다음이 설명하는 데이터 세분화 방법은 무엇인가?<br><br> 전체 집단으로부터 시작하여 유사성이 떨어지는 객체들을 분리해가는 계층적 방법</summary>
    정답: 분할분석법
</details>
<br>

### 8.

<details>
    <summary>데이터 세분화 방법 중 비 계층적 방법으로 K개 소집단의 중심좌표를 이용하여 각 개체와 중심좌표 간의 거리를 산출하고, 가장 근접한 소집단에 배정한 후 해당 소집단의 중심 좌표를 업데이트하는 방식으로 군집화하는 방식은 무엇인가?</summary>
    정답: K-평균 군집화
</details>
<br>

### 9.

<details>
    <summary>변수상에서 발생한 결측값이 다른 변수들과 아무런 상관이 없는 경우의 데이터 결측값을 무엇이라고 하는가?</summary>
    정답: 완전 무작위 결측(MCAR; Missing Completely At Random)
</details>
<br>

### 10.

<details>
    <summary>괄호 ()안에 들어갈 가장 정확한 용어를 쓰시오. <br><br> ()은/는 누락된 자료가 특정 변수와 관련되어 일어나지만, 그 변수의 결과는 관계가 없는 경우의 결측값으로 누락된 자료가 전체 정보가 있는 변수로 설명이 될 수 있는 데이터 결측값이다.</summary>
    정답: 무작위 결측(MAR; Missing At Random)
</details>
<br>

### 11.

<details>
    <summary>불완전 자료는 모두 무시하고 완전하게 관측된 자료만 사용하여 분석하는 방법으로 분석은 쉽지만, 부분적으로 관측된 자료가 무시되어 효율성이 상실되고 통계적 추론의 타당성 문제가 발생하는 단순 대치법의 종류는 무엇인가?</summary>
    정답: 완전 분석법
</details>
<br>

### 12.

<details>
    <summary>()은/는 관측 또는 실험되어 얻어진 자료의 평균값으로 결측값을 대치해서 불완전한 자료를 완전한 자료로 만드는 방법이다.</summary>
    정답: 평균 대치법
</details>
<br>

### 13.

<details>
    <summary>단순 확률 대치법의 종류 중 ()은/는 무응답을 현재 진행 중인 연구에서 "비슷한" 성향을 가진 응답자의 자료로 대체하는 방법이다.</summary>
    정답: 핫덱(Hot-Deck) 대체
</details>
<br>

### 14.

<details>
    <summary>단순 확률 대치법의 종류 중 핫덱과 비슷하나 대체할 자료를 현재 진행 중인 연구에서 얻는 것이 아니라 외부 출처 또는 이전의 비슷한 연구에서 가져오는 방법은 무엇인가?</summary>
    정답: 콜드덱(Cold-Deck) 대체
</details>
<br>

### 15.

<details>
    <summary>통계 기법을 이용한 데이터 이상값 검출 기법 중 평균($\mu$)으로부터 3 표준편차($\sigma$) 떨어진 값(각 0.15%)을 이상값으로 판단하는 검출 기법은 무엇인가?</summary>
    정답: ESD (Extreme Studentized Deviation)
</details>
<br>


### 16.

<details>
    <summary>괄호 ()안에 들어갈 가장 올바른 용어를 쓰시오. <br><br> 성별(변수 X)의 함수로 키(변수 Y)를 모델링한다고 가정하고, 일부 응답자가 키를 공개하지 않아서 일부 Y값이 누락되었다고 가정한다.<br>키가 작은 사람들은 키를 공개할 가능성이 적다.<br>이러한 경우 Y가 누락될 확률은 Y 자체의 관찰되지 않는 값에 달려 있다. 이러한 데이터는 ()(이)라고 말할 수 있다.</summary>
    정답: 비 무작위 결측 (MNAR)
</details>
<br>

### 17.

<details>
    <summary>다음이 설명하는 이상값 검출 기법은 무엇인가?<br><br> 오름차순으로 정렬된 데이터에서 범위에 대한 관측치 간의 차이에 대한 비율을 활용하여 이상값 여부를 검정하는 방법으로 데이터 수가 30개 미만인 경우에 적절한 방법이다.</summary>
    정답: 딕슨의 Q 검정(Dixon Q-Test)
</details>
<br>

### 18.

<details>
    <summary>정규분포를 만족하는 단변량 자료에서 이상값을 검정하는 방법은 무엇인가?</summary>
    정답: 그럽스 T-검정
</details>
<br>

### 19.

<details>
    <summary>()기법은 데이터의 분포를 고려한 거리 측도로, 관측치가 평균으로부터 벗어난 정도를 측정하는 통계량 기법이다.</summary>
    정답: 마할라노비스 거리
</details>
<br>

### 20.

<details>
    <summary>관측치 주변의 밀도와 근접한 관측치 주변의 밀도의 상대적인 비교를 통해 이상값을 탐색하는 기법은 무엇인가?</summary>
    정답: LOF(Local Of Factor)
</details>
<br>

### 21.

<details>
    <summary>()은/는 관측치 사이의 거리 또는 밀도에 의존하지 않고, 데이터 마이닝 기법인 의사결정나무(Decision Tree)를 이용하여 이상값을 탐지하는 방법이다. 괄호 ()안에 들어갈 기법을 쓰시오.</summary>
    정답: iForest 기법
</details>
<br>

### 22.

<details>
    <summary>데이터의 이상값 제거하기 위해서 상한값과 하한값을 벗어나는 값들을 하한, 상한값으로 바꾸어 활용하는 ()방법도 활용된다. 괄호 ()안에 들어갈 용어는 무엇인가?</summary>
    정답: 극단 값 조정
</details>
<br>

### 23.

<details>
    <summary>변수 선택 기법 중 특정 모델링 기법에 의존하지 않고 데이터의 통계적 특성으로부터 변수를 택하는 기법은 무엇인가?</summary>
    정답: 필터 기법
</details>
<br>

### 24.

<details>
    <summary>()은/는 변수의 일부만을 모델링에 사용하고 그 결과를 확인하는 작업을 반복하면서 변수를 선택해 나가는 기법이다.</summary>
    정답: 래퍼 기법
</details>
<br>

### 25.

<details>
    <summary>필터 기법을 적용한 사례 중에서 최대 가능성 방정식을 풀기 위해 통계에 사용되는 뉴턴(Newton)의 방법은 무엇인가?</summary>
    정답: 피셔 스코어 (Fisher Score)
</details>
<br>

### 26.

<details>
    <summary>래퍼 기법의 세부 기법 중 서포트 벡터 머신을 사용하여 재귀적으로 제거하는 방법으로 전진 선택, 후진 소거, 단계적 방법을 사용하는 기법은 무엇인가?</summary>
    정답: RFE (Recursive Feature Elimination)
</details>
<br>

### 27.

<details>
    <summary>()은/는 문제를 해결하는 과정에서 그 순간순간마다 최적이라고 생각되는 결정을 하는 방식으로 진행하여 최종 해답에 도달하는 문제 해결 방식인 그리디 알고리즘(Greedy Algorithm)을 이용하여 빈 부분 집합에서 특성 변수를 하나씩 추가하는 방법이다.</summary>
    정답: SFS(Sequential Feature Selection)
</details>
<br>

### 28.

<details>
    <summary>래퍼 기법의 세부 기법 중 특성 변수의 중복성을 최소화하는 방법으로 종속 변수를 잘 예측하면서, 독립변수들과도 중복성이 적은 변수들을 선택하는 방법을 무엇이라고 하는가?</summary>
    정답: mRMR (Minimum Redundancy Maximum Relevance)
</details>
<br>

### 29.

<details>
    <summary>변수 선택 기법 중 임베디드 기법의 세부 기법으로 가중치의 절댓값의 합을 최소화하는 것을 추가적인 제약조건으로 하는 방법으로 L1-norm을 통해 제약을 주는 기법은 무엇인가?</summary>
    정답: 라쏘 기법 (LASSO)
</details>
<br>

### 30.

<details>
    <summary>분석 대상이 되는 여러 변수의 정보를 최대한 유지하면서 데이터 세트 변수의 개수를 줄이는 탐색적 분석 기법을 무엇이라고 하는가?</summary>
    정답: 차원 축소
</details>
<br>

### 31.

<details>
    <summary>$M*N$차원의 행렬 데이터에서 특이값을 추출하고 이를 통해 주어진 데이터 세트를 효과적으로 축약할 수 있는 차원 축소 기법은 무엇인가?</summary>
    정답: 특이 값 분해 기법 (SVD; Singular Value Decomposition)
</details>
<br>

### 32.

<details>
    <summary>데이터 안에 관찰할 수 없는 잠재적인 변수(Latent Variable)가 존재한다고 가정하고 모형을 세운 뒤 관찰 가능한 데이터를 이용하여 해당 잠재 요인을 도출하고 데이터 안의 구조를 해석하는 기법을 무엇이라고 하는가?</summary>
    정답: 요인 분석
</details>
<br>

### 33.

<details>
    <summary>개체들 사이의 유사성, 비유사성을 측정하여 2차원 또는 3차원 공간상에 점으로 표현하여 개체들 사이의 집단화를 시각적으로 표현하는 분석 방법은 ()이다.</summary>
    정답: 다차원 척도법
</details>
<br>

### 34.

<details>
    <summary>기존 변수에 특정 조건 혹은 함수 등을 사용하여 새롭게 재정의한 변수를 무엇이라고 하는가?</summary>
    정답: 파생변수
</details>
<br>

### 35.

<details>
    <summary>()은/는 데이터값을 몇 개의 Bin으로 분할하여 계산하는 방법으로 데이터 평활화에서도 사용되는 기술이며, 기존 데이터를 범주화하기 위해서도 사용한다. 괄호 ()안에 적합한 변수 변환 방법은 무엇인가?</summary>
    정답: 비닝 (Binning)
</details>
<br>

### 36.

<details>
    <summary>불균형 데이터 처리 기법 중 다수 클래스의 데이터를 일부만 선택하여 데이터의 비율을 맞추는 방법은 무엇인가?</summary>
    정답: 과소 표집(Under-sampling)
</details>
<br>

### 37.

<details>
    <summary>다음은 불균형 데이터 처리 기법에 대한 설명이다. 괄호 ()안에 공통적으로 들어갈 가장 정확한 용어를 쓰시오.<br><br> ()은/는 소수 클래스의 데이터를 복제 또는 생성하여 데이터의 비율을 맞추는 방법으로 정보가 손실되지 않는다는 장점이 있으나, 과적합을 초래할 수 있다.<br>()은/는 알고리즘의 성능은 높으나 검증의 성능은 나빠질 수 있다.</summary>
    정답: 과대 표집(Over-sampling)
</details>
<br>

### 38.

<details>
    <summary>과소 표집(Under-sampling) 기법 중 소수 클래스 주위에 인접한 다수 클래스 데이터를 제거하여 데이터의 비율을 맞추는 기법은 무엇인가?</summary>
    정답: ENN (Edited Nearest Neighbor)
</details>
<br>

### 39.

<details>
    <summary>과대 표집(Over-sampling) 기법 중 소수 클래스에서 중심이 되는 데이터와 주변 데이터 사이에 가상의 직선을 만든 후, 그 위에 데이터를 추가하는 방법은 무엇인가?</summary>
    정답: SMOTE (Synthetic Minority Over-sampling TEchnique)
</details>
<br>

## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264)