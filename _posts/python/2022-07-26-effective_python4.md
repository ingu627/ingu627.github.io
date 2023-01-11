---
layout: single
title: "[Effective Python] 4장 컴프리헨션과 제너레이터 리뷰"
excerpt: "파이썬 코딩의 기술 개정 2판 책에 대한 내용입니다. 컴프리헨션, 대입식, 제너레이터, 이터레이션, yield, yield from, throw, itertools"
categories: python
tag : [파이썬 코딩의 기술, 컴프리헨션, 대입식, 제너레이터, 이터레이션, yield, yield from, throw, itertools, 설명, 란, 정리, 정의, chain, repeat, cycle, tee, zip_longest, islice, takewhile, filterfalse, accumulate, product, pdf, 정리]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-07-27
---

<img align='right' width='150' height='150' src='https://user-images.githubusercontent.com/78655692/170685528-4060a9d3-172e-45d8-897b-3a8eb539970c.png'>
요즘 파이썬을 사용하면서 자연스레 좀 더 효율적으로 코드를 짜고 싶은 마음이 커졌습니다. 그래서 이 책을 공부하기 시작했습니다. <br> 이 글은 개인 공부를 목적으로 작성되었습니다. <br> 혹시 오타나 글의 수정사항이 있어 알려주시면 감사하겠습니다.
{: .notice--info}

<br>
<br>
<br>
<br>

- 파이썬에서는 **컴프리헨션**을 이용해 리스트, 딕셔너리, 집합 등 타입을 간결하게 이터레이션하면서 원소로부터 파생되는 데이터 구조를 생성할 수 있다.
- **제너레이터**는 함수가 점진적으로 반환하는 값으로 이뤄지는 스트림을 만들어준다.

## Better way 27: map과 filter 대신 컴프리헨션을 사용하라

- 파이썬은 다른 시퀀스나 이터러블에서 새 리스트를 만들어내는 간결한 구문을 제공하는 데, 이런 식을 **리스트 컴프리헨션**이라고 한다.

    ```python
    a = [x for x in range(1,11)]
    # [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    squares = [x**2 for x in a]
    print(squares)
    # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
    ```

<br>

- 리스트 컴프리헨션은 입력 리스트에서 원소를 쉽게 필터링해 결과에서 원하는 원소를 제거할 수 있다.

    ```python
    even_squares = [x**2 for x in a if x % 2 ==0]
    even_squares
    # [4, 16, 36, 64, 100]
    ```

<br>

- 또한 딕셔너리 컴프리헨션과 집합 컴프리헨션이 있다. 이를 사용하면 알고리즘을 작성할 때 딕셔너리나 집합에서 파생된 데이터 구조를 쉽게 만들 수 있다.

    ```python
    even_squares_dict = {x: x**2 for x in a if x % 2 == 0}
    even_squares_set = {x**3 for x in a if x % 3 == 0}
    print(even_squares_dict) # {2: 4, 4: 16, 6: 36, 8: 64, 10: 100}
    print(even_squares_set) # {216, 729, 27}
    ```

- 각각의 호출을 적절한 생성자로 감싸면 같은 결과를 map과 filter를 사용해 만들 수 있지만, 코드가 너무 길어지기 때문에 이를 사용하는 것은 가급적 피한다.

<br>
<br>

## Better way 28: 컴프리헨션 내부에 제어 하위 식을 세 개 이상 사용하지 말라

- 컴프리헨션은 기본적인 사용법 외에도 루프를 여러 수준으로 내포하도록 허용한다.
  - 아래 코드에서 각각의 하위 식은 컴프리헨션에 들어간 순서대로 왼쪽에서 오른쪽으로 실행된다.

    ```python
    matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    flat = [x for row in matrix for x in row]
    print(flat)
    # [1, 2, 3, 4, 5, 6, 7, 8, 9]
    ```

<br>

- 컴프리헨션은 여러 if 조건을 허용한다.
- 여러 조건을 같은 수준의 루프에 사용하면 암시적으로 and 식을 의미한다.

    ```python
    a = [x for x in range(1,11)]
    b = [x for x in a if x > 4 if x % 2 == 0]
    print(b) # [6, 8, 10]
    ```

<br>

- 하지만, 제어 하위 식이 세 개 이상인 컴프리헨션은 이해하기 매우 어려우므로 가능하면 피해야 한다.

<br>
<br>

## Better way 29: 대입식을 사용해 컴프리헨션 안에서 반복 작업을 피하라

- 컴프리헨션에서 같은 계산을 여러 위치에서 공유하는 경우가 많다.
  - 아래 코드는 **왈러스 연산자**를 사용하여 컴프리헨션의 일부분에 대입식을 만들었다.
    - 왈러스 연산자를 더 알고 싶다면, [이 링크](https://ingu627.github.io/python/effective_python1/#better-way-10-%EB%8C%80%EC%9E%85%EC%8B%9D%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%B4-%EB%B0%98%EB%B3%B5%EC%9D%84-%ED%94%BC%ED%95%98%EB%9D%BC)를 참조한다. 

    ```python
    stock = {
        '못': 125,
        '나사못': 35,
        '나비너트': 8,
        '와셔': 24,
    }

    order = ['나사못', '나비너트', '클립']

    def get_batches(count, size):
        return count // size

    found = {name: batches for name in order
            if (batches := get_batches(stock.get(name, 0 ), 8))
            }
    print(found) # {'나사못': 4, '나비너트': 1}
    ```

- 대입식(`batch := get_batches(...)`)을 사용하면 stock 딕셔너리에서 각 order 키를 한 번만 조회하고 get_batches를 한 번만 호출해서 그 결과를 batches 변수에 저장할 수 있다.

<br>

- 하지만 컴프리헨션이 값 부분에서 왈러스 연산자를 사용할 때 그 값에 대한 조건 부분이 없다면 루프 밖 영역으로 루프 변수가 누출된다.
  - 루프 변수를 누출하지 않는 편이 낫기 때문에 **컴프리헨션에서 대입식을 조건에만 사용하는 것을 권장한다.**

<br>
<br>

## Better way 30: 리스트를 반환하기보다는 제너레이터를 사용하라.

- 다음은 문자열에서 띄어쓰기 위치를 반환할 때의 코드이다. 

  ```python
  def index_words(text):
      result = []
      if text:
          result.append(0)
      for index, letter in enumerate(text):
          if letter == ' ':
              result.append(index + 1)
      return result
    
  address = '영어로 된 코드(해석)는 잘 봐야 한다.'
  result = index_words(address)
  print(result) # [0, 4, 6, 14, 16, 19]
  ```

<br>

- 하지만, 위 코드는 핵심을 알아보기 힘들다. 그리고 리스트에 모든 결과를 다 저장해야 한다. 만약 입력 데이터가 크면 메모리가 부족할 수 있다.
  - 위 함수를 개선시키고자 제너레이트를 사용한다.
- **제너레이터**는 `yield` 식을 사용하는 함수에 의해 만들어진다.
  - **제너레이터(generator)**: 여러 개의 데이터를 미리 만들어 놓지 않고 필요할 때마다 즉석해서 하나씩 만들어낼 수 있는 객체 [^1]
  - `yield`를 사용하면 제너레이터를 반환한다.
  - 제너레이터가 yield에 전달하는 값은 이터레이터에 의해 호출하는 쪽에 반환된다.
  - 매번 제너레이터가 호출되면 yield에서 지정한 값을 반환한 후 다음 호출이 있을 때까지 자신의 상태를 정지시킨다.

  ```python
  def index_words_iter(text):
      if text:
          yield 0
      for index, letter in enumerate(text):
          if letter == ' ':
              yield index + 1 

  address = '영어로 된 코드(해석)는 잘 봐야 한다.'
  it = index_words_iter(address)
  print(next(it)) # 0
  print(next(it)) # 4
  print(next(it)) # 6
  ```

<br>

- 제너레이터가 반환하는 이터레이터를 리스트 내장 함수에 넘기면 필요할 때 제너레이터를 쉽게 리스트로 변환할 수 있다.
- **iter 용어 정리** [^2]
  - **이터레이트(iterate)**: 객체 안의 값을 차례대로 받는 것을 뜻한다.
  - **이터러블(iterable)**: 받은 값을 순환값이라하고, 순한 과능한 객체를 이터러블이라 한다. `__iter__`이 정의된 객체
  - **이터레이터(iterator)**: `__next__`가 정의된 객체

  ```python
  result = list(index_words_iter(address))
  print(result) # [0, 4, 6, 14, 16, 19]
  ```

<br>
<br>

## Better way 31: 인자에 대해 이터레이션할 때는 방어적이 돼라

- 이터레이터는 결과를 단 한 번만 만들어낸다.
- 재사용 목적이 있다면, 이터레이터의 전체 내용을 리스트에 넣어 사용한다.
  - 하지만, 이터레이터의 내용을 복사하면 메모리가 엄청 소모될 수 있다.
- **이터레이터 프로토콜(iterator protocol)**은 파이썬의 for 루프나 그와 연관된 식들이 컨테이너 타입의 내용을 방문할 때 사용하는 절차다.
  - 파이썬에서 `for x in foo`와 같은 구문을 사용하면, 실제로는 iter(foo)를 호출한다.
  - iter 내장 함수는 `foo.__iter__`라는 특별 메서드를 호출한다.
  - `__iter__` 메서드는 반드시 이터레이터 객체를 반환해야 한다.
  - for 루프는 반환받은 이터레이터 객체가 데이터를 소진할 때까지 반복적으로 이터레이터 객체에 대해 next 내장 함수(`__next__`)를 호출한다.
- `__iter__` 메서드를 제너레이터로 정의하면 쉽게 이터러블 컨테이너 타입을 정의할 수 있다.

  ```python
  class Test:
      def __init__(self, data_path):
          self.data_path = data_path
      
      def __iter__(self):
          with open(self.data_path) as f:
              for line in f:
                  yield int(line)
          
  path = 'f:/data/test.txt'

  test = Test(path)
  list(test) # [12, 1, 2, 3, 4, 7]
  ```

> with : 파일을 접근할 때 with 문으로 실행하면 오류 발생 여부와 관계없이 마지막에 close를 해주는 기능을 한다. [^3]

<br>
<br>

## Better way 32: 긴 리스트 컴프리헨션보다는 제너레이터 식을 사용하라

- 입력이 작은 경우만 처리할 수 있는 방식으로 리스트 컴프리헨션을 사용한다.

  ```python
  value = [int(x) for x in open('test.txt')]
  print(value) # [100, 57, 15, 1, 12, 75, 5, 86, 89, 11]
  ```

<br>

- **제너레이터 식(generator expression)**은 리스트 컴프리헨션과 제너레이터를 일반화한 것이다.
  - 제너레이터 식을 실행해도 출력 시퀀스 전체가 실체화되지는 않는다.
  - 그 대신 제너레이터 식에 들어 있는 식으로부터 원소를 하나씩 만들어내는 이터레이터가 생성된다.
  - `( )` 사이에 리스트 컴프리헨션과 비슷한 구문을 넣어 제너레이터 식을 만들 수 있다.
- next 내장 함수를 사용하여 다음 값을 가져온다.
- 제너레이터 식을 사용하면 메모리를 모두 소모하는 것을 염려할 필요 없이 원소를 원하는 대로 가져와 소비할 수 있다.

  ```python
  value = (int(x) for x in open('test.txt'))
  print(value)
  # <generator object <genexpr> at 0x0000017CF87E97B0>

  print(next(value)) # 100
  print(next(value)) # 57
  ```

<br>

- 제너레이터 식의 또 다른 특징은 두 제너레이터 식을 합성할 수 있다는 점이다.

  ```python
  roots = ((x, x**0.5) for x in value)

  print(next(roots)) # (15, 3.872983346207417)
  print(next(roots)) # (1, 1.0)
  ```

<br>
<br>

## Better way 33: yield from을 사용해 여러 제너레이터를 합성하라

- `yield from`은 파이썬 인터프리터가 사용자 대신 for 루프를 내포시키고 yield 식을 처리하도록 만든다.
- `yield from` 식을 사용하면 여러 내장 제너레이터를 모아서 제너레이터 하나로 합성할 수 있다.

  ```python
  def num_generator():
      x= [1, 2, 3]
      y = [2, 3]
      yield from x
      yield from y
      
  
  for i in num_generator():
      print(i)
  
  # 1
  # 2
  # 3
  # 2
  # 3
  ```

- yield from에 반복가능한 객체(ex. 리스트)를 지정하면 리스트에 들어있는 요소를 한 개씩 바깥으로 전달한다. [^4] 위의 코드는 총 next 함수를 5번 호출한다. 

<br>
<br>

## Better way 34: send로 제너레이터에 데이터를 주입하지 말라

- send 메서드를 사용해 데이터를 제너레이터에 주입할 수 있다. 제너레이터는 send로 주입된 값을 yield 식이 반환하는 값을 통해 받으며, 이 값을 변수에 저장해 활용할 수 있다.
- 하지만 합성할 제너레이터들의 입력으로 이터레이터를 전달하는 방식이 send를 사용하는 방식보다 더 낫다. send는 가급적 사용하지 말라고 조언한다.

<br>
<br>

## Better way 35: 제너레이터 안에서 throw로 상태를 변화시키지 말라

- 제너레이터의 고급 기능으로 제너레이터 안에서 Exception을 다시 던질 수 있는 throw 메서드가 있다.
  - 어떤 제너레이터에 대해 throw가 호출되면 이 제너레이터는 값을 내놓은 yield로부터 평소처럼 제너레이터 실행을 계속하는 대신 throw가 제공한 Exception을 다시 던진다.
- 이 기능은 제너레이터와 제너레이터를 호출하는 쪽 사이에 양방향 통신 수단을 제공한다.

  ```python
  class MyError(Exception):
      pass

  def my_generator():
      yield 1
      
      try:
          yield 2
      except MyError:
          print('MyError 발생')
      else:
          yield 3
      
      yield 4

  it = my_generator()
  print(next(it)) 
  print(next(it))
  print(it.throw(MyError('test error')))
  # 1
  # 2
  # MyError 발생
  # 4
  ```

<br>

- 하지만 throw를 사용하면 가독성이 나빠지기 때문에 제너레이터에서 예외적인 동작을 제공하는 더 나은 방법은 `__iter__` 메서드를 구현하는 클래스를 사용하면서 예외적인 경우에 상태를 전이시키는 것이다.

<br>
<br>

## Better way 36: 이터레이터나 제너레이터를 다룰 때는 itertools를 사용하라

- itertools 내장 모듈에는 이터레이터를 조직화하거나 사용할 때 쓸모 있는 여러 함수가 들어 있다.
- 이터레이터나 제너레이터를 다루는 itertools 함수는 세 가지 범주로 나눌 수 있다.
  - 여러 이터레이터를 연결함
  - 이터레이터의 원소를 걸러냄
  - 원소의 조합을 만들어냄

<br>

### 여러 이터레이터 연결하기

### chain

- 여러 이터레이터를 하나의 순차적인 이터레이터로 합치고 싶을 때 chain을 사용한다.

  ```python
  import itertools

  it = itertools.chain([1,2,3], [4,5,6])
  list(it) # [1, 2, 3, 4, 5, 6]
  ```

<br>

### repeat

- 한 값을 계속 반복해 내놓고 싶을 때 repeat를 사용한다. 
- 이터레이터가 값을 내놓는 횟수를 제한하려면 repeat의 두 번째 인자로 최대 횟수를 지정하면 된다.

  ```python
  it = itertools.repeat('안녕', 3)
  list(it) # ['안녕', '안녕', '안녕']
  ```

<br>

### cycle

- 어떤 이터레이터가 내놓는 원소들을 계속 반복하고 싶을 때는 cycle을 사용한다.

  ```python
  it = itertools.cycle([1, 2])
  result = [next(it) for _ in range(10)]
  print(result) # [1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
  ```

<br>

### tee

- 한 이터레이터를 병렬적으로 두 번째 인자로 지정된 개수의 이터레이터로 만들고 싶을 때 tee를 사용한다.

  ```python
  it1, it2 = itertools.tee(['하나', '둘'], 2)
  print(list(it1))
  print(list(it2))

  # ['하나', '둘']
  # ['하나', '둘']
  ```

<br>

### zip_longest

- zip_longest는 여러 이터레이터 중 짧은 쪽 이터레이터의 원소를 다 사용한 경우 fillvalue로 지정한 값을 채워 넣어준다.
  - fillvalue로 아무 값도 지정하지 않으면 None을 넣는다.

  ```python
  keys = ['하나', '둘', '셋']
  values = [1, 2]

  normal = list(zip(keys, values))
  print('zip: ', normal) 

  it = itertools.zip_longest(keys, values, fillvalue='없음')
  longest = list(it)
  print('zip_longest: ', longest)

  # zip:  [('하나', 1), ('둘', 2)]
  # zip_longest:  [('하나', 1), ('둘', 2), ('셋', '없음')]
  ```

<br>
<br>

### 이터레이터에서 원소 거르기 

### islice

- 이터레이터를 복사하지 않으면서 원소 인덱스를 이용해 슬라이싱하고 싶을 때 islice를 사용한다.

  ```python
  values = [x for x in range(1, 11)]

  first_five = itertools.islice(values, 5)
  print('앞에서 다섯 개:', list(first_five))

  middle_odds = itertools.islice(values, 2, 8, 2)
  print('중간의 홀수들: ', list(middle_odds))

  # 앞에서 다섯 개: [1, 2, 3, 4, 5]
  # 중간의 홀수들:  [3, 5, 7]
  ```

<br>

### takewhile

- takewhile은 이터레이터에서 주어진 술어가 False를 반환하는 첫 원소가 나타날 때까지 원소를 돌려준다.

  ```python
  values = [x for x in range(1, 11)]
  less_than_seven = lambda x: x<7
  it = itertools.takewhile(less_than_seven, values)
  print(list(it))
  # [1, 2, 3, 4, 5, 6]
  ```

<br>

### filterfalse

- filterfalse는 filter 내장 함수의 반대다.

  ```python
  values = [x for x in range(1, 11)]
  evens = lambda x: x % 2 == 0

  filter_false_result = itertools.filterfalse(evens, values)
  print(list(filter_false_result))
  # [1, 3, 5, 7, 9]
  ```

<br>
<br>

### 이터레이터에서 원소의 조합 만들어내기

### accumulate

- accumulate는 파라미터를 두 개 받는 함수를 반복 적용하면서 이터레이터 원소를 값 하나로 줄여준다. 
- 이 함수가 돌려주는 이터레이터는 원본 이터레이터의 각 원소에 대해 누적된 결과를 내놓는다.

  ```python
  values = [x for x in range(1, 11)]
  sum_reduce = itertools.accumulate(values)
  print('합계: ', list(sum_reduce))

  def sum_modulo_20(first, second):
      output = first + second 
      return output % 20

  modulo_reduce = itertools.accumulate(values, sum_modulo_20)
  print('20으로 나눈 나머지의 합계: ', list(modulo_reduce))

  # 합계:  [1, 3, 6, 10, 15, 21, 28, 36, 45, 55]
  # 20으로 나눈 나머지의 합계:  [1, 3, 6, 10, 15, 1, 8, 16, 5, 15]
  ```

<br>

### product

- product는 하나 이상의 이터레이터에 들어 있는 아이템들의 데카르트 곱(Cartesian product)을 반환한다.

  ```python
  single = itertools.product([1,2], repeat=2)
  print(list(single))

  multiple = itertools.product([1,2], ['a', 'b'])
  print(list((multiple)))

  # [(1, 1), (1, 2), (2, 1), (2, 2)]
  # [(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]
  ```

<br>

### permutations

- permutations는 이터레이터가 내놓는 원소들로부터 만들어낸 길이 N인 순열을 돌려준다.

  ```python
  it = itertools.permutations([1,2,3], 2)
  print(list(it))
  # [(1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2)]
  ```

<br>

### combinations

- combinations는 이터레이터가 내놓는 원소들로부터 만들어낸 길이 N인 조합을 돌려준다.

  ```python
  it = itertools.combinations([1,2,3], 2)
  print(list(it))
  # [(1, 2), (1, 3), (2, 3)]
  ```

<br>
<br>
<br>
<br>

## References

[^1]: [파이썬의 yield 키워드와 제너레이터(generator)](https://www.daleseo.com/python-yield/)
[^2]: [이터러블-제너레이터(1)](https://ghfkddorl.github.io/section_python/001_%EC%9D%B4%ED%84%B0%EB%9F%AC%EB%B8%941/)
[^3]: [파이썬 with 정리 - pydocs](https://pythondocs.net/uncategorized/%ED%8C%8C%EC%9D%B4%EC%8D%AC-with-%EC%A0%95%EB%A6%AC/)
[^4]: [40.3 yield from으로 값을 여러 번 바깥으로 전달하기 - 코딩도장](https://dojang.io/mod/page/view.php?id=2414)

