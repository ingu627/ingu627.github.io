---
layout: single
title: "시크릿 거버넌스: Key Vault와 Managed Identity로 자격증명 노출면 없애기"
excerpt: "앞선 편에서 튜닝한 PostgreSQL·Redis 커넥션 정보는 결국 어딘가에서 애플리케이션으로 주입된다. 자격증명이 이미지·환경 변수·파이프라인 로그로 새는 경로를 막고, Key Vault와 Managed Identity로 값을 애플리케이션 코드에서 지우는 구조를 정리한다. 주입 패턴, 무중단 로테이션, 접근 통제와 감사까지 다룬다."
categories: [azure]
tags: [azure, key-vault, managed-identity, security, secrets, entropy]
toc: true
toc_sticky: true
sidebar_main: true

date: 2026-09-25
last_modified_at: 2026-10-10
---

직전 편 [데이터 계층 설계](https://ingu627.github.io/azure/azure-data-tier-postgres-redis/)에서 PostgreSQL 커넥션 풀과 Redis 세션 저장소를 프로덕션 기준으로 튜닝했다. 그런데 그 글에는 한 가지가 빠져 있다. 튜닝한 `database-url`과 `redis://aca-redis:6379` 같은 접속 정보가 **어떤 경로로 애플리케이션에 들어가는가** 하는 문제다.

연결 문자열은 결국 비밀번호를 포함한 자격증명(credential)이다. 이 값을 컨테이너 이미지나 배포 스크립트에 그대로 박아 넣는 순간, 아무리 네트워크를 사설망으로 닫아 두어도 그 비밀은 서비스 밖으로 흘러나간다. 이번 편은 이 시리즈의 관통 주제인 **자격증명 노출면(surface) 줄이기**를, Key Vault와 Managed Identity(관리 ID)라는 Azure 기본 도구로 정리한다.

---

## 1. 키는 예상보다 여러 곳에서 샌다

### 1.1 유출 경로는 코드가 아니다

보안 사고의 상당수는 "코드를 잘못 짜서"가 아니라 "비밀이 복제되어 여러 곳에 남아서" 일어난다. 자격증명 하나가 들어가는 순간, 그 값은 통제 범위 밖의 복사본을 만들어낸다.

- **컨테이너 이미지 레이어**: 빌드 시점에 `ENV DATABASE_URL=postgresql://user:pw@...` 같은 지시문을 Dockerfile에 넣으면, 값이 이미지 레이어에 그대로 굳는다. 컨테이너 런타임에서 변수를 지워도 이미지 레이어는 `docker history`로 그대로 읽힌다. 프라이빗 레지스트리(`acr-chatprod`)라 해도 이미지를 당겨 올 수 있는 사람에게는 전부 노출이다.
- **정적 환경 변수(env)**: 매니페스트나 `az containerapp create --env-vars`에 평문 값을 적으면, 그 값은 ARM 리소스 정의에 남는다. Azure Portal이나 CLI로 리소스 속성을 조회할 수 있는 사람이면 누구나 읽는다. 사내 개발자 전원이 리소스 읽기 권한을 갖는 조직에서는 이게 실질적 유출이다.
- **파이프라인 로그**: `echo`나 `env`로 배포 변수를 찍는 순간, 러너(runner)의 콘솔 로그에 값이 남는다. 로그는 보통 원본 스크립트보다 접근 권한이 느슨하고 보존 기간도 길다.
- **노트북·로컬 설정**: `docker-compose.override.yml`, `.env`, 실험용 노트북에 "잠깐" 붙여 둔 값이 커밋된다. 한 번 원격 저장소의 히스토리에 들어간 비밀은 되돌리기보다 회전시키는 편이 항상 빠르다.

### 1.2 원칙: 애플리케이션은 키 값을 몰라야 한다

위 경로들을 하나씩 막는 대신, 애플리케이션이 **값 자체를 알지 못하게** 만드는 편이 근본적이다. 애플리케이션이 비밀번호를 들고 있으면 그 값을 복제·로그·커밋할 수 있는 지점이 존재한다. 반대로 애플리케이션이 "Key Vault의 이 이름을 읽어라"는 참조만 들고 있으면, 복제되는 것은 참조일 뿐 비밀이 아니다.

여기에 한 겹을 더 얹는 것이 **관리 ID(Managed Identity)**다. 관리 ID는 Entra ID가 리소스에 자동 발급하고 수명을 대신 관리해 주는 서비스 주체(service principal)다. 비밀번호가 없고, 개발자가 들고 다니는 정적 비밀이 아니며, 리소스가 삭제되면 함께 사라진다. 코드에 `client_secret`을 넣지 않고도 Entra ID 토큰을 얻을 수 있게 해주는 장치다.

### 1.3 노출 경로별 통제 수단

각 유출 경로는 성격이 달라, 하나의 방법으로 다 막을 수 없다. 아래 표는 경로별로 실제로 무엇을 바꿔야 하는지를 정리한 것이다. 이 글의 나머지 절이 이 표의 각 항목을 하나씩 채운다.

| 노출 경로 | 근본 원인 | 통제 수단 |
| :--- | :--- | :--- |
| 이미지 레이어 | 값이 이미지에 굳음 | 런타임 참조만 사용, 빌드 인자 분리 |
| 정적 환경 변수 | ARM 정의에 평문 저장 | 시크릿 참조(`secretref:`)·Key Vault 참조 |
| 파이프라인 로그 | 값이 콘솔에 출력 | 마스킹, 로그에 값 대신 이름만 |
| 노트북·로컬 설정 | 커밋된 비밀 | 커밋 전 스캔(secret scanning) |

공통점은 "값을 넣는 지점을 없애는" 것이 아니라 "값이 있어야 할 단 하나의 장소를 정하고, 나머지에서는 참조만 쓰는" 방향이라는 점이다. 그래서 이 시리즈 전체의 다른 편—사설망, 인증, 게이트웨이—과 같은 결론으로 수렴한다. 통제는 값이 아니라 **경계**에 건다.

---

## 2. 구조: Key Vault + Managed Identity

![시크릿 거버넌스 아키텍처](/assets/images/azure/azure-secrets-architecture.png)

위 그림은 `aca-webui`가 비밀 값을 직접 들지 않고도 데이터베이스·스토리지·게이트웨이에 접근하는 흐름을 보여준다. 핵심은 `kv-chat-prod`가 비밀의 단일 저장소이고, `aca-webui`의 관리 ID가 그 저장소를 읽을 권한을 가진 주체라는 점이다.

### 2.1 Key Vault에 무엇을 두는가

이 프로젝트에서 컨테이너 앱이 필요로 하는 값은 세 갈래였다. 셋 다 "값"이 아니라 "다른 계층으로 가는 열쇠"라는 공통점이 있다.

| 시크릿 이름 | 내용 | 소비자 |
| :--- | :--- | :--- |
| `database-url` | PostgreSQL 연결 문자열(호스트·사용자·비밀번호) | `aca-webui` |
| `storage-key` | Blob Storage 계정 키 | `aca-webui`(문서 업로드) |
| `apim-api-key` | APIM 구독 키 | `aca-webui`(LLM 호출) |

세 값 모두 코드·이미지·로그에 남으면 안 된다는 성질이 같다. Key Vault는 여기에 더해 두 가지를 제공한다. 첫째, 값이 바뀔 때마다 **버전(version)** 이 쌓여 무엇이 언제 교체됐는지 남는다. 둘째, 누가 언제 어떤 시크릿을 읽었는지 **진단 로그**로 기록된다. 후자는 5장에서 다시 다룬다.

### 2.2 관리 ID로 비밀번호 없는 인증

`aca-webui`에는 **시스템 할당 관리 ID(system-assigned managed identity)** 를 활성화했다. 시스템 할당은 리소스 수명에 묶이므로, 컨테이너 앱이 사라지면 ID도 함께 정리된다. 이 ID에 `kv-chat-prod` 범위의 읽기 역할을 주면, 애플리케이션은 Azure SDK의 기본 자격증명 체인(DefaultAzureCredential)으로 토큰을 얻어 Key Vault를 읽는다.

Key Vault 참조 방식도 같은 원리다. 컨테이너 앱 시크릿 정의에 값을 직접 넣는 대신 `keyVaultUrl`과 `identity`를 적으면, 플랫폼이 관리 ID로 값을 가져와 컨테이너에 주입한다. 애플리케이션 입장에서는 평범한 환경 변수로 보이지만, 평문 값은 어디에도 저장되지 않는다.

### 2.3 요청 한 건이 값을 얻기까지

흐름을 단계로 풀면 이렇다. 사용자 요청이 들어오면 `aca-webui`의 코드가 Azure SDK를 호출하고, SDK는 관리 ID 엔드포인트에서 토큰을 받아 Key Vault에 제시한다. Key Vault는 역할 할당을 확인한 뒤 시크릿 값을 돌려주고, 그 값으로 PostgreSQL·Blob·APIM에 접속한다. 이 사슬 어디에도 사람이 읽을 수 있는 비밀번호 파일이나 설정 값이 없다.

---

## 3. 주입 패턴: 되는 것과 안 되는 것

### 3.1 권장: Key Vault → ACA 시크릿 → 환경 변수

가장 실용적인 패턴은 Key Vault에 값을 두고, 컨테이너 앱 시크릿이 그것을 참조하며, 컨테이너는 시크릿을 환경 변수로 받는 3단 구조다. 값은 Key Vault에만 있고, 매니페스트에는 참조만 남는다.

```bash
# 1) Key Vault에 시크릿 저장 (값은 여기서만 등장)
az keyvault secret set --vault-name kv-chat-prod \
  --name database-url --value "postgresql://appuser@psql-chat-prod:5432/chat"

# 2) 컨테이너 앱에 시스템 할당 관리 ID 활성화
az containerapp identity assign --name aca-webui -g rg-chat-prod --system-assigned

# 3) 그 ID에 Key Vault 읽기 역할 부여
az role assignment create --assignee <managed-identity-principal-id> \
  --role "Key Vault Secrets User" \
  --scope /subscriptions/<sub-id>/resourceGroups/rg-chat-prod/providers/Microsoft.KeyVault/vaults/kv-chat-prod

# 4) Key Vault 참조 시크릿 등록 → 컨테이너 환경 변수로 노출
az containerapp secret set --name aca-webui -g rg-chat-prod \
  --secrets database-url=keyvaultref:https://kv-chat-prod.vault.azure.net/secrets/database-url,identityref:system
```

앞 편에서 쓴 `az keyvault set-policy`(액세스 정책 방식)도 여전히 동작하지만, 신규 배포라면 **RBAC(Role-Based Access Control)** 방식을 권한다. 역할 할당은 Azure 전역 RBAC과 같은 감사·위임 규칙을 따르고, 리소스별 정책 목록을 따로 관리하지 않아도 되기 때문이다.

### 3.2 금지: 평문 환경 변수

`--env-vars DATABASE_URL=postgresql://...`처럼 값을 직접 적는 방식은 ARM 리소스 정의에 값을 남긴다. 리소스를 읽을 수 있는 모든 주체가 비밀을 읽는다는 뜻이다. 특히 사내에서 개발자에게 구독 읽기 권한을 넓게 주는 조직일수록 이 경로가 실질적 유출 통로가 된다. 값이 필요하면 시크릿 참조(`secretref:`)나 Key Vault 참조를 쓴다.

### 3.3 금지: 코드·이미지 내장

Dockerfile의 `ENV`, 소스의 상수, 커밋된 `.env`는 가장 흔하고 가장 위험한 패턴이다. 이미지 레이어는 불변이며 삭제되지 않는다. 빌드 인자(`--build-arg`)로 넣는 값도 최종 이미지 레이어에 남을 수 있으므로, 빌드 시점과 런타임 시점의 자격증명은 분리해야 한다. 이미지 안에 남은 키는 회전(rotation) 말고는 회수 방법이 없다.

### 3.4 세 패턴 비교

세 방식을 같은 기준으로 나란히 두면 선택이 분명해진다. 판단 기준은 "값이 어디에 저장되는가"와 "교체할 때 무엇을 다시 배포해야 하는가"다.

| 패턴 | 값 저장 위치 | 로테이션 시 작업 | 평가 |
| :--- | :--- | :--- | :--- |
| Key Vault 참조 | Key Vault에만 | 새 버전 저장 후 리비전 재배포 | 권장 |
| ACA 시크릿 직접 입력 | 컨테이너 앱 정의(암호화됨) | 시크릿 갱신 후 리비전 재배포 | 조건부 허용 |
| 평문 env / 이미지 내장 | 리소스 정의·이미지 레이어 | 회전 외 회수 불가 | 금지 |

중간의 "ACA 시크릿 직접 입력"은 값이 플랫폼 내부에서 암호화되어 저장되고 ARM 응답에서는 참조로만 보인다는 점에서 평문 env보다는 낫다. 다만 Key Vault처럼 버전 이력과 독립된 접근 감사가 없고, 값을 바꾸려면 컨테이너 앱 정의를 다시 밀어야 한다. 그래서 자주 바뀌지 않고 감사 요구가 낮은 값에만 쓰고, 교체·감사 정책이 걸린 값은 Key Vault 참조로 둔다. 2편 매니페스트에서 `REDIS_URL`처럼 비밀이 아닌 주소는 `value:`로, `storage-key`처럼 민감한 값은 `keyVaultUrl:`로 나눈 것도 같은 기준이다.

---

## 4. 로테이션과 피해 범위

![키 로테이션과 피해 범위](/assets/images/azure/azure-secret-rotation.png)

위 그림은 자격증명을 교체할 때 "새 값을 먼저 유효하게 만들고, 소비자를 옮긴 뒤, 구 값을 폐기한다"는 순서를 보여준다. 순서를 지키면 무중단으로 교체되고, 반대로 구 값을 먼저 지우면 그 값을 쓰던 모든 인스턴스가 동시에 죽는다.

### 4.1 4단계 무중단 로테이션

로테이션은 "새 자격증명 발급 → 저장 → 참조 갱신 → 구 값 폐기"의 네 단계를 따른다. 핵심은 1단계에서 새 값과 구 값을 **동시에 유효**하게 만들어 두는 것이다.

1. **새 값 발급**: 백엔드에서 새 자격증명을 만든다. PostgreSQL이면 새 비밀번호를 추가 허용하고, 스토리지면 두 번째 계정 키를 생성한다. 이 시점에 구 값도 계속 살아 있어야 한다.
2. **Key Vault 저장**: 새 값을 같은 시크릿 이름의 **새 버전**으로 넣는다. Key Vault는 버전 이력을 보존하므로 구 버전으로 즉시 되돌릴 수 있다.
3. **참조 갱신**: 소비자가 버전 없는 참조(`.../secrets/database-url`)를 쓰면 자동으로 최신 버전을 읽는다. 버전이 고정된 참조를 썼다면 새 버전 URL로 바꾸고 컨테이너 앱을 새 리비전으로 배포한다.
4. **구 값 폐기**: 새 값으로 정상 동작을 확인한 뒤에만 구 자격증명을 무효화한다. 이 순서를 지키면 어느 시점에도 유효한 자격증명이 하나 이상 존재한다.

3단계에서 컨테이너 앱을 새 리비전으로 배포하는 이유는, Key Vault 참조 시크릿이 리비전 시작 시점에 값을 가져와 컨테이너에 주입되기 때문이다. 즉 2편에서 다룬 리비전(revision) 모델이 로테이션의 배포 단위가 된다.

### 4.2 순서를 어기면 생기는 일

로테이션에서 가장 흔한 사고는 4단계를 3단계보다 먼저 하는 것이다. 구 값을 먼저 폐기하면, 아직 구 값을 쓰고 있는 인스턴스들이 동시에 인증 실패를 낸다. 서비스가 순간적으로 전면 장애로 빠지고, 그 와중에 롤백까지 해야 하는 최악의 조합이 된다.

반대로 지나치게 미루는 것도 문제다. 구 값이 무효화되지 않고 남아 있으면 "교체했다"는 착각만 생기고, 유출된 구 값은 계속 유효하다. 로테이션의 목적은 새 값을 쓰는 것이 아니라 **구 값이 더 이상 통하지 않게 만드는 것**이다. 그래서 4단계는 반드시 수행하되, 3단계의 정상 동작 확인 후에만 수행한다.

### 4.3 피해 범위를 자격증명 단위로 묶기

로테이션이 아무리 빨라도, 하나의 키가 모든 것을 열면 유출 시 피해가 전면적이다. 그래서 **용도별로 자격증명을 쪼개는 것**이 로테이션 못지않게 중요하다.

3편 [APIM LLM 게이트웨이](https://ingu627.github.io/azure/azure-apim-llm-gateway/)에서 게이트웨이 구독(subscription)을 애플리케이션별로 발급한 이유가 여기 있다. 챗 UI용, 임베딩 파이프라인용, 배치 요약용 구독을 나눠 두면 `apim-api-key` 하나가 새더라도 그 구독만 폐기·재발급하면 되고, 다른 워크로드는 영향을 받지 않는다. 게다가 그 키는 Azure OpenAI 자원 접근 권한이 아니라 게이트웨이가 언제든 끊을 수 있는 1차 필터일 뿐이다. 실제 모델 접근은 APIM의 관리 ID가 담당하므로, 키가 새도 자원 탈취로 이어지지 않는다.

---

## 5. 접근 통제와 감사

### 5.1 최소 권한: 읽기만, 필요한 범위만

관리 ID에 줄 역할은 `Key Vault Secrets User`다. 이름 그대로 시크릿 **값을 읽는** 권한만 준다. 시크릿을 만들거나 지우는 `Key Vault Secrets Officer`, Key Vault 자체를 관리하는 `Contributor`는 애플리케이션 ID에 주지 않는다. 애플리케이션은 값을 소비하는 존재이고, 값을 관리하는 것은 배포 파이프라인이나 운영자의 몫이다.

- **범위(scope)**: 역할 할당은 가능한 한 좁게 건다. 구독 전체가 아니라 `kv-chat-prod` 리소스 하나에 건다.
- **분리 원칙**: 배포 주체(값을 쓰는 쪽)와 실행 주체(값을 읽는 쪽)의 권한을 분리한다. 배포 파이프라인은 시크릿 쓰기 권한이 있어도 되지만, 런타임 관리 ID는 읽기 권한만 가진다.
- **관리 ID 종류**: 리소스 수명에 묶이는 시스템 할당을 기본으로 두고, 여러 리소스가 하나의 ID를 공유해야 할 때만 사용자 할당(user-assigned)을 쓴다. 공유 ID는 편리하지만 수명 주기가 분리되어 고아(orphan) 권한이 남기 쉽다.

### 5.2 감사: 누가 언제 무엇을 읽었는가

Key Vault에도 진단 설정(diagnostic settings)을 걸어 로그를 Log Analytics로 흘려보낸다. 남기는 이벤트는 두 가지다.

- **AuditEvent / SecretGet**: 어떤 관리 ID 또는 사용자가 어떤 시크릿을 언제 읽었는지. 평소와 다른 시각, 다른 주체가 값을 조회했다면 그 자체가 침해 신호다.
- **SecretNearExpiry / SecretNewVersionCreated**: 로테이션 주기와 버전 교체 이력. 회전이 오래 멈춘 시크릿을 찾는 데 쓴다.

5편 [LLMOps 옵저버빌리티](https://ingu627.github.io/azure/llm-observability-langfuse/)에서 감사 로그를 표준 출력과 파일로 이중 기록하고 100MB 단위로 로테이션한 것과 같은 이유다. 로그는 사후 분석의 유일한 근거이므로, 남기는 시점부터 검색 가능한 중앙 저장소로 보내야 한다. Key Vault 진단 로그를 컨테이너 앱 로그와 같은 Log Analytics 작업 영역에 모아 두면, KQL 한 줄로 "시크릿 조회 시각과 앱 배포 시각의 상관"을 볼 수 있다.

### 5.3 자주 걸리는 함정

운영하면서 되풀이되는 실수는 정해져 있다. 미리 알고 있으면 진단 시간을 크게 줄일 수 있다.

- **방화벽에 막힌 관리 ID**: 컨테이너 앱 환경이 사설망에 묶여 있으면, Key Vault도 사설 엔드포인트(`pe-keyvault`)로 접근해야 한다. Key Vault의 공용 네트워크 액세스를 끄고 사설 엔드포인트만 남기면, 관리 ID 토큰은 정상인데 네트워크에서 막히는 문제가 생긴다. 이때는 Key Vault 진단 로그에 조회 시도 자체가 남지 않는 것으로 구분한다.
- **역할 할당 전파 지연**: 역할 할당은 즉시 반영되지 않는다. 배포 직후 몇 분간은 정상이던 읽기가 갑자기 권한 오류를 내기도 한다. 자동화 파이프라인에 넣을 때는 할당 후 전파를 기다리는 단계를 두는 편이 안전하다.
- **버전 고정 참조**: 참조에 버전을 박아 두면 로테이션 이후에도 옛 값을 계속 읽는다. 새 버전을 쓰려면 참조 자체를 갱신해야 하므로, 자동 로테이션을 염두에 둔다면 버전 없는 참조를 기본으로 둔다.
- **권한 회수 누락**: 관리 ID를 새로 만들고 옛 ID의 역할 할당을 지우지 않으면 사용하지 않는 주체에 권한이 남는다. 역할 할당을 정기적으로 나열해 실사용 ID와 대조한다.

---

## 6. 정리

이번 편에서 정리한 원칙은 세 문장으로 압축된다. 애플리케이션은 비밀 값을 모르고 참조만 안다. 그 참조를 읽는 권한은 관리 ID가 최소 범위로 갖는다. 값은 언제든 무중단으로 교체하고, 교체와 조회를 모두 기록한다.

이 세 가지가 지켜지면 자격증명은 더 이상 코드·이미지·로그에 남지 않는다. 남는 것은 Key Vault의 버전 이력과 진단 로그뿐이고, 그 둘은 오히려 보안에 도움이 되는 자산이 된다.

다음 편에서는 이 모든 구성—네트워크, 컨테이너, 게이트웨이, 데이터 계층, 시크릿—을 사람 손으로 반복하지 않도록 만드는 **배포 자동화**를 다룬다. 배포 파이프라인이 관리 ID로 Key Vault에 값을 쓰고, 컨테이너 앱 리비전을 무중단으로 교체하는 흐름을 정리한다.

---

## References

- [Azure Key Vault 개요 — Microsoft Learn](https://learn.microsoft.com/ko-kr/azure/key-vault/general/overview)
- [Azure 리소스용 관리 ID 개요 — Microsoft Learn](https://learn.microsoft.com/ko-kr/entra/identity/managed-identities-azure-resources/overview)
- [Key Vault 인증의 RBAC와 액세스 정책 비교 — Microsoft Learn](https://learn.microsoft.com/ko-kr/azure/key-vault/general/rbac-access-policy)
- [Azure Container Apps에서 Key Vault 참조 사용 — Microsoft Learn](https://learn.microsoft.com/ko-kr/azure/container-apps/manage-secrets)
- [Key Vault 모니터링 및 진단 로그 — Microsoft Learn](https://learn.microsoft.com/ko-kr/azure/key-vault/general/logging)
