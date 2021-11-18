---
title: "책들 정리(요약)"
layout: archive
permalink: book
author_profile: true
sidebar:
    nav: "docs"
---

{% assign posts = site.categories.jekyll %}
{% for post in posts %}
  {% include custom-archive-single.html type=entries_layout %}
{% endfor %}