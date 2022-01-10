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

last_modified_at: 2022-01-10
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
<br>
<br>
<br>

## 단어 정리

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