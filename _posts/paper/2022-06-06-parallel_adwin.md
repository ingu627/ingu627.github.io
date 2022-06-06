---
layout: single
title: "[논문 리뷰] Scalable Detection of Concept Drifts on Data Streams with Parallel Adaptive Windowing"
excerpt: "Adaptive Windowing (ADWIN)은 윈도우 기반 드리프트 감지 기법입니다. 하지만, 이 기법은 메모리 사용량이 많이 요구되는 단점이 있습니다. 이 논문은 병렬화를 통해 극복하려고 했습니다."
categories: paper
tag : [컨셉 드리프트, concept drift, detection, adaptive windowing, adwin, exponential histogram, stream, 스트림, 머신 러닝, 기계학습, 모델, 리뷰, 논문, 정리, 설명, 병렬]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-06-06
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

- (추가)





<br>
<br>
<br>
<br>


