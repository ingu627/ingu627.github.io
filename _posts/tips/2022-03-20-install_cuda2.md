---
layout: single
title: "텐서플로우(tensorflow), 파이토치(pytorch) GPU 설치 방법"
excerpt : "NVIDIA DRIVER, CUDA Toolkit, cuDNN, TensorFlow 2.8 및 PyTorch 1.9 GPU 환경 구축 절차를 정리한다. Windows 10 환경에서의 설정 기준이다."
categories: tips
tags: [tip, cuda, install, gpu, 텐서플로, 설치, 윈도우10, 쿠다, 파이토치, Cudnn, pytorch, window, 아나콘다, tensorflow, 윈도우]

toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2026-10-11
---


기존에 TensorFlow 2.4 환경을 운용하면서 런타임 충돌과 라이브러리 비호환 오류가 발생했기 때문에, 안정적인 빌드 구성을 확인하고 TensorFlow 2.8.0 및 PyTorch 1.9.0 GPU 환경을 구축하기로 결정했다.

- **PyTorch** : `pytorch==1.9.0` `torchvision==0.10.0` `torchaudio==0.9.0` (CUDA 11.3 연동)[^pytorch-prev]
- **TensorFlow** : `CUDA==11.3` `cuDNN==8.2.1` `tensorflow==2.8.0` `tensorflow-gpu==2.8.0`[^tf-windows-source]
- **Python** : 3.9
- **NVIDIA GPU Driver** : 465.xx.xx 이상[^nvidia-driver]

**컴퓨터 환경**

- **OS** : Window 10
- **CPU** : i7-6700HQ
- **GPU** : GTX1070
- **Memory** : 16 GB


## 순서

- 아래 순서대로 설치를 진행한다.
- 딥러닝 프레임워크(TensorFlow, PyTorch)는 CUDA 드라이버와 런타임, cuDNN 가속 라이브러리를 거쳐 GPU 하드웨어에서 연산을 수행한다[^dl-stack].
- 참고 : <https://www.tensorflow.org/install/gpu>[^tf-gpu]


  1. Anaconda
  2. NVIDIA DRIVER
  3. Visual Studio
  4. CUDA Toolkit
  5. cuDNN
  6. 가상환경

![image](https://user-images.githubusercontent.com/78655692/140860532-9fbbd1ac-e6ac-4f9a-8ea2-8447b1482dbe.png)


## 1. 아나콘다 설치

- [ANACONDA 사이트 링크](https://www.anaconda.com/products/individual)

![image](https://user-images.githubusercontent.com/78655692/159163708-d344c839-6f2d-4c5b-b156-9ae68411a5a4.png)


![image](https://user-images.githubusercontent.com/78655692/159163720-2d519413-7226-48e4-8563-8279f155fc2a.png)


## 2. NVIDIA DRIVER 설치

- 본인의 GPU 모델을 선택한다.

- [NVIDIA 드라이버 다운로드 링크](https://www.nvidia.com/download/index.aspx?lang=en-us)[^nvidia-driver]

![image](https://user-images.githubusercontent.com/78655692/159163794-5476ca7e-9b52-447f-b956-e8bf96bbf039.png)


## 3. Visual Studio 설치

- [Visual Studio 공식 다운로드 링크](https://visualstudio.microsoft.com/ko/downloads/)[^vs-download]
- CUDA 컴파일러(nvcc)의 호스트 C++ 빌드 도구로 Visual Studio C++ 컴파일러가 요구된다.

![image](https://user-images.githubusercontent.com/78655692/159163938-2d972336-6318-4e4d-8fce-6838e71b8c3f.png)


## 4. CUDA Toolkit 버전 확인

- [TensorFlow Windows 테스트 빌드 구성 링크](https://www.tensorflow.org/install/source_windows#tested_build_configurations)[^tf-windows-source]
- 찾는 버전이 없다면 : [CUDA/Cudnn/Driver/GCC/TensorFlow/Python version compatibility charts 링크](https://transang.me/cuda-cudnn-driver-gcc-tensorflow-python-version-compatibility-charts/)

![image](https://user-images.githubusercontent.com/78655692/159164021-a3dc15ac-53db-410e-a804-b4de5f1bfc24.png)


- 여기에는 없지만, 우리가 설치할 버전은 다음과 같다.
  - tensorflow_gpu : 2.8.0 
  - Python 버전 : 3.9
  - cuDNN : 8.2.1
  - CUDA : 11.3


## 5. CUDA 설치

- [NVIDIA CUDA Toolkit Archive 링크](https://developer.nvidia.com/cuda-toolkit-archive)[^cuda-archive]

![image](https://user-images.githubusercontent.com/78655692/159164129-b1a9d4b4-113e-43cd-87df-899da5062b0b.png)


![image](https://user-images.githubusercontent.com/78655692/159164165-66401ef1-76cf-4c35-ab0c-fc18a0efac4d.png)


## 6. cuDNN 설치

- cuDNN은 NVIDIA 개발자 회원가입 및 로그인이 필요하다.
- [NVIDIA cuDNN 공식 페이지 링크](https://developer.nvidia.com/cudnn)[^cudnn-home]

![image](https://user-images.githubusercontent.com/78655692/159164251-9978e4a5-9fd1-410d-9edb-ffe7ebe0469b.png)

![image](https://user-images.githubusercontent.com/78655692/159164282-87941eed-fcf5-47c8-bc4f-e3c29c3683b5.png)


- 파일 덮어쓰기 : 다운로드한 파일의 압축을 풀고, 아래 디렉터리에 파일을 복사해 덮어쓴다.
  - 그 전에 CUDA Toolkit 설치를 먼저 완료해야 한다.

- `cudnn-11.3-windows-x64-v8.2.1.32` 압축 파일을 해제하면 다음과 같은 폴더가 나타난다.

![image](https://user-images.githubusercontent.com/78655692/159164710-e506de50-99bf-4ab0-aa9e-2feb656b6151.png)


- `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.3` 여기에 `bin`, `include`, `lib` 폴더를 각각 들어가 안의 파일들을 복사한다.


## 7. 환경변수 설정

- 시스템 환경 변수 편집에서 사용자 변수의 `Path`를 편집하여 CUDA 실행 및 라이브러리 경로를 등록한다.

![image](https://user-images.githubusercontent.com/78655692/141051481-d8806d86-07f7-46f9-aa80-8c77fdd7a097.png)

![image](https://user-images.githubusercontent.com/78655692/141051518-0487ed1b-f707-4875-ab09-3c3f0fa8f267.png)

![image](https://user-images.githubusercontent.com/78655692/141051604-add55c2e-3f30-4a6c-a904-15ad77860ea4.png)

![image](https://user-images.githubusercontent.com/78655692/159165151-22e03f12-c415-40d2-adcb-02b16fdf23f7.png)


## 8. 가상환경 

- 가상 환경을 생성하는 이유는 프로젝트 간 패키지 의존성과 라이브러리 충돌을 방지하기 위함이다.

- `Anaconda Powershell Prompt (anaconda3)` 실행

![image](https://user-images.githubusercontent.com/78655692/140862457-a782c74a-b5b1-4602-8a8d-6ebcd38d80bf.png)

- **conda update** : `conda update -n base conda`
- **가상 환경 설치** : `conda create -n 가상환경이름 python=3.9`
- **가상 환경 활성화** : `conda activate 가상환경 이름`
- **기본적인 패키지 설치**
  - `pip install --upgrade pip --user`
  - `pip install tensorflow==2.8.0`
  - ~~`pip install tf-nightly`~~
  - `pip install pandas matplotlib seaborn scipy sklearn`
  - `pip install tensorflow-gpu==2.8.0`
  - `pip install keras`
  - `pip3 install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu113`
  - `pip install jupyter notebook`
  - `pip install ipykernel`
  - `python -m ipykernel install --user --name 가상환경이름 --display-name 표시할 가상환경 이름`


### 기타

- **가상환경 리스트 확인** : `conda env list`
- **가상환경 비활성화** : `conda deactivate`
- **가상환경 삭제** : `conda remove -n 가상환경이름 --all` 후 `y` 입력
- **경로 변경** : `cd 경로주소`
- **파이썬 셸 실행** : `python`
- **파이썬 셸 종료** : `exit()` or `ctrl+z`
- **설치된 모든 라이브러리 확인** : `pip freeze`

- **cuda 버전 확인** : `nvcc --version` (cmd 창)
- **GPU util 확인** : `nvidia-smi` (cmd 창)


### GPU 확인

- **tensorflow**

```python
from tensorflow.python.client import device_lib
print(device_lib.list_local_devices())
```

![image](https://user-images.githubusercontent.com/78655692/141671882-b12399ab-9387-42ef-9869-c11f2a2fa43d.png)

- **pytorch**

```python
import torch

DEVICE = ("cuda" if torch.cuda.is_available() else "cpu")
print(DEVICE)
# 결과: cuda
```

- 위의 결과가 나오면 설치가 정상 완료된 것이다.


## 한계 및 주의사항

1. **Windows 네이티브 GPU 지원 종료**: TensorFlow는 2.10 버전을 마지막으로 Windows 네이티브 환경에서의 GPU 가속(`tensorflow-gpu`) 지원을 공식 중단했다[^tf-windows-native]. TensorFlow 2.11 이후 최신 릴리스에서 GPU를 활용하려면 WSL2(Windows Subsystem for Linux 2) 기반 Linux 환경을 구축해야 한다.
2. **CUDA 툴킷 및 프레임워크 바이너리 종속성**: TensorFlow 2.8.0은 CUDA 11.2~11.3 및 cuDNN 8.1~8.2 런타임 바이너리와 정합하도록 사전 컴파일되어 있다[^tf-windows-source]. 상위 CUDA 12.x 툴킷만 단독 설치할 경우 DLL 로드 실패(`ImportError: DLL load failed while importing _pywrap_tensorflow_internal`)가 발생한다. 동일 가상환경에서 PyTorch를 함께 사용할 때도 PyTorch wheel 빌드 플래그(`cu113`)를 일치시켜야 런타임 충돌을 방지할 수 있다[^pytorch-prev].
3. **GPU 하드웨어 아키텍처 제약**: 본문에서 사용한 GTX 1070은 파스칼(Pascal) 아키텍처(Compute Capability 6.1) 기반으로, 튜링(Turing) 또는 암페어(Ampere) 아키텍처 이후 도입된 텐서 코어(Tensor Core) 하드웨어 가속(FP16/BF16 혼합 정밀도 훈련)을 지원하지 않는다. 따라서 상위 모델 훈련 시에는 GPU 아키텍처 호환성과 하드웨어 요구사양을 사전에 점검해야 한다.


## References

[^pytorch-prev]: PyTorch 공식 문서 - 이전 버전 설치 매트릭스 (<https://pytorch.org/get-started/previous-versions/>)
[^tf-windows-source]: TensorFlow 공식 문서 - Windows 환경 테스트 빌드 구성 (<https://www.tensorflow.org/install/source_windows#tested_build_configurations>)
[^nvidia-driver]: NVIDIA 공식 드라이버 다운로드 센터 (<https://www.nvidia.com/download/index.aspx>)
[^dl-stack]: NVIDIA Developer - Deep Learning Software Stack (<https://developer.nvidia.com/deep-learning-software>)
[^tf-gpu]: TensorFlow 공식 문서 - GPU 지원 설치 가이드 (<https://www.tensorflow.org/install/gpu>)
[^vs-download]: Microsoft Visual Studio 공식 다운로드 (<https://visualstudio.microsoft.com/ko/downloads/>)
[^cuda-archive]: NVIDIA CUDA Toolkit Archive 공식 문서 (<https://developer.nvidia.com/cuda-toolkit-archive>)
[^cudnn-home]: NVIDIA cuDNN 공식 개발자 페이지 (<https://developer.nvidia.com/cudnn>)
[^tf-windows-native]: TensorFlow 공식 설치 가이드 - Windows 네이티브 환경 GPU 지원 중단 및 WSL2 권장 (<https://www.tensorflow.org/install/pip#windows-native>)