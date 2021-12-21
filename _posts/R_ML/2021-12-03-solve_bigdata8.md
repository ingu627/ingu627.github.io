---
layout: single
title: "빅데이터분석기사(R) - 필답형 48문제 풀이 (4)"
excerpt: "2021년 제 3회 빅데이터분석기사 실기를 위한 문제풀이 내용입니다. - 4단원. 빅데이터 결과해석"
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

## 4단원. 빅데이터 결과해석

### 1.

<details>
    <summary>학습 알고리즘에서 잘못된 가정을 했을 때 발생하는 오차</summary>
    정답: 편향 <br><br> 분산: 훈련 데이터(Training Set)에 내재된 작은 변동으로 발생하는 오차
</details>
<br>

### 2.

<details>
    <summary>회귀 모형이 실젯값을 얼마나 잘 나타내는지에 대한 비율이다.<br>선형 회귀 분석의 성능 검증지표로 많이 이용된다.</summary>
    정답: 결정계수
</details>
<br>

### 3.

<details>
    <summary>혼동 행렬을 통한 분류 모형의 평가지표 중에서 실제 분류 범주를 정확하게 예측한 비율로 전체 예측에서 참 긍정(TP)과 참 부정(TN)이 차지하는 비율</summary>
    정답: 정확도<br>$(TP+TN)/(TP+FP+TN+FN)$
</details>
<br>

### 4.

<details>
    <summary>(   )은/는 혼동 행렬을 통한 분류 모형의 평가지표중에서 실제로 '긍정'인 범주 중에서 '긍정'으로 올바르게 예측(TP)한 비율로 Hit Rate로도 지칭한다.괄호( )안에 들어갈 용어를 쓰시오.</summary>
    정답: 재현율(Recall)(TR rate) or 민감도(Sensitivity) <br> $TP/(TP+FN)$
</details>
<br>

### 5.

<details>
    <summary>혼동 행렬을 통한 분류 모형의 평가지표 중에서 실제로 '부정'인 범주 중에서 '부정'으로 올바르게 예측(TN)한 비율은 무엇인가?</summary>
    정답: 특이도(Specificity) <br> $TN/(TN+FP)$
</details>
<br>

### 6.

<details>
    <summary>(  )은/는 혼동 행렬을 통한 분류 모형의 평가지표 중에서 실제로 '부정'인 범주 중에서 '긍정'으로 잘못 예측(FP)한 비율로 (1-특이도)라고 할 수 있다. 괄호( )안에 들어갈 용어를 쓰시오.</summary>
    정답: 거짓 긍정률(FP rate)<br>$FP/(TN+FP)$
</details>
<br>

### 7.

<details>
    <summary>혼동 행렬을 통한 분류 모형의 평가지표 중에서 '긍정'으로 예측한 비율 중에서 실제로 '긍정'(TP)인 비율은 무엇인가?</summary>
    정답: 정밀도(Precision)<br>$TP/(TP+FP)$
</details>
<br>

### 8.

<details>
    <summary>()은/는 혼동 행렬을 통한 분류 모형의 평가지표 중에서 정밀도와 민감도(재현율)를 하나로 합한 성능평가 지표로 0~1 사이의 범위를 가진다. 괄호()안에 들어갈 용어를 쓰시오.</summary>
    정답: F1-Score(F-Measure)<br>$2*(Prcision* Recall)/(Precision + Recall)$
</details>
<br>

### 9.

<details>
    <summary>두 관찰자가 측정한 범주 값에 대한 일치도를 측정하는 방법으로 0~1의 값을 가지며 1에 가까울수록 모델의 예측값과 실젯값이 정확히 일치하며, 0에 가까울수록 모델의 예측값과 실젯값이 불일치한다.</summary>
    정답: 카파 통계량(Kappa Statistic)
</details>
<br>

### 10.

<details>
    <summary>가로축(x)을 혼동 행렬의 거짓 긍정률(FP Rate)로 두고 세로축(y)을 참 긍정률(TP Rate)로 두어 시각화한 그래프이다.<br>그래프가 왼쪽 꼭대기에 가깝게 그려질수록 분류 성능이 우수하다. </summary>
    정답: ROC 곡선
</details>
<br>

### 11.

<details>
    <summary>목표 범주에 속하는 개체들이 임의로 나눈 등급별로 얼마나 분포하고 있는지를 나타내는 값을 통해 분류 모형의 성능을 평가하는 그래프 분석 방법</summary>
    정답: 이익 도표
</details>
<br>

### 12.

<details>
    <summary>데이터 분석 모형 구축 시 발생할 수 있는 오류 중에서 분석 모형을 만들 때 주어진 데이터 집합의 특성을 지나치게 반영하여 발생하는 오류로 주어진 데이터 집합은 모집단 일부분임에도 불구하고 그것이 가지고 있는 주변적인 특성, 단순 잡음 등을 모두 묘사하기 때문에 발생하는 오류</summary>
    정답: 일반화 오류(Generalization Error)
</details>
<br>

### 13.

<details>
    <summary>전체 데이터를 비복원 추출 방법을 이용하여 랜덤하게 훈련 데이터(Training Set), 평가 데이터(Test Set)로 나눠 검증하는 기법이다.<br>훈련 데이터로 분석 모형을 구축하고, 평가 데이터를 이용하여 분석 모형을 평가하는 기법이다. <br> 계산량이 많지 않아 평가 데이터만큼은 학습에 사용할 수 없으므로 데이터 손실이 발생하고, 데이터를 어떻게 나누느냐에 따라 결과가 많이 달라질 수 있다.</summary>
    정답: 홀드 아웃 교차 검증(Holdout Cross Validation)
</details>
<br>

### 14.

<details>
    <summary>데이터 집합을 무작위로 동일 크기를 갖는 K개의 부분집합으로 나누고, 그중 1개의 집합을 평가 데이터(Test Set)로, 나머지 (K-1)개 집합을 훈련 데이터(Training Set)로 선정하여 분석 모형을 평가하는 기법</summary>
    정답: K-겹 교차 검증(k-fold cross-validation)
</details>
<br>

### 15.

<details>
    <summary>()은/는 전체 데이터 N개에서 1개의 샘플만을 평가 데이터에 사용하고 나머지 (N-1)개는 훈련 데이터로 사용하는 과정을 N번 반복하는 교차 검증 기법으로 가능한 한 많은 데이터를 훈련에 사용할 수 있지만, 수행 시간과 계산량이 많고, 작은 크기의 데이터에 사용하기 좋다. 괄호()안에 들어갈 용어를 쓰시오.</summary>
    정답: LOOCV(Leave-One-Out Cross Validation)
</details>
<br>

### 16.

<details>
    <summary>주어진 자료에서 단순 랜덤 복원 추출 방법을 활용하여 동일한 크기의 표본을 여러 개 생성하는 샘플링 방법<br> 무작위 복원 추출 방법으로, 전체 데이터에서 중복을 허용하여 데이터 크기만큼 샘플을 추출하고 이를 훈련 데이터(Training Set)로 한다.</summary>
    정답: 부트스트랩(Bootstrap)
</details>
<br>

### 17.

<details>
    <summary>모집단의 평균에 대한 유의성 검정 중 귀무가설에서 검정 통계량의 분포를 정규분포로 근사할 수 있는 통계 검정으로 정규분포를 가정하며, 추출된 표본이 동일 모집단에 속하는지 가설을 검증하기 위해 사용하는 기법은 무엇인가?</summary>
    정답: Z-검정
</details>
<br>

### 18.

<details>
    <summary>분산 분석은 두 개 이상의 집단 간 비교를 수행하고자 할 때 집단 내의 분산, 총 평균과 각 집단의 평균 차이에 의해 생긴 집단 간 분산 비교로 얻은 ()을/를 이용하여 가설 검정을 수행하는 방법이다. 괄호 ()안에 들어갈 용어를 쓰시오.</summary>
    정답: F-분포
</details>
<br>

### 19.

<details>
    <summary>분산 분석 중 종속변수가 1개, 독립변수가 2개일 때 각 독립변수의 범주에 대응하는 종속변수 간에 평균의 차이를 검정하는 방법은 무엇인가?</summary>
    정답: 이원배치 분산 분석
</details>
<br>

### 20.

<details>
    <summary>()은/는 분석 독립변수가 3개 이상이고 종속변수가 1개일 때 분석하는 기법이다. 괄호 ()안에 들어갈 용어를 쓰시오.</summary>
    정답: 다원배치 분산 분석
</details>
<br>

### 21.

<details>
    <summary>독립변수가 1개 이상이고 종속변수가 2개 이상일 때 두 집단 간 평균 차이를 검증하기 위해 사용하는 분석 기법은 무엇인가?</summary>
    정답: 다변량 분산 분석
</details>
<br>

### 22.

<details>
    <summary>모집단의 분산에 대한 유의성 검정 중 ()은/는 관찰된 빈도가 기대되는 빈도와 유의미하게 다른지를 검정하기 위해 사용되며 단일 표본의 모집단이 정규분포를 따르며 분산을 알고 있는 경우에 적용하고, 두 집단 간의 동질성 검정에 활용된다. 괄호 ()안에 들어갈 용어를 쓰시오.</summary>
    정답: 카이제곱 검정
</details>
<br>

### 23.

<details>
    <summary>그래프를 이용하여 정규성 가정을 시각적으로 검정하는 방법이다. <br> 대각선 참조선을 따라서 값들이 분포하게 되면 정규성 가정을 만족한다고 할 수 있다. <br> 한쪽으로 치우치는 모습이라면 정규성 가정에 위배되었다고 볼 수 있다. </summary>
    정답: Q-Q Plot
</details>
<br>

### 24.

<details>
    <summary>데이터가 정규 분포를 따르는지 확인하기 위한 검정 방법으로 일반적으로 표본의 개수가 2,000개보다 많을 경우에 사용하며 비교 기준이 되는 데이터를 정규 분포를 가진 데이터로 두어서 정규성 검정을 실시할 수 있는 검정 방법은?</summary>
    정답: K-S 검정<br><br> 참조 : 일반적으로 표본의 수가 적을 경우에는 샤피로-월크 검정을 사용한다.
</details>
<br>

### 25.

<details>
    <summary>()은/는 제한된 훈련 데이터 세트가 지나치게 특화되어 새로운 데이터에 대한 오차가 매우 커지는 현상으로 모델의 매개변수 수가 많거나 훈련 데이터 세트의 양이 부족한 경우에 발생한다. 괄호 ()안에 들어갈 용어를 쓰시오.</summary>
    정답: 과대 적합
</details>
<br>

### 26.

<details>
    <summary>과대 적합 방지방안으로 훈련 데이터 세트의 양이 적을 경우, 해당 데이터의 특정 패턴이나 노이즈까지 분석되어 과대 적합 현상이 발생할 확률이 높으므로 충분한 데이터 세트를 확보할 수 있도록 데이터를 변형해서 늘려주는 방법은 무엇인가?</summary>
    정답: 데이터 증강
</details>
<br>

### 27.

<details>
    <summary>과대 적합 방지방안 중 가중치 규제는 개별 가중치 값을 제한하여 복합한 모델을 좀 더 간단하게 하는 방법이다. 가중치 규제 중 ()은/는 기존 비용 함수에 모든 가중치 w들의 절댓값 합계를 추가하여 값이 최소가 되도록하는 방법이다. 괄호 ( )안에 들어갈 용어를 쓰시오.</summary>
    정답: 라쏘(Lasso) 또는 L1 노름 규제
</details>
<br>

### 28.

<details>
    <summary>가중치 규제 방법 중 기존 비용 함수에 모든 가중치 w들의 '제곱합'을 추가하는 방법으로 가중치 감소(Weight Decay)라고도 하며, 가중치가 가장 큰 것은 페널티를 부과하여 과적합 위험을 줄이는 방법</summary>
    정답: 릿지(Ridge) 또는 L2 노름 규제
</details>
<br>

### 29.

<details>
    <summary>가중치 규제 방법 중 기존 비용 함수에 L1 노름 규제, L2 노름 규제를 추가하는 방법으로 알파와 베타의 조합에 따라 노름을 조절하여 정규화를 할 수 있는 방법은 무엇인가?</summary>
    정답: Elastic Net
</details>
<br>

### 30.

<details>
    <summary>학습 과정에서 신경망 일부를 사용하지 않는 방법으로 과대 적합을 방지할 수 있다.<br>신경망 학습 시에만 사용하고, 예측 시에는 사용하지 않는다.<br>서로 다른 신경망들을 앙상블하여  사용하는 것 같은 효과를 내어 과대 적합을 방지한다.</summary>
    정답: 드롭아웃
</details>
<br>

### 31.

<details>
    <summary>손실 함수의 기울기를 구하여, 그 기울기를 따라 조금씩 아래로 내려가 최종적으로는 손실 함수가 가장 작은 지점에 도달하도록 하는 알고리즘이다. <br>손실 함수 그래프에서 지역 극소점에 갇혀 전역 극소점을 찾지 못하는 경우가 많고, 손실 함수가 비등방성 함수일 때에서는 최적화에 있어 매우 비효율적이고 오래 걸리는 탐색 경로를 보여준다.</summary>
    정답: 확률적 경사 하강법 (SGD)
</details>
<br>

### 32.

<details>
    <summary>매개변수는 주어진 데이터로부터 학습을 통해 모델 내부에서 결정되는 변수이다. 매개변수의 종류 중에서 ()은/는 하나의 뉴런에 입력된 모든 값을 다 더한 값(가중합)에 더해주는 상수이다. 괄호 ()안에 들어갈 용어를 쓰시오.</summary>
    정답: 편향(bias)
</details>
<br>

### 33.

<details>
    <summary>함수의 기울기(경사)를 구하여 기울기가 낮은 쪽으로 계속 이동시켜서 극값에 이를 때까지 반복시키는 기법은 무엇인가?</summary>
    정답: 경사 하강법 (Gradient Descent)
</details>
<br>

### 34.

<details>
    <summary>( ) 은/는 기울기 방향으로 힘을 받으면 물체가 가속된다는 물리 법칙을 적용한 알고리즘이다. ( ) 은/는 확률적 경사 하강법(SGD)에 속도라는 개념을 적용한 방법으로 기울기가 줄어들더라도 누적된 기울기 값으로 인해 빠르게 최적점으로 수렴하게 된다. 괄호 ( )안에 공통적으로 들어갈 용어를 쓰시오.</summary>
    정답: 모멘텀
</details>
<br>

### 35.

<details>
    <summary>매개변수 최적화 기법 중 손실 함수의 기울기가 큰 첫 부분에서는 크게 학습하다가, 최적점에 가까워질수록 학습률을 줄여 조금씩 적게 학습하는 방식으로 매개변수 전체의 학습률 값을 일괄적으로 낮추는 것이 아니라 각각의 매개변수에 맞는 학습률 값을 만들어주는 방식은 무엇인가?</summary>
    정답: AdaGrad
</details>
<br>

### 36.

<details>
    <summary>모멘텀 방식과 AdaGrad 방식의 장점을 합친 알고리즘으로 최적점 탐색 경로 또한 이 두 방식을 합친 것과 비슷한 양상으로 나타난다. <br> 탐색 경로의 전체적인 경향은 모멘텀 방식처럼 공이 굴러가는 듯하고, AdaGrad로 인해 갱신 강도가 조정되므로 모멘텀 방식보다 좌우 흔들림이 덜 한 것을 볼 수 있다.</summary>
    정답: Adam
</details>
<br>

### 37.

<details>
    <summary>( )은/는 의사결정나무(Decision Tree)를 개별 모형으로 사용하는 모형 결합 방법으로 모든 독립변수를 비교하여 최선의 독립변수를 선택하는 것이 아니라 독립변수 차원을 랜덤하게 감소시킨 다음 그중에서 독립변수를 선택한다. 괄호 ( ) 안에 들어갈 단어는 무엇인가?</summary>
    정답: 랜덤 포레스트(random forest)
</details>
<br>

### 38.

<details>
    <summary>취합 방법론 중에서 훈련 데이터를 중복하여 사용하지 않고 훈련 데이터 세트를 나누는 기법으로 비복원 추출 방법은 무엇인가?</summary>
    정답: 페이스팅
</details>
<br>

### 39.

<details>
    <summary>( )은/는 잘못 예측한 데이터에 가중치를 부여하여 오류를 개선하는 부스팅 알고리즘이다. 괄호 ( )안에 들어갈 용어를 쓰시오.</summary>
    정답: 에이다 부스트(AdaBoost)
</details>
<br>

### 40.

<details>
    <summary>경사 하강법(Gradient Descent)을 이용하여 가중치 업데이트로 최적화된 결과를 얻는 부스팅 알고리즘은 무엇인가?</summary>
    정답: 그레디언트 부스트 머신
</details>
<br>

### 41.

<details>
    <summary>( )은/는 분류에 따른 변화를 최대, 최소, 전체 분포 등으로 구분하는 방법으로 전체에서 부분 간 관계를 설명하낟. 종류에는 파이 차트, 도넛 차트, 트리맵, 누적 영역 차트가 있다. 괄호 ( )안에 들어갈 용어를 쓰시오.</summary>
    정답: 분포 시각화
</details>
<br>

### 42.

<details>
    <summary>집단 간의 상관관계를 확인하여 다른 수치의 변화를 예측하는 시각화 기법은?</summary>
    정답: 관계 시각화<br><br> 관계 시각화 기법에는 산점도, 산점도 행렬, 버블차트, 히스토그램, 네트워크 그래프(Map)가 있다.
</details>
<br>

### 43.

<details>
    <summary>각각의 데이터 간의 차이점과 유사성 관계도 확인하는 방법이다.<br>기법에는 플로팅 바 차트, 히트맵, 체르노프 페이스, 스타 차트, 평행 좌표계가 있다. </summary>
    정답: 비교 시각화
</details>
<br>

### 44.

<details>
    <summary>비즈니스 기여도 평가지표 중 하나의 자산을 획득하려 할 때 주어진 기간 동안 모든 연관 비용을 고려할 수 있도록 확인하기 위해 사용되는 지표는 무엇인가?</summary>
    정답: 총 소유 비용 (TCO)
</details>
<br>

### 45.

<details>
    <summary>( )은/는 자본 투자에 따른 순 효과의 비율을 의미(투자 타당성)한다. 괄호 ()안에 들어갈 용어를 쓰시오.</summary>
    정답: 투자 대비 효과 (ROI; return on investment)
</details>
<br>

### 46.

<details>
    <summary>( )은/는 특정 시점의 투자금액과 매출금액의 차이를 이자율을 고려하여 계산한 값으로 예상 투자비용의 할인가치를 예쌍 수익의 할인가치에서 공제했을 때, 나온 값을 합한 금액(미래시점의 순이익 규모)이다. 괄호 ( )안에 들어갈 용어를 쓰시오.</summary>
    정답: 순 현재가치(NPV)
</details>
<br>

### 47.

<details>
    <summary>비즈니스 기여도 평가지표 중 순 현재가치를 "0"으로 만드는 할인율(연 단위 기대수익 규모)은 무엇인가?</summary>
    정답: 내부 수익률(IPR)
</details>
<br>

### 48.

<details>
    <summary>누계 투자금액과 매출금액의 합이 같아지는 기간이다.<br>프로젝트의 시작 시점부터 누적 현금흐름이 흑자로 돌아서는 시점까지의 기간(흑자 전환 시점)이다.</summary>
    정답: 투자 회수 기간(PP)
</details>
<br>

## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264)