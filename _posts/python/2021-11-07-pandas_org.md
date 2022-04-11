---
layout: single
title: "파이썬 pandas 라이브러리에 대한 모든 것"
excerpt: "+ 판다스 문법 + 타이타닉(titanic) 예제 실습, index, dtype, size, shape, unique, count, mean, value_counts, head, tail, drop, update, axis, join, merge, dataframe, group by, pivot, concat, join, on"
categories: python
tag : [python, pandas,  index, dtype, size, shape, unique, count, mean, value_counts, head, tail, drop, update, axis, join, merge, dataframe, group by, pivot, concat, join, on]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-04-11
---

<br>
<br>

## 라이브러리 불러오기
```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
%matplotlib inline 

import math
```

<br>
<br>

## Series
- pandas의 기본 객체 중 하나
- numpy의 ndarray를 기반으로 인덱싱을 기능을 추가하여 1차원 배열을 나타냄
- index를 지정하지 않을 시, 기본적으로 ndarray와 같이 0-based 인덱스 생성, 지정할 경우 명시적으로 지정된 index를 사용
- 같은 타입의 0개 이상의 데이터를 가질 수 있음

```python
pd.Series([1, 2, 3])
```

![image](https://user-images.githubusercontent.com/78655692/140644876-c1b15e61-25bb-4ccb-987d-fd74b08e2772.png)

<br>
<br>

```python
pd.Series(['a', 'b', 'c'])
```

![image](https://user-images.githubusercontent.com/78655692/140644899-5a5fa8cc-c761-417a-8a56-ddb33bc04766.png)

```python
pd.Series(np.arange(200))
```

    0        0
    1        1
    2        2
    3        3
    4        4
          ... 
    195    195
    196    196
    197    197
    198    198
    199    199
    Length: 200, dtype: int32

<br>
<br>

## data와 index 함께 명시하기

```python
pd.Series([1,2,3], ['a','m','k']) # 첫번째는 data, 두번째는 인덱스 값
```

    a    1
    m    2
    k    3
    dtype: int64

<br>
<br>

## data, index, data type 함께 명시하기(dtype)

```python
s6 =pd.Series(np.arange(5), np.arange(100, 105), dtype=np.int16)
s6
```

    100    0
    101    1
    102    2
    103    3
    104    4
    dtype: int16

<br>
<br>

## 인덱스 활용하기

```python
s = pd.Series([1, 1, 2, 1, 2, 2, 2, 1, 1, 3, 3, 4, 5, 5, 7, np.NaN]) #np.Nan는 결측치
s
```

    0     1.0
    1     1.0
    2     2.0
    3     1.0
    4     2.0
    5     2.0
    6     2.0
    7     1.0
    8     1.0
    9     3.0
    10    3.0
    11    4.0
    12    5.0
    13    5.0
    14    7.0
    15    NaN
    dtype: float64

<br>
<br>

### index 값 
```python
s6.index 
```

    Int64Index([100, 101, 102, 103, 104], dtype='int64')

<br>
<br>

### values 값
```python
s6.values 
```

    array([0, 1, 2, 3, 4], dtype=int16)

<br>
<br>

## Series 함수 

<br>

### size
- 개수 반환 

```python
len(s)
```

    16

```python
s.size
```

    16

<br>
<br>

### shape
- 튜플형태로 shape반환

```python
s.shape
```




    (16,)

<br>
<br>

### unique 
- 유일한 값만 ndarry로 반환 

```python
s.unique() #unique는 중복x 한개의 문자만 가져옴
```




    array([ 1.,  2.,  3.,  4.,  5.,  7., nan])

<br>
<br>

### count

- NaN을 제외한 개수를 반환 

```python
s.count() #실제 값만 카운트해서 반환
```

    5

<br>
<br>

### mean

- NaN을 제외한 평균

```python
s.mean()
```

    2.6666666

<br>
<br>

### value_counts

- NaN을 제외하고 각 값들의 빈도를 반환
- 데이터의 개수 빈도를 알고 싶을때 가장 많이 쓰는 함수 중 하나
- index를 활용하여 멀티플한 값에 접근
- 갖고오고 싶은 인덱스를 리스트 형식으로 해서 반환

```python
s.value_counts() 
```

    1.0    5
    2.0    4
    5.0    2
    3.0    2
    7.0    1
    4.0    1
    dtype: int64

<br>
<br>

### head()

- head : 상위 n개 출력 기본 5개

```python
s.head(n=7) #기본적으로 상위 5개
```

    0    1.0
    1    1.0
    2    2.0
    3    1.0
    4    2.0
    5    2.0
    6    2.0
    dtype: float64

<br>
<br>

### tail()

- tail : 하위 n개 출력 기본 5개

```python
s.tail() #기본적으로 하위 5개
```

    11    4.0
    12    5.0
    13    5.0
    14    7.0
    15    NaN
    dtype: float64

<br>
<br>

## 산술연산
- Series의 경우에도 스칼라와의 연산은 각 원소별로 스칼라와의 연산이 적용
- Series와의 연산은 각 인덱스에 맞는 값끼리 연산이 적용
- 이때, 인덱스의 pair가 맞지 않으면, 결과는 NaN 

```python
s = pd.Series(np.arange(10), np.arange(10)+1)
s
```

    1     0
    2     1
    3     2
    4     3
    5     4
    6     5
    7     6
    8     7
    9     8
    10    9
    dtype: int32

<br>
<br>

### 조건식
```python
s[s>5] # True인 것만 필터링해서 가져옴 
```

    7     6
    8     7
    9     8
    10    9
    dtype: int32

```python
s[s % 2 == 0]
```

    1    0
    3    2
    5    4
    7    6
    9    8
    dtype: int32

```python
s[s.index > 5] # s의 index를 기준으로 반환
```

    6     5
    7     6
    8     7
    9     8
    10    9
    dtype: int32

```python
s[(s > 5) & (s < 8)] #괄호를 반드시 묶어줘야 한다.
```

    7    6
    8    7
    dtype: int32

```python
(s >= 7).sum() # boolean array의 참 개수를 구하는 것 
```

    3

```python
s = pd.Series(np.arange(100, 105), ['a', 'b', 'c', 'd', 'e'])

s
```

    a    100
    b    101
    c    102
    d    103
    e    104
    dtype: int32

```python
s['a'] = 200 # 이미 있는 건 갱신 

s
```

    a    200
    b    101
    c    102
    d    103
    e    104
    dtype: int32


```python
s['k'] = 300 # 없는 건 추가

s
```

    a    200
    b    101
    c    102
    d    103
    e    104
    k    300
    dtype: int64

<br>
<br>

### drop()

- drop은 s 자체에는 지워지지 않는다.
- 기본 inplace 값은 false. true이면 그 자체에 반환
- p.s. del은 원본에 바로 삭제

```python
s.drop('k', inplace=True)  

s
```

    a    200
    b    101
    c    102
    d    103
    e    104
    dtype: int64

<br>
<br>

### update

```python
s[['a', 'b']] = [300, 900] # 한꺼번에 update 가능

s
```

    a    300
    b    900
    c    102
    d    103
    e    104
    dtype: int64

<br>
<br>

## Slicing

- 리스트, ndarray와 동일하게 적용

```python
s1 = pd.Series(np.arange(100, 105))

s1
```

    0    100
    1    101
    2    102
    3    103
    4    104
    dtype: int32

```python
s1[1:3]
```

    1    101
    2    102
    dtype: int32

```python
s2 = pd.Series(np.arange(100, 105), ['a', 'c', 'b', 'd', 'e'])

s2
```

    a    100
    c    101
    b    102
    d    103
    e    104
    dtype: int32

```python
s2['c':'d'] # 문자열로 인덱싱 할때는 마지막 포함한다.
```

    c    101
    b    102
    d    103
    dtype: int32

<br>
<br>

## concat

    pd.concat(objs,  # Series, DataFrame, Panel object

    axis=0,  # 0: 위+아래로 합치기, 1: 왼쪽+오른쪽으로 합치기

    join='outer', # 'outer': 합집합(union), 'inner': 교집합(intersection)

    join_axes=None, # axis=1 일 경우 특정 DataFrame의 index를 그대로 이용하려면 입력 (deprecated, 더이상 지원하지 않음)

    ignore_index=False,  # False: 기존 index 유지, True: 기존 index 무시

    keys=None, # 계층적 index 사용하려면 keys 튜플 입력
    levels=None,

    names=None, # index의 이름 부여하려면 names 튜플 입력

    verify_integrity=False, # True: index 중복 확인

    copy=True) # 복사

<br>
<br>

### axis = 0

- 위 + 아래로 DataFrame 합치기(rbind) 

<br>
<br>

### axis = 1

- 왼쪽 + 오른쪽으로 DataFrame 합치기(cbind)

<br>
<br>

### join = 'outer'

- 합집합(union)으로 DataFrame 합치기 

<br>
<br>

### join = 'inner'

- 교집합(intersection)으로 DataFrame 합치기 

<br>
<br>

### join_axes

- axis=1일 경우 특정 DataFrame의 index를 그대로 이용하고자 할 경우

<br>
<br>

### ignore_index

- 기존 index를 무시하고 싶을 때 

<br>
<br>

### keys

- 계층적 index (hierarchical index) 만들기 

<br>
<br>

### names

- index에 이름 부여하기

<br>
<br>

### verify_integrity

- index 중복 여부 점검 

<br>
<br>

## merge

    pd.merge(left, right, # merge할 DataFrame 객체 이름

    how='inner', # left, rigth, inner (default), outer

    on=None, # merge의 기준이 되는 Key 변수

    left_on=None, # 왼쪽 DataFrame의 변수를 Key로 사용

    right_on=None, # 오른쪽 DataFrame의 변수를 Key로 사용

    left_index=False, # 만약 True 라면, 왼쪽 DataFrame의 index를 merge 

    Key로 사용

    right_index=False, # 만약 True 라면, 오른쪽 DataFrame의 index를 merge Key로 사용

    sort=True, # merge 된 후의 DataFrame을 join Key 기준으로 정렬

    suffixes=('_x', '_y'), # 중복되는 변수 이름에 대해 접두사 부여 (defaults to '_x', '_y'

    copy=True, # merge할 DataFrame을 복사

    indicator=False) # 병합된 이후의 DataFrame에 left_only, right_only, both 등의 출처를 알 수 있는 부가 정보 변수 추가

<br>
<br>

## DataFrame

- Series가 1차원이라면 DataFrame은 2차원으로 확대된 버젼
- Excel spreadsheet이라고 생각하면 이해하기 쉬움
- 2차원이기 때문에 인덱스가 row, column로 구성됨
 - row는 각 개별 데이터를, column은 개별 속성을 의미
- Data Analysis, Machine Learning에서 data 변형을 위해 가장 많이 사용

<br>
<br>

## DataFrame 생성하기

- 일반적으로 분석을 위한 데이터는 다른 데이터 소스(database, 외부 파일)을 통해 dataframe을 생성
- 여기서는 실습을 통해, dummy 데이터를 생성하는 방법을 다룰 예정

<br>
<br>

### dictionary로 부터 생성하기

- dict의 key -> column


```python
data = {'a' : 100, 'b' : 200, 'c' : 300}

pd.DataFrame(data, index=['x', 'y', 'z'])
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>a</th>
      <th>b</th>
      <th>c</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>x</th>
      <td>100</td>
      <td>200</td>
      <td>300</td>
    </tr>
    <tr>
      <th>y</th>
      <td>100</td>
      <td>200</td>
      <td>300</td>
    </tr>
    <tr>
      <th>z</th>
      <td>100</td>
      <td>200</td>
      <td>300</td>
    </tr>
  </tbody>
</table>
</div>




```python
data = {'a' : [1, 2, 3], 'b' : [4, 5, 6], 'c' : [10, 11, 12]}

pd.DataFrame(data, index=[0, 1, 2])
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>a</th>
      <th>b</th>
      <th>c</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>4</td>
      <td>10</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>5</td>
      <td>11</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>6</td>
      <td>12</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

## Series로 부터 생성하기

 - 각 Series의 인덱스 -> column


```python
a = pd.Series([100, 200, 300], ['a', 'b', 'd'])

b = pd.Series([101, 201, 301], ['a', 'b', 'k'])

c = pd.Series([110, 210, 310], ['a', 'b', 'c'])



pd.DataFrame([a, b, c], index=[100, 101, 102])
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>a</th>
      <th>b</th>
      <th>d</th>
      <th>k</th>
      <th>c</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>100</th>
      <td>100.0</td>
      <td>200.0</td>
      <td>300.0</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>101</th>
      <td>101.0</td>
      <td>201.0</td>
      <td>NaN</td>
      <td>301.0</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>102</th>
      <td>110.0</td>
      <td>210.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>310.0</td>
    </tr>
  </tbody>
</table>
</div>




```python
# data 출처: https://www.kaggle.com/hesh97/titanicdataset-traincsv/data

train_data = pd.read_csv('F:/data/titanic/train.csv') 

# ./ : 현재 폴더를 의미 # sep="," : 각각 데이터를 ,로 구분
```

<br>
<br>

## head, tail 함수

 - 데이터 전체가 아닌, 일부(처음부터, 혹은 마지막부터)를 간단히 보기 위한 함수


```python
train_data.head(n=3)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>0</td>
      <td>3</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>male</td>
      <td>22.0</td>
      <td>1</td>
      <td>0</td>
      <td>A/5 21171</td>
      <td>7.2500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1</td>
      <td>1</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>female</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
      <td>C85</td>
      <td>C</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>1</td>
      <td>3</td>
      <td>Heikkinen, Miss. Laina</td>
      <td>female</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>STON/O2. 3101282</td>
      <td>7.9250</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
  </tbody>
</table>
</div>




```python
train_data.tail(n=10)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>881</th>
      <td>882</td>
      <td>0</td>
      <td>3</td>
      <td>Markun, Mr. Johann</td>
      <td>male</td>
      <td>33.0</td>
      <td>0</td>
      <td>0</td>
      <td>349257</td>
      <td>7.8958</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>882</th>
      <td>883</td>
      <td>0</td>
      <td>3</td>
      <td>Dahlberg, Miss. Gerda Ulrika</td>
      <td>female</td>
      <td>22.0</td>
      <td>0</td>
      <td>0</td>
      <td>7552</td>
      <td>10.5167</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>883</th>
      <td>884</td>
      <td>0</td>
      <td>2</td>
      <td>Banfield, Mr. Frederick James</td>
      <td>male</td>
      <td>28.0</td>
      <td>0</td>
      <td>0</td>
      <td>C.A./SOTON 34068</td>
      <td>10.5000</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>884</th>
      <td>885</td>
      <td>0</td>
      <td>3</td>
      <td>Sutehall, Mr. Henry Jr</td>
      <td>male</td>
      <td>25.0</td>
      <td>0</td>
      <td>0</td>
      <td>SOTON/OQ 392076</td>
      <td>7.0500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>885</th>
      <td>886</td>
      <td>0</td>
      <td>3</td>
      <td>Rice, Mrs. William (Margaret Norton)</td>
      <td>female</td>
      <td>39.0</td>
      <td>0</td>
      <td>5</td>
      <td>382652</td>
      <td>29.1250</td>
      <td>NaN</td>
      <td>Q</td>
    </tr>
    <tr>
      <th>886</th>
      <td>887</td>
      <td>0</td>
      <td>2</td>
      <td>Montvila, Rev. Juozas</td>
      <td>male</td>
      <td>27.0</td>
      <td>0</td>
      <td>0</td>
      <td>211536</td>
      <td>13.0000</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>887</th>
      <td>888</td>
      <td>1</td>
      <td>1</td>
      <td>Graham, Miss. Margaret Edith</td>
      <td>female</td>
      <td>19.0</td>
      <td>0</td>
      <td>0</td>
      <td>112053</td>
      <td>30.0000</td>
      <td>B42</td>
      <td>S</td>
    </tr>
    <tr>
      <th>888</th>
      <td>889</td>
      <td>0</td>
      <td>3</td>
      <td>Johnston, Miss. Catherine Helen "Carrie"</td>
      <td>female</td>
      <td>NaN</td>
      <td>1</td>
      <td>2</td>
      <td>W./C. 6607</td>
      <td>23.4500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>889</th>
      <td>890</td>
      <td>1</td>
      <td>1</td>
      <td>Behr, Mr. Karl Howell</td>
      <td>male</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>111369</td>
      <td>30.0000</td>
      <td>C148</td>
      <td>C</td>
    </tr>
    <tr>
      <th>890</th>
      <td>891</td>
      <td>0</td>
      <td>3</td>
      <td>Dooley, Mr. Patrick</td>
      <td>male</td>
      <td>32.0</td>
      <td>0</td>
      <td>0</td>
      <td>370376</td>
      <td>7.7500</td>
      <td>NaN</td>
      <td>Q</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

### 변수 이름(column name, header)이 없는 파일 불러올 때 이름 부여하기 

: names=['X1','X2', ..], header=None


```python
pd.read_csv('e:/data/text_without_column_name.txt', sep='|',

names=['ID','A','B','C','D'], header=None, index_col='ID')

#names=['ID', 'A', 'B', 'C', 'D'] 와 같이 칼럼 이름을 부여해줍니다.

# header=None 은 칼럼 이름이 없다는 뜻이며, 

# 만약 1번째 행이 칼럼 이름이라면 header=0 으로 지정해주면 됩니다.
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>A</th>
      <th>B</th>
      <th>C</th>
      <th>D</th>
    </tr>
    <tr>
      <th>ID</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>C1</th>
      <td>1</td>
      <td>2</td>
      <td>3</td>
      <td>4</td>
    </tr>
    <tr>
      <th>C2</th>
      <td>5</td>
      <td>6</td>
      <td>7</td>
      <td>8</td>
    </tr>
    <tr>
      <th>C3</th>
      <td>1</td>
      <td>3</td>
      <td>5</td>
      <td>7</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

### 유니코드 디코드 에러날때

- cp949써보기 (encoding='cp949') 

- 그래도 안되면 

    - encoding='latin'

특정 줄은 제외하고 불러오기: skiprows = [x, x]


```python
pd.read_csv('e:/data/text_without_column_name.txt', sep='|',

names=['ID','A','B','C','D'], header=None, index_col='ID',

skiprows=[1])
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>A</th>
      <th>B</th>
      <th>C</th>
      <th>D</th>
    </tr>
    <tr>
      <th>ID</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>C1</th>
      <td>1</td>
      <td>2</td>
      <td>3</td>
      <td>4</td>
    </tr>
    <tr>
      <th>C3</th>
      <td>1</td>
      <td>3</td>
      <td>5</td>
      <td>7</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

### nrows = n

- n 개의 행만 불러오기
- csv 파일의 위에서 부터 3개의 행(rows) 만 DataFrame으로 불러오기


```python
csv_3 = pd.read_csv('f:/data/test_csv_file.csv', nrows=3); csv_3
```

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>ID</th>
      <th>LAST_NAME</th>
      <th>AGE</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>KIM</td>
      <td>30</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>CHOI</td>
      <td>25</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>LEE</td>
      <td>41</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

### 사용자 정의 결측값 기호 (custom missing value symbols) 


```python
df = pd.read_csv('e:/data/test_text_file.txt', sep='|', 

na_values = ['?', '??', 'N/A', 'NA', 'nan', 'NaN', '-nan', '-NaN', 'null'])
```


```python
df
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>ID</th>
      <th>A</th>
      <th>B</th>
      <th>C</th>
      <th>D</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>C1</td>
      <td>1</td>
      <td>2</td>
      <td>3</td>
      <td>4</td>
    </tr>
    <tr>
      <th>1</th>
      <td>C2</td>
      <td>5</td>
      <td>6</td>
      <td>7</td>
      <td>8</td>
    </tr>
    <tr>
      <th>2</th>
      <td>C3</td>
      <td>1</td>
      <td>3</td>
      <td>5</td>
      <td>7</td>
    </tr>
  </tbody>
</table>
</div>



pandas DataFrame 만들기


```python
df_1 = pd.DataFrame(data=np.arange(12).reshape(3, 4),

index=['r0', 'r1', 'r2'], # Will default to np.arange(n) if no indexing

columns=['c0', 'c1', 'c2', 'c3'],

dtype='int', # Data type to force, otherwise infer

copy=False) # Copy data from inputs

df_1
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>c0</th>
      <th>c1</th>
      <th>c2</th>
      <th>c3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>r0</th>
      <td>0</td>
      <td>1</td>
      <td>2</td>
      <td>3</td>
    </tr>
    <tr>
      <th>r1</th>
      <td>4</td>
      <td>5</td>
      <td>6</td>
      <td>7</td>
    </tr>
    <tr>
      <th>r2</th>
      <td>8</td>
      <td>9</td>
      <td>10</td>
      <td>11</td>
    </tr>
  </tbody>
</table>
</div>




```python
df_1.T
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>r0</th>
      <th>r1</th>
      <th>r2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>c0</th>
      <td>0</td>
      <td>4</td>
      <td>8</td>
    </tr>
    <tr>
      <th>c1</th>
      <td>1</td>
      <td>5</td>
      <td>9</td>
    </tr>
    <tr>
      <th>c2</th>
      <td>2</td>
      <td>6</td>
      <td>10</td>
    </tr>
    <tr>
      <th>c3</th>
      <td>3</td>
      <td>7</td>
      <td>11</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

### axes()

```python
# axes : 행과 열 이름을 리스트로 변환 

df_1.axes
```




    [Index(['r0', 'r1', 'r2'], dtype='object'),
     Index(['c0', 'c1', 'c2', 'c3'], dtype='object')]

<br>
<br>

### dtypes(), shape(), size(), values()

```python
# dtypes : 데이터 형태 반환

# shape : 행과 열의 개수(차원)을 튜플로 반환

# size : NDFrame의 원소의 개수를 반환

# values : NDFrame의 원소를 numpy 형태로 반환


```

<br>
<br>

### reindex() 

```pytho
# index 재설정하기 

new_idx = ['r0', 'r1', 'r2', 'r5', 'r6']



# reindex 과정에서 생긴 결측값 채우기 (fill in missing values) : fill_value

df_1.reindex(new_idx, fill_value=0)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>c0</th>
      <th>c1</th>
      <th>c2</th>
      <th>c3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>r0</th>
      <td>0</td>
      <td>1</td>
      <td>2</td>
      <td>3</td>
    </tr>
    <tr>
      <th>r1</th>
      <td>4</td>
      <td>5</td>
      <td>6</td>
      <td>7</td>
    </tr>
    <tr>
      <th>r2</th>
      <td>8</td>
      <td>9</td>
      <td>10</td>
      <td>11</td>
    </tr>
    <tr>
      <th>r5</th>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>r6</th>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

## 시계열 데이터

- DataFrame의 index만들 때, pd.date_range(date,periods, freq)


```python
date_idx=pd.date_range('2021-08-05', periods=5, freq='D')
```


```python
date_idx
```




    DatetimeIndex(['2021-08-05', '2021-08-06', '2021-08-07', '2021-08-08',
                   '2021-08-09'],
                  dtype='datetime64[ns]', freq='D')

<br>
<br>

## dataframe 데이터 파악하기

- **shape** 속성 (row, column)

- **describe** 함수 - 숫자형 데이터의 통계치 계산

- **info** 함수 - 데이터 타입, 각 아이템의 개수 등 출력


```python
train_data.shape # (891, 12) = 891개의 데이터가 있고 12개의 속성이 있다.
```




    (891, 12)




```python
train_data.describe()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Fare</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>count</th>
      <td>891.000000</td>
      <td>891.000000</td>
      <td>891.000000</td>
      <td>714.000000</td>
      <td>891.000000</td>
      <td>891.000000</td>
      <td>891.000000</td>
    </tr>
    <tr>
      <th>mean</th>
      <td>446.000000</td>
      <td>0.383838</td>
      <td>2.308642</td>
      <td>29.699118</td>
      <td>0.523008</td>
      <td>0.381594</td>
      <td>32.204208</td>
    </tr>
    <tr>
      <th>std</th>
      <td>257.353842</td>
      <td>0.486592</td>
      <td>0.836071</td>
      <td>14.526497</td>
      <td>1.102743</td>
      <td>0.806057</td>
      <td>49.693429</td>
    </tr>
    <tr>
      <th>min</th>
      <td>1.000000</td>
      <td>0.000000</td>
      <td>1.000000</td>
      <td>0.420000</td>
      <td>0.000000</td>
      <td>0.000000</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>25%</th>
      <td>223.500000</td>
      <td>0.000000</td>
      <td>2.000000</td>
      <td>20.125000</td>
      <td>0.000000</td>
      <td>0.000000</td>
      <td>7.910400</td>
    </tr>
    <tr>
      <th>50%</th>
      <td>446.000000</td>
      <td>0.000000</td>
      <td>3.000000</td>
      <td>28.000000</td>
      <td>0.000000</td>
      <td>0.000000</td>
      <td>14.454200</td>
    </tr>
    <tr>
      <th>75%</th>
      <td>668.500000</td>
      <td>1.000000</td>
      <td>3.000000</td>
      <td>38.000000</td>
      <td>1.000000</td>
      <td>0.000000</td>
      <td>31.000000</td>
    </tr>
    <tr>
      <th>max</th>
      <td>891.000000</td>
      <td>1.000000</td>
      <td>3.000000</td>
      <td>80.000000</td>
      <td>8.000000</td>
      <td>6.000000</td>
      <td>512.329200</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

### info함수로 각 변수의 데이터 타입 확인

 - 타입 변경은 astype함수를 사용


```python
train_data.info()
```

    <class 'pandas.core.frame.DataFrame'>
    RangeIndex: 891 entries, 0 to 890
    Data columns (total 12 columns):
     #   Column       Non-Null Count  Dtype  
    ---  ------       --------------  -----  
     0   PassengerId  891 non-null    int64  
     1   Survived     891 non-null    int64  
     2   Pclass       891 non-null    int64  
     3   Name         891 non-null    object 
     4   Sex          891 non-null    object 
     5   Age          714 non-null    float64
     6   SibSp        891 non-null    int64  
     7   Parch        891 non-null    int64  
     8   Ticket       891 non-null    object 
     9   Fare         891 non-null    float64
     10  Cabin        204 non-null    object 
     11  Embarked     889 non-null    object 
    dtypes: float64(2), int64(5), object(5)
    memory usage: 83.7+ KB
    
<br>
<br>

### 인덱스(index)

 - index 속성

 - 각 아이템을 특정할 수 있는 고유의 값을 저장

 - 복잡한 데이터의 경우, 멀티 인덱스로 표현 가능


```python
train_data.index
```




    RangeIndex(start=0, stop=891, step=1)

<br>
<br>

### 컬럼(column)

 - columns 속성

 - 각각의 특성(feature)을 나타냄

 - 복잡한 데이터의 경우, 멀티 컬럼으로 표현 가능


```python
train_data.columns
```




    Index(['PassengerId', 'Survived', 'Pclass', 'Name', 'Sex', 'Age', 'SibSp',
           'Parch', 'Ticket', 'Fare', 'Cabin', 'Embarked'],
          dtype='object')

<br>
<br>

### read_csv 함수 파라미터

 - sep - 각 데이터 값을 구별하기 위한 구분자(separator) 설정 

 - header - header를 무시할 경우, None 설정

 - index_col - index로 사용할 column 설정

 - usecols - 실제로 dataframe에 로딩할 columns만 설정


```python
train_data1 = pd.read_csv('E:\kaggle/titanic/train.csv', index_col='PassengerId', usecols=['PassengerId', 'Survived', 'Pclass', 'Name']) 

# index_col = passengerId가 인덱스로 존재 # usecols = 필요한 컴럼만 가져온다.

# index_col = 파일 불러올때 index 지정해주기

train_data1
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
    </tr>
    <tr>
      <th>PassengerId</th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>0</td>
      <td>3</td>
      <td>Braund, Mr. Owen Harris</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1</td>
      <td>1</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1</td>
      <td>3</td>
      <td>Heikkinen, Miss. Laina</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1</td>
      <td>1</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
    </tr>
    <tr>
      <th>5</th>
      <td>0</td>
      <td>3</td>
      <td>Allen, Mr. William Henry</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>887</th>
      <td>0</td>
      <td>2</td>
      <td>Montvila, Rev. Juozas</td>
    </tr>
    <tr>
      <th>888</th>
      <td>1</td>
      <td>1</td>
      <td>Graham, Miss. Margaret Edith</td>
    </tr>
    <tr>
      <th>889</th>
      <td>0</td>
      <td>3</td>
      <td>Johnston, Miss. Catherine Helen "Carrie"</td>
    </tr>
    <tr>
      <th>890</th>
      <td>1</td>
      <td>1</td>
      <td>Behr, Mr. Karl Howell</td>
    </tr>
    <tr>
      <th>891</th>
      <td>0</td>
      <td>3</td>
      <td>Dooley, Mr. Patrick</td>
    </tr>
  </tbody>
</table>
<p>891 rows × 3 columns</p>
</div>

<br>
<br>

### 하나의 컬럼 선택하기


```python
train_data['Survived'] # 특정 컬럼만 series로 가져온다.  
```




    0      0
    1      1
    2      1
    3      1
    4      0
          ..
    886    0
    887    1
    888    0
    889    1
    890    0
    Name: Survived, Length: 891, dtype: int64

<br>
<br>

### 복수의 컬럼 선택하기


```python
train_data[['Survived', 'Name', 'Age', 'Embarked']]
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Survived</th>
      <th>Name</th>
      <th>Age</th>
      <th>Embarked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>22.0</td>
      <td>S</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>38.0</td>
      <td>C</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1</td>
      <td>Heikkinen, Miss. Laina</td>
      <td>26.0</td>
      <td>S</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>35.0</td>
      <td>S</td>
    </tr>
    <tr>
      <th>4</th>
      <td>0</td>
      <td>Allen, Mr. William Henry</td>
      <td>35.0</td>
      <td>S</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>886</th>
      <td>0</td>
      <td>Montvila, Rev. Juozas</td>
      <td>27.0</td>
      <td>S</td>
    </tr>
    <tr>
      <th>887</th>
      <td>1</td>
      <td>Graham, Miss. Margaret Edith</td>
      <td>19.0</td>
      <td>S</td>
    </tr>
    <tr>
      <th>888</th>
      <td>0</td>
      <td>Johnston, Miss. Catherine Helen "Carrie"</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>889</th>
      <td>1</td>
      <td>Behr, Mr. Karl Howell</td>
      <td>26.0</td>
      <td>C</td>
    </tr>
    <tr>
      <th>890</th>
      <td>0</td>
      <td>Dooley, Mr. Patrick</td>
      <td>32.0</td>
      <td>Q</td>
    </tr>
  </tbody>
</table>
<p>891 rows × 4 columns</p>
</div>




```python
train_data[['Survived']] #이건 데이터 프레임으로 가져온다.
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Survived</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1</td>
    </tr>
    <tr>
      <th>4</th>
      <td>0</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
    </tr>
    <tr>
      <th>886</th>
      <td>0</td>
    </tr>
    <tr>
      <th>887</th>
      <td>1</td>
    </tr>
    <tr>
      <th>888</th>
      <td>0</td>
    </tr>
    <tr>
      <th>889</th>
      <td>1</td>
    </tr>
    <tr>
      <th>890</th>
      <td>0</td>
    </tr>
  </tbody>
</table>
<p>891 rows × 1 columns</p>
</div>

<br>
<br>

### dataframe slicing

  - dataframe의 경우 기본적으로 [] 연산자가 **column 선택**에 사용

  - 하지만, slicing은 row 레벨로 지원


```python
train_data[7:10] # 슬라이싱은 row로 적용 # 슬라이싱만 예외
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>7</th>
      <td>8</td>
      <td>0</td>
      <td>3</td>
      <td>Palsson, Master. Gosta Leonard</td>
      <td>male</td>
      <td>2.0</td>
      <td>3</td>
      <td>1</td>
      <td>349909</td>
      <td>21.0750</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>8</th>
      <td>9</td>
      <td>1</td>
      <td>3</td>
      <td>Johnson, Mrs. Oscar W (Elisabeth Vilhelmina Berg)</td>
      <td>female</td>
      <td>27.0</td>
      <td>0</td>
      <td>2</td>
      <td>347742</td>
      <td>11.1333</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>9</th>
      <td>10</td>
      <td>1</td>
      <td>2</td>
      <td>Nasser, Mrs. Nicholas (Adele Achem)</td>
      <td>female</td>
      <td>14.0</td>
      <td>1</td>
      <td>0</td>
      <td>237736</td>
      <td>30.0708</td>
      <td>NaN</td>
      <td>C</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

### row 선택하기

  - Seires의 경우 []로 row 선택이 가능하나, **DataFrame의 경우는 기본적으로 column을 선택하도록 설계**

  - **.loc, .iloc**로 row 선택 가능

    - loc - 인덱스 자체를 사용

    - iloc - 0 based index로 사용

    - 이 두 함수는 ,를 사용하여 column 선택도 가능


```python
train_data.index = np.arange(100, 991)
```


```python
train_data.loc[986] # 존재하는 index를 가져옴 
```




    PassengerId                      887
    Survived                           0
    Pclass                             2
    Name           Montvila, Rev. Juozas
    Sex                             male
    Age                               27
    SibSp                              0
    Parch                              0
    Ticket                        211536
    Fare                              13
    Cabin                            NaN
    Embarked                           S
    Name: 986, dtype: object




```python
train_data.loc[[986, 100, 110, 990]]
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>986</th>
      <td>887</td>
      <td>0</td>
      <td>2</td>
      <td>Montvila, Rev. Juozas</td>
      <td>male</td>
      <td>27.0</td>
      <td>0</td>
      <td>0</td>
      <td>211536</td>
      <td>13.00</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>100</th>
      <td>1</td>
      <td>0</td>
      <td>3</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>male</td>
      <td>22.0</td>
      <td>1</td>
      <td>0</td>
      <td>A/5 21171</td>
      <td>7.25</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>110</th>
      <td>11</td>
      <td>1</td>
      <td>3</td>
      <td>Sandstrom, Miss. Marguerite Rut</td>
      <td>female</td>
      <td>4.0</td>
      <td>1</td>
      <td>1</td>
      <td>PP 9549</td>
      <td>16.70</td>
      <td>G6</td>
      <td>S</td>
    </tr>
    <tr>
      <th>990</th>
      <td>891</td>
      <td>0</td>
      <td>3</td>
      <td>Dooley, Mr. Patrick</td>
      <td>male</td>
      <td>32.0</td>
      <td>0</td>
      <td>0</td>
      <td>370376</td>
      <td>7.75</td>
      <td>NaN</td>
      <td>Q</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

```python
train_data.iloc[[0, 100, 200, 2]] 

# index 관계없이 0부터 시작하는 index base를 가져옴
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>100</th>
      <td>1</td>
      <td>0</td>
      <td>3</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>male</td>
      <td>22.0</td>
      <td>1</td>
      <td>0</td>
      <td>A/5 21171</td>
      <td>7.2500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>200</th>
      <td>101</td>
      <td>0</td>
      <td>3</td>
      <td>Petranec, Miss. Matilda</td>
      <td>female</td>
      <td>28.0</td>
      <td>0</td>
      <td>0</td>
      <td>349245</td>
      <td>7.8958</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>300</th>
      <td>201</td>
      <td>0</td>
      <td>3</td>
      <td>Vande Walle, Mr. Nestor Cyriel</td>
      <td>male</td>
      <td>28.0</td>
      <td>0</td>
      <td>0</td>
      <td>345770</td>
      <td>9.5000</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>102</th>
      <td>3</td>
      <td>1</td>
      <td>3</td>
      <td>Heikkinen, Miss. Laina</td>
      <td>female</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>STON/O2. 3101282</td>
      <td>7.9250</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

### row, column 동시에 선택하기

 - loc, iloc 속성을 이용할 때, 콤마를 이용하여 둘 다 명시 가능


```python
train_data.loc[[986, 100, 110, 990], ['Survived', 'Name', 'Sex', 'Age']]

# loc = location
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Survived</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>986</th>
      <td>0</td>
      <td>Montvila, Rev. Juozas</td>
      <td>male</td>
      <td>27.0</td>
    </tr>
    <tr>
      <th>100</th>
      <td>0</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>male</td>
      <td>22.0</td>
    </tr>
    <tr>
      <th>110</th>
      <td>1</td>
      <td>Sandstrom, Miss. Marguerite Rut</td>
      <td>female</td>
      <td>4.0</td>
    </tr>
    <tr>
      <th>990</th>
      <td>0</td>
      <td>Dooley, Mr. Patrick</td>
      <td>male</td>
      <td>32.0</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>


```python
train_data.iloc[[101, 100, 200, 102], [1, 4, 5]] # columns 역시 0베이스부터 시작
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Survived</th>
      <th>Sex</th>
      <th>Age</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>201</th>
      <td>0</td>
      <td>male</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>200</th>
      <td>0</td>
      <td>female</td>
      <td>28.0</td>
    </tr>
    <tr>
      <th>300</th>
      <td>0</td>
      <td>male</td>
      <td>28.0</td>
    </tr>
    <tr>
      <th>202</th>
      <td>0</td>
      <td>male</td>
      <td>21.0</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>


```python
train_data = pd.read_csv('E:\kaggle/titanic/train.csv')
```

### boolean selection으로 row 선택하기

 - numpy에서와 동일한 방식으로 해당 조건에 맞는 row만 선택

### 30대이면서 1등석에 탄 사람 선택하기 


```python
class_ = train_data['Pclass'] == 1

age_ = (train_data['Age'] >= 30) & (train_data['Age'] < 40)



train_data[class_ & age_]
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1</td>
      <td>1</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>female</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
      <td>C85</td>
      <td>C</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>1</td>
      <td>1</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>female</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
      <td>C123</td>
      <td>S</td>
    </tr>
    <tr>
      <th>61</th>
      <td>62</td>
      <td>1</td>
      <td>1</td>
      <td>Icard, Miss. Amelie</td>
      <td>female</td>
      <td>38.0</td>
      <td>0</td>
      <td>0</td>
      <td>113572</td>
      <td>80.0000</td>
      <td>B28</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>137</th>
      <td>138</td>
      <td>0</td>
      <td>1</td>
      <td>Futrelle, Mr. Jacques Heath</td>
      <td>male</td>
      <td>37.0</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
      <td>C123</td>
      <td>S</td>
    </tr>
    <tr>
      <th>215</th>
      <td>216</td>
      <td>1</td>
      <td>1</td>
      <td>Newell, Miss. Madeleine</td>
      <td>female</td>
      <td>31.0</td>
      <td>1</td>
      <td>0</td>
      <td>35273</td>
      <td>113.2750</td>
      <td>D36</td>
      <td>C</td>
    </tr>
    <tr>
      <th>218</th>
      <td>219</td>
      <td>1</td>
      <td>1</td>
      <td>Bazzani, Miss. Albina</td>
      <td>female</td>
      <td>32.0</td>
      <td>0</td>
      <td>0</td>
      <td>11813</td>
      <td>76.2917</td>
      <td>D15</td>
      <td>C</td>
    </tr>
    <tr>
      <th>224</th>
      <td>225</td>
      <td>1</td>
      <td>1</td>
      <td>Hoyt, Mr. Frederick Maxfield</td>
      <td>male</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>19943</td>
      <td>90.0000</td>
      <td>C93</td>
      <td>S</td>
    </tr>
    <tr>
      <th>230</th>
      <td>231</td>
      <td>1</td>
      <td>1</td>
      <td>Harris, Mrs. Henry Birkhardt (Irene Wallach)</td>
      <td>female</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>36973</td>
      <td>83.4750</td>
      <td>C83</td>
      <td>S</td>
    </tr>
    <tr>
      <th>248</th>
      <td>249</td>
      <td>1</td>
      <td>1</td>
      <td>Beckwith, Mr. Richard Leonard</td>
      <td>male</td>
      <td>37.0</td>
      <td>1</td>
      <td>1</td>
      <td>11751</td>
      <td>52.5542</td>
      <td>D35</td>
      <td>S</td>
    </tr>
    <tr>
      <th>257</th>
      <td>258</td>
      <td>1</td>
      <td>1</td>
      <td>Cherry, Miss. Gladys</td>
      <td>female</td>
      <td>30.0</td>
      <td>0</td>
      <td>0</td>
      <td>110152</td>
      <td>86.5000</td>
      <td>B77</td>
      <td>S</td>
    </tr>
    <tr>
      <th>258</th>
      <td>259</td>
      <td>1</td>
      <td>1</td>
      <td>Ward, Miss. Anna</td>
      <td>female</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>PC 17755</td>
      <td>512.3292</td>
      <td>NaN</td>
      <td>C</td>
    </tr>
    <tr>
      <th>269</th>
      <td>270</td>
      <td>1</td>
      <td>1</td>
      <td>Bissette, Miss. Amelia</td>
      <td>female</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>PC 17760</td>
      <td>135.6333</td>
      <td>C99</td>
      <td>S</td>
    </tr>
    <tr>
      <th>273</th>
      <td>274</td>
      <td>0</td>
      <td>1</td>
      <td>Natsch, Mr. Charles H</td>
      <td>male</td>
      <td>37.0</td>
      <td>0</td>
      <td>1</td>
      <td>PC 17596</td>
      <td>29.7000</td>
      <td>C118</td>
      <td>C</td>
    </tr>
    <tr>
      <th>309</th>
      <td>310</td>
      <td>1</td>
      <td>1</td>
      <td>Francatelli, Miss. Laura Mabel</td>
      <td>female</td>
      <td>30.0</td>
      <td>0</td>
      <td>0</td>
      <td>PC 17485</td>
      <td>56.9292</td>
      <td>E36</td>
      <td>C</td>
    </tr>
    <tr>
      <th>318</th>
      <td>319</td>
      <td>1</td>
      <td>1</td>
      <td>Wick, Miss. Mary Natalie</td>
      <td>female</td>
      <td>31.0</td>
      <td>0</td>
      <td>2</td>
      <td>36928</td>
      <td>164.8667</td>
      <td>C7</td>
      <td>S</td>
    </tr>
    <tr>
      <th>325</th>
      <td>326</td>
      <td>1</td>
      <td>1</td>
      <td>Young, Miss. Marie Grice</td>
      <td>female</td>
      <td>36.0</td>
      <td>0</td>
      <td>0</td>
      <td>PC 17760</td>
      <td>135.6333</td>
      <td>C32</td>
      <td>C</td>
    </tr>
    <tr>
      <th>332</th>
      <td>333</td>
      <td>0</td>
      <td>1</td>
      <td>Graham, Mr. George Edward</td>
      <td>male</td>
      <td>38.0</td>
      <td>0</td>
      <td>1</td>
      <td>PC 17582</td>
      <td>153.4625</td>
      <td>C91</td>
      <td>S</td>
    </tr>
    <tr>
      <th>383</th>
      <td>384</td>
      <td>1</td>
      <td>1</td>
      <td>Holverson, Mrs. Alexander Oskar (Mary Aline To...</td>
      <td>female</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>113789</td>
      <td>52.0000</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>390</th>
      <td>391</td>
      <td>1</td>
      <td>1</td>
      <td>Carter, Mr. William Ernest</td>
      <td>male</td>
      <td>36.0</td>
      <td>1</td>
      <td>2</td>
      <td>113760</td>
      <td>120.0000</td>
      <td>B96 B98</td>
      <td>S</td>
    </tr>
    <tr>
      <th>412</th>
      <td>413</td>
      <td>1</td>
      <td>1</td>
      <td>Minahan, Miss. Daisy E</td>
      <td>female</td>
      <td>33.0</td>
      <td>1</td>
      <td>0</td>
      <td>19928</td>
      <td>90.0000</td>
      <td>C78</td>
      <td>Q</td>
    </tr>
    <tr>
      <th>447</th>
      <td>448</td>
      <td>1</td>
      <td>1</td>
      <td>Seward, Mr. Frederic Kimber</td>
      <td>male</td>
      <td>34.0</td>
      <td>0</td>
      <td>0</td>
      <td>113794</td>
      <td>26.5500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>452</th>
      <td>453</td>
      <td>0</td>
      <td>1</td>
      <td>Foreman, Mr. Benjamin Laventall</td>
      <td>male</td>
      <td>30.0</td>
      <td>0</td>
      <td>0</td>
      <td>113051</td>
      <td>27.7500</td>
      <td>C111</td>
      <td>C</td>
    </tr>
    <tr>
      <th>486</th>
      <td>487</td>
      <td>1</td>
      <td>1</td>
      <td>Hoyt, Mrs. Frederick Maxfield (Jane Anne Forby)</td>
      <td>female</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>19943</td>
      <td>90.0000</td>
      <td>C93</td>
      <td>S</td>
    </tr>
    <tr>
      <th>512</th>
      <td>513</td>
      <td>1</td>
      <td>1</td>
      <td>McGough, Mr. James Robert</td>
      <td>male</td>
      <td>36.0</td>
      <td>0</td>
      <td>0</td>
      <td>PC 17473</td>
      <td>26.2875</td>
      <td>E25</td>
      <td>S</td>
    </tr>
    <tr>
      <th>520</th>
      <td>521</td>
      <td>1</td>
      <td>1</td>
      <td>Perreault, Miss. Anne</td>
      <td>female</td>
      <td>30.0</td>
      <td>0</td>
      <td>0</td>
      <td>12749</td>
      <td>93.5000</td>
      <td>B73</td>
      <td>S</td>
    </tr>
    <tr>
      <th>537</th>
      <td>538</td>
      <td>1</td>
      <td>1</td>
      <td>LeRoy, Miss. Bertha</td>
      <td>female</td>
      <td>30.0</td>
      <td>0</td>
      <td>0</td>
      <td>PC 17761</td>
      <td>106.4250</td>
      <td>NaN</td>
      <td>C</td>
    </tr>
    <tr>
      <th>540</th>
      <td>541</td>
      <td>1</td>
      <td>1</td>
      <td>Crosby, Miss. Harriet R</td>
      <td>female</td>
      <td>36.0</td>
      <td>0</td>
      <td>2</td>
      <td>WE/P 5735</td>
      <td>71.0000</td>
      <td>B22</td>
      <td>S</td>
    </tr>
    <tr>
      <th>558</th>
      <td>559</td>
      <td>1</td>
      <td>1</td>
      <td>Taussig, Mrs. Emil (Tillie Mandelbaum)</td>
      <td>female</td>
      <td>39.0</td>
      <td>1</td>
      <td>1</td>
      <td>110413</td>
      <td>79.6500</td>
      <td>E67</td>
      <td>S</td>
    </tr>
    <tr>
      <th>572</th>
      <td>573</td>
      <td>1</td>
      <td>1</td>
      <td>Flynn, Mr. John Irwin ("Irving")</td>
      <td>male</td>
      <td>36.0</td>
      <td>0</td>
      <td>0</td>
      <td>PC 17474</td>
      <td>26.3875</td>
      <td>E25</td>
      <td>S</td>
    </tr>
    <tr>
      <th>577</th>
      <td>578</td>
      <td>1</td>
      <td>1</td>
      <td>Silvey, Mrs. William Baird (Alice Munger)</td>
      <td>female</td>
      <td>39.0</td>
      <td>1</td>
      <td>0</td>
      <td>13507</td>
      <td>55.9000</td>
      <td>E44</td>
      <td>S</td>
    </tr>
    <tr>
      <th>581</th>
      <td>582</td>
      <td>1</td>
      <td>1</td>
      <td>Thayer, Mrs. John Borland (Marian Longstreth M...</td>
      <td>female</td>
      <td>39.0</td>
      <td>1</td>
      <td>1</td>
      <td>17421</td>
      <td>110.8833</td>
      <td>C68</td>
      <td>C</td>
    </tr>
    <tr>
      <th>583</th>
      <td>584</td>
      <td>0</td>
      <td>1</td>
      <td>Ross, Mr. John Hugo</td>
      <td>male</td>
      <td>36.0</td>
      <td>0</td>
      <td>0</td>
      <td>13049</td>
      <td>40.1250</td>
      <td>A10</td>
      <td>C</td>
    </tr>
    <tr>
      <th>604</th>
      <td>605</td>
      <td>1</td>
      <td>1</td>
      <td>Homer, Mr. Harry ("Mr E Haven")</td>
      <td>male</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>111426</td>
      <td>26.5500</td>
      <td>NaN</td>
      <td>C</td>
    </tr>
    <tr>
      <th>632</th>
      <td>633</td>
      <td>1</td>
      <td>1</td>
      <td>Stahelin-Maeglin, Dr. Max</td>
      <td>male</td>
      <td>32.0</td>
      <td>0</td>
      <td>0</td>
      <td>13214</td>
      <td>30.5000</td>
      <td>B50</td>
      <td>C</td>
    </tr>
    <tr>
      <th>671</th>
      <td>672</td>
      <td>0</td>
      <td>1</td>
      <td>Davidson, Mr. Thornton</td>
      <td>male</td>
      <td>31.0</td>
      <td>1</td>
      <td>0</td>
      <td>F.C. 12750</td>
      <td>52.0000</td>
      <td>B71</td>
      <td>S</td>
    </tr>
    <tr>
      <th>679</th>
      <td>680</td>
      <td>1</td>
      <td>1</td>
      <td>Cardeza, Mr. Thomas Drake Martinez</td>
      <td>male</td>
      <td>36.0</td>
      <td>0</td>
      <td>1</td>
      <td>PC 17755</td>
      <td>512.3292</td>
      <td>B51 B53 B55</td>
      <td>C</td>
    </tr>
    <tr>
      <th>690</th>
      <td>691</td>
      <td>1</td>
      <td>1</td>
      <td>Dick, Mr. Albert Adrian</td>
      <td>male</td>
      <td>31.0</td>
      <td>1</td>
      <td>0</td>
      <td>17474</td>
      <td>57.0000</td>
      <td>B20</td>
      <td>S</td>
    </tr>
    <tr>
      <th>701</th>
      <td>702</td>
      <td>1</td>
      <td>1</td>
      <td>Silverthorne, Mr. Spencer Victor</td>
      <td>male</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>PC 17475</td>
      <td>26.2875</td>
      <td>E24</td>
      <td>S</td>
    </tr>
    <tr>
      <th>716</th>
      <td>717</td>
      <td>1</td>
      <td>1</td>
      <td>Endres, Miss. Caroline Louise</td>
      <td>female</td>
      <td>38.0</td>
      <td>0</td>
      <td>0</td>
      <td>PC 17757</td>
      <td>227.5250</td>
      <td>C45</td>
      <td>C</td>
    </tr>
    <tr>
      <th>737</th>
      <td>738</td>
      <td>1</td>
      <td>1</td>
      <td>Lesurer, Mr. Gustave J</td>
      <td>male</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>PC 17755</td>
      <td>512.3292</td>
      <td>B101</td>
      <td>C</td>
    </tr>
    <tr>
      <th>741</th>
      <td>742</td>
      <td>0</td>
      <td>1</td>
      <td>Cavendish, Mr. Tyrell William</td>
      <td>male</td>
      <td>36.0</td>
      <td>1</td>
      <td>0</td>
      <td>19877</td>
      <td>78.8500</td>
      <td>C46</td>
      <td>S</td>
    </tr>
    <tr>
      <th>759</th>
      <td>760</td>
      <td>1</td>
      <td>1</td>
      <td>Rothes, the Countess. of (Lucy Noel Martha Dye...</td>
      <td>female</td>
      <td>33.0</td>
      <td>0</td>
      <td>0</td>
      <td>110152</td>
      <td>86.5000</td>
      <td>B77</td>
      <td>S</td>
    </tr>
    <tr>
      <th>763</th>
      <td>764</td>
      <td>1</td>
      <td>1</td>
      <td>Carter, Mrs. William Ernest (Lucile Polk)</td>
      <td>female</td>
      <td>36.0</td>
      <td>1</td>
      <td>2</td>
      <td>113760</td>
      <td>120.0000</td>
      <td>B96 B98</td>
      <td>S</td>
    </tr>
    <tr>
      <th>806</th>
      <td>807</td>
      <td>0</td>
      <td>1</td>
      <td>Andrews, Mr. Thomas Jr</td>
      <td>male</td>
      <td>39.0</td>
      <td>0</td>
      <td>0</td>
      <td>112050</td>
      <td>0.0000</td>
      <td>A36</td>
      <td>S</td>
    </tr>
    <tr>
      <th>809</th>
      <td>810</td>
      <td>1</td>
      <td>1</td>
      <td>Chambers, Mrs. Norman Campbell (Bertha Griggs)</td>
      <td>female</td>
      <td>33.0</td>
      <td>1</td>
      <td>0</td>
      <td>113806</td>
      <td>53.1000</td>
      <td>E8</td>
      <td>S</td>
    </tr>
    <tr>
      <th>822</th>
      <td>823</td>
      <td>0</td>
      <td>1</td>
      <td>Reuchlin, Jonkheer. John George</td>
      <td>male</td>
      <td>38.0</td>
      <td>0</td>
      <td>0</td>
      <td>19972</td>
      <td>0.0000</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>835</th>
      <td>836</td>
      <td>1</td>
      <td>1</td>
      <td>Compton, Miss. Sara Rebecca</td>
      <td>female</td>
      <td>39.0</td>
      <td>1</td>
      <td>1</td>
      <td>PC 17756</td>
      <td>83.1583</td>
      <td>E49</td>
      <td>C</td>
    </tr>
    <tr>
      <th>842</th>
      <td>843</td>
      <td>1</td>
      <td>1</td>
      <td>Serepeca, Miss. Augusta</td>
      <td>female</td>
      <td>30.0</td>
      <td>0</td>
      <td>0</td>
      <td>113798</td>
      <td>31.0000</td>
      <td>NaN</td>
      <td>C</td>
    </tr>
    <tr>
      <th>867</th>
      <td>868</td>
      <td>0</td>
      <td>1</td>
      <td>Roebling, Mr. Washington Augustus II</td>
      <td>male</td>
      <td>31.0</td>
      <td>0</td>
      <td>0</td>
      <td>PC 17590</td>
      <td>50.4958</td>
      <td>A24</td>
      <td>S</td>
    </tr>
    <tr>
      <th>872</th>
      <td>873</td>
      <td>0</td>
      <td>1</td>
      <td>Carlsson, Mr. Frans Olof</td>
      <td>male</td>
      <td>33.0</td>
      <td>0</td>
      <td>0</td>
      <td>695</td>
      <td>5.0000</td>
      <td>B51 B53 B55</td>
      <td>S</td>
    </tr>
  </tbody>
</table>
</div>



### 새 column 추가하기

 - [] 사용하여 추가하기

 - insert 함수 사용하여 원하는 위치에 추가하기


```python
train_data['Age_double'] = train_data['Age'] * 2

train_data.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
      <th>Age_double</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>0</td>
      <td>3</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>male</td>
      <td>22.0</td>
      <td>1</td>
      <td>0</td>
      <td>A/5 21171</td>
      <td>7.2500</td>
      <td>NaN</td>
      <td>S</td>
      <td>44.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1</td>
      <td>1</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>female</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
      <td>C85</td>
      <td>C</td>
      <td>76.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>1</td>
      <td>3</td>
      <td>Heikkinen, Miss. Laina</td>
      <td>female</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>STON/O2. 3101282</td>
      <td>7.9250</td>
      <td>NaN</td>
      <td>S</td>
      <td>52.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>1</td>
      <td>1</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>female</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
      <td>C123</td>
      <td>S</td>
      <td>70.0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>0</td>
      <td>3</td>
      <td>Allen, Mr. William Henry</td>
      <td>male</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>373450</td>
      <td>8.0500</td>
      <td>NaN</td>
      <td>S</td>
      <td>70.0</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>


```python
train_data['Age_tripple'] = train_data['Age_double'] + train_data['Age']

train_data.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
      <th>Age_double</th>
      <th>Age_tripple</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>0</td>
      <td>3</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>male</td>
      <td>22.0</td>
      <td>1</td>
      <td>0</td>
      <td>A/5 21171</td>
      <td>7.2500</td>
      <td>NaN</td>
      <td>S</td>
      <td>44.0</td>
      <td>66.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1</td>
      <td>1</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>female</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
      <td>C85</td>
      <td>C</td>
      <td>76.0</td>
      <td>114.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>1</td>
      <td>3</td>
      <td>Heikkinen, Miss. Laina</td>
      <td>female</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>STON/O2. 3101282</td>
      <td>7.9250</td>
      <td>NaN</td>
      <td>S</td>
      <td>52.0</td>
      <td>78.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>1</td>
      <td>1</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>female</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
      <td>C123</td>
      <td>S</td>
      <td>70.0</td>
      <td>105.0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>0</td>
      <td>3</td>
      <td>Allen, Mr. William Henry</td>
      <td>male</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>373450</td>
      <td>8.0500</td>
      <td>NaN</td>
      <td>S</td>
      <td>70.0</td>
      <td>105.0</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>


```python
train_data.insert(3, 'Fare10', train_data['Fare'] / 10) # insert : 특정 열에 넣기 

train_data.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Fare10</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
      <th>Age_double</th>
      <th>Age_tripple</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>0</td>
      <td>3</td>
      <td>0.72500</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>male</td>
      <td>22.0</td>
      <td>1</td>
      <td>0</td>
      <td>A/5 21171</td>
      <td>7.2500</td>
      <td>NaN</td>
      <td>S</td>
      <td>44.0</td>
      <td>66.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1</td>
      <td>1</td>
      <td>7.12833</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>female</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
      <td>C85</td>
      <td>C</td>
      <td>76.0</td>
      <td>114.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>1</td>
      <td>3</td>
      <td>0.79250</td>
      <td>Heikkinen, Miss. Laina</td>
      <td>female</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>STON/O2. 3101282</td>
      <td>7.9250</td>
      <td>NaN</td>
      <td>S</td>
      <td>52.0</td>
      <td>78.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>1</td>
      <td>1</td>
      <td>5.31000</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>female</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
      <td>C123</td>
      <td>S</td>
      <td>70.0</td>
      <td>105.0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>0</td>
      <td>3</td>
      <td>0.80500</td>
      <td>Allen, Mr. William Henry</td>
      <td>male</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>373450</td>
      <td>8.0500</td>
      <td>NaN</td>
      <td>S</td>
      <td>70.0</td>
      <td>105.0</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

### column 삭제하기

 - drop 함수 사용하여 삭제

   - 리스트를 사용하여 멀티플 삭제 가능 


```python
train_data.drop('Age_tripple', axis=1) # axis =0 은 행레벨, 1은 열레벨

train_data.head() 

# 보면 알겠지만 대부분의 함수들은 복사본에 적용. 원본 데이터는 건들지 않는다.
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Fare10</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
      <th>Age_double</th>
      <th>Age_tripple</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>0</td>
      <td>3</td>
      <td>0.72500</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>male</td>
      <td>22.0</td>
      <td>1</td>
      <td>0</td>
      <td>A/5 21171</td>
      <td>7.2500</td>
      <td>NaN</td>
      <td>S</td>
      <td>44.0</td>
      <td>66.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1</td>
      <td>1</td>
      <td>7.12833</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>female</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
      <td>C85</td>
      <td>C</td>
      <td>76.0</td>
      <td>114.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>1</td>
      <td>3</td>
      <td>0.79250</td>
      <td>Heikkinen, Miss. Laina</td>
      <td>female</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>STON/O2. 3101282</td>
      <td>7.9250</td>
      <td>NaN</td>
      <td>S</td>
      <td>52.0</td>
      <td>78.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>1</td>
      <td>1</td>
      <td>5.31000</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>female</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
      <td>C123</td>
      <td>S</td>
      <td>70.0</td>
      <td>105.0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>0</td>
      <td>3</td>
      <td>0.80500</td>
      <td>Allen, Mr. William Henry</td>
      <td>male</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>373450</td>
      <td>8.0500</td>
      <td>NaN</td>
      <td>S</td>
      <td>70.0</td>
      <td>105.0</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>


```python
train_data.drop(['Age_double', 'Age_tripple'], axis=1)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Fare10</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>0</td>
      <td>3</td>
      <td>0.72500</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>male</td>
      <td>22.0</td>
      <td>1</td>
      <td>0</td>
      <td>A/5 21171</td>
      <td>7.2500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1</td>
      <td>1</td>
      <td>7.12833</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>female</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
      <td>C85</td>
      <td>C</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>1</td>
      <td>3</td>
      <td>0.79250</td>
      <td>Heikkinen, Miss. Laina</td>
      <td>female</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>STON/O2. 3101282</td>
      <td>7.9250</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>1</td>
      <td>1</td>
      <td>5.31000</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>female</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
      <td>C123</td>
      <td>S</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>0</td>
      <td>3</td>
      <td>0.80500</td>
      <td>Allen, Mr. William Henry</td>
      <td>male</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>373450</td>
      <td>8.0500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>886</th>
      <td>887</td>
      <td>0</td>
      <td>2</td>
      <td>1.30000</td>
      <td>Montvila, Rev. Juozas</td>
      <td>male</td>
      <td>27.0</td>
      <td>0</td>
      <td>0</td>
      <td>211536</td>
      <td>13.0000</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>887</th>
      <td>888</td>
      <td>1</td>
      <td>1</td>
      <td>3.00000</td>
      <td>Graham, Miss. Margaret Edith</td>
      <td>female</td>
      <td>19.0</td>
      <td>0</td>
      <td>0</td>
      <td>112053</td>
      <td>30.0000</td>
      <td>B42</td>
      <td>S</td>
    </tr>
    <tr>
      <th>888</th>
      <td>889</td>
      <td>0</td>
      <td>3</td>
      <td>2.34500</td>
      <td>Johnston, Miss. Catherine Helen "Carrie"</td>
      <td>female</td>
      <td>NaN</td>
      <td>1</td>
      <td>2</td>
      <td>W./C. 6607</td>
      <td>23.4500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>889</th>
      <td>890</td>
      <td>1</td>
      <td>1</td>
      <td>3.00000</td>
      <td>Behr, Mr. Karl Howell</td>
      <td>male</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>111369</td>
      <td>30.0000</td>
      <td>C148</td>
      <td>C</td>
    </tr>
    <tr>
      <th>890</th>
      <td>891</td>
      <td>0</td>
      <td>3</td>
      <td>0.77500</td>
      <td>Dooley, Mr. Patrick</td>
      <td>male</td>
      <td>32.0</td>
      <td>0</td>
      <td>0</td>
      <td>370376</td>
      <td>7.7500</td>
      <td>NaN</td>
      <td>Q</td>
    </tr>
  </tbody>
</table>
<p>891 rows × 13 columns</p>
</div>

<br>
<br>


```python
train_data.drop(['Age_double', 'Age_tripple'], axis=1, inplace=True)

# inplace하면 원본에 저장
```


```python
train_data
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Fare10</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>0</td>
      <td>3</td>
      <td>0.72500</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>male</td>
      <td>22.0</td>
      <td>1</td>
      <td>0</td>
      <td>A/5 21171</td>
      <td>7.2500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1</td>
      <td>1</td>
      <td>7.12833</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>female</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
      <td>C85</td>
      <td>C</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>1</td>
      <td>3</td>
      <td>0.79250</td>
      <td>Heikkinen, Miss. Laina</td>
      <td>female</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>STON/O2. 3101282</td>
      <td>7.9250</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>1</td>
      <td>1</td>
      <td>5.31000</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>female</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
      <td>C123</td>
      <td>S</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>0</td>
      <td>3</td>
      <td>0.80500</td>
      <td>Allen, Mr. William Henry</td>
      <td>male</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>373450</td>
      <td>8.0500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>886</th>
      <td>887</td>
      <td>0</td>
      <td>2</td>
      <td>1.30000</td>
      <td>Montvila, Rev. Juozas</td>
      <td>male</td>
      <td>27.0</td>
      <td>0</td>
      <td>0</td>
      <td>211536</td>
      <td>13.0000</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>887</th>
      <td>888</td>
      <td>1</td>
      <td>1</td>
      <td>3.00000</td>
      <td>Graham, Miss. Margaret Edith</td>
      <td>female</td>
      <td>19.0</td>
      <td>0</td>
      <td>0</td>
      <td>112053</td>
      <td>30.0000</td>
      <td>B42</td>
      <td>S</td>
    </tr>
    <tr>
      <th>888</th>
      <td>889</td>
      <td>0</td>
      <td>3</td>
      <td>2.34500</td>
      <td>Johnston, Miss. Catherine Helen "Carrie"</td>
      <td>female</td>
      <td>NaN</td>
      <td>1</td>
      <td>2</td>
      <td>W./C. 6607</td>
      <td>23.4500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>889</th>
      <td>890</td>
      <td>1</td>
      <td>1</td>
      <td>3.00000</td>
      <td>Behr, Mr. Karl Howell</td>
      <td>male</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>111369</td>
      <td>30.0000</td>
      <td>C148</td>
      <td>C</td>
    </tr>
    <tr>
      <th>890</th>
      <td>891</td>
      <td>0</td>
      <td>3</td>
      <td>0.77500</td>
      <td>Dooley, Mr. Patrick</td>
      <td>male</td>
      <td>32.0</td>
      <td>0</td>
      <td>0</td>
      <td>370376</td>
      <td>7.7500</td>
      <td>NaN</td>
      <td>Q</td>
    </tr>
  </tbody>
</table>
<p>891 rows × 13 columns</p>
</div>

<br>
<br>

### 변수의 상관관계

- 이 두변수간의 흐름이 얼마나 비슷한가를 나타내는 척도 (증가, 감소) 그 폭이 얼마나 비슷하냐   
- 두 변수간의 패턴을 본다.   
- 인과관계는 일수도 있고 아닐 수도 있다. 


```python
train_data = pd.read_csv('F:/data/titanic/train.csv')

train_data.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>0</td>
      <td>3</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>male</td>
      <td>22.0</td>
      <td>1</td>
      <td>0</td>
      <td>A/5 21171</td>
      <td>7.2500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1</td>
      <td>1</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>female</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
      <td>C85</td>
      <td>C</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>1</td>
      <td>3</td>
      <td>Heikkinen, Miss. Laina</td>
      <td>female</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>STON/O2. 3101282</td>
      <td>7.9250</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>1</td>
      <td>1</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>female</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
      <td>C123</td>
      <td>S</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>0</td>
      <td>3</td>
      <td>Allen, Mr. William Henry</td>
      <td>male</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>373450</td>
      <td>8.0500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

### 변수(column) 사이의 상관계수(correlation) 

 - corr함수를 통해 상관계수 연산 (-1, 1 사이의 결과)

   - 연속성(숫자형)데이터에 대해서만 연산

   - 인과관계를 의미하진 않음


```python
train_data.corr()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Fare</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>PassengerId</th>
      <td>1.000000</td>
      <td>-0.005007</td>
      <td>-0.035144</td>
      <td>0.036847</td>
      <td>-0.057527</td>
      <td>-0.001652</td>
      <td>0.012658</td>
    </tr>
    <tr>
      <th>Survived</th>
      <td>-0.005007</td>
      <td>1.000000</td>
      <td>-0.338481</td>
      <td>-0.077221</td>
      <td>-0.035322</td>
      <td>0.081629</td>
      <td>0.257307</td>
    </tr>
    <tr>
      <th>Pclass</th>
      <td>-0.035144</td>
      <td>-0.338481</td>
      <td>1.000000</td>
      <td>-0.369226</td>
      <td>0.083081</td>
      <td>0.018443</td>
      <td>-0.549500</td>
    </tr>
    <tr>
      <th>Age</th>
      <td>0.036847</td>
      <td>-0.077221</td>
      <td>-0.369226</td>
      <td>1.000000</td>
      <td>-0.308247</td>
      <td>-0.189119</td>
      <td>0.096067</td>
    </tr>
    <tr>
      <th>SibSp</th>
      <td>-0.057527</td>
      <td>-0.035322</td>
      <td>0.083081</td>
      <td>-0.308247</td>
      <td>1.000000</td>
      <td>0.414838</td>
      <td>0.159651</td>
    </tr>
    <tr>
      <th>Parch</th>
      <td>-0.001652</td>
      <td>0.081629</td>
      <td>0.018443</td>
      <td>-0.189119</td>
      <td>0.414838</td>
      <td>1.000000</td>
      <td>0.216225</td>
    </tr>
    <tr>
      <th>Fare</th>
      <td>0.012658</td>
      <td>0.257307</td>
      <td>-0.549500</td>
      <td>0.096067</td>
      <td>0.159651</td>
      <td>0.216225</td>
      <td>1.000000</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>


```python
plt.matshow(train_data.corr()) #색깔이 밝을수록 관련이 깊다.
```

![pandas_org_120_1](https://user-images.githubusercontent.com/78655692/140646090-e0857119-5493-4285-93ef-1ff71eb985c9.png)
    


```python
train_data.isna() # True인 경우 NaN이다.
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>True</td>
      <td>False</td>
    </tr>
    <tr>
      <th>1</th>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
    </tr>
    <tr>
      <th>2</th>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>True</td>
      <td>False</td>
    </tr>
    <tr>
      <th>3</th>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
    </tr>
    <tr>
      <th>4</th>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>True</td>
      <td>False</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>886</th>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>True</td>
      <td>False</td>
    </tr>
    <tr>
      <th>887</th>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
    </tr>
    <tr>
      <th>888</th>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>True</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>True</td>
      <td>False</td>
    </tr>
    <tr>
      <th>889</th>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
    </tr>
    <tr>
      <th>890</th>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>False</td>
      <td>True</td>
      <td>False</td>
    </tr>
  </tbody>
</table>
<p>891 rows × 12 columns</p>
</div>

<br>
<br>


```python
train_data['Age'].isna()
```




    0      False
    1      False
    2      False
    3      False
    4      False
           ...  
    886    False
    887    False
    888     True
    889    False
    890    False
    Name: Age, Length: 891, dtype: bool

<br>
<br>

### NaN 처리 방법

 - 데이터에서 삭제

   - dropna 함수 

 - 다른 값으로 치환

   - fillna 함수

* NaN 데이터 삭제하기


```python
train_data.dropna() # 한개라도 NaN이 있다면 그 row를 지워버린다.
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1</td>
      <td>1</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>female</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
      <td>C85</td>
      <td>C</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>1</td>
      <td>1</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>female</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
      <td>C123</td>
      <td>S</td>
    </tr>
    <tr>
      <th>6</th>
      <td>7</td>
      <td>0</td>
      <td>1</td>
      <td>McCarthy, Mr. Timothy J</td>
      <td>male</td>
      <td>54.0</td>
      <td>0</td>
      <td>0</td>
      <td>17463</td>
      <td>51.8625</td>
      <td>E46</td>
      <td>S</td>
    </tr>
    <tr>
      <th>10</th>
      <td>11</td>
      <td>1</td>
      <td>3</td>
      <td>Sandstrom, Miss. Marguerite Rut</td>
      <td>female</td>
      <td>4.0</td>
      <td>1</td>
      <td>1</td>
      <td>PP 9549</td>
      <td>16.7000</td>
      <td>G6</td>
      <td>S</td>
    </tr>
    <tr>
      <th>11</th>
      <td>12</td>
      <td>1</td>
      <td>1</td>
      <td>Bonnell, Miss. Elizabeth</td>
      <td>female</td>
      <td>58.0</td>
      <td>0</td>
      <td>0</td>
      <td>113783</td>
      <td>26.5500</td>
      <td>C103</td>
      <td>S</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>871</th>
      <td>872</td>
      <td>1</td>
      <td>1</td>
      <td>Beckwith, Mrs. Richard Leonard (Sallie Monypeny)</td>
      <td>female</td>
      <td>47.0</td>
      <td>1</td>
      <td>1</td>
      <td>11751</td>
      <td>52.5542</td>
      <td>D35</td>
      <td>S</td>
    </tr>
    <tr>
      <th>872</th>
      <td>873</td>
      <td>0</td>
      <td>1</td>
      <td>Carlsson, Mr. Frans Olof</td>
      <td>male</td>
      <td>33.0</td>
      <td>0</td>
      <td>0</td>
      <td>695</td>
      <td>5.0000</td>
      <td>B51 B53 B55</td>
      <td>S</td>
    </tr>
    <tr>
      <th>879</th>
      <td>880</td>
      <td>1</td>
      <td>1</td>
      <td>Potter, Mrs. Thomas Jr (Lily Alexenia Wilson)</td>
      <td>female</td>
      <td>56.0</td>
      <td>0</td>
      <td>1</td>
      <td>11767</td>
      <td>83.1583</td>
      <td>C50</td>
      <td>C</td>
    </tr>
    <tr>
      <th>887</th>
      <td>888</td>
      <td>1</td>
      <td>1</td>
      <td>Graham, Miss. Margaret Edith</td>
      <td>female</td>
      <td>19.0</td>
      <td>0</td>
      <td>0</td>
      <td>112053</td>
      <td>30.0000</td>
      <td>B42</td>
      <td>S</td>
    </tr>
    <tr>
      <th>889</th>
      <td>890</td>
      <td>1</td>
      <td>1</td>
      <td>Behr, Mr. Karl Howell</td>
      <td>male</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>111369</td>
      <td>30.0000</td>
      <td>C148</td>
      <td>C</td>
    </tr>
  </tbody>
</table>
<p>183 rows × 12 columns</p>
</div>


<br>
<br>

```python
train_data.dropna(subset=['Age', 'Cabin']) # subset : 특정 열의 NaN만 판단
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1</td>
      <td>1</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>female</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
      <td>C85</td>
      <td>C</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>1</td>
      <td>1</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>female</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
      <td>C123</td>
      <td>S</td>
    </tr>
    <tr>
      <th>6</th>
      <td>7</td>
      <td>0</td>
      <td>1</td>
      <td>McCarthy, Mr. Timothy J</td>
      <td>male</td>
      <td>54.0</td>
      <td>0</td>
      <td>0</td>
      <td>17463</td>
      <td>51.8625</td>
      <td>E46</td>
      <td>S</td>
    </tr>
    <tr>
      <th>10</th>
      <td>11</td>
      <td>1</td>
      <td>3</td>
      <td>Sandstrom, Miss. Marguerite Rut</td>
      <td>female</td>
      <td>4.0</td>
      <td>1</td>
      <td>1</td>
      <td>PP 9549</td>
      <td>16.7000</td>
      <td>G6</td>
      <td>S</td>
    </tr>
    <tr>
      <th>11</th>
      <td>12</td>
      <td>1</td>
      <td>1</td>
      <td>Bonnell, Miss. Elizabeth</td>
      <td>female</td>
      <td>58.0</td>
      <td>0</td>
      <td>0</td>
      <td>113783</td>
      <td>26.5500</td>
      <td>C103</td>
      <td>S</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>871</th>
      <td>872</td>
      <td>1</td>
      <td>1</td>
      <td>Beckwith, Mrs. Richard Leonard (Sallie Monypeny)</td>
      <td>female</td>
      <td>47.0</td>
      <td>1</td>
      <td>1</td>
      <td>11751</td>
      <td>52.5542</td>
      <td>D35</td>
      <td>S</td>
    </tr>
    <tr>
      <th>872</th>
      <td>873</td>
      <td>0</td>
      <td>1</td>
      <td>Carlsson, Mr. Frans Olof</td>
      <td>male</td>
      <td>33.0</td>
      <td>0</td>
      <td>0</td>
      <td>695</td>
      <td>5.0000</td>
      <td>B51 B53 B55</td>
      <td>S</td>
    </tr>
    <tr>
      <th>879</th>
      <td>880</td>
      <td>1</td>
      <td>1</td>
      <td>Potter, Mrs. Thomas Jr (Lily Alexenia Wilson)</td>
      <td>female</td>
      <td>56.0</td>
      <td>0</td>
      <td>1</td>
      <td>11767</td>
      <td>83.1583</td>
      <td>C50</td>
      <td>C</td>
    </tr>
    <tr>
      <th>887</th>
      <td>888</td>
      <td>1</td>
      <td>1</td>
      <td>Graham, Miss. Margaret Edith</td>
      <td>female</td>
      <td>19.0</td>
      <td>0</td>
      <td>0</td>
      <td>112053</td>
      <td>30.0000</td>
      <td>B42</td>
      <td>S</td>
    </tr>
    <tr>
      <th>889</th>
      <td>890</td>
      <td>1</td>
      <td>1</td>
      <td>Behr, Mr. Karl Howell</td>
      <td>male</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>111369</td>
      <td>30.0000</td>
      <td>C148</td>
      <td>C</td>
    </tr>
  </tbody>
</table>
<p>185 rows × 12 columns</p>
</div>


<br>
<br>

```python
train_data.dropna(axis=1) # 컬럼 중에 NaN이 있다면 지워버려라
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>0</td>
      <td>3</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>male</td>
      <td>1</td>
      <td>0</td>
      <td>A/5 21171</td>
      <td>7.2500</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1</td>
      <td>1</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>female</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>1</td>
      <td>3</td>
      <td>Heikkinen, Miss. Laina</td>
      <td>female</td>
      <td>0</td>
      <td>0</td>
      <td>STON/O2. 3101282</td>
      <td>7.9250</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>1</td>
      <td>1</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>female</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>0</td>
      <td>3</td>
      <td>Allen, Mr. William Henry</td>
      <td>male</td>
      <td>0</td>
      <td>0</td>
      <td>373450</td>
      <td>8.0500</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>886</th>
      <td>887</td>
      <td>0</td>
      <td>2</td>
      <td>Montvila, Rev. Juozas</td>
      <td>male</td>
      <td>0</td>
      <td>0</td>
      <td>211536</td>
      <td>13.0000</td>
    </tr>
    <tr>
      <th>887</th>
      <td>888</td>
      <td>1</td>
      <td>1</td>
      <td>Graham, Miss. Margaret Edith</td>
      <td>female</td>
      <td>0</td>
      <td>0</td>
      <td>112053</td>
      <td>30.0000</td>
    </tr>
    <tr>
      <th>888</th>
      <td>889</td>
      <td>0</td>
      <td>3</td>
      <td>Johnston, Miss. Catherine Helen "Carrie"</td>
      <td>female</td>
      <td>1</td>
      <td>2</td>
      <td>W./C. 6607</td>
      <td>23.4500</td>
    </tr>
    <tr>
      <th>889</th>
      <td>890</td>
      <td>1</td>
      <td>1</td>
      <td>Behr, Mr. Karl Howell</td>
      <td>male</td>
      <td>0</td>
      <td>0</td>
      <td>111369</td>
      <td>30.0000</td>
    </tr>
    <tr>
      <th>890</th>
      <td>891</td>
      <td>0</td>
      <td>3</td>
      <td>Dooley, Mr. Patrick</td>
      <td>male</td>
      <td>0</td>
      <td>0</td>
      <td>370376</td>
      <td>7.7500</td>
    </tr>
  </tbody>
</table>
<p>891 rows × 9 columns</p>
</div>

<br>
<br>

### NaN 값 대체하기

- 평균으로 대체하기

- 생존자/사망자 별 평균으로 대체하기


```python
train_data['Age'].fillna(train_data['Age'].mean())

#평균을 구하고 결측값에 넣는다. 

# # inplace=False : 결과 반환 # inplace=True : 원본 데이터에 적용
```




    0      22.000000
    1      38.000000
    2      26.000000
    3      35.000000
    4      35.000000
             ...    
    886    27.000000
    887    19.000000
    888    29.699118
    889    26.000000
    890    32.000000
    Name: Age, Length: 891, dtype: float64


<br>
<br>

```python
# 생존자 나이 평균

mean1 = train_data[train_data['Survived'] == 1]['Age'].mean()



# 사망자 나이 평균

mean0 = train_data[train_data['Survived'] == 0]['Age'].mean()



print(mean1, mean0)
```

    28.343689655172415 30.62617924528302
    
<br>
<br>

```python
train_data[train_data['Survived'] == 1]['Age'].fillna(mean1)

train_data[train_data['Survived'] == 0]['Age'].fillna(mean0)
```




    0      22.000000
    4      35.000000
    5      30.626179
    6      54.000000
    7       2.000000
             ...    
    884    25.000000
    885    39.000000
    886    27.000000
    888    30.626179
    890    32.000000
    Name: Age, Length: 549, dtype: float64


<br>
<br>

```python
train_data.loc[train_data['Survived'] == 1, 'Age'] = train_data[train_data['Survived'] == 1]['Age'].fillna(mean1)

train_data.loc[train_data['Survived'] == 0, 'Age'] = train_data[train_data['Survived'] == 0]['Age'].fillna(mean0)
```


```python
train_data = pd.read_csv('E:\kaggle/titanic/train.csv')
```


```python
# numpy와 pandas를 쓸때는 최대한 loop를 지양해야 한다.
```

<br>
<br>

### Pclass 변수 변환하기

 - astype 사용하여 간단히 타입만 변환


```python
train_data['Pclass'] = train_data['Pclass'].astype(str)
```

<br>
<br>

### Age 변수 변환하기

 - 변환 로직을 함수로 만든 후, apply 함수로 적용


```python
def age_categorize(age): #연령대별로 나타내기

    if math.isnan(age):

        return -1

    return math.floor(age / 10) * 10
```

<br>
<br>

```python
train_data['Age'].apply(age_categorize)

# apply변수는 해당 컬럼의 모든 값에 다 적용시켜준다.
```




    0      20
    1      30
    2      20
    3      30
    4      30
           ..
    886    20
    887    10
    888    -1
    889    20
    890    30
    Name: Age, Length: 891, dtype: int64

<br>
<br>

## One-hot encoding

 - 범주형 데이터는 분석단계에서 계산이 어렵기 때문에 숫자형으로 변경이 필요함

 - 범주형 데이터의 각 범주(category)를 column레벨로 변경

 - 해당 범주에 해당하면 1, 아니면 0으로 채우는 인코딩 기법

 - pandas.get_dummies 함수 사용

   - drop_first : 첫번째 카테고리 값은 사용하지 않음


```python
pd.get_dummies(train_data, columns=['Pclass', 'Sex', 'Embarked'], drop_first=False) 

# columns : 바꾸고자 하는 컬럼만
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Name</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Pclass_1</th>
      <th>Pclass_2</th>
      <th>Pclass_3</th>
      <th>Sex_female</th>
      <th>Sex_male</th>
      <th>Embarked_C</th>
      <th>Embarked_Q</th>
      <th>Embarked_S</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>0</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>22.0</td>
      <td>1</td>
      <td>0</td>
      <td>A/5 21171</td>
      <td>7.2500</td>
      <td>NaN</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
      <td>C85</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>1</td>
      <td>Heikkinen, Miss. Laina</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>STON/O2. 3101282</td>
      <td>7.9250</td>
      <td>NaN</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>1</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
      <td>C123</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>0</td>
      <td>Allen, Mr. William Henry</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>373450</td>
      <td>8.0500</td>
      <td>NaN</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>886</th>
      <td>887</td>
      <td>0</td>
      <td>Montvila, Rev. Juozas</td>
      <td>27.0</td>
      <td>0</td>
      <td>0</td>
      <td>211536</td>
      <td>13.0000</td>
      <td>NaN</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <th>887</th>
      <td>888</td>
      <td>1</td>
      <td>Graham, Miss. Margaret Edith</td>
      <td>19.0</td>
      <td>0</td>
      <td>0</td>
      <td>112053</td>
      <td>30.0000</td>
      <td>B42</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <th>888</th>
      <td>889</td>
      <td>0</td>
      <td>Johnston, Miss. Catherine Helen "Carrie"</td>
      <td>NaN</td>
      <td>1</td>
      <td>2</td>
      <td>W./C. 6607</td>
      <td>23.4500</td>
      <td>NaN</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <th>889</th>
      <td>890</td>
      <td>1</td>
      <td>Behr, Mr. Karl Howell</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>111369</td>
      <td>30.0000</td>
      <td>C148</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>890</th>
      <td>891</td>
      <td>0</td>
      <td>Dooley, Mr. Patrick</td>
      <td>32.0</td>
      <td>0</td>
      <td>0</td>
      <td>370376</td>
      <td>7.7500</td>
      <td>NaN</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
    </tr>
  </tbody>
</table>
<p>891 rows × 17 columns</p>
</div>

<br>
<br>


```python
pd.get_dummies(train_data, columns=['Pclass', 'Sex', 'Embarked'], drop_first=True)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Name</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Pclass_2</th>
      <th>Pclass_3</th>
      <th>Sex_male</th>
      <th>Embarked_Q</th>
      <th>Embarked_S</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>0</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>22.0</td>
      <td>1</td>
      <td>0</td>
      <td>A/5 21171</td>
      <td>7.2500</td>
      <td>NaN</td>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
      <td>C85</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>1</td>
      <td>Heikkinen, Miss. Laina</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>STON/O2. 3101282</td>
      <td>7.9250</td>
      <td>NaN</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>1</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
      <td>C123</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>0</td>
      <td>Allen, Mr. William Henry</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>373450</td>
      <td>8.0500</td>
      <td>NaN</td>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>886</th>
      <td>887</td>
      <td>0</td>
      <td>Montvila, Rev. Juozas</td>
      <td>27.0</td>
      <td>0</td>
      <td>0</td>
      <td>211536</td>
      <td>13.0000</td>
      <td>NaN</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <th>887</th>
      <td>888</td>
      <td>1</td>
      <td>Graham, Miss. Margaret Edith</td>
      <td>19.0</td>
      <td>0</td>
      <td>0</td>
      <td>112053</td>
      <td>30.0000</td>
      <td>B42</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <th>888</th>
      <td>889</td>
      <td>0</td>
      <td>Johnston, Miss. Catherine Helen "Carrie"</td>
      <td>NaN</td>
      <td>1</td>
      <td>2</td>
      <td>W./C. 6607</td>
      <td>23.4500</td>
      <td>NaN</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <th>889</th>
      <td>890</td>
      <td>1</td>
      <td>Behr, Mr. Karl Howell</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>111369</td>
      <td>30.0000</td>
      <td>C148</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>890</th>
      <td>891</td>
      <td>0</td>
      <td>Dooley, Mr. Patrick</td>
      <td>32.0</td>
      <td>0</td>
      <td>0</td>
      <td>370376</td>
      <td>7.7500</td>
      <td>NaN</td>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
    </tr>
  </tbody>
</table>
<p>891 rows × 14 columns</p>
</div>

<br>
<br>

## group by

  + 아래의 세 단계를 적용하여 데이터를 그룹화(groupping) (SQL의 group by 와 개념적으로는 동일, 사용법은 유사)

    - 데이터 분할

    - operation 적용

    - 데이터 병합

<br>
<br>


```python
# data 출처: https://www.kaggle.com/hesh97/titanicdataset-traincsv/data

df = pd.read_csv('F:/data/titanic/train.csv')

df.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>0</td>
      <td>3</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>male</td>
      <td>22.0</td>
      <td>1</td>
      <td>0</td>
      <td>A/5 21171</td>
      <td>7.2500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1</td>
      <td>1</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>female</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
      <td>C85</td>
      <td>C</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>1</td>
      <td>3</td>
      <td>Heikkinen, Miss. Laina</td>
      <td>female</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>STON/O2. 3101282</td>
      <td>7.9250</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>1</td>
      <td>1</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>female</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
      <td>C123</td>
      <td>S</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>0</td>
      <td>3</td>
      <td>Allen, Mr. William Henry</td>
      <td>male</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>373450</td>
      <td>8.0500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

### GroupBy groups 속성

 - 각 그룹과 그룹에 속한 index를 dict 형태로 표현


```python
class_group = df.groupby('Pclass')

class_group # 이렇게 하면 groupby 객체가 만들어짐
```




    <pandas.core.groupby.generic.DataFrameGroupBy object at 0x000002A260234DF0>




```python
class_group.groups
```




    {1: [1, 3, 6, 11, 23, 27, 30, 31, 34, 35, 52, 54, 55, 61, 62, 64, 83, 88, 92, 96, 97, 102, 110, 118, 124, 136, 137, 139, 151, 155, 166, 168, 170, 174, 177, 185, 187, 194, 195, 209, 215, 218, 224, 230, 245, 248, 252, 256, 257, 258, 262, 263, 268, 269, 270, 273, 275, 284, 290, 291, 295, 297, 298, 299, 305, 306, 307, 309, 310, 311, 318, 319, 325, 329, 331, 332, 334, 336, 337, 339, 341, 351, 356, 366, 369, 370, 373, 375, 377, 380, 383, 390, 393, 412, 430, 434, 435, 438, 445, 447, ...], 2: [9, 15, 17, 20, 21, 33, 41, 43, 53, 56, 58, 66, 70, 72, 78, 84, 98, 99, 117, 120, 122, 123, 133, 134, 135, 144, 145, 148, 149, 150, 161, 178, 181, 183, 190, 191, 193, 199, 211, 213, 217, 219, 221, 226, 228, 232, 234, 236, 237, 238, 239, 242, 247, 249, 259, 265, 272, 277, 288, 292, 303, 308, 312, 314, 316, 317, 322, 323, 327, 340, 342, 343, 344, 345, 346, 357, 361, 385, 387, 389, 397, 398, 399, 405, 407, 413, 416, 417, 418, 426, 427, 432, 437, 439, 440, 443, 446, 450, 458, 463, ...], 3: [0, 2, 4, 5, 7, 8, 10, 12, 13, 14, 16, 18, 19, 22, 24, 25, 26, 28, 29, 32, 36, 37, 38, 39, 40, 42, 44, 45, 46, 47, 48, 49, 50, 51, 57, 59, 60, 63, 65, 67, 68, 69, 71, 73, 74, 75, 76, 77, 79, 80, 81, 82, 85, 86, 87, 89, 90, 91, 93, 94, 95, 100, 101, 103, 104, 105, 106, 107, 108, 109, 111, 112, 113, 114, 115, 116, 119, 121, 125, 126, 127, 128, 129, 130, 131, 132, 138, 140, 141, 142, 143, 146, 147, 152, 153, 154, 156, 157, 158, 159, ...]}




```python
gender_group = df.groupby('Sex')

gender_group.groups
```




    {'female': [1, 2, 3, 8, 9, 10, 11, 14, 15, 18, 19, 22, 24, 25, 28, 31, 32, 38, 39, 40, 41, 43, 44, 47, 49, 52, 53, 56, 58, 61, 66, 68, 71, 79, 82, 84, 85, 88, 98, 100, 106, 109, 111, 113, 114, 119, 123, 128, 132, 133, 136, 140, 141, 142, 147, 151, 156, 161, 166, 167, 172, 177, 180, 184, 186, 190, 192, 194, 195, 198, 199, 205, 208, 211, 215, 216, 218, 229, 230, 233, 235, 237, 240, 241, 246, 247, 251, 254, 255, 256, 257, 258, 259, 264, 268, 269, 272, 274, 275, 276, ...], 'male': [0, 4, 5, 6, 7, 12, 13, 16, 17, 20, 21, 23, 26, 27, 29, 30, 33, 34, 35, 36, 37, 42, 45, 46, 48, 50, 51, 54, 55, 57, 59, 60, 62, 63, 64, 65, 67, 69, 70, 72, 73, 74, 75, 76, 77, 78, 80, 81, 83, 86, 87, 89, 90, 91, 92, 93, 94, 95, 96, 97, 99, 101, 102, 103, 104, 105, 107, 108, 110, 112, 115, 116, 117, 118, 120, 121, 122, 124, 125, 126, 127, 129, 130, 131, 134, 135, 137, 138, 139, 143, 144, 145, 146, 148, 149, 150, 152, 153, 154, 155, ...]}

<br>
<br>

## groupping 함수

- 그룹 데이터에 적용 가능한 통계 함수(NaN은 제외하여 연산)

- **count** - 데이터 개수 

- **sum**   - 데이터의 합

- **mean, std, var** - 평균, 표준편차, 분산

- **min, max** - 최소, 최대값


```python
class_group.count()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
    </tr>
    <tr>
      <th>Pclass</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>216</td>
      <td>216</td>
      <td>216</td>
      <td>216</td>
      <td>186</td>
      <td>216</td>
      <td>216</td>
      <td>216</td>
      <td>216</td>
      <td>176</td>
      <td>214</td>
    </tr>
    <tr>
      <th>2</th>
      <td>184</td>
      <td>184</td>
      <td>184</td>
      <td>184</td>
      <td>173</td>
      <td>184</td>
      <td>184</td>
      <td>184</td>
      <td>184</td>
      <td>16</td>
      <td>184</td>
    </tr>
    <tr>
      <th>3</th>
      <td>491</td>
      <td>491</td>
      <td>491</td>
      <td>491</td>
      <td>355</td>
      <td>491</td>
      <td>491</td>
      <td>491</td>
      <td>491</td>
      <td>12</td>
      <td>491</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>


```python
class_group.mean()['Age'] # 클래스별 나이 평균 계산
```




    Pclass
    1    38.233441
    2    29.877630
    3    25.140620
    Name: Age, dtype: float64


<br>
<br>

```python
class_group.mean()['Survived'] #클래스별 생존자 평균 계산
```




    Pclass
    1    0.629630
    2    0.472826
    3    0.242363
    Name: Survived, dtype: float64

<br>
<br>


```python
# class_group.max() #에러가 난다.

# class_group.min() #에러가 난다.
```

* 성별에 따른 생존율 구해보기

<br>
<br>

```python
df.groupby('Sex').mean()['Survived']
```




    Sex
    female    0.742038
    male      0.188908
    Name: Survived, dtype: float64

<br>
<br>

## 복수 columns로 groupping 하기

 - groupby에 column 리스트를 전달

 - 통계함수를 적용한 결과는 multiindex를 갖는 dataframe

* 클래스와 성별에 따른 생존률 구해보기


```python
df.groupby(['Pclass', 'Sex']).mean()['Survived']
```




    Pclass  Sex   
    1       female    0.968085
            male      0.368852
    2       female    0.921053
            male      0.157407
    3       female    0.500000
            male      0.135447
    Name: Survived, dtype: float64




```python
df.groupby(['Pclass', 'Sex']).mean().loc[(2, 'female')]
```




    PassengerId    443.105263
    Survived         0.921053
    Age             28.722973
    SibSp            0.486842
    Parch            0.605263
    Fare            21.970121
    Name: (2, female), dtype: float64




```python
df.groupby(['Pclass', 'Sex']).mean().index
```




    MultiIndex([(1, 'female'),
                (1,   'male'),
                (2, 'female'),
                (2,   'male'),
                (3, 'female'),
                (3,   'male')],
               names=['Pclass', 'Sex'])

<br>
<br>

## index를 이용한 group by

 - index가 있는 경우, groupby 함수에 level 사용 가능

   - level은 index의 depth를 의미하며, 가장 왼쪽부터 0부터 증가

* **set_index** 함수

 - column 데이터를 index 레벨로 변경

* **reset_index** 함수

 - 인덱스 초기화


```python
df.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>0</td>
      <td>3</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>male</td>
      <td>22.0</td>
      <td>1</td>
      <td>0</td>
      <td>A/5 21171</td>
      <td>7.2500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1</td>
      <td>1</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>female</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
      <td>C85</td>
      <td>C</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>1</td>
      <td>3</td>
      <td>Heikkinen, Miss. Laina</td>
      <td>female</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>STON/O2. 3101282</td>
      <td>7.9250</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>1</td>
      <td>1</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>female</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
      <td>C123</td>
      <td>S</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>0</td>
      <td>3</td>
      <td>Allen, Mr. William Henry</td>
      <td>male</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>373450</td>
      <td>8.0500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>


```python
df.set_index(['Pclass', 'Sex']).reset_index()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Pclass</th>
      <th>Sex</th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Name</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>3</td>
      <td>male</td>
      <td>1</td>
      <td>0</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>22.0</td>
      <td>1</td>
      <td>0</td>
      <td>A/5 21171</td>
      <td>7.2500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>female</td>
      <td>2</td>
      <td>1</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
      <td>C85</td>
      <td>C</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>female</td>
      <td>3</td>
      <td>1</td>
      <td>Heikkinen, Miss. Laina</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>STON/O2. 3101282</td>
      <td>7.9250</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1</td>
      <td>female</td>
      <td>4</td>
      <td>1</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
      <td>C123</td>
      <td>S</td>
    </tr>
    <tr>
      <th>4</th>
      <td>3</td>
      <td>male</td>
      <td>5</td>
      <td>0</td>
      <td>Allen, Mr. William Henry</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>373450</td>
      <td>8.0500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>886</th>
      <td>2</td>
      <td>male</td>
      <td>887</td>
      <td>0</td>
      <td>Montvila, Rev. Juozas</td>
      <td>27.0</td>
      <td>0</td>
      <td>0</td>
      <td>211536</td>
      <td>13.0000</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>887</th>
      <td>1</td>
      <td>female</td>
      <td>888</td>
      <td>1</td>
      <td>Graham, Miss. Margaret Edith</td>
      <td>19.0</td>
      <td>0</td>
      <td>0</td>
      <td>112053</td>
      <td>30.0000</td>
      <td>B42</td>
      <td>S</td>
    </tr>
    <tr>
      <th>888</th>
      <td>3</td>
      <td>female</td>
      <td>889</td>
      <td>0</td>
      <td>Johnston, Miss. Catherine Helen "Carrie"</td>
      <td>NaN</td>
      <td>1</td>
      <td>2</td>
      <td>W./C. 6607</td>
      <td>23.4500</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>889</th>
      <td>1</td>
      <td>male</td>
      <td>890</td>
      <td>1</td>
      <td>Behr, Mr. Karl Howell</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>111369</td>
      <td>30.0000</td>
      <td>C148</td>
      <td>C</td>
    </tr>
    <tr>
      <th>890</th>
      <td>3</td>
      <td>male</td>
      <td>891</td>
      <td>0</td>
      <td>Dooley, Mr. Patrick</td>
      <td>32.0</td>
      <td>0</td>
      <td>0</td>
      <td>370376</td>
      <td>7.7500</td>
      <td>NaN</td>
      <td>Q</td>
    </tr>
  </tbody>
</table>
<p>891 rows × 12 columns</p>
</div>

<br>
<br>


```python
df.set_index('Age').groupby(level=0).mean() # level은 인덱스를 뜻함
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Fare</th>
    </tr>
    <tr>
      <th>Age</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0.42</th>
      <td>804.0</td>
      <td>1.0</td>
      <td>3.0</td>
      <td>0.0</td>
      <td>1.0</td>
      <td>8.5167</td>
    </tr>
    <tr>
      <th>0.67</th>
      <td>756.0</td>
      <td>1.0</td>
      <td>2.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>14.5000</td>
    </tr>
    <tr>
      <th>0.75</th>
      <td>557.5</td>
      <td>1.0</td>
      <td>3.0</td>
      <td>2.0</td>
      <td>1.0</td>
      <td>19.2583</td>
    </tr>
    <tr>
      <th>0.83</th>
      <td>455.5</td>
      <td>1.0</td>
      <td>2.0</td>
      <td>0.5</td>
      <td>1.5</td>
      <td>23.8750</td>
    </tr>
    <tr>
      <th>0.92</th>
      <td>306.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>2.0</td>
      <td>151.5500</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>70.00</th>
      <td>709.5</td>
      <td>0.0</td>
      <td>1.5</td>
      <td>0.5</td>
      <td>0.5</td>
      <td>40.7500</td>
    </tr>
    <tr>
      <th>70.50</th>
      <td>117.0</td>
      <td>0.0</td>
      <td>3.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>7.7500</td>
    </tr>
    <tr>
      <th>71.00</th>
      <td>295.5</td>
      <td>0.0</td>
      <td>1.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>42.0792</td>
    </tr>
    <tr>
      <th>74.00</th>
      <td>852.0</td>
      <td>0.0</td>
      <td>3.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>7.7750</td>
    </tr>
    <tr>
      <th>80.00</th>
      <td>631.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>30.0000</td>
    </tr>
  </tbody>
</table>
<p>88 rows × 6 columns</p>
</div>

<br>
<br>

## 나이대별로 생존율 구하기


```python
def age_categorize(age): #연령별 카테고리화

    if math.isnan(age):

        return -1

    return math.floor(age / 10) * 10
```


```python
df.set_index('Age').groupby(age_categorize).mean()['Survived']
```




    -1     0.293785
     0     0.612903
     10    0.401961
     20    0.350000
     30    0.437126
     40    0.382022
     50    0.416667
     60    0.315789
     70    0.000000
     80    1.000000
    Name: Survived, dtype: float64

<br>
<br>

## MultiIndex를 이용한 groupping


```python
df.set_index(['Pclass', 'Sex']).groupby(level=[0, 1]).mean()['Age'] # level은 인덱스를 뜻함
```




    Pclass  Sex   
    1       female    34.611765
            male      41.281386
    2       female    28.722973
            male      30.740707
    3       female    21.750000
            male      26.507589
    Name: Age, dtype: float64

<br>
<br>

## aggregate(집계) 함수 사용하기

 - groupby 결과에 집계함수를 적용하여 그룹별 데이터 확인 가능


```python
df.set_index(['Pclass', 'Sex']).groupby(level=[0, 1]).aggregate([np.mean, np.sum, np.max])
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead tr th {
        text-align: left;
    }

    .dataframe thead tr:last-of-type th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr>
      <th></th>
      <th></th>
      <th colspan="3" halign="left">PassengerId</th>
      <th colspan="3" halign="left">Survived</th>
      <th colspan="3" halign="left">Age</th>
      <th colspan="3" halign="left">SibSp</th>
      <th colspan="3" halign="left">Parch</th>
      <th colspan="3" halign="left">Fare</th>
    </tr>
    <tr>
      <th></th>
      <th></th>
      <th>mean</th>
      <th>sum</th>
      <th>amax</th>
      <th>mean</th>
      <th>sum</th>
      <th>amax</th>
      <th>mean</th>
      <th>sum</th>
      <th>amax</th>
      <th>mean</th>
      <th>sum</th>
      <th>amax</th>
      <th>mean</th>
      <th>sum</th>
      <th>amax</th>
      <th>mean</th>
      <th>sum</th>
      <th>amax</th>
    </tr>
    <tr>
      <th>Pclass</th>
      <th>Sex</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th rowspan="2" valign="top">1</th>
      <th>female</th>
      <td>469.212766</td>
      <td>44106</td>
      <td>888</td>
      <td>0.968085</td>
      <td>91</td>
      <td>1</td>
      <td>34.611765</td>
      <td>2942.00</td>
      <td>63.0</td>
      <td>0.553191</td>
      <td>52</td>
      <td>3</td>
      <td>0.457447</td>
      <td>43</td>
      <td>2</td>
      <td>106.125798</td>
      <td>9975.8250</td>
      <td>512.3292</td>
    </tr>
    <tr>
      <th>male</th>
      <td>455.729508</td>
      <td>55599</td>
      <td>890</td>
      <td>0.368852</td>
      <td>45</td>
      <td>1</td>
      <td>41.281386</td>
      <td>4169.42</td>
      <td>80.0</td>
      <td>0.311475</td>
      <td>38</td>
      <td>3</td>
      <td>0.278689</td>
      <td>34</td>
      <td>4</td>
      <td>67.226127</td>
      <td>8201.5875</td>
      <td>512.3292</td>
    </tr>
    <tr>
      <th rowspan="2" valign="top">2</th>
      <th>female</th>
      <td>443.105263</td>
      <td>33676</td>
      <td>881</td>
      <td>0.921053</td>
      <td>70</td>
      <td>1</td>
      <td>28.722973</td>
      <td>2125.50</td>
      <td>57.0</td>
      <td>0.486842</td>
      <td>37</td>
      <td>3</td>
      <td>0.605263</td>
      <td>46</td>
      <td>3</td>
      <td>21.970121</td>
      <td>1669.7292</td>
      <td>65.0000</td>
    </tr>
    <tr>
      <th>male</th>
      <td>447.962963</td>
      <td>48380</td>
      <td>887</td>
      <td>0.157407</td>
      <td>17</td>
      <td>1</td>
      <td>30.740707</td>
      <td>3043.33</td>
      <td>70.0</td>
      <td>0.342593</td>
      <td>37</td>
      <td>2</td>
      <td>0.222222</td>
      <td>24</td>
      <td>2</td>
      <td>19.741782</td>
      <td>2132.1125</td>
      <td>73.5000</td>
    </tr>
    <tr>
      <th rowspan="2" valign="top">3</th>
      <th>female</th>
      <td>399.729167</td>
      <td>57561</td>
      <td>889</td>
      <td>0.500000</td>
      <td>72</td>
      <td>1</td>
      <td>21.750000</td>
      <td>2218.50</td>
      <td>63.0</td>
      <td>0.895833</td>
      <td>129</td>
      <td>8</td>
      <td>0.798611</td>
      <td>115</td>
      <td>6</td>
      <td>16.118810</td>
      <td>2321.1086</td>
      <td>69.5500</td>
    </tr>
    <tr>
      <th>male</th>
      <td>455.515850</td>
      <td>158064</td>
      <td>891</td>
      <td>0.135447</td>
      <td>47</td>
      <td>1</td>
      <td>26.507589</td>
      <td>6706.42</td>
      <td>74.0</td>
      <td>0.498559</td>
      <td>173</td>
      <td>8</td>
      <td>0.224784</td>
      <td>78</td>
      <td>5</td>
      <td>12.661633</td>
      <td>4393.5865</td>
      <td>69.5500</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

## transform 함수

 - groupby 후 transform 함수를 사용하면 원래의 index를 유지한 상태로 통계함수를 적용

 - 전체 데이터의 집계가 아닌 각 그룹에서의 집계를 계산

 - 따라서 새로 생성된 데이터를 원본 dataframe과 합치기 쉬움


```python
df = pd.read_csv('E:\kaggle/titanic/train.csv')
```


```python
df.groupby('Pclass').mean()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Fare</th>
    </tr>
    <tr>
      <th>Pclass</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>461.597222</td>
      <td>0.629630</td>
      <td>38.233441</td>
      <td>0.416667</td>
      <td>0.356481</td>
      <td>84.154687</td>
    </tr>
    <tr>
      <th>2</th>
      <td>445.956522</td>
      <td>0.472826</td>
      <td>29.877630</td>
      <td>0.402174</td>
      <td>0.380435</td>
      <td>20.662183</td>
    </tr>
    <tr>
      <th>3</th>
      <td>439.154786</td>
      <td>0.242363</td>
      <td>25.140620</td>
      <td>0.615071</td>
      <td>0.393075</td>
      <td>13.675550</td>
    </tr>
  </tbody>
</table>
</div>




```python
df.groupby('Pclass').transform(np.mean)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Fare</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>439.154786</td>
      <td>0.242363</td>
      <td>25.140620</td>
      <td>0.615071</td>
      <td>0.393075</td>
      <td>13.675550</td>
    </tr>
    <tr>
      <th>1</th>
      <td>461.597222</td>
      <td>0.629630</td>
      <td>38.233441</td>
      <td>0.416667</td>
      <td>0.356481</td>
      <td>84.154687</td>
    </tr>
    <tr>
      <th>2</th>
      <td>439.154786</td>
      <td>0.242363</td>
      <td>25.140620</td>
      <td>0.615071</td>
      <td>0.393075</td>
      <td>13.675550</td>
    </tr>
    <tr>
      <th>3</th>
      <td>461.597222</td>
      <td>0.629630</td>
      <td>38.233441</td>
      <td>0.416667</td>
      <td>0.356481</td>
      <td>84.154687</td>
    </tr>
    <tr>
      <th>4</th>
      <td>439.154786</td>
      <td>0.242363</td>
      <td>25.140620</td>
      <td>0.615071</td>
      <td>0.393075</td>
      <td>13.675550</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>886</th>
      <td>445.956522</td>
      <td>0.472826</td>
      <td>29.877630</td>
      <td>0.402174</td>
      <td>0.380435</td>
      <td>20.662183</td>
    </tr>
    <tr>
      <th>887</th>
      <td>461.597222</td>
      <td>0.629630</td>
      <td>38.233441</td>
      <td>0.416667</td>
      <td>0.356481</td>
      <td>84.154687</td>
    </tr>
    <tr>
      <th>888</th>
      <td>439.154786</td>
      <td>0.242363</td>
      <td>25.140620</td>
      <td>0.615071</td>
      <td>0.393075</td>
      <td>13.675550</td>
    </tr>
    <tr>
      <th>889</th>
      <td>461.597222</td>
      <td>0.629630</td>
      <td>38.233441</td>
      <td>0.416667</td>
      <td>0.356481</td>
      <td>84.154687</td>
    </tr>
    <tr>
      <th>890</th>
      <td>439.154786</td>
      <td>0.242363</td>
      <td>25.140620</td>
      <td>0.615071</td>
      <td>0.393075</td>
      <td>13.675550</td>
    </tr>
  </tbody>
</table>
<p>891 rows × 6 columns</p>
</div>




```python
df['Age2'] = df.groupby('Pclass').transform(np.mean)['Age']

df
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
      <th>Age2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>0</td>
      <td>3</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>male</td>
      <td>22.0</td>
      <td>1</td>
      <td>0</td>
      <td>A/5 21171</td>
      <td>7.2500</td>
      <td>NaN</td>
      <td>S</td>
      <td>25.140620</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1</td>
      <td>1</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>female</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
      <td>C85</td>
      <td>C</td>
      <td>38.233441</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>1</td>
      <td>3</td>
      <td>Heikkinen, Miss. Laina</td>
      <td>female</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>STON/O2. 3101282</td>
      <td>7.9250</td>
      <td>NaN</td>
      <td>S</td>
      <td>25.140620</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>1</td>
      <td>1</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>female</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
      <td>C123</td>
      <td>S</td>
      <td>38.233441</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>0</td>
      <td>3</td>
      <td>Allen, Mr. William Henry</td>
      <td>male</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>373450</td>
      <td>8.0500</td>
      <td>NaN</td>
      <td>S</td>
      <td>25.140620</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>886</th>
      <td>887</td>
      <td>0</td>
      <td>2</td>
      <td>Montvila, Rev. Juozas</td>
      <td>male</td>
      <td>27.0</td>
      <td>0</td>
      <td>0</td>
      <td>211536</td>
      <td>13.0000</td>
      <td>NaN</td>
      <td>S</td>
      <td>29.877630</td>
    </tr>
    <tr>
      <th>887</th>
      <td>888</td>
      <td>1</td>
      <td>1</td>
      <td>Graham, Miss. Margaret Edith</td>
      <td>female</td>
      <td>19.0</td>
      <td>0</td>
      <td>0</td>
      <td>112053</td>
      <td>30.0000</td>
      <td>B42</td>
      <td>S</td>
      <td>38.233441</td>
    </tr>
    <tr>
      <th>888</th>
      <td>889</td>
      <td>0</td>
      <td>3</td>
      <td>Johnston, Miss. Catherine Helen "Carrie"</td>
      <td>female</td>
      <td>NaN</td>
      <td>1</td>
      <td>2</td>
      <td>W./C. 6607</td>
      <td>23.4500</td>
      <td>NaN</td>
      <td>S</td>
      <td>25.140620</td>
    </tr>
    <tr>
      <th>889</th>
      <td>890</td>
      <td>1</td>
      <td>1</td>
      <td>Behr, Mr. Karl Howell</td>
      <td>male</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>111369</td>
      <td>30.0000</td>
      <td>C148</td>
      <td>C</td>
      <td>38.233441</td>
    </tr>
    <tr>
      <th>890</th>
      <td>891</td>
      <td>0</td>
      <td>3</td>
      <td>Dooley, Mr. Patrick</td>
      <td>male</td>
      <td>32.0</td>
      <td>0</td>
      <td>0</td>
      <td>370376</td>
      <td>7.7500</td>
      <td>NaN</td>
      <td>Q</td>
      <td>25.140620</td>
    </tr>
  </tbody>
</table>
<p>891 rows × 13 columns</p>
</div>

<br>
<br>


```python
df.groupby(['Pclass', 'Sex']).mean()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Fare</th>
      <th>Age2</th>
    </tr>
    <tr>
      <th>Pclass</th>
      <th>Sex</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th rowspan="2" valign="top">1</th>
      <th>female</th>
      <td>469.212766</td>
      <td>0.968085</td>
      <td>34.611765</td>
      <td>0.553191</td>
      <td>0.457447</td>
      <td>106.125798</td>
      <td>38.233441</td>
    </tr>
    <tr>
      <th>male</th>
      <td>455.729508</td>
      <td>0.368852</td>
      <td>41.281386</td>
      <td>0.311475</td>
      <td>0.278689</td>
      <td>67.226127</td>
      <td>38.233441</td>
    </tr>
    <tr>
      <th rowspan="2" valign="top">2</th>
      <th>female</th>
      <td>443.105263</td>
      <td>0.921053</td>
      <td>28.722973</td>
      <td>0.486842</td>
      <td>0.605263</td>
      <td>21.970121</td>
      <td>29.877630</td>
    </tr>
    <tr>
      <th>male</th>
      <td>447.962963</td>
      <td>0.157407</td>
      <td>30.740707</td>
      <td>0.342593</td>
      <td>0.222222</td>
      <td>19.741782</td>
      <td>29.877630</td>
    </tr>
    <tr>
      <th rowspan="2" valign="top">3</th>
      <th>female</th>
      <td>399.729167</td>
      <td>0.500000</td>
      <td>21.750000</td>
      <td>0.895833</td>
      <td>0.798611</td>
      <td>16.118810</td>
      <td>25.140620</td>
    </tr>
    <tr>
      <th>male</th>
      <td>455.515850</td>
      <td>0.135447</td>
      <td>26.507589</td>
      <td>0.498559</td>
      <td>0.224784</td>
      <td>12.661633</td>
      <td>25.140620</td>
    </tr>
  </tbody>
</table>
</div>


<br>
<br>

```python
df['Age3'] = df.groupby(['Pclass', 'Sex']).transform(np.mean)['Age']

df
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
      <th>Age2</th>
      <th>Age3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>0</td>
      <td>3</td>
      <td>Braund, Mr. Owen Harris</td>
      <td>male</td>
      <td>22.0</td>
      <td>1</td>
      <td>0</td>
      <td>A/5 21171</td>
      <td>7.2500</td>
      <td>NaN</td>
      <td>S</td>
      <td>25.140620</td>
      <td>26.507589</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1</td>
      <td>1</td>
      <td>Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td>female</td>
      <td>38.0</td>
      <td>1</td>
      <td>0</td>
      <td>PC 17599</td>
      <td>71.2833</td>
      <td>C85</td>
      <td>C</td>
      <td>38.233441</td>
      <td>34.611765</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>1</td>
      <td>3</td>
      <td>Heikkinen, Miss. Laina</td>
      <td>female</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>STON/O2. 3101282</td>
      <td>7.9250</td>
      <td>NaN</td>
      <td>S</td>
      <td>25.140620</td>
      <td>21.750000</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>1</td>
      <td>1</td>
      <td>Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td>female</td>
      <td>35.0</td>
      <td>1</td>
      <td>0</td>
      <td>113803</td>
      <td>53.1000</td>
      <td>C123</td>
      <td>S</td>
      <td>38.233441</td>
      <td>34.611765</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>0</td>
      <td>3</td>
      <td>Allen, Mr. William Henry</td>
      <td>male</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>373450</td>
      <td>8.0500</td>
      <td>NaN</td>
      <td>S</td>
      <td>25.140620</td>
      <td>26.507589</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>886</th>
      <td>887</td>
      <td>0</td>
      <td>2</td>
      <td>Montvila, Rev. Juozas</td>
      <td>male</td>
      <td>27.0</td>
      <td>0</td>
      <td>0</td>
      <td>211536</td>
      <td>13.0000</td>
      <td>NaN</td>
      <td>S</td>
      <td>29.877630</td>
      <td>30.740707</td>
    </tr>
    <tr>
      <th>887</th>
      <td>888</td>
      <td>1</td>
      <td>1</td>
      <td>Graham, Miss. Margaret Edith</td>
      <td>female</td>
      <td>19.0</td>
      <td>0</td>
      <td>0</td>
      <td>112053</td>
      <td>30.0000</td>
      <td>B42</td>
      <td>S</td>
      <td>38.233441</td>
      <td>34.611765</td>
    </tr>
    <tr>
      <th>888</th>
      <td>889</td>
      <td>0</td>
      <td>3</td>
      <td>Johnston, Miss. Catherine Helen "Carrie"</td>
      <td>female</td>
      <td>NaN</td>
      <td>1</td>
      <td>2</td>
      <td>W./C. 6607</td>
      <td>23.4500</td>
      <td>NaN</td>
      <td>S</td>
      <td>25.140620</td>
      <td>21.750000</td>
    </tr>
    <tr>
      <th>889</th>
      <td>890</td>
      <td>1</td>
      <td>1</td>
      <td>Behr, Mr. Karl Howell</td>
      <td>male</td>
      <td>26.0</td>
      <td>0</td>
      <td>0</td>
      <td>111369</td>
      <td>30.0000</td>
      <td>C148</td>
      <td>C</td>
      <td>38.233441</td>
      <td>41.281386</td>
    </tr>
    <tr>
      <th>890</th>
      <td>891</td>
      <td>0</td>
      <td>3</td>
      <td>Dooley, Mr. Patrick</td>
      <td>male</td>
      <td>32.0</td>
      <td>0</td>
      <td>0</td>
      <td>370376</td>
      <td>7.7500</td>
      <td>NaN</td>
      <td>Q</td>
      <td>25.140620</td>
      <td>26.507589</td>
    </tr>
  </tbody>
</table>
<p>891 rows × 14 columns</p>
</div>



 1. pivot, pivot_table 함수의 이해


```python
df = pd.DataFrame({

    '지역': ['서울', '서울', '서울', '경기', '경기', '부산', '서울', '서울', '부산', '경기', '경기', '경기'],

    '요일': ['월요일', '화요일', '수요일', '월요일', '화요일', '월요일', '목요일', '금요일', '화요일', '수요일', '목요일', '금요일'],

    '강수량': [100, 80, 1000, 200, 200, 100, 50, 100, 200, 100, 50, 100],

    '강수확률': [80, 70, 90, 10, 20, 30, 50, 90, 20, 80, 50, 10]

                  })



df
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>지역</th>
      <th>요일</th>
      <th>강수량</th>
      <th>강수확률</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>서울</td>
      <td>월요일</td>
      <td>100</td>
      <td>80</td>
    </tr>
    <tr>
      <th>1</th>
      <td>서울</td>
      <td>화요일</td>
      <td>80</td>
      <td>70</td>
    </tr>
    <tr>
      <th>2</th>
      <td>서울</td>
      <td>수요일</td>
      <td>1000</td>
      <td>90</td>
    </tr>
    <tr>
      <th>3</th>
      <td>경기</td>
      <td>월요일</td>
      <td>200</td>
      <td>10</td>
    </tr>
    <tr>
      <th>4</th>
      <td>경기</td>
      <td>화요일</td>
      <td>200</td>
      <td>20</td>
    </tr>
    <tr>
      <th>5</th>
      <td>부산</td>
      <td>월요일</td>
      <td>100</td>
      <td>30</td>
    </tr>
    <tr>
      <th>6</th>
      <td>서울</td>
      <td>목요일</td>
      <td>50</td>
      <td>50</td>
    </tr>
    <tr>
      <th>7</th>
      <td>서울</td>
      <td>금요일</td>
      <td>100</td>
      <td>90</td>
    </tr>
    <tr>
      <th>8</th>
      <td>부산</td>
      <td>화요일</td>
      <td>200</td>
      <td>20</td>
    </tr>
    <tr>
      <th>9</th>
      <td>경기</td>
      <td>수요일</td>
      <td>100</td>
      <td>80</td>
    </tr>
    <tr>
      <th>10</th>
      <td>경기</td>
      <td>목요일</td>
      <td>50</td>
      <td>50</td>
    </tr>
    <tr>
      <th>11</th>
      <td>경기</td>
      <td>금요일</td>
      <td>100</td>
      <td>10</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

### pivot 

 - dataframe의 형태를 변경

 - 인덱스, 컬럼, 데이터로 사용할 컬럼을 명시


```python
# 피벗은 보기 좋게



df.pivot('지역', '요일') # 지역이 index, 요일이 columns

#에러
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead tr th {
        text-align: left;
    }

    .dataframe thead tr:last-of-type th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr>
      <th></th>
      <th colspan="5" halign="left">강수량</th>
      <th colspan="5" halign="left">강수확률</th>
    </tr>
    <tr>
      <th>요일</th>
      <th>금요일</th>
      <th>목요일</th>
      <th>수요일</th>
      <th>월요일</th>
      <th>화요일</th>
      <th>금요일</th>
      <th>목요일</th>
      <th>수요일</th>
      <th>월요일</th>
      <th>화요일</th>
    </tr>
    <tr>
      <th>지역</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>경기</th>
      <td>100.0</td>
      <td>50.0</td>
      <td>100.0</td>
      <td>200.0</td>
      <td>200.0</td>
      <td>10.0</td>
      <td>50.0</td>
      <td>80.0</td>
      <td>10.0</td>
      <td>20.0</td>
    </tr>
    <tr>
      <th>부산</th>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>100.0</td>
      <td>200.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>30.0</td>
      <td>20.0</td>
    </tr>
    <tr>
      <th>서울</th>
      <td>100.0</td>
      <td>50.0</td>
      <td>1000.0</td>
      <td>100.0</td>
      <td>80.0</td>
      <td>90.0</td>
      <td>50.0</td>
      <td>90.0</td>
      <td>80.0</td>
      <td>70.0</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>


```python
df.pivot('요일', '지역')
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead tr th {
        text-align: left;
    }

    .dataframe thead tr:last-of-type th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr>
      <th></th>
      <th colspan="3" halign="left">강수량</th>
      <th colspan="3" halign="left">강수확률</th>
    </tr>
    <tr>
      <th>지역</th>
      <th>경기</th>
      <th>부산</th>
      <th>서울</th>
      <th>경기</th>
      <th>부산</th>
      <th>서울</th>
    </tr>
    <tr>
      <th>요일</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>금요일</th>
      <td>100.0</td>
      <td>NaN</td>
      <td>100.0</td>
      <td>10.0</td>
      <td>NaN</td>
      <td>90.0</td>
    </tr>
    <tr>
      <th>목요일</th>
      <td>50.0</td>
      <td>NaN</td>
      <td>50.0</td>
      <td>50.0</td>
      <td>NaN</td>
      <td>50.0</td>
    </tr>
    <tr>
      <th>수요일</th>
      <td>100.0</td>
      <td>NaN</td>
      <td>1000.0</td>
      <td>80.0</td>
      <td>NaN</td>
      <td>90.0</td>
    </tr>
    <tr>
      <th>월요일</th>
      <td>200.0</td>
      <td>100.0</td>
      <td>100.0</td>
      <td>10.0</td>
      <td>30.0</td>
      <td>80.0</td>
    </tr>
    <tr>
      <th>화요일</th>
      <td>200.0</td>
      <td>200.0</td>
      <td>80.0</td>
      <td>20.0</td>
      <td>20.0</td>
      <td>70.0</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

### pivot_table

 - 기능적으로 pivot과 동일

 - pivot과의 차이점

   - 중복되는 모호한 값이 있을 경우, aggregation 함수 사용하여 값을 채움


```python
pd.pivot_table(df,index='요일', columns='지역', aggfunc=np.mean)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead tr th {
        text-align: left;
    }

    .dataframe thead tr:last-of-type th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr>
      <th></th>
      <th colspan="3" halign="left">강수량</th>
      <th colspan="3" halign="left">강수확률</th>
    </tr>
    <tr>
      <th>지역</th>
      <th>경기</th>
      <th>부산</th>
      <th>서울</th>
      <th>경기</th>
      <th>부산</th>
      <th>서울</th>
    </tr>
    <tr>
      <th>요일</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>금요일</th>
      <td>100.0</td>
      <td>NaN</td>
      <td>100.0</td>
      <td>10.0</td>
      <td>NaN</td>
      <td>90.0</td>
    </tr>
    <tr>
      <th>목요일</th>
      <td>50.0</td>
      <td>NaN</td>
      <td>50.0</td>
      <td>50.0</td>
      <td>NaN</td>
      <td>50.0</td>
    </tr>
    <tr>
      <th>수요일</th>
      <td>100.0</td>
      <td>NaN</td>
      <td>1000.0</td>
      <td>80.0</td>
      <td>NaN</td>
      <td>90.0</td>
    </tr>
    <tr>
      <th>월요일</th>
      <td>200.0</td>
      <td>100.0</td>
      <td>100.0</td>
      <td>10.0</td>
      <td>30.0</td>
      <td>80.0</td>
    </tr>
    <tr>
      <th>화요일</th>
      <td>200.0</td>
      <td>200.0</td>
      <td>80.0</td>
      <td>20.0</td>
      <td>20.0</td>
      <td>70.0</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

###  stack & unstack

 - stack : 컬럼 레벨에서 인덱스 레벨로 dataframe 변경

  - 즉, 데이터를 쌓아올리는 개념으로 이해하면 쉬움

 - unstack : 인덱스 레벨에서 컬럼 레벨로 dataframe 변경

  - stack의 반대 operation

 

 - 둘은 역의 관계에 있음


```python
new_df = df.set_index(['지역', '요일'])

new_df
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th></th>
      <th>강수량</th>
      <th>강수확률</th>
    </tr>
    <tr>
      <th>지역</th>
      <th>요일</th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th rowspan="3" valign="top">서울</th>
      <th>월요일</th>
      <td>100</td>
      <td>80</td>
    </tr>
    <tr>
      <th>화요일</th>
      <td>80</td>
      <td>70</td>
    </tr>
    <tr>
      <th>수요일</th>
      <td>1000</td>
      <td>90</td>
    </tr>
    <tr>
      <th rowspan="2" valign="top">경기</th>
      <th>월요일</th>
      <td>200</td>
      <td>10</td>
    </tr>
    <tr>
      <th>화요일</th>
      <td>200</td>
      <td>20</td>
    </tr>
    <tr>
      <th>부산</th>
      <th>월요일</th>
      <td>100</td>
      <td>30</td>
    </tr>
    <tr>
      <th rowspan="2" valign="top">서울</th>
      <th>목요일</th>
      <td>50</td>
      <td>50</td>
    </tr>
    <tr>
      <th>금요일</th>
      <td>100</td>
      <td>90</td>
    </tr>
    <tr>
      <th>부산</th>
      <th>화요일</th>
      <td>200</td>
      <td>20</td>
    </tr>
    <tr>
      <th rowspan="3" valign="top">경기</th>
      <th>수요일</th>
      <td>100</td>
      <td>80</td>
    </tr>
    <tr>
      <th>목요일</th>
      <td>50</td>
      <td>50</td>
    </tr>
    <tr>
      <th>금요일</th>
      <td>100</td>
      <td>10</td>
    </tr>
  </tbody>
</table>
</div>




```python
new_df.unstack(0) # 0이면 지역 인덱스를 컬럼레벨로 올려라
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead tr th {
        text-align: left;
    }

    .dataframe thead tr:last-of-type th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr>
      <th></th>
      <th colspan="3" halign="left">강수량</th>
      <th colspan="3" halign="left">강수확률</th>
    </tr>
    <tr>
      <th>지역</th>
      <th>경기</th>
      <th>부산</th>
      <th>서울</th>
      <th>경기</th>
      <th>부산</th>
      <th>서울</th>
    </tr>
    <tr>
      <th>요일</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>금요일</th>
      <td>100.0</td>
      <td>NaN</td>
      <td>100.0</td>
      <td>10.0</td>
      <td>NaN</td>
      <td>90.0</td>
    </tr>
    <tr>
      <th>목요일</th>
      <td>50.0</td>
      <td>NaN</td>
      <td>50.0</td>
      <td>50.0</td>
      <td>NaN</td>
      <td>50.0</td>
    </tr>
    <tr>
      <th>수요일</th>
      <td>100.0</td>
      <td>NaN</td>
      <td>1000.0</td>
      <td>80.0</td>
      <td>NaN</td>
      <td>90.0</td>
    </tr>
    <tr>
      <th>월요일</th>
      <td>200.0</td>
      <td>100.0</td>
      <td>100.0</td>
      <td>10.0</td>
      <td>30.0</td>
      <td>80.0</td>
    </tr>
    <tr>
      <th>화요일</th>
      <td>200.0</td>
      <td>200.0</td>
      <td>80.0</td>
      <td>20.0</td>
      <td>20.0</td>
      <td>70.0</td>
    </tr>
  </tbody>
</table>
</div>




```python
new_df.unstack(1) # 1이면 요일 인덱스를 컬럼레벨로 올려라
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead tr th {
        text-align: left;
    }

    .dataframe thead tr:last-of-type th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr>
      <th></th>
      <th colspan="5" halign="left">강수량</th>
      <th colspan="5" halign="left">강수확률</th>
    </tr>
    <tr>
      <th>요일</th>
      <th>금요일</th>
      <th>목요일</th>
      <th>수요일</th>
      <th>월요일</th>
      <th>화요일</th>
      <th>금요일</th>
      <th>목요일</th>
      <th>수요일</th>
      <th>월요일</th>
      <th>화요일</th>
    </tr>
    <tr>
      <th>지역</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>경기</th>
      <td>100.0</td>
      <td>50.0</td>
      <td>100.0</td>
      <td>200.0</td>
      <td>200.0</td>
      <td>10.0</td>
      <td>50.0</td>
      <td>80.0</td>
      <td>10.0</td>
      <td>20.0</td>
    </tr>
    <tr>
      <th>부산</th>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>100.0</td>
      <td>200.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>30.0</td>
      <td>20.0</td>
    </tr>
    <tr>
      <th>서울</th>
      <td>100.0</td>
      <td>50.0</td>
      <td>1000.0</td>
      <td>100.0</td>
      <td>80.0</td>
      <td>90.0</td>
      <td>50.0</td>
      <td>90.0</td>
      <td>80.0</td>
      <td>70.0</td>
    </tr>
  </tbody>
</table>
</div>


<br>
<br>

```python
new_df.unstack(0).stack(0)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>지역</th>
      <th>경기</th>
      <th>부산</th>
      <th>서울</th>
    </tr>
    <tr>
      <th>요일</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th rowspan="2" valign="top">금요일</th>
      <th>강수량</th>
      <td>100.0</td>
      <td>NaN</td>
      <td>100.0</td>
    </tr>
    <tr>
      <th>강수확률</th>
      <td>10.0</td>
      <td>NaN</td>
      <td>90.0</td>
    </tr>
    <tr>
      <th rowspan="2" valign="top">목요일</th>
      <th>강수량</th>
      <td>50.0</td>
      <td>NaN</td>
      <td>50.0</td>
    </tr>
    <tr>
      <th>강수확률</th>
      <td>50.0</td>
      <td>NaN</td>
      <td>50.0</td>
    </tr>
    <tr>
      <th rowspan="2" valign="top">수요일</th>
      <th>강수량</th>
      <td>100.0</td>
      <td>NaN</td>
      <td>1000.0</td>
    </tr>
    <tr>
      <th>강수확률</th>
      <td>80.0</td>
      <td>NaN</td>
      <td>90.0</td>
    </tr>
    <tr>
      <th rowspan="2" valign="top">월요일</th>
      <th>강수량</th>
      <td>200.0</td>
      <td>100.0</td>
      <td>100.0</td>
    </tr>
    <tr>
      <th>강수확률</th>
      <td>10.0</td>
      <td>30.0</td>
      <td>80.0</td>
    </tr>
    <tr>
      <th rowspan="2" valign="top">화요일</th>
      <th>강수량</th>
      <td>200.0</td>
      <td>200.0</td>
      <td>80.0</td>
    </tr>
    <tr>
      <th>강수확률</th>
      <td>20.0</td>
      <td>20.0</td>
      <td>70.0</td>
    </tr>
  </tbody>
</table>
</div>




```python
new_df.unstack(0).stack(1) #-1은 마지막
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th></th>
      <th>강수량</th>
      <th>강수확률</th>
    </tr>
    <tr>
      <th>요일</th>
      <th>지역</th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th rowspan="2" valign="top">금요일</th>
      <th>경기</th>
      <td>100.0</td>
      <td>10.0</td>
    </tr>
    <tr>
      <th>서울</th>
      <td>100.0</td>
      <td>90.0</td>
    </tr>
    <tr>
      <th rowspan="2" valign="top">목요일</th>
      <th>경기</th>
      <td>50.0</td>
      <td>50.0</td>
    </tr>
    <tr>
      <th>서울</th>
      <td>50.0</td>
      <td>50.0</td>
    </tr>
    <tr>
      <th rowspan="2" valign="top">수요일</th>
      <th>경기</th>
      <td>100.0</td>
      <td>80.0</td>
    </tr>
    <tr>
      <th>서울</th>
      <td>1000.0</td>
      <td>90.0</td>
    </tr>
    <tr>
      <th rowspan="3" valign="top">월요일</th>
      <th>경기</th>
      <td>200.0</td>
      <td>10.0</td>
    </tr>
    <tr>
      <th>부산</th>
      <td>100.0</td>
      <td>30.0</td>
    </tr>
    <tr>
      <th>서울</th>
      <td>100.0</td>
      <td>80.0</td>
    </tr>
    <tr>
      <th rowspan="3" valign="top">화요일</th>
      <th>경기</th>
      <td>200.0</td>
      <td>20.0</td>
    </tr>
    <tr>
      <th>부산</th>
      <td>200.0</td>
      <td>20.0</td>
    </tr>
    <tr>
      <th>서울</th>
      <td>80.0</td>
      <td>70.0</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

### concat 함수 사용하여 dataframe 병합하기

 - pandas.concat 함수

 - 축을 따라 dataframe을 병합 가능

   - 기본 axis = 0 -> 행단위 병합

* column명이 같은 경우


```python
# concat은 단순하게 합침
```


```python
df1 = pd.DataFrame({'key1' : np.arange(10), 'value1' : np.random.randn(10)})
```


```python
df2 = pd.DataFrame({'key1' : np.arange(10), 'value1' : np.random.randn(10)})
```


```python
pd.concat([df1, df2], ignore_index=True) # index는 유지. 하지만 ignore_index쓰면 바뀜


```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>key1</th>
      <th>value1</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0</td>
      <td>-0.112312</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>0.611798</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2</td>
      <td>0.189342</td>
    </tr>
    <tr>
      <th>3</th>
      <td>3</td>
      <td>-1.027669</td>
    </tr>
    <tr>
      <th>4</th>
      <td>4</td>
      <td>-1.069512</td>
    </tr>
    <tr>
      <th>5</th>
      <td>5</td>
      <td>-1.680114</td>
    </tr>
    <tr>
      <th>6</th>
      <td>6</td>
      <td>-1.338902</td>
    </tr>
    <tr>
      <th>7</th>
      <td>7</td>
      <td>0.449318</td>
    </tr>
    <tr>
      <th>8</th>
      <td>8</td>
      <td>0.273951</td>
    </tr>
    <tr>
      <th>9</th>
      <td>9</td>
      <td>1.077814</td>
    </tr>
    <tr>
      <th>10</th>
      <td>0</td>
      <td>0.281915</td>
    </tr>
    <tr>
      <th>11</th>
      <td>1</td>
      <td>0.320075</td>
    </tr>
    <tr>
      <th>12</th>
      <td>2</td>
      <td>-0.296429</td>
    </tr>
    <tr>
      <th>13</th>
      <td>3</td>
      <td>-1.420309</td>
    </tr>
    <tr>
      <th>14</th>
      <td>4</td>
      <td>-0.847101</td>
    </tr>
    <tr>
      <th>15</th>
      <td>5</td>
      <td>-0.518147</td>
    </tr>
    <tr>
      <th>16</th>
      <td>6</td>
      <td>-0.082555</td>
    </tr>
    <tr>
      <th>17</th>
      <td>7</td>
      <td>-0.254324</td>
    </tr>
    <tr>
      <th>18</th>
      <td>8</td>
      <td>-0.977181</td>
    </tr>
    <tr>
      <th>19</th>
      <td>9</td>
      <td>0.265628</td>
    </tr>
  </tbody>
</table>
</div>




```python
pd.concat([df1, df2], axis=1)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>key1</th>
      <th>value1</th>
      <th>key1</th>
      <th>value1</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0</td>
      <td>-0.112312</td>
      <td>0</td>
      <td>0.281915</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>0.611798</td>
      <td>1</td>
      <td>0.320075</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2</td>
      <td>0.189342</td>
      <td>2</td>
      <td>-0.296429</td>
    </tr>
    <tr>
      <th>3</th>
      <td>3</td>
      <td>-1.027669</td>
      <td>3</td>
      <td>-1.420309</td>
    </tr>
    <tr>
      <th>4</th>
      <td>4</td>
      <td>-1.069512</td>
      <td>4</td>
      <td>-0.847101</td>
    </tr>
    <tr>
      <th>5</th>
      <td>5</td>
      <td>-1.680114</td>
      <td>5</td>
      <td>-0.518147</td>
    </tr>
    <tr>
      <th>6</th>
      <td>6</td>
      <td>-1.338902</td>
      <td>6</td>
      <td>-0.082555</td>
    </tr>
    <tr>
      <th>7</th>
      <td>7</td>
      <td>0.449318</td>
      <td>7</td>
      <td>-0.254324</td>
    </tr>
    <tr>
      <th>8</th>
      <td>8</td>
      <td>0.273951</td>
      <td>8</td>
      <td>-0.977181</td>
    </tr>
    <tr>
      <th>9</th>
      <td>9</td>
      <td>1.077814</td>
      <td>9</td>
      <td>0.265628</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

### column 명이 다른 경우 


```python
df3 = pd.DataFrame({'key2' : np.arange(10), 'value2' : np.random.randn(10)})
```


```python
pd.concat([df1, df3], axis=1)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>key1</th>
      <th>value1</th>
      <th>key2</th>
      <th>value2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0</td>
      <td>-0.112312</td>
      <td>0</td>
      <td>-1.300134</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>0.611798</td>
      <td>1</td>
      <td>0.530596</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2</td>
      <td>0.189342</td>
      <td>2</td>
      <td>0.032435</td>
    </tr>
    <tr>
      <th>3</th>
      <td>3</td>
      <td>-1.027669</td>
      <td>3</td>
      <td>0.269433</td>
    </tr>
    <tr>
      <th>4</th>
      <td>4</td>
      <td>-1.069512</td>
      <td>4</td>
      <td>-0.216506</td>
    </tr>
    <tr>
      <th>5</th>
      <td>5</td>
      <td>-1.680114</td>
      <td>5</td>
      <td>0.110930</td>
    </tr>
    <tr>
      <th>6</th>
      <td>6</td>
      <td>-1.338902</td>
      <td>6</td>
      <td>-0.371537</td>
    </tr>
    <tr>
      <th>7</th>
      <td>7</td>
      <td>0.449318</td>
      <td>7</td>
      <td>0.522430</td>
    </tr>
    <tr>
      <th>8</th>
      <td>8</td>
      <td>0.273951</td>
      <td>8</td>
      <td>-2.454415</td>
    </tr>
    <tr>
      <th>9</th>
      <td>9</td>
      <td>1.077814</td>
      <td>9</td>
      <td>-0.803864</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

### dataframe merge

 - SQL의 join처럼 특정한 column을 기준으로 병합

   - join 방식: how 파라미터를 통해 명시

     - inner: 기본값, 일치하는 값이 있는 경우 

     - left: left outer join

     - right: right outer join

     - outer: full outer join

     

 - pandas.merge 함수가 사용됨


```python
customer = pd.DataFrame({'customer_id' : np.arange(6), 

                    'name' : ['철수'"", '영희', '길동', '영수', '수민', '동건'], 

                    '나이' : [40, 20, 21, 30, 31, 18]})



customer
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>customer_id</th>
      <th>name</th>
      <th>나이</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0</td>
      <td>철수</td>
      <td>40</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>영희</td>
      <td>20</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2</td>
      <td>길동</td>
      <td>21</td>
    </tr>
    <tr>
      <th>3</th>
      <td>3</td>
      <td>영수</td>
      <td>30</td>
    </tr>
    <tr>
      <th>4</th>
      <td>4</td>
      <td>수민</td>
      <td>31</td>
    </tr>
    <tr>
      <th>5</th>
      <td>5</td>
      <td>동건</td>
      <td>18</td>
    </tr>
  </tbody>
</table>
</div>




```python
orders = pd.DataFrame({'customer_id' : [1, 1, 2, 2, 2, 3, 3, 1, 4, 9], 

                    'item' : ['치약', '칫솔', '이어폰', '헤드셋', '수건', '생수', '수건', '치약', '생수', '케이스'], 

                    'quantity' : [1, 2, 1, 1, 3, 2, 2, 3, 2, 1]})

orders.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>customer_id</th>
      <th>item</th>
      <th>quantity</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>치약</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>칫솔</td>
      <td>2</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2</td>
      <td>이어폰</td>
      <td>1</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2</td>
      <td>헤드셋</td>
      <td>1</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2</td>
      <td>수건</td>
      <td>3</td>
    </tr>
  </tbody>
</table>
</div>

<br>
<br>

### on 

 - join 대상이 되는 column 명시


```python
pd.merge(customer, orders, on='customer_id', how='inner') # customer_id를 기준으로

# 일치하는 것만 가져옴

# on은 머지를 하게 될 대상, 컬럼을 명시

# how은 어떤 식으로 머지를 할 것인지
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>customer_id</th>
      <th>name</th>
      <th>나이</th>
      <th>item</th>
      <th>quantity</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>영희</td>
      <td>20</td>
      <td>치약</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>영희</td>
      <td>20</td>
      <td>칫솔</td>
      <td>2</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1</td>
      <td>영희</td>
      <td>20</td>
      <td>치약</td>
      <td>3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2</td>
      <td>길동</td>
      <td>21</td>
      <td>이어폰</td>
      <td>1</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2</td>
      <td>길동</td>
      <td>21</td>
      <td>헤드셋</td>
      <td>1</td>
    </tr>
    <tr>
      <th>5</th>
      <td>2</td>
      <td>길동</td>
      <td>21</td>
      <td>수건</td>
      <td>3</td>
    </tr>
    <tr>
      <th>6</th>
      <td>3</td>
      <td>영수</td>
      <td>30</td>
      <td>생수</td>
      <td>2</td>
    </tr>
    <tr>
      <th>7</th>
      <td>3</td>
      <td>영수</td>
      <td>30</td>
      <td>수건</td>
      <td>2</td>
    </tr>
    <tr>
      <th>8</th>
      <td>4</td>
      <td>수민</td>
      <td>31</td>
      <td>생수</td>
      <td>2</td>
    </tr>
  </tbody>
</table>
</div>


<br>
<br>

```python
pd.merge(customer, orders, on='customer_id', how='left')
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>customer_id</th>
      <th>name</th>
      <th>나이</th>
      <th>item</th>
      <th>quantity</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0</td>
      <td>철수</td>
      <td>40</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>영희</td>
      <td>20</td>
      <td>치약</td>
      <td>1.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1</td>
      <td>영희</td>
      <td>20</td>
      <td>칫솔</td>
      <td>2.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1</td>
      <td>영희</td>
      <td>20</td>
      <td>치약</td>
      <td>3.0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2</td>
      <td>길동</td>
      <td>21</td>
      <td>이어폰</td>
      <td>1.0</td>
    </tr>
    <tr>
      <th>5</th>
      <td>2</td>
      <td>길동</td>
      <td>21</td>
      <td>헤드셋</td>
      <td>1.0</td>
    </tr>
    <tr>
      <th>6</th>
      <td>2</td>
      <td>길동</td>
      <td>21</td>
      <td>수건</td>
      <td>3.0</td>
    </tr>
    <tr>
      <th>7</th>
      <td>3</td>
      <td>영수</td>
      <td>30</td>
      <td>생수</td>
      <td>2.0</td>
    </tr>
    <tr>
      <th>8</th>
      <td>3</td>
      <td>영수</td>
      <td>30</td>
      <td>수건</td>
      <td>2.0</td>
    </tr>
    <tr>
      <th>9</th>
      <td>4</td>
      <td>수민</td>
      <td>31</td>
      <td>생수</td>
      <td>2.0</td>
    </tr>
    <tr>
      <th>10</th>
      <td>5</td>
      <td>동건</td>
      <td>18</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
</div>




```python
pd.merge(customer, orders, on='customer_id', how='right')
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>customer_id</th>
      <th>name</th>
      <th>나이</th>
      <th>item</th>
      <th>quantity</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>영희</td>
      <td>20.0</td>
      <td>치약</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>영희</td>
      <td>20.0</td>
      <td>칫솔</td>
      <td>2</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1</td>
      <td>영희</td>
      <td>20.0</td>
      <td>치약</td>
      <td>3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2</td>
      <td>길동</td>
      <td>21.0</td>
      <td>이어폰</td>
      <td>1</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2</td>
      <td>길동</td>
      <td>21.0</td>
      <td>헤드셋</td>
      <td>1</td>
    </tr>
    <tr>
      <th>5</th>
      <td>2</td>
      <td>길동</td>
      <td>21.0</td>
      <td>수건</td>
      <td>3</td>
    </tr>
    <tr>
      <th>6</th>
      <td>3</td>
      <td>영수</td>
      <td>30.0</td>
      <td>생수</td>
      <td>2</td>
    </tr>
    <tr>
      <th>7</th>
      <td>3</td>
      <td>영수</td>
      <td>30.0</td>
      <td>수건</td>
      <td>2</td>
    </tr>
    <tr>
      <th>8</th>
      <td>4</td>
      <td>수민</td>
      <td>31.0</td>
      <td>생수</td>
      <td>2</td>
    </tr>
    <tr>
      <th>9</th>
      <td>9</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>케이스</td>
      <td>1</td>
    </tr>
  </tbody>
</table>
</div>




```python
pd.merge(customer, orders, on='customer_id', how='outer')

# outer는 left와 right을 합친 것
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>customer_id</th>
      <th>name</th>
      <th>나이</th>
      <th>item</th>
      <th>quantity</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0</td>
      <td>철수</td>
      <td>40.0</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>영희</td>
      <td>20.0</td>
      <td>치약</td>
      <td>1.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1</td>
      <td>영희</td>
      <td>20.0</td>
      <td>칫솔</td>
      <td>2.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1</td>
      <td>영희</td>
      <td>20.0</td>
      <td>치약</td>
      <td>3.0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2</td>
      <td>길동</td>
      <td>21.0</td>
      <td>이어폰</td>
      <td>1.0</td>
    </tr>
    <tr>
      <th>5</th>
      <td>2</td>
      <td>길동</td>
      <td>21.0</td>
      <td>헤드셋</td>
      <td>1.0</td>
    </tr>
    <tr>
      <th>6</th>
      <td>2</td>
      <td>길동</td>
      <td>21.0</td>
      <td>수건</td>
      <td>3.0</td>
    </tr>
    <tr>
      <th>7</th>
      <td>3</td>
      <td>영수</td>
      <td>30.0</td>
      <td>생수</td>
      <td>2.0</td>
    </tr>
    <tr>
      <th>8</th>
      <td>3</td>
      <td>영수</td>
      <td>30.0</td>
      <td>수건</td>
      <td>2.0</td>
    </tr>
    <tr>
      <th>9</th>
      <td>4</td>
      <td>수민</td>
      <td>31.0</td>
      <td>생수</td>
      <td>2.0</td>
    </tr>
    <tr>
      <th>10</th>
      <td>5</td>
      <td>동건</td>
      <td>18.0</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>11</th>
      <td>9</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>케이스</td>
      <td>1.0</td>
    </tr>
  </tbody>
</table>
</div>




```python
cust1 = customer.set_index('customer_id')

order1 = orders.set_index('customer_id')
```


```python
cust1
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>name</th>
      <th>나이</th>
    </tr>
    <tr>
      <th>customer_id</th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>철수</td>
      <td>40</td>
    </tr>
    <tr>
      <th>1</th>
      <td>영희</td>
      <td>20</td>
    </tr>
    <tr>
      <th>2</th>
      <td>길동</td>
      <td>21</td>
    </tr>
    <tr>
      <th>3</th>
      <td>영수</td>
      <td>30</td>
    </tr>
    <tr>
      <th>4</th>
      <td>수민</td>
      <td>31</td>
    </tr>
    <tr>
      <th>5</th>
      <td>동건</td>
      <td>18</td>
    </tr>
  </tbody>
</table>
</div>




```python
order1
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>item</th>
      <th>quantity</th>
    </tr>
    <tr>
      <th>customer_id</th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>치약</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>칫솔</td>
      <td>2</td>
    </tr>
    <tr>
      <th>2</th>
      <td>이어폰</td>
      <td>1</td>
    </tr>
    <tr>
      <th>2</th>
      <td>헤드셋</td>
      <td>1</td>
    </tr>
    <tr>
      <th>2</th>
      <td>수건</td>
      <td>3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>생수</td>
      <td>2</td>
    </tr>
    <tr>
      <th>3</th>
      <td>수건</td>
      <td>2</td>
    </tr>
    <tr>
      <th>1</th>
      <td>치약</td>
      <td>3</td>
    </tr>
    <tr>
      <th>4</th>
      <td>생수</td>
      <td>2</td>
    </tr>
    <tr>
      <th>9</th>
      <td>케이스</td>
      <td>1</td>
    </tr>
  </tbody>
</table>
</div>




```python
pd.merge(cust1, order1, left_index=True, right_index=True)

# on을 설정할 필요가 없음
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>name</th>
      <th>나이</th>
      <th>item</th>
      <th>quantity</th>
    </tr>
    <tr>
      <th>customer_id</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>영희</td>
      <td>20</td>
      <td>치약</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>영희</td>
      <td>20</td>
      <td>칫솔</td>
      <td>2</td>
    </tr>
    <tr>
      <th>1</th>
      <td>영희</td>
      <td>20</td>
      <td>치약</td>
      <td>3</td>
    </tr>
    <tr>
      <th>2</th>
      <td>길동</td>
      <td>21</td>
      <td>이어폰</td>
      <td>1</td>
    </tr>
    <tr>
      <th>2</th>
      <td>길동</td>
      <td>21</td>
      <td>헤드셋</td>
      <td>1</td>
    </tr>
    <tr>
      <th>2</th>
      <td>길동</td>
      <td>21</td>
      <td>수건</td>
      <td>3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>영수</td>
      <td>30</td>
      <td>생수</td>
      <td>2</td>
    </tr>
    <tr>
      <th>3</th>
      <td>영수</td>
      <td>30</td>
      <td>수건</td>
      <td>2</td>
    </tr>
    <tr>
      <th>4</th>
      <td>수민</td>
      <td>31</td>
      <td>생수</td>
      <td>2</td>
    </tr>
  </tbody>
</table>
</div>


<br>
<br>

```python
# 가장 많이 팔린 아이템은?

pd.merge(customer, orders, on='customer_id').groupby('item').sum().sort_values(by='quantity', ascending=False)



# 수건이 가장 많이 팔림 
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>customer_id</th>
      <th>나이</th>
      <th>quantity</th>
    </tr>
    <tr>
      <th>item</th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>수건</th>
      <td>5</td>
      <td>51</td>
      <td>5</td>
    </tr>
    <tr>
      <th>생수</th>
      <td>7</td>
      <td>61</td>
      <td>4</td>
    </tr>
    <tr>
      <th>치약</th>
      <td>2</td>
      <td>40</td>
      <td>4</td>
    </tr>
    <tr>
      <th>칫솔</th>
      <td>1</td>
      <td>20</td>
      <td>2</td>
    </tr>
    <tr>
      <th>이어폰</th>
      <td>2</td>
      <td>21</td>
      <td>1</td>
    </tr>
    <tr>
      <th>헤드셋</th>
      <td>2</td>
      <td>21</td>
      <td>1</td>
    </tr>
  </tbody>
</table>
</div>




```python
#영희가 가장 많이 구매한 아이템은?

pd.merge(customer, orders, on='customer_id').groupby(['name', 'item']).sum().loc['영희', 'quantity']
```




    item
    치약    4
    칫솔    2
    Name: quantity, dtype: int64

<br>
<br>

### join 함수

 - 내부적으로 pandas.merge 함수 사용

 - 기본적으로 index를 사용하여 left join


```python
cust1.join(order1, how='inner')
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>name</th>
      <th>나이</th>
      <th>item</th>
      <th>quantity</th>
    </tr>
    <tr>
      <th>customer_id</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>영희</td>
      <td>20</td>
      <td>치약</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>영희</td>
      <td>20</td>
      <td>칫솔</td>
      <td>2</td>
    </tr>
    <tr>
      <th>1</th>
      <td>영희</td>
      <td>20</td>
      <td>치약</td>
      <td>3</td>
    </tr>
    <tr>
      <th>2</th>
      <td>길동</td>
      <td>21</td>
      <td>이어폰</td>
      <td>1</td>
    </tr>
    <tr>
      <th>2</th>
      <td>길동</td>
      <td>21</td>
      <td>헤드셋</td>
      <td>1</td>
    </tr>
    <tr>
      <th>2</th>
      <td>길동</td>
      <td>21</td>
      <td>수건</td>
      <td>3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>영수</td>
      <td>30</td>
      <td>생수</td>
      <td>2</td>
    </tr>
    <tr>
      <th>3</th>
      <td>영수</td>
      <td>30</td>
      <td>수건</td>
      <td>2</td>
    </tr>
    <tr>
      <th>4</th>
      <td>수민</td>
      <td>31</td>
      <td>생수</td>
      <td>2</td>
    </tr>
  </tbody>
</table>
</div>


