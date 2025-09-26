---
layout: single
title: 'LLM 경량화 기법: 거대 언어 모델을 가볍게 만드는 비법들'
excerpt: "프루닝(Pruning), 양자화(Quantization), 지식 증류(Knowledge Distillation), 리랭킹(Reranking), 파라미터 공유(Parameter Sharing) 등"
categories: llm
tags : [llm, 경량화, quantization, pruning, 증류, 서비스, 리랭킹, 양자화]
toc: true
toc_sticky: true
sidebar_main: true

date: 2025-09-14
last_modified_at: 205-09-14
---

거대 언어 모델(LLM)이 자연어 처리에서 놀라운 성과를 내고 있지만, 크기와 연산량 때문에 실제 사용 시 문제가 많다. 이 문제를 해결하기 위해 모델을 압축하고 효율을 높이는 경량화 기법들을 알아본다.
{: .notice--info}

<br>

## 배경

거대 언어 모델(LLM)은 뛰어난 성능을 보이지만, 그 거대한 크기와 높은 연산량 때문에 실제 배포에 어려움이 있다.
특히 자원 제약적인 환경에서 이러한 문제를 해결하기 위해 모델 크기를 줄이고 효율성을 높이는 경량화 기법들이 중요해졌다.
주요 경량화 기법으로는 **프루닝(Pruning)**, **양자화(Quantization)**, **지식 증류(Knowledge Distillation)**가 있으며, 이 외에도 다양한 방법들이 연구되고 있다.

<br>

### 1. 프루닝: 불필요한 부분은 ‘과감히 잘라라’

<img width="726" height="214" alt="quantization2" src="https://gist.github.com/user-attachments/assets/2b4e2aba-4375-4ec2-918f-2f89dde9a8ba" />
[^2]

- **Q: 프루닝이란?**
  - 모델 내에서 중요도가 낮은 가중치나 뉴런, 전체 블록까지 싹둑 잘라내는 방식. 
  - 목적: 모델 크기, 연산량, 추론시간을 줄이고, 배포‧운영비를 절감한다.
- **어떤 방식이 주요 트렌드인가?**
  - 비구조적 프루닝: 개별 가중치 단위로 희소성을 만든다(성능은 좋지만 하드웨어 속도 향상은 제한적).
  - 구조적 프루닝: 어텐션 헤드, 레이어, 블록 단위로 제거(속도 향상, 하드웨어 친화적).
- **핵심 최신 방법**
  - Instruction-Following Pruning: 명령 기반 마스크 생성. 상황/태스크에 따라 남길 부분을 다르게 선택. 
  - FinerCut/BlockPruner: 트랜스포머 계층 내 세부 구조까지 미세 조정, 노 레트레이닝으로 25% 블록 제거 후도 높은 성능. 
  - PruneNet: 학습 없이 정책 기반으로 초고속 압축.
- **단점 & 유의할 점**
  - 지나친 압축은 성능 저하. 
  - 프루닝 후에는 미세조정(finetuning) 필요할 수 있음.

<br>

### 2. 양자화 (Quantization): 정밀도를 과감하게 낮춰라

- **Q: 양자화의 기본 아이디어는?**
  - 모델의 파라미터/연산을 32비트 → 8, 4, 심지어 2비트로 변환. 
  - 메모리 절감, 연산 속도 증가가 목적.
- **양자화의 대표 활용 방식**
  - **Post-Training Quantization (PTQ)**: 학습 완료 후 바로 양자화. 8비트까지는 성능 저하 적음, 4비트 이하부터는 accuracy drop 주의. 
  - **Quantization-Aware Training (QAT)**: 학습 단계서부터 양자화 특성을 고려해 훈련—더 좋은 성능, 하지만 훈련 비용 상승. 
  - **혼합 정밀도와 부동소수점 양자화(FP8, FP4 등)**: 계층/활성화 민감도 따라 비트 수 다르게 조정.
- **최신 동향**
  - LLM-QAT, QLLM, CPTQuant, ZeroQuant-FP 등: 4비트, FP8, mixed precision 등 현실적인 저비트 압축 실현.
  - 활성화(outlier)/스파이크 대응: GLU 기반/대규모 모델에서 양자화 오류 완화 연구 활발.
- **장단점 TIP**
  - 초저비트(4bit 이하)는 수치연산, 다국어 성능 저하 가능. 
  - QAT와 혼합정밀도 조합, 계층별 민감도 분석이 효과적.

<br>

### 3. 지식 증류 (Knowledge Distillation): “큰 모델”의 똑똑함, “작은 모델”에게 전수해라

<img width="710" height="304" alt="quantization3" src="https://gist.github.com/user-attachments/assets/f2394b25-7565-4b40-bcd4-5d3cb9a27bcb" />
[^2]

- **Q: 원리와 실제 활용 방법은?**
  - “교사(teacher) 모델”의 응답/출력 확률 분포를 “학생(student) 모델”이 모방하도록 훈련. 
  - 목표: 작은 모델 성능을 Teacher 수준에 가깝게 ↑, 파라미터 수 ↓, 속도 ↑.
- **진화 버전/최신 연구**
  - Reverse KLD, Dual-Space KD, DPKD: 분포 과대평가/어휘 불일치/도메인 차이 등 LLM 특화 증류 문제 해결. 
  - SWITCH: 긴 시퀀스 생성 과정에서 전략적으로 교사 개입. 
  - LoRA와 결합: 파라미터 효율성 강화.
- **실전 팁**
  - 생성형 모델에는 교사 분포를 과대평가하지 않도록 loss 설계가 중요. 
  - 도메인 특화 KD는 학습 데이터/보상 함수를 잘 설계해야 함.

<br>

### 4. 저랭크 팩터화와 파라미터 공유: 구조 자체를 “압축”

- **주요 기법**
  - Low-Rank Factorization(LoRA): 큰 행렬을 작은 저랭크 행렬로 근사, 파라미터·학습량 줄임. 
  - Basis Sharing, ShareLoRA, FlexiGPT: 여러 레이어/블록의 가중치를 공유, 불필요한 중복 제거.
- **장점**
  - 전체 파라미터 수와 메모리 동시 절감. 
  - LoRA 계열은 미세 조정 비용과 오버헤드가 매우 적음.

<br>

### 5. **통합·하이브리드 경량화: “이것저것 섞어” 최대 효과 노려라**

- **대표적 접근법**
  - BitDistiller: Quantization-Aware Training(QAT)+Knowledge Distillation(KD) 결합으로 4비트 이하에서도 성능 유지. 
  - QPruner, SDQ: 프루닝+양자화, Base 공유+저랭크+양자화 등 섞기.
- **주의**
  - 복합 적용 시, 모델 구조·데이터·하이퍼파라미터 최적화가 복잡해짐. 
  - 베이지안 최적화, 자동화된 구조탐색(AutoML)을 활용 추천.

<br>

### 6. 정리

- LLM 경량화의 모든 기술은 효율성과 실용성의 균형을 위해 발전했다. 아래 도식 이미지는 실제 경량화 워크플로우에서 어떤 기법을 언제 어떻게 활용할 수 있는지 쉽게 보여준다.

<img width="811" height="649" alt="quantization1" src="https://gist.github.com/user-attachments/assets/56b6e7b1-ae1e-4cf5-a37d-d6282125b56f" /> 
[^1]

- 모델 입력단계에서 프루닝(Pruning), 양자화(Quantization), 지식 증류(Knowledge Distillation), 저랭크 팩터화(Low-Rank Factorization), 파라미터 공유 등 다양한 경량화 기법이 병합적 또는 선택적으로 적용됨을 보여준다.
- 각 방법의 목적(메모리 절감, 연산 속도, 하드웨어 적용 가능성 등)이 구분되어 있고 경량화 후에는 파인튜닝, 실제 배포, 추가적인 활용(프롬프트 압축 등)으로 이어질 수 있음을 나타낸다. 
- 모듈별 조합이 가능하고, 실제 요구사항에 따라 여러 기법을 융합하는 전략이 중요함을 시각적으로 강조하고 있다.

<br>

> 📌 경량화는 단일 테크닉이 아니라 “워크플로우”다. <br>
> 모델, 데이터, 인프라, 실제 서비스 목적에 따라 다양하게 믹스하여 최고의 효율과 실용성을 달성하자!


<br>
<br>

### References

[^1]: [Efficient Large Language Models: A Survey](https://arxiv.org/pdf/2312.03863)
[^2]: [A review of state-of-the-art techniques for large language model compression](https://link.springer.com/article/10.1007/s40747-025-02019-z#:~:text=The%20rapid%20advancement%20of,cloud%20infrastructures.&text=and%20neural%20architecture%20search,cloud%20infrastructures.&text=further%20highlights%20trends%20and,cloud%20infrastructures.&text=only%20synthesizes%20recent%20advancements,cloud%20infrastructures.)