---
layout: single
title: "파이썬(python) 함수 기능에 대한 모든 것"
excerpt: "파이썬을 이용하면서 배웠던 것들. 알고리즘 사용한 것들, 모르는 것들, 헷갈리는 것들을 정리하고 있습니다."
tags: [python, 파이썬, 정의, 함수, 클래스, 인스턴스, 객체, self, __init__, args, kwargs, 리스트]
toc: true
toc_sticky: true
sidebar_main: false

mathjax: true
use_math: true

author_profile: true
last_modified_at: 2025-09-26
---

문제 풀기 : 알고리즘 문제에서 주어지는 것들을 구별하는 습관 가지기!!  
순서는 상관없이 배우는 대로 정리를 해 나가고 있습니다.
{: .notice--danger}

## 파이썬 함수

### class , object, instance

- 클래스(class)는 틀이고, 객체(object)는 이 틀에 만들어진 피조물을 뜻함
  - **인스턴스(instance)** : 실체
  - **객체(object)** : 그 실체를 말함
- **클래스 정의** $\rightarrow$ **인스턴스명 = 클래스()** $\rightarrow$ 어떤 객체의 메서드를 사용할 때는 **객체.메서드**
- **self**는 그 클래스의 객체를 가리킴

![image](https://user-images.githubusercontent.com/78655692/152981730-f6e20f01-6dc4-4422-b708-981e7182231c.png)

- **\_\_init\_\_** : 초기화(initialize) 메서드, 어떤 클래스의 객체가 만들어질 때 자동으로 **호출**되어서 그 객체가 갖게 될 여러 가지 성질을 정해주는 일을 함

```python
# 간단한 클래스와 인스턴스 예시
class Person:
  def __init__(self, name, age):  # 객체 생성 시 자동 호출
    self.name = name
    self.age = age

  def hello(self):  # 인스턴스 메서드
    return f"안녕 나는 {self.name}, 나이는 {self.age}"

p = Person("홍길동", 20)   # 인스턴스 생성
print(p.hello())            # 객체.메서드
```

### inheritance, override, super

- **상속 (inheritance)** : 클래스를 부모와 자식으로 나눈 뒤 부모클래스의 내용을 자식이 그대로 가져다 쓰는 것
- **오버라이드 (override)** : 같은 이름을 가진 메소드를 덮을 때
- **super()** : 자식 클래스에서 부모클래스의 내용을 사용하고 싶을 때

- **class** : 특정 타입의 객체를 생성하기 위한 청사진(설계도)
- **methods** : 클래스에 속한 함수(인스턴스가 호출할 수 있는 동작)
- **attributes** : 클래스나 인스턴스가 상태 데이터를 저장하는 변수
- **object** : 클래스 정의를 통해 실제로 만들어진 구체적 인스턴스(실체)
- **inheritance** : 기존(부모) 클래스의 속성과 동작을 이어받아 재사용·확장하는 메커니즘
- **composition** : 다른 객체들을 조합(포함)하여 더 복잡한 객체를 구성하는 방법

```python
class Animal:
  def sound(self):
    return "..."

class Dog(Animal):  # 상속
  def sound(self):  # 오버라이드
    return "멍멍"

class GuideDog(Dog):
  def sound(self):
    base = super().sound()  # super() 사용
    return base + " (안내견)"

print(Dog().sound())        # 멍멍
print(GuideDog().sound())   # 멍멍 (안내견)
```

### input()

- 사용자가 입력한 값을 어떤 변수에 대입하고 싶을 때
- input은 입력되는 모든 것을 문자열로 취급한다.

```python
# 한 줄에서 정수 3개 받기
# 입력: 10 20 30
a, b, c = map(int, input().split())
print(a + b + c)
```

### split()

- 공백(스페이스, 탭, 엔터 등)을 기준으로 문자열을 나누어 준다

```python
s = "red,blue,green"
colors = s.split(',')
print(colors)  # ['red', 'blue', 'green']
```

### 나눗셈

- **/** : 그냥 나눔
- **//** : 몫
- **%** : 나머지

- **divmod(a,b)** : 매개변수로 받은 a를 b로 나눈다. 그리고 그 몫과 나머지를 튜플(tuple) 데이터 타입으로 반환한다.
- 특수문자 표기는 `\` 앞에 쓰면 됨

```python
a, b = 17, 5
print(a / b)      # 3.4 (실수 나눗셈)
print(a // b)     # 3   (몫)
print(a % b)      # 2   (나머지)
print(divmod(a,b))  # (3, 2)
```

### sys.stdin.readline()

- input 대신 씀

```python
import sys
line = sys.stdin.readline().rstrip()  # 개행 제거
# 여러 정수 빠르게 받기
# arr = list(map(int, sys.stdin.readline().split()))
```

### index

- 리스트에 x 값이 있으면 x의 위치 값을 돌려준다.

```python
arr = [10, 20, 30, 20]
print(arr.index(20))  # 1 (첫 번째 위치)
```

### count

- 리스트 안에 x가 몇 개 있는지 조사하여 그 개수를 돌려주는 함수이다.

```python
arr = [1,1,2,3,1,2]
print(arr.count(1))  # 3
```

### enumerate

- 인덱스 번호와 컬렉션의 원소를 tuple형태로 반환한다.
- enumerate는 "열거하다"라는 뜻이다.

```python
names = ["a","b","c"]
for idx, name in enumerate(names, start=1):
  print(idx, name)
```

### string.printable

- 인쇄 가능한 것으로 간주하는 ASCII 문자의 문자열

```python
import string
print(string.printable[:20])  # 앞 일부
print('A' in string.printable)  # True
```

### zip(*iterable)

- 여러 개의 순회 가능한(iterable) 객체를 인자로 받고, 각 객체가 담고 있는 원소를 터플의 형태로 차례로 접근할 수 있는 반복자(iterator)를 반환한다.
- 동일한 개수로 이루어진 자료형을 묶어 주는 역할을 하는 함수이다.
- `*iterable`은 반복 가능(iterable)한 자료형 여러 개를 입력할 수 있다는 의미이다.

```python
a = [1,2,3]
b = ['a','b','c']
for x, y in zip(a,b):
  print(x,y)
```

### set

- 집합. 중복되지 않은 원소를 얻고자 할 때
- 중복을 허용하지 않는다 / 순서가 없다(Unordered)
- `set()` : 비어있는 집합 만들기

```python
arr = [1,2,2,3,3,3]
uniq = set(arr)
print(uniq)        # {1,2,3}
print(2 in uniq)   # True
```

### f-string

- f-string을 나타 낼 수 있게 문자열 앞에f를 입력하고 중괄호 사이에 {변수 : 소수점자리수} 순서로 작성

```python
name = "홍길동"; score = 91.236
print(f"{name}: {score:.1f}")  # 홍길동: 91.2
```

### add

- 집합에 요소를 추가할 때
- 집합에서 차집합을 구할 때

```python
s = {1,2}
s.add(3)
print(s)           # {1,2,3}
print(s - {2})     # {1,3}  (차집합)
```

### sorted(정렬할 데이터, key 파라미터, reverse 파라미터)

- 첫 번째 매개변수로 들어온 이터러블한 데이터를 새로운 정렬된 리스트로 만들어서 반환해 주는 함수

```python
words = ["bbb","a","cc"]
print(sorted(words))  # ['a','bbb','cc'] (사전식)
print(sorted(words, key=len))  # ['a','cc','bbb']
print(sorted(words, key=len, reverse=True))
```

### sorted(iterable)

- 입력값을 정렬한 후 그 결과를 리스트로 돌려주는 함수이다.

```python
nums = {5,1,4}
print(sorted(nums))  # [1,4,5]
```

### list[index] = value

- index 위치에 value 값을 넣어라

```python
arr = [0,0,0]
arr[1] = 5
print(arr)  # [0,5,0]
```

### list.append(a)

- 리스트 끝에 a값 추가

```python
arr = [1]
arr.append(2)
print(arr)
```

### list.insert(a, b)

- 리스트 a위치(=index)에 b 값 추가

```python
arr = [1,3]
arr.insert(1,2)
print(arr)  # [1,2,3]
```

### list.remove(a)

- 리스트에서 a값 제거

```python
arr = [1,2,2,3]
arr.remove(2)  # 첫 번째 2 제거
print(arr)     # [1,2,3]
```

### list.pop()

- 리스트에 있는 마지막 값을 반환한 후 해당 값을 삭제하는 함수

```python
arr = [1,2,3]
val = arr.pop()
print(val, arr)  # 3 [1,2]
```

### list.extend(list2)

- 리스트와 리스트2을 결합

```python
a = [1,2]; b = [3,4]
a.extend(b)
print(a)  # [1,2,3,4]
```

### list.reverse()

- 리스트 요소들를 뒤집음

```python
arr = [1,2,3]
arr.reverse()
print(arr)  # [3,2,1]
```

### ord()

- 문자의 아스키 코드값을 리턴하는 함수이다.

```python
print(ord('A'))  # 65
```

### chr()

- 아스키 코드값 입력으로 받아 그 코드에 해당하는 문자를 출력하는 함수이다.
- a부터 z까지는 97 ~ 122까지이다. 예를 들어 chr(97)=='a' , chr(122)=='z'

```python
print(chr(97), chr(122))  # a z
```

### 변수.find(찾을 문자) or 변수.index(찾을 문자)

- 변수에 위치한 문자열 중 괄호() 안에 넣은 특정 문자가 처음 위치한 자리의 값 반환
- find함수는 찾는 값이 없을 때 -1을 출력한다.
- 문자열을 찾을 수 있는 변수는 문자열만 사용이 가능하다.  리스트, 튜플, 딕셔너리 자료형에서는 find 함수를 사용할 수 없다.
- index함수는 찾는 문자가 없는 경우에 ValueError 에러가 발생한다.
- 문자열, 리스트, 튜플 자료형에서 사용 가능하고 딕셔너리 자료형에는 사용할 수 없어 AttributeError 에러가 발생한다.

```python
s = "banana"
print(s.find('a'))   # 1 (첫 위치)
print(s.find('z'))   # -1
print(s.index('b'))  # 0
# print(s.index('z'))  # ValueError
```

### abs

- 어떤 숫자를 입력받았을 때, 그 숫자의 절댓값을 돌려주는 함수이다.

```python
print(abs(-7))  # 7
```

### all(x)
 
- 반복 가능한(iterable) 자료형 x를 입력 인수로 받으며 이 x의 요소가 모두 참이면 True, 거짓이 하나라도 있으면 False를 돌려준다.
  - **반복 가능한 자료형**이란 for문으로 그 값을 출력할 수 있는 것을 의미한다. 리스트, 튜플, 문자열, 딕셔너리, 집합 등이 있다.

```python
print(all([1,2,3]))   # True
print(all([1,0,3]))   # False (0이 포함)
print(all([]))        # True (빈 iterable은 vacuously true)
```

### any(x)

- 반복 가능한(iterable) 자료형 x를 입력 인수로 받으며 이 x의 요소 중 하나라도 참이 있으면 True를 돌려주고, x가 모두 거짓일 때에만 False를 돌려준다.

```python
vals = [1,0,3]
print(all(vals))  # False
print(any(vals))  # True
```
  - all(x)의 반대이다.

### dir

- 객체가 자체적으로 가지고 있는 변수나 함수를 보여 준다.

```python
print(dir([])[:5])  # 리스트 일부 속성
```

### eval(expression)

- 실행 가능한 문자열(1+2, 'hi' + 'a' 같은 것)을 입력으로 받아 문자열을 실행한 결괏값을 돌려주는 함수이다.

```python
expr = "3*(2+1)"
print(eval(expr))  # 9
```

### map(function, iterable)

- map은 리스트의 요소를 지정된 함수로 처리해주는 함수
- 첫 번째 매개변수로는 함수가 오고 두 번째 매개변수로는 반복 가능한 자료형(리스트, 튜플 등)이 온다.
- map 함수의 반환 값은 map객체 이기 때문에 해당 자료형을 list 혹은 tuple로 형 변환시켜주어야 한다.

```python
nums = ["1","2","3"]
ints = list(map(int, nums))
print(ints)
```
  
### filter(f, iterable)

- 첫 번째 인수로 함수 이름을, 두 번째 인수로 그 함수에 차례로 들어갈 반복 가능한 자료형을 받는다. 그리고 두 번째 인수인 반복 가능한 자료형 요소가 첫 번째 인수인 함수에 입력되었을 때 반환 값이 참인 것만 묶어서(걸러 내서) 돌려준다.
- 앞의 함수는 lambda를 사용하면 더욱 간편하게 코드를 작성할 수 있다.

```python
nums = [1,2,3,4,5]
even = list(filter(lambda x: x%2==0, nums))
print(even)  # [2,4]
```

### lambda 매개변수 : 표현식

- 함수표현식

```python
square = lambda x: x*x
print(square(5))  # 25
```

### len(s)

- 입력값 s의 길이(요소의 전체 개수)를 돌려주는 함수이다.

```python
print(len([1,2,3]))  # 3
```

### oct(x)

- 정수 형태의 숫자를 8진수 문자열로 바꾸어 돌려주는 함수이다.
  - all(x)의 반대이다.

```python
vals = [1,0,3]
print(any(vals))        # True
print(any([0,0,0]))     # False
print(any([]))          # False
```
- 정수 값을 입력받아 16진수(hexadecimal)로 변환하여 돌려주는 함수이다.

```python
print(hex(255))  # 0xff
```

### open(filename, [mode])

- "파일 이름"과 "읽기 방법"을 입력받아 파일 객체를 돌려주는 함수이다.

```python
# with open('data.txt','r') as f:
#     for line in f:
#         print(line.rstrip())
```

### range

- 이 함수는 입력받은 숫자에 해당하는 범위 값을 반복 가능한 객체로 만들어 돌려준다.

```python
for i in range(2, 7, 2):
  print(i)  # 2 4 6
```

### round(number, ndigits)

- 숫자를 입력받아 반올림해 주는 함수이다.

```python
print(round(3.14159, 2))  # 3.14
```

### str(object)

- 문자열 형태로 객체를 변환하여 돌려주는 함수이다.

```python
print(str(123) + "4")  # 1234
```

### upper()

- 문자열 대문자로 변경하는 함수

```python
print("abC".upper())  # ABC
```

### lower()

- 문자열 소문자로 변경하는 함수

```python
print("ABc".lower())  # abc
```

### capitalize()

- 주어진 문자열에서 맨 첫 글자를 대문자로 변환해줌.

```python
print("hello world".capitalize())  # Hello world
```

### print()

- 결과물 출력
- 긴 문자열일 경우 `\`을 사용하여 여러 줄에 작성 가능
- **end=** : print에서 마지막 변경 (default = enter)
- **sep=** : 지정된 기호에 따라 문자열을 구분

```python
print(1,2,3, sep='-')      # 1-2-3
print("끝", end='!')
```

### *args

- 여러 개의 인자를 함수로 받고자 할 때
- arguments의 줄임말 (꼭 이 단어를 쓸 필요는 없다.)
- 여러 개의 인자로 함수를 호출할 경우, 내부에서는 튜플로 받은 것처럼 인식

```python
def plus(*nums):
    sum=0
    for num in nums:
        sum+=num
    return sum

print(plus(1+2+3)) # 6
print(plus(1+2+3+2+1+4)) # 13
```

### **kwargs

- `(키워드 = 특정 값)` 형태로 함수를 호출
- keyword argument의 줄임말
- 딕셔너리 형태로 `{'키워드':'특정 값'}` 함수 내부로 전달

```python
def call_member(**infos):
    for key, val in infos.items():
        print(f'이름: {key}\n나이: {val}\n')

call_member(홍길동=23, 미나=27, 나나=22)

# 결과

# 이름: 홍길동
# 나이: 23

# 이름: 미나
# 나이: 27

# 이름: 나나
# 나이: 22
```

### permutations

- **permutations**는 리스트와 같은 iterable 객체에서 r개의 데이터를 뽑아 일렬로 나열하는 모든 경우(순열)을 계산해준다.
- **코드**

  ```python
  from itertools import permutations

  data = ['A', 'B', 'C']
  result = list(permutations(data, 3))

  print(result)
  # [('A', 'B', 'C'), ('A', 'C', 'B'), ('B', 'A', 'C'), ('B', 'C', 'A'), ('C', 'A', 'B'), ('C', 'B', 'A')]
  ```

### combinations

- **combinations**는 리스트와 같은 iterable 객체에서 r개의 데이터를 뽑아 순서를 고려하지 않고 나열하는 모든 경우(조합)을 계산한다.
- **코드**

  ```python
  from itertools import combinations

  data = ['A', 'B', 'C']
  result = list(combinations(data, 2))

  print(result)
  # [('A', 'B'), ('A', 'C'), ('B', 'C')]
  ```

## 알고리즘 필수 추가 문법/패턴 정리

### 1. 컴프리헨션 & 표현식

- 리스트: `[f(x) for x in it if cond]`
- 딕셔너리: `{k: v for k, v in pairs}`
- 집합: `{f(x) for x in it}` (중복 제거)
- 중첩: `[(i, j) for i in range(n) for j in range(m)]`
- 제너레이터: `(x*x for x in it)` (지연 평가, 메모리 절약)

```python
nums = [1,2,3,4]
sq = [x*x for x in nums if x%2]
dic = {c: ord(c) for c in 'ab'}
st = {x%3 for x in nums}
gen = (x*x for x in range(3))
print(sq, dic, st, next(gen))
```

### 2. 슬라이싱 & 언패킹

- 슬라이스: `a[l:r:step]`, 역순 `a[::-1]`
- 다중 언패킹: `a,b,*rest = arr`, 마지막만: `*_, last = arr`
- 2차원 초기화: `grid = [[0]*m for _ in range(n)]` (얕은 복사 방지)

```python
arr = [0,1,2,3,4]
print(arr[1:4:2])  # [1,3]
a,b,*rest = arr
*_, last = arr
print(a,b,rest,last)
```

### 3. 주요 표준 자료구조 (collections / heapq / bisect)

- deque: O(1) 양끝 삽입/삭제 → BFS, 슬라이딩 윈도우
- Counter: 빈도/다중집합 연산 (`+ - & |`)
- defaultdict(list/int): 그래프, 누적 카운트
- OrderedDict: LRU 구현 (Py3.7+ dict insertion order 보존이지만 move_to_end 유용)
- heapq: 최소 힙, 최대 힙은 `(-값, 원본)` 패턴
- bisect_left/right: 정렬 리스트에서 lower/upper bound

```python
from collections import deque, Counter, defaultdict
import heapq, bisect
dq = deque([1,2]); dq.appendleft(0); dq.append(3)
print(dq)
cnt = Counter("ababc")
print(cnt.most_common(1))
g = defaultdict(list); g[1].append(2)
nums = [1,3,5,7]
print(bisect.bisect_left(nums,4))  # 2
max_heap = []
for x in [3,1,5]:
  heapq.heappush(max_heap, -x)
print(-heapq.heappop(max_heap))  # 5
```

### 4. itertools 고급

- `product`, `permutations`, `combinations`, `combinations_with_replacement`
- `accumulate` (prefix sum / prefix max)
- `groupby` (정렬된 키 구간 묶기)
- `chain`, `islice`

```python
from itertools import product, accumulate, groupby
print(list(product([1,2],[3,4])))
print(list(accumulate([1,2,3])))  # 누적합
data = sorted(['aa','ab','ba'], key=lambda x:x[0])
for k, grp in groupby(data, key=lambda x:x[0]):
  print(k, list(grp))
```

### 5. 수학/숫자 유틸

- `math.gcd`, `math.lcm`, `math.isqrt`, `math.comb`, `math.perm`
- 모듈러 거듭제곱: `pow(a, b, mod)` O(log b)
- 음수 %: 파이썬은 결과 0 이상 → 필요 시 `(x % mod + mod) % mod`

```python
import math
print(math.gcd(12,18))
print(pow(2,10,1000))  # 2^10 mod 1000
print((-3)%5, ( (-3)%5 +5)%5)
```

### 6. 문자열 처리

- 빠른 결합: `''.join(parts)`
- 패턴 검사: `s.isalpha()`, `s.isdigit()`, `s.islower()`
- 접두/접미: `s.startswith(p)`, `s.endswith(p)`
- 다중 정렬 키: `sorted(words, key=lambda w: (len(w), w))`

```python
parts = ['a','b','c']
print(''.join(parts))
s = 'Hello.py'
print(s.endswith('.py'))
```

### 7. 정렬 & 커스텀 우선순위

- 안정 정렬(Timsort) → (len, 값) 같이 다단계 정렬
- `heapq.nsmallest(k, arr)` / `nlargest` 부분 선별
- `functools.cmp_to_key`로 비교 함수 래핑

```python
from functools import cmp_to_key
arr = ["10","2","9"]
def cmp(a,b):  # 내림차순 숫자 크기
  return (int(b) - int(a))
print(sorted(arr, key=cmp_to_key(cmp)))
```

### 8. 시간 복잡도 팁

- 리스트 `pop(0)` 지양 → deque 사용
- `in` : list O(n), set/dict 평균 O(1)
- 깊은 복사 필요한 경우만 `copy.deepcopy` (비싸다)

```python
from collections import deque
import time
lst = list(range(20000))
start = time.time(); lst.pop(0); t1 = time.time()-start
dq = deque(range(20000))
start = time.time(); dq.popleft(); t2 = time.time()-start
print(t1 > t2)  # 보통 True (deque가 빠름)
```

### 9. 그래프 기본 패턴 (BFS)

```python
from collections import deque, defaultdict
g = defaultdict(list)
for u, v in edges:
  g[u].append(v)

def bfs(start):
  dist = {start: 0}
  q = deque([start])
  while q:
    x = q.popleft()
    for nx in g[x]:
      if nx not in dist:
        dist[nx] = dist[x] + 1
        q.append(nx)
  return dist
```

### 10. DFS & 재귀 한도

```python
import sys
sys.setrecursionlimit(10**6)

def dfs(x):
  seen.add(x)
  for nx in g[x]:
 
```python
print(oct(64))  # 0o100
```

### hex(x)

- 정수 값을 입력받아 16진수(hexadecimal)로 변환하여 돌려주는 함수이다.

```python
print(hex(255))  # 0xff
```

- 바텀업: rolling array / 1D 최적화 사용

### 12. 우선순위 큐 (Dijkstra)

```python
import heapq
INF = 10**18
dist = [INF]*n
dist[src] = 0
h = [(0, src)]
while h:
  d, u = heapq.heappop(h)
  if d != dist[u]:
    continue
  for v, w in graph[u]:
    nd = d + w
    if nd < dist[v]:
      dist[v] = nd
      heapq.heappush(h, (nd, v))
```

### 13. 이진 탐색 패턴

```python
def lower_bound(a, target):
  l, r = 0, len(a)
  while l < r:
    m = (l + r)//2
    if a[m] < target:
      l = m + 1
    else:
      r = m
  return l
```

또는 `bisect_left(a, target)` 사용

### 14. 슬라이딩 윈도우 / 투 포인터

```python
def min_len_subarray(arr, target):
  s = 0; left = 0; INF = 10**9
  ans = INF
  for right, val in enumerate(arr):
    s += val
    while s >= target:
      ans = min(ans, right - left + 1)
      s -= arr[left]
      left += 1
  return ans if ans < INF else -1
```

### 15. 비트 연산

- 마스크 생성 `(1<<k)` / 켜기 `mask | (1<<i)` / 끄기 `mask & ~(1<<i)` / 토글 `mask ^ (1<<i)` / 테스트 `(mask >> i) & 1`
- 부분집합 열거: `for s in range(1<<n): ...`

```python
n = 3
for mask in range(1<<n):
  subset = [i for i in range(n) if (mask>>i)&1]
  # print(mask, subset)
```

### 16. 기타 실전 팁

- 빠른 입력: `sys.stdin.readline().rstrip()`
- 출력 누적 후 일괄 출력: `'\n'.join(out)`
- MOD 연산 중간 반영: `(a + b) % MOD`, 음수 방지 `(x % MOD + MOD) % MOD`
- 정렬 키 분리: `from operator import itemgetter` → `sorted(a, key=itemgetter(1,0))`
- 데이터 클래스 노드 정의: `from dataclasses import dataclass`

```python
from dataclasses import dataclass
@dataclass
class Node:
  id: int
  w: int
print(Node(1,5))
```

위 항목들을 익혀두면 대부분 코딩 테스트에서 시간/메모리/구현 실수를 크게 줄일 수 있다.

## References

- [[개발자 지망생]](https://blockdmask.tistory.com/531 )
- [코딩도장 - 22.6 리스트에 map 사용하기](https://dojang.io/mod/page/view.php?id=2286)
- [점프 투 파이썬](https://wikidocs.net/25)
- [python.org](https://docs.python.org/ko/3/library/string.html)
- [[파이썬] 내장 함수 zip 사용법 - daleseo](https://www.daleseo.com/python-zip/)
- [22. 자연어 처리하기 1](https://codetorial.net/tensorflow/natural_language_processing_in_tensorflow_01.html)
- [12. 고양이와 개 이미지 분류하기](https://codetorial.net/tensorflow/classifying_the_cats_and_dogs.html)
- [파이썬 find( ), index( ) 비교 / 인덱스, 위치를 찾는 함수(Python)](https://ooyoung.tistory.com/78)
- [왕초보를 위한 Python: 쉽게 풀어 쓴 기초 문법과 실습](https://wikidocs.net/book/2)
