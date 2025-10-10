---
layout: none
---

var store = [
  {%- for post in site.posts -%}
    {%- if post.search != false -%}
      {%- assign teaser = nil -%}
      {%- if post.header.teaser -%}
        {%- capture teaser -%}{{ post.header.teaser }}{%- endcapture -%}
      {%- elsif post.header.image -%}
        {%- capture teaser -%}{{ post.header.image }}{%- endcapture -%}
      {%- elsif post.image -%}
        {%- capture teaser -%}{{ post.image }}{%- endcapture -%}
      {%- else -%}
        {%- assign content_html = post.content | markdownify -%}
        {%- assign src_chunks = content_html | split: 'src="' -%}
        {%- if src_chunks.size > 1 -%}
          {%- assign teaser_candidate = src_chunks[1] | split: '"' | first -%}
          {%- capture teaser -%}{{ teaser_candidate }}{%- endcapture -%}
        {%- endif -%}
      {%- endif -%}
      {%- unless teaser -%}
        {%- capture teaser -%}{{ site.teaser }}{%- endcapture -%}
      {%- endunless -%}
      {%- assign teaser = teaser | strip -%}
      {%- assign teaser_url = teaser -%}
      {%- unless teaser contains '://' -%}
        {%- assign teaser_url = teaser | relative_url -%}
      {%- endunless -%}
      {
        "title": {{ post.title | jsonify }},
        "excerpt":
          {%- if site.search_full_content == true -%}
            {{ post.content | newline_to_br |
              replace:"<br />", " " |
              replace:"</p>", " " |
              replace:"</h1>", " " |
              replace:"</h2>", " " |
              replace:"</h3>", " " |
              replace:"</h4>", " " |
              replace:"</h5>", " " |
              replace:"</h6>", " "|
            strip_html | strip_newlines | jsonify }},
          {%- else -%}
            {{ post.content | newline_to_br |
              replace:"<br />", " " |
              replace:"</p>", " " |
              replace:"</h1>", " " |
              replace:"</h2>", " " |
              replace:"</h3>", " " |
              replace:"</h4>", " " |
              replace:"</h5>", " " |
              replace:"</h6>", " "|
            strip_html | strip_newlines | truncatewords: 50 | jsonify }},
          {%- endif -%}
        "categories": {{ post.categories | jsonify }},
  "tags": {{ post.tags | jsonify }},
  "url": {{ post.url | relative_url | jsonify }},
  "teaser": {{ teaser_url | jsonify }}
      }{%- unless forloop.last -%},{%- endunless -%}
    {%- endif -%}
  {%- endfor -%}
  {%- for c in site.collections -%}
    {%- if forloop.last -%}
      {%- assign l = true -%}
    {%- endif -%}
    {%- assign docs = c.docs | where_exp:'doc','doc.search != false' -%}
    {%- for doc in docs -%}
      {%- assign teaser = nil -%}
      {%- if doc.header.teaser -%}
        {%- capture teaser -%}{{ doc.header.teaser }}{%- endcapture -%}
      {%- elsif doc.header.image -%}
        {%- capture teaser -%}{{ doc.header.image }}{%- endcapture -%}
      {%- elsif doc.image -%}
        {%- capture teaser -%}{{ doc.image }}{%- endcapture -%}
      {%- else -%}
        {%- assign content_html = doc.content | markdownify -%}
        {%- assign src_chunks = content_html | split: 'src="' -%}
        {%- if src_chunks.size > 1 -%}
          {%- assign teaser_candidate = src_chunks[1] | split: '"' | first -%}
          {%- capture teaser -%}{{ teaser_candidate }}{%- endcapture -%}
        {%- endif -%}
      {%- endif -%}
      {%- unless teaser -%}
        {%- capture teaser -%}{{ site.teaser }}{%- endcapture -%}
      {%- endunless -%}
      {%- assign teaser = teaser | strip -%}
      {%- assign teaser_url = teaser -%}
      {%- unless teaser contains '://' -%}
        {%- assign teaser_url = teaser | relative_url -%}
      {%- endunless -%}
      ,{
        "title": {{ doc.title | jsonify }},
        "excerpt":
          {%- if site.search_full_content == true -%}
            {{ doc.content | newline_to_br |
              replace:"<br />", " " |
              replace:"</p>", " " |
              replace:"</h1>", " " |
              replace:"</h2>", " " |
              replace:"</h3>", " " |
              replace:"</h4>", " " |
              replace:"</h5>", " " |
              replace:"</h6>", " "|
            strip_html | strip_newlines | jsonify }},
          {%- else -%}
            {{ doc.content | newline_to_br |
              replace:"<br />", " " |
              replace:"</p>", " " |
              replace:"</h1>", " " |
              replace:"</h2>", " " |
              replace:"</h3>", " " |
              replace:"</h4>", " " |
              replace:"</h5>", " " |
              replace:"</h6>", " "|
            strip_html | strip_newlines | truncatewords: 50 | jsonify }},
          {%- endif -%}
        "categories": {{ doc.categories | jsonify }},
  "tags": {{ doc.tags | jsonify }},
  "url": {{ doc.url | relative_url | jsonify }},
  "teaser": {{ teaser_url | jsonify }}
      }{%- unless forloop.last and l -%},{%- endunless -%}
    {%- endfor -%}
  {%- endfor -%}]
