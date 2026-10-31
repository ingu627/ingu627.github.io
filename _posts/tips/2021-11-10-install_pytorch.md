---
layout: single
title: "[WINDOWS10 환경] 딥러닝을 위한 파이토치(pytorch) 설치 방법"
excerpt: "windows10 환경 pytorch cuda11.0"
categories: tips
tags: [tip, pytorch, install, 파이토치 설치, conda, pip, 윈도우10, 윈도우, 딥러닝]
sidebar_main: false

last_modified_at: 2026-10-11
---

Windows10 환경에서 CUDA 11.0에 맞는 PyTorch를 설치하는 과정을 정리한 글이다. PyTorch 공식 사이트에서 이전 버전 목록을 열어 CUDA 버전에 맞는 설치 명령을 실행하고, 설치 후 GPU가 정상 동작하는지 확인한다.

> 이 글은 2021년 당시 PyTorch 1.7.1(CUDA 11.0) 기준으로 작성된 설치 기록이다. 최신 버전에서는 명령이 다를 수 있다.

## 설치하기

## 1. PyTorch 공식 사이트 들어가기 : [https://pytorch.org/](https://pytorch.org/)

## 2. `Previous versions of PyTorch` 클릭

![image](/assets/images/legacy/78d48a3646.webp)

## 3. CUDA 버전에 맞는 pytorch 설치

![image](/assets/images/legacy/6a5cde86b6.webp)

`pip install torch==1.7.1+cu110 torchvision==0.8.2+cu110 torchaudio==0.7.2 -f https://download.pytorch.org/whl/torch_stable.html`

## 4. 실행창에 코드 넣고 enter

![image](/assets/images/legacy/7c7deab4b0.webp)

## pytorch 실행시 GPU 작동 확인

```python
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print('Device:', device)
print('Count of using GPUs:', torch.cuda.device_count())
if torch.cuda.is_available():
    print('Current cuda device:', torch.cuda.current_device())
```

![image](/assets/images/legacy/f7ffa3b234.webp)

## 한계 및 주의사항

- 이 글의 PyTorch 1.7.1 및 CUDA 11.0 설치 조합은 2021년 기준 환경이다. 최신 Python 버전이나 최신 세대 GPU(RTX 30/40 시리즈 등)에서는 지원되는 PyTorch 및 CUDA 조합이 달라지므로, 공식 설치 매트릭스를 확인하여 알맞은 버전을 선택해야 한다. [^1]
- CPU 전용 환경에서는 `torch.cuda.is_available()`이 False를 반환하므로, GPU 전용 메서드(`current_device()`) 호출 전 반드시 조건부 검사를 거쳐야 런타임 오류를 방지할 수 있다. [^2]
- `torchvision`, `torchaudio`는 PyTorch 코어 버전과 버전 숫자가 서로 다르므로(예: PyTorch 1.7.1에 torchvision 0.8.2 / torchaudio 0.7.2), 공식 설치 매트릭스에 안내된 호환 조합에 맞춰 함께 설치해야 한다. [^1]

## References

[^1]: [PyTorch Previous Versions](https://pytorch.org/get-started/previous-versions/)
[^2]: [PyTorch CUDA Semantics](https://pytorch.org/docs/stable/notes/cuda.html)