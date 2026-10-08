---
layout: single
title: "쿠버네티스 프로덕션 네트워킹과 스토리지 아키텍처: Ingress, CSI·StorageClass 및 관리형 클러스터(EKS·GKE) 엔지니어링"
excerpt: "Docker Compose 로컬 멀티 컨테이너 명세부터, K8s L7 Ingress Controller(Nginx/Envoy) 트래픽 라우팅, CSI(Container Storage Interface) 기반 PV/PVC 동적 프로비저닝, 그리고 관리형 쿠버네티스(EKS, GKE)의 컨트롤 플레인 운영 트레이드오프를 심층 분석한다."
categories: [docker]
tags: [kubernetes, k8s, docker-compose, ingress, persistent-volume, storageclass, csi, eks, gke]
toc: true
toc_sticky: true
sidebar_main: true

date: 2025-09-24
last_modified_at: 2026-10-08
---

단일 컨테이너 실행(`docker run`)을 넘어 실제 엔터프라이즈 프로덕션 환경으로 진입할 때 엔지니어가 직면하는 문제는 크게 네 가지 시스템 계층으로 집약된다.

1. **로컬 멀티 컨테이너 명세**: 상호 의존성을 갖는 웹, API, DB, 캐시 서비스를 어떻게 단일 선언으로 오케스트레이션할 것인가?
2. **L7 외부 인그레스 네트워킹**: 분산된 수백 개의 백엔드 파드(Pod)로 들어오는 외부 HTTP/HTTPS 트래픽을 어떻게 지능적으로 로드밸런싱하고 SSL/TLS를 종단할 것인가?
3. **스토리지 영속성(Persistence)**: 컨테이너가 예기치 않게 종료되거나 재스케줄링되어도 데이터베이스와 로그의 데이터를 유실 없이 보존할 수 있는 추상화는 무엇인가?
4. **클라우드 인프라 거버넌스**: 복잡한 etcd와 컨트롤 플레인의 고가용성을 유지하기 위해 관리형 쿠버네티스(EKS, GKE, AKS)를 어떻게 평가하고 채택할 것인가?

이 글에서는 Docker Compose의 선언적 메커니즘부터, 쿠버네티스 Ingress Controller의 트래픽 라우팅 원리, CSI(Container Storage Interface) 기반의 동적 스토리지 프로비저닝, 그리고 AWS EKS와 GCP GKE의 핵심 아키텍처 차이점을 심층 분석한다.

---

## 1. 선언적 멀티 컨테이너 오케스트레이션: Docker Compose

로컬 개발 환경에서 다수의 컨테이너를 개별 명령어로 띄우는 방식은 환경 변수 누락, 네트워크 미연결, 실행 순서 경합(Race Condition)으로 인한 실패를 초래한다.

**Docker Compose**는 인프라를 코드로 관리(IaC)하는 기본 철학을 로컬 컨테이너 환경에 적용한다.

```yaml
# docker-compose.yml: 서비스, 독립 네트워크, 볼륨의 선언적 정의
services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - REDIS_HOST=cache
    depends_on:
      cache:
        condition: service_healthy
    networks:
      - backend-net

  cache:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    volumes:
      - redis-data:/data
    networks:
      - backend-net

networks:
  backend-net:
    driver: bridge

volumes:
  redis-data:
```

### 1.1 내부 네트워킹과 내장 DNS 디스커버리

Docker Compose는 `docker compose up` 실행 시 전용 사용자 정의 브리지 네트워크(`backend-net`)를 생성한다.

- **서비스 디스커버리(Service Discovery)**: 임베디드 DNS 서버(`127.0.0.11`)가 각 서비스 이름을 컨테이너의 동적 가상 IP로 자동 매핑한다. 웹 애플리케이션은 IP가 바뀌어도 `http://cache:6379`와 같이 고정된 호스트명으로 통신할 수 있다.
- **네트워크 격리**: 외부 포트 포워딩(`ports`)을 명시하지 않은 백엔드 컨테이너는 오직 Compose 네트워크 내부에서만 접근 가능하므로 로컬 보안 경계가 확립된다.

---

## 2. 쿠버네티스 외부 트래픽 진입로: L4 Service vs. L7 Ingress

쿠버네티스 내부에서 파드는 일시적인(Ephemeral) 객체로, 생성과 파괴가 반복되며 IP 주소가 끊임없이 바뀐다. 내부 서비스들을 안정적으로 외부 세계와 연결하기 위한 네트워킹 프리미티브는 계층별로 분화되어 있다.

```
L4 Service vs. L7 Ingress 트래픽 라우팅:
[L4 서비스 (LoadBalancer)]
  External Client ──> [Cloud L4 LB (AWS NLB)] ──> NodePort ──> kube-proxy (iptables) ──> Pod IP
  * 한계: 서비스마다 개별 클라우드 LB가 생성되어 비용 폭증, URL 경로 기반 라우팅 불가.

[L7 인그레스 (Ingress Controller)]
  External Client ──> [단일 L7 LB / Ingress Controller (Nginx / Envoy)]
                           │
                           ├─ /api/v1/auth ──> [Auth Service] ──> Pods
                           ├─ /api/v1/llm  ──> [LLM Service]  ──> Pods
                           └─ /static/     ──> [Web Service]  ──> Pods
  * 장점: 단일 엔트리포인트에서 SSL/TLS 종단, 호스트/경로 기반 라우팅, Rate Limiting 완결.
```

### 2.1 Ingress 리소스 vs. Ingress Controller

쿠버네티스에서 `Ingress`는 단순한 **선언적 라우팅 규칙(Rule)**을 담은 매니페스트일 뿐이다. 이 규칙을 실제로 읽어 트래픽을 처리하는 **Ingress Controller**(Nginx Ingress, Traefik, Envoy 기반 Gateway API, AWS Load Balancer Controller)가 클러스터에 배포되어 있어야 한다.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: production-ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "50m"
spec:
  tls:
    - hosts:
        - api.service.domain.com
      secretName: tls-cert-secret
  rules:
    - host: api.service.domain.com
      http:
        paths:
          - path: /v1/infer
            pathType: Prefix
            backend:
              service:
                name: llm-serving-service
                port:
                  number: 8000
```

- **TLS Termination**: Ingress 계층에서 클라이언트와의 HTTPS 암호화를 종단하고, 내부 클러스터 네트워크는 고속 평문 HTTP로 라우팅하여 백엔드 파드의 CPU 부하를 경감한다.
- **Connection Draining & Graceful Reload**: 엔드포인트 변경 시 Nginx 설정을 핫 리로드(Hot-reload)하거나 Lua 모듈을 통해 파드 IP 변경을 동적으로 반영한다.

---

## 3. 상태 데이터의 영속성: PV, PVC, StorageClass 및 CSI

컨테이너가 크래시되거나 노드에서 축출(Evicted)되어 다른 노드로 이동할 때, 컨테이너 내부의 파일 시스템(`emptyDir`)에 저장된 데이터는 영구 소실된다. 상태 저장(Stateful) 애플리케이션(PostgreSQL, Redis, Elasticsearch)을 운영하기 위해 쿠버네티스는 인프라 스토리지와 애플리케이션 요구를 분리하는 **3단계 스토리지 추상화**를 제공한다.

```
스토리지 프로비저닝 수명주기:
[클러스터 관리자 / 클라우드 인프라]
  AWS EBS, GCP Persistent Disk, 온프레미스 SAN/NFS
       │
       ▼
  [StorageClass (동적 프로비저닝 템플릿)] ──> 프로비저너: ebs.csi.aws.com, 타입: gp3
                                                     │
                                                     ▼ (동적 생성)
[애플리케이션 개발자]                                [PersistentVolume (PV)]
  PersistentVolumeClaim (PVC)  <──(바인딩 1:1)──  실제 물리 디스크 볼륨
       │                                             │
       ▼                                             ▼
  [Pod 볼륨 마운트] ───────────────────────────> /var/lib/postgresql/data
```

### 3.1 PV vs. PVC의 역할 분리

- **`PersistentVolume (PV)`**: 클러스터 관리자가 수동 또는 동적으로 프로비저닝한 실제 물리적 저장소 리소스다. 수명주기는 볼륨을 마운트한 파드와 독립적이다.
- **`PersistentVolumeClaim (PVC)`**: 개발자가 요청하는 스토리지 티켓이다 ("용량 100Gi, 접근 모드 ReadWriteOnce의 스토리지가 필요하다"). 쿠버네티스 바인더는 조건을 만족하는 PV를 찾아 1:1로 매핑한다.

### 3.2 Dynamic Provisioning과 CSI(Container Storage Interface)

과거 쿠버네티스는 클라우드 벤더별 스토리지 드라이버 코드가 쿠버네티스 코어 바이너리(`in-tree`)에 내장되어 유지보수가 불가능했다. 현대 아키텍처는 이를 표준 gRPC 스펙인 **CSI(Container Storage Interface)** 플러그인(`out-of-tree`)으로 완전히 분리했다.

`StorageClass`를 선언해 두면, 개발자가 PVC를 생성하는 순간 CSI 컨트롤러가 클라우드 API(AWS `CreateVolume`)를 비동기 호출하여 실제 EBS 볼륨을 생성하고 이를 PV로 자동 등록한다.

### 3.3 Access Modes와 Reclaim Policy 트레이드오프

```
볼륨 접근 모드(Access Modes) 분류:
┌─────────────────────────┬──────────────────┬────────────────────────────────────────────────────────┐
│ Access Mode             │ 지원 스토리지 유형│ 특성 및 사용 사례                                      │
├─────────────────────────┼──────────────────┼────────────────────────────────────────────────────────┤
│ ReadWriteOnce (RWO)     │ 블록 스토리지    │ 단일 노드에서만 읽기/쓰기 마운트 가능 (AWS EBS, GCP PD)│
│                         │ (Block Storage)  │ 최고 I/O 성능, DB 단일 인스턴스에 필수                 │
├─────────────────────────┼──────────────────┼────────────────────────────────────────────────────────┤
│ ReadWriteMany (RWX)     │ 네트워크 파일계층│ 다수 노드의 다수 파드가 동시 읽기/쓰기 (AWS EFS, NFS)  │
│                         │ (Shared File)    │ I/O 지연시간 상대적으로 큼, 공용 미디어/정적 자산      │
├─────────────────────────┼──────────────────┼────────────────────────────────────────────────────────┤
│ ReadOnlyMany (ROX)      │ 공유 스토리지    │ 다수 노드에서 읽기 전용으로 마운트 (공통 머신러닝 모델)│
└─────────────────────────┴──────────────────┴────────────────────────────────────────────────────────┘
```

- **Reclaim Policy**:
  - `Delete`: PVC 삭제 시 기반 물리 PV 디스크도 즉시 영구 삭제 (개발/임시 환경).
  - `Retain`: PVC가 삭제되어도 물리 PV와 데이터는 보존되어 수동 백업 및 복구 가능 (프로덕션 기본 권장).

---

## 4. 관리형 쿠버네티스(Managed K8s) 아키텍처: EKS vs. GKE

직접 컨트롤 플레인을 구축(Hard way)하는 것은 etcd 쿼럼 유지, apiserver 무중단 패치, 노드 인증서 갱신 등 막대한 운영 비용을 초래한다. 현대 엔터프라이즈는 클라우드 벤더가 컨트롤 플레인의 고가용성 SLA를 보장하는 관리형 쿠버네티스를 채택한다.

```
주요 관리형 쿠버네티스 엔지니어링 비교:
┌─────────────────┬─────────────────────────────────┬─────────────────────────────────┐
│ 평가 항목       │ Amazon EKS                      │ Google Cloud GKE                │
├─────────────────┼─────────────────────────────────┼─────────────────────────────────┤
│ 컨트롤 플레인 SLA│ 99.95% (유료 클러스터 시간당 요금)│ 99.95% (단일 영역 존 클러스터 무료)│
│ Pod 네트워킹    │ AWS VPC CNI (파드가 VPC IP 직접 할당)│ Datapath V2 (Cilium eBPF 네이티브)│
│ IAM 인증/인가   │ IRSA (OIDC 기반 ServiceAccount 연동)│ Workload Identity (GCP IAM 연동)│
│ 오토스케일링    │ Karpenter (노드 인스턴스 고속 직결)│ Cluster Autoscaler / Autopilot   │
│ 운영 복잡도     │ 모듈식 조립형 (애드온 수동 구성 많음)│ 고도로 통합된 턴키 솔루션       │
└─────────────────┴─────────────────────────────────┴─────────────────────────────────┘
```

1. **Amazon EKS 아키텍처 특성**:
   - **AWS VPC CNI**: 모든 파드가 오버레이 네트워크를 거치지 않고 실제 AWS VPC 서브넷의 보조 ENI IP를 직접 할당받는다. VPC 내부의 다른 RDS나 EC2와 네이티브 통신이 가능하지만, 서브넷 IP 고갈(IP Exhaustion) 문제에 유의해야 한다.
   - **Karpenter**: 기존 Cluster Autoscaler가 Auto Scaling Group(ASG)에 묶여 느리게 반응하던 한계를 넘어, 파드의 요구 리소스(CPU/GPU/Spot)를 실시간 분석해 최적의 EC2 인스턴스를 초 단위로 직접 프로비저닝한다.
2. **Google Cloud GKE 아키텍처 특성**:
   - **Datapath V2**: Cilium 기반의 **eBPF(Extended Berkeley Packet Filter)** 기술을 커널 레벨에서 기본 탑재하여, kube-proxy iptables의 오버헤드 없이 수만 개의 서비스에 대한 고성능 네트워킹과 네트워크 폴리시를 구현한다.
   - **Autopilot 모드**: 워커 노드의 관리, OS 패치, 크기 조정을 구글이 전담하며, 사용자는 순수 파드 리소스(Request) 소비량 기준으로만 과금된다.

---

## 5. 결론: 프로덕션 인프라 체크리스트

쿠버네티스 기반 프로덕션 인프라를 구축할 때 필수 점검해야 할 사항은 다음과 같다.

- **네트워크 진입로**: 단일 L4 LoadBalancer 서비스 남발을 중단하고, **L7 Ingress Controller**를 통해 TLS 종단과 경로 라우팅을 중앙 집권화하라.
- **스토리지 결합도 분리**: 상태 저장 파드에 고정 PV를 수동 매핑하지 말고, **`StorageClass`와 CSI 드라이버**를 통한 동적 프로비저닝을 구성하고 프로덕션 환경의 `reclaimPolicy`를 `Retain`으로 검증하라.
- **보안 자격증명 격리**: 노드 전체에 광범위한 클라우드 IAM 권한을 부여하지 말고, 파드 단위 최소 권한 원칙을 강제하는 **IRSA(EKS) 또는 Workload Identity(GKE)**를 반드시 적용하라.

---

### References

[^1]: [Compose file reference - Docker Documentation](https://docs.docker.com/reference/compose-file/)
[^2]: [Kubernetes Documentation: Ingress Concepts](https://kubernetes.io/docs/concepts/services-networking/ingress/)
[^3]: [Kubernetes Documentation: Storage Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
