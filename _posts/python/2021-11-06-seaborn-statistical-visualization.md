---
layout: single
title: "Python Seaborn: 분포·범주·관계·행렬 플롯 선택 & 테마 활용"
excerpt: "분포/범주/관계/행렬 플롯 선택 기준과 팔레트·FacetGrid·스타일 설정으로 탐색형 데이터 시각화 흐름 구축"
categories: python
tags: [python, seaborn, visualization, rugplot, kdeplot, distplot, countplot, jointplot, pairplot, heatmap, barplot, boxplot, violinplot, stripplot, swarmplot, catplot]
toc: true
toc_sticky: false
sidebar_main: false

last_modified_at: 2022-04-11
---

본 글은 [seaborn.pydata.org](https://seaborn.pydata.org/)사이트-의 튜토리얼을 참고해서 작성했습니다.
{: .notice--info}

<br>
<br>

## 요약

- 1차원 실수 - rugplot, kdeplot, distplot
- 1차원 범주 - countplot
- 2차원 연속/연속 - jointplot, pairplot
- 2차원 범주/범주 - heatmap(선행 : pivot_table => 연속형으로 만들기)
- 2차원 범주/연속 - barplot, boxplot, violinplot, stripplot, swarmplot
- 다차원 범주/연속 - barplot, boxplot, violinplot, stripplot, swarmplot + hue옵션
- 3차원 이상 - catplot

<br>
<br>

## library 가져오기
```python
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
```

<br>
<br>

## 한글 깨짐 방지 코드
```python
import matplotlib
from matplotlib import font_manager, rc
import platform
if platform.system()=="Windows":
    font_name=font_manager.FontProperties(fname="c:/Windows/Fonts/malgun.ttf").get_name()
    rc('font', family=font_name)
matplotlib.rcParams['axes.unicode_minus']=False

import warnings
warnings.filterwarnings("ignore")
```

<br>
<br>

## seaborn
: Seaborn은 Matplotlib을 기반으로 다양한 색상 테마와 통계용 차트 등의 기능을 추가한 시각화 패키지이다.

```python
iris = sns.load_dataset("iris")    # 붓꽃 데이터
titanic = sns.load_dataset("titanic")    # 타이타닉호 데이터
tips = sns.load_dataset("tips")    # 팁 데이터
flights = sns.load_dataset("flights")    # 여객운송 데이터
```

<br>
<br>

## 1차원 데이터
-1차원 데이터는 실수 값이면 히스토그램과 같은 실수 분포 플롯으로 나타내고, 카테고리 값이면 카운트 플롯으로 나타낸다.

<br>
<br>

### 1차원 실수 분포 플롯

<br>

### rugplot()

- 데이터 위치를 x축 위에 작은 선분(rug)으로 나타내어 실제 데이터들의 위치를 보여준다.

```python
x = iris.petal_length.values
sns.rugplot(x)
plt.title("Iris 데이터 중, 꽃잎의 길이에 대한 Rug Plot ")
plt.show()
```

![seaborn_org_16_0](https://user-images.githubusercontent.com/78655692/140616257-cd742974-75d6-4940-a2c1-380590bebcf7.png)

<br>
<br>

### kdeplot()

: 커널 밀도(kernel density)는 커널이라는 함수를 겹치는 방법으로 히스토그램보다 부드러운 형태의 분포 곡선을 보여주는 방법이다.

```python
sns.kdeplot(x)
plt.title("Iris 데이터 중, 꽃잎의 길이에 대한 Kernel Density Plot")
plt.show()
```

![seaborn_org_17_0](https://user-images.githubusercontent.com/78655692/140616291-a96df7ad-437c-42a5-b531-aa5d08aefa2e.png)

<br>
<br>

### distplot()

- Seaborn의 distplot 명령은 러그와 커널 밀도 표시 기능이 있어서 Matplotlib의 hist 명령보다 많이 사용된다.

```python
sns.distplot(x, kde=True, rug=True)
plt.title("Iris 데이터 중, 꽃잎의 길이에 대한 Dist Plot")
plt.show()
```

![seaborn_org_18_0](https://user-images.githubusercontent.com/78655692/140617273-459f0b0f-d873-43ff-af47-77bfb4c80b12.png)

<br>
<br>

### countplot()

- countplot 명령을 사용하면 각 카테고리 값별로 데이터가 얼마나 있는지 표시할 수 있다.
- 사용방법 : countplot(x="column_name", data=dataframe)
- data 인수에는 대상이 되는 데이터프레임을, 
- x 인수에는 데이터프레임의 열 이름 문자열을 넣는다.

```python
sns.countplot(x='class', data=titanic)
plt.title("타이타닉호의 각 클래스별, 승객 수")
plt.show()
```

![seaborn_org_19_0](https://user-images.githubusercontent.com/78655692/140617307-79ee03c6-62ff-4cbb-a7fc-0b555669fbb1.png)

    
```python
sns.countplot(x="day", data=tips)
plt.title("요일별 팁을 준 횟수")
plt.show()
```

![seaborn_org_20_0](https://user-images.githubusercontent.com/78655692/140617319-3fd7f911-c905-4e64-bcea-cf5c4d597b97.png)

<br>
<br>

## 다차원 데이터

- 분석하고자 하는 데이터가 모두 실수 값인 경우
- 분석하고자 하는 데이터가 모두 카테고리 값인 경우
- 분석하고자 하는 데이터가 모두 실수 값과 카테고리 값이 섞여 있는 경우

<br>
<br>

## 2차원 실수형 데이터

<br>

### jointplot()

- 만약 데이터가 2차원이고 모두 연속적인 실수값이라면 스캐터 플롯(scatter plot)을 사용하면 된다.
- 스캐터 플롯을 그리기 위해서는 Seaborn 패키지의 jointplot 명령을 사용한다. 
- jointplot 명령은 스캐터 플롯뿐 아니라 차트의 가장자리(margin)에 각 변수의 히스토그램도 그린다.
- jointplot(x="x_name", y="y_name", data=dataframe, kind='scatter')

```python
sns.jointplot(x='sepal_length', y='sepal_width', data=iris)
plt.suptitle("꽃받침의 길이와 넓이의 Joint Plot", y=1.02)
plt.show()
```

![seaborn_org_23_0](https://user-images.githubusercontent.com/78655692/140617385-fb10d085-c87b-4369-948d-bfd65235813f.png)

<br>

```python
# kind='kde'이면 커널 밀도 히스토그램을 그린다.
sns.jointplot(x="sepal_length", y="sepal_width", data=iris, kind="kde")
plt.suptitle("꽃받침의 길이와 넓이의 Joint Plot 과 Kernel Density Plot", y=1.02)
plt.show()
```

![seaborn_org_24_0](https://user-images.githubusercontent.com/78655692/140617420-38ca5847-7716-47d6-800f-faa305f1e718.png)

<br>
<br>

## 다차원 실수형 데이터

<br>

### pairplot()

- 만약 3차원 이상의 데이터라면 seaborn 패키지의 pairplot 명령을 사용한다. 
- pairplot은 데이터프레임을 인수로 받아 그리드(grid) 형태로 각 데이터 열의 조합에 대해 스캐터 플롯을 그린다. 
- 같은 데이터가 만나는 대각선 영역에는 해당 데이터의 히스토그램을 그린다.

```python
sns.pairplot(iris)
plt.title("Iris Data의 Pair Plot")
plt.show()
```

![seaborn_org_26_0](https://user-images.githubusercontent.com/78655692/140617461-d9c76332-dac0-4f88-a00f-ffb6a3434b8f.png)

<br>
<br>

### hue=

- 만약 카테고리형 데이터가 섞여 있는 경우에는 hue 인수에 카테고리 변수 이름을 지정하여 카테고리 값에 따라 색상을 다르게 할 수 있다.

```python
sns.pairplot(iris, hue='species', markers=['o', 's', 'D'])
plt.title("Iris Pair Plot, Hue로 꽃의 종을 시각화")
plt.show()
```

![seaborn_org_27_0](https://user-images.githubusercontent.com/78655692/140617498-de4106e1-97fe-433a-b44f-2ea9f5fddffa.png)

<br>
<br>

## 2차원 카테고리 데이터

<br>

### heatmap()
- 만약 데이터가 2차원이고 모든 값이 카테고리 값이면 heatmap 명령을 사용한다.
  - 모든 값을 카테고리형으로 만들기 위해 pivot_table을 먼저 이용해준다.
- 연속형 데이터만 가능 하다.

```python
titanic_size = titanic.pivot_table(
    index='class', columns='sex', aggfunc='size')
titanic_size
```

![image](https://user-images.githubusercontent.com/78655692/140618446-d05766c1-a14c-442b-9624-22db7fe4bd5d.png)

<br>

```python
sns.heatmap(titanic_size, cmap=sns.light_palette(
    'gray', as_cmap=True), annot=True, fmt='d')
plt.title('Heatmap')
plt.show()
```

![seaborn_org_30_0](https://user-images.githubusercontent.com/78655692/140617866-b1f18658-888b-4fca-9557-c4b572267d8a.png)

<br>
<br>

## 2차원 복합 데이터

- 만약 데이터가 2차원이고 실수 값, 카테고리 값이 섞여 있다면 기존의 플롯 이외에도 다음과 같은 분포 플롯들을 이용할 수 있다.
  - barplot
  - boxplot
  - pointplot
  - violinplot
  - stripplot
  - swarmplot

<br>
<br>

### barplot()

- 카테고리 값에 따른 실수 값의 평균과 편차를 표시하는 기본적인 바 차트를 생성한다.
- 평균은 막대의 높이로, 편차는 에러바(error bar)로 표시한다.

```python
sns.barplot(x='day', y='total_bill', data=tips)
plt.title('요일 별, 전체 팁')
plt.show()
```

![seaborn_org_32_0](https://user-images.githubusercontent.com/78655692/140617904-793aff44-a13e-47a4-b801-8180d6684e76.png)

<br>
<br>

### boxplot()
- boxplot 명령은 박스-휘스커 플롯(Box-Whisker Plot) 혹은 간단히 박스 플롯이라 부르는 차트를 그려준다.
- 박스 플롯은 박스와 박스 바깥의 선(whisker)으로 이루어진다.
- 박스는 실수 값 분포에서 1사분위수(Q1)와 3사분위수(Q3)를 뜻하고 이 3사분위수와 1사분수의 차이(Q3 - Q1)를 IQR(interquartile range)라고 한다. 
- 박스 내부의 가로선은 중앙값을 나타낸다. 
- 박스 외부의 세로선은 1사분위 수보다 1.5 x IQR 만큼 낮은 값과 3사분위 수보다 1.5 x IQR 만큼 
- 높은 값의 구간을 기준으로 그 구간의 내부에 있는 가장 큰 데이터와 가장 작은 데이터를 잇는 선분이다. 
- 그 바깥의 점은 아웃라이어(outlier)라고 부르는데 일일히 점으로 표시한다.    

```python
sns.boxplot(x='day', y='total_bill', data=tips)
plt.title('요일 별 전체 팁의 Box Plot')
plt.show()
```
 
![seaborn_org_33_0](https://user-images.githubusercontent.com/78655692/140617949-63350866-d36b-455c-89be-f3ef88b22682.png)

<br>
<br>

## violinplot(), stripplot(). swarmplot()

- boxplot이 중앙값, 표준 편차 등, 분포의 간략한 특성만 보여주는데 반해 violinplot, stripplot. swarmplot 등은 카테고리값에 따른 각 분포의 실제 데이터나 전체 형상을 보여준다는 장점이 있다.

<br>
<br>

### violinplot

- 세로 방향으로 커널 밀도 히스토그램을 그려주는데 왼쪽과 오른쪽이 대칭이 되도록 하여 바이올린처럼 보인다.

```python
sns.violinplot(x='day', y='total_bill', data=tips)
plt.title("요일 별 전체 팁의 Violin Plot")
plt.show()
```

![seaborn_org_35_0](https://user-images.githubusercontent.com/78655692/140618010-31bce276-9276-4528-8b5e-2599eb97c56d.png)

<br>
<br>

### stripplot 

- 스캐터 플롯처럼 모든 데이터를 점으로 그려준다.
- jitter=True를 설정하면 가로축상의 위치를 무작위로 바꾸어서 데이터의 수가 많을 경우에 겹치지 않도록 한다.    

```python
np.random.seed(0)
sns.stripplot(x='day', y='total_bill', data=tips, jitter=True)
plt.title("요일 별 전체 팁의 Strip Plot")
plt.show()
```

![seaborn_org_36_0](https://user-images.githubusercontent.com/78655692/140618026-21afb405-8bf4-4227-a12d-7f2c5bf8acfc.png)

<br>
<br>

### swarmplot 

- stripplot과 비슷하지만 데이터를 나타내는 점이 겹치지 않도록 옆으로 이동한다.

```python
sns.swarmplot(x='day', y='total_bill', data=tips)
plt.title("요일 별 전체 팁의 Swarm Plot")
plt.show()
```

![seaborn_org_37_0](https://user-images.githubusercontent.com/78655692/140618046-44b0866a-0001-4bb6-bef6-be9bc9906005.png)

<br>
<br>

## 다차원 복합 데이터

- 예를 들어 barplot, violinplot, boxplot 등 에서는 두 가지 카테고리 값에 의한 실수 값의 변화를 보기 위한 hue 인수를 제공한다. hue 인수에 카테고리 값을 가지는 변수의 이름을 지정하면 카테고리 값에 따라 다르게 시각화된다. hue 값이 시각화되는 방법은 플롯의 종류에 따라 다르다.

<br>
<br>

### barplot(), hue=
```python
sns.barplot(x="day", y="total_bill", hue="sex", data=tips)
plt.title("요일 별, 성별 전체 팁의 Histogram")
plt.show()
```

![seaborn_org_39_0](https://user-images.githubusercontent.com/78655692/140618062-68d4a06d-3903-4132-b8c1-38692dcae511.png)

<br>
<br>

### boxplot(), hue=
```python
sns.boxplot(x="day", y="total_bill", hue="sex", data=tips)
plt.title("요일 별, 성별 전체 팁의 Box Plot")
plt.show()
```
    
![seaborn_org_40_0](https://user-images.githubusercontent.com/78655692/140618081-e80919f3-6ca5-47fc-9324-04b53fdf5354.png)

<br>
<br>

### violinplot(), hue=

```python
sns.violinplot(x="day", y="total_bill", hue="sex", data=tips)
plt.title("요일 별, 성별 전체 팁의 Violin Plot")
plt.show()
```

![seaborn_org_41_0](https://user-images.githubusercontent.com/78655692/140618102-0f14e235-5682-4e79-b12e-1c9f5aad4db0.png)

<br>
<br>

### stripplot(), hue=

```python
np.random.seed(0)
sns.stripplot(x="day", y="total_bill", hue="sex", data=tips, jitter=True)
plt.title("요일 별, 성별 전체 팁의 Strip Plot")
plt.legend(loc=1)
plt.show()
```

![seaborn_org_42_0](https://user-images.githubusercontent.com/78655692/140618117-e5bd6559-e289-4c54-ad89-49340b2b7fff.png)

<br>
<br>

### swarplot(), hue=
```python
sns.swarmplot(x="day", y="total_bill", hue="sex", data=tips)
plt.title("요일 별, 성별 전체 팁의 Swarm Plot")
plt.legend(loc=1)
plt.show()
```

![seaborn_org_43_0](https://user-images.githubusercontent.com/78655692/140618137-caac58cd-ccec-47ea-ba39-bfc3c64b63a1.png)

<br>
<br>

### split= or dodge=
- stripplot, violinplot, swarmplot 등 에서는 split 또는 dodge 옵션으로 시각화 방법을 변경할 수도 있다.

```python
sns.violinplot(x="day", y="total_bill", hue="sex", data=tips, split=True)
plt.title("요일 별, 성별 전체 팁의 Violin Plot, Split=True")
plt.show()
```

![seaborn_org_44_0](https://user-images.githubusercontent.com/78655692/140618164-b4a6c31d-aa82-428e-a97e-7fcf7e7f225c.png)

<br>
<br>

```python
sns.stripplot(x="day", y="total_bill", hue="sex",
              data=tips, jitter=True, dodge=True)
plt.title("요일 별, 성별 전체 팁의 Strip Plot, Split=True")
plt.show()
```

![seaborn_org_45_0](https://user-images.githubusercontent.com/78655692/140618176-c0967473-8087-4dec-b0e6-e3f7c5053071.png)

<br>
<br>

```python
sns.swarmplot(x="day", y="total_bill", hue="sex", data=tips, dodge=True)
plt.title("요일 별, 성별 전체 팁의 Swarm Plot, Split=True")
plt.show()
```

![seaborn_org_46_0](https://user-images.githubusercontent.com/78655692/140618200-12b72491-e09d-4efa-955c-e5d95c964ca6.png)

<br>
<br>

### heatmap()

- heatmap을 이용해도 두 개의 카테고리 값에 의한 실수 값 변화를 볼 수 있다.

```python
flights_passengers = flights.pivot("month", "year", "passengers")
plt.title("연도, 월 별 승객수에 대한 Heatmap")
sns.heatmap(flights_passengers, annot=True, fmt="d", linewidths=1)
plt.show()
```

![seaborn_org_47_0](https://user-images.githubusercontent.com/78655692/140618239-2ef5926e-3734-49ac-b509-1d91467cc789.png)

<br>
<br>

### catplot()

- 색상(hue)과 행(row) 등을 동시에 사용하여 3 개 이상의 카테고리 값에 의한 분포 변화를 보여준다.
```python
data = titanic[titanic.survived.notnull()]
sns.catplot(x="age", y="sex", hue="survived", row="class", data=data,
            kind="violin", split=True, height=2, aspect=4)
plt.title("각 클래스의 성별 생존자 수의 Catplot")
plt.show()
```

![seaborn_org_49_0](https://user-images.githubusercontent.com/78655692/140618276-71760354-ae4f-4577-812e-77bedac5f339.png)

<br>
<br>

## 기타

- 시각화 효과를 높이기 위해 여러 종류의 차트를 겹쳐서 표시할 수도 있다.

```python
plt.title("Boxplot과 Strip Plot로 표현한, 요일 별 팁")
sns.boxplot(x="tip", y="day", data=tips, whis=np.inf)
sns.stripplot(x="tip", y="day", data=tips, jitter=True, color="0.4")
plt.show()
```

![seaborn_org_51_0](https://user-images.githubusercontent.com/78655692/140618297-861e2cc0-843a-4bc5-9088-9af3efe1b4d0.png)

<br>
<br>

```python
plt.title("Violin plot과 Swarm Plot로 표현한, 요일 별 팁")
sns.violinplot(x="day", y="total_bill", data=tips, inner=None)
sns.swarmplot(x="day", y="total_bill", data=tips, color="0.9")
plt.show()
```

![seaborn_org_52_0](https://user-images.githubusercontent.com/78655692/140618305-8a6c2aa4-b887-4707-a357-47a83aa27bdd.png)

<br>
<br>

## 스타일

```python
def sinplot(flip=1):
    x = np.linspace(0, 14, 100)
    for i in range(1, 7):
        plt.plot(x, np.sin(x + i * .5) * (7 - i) * flip)

sns.set_style("ticks")

sinplot()
```

![seaborn_org_55_0](https://user-images.githubusercontent.com/78655692/140618326-19772661-bc30-420b-ab43-2e1250fbda3b.png)

<br>
<br>

```python
sns.set_style("darkgrid")

sinplot()
```

![seaborn_org_56_0](https://user-images.githubusercontent.com/78655692/140618337-83754ad0-caca-4404-9e56-98628ef98561.png)

<br>
<br>

```python
sns.set_style("whitegrid")

sinplot()
```
  
![seaborn_org_57_0](https://user-images.githubusercontent.com/78655692/140618353-9f77bb9e-5b84-480b-b9bf-dfefac065221.png)

<br>
<br>
<br>
<br>

## References

- [seaborn 링크](http://seaborn.pydata.org/)
- [데이터 사이언스 스쿨 참조 링크](https://datascienceschool.net/01%20python/05.01%20%EC%8B%9C%EA%B0%81%ED%99%94%20%ED%8C%A8%ED%82%A4%EC%A7%80%20%EB%A7%B7%ED%94%8C%EB%A1%AF%EB%A6%AC%EB%B8%8C%20%EC%86%8C%EA%B0%9C.html)