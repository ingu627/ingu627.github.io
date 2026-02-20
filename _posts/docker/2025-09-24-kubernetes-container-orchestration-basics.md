---
layout: single
title: 'Docker Compose, Ingress, PV, Managed Kubernetes: 프로덕션 로드맵'
excerpt: '멀티 컨테이너 정의(Docker Compose) → L7 트래픽 게이트웨이(Ingress) → 상태 데이터 영속성(PV/PVC/StorageClass) → 관리형 쿠버네티스(EKS/GKE/AKS) 선택까지 필수 개념과 실전 예제를 단계별로 정리한다.'
categories: [docker]
tags: [도커 컴포즈, docker compose, 인그레스, ingress, 퍼시스턴트 볼륨, pv, pvc, storageclass, kubernetes, k8s, eks, gke, aks, 관리형 쿠버네티스]
toc: true
toc_sticky: false
sidebar_main: false
date: 2025-09-24
last_modified_at: 2025-09-24
redirect_from:
  - /docker/kubernetes1/
---

<br>

- 단일 도커 컨테이너를 성공적으로 실행했다면, 당신은 이미 컨테이너 기술의 강력함을 맛본 것이다. 하지만 실제 프로덕션 환경은 단 하나의 컨테이너만으로 이루어지지 않는다. 웹 서버, 데이터베이스, 캐시, 메시지 큐 등 수많은 서비스가 유기적으로 연결되어 하나의 거대한 애플리케이션을 구성한다. 바로 이 지점에서 우리는 새로운 도전에 직면하게 된다.

- 이 글의 목표는 단일 컨테이너의 세계를 넘어, 실제 프로덕션 환경에서 마주할 네 가지 핵심 과제를 해결하는 방법을 탐험하는 것이다.

- **멀티 컨테이너 관리**: 여러 컨테이너를 어떻게 효율적으로 정의하고, 연결하고, 한 번에 실행할 것인가?
- **외부 트래픽 라우팅**: 클러스터 외부의 사용자가 어떻게 안전하고 지능적으로 내부 서비스에 접근하게 할 것인가?
- **데이터 영속성**: 컨테이너가 사라져도 중요한 데이터는 어떻게 안전하게 보존할 것인가?
- **클러스터 운영**: 복잡한 쿠버네티스 클러스터 자체의 설치와 유지보수 부담을 어떻게 줄일 것인가?

- 이 글은 위 흐름을 (Compose → Ingress → PV/PVC/StorageClass → Managed K8s) 4단계 로드맵으로 압축한다. 전 구간의 공통 철학은 “절차를 선언형 추상화로 치환해 재현성과 운영 민첩성을 높인다”이다.

<br>

## 1. Docker Compose: 멀티 컨테이너 애플리케이션 간소화하기

- 컨테이너 기술을 처음 접할 때 `docker run` 명령어는 마법과 같다. 단 한 줄의 명령어로 격리된 환경에서 애플리케이션을 실행할 수 있기 때문이다. 하지만 애플리케이션이 웹 서버, 데이터베이스, 캐시 등으로 복잡해지면서 이 마법은 곧 한계를 드러낸다.
- `docker run` 명령어를 나열하는 방식은 명령어 오타, 실행 순서 의존성, 설정값 불일치 등 '명령어의 지옥(CLI hell)'으로 이어져 개발 생산성을 심각하게 저해한다.
- **도커 컴포즈(Docker Compose)**는 이러한 문제를 해결하기 위해 등장했다. 여러 컨테이너로 구성된 애플리케이션과 그에 필요한 모든 구성(네트워크, 볼륨 등)을 단 하나의 YAML 파일에 '선언적(declarative)'으로 정의하고, `docker compose up`이라는 단일 명령어로 전체 애플리케이션을 관리할 수 있게 해주는 도구다.
- 이는 '어떻게' 실행할지 지시하는 '명령형(imperative)' 방식에서, 최종적으로 갖춰야 할 '원하는 상태(desired state)'를 정의하는 '선언형' 방식으로의 전환을 의미한다.
- 이는 인프라를 코드로 관리(Infrastructure as Code, IaC)하는 철학의 시작이며, 쿠버네티스와 같은 더 거대한 오케스트레이션 시스템이 작동하는 방식과도 일맥상통한다.

### 1.1 docker run의 한계와 도커 컴포즈의 등장 배경

- 하나의 웹 애플리케이션을 생각해보자. 이 애플리케이션은 사용자 요청을 처리하는 웹 서버(예: Node.js), 데이터를 저장하는 데이터베이스(예: MySQL), 그리고 성능 향상을 위한 캐시(예: Redis)로 구성될 수 있다. 이 세 가지 구성 요소를 각각 컨테이너로 실행하려면, 길고 복잡한 `docker run` 명령어들을 터미널에 차례로 입력해야 한다.

<script src="https://gist.github.com/ingu627/5d89d43519509d214fd3476b716e8a4b.js"></script>

- 이 방식은 다음과 같은 심각한 문제점을 안고 있다.[^1]
  - **복잡성과 실수 가능성**: 명령어는 길고 복잡하며, 포트 번호, 볼륨 경로, 환경 변수 등에서 오타가 발생하기 쉽다.
  - **의존성 관리의 어려움**: 웹 애플리케이션은 데이터베이스와 캐시가 먼저 실행되어야 한다. 이 시작 순서를 수동으로 관리해야 한다.
  - **네트워킹의 번거로움**: 컨테이너들이 서로 통신하려면 `--link` 옵션(현재는 레거시 기능)을 사용하거나 수동으로 도커 네트워크를 생성하고 각 컨테이너를 연결해야 한다.
  - **재현 불가능성**: 이 명령어들을 문서화해두지 않으면, 다른 개발자가 동일한 환경을 구성하거나 나중에 자신이 다시 환경을 구축하기가 매우 어렵다.

### 1.2 핵심 개념: 서비스, 네트워크, 볼륨

- 도커 컴포즈는 애플리케이션을 세 가지 핵심 구성 요소로 추상화하여 관리한다. 이들은 `docker-compose.yml` 파일의 최상위 키인 `services`, `networks`, `volumes`에 해당한다.[^7]

- **서비스(Services)**: 애플리케이션을 구성하는 개별 컨테이너에 대한 추상적인 정의다. 사용할 도커 이미지, 포트 매핑, 환경 변수 등 컨테이너 실행에 필요한 모든 설정을 포함한다.
- **네트워크(Networks)**: 서비스 간의 통신을 담당한다. 컴포즈는 기본적으로 프로젝트마다 격리된 가상 네트워크를 자동으로 생성하며, 컨테이너들은 서비스 이름을 호스트 이름처럼 사용하여 서로 쉽게 통신할 수 있다.
- **볼륨(Volumes)**: 컨테이너의 비영속적인 파일 시스템 문제를 해결하고 데이터를 영구적으로 저장하기 위한 메커니즘이다. 컨테이너가 삭제되거나 재생성되어도 데이터는 볼륨에 안전하게 보존된다.

### 1.3 docker-compose.yml 완벽 분석

<img width="800" height="262" alt="image" src="https://gist.github.com/user-attachments/assets/3f25c653-3d90-418b-bee5-4bcfa8e19ff3" />

- `docker-compose.yml` 파일은 애플리케이션 스택의 청사진이다. `docker run` 명령어의 복잡한 옵션들이 이 파일의 간결한 키-값 쌍으로 어떻게 변환되는지는 아래 표와 같다.

<br>

| 기능 (Feature) | docker run 명령어 (Imperative Command) | docker-compose.yml 설정 (Declarative Configuration) |
|---|---|---|
| 이미지 지정 | `docker run redis:alpine` | `image: "redis:alpine"` |
| 포트 포워딩 | `docker run -p 8000:5000...` | `ports: - "8000:5000"` |
| 볼륨 마운트 | `docker run -v mydata:/data...` | `volumes: - mydata:/data` |
| 환경 변수 | `docker run -e MYSQL_ROOT_PASSWORD=secret...` | `environment: - MYSQL_ROOT_PASSWORD=secret` |
| 컨테이너 이름 | `docker run --name my-web...` | `container_name: my-web` |
| 네트워크 연결 | `docker run --network my-net...` | `networks: - my-net` |

- 주요 키들의 역할은 다음과 같다.
  - **services**: 애플리케이션을 구성하는 서비스들을 정의하는 최상위 키.
  - **build**: Dockerfile이 있는 경로를 지정하여 이미지를 직접 빌드할 때 사용한다.
  - **image**: 도커 허브나 다른 레지스트리에서 가져올 이미지의 이름을 지정한다.
  - **ports**: `HOST:CONTAINER` 형식으로 호스트와 컨테이너 간의 포트를 매핑한다.
  - **environment**: 컨테이너 내에서 사용할 환경 변수를 설정한다.
  - **volumes**: 명명된 볼륨이나 호스트 경로를 컨테이너 내부 경로에 마운트한다.
  - **depends_on**: 서비스 간의 시작 순서 의존성을 정의한다.
  - **networks**: 서비스가 연결될 네트워크를 지정한다.

<br>

### 1.4 예제: FastAPI와 Redis 카운터 애플리케이션 구축하기 [^48]

- 이론을 바탕으로 실제 애플리케이션을 도커 컴포즈로 구축해본다. 사용자가 웹사이트에 방문할 때마다 방문 횟수를 Redis에 저장하고 화면에 보여주는 간단한 FastAPI 웹 애플리케이션이다.

- **1단계: 프로젝트 디렉터리 구성**
  - 프로젝트를 위한 디렉터리를 만들고 `main.py`, `requirements.txt`, `Dockerfile`, `docker-compose.yml` 파일을 생성한다.

<script src="https://gist.github.com/ingu627/e4aea9423ba3a6d7ffb2671551a4460e.js"></script>

- **2단계: FastAPI 애플리케이션 및 의존성 작성**
  - `main.py`: FastAPI를 사용해 웹 서버를 만들고, 비동기 Redis 클라이언트를 통해 'hits'라는 키의 값을 1씩 증가시킨다. 여기서 중요한 점은 IP 주소 대신 서비스 이름인 `redis`를 호스트 주소로 사용한다는 것이다. 이는 도커 컴포즈가 `web` 서비스와 `redis` 서비스를 동일한 네트워크에 연결하고, 서비스 이름을 DNS처럼 해석해주기 때문에 가능하다.
  - `requirements.txt`: `fastapi`, `uvicorn`, `redis` 라이브러리를 명시한다.

<script src="https://gist.github.com/ingu627/6c366e76ba2122ad1d029c8fad4db3c3.js"></script>

- **3단계: Dockerfile 및 docker-compose.yml 작성**
  - `Dockerfile`: FastAPI 애플리케이션을 실행할 도커 이미지를 빌드한다.
  - `docker-compose.yml`: `web`과 `redis` 두 개의 서비스를 정의한다. `web` 서비스는 `Dockerfile`을 사용해 이미지를 빌드하고, `depends_on`을 통해 `redis` 서비스가 시작된 후에 시작되도록 설정한다.

<script src="https://gist.github.com/ingu627/73f0ef49fa500173965697173bf13660.js"></script>

```bash
# requirements.txt
fastapi
uvicorn[standard]
redis
```

- **4단계: 애플리케이션 실행**
  - 터미널에서 `docker compose up --build` 명령을 실행하면, 컴포즈가 네트워크 생성, 이미지 빌드, 컨테이너 생성 및 연결을 자동으로 수행한다. 웹 브라우저에서 `http://localhost:8000`에 접속하여 페이지를 새로고침할 때마다 카운터가 증가하는 것을 확인할 수 있다.

<script src="https://gist.github.com/ingu627/8284add82fa4207ccf528a5d199990cd.js"></script>

<br>

### 실행 체크리스트

- build context 올바른가
- 8000 포트 충돌 시 호스트 포트만 변경
- Redis 준비 전 카운터 증가 호출 실패 → 재시도 또는 `setnx`
- 레이어 캐시 적중 확인 (requirements.txt 변경 여부)

### 문제 해결 패턴

| 증상 | 원인 | 해결 |
|------|------|------|
| Redis 연결 오류 | 스타트업 레이스 | 재시도 or healthcheck |
| 카운터 초기화 | 볼륨 미사용 | Redis persistence + Volume |
| 느린 응답 | 동기 블로킹 | asyncio 전환 |

<br>

## 2. 쿠버네티스 인그레스(Ingress)로 외부 트래픽 관리하기

<img width="641" height="600" alt="image" src="https://gist.github.com/user-attachments/assets/158578bc-fbcb-40ca-883a-1dccb1cd092a" />

- 쿠버네티스에 여러 애플리케이션 파드를 배포한 뒤 가장 먼저 부딪히는 질문은 “외부 사용자가 이 서비스들에 어떻게 접근하게 할 것인가?”이다. 단순히 `kubectl port-forward` 나 개별 Service 노출로는 프로덕션 요구(보안, 비용, 확장, 가시성)를 만족시키기 어렵다. 외부 트래픽 노출 방식은 점진적으로 아래 단계를 거치며 성숙해진다.

- **NodePort**: 가장 간단한 방법이다. 클러스터의 모든 워커 노드(Worker Node)에 30000–32767 범위의 특정 포트를 열고(NodeIP:NodePort 형태), 그 포트로 들어오는 트래픽을 해당 Service 뒤에 있는 파드로 전달한다. 개발·테스트 환경에서는 빠르게 확인하기 좋아 유용하다. 그러나 프로덕션 관점에서는 여러 한계가 드러난다.
  - 노드 IP 가 변하면(오토스케일/장애 교체) 접근 엔드포인트가 바뀐다.
  - 포트 범위가 제한되고 80/443 같은 표준 포트를 직접 사용할 수 없다.
  - 각 Service 마다 임의 포트를 기억/문서화해야 하므로 운영 복잡도가 증가한다.
  - 특정 노드 장애 시 그 노드로 향하던 연결은 즉시 끊기며, L7 지능형 라우팅/관측 기능이 없다.

- **LoadBalancer**: 클라우드 환경에서 가장 널리 쓰이는 다음 단계다. `type: LoadBalancer` Service 를 생성하면 쿠버네티스가 클라우드 제공업체(AWS, GCP, Azure 등) API 와 통신해 외부 로드 밸런서(공인 IP 포함)를 자동 프로비저닝한다. 안정적이고 단일 IP 제공, 헬스체크, 기본 L4 분산 기능으로 운영 친화적이다. 다만 구조적 비용 문제가 있다.
  - Service 를 하나 외부에 노출할 때마다 새로운 로드 밸런서가 1개씩 생성된다.
  - 마이크로서비스 수가 수십/수백 개가 되면 로드 밸런서 비용이 선형으로 증가한다.
  - L7 (호스트/경로) 기반 복합 라우팅과 중앙 집중 TLS/인증/관측 처리를 위해 추가 프록시 계층이 또 필요해질 수 있다.

- **Ingress (L7 진입 게이트웨이)**: NodePort 와 LoadBalancer 의 한계를 극복하기 위해 등장한 추상화다. 단 하나의 (또는 소수의) 외부 로드 밸런서 + 공인 IP 를 통해 HTTP/HTTPS 트래픽을 수신하고, **호스트명**과 **URL 경로** 규칙을 기반으로 클러스터 내부의 여러 Service 로 지능적으로 라우팅한다. 이로써:
  - 다수 서비스 → 단일 진입점 으로 비용 및 관리 단순화
  - TLS 종료, 인증/인가, Rate Limiting, 로깅/메트릭, Observability 헤더 주입 등을 중앙 집중
  - 새 마이크로서비스 추가 시 LB 재프로비저닝 없이 Ingress 규칙(YAML)만 갱신

- 아래 비교 표(2.1)는 이러한 세 접근 방식을 계층/비용/유연성 관점에서 나란히 놓고 인그레스가 어디에서 가치를 제공하는지 시각화한다. 이어서 Ingress 리소스와 Controller 의 역할 구분, 활용 패턴을 살펴본다.

### 2.1 Service 타입 한계[^15]

| 유형 | 계층 | 외부노출 | 비용 | 라우팅 유연성 | 비고 |
|------|------|----------|------|---------------|------|
| ClusterIP | L4 | 불가 | 없음 | 없음 | 내부 통신 |
| NodePort | L4 | 가능(NodeIP:포트) | 없음 | 제한 | 고정 포트 범위 |
| LoadBalancer | L4 | 가능(Public IP) | 서비스당 1개 | 없음 | 비용 증가 |
| Ingress | L7 | 단일 LB + 다중 Service | Controller 1개 | 호스트/경로 | 중앙 관문 |

### 2.2 Ingress 리소스 vs Controller[^20]

- **Ingress(YAML)**: 규칙 선언
- **Controller(NGINX/HAProxy/Envoy 등)**: API watch 후 실제 라우팅 구성
- 둘 다 있어야 동작한다.

### 2.3 요청 흐름

사용자 → (클라우드 LB 혹은 NodePort) → Ingress Controller → 규칙 매칭 → Service → Pod

### 2.4 Path 기반 라우팅

<script src="https://gist.github.com/ingu627/23076fadc76237f8c72fe7595818baa6.js"></script>

### 2.5 Host 기반 라우팅

<script src="https://gist.github.com/ingu627/109b03714fc956954521f4a594d43e0d.js"></script>

### 2.6 TLS 적용

<script src="https://gist.github.com/ingu627/00cbd0788c85980bb822e5841e01aba8.js"></script>

<br>

<script src="https://gist.github.com/ingu627/eb68ba76ba05050fc1afd38448e8083b.js"></script>

<br>

## 3. 데이터 영속성: 컨테이너 생명주기와 독립적인 저장소 관리

- 쿠버네티스에서 애플리케이션을 파드(Pod)로 실행하는 것은 배포/스케일/자가치유 측면에서 매우 효율적이지만, 한 가지 근본적 한계를 품고 있다. 바로 파드와 컨테이너 파일 시스템이 **본질적으로 비영속적(ephemeral)** 이라는 점이다. 파드는 언제든 재스케줄되거나 교체될 수 있고, 그 순간 컨테이너 레이어에 쌓여 있던 변경 데이터는 사라진다. 
- 따라서 단순한 캐시나 스테이트리스 웹 서버에는 문제가 아니지만, 데이터베이스·메시지 브로커·파일 업로드·트랜잭션 로그처럼 ‘상태(state)’를 유지해야 하는 워크로드에는 직격탄이 된다.

### 3.1 파드의 비극: 데이터는 왜 사라지는가?[^31][^33]

- 컨테이너의 writable 레이어는 컨테이너 수명과 1:1로 묶여 있다. 파드가 아래와 같은 이유로 내려갔다가 새로 뜨면 기존 컨테이너 레이어는 폐기되고 새 레이어가 만들어진다.
  - 노드 장애 또는 노드 업그레이드
  - 디플로이 롤링 업데이트/리비전 교체
  - 오토스케일(Scale Down) 후 재확장
  - 리소스 압박(OOMKill)로 인한 재시작
- 예를 들어, Postgres를 단순 Deployment + EmptyDir(혹은 아무 Volume 없이)로 띄워놓았다고 하자. 사용자가 데이터를 입력하는 중 노드에 장애가 발생해 파드가 다른 노드에서 재생성되면, 그동안 `pgdata` 디렉터리에 기록된 파일은 완전히 초기화된다. 이는 치명적인 데이터 손실이며 복구 수단도 없다.
- 이 문제를 해결하기 위해 쿠버네티스는 ‘볼륨(Volume)’ 추상화를 제공하고, 여기에 **프로덕션급 영속성**을 책임지는 핵심 요소로 **퍼시스턴트 볼륨(Persistent Volume, PV)** 모델을 도입한다. 핵심 철학은 “파드(일회용)와 스토리지(지속)를 생명주기 측면에서 분리(decouple)한다” 이다.

### 3.2 핵심 3요소: PV · PVC · StorageClass[^34][^35][^36]

- 쿠버네티스는 스토리지 관리를 ‘역할 분리(Responsibility Separation)’로 단순화한다. 애플리케이션 개발자는 *무엇이 필요한지* (용량/접근 모드)를, 인프라/플랫폼 관리자는 *어떻게 제공할지* (프로비저너/성능/암호화 정책)를 기술한다. 이를 가능하게 하는 세 객체는 다음과 같다:
  - **퍼시스턴트 볼륨 (PersistentVolume, PV)**: 클러스터에 실제로 존재하는 **물리/클라우드 스토리지 자원**을 쿠버네티스가 이해할 수 있는 리소스로 추상화한 것. AWS EBS, GCP PD, Azure Disk, 온프레미스 NFS 등. 파드와 생명주기가 독립적이므로 파드가 삭제되어도 PV는 남는다.
  - **퍼시스턴트 볼륨 클레임 (PersistentVolumeClaim, PVC)**: 애플리케이션이 제출하는 **스토리지 요청서**. “10Gi 필요, 한 번에 하나의 노드에서 Read/Write(RWO) 가능해야 함”처럼 선언하면 컨트롤 플레인이 조건에 맞는 PV를 찾아 1:1로 바인딩한다. 개발자는 구현 세부(디스크 타입, IOPS 등)를 몰라도 된다.
  - **스토리지 클래스 (StorageClass, SC)**: PV를 미리 수동으로 여러 개 만들어두는 비효율을 줄이기 위한 **동적 프로비저닝 템플릿**. `storageClassName: ssd-storage` 를 PVC에 지정하면 SC가 정의한 프로비저너(EBS gp2/gp3, pd-ssd 등)와 파라미터를 사용해 즉석에서 PV를 생성하고 PVC와 자동 바인딩한다. 이는 ‘요청 기반 Just-In-Time 스토리지 할당’을 가능케 한다.
- 이 구조 덕분에 동일한 매니페스트(PVC 포함)를 AWS/GCP/온프레미스 어디에 배포하든, 환경별로 정의된 StorageClass가 적절한 스토리지를 마련해 **애플리케이션 이식성(Portability)** 을 극대화한다.

| 요소 | 관점 | 설명 |
|------|------|------|
| PV | 인프라 | 블록/NFS/클라우드 디스크 추상화 |
| PVC | 애플리케이션 | 용량·AccessMode 요청 |
| StorageClass | 정책 | 프로비저너/파라미터 템플릿 |

> 요약: PVC = “필요 스펙 선언”, StorageClass = “생산 설계도”, PV = “실제 창고(자원)”.

### 3.3 생명주기 관리: Access Modes와 Reclaim Policy[^33]

- PV 설계에서 ‘누가 어떻게 붙어 쓰는가(Access Mode)’ 와 ‘더 이상 안 쓰면 어떻게 처리하는가(Reclaim Policy)’ 는 데이터 무결성과 비용 최적화 모두에 핵심이다.

**Access Modes** (노드/파드 관점 동시 접근 제약)
- **ReadWriteOnce (RWO)**: 하나의 노드에서만 읽기/쓰기로 마운트 가능. 대부분의 블록 스토리지(EBS, PD, Azure Disk)가 제공. 단일 인스턴스 DB, 상태 저장 애플리케이션 기본 패턴.
- **ReadOnlyMany (ROX)**: 여러 노드에서 동시에 *읽기 전용* 마운트. 레퍼런스 데이터(설정, 정적 콘텐츠) 공유에 적합.
- **ReadWriteMany (RWX)**: 여러 노드에서 동시에 읽기/쓰기. NFS/CSI 기반 공유 파일시스템 필요. 업로드 디렉터리, 협업 편집, 공용 아티팩트 저장소 등에 활용.

**Reclaim Policy** (PVC가 해제된 뒤 PV/실제 스토리지 처리 방식)
- **Retain**: PVC 삭제 후에도 PV와 실제 스토리지/데이터를 유지. PV 상태는 Released → 재사용 전 수동 정리 필요. 규제/감사/중요 영구 데이터에 안전.
- **Delete**: PVC 삭제 시 PV와 실제 스토리지까지 자동 삭제. 동적 프로비저닝 기본값. 캐시·임시 파이프라인 산출물 등 재생성 쉬운 데이터에 적합.
- **Recycle (Deprecated)**: 단순 `rm -rf` 후 재사용. 보안/데이터 잔류 문제로 비권장.

| 속성 | 옵션 | 의미 |
|------|------|------|
| AccessMode | RWO | 단일 노드 Read/Write |
|            | ROX | 다중 노드 ReadOnly |
|            | RWX | 다중 노드 Read/Write |
| ReclaimPolicy | Retain | PVC 삭제 후 데이터 유지 |
|               | Delete | PVC 삭제 시 스토리지 삭제 |
|               | Recycle | Deprecated |

> 선택 가이드: “데이터 복구 비용이 높고 규제 대상인가?” → Retain / “휘발·재생성 간단한가?” → Delete.

<br>

### 3.4 PostgreSQL 예시 (동적 프로비저닝 가정) [^39][^40]

<script src="https://gist.github.com/ingu627/18e1e24db6f5bb3381d8ef362e595228.js"></script>

<br>

<script src="https://gist.github.com/ingu627/a34d554c020371720963610faea64184.js"></script>

<br>

<script src="https://gist.github.com/ingu627/6fccb734ccb84b4f397c9e27c058fefc.js"></script>

<br>

<script src="https://gist.github.com/ingu627/3f7f3eacb6325372b48115d903a21d30.js"></script>

<br>

- **배포:**

<script src="https://gist.github.com/ingu627/27eeaaaf29d9a4dfd27c29d5006ce2d4.js"></script>

- 파드 삭제 후 재생성해도 PVC ↔ PV 바인딩으로 데이터 유지된다.

> Tip: 개발은 1Gi로 시작하고 I/O 패턴을 본 뒤 gp3/pd-ssd 등으로 승격한다.[^49]

<br>

## 4. 관리형 쿠버네티스 서비스 현명하게 선택하기

- 지금까지 애플리케이션을 컨테이너로 구성(Compose)하고, 외부 트래픽을 인그레스로 수렴시키며, 상태 데이터를 PV/PVC로 영속화하는 방법을 살펴봤다. 그러나 이 모든 것을 올려놓을 **쿠버네티스 클러스터 자체**를 어떻게 확보·운영할 것인가는 또 다른 전략적 질문이다. 선택지는 크게 두 가지다.

1. 직접 구축(Self-Hosted)
2. 클라우드 제공업체의 관리형 서비스(Managed Service)

- 핵심은 “무엇을 포기(제어권)하고 무엇을 얻을(속도/안정성) 것인가”의 트레이드오프를 의식적으로 결정하는 것이다.

### 4.1 직접 구축(Self-Hosted) vs. 관리형 서비스: 무엇을 포기하고 무엇을 얻는가?[^42]

- **직접 구축 (Self-Hosted Kubernetes)**: 가상머신(VM)이나 Bare-metal 위에 `kubeadm`, `kOps`, `Rancher`, 자체 스크립트 등을 이용해 Control Plane(etcd, API Server, Controller Manager, Scheduler)과 Worker Node 전부를 직접 세팅/운영한다.
- **장점**
  - 인프라 세부 (네트워크 플러그인, etcd 스냅샷 정책, 커널 파라미터, 하드웨어 가속)까지 완전한 제어 가능
  - 특정 규제·보안 요구(온프레미스, 데이터 레지던시, 전용 하드웨어) 대응 유연성 최상
  - 대규모·일정한 워크로드에서 장기적으로 인프라 단가 최적화 여지 (인건비 제외)
- **단점**
  - Control Plane HA 구성, etcd 백업/복구, 버전 업그레이드(마이너 → 메이저), CVE 패치, Metrics/Logging/Tracing 스택 통합, 인증/인가(OPA, RBAC) 등 **운영 책임** 전부 직접 부담
  - 고급 SRE/플랫폼 엔지니어링 역량 필수 → 인건비가 클라우드 관리 비용을 상회할 수 있음
  - 릴리스 추적/테스트 파이프라인 없으면 업그레이드 지연 → 보안·호환성 리스크 누적

- **관리형 서비스 (Managed Kubernetes Service)**: AWS(EKS), Google(GKE), Azure(AKS) 등 클라우드가 Control Plane(가용성, 패치, 확장)을 대신 책임진다. 사용자는 워커 노드 풀(혹은 노드조차 추상화된 모드)과 애플리케이션만 집중 관리.
- **장점**
  - Control Plane SLA/자동 패치/모니터링을 벤더가 제공 → 팀 역량을 비즈니스 로직·파이프라인·데이터 도메인에 재배치 가능
  - IAM/스토리지/로드밸런서/Observability/보안 서비스 등 다른 클라우드 구성 요소와 자연스러운 통합 (Provisioning 속도 ↑)
  - 신규 클러스터 생성/삭제가 수분 단위로 단축 → 실험 환경, 단기 테스트, Blue/Green 전략 용이
- **단점**
  - Control Plane 구성(Flags, 특정 버전 고정, etcd 파라미터)에 대한 세밀한 커스터마이징 제한
  - 벤더 특화 객체/어노테이션(예: ALB Controller, GKE Specific Features) 의존 시 **벤더 락인** 증가
  - 특정 기능(예: EKS Control Plane 시간당 요금)으로 비용 구조가 복잡해질 수 있음

> 의사결정 힌트: “쿠버네티스 자체를 차별화 역량으로 보는가?” → Self-Hosted 고려. “핵심은 애플리케이션 전달 속도” → Managed 우선.

### 운영 관점 핵심 비교 (확장 표)

| 항목 | Self-Hosted | Managed (EKS/GKE/AKS) | 실패 시그널 | 개선 액션 |
|------|-------------|-----------------------|-------------|-----------|
| Control Plane HA | 직접 구성/테스트 | 벤더 SLA | 잦은 API 오류 | 업그레이드/헬스 체크 자동화 |
| 업그레이드 주기 | 수동 계획 필요 | 릴리스 채널/자동 옵션 | 버전 2+ 릴리스 뒤처짐 | 캘린더 기반 릴리스 윈도우 수립 |
| 보안 패치 | OS/컨테이너/컴포넌트 전담 | OS & CP 일부 자동 | CVE 공지 대응 지연 | 이미지 스캔 & 패치 파이프라인 |
| Observability | 스택 선택/통합 부담 | 네이티브 통합(CloudWatch, Cloud Logging 등) | 메트릭 누락/이중 수집 | 표준 메트릭 프로파일 정의 |
| 비용 구조 | HW + 인력 | 서비스 요금 + 노드 리소스 | 미사용 노드 방치 | Autoscaler 및 Rightsizing |
| 확장 속도 | 노드 준비 느림 | 수분 단위/Serverless(Fargate, Autopilot) | Scale 이벤트 지연 | 사전 워밍/버퍼 노드 정책 |

<br>

## 결론

- 이 글을 통해 우리는 단일 컨테이너를 넘어 실제 프로덕션 애플리케이션을 구축하고 운영하는 데 필요한 네 가지 핵심 기술 기둥을 살펴보았다.
  - **도커 컴포즈**는 로컬 개발 환경에서 여러 컨테이너를 하나의 단위로 묶어 관리하는 복잡성을 해결해주었다.
  - **쿠버네티스 인그레스**는 클러스터의 관문 역할을 하며, 외부의 다양한 요청을 지능적으로 내부 서비스에 연결하는 방법을 제시했다.
  - **쿠버네티스 퍼시스턴트 볼륨**은 컨테이너의 비영속성이라는 한계를 극복하고, 중요한 데이터를 안전하게 보존하는 길을 열어주었다.
  - **관리형 쿠버네티스 서비스**는 복잡한 클러스터 운영의 부담을 덜어주어, 우리가 더 중요한 가치, 즉 애플리케이션 개발에 집중할 수 있도록 돕는다.
- 이 기술들은 각기 다른 문제를 해결하는 개별적인 도구처럼 보이지만, 그 근간에는 '추상화(Abstraction)'라는 공통된 철학이 흐르고 있다. 복잡한 저수준의 세부 사항(명령어, IP 주소, 스토리지 장치, 서버 관리)을 감추고, 개발자와 운영자가 더 높은 수준에서 시스템을 이해하고 제어할 수 있도록 돕는 것이다.
- **도커 컴포즈**로 애플리케이션의 구조를 선언하고, 인그레스와 PVC로 네트워크와 스토리지 요구사항을 선언하며, 관리형 서비스를 통해 인프라 운영을 클라우드에 위임하는 이 모든 과정은 결국 애플리케이션을 더 빠르고, 안정적이며, 확장 가능하게 만들기 위한 여정이다.

<br>

## References

[^1]: [Docker run vs Docker-Compose - Reddit](https://www.reddit.com/r/docker/comments/kreveb/docker_run_vs_dockercompose/?tl=ko)
[^7]: [Docker Compose - Docker Docs](https://docs.docker.com/compose/)
[^15]: [[kubernetes]서비스 타입 비교](https://kim-dragon.tistory.com/52)
[^20]: [Ingress, Kubernetes](https://kubernetes.io/ko/docs/concepts/services-networking/ingress/)
[^31]: [볼륨, Kubernetes](https://kubernetes.io/ko/docs/concepts/storage/volumes/)
[^33]: [Kubernetes의 영구 볼륨이란? - PureStorage](https://www.purestorage.com/kr/knowledge/what-is-kubernetes-persistent-volume.html)
[^34]: [퍼시스턴트 볼륨, Kubernetes](https://kubernetes.io/ko/docs/concepts/storage/persistent-volumes/)
[^35]: [Kubernetes PV/PVC/StorageClass (1)](https://whybk.tistory.com/149)
[^36]: [Kubernetes Storage, 제대로 이해하기](https://gngsn.tistory.com/293)
[^39]: [Deploy Postgres to Kubernetes - DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-deploy-postgres-to-kubernetes-cluster)
[^40]: [Storing data into Persistent Volumes - Medium](https://medium.com/@xcoulon/storing-data-into-persistent-volumes-on-kubernetes-fb155da16666)
[^42]: [Kubernetes on a Private Cloud vs EKS/GKE - Open Metal](https://openmetal.io/resources/blog/kubernetes-on-a-private-cloud-cost-and-performance-vs-eks-and-gke/)
[^47]: [EKS vs AKS vs GKE 비교 - Skuber+ Blog](https://www.skuberplus.com/ko-kr/blog/eks-vs-aks-vs-gke-how-to-choose-the-best-managed-kubernetes-platform)
[^48]: [FastAPI in Containers - 공식 문서](https://fastapi.tiangolo.com/deployment/docker/)
[^49]: [Amazon EBS gp3 성능 개요 (AWS 블로그)](https://aws.amazon.com/blogs/aws/amazon-ebs-gp3-volume/)
