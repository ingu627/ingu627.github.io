---
title: "쿠버네티스(Kubernetes)"
layout: archive
permalink: categories/k8s
author_profile: true
sidebar_main: true
---


{% assign posts = site.categories.k8s %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}