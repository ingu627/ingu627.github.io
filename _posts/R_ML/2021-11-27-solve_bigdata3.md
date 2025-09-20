---
layout: single
title: "빅데이터분석기사(R) - 제1유형 11문제 풀이 (2)"
excerpt: "2021년 제 3회 빅데이터분석기사 실기를 위한 문제풀이 내용입니다. - 11~21번"
categories: R_ML
tags : [R, 빅데이터 분석기사, 실기, 작업형, 필답형, 자격증, dataq, 정리, pdf, 기출문제, 정리본, 후기, 설명, 2회, 3회]
toc: true
sidebar_main: false
classes: wide

last_modified_at: 2022-03-31
---

빅데이터 분석기사 실기 대비 차원에서 쓴 글입니다. <br> 기출문제의 데이터는 [https://github.com/ingu627/BigDataAnalysis](https://github.com/ingu627/BigDataAnalysis)에 데이터 셋을 남겨놨습니다.<br> 또한 해당 전체 코드는 `sujebi_2.R` 파일에 담겨져 있습니다.
{: .notice--info}

2021.12.31 : 제 3회 빅데이터 분석기사 실기를 합격했습니다. <br> [빅데이터 분석기사(R)](https://ingu627.github.io/categories/R_ML) 시리즈를 보시고 도움이 되길 바랍니다.
{: .notice--danger}

혹시 해당 글을 pdf로 받고 싶으신 분은 이메일과 함께 댓글로 남겨주세요~
{: .notice--success}


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

<br>
<br>

## 12. iris

- Sepal.Length의 mean값과 Sepal.Width의 mean 값의 합계를 구하시오.

```R
data(iris)
result = mean(iris$Sepal.Length, na.rm = TRUE) + mean(iris$Sepal.Width, na.rm = TRUE)
print(result) # 8.900667
```

<br>
<br>

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

<br>
<br>

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

<br>
<br>

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

<br>
<br>

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

<br>
<br>

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

<br>
<br>

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

<br>
<br>


## References

- [2022 수제비 빅데이터분석기사 실기 (필답형+작업형)](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=281447264)