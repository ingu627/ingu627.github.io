---
layout: single
title: "MLOps: 통계적 한계/경계 부등식 - Hoeffding·Markov·Chebyshev·Bernstein 활용"
excerpt: "Concept Drift Detection에 대한 기법들을 공부하면서 자연스레 나온 부등식들을 정리해보았습니다."
categories: mlops
tags: [hoeffding, markov, chebyshev, bernstein, 호에프딩, 마코브, 체비쇼프, 번스타인, 통계, 확률, 부등식, inequality, 머신러닝, machine learning, 기계 학습,]
toc: true
toc_sticky: true
sidebar_main: false

last_modified_at: 2022-06-06
---

Concept Drift Detection에 대한 기법들을 공부하면서 자연스레 나온 부등식들을 정리해보았습니다. <br> 대부분의 기계 학습 문제에서 일부 샘플 훈련 세트가 제공되고 전체 모집단에 적용되는 일반 모델을 도출합니다. <br><br>마르코브 부등식 (Markov’s inequality)<br>체비쇼프 부등식 (Chebyshev’s inequality)<br>호에프딩 부등식 (Hoeffding’s inequality)<br>번스타인 부등식 (Bernstein’s inequality)
{: .notice--info}

<br>
<br>
<br>

## Markov's inequality

- $X$가 음수가 아닌 랜덤 변수일때(즉, 0 또는 양수의 값), 아래의 식이 성립된다.
  - $P(X\ge a)\le \frac{E(X)}{a}$
  - where, $a>0$

<br>

- **Pros**
  - 확률분포의 가정없이도 확률변수의 기댓값만으로 대략적인 확률을 추정할 수 있다. [^2]

<br>
<br>

## Chebyshev's inequality

- $X$가 랜덤 변수일 때,
- $P(\vert X-\mu \vert \ge a) \le \frac{Var(X)}{a^2}$

<br>

- **Proof**
  - 마르코프 부등식에서 $X$의 값에 $\vert X-\mu \vert$을 대입한다.
  - $P(\vert X-\mu \vert \ge a) \le \frac{E(\vert X-\mu \vert)}{a}$
  - 좌변, 우변에 제곱을 곱하면
  -  $P(\vert X-\mu \vert \ge a)=$ $P((X-\mu)^2 \ge a^2) \le \frac{E((X-\mu)^2)}{a^2}$ = $\frac{Var(X)}{a^2}$
- 위 증명 과정 중 $a$값을 $k^2\sigma^2$로 변형하면
  - $P(\vert X-\mu\vert \ge k\sigma)=$ $P((X-\mu)^2 \ge k^2\sigma^2)\le \frac{Var(X)}{k^2\sigma^2}=$ $\frac{\sigma^2}{k^2\sigma^2}=$ $\frac{1}{k^2}$

<br>

  - 이를 깔끔하게 정리하면,
  - $P(\vert X-\mu\vert \ge k\sigma)\le \frac{1}{k^2}$ 또는 
  - $P(\vert X-\mu\vert \le k\sigma)\ge 1- \frac{1}{k^2}$ 
    - k값에 따라 평균에서 $\sigma$만큼 떨어진 구간에 자료가 위치할 확률을 구할 수 있다. [^2]

<br>

- **Pros**
  - 분산도 알고 있을 때 사용. 즉, 정보가 더 많기 때문에 tight한 bound를 제공한다. [^1]
- **Cons**
  - 대칭 분포라고 가정하기 때문에, 실제 적용에서는 제약적이다.

<br>
<br>

## Hoeffding's inequality

- 양수 n(n>0)에 대하여 동일한 분포를 갖는 독립확률 변수 (i.i.d) $X_1,X_2,...,X_n$가 있고, $\mu = E(X)$, 그리고 $X\in [a, b]$ (a<b로 주어짐)에 수렴한다면, 다음의 식을 성립한다.
  - $P(\vert \bar X_n - \mu \vert \ge \epsilon)\le$ $2e^{-\frac{2n\epsilon^2}{(b-a)^2}}$
    - where, $\epsilon > 0$
  - $\vert \bar X_n - \mu \vert$의 오류는 작을 수록 좋다.
  - $\epsilon$ = 허용 오차 값
  - 즉, 오류가 이보다 작으면 추정한 것이 좋고, 이보다 크면 추정한 것이 나쁘다.
  - 즉, $P(\vert \bar X_n - \mu \vert \ge \epsilon)$는 잘못된 추정을 할 확률이다. [^3]
- hoeffding은 샘플 사이즈 크기 n에 관계없이 작동한다.
- 하지만, $n$과 $\epsilon$은 trade-off 관계이다.
  - 따라서, n에 영향을 줄이기에 너무 작거나 크지 않거나 충분히 허용되지 않아야 하는 적절한 $\epsilon$을 선택해야 한다. [^3]

<br>

- $X_i \sim^{iid} Ber(p)$ 이면, 다음 식이 성립된다.
- $P(\vert \bar X_n - \mu \vert \ge \frac{c}{\sqrt{n}})\le$ $2e^{-{2nc^2}}$

<br>

- **Pros**
  - hoeffding's inequality는 chebyshev inquality보다 더 tight한 bound를 제공한다.
- **Cons**
  - 분산이 작은 분포에 대한 큰 편차 확률을 과대평가하여 너무 보수적(conservative)이다. [^4] 


<br>
<br>

## Bernstein's inequality

- $X_1,...,X_n$이 독립적인 랜덤 변수이고, $\mu$는 기댓값, $X_i\in [a,b]$에 수렴할 때, 번슈타인 부등식은 다음과 같다.
  - $P(\vert \bar X_i-\mu \vert > \epsilon)$ $\le 2e^{(\frac{-n\epsilon^2}{2\sigma^2+\frac{2}{3}\epsilon (b-a)})}$

<br>

- **Cons**
  - 분산 파라미터 값이 필요하다는 점에서 보수적(conservative)라 할 수 있다. 이는 detection delay가 길어지고 정확도가 떨어질 수 있다.



<br>
<br>
<br>
<br>

## References

[^1]: [Markov / Chebyshev / Hoeffding Inequality](https://ricoshin.tistory.com/6)
[^2]: [[기초통계학] 체비셰프 부등식(Chebyshev Inequality) - 간토끼 DataMining Lab](https://datalabbit.tistory.com/26)
[^3]: [How do Machines Learn : Hoeffding’s Inequality, in sample and out of sample using Game of Throne Analogy](https://nulpointerexception.com/2018/01/21/how-do-machines-learn-hoeffdings-inequality-in-sample-and-out-of-sample-using-game-of-throne-analogy/)
[^4]: [Sakthithasan, Sripirakas, Russel Pears, and Yun Sing Koh. "One pass concept change detection for data streams." Pacific-Asia conference on knowledge discovery and data mining. Springer, Berlin, Heidelberg, 2013.](https://link.springer.com/chapter/10.1007/978-3-642-37456-2_39)
