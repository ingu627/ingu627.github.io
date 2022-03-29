---
layout: single
title: "[논문 리뷰] A Data Quality-Driven View of MLOps"
excerpt: "이 논문은 데이터 품질의 다양한 측면이 ML development 단계를 통해 어떻게 전파되는지를 고민했습니다. 이에 대한 요약 및 리뷰입니다."
categories: paper
tag : [mlops, data quality]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-03-29
---

"A Data Quality-Driven View of MLOps" 논문을 개인 공부 및 리뷰를 위해 쓴 글입니다. <br>
논문 링크 : <https://arxiv.org/abs/2102.07750>
{: .notice--info}

<br>
<br>

## 1. Introduction

- ML 모델(Machine Learning Model)은 데이터에서 컴파일된 software artifact이다.
- ML 모델은 불가피하게 DevOps 프로세스를 거친다.
  - **DevOps** : 시스템 개발 라이프 사이클(life cycle)을 단축하고 소프트웨어 품질로 지속적인 전달을 제공하는 것.
- ML 모델(accuracy, fairness, robustness)의 품질은 기초 데이터(noises, imbalances, additional adversarial perturbations)의 품질과도 같다.
- ML 모델을 향상 시키는 주요 방법으로 data cleaning, integration, label acquisition 같이 데이터셋의 품질을 높이는 것이다.
- 따라서, MLOps를 이해하고, 측정하고, 향상시키기 위해, **data quality**는 MLOps에서 매우 중요한 역할을 한다.

<br>

- 기타 Data Quality 관련해서 지금까지 많은 연구자들이 연구해 온 것들
  - data acquistion with weak supervision (Snorkel)
  - ML engineering pipelines (TFX)
  - data cleaning (ActiveClean)
  - data quality verification (Deequ)
  - interaction (Northstar)
  - fine-grained monitoring and improvement (Overton)

<br>

### Data Quality에 대한 4가지 측면

|속성|설명|
|---|---|
|정확성(accuracy)|데이터가 정확하고 신뢰할 수 있으며, 작업에 대해 인증된 정도|
|완전성(completeness)|특정 데이터 수집에 대응(corresponding)하는 데이터를 포함하는 정도|
|일관성(consistency)|데이터 집합에서 정의된 의미 규칙 위반의 정도|
|적시성(timeliness)|작업을 위한 데이터가 최신인 정도|

<br>

<img src='https://user-images.githubusercontent.com/78655692/160605964-77fdd705-bdb1-4330-8fed-a48320c75d39.png' width=700>


<br>

### 전체 개요

![image](https://user-images.githubusercontent.com/78655692/160606677-c3663f3f-8317-45f0-9d2d-56a5cc0ae774.png)

<br>
<br>

## 2. Machine Learning Preliminaries

- 이 논문에서는 머신 러닝에 관한 선수 지식을 소개한다. 기본 사항은 여기서는 생략하겠다.

<br>

### Concept Shift

- 




<br>
<br>

## 3. MLOps Task 1: Effective ML Quality Optimization




<br>
<br>

## 4. MLOps Task 2: Preventing Unrealistic Expectations



<br>
<br>


## 5. MLOps Task 3: Rigorous Model Testing Against Overfitting





<br>
<br>

## 6. MLOps Task 4: Efficient Continuous Quality Testing










<br>
<br>
<br>
<br>
