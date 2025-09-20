---
layout: single
title: "Ubuntu 20.04에서 nvidia driver, cuda, cudnn, pytorch 설치의 모든 것"
excerpt : "ubuntu 20.04, nvidia driver 495, cuda 11.3, cudnn 8.2.1, pytorch 버전을 설치하는 방법입니다."
categories: tips
tags: [tip, cuda, install, gpu, ubuntu, nvidia driver, cuda, pytorch, cudnn, 설치, 버전, 확인, 리눅스, linux, 우분투, 가상환경, 삭제, 드라이버, 패키지]

toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2022-07-16
---


ubuntu 20.04, nvidia driver 495, cuda 11.3, cudnn 8.2.1, pytorch 버전을 설치하는 방법입니다. <br> 우분투에서 파이썬 가상환경도 만들어봅니다.
{: .notice--danger}

<br>
<br>

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

<br>
<br>

## 설치가능한 드라이버 확인

- 그래픽 카드 및 설치 가능한 드라이버를 다음 명령어로 확인해본다.

    ```shell
    $ ubuntu-drivers devices
    ```

![image](https://user-images.githubusercontent.com/78655692/178480486-761c2ecf-6e49-420b-9d02-549e7b11d012.png)

<br>

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

<br>

- nvidia 드라이버 설치가 끝나면 NVIDIA kernel module의 load를 도와주는 `modprobe` 패키지를 설치한다. [^3]

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

<br>

- 재부팅 후 설치가 잘 되었는지 확인하기 위해 다음 명령어를 실행해본다.
- 아래처럼 잘 나오면 설치가 잘 된것이다.

    ```shell
    $ nvidia-smi
    ```

<br>

<img src='https://user-images.githubusercontent.com/78655692/178487504-86beaa95-4493-49bb-b9fc-608e307a8827.png' width=600>

<br>
<br>

## cuda 11.3 설치

- cuda 11.3을 설치하기 위해 해당 사이트에 들어간다.
- [NVIDIA DEVELOPER - CUDA Toolkit Archive](https://developer.nvidia.com/cuda-toolkit-archive)
- 그 다음, linux -> x86_64 -> Ubuntu -> 20.04 -> runfile(local)로 가 해당 명령어를 실행한다.

<img src='https://user-images.githubusercontent.com/78655692/178489427-3b4965a6-93f7-4aee-b63d-d75667a3b629.png' width=550>

<br>

<img src='https://user-images.githubusercontent.com/78655692/178489726-78544f83-83f6-4e13-af4e-41546adaed37.png' width=550>

<br>

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

<br>

- Continue 후, accept, 그 다음 Driver 선택을 해제후 Install 한다.

<img src='https://user-images.githubusercontent.com/78655692/178490764-af6c4dd7-1821-4f43-bf81-8d7fa01b22da.png' width=550>

<img src='https://user-images.githubusercontent.com/78655692/178490957-33b2a570-faa0-47dc-a2de-44f1b83bad17.png' width=550>

<img src='https://user-images.githubusercontent.com/78655692/178491105-46851e2a-0398-4d03-a74b-b68e935cfe05.png' width=550>

<br>

- 설치가 잘 진행되었다면 아래 그림처럼 나올 것이다.

![image](https://user-images.githubusercontent.com/78655692/178491438-7219204f-f98e-4421-af53-989902d61472.png)

<br>

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

<br>

- CUDA Toolkit 관련 설정을 환경 변수에 추가하기 위해 다음 명령어를 실행한다. [^4]

    ```shell
    $ sudo sh -c "echo 'export PATH=$PATH:/usr/local/cuda-11.3/bin'>> /etc/profile"
    $ sudo sh -c "echo 'export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/cuda-11.3/lib64'>> /etc/profile"
    $ sudo sh -c "echo 'export CUDARDIR=/usr/local/cuda-11.3'>> /etc/profile"
    $ source /etc/profile
    ```

<br>
<br>

## cuDNN 설치

- cuDNN을 설치하기 위해 해당 사이트에 접속한다. 
  - [NVIDIA cuDNN](https://developer.nvidia.com/cudnn)
- NVIDIA 계정이 있어야 한다. 없다면 회원가입해야 한다는 점 유의한다.
- 그림에 표시한대로 따라 다운로드 받는다.

![image](https://user-images.githubusercontent.com/78655692/178493921-0e35f854-fb08-46da-b304-7e51d057ccde.png)

<br>

![image](https://user-images.githubusercontent.com/78655692/178494017-567dadb0-5f1f-4f78-8500-5218af00875f.png)

<br>

![image](https://user-images.githubusercontent.com/78655692/178494120-cc6b23e3-66aa-45ad-88fc-55346dbd4b14.png)

<br>

![image](https://user-images.githubusercontent.com/78655692/178494341-c8c50213-1c03-454f-b6a9-077a44a01934.png)

<br>

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

<br>

- 새로 추가된 라이브러리를 시스템에서 찾을 수 있도록 한다.

    ```shell
    $ sudo ldconfig
    ```

<br>

- 다음은 설정이 제대로 되었는지 확인하기 위한 명령어이다.

    ```shell
    ldconfig -N -v $(sed 's/:/ /' <<< $LD_LIBRARY_PATH) 2>/dev/null | grep libcudnn
    ```

    ![image](https://user-images.githubusercontent.com/78655692/178498523-5b1d6c98-052a-4a8f-9e00-5d12477d40df.png)

<br>
<br>

## python 가상환경 설치

- 먼저 python 버전을 확인하고, venv를 설치해준다. [^5]

    ```shell
    $ python3 --version
    $ sudo apt-get install python3-venv
    ```

<br>

- 그다음, 원하는 이름으로 가상환경을 생성한다.

    ```shell
    $ python3 -m venv [가상환경 이름]
    # 예시로
    $ python3 -m venv tf2.8
    ```

<br>

- 다음은 가상환경를 활성화하는 과정이다.
- 활성화하면 터미널 앞에 가상환경 이름이 나타날 것이다.

    ```shell
    $ source [가상환경 이름]/bin/activate
    # 예시로
    $ source tf2.8/bin/activate
    ```

<br>

- `deactivate`를 실행하면, 가상환경은 종료된다.

<br>
<br>

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

<br>
<br>
<br>
<br>

## References

[^1]: [Ubuntu 18.04 Nvidia driver 완전 삭제 & CUDA 완전 삭제](https://settembre.tistory.com/447)
[^2]: [[Ubuntu 20.04 LTS]Nvidia드라이버 설치하기 - PixelStudio](https://pstudio411.tistory.com/entry/Ubuntu-2004-Nvidia%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B2%84-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0)
[^3]: [Ubuntu 18.04 CUDA + PyTorch 설치 - Greenmon.dev](https://greenmon.dev/2019/06/21/ubuntu-cuda.html)
[^4]: [Ubuntu 20.04에 CUDA Toolkit 11.2, cuDNN 8.1.0, Tensorflow 설치하기 - webnautes](https://webnautes.tistory.com/1428)
[^5]: [[LAB] Ubuntu python3 가상환경 venv 설치하기 - rubying](https://velog.io/@rubying/LAB-Ubuntu-python3-%EA%B0%80%EC%83%81%ED%99%98%EA%B2%BD-venv-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0)



