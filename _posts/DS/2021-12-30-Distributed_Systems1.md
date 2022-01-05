---
layout: single
title: "분산 시스템(Distributed Systems) - Introduction"
excerpt: "Distributed Systems Third edition by Maarten van Steen,
Andrew S. Tanenbaum - Introduction"
categories: DS
tag : [DS]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-01-05
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
  - LAN(; Local-area networks)은 수천 대의 기계들에게 정보들을 마이크로초 단위로 전송이 가능해졌다.
  - WAN(; Wide-area network)은 몇백만대의 기계들에게 아주 빠른 속도로 전송이 가능해지도록 만들었다.
- 이러한 발전으로 우리는 소형 컴퓨터 시스템을 가질수 있게 되었다. 스마트폰 또한 하나의 결과물로 볼 수 있을 것이다.
- 센서, 메모리, 강력한 CPU로 채워진 이 장치들은 본격적으로 하기에 준비가 다 된 컴퓨터 못지 않다. (네트워크 능력도 가지고 있다.)
- 그래서 `plug computer`가 등장했다.
- 이런 기술들의 결과로 수많은 네트워크 컴퓨터들로 구성된 컴퓨팅 시스템을 구현할 수 있게 되었다.
- 이러한 컴퓨터들은 분산되어졌는데 `distributed system`을 형성했다고 말할 수 있다.
- 이런 분산 시스템의 크기는 한 줌의 장치로부터 다양해졌다.
- 상호연결된 네트워크는 




- 정의 : A distributed system is a collection of autonomous computing elements that appears to its users as a single coherent system.
  - autonomous: 혼자서 이 일을 할 수 있는
  - single coherent system : (단일 시스템) users or applications perceive a single system -> nodes need to collaborate

- **특징**
  1. distributed system is a collection of computing elements
each being able to behave **independently** of each other
- `nodes` = autonomous computing elements (하드웨어 장비나 소프트웨어 프로세스가 될 수 있다.)
  2. users (be they people or applications) believe they are dealing with **a single system**
     - `autonomous nodes` : 독립적 행동 (각 노드들은 자유로우며 각자 고유의 시간의 알림을 가지고 있다.). 따라서 표준 시간이 없다.
     - 이 특징은 기능적 동기화와 협력 문제를 유발하기도 한다.
     - single system안에서 sensor networks로 높은 성능의 메인프레임 컴퓨터들부터 작은 장치들까지 다룰 수 있다.

<br>

## 특징1. Collection of autonomous computing elements

- 현대 분산 시스템들은 많은 종류의 노드들로 구성되어 있다. 높은 성능의 컴퓨터들부터 작은 plug computer까지
- **노드들은 서로 독립적으로 활동한다.** 그들이 서로를 무시한다 하더라도. 따라서 노드들을 같은 분산 시스템에 넣어 사용하지 않는다.
- 노드들은 공통의 목표를 달성하기 위해 프로그램화 되어있다. 공통의 목표란 서로 메시지들을 교환하는 것을 알아차리는 것
  - 노드는 들어오는 메시지들(차례로 진행되는데, 메시지를 더 먼 곳까지 도달)에 반응한다.





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