---
layout: single
title: "ResNeXt50 Scratch: Cardinality(그룹) 확장으로 성능/파라미터 균형"
excerpt: "Split-Transform-Merge·grouped conv(cardinality) 설계를 ResNet과 비교 구현하며 파라미터 증가 없이 표현력 높이는 원리 분석"
categories: code
tags: [resnet, resnext]
toc: true

classes: wide
sidebar_main: false

last_modified_at: 2022-04-28
redirect_from:
  - /code/ResNeXt_scratch_pytorch/
---

{% capture related %}
**관련 구현 글**  
- [ResNet 전이학습](/code/ResNet50_pytorch/)  
- [ResNet Scratch](/code/ResNet_scratch_pytorch/)  
- [AlexNet 구현](/code/alexnet_pytorch/)  
- [Lightning + W&B](/code/pytorch_lightning_mnist/)  
{% endcapture %}
{% include notice.html content=related %}

<img align='right' width='250' src='https://user-images.githubusercontent.com/78655692/165755215-c33df78b-b30d-4f9b-926a-bef008ff5b93.png'>
본 글은 Pytorch 기반 ResNeXt50 구조 처음부터 구현해보는 내용입니다.<br>하나하나 자세히 분해해봅시다.  <br><br>논문 : [Aggregated Residual Transformations for Deep Neural Networks](https://arxiv.org/abs/1611.05431) <br> 코드 : [pytorch-cifar100/models/resnext.py - weiaicunzai](https://github.com/weiaicunzai/pytorch-cifar100/blob/master/models/resnext.py) <br> 블로그 글 코드 : [poeun - resnext.ipynb](https://github.com/data-science-DL/pytorch/blob/master/code_implementation/resnext.ipynb) <br> 파이토치 torchvision/models/resnet.py : [resnet.py](https://github.com/pytorch/vision/blob/main/torchvision/models/resnet.py)
{: .notice--info}

[[논문 리뷰] Aggregated Residual Transformations for Deep Neural Networks](https://ingu627.github.io/paper/ResNext/) 글을 먼저 올렸다. 이를 바탕으로 구현해본다. <br>
설명은 코드 부분에 자세히 적었다. <br> 수정 필요
{: .notice--danger}

<br>


## ResNextBottleNeck 클래스 정의하기

![image](https://user-images.githubusercontent.com/78655692/165717848-71632b0f-ac53-4b6a-9117-309a63cb0e3b.png)

```python
cardinality = 32 # path를 결정하는 변환 그룹의 크기
depth = 4 # 각 그룹 당 가지고 있는 채널 수
base_width = 64 # 기초 채널 수

# 그림 3의 (c)의 grouped convolution 레이어는 입출력 채널이 4차원인 32개의 컨볼루션 그룹(=cardinality)을 형성한다.
# grouped convolution은 그 그룹을 레이어의 출력으로 concatenate한다.
class ResNextBottleNeck(nn.Module):
    # __init__는 클래스 내의 생성자라 불리고 초기화를 위한 함수이다.
    # self는 인스턴스 자신이다.
    # 인자는 in_channels, out_channels, stride를 받는다.
    def __init__(self, in_channels, out_channels, stride):
         # super(모델명, self).__init__() 형태로 호출
        super().__init__()

        groups = cardinality # 특징 맵(feature map)이 분할된 그룹 수

        num_depth = int(depth * out_channels / base_width) # 그룹당 채널 수(depth per group)
        self.split_transform = nn.Sequential(
            nn.Conv2d(in_channels, groups * num_depth, kernel_size=1, groups=groups, bias=False),
            nn.BatchNorm2d(groups * num_depth),
            nn.ReLU(),
            nn.Conv2d(groups * num_depth, groups * num_depth, kernel_size=3, stride=stride, groups=groups, padding=1, bias=False),
            nn.BatchNorm2d(groups * num_depth),
            nn.ReLU(),
            nn.Conv2d(groups * num_depth, out_channels * 4, kernel_size=1, bias=False),
            nn.BatchNorm2d(out_channels * 4),
        )

        self.shortcut = nn.Sequential()

        if stride != 1 or in_channels != out_channels * 4:
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_channels, out_channels * 4, stride=stride, kernel_size=1, bias=False),
                nn.BatchNorm2d(out_channels * 4)
            )

    def forward(self, x):
        return F.relu(self.split_transform(x) + self.shortcut(x))
```

<br>

## ResNeXt 클래스 정의하기

<img src='https://user-images.githubusercontent.com/78655692/165744729-90f91c27-8f8a-45f1-b173-1660aa51e843.png' width=500>

```python
class ResNext(nn.Module):

    def __init__(self, block, num_blocks, class_names=1000):
        super().__init__()
        self.in_channels = 64

        self.conv1 = nn.Sequential(
            nn.Conv2d(3, 64, 3, stride=1, padding=1, bias=False),
            nn.BatchNorm2d(64),
            nn.ReLU()
        )

        self.conv2 = self._make_layer(block, num_blocks[0], 64, 1)
        self.conv3 = self._make_layer(block, num_blocks[1], 128, 2)
        self.conv4 = self._make_layer(block, num_blocks[2], 256, 2)
        self.conv5 = self._make_layer(block, num_blocks[3], 512, 2)
        self.avg = nn.AdaptiveAvgPool2d((1, 1))
        self.fc = nn.Linear(512 * 4, 100)

    def forward(self, x):
        x = self.conv1(x)
        x = self.conv2(x)
        x = self.conv3(x)
        x = self.conv4(x)
        x = self.conv5(x)
        x = self.avg(x)
        x = x.view(x.size(0), -1)
        x = self.fc(x)
        return x

    # _make_layer에서 resnext block  생성
    # block: 블록 유형(default resnext bottleneck c)
    # num_block: 레이어당 블록수
    # out_channels: 블록당 출력 채널 수
    # stride: 블록 stride
    # return : resnext 레이어
    def _make_layer(self, block, num_block, out_channels, stride):
        strides = [stride] + [1] * (num_block - 1)
        layers = []
        for stride in strides:
            layers.append(block(self.in_channels, out_channels, stride))
            self.in_channels = out_channels * 4

        return nn.Sequential(*layers)
```

<br>

## ResNeXt50, 101, 152 정의하기

```python
# Resnet과 형태는 똑같다.
def resnext50():
    return ResNext(ResNextBottleNeck, [3, 4, 6, 3])

def resnext101():
    return ResNext(ResNextBottleNeck, [3, 4, 23, 3])

def resnext152():
    return ResNext(ResNextBottleNeck, [3, 4, 36, 3])
```



<br>
