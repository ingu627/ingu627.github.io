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

해시(Hash)는 코딩테스트에서 빈도·존재 여부·매핑 문제를 O(1) 평균 시간에 해결하는 핵심 자료구조입니다. dict, set, Counter를 중심으로 실전 패턴을 정리했습니다.
{: .notice--info}

## 해시(Hash)란?

### 개념

- **해시(Hash)**: 키(key)를 해시 함수로 변환해 배열 인덱스로 사용, 값(value)을 O(1) 평균 시간에 저장/조회하는 자료구조
- **해시 함수**: 임의 크기 데이터를 고정 크기 값(해시값)으로 매핑하는 함수
- **해시 테이블**: 해시 함수 결과를 인덱스로 사용하는 배열 기반 자료구조
- **충돌(Collision)**: 서로 다른 키가 같은 해시값을 가질 때 발생 (체이닝·개방 주소법으로 해결)

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
dd = defaultdict(int)
print(d['a'], 1 in s, cnt['a'], dd['x'])  # 1 True 2 0
```

<br>

## 해시 핵심 연산

### dict (딕셔너리)

- **생성 및 접근**

```python
# 생성
d = {}
d = dict()
d = {'key': 'value'}
d = dict([('a', 1), ('b', 2)])
d = {k: v for k, v in [('a', 1), ('b', 2)]}

# 접근 (KeyError 방지)
val = d.get('key', default_value)  # 없으면 기본값
val = d['key']  # 없으면 KeyError

# 존재 확인
if 'key' in d:
    pass
```

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

```python
from collections import Counter

# 생성
cnt = Counter()
cnt = Counter("aabbcc")  # {'a':2, 'b':2, 'c':2}
cnt = Counter([1, 1, 2, 3])

# 주요 메서드
cnt['a']  # 빈도 (없으면 0)
cnt.most_common(2)  # 빈도 상위 2개 [(원소, 빈도), ...]
cnt.update("aaa")  # 추가 카운트
cnt.subtract("aa")  # 빈도 감소 (음수 가능)

# 연산
c1 = Counter("aab")
c2 = Counter("abb")
print(c1 + c2)  # Counter({'a':3, 'b':3})
print(c1 - c2)  # Counter({'a':1})  (양수만)
print(c1 & c2)  # Counter({'a':1, 'b':1})  (최소값)
print(c1 | c2)  # Counter({'a':2, 'b':2})  (최대값)
```

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

| 연산 | dict | set | Counter | 비고 |
|------|------|-----|---------|------|
| 삽입 | O(1) | O(1) | O(1) | 평균 |
| 조회 | O(1) | O(1) | O(1) | 평균 |
| 삭제 | O(1) | O(1) | O(1) | 평균 |
| 존재 확인 | O(1) | O(1) | O(1) | `in` 연산자 |
| 순회 | O(n) | O(n) | O(n) | 전체 원소 |

**주의**: 최악의 경우(모든 키가 충돌) O(n)이지만, 좋은 해시 함수 사용 시 평균 O(1)

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

### 1. 빈도수 계산

- **문제 유형**: 가장 많이 등장하는 원소, k번 이상 등장, 빈도 정렬

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

**문제 유형**: 중복 제거, 첫 중복 찾기, 유일 원소

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

- **문제 유형**: 교집합, 차집합, 애너그램 판별

```python
def intersection(arr1, arr2):
    """교집합 (중복 포함)"""
    from collections import Counter
    c1, c2 = Counter(arr1), Counter(arr2)
    result = []
    for x in c1:
        result.extend([x] * min(c1[x], c2[x]))
    return result

def is_anagram(s1, s2):
    """애너그램 판별"""
    from collections import Counter
    return Counter(s1) == Counter(s2)

def find_missing(arr1, arr2):
    """arr1에만 있는 원소"""
    return list(set(arr1) - set(arr2))

# 테스트
print(intersection([1,2,2,1], [2,2]))  # [2, 2]
print(is_anagram("listen", "silent"))  # True
print(find_missing([1,2,3], [1,2]))  # [3]
```

### 4. 그룹화 (defaultdict)

- **문제 유형**: 같은 조건끼리 묶기, 인덱스별 분류

```python
from collections import defaultdict

def group_anagrams(strs):
    """애너그램끼리 그룹화"""
    groups = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))
        groups[key].append(s)
    return list(groups.values())

def group_by_length(strs):
    """길이별 그룹화"""
    groups = defaultdict(list)
    for s in strs:
        groups[len(s)].append(s)
    return dict(groups)

# 테스트
print(group_anagrams(["eat","tea","tan","ate","nat","bat"]))
# [['eat','tea','ate'], ['tan','nat'], ['bat']]
print(group_by_length(["a","ab","abc","bc"]))
# {1:['a'], 2:['ab','bc'], 3:['abc']}
```

### 5. 투 포인터 + 해시

- **문제 유형**: Two Sum, 부분합, 연속 구간

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

- **문제 유형**: 최근 사용 우선, 용량 제한

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cache = OrderedDict()
        self.capacity = capacity
    
    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)  # 최신으로 이동
        return self.cache[key]
    
    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)  # 가장 오래된 것 제거

# 테스트
lru = LRUCache(2)
lru.put(1, 1)
lru.put(2, 2)
print(lru.get(1))  # 1
lru.put(3, 3)  # 2 제거
print(lru.get(2))  # -1
```

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

| 비교 | 해시 (dict/set) | 리스트 | 정렬+이진탐색 |
|------|-----------------|--------|---------------|
| 삽입 | O(1) | O(1) 끝 / O(n) 중간 | O(n) |
| 조회 | O(1) | O(n) | O(log n) |
| 삭제 | O(1) | O(n) | O(n) |
| 정렬 | X (순서 무관) | O(n log n) | O (이미 정렬) |
| 공간 | O(n) | O(n) | O(n) |

**선택 기준**:
- 존재 여부 / 빈도 / 빠른 조회 → **해시**
- 순서 유지 / 인덱스 접근 → **리스트**
- 범위 쿼리 / 정렬 필요 → **정렬 + 이진탐색**

<br>

## 주의사항 & 팁

### 1. 해시 가능(Hashable) 타입

```python
# 가능: int, float, str, tuple (불변)
d = {1: 'a', 'key': 'val', (1,2): 'tuple'}

# 불가능: list, dict, set (가변)
# d = {[1,2]: 'list'}  # TypeError

# 해결: tuple로 변환
d = {tuple([1,2]): 'list'}
```

### 2. KeyError 방지

```python
d = {'a': 1}

# 나쁜 예
# val = d['b']  # KeyError

# 좋은 예
val = d.get('b', 0)  # 기본값 0
if 'b' in d:
    val = d['b']
```

### 3. defaultdict vs dict.setdefault

```python
from collections import defaultdict

# defaultdict (더 간결)
dd = defaultdict(list)
dd[1].append('a')

# dict.setdefault (표준 dict)
d = {}
d.setdefault(1, []).append('a')
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
