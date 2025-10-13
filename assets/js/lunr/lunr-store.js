---
layout: none
---

{%- assign docs = site.posts | where_exp:'post','post.search != false' -%}
{%- for coll in site.collections -%}
  {%- unless coll.label == 'posts' -%}
    {%- assign filtered = coll.docs | where_exp:'doc','doc.search != false' -%}
    {%- assign docs = docs | concat: filtered -%}
  {%- endunless -%}
{%- endfor -%}
{%- assign docs = docs | group_by: 'url' -%}
var store = [
  {%- for group in docs -%}
    {%- assign doc = group.items[0] -%}
    {
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
          strip_html | strip_newlines | truncatewords: 30 | jsonify }},
        {%- endif -%}
      "categories": {{ doc.categories | jsonify }},
      "tags": {{ doc.tags | jsonify }},
      "url": {{ doc.url | relative_url | jsonify }}
    }{%- unless forloop.last -%},{%- endunless -%}
  {%- endfor -%}
]
