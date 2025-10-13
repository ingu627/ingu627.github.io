---
layout: single
title: "AlexNet 구조 분석 & PyTorch 구현: LRN·Dropout·Data Augmentation"
excerpt: "ImageNet 우승 모델 AlexNet의 LRN·드롭아웃·데이터 증식 아이디어를 Fashion/CIFAR 예제로 PyTorch로 모듈별 분해 구현"
categories: code
tags : [alexnet, pytorch, 파이토치, 알렉스넷, cnn, 코드, 구현, design, 설명, layer, functional, nn, optim, torchvision, epoch, batch size, device, transforms, Compose, ToTensor, Resize, DataLoader, iter, next, Conv2d, Linear, dropout, relu, summary_, parameters, 딥러닝, cv, 컴퓨티 비전]
toc: true
toc_sticky: false
sidebar_main: false

last_modified_at: 2022-07-13
---

{% capture related %}
**관련 구현 글**  
- [ResNet 전이학습](/code/ResNet50_pytorch/)  
- [ResNet Scratch](/code/ResNet_scratch_pytorch/)  
- [ResNeXt Scratch](/code/ResNeXt_scratch_pytorch/)  
- [Lightning + W&B](/code/pytorch_lightning_mnist/)  
{% endcapture %}
{% include notice.html content=related %}

<img align='right' width='350' src='https://user-images.githubusercontent.com/78655692/162920296-ea7abcc7-f497-4351-8152-838c140a1ba2.png'>
본 글은 "ImageNet Classification with Deep Convolutional Neural Networks" 논문을 파악하고, 이를 파이토치로 구현해보는 내용입니다.<br>하나하나 분해해봅시다.  <br><br> 논문 : [AlexNet](https://proceedings.neurips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf) <br> 코드 : [kaggle - Fashion MNIST with AlexNet in Pytorch](https://www.kaggle.com/code/tiiktak/fashion-mnist-with-alexnet-in-pytorch-92-accuracy/notebook) <br> 블로그 글 코드 : [alexnet_pytorch.ipynb](https://github.com/data-science-DL/pytorch/blob/master/deeplearning_ajou/alexnet_pytorch.ipynb)<br> 파이토치 튜토리얼 : [pytorch.org](https://pytorch.org/docs/stable/index.html)
{: .notice--info}

<br>

## AlexNet 이란?

- 2012년 ILSVRC 우승 모델
  - top-5 error rate : 17%
- 특징
  1. F9, F10에서 **드롭아웃(Dropout)** 50% 사용
  2. **데이터 증식(Data Augmentation)** 사용
  3. 정규화는 **LRN(local response normalization)** 사용
     - **LRN** : 뉴런의 출력값을 보다 경쟁적으로 만드는 정규화 기법

<br>

## AlexNet 구조

![image](https://user-images.githubusercontent.com/78655692/160421851-7f682d11-e4d9-4117-9c58-d1022d476658.png)

<br>

![image](https://user-images.githubusercontent.com/78655692/160422169-afaeee33-f486-461d-b974-3f16731a8d34.png)

<br>

## 파이토치로 구현해보기

### Dataset : Fashion MNIST

<img src='https://user-images.githubusercontent.com/78655692/160522726-db2881df-62f0-4e88-b0c7-51c44c3e09a6.png' width=400> <br>이미지출처 [^1]

- Fashion MNIST 데이터셋 : 운동화, 코트, 가방 등의 작은 이미지 모음 [^2]
  - training set : 60000
  - test set : 10000
  - 28x28 grayscale image
  - labels of 10 classes 

    |Label|	Class|
    |---|---|
    |0	|T-shirt/top|
    |1	|Trouser|
    |2	|Pullover|
    |3	|Dress|
    |4	|Coat|
    |5	|Sandal|
    |6	|Shirt|
    |7	|Sneaker|
    |8	|Bag|
    |9	|Ankle boot|

  - feature : PIL image format
  - label : integer

<br>

### 라이브러리 불러오기

```python
import os # 파이썬을 이용해 파일을 복사하거나 디렉터리를 생성하고 특정 디렉터리 내의 파일 목록을 구하고자 할 때 사용
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import torch 
import torchvision # torchvision package : 컴퓨터 비전을 위한 유명 데이터셋, 모델 아키텍처, 이미지 변형등을 포함
import torch.nn as nn # nn : neural netwroks (define class) attribute를 활용해 state를 저장하고 활용
import torch.optim as optim # 최적화 알고리즘
import torch.nn.functional as F # (define function) 인스턴스화 시킬 필요없이 사용 가능
from PIL import Image
from torchvision import transforms, datasets # transforms : 데이터를 조작하고 학습에 적합하게 만듦.
from torch.utils.data import Dataset, DataLoader
# dataset : 샘플과 정답(label)을 저장
# DataLoader : Dataset 을 샘플에 쉽게 접근할 수 있도록 순회 가능한 객체(iterable)로 감싼다.
```

<br>

### 에포크, 배치 크기, 디바이스 정의

```python
epochs = 10 # 훈련 반복수
batch_size = 512 # 배치 크기

device = ("cuda" if torch.cuda.is_available() else "cpu") # device 정의
class_names = ['T-shirt/top', 'Trouser', 'Pullover', 'Dress', 'Coat',
               'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot'] # 총 10개의 클래스

print(torch.__version__)
print(device)

# 결과
# 1.10.0+cu111
# cuda
```

<br>

### 데이터셋 준비

```python
transform = transforms.Compose([
    transforms.Resize(227), # Compose : transforms 리스트 구성
    # 227x227 : input image(in alexnet) but fashionMNIST's input image : 28x28
    transforms.ToTensor()]) # ToTensor : PIL image or numpy.ndarray를 tensor로 바꿈

training_data = datasets.FashionMNIST(
    root="data", # data가 저장될 경로(path)
    train=True, # training dataset
    download=True, # 인터넷으로부터 데이터 다운
    transform=transform # feature 및 label 변환(transformation) 지정
)

validation_data = datasets.FashionMNIST(
    root="data",
    train=False, # test dataset
    download=True,
    transform=transform
)
```

<br>

### 데이터로더 (DataLoader)

- **데이터 로더(DataLoader)**는 데이터를 배치(batch) 단위로 모델에 밀어 넣어주는 역할이다. 
  - 전체 데이터 가운데 일부 인스턴스를 뽑아(sample) 배치를 구성한다.

```python
# (class) DataLoader(dataset, batch_size, shuffle, ...)
training_loader = DataLoader(training_data, batch_size=64, shuffle=True)
validation_loader = DataLoader(validation_data, batch_size=64, shuffle=True)
```

<br>

### 이미지 보기

```python
# helper function to show an image
def matplotlib_imshow(img):
    img = img.mean(dim=0)
    img = img / 2 + 0.5
    npimg = img.numpy()
    plt.imshow(npimg, cmap="Greys")
    
# get some random training images
dataiter = iter(training_loader) # iter(호출가능한객체, 반복을끝낼값)
images, labels = dataiter.next() # next() : 반복할 수 있을 때는 해당 값을 출력하고, 반복이 끝났을 때는 기본값을 출력

# create grid of images
img_grid = torchvision.utils.make_grid(images[0]) # make_grid : 이미지의 그리드 생성

# show images & labels
matplotlib_imshow(img_grid)
print(class_names[labels[0]])
```

<br>

### 알렉스넷(AlexNet) 모델 구현

- 5개의 convolution layer, 3개의 fully-connected layer => 총 8개 [^3]

![png](https://user-images.githubusercontent.com/78655692/160535816-9b598169-5401-43f9-9a1e-0bf9a958148d.png)

```python
class fashion_mnist_alexnet(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Sequential(
        
            nn.Conv2d(in_channels=1, out_channels=96, kernel_size=11, stride=4, padding=0), 
            # 4D tensor : [number_of_kernels, input_channels, kernel_width, kernel_height] 
            # = 96x1x11x11
            # input size : 1x227x227
            # input size 정의 : (N, C, H, W) or (C, H, W)
            # W' = (W-F+2P)/S + 1
            # 55x55x96 feature map 생성 (55는 (227-11+1)/4)
            # 최종적으로 227 -> 55
            nn.ReLU(), # 96x55x55
            nn.MaxPool2d(kernel_size=3, stride=2) 
            # 55 -> (55-3+1)/2 = 26.5 = 27
            # 96x27x27 feature map 생성

        ) 
        self.conv2 = nn.Sequential(
            nn.Conv2d(96, 256, 5, 1, 2), # in_channels: 96, out_channels: 256, kernel_size=5x5, stride=1, padding=2
            # kernel 수 = 48x5x5 (드롭아웃을 사용했기 때문에 96/2=48) 형태의 256개
            # 256x27x27
            nn.ReLU(),
            nn.MaxPool2d(3, 2) # 27 -> 13
            # 256x13x13
        )
        self.conv3 = nn.Sequential(
            nn.Conv2d(256, 384, 3, 1, 1),
            nn.ReLU() # 13 유지
            # 384x13x13
        )
        self.conv4 = nn.Sequential(
            nn.Conv2d(384, 384, 3, 1, 1),
            nn.ReLU() # 13 유지
            # 384x13x13
        )
        self.conv5 = nn.Sequential(
            nn.Conv2d(384, 256, 3, 1, 1),
            nn.ReLU(),
            nn.MaxPool2d(3, 2) # 13 -> 6
            # 256x6x6
        )
        
        self.fc1 = nn.Linear(256 * 6 * 6, 4096)
        self.fc2 = nn.Linear(4096, 4096)
        self.fc3 = nn.Linear(4096, 10)

    def forward(self, x): # input size = 3x227x227
        out = self.conv1(x)
        out = self.conv2(out)
        out = self.conv3(out)
        out = self.conv4(out)
        out = self.conv5(out) # 64x4096x1x1
        out = out.view(out.size(0), -1) # 64x4096
        
        out = F.relu(self.fc1(out))
        out = F.dropout(out, 0.5)
        out = F.relu(self.fc2(out))
        out = F.dropout(out, 0.5)
        out = self.fc3(out)
        out = F.log_softmax(out, dim=1)
        
        return out
        
```

<br>

### 모델 생성

```python
model = fashion_mnist_alexnet().to(device) # to()로 모델에 gpu 사용
criterion = F.nll_loss # nll_loss : negative log likelihood loss
optimizer = optim.Adam(model.parameters()) # model(신경망) 파라미터를 optimizer에 전달해줄 때 nn.Module의 parameters() 메소드를 사용
```

<br>

- **모델의 Summary()**

```python
from torchsummary import summary as summary_

summary_(model, (1,227,227), batch_size)
# summary_: (model, input_size, batch_size)
```

![image](https://user-images.githubusercontent.com/78655692/160539431-ceb2788f-139e-4249-9665-87c46ad30e41.png)

<br>

### train 정의

```python
def train(model, device, train_loader, optimizer, epoch):
    model.train()
    for batch_idx, (data, target) in enumerate(train_loader):
        # enumberate() : 인덱스와 원소로 이루어진 튜플(tuple)을 만들어줌
        target = target.type(torch.LongTensor)
        data, target = data.to(device), target.to(device)
        optimizer.zero_grad() # 항상 backpropagation 하기전에 미분(gradient)을 zero로 만들어주고 시작해야 한다.
        output = model(data)
        loss = criterion(output, target) # criterion = loss_fn
        loss.backward() # Computes the gradient of current tensor w.r.t. graph leaves
        optimizer.step() # step() : 파라미터를 업데이트함
        if (batch_idx + 1) % 30 == 0:
            print("Train Epoch:{} [{}/{} ({:.0f}%)]\tLoss: {:.6f}".format(
                epoch, batch_idx * len(data), len(train_loader.dataset),
                100. * batch_idx / len(train_loader), loss.item()))
```

<br>

### test 정의

```python
def test(model, device, test_loader):
    model.eval()
    test_loss = 0
    correct = 0
    with torch.no_grad():
        for data, target in test_loader:
            data, target = data.to(device), target.to(device)
            output = model(data)
            test_loss += criterion(output, target, reduction='sum').item()
            pred = output.max(1, keepdim=True)[1]
            correct += pred.eq(target.view_as(pred)).sum().item()

        test_loss /= len(test_loader.dataset)  # -> mean
        print("\nTest set: Average loss: {:.4f}, Accuracy: {}/{} ({:.0f}%)\n".format(
            test_loss, correct, len(test_loader.dataset), 100. * correct / len(test_loader.dataset)))
        print('='*50)
```

<br>

### 학습 시작하기

```python
for epoch in range(1, epochs+1):
    train(model, device, training_loader, optimizer, epoch)
    test(model, device, validation_loader)
```

- **결과** : 10 에포크로 90% 정확도 달성

![image](https://user-images.githubusercontent.com/78655692/160552918-08fd07e0-d848-4903-a6b3-22f3cd4cc0e8.png)



<br>

## References

[^1]: [Codetorial - 9. Fashion MNIST 이미지 분류하기](https://codetorial.net/tensorflow/fashion_mnist_classification.html)
[^2]: [kaggle - fashionmnist](https://www.kaggle.com/datasets/zalando-research/fashionmnist)
[^3]: [[CNN 알고리즘들] AlexNet의 구조](https://bskyvision.com/421)

