---
layout: single
title: "파이썬(python) 함수 기능 정리 - update"
excerpt: "배웠던 것들. 알고리즘 사용한 것들 (계속 업데이트)"
categories: python
tag : [python, function, definition]
toc: true
toc_sticky: true
author_profile: false

last_modified_at: 2021-11-16
---

## 알고리즘 문제에서 주어지는 것들을 구별한다. 나는 뼈대만 잡아준다.

순서는 상관없이 배우는 대로 정리를 해 나간다. 간략하게 (우린 시간이 없다)<br>
찾고 싶은 것은 ctrl+f 찾기로 검색!!
{: .notice--danger}

## 파이썬 함수

- `map(function, iterable)` : map은 리스트의 요소를 지정된 함수로 처리해주는 함수
  - 첫 번째 매개변수로는 함수가 오고 두 번째 매개변수로는 반복 가능한 자료형(리스트, 튜플 등)이 온다.
  - map 함수의 반환 값은 map객체 이기 때문에 해당 자료형을 list 혹은 tuple로 형 변환시켜주어야 한다.
- `input()` : 사용자가 입력한 값을 어떤 변수에 대입하고 싶을 때
  - input은 입력되는 모든 것을 문자열로 취급한다.
- `split()` : 공백(스페이스, 탭, 엔터 등)을 기준으로 문자열을 나누어 준다
- `/` : 그냥 나눔 
- `//` : 몫
- `%` : 나머지
- `divmod(a,b)` : 매개변수로 받은 a를 b로 나눈다. 그리고 그 몫과 나머지를 튜플(tuple) 데이터 타입으로 반환합니다.
- 특수문자 표기는 `\` 앞에 쓰면 됨
- `sys.stdin.readline()` : input 대신 씀
- `index` : 리스트에 x 값이 있으면 x의 위치 값을 돌려준다.
- `count` : 리스트 안에 x가 몇 개 있는지 조사하여 그 개수를 돌려주는 함수이다.
- `enumerate` : 인덱스 번호와 컬렉션의 원소를 tuple형태로 반환한다.
- `string.printable` : 인쇄 가능한 것으로 간주하는 ASCII 문자의 문자열
- `zip` : 여러 개의 순회 가능한(iterable) 객체를 인자로 받고, 각 객체가 담고 있는 원소를 터플의 형태로 차례로 접근할 수 있는 반복자(iterator)를 반환한다.
- `set` : 집합. 중복되지 않은 원소를 얻고자 할 때
  - 중복을 허용하지 않는다 / 순서가 없다(Unordered)
  - `set()` : 비어있는 집합 만들기
- `f-string` : f-string을 나타 낼 수 있게 문자열 앞에f를 입력하고 중괄호 사이에 {변수 : 소수점자리수} 순서로 작성
- `add` : 집합에 요소를 추가할 때
- `-` : 집합에서 차집합을 구할 때
- `sorted(정렬할 데이터, key 파라미터, reverse 파라미터)` : 첫 번째 매개변수로 들어온 이터러블한 데이터를 새로운 정렬된 리스트로 만들어서 반환해 주는 함수
- `ord()` : 문자의 아스키 코드값을 리턴하는 함수이다.
- `chr()` : 아스키 코드값 입력으로 받아 그 코드에 해당하는 문자를 출력하는 함수이다.


## 알고리즘



## Keras

- `Tokenizer` : 문장으로부터 단어를 토큰화하고 숫자에 대응시키는 딕셔너리를 사용할 수 있도록 한다.
-`fit_on_texts` : 문자 데이터를 입력받아서 리스트의 형태로 변환한다.
- `word_index ` : tokenizer의 word_index 속성은 단어와 숫자의 키-값 쌍을 포함하는 딕셔너리를 반환한다.
- `texts_to_sequences() ` : 텍스트 안의 단어들을 숫자의 시퀀스의 형태로 변환
- `texts_to_matrix()` : 텍스트를 시퀀스 리스트로 바꾸어 주는 texts_to_sequences() 메서드와 시퀀스 리스트를 넘파이 배열로 바꾸어 주는 sequences_to_matrix() 메서드를 차례대로 호출한다.
- `pad_sequences` : 서로 다른 개수의 단어로 이루어진 문장을 같은 길이로 만들어주기 위해 패딩을 사용한다. 이 함수에 이 시퀀스를 입력하면 숫자 0을 이용해서 같은 길이의 시퀀스로 변환한다.
- `os.listdir()`을 이용해서 경로에 포함된 파일 이름을 리스트 형태로 불러온다.
- `flow_from_directory` : ImageDataGenerator 클래스의 flow_from_directory 메서드는 이미지 데이터셋의 경로를 받아서, 데이터의 배치를 만들어낸다.
- `RMSprop` : 훈련 과정 중에 학습률을 적절하게 변화시킨다.



## References 

- [[개발자 지망생]](https://blockdmask.tistory.com/531 )
- [코딩도장 - 22.6 리스트에 map 사용하기](https://dojang.io/mod/page/view.php?id=2286)
- [점프 투 파이썬](https://wikidocs.net/25)
- [python.org](https://docs.python.org/ko/3/library/string.html)
- [[파이썬] 내장 함수 zip 사용법 - daleseo](https://www.daleseo.com/python-zip/)
- [22. 자연어 처리하기 1](https://codetorial.net/tensorflow/natural_language_processing_in_tensorflow_01.html)
- [12. 고양이와 개 이미지 분류하기](https://codetorial.net/tensorflow/classifying_the_cats_and_dogs.html)