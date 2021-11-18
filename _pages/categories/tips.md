---
title: "기타 팁들(설치, 방법,...)"
layout: archive
permalink: tips
author_profile: true
sidebar:
    nav: "docs"
---

{% assign posts = site.categories.jekyll %}
{% for post in posts %}
  {% include custom-archive-single.html type=entries_layout %}
{% endfor %}