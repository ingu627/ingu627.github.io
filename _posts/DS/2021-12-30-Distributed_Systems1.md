---
layout: single
title: "분산 시스템(Distributed Systems) - Introduction (1)"
excerpt: "Distributed Systems Third edition by Maarten van Steen,
Andrew S. Tanenbaum - Introduction 1.1 ~ 1.2"
categories: DS
tag : [DS]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-01-08
---

<img align='right' width='200' height='200' src='https://user-images.githubusercontent.com/78655692/147719090-5f0942f1-1647-44ad-8d72-f11e3fe400d7.png
'>
본 글은 Distributed Systems 책의 내용을 개인 공부 목적을 위한 요약 및 정리한 내용입니다. <br> 번역보다는 직역을 통해 영문책을 이해하려다 보니 단어나 문장이 다소 어색할 수 있습니다. <br> 오타나 오류는 알려주시길 바라며, 도움이 되길 바랍니다.
{: .notice--info}

<br>
<br>
<br>
<br>


## Chapter 1. Introduction

- 1980년대에 이르러서부터 두 가지의 기술 발전이 상황을 바꾸었다.
  1. the development of `powerful microprocessors`
     - 8-bit machines -> 64-bit CPUs
     - 병령 프로그램의 적응과 발전으로 다시 직면하고 있다.
     - 가격이 1/1000으로 싸졌다.
  2. the invention of `high-speed computer networks`
  - `LAN`(; Local-area networks)은 수천 대의 기계들에게 정보들을 마이크로초 단위로 전송이 가능해졌다.
  - `WAN`(; Wide-area network)은 몇백만대의 기계들에게 아주 빠른 속도로 전송이 가능해지도록 만들었다.
- 이러한 발전으로 우리는 소형 컴퓨터 시스템을 가질수 있게 되었다. 스마트폰 또한 하나의 결과물로 볼 수 있을 것이다.
- 센서, 메모리, 강력한 CPU로 채워진 이 장치들은 본격적으로 하기에 준비가 다 된 컴퓨터 못지 않다. (네트워크 능력도 가지고 있다.)
- 그래서 `plug computer`가 등장했다.
  >A plug computer is an external device, often configured for use in the home or office as a compact computer. The name is derived from the small configuration of such devices. [^1]
- 이런 기술들의 결과로 수많은 네트워크 컴퓨터들로 구성된 컴퓨팅 시스템을 구현할 수 있게 되었다.
- 이러한 컴퓨터들은 분산되어졌는데 `distributed system`을 형성했다고 말할 수 있다.
- 이런 분산 시스템의 크기는 한 줌의 장치로부터 다양해졌다.

<br>

### 정의

- **A distributed system is a collection of autonomous computing elements that appears to its users as a single coherent system.**
  - autonomous: 혼자서 이 일을 할 수 있는
  - single coherent system : (단일 시스템) users or applications perceive a single system -> nodes need to collaborate

- **특징**
  - *1.* distributed system is a collection of computing elements
each being able to behave **independently** of each other
    - `nodes` = autonomous computing elements (하드웨어 장비나 소프트웨어 프로세스가 될 수 있다.)
    - 노드 = 컴퓨터 네트워크를 구성하는 기기 1대 [^2]
  - *2.* users (be they people or applications) believe they are dealing with **a single system**
     - single system안에서 sensor networks로 높은 성능의 메인프레임 컴퓨터들부터 작은 장치들까지 다룰 수 있다.

<br>
<br>

### 특징1. Collection of autonomous computing elements

- 현대 분산 시스템들은 높은 성능의 컴퓨터들부터 작은 plug computer까지 많은 종류의 노드들로 구성되어 있다. 
- **노드들은 서로 독립적으로 활동한다.** (그들이 서로를 무시한다 하더라도) 따라서 노드들을 같은 분산 시스템에 넣어 사용하지 않는다.
- 노드들은 공통의 목표(서로 메시지를 교환하는 것)를 달성하기 위해 프로그램화 되어있다.
  - 노드는 들어오는 메시지들(차례로 진행되는데, 메시지를 더 먼 곳까지 도달)에 반응한다.
- 독립적인 노드들을 처리하기 때문에 각 노드는 각자 고유의 시간의 알림을 가지고 있다.
  - 따라서 표준 시간(global clock)이 없다.
  - 이 시간 참조의 결점은 분산 시스템에서 기능적 동기화(synchronization)와 협력 문제(coordination)를 유발하기도 한다.
- 노드들을 집합으로 처리하는 것은 그런 집합을 관리할 필요가 있음을 암시한다.
  - 즉, 노드들이 시스템에 속하는지 아닌지 등록해야 하며, 각각의 member에게 노드들의 list(directly communicate할 수 있는)를 제공해야 한다.
- `group membership`을 관리하는 것은 admission control의 이유 때문에 매우 어려울 수 있다. 
  - 먼저 open group과 closed group를 구별해야 한다.
  - open group에서는 어떤 노드도 분산 시스템에 join하는 것을 허락해야 한다. (효율적으로 시스템에서 다른 노드에게 메시지를 전할 수 있게)
  - closed group에서는 오직 member들에서 그룹이 서로 간에 교류를 하며 분리된 기계는 노드가 그룹을 join or leave하게 시킨다.
- `admission control`의 어려움
  1. 기계는 노드를 인증해야 한다. (인증을 관리하는 것은 확장성 병목 현상을 쉽게 만들어낸다.)
  2. 각각 노드는 진짜로 다른 group member와 communicate하는데 확인해야 한다.
  3. member가 nonmember들과 쉽게 communicate하는지 고려해봐야 한다. (기밀성이 문제라면 trust issues에 직면할 수 있다.)

<br>

### overlay network

- `overlay network`
  - 이런 경우, 노드는 직접 메시지들을 보낼 수 있는 프로세스들을 갖춘 소프트웨어 프로세스이다.
  - 메시지 전달은 TCP/IP or UDP 채널을 통해 이뤄진다.
- 두 가지 type이 있다.
  - *1.* `Structured overlay` : 각 노드는 neighbor들에게 전달할 수 있게 잘 정의되어 있다. (노드들은 tree이거나 ring형으로 이뤄져 있다.)
  - *2.* `Unstructured overlay` : 각 노드는 다른 노드들을 **랜덤하게** 선택되는 많은 참조들을 가지고 있다.
- 어떤 경우든 `overlay network`는 언제나 `connected`해야 한다. (두개의 노드는 반드시 전달 통로가 있다.)
- 잘 알려진 overlay로는 `peer-to-peer` (P2P) 네트워크가 있다.

<br> 
<br> 

### 특징2. Single coherent system

- 분산시스템은 single coherent system으로 보여야 한다.
- single coherent system에서 노드들의 집합은 전체가 똑같이 작동한다. user와 system 사이에서 장소, 시간, 어떻게 작동하든지 간에
- `single coherent view`를 제공하는 것은 어려울 수 있다.
  - 마지막 user는 어떤 프로세스가 현재 실행되는지 모를 수 있다.
  - 데이터가 저장되는 위치는 중요하지 않다. 시스템은 performance를 높이기 위해 데이터를 복제하는 것도 중요하지 않다.
  - `distribution transparency`라 부른다.
- 하지만 `single coherent system`로 보이는 것은 중요한 `trade-off`이다.
  - 분산시스템은 많은 networked node로 이루어져있기 때문에 system fail이 되는 시간을 피할 수는 없다. (어떤 애플리케이션이 성공적으로 실행되면 다른 것은 정지가 되는)
  - `partial failure`들은 복잡한 시스템에 항상 발생하기 때문에 분산 시스템에서는 숨기기 어렵다.
  - "one in which the failure of a computer you didn’t even know existed can render your own computer unusable"

<br>

### Middleware and distributed systems

- 분산된 어플리케이션의 발전을 돕기 위해, 분산 시스템은 분리된 층을 가지고 운영된다.

![image](https://user-images.githubusercontent.com/78655692/148311317-8f9e4d8d-17b1-404c-8f2e-829e0cdbfa04.png)

- A distributed system organized in a middleware layer, which
extends over multiple machines, offering each application the same interface.
- 각각의 어플리케이션은 같은 인터페이스를 제공한다.
- 분산 시스템은 단일 분산 어플리케이션의 요소들이 서로 잘 전달할 수 있도록 뿐만 아니라 다른 어플리케이션들에게도 전달할 수 있게 수단을 제공한다. 
- `middleware`은 분산시스템과 같은데, 어플리케이션들에게 효과적으로 공유하고 이런 자원들을 네트워크를 가로질러 배치하는 것들을 제공하는 자원의 관리자(resource management)
  - Facilities for interapplication communication
  - Security services
  - Accounting services
  - Masking of and recovery from failures

- middleware 서비스는 네트워크 환경을 제공한다.
- 미들웨어는 요소와 기능들로 사용되는 컨테이너로 볼 수 있다. 어플리케이션들이 각각 실행되지 않게 도와주는

<br>

1. **Communication** 
  - `Remote Procedure Call (RPC)`라고 불린다. RPC 서비스는 어플리케이션에게 function을 호출한다. function이란 remote computer에서 실행되는
2. **Transactions**
   - 미들웨어로 **atomic** transaction을 참조한다.
   - 어플리케이션 개발자는 remote 서비스를 불러오는 것만 명시하면, 표준 프로토콜을 가져오게 할 수 있고 미들웨어는 모든 서비스를 불러오거나 모두 안 불러올 수 있다.
3. **Service composition**
   - Web-based middleware는 웹 서비스 접근 방식을 표준화하고 특정 순서로 함수를 생성하는 수단을 제공한다.
4. **Reliability**
   - 한 프로세스가 모든 프로세스에 의해 수신되거나 다른 프로세스가 수신되지 않도록 보장한다.
   - 이런 보장은 분산 개발을 단순화시킬 수 있다.

<br>
<br>

## 1.2 Design goals

- 분산 시스템은 자원에 쉽게 접근할 수 있도록 해야 한다.
  - 자원은 네트워크로 분산되어 있다는 사실을 숨겨야 한다.
  - `open`되어야 하고, `scalable`되어야 한다.

<br>

### Supporting resource sharing

- 분산시스템의 중요한 목표는 유저들이 remote 자원을 쉽게 접근하고 공유할 수 있도록 만들어야 한다.
  - `resources` = peripherals, storage facilities, data,
files, services, and networks
- 공유하는 것은 economics(경제성) 이유가 있다.
- 인터넷 연결은 넓게 분산된 사람들이 같이 일할 수 있도록 허용해준다. 
- 분산 시스템에서 자원 공유는 파일을 공유하는 P2P네트워크인 `BitTorrent`가 대표적인 예시이다.

<br>

### Making distribution transparent

- 분산 시스템의 중요한 목표는 프로세스와 자원이 물리적으로 분산되어 있다는 사실을 숨겨야 하는 것이다.

<br>

### Types of distribution transparency

- object : process or a resource

|Transparency| Description|
|---|---|
|Access|object가 어떻게 접근하는지 숨긴다.
|Location|object가 어디에 위치하는지 숨긴다.
|Relocation| 사용하는 동안 object가 다른 위치로 이동하는 것을 숨긴다.
|Migration| object가 다른 위치로 이동하는 것을 숨긴다.
|Replication| object가 복제되는 것을 숨긴다.
|Concurrency| object가 몇몇 사용자에게 공유되는 것을 숨긴다.
|Failure| object의 failure와 recovery를 숨긴다.

<br>

- **access transparency** 
  - 기초 레벨에서, 우리는 기계 구조가 다름을 숨기고 싶지만, 그보다 더 중요한 것은 데이터가 다른 기계 (또는 시스템)에서 잘 나타나지는 가를 보아야 한다.
- **location transparency**
  - `name`이 중요한 역할을 한다.
  - `location transparency`는 logical name을 자원에 할당함으로써 얻을 수 있으므로, name은 기밀하게 인코드되지 않는다.
  - 이러한 name의 예시로 URL(; uniform resource locator)이 있다.
  - Web은이러한 사이트는 데이터 센터에서 다른 곳에 이동되어 user는 알아차리지 못한다. (**relocation transparency**의 예시)
- **migration transparency**
  - user로부터 시작된 processes와 resources의 mobility를 제공한다. (진행되는 전달과 운영에 영향을 미치지 않고)
    - 모바일 폰 사이의 전달이 예시가 될 수 있다.
- **replication transparency**
  - 자원들은 복제한다. 1) 가용성을 늘리기 위해 또는 2) copy를 접근 가능하도록 가까이 둠으로써 성능을 향상시키기 위해 
- **concurrency transparency**
  - shared resource에 동시 접근은 해당 리소스를 일관된(consistent) 상태로 유지한다는 것이다.
  - `consistency`는 잠금을 통해 얻을 수 있는데 user는 차례로 원하는 resource에 대해 배타적인 접근을 갖게 된다.
- **failure transparency**
  - user나 application이 시스템 fail을 알아차리 못해서 일을 적절하게 수행하고 시스템은 자동적으로 failure로부터 회복한다.
  - failure를 가리는 것은 분산 시스템에서 가장 힘든 이슈 중 하나이고 때때로는 불가능도 하다.

<br>
<br>

### Degree of distribution transparency

- 분산 시스템에서 분산 투명성은 보통 선호되지만 모든 분산 측면에서 숨기는 것은 유저에게 좋지는 않다.
- 높은 transparency와 system 사이에 trade-off가 있다.
  - 다른 것을 시도하기 전에 일시적인 서버 실패를 가리는 것은 전체 시스템을 늦추게 한다.
  - 일찍 포기하는 게 더 나을 수 있다.
- 다른 예로, 몇몇을 다른 대륙에 위치한 복제들을 동시에 consistent하는 것이다.
  - 즉, 한 copy가 바뀌면, 다른 operation이 허용하기 전에 모든 copies에게 전파된다.
- `hide`보다 `expose`하는게 더 좋을 수도 있는데, 지역 기반 서비스를 사용할 때가 그 예이다.

<br>

- 결론은, distribution transparency를 분산 시스템을 설계하고 구현할 때는 좋은 목표지만, perfermance와 comprehensibility같은 다른 issue들도 고려되어야 한다. full transparency의 가격은 매우 높다.

<br>
<br>

## Being open

- `open distributed system`은 다른 시스템으로 통합된 것을 쉽게 사용할 수 있게 요소들을 제공한다.
- **Interoperability, composability, extensibility**
- open이 되기 위해서, components는 어떤 것을 제공해야될지 그것들의 문법, 의미를 설명하는 표준 규칙을 고수해야 한다.
- 일반적인 접근은 `Interface Definition Language (IDL)`를 사용하는 interface를 통해 서비스를 정의하는 것이다.
  - 그들은 기능들의 이름을 정확히 명시한다.
- 명시가 잘 되었다면, 인터페이스 정의는 임의의 프로세스를 허용한다. 그 프로세스는 특정한 인터페이스를 필요로 하는데 그것은 인터페이스를 제공하는 다른 프로세스에게 전달할 수 있는
- 적절한 specification는 complete하고 neutral이다.
  - complete의 의미는 실행하는데 필요한 모든 것이 명시되어야 한다는 것.
- completeness and neutrality are important for interoperability and portability.
- open distributed system이 되기 위해 다른 목표는 서로 다른 구성 요소로 시스템을 쉽게 구성할 수 있어야 한다.
  - 다시 말해 `extensible` 해야 한다.

<br>
<br>

### Separating policy from mechanism

- flexibility되기 위해서, 시스템이 작은 것(쉽게 대체되고 요소들이 적용가능한)들의 집합으로 구성되는 것은 중요하다.
- 웹 브라우저를 캐싱한다면 몇 가지 요소들이 고려되어야 한다.
  1. **Storage**
  2. **Exemption**
  3. **Sharing**
  4. **Refreshing**


<br>
<br>

## Being scalable

- **Scalability dimensions** (문제점)
  1. **Size scalability** : 크기에 따른 확장성
  2. **Geographical scalability** : 거리에 따른 확장성
  3. **Administrative scalability** : 관리에 따른 확장성

<br>

### Size scalability

- 시스템이 크기를 확장하고 싶을 때 풀어야할 많은 문제점들이 있다.
- user나 resource가 더 필요로 한다면 centralized services의 한계에 직면하게 된다.
  - 예를 들어, 많은 서비스들은 sense에 centralized되 있어서 그들은 분산시스템에 단일 서버로 실행된다.
  - 하지만 요청의 수가 증가하면 서버는 병목현상이 일어날 수 있다.
  - 병목현상이 될 수 있는 **3가지** 원인
    - CPU 제한으로 컴퓨터 용량
    - 저장 용량 (I/O 전송 비율도 포함)
    - user와 centralized service의 네트워크

<br>

### Geographical scalability

- 대부분의 local-area network들이 `synchronous communication`에 기반하기 때문에 기존 분산 시스템을 확장하는 것은 어렵다.

<br>

### Administrative scalability

- resource 사용, 관리, 보안과 관련된 정책들이 충돌하는 것을 해결하려는 것이 주요 문제이다.

<br>
<br>

### Scaling techniques

- 분산 시스템에서 확장성 문제는 한정된 서버와 네트워크의 용량이 원인이다.
  - 용량을 향상시키는 것을 `scaling up`이라 한다.
- `scaling out`에 의하면, 분산 시스템을 더 많은 기계들을 배치함으로써 확장하는 것은 3가지 기술이 있다. (**해결책**)
  - hiding communication latencies
  - distribution of work
  - replication

<br>

**1. Hiding communication latencies**
   - `geographical scalability`에 적용가능
   - remote-service 요청의 응답 시간을 기다리는 것을 가능한 피함
   - 어플리케이션을 요청할 때 `asynchronous communication`만을 사용
     - reply가 오면, 어플리케이션은 중단되고 이전의 발행된 요청을 끝마치기 위해 특별한 handler가 call된다.
     - `asynchronous communication`은 batch-processing system과 parallel application에 사용된다. (독립적인 task가 다른 task가 전달이 끝마치는 것을 기다리는 동안 실행이 schedule되는)
     - 새로운 thread of control이 요청을 수행하기 위해 시작된다.

![image](https://user-images.githubusercontent.com/78655692/148324936-9caec306-e236-4a63-af59-346c74cbd769.png)

- The difference between letting (a) a server or (b) a client check
forms as they are being filled.
- form을 채우는 것은 각 필드에 분리된 메시지를 보낼 수 있고, 서버로부터 승인을 기다릴 수 있다. (A)
  - 서버는 entry를 허락하기 전에 에러를 check한다.
- 더 나은 해결책은 코드를 form에 채우기 위해 옮긴 후 entry를 확인하고 client가 완성된 form을 돌려받는다. (B)
  - shipping code는 Java applets와 Javascript에 사용되고 있다.

<br>

**2. Partitioning and distribution**
   - component를 사용하는 것을 포함, 이것을 작은 부분으로 나누고 시스템에 뿌린다.
   - 예시로는 **DNS** (Internet Domain Name System)가 있다.
   - DNS name 공간은 위계쩍으로 구성되어 `domains`의 tree (겹치지 않는 zone으로 나뉘어져서)로 들어간다.
   - 각 zone의 names는 단일 name server에 의해 관리된다. 
- resolving a name means returning the network address of the
associated host.

![image](https://user-images.githubusercontent.com/78655692/148327254-5ffaa947-7436-418b-96ce-9bdcc6923834.png)

<br>

- 또 다른 예시로는 `World Wide Web`이 있다.
- Web은 거대한 document에 기반한 정보 시스템이다. (각 document는 URL 형태로 고유 name을 가지고 있다.)
- 마치 단일 서버에 있는 것처럼 보인다.
- 하지만 Web은 몇 백만의 서버를 거쳐 (각각의 서버는 많은 웹 document를 관리한다.)물리적으로 `partitioned and distributed`하다.
- document를 관리하는 서버의 name은 document의 URL로 인코드 된다.

<br>

**3. Replication**
  - 확장성의 문제로 성능 저하가 보이면 분산 시스템에서 component를 `replicate`(복제)한다.
  - `cashing`은 복제의 특별한 form이다. cashing은 자원을 복제하고  client가 자원에 접근할 수 있도록 해준다.
    - 하지만 복제와 다르게, cashing은 client의 자원에 대해 결정을 한다. (owner의 자원이 아니라)
- 하지만, cashing과 replication은 `consistency`(일관성) 문제점이 있다.
- 어느 정도까지 불일치가 허용될 수 있는지는 자원의 사용에 따라 크게 달라진다.
  - 강한 consistency의 문제점은 업데이트가 즉각적으로 다른 모든 copy들에게 전달되어야 한다는 점이다.
  - 두개의 업데이트가 동시에 진행된다면, 업데이트는 어느곳이든 똑같은 순서로 진행되어야 하는데 전역 순서에서 문제가 생긴다.
- 그래서 replication은 전역 동기화 메커니즘이 필요하다. 하지만 이런 메커니즘은 상당히 구현하기 힘들다.

<br>
<br>

### Pitfalls

- 분산 시스템을 발전시키는 것은 만만치 않은 작업임이 분명하다. 그럼에도 원칙들을 따라가다 보면 분산 시스템은 목표를 향해 분명히 발전시킬 수 있을 것이다.
- 분산 시스템은 components가 네트워크를 가로질러 분산되어 있다는 점이 기존 소프트웨어가 다르다.



<br>
<br>

## 단어 정리

- `microprocessors` : 마이크로프로세서
- `parallelism` : 병행
- `deployed` : 배치
- `miniaturization` : 소형화
- `packed with` : ~로 가득 채워진
- `full-fledged` : 본격적으로 하기에 준비가 다 된
- `less than` : 미만
- `feasible` : 실현 가능한
- `geographically` : 지리적으로
- `disperse` : 흩뜨리다
- `handful` : 한 줌
- `interconnection` : 상호 연결
- `topology` : 토폴로지
- `underlying` : 밑에 있는 
- `in turn` : 차례로 
- `dealing with` : 처리하다
- `imply` : 암시하다
- `exceedingly` : 대단히
- `distinction` : 구별
- `authenticate` : 인증하다
- `scalability` : 확장성
- `bottleneck` : 병목
- `confidentiality` : 기밀성
- `equipped with` : 갖춘
- `look up` : 찾다
- `communicate.` : 전달하다
- `intricate` : 뒤얽힌
- `opt for` : 선택하다
- `roughly` : 대충
- `take place` : 일어나다
- `spawned` : 산란
- `transparency` : 투명성
- `unify` : 하나로 하다
- `strive` : 애쓰다
- `halt` : 정지
- `inherent` : 고유의 
- `render` : 되게 하다
- `means` : 수단
- `invoke` : 호출하다
- `atomic` : 원자의
- `gluing` : 접착제
- `common` : 공통의(일반적인)
- `wealth` : 재산
- `transmission` : 전송
- `transient` : 일시적인
- `mask` : 가리다
- `propagate` : 전파하다
- `all the time` : 내내(줄곧)
- `explicit` : 명시적, 명백한, 분명한
- `comprehensibility` : 이해력
- `adhere to` : 고수하다
- `component` : 요소, 부품
- `syntax` : (컴퓨터 언어의) 문법
- `semantics` : 의미
- `arbitrary` : 임의의
- `interoperability` : 정보 처리 상호 운용
- `portability` : 휴대성, (프로그램의) 이식 가능성
- `extensible` : 확장 가능한
- `configure` : (컴퓨터의) 환경을 설정하다
- `flexibility` : 융통성, 탄력성
- `monolithic` : 단일체의, 한 덩어리로 뭉친
- `Exemption` : 면하기
- `scalable` : 확장 가능한
- `with respect to` : 에 관하여
- `Administrative` : 관리
- `span` : 걸치다, 기간
- `scaling out` : 확장
- `latencies` : 대기 시간
- `applicable` : 적용 가능한
- `asynchronous` : 비동기적
- `reply` : 대답, 대응
- `interrupted` : 중단된
- `acknowledgment` : 승인, 접수, 인정
- `involve` : 포함한다
- `hierarchically` : 위계적으로
- `nonoverlapping` : 겹치지 않는
- `resolve` : 해결하다
- `degradation` : 저하
- `performance` : 성능
- `inconsistencies ` : 불일치
- `tolearte` : 용인하다, 견디다
- `concurrently` : 동시에
- `pitfall` : 함정
- `formidable` : 가공할, 만만치 않은
- `latter` : 후자의
- `take over` : 인계받다, 더 중요해지다, ~을 대체하다
- `computational` : 컴퓨터의

<br>
<br>

## References

[^1]: <https://en.wikipedia.org/wiki/Plug_computer>
[^2]: [[네트워크] 노드(node)란? - 두더지 개발자](https://engineer-mole.tistory.com/141)