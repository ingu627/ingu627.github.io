---
layout: single
title: '벡터 데이터베이스(Vector Database) 완전 정복: 정의부터 선택 기준까지'
excerpt: "벡터 데이터베이스의 개념, 특징, 주요 종류(Pinecone, Milvus, Weaviate 등) 비교 및 사용 사례별 선택 가이드를 제공합니다. AI 및 RAG 아키텍처의 핵심 기술을 알아보세요."
categories: llm
tag : [llm, 청킹, 벡터, 벡터db, 종류, pinecone, milvus, weaviate]
toc: true
toc_sticky: true
sidebar_main: true

date: 2025-05-05
last_modified_at: 205-05-05
---


벡터 데이터베이스는 인공지능과 머신러닝 기술의 발전과 함께 최근 급부상하고 있는 특수 목적 데이터베이스입니다. <br>
특히 생성형 AI와 검색 증강 생성(RAG) 아키텍처가 확산되면서 벡터 데이터베이스의 중요성이 더욱 커지고 있습니다. <br>
이 글에서는 벡터 데이터베이스의 정의와 특징부터 주요 제품별 비교, 선택 시 고려사항까지 상세히 알아봅니다. <br>
{: .notice--info}

<br>
<br>

## 벡터 데이터베이스의 정의와 특징

<img src="https://github.com/user-attachments/assets/cab36080-2c29-4e82-9f2c-410d152e00b3" alt="벡터 데이터베이스 개념 설명 다이어그램" width="600"> 


### 벡터 데이터베이스란?

- 벡터 데이터베이스는 데이터 객체의 수치적 표현인 벡터(vector) 또는 벡터 임베딩(vector embedding) 형태로 정보를 저장하는 데이터베이스다[^4].
- 이러한 벡터는 텍스트, 이미지, 오디오, 동영상 등 비정형 또는 반정형 데이터의 의미론적 특성을 고차원 공간에서 수치화하여 표현한다.
- 일반적인 관계형 데이터베이스가 행과 열로 구성된 테이블 형태로 데이터를 저장하는 것과 달리, 벡터 데이터베이스는 데이터를 다차원 공간의 점(벡터)으로 표현하고 관리한다[^18].
- 이를 통해 벡터 데이터베이스는 정확한 일치보다는 '의미적 유사성'을 기반으로 데이터를 검색할 수 있게 한다.

<br>

### 벡터 데이터베이스의 주요 특징

**1. 고차원 벡터 저장 및 검색 최적화**
- 벡터 데이터베이스는 수백 또는 수천 차원을 가진 고차원 벡터를 효율적으로 저장하고 검색하도록 설계되었다[^4].
- 각 차원은 데이터 객체의 특정 특성이나 속성을 나타내며, 이러한 고차원 공간에서의 벡터 간 유사도를 계산하여 의미적으로 가장 가까운 데이터를 찾아낸다.

**2. 근사 최근접 이웃(ANN) 알고리즘 활용**
- 벡터 데이터베이스는 일반적으로 k-NN(k-Nearest Neighbor) 검색을 효율적으로 수행하기 위해 HNSW(Hierarchical Navigable Small World), IVF(Inverted File), ANNOY 등의 근사 최근접 이웃(ANN) 알고리즘을 구현한다[^8][^14].
- 이러한 알고리즘은 정확한 최근접 이웃을 찾는 것보다 약간의 정확도를 희생하는 대신 검색 속도를 크게 향상시킨다.

**3. 유사도 검색 기능**
- 벡터 데이터베이스의 핵심 기능은 벡터 간 유사도를 계산하여 쿼리 벡터와 가장 유사한 벡터들을 빠르게 검색하는 것이다[^5].
- 유사도 측정 방식으로는 코사인 유사도(cosine similarity), 유클리드 거리(Euclidean distance) 등이 사용된다.

**4. 확장성(Scalability)**
- 대부분의 벡터 데이터베이스는 대규모 데이터셋을 처리할 수 있도록 수평적 확장성을 제공한다[^5][^8].
- 분산 시스템을 활용하여 데이터베이스의 성능을 확장할 수 있으며, 클라우드 환경에서도 효율적으로 운영이 가능하다.

**5. 하이브리드 검색 지원**
- 많은 벡터 데이터베이스는 벡터 기반 검색뿐만 아니라 키워드 기반 검색(BM25 등)도 함께 지원하는 하이브리드 검색 기능을 제공한다[^7][^10].
- 이를 통해 의미적 검색과 키워드 검색의 장점을 결합할 수 있다.

<br>

### 기존 데이터베이스와의 차이점

- **데이터 저장 방식**: 관계형 데이터베이스는 정형화된 테이블 형식으로 데이터를 저장하는 반면, 벡터 데이터베이스는 고차원 벡터 형태로 데이터를 저장한다[^4][^18].
- **검색 방식**: 관계형 데이터베이스는 정확한 일치 검색을 기반으로 하지만, 벡터 데이터베이스는 유사도 기반 검색을 수행한다[^4]. 이는 "정확히 일치하는 것"보다 "의미적으로 유사한 것"을 찾는 데 더 효과적이다.
- **확장성과 성능**: 벡터 데이터베이스는 고차원 벡터의 효율적인 저장과 검색을 위해 특별히 설계되어 있어, 유사도 검색에서 기존 데이터베이스보다 더 뛰어난 성능과 확장성을 제공한다[^4].

<br>

## 주요 벡터 데이터베이스 종류

벡터 데이터베이스 시장은 빠르게 성장하고 있으며, 다양한 제품들이 등장하고 있다. 주요 벡터 데이터베이스는 다음과 같다:

<img src="https://github.com/user-attachments/assets/af90886f-4f60-4a44-9129-7ba921e01aca" width="800">

### 1. 완전 관리형 벡터 데이터베이스

- **Pinecone**
  - 벡터 유사성 검색을 위한 완전 관리형 클라우드 데이터베이스
  - 클라우드 네이티브, 확장성 높음
  - 자체 호스팅 불가능, 클라우드 서비스만 제공

- **Zilliz Cloud (Milvus 기반)**
  - Milvus를 기반으로 한 완전 관리형 서비스
  - Serverless, Dedicated, BYOC 옵션 제공

<br>

### 2. 오픈소스 벡터 데이터베이스

- **Milvus**
  - AI 애플리케이션을 위한 고성능 오픈소스 벡터 데이터베이스
  - Go 및 C++로 작성, CPU/GPU 하드웨어 가속화 구현
  - 컴퓨팅과 스토리지를 분리하는 완전 분산 아키텍처

- **Weaviate**
  - 시맨틱 검색을 위한 오픈소스 벡터 검색 엔진
  - GraphQL 기반 쿼리 인터페이스 제공
  - 모듈식 아키텍처로 다양한 확장 가능

- **Qdrant**
  - Rust로 개발된 오픈소스 벡터 검색 엔진
  - 고성능, 실시간 검색에 최적화
  - 경량화된 설계로 효율적인 리소스 사용

- **Chroma**
  - AI 애플리케이션에 특화된 오픈소스 벡터 데이터베이스
  - Python 및 JavaScript로 쉽게 사용 가능
  - 로컬 개발 및 테스트에 적합한 단순한 설치와 사용법

<br>

### 3. 기존 데이터베이스의 벡터 확장

- **Elasticsearch / OpenSearch**
  - 벡터 검색 기능이 추가된 인기 검색 엔진
  - 텍스트 검색과 벡터 검색을 통합한 하이브리드 검색 가능

- **PGVector**
  - PostgreSQL을 위한 벡터 확장
  - 기존 PostgreSQL 데이터베이스에 벡터 검색 기능 추가

<br>

### 4. 라이브러리 수준의 벡터 검색 도구

- **FAISS (Facebook AI Similarity Search)**
  - Facebook(Meta)에서 개발한 벡터 유사성 검색 라이브러리
  - GPU 가속화 지원, 다양한 인덱스 유형 제공
  - 독립 데이터베이스가 아닌 라이브러리 형태

- **Annoy, Hnswlib, nmslib**
  - 다양한 근사 최근접 이웃(ANN) 검색 라이브러리
  - 특정 사용 사례에 맞춰 최적화된 구현 제공[^6]

<br>

## 벡터 데이터베이스 선택 시 고려사항

벡터 데이터베이스를 선택할 때는 다음과 같은 요소들을 고려해야 한다:

### 1. 성능과 지연 시간

- 성능은 벡터 데이터베이스 선택에 있어 가장 중요한 요소 중 하나다. 특히 실시간 애플리케이션에서는 낮은 지연 시간(latency)이 필수적이다[^8].
- **초당 쿼리 수(QPS)**: 시스템이 처리할 수 있는 초당 쿼리 수는 대규모 동시 사용자를 지원하는 애플리케이션에서 중요하다. Milvus는 초당 2406개의 쿼리를 처리할 수 있어 높은 성능을 보여준다[^7].
- **지연 시간(Latency)**: 쿼리 응답 시간은 사용자 경험에 직접적인 영향을 미친다. Pinecone(1ms)과 Milvus(1ms)는 가장 낮은 지연 시간을 제공하며, Weaviate(2ms), Qdrant(4ms), PGVector(8ms) 순으로 지연 시간이 증가한다[^7].

### 2. 확장성

- 데이터 규모가 커짐에 따라 시스템의 확장 능력은 매우 중요하다:
- **수평적 확장**: 여러 노드에 걸쳐 부하를 분산시키는 능력은 대규모 데이터셋을 처리하는 데 필수적이다[^8].
- **동적 세그먼트 배치 vs. 정적 샤딩**: Milvus와 Chroma는 동적 세그먼트 배치를 제공하여 지속적으로 변화하는 데이터셋에 더 적합하다. 반면 Weaviate, Qdrant, Elasticsearch는 정적 샤딩을 사용한다[^7].

### 3. 배포 옵션

- **자체 호스팅 vs. 클라우드 관리형**: Pinecone은 클라우드 관리형 서비스만 제공하는 반면, Milvus, Weaviate, Qdrant, Chroma 등은 자체 호스팅이 가능하다[^7].
- **온프레미스 요구 사항**: 데이터 보안이나 규제 준수를 위해 온프레미스 배포가 필요한 경우, 자체 호스팅이 가능한 솔루션을 선택해야 한다[^8].

### 4. 기능적 요구 사항

- **인덱싱 알고리즘**: 대부분의 벡터 데이터베이스는 HNSW를 기본 인덱스로 사용하지만, Milvus는 11가지 다양한 인덱스 유형을 지원하여 더 많은 유연성을 제공한다[^7].
- **하이브리드 검색**: 벡터 검색과 키워드 검색을 결합하는 능력은 검색 품질을 향상시킬 수 있다. 대부분의 주요 벡터 데이터베이스는 하이브리드 검색을 지원한다[^7].
- **디스크 인덱스 지원**: 메모리에 맞지 않는 대규모 데이터셋을 처리하려면 디스크 인덱스 지원이 필요하다. Elasticsearch를 제외한 대부분의 벡터 데이터베이스는 디스크 인덱스를 지원한다[^7].

### 5. 보안 및 액세스 제어

- **역할 기반 액세스 제어(RBAC)**: 엔터프라이즈 환경에서는 세분화된 접근 제어가 중요하다. Pinecone, Milvus, Elasticsearch는 RBAC를 지원한다[^7].
- **데이터 암호화**: 저장 데이터 및 전송 중 데이터 암호화 지원 여부도 중요한 고려사항이다.

### 6. 커뮤니티 및 지원

- **커뮤니티 크기**: Milvus는 GitHub에서 23k 스타와 4k 슬랙 사용자를 보유한 가장 큰 커뮤니티를 자랑한다. 강력한 커뮤니티는 더 나은 지원, 개선, 버그 수정으로 이어진다[^7].
- **개발자 경험**: 문서화 품질, API 사용 편의성, 클라이언트 라이브러리 지원 등은 개발 생산성에 영향을 미친다[^7].

### 7. 비용

- **호스팅 비용**: 벡터 데이터베이스 서비스의 가격은 크게 다를 수 있다. 예를 들어, 50k 벡터에 대한 비용은 Qdrant($9), Pinecone($70), Milvus($65) 등 다양하다[^7].
- **무료 티어**: 개발 및 테스트를 위한 무료 티어가 있는지 확인하는 것도 중요하다[^7].

<br>

## 주요 벡터 데이터베이스 비교 분석

이제 주요 벡터 데이터베이스의 특징을 더 자세히 비교해보자:

### 1. Pinecone

Pinecone은 벡터 유사성 검색을 위한 완전 관리형 클라우드 서비스로, 특히 확장성과 사용 편의성에 중점을 둔다.

**장점:**
- 매우 낮은 지연 시간(1ms)으로 실시간 애플리케이션에 적합[^7]
- 유지 관리가 필요 없는 완전 관리형 서비스
- 뛰어난 개발자 경험과 직관적인 API
- 역할 기반 액세스 제어(RBAC) 지원으로 엔터프라이즈 환경에 적합[^7]

**단점:**
- 오픈소스가 아님
- 자체 호스팅 옵션 없음
- 다른 솔루션에 비해 비용이 높을 수 있음

**적합한 사용 사례:**
- 운영 오버헤드를 최소화하려는 기업
- 빠른 시장 진출이 필요한 스타트업
- 실시간 검색이 필요한 애플리케이션

<br>

### 2. Milvus

Milvus는 인기 있는 오픈소스 벡터 데이터베이스로, 확장성과 고성능에 중점을 둔다.

**장점:**
- 매우 높은 쿼리 처리량(QPS: 2406)과 낮은 지연 시간(1ms)[^7]
- 11가지 다양한 인덱스 유형 지원[^7]
- CPU/GPU 하드웨어 가속화로 최상의 벡터 검색 성능 제공[^9]
- 컴퓨팅과 스토리지를 분리하는 분산 아키텍처로 수평적 확장 가능[^9]
- 활발한 오픈소스 커뮤니티(GitHub 23k 스타)[^7]

**단점:**
- 설정과 구성이 복잡할 수 있음
- 자체 관리가 필요하여 운영 오버헤드 발생

**적합한 사용 사례:**
- 대규모 벡터 데이터셋을 처리해야 하는 엔터프라이즈 환경
- 고성능과 확장성이 중요한 애플리케이션
- 다양한 검색 및 인덱싱 알고리즘을 실험하고자 하는 경우

<br>

### 3. Weaviate

Weaviate는 시맨틱 검색을 위한 오픈소스 벡터 검색 엔진으로, 특히 GraphQL 기반 인터페이스와 모듈식 아키텍처가 특징이다.

**장점:**
- GraphQL 기반 쿼리 인터페이스로 복잡한 검색 쿼리 구성 가능[^10]
- 키워드 기반(BM25)과 벡터 기반 검색을 결합한 하이브리드 검색 지원[^10]
- 확장 가능한 모듈식 아키텍처
- 좋은 성능(QPS: 791, 지연 시간: 2ms)[^7]

**단점:**
- Milvus에 비해 성능이 다소 낮음
- 정적 샤딩 사용으로 동적 데이터에 덜 최적화됨[^7]

**적합한 사용 사례:**
- GraphQL 기반 API를 선호하는 개발 팀
- 복잡한 메타데이터 필터링이 필요한 애플리케이션
- 하이브리드 검색이 중요한 검색 기반 서비스

<br>

### 4. Qdrant

Qdrant는 Rust로 작성된 고성능 벡터 검색 엔진으로, 특히 경량화와 비용 효율성에 중점을 둔다.

**장점:**
- Rust로 구현되어 안정성과 성능이 뛰어남[^12]
- 저렴한 가격 책정(50k 벡터에 약 $9)[^7]
- 사용이 간편하고 배포가 쉬움[^12]
- 하이브리드 검색 지원[^12]

**단점:**
- 다른 솔루션에 비해 QPS가 낮음(326)[^7]
- 지연 시간이 상대적으로 높음(4ms)[^7]
- 정적 샤딩 사용[^7]

**적합한 사용 사례:**
- 예산이 제한된 스타트업이나 개인 개발자
- 효율적인 리소스 사용이 중요한 환경
- 빠른 프로토타이핑과 개발이 필요한 프로젝트

<br>

### 5. Chroma

Chroma는 AI 애플리케이션을 위해 설계된 오픈소스 벡터 데이터베이스로, 사용 편의성과 개발자 친화적인 인터페이스가 특징이다.

**장점:**
- Python 및 JavaScript에 대한 간단한 API와 좋은 개발자 경험[^13]
- 동적 세그먼트 배치 제공으로 변화하는 데이터셋에 적합[^7]
- 인메모리 기능으로 높은 처리량 작업 가능[^13]
- Parquet와 같은 효율적인 스토리지 형식 지원[^13]

**단점:**
- 대규모 프로덕션 환경에서의 실적이 덜 검증됨
- 성능 벤치마크 데이터가 제한적임[^7]

**적합한 사용 사례:**
- 빠른 프로토타이핑 및 개발
- AI 및 머신러닝 애플리케이션
- 로컬 개발 및 테스트

<br>

## 결론

- 벡터 데이터베이스는 인공지능, 머신러닝 애플리케이션, 특히 생성형 AI와 RAG 아키텍처에서 핵심적인 역할을 하고 있다.
- 다양한 벡터 데이터베이스가 각각의 강점과 특징을 가지고 있어, 자신의 요구사항에 맞는 솔루션을 선택하는 것이 중요하다.
- 성능을 최우선으로 한다면 Milvus가 가장 좋은 선택일 수 있다.
- 운영 오버헤드를 최소화하려면 Pinecone과 같은 완전 관리형 서비스가 적합하다.
- 비용이 주요 고려사항이라면 Qdrant가 경제적인 옵션이 될 수 있다.
- 개발자 경험과 사용 편의성을 중시한다면 Chroma나 Weaviate가 좋은 선택이다.
- 어떤 벡터 데이터베이스를 선택하든, 해당 솔루션이 애플리케이션의 성능 요구사항, 확장성 목표, 예산 제약을 충족하는지 면밀히 평가하고, 가능하다면 프로토타입을 통해 실제 워크로드에서 테스트해보는 것이 중요하다.
- 벡터 데이터베이스는 계속해서 발전하고 있는 분야이므로, 정기적으로 최신 벤치마크와 기능을 확인하여 현재의 선택이 여전히 최적인지 재평가하는 것이 좋다.

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
