---
layout: post
title:  "Ice Bear Jekyll Theme"
date:   2016-10-03 15:52:30 +0800
categories: [Tech]
excerpt: This is my first jekyll theme and this article describes how to use it.
tags:
  - EN
  - jekyll
  - front-end
---
This is my first jekyll theme decorated by my favorite items -- blue and ice bear. It's welcomed to give me a star at github if you like it.

<iframe src="https://ghbtns.com/github-btn.html?user=songkong&repo=Blog&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe>

# Installation
---

* Fork the repository. <iframe src="https://ghbtns.com/github-btn.html?user=songkong&repo=Blog&type=fork&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe>
* Edit `_config.yml` file.
* Add your own `projects` in `_includes/projects.html`.
* Change `domain name` in `CNAME`.
* Replace `favicon.ico` with your website icon.
* Change `avatar.jpg` and `cartoon-avatar.jpg` in `assets/images`.
* Edit `LICENSE.md` and `README.md`.

> I use two categories for posts in my blog, `Tech` and `Life`. If you want to add other categories, remember to modify `_includes/post-list-pagination`, `_layouts/post-list.html` and `assets/js/script.js` to add `Tabs` and `Paginations` for every category posts. 

# Style test
---

_italic_. **bold**. ***italic and bold***. ~~delete line~~. [link](http://kongsong.me).

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

>### Heading 3 in Blockquotes
>Normal Blockquotes text.
>
>* Unordered List in Blockquotes.
>
>1. Ordered List in Blockquotes.

* Unordered List.
	* Unordered List.

1. Ordered List
	1. Ordered List
	2. Ordered List
2. Ordered List
	
{% highlight ruby %}
// Ruby codes

require 'parallel'

Parallel.map(lots_of_data) do |chunk|
  heavy_computation(chunk)
end
{% endhighlight %}

table | table | table | table | table
----|------|---- | ---- | ---- 
This is table | This is table | This is table | This is table | This is table
This is table | This is table | This is table | This is table | This is table

