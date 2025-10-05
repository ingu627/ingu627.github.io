---
layout: single
title: "코딩테스트 해시(Hash) 대비: dict·set·Counter 패턴"
excerpt: "파이썬 딕셔너리·집합·Counter 기반 해시 테이블 활용법부터 충돌 처리·시간복잡도·빈출 유형(빈도·중복·조합·매핑)까지 실전 예제 중심 정리"
tags: [python, 파이썬, hash, 해시, 코딩테스트, 알고리즘, dict, set, Counter, defaultdict, 딕셔너리, 집합, 빈도수, 중복, 시간복잡도]
toc: true
toc_sticky: true
sidebar_main: false

mathjax: true
use_math: true

author_profile: true
last_modified_at: 2025-10-05
---

해시(Hash)는 코딩테스트에서 빈도·존재 여부·매핑 문제를 O(1) 평균 시간에 해결하는 핵심 자료구조다. 리스트의 `in` 연산이 O(n)인 반면, dict/set은 O(1)로 월등히 빠르다. 본 문서는 dict, set, Counter를 중심으로 실전 패턴을 정리했다.
{: .notice--info}

## 해시(Hash)란?

### 개념

해시는 데이터를 **빠르게 저장하고 찾기 위한** 자료구조다.

**핵심 아이디어**:
- 일반 배열: 인덱스로 접근 → `arr[0]`, `arr[1]` (O(1))
- 해시: **키(key)**를 인덱스처럼 사용 → `dict['name']` (O(1))
- 해시 함수가 키를 숫자(해시값)로 변환하여 저장 위치를 결정

**주요 용어**:
- **해시(Hash)**: 키를 해시 함수로 변환해 배열 인덱스로 사용하는 방식
- **해시 함수**: 임의 크기 데이터를 고정 크기 값(해시값)으로 매핑하는 함수
  - 예: `hash("apple")` → `12345` (정수)
- **해시 테이블**: 해시 함수 결과를 인덱스로 사용하는 배열 기반 자료구조
- **충돌(Collision)**: 서로 다른 키가 같은 해시값을 가질 때 발생
  - 해결 방법: 체이닝(linked list), 개방 주소법(다음 빈 자리 찾기)

**왜 빠를까?**
```python
# 리스트에서 찾기: O(n) - 처음부터 끝까지 확인
arr = [1, 2, 3, 4, 5]
if 5 in arr:  # 최악의 경우 5번 비교
    pass

# 해시에서 찾기: O(1) - 해시값으로 바로 접근
s = {1, 2, 3, 4, 5}
if 5 in s:  # 1번만에 확인 (hash(5) → 위치)
    pass
```

### 파이썬 주요 해시 자료구조

| 자료구조 | 특징 | 사용 예 |
|---------|------|---------|
| `dict` | 키-값 쌍 저장, 순서 보존(3.7+) | 빈도 카운트, 매핑 |
| `set` | 중복 없는 원소 집합 | 중복 제거, 존재 확인 |
| `Counter` | 빈도수 자동 계산 딕셔너리 | 문자/원소 빈도 |
| `defaultdict` | 기본값 자동 생성 딕셔너리 | 그룹화, 누적 |

```python
# 기본 예제
d = {'a': 1, 'b': 2}
s = {1, 2, 3}
from collections import Counter, defaultdict
cnt = Counter("aabbcc")
dd = defaultdict(int) # 만약 딕셔셔리에 키가 없으면 int() 함수를 실행해서 그 결과(0)를 기본값으로 넣는다.
print(d['a'], 1 in s, cnt['a'], dd['x'])  # 1 True 2 0
```

<br>

## 해시 핵심 연산

### dict (딕셔너리)

파이썬의 딕셔너리는 **키-값 쌍**을 저장하는 대표적인 해시 자료구조다.

**핵심 특징**:
- 키로 값을 O(1)에 조회 (매우 빠름!)
- Python 3.7+부터 **삽입 순서 유지** (이전엔 순서 보장 안됨)
- 키는 불변(immutable) 타입만 가능: int, str, tuple ⭕ / list, dict ❌

**생성 및 접근**

```python
# 1. 빈 딕셔너리 생성
d = {}           # 가장 일반적
d = dict()       # 함수 사용

# 2. 초기값과 함께 생성
d = {'name': '홍길동', 'age': 25}
d = dict([('a', 1), ('b', 2)])  # 튜플 리스트로
d = dict(name='홍길동', age=25)  # 키워드 인자로

# 3. 딕셔너리 컴프리헨션
d = {k: v for k, v in [('a', 1), ('b', 2)]}
squares = {x: x**2 for x in range(5)}  # {0:0, 1:1, 2:4, 3:9, 4:16}

# 접근 방법 비교
d = {'name': '홍길동', 'age': 25}

# 방법 1: 대괄호 (키가 없으면 KeyError)
name = d['name']        # '홍길동'
# city = d['city']      # KeyError 발생!

# 방법 2: get() (키가 없으면 기본값 반환, 에러 없음)
city = d.get('city', '서울')  # '서울' (없어서 기본값)
age = d.get('age', 0)          # 25 (있으면 원래 값)

# 존재 확인
if 'name' in d:
    print(f"이름: {d['name']}")
```

**언제 무엇을 사용할까?**
- `d[key]`: 키가 **반드시 있어야** 할 때
- `d.get(key, default)`: 키가 **없을 수도 있을** 때

- **삽입·수정·삭제**

```python
d['new_key'] = 'value'  # 삽입/수정
d.update({'k1': 1, 'k2': 2})  # 일괄 업데이트
del d['key']  # 삭제 (없으면 KeyError)
val = d.pop('key', None)  # 삭제 후 반환 (없으면 None)
d.clear()  # 전체 삭제
```

- **순회**

```python
for key in d:  # 키만
    pass
for val in d.values():  # 값만
    pass
for key, val in d.items():  # 키-값 쌍
    pass
```

### set (집합)

- **생성 및 연산**

```python
s = set()
s = {1, 2, 3}
s = set([1, 2, 2, 3])  # 중복 제거 → {1, 2, 3}

# 추가·제거
s.add(4)
s.remove(2)  # 없으면 KeyError
s.discard(2)  # 없어도 에러 안남
s.pop()  # 임의 원소 제거 후 반환

# 존재 확인
if 1 in s:
    pass

# 집합 연산
a = {1, 2, 3}
b = {2, 3, 4}
print(a | b)  # 합집합 {1, 2, 3, 4}
print(a & b)  # 교집합 {2, 3}
print(a - b)  # 차집합 {1}
print(a ^ b)  # 대칭차집합 {1, 4}
```

### Counter (빈도 카운터)

`Counter`는 해시 가능한 객체의 개수를 세는 딕셔너리 서브클래스이다.

- **생성 방법**

```python
from collections import Counter

# 1. 리스트
cnt = Counter([1, 2, 2, 3])  # Counter({2: 2, 1: 1, 3: 1})

# 2. 문자열
cnt = Counter("aabbcc")  # Counter({'a':2, 'b':2, 'c':2})

# 3. 딕셔너리
cnt = Counter({'a': 3, 'b': 1})

# 4. 키워드 인자
cnt = Counter(a=2, b=3, c=1)
```

**중요**: 존재하지 않는 키를 조회하면 에러 대신 **0을 반환**한다. 이것이 Counter의 가장 큰 장점이다!

```python
cnt = Counter("banana")
print(cnt['a'])  # 3 (있음)
print(cnt['z'])  # 0 (없어도 에러 안남!)

# 일반 dict와 비교
d = {'a': 3}
# print(d['z'])  # KeyError 발생!
print(d.get('z', 0))  # 0 (get으로 처리 필요)
```

- **주요 메서드**

```python
# most_common(n): 빈도 상위 n개 반환
cnt = Counter("banana")
print(cnt.most_common(2))  # [('a', 3), ('n', 2)]
print(cnt.most_common())    # 전체 반환 (내림차순)

# elements(): 각 요소를 개수만큼 반복
cnt = Counter({'a': 2, 'b': 1, 'c': 0})
print(list(cnt.elements()))  # ['a', 'a', 'b'] (0 이하 제외)
print(sorted(cnt.elements()))  # ['a', 'a', 'b']

# update(): 카운트 증가
cnt = Counter(a=1, b=2)
cnt.update({'a': 2, 'c': 1})
print(cnt)  # Counter({'a': 3, 'b': 2, 'c': 1})

# subtract(): 카운트 감소 (음수 가능)
cnt = Counter(a=3, b=2)
cnt.subtract({'a': 1, 'b': 3})
print(cnt)  # Counter({'a': 2, 'b': -1})
```

- **산술 연산**

```python
c1 = Counter(a=3, b=1)
c2 = Counter(a=1, b=4)

# 덧셈: 각 요소의 개수 합
print(c1 + c2)  # Counter({'a': 4, 'b': 5})

# 뺄셈: 차집합 (0 이하는 제외)
print(c1 - c2)  # Counter({'a': 2})

# 교집합 (&): 최소값
print(c1 & c2)  # Counter({'a': 1, 'b': 1})

# 합집합 (|): 최대값
print(c1 | c2)  # Counter({'b': 4, 'a': 3})
```

- **딕셔너리 변환 및 접근**

```python
cnt = Counter("banana")

# dict로 변환
print(dict(cnt))  # {'b': 1, 'a': 3, 'n': 2}

# keys, values 접근
print(list(cnt.keys()))    # ['b', 'a', 'n']
print(list(cnt.values()))  # [1, 3, 2]
print(sum(cnt.values()))   # 6 (전체 개수)

# items로 순회
for key, count in cnt.items():
    print(f"{key}: {count}")
```

**주의사항**:
- Counter는 **해시 가능한 객체**만 카운트 가능 (리스트는 불가)
- 뺄셈(`-`) 연산은 양수만 반환, `subtract()`는 음수도 유지
- 순서가 중요한 경우 `most_common()`이나 `sorted()` 사용

### defaultdict (기본값 딕셔너리)

```python
from collections import defaultdict

# 생성 (기본값 타입 지정)
dd = defaultdict(int)  # 기본값 0
dd = defaultdict(list)  # 기본값 []
dd = defaultdict(set)  # 기본값 set()

# 사용 (KeyError 없이 자동 생성)
dd[1] += 1  # int: 0 + 1 = 1
dd[2].append('a')  # list: [].append('a')
dd[3].add(5)  # set: set().add(5)

# 그룹화 예제
data = [('a', 1), ('b', 2), ('a', 3)]
groups = defaultdict(list)
for k, v in data:
    groups[k].append(v)
print(groups)  # {'a': [1, 3], 'b': [2]}
```

<br>

## 시간 복잡도

**핵심**: 해시의 가장 큰 장점은 **대부분의 연산이 O(1)**이라는 점이다!

| 연산 | dict | set | Counter | 리스트 비교 | 비고 |
|------|------|-----|---------|------------|------|
| 삽입 | O(1) | O(1) | O(1) | O(1) 끝 / O(n) 중간 | 평균 |
| 조회 | O(1) | O(1) | O(1) | **O(n)** | 평균, 해시가 훨씬 빠름! |
| 삭제 | O(1) | O(1) | O(1) | **O(n)** | 평균 |
| 존재 확인 (`in`) | O(1) | O(1) | O(1) | **O(n)** | 해시가 압도적 |
| 순회 | O(n) | O(n) | O(n) | O(n) | 전체 원소 |

**주의사항**:
- 평균 O(1)이지만, **최악의 경우** (모든 키가 충돌) O(n)
- 좋은 해시 함수를 사용하면 거의 항상 O(1)
- 파이썬의 dict/set은 충돌 처리가 잘 되어 있어 실전에서는 O(1)로 동작

**실전 성능 비교** (10만 개 데이터)

```python
# list vs set 성능 비교
import time
n = 100000
lst = list(range(n))
st = set(range(n))

start = time.time()
99999 in lst  # O(n)
t1 = time.time() - start

start = time.time()
99999 in st  # O(1)
t2 = time.time() - start
print(f"list: {t1:.6f}s, set: {t2:.6f}s")  # set이 월등히 빠름
```

<br>

## 코딩테스트 빈출 패턴

해시는 다음과 같은 **6가지 핵심 패턴**에서 자주 사용된다. 각 패턴의 핵심 아이디어를 먼저 이해하고, 코드를 보자.

### 1. 빈도수 계산

**문제 유형**: "가장 많이 등장하는", "k번 이상 나타나는", "빈도 순서대로"

**핵심 아이디어**: Counter를 사용하면 자동으로 개수를 세어준다!

**왜 리스트 `count()`를 안 쓸까?**
```python
arr = [1,1,1,2,2,3,3,3,3]

# 리스트.count(): O(n) × 종류 수 = O(n²)
for num in set(arr):
    print(num, arr.count(num))  # 매번 전체 순회

# Counter: O(n) 한 번만
from collections import Counter
cnt = Counter(arr)
for num, freq in cnt.items():
    print(num, freq)  # 한 번에 모든 빈도 계산
```

```python
from collections import Counter

def most_frequent(arr):
    """가장 빈도 높은 원소 반환"""
    cnt = Counter(arr)
    return cnt.most_common(1)[0][0]

def k_frequent(arr, k):
    """빈도 k 이상인 원소들"""
    cnt = Counter(arr)
    return [x for x, freq in cnt.items() if freq >= k]

def sort_by_freq(arr):
    """빈도 내림차순 정렬, 같으면 값 오름차순"""
    cnt = Counter(arr)
    return sorted(arr, key=lambda x: (-cnt[x], x))

# 테스트
print(most_frequent([1,1,2,3,3,3]))  # 3
print(k_frequent([1,1,2,2,2,3], 2))  # [1, 2]
print(sort_by_freq([2,2,1,1,1,3]))  # [1,1,1,2,2,3]
```

### 2. 중복 탐지

**문제 유형**: "중복 제거", "첫 번째 중복 찾기", "유일한 원소"

**핵심 아이디어**: set을 사용하면 중복을 O(1)에 확인할 수 있다!

**왜 리스트 `in`을 안 쓸까?**
```python
arr = [1, 2, 3, 4, 5, ..., 10000]

# 리스트 in: O(n) - 처음부터 끝까지 확인
if 9999 in arr:  # 9999번 비교해야 찾음
    pass

# set in: O(1) - 해시값으로 바로 확인
s = set(arr)
if 9999 in s:  # 1번에 찾음!
    pass
```

**실전 코드**

```python
def has_duplicate(arr):
    """중복 존재 여부"""
    return len(arr) != len(set(arr))

def first_duplicate(arr):
    """첫 번째 중복 원소"""
    seen = set()
    for x in arr:
        if x in seen:
            return x
        seen.add(x)
    return None

def remove_duplicates_keep_order(arr):
    """순서 유지하며 중복 제거"""
    seen = set()
    result = []
    for x in arr:
        if x not in seen:
            seen.add(x)
            result.append(x)
    return result

# 테스트
print(has_duplicate([1,2,3,2]))  # True
print(first_duplicate([1,2,3,2,1]))  # 2
print(remove_duplicates_keep_order([1,2,2,3,1,4]))  # [1,2,3,4]
```

### 3. 두 배열 비교

**핵심 아이디어**: 두 배열의 공통점/차이점을 빠르게 찾는다

**왜 set/Counter를 사용할까?**

```python
# ❌ 나쁜 예: 중첩 루프 (O(n*m))
def intersection_slow(arr1, arr2):
    result = []
    for x in arr1:
        if x in arr2 and x not in result:
            result.append(x)
    return result

# [1,2,2,1] vs [2,2]
# - arr1의 각 원소마다 arr2 전체 탐색
# - 4 * 2 = 8번 비교

# ✅ 좋은 예: set 사용 (O(n+m))
def intersection_fast(arr1, arr2):
    return list(set(arr1) & set(arr2))

# [1,2,2,1] vs [2,2]
# - set 변환: O(n) + O(m)
# - 교집합: O(min(n,m))
# - 총 4+2+2 = 8번... 하지만 n이 크면 훨씬 빠름!
```

**실전 코드**

```python
def intersection(arr1, arr2):
    """교집합 (중복 포함) - Counter 사용"""
    from collections import Counter
    c1, c2 = Counter(arr1), Counter(arr2)
    result = []
    for x in c1:
        # min()으로 공통 개수만큼 추가
        result.extend([x] * min(c1[x], c2[x]))
    return result
    # [1,2,2,1] vs [2,2] → [2,2] (2가 2번 공통)

def is_anagram(s1, s2):
    """애너그램 판별 - 문자 빈도만 비교"""
    from collections import Counter
    return Counter(s1) == Counter(s2)
    # "listen" vs "silent" → True (문자 개수 동일)

def find_missing(arr1, arr2):
    """arr1에만 있는 원소 - set 차집합"""
    return list(set(arr1) - set(arr2))
    # [1,2,3] - [1,2] → [3]

# 테스트
print(intersection([1,2,2,1], [2,2]))  # [2, 2]
print(is_anagram("listen", "silent"))  # True
print(find_missing([1,2,3], [1,2]))  # [3]
```

**언제 어떤 걸 사용?**
- **중복 무시**: `set` 연산 (`&`, `-`, `|`)
- **중복 포함**: `Counter` 연산 (`&`, `-`, `+`)
- **순서 중요**: 리스트 그대로 + 해시 조회

### 4. 그룹화 (defaultdict)

**핵심 아이디어**: 같은 특징(키)을 가진 원소들을 모은다

**왜 defaultdict를 사용할까?**

```python
# ❌ 나쁜 예: if 체크 반복
def group_by_length_slow(strs):
    groups = {}
    for s in strs:
        length = len(s)
        if length not in groups:  # 매번 체크!
            groups[length] = []
        groups[length].append(s)
    return groups

# ✅ 좋은 예: defaultdict 사용
def group_by_length_fast(strs):
    from collections import defaultdict
    groups = defaultdict(list)
    for s in strs:
        groups[len(s)].append(s)  # if 체크 없이 바로 추가!
    return dict(groups)

# ["a", "ab", "abc", "bc"]
# - if 체크 없이도 KeyError 안 남!
# - 코드가 3줄 → 1줄로 간결해짐
```

**실전 코드**

```python
from collections import defaultdict

def group_anagrams(strs):
    """애너그램끼리 그룹화 - 정렬된 문자열이 키"""
    groups = defaultdict(list)
    for s in strs:
        # 핵심: 애너그램은 정렬하면 동일!
        key = ''.join(sorted(s))
        groups[key].append(s)
    return list(groups.values())
    # ["eat","tea","ate"] → 모두 "aet"로 정렬 → 같은 그룹!

def group_by_length(strs):
    """길이별 그룹화 - 길이가 키"""
    groups = defaultdict(list)
    for s in strs:
        groups[len(s)].append(s)
    return dict(groups)
    # ["a","ab","abc"] → {1:['a'], 2:['ab'], 3:['abc']}

def group_by_pattern(words):
    """패턴별 그룹화 - 같은 패턴끼리"""
    groups = defaultdict(list)
    for word in words:
        # 예: "egg" → (0,1,1), "add" → (0,1,1)
        pattern = tuple(word.index(c) for c in word)
        groups[pattern].append(word)
    return list(groups.values())
    # ["egg","add","foo","bar"] → [["egg","add"],["foo"],["bar"]]

# 테스트
print(group_anagrams(["eat","tea","tan","ate","nat","bat"]))
# [['eat','tea','ate'], ['tan','nat'], ['bat']]
print(group_by_length(["a","ab","abc","bc"]))
# {1:['a'], 2:['ab','bc'], 3:['abc']}
```

**그룹화 키 선택 가이드**
- **문자열**: `sorted()` → 애너그램
- **숫자**: `len()`, `sum()`, `hash()` → 길이/합/특징
- **패턴**: `tuple(...)` → 구조적 특징

### 5. 투 포인터 + 해시

**문제 유형**: "두 수의 합", "부분 배열의 합", "연속 구간"

**핵심 아이디어**: 
- Two Sum: "target - 현재값"이 이전에 있었는지 확인
- 부분합: 누적합을 저장하며, "현재 누적합 - k"가 있었는지 확인

**Two Sum 상세 설명**

```python
# 문제: 합이 target인 두 수의 인덱스를 찾아라
# 입력: nums = [2, 7, 11, 15], target = 9
# 출력: [0, 1] (nums[0] + nums[1] = 2 + 7 = 9)

# 방법 1: 이중 루프 - O(n²)
def two_sum_slow(nums, target):
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []

# 방법 2: 해시 - O(n)
def two_sum(nums, target):
    seen = {}  # {값: 인덱스}
    for i, num in enumerate(nums):
        complement = target - num  # 찾아야 할 짝
        if complement in seen:     # O(1)로 확인!
            return [seen[complement], i]
        seen[num] = i  # 현재 값 저장
    return []

# 동작 과정 (nums=[2,7,11,15], target=9)
# i=0, num=2: complement=7, seen={} → seen에 2 저장
# i=1, num=7: complement=2, seen={2:0} → 2 발견! [0,1] 반환
```

**부분합 문제 (Subarray Sum)**

```python
def two_sum(nums, target):
    """합이 target인 두 인덱스"""
    seen = {}
    for i, num in enumerate(nums):
        if target - num in seen:
            return [seen[target - num], i]
        seen[num] = i
    return []

def subarray_sum_k(nums, k):
    """합이 k인 부분 배열 개수 (누적합)"""
    from collections import defaultdict
    prefix_sum = 0
    cnt = defaultdict(int)
    cnt[0] = 1
    result = 0
    for num in nums:
        prefix_sum += num
        result += cnt[prefix_sum - k]
        cnt[prefix_sum] += 1
    return result

# 테스트
print(two_sum([2,7,11,15], 9))  # [0, 1]
print(subarray_sum_k([1,1,1], 2))  # 2
```

### 6. LRU 캐시 (OrderedDict)

**핵심 아이디어**: 최근 사용한 것을 앞쪽에 두고, 가장 오래된 것을 제거

**왜 OrderedDict를 사용할까?**

```python
# ❌ 나쁜 예: 리스트로 구현
class LRUCache_Slow:
    def __init__(self, capacity):
        self.cache = []  # [(key, value), ...]
        self.capacity = capacity
    
    def get(self, key):
        for i, (k, v) in enumerate(self.cache):
            if k == key:
                # 찾은 후 맨 뒤로 이동 (O(n))
                self.cache.append(self.cache.pop(i))
                return v
        return -1  # 찾기: O(n), 이동: O(n)

# ✅ 좋은 예: OrderedDict 사용
from collections import OrderedDict
class LRUCache:
    def __init__(self, capacity):
        self.cache = OrderedDict()
        self.capacity = capacity
    
    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)  # O(1)로 최신으로!
        return self.cache[key]  # 찾기: O(1), 이동: O(1)
```

**실전 코드**

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cache = OrderedDict()
        self.capacity = capacity
    
    def get(self, key):
        if key not in self.cache:
            return -1
        # 핵심: 사용하면 최신(맨 뒤)으로 이동
        self.cache.move_to_end(key)
        return self.cache[key]
    
    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        # 용량 초과 시 가장 오래된 것(맨 앞) 제거
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)

# 테스트: 용량 2
lru = LRUCache(2)
lru.put(1, 1)  # cache: {1:1}
lru.put(2, 2)  # cache: {1:1, 2:2}
print(lru.get(1))  # 1 (사용 → 최신) → cache: {2:2, 1:1}
lru.put(3, 3)  # 용량 초과! 2 제거 → cache: {1:1, 3:3}
print(lru.get(2))  # -1 (이미 제거됨)
```

**LRU 캐시 핵심 동작**
1. **get**: 있으면 맨 뒤로 이동 (최신)
2. **put**: 있으면 업데이트 + 맨 뒤로, 없으면 추가
3. **용량 초과**: 맨 앞(가장 오래된 것) 제거

**실전 팁**:
- `move_to_end(key)`: 키를 맨 뒤(최신)로 이동
- `popitem(last=False)`: 맨 앞(가장 오래된 것) 제거
- `popitem(last=True)`: 맨 뒤(최신) 제거

<br>

## 실전 문제 예제

### 예제 1: 완주하지 못한 선수 (프로그래머스)

```python
def solution(participant, completion):
    from collections import Counter
    p = Counter(participant)
    c = Counter(completion)
    diff = p - c
    return list(diff.keys())[0]

# 또는 dict 사용
def solution2(participant, completion):
    d = {}
    for name in participant:
        d[name] = d.get(name, 0) + 1
    for name in completion:
        d[name] -= 1
    for name, cnt in d.items():
        if cnt > 0:
            return name
```

### 예제 2: 전화번호 목록 (프로그래머스)

```python
def solution(phone_book):
    # 정렬 후 인접 비교
    phone_book.sort()
    for i in range(len(phone_book) - 1):
        if phone_book[i+1].startswith(phone_book[i]):
            return False
    return True

# 또는 해시 사용
def solution2(phone_book):
    s = set(phone_book)
    for phone in phone_book:
        prefix = ""
        for digit in phone[:-1]:  # 마지막 제외
            prefix += digit
            if prefix in s:
                return False
    return True
```

### 예제 3: 베스트앨범 (프로그래머스)

```python
def solution(genres, plays):
    from collections import defaultdict
    
    # 장르별 총 재생수, (인덱스, 재생수) 저장
    genre_play = defaultdict(int)
    genre_songs = defaultdict(list)
    
    for i, (g, p) in enumerate(zip(genres, plays)):
        genre_play[g] += p
        genre_songs[g].append((i, p))
    
    # 장르별 정렬 (재생수 내림차순, 인덱스 오름차순)
    for g in genre_songs:
        genre_songs[g].sort(key=lambda x: (-x[1], x[0]))
    
    # 총 재생수 많은 장르 순으로 정렬
    sorted_genres = sorted(genre_play.keys(), key=lambda x: -genre_play[x])
    
    result = []
    for g in sorted_genres:
        result.extend([idx for idx, _ in genre_songs[g][:2]])
    
    return result
```

### 예제 4: 의상 (프로그래머스)

```python
def solution(clothes):
    from collections import defaultdict
    d = defaultdict(int)
    
    for name, type in clothes:
        d[type] += 1
    
    # 조합 계산: (각 종류 개수 + 1(안입음)) 곱 - 1(모두 안입음)
    result = 1
    for cnt in d.values():
        result *= (cnt + 1)
    return result - 1
```

<br>

## 해시 vs 다른 자료구조

**언제 어떤 자료구조를 사용해야 할까?** 문제 유형별 최적 선택 가이드

| 비교 | 해시 (dict/set) | 리스트 | 정렬+이진탐색 |
|------|-----------------|--------|---------------|
| 삽입 | ⭐ **O(1)** | O(1) 끝 / O(n) 중간 | O(n) |
| 조회 | ⭐ **O(1)** | O(n) | O(log n) |
| 삭제 | ⭐ **O(1)** | O(n) | O(n) |
| 정렬 | ❌ (순서 무관) | O(n log n) | ✅ (이미 정렬) |
| 공간 | O(n) | O(n) | O(n) |
| 인덱스 접근 | ❌ | ✅ `arr[i]` | ✅ `arr[i]` |

**선택 기준** - 이것만 기억하자!

### 해시를 사용해야 할 때 ⭐

- ✅ **존재 여부** 확인: "배열에 x가 있는가?"
- ✅ **빈도** 계산: "각 원소가 몇 번 나타나는가?"
- ✅ **빠른 조회**: "이 키에 해당하는 값은?"
- ✅ **중복 제거**: "유일한 원소만 남기기"
- ✅ **그룹화**: "같은 조건끼리 묶기"

```python
# 예: 배열에 특정 값이 있는지 확인
numbers = list(range(10000))
# 리스트: O(n)
if 9999 in numbers:  # 느림
    pass
# 해시: O(1)
numbers_set = set(numbers)
if 9999 in numbers_set:  # 빠름!
    pass
```

### 리스트를 사용해야 할 때

- ✅ **순서 유지** 필요: "첫 번째 원소부터 순서대로"
- ✅ **인덱스 접근**: `arr[0]`, `arr[-1]`
- ✅ **중복 허용**: [1, 1, 2, 2, 3]
- ✅ **슬라이싱**: `arr[1:5]`

```python
# 예: 순서가 중요한 경우
scores = [85, 92, 78]  # 1등, 2등, 3등
print(f"1등: {scores[0]}")  # 순서 보장
```

### 정렬 + 이진탐색을 사용해야 할 때

- ✅ **범위 쿼리**: "x 이상 y 이하인 값들"
- ✅ **정렬된 상태 유지**: "항상 정렬되어 있어야 함"
- ✅ **k번째 원소**: "중앙값", "상위 10개"

```python
# 예: 범위 검색
import bisect
sorted_nums = [1, 3, 5, 7, 9]
# x 이상인 첫 번째 위치
idx = bisect.bisect_left(sorted_nums, 5)  # O(log n)
```

**실전 팁**: 대부분의 "빠른 조회"는 해시, "순서가 중요"하면 리스트, "범위 검색"이면 정렬!

<br>

## 주의사항 & 팁

코딩테스트에서 **자주 하는 실수**와 해결 방법

### 1. 해시 가능(Hashable) 타입

**문제**: 딕셔너리 키나 set 원소로 리스트를 사용하면 에러 발생!

```python
# ❌ 불가능: list, dict, set (가변 타입)
# d = {[1, 2]: 'value'}  # TypeError: unhashable type: 'list'
# s = {[1, 2], [3, 4]}   # TypeError

# ✅ 가능: int, float, str, tuple (불변 타입)
d = {1: 'a', 'key': 'val', (1,2): 'tuple'}
s = {1, 'text', (1, 2)}

# 해결책: 리스트를 튜플로 변환
coords = [[1,2], [3,4]]
# set(coords)  # 에러!
coord_set = {tuple(c) for c in coords}  # OK!
print(coord_set)  # {(1, 2), (3, 4)}
```

**왜 리스트는 안 될까?**
- 리스트는 **변경 가능** → 내용이 바뀌면 해시값도 바뀜
- 튜플은 **변경 불가** → 해시값이 항상 동일

### 2. KeyError 방지

**문제**: 없는 키를 조회하면 프로그램이 멈춘다!

```python
d = {'a': 1, 'b': 2}

# ❌ 나쁜 예: 에러 발생
# val = d['c']  # KeyError!

# ✅ 좋은 예 1: get() 사용 (가장 안전)
val = d.get('c', 0)  # 0 (기본값)
val = d.get('a', 0)  # 1 (있으면 원래 값)

# ✅ 좋은 예 2: in으로 확인 후 접근
if 'c' in d:
    val = d['c']
else:
    val = 0

# ✅ 좋은 예 3: defaultdict (자동 생성)
from collections import defaultdict
dd = defaultdict(int)  # 없으면 0 자동 생성
dd['x'] += 1  # KeyError 없음!
```

**코딩테스트 팁**: `get()`을 습관화하자!

### 3. defaultdict vs dict.setdefault

**문제**: 키가 없을 때마다 초기화하는 코드가 반복된다!

```python
# ❌ 나쁜 예: 매번 if 체크
d = {}
for word in ["a", "b", "a", "c"]:
    if word not in d:
        d[word] = 0
    d[word] += 1

# ✅ 좋은 예 1: get() 활용
d = {}
for word in ["a", "b", "a", "c"]:
    d[word] = d.get(word, 0) + 1

# ✅ 좋은 예 2: setdefault() (표준 dict)
d = {}
for word in ["a", "b", "a", "c"]:
    d.setdefault(word, 0)
    d[word] += 1

# ⭐ 가장 좋은 예: defaultdict (가장 깔끔!)
from collections import defaultdict
d = defaultdict(int)  # 없으면 자동으로 0
for word in ["a", "b", "a", "c"]:
    d[word] += 1  # KeyError 걱정 없음!
```

**defaultdict 언제 사용?**
- 그룹화: `defaultdict(list)`
- 빈도 계산: `defaultdict(int)`
- 집합 관리: `defaultdict(set)`

```python
# 실전 예: 문자열 길이별 그룹화
words = ["cat", "dog", "bird", "ant", "bear"]

# defaultdict 사용
from collections import defaultdict
groups = defaultdict(list)
for word in words:
    groups[len(word)].append(word)
print(dict(groups))  # {3: ['cat', 'dog', 'ant'], 4: ['bird', 'bear']}
```

### 4. Counter 음수 빈도

```python
from collections import Counter
c = Counter({'a': 2, 'b': 1})
c.subtract({'a': 3})  # 음수 허용
print(c)  # Counter({'b': 1, 'a': -1})

# 양수만 필요하면
c = +c  # 양수만 남김
print(c)  # Counter({'b': 1})
```

### 5. 집합 연산 최적화

```python
# 교집합 크기만 필요할 때
a = set(range(1000))
b = set(range(500, 1500))
print(len(a & b))  # 집합 생성 없이 크기만

# issubset, issuperset, isdisjoint 활용
print({1,2}.issubset({1,2,3}))  # True
print({1,2,3}.issuperset({1,2}))  # True
print({1,2}.isdisjoint({3,4}))  # True (교집합 없음)
```

<br>

## 고급 패턴

### 1. 해시 + 슬라이딩 윈도우

```python
def max_subarray_length_k(arr, k):
    """합이 k 이하인 최대 길이 부분 배열"""
    from collections import defaultdict
    prefix_sum = 0
    min_idx = {0: -1}  # 누적합 → 최소 인덱스
    result = 0
    
    for i, num in enumerate(arr):
        prefix_sum += num
        if prefix_sum - k in min_idx:
            result = max(result, i - min_idx[prefix_sum - k])
        if prefix_sum not in min_idx:
            min_idx[prefix_sum] = i
    
    return result
```

### 2. 해시 + DFS/BFS

```python
def clone_graph(node):
    """그래프 깊은 복사 (해시로 방문 추적)"""
    if not node:
        return None
    
    visited = {}
    
    def dfs(n):
        if n in visited:
            return visited[n]
        
        clone = Node(n.val)
        visited[n] = clone
        
        for neighbor in n.neighbors:
            clone.neighbors.append(dfs(neighbor))
        
        return clone
    
    return dfs(node)
```

### 3. 트라이(Trie) 구현

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end
    
    def starts_with(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True

# 테스트
trie = Trie()
trie.insert("apple")
print(trie.search("apple"))   # True
print(trie.search("app"))     # False
print(trie.starts_with("app")) # True
```

<br>

## 연습 문제 추천

### 기초
- [프로그래머스] 완주하지 못한 선수
- [프로그래머스] 폰켓몬
- [LeetCode] 1. Two Sum
- [LeetCode] 217. Contains Duplicate

### 중급
- [프로그래머스] 전화번호 목록
- [프로그래머스] 의상
- [LeetCode] 49. Group Anagrams
- [LeetCode] 560. Subarray Sum Equals K

### 고급
- [프로그래머스] 베스트앨범
- [LeetCode] 146. LRU Cache
- [LeetCode] 208. Implement Trie
- [LeetCode] 380. Insert Delete GetRandom O(1)

<br>

## 마무리 체크리스트

- [ ] dict, set, Counter 기본 연산 숙지
- [ ] 시간 복잡도 O(1) vs O(n) 구분
- [ ] 빈도수 계산 패턴 3가지 이상
- [ ] 중복 처리 (제거/탐지) 구현
- [ ] defaultdict 그룹화 활용
- [ ] Two Sum 변형 3가지 풀이
- [ ] 해시 vs 리스트 선택 기준 이해
- [ ] KeyError/해시 가능 타입 주의사항

<br>

## References

- [Python 공식 문서 - collections](https://docs.python.org/ko/3/library/collections.html)
- [Python 공식 문서 - dict](https://docs.python.org/ko/3/library/stdtypes.html#dict)
- [Python 공식 문서 - set](https://docs.python.org/ko/3/library/stdtypes.html#set)
- [프로그래머스 - 해시](https://school.programmers.co.kr/learn/courses/30/parts/12077)
- [LeetCode - Hash Table](https://leetcode.com/tag/hash-table/)
- [위키백과 - 해시 테이블](https://ko.wikipedia.org/wiki/%ED%95%B4%EC%8B%9C_%ED%85%8C%EC%9D%B4%EB%B8%94)
