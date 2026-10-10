---
layout: single
title: "컨테이너 배포 자동화: ACR 파이프라인과 Container Apps 무중단 리비전"
excerpt: "컨테이너 이미지 빌드부터 Container Apps 트래픽 전환까지를 하나의 파이프라인으로 묶는 방법을 정리한다. 커밋 SHA 태깅, ACR 빌드, blue-green 리비전 전략, 스모크 테스트 게이트와 롤백 절차를 실측 명령과 함께 다룬다."
categories: [azure]
tags: [azure, acr, cicd, container-apps, deployment, blue-green]
toc: true
toc_sticky: true
sidebar_main: true

date: 2026-09-29
last_modified_at: 2026-10-10
---

[2편](https://ingu627.github.io/azure/azure-container-apps-production/)에서 Azure Container Apps(이하 ACA) 환경과 리비전의 개념까지 세웠고, [시크릿 편](https://ingu627.github.io/azure/azure-secrets-managed-identity/)에서 자격 증명을 Key Vault와 관리 ID로 걷어냈다. 남은 질문은 하나다. 이제 이 컴포넌트들을 **어떻게 안전하게, 자주 배포할 것인가**.

기능 하나를 바꾸는 데도 로컬에서 이미지를 다시 굽고, 손으로 레지스트리에 밀어 넣고, 콘솔에서 리비전을 새로 만드는 과정을 반복하면 언젠가 반드시 사고가 난다. 이번 편은 그 반복 작업을 커밋 하나로 줄이면서도, 문제가 생겼을 때 30초 안에 되돌릴 수 있는 배포 체계를 다룬다.

---

## 1. 수동 배포가 무너지는 지점

배포가 손에 익으면 처음에는 편하다. 하지만 배포 횟수가 늘어나는 순간, 수동 절차는 조용히 세 가지를 어긋나게 만든다. 빌드 재현성, 배포 이력, 그리고 롤백 가능성이다.

가장 먼저 무너지는 건 **빌드 재현성**이다. 개발자 노트북의 도커 엔진 버전, 로컬에 남은 캐시 레이어, 심지어 빌드 시각에 따라 결과 이미지가 미묘하게 달라진다. "내 로컬에서는 되는데"라는 문장이 여기서 나온다. 같은 커밋인데 개발자 A가 올린 이미지와 B가 올린 이미지가 다른 다이제스트를 갖는 상황이 실제로 발생한다.

두 번째는 **이력 추적 불가**다. 이미지 태그를 `latest`나 `v1`, `v2`처럼 사람이 붙이면, 지금 운영 중인 리비전이 정확히 어느 커밋에서 나왔는지 알 수 없다. 장애가 났을 때 "언제 무엇이 바뀌었나"를 되짚을 근거가 사라진다. 태그는 덮어쓸 수 있으므로 `latest`는 배포 시점에 무엇을 가리켰는지조차 보장하지 못한다.

세 번째는 **롤백 불가**다. 이전 이미지가 레지스트리에 그대로 남아 있지 않거나, 남아 있어도 그게 어떤 코드였는지 모르면 되돌릴 대상이 없다. 다음 사례가 전형적이다.

- 로컬에서 `docker build` 후 `docker push acr-chatprod.azurecr.io/aca-webui:latest`로 밀어 넣었다.
- ACA에서 `--image ...:latest`로 새 리비전을 만들었다.
- 배포 직후 특정 API가 500을 뱉기 시작했는데, 어제 이미지가 어떤 커밋이었는지 아무도 모른다.
- 결국 코드를 다시 뒤져 "그럴듯한" 이전 커밋을 찾아 다시 빌드한다.

이 세 문제는 모두 같은 원인에서 나온다. 빌드와 배포가 사람 손에 있고, 산출물이 코드와 연결되어 있지 않기 때문이다. 해결은 단순하다. 커밋을 넣으면 파이프라인이 이미지를 굽고, 코드와 1:1로 묶인 이름표를 붙이고, 그 이름표로 리비전을 만들게 하면 된다.

### 1.1 무엇을 자동화하고, 무엇은 남겨 둘 것인가

배포 자동화라고 해서 모든 판단까지 자동으로 넘기면 위험하다. 자동화할 영역과 사람이 개입할 지점을 먼저 나눠 둔다.

- **완전 자동**: 이미지 빌드, 레지스트리 푸시, 리비전 생성, 스모크 테스트, 트래픽 전환.
- **사람 승인**: 프로덕션 전환 직전의 최종 게이트(민감 변경, 스키마 마이그레이션 동반 시).
- **자동 롤백**: 스모크 테스트 실패, 전환 후 오류율 임계 초과 시 이전 리비전으로 복귀.

이 구분이 있어야 파이프라인이 "빠르지만 위험한 자동"이 아니라 "빠르고 되돌릴 수 있는 자동"이 된다.

---

## 2. 파이프라인: 커밋부터 트래픽 전환까지

전체 흐름을 먼저 그림으로 잡자. 아래는 커밋 하나가 프로덕션 트래픽이 되기까지의 경로다.

![배포 파이프라인](/assets/images/azure/azure-cicd-pipeline.png)

흐름은 이렇다. 개발자가 기능 브랜치를 병합하면 CI가 트리거되고, **Azure Container Registry(이하 ACR)** 의 클라우드 빌드로 이미지를 굽는다. 빌드가 끝나면 이미지는 커밋 SHA(Short SHA)를 태그로 달고 `acr-chatprod`에 푸시된다. 그다음 CD 단계가 이 이미지로 새 리비전을 만들고, 트래픽을 붙이기 전에 스모크 테스트를 돌린다. 통과하면 트래픽을 새 리비전으로 전환하고, 실패하면 이전 리비전을 그대로 둔다. 다이어그램의 각 단계는 앞서 말한 세 문제를 하나씩 지우는 장치다.

### 2.1 ACR 클라우드 빌드로 재현성 확보

로컬 `docker build` 대신 ACR의 빌드 기능을 쓴다. 빌드 자체를 레지스트리 안에서 수행하므로 파이프라인 러너에 도커 데몬이 필요 없고, 어떤 러너에서 돌려도 동일한 베이스 이미지와 캐시 정책을 쓴다.

```bash
# 커밋 SHA를 태그로 사용. 짧은 SHA는 이력 추적과 가독성의 균형점
SHA=$(git rev-parse --short HEAD)
az acr build --registry acr-chatprod \
  --image aca-webui:$SHA \
  --file Dockerfile .
```

`az acr build`는 소스 컨텍스트를 압축해 레지스트리로 보내고, 서버 측에서 빌드한 뒤 결과 이미지를 바로 저장한다. 개발자 노트북 상태와 무관하게 같은 커밋이면 같은 이미지가 나온다.

### 2.2 태그 규칙이 롤백을 가능하게 한다

태그는 사람이 붙이는 `v1`, `latest`가 아니라 커밋 SHA로 고정한다. 이 규칙 하나가 배포 체계의 나머지를 지탱한다.

- **추적**: 운영 중인 이미지 태그를 보면 곧 커밋이다. `git show <SHA>`로 무엇이 바뀌었는지 즉시 확인된다.
- **불변성**: SHA는 재사용되지 않으므로 태그가 가리키는 내용이 나중에 바뀌지 않는다. `latest`와 결정적으로 다른 점이다.
- **롤백 대상**: 문제가 생기면 되돌릴 이미지가 곧 이전 커밋의 SHA 태그다. 다시 빌드할 필요 없이 이미 레지스트리에 있다.

태그에 `v150` 같은 리비전 접미사(revision suffix)를 함께 붙여 ACA 리비전 이름과 대응시키면, 리비전 목록만 봐도 어느 SHA에서 나왔는지 역추적된다.

```bash
az containerapp update --name aca-webui -g rg-chat-prod \
  --image acr-chatprod.azurecr.io/aca-webui:$SHA \
  --revision-suffix $SHA
```

### 2.3 트래픽 전환은 마지막 한 걸음

이미지 푸시와 리비전 생성까지는 **사용자 트래픽이 닿지 않는 상태**다. 새 리비전을 만들어도 아직 활성 트래픽이 0이면 아무도 그 컨테이너를 호출하지 않는다. 이 지점이 무중단 배포의 핵심이다. 준비가 끝난 뒤 트래픽을 옮기는 단계를 별도로 두기 때문이다. 그 전환 명령은 다음 섹션에서 다룬다.

---

## 3. 리비전 전략: blue-green과 롤백

ACA 리비전은 배포마다 만들어지는 불변 스냅샷이다. 이 불변성 덕분에 "옛 버전"을 지우지 않고 살려 둘 수 있고, 트래픽 가중치만 바꿔 되돌릴 수 있다. 아래 그림이 두 리비전이 공존하며 트래픽이 옮겨 가는 모습이다.

![blue-green 리비전](/assets/images/azure/azure-blue-green-revisions.png)

왼쪽의 파란 리비전이 현재 100% 트래픽을 받고 있다. 오른쪽 초록 리비전은 새 코드로 생성됐지만 아직 가중치 0이라 트래픽을 받지 않는다. 스모크 테스트를 통과하면 가중치를 0 → 100으로 옮기고, 문제가 있으면 다시 파란 쪽으로 되돌린다. 리비전이 사라지지 않으므로 "전환"과 "롤백"이 같은 조작(가중치 설정)의 양방향일 뿐이다.

### 3.1 Single vs Multiple 모드

리비전 운영 방식은 모드에 따라 갈린다.

| 항목 | Single | Multiple |
| :--- | :--- | :--- |
| 활성 리비전 | 항상 하나 | 여러 개 동시 활성 |
| 트래픽 분할 | 불가 | 가중치(0~100%)로 분할 |
| 롤백 방식 | 이전 리비전 재활성화 | 가중치를 이전 리비전으로 복귀 |
| 적합한 용도 | 단순 서비스, 저위험 변경 | 무중단 배포, 카나리, blue-green |

이 프로젝트는 평상시 Single로 단순하게 가다가, 위험한 변경(DB 마이그레이션 동반, 인증 로직 변경)이 있을 때만 Multiple로 전환해 blue-green으로 밀었다. 무중단 교체 절차는 세 단계다.

```bash
# 1) 트래픽 없이(가중치 0) 새 리비전을 먼저 띄운다
az containerapp update --name aca-webui -g rg-chat-prod \
  --image acr-chatprod.azurecr.io/aca-webui:$SHA \
  --revision-suffix $SHA --set-active-revision false

# 2) Multiple 모드로 전환 (최초 1회)
az containerapp revision set-mode --name aca-webui -g rg-chat-prod --mode multiple

# 3) 새 리비전에 100% 트래픽을 준다 (직전까지는 가중치 0)
az containerapp ingress traffic set --name aca-webui -g rg-chat-prod \
  --revision-weight aca-webui--$SHA=100
```

새 리비전을 `--set-active-revision false`로 만들면 트래픽을 받지 않은 채로 기동된다. 이 상태에서 헬스 프로브와 스모크 테스트를 통과시킨 뒤에야 3번 명령으로 트래픽을 준다.

### 3.2 롤백은 트래픽을 되돌리는 일

장애가 감지되면 새 리비전을 지울 필요가 없다. 트래픽 가중치를 이전 리비전으로 돌리면 끝이다. 이전 리비전 이름은 목록에서 확인한다.

```bash
# 리비전 목록과 각 리비전의 활성/트래픽 상태 확인
az containerapp revision list --name aca-webui -g rg-chat-prod -o table

# 롤백: 이전 리비전으로 가중치를 100% 복귀
az containerapp ingress traffic set --name aca-webui -g rg-chat-prod \
  --revision-weight aca-webui--<이전_SHA>=100
```

Single 모드라면 이전 리비전을 다시 활성화하는 방식으로 같은 결과를 얻는다.

```bash
az containerapp revision activate --name aca-webui -g rg-chat-prod \
  --revision aca-webui--<이전_SHA>
```

이때 롤백이 **이미지 재빌드 없이** 끝난다는 점이 중요하다. 이전 리비전은 이미 레지스트리 이미지를 참조한 채 살아 있으므로, 복귀는 설정 변경 한 번이면 된다. 앞서 커밋 SHA로 태그를 고정한 이유가 바로 여기서 값을 한다.

---

## 4. 스모크 테스트와 게이트

무중단 배포에서 가장 흔한 실수는 "새 리비전을 띄웠으니 됐다"고 넘어가는 것이다. 컨테이너가 Running 상태라는 것과, 그 컨테이너가 정상적으로 요청을 처리한다는 것은 다른 이야기다. 그래서 전환 전에 반드시 게이트를 둔다.

### 4.1 헬스 체크와 핵심 API 검증

게이트는 두 층으로 나눈다. 첫째는 프로브가 판단하는 **생존과 준비**다. Liveness는 좀비 프로세스를 걸러내고, Readiness는 트래픽을 받을 준비가 됐는지 본다. RAG 초기화나 모델 프리로드가 있는 앱은 기동이 느리므로 Startup 프로브의 `initialDelaySeconds`와 `failureThreshold`를 실측 기동 시간에 맞춰 넉넉히 잡아야 한다.

둘째는 프로브가 못 잡는 **의존성과 기능**이다. 컨테이너는 살아 있어도 뒤의 PostgreSQL, Redis, Qdrant 중 하나가 응답하지 않으면 요청은 실패한다. 그래서 파이프라인에서 핵심 경로를 직접 호출해 본다.

- **헬스**: 게이트웨이 뒤 `/health`와 `/ready`가 200을 반환하는지.
- **핵심 API**: 로그인 세션 발급, 대화 생성 1건, 벡터 검색 1건이 실제로 성공하는지.
- **의존성**: PostgreSQL 연결 풀이 정상인지(`pool_size 15`, `overflow 20`, `recycle 900` 설정이 살아 있는지), Redis 세션 채널과 Qdrant gRPC(6334)가 열려 있는지.

이 검증은 트래픽이 붙기 전, 새 리비전의 내부 주소로 직접 호출한다. 사용자에게 노출되기 전에 실패를 발견하는 것이 목적이다.

### 4.2 실패하면 자동 롤백

게이트가 실패하면 파이프라인은 전환 단계로 넘어가지 않고 여기서 멈춘다. 새 리비전은 가중치 0인 채로 남아 있으므로 기존 트래픽은 처음부터 영향을 받지 않는다. 여기에 전환 이후의 자동 롤백 규칙을 하나 더 얹으면 안전판이 완성된다.

- 스모크 테스트 실패 시: 전환하지 않고 이전 리비전 유지, 파이프라인 실패 처리.
- 전환 후 오류율/지연 임계 초과 시: `ingress traffic set`으로 이전 리비전 가중치 복귀.
- 롤백 이후: 실패한 리비전은 가중치 0으로 남겨 원인 분석에 재사용(로그·트레이스 확인).

배포가 실패해도 사용자 요청이 끊기지 않는 것이 이 구조의 요점이다. 전환은 항상 마지막에, 검증 뒤에 온다.

### 4.3 게이트를 파이프라인 단계로 옮기기

게이트 명령은 파이프라인 스텝으로 그대로 옮긴다. 순서만 지키면 어떤 CI 도구를 쓰든 동일하다.

```bash
# 게이트 실패 시 즉시 비정상 종료하여 이후 전환 스텝을 막는다
curl -fsS https://aca-webui.internal/health || exit 1
curl -fsS https://aca-webui.internal/ready  || exit 1
# 핵심 API 검증(로그인 → 대화 1회)
python scripts/smoke_test.py --base-url https://aca-webui.internal || exit 1
```

`curl`의 `-f`는 4xx·5xx에서 실패 코드를 반환하게 하므로, 헬스 경로가 200이 아니면 이후 단계가 실행되지 않는다.

---

## 5. 운영 팁

파이프라인이 돌기 시작하면 이제 레지스트리와 리비전이 쌓인다. 방치하면 디스크와 비용이 조용히 늘어난다. 배포 자동화의 마지막 조각은 정리 정책이다.

### 5.1 ACR 이미지 정리 (보존 정책)

배포할 때마다 새 태그가 생기므로, 레지스트리는 빠르게 불어난다. 특히 빌드 과정에서 생기는 **태그 없는 매니페스트(untagged manifest)** 가 쌓이는 것이 문제다. 이들은 어느 태그도 가리키지 않지만 스토리지를 차지한다. ACR의 보존 정책으로 자동 삭제한다.

```bash
# 태그 없는 매니페스트를 30일 뒤 자동 삭제하도록 보존 정책 설정
az acr config retention update --registry acr-chatprod \
  --status enabled --days 30 --type UntaggedManifests
```

태그가 붙은 릴리스 이미지는 최근 몇 개만 남기고 정리하고 싶다면, 특정 접두사 규칙으로 오래된 것만 골라 지우는 `acr run --cmd` 스크립트를 예약 실행에 묶는다.

```bash
# 최근 20개를 제외한 webui 이미지를 정리하는 예시
az acr run --registry acr-chatprod --cmd \
  "acr purge --filter 'aca-webui:.*' --untagged --ago 30d" /dev/null
```

### 5.2 시크릿과 환경변수는 배포 시점에 주입

시크릿은 이미지에 굽지 않는다. 굽는 순간 레이어 이력에 남고, 레지스트리 접근 권한이 곧 시크릿 노출 권한이 된다. [시크릿 편](https://ingu627.github.io/azure/azure-secrets-managed-identity/)에서 정리했듯, 값은 Key Vault에 두고 컨테이너 앱 시크릿이 참조하게 한다.

```yaml
secrets:
  - name: database-url
    value: <postgres-connection-string>        # 환경 안에서 관리하는 값
  - name: storage-key
    keyVaultUrl: https://kv-chat-prod.vault.azure.net/secrets/storage-key
    identity: system                            # 키 자체는 매니페스트에 남기지 않음
```

이 구조의 장점은 배포 파이프라인이 시크릿 값을 들고 다니지 않아도 된다는 점이다. 파이프라인은 이미지 태그와 리비전 설정만 다루고, 실제 자격 증명은 Key Vault와 관리 ID가 런타임에 해석한다. 키가 로테이션돼도 재배포 없이 반영된다.

### 5.3 리비전 보존 수 관리

리비전도 무한정 쌓이면 관리 대상이 된다. 오래된 비활성 리비전은 정리하고, 최근 몇 개만 롤백 후보로 남겨 두는 편이 낫다.

- **롤백 후보 보존**: 최근 3~5개 리비전은 항상 활성 가능 상태로 유지한다.
- **비활성 리비전 정리**: 그보다 오래된 비활성 리비전은 `az containerapp revision deactivate`로 내린 뒤 삭제해 환경 자원을 회수한다.
- **가중치 정리**: Multiple 모드에서 실험이 끝난 카나리 가중치를 0으로 방치하면 트래픽 분기가 흐려지므로, 실험 종료 시 명시적으로 정리한다.

정리 기준은 "언제든 되돌릴 수 있는 최소 집합"이다. 너무 적게 남기면 롤백 후보가 사라지고, 너무 많이 남기면 관리 비용이 늘어난다.

---

## 6. 정리

배포 자동화의 본질은 명령을 자동으로 실행하는 것이 아니라, **산출물과 코드를 1:1로 묶고 되돌릴 수 있게 만드는 것**이다. 커밋 SHA를 이미지 태그로 고정하고, ACR 클라우드 빌드로 재현성을 확보하고, 스모크 게이트를 통과한 뒤에만 트래픽을 옮기면, 배포는 "무섭고 드문 일"에서 "안전하고 흔한 일"이 된다.

정리하면 이렇다.

- 빌드·푸시·리비전 생성·전환을 하나의 파이프라인으로 묶는다.
- 이미지 태그는 커밋 SHA, 리비전 접미사도 같은 값으로 맞춘다.
- 전환은 항상 검증 뒤에, 실패 시엔 가중치 복귀로 즉시 롤백한다.
- 레지스트리와 리비전은 보존 정책으로 주기적으로 정리한다.

다음 편에서는 이렇게 자주 배포할 수 있게 된 시스템이 **실제 부하에서 버티는지**를 검증한다. 로드 제너레이터로 동시성을 계단식으로 올리며 p95 지연과 오류율을 측정하고, `concurrentRequests: 10` 같은 스케일 임계값이 실측과 맞는지 되짚는다.

---

## References

- [Azure Container Apps의 리비전, 가중치 및 레이블 — Microsoft Learn](https://learn.microsoft.com/ko-kr/azure/container-apps/revisions)
- [Azure Container Apps에서 트래픽 분할 구성 — Microsoft Learn](https://learn.microsoft.com/ko-kr/azure/container-apps/traffic-splitting)
- [Azure Container Registry에서 이미지 빌드 및 관리 — Microsoft Learn](https://learn.microsoft.com/ko-kr/azure/container-registry/container-registry-tutorial-quick-task)
- [ACR 보존 정책으로 태그 없는 매니페스트 삭제 — Microsoft Learn](https://learn.microsoft.com/ko-kr/azure/container-registry/container-registry-retention-policy)
- [Azure Container Apps에서 상태 프로브 구성 — Microsoft Learn](https://learn.microsoft.com/ko-kr/azure/container-apps/health-probes)
