---
layout: single
title: "파이썬(python) 함수 기능에 대한 모든 것"
excerpt: "파이썬 내장 함수, 자료구조 메서드, 알고리즘 패턴을 실전 예제와 함께 정리한 완전 가이드. 코딩테스트 필수 함수부터 고급 활용법까지 체계적으로 학습한다."
tags: [python, 파이썬, 정의, 함수, 클래스, 인스턴스, 객체, self, __init__, args, kwargs, 리스트]
toc: true
toc_sticky: true
sidebar_main: false

mathjax: true
use_math: true

author_profile: true
last_modified_at: 2025-09-26
---

알고리즘 문제를 풀 때는 입력값의 자료형, 제약조건, 예상 출력 형태를 먼저 파악하는 습관이 중요하다. 본 문서는 실무와 코딩테스트에서 자주 사용하는 파이썬 함수들을 예제 중심으로 정리했다.
{: .notice--danger}

## 파이썬 핵심 개념

### class, object, instance

객체지향 프로그래밍의 핵심 개념을 이해하자.

- **클래스(class)**: 객체를 만들기 위한 설계도 또는 틀
  - 예: 붕어빵 틀
- **객체(object)**: 클래스로 만든 실체
  - 예: 틀로 찍어낸 붕어빵
- **인스턴스(instance)**: 특정 클래스로 만든 객체
  - 예: `Person` 클래스로 만든 `홍길동` 객체
- **self**: 클래스 내부에서 자기 자신(인스턴스)을 가리키는 키워드

**사용 흐름**: 클래스 정의 → 인스턴스 생성 (`객체 = 클래스()`) → 메서드 호출 (`객체.메서드()`)

![image](https://user-images.githubusercontent.com/78655692/152981730-f6e20f01-6dc4-4422-b708-981e7182231c.png)

- **\_\_init\_\_**: 생성자 메서드로, 객체 생성 시 자동 호출되어 초기값을 설정한다

```python
# 간단한 클래스와 인스턴스 예시
class Person:
  def __init__(self, name, age):  # 객체 생성 시 자동 호출
    self.name = name              # 인스턴스 변수 초기화
    self.age = age

  def hello(self):                # 인스턴스 메서드
    return f"안녕 나는 {self.name}, 나이는 {self.age}"

# 사용 예제
p = Person("홍길동", 20)          # 인스턴스 생성 (__init__ 자동 호출)
print(p.hello())                  # 메서드 호출: 안녕 나는 홍길동, 나이는 20
print(p.name)                     # 속성 접근: 홍길동
```

### inheritance, override, super

객체지향의 강력한 기능인 상속 관계를 이해하자.

- **상속(inheritance)**: 부모 클래스의 속성과 메서드를 자식 클래스가 물려받는 것
  - 코드 재사용성 증가, 계층 구조 표현
- **오버라이드(override)**: 부모 클래스의 메서드를 자식 클래스에서 재정의하는 것
  - 같은 이름의 메서드를 새로운 동작으로 대체
- **super()**: 자식 클래스에서 부모 클래스의 메서드를 호출할 때 사용
  - 부모의 기능을 유지하면서 확장 가능

**추가 개념**:
- **class**: 객체를 만들기 위한 청사진(설계도)
- **methods**: 클래스 내부에 정의된 함수 (객체의 동작)
- **attributes**: 클래스나 인스턴스가 가지는 데이터 (객체의 상태)
- **object**: 클래스를 통해 만들어진 실제 데이터 (인스턴스)
- **composition**: 다른 객체를 포함하여 복잡한 기능을 구현하는 방법

```python
# 상속 예제
class Animal:
  def sound(self):
    return "..."

class Dog(Animal):              # Dog는 Animal을 상속
  def sound(self):              # 메서드 오버라이드
    return "멍멍"

class GuideDog(Dog):            # GuideDog는 Dog를 상속
  def sound(self):
    base = super().sound()      # 부모(Dog)의 sound() 호출
    return base + " (안내견)"

# 실행 결과
print(Dog().sound())            # 멍멍
print(GuideDog().sound())       # 멍멍 (안내견)

# 상속 관계: Animal → Dog → GuideDog
# GuideDog는 Dog의 기능을 확장한 것
```

### input()

사용자로부터 데이터를 입력받는 기본 함수다.

**핵심 특징**:
- 모든 입력을 **문자열(str)** 타입으로 받는다
- 숫자 연산이 필요하면 `int()`, `float()` 등으로 형변환 필수
- 코딩테스트에서는 `map()`과 `split()`을 함께 자주 사용

```python
# 기본 사용
name = input()              # 입력: 홍길동
print(type(name))           # <class 'str'>

# 한 줄에서 정수 여러 개 받기
# 입력: 10 20 30
a, b, c = map(int, input().split())
print(a + b + c)            # 60

# 리스트로 받기
# 입력: 1 2 3 4 5
numbers = list(map(int, input().split()))
print(numbers)              # [1, 2, 3, 4, 5]
```

### split()

문자열을 특정 구분자로 나누어 리스트로 반환하는 메서드다.

**동작 원리**:
- 인자가 없으면 공백(스페이스, 탭, 엔터)을 기준으로 분리
- 연속된 공백은 하나로 취급 (자동 정리)
- 구분자를 지정하면 해당 문자로 정확히 분리

```python
# 공백 기준 분리
s = "red blue green"
words = s.split()
print(words)                # ['red', 'blue', 'green']

# 쉼표 기준 분리
s = "red,blue,green"
colors = s.split(',')
print(colors)               # ['red', 'blue', 'green']

# 콜론 기준 분리
time = "14:30:00"
parts = time.split(':')
print(parts)                # ['14', '30', '00']

# 실전 예제: 좌표 입력
# 입력: 3,5
x, y = map(int, input().split(','))
print(x, y)                 # 3 5
```

### 나눗셈 연산자

파이썬의 나눗셈 연산자는 용도에 따라 3가지로 구분된다.

**연산자 종류**:
- **`/`**: 일반 나눗셈 (실수 결과)
- **`//`**: 몫만 구하기 (정수 나눗셈, floor division)
- **`%`**: 나머지 구하기 (modulo 연산)

```python
a, b = 17, 5

print(a / b)      # 3.4 (실수 나눗셈)
print(a // b)     # 3   (몫)
print(a % b)      # 2   (나머지)

# 검증: 17 = 5 * 3 + 2
print(b * (a // b) + (a % b))  # 17

# 음수 나눗셈 주의
print(-17 // 5)   # -4 (내림)
print(-17 % 5)    # 3  (양수 나머지)
```

**divmod(a, b)**: 몫과 나머지를 동시에 구하는 내장 함수

- 반환값: `(몫, 나머지)` 튜플
- 두 값이 모두 필요할 때 효율적

```python
a, b = 17, 5
quotient, remainder = divmod(a, b)
print(quotient, remainder)  # 3 2

# 활용: 시간 계산
total_seconds = 3665
minutes, seconds = divmod(total_seconds, 60)
hours, minutes = divmod(minutes, 60)
print(f"{hours}:{minutes}:{seconds}")  # 1:1:5
```

**팁**: 특수문자 출력 시 `\` 앞에 붙여 이스케이프 처리
```python
print("경로: C:\\Users\\Documents")
print('작은따옴표 \' 출력')
```

### sys.stdin.readline()

대량의 입력을 받을 때 `input()`보다 **월등히 빠른** 함수다.

**사용 이유**:
- `input()`은 프롬프트 출력 등 부가 작업이 있어 느림
- 수만 줄 이상의 입력이 있을 때 시간 초과 방지
- 백준 온라인 저지 등 대량 입력 문제에 필수

**주의사항**:
- 개행 문자(`\n`)가 포함되므로 `rstrip()` 또는 `strip()` 필요
- 한 줄만 입력받을 때는 `input()`이 더 편리

```python
import sys

# 한 줄 입력 (개행 제거)
line = sys.stdin.readline().rstrip()

# 여러 정수 빠르게 받기
arr = list(map(int, sys.stdin.readline().split()))

# 여러 줄 입력 (N개의 줄)
n = int(sys.stdin.readline())
lines = [sys.stdin.readline().rstrip() for _ in range(n)]

# 전체 입력 한번에 읽기
# data = sys.stdin.read().splitlines()
```

**성능 비교** (10만 줄 입력):
- `input()`: 약 2초
- `sys.stdin.readline()`: 약 0.2초 (10배 빠름)

### index

리스트에서 특정 값의 **첫 번째 위치**를 찾는 메서드다.

**특징**:
- 찾는 값이 없으면 `ValueError` 발생
- 중복된 값이 있어도 가장 앞의 인덱스만 반환
- 시작/끝 범위 지정 가능: `list.index(x, start, end)`

```python
arr = [10, 20, 30, 20, 40]
print(arr.index(20))        # 1 (첫 번째 20의 위치)

# 범위 지정 검색
print(arr.index(20, 2))     # 3 (인덱스 2부터 검색)

# 존재 확인 후 사용 (안전)
if 50 in arr:
    idx = arr.index(50)
else:
    print("값이 없다")        # 값이 없다
```

### count

리스트에서 특정 값이 **몇 개** 있는지 세는 메서드다.

**특징**:
- 존재하지 않으면 0 반환
- 모든 iterable(list, tuple, str)에서 사용 가능
- O(n) 시간 복잡도 (전체 순회)

```python
arr = [1, 1, 2, 3, 1, 2]
print(arr.count(1))         # 3
print(arr.count(5))         # 0 (없으면 0)

# 문자열에서도 사용
text = "banana"
print(text.count('a'))      # 3
print(text.count('an'))     # 2 (부분 문자열도 가능)
```

### enumerate

iterable의 각 요소를 **(인덱스, 값)** 튜플로 묶어주는 내장 함수다.

**핵심 개념**:
- "열거하다(enumerate)"라는 뜻 그대로 순서를 매겨줌
- 반복문에서 인덱스와 값을 동시에 사용할 때 유용
- `start` 매개변수로 시작 번호 지정 가능 (기본값 0)

**일반적인 for문과 비교**:
```python
# 일반 방법 (비권장)
names = ["apple", "banana", "cherry"]
for i in range(len(names)):
    print(i, names[i])

# enumerate 사용 (권장)
for idx, name in enumerate(names):
    print(idx, name)
# 0 apple
# 1 banana
# 2 cherry
```

**실전 활용**:
```python
# 1부터 시작
scores = [85, 92, 78]
for rank, score in enumerate(scores, start=1):
    print(f"{rank}등: {score}점")
# 1등: 85점
# 2등: 92점
# 3등: 78점

# 특정 인덱스의 값 찾기
words = ["hello", "world", "python"]
for i, word in enumerate(words):
    if word == "python":
        print(f"'python'은 {i}번 인덱스")  # 'python'은 2번 인덱스

# 리스트로 변환
pairs = list(enumerate(["a", "b", "c"]))
print(pairs)  # [(0, 'a'), (1, 'b'), (2, 'c')]
```

### string.printable

**출력 가능한 모든 ASCII 문자**를 담고 있는 상수 문자열이다.

**구성 요소**:
- 숫자: `0123456789`
- 알파벳 소문자: `abcdefghijklmnopqrstuvwxyz`
- 알파벳 대문자: `ABCDEFGHIJKLMNOPQRSTUVWXYZ`
- 구두점: `!"#$%&'()*+,-./:;<=>?@[\]^_``{|}~`
- 공백 문자: 스페이스, 탭(`\t`), 개행(`\n`), 캐리지 리턴(`\r`), 폼 피드(`\f`), 수직 탭(`\v`)

**활용 예시**:
```python
import string

# 전체 출력 가능 문자 (100개)
print(len(string.printable))  # 100
print(string.printable[:20])  # 0123456789abcdefghij

# 문자가 출력 가능한지 확인
print('A' in string.printable)  # True
print('\x00' in string.printable)  # False (NULL 문자)

# 숫자만 추출 (다른 상수들도 있음)
print(string.digits)          # 0123456789
print(string.ascii_lowercase) # abcdefghijklmnopqrstuvwxyz
print(string.ascii_uppercase) # ABCDEFGHIJKLMNOPQRSTUVWXYZ
print(string.punctuation)     # !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
```

**실전 활용**:
```python
# 문자열에서 출력 가능한 문자만 필터링
text = "Hello\x00World\x01!"
clean = ''.join(c for c in text if c in string.printable)
print(clean)  # HelloWorld!
```

### zip(*iterable)

**여러 iterable을 병렬로 묶어주는** 내장 함수다.

**핵심 개념**:
- 여러 리스트의 **같은 위치** 요소들을 튜플로 묶어줌
- 길이가 다르면 **가장 짧은 것**에 맞춰 종료
- `*iterable`: 여러 개의 iterable을 인자로 받을 수 있음
- 반환값은 zip 객체 → `list()` 또는 `tuple()`로 변환

**기본 사용**:
```python
a = [1, 2, 3]
b = ['a', 'b', 'c']

# 병렬 순회
for x, y in zip(a, b):
    print(x, y)
# 1 a
# 2 b
# 3 c

# 리스트로 변환
pairs = list(zip(a, b))
print(pairs)  # [(1, 'a'), (2, 'b'), (3, 'c')]
```

**길이가 다를 때**:
```python
nums = [1, 2, 3, 4, 5]
chars = ['a', 'b', 'c']

result = list(zip(nums, chars))
print(result)  # [(1, 'a'), (2, 'b'), (3, 'c')]
# 4, 5는 버려짐
```

**실전 활용**:
```python
# 두 리스트를 딕셔너리로 변환
keys = ['name', 'age', 'city']
values = ['홍길동', 25, '서울']
person = dict(zip(keys, values))
print(person)  # {'name': '홍길동', 'age': 25, 'city': '서울'}

# 행렬 전치 (transpose)
matrix = [
    [1, 2, 3],
    [4, 5, 6]
]
transposed = list(zip(*matrix))
print(transposed)  # [(1, 4), (2, 5), (3, 6)]

# 여러 리스트 동시 순회
names = ['김', '이', '박']
ages = [20, 30, 40]
cities = ['서울', '부산', '대구']

for name, age, city in zip(names, ages, cities):
    print(f"{name}({age}) - {city}")
# 김(20) - 서울
# 이(30) - 부산
# 박(40) - 대구
```

**언패킹 활용** (`*` 연산자):
```python
pairs = [(1, 'a'), (2, 'b'), (3, 'c')]
nums, chars = zip(*pairs)  # 언패킹 후 다시 묶기
print(nums)   # (1, 2, 3)
print(chars)  # ('a', 'b', 'c')
```

### set

**중복을 허용하지 않는 집합** 자료구조다.

**핵심 특징**:
- **중복 불가**: 같은 값이 여러 번 추가되어도 하나만 유지
- **순서 없음(Unordered)**: 인덱스 접근 불가 (`set[0]` ❌)
- **빠른 검색**: `in` 연산이 O(1) 평균 시간 (리스트는 O(n))
- **수학적 집합 연산** 지원: 합집합, 교집합, 차집합 등

**생성 방법**:
```python
# 빈 집합
s = set()             # {} 는 빈 딕셔너리

# 값이 있는 집합
s = {1, 2, 3}
s = set([1, 2, 2, 3]) # 리스트 → 집합 (중복 제거)
print(s)              # {1, 2, 3}
```

**주요 연산**:
```python
s = {1, 2, 3}

# 추가 / 제거
s.add(4)              # {1, 2, 3, 4}
s.remove(2)           # {1, 3, 4} (없으면 KeyError)
s.discard(2)          # 에러 없이 제거 (없어도 OK)

# 존재 확인 (빠름!)
print(2 in s)         # False
print(3 in s)         # True
```

**집합 연산** (코딩테스트 필수):
```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

# 합집합 (union)
print(a | b)          # {1, 2, 3, 4, 5, 6}
print(a.union(b))     # 동일

# 교집합 (intersection)
print(a & b)          # {3, 4}
print(a.intersection(b))

# 차집합 (difference)
print(a - b)          # {1, 2}
print(b - a)          # {5, 6}

# 대칭 차집합 (symmetric difference)
print(a ^ b)          # {1, 2, 5, 6}
```

**실전 활용**:
```python
# 중복 제거
arr = [1, 2, 2, 3, 3, 3]
uniq = list(set(arr))
print(uniq)           # [1, 2, 3] (순서 보장 안됨)

# 순서 유지하며 중복 제거
seen = set()
result = []
for x in arr:
    if x not in seen:
        seen.add(x)
        result.append(x)
print(result)         # [1, 2, 3]

# 두 리스트의 공통 원소
list1 = [1, 2, 3, 4]
list2 = [3, 4, 5, 6]
common = list(set(list1) & set(list2))
print(common)         # [3, 4]
```

**주의사항**:
- 리스트, 딕셔너리 등 **가변 객체는 원소로 불가**
- 정렬이 필요하면 `sorted(set_obj)`로 변환

### f-string

Python 3.6+에서 도입된 **가장 직관적이고 빠른** 문자열 포맷팅 방법이다.

**기본 문법**: `f"문자열 {변수}"`
- 문자열 앞에 `f` 또는 `F`를 붙임
- 중괄호 `{}` 안에 변수나 표현식을 직접 작성

**기본 사용**:
```python
name = "홍길동"
age = 25
score = 91.236

# 기본 출력
print(f"{name}의 나이는 {age}살")  # 홍길동의 나이는 25살

# 표현식 사용
print(f"내년 나이: {age + 1}")      # 내년 나이: 26

# 소수점 자리수 지정
print(f"점수: {score:.1f}")         # 점수: 91.2
print(f"점수: {score:.2f}")         # 점수: 91.24
```

**다양한 포맷 지정자**:
```python
num = 42

print(f"{num:05d}")    # 00042 (5자리, 0으로 채움)
print(f"{num:>10}")    # "        42" (오른쪽 정렬, 10자리)
print(f"{num:<10}")    # "42        " (왼쪽 정렬)
print(f"{num:^10}")    # "    42    " (가운데 정렬)

# 진법 변환
print(f"{num:b}")      # 101010 (2진수)
print(f"{num:o}")      # 52 (8진수)
print(f"{num:x}")      # 2a (16진수)
print(f"{num:#x}")     # 0x2a (접두사 포함)

# 천 단위 구분
big_num = 1234567
print(f"{big_num:,}")  # 1,234,567
```

**실전 활용**:
```python
# 디버깅: 변수명과 값 동시 출력
x = 10
y = 20
print(f"{x=}, {y=}, {x+y=}")  # x=10, y=20, x+y=30

# 딕셔너리
person = {"name": "김철수", "age": 30}
print(f"{person['name']}는 {person['age']}살")

# 리스트
scores = [85, 92, 78]
print(f"평균: {sum(scores)/len(scores):.2f}")  # 평균: 85.00

# 여러 줄 문자열
message = f"""
이름: {name}
나이: {age}
점수: {score:.1f}
"""
print(message)
```

**이전 방식과 비교**:
```python
name = "홍길동"
score = 91.236

# % 포맷팅 (구식)
print("%s: %.1f" % (name, score))

# str.format() (중간)
print("{}: {:.1f}".format(name, score))

# f-string (최신, 권장)
print(f"{name}: {score:.1f}")  # 가장 빠르고 읽기 쉬움
```

### add

집합(set)에 요소를 **추가**하는 메서드다.

**기본 사용**:
```python
s = {1, 2}
s.add(3)
print(s)           # {1, 2, 3}

# 중복 추가는 무시됨
s.add(2)
print(s)           # {1, 2, 3} (변화 없음)
```

**집합 연산**:
```python
a = {1, 2, 3}
b = {2, 3, 4}

# 차집합 (a에만 있는 요소)
print(a - b)       # {1}

# 합집합 (모든 요소)
print(a | b)       # {1, 2, 3, 4}

# 교집합 (공통 요소)
print(a & b)       # {2, 3}

# 대칭차집합 (한쪽에만 있는 요소)
print(a ^ b)       # {1, 4}
```

**실전 활용**:
```python
# 중복 없는 원소 수집
seen = set()
for num in [1, 2, 2, 3, 3, 3]:
    seen.add(num)
print(seen)        # {1, 2, 3}

# 조건에 맞는 원소 추가
valid = set()
for x in range(10):
    if x % 2 == 0:
        valid.add(x)
print(valid)       # {0, 2, 4, 6, 8}
```

### max(*args, key=None)

iterable 또는 여러 인자 중에서 **최댓값**을 반환하는 내장 함수다.

**핵심 개념**:
- 숫자, 문자열 등 비교 가능한 모든 객체에 사용 가능
- `key` 매개변수로 비교 기준 커스터마이징 가능
- 빈 iterable에 사용 시 `ValueError` 발생

**기본 사용**:
```python
# 여러 숫자 중 최댓값
print(max(1, 5, 3, 9, 2))     # 9

# 리스트에서 최댓값
nums = [10, 25, 5, 30, 15]
print(max(nums))              # 30

# 문자열 비교 (사전순)
print(max('a', 'z', 'k'))     # 'z'
words = ['apple', 'banana', 'cherry']
print(max(words))             # 'cherry' (사전순 최대)
```

**중요**: `max(val1, val2)`에서 두 값이 같으면 첫 번째 인자를 반환한다.
```python
a, b = 5, 5
result = max(a, b)
print(result is a)  # True (내부적으로 a를 반환)
```

**key 매개변수 활용** (코딩테스트 필수):
```python
# 문자열 길이 기준 최댓값
words = ['a', 'bbb', 'cc']
longest = max(words, key=len)
print(longest)                # 'bbb'

# 절댓값 기준 최댓값
nums = [-10, 5, -3, 8]
print(max(nums, key=abs))     # -10 (절댓값이 가장 큼)

# 튜플 리스트에서 특정 요소 기준
students = [('김', 85), ('이', 92), ('박', 78)]
top = max(students, key=lambda x: x[1])
print(top)                    # ('이', 92)

# 딕셔너리 값 기준 최댓값 키 찾기
scores = {'김': 85, '이': 92, '박': 78}
best = max(scores, key=lambda k: scores[k])
print(best)                   # '이'
# 또는
best_key = max(scores, key=scores.get)
print(best_key)               # '이'
```

**실전 활용**:
```python
# 2D 좌표에서 원점과 가장 먼 점 찾기
points = [(1, 2), (3, 4), (0, 5)]
farthest = max(points, key=lambda p: p[0]**2 + p[1]**2)
print(farthest)               # (0, 5)

# 가장 많이 등장한 원소 찾기
from collections import Counter
arr = [1, 2, 2, 3, 3, 3]
most_common = max(set(arr), key=arr.count)
print(most_common)            # 3
```

### min(*args, key=None)

iterable 또는 여러 인자 중에서 **최솟값**을 반환하는 내장 함수다.

**핵심 개념**:
- `max()`와 정확히 반대로 작동
- 동일한 `key` 매개변수 사용 가능
- 빈 iterable에 사용 시 `ValueError` 발생

**기본 사용**:
```python
# 여러 숫자 중 최솟값
print(min(1, 5, 3, 9, 2))     # 1

# 리스트에서 최솟값
nums = [10, 25, 5, 30, 15]
print(min(nums))              # 5

# 문자열 비교 (사전순)
print(min('a', 'z', 'k'))     # 'a'
words = ['apple', 'banana', 'cherry']
print(min(words))             # 'apple' (사전순 최소)
```

**중요**: `min(val1, val2)`에서 두 값이 같으면 첫 번째 인자를 반환한다.
```python
a, b = 5, 5
result = min(a, b)
print(result is a)  # True (내부적으로 a를 반환)
```

**key 매개변수 활용**:
```python
# 문자열 길이 기준 최솟값
words = ['abc', 'a', 'ab']
shortest = min(words, key=len)
print(shortest)               # 'a'

# 절댓값 기준 최솟값
nums = [-10, 5, -3, 8]
print(min(nums, key=abs))     # -3 (절댓값이 가장 작음)

# 튜플 리스트에서 특정 요소 기준
students = [('김', 85), ('이', 92), ('박', 78)]
lowest = min(students, key=lambda x: x[1])
print(lowest)                 # ('박', 78)

# 특정 값에 가장 가까운 수 찾기
target = 15
nums = [10, 13, 18, 20, 25]
closest = min(nums, key=lambda x: abs(x - target))
print(closest)                # 13
```

**실전 활용**:
```python
# 2D 좌표에서 원점과 가장 가까운 점 찾기
points = [(3, 4), (1, 1), (5, 2)]
nearest = min(points, key=lambda p: p[0]**2 + p[1]**2)
print(nearest)                # (1, 1)

# 가장 적게 등장한 원소 찾기
from collections import Counter
arr = [1, 1, 1, 2, 2, 3]
least_common = min(set(arr), key=arr.count)
print(least_common)           # 3

# 여러 조건 중 최소값 (다단계 비교)
students = [
    ('김', 85, 20),
    ('이', 85, 19),
    ('박', 90, 21)
]
# 점수 오름차순, 나이 오름차순
youngest_lowest = min(students, key=lambda x: (x[1], x[2]))
print(youngest_lowest)        # ('이', 85, 19)
```

### sorted(iterable, key=None, reverse=False)

iterable을 정렬하여 **새로운 리스트**로 반환하는 내장 함수다.

**핵심 개념**:
- 원본을 변경하지 않고 정렬된 **새 리스트** 생성
- `list.sort()`는 원본을 변경 (in-place)
- 모든 iterable(리스트, 튜플, 집합, 문자열 등) 가능

**기본 사용**:
```python
# 리스트 정렬
nums = [3, 1, 4, 1, 5]
sorted_nums = sorted(nums)
print(sorted_nums)    # [1, 1, 3, 4, 5]
print(nums)           # [3, 1, 4, 1, 5] (원본 유지)

# 내림차순
desc = sorted(nums, reverse=True)
print(desc)           # [5, 4, 3, 1, 1]

# 집합 정렬 (자동으로 리스트 반환)
s = {5, 1, 4, 2, 3}
print(sorted(s))      # [1, 2, 3, 4, 5]

# 문자열 정렬 (리스트로 반환)
print(sorted("dcba")) # ['a', 'b', 'c', 'd']
```

**key 매개변수** (핵심!):
```python
# 길이 기준 정렬
words = ["bbb", "a", "cc"]
print(sorted(words, key=len))  # ['a', 'cc', 'bbb']

# 절댓값 기준 정렬
nums = [-5, 2, -3, 1, -1]
print(sorted(nums, key=abs))   # [1, -1, 2, -3, -5]

# 대소문자 무시 정렬
names = ["Bob", "alice", "CHARLIE"]
print(sorted(names, key=str.lower))  # ['alice', 'Bob', 'CHARLIE']
```

**다단계 정렬** (튜플 key):
```python
# 길이 우선, 같으면 사전순
words = ["apple", "pie", "banana", "cat"]
result = sorted(words, key=lambda w: (len(w), w))
print(result)  # ['cat', 'pie', 'apple', 'banana']

# 튜플 리스트 정렬
students = [('김', 85), ('이', 90), ('박', 85)]

# 점수 기준
by_score = sorted(students, key=lambda x: x[1])
print(by_score)  # [('김', 85), ('박', 85), ('이', 90)]

# 점수 내림차순, 이름 오름차순
custom = sorted(students, key=lambda x: (-x[1], x[0]))
print(custom)    # [('이', 90), ('김', 85), ('박', 85)]
```

**딕셔너리 정렬**:
```python
scores = {'kim': 90, 'lee': 85, 'park': 95}

# 키 기준
print(sorted(scores))  # ['kim', 'lee', 'park']

# 값 기준
sorted_items = sorted(scores.items(), key=lambda x: x[1])
print(sorted_items)    # [('lee', 85), ('kim', 90), ('park', 95)]

# 값 기준 딕셔너리 (Python 3.7+)
sorted_dict = dict(sorted(scores.items(), key=lambda x: x[1]))
print(sorted_dict)     # {'lee': 85, 'kim': 90, 'park': 95}
```

**실전 패턴**:
```python
# 2차원 배열 정렬
points = [(1, 5), (3, 2), (2, 8), (1, 3)]

# x좌표 우선, y좌표 보조
sorted_points = sorted(points)  # 튜플은 자동 다단계
print(sorted_points)  # [(1, 3), (1, 5), (2, 8), (3, 2)]

# y좌표 기준 내림차순
by_y = sorted(points, key=lambda p: -p[1])
print(by_y)           # [(2, 8), (1, 5), (1, 3), (3, 2)]

# 코딩테스트: 빈도순 정렬
from collections import Counter
arr = [1, 1, 2, 2, 2, 3]
cnt = Counter(arr)
# 빈도 내림차순, 값 오름차순
result = sorted(arr, key=lambda x: (-cnt[x], x))
print(result)  # [2, 2, 2, 1, 1, 3]
```

**sort() vs sorted() 비교**:
```python
nums = [3, 1, 2]

# sort(): 원본 변경, 반환값 None
nums.sort()
print(nums)  # [1, 2, 3]

# sorted(): 원본 유지, 새 리스트 반환
nums = [3, 1, 2]
new = sorted(nums)
print(nums)  # [3, 1, 2]
print(new)   # [1, 2, 3]
```

## 리스트(List) 주요 메서드

리스트는 파이썬에서 가장 많이 사용하는 **가변(mutable) 자료구조**다. 순서가 있고 중복을 허용하며, 다양한 메서드로 데이터를 조작할 수 있다.

### 인덱스 접근 및 수정

**기본 사용**:
```python
arr = [10, 20, 30]

# 읽기
print(arr[0])      # 10 (첫 번째)
print(arr[-1])     # 30 (마지막)

# 수정
arr[1] = 25
print(arr)         # [10, 25, 30]

# 슬라이싱
print(arr[0:2])    # [10, 25]
print(arr[::-1])   # [30, 25, 10] (역순)
```

### append(x) - 끝에 추가

리스트 **끝**에 요소를 추가한다. (O(1) 시간 복잡도)

```python
arr = [1, 2]
arr.append(3)
print(arr)         # [1, 2, 3]

# 여러 개 추가할 때는 반복문
for i in range(4, 7):
    arr.append(i)
print(arr)         # [1, 2, 3, 4, 5, 6]
```

### insert(index, x) - 특정 위치에 삽입

지정한 인덱스에 요소를 삽입한다. (O(n) 시간 복잡도 - 뒤 요소들 이동)

```python
arr = [1, 3, 4]
arr.insert(1, 2)   # 인덱스 1에 2 삽입
print(arr)         # [1, 2, 3, 4]

# 맨 앞에 삽입
arr.insert(0, 0)
print(arr)         # [0, 1, 2, 3, 4]
```

**주의**: 빈번한 `insert(0, x)`는 느리므로 `collections.deque.appendleft()` 사용 권장

### remove(x) - 값으로 제거

**첫 번째로 나타나는** 값을 제거한다. (O(n) 시간 복잡도)

```python
arr = [1, 2, 2, 3]
arr.remove(2)      # 첫 번째 2만 제거
print(arr)         # [1, 2, 3]

# 존재하지 않으면 ValueError
# arr.remove(5)    # ValueError
```

**안전한 사용**:
```python
if 2 in arr:
    arr.remove(2)
```

### pop(index=-1) - 제거 후 반환

지정한 인덱스의 요소를 **제거하고 반환**한다. (기본값은 마지막)

```python
arr = [1, 2, 3]
val = arr.pop()    # 마지막 제거
print(val, arr)    # 3 [1, 2]

# 특정 위치 제거
val = arr.pop(0)   # 첫 번째 제거
print(val, arr)    # 1 [2]
```

**스택 구현**:
```python
stack = []
stack.append(1)    # push
stack.append(2)
print(stack.pop()) # 2 (LIFO)
```

### extend(iterable) - 리스트 병합

다른 iterable의 **모든 요소**를 끝에 추가한다.

```python
a = [1, 2]
b = [3, 4]
a.extend(b)
print(a)           # [1, 2, 3, 4]

# + 연산자와 차이
c = [1, 2] + [3, 4]  # 새 리스트 생성
print(c)             # [1, 2, 3, 4]
```

**append vs extend**:
```python
arr = [1, 2]
arr.append([3, 4])   # 리스트 자체를 추가
print(arr)           # [1, 2, [3, 4]]

arr = [1, 2]
arr.extend([3, 4])   # 요소들을 풀어서 추가
print(arr)           # [1, 2, 3, 4]
```

### reverse() - 역순 정렬

리스트를 **제자리에서(in-place)** 역순으로 뒤집는다.

```python
arr = [1, 2, 3]
arr.reverse()
print(arr)         # [3, 2, 1]

# 슬라이싱은 새 리스트 생성
arr2 = [1, 2, 3]
rev = arr2[::-1]
print(arr2, rev)   # [1, 2, 3] [3, 2, 1]
```

### clear() - 전체 삭제

리스트의 모든 요소를 제거한다.

```python
arr = [1, 2, 3]
arr.clear()
print(arr)         # []

# del arr[:] 와 동일
```

### copy() - 얕은 복사

리스트의 **얕은 복사본**을 생성한다.

```python
arr = [1, 2, 3]
arr2 = arr.copy()
arr2[0] = 10
print(arr, arr2)   # [1, 2, 3] [10, 2, 3]

# 2차원은 주의 (중첩 리스트는 참조 유지)
matrix = [[1, 2], [3, 4]]
mat2 = matrix.copy()
mat2[0][0] = 99
print(matrix)      # [[99, 2], [3, 4]] (영향 있음!)

# 깊은 복사 필요 시
import copy
mat3 = copy.deepcopy(matrix)
```

### 리스트 메서드 종합 예제

```python
# 코딩테스트 패턴
arr = []
arr.append(5)      # [5]
arr.insert(0, 3)   # [3, 5]
arr.extend([7, 9]) # [3, 5, 7, 9]
arr.remove(5)      # [3, 7, 9]
val = arr.pop(1)   # val=7, arr=[3, 9]
arr.reverse()      # [9, 3]
print(arr)         # [9, 3]
```

### ord(c) - 문자 → ASCII 코드

**문자 하나**를 받아 해당하는 **ASCII 코드값**(정수)을 반환하는 함수다.

**핵심 ASCII 코드**:
- 숫자 '0'~'9': 48~57
- 대문자 'A'~'Z': 65~90
- 소문자 'a'~'z': 97~122
- 공백 ' ': 32

```python
print(ord('A'))    # 65
print(ord('a'))    # 97
print(ord('0'))    # 48
print(ord(' '))    # 32

# 대소문자 차이
print(ord('a') - ord('A'))  # 32
```

**실전 활용**:
```python
# 알파벳 순서 계산
char = 'C'
position = ord(char) - ord('A') + 1
print(f"{char}는 {position}번째 알파벳")  # C는 3번째 알파벳

# 시저 암호 (암호화)
def caesar_cipher(text, shift):
    result = []
    for c in text:
        if c.isalpha():
            base = ord('A') if c.isupper() else ord('a')
            shifted = (ord(c) - base + shift) % 26
            result.append(chr(base + shifted))
        else:
            result.append(c)
    return ''.join(result)

print(caesar_cipher("ABC xyz", 3))  # DEF abc

# 문자 비교
print(ord('b') > ord('a'))  # True (98 > 97)
```

### chr(i) - ASCII 코드 → 문자

**ASCII 코드값**(정수)을 받아 해당하는 **문자**를 반환하는 함수다.

**기본 사용**:
```python
print(chr(65))     # A
print(chr(97))     # a
print(chr(48))     # 0
print(chr(32))     # (공백)

# 범위 생성
lowercase = [chr(i) for i in range(ord('a'), ord('z') + 1)]
print(lowercase)   # ['a', 'b', ..., 'z']
```

**실전 활용**:
```python
# 알파벳 생성
alphabet = [chr(i) for i in range(65, 91)]     # A-Z
print(''.join(alphabet))  # ABCDEFGHIJKLMNOPQRSTUVWXYZ

# 인덱스 → 문자 변환
index = 2
char = chr(ord('a') + index)
print(char)        # c (a=0, b=1, c=2)

# 아스키 아트
for i in range(5):
    print(chr(65 + i) * (i + 1))
# A
# BB
# CCC
# DDDD
# EEEEE
```

**ord와 chr 조합 패턴**:
```python
# 대소문자 변환 (직접 구현)
def to_upper(c):
    if 'a' <= c <= 'z':
        return chr(ord(c) - 32)
    return c

def to_lower(c):
    if 'A' <= c <= 'Z':
        return chr(ord(c) + 32)
    return c

print(to_upper('a'))  # A
print(to_lower('Z'))  # z

# 문자 시프트
def shift_char(c, n):
    """문자를 n칸 이동"""
    if c.isalpha():
        base = ord('A') if c.isupper() else ord('a')
        return chr((ord(c) - base + n) % 26 + base)
    return c

print(shift_char('A', 3))  # D
print(shift_char('z', 1))  # a (순환)
```

### str.find(sub) vs str.index(sub)

문자열에서 **부분 문자열의 위치**를 찾는 두 가지 메서드다.

**핵심 차이점**:
- **find**: 못 찾으면 **-1** 반환 (에러 없음)
- **index**: 못 찾으면 **ValueError** 발생

| 메서드 | 반환값 (성공) | 반환값 (실패) | 사용 가능 타입 |
|--------|-------------|--------------|--------------|
| `find()` | 인덱스 (int) | -1 | 문자열만 |
| `index()` | 인덱스 (int) | ValueError | 문자열, 리스트, 튜플 |

**기본 사용**:
```python
s = "banana"

# find: 안전 (에러 없음)
print(s.find('a'))     # 1 (첫 번째 'a')
print(s.find('na'))    # 2 (부분 문자열도 가능)
print(s.find('z'))     # -1 (없으면 -1)

# index: 에러 발생 가능
print(s.index('b'))    # 0
# print(s.index('z'))  # ValueError: substring not found
```

**범위 지정 검색**:
```python
s = "hello world hello"

# find(sub, start, end)
print(s.find('hello'))           # 0 (첫 번째)
print(s.find('hello', 1))        # 12 (인덱스 1부터 검색)
print(s.find('o', 5, 10))        # 7 (인덱스 5~10 구간)

# index도 동일한 인자 사용 가능
print(s.index('world'))          # 6
```

**실전 패턴**:
```python
# 1. 존재 여부 확인 (find 사용)
email = "user@example.com"
if email.find('@') != -1:
    print("유효한 이메일")
# 더 파이썬스러운 방법: 'in' 사용
if '@' in email:
    print("유효한 이메일")

# 2. 모든 위치 찾기
text = "apple banana apple cherry apple"
word = "apple"
positions = []
start = 0
while True:
    pos = text.find(word, start)
    if pos == -1:
        break
    positions.append(pos)
    start = pos + 1
print(positions)  # [0, 13, 27]

# 3. 마지막 등장 위치 (rfind)
s = "hello world hello"
print(s.rfind('hello'))   # 12 (뒤에서부터 검색)
print(s.rindex('hello'))  # 12 (rindex도 있음)
```

**안전한 사용 패턴**:
```python
s = "banana"

# find - 바로 사용 가능
pos = s.find('z')
if pos != -1:
    print(f"찾음: {pos}")
else:
    print("없음")

# index - try-except 필요
try:
    pos = s.index('z')
    print(f"찾음: {pos}")
except ValueError:
    print("없음")
```

**리스트/튜플에서의 index**:
```python
# 리스트: index 사용 가능, find 불가능
arr = [10, 20, 30, 20]
print(arr.index(20))     # 1 (첫 번째 20)
# arr.find(20)           # AttributeError (없는 메서드)

# 튜플도 동일
t = (1, 2, 3)
print(t.index(2))        # 1
```

**언제 어느 것을 사용할까?**:
- **find**: 존재 여부만 확인하고 싶을 때, 에러 처리가 번거로울 때
- **index**: 반드시 있어야 하는 값일 때, 없으면 에러로 처리하고 싶을 때
- **in 연산자**: 존재 여부만 확인 (가장 파이썬스러움)

### sum(iterable, start=0)

iterable의 모든 요소를 **합산**하여 반환하는 내장 함수다.

**핵심 개념**:
- 숫자 리스트/튜플의 합을 빠르게 계산
- `start` 매개변수로 초기값 지정 가능 (기본값 0)
- 문자열 연결에는 사용 불가 (`''.join()` 사용)

**기본 사용**:

```python
# 리스트 합
numbers = [1, 2, 3, 4, 5]
print(sum(numbers))           # 15

# 튜플 합
scores = (85, 90, 78, 92)
print(sum(scores))            # 345

# 초기값 지정
print(sum([1, 2, 3], 10))     # 16 (10 + 1 + 2 + 3)

# 빈 리스트
print(sum([]))                # 0
print(sum([], 100))           # 100
```

**실전 활용**:

```python
# 평균 계산
scores = [85, 90, 78, 92, 88]
average = sum(scores) / len(scores)
print(average)                # 86.6

# 조건부 합계
numbers = [1, -2, 3, -4, 5]
positive_sum = sum(n for n in numbers if n > 0)
print(positive_sum)           # 9

# 2D 리스트 전체 합
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
total = sum(sum(row) for row in matrix)
print(total)                  # 45

# 딕셔너리 값 합계
prices = {'apple': 1000, 'banana': 500, 'orange': 800}
total_price = sum(prices.values())
print(total_price)            # 2300

# 특정 조건의 개수 세기 (True=1, False=0)
numbers = [1, 2, 3, 4, 5, 6]
even_count = sum(1 for n in numbers if n % 2 == 0)
print(even_count)             # 3
```

**주의사항**:

```python
# ❌ 문자열 연결에 사용 불가
# sum(['a', 'b', 'c'])  # TypeError

# ✅ join 사용
print(''.join(['a', 'b', 'c']))  # 'abc'

# ❌ 리스트 연결에도 비효율적
# sum([[1], [2], [3]], [])  # 동작은 하지만 느림

# ✅ chain이나 extend 사용
from itertools import chain
result = list(chain(*[[1], [2], [3]]))
```

### bin(x), oct(x), hex(x) - 진법 변환

**정수를 다양한 진법의 문자열로 변환**하는 내장 함수들이다.

**기본 사용**:

```python
num = 10

# 2진법 (binary)
print(bin(num))      # '0b1010'

# 8진법 (octal)
print(oct(num))      # '0o12'

# 16진법 (hexadecimal)
print(hex(num))      # '0xa'

# 접두사 제거
print(bin(num)[2:])  # '1010'
print(oct(num)[2:])  # '12'
print(hex(num)[2:])  # 'a'
```

**역변환** (문자열 → 정수):

```python
# int(문자열, 진법)
print(int('1010', 2))   # 10 (2진수)
print(int('12', 8))     # 10 (8진수)
print(int('a', 16))     # 10 (16진수)
print(int('0b1010', 2)) # 10 (접두사 포함)
```

**실전 활용**:

```python
# 2진수로 변환 후 비트 개수
n = 13  # 1101
bit_count = bin(n).count('1')
print(bit_count)        # 3개

# 16진수 색상 코드
r, g, b = 255, 100, 50
color = f"#{r:02x}{g:02x}{b:02x}"
print(color)            # '#ff6432'

# 비트마스킹 확인
permissions = 0b101  # 읽기(4) + 실행(1)
can_read = permissions & 0b100
can_write = permissions & 0b010
can_execute = permissions & 0b001
print(f"읽기: {bool(can_read)}, 쓰기: {bool(can_write)}, 실행: {bool(can_execute)}")
```

### reversed(sequence)

시퀀스를 **역순으로 순회**하는 iterator를 반환하는 내장 함수다.

**핵심 개념**:
- 원본을 변경하지 않음
- 메모리 효율적 (iterator 반환)
- `list.reverse()`는 원본을 직접 변경

**기본 사용**:

```python
# 리스트 역순
arr = [1, 2, 3, 4, 5]
for x in reversed(arr):
    print(x, end=' ')  # 5 4 3 2 1
print()

# 리스트로 변환
print(list(reversed(arr)))  # [5, 4, 3, 2, 1]

# 문자열 역순
text = "hello"
print(''.join(reversed(text)))  # "olleh"

# 튜플 역순
t = (1, 2, 3)
print(tuple(reversed(t)))       # (3, 2, 1)
```

**reverse() vs reversed() vs [::-1]**:

```python
arr = [1, 2, 3]

# 1. list.reverse() - 원본 변경, 반환값 None
arr.reverse()
print(arr)              # [3, 2, 1]

# 2. reversed() - 원본 유지, iterator 반환
arr = [1, 2, 3]
rev = list(reversed(arr))
print(arr, rev)         # [1, 2, 3] [3, 2, 1]

# 3. [::-1] - 원본 유지, 새 리스트 반환
arr = [1, 2, 3]
rev = arr[::-1]
print(arr, rev)         # [1, 2, 3] [3, 2, 1]
```

**실전 활용**:

```python
# 역순으로 enumerate
arr = ['a', 'b', 'c']
for i, val in enumerate(reversed(arr)):
    print(i, val)
# 0 c
# 1 b
# 2 a

# 문자열 팰린드롬 확인
def is_palindrome(s):
    return s == ''.join(reversed(s))

print(is_palindrome("radar"))  # True
print(is_palindrome("hello"))  # False
```

### type(object)

객체의 **타입(자료형)**을 반환하는 내장 함수다.

**기본 사용**:

```python
# 기본 타입 확인
print(type(10))         # <class 'int'>
print(type(3.14))       # <class 'float'>
print(type("hello"))    # <class 'str'>
print(type([1, 2]))     # <class 'list'>
print(type((1, 2)))     # <class 'tuple'>
print(type({1, 2}))     # <class 'set'>
print(type({'a': 1}))   # <class 'dict'>
print(type(True))       # <class 'bool'>
print(type(None))       # <class 'NoneType'>
```

**타입 비교**:

```python
x = 10

# 정확한 타입 비교
if type(x) == int:
    print("정수입니다")

# 상속 고려한 비교는 isinstance 사용
if isinstance(x, int):
    print("정수 또는 정수의 서브클래스")
```

**실전 활용**:

```python
# 타입별 처리
def process(data):
    if type(data) == list:
        return sum(data)
    elif type(data) == str:
        return len(data)
    elif type(data) == dict:
        return len(data.keys())
    else:
        return None

print(process([1, 2, 3]))      # 6
print(process("hello"))        # 5
print(process({'a': 1, 'b': 2}))  # 2

# 디버깅용
def debug_types(*args):
    for i, arg in enumerate(args):
        print(f"인자 {i}: {type(arg).__name__} = {arg}")

debug_types(10, "hello", [1, 2])
# 인자 0: int = 10
# 인자 1: str = hello
# 인자 2: list = [1, 2]
```

### isinstance(object, classinfo)

객체가 특정 **클래스의 인스턴스인지** 확인하는 내장 함수다.

**핵심 개념**:
- 상속 관계를 고려함 (자식 클래스도 True)
- 여러 타입 동시 확인 가능 (튜플로 전달)
- `type()` 보다 권장되는 타입 확인 방법

**기본 사용**:

```python
# 단일 타입 확인
print(isinstance(10, int))          # True
print(isinstance(3.14, float))      # True
print(isinstance("hi", str))        # True
print(isinstance([1, 2], list))     # True

# 여러 타입 동시 확인
x = 10
print(isinstance(x, (int, float)))  # True (둘 중 하나)

data = [1, 2, 3]
print(isinstance(data, (list, tuple)))  # True
```

**type() vs isinstance()**:

```python
# bool은 int의 서브클래스
x = True

print(type(x) == int)       # False (정확히 int는 아님)
print(isinstance(x, int))   # True (int의 서브클래스)

# 상속 관계 고려
class Animal:
    pass

class Dog(Animal):
    pass

dog = Dog()
print(type(dog) == Animal)      # False
print(isinstance(dog, Animal))  # True (권장)
```

**실전 활용**:

```python
# 안전한 타입 체크
def safe_divide(a, b):
    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
        raise TypeError("숫자만 입력 가능")
    if b == 0:
        raise ValueError("0으로 나눌 수 없음")
    return a / b

# 유연한 입력 처리
def process_data(data):
    if isinstance(data, str):
        return data.split()
    elif isinstance(data, (list, tuple)):
        return list(data)
    elif isinstance(data, dict):
        return list(data.values())
    else:
        return [data]

print(process_data("a b c"))       # ['a', 'b', 'c']
print(process_data([1, 2, 3]))     # [1, 2, 3]
print(process_data({'a': 1, 'b': 2}))  # [1, 2]

# None 체크
def get_length(data):
    if isinstance(data, (list, str, tuple)):
        return len(data)
    return 0

print(get_length([1, 2, 3]))  # 3
print(get_length(None))       # 0
```

### abs(x) - 절댓값

숫자의 **절댓값**(absolute value)을 반환하는 내장 함수다.

**기본 사용**:
```python
print(abs(-7))     # 7
print(abs(7))      # 7
print(abs(-3.14))  # 3.14
print(abs(0))      # 0
```

**실전 활용**:
```python
# 두 수의 차이 (거리)
a, b = 10, 25
distance = abs(a - b)
print(distance)    # 15

# 좌표 거리 (맨해튼 거리)
x1, y1 = 1, 2
x2, y2 = 4, 6
manhattan = abs(x2 - x1) + abs(y2 - y1)
print(manhattan)   # 7

# 오차 허용 비교
expected = 0.1 + 0.2  # 0.30000000000000004
actual = 0.3
if abs(expected - actual) < 1e-9:
    print("같음")  # 부동소수점 오차 처리

# 가장 가까운 값 찾기
target = 10
numbers = [5, 8, 12, 15]
closest = min(numbers, key=lambda x: abs(x - target))
print(closest)     # 8 또는 12
```

**복소수의 절댓값** (크기):
```python
z = 3 + 4j
print(abs(z))      # 5.0 (√(3² + 4²))
```

### all(iterable) - 모두 참인지 확인

iterable의 **모든 요소가 참**이면 True를 반환하는 함수다.

**동작 원리**:
- 모든 요소가 True (또는 참으로 평가) → True
- 하나라도 False (또는 거짓으로 평가) → False
- **빈 iterable → True** (vacuously true: 공허한 참)

**거짓으로 평가되는 값들**:
- `False`, `0`, `0.0`, `''` (빈 문자열), `[]` (빈 리스트), `{}` (빈 딕셔너리), `None`

```python
# 기본 사용
print(all([True, True, True]))    # True
print(all([True, False, True]))   # False (하나라도 False)
print(all([1, 2, 3]))             # True (모두 참)
print(all([1, 0, 3]))             # False (0은 거짓)
print(all([]))                    # True (빈 iterable)

# 비어있지 않은 문자열들
print(all(['a', 'b', 'c']))       # True
print(all(['a', '', 'c']))        # False (빈 문자열)
```

**실전 활용**:
```python
# 모든 숫자가 양수인지 확인
numbers = [1, 2, 3, 4, 5]
if all(n > 0 for n in numbers):
    print("모두 양수")  # 출력됨

# 모든 문자열이 알파벳인지
words = ['abc', 'def', 'ghi']
if all(word.isalpha() for word in words):
    print("모두 알파벳")  # 출력됨

# 리스트가 정렬되어 있는지
arr = [1, 2, 3, 4, 5]
is_sorted = all(arr[i] <= arr[i+1] for i in range(len(arr)-1))
print(is_sorted)  # True

# 모든 키가 딕셔너리에 있는지
data = {'name': '홍길동', 'age': 25, 'city': '서울'}
required_keys = ['name', 'age']
if all(key in data for key in required_keys):
    print("필수 키 모두 존재")  # 출력됨

# 2D 배열의 모든 행 길이가 같은지
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
first_len = len(matrix[0])
is_rectangular = all(len(row) == first_len for row in matrix)
print(is_rectangular)  # True
```

**빈 iterable 주의**:
```python
# 빈 리스트는 True 반환 (논리적 함정 주의!)
print(all([]))        # True
print(any([]))        # False (차이점)

# 안전한 검사
numbers = []
if numbers and all(n > 0 for n in numbers):
    print("비어있지 않고 모두 양수")
else:
    print("비어있거나 음수 포함")  # 출력됨
```

### any(iterable)

iterable의 요소 중 **하나라도 참**이면 True를 반환하는 함수다.

**동작 원리**:
- `all()`의 반대 개념
- 모든 요소가 거짓일 때만 False
- 빈 iterable은 False 반환

```python
vals = [1, 0, 3]
print(all(vals))        # False (0 때문)
print(any(vals))        # True (1이 있음)

# 빈 리스트 비교
print(all([]))          # True
print(any([]))          # False

# 실전 활용
numbers = [0, 0, 0, 5]
if any(n > 0 for n in numbers):
    print("양수가 있다")  # 출력됨
```

### dir(object)

객체가 가진 모든 **속성(변수, 메서드)**을 리스트로 반환하는 내장 함수다.

**핵심 개념**:
- 특정 객체의 사용 가능한 메서드/속성 목록 확인
- 디버깅이나 문서 없이 API 탐색 시 유용
- `__로 시작하는 매직 메서드`도 포함됨

**기본 사용**:
```python
# 빈 리스트의 속성/메서드 확인
print(dir([])[:5])      # 리스트 일부 속성
# ['__add__', '__class__', '__class_getitem__', '__contains__', '__delattr__']

# 사용 가능한 메서드만 확인 (매직 메서드 제외)
print([m for m in dir("") if not m.startswith('_')])
# ['capitalize', 'casefold', 'center', ...]
```

**실전 활용**:
```python
# 사용자 정의 클래스 탐색
class MyClass:
    def method1(self):
        pass
    def method2(self):
        pass

obj = MyClass()
methods = [m for m in dir(obj) if not m.startswith('_')]
print(methods)  # ['method1', 'method2']

# 모듈 탐색
import math
math_funcs = [f for f in dir(math) if not f.startswith('_')]
print(math_funcs[:5])  # ['acos', 'acosh', 'asin', 'asinh', 'atan']

# 객체에 특정 메서드가 있는지 확인
if 'append' in dir([]):
    print("리스트는 append를 지원한다")
```

### eval(expression)

**문자열 형태의 파이썬 표현식**을 실행하고 그 결과를 반환하는 내장 함수다.

**핵심 개념**:
- 문자열 `"1+2"` → 정수 `3` 으로 계산
- 변수, 함수 호출, 표현식 모두 가능
- **보안 위험**: 임의 코드 실행 가능하므로 사용자 입력에는 절대 사용 금지

**기본 사용**:
```python
# 수식 계산
expr = "3*(2+1)"
print(eval(expr))  # 9

# 문자열 연산
print(eval("'hi' + 'a'"))  # 'hia'

# 리스트 생성
result = eval("[1, 2, 3]")
print(type(result))  # <class 'list'>

# 수학 함수 사용
import math
print(eval("math.sqrt(16)"))  # 4.0
```

**실전 활용** (제한적):
```python
# 계산기 구현 (안전한 환경)
def calculator(expr):
    try:
        return eval(expr)
    except:
        return "오류"

print(calculator("2**10"))  # 1024

# 데이터 형식 변환 (JSON 대신 사용 금지)
data_str = "{'name': 'Kim', 'age': 25}"
data = eval(data_str)  # 딕셔너리로 변환
print(data['name'])  # Kim
```

**주의사항**:
```python
# ❌ 위험: 사용자 입력에 eval 사용 금지
# user_input = input("수식 입력: ")
# eval(user_input)  # __import__('os').system('rm -rf /') 같은 악성 코드 실행 가능

# ✅ 안전: ast.literal_eval 사용 (리터럴만 평가)
import ast
safe_data = ast.literal_eval("{'name': 'Kim'}")
print(safe_data)  # {'name': 'Kim'}

# ast.literal_eval은 코드 실행 불가
# ast.literal_eval("__import__('os')")  # ValueError
```

**대안**:
- 수식 계산: `eval()` 대신 파싱 라이브러리 사용 (예: `sympy`)
- 데이터 변환: `json.loads()` 또는 `ast.literal_eval()` 사용
- 사용자 정의 함수: 직접 파싱하거나 제한된 환경 구성

### map(function, iterable)

iterable의 각 요소에 함수를 적용하여 map 객체로 반환하는 함수다.

**핵심 개념**:
- 리스트 순회하며 함수 일괄 적용
- 반환값은 map 객체 → `list()` 또는 `tuple()`로 변환 필요
- 여러 iterable 동시 처리 가능
- 코딩테스트 입력 처리의 필수 패턴

```python
# 기본 사용: 문자열 → 정수 변환
nums = ["1", "2", "3"]
ints = list(map(int, nums))
print(ints)                 # [1, 2, 3]

# 입력 처리 핵심 패턴
# 입력: 10 20 30
arr = list(map(int, input().split()))

# 여러 iterable 동시 처리
nums1 = [1, 2, 3]
nums2 = [10, 20, 30]
result = list(map(lambda x, y: x + y, nums1, nums2))
print(result)               # [11, 22, 33]

# 함수 객체 전달
def square(x):
    return x * x

squared = list(map(square, [1, 2, 3, 4]))
print(squared)              # [1, 4, 9, 16]
```
  
### filter(f, iterable)

조건을 만족하는 요소만 걸러내는 함수다.

**동작 원리**:
- 함수가 True를 반환하는 요소만 선택
- 반환값은 filter 객체 → 리스트 변환 필요
- lambda와 함께 자주 사용
- list comprehension으로 대체 가능

```python
# 짝수만 필터링
nums = [1, 2, 3, 4, 5, 6]
even = list(filter(lambda x: x % 2 == 0, nums))
print(even)                 # [2, 4, 6]

# 조건 함수 정의
def is_positive(x):
    return x > 0

numbers = [-2, -1, 0, 1, 2]
positive = list(filter(is_positive, numbers))
print(positive)             # [1, 2]

# list comprehension과 비교 (더 파이썬스러움)
even2 = [x for x in nums if x % 2 == 0]
print(even2)                # [2, 4, 6]

# 빈 문자열 제거
words = ["hello", "", "world", "", "python"]
filtered = list(filter(None, words))  # 참인 값만
print(filtered)             # ['hello', 'world', 'python']
```

### lambda 매개변수 : 표현식

**익명 함수**(이름 없는 함수)를 한 줄로 정의하는 표현식이다.

**특징**:
- `def` 없이 간단한 함수 정의
- 주로 일회용 함수에 사용
- `map()`, `filter()`, `sorted()`의 key 인자로 활용
- 한 줄로만 작성 가능 (복잡한 로직은 def 사용)

```python
# 기본 사용
square = lambda x: x * x
print(square(5))            # 25

# 여러 매개변수
add = lambda a, b: a + b
print(add(3, 4))            # 7

# sorted의 key로 활용
points = [(1, 5), (3, 2), (2, 8)]
# x좌표 기준 정렬
sorted_by_x = sorted(points, key=lambda p: p[0])
print(sorted_by_x)          # [(1, 5), (2, 8), (3, 2)]

# y좌표 기준 내림차순
sorted_by_y = sorted(points, key=lambda p: -p[1])
print(sorted_by_y)          # [(2, 8), (1, 5), (3, 2)]

# 조건 표현식과 함께
absolute = lambda x: x if x >= 0 else -x
print(absolute(-5))         # 5

# 실전: 문자열 길이 우선, 같으면 사전순
words = ["apple", "pie", "banana", "cat"]
result = sorted(words, key=lambda w: (len(w), w))
print(result)               # ['cat', 'pie', 'apple', 'banana']
```

### len(s)

iterable의 **길이(요소 개수)**를 반환하는 내장 함수다.

**핵심 개념**:
- 리스트, 튜플, 문자열, 딕셔너리, 집합 등 모든 시퀀스 타입에서 사용 가능
- 반환값은 항상 정수 (음수 불가)
- 빈 컬렉션은 0 반환

**기본 사용**:
```python
# 리스트 길이
print(len([1,2,3]))          # 3
print(len([]))               # 0

# 문자열 길이
print(len("hello"))          # 5
print(len(""))               # 0

# 딕셔너리 키 개수
print(len({'a': 1, 'b': 2})) # 2

# 집합 원소 개수
print(len({1, 2, 3}))        # 3

# 튜플 길이
print(len((1, 2, 3)))        # 3
```

**실전 활용**:
```python
# 빈 체크 (Pythonic)
arr = []
if not len(arr):  # 또는 if not arr:
    print("비어있다")

# 2D 배열 크기
matrix = [[1,2,3], [4,5,6]]
rows = len(matrix)           # 2
cols = len(matrix[0])        # 3

# 범위 검사
words = ["apple", "banana", "cherry"]
for i in range(len(words)):
    print(f"{i}: {words[i]}")

# 문자열 자릿수 세기
num = 12345
digit_count = len(str(num))
print(digit_count)           # 5

# 평균 계산
scores = [85, 90, 78, 92]
avg = sum(scores) / len(scores)
print(avg)                   # 86.25
```

**주의사항**:
```python
# 제너레이터는 len() 사용 불가
gen = (x for x in range(5))
# len(gen)  # TypeError: object of type 'generator' has no len()

# 리스트로 변환 후 가능
print(len(list(gen)))        # 5
```

### oct(x)

정수를 **8진수 문자열**로 변환하는 내장 함수다.

**핵심 개념**:
- 8진수(Octal): 0~7까지만 사용하는 숫자 체계
- 반환값은 `'0o'` 접두사가 붙은 문자열
- 음수도 처리 가능

**기본 사용**:
```python
print(oct(8))           # '0o10' (8 = 1×8¹ + 0×8⁰)
print(oct(64))          # '0o100' (64 = 1×8²)
print(oct(-8))          # '-0o10'

# 접두사 제거
num = 64
print(oct(num)[2:])     # '100'
```

**실전 활용**:
```python
# 파일 권한 표시 (Unix)
permission = 0o755  # rwxr-xr-x
print(oct(permission))  # '0o755'

# 8진수 문자열을 정수로 역변환
octal_str = '755'
decimal = int(octal_str, 8)
print(decimal)          # 493

# 여러 진법 출력
num = 64
print(f"10진수: {num}")
print(f"2진수: {bin(num)}")   # 0b1000000
print(f"8진수: {oct(num)}")   # 0o100
print(f"16진수: {hex(num)}")  # 0x40
```

### hex(x)

정수를 **16진수 문자열**로 변환하는 내장 함수다.

**핵심 개념**:
- 16진수(Hexadecimal): 0~9, a~f 사용 (a=10, b=11, ..., f=15)
- 반환값은 `'0x'` 접두사가 붙은 문자열
- 색상 코드, 메모리 주소 표현에 자주 사용

**기본 사용**:
```python
print(hex(255))         # '0xff' (15×16 + 15)
print(hex(16))          # '0x10'
print(hex(2023))        # '0x7e7'
print(hex(-255))        # '-0xff'

# 접두사 제거
num = 255
print(hex(num)[2:])     # 'ff'
```

**실전 활용**:
```python
# RGB 색상 코드 생성
r, g, b = 255, 128, 64
color = f"#{r:02x}{g:02x}{b:02x}"
print(color)            # '#ff8040'

# 16진수를 정수로 역변환
hex_str = 'ff'
decimal = int(hex_str, 16)
print(decimal)          # 255

# 접두사 포함된 문자열 변환
print(int('0xff', 16))  # 255
print(int('0xFF', 16))  # 255 (대소문자 무관)

# 메모리 주소 표시
obj = [1, 2, 3]
address = hex(id(obj))
print(f"객체 주소: {address}")

# 바이트 데이터 16진수 변환
data = b'\x48\x65\x6c\x6c\x6f'  # "Hello"
hex_str = ''.join(f'{b:02x}' for b in data)
print(hex_str)          # '48656c6c6f'
```

### open(filename, mode='r') - 파일 읽기/쓰기

파일을 열어 **파일 객체**를 반환하는 내장 함수다.

**주요 모드**:
- `'r'`: 읽기 (기본값, 파일이 없으면 에러)
- `'w'`: 쓰기 (기존 내용 삭제, 없으면 생성)
- `'a'`: 추가 (기존 내용 끝에 추가)
- `'r+'`: 읽기/쓰기
- `'b'`: 바이너리 모드 (`'rb'`, `'wb'` 등과 함께 사용)

**기본 사용** (with 문 권장):
```python
# 읽기
with open('data.txt', 'r', encoding='utf-8') as f:
    content = f.read()  # 전체 읽기
    print(content)

# 한 줄씩 읽기
with open('data.txt', 'r', encoding='utf-8') as f:
    for line in f:
        print(line.rstrip())  # 개행 제거

# 모든 줄을 리스트로
with open('data.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()  # ['line1\n', 'line2\n', ...]
```

**쓰기**:
```python
# 새로 쓰기 (덮어쓰기)
with open('output.txt', 'w', encoding='utf-8') as f:
    f.write("Hello\n")
    f.write("World\n")

# 추가하기
with open('output.txt', 'a', encoding='utf-8') as f:
    f.write("추가 내용\n")

# 여러 줄 쓰기
lines = ['첫째 줄\n', '둘째 줄\n', '셋째 줄\n']
with open('output.txt', 'w', encoding='utf-8') as f:
    f.writelines(lines)
```

**코딩테스트 입력 파일 읽기**:
```python
# 방법 1: 전체 읽기
with open('input.txt') as f:
    data = f.read().splitlines()  # 개행 없이 리스트

# 방법 2: 첫 줄 따로, 나머지 한 줄씩
with open('input.txt') as f:
    n = int(f.readline())
    numbers = [int(f.readline()) for _ in range(n)]

# 방법 3: 모든 줄 한번에
with open('input.txt') as f:
    lines = [line.rstrip() for line in f]
```

**with 문을 사용하는 이유**:
```python
# 나쁜 예: 수동으로 닫기 (권장 안함)
f = open('data.txt', 'r')
content = f.read()
f.close()  # 실수로 안 닫으면 메모리 누수

# 좋은 예: with 문 (자동으로 닫힘)
with open('data.txt', 'r') as f:
    content = f.read()
# 이 블록을 벗어나면 자동으로 f.close() 호출
```

### range(start, stop, step) - 범위 생성

**연속된 정수 범위**를 생성하는 내장 함수다.

**기본 형태**:
- `range(stop)`: 0부터 stop-1까지
- `range(start, stop)`: start부터 stop-1까지
- `range(start, stop, step)`: start부터 stop-1까지 step 간격

```python
# range(5): 0, 1, 2, 3, 4
for i in range(5):
    print(i, end=' ')  # 0 1 2 3 4
print()

# range(2, 7): 2, 3, 4, 5, 6
for i in range(2, 7):
    print(i, end=' ')  # 2 3 4 5 6
print()

# range(2, 7, 2): 2, 4, 6 (2씩 증가)
for i in range(2, 7, 2):
    print(i, end=' ')  # 2 4 6
print()

# 역순 (step이 음수)
for i in range(10, 0, -1):
    print(i, end=' ')  # 10 9 8 7 6 5 4 3 2 1
print()
```

**실전 활용**:
```python
# 리스트 생성
numbers = list(range(1, 11))
print(numbers)  # [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 인덱스로 순회
arr = ['a', 'b', 'c']
for i in range(len(arr)):
    print(f"{i}: {arr[i]}")

# 역순 인덱스
for i in range(len(arr) - 1, -1, -1):
    print(arr[i])  # c, b, a

# N번 반복 (값 무시)
for _ in range(5):
    print("Hello")

# 2D 배열 초기화
n, m = 3, 4
matrix = [[0] * m for _ in range(n)]
print(matrix)  # [[0,0,0,0], [0,0,0,0], [0,0,0,0]]
```

**주의사항**:
```python
# range는 리스트가 아님 (range 객체)
print(type(range(5)))  # <class 'range'>

# 리스트로 변환 필요
print(list(range(5)))  # [0, 1, 2, 3, 4]

# 메모리 효율적 (실제 리스트를 생성하지 않음)
# for i in range(1000000): 는 빠르고 메모리 적게 사용
```

### round(number, ndigits=None) - 반올림

숫자를 지정한 **소수점 자리수**로 반올림하는 함수다.

**기본 사용**:
```python
print(round(3.14159))      # 3 (정수로)
print(round(3.14159, 2))   # 3.14 (소수점 2자리)
print(round(3.14159, 4))   # 3.1416 (반올림)
print(round(1234.56, -2))  # 1200.0 (음수는 정수 자리)
```

**실전 활용**:
```python
# 평균 계산
scores = [85, 92, 78, 90]
avg = sum(scores) / len(scores)
print(round(avg, 1))  # 86.2

# 비율 계산
correct = 17
total = 20
percentage = round((correct / total) * 100, 1)
print(f"{percentage}%")  # 85.0%

# 가격 반올림
price = 12345.67
print(round(price, -3))  # 12000.0 (천 단위)
```

**주의: 반올림 오류** (은행원 반올림):
```python
# 0.5는 가장 가까운 짝수로 반올림
print(round(2.5))   # 2 (2가 짝수)
print(round(3.5))   # 4 (4가 짝수)

# 정확한 반올림이 필요하면 Decimal 사용
from decimal import Decimal, ROUND_HALF_UP
num = Decimal('2.5')
print(num.quantize(Decimal('1'), rounding=ROUND_HALF_UP))  # 3
```

### str(object) - 문자열 변환

객체를 **문자열**로 변환하는 내장 함수다.

**기본 사용**:
```python
print(str(123))        # '123'
print(str(3.14))       # '3.14'
print(str(True))       # 'True'
print(str([1, 2, 3]))  # '[1, 2, 3]'

# 타입 확인
num = 123
text = str(num)
print(type(num), type(text))  # <class 'int'> <class 'str'>
```

**실전 활용**:
```python
# 숫자 연결
year = 2024
month = 3
day = 15
date = str(year) + '-' + str(month) + '-' + str(day)
print(date)  # '2024-3-15'
# 더 나은 방법: f-string
date = f"{year}-{month:02d}-{day:02d}"
print(date)  # '2024-03-15'

# 리스트 → 문자열
nums = [1, 2, 3, 4, 5]
result = ''.join(map(str, nums))
print(result)  # '12345'

# 자릿수 세기
num = 12345
digit_count = len(str(num))
print(digit_count)  # 5

# 숫자 각 자리 분리
num = 1234
digits = [int(d) for d in str(num)]
print(digits)  # [1, 2, 3, 4]
```

**str() vs repr()**:
```python
# str(): 사용자 친화적
print(str('hello\n'))   # hello (개행 출력)

# repr(): 개발자 친화적 (디버깅용)
print(repr('hello\n'))  # 'hello\n' (이스케이프 표시)
```

## 문자열 메서드

### upper() / lower() / capitalize() - 대소문자 변환

문자열의 대소문자를 변경하는 메서드들이다.

**기본 사용**:
```python
text = "Hello World"

# upper(): 모두 대문자로
print(text.upper())      # HELLO WORLD

# lower(): 모두 소문자로
print(text.lower())      # hello world

# capitalize(): 첫 글자만 대문자, 나머지 소문자
print("hello WORLD".capitalize())  # Hello world

# title(): 각 단어의 첫 글자를 대문자로
print(text.title())      # Hello World
```

**실전 활용**:
```python
# 대소문자 무시 비교
email1 = "USER@EXAMPLE.COM"
email2 = "user@example.com"
if email1.lower() == email2.lower():
    print("같은 이메일")  # 출력됨

# 사용자 입력 정규화
user_input = input("Yes/No? ")
if user_input.lower() in ['yes', 'y']:
    print("승인")

# 제목 형식 변환
title = "python programming guide"
print(title.title())     # Python Programming Guide

# 상수 형식 (대문자 + 언더스코어)
var_name = "user name"
constant = var_name.upper().replace(' ', '_')
print(constant)          # USER_NAME
```

**대소문자 판별**:
```python
text = "Hello123"
print(text.isupper())    # False
print(text.islower())    # False
print("HELLO".isupper()) # True
print("hello".islower()) # True
print(text.isalpha())    # False (숫자 포함)
print("Hello".isalpha()) # True
```

**swapcase() - 대소문자 반전**:
```python
text = "Hello World"
print(text.swapcase())   # hELLO wORLD
```

### print(*objects, sep=' ', end='\n', file=sys.stdout)

화면에 값을 **출력**하는 내장 함수다.

**기본 사용**:
```python
print("Hello")           # Hello (자동 개행)
print("안녕", "하세요")   # 안녕 하세요 (공백으로 구분)

# 여러 값 출력
name = "홍길동"
age = 25
print(name, age)         # 홍길동 25
```

**sep 매개변수** (구분자 지정):
```python
print(1, 2, 3)           # 1 2 3 (기본: 공백)
print(1, 2, 3, sep='-')  # 1-2-3
print(1, 2, 3, sep='')   # 123
print("a", "b", "c", sep='\n')  # 줄바꿈으로 구분
# a
# b
# c
```

**end 매개변수** (끝 문자 지정):
```python
# 기본: 개행(\n)
print("첫째", end=' ')
print("둘째")             # 첫째 둘째 (같은 줄)

print("로딩", end='...')
print("완료")             # 로딩...완료

# 진행 표시
for i in range(5):
    print(i, end=' ')    # 0 1 2 3 4 (한 줄)
print()  # 개행
```

**file 매개변수** (출력 대상 지정):
```python
# 파일에 출력
with open('output.txt', 'w') as f:
    print("파일에 쓰기", file=f)

# 표준 에러 출력
import sys
print("에러 메시지", file=sys.stderr)
```

**실전 활용**:
```python
# 포맷팅과 함께
name = "김철수"
score = 95
print(f"{name}님의 점수: {score}점")

# 여러 줄 출력 (리스트)
numbers = [1, 2, 3, 4, 5]
print(*numbers)          # 1 2 3 4 5 (언패킹)
print(*numbers, sep='\n')  # 각 줄에 하나씩

# 디버깅 (변수명과 값)
x = 10
y = 20
print(f"{x=}, {y=}")     # x=10, y=20
```

**긴 문자열 출력**:
```python
# 백슬래시로 줄 연결
message = "이것은 매우 긴 문자열입니다. " \
          "여러 줄로 나누어 작성하지만 " \
          "하나의 문자열로 출력됩니다."
print(message)

# 괄호로 자동 연결
message = ("첫 번째 줄 "
           "두 번째 줄 "
           "세 번째 줄")
print(message)
```

### *args - 가변 인자

함수에서 **임의 개수의 위치 인자**를 받을 때 사용한다.

**기본 개념**:
- `*args`: arguments의 줄임말 (이름은 자유롭게 변경 가능)
- 함수 내부에서는 **튜플**로 처리됨
- 위치 인자를 개수 제한 없이 받을 수 있음

**기본 사용**:
```python
def add(*numbers):
    """여러 숫자의 합"""
    return sum(numbers)

print(add(1, 2))         # 3
print(add(1, 2, 3))      # 6
print(add(1, 2, 3, 4, 5))  # 15

# 내부에서는 튜플
def show_args(*args):
    print(type(args))    # <class 'tuple'>
    print(args)
    
show_args(1, 2, 3)       # (1, 2, 3)
```

**실전 활용**:
```python
# 최댓값 찾기 (내장 max와 유사)
def maximum(*nums):
    if not nums:
        return None
    result = nums[0]
    for n in nums:
        if n > result:
            result = n
    return result

print(maximum(3, 7, 2, 9, 1))  # 9

# 문자열 연결
def concat(*strings):
    return ''.join(strings)

print(concat('Hello', ' ', 'World'))  # Hello World

# 일반 인자와 혼용
def greet(greeting, *names):
    for name in names:
        print(f"{greeting}, {name}!")

greet("안녕하세요", "김", "이", "박")
# 안녕하세요, 김!
# 안녕하세요, 이!
# 안녕하세요, 박!

# 리스트 언패킹
numbers = [1, 2, 3, 4, 5]
print(add(*numbers))     # 15 (언패킹하여 전달)
```

**주의사항**:
```python
# *args는 위치 인자 뒤에 와야 함
def func(a, b, *args):  # OK
    pass

# def func(*args, a, b):  # 오류 발생 가능 (a, b가 키워드 전용이 됨)

# *args 뒤에는 키워드 인자만
def func(a, *args, b=10):  # OK
    print(a, args, b)

func(1, 2, 3, b=20)     # 1 (2, 3) 20
```

### **kwargs - 키워드 가변 인자

함수에서 **임의 개수의 키워드 인자**를 받을 때 사용한다.

**기본 개념**:
- `**kwargs`: keyword arguments의 줄임말
- 함수 내부에서는 **딕셔너리**로 처리됨
- `키워드=값` 형태로 인자를 받음

**기본 사용**:
```python
def print_info(**kwargs):
    """키워드 인자를 받아 출력"""
    print(type(kwargs))  # <class 'dict'>
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="홍길동", age=25, city="서울")
# name: 홍길동
# age: 25
# city: 서울
```

**실전 활용**:
```python
# 선택적 설정값 받기
def configure(required, **options):
    print(f"필수: {required}")
    for key, val in options.items():
        print(f"옵션 {key}: {val}")

configure("필수값", debug=True, timeout=30, retry=3)
# 필수: 필수값
# 옵션 debug: True
# 옵션 timeout: 30
# 옵션 retry: 3

# 딕셔너리 병합
def merge_dicts(**dicts):
    result = {}
    for d in dicts.values():
        result.update(d)
    return result

d1 = {'a': 1, 'b': 2}
d2 = {'c': 3, 'd': 4}
merged = merge_dicts(first=d1, second=d2)
print(merged)  # {'a': 1, 'b': 2, 'c': 3, 'd': 4}

# 딕셔너리 언패킹
user = {'name': '김철수', 'age': 30, 'city': '부산'}
print_info(**user)
# name: 김철수
# age: 30
# city: 부산
```

**args와 kwargs 함께 사용**:
```python
def flexible_func(a, b, *args, c=10, **kwargs):
    print(f"위치 인자: a={a}, b={b}")
    print(f"추가 위치 인자: {args}")
    print(f"키워드 인자 c={c}")
    print(f"추가 키워드 인자: {kwargs}")

flexible_func(1, 2, 3, 4, c=20, x=100, y=200)
# 위치 인자: a=1, b=2
# 추가 위치 인자: (3, 4)
# 키워드 인자 c=20
# 추가 키워드 인자: {'x': 100, 'y': 200}

# 모든 인자를 받는 범용 래퍼
def log_function_call(func):
    def wrapper(*args, **kwargs):
        print(f"함수 {func.__name__} 호출")
        print(f"위치 인자: {args}")
        print(f"키워드 인자: {kwargs}")
        return func(*args, **kwargs)
    return wrapper

@log_function_call
def calculate(x, y, operation='add'):
    if operation == 'add':
        return x + y
    return x - y

result = calculate(10, 5, operation='add')
# 함수 calculate 호출
# 위치 인자: (10, 5)
# 키워드 인자: {'operation': 'add'}
```

### permutations - 순열

`itertools.permutations`는 iterable에서 **r개를 뽑아 순서대로 나열**하는 모든 경우의 수를 생성한다.

**핵심 개념**:
- **순열(Permutation)**: 순서가 중요 (AB ≠ BA)
- nPr = n! / (n-r)!
- 예: [A, B, C]에서 2개 뽑기 → AB, AC, BA, BC, CA, CB (6가지)

**기본 사용**:
```python
from itertools import permutations

data = ['A', 'B', 'C']

# 3개 모두 뽑기 (3P3 = 6)
result = list(permutations(data, 3))
print(result)
# [('A', 'B', 'C'), ('A', 'C', 'B'), ('B', 'A', 'C'), 
#  ('B', 'C', 'A'), ('C', 'A', 'B'), ('C', 'B', 'A')]

# 2개만 뽑기 (3P2 = 6)
result = list(permutations(data, 2))
print(result)
# [('A', 'B'), ('A', 'C'), ('B', 'A'), 
#  ('B', 'C'), ('C', 'A'), ('C', 'B')]

# r 생략 시 전체
result = list(permutations(data))
print(len(result))  # 6 (3! = 3×2×1)
```

**실전 활용**:
```python
# 숫자 배열의 모든 순서
numbers = [1, 2, 3]
for perm in permutations(numbers):
    print(perm)
# (1, 2, 3), (1, 3, 2), (2, 1, 3), ...

# 비밀번호 조합 생성
digits = '1234'
passwords = [''.join(p) for p in permutations(digits, 3)]
print(passwords[:5])  # ['123', '124', '132', '134', '142']

# 최단 경로 문제 (TSP 완전 탐색)
cities = ['A', 'B', 'C', 'D']
for path in permutations(cities):
    print(' -> '.join(path))
# A -> B -> C -> D
# A -> B -> D -> C
# ...

# 코딩테스트: 숫자 카드로 만들 수 있는 모든 수
cards = [1, 7, 8, 9]
three_digit_numbers = [int(''.join(map(str, p))) 
                       for p in permutations(cards, 3)]
print(min(three_digit_numbers))  # 178
print(max(three_digit_numbers))  # 987
```

### combinations - 조합

`itertools.combinations`는 iterable에서 **r개를 뽑되 순서는 무시**하는 모든 경우의 수를 생성한다.

**핵심 개념**:
- **조합(Combination)**: 순서 무관 (AB = BA)
- nCr = n! / (r! × (n-r)!)
- 예: [A, B, C]에서 2개 뽑기 → AB, AC, BC (3가지)

**기본 사용**:
```python
from itertools import combinations

data = ['A', 'B', 'C']

# 2개 뽑기 (3C2 = 3)
result = list(combinations(data, 2))
print(result)
# [('A', 'B'), ('A', 'C'), ('B', 'C')]

# 3개 뽑기 (3C3 = 1)
result = list(combinations(data, 3))
print(result)
# [('A', 'B', 'C')]

# 1개 뽑기 (3C1 = 3)
result = list(combinations(data, 1))
print(result)
# [('A',), ('B',), ('C',)]
```

**실전 활용**:
```python
# 팀 구성 (4명 중 2명 선택)
members = ['김', '이', '박', '최']
teams = list(combinations(members, 2))
print(len(teams))  # 6 (4C2)
for team in teams:
    print(team)
# ('김', '이'), ('김', '박'), ('김', '최'), 
# ('이', '박'), ('이', '최'), ('박', '최')

# 부분 집합 생성 (모든 크기)
nums = [1, 2, 3]
all_subsets = []
for r in range(len(nums) + 1):
    all_subsets.extend(combinations(nums, r))
print(all_subsets)
# [(), (1,), (2,), (3,), (1, 2), (1, 3), (2, 3), (1, 2, 3)]

# 복권 번호 조합 (1~45 중 6개)
from itertools import combinations
lotto_numbers = range(1, 46)
# count = len(list(combinations(lotto_numbers, 6)))
# print(count)  # 8,145,060 (45C6)

# 코딩테스트: 두 수의 합
numbers = [2, 3, 5, 7, 11]
for a, b in combinations(numbers, 2):
    if a + b == 10:
        print(f"{a} + {b} = 10")
# 3 + 7 = 10
```

**combinations vs permutations 비교**:
```python
from itertools import combinations, permutations

data = ['A', 'B', 'C']

# 순열: 순서 중요 (AB ≠ BA)
print(list(permutations(data, 2)))
# [('A', 'B'), ('A', 'C'), ('B', 'A'), ('B', 'C'), ('C', 'A'), ('C', 'B')]

# 조합: 순서 무관 (AB = BA)
print(list(combinations(data, 2)))
# [('A', 'B'), ('A', 'C'), ('B', 'C')]
```

**추가: combinations_with_replacement - 중복 조합**:
```python
from itertools import combinations_with_replacement

data = ['A', 'B', 'C']
result = list(combinations_with_replacement(data, 2))
print(result)
# [('A', 'A'), ('A', 'B'), ('A', 'C'), 
#  ('B', 'B'), ('B', 'C'), ('C', 'C')]
# 같은 원소를 여러 번 선택 가능
```

## 알고리즘 필수 추가 문법/패턴 정리

### 1. 컴프리헨션 & 표현식

- 리스트: `[f(x) for x in it if cond]`
- 딕셔너리: `{k: v for k, v in pairs}`
- 집합: `{f(x) for x in it}` (중복 제거)
- 중첩: `[(i, j) for i in range(n) for j in range(m)]`
- 제너레이터: `(x*x for x in it)` (지연 평가, 메모리 절약)

> 리스트 컴프리헨션에서 if만 쓰면 필터라서 for 뒤에 오고, if-else는 값 선택(삼항 연산)이라 for 앞의 표현식 자리에 온다.

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

**주요 함수**:
- `math.gcd(a, b)`: 최대공약수 (Python 3.5+)
- `math.lcm(*integers)`: 최소공배수 (Python 3.9+, 여러 인자 가능)
- `math.prod(iterable, *, start=1)`: 모든 요소의 곱 (Python 3.8+)
- `math.isqrt(n)`: 정수 제곱근 (Python 3.8+)
- `math.comb(n, k)`: 조합 nCk (Python 3.8+)
- `math.perm(n, k=None)`: 순열 nPk (Python 3.8+)
- `pow(a, b, mod)`: 모듈러 거듭제곱 O(log b)

**기본 사용**:
```python
import math

# 최대공약수/최소공배수
print(math.gcd(12, 18))              # 6
print(math.lcm(12, 18))              # 36
print(math.lcm(12, 18, 24))          # 72 (여러 인자)

# 곱셈 (sum의 곱 버전)
numbers = [1, 2, 3, 4, 5]
print(math.prod(numbers))            # 120 (1*2*3*4*5)
print(math.prod([2, 3, 4], start=10)) # 240 (10*2*3*4)

# 정수 제곱근
print(math.isqrt(16))                # 4
print(math.isqrt(17))                # 4 (내림)

# 조합/순열
print(math.comb(5, 2))               # 10 (5C2)
print(math.perm(5, 2))               # 20 (5P2)

# 모듈러 거듭제곱
print(pow(2, 10, 1000))              # 24 (2^10 mod 1000)
```

**음수 나머지 처리**:
```python
# 파이썬은 나머지 결과가 항상 0 이상 (수학적 modulo)
print((-3) % 5)                      # 2 (not -3)
print(((-3) % 5 + 5) % 5)            # 2 (안전한 처리)
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
