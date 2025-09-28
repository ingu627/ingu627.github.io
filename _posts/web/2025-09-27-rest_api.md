---
layout: single
title: 'REST API 설계: 6대 원칙 & FastAPI 구현 실무 흐름'
excerpt: 'REST 아키텍처의 6대 원칙, URI/HTTP 설계 모범 사례, FastAPI CRUD 구현과 대안 아키텍처 비교까지 한 번에 정리한다.'
categories: [web]
tags: [rest, fastapi, http, api, web, 구현, 아키텍처, 정리, 설계]
toc: true
toc_sticky: true
sidebar_main: true

date: 2025-09-27
last_modified_at: 2025-09-27
---

웹의 성공 공식을 다시 꺼내 학습해야 한다. REST는 낡은 규칙이 아니라 수십 년 동안 검증된 확장성과 회복 탄력성(장애 후 빨리 정상으로 돌아오는 능력)을 담은 “계약 기반” 인터페이스 설계법이다. 이 글은 REST 원칙, 설계 모범 사례, FastAPI 실전 구현, GraphQL·SOAP과의 비교, 그리고 아키텍처 선택 기준까지 한 번에 살펴본다. <br>
API를 **계약(Contract)** 으로 다루고 독립 배포 가능한 팀 구조를 설계해야 한다.
{: .notice--info}

## 한눈에 보는 핵심 요약

- API를 조직 간 계약으로 바라보고 URI·메서드·표현을 명확히 합의해야 한다.
- REST의 6대 제약을 체크리스트처럼 점검해 서비스의 확장성과 회복력을 확보해야 한다.
- URI와 오류 응답을 일관되게 설계해 문서 없이도 예측 가능하게 만들어야 한다.
- FastAPI의 타입 힌트와 Pydantic을 활용해 계약을 코드로 선언하고 자동 문서화를 적극 활용해야 한다.

<br>

## 1. 들어가며: REST API, 왜 여전히 배워야 하는가?

- API는 시스템 간 접착제다. 계약이 명확할수록 프런트엔드와 백엔드 팀은 서로를 기다리지 않고 병렬로 개발할 수 있다.
- REST는 2000년 로이 필딩 박사 논문에서 탄생했고, 완전히 새로운 기술이 아니라 웹의 성공 원리를 정리한 아키텍처 스타일이다.
- REST가 20년 넘게 표준으로 살아남은 이유는 명확하다.
  - 웹이 증명한 확장성·신뢰성·플랫폼 독립성을 계승한다.
  - **URI + HTTP 메서드 + 표현**이라는 계약을 명확히 정의해 팀 간 병렬 개발 속도를 끌어올린다.
  - 캐시·보안·모니터링 등 HTTP 인프라를 그대로 재사용해 운영 부담을 줄인다.


## 2. REST를 REST답게 만드는 6가지 제약을 체계적으로 점검

- RESTful 시스템을 만들려면 여섯 가지 제약을 하나씩 충족해야 한다. 규칙의 나열이 아니라 확장성과 유연성을 확보하는 장치라는 점을 기억해야 한다.

<img width="1000" alt="image" src="https://gist.github.com/user-attachments/assets/fdeca096-0c88-4deb-828f-3c256def3704" />

### 2.1 클라이언트-서버 구조(Client-Server Architecture)

- **클라이언트-서버 구조**는 관심사의 분리를 통해 사용자 인터페이스와 데이터 저장 로직을 분리한다. 이러한 분리는 여러 플랫폼에서의 사용자 인터페이스 이식성을 향상시키고, 서버 컴포넌트를 단순화하여 확장성을 개선한다. 가장 중요한 것은 구성 요소들이 독립적으로 발전할 수 있게 하여 인터넷 규모의 다중 조직 도메인 요구사항을 지원한다는 점이다.
- 체크리스트: 프런트엔드 Repo 분리 / 공용 DTO(Pydantic 전송 전용 모델) 버전 태깅 / OpenAPI 스키마 Diff(변경 차이) CI 감시
- 안티패턴: 서버 렌더 뷰와 JSON API를 동일 라우터 계층에 혼합 / 클라이언트 빌드 결과물을 동일 프로세스에서 서빙해 확장 경로를 막는 구조
- 개선 팁: 정적 자산은 CDN, 동적 요청은 API 도메인 분리(`api.example.com`)로 캐시·보안 정책을 차등 적용

### 2.2 무상태(Stateless)

- 서버에 세션 상태를 쌓지 말고 요청이 스스로 필요한 정보를 모두 들고 오도록 설계해야 한다.
- 확장성과 신뢰성을 확보하려면 로드 밸런서가 어떤 서버로 보내도 같은 결과가 나오도록 구성해야 한다.
- 결국 서버는 “누가 방금 무엇을 했는지” 기억하지 않는다. 대신 클라이언트가 토큰·세션 정보를 매 요청마다 포함해야 한다.
- 세션 상태가 꼭 필요하다면: (1) 서명된 JWT(짧은 만료 + 회전 토큰) (2) 외부 세션 저장소(Redis) (3) Sticky Session(같은 사용자를 같은 서버에 고정 — 확장성 저하, 지양) 세 가지를 비교해야 한다.
- 재시도 시 멱등(같은 요청을 여러 번 보내도 결과가 같음) 보장을 위해 클라이언트가 `Idempotency-Key` 헤더(결제·주문 생성 등 재시도 가능하게 하는 고유 키)를 전송하도록 설계하면 중복 처리를 예방한다.
- 안티패턴: 업로드/배치 진행률 같은 상태를 서버 메모리에만 두는 것 → 재시작 시 손실, 확장 시 불일치 → 별도 상태 스토어/이벤트 스트림으로 외부화해야 한다.

### 2.3 캐시 가능(Cacheable)

- 응답에 `Cache-Control`, `ETag`(리소스 버전 식별 토큰), `Last-Modified` 같은 헤더를 넣어 캐시 정책을 명확히 안내해야 한다.

- 캐시 허용 여부와 유효 시간을 선언하면 네트워크 부담과 서버 부하를 동시에 줄일 수 있다.
- 변하지 않는 데이터라면 “다음 10분 동안 재사용해도 된다”는 메시지를 덧붙이는 것이 사용자 체감 속도를 높인다.
- **강력(Strong) ETag vs 약한(Weak) ETag**: 강력 ETag는 바이트 단위 동일성, 약한 ETag(`W/"hash"`)는 의미적 동일성만 보장 — 빈번한 소폭 변경 리소스에는 Weak 활용
- 304 Not Modified 활용: 클라이언트가 `If-None-Match` / `If-Modified-Since`를 제출하면 변경 시에만 200 본문을 내려 불필요한 전송을 줄인다.
- 정책 설계 예: `Cache-Control: public, max-age=60, stale-while-revalidate=30` → 60초 신선, 이후 30초는 백그라운드 재검증 중 기존(오래된) 응답 임시 제공.

- 민감 데이터(사용자 프로필)는 `Cache-Control: private, no-store` / 결제 응답은 절대 캐시 금지.
- CDN 무효화 전략: (1) 경로 버저닝(`/v1/assets/...`) (2) 해시 포함 파일명(정적) (3) Surrogate-Key 태깅 후 대량 Purge.

### 2.4 계층화 시스템(Layered System)

- **계층화 시스템**은 다중 계층으로 구성된 아키텍처를 허용하며, 보안, 로드 밸런싱, 암호화 계층을 추가하여 구조적 유연성을 제공한다. 이는 PROXY나 게이트웨이 같은 네트워크 기반의 중간매체 사용을 가능하게 하여 시스템의 확장성과 보안을 향상시킨다.

    <img width="720" height="480" alt="image" src="https://gist.github.com/user-attachments/assets/4721ff8f-fe9a-49ee-90d5-6d7d0be968ef" />

- 참조 계층 예시: Client → CDN → WAF → API Gateway → Service Mesh → Microservice → Database/Queue
- 계층 투명성 덕분에 블루/그린·카나리·A/B 실험(새 버전을 일부 트래픽에만 적용) 을 트래픽 라우팅 레벨에서 점진 도입 가능

- Zero-Trust(내부도 기본 불신) 보안: 게이트웨이에서 mTLS(서버·클라이언트 상호 인증) + OAuth2 토큰 검증, 내부 서비스는 짧은 수명 서비스 토큰 사용

- 관찰성: 계층마다 `traceparent` 헤더(Trace/Span ID 포함)를 전달해 분산 추적을 가능하게 한다.

### 계층 요소별 핵심 역할 요약

- **Mobile App**: 사용자가 직접 사용하는 경량 클라이언트 계층이다. 최소한의 상태만 관리하고 서버 API 계약(OpenAPI 스키마)에 의존해 기능을 구현해야 한다.
- **CDN (Content Delivery Network)**: 이미지·정적 JS/CSS·대용량 다운로드를 지리적으로 가까운 에지 노드에서 제공해 네트워크 왕복 지연(latency)을 줄인다. `Cache-Control`, `ETag` 정책을 존중하고 서명 URL(권한 있는 다운로드) 패턴과 조합한다.
- **Load Balancer**: L4/L7 계층에서 트래픽을 다중 인스턴스로 분산한다. 헬스 체크 실패 인스턴스를 격리하고, 점진 배포(카나리/블루그린) 시 트래픽 가중치를 동적으로 조정한다.
- **API Gateway**: 모든 외부 요청의 단일 진입점으로 인증(OAuth2/JWT 검증), 속도 제한(Rate Limit), 요청/응답 변환(헤더 추가, 경로 재작성)과 관찰성 데이터(Trace ID 삽입)를 표준화한다.
- **Service Mesh**: 서비스 간 통신을 사이드카 프록시로 추상화해 mTLS, 재시도(백오프 적용), Circuit Breaker(반복 실패 시 차단), 관찰성 메트릭을 공통 제공한다.

- **Microservice**: 단일 비즈니스 경계(Context)에 집중하는 독립 배포 단위다. 느슨한 결합을 위해 계약(REST/GraphQL/gRPC 이벤트 스키마)을 명확히 정의하고 내부 구현 세부는 숨긴다.
- **Message Queue**: 비동기 처리(이메일 발송, 썸네일 생성, 지연 처리)에 사용한다. API 경로는 빠르게 202 응답을 반환하고 실제 작업은 워커 소비자가 처리해 시스템 탄력성을 높인다.
- **Cache Layer (예: Redis / Memcached)**: 읽기 많은 데이터를 단기 저장해 DB 부하를 줄인다. TTL(만료 시간)·무효화 전략(Write-through: 쓰기 즉시 갱신 / Cache-aside: 미스 시 로드 후 저장)을 명확히 문서화해야 한다.

- **Primary DB**: 단일 정합성(Strong Consistency)이 필요한 쓰기 연산의 진실 원천(Source of Truth)이다. 트랜잭션·스키마 진화(Migration)·잠금 전략을 관리한다.
- **Read Replicas**: 읽기 트래픽을 분산해 확장성을 확보한다. 최종 일관성(Lag)을 고려한 패턴(예: 중요한 직후 확인은 Primary 조회)을 문서화해야 한다.
- **Analytics / Data Lake (선택)**: DB 변경 이벤트(CDC) 스트림을 모아 분석·집계해 운영 DB 부하를 줄인다.

### 요청 흐름 예 (요약)

- 사용자는 Mobile App에서 요청을 보낸다.
- CDN 캐시 적중 시 정적 자원은 에지에서 즉시 응답한다.
- 동적 API 요청은 Load Balancer → API Gateway로 전달된다.
- Gateway는 인증·권한·속도 제한 후 적절한 Microservice로 라우팅한다.
- 서비스 간 추가 호출이 필요하면 Service Mesh가 트래픽 정책(리트라이/타임아웃)을 적용한다.
- 데이터 조회는 Cache Layer → (미스 시) Primary DB 또는 Read Replica 순으로 진행한다.
- 비동기 후속 작업(이미지 처리 등)은 Message Queue에 적재되어 워커가 처리한다.
- 전체 경로에 Trace ID가 전파되어 관찰성 플랫폼에서 단일 트랜잭션으로 추적된다.

### 2.5 균일한 인터페이스(Uniform Interface)

- 리소스 식별, 표현 조작, 자기 서술 메시지, HATEOAS 네 가지 하위 제약을 모두 지켜야 한다.
- URI는 명사로 정의하고 HTTP 메서드는 동사 역할을 맡기며 메시지에는 처리 방법을 스스로 설명하도록 작성해야 한다.
- 개발자가 “이 API는 어떤 규칙일까?”를 추측하지 않도록 경로·메서드·응답 포맷을 패턴화해야 한다.

- 네 하위 제약 요약:
        - 리소스 식별: `/orders/123` → 고유 URI
        - 표현을 통한 조작: JSON 본문에 새 상태 전달 → 서버가 반영
        - 자기 서술 메시지: 헤더 + 본문만 보고도 처리 가능 (예: `Content-Type`, `Link`)
  - HATEOAS: 응답 안에 다음 가능한 동작 링크를 넣어 클라이언트가 경로를 추측하지 않게 한다.

- HATEOAS 예시:

```json
{
    "id": 123,
    "status": "PROCESSING",
    "_links": {
        "self": {"href": "/orders/123"},
        "cancel": {"href": "/orders/123/cancel", "method": "POST"},
        "items": {"href": "/orders/123/items"}
    }
}
```

- 링크 기반 탐색을 적용하면 클라이언트는 경로 하드코딩을 줄이고 API 버전 변화에 더 유연해진다.

### 2.6 코드 온 디맨드(Code on Demand, 선택)

- **코드 온 디맨드**는 선택적 제약 조건으로, 서버가 실행 가능한 코드를 클라이언트에 전송하여 클라이언트의 기능을 일시적으로 확장하거나 커스터마이징할 수 있게 한다. JavaScript를 통한 클라이언트 기능 확장이 대표적인 예이다.

- 브라우저 환경 외에도 WebAssembly(WASM)를 통한 런타임 확장으로 진화 중이다.
- 보안 고려: 임의 코드 주입 위험(MITM, Supply Chain)을 줄이기 위해 서브리소스 무결성(SRI) 해시·CSP 헤더 적용 필요.

## 3. REST API를 구성하는 계약 요소 해부

### 3.1 리소스와 URI: “무엇을” 명확히 정의

- 세상을 리소스 집합으로 바라보고 `/users/123`, `/articles/45`처럼 고유한 URI를 붙여야 한다.
- URI는 명사형 경로로 작성하고 이름만 봐도 무엇을 다루는지 떠올릴 수 있게 만드는 것이 중요하다.
- URI만 읽어도 콘셉트를 알 수 있도록 설계하면 누구나 “/users/123”을 보자마자 “123번 사용자”를 떠올리게 된다.

### 3.2 HTTP 메서드: “어떻게” 조작할지 구분

<img width="1000" alt="image" src="https://gist.github.com/user-attachments/assets/b1b7363d-486e-47b4-a2a5-721dde892df2" />

- CRUD 동작은 다음 표처럼 매핑된다.

    | 메서드 | 목적 | 멱등성 | 안전성 |
    | ------ | ---- | ------ | ------ |
    | GET    | 리소스 조회 | Yes | Yes |
    | POST   | 리소스 생성 | No  | No  |
    | PUT    | 리소스 전체 교체 | Yes | No  |
    | PATCH  | 리소스 부분 수정 | No  | No  |
    | DELETE | 리소스 삭제 | Yes | No  |

- 멱등한 메서드는 네트워크 재시도 시 부작용 없이 활용할 수 있어 장애 대응이 쉬워진다.
- HTTP 메서드는 동사처럼 읽을 수 있다. `GET`은 읽고, `POST`는 만들고, `DELETE`는 삭제하는 의미를 갖는다.

- PUT vs POST 구분: 클라이언트가 최종 URI를 알고 전체 표현을 보내 자원을 '정의'하면 PUT, 서버가 새 ID를 할당해 '생성'하면 POST.
- POST를 멱등화해야 하는 결제/주문 생성은 `Idempotency-Key`(클라이언트 생성 UUID)로 처리해 중복 수신 시 동일 결과 반환.
- PATCH는 JSON Patch / Merge Patch(변경 지시만 담는 표준 형식) 중 무엇을 쓸지 명시해 해석 모호성을 줄인다.

- 409 Conflict, 412 Precondition Failed 등을 활용해 동시 수정 충돌(Optimistic Lock: 버전 비교 후 충돌 시 재시도)을 명확히 표현해야 한다.

### 3.3 표현과 메시지: “어떤 형태로” 전달할지 합의

- 리소스를 직접 전달하지 말고 JSON, XML 같은 표현을 주고받아야 한다.
- 클라이언트는 `Accept` 헤더로 원하는 포맷을 선언하고 서버는 `Content-Type`으로 실제 표현을 통보해야 한다.
- 같은 데이터를 JSON·XML·CSV 등 합의한 표현으로 교환하면 상호 운용성이 높아진다.

- 콘텐츠 협상(Content Negotiation) 패턴: `Accept: application/vnd.example.user+json;v=2` 처럼 버전을 미디어 타입 파라미터로 통합 가능.
- 압축 적용: `Accept-Encoding: br, gzip` → 대량 JSON 응답 전송량 절감(네트워크 임계 경로 최적화).
- 다국어 지원이 필요하다면 `Accept-Language` 협상을 통해 지역화된 메시지를 선택적으로 응답.
- 대형 리스트는 `Prefer: return=minimal` 헤더와 같이 반환 최소화 힌트를 반영할 수 있다.

### 3.4 상태 코드: “결과를” 표준으로 전달

- HTTP 상태 코드를 API의 언어로 사용해야 한다.
- 2xx, 4xx, 5xx 범위를 구분해 성공·클라이언트 오류·서버 오류를 명확히 알려야 한다.
- 상태 코드를 “API의 표정”으로 이해하면 해석이 쉬워진다. 200은 미소, 404는 “찾지 못했다”는 표정이다.

<img width="1000" alt="image" src="https://gist.github.com/user-attachments/assets/fa104f81-0604-4f07-bac1-0a06e5ed3dea" />

- 자주 간과되는 유용 코드:
  - 202 Accepted: 비동기 처리 큐잉 후 폴링/웹훅 안내
  - 206 Partial Content: 범위 다운로드 지원
  - 301/308 Redirect: 영구 경로 이전 (308은 메서드 유지)
  - 304 Not Modified: 캐시 재사용
  - 409 Conflict: 상태 충돌 (중복 자원, 버전 불일치)
  - 412 Precondition Failed: ETag 사전조건 불충족
  - 415 Unsupported Media Type: 잘못된 Content-Type
  - 422 Unprocessable Entity: 의미 검증 실패 (필드 제약 위반)
  - 429 Too Many Requests: Rate Limit 초과 (`Retry-After` 포함)
  - 503 Service Unavailable: 일시 중단 (재시도 지침 포함 권장)
- 오류 매핑 일관성: 같은 문제는 항상 같은 상태 코드를 사용해야 클라이언트 로직이 단순화된다.

## 4. 실무에서 바로 쓰는 RESTful 설계 모범 사례를 적용

### 4.1 URI는 리소스(명사), 행위는 메서드(동사)에 맡겨라

- `GET /users/1`, `DELETE /users/1`처럼 명사 URI와 메서드를 조합해야 한다.
- `GET /getUser?id=1`, `POST /deleteUser`처럼 동사가 섞인 URI는 피해야 한다.

### 4.2 일관된 URI 규칙을 지켜라

- 소문자와 하이픈으로 URI를 구성해야 한다.
- 너무 깊은 계층을 만들지 말고 필요하면 쿼리 파라미터로 관계를 표현하는 편이 낫다.
- 파일 확장자는 빼고 `Accept` 헤더로 콘텐츠 유형을 협상해야 한다.

- 불가피한 액션성 동사는 하위 리소스 형태(`/orders/123/cancel`)나 컨트롤 리소스(`/orders/123/_operations`)로 표현.
- 컬렉션 뒤 슬래시 일관성: 항상 생략(`/users`), 리다이렉션 비용 제거.
- 정렬된 컬렉션 URI에 `stable` 여부 문서화 (동일 파라미터 → 동일 순서 재현 가능성).

### 4.3 버전 관리를 명확히 선언

- `/api/v1/users`처럼 경로 기반 버전을 사용하거나 `Accept: application/vnd.myapp.v1+json`처럼 헤더 기반 버전을 선택할 수 있다.
- 어떤 방식을 사용하든 폐기 일정을 미리 발표해 클라이언트가 대비할 수 있도록 해야 한다.

- 마이너 변경(필드 추가, 선택 파라미터)은 뒤호환을 유지해 동일 버전에서 허용, 파괴적 변경만 새 메이저 버전.
- 서비스 수명주기 문서: Introduced / Deprecated / Sunset 날짜 명시.
- `Deprecation` 및 `Sunset` HTTP 헤더로 런타임 경고를 제공하면 조기 전환을 유도할 수 있다.

### 4.4 컬렉션 자원을 다룰 때 필터링·정렬·페이징을 준비

- `GET /users?role=admin`, `GET /users?sort=name:asc`, `GET /users?page=2&per_page=100` 같은 쿼리 파라미터를 제공하면 편의성이 높아진다.
- 대용량 데이터에는 커서 기반 페이지네이션을 검토하는 편이 안정적이다.
- 목록을 한 번에 모두 내려주지 말고 필요한 만큼만 잘라서 제공하면 성능과 사용자 경험이 모두 개선된다.

- Cursor vs Offset: Offset은 새 레코드 삽입 시 건너뜀 위험, 고변동 테이블은 불투명 토큰 기반 Cursor(안정 페이지) 추천.

- 필드 선택(Sparse Fieldsets): `GET /users?fields=id,name,role`로 필요한 필드만 골라 전송량을 줄인다.

- 서버 허용 최대 `per_page` 문서화 및 초과 요청 시 조정 or 오류 통일.

### 4.5 오류 응답을 일관된 JSON 구조로 고정

- 실패 상황에도 자기 서술 메시지 원칙을 지켜야 한다.

```json
{
  "status": 400,
  "code": "INVALID_EMAIL",
  "message": "The provided email is invalid.",
  "details": "The email 'johndoe@' is missing a domain name."
}
```

- 에러 구조를 표준화하면 프런트엔드가 자동 복구·알림 로직을 붙이기 쉬워진다.
 
- 추적 필드 추가 권장: `trace_id`, `request_id`를 포함하면 관찰성 도구 연계가 쉬워진다.
- 복수 필드 에러 형식 예:

```json
{
    "status": 422,
    "code": "VALIDATION_FAILED",
    "errors": [
        {"field": "email", "code": "INVALID_FORMAT"},
        {"field": "price", "code": "NEGATIVE_VALUE"}
    ]
}
```

- RFC 7807(Problem Details) 포맷: `type`, `title`, `detail`, `instance` 필드를 표준화해 오류 파싱을 단순화한다.

## 5. FastAPI로 REST 원칙을 실전에서 구현

- FastAPI는 타입 힌트와 Pydantic을 활용해 계약을 선언형으로 정의하게끔 도와준다. “타입을 적어두면 검증과 문서가 자동으로 따라온다”는 사실을 기억해야 한다.

### 5.1 첫 API를 1분 만에 띄우기

<script src="https://gist.github.com/ingu627/024b2253cc89146b5d4ef4b4802c0f0a.js"></script>

```bash
uvicorn main:app --reload
```

- `uvicorn` 개발 서버를 실행하면 된다. `--reload` 옵션을 켜 두면 저장 즉시 서버가 재시작돼 피드백 속도가 빨라진다.

### 5.2 Pydantic으로 계약을 선언

<script src="https://gist.github.com/ingu627/d6f2ce4aedf1cfa7ac10d442cfc8b726.js"></script>

- Pydantic 모델로 입력·출력 스키마를 선언하면 타입이 틀릴 때 FastAPI가 422 오류를 자동으로 반환한다.
- `response_model`을 추가하면 민감 정보를 숨기고 응답 구조를 제한할 수 있다.

- Pydantic v2 `model_config = {"from_attributes": True}`로 ORM 객체 직렬화 편의성 확보.
- `Annotated` + `Query/Path/Body`를 활용해 스키마와 문서화(예: 범위, 기본값, 설명) 강화.
- 대형 응답 스트리밍 or 파일 다운로드는 `Response` / `StreamingResponse`(조각 단위 전송)로 직접 헤더 제어.

- 공통 의존성(인증/DB 세션)은 `Depends`로 주입해 테스트 용이성 향상.

### 5.3 자동 문서화를 적극 활용

- `/docs`에서 Swagger UI를 열면 즉시 API를 테스트할 수 있다.
- `/redoc` 문서는 API 전체 구조와 예시를 공유할 때 유용하다.
- `tags`, `summary`, `description`을 경로에 달면 문서 품질이 눈에 띄게 높아진다.
- 프런트엔드 개발자가 `/docs` 화면에서 바로 Try 버튼을 누를 수 있게 되면 협업 속도가 빨라진다.
- `responses={404: {"description": "Not Found"}}`로 상태 코드별 예시·스키마 명시 → 문서 신뢰성 향상.
- 보안 스키마(OAuth2, API Key)를 `openapi_tags`, `security` 설정을 통해 일괄 문서화.

### 5.4 장시간 작업에는 스트리밍 응답 사용

- LLM 응답이나 대용량 처리에는 `StreamingResponse`를 사용해 데이터를 흘려보내면 좋다.
- 체감 속도를 높이고 타임아웃을 피할 수 있도록 설계하면 사용자 경험이 개선된다.
- 선택지 비교: Server-Sent Events(단방향 이벤트 스트림), WebSocket(양방향), HTTP Chunked(단순 부분 전송) — 요구 상호작용 수준으로 결정.
- 비동기 백그라운드 태스크는 `BackgroundTasks` 또는 작업 큐(RQ, Celery)로 분리해 응답을 빠르게 반환한다 (Background Task: 요청 본 흐름과 분리된 후속 처리).

### 5.5 테스트와 품질 자동화

- 계약 회귀 방지: CI에서 OpenAPI JSON 스냅샷 비교(Diff 실패 시 리뷰).
- 타입·린트: mypy + ruff / flake8을 파이프라인에 포함.
- 부하 테스트 예비: 핵심 경로에 Locust/K6 스크립트 작성해 p95 지연 목표 모니터링.

## 6. 결론: REST 원칙을 지렛대로 삼기

- REST는 과거 유물이 아니다. 핵심 제약을 지키면서 GraphQL, gRPC 같은 최신 기술과 공존할 수 있다.
- FastAPI 같은 프레임워크를 활용하면 타입 기반 계약 선언, 자동 문서화, 비동기 성능을 쉽게 확보할 수 있다.
- 운영 단계에서는 OpenAPI 명세 기반 리뷰, 캐시 전략 실험, Rate Limit·구조화 로깅·객체 수준 인가를 도입해야 한다.
- REST 원칙을 이해하고 실천하면 확장 가능한 API 생태계를 구축하고 팀의 속도를 유지할 수 있다.

<br>