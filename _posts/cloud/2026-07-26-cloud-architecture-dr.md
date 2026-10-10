---
layout: single
title: "클라우드 아키텍처 패턴과 재해 복구(DR): RTO/RPO 설계"
excerpt: "모놀리식과 마이크로서비스의 트레이드오프부터 12-factor, 이벤트 드리븐, CQRS·사가·아웃박스, 멀티테넌시, 고가용성, 재해 복구 4전략까지 아키텍처 결정의 축을 한 흐름으로 정리한다. 모든 판단의 기준은 실패 반경을 줄이고 RTO/RPO를 얼마에 사들일 것인가다."
categories: [cloud]
tags: [cloud, architecture, dr, rto, rpo, microservices, event-driven, ha, 정리]
toc: true
toc_sticky: true
sidebar_main: true

date: 2026-07-26
last_modified_at: 2026-10-10
---

이 시리즈는 쿠버네티스와 클라우드(AWS·GCP·Azure 공통 개념)를 실무 관점에서 정리한 기록이다. 핵심 개념·코드 예제·실전 함정(gotcha) 중심으로, 학습과 설계 리뷰·장애 대응에 바로 쓸 수 있게 구성했다. 각 편은 독립적으로 읽을 수 있고, 순서대로 보면 클러스터 내부 구조에서 클라우드 운영까지 하나의 흐름으로 이어진다.

이번 편에서는 아키텍처 패턴(Architecture Pattern)을 다룬다. 아키텍처는 "무엇을 만들 것인가"보다 **변경·장애·성장을 어떻게 감당할 것인가**에 대한 결정의 집합이고, 서비스가 커질수록 비용이 드는 것은 코드가 아니라 경계(boundary) 선택이다. 서비스 분해 트레이드오프부터 이벤트·API·데이터 패턴, 멀티테넌시, 고가용성(HA), 재해 복구(DR), 멀티 클라우드, 마이그레이션 6R, 그리고 ADR 문화까지 한 흐름으로 정리한다. 모든 절의 판단 기준은 동일하다. **실패 반경(blast radius)을 얼마나 줄이고, 복구 시간(RTO)과 데이터 손실(RPO)을 얼마에 사들일 것인가.** 지금까지의 비용 이야기는 [클라우드 비용 최적화(FinOps)](https://ingu627.github.io/cloud/cloud-finops/)에서, 신뢰성 지표와 인시던트 대응은 [SRE와 신뢰성](https://ingu627.github.io/cloud/sre-reliability/)에서 이어서 볼 수 있다.

- 서비스 분해의 트레이드오프와 경계를 정하는 판단 기준을 세운다
- 12-factor·이벤트 드리븐·API·데이터 패턴을 하나의 도구 상자로 엮는다
- 멀티테넌시 격리 모델과 데이터 계층 강제(RLS) 방식을 정리한다
- 고가용성(다중 AZ·쿼럼)과 재해 복구 4전략을 RTO/RPO로 비교한다
- 멀티 클라우드·마이그레이션 6R·ADR까지 큰 결정의 기록 방식을 짚는다

---

## 1. 모놀리식 vs 마이크로서비스

### 1.1 트레이드오프

| 축 | 모놀리식(Monolith) | 마이크로서비스(Microservices) |
| :--- | :--- | :--- |
| 배포 단위 | 하나(전체 동시 배포) | 서비스별 독립 배포 |
| 장애 격리 | 한 모듈 버그가 전체 다운 | 부분 열화(partial degradation) 가능 |
| 트랜잭션 | 단일 ACID 트랜잭션 | 분산 트랜잭션 → 사가/아웃박스 필요 |
| 팀 확장 | 커지면 조율 비용 폭증 | 팀 경계와 서비스 경계 정렬 가능 |
| 관측성 | 스택 트레이스 하나로 추적 | 분산 트레이싱(trace_id 전파) 필수 |
| 초기 속도 | 매우 빠름 | 느림(플랫폼 선투자) |
| 인프라 비용 | 낮음 | 높음(네트워크·관측성·CI/CD) |

### 1.2 분해 경계 정하기

- **권장 출발점은 모듈러 모놀리식(Modular Monolith)**: 배포는 하나지만 모듈 간 의존을 코드/패키지로 강제해 나중에 분해 비용을 낮춘다.
- 분해 경계는 기능 목록이 아니라 **변경 빈도·데이터 소유권·팀 경계(콘웨이 법칙, Conway's Law)** 로 정한다. 같은 데이터를 두 서비스가 쓰면 그것은 서비스가 아니라 분산 모놀리식(distributed monolith)이다.
- 분해 신호: ① 배포에 다른 팀 승인이 필요하다, ② 단일 DB 락 경합으로 특정 기능만 느리다, ③ 특정 모듈만 스케일 아웃하고 싶다, ④ 장애 하나가 전체를 멈춘다.
- 안티패턴: 공유 데이터베이스, 동기 호출 체인(A→B→C→D), 한 릴리스에 묶인 배포, 원격 호출을 로컬 함수처럼 쓰는 채팅티(chatty) 인터페이스.

---

## 2. 12-factor app

12-factor는 "컨테이너에서 굴러가고, 아무 노드에서나 교체 가능한" 프로세스를 만드는 최소 규약이다.

1. **Codebase** — 하나의 리포지토리, 여러 배포(dev/stg/prod).
2. **Dependencies** — 의존성 명시·격리(락 파일 커밋).
3. **Config** — 환경변수로 주입, 이미지에 굽지 않는다.
4. **Backing services** — DB·큐·캐시를 교체 가능한 부착 리소스로 취급.
5. **Build/Release/Run** — 세 단계 엄격 분리(릴리스 = 빌드 + 설정).
6. **Processes** — 무상태(stateless) 프로세스, 세션은 외부 저장소로.
7. **Port binding** — 앱이 스스로 포트를 바인딩(내장 서버).
8. **Concurrency** — 프로세스 모델로 수평 확장.
9. **Disposability** — 즉시 시작·정상 종료(SIGTERM 처리, 유예 시간).
10. **Dev/prod parity** — 개발·운영 환경 격차 최소화.
11. **Logs** — 표준출력으로 이벤트 스트림, 파일에 쓰지 않는다.
12. **Admin processes** — 마이그레이션·일회성 작업을 동일 이미지로 실행.

확장 버전(15-factor)에서 흔히 추가되는 것: **API 우선(API first)**, **원격 측정(telemetry) 내장**, **인증/인가를 애플리케이션 관심사로 명시**.

---

## 3. 이벤트 드리븐(Event-Driven)

### 3.1 큐 vs 스트림

| 항목 | 큐(Queue: SQS/RabbitMQ) | 스트림(Stream: Kafka/Kinesis) |
| :--- | :--- | :--- |
| 소비 모델 | 경쟁 소비자, 소비 후 삭제 | 오프셋 기반, 보존 기간 동안 재소비 가능 |
| 순서 | 보통 보장 안 함 | 파티션 키 단위 보장 |
| 확장 | 메시지 단위 | 파티션 수까지 병렬 |
| 활용 | 작업 분배(work queue) | 이벤트 소싱·리플레이·다수 구독자 |

### 3.2 전달 보장(Delivery guarantee)

- **at-most-once**: 유실 가능, 중복 없음.
- **at-least-once**: 유실 없음, 중복 가능 → 실무 기본값.
- **exactly-once**: 브로커 내부 트랜잭션 경계(Kafka 트랜잭션, Flink 체크포인트)에서만 성립한다. **외부 시스템까지 포함하면 exactly-once는 존재하지 않는다.** 따라서 "at-least-once + 멱등 소비자"가 정답이다.

### 3.3 멱등성(Idempotency)

- **멱등 키(idempotency key)** 를 메시지에 넣고, 소비자는 `processed_message` 테이블에 키를 원자적으로 삽입한다. 충돌 시 이미 처리된 메시지로 간주하고 스킵한다.
- 상태 변경은 `UPSERT` 또는 조건부 쓰기(`version = :expected_version`)로 만든다.
- 부작용(메일 발송, 결제 승인)은 반드시 키를 외부 API에도 전달한다.

### 3.4 재시도·DLQ

- 지수 백오프(exponential backoff) + 지터(jitter). 최대 재시도 후 **DLQ(Dead Letter Queue)** 로 보내고, DLQ 알림·재처리 절차를 문서화한다.
- 파티션이 막히는 **독성 메시지(poison pill)** 는 즉시 DLQ로 격리해야 소비 지연(lag) 폭주를 막는다.
- 스키마 진화(schema evolution)는 Avro/Protobuf + **스키마 레지스트리(Schema Registry)** 로 관리하고, BACKWARD 호환성을 기본으로 한다.

```sql
-- 아웃박스(Outbox): 도메인 상태 변경과 이벤트 발행을 같은 트랜잭션에 묶는다
BEGIN;
UPDATE account SET balance = balance - 100, version = version + 1
 WHERE id = :from_id AND balance >= 100;
INSERT INTO outbox (aggregate_type, aggregate_id, event_type, payload, created_at)
VALUES ('account', :from_id, 'MoneyDebited',
        jsonb_build_object('to', :to_id, 'amount', 100), now());
COMMIT;

-- 멱등 소비자: 같은 메시지가 두 번 와도 한 번만 반영된다
INSERT INTO processed_message (message_id, consumer, processed_at)
VALUES (:msg_id, 'ledger-writer', now())
ON CONFLICT (message_id) DO NOTHING;

INSERT INTO ledger_entry (id, account_id, amount, idempotency_key)
VALUES (gen_random_uuid(), :account_id, :amount, :msg_id)
ON CONFLICT (idempotency_key) DO NOTHING;
```

---

## 4. API 설계: Gateway, BFF, 버저닝

- **API Gateway** 책임: 라우팅, TLS 종료, 인증/인가, 레이트 리밋, 요청/응답 변환, 카나리 가중치. **비즈니스 로직은 넣지 않는다** — 넣는 순간 확장·테스트·버전 관리가 불가능해진다.
- **BFF(Backend for Frontend)**: 웹/모바일/파트너별로 집계·필터링 전용 서비스를 둔다. 모바일은 페이로드를 줄이고, 다중 백엔드 호출을 1회로 합쳐 레이턴시를 낮춘다. BFF가 늘어나면 코드 중복이 생기므로 공통 도메인 로직은 하위 서비스에 둔다.
- **버저닝**: URI(`/v1/…`)는 가시성·라우팅이 쉽고, 헤더/미디어 타입 버저닝은 URL을 깨끗하게 유지한다. 규칙은 하나로 통일한다.
- 하위 호환 규칙: 필드 **추가**는 허용, 필드 **삭제·타입 변경·의미 변경**은 금지. 폐기 시 `Deprecation`/`Sunset` 헤더와 마이그레이션 가이드를 함께 배포한다.
- 목록 API는 커서 기반 페이지네이션, 쓰기 API는 `Idempotency-Key` 헤더, 오류는 **RFC 9457(problem+json)** 같은 단일 포맷으로 통일한다.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: checkout
spec:
  parentRefs:
    - name: edge-gateway
  rules:
    - matches:
        - path: { type: PathPrefix, value: /v2/checkout }
      backendRefs:
        - name: checkout-v2
          port: 8080
          weight: 10   # 카나리 10%
        - name: checkout-v1
          port: 8080
          weight: 90
```

---

## 5. 데이터 패턴: CQRS, 사가, 아웃박스

- **CQRS(Command Query Responsibility Segregation)**: 쓰기 모델과 읽기 모델을 분리한다. 읽기는 비정규화된 프로젝션으로 조회 성능을 확보하지만 **결과적 일관성(eventual consistency)** 을 받아들여야 한다. 프로젝션은 이벤트 리플레이로 언제든 재생성 가능해야 한다(이것이 CQRS의 진짜 이점이다).
- **사가(Saga)**: 분산 트랜잭션을 로컬 트랜잭션 + **보상 트랜잭션(compensating transaction)** 으로 대체한다. 오케스트레이션(중앙 조정자)은 흐름이 명확하고, 코레오그래피(이벤트 체인)는 결합이 낮지만 전체 흐름 추적이 어렵다. 보상은 **멱등**해야 하고, 보상 실패 경로(수동 개입 대기열)를 반드시 설계한다.
- **아웃박스(Outbox)**: "DB 저장 + 브로커 발행"을 이중 쓰기(dual write)로 하면 반드시 한쪽만 성공한다. 같은 트랜잭션에 아웃박스 행을 쓰고, 폴링 퍼블리셔 또는 **CDC(Debezium)** 로 브로커에 전달한다. 순서 보장이 필요하면 아웃박스도 `aggregate_id` 기준으로 정렬해 발행한다.

---

## 6. 멀티테넌시(Multi-tenancy)

### 6.1 격리 모델

| 격리 모델 | 구조 | 장점 | 단점 |
| :--- | :--- | :--- | :--- |
| 사일로(Silo) | 테넌트별 인프라/DB | 최강 격리, BYOK 용이 | 비용·운영 부담 최대 |
| 풀(Pool) | 공유 스키마 + 테넌트 컬럼 | 비용 효율 최고 | 격리·노이지 네이버 위험 |
| 브릿지(Bridge) | 공유 인프라 + 테넌트별 스키마/DB | 균형점 | 마이그레이션·도구 복잡 |

### 6.2 테넌트 컨텍스트와 강제

- **테넌트 컨텍스트 전파**: 요청 → 서비스 → DB까지 `tenant_id`를 전파하고, DB에서 **행 수준 보안(RLS, Row-Level Security)** 으로 강제한다. 애플리케이션 `WHERE` 절에만 의존하면 언젠가 반드시 유출된다.
- 노이지 네이버 방지: 테넌트별 쿼터·레이트 리밋·커넥션 풀 상한.
- 규제 요구: 테넌트별 암호화 키(BYOK), 테넌트 단위 삭제(GDPR/개인정보 삭제), 테넌트 데이터 이동(마이그레이션 경로).

```sql
-- PostgreSQL RLS: 애플리케이션 버그가 있어도 다른 테넌트 행은 보이지 않는다
ALTER TABLE invoice ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON invoice
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- 커넥션 풀에서 요청 단위로 테넌트를 고정 (RLS는 커넥션 변수에 의존)
SELECT set_config('app.tenant_id', '7c9e...', true);
```

---

## 7. 고가용성(HA)

### 7.1 SPOF 제거와 다중 AZ

- **SPOF(Single Point of Failure) 제거** 순서: 진입점(LB 다중화) → 컴퓨트(다중 인스턴스·다중 AZ) → 데이터(복제·자동 승격) → 의존성(DNS·시크릿·레지스트리).
- **다중 AZ**: 폭발 반경(blast radius)은 AZ 단위다. 컴퓨트를 AZ에 골고루 배치하고, 한 AZ 장애 시에도 쿼럼이 유지되는지 확인한다.
- **쿼럼 함정**: 2개 AZ 구성은 한 AZ가 죽으면 과반(quorum)을 잃어 클러스터가 응답하지 못한다. etcd·ZooKeeper·Kafka 컨트롤러는 **3 AZ(홀수 노드)** 가 최소다.

### 7.2 애플리케이션 레벨 대응

- 애플리케이션 레벨: 타임아웃, 재시도(+지터, 상한), 서킷 브레이커, 백프레셔, 커넥션 풀 사이즈. 재시도 폭풍(retry storm)은 장애를 증폭시킨다.
- 정상 종료(graceful shutdown): `preStop` 지연 + 충분한 `terminationGracePeriodSeconds`로 인플라이트(in-flight) 요청을 드레이닝한다. 준비(readiness) 실패 → 엔드포인트 제거 → 종료 순서를 지킨다.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-api
spec:
  replicas: 6
  strategy:
    rollingUpdate: { maxUnavailable: 0, maxSurge: 1 }
  selector:
    matchLabels: { app: payment-api }
  template:
    metadata:
      labels: { app: payment-api }
    spec:
      terminationGracePeriodSeconds: 60
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels: { app: payment-api }
      containers:
        - name: app
          image: registry.example.com/payment-api:1.42.0
          ports: [{ containerPort: 8080 }]
          readinessProbe:
            httpGet: { path: /healthz/ready, port: 8080 }
            periodSeconds: 5
          livenessProbe:
            httpGet: { path: /healthz/live, port: 8080 }
            periodSeconds: 10
          lifecycle:
            preStop:
              exec: { command: ["sh", "-c", "sleep 10"] }
          resources:
            requests: { cpu: 250m, memory: 512Mi }
            limits: { memory: 512Mi }
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata: { name: payment-api }
spec:
  minAvailable: 4
  selector: { matchLabels: { app: payment-api } }
```

```bash
# 노드가 실제로 3개 AZ에 분산되어 있는지, 파드가 한 AZ에 몰려 있지 않은지 확인
kubectl get nodes -L topology.kubernetes.io/zone --no-headers | awk '{print $NF}' | sort | uniq -c

kubectl get pods -l app=payment-api -o json \
  | jq -r '.items[] | [.spec.nodeName, .status.phase] | @tsv' \
  | while read -r node phase; do
      az=$(kubectl get node "$node" -o jsonpath='{.metadata.labels.topology\.kubernetes\.io/zone}')
      echo "$az $phase"
    done | sort | uniq -c

# DR 리허설: 백업 존재 확인 후 복원 소요 시간(RTO)을 실제로 측정
velero backup get | head -5
time velero restore create --from-backup daily-2026-10-09 --namespace-mappings prod:dr-restore
```

---

## 8. 재해 복구(DR)

### 8.1 RTO / RPO

- **RTO(Recovery Time Objective)**: 장애 발생 후 서비스가 복구될 때까지 허용되는 시간.
- **RPO(Recovery Point Objective)**: 허용되는 데이터 손실 시점(얼마나 과거 데이터까지 잃어도 되는가).
- 두 값이 곧 예산이다. 네 가지 DR 전략은 **비용·복잡도가 커지는 순서대로 RTO/RPO가 짧아지는 관계**로 놓인다. RTO/RPO를 한 단계 낮추는 일은 곧 상시로 켜 두는 예비 용량과 리전 간 복제 트래픽을 한 계단 더 사는 일이다([AWS Well-Architected Reliability Pillar, REL13-BP02](https://docs.aws.amazon.com/pdfs/wellarchitected/latest/reliability-pillar/wellarchitected-reliability-pillar.pdf)).

![재해 발생 시점을 기준으로 RPO는 손실을 감수하는 과거 구간, RTO는 서비스가 정상화되기까지의 시간을 나타낸다](/assets/images/cloud/official-cloud-architecture-dr.webp)

출처: Google Cloud Architecture Center — Architecting disaster recovery for cloud infrastructure outages (https://cloud.google.com/architecture/disaster-recovery)

### 8.2 4가지 전략

아래 전략 구분과 RTO/RPO 범위는 AWS Well-Architected Reliability Pillar(REL13-BP02)가 전략별로 제시하는 목표치를 범위로 옮긴 대표값이다. 모두 리전 간 복제가 이미 동작하고 DR 리전에 최소 용량이 예열되어 있다는 전제의 목표치이며, 실제 달성치는 데이터 규모·리전 간 복제 지연·리전별 서비스 쿼터에 따라 달라진다.

| 전략 | RTO | RPO | 비용/복잡도 | 설명 |
| :--- | :--- | :--- | :--- | :--- |
| 백업·복원(Backup & Restore) | 시간\~일 | 시간 | 낮음 | 백업만 다른 리전에, 인프라는 IaC로 재생성 |
| 파일럿 라이트(Pilot Light) | 10분\~1시간 | 분 | 중간 | 데이터 복제 + 최소 컴퓨트, 필요 시 확장 |
| 웜 스탠바이(Warm Standby) | 분 | 초 | 중상 | 축소판 스택 상시 운영, 트래픽만 전환 |
| 액티브-액티브(Active-Active) | 초 | 거의 0 | 높음 | 양 리전 동시 서비스, 데이터 충돌 해소 필요 |

![DR 전략 매트릭스](/assets/images/cloud/dr-strategy-matrix.png)

위 다이어그램은 네 가지 DR 전략을 RTO·RPO·비용/복잡도 축에서 비교한 것이다. 백업·복원에서 액티브-액티브로 갈수록 RTO/RPO는 짧아지지만 비용과 운영 복잡도는 계단식으로 올라가므로, 서비스별 목표치에 맞는 전략을 따로 고른다.

- **백업·복원에서 RPO는 백업 주기가 결정한다.** 백업 주기가 24시간이면 최악의 경우 하루치가 사라지고, 자동·연속 백업으로 PITR(point-in-time recovery)을 켜면 경우에 따라 5분 수준까지 낮출 수 있다. 같은 이름의 전략 안에서도 RPO가 두 자릿수 배 차이 난다.
- 액티브-액티브의 대가는 **쓰기 충돌**이다. 지역별 쓰기 분리(홈 리전), 충돌 해소 규칙(last-write-wins, CRDT), 전역 일관성 요구사항을 먼저 정의한다. 쓰기가 단일 리전이면 그것은 액티브-패시브에 가깝다.
- 백업은 **3-2-1**(3사본, 2매체, 1오프사이트) + **불변 백업(Object Lock/immutability)** 으로 랜섬웨어·실수 삭제를 방어한다.
- **복원하지 않은 백업은 백업이 아니다.** 분기별 게임데이(game day)에서 실제 복원을 수행하고 소요 시간을 기록한다.
- DNS 페일오버 시 TTL을 낮추고(예: 30\~60초), 헬스체크가 애플리케이션 준비 상태(`/healthz/ready`)를 보게 한다. 클라이언트 재시도·서킷 브레이커가 없으면 DNS 전환만으로는 복구되지 않는다.

```hcl
# 파일럿 라이트: DR 리전에는 최소 컴퓨트 + 복제된 데이터만 유지하고, 실패 시 라우팅을 전환한다
resource "aws_route53_health_check" "primary" {
  fqdn              = "api.example.com"
  type              = "HTTPS"
  resource_path     = "/healthz/ready"
  failure_threshold = 3
  request_interval  = 10
}

resource "aws_route53_record" "api_primary" {
  zone_id         = var.zone_id
  name            = "api.example.com"
  type            = "A"
  set_identifier  = "failover"
  health_check_id = aws_route53_health_check.primary.id
  failover_routing_policy { type = "PRIMARY" }
  alias {
    name    = var.primary_alb_dns
    zone_id = var.primary_alb_zone
  }
}

resource "aws_route53_record" "api_secondary" {
  zone_id        = var.zone_id
  name           = "api.example.com"
  type           = "A"
  set_identifier = "failover"
  failover_routing_policy { type = "SECONDARY" }
  alias {
    name    = var.dr_alb_dns
    zone_id = var.dr_alb_zone
  }
}

resource "aws_rds_global_cluster" "main" {
  global_cluster_identifier = "aurora-global-prod"
  engine                    = "aurora-postgresql"
  engine_version            = "16.4"
  storage_encrypted         = true
}
```

![멀티리전 트래픽 라우팅과 장애 조치](/assets/images/cloud/multi-region-patterns.png)

위 그림은 멀티리전 구성에서 트래픽이 어떻게 라우팅되고 장애 시 어떤 순서로 다른 리전으로 조치(failover)되는지 나타낸다. 헬스체크 실패를 감지하면 DNS/전역 LB가 트래픽을 DR 리전으로 돌리고, 데이터 계층은 복제본 승격과 함께 새 쓰기 지점을 갖는다.

---

## 9. 멀티 클라우드 / 하이브리드 트레이드오프

| 항목 | 이점 | 비용/위험 |
| :--- | :--- | :--- |
| 공급자 장애 격리 | 단일 벤더 전면 장애 회피 | 두 배의 운영·보안·컴플라이언스 부담 |
| 규제·데이터 주권 | 국가/산업 요건 충족 | 리전·이그레스 비용 증가 |
| 협상력 | 벤더 락인 완화 | 최소공통분모 기능만 사용하게 될 위험 |
| 하이브리드(온프레미스+클라우드) | 기존 투자 활용, 저지연 연동 | 네트워크(Direct Connect/ExpressRoute) 단일 경로가 SPOF |

- **데이터 중력(data gravity)** 과 **이그레스(egress) 비용**이 멀티 클라우드의 실제 청구서다. 데이터가 어디에 쌓이는지가 이동 가능성을 결정한다.
- 추상화 계층(Kubernetes, Terraform, 클라우드 간 관리 플레인)은 이식성을 높이지만, 관리형 서비스의 차이를 감추지는 못한다. "Kubernetes만 쓰면 이식 가능하다"는 착각이 가장 흔한 실패 원인이다.
- 하이브리드는 DNS 분할 뷰(split-horizon), 인증 신뢰(페더레이션), 데이터 동기화 일관성을 반드시 문서화한다.

---

## 10. 마이그레이션 6R

| 전략 | 내용 | 노력 | 적합 상황 |
| :--- | :--- | :--- | :--- |
| Rehost (Lift & Shift) | 그대로 이전 | 낮음 | 속도 최우선, 레거시 무수정 |
| Replatform | 관리형 서비스로 치환(자체 DB → RDS) | 중간 | 운영 부담 축소 |
| Repurchase | SaaS로 대체 | 중간 | 자체 구현 가치가 낮음 |
| Refactor / Re-architect | 클라우드 네이티브 재설계 | 높음 | 확장성·비용이 사업 제약 |
| Retire | 폐기 | 낮음 | 미사용 시스템 |
| Retain | 유지(당분간 그대로) | — | 규제·의존성으로 불가 |

- 점진 전환은 **스트랭글러 피그(Strangler Fig)** 패턴으로: 프록시/게이트웨이 앞단에서 트래픽을 조금씩 신규로 이동한다.
- 데이터 전환은 **CDC(Change Data Capture)** 로 이중 쓰기 리스크를 줄이고, 컷오버 리허설과 롤백 플랜(되돌릴 수 있는 시점)을 사전에 정의한다.
- 컷오버 당일에는 읽기 전용 유지보수 창, 검증 쿼리, 원본 스냅샷 보존을 준비한다.

---

## 11. ADR(Architecture Decision Record) 문화

- ADR은 "무엇을 결정했는가"가 아니라 **왜 그렇게 결정했는지와 무엇을 포기했는지**를 남기는 문서다. 6개월 뒤의 자신과 신규 입사자를 위한 것이다.
- 구조: **Title / Status(Proposed·Accepted·Superseded·Deprecated) / Context / Decision / Consequences / Alternatives**.
- 리포지토리에 `docs/adr/0007-outbox-for-order-events.md` 형태로 두고, PR 리뷰로 승인한다. 결정이 바뀌면 기존 ADR을 지우지 않고 `Superseded by ADR-0012` 만 추가한다.
- 되돌리기 비용이 큰 결정(데이터 저장소, 서비스 경계, 인증 모델, 리전 전략)에만 쓴다. 사소한 결정에 ADR을 남기면 아무도 읽지 않는다.

```markdown
# ADR-0007: 주문 이벤트 발행에 아웃박스 패턴 적용

- Status: Accepted (2026-10-10)

## Context
주문 커밋 후 Kafka로 직접 발행하는 구조에서, 브로커 장애 시 이벤트 유실이 발생했다.

## Decision
주문 DB와 동일 트랜잭션에 outbox 테이블을 기록하고, Debezium CDC로 발행한다.

## Consequences
- (+) 발행 원자성 확보, 리플레이 가능
- (-) 발행 지연 수십 ms, outbox 테이블 정리 잡 필요
- Alternatives: 2PC(운영 부담), 직접 발행 + 재시도(유실 위험)
```

---

## 12. 실전 함정(Gotcha)과 흔한 에러

| 증상 | 원인 | 해결 |
| :--- | :--- | :--- |
| `OOMKilled` 반복 | `limits.memory`가 실제 피크보다 낮거나 JVM 힙 미설정 | 힙 상한을 limit의 60\~75%로, requests=limits로 Guaranteed 유도 |
| `CrashLoopBackOff` | 시작 시 백엔드 의존성을 전제, readiness와 liveness 혼용 | liveness는 프로세스 생존만, 의존성은 readiness로 분리 + startupProbe |
| 컨슈머 랙(lag) 폭주 | 독성 메시지가 파티션을 막음 | 재시도 상한 + DLQ 격리, 파티션 키 재검토 |
| 중복 결제/중복 알림 | at-least-once 소비에 멱등 처리 없음 | 멱등 키 + `ON CONFLICT DO NOTHING` |
| 장애 조치(failover) 후 커넥션 고갈 | 승격된 DB가 기존 풀 크기를 감당 못함 | 풀 상한 축소, 재시도 + 지터, 서킷 브레이커 |
| DNS 전환 후에도 트래픽이 구 리전으로 | TTL 캐시·클라이언트 DNS 캐시 | TTL 단축, 클라이언트 재시도/디스커버리 사용 |
| 노드 드레인(drain)이 영구 대기 | PDB `minAvailable`이 현재 가용 파드 수와 동일 | PDB를 여유 있게, replicas ≥ minAvailable +1 |
| A 테넌트가 B 데이터 조회 | 앱 레벨 `WHERE tenant_id`만 존재 | RLS로 DB에서 강제 + 통합 테스트에 교차 테넌트 케이스 |
| 2 AZ 클러스터가 한 AZ 장애 시 전체 정지 | 과반 쿼럼 상실 | 3 AZ(홀수) 토폴로지, 컨트롤 플레인 노드 분산 |

---

## 13. 실무 체크리스트

- [ ] 서비스 경계가 **데이터 소유권** 기준으로 정의되어 있고, 공유 DB·동기 호출 체인이 없다.
- [ ] 모든 설정이 환경변수/시크릿으로 외부화되어 있고 이미지에 하드코딩된 값이 없다.
- [ ] 모든 비동기 소비자가 **멱등**하며, 재시도 상한·백오프·DLQ와 재처리 절차가 문서화되어 있다.
- [ ] API 버저닝 정책(하위 호환 규칙, 폐기 절차, Sunset 헤더)이 단일 문서로 합의되어 있다.
- [ ] 쓰기 API에 `Idempotency-Key`가 적용되고, DB 변경과 이벤트 발행이 아웃박스로 원자적이다.
- [ ] 테넌트 격리 모델이 명시되어 있고, RLS 등 **데이터 계층에서 강제**되며 교차 테넌트 유출 테스트가 있다.
- [ ] 컴퓨트가 다중 AZ에 분산(topologySpreadConstraints/anti-affinity), 쿼럼 계층은 3 AZ 홀수 노드다.
- [ ] 서비스별 **RTO/RPO 목표가 수치로 합의**되어 있고, 그에 맞는 DR 전략(백업·복원/파일럿 라이트/웜 스탠바이/액티브-액티브)이 선택되어 있다.
- [ ] 최근 6개월 내 실제 **복원 리허설**을 수행했고, 측정된 RTO가 목표치 이내였다.
- [ ] 데이터 저장소·서비스 경계·리전 전략 등 되돌리기 비용이 큰 결정에 ADR이 존재하고, Superseded 이력이 관리된다.

---

## 14. 정리

- **경계가 곧 비용이다.** 모놀리식과 마이크로서비스의 선택은 데이터 소유권·변경 빈도·팀 경계로 정하고, 공유 DB와 동기 호출 체인은 분산 모놀리식의 신호로 본다.
- **계약과 전달을 분리한다.** 12-factor·게이트웨이·BFF로 클라이언트 계약을 안정화하고, 버저닝과 하위 호환 규칙을 하나의 문서로 합의한다.
- **전달은 at-least-once로 가정한다.** 멱등 키·아웃박스·DLQ로 중복과 유실을 흡수하고, CQRS·사가는 결과적 일관성을 전제로 설계한다.
- **격리는 데이터 계층에서 강제한다.** 테넌트 컨텍스트를 끝까지 전파하고 RLS로 막으며, 노이지 네이버는 쿼터로 통제한다.
- **복구는 사서 산다.** 다중 AZ·홀수 쿼럼으로 SPOF를 제거하고, RTO/RPO 목표에 맞는 DR 전략을 골라 복원 리허설로 검증한다.

---

## References

- AWS Well-Architected Framework — [Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html)
- AWS Whitepaper — [Disaster Recovery of Workloads on AWS: Recovery in the Cloud](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-workloads-on-aws.html)
- Microsoft Learn — [Azure Well-Architected Framework: Reliability](https://learn.microsoft.com/azure/well-architected/reliability/)
- Google Cloud Architecture Center — [Disaster recovery planning guide](https://cloud.google.com/architecture/dr-scenarios-planning-guide)
- The Twelve-Factor App — [12-factor](https://12factor.net/ko/)
- Kubernetes Documentation — [Pod Topology Spread Constraints](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/)
