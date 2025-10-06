---
layout: single
title: "스파크 PySpark 추천 시스템 구현 가이드"
excerpt: "Spark The Definitive Guide 책을 중심으로 스파크를 요약 및 정리해보았습니다. spark 예제를 통해 pyspark를 이용한 간단한 추천 시스템 만드는 것에 대해 알아봅니다."
categories: spark
tags: [아파치, 스파크, spark, 정리, 의미, 란, 이란, 사용법, pyspark, 추천 시스템, recommender system, 협업 필터링, 교차최소제곱, als]
toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2022-12-02
---

<img align='right' width='150' height='200' src='https://user-images.githubusercontent.com/78655692/186088421-fe905f9e-d40f-43b2-ac6e-094e9c342473.png'>
[Spark The Definitive Guide - BIG DATA PROCESSING MADE SIMPLE] 책을 중심으로 스파크를 개인 공부를 위해 요약 및 정리해보았습니다. <br> 다소 복잡한 설치 과정은 도커에 미리 이미지를 업로해 놓았습니다. 즉, 도커 이미지를 pull하면 바로 스파크를 사용할 수 있습니다. <br><br> 도커 설치 및 활용하는 방법 : [[Spark] 빅데이터와 아파치 스파크란 - 1.2 스파크 실행하기](https://ingu627.github.io/spark/spark_db1/#12-%EC%8A%A4%ED%8C%8C%ED%81%AC-%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0) <br> 도커 이미지 링크 : [https://hub.docker.com/r/ingu627/hadoop](https://hub.docker.com/r/ingu627/hadoop) <br> 예제를 위한 데이터 링크 : [FVBros/Spark-The-Definitive-Guide](https://github.com/ingu627/BigData/tree/master/spark/data) <br> 예제에 대한 실행 언어는 파이썬 기반인 pyspark를 이용했습니다.
{: .notice--info}
**기본 실행 방법** <br> 1. 예제에 사용 될 데이터들은 도커 이미지 생성 후 `spark-3.3.0` 안의 하위 폴더 `data`를 생성 후, 이 폴더에 추가합니다. <br> 1.1 데이터와 도커 설치 및 활용하는 방법은 위에 링크를 남겼습니다. <br> 2. 터미널에서 `pyspark`을 입력해 프로그램을 시작합니다. <br> 글에서 사용되는 파일 경로는 다를 수 있습니다.
{: .notice--danger}

<br>
<br>
<br>

## 1. 추천이란?

- **추천 시스템(recommender system)**은 사용자의 평점을 통한 선호도를 학습함으로써 특정 사용자와 다른 사용자 사이의 유사성이나 사용자가 선호하는 특정 제품과 다른 제품 간의 유사성을 도출하여 사용자가 좋아할 만한 것을 추천하는 것을 말한다. 
- 추천 엔진은 이러한 유사성(similarity)을 기반으로 사용자에게 새로운 추천을 할 수 있다.
- 스파크에서는 추천을 위한 **교차최소제곱(Alternating Least Square, ALS)** 알고리즘을 제공한다.
  - 이 알고리즘은 **협업 필터링(collaborative filtering)** 기술을 활용하여 사용자가 구매하거나 관심 있어 했던 아이템을 기반으로 추천한다.
- 교차최소제곱 외에도 장바구니 분석을 위해 연관 규칙을 찾아내는 **빈발 패턴 마이닝(Frequent Pattern Mining)**을 제공한다.

<br>
<br>

## 2. 협업 필터링 구현하기

- **교차최소제곱**은 각 아이템의 특징 벡터와 각 사용자의 특징 벡터의 내적이 해당 아이템에 대한 사용자의 평점과 근사하도록 각 사용자 및 아이템에 대해 k차원의 특징 벡터를 찾는다. 

    <img width="532" alt="image" src="https://user-images.githubusercontent.com/78655692/205039999-83e7a79f-6871-4f7f-a6a7-e5fb7c285a5b.png"> <br> 이미지출처[^1]

- 따라서 사용자 아이디, 아이템 아이디, 평점 세 가지 컬럼을 가진, 사용자와 아이템 간에 존재하는 평점으로 구성된 입력 데이터셋만 있으면 된다.
- 이 알고리즘은 아주 일반적이거나 많은 정보를 가지고 있는 서비스에 더 적합하다.

<br>

### 2.1 모델 하이퍼파라미터

- 교차최소제곱의 모델 하이퍼파라미터는 다음과 같다.
  - **rank** : 사용자와 아이템을 학습하기 위한 특징 벡터의 차원을 결정한다. 
    - 일반적으로 반복 실험을 통해 값을 결정한다.
  - **alpha** : 암시적 피드백 데이터를 학습할 때 사용하며, 사용자 선호에 대한 기본 신뢰도를 설정한다. 
    - default : 10
  - **regParam** : 모델 과적합을 방지하기 위해 일반화를 제어한다. 다양한 일반화 파라미터값을 검토하여 최적의 값을 찾아야 한다.
    - default : 0.1
  - **implicitPrefs** : 분석하려는 데이터가 암시적(True)인지 명시적(False)인지 지정하는 불리언값이다.
    - default : False(명시적)

<br>

### 2.2 학습 파라미터 

- 교차최소제곱에 대한 학습 파라미터는 클러스터에 데이터가 분산되는 방식을 보다 저수준까지 제어하기 때문에 다른 일반적인 모델과는 좀 다르다.
- **블록(block)** : 클러스터 상에 분산된 데이터 그룹
- 각 블록에 배치할 데이터양을 결정하는 것은 알고리즘을 학습시키는 데 걸리는 시간에 큰 영향을 준다.
- 교차최소제곱에 대한 학습 파라미터는 다음과 같다.
  - **numUserBlocks** : 사용자를 분할할 블록 수를 결정한다.
    - default : 10
  - **numItemBlocks** : 아이템을 분할할 블록 수를 결정한다.
    - default : 10
  - **maxIter** : 총 학습 반복 횟수
    - default : 10
  - **checkpointInterval** : 체크포인팅을 이용하면 학습 과정 동안 진행되는 모델의 작업 내용을 저장하여 노드 오류를 보다 신속하게 복구할 수 있다.
    - SparkContext.setCheckpointDir를 사용하면 체크포인트 디렉터리를 설정할 수 있다.
  - **seed** : 임의 시드를 지정하면 결과를 재연하는 데 도움이 된다.

<br>

### 2.3 예측 파라미터 

- **예측 파라미터**는 학습을 완료한 모델이 실제 예측을 수행하는 방법을 결정한다.
 
<br>

### 2.4 실습 예제

- 데이터는 MoiveLens 영화 평점 데이터셋을 사용한다.
- 여기에 나오는 함수는 다음과 같다.
  - `pyspark.sql.functions`의 `split(str, pattern, limit=-1)` : str을 주어진 pattern에 맞게 분할한다. [^2]
  - `pyspark.sql`의 `cast(dataType)` : 컬럼을 해당 데이터타입으로 변환한다. 

```python
data_path = '/Users/hyunseokjung/data/spark_guide'

ratings = spark.read.text(f"{data_path}/sample_movielens_ratings.txt") \
    .rdd.toDF() \
    .selectExpr("split(value, '::') as col") \
    .selectExpr(
        "cast(col[0] as int) as userId",
        "cast(col[1] as int) as movieId",
        "cast(col[2] as float) as rating",
        "cast(col[3] as long) as timestamp"
    )
```

- **결과**

    <img width="309" alt="image" src="https://user-images.githubusercontent.com/78655692/205214756-637a873c-1208-4847-8669-f82d18cfb033.png">

<br>

- 그 다음 이 데이터셋을 사용해 모델을 학습한다.
  1. 먼저 학습 데이터와 테스트 데이터를 8:2로 나눈다.
  2. 교차최소제곱의 학습 파라미터를 설정한다.
  3. `fit`과 `transform`을 거쳐 새로운 에측값을 생성한다.

> **fit** : 수행하려는 변환이 입력 컬럼에 대한 데이터 또는 정보로 초기화되어야 할 때 필요하다. <br>
> 이후 변환자를 생성하고 입력 데이터셋에 적용하여 새로운 컬럼을 추가한다.

<img width="580" alt="image" src="https://user-images.githubusercontent.com/78655692/205215870-1502ebd1-10a5-43d4-b55f-4652f42d5e6e.png">

<br>

```python
train, val = ratings.randomSplit([0.8, 0.2])

als = ALS() \
    .setMaxIter(5) \
    .setRegParam(0.01) \
    .setUserCol("userId") \
    .setItemCol("movieId") \
    .setRatingCol("rating")

alsModel = als.fit(train)
predictions = alsModel.transform(test)
```

- **결과**

    <img width="393" alt="image" src="https://user-images.githubusercontent.com/78655692/205215986-dc494f25-3abf-49dd-bc96-b0ea50745b4f.png">

<br>

- 이제 각사용자 또는 영화에 대한 상위 k 추천 결과를 출력할 수 있다.
  - `recommendForAllUsers` 메서드는 DataFrame 형태의 `userId`와 배열 형태의 추천 결과 및 각 영화에 대한 평점을 반환한다.
  - `recommendForAllItems` 메서드는 `movieId`와 영화별 상위 사용자를 DataFrame 형태로 반환한다.
  - `pyspark.sql.functions`의 `explode` 함수는 주어진 배열 또는 맵의 각 요소에 대해 새 행을 반환한다. [^3]
 
```python
alsModel.recommendForAllUsers(3) \
    .selectExpr("userId", "explode(recommendations)") \
    .show(6)
alsModel.recommendForAllItems(3) \
    .selectExpr("movieId", "explode(recommendations)") \
    .show(6)
```

- **결과**

    <img width="311" alt="image" src="https://user-images.githubusercontent.com/78655692/205217025-f9736a74-6ef3-4890-a2e3-ae8a13b21d28.png">

<br>

- 다음은 성과 평가지표이다.
- 회귀 평가지표를 보면 각 예측값이 해당 사용자 및 아이템의 실제 평가 결과와 얼마나 가까운지 간단히 볼 수 있다.

```python
from pyspark.mllib.evaluation import RegressionMetrics

regComparison = predictions.select("rating", "prediction") \
    .rdd.map(lambda x: (x(0), x(1)))
metrics = RegressionMetrics(regComparison)
```




<br>
<br>
<br>
<br>

## References

[^1]: [근본 추천 알고리즘 ALS의 핵심을 짧고 굵게 정리하기 - grainpowder](https://www.grainpowder.net/posts/ml/rec/hu2008/)
[^2]: [pyspark.sql.functions.split - Apache Spark](https://spark.apache.org/docs/3.1.2/api/python/reference/api/pyspark.sql.functions.split.html)
[^3]: [[Spark] SQL - explode()를 사용하여 list 형태의 Row 분리하기 - 진짜연어](https://realsalmon.tistory.com/12)

