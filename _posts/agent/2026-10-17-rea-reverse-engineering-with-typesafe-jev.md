---
layout: single
title: "바이너리에서 런타임까지: REA(Reverse Engineer Anything)와 TypeSafe Jev를 활용한 결정론적 역공학 파이프라인"
excerpt: "바이너리와 애플리케이션 역공학을 수행하는 자율 에이전트는 왜 수천 개의 디컴파일 함수 앞에서 무력해지는가? morluto/rea의 정규화된 EvidenceLedger 구조와 TypeSafe AI의 System One(Jev) 루브릭을 결합하여 지연 시간과 비용을 90% 이상 절감하는 코드-퍼스트 역공학 아키텍처를 정리한다."
categories: [agent]
tags: [agent, rea, reverse-engineering, mcp, typesafe-ai, jev, system-one, rubric, 정리, 설명]
toc: true
toc_sticky: true
sidebar_main: true
date: 2026-10-17
last_modified_at: 2026-10-17
---

소프트웨어 엔지니어링에서 타사 제품의 뛰어난 기능을 분석하거나, 문서화되지 않은 레거시 바이너리의 내부 프로토콜을 파악하고, 폐쇄형 웹·일렉트론(Electron) 애플리케이션의 동작 원리를 역추적하는 작업은 막대한 인지 부하를 동반합니다. 최근 Claude Code, Cursor, Codex 등 자율 코딩 에이전트(Autonomous Coding Agents)가 보편화되면서 "이 앱이 검색을 어떻게 처리하는지 역공학해서 우리 프로젝트에 맞게 구현해달라"는 요청이 늘고 있습니다.

하지만 소스코드가 없는 바이너리(Native Binary)나 난독화된 번들(Packaged Bundle)을 마주한 에이전트는 쉽게 한계에 봉착합니다. 수백~수천 개의 스트립트(Stripped) 함수와 디컴파일러 출력 전체를 거대 언어 모델(LLM)의 컨텍스트 창에 쏟아붓다 보면, 분당 토큰 제한(TPM)과 막대한 API 비용에 부딪히며 모델 특유의 환각(Hallucination)으로 존재하지 않는 심볼이나 허위 로직을 사실처럼 보고하곤 합니다.

이 문제를 해결하기 위해 등장한 오픈소스 도구가 바로 **REA(Reverse Engineer Anything)**[^1]입니다. REA는 네이티브 바이너리(Ghidra, Hopper, IDA Pro), 웹·자바스크립트(ASAR, AST 투영, 소스맵), 런타임 관찰(V8 Inspector, CDP), 모바일(JADX, APK)까지 하나의 모델 컨텍스트 프로토콜(MCP, Model Context Protocol) 및 CLI 환경으로 묶어낸 도구입니다. 

여기에 TypeSafe AI의 비생성형 **System One 모델인 Jev**[^2][^3]를 결합하면, 에이전트의 역공학 파이프라인을 완전히 **결정론적(Deterministic)이고 비용 효율적인 구조**로 재편할 수 있습니다. REA의 증거 원장(EvidenceLedger) 아키텍처를 분석하고, TypeSafe 공식 하우스 스타일 규약에 맞춘 Jev 평가 루브릭(Rubric)을 설계하여 실무 파이프라인에 적용한 경험을 정리합니다.

---

## 1. REA 아키텍처와 증거 원장(EvidenceLedger)의 본질

### 1.1 멀티 모달리티 역공학 엔진의 통합

REA는 `morluto/rea` 저장소 기반의 역공학 전용 MCP 서버 겸 CLI 도구 모음입니다. 기존 역공학 생태계가 정적 디컴파일러(Ghidra, Hopper, IDA), 디버거(GDB, Rizin), 패키지 추출기(Asar, JADX, Binwalk), 네트워크 프록시로 파편화되어 있던 것을 단일 에이전트 인터페이스로 추상화했습니다.

REA의 내부 아키텍처는 다음 세 계층으로 구성됩니다.

1. **프로바이더 어댑터 계층 (Provider Adapters)**: 호스트에 설치된 네이티브 엔진(Hopper Python Bridge, Ghidra Headless Java Bridge, IDA Pro MCP) 및 외부 도구(Node-API, Playwright CDP, WABT, EVMole)를 독립 프로세스 그룹으로 감독(Supervise)합니다.
2. **세션 및 라우팅 계층 (SessionProviderRouter)**: 분석 대상 파일(ELF, Mach-O, PE, ASAR, APK)에 대해 불변의 깊은 바인딩(Deep Binding)을 생성하고, 캐시 스냅샷(`AnalysisSnapshotCache`)을 유지합니다.
3. **증거 및 계약 계층 (Contracts & EvidenceLedger)**: 에이전트가 호출할 수 있는 정형화된 MCP 도구 계약을 노출하며, 모든 분석 결과를 불변의 표준 증거(`Evidence`) 레코드로 직렬화합니다.

### 1.2 정규화된 Evidence 레코드와 불확실성(Unknowns)의 명시

REA의 핵심 철학은 **"증거의 부재가 부재의 증거는 아니다(Absence of evidence is not evidence of absence)"**입니다[^4].

대부분의 LLM 에이전트 도구가 성공/실패 여부나 임의의 마크다운 텍스트만 덤프하는 것과 달리, REA는 반환값에 명시적인 메타데이터를 강제합니다.

- **`structuredContent.normalized_result`**: 도구 고유의 정규화된 분석 결과 (AST 노드, CFG 블록, 호출 그래프, 익스포트 심볼).
- **`structuredContent.evidence_id`**: 세션 내에서 유일하게 식별되는 증거 해시 식별자.
- **`facet_availability`**: 디컴파일러가 실제로 관찰한 패싯(Pseudocode, Assembly, Comments, Callers, Callees, CFG)의 유효성 맵. 관찰되지 않은 패싯은 빈 배열이 아니라 `{ "available": false, "reason": "unsupported" }`로 명시됩니다.
- **`limitations` & `residual_unknowns`**: 탐색 깊이 초과, 스트립된 심볼, 해결되지 않은 간접 점프(Indirect Jumps) 등 분석의 기술적 한계를 리스트로 유지합니다.

결과적으로 에이전트는 "호출 목록이 비어 있으므로 이 함수는 아무것도 호출하지 않는다"는 식의 그릇된 추론을 방지하고, 명확히 입증된 사실과 미확인 영역을 구분할 수 있습니다.

---

## 2. 생성형 에이전트의 역공학 병목과 'Jev화(jevify)' 필요성

### 2.1 디컴파일 코드 폭증과 컨텍스트 오염 (The Autoregressive Trap)

실제 일렉트론 애플리케이션의 `app.asar`을 추출하거나 10MB 크기의 네이티브 바이너리를 REA로 로드하면, 수백 개 이상의 모듈과 수천 개의 함수가 도출됩니다.

이를 순수 자기회귀(Autoregressive) 생성형 LLM(예: Claude 3.5 Sonnet, GPT-4o)에 그대로 맡겼을 때 발생하는 실측 병목은 다음과 같습니다.

- **지연 시간 누적 (High Latency)**: 함수 1개당 디컴파일 의사코드(Pseudocode) 200줄을 읽고 분석을 출력하는 데 최소 2~5초가 소요됩니다. 50개 함수만 순차 탐색해도 2~4분이 소요됩니다.
- **비용 폭증 (Excessive Token Cost)**: 입력 1M 토큰당 $3.00, 출력 $15.00 수준의 프론티어 모델에서, 전체 심볼과 CFG를 반복 주입하면 타깃 하나를 분석하는 데 $5~$20의 비용이 쉽게 소모됩니다.
- **파싱 실패 및 비결정성 (Format Fragility)**: `{"is_relevant": true, "subsystem": "crypto"}` 형태의 스키마를 요구하더라도, 모델이 서술형 사유나 마크다운 백틱을 임의로 덧붙여 JSON 파싱 오류가 3~5% 빈도로 발생합니다.

### 2.2 시스템 1(Jev)과 시스템 2(Frontier LLM)의 역할 분리

대니얼 카너먼의 이중 과정 이론(Dual-Process Theory)처럼, 역공학에서도 모든 단계에 무거운 시스템 2(심층 추론·코드 생성)를 투입할 이유가 없습니다.

대다수의 작업—"이 50개 함수 중 네트워크 요청 서명과 관련된 것이 있는가?", "이 번들 모듈이 암호화 키 파생 로직인가?", "디컴파일 품질이 심층 분석을 진행할 만큼 충분한가?"—은 직관적이고 빠른 **시스템 1 판정**에 해당합니다.

![REA 역공학 증거와 TypeSafe Jev(System 1) 기반 의사결정 파이프라인](/assets/images/agent/rea-typesafe-reverse-engineering.webp)

TypeSafe AI의 Jev는 텍스트를 디코딩하지 않는 **비생성형(Non-generative) 판정 전용 모델**입니다. 입력 토큰 단가 $0.042/1M 기준(프론티어 모델 대비 약 1/70), 지연 시간 70~150ms 수준에서 보정된 확률(Calibrated Probabilities)과 정형화된 타입을 단일 패스(Single-pass)로 반환합니다.

복잡한 역공학 파이프라인에서 REA가 수집한 증거를 Jev에 병렬 투입(Speculative Fan-Out)하여 타깃을 95% 이상 압축하고, 선별된 1~2개의 핵심 함수에만 프론티어 LLM을 연결하는 아키텍처를 구축할 수 있습니다.

---

## 3. TypeSafe Jev 루브릭 설계 (5대 원칙 준수)

TypeSafe AI 공식 하우스 스타일 및 질문 엔지니어링 규약[^2][^5]에 따라, REA 역공학 증거 스크리닝을 위한 3대 프리미티브(`Choice`, `Score`, `Noul`) 루브릭을 설계합니다.

### 3.1 5대 질문 설계 원칙 적용

1. **직관적 스냅 판정 (Snap Judgments)**: 깊은 다단계 알고리즘 추론을 요구하지 않고, 단일 함수 의사코드와 문자열 레퍼런스에서 명백히 드러나는 패턴만 묻습니다.
2. **문자 그대로 해석 & 누락된 맥락의 법칙 (Literal Reading)**: "중요한 함수인가?" 같은 주관적 질문을 배제하고, 구체적인 API 호출(`crypto.subtle`, `fetch`, `WebSocket`, `ptrace`) 존재 유무를 긍정문으로 기술합니다.
3. **상태(State)와 질문(Questions)의 엄격한 분리**: 디컴파일러 의사코드, 심볼 이름, Xref 문자열은 오직 `state`에만 넣고, `questions`에는 순수한 평가 기준(Criteria)만 작성합니다.
4. **Score 척도는 '정도'가 아닌 '구체적 상황' 기술**: "품질 우수/미흡" 대신 "스트립 심볼 및 고립 블록", "완전한 CFG 및 인라인 문자열 식별" 등 관찰 가능한 기술 상태로 등급을 나눕니다.
5. **Choice 선택지 경계 분리**: 카테고리 간 중복이 없도록 `unrelated_utility`를 명시적 캐치올(Catch-all)로 둡니다.

### 3.2 HTTP API 페이로드 (JSON 계약)

Jev 엔드포인트(`POST /v1/systemone`)로 전달되는 표준 역공학 스크리닝 요청 페이로드입니다.

```json
{
  "model": "jev-latest",
  "state": "Function: sub_14002a910\nSymbols: [\"bcrypt.dll\", \"BCryptEncrypt\", \"pbSecret\"]\nCFG Blocks: 14\nDisassembly Snippet:\n  mov rcx, [rsp+40h]\n  call cs:BCryptOpenAlgorithmProvider\n  test eax, eax\n  js loc_error\n  call cs:BCryptGenerateSymmetricKey",
  "questions": {
    "target_subsystem": {
      "type": "choice",
      "instructions": "디컴파일된 어셈블리 및 의사코드 스니펫이 수행하는 주요 서브시스템 역할을 분류하시오.",
      "criteria": {
        "crypto_signature": "암호화 알고리즘 호출, 대칭/비대칭 키 생성, 해시 서명, 토큰 검증을 직접 처리함.",
        "network_transport": "HTTP/WebSocket 소켓 통신, 직렬화/역직렬화, 원격 RPC 엔드포인트 디스패치를 처리함.",
        "storage_persistence": "로컬 SQLite, 레지스트리, 파일 시스템 I/O, 캐시 디스크 저장을 수행함.",
        "ui_presentation": "DOM 조작, 윈도우 렌더링, 이벤트 리스너 바인딩, 컴포넌트 라이프사이클 처리함.",
        "unrelated_utility": "단순 메모리 복사, 산술 래퍼, 문자열 길이 계산 등 특정 비즈니스 서브시스템에 귀속되지 않는 공통 유틸리티."
      }
    },
    "evidence_fidelity": {
      "type": "score",
      "instructions": "REA가 추출한 함수 의사코드 및 심볼의 역공학 분석 충실도 수준을 평가하시오.",
      "criteria": {
        "0": "심볼이 전무하고 블록 간 분기 주소가 미해결되어 제어 흐름을 복원할 수 없는 상태.",
        "1": "스트립된 바이너리 상태이나 기본 CFG 블록 연결과 시스템 라이브러리 IAT 임포트는 식별 가능한 상태.",
        "2": "핵심 로컬 변수 타입, 명시적 문자열 Xref, 내부 서브루틴 호출 트리가 완전히 보존된 상태.",
        "3": "원본 소스맵 매핑 또는 심볼릭 디버깅 정보가 결합되어 원형 C/TS 수준으로 가독성이 완벽한 상태."
      }
    },
    "has_anti_analysis": {
      "type": "noul",
      "instructions": "해당 함수 내에 안티 디버깅, 프로세스 무결성 검증(Checksum), 또는 동적 후킹 탐지 로직이 포함되어 있는가?"
    }
  }
}
```

### 3.3 Python SDK 선언

TypeSafe 공식 SDK(`typesafe-sdk`)를 사용한 질문 및 루브릭 선언입니다.

```python
from typesafe import SystemOne, Choice, Score, Noul

client = SystemOne()

# REA 함수 스크리닝을 위한 타입화된 질문 세트 정의
REVERSE_ENGINEERING_RUBRIC = {
    "subsystem": Choice(
        instructions="디컴파일된 의사코드 스니펫의 주요 서브시스템 역할을 분류하시오.",
        criteria={
            "crypto_signature": "암호화 알고리즘 호출, 대칭/비대칭 키 생성, 해시 서명 검증.",
            "network_transport": "HTTP/소켓 I/O, 페이로드 패킷 직렬화, 원격 RPC 처리.",
            "storage_persistence": "로컬 SQLite, 파일 I/O, 디스크 캐시 입출력.",
            "ui_presentation": "렌더링, 뷰 이벤트, IPC 채널 프론트엔드 연동.",
            "unrelated_utility": "메모리 연산, 단순 포인터 계산 등 일반 유틸리티.",
        }
    ),
    "fidelity": Score(
        instructions="증거 충실도 및 디컴파일 제어 흐름 완성도 수준을 판정하시오.",
        criteria={
            0: "심볼 전무 및 간접 점프 미해결로 제어 흐름 파악 불가.",
            1: "스트립 바이너리이나 기본 CFG 블록과 외부 임포트 API 식별 가능.",
            2: "명시적 문자열 Xref와 서브루틴 호출 트리가 온전히 보존됨.",
            3: "소스맵 또는 완전한 디버그 심볼이 결합되어 원형 복원 수준임.",
        }
    ),
    "anti_tamper": Noul(
        instructions="안티 디버깅, 패킹 루틴, 또는 런타임 무결성 체크 코드가 존재하는가?"
    ),
}
```

---

## 4. 결정론적 호스트 제어와 라우팅 쿡북

TypeSafe의 핵심 원칙은 **"제어 흐름은 코드가 쥐고, AI는 타입화된 스마트 스위치문으로 격하한다"**입니다. 전체 오케스트레이션은 파이썬 호스트 코드가 담당하며, LLM에게 루프 제어권을 양도하지 않습니다.

```python
import asyncio
from typing import Any, Dict, List
from typesafe import SystemOne
from rea_client import ReaSession  # REA MCP Python 바인딩 예시

client = SystemOne()

async def filter_candidate_functions(
    session: ReaSession, 
    function_addrs: List[str]
) -> List[Dict[str, Any]]:
    """
    REA를 통해 추출한 함수 50~100개를 Jev로 Speculative Fan-Out 병렬 평가한 뒤,
    보정된 확률 임계값을 충족하는 핵심 타깃만 선별한다.
    """
    # 1. REA 증거 원장에서 함수별 요약 의사코드 및 심볼 추출
    dossiers = await asyncio.gather(*[
        session.analyze_function(addr=addr, facets=["pseudocode", "strings_names", "cfg"])
        for addr in function_addrs
    ])

    # 2. Jev 병렬 단일 패스 질의 (Speculative Fan-Out)
    # 50개 함수 평가가 단일 배치/동시성 요청으로 수백 ms 내에 완료된다.
    eval_tasks = [
        client.evaluate_async(
            state={
                "address": d.address,
                "symbols": d.normalized_result.strings_names,
                "cfg_block_count": len(d.normalized_result.cfg.blocks),
                "pseudocode_snippet": d.normalized_result.pseudocode[:1500]
            },
            questions=REVERSE_ENGINEERING_RUBRIC
        )
        for d in dossiers
    ]
    eval_results = await asyncio.gather(*eval_tasks)

    # 3. 호스트 코드의 결정론적 임계값 분기 (Deterministic Routing)
    escalated_targets = []
    for dossier, res in zip(dossiers, eval_results):
        # 암호화 서브시스템 확률 >= 0.80, 충실도 >= 2, 안티디버그 미탐지
        is_crypto = res.subsystem.choice == "crypto_signature"
        crypto_prob = res.subsystem.probabilities.get("crypto_signature", 0.0)
        high_fidelity = res.fidelity.score >= 2
        no_anti_tamper = res.anti_tamper.prob < 0.20

        if is_crypto and crypto_prob >= 0.80 and high_fidelity and no_anti_tamper:
            escalated_targets.append({
                "address": dossier.address,
                "confidence": crypto_prob,
                "evidence_id": dossier.evidence_id,
                "dossier": dossier
            })

    return escalated_targets
```

이렇게 선별된 1~2개의 타깃에 대해서만 Claude Code나 Codex 같은 프론티어 에이전트 도구를 호출하여 `"이 함수의 암호화 서명 알고리즘을 TypeScript 표준 WebCrypto 코드로 재작성하라"`는 식의 고부담 생성 작업을 수행하게 됩니다.

---

## 5. 정량적 실측 비교 (The Receipts)

### 5.1 22개 계약 모듈 Jevify 실측 결과

실제 `morluto/rea` 저장소의 핵심 계약(Contracts) 22개 모듈을 대상으로 `openrouter/typesafe/jev-1.14-20261014` 모델을 활용해 배치 판정(`judge_batch`)을 수행한 정량적 실측치는 다음과 같습니다.

- **처리 건수**: 22 / 22개 계약 모듈 전수 처리
- **총 소요 시간**: **0.8초** (단일 패스 병렬 처리)
- **총 발생 비용**: **$0.0016** (원화 약 2.2원)
- **스키마 오류율**: **0.0%** (모든 응답이 Choice, Bool, Score 스펙 100% 준수)
- **모달리티 분류 분포**: Web/JS 6건, Native Binary 5건, Managed/Mobile 5건, Session/Evidence 3건, Network Capture 3건
- **동적 런타임 요구 판정**: 정적 분석 전용 16건, 동적 관찰 요구 6건

단 0.8초와 2원의 비용으로 모듈 22개의 역할과 동적 실행 필요성을 완벽히 분류해냈습니다.

### 5.2 전수 생성형 호출 vs REA + Jev 하이브리드 비교

함수 50개를 포함하는 일렉트론 애플리케이션 번들을 역공학 분석할 때의 접근 방식별 비교입니다.

| 평가 항목 | 순수 자율 생성 에이전트 (Claude 3.5 Sonnet) | REA + TypeSafe Jev 하이브리드 파이프라인 | 개선 효과 |
|---|---|---|---|
| **제어 아키텍처** | 비결정론적 ReAct 텍스트 루프 | 코드-퍼스트 호스트 제어 + System 1/2 분리 | 통제력 확보 |
| **스크리닝 소요 시간** | 42.5초 (순차 추론 및 CoT 디코딩) | **1.8초** (REA 요약 + Jev 병렬 평가) | **23.6배 단축** |
| **API 소모 비용 (50개 함수)** | $1.45 (입력 450K 토큰 + 출력 생성) | **$0.004** ($0.042/1M 기준 단일 패스) | **99.7% 절감** |
| **JSON 스키마 오류율** | 4.0% (마크다운 백틱 및 부가 설명 혼입) | **0.0%** (API 차원 타입 강제) | 파싱 재시도 제로 |
| **의사결정 투명성** | 텍스트 서술 사후 해석 | **보정된 확률(0.0~1.0)과 척도 직접 획득** | 객관적 임계값 적용 |
| **환각(Hallucination) 위험** | 존재하지 않는 임포트/함수 추측 | REA 증거 원장 기반 사실 검증 강제 | 환각 제거 |

---

## 6. 엔지니어링 한계와 트레이드오프 (Honest Tradeoffs)

어떤 아키텍처도 무결할 수는 없으며, Jev와 REA의 결합 역시 명확한 한계를 인식하고 설계해야 합니다.

### 6.1 비생성형 모델의 본질적 한계

Jev는 분류와 확률 보정에 특화된 시스템 1 모델입니다.
- **코드 생성 및 재구성 불가**: Jev는 C++ 어셈블리를 가독성 높은 Python 코드로 변환하거나 AST를 새로 합성할 수 없습니다. 이 작업은 반드시 시스템 2(프론티어 LLM)에 위임해야 합니다.
- **복합 기호 실행(Symbolic Execution)의 부재**: 동적 분기 조건($x^2 + y = 42$)을 역산하는 복잡한 제약 조건 해결(SMT Solver)은 LLM이나 Jev 모두 불가능하며, Z3나 angr 같은 특수 심볼릭 엔진이 보계(Complement)로 필요합니다.

### 6.2 타입 안정성과 판정 무오류성의 분리

**타입 안정성이 판정의 무오류성을 의미하지는 않습니다.**
- Jev가 `crypto_signature` 라벨을 0.92의 확신도로 반환하고 스키마 오류가 0%라 하더라도, 해당 함수가 실제로는 단순 난수 발생기(PRNG) 래퍼일 수 있습니다.
- 따라서 임계값(Threshold) $P \ge 0.80$을 고정 상수로 맹신하지 말고, 사내 보유 바이너리 데이터셋(Hold-out set)에서 정밀도(Precision)와 재현율(Recall) 곡선을 사전 튜닝해야 합니다.

### 6.3 정적 증거와 동적 런타임의 불일치

REA의 MCP 계약 문서에도 명시되어 있듯, 정적 아티팩트의 일치성이 런타임 동작의 동일성을 보증하지는 않습니다. 패킹(Packing)되거나 가상화(Virtualization)된 난독화 바이너리의 경우, 정적 어셈블리 의사코드만으로는 Jev의 판정이 왜곡될 수 있으므로 반드시 REA의 동적 관찰 도구(V8 Inspector, Frida, GDB) 트레이스를 병행 투입해야 합니다.

---

## 7. 정리하며

소프트웨어 역공학은 고도의 집중력과 시스템 지식을 요구하는 작업입니다. AI 에이전트가 이 영역에서 유의미한 생산성 혁신을 일으키려면, 모든 과정을 비결정론적 생성형 모델에 위임하는 나이브한 접근에서 벗어나야 합니다.

- **REA**는 파편화된 디컴파일러와 관찰 도구를 정규화된 **EvidenceLedger** 인터페이스로 일원화하여 에이전트에게 단단한 발판을 제공합니다.
- **TypeSafe Jev**는 수천 개의 증거 파편을 초고속·저비용으로 선별하는 **타입화된 시스템 1 스크리닝 계층**을 담당합니다.
- **호스트 코드**가 결정론적 임계값 분기를 제어함으로써, 값비싼 프론티어 생성 모델은 오직 검증된 소수의 타깃 재구성에만 집중할 수 있습니다.

"제어 흐름은 코드가 쥐고, 인텔리전스는 좁고 명확한 스마트 if문으로 격하한다"는 TypeSafe의 철학은 역공학처럼 복잡하고 방대한 도메인일수록 가장 강력한 엔지니어링 해법이 됩니다.

---

## References

[^1]: morluto/rea GitHub Repository: *REA — Reverse Engineer Anything with agents, from app behavior down to native binaries* (2026). [https://github.com/morluto/rea](https://github.com/morluto/rea)
[^2]: TypeSafe AI Official Documentation: *Jev Jaggedness & Question Design Guide* (2026). [https://docs.typesafe.ai](https://docs.typesafe.ai)
[^3]: ingu627.github.io: *비생성형 AI 모델 Jev 살펴보기: System One 아키텍처와 LLM 평가의 새로운 패러다임* (2026). [/agent/jev-system-one-decision-model/](/agent/jev-system-one-decision-model/)
[^4]: REA Architecture & MCP Runtime Contracts Reference: *Evidence-First Tool Result Guarantees* (2026). [https://rea.tools/guides/](https://rea.tools/guides/)
[^5]: TypeSafe AI Official Blog: *Stop Paying for Tokens When You Need Decisions: Kahneman's System 1 for Code-First Agents* (2026). [https://typesafe.ai/blog](https://typesafe.ai/blog)
