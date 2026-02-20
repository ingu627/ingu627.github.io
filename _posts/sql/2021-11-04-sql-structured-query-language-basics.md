---
layout: single
title: 'MySQL 기초 문법 한눈에'
excerpt: "SQLD, 정보처리기사 실기 작업형 대비 또는 실무 적용을 위한 기본 내용입니다."
categories: SQL
tags: [sql, sqld, certificate, 자격증, 정보처리기사, 실기, 작업형, 실무, 정리, 총정리, 문법, 기초, 란, 개념]
toc: true
toc_sticky: false
sidebar_main: false

date: 2021-11-04
last_modified_at: 2022-08-22
redirect_from:
  - /sql/sql_basic/
---

## 데이터 언어

### DDL(Data Definition Language)

- 데이터 정의 언어를 말한다.
- 데이터베이스, 테이블, 뷰, 인덱스 등의 데이터베이스 개체를 생성, 삭제, 변경하는 역할을 한다.
- CREATE, DROP, ALTER 구문을 사용한다.
- DDL은 트랜잭션을 발생시키지 않는다.
- ROLLBACK이나 COMMIT을 사용할 수 없다.
- DDL문은 실행 즉시 MySQL에 적용된다.

<br>

### DML(Data Manipulation Language)

- 데이터를 조작(선택, 삽입, 수정, 삭제)하는 데 사용되는 언어다.
- DML 구문이 사용되는 대상은 테이블의 행이다.
- DML을 사용하기 위해서는 꼭 그 이전에 테이블을 정의해야 한다.
- SQL문 중 SELECT, INSERT, UPDATE, DELETE가 이 구문에 해당한다.
- 트랜잭션이 발생하는 SQL도 이 DML에 속한다.

<br>

### DCL(Data Control Language)

- 사용자에게 권한을 부여하거나 빼앗는 데 주로 사용하는 구문이다.
- `GRANT/REVOKE`를 사용한다.

<br>

## 단축키 모음 
1. 1개 실행 : `Ctrl + Enter` (세미콜론으로 끝나있는 SQL을 실행)
2. 모두 실행 : `Ctrl + Shift + Enter` (SQL창의 전체 모두 실행)
3. 단일 주석 : `ctrl + /` (--로 표시)
4. 멀티 주석 : `/* 내용 */`

<br>
<br>

## 실습
- 기본 구조 : 주석(설명) + 코드(위) + 이미지(아래)

<br>

## SHOW DATABASES
```sql
SHOW DATABASES; -- 현재 서버에 어떤 DB가 있는지 보기
```
실행 결과 : 
![image](https://user-images.githubusercontent.com/78655692/140440257-70ab23b6-349c-458a-a489-c81471091967.png)

<br>
<br>

## USB
```sql
-- USB : 사용할 데이터베이스 지정 
-- 지정해 놓은 후 특별히 다시 USE문 사용하거나 다른 DB를 사용하겠다고 명시하지 않는 이상 모든 SQL문은 지정 DB에서 수행
use world;
```

<br>
<br>

## SHOW TABLES
```sql
SHOW TABLES; -- 데이터베이스 world의 테이블 이름 보기
```
실행 결과 : 
![image](https://user-images.githubusercontent.com/78655692/140440808-25953e87-8dd7-49f1-87ec-b69cc71bc6dc.png)

<br>
<br>

## SHOW TABLE STATUS
```sql
SHOW TABLE STATUS; 
-- : 데이터베이스 WORLD의 테이블 정보 조회
```
실행 결과 : 
![image](https://user-images.githubusercontent.com/78655692/140440442-25e804cd-e262-4fc6-84f2-09a1e197d521.png)

<br>
<br>

## DESCRIBE
```sql
DESCRIBE city; 
-- city 테이블에 무슨 열이 있는지 확인 
-- 또는 DESC
```
실행 결과 : 
![image](https://user-images.githubusercontent.com/78655692/140440482-adc75474-699c-47f9-829d-c7f7399b2336.png)

<br>
<br>

## DESC
```sql
DESC country; 
-- ; :쿼리가 끝났다
```
실행 결과 : 
![image](https://user-images.githubusercontent.com/78655692/140440577-05a4dde3-f92e-4728-b028-06ac20b8bae5.png)

---

```sql
DESC countrylanguage;
```
실행 결과 : 
![image](https://user-images.githubusercontent.com/78655692/140440693-d406146c-ad8d-4e46-a46a-a6fb1abcc506.png)

<br>
<br>

## SELECT...FROM
```sql
-- SELECT...FROM : 요구하는 데이터를 가져오는 구문
-- 일반적으로 가장 많이 사용되는 구문
-- 데이터베이스 내 테이블에서 원하는 정보를 추출
select * from city; -- city의 모든 열을 다 보여줌
--  * : all
```
실행 결과 : 
![image](https://user-images.githubusercontent.com/78655692/140440894-020bd908-fc98-4cbf-9acd-40445c84eff5.png)

<br>
<br>

## select 열 이름
```sql
-- select 열 이름 : 테이블에서 필요로 하는 열만 가져오기 가능
-- 여러 개의 열을 가져오고 싶을 때는 콤마로 구분
-- 열 이름의 순서는 출력하고 싶은 순서대로 배열 가능
select Name From city;
select Name, Population from city;
```
실행 결과 : 
![image](https://user-images.githubusercontent.com/78655692/140441615-0330c3c3-e121-4fa2-bb6e-9aea71e4d9ab.png)

<br>
<br>

## WHERE
```sql
-- where : 조회하는 결과에 특정한 조건으로 원하는 데이터만 보고 싶을때 
-- SELECT 필드이름 from 테이블 이름 WHERE 조건식;
select *
from city
where Population >= 8000000;
```
실행 결과 : 
![image](https://user-images.githubusercontent.com/78655692/140441686-fe6c4f44-789f-471b-9f40-b1f2ffceaf37.png)

---

```sql
select *
from city
where Population < 8000000
and Population > 7000000;
```
실행 결과 : 
![image](https://user-images.githubusercontent.com/78655692/140441742-6f9253c7-404a-47db-b40b-191d58f3b190.png)

---

```sql
DESC city;

select *
from city
where CountryCode = 'KOR'
and Population >= 1000000;
```
실행 결과 : 
![image](https://user-images.githubusercontent.com/78655692/140441815-bb6906b8-f34d-4a03-bf38-c478c5e9c302.png)

<br>
<br>

## BETWEEN
```sql
-- BETWEEN : 데이터가 숫자로 구성됨
select *
from city
where Population between 7000000 and 8000000;
```
실행 결과 : 
![image](https://user-images.githubusercontent.com/78655692/140441867-60fadbc6-8f35-49c1-9c48-918b7d1dea51.png)

<br>
<br>

## IN
```sql
-- IN : 이산적인 값의 조건에서는 IN() 사용 가능
select *
from city
where Name In('Seoul', 'New York', 'Tokyo');
```
실행 결과 : 
![image](https://user-images.githubusercontent.com/78655692/140442339-deb58aa3-ea4b-4513-a347-31ba5a2d6ac3.png)

---

```sql
select *
from city
where CountryCode IN('KOR', 'usa', 'JPN');
```
실행 결과 : 
![image](https://user-images.githubusercontent.com/78655692/140442532-650a15cf-1025-4447-8352-042ee0739d60.png)

<br>
<br>

## LIKE
```sql
-- LIKE : 문자열의 내용 검색하기 위해 LIKE 연산자 사용
-- 문자 뒤에 %-무엇이든 허용
-- 한 글자와 매치하기 위해서는 _사용
select *
from city
where CountryCode like 'KO_';
```
실행 결과 : 
![image](https://user-images.githubusercontent.com/78655692/140442653-3b110048-a5fa-45ae-a854-2008d827d98d.png)

---

```sql
select *
from city
where Name like 'Tel %';
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140442759-491ebf47-f750-4346-95a7-f94f867f1d31.png)

<br>
<br>

## Sub Query
```sql
-- Sub Query : 쿼리문 안에 또 쿼리문이 들어 있는 것
select *
from city
where CountryCode = (
     select CountryCode
     from city
     where Name = 'Seoul');
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140442917-e459337b-0495-4255-bded-87444348a641.png)

<br>
<br>

## ANY
```sql
-- ANY : 서브쿼리의 여러 개의 결과 중 한 가지만 만족해도 가능
-- SOME은 ANY와 동일한 의미로 사용
select *
from city
where Population > ANY (
     select Population
     from city
     where District = 'New York');
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140445421-e157a35b-3691-4072-b2f0-d5c3204df5ec.png)

<br>
<br>

## ALL
```sql
-- ALL : 서브쿼리의 여러 개의 결과를 모두 만족시켜야 함 
select *
from city
where Population > all (
     select Population
     from city
     where District = 'New York'); -- 뉴욕의 인구수보다 많은 도시들을 보여줘라
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140445498-58aeb43f-844a-4e6e-9550-1003aa43fe5d.png)

<br>
<br>

## ORDER GROUP
```sql
-- ORDER GROUP : 결과가 출력되는 순서를 조절하는 구문
-- 기본적으로 오름차순 정렬(ASC)
-- 내림차순으로 정렬(DESC)
select *
from city
order by Population DESC;
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140445874-0c034f75-8fc3-4e94-ae5b-dab5e51bc048.png)

---

```sql
select *
from city
order by CountryCode ASC, Population DESC;
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140445925-4e91922d-b316-471a-b5d1-199ab0a63f9d.png)

---

```sql
select *
from city
where CountryCode = 'KOR'
order by Population DESC;
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140446125-d7a4d3ed-ad1c-4ec0-a12c-60332d12ffa3.png)

---

```sql
desc country;

select *
from country
order by SurfaceArea desc;
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140446245-b8c31294-0ce1-4a21-bc4c-7fc77d06abf5.png)

<br>
<br>

## DISTINCT
```sql
-- DISTINCT : 중복된 것은 1개씩만 보여주면서 출력
select distinct CountryCode
from city;
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140446436-53aef7b7-9acf-42d9-91a0-0c56276c3241.png)

<br>
<br>

## limit
```sql
-- limit : 출력 개수를 제한 / 상위의 N개만 출력하는 LIMIT N 구문
select *
from city
order by Population desc
limit 10; -- 상위 10개만 보여줘
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140447126-41ac4654-82b3-42f6-b2ee-d22a8a2c1b40.png)

<br>
<br>

## 집계함수
```sql
/* GROUP BY : 그룹으로 묶어주는 역할
집계함수를 함께 사용
AVG():평균
MIN():최소값
MAX():최대값
COUNT():행의 개수
COUNT(DISTINCT):중복 제외된 행의 개수
STDEV():표준 편차
VARIANCE():분산

읽기 좋게 하기 위해 별칭(alias)사용
*/
select CountryCode, max(Population) as 'MAX' 
from city
group by CountryCode;
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140447317-e28fe8f7-9421-4749-9e6d-072d5dd6c9b5.png)

---

```sql
select count(*)
from city;
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140447468-935e3db9-a671-4506-869a-822a9bcc3897.png)

---

```sql
select avg(Population)
from city;
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140447529-79fe1d4e-3999-4357-980e-513abb286a0c.png)

<br>
<br>

## HAVING
```sql
-- HAVING : where과 비슷한 개념으로 조건 제한
-- 집계 함수에 대해서 조건 제한하는 편리한 개념
-- HAVING절은 반드시 GROUP BY절 다음에 나와야함
select CountryCode, max(population)
from city
group by CountryCode
having max(Population) > 8000000;
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140447639-3ddd58f2-eb3e-487f-ac24-55a52d25dcc6.png)

<br>
<br>

## ROLLUP
```sql
-- ROLLUP : 총합 또는 중간합계가 필요한 경우 사용
-- GROUP BY절과 함께 with rollup문 사용
-- 각각의 모든 집계를 보여줌
select CountryCode, Name, sum(population)
from city
group by CountryCode, Name with rollup;
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140447774-91774a32-dcad-41cb-a33c-eafb52ec75f9.png)

<br>
<br>

## JOIN
```sql
-- JOIN : 데이터베이스 내의 여러 테이블에서 가져온 레코드를 조합하여
-- 하나의 테이블이나 결과 집합으로 표현
select *
from city
join country on city.CountryCode = country.Code -- =국가코드
join countrylanguage ON city.CountryCode = countrylanguage.CountryCode;
-- 3개의 테이블이 join된 형태로 나옴
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140447934-c7776ccb-503f-4807-a31d-633389a4ce0b.png)

<br>
<br>

## MySQL 내장함수
```sql
-- MySQL 내장함수 : 사용자의 편의를 위해 다양한 기능의 내장 함수를 미리 정의하여 제공

### LENGTH()
-- LENGTH() : 전달받은 문자열의 길이를 반환
select length('12345141');
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140447979-9bce5fdc-21cd-47ef-9e54-14f8cd26d4e9.png)

<br>

### CONCAT()
```sql
-- CONCAT() : 전달받은 문자열을 모두 결합하여 하나의 문자열로 반환
-- 전달받은 문자열 중 하나라도 NULL이 존재하면 NULL을 반환
select concat('My', 'sql Op', 'en Source');
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140448106-88f9a2ea-16cd-4dbb-9348-f94630365476.png)

<br>

### LOCATE()
```sql
-- LOCATE() : 문자열 내에서 찾는 문자열이 처음으로 나타나는 위치를 찾아서 해당 위치를 반환
-- 찾는 문자열이 문자열 내에 존재하지 않으면 0을 반환
-- MySQL에서는 문자열의 시작 인덱스를 1부터 계산
select locate('abc', 'abababababacabc');
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140448151-4d57ef92-604d-473e-b4fd-a37d44d7212a.png)

<br>

### LEFT(), RIGHT()
```sql
-- LEFT() : 문자열의 왼쪽부터 지정한 개수만큼의 문자를 반환
-- RIGHT() : 문자열의 오른쪽부터 지정한 개수만큼의 문자를 반환
select left('MySQL is an open source relational database management', 5);
select right('MySQL is an open source relational database management', 5);
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140448268-f28a2947-911e-49b6-88af-66c8e531e6cb.png)
![image](https://user-images.githubusercontent.com/78655692/140448308-ac70f930-6fba-4edd-ad41-84bbb284db36.png)

<br>

### LOWER(), UPPER()
```sql
-- LOWER() : 문자열의 문자를 모두 소문자로 변경
-- UPPER() : 문자열의 문자를 모두 대문자로 변경
select lower('MySQL is an open source relational database management');
select upper('MySQL is an open source relational database management');
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140448398-2d008468-6713-440c-a75a-aab3970973b6.png)
![image](https://user-images.githubusercontent.com/78655692/140448430-d4cd1827-6dad-435f-87d6-a008ba547e34.png)

<br>

### REPLACE()
```sql
-- REPLACE() : 문자열에서 특정 문자열을 대체 문자열로 교체
select
replace('MSSQL', 'MS', 'My');
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140448475-ffc8b694-2f47-4fb4-99fa-5e77acc6c2f2.png)

<br>

### TRIM()
```sql
/*
TRIM() : 문자열의 앞이나 뒤, 또는 양쪽 모두에 있는 특정 문자를 제거
TRIM()함수에서 사용할 수 있는 지정자
- BOTH : 전달받은 문자열의 양 끝에 존재하는 특정 문자를 제거 (기본설정)
- LEADING : 전달받은 문자열 앞에 존재하는 특정 문자를 제거
- TRAILING : 전달받은 문자열 뒤에 존재하는 특정 문자를 제거

만약 지정자를 명시하지 않으면, 자동으로 BOTH로 설정
제거할 문자를 명시하지 않으면, 자동으로 공백을 제거
*/
select trim('       MySQL        ');
select trim('       MySQL        '),
trim(leading '#' from '###MySQL##'),
trim(trailing '#' from '###MySQL##');
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140448570-f7313185-b68d-43c8-bce7-7f752dabd2d0.png)
![image](https://user-images.githubusercontent.com/78655692/140448629-34f328f6-8216-4880-99a8-8e358f5fff82.png)

<br>

### format()
```sql
-- format() : 숫자 타입의 데이터를 세 자리마다 쉼표를 사용하는 #,###,##.## 형식으로 변환
-- 반환되는 데이터의 형식은 문자열 타입
-- 두 번째 인수는 반올림할 소수 부분의 자릿수
select format(123121312.12312313, 3); -- 3개씩 끊어서
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140448683-622842e8-1e7a-478e-b144-8c43f7bf7a4c.png)

<br>

### FLOOR(), CEIL(), ROUND()
```sql
-- FLOOR() : 내림
-- CEIL() : 올림
-- ROUND() : 반올림
select floor(10.95), ceil(10.95), round(10.95);
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140448727-98aadc3a-b133-4970-98ba-f987ef30af26.png)

<br>

### SQRT(), POW(), EXP(), LOG()
```sql
-- SQRT() : 양의 제곱근
-- POW() : 첫 번째 인수로는 밑수를 전달하고, 두 번째 인수로는 지수를 전달하여 거듭제곱 계산
-- EXP() : 인수로 지수를 전달받아, e의 거듭제곱을 계산
-- LOG() : 자연로그 값을 계산
select sqrt(4), pow(2,3), exp(3), log(3);
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140448788-c8fd97d5-8722-499c-ae72-eb82e5d2915e.png)

<br>

### sin(), cos(), tan()
```sql
-- sin() :사인값 반환
-- cos() : 코사인값 반환
-- tan() : 탄젠트값 반환
select sin(pi()/2), cos(pi()), tan(pi()/4);
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140448898-6a2433b7-5c7a-422f-a3a8-f03314a1dcd0.png)

<br>

### ABS(X), RAND()
```sql
-- ABS(X) : 절대값을 반환
-- RAND(): 0.0보다 크거나 같고 1.0보다 작은 하나의 실수를 무작위로 생성
select abs(-3), rand(), round(rand()*100);
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140448927-b2ac7b74-d607-4708-a4ea-bd17aa2497c8.png)

<br>
<br>

## DATE(날짜)

### NOW(), CURDATE(), CURTIME()
```sql
/*
NOW() : 현재 날짜와 시간을 반환, 반환되는 값은 'YYYY-MM-DD HH:MM:SS'
또는 YYYYMMDDHHMMSS 형태로 반환
CURDATE() : 현재 날짜를 반환, 이때 반환되는 값은 'YYYY-MM-DD'또는 YYYYMMDD 형태로 반환
CURTIME() : 현재 시각을 반환, 이때 반환되는 값은 'HH:MM:SS'또는 HHMMSS 형태로 반환
*/
select now(), curdate(), curtime();
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140450013-6a82b870-9c85-4fae-83b4-23a7b172db83.png)

<br>

### DATE() ~ SECOND()
```sql
/*
DATE() : 전달받은 값에 해당하는 날짜 정보를 반환
MONTH() : 월에 해당하는 값을 반환하며, 0부터 12사이의 값을 가짐
DAY() : 일에 해당하는 값을 반환하며, 0부터 31사이의 값을 가짐
HOUR() : 시간에 해당하는 값을 반환하며, 0부터 23사이의 값을 가짐
MINUTE() : 분에 해당하는 값을 반환하며, 0부터 59사이의 값을 가짐
SECOND() : 초에 해당하는 값을 반환하며, 0부터 59사이의 값을 가짐
*/
select
now(), 
date(now()),
month(now()),
day(now()),
hour(now()),
minute(now()),
second(now());
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140449923-c363c297-d59e-4814-8653-2e8ddd79d5b0.png)

<br>

### MONTHNAME(), DAYNAME()
```sql
-- MONTHNAME() : 월에 해당하는 이름을 반환
-- DAYNAME() : 요일에 해당하는 이름을 반환
select
now(),
monthname(now()),
dayname(now());
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140450126-74da05c3-f1b2-44ed-a580-69dbac9d55e3.png)

<br>

### DAYOFWEEK(), DAYOFMONTH(), DAYOFYEAR()
```sql
/*
DAYOFWEEK() : 일자가 해당 주에서 몇번째 날인지를 반환, 1부터 7사이의 값을 반환
DAYOFMONTH() : 일자가 해당 월에서 몇 번째 날인지를 반환, 0부터 31사이의 값을 반환
DAYOFYEAR() : 일자가 해당 연도에서 몇 번재 날인지를 반환, 1부터 366사이의 값을 반환
*/
select
now(),
dayofweek(now()),
dayofmonth(now()),
dayofyear(now());
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140450249-e26b5f41-208f-47a0-9193-eacb7ba319b3.png)

<br>

### DATE_FORMAT()
```sql
-- DATE_FORMAT() : 전달받은 형식에 맞춰 날짜와 시간 정보를 문자열로 반환
select
date_format(now(), '%D %y %a %d %m %n %j');
```
실행 결과 :
![image](https://user-images.githubusercontent.com/78655692/140450299-ad08ca9d-195f-463a-a035-12ed0af0bac6.png)

<br>
<br>

## Reference
- [참조 영상 : 이수안컴퓨터연구소](https://www.youtube.com/watch?v=vgIc4ctNFbc)