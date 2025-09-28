---
layout: single
title: "운영체제 10장: 디스크 관리·스케줄링"
excerpt: "본 글은 (KOCW) 운영체제, 이화여자대학교 반효경 교수님의 강의를 듣고 개인 공부에 목적으로 내용을 요약 및 정리했습니다. <br> 또한 주니온 박사님의 운영체제 공룡책 강의를 듣고 내용을 보충했습니다."
categories: OS
tags: [OS, 운영체제, 파일시스템, system, RAID, disk, scheduling, fcfs, scan, c-scan,Swap, raid, parallel, pdf, 정리]
toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2022-06-09
---

본 글은 (KOCW) 운영체제, 이화여자대학교 반효경 교수님의 강의를 듣고 내용을 요약 및 정리했습니다. <br> 개인 공부에 목적이 있으며, 자세한 사항은 <http://www.kocw.or.kr/home/cview.do?mty=p&kemId=1046323>에 참고하시면 됩니다. <br><br> Chapter 11. <br> - Disk Management & Scheduling 1 - 35분 <br> - Disk Management & Scheduling 2 - 9분 
{: .notice--info}

![image](https://user-images.githubusercontent.com/78655692/147717027-fcfaf167-79a5-4ce2-8d43-0801ef2df945.png)

<br>

## Disk Structure

- **logical block**
  - 디스크의 외부에서 보는 디스크의 단위 정보 저장 공간들
  - 주소를 가진 1차원 배열처럼 취급
  - 정보를 전송하는 최소 단위
- **Sector**
  - Logical block이 물리적인 디스크에 매핑된 위치
  - Sector 0은 최외각 실린더의 첫 트랙에 있는 첫 번째 섹터이다.

<br>

## Disk Scheduling

<img src='https://user-images.githubusercontent.com/78655692/172834544-454c1949-0a6b-4b9e-af5d-3a8801b93993.png' width=500>

- **Access time**의 구성
  - **Seek time** : 장치 arm이 헤드(head)를 움직이는데, 특정 실린더(cylinder)의 특정 섹터(sector)로 움직이는 데 걸리는 시간
    - Seek time = seek distance
  - **Rotational latency** : 헤드가 원하는 섹터에 도달하기까지 걸리는 회전지연시간
  - **Transfer time** : 실제 데이터의 전송 시간
- **Disk bandwidth** : 단위 시간 당 전송된 바이트의 수
- **Disk Scheduling** : seek time을 최소화하고, 데이터 전송의 대역폭(bandwidth)을 최대화하는 것이 목표
  
<br>

## Disk Management

- **physical formatting** (Low-level foramtting)
  - 디스크를 컨트롤러가 읽고 쓸 수 있도록 섹터들로 나누는 과정
  - 각 섹터는 header + 실제 data(보통 512 bytes) + trailer로 구성
  - header와 trailer는 sector number, ECC (Error-Correcting Code) 등의 정보가 저장되며 controller가 직접 접근 및 운영
- **Partitioning**
  - 디스크를 하나 이상의 실린더 그룹으로 나누는 과정
  - OS는 이것을 독립적 disk로 취급 (logical disk)
- **Locgical formatting**
  - 파일시스템을 만드는 것
  - FAT, inode, free space 등의 구조 포함
- **Booting**
  - ROM에 있는 "small bootstrap loader"의 실행
  - sector 0 (boot block)을 load하여 실행
  - sector 0은 "full Bootstrap loader program"
  - OS를 디스크에서 load하여 실행

<br>

## Disk Scheduling Algorithm

- 큐에 다음과 같은 실린더 위치의 요청이 존재하는 경우 디스크 헤드 53번에서 시작한 각 알고리즘의 수행 결과는? (실린더 위치는 0-199)
- 다시 말해, 큐에 읽는 순서가 있다면, 실린더를 찾기 위해 헤드를 몇번이나 움직이는가?
  - 큐(queue) : 98, 183, 37, 122, 14, 124, 65, 67

<br>

### FCFS (First Come First Service)

<img src='https://user-images.githubusercontent.com/78655692/172839065-e4593048-9f2a-4015-94ba-087a11e5aad2.png' width=500>

- 큐(queue) : 98, 183, 37, 122, 14, 124, 65, 67
- 헤드의 총 이동은 640 실린더이다.
  - (98-53)+(183-98)+(183-37)+(122-37)+(122-14)+(124-14)+(124-65)+(67-65) = 640

<br>

### SCAN

- disk arm이 디스크의 한쪽 끝에서 다른쪽 끝으로 이동하며 가는 길목에 있는 모든 요청을 처리한다.
- 다른 한쪽 끝에 도달하면 역방향으로 이동하며 오는 길목에 있는 모든 요청을 처리하며 다시 반대쪽 끝으로 이동한다.
- **Cons**
  - 실린더 위치에 따라 대기 시간이 다르다.

<img src='https://user-images.githubusercontent.com/78655692/172837463-011a1fe0-dd38-4a55-aff3-81bd643018d0.png' width=500>

- 헤드가 만약 0으로 움직인다면, 그림은 위와 같다.
- 큐(queue) : 98, 183, 37, 122, 14, 124, 65, 67
- 헤드의 총 이동은 236 실린더이다.
  - (53-37)+(37-14)+(14-0)+(65-0)+(67-65)+(98-67)+(122-98)+(124-122)+(183-124) = 236

<br>

### C-SCAN (Circular-SCAN)

- 헤드가 한쪽 끝에서 다른쪽 끝으로 이동하며 가는 길목에 있는 모든 요청을 처리한다.
- 다른쪽 끝에 도달했으면 요청(서비스)을 처리하지 않고 곧바로 출발점으로 다시 이동한다. 
- SCAN보다 균일한 대기 시간을 제공한다.

<img src='https://user-images.githubusercontent.com/78655692/172838654-2dd3f08a-305c-4b27-9039-9ba50c2f23f2.png' width=500>

- 큐(queue) : 98, 183, 37, 122, 14, 124, 65, 67
- 헤드의 총 이동은 183 실린더이다. (끝은 199이다.)
  - (65-53)+(67-65)+(98-67)+(122-98)+(124-122)+(183-124)+(199-183)+(14-0)+(37-14) = 183

<br>

### Other Algorithms

- **N-SCAN**
  - SCAN의 변형 알고리즘
  - 일단 arm이 한 방향으로 움직이기 시작하면 그 시점 이후에 도착한 job은 되돌아올 때 service
- **LOOK and C-LOOK**
  - SCAN이나 C-SCAN은 헤드가 디스크 끝에서 끝으로 이동
  - LOOK과 C-LOOK은 헤드가 진행 중이다가 그 방향에 더 이상 기다리는 요청이 없으면 헤드의 이동방향을 즉시 반대로 이동한다.

<br>

## Disk-Scheduling Algorithm의 결정

- SCAN, C-SCAN 및 그 응용 알고리즘은 LOOK, C-LOOK 등이 일반적으로 디스크 입출력이 많은 시스템에서 효율적인 것으로 알려져 있음
- File의 할당 방법에 따라 디스크 요청이 영향을 받음
- 디스크 스케줄링 알고리즘은 필요할 경우 다른 알고리즘으로 쉽게 교체할 수 있도록 OS와 별도의 모듈로 작성되는 것이 바람직하다.

<br>

## Swap-Space Management

- Disk를 사용하는 이유
  - memory의 volatile한 특성 -> file system
  - 프로그램 실행을 위한 memory 공간 부족 -> swap space (swap area)
- Swap-space
  - Virtual memory system에서는 디스크를 memory의 연장 공간으로 사용
  - 파일시스템 내부에 둘 수도 있으나 별도 partition 사용이 일반적
    - 공간효율성보다는 속도 효율성이 우선
    - 일반 파일보다 훨씬 짧은 시간만 존재하고 자주 참조됨
    - 따라서, block의 크기 및 저장 방식이 일반 파일시스템과 다름

![image](https://user-images.githubusercontent.com/78655692/148021519-99d3a35b-c599-42d3-9fac-8d84090aecba.png)

<br>

## Boot Block

- 컴퓨터를 실행하기 위한 것으로, 전원을 키면 실행할 초기 프로그램을 반드시 가진다.
- bootstrap loader는 NVM 플래시 메모리에 저장되고, 잘 알려진 메모리 위치에 매팽된다.

![image](https://user-images.githubusercontent.com/78655692/172848827-bae269ec-a15d-4529-b6c4-3bfd92ceb730.png)

<br>

## RAID

- **RAID (Redundant Array of Independent Disks)**
  - 여러 개의 디스크를 묶어서 사용한다.
- **RAID**의 사용 목적
  1. 디스크 처리 속도 향상을 위해서다.
    - 여러 디스크에 블록의 내용을 분산 저장하는데,
    - 병렬적(parallel)으로 읽어 온다.(interleaving(중간에 끼워넣는), striping)
    - **bit level striping** : 각 바이트의 비트를 분할한다.
    - **block level striping** : 드라이버 수에 대한 일반화
  2. 신뢰성 (reliability) 향상을 위해서다.
    - 동일 정보를 여러 디스크에 중복 저장
    - 하나의 디스크가 고장(failure)시 다른 디스크에서 읽어옴 (Mirroring, shadowing)
    - 단순한 중복(redundancy) 저장이 아니라 일부 디스크에 parity를 저장하여 공간의 효율성을 높일 수 있다.

![image](https://user-images.githubusercontent.com/78655692/148021962-0494e95d-feaf-49fe-a8ea-044f8d8c186c.png)

<br>

- **RAID level** : 비용과 성능의 trade-off 에 따른 스키마들을 분류

![image](https://user-images.githubusercontent.com/78655692/172878109-7e351b2e-2654-419b-8b5e-63ebaea50d18.png)

<br>

<img src='https://user-images.githubusercontent.com/78655692/172878317-6eaf3989-94fb-4ca7-99e3-274d2e0e8054.png' width=500>


<br>



