---
layout: single
title: "빅데이터분석기사 실기 제1유형: 21문제 핵심 풀이 & 실수 포인트"
excerpt: "2021년 제 3회 빅데이터분석기사 실기를 위한 문제풀이 내용입니다. - 1~21번"
categories: R_ML
tags : [R, 빅데이터 분석기사, 실기, 작업형, 필답형, 자격증, dataq, 정리, pdf, 기출문제, 정리본, 후기, 설명, 2회, 3회]
toc: true
sidebar_main: false
classes: wide

last_modified_at: 2025-09-27
redirect_from:
  - /R_ML/solve_bigdata2/
---

빅데이터 분석기사 실기 대비 차원에서 작성한 글입니다. 기출 데이터는 [GitHub 저장소](https://github.com/ingu627/BigDataAnalysis)에 올려두었습니다. 전체 코드는 `sujebi_1.R` 파일에 포함되어 있습니다.
{: .notice--info}

2021.12.31 : 제 3회 빅데이터 분석기사 실기 합격. [빅데이터 분석기사(R)](https://ingu627.github.io/categories/R_ML) 시리즈가 학습에 도움이 되길 바랍니다.
{: .notice--danger}

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


## 11. airquality

- 8월 20일의 Ozone 값을 구하시오.

```R
data(airquality)
str(airquality)

library(dplyr)
ds=airquality %>% 
    filter(Month==8 & Day==20)

result=ds$Ozone
print(result)
```

 

## 12. iris

- Sepal.Length의 mean값과 Sepal.Width의 mean 값의 합계를 구하시오.

```R
data(iris)
result = mean(iris$Sepal.Length, na.rm = TRUE) + mean(iris$Sepal.Width, na.rm = TRUE)
print(result) # 8.900667
```

 

## 13. mtcars

- 4기통(cyl)인 자동차의 백분율(%)을 구하시오.

```R
data(mtcars)
str(mtcars)
summary(mtcars)

library(dplyr)
ds=mtcars %>% 
    filter(cyl==4)

result = nrow(ds) / nrow(mtcars) * 100
print(result) # 34.375
```

 

## 14. mtcars

- 변속 기어(gear) 수가 4이고 수동(am==1) 변속기인 데이터에서 자동차 연비(mpg)의 mean 값과 전체 마력(hp)의 표준편차의 합계를 구하시오.

```R
data(mtcars)
summary(mtcars)

library(dplyr)
ds = mtcars %>% 
    filter(gear == 4 & am==1)

result = mean(ds$mpg) + sd(ds$hp)
print(result) # 50.44959
```

## 15. Boston

- crim 항목이 1보다 작거나 같은 경우에 medv 항목의 mean 값을 구하시오.

```R
library(MASS)
data(Boston)

str(Boston)
summary(Boston)

library(dplyr)
ds = Boston %>% 
    filter(crim <= 1)
result=mean(ds$medv)
print(result) # 25.11084
```

## 16. iris

- iris 데이터 세트에서 Species가 virginica인 항목에서 Sepal.Length가 6보다 크면 1, 아니면 0으로 파생 컬럼 Len을 생성 후 Len 컬럼의 sum 값을 구하시오

```R
data(iris)
library(dplyr)

ds = iris %>% filter(Species == 'virginica') %>% 
    mutate(Len = ifelse(Sepal.Length > 6, 1, 0))
result = sum(ds$Len)
print(result) # 41
```

<br>

## 17. airquality

- Ozone의 결측값을 없애고 평균 값을 구한 값으로 대체하고, median 값에서 2 x IQR을 뺀 값과 median 값에서 2 x IQR을 더한 값 사이에 존재하는 Ozone값의 합계를 구하시오.

```R
data(airquality)
a_mean = mean(airquality$Ozone, na.rm = TRUE)

airquality$Ozone = ifelse(
    is.na(airquality$Ozone),
    a_mean,
    airquality$Ozone)

a_med = median(airquality$Ozone)
quantile(airquality$Ozone)
#        0%       25%       50%       75%      100%
#   1.00000  21.00000  42.12931  46.00000 168.00000 
a_under = a_med - 2*IQR(airquality$Ozone)
a_upper = a_med + 2*IQR(airquality$Ozone)

library(dplyr)
ds = airquality %>% 
    filter(Ozone < a_upper & Ozone > a_under)

result = sum(ds$Ozone)
print(result) # 5279.784
```

<br>

## 18. marvel

> 데이터 참고 : [https://www.kaggle.com/fivethirtyeight/fivethirtyeight-comic-characters-dataset?select=marvel-wikia-data.csv](https://www.kaggle.com/fivethirtyeight/fivethirtyeight-comic-characters-dataset?select=marvel-wikia-data.csv)

- Hair가 "Brown Hair"이고 Eye가 "Brown Eyes"인 데이터를 훈련 데이터로 추출했을 때, APPEARANCES에서 이상값을 제외한 평균을 구하시오. 

```R
ds = read.csv('sujebi_data/marvel-wikia-data.csv')
head(ds)
str(ds)
summary(ds)

library(dplyr)
ds1 = ds %>% 
    filter(HAIR == "Brown Hair" & EYE == "Brown Eyes")

iqr = IQR(ds1$APPEARANCES, na.rm = TRUE)
q1 = quantile(ds1$APPEARANCES, na.rm = TRUE)[2]
m_under = q1 - 1.5*iqr
m_upper = q1 + 1.5*iqr

ds2 = ds1 %>% 
    filter(APPEARANCES <= m_upper & APPEARANCES >= m_under)
result = mean(ds2$APPEARANCES, na.rm = TRUE)
print(result) # 7.773512
```

<br>

## 19. ChickWeight

- 시간(Time)이 10인 데이터를 훈련 데이터로 생성하고 무게(weight)가 상위 30번째 이상 값을 평균으로 변환한 후 변환하기 전, 후의 평균의 차이를 구하시오.

```R
library(MASS)
data(ChickWeight)
str(ChickWeight)
dim(ChickWeight)

library(dplyr)
ds = ChickWeight %>% 
    filter(Time == 10)

before_mean = mean(ds$weight) # 107.8367

ds1 = ds %>% 
    arrange(desc(weight))
head(ds1)

stand = ds1$weight[30]

ds1$weight = ifelse(ds1$weight >= stand, before_mean, ds1$weight)
after_mean = mean(ds1$weight)
result = abs(after_mean - before_mean)
print(result) # 9.120367
```


## 20. FIFA Ranking

- 총점수(total_points)가 상위 3위인 국가(country_abrv)를 선택하고 이 국가들 총점수(total_points)항목의 평균을 구하시오.

> 데이터 참고 : [https://www.kaggle.com/tadhgfitzgerald/fifa-international-soccer-mens-ranking-1993now](https://www.kaggle.com/tadhgfitzgerald/fifa-international-soccer-mens-ranking-1993now)

```R
fifa=read.csv("sujebi_data/fifa_ranking.csv")
str(fifa)
summary(fifa)
# country_abrv total_points
library(dplyr)

fifa_point = fifa %>% select(total_points) %>% 
    arrange(desc(total_points))
top3_point = fifa_point[3,]

fifa_country = fifa %>% 
    filter(fifa_point >= top3_point) %>% 
    select(country_abrv)
fifa_country = as.vector(fifa_country$country_abrv)  # GER ITA SUI

f_mean = fifa %>% 
    filter(country_abrv %in% fifa_country) %>% 
    summarise(mean = mean(total_points, na.rm = TRUE))
print(f_mean$mean) # 348.098
```


## 21. sales_train

- 가장 많이 판매된 상품(item_id) 3가지와 전체 상품에 대하여 상품 판매가(item_price) 표준편차 차이를 구하시오.

```R
sales=read.csv('sujebi_data/sales_train_v2.csv')

head(sales)
str(sales)
summary(sales)
dim(sales)

library(dplyr)
top3_item = sales %>% group_by(item_id) %>% 
    summarise(n = n()) %>% 
    arrange(desc(n)) %>% 
    head(3)
top3_item

top3_id = as.vector(top3_item$item_id)
top3_id

sum(is.na(sales$item_price))

total_sd = sd(sales$item_price)

top3_sd = sales %>% 
    filter(item_id %in% top3_id) %>% 
    summarise(sd = sd(item_price))
top3_sd = top3_sd$sd

print(abs(total_sd - top3_sd)) # 1101.796
```


## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264)
