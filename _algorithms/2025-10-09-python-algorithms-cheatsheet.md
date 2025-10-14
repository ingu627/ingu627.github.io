---
layout: single
title: "파이썬 헷갈리는 문법 치트시트: 개념·패턴·실수 예방"
excerpt: "표현식과 명령문 구분부터 리스트 컴프리헨션, 제너레이터, 가변·불변 객체, 이름표 모델, 불리언 진리값 규칙, 매개변수 언패킹, walrus 연산자까지 헷갈리기 쉬운 파이썬 문법을 예제와 함께 총정리"
tags: [python, 파이썬, 문법, 치트시트, expression, statement, comprehension, generator, mutable, immutable, walrus]
toc: true
toc_sticky: true
sidebar_main: false

mathjax: true
use_math: true

author_profile: false
last_modified_at: 2025-10-10
---

파이썬은 문법이 간결하지만, 실제 문제를 풀다 보면 "왜 이렇게 동작하지?"라는 질문이 끊임없이 생긴다. 본 치트시트는 실무·코딩테스트에서 자주 헷갈리는 개념을 정리하고, 각 문법이 왜 그렇게 동작하는지 예제와 함께 설명한다.
{: .notice--success}

## 1. 표현식(Expression)과 명령문(Statement) 구분하기

### 개념 이해

- **표현식**: 평가하면 **하나의 값**이 되는 코드 조각이다.
- **명령문**: 인터프리터에게 **특정 동작을 수행**하도록 지시하는 코드다. 값으로 평가되지 않는다.

| 코드 | 평가 결과 | 분류 |
|------|-----------|------|
| `10 + 5` | `15` | 표현식 |
| `flag == True` | `True` | 표현식 |
| `x = 10` | 없음 (할당 동작) | 명령문 |
| `if x > 0:` | 흐름 제어 | 명령문 |

### 구분 방법

간단한 질문으로 구분할 수 있다: **"이 코드를 하나의 값으로 바꿀 수 있는가?"**

- `10 + 5` → `15`라는 값으로 대체 가능 → 표현식
- `flag == True` → `True` 또는 `False`라는 값으로 대체 가능 → 표현식
- `x = 10` → 어떤 값으로도 대체되지 않고 할당 동작만 수행 → 명령문
- `if x > 0:` → 흐름을 제어하는 구조 → 명령문

**참고**: `def`, `class`, `import`, `for`, `while`, `if`로 시작하는 코드는 대부분 명령문이다. 또한 `return x + y`에서 `x + y` 부분은 표현식이지만, `return` 자체는 명령문이다.

### 알아두면 좋은 점

```python
result = x = 10  # SyntaxError가 아니다
print(result)    # 10
```

할당문 자체는 값이 없지만 **연쇄 할당**은 허용된다. 다만 표현식이 필요한 곳에 할당문을 쓰면 코드가 복잡해 보일 수 있다. `:=` (walrus 연산자)를 사용할 때는 "표현식 안에서 변수에 값을 할당하면서 그 값을 동시에 사용한다"는 점을 기억하면 된다.

## 2. 조건부 표현식 (삼항 연산자)

### 기본 형태

```python
value_if_true if condition else value_if_false
```

일반적인 `if` 문과 순서가 다르게 느껴질 수 있다. `if`와 `else`의 위치를 전체 구조로 외워두면 헷갈리지 않는다. 조건부 표현식은 명령문이 아니라 표현식이므로, 값을 반환해야 하는 곳이라면 어디서든 사용할 수 있다.

### 사용 예시

```python
status = "Pass" if score >= 60 else "Fail"
message = "RETRY" if retries < 3 else "ABORT"
label = "even" if (n := number % 2) == 0 else f"odd-{n}"
```

### 주의할 점

`print("Pass") if score >= 60 else print("Fail")`처럼 사용할 수도 있지만, 명령문을 표현식에 억지로 넣으면 코드가 읽기 어려워진다. 중첩된 조건이 많다면 여러 줄의 `if-elif-else`로 풀어쓰는 편이 낫다.

## 3. 리스트 컴프리헨션에서 `if` 사용하기

### `if`의 두 가지 역할

리스트 컴프리헨션 안에서 `if`는 두 가지 다른 용도로 쓰인다.

1. **필터링**: 리스트에 어떤 원소를 포함할지 결정한다. `if`를 **맨 뒤**에 배치하고 `else`는 쓰지 않는다.
2. **값 변환**: 각 원소를 어떻게 변환할지 결정한다. `if-else`를 **앞**에 배치한다.

```python
numbers = range(10)

# 필터링: 짝수만 골라낸다
only_even = [x for x in numbers if x % 2 == 0]
# [0, 2, 4, 6, 8]

# 값 변환: 짝수는 그대로, 홀수는 "Odd"로 변환한다
converted = [x if x % 2 == 0 else "Odd" for x in numbers]
# [0, 'Odd', 2, 'Odd', 4, 'Odd', 6, 'Odd', 8, 'Odd']
```

### 팁

필터링과 값 변환을 한 줄에 섞으면 코드가 복잡해진다. 필요하다면 컴프리헨션을 두 번 사용하거나, 명시적인 `for` 문으로 나누는 것도 방법이다. 조건이 복잡하면 **별도 함수로 분리**하면 코드를 이해하기 쉬워진다.

## 4. 제너레이터와 리스트의 차이 이해하기

### 동작 방식 비교

| 구분 | 리스트 컴프리헨션 `[ ]` | 제너레이터 표현식 `( )` |
|------|-------------------------|---------------------------|
| 평가 시점 | 즉시 모든 값을 생성 | 필요할 때마다 하나씩 생성 |
| 메모리 사용 | 전체 크기만큼 사용 | 거의 사용하지 않음 |
| 반복 가능 횟수 | 여러 번 가능 | 한 번만 가능 (소비 후 비어있음) |

```python
large_list = [i for i in range(1_000_000)]
large_gen = (i for i in range(1_000_000))

print(sum(large_gen))   # 499999500000
print(sum(large_gen))   # 0 (이미 소비되어 비어있음)
```

### 선택 기준

- 한 번만 순회할 예정이고(`sum`, `min`, 파일 한 줄씩 처리 등) 메모리를 아끼고 싶다면 → 제너레이터
- 여러 번 재사용하거나 인덱스로 접근해야 한다면 → 리스트
- `list(제너레이터)`를 호출하면 모든 값이 메모리에 올라가므로 제너레이터의 이점이 사라진다.

## 5. 가변(Mutable) vs 불변(Immutable) 객체

### 타입별 분류

| 분류 | 타입 |
|------|------|
| 불변 객체 | `int`, `float`, `bool`, `str`, `tuple`, `frozenset` |
| 가변 객체 | `list`, `dict`, `set`, `bytearray`, 사용자 정의 클래스 |

### 왜 중요한가

```python
def add_tail(seq, item):
    seq.append(item)
    return seq

nums = [1, 2]
print(add_tail(nums, 3))  # [1, 2, 3]
print(nums)               # [1, 2, 3] ← 원본도 바뀐다
```

리스트나 딕셔너리를 함수 인자로 넘기면, 함수 안에서 수정한 내용이 원본에도 반영된다. 반면 불변 객체는 값을 바꿀 때마다 **새 객체**가 생성된다.

```python
text = "hello"
print(id(text))
text = text.upper()
print(id(text))  # 다른 id → 새 문자열이 생성됨
```

### 안전하게 사용하기

- 외부에서 받은 가변 객체를 바로 수정하지 말고, `copy()` 또는 `list(seq)`로 복사본을 만들어 사용한다.
- 함수 매개변수 기본값에 `[]`나 `{}`를 절대 쓰지 않는다. 대신 `None`을 쓰고 함수 내부에서 초기화한다.

```python
def collect(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket
```

## 6. 변수는 "이름표" 개념으로 이해하기

### 객체와 변수의 관계

파이썬에서 변수는 값을 담는 상자가 아니라 **객체에 붙이는 이름표**다. `y = x`를 실행하면 새로운 객체가 생기는 것이 아니라, 같은 객체에 `y`라는 이름표를 하나 더 붙이는 것이다.

```python
x = [1, 2]
y = x

y.append(3)
print(x)  # [1, 2, 3]
print(y)  # [1, 2, 3]
print(id(x), id(y))  # 동일한 id
```

### 얕은 복사와 깊은 복사

```python
import copy

original = [[1], [2]]
shallow = original.copy()
deep = copy.deepcopy(original)

shallow[0].append(99)
print(original)  # [[1, 99], [2]]  ← 영향을 받음
print(deep)      # [[1], [2]]      ← 영향 없음
```

얕은 복사(`.copy()`)는 최상위 컨테이너만 새로 만들고, 내부 원소는 원본과 같은 객체를 가리킨다. 깊은 복사(`deepcopy()`)는 내부 요소까지 모두 복사해서 완전히 독립적인 객체를 만든다.

## 7. 불리언과 정수의 관계

### 기본 개념

`True`와 `False`는 `bool` 타입이지만, 내부적으로 `int`의 하위 클래스다. 따라서 명시적으로 변환하거나 산술 연산에 사용할 때는 정수처럼 동작한다.

```python
print(int(True), int(False))  # 1 0
print(True + True + False)    # 2
print(type(True))             # <class 'bool'>
```

### Truthy와 Falsy

파이썬에서는 불리언 외의 값도 조건문에서 참/거짓으로 평가된다.

| 거짓으로 평가되는 값 | `None`, `False`, `0`, `0.0`, `0j`, `Decimal(0)`, 빈 시퀀스(`[]`, `()`, `''`), 빈 컬렉션(`{}`, `set()`) |
|---|---|
| 참으로 평가되는 값 | 위에 해당하지 않는 모든 객체 |

```python
if not []:
    print("빈 리스트는 거짓으로 평가됨")
```

커스텀 클래스에서는 `__bool__` 또는 `__len__` 메서드를 정의해서 진리값을 제어할 수 있다.

## 8. `is`와 `==`의 차이

### 비교 방식

- `==`는 **값 비교**다. 두 객체가 같은 내용을 담고 있으면 True다.
- `is`는 **동일성 비교**다. 두 변수가 정확히 같은 객체를 가리키는지(같은 id인지) 확인한다.

```python
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b, a is b)  # True False
print(a == c, a is c)  # True True
```

### 사용 시점

`is`는 싱글턴 객체(`None`, `True`, `False`, `Ellipsis`, `NotImplemented`) 비교에만 사용한다. 사용자 정의 클래스나 일반 컬렉션 비교에는 적합하지 않다.

```python
value = None
if value is None:
    print("값이 아직 설정되지 않았음")
```

## 9. 가변 인자와 매개변수 규칙

### 가변 인자 받기

```python
def report(title, *lines, footer="---"):
    print(title)
    for line in lines:
        print(" •", line)
    print(footer)

report("점검", "CPU 정상", "메모리 여유")
```

`*lines`는 여러 개의 위치 인자를 튜플로 묶어서 받는다. `footer="---"`는 키워드 전용 인자를 기본값과 함께 정의한 예다.

### 위치-only, 키워드-only 매개변수

```python
def scale(value, /, unit="px", *, clamp=False):
    return f"{value}{unit}" if not clamp else max(0, value)

scale(10)                    # OK
scale(10, unit="cm")         # OK
scale(10, clamp=True)        # OK
```

| 문법 | 의미 |
|------|------|
| `/` | 이 지점 앞의 매개변수는 **위치 인자로만** 전달 가능 |
| `*` | 이 지점 뒤의 매개변수는 **키워드 인자로만** 전달 가능 |

Python 3.8 이상에서 API를 설계할 때 사용 방식을 명확하게 제한할 수 있는 문법이다.

## 10. Walrus 연산자 `:=` 활용하기

### 사용 패턴

```python
# 1) while 루프에서 입력 읽기
while (line := input().strip()):
    print(line.upper())

# 2) 리스트 컴프리헨션 최적화
results = [match.group() for line in lines if (match := pattern.search(line))]
```

### 알아둘 점

walrus 연산자는 표현식 안에서 변수에 값을 할당하면서 동시에 그 값을 사용할 수 있게 해준다. 변수 스코프는 표현식이 평가되는 **해당 블록 내**에 유지된다. 조건식이 복잡해지면 괄호로 감싸면 가독성을 높일 수 있다.

## 11. 컨텍스트 매니저로 자원 관리하기

### 기본 사용법

```python
with open("data.log", "w", encoding="utf-8") as f:
    f.write("로그 기록")
```

`with` 블록을 벗어나면 자동으로 `f.close()`가 호출된다. 파일뿐만 아니라 네트워크 연결, 락(lock), 임시로 변경한 환경 변수 등에도 같은 패턴을 적용할 수 있다.

### 직접 만들기

```python
from contextlib import contextmanager

@contextmanager
def temporary_prefix(prefix):
    print(f"[{prefix}] 시작")
    try:
        yield
    finally:
        print(f"[{prefix}] 종료")

with temporary_prefix("작업"):
    print("처리 중")
```

## 12. 안전한 값 변환: `eval()` 대신 `ast.literal_eval()`

```python
import ast

config_text = "{'debug': True, 'timeout': 30}"
config = ast.literal_eval(config_text)
print(config["timeout"])  # 30
```

`eval()`은 임의의 파이썬 코드를 실행할 수 있어 보안 위험이 크다. 사용자 입력이나 외부 파일을 처리할 때는 절대 사용하면 안 된다. `ast.literal_eval()`은 리터럴(`dict`, `list`, 숫자, 문자열 등)만 안전하게 파싱한다.

## 13. 람다(Lambda) 함수의 함정과 심화 패턴

### 기본 개념 복습

람다는 `lambda 인자: 표현식` 형태로 익명 함수를 한 줄로 정의한다. 간단한 연산을 즉석에서 만들 때 유용하다.

```python
square = lambda x: x ** 2
add = lambda a, b: a + b
```

### 단일 표현식 제약과 해결법

람다는 **명령문(statement)을 포함할 수 없고, 오직 하나의 표현식(expression)만** 허용한다.

**불가능한 코드**:
```python
# if 명령문은 사용 불가
lambda x: if x > 0: return "positive"  # SyntaxError

# 여러 줄 로직도 불가
lambda x:
    y = x * 2
    return y  # SyntaxError
```

**해결 방법**: 조건부 표현식 활용
```python
# 조건부 표현식은 단일 표현식이므로 사용 가능
classifier = lambda x: "Even" if x % 2 == 0 else "Odd"

print(classifier(10))  # Even
print(classifier(9))   # Odd
```

### 클로저와 지연 바인딩 (가장 흔한 함정!)

반복문 안에서 람다를 생성할 때 자주 발생하는 문제다.

**문제 상황**:
```python
# 0, 1, 2, 3, 4를 각각 출력하는 함수를 만들고 싶다
funcs = []
for i in range(5):
    funcs.append(lambda: i)

# 실행하면?
for f in funcs:
    print(f(), end=' ')  # 예상: 0 1 2 3 4  실제: 4 4 4 4 4
```

**원인**: 람다는 `i`의 값이 아니라 `i`라는 **변수 자체**를 참조한다. 반복문이 끝난 후 `i`의 최종값은 `4`이므로, 모든 람다가 같은 `4`를 가리키게 된다.

**해결법**: 기본 인자로 값 고정하기
```python
funcs_fixed = []
for i in range(5):
    # 람다 정의 시점의 i 값을 num의 기본값으로 고정
    funcs_fixed.append(lambda num=i: num)

for f in funcs_fixed:
    print(f(), end=' ')  # 0 1 2 3 4 ✓
```

함수의 기본 인자는 **정의 시점**에 평가되므로, 각 람다가 생성될 때의 `i` 값이 독립적으로 저장된다.

### 다양한 인자 처리

람다도 일반 함수처럼 다양한 형태의 인자를 받을 수 있다.

```python
# 인자가 없는 람다
get_hello = lambda: "Hello"
print(get_hello())  # Hello

# 기본값이 있는 람다
add = lambda x, y=10: x + y
print(add(5))       # 15
print(add(5, 20))   # 25

# 가변 인자를 받는 람다
summarize = lambda name, *args, **kwargs: \
    f"{name}: {len(args)} positional, {len(kwargs)} keyword args"

print(summarize("Alice", 1, 2, 3, city="Seoul"))
# Alice: 3 positional, 1 keyword args
```

### 언제 람다를 쓰고, 언제 def를 쓸까?

**람다가 적합한 경우**:
- `sorted()`, `map()`, `filter()` 등의 key 함수
- 단순한 변환이나 조건 검사
- 일회성 용도의 간단한 함수

**def가 적합한 경우**:
- 로직이 복잡해서 한 줄로 표현하기 어려운 경우
- 함수 이름이 코드의 의도를 명확히 전달하는 경우
- 여러 곳에서 재사용되는 경우

```python
# 람다: 간단한 key 함수
points = [(1, 5), (3, 2), (2, 8)]
sorted_points = sorted(points, key=lambda p: p[1])

# def: 복잡한 로직은 명시적으로
def calculate_score(student):
    base = student['grade'] * 10
    bonus = 5 if student['attendance'] > 90 else 0
    return base + bonus

students_sorted = sorted(students, key=calculate_score)
```

### 람다 사용 시 체크 포인트

- 단일 표현식으로 작성 가능한가? 복잡하면 조건부 표현식 또는 `def` 고려
- 반복문 안에서 람다를 만드는가? 지연 바인딩 함정 조심 (`lambda x=변수: x` 패턴 사용)
- 코드가 읽기 어려워지지 않는가? 가독성이 떨어지면 `def`로 전환

## 14. 실전 점검 항목

다음은 코드를 작성하거나 리뷰할 때 확인하면 좋은 체크 포인트다.

- 표현식과 명령문을 구분해서 사용하고 있는가?
- 리스트 컴프리헨션에서 필터링과 값 변환 `if`의 위치가 올바른가?
- 제너레이터를 한 번만 사용하는데 리스트로 변환하지는 않았는가?
- 함수 매개변수 기본값에 가변 객체(`[]`, `{}`)를 쓰지 않았는가?
- `is`는 싱글턴(`None`, `True`, `False`) 비교에만 사용하고 있는가?
- Truthy/Falsy 규칙을 이해하고 조건문을 작성하고 있는가?
- walrus 연산자를 사용할 때 가독성을 고려했는가?
- 반복문 안에서 람다를 만들 때 지연 바인딩 문제를 방지했는가?

이런 항목들을 반복해서 점검하다 보면, 파이썬 코드가 왜 그렇게 동작하는지 자연스럽게 이해하게 된다. 헷갈리는 개념을 정리하고, 실수를 사전에 방지할 수 있다.
