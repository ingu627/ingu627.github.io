---
layout: single
title: "[Effective Python] 1장 파이썬답게 생각하기 리뷰"
excerpt: "파이썬 코딩의 기술 개정 2판 책에 대한 내용입니다. PEP 8 style, f-문자열, 도우미 함수, 대입, enumerate, zip, 반복문, 대입식..."
categories: python
tag : [파이썬 코딩의 기술, 버전, sys, pep8, 공백, 명명, str, f 문자열, 대입, 언패킹, unpacking, enumerate, iterable, range, next, zip, 대입식, 왈러스, pdf, 정리]
toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2022-08-21
---

<img align='right' width='150' height='150' src='https://user-images.githubusercontent.com/78655692/170685528-4060a9d3-172e-45d8-897b-3a8eb539970c.png'>
요즘 파이썬을 사용하면서 자연스레 좀 더 효율적으로 코드를 짜고 싶은 마음이 커졌습니다. 그래서 이 책을 공부하기 시작했습니다. <br> 이 글은 개인 공부를 목적으로 작성되었습니다. <br> 혹시 오타나 글의 수정사항이 있어 알려주시면 감사하겠습니다.
{: .notice--info}

<br>
<br>
<br>
<br>

## Better way 1: 사용 중인 파이썬의 버전을 알아두라

- **--version** 파이썬의 버전을 알기
  
    ```python
    !python --version # 파이썬 코드 안에서
    # Python 3.9.12
    ```

<br>

- sys의 값을 검사하여 파이썬 버전 알기

    ```python
    import sys
    print(sys.version_info)
    print(sys.version)

    # sys.version_info(major=3, minor=9, micro=12, releaselevel='final', serial=0)
    # 3.9.12 (main, Apr  4 2022, 05:22:27) [MSC v.1916 64 bit (AMD64)]
    ```

<br>
<br>

## Better way 2: PEP 8 스타일 가이드를 따르라

- **PEP 8** : 파이썬 개선 제안(Python Enhancement Proposal) #8으로, 파이썬 코드를 어떤 형식으로 작성할지 알려주는 스타일 가이드
  - 일관된 스타일을 사용하면 코드에 더 친숙하게 접근하고, 코드를 더 쉽게 읽을 수 있다. 
  - 온라인 가이드 : https://www.python.org/dev/peps/pep-0008/

### 공백

- **공백** : 탭, 스페이스, 새줄 등의 문자를 모두 합한 말
- 일반적인 내용이여서 공백 규약은 생략한다.

<br>

### 명명 규약

- 함수, 변수, 애트리뷰트(attribute, 속성)는 lowercase_underscore처럼 소문자와 밑줄을 사용한다.
  - **속성(attribute)** : 클래스 내부에 포함돼 있는 메서드나 변수를 의미한다. [^4]
- protected instance attribute는 일반적인 애트리뷰트 이름 규칙을 따르되, _leading_underscore처럼 밑줄로 시작한다.
  - **protected** : protected로 선언된 attribute, method는 해당 클래스 또는 해당 클래스를 상속받은 클래스에서만 접근 가능 [^3]
- private instance attribute는 일반적인 애트리뷰트 이름 규칙을 따르되, __leading_underscore처럼 밑줄 두 개로 시작한다.
  - **private** : private로 선언된 attribute, method는 해당 클래스에서만 접근 가능 [^3]
- 클래스는 CapitalizedWord처럼 여러 단어를 이어 붙이되, 각 단어의 첫 글자를 대문자로 만든다.
- 모듈 수준의 상수는 ALL_CAPS처럼 모든 글자를 대문자로 하고 단어와 단어 사이를 밑줄로 연결한 형태를 사용한다.
- 클래스에 들어 있는 인스턴스 메서드는 호출 대상 객체를 가리키는 첫 번째 인자의 이름으로 반드시 self를 사용해야 한다.
  - **인스턴스(instance)** : 클래스를 실체화한 것이다. [^6]
- 클래스 메서드는 클래스를 가리키는 첫 번째 인자의 이름으로 반드시 cls를 사용해야 한다.

<br>

### 식과 문

- 한 줄짜리 if 문이나 한 줄짜리 for, while 루프, 한 줄짜리 except 복합문을 사용하지 않는다. 명확성을 위해 각 부분을 여러 줄에 나눠 배치한다.
- 식을 한 줄 안에 다 쓸 수 없는 경우, 식을 괄호로 둘렀고 줄바꿈과 들여쓰기를 추가해서 읽기 쉽게 만든다. 
- 여러 줄에 걸쳐 식을 쓸 때는 줄이 계속된다는 표시를 하는 \ 문자보다는 괄호를 사용한다.

    ```python
    # 예시
    (2+1
    + 2
    + 3)
    # 8
    ```

<br>
<br>

## Better way 3: bytes와 str의 차이를 알아두라

- str 인스턴스에는 사람이 사용하는 언어의 문자를 표현하는 유니코드 코드 포인트(code piont)가 들어 있다.
- 바이트(byte)를 사용하는 방법은 문자열 앞에 `b`를 붙여준다.

    ```python
    a = b'h\x65llo'
    print(list(a))
    # [104, 101, 108, 108, 111]
    print(a)
    # b'hello'
    print(type(a))
    # bytes
    ```

- 유니코드 데이터를 이진 데이터로 변환하려면 str의 encode 메서드를 호출해야 하고, 이진 데이터를 유니코드 데이터로 변환하려면 bytes의 decode 메서드를 호출해야 한다.
- 그리고, bytes와 str 인스턴스를 (>, ==, +, %와 같은) 연산자에 섞어서 사용할 수 없다.

    ```python
    print(b'one'+b'two')
    # b'onetwo'
    print(b'one'+'two')
    # TypeError: can't concat str to bytes
    ```

<br>
<br>

## Better way 4: C 스타일 형식 문자열을 str.format과 쓰기보다는 f-문자열을 통한 인터폴레이션을 사용하라. 

- **형식화(formatting)** : 미리 정의된 문자열에 데이터 값을 끼워 넣어서 사람이 보기 좋은 문자열로 저장하는 과정
- 가장 일반적인 방법으로 `%` 형식화 연산자를 사용한다.
- 그리고, 값이 여럿일 경우 tuple로 지정한다.

    ```python
    print('%s은 %d명이다.' % ('홍길동', 5))
    # 홍길동은 5명이다.
    ```

- 파이썬 3부터는 %를 사용하는 오래된 C 스타일 형식화 문자열보다 더 표현력이 좋은 고급 문자열 형식화 기능(**format 내장 함수**)이 도입됐다. 

    ```python
    print('{}은 {}명이다.'.format('홍길동', 5))
    # 홍길동은 5명이다.
    ```

<br>

### 인터폴레이션을 통한 형식 문자열

- 파이썬 3.6부터 인터폴레이션(interpolation)을 통한 형식 문자열(**f-문자열**)이 도입됐다.
- 형식 문자열 앞에 f 문자를 붙인다. 
- f-문자열은 형식 문자열의 표현력을 극대화하고, 형식화 문자열에서 키와 값을 불필요하게 중복 지정해야 하는 경우를 없애준다.
- f-문자열은 형식화 식 안에서 현재 파이썬 영역에서 사용할 수 있는 모든 이름을 자유롭게 참조할 수 있도록 허용함으로써 간결함을 제공한다.

    ```python
    print(f'{"홍길동"}은 {5}명이다.')
    # 홍길동은 5명이다.
    ```

<br>
<br>

## Better way 5: 복잡한 식을 쓰는 대신 도우미 함수를 작성하라.

- 한마디로, def(함수 정의), if/else 를 사용하라는 뜻이다.

<br>
<br>

## Better way 6: 인덱스를 사용하는 대신 대입을 사용해 데이터를 언패킹하라

- **튜플(tuple)**: 리스트(list)처럼 여러 개의 데이터를 저장할 때 사용 [^1]

    ```python
    working = {
        '노트북' : 0,
        '마우스' : 1,
        '헤드셋' : 2
    } # dictionary 형태
    print(working.items()) # items()은 키와 값을 한꺼번에 뽑아내줌
    # dict_items([('노트북', 0), ('마우스', 1), ('헤드셋', 2)])
    a = tuple(working.items()) # 튜플로 묶음
    print(a)
    # (('노트북', 0), ('마우스', 1), ('헤드셋', 2))
    ```

- 튜플에 있는 값은 숫자 인덱스를 사용해 접근할 수 있다.
- 인덱스를 통해 새값을 대입해서 튜플을 변경할 수는 없다.

    ```python
    print(a[0]) # ('노트북', 0)
    print(a[0][0]) # '노트북'
    print(a[1]) # ('마우스', 1)
    ```

<br>

- 파이썬에는 **언패킹(unpacking)(풀기)**가 있는데, 언패킹 구문을 사용하면 한 문장 안에서 여러 값을 대입할 수 있다.
- 리스트, 시퀀스, 이터러블(iterable) 안에 여러 계층으로 이터러블이 들어간 경우 다양한 패터을 언패킹 구문에 사용할 수 있다.

```python
notebook, mouse, headset = a
print(notebook)
# ('노트북', 0)
```

<br>
<br>

## Better way 7: range보다는 enumerate를 사용하라

- **iterable** : 반복가능한 객체
  - `iter` 내장 함수를 쓴다.
- **range** : 어떤 정수 집합을 이터레이션하는 루프가 필요할 때 유용
  - `range(시작숫자, 종료숫자, step)` [^2]
  - 시작숫자부터 종료숫자 바로 앞 숫자까지 컬렉션을 만든다.

    ```python
    for i in range(5):
        print(i+1, end=' ') # print의 end default는 \n이다.
    # 1 2 3 4 5 

    alist = ['안', '녕', '하', '세', '요']
    for i in alist:
        print(i, end='')
    # 안녕하세요
    ```

<br>

- **enumerate**는 이터레이터를 지연 계산 제너레이터(lazy generator)로 감싼다.
  - **느긋한 계산법(Lazy evaluation)** : 계산의 결과값이 필요할 때까지 계산을 늦추는 기법이다. [^5]
  - 제너레이터의 next가 호출되어야만 실제로 파일에서 한줄을 읽는 등을 지연실행이라 한다.
- **enumerate**는 루프 인덱스와 이터레이터의 다음 값으로 이뤄진 쌍을 넘겨준다. (yield)
  - 기본적으로 인덱스와 원소로 이루어진 튜플(tuple)을 만들어 준다.
- **next** 내장 함수를 사용해 다음 원소를 가져온다.

    ```python
    flavor_list = ['바닐라', '초콜릿', '민트', '딸기']

    next(enumerate(flavor_list))
    # (0, '바닐라')

    for i, flavor in enumerate(flavor_list):
        print(i, flavor)

    # 0 바닐라
    # 1 초콜릿
    # 2 민트
    # 3 딸기
    ```

<br>
<br>

## Better way 8: 여러 이터레이터에 대해 나란히 루프를 수행하려면 zip을 사용하라

- **zip** : 둘 이상의 이터레이터를 지연 계산 제너레이터를 사용해 묶어준다.
- zip 제너레이터는 각 이터레이터의 다음 값이 들어 있는 튜플을 반환한다. 
- 입력 이터레이터의 길이가 서로 다르면 zip은 아무런 경고도 없이 가장 짧은 이터레이터 길이까지만 튜플을 내놓고 더 긴 이터레이터의 나머지 원소는 무시한다.

    ```python
    for i in zip('12345', 'ABCDE'):
        print(i)

    # ('1', 'A')
    # ('2', 'B')
    # ('3', 'C')
    # ('4', 'D')
    # ('5', 'E')
    ```

<br>

- 가장 짧은 이터레이터에 맞춰 길이에 제한하지 않고 길이가 서로 다른 이터레이터에 대해 루프를 수행하려면 itertools 내장 모듈의 **zip_longest** 함수를 사용한다.

    ```python
    import itertools

    for i in itertools.zip_longest('123', 'ABCDE'):
        print(i)

    # ('1', 'A')
    # ('2', 'B')
    # ('3', 'C')
    # (None, 'D')
    # (None, 'E')    
    ```

<br>
<br>

## Better way 9: for나 while 루프 뒤에 else 블록을 사용하지 말라

- 파이썬은 for나 while 루프에 속한 블록 바로 뒤에 else 블록을 허용하는 특별한 문법을 제공한다.
- 루프 뒤에 오는 else 블록은 루프가 반복되는 도중에 break를 만나지 않은 경우에만 실행된다.

<br>
<br>

## Better way 10: 대입식을 사용해 반복을 피하라

- 대입식은 영어로 assignment expression이며 왈러스 연산자(walrus operator)라고도 부른다. (파이선 3.8에서 새롭게 도입된 구문)
  - `:=` 왈러스라 부른다.
- 대입식은 대입문이 쓰일 수 없는 위치에서 변수에 값을 대입할 수 있으므로 유용하다.
- 하나의 식 안에서 변수에 값을 대입하면서 이 값을 평가할 수 있고, 중복을 줄일 수 있다.

    ```python
    # 기존
    flavor_list = ['바닐라', '초콜릿', '민트', '딸기']

    n = len(flavor_list)

    if n < 5:
        print(f"리스트 개수는 {n}입니다.")
    # 리스트 개수는 4입니다.
    ```

    <br>

    ```python
    # 왈러스 이용 
    flavor_list = ['바닐라', '초콜릿', '민트', '딸기']

    if (n := len(flavor_list)) < 5:
        print(f"리스트 개수는 {n}입니다.")
    # 리스트 개수는 4입니다.
    ```

    <br>

- 대입식은 리스트 안에서 사용할 때도 가능하다.

    ```python
    a = 2

    [y := a, y**2, y**3]
    # [2, 4, 8]
    ```

    <br>

- 대입식이 더 큰 식의 일부분으로 쓰일 때는 괄호로 둘러싸야 한다.
- 파이썬에서는 switch/case 문이나 do/while 루프를 쓸 수 없지만, 대입식을 사용하면 이런 기능을 더 깔끔하게 흉내낼 수 있다.


<br>
<br>
<br>
<br>

## References

[^1]: [[파이썬] 튜플(tuple) - sunnamgung8](https://velog.io/@sunnamgung8/%ED%8C%8C%EC%9D%B4%EC%8D%AC-%ED%8A%9C%ED%94%8Ctuple)
[^2]: [파이썬 기본을 갈고 닦자! - 19. for in 반복문, Range, enumerate](https://wikidocs.net/16045)
[^3]: [객체지향(public, private, protected - 잔재미코딩)](https://www.fun-coding.org/PL&OOP1-5.html)
[^4]: [Python 강좌 : 제 37강 - 속성(Attribute) - Daehee YUN Tech Blog](https://076923.github.io/posts/Python-37/)
[^5]: [느긋한 계산법 - 위키백과](https://ko.wikipedia.org/wiki/%EB%8A%90%EA%B8%8B%ED%95%9C_%EA%B3%84%EC%82%B0%EB%B2%95)
[^6]: [[python] python의 self와 __init__의 이해 - 두더지 개발자](https://engineer-mole.tistory.com/190)