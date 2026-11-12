---
layout: none
---

// Korean readers type tool names in Korean while the posts name them in English
// (and sometimes the other way round). Each side expands to the other so either
// spelling finds the same posts; the alias match scores below the literal one.
var SEARCH_ALIASES = {
  "판다스": "pandas",
  "판다": "pandas",
  "넘파이": "numpy",
  "텐서플로": "tensorflow",
  "텐서플로우": "tensorflow",
  "파이토치": "pytorch",
  "케라스": "keras",
  "사이킷런": "scikit-learn",
  "맷플롯립": "matplotlib",
  "주피터": "jupyter",
  "쿠버네티스": "kubernetes",
  "도커": "docker",
  "하둡": "hadoop",
  "스파크": "spark",
  "에어플로": "airflow",
  "카프카": "kafka",
  "레디스": "redis",
  "엘라스틱서치": "elasticsearch",
  "몽고디비": "mongodb",
  "포스트그레스": "postgresql",
  "마이에스큐엘": "mysql",
  "리눅스": "linux",
  "우분투": "ubuntu",
  "깃": "git",
  "깃허브": "github",
  "젠킨스": "jenkins",
  "테라폼": "terraform",
  "앤서블": "ansible",
  "람다": "lambda",
  "스칼라": "scala",
  "스프링": "spring",
  "스프링부트": "spring",
  "자바": "java"
};
var REVERSE_ALIASES = {};
for (var ko in SEARCH_ALIASES) {
  if (!REVERSE_ALIASES[SEARCH_ALIASES[ko]]) REVERSE_ALIASES[SEARCH_ALIASES[ko]] = ko;
}
function expandTerm(term) {
  var out = [term];
  if (SEARCH_ALIASES[term]) out.push(SEARCH_ALIASES[term]);
  if (REVERSE_ALIASES[term]) out.push(REVERSE_ALIASES[term]);
  return out;
}

var idx = lunr(function () {
  this.field('title')
  this.field('excerpt')
  this.field('categories')
  this.field('tags')
  this.ref('id')

  this.pipeline.remove(lunr.trimmer)

  for (var item in store) {
    this.add({
      title: store[item].title,
      excerpt: store[item].excerpt,
      categories: store[item].categories,
      tags: store[item].tags,
      id: item
    })
  }
});

$(document).ready(function() {
  // 'input' covers every way the value can change - IME composition (the Korean
  // case this site needs), paste, drag-and-drop and autofill - while 'keyup'
  // alone misses the syllable a Korean IME commits without a following key press.
  $('input#search').on('input compositionend', function () {
    var resultdiv = $('#results');
    var query = $(this).val().toLowerCase();
    var result =
      idx.query(function (q) {
        query.split(lunr.tokenizer.separator).forEach(function (term) {
          expandTerm(term).forEach(function (t, i) {
            var weight = i === 0 ? 1 : 0.6;   // literal term first, aliases ranked below it
            if (t === "") return;
            q.term(t, { boost: 100 * weight })
            if(query.lastIndexOf(" ") != query.length-1){
              q.term(t, {  usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING, boost: 10 * weight })
            }
            q.term(t, {  usePipeline: false, editDistance: 1, boost: 1 })
          });
        })
      });
    resultdiv.empty();
    resultdiv.prepend('<p class="results__found">'+result.length+' {{ site.data.ui-text[site.locale].results_found | default: "Result(s) found" }}</p>');
    for (var item in result) {
      var ref = result[item].ref;
      if(store[ref].teaser){
        var searchitem =
          '<div class="list__item">'+
            '<article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">'+
              '<h2 class="archive__item-title" itemprop="headline">'+
                '<a href="'+store[ref].url+'" rel="permalink">'+store[ref].title+'</a>'+
              '</h2>'+
              '<div class="archive__item-teaser">'+
                '<img src="'+store[ref].teaser+'" alt="">'+
              '</div>'+
              '<p class="archive__item-excerpt" itemprop="description">'+store[ref].excerpt.split(" ").splice(0,20).join(" ")+'...</p>'+
            '</article>'+
          '</div>';
      }
      else{
    	  var searchitem =
          '<div class="list__item">'+
            '<article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">'+
              '<h2 class="archive__item-title" itemprop="headline">'+
                '<a href="'+store[ref].url+'" rel="permalink">'+store[ref].title+'</a>'+
              '</h2>'+
              '<p class="archive__item-excerpt" itemprop="description">'+store[ref].excerpt.split(" ").splice(0,20).join(" ")+'...</p>'+
            '</article>'+
          '</div>';
      }
      resultdiv.append(searchitem);
    }
  });
});
