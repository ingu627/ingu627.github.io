---
title: "전체 글 목록 (Archive)"
excerpt: "ingu627.github.io에 발행된 모든 기술 글을 연도별로 정리한 아카이브입니다."
layout: single
permalink: /archive/
sidebar_main: true
toc: false
---

발행된 모든 글을 연도별로 모아 둡니다. 카테고리별로 보고 싶다면 [카테고리 전체 보기](/categories/)를 이용하세요.

{% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
{% for year in posts_by_year %}
<h2 id="year-{{ year.name }}">{{ year.name }}년 <small>({{ year.items | size }}편)</small></h2>
<ul>
{% for post in year.items %}
  <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a> <span style="color:#6b7280;font-size:0.85em;">{{ post.date | date: "%m-%d" }}</span></li>
{% endfor %}
</ul>
{% endfor %}
