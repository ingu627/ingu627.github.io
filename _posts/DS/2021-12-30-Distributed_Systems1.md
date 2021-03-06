---
layout: single
title: "분산 시스템(Distributed Systems) - 1. Introduction"
excerpt: "Distributed Systems Third edition by Maarten van Steen,
Andrew S. Tanenbaum - cha1. Introduction 1.1, 1.2, 1.3, 1.4"
categories: DS
tag : [DS, 분산 시스템, 확장성, 투명성, 미들웨어, 컴퓨팅, 그리드, 클러스터, 클라우드, 인터페이스, 센서]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-01-24
---

<img align='right' width='200' height='200' src='https://user-images.githubusercontent.com/78655692/147719090-5f0942f1-1647-44ad-8d72-f11e3fe400d7.png
'>
본 글은 Distributed Systems 책의 내용을 개인 공부 목적을 위한 요약 및 정리한 내용입니다. <br> 번역보다는 직역을 통해 영문책을 이해하려다 보니 단어나 문장이 다소 어색할 수 있습니다. <br>  영어문장에 맞게 최대한 이해하려 했습니다. 가지치기($\nearrow$)로 꾸며주는 말을 따로 빼서 육하원칙, 지칭 등을 넣어 해석했습니다. <br>오타나 오류는 알려주시길 바라며, 도움이 되길 바랍니다.
{: .notice--info}

**글을 읽으면서 스스로에게 물어보기 <br><br> 1. 왜 만들어 졌을까?(background, def) <br> 2. 왜 필요할까? (why?) <br> 3. 장점과 단점은 무엇인가? (adv, disadv)**
{: .notice--danger}

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
  - `LAN`(; Local-area networks)으로 빌딩 안의 수천대의 장비들에게 정보를 마이크로초 단위로 전송이 가능해졌다. (공유기가 그 예)
  - `WAN`(; Wide-area network)로 몇백만대의 시스템들이 연결되어 bps 속도로 전송이 가능해졌다.
- 이러한 발전으로 우리는 소형 컴퓨터 시스템을 가질수 있게 되었다. 스마트폰 또한 하나의 결과물로 볼 수 있을 것이다.
- 센서, 메모리, 강력한 CPU로 채워진 이 장치들은 본격적으로 하기에 준비가 다 된 컴퓨터 못지 않다. (네트워크 능력도 가지고 있다.)
- 그래서 `plug computer`가 등장했다.
  > A plug computer is an external device, often configured for use in the home or office as a compact computer. The name is derived from the small configuration of such devices. [^1]
- 이런 기술들의 결과로 수많은 네트워크 컴퓨터들로 구성된 컴퓨팅 시스템을 구현할 수 있게 되었다. 이런 컴퓨터들은 지리적으로 분산되어졌는데 `distributed system`을 형성했다고 말할 수 있다.
- 이런 분산 시스템의 크기는 한 줌의 장치로부터 다양해졌다.
  - **시스템 (system)** : 하나의 공통적인 목적 수행을 위해 조직화된 요소들의 집합체 또는 체계 [^10]

<br>

### What is a distributed system?

- **A distributed system is a collection of autonomous computing elements that appears to its users as a single coherent system.**
  - autonomous: 독립적으로 작동할 수 있는
  - single coherent system : (단일 시스템) users or applications perceive a single system -> nodes need to collaborate

- **특징**
  - *1.* distributed system is a collection of computing elements
each being able to behave **independently** of each other
    - `nodes` = 독립적으로 움직이는 컴퓨팅 요소들 (하드웨어 장비나 소프트웨어 프로세스가 될 수 있다.)
    - **노드** = 컴퓨터 네트워크를 구성하는 기기 1대 [^2]
      - 독립적으로 작동하는 기기
      - 네트워크 또는 데이터 구조를 구성하는 각각의 객체
    - **네트워크**(network) : 한 컴퓨터에서 다른 컴퓨터로 시그널(메시지)을 보내는 것
    - **라우팅**(routing) : 네트워크 상의 주소를 이용, 목적지까지 경로를 체계적으로 결정하는 경로선택 과정 (어떻게 보낼지 담당하는 역할) [^3]
  - *2.* users (be they people or applications) believe they are dealing with **a single system**
    - 하나 또는 다른 독립적인 노드들이 협업을 필요함을 의미.
    - 단일 시스템에서 노드들은 고성능 메인프레임 컴퓨터부터 센서 네트워크의 작은 장치들까지 다양하다.

<br>
<br>

### 특징1. Collection of autonomous computing elements

- 현대 분산 시스템은 높은 성능의 컴퓨터들부터 작은 플러그 컴퓨팅까지 많은 종류의 노드들로 구성되어 있다. 
- **노드들은 서로 독립적으로 작동한다.** (서로를 무시한다 하더라도) 따라서 노드들을 같은 분산 시스템에 넣어 사용하지 않는다.
- 노드들은 공동의 목표를 달성하기 위해 프로그램화 되어있다. $\nearrow$ (공동의 목표는) 메시지를 서로 교환하는 것을 구현하는 것 
  - 노드는 들어온 메시지에 반응하고, 처리하고, 메시지 전달을 통해 더 많은 통신으로 유도한다.
- 각 노드는 각자 고유의 시간의 알림을 가지고 있다.
  - 따라서 **표준 시간**(global clock)이 없다.
  - 이 시간 참조의 결점은 분산 시스템에서 기능적 동기화(`synchronization`)와 조정 문제(`coordination`)를 유발하기도 한다.
- 노드들을 집합으로 처리하는 것은 그런 집합을 관리할 필요가 있음을 암시한다.
  - 즉, 노드들이 시스템에 속하는지 아닌지 등록해야 하며, 각각의 멤버에게 노드들의 리스트(직접 전달할 수 있는)를 제공해야 한다.
- `group membership`을 관리하는 것은 승인 제어(`admission control`)의 이유 때문에 매우 어려울 수 있다.
  - 먼저 open group과 closed group를 구별해야 한다.
  - open group에서는 어떤 노드도 분산 시스템에 join하는 것을 허락해야 한다. (효율적으로 시스템에서 다른 노드에게 메시지를 전할 수 있게)
  - closed group에서는 이미 원래 멤버 서로 통신할 수 있고, 그 그룹에 합류와 떠나는 것에는 별도의 메커니즘이 필요하다.
- 승인 제어(`admission control`)의 어려움
  1. 노드를 인증하기 위한 메커니즘이 필요하다. (인증을 관리하는 것은 확장성 병목 현상을 쉽게 만들어낸다.)
  2. 각각 노드는 다른 그룹 멤버와 실제로 통신하는지 확인해야 한다.
  3. 멤버가 nonmember에게 쉽게 전달하는지 고려(분산 시스템에서 통신 이슈에 대해 신뢰성을)해봐야 한다. (메시지 유출 가능성을 따져본다.)

<br>

### overlay network

- 분산시스템은 종종 오버레이 네트워크(`overlay network`)로 구성된다.
  - **오버레이 네트워크** : 물리 네트워크 위에 성립되는 가상의 컴퓨터 네트워크
    - P2P 네트워크와 같은 분산 시스템은 노드가 인터넷 상에서 실행되기 때문에 오버레이 네트워크에 해당한다. [^4]
- 이런 경우, 노드는 직접 메시지를 보낼 수 있는 소프트웨어 프로세스이다.
- 메시지 전달은 TCP/IP or UDP 채널을 통해 이뤄진다.
  - **TCP (Transmission Control Protocol)** : 신뢰성이 요구되는 애플리케이션에서 사용
  - **UDP (User Dtagram Protocol)** : 간단한 데이터를 빠른 속도로 전송하는 애플리케이션에서 사용
  - **애플리케이션 (application)** : 다양한 범주의 정보처리 기능(컴퓨팅 작업) [^5]
- 두 가지 유형이 있다.
  - *1.* **Structured overlay** : 각 노드는 통신할 수 있는 잘 정의된 인접 노드 집합이 있다. (노드들은 tree이거나 ring형으로 이뤄져 있다.)
  - *2.* **Unstructured overlay** : 각 노드는 다른 노드들을 **랜덤하게** 선택되는 많은 참조를 가지고 있다.
- 어떤 경우든 `overlay network`는 언제나 연결돼야 한다. $\nearrow$ (구체적으로) 두개의 노드 간에는 반드시 통신 통로가 있다. $\nearrow$ (통신 통로에 대해) 이런 노드들이 서로 메시지를 전송하게 허용하는 
- 잘 알려진 오버레이로는 `peer-to-peer` (P2P) 네트워크가 있다.

<br> 
<br> 

### 특징2. Single coherent system

- 분산시스템은 single coherent system으로 보여야 한다.
- single coherent system에서 노드들의 집합은 사용자와 시스템 사이에서 장소, 시간, 어떻게 작동하든지 간에 전체가 똑같이 작동한다.
- `single coherent`로 보이는 것은 어려울 수 있다.
  - end user(=최종 사용자)는 어떤 프로세스가 현재 실행되는지 몰라야 한다.
    - **프로세스**(process) : 현재 실행 중인 프로그램
  - 데이터가 저장되는 위치는 문제가 되지 않아야 한다. 시스템은 성능을 높이기 위해 데이터를 복제할 수도 있다는 것도 문제가 되지 않아야 한다.
    - 이것을 `distribution transparency`(분산 투명성) 라 부른다.
    - 이것은 리소스는 통합 파일 시스템 인터페이스(파일이나, 저장 장치, 메모리, 네트워크 사이의 차이를 효과적으로 숨겨주는)를 통해 접근한다는 유닉스의 운영시스템과 비슷한 접근이다.
      - **인터페이스**(interface) : 연결을 의미 (a와 b를 연결)
      - **인터페이스** : 서로 다른 두 개의 시스템, 장치 사이에서 정보나 신호를 주고받는 경우의 접점이나 경계면
        - 사용자가 기기를 쉽게 동작시키는데 도움을 주는 시스템
        - 컴퓨팅에서 컴퓨터 시스템끼리 정보를 교환하는 공유 경계
- 하지만 `single coherent system`로 되게 하는 건 `trade-off`이다.
  - 분산시스템은 많은 네트워크 노드로 이루어져있기 때문에 시스템 고장을 피할 수는 없다. (어떤 애플리케이션이 성공적으로 실행되면 다른 것은 정지가 되는)
  - `partial failure`은 복잡한 시스템에서 항상 발생하기 때문에 분산 시스템에서는 숨기기 어렵다.
  - "one in which the failure of a computer you didn’t even know existed can render your own computer unusable"

<br>
<br>

### Middleware and distributed systems

- 분산된 애플리케이션의 발전을 돕기 위해, 분산 시스템은 분리된 계층을 가지며 구성된다. $\nearrow$ (분리된 계층이란) 논리적으로 각각의 컴퓨터의 운영체제 위에 위치한
  - **애플리케이션**(application) : 운영체제 위에서 사용자가 직접 사용하게 되는 소프트웨어 [^6]

<br>

![image](https://user-images.githubusercontent.com/78655692/150115611-ca99401f-fcc2-43d0-8d53-ac9baa31aeb6.png)

<br>

- 각각의 애플리케이션은 같은 인터페이스를 제공한다.
- 분산 시스템은 수단을 제공한다. $\nearrow$ (어떤 수단?) 단일 분산 애플리케이션의 컴포넌트들이 서로 통신할 뿐만 아니라, 서로 다른 애플리케이션 간의 통신을 허용하는
  - **컴포넌트 (component)** : 하나의 기능을 하는 단위 (내부를 이루는 모든 요소)
  - **컴포넌트 (component)** : 여러 개의 프로그램 함수들을 모아 하나의 특정한 기능을 수행할 수 있도록 구성한 작은 기능적 단위 [^7]
- 동시에, 이것은 각각 애플리케이션으로부터 하드웨어와 운영체제의 차이를 가능한 숨긴다.
- 어떤 맥락에선 미들웨어는 분산시스템과 같다. $\nearrow$ (그리고 같은 것은) 운영체제가 컴퓨터에 미치는 영향 또한 : 리소스의 관리자 $\nearrow$ (어떤?) 애플리케이션들에게 효과적으로 공유하고 이런 리소스들을 네트워크를 배포하는 것을 제공하는
  - **미들웨어 (middleware)** : 서로 다른 여러 프로그램을 함께 운용할 수 있는 소프트웨어
- 리소스 관리자 뿐만 아니라 대부분 운영체제에서 볼 수 있는 서비스도 제공한다. 다음은 항목들
  1. Facilities for interapplication communication
  2. Security services
  3. Accounting services (회계 : 컴퓨터 자원에 대한 사용 기록)
  4. Masking of and recovery from failures

- 운영체제와 다른점으로, 미들웨어 서비스는 네트워크 환경을 제공한다. 
- 어떤 의미에선, 미들웨어를 컴포넌트와 함수들을 공통적으로 사용하는 컨테이너로 볼 수 있다. $\nearrow$ (함수들은) 더이상 애플리케이션 각각에 의해 구현되지 않음 
- 미들웨어는 컴포넌트와 기능들로 사용되는 컨테이너(애플리케이션들이 각각 실행되지 않게 도와주는)로 볼 수 있다. 
- 이같은 미들웨어 서비스의 예시들

  1. **Communication** 
     - `Remote Procedure Call (RPC)`라고 불린다. **RPC 서비스**를 사용하면 애플리케이션(=응용 프로그램)에서 함수를 호출할 수 있다. $\nearrow$ (함수는) 원격 컴퓨터에서 구현되고 실행되는 $\nearrow$ (어떻게 구현?) 마치 지역적으로 가능한 것처럼
       - **원격 프로시저 호출 (RPC)** : 별도의 원격제어를 위한 코딩 없이 다른 주소 공간에서 함수나 프로시저를 실행할 수 있게 하는 프로세스간 통신 기술
         - 원격 프로시저 호출을 이용하면 프로그래머는 함수가 실행 프로그램에 로컬 위치에 있든 원격 위치에 있든 동일한 코드를 이용할 수 있다. [^8]
  2. **Transactions**
     - 미들웨어로 **원자성 (atomic) 트랜잭션 (transaction)**을 참조한다.
       - **트랜잭션 (transaction)** : 쪼갤 수 없는 업무 처리의 최소 단위
     - 애플리케이션 개발자는 원격 서비스를 불러오는 것만 명시하면, 표준 프로토콜을 가져오게 할 수 있고 미들웨어는 모든 서비스를 불러오거나 모두 안 불러올 수 있다.
  3. **Service composition**
     - 웹기반 미들웨어는 방식을 표준화함으로써 도와준다. $\nearrow$ (어떤 방식?) 웹 서버가 접근되고 수단을 제공하는 $\nearrow$ (어떤 수단?) 특정 순서에 있는 그들의 함수들을 생성하기 위한
  4. **Reliability**
     - 한 프로세스가 모든 프로세스에 의해 수신되거나 다른 프로세스가 수신되지 않도록 보장한다.
     - 이런 보장은 분산 애플리케션 개발을 단순화시며, 미들웨어의 한 부분으로 구현된다.

<br>
<br>

## 1.2 Design goals

- 분산 시스템은 자원에 쉽게 접근할 수 있도록 해야 한다.
  - 자원은 네트워크를 통해 분산되어 있다는 사실을 숨겨야 한다.: `open`되어야 하고, `scalable`되어야 한다.

<br>
<br>

### Supporting resource sharing

- 분산시스템의 중요한 목표는 유저들이 원격 리소스를 쉽게 접근하고 공유할 수 있도록 만들어야 한다.
  - **리소스(resources)** = peripherals, storage facilities, data,
files, services, and networks (사용될 수 있는 어떤 항목)
- 자원을 공유하는 것은 economics(경제성) 이유에 있다.
- 인터넷 연결은 넓게 분산된 사람들이 같이 일할 수 있도록 허용해준다. 
- 분산 시스템에서 자원 공유는 파일을 공유하는 P2P네트워크인 `BitTorrent`가 대표적인 예시이다.

<br>
<br>

### Making distribution transparent

- 분산 시스템의 중요한 목표는 프로세스와 자원이 다중 컴퓨터를 통해 물리적으로 분산되어 있다는 사실을 숨겨야 하는 것이다.

<br>
<br>

### Types of distribution transparency

- **객체 (object)** : process or a resource

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
  - 데이터 표현과 객체가 접근하는 방식를 숨긴다.
- **location transparency**
  - 이름은 위치 투명성을 얻는데 중요한 역할을 한다.
  - `location transparency`는 논리적 이름을 리소스에 할당함으로써 얻을 수 있다. 
    - 이러한 이름의 예시로 URL(; uniform resource locator)이 있다.
  - Web은이러한 사이트는 데이터 센터에서 다른 곳에 이동되어 사용자는 알아차리지 못한다. (**relocation transparency**의 예시)
- **migration transparency**
  - 프로세스와 리소스의 이동성을 제공한다. $\nearrow$ (어떻게 제공?) 진행되는 전달과 운영에 영향을 미치지 않고
    - 모바일 폰 사이의 전달이 예시가 될 수 있다.
- **replication transparency**
  - 자원들이나 프로세스들의 복제품을 복제하여 숨긴다. $\nearrow$ (왜?) 다른 고장을 대체하기 위해
  - 1) 가용성을 늘리기 위해 또는 2) copy를 접근 가능하도록 가까이 둠으로써 성능을 향상시키기 위해
- **concurrency transparency**
  - 각 유저는 알아차리지 못한다. $\nearrow$ (어떻게?) 다른 사람이 같은 자원을 쓰고 있는지에 대해
  - 공유 자원의 동시 접근은 해당 자원을 일관된(consistent) 상태로 유지한다는 것이다.
- **failure transparency**
  - 유저나 애플리케이션이 시스템 고장을 알아차리 못해서 일을 적절하게 수행하고 시스템은 자동적으로 고장으로부터 회복한다.
  - 고장을 가리는 것(mask)은 분산 시스템에서 가장 힘든 이슈 중 하나이다.

<br>
<br>

### Degree of distribution transparency

- 분산 시스템에서 분산 투명성은 보통 선호되지만 모든 분산 측면에서 숨기는 것은 유저에게 좋지는 않다.
- 높은 투명성과 시스템 사이에 `trade-off`가 있다.
  - 다른 것을 시도하기 전에 일시적인 서버 장애를 가리는 것은 전체 시스템을 늦추게 한다.
- 다른 예로, 몇몇을 다른 대륙에 위치한 복제들을 동시에 consistent하는 것이다.
  - 즉, 한 copy가 바뀌면, 다른 operation이 허용하기 전에 모든 copies에게 전파된다.
  - **redundancy (복제)** : 시스템 장애상황을 대비해서 중요한 시스템 구성요소를 복제
  - **replication (복제)** : 복제된 리소스의 데이터가 같아지도록 데이터를 공유
- `hide`보다 `expose`하는게 더 좋을 수도 있는데, 지역 기반 서비스를 사용할 때가 그 예이다.

<br>
<br>

## Being open

- `open distributed system`은 다른 시스템으로 통합된 것을 쉽게 사용할 수 있게 컴포넌트들을 제공한다.
- **Interoperability(상호 운용성), composability(결합성), extensibility(확장성)**
- open이 되기 위해서, 컴포넌트들은 어떤 것을 제공해야될지 그것들의 문법, 의미를 설명하는 표준 규칙을 고수해야 한다.
- 일반적인 접근은 `Interface Definition Language (IDL)`를 사용하는 인터페이스를 통해 서비스를 정의하는 것이다.
  - 그들은 기능들의 이름을 정확히 명시한다.
- 명시가 잘 되었다면, 인터페이스 정의는 임의의 프로세스(다른 프로세스에게 전달할 수 있는 특정한 인터페이스를 필요로 하는)를 허용한다.
- 적절한 사양은 완전(실행하는데 필요한 모든 것이 명시되어야 한다는 것)하고 중립적이다.
- completeness and neutrality are important for interoperability and portability.
- open distributed system이 되기 위해 다른 목표는 서로 다른 구성 컴포넌트로 시스템을 쉽게 구성할 수 있어야 한다.
  - 다시 말해 `extensible`(확장성) 해야 한다.

<br>
<br>

### Separating policy from mechanism

- 오픈 분산 시스템에서 유연성을 얻기 위해서, 시스템이 작거나 쉽게 대체되고  적용가능한 컴포넌트들의 집합으로 구성되는 것은 중요하다.
- 웹 브라우저를 캐싱한다면 몇 가지 컴포넌트들이 고려되어야 한다.
  1. **Storage**
  2. **Exemption**
  3. **Sharing**
  4. **Refreshing**


<br>
<br>

## Being scalable

- **Scalability dimensions**
  1. **Size scalability** : 크기에 따른 확장성
     - 유저나 자원들을 쉽게 추가해야 된다. $\nearrow$ (어디에?) 시스템에 $\nearrow$ (조건은?) 어떤 성능의 손실 없이 
  2. **Geographical scalability** : 거리에 따른 확장성
     - 유저와 자원은 멀리 떨어져있지만 통신 지연은 거의 알아차리지 못함
  3. **Administrative scalability** : 관리에 따른 확장성
     - 쉽게 관리된다. $\nearrow$ (조건은?) 많은 독립적인 관리 조직을 거친다 하더라도

<br>
<br>

### Size scalability

- 시스템이 크기를 확장하고 싶을 때 풀어야할 많은 문제점들이 있다.
- 유저나 리소스를 더 필요로 한다면 중앙 서비스의 한계에 직면한다.
  - 예를 들어, 많은 서비스들은 센서에 중앙되어 있어서 그들은 분산시스템에 단일 서버로 실행된다.
  - 하지만 요청의 수가 증가하면 서버는 병목현상이 일어날 수 있다.
  - 병목현상이 될 수 있는 **3가지** 원인
    1. CPU 제한으로 인한 계산 용량
    2. 저장 용량 (I/O 전송 비율도 포함)
    3. 유저와 중앙 서비스간의 네트워크

<br>
<br>

### Geographical scalability

- 대부분의 로컬 기반 네트워크들이 `synchronous communication`(동시 통신)에 기반하기 때문에 기존 분산 시스템을 확장하는 것은 어렵다.
- 또 다른 문제로 WAN의 통신은 본질적으로 LAN보다 불안정하다.
- 또한, 제한된 대역폭을 처리한다.

<br>
<br>

### Administrative scalability

- resource 사용, 관리, 보안과 관련된 정책들이 충돌하는 것을 해결하려는 것이 주요 문제이다.
- 분산 시스템이 다른 도메인(domain)으로 확장한다면, 2가지 안전 유형이 고려되어야 한다.
  1. 분산 시스템은 새로운 도메인으로부터 악성 공격에 대해 방어한다.
  2. 새로운 도메인은 분산시스템으로부터 악성 공격에 대해 방어한다.
  - **도메인 (domain)** : 문자로 표시한 인터넷 주소
   

<br>
<br>

### Scaling techniques

- 분산 시스템에서 확장성 문제는 한정된 서버와 네트워크의 용량이 원인이다.
  - 용량을 향상시키는 것을 `scaling up`이라 한다.
- `scaling out`에 의하면, 분산 시스템을 더 많은 시스템을 배포함으로써 확장하는 것은 3가지 기술이 있다. (**해결책**)
  - hiding communication latencies
  - distribution of work
  - replication

<br>

**1. Hiding communication latencies**

- `geographical scalability`에 적용가능
- 원격 서비스 요청의 응답 시간을 기다리는 것을 가능한 피함
- 애플리케이션을 요청할 때 `asynchronous communication`(비동기 통신)만을 사용
  - 응답이 오면, 애플리케이션은 중단되고 이전의 발행된 요청을 끝마치기 위해 특별한 핸들러가 요청된다.
  - `asynchronous communication`(비동기 통신)은 batch-processing system과 parallel application에 사용된다. (독립적인 task가 다른 task가 전달이 끝마치는 것을 기다리는 동안 실행이 스케줄되는)
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

- 컴포넌트를 사용하는 것을 포함, 이것을 작은 부분으로 나누고 시스템에 뿌린다.
- 예시로는 **DNS** (Internet Domain Name System)가 있다.
 - **DNS** : 도인 이름에 대한 IP 주소를 등록하고 있으면서 도메인 이름에 대한 IP 주소를 알려주거나 IP 주소에 대한 도메인 이름을 알려주는 일을 담당
 - **IP 주소** : 인터넷에 연결된 기기를 식별하는 유일한 번호
- DNS name 공간은 위계적으로 구성되어 `domains`의 tree (겹치지 않는 zone으로 나뉘어져서)로 들어간다.
- 각 zone의 names는 단일 name server에 의해 관리된다. 
- resolving a name means returning the network address of the
associated host.

![image](https://user-images.githubusercontent.com/78655692/148327254-5ffaa947-7436-418b-96ce-9bdcc6923834.png)

<br>

- 또 다른 예시로는 `World Wide Web`이 있다.
- Web은 거대한 문서에 기반한 정보 시스템이다. (각 문서는 URL 형태로 고유 name을 가지고 있다.)
- 마치 단일 서버에 있는 것처럼 보인다.
- 하지만 Web은 몇 백만의 서버를 거쳐 (각각의 서버는 많은 웹 문서를 관리한다.)물리적으로 `partitioned and distributed`하다.
- 문서를 관리하는 서버의 네임은 문서의 URL로 인코드 된다.

<br>

**3. Replication**

- 확장성의 문제로 성능 저하가 보이면 분산 시스템에서 component를 `replicate`(복제)한다.
- `cashing`은 복제의 특별한 형태이다. cashing은 자원을 복제하고  클라이언트가 자원에 접근할 수 있도록 해준다.
  - `캐시` : 데이터를 임시로 저장해두는 장소 
  - 하지만 복제와 다르게, 캐싱은 클라이언트의 리소스를 결정한다.(소유자의 리소스가 아니라)
- 하지만, 캐싱과 복제는 `consistency`(일관성) 문제점이 있다.
- 어느 정도까지 불일치가 허용될 수 있는지는 리소스의 사용에 따라 크게 달라진다.
  - 강한 일관성의 문제점은 업데이트가 즉각적으로 다른 모든 copy들에게 전달되어야 한다는 점이다.
  - 두개의 업데이트가 동시에 진행된다면, 업데이트는 어느곳이든 똑같은 순서로 진행되어야 하는데 전역 순서에서 문제가 생긴다.
- 그래서 복제는 전역 동기화 메커니즘이 필요하다. 하지만 이런 메커니즘은 상당히 구현하기 힘들다.

<br>
<br>

### Pitfalls

- 분산 시스템을 발전시키는 것은 만만치 않은 작업임이 분명하다. 그럼에도 원칙들을 따라가다 보면 분산 시스템은 목표를 향해 분명히 발전시킬 수 있을 것이다.
- 분산 시스템은 components가 네트워크를 가로질러 분산되어 있다는 점이 기존 소프트웨어가 다르다.

<br>
<br>

## 1.3 Types of distributed systems

### High performance distributed computing

- `cluster computing`에서 하드웨어는 비슷한 워크스테이션의 집합으로 이루어져 있다. $\nearrow$ (구체적으로) 빠른 스피드의 지역기반 네트워크들로 이루어진. 추가로 각 노드는 같은 운영 체제에서 실행한다.
  - **컴퓨터 클러스터(computer cluster)** : 여러 대의 컴퓨터들이 연결되어 하나의 시스템처럼 동작하는 컴퓨터들의 집합
  - **워크스테이션 (workstation)** : 많은 양의 데이터를 처리하는 작업에 최적화된 전문가용 PC
- `grid computing`과는 다른 케이스인데, 이 서브 그룹은 분산 시스템으로 이루어져 있다. $\nearrow$ (분산 시스템은) 컴퓨터 시스템의 연합으로 구성된 $\nearrow$ (연합은) 각 시스템은 다른 관리 도메인아래 존재하며 하드웨어, 소프트웨어, 네트워크 기술이 아주 다른
- **그리드 컴퓨팅**의 관점에서 다음 논리적 단계는 단순히 컴퓨팅 집약적인 애플리케이션에 필요한 전체 인프라를 아웃소싱(업무의 일부분을 전문기관에 위탁)한다.
- **클라우드 컴퓨팅**의 핵심은 인프라를 동적으로 구축하고 사용 가능한 서비스에서 필요한 것을 구성할 수 있는 기능을 제공 

<br>

- `DSM` (distributed shared-memory multicomputers) 시스템은 프로세스가 다른 컴퓨터의 메모리 위치를 지정할 수 있다. $\nearrow$ (어떻게 지정?) 마치 로컬 메모리인 것 처럼

<br>
<br>

### Cluster computing

- 클러스터 컴퓨팅 시스템은 대중화됐다. $\nearrow$ (어떻게?) 개인 컴퓨터와 워크스테이션의 가격과 성능을 향상시켜
- 클러스터 컴퓨팅은 병령 프로그래밍에 사용된다. $\nearrow$ (병렬 프로그램은) 단일 프로그램이 다중 머신에 병렬로 실행된다.

![image](https://user-images.githubusercontent.com/78655692/148669804-9f69d5ae-66a7-4328-babe-839f013c2781.png)

- 클러스터 컴퓨터의 예시로 그림처럼 리눅스 기반의 `Beowulf clusters`가 있다.
  - 각 클러스터는 컴퓨터 노드(마스터 노드에 의해 통제되고 접속되는)들의 집합으로 구성된다.
  - 마스터는 노드들의 할당을 특정 병령 프로그램으로 갈 수 있는 것을 다루고, 시스템의 유저들에게 인터페이스를 제공한다.
  - compute node는 미들웨어 기능이 확장된 표준 운영 체제을 갖추고 있다.
- 클러스터 컴퓨팅의 특징으로는 **homogeneity (동질성)**이 있다.

<br>
<br>

### Grid computing

- 클러스터에서 컴퓨터들은 크게 같고, 같은 운영체제, 그리고 모두 같은 네트워크를 통해 연결되어 있다.
- 그리드 컴퓨팅에서 노드들은 어떤 특정한 작업을 위해 특별히 구성된다.
  - 그리드 컴퓨팅은 하드웨어, 운영 체제, 네트워크의 유사성에 관한 가정을 하지 않는다.
- 그리드 컴퓨팅은 다른 조직들의 자원을 하나로 모아 다른 조직의 사람들의 협력을 허용한다. $\nearrow$ (조직은) 시스템의 연합을 형성한
  - 이러한 협력은 가상 조직(`virtual organization`)의 형태로 구현된다.
  - 같은 가상 조직의 속한 프로세스는 리소스의 접근 권한을 가진다.

<br>

![image](https://user-images.githubusercontent.com/78655692/148682490-74f30183-8a22-498d-8e9c-cebd27fa2655.png)

- `fabric layer`는 인터페이스를 제공한다. $\nearrow$ (인터페이스는)특정 장소의 로컬 자원에 대한
  - **레이어 (layer)** : 하나의 대상을 여러 개로 나눈 층
- `connectivity layer`는 그리드 트랜잭션(다중 리소스의 사용을 포괄하는)을 지원하기 위한 통신 프로토콜로 이루어져 있다.
  - **프로토콜**(protocol)은 리소스 사이에 데이터를 전달하거나 원격 위치로부터 리소스에 접근하는데 필요하다.
    - **프로토콜** : 서로 다른 컴퓨터끼리 데이터를 원활하게 보내고 받기 위한 규칙
  - 연결 계층은 보안 프로토콜을 가지고 있다. $\nearrow$ (보안 프로토콜은) 유저와 리소스를 인증함
  - 권한(유저로부터 프로그램에)을 위임하는 것은 `connectivity layer`에 중요한 기능이다.
- `resource layer`는 단일 리소스를 관리하는 것을 담당한다.
  - 이것은 연결 계층이 제공한 함수를 사용하고, 인터페이스를 직접 호출한다. $\nearrow$ (인터페이스는) 패브릭 계층에서 사용할 수 있는
  - 자원 계층은 접근 제어를 담당하며, 인증에 의존한다. $\nearrow$ (인증은) 연결 계층의 부분으로 수행됨
- `collective layer`는 **다중 리소스**의 접근을 처리하고, 리소스 발견, 할당, 다중 리소스에 관한 태스크의 스케줄링, 데이터 복제 같은 서비스들로 구성된다.
- `application layer`는 애플리케이션들로 구성된다. $\nearrow$ (애플리케이션은) 가상 조직에서 작동하고 그리드 컴퓨팅 환경에서 사용하는

<br>
<br>

### Cloud computing

- `cloud computing`은 쉽게 사용할 수 있고 가상화 리소스 풀에 액세스할 수 있다.
- 클라우드 컴퓨팅은 pay-per-use 모델(보증은 SLAs(; service-level agreements) 수단으로 제공되는)에 기반한다.

<br>

![image](https://user-images.githubusercontent.com/78655692/148691345-a83ac37a-9c27-4f4a-94b7-bb15b4b9edd8.png)

<br>

- **Hardware** : 가장 낮은 계층은 필요한 하드웨어(프로세서, 라우터, 파워, 쿨링 시스템)를 관리하는 수단으로 형성된다.
  - 데이터 센터에서 실행되며, 고객들이 절대로 직접 볼 수 없는 리소스가 들어있다.
  - **프로세서 (processor = 처리기)** : 정보를 처리하는 요소/장치 (=`CPU`)
- **Infrastructure** : 이 층은 클라우드 컴퓨팅 플랫폼에서 가장 중요한 근본이다.
  - 이것은 가상 기술을 배포한다. $\nearrow$ (왜?) 고객들에게 infrastructure를 제공하기 위해 $\nearrow$ (인프라구조는) 가상 스토리지와 컴퓨팅 리소스로 구성됨
  - 클라우드 컴퓨팅은 가상 스토리지 장치와 가상 서버들을 할당하고 관리하며 발전했다.
- **Platform** : 플랫폼 계층은 클라우드 컴퓨팅을 고객에게 제공한다. $\nearrow$ 운영 체제를 애플리케이션 개발자에게 제공(즉, 쉽게 개발하고 클라우드에서 실행을 필요로 하는 애플리케이션을 쉽게 배치할 수 있는 수단을)
  - 애플리케이션 개발자는 vendor-specific API를 제공받는다. $\nearrow$ (vendor-specific API란) 업로드와 공급업체의 클라우드에서 프로그램을 실행하는 호출들을 포함
  - **API (Application Programming Interface)** : 응용 프로그래머에서 사용 가능한 함수의 집합을 지정 [^11]
  - 이것은 유닉스의 `exec`와 같다. $\nearrow$ (exec는) 실행가능한 파일을 운영 체제에게 실행될 수 있게 가져다 주는 것과 같다
  - 플랫폼 계층은 높은 수준의 추상화(스토리지를 위한)를 제공한다.
  - Amazon S3 스토리지 시스템이 그 예
- **Application** : 실제 애플리케이션들이 이 계층에서 실행된다.
  - office 365 제품들이 그 예이다. 이 애플리케이션들은 다시 한번 공급업체의 클라우드에서 실행된다.

<br>

- **Infrastructure-as-a-Service (IaaS)** : 하드웨어와 인프라 계층
- **Platform-as-a-Service (PaaS)** : 플랫폼 계층
- **Software-as-a-Service (SaaS)** : 애플리케이션들 

<br>
<br>

### Distributed information systems

- 네트워크 애플리케이션은 서버(애플리케이션을 실행하고, 원격 프로그램(**client**라 부름)을 이용할 수 있게)로 구성된다.
  - 클라이언트는 서버에 요청(특정 작동을 실행을 목표로 하는)을 보낸다.
    - **클라이언트**(`client`) : 네트워크를 통하여 서버라는 다른 컴퓨터 시스템 상의 원격 서비스에 접속할 수 있는 응용 프로그램이나 서비스 [^9]
    - 클라이언트(client)는 서비스 요구자, 서버(server)는 서비스 제공자

<br>
<br>

### Distributed transaction processing

- 데이터베이스에서의 동작은 트랜잭션(`transaction`)의 형태로 수행된다.
  - 트랜잭션을 사용한 프로그래밍은 특별한 기본 컴포넌트들을 요구한다. $\nearrow$ (컴포넌트는) 기본 분산 시스템이거나 언어 런타임 시스템에 의해 공급되는
- RPC(; remote procedure calls)는 트랜잭션에 캡슐화된다. $\nearrow$ (RPC란) 프로시저를 원격 서버에 호출함

![image](https://user-images.githubusercontent.com/78655692/148694039-8ca6171f-2744-4587-a7cf-5a8a6389a3f8.png)

<br>

- `트랜잭션`은 ACID 특성들을 따른다.
  - **Atomic** : 외부 세계에서 트랜잭션은 불가분하게 일어난다.
  - **Consistent** : 트랜잭션은 시스템 불변성을 위반하지 않는다.
  - **Isolated** : 동시 트랜잭션은 서로 간섭하지 않는다.
  - **Durable** : 트랜잭션이 커밋하면, 그 변화는 영구적이다.
- 트랜잭션은 많은 하위 트랜잭션으로 구성된다. $\nearrow$ (하위 트랜잭션은) 공동으로 중첩 트랜잭션을 형성하는
  - 상위 수준의 트랜잭션을 다른 곳에서 병행하며 실행되는 자식을 둘로 나눈다. $\nearrow$ (왜?) 성능을 얻거나 프로그래밍을 단순화하기 위해
- 하위 트랜잭션은 미묘한 문제를 일으킨다.
  - 부모가 중단하면, 전체 시스템을 스테이트로 복구해야 한다. $\nearrow$ (언제 복구?) 상위 수준의 트랜잭션이 시작하기 전에
  - 커밋된 하위 트랜잭션의 결과는 실행이 취소되어야 한다.
  - 따라서 영속성은 최상위 수준의 트랜잭션에만 적용된다.

<br>

![image](https://user-images.githubusercontent.com/78655692/150288171-a950bb88-be93-46e2-a34b-a6ae52f96586.png)

<br>

- 중첩 트랜잭션은 분산시스템에서 중요한데, 트랜잭션을 분산하는 방식을 제공하기 때문이다, $\nearrow$ (무엇을 통해?) 다중 시스템
  - 그들은 논리적 분할을 따른다. $\nearrow$ (뭐에?) 원본 트랜잭션의 작업의 

![image](https://user-images.githubusercontent.com/78655692/150280849-07c3ee03-a2f9-4d10-ad94-742fe57e003b.png)

- **TP monitor** (transaction-processing monitor) : 애플리케이션을 다중 서버/데이터베이스에 접근할 수 있도록 해준다. $\nearrow$ (힘의 원천은) 트랜잭션 프로그래밍 모델을 제공함으로써

<br>
<br>

### Enterprise application integration 

- 애플리케이션이 데이터베이스로부터 분리될수록, 설비가 필요하다는 것은 더욱 분명해졌다. $\nearrow$ (설비는) 애플리케이션을 데이터베이스로부터 독립적으로 통합하기 위해 필요함

<br>

![image](https://user-images.githubusercontent.com/78655692/148694784-263815b6-3b47-4bf2-b228-7431527cc9d1.png)

<br>

- 몇가지 타입의 통신 미들웨어가 존재한다.
- **RPC**(; remote procedure calls)을 사용하면, 애플리케이션 컴포넌트가 효과적으로 요청을 다른 애플리케이션 컴포넌트에게 효과적으로 보내지며 $\nearrow$ (힘의 원천은) 로컬 프로시져 호출을 수행함으로써, 이는 요청이 메시지로 패키지되어 착신자에게 보내지게 된다.
- **RMI**(; remote method invocations)는 RPC와 본질적으로 동일하다. $\nearrow$ 함수 대신 객체에서 작동하는 것을 제외하면
- RPC와 RMI는 단점으로 호출자와 발신자 모두 (통신시에) 가동되어 실행되어야 한다는점이다. 게다가 그들은 서로 어떻게 참조되어야 하는지 정확히 알고 있어야 한다.
- 이런 결함은 **MOM**(; message-oriented middleware)를 불러 왔다.
  - 애플리케이션은 메시지를 logical contact points에 보낸다.
  - 애플리케이션은 특정 유형의 메시지에 대한 관심을 나타낼 수 있으며, 그 후, 통신 미들웨어는 처리할 것이다. $\nearrow$ (어떤걸) 이러한 메시지들이 애플리케이션에 보내지는 것을
  - 이런 `publish-subscribe` 시스템 형태는 중요해졌고 분산 시스템의 클래스로 확장되었다.

<br>
<br>

### Pervasive systems

- 안정성은 다양한 기술들(분산 투명성을 얻고자)을 통해 실현한다. 
- 하지만 모바일이나 임베디드 컴퓨팅 장치들이 바뀜에 따라 `pervasive systems`로 불리는 것들이 나왔다.
- 퍼베이시브 시스템은 우리 주변에 자연스럽게 섞이기 위한 것이다.
  - 퍼베이시브 시스템은 많은 센서들을 갖추고 있다. $\nearrow$ (센서는) 사용자의 행동에 대한 다양한 측면을 파악하는
    - **센서 (sensor)** : 물리적인 환경 정보의 변화를 전기적 신호로 바꿔주는 기계 장치
  - 마찬가지로, 이것은 무수한 **액추에이터**를 가지고 있다. $\nearrow$ (왜 가지고 있나) 정보와 피드백을 제공하기 위함과 행동을 조종하기 위해서
    - **엑추에이터 (actuator)** : 전기적 신호를 빛, 소리 등 물리적 변화로 바꿔주는 기계 장치 (=작동기)
- pervasive system 속의 많은 장치들은 작아지고, 배터리화, 모바일, 무선 연결 등이 특징이다. (Internet of Things라 불리는 그들의 역할)

<br>
<br>

### Ubiquitous computing systems

- 이 시스템은 pervasive하며 연속적으로 존재한다. $\nearrow$ (존재란) 사용자가 연속적으로 시스템과 상호작용한다는 의미 $\nearrow$ (상호작용은) 일어나고 있다는 것을 자각하지 못할 정도로
- 특징
  1. **Distribution** : Devices are networked, distributed, and accessible in a transparent manner.
     - 장치와 다른 컴퓨터는 네트워크되고 같이 작동(단일 시스템같게 형성)한다.
  2. **Interaction** : Interaction between users and devices is highly unobtrusive.
     - 유비쿼터스 컴퓨팅은 보기에 인터페이스를 숨긴 것이라 말할 수 있다.
     - 예를 들어, 차의 좌석이 있으면, 밥이 앉았다는 것을 시스템은 알아차리고 그에 적절한 반응을 할 것이다. 여기에 엘리스도 이용한다는 것을 생각해 본다. 
  3. **Context awareness** : The system is aware of a user’s context in order to optimize interaction.
     - 유비쿼터스 컴퓨팅 시스템이 해야 할일은 상호작용이 일어나는 문맥을 고려하는 것이다.
  4. **Autonomy** : Devices operate autonomously without human intervention, and are thus highly self-managed.
     - 유비쿼터스 컴퓨팅 시스템의 중요한 측면으로 명시적 시스템 관리가 최소한으로 줄어들었다는 점이다.
     - 시스템은 자율적으로 행동하고, 자동으로 변환에 반응한다.
  5. **Intelligence** : The system as a whole can handle a wide range of dynamic actions and interactions.
     - 유비쿼터스 컴퓨팅 시스템은 방법과 기술(인공지능 분야로부터)을 사용한다.

<br>
<br>

### Mobile computing systems

- `mobility`는 퍼베이시브 시스템의 중요한 컴포넌트인데 `mobile computing`에 적용 해 볼것이다.
- 몇가지 이슈들이 있다.
  - 모바일 시스템의 부분을 형성한 장치는 매우 광범위하다.
    - 전혀 다른 타입의 장치들은 통신하는데 IP를 쓰고 있다. 
    - 이러한 장치들은 원격 제어, 페이저, 배지, 차 구성, 다양한 GPS 장치를 포함하고 있다.
  - 모바일 컴퓨팅에서 장치의 위치는 시간이 지남에 따라 변한다는 것이다.
    - 위치가 변하는 것은 통신에 지대한 영향을 끼친다.


<br>
<br>

### Sensor networks

- 센서 노드는 감지된 데이터(애플리케이션 방식으로)를 효율적으로 처리하기 위해 협력한다.
- 센서 네트워크는 수백만의 작은 노드들(하나 이상의 센싱 장치를 갖춘)로 구성된다.
  - 또한 노드는 액츄에이터로 활동한다.

<br>

![image](https://user-images.githubusercontent.com/78655692/148698298-a9682274-5bc8-4bf6-b050-1280fc121df4.png)

<br>

- 위 그림의 첫번째는 센서들은 협력하진 않지만 그들의 데이터를 중앙 데이터베이스(오퍼레이터의 위치에 자리한)에 보낸다.
- 두번째 극단적인 그림은 쿼리를 관련 센서에 전달하고 각각이 응답을 계산하고, 운영자가 응답을 집계하도록 한다.
- 위 방법들 모두 좋지는 않다.
  - 첫번째는 센서들이 모든 측정된 데이터를 네트워크를 통해 보내야 하는데, 이것은 네트워크 리소스와 에너지를 낭비한다.
  - 두번째도 센서들(조금의 데이터를 운영자에게 반환한다)의 집계 능력을 버리므로 낭비이다.

<br>
<br>

## 1.4 Summary

- `분산 시스템`은 컴퓨터들(단일 일관성 시스템처럼 보이기 위해 함께 작동하는)로 이뤄져있다.
- 일관성된 집단 행동은 애플리케이션의 독립 프로토콜(미들웨어로 알려진)을 수집함으로써 달성된다. 
  - `미들웨어`는 소포트웨어 계층인데 작동 시스템과 분산 애플리케이션 사이에 위치해 있다.
  - `프로토콜`은 통신, 트랜잭션, 서비스 구성, 신뢰성을 포함한다.
- 분산 시스템의 목표는 리소스 공유와 개방성을 보증하는 것이다.
  - 추가로, 디자이너는 많은 복잡성(프로세스, 데이터, 제어와 연관된)을 숨기는 것을 목표로 한다.
  - 하지만, 이런 분산 투명성은 성능 가격이 따를 뿐 아니라 실제로는 충분히 달성하지 못한다.
  - 확장성의 문제도 있다.
- 분산 컴퓨팅 시스템은 높은 성능의 애플리케이션(병렬 컴퓨팅의 한 분야로부터 구성된)을 효율적으로 사용한다.
- 병렬 프로세싱으로부터 나타난 분야는 그리드 컴퓨팅(전세계적으로 리소스 공유하는 데 초점을 맞춘)이다. 이것은 클라우드 컴퓨팅으로 이어졌다.
- 클라우드 컴퓨팅은 높은 성능의 컴퓨팅을 넘어섰고 분산 시스템을 서포트한다.
  - 시스템을 실행하는 트랜잭션은 이런 환경에 배포된다.
- 분산 시스템의 출현은 컴포넌트들이 작아지고 시스템은 Ad hoc fashion으로 구성되며, 대부분 시스템 제어자를 통해 관리되지 않는다.
- 이것은 후에 퍼베이시브 컴퓨팅 환경이 나타나게 되었다.

<br>
<br>
<br>
<br>

## References

[^1]: [wikipedia - Plug computer](https://en.wikipedia.org/wiki/Plug_computer)
[^2]: [[네트워크] 노드(node)란? - 두더지 개발자](https://engineer-mole.tistory.com/141)
[^3]: [정보통신기술용어해설 - Routing   라우팅, 루팅, 중계방식](http://www.ktword.co.kr/test/view/view.php?nav=2&no=539&sh=%EB%9D%BC%EC%9A%B0%ED%8C%85)
[^4]: [해시넷 - 오버레이 네트워크](http://wiki.hash.kr/index.php/%EC%98%A4%EB%B2%84%EB%A0%88%EC%9D%B4_%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC)
[^5]: [정보통신기술용어해설 - Application Layer   응용 계층, 어플리케이션 계층](http://www.ktword.co.kr/test/view/view.php?nav=2&no=468&sh=%EC%95%A0%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98)
[^6]: [해시넷 - 응용 소프트웨어](http://wiki.hash.kr/index.php/%EC%9D%91%EC%9A%A9_%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4)
[^7]: [해시넷 - 컴포넌트](http://wiki.hash.kr/index.php/%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8)
[^8]: [해시넷 - 원격 프로시저 호출](http://wiki.hash.kr/index.php/%EC%9B%90%EA%B2%A9_%ED%94%84%EB%A1%9C%EC%8B%9C%EC%A0%80_%ED%98%B8%EC%B6%9C)
[^9]: [해시넷 - 클라이언트 (컴퓨팅)](https://ko.wikipedia.org/wiki/%ED%81%B4%EB%9D%BC%EC%9D%B4%EC%96%B8%ED%8A%B8_(%EC%BB%B4%ED%93%A8%ED%8C%85))
[^10]: [정보통신기술용어해설 - System   시스템](http://www.ktword.co.kr/test/view/view.php?nav=2&no=4433&sh=blocking+system)
[^11]: [2.3 시스템 호출(system call) - pwnpwnhnpwn](https://pwnkidh8n.tistory.com/118)