---
layout: single
title: 'MySQL 윈도우 프레임 활용'
excerpt: "실무 적용 및 SQL 코테를 위한 자료입니다."
categories: SQL
tags: [PRECEDING, FOLLOWING, CURRENT ROW, 윈도우, 정리, mysql, 문법, 기초, 란, 설명, 코딩테스트, 코테, 정의]
toc: true
toc_sticky: true
sidebar_main: true

date: 2024-09-17
last_modified_at: 2024-09-17
---

<br>

**MySQL 윈도우 함수에서 `PRECEDING`, `FOLLOWING`, `CURRENT ROW` 옵션 정리 <br>
윈도우 함수에서 `PRECEDING`, `FOLLOWING`, `CURRENT ROW`와 같은 옵션들은 윈도우 프레임을 정의할 때 사용됩니다. <br> 윈도우 프레임은 각 행에 대해 계산할 범위(창)를 지정하며, 이 범위 내에서 집계나 순위 계산이 이루어집니다.
{: .notice--info}

## **윈도우 프레임의 주요 옵션**

1. **`PRECEDING`**: 현재 행을 기준으로 **앞쪽의 행들**을 지정합니다.
   - **`N PRECEDING`**: 현재 행에서 **앞으로 N개의 행**
2. **`FOLLOWING`**: 현재 행을 기준으로 **뒤쪽의 행들**을 지정합니다.
   - **`N FOLLOWING`**: 현재 행에서 **뒤로 N개의 행**
3. **`CURRENT ROW`**: **현재 행**만 포함하는 것을 의미합니다.
4. **`UNBOUNDED PRECEDING`**: **윈도우 프레임의 시작**을 테이블의 첫 번째 행으로 지정합니다.
5. **`UNBOUNDED FOLLOWING`**: **윈도우 프레임의 끝**을 테이블의 마지막 행으로 지정합니다.

<br>

## **윈도우 함수 기본 구문**

```sql
<윈도우 함수> OVER (PARTITION BY column ORDER BY column ROWS | RANGE BETWEEN <프레임 정의>)
```

- **`ROWS`**: 실제 행의 개수를 기준으로 프레임을 설정합니다.
- **`RANGE`**: 값의 범위를 기준으로 프레임을 설정합니다 (예: 날짜 또는 숫자 범위).

<br>

### **ROWS vs RANGE**

- **`ROWS`**: 실제로 **행 개수**를 기준으로 윈도우 프레임을 설정합니다.
  - 예: `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`는 **현재 행과 그 앞 2개의 행**을 포함합니다.
  
- **`RANGE`**: **값의 범위**를 기준으로 윈도우 프레임을 설정합니다.
  - 예: `RANGE BETWEEN INTERVAL 1 DAY PRECEDING AND CURRENT ROW`는 **날짜 값**을 기준으로 프레임을 설정합니다.

<br>

## **프레임 지정 옵션 설명**

### 1. UNBOUNDED PRECEDING

- **처음부터** 현재 행까지의 모든 행을 포함합니다.
- "시작이 없을 만큼" 이전의 모든 행을 포함하는 의미입니다.
   
```sql
# 설명: 첫 번째 행부터 현재 행까지 누적 합계를 계산합니다.
SUM(amount) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
```

<br>

### 2. CURRENT ROW

- **현재 행만**을 포함합니다.
- 윈도우 프레임이 현재 행에서 시작하거나 끝날 때 사용됩니다.
   
```sql
# 설명: 현재 행과 그 뒤에 있는 2개의 행에 대해 평균 급여를 계산합니다.
AVG(salary) OVER (ORDER BY hire_date ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING)
```

<br>

### 3. N PRECEDING
- 현재 행을 기준으로 **앞으로 N개의 행**을 포함합니다.
   
```sql
# 설명: 현재 행에서 앞으로 3개의 행과 현재 행을 포함한 누적 합계를 계산합니다.
SUM(sales) OVER (ORDER BY sales_date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW)
```

<br>

### 4. N FOLLOWING
- 현재 행을 기준으로 **뒤로 N개의 행**을 포함합니다.

```sql
# 설명: 현재 행과 그 뒤의 2개의 행에 대해 누적 합계를 계산합니다.
SUM(sales) OVER (ORDER BY sales_date ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING)
```

<br>

### 5. UNBOUNDED FOLLOWING

- 현재 행부터 **끝까지 모든 행**을 포함합니다.
   
```sql
# 설명: 현재 행부터 마지막 행까지의 합계를 계산합니다.
SUM(sales) OVER (ORDER BY sales_date ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING)
```

<br>

## 예시

### 1. 누적 합계 (처음부터 현재까지)

```sql
# 설명: 첫 번째 행부터 현재 행까지의 누적 합계를 계산합니다.
SELECT 
    sales_date, 
    sales_amount,
    SUM(sales_amount) OVER (ORDER BY sales_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_sales
FROM Sales;
```

<br>

### 2. 현재 행과 이전 2개의 행의 합계

```sql
# 설명: 현재 행과 그 앞의 2개 행의 합계를 계산합니다. 총 3개의 행에 대해 집계가 이루어집니다.
SELECT 
    sales_date, 
    sales_amount,
    SUM(sales_amount) OVER (ORDER BY sales_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS window_sales
FROM Sales;
```

<br>

### 3. 현재 행과 다음 2개의 행에 대한 평균

```sql
# 설명: 현재 행과 그 뒤의 2개 행에 대한 평균을 계산합니다.
SELECT 
    sales_date, 
    sales_amount,
    AVG(sales_amount) OVER (ORDER BY sales_date ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING) AS avg_sales
FROM Sales;
```

<br>

### 4. 현재 행과 모든 이후 행에 대한 최대값

```sql
# 설명: 현재 행부터 마지막 행까지의 `sales_amount` 값 중 최대값을 반환합니다.
SELECT 
    sales_date, 
    sales_amount,
    MAX(sales_amount) OVER (ORDER BY sales_date ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) AS max_future_sales
FROM Sales;
```

<br>
