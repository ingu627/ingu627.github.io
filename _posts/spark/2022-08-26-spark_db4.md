---
layout: single
title: "스파크 정형 API 전체 구조 한눈에 (DataFrame·SQL·Dataset)"
excerpt: "Spark The Definitive Guide 책을 중심으로 스파크를 요약 및 정리해보았습니다. spark 예제를 통해 정형 API인 DataFrame, SQL, Dataset을 자세히 알아봅니다."
categories: spark
tags: [스파크, spark, 아파치, apache, 스칼라, scala, 정리, 예제, 실습, dataset, dataframe, sql, 스키마, catalyst, column, row, plan, 의미, 사용법]
toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2022-11-29
---

<img align='right' width='150' height='200' src='https://user-images.githubusercontent.com/78655692/186088421-fe905f9e-d40f-43b2-ac6e-094e9c342473.png'>
[Spark The Definitive Guide - BIG DATA PROCESSING MADE SIMPLE] 책을 중심으로 스파크를 개인 공부를 위해 요약 및 정리해보았습니다. <br> 다소 복잡한 설치 과정은 도커에 미리 이미지를 업로해 놓았습니다. 즉, 도커 이미지를 pull하면 바로 스파크를 사용할 수 있습니다. <br><br> 도커 설치 및 활용하는 방법 : [[Spark] 빅데이터와 아파치 스파크란 - 1.2 스파크 실행하기](https://ingu627.github.io/spark/spark_db1/#12-%EC%8A%A4%ED%8C%8C%ED%81%AC-%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0) <br> 도커 이미지 링크 : [https://hub.docker.com/r/ingu627/hadoop](https://hub.docker.com/r/ingu627/hadoop) <br> 예제를 위한 데이터 링크 : [FVBros/Spark-The-Definitive-Guide](https://github.com/ingu627/BigData/tree/master/spark/data) <br> 예제에 대한 실행 언어는 스칼라(scala)로 했습니다. <br> 앞으로 스파크와 관련된 내용은 딥러닝 부분을 제외하고 스칼라로 진행될 예정입니다.
{: .notice--info}
**기본 실행 방법** <br> 1. 예제에 사용 될 데이터들은 도커 이미지 생성 후 `spark-3.3.0` 안의 하위 폴더 `data`를 생성 후, 이 폴더에 추가합니다. <br> 1.1 데이터와 도커 설치 및 활용하는 방법은 위에 링크를 남겼습니다. <br> 2. 프로그램 시작은 `cd spark-3.3.0` 후, `./bin/spark-shell` 명령어를 실행하시면 됩니다.
{: .notice--danger} 

<br>
<br>

## 1. 정형 API 개요

- 정형 API는 비정형 로그 파일로부터 반정형 CSV 파일, 매우 정형적인 파케이(parquet)파일까지 다양한 유형의 데이터를 처리할 수 있다.
- 정형 API에는 다음과 같은 3가지 분산 컬렉션 API가 있다.
  - **Dataset**
  - **DataFrame**
  - **SQL 테이블과 뷰**
- **배치(bacth)**와 **스트리밍(streaming)**처리에서 정형 API를 사용할 수 있다.

<br>

> **다시 한번 정리** <br> 스파크는 트랜스포메이션의 처리 과정을 정의하는 분산 프로그래밍 모델이다. <br> 사용자가 정의한 다수의 트랜스포메이션은 지향성 비순환 그래프(DAG)로 표현되는 명령을 만든다. <br> 액션은 하나의 잡을 클러스터에서 실행하기 위해 스테이지와 태스크로 나누고 DAG로  처리 프로세스를 실행한다.

<br>
<br>

## 2. DataFrame과 Dataset

- 스파크는 DataFrame과 Dataset이라는 2가지 구조화된 컬렉션 개념을 가지고 있다.
- DataFrame과 Dataset은 잘 정의된 로우와 컬럼을 가지는 분산 테이블 형태의 컬렉션이다.
  - 각 컬럼은 다른 컬럼과 동일한 수의 로우를 가져야 한다. (null 포함)
  - 그리고 컬렉션의 모든 로우는 같은 데이터 타입 정보를 가지고 있어야 한다.
- DataFrame과 Dataset은 결과를 생성하기 위해 어떤 데이터에 어떤 연산을 적용해야 하는지 정의하는 지연 연산의 실행 계획이며, 불변성을 가진다.
- DataFrame에 액션을 호출하면 스파크는 트랜스포메이션을 실제로 실행하고 결과를 반환한다.

<br>
<br>

## 3 스키마

- 스키마(schema)는 분산 컬렉션에 저장할 컬럼명과 데이터 타입을 정의한다.
- 스키마는 데이터소스에서 얻거나 직접 정의할 수 있다.
- 스키마는 여러 데이터 타입으로 구성되므로 어떤 데이터 타입이 어느 위치에 있는지 정의하는 방법이 필요하다.

<br>
<br>

## 4 스파크의 정형 데이터 타입 개요

- 스파크는 실행 계획 수립과 처리에 사용하는 자체 데이터 타입 정보를 가지고 있는 **카탈리스트(Catalyst)** 엔진을 사용한다.
- 카탈리스트 엔진은 다양한 실행 최적화 기능을 제공한다.
- 스파크는 자체 데이터 타입을 지원하는 여러 언어 API와 직접 매핑되며, 각 언어에 대한 매핑 테이블을 가지고 있다.
- 다음 코드 예제는 스칼라가 아닌 스파크의 덧셈 연산을 수행한다.
  - 덧셈 연산이 수행되는 이유는 스파크가 지원하는 언어를 이용해 작성된 표현식을 카탈리스트 엔진에서 스파크의 데이터 타입으로 변환해 명령을 처리하기 때문이다.

```scala
val df = spark.range(500).toDF("number")
df.select(df.col("number") + 10)
```

<br>

### 4.1 DataFrame과 Dataset 비교

- DataFrame은 스키마에 명시된 데이터 타입의 일치 여부를 **런타임(runtime)**이 되어서야 확인한다.
- Dataset은 스키마에 명시된 데이터 타입의 일치 여부를 **컴파일 타임(compile time)**에 확인한다.
  - Dataset은 JVM 기반의 언어인 스칼라와 자바에서만 지원한다.
  - 스칼라의 **케이스 클래스(case class)**로 Dataset의 데이터 타입을 정의한다.
- 스파크의 DataFrame은 Row 타입으로 구성된 Dataset이다.
  - **Row** 타입은 스파크가 사용하는 '연산에 최적화된 인메모리 포맷'의 내부적인 표현 방식이다.
    - 스파크의 최적화된 내부 포맷을 사용하면 스파크가 지원하는 어떤 언어 API를 사용하더라도 동일한 효과와 효율성을 얻을 수 있다.
  - Row 타입을 사용하면 가비지 컬렉션(garbage collection)과 객체 초기화 부하가 있는 JVM 데이터 타입을 사용하는 대신 자체 데이터 포맷을 사용하기 때문에 매우 효율적인 연산이 가능하다.

<br>

### 4.2 컬럼

- 컬럼(column)은 정수형(integer)이나 문자열(string)같은 **단순 데이터 타입**, 배열(array)이나 맵(map) 같은 **복합 데이터 타입** 그리고 **null** 값을 표현한다.
- 스파크는 데이터 타입의 모든 정보를 추적하며 다양한 컬럼 변환을 제공한다. 

<br>

### 4.3 로우

- 로우(row)는 데이터 레코드(record)이다. 
- DataFrame의 레코드는 Row 타입으로 구성된다.
  - 로우는 SQL, RDD, 데이터소스에서 얻거나 직접 만들 수 있다.
- `.collect()` : 액션기능으로 스파크 RDD/DataFrame에서 데이터를 검색(retrieve)한다. [^1]
  - 아래 예제에서 Row 객체로 이루어진 배열을 반환한다.

```scala
spark.range(2).toDF().collect()
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/186850504-61e2c830-9d4f-4b55-9422-3a3ae2992233.png)


<br>

### 4.4 스파크 데이터 타입

![image](https://user-images.githubusercontent.com/78655692/186851486-f432838b-278a-4b74-a558-f114a378b5a9.png)

- 스파크는 여러 가지 내부 데이터 타입을 가지고 있다.
- 스파크 데이터 타입을 스칼라에서 사용하려면 다음과 같은 코드를 사용한다.

```scala
import org.apache.spark.sql.types._

val b = ByteType
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/186851952-4cd1894c-58cb-4b07-b620-dbb63fbfdd20.png)

<br>
<br>

## 5. 정형 API의 실행 과정

- 이번에는 스파크 코드가 클러스터에서 실제 처리되는 과정을 살펴본다.
- 정형 API 쿼리가 사용자 코드에서 실제 실행 코드로 변환되는 과정은 다음과 같다.

  1. DataFrame/Dataset/SQL을 이용해 코드를 작성한다.
  2. 스파크가 **논리적 실행 계획(Logical Plan)**으로 변환한다.
  3. 스파크는 **논리적 실행 계획(Logical Plan)**을 **물리적 실행 계획(Physical Plan)**으로 변환하며 그 과정에서 추가적인 최적화를 할 수 있는지 확인한다.
  4. 스파크는 클러스터에서 **물리적 실행 계획(Physical Plan)**(RDD 처리)을 실행한다.

<br>

- 먼저 실행할 코드를 작성한다.
- 작성한 스파크 코드는 콘솔이나 spark-submit 셸 스크립트로 실행한다.
- 카탈리스트 옵티마이저(Catalyst Optimizer)는 코드를 넘겨받고 실제 실행 계획을 생성한다. 
- 마지막으로 스파크는 코드를 실행한 후 결과를 반환한다.

![image](https://user-images.githubusercontent.com/78655692/186853135-76ced25e-ce3f-4036-a134-c56191bffc41.png)

<br>

### 5.1 논리적 실행 계획

- 첫 번째 실행 단계에서는 사용자 코드를 논리적 실행 계획으로 변환한다.

![image](https://user-images.githubusercontent.com/78655692/186854037-341097fe-01d6-4bbb-ab8e-665065b15e8a.png)

- 논리적 실행 계획 단계에서는 추상적(abstract) 트랜스포메이션만 표현한다.
  - 이 단계에서는 드라이버나 익스큐터의 정보를 고려하지 않는다.
- 그리고 사용자의 다양한 표현식을 최적화된 버전으로 변환한다.
- 이 과정으로 사용자 코드는 **검증전 논리적 실행 계획(unresolved logical plan)**으로 변환된다.
  - 검증전 논리적 실행 계획은 코드의 유효성과 테이블이나 컬럼의 존재 여부만을 판단하는 과정이므로 아직 실행 계획을 검증하지 않은 상태이다.
- 스파크 분석기(analyzer)는 컬럼과 테이블을 검증하기 위해 카탈로그(catalog), 모든 테이블의 저장소 그리고 DataFrame 정보를 활용한다.
- 테이블과 컬럼에 대한 검증 결과는 카탈리스트 옵티마이저로 전달된다.
  - **카탈리스트 옵티마이저(Catalyst Optimizer)**는 조건절 푸시 다운(predicate pushing down)이나 선택절 구문을 이용해 논리적 실행 계획을 최적화하는 규칙의 모음이다.

<br>

### 5.2 물리적 실행 계획

- 이어서 물리적 실행 계획을 생성하는 과정이 시작된다.
- **물리적 실행 계획**은 논리적 실행 계획을 클러스터 환경에서 실행하는 방법을 정의한다.

![image](https://user-images.githubusercontent.com/78655692/186859024-04b11e8e-7bc3-411c-b313-9c01266c8e72.png)

- Figure 4.3처럼 다양한 물리적 실행 전략을 생성하고 비용 모델을 이용해서 비교한 후 최적의 전략을 선택한다.
  - 테이블의 크기나 파티션 수 등의 물리적 속성을 고려해 지정된 연산 수행에 필요한 비용을 계산하고 비교하는 것이 그 예이다.
- 물리적 실행 계획은 일련의 RDD와 트랜스포메이션으로 변환된다. 
- 스파크는 DataFrame, Dataset, SQL로 정의된 쿼리를 RDD 트랜스포메이션으로 컴파일한다.

<br>

### 5.3 실행

- 스파크는 물리적 실행 계획을 선정한 다음 저수준 프로그래밍 인터페이스인 RDD를 대상으로 모든 코드를 실행한다.
- 스파크는 런타임에 전체 task나 stage를 제거할 수 있는 자바 바이트 코드를 생성해 추가적인 최적화를 수행한다.
- 마지막으로 스파크는 처리 결과를 사용자에게 반환한다.


<br>
<br>
<br>
<br>

## References

[^1]: [Collect() – Retrieve data from Spark RDD/DataFrame - NNK](https://sparkbyexamples.com/spark/spark-dataframe-collect/)

