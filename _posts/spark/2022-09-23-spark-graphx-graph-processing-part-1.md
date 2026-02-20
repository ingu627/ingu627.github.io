---
layout: single
title: "스파크 GraphFrame 기초: 그래프·모티프 분석"
excerpt: "Spark The Definitive Guide 책을 중심으로 스파크를 요약 및 정리해보았습니다. spark 예제를 통해 그래프, 서브그래프, 모티프에 대해 알아봅니다."
categories: spark
tags: [스파크, spark, sql, 스칼라, scala, 정리, 의미, 란, 실행, 그래프, graphframe, graphx, vertex, edge, directed, 서브그래프, 모티프, motifs]
toc: true
toc_sticky: false
sidebar_main: false

last_modified_at: 2022-09-25
redirect_from:
  - /spark/spark_graph1/
---

<img align='right' width='150' height='200' src='https://user-images.githubusercontent.com/78655692/186088421-fe905f9e-d40f-43b2-ac6e-094e9c342473.png'>
[Spark The Definitive Guide - BIG DATA PROCESSING MADE SIMPLE] 책을 중심으로 스파크를 개인 공부를 위해 요약 및 정리해보았습니다. <br> 다소 복잡한 설치 과정은 도커에 미리 이미지를 업로해 놓았습니다. 즉, 도커 이미지를 pull하면 바로 스파크를 사용할 수 있습니다. <br><br> 도커 설치 및 활용하는 방법 : [[Spark] 빅데이터와 아파치 스파크란 - 1.2 스파크 실행하기](https://ingu627.github.io/spark/spark_db1/#12-%EC%8A%A4%ED%8C%8C%ED%81%AC-%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0) <br> 도커 이미지 링크 : [https://hub.docker.com/r/ingu627/hadoop](https://hub.docker.com/r/ingu627/hadoop) <br> 예제를 위한 데이터 링크 : [FVBros/Spark-The-Definitive-Guide](https://github.com/ingu627/BigData/tree/master/spark/data) <br> 예제에 대한 실행 언어는 SQL과 스칼라(scala)로 했습니다.
{: .notice--info}
**기본 실행 방법** <br> 1. 예제에 사용 될 데이터들은 도커 이미지 생성 후 `spark-3.3.0` 안의 하위 폴더 `data`를 생성 후, 이 폴더에 추가합니다. <br> 1.1 데이터와 도커 설치 및 활용하는 방법은 위에 링크를 남겼습니다. <br> 2. 프로그램 시작은 `cd spark-3.3.0` 후, `./bin/spark-shell` 명령어를 실행하시면 됩니다.
{: .notice--danger}

<br>
<br>
<br>

## 1. 그래프 분석

- **그래프(graph)**는 임의의 객체인 **노드(node)**(또는 **정점(vertex)**)와 이들 간의 관계를 정의하는 **에지(edge)**로 구성된 데이터 구조이다.
- **그래프 분석(Graph analytics)**은 이러한 데이터 구조를 분석하는 프로세스이다.

<br>

- 친구 관계를 표현하는 그래프를 예를 들 수 있다.
- 그래프 분석의 관점에서 각 정점 또는 노드는 특정 사람을 표현하고, 각 에지는 그들 간의 관계를 나타낸다.

    ![image](https://user-images.githubusercontent.com/78655692/191026412-c8b6ff12-0020-46e7-8adc-263b1de95384.png)

<br>

- 위의 예제 그래프처럼 방향성이 없는 것을 **비방향성 그래프(undirected graph)**이라 한다.
  - 에지가 어떤 정점에서 시작되고 어떤 정점에서 끝나는지 나타나 있지 않다.
- 반면 시작과 끝을 지정한 방향성이 있는 그래프를 **방향성 그래프(directed graph)**이라 한다.

    ![image](https://user-images.githubusercontent.com/78655692/191030288-d9013509-313b-4010-b5b9-a13f409b8543.png)

<br>

- 그래프의 에지와 정점은 각각 속성(attribute)을 나타내는 데이터를 가질 수 있다.
- 그래프는 관계 및 그 외 다양한 현실 세계의 문제를 자연스럽게 설명하는 방법이며, 스파크는 이러한 그래프 분석 패러다임을 기반으로 한 다양한 작업 방법을 제공한다.
- 이러한 방법을 이용한 활용 사례로는 신용카드 사기 적발, 모티프(motif) 발견, 서지네트워크에서 특정 논문의 중요도 결정, 구글의 유명한 페이지랭크 알고리즘을 활용한 웹피이지 순위 결정 등이 있다. 
  - **네트워크 모티프(network motif)** : 반복적이고 통계적으로 중요한 서브그래프 또는 패턴을 의미한다. [^1]

<br>

- 스파크는 그래프 처리를 지원하는 RDD 기반의 라이브러리인 **GraphX**를 제공하고 있다.
- **GraphX**는 스파크의 핵심 영역이지만, 제공하는 인터페이스는 매우 저수준이라 기능은 강력하지만 최적화하기 어렵다.
- **GraphFrame**은 기존의 GraphX를 확장한 개념으로 DataFrame API를 제공하고 스파크에서 지원하는 다양한 언어를 사용할 수 있다.

<br>

- 코드 예제를 실행하려면 사용하려는 패키지를 미리 로드해야 한다.
  - 스파크 패키지 링크 : [graphframes - SparkPackages](https://spark-packages.org/package/graphframes/graphframes)

> 해당 패키지의 버전만 맞게 명령어를 실행해주면 된다.

```shell
$ cd spark-3.3.0
$ ./bin/spark-shell --packages graphframes:graphframes:0.8.2-spark3.2-s_2.12

val bikeStations = spark.read.option("header", "true"
  ).csv("./data/bike-data/201508_station_data.csv")
val tripData = spark.read.option("header", "true"
  ).csv("./data/bike-data/201508_trip_data.csv")
```

- **실행결과**

  ![image](https://user-images.githubusercontent.com/78655692/192133301-4fdf28bb-4c2b-45d2-b208-18f18bb2321a.png)

<br>
<br>

## 2. 그래프 작성하기

- 첫번째 단계는 그래프를 작성하는 것이다.
- 이를 위해 **정점(vertex)**와 **에지(edge)**를 정의해야 한다.
  - 정점과 에지는 별도 명명된 컬럼으로 표현되는 DataFrame이다.
- 그래프를 정의하기 위해서는 GraphFrame 라이브러리에서 제시하는 컬럼에 대한 명명규칙을 사용해야 한다.
- 정점 테이블에서는 식별자(`name`)를 id로 정의하고(문자열 타입), 에지 테이블에서는 각 에지의 시작 정점 ID를 `src`로 도착 정점 ID를 `dst`로 표시한다.

```scala
val stationVertices = bikeStations.withColumnRenamed("name", "id").distinct()
val tripEdges = tripData.withColumnRenamed("Start Station", "src"
  ).withColumnRenamed("End Station", "dst")
```

<br>

- 이제 우리는 지금까지 정의한 정점/에지 DataFrame으로 그래프를 표현하는 GraphFrame 객체를 구성할 수 있다.

```scala
import org.graphframes.GraphFrame

val stationGraph = GraphFrame(stationVertices, tripEdges)
stationGraph.cache()

println(s"Total Number of Stations: ${stationGraph.vertices.count()}")
println(s"Total Number of Trips in Graph: ${stationGraph.edges.count()}")
println(s"Total Number of Trips in Original Data: ${tripData.count()}")
```

- **실행결과**

  ![image](https://user-images.githubusercontent.com/78655692/192134958-6c01ca0e-aecb-426a-8394-92078aa12a7f.png)

<br>
<br>

## 3. 그래프 쿼리하기 

- 그래프를 활용하는 가장 간단한 방법은 그래프를 대상으로 쿼리하는 것이다.
- 또한 GraphFrame은 정점과 에지 모두에 DataFrame으로 손쉬운 액세스를 할 수 있다.

```scala
import org.apache.spark.sql.functions.desc

stationGraph.edges.where("src = 'Townsend at 7th' OR dst = 'Townsend at 7th'"
  ).groupBy("src", "dst"
  ).count().orderBy(desc("count")).show(10)
```

- **실행결과**

  ![image](https://user-images.githubusercontent.com/78655692/192136980-76473100-eebf-4c82-b59f-6c90857c3c8f.png)

<br>
<br>

## 4. 서브그래프

- **서브그래프(subgraph)**는 규모가 큰 그래프 안에서 형성되는 작은 규모의 그래프이다.
  - 쿼리 기능을 사용하여 서브그래프를 만들 수 있다.

```scala
val townAnd7thEdges = stationGraph.edges.where("src = 'Townsend at 7th' OR dst = 'Townsend at 7th'")
val subgraph = GraphFrame(stationGraph.vertices, townAnd7thEdges)
```

<br>
<br>

## 5. 모티프

- **모티프(motifs)**는 정형 패턴을 그래프로 표현하는 방법이다.
- 모티프를 지정하면 실제 데이터 대신 데이터의 패턴을 쿼리한다.
- DataFrame에서는 Neo4J의 Cypher 언어와 유사한 도메인에 특화된 언얼 쿼리를 지정한다.
  - 이 언어를 사용하면 정점과 에지의 조합을 지정하고 그에 대한 이름을 할당할 수 있다.
  - 예를 들어, 정점 a가 에지 ab를 통해 다른 정점 b에 연결되도록 지정하려면 `(a)-[ab]->(b)`라고 작성하면 된다.
  - 괄호 또는 대괄호 안의 이름은 값을 나타내는 것이 아니라 결과로 나오는 DataFrame에 존재하는 이름과 일치하는 정점 및 에지의 컬럼 이름이다.

<br>

- 예제로, 3개의 도착지 간에 삼각형 패턴을 형성하는 모든 자전거를 찾아본다.
- **find** 메서드를 사용하여 DataFrame에 해당 패턴을 쿼리하는 방식으로 표현할 수 있다.

```scala
val motifs = stationGraph.find("(a)-[ab]->(b); (b)-[bc]->(c); (c)-[ca]->(a)")
```

- **삼각형 모티프**

  ![image](https://user-images.githubusercontent.com/78655692/192138313-1a1c278d-93b1-4d36-b7df-34d9b846fa31.png)

<br>

- 위 쿼리를 실행하면 정점 a, b, c와 가 에지의 중첩(nested) 필드가 포함된 DataFrame이 생성된다.
- 아래 예제는 기존의 타임스탬프를 스파크의 타임스탬프로 파싱(parsing)한 다음 특정 지점에서 다른 지점으로 이동한 자전거가 동일한 것인지, 각 이동을 시작하는 시점이 올바른지 확인하기 위해 비교를 수행한다.
  - **파싱(parsing)** : 구문 분석이라고도 하며, 문장을 그것을 이루고 있는 구성 성분으로 분해하고 그들 사이의 위치 관계를 분석하여 문장의 구조를 결정하는 것을 말한다. [^2]

```scala
import org.apache.spark.sql.functions.{expr, to_timestamp}
spark.sql("set spark.sql.legacy.timeParserPolicy=LEGACY")

motifs.selectExpr("*",
  "to_timestamp(ab.`Start Date`, 'MM/dd/yyyy HH:mm') as abStart",
  "to_timestamp(bc.`Start Date`, 'MM/dd/yyyy HH:mm') as bcStart",
  "to_timestamp(ca.`Start Date`, 'MM/dd/yyyy HH:mm') as caStart"
  ).where("ca.`Bike #` = bc.`Bike #`"
  ).where("ab.`Bike #` = bc.`Bike #`"
  ).where("a.id != b.id"
  ).where("b.id != c.id"
  ).where("abStart < bcStart"
  ).where("bcStart < caStart"
  ).orderBy(expr("cast(caStart as long) - cast(abStart as long)")
  ).selectExpr("a.id", "b.id", "c.id", "ab.`Start Date`", "ca.`End Date`"
  ).limit(1).show(false)
```

- **실행결과**

  ![image](https://user-images.githubusercontent.com/78655692/192140860-e86e25d7-aa7a-4d2d-99fe-b67c5dcb25f5.png)



<br>
<br>
<br>
<br>

## References

[^1]: [wikipedia - network motif](https://en.wikipedia.org/wiki/Network_motif)
[^2]: [위키백과 - 구문 분석](https://ko.wikipedia.org/wiki/%EA%B5%AC%EB%AC%B8_%EB%B6%84%EC%84%9D)