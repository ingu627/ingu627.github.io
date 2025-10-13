---
layout: single
title: "운영체제 5장: 프로세스 동기화 기법"
excerpt: "본 글은 (KOCW) 운영체제, 이화여자대학교 반효경 교수님의 강의를 듣고 개인 공부에 목적으로 내용을 요약 및 정리했습니다. <br> 또한 주니온 박사님의 운영체제 공룡책 강의를 듣고 내용을 보충했습니다."
categories: OS
tags: [OS, 운영체제, 프로세스, 동기화, race condition, synchronization, process, semaphores, deadlock, starvation, monitor, bounded-buffer, readers-writers, dining, pdf, 정리]
toc: true
toc_sticky: false
sidebar_main: false

last_modified_at: 2022-06-19
---

본 글은 (KOCW) 운영체제, 이화여자대학교 반효경 교수님의 강의를 듣고 내용을 요약 및 정리했습니다. <br> 개인 공부에 목적이 있으며, 자세한 사항은 <http://www.kocw.or.kr/home/cview.do?mty=p&kemId=1046323>에 참고하시면 됩니다. <br><br> Chapter 6. <br> - CPU Scheduling 2 / Process Synchronization 1 - 1시간 7분 <br> - Process Synchronization 1 - 28분 <br> - Process Synchronization 2 - 25분 <br> - Process Synchronization 3 - 1시간 2분 <br> - Process Synchronization 4 - 27분
{: .notice--info}

![image](https://user-images.githubusercontent.com/78655692/147717027-fcfaf167-79a5-4ce2-8d43-0801ef2df945.png)

<br>

- **프로세스 동기화** (또는 Concurrency Control (병행 제어) 라고도 부른다.)

## 데이터의 접근

<img src='https://user-images.githubusercontent.com/78655692/147719907-7a93e45e-724b-48c1-b06c-d92d1912ebeb.png' width=550>

<br>

## Race Condition

<img src='https://user-images.githubusercontent.com/78655692/147719954-4d6e8ae4-7de2-4e60-a506-f9dc50e6c421.png' width=600>

<br>

### OS에서 race condition은 언제 발생하는가?

*1.* kernel 수행 중 인터럽트 발생 시

<img src='https://user-images.githubusercontent.com/78655692/147720288-2f9e56b4-6163-40d5-a814-d51e29b3acc9.png' width=600>

- 커널모드 running 중 interrupt가 발생하여 인터럽트 처리루틴이 수행
  - 양쪽 다 커널 코드이므로 kernel address space 공유

<br>

*2.* Process가 system call을 하여 kernel mode로 수행 중인데 context switch가 일어나는 경우

<img src='https://user-images.githubusercontent.com/78655692/147720392-aa404672-eb8a-42c3-a03c-2b521be10bd2.png' width=600>

- 두 프로세스의 address space 간에는 data sharing이 없음
- 그러나 system call을 하는 동안에는 kernel address space의 data를 access하게 됨 (share)
- 이 작업 중간에 CPU를 preempt 해가면 race condition 발생

<img src='https://user-images.githubusercontent.com/78655692/147720551-ba185efb-a30e-4154-8ee3-1aa1dbef745d.png' width=600>

- 해결 : 커널 모드에서 수행 중일 때는 CPU를 preempt하지 않음. 커널 모드에서 사용자 모드로 돌아갈 때 preempt

<br>

*3.* Multiprocessor에서 shared memory 내의 kernel data

<img src='https://user-images.githubusercontent.com/78655692/147720583-2be40dd2-d05d-47ba-868b-72e5e214c41e.png' width=600>

- 어떤 CPU가 마지막으로 count를 store했는가? -> race condition
  - mutliprocessor의 경우 interrupt enable/disable로 해결되지 않음

- *해결1.* 한번에 하나의 CPU만이 커널에 들어갈 수 있게 하는 방법
- *해결2.* 커널 내부에 있는 각 공유 데이터에 접근할 때마다 그 데이터에 대한 lock / unlock을 하는 방법

<br>

## Process Synchronization 문제

- 공유 데이터의 동시 접근은 데이터의 불일치 문제를 발생시킬 수 있다.
- 일관성 유지를 위해서는 협력 프로세스 간의 실행 순서를 정해주는 메커니즘 필요
- **Race condition**
  - 여러 프로세스들이 동시에 공유 데이터를 접근하는 상황
  - 데이터의 최종 연산 결과는 마지막에 그 데이터를 다룬 프로세스에 따라 달라짐
- race condition을 막기 위해서는 concurrent process는 동기화(synchronization)되어야 한다.

<br>

## The Critical-Section Problem

- n 개의 프로세스가 공유 데이터를 동시에 사용하기를 원하는 경우
- 각 프로세스의 code segment에는 공유 데이터를 접근하는 코드인 critical section이 존재

<img src='https://user-images.githubusercontent.com/78655692/147720831-05a9c606-a04b-45ad-ba3b-d3b7d038e3e2.png' width=600>

<br>

## 프로그램적 해결법의 충족 조건

- **Mutual Exclusion** (상호 배제)
  - 프로세스 $Pi$가 critical section 부분을 수행 중이면 다른 모든 프로세스들은 그들의 critical section에 들어가면 안 된다.
- **Progress** (진행)
  - 아무도 critical section에 있지 않은 상태에서 critical section에 들어가고자 하는 프로세스가 있으면 critical section에 들어가게 해주어야 한다.
- **Bounded Waiting** (유한 대기)
  - 프로세스가 critical section에 들어가려고 요청한 후부터 그 요청이 허욜될 때까지 다른 프로세스들이 critical section에 들어가는 횟수에 한계가 있어야 한다.
- **가정**
  - 모든 프로세스의 수행 속도는 0보다 크다.
  - 프로세스들 간의 상대적인 수행 속도는 가정하지 않는다.

<br>

- 두 개의 프로세스가 있다고 가정 $P_0, P_1$
- 프로세스들의 일반적인 구조

```c
do {
    entry section
    critical section
    exit section
    remainder section
} while (1);
```

<br>

### Algorithm 1

- Synchronization variable
  - int turn;
  - initially turn =0;

- Process $P_0$
```c

do {
    while (turn !=0);
    critical section
    turn = 1;
    remainder section
} while (1);
```

<br>

### Algorithm 2

- Synchronization variable
  - boolean flag[2];
  - initially flag [모두] = false;
  - "$P_i$ ready to enter its critical section" if (flag [i] == true)
- Process $P_i$
```c
do {
    flag[i] = true;
    while (flag[i]);
    critical section
    flag [i] = false;
    remainder section
} while (1);
```

- 하지만 문제점으로 둘 다 2행까지 수행 후 끊임 없이 양보하는 상황 발생 가능
  - 눈치만 살피다가 못 들어가는 상황 발생

<br>

### Algorithm 3 (Peterson's Algorithm)

- 알고리즘 1, 2를 합침

```c
do {
    flag [i]=true;
    turn = j;
    while (flag [j] && turn ==j);
    critical section
    flag [i] = false;
    remainder section
} while (1);
```

- 3가지 조건 모두 충족
- 문제점 : (spin lock) 계속 CPU와 memory를 쓰면서 wait

<br>

## Synchronization Hardware

- 하드웨어적으로 Test & modify를 atomic하게 수행할 수 있도록 지원하는 경우 앞의 문제는 간단히 해결

![image](https://user-images.githubusercontent.com/78655692/147722063-63943279-e935-4fca-853c-a7b81447b3da.png)

<br>

- Mutual Exclusion with Test & Set

```c
Synchronization variable:
    boolean lock = false;

Process P_i
do {
    while (Test_and_Set(lock));
    critical section
    lock = false;
    remainder section
}
```

<br>

### Semaphores

- 앞의 방식들을 추상화시킴
- Semaphore S
  - 정수 변수
  - 아래의 두 가지 atomic 연산에 의해서만 접근 가능
  - `P(S)`: while (S$\le$0) do no-op; S--;
    - pos하면, decrement-&-enter
    - neg하면, pos될 때까지 기다린다. (busy-wait)
  - `V(S)`: S++;

<br>

### Critical Section of n Processes

Synchronization variable <br>
semaphore mutex; <br>

Process $P_i$
```c
do {
    P(mutex);
    critical section
    V(mutex);
    remainder section
} while (1);
```

- busy-wait는 효율적이지 못함 (=spin lock)
- Block & Wakeup 방식의 구현 (next page)

<br>

### Block / Wakeup Implementation

- Semaphore를 다음과 같이 정의

```c
typedef struct
{
    int value;
    struct process *L;
} semaphore;
```

- block과 wakeup을 다음과 같이 정의
  - `block` : 커널은 block을 호출한 프로세스를 suspend 시킴
  - `wakeup(P)` : block된 프로세스 P를 wakeup시킴<br> 이 프로세스의 PC를 ready queue로 옮김
  
  ![image](https://user-images.githubusercontent.com/78655692/147722668-c4697684-4f20-4daf-abb1-4277c2e4196a.png)

<br>

- P(S) : 자원을 획득하는 과정

```c
S.value--;
if (S.value < 0)
{
    add this process to S.L;
    block();
}
```

<br>

- V(S) : 자원을 반납하는 과정

```c
S.value++;
if (S.value <=0) {
    remove a process P from S.L;
    wakeup(P);
}
```

<br>

## Which is better?

- `Busy-wait` vs `Block/wakeup` <br>
- `Block/wakeup overhead` vs `Critical section` 길이
  - Critical section의 길이가 긴 경우 Block/Wakeup이 적당
  - Critical section의 길이가 매우 짧은 경우 Block/Wakeup 오버헤드가 busy-wait 오버헤드보다 더 커질 수 있음
  - 일반적으로는 Block/wakeup 방식이 더 좋음

<br>

### Two Types of Semaphores

- **Counting semaphore**
  - 도메인이 0 이상인 임의의 정수값
  - 주로 resource counting에 사용
- **Binary semaphore** (=mutex)
  - 0 또는 1 값만 가질 수 있는 semaphore
  - 주로 mutual exclusion (lock/unlock)에 사용

<br>

## Deadlock and Starvation

- **Deadlock** : 둘 이상의 프로세스가 서로 상대방에 의해 충족될 수 있는 event를 무한히 기다리는 현상

![image](https://user-images.githubusercontent.com/78655692/147723068-7473f2d1-6c99-4a43-a265-247b1df269da.png)

- **Starvation** : `indefinite blocking` 프로세스가 suspend된 이유에 해당하는 세마포어 큐에서 빠져나갈 수 없는 현상

<br>

## Classical Problems of Synchronization

### Bounded-Buffer Problem

<img src='https://user-images.githubusercontent.com/78655692/147731808-4154f55a-9e2b-4176-bcd4-651a05c0beb2.png' width=600>

- `Shared data`
  - buffer 자체 및 buffer 조작 변수(empty/full buffer의 시작 위치)
- `Synchronization variables`
  - mutual exclusion -> Need binary semaphore (shared data의 mutual exclusion을 위해)
  - resource count -> Need integer semaphore (남은 full/empty buffer의 수 표시)

<img src='https://user-images.githubusercontent.com/78655692/147732748-ec85c4d3-96b0-4d8f-8fa2-f017eb98c5e7.png' width=600>

<br>

### Readers-Writers Problem

- 한 process가 DB에 write 중일 때 다른 process가 접근하면 안됨
- `read`는 동시에 여럿이 해도 됨
- **해결책**
  - Writer가 DB에 접근 허가를 아직 얻지 못한 상태에서는 모든 대기중인 Reader들을 다 DB에 접근하게 해준다.
  - Writer는 대기 중인 Reader가 하나도 없을 때 DB 접근이 허용된다.
  - 일단 Writer가 DB에 접근 중이면 Reader들은 접근이 금지된다.
  - Writer가 DB에서 빠져나가야만 Reader의 접근이 허용된다.

<img src='https://user-images.githubusercontent.com/78655692/147734339-b83bdd40-e8f8-46ca-9b2c-e102952de3f6.png' width=600>

<img src='https://user-images.githubusercontent.com/78655692/147734372-fc8f3423-f8b7-4149-be99-231b0083ef87.png' width=600>

<br>

### Dining-Philosophers Problem

<img src='https://user-images.githubusercontent.com/78655692/147735789-5e8b2a5f-ea96-4dce-bcac-15d693c1a93f.png' width=600>

- 앞의 solution의 **문제점**
  - Deadlock 가능성이 있다.
  - 모든 철학자가 동시에 배가 고파져 왼쪽 젓가락을 집어버린 경우

<br>

- **해결책**
  - 4명의 철학자만이 테이블에 동시에 앉을 수 있도록 한다.
  - 젓가락을 두 개 모두 집을 수 있을 때에만 젓가락을 집을 수 있게 한다.
  - 비대칭
    - 짝수(홀수) 철학자는 왼쪽(오른쪽) 젓가락부터 집도록

<img src='https://user-images.githubusercontent.com/78655692/147736092-6f00d58a-17a3-4242-97e8-9057d30f8749.png' width=600>

<br>

## Monitor

- Semaphore의 **문제점**
  1. 코딩하기 힘들다.
  2. 정확성의 입증이 어렵다.
  3. 자발적 협력이 필요하다.
  4. 한번의 실수가 모든 시스템에 치명적 영향

- **Monitor** : 동시 수행중인 프로세스 사이에서 abstract data type의 안전한 공유를 보장하기 위한 high-level synchronization construct
  - Semaphore와 차이점은 lock를 걸 필요가 없다는 것

<br>

<img src='https://user-images.githubusercontent.com/78655692/147736966-e1d2b26f-ec1e-4f08-a33f-acc3bd474e90.png' width=600>

- 모니터 내에서는 한번에 하나의 프로세스만이 활동 가능
- 프로그래머가 동기화 제약 조건을 명시적으로 코딩할 필요 없음
- 프로세스가 모니터 안에서 기다릴 수 있도록 하기 위해
- Condition variable은 wait와 signal 연산에 의해서만 접근 가능
  - `x.wait();` : x.wait()을 invoke한 프로세스는 다른 프로세스가 x.signal()을 invoke하기 전까지 suspend된다.
  - `x.signal();` : x.signal은 정확하게 하나의 suspend된 프로세스를 resume한다.
    - Suspend된 프로세스가 없으면 아무 일도 일어나지 않는다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/147737191-4d5348c4-3d5c-4ab7-b416-6257870d6c2d.png' width=600>

<br>

<img src='https://user-images.githubusercontent.com/78655692/147737953-9379bfd8-339b-4ddc-b0fc-26c1bd3f740b.png' width=600>

<br>







