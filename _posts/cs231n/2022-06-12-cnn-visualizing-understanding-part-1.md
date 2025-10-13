---
layout: single
title: "CS231n 강의 9-1: 객체 탐지 기본 개념 & 영역 제안"
excerpt: "본 글은 2022년 4월에 강의한 스탠포드 대학의 Convolutional Neural Networks for Visual Recognition 2022년 강의를 듣고 정리한 semantic segmentation에 대한 내용입니다."
categories: cs231n
tags: [이미지, cnn, cs231n, 리뷰, 정리, 요약, 정의, 란, 딥러닝, 머신러닝, semantic, segmentation, downsampling, upsampling]
toc: true 
toc_sticky: false
sidebar_main: false

last_modified_at: 2022-06-16
---

<img align='right' width='400' src='https://user-images.githubusercontent.com/78655692/172999209-71994ac3-c8a9-4ac2-82b5-84b18c83cdbb.png'>
본 글은 2022년 4월에 강의한 스탠포드 대학의 "Convolutional Neural Networks for Visual Recognition" 2022년 강의를 듣고 정리한 내용입니다. <br> 개인 공부 목적으로 작성되었으며, 설명이 맞지 않거나 글 오타가 있으면 알려주시길 바랍니다.
{: .notice--info}

원본 링크 : [cs231n.stanford.edu](http://cs231n.stanford.edu/)<br> 한글 번역 링크 : [aikorea.org - cs231n](http://aikorea.org/cs231n/) <br> 강의 링크 : [youtube - 2017 Spring (English)](https://www.youtube.com/playlist?list=PL3FW7Lu3i5JvHM8ljYj-zLfQRF3EO8sYv)
{: .notice--warning}

<br>
<br>
<br>

## Image Classification

<img src='https://user-images.githubusercontent.com/78655692/173846377-2964e3f5-0087-4b88-a0ca-99eaac6c5528.png' width=670>

- Computer vision의 핵심 task인 Image Classification은 가능한 라벨(label)을 주어진 상태에서 이미지가 무엇인지 맞추는 것이었다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/173853267-5284d40f-1952-48f9-80cd-d5ed2a2c7246.png' width=670>

- Computer vision의 다른 task들이 있는데, semantic segmentation, objection detection, instance segmentation 등이 있다. 
- 먼저 semantic segmentation 부터 살펴본다.

<br>
<br>

## Semantic Segmentation

<img src='https://user-images.githubusercontent.com/78655692/173854909-565d21b2-00ec-4799-a342-5e9eaaa36e00.png' width=670>

- **semantic segmentation**은 이미지 내에 있는 객체들을 의미있는 단위(객체)로 분할하는 작업을 말한다. [^1]
  - 객체가 없고 단지 픽셀만 있다.
- 각 학습 이미지에 대해 각 픽셀은 의미 범주(semantic category)로 레이블이 지정된다. (그림의 왼쪽)
  - input : 이미지
  - output : 픽셀별로 어떤 범주에 속하는지 알려주는 것이다.
- 그리고 테스트 시, 새 이미지의 각 픽셀을 분류한다. (그림의 오른쪽)

<br>

### sliding window

<img src='https://user-images.githubusercontent.com/78655692/173864426-7f6bc76e-e4ec-4a6b-8fe7-7e03d78d70ca.png' width=670>


- 이미지 한 장을 분류하기 위해 sliding window 기법으로 하나 하나 작게 본다고 하면, 이것은 문맥(context)없이 분류하는 것은 불가능에 가까울 것이다.
  - 즉, 모든 영역을 잘라 patch마다 추출해서 cnn 과정을 거쳐 어떤 클래스인지 유추한다면 이는 매우 비효율적일 것이다.

<br>

### convolution

<img src='https://user-images.githubusercontent.com/78655692/173867476-1ff5b93c-876f-45a8-a4aa-1db820ed3f41.png' width=670>

- 어떻게 하면 sliding window같은 계산량을 줄이기 위해 모델이 feature를 재사용할 수 있을까에 대한 질문으로 **convolution**이 나왔다.
- 전체 이미지를 전달하고, feature를 추출하고, 이러한 feature 위에 semantic segmentation을 수행하여 전체 이미지에 대한 segmentation 맵을 출력한다.
- 하지만, 이 접근 방식의 문제는 네트워크 출력크기가 입력 크기와 많지 않아 alexnet 또는 vggnet같은 image classification 아키텍처를 사용할 수 없는 문제점이 있다. 

<br>

### Fully Convolutional Layer

<img src='https://user-images.githubusercontent.com/78655692/173869507-cffa4293-02c0-4fd5-be3b-edc01e15cbf7.png' width=670>

- downsampling 연산자 없이 컨볼루션 레이어만으로 네트워크를 설계하여 픽셀을 한 번에 예측하는 방법이다.
- 이 방법은 feature를 공유하고 각 슬라이딩 윈도우에 대해 forward pass를 수행할 필요가 없다. [^2]
- 컨볼루션 맵의 각 항목은 다음 컨볼루션 레이어의 모든 필터에 의해 작동되어 다음 레이어에 대한 활성화 맵을 생성한다. fully 컨볼루션 아키텍처를 통해 feature를 재사용/공유하고 모든 픽셀에 대한 예측을 한 번에 생성할 수 있다.
- 하지만, 원본 이미지 해상도(resolution)의 컨볼루션은 매우 비싼 단점이 있다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/173874655-19e16092-c32e-4533-ab11-a30b6acc19ea.png' width=670>

- 세번째 아이디어는 위의 컨볼루션 레이어에서 나아간 방식이다. 차이점이라면 downsampling과 upsampling이 네트워크 안에 존재한다는 것이다. 
- downsampling은 feature 차원 크기를 줄임으로써 연산을 절약하는 데 도움이 되며, 더 깊이 쌓을 수 있다.
- 반면에, 출력 크기는 입력 크기와 일치하도록 upsampling을 한다.
- 이는 원래 이미지 해상도에서 컨볼루션을 수행할 필요가 없다.
  - upsampling과 downsampling을 사용하여 입력 및 출력 spatial 차원 크기가 동일한 계산적으로 효율적인 심층 모델을 구축할 수 있다.

<br>

- (보충이 필요하다.)


<br>
<br>
<br>
<br>

## References

[^1]: [1. Segmentation이 뭔가요? - Time Traveler](https://89douner.tistory.com/113)
[^2]: [CS231n • Detection and Segmentation - Distilled AI](https://aman.ai/cs231n/detection/)

