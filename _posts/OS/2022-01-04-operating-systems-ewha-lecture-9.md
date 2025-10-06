---
layout: single
title: "운영체제 9장: 파일 시스템 구조"
excerpt: "본 글은 (KOCW) 운영체제, 이화여자대학교 반효경 교수님의 강의를 듣고 개인 공부에 목적으로 내용을 요약 및 정리했습니다. <br> 또한 주니온 박사님의 운영체제 공룡책 강의를 듣고 내용을 보충했습니다."
categories: OS
tags: [OS, 운영체제, 파일시스템, system, file, directory, access, sequential access, direct access, contiguous allocation linked allocation indexed allocation, free space management, cache, pdf, 정리]
toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2022-06-10
---

본 글은 (KOCW) 운영체제, 이화여자대학교 반효경 교수님의 강의를 듣고 내용을 요약 및 정리했습니다. <br> 개인 공부에 목적이 있으며, 자세한 사항은 <http://www.kocw.or.kr/home/cview.do?mty=p&kemId=1046323>에 참고하시면 됩니다. <br><br> Chapter 10. <br> - File Systems 1 - 37분 <br> - File System Implementations 1 - 1시간 9분 <br> - File System Implementations 2 - 24분 <br><br> (+) 인프런의 주니온 박사님의 운영체제 공룡책 강의를 듣고 내용을 보충했습니다. 자세한 사항은 [여기](https://www.inflearn.com/course/%EC%9A%B4%EC%98%81%EC%B2%B4%EC%A0%9C-%EA%B3%B5%EB%A3%A1%EC%B1%85-%EC%A0%84%EA%B3%B5%EA%B0%95%EC%9D%98)를 참고하시면 됩니다.
{: .notice--info}

![image](https://user-images.githubusercontent.com/78655692/147717027-fcfaf167-79a5-4ce2-8d43-0801ef2df945.png)
![image](https://user-images.githubusercontent.com/78655692/158063378-b6937f70-2b74-4afb-8103-1fe278a3c340.png)

<br>

## File and File System

- **File**
  - "A named collection of related information"
  - 일반적으로 비휘발성의 보조기억장치에 저장
  - 운영체제는 다양한 저장 장치를 file이라는 동일한 논리적 단위로 볼 수 있게 해 줌
  - Operation
    - create, read, write, reposition (lseek), delete, open, close 등
- **File contents = data**
- **File attribute** (혹은 파일의 metadata)
  - 파일 자체의 내용이 아니라 파일을 관리하기 위한 각종 정보들 (=inode number)
    - 파일 이름, 유형, 저장된 위치, 파일 사이즈
    - 접근 권한 (읽기/쓰기/실행), 시간 (생성/변경/사용), 소유자 등
- **File system**
  - 운영체제에서 파일을 관리하는 부분
  - 파일 및 파일의 메타데이터, 디렉토리 정보 등을 관리
  - 파일의 저장 방법 결정
  - 파일 보호 등
- (filename, data, metadata) -> (a set of blocks)

<br>

## Directory and Logical Disk

- **Directory**
  - 파일의 메타데이터 중 일부를 보관하고 있는 일종의 특별한 파일
  - 그 디렉토리에 속한 파일 이름 및 파일 attribute들
  - operation
    - search for a file, create a file, delete a file
    - list a directory, rename a file, traverse the file system
- **Partition** (=Logical Disk)
  - 하나의 (물리적) 디스크 안에 여러 파티션을 두는게 일반적
  - 여러 개의 물리적인 디스크를 하나의 파티션으로 구성하기도 함
  - (물리적) 디스크를 파티션으로 구성한 뒤 각각의 파티션에 file system을 깔거나 swapping 등 다른 용도로 사용할 수 있음

<br>

### open()

- open("/a/b/c")
  - 디스크로부터 파일 c의 메타데이터를 메모리로 가지고 옴
  - 이를 위하여 directory path를 search
    - 루트 디렉토리 `/`를 open하고 그 안에서 파일 a의 위치 획득
    - 파일 a를 open한 후 read하여 그 안에서 파일 b의 위치 획득
    - 파일 c를 open한다.
  - Directory path의 search에 너무 많은 시간 소요
    - Open을 read / write와 별도로 두는 이유임
    - 한번 open한 파일은 read / write 시 directory search 불필요
  - Open file table
    - 현재 open된 파일들의 메타데이터 보관소 (in memory)
    - 디스크의 메타데이터보다 몇 가지 정보가 추가
      - Open한 프로세스의 수
      - File offset : 파일 어느 위치 접근 중인지 표시 (별도 테이블 필요)
  - File descriptor (file handle, file control block)
    - Open file table에 대한 위치 정보 (프로세스 별)

<br>

<img src='https://user-images.githubusercontent.com/78655692/148010898-f474cc31-7a69-46f2-b1b0-f9d0172868ef.png' width=600>

<br>

## File Protection

- 각 파일에 대해 누구에게 어떤 유형의 접근(read/write/execution)을 허락할 것인가?
- Access Control 방법
  - **Access control Matrix**
    - Access control list: 파일별로 누구에게 어떤 접근 권한이 있는지 표시
    - Capability: 사용자별로 자신이 접근 권한을 가진 파일 및 해당 권한 표시
  - **Grouping**
    - 전체 user를 onwer, group, public의 세 그룹으로 구분
    - 각 파일에 대해 세 그룹의 접근 권한(rwx)을 3비트씩으로 표시
    - ex. UNIX
  - **Password**
    - 파일마다 password를 두는 방법 (디렉토리 파일에 두는 방법도 가능)
    - 모든 접근 권한에 대해 하나의 password: all-or-nothing
    - 접근 권한별 password: 암기 문제, 관리 문제

<br>

### File System의 Mounting

<img src='https://user-images.githubusercontent.com/78655692/148011537-7f095a0c-acf5-448c-9aa0-135a055d56cb.png' width=550>

<br>

<img src='https://user-images.githubusercontent.com/78655692/148011580-72b18344-7abd-4f22-b6f7-c2854e5862c1.png' width=550>

<br>

## Access Methods

- 시스템이 제공하는 파일 정보의 접근 방식

<img src='https://user-images.githubusercontent.com/78655692/172987324-9baa01af-a2a8-46eb-802b-84af69bbd8f8.png' width=500>

- **순차 접근 (sequential access)**
  - 카세트 테이프를 사용하는 방식처럼 접근한다.
  - 읽거나 쓰면 offset은 자동적으로 증가한다.

<img src='https://user-images.githubusercontent.com/78655692/172987434-1b4804e0-1a81-490b-afd5-08ed6884898b.png' width=600 >

- **직접 접근 (direct access, random access)**
  - LP 레코드 판과 같이 접근하도록 한다.
  - 파일을 구성하는 레코드를 임의의 순서로 접근할 수 있다.

<br>

## Allocation of File Data in Disk

### Contiguous Allocation

<img src='https://user-images.githubusercontent.com/78655692/172987586-a68de168-f584-4b22-9105-612229a2ba26.png' width=700>

- 각 파일이 디바이스에서 연속적인 블록들의 집합을 차지하도록 요구한다.
- **Pros**
  - Fast I/O
    - 한번의 seek/rotation으로 많은 바이트 transfer
    - Realtime file 용으로, 또는 이미 run 중이던 process의 swapping 용
  - Direct access(=random access) 가능
- **Cons**
  - external fragmentation 발생
  - File grow가 어려움
    - file 생성시 얼마나 큰 hole을 배당할 것인가?
    - grow 가능 vs 낭비 (internal fragmentation)

<br>

### Linked Allocation

<img src='https://user-images.githubusercontent.com/78655692/172987684-1dc99eb3-4bc1-437b-91e0-b84ce285f680.png' width=700>

- contiguous allocation의 모든 문제를 해결하기 위해 등장했다.
- 각 파일은 스토리지 블록의 연결된 리스트이다.
- 블록들은 어느 장치에나 있도록 scatter되어 있다.
- **Pros**
  - External fragmentation 발생 안 함
- **Cons**
  - No random access
  - Reliability 문제
    - 한 sector가 고장나 pointer가 유실되면 많은 부분을 잃음
  - Pointer를 위한 공간이 block의 일부가 되어 공간 효율성을 떨어뜨림
    - 512 bytes/sector, 4 bytes/pointer
- 변형
  - File-allocation table (FAT) 파일 시스템
    - 포인터를 별도의 위치에 보관하여 reliability와 공간효율성 문제 해결

<br>

## FAT File System

<img src='https://user-images.githubusercontent.com/78655692/172987836-895c86d7-cefd-4d69-ad42-ea8798ff8e41.png' width=500>

<br>

- FAT File System은 Linked Allocation를 그대로 계승했지만 단점들을 모두 극복했다.

<br>

### Indexed Allocation

<img src='https://user-images.githubusercontent.com/78655692/172987774-f0b46835-7005-4409-b095-389b2e288b63.png' width=700>

- linked allocation의 문제는 블록에 대한 포인터들이 블록으로 흩어져 있다.
- indexed allocation은 모든 포인터를 인덱스 블록으로 모아서 이 문제를 해결한다.
- **Pros**
  - External fragmentation이 발생하지 않음
  - Direct access 가능
- **Cons**
  - Small file의 경우 공간 낭비 (실제로 많은 file들이 small)
  - Too Large file의 하나의 block으로 index를 저장하기에 부족
    - 해결방안
      - linked scheme
      - multi-level index

<br>

## UNIX 파일시스템의 구조

<img src='https://user-images.githubusercontent.com/78655692/148012894-68d3ee42-0ac6-4265-8f38-1a2cc360459b.png' width=700>

<br>

- 유닉스 파일 시스템의 중요 개념
  - `Boot block`
    - 부팅에 필요한 정보 (bootstrap loader)
  - `Superblock`
    - 파일 시스템에 관한 총체적인 정보를 담고 있다.
  - `Inode`
    - 파일 이름을 제외한 파일의 모든 메타 데이터를 저장
  - `Data block`
    - 파일의 실제 내용을 보관

<br>

## Free-Space Management

- **Bit map or bit vector**
  - Bit map은 부가적인 공간을 필요로 함
  - 연속적인 n개의 free block을 찾는데 효과적
- **Linked list**
  - 모든 free block들을 링크로 연결 (free list)
  - 연속적인 가용공간을 찾는 것은 쉽지 않다.
  - 공간의 낭비가 없다.
- **Grouping**
  - linked list 방법의 변형
  - 첫번째 free block이 n개의 pointer를 가짐
    - n-1 pointer는 free data block을 가리킴
    - 마지막 pointer가 가리키는 block은 또 다시 n pointer를 가짐
- **Counting**
  - 프로그램들이 종종 여러 개의 연속적인 block을 할당하고 반납한다는 성질에 확인
  - (first free block, # of contiguous free blocks)을 유지

<br>

## Directory Implementation

- **Linear list**
  - `<file name, file의 metadata>`의 list
  - 구현이 간단
  - 디렉토리 내에 파일이 있는지 찾기 위해서는 linear search 필요 (time-consuming)
- **Hash Table**
  - linear list + hashing
  - Hash table은 file name을 이 파일의 linear list의 위치로 바꾸어줌 
  - search time을 없앰
  - Collision 발생 가능

![image](https://user-images.githubusercontent.com/78655692/148014247-02ab496e-daaa-474d-a174-b86038130c6a.png)

<br>

- File의 metadata의 보관 위치
  - 디렉토리 내에 직접 보관
  - 디렉토리에는 포인터를 두고 다른 곳에 보관
    - inode, FAT 등
- Long file name의 지원
  - `<file name, file의 metadata>`의 list에서 각 entry는 일반적으로 고정 크기
  - file name이 고정 크기의 entry 길이보다 길어지는 경우 entry의 마지막 부분에 이름의 뒷부분이 위치한 곳의 포인터를 두는 방법
  - 이름의 나머지 부분은 동일한 directory file의 일부에 존재

![image](https://user-images.githubusercontent.com/78655692/148014506-a32dce10-d63e-4b4b-9ce0-690edbfaf9a7.png)

<br>

## VFS and NFS

- **Virtual File System (VFS)**
  - 서로 다른 다양한 file system에 대해 동일한 시스템 콜 인터페이스 (API)를 통해 접근할 수 있게 해주는 OS의 layer
- **Network File System (NFS)**
  - 분산 시스템에서는 네트워크를 통해 파일이 공유될 수 있음
  - NFS는 분산 환경에서의 대표적인 파일 공유 방법임

<br>

<img src='https://user-images.githubusercontent.com/78655692/148014695-04c82b86-9285-41ba-b697-78d128ef16b4.png' width=600>


<br>

## Page Cache and Buffer Cache

- **Page Cache**
  - Virtual memory의 paging system에서 사용하는 page frame을 caching의 관점에서 설명하는 용어
  - Memory-Mapped I/O를 쓰는 경우 file의 I/O에서도 page cache 사용
- **Memory-Mapped I/O**
  - File의 일부를 virtual memory에 mapping 시킴
  - 매핑시킨 영역에 대한 메모리 접근 연산은 파일의 입출력을 수행하게 함
- **Buffer Cache**
  - 파일시스템을 통한 I/O 연산은 메모리의 특정 영역인 buffer cache 사용
  - File 사용의 locality 활용
    - 한번 읽어온 block에 대한 후속 요청시 buffer cache에서 즉시 전달
  - 모든 프로세스가 공용으로 사용
  - Replacement algorithm 필요 (LRU, LFU 등)
- **Unified Buffer Cache**
  - 최근의 OS에서는 기존의 buffer cache가 page cache에 통합됨

<br>

<img src='https://user-images.githubusercontent.com/78655692/148015143-48fbd718-6a96-4bcf-a6bc-84e78c589349.png' width=600>


<br>

<img src='https://user-images.githubusercontent.com/78655692/148015555-c59a2fe6-eac2-4472-aeae-699fe77de2eb.png' width=600>

<br>

## 프로그램의 실행

<img src='https://user-images.githubusercontent.com/78655692/148015953-6cd12921-e8fa-4cf6-8bb6-398887bda847.png' width=600>

<br>

<img src='https://user-images.githubusercontent.com/78655692/148016167-0d2f962e-5205-4c87-89a6-407ddd87879b.png' width=600>

<br>

<img src='https://user-images.githubusercontent.com/78655692/148016291-07ae7c93-29ac-4f8c-96d1-930c2f29c950.png' width=600>

<br>

