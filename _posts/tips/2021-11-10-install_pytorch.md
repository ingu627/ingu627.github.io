---
layout: single
title: "Windows10 PyTorch 설치: CUDA 버전 선택과 conda/pip 설치 커맨드"
excerpt: "Windows10에서 CUDA 호환표 확인 후 conda·pip 중 선택해 PyTorch 특정 버전을 설치하고 import torch로 GPU 인식 검증"
categories: tips
tags: [tip, pytorch, install, 파이토치 설치, conda, pip, 윈도우10, 윈도우, 딥러닝]
sidebar_main: false

last_modified_at: 2022-03-25
---

<br>
<br>

## 설치하기

## 1. PyTorch 공식 사이트 들어가기 : [https://pytorch.org/](https://pytorch.org/)

<br>
<br>

## 2. `Prvious versions of PyTorch1` 클릭

![image](https://user-images.githubusercontent.com/78655692/141055817-ee4c44d4-2f04-4089-8334-83a1df1ed648.png)

<br>
<br>

## 3. CUDA 버전에 맞는 pytorch 설치

![image](https://user-images.githubusercontent.com/78655692/160165414-a2ee8389-fce6-48e4-a644-8b26fae23e70.png)

`pip install torch==1.7.1+cu110 torchvision==0.8.2+cu110 torchaudio==0.7.2 -f https://download.pytorch.org/whl/torch_stable.html`

<br>
<br>

## 4. 실행창에 코드 넣고 enter

![image](https://user-images.githubusercontent.com/78655692/141056063-5b2a8dd3-7630-486e-af56-85f8cc1e0e58.png)

<br>
<br>

## pytorch 실행시 GPU 작동 확인

```python
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print('Device:', device)
print('Current cuda device:', torch.cuda.current_device())
print('Count of using GPUs:', torch.cuda.device_count())
```

![image](https://user-images.githubusercontent.com/78655692/141098114-072338e8-470c-4cbe-8427-7d8a8fff090c.png)