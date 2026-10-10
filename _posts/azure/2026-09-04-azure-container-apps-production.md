---
layout: single
title: "Azure Container Apps 프로덕션 운영: 내부 전용 환경·오토스케일링·영구 스토리지"
excerpt: "폐쇄망 VNet 위에 Azure Container Apps(ACA)를 올려 프로덕션으로 운영하기까지의 실전 기록이다. Internal 전용 환경 설계, 컨테이너 앱 매니페스트, http-scaler 기반 오토스케일링, Azure Files·Blob 이중 영구 스토리지 전략을 정리한다."
categories: [azure]
tags: [azure, container-apps, aca, docker, autoscaling, devops]
toc: true
toc_sticky: true
sidebar_main: true

date: 2026-09-04
last_modified_at: 2026-10-10
---

이전 편 [Azure VNet 프라이빗 엔드포인트 설계](https://ingu627.github.io/azure/azure-vnet-private-endpoint/)에서 사내 서비스가 공용 인터넷에 노출되지 않도록 가상 네트워크(VNet)와 프라이빗 엔드포인트(Private Endpoint)를 구성했다. 네트워크 경계가 정해졌다면 그 위에 실제로 애플리케이션을 올려야 한다. 이번 편은 그 다음 단계, 즉 컨테이너 오케스트레이션 계층을 프로덕션 수준으로 세우는 과정을 다룬다.

사내 데이터가 오가는 챗 서비스였기 때문에 "인터넷에 아무것도 노출하지 않는다"는 제약이 출발점이었다. 동시에 무거운 문서 파싱과 벡터 검색을 별도 서비스로 떼어내고, 트래픽에 따라 탄력적으로 늘어나며, 컨테이너가 재시작되어도 사용자 데이터가 사라지지 않는 구조가 필요했다. Azure Container Apps(이하 ACA)로 이 요구사항을 어떻게 만족시켰는지, 매니페스트와 스케일 규칙 수준까지 내려가서 정리한다.

---

## 1. 관리형 컨테이너, 무엇을 맡길 것인가

컨테이너를 프로덕션에 올리는 선택지는 크게 세 갈래다. 쿠버네티스(Kubernetes)를 직접 운영하는 AKS, 웹 애플리케이션에 특화된 App Service, 그리고 서버리스에 가까운 관리형 컨테이너 런타임인 ACA다. 세 가지는 기능 집합보다 "무엇을 운영자가 책임지는가"에서 갈린다.

| 항목 | AKS (직접 운영) | App Service | Azure Container Apps |
| :--- | :--- | :--- | :--- |
| 노드·컨트롤 플레인 관리 | 직접 (업그레이드·패치·노드풀) | 불필요 | 불필요 (관리형) |
| 확장 단위 | HPA·KEDA·클러스터 오토스케일러 직접 구성 | 플랜·인스턴스 수동/Autoscale | KEDA 기반 리플리카 0~N 자동 |
| 네트워크 통제 | CNI·NetworkPolicy 전권 | VNet 통합·프라이빗 엔드포인트 | 환경 단위 VNet 주입(위임 서브넷) |
| 요청 기반 스케일 | KEDA·Karpenter 등 별도 도입 | 제한적 | `http-scaler` 내장 |
| 비용 모델 | 노드 상시 과금 + 컨트롤 플레인 | 플랜 고정 과금 | vCPU·GiB·초 단위 소비 과금 |
| 최소 운영 인력 | 전담 SRE 필요 | 소수 | 소수 (K8s 지식 재사용 가능) |

세부 비교에서 ACA를 고른 이유는 명확했다. K8s의 선언형 모델과 KEDA 스케일러 생태계는 그대로 쓰고 싶지만, 클러스터 업그레이드·노드 패치·CNI 트러블슈팅을 감당할 전담 인력은 없었다. ACA는 컨테이너 앱이라는 단위로 파드를 추상화하고, 리비전(Revision)이라는 배포 단위를 제공하며, 내부적으로는 KEDA와 Envoy 기반 인그레스를 노출한다. 즉 "K8s를 쓰되 컨트롤 플레인은 남에게 맡기는" 타협점이다. K8s의 기본 개념이 처음이라면 이전에 정리해 둔 [Kubernetes 기본 개념 정리](https://ingu627.github.io/docker/kubernetes1/)를 먼저 보면 이해가 빠르다.

### 1.1 ACA가 감춰 주는 것과, 감추지 않는 것

관리형이라고 해서 모든 것이 사라지는 것은 아니다. ACA가 대신 처리하는 영역과, 여전히 설계자가 결정해야 하는 영역을 구분해 두면 운영 중에 헤매지 않는다.

- **위임하는 영역**: 컨트롤 플레인 가용성, 노드 OS 패치, 파드 스케줄링, 인그레스 컨트롤러 유지보수, 리버스 프록시 TLS 종료.
- **직접 결정하는 영역**: 리소스 요청량(vCPU·메모리), 리비전 배포 전략, 스케일 규칙과 임계값, 헬스 프로브, 시크릿 주입 방식, 볼륨 마운트.
- **주의할 제약**: 컨테이너 앱당 인그레스 포트는 하나만 노출 가능하고, 영구 스토리지는 Azure Files 기반 SMB/NFS만 지원한다. 벡터 DB처럼 로컬 디스크 I/O에 민감한 워크로드는 볼륨 선택을 신중히 해야 한다.

### 1.2 서비스 분해 기준

단일 이미지로 모든 기능을 넣는 대신, 부하 특성과 장애 격리 요구가 다른 컴포넌트를 별도 컨테이너 앱으로 분리했다. 무거운 파싱 연산이 메인 웹 서비스의 응답 지연을 끌어내리는 전형적인 문제를 피하기 위해서다.

- **aca-webui**: 사용자 인터페이스이자 오케스트레이터. RAG 체인과 세션을 관리한다.
- **aca-redis**: 웹소켓 세션과 분산 캐시. 다중 리플리카 간 스트리밍 상태를 공유한다.
- **aca-qdrant**: 벡터 데이터베이스. gRPC(6334) 연결을 우선 사용한다.
- **aca-docling**: 문서 파서. PDF 등 복잡한 레이아웃을 텍스트로 변환하는 CPU 집약 워크로드다.
- **aca-searxng**: 메타 검색 엔진. RAG의 웹 검색 소스로 쓰인다.
- **aca-langfuse**: LLM 트레이싱과 옵저버빌리티 대시보드.

---

## 2. Internal 환경 설계

ACA의 컨테이너 앱은 반드시 하나의 **컨테이너 앱 환경(Container Apps Environment)** 안에서 실행된다. 이 환경이 곧 네트워크 경계다. 환경을 `internal` 모드로 만들면 환경에 할당된 내부 로드 밸런서(ILB)가 사설 IP만 갖게 되고, 외부 인터넷에서는 어떤 경로로도 컨테이너에 도달할 수 없다.

![Container Apps 환경 토폴로지](/assets/images/azure/azure-aca-architecture.png)

환경 토폴로지는 위 그림과 같다. 사용자 트래픽은 사내 망에서 내부 로드 밸런서로 들어오고, 그 뒤로 여섯 개의 컨테이너 앱이 사설 서브넷 안에서만 서로를 호출한다.

### 2.1 위임 서브넷과 사설 IP

환경을 기존 VNet에 주입하려면 전용 서브넷을 **위임(delegation)** 해야 한다. 이 서브넷은 다른 리소스에 재사용할 수 없고, 전체가 컨테이너 환경 전용으로 예약된다.

| 항목 | 설정 값 |
| :--- | :--- |
| 환경 이름 | `cae-chat-prod-eus2` |
| 네트워크 모드 | Internal only (`internal: true`) |
| 주입 서브넷 | `snet-aca` (위임: Microsoft.App/environments) |
| 고정 사설 IP | `10.0.4.53` (내부 로드 밸런서) |
| 퍼블릭 액세스 | 비활성화 |
| 인프라 리소스 그룹 | 환경 전용으로 자동 관리되는 별도 그룹 |

내부 전용 환경은 기본 FQDN도 사내 DNS로만 해석된다. 사용자는 브라우저에서 `https://chat.example.com` 같은 내부 도메인으로 접속하고, 이 도메인은 앞단의 프라이빗 DNS 존과 게이트웨이를 통해 `10.0.4.53`으로 해석된다. 외부에서 이 IP로 접근할 방법 자체가 없다.

### 2.2 환경 DNS로 내부 서비스 이름 붙이기

Internal 환경에서 가장 편리한 기능은 **환경 DNS(Environment DNS)** 다. 같은 환경에 속한 컨테이너 앱끼리는 IP가 아니라 앱 이름으로 통신할 수 있다. DNS 서픽스를 붙이지 않고 `http://aca-redis:6379`, `http://aca-qdrant:6333`처럼 호출하면 된다.

```
사내 브라우저 → chat.example.com → (프라이빗 DNS) → ILB 10.0.4.53
  ├─ aca-webui   ingress 8080     ├─ aca-qdrant   http 6333 / grpc 6334
  ├─ aca-redis   tcp 6379         ├─ aca-docling  http 5001
  ├─ aca-searxng http 8080        └─ aca-langfuse http 3000
```

이 구조 덕분에 백엔드 컴포넌트에는 인그레스를 열 이유가 없다. Redis와 Qdrant는 인그레스 규칙 없이 TCP/http 포트만 환경 내부에 노출하고, 서비스 이름으로만 접근한다. 노출 지점을 `aca-webui` 하나로 좁혀 두면 공격 표면도 그만큼 줄어든다.

---

## 3. 컨테이너 앱 매니페스트 실전

컨테이너 앱은 CLI로도, YAML 매니페스트로도 정의할 수 있다. 반복 배포와 코드 리뷰를 위해서는 매니페스트를 리포지토리에 두고 `az containerapp create/update --yaml`로 적용하는 방식이 낫다. 먼저 흐름을 잡기 위한 생성 명령이다.

```bash
az containerapp create --name aca-webui -g rg-chat-prod \
  --environment cae-chat-prod-eus2 --image myregistry.azurecr.io/chat-webui:1.4.2 \
  --target-port 8080 --ingress internal --min-replicas 1 --max-replicas 20 \
  --cpu 4.0 --memory 8.0Gi --secrets database-url=secretref:pg-conn \
  --env-vars DATABASE_URL=secretref:database-url
```

### 3.1 선언형 매니페스트

`az containerapp create`로 만든 뒤 `az containerapp show -o yaml`로 내보내면 현재 상태를 그대로 매니페스트로 얻을 수 있다. 아래는 리소스·인그레스·프로브·리비전을 모두 담은 축약 예시다.

```yaml
properties:
  configuration:
    activeRevisionsMode: Single
    ingress: { external: false, targetPort: 8080, allowInsecure: false }  # 내부 전용, TLS만 허용
    secrets:
      - name: database-url
        value: <postgres-connection-string>
      - name: storage-key
        keyVaultUrl: https://kv-chat-prod.vault.azure.net/secrets/storage-key
        identity: system
  template:
    containers:
      - name: webui
        image: myregistry.azurecr.io/chat-webui:1.4.2
        resources:
          cpu: 4.0
          memory: 8.0Gi
        env:
          - name: DATABASE_URL
            secretRef: database-url
          - name: REDIS_URL
            value: redis://aca-redis:6379/0
          - name: WEBSOCKET_MANAGER
            value: redis
          - name: JWT_EXPIRES_IN
            value: 8h
        probes:
          - type: Liveness
            httpGet: { path: /health, port: 8080 }
            initialDelaySeconds: 30
            periodSeconds: 30
            failureThreshold: 3
          - type: Readiness
            httpGet: { path: /ready, port: 8080 }
            initialDelaySeconds: 10
            periodSeconds: 10
          - type: Startup
            httpGet: { path: /health, port: 8080 }
            initialDelaySeconds: 5
            periodSeconds: 5
            failureThreshold: 30
    scale:
      minReplicas: 1
      maxReplicas: 20
      rules:
        - name: http-scale
          http:
            metadata:
              concurrentRequests: "10"
```

### 3.2 시크릿은 두 갈래로 주입한다

시크릿은 크게 두 방식으로 다룬다. 데이터베이스 커넥션 문자열처럼 자주 바뀌지 않고 환경 안에서 관리해도 되는 값은 컨테이너 앱 시크릿으로 직접 넣는다. 반대로 스토리지 키처럼 교체·감사 정책이 걸린 값은 **Key Vault 참조**(`keyVaultUrl` + 관리 ID)로 두고 값 자체를 매니페스트에 남기지 않는다. 후자는 키가 로테이션돼도 재배포 없이 반영된다.

```bash
# 시스템 할당 관리 ID 활성화 후 Key Vault 읽기 권한 부여
az containerapp identity assign --name aca-webui -g rg-chat-prod --system-assigned
az keyvault set-policy --name kv-chat-prod \
  --object-id <managed-identity-principal-id> --secret-permissions get list
```

### 3.3 프로브를 세 종류로 나누는 이유

프로브를 하나만 두면 초기 기동이 느린 컨테이너가 트래픽을 받는 순간 죽는다. Startup 프로브로 기동 완료를 넉넉히 기다리고(여기서는 최대 150초), Readiness 프로브로 트래픽 수용 가능 여부를 판단하며, Liveness 프로브는 좀비 프로세스만 재시작하도록 느슨하게 잡았다. RAG 초기화나 모델 프리로드가 있는 앱이라면 `initialDelaySeconds`를 실제 기동 시간에 맞춰 실측해서 넣어야 한다.

---

## 4. 오토스케일링: http-scaler

ACA의 스케일링은 내부적으로 **KEDA(Kubernetes Event-driven Autoscaling)** 를 사용한다. 트리거 종류만 다를 뿐, 개념은 K8s의 HPA/KEDA와 같다. 이 프로젝트에서는 HTTP 동시 요청 수를 기준으로 스케일하는 `http-scaler`를 사용했다.

![http-scaler 오토스케일링](/assets/images/azure/azure-aca-scaling.png)

위 그림처럼 트래픽이 늘어 인스턴스당 동시 요청이 임계값을 넘으면 리플리카가 추가되고, 부하가 빠지면 쿨다운을 거쳐 최소치로 줄어든다.

### 4.1 규칙과 임계값

```yaml
scale:
  minReplicas: 1          # 콜드 스타트 회피를 위해 0이 아닌 1
  maxReplicas: 20
  rules:
    - name: http-scale
      http:
        metadata:
          concurrentRequests: "10"   # 인스턴스당 동시 10 요청
```

`concurrentRequests: 10`은 "리플리카 하나가 동시에 10개 요청을 처리 중이면 다음 리플리카를 띄운다"는 의미다. 이 값을 정하는 데 정답은 없고, 서비스의 워커 모델에 달려 있다.

- **너무 낮으면**: 리플리카가 불필요하게 늘어 콜드 스타트와 비용이 증가한다.
- **너무 높으면**: 개별 인스턴스가 큐잉(queueing)으로 밀려 p95 지연이 튄다.
- **튜닝 기준**: 부하 테스트에서 p95 응답 지연이 무너지기 시작하는 지점의 동시성보다 한두 단계 낮게 잡는다.

### 4.2 스케일 인 쿨다운과 p95 실측

스케일 아웃은 즉시 일어나지만, 스케일 인은 부하가 빠진 뒤 기본적으로 300초가량 기다린 뒤에야 줄어든다. 갑자기 줄였다가 다음 버스트에서 다시 늘리는 진동을 막기 위한 장치다. 이 쿨다운을 지나치게 짧게 잡으면 비용은 조금 줄지만 응답 안정성이 나빠진다.

임계값은 감이 아니라 실측으로 잡았다. 로드 제너레이터로 동시성을 계단식으로 올리면서 Langfuse에 기록되는 TTFT(Time To First Token)와 게이트웨이 응답 지연을 함께 봤다. 동시성 8 부근까지는 p95가 완만하게 증가하다가, 10을 넘어서면서 지연 곡선의 기울기가 꺾였다. 그래서 임계값은 그보다 한 단계 아래인 10으로 두고, 스케일 아웃을 지연이 꺾이기 전에 트리거하도록 설정했다.

---

## 5. 영구 스토리지: Azure Files + Blob 이중 전략

컨테이너는 본질적으로 일회성이다. 리비전을 교체하면 컨테이너 파일 시스템은 초기화된다. 하지만 이 서비스에는 절대 사라지면 안 되는 로컬 파일이 있었다. 감사 로그 파일과 내부 SQLite 계열 상태 데이터가 `/app/backend/data` 아래에 쌓였고, 이 영역은 재시작마다 초기화되면 안 됐다.

### 5.1 Azure Files 마운트

그래서 컨테이너 앱 환경에 **Azure Files** 기반 스토리지를 등록하고, `vol-webui-data` 볼륨을 `/app/backend/data`에 마운트했다. 리비전이 교체되거나 파드가 재시작돼도 이 경로의 내용은 파일 공유에 그대로 남는다.

```yaml
storage:
  - name: webui-data
    azureFile: { accountName: st-chatprod, shareName: webui-data, accessMode: ReadWrite }
template:
  volumes:
    - name: webui-volume
      storageType: AzureFile
      storageName: webui-data
  containers:
    - name: webui
      image: myregistry.azurecr.io/chat-webui:1.4.2
      volumeMounts:
        - volumeName: webui-volume
          mountPath: /app/backend/data
```

감사 로그는 이 마운트 영역의 `/app/backend/data/audit.log`에 파일로 기록되고, 동시에 표준 출력으로도 흘려보내 Log Analytics로 수집한다. 파일은 100MB 단위로 로테이션해서 디스크가 꽉 차는 상황을 막았다. 파일과 표준 출력을 이중으로 남기는 이유는 단순하다. 파일은 컨테이너 밖으로 나가지 않는 즉시 조회용이고, 표준 출력은 중앙 로그 시스템에서 장기 보관·검색용이다.

### 5.2 Blob으로 오프로드하는 이유

Azure Files는 여러 리플리카가 공유하는 파일 시스템이라 편리하지만, 대용량 객체를 다루는 데는 최적이 아니다. RAG용 원본 문서는 수십 MB를 넘기도 하고, 업로드·다운로드가 빈번하며, 버전 관리와 수명 주기 정책이 필요하다. 이런 객체는 **Azure Blob Storage**로 오프로드했다.

- **Azure Files**: 소량·고빈도·파일 단위 접근(감사 로그, 설정, 상태). 다중 리플리카 공유가 필요할 때.
- **Azure Blob**: 대용량·저빈도·객체 단위 접근(RAG 원본 문서, 첨부 파일). 수명 주기 정책과 프라이빗 엔드포인트로 접근을 통제할 때.

Blob 엔드포인트는 프라이빗 엔드포인트(`pe-blob`)로만 접근하도록 VNet에 묶었고, 스토리지 키는 Key Vault 참조로 주입했다. 즉 파일은 Azure Files, 객체는 Blob, 자격 증명은 Key Vault로 역할을 분리한 셈이다.

---

## 6. 운영 체크리스트

배포가 끝난 다음부터가 진짜다. 장애가 났을 때 되돌릴 수 있고, 상태를 볼 수 있고, 무엇이 언제 배포됐는지 알 수 있어야 프로덕션이다.

### 6.1 리비전 전략

ACA는 배포할 때마다 **리비전(Revision)** 이라는 불변 스냅샷을 만든다. 리비전 모드에 따라 전략이 갈린다.

- **Single 모드**: 새 리비전이 활성화되면 이전 리비전은 곧바로 비활성화된다. 단순하고 이해하기 쉽다. 이 프로젝트는 기본적으로 이 모드로 운영했다.
- **Multiple 모드**: 여러 리비전을 동시에 살려 두고 트래픽 가중치로 나눈다. 카나리(canary)나 블루-그린(blue-green) 배포에 쓴다.

Multiple 모드에서 무중단 교체를 하려면 새 리비전을 100% 가중치 0으로 띄워 헬스 체크를 통과시킨 뒤, 트래픽을 10% → 50% → 100%로 밀어 올린다.

```bash
# 새 리비전을 트래픽 없이 배포한 뒤, 가중치를 100%로 전환
az containerapp update --name aca-webui -g rg-chat-prod \
  --image myregistry.azurecr.io/chat-webui:1.5.0 \
  --revision-suffix v150 --set-active-revision false
az containerapp revision set-mode --name aca-webui -g rg-chat-prod --mode multiple
az containerapp ingress traffic set --name aca-webui -g rg-chat-prod \
  --revision-weight webui--v150=100
```

### 6.2 롤백

문제가 생겼을 때 되돌리는 방법은 모드에 따라 다르다. Single 모드라면 이전 리비전을 다시 활성화하면 된다. 리비전 목록과 상태를 먼저 확인한다.

```bash
# Single 모드: 이전 리비전을 다시 활성화해 롤백
az containerapp revision list --name aca-webui -g rg-chat-prod -o table
az containerapp revision activate --name aca-webui -g rg-chat-prod --revision webui--v142
# Multiple 모드: 가중치를 이전 리비전으로 되돌림
az containerapp ingress traffic set --name aca-webui -g rg-chat-prod \
  --revision-weight webui--v142=100
```

### 6.3 로그와 상태 확인

컨테이너 안에 들어가기 전에 로그로 대부분의 문제를 좁힐 수 있다. `az containerapp logs show`는 리플리카의 표준 출력을 실시간으로 따라가며 보여준다.

```bash
# 표준 출력 실시간 스트리밍 / 시스템 로그(스케일·프로브) 확인
az containerapp logs show --name aca-webui -g rg-chat-prod --follow
az containerapp logs show --name aca-webui -g rg-chat-prod --type system --tail 100
# 현재 리플리카 수와 상태 점검
az containerapp replica list --name aca-webui -g rg-chat-prod -o table
```

### 6.4 배포 전후 점검 항목

- **프로브 경로**: `/health`·`/ready`가 실제 라우팅에 존재하는지. 리버스 프록시 뒤 경로 접두사가 붙으면 404로 프로브가 실패한다.
- **리소스·최소 리플리카**: `--cpu 4.0 --memory 8.0Gi`가 실측에 맞는지(초과 시 OOMKilled 재시작), `minReplicas: 1`로 콜드 스타트를 피하고 있는지.
- **시크릿 회전과 볼륨 경로**: Key Vault 참조 시크릿의 관리 ID 권한 유지 여부, Azure Files 마운트 경로가 앱 기대 경로와 일치하는지.
- **비용 감각**: 소비 과금 모델이므로 maxReplicas와 리소스를 방어적으로 크게 잡으면 유휴 비용이 그대로 청구된다.

ACA는 클러스터를 직접 만지지 않아도 되는 대신, 리비전·스케일 규칙·프로브·스토리지라는 네 축을 정확히 이해해야 프로덕션에서 버틴다. 다음 편에서는 이 환경 밖으로 나가는 유일한 통로, 즉 LLM 게이트웨이와 프록시 계층을 다룬다.

---

## References

- [Azure Container Apps 개요 — Microsoft Learn](https://learn.microsoft.com/ko-kr/azure/container-apps/overview)
- [Azure Container Apps 환경의 네트워킹 — Microsoft Learn](https://learn.microsoft.com/ko-kr/azure/container-apps/networking)
- [Azure Container Apps에서의 스케일링 규칙 — Microsoft Learn](https://learn.microsoft.com/ko-kr/azure/container-apps/scale-app)
- [Azure Container Apps에서 스토리지 볼륨 사용 — Microsoft Learn](https://learn.microsoft.com/ko-kr/azure/container-apps/storage-mounts)
- [Azure Container Apps의 리비전과 트래픽 분할 — Microsoft Learn](https://learn.microsoft.com/ko-kr/azure/container-apps/revisions)
