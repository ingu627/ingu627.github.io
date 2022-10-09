---
layout: single
title: "[Effective Python] 5장 클래스와 인터페이스 리뷰"
excerpt: "파이썬 코딩의 기술 개정 2판 책에 대한 내용입니다. "
categories: python
tag : [python, 파이썬, pdf, 정리, 문법, 효율, 사용법, 란, 뜻, 클래스, 함수, class, def, super, mixin, public, private]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-10-08
---

<img align='right' width='150' height='150' src='https://user-images.githubusercontent.com/78655692/170685528-4060a9d3-172e-45d8-897b-3a8eb539970c.png'>
요즘 파이썬을 사용하면서 자연스레 좀 더 효율적으로 코드를 짜고 싶은 마음이 커졌습니다. 그래서 이 책을 공부하기 시작했습니다. <br> 이 글은 개인 공부를 목적으로 작성되었습니다. <br> 혹시 오타나 글의 수정사항이 있어 알려주시면 감사하겠습니다.
{: .notice--info}

<br>
<br>
<br>

- 객체지향 언어로서 파이썬은 상속(inheritance), 다형성(polymorphism), 캡슐화(encapsulation) 등과 같은 모든 기능을 제공한다.
- 클래스와 상속을 사용하는 방법을 알아두면 유지 보수하기 쉬운 코드를 작성할 수 있다.

<br>

## Better way 37: 내장 타입을 여러 단계로 내포시키기보다는 클래스를 합성하라

- 파이썬 내장 딕셔너리 타입을 사용하면 객체의 생명 주기 동안 동적인 내부 상태를 잘 유지할 수 있다.
  - **동적(dynamic)** : 어떤 값이 들어올지 미리 알 수 없는 식별자들을 유지해야 한다는 뜻이다.
- **코드**

    ```python
    class SimpleGradebook:
        def __init__(self):
            self._grades = {}
        
        def add_student(self, name):
            self._grades[name] = []
        
        def report_grade(self, name, score):
            self._grades[name].append(score)
        
        def average_grade(self, name):
            grades = self._grades[name]
            return sum(grades) / len(grades)

    book = SimpleGradebook()
    book.add_student('포은')
    book.report_grade('포은', 90)
    book.report_grade('포은', 95)
    book.report_grade('포은', 85)

    print(book._grades) # {'포은': [90, 95, 85]}
    print(book.average_grade('포은')) # 90.0
    ```

<br>

- 파이썬 내장 딕셔너리와 튜플은 사용하기 편하므로 내부에 계속 딕셔너리, 리스트, 튜플 계층을 추가해가면서 코드를 사용하기 쉽다.
- 하지만 내포 단계가 두 단계 이상이 되면 더 이상 딕셔너리, 리스트 튜플 계층을 추가하지 말아야 한다.
- 코드에서 값을 관리하는 부분이 점점 복잡해지고 있음을 깨달은 즉시 해당 기능을 클래스로 분리해야 한다.

<br>

### 클래스를 활용해 리팩터링하기

- 다음 코드에서는 리스트 안에 점수를 저장하기 위해 튜플을 사용한다.
  - **_** : 파이썬에서 사용하지 않는 변수 이름을 표시할 때 관례적으로 사용하는 밑줄
- **코드**

    ```python
    grades = []
    grades.append((95, 0.45, 'A'))
    grades.append((85, 0.55, 'B'))
    total = sum(score * weight for score, weight, _ in grades)
    total_weight = sum(weight for _, weight, _ in grades)
    average_grade = total / total_weight # 89.5
    ```

<br>

- 하지만 원소가 세 개 이상인 튜플을 사용한다면 다른 접근 방법을 생각해봐야 한다.
  - **collection** 내장 모듈에 있는 **namedtuple**을 사용하면 작은 불변 데이터 클래스를 쉽게 선택할 수 있다.
- **코드**

    ```python
    from collections import namedtuple

    Grade = namedtuple('Grade', ('score', 'weight'))
    ```
    
- 이 클래스의 인스턴스를 만들 때는 위치 기반 인자를 사용해도 되고 키워드 인자를 사용해도 된다.
- 필드에 접근할 때는 애트리뷰트 이름을 쓸 수 있다.
- 이름이 붙은 애트리뷰트를 사용할 수 있으므로 요구 사항이 바뀌는 경우에 `namedtuple`을 클래스로 변경하기도 쉽다.

<br>

- 이제 일련의 점수를 포함하는 단일 과목을 표현하는 클래스를 작성할 수 있다.
- **코드**

    ```python
    class Subject:
        def __init__(self):
            self._grades = []
            
        def report_grade(self, score, weight):
            self._grades.append(Grade(score, weight))
        
        def average_grade(self):
            total, total_weight = 0, 0
            for grade in self._grades:
                total += grade.score * grade.weight
                total_weight = grade.weight
            return total / total_weight
    ```

<br>

- 다음으로 한 학생이 수강하는 과목들을 표현하는 클래스를 작성할 수 있다.
- **코드**

    ```python
    from collections import defaultdict


    class Student:
        def __init__(self):
            self._subjects = defaultdict(Subject) # 내부 딕셔너리
        
        def get_subject(self, name):
            return self._subjects[name]
        
        def average_grade(self):
            total, count = 0, 0
            for subject in self._subjects.values():
                total += subject.average_grade()
                count += 1
            return total / count
    ```

<br>

- 마지막으로 모든 학생을 저장하는 컨테이너를 만들 수 있다.
  - 이때 이름을 사용해 동적으로 학생을 저장한다.
- **코드**

    ```python
    class Gradebook:
        def __init__(self):
            self._students = defaultdict(Student)
        
        def get_student(self, name):
            return self._students[name]
    ```

<br>

- 코드는 길어졌지만 클래스를 사용하는 예제 코드도 더 읽기 쉽고 확장성이 좋아졌다.
- **코드**

    ```python
    book = Gradebook()
    poeun = book.get_student('포은')
    math = poeun.get_subject('수학')
    math.report_grade(75, 0.05)
    math.report_grade(65, 0.15)
    math.report_grade(70, 0.80)
    gym = poeun.get_subject('체육')
    gym.report_grade(100, 0.40)
    gym.report_grade(85, 0.60)
    print(poeun.average_grade()) # 119.27083333333334
    ```

<br>
<br>

## Better way 38: 간단한 인터페이스의 경우 클래스 대신 함수를 받아라

- 파이썬 내장 API 중 상당수는 함수를 전달해서 동작을 원하는 대로 바꿀 수 있게 해준다.
- API가 실행되는 과정에서 사용자가 전달한 함수를 실행하는 경우, 이런 함수를 **훅(hook)**이라고 부른다.
- 다음 코드는 key 훅으로 len 내장 함수를 전달해서 이름이 들어 있는 리스트를 이름의 길이에 따라 정렬한다.
- **코드**

    ```python
    names =['소크라테스', '아르키메데스', '플라톤', '아리스토텔레스']
    names.sort(key=len)
    print(names) # ['플라톤', '소크라테스', '아르키메데스', '아리스토텔레스']
    ```

<br>

- 함수는 클래스보다 정의하거나 기술하기가 더 쉬우므로 훅으로 사용하기에는 함수가 이상적이다.
- 또한, 파이썬은 함수를 **일급 시민 객체**로 취급하기 때문에 함수를 훅으로 사용할 수 있다.
- 예를 들어, defaultdict 클래스의 동작을 사용자 정의하고 싶다고 해본다.
- defaultdict에는 딕셔너리 안에 없는 키에 접근할 경우 호출되는 인자가 없는 함수를 전달할 수 있다.
- 다음 코드는 존재하지 않는 키에 접근할 때 로그를 남기고 0을 디폴트 값으로 반환한다.
  - log_missing과 같은 함수를 사용할 수 있으면 정해진 동작과 부수 효과를 분리할 수 있기 때문에 API를 더 쉽게 만들 수 있다.
- **코드**

    ```python
    def log_missing():
        print('키 추가됨')
        return 0
    ```

<br>

- 원본 딕셔너리와 변경할 내용이 주어진 경우, log_missing 함수는 로그를 두 번 남길 수 있다.
- **코드**

    ```python
    from collections import defaultdict

    current = {'초록': 12, '파랑': 3}
    increments = {
        ('빨강', 5),
        ('파랑', 17),
        ('주황', 9)
    }
    result = defaultdict(log_missing, current)
    print('이전', dict(result))
    for key, amount in increments:
        result[key] += amount
    print('이후', dict(result))

    # 결과
    # 이전 {'초록': 12, '파랑': 3}
    # 키 추가됨
    # 키 추가됨
    # 이후 {'초록': 12, '파랑': 20, '빨강': 5, '주황': 9}
    ```

<br>

- 다음 코드는 이런 클로저가 있는 도우미 함수를 디폴트 값 훅으로 사용한다.
- **코드**

    ```python
    def increment_with_report(current, increments):
        added_count = 0

        def missing():
            nonlocal added_count # 상태가 있는 클로저
            added_count += 1
            return 0
        
        result = defaultdict(missing, current)
        for key, amount in increments:
            result[key] += amount
        
        return result, added_count
    ```

<br>

- 인터페이스에서 간단한 함수를 인자로 받으면 클로저 안에 상태를 감추는 기능 계층을 쉽게 추가할 수 있다.
- **코드**

    ```python
    result, count = increment_with_report(current, increments)
    assert count == 2
    ```

<br>

- 파이썬에서는 클래스에 `__call__` 특별 메서드를 정의할 수 있다.
- `__call__`을 사용하면 객체를 함수처럼 호출할 수 있다.
- 그리고 `__call__`이 정의된 클래스의 인스턴스에 대해 callable 내장 함수를 호출하면, 다른 일반 함수나 메서드와 마찬가지로 True가 반환된다.
  - 이런 방식으로 정의돼서 호출될 수 있는 모든 객체를 **호출 가능(callable) 객체**라고 부른다.
  - 즉, 상태를 저장하는 클로저 역할이다.
- **코드**

    ```python
    class CountMissing:
        def __init__(self):
            self.added = 0
        
        def __call__(self):
            self.added += 1
            return 0

    counter = CountMissing()
    assert counter() == 0
    assert callable(counter)
    ```

<br>

- 다음 코드는 CountMissing 인스턴스를 defaultdict의 디폴트 값 훅으로 사용해서 존재하지 않는 키에 접근한 횟수를 추적한다.
- **코드**

    ```python
    counter = CountMissing()
    result = defaultdict(counter, current) # __call__에 의존함
    for key, amount in increments:
        result[key] += amount
    assert counter.added == 2
    ```

<br>
<br>

## Better way 39: 객체를 제너릭하게 구성하려면 @classmethod를 통한 다형성을 활용하라

- **다형성**을 사용하면 계층을 이루는 여러 클래스가 자신에게 맞는 유일한 메서드 버전을 구현할 수 있다.
  - 이는 같은 인터페이스를 만족하가너 같은 추상 기반 클래스를 공유하는 많은 클래스가 서로 다른 기능을 제공할 수 있다는 뜻이다.
- 예를 들어 **맵리듀스(MapReduce)** 구현을 하나 작성하고 있는데, 입력 데이터를 표현할 수 있는 공통 클래스가 필요하다고 해본다.
- 다음 코드는 이럴 때 사용하기 위해 정의한, 하위 클래스에서 다시 정의해야만 하는 read 메서드가 들어 있는 공통 클래스를 보여준다.
  - `@classmethod`가 적용된 클래스 메서드는 공통 인터페이스를 통해 새로운 InputData 인스턴스를 생성한다.
    - **@classmethod**를 사용하면 클래스에 다른 생성자를 정의할 수 있다.
  - generate_inputs는 GenericInputData의 구체적인 하위 클래스가 객체를 생성하는 방법을 알려주는 설정 정보가 들어 있는 딕셔너리를 파라미터로 받는다. 
- **코드**

    ```python
    class GenericInputData:
        def read(self):
            raise NotImplementedError
        
        @classmethod
        def generate_inputs(cls, config):
            raise NotImplementedError
    ```

<br>

- 이 InputData의 구체적인 하위 클래스를 만들면서 디스크에서 파일을 읽게 할 수 있다.
- PathInputData와 같이 원하면 얼마든지 InputData의 하위 클래스를 만들 수 있다.
- 다음 코드는 입력 파일이 들어 있는 디렉터리를 찾기 위해 이 config를 사용한다.
- **코드**

    ```python
    class PathInputData(GenericInputData):
        def __init__(self, path):
            super().__init__()
            self.path = path

        def read(self):
            with open(self.path) as f:
                return f.read()
            
        @classmethod
        def generate_inputs(cls, config):
            data_dir = config['data_dir']
            for name in os.listdir(data_dir):
                yield cls(os.path.join(data_dir, name))
    ```

<br>

- 이 입력 데이터를 소비하는 공통 방법을 제공하는 맵리듀스 워커(worker)로 쓸 수 있는 추상 인터페이스를 정의한다.
  - create_workers가 `__init__` 메서드를 직접 호출하지 않고 cls()를 호출함으로써 다른 방법으로 GenericWorker 객체를 만들 수 있다.
- **코드**

    ```python
    class GenericWorker:
        def __init__(self, input_data):
            self.input_data = input_data
            self.result = None

        def map(self):
            raise NotImplementedError

        def reduce(self, other):
            raise NotImplementedError

        @classmethod
        def create_workers(cls, input_class, config):
            workers = []
            for input_data in input_class.generate_inputs(config):
                workers.append(cls(input_data))
            return workers
    ```

<br>

- 다음 코드는 원하는 맵리듀스 기능을 구현하는 Worker의 구체적인 하위 클래스다.
- **코드**

    ```python
    class LineCountWorker(GenericWorker):
        def map(self):
            data = self.input_data.read()
            self.result = data.count('\n')
        
        def reduce(self, other):
            self.result += other.result
    ```

<br>

- 다음 코드는 디렉터리의 목록을 얻어서 그 안에 들어 있는 파일마다 PathInputData 인스턴스를 만든다.
  - 도우미 함수를 활용해 객체를 직접 만들고 연결한다.
- **코드**
  
    ```python
    import os

    def generate_inputs(data_dir):
        for name in os.listdir(data_dir):
            yield PathInputData(os.path.join(data_dir, name))
    ```

<br>

- 다음으로 방금 generate_inputs를 통해 만든 InputData 인스턴스들을 사용하는 LineCountWorker 인스턴스를 만든다.
- **코드**

    ```python
    def create_workers(input_list):
        workers = []
        for input_data in input_list:
            workers.append(LineCountWorker(input_data))
        return workers
    ```

<br>

- 이 Worker 인스턴스의 map 단계를 여러 스레드에 공급해서 실행할 수 있다.
- 그 후 reduce를 반복적으로 호출해서 결과를 최종 값으로 합칠 수 있다.
- **코드**

    ```python
    from threading import Thread

    def execute(workers):
        threads = [Thread(target=w.map) for w in workers]
        for thread in threads: thread.start()
        for thread in threads: thread.join()
        
        first, *rest = workers
        for worker in rest:
            first.reduce(worker)
        return first.result
    ```

<br>

- mapreduce 함수가 create_workers를 호출하게 변경해서 mapreduce를 완전한 제너릭 함수로 만들 수 있다.
- **코드**

    ```python
    def mapreduce(worker_class, input_class, config):
        workers = worker_class.create_workers(input_class, config)
        return execute(workers)
    ```

<br>

- 몇 가지 입력 파일을 대상으로 이 함수를 실행해본다.
- **코드**

    ```python
    import os
    import random

    def write_test_files(tmpdir):
        os.makedirs(tmpdir)
        for i in range(100):
            with open(os.path.join(tmpdir, str(i)), 'w') as f:
                f.write('\n' * random.randint(0, 100))

    config = {'data_dir', tmpdir}
    result = mapreduce(LineCountWorker, PathInputData, config)
    print(f'총 {result} 줄이 있습니다.')
    ```

<br>
<br>

## Better way 40: super로 부모 클래스를 초기화하라

- 자식 클래스에서 부모 클래스를 초기화하는 오래된 방법은 자식 인스턴스에서 부모 클래스의 `__init__` 메서드를 직접 호출하는 것이다.
  - 이 접근 방법은 기본적인 클래스 계층의 경우에는 잘 작동하지만, 다른 경우에는 잘못될 수 있다.
- **코드**

    ```python
    class MyBaseClass:
        def __init__(self, value):
            # 여기서 객체에게 사용자가 제공한 값을 저장한다.
            # 사용자가 제공하는 값은 문자열로 탕비 변환이 가능해야 하며
            # 일단 한번 객체 내부에 설정되고 나면
            # 불변 값으로 취급돼야 한다.
            self.value = value

    class MyChildClass(MyBaseClass):
        def __init__(self):
            MyBaseClass.__init__(self, 5)
    ```

<br>

- 다중 상속을 사용하는 경우 생기는 문제 중 하나는 모든 하위 클래스에서 `__init__` 호출의 순서가 정해져 있지 않다는 것이다.
- **super**를 사용하면 다이아몬드 계층의 공통 상위 클래스를 단 한번만 호출하도록 보장한다.
  - **다이아몬드 상속**이란 어떤 클래스가 두 가지 서로 다른 클래스를 상속하는데, 두 상위 클래스의 상속 계층을 거슬러 올라가면 조상 클래스가 존재하는 경우를 뜻한다.
  - **MRO(Method Resolution Order)**는 상위 클래스를 초기화하는 순서를 결정한다.
- **코드**

    ```python
    class TimesSevenCorrect(MyBaseClass):
        def __init__(self, value):
            super().__init__(value)
            self.value *= 7

    class PlusNineCorrect(MyBaseClass):
        def __init__(self, value):
            super().__init__(value)
            self.value += 9

    class GoodWay(TimesSevenCorrect, PlusNineCorrect):
        def __init__(self, value):
            super().__init__(value)

    foo = GoodWay(5)
    print('7 * (5 + 9) = 98 형태로 나와야 함', foo.value)
    ```

<br>
<br>

## Better way 41: 기능을 합성할 때는 믹스인 클래스를 사용하라

- 다중 상속이 제공하는 편의와 캡슐화가 필요하지만 다중 상속으로 인해 발생할 수 있는 골치 아픈 경우는 피하고 싶다면, **믹스인(mix-in)**을 사용할지 고려해본다.
  - **믹스인**은 자식 클래스가 사용할 메서드 몇 개만 정의하는 클래스다.
  - 믹스인 클래스에는 자체 애트리뷰트 정의가 없으므로 믹스인 클래스의 `__init__` 메서드를 호출할 필요도 없다.

<br>
<br>

## Better way 42: 비공개 이튜리뷰트보다는 공개 애트리뷰트를 사용하라

- 파이썬에서 클래스의 애트리뷰트에 대한 가시성은 **공개(public)**와 **비공개(private)**, 두 가지밖에 없다.
- **코드**

    ```python
    class MyObject:
        def __init__(self):
            self.public_field = 5
            self.__private_field = 10
        
        def get_private_field(self):
            return self.__private_field

    foo = MyObject()
    assert foo.public_field == 5
    ```

- 객체 뒤에 점 연산자(`.`)를 붙이면 공개 애트리뷰트에 접근할 수 있다.
- 애트리뷰트 이름 앞에 밑줄을 두 개 (`__`) 붙이면 비공개 필드가 된다.
  - 비공개 필드를 포함하는 클래스 안에 있는 메서드에서는 해당 필드에 직접 접근할 수 있다.

<br>
<br>

## Better way 43: 커스텀 컨테이너 타입은 collections.abc를 상속하라

- 모든 파이썬 클래스는 함수와 애트리뷰트를 함께 캡슐화하는 일종의 컨테이너라 할 수 있다.
- 파이썬은 데이터를 관리할 때 사용할 수 있도록 리스트, 튜플, 집합, 딕셔너리 등의 내장 컨테이너 타입을 제공한다.
- 파이썬에서는 특별한 이름의 인스턴스 메서드(`__getitem__`)를 사용해 컨테이너의 동작을 구현한다.




<br>
<br>
<br>
<br>

## References




