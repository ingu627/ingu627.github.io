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

last_modified_at: 2022-01-12
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

### Layered architectures

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
- TCP(; Transmission Control Protocol)는 메시지가 연결 설정 도는 해제를 위해 교환되는 것을 명시하며, 이는 전송된 데이터의 순서를 보존하기 위해서 필요로 하며, 데이터(전송하는 동안 잃어버렸던)를 감지하고 바로잡기 위해서도 그 이유이다. 

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

### Object-based and service-oriented architectures

![image](https://user-images.githubusercontent.com/78655692/148978947-7f2613a9-0f09-4787-bb22-f39e4aee889a.png)

- 각 개체는 컴포넌트라 정의한 것과 일치하며, 이런 컴포넌트들은 프로시저 요청 메커니즘을 통해 연결되었다.
- 개체기반 아키텍처는 압축 데이터(개체의 state)와 데이터(개체의 method)가 단일 엔티티로 수행되는 동작을 제공한다.
- 개체에 의해 제공된 인터페이스는 실행의 세부 사항들을 숨긴다.
- 인터페이스가 잘 정의되어 있고, 다른 부분은 건드리지 않는다면, 개체는 정확인 같은 인터페이스로 대체되어야 한다.
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

### Resource-based architectures

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
      - `object` : 




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


