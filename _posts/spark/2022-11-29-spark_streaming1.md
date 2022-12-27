---
layout: single
title: "[Spark] 스트림 처리 및 정형 스트리밍의 기초 개념 정리"
excerpt: "Spark The Definitive Guide 책을 중심으로 스파크를 요약 및 정리해보았습니다. spark 예제를 통해 스트림 처리 및 정형 스트리밍의 기초 개념 정리에 대해 알아봅니다."
categories: spark
tag : [아파치, 스파크, spark, 정리, 의미, 란, 이란, 사용법, pyspark, 스트리밍, 정형, 스트림, awaitTermination, 예제, 기초]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-11-29
---

<img align='right' width='150' height='200' src='https://user-images.githubusercontent.com/78655692/186088421-fe905f9e-d40f-43b2-ac6e-094e9c342473.png'>
[Spark The Definitive Guide - BIG DATA PROCESSING MADE SIMPLE] 책을 중심으로 스파크를 개인 공부를 위해 요약 및 정리해보았습니다. <br> 다소 복잡한 설치 과정은 도커에 미리 이미지를 업로해 놓았습니다. 즉, 도커 이미지를 pull하면 바로 스파크를 사용할 수 있습니다. <br><br> 도커 설치 및 활용하는 방법 : [[Spark] 빅데이터와 아파치 스파크란 - 1.2 스파크 실행하기](https://ingu627.github.io/spark/spark_db1/#12-%EC%8A%A4%ED%8C%8C%ED%81%AC-%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0) <br> 도커 이미지 링크 : [https://hub.docker.com/r/ingu627/hadoop](https://hub.docker.com/r/ingu627/hadoop) <br> 예제를 위한 데이터 링크 : [FVBros/Spark-The-Definitive-Guide](https://github.com/ingu627/BigData/tree/master/spark/data) <br> 예제에 대한 실행 언어는 파이썬 기반인 pyspark를 이용했습니다.
{: .notice--info}
**기본 실행 방법** <br> 1. 예제에 사용 될 데이터들은 도커 이미지 생성 후 `spark-3.3.0` 안의 하위 폴더 `data`를 생성 후, 이 폴더에 추가합니다. <br> 1.1 데이터와 도커 설치 및 활용하는 방법은 위에 링크를 남겼습니다. <br> 2. 터미널에서 `pyspark`을 입력해 프로그램을 시작합니다. <br> 글에서 사용되는 파일 경로는 다를 수 있습니다.
{: .notice--danger}

<br>
<br>
<br>

## 1. 스트림 처리

- **스트림 처리(stream processing)**는 신규 데이터를 끊임없이 처리해 결과를 만들어내는 행위이다. 
- 스트림 처리 시스템에 도착한 일련의 이벤트를 입력 데이터로 받아 다양한 쿼리 연산을 수행한다. 그 후 다양한 버전의 결과를 출력하거나 최신 데이터를 저장할 수 있다.
- 스트림 처리는 다음과 같은 장점을 가지고 있다.
  1. 지연 시간(latency)가 짧다.
  2. 자동으로 연산 결과의 증분(incremental)을 생성하기 때문에 결과를 수정하는 데 효율적이다.

<br>

- **선언형(declarative) API**를 사용하면 애플리케이션을 정의할 때 '어떻게' 신규 데이터를 처리하고 장애 상황에서 복구할지 지정하는 대신 '무엇'을 처리할지 지정한다.
  - 선언형 API의 예시로 스파크의 DStream API는 맵(Map), 리듀스(Reduce), 필터(Filter)같은 연산을 기반으로 하는 함수형 API을 제공한다.
  - DStream API는 내부적으로 각 연산자의 데이터 처리량과 연산 관련 상태 정보를 자동으로 추적하고 관련 상태를 저장한다.

<br>
<br>

## 2. 연속형 처리와 마이크로 배치 처리

- **연속형 처리(Continuous processing)** 기반의 시스템에서 각 노드는 다른 노드에서 전송하는 메시지를 끊임없이 수신하고 새로 갱신된 정보를 자신의 하위 노드로 전송한다.
  - 연속형 처리는 레코드별로 처리하는 것이 핵심 개념이다.

<img width="588" alt="image" src="https://user-images.githubusercontent.com/78655692/204439216-358e5e53-65b7-457c-8e60-2ad0f05cc942.png">

- 연속형 처리는 각 노드가 신규 메시지에 즉시 반응하기 때문에 전체 입력량이 적을 때 빠르게 응답하지만 최대 처리량(throughput)은 적다.

<br>

- **마이크로 배치(micro-batch)** 기반의 시스템은 입력 데이터를 작은 배치로 모으기 위해 대기한다.
  - 그리고 다수의 분산 태스크를 이용해 각 배치를 병렬로 처리한다.
- 마이크로 배치 시스템은 더 적은 노드로 같은 양의 데이터를 처리할 수 있다.
- 또한 워크로드 변화에 대응할 수 있도록 부하 분산 기술을 동적으로 사용할 수 있다.

<img width="608" alt="image" src="https://user-images.githubusercontent.com/78655692/204440097-f3bd02b7-32d1-4dcb-943e-3e8adf843db6.png">

<br>
<br>

## 3. 정형 스트리밍의 기초

- **정형 스티리밍(Structured Streaming)**은 스파크 SQL 엔진 기반의 스트림 처리 프레임워크이다. 
- 정형 스티리밍은 스파크의 정형 API(DataFrame, Dataset, SQL)를 사용한다.
- 스트리밍 연산은 배치 연산과 동일하게 표현한다.

<br>

- 사용자가 스트림 처리용 코드와 목적지를 정의하면 정형 스트리밍 엔진에서 신규 데이터 대한 증분 및 연속형 쿼리를 실행한다.
- 그리고 카탈리스트 엔진(코드 생성, 쿼리 최적화 등의 기능을 지원)을 사용해 연산에 대한 논리적 명령을 처리한다.

<img width="598" alt="image" src="https://user-images.githubusercontent.com/78655692/204446837-49e3efdd-8c79-41f5-be43-82f494cfaee2.png">

- 정형 스트리밍은 스트림 데이터를 계속해서 추가되는 테이블처럼 다루는 것이 핵심 개념이다.
- 스트리밍 잡(job)은 계속해서 신규 입력 데이터를 확인 및 처리한다.

<br>
<br>

## 4. 핵심 개념

- 스파크는 복잡한 처리를 자동으로 제어하면서 스트림에 모든 스파크 연산을 사용할 수 있는 단순한 방법을 제공하려는 목적을 가지고 있다.

<br>

### 4.1 입력 소스

- 스파크에서 지원하는 입력 소스는 다음과 같다.
  1. 아프카 카프카
  2. HDFS나 S3 등 분산 파일 시스템의 파일(디렉터리의 신규 파일을 계속해서 읽는다.)
  3. 테스트용 소켓 소스

<br>

### 4.2 싱크

- **싱크(sink)**을 이용해 스트림의 결과를 저장할 목적지를 명시한다.
- 싱크와 실행 엔진은 데이터 처리의 진행 상황을 신뢰도 있고 정확하게 추적하는 역할을 한다.

<br>

### 4.3 출력 모드

- 출력 모드는 데이터의 출력 방식을 정의한다.
- 스파크가 지원하는 출력 모드은 다음과 같다.

  1. **append** : 싱크에 신규 레코드만 추가
  2. **update** : 변경 대상 레코드 자체를 갱신
  3. **complete** : 전체 출력 내용 재작성하기

<br>

### 4.4 이벤트 시간 처리 

- 정형 스트리밍은 이벤트 시간 기준의 처리를 지원한다.
  - 처리 방식은 무작위로 도착한 레코드 내부에 기록된 타임스탬프를 기준으로 한다.

<br>

- **이벤트 시간(event-time) 데이터**
  - 스파크는 데이터가 유입된 시간이 아니라 데이터 생성 시간을 기준으로 처리한다.
  - 따라서 데이터가 늦게 업로드되거나 네트워크 지연으로 데이터의 순서가 뒤섞인 채 시스템으로 들어와도 처리할 수 있다.
  - 시스템은 입력 데이터를 테이블로 인식하기 때문에 이벤트 시간은 테이블에 있는 하나의 컬럼뿐이므로, 표준 SQL 연산자를 이용해 그룹화, 집계, 그리고 윈도우 처리를 할 수 있다.

<br>

- **워터마크(Watermarks)**
  - 워커마크는 시간 제한을 설정할 수 있는 스트리밍 시스템의 기능이다.
  - 예로, 늦게 들어온 이벤트를 어디까지 처리할지 시간을 제한할 수 있다.

<br>
<br>

## 5. 정형 스트리밍 예제

- 다음은 정형 스트리밍을 어떻게 사용되는지 예제를 통해 알아본다.
- 예제에서는 인간 행동 인지를 위한 이기종 데이터셋을 사용한다.
- 데이터는 스마트폰과 스마트워치의 다양한 장치에서 지원하는 최대 빈도로 샘플링한 센서 데이터로 구성되어 있다.

<br>

- 스파크를 pyspark 기반의 파이썬으로 실행하기 위해 먼저 sparksession을 이용해 앱을 초기화해준다.

  ```python
  from pyspark.sql import SparkSession

  spark = SparkSession.builder \
      .appName('streaming1') \
      .master("local") \
      .config("spark.some.config.option", "some-value") \
      .getOrCreate()
  ```

<br>

- 정적인 방식으로 데이터를 읽는다.
  - 데이터 경로는 각자 환경에 맞게 입력한다.
- 그리고 스키마 결과는 다음과 같다.

  ```python
  static = spark.read.json('/Users/hyunseokjung/data/spark_guide/activity-data/')
  dataSchema = static.schema
  dataScehma
  ```

- **결과**

  <img width="512" alt="image" src="https://user-images.githubusercontent.com/78655692/204480016-6251c873-82ee-48ca-af24-14236674ab45.png">

- 예제 데이터는 타임스탬프와 모델, 사용자, 장비 정보, 해당 시점의 사용자 행동 유형(gt)를 가지고 있다.

  <img width="445" alt="image" src="https://user-images.githubusercontent.com/78655692/204481686-a4b26bf5-3568-4cb2-a2e7-fb98b0e11360.png">

<br>

- 이제 데이터셋을 스트리밍 방식으로 처리해본다.
- 이번 예제에서는 스트림 방식으로 데이터를 처리하는 상황을 가정하기 위해 각 입력 파일을 하나씩 읽는다.
- 스파크 애플리케이션에서 스트리밍 DataFrame을 생성한 후 트랜스포메이션을 통해 적합한 포맷의 데이터를 얻는다.
- 여기서는 정적 DataFrame에서 알아낸 dataSchema 객체를 스트리밍 DataFrame에 지정한다.

  ```python
  streaming = spark.readStream.schema(dataSchema) \
      .option("maxFilesPerTrigger", 1) \
      .json('/Users/hyunseokjung/data/spark_guide/activity-data/')
  ```

<br>

- 스트리밍 DataFrame의 생성과 실행은 지연 처리 방식(lazy operation)으로 동작한다.
- 또한 파티션 수를 변경할 수 있다.

  ```python
  activityCounts = streaming.groupBy("gt").count()

  spark.conf.set("spark.sql.shuffle.partitions", 5) # default : 200
  ```

<br>

- 트랜스포메이션 정의 후 스트림 쿼리를 시작하는 액션을 정의한다.
- 쿼리 결과를 내보낼 목적지나 싱크를 지정해야 하는데, 이번 예제에서는 결과를 메모리에 저장하는 **메모리 싱크(memory sink)**를 사용한다.
- 그리고 싱크를 지정하는 과정에서 스파크가 데이터를 출력하는 방식도 함께 정의해야 한다.

  ```python
  activityQuery = activityCounts.writeStream \
      .queryName("activity_counts") \
      .format("memory").outputMode("complete") \
      .start()
  ```

- `awaitTermination()`를 지정하여 쿼리 실행 중에 드라이버 프로세스가 종료되는 상황을 막을 수 있다.

  ```python
  activityQuery.awaitTermination()
  ``` 

<br>

- 다음 코드를 실행하면 실행 중인 스트림 목록을 확인할 수 있다.

```python
spark.streams.active
```

- **결과**

  <img width="445" alt="image" src="https://user-images.githubusercontent.com/78655692/204487988-9405d65f-ecb8-4d76-b6a9-ae82ac62e7f2.png">

<br>

- 이제 스트림을 처리하고 있기 때문에 스트리밍 집계 결과가 저장된 메모리 테이블을 조회해 결과를 확인할 수 있다.
- **awaitTermination()**가 있는 코드말고 다른 주피터 노트북 파일에 다음 코드를 실행하면 결과는 다음과 같다. 

  ```python
  from time import sleep

  for _ in range(5):
      spark.sql('SELECT * FROM activity_counts').show()
      sleep(1)
  ```

- **결과**

  <img width="165" alt="image" src="https://user-images.githubusercontent.com/78655692/204505118-b188581f-2bd4-4f9d-9720-cef8d48157e6.png">

<br>
<br>

## 6. 스트림 트랜스포메이션

- 스트리밍 트랜스포메이션은 정적 DataFrame의 트랜스포메이션을 대부분 포함한다.
- 하지만, 스트리밍 데이터에 맞지 않는 트랜스포메이션 제약들이 있을 수 있다.
  - 예를 들어 사용자가 집계하지 않은 스트림을 정렬할 수 없다.
  - 그리고 상태 기반 처리(stateful processing)를 사용하지 않으면 계층적 집계가 불가능하다.

<br>

### 6.1 선택과 필터링

- 정형 스트르밍은 DataFrame의 모든 함수와 개별 컬럼을 처리하는 선택(Selection)과 필터링(Filtering) 그리고 단순 트랜스포메이션을 지원한다.
- 먼저, 앞서 생성한 `streaming`의 컬럼들은 다음과 같다.
  - `streaming.columns` : ['Arrival_Time', 'Creation_Time', 'Device', 'Index', 'Model', 'User', 'gt', 'x', 'y', 'z']
- 선택과 필터링을 사용하는 예제는 다음 코드와 같다.
  - DataFrame의 트랜스포메이션에 대해 더 자세히 알고 싶다면 : [[Spark] 집계 연산, 함수, SQL 명령어 정리](https://ingu627.github.io/spark/spark_db9/)
  
  ```python
  from pyspark.sql.functions import expr

  simpleTransform = streaming.withColumn("stairs", expr("gt like '%stairs%'")) \
      .where("stairs") \
      .where("gt is not null") \
      .select("gt", "Model", "Arrival_Time", "Creation_Time") \
      .writeStream \
      .queryName("simple_transform") \
      .format("memory") \
      .outputMode("append") \
      .start()
  ```

<br>

- 정규 표현식 기본 구문 정리 그림 [^1]

  <img width="777" alt="image" src="https://user-images.githubusercontent.com/78655692/204510084-4e173d48-c506-40c9-bca8-a1576c511121.png">

<br>

### 6.2 집계

- 정형 스트리밍은 집계 기능을 지원한다.

  ```python
  deviceModelStats = streaming.cube("gt", "model").avg() \
      .drop("avg(Arrival_Time)") \
      .drop("avg(Creation_Time)") \
      .drop("avg(Index)") \
      .writeStream.queryName("device_counts").format("memory") \
      .outputMode("complete") \
      .start()
  ```

<br>

### 6.3 조인

- 스트리밍 DataFrame과 정적 DataFrame의 조인(join)을 지원한다.

  ```python
  historicalAgg = static.groupBy("gt", "model").avg()
  deviceModelStats = streaming.drop("Arrival_Time", "Creation_Time", "Index") \
      .cube("gt", "model").avg() \
      .join(historicalAgg, ["gt", "model"]) \
      .writeStream.queryName("device_counts").format("memory") \
      .outputMode("complete") \
      .start()
  ```


<br>
<br>
<br>

## References

[^1]: [SQL, 정규 표현식 패턴 - BELLSTONE](https://itbellstone.tistory.com/88)