---
layout: single
title: "스파크 분산형 공유 변수: 브로드캐스트 & 누산기"
excerpt: "Spark The Definitive Guide 책을 중심으로 스파크를 요약 및 정리해보았습니다. spark 예제를 통해 분산형 공유 변수에 대해 알아봅니다."
categories: spark
tags: [스파크, spark, sql, 스칼라, scala, 정리, 의미, 란, 이란, rdd, 저수준, broadcast, accumulator, 분산형 공유 변수]
toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2022-09-26
---

<img align='right' width='150' height='200' src='https://user-images.githubusercontent.com/78655692/186088421-fe905f9e-d40f-43b2-ac6e-094e9c342473.png'>
[Spark The Definitive Guide - BIG DATA PROCESSING MADE SIMPLE] 책을 중심으로 스파크를 개인 공부를 위해 요약 및 정리해보았습니다. <br> 다소 복잡한 설치 과정은 도커에 미리 이미지를 업로해 놓았습니다. 즉, 도커 이미지를 pull하면 바로 스파크를 사용할 수 있습니다. <br><br> 도커 설치 및 활용하는 방법 : [[Spark] 빅데이터와 아파치 스파크란 - 1.2 스파크 실행하기](https://ingu627.github.io/spark/spark_db1/#12-%EC%8A%A4%ED%8C%8C%ED%81%AC-%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0) <br> 도커 이미지 링크 : [https://hub.docker.com/r/ingu627/hadoop](https://hub.docker.com/r/ingu627/hadoop) <br> 예제를 위한 데이터 링크 : [FVBros/Spark-The-Definitive-Guide](https://github.com/ingu627/BigData/tree/master/spark/data) <br> 예제에 대한 실행 언어는 SQL과 스칼라(scala)로 했습니다.
{: .notice--info}
**기본 실행 방법** <br> 1. 예제에 사용 될 데이터들은 도커 이미지 생성 후 `spark-3.3.0` 안의 하위 폴더 `data`를 생성 후, 이 폴더에 추가합니다. <br> 1.1 데이터와 도커 설치 및 활용하는 방법은 위에 링크를 남겼습니다. <br> 2. 프로그램 시작은 `cd spark-3.3.0` 후, `./bin/spark-shell` 명령어를 실행하시면 됩니다.
{: .notice--danger}

<br>
<br>
<br>

## 1. 분산형 공유 변수

- 스파크의 저수준 API에는 RDD 외에도 **분산형 공유 변수(Distributed Shared Variables)**가 있다.
- 분산형 공유 변수에는 브로드캐스트(broadcast) 변수와 어큐뮬레이터(accumulator)라는 2개의 타입이 있다.
  - **브로드캐스트 변수**를 사용하면 모든 워커 노드에 큰 값을 저장하므로 재전송 없이 많은 스파크 액션에서 재사용할 수 있다.
  - **어큐뮬레이터**를 사용하면 모든 태스크의 데이터를 공유 결과에 추가할 수 있다.
- 클러스터에서 실행할 때 특별한 속성을 가진 사용자 정의 함수에서 이 변수를 사용할 수 있다.

<br>

## 2. 브로드캐스트 변수

- **브로드캐스트 변수**는 불변성 값을 클로저(closure) 함수의 변수로 캡슐화하지 않고 클러스터에서 효율적으로 공유하는 방법을 제공한다.
- 브로드캐스트 변수는 모든 태스크마다 직렬화하지 않고 클러스터의 모든 머신에 캐시하는 불변성 공유 변수이다.
- Fig 14-1은 익스큐터 메모리 크기에 맞는 조회용 테이블을 전달하고 함수에서 사용하는 그림이다.

![image](https://user-images.githubusercontent.com/78655692/192189833-4316dfcb-4454-4732-b28e-b83c3c898cb6.png)

<br>

- 단어나 값의 목록을 가지고 있다고 가정해본다.

```scala
val myCollection = "Spark The Definitive Guide : Big Data Processing Made Simple".split(" ")
val words = spark.sparkContext.parallelize(myCollection, 2)

val supplementalData = Map("Spark" -> 1000, "Definitive" -> 200, "Big" -> -300, "Simple" -> 100)
```

<br>

- 위 구조체를 스파크에 브로드캐스트할 수 있으며,`supplementalData` 변수를 이용해 참조한다.
  - 이 값은 불변성이며 액션을 실행할 때 클러스터의 모든 노드에 지연 처리 방식으로 복제된다.

```scala
val suppBroadcast = spark.sparkContext.broadcast(supplementalData)
```

<br>

- **value** 메서드는 직렬화된 함수에서 브로드캐스트된 데이터를 직렬화하지 않아도 접근할 수 있다.
  - **직렬화(serialize)** : 어떤 데이터를 다른 곳에서 사용할 수 있게 다른 포맷의 데이터로 바꾸는 것을 의미한다. [^1]
- 스파크는 브로드캐스트 기능을 이용해 데이터를 보다 효율적으로 전송하므로 직렬화와 역직렬화에 대한 부하를 크게 줄일 수 있다.

```scala
suppBroadcast.value
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/192191275-fa5a4042-0df1-4155-8b9f-cbbb0d8f9cb1.png)

<br>

- 이제 브로드캐스트된 데이터를 사용해 RDD를 변환할 수 있다.
- 다음 예제에서는 맵 연산의 처리 과정에 따라 키-값 쌍 데이터를 생성한다.

```scala
words.map(word => (word, suppBroadcast.value.getOrElse(word, 0))
    ).sortBy(wordPair => wordPair._2
    ).collect()
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/192191477-8e6dea09-4e3e-4945-8907-398b769925a2.png)

<br>
<br>

## 3. 어큐뮬레이터

- **어큐뮬레이터(accumulator)**는 트랜스포메이션 내부의 다양한 값을 갱신하는 데 사용한다.
- 그리고 장애 허용(fault tolerance)을 보장하면서 효율적인 방식으로 드라이버에 값을 전달할 수 있다.

![image](https://user-images.githubusercontent.com/78655692/192191670-277e16fa-dbfc-4f4b-a2cd-6b84865e559e.png)

- 어큐뮬레이터는 스파크 클러스터에서 로우 단위로 안전하게 값을 갱신할 수 있는 변경 가능한(mutable) 변수를 제공한다.
- 그리고 디버깅용이나 저수준 집계 생성용으로 사용할 수 있다.
- 어큐뮬레이터는 카운터나 합계를 구하는 용도로 사용할 수 있다.
- 스파크는 기본적으로 수치형 어큐뮬레이터를 지원하며 사용자 정의 어큐뮬레이터를 만들어 사용할 수도 있다.

<br>

- 어큐뮬레이터의 값은 **액션(action)**을 처리하는 과정에서만 갱신된다.
  - 스파크는 각 태스크에서 어큐뮬레이터를 한 번만 갱신하도록 제어한다.
  - 따라서 재시작한 태스크는 어큐뮬레이터값을 갱신할 수 없다.
  - 트랜스포메이션에서 태스크나 잡 스테이지를 재처리하는 경우 각 태스크의 갱신 작업이 2번 이상 적용될 수 있다.

<br>

### 3.1 기본 예제

- 항공운항 데이터셋에 사용자 정의 집계를 수행하면서 어큐뮬레이터를 실험해본다.

```scala
case class Flight(DEST_COUNTRY_NAME: String,
                  ORIGIN_COUNTRY_NAME: String, count: BigInt)
val flights = spark.read.parquet("./data/flight-data/parquet/2010-summary.parquet"
    ).as[Flight]
```

<br>

- 이제 출발지나 도착지가 중국인 항공편의 수를 구하는 어큐뮬레이터를 생성한다.

```scala
import org.apache.spark.util.LongAccumulator

val accChina = new LongAccumulator
val accChina2 = spark.sparkContext.longAccumulator("China")

spark.sparkContext.register(accChina, "China")
```

<br>

- 다음은 어큐뮬레이터에 값을 더하는 방법을 정의하는 단계이다.
- 그리고 **foreach** 메서드를 사용해 항공운항 데이터셋의 전체 로우를 처리해본다.
  - **foreach** 메서드는 입력 DataFrame의 매 로우마다 함수를 한 번씩 적용해 어큐뮬레이터값을 증가시킨다.

```scala
def accChinaFunc(flight_row: Flight) = {
    val destination = flight_row.DEST_COUNTRY_NAME
    val origin = flight_row.ORIGIN_COUNTRY_NAME

    if (destination == "China") {
        accChina.add(flight_row.count.toLong)
    }
    if (origin == "China") {
        accChina.add(flight_row.count.toLong)
    }
}

flights.foreach(flight_row => accChinaFunc(flight_row))
```

- **실행결과**

    ![image](https://user-images.githubusercontent.com/78655692/192194798-7cf9b8a5-aae7-4f99-a505-119747050689.png)



<br>
<br>
<br>
<br>

## References

[^1]: [serialize, desserialize의 뜻 - 인프런](https://www.inflearn.com/questions/67208)