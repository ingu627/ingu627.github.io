---
layout: single
title: "Windows10 TensorFlow GPU: CUDA·cuDNN 버전 매칭 & 설치 검증"
excerpt: "TensorFlow GPU 실행을 위한 CUDA·cuDNN 버전 선정, 환경변수(PATH) 구성과 tf.config.list_physical_devices('GPU')로 검증하는 절차"
categories: tips
tags: [tip, cuda, install, gpu, 텐서플로, 설치, 윈도우10]

toc: true
toc_sticky: false
sidebar_main: false

last_modified_at: 2022-03-20
redirect_from:
  - /tips/install_cuda/
---
## UPDATE (2021.11.10)

- *재설치할 때는 가상환경과 프로그램 모두 지우고 다시 설치* 
- CUDA : 11.0, cuDNN : 8.0, tensorflow_gpu-2.4.0, ~~python==3.7~~ - **무조건 python==3.6으로 깔아본다.**
- **install 성공. GPU 사용 성공**
- 아래는 10.1을 기준으로 작성했다. CUDA 11을 적용하고 싶으면 10.1에서 11만 바꿔주면 된다.

![image](https://user-images.githubusercontent.com/78655692/141088104-68bf5092-ea63-436f-9c94-a4d35b26488d.png)


<br/>
<br/>


## 순서

- 참고 : https://www.tensorflow.org/install/gpu

1. Anaconda
2. NVIDIA DRIVER
3. Visual Studio
4. CUDA Toolkit
5. Cudnn
6. 가상환경

<br>
<br>

## 나의 환경

- CPU : I7-6700HQ
- GPU : GTX1070 (NOTEBOOK)
- RAM : 16GB
- OS : Window10 64-bit

![image](https://user-images.githubusercontent.com/78655692/140860532-9fbbd1ac-e6ac-4f9a-8ea2-8447b1482dbe.png)

<br>
<br>

## 1. 아나콘다 설치

ANACONDA site link : [https://www.anaconda.com/products/individual](https://www.anaconda.com/products/individual)

![image](https://user-images.githubusercontent.com/78655692/140858868-6c17da63-8224-4123-bf46-28ffcb772f13.png)

+ **<span style="color:red">텐서플로는 파이썬 3.7 버전의 패키지를 제공하지 않기 때문에 아나콘다 5.3 버전을 설치하면 tensorflow를 설치할 수 없다고 한다. (파이썬 3.6 버전으로 다운그레이드 필요)</span>**

<br>
<br>

## 2. NVIDIA DRIVER 설치

- 본인의 GPU 모델 선택

NVIDIA DRIVER link : [https://www.nvidia.com/download/index.aspx?lang=en-us](https://www.nvidia.com/download/index.aspx?lang=en-us)

![image](https://user-images.githubusercontent.com/78655692/140859318-d8d2c16f-8a77-46e8-b365-d44315ada069.png)

<br>
<br>

## 3. Visual Studio 설치

Visual Studio link : [https://visualstudio.microsoft.com/ko/downloads/](https://visualstudio.microsoft.com/ko/downloads/)

![image](https://user-images.githubusercontent.com/78655692/140862114-33c3a7f2-387c-4d07-971a-669f849a14eb.png)

<br>
<br>

## 3. CUDA Toolkit

- **자기에게 맞는 버전을 확인한다. <span style="color:red">(매우 중요!!!)</span>**

CUDA Toolkit window(윈도우) link : [https://www.tensorflow.org/install/source_windows#tested_build_configurations](https://www.tensorflow.org/install/source_windows#tested_build_configurations)

![image](https://user-images.githubusercontent.com/78655692/140859991-fc7918bc-5fed-428c-8088-873891de0926.png)


![image](https://user-images.githubusercontent.com/78655692/140859931-3bf2d8d0-3335-4fae-91bd-9aa22d5ed956.png)

<br>
<br>

## 4. CUDA 설치

CUDA Toolkit Archive : [https://developer.nvidia.com/cuda-toolkit-archive](https://developer.nvidia.com/cuda-toolkit-archive)

![image](https://user-images.githubusercontent.com/78655692/140860284-cba42646-b76c-4078-995f-b36db7644793.png)

![image](https://user-images.githubusercontent.com/78655692/140861225-eb032b2e-a497-4b21-b0bf-47695a7532ef.png)

<br>
<br>

## 5. cuDNN 설치

- cuDNN은 엔비디아 회원가입 및 로그인이 필요하다.
- **반드시 버전에 맞게 설치해준다.**

cuDNN link : [https://developer.nvidia.com/cudnn](https://developer.nvidia.com/cudnn)

![image](https://user-images.githubusercontent.com/78655692/140861718-70b2f48e-e9a6-49f1-a0c9-8471759e481b.png)

![image](https://user-images.githubusercontent.com/78655692/140861827-24bdb28b-d07a-4d2a-9778-1f9e29340072.png)

![image](https://user-images.githubusercontent.com/78655692/140861922-003339e1-0fe1-4a3c-bc23-335bd0f840bd.png)

![image](https://user-images.githubusercontent.com/78655692/141049275-5ae863a1-a9a7-438c-a63e-393d9dce79db.png)


- 파일 덮어쓰기 : 다운로드 받은 파일의 압축을 풀고, 아래의 디렉토리에 파일을 덮어씌움

`C:\Program Files\NVIDIA GPU Computing Toolkit CUDA v10.1`

![image](https://user-images.githubusercontent.com/78655692/141049509-e8cd1b3d-5821-4186-9d0f-0d0f9d3a6334.png)

- `bin`, `include`, `lib` 폴더를 각각 들어가 안의 파일들을 복사.

<br>
<br>

## 5_1. 설치 확인 

![image](https://user-images.githubusercontent.com/78655692/141050089-8c671f02-9ca7-4ce3-8e94-019b7d48eb0b.png)

- 클릭 후 검색창에 `cuda`라 쳤을 때 프로그램이 나오면 성공!!

<br>
<br>

## 5_2. 환경변수 설정

- 추가할 경로는 앞에서 복사해서 넣었던 bin, include, lib의 경로를 설정해준다.

![image](https://user-images.githubusercontent.com/78655692/141051481-d8806d86-07f7-46f9-aa80-8c77fdd7a097.png)

![image](https://user-images.githubusercontent.com/78655692/141051518-0487ed1b-f707-4875-ab09-3c3f0fa8f267.png)

![image](https://user-images.githubusercontent.com/78655692/141051604-add55c2e-3f30-4a6c-a904-15ad77860ea4.png)

![image](https://user-images.githubusercontent.com/78655692/141051769-1464f5ad-6b73-4c3d-9e42-6e0ba572e177.png)

<br>
<br>

## 6. 가상환경 

- 가상 환경을 생성하는 이유는 다른 프로젝트들과 라이브버리 충돌을 피하기 위해.

- `Anaconda Powershell Prompt (anaconda3)` 실행

![image](https://user-images.githubusercontent.com/78655692/140862457-a782c74a-b5b1-4602-8a8d-6ebcd38d80bf.png)

- **conda update** : `conda update -n base conda`
- **가상 환경 설치** : `conda create -n 가상환경이름 python=3.6`
- **가상 환경 활성화** : `conda activate 가상환경 이름`
- **기본적인 패키지 설치**
  - `pip install tensorflow==2.2.0`
  - ~~`pip install tf-nightly`~~
  - `pip install pandas matplotlib seaborn scipy`
  - `pip install tensorflow-gpu==2.2.0`
  - `pip install keras==2.2.4`
  - `pip install jupyter notebook`
  - `pip install ipykernel`
  - `python -m ipykernel install --user --name 가상환경이름 --display-name 표시할 가상환경 이름`

<br>
<br>

## GPU 확인

```python
from tensorflow.python.client import device_lib
print(device_lib.list_local_devices())
```

![image](https://user-images.githubusercontent.com/78655692/141671882-b12399ab-9387-42ef-9869-c11f2a2fa43d.png)


이렇게 뜨면 잘 설치가 된 것이다.

<br>
<br>

## 기타

- **가상환경 리스트 확인** : `conda env list`
- **가상환경 비활성화** : `conda deactivate`
- **가상환경 삭제** : `conda remove -n 가상환경이름 --all` 후 `y` 클릭
- **경로 변경** : `cd 경로주소`
- **파이썬 셸 실행** : `python`
- **파이썬 셸 종료** : `exit()` or `ctrl+z`
- **설치된 모든 라이브러리 확인** : `pip freeze`

<br/>

- **cuda 버전 확인** : `nvcc --version` (cmd 창)
- **GPU util 확인** :`nvida-smi` (cmd 창)

<br>
<br>

## References

- 파이썬/아나콘다 다운로드 방법 - 한양대학교 전기공학과 배성우 교수님 연구실(PESL) 장문석  
- [Tensorflow 공식 사이트](https://www.tensorflow.org/install/gpu)
- [GPU 사용을 위한 CUDA 환경 구성하기](https://velog.io/@mactto3487/%EB%94%A5%EB%9F%AC%EB%8B%9D-GPU-%ED%99%98%EA%B2%BD-%EA%B5%AC%EC%84%B1%ED%95%98%EA%B8%B0)
- [Tensorflow와 호환되는 CUDA, cuDNN 설치하는 법](https://coding-groot.tistory.com/87)
- [모두의 근삼이](https://ykarma1996.tistory.com/99)
- [[Windows 10] Pytorch GPU 사용을 위한 CUDA 환경 만들기](https://data-panic.tistory.com/4)
- [아나콘다에 Tensorflow,Keras 설치하는 방법 ( 오류해결 )](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=badzoo&logNo=221450305996)