---
layout: single
title: "R 기초 ~ 심화 문법 총정리 (2) - 데이터 수집, 전처리"
excerpt: "+ ADsP, 빅데이터분석기사 실기 작업형 대비"
categories: R
tag : [R, visualization, adsp, certificate, 빅데이터 분석기사, 실기]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2021-11-16
---

## + 빅데이터분석기사 실기 작업형 대비 (데이터 수집, 전처리)

본 글은 빅데이터분석기사 실기 작업형에 대비하여 요약 및 실습한 것을 작성한 글입니다. 해당 글의 코드를 보고 싶으신 분들은 [빅데이터 분석기사 R 코드](https://github.com/ingu627/BigDataAnalysis)를 참고하시길 바랍니다.
{: .notice--info}

## 데이터 수집 작업

### 파일 종류 

**1. TXT 파일**
- `read.table(file, header, sep, fill, what)` : TXT 파일로부터 데이터를 읽는 함수

|주요 파라미터 | 설명|
|---|---|
| file | 읽어 들일 파일명을 설정함 |
|hearder | 첫 번째 행을 열 이름으로 인식할지 여부를 설정 |
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
- `read.csv(file, header) : CSV 파일로부터 데이터를 수집하는 함수

|주요 파라미터 | 설명|
|---|---|
| file | 읽어 들일 파일명을 설정함 |
|hearder | 첫 번째 행을 열 이름으로 인식할지 여부를 설정 |

- `write.csv(x, file, append, quote, sep, ...)` : csv파일로 저장할 때 사용하는 함수

|주요 파라미터 | 설명|
|---|---|
|x| 데이터 집합. 일반적으로 데이터 프레임 형식으로 저장|
|file | 작업 폴더에 저장하려는 파일명과 확장명 기록, 경로 지정 가능|
|append| TRUE면 이어쓰기 FALSE면 덮어쓰기(default)|
|quote| TRUE면 모든 값과 열 이름에 "로 수식 (default). FALSE면 큰따옴표 생략|
|sep| 구분자 지정|


**3. TSV 파일**
- 생략

**4. EXCEL 파일**
- `read_excel(path)` : 엑셀 파일로부터 데이터를 읽을 때 사용하는 함수
- `install.packages("readxl")` 설치해야함
- `path` : 읽어 들일 파일명을 설정함
- `write.xlsx(x, file,...)` : 엑셀 파일로 저장할 때 사용하는 함수

## 1. 데이터 전처리 작업
## plyr 패키지

- plyr 패키지는 원본 데이터를 분석하기 쉬운 형태로 나눠서 다시 새로운 형태로 만들어 주는 패키지이다.
- plyr 패키지의 함수들은 데이터 분할(split), 원하는 방향으로 특정 함수 적용(apply), 그 결과를 재조합(combine)하여 반환한다.
- plyr 패키지 함수는 ##ply 형태이고, 첫 번째 글자는 입력 데이터의 형태, 두 번째 글자는 출력 데이터의 형태를 의미한다.
- **(data frame == d), (list == l), (array == a)**

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

### select()

- `데이터 프레임 이름 %>% select(선택할 변수명, -제외할 변수명)`
  - `ctrl + shift + m` 단축키 : `%>%`
  - `%>%` : 파이프 연산자라고 읽고, 함수들을 연결하는 기능을 한다. 이 기호를 사용하면 그 앞에 나온 데이터를 계속해서 사용하겠다는 의미.

![image](https://user-images.githubusercontent.com/78655692/141607225-4541d17d-96ad-40b3-88fc-343442a6094d.png)

### filter()

- `데이터 프레임 이름 %>% filter(조건)` : 조건에 맞는 데이터 추출

![image](https://user-images.githubusercontent.com/78655692/141607862-ac57abf6-8052-442a-aa63-2080d7e26267.png)

### mutate()

- `데이터 프레임 이름 %>% mutate(새로운 변수명=값)` : 데이터에 새로운 파생변수를 추가

![image](https://user-images.githubusercontent.com/78655692/141608222-be24c7e8-79ae-4e33-95ab-df05faae6de2.png)

### group_by와 summarise

- `데이터 프레임 이름 %>% group_by(그룹화할 기준 변수1, ...) %>% summarise(새로운 변수명=계산식)` : 지정한 변수들을 기준으로 데이터를 그룹화하고, 요약 통계치 산출
- **요약 통계치 함수** : mean(), sd(), sum(), median(), min(), max(), n

![image](https://user-images.githubusercontent.com/78655692/141608729-3e9389ae-c787-44c3-94fd-58d8e0cd0825.png)

### arrange()

- `데이터 프레임 이름 %>% arrange(정렬 기준변수)` : 오름차순 정렬
- `데이터 프레임 이름 %>% arrange(desc(정렬 기준변수))` : 내림차순 정렬

![image](https://user-images.githubusercontent.com/78655692/141615130-26fdae63-1cf2-460e-b5b5-d83aca80b202.png)


### join()

![image](https://user-images.githubusercontent.com/78655692/141615149-0330cb00-fed7-42ee-941d-ebe065d6fa28.png)

- x, y : 병합할 데이터 프레임
- by : 병합 기준 칼럼(key)

- `inner_join(x, y, by, ...)` : 두 데이터 프레임에서 공통적으로 존재하는 모든 열을 병합하는 함수
- `left_join(x, y, by, ...)` : 왼쪽 데이터 프레임을 기준으로 모든 열을 병합하는 함수
- `right_join(x, y, by, ...)` : 오른쪽 데이터 프레임을 기준으로 모든 열을 병합하는 함수
- `full_join(x, y, by, ...)` : 두 데이터 프레임에 존재하는 모든 열을 병합하는 함수

### bind_rows()

- `bind_rows(데이터명1, ...)` : 데이터 행들을 연결하여 결합 

![image](https://user-images.githubusercontent.com/78655692/141615350-55582f5c-d702-4ef7-9cca-08d89e8625a2.png)

### bind_cols()

- `bind_cols(데이터명1, ...)` : 데이터 열들을 연결하여 결합

![image](https://user-images.githubusercontent.com/78655692/141615430-3dcf96f9-a28f-485c-bc7c-d7387ec521af.png)







## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264)  
- [Must Learning with R (개정판)](https://wikidocs.net/book/4315)  
- [Do it! 쉽게 배우는 R 데이터 분석](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=113509180)  
- [[R 데이터분석] 조인(join) 을 이용하여 데이터 병합하기](https://jobmanager1.tistory.com/54)

