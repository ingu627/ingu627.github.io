---
layout: single
title: "Pytorch 기반 ResNet152 구조 처음부터 구현해보기"
excerpt: "잔차 유닛을 정의한 후, ResNet의 구조를 직접 구현해보았습니다."
categories: code
tag : [resnet, resnet50, resnet101, resnet152, scratch, 파이토치, fashion mnist, 코드, 구현, 모델, design, 설명, layer, 역전파, backpropagation, forward, __init__, nn.Module, Conv2d, BatchNrom2d, ReLU, dwonsample, identity, block, super, MaxPool2d, 딥러닝, cv, 컴퓨티 비전]
toc: true

classes: wide
sidebar_main: false

last_modified_at: 2022-04-18
---

<img align='right' width='250' src='https://user-images.githubusercontent.com/78655692/162919635-d03d7e8f-c492-493b-8c4d-d2f0f88ae67e.png'>
본 글은 Pytorch 기반 ResNet 모델 처음부터 구현해보는 내용입니다.<br>하나하나 자세히 분해해봅시다.  <br><br>논문 : [Deep Residual Learning for Image Recognition](https://arxiv.org/abs/1512.03385) <br> 코드 : [Pytorch ResNet implementation from Scratch](https://www.youtube.com/watch?v=DkNIBBBvcPs) <br> 블로그 글 코드 : [poeun - resnet.ipynb](https://github.com/data-science-DL/pytorch/blob/master/code_implementation/resnet.ipynb) <br> 파이토치 torchvision/models/resnet.py : [resnet.py](https://github.com/pytorch/vision/blob/main/torchvision/models/resnet.py)
{: .notice--info}

[[논문 리뷰] Deep Residual Learning for Image Recognition](https://ingu627.github.io/paper/ResNet/) 글을 먼저 올렸다. 이를 바탕으로 구현해본다. <br>
설명은 코드 부분에 자세히 적었다.
{: .notice--danger}

<br>
<br>


## A "bottleneck" Block 정의하기

- 먼저 bottleneck 블록을 정의해준다.
- 더 많은 층을 쌓아야 하는데, 연산량을 절감해야 되기 때문에 이 구조를 사용한다.
- 다음으로 코드에 구현할 부분을 직접 그림에 적어보았다.

<img src='https://user-images.githubusercontent.com/78655692/163796906-22b600a1-06dd-4575-aee1-56449681206a.jpg' width=650>

<br>

```python
import torch
# torch.nn : 딥러닝 모델에 필요한 모듈이 모여 있는 패키지
import torch.nn as nn

class block(nn.Module):
    # __init__는 클래스 내의 생성자라 불리고 초기화를 위한 함수이다.
    # self는 인스턴스 자신이다.
    def __init__(self, in_channels, out_channels, identity_downsample=None, stride=1):
        # super(모델명, self).__init__() 형태로 호출
        # 위처럼 호출해서 nn.Module.__init__()을 실행
        super(block, self).__init__()
        self.expansion = 4 # 확장
        # nn.Conv2d(in_channels, out_channels, kernel_size, stride, padding) 순서로 정의
        self.conv1 = nn.Conv2d(in_channels, out_channels, kernel_size=1, stride=1, padding=0)
        self.bn1 = nn.BatchNorm2d(out_channels)
        self.conv2 = nn.Conv2d(out_channels, out_channels, kernel_size=3, stride=stride, padding=1)
        self.bn2 = nn.BatchNorm2d(out_channels)
        self.conv3 = nn.Conv2d(out_channels, out_channels*self.expansion, kernel_size=1, stride=1, padding=0)
        self.bn3 = nn.BatchNorm2d(out_channels*self.expansion)
        self.relu = nn.ReLU()
        # downsample은 forward시 f(x)+x의 residual을 구현할 경우 f(x)와 x의 텐서사이즈가 다를 때 사용한다.
        self.identity_downsample = identity_downsample
    
    # 네트워크 구조를 정의하는 순방향 함수
    # 여기서는 한가지 입력만 허용하고 있다.
    def forward(self, x):
        # identity에 x 저장
        identity = x
        
        x = self.conv1(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.conv2(x)
        x = self.bn2(x)
        x = self.relu(x)
        x = self.conv3(x)
        x = self.bn3(x)
        
        if self.identity_downsample is not None:
            identity = self.identity_downsample(identity)

        # x(=출력값)에 identity 값 더함    
        x += identity
        x = self.relu(x)
        return x
         
```

<br>
<br>

## ResNet 클래스 정의하기

- 다음은 ResNet 클래스를 정의하는 단계이다.
- 크게 초기화 단계, forward 단계, block 단위 형성인 _make_layer단계로 구현한다.

<br>

![IMG_0151-1](https://user-images.githubusercontent.com/78655692/163798851-390d9944-0884-4759-84c4-3fe5878288d9.jpg)

```python
class ResNet(nn.Module): # resnet50 : [3, 4, 6, 3]
    def __init__(self, block, layers, image_channels, num_classes):
        super(ResNet, self).__init__()
        self.in_channels = 64
        self.conv1 = nn.Conv2d(image_channels, 64, kernel_size=7, stride=2, padding=3)
        self.bn1 = nn.BatchNorm2d(64)
        self.relu = nn.ReLU()
        self.maxpool = nn.MaxPool2d(kernel_size=3, stride=2, padding=1)
        
        # ResNet layers
        # self._make_layer를 이용하여 residual block들을 쌓는다.
        # 필터의 개수는 각 block들을 거치면서 2배씩 늘어난다. (64->128->256->512)
        self.layer1 = self._make_layer(block, layers[0], out_channels=64, stride=1)
        self.layer2 = self._make_layer(block, layers[1], out_channels=128, stride=2)
        self.layer3 = self._make_layer(block, layers[2], out_channels=256, stride=2)
        self.layer4 = self._make_layer(block, layers[3], out_channels=512, stride=2)
        
        self.avgpool = nn.AdaptiveAvgPool2d((1,1)) # (n, 512, 1, 1)의 텐서로 만든다.
        self.fc = nn.Linear(512*4, num_classes) # fully-connected layer
        
    def forward(self, x):
        x = self.conv1(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.maxpool(x)
        
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)
        
        x = self.avgpool(x)
        x = x.reshape(x.shape[0], -1) # send it into the fully connected layer
        x = self.fc(x)
        return x
    
    # _make_layer에서 residual block 생성
    # block : 앞에 정의한 block 클래스
    # num_residual_blocks : layer 반복해서 쌓는 개수
    def _make_layer(self, block, num_residual_blocks, out_channels, stride):
        identity_downsample = None
        layers = []
        
        # downsampling이 필요한 경우 identity_downsample 생성
            # 1. stride가 1이 아닐 때
            # 2. self.in_channels가 out_channels*4와 크기가 맞지 않을 때
        if stride != 1 or self.in_channels != out_channels * 4:
            identity_downsample = nn.Sequential(nn.Conv2d(self.in_channels, out_channels*4, kernel_size=1, stride=stride),
            nn.BatchNorm2d(out_channels*4))
        
        layers.append(block(self.in_channels, out_channels, identity_downsample, stride))
        self.in_channels = out_channels*4 # 256
        
        for i in range(num_residual_blocks - 1):
            layers.append(block(self.in_channels, out_channels)) # 256 -> 64, 64*4 (256) again
        
        return nn.Sequential(*layers)
        
```

<br>
<br>

## ResNet50, 101, 152 정의하기

```python
def ResNet50(img_channels=3, num_classes=1000):
    return ResNet(block, [3, 4, 6, 3], img_channels, num_classes)

def ResNet101(img_channels=3, num_classes=1000):
    return ResNet(block, [3, 4, 23, 3], img_channels, num_classes)

def ResNet152(img_channels=3, num_classes=1000):
    return ResNet(block, [3, 8, 36, 3], img_channels, num_classes)
```




<br>
<br>
<br>
<br>