---
layout: single
title: "스파크 SQL 실행 방법과 테이블·뷰 구조 이해"
excerpt: "Spark The Definitive Guide 책을 중심으로 스파크를 요약 및 정리해보았습니다. spark 예제를 통해 스파크 SQL(실행방법, 테이블, 뷰)에 대해 알아봅니다."
categories: spark
tags: [스파크, spark, sql, 스칼라, scala, 정리, 의미, 란, 이란, 카탈로그, 테이블, 뷰, 외부 테이블, 메타데이터]
toc: true
toc_sticky: false
sidebar_main: false

last_modified_at: 2022-09-11
---

<img align='right' width='150' height='200' src='https://user-images.githubusercontent.com/78655692/186088421-fe905f9e-d40f-43b2-ac6e-094e9c342473.png'>
[Spark The Definitive Guide - BIG DATA PROCESSING MADE SIMPLE] 책을 중심으로 스파크를 개인 공부를 위해 요약 및 정리해보았습니다. <br> 다소 복잡한 설치 과정은 도커에 미리 이미지를 업로해 놓았습니다. 즉, 도커 이미지를 pull하면 바로 스파크를 사용할 수 있습니다. <br><br> 도커 설치 및 활용하는 방법 : [[Spark] 빅데이터와 아파치 스파크란 - 1.2 스파크 실행하기](https://ingu627.github.io/spark/spark_db1/#12-%EC%8A%A4%ED%8C%8C%ED%81%AC-%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0) <br> 도커 이미지 링크 : [https://hub.docker.com/r/ingu627/hadoop](https://hub.docker.com/r/ingu627/hadoop) <br> 예제를 위한 데이터 링크 : [FVBros/Spark-The-Definitive-Guide](https://github.com/ingu627/BigData/tree/master/spark/data) <br> 예제에 대한 실행 언어는 SQL과 스칼라(scala)로 했습니다.
{: .notice--info}
**기본 실행 방법** <br> 1. 예제에 사용 될 데이터들은 도커 이미지 생성 후 `spark-3.3.0` 안의 하위 폴더 `data`를 생성 후, 이 폴더에 추가합니다. <br> 1.1 데이터와 도커 설치 및 활용하는 방법은 위에 링크를 남겼습니다. <br> 2. 프로그램 시작은 `cd spark-3.3.0` 후, `./bin/spark-sql` 명령어를 실행하시면 됩니다.
{: .notice--danger} 

<br>
<br>

## 1. 스파크 SQL

- 스파크 SQL을 사용해 데이터베이스에 생성된 뷰(view) 나 테이블에 SQL 쿼리를 실행할 수 있다.
- 또한 시스템 함수를 사용하거나 사용자 정의 함수를 정의할 수 있다.
- 그리고 워크로드를 최적화하기 위해 쿼리 실행 계획을 분석할 수 있다.
- 스파크 SQL은 DataFrame과 Dataset API에 통합되어 있기 때문에, 데이터 변환 시 SQL과 DataFrame의 기능을 모두 사용할 수 있으며 두 방식 모두 동일한 실행 코드로 컴파일된다.

> 스파크 SQL은 OLTP(online transaction processing) 데이터베이스가 아닌 OLAP(online analytic processing) 데이터베이스로 동작한다. <br> 즉, 매우 낮은 지연 시간이 필요한 쿼리를 수행하기 위한 용도로 사용할 수 없다.

<br>
<br>

## 2. SQL이란

- **SQL(정형 질의 언어, Structured Query Language)**는 데이터에 대한 관계형 연산을 표현하기 위한 도메인 특화 언어이다.
  - 모든 관계형 데이터베이스에서 사용되며, 많은 NoSQL 데이터베이스에서도 쉽게 사용할 수 있는 변형된 자체 SQL을 제공한다.

<br>
<br>

## 3. 스파크와 하이브의 관계

- 스파크 SQL은 하이브 메타스토어를 사용하므로 하이브와 잘 연동할 수 있다.
  - 하이브 메타스토어는 여러 세션에서 사용할 테이블 정보를 보관하고 있다.
- 스파크 SQL은 하이브 메타스토어에 접속한 뒤 조회할 파일 수를 최소화하기 위해 메타데이터를 참조한다.
  - **하이브(Hive)**는 테이블과 파티션과 관련된 메타정보를 모두 메타스토어에 저장한다. [^1]
  - 하이브는 기존의 RDBMS와 달리 데이터를 삽입한 후 스키마를 입히는데, 그때 스키마 정보를 메타스토어에서 참조하여 가져온다. [^1]

<br>

### 하이브 메타스토어

- 하이브 메타스토어에 접속하려면 몇 가지 속성이 필요하다.
- 먼저 접근하려는 하이브 메타스토어에 적합한 버전을 `spark.sql.hive.metastore.version`에 설정해야 한다.
- 또한 `HiveMetastoreClient`가 초기화되는 방식을 변경하려면 `spark.sql.hive.metastore.jars`를 설정해야 한다.
- 스파크는 기본 버전을 사용하지만 메이븐 저장소나 자바 가상 머신의 표준 포맷에 맞게 클래스패스에 정의할 수도 있다.
- 또한 하이브 메타스토어가 저장된 다른 데이터베이스에 접속하려면 적합한 클래스 접두사를 정의해야 한다.
- 또한 스파크와 하이브에서 공유할 수 있도록 클래스 접두사를 `spark.sql.hive.metastore.sharedPrefixes`속성에 설정한다.

<br>
<br>

## 4. 스파크 SQL 쿼리 실행 방법

- 스파크는 SQL 쿼리를 실행할 수 있는 몇 가지 인터페이스를 제공한다.

### 4.1 스파크 SQL CLI

- 스파크 **SQL CLI(명령행 인터페이스, command line interface)**는 로컬 환경의 명령행에서 기본 스파크 SQL 쿼리를 실행할 수 있는 도구이다.
- 스파크 SQL CLI는 쓰리프트 JDBC 서버와 통신할 수 없다.
- 스파크 SQL CLI를 사용하려면 다음 명령을 실행한다.
  - 스파크가 설치된 경로의 conf 디렉터리에 hive-site.xml, core-site.xml, hdfs-site.xml 파일을 배치해 하이브를 사용할 수 있는 환경을 구성할 수 있다.

```scala
cd spark-3.3.0/

$ ./bin/spark-sql
```

<br>

### 4.2 스파크의 프로그래밍 SQL 인터페이스

- 서버를 설정해 SQL을 사용할 수도 있지만, 스파크에서 지원하는 언어 API로 비정형 SQL을 실행할 수도 있다.
- 이를 위해 SparkSession 객체(=spark)의 **sql** 메서드를 사용한다.
- 처리된 결과는 DataFrame을 반환한다.
  - `spark.sql()`은 다른 트랜스포메이션과 마찬가지로 즉시 실행되지 않고 지연 처리된다.

```scala
spark.sql("SELECT 1 + 1").show()
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/189526989-709166bd-9b32-42a8-9b60-8cd2381dc13e.png)

<br>

- 함수에 여러 줄로 구성된 문자열을 전달할 수 있으므로 여러 줄로 구성된 쿼리를 아주 간단히 표현할 수 있다.

```scala
spark.sql("""
    SELECT user_id, department, first_name FROM professors
    WHERE department IN 
        (SELECT name FROM department WHERE created_data >= '2016-01-01')
""")
```

<br>

- SQL과 DataFrame은 완벽하게 연동될 수 있다.
  - `createOrReplaceTempView()` 명령어를 통해 DataFrame을 SQL에서 처리할 수 있도록 처리해준다.
- DataFrame을 생성하고 SQL을 사용해 처리할 수 있으며 그 결과를 다시 DataFrame으로 돌려받는다.

```scala
spark.read.json("./data/flight-data/json/2015-summary.json"
    ).createOrReplaceTempView("some_sql_view")

spark.sql("""
    SELECT DEST_COUNTRY_NAME, sum(count)
    FROM some_sql_view 
    GROUP BY DEST_COUNTRY_NAME"""
    ).where("DEST_COUNTRY_NAME like 'S%'"
    ).where("'sum(count)' > 10"
    ).count()
```

<br>

### 4.3 스파크 SQL 쓰리프트 JDBC/ODBC 서버

- 스파크는 **자바 데이터베이스 연결(Java Database Connectivity, JDBC)* 인터페이스를 제공한다.
- 사용자나 원격 프로그램은 스파크 SQL을 실행하기 위해 이 인터페이스로 스파크 드라이버에 접속한다.
- JDBC/ODBC(Open Database Connectivity) 서버를 시작하려면 다음 명령을 실행한다.
  - 이 스크립트는 `bin/spark-submit` 스크립트에서 사용할 수 있는 모든 명령행 옵션을 지원한다.

```shell
$ ./sbin/start-thriftserver.sh
```

<br>

- 환경변수나 시스템 속성을 지정해 쓰리프트 서버의 주소를 변경할 수 있다.
- 환경 변수는 다음과 같이 설정한다.

```shell
$ export HIVE_SERVER2_THRIFT_PORT=<listening-port>
$ export HIVE_SERVER2_THRIFT_BIND_HOST=<listening-host>
$ ./sbin/start-thriftserver.sh \
    --master <master.sh> \
...
```

<br>

- 시스템 속성은 다음과 같이 설정한다.

```shell
$ ./sbin/start-thriftserver.sh \
    --hiveconf hive.server2.thrift.port=<listening-port> \
    --hiveconf hive.server2.thrift.bind.host=<listening-host> \
    --master <master-uri>
    ...
```

<br>

- 서버가 시작되면 다음 명령을 사용해 접속 테스트를 한다.

```shell
$ ./bin/beeline
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/189528913-730d119d-bb31-45b9-9e71-9640f76c6906.png)

<br>
<br>

## 5. 카탈로그 

- 스파크 SQL에서 가장 높은 추상화 단계는 **카탈로그(catalog)**이다.
- 카탈로그는 테이블에 저장된 데이터에 대한 메타데이터뿐만 아니라 데이터베이스, 테이블, 함수 그리고 뷰에 대한 정보를 추상화한다.
- 카탈로그는 `org.apache.spark.sql.catalog.Catalog` 패키지로 사용할 수 있다.
- 카탈로그는 테이블, 데이터베이스 그리고 함수를 조회하는 등 여러 가지 유요한 함수를 제공한다.

<br>
<br>

## 6. 테이블

- 스파크 SQL을 사용해 유요한 작업을 수행하려면 먼저 테이블을 정의해야 한다.
- DataFrame은 프로그래밍 언어로 정의하지만 테이블은 데이터베이스에서 정의한다.
- 스파크에서 테이블을 생성하면 **default** 데이터베이스에 등록된다. 

<br>

### 6.1 스파크 관리형 테이블 

- **관리형 테이블**과 **외부 테이블**의 개념은 반드시 알아야 한다.
- 테이블은 테이블의 데이터와 테이블에 대한 데이터(**메타데이터**)인 2가지 중요한 정보를 저장한다.
- 스파크는 데이터뿐만 아니라 파일에 대한 메타데이터를 관리할 수 있다.
- 디스크에 저장된 파일을 이용해 테이블을 정의하면 외부 테이블을 정의하는 것이다.
- DataFrame의 **saveAsTable** 메서드는 스파크가 관련된 모든 정보를 추적할 수 있는 관리형 테이블을 만들 수 있다.

<br>

- **saveAsTable** 메서드는 테이블을 읽고 데이터를 스파크 포맷으로 변환한 후 새로운 경로에 저장한다.
  - 데이터 저장 경로를 변경하려면 SParkSession을 생성할 때 `spark.sql.warehouse.dir` 속성에 원하는 디렉터리 경로를 설정한다.
  - 기본 저장 경로는 `/user/hive/warehouse` 이다.

<br>

### 6.2 테이블 생성하기

- 스파크는 SQL에서 전체 데이터소스 API를 재사용할 수 있는 독특한 기능을 지원한다. 
  - 즉, 테이블을 정의한 다음 테이블에 데이터를 적재할 필요가 없다.
- 스파크는 실행 즉시 테이블을 생성한다.
- 다음은 항공운항 데이터를 읽는 예제이다.
  - `;`는 커멘드를 종료시켜 준다.

> **USING** 구문을 통해 포맷을 지정하지 않으면 스파크는 기본적으로 하이브 SerDe 설정을 사용한다. <br> 하이브 사용자는 **STORED AS** 구문으로 하이브 테이블을 생성한다.

```sql
CREATE TABLE flights (
    DEST_COUNTRY_NAME STRING, ORIGIN_COUNTRY_NAME STRING, count LONG
)
USING JSON OPTIONS (path './data/flight-data/json/2015-summary.json');
```

<br>

- 테이블의 특정 컬럼에 코멘트(comment)를 추가해 다른 개발자의 이해를 도울 수 있다.

```sql
CREATE TABLE flights_csv (
    DEST_COUNTRY_NAME STRING,
    ORIGIN_COUNTRY_NAME STRING COMMENT "remeber, the US will be most prevalent",
    count LONG
)
USING csv OPTIONS (header true, path './data/flight-data/csv/2015-summary.csv');
```

<br>

- 또한 SELECT 쿼리의 결과를 이용해 테이블을 생성할 수도 있다.

```sql
CREATE TABLE flights_from_select USING parquet AS SELECT * FROM flights;
```

<br>

- 파티셔닝된 데이터셋을 저장해 데이터 레이아웃을 제어할 수 있다.

```sql
CREATE TABLE partitioned_flights 
USING parquet PARTITIONED BY (DEST_COUNTRY_NAME) AS SELECT DEST_COUNTRY_NAME, ORIGIN_COUNTRY_NAME, count FROM flights LIMIT 5;
```


<br>

### 6.3 외부 테이블 생성하기

- **하이브(Hive)**는 초기 빅데이터 SQL 시스템 중 하나였다.
- 기존 하이브 쿼리문을 스파크 SQL로 변환해야 하는 상황을 만날 수도 있는데, 대부분의 하이브 쿼리문을 스파크 SQL에서 바로 사용할 수 있다.
- 다음은 **외부 테이블(unmanaged table)**을 생성하는 예제이다.
  - 스파크는 외부 테이블의 메타데이터를 관리한다.
  - 하지만 데이터 파일은 스파크에서 관리하지 않는다.
  - **CREATE EXTERNAL TABLE** 구문을 사용해 외부 테이블을 생성할 수 있다.

```sql
CREATE EXTERNAL TABLE hive_flights (
    DEST_COUNTRY_NAME STRING, ORIGIN_COUNTRY_NAME STRING,
    count LONG
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LOCATION './data/flight-data-hive/';
```

<br>

- 또한 SELECT 쿼리의 결과를 이용해 외부 테이블을 생성할 수 있다.

```sql
CREATE EXTERNAL TABLE hive_flights_2
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
LOCATION './data/flight-data-hive/' AS SELECT * FROM flights;
```

<br>

### 6.4 테이블에 데이터 삽입하기

```sql
INSERT INTO flights_from_select
 SELECT DEST_COUNTRY_NAME, ORIGIN_COUNTRY_NAME, count 
 FROM flights LIMIT 20;
```

<br>

- 특정 파티션에만 저장하고 싶은 경우 파티션 명세를 추가할 수도 있다.

```sql
INSERT INTO partitioned_flights
 PARTITION (DEST_COUNTRY_NAME="UNITED STATES")
 SELECT ORIGIN_COUNTRY_NAME, count FROM flights
 WHERE DEST_COUNTRY_NAME= 'UNITED STATES' LIMIT 12;
```

<br>

### 6.5 테이블 메타데이터 확인하기

- **DESCRIBE** 구문은 테이블의 메타데이터 정보를 반환한다.

```sql
DESCRIBE TABLE flights_csv;
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/189531379-09c8c25d-f0ee-4703-912e-56fe6b6a1db5.png)

<br>

- 다음 명령을 사용해 파티셔닝 스키마 정보를 확인할 수 있다.

```sql
SHOW PARTITIONS partitioned_flights;
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/189531454-ef8d8ad0-a8cd-470d-807b-bced35ba31f9.png)

<br>

### 6.6 테이블 메타데이터 갱신하기

- 테이블 메타데이터를 갱신할 수 있는 2가지 명령이 있다.
- **REFRESH TABLE** 구무은 테이블과 관련된 모든 캐싱된 항목을 갱신한다.
- 테이블이 이미 캐싱되어 있다면 다음번 스캔이 동작하는 시점에 다시 캐싱한다.

```sql
REFRESH table partitioned_flights;
```

<br>

- **REPAIR TABLE** 구문은 카탈로그에서 관리하는 테이블의 파티션 정보를 새로 고친다.
- 이 명령은 새로운 파티션 정보를 수집하는 데 초점을 맞춘다.

```sql
MSCK REPAIR TABLE partitioned_flights;
```

<br>

### 6.7 테이블 제거하기

- 테이블은 삭제(delete)할 수 없고 오로지 제거(drop)만 할 수 있다.
  - **DROP** 키워드를 사용해 테이블을 제거한다.
  - **DROP TABLE IF EXISTS** 구문을 사용해 테이블이 존재하는 경우에만 제거한다.

```sql
DROP TABLE flights_csv;

-- 테이블이 존재하는 경우메나 제거
DROP TABLE IF EXISTS flights_csv;
```

<br>

### 6.8 테이블 캐싱하기

- 테이블을 캐시하거나 캐시에서 제거할 수 있다.

```sql
CACHE TABLE flights;

UNCACHE TABLE flights;
```

<br>
<br>

## 7. 뷰

- **뷰(view)**는 기존 테이블에 여러 트랜스포메이션 작업을 지정한다.
- 뷰는 단순 쿼리 실행 계획일 뿐이다.
- 뷰를 사용하면 쿼리 로직을 체계화하거나 재사용하기 편하게 만들 수 있다.
- 뷰는 데이터베이스에 설정하는 전역 뷰나 세션별 뷰가 될 수 있다.

<br>

### 7.1 뷰 생성하기 

- 신규 경로에 모든 데이터를 다시 저장하는 대신 단순하게 쿼리 시점에 데이터소스에 트랜스포메이션을 수행한다.
  - `filter`, `select`, `GROUP BY`, `ROLLUP` 같은 트랜스포메이션이 이에 해당한다.
- 다음은 목적지가 United States인 항공운항 데이터를 보기 위한 뷰를 생성하는 예제이다.

```sql
CREATE VIEW just_usa_view AS
 SELECT * FROM flights WHERE dest_country_name = "United States";
```

<br>

- 테이블처럼 데이터베이스에 등록되지 않고 현재 세션에서만 사용할 수 있는 임시 뷰를 만들 수 있다.

```sql
CREATE TEMP VIEW just_usa_view_temp AS
 SELECT * FROM flights WHERE dest_country_name = "United States";
```

<br>

- **전역적 임시 뷰(global temp view)**는 데이터베이스에 상관없이 사용할 수 있으므로 전체 스파크 애플리케이션에서 볼 수 있다.
  - 하지만 세션이 종료되면 뷰도 사라진다.

```sql
CREATE GLOBAL TEMP VIEW just_usa_view_temp AS
 SELECT * FROM flights WHERE dest_country_name = "United States";

SHOW TABLES;
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/189532042-c22341d1-16b6-4030-8b6e-6a42a6f06fd7.png)

<br>

- **CREATE OR REPLACE**를 사용해 생성된 뷰를 덮어쓸 수 있다.

```sql
CREATE OR REPLACE TEMP VIEW just_usa_view_temp AS
 SELECT * FROM flights WHERE dest_country_name = "United States";
```

<br>

- 이제 다른 테이블과 동일한 방식으로 뷰를 사용할 수 있다.

```sql
SELECT * FROM just_usa_view_temp;
```

<br>

- 뷰는 실질적으로 트랜스포메이션이며 스파크는 쿼리가 실행될 때만 뷰에 정의된 트랜스포메이션을 수행한다.
  - 뷰는 기존 DataFrame에서 새로운 DataFrame을 만드는 것과 동일하다.
- 즉, 테이블의 데이터를 실제로 조회하는 경우에만 필터를 적용한다.

<br>

### 7.2 뷰 제거하기

- 뷰를 제거하면 어떤 데이터도 제거되지 않으면 뷰 정의만 제거된다.

```sql
DROP VIEW IF EXISTS just_usa_view;
```


<br>
<br>
<br>
<br>

## References

[^1]: [[Hive] Hive MetaStore(하이브 메타스토어)란? hive metastore 유형, metastore 파라미터 by 스파이디웹](https://spidyweb.tistory.com/231)
