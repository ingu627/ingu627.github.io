---
layout: single
title: "PyTorch Lightning + Weights & Biases: MNIST 실험 템플릿 자동화"
excerpt: "Lightning Module·Trainer 구조로 학습 루프/로깅 추상화하고 W&B 연동으로 실험 추적·메트릭 시각화 자동화하는 워크플로"
categories: code
tags: [pytorch lightning, wandb, pytorch, mnist, 예제, 코드, init, forward, training_step, validation_step, configure_optimizers, 사용법, 정리, 설명, mlops]
toc: true
toc_sticky: false
sidebar_main: false

last_modified_at: 2022-07-13
redirect_from:
  - /code/pytorch_lightning_mnist/
---

{% capture related %}
**관련 구현 글**  
- [ResNet 전이학습](/code/ResNet50_pytorch/)  
- [ResNet Scratch](/code/ResNet_scratch_pytorch/)  
- [ResNeXt Scratch](/code/ResNeXt_scratch_pytorch/)  
- [AlexNet 구현](/code/alexnet_pytorch/)  
{% endcapture %}
{% include notice.html content=related %}

<img align='right' width='250' src='https://user-images.githubusercontent.com/78655692/178315781-684e139b-9095-45a4-ba26-41d4acacfc2b.png'>
본 글은 Pytorch Lightning + Wandb을 활용하여 mnist 예제 살펴보는 내용입니다. <br> 개인 공부를 목적으로 썼습니다. <br><br>  참고 : <br> [pytorchlightning 공식 사이트](https://www.pytorchlightning.ai/) <br> [wandb - pytorch-lighning](https://wandb.ai/quickstart/pytorch-lightning) <br> [Use Pytorch Lightning with Weights & Biases](https://wandb.ai/cayush/pytorchlightning/reports/Use-Pytorch-Lightning-with-Weights-Biases--Vmlldzo2NjQ1Mw)
{: .notice--info}

<br>

## Introduction

- 딥러닝 실험을 구현하기 위해서는 뉴럴네트워크와 같은 모델 코드 외에도 그 시스템을 만들고 실험을 수행하기 위한 많은 엔지니어링 코드가 필요하다. [^1]
  - 특히,  PyTorch만으로도 충분히 다양한 AI 모델들을 쉽게 생성할 수 있지만 GPU나 TPU, 그리고 16-bit precision, 분산학습 등 더욱 복잡한 조건에서 실험하게 될 경우, 코드가 복잡해진다.
- Pytorch Lightning은 사용자가 엔지니어링이 아닌 연구에 집중할 수 있도록 함으로써 세계에서 가장 널리 사용되는 딥러닝 프레임워크 중 하나가 되었다.
- Pytorch Lightning은 머신러닝, 딥러닝 모델 구축을 할 때
  1. 공통된 부분들을 반복해서 작성할 필요 없이 대신 처리해주고,
  2. 머신러닝 모델 구축의 탬플릿 코드로써 기능을 하며,
  3. 다른 사람이 작성한 코드를 쉽게 볼 수 있도록 공통된 스타일을 갖도록 하고,
  4. 모델의 개별적인 부분은 유연하게 커스터마징하여 실험할 수 있게 해주는 라이브러리이다.

<br>

## Pytorch Lightning

- Pytorch Lightning은 크게 Trainer와 Lightning Module로 나뉜다.
- **Lightning Module**에서 모델의 구조나 데이터 전처리, 손실함수 등의 설정을 통해 모델을 초기화한다.
  - `pl.LightningModule` 클래스를 상속받아 새로운 `LightningModule` 클래스를 생성한다. [^2]
  - `__init__`, `forward`, `configure_optimizers`, `training_step`, `validation_step` 등을 구현한다. 
- **Trainer**는 모델읠 학습을 담당하는 클래스이다. 모델의 학습 epoch나 batch 상태들과 모델을 저장해 로그를 생성하는 부분들을 담당한다.

<br>

<img src='https://user-images.githubusercontent.com/78655692/178400817-4c991d13-4e47-4545-a739-b5b6237a23dd.png' width=650> <br> 이미지출처 [^3]

- 사용자는 파란색 부분만 건드리면 된다. 나머지는 pytorch-lightning이 알아서 해준다.

<br>

### init

- 이제 mnist 예제를 통해 코드를 자세히 살펴본다.
- init은 초기화 메서드이다.
- pytorch에서 neural network class를 생성하려면, torch.nn.module을 불러와야 한다.
- pytorch-lightning에서는 pl.LightningModule을 사용한다.
- 생성자에서 네트워크에 필요한 모듈을 생성한다.

    ```python
    # 해당 라이브러리들을 불러온다.
    import torch
    from torch import nn
    from torch.nn import functional as F
    from torch.utils.data import DataLoader
    from torch.utils.data import random_split
    from torchvision.datasets import MNIST
    from torchvision import transforms
    import pytorch_lightning as pl
    from pytorch_lightning import Trainer


    class LitAutoEncoder(pl.LightningModule):
        
        def __init__(self):
            super().__init__()
            self.encoder = nn.Sequential(
                nn.Linear(28 * 28, 64),
                nn.ReLU(),
                nn.Linear(64, 3))
            self.decoder = nn.Sequential(
                nn.Linear(3, 64),
                nn.ReLU(),
                nn.Linear(64, 28 * 28))
    ```

<br>

### forward

- forward은 추론(inference)에 사용된다.
- 모델의 입력에 대한 output을 낸다.

    ```python
    def forward(self, x):
            embedding = self.encoder(x)
            return embedding
    ```

<br>

### training_step

- `training_step`은 forward와 유사하지만, 단일 배치에서의 손실을 반환해야 하며, 이는 train loop로 자동 반복된다.
  - 1 iter 에 대한 training을 의미하며, batch만큼의 output을 얻고 loss를 반환한다.
- 모델 학습은 배치 단위로 이뤄진다.
- 배치를 모델에 입력한 뒤 모델 출력을 정답과 비교해 차이를 계산한다.
- 그리고 그 차이를 최소화하는 방향으로 모델을 업데이트한다.
  - 이 일련의 순환 과정을 **스텝(step)**이라 한다.
  - step 함수는 forward를 통해 output을 얻고 loss를 계산한다.

    ```python
    def training_step(self, train_batch, batch_idx):
            x, y = train_batch
            # (b, 1, 28, 28) -> (b, 1*28*28)
            x = x.view(x.size(0), -1)
            z = self.encoder(x)    
            x_hat = self.decoder(z)
            loss = F.mse_loss(x_hat, x)
            self.log('train_loss', loss)
            return loss
    ```

<br>

### validation_step

- validation loop를 추가하려면 `validation_step` 메서드를 추가한다.
- `validation_step`은 학습 중간에 모델의 성능을 체크하는 용도로 사용한다. [^1]

    ```python
    def validation_step(self, val_batch, batch_idx):
                x, y = val_batch
                # (b, 1, 28, 28) -> (b, 1*28*28)
                x = x.view(x.size(0), -1)
                z = self.encoder(x)
                x_hat = self.decoder(z)
                loss = F.mse_loss(x_hat, x)
                self.log('val_loss', loss)
    ```

<br>

### configure_optimizers

- `configure_optimizers`에서는 모델의 최적의 파라미터를 찾을 때 사용할 optimizer와 scheduler를 구현한다. 

    ```python
    def configure_optimizers(self):
            optimizer = torch.optim.Adam(self.parameters(), lr=1e-3)
            return optimizer
    ```

<br>

### data & model & training

- **data** 부분에서 MNIST 데이터셋으로부터 DataLoader를 초기화한다.
- **model** 부분에서 앞서 정의한 LitAutoEncoder() 모델을 초기화한다.
- **training** 부분에서 Trainer를 초기화해주고 fit을 통해 모델을 학습시킨다.
  - Pytorch lightning의 Trainer는 굉장히 많은 기능을 제공한다. (gpu, epoch, node 등등 설정 가능하다.)
  - **트레이너(Trainer)**는 pytorch lightning에서 제공하는 객체로 실제 학습을 수행한다.
  - 이 트레이너는 GPU 등 하드웨어 설정, 학습 기록 로깅, 체크포인트 저장 등 복잡한 설정을 알아서 해준다.

    ```python
    # data
    dataset = MNIST('', train=True, download=True, transform=transforms.ToTensor())
    mnist_train, mnist_val = random_split(dataset, [55000, 5000])
    train_loader = DataLoader(mnist_train, batch_size=32)
    val_loader = DataLoader(mnist_val, batch_size=32)

    # model
    model = LitAutoEncoder()

    # training
    trainer = pl.Trainer()
    trainer.fit(model, train_loader, val_loader)
    ```

<br>

## Wandb

- Wandb는 Weights & Biases를 줄인 용어로 모델을 모니터링할 수 있는 강력한 mlops 툴 중 하나이다.
- pytorch-lightning과 통합되어 간단한 코드를 추가하여 구현할 수 있다.
- 먼저 wandb를 설치해준다.

    ```python
    pip install wandb
    wandb login
    ```

- 그럼, key를 복사하라고 뜨는데, 복사하여 커멘트 창에 붙여넣기를 해주면 로그인이 된다.
- 이제 스크립트에 몇줄만 추가해주면 된다.

    ```python
    from pytorch_lightning.loggers import WandbLogger
    from pytorch_lightning import Trainer

    wandb_logger = WandbLogger(project="pl-mnist")
    ...

    trainer = Trainer(logger=wandb_logger)

    ...
    ```

<br>

## 전체 코드

- 위 과정을 전체 코드로 나타내면 다음과 같다.

    ```python
    import torch
    from torch import nn
    from torch.nn import functional as F
    from torch.utils.data import DataLoader
    from torch.utils.data import random_split
    from torchvision.datasets import MNIST
    from torchvision import transforms
    import pytorch_lightning as pl
    from pytorch_lightning.loggers import WandbLogger
    from pytorch_lightning import Trainer

    wandb_logger = WandbLogger(project='pl-mnist')

    class LitAutoEncoder(pl.LightningModule):
        
        def __init__(self):
            super().__init__()
            self.encoder = nn.Sequential(
                nn.Linear(28 * 28, 64),
                nn.ReLU(),
                nn.Linear(64, 3))
            self.decoder = nn.Sequential(
                nn.Linear(3, 64),
                nn.ReLU(),
                nn.Linear(64, 28 * 28))
            
        def forward(self, x):
            embedding = self.encoder(x)
            return embedding
        
        def configure_optimizers(self):
            optimizer = torch.optim.Adam(self.parameters(), lr=1e-3)
            return optimizer
        
        def training_step(self, train_batch, batch_idx):
            x, y = train_batch
            x = x.view(x.size(0), -1)
            z = self.encoder(x)    
            x_hat = self.decoder(z)
            loss = F.mse_loss(x_hat, x)
            self.log('train_loss', loss)
            return loss
        
        def validation_step(self, val_batch, batch_idx):
            x, y = val_batch
            x = x.view(x.size(0), -1)
            z = self.encoder(x)
            x_hat = self.decoder(z)
            loss = F.mse_loss(x_hat, x)
            self.log('val_loss', loss)
            
    # data
    dataset = MNIST('', train=True, download=True, transform=transforms.ToTensor())
    mnist_train, mnist_val = random_split(dataset, [55000, 5000])
    train_loader = DataLoader(mnist_train, batch_size=32)
    val_loader = DataLoader(mnist_val, batch_size=32)

    # model
    model = LitAutoEncoder()

    # training
    trainer = pl.Trainer(logger=wandb_logger)
    trainer.fit(model, train_loader, val_loader)
    ```

<br>

## 결과

![image](https://user-images.githubusercontent.com/78655692/178334879-202bf6ec-323f-49a8-8a30-6366b4fa6613.png)

![image](https://user-images.githubusercontent.com/78655692/178334933-00b6c95f-bd54-4127-b673-cbb0fc021fd0.png)





<br>

## References

[^1]: [OneBook(Python & Deep Learning)](https://sdc-james.gitbook.io/onebook/9.6-6.-pytorch-lightning)
[^2]: [PyTorch 딥러닝 챗봇 - 6-1. LightningModule Class](https://wikidocs.net/157586)
[^3]: [36 Ways Pytorch Lightning Can Supercharge Your AI Research - William Falcon](https://towardsdatascience.com/supercharge-your-ai-research-with-pytorch-lightning-337948a99eec)
