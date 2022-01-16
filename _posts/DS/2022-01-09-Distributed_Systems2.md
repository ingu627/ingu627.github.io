---
layout: single
title: "분산 시스템(Distributed Systems) - Architectures"
excerpt: "Distributed Systems Third edition by Maarten van Steen,
Andrew S. Tanenbaum - cha2. Architectures 2.1, 2.2, 2.3, 2.4"
categories: DS
tag : [DS]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-01-16
---

<img align='right' width='200' height='200' src='https://user-images.githubusercontent.com/78655692/147719090-5f0942f1-1647-44ad-8d72-f11e3fe400d7.png
'>
본 글은 Distributed Systems 책의 내용을 개인 공부 목적을 위한 요약 및 정리한 내용입니다. <br> 번역보다는 직역을 통해 영문책을 이해하려다 보니 단어나 문장이 다소 어색할 수 있습니다. <br> 오타나 오류는 알려주시길 바라며, 도움이 되길 바랍니다.
{: .notice--info}

<br>
<br>
<br>
<br>

## Chapter 2. ARCHITECTURES

- 분산시스템의 조직은 소프트웨어(시스템을 구성하는) 요소이다.
- 이런 소프트웨어 아키텍처를 얼마나 다양한 소프트웨어 컴포넌트가 이뤄졌는지와 어떻게 협력하는지를 말할 것이다.
  - 소프트웨어 아키텍처 : 컴포넌트 단위로 기능을 나눴는데 컴포넌트끼리 협력을 어떻게 하느냐
- 분산 시스템의 중요한 목표는 미들웨어 계층을 제공하는 플랫폼으로부터 어플리케이션을 분리하는 것이다.
  - 이러한 계층을 쓰는 것은 중요한 아키텍처 결정이며, 분산 투명성을 제공하는 것이다. 

<br>

## 2.1 Architectural styles

- 아키텍처 스타일은 컴포넌트들(요소들은 서로 연결되고 데이터는 컴포넌트들 사이에서 교환된다)로 형성된다.
  - `component`는 잘 정의된 모듈식 단위(교체 가능한 필수 및 제공 인터페이스)이다.
    - 요소가 특히 시스템이 실행될 때 교체될 수 있어야함은 중요하다.
- `connector`는 컴포넌트들 간의 통신, 협력을 중재하는 매커니즘이다.
  - 커넥터는 요소들 간의 제어와 데이터의 흐름을 허용한다.
- 요소와 커넥터를 사용하여 다양한 구성을 만들 수 있으며, 이는 아키텍처 스타일을 분류하게 되었다.
  - `Layered architectures`
  - `Object-based architectures`
  - `Resource-centered architectures`
  - `Event-based architectures`

<br>

## Layered architectures

- 컴포넌트들이 레이어드 방식($L_j$에 있는 컴포넌트가 낮은 레벨에 있는 컴포넌트 $L_i$에게 다운콜하고 응답을 기대하는)으로 구성되어 있다.
  - 특출난 케이스가 하이레벨 컨포넌트로 업콜 할 때 이다.

<br>

![image](https://user-images.githubusercontent.com/78655692/148709612-705ee8d0-0818-470f-bb0f-9e201ed9c5d4.png)

<br>

- (a)는 표준 구조(다음 하위 계층에 대해 다운콜만 수행되는)를 보여준다.
  - 이 구조는 네트워크 통신에 주로 보인다.

<br>

### Layered communication protocol

![image](https://user-images.githubusercontent.com/78655692/148709840-6813bd39-f7ba-434f-a76d-7ff0be970a78.png)

<br>

- 통신-프로토콜 스택에서 각 계층은 하나 또는 몇몇의 통신 서비스(데이터를 목적지로 보내는 것을 허용하는)를 실행한다.
- 마지막에는 각 계층은 인터페이스(요청된 기능을 명시한)를 제공한다.
- `protocol`(프로토콜)은 당사자들이 정보 교환을 위해 따라야 하는 규칙을 말한다.
  - 서비스는 계층에 의해 제공된다.
  - 인터페이스는 서비스를 이용할 수 있게 해 준다.
  - 프로토콜은 계층이 통신을 수립하기 위해 실행한다.
- TCP(; Transmission Control Protocol)는 메시지가 연결 설정 또는 해제를 위해 교환되는 것을 명시하며, 이는 전송된 데이터의 순서를 보존하기 위해서 필요로 하며, 데이터(전송하는 동안 잃어버렸던)를 감지하고 바로잡기 위해서도 그 이유이다. 

<br>

- `Two communicating parties`

```python
from socket import *

# A simple server
s = socket(AF_INET, SOCK_STREAM) # 소켓 = 연결을 위한 출입구
(conn, addr) = s.accept() 
while True:
    data = conn.recv(1024)
    if not data: 
        break
    conn.send(str(data)+'*')
conn.close()

# A client
s = socket(AF_INET, SOCK_STREAM)
s.connect((HOST, PORT))
s.send('Hello, world')
data = s.recv(1024)
print data
s.close()
```

- `socket()` : to create an object representing the connection
- `accept()` : a blocking call to wait for incoming connection requests; if successful, the call returns a new socket for a separate connection
- `connect()` : to set up a connection to a specified party
- `close()` : to tear down a connection
- `send(), recv()` : to send and receive data over a connection, respectively


<br>
<br>

### Application layering
 
- `The application-interface level`
- `The processing level`
- `The data level`

<br>

- 어플리케이션은 대략 세가지 부분으로 구성돼 있다.
  - 사용자나 외부 어플리케이션과의 상호작용을 처리하는 부분, 데이터베이스나 파일시스템에서 작동하는 부분, 어플리케이션의 핵심 기능들을 포함하는 중간 지점
  - 중간 부분은 프로세싱 레벨에 논리적으로 위치해 있다.
- 유저 인터페이스와 데이터베이스와는 다르게, 프로세싱 레벨과 공통점이 많이 없다.
  - ex1. 인터넷 검색 엔진
    - 유저는 문자를 치면 웹페이지의 제목 목록들이 보여질 것이다.
    - 백엔드는 웹 페이지(프리패치되고 인덱스되는)의 거대한 데이터베이스에 의해 형성된다.
    - **검색 엔진**의 핵심은 키워드의 유저의 문자를 하나 혹은 다른 데이터베이스 쿼리로 전송하는 프로그램이다.
    - 그 후에 결과들이 리스트로 랭크되고, 리스트를 HTML 페이지에 전송한다.
    - 정보 회수 파트는 프로세싱 수준에 있다.

    ![image](https://user-images.githubusercontent.com/78655692/148915278-47e23286-a77a-4424-9255-4896d45ba750.png)

<br>

  - ex2. 부동산 중개업을 위한 의사결정 시스템
    - 3가지 구성요소
      - 유저 인터페이스를 실행하거나 프로그래밍 인터페이스를 외부 어플리케이션에 제공하는 프론트엔드
      - 금융 데이터가 있는 데이터베이스에 접근을 위한 백엔드
      - 이런 2개 사이의 분석 프로그램
    - 금융 데이터를 분석하는 것은 통계적 메서드와 통계와 인공지능으로부터의 기술을 요구한다.
    - 그래서, 금융 의사결정 지원 시스템의 핵심은 처리량과 유저로부터의 응답을 얻기 위해 고성능 컴퓨팅의 실행을 필요로 한다.
  - ex3. office 365는 통합 문서 관리를 지원하고, 유저의 홈 경로로부터의 파일들을 실행시켜주는 공통 유저 인터페이스를 통해 통합된다.
    - 프로세싱 레벨은 프로그램의 큰 집합으로 구성되어 있다.

<br>

- 데이터 수준(data level)은 애플리케이션이 작동하는 곳에서 실제 데이터를 유지하는 프로그램을 포함한다.
  - 데이터는 애플리케이션이 실행되고 있지 않더라도 지속적이여서, 데이터는 다음 유저를 위해 어느 곳에 저장될 것이다.
  - 데이터 수준은 다른 애플리케이션을 거칠 때 데이터 일관성을 지켜야 하는 책임이 있다.

<br>
<br>

## Object-based and service-oriented architectures

![image](https://user-images.githubusercontent.com/78655692/148978947-7f2613a9-0f09-4787-bb22-f39e4aee889a.png)

- 각 개체는 컴포넌트라 정의한 것과 일치하며, 이런 컴포넌트들은 프로시저 요청 메커니즘을 통해 연결되었다.
- 개체기반 아키텍처는 압축 데이터(개체의 state)와 데이터(개체의 method)가 단일 엔티티로 수행되는 동작을 제공한다.
- 개체에 의해 제공된 인터페이스는 실행의 세부 사항들을 숨긴다.
- 인터페이스가 잘 정의되어 있고, 다른 부분은 건드리지 않는다면, 개체는 정확히 같은 인터페이스로 대체되어야 한다.
- 인터페이스와 이런 인터페이스를 실행하는 개체 간의 분리는 장치에 있는 인터페이스를 두게 허용하며, 개체 본래는 다른 장치에 있게 한다. (**분산 개체**(distributed object라 한다.)

<br>

![image](https://user-images.githubusercontent.com/78655692/149040992-ddb1cef8-58b2-44bf-9932-8640b2c2e4d0.png)

<br>

- 클라이언트가 분산 개체를 묶을때, 개체의 인터페이스(=`proxy`)의 실행은 클라이언트의 주소 공간으로 로드된다.
  - **proxy** is analogous to a client stub in RPC systems.
- 오직 메시지로의 마샬 메서드 호출과 메서드 호출의 결과를 클라이언트로 반환하기 위한 언마샬 응답 메시지만 받을 수 있다.
  - **마샬링**(marshalling) : 개체의 메모리 표현을 스토리지 또는 전송에 알맞는 데이터 포맷으로 변형의 프로세스이다.
- 수신 호출 요청이 먼저 서버 스텁으로 가면, 그들을 서버의 개체의 인터페이스에 있는 메서드 호출을 만들기 위해 언마샬한다.
  - **서버 스텁**(server stub)은 응답을 마샬링하고, 클라이언트측 프록스에게 응답 메시지를 보낸다.
- 서버측 스텁(=`skeleton`)은 서버 미들웨어가 user-defined 개체를 통과하기 위한 수단을 제공한다.

<br>

- 대부분의 분산 개체들은 스테이트가 분산되어 있지 않다.
  - 이것은 단일 시스템에 상주한다.
  - 분산 개체에서 스테이트 본래 물리적으로 다중 시스템으로 분산되어 있지만, 이런 분산은 또한 개체의 인터페이스 뒤에 있는 클라이언트로부터 숨겨져 있다.
- 개체기반 아키텍처는 캡슐화 서비스가 독립적인 유닛에 들어가는 토대를 형성한다.
  - 캡슐화(encapsulation)는 전체 서비스는 자급자족하는 개체로 실현된다. (이것이 사용될지라도 다른 서비스) 
- 독립적으로 작동하는 다양한 서비스들을 분리함으로써, 우리는 서비스기반 아키텍처(SOAs; service-oriented architectures)로 갈 수 있게 되었다.

<br>
<br>

## Resource-based architectures

- 웹 너머로 서비스의 수가 증가와 서비스 구성을 통한 분산시스템의 발달이 더 중요해짐에 따라, 연구자들은 웹기반 분산 시스템의 아키텍처를 다시 생각해보기로 했다.
  - 서비스 구성의 문제점 중 하나는 다양한 컴포넌트를 연결하는 것이 통합 악몽(nightmare?)이 될 수 있다는 점이다.
  - 대안으로 분산 시스템을 거대한 리소스(각각이 컴포턴트로서 관리되는)의 집합으로 보는 것이다.
  - 리소스들은 (원격) 애플리케이션에 의해 추가되거나 제거되고, 검색 또는 수정된다.
  - 이런 접근이 지금은 웹에 널리 채택되었고, REST(; Representational State Transfer)로 알려졌다.
  - RESTful 아키텍처의 4가지 특징이 있다.
    1. 리소스들은 단일 이름 스키마를 통해 확인한다.
       - **스키마**(scheme) = 규칙, 원칙, 철학
       - **이름 스키마**(naming scheme) : 이름을 붙일 때 어떤 규칙을 가지고 붙임
    2. 모든 서비스는 같은 인터페이스(많아 봐야 4가지 작동으로 구성된)를 제공한다.

        ![image](https://user-images.githubusercontent.com/78655692/149076180-53df2347-ce54-4d72-8c17-0be0a22e7e5d.png)
    3. 서비스로부터 보낸 메시지들은 self-described이다.
    4. 서비스에서 동작을 실행한 후에, 컴포넌트는 요청자에 대해 모든 걸 잃어버린다.(=`stateless execution`)
  - RESTful은 **Amazon S3**(Amazon's Simple Storage Service)같은 클라우드 스토리지 서비스를 생각해본다.
    - Amazon S3는 오직 두가지 리소스를 지원한다.
      1. `object` : 파일(file)
      2. `bucket` : 디렉토리(directory)
    - BucketName에 포함된 ObjectName 개체는 URL을 통해 참조된다.
      - ex. `http://s3.amazonaws.com/BucketName/ObjectName`
    - bucket이나 object을 생성하기 위해서는 애플리케이션이 bucket/object의 URL과 함께 PUT 요청을 보내야 한다.
    - 이것은 HTTP 요청이 S3에 의해 해석될 것이다.
      - 버킷이나 개체가 이미 존재한다면, HTTP 에러 메시지가 반환된다.
    - RESTful 아키텍처는 **단순함**때문에 인기있어졌다.
      - 이런 단순함은 쉬운 해결이 복잡한 통신 스키마로 가는 것을 막는다.
      - 하지만 무수히 많은 서비스 인터페이스는 문제를 야기한다.

<br>
<br>

## event-based coordination

### Publish-subscribe architectures

- 시스템이 꾸준히 성장하고 프로세스들이 쉽게 합류하거나 떠나는 게 가능해지면서, 프로세스 간의 의존성이 느슨해지는 아키텍처를 가지는 것은 중요해졌다.
- 큰 분산 시스템 클래스는 아키텍처(프로세싱과 조정(coordination) 간의 강한 분리)를 채택했다.
  - 시스템을 독립적으로 작동하는 프로세스들의 집합으로 보는 것이다.
  - **조정(coordination)**은 프로세스 간의 통신과 협력을 말한다.
    - `coordination` : 여러 노드 사이에서 벌어지는 일에 대해서 뭔가를 조정
    - 이것은 프로세스에 의해 수행되는 활동들이 전체로 묶여지는 결합(glue?)을 형성한다.

    ![image](https://user-images.githubusercontent.com/78655692/149267509-f7397466-5d39-48f5-8a6a-b2db9697fefb.png)

  - **direct coordination**
    - 프로세스가 시간 결합되고 참조 결합(referentially coupled)되어 있다면, coordination은 직접 일어난다.
    - 참조 결합은 통신에서 명시적인 참조의 형태로 나타난다.
    - 시간 결합은 통신하는 과정이 모두 가동되고 실행되어야 한다는 것을 의미한다.
  - **mailbox coordination**
    - 프로세스가 시간적으로 분리되지만 참조 결합일 때
    - 통신 프로세스가 동시에 실행될 필요가 없다. 대신에 통신은 메시지를 메일 박스에 넣음으로써 발생한다.
  - **event-based coordination**
    - 참조 결합이 분리되고 시간 결합일 때
    - 참조 분리 시스템에서는 프로세스들은 명시적으로 서로 알지 못한다.
      - 프로세스가 유일하게 할 수 있는 건 이벤트의 현상을 나타내는 알림을 publish받는 것이다.
      - 모든 종류의 알림이 온다면, 프로세스는 특정 종류의 알림을 subscribe해야 한다.
  - **shared data space**
    - 프로세스들은 전부 튜플(tuple)을 통해 통신한다.
    - 튜플을 검색하기 위해, 프로세스는 튜플에 맞는 검색 패턴을 제공한다.
  - 공유 데이터 공간은 가끔 이벤트 기반 조정과 결합된다.
    - 프로세스는 검색 패턴을 제공함하여 특정 튜플을 구독한다.

    <br>

    ![image](https://user-images.githubusercontent.com/78655692/149273849-7f1317f2-c6be-40ee-8066-519d4a3a99fb.png)

- description이 `(attribute, value)`로 구성된다면 **topic-based publish-subscribe systems**이라 부른다.

<br>

![image](https://user-images.githubusercontent.com/78655692/149275075-781adbb1-dbf6-4633-9ee2-a093324b0c0b.png)

<br>

  - 구독은 알림에 대해 매치되어야 한다.
  - 이벤트는 실제로 이용가능한 데이터에 해당한다.
  - 매칭이 성공하면, 두가지 시나리오가 있다.
    1. 미들웨어는 발행된 알림(관련 데이터와 함께)을 보내는 것을 결정한다.
    2. 미들웨어는 구독자가 읽기 동작을 실행해 관련 데이터를 검색할 수 있는 알림지점을 보낸다.

  - 저장은 별도 서비스에 의해 관리되거나 구독자의 몫이다.
    - 다시 말해, 참조 분리이지만 시간 결합 시스템을 가지고 있다.

<br>

- 이벤트는 구독 처리를 쉽게 복잡하게 만든다.
- 중요한 이슈는 효율적이고 확장 가능한 실행(구독을 알림으로 매칭하는)이다.
- 발행-구독 아키텍처는 아주 큰 규모의 분산 시스템을 쌓는데에(강한 프로세스 분리때문에) 많은 가능성을 제공한다.

<br>
<br>

## 2.2 Middleware organization

- 미들웨어의 조직에 적용되는 디자인 패턴의 2가지 중요한 타입으로 `wrapper`와 `interceptor`가 있다.
  - 각각은 다른 문제를 목표로 하지만 미들웨어에 같은 목표(openness 얻는 것)를 보낸다.

<br>
<br>

### Wrappers

- 기존 컴포넌트로 분산 시스템을 구축할 때, 근본적인 문제가 생긴다. : 레거시로 제공되는 인터페이스는 모든 애플리케이션에 적용되지 않는다는 것
- **wrapper**나 **adapter**는 인터페이스(이것의 기능들을 컴포넌트에서 가능한 곳으로 전송한다)를 클라이언트 애플리케이션에 접근가능하게 해주는 특별한 컴포넌트이다.
- `object adapter`는 애플리케이션이 원격 개체를 호출할 수 있는 컴포넌트이다. (이런 개체들이 관련 데이터베이스의 테이블에서 동작하는 라이브러리의 결합으로써 실행된다 할지라도)
- 아마존 S3 스토리지 서비스는 RESTful 아키텍처, 기존 접근을 따르는 2타입의 가능한 인터페이스가 있다.
  - RESTful 인터페이스를 위해, 클라이언트는 HTTP 프로토콜을 사용하게 되는데, 기존 서버(실제 스토리지 서비스의 어댑터 역할을 하는)와 본질적으로 통신하는, 들어오는 요청을 부분적으로 나누고 결과적으로 그들을 S3의 특수 서버 내부에 넘겨준다.
- `wrapper`는 기존 컴포너트를 가지고 시스템을 확장하는데 중요한 역할을 한다.
  - 개방성을 달성하는데 중요한 확장성은 필요하면 wrapper를 추가해 보내지곤 했다.
  - 다시 말해, 애플리케이션 A가 애플리케이션 B가 필요로 했던 데이터를 관리했다면, B에 특화된 wrapper를 개발하여 A 데이터에 접근할 수 있도록 하는 것이다.
    - N 애플리케이션이 있다면 $N \times (N-1) = O(N^2)$ wrapper를 개발해야 한다.
- wrapper의 수를 줄이는 건 미들웨어를 통해 행해진다.
  - 논리적으로 컴포넌트(다른 애플리케이션 간의 모든 액세스를 다루는)가 집중화된 **브로커**(broker)를 실행한다.
  - 브로커가 각각 애플리케이션에게 단일 인터페이스를 제공하기 때문에 우리는 $O(N^2)$ 대신에 많아봐야 $2N = O(N)$가 필요할 뿐이다.

<br>

![image](https://user-images.githubusercontent.com/78655692/149450604-e1ad3b47-3319-45d3-ad97-a04a0a1a7fa1.png)

<br>
<br>

### Interceptors

- 개념적으로 인터셉터(interceptor)는 제어의 일반적인 흐름을 깨고 다른 코드가 실행될 수 있도록 하는 소프트웨어 구조일 뿐이다.
- 인터셉터는 미들웨어를 애플리케이션의 특정한 필요로부터 적용하는데 주요 수단이다.
  - 따라서 인터셉터는 미들웨어를 open하는데 중요한 역할을 한다.
  - 인터셉터를 포괄적으로 만드는 것은 상당한 실행 노력이 필요할 것이며 이러한 경우 일반화가 제한된 애플리케이션과 단순함보다 좋다고 말하는 것은 확실치 않다.
  - 또한, 많은 경우 오직 제한된 인터셉터를 가지는 것은 소프트웨어 관리와 분산시스템을 향상시킬 것이다.

<br>

![image](https://user-images.githubusercontent.com/78655692/149452565-a2326416-7bb5-4319-b028-6c397f179e36.png)

<br>

- `request-level interceptor`이 하는 일은 각각의 복제에게 호출을 요청할 것이다.
  - 요청 수준 인터셉터(미들웨어에 추가될 수 있는)만이 B의 복제를 알 수 있다. 
- 마지막에는, 원격 개체에서의 요청은 네트워크 너몰 보내질 것이다.
- 실제로, 메시징 인터페이스(지역 운영 시스템에 의해 제공되는)는 요청을 필요로 할 것이다.
  - 이 수준에선, `message-level interceptor`는 호출을 목표 개체로 전송하는 것을 도와준다.

<br>
<br>

### Modifiable middleware

- wrapper와 interceptor를 제공하는 것은 미들웨어를 확장하고 조정하는 수단이다.
  - 조정의 필요성은 분산 애플리케이션이 변화가 연속적으로 실행되는 환경으로부터 온다.
- modifiable middleware는 미들웨어는 조정할 필요가 있을 뿐 아니라, 이것을 중단하지 않고 의도적으로 수정할 수 있어야 하는 것으로 표현했다.
  - 인터셉터는 제어의 표준 흐름을 조정하는 수단을 제공한다.
- 컴포넌트 기반 디자인은 구성을 통해 수정가능성을 지원하는 데 집중한다.

<br>
<br>

## 2.3 System architecture

- 이제는 어떻게 많은 분산 시스템이 소프트웨어 컴포넌트들이 어디에 배치되는지 고려하여 실제로 구성되는지 본다.
- 소프트웨어 컴포넌트, 상호협력, 그리고 배치를 결정하는 것은 시스템 아키텍처(system architecture)의 예시를 보여준다.

<br>
<br>

### Centralized organizations

- 서버로부터 서비스를 요청하는 클라이언트 관점에서 생각하는 것은 이해하고 분산 시스템의 복잡성을 관리하는 데 도움이 된다.

<br>

### Simple client-server architecture

- client-server 모델에서 분산시스템의 프로세스는 2개의 그룹으로 나뉘어진다.
- **server**는 특정 서비스(ex. 파일 시스템 서비스나 데이터베이스 시스템)를 실행하는 프로세스이다.
- **client**는 서버로부터 서비스를 요청하는 프로세스이며, 서버의 응답을 기다린다.

![image](https://user-images.githubusercontent.com/78655692/149653998-894219e6-1806-49e8-a981-2964d8f99f57.png)

<br>

- 클라이언트와 서버 간의 통신은 간단한 무접속 프로토콜 수단에 의해 실행되는데, 밑에 있는 네트워크가 많은 LAN과 같이 상당히 신뢰할 때이다.
- 하지만, 프로토콜을 가끔 전송 실패에 대해 저항력있게 만드는 것은 사소하지 않다.
  - 우리가 할 수 있는 유일한 것은 응답 메시지가 안 들어온다면 클라이언트에게 요청을 재전송하는 것 뿐이다.
  - 하지만 클라이언트가 원본 요청 메시지를 잃어버리거나 응답의 전송 을 한지 안 한지 감지하지 못할 때 문제가 있다. 
  - 작동이 손상없이 여러번 반복되면, 이것을 **idempotent**라고 말한다.
- 대안으로, 많은 클라이언트-서버 시스템은 신뢰할 수 있는 연결 지향 프로토콜을 사용한다.
  - 이 해결책이 상대적으로 낮은 성능때문에 LAN에 적절하지 않을 지라도, 통신이 본래 신뢰할 수 없는 WAN에서는 완벽히 작동한다.
  - (가상적으로 모든 인터넷 애플리케이션 프로토콜은 신뢰할 수 있는 TCP/IP 연결에 기반한다.)

<br>
<br>

### Multitiered Architectures

- s





<br>
<br>
<br>
<br>

## CS 단어 정리

- `instantiate` : 예시로 들다
- `mature` : 성숙해지다, 발달하다
- `in terms of` : 측면에서
- `required` : 필수
- `grasp` : 움켜잡다, 파악하다
- `fashion` : 방식
- `be organized in` : 구성되어 있다.
- `organization` : 구조
- `party` : 당, 집단
- `correct` : 바로잡다
- `advocate` : 지지하다
- `handle` : 처리하다
- `subsequently` : 그 후에
- `retrieval` : 회수하다
- `decision support system` : 의사결정 지원 시스템
- `analogous` : 유사한
- `conceal` : 감추다, 숨기다
- `bind` : 묶다
- `proxy` : 대리(인)
- `marshal` : 마샬
- `invocation` : 호출
- `incoming` : 수신
- `transmission` : 전송
- `side` : 측
- `reside` : 상주하다
- `self-contained` : 자급자족하는
- `turn into` : 로 변화다
- `retrieve` : 검색하다
- `at most` : 많아 봐야
- `in practice` : 실제로
- `equivalent` : 동등한
- `intricate` : 복잡한
- `coordination` : 조화, 조정
- `cooperation` : 협력
- `encompass` : 포함하다, 에워싸다
- `taxonomy` : 분류 체계
- `terminology` : 전문 용어
- `coupled` : 결합된
- `referentially` : 참고로
- `be up` : 가동되다
- `coordination` : 조정
- `temporal` : 시간의
- `decoupled` : 분리된
- `address` : (~ 앞으로 우편물을) 보내다
- `correspond` : 일치하다, 해당하다
- `forward` : 보내다, 전달하다
- `lease` : 임대하다
- `build` : 구축하다
- `dissect` : 나누다
- `hand off` : 을 넘겨주다
- `Extensibility` : 확장성
- `used to` : 하곤 했다.
- `reduction` : 감소, 축소
- `is nothing but` : ~일뿐이다.
- `substantial` : 실속한
- `generic` : 포괄적인
- `adaptive` : 조정의
- `underway` : 진행중인, 움직이고 있는


