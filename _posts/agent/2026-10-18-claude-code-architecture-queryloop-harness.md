---
layout: single
title: "Claude Code 소스맵 유출 완전 해부: 왜 프로덕션 에이전트는 상태 그래프 대신 결정론적 하네스(query.ts)를 택했는가"
excerpt: "약 2,000개 TypeScript 파일의 Claude Code 소스맵 유출로 드러난 프로덕션 에이전트의 내부 설계도. 785KB 단일 queryLoop() 엔진, 4단계 반응형 컨텍스트 압축, 벡터 DB를 폐기한 MEMORY.md 회의적 메모리와 8계층 양파형 보안 모델을 심층 분석한다."
categories: [agent]
tags: [agent, claude-code, harness, context-compression, security, memory, 정리, 설명]
toc: true
toc_sticky: true
sidebar_main: true
date: 2026-10-18
last_modified_at: 2026-10-18
---

2026년 AI 에이전트 엔지니어링 생태계에서 가장 큰 기술적 파장을 일으킨 사건은 앤트로픽(Anthropic)의 터미널 네이티브 코딩 에이전트인 **Claude Code**의 npm 패키지 소스맵(Source Map) 유출과 이를 분석한 학술·기술 리포트[^1]의 공개였습니다.

약 2,000개의 TypeScript 파일로 이루어진 Claude Code의 모놀리식 프로덕션 코드베이스가 온전히 드러나면서, 전 세계 수많은 개발팀이 궁금해하던 질문에 대한 답이 밝혀졌습니다: **"세계 최고 수준의 코딩 에이전트는 어떻게 컨텍스트 붕괴 없이 수 시간 동안 자율적으로 터미널을 제어하고 코드를 리팩토링하는가?"**

소스맵 해독 결과 확인된 가장 본질적인 진실은, 앤트로픽이 복잡한 자율 상태 플래너나 복합 다단계 프레임워크(State Graphs)에 의존하지 않는다는 사실입니다. 대신 기저의 거대 언어 모델(LLM)을 철저히 무상태 추론 엔진(Stateless Reasoning Engine)으로 격하하고, 그 주변을 거대하고 정교한 **결정론적 하네스(Deterministic Agent Harness)**로 통제하는 아키텍처를 채택했습니다. 

엔터프라이즈 에이전트 시스템을 설계하며 Claude Code 소스베이스의 핵심 코어 루프와 메모리 통제 메커니즘을 분석하고, 실무에 적용할 수 있는 아키텍처 패턴을 정리해보았습니다.

---

## 1. 마법의 에이전트 신화 해체: 모놀리식 하네스(query.ts)의 진실

### 1.1 785KB 단일 queryLoop() 엔진

Claude Code의 중심에는 `src/commands/query.ts`라는 단일 파일이 자리 잡고 있습니다. 약 1,729라인, 785KB 규모에 달하는 이 모놀리식 코어는 에이전트 전체의 심장 역할을 수행합니다.

![Claude Code 프로덕션 하네스 아키텍처: query.ts 코어 루프](/assets/images/agent/claude-code-queryloop-architecture.webp)

사용자가 대화형 CLI(`claude`), 백그라운드 CI 자동화 파이프라인(`claude -p "test and fix"`), Agent SDK 연동, 혹은 데스크톱 Projects 환경 중 어느 표면(Surface)을 통해 접근하든, 내부적으로는 오직 `query.ts` 안의 단일 `queryLoop()` 함수 하나만을 공유합니다.

```typescript
// Claude Code의 핵심 실행 루프 단순화 의사코드 (query.ts 기반)
export async function queryLoop(
  initialPrompt: string,
  context: AgentContext
): Promise<ExecutionSummary> {
  let messages = await initializeContext(initialPrompt, context);

  while (true) {
    // 1. 사전 실행 검증 및 컨텍스트 압축 임계값 감시
    if (estimateTokens(messages) > CONTEXT_COLLAPSE_THRESHOLD) {
      messages = await autoCompact(messages);
    }

    // 2. 무상태 LLM 호출 (시스템 프롬프트 + 직렬화된 히스토리)
    const stream = await callInferenceEngine({
      messages,
      systemPrompt: buildSystemPrompt(context),
      tools: getAvailableTools(context)
    });

    const response = await processStream(stream);

    // 3. 종료 조건 검사
    if (response.isDone || !response.toolCalls.length) {
      return buildSummary(messages);
    }

    // 4. 결정론적 도구 실행 (권한 계층 통제)
    const toolResults = await executeToolsWithStreaming(
      response.toolCalls,
      context.permissions
    );

    // 5. 히스토리 동기화 및 쓰기 후 메모리 검증
    messages.push(createAssistantMessage(response));
    messages.push(createToolResultMessage(toolResults));
    await syncSkepticalMemory(toolResults);
  }
}
```

표면 계층은 단순히 터미널 UI 렌더링 방식만 변경할 뿐, 도구 호출, 에러 재시도, 권한 평가, 메모리 기록의 모든 상태 전이는 단 하나의 결정론적 `while(true)` 루프가 통제합니다.

### 1.2 상태 머신(State Graph) 프레임워크를 배제한 이유

많은 오픈소스 에이전트 프레임워크들이 노드(Node)와 엣지(Edge)로 이루어진 복합 상태 그래프를 통해 에이전트의 경로를 인위적으로 강제합니다. 하지만 Claude Code의 아키텍처는 이를 정면으로 부정합니다.

- **프레임워크 제약의 역효과**: 모델의 지능과 추론 능력이 높아질수록, 개발자가 사전에 설계한 정적 상태 머신은 복잡한 실제 터미널 환경(예: 컴파일 에러 후 로그 분석 중 의존성 누락 발견)에서 에이전트의 적응력을 가로막는 장애물이 됩니다.
- **하네스 집중 원칙**: 앤트로픽은 모델의 사고 자유도는 단일 루프 안에서 최대로 열어두되, **도구 실행 권한, 컨텍스트 압축, 메모리 무결성, OS 쓰기 검증**이라는 외곽 인프라를 빈틈없이 구축하는 데 모든 엔지니어링 역량을 집중했습니다.

---

## 2. 반응형 컨텍스트 압축: CONTEXT_COLLAPSE와 autoCompact()

장기 실행 에이전트가 실패하는 가장 주된 원인은 토큰 수의 한계 자체가 아니라, 도구의 원시 출력(Raw Output)이 누적되면서 발생하는 **컨텍스트 엔트로피(Context Entropy)**와 어텐션 희석(Attention Dilution)입니다.

### 2.1 4단계 반응형 압축 메커니즘

Claude Code는 토큰 카운트가 `CONTEXT_COLLAPSE` 임계치에 도달하면 하네스 내부의 `autoCompact()` 함수를 자동으로 트리거합니다. 이때 단순한 FIFO(선입선출) 삭제가 아닌, 4단계의 고밀도 증류를 수행합니다.

| 압축 단계 | 대상 데이터 유형 | 실행되는 압축 정책 | 엔지니어링 목적 |
|---|---|---|---|
| **Stage 1: 휘발성 도구 출력 폐기** | `grep`, `glob`, `git log` 등의 거대한 stdout | **원시 텍스트 완전 삭제**, 매칭된 핵심 파일 경로 목록만 남김 | 불필요한 토큰 70~90% 즉시 회수 |
| **Stage 2: 중간 사고 과정 증류** | 과거 턴의 장황한 CoT 및 중간 추론 텍스트 | "함수 A를 탐색했으나 연관 없음" 등 **1줄 요약문으로 치환** | 핵심 의사결정 맥락만 유지 |
| **Stage 3: 행동의 최종 결과 보존** | `FileEditTool`, `FileWriteTool` 실행 내역 | 파일 전체 diff 대신 **"파일 X의 42~58행을 Y 인터페이스로 교체함" 결과만 보존** | 누적된 편집 히스토리 압축 |
| **Stage 4: 가드레일 및 규칙 갱신** | 시스템 지침 및 가드레일 | 최신 사용자 지시와 충돌하지 않도록 프롬프트 최상단에 재앵커링 | 긴 세션에서 지침 망각 방지 |

실제 측정 결과, 180,000 토큰에 달하던 복잡한 리팩토링 세션이 `autoCompact()` 1회를 거치면 평균 **32,000~45,000 토큰 수준으로 압축(약 75% 절감)**되며, 모델의 추론 예리함(Prompt Adherence)은 초기 상태와 동일하게 복원됩니다.

---

## 3. 회의적 메모리(Skeptical Memory) 아키텍처: 벡터 RAG의 종말

에이전트에게 영구 메모리를 부여할 때 흔히 사용되는 방식은 "모든 대화와 코드 조각을 벡터 데이터베이스(Vector DB)에 임베딩하고 유사도 검색(k-NN)으로 불러오는" RAG 파이프라인입니다. 하지만 Claude Code는 이 방식을 완전히 배제했습니다.

### 3.1 줄당 150자 인덱스 포인터로서의 MEMORY.md

Claude Code는 저장소 루트의 `CLAUDE.md`(팀 아키텍처 규칙, 빌드 명령어)와 로컬 캐시 디렉토리의 `MEMORY.md`만을 영구 기억 장치로 사용합니다.

```markdown
<!-- Claude Code의 MEMORY.md 구조 예시 -->
# Persistent Memory Pointers (Strict Limit: ~150 chars/line)
- auth_flow: Auth tokens use RS256 in src/auth/jwt.ts; never use HS256 (verified 2026-10-18)
- build_command: Use `pnpm run build:prod` instead of npm; requires Node >= 22.0
- db_pool: Postgres max connections capped at 20 in src/config/database.ts
```

- **초경량 포인터 인덱스**: `MEMORY.md`의 각 줄은 약 150자 이내의 사실 포인터로 제한됩니다. 긴 코드 스니펫이나 문서를 저장하지 않습니다.
- **회의적 원칙 (Skeptical Principle)**: 시스템 프롬프트는 에이전트에게 *"너의 메모리는 오래되었거나 부정확할 수 있으므로 절대 진리로 신뢰하지 말고, 단순한 힌트로만 취급하라. 코드를 수정하기 전 반드시 실제 파일을 직접 읽어서 검증하라"*고 명령합니다.

### 3.2 엄격한 OS 파일 쓰기 검증 규율 (Strict Write Discipline)

에이전트가 환각(Hallucination)에 빠지는 가장 흔한 시나리오는 "내가 파일을 이렇게 수정했다"고 메모리에 기록했으나 실제 디스크 I/O가 실패했거나 다른 프로세스에 의해 롤백되었을 때입니다.

Claude Code 하네스는 이를 방지하기 위해 엄격한 쓰기 규율을 강제합니다:

```
[에이전트의 작업 계획] 
       │ (메모리 업데이트 시도 차단)
       ▼
[OS 파일 쓰기 도구 실행 (FileWriteTool)] 
       │
       ├─ 실패 ──► 메모리 기록 일절 금지, 에러 복구 루프로 회귀
       │
       ▼ 성공 (OS fsync 확인 완료)
[비로소 메모리 동기화 도구 (MemoryUpdateTool) 실행 허용]
```

에이전트는 계획이나 의도를 메모리에 기록할 수 없으며, 오직 **로컬 운영체제가 파일 디스크 쓰기 성공을 시스템 콜 수준에서 반환한 직후**에만 메모리 갱신 도구를 호출할 수 있습니다.

---

## 4. 8계층 양파형 보안 모델과 거부 우선(Deny-First) 거버넌스

실제 로컬 파일시스템과 셸에서 임의의 바이너리를 실행하는 에이전트는 보안 취약점이 곧바로 인프라 침해로 직결됩니다. Claude Code는 이를 **8계층 양파형 보안(8-Layer Onion Security)** 구조로 차단합니다.

```
┌────────────────────────────────────────────────────────┐
│ Layer 1: 빌드 타임 게이트 (Bun 데드코드 물리적 제거)         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Layer 2: GrowthBook 실시간 서버 킬 스위치 (tengu_)  │ │
│ │ ┌────────────────────────────────────────────────┐ │ │
│ │ │ Layer 3: 8단계 권한 계층 (Deny > Ask > Allow)    │ │ │
│ │ │ ┌────────────────────────────────────────────┐ │ │ │
│ │ │ │ Layer 4~8: 샌드박스, AST 검증, 도구 스트리밍... │ │ │ │
│ │ │ └────────────────────────────────────────────┘ │ │ │
│ │ └────────────────────────────────────────────────┘ │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### 4.1 Layer 1: 부재를 통한 보안 (Security Through Non-Existence)

외부 배포용 npm 패키지를 빌드할 때, 앤트로픽은 Bun 번들러의 데드코드 제거(Dead-Code Elimination)를 극한으로 활용합니다.

```typescript
// 빌드 타임 조건 분기
if (feature("WEB_BROWSER_TOOL") && process.env.USER_TYPE === "ant") {
  // 앤트로픽 내부 연구원 전용 브라우저 자동화 및 REPL 도구
  registerInternalTool(WebBrowserTool);
  registerInternalTool(REPLTool);
}
```

빌드 플래그가 `false`이면 내부 전용 위험 도구의 코드 블록 자체가 컴파일된 JS 바이너리에서 문자 그대로 삭제됩니다. 따라서 공격자가 런타임 환경변수를 조작하거나 프로토타입 오염을 시도하더라도, 실행할 코드 자체가 바이너리에 존재하지 않으므로 원천 방어가 가능합니다.

### 4.2 Layer 2: 서버 사이드 실시간 킬 스위치 (`tengu_`)

보안 사고나 이상 동작이 감지되었을 때, 클라이언트 업데이트를 기다리지 않고 즉시 기능을 차단할 수 있도록 GrowthBook 기반의 피처 플래그 시스템이 상시 가동됩니다.

- `tengu_amber_quartz_disabled`: 특정 하위 도구의 긴급 비활성화
- `tengu_bypass_permissions_disabled`: 권한 우회 옵션 전역 무효화
- `tengu_auto_mode_config.enabled`: 자율 실행 오토 모드의 서킷 브레이커 작동
- `tengu_sessions_elevated_auth_enforcement`: 민감 디바이스 세션 토큰 재인증 강제

### 4.3 Layer 3: 거부 우선(Deny-First) 8단계 권한 평가

권한 판정은 8개 설정 소스에 걸쳐 평가됩니다:
`userSettings` > `projectSettings` > `localSettings` > `flagSettings` > `policySettings` > `cliArg` > `command` > `session`

- **거부 우선 원칙**: 어떤 하위 계층에서 `allow`를 주었더라도 상위 계층의 `deny`가 무조건 우선합니다.
- **미인식 작업의 인간 에스컬레이션**: 정의되지 않은 모호한 셸 명령어는 조용히 실행되는 법이 없으며, 반드시 터미널 사용자에게 명시적 승인(`ask`)을 요청하도록 하네스 차원에서 강제됩니다.

---

## 5. 엔터프라이즈 에이전트 구축 시사점 및 트레이드오프

Claude Code의 소스맵 해독이 우리에게 주는 엔지니어링 시사점은 명확합니다.

### 5.1 에이전트 시스템 엔지니어링 4대 원칙
1. **상태 그래프 프레임워크에 매몰되지 말라**: 복잡한 그래프를 그리는 대신, 단일 무한 루프(`while(true)`) 주위에 견고한 입출력 가드와 복구 인프라를 구축하라.
2. **벡터 RAG를 만병통치약으로 쓰지 말라**: 에이전트의 장기 기억은 가벼운 인덱스 포인터(`MEMORY.md`)로 유지하고, 실행 직전 파일시스템을 직접 읽어 사실을 확인(Grounding)하게 하라.
3. **컨텍스트 압축은 선택이 아닌 필수다**: 거대한 도구 출력은 즉시 버리고 최종 결과만 남기는 반응형 압축(`autoCompact`) 없이는 장기 실행 에이전트가 반드시 붕괴한다.
4. **보안은 빌드 타임부터 격리하라**: 런타임 if문 대신 번들러의 데드코드 제거를 통해 외부 배포판에서 위험 도구의 존재 자체를 지워라.

이 원칙들은 코드-퍼스트 에이전트 설계론[^2], 무인 자가 개선 루프의 검증 게이트 설계[^3], 그리고 역공학용 결정론적 파이프라인[^4]에 이르기까지 — 모델의 능력과 무관하게 호스트 코드가 제어 흐름과 무결성 검증을 쥐어야 한다는 동일한 엔지니어링 명제로 수렴합니다.

### 5.2 솔직한 트레이드오프 (Honest Tradeoffs)
- **모놀리식 하네스의 유지보수 복잡도**: 785KB에 달하는 `query.ts` 코어 루프는 도구 스트리밍, 에러 복구, 권한 검사가 한곳에 얽혀 있어 회귀 테스트(Regression Test) 스위트 없이는 수정이 극도로 어렵습니다.
- **토큰 재소모 비용**: 컨텍스트 압축(`autoCompact`) 과정 자체에서 요약 모델 호출이 발생하므로, 세션당 추가적인 보조 토큰 비용이 발생합니다.

---

## References

[^1]: Research Analysis on Production Coding Agent Harnesses: *Deconstructing Terminal-Native Autonomous Agents: Architecture, Context Management, and Security Models* (2026). [arXiv:2604.14228](https://arxiv.org/abs/2604.14228)
[^2]: TypeSafe AI Official Blog: *Stop Paying for Tokens When You Need Decisions: Kahneman's System 1 for Code-First Agents* (2026). [https://typesafe.ai/blog](https://typesafe.ai/blog)
[^3]: ingu627.github.io: *자가 개선 에이전트 루프 설계: 5단계 아키텍처와 리워드 해킹 방어* (2026). [/llm/self-improving-agent-loop/](/llm/self-improving-agent-loop/)
[^4]: ingu627.github.io: *바이너리에서 런타임까지: REA와 TypeSafe Jev를 활용한 결정론적 역공학 파이프라인* (2026). [/agent/rea-reverse-engineering-with-typesafe-jev/](/agent/rea-reverse-engineering-with-typesafe-jev/)
