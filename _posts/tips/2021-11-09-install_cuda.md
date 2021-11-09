---
layout: single
title: "딥러닝을 위한 텐서플로우(tensorflow) GPU 설치 방법"
excerpt : "NVIDIA DRIVER, CUDA Toolkit, Cudnn"
categories: tips
tag : [tip, cuda, install, gpu]
author_profile: false

last_modified_at: 2021-11-09
---

## 순서

- 참고 : https://www.tensorflow.org/install/gpu

1. Anaconda
2. NVIDIA DRIVER
3. Visual Studio
4. CUDA Toolkit
5. Cudnn
6. 가상환경

## 나의 환경

- CPU : I7-6700HQ
- GPU : GTX1070 (NOTEBOOK)
- RAM : 16GB
- OS : Window10 64-bit

![image](https://user-images.githubusercontent.com/78655692/140860532-9fbbd1ac-e6ac-4f9a-8ea2-8447b1482dbe.png)


## 1. 아나콘다 설치

ANACONDA site link : https://www.anaconda.com/products/individual

![image](https://user-images.githubusercontent.com/78655692/140858868-6c17da63-8224-4123-bf46-28ffcb772f13.png)


## 2. NVIDIA DRIVER 설치

- 본인의 GPU 모델 선택

NVIDIA DRIVER link : https://www.nvidia.com/download/index.aspx?lang=en-us

![image](https://user-images.githubusercontent.com/78655692/140859318-d8d2c16f-8a77-46e8-b365-d44315ada069.png)

## 3. Visual Studio 설치

Visual Studio link : https://visualstudio.microsoft.com/ko/downloads/

![image](https://user-images.githubusercontent.com/78655692/140862114-33c3a7f2-387c-4d07-971a-669f849a14eb.png)


## 3. CUDA Toolkit

- **자기에게 맞는 버전을 확인한다. <span style="color:red">(매우 중요!!!)</span>**

CUDA Toolkit window(윈도우) link : https://www.tensorflow.org/install/source_windows#tested_build_configurations

![image](https://user-images.githubusercontent.com/78655692/140859991-fc7918bc-5fed-428c-8088-873891de0926.png)


![image](https://user-images.githubusercontent.com/78655692/140859931-3bf2d8d0-3335-4fae-91bd-9aa22d5ed956.png)


## 4. CUDA 설치

CUDA Toolkit Archive : https://developer.nvidia.com/cuda-toolkit-archive

![image](https://user-images.githubusercontent.com/78655692/140860284-cba42646-b76c-4078-995f-b36db7644793.png)

![image](https://user-images.githubusercontent.com/78655692/140861225-eb032b2e-a497-4b21-b0bf-47695a7532ef.png)


## 5. cuDNN 설치

- cuDNN은 엔비디아 회원가입 및 로그인이 필요하다.
- **반드시 버전에 맞게 설치해준다.**

cuDNN link : https://developer.nvidia.com/cudnn

![image](https://user-images.githubusercontent.com/78655692/140861718-70b2f48e-e9a6-49f1-a0c9-8471759e481b.png)

![image](https://user-images.githubusercontent.com/78655692/140861827-24bdb28b-d07a-4d2a-9778-1f9e29340072.png)

![image](https://user-images.githubusercontent.com/78655692/140861922-003339e1-0fe1-4a3c-bc23-335bd0f840bd.png)

- 파일 덮어쓰기 : 다운로드 받은 파일의 압축을 풀고, 아래의 디렉토리에 파일을 덮어씌움

`Program Files NVIDIA GPU Computing Toolkit CUDA v10.1`


## 6. 가상환경 

- 가상 환경을 생성하는 이유는 다른 프로젝트들과 라이브버리 충돌을 피하기 위해.

- `Anaconda Powershell Prompt (anaconda3)` 실행

![image](https://user-images.githubusercontent.com/78655692/140862457-a782c74a-b5b1-4602-8a8d-6ebcd38d80bf.png)

- 가상 환경 설치 : `conda create -n 가상환경이름 python=3.6`
- 가상 환경 활성화 : `conda activate 가상환경 이름`
- 기본적인 패키지 설치
  - `pip install numpy`
  - `pip install pandas`
  - `pip install matplotlib`
  - `pip install tensorflow==2.2.0`
  - `pip install tensorflow-gpu==2.2.0`
  - `pip install keras==2.2.4`
  - `pip install jupyter notebook`
  - `pip install ipykernel`
  - `python -m ipykernel install --user --name 가상환경이름`

## GPU 확인

![image](https://user-images.githubusercontent.com/78655692/140863298-572a26a8-41ae-4c89-9143-9bf3fcc87d9c.png)

이렇게 뜨면 잘 설치가 된 것이다.



## References

- 파이썬/아나콘다 다운로드 방법 - 한양대학교 전기공학과 배성우 교수님 연구실(PESL) 장문석  
- [Tensorflow 공식 사이트](https://www.tensorflow.org/install/gpu)
- [GPU 사용을 위한 CUDA 환경 구성하기](https://velog.io/@mactto3487/%EB%94%A5%EB%9F%AC%EB%8B%9D-GPU-%ED%99%98%EA%B2%BD-%EA%B5%AC%EC%84%B1%ED%95%98%EA%B8%B0)
- [Tensorflow와 호환되는 CUDA, cuDNN 설치하는 법](https://coding-groot.tistory.com/87)