---
layout: single
title: "운영체제 1장: OS 개요와 역할"
excerpt: "본 글은 (KOCW) 운영체제, 이화여자대학교 반효경 교수님의 강의를 듣고 개인 공부에 목적으로 내용을 요약 및 정리했습니다. <br> 또한 주니온 박사님의 운영체제 공룡책 강의를 듣고 내용을 보충했습니다."
categories: OS
tags: [OS, 운영체제, 동시 작업, 처리 방식, 컴퓨터, 인터럽트, 커널, 프로그램, 개요, 프로세스, 란, 정의, 개념, pdf, 정리]
toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2022-08-07
---

본 글은 (KOCW) 운영체제, 이화여자대학교 반효경 교수님의 강의를 듣고 내용을 요약 및 정리했습니다. <br> 개인 공부에 목적이 있으며, 자세한 사항은 [여기](http://www.kocw.or.kr/home/cview.do?mty=p&kemId=1046323)를 참고하시면 됩니다. <br><br> Chapter 1. <br> - 강의소개 - 28분 <br> - Introduction to Operating Systems - 1시간 8분 <br><br> (+) 인프런의 주니온 박사님의 운영체제 공룡책 강의를 듣고 내용을 보충했습니다. 자세한 사항은 [여기](https://www.inflearn.com/course/%EC%9A%B4%EC%98%81%EC%B2%B4%EC%A0%9C-%EA%B3%B5%EB%A3%A1%EC%B1%85-%EC%A0%84%EA%B3%B5%EA%B0%95%EC%9D%98)를 참고하시면 됩니다.
{: .notice--info}

![image](https://user-images.githubusercontent.com/78655692/147717027-fcfaf167-79a5-4ce2-8d43-0801ef2df945.png)
![image](https://user-images.githubusercontent.com/78655692/158063378-b6937f70-2b74-4afb-8103-1fe278a3c340.png)

<br>

## 운영체제란 무엇인가?

- **운영체제**(Operating System, OS): 컴퓨터 하드웨어 바로 위에 설치되어 사용자 및 다른 모든 소프트웨어와 하드웨어를 연결하는 소프트웨어 계층
  - **operating system** : a software that operates a computer system
  - **operating system** : a program running at all times on the computer to provide system services to application programs to manage processes, resources, user interfaces, and so on
  - **computer** : a machine that processes the information
  - **information** : a quantitative representation that measures the uncertainty
- 협의의 운영체제(커널) : 운영체제의 핵심 부분으로 메모리에 상주하는 부분
  - **커널(kernel)** : 컴퓨터에서 항상 수행되는 프로그램
- 광의의 운영체제 : 커널 뿐 아니라 각종 주변 시스템 유틸리티를 포함한 개념

<br>

### 운영체제의 목적

- 컴퓨터 시스템의 자원을 **효율적으로 관리**
  - 사용자간의 형평성 있는 자원 분배
  - 주어진 자원으로 최대한의 성능을 내도록
- 컴퓨터 시스템을 **편리하게 사용**할 수 있는 환경을 제공
  - 운영체제는 사용자/프로그램들이 각각 독자적 컴퓨터에서 수행되는 것 같은 환상을 제공
  - 하드웨어를 직접 다루는 복잡한 부분을 운영체제가 대행

<br>

## 운영 체제의 분류

### 동시 작업 가능 여부 

- **단일 작업(single tasking)** : 한 번에 하나의 작업만 처리
  - ex. MS-DOS 프롬프트 상에서는 한 명령의 수행을 끝내기 전에 다른 명령을 수행시킬 수 없음
- **다중 작업(multi tasking)** : 동시에 두 개 이상의 작업 처리
  - ex. UNIX, MS Windows 등에서는 한 명령의 수행이 끝나기 전에 다른 명령이나 프로그램을 수행할 수 있음

<br>

### 사용자의 수

- 단일 사용자(single user)
  - ex. MS-DOS, MS Windows
- 다중 사용자(multi user)
  - ex. UNIX, NT server

<br>

### 처리 방식

- **일괄 처리(bath processing)**
  - 작업 요청의 일정량 모아서 한꺼번에 처리
  - 작업이 완전 종료될 때까지 기다려야 함
- **시분할(time sharing)**
  - 여러 작업을 수행할 때 컴퓨터 처리 능력을 일정한 시간 단위로 분할하여 사용
  - 일괄 처리 시스템에 비해 짧은 응답 시간을 가짐
  - interactive한 방식
- **실시간(Realtime OS)**
  - 정해진 시간 안에 어떠한 일이 반드시 종료됨이 보장되어야 하는 실시간 시스템을 위한 OS
    - ex. 원자로/공장 제어, 미사일 제어, 반도체 장비, 로보트 제어
  - 실시간 시스템의 개념 확장
    - Hard realtime system (경성 실시간 시스템)
    - Soft realtime system (연성 실시간 시스템)
- **일괄 처리(batch processing)**
  - 작업 요청의 일정량 모아서 한꺼번에 처리
  - 작업이 완전 종료될 때까지 기다려야 함
  - ex. 초기 Punch Card 처리 시스템

<br>

## 몇 가지 용어

- Multitasking, Multiprogramming, Time sharing, Multiprocess 는 모두 컴퓨터에서 여러 작업을 동시에 수행하는 것을 뜻한다.
  - Multiprogramming은 여러 프로그램이 메모리에 올라가 있음을 강조
  - Time Sharing은 CPU의 시간을 분할하여 나누어 쓴다는 의미
- Multiprocessor : 하나의 컴퓨터에 CPU가 여러 개 붙어 있음을 의미.
- **프로그램(program)** : 컴퓨터의 하드웨어에 작업을 수행하도록 지시하는 일련의 명령
- **부트스트랩(bootstrap)** : 컴퓨터 전원을 켜고 운영 체제를 로드하는 첫 번째 프로그램
- **인터럽트(interrupt)** : Hard는 CPU로 신호를 전송하여 언제든지 인터럽트를 트리거할 수 있다.(일반적으로 시스템 버스를 경유함)

![image](https://user-images.githubusercontent.com/78655692/158064506-d71c3c4a-8f98-4445-be0c-3c92ba93d7cc.png)

- **CPU** : 명령을 실행하는 하드웨어
- **Processor** : 하나 이상의 CPU를 포함하는 물리적 칩
- **Core** : CPU의 후면(back) 계산 단위
- **Multicore** : 동일한 CPU에 여러 컴퓨팅 코어를 포함
- **Multiprocessor** : 여러 프로세서를 포함
- **Symmetric multiprocessing (SMP)** : 각 피어 CPU 프로세서는 모든 작업을 수행
- **Asymmetric multiprocessing** : 각 프로세서에는 특정 태스크가 할당된다.
- **Virtualization** : 단일 컴퓨터의 하드웨어를 여러 다른 실행 환경으로 추상화할 수 있는 기술
- **VMM** : 가상 시스템 관리자 (Virtual Machine Manager)
  - VMware, XEN, WSL, and so on.

![image](https://user-images.githubusercontent.com/78655692/158064711-d3a56641-c45f-4c5a-8624-c2bc537f59c1.png)

- **CLI** : 명령줄 인터페이스 또는 명령 인터프리터
- **GUI** : 그래픽 사용자 인터페이스 (graphical user interface)
- **System calls** : OS에서 제공하는 서비스에 대한 인터페이스를 제공한다.
- **API** : Application Programming Interface


<br>

## 운영 체제의 예

### 유닉스(UNIX)

- 코드의 대부분을 C언어로 작성
- 높은 이식성
- 최소한의 커널 구조
- 복잡한 시스템에 맞게 확장 용이
- 소스 코드 공개
- 프로그램 개발에 용이
- 다양한 버전 : System V, FreeBSD, SunOS, Solaris, Linux

<br>

### DOS(Disk Operating System)

- MS사에서 1981년 IBM-PC를 위해 개발
- 단일 사용자용 운영체제, 메모리 관리 능력의 한계(주 기억 장치 : 640kb)

<br>

### MS Windows

- MS사의 다중 작업용 GUI 기반 운영 체제
- Plug and Play, 네트워크 환경 강화
- DOS용 응용 프로그램과 호환성 제공
- 불안정성
- 풍부한 지원 소프트웨어

<br>

### Handheld device를 위한 OS

- PalmOS, Pocket PC (WinCE), Tiny OS

<br>

## 운영 체제의 구조

- **CPU 스케쥴링** : 누구한테 cpu를 줄까?
- **메모리 관리** : 한정된 메모리를 어떻게 쪼개어 쓰지?
- **파일 관리** : 디스크에 파일을 어떻게 보관하지?
- **입출력 관리** : 각기 다른 입출력장치와 컴퓨터 간에 어떻게 정보를 주고 받게 하지? (interrupt에 의해 관리하고 있다.)
- **프로세스 관리** : 프로세스의 생성과 삭제, 자원 할당 및 반환, 프로세스 간 협력
- **그 외** : 보호 시스템, 네트워킹, 명령어 해석기(command line interpreter)

![image](https://user-images.githubusercontent.com/78655692/158064784-e7884922-6bef-46e2-960d-667b5d2adf78.png)

- **Program execution** : 메모리에 프로그램 로드 및 실행하는 것을 의미한다.
- **I/O operations** : 실행 중인 프로그램은 I/O를 필요할 수 있다.
- **File-system manipulation** : 프로그램은 파일과 디렉토리를 생성(create), 삭제(delete), 읽기(read), 쓰기(write)를 한다.
- **Communications** : 프로세스는 동일한 컴퓨터 또는 네트워크를 통해 컴퓨터 간에 정보를 교환한다. 
  - 공유 메모리 또는 메시지 전달을 통해서
- **Error detection** : 끊임없이 에러 가능성을 감지한다.
- **Resource allocation** : 여러 사용자 또는 여러 작업을 동시에 실행할 경우 각 사용자에게 리소스를 할당해야 한다.
  - 리소스 유형으로 CPU 사이클, 메인 메모리, 파일 스토리지, I/O 디바이스들이 있다.
  - **Accounting** : 어떤 사용자가 얼마나 많은 컴퓨터 리소스를 사용하는지 추적한다.

<br>

- **현대 컴퓨터의 작동 방식**

<img src='https://user-images.githubusercontent.com/78655692/173182784-8c35cd53-9f5d-4502-9fea-999fdbb4f914.png' width=600>


<br>
