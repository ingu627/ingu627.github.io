---
layout: single
title: "[Spark] GraphFrame을 활용한 그래프 분석 및 알고리즘"
excerpt: "Spark: The Definitive Guide 30장 Graph Analytics를 바탕으로 스파크 GraphFrame 라이브러리의 핵심을 다룬다. 정점(Vertex)과 에지(Edge) 기반의 그래프 생성 및 기본 DataFrame 쿼리, 서브그래프 추출, Cypher 표현식을 활용한 모티프(Motif) 검색부터 페이지랭크(PageRank), 차수(In/Out-Degree) 지표, 너비 우선 탐색(BFS), 연결 요소(Connected Components) 알고리즘까지 종합적으로 살펴본다."
categories: spark
tags: [스파크, spark, sql, 스칼라, scala, 정리, 의미, 란, 실행, 그래프, graphframe, graphx, vertex, edge, directed, 서브그래프, 모티프, motifs, pagerank, 알고리즘, algorithm, 페이지랭크, outdegree, 너비 우선 탐색, bfs, breadth first search]
toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2026-10-10
---

<img align='right' width='150' height='200' src='https://user-images.githubusercontent.com/78655692/186088421-fe905f9e-d40f-43b2-ac6e-094e9c342473.png'>
[Spark The Definitive Guide - BIG DATA PROCESSING MADE SIMPLE] 책을 중심으로 스파크를 개인 공부를 위해 요약 및 정리해보았습니다. 다소 복잡한 설치 과정은 도커에 미리 이미지를 업로해 놓았습니다. 즉, 도커 이미지를 pull하면 바로 스파크를 사용할 수 있습니다.

- 도커 설치 및 활용하는 방법 : [[Spark] 빅데이터와 아파치 스파크란 - 1.2 스파크 실행하기](https://ingu627.github.io/spark/spark_db1/#12-%EC%8A%A4%ED%8C%8C%ED%81%AC-%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0)
- 도커 이미지 링크 : [https://hub.docker.com/r/ingu627/hadoop](https://hub.docker.com/r/ingu627/hadoop)
- 예제를 위한 데이터 링크 : [FVBros/Spark-The-Definitive-Guide](https://github.com/ingu627/BigData/tree/master/spark/data)

예제에 대한 실행 언어는 SQL과 스칼라(scala)로 했습니다.

**기본 실행 방법**

1. 예제에 사용 될 데이터들은 도커 이미지 생성 후 `spark-3.3.0` 안의 하위 폴더 `data`를 생성 후, 이 폴더에 추가합니다.
   - 1.1 데이터와 도커 설치 및 활용하는 방법은 위에 링크를 남겼습니다.
2. 프로그램 시작은 `cd spark-3.3.0` 후, `./bin/spark-shell` 명령어를 실행하시면 됩니다.

이 글은 Spark: The Definitive Guide를 바탕으로 스파크의 GraphFrame 라이브러리를 활용한 그래프 분석 및 알고리즘을 종합적으로 정리한다. 정점과 에지 DataFrame을 통한 그래프 생성, 서브그래프 추출, Cypher 패턴 매칭을 이용한 모티프 탐색부터 대규모 네트워크 분석의 핵심인 페이지랭크, 진입·진출 차수 지표, BFS 최단 경로 탐색, 연결 요소 분석까지 차례대로 다룬다.

- 이 글에서 다루는 것
  - 그래프 분석의 개념과 GraphX 대비 GraphFrame의 특징 및 환경 구성
  - 정점(Vertex)과 에지(Edge) 정의 및 GraphFrame 객체 작성
  - DataFrame 기반의 그래프 쿼리와 서브그래프(Subgraph) 생성
  - 모티프(Motif) 검색을 통한 그래프 정형 패턴 매칭
  - 페이지랭크(PageRank) 알고리즘을 활용한 중요 노드 순위 산정
  - 진입차수(In-Degree)와 진출차수(Out-Degree) 지표 및 비율 분석
  - 너비 우선 탐색(BFS)을 통한 노드 간 최단 경로 탐색
  - 연결 요소(Connected Components) 및 강한 연결 요소(Strongly Connected Components) 분석


## 1. 그래프 분석

- **그래프(graph)**는 임의의 객체인 **노드(node)**(또는 **정점(vertex)**)와 이들 간의 관계를 정의하는 **에지(edge)**로 구성된 데이터 구조이다.
- **그래프 분석(Graph analytics)**은 이러한 데이터 구조를 분석하는 프로세스이다.


- 친구 관계를 표현하는 그래프를 예를 들 수 있다.
- 그래프 분석의 관점에서 각 정점 또는 노드는 특정 사람을 표현하고, 각 에지는 그들 간의 관계를 나타낸다.

    ![image](https://user-images.githubusercontent.com/78655692/191026412-c8b6ff12-0020-46e7-8adc-263b1de95384.png)


- 위의 예제 그래프처럼 방향성이 없는 것을 **비방향성 그래프(undirected graph)**이라 한다.
  - 에지가 어떤 정점에서 시작되고 어떤 정점에서 끝나는지 나타나 있지 않다.
- 반면 시작과 끝을 지정한 방향성이 있는 그래프를 **방향성 그래프(directed graph)**이라 한다.

    ![image](https://user-images.githubusercontent.com/78655692/191030288-d9013509-313b-4010-b5b9-a13f409b8543.png)


- 그래프의 에지와 정점은 각각 속성(attribute)을 나타내는 데이터를 가질 수 있다.
- 그래프는 관계 및 그 외 다양한 현실 세계의 문제를 자연스럽게 설명하는 방법이며, 스파크는 이러한 그래프 분석 패러다임을 기반으로 한 다양한 작업 방법을 제공한다.
- 이러한 방법을 이용한 활용 사례로는 신용카드 사기 적발, 모티프(motif) 발견, 서지네트워크에서 특정 논문의 중요도 결정, 구글의 유명한 페이지랭크 알고리즘을 활용한 웹피이지 순위 결정 등이 있다. 
  - **네트워크 모티프(network motif)** : 반복적이고 통계적으로 중요한 서브그래프 또는 패턴을 의미한다. [^1]


- 스파크는 그래프 처리를 지원하는 RDD 기반의 라이브러리인 **GraphX**를 제공하고 있다.
- **GraphX**는 스파크의 핵심 영역이지만, 제공하는 인터페이스는 매우 저수준이라 기능은 강력하지만 최적화하기 어렵다.
- **GraphFrame**은 기존의 GraphX를 확장한 개념으로 DataFrame API를 제공하고 스파크에서 지원하는 다양한 언어를 사용할 수 있다.


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


## 4. 서브그래프

- **서브그래프(subgraph)**는 규모가 큰 그래프 안에서 형성되는 작은 규모의 그래프이다.
  - 쿼리 기능을 사용하여 서브그래프를 만들 수 있다.

```scala
val townAnd7thEdges = stationGraph.edges.where("src = 'Townsend at 7th' OR dst = 'Townsend at 7th'")
val subgraph = GraphFrame(stationGraph.vertices, townAnd7thEdges)
```


## 5. 모티프

- **모티프(motifs)**는 정형 패턴을 그래프로 표현하는 방법이다.
- 모티프를 지정하면 실제 데이터 대신 데이터의 패턴을 쿼리한다.
- DataFrame에서는 Neo4J의 Cypher 언어와 유사한 도메인에 특화된 언얼 쿼리를 지정한다.
  - 이 언어를 사용하면 정점과 에지의 조합을 지정하고 그에 대한 이름을 할당할 수 있다.
  - 예를 들어, 정점 a가 에지 ab를 통해 다른 정점 b에 연결되도록 지정하려면 `(a)-[ab]->(b)`라고 작성하면 된다.
  - 괄호 또는 대괄호 안의 이름은 값을 나타내는 것이 아니라 결과로 나오는 DataFrame에 존재하는 이름과 일치하는 정점 및 에지의 컬럼 이름이다.


- 예제로, 3개의 도착지 간에 삼각형 패턴을 형성하는 모든 자전거를 찾아본다.
- **find** 메서드를 사용하여 DataFrame에 해당 패턴을 쿼리하는 방식으로 표현할 수 있다.

```scala
val motifs = stationGraph.find("(a)-[ab]->(b); (b)-[bc]->(c); (c)-[ca]->(a)")
```

- **삼각형 모티프**

  ![image](https://user-images.githubusercontent.com/78655692/192138313-1a1c278d-93b1-4d36-b7df-34d9b846fa31.png)


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


그래프의 구조적 패턴과 서브그래프를 쿼리하는 기초 단계를 거쳤다면, 이제 그래프 이론이 제공하는 고차원 알고리즘을 적용할 차례다. GraphFrame은 정점의 상대적 중요도 측정, 네트워크 연결성, 최단 경로 탐색 등을 분산 환경에서 곧바로 수행할 수 있는 다양한 그래프 알고리즘을 지원한다.


## 6. 그래프 알고리즘

- 그래프는 사실 데이터의 논리적 표현에 불과하다.
- 그래프 이론은 이러한 그래프 형식을 통해 데이터를 분석하기 위한 수많은 알고리즘을 제공한다.
- 스파크의 GraphFrame은 이러한 알고리즘을 손쉽게 활용할 수 있도록 지원하며, 앞서 빌드한 `stationGraph`를 바탕으로 다양한 분석을 수행할 수 있다.

```shell
$ ./bin/spark-shell --packages graphframes:graphframes:0.8.2-spark3.2-s_2.12
```

```scala
val bikeStations = spark.read.option("header", "true"
  ).csv("./data/bike-data/201508_station_data.csv")
val tripData = spark.read.option("header", "true"
  ).csv("./data/bike-data/201508_trip_data.csv")

val stationVertices = bikeStations.withColumnRenamed("name", "id").distinct()
val tripEdges = tripData.withColumnRenamed("Start Station", "src"
  ).withColumnRenamed("End Station", "dst")

import org.graphframes.GraphFrame

val stationGraph = GraphFrame(stationVertices, tripEdges)
stationGraph.cache()
```


## 7. 페이지랭크

- **페이지랭크(PageRank)**는 가장 많이 사용되는 그래프 알고리즘 중 하나이다.
- 페이지랭크는 최초 구글의 공동 설립자인 래리 페이지에 의해 웹 페이지의 순위를 정하는 방법에 대한 연구 프로젝트로 시작되었다.
- 페이지랭크는 웹사이트의 중요성을 대략 판단하기 위해 특정 웹 페이지가 다른 웹 페이지로부터 받는 링크 수와 품질을 계산한다.
- 페이지랭크는 중요한 웹사이트일수록 더 많은 링크를 받을 것이라고 가정한다.


- 페이지랭크 알고리즘은 랜덤으로 링크를 클릭하는 사람이 특정 페이지에 도달할 가능성을 나타내는 데 사용되는 확률 분포를 출력한다. [^3]
- 알고리즘은 다음과 같다.
  1. 각 페이지 랭크를 1.0으로 초기화한다.
  2. 각 반복마다, 페이지 p가 `랭크 확률(p)/n(총 정점 수)`를 이웃에게 전송한다.
  3. 각 페이지의 랭크를 `0.15 + 0.85*sum(총 기여 받은 수)`로 계산한다.
- 마지막 두 단계는 알고리즘이 각 페이지에 대한 올바른 페이지랭크 값으로 수렴하는 동안 여러 번 반복된다.
  - default : 10회 


- 페이지랭크는 웹 도메인 외에도 매우 유용하게 일반화하여 활용할 수 있다.
- 페이지랭크의 원리를 자전거 여행 데이터셋에 적용하여 어떤 지점이 더 중요한지 파악할 수 있다.
- 따라서 중요한 자전거 도착 지점에는 높은 페이지랭크 값이 할당된다.
  
```scala
import org.apache.spark.sql.functions.desc

// 여기서는 0.15로 초기화한다.
val ranks = stationGraph.pageRank.resetProbability(0.15).maxIter(10).run()
ranks.vertices.orderBy(desc("pagerank")).select("id", "pagerank").show(10)
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/192148949-0dbeb7c1-0d57-4a6a-81f6-82049f048934.png)


## 8. In-Degree와 Out-Degree 지표

- 방향성이 있는 그래프를 대상으로 공통으로 하는 작업은 바로 주어진 지점을 기준으로 도착하는 여행자 수와 출발하는 여행자 수를 계산하는 것이다.
- 각 지점의 출입을 측정하기 위해 각각의 진입차수(`in-degree`)와 진출차수(`out-degree`) 지표를 사용한다.

![image](https://user-images.githubusercontent.com/78655692/192149243-22f96716-6652-4823-8269-e42de8130eba.png)

- 이러한 지표는 소셜 네트워크에서 관계를 분석하는 데 자주 활용된다.
  - 일반적으로 소셜 네트워크에서 특정 사용자는 아웃 바운드 연결(ex. 그 사용자가 팔로우함)보다 인바운드 연결(ex. 팔로워)가 더 많기 때문이다.
- 다음 쿼리를 사용하면 소셜 네트워크에서 다른 사람들보다 더 영향력 있는 사람이 누구인지 찾을 수 있다.

```scala
val inDeg = stationGraph.inDegrees
inDeg.orderBy(desc("inDegree")).show(5, false)
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/192149381-2290068c-82b4-40ff-8ced-9648770262dd.png)


- out-degree도 같은 방식으로 쿼리할 수 있다.

```scala
val outDeg = stationGraph.outDegrees
outDeg.orderBy(desc("outDegree")).show(5, false)
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/192149430-51cc155d-d34c-4eb1-a88d-b232639d1edc.png)


- 비율(`in/out`)이 높은 곳은 주로 여행이 끝나는 지점이고, 비율이 낮은 곳은 여행이 자주 시작되는 지점이다.

```scala
val degreeRatio = inDeg.join(outDeg, Seq("id")
    ).selectExpr("id", "double(inDegree)/double(outDegree) as degreeRatio")
degreeRatio.orderBy(desc("degreeRatio")).show(10, false)
degreeRatio.orderBy("degreeRatio").show(10, false)
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/192149616-522641e5-868d-4deb-a6d5-047fe6780104.png)


## 9. 너비 우선 탐색

- **너비 우선 탐색(Breadth-First Search)**은 그래프상의 연결 관계(에지, edge)를 기준으로 두 개의 노드를 연결하는 방법을 탐색하는 알고리즘이다.
  - BFS를 구현하기 위해 큐(Queue)의 FIFO 특성을 사용한다. 

![image](https://user-images.githubusercontent.com/78655692/192150752-d6e3107f-3603-4813-b9b4-7c281975498a.png) <br> 이미지출처 [^4]


- 예제에서는 이 알고리즘을 서로 다른 지점 간 최단 경로를 찾기 위해 사용하지만 SQL 표현식으로 지정된 노드 집합에도 적용할 수 있다.
  - **maxPathLength**로 최대 에지 수를 지정할 수 있다.
  - **edgeFilter**로 조건에 맞지 않는 에지를 필터링할 수도 있다.

```scala
stationGraph.bfs.fromExpr("id = 'Townsend at 7th'"
    ).toExpr("id = 'Spear at Folsom'").maxPathLength(2).run().show(10)
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/192150937-9ceae44d-842f-4781-b887-a0d19dcca7f3.png)


## 10. 연결 요소

- **연결 요소(connected component)**는 자체적인 연결을 가지고 있지만 큰 그래프에는 연결되지 않은(undirected) 서브 그래프이다.

![image](https://user-images.githubusercontent.com/78655692/192151043-4329de00-6cf8-47ec-a82d-0430e39da0d4.png)


- 로컬 시스템에서 이 알고리즘을 실행하기 위해 해야 할 일은 먼저 데이터를 샘플링하는 것이다.
- 샘플을 사용하면 가비지 컬렉션(garbage collection) 이슈와 같은 스파크 애플리케이션 충돌을 발생시키지 않고 결과를 얻을 수 있다.
  - **가비지 컬렉션(garbage collection)** : 메모리 관리 기법의 하나로, 프로그램이 동적으로 할당했던 메모리 영역 중 필요 없게 된 영역을 해제하는 기능이다.

```scala
spark.sparkContext.setCheckpointDir("/tmp/checkpoints")

val minGraph = GraphFrame(stationVertices, tripEdges.sample(false, 0.1))
val cc= minGraph.connectedComponents.run()

// 사용된 샘플 데이터에는 모든 정보가 포함되어 있지 않을 수 있기 때문에 추가적인 분석을 한다.
cc.where("component !=0").show()
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/192151274-7801f0ff-a21d-4749-8f45-3c055d3cf7ab.png)


### 10.1 강한 연결 요소

- **강한 연결 요소(strongly connected component)**는 방향성이 고려된 상태로 강하게 연결된 구성 요소, 즉 내부의 모든 정점 쌍 사이에 경로가 존재하는 서브그래프이다.

```scala
val scc = minGraph.stronglyConnectedComponents.maxIter(3).run()
```


## 핵심 정리

- **GraphFrame과 분산 그래프 표현**: 스파크의 GraphFrame은 RDD 기반의 GraphX를 확장하여 DataFrame API를 제공함으로써 풍부한 최적화와 다양한 언어 지원을 누릴 수 있다. 정점(`id`)과 에지(`src`, `dst`) 컬럼 명명 규칙을 준수하여 분산 그래프를 구성한다.
- **기본 그래프 쿼리와 서브그래프**: 정점과 에지 모두 DataFrame으로 직접 접근 가능하여 필터링(`where`), 그룹화(`groupBy`), 정렬(`orderBy`) 등의 연산을 자유롭게 수행할 수 있으며, 조건에 맞는 에지를 필터링하여 부분 네트워크인 서브그래프(Subgraph)를 생성한다.
- **모티프(Motif) 검색**: Cypher 유사 언어를 통해 `(a)-[ab]->(b)`와 같은 정형 패턴을 직관적으로 기술하고, `find` 메서드를 통해 복잡한 다자간 상호작용 및 시계열 경로를 정형화하여 패턴을 매칭한다.
- **페이지랭크(PageRank) 알고리즘**: 링크의 수와 품질을 기반으로 웹 페이지나 자전거 대여소 같은 정점의 상대적 중요도와 권위도를 확률 분포로 수렴 계산한다.
- **차수 지표(In/Out-Degree)**: 각 정점에 도달하는 진입차수와 출발하는 진출차수를 측정하여 소셜 네트워크의 영향력자 또는 자전거 네트워크의 유입/유출 허브를 식별하고 비율(`in/out`)을 분석한다.
- **너비 우선 탐색(BFS)**: 큐(FIFO)를 기반으로 두 노드 사이의 최단 경로를 탐색하며, 최대 경로 길이(`maxPathLength`)와 에지 필터(`edgeFilter`) 조건을 결합하여 효율적인 경로를 도출한다.
- **연결 요소(Connected Components)**: 대규모 그래프 내에서 독립적으로 연결된 클러스터를 식별하며, 방향성을 고려해 내부 정점 쌍이 서로 도달 가능한 강한 연결 요소(SCC)를 함께 지원한다. 대규모 연산 시 가비지 컬렉션 부하를 고려해 체크포인트 디렉터리 설정과 샘플링을 활용한다.

## References

[^1]: [wikipedia - network motif](https://en.wikipedia.org/wiki/Network_motif)
[^2]: [위키백과 - 구문 분석](https://ko.wikipedia.org/wiki/%EA%B5%AC%EB%AC%B8_%EB%B6%84%EC%84%9D)
[^3]: [Understanding PageRank algorithm in scala on Spark](http://www.openkb.info/2016/03/understanding-pagerank-algorithm-in.html)
[^4]: [[Algorithm] 너비 우선 탐색 (Breadth-First Search) - nomadhash](https://velog.io/@nomadhash/Algorithm-%EB%84%88%EB%B9%84-%EC%9A%B0%EC%84%A0-%ED%83%90%EC%83%89-Breadth-First-Search)
