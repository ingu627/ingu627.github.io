---
layout: single
title: "ResNet50 전이학습: 사전학습 가중치 재구성 & FashionMNIST 미세조정"
excerpt: "ResNet 잔차 블록 개념과 layer 동결·부분 해제·맞춤 Linear 헤드 교체·학습률 전략으로 소규모 FashionMNIST를 효율 미세조정"
categories: code
tags: [alexnet, pytorch, 파이토치, resnet, 전이학습, fashion mnist, 코드, 구현, design, 설명, layer, transfer, resnet50, Linear, 모델, 학습, 손실함수, 크로스 엔트로피, 다중 클래스, 옵티마이저, 에포크, 모델 저장, 로드, metric, 딥러닝, cv, 컴퓨티 비전]
toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2022-04-18
---

{% capture related %}
**관련 구현 글**  
- [AlexNet 구현](/code/alexnet_pytorch/)  
- [ResNet Scratch](/code/ResNet_scratch_pytorch/)  
- [ResNeXt Scratch](/code/ResNeXt_scratch_pytorch/)  
- [Lightning + W&B](/code/pytorch_lightning_mnist/)  
{% endcapture %}
{% include notice.html content=related %}

<img align='right' width='250' src='https://user-images.githubusercontent.com/78655692/162919635-d03d7e8f-c492-493b-8c4d-d2f0f88ae67e.png'>
본 글은 Pytorch 기반 ResNet 전이 학습을 이용해 구현해보는 내용입니다.<br>하나하나 분해해봅시다.  <br><br> 논문 : [Deep Residual Learning for Image Recognition](https://arxiv.org/abs/1512.03385)<br>코드 : [Pre-trained networks, Transfer learning and Ensembles](https://colab.research.google.com/github/kjamithash/Pytorch_DeepLearning_Experiments/blob/master/FashionMNIST_ResNet_TransferLearning.ipynb) <br> 블로그 글 코드 : [ResNet_with_PyTorch.ipynb](https://github.com/data-science-DL/pytorch/blob/master/deeplearning_ajou/ResNet_with_PyTorch.ipynb)<br> 파이토치 튜토리얼 : [pytorch.org](https://pytorch.org/docs/stable/index.html)
{: .notice--info}




<br>

## ResNet

- ResNet은 Resdiual Learning를 이용해 152 layer까지 가질 수 있게 되었다. 이 모델은 ILSVRC 2015년에 우승했다.
- ResNet를 전이학습해 Fashion_MNIST를 학습해본다.

<br>

### 라이브러리 불러오기

- 라이브러리의 설명은 기존 글 [AlexNet 구조 파악 및 PyTorch로 코드 구현해보기](https://ingu627.github.io/code/alexnet_pytorch/)에서 자세히 설명했으니 여기서는 생략한다.

```python
import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import torchvision.models as models
from torchvision import transforms
import time
from tqdm.autonotebook import tqdm
from torch.utils.data import DataLoader
from sklearn.metrics import precision_score, recall_score, f1_score, accuracy_score
import inspect
import torch.nn.functional as F

import matplotlib.pyplot as plt
import numpy as np
```

<br>

### 사전훈련된 네트워크 불러오기

- Fashion_MNIST 데이터셋을 훈련하기 위해 입력층과 출력층을 바꿔준다.
  - ImageNet : 1000개 클래스
  - Fashion_MNIST : 10개 클래스

```python
class MnistResNet(nn.Module): # MnistResNet은 nn.Module 상속
  def __init__(self, in_channels=1):
    super(MnistResNet, self).__init__()

    # torchvision.models에서 사전훈련된 resnet 모델 가져오기
    self.model = models.resnet50(pretrained=True)

    # 기본 채널이 3(RGB)이기 때문에 fashion_mnist에 맞게 1(grayscale image)로 바꿔준다.  
    # 원래 ResNet의 첫번째 층
    # self.conv1 = nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3, bias=False)
    self.model.conv1 = nn.Conv2d(in_channels, 64, kernel_size=7, stride=2, padding=3, bias=False)
    
    # 1000개 클래스 대신 10개 클래스로 바꿔주기
    num_ftrs = self.model.fc.in_features
    # nn.Linear(in_features, out_features ...)
    self.model.fc = nn.Linear(num_ftrs, 10)

  def forward(self, x): # 모델에 있는 foward 함수 그대로 가져오기
    return self.model(x)


my_resnet = MnistResNet()
```

<br>

### 정의한 네트워크 테스트

```python
input = torch.randn((16,1,224,224))
output = my_resnet(input)
print(output.shape)

print(my_resnet)

# 결과
```

![image](https://user-images.githubusercontent.com/78655692/162910028-478bd3ea-9861-4d49-b529-8a3305205890.png)

<br>

### device 정의

```python
if torch.cuda.is_available():
    device = torch.device("cuda") 
else:
    device = torch.device("cpu")
```

<br>

### Dataloaders 함수 정의

```python
def get_data_loaders(train_batch_size, val_batch_size):
    fashion_mnist = torchvision.datasets.FashionMNIST(
        download=True, 
        train=True, 
        root=".").train_data.float()
    
    data_transform = transforms.Compose([ # Compose : transforms 리스트 구성
        transforms.Resize((224, 224)), # Resize : 입력 이미지의 크기를 지정된 크기로 조정
        transforms.ToTensor(), # ToTensor : PIL image or numpy.ndarray를 tensor로 바꿈
        transforms.Normalize((fashion_mnist.mean()/255,), (fashion_mnist.std()/255,))])

    train_loader = DataLoader(torchvision.datasets.FashionMNIST(
        download=True, # 인터넷으로부터 데이터 다운
        root=".", # data가 저장될 경로(path)
        transform=data_transform, # feature 및 label 변환(transformation) 지정
        train=True), # train set
        batch_size=train_batch_size, 
        shuffle=True)

    val_loader = DataLoader(torchvision.datasets.FashionMNIST(
        download=False, 
        root=".", 
        transform=data_transform, 
        train=False),
        batch_size=val_batch_size, 
        shuffle=False)

    return train_loader, val_loader
```

<br>

### Metric 계산을 위한 함수 정의

```python
def calculate_metric(metric_fn, true_y, pred_y):
    if "average" in inspect.getfullargspec(metric_fn).kwonlyargs:
        # getfullargspec(func) : 호출 가능한 개체의 매개 변수의 이름과 기본값을 가져옴 (튜플로 반환)
        # kwonlyargs : 모든 parameter 값 확인
        return metric_fn(true_y, pred_y, average="macro")
        # macro : 평균의 평균을 내는 방법
        # micro : 개수 그자체로 평균을 내는 방법
    else:
        return metric_fn(true_y, pred_y)

# precision, recall, f1, accuracy를 한번에 보여주기 위한 함수
def print_scores(p, r, f1, a, batch_size):
    for name, scores in zip(("precision", "recall", "F1", "accuracy"), (p, r, f1, a)):
        print(f"\t{name.rjust(14, ' ')}: {sum(scores)/batch_size:.4f}")
```

<br>

### 정의된 내용을 바탕으로 실제 학습하기

```python
# 모델 가져와 gpu에 할당
model = MnistResNet().to(device)

# 에포크, 배치 크기 지정
epochs = 5
batch_size = 50

# 데이터로더(Dataloaders)
train_loader, val_loader = get_data_loaders(batch_size, batch_size)

# 손실함수 정의(loss function)
loss_function = nn.CrossEntropyLoss() 
# 크로스 엔트로피 : 실제 값과 예측 값의 차이를 줄이기 위한 엔트로피
# 다중 클래스 문제에서 잘 작동

# 옵티마이저 : Adam 
optimizer = torch.optim.Adam(model.parameters(), lr=3e-4) 
# model(신경망) 파라미터를 optimizer에 전달해줄 때 nn.Module의 parameters() 메소드를 사용
# Karpathy's learning rate 사용 (3e-4)

start_ts = time.time() # 초단위 시간 반환

losses = []
batches = len(train_loader)
val_batches = len(val_loader)

# 에포크 : training + evaluation
for epoch in range(epochs):
    total_loss = 0

    # tqdm : 진행률 프로세스바
    progress = tqdm(enumerate(train_loader), desc="Loss: ", total=batches)

    # ----------------- TRAINING  -------------------- 
    # training 모델로 설정
    model.train()
    
    for i, data in progress:
        X, y = data[0].to(device), data[1].to(device)
        
        # 단일 배치마다 training 단계
        model.zero_grad() # 모든 모델의 파라미터 미분값을 0으로 초기화
        outputs = model(X)
        loss = loss_function(outputs, y)
        loss.backward()
        optimizer.step() # step() : 파라미터를 업데이트함

        # training data 가져오기
        current_loss = loss.item() # item() : 키, 값 반환
        total_loss += current_loss

        # set_description : 진행률 프로세스바 업데이트
        progress.set_description("Loss: {:.4f}".format(total_loss/(i+1)))
        
    # out of memory in GPU 뜰 때
    if torch.cuda.is_available():
        torch.cuda.empty_cache() # # GPU 캐시 데이터 삭제
    
    # ----------------- VALIDATION  ----------------- 
    val_losses = 0
    precision, recall, f1, accuracy = [], [], [], []
    
    # set model to evaluating (testing)
    model.eval()
    with torch.no_grad():
        for i, data in enumerate(val_loader):
            X, y = data[0].to(device), data[1].to(device)

            outputs = model(X) # 네트워크로부터 예측값 가져오기

            val_losses += loss_function(outputs, y)

            predicted_classes = torch.max(outputs, 1)[1] # 네트워크의 예측값으로부터 class 값(범주) 가져오기
            
            # P/R/F1/A metrics for batch 계산
            for acc, metric in zip((precision, recall, f1, accuracy), 
                                   (precision_score, recall_score, f1_score, accuracy_score)):
                acc.append(
                    calculate_metric(metric, y.cpu(), predicted_classes.cpu())
                )
          
    print(f"Epoch {epoch+1}/{epochs}, training loss: {total_loss/batches}, validation loss: {val_losses/val_batches}")
    print_scores(precision, recall, f1, accuracy, val_batches)
    losses.append(total_loss/batches) # 학습률을 위한 작업
print(f"Training time: {time.time()-start_ts}s")

```

<br>

### 모델 저장하기

```python
torch.save(model.state_dict(), "/tmp/MnistResNet")    
model = MnistResNet()
model_state_dict = torch.load("/tmp/MnistResNet")
model.load_state_dict(model_state_dict)
```










<br>
