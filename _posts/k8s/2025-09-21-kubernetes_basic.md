---
layout: single
title: "클라우드 네이티브 컴퓨팅 인프라의 진화: OCI 컨테이너 런타임부터 K8s 오케스트레이션 아키텍처까지"
excerpt: "Linux 커널 프리미티브(Namespaces, Cgroups)의 프로세스 격리 원리, OCI 이미지 및 런타임(runc, containerd) 계층, 그리고 선언적 상태 수렴(Reconciliation Loop)을 수행하는 쿠버네티스 컨트롤 플레인의 내부 아키텍처를 심층 분석한다."
categories: [docker]
tags: [docker, kubernetes, k8s, container, oci, cgroups, namespaces, containerd, cloud-native]
toc: true
toc_sticky: true
sidebar_main: true

date: 2025-09-21
last_modified_at: 2026-10-08
---

현대 소프트웨어 아키텍처가 모놀리스에서 마이크로서비스로, 그리고 대규모 분산 AI 워크로드로 전환되면서 애플리케이션의 패키징과 배포, 운영 인프라는 근본적인 변화를 겪었다.

과거 가상 머신(VM, Virtual Machine) 기반의 가상화는 하드웨어 수준의 에뮬레이션(Hypervisor)과 게스트 OS(Guest OS) 오버헤드로 인해 리소스 낭비가 심하고 프로비저닝 속도가 느렸다. 이를 대체한 컨테이너(Container) 기술은 운영체제 커널을 공유하면서 프로세스 레벨에서 완벽한 격리와 리소스 통제를 제공하는 **운영체제 수준의 가상화(OS-level Virtualization)**를 실현했다.

이 글에서는 컨테이너를 지탱하는 **Linux 커널 프리미티브(Namespaces, Cgroups, OverlayFS)**의 물리적 동작 원리, **OCI(Open Container Initiative)** 표준과 런타임 계층 구조, 그리고 수천 개의 컨테이너를 선언적으로 오케스트레이션하는 **쿠버네티스(Kubernetes) 컨트롤 플레인의 내부 아키텍처**를 시스템 엔지니어링 관점에서 심층 분석한다.

---

## 1. 컨테이너 격리의 실체: Linux 커널 프리미티브

흔히 컨테이너를 가벼운 가상 머신으로 오해하지만, 컨테이너는 하이퍼바이저 위에서 독립된 OS를 구동하는 객체가 아니다. 컨테이너는 **호스트 커널의 격리 및 자원 제어 플래그가 적용된 일반 Linux 프로세스**에 불과하다.

```
가상 머신(VM) vs. 컨테이너(Container) 커널 아키텍처:
[가상 머신 (VM)]                        [컨테이너 (Container)]
┌──────────────────┬──────────────────┐ ┌──────────────────┬──────────────────┐
│ App A            │ App B            │ │ App A (격리됨)   │ App B (격리됨)   │
├──────────────────┼──────────────────┤ ├──────────────────┼──────────────────┤
│ Bins / Libs      │ Bins / Libs      │ │ Bins / Libs      │ Bins / Libs      │
├──────────────────┼──────────────────┤ └──────────────────┴──────────────────┘
│ Guest OS         │ Guest OS         │
├──────────────────┴──────────────────┤
│ Hypervisor (KVM, ESXi, Xen)         │ ┌─────────────────────────────────────┐
├─────────────────────────────────────┤ │ Container Runtime (containerd/runc) │
│ Host OS (Host Kernel)               │ ├─────────────────────────────────────┤
├─────────────────────────────────────┤ │ Host OS (단일 공유 Linux Kernel)    │
│ 물리 인프라 (CPU, RAM, NIC)         │ ├─────────────────────────────────────┤
└─────────────────────────────────────┘ │ 물리 인프라 (CPU, RAM, NIC)         │
                                        └─────────────────────────────────────┘
```

컨테이너의 격리성을 완성하는 핵심 커널 메커니즘은 다음 세 가지다.

### 1.1 Namespaces: 시스템 뷰(View)의 격리

네임스페이스는 특정 프로세스가 볼 수 있는 시스템 리소스의 가시성(Visibility)을 제한한다. 프로세스가 `clone()` 시스템 콜을 호출할 때 전달하는 플래그에 따라 독립된 공간이 생성된다.

```
주요 Linux Namespaces 6대 영역:
┌──────────────┬──────────────────┬────────────────────────────────────────────────────────────┐
│ Namespace    │ 커널 플래그      │ 격리 대상 및 효과                                          │
├──────────────┼──────────────────┼────────────────────────────────────────────────────────────┤
│ PID          │ CLONE_NEWPID     │ 프로세스 트리 격리 (컨테이너 내부에서는 해당 프로세스가 PID 1)│
│ NET          │ CLONE_NEWNET     │ 네트워크 디바이스, IP 라우팅 테이블, 포트 바인딩 공간 격리 │
│ MNT (Mount)  │ CLONE_NEWNS      │ 파일 시스템 마운트 포인트 격리 (호스트 루트 FS와 격리)     │
│ IPC          │ CLONE_NEWIPC     │ 공유 메모리(Shared Memory), 세마포어, 메시지 큐 격리       │
│ UTS          │ CLONE_NEWUTS     │ 호스트명(Hostname) 및 NIS 도메인 네임 격리                 │
│ USER         │ CLONE_NEWUSER    │ UID/GID 매핑 격리 (컨테이너 내 root=0이 호스트 일반 유저)   │
└──────────────┴──────────────────┴────────────────────────────────────────────────────────────┘
```

### 1.2 Control Groups (Cgroups): 리소스 상한선 강제

네임스페이스가 "무엇을 볼 수 있는가"를 제어한다면, Cgroups는 "얼마나 많은 리소스를 사용할 수 있는가"를 물리적으로 강제한다.

- **CPU 제한**: CFS(Completely Fair Scheduler) 할당량을 조절한다.
  - `cpu.cfs_period_us = 100000` (100ms) 기준, `cpu.cfs_quota_us = 200000` (200ms)으로 설정하면 해당 프로세스는 멀티코어에서 최대 2개의 vCPU에 해당하는 연산량만 할당받는다.
- **메모리 제한 및 OOM Killer**:
  - `memory.limit_in_bytes`를 초과하여 프로세스가 메모리를 할당하려고 하면, 커널의 OOM(Out of Memory) Killer가 작동하여 해당 프로세스(컨테이너)에 `SIGKILL`을 전송하고 프로세스를 강제 종료한다.

### 1.3 OverlayFS: 계층형 Copy-on-Write 파일 시스템

컨테이너 이미지는 수 기가바이트에 달하지만, 컨테이너 생성은 수십 밀리초 만에 완료된다. 이는 **Union Mount** 기술인 **OverlayFS**의 계층 구조 덕분이다.

```
OverlayFS 4계층 아키텍처:
┌───────────────────────────────────────────────────────────┐
│ Merged Directory (컨테이너 프로세스가 바라보는 통합 뷰)   │
├───────────────────────────────────────────────────────────┤
│ Upper Directory (읽기/쓰기 가능 계층, Container Layer)    │ <── 변경사항 기록
├───────────────────────────────────────────────────────────┤
│ Lower Directory 2 (읽기 전용 이미지 레이어, Layer B)      │
├───────────────────────────────────────────────────────────┤
│ Lower Directory 1 (읽기 전용 베이스 OS 레이어, Layer A)   │ <── 불변(Immutable)
└───────────────────────────────────────────────────────────┘
```

- 이미지 레이어들은 불변의 **읽기 전용(Read-only, lowerdir)**으로 수많은 컨테이너 간에 메모리 상에서 공유된다.
- 컨테이너가 실행되면 얇은 **읽기/쓰기 전용 레이어(upperdir)**가 최상단에 얹힌다.
- 컨테이너가 기존 파일을 수정할 때만 하위 레이어에서 상위 레이어로 파일을 복사한 뒤 수정하는 **CoW(Copy-on-Write)** 메커니즘이 작동하여 디스크 공간과 I/O를 획기적으로 절약한다.

---

## 2. OCI 표준과 컨테이너 런타임 스택의 분화

초기 Docker는 모놀리식 단일 데몬(`dockerd`)으로 모든 기능을 수행했으나, 표준화 기구인 **OCI(Open Container Initiative)**의 발족과 함께 런타임 계층이 고수준(High-level)과 저수준(Low-level)으로 명확히 분리되었다.

```
현대 컨테이너 런타임 계층 구조:
[Kubelet] (쿠버네티스 워커 에이전트)
    │
    ▼ (gRPC 기반 CRI 프로토콜: Container Runtime Interface)
[High-Level Runtime] (containerd 또는 CRI-O)
    │ ── 이미지 다운로드, 압축 해제, OCI 번들(config.json + rootfs) 생성
    ▼ (명령줄 실행 / 도메인 소켓)
[Low-Level Runtime] (runc 또는 crun)
    │ ── Linux 시스템 콜(clone, unshare, setns, pivot_root)을 직접 호출
    ▼
[격리된 컨테이너 프로세스]
```

- **OCI Image Specification**: 불변의 레이어 tarball과 매니페스트(JSON)로 구성된 이미지 패키징 표준.
- **OCI Runtime Specification (`runc`)**: 로컬 파일 시스템에 풀려 있는 rootfs와 `config.json` 명세서를 바탕으로 Linux 커널 시스템 콜을 직접 호출하여 컨테이너 프로세스를 띄우는 레퍼런스 저수준 런타임.
- **CRI (Container Runtime Interface)**: Kubelet이 Docker 엔진에 직접 종속되지 않고, 임의의 고수준 런타임(`containerd`, `CRI-O`)을 플러그인 형태로 교체할 수 있도록 정의된 표준 gRPC 인터페이스.

---

## 3. 쿠버네티스 아키텍처: 대규모 분산 오케스트레이션

컨테이너가 수백~수천 개로 늘어나면 장애 발생 시 자동 재기동, 트래픽 로드밸런싱, 무중단 롤링 배포, 노드 간 스케줄링을 자동화할 오케스트레이터가 필요하다.

쿠버네티스는 전체 시스템을 **컨트롤 플레인(Control Plane, 마스터)**과 **데이터 플레인(Data Plane, 워커 노드)**으로 양분한다.

```
쿠버네티스 클러스터 아키텍처:
┌────────────────────────────────────────────────────────────────────────┐
│ Control Plane (마스터 노드)                                            │
│                                                                        │
│   ┌────────────────────┐   Raft   ┌────────────────────────────────┐   │
│   │ kube-apiserver     │ <──────> │ etcd (분산 분산 합의 KV)       │   │
│   └─────────┬──────────┘          └────────────────────────────────┘   │
│             │                                                          │
│   ┌─────────┴──────────┐          ┌────────────────────────────────┐   │
│   │ kube-scheduler     │          │ kube-controller-manager        │   │
│   └────────────────────┘          └────────────────────────────────┘   │
└─────────────┬──────────────────────────────────────────────────────────┘
              │ (HTTPS / TLS 통신)
┌─────────────┴──────────────────────────────────────────────────────────┐
│ Worker Node (데이터 플레인)                                            │
│                                                                        │
│   ┌────────────────────┐          ┌────────────────────────────────┐   │
│   │ kubelet            │ ──(CRI)─>│ containerd / runc              │   │
│   └────────────────────┘          └────────────────┬───────────────┘   │
│                                                    ▼                   │
│   ┌────────────────────┐          ┌────────────────────────────────┐   │
│   │ kube-proxy         │ ──iptables│ Pod (Container A + B)         │   │
│   └────────────────────┘          └────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Control Plane 핵심 컴포넌트

1. **`kube-apiserver`**:
   - 클러스터의 모든 컴포넌트와 외부 관리자(kubectl)가 통신하는 유일한 관문이다.
   - 선언적 YAML에 대한 인증(Authentication), 인가(RBAC Authorization), 어드미션 제어(Admission Webhooks)를 거쳐 etcd에 데이터를 기록한다. 유일하게 etcd와 직접 통신할 수 있는 컴포넌트다.
2. **`etcd`**:
   - 클러스터의 모든 Desired State와 런타임 메타데이터를 저장하는 강력한 일관성(Strong Consistency) 기반의 분산 키-값 저장소다. **Raft 합의 알고리즘**을 기반으로 고가용성을 유지한다.
3. **`kube-scheduler`**:
   - 아직 노드가 배정되지 않은 신규 파드(Pod)를 감지하고, 노드의 리소스 가용량(CPU/RAM), 태인트와 톨러레이션(Taints & Tolerations), 노드 어피니티(Affinity)를 평가하는 2단계(필터링 $\rightarrow$ 스코어링)를 거쳐 최적의 노드를 바인딩한다.
4. **`kube-controller-manager`**:
   - 클러스터의 수많은 컨트롤러(Deployment, ReplicaSet, Node, ServiceAccount)를 단일 프로세스로 실행한다.

### 3.2 선언적 제어와 상태 수렴 루프 (Reconciliation Loop)

쿠버네티스의 모든 동작은 명령형(Imperative: "컨테이너 3개를 실행하라")이 아니라 **선언적(Declarative: "컨테이너의 복제본 수는 항상 3개여야 한다")** 방식에 기반한다.

```
Reconciliation Loop의 핵심 메커니즘:
       [Desired State (사용자 선언, etcd)]
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  Observe (현재 클러스터 상태 관찰)           │
│        │                                     │
│        ▼                                     │
│  Diff (Desired State vs. Current State 비교) │
│        │                                     │
│        ▼                                     │
│  Act (상태 일치를 위해 컨테이너 생성/삭제)    │
└──────────────────────────────────────────────┘
                       ▲
                       │
       [Current State (실제 런타임 환경)]
```

어떤 노드가 하드웨어 장애로 다운되어 파드 수가 2개로 줄어들면, ReplicaSet 컨트롤러는 관찰(Observe) 단계에서 차이(Diff)를 감지하고, 즉시 새로운 파드를 다른 가용 노드에 스케줄링하여 선언된 3개 상태로 수렴(Act)시킨다. 이 자체 복구(Self-healing) 메커니즘이 대규모 분산 시스템의 고가용성을 지탱한다.

---

## 4. 데이터 플레인(Data Plane)과 네트워킹 프리미티브

### 4.1 Pod: 배포의 최소 기본 단위

쿠버네티스는 단일 컨테이너를 직접 배포하지 않고, 하나 이상의 컨테이너 묶음인 **파드(Pod)**를 스케줄링 단위로 삼는다.

- **Pause 컨테이너 (인프라 컨테이너)**: 파드가 생성될 때 가장 먼저 실행되어 Network와 IPC 네임스페이스를 선점한다.
- **네트워크 공유**: 동일 파드 내의 모든 컨테이너는 동일한 IP 주소와 포트 공간을 공유하며, `localhost`를 통해 마이크로초 단위의 IPC 통신을 수행한다.

### 4.2 kubelet과 kube-proxy의 역할

- **`kubelet`**: 각 워커 노드에서 데몬으로 실행되며, API 서버로부터 자신에게 할당된 PodSpec을 수신한다. CRI(Container Runtime Interface)를 호출하여 컨테이너를 생성/삭제하고, CNI(Container Network Interface)를 통해 IP를 부여하며, 정기적으로 헬스체크(Liveness/Readiness Probe)를 수행하여 상태를 보고한다.
- **`kube-proxy`**: 노드 내부에서 가상 서비스 IP(ClusterIP)로 들어오는 트래픽을 실제 백엔드 파드들의 IP로 라우팅한다. 초기에는 사용자 공간 프록시를 썼으나, 현재는 Linux 커널의 **iptables** 또는 **IPVS (IP Virtual Server)** 모드를 활용하여 패킷 레벨에서 $O(1)$의 고속 로드밸런싱을 수행한다.

---

## 5. 결론: 클라우드 네이티브 엔지니어링 설계 원칙

1. **컨테이너 불변성(Immutability)**: 컨테이너 내부의 파일 시스템 변경에 의존하지 말고, 모든 상태 데이터는 외부 Persistent Volume이나 오브젝트 스토리지로 분리하라.
2. **리소스 상한선(Requests & Limits)의 엄격한 정의**: Cgroups의 CPU Throttling과 Memory OOM Killer를 이해하고, 모든 파드에 적절한 리소스 요청량(Scheduling 보장)과 상한선(Node 보호)을 정의하라.
3. **선언적 인프라(IaC) 거버넌스**: 모든 쿠버네티스 리소스는 수동 `kubectl` 명령이 아닌 GitOps(ArgoCD, Flux) 파이프라인을 통해 버전 관리되는 선언적 매니페스트로 통제하라.

---

### References

[^1]: [Namespaces in operation - LWN.net](https://lwn.net/Articles/531114/)
[^2]: [Open Container Initiative Specifications](https://opencontainers.org/)
[^3]: [Kubernetes Documentation: Architecture Concepts](https://kubernetes.io/docs/concepts/architecture/)
