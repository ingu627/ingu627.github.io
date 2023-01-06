---
layout: single
title: "[Effective Python] 3장 함수 리뷰"
excerpt: "파이썬 코딩의 기술 개정 2판 책에 대한 내용입니다. try, exception, 언패킹, 타입 애너테이션, 클로저, 위치 인자, args, kwargs, 데코레이터"
categories: python
tag : [파이썬 코딩의 기술, 언패킹, assert, raise, 예외, except, try, 타입 애너테이션, 클로저, nonlocal, 위치 인자, args, 제너레이터, 키워드 인자, kwargs, 독스트링, 위치로만 인자, 키워드만 사용하는 인자, 데코레이터, pdf, 정리]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-07-01
---

<img align='right' width='150' height='150' src='https://user-images.githubusercontent.com/78655692/170685528-4060a9d3-172e-45d8-897b-3a8eb539970c.png'>
요즘 파이썬을 사용하면서 자연스레 좀 더 효율적으로 코드를 짜고 싶은 마음이 커졌습니다. 그래서 이 책을 공부하기 시작했습니다. <br> 이 글은 개인 공부를 목적으로 작성되었습니다. <br> 혹시 오타나 글의 수정사항이 있어 알려주시면 감사하겠습니다.
{: .notice--info}

<br>
<br>
<br>
<br>

- **함수**를 이용하면 큰 프로그램을 더 작고 간단한 조각으로 나누고, 각 조각이 어떤 일을 하는지 알려주는 이름을 붙일 수 있다.
- **함수**를 사용하면 가독성이 좋아지고 코드에 더 쉽게 접근할 수 있다.
- 재사용과 리팩터링도 쉬워진다.

## Better way 19: 함수가 여러 값을 반환하는 경우 절대로 네 값 이상을 언패킹하지 말라

- 언패킹을 사용하면 함수가 둘 이상의 값을 반환할 수 있다.
- 다음은 두 값을 반환하는 함수를 이용한 코드이다.

    ```python
    def get_stats(numbers):
        minimum = min(numbers)
        maximum = max(numbers)
        return minimum, maximum

    lengths = [63, 73, 72, 60, 67]

    minimum, maximum = get_stats(lengths)
    print(f'최소: {minimum}, 최대: {maximum}')
    # 최소: 60, 최대: 73
    ```

<br>

- 하지만, 언패킹의 값이 4개 이상이면 가독성이 떨어지고, 에러가 나기 쉽기 때문에 변수를 4개 이상 사용하지 않는다. 
- 다음은 언패킹의 값을 4개 이상 썼을 경우이다.

    ```python
    # 안 좋은 예시
    lengths = [63, 73, 72, 60, 67, 66, 71, 61, 72, 70]

    def get_stats(numbers):
        minimum = min(numbers)
        maximum = max(numbers)
        count = len(numbers)
        average = sum(numbers) / count
        
        sorted_numbers = sorted(numbers)
        middle = count // 2
        if count % 2 == 0:
            lower = sorted_numbers[middle - 1]
            upper = sorted_numbers[middle]
            median = (lower + upper) / 2
        else:
            median = sorted_numbers[middle]
        
        return minimum, maximum, average, median, count

    minimum, maximum, average, median, count = get_stats(lengths)

    print(f'최소 길이: {minimum}, 최대 길이: {maximum}')
    print(f'평균: {average}, 중앙값: {median}, 개수: {count}')
    # 최소 길이: 60, 최대 길이: 73
    # 평균: 67.5, 중앙값: 68.5, 개수: 10
    ```

<br>
<br>

## Better way 20: None을 반환하기보다는 예외를 발생시켜라

- 특별히 의미를 표시하는 None을 반환하는 함수를 사용하면 None과 다른 값이 조건문에서 False로 평가될 수 있기 때문에 실수하기 쉽다.
- 아래 코드를 봐본다.

    ```python
    def careful_divide(a,b):
        try:
            return a / b
        except ZeroDivisionError:
            return None

    x, y = 1, 0
    result = careful_divide(x, y)
    if result is None:
        print("잘못된 입력")
    # 잘못된 입력
    ```

<br>

- 이보다 더 나은 방법은 특별한 경우에 결코 None을 반환하지 않는 것이다.
- 대신 Exception을 호출한 쪽으로 발생시켜서 호출자가 이를 처리하게 된다.
- 다음 코드에서는 `ZeroDivisionError`가 발생한 경우 이를 ValueError로 바꿔 던져 호출한 쪽에 입력 값이 잘못됐음을 알린다.
  - **raise** : 사용자가 직접 에러를 발생시키는 기능 [^1]

    ```python
    def careful_divide(a, b):
        try:
            return a / b
        except ZeroDivisionError as e:
            raise ValueError('잘못된 입력') # raise 

    x, y = 5, 2
    try:
        result = careful_divide(x, y)
    except ValueError:
        print('잘못된 입력')
    else:
        print('결과는 %.1f 입니다.' % result)
    # 결과는 2.5 입니다.
    ```

<br>

- 하지만, 파이썬의 점진적 타입 지정에서는 함수의 인터페이스에 예외가 포함되는지 표현하는 방법이 의도적으로 제외됐다.
- **함수가 특별한 경우를 포함하는 그 어떤 경우에도 절대로 None을 반환하지 않는다는 사실을 타입 애너테이션으로 명시할 수 있다.**

    ```python
    def careful_divide(a: float, b: float):
        try:
            return a / b
        except ZeroDivisionError as e:
            raise ValueError('잘못된 입력')
    ```

<br>
<br>

## Better way 21: 변수 영역과 클로저의 상호작용 방식을 이해하라

- 숫자로 이뤄진 list를 정렬하되, 정렬한 리스트의 앞쪽에는 우선순위를 부여한 몇몇 숫자를 위치시켜야 한다면, 리스트의 sort 메서드에 key 인자로 도우미 함수를 전달하는 방법이 있다.
  - **도우미 함수**는 주어진 원소가 중요한 숫자 그룹에 들어 있는지 검사해서 정렬 기준값을 적절히 조정해준다.

    ```python
    def sort_priority(values, group):
        def helper(x):
            if x in group:
                return (0, x) 
            return (1, x)
        
        values.sort(key=helper)

    numbers = [8,3,1,2,5,4,7,6]
    group = {2,3,5,7}
    sort_priority(numbers, group)
    print(numbers)
    # [2, 3, 5, 7, 1, 4, 6, 8]
    ```

- 이 함수가 작동하는 이유가 있다.
1. 파이썬이 클로저(closure)를 지원한다.
   - **클로저**: 자신이 정의된 영역 밖의 변수를 참조하는 함수
2. 파이썬에서 함수가 일급 시민(first-class citizen) 객체이다.
   - **일급 시민 객체**: 직접 가리키거나, 변수에 대입하거나 다른 함수에 인자로 전달할 수 있으며, 식이나 if 문에서 함수를 비교하거나 함수에서 반환하는 것 등이 가능하다는 의미
3. 파이썬에는 시퀀스를 비교하는 구체적인 규칙이 있다.
   - 시퀀스를 비교할 때 0번 인덱스에 있는 값을 비교한 다음, 이 값이 같으면 다시 1번 인덱스에 있는 값을 비교한다.

<br>

- 식 안에서 변수를 참조할 때 파이썬 인터프리터는 이 참조를 해결하기 위해 다음 순서로 영역을 찾는다.

1. 현재 함수의 영역
2. 현재 함수를 둘러싼 영역
3. 현재 코드가 들어 있는 모듈의 영역
4. 내장 영역

- 변수가 이 네 가지 영역에 없으면 `NameError` 예외가 발생한다.

<br>
<br>

## Better way 22: 변수 위치 인자를 사용해 시각적인 잡음을 줄여라

- **위치 인자(positional argument)**를 가변적으로 받으면 함수 호출이 깔끔해지고 시각적 잡음도 줄어든다.(관례적으로 `*args`를 붙임)
  - `*`연산자는 파이썬이 시퀀스의 원소들을 함수의 위치 인자로 넘길 것을 명령한다.
- 다음 코드는 디버깅 정보를 로그에 남기고 싶을 때의 예제이다.
  - 로그 메시지의 첫 번째 파라미터는 필수이지만, 그 이후는 `*args`를 써서 선택 사항으로 남긴다.

    ```python
    def log(message, *values):
        if not values:
            print(message)
        else:
            values_str = ', '.join(str(x) for x in values)
            # join은 앞의 구분자를 통해 문자를 합쳐준다.
            # 형태 : '구분자'.join(시퀀스)
            print(f'{message}: {values_str}')

    log('내 숫자는', 1, 2, 3)
    log('안녕')
    # 내 숫자는: 1, 2, 3
    # 안녕
    ```

<br>
<br>

## Better way 23: 키워드 인자로 선택적인 기능을 제공하라

- 파이썬 함수에서는 모든 일반적인 인자를 키워드를 사용해 넘길 수 있다.

    ```python
    def remainder(number, divisor):
        return number % divisor

    remainder(number=20, divisor=7) # 6
    remainder(divisor=7, number=20) # 6
    ```

<br>

- 딕셔너리의 내용물을 사용해 remainder와 같은 함수를 호출하고 싶다면 `**연산자`를 사용하면 된다.
  - `**연산자`는 파이썬이 딕셔너리에 들어 있는 값을 함수에 전달하되 각 값에 대응하는 키를 키워드로 사용하도록 명령한다.

    ```python
    my_kwargs = {
        'number': 20,
        'divisor': 7
    }
    assert remainder(**my_kwargs) == 6 # 틀릴시 AssertionError가 나온다.
    ```

<br>

- 아무 키워드 인자나 받는 함수를 만들고 싶다면, 모든 키워드 인자를 dict에 모아주는 `**kwargs` 파라미터를 사용한다.
  - 함수 본문에서는 이 dict를 사용해 필요한 처리를 할 수 있다.

    ```python
    def print_parameters(**kwargs):
        for key, value in kwargs.items():
            print(f'{key} = {value}')

    print_parameters(alpha=1.5, beta=9, 감마=4)
    # alpha = 1.5
    # beta = 9
    # 감마 = 4
    ```

<br>

- 키워드 인자는 세 가지 이점이 있다.
  1. 키워드 인자를 사용하면 코드를 처음 보는 사람들에게 함수 호출의 의미를 명확히 알려 줄 수 있다.
  2. 키워드 인자의 경우 함수 정의에서 디폴트 값을 지정할 수 있다.
  3. 키워드 인자와 디폴트 값을 함께 사용하면 기본 호출 코드를 마이그레이션하지 않고도 함수에 새로운 기능을 쉽게 추가할 수 있다.

<br>
<br>

## Better way 24: None과 독스트링을 사용해 동적인 디폴트 인자를 지정하라

- 키워드 인자의 값이 정적으로 정해지지 않는 타입의 값을 써야 할 때가 있다.

    ```python
    from time import sleep
    from datetime import datetime

    def log(message, when=datetime.now()):
        print(f'{when}: {message}')

    log('안녕')
    sleep(0.1)
    log('다시 안녕!')
    # 2022-07-01 23:22:59.699421: 안녕
    # 2022-07-01 23:22:59.699421: 다시 안녕!
    ```

- 하지만, 디폴트 인자는 이런 식으로 작동되지 않는데, 함수가 정의되는 시점에 `datetime.now`이 단 한번만 호출되기 때문에 타임스탬프가 항상 같게 나온다.
- 이런 경우 원하는 동작을 달성하는 파이썬의 일반적인 관례는 디폴트 값으로 None을 지정하고 실제 동작을 독스트링에 문서화하는 것이다.

    ```python
    def log(message, when=None):
        """메시지와 타임스탬프를 로그에 남긴다.

        Args:
            message : 출력할 메시지
            when : 메시지가 발생한 시각. 디폴트 값은 현재 시간
        """
        
        if when is None:
            when = datetime.now()
        print(f'{when}: {message}')

    log('안녕')
    sleep(0.1)
    log('다시 안녕!')
    # 2022-07-01 23:34:15.530000: 안녕
    # 2022-07-01 23:34:15.635037: 다시 안녕!
    ```

<br>
<br>

## Better way 25: 위치로만 인자를 지정하게 하거나 키워드로만 인자를 지정하게 해서 함수 호출을 명확하게 만들라

- **키워드만 사용하는 인자**는 키워드를 반드시 사용해 지정해야 하며, 절대 위치를 기반으로는 지정할 수 없다.
- 이와는 반대로 **위치로만 지정하는 인자**는 반드시 위치만 사용해 인자를 지정해야 하고 키워드 인자로는 쓸 수 없다.
  - 인자 목록에서 `/`와 `*` 기호 사이에 있는 모든 파라미터는 위치를 사용해 전달할 수도 있고 이름을 키워드로 사용해 전달할 수도 있다.
  - `/` 앞은 위치로만 지정하는 인자가 오며, `*` 뒤는 키워드만 사용하는 인자가 온다.
- API의 스타일이나 필요에 따라 두 인자 전달 방식을 모두 사용하면 가독성을 높이고 잡음도 줄일 수 있다.
- 다음 예제는 한 숫자를 다른 숫자로 나눌 때 세심하게 주의를 기울여야 하는 특별한 경우가 있는지 알고 싶을 때이다. 
  - 때로는 `ZeroDivisionError` 예외를 무시하고 무한대를 반환하고 싶고, 어떨 때는 `OverflowError` 예외를 무시하고 대신 0을 반환하고 싶다.

    ```python
    def safe_division_e(numerator, denominator, /,
                        ndigits=10, *,
                        ignore_overflow=False,
                        ignore_zero_division=False):
        try:
            fraction = numerator / denominator
            return round(fraction, ndigits)
        except OverflowError:
            if ignore_overflow:
                return 0
            else:
                raise
        except ZeroDivisionError:
            if ignore_zero_division:
                return float('inf')
            else:
                raise

    result = safe_division_e(22, 7)
    print(result) # 3.1428571429

    result = safe_division_e(22, 7, 5)
    print(result) # 3.14286

    result = safe_division_e(22, 7, ndigits=2)
    print(result) # 3.14
    ```

<br>
<br>

## Better way 26: functools.wrap을 사용해 함수 데코레이터를 정의하라

- **데코레이터(decorator)**는 자신이 감싸고 있는 함수가 호출되기 전과 후에 코드를 추가로 실행해준다.
  - 이는 데코레이터가 자신이 감싸고 있는 함수의 입력 인자, 반환 값, 함수에서 발생한 오류에 접근할 수 있다는 뜻이다.
- 함수의 의미를 강화하거나 디버깅을 하거나 함수를 등록하는 등의 일에 이런 기능을 유용하게 쓸 수 있다.
- 데코레이터를 함수에 적용할 때는 `@` 기호를 사용한다.
  - `@` 기호를 사용하는 것은 이 함수에 대해 데코레이터를 호출한 후, 데코레이터가 반환한 결과를 원래 함수가 속해야 하는 영역에 원래 함수와 같은 이름으로 등록하는 것과 같다.

    ```python
    def trace(func):
        def wrapper(*args, **kwargs):
            result = func(*args, **kwargs)
            print(f'{func.__name__}({args!r}, {kwargs!r}) '
                f'-> {result!r}')
            return result
        return wrapper

    @trace
    def fibonacci(n):
        """n번째 피보나치 수를 반환한다."""
        if n in (0,1):
            return n
        return (fibonacci(n - 2) + fibonacci(n - 1))

    fibonacci = trace(fibonacci)

    fibonacci(4)
    # fibonacci((0,), {}) -> 0
    # wrapper((0,), {}) -> 0
    # fibonacci((1,), {}) -> 1
    # wrapper((1,), {}) -> 1
    # fibonacci((2,), {}) -> 1
    # wrapper((2,), {}) -> 1
    # fibonacci((1,), {}) -> 1
    # wrapper((1,), {}) -> 1
    # fibonacci((0,), {}) -> 0
    # wrapper((0,), {}) -> 0
    # fibonacci((1,), {}) -> 1
    # wrapper((1,), {}) -> 1
    # fibonacci((2,), {}) -> 1
    # wrapper((2,), {}) -> 1
    # fibonacci((3,), {}) -> 2
    # wrapper((3,), {}) -> 2
    # fibonacci((4,), {}) -> 3
    # wrapper((4,), {}) -> 3
    ```






<br>
<br>
<br>
<br>

## References

[^1]: [파이썬 파트12. 예외처리 - try / except, raise](https://wayhome25.github.io/python/2017/02/26/py-12-exception/)