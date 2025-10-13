---
layout: single
title: 'MySQL 서브쿼리·IN 활용'
excerpt: "실무 적용 및 SQL 코테를 위한 자료입니다."
categories: SQL
tags: [서브 쿼리, 실무, 정리, mysql, 문법, 기초, 란, 설명, 코딩테스트, 코테]
toc: true
toc_sticky: false
sidebar_main: false

date: 2024-09-08
last_modified_at: 2024-09-08
---

<br>

## 서브쿼리(Subquery)

- 서브쿼리(Subquery)는 **쿼리 내에 포함된 또 다른 쿼리**를 의미합니다. 이는 하나의 SQL 문장 안에서, 다른 쿼리의 결과를 참조하거나 사용하기 위해 작성됩니다. 서브쿼리는 일반적으로 `SELECT`, `INSERT`, `UPDATE`, `DELETE` 문에서 사용되며, 주 쿼리(Main Query)에 필요한 데이터를 제공하는 역할을 합니다.
- **서브쿼리의 특징**

  1. **위치**: 서브쿼리는 주로 `SELECT`, `FROM`, `WHERE`, `HAVING` 절 내에서 사용됩니다.
  2. **독립성**: 서브쿼리는 독립적인 SQL 문장으로 실행될 수 있습니다. 하지만 주 쿼리와 결합될 때, 특정 조건을 만족하는 데이터만 반환합니다.
  3. **중첩 구조**: 주 쿼리 안에 중첩된 형태로 존재하며, 주 쿼리의 일부로 사용됩니다.

- 서브쿼리의 활용
  - **필터링**: 주 쿼리에서 반환할 데이터를 특정하기 위해 서브쿼리에서 데이터를 필터링합니다.
  - **계산**: 주 쿼리에서 직접 계산하기 어려운 값을 서브쿼리에서 계산하여 반환합니다.
  - **데이터 추출**: 주 쿼리에서 필요한 데이터를 서브쿼리를 통해 가져옵니다.

<br>

### 서브쿼리의 종류

1. **단일 행 서브쿼리**
   - 하나의 결과만 반환하는 서브쿼리
   
     ```sql
     # 예: 특정 부서의 최대 급여를 찾을 때
     SELECT employee_name 
     FROM Employees 
     WHERE salary = (SELECT MAX(salary) FROM Employees WHERE department_id = 1);
     ```

<br>

2. **다중 행 서브쿼리**
   - 여러 행의 결과를 반환하는 서브쿼리
     ```sql
     # 특정 부서에 속한 모든 직원의 이름을 찾을 때
     SELECT employee_name 
     FROM Employees 
     WHERE department_id IN (SELECT department_id FROM Departments WHERE location = 'New York');
     ```

<br>

3. **다중 열 서브쿼리**
   - 여러 열을 반환하는 서브쿼리
     ```sql
     # 특정 부서의 최대 급여와 해당 부서 ID를 찾을 때
     SELECT employee_name 
     FROM Employees 
     WHERE (department_id, salary) = (SELECT department_id, MAX(salary) FROM Employees GROUP BY department_id);
     ```

<br>

4. **상관 서브쿼리**
   - 주 쿼리의 각 행에 대해 서브쿼리가 실행되는 형태
     ```sql
     # 각 직원의 급여가 그 직원이 속한 부서의 평균 급여보다 높은지 확인할 때
     SELECT employee_name 
     FROM Employees e 
     WHERE salary > (SELECT AVG(salary) FROM Employees WHERE department_id = e.department_id);
     ```

<br>

## 서브 쿼리 - IN

- **`IN` 연산자**는 SQL에서 **값이 특정 목록이나 서브쿼리의 결과 집합에 포함되는지** 여부를 확인할 때 사용됩니다. 
- 이를 통해 여러 값을 한 번에 비교하거나, 서브쿼리를 사용하여 동적으로 값을 확인할 수 있습니다.

<br>

### `IN` 연산자의 기본 문법

```sql
column_name IN (value1, value2, ..., valueN)
```

- **`column_name`**: 비교할 컬럼 또는 표현식
- **`value1, value2, ..., valueN`**: 비교할 값 목록입니다. 목록은 정수, 문자열, 또는 서브쿼리의 결과로 구성될 수 있습니다

<br>

### 사용 목적

1. **여러 값에 대해 비교**: 
   - `IN` 연산자는 다수의 값에 대해 한 번에 조건을 검사할 수 있으므로, 반복적인 `OR` 조건문을 사용하지 않아도 됩니다.
   
2. **서브쿼리 결과와 비교**: 
   - `IN` 연산자는 서브쿼리와 결합하여, 동적으로 생성된 값 집합과 비교할 수 있습니다.

### **기본 예제**

```sql
SELECT *
FROM Employees
WHERE department_id IN (1, 2, 3);
```

- 설명: `department_id`가 **1, 2, 3 중 하나**일 경우 해당 행을 반환합니다.

<br>

### `IN`과 서브쿼리

- `IN`은 **서브쿼리**와 결합하여 동적으로 값을 비교할 수 있습니다. 서브쿼리는 다른 테이블이나 쿼리의 결과를 반환하는 데 사용되며, **동적인 값 집합**과 비교할 때 유용합니다.

- **서브쿼리 예제:**

```sql
# 설명: `Employees` 테이블에서 `department_id`가 **'Sales' 부서**에 속한 직원만 반환합니다.
SELECT *
FROM Employees
WHERE department_id IN (
    SELECT department_id
    FROM Departments
    WHERE department_name = 'Sales'
);
```

<br>

### **`NOT IN` 연산자**

- **`NOT IN`**은 `IN`과 반대로, **값이 목록에 포함되지 않은 경우** 해당 행을 반환합니다.

#### `NOT IN` 예제:

```sql
# 설명: `department_id`가 **1, 2, 3이 아닌** 모든 행을 반환합니다.
SELECT *
FROM Employees
WHERE department_id NOT IN (1, 2, 3);
```

<br>


### 다중 컬럼에 `IN` 사용

- SQL에서는 **튜플 비교**를 사용하여 **다중 컬럼**에 대해 `IN` 조건을 사용할 수 있습니다. 이를 통해 여러 컬럼을 함께 비교할 수 있습니다.
- **다중 컬럼 `IN` 예제:**

```sql
# 설명: `Employees` 테이블에서 `department_id`와 `job_id`의 조합이 `(1, 'IT_PROG')` 또는 `(2, 'SA_REP')`인 직원들을 반환합니다.
SELECT *
FROM Employees
WHERE (department_id, job_id) IN (
    (1, 'IT_PROG'),
    (2, 'SA_REP')
);
```

> 주의: **서브쿼리**를 사용하여 **다중 컬럼**을 비교하려면 **튜플 형식**으로 반환해야 합니다.

---

### **성능 고려사항**

`IN` 연산자를 사용할 때 몇 가지 성능 관련 사항을 고려해야 합니다.

1. **대상 목록 크기**:
   - **소규모 목록**: `IN` 연산자는 소규모 목록에 대해 매우 효율적입니다.
   - **대규모 목록**: 매우 큰 목록에 대해 `IN`을 사용할 경우, 성능 저하가 발생할 수 있습니다. **JOIN**을 사용하는 것이 더 효율적일 수 있습니다.

2. **서브쿼리** 성능:
   - **서브쿼리**를 사용할 때, 서브쿼리가 많은 데이터를 반환하거나 복잡할 경우 성능이 저하될 수 있습니다. 이때 **JOIN**을 사용하는 것이 성능을 개선할 수 있습니다.

<br>
