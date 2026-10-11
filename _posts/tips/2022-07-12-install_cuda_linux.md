---
layout: single
title: "Ubuntu 20.04에서 nvidia driver, cuda, cudnn, pytorch 설치의 모든 것"
excerpt: "ubuntu 20.04, nvidia driver 495, cuda 11.3, cudnn 8.2.1, pytorch 버전을 설치하는 방법입니다."
categories: tips
tags: [tip, cuda, install, gpu, ubuntu, nvidia driver, cuda, pytorch, cudnn, 설치, 버전, 확인, 리눅스, linux, 우분투, 가상환경, 삭제, 드라이버, 패키지]

toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2026-10-11
---


ubuntu 20.04에서 nvidia driver 495, cuda 11.3, cudnn 8.2.1, pytorch를 설치하는 방법을 정리한 글이다. 우분투에서 파이썬 가상환경도 만들어본다.


## 기존 nvidia, cuda 완전 삭제

- 혹시 우분투에 nvidia, cuda를 설치한 적이 있다면 해당 명령어를 터미널에 실행해보길 바란다. [^1]

    ```shell
    $ sudo apt-get purge nvidia*
    ```

    ```shell
    $ sudo apt-get autoremove
    ```

    ```shell
    $ sudo apt-get autoclean
    ```

    ```shell
    $ sudo rm -rf /usr/local/cuda*
    ```


## 설치가능한 드라이버 확인

- 그래픽 카드 및 설치 가능한 드라이버를 다음 명령어로 확인해본다.

    ```shell
    $ ubuntu-drivers devices
    ```

![image](https://user-images.githubusercontent.com/78655692/178480486-761c2ecf-6e49-420b-9d02-549e7b11d012.png)


- 이제 설치하고픈 버전을 골라 설치하거나, 자동으로 드라이버를 설치한다. [^2]
- 본인은 `nvidia-driver-495`로 설치해보겠다.

    ```shell
    # 자동으로 드라이버 설치
    $ sudo ubuntu-drivers autoinstall
    ```

    ```shell
    # 원하는 버전 설치
    $ sudo apt install nvidia-driver-495
    ```


- 필요한 경우 커널 업데이트 시 모듈 자동 재빌드를 지원하는 `dkms`와 사용자 공간 장치 노드 생성 도구인 `nvidia-modprobe`를 추가로 설치한다. [^3]

    ```shell
    $ sudo apt-get install dkms nvidia-modprobe
    ```

- 그리고 다음 명령어로 마무리해준다.

    ```shell
    $ sudo apt update
    $ sudo apt upgrade

    # 재부팅
    $ sudo reboot
    ```


- 재부팅 후 설치가 잘 되었는지 확인하기 위해 다음 명령어를 실행해본다.
- 아래처럼 잘 나오면 설치가 잘 된것이다.

    ```shell
    $ nvidia-smi
    ```


<img src='https://user-images.githubusercontent.com/78655692/178487504-86beaa95-4493-49bb-b9fc-608e307a8827.png' width=600>


## cuda 11.3 설치

- cuda 11.3을 설치하기 위해 해당 사이트에 들어간다.
- [NVIDIA DEVELOPER - CUDA Toolkit Archive](https://developer.nvidia.com/cuda-toolkit-archive)
- 그 다음, linux -> x86_64 -> Ubuntu -> 20.04 -> runfile(local)로 가 해당 명령어를 실행한다.

<img src='https://user-images.githubusercontent.com/78655692/178489427-3b4965a6-93f7-4aee-b63d-d75667a3b629.png' width=550>


<img src='https://user-images.githubusercontent.com/78655692/178489726-78544f83-83f6-4e13-af4e-41546adaed37.png' width=550>


```shell
# runfile(local)
$ wget https://developer.download.nvidia.com/compute/cuda/11.3.1/local_installers/cuda_11.3.1_465.19.01_linux.run
$ sudo sh cuda_11.3.1_465.19.01_linux.run
```

```shell
# 만약 위 과정이 안되면 아래 명령어를 실행한다. - deb(local)
$ wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/cuda-ubuntu2004.pin
$ sudo mv cuda-ubuntu2004.pin /etc/apt/preferences.d/cuda-repository-pin-600
$ wget https://developer.download.nvidia.com/compute/cuda/11.3.1/local_installers/cuda-repo-ubuntu2004-11-3-local_11.3.1-465.19.01-1_amd64.deb
$ sudo dpkg -i cuda-repo-ubuntu2004-11-3-local_11.3.1-465.19.01-1_amd64.deb
$ sudo apt-key add /var/cuda-repo-ubuntu2004-11-3-local/7fa2af80.pub
$ sudo apt-get update
$ sudo apt-get -y install cuda
```


- Continue 후, accept, 그 다음 Driver 선택을 해제후 Install 한다.

<img src='https://user-images.githubusercontent.com/78655692/178490764-af6c4dd7-1821-4f43-bf81-8d7fa01b22da.png' width=550>

<img src='https://user-images.githubusercontent.com/78655692/178490957-33b2a570-faa0-47dc-a2de-44f1b83bad17.png' width=550>

<img src='https://user-images.githubusercontent.com/78655692/178491105-46851e2a-0398-4d03-a74b-b68e935cfe05.png' width=550>


- 설치가 잘 진행되었다면 아래 그림처럼 나올 것이다.

![image](https://user-images.githubusercontent.com/78655692/178491438-7219204f-f98e-4421-af53-989902d61472.png)


> 만약 gcc가 없어서 문제가 발생한다면, 다음 명령어를 수행한다.

```shell
$ sudo apt update 
$ sudo apt install build-essential 
$ sudo apt-get install manpages-dev
```

- cuda 버전을 확인하고 싶으면, 다음 명령어를 실행한다.

    ```shell
    $ nvcc -V
    ```

<img src='https://user-images.githubusercontent.com/78655692/178491776-83b209b0-372b-4f9b-b488-ac0fde15cbf0.png' width=400>


- CUDA Toolkit 관련 설정을 환경 변수에 추가하기 위해 다음 명령어를 실행한다. [^4]

    ```shell
    $ sudo sh -c "echo 'export PATH=$PATH:/usr/local/cuda-11.3/bin'>> /etc/profile"
    $ sudo sh -c "echo 'export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/cuda-11.3/lib64'>> /etc/profile"
    $ sudo sh -c "echo 'export CUDARDIR=/usr/local/cuda-11.3'>> /etc/profile"
    $ source /etc/profile
    ```


## cuDNN 설치

- cuDNN을 설치하기 위해 해당 사이트에 접속한다. 
  - [NVIDIA cuDNN](https://developer.nvidia.com/cudnn)
- NVIDIA 계정이 있어야 한다. 없다면 회원가입해야 한다는 점 유의한다.
- 그림에 표시한대로 따라 다운로드 받는다.

![image](https://user-images.githubusercontent.com/78655692/178493921-0e35f854-fb08-46da-b304-7e51d057ccde.png)


![image](https://user-images.githubusercontent.com/78655692/178494017-567dadb0-5f1f-4f78-8500-5218af00875f.png)


![image](https://user-images.githubusercontent.com/78655692/178494120-cc6b23e3-66aa-45ad-88fc-55346dbd4b14.png)


![image](https://user-images.githubusercontent.com/78655692/178494341-c8c50213-1c03-454f-b6a9-077a44a01934.png)


- 다운로드 받은 파일을 압축풀어 파일을 복사한다. 
  - 복사 명령어 : `cp [복사할 디렉토리/파일] [복사될 디렉토리/파일]`
  - 압축 풀기 명령어 : `tar xvzf [압축 파일명]`
  - `*`은 모든 것을 포함한다는 의미

    ```shell
    $ tar xvzf cudnn-11.3-linux-x64-v8.2.1.32.tgz
    $ sudo cp cuda/include/cudnn* /usr/local/cuda/include
    $ sudo cp cuda/lib64/libcudnn* /usr/local/cuda/lib64
    $ sudo chmod a+r /usr/local/cuda/include/cudnn.h /usr/local/cuda/lib64/libcudnn*

    $ sudo ln -sf /usr/local/cuda-11.3/targets/x86_64-linux/lib/libcudnn_adv_train.so.8.2.1 /usr/local/cuda-11.3/targets/x86_64-linux/lib/libcudnn_adv_train.so.8
    $ sudo ln -sf /usr/local/cuda-11.3/targets/x86_64-linux/lib/libcudnn_ops_infer.so.8.2.1  /usr/local/cuda-11.3/targets/x86_64-linux/lib/libcudnn_ops_infer.so.8
    $ sudo ln -sf /usr/local/cuda-11.3/targets/x86_64-linux/lib/libcudnn_cnn_train.so.8.2.1  /usr/local/cuda-11.3/targets/x86_64-linux/lib/libcudnn_cnn_train.so.8
    $ sudo ln -sf /usr/local/cuda-11.3/targets/x86_64-linux/lib/libcudnn_adv_infer.so.8.2.1  /usr/local/cuda-11.3/targets/x86_64-linux/lib/libcudnn_adv_infer.so.8
    $ sudo ln -sf /usr/local/cuda-11.3/targets/x86_64-linux/lib/libcudnn_ops_train.so.8.2.1  /usr/local/cuda-11.3/targets/x86_64-linux/lib/libcudnn_ops_train.so.8
    $ sudo ln -sf /usr/local/cuda-11.3/targets/x86_64-linux/lib/libcudnn_cnn_infer.so.8.2.1 /usr/local/cuda-11.3/targets/x86_64-linux/lib/libcudnn_cnn_infer.so.8
    $ sudo ln -sf /usr/local/cuda-11.3/targets/x86_64-linux/lib/libcudnn.so.8.2.1 /usr/local/cuda-11.3/targets/x86_64-linux/lib/libcudnn.so.8
    ```


- 새로 추가된 라이브러리를 시스템에서 찾을 수 있도록 한다.

    ```shell
    $ sudo ldconfig
    ```


- 다음은 설정이 제대로 되었는지 확인하기 위한 명령어이다.

    ```shell
    ldconfig -N -v $(sed 's/:/ /' <<< $LD_LIBRARY_PATH) 2>/dev/null | grep libcudnn
    ```

    ![image](https://user-images.githubusercontent.com/78655692/178498523-5b1d6c98-052a-4a8f-9e00-5d12477d40df.png)


## python 가상환경 설치

- 먼저 python 버전을 확인하고, venv를 설치해준다. [^5]

    ```shell
    $ python3 --version
    $ sudo apt-get install python3-venv
    ```


- 그다음, 원하는 이름으로 가상환경을 생성한다.

    ```shell
    $ python3 -m venv [가상환경 이름]
    # 예시로
    $ python3 -m venv tf2.8
    ```


- 다음은 가상환경를 활성화하는 과정이다.
- 활성화하면 터미널 앞에 가상환경 이름이 나타날 것이다.

    ```shell
    $ source [가상환경 이름]/bin/activate
    # 예시로
    $ source tf2.8/bin/activate
    ```


- `deactivate`를 실행하면, 가상환경은 종료된다.


## pytorch 및 필수 패키지 설치

- 가상환경을 활성화했다면 다음 패키지를 설치해준다.
  - pytorch는 cuda 11.3에 맞는 버전이다.
  - pytorch 버전을 알고 싶으면 다음 사이트를 참고하길 바란다.
  - [pytorch.org - get_started](https://pytorch.org/get-started/previous-versions/)
- 그외 필요한 패키지는 아래와 같은 방식으로 설치해주면 된다.

    ```shell
    $ pip install --upgrade pip --user
    $ pip install pandas matplotlib seaborn scipy sklearn
    $ pip install jupyter notebook
    $ pip install ipykernel
    $ python -m ipykernel install --user --name 가상환경이름 --display-name 표시할 가상환경 이름

    $ pip install torch==1.11.0+cu113 torchvision==0.12.0+cu113 torchaudio==0.11.0 --extra-index-url https://download.pytorch.org/whl/cu113
    ```


## 한계 및 주의사항

- 이 글의 설치 조합(nvidia driver 495 / CUDA 11.3 / cuDNN 8.2.1 / PyTorch 1.11.0+cu113)은 작성 시점 기준이며, 이후 버전에서는 패키지 이름과 설치 명령이 달라질 수 있다. [^6] [^7]
- `apt`로 설치한 드라이버와 NVIDIA runfile 설치를 섞으면 라이브러리 경로가 충돌할 수 있으므로, 한 가지 방법으로 통일하는 편이 안전하다. [^6]
- cuDNN은 NVIDIA 개발자 계정 로그인이 필요하고, 압축을 푼 `lib64` 파일을 CUDA 디렉터리로 복사해야 하므로 경로를 잘못 지정하면 런타임에 라이브러리 로드 오류가 난다.
- Ubuntu 자동 업데이트가 그래픽 드라이버를 교체하면 CUDA 버전이 어긋날 수 있으므로, 설치 후에는 `nvidia-smi`로 드라이버·CUDA 버전을 다시 확인한다. [^6]

## References

[^1]: [NVIDIA - Removing CUDA Toolkit and Driver](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html#removing-cuda-tk-and-driver)
[^2]: [Ubuntu Server Documentation - NVIDIA Drivers Installation](https://ubuntu.com/server/docs/nvidia-drivers-installation)
[^3]: [Ubuntu Manpages - nvidia-modprobe: Load NVIDIA kernel module and create character device files](https://manpages.ubuntu.com/manpages/focal/man1/nvidia-modprobe.1.html)
[^4]: [NVIDIA CUDA Installation Guide for Linux - Environment Setup](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html#mandatory-actions)
[^5]: [Python Documentation - venv: Creation of virtual environments](https://docs.python.org/3/library/venv.html)
[^6]: [NVIDIA CUDA Installation Guide for Linux](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html)
[^7]: [PyTorch - Previous PyTorch Versions](https://pytorch.org/get-started/previous-versions/)



