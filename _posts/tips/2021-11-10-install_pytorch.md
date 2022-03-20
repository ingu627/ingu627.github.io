---
layout: single
title: "[WINDOWS10 환경] 딥러닝을 위한 파이토치(pytorch) 설치 방법"
excerpt : "windows10 환경 pytorch cuda11.0"
categories: tips
tag : [tip, pytorch, install, 파이토치 설치]
sidebar_main: true

last_modified_at: 2022-03-20
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

![image](https://user-images.githubusercontent.com/78655692/141055924-842a15ce-5c94-40e1-b7bd-ffdf6bd43c7f.png)

`conda install pytorch==1.7.1 torchvision==0.8.2 torchaudio==0.7.2 cudatoolkit=11.0 -c pytorch`

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