---
layout: single
title: "빅데이터분석기사(R) - 제1유형 10문제 풀이 (1)"
excerpt: "2021년 제 3회 빅데이터분석기사 실기를 위한 문제풀이 내용입니다. - 1~10번"
categories: R_ML
tag : [R, certificate, 빅데이터 분석기사, 실기, 작업형, 필답형, 자격증, dataq, 정리, pdf, 기출문제]
toc: true
sidebar_main: true
classes: wide

last_modified_at: 2022-03-31
---

빅데이터 분석기사 실기 대비 차원에서 쓴 글입니다. <br> 기출문제의 데이터는 [https://github.com/ingu627/BigDataAnalysis](https://github.com/ingu627/BigDataAnalysis)에 데이터 셋을 남겨놨습니다.<br> 또한 해당 전체 코드는 `sujebi_1.R` 파일에 담겨져 있습니다.
{: .notice--info}

혹시 해당 글을 pdf로 받고 싶으신 분은 이메일과 함께 댓글로 남겨주세요~
{: .notice--success}

## 1. airquality

- airquality 데이터 세트에서 Solar.R에 결측값이 있는 행을 제거하고, Ozone 항목의 결측값을 중앙값으로 대체한 후 중앙값으로 대체하기 이전과 이후의 Ozone의 표준편차의 차이를 구하시오.

```R
data(airquality)
str(airquality)

library(dplyr)
ds = airquality %>% filter(!is.na(Solar.R))
before_sd = sd(ds$Ozone, na.rm = TRUE)
before_sd # 33.27597

med_O = median(ds$Ozone, na.rm = TRUE)

ds$Ozone = ifelse(
    is.na(ds$Ozone), 
    med_O, ds$Ozone)

after_sd = sd(ds$Ozone)
after_sd # 29.3704
print(abs(before_sd - after_sd)) # 3.90557
```

<br>
<br>

## 2. Hitters

- Salary의 이상값의 합을 구하시오. (단, 이상값은 중위수에서 IQR의 2배를 초과하는 값으로 한다.)

```R
library(ISLR)
data(Hitters)

head(Hitters)
str(Hitters)
summary(Hitters)

med = median(Hitters$Salary, na.rm = TRUE)
iqr = IQR(Hitters$Salary, na.rm = TRUE)

library(dplyr)
ds2 = Hitters %>% select(Salary) %>% 
    filter(Salary < (med - 2*iqr) | Salary > (med + 2*iqr))
result = sum(ds2)
print(result) # 21671.86
```

<br>
<br>

## 3. diamonds

- 데이터를 순서대로 80% 데이터를 훈련 데이터로 만들어서 price 기준으로 상위 100개의 데이터에 대한 price의 평균을 구하시오.

```R
# install.packages('ggplot2')
library(ggplot2)
data(diamonds)

head(diamonds)
str(diamonds)
summary(diamonds)

idx=nrow(diamonds)*0.8
ds=diamonds[1:idx,]

library(dplyr)
ds_train = ds %>% arrange(desc(price)) %>% 
    head(100)

mean(ds_train$price) # 18663.33
```

<br>
<br>

## 4. airquality

- 데이터의 순서대로 90% 데이터를 훈련 데이터로 추출하고 Ozone 항목의 결측값을 평균으로 변경한 후 변경 전, 후의 중앙값의 차이를 구하시오.

```R
data(airquality)

idx=nrow(airquality)*0.9
ds = airquality[1:idx,]
before_sd = median(ds$Ozone, na.rm = TRUE)

ds$Ozone = ifelse(
    is.na(ds$Ozone),
    mean(ds$Ozone, na.rm = TRUE), ds$Ozone)

after_sd = median(ds$Ozone, na.rm = TRUE)
result = abs(before_sd - after_sd)
print(result) # 10.36634
```

<br>
<br>

## 5. music

> 데이터 참고 : [https://www.kaggle.com/insiyeah/musicfeatures](https://www.kaggle.com/insiyeah/musicfeatures)

- tempo 항목의 상위 25%와 하위 25%를 0으로 대체하여 훈련 데이터를 생성하고 tempo 항목의 평균과 표준편차의 합을 구하시오.

```R
music=read.csv('./sujebi_data/music.csv')
head(music)
str(music)
summary(music)

quantile(music$tempo)
#       0%       25%       50%       75%      100%
#  54.97839  99.38401 117.45384 135.99918 234.90767

ds <- music$tempo <- ifelse(
    music$tempo < 99.38401,
    0,
    ifelse(
        music$tempo > 135.99918,
        0,
        music$tempo
    )
)
result = mean(ds) + sd(ds)
print(result) # 124.3836
```

<br>
<br>

## 6. telco-customer-churn

> 데이터 참고 : [https://www.kaggle.com/blastchar/telco-customer-churn](https://www.kaggle.com/blastchar/telco-customer-churn)

- TotalCharges 항목에서 이상값을 제외한 평균을 구하시오. (이상값은 평균에서 1.5 표준편차 이상인 값)

```R
churn = read.csv('sujebi_data/WA_Fn-UseC_-Telco-Customer-Churn.csv')
str(churn)

sum(is.na(churn$TotalCharges))
mean = mean(churn$TotalCharges, na.rm = TRUE)
sd = sd(churn$TotalCharges, na.rm = TRUE)

upper = mean + 1.5*sd
under = mean - 1.5*sd

library(dplyr)
ds <- churn %>% select(TotalCharges) %>% 
    filter(TotalCharges > under & TotalCharges < upper)

result = mean(ds$TotalCharges, na.rm = TRUE)
print(result) # 1663.995
```

<br>
<br>

## 7. cats

- 심장의 무게(Hwt)의 이상값의 평균을 구하시오. (단, MASS 패키지의 cats 데이터 세트를 사용하고, 이상값은 평균에서 1.5배 표준편차를 벗어나는 값으로 한다.) (cats 데이터 세트는 MASS 라이브러리에 있음)

```R
# install.packages('MASS')
library(MASS)
data(cats)
quantile(cats$Hwt)
sum(is.na(cats$Hwt))

c_mean = mean(cats$Hwt)
c_sd = sd(cats$Hwt)

upper = c_mean + 1.5*c_sd
under = c_mean - 1.5*c_sd

library(dplyr)
ds <- cats %>%
    filter(Hwt > upper | Hwt < under)

result = mean(ds$Hwt)
print(result) # 13.94375
```

<br>
<br>

## 8. orings

- damage가 1 이상일 경우의 temp와 damage의 피어슨 상관계수를 구하시오. (faraway 패키지의 orings 데이터 세트)

```R
# install.packages('faraway')
library(faraway)
data(orings)

library(dplyr)
ds = orings %>% 
    filter(damage >= 1)
result = cor(ds$temp, ds$damage, method="pearson")
print(result) # -0.5790513
```

<br>
<br>

## 9. mtcars

- 수동(am=1)중에서 가장 무게(wt)가 작게 나가는 10개 데이터의 평균 연비(mpg)와 자동(am=0) 중에서 가장 무게(wt)가 작게 나가는 10개 데이터의 평균 연비(mpg)의 차이를 구하시오.

```R
data(mtcars)
str(mtcars)

library(dplyr)
ds1 = mtcars %>%
    filter(am==1) %>% 
    arrange(wt)
am1_mean = mean(head(ds1$mpg, 10))

ds2 = mtcars %>% 
    filter(am==0) %>% 
    arrange(wt)
am2_mean = mean(head(ds2$mpg, 10))

result = abs(am1_mean - am2_mean)
print(result) # 7.07
```

<br>
<br>

## 10. diamonds

- 순서대로 80% 데이터를 제거한 후 cut이 "Fair"이면서 carat이 1 이상인 diamonds의 price의 최댓값을 구하시오.

```R
library(ggplot2)
data(diamonds)

idx1 = nrow(diamonds)*0.8
idx2 = nrow(diamonds)

ds = diamonds[idx1:idx2,]

library(dplyr)
ds1 = ds %>% 
    filter(cut == "Fair" & carat >=1)
sum(is.na(ds1))
str(ds1)

result = max(ds1$price) 
print(result) # 2745
```

<br>
<br>

## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264)