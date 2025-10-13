---
layout: single
title: 'LLM: GraphRAG with Neo4j - 지식 그래프 확장 검색 설계'
excerpt: "기존 RAG의 한계를 넘어선 GraphRAG를 Neo4j로 구현하는 방법, 단계별로 따라 해본다."
categories: llm
tags : [GraphRAG, Neo4j, RAG, 지식그래프, AI, LLM]
toc: true
toc_sticky: false
sidebar_main: false
date: 2025-09-21
last_modified_at: 2025-09-21
---

이 가이드는 Neo4j를 활용한 GraphRAG에 대해 비전문가도 쉽게 이해할 수 있도록 설명한다. 복잡한 개념을 간단히 풀어 쓰고, 실제 구현 가능한 예시와 함께 단계별로 안내한다. 기존 RAG 시스템의 한계점부터 GraphRAG의 혁신적인 해결책까지, 모든 것을 차근차근 다뤄보겠다.
{: .notice--info}

<br>

## GraphRAG란 무엇인가? 왜 필요한가?

### 기존 RAG 시스템의 한계점들

- 기존의 RAG(Retrieval-Augmented Generation) 시스템은 문서를 벡터로 변환해서 유사도 기반으로 검색한다. 이 방식은 단순한 의미적 유사성 검색에서는 뛰어난 성능을 보이지만, 복잡한 관계를 파악하거나 구조화된 정보를 다룰 때는 명확한 한계가 있다.
- 예를 들어 "삼성전자의 최대 주주는 누구이고, 그 주주의 다른 투자 회사는 어디인가?"라는 질문을 생각해보자. 기존 RAG는 각각의 문서 조각을 독립적으로 검색하기 때문에, 이런 다단계 관계 질문에 정확하게 답하기 어렵다. 또한 "지난 분기 대비 매출이 증가한 회사들의 평균 증가율은?"과 같은 집계 질문에서도 한계를 드러낸다.
- 주요 문제점들을 정리하면 다음과 같다:
  - **관계 추론의 어려움**: 엔티티 간의 복잡한 관계를 파악하지 못한다
  - **집계 작업 불가능**: 여러 데이터 포인트를 종합한 계산이나 통계를 제공할 수 없다
  - **설명 가능성 부족**: 왜 이 문서가 검색되었고, 답변이 도출되었는지 추적하기 어렵다
  - **컨텍스트 분산**: 관련 정보가 여러 문서에 흩어져 있을 때 완전한 그림을 그리지 못한다

<br>

### GraphRAG의 혁신적 접근

<img width="709" height="734" alt="image" src="https://gist.github.com/user-attachments/assets/92688165-a43a-4c99-ade1-f53881ff8238" />

- GraphRAG는 이러한 문제들을 지식 그래프(Knowledge Graph)와 벡터 검색을 결합해서 해결한다. 정보를 노드(nodes)와 엣지(edges)로 구성된 그래프 구조로 저장하여, 단순한 키워드 매칭을 넘어선 관계 기반 추론이 가능하다.
- 핵심 장점들:
  - **구조화된 관계 표현**: 엔티티 간의 명시적 관계를 그래프로 모델링
  - **다중 홉 추론**: 여러 단계를 거치는 복잡한 질문도 처리 가능
  - **설명 가능한 결과**: 검색 경로와 추론 과정을 시각적으로 추적 가능
  - **하이브리드 검색**: 벡터 유사도와 그래프 탐색을 동시에 활용

<br>

## Neo4j GraphRAG의 핵심 아키텍처

### 시스템 구성 요소들

- Neo4j GraphRAG 시스템은 여러 핵심 구성 요소들이 유기적으로 연결되어 작동한다. 각 구성 요소의 역할을 자세히 살펴보자.
- **Neo4j 그래프 데이터베이스**는 시스템의 중심부로, 지식 그래프와 벡터 인덱스를 동시에 저장한다. 이는 기존의 별도 벡터 데이터베이스가 필요 없다는 것을 의미하며, 데이터 일관성과 관리 효율성을 크게 향상시킨다.
- **다양한 Retriever 클래스들**은 각기 다른 검색 전략을 구현한다. VectorRetriever는 전통적인 의미적 검색을, VectorCypherRetriever는 벡터 검색 후 그래프 확장을, Text2CypherRetriever는 자연어를 Cypher 쿼리로 변환하여 구조화된 검색을 담당한다.
- **LLM 인터페이스**는 두 가지 주요 역할을 수행한다: 
  - 사용자 질문을 Cypher 쿼리로 변환하고, 검색된 정보를 바탕으로 자연스러운 답변을 생성한다. 이 과정에서 LLM은 그래프 스키마를 이해하고 적절한 쿼리를 생성해야 하므로, 프롬프트 엔지니어링이 매우 중요하다.
- **임베딩 모델**은 텍스트를 고차원 벡터 공간으로 변환하여 의미적 유사도 계산을 가능하게 한다. Neo4j는 OpenAI, Cohere, Sentence Transformers 등 다양한 임베딩 모델을 지원한다.

<br>

### 검색 전략의 종류와 활용

- Neo4j GraphRAG는 질문의 특성에 따라 최적의 검색 전략을 선택할 수 있는 유연성을 제공한다.
- **VectorRetriever**는 가장 기본적인 형태로, 전통적인 벡터 유사도 검색을 수행한다. 사용자 질문을 벡터로 변환하고, 가장 유사한 문서 청크들을 찾아 반환한다. 이는 "인공지능의 정의는?"과 같은 개념적 질문에 효과적이다.
- **VectorCypherRetriever**는 벡터 검색의 결과를 시작점으로 삼아 그래프를 탐색한다. 예를 들어, "애플"과 관련된 문서를 벡터 검색으로 찾은 후, 그래프에서 애플과 연결된 모든 관계(CEO, 제품, 경쟁사 등)를 추가로 탐색하여 더 풍부한 컨텍스트를 제공한다.
- **Text2CypherRetriever**는 가장 강력한 검색 전략으로, 자연어 질문을 직접 Cypher 쿼리로 변환한다. "삼성전자에서 2023년에 출시한 스마트폰 모델들의 평균 가격은?"과 같은 구조화된 질문을 처리할 때 그 진가를 발휘한다.

<br>

## Neo4j GraphRAG Python 패키지 완전 활용 가이드

### 환경 설정과 초기 구성

- 먼저 필요한 패키지들을 설치하고 환경을 설정해야 한다. Neo4j GraphRAG 패키지는 Neo4j 데이터베이스와 OpenAI API 모두와 연동되므로, 각각의 설정이 필요하다.

```bash
# 필수 패키지 설치
pip install neo4j-graphrag neo4j openai python-dotenv

# 추가 유용한 패키지들
pip install pandas numpy matplotlib seaborn
```

<br>

- 환경 변수 설정을 위한 `.env` 파일 생성:

```
OPENAI_API_KEY=your_openai_api_key_here
NEO4J_URI=neo4j://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password_here
```

- 기본 연결 설정 코드:

<script src="https://gist.github.com/ingu627/881ccb75e2d4d8a1a97c3ad4bfc0125f.js"></script>

<br>

### 벡터 인덱스 생성과 최적화

- Neo4j의 벡터 인덱스는 HNSW(Hierarchical Navigable Small World) 알고리즘을 기반으로 하여, 대규모 데이터셋에서도 효율적인 근사 최근접 이웃 검색을 제공한다.

<script src="https://gist.github.com/ingu627/8642186820698c082d305d5aa30c9710.js"></script>

- 벡터 인덱스의 성능을 최적화하려면 다음 사항들을 고려해야 한다:
  - **차원 수 설정**: OpenAI의 text-embedding-ada-002는 1536차원을 사용
  - **유사도 함수 선택**: 'cosine', 'euclidean', 'manhattan' 중 선택 (대부분 cosine 추천)
  - **인덱스 구성 매개변수**: 대용량 데이터의 경우 빌드 시간과 정확도 간 균형 조정

<br>

### 지식 그래프 자동 구축 시스템

- Neo4j GraphRAG 패키지의 SimpleKGPipeline을 사용하면 텍스트 문서로부터 자동으로 지식 그래프를 구축할 수 있다.

<script src="https://gist.github.com/ingu627/70aeb8068dfafea5676231cc640a6455.js"></script>

<br>

## 실전 GraphRAG 구현 방법론

<img width="800" alt="image" src="https://gist.github.com/user-attachments/assets/0a041f7f-4f06-45f0-b26c-5415ab763b72" />

### 단계별 구현 프로세스

- 실제 GraphRAG 시스템을 구축할 때는 체계적인 접근이 필요하다. 다음은 검증된 단계별 프로세스이다.
- **1단계: 데이터 전처리 및 스키마 설계**
  - 먼저 도메인에 맞는 그래프 스키마를 설계해야 한다. 이는 어떤 엔티티 타입들이 있고, 그들 간에 어떤 관계가 존재하는지 정의하는 과정이다.

<script src="https://gist.github.com/ingu627/fc69edcbbf7152f38557394a8e82d590.js"></script>

<br>

- **2단계: 하이브리드 검색 엔진 구현**
  - GraphRAG의 핵심은 벡터 검색과 그래프 검색을 효과적으로 결합하는 것이다. 질문의 유형을 자동으로 분류하고 적절한 검색 전략을 선택하는 라우팅 시스템을 구현한다.

<script src="https://gist.github.com/ingu627/6abdead9cea0388430e37b3ad701a5a6.js"></script>

<br>

### 엔티티 추출 및 관계 매핑 고도화

- 정확한 지식 그래프 구축을 위해서는 텍스트에서 엔티티와 관계를 정밀하게 추출해야 한다. 이 과정에서 도메인 특화 프롬프트와 검증 로직이 중요하다.

<script src="https://gist.github.com/ingu627/cc25c17d9b4a7d6b84a64266eb4c33f0.js"></script>

<br>

## 성능 최적화 및 프로덕션 배포

### 인덱싱 전략과 쿼리 최적화

- 프로덕션 환경에서 GraphRAG 시스템의 성능을 최적화하려면 효율적인 인덱싱 전략이 필수다. Neo4j는 다양한 인덱스 타입을 제공하므로, 사용 패턴에 맞는 최적의 조합을 선택해야 한다.

<script src="https://gist.github.com/ingu627/b9f88604a7c9bbc134179f4a45cf4865.js"></script>

<br>

### 캐싱 및 연결 풀링 구현

대용량 트래픽을 처리하기 위해서는 intelligent caching과 connection pooling이 필요하다.

<script src="https://gist.github.com/ingu627/72459f51627537f8ac224d624a664c35.js"></script>

<br>

## Microsoft GraphRAG vs Neo4j GraphRAG 심화 비교

### 아키텍처적 차이점 상세 분석

- 두 GraphRAG 접근법은 근본적으로 다른 철학을 가지고 있다. Microsoft GraphRAG는 "글로벌 이해"에 중점을 두는 반면, Neo4j GraphRAG는 "정밀한 관계 탐색"에 강점이 있다.
- **Microsoft GraphRAG의 접근 방식:**
  - 전체 문서 집합을 커뮤니티로 클러스터링
  - 각 커뮤니티의 요약을 미리 생성 (글로벌 요약)
  - 질문이 들어오면 관련 커뮤니티 요약들을 조합하여 답변
  - Leiden 알고리즘을 사용한 계층적 커뮤니티 구조
- **Neo4j GraphRAG의 접근 방식:**
  - 실시간 그래프 탐색 기반
  - Cypher 쿼리를 통한 정확한 경로 탐색
  - 벡터 검색과 그래프 쿼리의 동적 결합
  - 스키마 기반의 구조화된 지식 표현

<br>

### 성능 특성 및 적용 시나리오

- 연구 결과와 실제 구현 경험을 바탕으로 한 성능 비교:
- **정확성 측면:**
  - 단순 사실 질문: 전통적 RAG ≈ Neo4j GraphRAG > Microsoft GraphRAG
  - 다중 홉 질문: Neo4j GraphRAG > Microsoft GraphRAG >> 전통적 RAG
  - 집계 질문: Neo4j GraphRAG >> Microsoft GraphRAG > 전통적 RAG
  - 요약 질문: Microsoft GraphRAG > Neo4j GraphRAG > 전통적 RAG
- **처리 속도:**
  - 초기 설정: Microsoft GraphRAG (느림, 사전 처리 필요) vs Neo4j GraphRAG (빠름, 실시간 구축)
  - 쿼리 응답: Microsoft GraphRAG (빠름, 사전 계산됨) vs Neo4j GraphRAG (중간, 실시간 계산)
  - 업데이트: Microsoft GraphRAG (매우 느림, 전체 재계산) vs Neo4j GraphRAG (빠름, 점진적 업데이트)
- **비용 효율성:**
  - 토큰 사용량: Microsoft GraphRAG는 사전 처리에서 대량 토큰 소모, Neo4j는 실시간 처리에서 적당한 토큰 소모
  - 인프라 비용: Neo4j는 지속적인 데이터베이스 운영 비용, Microsoft는 배치 처리 비용

<br>

## 결론 및 미래 전망

- Neo4j를 활용한 GraphRAG는 전통적인 벡터 기반 RAG 시스템의 근본적 한계를 극복하고, AI 시스템이 더욱 정교하고 설명 가능한 추론을 할 수 있게 하는 혁신적인 기술이다. 
- 특히 복잡한 관계 분석이 중요한 도메인에서 GraphRAG는 기존 방법론을 크게 상회하는 성능을 보여준다. 의료 진단 지원 시스템에서 약물 간 상호작용을 분석하거나, 금융 시스템에서 거래상대방 리스크를 평가하는 등의 실제 응용에서 그 가치가 입증되고 있다.
- 앞으로 GraphRAG 기술은 다음과 같은 방향으로 발전할 것으로 예상한다:
- **기술적 발전 방향:**
  - 멀티모달 GraphRAG: 텍스트, 이미지, 음성, 비디오를 통합한 종합적 지식 그래프
  - 실시간 적응형 그래프: 새로운 정보를 실시간으로 학습하고 그래프를 동적 갱신
  - 연합 학습 기반 GraphRAG: 분산된 데이터소스에서 개인정보를 보호하면서 지식 그래프 구축
  - 자동화된 스키마 진화: 도메인 변화에 따른 그래프 스키마 자동 적응
- **산업 응용 확산:**
- GraphRAG는 이미 의료, 금융, 제조업 등에서 활발히 도입되고 있으며, 향후 교육, 법률, 연구개발 등 지식 집약적 분야로 확산될 전망이다. 특히 한국어와 같은 언어별 특성을 고려한 최적화가 진행되면서, 국내 기업들의 GraphRAG 도입도 가속화될 것이다.
- Neo4j의 강력한 그래프 데이터베이스 기능과 최신 LLM 기술의 결합은 AI 시스템의 지능을 한 단계 끌어올리는 핵심 기술로 자리잡고 있다. 개발자들이 이 기술을 적극 활용하여 더욱 스마트하고 신뢰할 수 있는 AI 애플리케이션을 구축하기를 기대한다.

<br>
<br>

## References

[^1]: [WikiDocs: book/16760](https://wikidocs.net/book/16760)
[^2]: [Velog: 영화 추천 챗봇 GraphRAG 구축하기](https://velog.io/@soonhp/%EC%98%81%ED%99%94-%EC%B6%94%EC%B2%9C-%EC%B1%97%EB%B4%87-GraphRAG-%EA%B5%AC%EC%B6%95%ED%95%98%EA%B8%B0Feat.-Neo4j)
[^3]: [Tistory: GraphRAG Neo4j DB와 LangChain 결합](https://uoahvu.tistory.com/entry/GraphRAG-Neo4j-DB%EC%99%80-LangChain-%EA%B2%B0%ED%95%A9%EC%9D%84-%ED%86%B5%ED%95%9C-%EC%A7%88%EC%9D%98%EC%9D%91%EB%8B%B5-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-Kaggle-CSV-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0)
[^4]: [Tistory: GraphRAG 소개](https://hhj2831.tistory.com/9)
[^5]: [Inflearn: GraphRAG 지식그래프 RAG시스템](https://www.inflearn.com/course/graphrag-%EC%A7%80%EC%8B%9D%EA%B7%B8%EB%9E%98%ED%94%84-rag%EC%8B%9C%EC%8A%A4%ED%85%9C)
[^6]: [YouTube: RumSvtEdAVE](https://www.youtube.com/watch?v=RumSvtEdAVE)
[^7]: [Tistory: Davinci AI GraphRAG](https://davinci-ai.tistory.com/72)
[^8]: [WikiDocs: 291313](https://wikidocs.net/291313)
[^9]: [YouTube: FeAowtZB80w](https://www.youtube.com/watch?v=FeAowtZB80w)
