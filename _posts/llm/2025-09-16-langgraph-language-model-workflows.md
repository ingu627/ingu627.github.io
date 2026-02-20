---
layout: single
title: 'LLM: LangGraph 구조·동작 원리 & 실전 워크플로 예제'
excerpt: "LangGraph는 기존 LangChain의 한계를 뛰어넘어 복잡한 AI 워크플로우를 그래프 구조로 설계하고 구현할 수 있게 해주는 혁신적인 프레임워크입니다."
categories: llm
tags : [llm, langgraph, 구조, 원리, 예제, langchain, 랭그래프, 노드, 상태, 엣지]
toc: true
toc_sticky: false
sidebar_main: false

date: 2025-09-16
last_modified_at: 2025-09-16
redirect_from:
  - /llm/langgraph1/
---

LangGraph는 기존 LangChain의 한계를 뛰어넘어 복잡한 AI 워크플로우를 그래프 구조로 설계하고 구현할 수 있게 해주는 혁신적인 프레임워크다. <br> 
단순한 체인 구조로는 구현하기 어려웠던 순환 로직, 조건부 분기, 다중 에이전트 협업 등을 자연스럽게 구현할 수 있어 차세대 AI 에이전트 개발의 핵심 도구로 주목받고 있다.
{: .notice--info}

<br>

## LangGraph의 기원과 영감

- 구글 Pregel의 영향
  - LangGraph는 구글의 대규모 그래프 처리 시스템인 Pregel[^1]에서 영감을 받아 개발되었다.
  - Pregel은 그래프 데이터를 병렬 처리하기 위한 프레임워크로, 노드(정점)와 엣지(간선)를 기반으로 대용량 데이터를 효율적으로 계산한다.[^2]
  - LangGraph는 이 개념을 AI 워크플로우에 적용하여, 복잡한 에이전트 시스템을 그래프 형태로 모델링한다.
  - 구체적으로 LangGraph의 런타임은 Pregel의 아이디어를 바탕으로 액터(Actor)와 채널(Channel)을 결합한 구조를 사용하며, 상태 업데이트와 병렬 처리를 지원한다. 
- 이러한 배경 덕분에 LangGraph는 단순한 체인 구조를 넘어 대규모, 동적 워크플로우를 안정적으로 처리할 수 있는 기반을 마련했다.

<br>

## LangGraph의 핵심 개념

### 그래프 기반 아키텍처의 본질

<img width="800" alt="langgraph1" src="https://gist.github.com/user-attachments/assets/927fa11e-0622-48c8-8eb1-3ba91f0521c0" /> [^3]

- LangGraph는 전통적인 직선적 체인 구조에서 벗어나 그래프(Graph) 구조를 채택한 프레임워크다. 
- 각 작업 단위를 **노드(Node)**로, 작업 간의 연결을 **엣지(Edge)**로 표현하여 복잡한 워크플로우를 직관적으로 모델링한다.
- 방향성을 가진 유향 그래프를 사용하여 데이터의 흐름과 제어 로직을 명확하게 정의할 수 있다.

<br>

### LangChain과의 차별점

- LangGraph와 LangChain의 핵심적인 차이점을 살펴보면 다음과 같다:

|특징|	LangChain|	LangGraph|
|구조|	체인 기반 (순차적)|	그래프 기반 (순환 지원)|
|상태 관리|	제한적, 수동 관리|	중앙집중식, 자동 관리|
|워크플로우|	직선적, 예측 가능|	동적, 조건부 분기|
|복잡성|	단순한 파이프라인에 적합|	복잡한 다중 에이전트 시스템|
|확장성|	체인 추가 시 리팩토링 필요|	노드 단위 교체/추가로 확장|

<br>

### LangGraph의 3대 핵심 구성요소

<img width="800" height="389" alt="image" src="https://gist.github.com/user-attachments/assets/f1d58a87-d9f6-4330-a861-c0972337f0f4" /> [^4]


1. **State (상태) - 데이터 저장소**

- State는 그래프의 모든 노드가 공유하는 중앙집중식 데이터 저장소다.
- 대화 기록, 중간 결과, 사용자 정보 등 에이전트가 작업하는 동안 기억해야 할 모든 정보를 담는다.
- Python의 TypedDict를 사용하여 명확한 구조로 정의하며, 타입 안전성을 보장한다

<script src="https://gist.github.com/ingu627/1ab1c8a6482f1ef6acbd116772c0f285.js"></script>

<br>

2. **Node (노드) - 작업 단위**

- Node는 실제 작업을 수행하는 Python 함수로, LLM 호출, 데이터 처리, 외부 API 연동 등의 작업을 담당한다.
- 현재 상태(State)를 입력받아 처리한 후, 업데이트된 상태를 반환하는 구조다.
- 각 노드는 독립적인 작업 단위이므로 재사용성과 모듈성이 높다.

<script src="https://gist.github.com/ingu627/dec50976ae19f4918cb2a21339170944.js"></script>

<br>

3. **Edge (엣지) - 연결과 흐름 제어**

- Edge는 노드 간의 연결과 데이터 흐름을 정의하는 요소다.
- 세 가지 유형의 엣지가 있다:
  - 일반 엣지: 무조건 다음 노드로 이동
  - 조건부 엣지: 특정 조건에 따라 다른 노드로 분기
  - 시작/종료 엣지: 그래프의 진입점과 종료점 정의

<br>

## LangGraph 실전 예제

- **기본 챗봇 구현**
  - 다음은 LangGraph로 구현한 기본 챗봇의 완전한 예제다:

<script src="https://gist.github.com/ingu627/561aeec2bbe91b74ac486086dda78141.js"></script>

<br>

- **조건부 분기를 포함한 고급 예제**
  - 더 복잡한 워크플로우를 위한 조건부 엣지 활용 예제:

<script src="https://gist.github.com/ingu627/be8667f179b90ab31fd1ae75b66d713f.js"></script>

<br>

- **툴 통합 예제**
  - 외부 도구를 활용하는 에이전트 구현:

<script src="https://gist.github.com/ingu627/557c193f9aef026904a575f53af5b5a9.js"></script>

<br>

- **상태 관리의 심화 활용**
  - **Reducer 함수**: 상태 업데이트 방식을 세밀하게 제어할 수 있다. 
  - **체크포인트**: 특정 시점의 상태를 저장하고 복구할 수 있어 오류 처리에 유용하다. 
  - **멀티 스레드 지원**: 여러 대화 세션을 동시에 관리할 수 있다.

<script src="https://gist.github.com/ingu627/1122e55313e6a2e5534f6ac90a4838e7.js"></script>



<br>
<br>

## References

[^1]: [Pregel: a system for large-scale graph processing](https://dl.acm.org/doi/abs/10.1145/1807167.1807184)
[^2]: [[논문 리뷰] Pregel: A System for Large-Scale Graph Processing](https://ingu627.github.io/paper/pregel/)
[^3]: [Langgraph Chapter 2: Build a simply graph](https://qubitware.in/blogs/045a2773-a85d-4bfe-98bf-949d5e8fa775/Understanding%20State,%20Nodes,%20and%20Edges%20in%20LangGraph)
[^4]: [LangGraph for Beginners: A Comprehensive Guide to Building AI Agents — Part 1](https://medium.com/@anjaneyulu.408/langgraph-for-beginners-a-comprehensive-guide-to-building-ai-agents-part-1-dffd4cba6531)

