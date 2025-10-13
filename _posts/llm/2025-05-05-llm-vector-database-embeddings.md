---
layout: single
title: 'LLM: 벡터DB 선택 가이드 - 구조·검색전략·운영 체크리스트'
excerpt: "벡터 데이터베이스의 개념, 특징, 주요 종류(Pinecone, Milvus, Weaviate 등) 비교 및 사용 사례별 선택 가이드를 제공합니다. AI 및 RAG 아키텍처의 핵심 기술을 알아보세요."
categories: llm
tags : [llm, 청킹, 벡터, 벡터db, 종류, pinecone, milvus, weaviate]
toc: true
toc_sticky: false
sidebar_main: false

date: 2025-05-05
last_modified_at: 2025-09-14
---

벡터 데이터베이스는 인공지능과 머신러닝 기술의 발전과 함께 급부상한 특수 목적 데이터베이스이다. <br>
특히, 생성형 AI와 검색 증강 생성(RAG) 아키텍처가 확산되면서 그 중요성이 더욱 커지고 있다. <br>
이 글에서는 벡터 데이터베이스의 기본 개념과 특징부터 주요 제품 비교, 그리고 사용 사례에 맞는 선택 기준까지 상세히 다룬다.
{: .notice--info}

<br>
<br>

## 벡터 데이터베이스의 정의와 특징

<img src="https://github.com/user-attachments/assets/cab36080-2c29-4e82-9f2c-410d152e00b3" alt="벡터 데이터베이스 개념 설명 다이어그램" width="600"> 


### 벡터 데이터베이스란?

- 벡터 데이터베이스는 데이터 객체를 숫자로 표현한 '벡터(vector)' 또는 '벡터 임베딩(vector embedding)' 형태로 정보를 저장, 관리, 검색하는 데이터베이스다.
- 이러한 벡터는 텍스트, 이미지, 오디오 등 비정형 데이터가 가진 의미적 특성을 고차원 공간상에서 수치로 나타낸 것이다.
- 일반적인 관계형 데이터베이스가 정해진 행과 열의 테이블 형태로 데이터를 저장하는 것과 달리, 벡터 데이터베이스는 데이터를 다차원 공간의 한 점(벡터)으로 표현하고 관리한다.
- 이를 통해 '정확한 일치'가 아닌 '의미적 유사성'을 기준으로 데이터를 빠르고 효율적으로 검색할 수 있다.

<br>

### 벡터 데이터베이스의 주요 특징

**1. 고차원 벡터 저장 및 검색 최적화**
  - 벡터 데이터베이스는 수백에서 수천 차원에 이르는 고차원 벡터를 효율적으로 저장하고 검색하도록 설계되었다. 
  - 각 차원은 데이터의 특정 속성을 나타내며, 고차원 공간에서 벡터 간의 거리를 계산해 의미적으로 가까운 데이터를 찾아낸다.

**2. 근사 최근접 이웃(ANN) 알고리즘 활용**
  - 대부분의 벡터 데이터베이스는 k-최근접 이웃(k-NN) 검색의 속도를 높이기 위해 HNSW, IVF, ANNOY와 같은 근사 최근접 이웃(ANN, Approximate Nearest Neighbor) 알고리즘을 사용한다. 
  - 이 알고리즘은 100% 정확도 대신 약간의 오차를 감수하며 검색 속도를 획기적으로 향상시킨다.

**3. 유사도 검색 기능**
  - 벡터 데이터베이스의 핵심은 쿼리 벡터와 가장 유사한 벡터들을 신속하게 찾아내는 유사도 검색 기능이다. 
  - 유사도를 측정하기 위해 주로 코사인 유사도(Cosine Similarity)나 유클리드 거리(Euclidean Distance) 같은 방식을 사용한다.

**4. 확장성(Scalability)**
  - 대규모 데이터셋을 처리할 수 있도록 수평적 확장을 지원하는 경우가 많다. 분산 시스템을 통해 데이터가 늘어나도 성능을 유지하며, 클라우드 환경에서도 효율적으로 운영할 수 있다.

**5. 하이브리드 검색 지원**
  - 많은 벡터 데이터베이스는 벡터 기반의 의미 검색과 전통적인 키워드 기반 검색(BM25 등)을 결합한 하이브리드 검색 기능을 제공한다. 이를 통해 검색 정확도와 사용자 만족도를 모두 높일 수 있다.

<br>

### 기존 데이터베이스와의 차이점

|구분	|관계형 데이터베이스 (RDBMS)	|벡터 데이터베이스|
|---|---|---|
|데이터 저장 방식|	정형화된 테이블 (행, 열)	|고차원 벡터(Vector Embedding)|
|주요 검색 방식|	정확한 일치(Exact Match) 검색	|의미 기반 유사도(Similarity) 검색|
|주요 사용 사례|	정형 데이터 관리, 트랜잭션 처리	|이미지 검색, 텍스트 의미 검색, 추천 시스템|
|성능 최적화	|SQL 쿼리, 인덱싱	| ANN 알고리즘, 고차원 벡터 인덱싱|


<br>

## 주요 벡터 데이터베이스 종류

- 벡터 데이터베이스 시장은 빠르게 성장하며 다양한 솔루션이 등장하고 있다. 제공 형태와 특징에 따라 다음과 같이 분류할 수 있다.

<img src="https://github.com/user-attachments/assets/af90886f-4f60-4a44-9129-7ba921e01aca" width="800">

### 1. 완전 관리형 벡터 데이터베이스

- **Pinecone**
  - 벡터 유사도 검색을 위한 대표적인 완전 관리형 클라우드 서비스이다.
  - 사용이 간편하고 확장성이 높지만, 클라우드 서비스로만 제공된다.
  - 장점: 완전 관리형 서비스로 운영 부담이 적고, 1ms 수준의 매우 낮은 지연 시간을 제공한다. 직관적인 API로 개발자 경험이 뛰어나다. 
  - 단점: 오픈소스가 아니며 자체 호스팅이 불가능하다. 다른 솔루션에 비해 비용이 상대적으로 높을 수 있다. 
  - 적합한 사용 사례: 빠른 시장 출시가 중요한 스타트업, 운영 오버헤드를 최소화하고 싶은 기업.

<br>

### 2. 오픈소스 벡터 데이터베이스

- **Milvus**
  - AI 애플리케이션을 위해 설계된 고성능 오픈소스 벡터 데이터베이스이다.
  - 컴퓨팅과 스토리지를 분리한 분산 아키텍처로 확장성이 뛰어나며, CPU/GPU 가속을 지원한다.
  - 장점: 초당 쿼리 처리량(QPS)이 매우 높고 지연 시간이 낮아 성능이 뛰어나다. 11가지의 다양한 인덱스를 지원하며, CPU/GPU 가속이 가능하다. 활발한 오픈소스 커뮤니티를 보유하고 있다. 
  - 단점: 기능이 많은 만큼 초기 설정과 관리가 다소 복잡할 수 있다. 
  - 적합한 사용 사례: 대규모 데이터셋을 다루는 고성능 애플리케이션, 다양한 인덱싱 옵션이 필요한 연구 및 개발 환경.

- **Weaviate**
  - 시맨틱 검색을 위한 오픈소스 벡터 검색 엔진으로, GraphQL 기반의 쿼리 인터페이스가 특징이다.
  - 모듈식 구조로 다양한 AI 모델과 연동이 용이하다
  - 장점: GraphQL 기반 쿼리 인터페이스를 제공하여 복잡한 검색이 용이하다. 키워드 검색과 벡터 검색을 결합한 하이브리드 검색 기능이 강력하다. 
  - 단점: 정적 샤딩을 사용하여 동적으로 데이터가 변하는 환경에서는 Milvus에 비해 불리할 수 있다. 
  - 적합한 사용 사례: 복잡한 메타데이터 필터링이 필요한 경우, GraphQL API를 선호하는 개발팀.

- **Qdrant**
  - Rust 언어로 개발되어 높은 성능과 메모리 효율성을 자랑하는 오픈소스 벡터 데이터베이스이다.
  - 경량화된 설계로 리소스 사용이 효율적이다.
  - 장점: Rust로 개발되어 안정성과 메모리 효율성이 뛰어나다. 5만 벡터 기준 월 $9 수준으로 가격 경쟁력이 매우 높다. 
  - 단점: 다른 주요 솔루션에 비해 QPS가 상대적으로 낮고 지연 시간이 조금 더 길다. 
  - 적합한 사용 사례: 비용 효율성이 중요한 스타트업이나 개인 프로젝트, 빠른 프로토타이핑.

- **Chroma**
  - AI 네이티브 애플리케이션을 목표로 설계된 오픈소스 벡터 데이터베이스이다.
  - Python 및 JavaScript에서 쉽게 사용할 수 있어 로컬 개발 및 테스트에 적합하다.
  - 장점: Python, JavaScript 중심의 간단한 API를 제공하여 개발자 친화적이다. 로컬 환경에서 설치와 사용이 매우 간편하다. 
  - 단점: 대규모 프로덕션 환경에서의 검증 사례가 상대적으로 적다. 
  - 적합한 사용 사례: AI/ML 모델 개발 과정에서의 빠른 프로토타이핑, 로컬 개발 및 테스트 환경.

<br>

### 3. 기존 데이터베이스의 벡터 확장

- **Elasticsearch / OpenSearch**
  - 널리 사용되는 검색 엔진으로, 벡터 검색 기능을 추가하여 하이브리드 검색을 지원한다.
  - 기존 텍스트 검색과 벡터 검색을 통합 관리할 수 있는 장점이 있다.

- **PGVector**
  - PostgreSQL 데이터베이스를 위한 확장 기능으로, 기존 PostgreSQL에 벡터 저장 및 검색 기능을 추가할 수 있다.

<br>

### 4. 라이브러리 수준의 벡터 검색 도구

- **FAISS (Facebook AI Similarity Search)**
  - Meta(구 Facebook)에서 개발한 벡터 유사도 검색 라이브러리이다.
  - 데이터베이스가 아닌 라이브러리 형태이지만, GPU 가속을 통해 매우 빠른 검색 속도를 제공한다.

- **Annoy, Hnswlib, nmslib**
  - 다양한 ANN 검색 알고리즘을 구현한 라이브러리들이다.
  - 특정 사용 사례에 맞춰 최적화된 경량 검색 기능을 구현할 때 사용된다.

<br>

## 결론

- 벡터 데이터베이스는 생성형 AI와 RAG 아키텍처의 핵심 구성 요소로 자리 잡았다.
- 성능이 가장 중요하다면 Milvus, 운영 편의성을 최우선으로 한다면 Pinecone, 비용 효율성이 중요하다면 Qdrant, 개발자 경험을 중시한다면 Weaviate나 Chroma가 좋은 선택지가 될 수 있다.
- 각 솔루션은 뚜렷한 장단점을 가지고 있으므로, 애플리케이션의 성능, 확장성, 예산, 개발 환경 등을 종합적으로 고려하여 신중하게 선택해야 한다.
- 최종 선택 전, 후보 솔루션을 사용하여 프로토타입을 만들고 실제 워크로드 환경에서 테스트해보는 것이 가장 중요하다. 벡터 데이터베이스 기술은 빠르게 발전하고 있으므로, 최신 동향을 지속적으로 주시하며 현재의 선택이 여전히 최적인지 주기적으로 재평가하는 자세가 필요하다.

<br>
<br>
<br>

### References

[^4]: [Vector Database란 무엇인가? - Elastic](https://www.elastic.co/kr/what-is/vector-database)
[^5]: [벡터 데이터베이스 특징 및 장점 - codeManager](https://codemanager.tistory.com/151)
[^6]: [[Vector DB] 2. Vector Database 종류 & 한계점 - 호돌찌의 AI 연구소](https://hotorch.tistory.com/406)
[^7]: [2023년, 벡터 데이터베이스 선택을 위한 비교 및 가이드 - PyTorch KR Discuss](https://discuss.pytorch.kr/t/2023-picking-a-vector-database-a-comparison-and-guide-for-2023/2625)
[^8]: [How to Choose the Right Vector Database for Your RAG Architecture - DigitalOcean](https://www.digitalocean.com/community/conceptual-articles/how-to-choose-the-right-vector-database)
[^9]: [Milvus is a high-performance, cloud-native vector database - GitHub](https://github.com/milvus-io/milvus)
[^10]: [What are some distinctive features of Weaviate as a vector search engine - Milvus.io](https://milvus.io/ai-quick-reference/what-are-some-distinctive-features-of-weaviate-as-a-vector-search-engine-especially-regarding-its-support-for-hybrid-search-modules-like-transformers-or-graphql-queries)
[^11]: [Pinecone pricing: Features and plans explained - Orb](https://www.withorb.com/blog/pinecone-pricing)
[^12]: [Qdrant - Vector Database](https://qdrant.tech)
[^13]: [Exploring Chroma Vector Database Capabilities - Zeet Blog](https://zeet.co/blog/exploring-chroma-vector-database-capabilities)
[^14]: [벡터 데이터베이스란 무엇인가요? - AWS](https://aws.amazon.com/ko/what-is/vector-databases/)
[^15]: [2024년에 시도해 볼 만한 상위 5가지 벡터 데이터베이스 - Cody AI Blog](https://meetcody.ai/ko/blog/2024%EB%85%84%EC%97%90-%EC%8B%9C%EB%8F%84%ED%95%B4-%EB%B3%BC-%EB%A7%8C%ED%95%9C-%EC%83%81%EC%9C%84-5%EA%B0%80%EC%A7%80-%EB%B2%A1%ED%84%B0-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4/)
[^16]: [Vector DB 선택하기 - 코딩하는 오리](https://cori.tistory.com/338)
[^17]: [벡터 데이터베이스란 무엇인가요? - IBM](https://www.ibm.com/kr-ko/topics/vector-database)
[^18]: [벡터 데이터베이스란 무엇인가요? - MongoDB](https://www.mongodb.com/ko-kr/resources/basics/databases/vector-databases)
[^19]: [Vector Database (feat. Pinecone) - velog](https://velog.io/@tura/vector-databases)
*