---
layout: single
title: "[논문 리뷰] MapReduce: Simplified Data Processing on Large Clusters 리뷰"
excerpt: "맵리듀스는 2004년 구글에서 발표한 빅데이터를 처리하고 생성하기 위한 프로그래밍 모델입니다. 키,값을 처리하여 중간 키,값 쌍 집합을 생성하는 map 함수와 동일한 키와 연관된 값을 merge하는 reduce 함수를 지정합니다."
categories: paper
tag : [리뷰, 논문, 정리, 설명, 란, gfs, 구글 파일 시스템, 분산, distributed, mapreduce, 맵리듀스, 개념, 정의, 원리, map, reduce, 마스터, failure, fault tolerance]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-08-11
---

![image](https://user-images.githubusercontent.com/78655692/183697704-2aeab667-34f8-4369-bb93-7f42d326e9a4.png)

"MapReduce: Simplified Data Processing on Large Clusters" 논문을 개인 공부 및 리뷰를 위해 쓴 글입니다. <br> 맵리듀스에 입문하시거나 관련 논문을 처음 보는 분을 위해 용어 설명도 덧붙였습니다. <br> 또한, MapReduce의 모든 것을 알기 위해 최대한 요약없이 논문 내용을 담았습니다. <br>
논문 출처 : <https://www.usenix.org/legacy/event/osdi04/tech/full_papers/dean/dean_html/>
{: .notice--info}

<br>
<br>
<br>

## 1. Introduction

- 입력 데이터는 보통 크고 계산은 적절한 시간 내에 끝마치기 위해 수천대의 기계들을 통해 분산되어야 한다.
- 계산을 병렬화(parallelize)하고, 데이터를 분산(distribute)하고, 장애(failure)를 처리하는 방법에 대한 이슈는 이러한 이슈를 처리하기 위해 많은 양의 복잡한 코드로 원래의 간단한 계산을 모호(obscure)하게 만든다.
- 따라서, 저자들은 수행(perform)하려고 했던 간단한 계산을 표현할 수 있지만, 라이브러리의 병렬화(parallelization), 결함 허용(fault tolerance), 데이터 분산(data distribution), 로드 밸런싱(load balancing)의 messy한 detail을 숨길 수 있는 새로운 추상화(abstraction)을 설계했다.
- 대부분의 계산에서 중간(intermediate) 키/값 쌍을 계산하기 위해 입력의 각 논리적 레코드(record)에 map 연산을 적용한 후, 파생 데이터(derived data)를 적절하게 결합하기 위해 동일한 키를 공유하는 모든 값에 reduce 연산을 적용한다.
  - map과 reduce 연산이 있는 모델을 사용하면 큰 계산을 쉽게 병렬화(parallelize)할 수 있고 재실행(re-execution)을 fault tolerance를 위한 primary 기법으로 사용할 수 있다.
  - **레코드(record)** : 데이터베이스에서 하나의 단위로 취급되는 자료의 집합. DB table에서 가로 방향으로 한 줄을 나타낸다. [^1]
  - **중간 키(intermdediate key)** : 매퍼(mapper)에 의해 생성된 키-값 쌍 [^2]

<br>
<br>

## 2. Programming Model

<img src='https://user-images.githubusercontent.com/78655692/183880867-25eba180-048a-468d-a268-5bfa867df652.png' width=600> 이미지출처 [^3]

- 계산(computation)은 입력 키/값 쌍의 세트를 취하며, 출력 키/값 쌍의 세트를 생성한다.
- 사용자 작성한 map은 입력 쌍을 가져와서 중간 키/값 쌍 세트를 생성한다.
- `MapReduce` 라이브러리는 동일한 중간 키 $I$에 연결된 모든 중간 값을 그룹화하여 reduce 함수에 전달한다.
- 이러한 값을 병합(merge)하여 더 작은 값 세트를 형성한다.
- 일반적으로 reduce 호출당 0 또는 1의 출력 값이 생성된다.
- 중간 값(intermediate value)은 반복기(iterator)를 통해 사용자 reduce 함수에 공급된다.
- 이렇게 하면 메모리에 넣을 수 없을 정도로 큰 값의 목록을 처리할 수 있다.

<br>

### 2.1 Example

- 다음은 많은 문서 모음에 있는 각 단어 빈도 수를 계산할 때의 수도 코드(pseudo-code) 예시이다.
  - `map` : 각 단어와 관련된 빈도 수를 표시해준다.
  - `reduce` : 특정 단어를 표시하는 모든 빈도수를 합한다.

```java
map(String key, String value):
 // key: 문서 이름
 // value : 문서 내용
  for each word w in value:
    EmitIntermediate(w, "1");

reduce(String key, Iterator values):
  // key: 한 단어
  // values: 빈도수의 목록
  for each v in values:
    result += ParseInt(v);
  Emit(AsString(result));
```

<br>

### 2.2 More Examples

- **Distributed Grep**
  - `map` : 제공된 패턴과 일치할 경우 라인(line)을 내보낸다.
  - `reduce` : 제공된 중간 데이터를 출력에 복사하는 식별(identity) 함수이다.
- **Count of URL Access Frequency** 
  - `map` : 웹 페이지 요청(request) 로그(log)를 처리하고 `<URL, 1>`을 출력한다.
  - `reduce` : 같은 URL인 모든 값(value)들을 더해 `<URL, total count>`로 내보낸다.
- **Reverse Web-Link Graph**
  - `map` : 각 링크에 대한 `<target, source>` 쌍을 소스 페이지에 있는 타겟 URL로 출력한다.
  - `reduce` : 지정된 타겟 URL과 연결된 모든 소스 URL 목록을 연결하고 `<target, list(source)>` 쌍을 내보낸다.
- **Term-Vector per Host**
  - 용어 벡터(term vector)는 문서내에 발생한 가장 중요한 단어를 `<word, frequency>` 리스트로 요약한다.
  - `map` : 각 입력 문서를 위한 `<hostname, term vector>` 쌍을 내보낸다.
  - `reduce` : 지정된 호스트에 대한 문서별 용어 벡터를 전달한다. 
- **Inverted Index**
  - `map` : 각 문서를 구문 분석(parse)하고, 일련의 `<word, document ID>` 쌍을 내보낸다.
  - `reduce` : 주어진 단어의 모든 쌍을 수용하고 해당 문서 ID로 정렬한 다음(sort) `<word,list(document ID)>` 쌍으로 내보낸다.
- **Distributed Sort**
  - `map` : 각 레코드로부터 키를 추출하고 `<key, record>` 쌍으로 내보낸다.
  - `reduce` : 변경되지 않는 모든 쌍을 내보낸다.

<br>
<br>

## 3. Implementation

### 3.1 Execution Overview

- map 호출은 입력 데이터를 자동으로 $M$ 분할(split) 세트로 나눠(partition) 여러 시스템에 분산된다(distributed).
- reduce 호출은 파티셔닝(partitioning)을 사용하여 중간 키 공간을 R 조각으로 파티션(partition)함으로써 분산된다(distributed).
  - 파티션 수(R)와 파티셔닝은 사용자가 지정한다.
  - **파티셔닝(partitioning)** : 데이터베이스를 여러 부분으로 분할 [^13]

<br>

![image](https://user-images.githubusercontent.com/78655692/184050804-5cb495f4-b9d8-4ddd-b374-2495b7f97819.png)

- Figure 1은 MapReduce 연산의 전반적인 흐름을 보여준다.

1. 맵리듀스 라이브러리는 입력 파일을 M개의 조각(16MB ~ 64MB)으로 분할한다. 그런 다음 클러스터에서 많은 프로그램 복사본(copy)을 시작한다.
2. 프로그램 복사본 중 master는 하나로 특별하고 나머지는 master가 일을 할당받는 worker이다. 할당할 $M$ map 태스크와 $R$ reduce 태스크 있다. master는 유후(idle) worker를 선택하고 각 worker에게 map 태스크 또는 reduce 태스크를 할당한다.
   - **태스크(task)** : 연산 단위의 실행 단위 [^9]
1. map 태스크가 할당된 worker는 해당 입력 분할(split)의 내용을 읽는다(read). 입력 데이터에서 키/값 쌍을 구문 분석(parse)하고 각 쌍을 사용자가 사용하는 map 함수로 전달한다.
   - map 함수에 의해 생성된 키/값 쌍은 메모리에 버퍼링된다(buffered).
   - **버퍼(buffer)** : 데이터를 한곳에서 다른 한곳으로 전송하는 동안 일시적으로 그 데이터를 보관하는 메모리의 영역 [^4]
   - **버퍼링(buffering)** : 버퍼를 채우는 동작을 말한다. (큐(Queue)라고도 한다.) [^4]
2. 주기적으로 버퍼링된 쌍은 파티션(partition) 함수에 의해 R 영역으로 분할된 로컬 디스크에 기록된다(write). 
3. 마스터가 reduce worker에게 이런 위치를 알려주면 RPC를 사용하여 map worker의 로컬 디스크에서 버퍼링된 데이터를 읽는다. reduce worker가 모든 중간 데이터를 읽으면(read), 중간 키별로 정렬하여 동일한 키의 모든 데이터를 그룹화한다.
   - 정렬(sorting)이 필요한 이유는 많은 다른 키가 같은 reduce 태스크에 매핑되기 때문이다.
   - 중간 데이터의 양이 너무 커 메모리에 맞지 않다면 외부 정렬(external sort)이 사용된다.
4. reduce worker는 정렬된 중간 데이터 위에 반복되며 발견된 각 고유 중간 키에 대해, 키(key)와 해당 중간 값(value) 쌍을 사용자의 reduce 함수에 전달한다.
5. 모든 map 태스크와 reduce 태스크가 완료되면 마스터가 사용자 프로그램(user program)을 깨운다.

<br>

### 3.2 Master Data Structures

- 마스터는 여러 데이터 구조를 유지한다.
- 각 map 태스크 및 reduce 태스크에 대해 `(idle, in-progress or completed)` 상태와 worker의 ID(비유휴 태스크)를 저장한다.
- 마스터는 중간 파일 영역의 위치가 map 태스크에서 reduce 태스크로 전파되는 통로이다.
- 따라서 마스터는 맵 태스크에 의해 생성된 R 중간 파일 영역의 위치와 크기를 저장한다.
- map 태스크가 완료되면 이 위치와 크기 정보가 업데이트된다.
- 이 태스크는 진행 중인 reduce 태스크를 가진 worker에게 전달된다.

<br>

### 3.3 Fault Tolerance

- MapReduce 라이브러리는 수백 또는 수천 대의 시스템을 사용하여 빅데이터를 처리할 수 있도록 설계되었기 때문에 라이브러리는 시스템 장애(failure)를 허용(tolerate)해야 한다.

### Worker Failure

- 마스터는 모든 워커(worker)에게 정기적으로 핑(ping)을 수행한다.
  - **핑(ping)** : IP 네트워크를 통해 특정한 호스트가 도달할 수 있는지의 여부를 테스트하는 데 쓰이는 컴퓨터 네트워크 도구 중 하나 [^5]
- 일정 시간 동안 워커로부터 응답이 없을 경우 마스터는 워커를 실패한 것으로 표시한다.
- 실패한 워커에 대해 진행 중인 모든 매핑(map) 태스크 또는 축소(reduce) 태스크도 유후 상태로 재설정되어 다시 예약할 수 있다.
- map 태스크가 워커 A에 의해 먼저 실행된 후 워커 B에 의해 나중에 실행되면, reduce 태스크를 실행하는 모든 워커에게 재실행이라는 알림을 받는다.
- 워커 A의 데이터를 아직 읽지 않은 모든 reduce 태스크는 워커 B의 데이터를 읽는다.
- 맵리듀스는 대규모 워커 장애(failure)에 대한 복원력(resilient)이 있다.
- 맵리듀스 마스터는 도달할 수 없는 워커 머신에 의해 수행된 태스크를 단순히 재실행하고 계속 포워드를 하며 결국 맵리듀스 태스크를 완료한다.

<br>

### Master Failure

- 마스터 연산이 죽는다면, 마지막 체크포인트 상태에서 새로운 복사본을 시작할 수 있다.
- 하지만, 현재 구현은 마스터가 실패할 경우 맵리듀스 계산을 중단한다.
- 클라이언트가 원하는 경우 이 상태를 확인하고 맵리듀스 연산을 다시 시도할 수 있다.

<br>

### Semantics in the Presence of Failures

- 맵과 리듀스가 입력 값의 결정적 함수(deterministic function)일 때, 맵리듀스의 분산 구현은 전체 프로그램의 무장애(non-fault) 순차 실행에서 생성되었을 것과 동일한 출력을 생성한다. 
  - **결정적 함수(deterministic function)** : 특정 입력 값 집합을 사용하여 호출되고 데이터베이스의 상태가 동일할 때마다 항상 동일한 결과를 반환한다. [^6]
- 이 속성을 달성하기 위해 맵의 원자 커밋(atomic commit)에 의존하고 태스크 출력을 줄인다.
  - **원자 커밋(atomic commit)** : 단일 트랜잭션 내에서 모든 데이터베이스 변경이 발생하거나 전혀 수행되지 않음을 의미한다. [^7]
  - **트랜잭션(transaction)** : 데이터베이스의 상태를 변화시키기 위해 수행하는 작업의 단위 [^8]
- 진행중인 각 태스크는 출력을 개인 임시 파일에 쓴다.
- 리듀스 태스크는 이러한 파일을 하나 생성하고, 맵 태스크는 R 파일을 생성한다.
- 맵 태스크가 완료되면 워커는 마스터에게 메시지를 발송하고 메시지에 R 임시 파일 이름을 포함한다.
- 리듀스 태스크가 완료되면 리듀스 워커는 임시 출력의 이름을 최종 출력으로 원자적으로(atomically) 변경한다.
- 동일한 리듀스 태스크가 여러 컴퓨터에서 실행될 경우 동일한 최종 출력 파일에 대해 여러 개의 이름 변경(rename) 호출이 실행된다.
- 기본 파일 시스템이 제공하는 원자 이름 변경(atomic rename) 연산에 의존하여 최종 파일 시스템 상태가 리듀스 태스크를 한 번 실행함으로써 생성된 데이터만 포함되도록 보장한다.

<br>

### 3.4 Locality
 
- 네트워크 대역폭(bandwidth)은 컴퓨팅 환경에서 상대적으로 부족한 자원이다.
  - **대역폭(bandwidth)** : 일정한 시간 내에 데이터 연결을 통과할 수 있는 정보량의 척도 [^10]
- 맵리듀스는 입력 데이터가 클러스터를 구성하는 시스템의 로컬 디스크에 저장된다는 사실을 활용하여 네트워크 대역폭을 절약한다.
- GFS는 각 파일을 64MB 블록으로 나누고 각 블록의 여러 복사본(default : 3)을 서로 다른 컴퓨터에 저장한다.
- 맵리듀스 마스터는 입력 파일의 위치 정보를 고려하고 해당 입력 데이터의 복제본이 포함된 시스템에서 맵 태스크를 스케줄하려고 시도한다.
  - 그렇지 않으면, 태스크 입력 데이터의 복제본 근처에서 맵 테스크를 스케줄하려고 시도한다.
  - **스케줄(schedule)** : 다수의 트랜잭션에 속하는 연산이 수행된 시간 순서 [^12]
- 큰 맵리듀스 작업을 실행하는 경우 대부분의 입력 데이터가 로컬로 읽히고 네트워크 대역폭을 전혀 사용하지 않는다.

<br>

### 3.5 Task Granularity

- 위에서 말했듯이, 맵 단계를 M 조각으로, 리듀스 단계를 R 조각으로 세분한다.
- 각 워커가 다양한 태스크를 수행하도록 한다면 동적 로드 밸런싱(load balancing)이 향상되고 워커가 실패할 경우 복구 속도가 빨라진다.
  - 즉, 완료된 많은 맵 태스크를 다른 모든 워커 머신에 분산시킬 수 있다. 
  - **로드 밸런싱(load balancing)** : 서버가 처리해야 할 업무 혹은 요청(Load)을 여러 대의 서버로 나누어(Balancing) 처리하는 것을 의미한다. [^11]

<br>

### 3.6 Backup Tasks

- 맵리듀스 연산에 걸리는 총 시간을 늘리는 원인 중 하나는 "straggler"인데, 이는 마지막 몇 개의 맵 중 하나를 완료하거나 계산에서 태스크를 줄이는 데 비정상적으로 오랜 시간이 걸리는 머신이다.
- 스트래글러 문제를 완화하기 위한 메커니즘으로, 맵리듀스 연산이 거의 완료되면 마스터는 나머지 진행 중인 태스크의 백업 실행을 스케줄한다.
- primary 또는 백업 실행이 완료될 때마다 태스크가 완료된 것으로 표시된다.
- 맵리듀스는 이 메커니즘을 조정하여 일반적으로 연산에 사용되는 계산 자원을 몇 퍼센트 이상 증가시키지 않도록 했다.
- 이를 통해 대규모 맵리듀스 연산을 완료하는 데 걸리는 시간이 크게 단축되었다.

<br>
<br>

## 4. Refinements

- 몇 가지 유용한 확장 기능들이 있다.

<br>

### 4.1 Partitioning Function

- 맵리듀스 사용자는 원하는 리듀스 태스크/출력 파일 수(R)를 지정한다.
- 데이터는 중간 키의 파티셔닝(partitioning)을 사용하여 이러한 태스크를 분할한다.
- `hash(key) mod R` 같은 해시를 사용하는 기본 파티셔닝 기능이 제공된다.
  - 이로 인해 파티션이 상당히 균형 있게 조정된다.
  - **해시(hash)** : 다양한 길이를 가진 데이터를 고정된 길이를 가진 데이터로 매핑한 값. 이를 이용해 특정한 배열의 인덱스나 위치나 위치를 입력하고자 하는 데이터의 값을 이용해 저장하거나 찾을 수 있다. [^14]

<br>

### 4.2 Ordering Guarantees

- 주어진 파티션 내에서 중간 키/값 쌍이 키(key) 순서로 처리됨을 보장한다.
- 순서 보증(ordering guarantee)을 통해 파티션별로 정렬된 출력 파일을 쉽게 생성할 수 있다.

<br>

### 4.3 Combiner Function

- 사용자가 네트워크를 통해 전송되기 전에 데이터의 부분 병합(partial merging)을 수행하는 optional combiner 기능을 지정할 수 있다.
- 결합(combiner) 기능은 맵 연산을 수행하는 각 머신에서 실행된다.
- 리듀스 기능과 결합 기능의 차이점은 맵리듀스 라이브러리가 기능 출력을 처리하는 방식에 있다.
  - 리듀스 출력은 최종 출력 파일에 쓰여진다.
  - 결합 출력은 중간 파일에 기록되며, 중간 파일은 리듀스 연산으로 전송된다.
  - 부분 결합(partial combining)은 특정 클래스의 맵리듀스 작업 속도를 크게 향상시킨다.

<br>

### 4.4 Input and Output Types

- 맵리듀스 라이브러리는 입력 데이터를 여러 다른 형식으로 읽을 수 있도록(reading) 지원한다.
- "text" 모드 입력은 각 줄을 키/값 쌍으로 취급한다.
  - 키 : 파일의 오프셋(offset)
  - 값 : 줄의 내용

<br>

### 4.5 Side-effects

- 일반적으로 애플리케이션은 임시 파일에 쓰고 파일이 완전히 생성되면 이 파일의 이름을 자동으로 변경(rename)한다.
- 파일 간 일관성이 요구되는 여러 출력 파일을 생성하는 작업은 **결정적(deterministic)**이어야 한다.

<br>

### 4.6 Skipping Bad Records

- 맵리듀스 라이브러리는 결정적 충돌을 일으키는 레코드를 감지하고 포워드하기 위해 이러한 레코드를 스킵할 수 있는 선택적 실행 모드(optional mode of execution)를 제공한다.
- 각 워커 프로세스는 세그먼트화 위반 및 bus 오류를 탐지하는 신호 처리기(signal handler)를 설치한다.
- 맵리듀스 라이브러리는 사용자 맵 또는 리듀스 연산을 호출하기 전에 인수의 시퀀스 번호를 전역 변수에 저장한다.
- 사용자 코드가 신호를 생성하면 신호 처리기는 시퀀스 번호가 포함된 "last gasp" UDP 패킷을 맵리듀스 마스터로 보낸다.
- 마스터가 특정 레코드에서 두 개 이상의 오류를 발견한 경우, 해당 맵 또는 리듀스 태스크의 다음 재실행할 때 레코드를 스킵한다. 

<br>

### 4.7 Local Execution

- 디버깅, 프로파일링 및 소규모 테스트를 용이하게 하기 위해 로컬 시스템에서 맵리듀스 연산에 대한 모든 작업을 순차적으로(sequentially) 실행하는 맵리듀스 라이브러리의 대체 구현을 개발했다.

<br>

### 4.8 Status Information

- 마스터는 내부 HTTP 서버를 실행하고 사용자가 사용할 상태 페이지(status pages) 세트를 내보낸다.
  - **상태 페이지**에는 완료된 작업 수, 진행 중인 작업 수, 입력 바이트, 중간 데이터 바이트, 출력 바이트, 처리 속도 등과 같은 계산 진행 상황이 표시된다.
  - **페이지**에는 각 태스크에서 생성된 표준 오류 및 표준 출력 파일에 대한 링크도 포함되어 있다.
- 사용자는 상태 페이지, 페이지같은 데이터를 사용하여 계산이 얼마나 오래 걸릴지, 그리고 더 많은 리소스를 계산에 추가해야 하는지 여부를 예측할 수 있다.
- 이 페이지들은 또한 계산 속도가 예상보다 훨씬 느린 경우를 알아내는 데 사용될 수 있다.
- 또한 최상위 상태 페이지에는 어떤 워커가 실패했는지, 워커가 실패했을 때 어떤 태스크를 처리했는지(맵, 리듀스 태스크)를 보여준다.
  - 이런 정보는 사용자 코드의 버그를 진단할 때 유용하다.

<br>

### 4.9 Counters

- 맵리듀스 라이브러리는 다양한 이벤트 발생 수를 셀 수 있는 카운터 기능을 제공한다.

```java
Counter* uppercase;
uppercase = GetCounter("uppercase");

map(String name, String contents):
  for each word w in contents:
    if (IsCapitalized(w)):
      uppercase->Increment();
    EmitIntermediate(w, "1");
```

- 개별 워커의 카운터 값은 주기적으로 마스터로 전파된다.
- 마스터는 성공적인 맵 및 리듀스 태스크에서 카운터 값을 집계하여 맵리듀스 작업이 완료되면 사용자 코드로 반환한다.
- 현재 카운터 값은 사용자가 실시간 계산의 진행 상황을 볼 수 있도록 마스터 상태 페이지에도 표시된다.
- 마스터는 카운터 값을 집계할 때 이중 계산을 방지하기 위해 동일한 맵 또는 리듀스 태스크의 중복 실행의 영향을 제거한다.

<br>
<br>
<br>
<br>

## References

[^1]: [해시넷 - 레코드](http://wiki.hash.kr/index.php/%EB%A0%88%EC%BD%94%EB%93%9C)
[^2]: [tutorialspoint - MapReduce - Quick Guide](https://www.tutorialspoint.com/map_reduce/map_reduce_quick_guide.htm)
[^3]: [[EP. 31-3] 맵리듀스(MapReduce)의 개념과 원리 - 티옌.liy](https://tyen.tistory.com/87)
[^4]: [위키백과 - 버퍼(컴퓨터 과학)](https://ko.wikipedia.org/wiki/%EB%B2%84%ED%8D%BC_(%EC%BB%B4%ED%93%A8%ED%84%B0_%EA%B3%BC%ED%95%99))
[^5]: [위키백과 - 핑](https://ko.wikipedia.org/wiki/%ED%95%91)
[^6]: [마이크로소프트 - SQL 문서 - 결정적 함수 및 비결정적 함수](https://docs.microsoft.com/ko-kr/sql/relational-databases/user-defined-functions/deterministic-and-nondeterministic-functions?view=sql-server-ver16)
[^7]: [SQLite의 원자 커밋 - Runebook.dev](https://runebook.dev/ko/docs/sqlite/atomiccommit)
[^8]: [트랜잭션이란?](https://mommoo.tistory.com/62)
[^9]: [위키백과 - 태스크](https://ko.wikipedia.org/wiki/%ED%83%9C%EC%8A%A4%ED%81%AC)
[^10]: [대역폭, bandwidth란 ? - ragnarok_code](https://velog.io/@ragnarok_code/%EB%8C%80%EC%97%AD%ED%8F%AD-bandwidth%EB%9E%80)
[^11]: [로드 밸런싱에 대해 알아보자! - 3기_파피](https://tecoble.techcourse.co.kr/post/2021-11-07-load-balancing/)
[^12]: [트랜잭션 이론 - 코타쿠](https://yeol-study-history.tistory.com/108)
[^13]: [해시넷 - 파티셔닝](http://wiki.hash.kr/index.php/%ED%8C%8C%ED%8B%B0%EC%85%94%EB%8B%9D)
[^14]: [해시넷 - 해시](http://wiki.hash.kr/index.php/%ED%95%B4%EC%8B%9C)




