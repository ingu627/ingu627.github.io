---
layout: single
title: "[2022최신] 텐서플로우(tensorflow), 파이토치(pytorch) GPU 설치 방법"
excerpt : "NVIDIA DRIVER, CUDA Toolkit, Cudnn, tensorflow 최신 버전 2.8을 설치합니다. 윈도우10 환경에서 작업하여 쓴 글입니다."
categories: tips
tag : [tip, cuda, install, gpu, 텐서플로, 설치, 윈도우10, 쿠다, 파이토치, Cudnn, pytorch, window]

toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-03-20
---


기존에 글을 썼지만, tensorflow 2.4버전을 쓰면 쓸수록 오류가 났었기 때문에 최신 버전을 설치하려고 결정했습니다. <br><br> **Pytorch** : pytorch==1.9.0 torchvision==0.10.0 torchaudio==0.9.0 <br> **Tensorflow** : CUDA==11.3 cuDNN==8.2.1 tensorflow : 2.8.0 tensorflow-gpu : 2.8.0 <br> **Python** : 3.9 <br> **OS** : Window 10 <br> **NVIDIA GPU Driver** : 465.xx.xx 이상
{: .notice--danger}

<br>
<br>

## 순서

- 참고 : <https://www.tensorflow.org/install/gpu>

  1. Anaconda
  2. NVIDIA DRIVER
  3. Visual Studio
  4. CUDA Toolkit
  5. Cudnn
  6. 가상환경

![image](https://user-images.githubusercontent.com/78655692/140860532-9fbbd1ac-e6ac-4f9a-8ea2-8447b1482dbe.png)

<br>
<br>

## 1. 아나콘다 설치

- ANACONDA 사이트 링크 : <https://www.anaconda.com/products/individual>

![image](https://user-images.githubusercontent.com/78655692/159163708-d344c839-6f2d-4c5b-b156-9ae68411a5a4.png)

<br>

![image](https://user-images.githubusercontent.com/78655692/159163720-2d519413-7226-48e4-8563-8279f155fc2a.png)

<br>
<br>

## 2. NVIDIA DRIVER 설치

- 본인의 GPU 모델 선택

- NVIDIA 드라이버 링크 : <https://www.nvidia.com/download/index.aspx?lang=en-us>

![image](https://user-images.githubusercontent.com/78655692/159163794-5476ca7e-9b52-447f-b956-e8bf96bbf039.png)

<br>
<br>

## 3. Visual Studio 설치

- Visual Studio 링크 : <https://visualstudio.microsoft.com/ko/downloads/>

![image](https://user-images.githubusercontent.com/78655692/159163938-2d972336-6318-4e4d-8fce-6838e71b8c3f.png)

<br>
<br>

## 4. CUDA Toolkit 버전 확인

- CUDA Toolkit window(윈도우) 링크 : <https://www.tensorflow.org/install/source_windows#tested_build_configurations>

![image](https://user-images.githubusercontent.com/78655692/159164021-a3dc15ac-53db-410e-a804-b4de5f1bfc24.png)

<br>

- 여기에는 없지만, 우리가 설치할 버전은
  - tensorflow_gpu : 2.8.0 
  - Python 버전 : 3.9
  - cuDNN : 8.2.1
  - CUDA : 11.3

<br>
<br>

## 5. CUDA 설치

- CUDA Toolkit 링크 : <https://developer.nvidia.com/cuda-toolkit-archive>

![image](https://user-images.githubusercontent.com/78655692/159164129-b1a9d4b4-113e-43cd-87df-899da5062b0b.png)

<br>

![image](https://user-images.githubusercontent.com/78655692/159164165-66401ef1-76cf-4c35-ab0c-fc18a0efac4d.png)


<br>
<br>

## 6. cuDNN 설치

- cuDNN은 엔비디아 회원가입 및 로그인이 필요하다.
- cuDNN 링크 : <https://developer.nvidia.com/cudnn>

![image](https://user-images.githubusercontent.com/78655692/159164251-9978e4a5-9fd1-410d-9edb-ffe7ebe0469b.png)

![image](https://user-images.githubusercontent.com/78655692/159164282-87941eed-fcf5-47c8-bc4f-e3c29c3683b5.png)

<br>

- 파일 덮어쓰기 : 다운로드 받은 파일의 압축을 풀고, 아래의 디렉토리에 파일을 덮어씌움
  - 그 전에 CUDA 설치 과정까지 완료하기!

- `cudnn-11.3-windows-x64-v8.2.1.32` 압축 파일을 풀면 아래처럼 나오는데 

![image](https://user-images.githubusercontent.com/78655692/159164710-e506de50-99bf-4ab0-aa9e-2feb656b6151.png)


- `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.3` 여기에 `bin`, `include`, `lib` 폴더를 각각 들어가 안의 파일들을 복사.

<br>
<br>

## 7. 환경변수 설정

![image](https://user-images.githubusercontent.com/78655692/141051481-d8806d86-07f7-46f9-aa80-8c77fdd7a097.png)

![image](https://user-images.githubusercontent.com/78655692/141051518-0487ed1b-f707-4875-ab09-3c3f0fa8f267.png)

![image](https://user-images.githubusercontent.com/78655692/141051604-add55c2e-3f30-4a6c-a904-15ad77860ea4.png)

![image](https://user-images.githubusercontent.com/78655692/159165151-22e03f12-c415-40d2-adcb-02b16fdf23f7.png)

<br>
<br>

## 8. 가상환경 

- 가상 환경을 생성하는 이유는 다른 프로젝트들과 라이브버리 충돌을 피하기 위해.

- `Anaconda Powershell Prompt (anaconda3)` 실행

![image](https://user-images.githubusercontent.com/78655692/140862457-a782c74a-b5b1-4602-8a8d-6ebcd38d80bf.png)

- **conda update** : `conda update -n base conda`
- **가상 환경 설치** : `conda create -n 가상환경이름 python=3.9`
- **가상 환경 활성화** : `conda activate 가상환경 이름`
- **기본적인 패키지 설치**
  - `pip install tensorflow==2.8.0`
  - ~~`pip install tf-nightly`~~
  - `pip install pandas matplotlib seaborn scipy`
  - `pip install tensorflow-gpu==2.8.0`
  - `pip install keras`
  - `conda install pytorch==1.9.0 torchvision==0.10.0 torchaudio==0.9.0 cudatoolkit=11.3 -c pytorch -c conda-forge`
  - `pip install jupyter notebook`
  - `pip install ipykernel`
  - `python -m ipykernel install --user --name 가상환경이름 --display-name 표시할 가상환경 이름`

<br>
<br>

### 기타

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

### GPU 확인

```python
from tensorflow.python.client import device_lib
print(device_lib.list_local_devices())
```

![image](https://user-images.githubusercontent.com/78655692/141671882-b12399ab-9387-42ef-9869-c11f2a2fa43d.png)


이렇게 뜨면 잘 설치가 된 것이다.



<br>
<br>
<br>
<br>