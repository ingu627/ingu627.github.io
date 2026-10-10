---
layout: single
title: "Azure OpenAI 폐쇄망 네트워크 설계: VNet·Private Endpoint·Private DNS"
excerpt: "사내 AI 채팅 플랫폼을 공용 인터넷에서 완전히 격리하기 위해 VNet·서브넷을 분리하고, Private Endpoint와 Private DNS Zone으로 Azure OpenAI를 비롯한 PaaS 리소스를 사설 IP로만 연결하는 설계 과정을 정리한다."
categories: [azure]
tags: [azure, azure-openai, vnet, private-endpoint, private-dns, 네트워크보안]
toc: true
toc_sticky: true
sidebar_main: true

date: 2026-09-01
last_modified_at: 2026-10-10
---

사내에 LLM 기반 채팅 서비스를 올리면서 가장 먼저 부딪힌 벽은 모델 성능이나 프롬프트 품질이 아니라 네트워크였다. 임직원이 올리는 문서와 프롬프트에는 사내 기밀이 섞여 있고, 그 데이터가 흘러가는 경로 중 단 하나라도 공용 인터넷 위에 노출되면 그대로 보안 사고로 이어진다. 이 글은 사내 AI 채팅 플랫폼을 폐쇄망 가상 네트워크 위에 올리면서 확정한 네트워크 설계를 기록한 것이며, 구축과 운영을 아우르는 10편 연재의 첫 번째 글이다.

1편에서는 인프라의 뼈대가 되는 계층을 다룬다.

- VNet과 서브넷을 분리해 설계한다.
- Private Endpoint로 PaaS 리소스를 사설 연결한다.
- Private DNS Zone으로 이름 해석을 재정의한다.
- 애플리케이션 계층(Container Apps)·인증(Entra ID)·게이트웨이(APIM)는 각각 뒤 편에서 따로 정리한다.

---

## 1. 왜 공용 엔드포인트로는 부족한가

### 1.1 위협 모델: 무엇을 지키려는가

"API 키를 안전하게 보관하면 되지 않나"라는 접근은 위협 모델을 절반만 보는 것이다. 공용 엔드포인트를 열어 두는 순간 다음 세 가지 공격면이 동시에 열린다.

- **자격 증명 탈취(Credential Theft)**: API 키는 결국 어딘가에 문자열로 존재한다. 환경 변수, CI 로그, 이미지 레이어, 개발자 노트북 어디든 유출 경로가 생기면 그 키 하나로 사내 LLM 쿼터 전체가 열린다.
- **트래픽 스니핑(Traffic Sniffing)**: TLS를 쓰더라도 엔드포인트가 공용 IP로 노출되면 DNS 스푸핑, 중간자(MITM) 개입, 프록시 우회 같은 시나리오를 배제할 수 없다. 특히 사내 프록시가 TLS를 종료(TLS Termination)하는 환경에서는 평문에 가까운 구간이 생긴다.
- **공용 IP 노출 표면(Attack Surface)**: 공용 엔드포인트는 스캔 대상이 된다. 인증 실패 로그가 쌓이기 시작하면 그 자체가 브루트포스 시도의 증거다.

핵심은 **키를 지키는 문제가 아니라 도달 자체를 막는 문제**라는 점이다. 키가 유출되어도 해당 자원에 도달할 네트워크 경로가 없으면 사고는 성립하지 않는다.

### 1.2 데이터 거버넌스가 네트워크 격리를 요구하는 이유

사내 보안 규정과 감사 요구사항은 보통 "기밀 데이터가 처리되는 구간은 통제된 네트워크 안에 있어야 한다"는 문장으로 귀결된다. 이 요구를 만족시키는 방법은 두 가지뿐이다.

- **데이터를 사내로 가져온다**: 자체 호스팅 모델을 온프레미스에 올린다. 비용과 운영 부담이 급격히 커지고, 최신 모델을 쓰기 어렵다.
- **모델은 관리형 서비스를 쓰되 연결 경로를 사설로 만든다**: Azure OpenAI 같은 관리형 서비스를 사설 네트워크 종단(Private Endpoint)으로만 붙이고 공용 접근을 전면 차단한다.

실용적으로는 두 번째 경로가 현실적이며, 이 글의 전체 설계도 여기에 맞춰져 있다. 데이터는 결국 사내 VNet 안에서 생성되고, 사설 IP로만 관리형 서비스에 도달한다.

그래서 남은 선택지는 하나였다.

### 1.3 엔터프라이즈 요구사항 체크리스트

설계에 들어가기 전에 만족해야 할 조건을 먼저 고정했다. 이후 섹션은 이 체크리스트를 하나씩 해소하는 과정이다.

| 요구사항 | 설계 대응 | 검증 방법 |
| :--- | :--- | :--- |
| 애플리케이션이 인터넷에 노출되지 않는다 | 내부 전용 VNet + internal LB | 공용 IP 부재 확인 |
| 관리형 AI 서비스가 공용 IP로 도달 불가 | Private Endpoint + `publicNetworkAccess: Disabled` | 사설 IP 반환 확인 |
| 이름 해석이 사설 IP로 고정된다 | Private DNS Zone + VNet Link | `nslookup` 사설 IP 확인 |
| 온프레미스에서도 동일 경로로 접근 | 조건부 포워더(Forwarder) 연동 | 사내 DNS 질의 테스트 |
| 접근 이력이 남는다 | Log Analytics 진단 로그 | 쿼리 로그 확인 |

---

## 2. VNet 설계: 서브넷 분리

### 2.1 snet-aca와 snet-pe를 나누는 이유

왜 굳이 전용 서브넷을 두 개로 나눴을까? 하나의 서브넷에 애플리케이션과 Private Endpoint를 몰아넣으면 세 가지 문제가 생긴다.

- **위임(Delegation) 충돌**: Container Apps 환경은 서브넷을 `Microsoft.App/environments`에 위임해야 한다. 위임된 서브넷은 다른 용도로 재사용할 수 없고, NSG·라우팅 정책의 자유도도 제한된다. Private Endpoint를 같은 서브넷에 두면 위임 제약에 함께 묶인다.
- **IP 고갈**: Container Apps는 리플리카가 늘어날 때마다 서브넷 IP를 소비한다. 반면 Private Endpoint는 개수만큼 고정 IP를 영구 점유한다. 성격이 다른 소비자를 분리하지 않으면 스케일아웃 시점에 IP가 부족해진다.
- **정책 분리**: Private Endpoint 서브넷은 인바운드가 사설 IP로만 들어오므로 NSG 규칙을 매우 좁게 유지할 수 있다. 애플리케이션 서브넷과 동일한 규칙을 공유하면 불필요하게 넓은 허용이 생긴다.

그래서 `snet-aca`(애플리케이션 전용, 위임)와 `snet-pe`(Private Endpoint 전용, 위임 없음)를 완전히 분리했다.

분리는 선택이 아니라 전제다.

### 2.2 CIDR 설계

VNet은 `10.0.0.0/16`으로 잡아 향후 확장 여지를 남겼다. 그 위에 두 서브넷을 `/23`과 `/24`로 나눈다.

```
VNet: vnet-hub-prod (10.0.0.0/16)
├── snet-aca   10.0.4.0/23   (10.0.4.0 ~ 10.0.5.255, 512 IPs)   ← Microsoft.App/environments 위임
├── snet-pe    10.0.1.0/24   (10.0.1.0 ~ 10.0.1.255, 256 IPs)   ← Private Endpoint 전용
└── (예약)     10.0.2.0/24                  ← 온프레미스 게이트웨이/방화벽 확장용
```

- **snet-aca를 /23으로 넉넉히**: Container Apps 환경은 노드와 리플리카 수에 비례해 IP를 소비한다. `/24`로 시작했다가 확장 시점에 서브넷 크기를 바꾸려면 환경을 재생성해야 하므로, 처음부터 `/23`을 할당해 재작업을 피했다.
- **snet-pe를 /24로**: Private Endpoint는 리소스당 NIC 하나, 고정 IP 하나를 영구 점유한다. 초기에는 `pe-aoai`, `pe-blob`, `pe-keyvault` 3개만 필요하지만 앞으로 늘어날 것을 감안해 `/24`를 잡았다.
- **비워 둔 대역**: `10.0.2.0/24`는 온프레미스 연결 게이트웨이나 방화벽 삽입을 염두에 두고 예약했다. 나중에 하이브리드 연결을 붙일 때 VNet 주소 공간을 다시 건드리지 않아도 된다.

먼저 전체 토폴로지를 보자.

![VNet·서브넷·Private Endpoint 토폴로지](/assets/images/azure/azure-vnet-topology.png)

위 다이어그램은 하나의 VNet 안에서 애플리케이션 서브넷과 Private Endpoint 서브넷이 분리되고, Private Endpoint가 각각 사설 IP를 통해 Azure OpenAI·Blob·Key Vault로 연결되는 구조를 보여준다. 애플리케이션은 사설 IP만 알 뿐 관리형 서비스의 공용 FQDN에는 접근할 수 없다.

### 2.3 az CLI로 VNet과 서브넷 만들기

가장 먼저 VNet을 만든다.

```bash
# VNet 생성 (10.0.0.0/16)
az network vnet create \
  --resource-group rg-ai-chat-prod \
  --name vnet-hub-prod \
  --location eastus2 \
  --address-prefixes 10.0.0.0/16
```

이어서 애플리케이션 서브넷을 만들고 Container Apps 환경에 위임한다. 위임(`--delegations`)을 빼먹으면 컨테이너 환경 생성 단계에서 실패한다.

```bash
# snet-aca: Microsoft.App/environments 위임
az network vnet subnet create \
  --resource-group rg-ai-chat-prod \
  --vnet-name vnet-hub-prod \
  --name snet-aca \
  --address-prefixes 10.0.4.0/23 \
  --delegations Microsoft.App/environments

# snet-pe: Private Endpoint 전용 (위임 없음)
az network vnet subnet create \
  --resource-group rg-ai-chat-prod \
  --vnet-name vnet-hub-prod \
  --name snet-pe \
  --address-prefixes 10.0.1.0/24
```

> **주의:** `snet-pe`에 `--delegations`를 주면 안 된다. Private Endpoint는 위임된 서브넷에 배치할 수 없고, 애플리케이션 위임과 네트워크 정책 설정도 서로 다르다.

필요하면 `--disable-private-endpoint-network-policies true`로 `snet-pe`에서 프라이빗 엔드포인트용 네트워크 정책을 명시적으로 끈다.

서브넷이 준비됐으니, 다음은 이 서브넷에 Private Endpoint를 배치할 차례다.

---

## 3. Private Endpoint로 PaaS 연결

### 3.1 Private Endpoint는 무엇인가

**Private Endpoint(사설 엔드포인트)** 는 관리형 PaaS 리소스 앞에 세우는 사설 네트워크 인터페이스(NIC)다. 개념적으로는 "PaaS 리소스의 사설 IP 버전을 내 서브넷 안에 하나 찍어 낸다"에 가깝다.

- Private Endpoint를 만들면 `snet-pe` 안에 NIC가 생기고, 그 NIC에 서브넷 대역의 사설 IP(예: `10.0.1.4`)가 할당된다.
- 애플리케이션은 이 사설 IP로 PaaS 리소스에 도달한다. 트래픽은 Microsoft 백본을 따라 이동하며 공용 인터넷을 경유하지 않는다.
- 리소스 종류별로 endpoint가 분리된다. 이 프로젝트에서는 다음 세 개를 만들었다.

| Private Endpoint | 대상 리소스 | 사설 IP(예시) | 용도 |
| :--- | :--- | :--- | :--- |
| `pe-aoai` | `aoai-prd-01` (Azure OpenAI) | `10.0.1.4` | LLM 추론·임베딩 |
| `pe-blob` | `st-chatprod` (Storage) | `10.0.1.5` | RAG 문서·감사 로그 저장 |
| `pe-keyvault` | Key Vault | `10.0.1.6` | 시크릿·인증서 관리 |

### 3.2 publicNetworkAccess 차단과 연결 승인

Private Endpoint를 만드는 것만으로는 부족하다. **공용 접근을 명시적으로 끄지 않으면 요청은 여전히 공용 IP로도 들어올 수 있다.** 둘을 함께 해야 사설 전용이 완성된다.

둘 중 하나만 하면 절반짜리다.

- `publicNetworkAccess: Disabled`: 리소스 수준에서 공용 엔드포인트 접근을 차단한다. 이 값을 끄지 않으면 DNS가 사설 IP를 가리켜도 공용 경로가 열려 있다.
- **Connection state(연결 상태)**: Private Endpoint는 생성 시 자동 승인되지 않을 수 있다. 승인되지 않은 연결은 `Pending` 상태로 대기하며, 대상 리소스 소유자가 `Approved`로 바꿔야 실제 트래픽이 흐른다.

```bash
# Private Endpoint 생성 (snet-pe에 NIC 배치)
az network private-endpoint create \
  --resource-group rg-ai-chat-prod \
  --name pe-aoai \
  --vnet-name vnet-hub-prod \
  --subnet snet-pe \
  --connection-name conn-aoai \
  --private-connection-resource-id "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-ai-chat-prod/providers/Microsoft.CognitiveServices/accounts/aoai-prd-01" \
  --group-id account

# 연결 상태 확인 → ProvisioningState / PrivateLinkServiceConnectionState
az network private-endpoint show \
  --resource-group rg-ai-chat-prod \
  --name pe-aoai \
  --query "privateLinkServiceConnections[0].privateLinkServiceConnectionState"

# 공용 접근 차단
az cognitiveservices account update \
  --resource-group rg-ai-chat-prod \
  --name aoai-prd-01 \
  --public-network-access Disabled
```

> **주의:** `--group-id`는 Azure OpenAI의 서브 리소스 이름 `account`를 쓴다. 리소스 종류마다 group ID가 다르므로(Blob은 `blob`, Key Vault는 `vault`) 잘못 지정하면 연결이 생성되지 않는다.

### 3.3 연결이 살아 있는지 확인하는 지점

연결 상태를 확인할 때 함께 봐야 할 값이 몇 가지 있다.

- **ProvisioningState**: `Succeeded`여야 NIC가 정상 배치된 것이다. `Failed`면 서브넷 위임이나 정책 설정이 원인인 경우가 대부분이다.
- **PrivateLinkServiceConnectionState**: `Approved`여야 한다. `Pending`이면 승인 대기 중이고, `Rejected`면 연결 정의 자체를 다시 봐야 한다.
- **할당된 사설 IP**: `privateEndpoint.networkInterfaces[0].ipConfigurations[0].privateIPAddress`로 실제 IP를 확인한다. 이 값이 뒤에서 DNS 레코드와 일치해야 한다.

---

## 4. Private DNS Zone — 공용 도메인을 사설 IP로

### 4.1 privatelink 존이 필요한가

여기서 흔한 착각이 하나 있다. Private Endpoint를 만들면 `aoai-prd-01.openai.azure.com` 같은 공용 FQDN이 자동으로 사설 IP를 가리킬 것이라는 기대다. 실제로는 그렇지 않다.

**이름 해석은 DNS가 담당하고, Private Endpoint는 IP 경로만 제공한다.** 둘을 연결해 주는 것이 Private DNS Zone이다.

결국 DNS가 전부였다.

`aoai-prd-01.openai.azure.com`은 공용 DNS에서 공용 IP를 반환하도록 정해져 있다. 이 이름을 사설 IP로 바꾸려면 조회 경로를 사설 존으로 돌려야 한다.

- **Zone 이름 규칙**: Private Endpoint용 사설 존은 공용 도메인 앞에 `privatelink.`를 붙인 이름을 쓴다. Azure OpenAI는 `privatelink.openai.azure.com`, Blob은 `privatelink.blob.core.windows.net`, Key Vault는 `privatelink.vaultcore.azure.net`이다.
- **VNet Link**: 존을 VNet에 연결(`virtual-network-link`)해야 그 VNet의 리소스가 사설 존을 조회 대상으로 본다. 링크가 없으면 존은 존재하지만 아무도 쓰지 않는다.

### 4.2 CNAME 체인 재정의 원리

왜 `privatelink.` 접두어가 필요한지 이해하려면 원래 해석 순서를 봐야 한다.

```
정상(공용) 해석:
  aoai-prd-01.openai.azure.com
      └─ CNAME → aoai-prd-01.privatelink.openai.azure.com
                     └─ A → (공용 IP)

사설 해석 (privatelink 존 + VNet Link 등록 후):
  aoai-prd-01.openai.azure.com
      └─ CNAME → aoai-prd-01.privatelink.openai.azure.com   ← 공용 DNS가 반환
                     └─ A → 10.0.1.4                        ← 사설 존이 재정의
```

핵심은 **공용 DNS가 이미 CNAME을 `privatelink.*` 도메인으로 넘겨주도록 설계되어 있다**는 점이다. 그래서 사설 존에서 `*.privatelink.*` 부분만 A 레코드로 사설 IP에 묶어 주면, 앞단 질의는 그대로 두고 마지막 단계만 사설로 바뀐다. 도메인 체인을 다시 설계할 필요가 없다.

> 정리하면, 공용 DNS는 `privatelink.*` CNAME까지만 안내하고, 마지막 A 레코드만 사설 존이 사설 IP로 바꿔 끼운다.

해석 흐름을 그림으로 정리하면 다음과 같다.

![Private DNS 해석 흐름](/assets/images/azure/azure-dns-resolution-flow.png)

위 그림은 클라이언트가 공용 FQDN을 조회할 때 공용 DNS가 CNAME을 반환하고, VNet에 연결된 사설 존이 마지막 A 레코드를 사설 IP로 응답하는 흐름을 나타낸다. VNet Link가 빠지면 이 재정의 단계가 통째로 생략된다.

### 4.3 존 생성·링크·A 레코드

세 단계를 순서대로 실행한다.

- **① 존 만들기**: `privatelink.*` 사설 존을 생성한다.
- **② VNet Link 걸기**: VNet이 이 존을 조회하도록 연결한다.
- **③ A 레코드 등록**: NIC에 할당된 사설 IP로 이름을 매핑한다.

```bash
# ① Azure OpenAI용 Private DNS Zone
az network private-dns zone create \
  --resource-group rg-ai-chat-prod \
  --name privatelink.openai.azure.com

# ② VNet Link (VNet의 리소스가 이 존을 조회하도록)
az network private-dns link vnet create \
  --resource-group rg-ai-chat-prod \
  --zone-name privatelink.openai.azure.com \
  --name link-vnet-hub-prod \
  --virtual-network vnet-hub-prod \
  --registration-enabled false

# ③ A 레코드 — pe-aoai NIC에 할당된 사설 IP로 매핑
az network private-dns record-set a create \
  --resource-group rg-ai-chat-prod \
  --zone-name privatelink.openai.azure.com \
  --name aoai-prd-01

az network private-dns record-set a add-record \
  --resource-group rg-ai-chat-prod \
  --zone-name privatelink.openai.azure.com \
  --record-set-name aoai-prd-01 \
  --ipv4-address 10.0.1.4
```

`--registration-enabled false`는 자동 등록을 쓰지 않겠다는 뜻이다. Private Endpoint용 존에서는 레코드를 명시적으로 관리하는 편이 예측 가능하다. 운영에서는 `az network private-endpoint dns-zone-group create`로 Private Endpoint와 DNS 존을 묶어 A 레코드 생성을 자동화할 수 있다.

같은 방식으로 `privatelink.blob.core.windows.net`, `privatelink.vaultcore.azure.net` 존을 각각 만들고 VNet Link와 A 레코드를 추가한다.

해석까지 사설로 고정했으니, 이제 실제로 그렇게 동작하는지 검증할 차례다.

---

## 5. 검증과 함정

### 5.1 검증 절차

설계가 끝났으면 "정말 사설 IP로 간다"를 세 각도에서 확인한다. 세 검증은 서로 다른 계층을 본다 — 하나만 통과했다고 전체가 맞다고 볼 수 없다.

```bash
# ① 이름 해석: 사설 IP가 반환되어야 한다
nslookup aoai-prd-01.openai.azure.com
# 기대: Address 10.0.1.4  (공용 IP가 나오면 DNS Zone·VNet Link 문제)

# ② 사설 존 레코드 확인
az network private-dns record-set a list \
  --resource-group rg-ai-chat-prod \
  --zone-name privatelink.openai.azure.com \
  --output table

# ③ Private Endpoint 연결 상태
az network private-endpoint show \
  --resource-group rg-ai-chat-prod \
  --name pe-aoai \
  --query "privateLinkServiceConnections[0].privateLinkServiceConnectionState.status"
# 기대: Approved
```

마지막으로 사설 IP로 TLS 연결이 정상인지 확인한다. 인증서가 공용 도메인 기준으로 발급되므로, 사설 IP로 접속해도 호스트명 검증(`--resolve`로 FQDN 고정)이 통과해야 한다.

```bash
# 사설 IP로 연결하되 SNI/Host는 FQDN으로 고정 → 인증서 검증까지 통과하는지 확인
curl -v --resolve aoai-prd-01.openai.azure.com:443:10.0.1.4 \
  https://aoai-prd-01.openai.azure.com/
```

### 5.2 흔한 실패 3가지

**① DNS Zone에 VNet Link 누락 → 공용 IP로 시도 후 차단**

세 함정 중 가장 자주 나타나는 것이 이것이다. `publicNetworkAccess: Disabled`는 정상적으로 걸었는데 `nslookup`이 공용 IP를 반환하면, 클라이언트는 공용 IP로 접속을 시도하고 차단된다.

증상은 "연결은 되는데 403/연결 거부"로 나타나며, 원인은 대개 존은 만들었지만 VNet Link가 없거나 다른 VNet에 연결된 경우다. 애플리케이션이 여러 VNet·피어링에 걸쳐 있으면 각 VNet마다 링크가 필요하다.

**② 온프레미스 DNS 포워딩 설정 누락**

VNet 안에서는 `168.63.129.16`(Azure DNS)이 사설 존을 해석하지만, 온프레미스 사내망에서 오는 질의는 자체 DNS를 거친다. 사내 DNS가 `*.openai.azure.com` 질의를 그대로 공용 DNS로 보내면 온프레미스 사용자는 공용 IP를 받고 차단된다. 해결은 사내 DNS에 **조건부 포워더(Conditional Forwarder)** 를 추가해 `privatelink.*` 도메인 질의를 Azure DNS나 전용 DNS 포워더 VM으로 넘기는 것이다.

**③ DNS 캐시(TTL)로 인한 일시적 오해석**

Private Endpoint와 DNS 레코드를 새로 만들었는데도 특정 클라이언트가 계속 공용 IP로 접속한다면, 대개 그 클라이언트의 DNS 캐시에 이전 응답이 남아 있는 것이다. 특히 JVM이나 일부 애플리케이션은 DNS 결과를 프로세스 수명 동안 캐시한다. `ipconfig /flushdns`, `resolvectl flush-caches` 같은 플러시를 하거나 재시작이 필요하며, TTL 만료를 기다리는 편이 안전할 때도 있다.

이 세 함정을 피했다면 남은 것은 원칙 정리다.

---

## 6. 정리

정리하면, 세 계층은 결국 다음 네 가지 원칙으로 수렴한다.

- **아웃바운드 통제.** 애플리케이션이 나가는 경로는 사설 종단으로만 허용하고, 공용 인터넷으로 나가는 기본 경로를 남기지 않는다.
- **사설 종단 일원화.** PaaS는 리소스마다 Private Endpoint를 세워 접근 지점을 사설 IP 하나로 모은다. 예외 경로를 만들지 않는다.
- **공용 액세스 전면 차단.** `publicNetworkAccess: Disabled`를 기본값으로 두고, 필요하면 예외를 명시적으로 연다. "일단 열어 두고 나중에 막자"는 순서를 뒤집는다.
- **이름까지 사설로.** 경로만 사설이고 이름이 공용을 가리키면 절반짜리 설계다. Private DNS Zone과 VNet Link로 해석 단계까지 사설로 고정한다.

복잡해 보이는 설계도 원칙 네 줄로 끝난다.

다음 편에서는 이 VNet 위에 애플리케이션 계층을 올린다. Container Apps 환경을 internal 모드로 배치하고, 내부 로드 밸런서와 스케일링 규칙을 잡으면서 서브넷 위임이 실제로 어떤 제약을 만드는지 다룰 예정이다.

---

## References

- [Azure Private Endpoint 개요](https://learn.microsoft.com/azure/private-link/private-endpoint-overview)
- [Azure Private Endpoint DNS 구성](https://learn.microsoft.com/azure/private-link/private-endpoint-dns)
- [Azure Private DNS Zone 개요](https://learn.microsoft.com/azure/dns/private-dns-overview)
- [Azure OpenAI 네트워크 액세스 관리(가상 네트워크·Private Endpoint)](https://learn.microsoft.com/azure/ai-services/openai/how-to/manage-network-access)
- [Azure Container Apps의 가상 네트워크 통합](https://learn.microsoft.com/azure/container-apps/vnet-custom-internal)
