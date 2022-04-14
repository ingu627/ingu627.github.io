---
layout: single
title: "Pytorch 기반 LeNet 구현 및 데이터 증식된 CIFAR10 학습해보기"
excerpt: "LeNet은 1998년 Yann LeCun의 논문 'Gradient-Based Learning Applied to Document Recognition'에 기재된 가장 기본적인 CNN 구조입니다. 이를 이해하고 파이토치로 구현해보았습니다."
categories: code
tag : [lenet, pytorch, 파이토치, cifar10, 코드, 구현]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2022-04-14
---

<img align='right' width='400' src='https://user-images.githubusercontent.com/78655692/163406315-98f4f545-6775-432e-90f1-6c15222f4e79.png'>
본 글은 Pytorch 기반 LeNet 직접 구현하여 CIFAR10 학습해보는 내용입니다.<br>하나하나 자세히 분해해봅시다.  <br><br>코드 : [udemy - PyTorch for Deep Learning and Computer Vision](https://www.udemy.com/course/pytorch-for-deep-learning-and-computer-vision/) <br> 블로그 글 코드 : [CIFAR 10_agumentation.ipynb](https://github.com/data-science-DL/pytorch/blob/master/Pytorch%20for%20deeplearning%20and%20computer%20vision/section5/CIFAR%2010_agumentation.ipynb)<br> 파이토치 튜토리얼 : [pytorch.org](https://pytorch.org/docs/stable/index.html)
{: .notice--info}

<br>
<br>

## Introduction

![image](https://user-images.githubusercontent.com/78655692/163407463-5cb5155d-28b4-47ef-9ba2-3088c911e07b.png) <br>이미지출처[^1]

- **LeNet-5**은 input, 3개의 convolution layer, 2개의 subsampling layer, 1개의 fully-connected layer, output 으로 되어있다.

<br>

![image](https://user-images.githubusercontent.com/78655692/163408187-36ca6276-2ae9-4a9a-8b3b-d8b99e3ae626.png) <br>이미지출처[^2]

- **CIFAR10 Dataset**은 10개 클래스 범주의 60000x32x32 컬러 이미지로 구성되며, 클래스당 6000개의 이미지로 구성되어 있다.
  - 50000개의 training image와 10000개의 test image가 있다.

<br>
<br>

## LeNet using CIFAR10 in Pytorch

- 이제 파이토치로 코드를 구현해본다.

<br>

### 라이브러리 불러오기

```python
import torch
import matplotlib.pyplot as plt
import numpy as np
import torch.nn.functional as F
from torch import nn
from torchvision import datasets, transforms
```

<br>

### GPU 설정하기

```python
device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
print(device)
```

<br>

### 데이터 증식하기

- 데이터의 수가 많지 않으면 모델 학습이 어려워질 수 있다.
- 따라서 **데이터 증식(data augmentation)**을 활용한다.
- 이미지의 색깔, 회전, 각도 등을 조금씩 변형하여 데이터의 수를 늘려간다.
- 다음은 pytorch의 함수 설명이다. [^3]
  - `Compose(transforms)` : 여려 변환(transforms)을 함께 구성
  - `Resize(size)` : 입력 이미지의 크기를 지정된 크기로 조정
  - `RandomHorizontalFlip([p])` : 주어진 이미지를 주어진 확률(p)로 무작위로 수평으로 뒤짚는다.
  - `RandomAffine(, translate, scale)` : 이미지의 중심이 바뀌지 않는 것을 유지하는 random affine 변환
  - `ColorJitter(brightness, contrast,...)` : 이미지의 밝기(brightness), 채도(contrast), 채도(saturation) 및 색상(hue)을 임의로 변경 
  - `ToTensor()` : PIL image 또는 numpy.ndarray 배열을 텐서로 변환
  - `normalize(tensor, mean, std[, inplace])` : 평균(mean), 표준편차(std)로 텐서 이미지 정규화

```python
transform_train = transforms.Compose([transforms.Resize((32,32)),
                                transforms.RandomHorizontalFlip(),
                                transforms.RandomRotation(10),
                                transforms.RandomAffine(0, shear=10, scale=(0.8, 1.2)),
                                transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
                                transforms.ToTensor(),
                                transforms.Normalize((0.5, 0.5, 0.5),(0.5, 0.5, 0.5))])

transform = transforms.Compose([transforms.Resize((32,32)),
                                transforms.ToTensor(),
                                transforms.Normalize((0.5,),(0.5,))])
```

<br>
<br>

### CIFAR10 데이터 불러오기

- `torch.utils.data.DataLoader`와 `torch.utils.data.Dataset`은 pre-loaded dataset과 개인 데이터를 사용할 수 있게 해준다.
- Dataset은 샘플과 해당 레이블을 저장
- DataLoader는 샘플에 쉽게 액세스할 수 있도록 데이터 집합 주위에 반복 가능한 레이블을 감싼다.

```python
training_dataset = datasets.CIFAR10(root='./data', train=True, download=True, transform=transform_train)
# transform = simply dictates any image manipulations that you wish to apply on your images
validation_dataset = datasets.CIFAR10(root='./data', train=False, download=True, transform=transform)

training_loader = torch.utils.data.DataLoader(dataset=training_dataset, batch_size=100, shuffle=True)
validation_loader = torch.utils.data.DataLoader(dataset=validation_dataset, batch_size=100, shuffle=False)
```

<br>
<br>

### 이미지 변환 및 클래스 지정하기

- `.detach()` : 연산 기록으로부터 분리한 tensor를 반환하는 함수
  - 연산 추적 방지
- `.cpu()` : GPU 메모리에 올려져 있는 tensor를 cpu 메모리로 복사하는 함수
- `.numpy()` :tensor를 numpy로 변환하여 반환. 
  - 이때 저장공간을 공유하기 때문에 하나를 변경하면 다른 하나도 변경된다. [^4]
- **cpu().detach().numpy() 순서로!** 

<br>

- `numpy.clip(min, max)` : array 내의 요소들에 대해서 min 값보다 작은 값들을 min 값으로 바꿔주고, max값보다 큰 값들을 max 값으로 바꿔주는 함수 [^5]

<br>

- `iter()` : iter() 함수로 만든 iterator 객체는 한 번에 하나씩 그 객츼의 요소를 순서대로 액세스 할 수 있는 객체로 만들어줌 [^6]
- `next()` : iterator 객체는 그 순서대로 next() 함수를 통해 가져올 수 있다.

```python
# 이미지 전환 함수 정의
def im_convert(tensor):
    image = tensor.cpu().clone().detach().numpy()
    image = image.transpose(1, 2, 0) # transpose : 잔차 (행과 열을 바꿈)
    image = image * np.array((0.5, 0.5, 0.5)) + np.array((0.5, 0.5, 0.5))
    image = image.clip(0, 1) # numpy.clip(min, max) : ar 
    return image

# 클래서 범주 지정
classes = ('plane', 'car', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck') 

# 이미지 나타내기 
dataiter = iter(training_loader) 
images, labels = dataiter.next()
fig = plt.figure(figsize=(25, 4))

for idx in np.arange(20):
    ax = fig.add_subplot(2, 10, idx+1, xticks=[], yticks=[])
    plt.imshow(im_convert(images[idx]))
    ax.set_title(classes[labels[idx].item()])

# 결과
```

![image](https://user-images.githubusercontent.com/78655692/163418585-c81b38b5-3110-4870-9da2-7a9e92afbac3.png)


<br>
<br>

### LeNet 구조 정의

- `torch.nn.Conv2d(in_channels, out_channels, kernel_size, stride=1, padding)`
- `F.max_pool2d(input, kernel_size, stride)`

```python
class LeNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 16, 3, 1, padding=1)
        self.conv2 = nn.Conv2d(16, 32, 3, 1, padding=1)
        self.conv3 = nn.Conv2d(32, 64, 3, 1, padding=1)
        self.fc1 = nn.Linear(4*4*64, 500) # 32x32 -> 28x28 -> 14x14 -> 10x10 -> 5x5
        self.dropout1 = nn.Dropout(0.5)
        self.fc2 = nn.Linear(500, 10)
        
    def forward(self, x):
        x = F.relu(self.conv1(x))
        x = F.max_pool2d(x, 2, 2)
        x = F.relu(self.conv2(x))
        x = F.max_pool2d(x, 2, 2)
        x = F.relu(self.conv3(x))
        x = F.max_pool2d(x, 2, 2)
        x = x.view(-1, 4*4*64)
        x = F.relu(self.fc1(x))
        x = self.dropout1(x)
        x = self.fc2(x)
        return x

model = LeNet().to(device) # GPU에 할당
model

# 결과
```

![image](https://user-images.githubusercontent.com/78655692/163420040-41138789-5766-4682-b1b0-c02d29247b87.png)

<br>
<br>

### 손실 및 옵티마이저 정의

- `torch.nn.Module.parameters()` : 신경망 파라미터를 optimizer에 전달 할 때 쓴다.
  - 모듈의 파라미터를 iterator로 반환한다.

```python
criterion = nn.CrossEntropyLoss() # 입력과 타겟 사이의 손실 계산을 위한 기준 정의
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
```

<br>
<br>

### 학습하기

- `opt.zero_grad()` : 마지막 단계에서 이전 그레이디언트를 지운다.
- `loss.backward()` : 역전파를 사용하여 파라미터(또는 그레이디언트가 필요한 모든 것)에 대한 손실의 도함수를 계산
- `opt.step()` : 파라미터의 그레이디언트를 기반으로 한 단계를 수행

<br>

- `torch.max(input)` : 입력 텐서에 있는 모든 요소의 최대값 반환
- `loss.item()` 손실이 갖고 있는 스칼라 값을 가져온다.

```python
epochs = 20 # 에포크 설정
running_loss_history = []
running_corrects_history = []
val_running_loss_history = []
val_running_corrects_history = []

for e in range(epochs):
    
    running_loss = 0.0
    running_corrects = 0.0
    val_running_loss = 0.0
    val_running_corrects = 0.0
    
    for inputs, labels in training_loader:
        inputs = inputs.to(device)
        labels = labels.to(device)
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        _, preds = torch.max(outputs, 1)
        running_loss += loss.item()
        running_corrects += torch.sum(preds == labels.data)
        
    else:
        with torch.no_grad():
            for val_inputs, val_labels in validation_loader:
                val_inputs = val_inputs.to(device)
                val_labels = val_labels.to(device)
                val_outputs = model(val_inputs)
                loss = criterion(val_outputs, val_labels)
                
                _, val_preds = torch.max(val_outputs, 1)
                val_running_loss += loss.item()
                val_running_corrects += torch.sum(val_preds == val_labels.data)
                
        epoch_loss = running_loss/len(training_loader)
        epoch_acc = running_corrects.float() / len(training_loader)
        running_loss_history.append(epoch_loss)
        running_corrects_history.append(epoch_acc.cpu().detach().numpy())
        
        val_epoch_loss = val_running_loss/len(validation_loader)
        val_epoch_acc = val_running_corrects.float() / len(validation_loader)
        val_running_loss_history.append(val_epoch_loss)
        val_running_corrects_history.append(val_epoch_acc.cpu().detach().numpy())
        print('epoch : ', (e+1))
        print('training loss: {:.4f}, training acc : {:.4f}'.format(epoch_loss, epoch_acc))
        print('validation loss: {:.4f}, validation acc : {:.4f}'.format(val_epoch_loss, val_epoch_acc))
        
```

<br>
<br>

### 결과 출력

```python
plt.plot(running_loss_history, label='training loss')
plt.plot(val_running_loss_history, label='validation loss')
plt.legend()
```

![output](https://user-images.githubusercontent.com/78655692/163423106-6acfe32f-db77-4296-9215-8a0429d43e0c.png)

```python
plt.plot(running_corrects_history, label="training_acc")
plt.plot(val_running_corrects_history, label="validation_acc")
plt.legend()
```

![output](https://user-images.githubusercontent.com/78655692/163427484-db373719-0c50-4ced-87cd-eeeee78f8739.png)



<br>
<br>
<br>
<br>

## References

[^1]: [6.6. Convolutional Neural Networks (LeNet)](https://d2l.ai/chapter_convolutional-neural-networks/lenet.html)
[^2]: [The CIFAR-10 dataset - official](https://www.cs.toronto.edu/~kriz/cifar.html)
[^3]: [TRANSFORMING AND AUGMENTING IMAGES](https://pytorch.org/vision/master/transforms.html)
[^4]: [[PyTorch] .detach().cpu().numpy()와 .cpu().data.numpy() ?](https://byeongjo-kim.tistory.com/32)
[^5]: [[Python] numpy.clip() 사용법](https://nuggy875.tistory.com/61)
[^6]: [파이썬 iterable과 iterator - iter() 및 next() 함수 - 베리타스](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=youndok&logNo=222073036603)



