---
layout: single
title: "스파크 데이터소스 옵션 총정리: 꼭 알아야 할 설정"
excerpt: "Spark The Definitive Guide 책을 중심으로 스파크를 요약 및 정리해보았습니다. 데이터 소스에 대한 모드, 옵션들을 알아봅니다."
categories: spark
tags: [스파크, spark, 파이썬, 스칼라, scala, 정리, 의미, 실습, 읽기, 쓰기, read, write, csv, json, parquet, sql, format, option, jdbc, 파일]
toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2022-09-09
---

<img align='right' width='150' height='200' src='https://user-images.githubusercontent.com/78655692/186088421-fe905f9e-d40f-43b2-ac6e-094e9c342473.png'>
[Spark The Definitive Guide - BIG DATA PROCESSING MADE SIMPLE] 책을 중심으로 스파크를 개인 공부를 위해 요약 및 정리해보았습니다. <br> 다소 복잡한 설치 과정은 도커에 미리 이미지를 업로해 놓았습니다. 즉, 도커 이미지를 pull하면 바로 스파크를 사용할 수 있습니다. <br><br> 도커 설치 및 활용하는 방법 : [[Spark] 빅데이터와 아파치 스파크란 - 1.2 스파크 실행하기](https://ingu627.github.io/spark/spark_db1/#12-%EC%8A%A4%ED%8C%8C%ED%81%AC-%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0) <br> 도커 이미지 링크 : [https://hub.docker.com/r/ingu627/hadoop](https://hub.docker.com/r/ingu627/hadoop) <br> 예제를 위한 데이터 링크 : [FVBros/Spark-The-Definitive-Guide](https://github.com/ingu627/BigData/tree/master/spark/data) <br> 예제에 대한 실행 언어는 스칼라(scala)로 했습니다. <br> 앞으로 스파크와 관련된 내용은 딥러닝 부분을 제외하고 스칼라로 진행될 예정입니다.
{: .notice--info}
**기본 실행 방법** <br> 1. 예제에 사용 될 데이터들은 도커 이미지 생성 후 `spark-3.3.0` 안의 하위 폴더 `data`를 생성 후, 이 폴더에 추가합니다. <br> 1.1 데이터와 도커 설치 및 활용하는 방법은 위에 링크를 남겼습니다. <br> 2. 프로그램 시작은 `cd spark-3.3.0` 후, `./bin/spark-shell` 명령어를 실행하시면 됩니다.
{: .notice--danger} 

<br>
<br>

## 1. 데이터소스 모드, 설명

- 이 내용은 이전 글인 [[Spark] CSV, JSON, Parquet, ORC 데이터소스 읽고 쓰는 방법](https://ingu627.github.io/spark/spark_db13/) 에 대한 데이터소스 모드와 설명을 따로 정리한 글이다.
- 그때그때 참고하면 될 것 같다.

<br>

## 2. 읽기 모드

- 외부 데이터소스에서 데이터를 읽다 보면 자연스럽게 형식에 맞지 않는 데이터를 만나게 된다.
  - 특히 반정형 데이터소스를 다룰 때 많이 발생한다.
- **읽기 모드(read mode)**는 스파크가 형식에 맞지 않는 데이터를 만났을 때의 동작 방식을 지정하는 옵션이다.
  - **default** : `permissive`

![image](https://user-images.githubusercontent.com/78655692/189401291-272d765c-b0c2-4771-bf13-614f096d0ac9.png)

<br>

## 3. 저장 모드

- **저장 모드(write mode)**는 스파크가 지정된 위치에서 동일한 파일이 발견했을 때의 동작 방식을 지정하는 옵션이다.
  - **default** : `errorIfExists`

![image](https://user-images.githubusercontent.com/78655692/189403642-fa13baf7-636b-453c-9a40-679c601ece82.png)

<br>

## 4. CSV 옵션

- CSV는 각 줄이 단일 레코드가 되며 레코드의 각 필드를 콤마로 구분하는 일반적인 텍스트 파일 포맷이다.
- CSV 파일은 정형으로 보이지만, 사실 매우 가다로운 파일 포맷 중 하나이다.
  - 그 이유는 운영 환경에서는 어떤 내용이 들어 있는지, 어떠한 구조로 되어 있는지 등 다양한 전제를 만들어낼 수 없기 때문이다.
- 때문에 CSV reader는 많은 수의 옵션을 제공한다.

![image](https://user-images.githubusercontent.com/78655692/189405617-6d7680dd-6398-4130-b451-516902840e45.png)

![image](https://user-images.githubusercontent.com/78655692/189405807-79ba3d34-0801-46f2-ad6d-3dc705e638d3.png)

<br>

## 5. JSON 옵션

- **JSON(JavaScript Object Notation)**은 자바스크립트에서 온 파일 형식들인 즉, 자바스크립트 객체 표기법이다. 
- JSON은 객체이기 때문에 CSV보다 옵션 수가 적다.

- **Table 9-4. JSON data source options**
  - 책에서는 설명 부분이 잘렸기 때문에 이 부분만 마크다운으로 작성했다.

|**Read/Write**|**Key**|**Potential values**|**Default**|**Description**|
|---|---|---|---|---|
|`Both`|`compression or codec`|`None, uncompressed, bzip2, deflate, gzip, lz4, or snappy` | `none` | Declares what compression codec Spark should use to read or write the file.|
|`Both`|`dateFormat`|Any string or character that conforms to Java’s SimpleDataFormat. | `yyyy-MM-dd` | Declares the date format for any columns that are date type. |
|`Both`|`timestampFormat`| Any string or character that conforms to Java’s SimpleDataFormat. | `yyyy-MM-dd’T’HH:​mm:ss.SSSZZ` | Declares the timestamp format for any columns that are timestamp type. |
|`Read`| `primitiveAsString` | `true,false` | `false` | Infers all primitive values as string type. |
|`Read`| `allowComments` | `true,false` | `false` | Ignores Java/C++ style comment in JSON records. |
|`Read` | `allowUnquotedFieldNames` | `true,false` | `false` | Allows unquoted JSON field names |
|`Read` | `allowSingleQuotes` | `true,false` | `true` | Allows single quotes in addition to double quotes. |
|`Read` | `allowNumericLeadingZeros` | `true,false` | `false` | Allows leading zeroes in numbers (e.g., 00012) |
|`Read` | `allowBackslashEscapingAnyCharacter` | `true,false` | `false` | Allows accepting quoting of all characters using backslash quoting mechanism |
|`Read` | `columnNameOfCorruptRecord` | Any String | Value of `spark.sql.column&NameOfCorruptRecord` | Allows renaming the new field having a malformed string created by permissive mode. This will override the configuration value. |
|`Read` | `multiLine` | `true,false` | `false` | Allows for reading in non-line-delimited JSON files. |

<br>

## 6. 파케이 옵션

- **파케이(parquet)**는 다양한 스토리지 최적화 기술을 제공하는 오픈소스로 만들어진 컬럼 기반의 데이터 저장 방식이다.
- 파케이는 옵션이 거의 없다.
- 단 2개의 옵션만 존재하는 이뉴느 스파크의 개념에 아주 잘 부합하고 알맞게 정의된 명세를 가지고 있기 때문이다.

![image](https://user-images.githubusercontent.com/78655692/189415935-80c73d3c-d0dd-4218-9085-82820784709d.png)

<br>

## 7. JDBC 옵션

- JDBC는 자바에서 데이터베이스에 접속할 수 있도록 하는 자바 API이다. [^1]
  - JDBC는 데이터베이스에서 자료를 쿼리하거나 업데이트하는 방법을 제공한다. 

![image](https://user-images.githubusercontent.com/78655692/189421296-5a1ef9d8-cfcd-4c4a-8bba-15b4c45aa1de.png)

![image](https://user-images.githubusercontent.com/78655692/189421344-8d65741e-e4a0-4798-bcff-6a059d5cf7fe.png)



<br>
<br>
<br>
<br>

## References

[^1]: [JDBC - 위키백과](https://ko.wikipedia.org/wiki/JDBC)