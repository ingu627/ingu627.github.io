---
layout: single
title: "코딩테스트 스택/큐(Stack/Queue) 대비: list·deque 패턴"
excerpt: "파이썬 리스트·deque 기반 스택/큐 구현부터 LIFO·FIFO 원리·시간복잡도·빈출 유형(괄호·DFS·BFS·우선순위큐)까지 실전 예제 중심 정리"
tags: [python, 파이썬, stack, queue, 스택, 큐, 코딩테스트, 알고리즘, deque, list, LIFO, FIFO, DFS, BFS, 우선순위큐]
toc: true
toc_sticky: true
sidebar_main: false
author_profile: false

mathjax: true
use_math: true

author_profile: false
last_modified_at: 2025-10-05
---

스택(Stack)과 큐(Queue)는 코딩테스트에서 가장 기본이 되는 선형 자료구조다. LIFO/FIFO 원리를 이해하고 deque를 활용하면 대부분의 문제를 효율적으로 해결할 수 있다.

**핵심**: 스택은 `append()` + `pop()`, 큐는 `deque` + `popleft()` 만 기억하면 된다!
{: .notice--info}

## 스택(Stack)이란?
 
### 개념

**스택(Stack)**: 후입선출(LIFO, Last In First Out) 원리를 따르는 선형 자료구조

**핵심 비유**: 
- 책을 쌓아놓은 것과 같다 → 맨 위에 놓은 책부터 꺼낸다
- 접시를 쌓아놓은 것 → 마지막에 올린 접시부터 내린다
- 프링글스 통 → 마지막에 넣은 과자부터 먹는다

**LIFO(후입선출)**: 가장 나중에 들어간 데이터가 가장 먼저 나온다

```python
# 스택 동작 시각화
stack = []
stack.append(1)    # [1]
stack.append(2)    # [1, 2]
stack.append(3)    # [1, 2, 3]
print(stack.pop()) # 3 꺼냄 → [1, 2]
print(stack.pop()) # 2 꺼냄 → [1]
# 3 → 2 순서로 나온다 (역순!)
```

**주요 연산**:
- `push`: 데이터를 스택 맨 위에 추가
- `pop`: 스택 맨 위의 데이터를 제거하고 반환
- `top/peek`: 스택 맨 위의 데이터를 조회 (제거 안 함)
- `empty`: 스택이 비었는지 확인

### 스택의 활용

**왜 스택을 사용할까?**

1. **역순 처리가 필요할 때**
   - 문자열 뒤집기: "hello" → "olleh"
   - 경로 역추적: 미로 탈출, 백트래킹

2. **괄호/태그 검증**
   - 여는 괄호 `(` → 닫는 괄호 `)` 짝 맞추기
   - HTML 태그 `<div>` → `</div>` 검증

3. **함수 호출 관리**
   - 재귀 함수: 가장 깊이 들어간 함수부터 종료
   - 콜 스택: 함수 A → B → C 호출 시 C → B → A 순 종료

4. **DFS (깊이 우선 탐색)**
   - 그래프에서 한 경로를 끝까지 탐색
   - 백트래킹: 막히면 이전 위치로 돌아감

```python
# 실생활 예: 브라우저 "뒤로 가기"
history = []
history.append("구글")      # [구글]
history.append("유튜브")     # [구글, 유튜브]
history.append("네이버")     # [구글, 유튜브, 네이버]
print(history.pop())       # 네이버 (뒤로 가기)
print(history.pop())       # 유튜브 (뒤로 가기)
```

**실전 활용 예**:
- **함수 호출 스택**: 재귀 함수, 콜 스택
- **괄호 검증**: 올바른 괄호 문자열 판별
- **역순 출력**: 문자열 뒤집기, 경로 역추적
- **DFS**: 깊이 우선 탐색 구현
- **후위 표기식**: 계산기 구현
- **히스토리**: 되돌리기(Undo) 기능

### 파이썬 스택 구현

```python
# 1. 리스트로 스택 구현 (가장 간단)
stack = []
stack.append(1)      # push
stack.append(2)
stack.append(3)
print(stack.pop())   # 3 (pop)
print(stack[-1])     # 2 (top/peek)
print(len(stack))    # 2 (size)
print(not stack)     # False (empty check)

# 2. deque로 스택 구현 (일관성)
from collections import deque
stack = deque()
stack.append(1)      # push
stack.append(2)
print(stack.pop())   # 2 (pop)
print(stack[-1])     # 1 (top)
```

**중요**: 리스트의 `append()`와 `pop()`은 모두 O(1)이므로 스택 구현에 적합하다.

<br>

## 큐(Queue)란?

### 개념

**큐(Queue)**: 선입선출(FIFO, First In First Out) 원리를 따르는 선형 자료구조

**핵심 비유**:
- 놀이공원 줄서기 → 먼저 온 사람이 먼저 탄다
- 은행 번호표 → 1번부터 순서대로 처리
- 프린터 대기열 → 먼저 보낸 문서부터 인쇄

**FIFO(선입선출)**: 가장 먼저 들어간 데이터가 가장 먼저 나온다

```python
# 큐 동작 시각화
from collections import deque
queue = deque()
queue.append(1)        # [1]
queue.append(2)        # [1, 2]
queue.append(3)        # [1, 2, 3]
print(queue.popleft()) # 1 꺼냄 → [2, 3]
print(queue.popleft()) # 2 꺼냄 → [3]
# 1 → 2 순서로 나온다 (입력 순서 그대로!)
```

**주요 연산**:
- `enqueue`: 큐의 맨 뒤에 데이터 추가
- `dequeue`: 큐의 맨 앞 데이터를 제거하고 반환
- `front`: 큐 맨 앞의 데이터 조회
- `empty`: 큐가 비었는지 확인

### 큐의 활용

**왜 큐를 사용할까?**

1. **순서대로 처리할 때**
   - 먼저 온 것부터 처리
   - 공정한 순서 보장

2. **BFS (너비 우선 탐색)**
   - 가까운 노드부터 탐색
   - 최단 거리 찾기

3. **작업 대기열**
   - CPU 프로세스 스케줄링
   - 프린터 작업 순서

4. **버퍼**
   - 데이터 스트림 처리
   - 메시지 큐

```python
# 실생활 예: 프린터 대기열
print_queue = deque()
print_queue.append("문서1")  # [문서1]
print_queue.append("문서2")  # [문서1, 문서2]
print_queue.append("문서3")  # [문서1, 문서2, 문서3]

# 순서대로 인쇄
print(print_queue.popleft()) # 문서1 (먼저 인쇄)
print(print_queue.popleft()) # 문서2 (다음 인쇄)
```

**실전 활용 예**:
- **BFS**: 너비 우선 탐색 구현
- **프로세스 스케줄링**: CPU 작업 대기열
- **캐시 구현**: LRU 캐시
- **메시지 큐**: 비동기 처리
- **프린터 대기열**: 순서대로 처리
- **최단 경로**: 가중치 없는 그래프

### 파이썬 큐 구현

**중요**: 큐는 반드시 `deque`를 사용해야 한다!

**왜 list로 큐를 만들면 안 될까?**

```python
# ❌ 나쁜 예: list의 pop(0)은 O(n)!
queue = [1, 2, 3, 4, 5]
queue.pop(0)  # 1을 제거하면...
# [2, 3, 4, 5]로 만들려면
# 모든 원소를 앞으로 한 칸씩 이동! (O(n))
# 2를 [0]으로, 3을 [1]로, 4를 [2]로... 😱

# 10,000개 데이터에서 pop(0) 10,000번 = O(n²) = 💀
```

```python
# ✅ 좋은 예: deque의 popleft()는 O(1)!
from collections import deque
queue = deque([1, 2, 3, 4, 5])
queue.popleft()  # 1을 제거
# 내부 포인터만 이동! (O(1))
# 다른 원소는 움직이지 않음! ⚡
```

**실전 코드**

```python
# 1. deque로 큐 구현 (권장 ⭐)
from collections import deque

queue = deque()
queue.append(1)        # enqueue (오른쪽 추가)
queue.append(2)
queue.append(3)
print(queue.popleft()) # 1 (dequeue, 왼쪽 제거)
print(queue[0])        # 2 (front)
print(len(queue))      # 2 (size)
print(not queue)       # False (empty)

# 2. 리스트로 큐 구현 (비효율적 - 절대 사용 금지! ❌)
queue = []
queue.append(1)
queue.append(2)
val = queue.pop(0)     # O(n) - 엄청 느림! 💀
```

**성능 비교 (실제 측정)**

```python
from collections import deque
import time

n = 10000

# list의 pop(0) - O(n) × n = O(n²)
lst = list(range(n))
start = time.time()
while lst:
    lst.pop(0)  # 매번 O(n)
t1 = time.time() - start

# deque의 popleft() - O(1) × n = O(n)
dq = deque(range(n))
start = time.time()
while dq:
    dq.popleft()  # 매번 O(1)
t2 = time.time() - start

print(f"list.pop(0): {t1:.4f}초")      # 약 0.5초
print(f"deque.popleft(): {t2:.4f}초")  # 약 0.001초
print(f"deque가 {t1/t2:.0f}배 빠름!")  # 약 500배!
```

**핵심**: 리스트의 `pop(0)`은 O(n)이므로 큐 구현에 **절대 사용하면 안 된다**. 반드시 `deque`를 사용하라!

<br>

## deque (덱) 가이드

`deque`(double-ended queue)는 양쪽 끝에서 O(1) 삽입/삭제가 가능한 자료구조입니다.

### deque 주요 메서드

```python
from collections import deque

dq = deque([1, 2, 3])

# 추가 연산
dq.append(4)           # 오른쪽 추가: [1,2,3,4]
dq.appendleft(0)       # 왼쪽 추가: [0,1,2,3,4]
dq.extend([5, 6])      # 오른쪽 여러 개: [0,1,2,3,4,5,6]
dq.extendleft([-2, -1]) # 왼쪽 여러 개 (역순): [-1,-2,0,1,2,3,4,5,6]

# 제거 연산
dq.pop()               # 오른쪽 제거 후 반환
dq.popleft()           # 왼쪽 제거 후 반환

# 조회 연산
print(dq[0])           # 맨 앞
print(dq[-1])          # 맨 뒤
print(len(dq))         # 크기

# 회전 연산
dq = deque([1,2,3,4,5])
dq.rotate(2)           # 오른쪽으로 2칸 회전: [4,5,1,2,3]
dq.rotate(-1)          # 왼쪽으로 1칸: [5,1,2,3,4]

# 기타
dq.clear()             # 전체 삭제
dq.count(1)            # 값 1의 개수
dq.remove(2)           # 첫 번째 2 제거 (O(n))
```

### deque vs list 성능 비교

| 연산 | list | deque | 비고 |
|------|------|-------|------|
| 맨 뒤 추가 | O(1) | O(1) | `append()` |
| 맨 뒤 제거 | O(1) | O(1) | `pop()` |
| 맨 앞 추가 | O(n) | O(1) | `insert(0)` vs `appendleft()` |
| 맨 앞 제거 | O(n) | O(1) | `pop(0)` vs `popleft()` |
| 인덱스 접근 | O(1) | O(n) | `list[i]` vs `dq[i]` |
| 중간 삽입/삭제 | O(n) | O(n) | 둘 다 느림 |

**선택 기준**:
- 스택만 필요 → **list** (간단)
- 큐 필요 → **deque** (필수)
- 양쪽 끝 작업 빈번 → **deque**
- 인덱스 접근 빈번 → **list**

<br>

## 시간 복잡도

### 스택 (list 기반)

| 연산 | 시간 복잡도 | 설명 |
|------|------------|------|
| push | O(1) | `append()` |
| pop | O(1) | `pop()` |
| top | O(1) | `[-1]` |
| empty | O(1) | `not stack` |

### 큐 (deque 기반)

| 연산 | 시간 복잡도 | 설명 |
|------|------------|------|
| enqueue | O(1) | `append()` |
| dequeue | O(1) | `popleft()` |
| front | O(1) | `[0]` |
| empty | O(1) | `not queue` |

```python
# 성능 비교 예제
from collections import deque
import time

n = 100000

# list의 pop(0) - O(n)
lst = list(range(n))
start = time.time()
while lst:
    lst.pop(0)
t1 = time.time() - start

# deque의 popleft() - O(1)
dq = deque(range(n))
start = time.time()
while dq:
    dq.popleft()
t2 = time.time() - start

print(f"list.pop(0): {t1:.4f}초")
print(f"deque.popleft(): {t2:.4f}초")
print(f"deque가 {t1/t2:.1f}배 빠름")
```

<br>

## 코딩테스트 빈출 패턴

### 1. 괄호 검증 (스택)

**핵심 아이디어**: 여는 괄호를 스택에 저장하고, 닫는 괄호가 나오면 짝이 맞는지 확인한다

**왜 스택을 사용할까?**

```python
# 예시: "{[()]}" 검증
# '{'를 만남 → 스택에 push: ['{']
# '['를 만남 → 스택에 push: ['{', '[']
# '('를 만남 → 스택에 push: ['{', '[', '(']
# ')'를 만남 → '('와 짝? OK! pop: ['{', '[']
# ']'를 만남 → '['와 짝? OK! pop: ['{']
# '}'를 만남 → '{'와 짝? OK! pop: []
# 스택이 비었으면 올바른 괄호! ✅
```

**실전 코드**

```python
def is_valid_parentheses(s):
    """올바른 괄호 문자열 판별"""
    stack = []
    pairs = {'(': ')', '[': ']', '{': '}'}
    
    for char in s:
        if char in pairs:  # 여는 괄호
            stack.append(char)
        else:  # 닫는 괄호
            # 스택이 비었거나 짝이 안 맞으면 False
            if not stack or pairs[stack.pop()] != char:
                return False
    
    return not stack  # 스택이 비어야 올바름

# 테스트
print(is_valid_parentheses("()[]{}"))     # True
print(is_valid_parentheses("([)]"))       # False (짝이 엇갈림)
print(is_valid_parentheses("{[()]}"))     # True
```

**자주 하는 실수**

```python
# ❌ 나쁜 예: 개수만 세기 (엇갈린 경우 못 찾음)
def wrong(s):
    count = 0
    for char in s:
        if char == '(':
            count += 1
        else:
            count -= 1
    return count == 0

print(wrong(")("))  # True로 나오지만 실제로는 False! 🚨
```

### 2. 스택으로 DFS 구현

**문제 유형**: 그래프 탐색, 경로 찾기, 연결 요소

```python
def dfs_stack(graph, start):
    """스택을 이용한 DFS"""
    visited = set()
    stack = [start]
    result = []
    
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            result.append(node)
            # 역순으로 추가 (작은 번호부터 방문하려면)
            for neighbor in sorted(graph[node], reverse=True):
                if neighbor not in visited:
                    stack.append(neighbor)
    
    return result

# 테스트
graph = {
    1: [2, 3],
    2: [1, 4, 5],
    3: [1, 6],
    4: [2],
    5: [2],
    6: [3]
}
print(dfs_stack(graph, 1))  # [1, 2, 4, 5, 3, 6]
```

### 3. 큐로 BFS 구현

**핵심 아이디어**: 가까운 노드부터 차례대로 방문한다 (레벨 순회)

**왜 큐를 사용할까?**

```python
# DFS (스택): 깊이 우선 - 한 경로를 끝까지
#     1
#    / \
#   2   3
#  / \   \
# 4   5   6
# DFS 순서: 1 → 2 → 4 → 5 → 3 → 6 (깊게 들어감)

# BFS (큐): 너비 우선 - 레벨별로
# BFS 순서: 1 → 2, 3 → 4, 5, 6 (같은 레벨 먼저)
# Level 0: 1
# Level 1: 2, 3
# Level 2: 4, 5, 6
```

**실전 코드**

```python
from collections import deque

def bfs(graph, start):
    """큐를 이용한 BFS"""
    visited = set([start])
    queue = deque([start])
    result = []
    
    while queue:
        node = queue.popleft()  # 큐에서 꺼냄 (FIFO)
        result.append(node)
        
        # 인접 노드들을 큐에 추가
        for neighbor in sorted(graph[node]):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result

# 최단 거리 계산
def shortest_path(graph, start, end):
    """BFS로 최단 거리 계산 - 가중치 없는 그래프"""
    if start == end:
        return 0
    
    visited = {start}
    queue = deque([(start, 0)])  # (노드, 거리)
    
    while queue:
        node, dist = queue.popleft()
        
        for neighbor in graph[node]:
            if neighbor == end:
                return dist + 1  # 최단 거리 발견!
            
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    
    return -1  # 경로 없음

# 테스트
graph = {
    1: [2, 3],
    2: [1, 4, 5],
    3: [1, 6],
    4: [2],
    5: [2],
    6: [3]
}
print(bfs(graph, 1))                 # [1, 2, 3, 4, 5, 6]
print(shortest_path(graph, 1, 6))    # 2 (1→3→6)
```

**BFS가 최단 거리를 보장하는 이유**

```python
# 가까운 것부터 탐색하므로
# 처음 도착한 경로 = 최단 경로!
#
#     1
#    / \
#   2   3
#        \
#         6
#
# 1→6 경로:
# - 1→3→6 (거리 2) ← BFS가 먼저 찾음!
# - 1→2→...→6 (거리 3+) ← 이건 나중에 찾음
```

### 4. 단조 스택 (Monotonic Stack)

**핵심 아이디어**: 스택을 증가/감소 순서로 유지하면서, 조건을 만족하는 원소를 빠르게 찾는다

**왜 단조 스택을 사용할까?**

```python
# 문제: 각 원소의 "다음 큰 수" 찾기
# 배열: [2, 1, 2, 4, 3]

# ❌ 나쁜 예: 이중 루프 O(n²)
def slow(arr):
    result = []
    for i in range(len(arr)):
        found = -1
        for j in range(i+1, len(arr)):  # 매번 뒤를 다 확인
            if arr[j] > arr[i]:
                found = arr[j]
                break
        result.append(found)
    return result

# ✅ 좋은 예: 단조 스택 O(n)
def fast(arr):
    result = [-1] * len(arr)
    stack = []  # 인덱스 저장 (값은 감소 순서 유지)
    
    for i in range(len(arr)):
        # 현재 값보다 작은 것들의 답을 찾음!
        while stack and arr[stack[-1]] < arr[i]:
            idx = stack.pop()
            result[idx] = arr[i]
        stack.append(i)
    return result
```

**실전 코드**

```python
def next_greater_element(arr):
    """각 원소의 다음 큰 수 찾기"""
    n = len(arr)
    result = [-1] * n
    stack = []  # 인덱스 저장
    
    for i in range(n):
        # 현재 수보다 작은 것들의 답은 현재 수
        while stack and arr[stack[-1]] < arr[i]:
            idx = stack.pop()
            result[idx] = arr[i]
        stack.append(i)
    
    return result

def daily_temperatures(temps):
    """며칠 후에 더 따뜻해지는지 (일수 반환)"""
    n = len(temps)
    result = [0] * n
    stack = []
    
    for i in range(n):
        # 현재보다 낮은 온도들의 답 찾기
        while stack and temps[stack[-1]] < temps[i]:
            idx = stack.pop()
            result[idx] = i - idx  # 거리(일수) 계산
        stack.append(i)
    
    return result

# 테스트
print(next_greater_element([2,1,2,4,3]))     # [4,2,4,-1,-1]
print(daily_temperatures([73,74,75,71,69]))  # [1,1,0,0,0]
```

**동작 과정 (next_greater_element)**

```python
# 배열: [2, 1, 2, 4, 3]
# i=0, val=2: stack=[] → push(0) → stack=[0]
# i=1, val=1: 1<2? No → push(1) → stack=[0,1]
# i=2, val=2: 
#   - 1<2? Yes! → pop(1), result[1]=2
#   - 2<2? No → push(2) → stack=[0,2]
# i=3, val=4:
#   - 2<4? Yes! → pop(2), result[2]=4
#   - 2<4? Yes! → pop(0), result[0]=4
#   - push(3) → stack=[3]
# i=4, val=3: 4>3 → push(4) → stack=[3,4]
# 결과: [4, 2, 4, -1, -1]
```

### 5. 슬라이딩 윈도우 최대/최소 (Deque)

**핵심 아이디어**: deque를 단조 감소/증가 순서로 유지하면서, 윈도우 내 최대/최소를 O(1)에 찾는다

**왜 deque를 사용할까?**

```python
# 문제: 크기 3 윈도우의 최대값 찾기
# 배열: [1, 3, -1, -3, 5, 3, 6, 7]

# ❌ 나쁜 예: 매번 max() O(nk)
def slow(nums, k):
    result = []
    for i in range(len(nums) - k + 1):
        window = nums[i:i+k]
        result.append(max(window))  # 매번 O(k)
    return result

# ✅ 좋은 예: deque 단조 감소 O(n)
def fast(nums, k):
    dq = deque()  # 인덱스 저장 (값은 감소 순서)
    result = []
    
    for i in range(len(nums)):
        # 1. 윈도우 벗어난 것 제거
        if dq and dq[0] <= i - k:
            dq.popleft()
        
        # 2. 현재보다 작은 것들 제거 (쓸모없음)
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        
        dq.append(i)
        
        # 3. 윈도우 완성되면 최대값 추가
        if i >= k - 1:
            result.append(nums[dq[0]])  # 맨 앞이 최대!
    
    return result
```

**실전 코드**

```python
from collections import deque

def max_sliding_window(nums, k):
    """크기 k 슬라이딩 윈도우의 최대값들"""
    dq = deque()  # 인덱스 저장 (감소 순서 유지)
    result = []
    
    for i in range(len(nums)):
        # 윈도우 벗어난 인덱스 제거
        if dq and dq[0] <= i - k:
            dq.popleft()
        
        # 현재 값보다 작은 것들 제거 (단조 감소)
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        
        dq.append(i)
        
        # 윈도우가 완성되면 최대값 추가
        if i >= k - 1:
            result.append(nums[dq[0]])  # deque 맨 앞 = 최대값
    
    return result

# 테스트
print(max_sliding_window([1,3,-1,-3,5,3,6,7], 3))
# [3,3,5,5,6,7]
```

**동작 과정**

```python
# nums=[1,3,-1,-3,5], k=3
# i=0, val=1: dq=[0]
# i=1, val=3: 1<3 제거 → dq=[1]
# i=2, val=-1: dq=[1,2] → 윈도우 완성! result=[3]
# i=3, val=-3: dq=[1,2,3] → result=[3,3]
# i=4, val=5: 
#   - 인덱스 1 제거 (윈도우 벗어남)
#   - -1,3<5 모두 제거
#   - dq=[4] → result=[3,3,5]
```

### 6. 회전 큐 활용

**문제 유형**: 조세푸스, 회전 배열

```python
from collections import deque

def josephus(n, k):
    """조세푸스 문제: n명 중 k번째마다 제거"""
    queue = deque(range(1, n + 1))
    result = []
    
    while queue:
        # k-1번 회전
        queue.rotate(-(k - 1))
        result.append(queue.popleft())
    
    return result

# 테스트
print(josephus(7, 3))  # [3, 6, 2, 7, 5, 1, 4]
```

<br>

## 우선순위 큐 (heapq)

일반 큐와 달리 **우선순위**가 높은 원소가 먼저 나오는 자료구조입니다.

### heapq 기본 사용법

```python
import heapq

# 최소 힙 (기본)
heap = []
heapq.heappush(heap, 3)
heapq.heappush(heap, 1)
heapq.heappush(heap, 5)
print(heapq.heappop(heap))  # 1 (최소값)

# 리스트를 힙으로 변환
nums = [3, 1, 5, 2, 4]
heapq.heapify(nums)
print(nums[0])  # 1 (최소값)

# 최대 힙 (음수 활용)
max_heap = []
for num in [3, 1, 5]:
    heapq.heappush(max_heap, -num)
print(-heapq.heappop(max_heap))  # 5 (최대값)

# k번째 큰/작은 원소
print(heapq.nlargest(2, [1,3,5,2,4]))   # [5, 4]
print(heapq.nsmallest(2, [1,3,5,2,4]))  # [1, 2]
```

### 우선순위 큐 활용 예제

```python
import heapq

def merge_k_sorted_lists(lists):
    """k개의 정렬된 리스트 병합"""
    heap = []
    result = []
    
    # 각 리스트의 첫 원소 추가
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))
    
    while heap:
        val, list_idx, elem_idx = heapq.heappop(heap)
        result.append(val)
        
        # 다음 원소 추가
        if elem_idx + 1 < len(lists[list_idx]):
            next_val = lists[list_idx][elem_idx + 1]
            heapq.heappush(heap, (next_val, list_idx, elem_idx + 1))
    
    return result

# 테스트
lists = [[1,4,5], [1,3,4], [2,6]]
print(merge_k_sorted_lists(lists))  # [1,1,2,3,4,4,5,6]
```

<br>

## 실전 문제 예제

### 예제 1: 올바른 괄호 (프로그래머스)

```python
def solution(s):
    stack = []
    for char in s:
        if char == '(':
            stack.append(char)
        else:  # ')'
            if not stack:
                return False
            stack.pop()
    return not stack

# 또는 카운터 활용
def solution2(s):
    count = 0
    for char in s:
        if char == '(':
            count += 1
        else:
            count -= 1
            if count < 0:
                return False
    return count == 0
```

### 예제 2: 기능개발 (프로그래머스)

```python
def solution(progresses, speeds):
    from collections import deque
    import math
    
    # 각 작업의 소요 일수 계산
    days = deque([math.ceil((100 - p) / s) 
                  for p, s in zip(progresses, speeds)])
    
    result = []
    while days:
        count = 1
        current = days.popleft()
        
        # 현재 작업보다 빨리 끝나는 작업들 카운트
        while days and days[0] <= current:
            days.popleft()
            count += 1
        
        result.append(count)
    
    return result
```

### 예제 3: 프린터 (프로그래머스)

```python
def solution(priorities, location):
    from collections import deque
    
    queue = deque([(i, p) for i, p in enumerate(priorities)])
    order = 0
    
    while queue:
        idx, priority = queue.popleft()
        
        # 더 높은 우선순위가 있으면 뒤로
        if any(priority < q[1] for q in queue):
            queue.append((idx, priority))
        else:
            order += 1
            if idx == location:
                return order
```

### 예제 4: 다리를 지나는 트럭 (프로그래머스)

```python
def solution(bridge_length, weight, truck_weights):
    from collections import deque
    
    bridge = deque([0] * bridge_length)
    trucks = deque(truck_weights)
    time = 0
    bridge_weight = 0
    
    while bridge:
        time += 1
        bridge_weight -= bridge.popleft()
        
        if trucks:
            if bridge_weight + trucks[0] <= weight:
                truck = trucks.popleft()
                bridge.append(truck)
                bridge_weight += truck
            else:
                bridge.append(0)
    
    return time
```

### 예제 5: 주식가격 (프로그래머스)

```python
def solution(prices):
    n = len(prices)
    answer = [0] * n
    stack = []  # (인덱스, 가격)
    
    for i in range(n):
        # 가격이 떨어진 시점
        while stack and stack[-1][1] > prices[i]:
            idx, price = stack.pop()
            answer[idx] = i - idx
        stack.append((i, prices[i]))
    
    # 끝까지 안 떨어진 것들
    while stack:
        idx, _ = stack.pop()
        answer[idx] = n - 1 - idx
    
    return answer
```

<br>

## 선형 자료구조 비교

| 자료구조 | 특징 | 추가 | 제거 | 조회 | 사용 예 |
|---------|------|------|------|------|---------|
| **배열(list)** | 인덱스 접근 | O(1) 끝 | O(1) 끝 | O(1) | 순차 데이터 |
| **스택** | LIFO | O(1) | O(1) | O(1) top | DFS, 괄호, 되돌리기 |
| **큐** | FIFO | O(1) | O(1) | O(1) front | BFS, 스케줄링 |
| **덱** | 양방향 | O(1) | O(1) | O(n) | 슬라이딩 윈도우 |
| **우선순위 큐** | 우선순위 | O(log n) | O(log n) | O(1) min | Dijkstra, 정렬 |

<br>

## 주의사항 & 팁

### 1. 리스트 큐 사용 절대 금지!

**왜?** `pop(0)`이 O(n)이라서 느리다!

```python
# ❌ 절대 하지 말 것!
queue = []
queue.append(1)
val = queue.pop(0)  # O(n) - 모든 원소가 앞으로 이동!

# ✅ 반드시 이렇게!
from collections import deque
queue = deque()
queue.append(1)
val = queue.popleft()  # O(1) - 포인터만 이동!
```

**실전에서 실수하는 경우**

```python
# ❌ BFS를 list로 구현 (시간 초과!)
def bfs_slow(graph, start):
    visited = {start}
    queue = [start]  # list 사용
    while queue:
        node = queue.pop(0)  # 매번 O(n)!
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

# ✅ deque 사용 (정상 동작)
from collections import deque
def bfs_fast(graph, start):
    visited = {start}
    queue = deque([start])  # deque 사용
    while queue:
        node = queue.popleft()  # O(1)!
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

### 2. 빈 컨테이너 체크

```python
stack = []

# ❌ 나쁜 예: 길이 체크 (불필요)
if len(stack) == 0:
    pass

# ✅ 좋은 예: Pythonic
if not stack:
    pass

# pop 전 반드시 체크!
if stack:
    val = stack.pop()
else:
    # 빈 스택 처리
    pass
```

**실수하기 쉬운 경우**

```python
# ❌ 틀린 코드: pop() 전 체크 안 함
def wrong():
    stack = []
    return stack.pop()  # IndexError! 💀

# ✅ 올바른 코드
def correct():
    stack = []
    return stack.pop() if stack else None
```

### 3. 스택 top 조회

```python
stack = [1, 2, 3]

# 제거하지 않고 조회
top = stack[-1]  # 3 (O(1))

# 제거하면서 조회
top = stack.pop()  # 3 (O(1))

# ❌ 실수: 인덱스 범위 초과
empty = []
# top = empty[-1]  # IndexError! 💀

# ✅ 안전한 방법
top = empty[-1] if empty else None
```

### 4. deque 인덱싱 주의

```python
from collections import deque
dq = deque([1, 2, 3, 4, 5])

# ❌ 나쁜 예: 중간 인덱싱은 O(n)
for i in range(len(dq)):
    print(dq[i])  # 느림!

# ✅ 좋은 예: 순회는 이렇게
for val in dq:
    print(val)  # 빠름!

# 앞/뒤만 O(1)
print(dq[0])   # 빠름 (맨 앞)
print(dq[-1])  # 빠름 (맨 뒤)

# 중간 접근 빈번하면 list 사용
if "인덱싱이 많이 필요":
    use_list()
else:
    use_deque()
```

### 5. 최대 힙 구현

```python
import heapq

# Python heapq는 최소 힙만 지원!
# 최대 힙 만들려면 음수로 변환

# ❌ 이렇게 하면 최소 힙
heap = []
heapq.heappush(heap, 3)
heapq.heappush(heap, 1)
heapq.heappush(heap, 5)
print(heapq.heappop(heap))  # 1 (최소값)

# ✅ 최대 힙: 음수 활용
max_heap = []
for num in [3, 1, 5]:
    heapq.heappush(max_heap, -num)  # 음수로 저장

max_val = -heapq.heappop(max_heap)  # 5 (최대값)

# 또는 튜플 활용 (우선순위, 값)
heap = []
heapq.heappush(heap, (-priority, value))
_, val = heapq.heappop(heap)
```

### 6. 큐 크기 제한

```python
from collections import deque

# maxlen 설정 (자동으로 오래된 것 제거)
queue = deque(maxlen=3)
queue.append(1)  # [1]
queue.append(2)  # [1, 2]
queue.append(3)  # [1, 2, 3]
queue.append(4)  # [2, 3, 4] (1이 자동 제거!)
print(queue)  # deque([2, 3, 4])

# 실전 활용: 최근 N개 유지
recent_logs = deque(maxlen=100)  # 최근 100개만
recent_logs.append("log1")
recent_logs.append("log2")
# ... 100개 넘으면 오래된 것 자동 삭제
```

### 7. 코딩테스트 실전 팁

```python
# 1. import 간결하게
from collections import deque

# 2. 스택은 그냥 list
stack = []

# 3. 큐는 반드시 deque
queue = deque()

# 4. 우선순위 큐
import heapq
heap = []

# 5. 빈 체크 습관화
if stack:
    val = stack.pop()

# 6. DFS/BFS 패턴 외우기
# DFS: stack (재귀 또는 명시적 스택)
# BFS: deque (항상 큐)
```

<br>

## 고급 패턴

### 1. 스택 두 개로 큐 구현

```python
class QueueUsingStacks:
    def __init__(self):
        self.stack_in = []
        self.stack_out = []
    
    def enqueue(self, x):
        self.stack_in.append(x)
    
    def dequeue(self):
        if not self.stack_out:
            while self.stack_in:
                self.stack_out.append(self.stack_in.pop())
        return self.stack_out.pop() if self.stack_out else None
    
    def front(self):
        if not self.stack_out:
            while self.stack_in:
                self.stack_out.append(self.stack_in.pop())
        return self.stack_out[-1] if self.stack_out else None

# 테스트
q = QueueUsingStacks()
q.enqueue(1)
q.enqueue(2)
print(q.dequeue())  # 1
print(q.front())    # 2
```

### 2. 큐 두 개로 스택 구현

```python
from collections import deque

class StackUsingQueues:
    def __init__(self):
        self.q1 = deque()
        self.q2 = deque()
    
    def push(self, x):
        self.q1.append(x)
    
    def pop(self):
        # q1의 마지막 하나만 남기고 q2로 이동
        while len(self.q1) > 1:
            self.q2.append(self.q1.popleft())
        
        val = self.q1.popleft() if self.q1 else None
        
        # q1과 q2 교환
        self.q1, self.q2 = self.q2, self.q1
        return val
    
    def top(self):
        while len(self.q1) > 1:
            self.q2.append(self.q1.popleft())
        
        val = self.q1[0] if self.q1 else None
        self.q2.append(self.q1.popleft())
        
        self.q1, self.q2 = self.q2, self.q1
        return val

# 테스트
s = StackUsingQueues()
s.push(1)
s.push(2)
print(s.pop())   # 2
print(s.top())   # 1
```

### 3. 최소값을 O(1)에 반환하는 스택

```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []
    
    def push(self, x):
        self.stack.append(x)
        if not self.min_stack or x <= self.min_stack[-1]:
            self.min_stack.append(x)
    
    def pop(self):
        if self.stack:
            val = self.stack.pop()
            if val == self.min_stack[-1]:
                self.min_stack.pop()
            return val
    
    def top(self):
        return self.stack[-1] if self.stack else None
    
    def get_min(self):
        return self.min_stack[-1] if self.min_stack else None

# 테스트
ms = MinStack()
ms.push(3)
ms.push(1)
ms.push(2)
print(ms.get_min())  # 1
ms.pop()
print(ms.get_min())  # 1
ms.pop()
print(ms.get_min())  # 3
```

### 4. 원형 큐 구현

```python
class CircularQueue:
    def __init__(self, k):
        self.queue = [None] * k
        self.max_size = k
        self.front = self.rear = -1
        self.size = 0
    
    def enqueue(self, value):
        if self.is_full():
            return False
        
        if self.is_empty():
            self.front = 0
        
        self.rear = (self.rear + 1) % self.max_size
        self.queue[self.rear] = value
        self.size += 1
        return True
    
    def dequeue(self):
        if self.is_empty():
            return False
        
        self.queue[self.front] = None
        self.front = (self.front + 1) % self.max_size
        self.size -= 1
        
        if self.is_empty():
            self.front = self.rear = -1
        
        return True
    
    def is_empty(self):
        return self.size == 0
    
    def is_full(self):
        return self.size == self.max_size
    
    def get_front(self):
        return self.queue[self.front] if not self.is_empty() else -1

# 테스트
cq = CircularQueue(3)
print(cq.enqueue(1))  # True
print(cq.enqueue(2))  # True
print(cq.enqueue(3))  # True
print(cq.enqueue(4))  # False (full)
print(cq.dequeue())   # True
print(cq.enqueue(4))  # True
```

<br>

## 연습 문제 추천

### 기초

- [프로그래머스] 올바른 괄호
- [프로그래머스] 같은 숫자는 싫어
- [LeetCode] 20. Valid Parentheses
- [LeetCode] 232. Implement Queue using Stacks

### 중급

- [프로그래머스] 기능개발
- [프로그래머스] 프린터
- [프로그래머스] 다리를 지나는 트럭
- [LeetCode] 739. Daily Temperatures
- [LeetCode] 155. Min Stack

### 고급

- [프로그래머스] 주식가격
- [LeetCode] 84. Largest Rectangle in Histogram
- [LeetCode] 239. Sliding Window Maximum
- [LeetCode] 895. Maximum Frequency Stack
- [LeetCode] 946. Validate Stack Sequences

<br>

## 마무리 체크리스트

- [ ] 스택/큐의 LIFO/FIFO 원리 이해
- [ ] deque 사용법 숙지
- [ ] 리스트 큐 사용 금지 (pop(0) 지양)
- [ ] 괄호 검증 패턴 구현
- [ ] DFS(스택) vs BFS(큐) 구분
- [ ] 단조 스택 활용 (다음 큰 수)
- [ ] 슬라이딩 윈도우 최대/최소 구현
- [ ] heapq로 우선순위 큐 활용
- [ ] 빈 컨테이너 체크 습관화
- [ ] 최대 힙 구현 (음수 활용)

<br>

## References

- [Python 공식 문서 - collections.deque](https://docs.python.org/ko/3/library/collections.html#collections.deque)
- [Python 공식 문서 - heapq](https://docs.python.org/ko/3/library/heapq.html)
- [프로그래머스 - 스택/큐](https://school.programmers.co.kr/learn/courses/30/parts/12081)
- [LeetCode - Stack](https://leetcode.com/tag/stack/)
- [LeetCode - Queue](https://leetcode.com/tag/queue/)
- [위키백과 - 스택](https://ko.wikipedia.org/wiki/%EC%8A%A4%ED%83%9D)
- [위키백과 - 큐](https://ko.wikipedia.org/wiki/%ED%81%90_(%EC%9E%90%EB%A3%8C_%EA%B5%AC%EC%A1%B0))
