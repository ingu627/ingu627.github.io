---
layout: single
title: "파이썬 코딩테스트 실전 스타일 가이드"
excerpt: "입출력 최적화부터 자료구조 활용, 반복문 단축, 알고리즘 패턴까지 코딩테스트에서 바로 쓸 수 있는 파이썬 코드 스타일과 팁 총정리"
tags: [python, 파이썬, 코딩테스트, 알고리즘, 문법, 코드스타일, 최적화]
toc: true
toc_sticky: true
sidebar_main: false

mathjax: true
use_math: true

last_modified_at: 2025-10-12
---

파이썬은 코딩테스트에서 가장 인기 있는 언어다. 간결하고 직관적인 문법 덕분에 알고리즘 로직 구현에 집중할 수 있다. 본 문서는 코딩테스트에서 자주 사용하는 파이썬 코드 스타일과 패턴을 정리한다.
{: .notice--success}

## 1. 입출력 최적화

### 빠른 입력 처리

대량의 데이터를 처리할 때는 `input()` 대신 `sys.stdin.readline()`을 사용한다.

```python
import sys
input = sys.stdin.readline

# 단일 정수 입력
n = int(input())

# 여러 값 동시 입력
a, b = map(int, input().split())

# 리스트 입력
arr = list(map(int, input().split()))

# 2차원 배열 입력 (N줄)
matrix = [list(map(int, input().split())) for _ in range(n)]
```

**주의사항**: `sys.stdin.readline()`은 개행문자(`\n`)를 포함하므로, 문자열 입력 시에는 `.strip()`을 붙여야 한다.

```python
s = input().strip()  # 공백 제거
```

### 효율적인 출력 방식

여러 값을 출력할 때는 언패킹 연산자나 `join()`을 사용한다.

```python
result = [1, 2, 3, 4, 5]

# ❌ 비효율적
for x in result:
    print(x)

# ✅ 효율적 - 한 줄에 공백으로 구분
print(*result)  # 1 2 3 4 5

# ✅ 효율적 - 여러 줄로 출력
print('\n'.join(map(str, result)))
```

**성능 비교**: 10만 개의 숫자를 출력할 때, `print(*result)`나 `join()`은 반복문 대비 약 5~10배 빠르다.

## 2. 자료구조 활용

### Collections 모듈

`collections` 모듈은 복잡한 로직을 간단하게 구현할 수 있다.

#### Counter: 빈도수 계산

```python
from collections import Counter

# 리스트 원소 빈도수
arr = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]
count = Counter(arr)

print(count[3])              # 3
print(count.most_common(2))  # [(4, 4), (3, 3)] - 상위 2개

# 문자열 빈도수
text = "mississippi"
char_count = Counter(text)
print(char_count['i'])       # 4
```

#### defaultdict: KeyError 걱정 없는 딕셔너리

```python
from collections import defaultdict

# 그래프 표현
graph = defaultdict(list)
graph[1].append(2)
graph[1].append(3)
# KeyError 발생 안 함 - 자동으로 빈 리스트 생성

# 그룹화
students = [("Alice", 90), ("Bob", 85), ("Charlie", 90)]
by_score = defaultdict(list)
for name, score in students:
    by_score[score].append(name)
print(by_score[90])  # ['Alice', 'Charlie']
```

#### deque: 양방향 큐 연산

```python
from collections import deque

# BFS, 슬라이딩 윈도우에 필수
queue = deque([1, 2, 3])

queue.append(4)       # 오른쪽 추가: [1, 2, 3, 4]
queue.appendleft(0)   # 왼쪽 추가: [0, 1, 2, 3, 4]
queue.pop()           # 오른쪽 제거: [0, 1, 2, 3]
queue.popleft()       # 왼쪽 제거: [1, 2, 3]

# 모두 O(1) 시간 복잡도!
# 리스트의 insert(0, x)나 pop(0)은 O(n)
```

### heapq: 우선순위 큐

최소 힙을 기본으로 제공한다. 최대 힙은 값을 음수로 변환해서 사용한다.

```python
import heapq

# 최소 힙
heap = []
heapq.heappush(heap, 3)
heapq.heappush(heap, 1)
heapq.heappush(heap, 5)

print(heapq.heappop(heap))  # 1 (가장 작은 값)

# 최대 힙 (음수 트릭)
max_heap = []
heapq.heappush(max_heap, -3)
heapq.heappush(max_heap, -1)
heapq.heappush(max_heap, -5)

print(-heapq.heappop(max_heap))  # 5 (가장 큰 값)

# 리스트를 힙으로 변환
nums = [5, 2, 8, 1, 9]
heapq.heapify(nums)  # O(n)
```

### bisect: 이진 탐색

정렬된 배열에서 삽입 위치 탐색이나 범위 검색에 사용한다.

```python
import bisect

arr = [1, 3, 5, 7, 9]

# 삽입 위치 찾기
idx = bisect.bisect_left(arr, 5)   # 2 (5의 시작 위치)
idx = bisect.bisect_right(arr, 5)  # 3 (5의 다음 위치)

# 정렬 유지하며 삽입
bisect.insort(arr, 6)  # [1, 3, 5, 6, 7, 9]

# 범위 검색 (lower_bound ~ upper_bound)
def count_range(arr, left, right):
    l = bisect.bisect_left(arr, left)
    r = bisect.bisect_right(arr, right)
    return r - l

arr = [1, 2, 2, 2, 3, 4, 5]
print(count_range(arr, 2, 3))  # 4 (2가 3개, 3이 1개)
```

## 3. 반복문 단축

### 리스트 컴프리헨션

반복문을 한 줄로 압축하는 문법이다.

```python
# 기본 사용법
squares = [i**2 for i in range(10)]

# 조건부 필터링
even_squares = [i**2 for i in range(10) if i % 2 == 0]

# 2차원 리스트 생성 (매우 중요!)
matrix = [[0] * m for _ in range(n)]
# ❌ matrix = [[0] * m] * n  # 절대 이렇게 하지 말 것!

# 숫자를 자릿수 리스트로 변환
digits = [int(x) for x in str(12345)]  # [1, 2, 3, 4, 5]

# 2중 반복문
pairs = [(i, j) for i in range(3) for j in range(3)]
# [(0,0), (0,1), (0,2), (1,0), (1,1), (1,2), (2,0), (2,1), (2,2)]

# 조건부 값 변환
labels = ["Even" if x % 2 == 0 else "Odd" for x in range(5)]
# ['Even', 'Odd', 'Even', 'Odd', 'Even']
```

### 딕셔너리/집합 컴프리헨션

```python
# 딕셔너리 컴프리헨션
squares_dict = {i: i**2 for i in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# 집합 컴프리헨션
unique_chars = {c for c in "hello world" if c.isalpha()}
# {'h', 'e', 'l', 'o', 'w', 'r', 'd'}

# zip과 조합
keys = ['a', 'b', 'c']
values = [1, 2, 3]
dict_from_lists = {k: v for k, v in zip(keys, values)}
# {'a': 1, 'b': 2, 'c': 3}
```

### enumerate와 zip 활용

```python
# enumerate: 인덱스와 값 동시 접근
arr = ['apple', 'banana', 'cherry']
for i, fruit in enumerate(arr):
    print(f"{i}: {fruit}")

# 1부터 시작하는 인덱스
for i, fruit in enumerate(arr, start=1):
    print(f"{i}. {fruit}")

# zip: 여러 리스트 동시 순회
names = ['Alice', 'Bob', 'Charlie']
scores = [90, 85, 95]
grades = ['A', 'B', 'A']

for name, score, grade in zip(names, scores, grades):
    print(f"{name}: {score}점 ({grade})")

# zip의 길이는 가장 짧은 리스트 기준
from itertools import zip_longest

list1 = [1, 2, 3]
list2 = ['a', 'b']

for x, y in zip_longest(list1, list2, fillvalue='-'):
    print(x, y)
# 1 a
# 2 b
# 3 -
```

### 언패킹과 다중 할당

언패킹은 코딩테스트에서 코드를 간결하게 만드는 핵심 기법이다.

```python
# 기본 언패킹
a, b, c = [1, 2, 3]

# swap (다른 언어는 temp 변수 필요)
a, b = b, a

# *를 사용한 확장 언패킹
first, *middle, last = [1, 2, 3, 4, 5]
print(first)   # 1
print(middle)  # [2, 3, 4]
print(last)    # 5

# 함수 인자로 언패킹
def add(a, b, c):
    return a + b + c

nums = [1, 2, 3]
result = add(*nums)  # add(1, 2, 3)과 동일

# 딕셔너리 언패킹
def greet(name, age):
    print(f"{name}: {age}세")

data = {'name': 'Alice', 'age': 25}
greet(**data)  # greet(name='Alice', age=25)와 동일

# 좌표 처리에 유용
points = [(1, 2), (3, 4), (5, 6)]
for x, y in points:
    print(f"({x}, {y})")
```

## 4. 조건문 간소화

### 삼항 연산자

```python
# 기본 형태
result = 'Even' if num % 2 == 0 else 'Odd'

# 최댓값/최솟값 제한
value = min(x, 100)  # 100 이하로 제한
value = max(x, 0)    # 0 이상으로 제한
value = max(0, min(x, 100))  # 0~100 범위로 제한

# 여러 조건
sign = "positive" if x > 0 else "negative" if x < 0 else "zero"
```

### 단축 평가와 멤버십 테스트

```python
# 빈 컨테이너 체크
if not arr:  # len(arr) == 0 대신
    return []

if arr:      # len(arr) > 0 대신
    process(arr)

# in 연산자로 다중 조건 간소화
if x in [1, 2, 3, 4, 5]:  # x == 1 or x == 2 ... 대신
    do_something()

if x in {1, 2, 3, 4, 5}:  # 집합은 O(1), 리스트는 O(n)
    do_something()

# any/all 활용
if any(x > 0 for x in arr):  # 하나라도 참이면
    print("양수가 있음")

if all(x > 0 for x in arr):  # 모두 참이면
    print("모두 양수")
```

## 5. 내장 함수 활용

### 수학 연산 함수

```python
arr = [1, 2, 3, 4, 5]

# 기본 통계
total = sum(arr)           # 15
maximum = max(arr)         # 5
minimum = min(arr)         # 1
length = len(arr)          # 5

# 몫과 나머지 동시 계산
quotient, remainder = divmod(17, 5)  # (3, 2)

# 모듈러 거듭제곱 (빠르고 안전)
result = pow(2, 10, 1000)  # 2^10 % 1000 = 24
# pow(base, exp, mod)는 내부 최적화로 매우 빠름

# 절댓값
abs_value = abs(-10)  # 10
```

### 정렬과 변환

```python
# 정렬
arr = [3, 1, 4, 1, 5, 9, 2, 6]
sorted_arr = sorted(arr)              # 오름차순
sorted_desc = sorted(arr, reverse=True)  # 내림차순

# key 함수로 정렬 기준 변경
words = ["apple", "pie", "zoo", "hi"]
sorted_words = sorted(words, key=len)  # 길이 순

# 2차원 리스트 정렬
points = [(1, 5), (3, 2), (2, 8)]
sorted_points = sorted(points, key=lambda p: p[1])  # y좌표 기준
# [(3, 2), (1, 5), (2, 8)]

# 역순
reversed_arr = list(reversed(arr))
# 또는 슬라이싱
reversed_arr = arr[::-1]

# map/filter
str_list = list(map(str, [1, 2, 3]))     # ['1', '2', '3']
evens = list(filter(lambda x: x % 2 == 0, arr))  # 짝수만
```

## 6. 문자열 처리 최적화

### 효율적인 문자열 연산

```python
# ❌ 비효율적 - 문자열은 불변이므로 매번 새 객체 생성
result = ""
for s in string_list:
    result += s  # O(n^2) 시간 복잡도

# ✅ 효율적 - O(n)
result = ''.join(string_list)

# 분할과 정리
text = "  hello world  "
words = text.split()       # ['hello', 'world'] - 공백으로 분할
clean = text.strip()       # "hello world" - 양쪽 공백 제거

# 특정 구분자로 분할
csv_line = "apple,banana,cherry"
fruits = csv_line.split(',')

# 문자열 포매팅
name = "Alice"
score = 95

# f-string (Python 3.6+, 가장 빠름)
msg = f"{name}: {score}점"

# format 메서드
msg = "{}: {}점".format(name, score)

# % 연산자 (레거시)
msg = "%s: %d점" % (name, score)
```

### 문자 판별과 변환

```python
s = "Hello123"

# 문자 판별
s.isalpha()   # False (숫자 포함)
s.isdigit()   # False (문자 포함)
s.isalnum()   # True (문자+숫자)

# 대소문자 변환
s.upper()     # "HELLO123"
s.lower()     # "hello123"
s.swapcase()  # "hELLO123"

# 개수 세기
"hello".count('l')  # 2

# 검색
"hello".find('l')   # 2 (첫 번째 위치, 없으면 -1)
"hello".index('l')  # 2 (첫 번째 위치, 없으면 ValueError)
```

## 7. itertools 모듈

`itertools`는 순열, 조합, 곱집합 등 조합론 문제에 필수적이다.

### 순열과 조합

```python
from itertools import permutations, combinations, product, combinations_with_replacement

arr = [1, 2, 3]

# 순열 (nPr) - 순서 O
perms = list(permutations(arr, 2))
# [(1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2)]

# 조합 (nCr) - 순서 X
combs = list(combinations(arr, 2))
# [(1, 2), (1, 3), (2, 3)]

# 중복 조합
combs_rep = list(combinations_with_replacement(arr, 2))
# [(1, 1), (1, 2), (1, 3), (2, 2), (2, 3), (3, 3)]

# 곱집합 (데카르트 곱)
prod = list(product(arr, repeat=2))
# [(1, 1), (1, 2), (1, 3), (2, 1), (2, 2), (2, 3), (3, 1), (3, 2), (3, 3)]

# 서로 다른 리스트의 곱집합
list1 = [1, 2]
list2 = ['a', 'b']
prod2 = list(product(list1, list2))
# [(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]
```

### 유용한 itertools 함수들

```python
from itertools import accumulate, groupby, chain, islice

# accumulate: 누적합
arr = [1, 2, 3, 4, 5]
cumsum = list(accumulate(arr))
# [1, 3, 6, 10, 15]

# 누적곱
from operator import mul
cumprod = list(accumulate(arr, mul))
# [1, 2, 6, 24, 120]

# groupby: 연속된 같은 값 그룹화
data = [1, 1, 2, 2, 2, 3, 1, 1]
groups = [(k, len(list(g))) for k, g in groupby(data)]
# [(1, 2), (2, 3), (3, 1), (1, 2)]

# chain: 여러 이터러블 연결
list1 = [1, 2, 3]
list2 = [4, 5, 6]
chained = list(chain(list1, list2))
# [1, 2, 3, 4, 5, 6]

# islice: 이터러블 슬라이싱
result = list(islice(range(10), 2, 8, 2))  # [2, 4, 6]
```

## 8. 문자와 숫자 변환

### ord와 chr

문자-아스키 코드 변환은 문자열 암호화, 알파벳 연산에 자주 사용된다.

```python
# 문자 → 아스키 코드
print(ord('A'))  # 65
print(ord('a'))  # 97
print(ord('0'))  # 48

# 아스키 코드 → 문자
print(chr(65))   # 'A'
print(chr(97))   # 'a'

# 알파벳 순서 계산
def alphabet_position(char):
    if char.isupper():
        return ord(char) - ord('A') + 1  # A=1, B=2, ...
    else:
        return ord(char) - ord('a') + 1  # a=1, b=2, ...

# 시저 암호 (문자 이동)
def caesar_cipher(text, shift):
    result = []
    for char in text:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            shifted = (ord(char) - base + shift) % 26 + base
            result.append(chr(shifted))
        else:
            result.append(char)
    return ''.join(result)

print(caesar_cipher("ABC", 3))  # "DEF"
```

### 진법 변환

```python
# 10진수 → 2진수, 8진수, 16진수
n = 42
print(bin(n))  # '0b101010'
print(oct(n))  # '0o52'
print(hex(n))  # '0x2a'

# 접두사 제거
print(bin(n)[2:])  # '101010'
print(hex(n)[2:])  # '2a'

# 다른 진법 → 10진수
print(int('101010', 2))   # 42 (2진수)
print(int('52', 8))       # 42 (8진수)
print(int('2a', 16))      # 42 (16진수)

# 포맷 함수 사용
print(f"{n:b}")   # '101010' (2진수)
print(f"{n:o}")   # '52' (8진수)
print(f"{n:x}")   # '2a' (16진수)
print(f"{n:X}")   # '2A' (대문자 16진수)

# 2진수 문자열을 자릿수 리스트로
binary = bin(42)[2:]  # '101010'
bits = [int(b) for b in binary]  # [1, 0, 1, 0, 1, 0]
```

## 9. 슬라이싱 패턴

파이썬의 슬라이싱은 매우 강력하고 간결하다.

```python
arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# 기본 슬라이싱 [start:end:step]
print(arr[2:7])      # [2, 3, 4, 5, 6]
print(arr[:5])       # [0, 1, 2, 3, 4] (처음부터)
print(arr[5:])       # [5, 6, 7, 8, 9] (끝까지)
print(arr[::2])      # [0, 2, 4, 6, 8] (짝수 인덱스)
print(arr[1::2])     # [1, 3, 5, 7, 9] (홀수 인덱스)

# 역순
print(arr[::-1])     # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
print(arr[::-2])     # [9, 7, 5, 3, 1] (역순 + 간격 2)

# 음수 인덱스
print(arr[-3:])      # [7, 8, 9] (뒤에서 3개)
print(arr[:-3])      # [0, 1, 2, 3, 4, 5, 6] (뒤 3개 제외)

# 문자열 슬라이싱
s = "Hello, World!"
print(s[7:12])       # 'World'
print(s[:5])         # 'Hello'
print(s[::-1])       # '!dlroW ,olleH' (역순)

# 회문 판별
def is_palindrome(s):
    return s == s[::-1]

# 리스트 복사
original = [1, 2, 3]
copy = original[:]   # 얕은 복사
```

## 10. 메모이제이션과 재귀

### functools.lru_cache

DP 문제에서 재귀로 메모이제이션을 쉽게 구현할 수 있다.

```python
from functools import lru_cache

# 피보나치 (메모이제이션 없으면 느림)
@lru_cache(maxsize=None)
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(100))  # 빠르게 계산

# 조합 계산
@lru_cache(maxsize=None)
def comb(n, r):
    if r == 0 or r == n:
        return 1
    return comb(n-1, r-1) + comb(n-1, r)

# DP - 최장 증가 부분 수열 (LIS)
@lru_cache(maxsize=None)
def lis(idx, prev):
    if idx == len(arr):
        return 0
    
    # 선택 안 함
    result = lis(idx + 1, prev)
    
    # 선택 (이전보다 크면)
    if prev == -1 or arr[idx] > arr[prev]:
        result = max(result, lis(idx + 1, idx) + 1)
    
    return result
```

### 재귀 한도 설정

파이썬의 기본 재귀 한도는 1000이다. DFS 등에서 한도 초과 시 설정한다.

```python
import sys
sys.setrecursionlimit(10**6)

# 깊은 재귀가 필요한 DFS
def dfs(node, graph, visited):
    visited[node] = True
    for neighbor in graph[node]:
        if not visited[neighbor]:
            dfs(neighbor, graph, visited)
```

## 11. 수학과 비트 연산 최적화

### 비트 연산 활용

비트 연산은 산술 연산보다 빠르다.

```python
n = 10

# 짝수/홀수 판별
is_even = (n & 1) == 0  # n % 2 == 0보다 빠름

# 2의 거듭제곱
power_of_2 = 1 << k  # 2**k와 동일하지만 빠름
# 1 << 3 = 8 (2^3)
# 1 << 10 = 1024 (2^10)

# 나누기 2
half = n >> 1  # n // 2와 동일

# 곱하기 2
double = n << 1  # n * 2와 동일

# XOR 성질 활용 (같은 값 두 번 XOR하면 0)
# 배열에서 한 번만 등장하는 숫자 찾기
arr = [1, 2, 3, 2, 1]
result = 0
for x in arr:
    result ^= x
print(result)  # 3 (홀수 번 등장한 숫자)
```

### 수학 모듈

```python
import math

# 올림/내림/반올림
math.ceil(3.2)   # 4
math.floor(3.8)  # 3
round(3.5)       # 4 (파이썬의 round는 짝수로 반올림)

# 제곱근
math.sqrt(16)    # 4.0

# 최대공약수/최소공배수
math.gcd(12, 18)  # 6
# lcm = (a * b) // gcd(a, b)

# 팩토리얼
math.factorial(5)  # 120

# 조합
math.comb(5, 2)    # 10 (5C2)
math.perm(5, 2)    # 20 (5P2)
```

## 12. 알고리즘 패턴

### 투 포인터 패턴

정렬된 배열에서 두 개의 포인터를 이동하며 조건을 만족하는 쌍을 찾는 패턴이다.

```python
# 두 수의 합이 target인 쌍 찾기
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    
    while left < right:
        current_sum = arr[left] + arr[right]
        
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return None
```

### 슬라이딩 윈도우 패턴

고정된 크기의 윈도우를 이동하며 최적값을 찾는 패턴이다.

```python
# 크기 k의 부분배열 중 합이 최대인 것
def max_sum_subarray(arr, k):
    if len(arr) < k:
        return None
    
    # 첫 윈도우 합 계산
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # 윈도우를 한 칸씩 이동
    for i in range(k, len(arr)):
        window_sum = window_sum - arr[i-k] + arr[i]
        max_sum = max(max_sum, window_sum)
    
    return max_sum
```

### 구간 합 (Prefix Sum)

배열의 부분 구간 합을 O(1)에 구할 수 있다.

```python
# 구간 합 전처리
def build_prefix_sum(arr):
    prefix = [0]
    for num in arr:
        prefix.append(prefix[-1] + num)
    return prefix

# 구간 [left, right]의 합
def range_sum(prefix, left, right):
    return prefix[right+1] - prefix[left]

arr = [1, 2, 3, 4, 5]
prefix = build_prefix_sum(arr)  # [0, 1, 3, 6, 10, 15]
print(range_sum(prefix, 1, 3))  # 2+3+4 = 9
```

### DFS/BFS 템플릿

```python
# DFS (재귀)
def dfs_recursive(graph, node, visited):
    visited.add(node)
    print(node, end=' ')
    
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited)

# DFS (스택)
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            print(node, end=' ')
            stack.extend(reversed(graph[node]))  # 순서 유지

# BFS (큐)
from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    
    while queue:
        node = queue.popleft()
        print(node, end=' ')
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

## 13. 추가 유용 패턴

### 다중 조건 정렬

```python
# 2차원 리스트: 첫 번째 요소 오름차순, 같으면 두 번째 요소 내림차순
students = [('Alice', 90), ('Bob', 85), ('Charlie', 90), ('Dave', 85)]

# 방법 1: 튜플 key
sorted_students = sorted(students, key=lambda x: (x[1], -ord(x[0][0])))

# 방법 2: 여러 조건
sorted_students = sorted(students, key=lambda x: (-x[1], x[0]))
# [('Alice', 90), ('Charlie', 90), ('Bob', 85), ('Dave', 85)]

# 안정 정렬 (stable sort) - 같은 키 값은 원래 순서 유지
# 파이썬의 sort는 안정 정렬이므로 순서대로 정렬하면 됨
students.sort(key=lambda x: x[0])  # 이름 순
students.sort(key=lambda x: x[1], reverse=True)  # 점수 내림차순 (이름 순서 유지)
```

### 체이닝 비교

```python
# 파이썬은 수학적 표기처럼 비교 연산자를 체이닝할 수 있다
x = 5

# ❌ 다른 언어 스타일
if x > 0 and x < 10:
    print("0과 10 사이")

# ✅ 파이썬 스타일
if 0 < x < 10:
    print("0과 10 사이")

# 여러 조건 체이닝
if a < b < c < d:
    print("오름차순")

# 등호도 가능
if a == b == c:
    print("모두 같음")
```

### in-place vs 새 객체 생성

```python
arr = [3, 1, 4, 1, 5, 9]

# in-place: 원본 수정, None 반환
arr.sort()
print(arr)  # [1, 1, 3, 4, 5, 9]

# 새 객체 생성: 원본 유지, 정렬된 새 리스트 반환
arr2 = [3, 1, 4, 1, 5, 9]
sorted_arr = sorted(arr2)
print(arr2)       # [3, 1, 4, 1, 5, 9] (원본 유지)
print(sorted_arr) # [1, 1, 3, 4, 5, 9]

# 리스트 메서드들
arr.reverse()   # in-place
arr[::-1]       # 새 객체

arr.append(x)   # in-place
arr + [x]       # 새 객체

arr.extend([1, 2])  # in-place
arr + [1, 2]        # 새 객체
```

### 딕셔너리 메서드

```python
counter = {}

# get: 기본값 설정
count = counter.get('apple', 0)  # 없으면 0 반환

# setdefault: 없으면 설정하고 값 반환
counter.setdefault('apple', 0)
counter['apple'] += 1

# 패턴: 카운팅
for item in items:
    counter[item] = counter.get(item, 0) + 1

# items(), keys(), values() 활용
for key, value in counter.items():
    print(f"{key}: {value}")

# 딕셔너리 합치기 (Python 3.9+)
dict1 = {'a': 1, 'b': 2}
dict2 = {'b': 3, 'c': 4}
merged = dict1 | dict2  # {'a': 1, 'b': 3, 'c': 4}
```

### 무한대 표현

```python
# 무한대 (다익스트라, DP 초기화 등)
INF = float('inf')

distances = [INF] * n
distances[start] = 0

# 무한대 비교
print(INF > 10**9)  # True
print(INF + 100 == INF)  # True
print(INF == INF)  # True

# 음의 무한대
NEG_INF = float('-inf')

# 또는 큰 정수 사용
INF = 10**9  # 또는 int(1e9)
```

## 14. 코드 스타일

### PEP 8 핵심 규칙

파이썬 코드 스타일 가이드의 핵심 규칙이다.

```python
# ✅ 들여쓰기: 공백 4개
def solve():
    if condition:
        do_something()

# ✅ 변수명/함수명: snake_case
student_count = 10
def calculate_average():
    pass

# ✅ 상수: UPPER_CASE
MAX_SIZE = 1000
INF = float('inf')

# ✅ 연산자 앞뒤 공백
x = 1 + 2
arr[i] = value

# ✅ 쉼표 뒤 공백
arr = [1, 2, 3]
point = (x, y)

# ✅ 한 줄은 최대 79자
# 길면 괄호로 묶어서 여러 줄로
result = (
    some_function(arg1, arg2) +
    another_function(arg3, arg4)
)
```

### 명확한 변수명

```python
# ❌ 불명확
a = [1, 2, 3]
x = len(a)

# ✅ 명확
scores = [1, 2, 3]
student_count = len(scores)

# 반복 변수가 의미 없을 때는 _
for _ in range(n):
    do_something()
```

## 15. 실전 템플릿

### 기본 템플릿

```python
import sys
from collections import Counter, defaultdict, deque
from itertools import permutations, combinations, product
from functools import reduce
import heapq
import bisect
import math

input = sys.stdin.readline
INF = float('inf')

def solve():
    # 입력
    n = int(input())
    arr = list(map(int, input().split()))
    
    # 로직
    result = 0
    
    # 출력
    print(result)

if __name__ == "__main__":
    solve()
```

### 그리드 탐색 템플릿

```python
# 4방향 이동
dx = [-1, 1, 0, 0]
dy = [0, 0, -1, 1]

def is_valid(x, y, n, m):
    return 0 <= x < n and 0 <= y < m

def bfs_grid(grid, start_x, start_y):
    n, m = len(grid), len(grid[0])
    visited = [[False] * m for _ in range(n)]
    queue = deque([(start_x, start_y)])
    visited[start_x][start_y] = True
    
    while queue:
        x, y = queue.popleft()
        
        for i in range(4):
            nx = x + dx[i]
            ny = y + dy[i]
            
            if is_valid(nx, ny, n, m) and not visited[nx][ny]:
                if grid[nx][ny] == 1:  # 조건 확인
                    visited[nx][ny] = True
                    queue.append((nx, ny))
```

## 16. 성능 최적화

### 시간 복잡도별 권장 알고리즘

| 문제 크기 (N) | 권장 시간 복잡도 | 알고리즘 예시 |
|--------------|-----------------|-------------|
| N ≤ 10 | O(N!) | 순열, 백트래킹 |
| N ≤ 20 | O(2^N) | 비트마스킹, DFS |
| N ≤ 100 | O(N^3) | 플로이드-워셜 |
| N ≤ 1,000 | O(N^2) | 이중 반복문, DP |
| N ≤ 10,000 | O(N log N) | 정렬, 이진탐색 |
| N ≤ 100,000 | O(N) | 투 포인터, 해시 |
| N ≥ 1,000,000 | O(log N), O(1) | 수학 공식, 해시 |

### 최적화 팁

```python
# ✅ 집합 사용 (멤버십 테스트 O(1))
if x in my_set:  # O(1)
    pass

# ❌ 리스트 사용 (멤버십 테스트 O(n))
if x in my_list:  # O(n)
    pass

# ✅ 딕셔너리로 빠른 조회
counter = {}
for x in arr:
    counter[x] = counter.get(x, 0) + 1

# ✅ 불필요한 복사 피하기
def process(arr):
    # 원본 수정하지 않으려면
    arr_copy = arr[:]  # 또는 arr.copy()
    return arr_copy

# ✅ 제너레이터 사용 (메모리 절약)
sum(i**2 for i in range(1000000))  # 리스트 생성 안 함
```

## 17. 자주 하는 실수

### 리스트 초기화

```python
# ❌ 잘못된 2차원 리스트 (얕은 복사 문제)
matrix = [[0] * m] * n
matrix[0][0] = 1  # 모든 행의 [0]이 1로 변경됨!

# ✅ 올바른 2차원 리스트
matrix = [[0] * m for _ in range(n)]
```

### 가변 기본 인자

```python
# ❌ 위험한 코드
def append_to(element, target=[]):
    target.append(element)
    return target

print(append_to(1))  # [1]
print(append_to(2))  # [1, 2] (!!!)

# ✅ 안전한 코드
def append_to(element, target=None):
    if target is None:
        target = []
    target.append(element)
    return target
```

### 부동소수점 비교

```python
# ❌ 직접 비교
if 0.1 + 0.2 == 0.3:  # False!
    pass

# ✅ 오차 범위 내 비교
epsilon = 1e-9
if abs((0.1 + 0.2) - 0.3) < epsilon:
    pass

# ✅ Decimal 사용
from decimal import Decimal
if Decimal('0.1') + Decimal('0.2') == Decimal('0.3'):
    pass
```

## 정리

코딩테스트에서는 입출력 최적화, 자료구조 선택, 내장 함수 활용, 알고리즘 패턴 이해가 중요하다. 위 패턴들을 반복 연습하면 문제 해결 속도를 높일 수 있다.
