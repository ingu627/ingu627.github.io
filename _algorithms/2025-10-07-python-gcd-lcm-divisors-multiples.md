---
layout: single
title: "코딩테스트 배수·약수·최대공약수·최소공배수 정리"
excerpt: "유클리드 호제법, GCD·LCM 공식, 소인수분해, 약수 구하기 등 파이썬 코딩테스트 필수 수학 패턴과 최적화 기법 정리"
tags: [python, 파이썬, gcd, lcm, 최대공약수, 최소공배수, 배수, 약수, 유클리드 호제법, 수학, 알고리즘, 코딩테스트]
toc: true
toc_sticky: true
sidebar_main: false

mathjax: true
use_math: true

author_profile: true
last_modified_at: 2025-10-07
---

배수·약수·최대공약수(GCD)·최소공배수(LCM)는 코딩테스트에서 가장 기본이 되는 수학 개념이다. 유클리드 호제법과 핵심 공식만 알면 대부분의 문제를 효율적으로 해결할 수 있다.

**핵심**: GCD는 유클리드 호제법 `math.gcd()`, LCM은 `a * b // gcd(a, b)` 공식만 기억하면 된다!
{: .notice--info}

## 기본 개념

### 배수와 약수

**배수(Multiple)**: 어떤 수를 정수배한 값

```python
# 5의 배수
5, 10, 15, 20, 25, ...
# 수식: 5 × 1, 5 × 2, 5 × 3, ...
```

**약수(Divisor/Factor)**: 어떤 수를 나누어떨어지게 하는 수

```python
# 12의 약수
1, 2, 3, 4, 6, 12
# 12를 나눴을 때 나머지가 0인 수들
```

**최대공약수(GCD, Greatest Common Divisor)**: 두 수의 공통 약수 중 가장 큰 수

```python
# 12와 18의 공약수: 1, 2, 3, 6
# 최대공약수: 6
gcd(12, 18) = 6
```

**최소공배수(LCM, Least Common Multiple)**: 두 수의 공통 배수 중 가장 작은 수

```python
# 12의 배수: 12, 24, 36, 48, ...
# 18의 배수: 18, 36, 54, ...
# 최소공배수: 36
lcm(12, 18) = 36
```

### 핵심 관계식

**중요**: LCM과 GCD의 관계
```python
a × b = gcd(a, b) × lcm(a, b)

# 따라서
lcm(a, b) = (a × b) / gcd(a, b)
```

**증명**:
```
12 × 18 = 216
gcd(12, 18) × lcm(12, 18) = 6 × 36 = 216 ✅
```

<br>

## 배수 확인하기

### 기본 방법

```python
# n이 m의 배수인지 확인
def is_multiple(n, m):
    """n이 m의 배수인지 판별"""
    return n % m == 0

# 테스트
print(is_multiple(20, 5))   # True (20은 5의 배수)
print(is_multiple(23, 5))   # False
```

### 실전 활용

```python
# 1. 특정 범위의 배수 찾기
def find_multiples(n, start, end):
    """start부터 end까지 n의 배수 찾기"""
    return [i for i in range(start, end + 1) if i % n == 0]

print(find_multiples(3, 1, 20))  # [3, 6, 9, 12, 15, 18]

# 2. 효율적인 방법 (range 활용)
def find_multiples_fast(n, start, end):
    """시작점을 n의 배수로 조정하여 효율화"""
    # start를 n의 배수로 올림
    first = ((start - 1) // n + 1) * n
    return list(range(first, end + 1, n))

print(find_multiples_fast(3, 1, 20))  # [3, 6, 9, 12, 15, 18]

# 3. 여러 수의 배수 동시 확인
def is_multiple_of_all(n, divisors):
    """n이 divisors의 모든 수의 배수인지 확인"""
    return all(n % d == 0 for d in divisors)

print(is_multiple_of_all(12, [2, 3]))     # True
print(is_multiple_of_all(12, [2, 3, 5]))  # False
```

**시간 복잡도**: 
- 배수 확인: $$O(1)$$
- 범위 내 배수 찾기 (naive): $$O(n)$$
- 범위 내 배수 찾기 (최적화): $$O(n/m)$$ where m은 배수

<br>

## 약수 구하기

### 기본 방법 (비효율)

```python
def get_divisors_naive(n):
    """1부터 n까지 모두 확인 - O(n)"""
    divisors = []
    for i in range(1, n + 1):
        if n % i == 0:
            divisors.append(i)
    return divisors

print(get_divisors_naive(12))  # [1, 2, 3, 4, 6, 12]
# 문제점: n이 크면 느림! (n = 1,000,000 이면 100만번 반복)
```

### 최적화된 방법 (권장 ⭐)

**핵심 아이디어**: $$\sqrt{n}$$까지만 확인하면 된다!

**왜?**
```python
# 12의 약수 쌍:
# 1 × 12 = 12
# 2 × 6 = 12
# 3 × 4 = 12
# √12 ≈ 3.46

# √12까지만 확인하면:
# 1을 찾으면 → 12도 약수
# 2를 찾으면 → 6도 약수
# 3을 찾으면 → 4도 약수
# 4는 확인 안 해도 됨 (이미 3에서 찾음)
```

**실전 코드**

```python
def get_divisors(n):
    """√n까지만 확인 - O(√n)"""
    divisors = []
    
    for i in range(1, int(n**0.5) + 1):
        if n % i == 0:
            divisors.append(i)
            # i와 n//i가 다르면 둘 다 추가
            if i != n // i:
                divisors.append(n // i)
    
    return sorted(divisors)

# 테스트
print(get_divisors(12))      # [1, 2, 3, 4, 6, 12]
print(get_divisors(16))      # [1, 2, 4, 8, 16]
print(get_divisors(1))       # [1]

# 성능 비교
import time

n = 1000000
start = time.time()
get_divisors_naive(n)
t1 = time.time() - start

start = time.time()
get_divisors(n)
t2 = time.time() - start

print(f"Naive: {t1:.4f}초")      # 약 0.1초
print(f"Optimized: {t2:.4f}초")  # 약 0.001초
print(f"최적화가 {t1/t2:.0f}배 빠름!")  # 약 100배!
```

### 약수의 개수 구하기

```python
def count_divisors(n):
    """약수의 개수만 필요할 때 - O(√n)"""
    count = 0
    
    for i in range(1, int(n**0.5) + 1):
        if n % i == 0:
            count += 1 if i == n // i else 2
    
    return count

print(count_divisors(12))  # 6개
print(count_divisors(16))  # 5개
```

### 약수의 합 구하기

```python
def sum_divisors(n):
    """약수의 합 - O(√n)"""
    total = 0
    
    for i in range(1, int(n**0.5) + 1):
        if n % i == 0:
            total += i
            if i != n // i:
                total += n // i
    
    return total

print(sum_divisors(12))  # 1+2+3+4+6+12 = 28
```

**시간 복잡도**:
- Naive 방법: $$O(n)$$
- 최적화 방법: $$O(\sqrt{n})$$

<br>

## 최대공약수 (GCD)

### 방법 1: 반복문 (비효율)

```python
def gcd_loop(a, b):
    """작은 수부터 1까지 내림차순 확인 - O(min(a,b))"""
    for i in range(min(a, b), 0, -1):
        if a % i == 0 and b % i == 0:
            return i

print(gcd_loop(12, 18))  # 6
# 문제점: 느림! (최악의 경우 min(a,b)번 반복)
```

### 방법 2: 유클리드 호제법 (권장 ⭐)

**핵심 아이디어**: $$\gcd(a, b) = \gcd(b, a \bmod b)$$

**증명 원리**:
```
gcd(18, 12)
= gcd(12, 18 % 12)
= gcd(12, 6)
= gcd(6, 12 % 6)
= gcd(6, 0)
= 6
```

**왜 이게 작동할까?**
```python
# a = bq + r (a를 b로 나눈 몫 q, 나머지 r)
# a와 b의 공약수는 r과 b의 공약수와 같다!

# 예: gcd(18, 12)
# 18 = 12 × 1 + 6
# 18과 12의 공약수 = 12와 6의 공약수
# 12 = 6 × 2 + 0
# 12와 6의 공약수 = 6과 0의 공약수
# gcd(6, 0) = 6
```

**실전 코드**

```python
def gcd_euclidean(a, b):
    """유클리드 호제법 (반복) - O(log(min(a,b)))"""
    while b > 0:
        a, b = b, a % b
    return a

def gcd_recursive(a, b):
    """유클리드 호제법 (재귀) - O(log(min(a,b)))"""
    if b == 0:
        return a
    return gcd_recursive(b, a % b)

# 테스트
print(gcd_euclidean(12, 18))   # 6
print(gcd_recursive(12, 18))   # 6
print(gcd_euclidean(48, 18))   # 6
```

### 방법 3: math.gcd() (가장 권장 ⭐⭐⭐)

```python
from math import gcd

# 두 수의 최대공약수
print(gcd(12, 18))   # 6
print(gcd(48, 18))   # 6

# 여러 수의 최대공약수
from functools import reduce

numbers = [12, 18, 24, 30]
result = reduce(gcd, numbers)
print(result)  # 6

# 또는 Python 3.9+
from math import gcd
result = gcd(12, 18, 24, 30)  # 6
```

### 성능 비교

```python
import time

a, b = 123456, 789012

# 1. 반복문 방식
start = time.time()
for _ in range(10000):
    gcd_loop(a, b)
t1 = time.time() - start

# 2. 유클리드 호제법
start = time.time()
for _ in range(10000):
    gcd_euclidean(a, b)
t2 = time.time() - start

# 3. math.gcd()
start = time.time()
for _ in range(10000):
    gcd(a, b)
t3 = time.time() - start

print(f"반복문: {t1:.4f}초")           # 약 0.5초
print(f"유클리드: {t2:.4f}초")         # 약 0.01초
print(f"math.gcd: {t3:.4f}초")       # 약 0.005초
print(f"유클리드가 반복문보다 {t1/t2:.0f}배 빠름")  # 약 50배
```

**시간 복잡도**:
- 반복문: $$O(\min(a, b))$$
- 유클리드 호제법: $$O(\log(\min(a, b)))$$

**핵심**: 코딩테스트에서는 항상 `math.gcd()`를 사용하라!

<br>

## 최소공배수 (LCM)

### 방법 1: 반복문 (비효율)

```python
def lcm_loop(a, b):
    """큰 수부터 a×b까지 확인 - O(a×b)"""
    for i in range(max(a, b), a * b + 1):
        if i % a == 0 and i % b == 0:
            return i

print(lcm_loop(12, 18))  # 36
# 문제점: 엄청 느림! (최악의 경우 a×b번 반복)
```

### 방법 2: 공식 활용 (권장 ⭐⭐⭐)

**핵심 공식**: 
$$
\text{lcm}(a, b) = \frac{a \times b}{\gcd(a, b)}
$$

**왜 이 공식이 성립할까?**
```python
# 12 = 2² × 3
# 18 = 2 × 3²
# gcd(12, 18) = 2 × 3 = 6
# lcm(12, 18) = 2² × 3² = 36

# 공식 확인:
# 12 × 18 / 6 = 216 / 6 = 36 ✅
```

**실전 코드**

```python
from math import gcd

def lcm(a, b):
    """LCM = (a × b) / GCD(a, b) - O(log(min(a,b)))"""
    return a * b // gcd(a, b)

# 테스트
print(lcm(12, 18))   # 36
print(lcm(4, 6))     # 12
print(lcm(7, 5))     # 35 (서로소: gcd=1이면 lcm=a×b)

# 여러 수의 최소공배수
from functools import reduce

numbers = [12, 18, 24]
result = reduce(lcm, numbers)
print(result)  # 72
```

### 방법 3: math.lcm() (Python 3.9+)

```python
from math import lcm

# 두 수의 최소공배수
print(lcm(12, 18))   # 36

# 여러 수의 최소공배수 (Python 3.9+)
print(lcm(12, 18, 24))  # 72
```

### 오버플로우 주의

```python
# ❌ 나쁜 예: 곱셈 먼저 (오버플로우 위험!)
from math import gcd
def lcm_bad(a, b):
    return (a * b) // gcd(a, b)  # a×b가 너무 클 수 있음

# ✅ 좋은 예: 나눗셈 먼저
def lcm_good(a, b):
    return a // gcd(a, b) * b  # 순서 주의!

# 큰 수 테스트
a, b = 10**9, 10**9 - 1
print(lcm_good(a, b))  # 정상 작동
# lcm_bad는 중간에 10^18이 되어 오버플로우 위험!
```

**시간 복잡도**:
- 반복문: $$O(a \times b)$$
- 공식 활용: $$O(\log(\min(a, b)))$$ (GCD 계산 시간)

<br>

## 소인수분해

### 기본 방법

```python
def prime_factorization(n):
    """소인수분해 - O(√n)"""
    factors = {}
    d = 2
    
    while d * d <= n:
        while n % d == 0:
            factors[d] = factors.get(d, 0) + 1
            n //= d
        d += 1
    
    if n > 1:
        factors[n] = factors.get(n, 0) + 1
    
    return factors

# 테스트
print(prime_factorization(12))   # {2: 2, 3: 1} → 2² × 3
print(prime_factorization(18))   # {2: 1, 3: 2} → 2 × 3²
print(prime_factorization(100))  # {2: 2, 5: 2} → 2² × 5²
```

### 소인수분해 결과 출력

```python
def print_factorization(n):
    """소인수분해 결과를 수식으로 출력"""
    factors = prime_factorization(n)
    
    if not factors:
        return "1"
    
    result = []
    for prime, count in sorted(factors.items()):
        if count == 1:
            result.append(str(prime))
        else:
            result.append(f"{prime}^{count}")
    
    return " × ".join(result)

print(print_factorization(12))   # 2^2 × 3
print(print_factorization(100))  # 2^2 × 5^2
```

### 소인수분해로 약수 구하기

```python
def get_divisors_from_factorization(n):
    """소인수분해 결과로 모든 약수 구하기"""
    factors = prime_factorization(n)
    
    divisors = [1]
    for prime, count in factors.items():
        new_divisors = []
        power = 1
        for _ in range(count):
            power *= prime
            for div in divisors:
                new_divisors.append(div * power)
        divisors.extend(new_divisors)
    
    return sorted(divisors)

print(get_divisors_from_factorization(12))  # [1, 2, 3, 4, 6, 12]
```

<br>

## 서로소 (Coprime)

### 개념

**서로소**: 두 수의 최대공약수가 1인 경우

```python
from math import gcd

def is_coprime(a, b):
    """서로소 판별 - O(log(min(a,b)))"""
    return gcd(a, b) == 1

# 테스트
print(is_coprime(7, 5))    # True (서로소)
print(is_coprime(12, 18))  # False (gcd=6)
```

### 오일러 파이 함수

**오일러 파이 함수** $$\phi(n)$$: n 이하의 자연수 중 n과 서로소인 수의 개수

```python
def euler_phi(n):
    """오일러 파이 함수 - O(√n)"""
    result = n
    p = 2
    
    while p * p <= n:
        if n % p == 0:
            # p가 소인수이면
            while n % p == 0:
                n //= p
            result -= result // p
        p += 1
    
    if n > 1:
        result -= result // n
    
    return result

# 테스트
print(euler_phi(12))  # 4 (1, 5, 7, 11)
print(euler_phi(9))   # 6 (1, 2, 4, 5, 7, 8)

# 공식: φ(n) = n × (1 - 1/p₁) × (1 - 1/p₂) × ...
# 예: φ(12) = 12 × (1 - 1/2) × (1 - 1/3) = 12 × 1/2 × 2/3 = 4
```

<br>

## 코딩테스트 빈출 패턴

### 1. 두 수의 최대공약수와 최소공배수

**문제 유형**: 기본 GCD/LCM 계산

```python
from math import gcd

def solution(n, m):
    """프로그래머스 - 최대공약수와 최소공배수"""
    g = gcd(n, m)
    l = n * m // g
    return [g, l]

# 테스트
print(solution(3, 12))  # [3, 12]
print(solution(2, 5))   # [1, 10]
```

### 2. N개의 최소공배수

**문제 유형**: 여러 수의 LCM

```python
from math import gcd
from functools import reduce

def lcm(a, b):
    return a * b // gcd(a, b)

def solution(arr):
    """프로그래머스 - N개의 최소공배수"""
    return reduce(lcm, arr)

# 테스트
print(solution([2, 6, 8, 14]))  # 168
print(solution([1, 2, 3]))      # 6
```

### 3. 약수의 합

**문제 유형**: 특정 수의 약수 합 계산

```python
def solution(n):
    """프로그래머스 - 약수의 합"""
    total = 0
    for i in range(1, int(n**0.5) + 1):
        if n % i == 0:
            total += i
            if i != n // i:
                total += n // i
    return total

# 테스트
print(solution(12))  # 28 (1+2+3+4+6+12)
print(solution(5))   # 6 (1+5)
```

### 4. 약수의 개수와 덧셈

**문제 유형**: 범위 내 수들의 약수 개수 판별

```python
def count_divisors(n):
    """약수의 개수 계산"""
    count = 0
    for i in range(1, int(n**0.5) + 1):
        if n % i == 0:
            count += 1 if i == n // i else 2
    return count

def solution(left, right):
    """프로그래머스 - 약수의 개수와 덧셈"""
    result = 0
    for n in range(left, right + 1):
        if count_divisors(n) % 2 == 0:
            result += n
        else:
            result -= n
    return result

# 테스트
print(solution(13, 17))  # 43
print(solution(24, 27))  # 52
```

**최적화 팁**: 완전제곱수는 약수 개수가 홀수!

```python
def solution_optimized(left, right):
    """완전제곱수 판별로 최적화"""
    result = 0
    for n in range(left, right + 1):
        # 완전제곱수는 약수 개수가 홀수
        if int(n**0.5)**2 == n:
            result -= n
        else:
            result += n
    return result
```

### 5. 최대공약수 구하기 (백준 2609)

```python
from math import gcd

n, m = map(int, input().split())
g = gcd(n, m)
l = n * m // g

print(g)
print(l)
```

### 6. 최소공배수 (백준 1934)

```python
from math import gcd

t = int(input())
for _ in range(t):
    a, b = map(int, input().split())
    print(a * b // gcd(a, b))
```

### 7. 분수 덧셈

**문제 유형**: 분수 계산 후 기약분수로 만들기

```python
from math import gcd

def add_fractions(a1, b1, a2, b2):
    """분수 a1/b1 + a2/b2를 기약분수로"""
    # 통분
    numerator = a1 * b2 + a2 * b1
    denominator = b1 * b2
    
    # 최대공약수로 나누기
    g = gcd(numerator, denominator)
    return numerator // g, denominator // g

# 테스트
print(add_fractions(1, 2, 1, 3))  # (5, 6) → 5/6
print(add_fractions(2, 3, 1, 6))  # (5, 6) → 5/6
```

### 8. 타일 문제

**문제 유형**: 최소 몇 개의 타일로 채울 수 있는가?

```python
from math import gcd

def solution(w, h):
    """직사각형을 정사각형으로 나누기"""
    # 정사각형 한 변의 최대 길이 = gcd(w, h)
    g = gcd(w, h)
    return (w // g) + (h // g) - 1

# 예: 12×8 직사각형
# gcd(12, 8) = 4
# 4×4 정사각형 (12/4) + (8/4) - 1 = 5개 필요
print(solution(12, 8))  # 5
```

### 9. 격자점 문제

**문제 유형**: 직선 위의 격자점 개수

```python
from math import gcd

def count_lattice_points(x1, y1, x2, y2):
    """두 점 사이 격자점 개수 (끝점 제외)"""
    dx = abs(x2 - x1)
    dy = abs(y2 - y1)
    return gcd(dx, dy) - 1

# 테스트
print(count_lattice_points(0, 0, 4, 2))  # 1 (gcd(4,2)=2, 중간에 1개)
print(count_lattice_points(0, 0, 3, 3))  # 2 (gcd(3,3)=3, 중간에 2개)
```

### 10. 유클리드 호제법 응용

**문제**: 두 수의 GCD를 계산하는 과정에서 몇 번의 나눗셈을 수행하는가?

```python
def gcd_count_operations(a, b):
    """유클리드 호제법 연산 횟수"""
    count = 0
    while b > 0:
        a, b = b, a % b
        count += 1
    return count

print(gcd_count_operations(18, 12))  # 2번
# 18 % 12 = 6
# 12 % 6 = 0
```

<br>

## 소수 관련 패턴

### 소수 판별

```python
def is_prime(n):
    """소수 판별 - O(√n)"""
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    
    for i in range(3, int(n**0.5) + 1, 2):
        if n % i == 0:
            return False
    return True

# 테스트
print(is_prime(17))   # True
print(is_prime(18))   # False
```

### 에라토스테네스의 체

```python
def sieve_of_eratosthenes(n):
    """n 이하의 모든 소수 구하기 - O(n log log n)"""
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, n + 1, i):
                is_prime[j] = False
    
    return [i for i in range(n + 1) if is_prime[i]]

# 테스트
print(sieve_of_eratosthenes(30))
# [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
```

<br>

## 실전 팁 & 주의사항

### 1. math.gcd() vs 직접 구현

```python
from math import gcd

# ✅ 코딩테스트에서는 항상 math.gcd() 사용!
result = gcd(12, 18)

# ❌ 시간 없을 때 직접 구현은 위험
def my_gcd(a, b):
    while b:
        a, b = b, a % b
    return a
```

**이유**:
- `math.gcd()`는 C로 최적화됨 (훨씬 빠름)
- 구현 실수로 인한 버그 방지
- 코드 간결성

### 2. LCM 오버플로우 주의

```python
from math import gcd

# ❌ 나쁜 예: 곱셈 먼저
def lcm_bad(a, b):
    return (a * b) // gcd(a, b)  # a×b가 오버플로우 가능

# ✅ 좋은 예: 나눗셈 먼저
def lcm_good(a, b):
    return a // gcd(a, b) * b  # 안전!

# Python은 큰 정수 지원하지만, 다른 언어에서는 문제!
```

### 3. 약수 구할 때 중복 주의

```python
def get_divisors(n):
    divisors = []
    for i in range(1, int(n**0.5) + 1):
        if n % i == 0:
            divisors.append(i)
            # ⚠️ 중복 체크 필수!
            if i != n // i:  # √n인 경우 중복 방지
                divisors.append(n // i)
    return sorted(divisors)

# 예: n=16
# i=4일 때, 4와 16//4=4는 같음!
# 중복 체크 안 하면 [1, 2, 4, 4, 8, 16] 🚨
```

### 4. 여러 수의 GCD/LCM

```python
from math import gcd
from functools import reduce

numbers = [12, 18, 24, 30]

# ✅ 좋은 예: reduce 사용
gcd_result = reduce(gcd, numbers)

# ❌ 나쁜 예: 반복문 (코드가 길어짐)
result = numbers[0]
for num in numbers[1:]:
    result = gcd(result, num)
```

### 5. 0과의 GCD

```python
from math import gcd

# gcd(a, 0) = a
print(gcd(5, 0))   # 5
print(gcd(0, 5))   # 5
print(gcd(0, 0))   # 0

# 주의: 코딩테스트에서 0이 입력될 수 있음!
```

### 6. 음수 처리

```python
from math import gcd

# math.gcd()는 음수도 처리 가능
print(gcd(-12, 18))   # 6
print(gcd(12, -18))   # 6
print(gcd(-12, -18))  # 6

# 하지만 LCM은 음수 결과 주의!
def lcm(a, b):
    return abs(a * b) // gcd(a, b)  # abs() 사용 권장
```

### 7. 성능 최적화 체크리스트

```python
# 1. 약수 구하기: √n까지만
def get_divisors(n):
    for i in range(1, int(n**0.5) + 1):  # ✅
        pass

# 2. GCD: 유클리드 호제법 또는 math.gcd()
from math import gcd  # ✅

# 3. LCM: 공식 사용
def lcm(a, b):
    return a // gcd(a, b) * b  # ✅

# 4. 소수 판별: √n까지만
def is_prime(n):
    for i in range(2, int(n**0.5) + 1):  # ✅
        pass

# 5. 소수 여러 개: 에라토스테네스의 체
primes = sieve_of_eratosthenes(n)  # ✅
```

<br>

## 시간 복잡도 정리

| 연산 | Naive | 최적화 | 비고 |
|------|-------|--------|------|
| 배수 확인 | O(1) | O(1) | `n % m == 0` |
| 약수 구하기 | O(n) | O(√n) | √n까지만 확인 |
| 최대공약수 | O(min(a,b)) | O(log(min(a,b))) | 유클리드 호제법 |
| 최소공배수 | O(a×b) | O(log(min(a,b))) | GCD 활용 공식 |
| 소수 판별 | O(n) | O(√n) | √n까지만 확인 |
| n 이하 소수 | O(n²) | O(n log log n) | 에라토스테네스 |
| 소인수분해 | O(n) | O(√n) | 2부터 √n까지 |

<br>

## 핵심 공식 정리

### 1. GCD & LCM 관계

$$
\gcd(a, b) \times \text{lcm}(a, b) = a \times b
$$

$$
\text{lcm}(a, b) = \frac{a \times b}{\gcd(a, b)}
$$

### 2. 유클리드 호제법

$$
\gcd(a, b) = \gcd(b, a \bmod b)
$$

### 3. 약수의 개수 (소인수분해)

$$
n = p_1^{a_1} \times p_2^{a_2} \times \cdots \times p_k^{a_k}
$$

$$
\text{약수 개수} = (a_1 + 1)(a_2 + 1) \cdots (a_k + 1)
$$

### 4. 약수의 합 (소인수분해)

$$
\text{약수 합} = \frac{p_1^{a_1+1} - 1}{p_1 - 1} \times \frac{p_2^{a_2+1} - 1}{p_2 - 1} \times \cdots
$$

### 5. 오일러 파이 함수

$$
\phi(n) = n \times \left(1 - \frac{1}{p_1}\right) \times \left(1 - \frac{1}{p_2}\right) \times \cdots
$$

<br>

## 연습 문제 추천

### 기초

- [프로그래머스] 최대공약수와 최소공배수
- [프로그래머스] 약수의 합
- [백준 2609] 최대공약수와 최소공배수
- [백준 1934] 최소공배수
- [백준 2981] 검문

### 중급

- [프로그래머스] N개의 최소공배수
- [프로그래머스] 약수의 개수와 덧셈
- [백준 1850] 최대공약수
- [백준 2824] 최대공약수
- [백준 1735] 분수 합

### 고급

- [백준 17425] 약수의 합
- [백준 11689] GCD(n, k) = 1
- [백준 4375] 1
- [백준 1837] 암호제작
- [백준 11653] 소인수분해

<br>

## 마무리 체크리스트

- [ ] 배수와 약수의 개념 이해
- [ ] 약수 구하기 √n 최적화
- [ ] 유클리드 호제법 원리 이해
- [ ] math.gcd() 사용법 숙지
- [ ] LCM 공식 (a×b / gcd) 암기
- [ ] 소인수분해 구현
- [ ] 서로소 개념 이해
- [ ] 여러 수의 GCD/LCM (reduce)
- [ ] 오버플로우 주의 (나눗셈 먼저)
- [ ] 0, 음수 처리 주의

<br>

## References

- [Python 공식 문서 - math.gcd](https://docs.python.org/ko/3/library/math.html#math.gcd)
- [Python 공식 문서 - math.lcm](https://docs.python.org/ko/3/library/math.html#math.lcm)
- [위키백과 - 유클리드 호제법](https://ko.wikipedia.org/wiki/%EC%9C%A0%ED%81%B4%EB%A6%AC%EB%93%9C_%ED%98%B8%EC%A0%9C%EB%B2%95)
- [위키백과 - 최대공약수](https://ko.wikipedia.org/wiki/%EC%B5%9C%EB%8C%80%EA%B3%B5%EC%95%BD%EC%88%98)
- [위키백과 - 최소공배수](https://ko.wikipedia.org/wiki/%EC%B5%9C%EC%86%8C%EA%B3%B5%EB%B0%B0%EC%88%98)
- [프로그래머스 - 연습문제](https://school.programmers.co.kr/)
- [백준 온라인 저지](https://www.acmicpc.net/)
