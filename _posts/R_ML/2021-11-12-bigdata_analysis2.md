---
layout: single
title: "빅데이터분석기사 실기 작업형(2) - R 데이터 수집, 전처리"
excerpt: "본 글은 빅데이터분석기사 실기 작업형에 대비하여 요약 및 실습한 것을 작성한 글입니다. 기출문제의 데이터는 https://github.com/ingu627/BigDataAnalysis에 데이터 셋을 남겨놨습니다."
categories: R_ML
tag : [R, visualization, adsp, certificate, 빅데이터 분석기사, 실기, 작업형, 필답형, 자격증, dataq, 정리, pdf, 기출문제, 정리본]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-03-31
---

<img align='right' width='200' height='200' src='https://user-images.githubusercontent.com/78655692/148633895-2be87d4e-7edb-4391-b583-eb2888b19bbb.png
'>
본 글은 빅데이터분석기사 실기 작업형에 대비하여 요약 및 실습한 것을 작성한 글입니다. <br>기출문제의 데이터는 [https://github.com/ingu627/BigDataAnalysis](https://github.com/ingu627/BigDataAnalysis){: target="_blank"}에 데이터 셋을 남겨놨습니다.<br> 또한 해당 전체 코드는 `/concept/R_basic_to_pro_2.R` 파일에 담겨져 있습니다.
{: .notice--info}

2021.12.31 : 제 3회 빅데이터 분석기사 실기를 합격했습니다. <br> [빅데이터 분석기사(R)](https://ingu627.github.io/categories/R_ML) 시리즈를 보시고 도움이 되길 바랍니다.
{: .notice--danger}

혹시 해당 글을 pdf로 받고 싶으신 분은 이메일과 함께 댓글로 남겨주세요~
{: .notice--success}

<br>
<br>
<br>
<br>

## 데이터 수집 작업

### 파일 종류 

**1. TXT 파일**
- `read.table(file, header, sep, fill, what)` : TXT 파일로부터 데이터를 읽는 함수

|주요 파라미터 | 설명|
|---|---|
| file | 읽어 들일 파일명을 설정함 |
|header | 첫 번째 행을 열 이름으로 인식할지 여부를 설정 |
|sep |구분자 지정 |
|fill | 비어있는 부분을 NA로 채울지 여부를 결정|
|what | 실수와 문자를 읽는 경우 사용|

- `write.table(x, file, append, quote, sep,... )` : 테이블 형식의 데이터 집합을 파일에 쓸 때 사용하는 함수

|주요 파라미터 | 설명|
|---|---|
|x| 데이터 집합. 일반적으로 데이터 프레임 형식으로 저장|
|file | 작업 폴더에 저장하려는 파일명과 확장명 기록, 경로 지정 가능|
|append| TRUE면 이어쓰기 FALSE면 덮어쓰기(default)|
|quote| TRUE면 모든 값과 열 이름에 "로 수식 (default). FALSE면 큰따옴표 생략|
|sep| 구분자 지정|

**2. CSV 파일**

- `read.csv(file, header)` : CSV 파일로부터 데이터를 수집하는 함수

|주요 파라미터 | 설명|
|---|---|
| file | 읽어 들일 파일명을 설정함 |
|header | 첫 번째 행을 열 이름으로 인식할지 여부를 설정 |

  - `stringsAsFactors=TRUE` : 불러올 때 문자열을 factor로 변환해줌

- `write.csv(x, file, append, quote, sep, ...)` : csv파일로 저장할 때 사용하는 함수

|주요 파라미터 | 설명|
|---|---|
|x| 데이터 집합. 일반적으로 데이터 프레임 형식으로 저장|
|file | 작업 폴더에 저장하려는 파일명과 확장명 기록, 경로 지정 가능|
|append| TRUE면 이어쓰기 FALSE면 덮어쓰기(default)|
|quote| TRUE면 모든 값과 열 이름에 "로 수식 (default). FALSE면 큰따옴표 생략|
|sep| 구분자 지정|

- `row.names=FALSE` : 인덱스를 반환 X

**3. TSV 파일**

- 생략

**4. EXCEL 파일**

- `read_excel(path)` : 엑셀 파일로부터 데이터를 읽을 때 사용하는 함수
- `install.packages("readxl")` 설치해야함
- `path` : 읽어 들일 파일명을 설정함
- `write.xlsx(x, file,...)` : 엑셀 파일로 저장할 때 사용하는 함수

<br>
<br>

## 1. 데이터 전처리 작업
## plyr 패키지

- plyr 패키지는 원본 데이터를 분석하기 쉬운 형태로 나눠서 다시 새로운 형태로 만들어 주는 패키지이다.
- plyr 패키지의 함수들은 데이터 분할(split), 원하는 방향으로 특정 함수 적용(apply), 그 결과를 재조합(combine)하여 반환한다.
- plyr 패키지 함수는 ##ply 형태이고, 첫 번째 글자는 입력 데이터의 형태, 두 번째 글자는 출력 데이터의 형태를 의미한다.
- **(data frame == d), (list == l), (array == a)**

<br>
<br>

## dplyr 패키지 

- 데이터 전처리는 분석에 적합하도록 데이터를 가공하는 작업이다.
- 데이터 일부를 추출하거나 종류별로 나누거나, 여러 데이터를 합치는 등의 데이터 가공을 통하여 분석 작업을 최적화할 수 있다.

**dplyr 패키지의 주요 함수**

|dplyr 함수| 기능 |
|---|---|
|select | 열(변수) 추출|
|filter | 행 추출 |
|mutate | 변수 추가 |
|group_by | 데이터 그룹별로 나누기 |
|summarise | 요약 통계치 산출 |
|arrange | 데이터 정렬 |
|inner_join | 두 데이터 프레임에서 공통적으로 존재하는 모든 열 병합| 
|left_join | 왼쪽 데이터 프레임을 기준으로 모든 열 병합 | 
|right_join | 오른쪽 데이터 프레임을 기준으로 모든 열 병합 |
|full_join | 두 데이터 프레임에 존재하는 모든 열 병합 |
|bind_rows | 행 방향으로 데이터 결합 |
|bind_cols| 열 방향으로 데이터 결합 |

<br>
<br>

### select()

- `데이터 프레임 이름 %>% select(선택할 변수명, -제외할 변수명)`
  - `ctrl + shift + m` 단축키 : `%>%`
  - `%>%` : 파이프 연산자라고 읽고, 함수들을 연결하는 기능을 한다. 이 기호를 사용하면 그 앞에 나온 데이터를 계속해서 사용하겠다는 의미.

```R
library(dplyr)

iris %>% 
    select(Sepal.Length) %>% head()

# 1          5.1
# 2          4.9
# 3          4.7
# 4          4.6
# 5          5.0
# 6          5.4
```

<br>
<br>

### filter()

- `데이터 프레임 이름 %>% filter(조건)` : 조건에 맞는 데이터 추출

```R
iris %>% 
    filter(Species == 'setosa') %>% 
    select(Sepal.Length, Sepal.Width) %>% 
    head()
# 1          5.1         3.5
# 2          4.9         3.0
# 3          4.7         3.2
# 4          4.6         3.1
# 5          5.0         3.6
# 6          5.4         3.9
```

<br>
<br>

### mutate()

- `데이터 프레임 이름 %>% mutate(새로운 변수명=값)` : 데이터에 새로운 파생변수를 추가

```R
iris %>% 
    filter(Species == 'virginica') %>% 
    mutate(Len = ifelse(Sepal.Length>6, 'L', 'S')) %>% 
    select(Species, Len) %>% 
    head()
#     Species Len
# 1 virginica   L
# 2 virginica   S
# 3 virginica   L
# 4 virginica   L
# 5 virginica   L
# 6 virginica   L
```

<br>
<br>

### group_by와 summarise

- `데이터 프레임 이름 %>% group_by(그룹화할 기준 변수1, ...) %>% summarise(새로운 변수명=계산식)` : 지정한 변수들을 기준으로 데이터를 그룹화하고, 요약 통계치 산출
- **요약 통계치 함수** : mean(), sd(), sum(), median(), min(), max(), n

```R
iris %>% 
    group_by(Species) %>% 
    summarise(Petal.Width = mean(Petal.Width))
# # A tibble: 3 x 2
#   Species    Petal.Width
#   <fct>            <dbl>
# 1 setosa           0.246
# 2 versicolor       1.33
# 3 virginica        2.03
```

<br>
<br>

### n()

- 이 함수는 단독으로 사용되지 않고 반드시 group_by()함수와 연결된 summarise()함수의 내부에 포함되어 쓰인다.
- 예시 : `mpg %>% group_by(class) %>% summarise(n = n())`

<br>
<br>

### count()

- `count(데이터프레임명, 변수명)`

<br>
<br>

### arrange()

- `데이터 프레임 이름 %>% arrange(정렬 기준변수)` : 오름차순 정렬
- `데이터 프레임 이름 %>% arrange(desc(정렬 기준변수))` : 내림차순 정렬

```R
iris %>% 
    filter(Species == 'setosa') %>% 
    mutate(Len = ifelse(Sepal.Length>5, 'L', 'S')) %>% 
    select(Species, Len, Sepal.Length) %>% 
    arrange(desc(Sepal.Length)) %>% 
    head()
#   Species Len Sepal.Length
# 1  setosa   L          5.8
# 2  setosa   L          5.7
# 3  setosa   L          5.7
# 4  setosa   L          5.5
# 5  setosa   L          5.5
# 6  setosa   L          5.4
```

<br>
<br>

### join()

![image](https://user-images.githubusercontent.com/78655692/141615149-0330cb00-fed7-42ee-941d-ebe065d6fa28.png)

- x, y : 병합할 데이터 프레임
- by : 병합 기준 칼럼(key)

- `inner_join(x, y, by, ...)` : 두 데이터 프레임에서 공통적으로 존재하는 모든 열을 병합하는 함수
- `left_join(x, y, by, ...)` : 왼쪽 데이터 프레임을 기준으로 모든 열을 병합하는 함수
- `right_join(x, y, by, ...)` : 오른쪽 데이터 프레임을 기준으로 모든 열을 병합하는 함수
- `full_join(x, y, by, ...)` : 두 데이터 프레임에 존재하는 모든 열을 병합하는 함수

<br>
<br>

### bind_rows()

- `bind_rows(데이터명1, ...)` : 데이터 행들을 연결하여 결합 

```R
x = data.frame(x=1:3, y=1:3)
x
#   x y
# 1 1 1
# 2 2 2
# 3 3 3
y = data.frame(x=4:6, z=4:6)
y
#   x z
# 1 4 4
# 2 5 5
# 3 6 6
bind_rows(x, y)
#   x  y  z
# 1 1  1 NA
# 2 2  2 NA
# 3 3  3 NA
# 4 4 NA  4
# 5 5 NA  5
# 6 6 NA  6
```

<br>
<br>

### bind_cols()

- `bind_cols(데이터명1, ...)` : 데이터 열들을 연결하여 결합

```R
x = data.frame(title=c(1:5),
                a=c(30,70,45,90,65))
x
#   title  a
# 1     1 30
# 2     2 70
# 3     3 45
# 4     4 90
# 5     5 65
y = data.frame(b=c(70,65,80,80,90))
y
#    b
# 1 70
# 2 65
# 3 80
# 4 80
# 5 90
bind_cols(x, y)   
#   title  a  b
# 1     1 30 70
# 2     2 70 65
# 3     3 45 80
# 4     4 90 80
# 5     5 65 90  
```

<br>
<br>

## 결측치 

### is.na()

- 결측치 여부 확인
- 결측치가 있으면 TRUE, 결측치가 없으면 FALSE를 반환한다.

<br>
<br>

### na.omit()

- 결측치 제거
- **행** 단위로 어떤 결측치라도 있으면 이 행을 제거하고 남은 데이터를 반환

<br>
<br>

### 결측값을 다른 값으로 대체

- `dataset$var[is.na(dataset$var)] <- new_value`

<br>
<br>

## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264)  
- [Must Learning with R (개정판)](https://wikidocs.net/book/4315)  
- [Do it! 쉽게 배우는 R 데이터 분석](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=113509180)  
- [[R 데이터분석] 조인(join) 을 이용하여 데이터 병합하기](https://jobmanager1.tistory.com/54)
- [R, Python 분석과 프로그래밍의 친구 (by R Friend)](https://rfriend.tistory.com/34 )
