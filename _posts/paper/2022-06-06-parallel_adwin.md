---
layout: single
title: "[논문 리뷰] Scalable Detection of Concept Drifts on Data Streams with Parallel Adaptive Windowing"
excerpt: "Adaptive Windowing (ADWIN)은 윈도우 기반 드리프트 감지 기법입니다. 하지만, 이 기법은 메모리 사용량이 많이 요구되는 단점이 있습니다. 이 논문은 병렬화를 통해 극복하려고 했습니다."
categories: paper
tag : [컨셉 드리프트, concept drift, detection, adaptive windowing, adwin, exponential histogram, stream, 스트림, 머신 러닝, 기계학습, 모델, 리뷰, 논문, 정리, 설명, 병렬, 윈도우, 란, paper]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-06-25
---

![image](https://user-images.githubusercontent.com/78655692/172111947-570a483a-c49a-4912-af2d-efa6c23f213c.png)

"Scalable Detection of Concept Drifts on Data Streams with Parallel Adaptive Windowing" 논문을 개인 공부 및 리뷰를 위해 쓴 글입니다. <br>
논문 출처 : Grulich, Philipp M., et al. "Scalable Detection of Concept Drifts on Data Streams with Parallel Adaptive Windowing." EDBT. 2018.
{: .notice--info}

<br>
<br>
<br>

## 1. Introduction

- 스트림(stream) 분석에 머신러닝(ML) 기법이 점점 더 채택되고 있다.
- ML 기법은 ML 모델을 학습하고 스트림을 처리할 때 그 모델에 적용한다. 
- 컨셉 드리프트(concept drift)는 ML 모델과 현실 사이의 불일치(discrepancy)로 발생하며, 이는 데이터 스트림의 머신러닝에 중요한 직면 과제이다.
- 높은 불일치는 부정확한 예측과 잘못된 결과를 야기한다.
- 스트림 프로세싱 엔진은 concept drift detection과 매초 대량의 데이터를 ML 기법에 실행시킬 조정(adaptation)같은 확장적인 솔루션을 요구한다.
- 컨셉 드리프트를 대처할 나이브(naive)한 접근은 최근 데이터의 고정된 사이즈의 배치를 정기적으로 ML 모델을 재학습하는 것이다.
- 하지만 이런 정기적 재학습은 현실 세계에서 작동 안 할 수 있다.
  1. 모델이 아직 가장 최근의 데이터를 다루지 않는다. (가장 최근의 데이터가 컨셉 드리프트일지라도)
  2. 모델에 반영된 데이터가 컨셉 드리프트여서 모델의 성능 하락을 일으킨다.

<br>

- 저자들은 ADaptive WINdowing (ADWIN)의 예시를 통해 확장적인(scalability) 한계를 연구한다.
- **ADaptive WINdowing (ADWIN)** : 조정할 수 있는 크기의 전역(global) 윈도우(window)를 유지하는데, 이것은 모델 계산의 기초가 되는 데이터이다.
- ADWIN은 칼만 필터(Kalman FIlter)와 나이브 베이즈(Naive Bayes), k-평균 군집(k-means clustering)을 결합했다.
- 그리고, ADWIN은 배깅(bagging)과 공간 절약 알고리즘의 변형 버전(space saving algorithm)을 이용했다.

<br>

- 다음은 저자들의 contribution 부분이다.

1. ADWIN을 분석하여 scalability 한계와 병목 현상(bottleneck)을 확인한다.
2. 병목 현상을 극복하기 위해 ADWIN을 병렬화하고 현실 세계에서 확장가능한 concept drift adaptation을 제공한다.
3. 지연 시간(latency)과 처리량(throughput)을 평가했다.

<br>
<br>

## 2. Concept Drift Detection With Adaptive Windowing

### 2.1 The ADWIN Algorithm

- ADWIN은 그때그때(on the fly)로 concept drift를 감지(detect)하고 그에 따라 ML 모델을 적용하는 알고리즘이다.
- ADWIN은 컨셉 드리프트가 감지되지 않는 한 최근 스트림 데이터를 추가하므로 윈도우 크기는 점점 증가한다.
- 결과적으로, 모델은 학습 데이터가 증가하는 것에 의존한다.
- ADWIN은 컨셉 드리프트가 감지될 때 오래된 데이터 스트림을 제거함으로써 윈도우 크기를 줄인다.
- 스트림 튜플을 처리할 때, ADWIN은 튜플에 먼저 adaptive window를 추가한다.
  - 튜플이라 함은 스트림 데이터를 분류하기 위해 추가한 집합을 말한다.
- 그리고나면, 알고리즘은 adaptive window의 내용을 분석하여 concept drift인지 확인한다.
- 마지막에, ADWIN은 Figure 1과 같이 두개의 슬라이딩 하위윈도우(sliding subwindows)의 모든 가능한 조합을 반복한다.
  - 만약 두개의 하위 윈도우의 분포가 많이 다르다면, ADWIN은 컨셉 드리프트를 검출(detect)하고 adaptive window의 오래된 튜플을 지운다.
  - 이것을 cut detection이라 부르는데 이것은 오래된 데이터를 지우기 위해 adaptive window를 자를 때 결정하기 때문이다.

![image](https://user-images.githubusercontent.com/78655692/172120746-8d7e3cc7-7758-49e6-bfab-6f9d174a258c.png)

<br>

### 2.2 Exponential Histograms

- naive ADWIN 구현은 계산적으로 비싼데, 입력 스트림의 각 튜플마다 하위 윈도우의 모든 가능한 조합을 확인하고 cut을 수행하기 때문이다.
- 이 문제를 해결하기 위해 ADWIN은 adaptive window의 기본 데이터 구조같은 지수 히스토그램(exponential histogram)을 사용했다.

![image](https://user-images.githubusercontent.com/78655692/172122072-51a342cb-b32a-4412-bcea-318c62bcf8ba.png)

<br>

- 지수 히스토그램은 입력 튜플을 버킷(bucket)에 할당한다. (Fig 2에서 1단계)
- 최근 데이터의 버킷은 그저 몇개의 튜플을 포함한다.
- 오래된 데이터의 버킷은 기하급수적으로 증가하는 튜플들을 포함한다.
- 각 버킷은 오직 튜플의 합산(sum)과 분산(variance)만을 저장한다. (Fig 2에서 2단계)
- 이것은 히스토그램(:막대를 표현하기 위해 쓴 것 같다.)의 메모리 소비를 줄여준다.
- 즉, 버킷의 수와 각 메모리 소비는 adaptive window가 증가할 때 대수적으로(logarithmically) 증가한다.
- cut check 절차는 이제 버킷을 비교하면 된다.

<br>

- 다음 그림은 exponential histogram을 포함한 ADWIN 알고리즘의 overview이다.

![image](https://user-images.githubusercontent.com/78655692/172123866-378f3f70-5b9e-4747-bd5c-eae5594c3673.png)

<br>

### 2.3 Initial Performance Analysis

![image](https://user-images.githubusercontent.com/78655692/172124674-cefedbe9-f13f-457d-8509-073fd844e5f1.png)

<br>
<br>

## 3. Parallel Adaptive Windowing

- 본 논문에서는 몇 가지 접근법을 이용하여 ADIWN을 병렬화하여 처리량(throughput)을 향상시키는 방법을 소개한다.
  - 2.3의 Fig 3에서 보았듯이, 병목현상을 확인하기 위해 cut detection을 병렬화하는 것에 집중해본다.

<br>

### 3.1 Single-Node Parallelization

![image](https://user-images.githubusercontent.com/78655692/175618608-98cdfb44-bc4b-4d8d-96c9-7fc7dca90fbe.png)

- 다음은 ADWIN이 입력 튜플을 어떻게 처리하는지 수도 코드를 보여주고, 단일 노드 병렬화를 가리킨다.
  - 위 과정을 3.1.1, 3.1.2, 3.1.3으로 각각 나누어 자세히 설명한다.
- **3.1.1**
  - cut check가 입력 튜플 처리를 지연시킬 수 없도록 히스토그램 업데이트와 cut check를 서로 분리한다.
- **3.1.2**
  - cut check 내 병렬화인 cut check 절차 자체를 병렬화한다.
- **3.1.3**
  - Adwin이 cut을 감지하는 경우 여러 cut check 절차를 병렬로 수행하는 방법을 논의한다.

<br>
<br>

### 3.1.1 Cut-Check Decoupling

- 대부분의 입력 튜플이 컨셉 드리프트를 가리키지 않을거라 가정하는 ADWIN의 optimistic 병렬화를 도입한다.
  - 이 가정은 빅 데이터 스트림에 적용된다.
- ADWIN은 다음의 2가지 태스크를 진행한다.
  - 새로운 튜플로 히스토그램을 업데이트하고, cut detection 절차로 컨셉 드리프트를 감지한다.
- 원래 ADWIN은 이 두가지 태스크를 연속적으로 수행한다.
- 하지만, 이것은 처리량의 한계가 있는데, cut detection은 입력 스트림의 처리를 블록하기 때문이다.

<br>

![image](https://user-images.githubusercontent.com/78655692/175768557-800a9675-f54b-4249-b271-e2e6a7bd46b9.png)

- Optimistic ADWIN은 히스토그램 업데이트와 컷 체크를 다른 것들과 분리하여 처리량 한계를 극복한다.
  - 이 알고리즘은 컷 체크를 분리된 snapshot 히스토그램에서 수행하고 새로운 튜플을 primary 히스토그램에 동시에 추가한다.
  - 첫 체크 절차의 각 실행 후 히스토그램을 동기화한다.
- 하나의 스레드가 기본 히스토그램과 redo 로그에 새 입력 튜플을 추가한다.
- (step1) 다른 스레드는 기본 히스토그램의 심층 복사본을 만든다.
- (step2) 이 복사본에 대해 컷 체크 절차를 수행한다.
- (step3) 컨셉 드리프트의 경우, 기본 히스토그램을 컷 체크 절차에 의해 조작된 snapshot으로 대체하는 롤백을 시작한다.
  - 마지막으로 redo 로그를 사용하여 누락된 입력 튜플을 기본 히스토그램에 다시 추가한다. 
- 위 과정을 연속적으로 반복한다.

<br>

- optimistic ADWIN은 기본 히스토그램에 새 튜플 삽입과 컷에 대한 알림 사이에 대기시간(latency)을 도입한다.

<br>
<br>

### 3.1.2 Intra-Cut-Check Parallelization

![image](https://user-images.githubusercontent.com/78655692/175769135-079c9ab3-025c-47af-b410-e530e103fa57.png)

- 컷 체크 절차의 단일 스레드가 실행되면 히스토그램의 끝 부분에서 컷이 확인되기 시작하고 시작 부분으로 이동한다.
- 알고리즘은 슬라이딩 서브 윈도우를 비교한다.
  - 비교에는 하위 윈도우에 포함된 버킷의 합과 분산이 필요하다.
- 컷 체크 반복의 초기화로 히스토그램은 전체 집계를 저장하고 유지한다.
- 여기서 두 컷 체크가 병렬로 실행되도록 하프컷 애드윈을 도입한다.
  - 각 반복 단계의 컷 체크는 이전 반복 단계의 컷 체크와 독립적이기 때문에 두 개의 스레드가 히스토그램에서 동시에 반복될 수 있다.
- 하프컷 애드윈은 두 스레드가 히스토그램의 중간에 도달하거나 컷을 발견하면 컷 체크 절차를 종료한다.

<br>
<br>

### 3.1.3 Inter-Cut-Check Parallelization

- ADWIN이 컷을 찾으면, 히스토그램에서 가장 오래된 버킷을 제거하고 더 이상 컷이 감지되지 않을 때까지 컷 체크 절차를 반복한다.
- 이를 통해 히스토그램에서 오래된 버킷을 제거한 후 추가 컷을 감지한다고 가정하는 pessimisitic 병렬화가 가능하다. 
- 스레드 1이 모든 버킷 1...n에 대해 컷 검사를 수행하는 동안 스레드 2는 이전 버킷을 제거한 후 다른 컷이 있는지 확인하고 버킷 2...n에 대해 컷 감지를 수행할 수 있다. 
- 이는 각각 Half-Cut Adwin을 적용할 수 있는 n - 1 병렬 절단 검사 절차로 확장된다.


<br>
<br>
<br>
<br>


