---
layout: single
title: "스파크 Dataset & 정형 스트리밍 개요 가이드"
excerpt: "Spark The Definitive Guide 책을 중심으로 스파크를 요약 및 정리해보았습니다. spark 예제를 통해 dataset, 정형 스트리밍, 머신러닝, RDD를 자세히 알아봅니다."
categories: spark
tags: [아파치, apahce, 스파크, spark, pyspark, python, sql, 예제, 실습, 정리, 란, 스칼라, dataset, parquet, 스트리밍, maxFilesPerTrigger, mllib, StringIndexer, OneHotEncoder, VectorAssembler, 머신러닝, rdd, 의미, 사용법]
toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2022-11-29
---

<img align='right' width='150' height='200' src='https://user-images.githubusercontent.com/78655692/186088421-fe905f9e-d40f-43b2-ac6e-094e9c342473.png'>
[Spark The Definitive Guide - BIG DATA PROCESSING MADE SIMPLE] 책을 중심으로 스파크를 개인 공부를 위해 요약 및 정리해보았습니다. <br> 다소 복잡한 설치 과정은 도커에 미리 이미지를 업로해 놓았습니다. 즉, 도커 이미지를 pull하면 바로 스파크를 사용할 수 있습니다. <br><br> 도커 설치 및 활용하는 방법 : [[Spark] 빅데이터와 아파치 스파크란 - 1.2 스파크 실행하기](https://ingu627.github.io/spark/spark_db1/#12-%EC%8A%A4%ED%8C%8C%ED%81%AC-%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0) <br> 도커 이미지 링크 : [https://hub.docker.com/r/ingu627/hadoop](https://hub.docker.com/r/ingu627/hadoop) <br> 예제를 위한 데이터 링크 : [FVBros/Spark-The-Definitive-Guide](https://github.com/ingu627/BigData/tree/master/spark/data) <br> 예제에 대한 실행 언어는 파이썬으로 했습니다. <br> 스칼라는 추후에 다루겠습니다.
{: .notice--info}
**기본 실행 방법** <br> 1. 예제에 사용 될 데이터들은 도커 이미지 생성 후 `spark-3.3.0` 안의 하위 폴더 `data`를 생성 후, 이 폴더에 추가합니다. <br> 1.1 데이터와 도커 설치 및 활용하는 방법은 위에 링크를 남겼습니다. <br> 2. 프로그램 시작은 `cd spark-3.3.0` 후, `./bin/pyspark` 명령어를 실행하시면 됩니다.
{: .notice--danger} 

<br>
<br>

## 1. 스파크 기능 둘러보기

- 스파크는 기본 요소인 저수준 API와 정형 API 그리고 추가 기능을 제공하는 일련의 표준 라이브러리로 구성되어 있다.
- 스파크의 라이브러리는 그래프 분석, 머신러닝 그리고 스티리밍 등 다양한 작업을 지원하며, 컴퓨팅 및 스토리지 시스템과의 통합을 돕는 역할을 한다.

![image](https://user-images.githubusercontent.com/78655692/186553580-c40c2bbe-4ee1-4a86-8c30-f4bbc78aef35.png)

<br>
<br>

## 2. 운영용 애플리케이션 실행하기

- `spark-submit` 명령을 사용해 대화형 셸에서 개발한 프로그램을 운영용 애플리케이션으로 쉽게 전환할 수 있다.
  - `spark-submit` 명령은 애플리케이션 코드를 클러스터에 전송해 실행시키는 역할을 한다.
  - 클러스터에 제출된 애플리케이션은 작업이 종료되거나 에러가 발생할 때까지 실행된다.
  - 스파크 애플리케이션은 standalone, mesos, YARN 클러스터 매니저를 이용해 실행된다.

<br>

- `spark-submit` 명령에 애플리케이션 실행에 필요한 자원과 실행 방식 그리고 다양한 옵션을 지정할 수 있다.
- 아래 예시는 spark-submit 명령에 예제 클래스를 지정하고 로컬 머신에서 파이값을 특정 자릿수(10)까지 계산하도록 실행하는 설정이다.

```shell
$ cd ./spark-3.3.0
$ ./bin/spark-submit \
--master local \
./examples/src/main/python/pi.py 10
```

<br>
<br>

## 3. Dataset: 타입 안정성을 제공하는 정형 API

- Dataset은 자바와 스칼라의 정적 타입 코드를 지원하기 위해 고안된 스파크의 정형 API이다.
  - **정적 타입 코드(statically typed code)** : 자료형이 고정된 언어를 의미한다. (자바, 스칼라, C 등)
- Dataset은 타입 안정성을 지원하며 동적 타입 언어인 파이썬과 R에서는 사용할 수 없다.
- Dataset API는 DataFrame의 레코드를 사용자가 자바나 스칼라로 정의한 클래스에 할당하고 자바의 ArrayList 또는 스칼라의 Seq 객체 등의 고정 타입형 컬렉션으로 다룰 수 있는 기능을 제공한다.
- Dataset API는 타입 안정성을 지원하므로 초기화에 사용한 클래스 대신 다른 클래스를 사용해 접근할 수 없다.
  - 따라서 Dataset API는 다수의 소프트웨어 엔지니어가 잘 정의된 인터페이스로 상호작용하는 대규모 애플리케이션을 개발하는 데 특히 유용하다. 

<br>

- Dataset 클래스는 내부 객체의 데이터 타입을 매개변수로 사용한다.
  - 자바에서는 `Dataset<T>`, 스칼라에서는 `Dataset[T]`로 표기한다.
- 다음은 타입 안정성 함수와 DataFrame을 사용해 비즈니스 로직을 신속하게 작성하는 방법을 보여주는 예제이다.
  - **파케이(parquet)** : 하둡에서 칼럼방식으로 저장하는 저장 포맷을 말하며, 데이터를 효율적으로 저장하여 처리 성능을 비약적으로 향상시킬 수 있다. [^1]

```scala
case class Flight(DEST_COUNTRY_NAME: String,
                  ORIGIN_COUNTRY_NAME: String,
                  count: BigInt)
val flightsDF = spark.read
    .parquet("./data/flight-data/parquet/2010-summary.parquet/")
val flights = flightsDF.as[Flight]
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/186558934-17b15865-0a4e-4b63-be13-e5461e35e7d1.png)

    ![image](https://user-images.githubusercontent.com/78655692/186559177-f2047abd-8fdc-488a-b456-6e7ff7eadf82.png)

<br>

- Dataset은 collect 메서드나 take 메서드를 호출하면 DataFrame을 구성하는 Row 타입의 객체가 아닌 Dataset에 매개변수로 지정한 타입의 객체를 반환할 수 있다.
  - 따라서 코드 변경 없이 타입 안정성을 보장할 수 있으며 로컬이나 분산 클러스터 환경에서 데이터를 안전하게 다룰 수 있다.

```scala
flights
    .filter(flight_row => flight_row.ORIGIN_COUNTRY_NAME != "Canada")
    .map(flight_row => flight_row)
    .take(5)

flights
    .take(5)
    .filter(flight_row => flight_row.ORIGIN_COUNTRY_NAME != "Canada")
    .map(fr => Flight(fr.DEST_COUNTRY_NAME, fr.ORIGIN_COUNTRY_NAME, fr.count + 5))
```

- **실행 결과**

    ![image](https://user-images.githubusercontent.com/78655692/186559883-129d14dd-c52c-486e-81e8-47f540f0477d.png)

<br>
<br>

## 4. 정형 스트리밍

- 정형 스트리밍은 스트림 처리용 고수준 API로 이것을 사용하면 정형 API로 개발된 배치 모드의 연산을 스트리밍 방식으로 실행할 수 있으며, 지연 시간을 줄이고 증분(incremental) 처리할 수 있다.
- 정형 스트리밍은 배치 처리용 코드를 일부 수정하여 스트리밍 처리를 수행하고 값을 빠르게 얻을 수 있는 장점이 있다.
- 또한 프로토타입을 배치 잡(job)으로 개발한 다음 스트리밍 잡으로 변환할 수 있으므로 개념 잡기가 수월하다.

<br>

- 다음 예제는 소매 데이터(`retail-data`)를 사용한다.
  - 예제 데이터셋 중 하루치 데이터를 나타내는 by-day 디렉터리의 파일을 사용한다.
  - 지금 사용하는 데이터는 소매 데이터이므로 소매점에서 생성된 데이터가 정형 스트리밍 잡이 읽을 수 있는 저장소로 전송되고 있다고 가정한다.

```shell
$ cd spark-3.3.0
$ ./bin/pyspark
```

```python
staticDataFrame = spark.read.format("csv") \
    .option("header", "true") \
    .option("inferSchema", "true") \
    .load("./data/retail-data/by-day/*.csv")

staticDataFrame.createOrReplaceTempView("retail_data")
staticSchema = staticDataFrame.schema
```

<br>

- 지금은 시계열(time-series) 데이터를 다루기 때문에 데이터를 그룹화하고 집계하는 방법을 알아볼 필요가 있다.
  - 이를 위해 특정 고객(`CustomerId`)이 대량으로 구매하는 영업 시간을 살펴본다.
- **윈도우 함수(window function)**는 집계 시에 시계열 컬럼을 기준으로 각 날짜에 대한 전체 데이터를 가지는 윈도우를 구성한다.
  - **윈도우**는 간격을 통해 처리 요건을 명시할 수 있기 때문에 날짜와 타임스탬프 처리에 유용하다.

```python
from pyspark.sql.functions import window, col

staticDataFrame \
    .selectExpr(
        "CustomerId",
        "(UnitPrice * Quantity) as total_cost",
        "InvoiceDate") \
    .groupBy(
        col("CustomerId"), window(col("InvoiceDate"), "1 day")) \
    .sum("total_cost") \
    .show(5)
```

- **실행 결과**

    ![image](https://user-images.githubusercontent.com/78655692/186581912-34477afd-a750-40e2-9982-671667b4074a.png)

<br>

- 로컬 모드로 이 코드를 실행하려면 로컬 모드에 적합한 셔플 파티션 수를 설정한다. 
  - **셔플 파티션** 수는 셔플 이후에 생성될 파티션 수를 의미한다.

```python
spark.conf.set("spark.sql.shuffle.partitions", "5")
```

<br>

- 이제 스트리밍 코드를 살펴본다. 가장 주된 차이점으로 `read` 메서드 대신 `readStream` 메서드를 사용한다는 점과 `maxFilesPerTrigger` 옵션을 추가로 지정한다.
  - **maxFilesPerTrigger** 옵션을 사용해 한 번에 읽을 파일 수를 설정할 수 있다. 

```python
streamingDataFrame = spark.readStream \
    .schema(staticSchema) \
    .option("maxFilesPerTrigger", 1) \
    .format("csv") \
    .option("header", "true") \
    .load("./data/retail-data/by-day/*.csv")

# DataFrame이 스트리밍 유형인지 확인
streamingDataFrame.isStreaming
# True
```

<br>

- 기존 DataFrame 처리와 동일한 비즈니스 로직을 적용한다.
  - 이 작업 역시 지연 연산이므로 data flow를 실행하기 위해 스트리밍 액션을 호출해야 한다.

```python
purchaseByCustomerPerHour = streamingDataFrame \
    .selectExpr(
        "CustomerId",
        "(UnitPrice * Quantity) as total_cost",
        "InvoiceDate") \
    .groupBy(
        col("CustomerId"), window(col("InvoiceDate"), "1 day")) \
    .sum("total_cost")
```

<br>

- 여기서 사용할 스트리밍 액션(action)은 트리거(trigger)가 실행된 다음 데이터를 갱신하게 될 인메모리 테이블에 데이터를 저장한다.
  - **트리거(trigger)** : 테이블에 대한 이벤트에 반응해 자동으로 실행되는 작업을 의미한다. [^2]
  - `.format("memory")` : 인메모리 테이블에 저장
  - `.queryName("테이블명")` : 인메모리에 저장될 테이블명
  - `.outputMode("complete")` : 모든 카운트 수행 결과를 테이블에 저장

```python
purchaseByCustomerPerHour.writeStream \
    .format("memory") \
    .queryName("customer_purchases") \
    .outputMode("complete") \
    .start()
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/186584476-e9947e14-f582-4cce-b595-29f37a884d4e.png)

<br>

- 스트림이 시작되면 쿼리 실행 결과가 어떠한 형태로 인메모리 테이블에 기록되는지 확인할 수 있다.

```python
spark.sql("""
    SELECT *
    FROM customer_purchases
    ORDER BY 'sum(total_cost)' DESC
""") \
.show(5)
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/186584960-0f003de5-ce88-4e91-80dd-d9c2fd81e202.png)

<br>
<br>

## 5. 머신러닝과 고급 분석

- 스파크는 내장된 머신러닝 알고리즘 라이브러리인 MLlib을 사용해 대규모 머신러닝을 수행할 수 있다.
- **MLlib**을 사용하면 대용량 데이터를 대상으로 전처리(preprocessing), 멍잉(munging), 모델 학습(model training), 예측(prediction)을 할 수 있다.
  - **멍잉(munging)** : 원본 데이터를 다른 형태로 변환하거나 매핑하는 과정을 의미한다.
- 또한 정형 스트리밍에서 예측하고자 할 때도 MLlib에서 학습시킨 다양한 예측 모델을 사용할 수 있다.

<br>

- 다음 예제는 원본 데이터를 올바른 포맷으로 만드는 트랜스포메이션을 정의하고, 실제로 모델을 학습한 다음 예측을 수행한다.

```python
staticDataFrame.printSchema()
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/186586246-3e969dde-3a58-4eee-afe3-d8eff14cf7af.png)

<br>

- MLlib의 머신러닝 알고리즘을 사용하기 위해서는 수치형 데이터가 필요하다.
- 예제의 데이터는 타임스탬프, 정수 그리고 문자열 등 다양한 데이터 타입으로 이루어져 있으므로 수치형으로 변환해야 한다.
  - `.na.fill(0)` : 모든 정수 컬럼에 대해 null 값을 0으로 대체한다. [^3]
  - `.withColumn` : 칼럼끼리의 연산을 통해 새 칼럼을 만든다.
  - `.coalesce(numPartitions)` : numPartitions 파티션이 있는 새 DataFrame을 반환한다. [^4]

```python
from pyspark.sql.functions import date_format, col

preppedDataFrame = staticDataFrame \
    .na.fill(0) \
    .withColumn("day_of_week", date_format(col("InvoiceDate"), "EEEE")) \
    .coalesce(5)
```

<br>

- 데이터를 학습 데이터셋과 테스트 데이터셋으로 분리해야 한다.
  - 예제에서는 특정 구매가 이루어진 날짜를 기준으로 직접 분리한다.

```python
trainDataFrame = preppedDataFrame \
    .where("InvoiceDate < '2011-07-01'")
testDataFrame = preppedDataFrame \
    .where("InvoiceDate >= '2011-07-01'")

# 데이터가 준비되면 액션을 호출해 데이터를 분리한다.

trainDataFrame.count()
# 245903
testDataFrame.count()
# 296006
```

<br>

- 스파크 MLlib은 일반적인 트랜스포메이션을 자동화하는 다양한 트랜스포메이션을 제공하는데, 그중 하나가 `StringIndexer`이다. 

```python
from pyspark.ml.feature import StringIndexer

indexer = StringIndexer() \
    .setInputCol("day_of_week") \
    .setOutputCol("day_of_week_index")
```

<br>

- 하지만, `StringIndexer`를 사용하면 번호 지정 체계이기 때문에 이 문제를 보완하기 위해서는 `OneHotEncoder`를 사용해 각 값을 자체 컬럼으로 인코딩해야 한다.
  - 이렇게 하면 특정 요일이 해당 요일인지 아닌지 boolean 타입으로 나타낼 수 있다.

> 만약 numpy 모듈이 설치되어 있지 않다고 나오면, shell에서 `sudo apt-get install python3-pip` 후 `pip install numpy`를 해줍니다.

```python
from pyspark.ml.feature import OneHotEncoder

encoder = OneHotEncoder() \
    .setInputCol("day_of_week_index") \
    .setOutputCol("day_of_week_encoded")
```

<br>

- 스파크의 모든 머신러닝 알고리즘은 수치형 벡터 타입을 입력으로 사용한다.

```python
from pyspark.ml.feature import VectorAssembler

vectorAssembler = VectorAssembler() \
    .setInputCols(["UnitPrice", "Quantity", "day_of_week_encoded"]) \
    .setOutputCol("features")
```

<br>

- 다음은 나중에 입력값으로 들어올 데이터가 같은 프로세스를 거쳐 변환되도록 파이프라인을 설정하는 예제이다.

```python
from pyspark.ml import Pipeline

transformationPipeline = Pipeline() \
    .setStages([indexer, encoder, vectorAssembler])
```

<br>

- 그리고 나서 변환자(transformer)를 데이터셋에 적합(fit)시켜야 한다.

```python
fittedPipeline = transformationPipeline.fit(trainDataFrame)
```

<br>

- 학습 데이터셋에 변환자를 적합시키고 나면 학습을 위한 맞춤 파이프라인(fitted pipeline)이 준비된다.
- 이것을 사용해서 일관되고 반복적인 방식으로 모든 데이터를 변환할 수 있다.

```python
transformedTraining = fittedPipeline.transform(trainDataFrame)
```

<br>

- 이제 모델 학습에 사용할 파이프라인이 마련되었다.
- 캐싱(cache)을 사용하면 중간 변환된 데이터셋의 복사본을 메모리에 저장하므로 전체 파이프라인을 재실행하는 것보다 훨씬 빠르게 반복적으로 데이터셋에 접근할 수 있다.

```python
transformedTraining.cache()
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/186591865-760ee42d-e3e9-47b4-baea-f2798ba6141e.png)

<br>

- 학습 데이터셋이 완성되었으므로 이제 모델을 학습한다.
  - 머신러닝 모델을 사용하려면 관련 클래스를 import하고 인스턴스를 생성해야 한다.
  - 이번 예제에서는 K-평균 알고리즘을 사용해본다.

```python
from pyspark.ml.clustering import KMeans

kmeans = KMeans() \
    .setK(20) \
    .setSeed(0)
```

<br>

- 스파크에서 머신러닝 모델을 학습시키는 과정은 크게 2단계로 진행된다.
- 1단계는 아직 학습되지 않은 모델을 초기화하고, 2단계는 해당 모델을 학습시킨다.
  - 학습 전 알고리즘 명칭: `Algorithm`
  - 학습 후 알고리즘 명칭: `AlgorithmModel`

```python
kmModel = kmeans.fit(transformedTraining)
```

<br>

- 모델 학습이 완료되면 몇 가지 성과 평가지표에 따라 학습 데이터셋에 대한 비용을 계산할 수 있다.

> 스파크 3.x 로 오면서 computeCost는 없어지고, 대신 ClusteringEvaluator로 대체되었다. <br> 
> 아래 코드 참조 [^5]

```python
from pyspark.ml.evaluation import ClusteringEvaluator

predictionsTrain = kmModel.transform(transformedTraining)

evaluator = ClusteringEvaluator()

transformedTrain =  evaluator.evaluate(predictionsTrain)

print("transformedTrain accuracy = " + str(transformedTrain))
# transformedTrain accuracy = 0.5974002258978571
```

<br>
<br>

## 6. 저수준 API

- 스파크는 RDD를 통해 자바와 파이썬 객체를 다루는 데 필요한 다양한 기본 기능(저수준 API)를 제공한다.
  - 스파크의 거의 모든 기능은 RDD를 기반으로 만들어졌다.
- DataFrame 연산도 RDD를 기반으로 만들어졌으며 편리하고 매우 효율적인 분산 처리를 위해 저수준 명령으로 컴파일된다.
- 또한, 디르아ㅣ버 시스템의 메모리에 저장된 원시 데이터를 병렬처리하는데 RDD를 사용할 수 있다.

```python
from pyspark.sql import Row

spark.sparkContext.parallelize([Row(1), Row(2), Row(3)]).toDF()
```


<br>
<br>
<br>
<br>

## References

[^1]: [[pyspark/빅데이터기초] Parquet(파케이) 파일 형식이란? - butter_shower](https://butter-shower.tistory.com/245)
[^2]: [[DB] Trigger 트리거 개요 및 장단점 - 런코딩](https://runcoding.tistory.com/32)
[^3]: [PySpark fillna() & fill() – Replace NULL/None Values - NNK](https://sparkbyexamples.com/pyspark/pyspark-fillna-fill-replace-null-values/)
[^4]: [pyspark.sql.DataFrame.coalesce - spark](https://spark.apache.org/docs/3.1.1/api/python/reference/api/pyspark.sql.DataFrame.coalesce.html)
[^5]: [스파크 완벽 가이드 3장 - killog](https://kils-log-of-develop.tistory.com/739)