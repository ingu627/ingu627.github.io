---
layout: single
title: "논문 리뷰: PowerGraph: Distributed Graph-Parallel Computation on Natural Graphs"
excerpt: "PowerGraph는 Gather, Apply, Scatter 기능을 구현하여 그래프 처리를 하는 방법을 제안했습니다. large scale graph processing 분야에서 꼭 읽어봐야 할 논문 중 하나라고 생각됩니다."
categories: paper
tags : [리뷰, 논문, 정리, 설명, 란, 뜻, gas, 그래프, 처리, 캐시, vertex, edge, cut, partitioning, powergraph, pregel, graphlab]
toc: true
toc_sticky: false
sidebar_main: false

last_modified_at: 2022-10-21
---

![image](https://user-images.githubusercontent.com/78655692/194746413-0494aaf8-179e-4244-a388-f3baf1a8f915.png)

"PowerGraph: Distributed Graph-Parallel Computation on Natural Graphs" 논문을 개인 공부 및 리뷰를 위해 쓴 글입니다. <br><br>
논문 출처 pdf : [PowerGraph paper](https://www.usenix.org/conference/osdi12/technical-sessions/presentation/gonzalez)
{: .notice--info}

<br>
<br>
<br>

## 1. Introduction

- 그래프 병렬 추상화(abstraction)는 작은 이웃을 갖는 각 버텍스에 의존하여 병렬성을 최대화하고 효과적인 파티셔닝을 통해 통신을 최소화한다.
- 그러나 소셜 네트워크 및 웹과 같은 실제 현상에서 기인하는 그래프에는 일반적으로 **멱법칙(power law)** 차수(degree) 분포가 있다.
  - 이는 버텍스의 작은 서브셋(subset)이 그래프의 큰 부분에 연결됨을 의미한다.
  - 멱법칙 그래프는 파티셔닝하기 어렵고 분산 환경에서 표현하기 어렵다.
- **PowerGraph**는 멱법칙 그래프 계산의 문제를 해결하기 위해 버텍스 프로그램의 구조를 활용하고, 버텍스 대신 에지에 대한 계산을 명시적으로 도입한다.
- 결과적으로 PowerGraph는 훨씬 더 큰 병렬 처리를 제공하고 네트워크 통신 및 저장 비용을 줄이며 분산 그래프 배치에 대해 효과적인 접근 방식을 제공한다.

<br>
<br>

## 2. Graph-Parallel Abstractions

- 그래프 병렬 추상화는 **희소(sparse) 그래프** $G=\{V,E\}$와 버텍스 $v\in V$에서 병렬로 실행되고 이웃 인스턴스 $Q(u)$와 상호작용할 수 있는 **버텍스 프로그램** $Q$로 구성된다.

<br>

### 2.1 Characterization

- **GAS** 모델은 버텍스 프로그램의 세 가지 개념적 단계인 Gather, Apply 및 Scatter를 나타낸다.
- **수집(gather)** 단계에서 인접 버텍스 및 에지에 대한 정보는 $Q(u)$가 실행되는 버텍스 $u$의 이웃에 대한 합계를 통해 수집된다.
  - $\sum \leftarrow\bigoplus_{v\in Nbr[u]}g(D_u,D_{(u,v)},D_v)$ 
- 결과값 $\sum$은 **적용(apply)** 단계에서 central 버텍스 값을 업데이트하는 데 사용된다.
  - $D_u^{new}\leftarrow a(D_u,\sum)$
- 마지막으로 **분산(scatter)** 단계는 central 버텍스의 새로운 값을 사용하여 인접한 에지의 데이터를 업데이트한다.
  - $(D_{(u,v)})\leftarrow s(D_u^{new},D_{(u,v)},D_v)$

<br>

- **Pregel** 추상화에서 Gather 단계는 메시지 컴바이너(combiner)를 사용하여 구현되고, Apply 및 Scatter 단계는 버텍스 프로그램에서 표현된다.
- **GraphLab**은 전체 이웃을 버텍스 프로그램에 노출하고 사용자가 프로그램 내에서 Gather 및 Apply 단계를 정의할 수 있도록 한다.
- **GraphLab** 추상화는 버텍스 또는 에지 데이터에 대한 변경 사항이 인접한 버텍스에 자동으로 표시되도록 하여 Gather/Scatter 단계의 통신 측면을 암시적으로 정의한다.

<br>
<br>

## 3. Challenges of Natural Graphs

- 그래프의 희소성(sparsity) 구조는 효율적인 분산 그래프 병렬 계산에 대한 고유한 문제를 나타낸다.
- 그래프의 특징 중 하나는 왜곡된(skewed) 멱법칙 차수 분포이다.
- 대부분 버텍스에는 이웃이 비교적 적고 소수에는 많은 이웃이 있다. (ex. 소셜 네트워크의 유명인)
- 멱법칙 차수 분포에서 버텍스가 차수 $d$를 가질 확률은 다음과 같이 주어진다.
  - $P(d)\propto d^{-\alpha}$
- Fig 1에서 트위터 팔로워 네트워크의 인/아웃 정도 분포를 시각화하여 특징적인 선형 멱법칙 형식을 보여준다.

![image](https://user-images.githubusercontent.com/78655692/194817355-4cacbd6a-3a08-4e07-b207-563ec79ab1d7.png)

<br>

- **Work Balance**
  - 멱법칙 차수 분포는 버텍스를 대칭적으로 처리하는 그래프 병렬 추상화에서 상당한 작업 불균형을 초래할 수 있다.
- **Partitioning**
  - 그래프의 경우 GraphLab과 Pregel 모두 매우 열악한 지역성(locality)을 갖는 해시 기반 (임의) 분할에 의존해야 한다.
- **Communication**
  - 그래프의 변향된 차수 분포는 통신 비대칭으로 이어져 결과적으로 병목 현상이 발생한다.
- **Storage**
  - 그래프 병렬 추상화는 각 버텍스에 대한 인접 정보를 로컬에 저장해야 하므로 각 버텍스에는 해당 차수의 선형 메모리가 필요하다.

<br>
<br>

## 4. PowerGraph Abstraction

- PowerGraph는 멱법칙 그래프에서 계산의 문제를 해결하기 위해 GAS 분해를 직접 이용하여 에지에 걸쳐 버텍스 프로그램을 팩토링(factoring, 인수분해)하여 차수 의존성을 제거한다.
- PowerGraph는 고도로 병렬화된 대량 동기 Pregel 계산 모델과 계산 효율적인 비동기 GraphLab 계산 모델을 모두 지원한다. 

<br>

### 4.1 GAS Vertex-Programs

![image](https://user-images.githubusercontent.com/78655692/194825045-09b0877e-6998-4d5d-aa1e-ec4d47c34646.png)

- PowerGraph 추상화의 계산은 **GASVertexProgram** 인터페이스를 구현하는 stateless 버텍스 프로그램으로 인코딩되므로 gather, sum, apply, scatter 기능을 명시적으로 고려한다. (Fig 2)
- 각 기능은 Alg 1의 의미론에 따라 PowerGraph 엔진에 의해 단계적으로 호출된다.
- 버텍스 프로그램을 팩토링함으로써 PowerGraph 실행 엔진은 단일 버텍스 프로그램을 여러 시스템에 배포하고 계산을 데이터로 이동할 수 있다.
- Gather 단계에서 gather 및 sum 함수는 버텍스의 이웃에 대한 정보를 수집하기 위해 맵(map) 및 리듀스(reduce)로 사용된다.
- gather 함수는 $u$에 인접한 에지에서 병렬로 호출된다.
- 특정 에지 셋은 none, in, out 또는 all이 될 수 있는 gather nbrs에 의해 결정된다.
- gather 함수는 인접한 버텍스와 에지에 대한 데이터를 전달하고 임시 어큐뮬레이터(accumulator)를 반환한다.
- 결과는 가환(commutative) 및 연관(associative) 합계 연산을 사용하여 결합된다.
- Gather 단계의 최종 결과 $a_u$는 Apply 단계로 전달되고 PowerGraph에 의해 캐시된다.

<br>

- Gather 단계가 완료된 후, Apply 기능은 최종 어큐뮬레이터를 사용하여 그래프에 원자적으로 다시 기록되는 새 버텍스 값 $D_u$를 계산한다.
- Scatter 단계 동안 Scatter 함수는 $u$에 인접한 에지에서 병렬로 호출되어 데이터 그래프에서 다시 기록되는 새 에지 값 $D_{(u,v)}$를 생성한다.
- Scatter 함수는 인접한 버텍스에 대해 캐시된 어큐뮬레이터 $a_v$를 동적으로 업데이트하는 데 사용되는 optional 값 $\Delta a$를 반환한다.

<br>

- Fig 3 에서 PowerGraph 추상화를 사용하여 PageRank, Greedy Graph Coloring, Single Source Shortest Path(SSSP) 알고리즘을 구현한다.

![image](https://user-images.githubusercontent.com/78655692/194833499-5ef20d46-dbba-45ad-b23a-6b0477dfd124.png)

<br>

### 4.2 Delta Caching

- PowerGraph 엔진은 각 버텍스에 대해 이전 Gather 단계에서 어큐뮬레이터 $a_u$의 캐시를 유지한다.
- Scatter 함수는 sum 함수를 사용하여 이웃 버텍스 $v$의 캐시된 어큐뮬레이터 $a_v$에 원자적으로 추가되는 추가 $\Delta a$를 선택적으로 반환할 수 있다.
- $\Delta a$가 반환되지 않으면 이웃의 캐시된 $a_v$가 지워져 버텍스 $v$에서 버텍스 프로그램의 후속 실행에 대한 완전한 Gather가 강제 실행된다.

<br>
<br>

## 5. Distributed Graph Placement

- PowerGraph 추상화는 계산 상태를 저장하고 버텍스 프로그램 간의 상호 작용을 인코딩하기 위해 분산 데이터 그래프에 의존한다.
- 데이터 그래프 구조와 데이터의 배치는 통신을 최소화하고 작업 균형을 유지하는 데 중심적인 역할을 한다.
- p 머신의 클러스터에 그래프를 배치하는 일반적인 접근 방식은 balanced p-way edge-cut을 구성하는 것이다. 
  - 여기서 버텍스는 머신에 고르게 할당되고 머신에 걸쳐 있는 에지의 수는 최소화된다.
- 하지만, balanced 에지 컷을 구성하는 도구는 멱법칙 그래프에서 성능이 좋지 않다.
- 그래프를 파티셔닝하기 어려운 경우 GraphLab과 Pregel 모두 해시 버텍스 배치에 의존한다.

<br>

![image](https://user-images.githubusercontent.com/78655692/194844290-20f1a658-913d-407a-86cb-ab7fb2f9f720.png)

- 모든 컷 에지는 스토리지 및 네트워크 오버헤드에 기여한다.
- 두 시스템 모두 인접 정보의 복사본을 유지하고 경우에 따라 버텍스 및 에지 데이터의 **고스트(로컬 복사본)**를 유지하기 때문이다.
- 예를 들어 Fig 4(a)에서 4개의 버텍스 그래프의 3방향 에지 컷을 구성하여 5개의 고스트 버텍스와 모든 에지 데이터가 복제되도록 한다.
  - 컷 에지와 관련된 버텍스 및 에지 데이터에 대한 모든 변경 사항은 네트워크에서 동기화되어야 한다.

<br>

### 5.1 Balanced p-way Vertex-Cut

![image](https://user-images.githubusercontent.com/78655692/194845518-782f73b2-2a3d-41e0-9364-87ed19981604.png)

- 그래프의 에지를 따라 버텍스 프로그램을 팩토링하여 PowerGraph 추상화를 사용하면 단일 버텍스 프로그램이 여러 시스템에 걸쳐 있을 수 있다.
- Fig 5에서 단일 고차 버텍스 프로그램은 Gather 및 Scatter 기능이 각 머신에서 병렬로 실행되고 어큐뮬레이터 및 버텍스 데이터가 네트워크를 통해 교환되는 두 머신으로 분할되었다.
- PowerGraph 추상화를 통해 단일 버텍스 프로그램이 여러 시스템에 걸쳐 있을 수 있으므로 시스템에 에지를 고르게 할당하고 버텍스가 시스템에 걸쳐 있도록 함으로써 작업 균형을 개선하고 통신 및 스토리지 오버헤드를 줄일 수 있다.
- 각 머신은 해당 머신에 할당된 에지에 대한 에지 정보만 저장하고 방대한 양의 에지 데이터를 고르게 배포한다.
- 각 에지는 정확히 한 번만 저장되기 때문에 에지 데이터의 변경 사항을 전달할 필요가 없다.
- 그러나 버텍스에 대한 변경 사항은 해당 버텍스에 걸쳐 있는 모든 시스템에 복사되어야 하므로 스토리지 및 네트워크 오버헤드는 각 버텍스에 걸쳐 있는 시스템 수에 따라 달라진다.
- 각 버텍스에 걸쳐 있는 머신의 수를 제한하여 스토리지 및 네트워크 오버헤드를 최소화한다.
- Balanced p-way 버텍스 컷은 각 모서리 $e\in E$를 머신 $A(e)\in \{1,...,p\}$에 할당함으로써 이런 목표를 공식화한다.

<br>

- 목표는 그래프의 평균 복제본 수를 최소화하고 결과적으로 PowerGraph 엔진의 총 스토리지 및 통신 요구 사항을 최소화한다.
- 여러 복제본이 있는 각 버텍스 $v$에 대해 복제본 중 하나가 버텍스 데이터의 마스터 버전을 유지 관리하는 마스터로 무작위로 지정된다.
- $v$의 나머지 모든 복제본은 미러(mirror)가 되며 버텍스 데이터의 로컬 캐시 읽기 전용 복제본을 유지 관리한다. (Fig 4(b))
  - Fig 4(b)에서 2개의 미러만을 생성하는 그래프의 3방향 버텍스 컷을 구성한다.
  - 버텍스 데이터에 대한 모든 변경 사항(ex. Apply 기능)은 마스터에 적용되어야 하며 이는 모든 미러에 즉시 복제된다.

<br>

- 버텍스 컷은 멱법칙 그래프의 에지 컷과 관련된 주요 문제를 해결한다.
- **침투 이론(Percolation theory)**은 멱법칙 그래프가 좋은 버텍스 컷을 가지고 있다고 제안한다.
- 직관적으로 매우 높은 차수 버텍스의 작은 부분을 자르면 그래프를 빠르게 산산조각낼 수 있다.
- 또한 균형 제약 조건은 에지가 머신에 균일하게 분포되도록 하기 때문에 매우 높은 차수의 버텍스가 있는 경우에도 자연스럽게 개선된 작업 균형을 달성한다.
- 버텍스 컷을 구성하는 가장 간단한 방법은 에지를 머신에 무작위로 할당하는 것이다.
- 임의(해시) 에지 배치는 완전히 데이터 병렬이며 큰 그래프에서 거의 완벽한 균형을 달성하며 스트리밍 설정에 적용할 수 있다.



<br>
<br>
<br>
<br>

## References


