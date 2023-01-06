---
layout: single
title: "[Effective Python] 2장 리스트와 딕셔너리 리뷰"
excerpt: "파이썬 코딩의 기술 개정 2판 책에 대한 내용입니다. 시퀀스, 슬라이싱, 스트라이드, 언패킹, key, 딕셔너리, in, get, defaultdict, missing"
categories: python
tag : [파이썬 코딩의 기술, 시퀀스, 슬라이싱, 스트라이드, 언패킹, key, 딕셔너리, in, get, keyerror, setdefault, defaultdict, missing, pdf, 정리]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-06-02
---

<img align='right' width='150' height='150' src='https://user-images.githubusercontent.com/78655692/170685528-4060a9d3-172e-45d8-897b-3a8eb539970c.png'>
요즘 파이썬을 사용하면서 자연스레 좀 더 효율적으로 코드를 짜고 싶은 마음이 커졌습니다. 그래서 이 책을 공부하기 시작했습니다. <br> 이 글은 개인 공부를 목적으로 작성되었습니다. <br> 혹시 오타나 글의 수정사항이 있어 알려주시면 감사하겠습니다.
{: .notice--info}

<br>
<br>
<br>
<br>

## Better way 11: 시퀀스를 슬라이싱하는 방법을 익혀라

- 슬라이싱(slicing)을 사용하면 시퀀스에 들어 있는 아이템의 부분집합에 쉽게 접근할 수 있다.

  ![image](https://user-images.githubusercontent.com/78655692/171543679-31ea7ac0-3c61-434d-9890-909eeb456e76.png) <br> 이미지출처 [^1]


- 슬라이싱의 기본 형태는 `리스트[시작:끝]`이다.
  - 끝 인덱스에 있는 원소는 포함되지 않는다.
  - 리스트의 맨 앞부터 슬라이싱할 때는 기본적으로 0을 생략한다.
  - 리스트를 끝까지 슬라이싱 할때도 생략한다.
  - 리스트의 끝에서부터 원소를 찾고 싶을 때는 음수 인덱스를 사용하면 된다. (예: `-1`)

    ```python
    a = ['a', 'b', 'c', 'd', 'e', 'f']

    # assert : 이 코드는 내가 보증한다. 만약 거짓이면 AssertionError를 출력
    assert a[:4] == a[0:4]

    assert a[4:] == a[4:len(a)]
    ```

- 슬라이싱은 범위를 넘어가는 시작 인덱스나 끝 인덱스도 허용한다.

  ```python
  a[:10]
  # ['a', 'b', 'c', 'd', 'e', 'f']
  ```

- 리스트에 지정한 슬라이스 길이보다 대입되는 배열의 길이가 더 길어 리스트가 늘어난다.

  ```python
  a[2:3] = ['g', 'z']
  a
  # ['a', 'b', 'g', 'z', 'd', 'e', 'f']
  ```

<br>
<br>

## Better way 12: 스트라이드와 슬라이스를 한 식에 함께 사용하지 말라

- `리스트[시작:끝:증가값]`으로 일정한 간격을 두고 슬라이싱할 수 있다.
  - 이를 스트라이드(stride)라고 한다.

    ```python
    a = [1,2,3,4,5,6]

    print(a[::2])
    # [1, 3, 5]
    print(a[1::2])
    # [2, 4, 6]    
    ```

- 하지만, 슬라이딩 구문에 스트라이딩까지 들어가면 혼란스러울 수 있다.
- 따라서 시작값이나 끝값을 증가값과 함께 사용하지 않는다.
  - 증가값을 사용해야 하는 경우에는 양수값으로 만들고 시작과 끝 인덱스를 생략한다.
  - 만약, 세 파라미터를 모두 써야 하는 경우, 두 번 대입을 사용(한 번은 스트라이딩, 한 번은 슬라이싱)한다.

    ```python
    a = ['a', 'b', 'c', 'd', 'e', 'f']

    y = a[::2]
    z = y[:-1]
    z
    # ['a', 'c']
    ```

<br>
<br>

## Better way 13: 슬라이싱보다는 나머지를 모두 잡아내는 언패킹을 사용하라 

- 파이썬은 **별표 식(starred epression)**을 사용해 모든 값을 담는 언패킹을 할 수 있게 지원한다.
  - 이 구문을 사용하면 언패킹 패턴의 다른 부분에 들어가지 못하는 모든 값을 별이 붙은 부분에 다 담는다.
  - 별표 식은 항상 list 인스턴스가 된다.

    ```python
    car_ages = [0, 9, 4, 8, 7, 20, 19, 1, 6, 15]
    car_ages_l = sorted(car_ages, reverse=True)

    # first, second = car_ages_l # ValueError: too many values to unpack (expected 2)

    first, second, *others = car_ages_l
    print(first, second, others)
    # 20 19 [15, 9, 8, 7, 6, 4, 1, 0]
    ```

- 하지만 별표 식이 포함된 언패킹 대입을 처리하려면 필수인 부분이 적어도 하나는 있어야 한다.
- 또한, 한 수준의 언패킹 패턴에 별표 식을 두 개 이상 쓸 수 없다.
- 하지만, 여러 계층으로 이뤄진 구조를 언패킹할 때는 서로 다른 부분에 포함되는 한, 별표 식을 여러개 사용해도 된다.

<br>
<br>

## Better way 14: 복잡한 기준을 사용해 정렬할 때는 key 파라미터를 사용하라

- **sort**는 list의 메소드로 리스트의 내용을 원소 타입에 따른 자연스러운 순서를 사용해 오름차순으로 정렬한다.

  ```python
  numbers = [93, 86, 11, 68, 70]
  numbers.sort()
  print(numbers)
  # [11, 68, 70, 86, 93]
  ```

- `<list>.sort(key = <function>, reverse = <bool>)`
  - key 함수에는 정렬 중인 리스트의 원소가 전달된다.
  - key 함수가 반환하는 값은 원소 대신 정렬 기준으로 사용할, 비교 가능한 값이어야만 한다. 
  - 코드 출처 [^2]

    ```python
    # Str을 기준으로 정렬하기
    array = [[50, "apple"], [30, "banana"] , [400, "melon"]]
    array.sort(key = lambda x:x[1])
    print(array)
    # [[50, 'apple'], [30, 'banana'], [400, 'melon']]
    ```

<br>
<br>

## Better way 15: 딕셔너리 삽입 순서에 의존할 때는 조심하라

- 파이썬 3.6부터는 딕셔너리가 삽입 순서를 보존하도록 동작이 개선됐다.

  ```python
  baby_names = {
      'cat': 'kitten',
      'dog': 'puppy',
  }
  print(baby_names) # {'cat': 'kitten', 'dog': 'puppy'}
  print(list(baby_names.keys())) # ['cat', 'dog']
  print(list(baby_names.values())) # ['kitten', 'puppy']
  print(list(baby_names.items())) # [('cat', 'kitten'), ('dog', 'puppy')]
  print(baby_names.popitem()) # ('dog', 'puppy')
  print(baby_names) # {'cat': 'kitten'}
  ```

<br>

- 키워드 인자의 순서는 함수를 호출할 때 사용한 인자 순서와 일치한다.

  ```python
  def my_func(**kwargs): # **kwargs : 모든 인자를 얻을 때
      for key, value in kwargs.items():
          print(f'{key} = {value}')
          
  my_func(goose='gosling', kangaroo='joey')
  # goose = gosling
  # kangaroo = joey
  ```

<br>
<br>

## Better way 16: in을 사용하고 딕셔너리 키가 없을 때 KeyError를 처리하기보다는 get을 사용하라

- 딕셔너리와 상호작용하는 세 가지 기본 연산은 키나 키에 연관된 값에 접근하고, 대입하고, 삭제하는 것이다.
- 다음은 if문과 키가 존재할 때 참을 반환하는 in을 사용하는 코드이다.

  ```python
  counters = {
      '품퍼니켈': 2,
      '사워도우': 1,
  }

  key = '밀'

  if key in counters:
      count = counters[key]
  else:
      count = 0
      
  counters[key] = count + 1

  counters
  # {'품퍼니켈': 2, '사워도우': 1, '밀': 1}
  ```

<br>

- 다음은 존재하지 않는 키에 접근할 때 발생시키는 KeyError 예외를 활용하는 방법이다.

  ```python
  counters = {
      '품퍼니켈': 2,
      '사워도우': 1,
  }

  key = '밀'

  try:
      count = counters[key]
  except KeyError:
      count = 0
      
  counters[key] = count + 1

  counters
  # {'품퍼니켈': 2, '사워도우': 1, '밀': 1}
  ```

<br>

- 다음은 dict 내장 타입의 get 메서드를 활용한 방법이다. (추천)

  ```python
  counters = {
      '품퍼니켈': 2,
      '사워도우': 1,
  }

  key = '밀'

  count = counters.get(key, 0)
  counters[key] = count + 1

  counters
  # {'품퍼니켈': 2, '사워도우': 1, '밀': 1}
  ```

<br>
<br>

## Better way 17: 내부 상태에서 원소가 없는 경우를 처리할 때는 setdefault보다 defaultdict를 사용하라

- 직접 만들지 않은 딕셔너리를 다룰 때 키가 없는 경우를 처리하는 방법 중 경우에 따라서는 setdefault가 가장 빠른 지름길일 수 있다.

  ```python
  visits = {
      '미국': {'뉴욕', '로스엔젤로스'},
      '일본': {'하코네'}
  }

  # 딕셔너리 안에 나라 이름이 들어 있는지 여부와 관계없이
  # 각 집합에 새 도시를 추가할 때 setdefault를 사용할 수 있다.
  visits.setdefault('프랑스', set()).add('칸')

  print(visits)
  # {'미국': {'로스엔젤로스', '뉴욕'}, '일본': {'하코네'}, '프랑스': {'칸'}}
  ```

<br>

- collections 내장 모듈에 있는 **defaultdict 클래스**는 키가 없을 때 자동으로 디폴트 값을 저장해준다.

  ```python
  from collections import defaultdict

  class Visits():
      def __init__(self):
          self.data = defaultdict(set)
      
      def add(self, country, city):
          self.data[country].add(city)

  visits = Visits()
  visits.add('영국', '바스')
  visits.add('영국', '런던')
  print(visits.data)
  # defaultdict(<class 'set'>, {'영국': {'런던', '바스'}})
  ```

<br>
<br>

## Better way 18: __missing__을 사용해 키에 따라 다른 디폴트 값을 생성하는 방법을 알아두라

- 예를 들어 파일 시스템에 있는 SNS 프로필 사진을 관리하는 프로그램을 작성한다고 가정해본다.
- 그럼 필요할 때 파일을 읽고 쓰기 위해 프로필 사진의 경로와 열린 파일 핸들을 연관시켜주는 딕셔너리가 필요하다.

  ```python
  pictures = {}
  path = 'profile_1234.png'

  if (handle := pictures.get(path)) is None:
      try:
          handle = open(path, 'a+b')
      except OSError:
          print(f'경로를 열 수 없습니다: {path}')
          raise
  else:
      pictures[path] = handle

  handle.seek(0)
  image_data = handle.read()
  ```

<br>

- dict 타입의 하위 클래스를 만들고 __missing__ 특별 메서드를 구현하면 키가 없는 경우를 처리하는 로직을 커스텀화할 수 있다. 

  ```python
  def open_picture(profile_path):
      try:
          return open(profile_path, 'a+b')
      except OSError:
          print(f'경로를 열 수 없습니다: {profile_path}')
          raise

  class Pictures(dict):
      def __missing__(self, key):
          value = open_picture(key)
          self[key] = value
          return value

  pictures = Pictures()
  handle = pictures[path]
  handle.seek(0)
  image_data = handle.read()
  ```




  
<br>
<br>
<br>
<br>

## references

[^1]: [Let's Get IT 파이썬 프로그래밍 - 음수 인덱스 사용하기](https://thebook.io/080251/part01/ch06/01/03-06/)
[^2]: [파이썬 (Python) - (정렬 총정리) sort( ), sorted( ) , 특정 key를 기준으로 정렬하기 ,이중 리스트 정렬 , 다중 조건 정렬 - Newmon ](https://infinitt.tistory.com/122)





