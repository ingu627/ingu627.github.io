---
layout: single
title: "OS Concepts 10th 4장: Threads & Concurrency"
excerpt: "본 글은 Operating System Concepts 10th (운영체제) 책을 보며 내용을 개인 공부에 목적으로 정리했습니다. 책 내용들을 최대한 이해하기 위해 거의 모든 내용을 담고 있습니다. 4. Threads & Concurrency"
categories: OS
tags: [OS, 운영체제, 정리, pdf, 프로세스, 스레드, lwp, 프로그램 카운터, 병행성, 병렬성, 동시성, 스택, 시그널, 인터리브, 다대일, 일대일, 다대다, 멀티스레드, 비동기, 동기, 암묵적 스레딩, 스레드 풀, fork join, openmp, gcd, fork, exec, 신호, 취소,]
toc: true
toc_sticky: false
sidebar_main: false

last_modified_at: 2022-09-01
redirect_from:
  - /OS/os4_10th/
---

<img align='right' width='150' height='200' src='https://user-images.githubusercontent.com/78655692/184343886-e144daea-afbd-43b6-90f9-1638c89a089c.png'>
본 글은 Operating System Concepts 10th (운영체제) 책을 보며 내용을 개인 공부에 목적으로 정리했습니다.<br> 이전에 운영체제 관련 강의들을 들으면서 정리한 시리즈 글들이 있는데, <br> 지식을 습득하는 데 있어 가장 느리지만 가장 빠른 방법이 원본책을 자세히 보는 것이라 생각됩니다. <br> 책 내용들을 최대한 이해하기 위해 거의 모든 내용을 담고 있습니다. <br><br> 책 pdf 링크 : [Operating System Concepts 10th Edition by Abraham Silberschatz Peter B Galvin Greg Gagne pdf free download](https://www.booksfree.org/operating-system-concepts-10th-edition-by-abraham-silberschatz-peter-b-galvin-greg-gagne-pdf/) <br> 연습 문제 정답지 : [Solutions of Practice Exercises, Tenth Edition of Operating System Concepts, AVI SILBERSCHATZ](https://codex.cs.yale.edu/avi/os-book/OS10/practice-exercises/index-solu.html)
{: .notice--info}

<br>

## 4. Threads & Concurrency

- 현대 운영체제는 한 프로세스가 멀티 스레드를 포함하는 특성을 제공한다.

<br>

- **목표**
  - 스레드의 기본 구성요소를 식별하고 스레드와 프로세스를 대조한다.
  - 멀티 스레드 프로세스를 설계할 때의 주요 이점과 중대한 과제를 설명한다.
  - 스레드 풀, 포크 조인 및 그랜드 센트럴 디스패치를 포함하여 암시적 스레딩에 대한 다양한 접근 방식을 설명한다.
  - Windows 및 Linux 운영체제가 스레드를 어떻게 나타내는지 설명한다.
  - Pthread, Java 및 Windows 스레딩 API를 사용하여 멀티 스레드 응용 프로그램을 설계한다.

<br>

## 4.1 Overview

- 스레드(thread)는 CPU 이용률(utilization)의 기본 단위이다.
- 스레드는 스레드 ID, 프로그램 카운터(PC), 레지스터 집합, 그리고 스택(stack)으로 구성된다.
- 스레드는 같은 프로세스에 속한 다른 스레드와 코드(code), 데이터(data), 오픈 파일이나 시그널(signal)같은 운영체제 자원들을 공유한다.
  - **시그널(signal)** : 프로세스에게 전달되는 특정 정보를 포함하고 있는 신호이다. [^1]
- 만일 프로세스가 다수의 제어 스레드를 가진다면, 프로세스는 동시에 하나 이상의 작업을 수행할 수 있다.

![image](https://user-images.githubusercontent.com/78655692/184846454-cf921b1d-811c-4053-b124-c6eb9eeae860.png)

<br>

### 4.1.1 Motivation

![image](https://user-images.githubusercontent.com/78655692/184856455-58785e5c-e46e-48aa-b49d-f0ae82f9fbeb.png)

- 한 예시로, 웹 서버는 클라이언트로부터 웹 페이지나 이미지, 소리 등에 대한 요청을 받는다.
- 하나의 분주한 웹 서버는 여러 개의 클라이언트들이 동시(concurrent)에 접근할 수 있다.
- 이때, 별도의 프로세스를 생성하기 보다는 프로세스 안에 여러 스레드를 만들어 나가는 것이 더 효율적이다.
- 요청(request)이 들어오면 다른 프로세스를 생성하는 것이 아니라, 요청을 서비스할 새로운 스레드를 생성하고 추가적인 요청을 listen 하기 위한 작업을 재개한다.
  - **listen()** : 클라이언트의 연결 요청을 받을 수 있는 상태를 만드는 함수 [^2]

<br>

### 4.1.2 Benefits

1. **응답성(responsiveness)** : 인터랙티브 애플리케이션을 멀티 스레드화하면 애플리케이션의 일부분이 블록되거나, 애플리케이션이 긴 작업을 수행하더라도 프로그램의 수행이 계속되는 것을 허용함으로써, 사용자에 대한 응답성을 증가시킨다.
2. **자원 공유(resource sharing)** : 프로세스는 공유 메모리와 메시지 전달 기법을 통하여만 자원을 공유할 수 있다. 그러나 스레드는 자동으로 그들이 속한 프로세스의 자원들과 메모리를 공유한다.
3. **경제성(economy)** : 프로세스 생성을 위해 메모리와 자원을 할당하는 것은 비용이 많이 든다. 스레드는 자신이 속한 프로세스의 자원들을 공유하기 때문에, 스레드를 생성하고 문맥 교환(context switch)하는 것이 더욱더 경제적이다.
   - 문맥 교환은 일반적으로 프로세스 사이보다 스레드 사이에서 더 빠르다.
4. **확장성(scalability)** : 멀티 프로세서 구조에서는 각각의 스레드가 다른 프로세스에서 병렬로 수행할 수 있기 때문에 이 구조에서 스레드는 더 증가할 수 있다.

<br>

## 4.2 Multicore Programming

![image](https://user-images.githubusercontent.com/78655692/184865709-b11080ee-39e0-4182-8115-ca836ee624e4.png)

- Figure 4.3같이 스레드가 4개인 애플리케이션을 고려해본다.
- 싱글 컴퓨팅 코어가 있는 시스템에서는 단지 처리 코어(processing core)가 한 번에 하나의 스레드만 실행할 수 있기 때문에 동시성(concurrency)은 시간이 지남에 따라 스레드 실행이 인터리브(interleaved)됨을 의미한다.
  - **인터리브(interleaved)** : 두 작업이 여러 단계로 구성되며 단계의 순서가 겹치는 것을 의미한다. [^3]

<br>

![image](https://user-images.githubusercontent.com/78655692/184867326-d6970c41-61df-47be-ae9d-68e383263ccc.png)

- 하지만 여러 코어가 있는 시스템에서 동시성은 시스템이 각 코어에 별도의 스레드를 할당할 수 있기 때문에 일부 스레드가 병렬(parallel)로 실행될 수 있음을 의미한다.

<br>

### 동시성(concurrency) vs 병렬성(parallelism)

![image](https://user-images.githubusercontent.com/78655692/184867890-2d579084-ec22-4060-b702-2a87969cd146.png) <br> 이미지출처 [^4]

- 동시(concurrency) 시스템은 모든 작업이 진행되게 하여 둘 이상의 작업을 지원한다.
  - 동시에 실행되는 것처럼 보이는 것을 말한다. [^5]
  - CPU 스케줄러는 프로세스 간에 빠르게 전환해 각 프로세스가 진행되도록 하여 병렬성처럼 보인다.
  - 즉, 싱글 코어에서 멀티 스레드를 동작시키기 위한 방식
- 병렬(parallelism) 시스템은 둘 이상의 작업을 동시에 수행할 수 있다.
  - 실제로 동시에 작업이 처리가 되는 것을 말한다. [^5]
  - 멀티 코어에서 멀티 스레드를 동작시키기 위한 방식

<br>

### 4.2.1 Programming Challenges

- 멀티 코어 시스템을 위해 프로그래밍하기 위해서는 5개의 극복해야 할 도전 과제가 있다. 

1. **태스크 인식(identifying tasks)** : 애플리케이션을 검사하여 독립된 동시 가능한 태스크로 나눌 수 있는 영역을 찾는 작업이 필요하다.
2. **균형(balance)** : 병렬로 실행될 수 있는 테스크를 찾아내는 것도 중요하지만 찾아진 부분들이 전체 작업에 균등한 기여도를 가지도록 태스크로 나누는 것도 중요하다.
3. **데이터 분리(data spliting)** : 애플리케이션이 독립된 태스크로 나누어지는 것처럼, 태스크가 접근하고 조작하는 데이터 또한 개별 코어에서 사용할 수 있도록 나누어져야(split) 한다.
4. **데이터 종속성(data dependency)** : 태스크가 접근하는 데이터는 둘 이상의 태스크 사이에 종속성이 없는지 검토되어야 한다.
5. **시험 및 디버깅(testing and debugging)** : 프로그램이 멀티 코어에서 병렬로 실행될 대, 다양한 실행 경로가 존재할 수 있다.

<br>

### 4.2.2 Types of Parallelism

![image](https://user-images.githubusercontent.com/78655692/184872053-3aa9c035-bba2-4b85-bc3c-a956753cb4ce.png)

- 일반적으로 데이터 병렬성(data parallelism)과 태스크 병렬성(task parallelism) 2가지 유형이 있다.
- 데이터 병렬성은 동일한 데이터의 부분집합을 여러 계산 코어에 분배한 뒤 각 코어에서 동일한 연산을 실행하는 데 초점을 맞춘다.
  - 즉, 전체 데이터를 멀티 코어의 수만큼 쪼개서 각 데이터들을 분리된 스레드에서 병렬 처리 [^6]
- 태스크 병렬성은 태스크(스레드)를 다수의 코어에 분배한다. 각 스레드는 고유의 연산을 실행한다.
  - 다른 스레드들이 동일한 데이터에 대해 연산을 실행할 수 있고 혹은 서로 다른 데이터에 연산을 실행할 수도 있다.
  - 서로 다른 작업들을 병렬 처리 [^6]

<br>

## 4.3 Multithreading Models

- 스레드를 위한 지원은 사용자 스레드(user threads)와 커널 스레드(kernel threads)가 있다.
- 사용자 스레드는 커널 위에서 지원되며 커널의 지원없이 관리된다.
- 반면 커널 스레드는 운영체제에 의해 직접 지원되고 관리된다.

![image](https://user-images.githubusercontent.com/78655692/185024969-c9105676-7d3f-4324-ac9f-a75db175eb14.png)

- 사용자 스레드와 커널 스레드는 어떤 연관 관계가 존재해야 한다.
- 이 연관 관계를 확립하는 3가지 방법인 다대일(many-to-one), 일대일(one-to-one), 다대다(many-to-many) 모델을 살펴본다.

<br>

### 4.3.1 Many-to-One Model

![image](https://user-images.githubusercontent.com/78655692/185025245-aa24b468-a635-4477-97a1-638b29999078.png)

- 다대일 모델은 많은 사용자 수준 스레드를 하나의 커널 스레드로 사상(map)한다. 
- 스레드 관리는 사용자 공간의 스레드 라이브러리에 의해 행해진다.
- 하지만, 한 스레드가 블록 시스템 콜을 할 경우, 전체 프로세스가 블록된다. 
- 또한, 한 번에 하나의 스레드만이 커널에 접근할 수 있기 때문에, 멀티 스레드가 멀티 코어 시스템에서 병렬로 실행될 수 없다.

<br>

### 4.3.2 One-to-One Model

![image](https://user-images.githubusercontent.com/78655692/185026564-54441604-512b-4ebe-a021-5689f2259b1c.png)

- 일대일 모델은 각 사용자 스레드를 하나의 커널 스레드로 사상(map)한다.
- 이 모델은 하나의 스레드가 블록 시스템 콜을 호출하더라도 다른 스레드가 실행될 수 있기 때문에 다대일보다 더 많은 병렬성을 제공한다.
- 이 모델은 하나의 스레드가 블록 시스템 콜을 호출하더라도 다른 스레드가 실행될 수 있기 때문에 다대일 모델보다 더 많은 병렬성을 제공한다.
- 이 모델의 단점은 사용자 스레드를 만들려면 해당 커널 스레드를 만들어야 하며 많은 수의 커널 스레드가 시스템 성능에 부담을 줄 수 있다.

<br>

### 4.3.3 Many-to-Many Model

![image](https://user-images.githubusercontent.com/78655692/185027143-3a44c542-71a8-474a-93bd-ef1b6e4689bb.png)

- 다대다 모델은 여러 개의 사용자 수준 스레드를 그보다 작은 수, 혹은 같은 수의 커널 스레드로 멀티플렉스(multiplex)한다.
- 다대일 모델에서 개발자는 필요한 만큼 많은 사용자 수준 스레드를 생성할 수 있다.
- 그리고 상응하는 커널 스레드가 멀티 프로세서에서 병렬로 수행될 수 있다.
- 또한, 스레드가 블록 시스템 콜을 발생시켰을 때 커널이 다른 스레드의 수행을 스케줄할 수 있다.

<br>

![image](https://user-images.githubusercontent.com/78655692/185027922-505c9e21-b1e2-40a0-8392-fcc3b3492352.png)

- 두 수준 모델(two-level model)은 다대다 모델의 변형으로 많은 사용자 스레드를 적거나 같은 수의 커널 스레드로 멀티플렉스 시키지만 또한 한 사용자 스레드가 하나의 커널 스레드에만 연관되는 것을 허용한다.
- 하지만, 실제로는 구현하기 어렵고 대부분의 시스템에서 처리 코어 수가 증가함에 따라 커널 스레드 수를 제한하는 것의 중요성이 줄어들었다.

<br>

- 결과적으로 대부분의 운영체제는 이제 일대일 모델을 사용한다.

<br>

## 4.4 Threads Library

- 스레드 라이브러리(threads library)는 프로그래머에게 스레드를 생성하고 관리하기 위한 API를 제공한다.
- 스레드 라이브러리를 구현하는 데에는 주된 2가지 방법이 있다.

1. 커널의 지원없이 완전히 사용자 공간에서만 라이브러리를 제공하는 것이다.
   - 라이브러리를 모든 코드와 자료구조는 사용자 공간에 존재한다.
   - 라이브러리의 함수를 호출하는 것은 시스템 콜이 아니라 사용자 공간의 지역 함수를 호출하게 된다.
2. 운영체제에 의해 지원되는 커널 수준 라이브러리를 구현하는 것이다.
   - 이 경우, 라이브러리를 위한 코드와 자료구조는 커널 공간에 존재한다.
   - 라이브러리 API를 호출하는 것은 커널 시스템 콜을 부르는 것이다.

<br>

- **비동기 스레딩(asynchronous threading)**은 부모가 자식 스레드를 생성한 후 부모는 자신의 실행을 재개하여 부모와 자식 스레드가 서로 독립적으로 동시(concurrent)에 실행된다.
  - 스레드가 독립적이기 때문에 스레드 사이의 데이터 공유는 거의 없다.
- **동기 스레딩(synchronous threading)**은 부모 스레드가 하나 이상의 자식 스레드를 생성하고 자식 스레드 모두가 종료할 때까지 기다렸다가 자신의 실행을 재개하는 방식을 말한다.
  - 여기서 부모가 생성한 스레드는 동시에 실행되지만 부모는 자식들의 작업이 끝날 때까지 실행을 계속할 수 없다.
  - 부모 스레드는 오직 모든 자신 스레드가 조인한 후에야  실행을 재개할 수 있다.
  - 동기 스레딩은 스레드 사이의 상당한 양의 데이터 공유를 수반한다.

<br>

### 4.4.1 Java Thread

- 생략한다.


<br>

## 4.5 Implicit Threading

- **암묵적 스레딩(Implicit Threading)**은 스레딩의 생성과 관리 책임을 응용 개발자로부터 컴파일러와 실행시간 라이브러리에게 넘겨주는 것을 말한다.
  - vs **명시적 스레딩(Explicit Threading)** : 개발자에게 API를 줘서 직접 스레드를 관리 하게 한다.
- 이 절에서는 암묵적 스레딩을 이용하여 멀티 코어 프로세서를 활용할 수 있는 응용 프로그램을 설계하는 4가지 접근법을 살펴본다.
  - 이러한 전략은 일반적으로 응용 프로그램 개발자가 병렬로 실행할 수 있는 스레드가 아닌 태스크를 식별해야 한다.
  - 태스크(task)는 일반적으로 함수로 작성되며, 런타임 라이브러리는 일반적으로 다대다 모델을 사용하여 별도의 스레드에 매핑된다.

<br>

### 4.5.1 Thread Pools

- 멀티 스레드 서버는 여러 문제가 있다.

  1. 서비스할 때 스레드를 생성하는 데 소요되는 시간
  2. 모든 요청마다 새 스레드를 만들어서 서비스해 준다면 시스템에서 동시에 실행할 수 있는 최대 스레드 수가 몇 개까지 가능할 수 있는 것인지 한계를 정해야 한다.

<br>

- **스레드 풀(thread pool)**은 스레드를 무한정 늘리면 자원이 고갈되는 문제를 해결하기 위해 프로세스를 시작할 때 일정한 수의 스레드들을 미리 풀로 만들어두는 것이다.
  - 서버는 스레드를 생성하지 않고 요청을 받으면 대신 스레드 풀에 제출하고 추가 요청 대기를 재개한다.
  - 풀에 사용 가능한 스레드가 있으면 깨어나고 요청이 즉시 서비스된다.
  - 스레드가 서비스를 완료하면 풀로 돌아가서 더 많은 작업을 기다린다.
  - 풀에 제출된 작업을 비동기적으로 실행할 수 있는 경우 스레드 풀이 제대로 작동한다.

<br>

- 스레드 풀에 있는 스레드의 개수는 CPU 수, 물리 메모리 용량, 동시 요청 클라이언트 최대 개수 등을 고려하여 정해질 수 있다.

<br>

### 4.5.2 Fork Join

- **fore-join** 메소드를 사용하면 메인 부모 스레드가 하나 이상의 자식 스레드를 생성(fork)한 다음 자식의 종료를 기다린 후 join하고 그 시점부터 자식의 결과를 확인하고 결합할 수 있다.

![image](https://user-images.githubusercontent.com/78655692/185182835-4d29ac33-70fb-4b1f-a25b-3579ea0dab48.png)

<br>

### 4.5.3 OpenMP

- OpenMp는 C, C++, 도는 FORTRAN으로 작성된 API와 컴파일러 디렉티브의 집합이다.
- OpenMP는 공유 메모리 환경에서 병렬 프로그래밍을 할 수 있도록 도움을 준다. 
- OPenMP는 병렬로 실행될 수 있는 블록을 찾아 병렬 영역(parallel regions)이라고 부른다.
- 응용 개발자는 자신들의 코드 중 병렬 영역에 컴파일러 디렉티브를 삽입한다. 
- 이 디렉티브는 OpenMP 실행시간 라이브러리에 해당 영역을 병렬로 실행하라고 지시한다.

<br>

### 4.5.4 Grand Central Dispatch

- Grand Central Dispatch (GCD)는 macOS 및 iOS 운영체제를 위해 애플에서 개발한 기술이다.
- 개발자가 병렬로 실행될 코드 섹션(태스크)을 식별할 수 있도록 하는 런타임 라이브러리, API 및 언어 확장의 조합이다. 
  - 스레딩에 대한 대부분의 세부 사항을 관리한다.
- GCD는 실행시간 수행을 위해 태스크를 디스패치 큐(dispatch queue)에 넣어서 스케줄한다.
- 큐에서 태스크를 제거할 때 관리하는 스레드 풀에서 가용 스레드를 선택하여 태스크를 할당한다.

<br>

## 4.6 Threading Issues

### 4.6.1 The fork() and exec() System Calls

- 만약 한 프로그램의 스레드가 fork()를 호출하면 새로운 프로세스는 모든 스레드를 복제해야 하는지 한 개의 스레드만 가지는 프로세스여야 하는지가 각각 있다.
- 두 버전의 fork() 중 어느 쪽을 택할 것인지는 응용 프로그램에 달려 있다.

<br>

### 4.6.2 Signal Handling

- **신호(signal)**은 UNIX에서 프로세스에 어떤 이벤트가 일어났음을 알려주기 위해 사용된다.
  - 신호는 알려줄 이벤트의 소스나 이유에 따라 동기식(synchronously) 또는 비동기식(asynchronously)으로 전달될 수 있다.
- 모든 신호는 다음과 같은 형태로 전달된다.

  1. 신호는 특정 이벤트가 일어나야 생성된다.
  2. 생성된 신호가 프로세스에 전달된다.
  3. 신호가 전달되면 반드시 처리되어야 한다.

<br>

- 멀티 스레드 프로그램에서의 신호 처리로 다음과 같은 선택이 존재한다.

  1. 신호가 적용될 스레드에게 전달한다.
  2. 모든 스레드에 전달한다.
  3. 몇몇 스레드들에만 선택적으로 전달한다.
  4. 특정 스레드가 모든 신호를 전달받도록 지정한다.

<br>

### 4.6.3 Thread Cancellation

- **스레드 취소(thread cancellation)**는 스레드가 끝나기 전에 그것을 강제 종료시키는 작업을 말한다.
  - ex. 여러 스레드가 데이터베이스를 병렬로 검색하고 있다가 그 중 한 스레드가 결과를 찾았다면 나머지 스레드는 취소되어도 된다.
- 취소되어야 할 스레드를 **타켓 스레드(target thread)**라 한다.
- 타겟 스레드의 취소는 2가지 방식으로 발생할 수 있다.

  1. **비동기식 취소(asynchronous cancellation)** : 한 스레드가 즉시 타겟 스레드를 강제 종료시킨다.
  2. **지연 취소(deferred cancellation)** : 타겟 스레드가 주기적으로 자신이 강제 종료되어야 할지를 점검한다.

![image](https://user-images.githubusercontent.com/78655692/185282435-40becd72-a1a5-4b36-8c45-988aedbedce5.png)

<br>

### 4.6.4 Thread-Local Storage

- 한 프로세스에 속한 스레드들은 그 프로세스의 데이터를 모두 공유한다.
- 그러나 상황에 따라서는 각 스레드가 자기만 액세스할 수 있는 데이터를 가져야 할 필요가 있는데 그러한 데이터를 **스레드-로컬 저장장치(thread-local storage, TLS)**라 부른다.

<br>

### 4.6.5 Scheduler Activations

- 다대다 또는 두 수준 모델을 구현하는 많은 시스템은 사용자와 커널 스레드 사이에 중간 자료구조를 둔다.
  - 이 자료구조를 **경량 프로세스(lightweight process)** 또는 **LWP**라 부른다.

![image](https://user-images.githubusercontent.com/78655692/185284558-e6b599d4-347b-4640-b1a7-0539fe47ec3c.png)

- 각 LWP는 하나의 커널 스레드에 부속되어 있으며 물리 프로세서에서 스케줄 하는 대상은 이 커널 스레드이다.
- 입출력이 완료되기를 기다리는 동안 같이 커널 스레드가 블록되면 LWP도 같이 블록된다.
  - 이 연관을 따라 LWP에 부속된 사용자 수준 스레드도 역시 블록된다.


<br>

## References

[^1]: [프로세스 사이의 통신 - 시그널 - 이동욱](https://dongwooklee96.github.io/post/2021/08/14/%ED%94%84%EB%A1%9C%EC%84%B8%EC%8A%A4-%EC%82%AC%EC%9D%B4%EC%9D%98-%ED%86%B5%EC%8B%A0-%EC%8B%9C%EA%B7%B8%EB%84%90.html)
[^2]: [Listen() 서버 - kazal92](https://jun92.tistory.com/16)
[^3]: [동시성(Concurrency) Synchronization - 폭간의 기술블로그](https://sejoung.github.io/2019/03/2019-03-25-Lesson_Concurrency_3/#Thread-Interference)
[^4]: [code project - concurrency vs Paralleism by Shivprasad koirala](https://www.codeproject.com/Articles/1267757/Concurrency-vs-Parallelism)
[^5]: [병행성(Concurrency)와 병렬성(Parallelism)의 차이에 대해](https://nesoy.github.io/articles/2018-09/OS-Concurrency-Parallelism)
[^6]: [동시성(Concurrency)과 병렬성(Parallelism) - 주멘이](https://knoc-story.tistory.com/3)