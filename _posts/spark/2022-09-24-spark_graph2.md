---
layout: single
title: "스파크: GraphFrame 그래프 알고리즘 예제"
excerpt: "Spark The Definitive Guide 책을 중심으로 스파크를 요약 및 정리해보았습니다. spark 예제를 통해 RDD 고급 연산에 대해 알아봅니다."
categories: spark
tags: [스파크, spark, sql, 스칼라, scala, 정리, 의미, 란, 실행, 그래프, graphframe, pagerank, 알고리즘, algorithm, 페이지랭크, outdegree, 너비 우선 탐색, bfs, breadth first search]
toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2022-09-25
---

<img align='right' width='150' height='200' src='https://user-images.githubusercontent.com/78655692/186088421-fe905f9e-d40f-43b2-ac6e-094e9c342473.png'>
[Spark The Definitive Guide - BIG DATA PROCESSING MADE SIMPLE] 책을 중심으로 스파크를 개인 공부를 위해 요약 및 정리해보았습니다. <br> 다소 복잡한 설치 과정은 도커에 미리 이미지를 업로해 놓았습니다. 즉, 도커 이미지를 pull하면 바로 스파크를 사용할 수 있습니다. <br><br> 도커 설치 및 활용하는 방법 : [[Spark] 빅데이터와 아파치 스파크란 - 1.2 스파크 실행하기](https://ingu627.github.io/spark/spark_db1/#12-%EC%8A%A4%ED%8C%8C%ED%81%AC-%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0) <br> 도커 이미지 링크 : [https://hub.docker.com/r/ingu627/hadoop](https://hub.docker.com/r/ingu627/hadoop) <br> 예제를 위한 데이터 링크 : [FVBros/Spark-The-Definitive-Guide](https://github.com/ingu627/BigData/tree/master/spark/data) <br> 예제에 대한 실행 언어는 SQL과 스칼라(scala)로 했습니다.
{: .notice--info}
**기본 실행 방법** <br> 1. 예제에 사용 될 데이터들은 도커 이미지 생성 후 `spark-3.3.0` 안의 하위 폴더 `data`를 생성 후, 이 폴더에 추가합니다. <br> 1.1 데이터와 도커 설치 및 활용하는 방법은 위에 링크를 남겼습니다. <br> 2. 프로그램 시작은 `cd spark-3.3.0` 후, `./bin/spark-shell` 명령어를 실행하시면 됩니다. <br><br> 이전 글 링크 : [[Spark] GraphFrame을 활용한 그래프, 서브그래프, 모티프](https://ingu627.github.io/spark/spark_graph1/)
{: .notice--danger}

<br>
<br>
<br>

## 1. 그래프 알고리즘

- 먼저 이전 글에서 소개했지만, 원활한 예제 실행을 위해 코드를 다시 정리를 해본다.

```shell
$ ./bin/spark-shell --packages graphframes:graphframes:0.8.2-spark3.2-s_2.12
```

<br>

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

<br>
<br>

- 그래프는 사실 데이터의 논리적 표현에 불과하다.
- 그래프 이론은 이러한 그래프 형식을 통해 데이터를 분석하기 위한 수많은 알고리즘을 제공한다.
- 스파크의 GraphFrame은 이러한 알고리즘을 손쉽게 활용할 수 있도록 지원한다.

<br>

## 2. 페이지랭크

- **페이지랭크(PageRank)**는 가장 많이 사용되는 그래프 알고리즘 중 하나이다.
- 페이지랭크는 최초 구글의 공동 설립자인 래리 페이지에 의해 웹 페이지의 순위를 정하는 방법에 대한 연구 프로젝트로 시작되었다.
- 페이지랭크는 웹사이트의 중요성을 대략 판단하기 위해 특정 웹 페이지가 다른 웹 페이지로부터 받는 링크 수와 품질을 계산한다.
- 페이지랭크는 중요한 웹사이트일수록 더 많은 링크를 받을 것이라고 가정한다.

<br>

- 페이지랭크 알고리즘은 랜덤으로 링크를 클릭하는 사람이 특정 페이지에 도달할 가능성을 나타내는 데 사용되는 확률 분포를 출력한다. [^1]
- 알고리즘은 다음과 같다.
  1. 각 페이지 랭크를 1.0으로 초기화한다.
  2. 각 반복마다, 페이지 p가 `랭크 확률(p)/n(총 정점 수)`를 이웃에게 전송한다.
  3. 각 페이지의 랭크를 `0.15 + 0.85*sum(총 기여 받은 수)`로 계산한다.
- 마지막 두 단계는 알고리즘이 각 페이지에 대한 올바른 페이지랭크 값으로 수렴하는 동안 여러 번 반복된다.
  - default : 10회 

<br>

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

<br>
<br>

## 3. In-Degree와 Out-Degree 지표

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

<br>

- out-degree도 같은 방식으로 쿼리할 수 있다.

```scala
val outDeg = stationGraph.outDegrees
outDeg.orderBy(desc("outDegree")).show(5, false)
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/192149430-51cc155d-d34c-4eb1-a88d-b232639d1edc.png)

<br>

- 비율(`in/out`)이 높은 곳은 주로 여행이 끝나는 지점이고, 비율이 낮은 곳은 여행이 자주 시작되는 지점이다.

```scala
val degreeRatio = inDeg.join(outDeg, Seq("id")
    ).selectExpr("id", "double(inDegree)/double(outDegree) as degreeRatio")
degreeRatio.orderBy(desc("degreeRatio")).show(10, false)
degreeRatio.orderBy("degreeRatio").show(10, false)
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/192149616-522641e5-868d-4deb-a6d5-047fe6780104.png)

<br>
<br>

## 4. 너비 우선 탐색

- **너비 우선 탐색(Breadth-First Search)**은 그래프상의 연결 관계(에지, edge)를 기준으로 두 개의 노드를 연결하는 방법을 탐색하는 알고리즘이다.
  - BFS를 구현하기 위해 큐(Queue)의 FIFO 특성을 사용한다. 

![image](https://user-images.githubusercontent.com/78655692/192150752-d6e3107f-3603-4813-b9b4-7c281975498a.png) <br> 이미지출처 [^2]

<br>

- 예제에서는 이 알고리즘을 서로 다른 지점 간 최단 경로를 찾기 위해 사용하지만 SQL 표현식으로 지정된 노드 집합에도 적용할 수 있다.
  - **maxPathLength**로 최대 에지 수를 지정할 수 있다.
  - **edgeFilter**로 조건에 맞지 않는 에지를 필터링할 수도 있다.

```scala
stationGraph.bfs.fromExpr("id = 'Townsend at 7th'"
    ).toExpr("id = 'Spear at Folsom'").maxPathLength(2).run().show(10)
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/192150937-9ceae44d-842f-4781-b887-a0d19dcca7f3.png)

<br>
<br>

## 5. 연결 요소

- **연결 요소(connected component)**는 자체적인 연결을 가지고 있지만 큰 그래프에는 연결되지 않은(undirected) 서브 그래프이다.

![image](https://user-images.githubusercontent.com/78655692/192151043-4329de00-6cf8-47ec-a82d-0430e39da0d4.png)

<br>

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

<br>

### 5.1 강한 연결 요소

- **강한 연결 요소(strongly connected component)**는 방향성이 고려된 상태로 강하게 연결된 구성 요소, 즉 내부의 모든 정점 쌍 사이에 경로가 존재하는 서브그래프이다.

```scala
val scc = minGraph.stronglyConnectedComponents.maxIter(3).run()
```


<br>
<br>
<br>
<br>

## References

[^1]: [Understanding PageRank algorithm in scala on Spark](http://www.openkb.info/2016/03/understanding-pagerank-algorithm-in.html)
[^2]: [[Algorithm] 너비 우선 탐색 (Breadth-First Search) - nomadhash](https://velog.io/@nomadhash/Algorithm-%EB%84%88%EB%B9%84-%EC%9A%B0%EC%84%A0-%ED%83%90%EC%83%89-Breadth-First-Search)