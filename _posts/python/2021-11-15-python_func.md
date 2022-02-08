---
layout: single
title: "파이썬(python) 함수 기능 정리"
excerpt: "배웠던 것들. 알고리즘 사용한 것들, 모르는 것들, 헷갈리는 것들 (계속 업데이트)"
categories: python
tag : [python, function, definition]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-02-08
---

문제 풀기 : 알고리즘 문제에서 주어지는 것들을 구별한다. 나는 뼈대만 잡아준다. <br>순서는 상관없이 배우는 대로 정리를 해 나가고 있습니다.<br> 
{: .notice--danger}

## 파이썬 함수

### map(function, iterable)

- map은 리스트의 요소를 지정된 함수로 처리해주는 함수
- 첫 번째 매개변수로는 함수가 오고 두 번째 매개변수로는 반복 가능한 자료형(리스트, 튜플 등)이 온다.
- map 함수의 반환 값은 map객체 이기 때문에 해당 자료형을 list 혹은 tuple로 형 변환시켜주어야 한다.
  
<br>

### input()

- 사용자가 입력한 값을 어떤 변수에 대입하고 싶을 때
- input은 입력되는 모든 것을 문자열로 취급한다.

<br>

### split()

- 공백(스페이스, 탭, 엔터 등)을 기준으로 문자열을 나누어 준다

<br>

### 나눗셈

- **/** : 그냥 나눔 
- **//** : 몫
- **%** : 나머지

<br>

- **divmod(a,b)** : 매개변수로 받은 a를 b로 나눈다. 그리고 그 몫과 나머지를 튜플(tuple) 데이터 타입으로 반환합니다.
- 특수문자 표기는 `\` 앞에 쓰면 됨

<br>

###sys.stdin.readline()

- input 대신 씀

<br>

### index 

- 리스트에 x 값이 있으면 x의 위치 값을 돌려준다.

<br>

### count

- 리스트 안에 x가 몇 개 있는지 조사하여 그 개수를 돌려주는 함수이다.

<br>

### enumerate

- 인덱스 번호와 컬렉션의 원소를 tuple형태로 반환한다.
- enumerate는 "열거하다"라는 뜻이다.

<br>

### string.printable

- 인쇄 가능한 것으로 간주하는 ASCII 문자의 문자열

<br>

### zip(*iterable)

- 여러 개의 순회 가능한(iterable) 객체를 인자로 받고, 각 객체가 담고 있는 원소를 터플의 형태로 차례로 접근할 수 있는 반복자(iterator)를 반환한다.
- 동일한 개수로 이루어진 자료형을 묶어 주는 역할을 하는 함수이다.
- `*iterable`은 반복 가능(iterable)한 자료형 여러 개를 입력할 수 있다는 의미이다.

<br>

### set

- 집합. 중복되지 않은 원소를 얻고자 할 때
- 중복을 허용하지 않는다 / 순서가 없다(Unordered)
- `set()` : 비어있는 집합 만들기

<br>

### f-string

- f-string을 나타 낼 수 있게 문자열 앞에f를 입력하고 중괄호 사이에 {변수 : 소수점자리수} 순서로 작성

<br>

### add

- 집합에 요소를 추가할 때

<br>

### -

- 집합에서 차집합을 구할 때

<br>

### sorted(정렬할 데이터, key 파라미터, reverse 파라미터)

- 첫 번째 매개변수로 들어온 이터러블한 데이터를 새로운 정렬된 리스트로 만들어서 반환해 주는 함수

<br>

### sorted(iterable)

- 입력값을 정렬한 후 그 결과를 리스트로 돌려주는 함수이다.

<br>

### list[index] = value

- index 위치에 value 값을 넣어라

<br>

### list.append(a)

- 리스트 끝에 a값 추가

<br>

### list.insert(a, b)

- 리스트 a위치(=index)에 b 값 추가

<br>

### list.remove(a)

- 리스트에서 a값 제거

<br>

### list.pop()

- 리스트에 있는 마지막 값을 반환한 후 해당 값을 삭제하는 함수

<br>

### list.extend(list2)

- 리스트와 리스트2을 결합

<br>

### list.reverse()

- 리스트 요소들를 뒤집음

<br>

### ord()

- 문자의 아스키 코드값을 리턴하는 함수이다.

<br>

### chr()

- 아스키 코드값 입력으로 받아 그 코드에 해당하는 문자를 출력하는 함수이다.
- a부터 z까지는 97 ~ 122까지이다. 예를 들어 chr(97)=='a' , chr(122)=='z'

<br>

### 변수.find(찾을 문자) or 변수.index(찾을 문자)

- 변수에 위치한 문자열 중 괄호() 안에 넣은 특정 문자가 처음 위치한 자리의 값 반환
- find함수는 찾는 값이 없을 때 -1을 출력한다.
- 문자열을 찾을 수 있는 변수는 문자열만 사용이 가능하다.  리스트, 튜플, 딕셔너리 자료형에서는 find 함수를 사용할 수 없다.
- index함수는 찾는 문자가 없는 경우에 ValueError 에러가 발생한다.
- 문자열, 리스트, 튜플 자료형에서 사용 가능하고 딕셔너리 자료형에는 사용할 수 없어 AttributeError 에러가 발생한다.

<br>

### abs

- 어떤 숫자를 입력받았을 때, 그 숫자의 절댓값을 돌려주는 함수이다.

<br>

### all(x)

- 반복 가능한(iterable) 자료형 x를 입력 인수로 받으며 이 x의 요소가 모두 참이면 True, 거짓이 하나라도 있으면 False를 돌려준다.
  - **반복 가능한 자료형**이란 for문으로 그 값을 출력할 수 있는 것을 의미한다. 리스트, 튜플, 문자열, 딕셔너리, 집합 등이 있다.

<br>

### any(x)

- 반복 가능한(iterable) 자료형 x를 입력 인수로 받으며 이 x의 요소 중 하나라도 참이 있으면 True를 돌려주고, x가 모두 거짓일 때에만 False를 돌려준다. 
  - all(x)의 반대이다.

<br>

### dir

- 객체가 자체적으로 가지고 있는 변수나 함수를 보여 준다.

<br>

### eval(expression)

- 실행 가능한 문자열(1+2, 'hi' + 'a' 같은 것)을 입력으로 받아 문자열을 실행한 결괏값을 돌려주는 함수이다.

<br>

### filter(f, iterable)

- 첫 번째 인수로 함수 이름을, 두 번째 인수로 그 함수에 차례로 들어갈 반복 가능한 자료형을 받는다.<br>그리고 두 번째 인수인 반복 가능한 자료형 요소가 첫 번째 인수인 함수에 입력되었을 때 반환 값이 참인 것만 묶어서(걸러 내서) 돌려준다.
- 앞의 함수는 lambda를 사용하면 더욱 간편하게 코드를 작성할 수 있다.

<br>

### lambda 매개변수 : 표현식

- 함수표현식

<br>

### len(s)

- 입력값 s의 길이(요소의 전체 개수)를 돌려주는 함수이다.

<br>

### oct(x)

- 정수 형태의 숫자를 8진수 문자열로 바꾸어 돌려주는 함수이다. 

<br>

### hex(x)

- 정수 값을 입력받아 16진수(hexadecimal)로 변환하여 돌려주는 함수이다. 

<br>

### open(filename, [mode])

- "파일 이름"과 "읽기 방법"을 입력받아 파일 객체를 돌려주는 함수이다.

<br>

### range

- 이 함수는 입력받은 숫자에 해당하는 범위 값을 반복 가능한 객체로 만들어 돌려준다.

<br>

### round(number, ndigits)

- 숫자를 입력받아 반올림해 주는 함수이다.

<br>

### str(object)

- 문자열 형태로 객체를 변환하여 돌려주는 함수이다.

<br>

### upper()

- 문자열 대문자로 변경하는 함수

<br>

### lower()

- 문자열 소문자로 변경하는 함수

<br>

### capitalize()

- 주어진 문자열에서 맨 첫 글자를 대문자로 변환해줌.

<br>

### print()

- 결과물 출력
- 긴 문자열일 경우 `\`을 사용하여 여러 줄에 작성 가능
- **end=** : print에서 마지막 변경 (default = enter)
- **sep=** : 지정된 기호에 따라 문자열을 구분

<br>

### args

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

<br>

### kwargs

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

<br>

### class , object, instance

- 클래스(class)는 틀이고, 객체(object)는 이 틀에 만들어진 피조물을 뜻함 
  - **인스턴스(instance)** : 실체
  - **객체(object)** : 그 실체를 말함
- **클래스 정의** $\rightarrow$ **인스턴스명 = 클래스()** $\rightarrow$ 어떤 객체의 메서드를 사용할 때는 **객체.메서드**
- **self**는 그 클래스의 객체를 가리킴

![image](https://user-images.githubusercontent.com/78655692/152981730-f6e20f01-6dc4-4422-b708-981e7182231c.png)

<br>

- **__init__** : 초기화(initialize) 메서드, 어떤 클래스의 객체가 만들어질 때 자동으로 호출되어서 그 객체가 갖게 될 여러 가지 성질을 정해주는 일을 함

<br>
<br>
<br>
<br>

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