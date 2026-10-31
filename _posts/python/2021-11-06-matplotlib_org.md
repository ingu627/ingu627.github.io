---
layout: single
title: "파이썬 matplotlib 라이브러리에 대한 모든 것"
excerpt: "figure, label, lim, marker, grid, vline, hline, xlim, ylim, axis, alpha, color, rotation, fill_between, tick_params, subplot, width, align, color, edgecolor, linewidth, histogram, autopct, startangle, shawdow"
categories: python
tags : [python, matplotlib, visualization, figure, label, lim, marker, grid, vline, hline, xlim, ylim, axis, alpha, color, rotation, fill_between, tick_params, subplot, width, align, color, edgecolor, linewidth, histogram, autopct, startangle, shawdow]
toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2026-10-09
---

본 글은 [matplotlib.org](https://matplotlib.org/)사이트-의 튜토리얼을 참고해서 작성했습니다.


## figure의 구성요소 

![matplotlib_org_1_0](/assets/images/legacy/db7ff836b1.webp)


## 라이브러리 불러오기 
```python
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

%precision 3
pd.set_option('precision', 3)
%matplotlib inline
```


## plot()
- plot()함수는 임의 개수의 인자를 받을 수 있다.
- plot() : 선(line)또는 마커(marker)그래프 그리기에 사용되는 함수

```python
plt.plot(np.array([2,3,5,10]))
plt.ylabel('y-label')
plt.show()
```
    
![matplotlib_org_3_0](/assets/images/legacy/d68fa24a78.webp)

```python
# 첫번째 x값(x-value), 두번째 y값(y-value)
# Matplotlib은 리스트의 값들이 y값들이라고 가정하고, x값 [0, 1, 2, 3]을 자동으로 만들어낸다.

plt.plot([1,2,3,4], [1,4,9, 16]) 
```
    
![matplotlib_org_4_1](/assets/images/legacy/327b0df933.webp)


## 레이블이 있는 데이터 사용하기
```python
data_dict = {'data_x': [1,2,3,4,5], 'data_y': [2,3,5,10,8]}
plt.plot('data_x', 'data_y', data=data_dict)
plt.show()
```

![matplotlib_org_6_0](/assets/images/legacy/70275afc29.webp)


## 스타일 지정하기
- x, y값 인자에 대해 선의 색상과 행태를 지정하는 포맷 문자열을 세번째 인자에 입력할 수 있다.
- **axis()** : x,y축이 표시되는 범위를 지정할 수 있다.
- `[xmin, xmax, ymin, ymax ]` 4개의 값을 반드시 써야 한다.

```python
# (1,1), (2,4), (3,9), (4,16)를 잇는 그래프가 나타남
plt.plot([1,2,3,4], [1,4,9, 16], 'ro') # ro는 빨간색(r)의 원형(o) 마커를 의미
plt.axis([0, 6, 0, 20])
plt.show()
```

![matplotlib_org_8_0](/assets/images/legacy/f933fdeacd.webp)

```python
t = np.arange(0., 5., 0.2)
# 'r--' : 빨간 대쉬 , 'bs' : 파란 사각형, 'g^' : 녹색 삼각형
plt.plot(t, t, 'r--', t, t**2, 'bs', t, t**3, 'g^') #default값은 실선
plt.show()
```

![matplotlib_org_9_0](/assets/images/legacy/6c34df3610.webp)


## 축 레이블 설정하기
```python
plt.plot([1,2,3,4], [1,4,9, 16])
plt.xlabel('X-Label') # 그래프의 축에 레이블을 표시하기
plt.ylabel('Y-Label')
plt.show()
```

![matplotlib_org_11_0](/assets/images/legacy/e5eadd1e91.webp)


### 레이블 - 여백 지정하기(labelpad)
```python
plt.plot([1,2,3,4], [1,4,9, 16])
plt.xlabel('X-Label', labelpad=15)
plt.ylabel('Y-Label', labelpad=20) 
plt.show()
```

![matplotlib_org_13_0](/assets/images/legacy/12edff91bd.webp)


### 레이블 - 위치 지정하기(loc)
- xlabel() 함수의 loc 파라미터는 X축 레이블의 위치를 지정한다. ({‘left’, ‘center’, ‘right’})
- ylabel() 함수의 loc 파라미터는 Y축 레이블의 위치를 지정한다. ({‘bottom’, ‘center’, ‘top’})

```python
plt.plot([1,2,3,4], [1,4,9, 16])
plt.xlabel('X-Label', loc='right')
plt.ylabel('Y-Label', loc='top') 
plt.show()
```

![matplotlib_org_15_0](/assets/images/legacy/7e31487943.webp)


## 축 범위 지정하기  


### xlim()
- x축이 표시되는 범위를 지정하거나 반환한다.


### ylim()
- y축이 표시되는 범위를 지정하거나 반환한다.


### axis()
- x,y축이 표시되는 범위를 지정하거나 반환한다.

```python
plt.plot([1,2,3,4], [2,3,5,10])
plt.xlabel('X-axis')
plt.ylabel('Y-axis')
plt.xlim([0,5]) # X축의 범위 : [xmin, xmax]
plt.ylim([0,20]) # Y축의 범위 : [ymin, ymax]
plt.show()
```

![matplotlib_org_17_0](/assets/images/legacy/aaa5722043.webp)


## 범례 표시하기
    
![matplotlib_org_19_0](/assets/images/legacy/979172beb8.webp)

```python
plt.plot([1,2,3,4], [2,3,5,10], label='Price ($)')
plt.plot([1,2,3,4], [3,5,9,7], label='Demand (#)')
plt.xlabel('X-Label')
plt.ylabel('Y-Label')
# plt.legend(loc=(0.5,0))
plt.legend(loc='lower right', ncol=2, fontsize=14) #범례의 열 개수 지정하기

plt.show()
```

![matplotlib_org_20_0](/assets/images/legacy/64c5bebdd7.webp)


## marker 설정

![matplotlib_org_22_0](/assets/images/legacy/d0ea332a01.webp)
    
![matplotlib_org_23_0](/assets/images/legacy/a19d4d5586.webp)


## 색상

![matplotlib_org_25_0](/assets/images/legacy/ac853bdc8f.webp)

![matplotlib_org_26_0](/assets/images/legacy/ec57ec0974.webp)


### alpha
- 텍스트의 투명도
- 범위 : 0.0 ~ 1.0 (float)


## color
- 텍스트의 색상
- Any Matplotlib color


## family
- 텍스트의 글꼴
- FONTNAME , ‘serif’ , ‘sans-serif’ , ‘cursive’ , ‘fantasy’ , ‘monospace’


### rotation
- 텍스트의 회전각
- angle in degrees , ‘vertical’ , ‘horizontal’ 


### size
- 텍스트의 크기
- size in points , ‘xx-small’ , ‘x-small’ , ‘small’ , ‘medium’ , ‘large’ , ‘x-large’ , ‘xx-large’


### weight
- 텍스트의 굵기
- a numeric value in range 0-1000 , ‘ultralight’ , ‘light’ , ‘normal’ , ‘regular’ , ‘book’ , ‘medium’ , ‘roman’ , ‘semibold’ , ‘demibold’ , ‘demi’ , ‘bold’ , ‘heavy’ , ‘extra bold’ , ‘black’

- **color 키워드** : 색상 지정  
- **marker 키워드** : 마커의 스타일 지정 (markersize 가능)  
- **linestyle 키워드** : 선의 스타일 지정 (linewidth 가능)  
- **alpha 키워드** : 투명도 결정 


## 폰트 설정하기
```python
font1 = {'family': 'serif',
         'color': 'b',
         'weight': 'bold',
         'size': 14
         }

font2 = {'family': 'fantasy',
         'color': 'deeppink',
         'weight': 'normal',
         'size': 'xx-large'
         }

plt.plot([1, 2, 3, 4], [2, 3, 5, 10])
plt.xlabel('X-Axis', labelpad=15, fontdict=font1)
plt.ylabel('Y-Axis', labelpad=20, fontdict=font2)
plt.show()
```

![matplotlib_org_30_0](/assets/images/legacy/e8ac102388.webp)


## 그래프 영역 채우기


### fill_between()
- 두 수평 방향의 곡선 사이를 채운다.


### fill_betweenx()
- 두 수직 방방의 곡선 사이를 채운다.


### fill()
- 다각형 영역을 채운다.
- fill() 함수에 x,y 값의 리스트를 입력해주면, 각 x,y점들로 정의되는 다각형 영역을 자유롭게 지정해서 채울 수 있다.

```python
x= [1,2,3,4]
y=[1, 4, 9, 16]

plt.plot(x,y)
plt.xlabel('X-Label')
plt.ylabel('Y-Label')
plt.fill_between(x[1:3], y[1:3], alpha=0.5)
plt.show()
```


![matplotlib_org_33_0](/assets/images/legacy/21527b02ea.webp)


```python
x=[1,2,3,4]
y=[2,3,5,10]

plt.plot(x, y)
plt.xlabel('X-axis')
plt.ylabel('Y-axis')
plt.fill_betweenx(y[2:4], x[2:4], alpha=0.5)
plt.show()
```


![matplotlib_org_34_0](/assets/images/legacy/17d0670537.webp)


```python
# 두 그래프 사이 영역 채우기
x= [1,2,3,4]
y1 =[1, 4, 9, 16]
y2 =[1,2,4,8]

plt.plot(x,y1)
plt.plot(x,y2)
plt.xlabel('X-Label')
plt.ylabel('Y-Label')
plt.fill_between(x[1:3], y1[1:3], y2[1:3], alpha=0.5)
plt.show()
```


![matplotlib_org_35_0](/assets/images/legacy/04be55abc9.webp)


```python
#임의의 영역 채우기 
x= [1,2,3,4]
y1 =[1, 4, 9, 16]
y2 =[1,2,4,8]

plt.plot(x,y1)
plt.plot(x,y2)
plt.xlabel('X-Label')
plt.ylabel('Y-Label')
plt.fill([1.9, 1.9, 3.1, 3.1], [2,5,11,8], color='lightgray', alpha=0.5)
plt.show()
```


![matplotlib_org_36_0](/assets/images/legacy/7d4f7be093.webp)


```python
x = np.arange(0, 2, 0.2)
plt.plot(x, x, 'bo')
plt.plot(x, x**2, color='#e35f62', marker='*', linewidth=2)
plt.plot(x, x**3, color='springgreen', marker='^', markersize=9)
plt.grid(True, axis='y', color='red', alpha=0.5, linestyle='--')
plt.show()
```


![matplotlib_org_37_0](/assets/images/legacy/14f4d145ce.webp)


## 그리드(grid) 설정하기
- grid(True)로 설정하면, 그래프의 x,y축에 대해 그리드가 표시됨
- axis=y로 설정하면 가로 방향의 그리드만 표시된다. [both, x, y] 중 선택 가능. default는 both

```python
t = np.arange(0., 5., 0.2)
# 'r--' : 빨간 대쉬 , 'bs' : 파란 사각형, 'g^' : 녹색 삼각형
plt.plot(t, t, 'r--', t, t**2, 'bs', t, t**3, 'g^') #default값은 실선
plt.grid(True, axis='y') 

plt.show()
```

![matplotlib_org_39_0](/assets/images/legacy/469e5f18b0.webp)


## 눈금 표시하기
- 틱(Tick)은 그래프의 축에 간격을 구분하기 위해 표시하는 눈금
- xticks(), yticks(), tick_params() 함수들이 있다.
- xticks(), yticks() 함수는 각각 x축, y축에 눈금을 표시한다.

```python
a = np.arange(0, 2, 0.2)
plt.plot(a, a, 'bo')
plt.plot(a, a**2, color='#e35f62', marker='*', linewidth=2)
plt.plot(a, a**3, color='springgreen', marker='^', markersize=9, linestyle='--')
plt.xticks([0, 1, 2])
plt.yticks(np.arange(1, 6))

plt.show()
```

![matplotlib_org_41_0](/assets/images/legacy/8134bef2d0.webp)

```python
a = np.arange(0, 2, 0.2)
plt.plot(a, a, 'bo')
plt.plot(a, a**2, color='#e35f62', marker='*', linewidth=2)
plt.plot(a, a**3, color='springgreen', marker='^', markersize=9)
plt.xticks(np.arange(0, 2, 0.2), labels=['Jan', '', 'Feb', '', 'Mar', '', 'May', '', 'June', ''])
plt.yticks(np.arange(0, 7), ('0', '1GB', '2GB', '3GB', '4GB', '5GB', '6GB'))
# labels 파라미터를 사용하면 눈금 레이블을 명시적으로 지정할 수 있다.

plt.show()
```

![matplotlib_org_42_0](/assets/images/legacy/006a200f72.webp)


### tick_params()
- 함수를 사용하면 눈금의 스타일을 다양하게 설정할 수 있다.  (ticks는 간단하게, 이건 복잡할때)


### axis
- 설정이 적용될 축을 지정합니다. {‘x’, ‘y’, ‘both’} 중 선택할 수 있다.  


### direction
- ‘in’, ‘out’으로 설정하면 눈금이 안/밖으로 표시됩니다. {‘in’, ‘out’, ‘inout’} 중 선택할 수 있다.  


### length
- 눈금의 길이를 지정한다.  


### pad
- 눈금과 레이블과의 거리를 지정한다.    


### labelsize
- 레이블의 크기를 지정한다.    


### labelcolor 
- 레이블의 색상을 지정한다.  


### top/bottom/left/right 
- `True/False`로 지정하면 눈금이 표시될 위치를 선택할 수 있다.  


### width
- 눈금의 너비를 지정한다.

### color
- 눈금의 색상을 지정한다.  

```python
a = np.arange(0, 2, 0.2)
plt.plot(a, a, 'bo')
plt.plot(a, a**2, color='#e35f62', marker='*', linewidth=2)
plt.plot(a, a**3, color='springgreen', marker='^', markersize=9)
plt.xticks(np.arange(0,2,0.2), labels=['Jan', '', 'Feb', '', 'Mar', '', 'May', '', 'June', ''])
plt.yticks(np.arange(0, 7), ('0', '1GB', '2GB', '3GB', '4GB', '5GB', '6GB'))
plt.tick_params(axis='x', direction='in', length=3, pad=6, labelsize=14, labelcolor='green', top=True)
plt.tick_params(axis='y', direction='inout', length=10, pad=15, labelsize=12, width=2, color='r')

plt.show()
```


![matplotlib_org_44_0](/assets/images/legacy/3a577ff957.webp)


## 타이틀 설정하기
- fontdict 파라미터에 딕셔너리 형태로 폰트 스타일을 설정할 수 있습니다.
- ‘fontsize’를 16으로, ‘fontweight’를 ‘bold’로 설정했습니다.
- ‘fontsize’는 포인트 단위의 숫자를 입력하거나 ‘smaller’, ‘x-large’ 등의 상대적인 설정을 할 수 있습니다.
- ‘fontweight’에는 {‘normal’, ‘bold’, ‘heavy’, ‘light’, ‘ultrabold’, ‘ultralight’}와 같이 설정할 수 있습니다.

```python
a = np.arange(0, 2, 0.2)
plt.plot(a, a, 'bo')
plt.plot(a, a**2, color='#e35f62', marker='*', linewidth=2)
plt.plot(a, a**3, color='springgreen', marker='^', markersize=9)
plt.grid(True, axis='y', color='gray', alpha=0.5, linestyle='--')
plt.tick_params(axis='both', direction='in', length=3, pad=6, labelsize=14)
plt.title('Sample graph', loc='right', pad=20)

# loc='right'로 설정하면, 타이틀이 그래프의 오른쪽 위에 나타나게 된다. 
# left, center, right로 설정할 수 있으며, default는 center이다.
# pad=20은 타이틀과 그래프와의 간격(오프셋)을 포인트 단위로 설정한다.

title_font = {
    'fontsize': 16,
    'fontweight': 'bold'
}
plt.title('Sample graph', fontdict=title_font, loc='left', pad=20)

plt.show()
```


![matplotlib_org_47_0](/assets/images/legacy/d33bb5ae94.webp)

```python
x = np.arange(0, 2, 0.2)
plt.plot(x, x, 'bo')
plt.plot(x, x**2, color='#e35f62', marker='*', linewidth=2)
plt.plot(x, x**3, color='forestgreen', marker='^', markersize=9)
plt.tick_params(axis='both', direction='in', length=3, pad=6, labelsize=14)
title_right = plt.title('Graph Title', loc='right', pad=20)

title_font = {
    'fontsize': 16,
    'fontweight': 'bold'
}

title_left = plt.title('Graph Title', fontdict=title_font, loc='left', pad=20)

print(title_left.get_position())
print(title_left.get_text())

#plt.title()함수는 타이틀을 나타내는 Matplotlib text객체를 반환한다.
#get_position()과 get_text()메서드를 사용해서 텍스트 위치와 문자열을 얻을 수 있다.

print(title_right.get_position())
print(title_right.get_text())

plt.show()
```


![matplotlib_org_48_1](/assets/images/legacy/abc7665dc1.webp)


## 선 종류 지정하기
```python
plt.plot([1,2,3], [4,4,4], '-', color='C0', label='Solid')
plt.plot([1,2,3], [3,3,3], '--', color='C0', label='Dashed')
plt.plot([1,2,3], [2,2,2], ':', color='C0', label='Dotted')
plt.plot([1,2,3], [1,1,1], '-.', color='C0', label='Dash-dot')
plt.xlabel('X-Axis')
plt.ylabel('Y-Axis')
plt.axis([0.8, 3.2, 0.5, 5.0])
plt.legend(loc='upper right', ncol=4)

plt.show()
```

![matplotlib_org_50_0](/assets/images/legacy/737823f001.webp)


## 여러 개의 그래프 그리기


### subplot()

- 여러 개의 그래프를 하나의 그림에 나타내도록 한다.
- `subplot(nrows, ncols, index)`

![image](/assets/images/legacy/5fe388c656.webp)

```python
fig = plt.figure()
ax1 = fig.add_subplot(2, 1, 1)
ax2 = fig.add_subplot(2, 1, 2)
plt.show()
```

![image](/assets/images/legacy/84d1547630.webp)


## 수직선/수평선 표시하기
- 그래프의 특정 값에 해당하는 위치에 수직선/수평선을 표시하기 위해서


### axhline()
- 축을 따라 수평선을 표시한다.



### axvline()
- 축을 따라 수직선을 표시한다.


### hlines()
- 지정한 점을 따라 수평선을 표시한다.


### vlines()
- 지정한 점을 따라 수직선을 표시한다.


### axhline(), hline()
- axhline, hline의 함수(1, 2, 3)
- 첫번째 인자는 y값으로서 수평선의 위치가 된다.
- 두번째 인자는 xmin(0에서 1사이의 값) 0은 아래쪽 끝, 1은 위쪽 끝
- 세번째 인자는 xmax(0과 1사이의 값)


### avhline(), vline()
- avhline, vline의 함수(1, 2, 3)
- 첫번째 인자는 x값으로서 수평선의 위치가 된다.
- 두번째 인자는 ymin(0에서 1사이의 값)
- 세번째 인자는 ymax(0과 1사이의 값)

```python
x= np.arange(0, 4, 0.5)
plt.plot(x, x+1, 'bo')
plt.plot(x, x**2-4, 'g--')
plt.plot(x, -2*x+3, 'r:')

plt.axhline(4, 0.1, 0.9, color='lightgray', linestyle='--', linewidth=2)
plt.hlines(-0.62, 1, 2.5, color='gray', linestyle='solid', linewidth=3)

plt.show()
```


![matplotlib_org_52_0](/assets/images/legacy/10a906b8d8.webp)


```python
x= np.arange(0, 4, 0.5)
plt.plot(x, x+1, 'bo')
plt.plot(x, x**2-4, 'g--')
plt.plot(x, -2*x+3, 'r:')

plt.axvline(1, 0.2, 0.8, color='lightgray', linestyle='--', linewidth=2)
plt.vlines(1.8, -3, 2, color='gray', linestyle='solid', linewidth=3)

plt.show()
```


![matplotlib_org_53_0](/assets/images/legacy/fd0a05c814.webp)


```python
a = np.arange(0, 2, 0.2)
plt.plot(a, a, 'bo')
plt.plot(a, a**2, color='#e35f62', marker='*', linewidth=2)
plt.plot(a, a**3, color='springgreen', marker='^', markersize=9)
plt.xticks(np.arange(0, 2, 0.2), labels=['Jan', '', 'Feb', '', 'Mar', '', 'May', '', 'June', ''])
plt.yticks(np.arange(0, 7), ('0', '1GB', '2GB', '3GB', '4GB', '5GB', '6GB'))
plt.axhline(1, 0, 0.55, color='gray', linestyle='--', linewidth='1')
# axhline()함수의 첫번째 인자는 y값으로서 수평선의 위치가 된다.

plt.axvline(1, 0, 0.16, color='lightgray', linestyle=':', linewidth='2')
plt.axhline(5.83, 0, 0.95, color='gray', linestyle='--', linewidth='1')
plt.axvline(1.8, 0, 0.95, color='lightgray', linestyle=':', linewidth='2')

plt.show()
```


![matplotlib_org_54_0](/assets/images/legacy/e2553498e3.webp)


## 축 스케일 지정하기
```python
x = np.linspace(-10,10,100)
y = x ** 3
plt.plot(x,y)
plt.xscale('symlog')

plt.show()
```

![matplotlib_org_56_0](/assets/images/legacy/398932f94d.webp)

```python
x = np.linspace(0,5, 100)
y = np.exp(x)
plt.plot(x, y)
plt.yscale('linear')
# plt.yscale('log')

plt.show()
```


![matplotlib_org_57_0](/assets/images/legacy/a03cb64d8a.webp)


## Bar graph()
- 막대 그래프 : 범주가 있는 데이터 값을 직사각형의 막대로 표현하는 그래프

```python
x = np.arange(3)
# np.arange는 주어진 범위와 간격에 따라 균일한 값을 갖는 array를 생성하는 함수
years = ['2017', '2018', '2019']
values = [100, 400, 900]
plt.bar(x, values)
plt.xticks(x, years)

plt.show()
```


![matplotlib_org_60_0](/assets/images/legacy/08852598df.webp)


```python
x = np.arange(3)
years = ['2018', '2019', '2020']
values = [100, 400, 900]
colors = ['y', 'dodgerblue', 'C2']
plt.bar(x, values, color=colors)
plt.xticks(x, years) # 데이터 : x , 레이블 : years

plt.show()
```

![matplotlib_org_61_0](/assets/images/legacy/4ccc2bb370.webp)


### width
- 막대의 너비.
- 디폴트 값은 0.8이며, 예제에서는 0.6으로 설정했다.


### align
- 틱 (tick)과 막대의 위치를 조절
- 디폴트 값은 ‘center’인데, ‘edge’로 설정하면 막대의 왼쪽 끝에 x_tick이 표시된다.


### color
- 막대의 색을 지정


### edgecolor
- 막대의 테두리 색을 지정


### linewidth
- 테두리의 두께를 지정


### tick_label
- 어레이 형태로 지정하면, 틱에 어레이의 문자열을 순서대로 나타낼 수 있다.


### log=True
- `log=True`로 설정하면, y축이 로그 스케일로 표시된다.

```python
x = np.arange(3)
years = ['2017', '2018', '2019']
values = [100, 400, 900]
plt.bar(x, values, width=0.6, align='edge', color='springgreen',
        edgecolor='gray', linewidth=3, tick_label=years, log=True)

plt.show()
```


![matplotlib_org_63_0](/assets/images/legacy/bd256fbf55.webp)


### height
- 막대의 높이
- 디폴트는 0.8


### align
- tick과 막대의 위치를 조절
- 디폴트는 ‘center’인데 ‘edge’로 설정하면 막대의 아래쪽 끝에 y_tick이 표시된다.


### color
- 막대의 색을 지정


### edgecolor
- 막대의 테두리색을 지정


### linewidth
- 테두리의 두께를 지정


### tick_label
- 어레이 형태로 지정해주면, 틱에 어레이의 문자열을 순서대로 나타낼 수 있다.


### log=False
- `log=False`로 설정하면, x 축이 선형 스케일로 표시된다. 디폴트는 False이다.

```python
y = np.arange(3)
years = ['2017', '2018', '2019']
values = [100, 400, 900]
# height = 막대의 높이 지정
plt.barh(y, values, height=-0.6, align='edge', color="springgreen",
        edgecolor="gray", linewidth=3, tick_label=years, log=False)

plt.show()
```


![matplotlib_org_66_0](/assets/images/legacy/b73181c1ad.webp)


## 산점도(scatter plot)
- 두 변수의 상관 관계를 직교 좌표계의 평면에 데이터를 점으로 표현하는 그래프

```python
N=50
x = np.random.rand(N)
y = np.random.rand(N)
colors = np.random.rand(N)
area = (30 * np.random.rand(N))**2

plt.scatter(x, y, s=area, c=colors, alpha=0.5, cmap='Spectral')
# scattor에 x,y위치 입력
# s : 마커의 면적 (size)
# c : 마커의 색 (color)
# alpha : 마커 색의 투명도 
# cmap: 컬러맵에 해당하는 문자열 지정 
# cmap  종류 : PiYG', 'PRGn', 'BrBG', 'PuOr', 'RdGy', 'RdBu',
            # 'RdYlBu', 'RdYlGn', 'Spectral', 'coolwarm', 'bwr', 'seismic
```


![matplotlib_org_70_1](/assets/images/legacy/b39ce470ec.webp)


## 3차원 산점도 그리기

```python
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.pyplot as plt
import numpy as np

n=100
xmin, xmax, ymin, ymax, zmin, zmax = 0, 20, 0, 20, 0, 50
# xs,ys는 0에서 20사이, zs는 0에서 50 사이의 값을 갖도록 범위를 정해준다.
# color는 0에서 2사이의 값을 갖는 실수이고, 이 값을 통해 각각 다른 색을 표현한다.
cmin, cmax = 0, 2

xs = np.array([(xmax-xmin)*np.random.random_sample() + xmin for i in range(n) ])
ys = np.array([(ymax-ymin)*np.random.random_sample() + ymin for i in range(n) ])
zs = np.array([(zmax-zmin)*np.random.random_sample() + zmin for i in range(n) ])
color = np.array([(cmax-cmin)*np.random.random_sample() + cmin for i in range(n) ])

fig=plt.figure(figsize=(6,6))
ax = fig.add_subplot(111, projection='3d')
ax.scatter(xs, ys, zs, c=color, marker='o', s=15, cmap='Greens')

plt.show()
```


![matplotlib_org_73_0](/assets/images/legacy/80f7747482.webp)


## histogram()
- 히스토그램(histogram)은 도수분포표를 그래프로 나타낸 것으로서, 가로축은 계급, 세로축은 도수(횟수나 개수 등)을 나타낸다.

```python
# plt.his(values)
weight = [68,81,64,56,78,74,61,77,66,68,59,71,
        80,59,67,81,69,73,69,74,70,65]
plt.hist(weight)

plt.show()
```

![matplotlib_org_75_0](/assets/images/legacy/80c6756b36.webp)


```python
# bins: 히스토그램의 가로축 구간의 개수를 지정 
# plt.his(values)
weight = [68,81,64,56,78,74,61,77,66,68,59,71,
        80,59,67,81,69,73,69,74,70,65]
plt.hist(weight, label='bins=10')
plt.hist(weight, bins=30, label='bins=30')
plt.legend()

plt.show()
```

![matplotlib_org_76_0](/assets/images/legacy/c550884992.webp)


## 누적 히스토그램 그리기
- `plt.hist(values, cumulative=True)`
```python
weight = [68,81,64,56,78,74,61,77,66,68,59,71,
        80,59,67,81,69,73,69,74,70,65]
plt.hist(weight, cumulative=True, label='cumulative=True')
plt.hist(weight, cumulative=False, label='cumulative=False')
plt.legend(loc='upper left')

plt.show()
```

![matplotlib_org_77_0](/assets/images/legacy/b5c76d88b5.webp)


## 히스토그램 종류 지정하기
- plt.hist(values, histtype='bar')
- plt.hist(values, histtype='barstacked')
- plt.hist(values, histtype='step')
- plt.hist(values, histtype='stepfilled')

```python
weight = [68, 81, 64, 56, 78, 74, 61, 77, 66, 68, 59, 71,
        80, 59, 67, 81, 69, 73, 69, 74, 70, 65]
weight2 = [52, 67, 84, 66, 58, 78, 71, 57, 76, 62, 51, 7,
        69, 64, 76, 57, 63, 53, 79, 64, 50, 61]

plt.hist((weight, weight2), histtype='bar')
plt.title('histtype - bar')
plt.figure()

plt.hist((weight, weight2), histtype='barstacked')
plt.title('histtype - barstacked')
plt.figure()

plt.hist((weight, weight2), histtype='step')
plt.title('histtype - step')
plt.figure()

plt.hist((weight, weight2), histtype='stepfilled')
plt.title('histtype - stepfilled')

plt.show()
```

![matplotlib_org_79_0](/assets/images/legacy/8a12d22ee8.webp)

![matplotlib_org_79_1](/assets/images/legacy/2724e717a5.webp)

![matplotlib_org_79_2](/assets/images/legacy/9d24d4fe0d.webp)

![matplotlib_org_79_3](/assets/images/legacy/270f70d72d.webp)

```python
a = 2.0 * np.random.randn(10000) + 1.0
b = np.random.standard_normal(10000)
c = 20.0 * np.random.rand(5000) - 10.0

#density=True : 밀도함수가 되어 막대의 아래 면적이 1이 된다.

plt.hist(a, bins=100, density=True, alpha=0.7, histtype='step')
plt.hist(b, bins=50, density=True, alpha=0.5, histtype='stepfilled')
plt.hist(c, bins=100, density=True, alpha=0.9, histtype='step')

plt.show()
```

![matplotlib_org_80_0](/assets/images/legacy/0ff3cd4b83.webp)


## pie(파이) 차트 그리기
### autopct
- 부채꼴 안에 표시될 숫자의 형식을 지정


### startangle
- 부채꼴이 그려지는 시작 각도를 설정


### counterclock=False
- 시계 방향 순서로 부채꼴 영역이 표시됨

```python
ratio = [34, 32, 16, 18]
labels = ['Apple', 'Banana', 'Melon', 'Grapes']
plt.pie(ratio, labels=labels, autopct='%.1f%%', startangle=260, counterclock=False)

plt.show()
```

![matplotlib_org_82_0](/assets/images/legacy/e9c3515f38.webp)


### explode : 부채꼴이 파이 차트의 중심에서 벗어나는 정도를 설정
### shawdow : 그림자 설정 

```python
ratio = [34, 32, 16, 18]
labels = ['Apple', 'Banana', 'Melon', 'Grapes']
explode = [0, 0.10, 0, 0.10]
colors = ['silver', 'gold', 'whitesmoke' ,'lightgray']

plt.pie(ratio, labels=labels, autopct='%.1f%%', startangle=260, counterclock=False,
    explode=explode, shadow=True, colors=colors)

plt.show()
```

![matplotlib_org_83_0](/assets/images/legacy/b9f7ccf869.webp)

```python
ratio = [34, 32, 16, 18]
labels = ['Apple', 'Banana', 'Melon', 'Grapes']
colors = ['#ff9999', '#ffc000', '#8fd9b6', '#d395d0']
wedgeprops={'width': 0.7, 'edgecolor': 'w', 'linewidth': 5}

plt.pie(ratio, labels=labels, autopct='%.1f%%', startangle=260, counterclock=False, colors=colors, wedgeprops=wedgeprops)

plt.show()
```


![matplotlib_org_84_0](/assets/images/legacy/b24bbca281.webp)


## References

- [Matplotlib 공식 사이트](https://matplotlib.org/)
- [Matplotlib Tutorial - 파이썬으로 데이터 시각화하기](https://wikidocs.net/book/5011)
- [파이썬으로 배우는 알고리즘 트레이딩 - Figure와 subplots](https://wikidocs.net/4761)
- [Matplotlib 여러 개의 그래프 그리기](https://codetorial.net/matplotlib/subplot.html)