---
layout: single
title: "Microsoft Entra ID 기반 AI 서비스 인증·인가: OIDC SSO와 역할 매핑"
excerpt: "사내 계정 SSO를 위해 Microsoft Entra ID 앱 등록과 Authorization Code Flow를 구성하고, App Roles와 보안 그룹으로 서비스 역할을 매핑해 비밀번호 인증을 전면 차단한 뒤 세션·쿠키 보안 정책까지 정리한다."
categories: [azure]
tags: [azure, entra-id, oauth2, oidc, sso, rbac, identity]
toc: true
toc_sticky: true
sidebar_main: true

date: 2026-09-11
last_modified_at: 2026-10-10
---

1편 [Azure VNet과 Private Endpoint](/azure/azure-vnet-private-endpoint/)에서 트래픽 경로를 사설망 안으로 가둔 뒤, 2편 [Azure Container Apps 프로덕션 구성](/azure/azure-container-apps-production/)에서 컴퓨팅과 스케일링을 세웠고, 3편 [APIM 기반 LLM 게이트웨이](/azure/azure-apim-llm-gateway/)에서 모델 호출 경로를 통합했다. 4편에서는 이 플랫폼에 **누가 들어올 수 있는가**를 다룬다. 네트워크가 아무리 닫혀 있어도 인증 주체가 사내 계정 체계와 분리되어 있으면, 퇴사자 계정 하나가 곧 미회수 접근 권한이 된다.

이 글은 사내 엔터프라이즈 AI 채팅 플랫폼(A사)에서 Microsoft Entra ID(구 Azure AD)를 OIDC(OpenID Connect) IdP로 붙이고, 토큰의 `roles` 클레임으로 서비스 내부 권한을 매핑한 실제 구성을 정리한 기록이다. 다루는 범위는 다음과 같다.

- Entra ID 앱 등록과 Authorization Code Flow 4단계를 구성한다.
- 토큰의 서명·`aud`·`iss`를 검증하는 기준을 세운다.
- App Roles와 보안 그룹으로 서비스 역할을 매핑한다.
- 자체 비밀번호 인증 경로를 전부 차단한다.
- 세션·쿠키 보안 정책과 운영 시나리오를 정리한다.

인프라 리소스 이름은 모두 일반화된 예시명으로 적는다.

---

## 1. 왜 사내 계정 SSO인가

왜 자체 회원가입을 버리고 Entra ID로 갔을까? 답은 비용 구조에 있다.

자체 회원가입과 비밀번호 관리를 유지하는 비용은 눈에 잘 띄지 않는다. 처음엔 폼 하나, 해시 함수 하나면 끝나 보이지만 시간이 지나면 행정 부채로 돌아온다.

- **비밀번호 재설정 문의**: 사용자가 늘면 재설정·잠금 해제 요청도 함께 늘어난다. 인증 로직을 자체 구현했다면 이 문의를 처리할 운영 절차와 담당자까지 같이 떠안는다.
- **퇴사자 계정 방치**: 사내 인사 시스템에서 계정이 사라져도 서비스 DB에는 활성 레코드가 남는다. 회수 시점을 별도 배치로 챙기지 않으면 무기한 열린 문이 된다.
- **컴플라이언스 요구**: 감사 대응에서 "누가 언제 어떤 모델에 접근했는가"를 계정 단위로 증명해야 하는데, 자체 계정 체계는 이 증적을 인사 시스템과 연결하기 어렵다.

Entra ID 단일 인증으로 전환하면 이 비용 구조가 바뀐다. 계정의 생성·비활성화가 IdP(Identity Provider) 한 곳에서 끝나고, 그룹 멤버십이 곧 권한이 된다.

여기에 사내 표준으로 이미 운영 중인 조건부 액세스(Conditional Access) 정책과 다중 인증(MFA, Multi-Factor Authentication)을 재사용할 수 있다는 점이 결정적이다. 서비스가 MFA를 직접 구현하지 않아도, IdP가 요구하면 로그인 흐름 어디에서든 MFA가 강제된다.

비용도, 운영도 한 곳으로 모인다.

### 1.1 자체 인증과 IdP 위임의 책임 경계

핵심은 **인증(Authentication)은 IdP가, 인가(Authorization)는 서비스가** 맡는 분업이다. 서비스는 "이 사용자가 사내 직원인가"를 직접 판단하지 않는다. IdP가 서명한 토큰을 검증하고, 그 안에 담긴 역할 정보만 읽는다.

| 항목 | 자체 인증 | Entra ID 위임 |
| :--- | :--- | :--- |
| 자격 증명 저장 | 서비스 DB | IdP (서비스는 비밀번호를 모름) |
| MFA | 직접 구현 | IdP 정책 재사용 |
| 퇴사자 차단 | 별도 배치 필요 | IdP 비활성화 즉시 반영 |
| 권한 부여 | 앱 내부 테이블 | 그룹 + App Roles |
| 감사 증적 | 앱 로그만 | IdP 로그 + 앱 감사 로그 |

이 분업이 성립하려면 서비스는 토큰을 **신뢰할 수 있는 방식으로** 검증해야 한다. 그 출발점이 앱 등록(App Registration)이다.

---

## 2. 앱 등록과 OIDC 흐름

등록 시 채우는 값은 서비스 쪽 OIDC 설정과 정확히 짝을 이룬다. Entra ID에 서비스를 등록하면 IdP가 이 애플리케이션을 사내 계정 디렉터리의 정식 클라이언트로 인식한다.

### 2.1 앱 등록 필드와 서비스 설정 대응

- **Application (client) ID**: 토큰의 `aud`(Audience)가 되는 식별자다. 서비스는 이 값을 `MICROSOFT_CLIENT_ID`류 환경 변수로 들고 있다가, 돌아온 토큰의 `aud`가 자기 ID와 일치하는지 확인한다.
- **Redirect URI**: 인증 후 IdP가 인가 코드를 돌려줄 주소다. Open WebUI 계열 서비스는 `/oauth/<provider>/callback` 규약을 쓰므로 `https://chat.example.com/oauth/microsoft/callback` 형태가 된다. 여기서 도메인은 공개 예시 도메인이다. 운영에서는 HTTPS만 허용하고, 등록된 URI와 정확히 일치할 때만 콜백을 수용한다.
- **Scope**: `openid profile`을 최소로 요청한다. `openid`는 `sub`·`iss`·`aud`·`exp` 같은 ID 토큰 필수 클레임을, `profile`은 이름·`preferred_username` 같은 프로필 클레임을 담는다[^1]. 이메일·그룹 같은 추가 클레임이 필요하면 그때 범위를 넓히되, 필요 이상의 디렉터리 권한은 요구하지 않는다.
- **Client Secret**: 코드 교환(Code Exchange) 단계에서 서비스가 자기 자신임을 증명하는 비밀값이다. 컨테이너 환경에서는 절대 이미지에 굽지 않고 시크릿 저장소에서 주입한다.

### 2.2 Authorization Code Flow 4단계

![Entra ID OIDC 인증 흐름](/assets/images/azure/azure-entra-oidc-flow.png)

위 다이어그램은 브라우저·서비스·Entra ID 세 주체 사이에서 인가 코드가 오가는 순서를 나타낸다. 사용자가 서비스에 접속하면, 서비스는 세션 쿠키가 없을 때 사용자를 곧바로 Entra ID 로그인 엔드포인트로 리디렉션한다.

```
OIDC Authorization Code Flow:

User          Service(Web)              Entra ID
 │                 │                      │
 ├─ 1. 접속 ──────>│                      │
 │<─ 2. 302 redirect (authorize) ─────────┤
 ├─ 3. 로그인 + MFA ──────────────────────>│
 │<─ 4. 302 callback?code=... ─────────────┤
 ├─ 5. callback 전달 ──>│                  │
 │                 ├─ 6. code→token 교환 ─>│
 │                 │<─ 7. id_token/access_token
 │<─ 8. 세션 쿠키 발급 ─┤                  │
```

1. **인가 요청(Authorize)**: 서비스가 `client_id`, `redirect_uri`, `scope`, `state`를 붙여 IdP authorize 엔드포인트로 사용자를 보낸다. `state`는 CSRF(Cross-Site Request Forgery) 방어를 위한 임의 난수로, 콜백 시 원래 값과 대조한다[^2].
2. **사용자 인증**: 사용자는 IdP 화면에서 로그인하고, 조건부 액세스 정책이 걸려 있으면 MFA까지 수행한다. 서비스는 이 과정을 전혀 관여하지 않는다.
3. **코드 콜백**: IdP가 등록된 Redirect URI로 `code`를 실어 되돌린다. 이 코드는 일회용이며 수명이 매우 짧다.
4. **토큰 교환(Token Exchange)**: 서비스가 백채널(Back-channel)에서 `code` + `client_secret`을 IdP 토큰 엔드포인트로 보내 `id_token`과 `access_token`을 받는다.

여기서 3단계와 4단계가 분리된 것이 Authorization Code Flow의 요점이다. 토큰은 브라우저를 거치지 않고 서버 대 서버 채널로만 오간다.

### 2.3 토큰 검증: 서명, aud, iss

서비스가 토큰을 받았다고 해서 곧바로 신뢰하면 안 된다. 검증은 세 축으로 한다. OIDC Core의 ID 토큰 검증 절차도 서명·`iss`·`aud`·`exp`·`nonce`를 같은 순서로 확인하도록 규정한다[^3].

- **서명(Signature)**: IdP가 공개한 JWKS(JSON Web Key Set)로 서명을 검증한다. `OPENID_PROVIDER_URL`에 해당하는 `/.well-known/openid-configuration` 문서가 `jwks_uri`를 알려주며, 키는 주기적으로 갱신된다.
- **aud(Audience)**: 토큰의 `aud`가 자기 client ID와 일치해야 한다. 다른 앱용 토큰을 재사용하는 것을 막는다.
- **iss(Issuer)**: 발급자가 자기 테넌트(`https://login.microsoftonline.com/<tenant>/v2.0`)인지 확인한다. `common` 엔드포인트를 쓰면 다중 테넌트가 섞일 수 있으므로, 단일 테넌트 서비스는 테넌트를 명시한다.

![Entra ID Authorization Code Flow 공식 도식: 브라우저·앱·Microsoft Entra 사이의 인가 코드 교환과 id_token 검증(서명·issuer·audience·nonce·expiry) 단계](/assets/images/azure/official-entra-id-ai-service-auth.webp)

*출처: Microsoft identity platform and OpenID Connect protocol (OpenID Connect authorization flow diagram) — Microsoft Learn (<https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc>), CC BY 4.0. 8단계 토큰 교환 직후 `id_token`의 서명·issuer·audience·nonce·expiry를 검증하고, 10~11단계에서 서명 키를 JWKS로 받아오는 순서가 표시되어 있다. 다이어그램에는 위 4단계 설명에 없는 PKCE(Proof Key for Code Exchange) 챌린지도 함께 그려져 있다.*

세 검증을 통과한 뒤에야 `roles` 클레임을 읽는다. 검증 없는 클레임 신뢰는 곧 인가 우회다. 검증된 `roles`를 서비스 권한으로 옮기는 일이 다음 절의 주제다.

---

## 3. 역할 기반 접근 제어

인증이 "누구인가"라면 인가는 "무엇을 할 수 있는가"다. 이 플랫폼은 Entra ID의 **App Roles**와 **보안 그룹(Security Group)** 두 축으로 서비스 내부 역할을 결정한다.

![Entra ID 역할 → 서비스 권한 매핑](/assets/images/azure/azure-rbac-role-mapping.png)

다이어그램은 디렉터리 쪽 그룹 멤버십이 토큰의 `roles` 클레임을 거쳐 서비스 내부 권한으로 변환되는 경로를 보여준다. 사용자에게 직접 역할을 붙이지 않고 그룹에 붙이는 이유는, 권한 부여가 그룹 멤버십 편집 한 번으로 끝나기 때문이다.

권한 변경이 곧 그룹 편집이다.

### 3.1 App Roles 정의 (매니페스트)

앱 등록의 매니페스트에 서비스가 이해하는 역할을 선언한다. 역할 값(`value`)은 서비스 설정의 허용 목록과 문자열 단위로 일치해야 한다.

```json
{
  "appRoles": [
    {
      "id": "10000000-0000-0000-0000-000000000001",
      "displayName": "Chat User",
      "description": "일반 채팅 사용자",
      "value": "openwebui-user",
      "allowedMemberTypes": ["User"],
      "isEnabled": true
    },
    {
      "id": "10000000-0000-0000-0000-000000000002",
      "displayName": "Chat Admin",
      "description": "채팅 서비스 관리자",
      "value": "openwebui-admin",
      "allowedMemberTypes": ["User"],
      "isEnabled": true
    }
  ]
}
```

여기서 `value`가 토큰에 그대로 실리는 역할명이다. 이름을 나중에 바꾸면 기존 토큰과 서비스 설정이 어긋나므로, 권한이 이미 배포된 뒤에는 값을 안정적으로 유지한다.

### 3.2 보안 그룹 할당과 토큰 발급 조건

역할은 사용자 계정이 아니라 그룹에 할당(Enterprise Application → Users and groups)하는 것을 원칙으로 한다. 그러면 인사 이동 시 그룹 멤버십만 바꾸면 되고, 개별 사용자에 붙은 권한이 남아 있지 않다.

한 가지 중요한 전제가 있다. **`roles` 클레임이 토큰에 실리려면 해당 사용자가 앱에 명시적으로 할당되어 있어야 한다.**[^4]

> **주의:** 그룹에만 넣고 앱에 그룹을 할당하지 않으면, 로그인은 되지만 역할이 비어 인가가 실패한다. 배포 직후 "로그인은 되는데 권한이 없다" 문의의 대부분이 여기서 나온다.

### 3.3 roles 클레임 → 서비스 역할 매핑

서비스는 토큰의 `roles` 배열을 읽어 내부 권한으로 변환한다. Open WebUI 계열에서는 `ENABLE_OAUTH_ROLE_MANAGEMENT`가 이 동작을 켜는 스위치다.

- **허용 역할 목록**: `openwebui-user`, `openwebui-admin` — 이 중 하나라도 없으면 일반 사용자로도 인정하지 않는다.
- **관리자 역할**: `openwebui-admin` 하나. 관리자 화면 접근·모델 관리·사용자 승인 등의 권한이 여기에 묶인다.
- **매핑 원리**: IdP가 준 `roles`를 서비스 내부 role 집합과 교집합한다. 서비스가 모르는 역할명은 무시된다. 따라서 IdP에 새 역할을 추가해도 서비스 설정을 갱신하기 전까지는 아무 효력이 없다. 권한 확대가 두 곳을 모두 바꿔야 일어난다는 뜻이라 안전하다.

### 3.4 미승인 사용자 오버레이 처리

로그인 자체는 성공했지만 허용 역할이 없는 사용자를 그냥 튕겨내면 사용자는 왜 막혔는지 알 수 없다. 이 서비스는 승인 대기 사용자에게 화면 오버레이로 안내 문구를 띄우고, 관리자에게 승인 요청이 전달되었음을 알린다. 오버레이 문구는 관리자 팀명을 포함하되, 승인 없이 서비스 기능에는 접근할 수 없다. 즉 UX를 부드럽게 하면서도 접근 자체는 차단한다.

정리하면 인가 판단은 세 단계다.

| 단계 | 판단 주체 | 기준 |
| :--- | :--- | :--- |
| 계정 유효성 | Entra ID | 로그인·MFA·조건부 액세스 통과 |
| 역할 존재 | 서비스 | `roles` ∩ 허용 역할 ≠ ∅ |
| 권한 세분 | 서비스 | 관리자 역할 포함 여부 |

여기까지가 인가의 뼈대다. 다음 절은 이 뼈대가 흔들리지 않도록 자체 인증 문을 닫는 설정이다.

---

## 4. 비밀번호 인증 차단과 가입 통제

Entra ID를 붙였다고 자체 인증 경로가 자동으로 사라지지는 않는다. 대부분의 서비스는 자체 가입·로그인 폼을 기본 제공하므로, 이것들을 명시적으로 꺼야 한다. 이 플랫폼의 설정은 다음과 같다.

| 설정 | 값 | 의미 |
| :--- | :--- | :--- |
| `ENABLE_SIGNUP` | `false` | 자체 회원가입 폼 비활성 |
| `ENABLE_SIGNUP_PASSWORD_CONFIRMATION` | `false` | 가입 시 비밀번호 확인 절차 제거 |
| `ENABLE_LOGIN_FORM` | `false` | 이메일/비밀번호 로그인 폼 숨김 |
| `ENABLE_PASSWORD_CHANGE_FORM` | `false` | 비밀번호 변경 UI 비활성 |
| `ENABLE_PASSWORD_AUTH` | `false` | 비밀번호 기반 인증 경로 자체 차단 |

### 4.1 왜 '차단이 기본값'인가

두 개의 인증 경로가 공존하면 보안 수준은 둘 중 **약한 쪽**으로 수렴한다. SSO를 붙여 놓아도 자체 로그인 폼이 열려 있으면, 공격자는 MFA가 걸리지 않는 그 폼을 노린다. 그래서 자체 인증을 끄는 것은 "SSO를 쓰니까 안 써도 된다"가 아니라 "SSO 외에는 아무 문도 없다"를 코드와 설정으로 강제하는 일이다.

여기에 더해 이 환경은 컨테이너가 사설망 내부에만 있어 공용 인터넷에서 직접 닿지 않는다. 자체 인증이 없고 네트워크가 닫혀 있으므로, 인증 주체는 사실상 Entra ID 하나로 좁혀진다.

결국 문은 하나만 남는다. 남은 문제는 그 문을 통과한 뒤의 상태다.

---

## 5. 세션·쿠키 보안

인증 이후의 상태는 세션 쿠키가 들고 있다. 여기서 남은 결정은 세 가지다.

- **세션 수명**: 만료를 얼마로 잡을지
- **쿠키 전송 조건**: 어떤 연결에서만 전송할지
- **피해 범위**: 토큰이 탈취됐을 때 어디까지 번질지

### 5.1 JWT 만료 8시간의 트레이드오프

이 서비스는 세션 JWT 만료를 `8h`로 잡았다. 만료를 짧게 하면 탈취된 토큰의 유효 기간이 줄어 보안은 올라가지만, 사용자는 하루에도 몇 번씩 재로그인해야 한다. 사내 업무용 도구에서 8시간은 "출근해서 한 번 로그인하면 퇴근까지 유지"에 해당하는 값으로, 보안과 사용성 사이에서 실용적인 지점이다.

비교 기준이 되는 IdP 쪽 수명은 서비스 세션과 별개다. Microsoft identity platform 문서 기준으로 ID 토큰의 기본 수명은 1시간이고, 토큰 수명 정책으로 10분~1일 범위에서만 조정할 수 있다. Refresh token의 최대 비활성 기간은 기본 90일로, 정책으로 바꿀 수 없는 값으로 문서에 적혀 있다[^5]. 서비스 세션 8시간은 이 값들과 독립적으로 정한 자체 세션 쿠키 만료다.

만료를 더 줄여야 하는 요구(예: 관리자 계정)가 있으면 전체를 낮추기보다 역할별로 차등을 두는 편이 낫다.

### 5.2 Secure 쿠키: HTTPS 전용 강제

```yaml
WEBUI_SESSION_COOKIE_SECURE: true
WEBUI_AUTH_COOKIE_SECURE: true
```

`Secure` 플래그가 붙은 쿠키는 HTTPS 연결에서만 전송된다. 평문 HTTP로 한 번이라도 오가면 쿠키가 그대로 노출되므로, 이 플래그는 선택이 아니라 기본이다[^6]. 네트워크가 사설망이더라도 브라우저와 서비스 사이 구간은 TLS로 감싼다.

### 5.3 API 키 기능 비활성화

```yaml
ENABLE_API_KEYS: false
USER_PERMISSIONS_FEATURES_API_KEYS: false
```

API 키는 세션과 달리 만료가 없거나 길고, 사용자가 임의로 만들 수 있다. 이런 장기 자격 증명이 유출되면 세션 만료 정책이 무력화된다.

이 환경은 사용자 단위 API 키 발급을 막아 자격 증명 표면을 세션 쿠키와 IdP 토큰으로 좁혔다. 토큰 탈취 시 피해 창을 유한하게 유지하려는 선택이다.

정리하면, 세션은 짧게, 쿠키는 HTTPS로만, 장기 자격 증명은 두지 않는다. 이 세션 위에서 실제 운영이 어떻게 돌아가는지가 마지막 절이다.

---

## 6. 운영 시나리오

SSO의 실질적 이득은 일상 운영에서 드러난다. 세 가지 시나리오로 정리한다.

### 6.1 입사자: 그룹 추가 → 즉시 사용

신규 입사자는 HR 시스템 기준으로 Entra ID 계정이 생기고, 관리자가 해당 사용자를 `openwebui-user` 그룹에 넣는다. 다음 로그인 때 IdP가 새 `roles`를 담은 토큰을 발급하므로 별도 서비스 등록 절차가 없다. 계정 생성과 권한 부여가 각각 한 번씩, 두 곳에서 끝난다.

### 6.2 퇴사자: IdP 비활성화 → 즉시 차단

퇴사 시 IdP에서 계정을 비활성화하면 새 토큰 발급이 불가능해진다. 이미 발급된 세션은 최대 세션 수명(8시간)만큼만 살아 있다. 자체 인증이었다면 서비스 DB의 활성 레코드를 따로 정리해야 했지만, 여기서는 회수 지점이 IdP 하나로 모인다.

### 6.3 권한 변경: 그룹 이동

일반 사용자가 관리자로 승격되는 경우, 그룹을 `openwebui-user`에서 `openwebui-admin`으로 옮기면 다음 토큰부터 관리자 역할이 실린다. 강등도 같은 방식이다. 개별 사용자에 붙은 예외 권한이 없으니 "이 사람만 아직 남아 있는" 상태가 생기지 않는다.

회수 지점이 하나면 새는 곳도 하나다.

### 6.4 감사 추적은 IdP에 남는다

인증 이벤트(로그인 성공·실패, MFA 수행, 조건부 액세스 차단)는 모두 Entra ID 로그인 로그에 남는다. 서비스 쪽은 자체 감사 로그로 "누가 어떤 모델과 대화했는가"를 기록하고, 두 로그를 계정 주체(User Principal)로 이어 붙이면 접근 이력 전체가 성립한다. 인증 증적과 사용 증적을 각자 잘하는 시스템에 나눠 맡긴 형태다.

이 구성에도 남는 제약이 있다. 인증이 IdP 한 곳에 종속되므로 Entra ID나 그 경로가 멈추면 신규 로그인은 막히고, 이미 발급된 세션만 만료까지 살아남는다. 또 역할 변경은 그룹 편집 즉시가 아니라 다음 토큰 발급 시점에 반영되므로, 세션 수명 8시간이 곧 권한 회수의 최대 지연이 된다.

이 구성을 관통하는 원칙은 다음 네 가지다.

- **인증은 IdP, 인가는 서비스.** 서비스는 서명된 토큰의 역할 정보만 읽는다.
- **문은 하나만 남긴다.** 자체 인증 경로를 끄지 않으면 보안은 약한 쪽으로 수렴한다.
- **권한은 그룹에 붙인다.** 개별 사용자 예외를 남기지 않아 회수 지점이 하나다.
- **자격 증명 수명을 유한하게.** 세션 만료·Secure 쿠키·API 키 비활성으로 피해 창을 좁힌다.

---

## References

**표준·독립 자료**

- [RFC 6749 — The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749)
- [RFC 9700 — Best Current Practice for OAuth 2.0 Security (BCP 240)](https://www.rfc-editor.org/rfc/rfc9700)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

**벤더 문서 (Microsoft)**

- [Microsoft identity platform and OpenID Connect protocol](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc) — 본문 도식 출처
- [Microsoft identity platform and OAuth 2.0 authorization code flow](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)
- [Add app roles to your application and receive them in the token](https://learn.microsoft.com/en-us/entra/identity-platform/howto-add-app-roles-in-apps)
- [Register an application with the Microsoft identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)
- [ID tokens in the Microsoft identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/id-tokens)
- [Configurable token lifetimes in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity-platform/configurable-token-lifetimes)

[^1]: [OpenID Connect Core 1.0 — Standard Claims (5.4)](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)
[^2]: [RFC 6749 — 10.12. Cross-Site Request Forgery](https://www.rfc-editor.org/rfc/rfc6749#section-10.12) · [RFC 9700 — 4.7. Cross-Site Request Forgery](https://www.rfc-editor.org/rfc/rfc9700#section-4.7)
[^3]: [OpenID Connect Core 1.0 — ID Token Validation (3.1.3.7)](https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation)
[^4]: [Microsoft Learn — Add app roles to your application and receive them in the token](https://learn.microsoft.com/en-us/entra/identity-platform/howto-add-app-roles-in-apps)
[^5]: [Microsoft Learn — Configurable token lifetimes (ID 토큰 기본 1시간·최소 10분·최대 1일, refresh token 최대 비활성 기간 90일 — 벤더 문서 기준값)](https://learn.microsoft.com/en-us/entra/identity-platform/configurable-token-lifetimes)
[^6]: [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
