---
layout: single
title: "스파크 정형 API 기본 연산 실습 정리"
excerpt: "Spark The Definitive Guide 책을 중심으로 스파크를 요약 및 정리해보았습니다. spark 예제를 통해 정형 API인 DataFrame, SQL, Dataset의 기본 연산을 자세히 알아봅니다."
categories: spark
tags: [스파크, spark, 아파치, apache, 스칼라, scala, 정리, 예제, 실습, dataframe, 스키마, 표현식, StructType, StructField, col, expr, Row, 의미]
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

- 스파크 실행은 다음과 같습니다.

```shell
$ cd spark-3.3.0/
$ ./bin/spark-shell
```

<br>

## 1. 정형 API 기본 연산

- 이번 글에서는 DataFrame과 DataFrame의 데이터를 다루는 기능을 다뤄본다.
- DataFrame은 ROw 타입의 레코드(record)와 각 레코드에 수행할 연산 표현식을 나타내는 여러 컬럼(column)으로 구성된다.
- **스키마(schema)**는 각 컬럼명과 데이터 타입을 정의한다.
- DataFrame의 **파티셔닝(partitioning)**은 DataFrame이나 Dataset이 클러스터에서 물리적으로 배치되는 형태를 정의한다.
- **파티셔닝 스키마(partitioning schema)**는 파티션을 배치하는 방법을 정의한다.
- 파티셔닝의 분할 기준은 특정 컬럼이나 비결정론적 값을 기반으로 설정할 수 있다.
  - **비결정론적(nondeterministically)** : 매번 변하는 정도

```scala
val df = spark.read.format("json"
    ).load("./data/flight-data/json/2015-summary.json")
```

<br>

## 2. 스키마

- 스키마는 DataFrame의 컬럼명과 데이터 타입을 정의한다. 데이터소스에서 스키마를 얻거나 직접 정의할 수 있다.
- 스키마는 여러 개의 `StructField` 타입 필드로 구성된 `StructType` 객체이다.
  - **StructField**는 이름, 데이터 타입, 컬럼의 값이 없거나 null일 수 있는지 지정하는 boolean 값이다. [^1]

    ```scala
    public StructField(String name,
              DataType dataType,
              boolean nullable,
              Metadata metadata)
    ```

    - 필요한 경우 컬럼과 관련된 메타데이터를 지정할 수도 있다.
    - **메타데이터** : 해당 컬럼과 관련된 정보 

```scala
spark.read.format("json").load("./data/flight-data/json/2015-summary.json").schema
```

- **실행결과**

  ![image](https://user-images.githubusercontent.com/78655692/187008529-29dad30b-5c01-4274-b2e2-9fa63a57d971.png)

<br>

- 스키마는 복합 데이터 타입인 `StructType`을 가질 수 있다.
  - 스파크는 런타임에 데이터 타입이 스키마의 데이터 타입과 일치하지 않으면 오류를 발생시킨다.

```scala
import org.apache.spark.sql.types.{StructField, StructType, StringType, LongType}
import org.apache.spark.sql.types.Metadata

val myManualSchema = StructType(Array(
  StructField("DEST_COUNTRY_NAME", StringType, true),
  StructField("ORIGIN_COUNTRY_NAME", StringType, true),
  StructField("count", LongType, false, 
    Metadata.fromJson("{\"hello\":\"world\"}"))
))

val df = spark.read.format("json").schema(myManualSchema
  ).load("./data/flight-data/json/2015-summary.json")
```

- **실행결과**

  ![image](https://user-images.githubusercontent.com/78655692/187010695-0aceb362-6080-4599-8c1e-497aee3e1a6e.png)

<br>
<br>

## 3. 컬럼과 표현식

- 사용자는 표현식으로 DataFrame의 컬럼을 선택, 조작, 제거할 수 있다.
  - **표현식(expression)** : 값을 반환하는 식 또는 코드 [^2]
- 컬럼 내용을 수정하려면 반드시 DataFrame의 스파크 트랜스포메이션을 사용해야 한다.

<br>

### 3.1 컬럼

- 컬럼을 생성하고 참조할 때 col 함수나 column 함수를 사용하는 것이 가장 간단하다.
  - 이들 함수는 컬럼명을 인수로 받는다.

```scala
import org.apache.spark.sql.functions.{col, column}

col("someColumnName")
column("someColumnName")
```

- **실행결과**

  ![image](https://user-images.githubusercontent.com/78655692/187033701-d1ee88a9-9de1-4ac3-832a-30bd9665e36e.png)

<br>

- `$`을 사용하면 컬럼을 참조하는 특수한 문자열 표기를 만들 수 있다.
- `'`은 심벌이라고도 불리는데, 이는 특정 식별자를 참조할 때 사용하는 스칼라 고유의 기능이다.
- 위 2개는 모두 컬럼명으로 컬럼을 참조한다.

```scala
$"myColumn"
'myColumn
```

- **실행결과**

  ![image](https://user-images.githubusercontent.com/78655692/187038387-7afb9229-2092-4dfe-a48c-209b96e805ac.png)


<br>

### 명시적 컬럼 참조

- DataFrame의 컬럼은 col 메서드로 참조한다.
  - col 메서드는 조인(join) 시 유용하다.

<br>

### 3.2 표현식

- **표현식(Expression)**은 DataFrame 레코드의 여러 값에 대한 트랜스포메이션 집합을 의미한다.
- 여러 컬럼명을 입력으로 받아 식별하고, '단일 값'을 만들기 위해 다양한 표현식을 각 레코드에 적응하는 함수이다.
- 표현식은 `expr` 함수로 가장 간단히 사용할 수 있다. 이 함수를 사용해 DataFrame의 컬럼을 참조할 수 있다.

<br>

### 표현식으로 컬럼 표현

```scala
expr("someCol - 5")
col("someCol") - 5
expr("someCol") - 5
```

- 위 세 코드는 모두 같은 트랜스포메이션 과정을 거친다.
  - 스파크가 연산 순서를 지정하는 논리적 트리로 컴파일하기 때문이다.
- 컬럼은 단지 표현식일 뿐이다.
- 컬럼과 컬럼의 트랜스포메이션은 파싱된 표현식과 동일한 논리적 실행 계획으로 컴파일된다.

![image](https://user-images.githubusercontent.com/78655692/187035828-71e22065-27e8-4013-a713-cf8e7048fb7a.png)

- 위 DAG 그래프를 코드로 표현하면 다음과 같다. 

```scala
import org.apache.spark.sql.functions.expr

expr("(((someCol + 5) * 200) - 6) < otherCol")
```

<br>

### DataFrame 컬럼에 접근하기

- `printSchema` 메서드로 DataFrame의 전체 컬럼 정보를 확인할 수 있다.
- 프로그래밍 방식으로 컬럼에 접근할 때는 DataFrame의 `columns` 속성을 사용한다.

```scala
spark.read.format("json").load("./data/flight-data/json/2015-summary.json"
  ).columns
```

- **실행결과**

  ![image](https://user-images.githubusercontent.com/78655692/187036022-335e25db-06a9-4a2b-bb77-5b23ac61fabd.png)

<br>
<br>

## 4. 레코드와 로우

- 스파크는 레코드를 Row 객체로 표현한다.
- Row 객체는 내부에 바이트 배열을 가지는데, 이 바이트 배열 인터페이스는 오직 컬럼 표현식으로만 다룰 수 있으므로 사용자에게 절대 노출되지 않는다. 
- 다음은 DataFrame의 `first` 메서드로 로우를 확인하는 예제이다.

```scala
df.first()
```

- **실행결과**

  ![image](https://user-images.githubusercontent.com/78655692/187036140-94d3e172-7df0-496d-9dc5-30c99de7bed3.png)

<br>

### 4.1 로우 생성하기

- Row 객체는 스키마 정보를 가지고 있지 않는다.
  - DataFrame만 유일하게 스키마를 갖는다.
- Row 객체를 직접 생성하려면 DataFrame의 스키마와 같은 순서로 값을 명시해야 한다.

```scala
import org.apache.spark.sql.Row

val myRow = Row("Hello", null, 1, false)

myRow(0) // Any 타입
myRow(0).asInstanceOf[String] // String 타입
myRow.getString(0) // String 타입
myRow.getInt(2)
```

- **실행결과**

  ![image](https://user-images.githubusercontent.com/78655692/187036438-a5c0b627-1843-4a15-b87c-9f31d753d349.png)


<br>
<br>
<br>
<br>

## References

[^1]: [Class StructField - spark.apache.org](https://spark.apache.org/docs/2.1.1/api/java/org/apache/spark/sql/types/StructField.html)
[^2]: [표현식(Expression) - reveloper-1311](https://velog.io/@reveloper-1311/JS-%ED%91%9C%ED%98%84%EC%8B%9DExpression%EC%9D%B4%EB%9E%80)