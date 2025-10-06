# PageSpeed Insights 성능 개선 가이드

## 📊 현재 성능 점수

### Mobile
- **Performance**: 56/100 ⚠️
- **Accessibility**: 91/100 ✅
- **Best Practices**: 100/100 ✅
- **SEO**: 100/100 ✅

### Desktop
- **Performance**: 74/100 ⚠️
- **Accessibility**: 87/100 ⚠️
- **Best Practices**: 100/100 ✅
- **SEO**: 100/100 ✅

### 핵심 Web Vitals (Mobile)
- **FCP (First Contentful Paint)**: 10.6s ❌ (목표: < 1.8s)
- **LCP (Largest Contentful Paint)**: 38.6s ❌ (목표: < 2.5s)
- **TBT (Total Blocking Time)**: 0ms ✅
- **CLS (Cumulative Layout Shift)**: 0 ✅
- **Speed Index**: 10.6s ❌

---

## 🎯 주요 개선 항목 (우선순위 순)

### 1. ⚡ Render Blocking Resources 제거 (가장 중요)
**예상 개선**: 1,200ms (Mobile) / 280ms (Desktop)

#### 문제
- CSS/JS 파일이 페이지 렌더링을 차단
- main.css, minimal-mistakes 관련 CSS 파일들

#### 해결방법

##### A. CSS 인라인화 (Critical CSS)
```html
<!-- _includes/head.html -->
<head>
  <!-- Critical CSS 인라인 삽입 -->
  <style>
    /* 초기 렌더링에 필요한 최소 CSS만 포함 */
    body { margin: 0; font-family: sans-serif; }
    .masthead { /* 헤더 최소 스타일 */ }
    /* ... 기타 above-the-fold 스타일 */
  </style>
  
  <!-- 나머지 CSS는 비동기 로딩 -->
  <link rel="preload" href="{{ '/assets/css/main.css' | relative_url }}" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="{{ '/assets/css/main.css' | relative_url }}"></noscript>
</head>
```

##### B. JavaScript defer/async 사용
```html
<!-- _includes/scripts.html -->
<!-- 기존 -->
<script src="{{ '/assets/js/main.min.js' | relative_url }}"></script>

<!-- 개선 -->
<script src="{{ '/assets/js/main.min.js' | relative_url }}" defer></script>
```

---

### 2. 🖼️ 이미지 최적화
**예상 개선**: 4,634 KiB

#### 문제
- 이미지가 최적화되지 않음
- 차세대 포맷(WebP) 미사용
- 적절한 크기 조정 없음

#### 해결방법

##### A. WebP 이미지 자동 생성 플러그인 추가
```ruby
# Gemfile
gem 'jekyll-webp'
```

```yaml
# _config.yml
plugins:
  - jekyll-webp

# WebP 설정
webp:
  enabled: true
  quality: 75
  img_dir: ["assets/images"]
  nested: true
```

##### B. 반응형 이미지 사용
```html
<!-- 기존 -->
<img src="/assets/images/large-image.jpg" alt="...">

<!-- 개선 -->
<picture>
  <source srcset="/assets/images/large-image.webp" type="image/webp">
  <source srcset="/assets/images/large-image.jpg" type="image/jpeg">
  <img src="/assets/images/large-image.jpg" alt="..." loading="lazy" width="800" height="600">
</picture>
```

##### C. 이미지 지연 로딩 (Lazy Loading)
```html
<img src="image.jpg" loading="lazy" alt="...">
```

---

### 3. 🗜️ 사용하지 않는 JavaScript/CSS 제거
**예상 개선**: 496 KiB (JS) + 49 KiB (CSS)

#### 문제
- 불필요한 JavaScript 라이브러리 포함
- 사용하지 않는 CSS 규칙 많음

#### 해결방법

##### A. PurgeCSS 사용 (사용하지 않는 CSS 제거)
```bash
npm install -g purgecss
```

```javascript
// purgecss.config.js
module.exports = {
  content: [
    './_site/**/*.html',
  ],
  css: [
    './assets/css/main.css'
  ],
  output: './assets/css/main.purged.css',
  safelist: ['active', 'show', 'fade'] // 동적으로 사용되는 클래스
}
```

##### B. 조건부 스크립트 로딩
```html
<!-- _includes/scripts.html -->
{% if page.comments %}
  <script src="comments.js" defer></script>
{% endif %}

{% if page.mathjax %}
  <script src="mathjax.js" defer></script>
{% endif %}
```

---

### 4. ⏱️ 캐시 정책 개선
**예상 개선**: 4,589 KiB

#### 문제
- 정적 리소스의 캐시 수명이 짧음

#### 해결방법

##### A. GitHub Pages 캐시 헤더 설정 (netlify.toml 또는 _headers)
```toml
# netlify.toml (만약 Netlify로 전환한다면)
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

##### B. 파일명에 해시 추가 (Cache Busting)
```yaml
# _config.yml
# Jekyll Assets 플러그인 사용
sass:
  style: compressed
  sourcemap: never

# 파일명에 해시 추가
jekyll-assets:
  digest: true
```

---

### 5. 🔤 웹폰트 최적화
**예상 개선**: 310ms (Mobile) / 30ms (Desktop)

#### 문제
- font-display 속성 미사용
- FOIT (Flash of Invisible Text) 발생

#### 해결방법

##### A. font-display 속성 추가
```css
/* _sass/minimal-mistakes/_variables.scss */
@font-face {
  font-family: 'Your Font';
  src: url('/assets/fonts/your-font.woff2') format('woff2');
  font-display: swap; /* 또는 optional */
  font-weight: normal;
  font-style: normal;
}
```

##### B. 구글 폰트 최적화
```html
<!-- 기존 -->
<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">

<!-- 개선 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
```

---

### 6. 📦 DOM 크기 최적화

#### 문제
- DOM 노드가 너무 많음 (성능 저하)

#### 해결방법

##### A. 페이지네이션 개선
```yaml
# _config.yml
paginate: 10  # 기존 20 → 10으로 감소
paginate_path: "/page:num/"
```

##### B. 불필요한 HTML 제거
```html
<!-- _layouts/single.html -->
<!-- 사용하지 않는 섹션 조건부 렌더링 -->
{% if page.show_sidebar %}
  {% include sidebar.html %}
{% endif %}
```

---

### 7. 🌐 Third-Party 스크립트 최적화

#### 문제
- Google Analytics, Disqus 등 외부 스크립트가 성능 저하

#### 해결방법

##### A. Google Analytics 지연 로딩
```html
<!-- _includes/analytics.html -->
<script>
  // 페이지 로드 후 GA 로딩
  window.addEventListener('load', function() {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID';
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'YOUR-GA-ID');
  });
</script>
```

##### B. Disqus 지연 로딩
```html
<!-- _includes/comments.html -->
<div id="disqus_thread"></div>
<button id="load-comments" onclick="loadDisqus()">Load Comments</button>

<script>
function loadDisqus() {
  var disqus_config = function () {
    this.page.url = '{{ page.url | absolute_url }}';
    this.page.identifier = '{{ page.id }}';
  };
  
  (function() {
    var d = document, s = d.createElement('script');
    s.src = 'https://YOUR-DISQUS.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
  })();
  
  document.getElementById('load-comments').style.display = 'none';
}
</script>
```

---

## 🚀 즉시 적용 가능한 빠른 개선

### 1. _config.yml 수정
```yaml
# _config.yml

# Sass 압축
sass:
  style: compressed
  sourcemap: never

# HTML 압축
compress_html:
  clippings: all
  comments: all
  endings: all
  startings: []
  blanklines: false
  profile: false

# 이미지 최적화 플러그인
plugins:
  - jekyll-seo-tag
  - jekyll-sitemap
  - jekyll-feed
```

### 2. _includes/head.html 수정
```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <!-- DNS Prefetch -->
  <link rel="dns-prefetch" href="//fonts.googleapis.com">
  <link rel="dns-prefetch" href="//www.google-analytics.com">
  
  <!-- Preconnect -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Critical CSS 인라인 -->
  <style>
    /* 최소 Critical CSS */
  </style>
  
  <!-- CSS 비동기 로딩 -->
  <link rel="preload" href="{{ '/assets/css/main.css' | relative_url }}" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="{{ '/assets/css/main.css' | relative_url }}"></noscript>
</head>
```

### 3. 이미지에 loading="lazy" 추가
```markdown
<!-- 블로그 포스트 내 이미지 -->
![Alt text](image.jpg){: loading="lazy"}
```

---

## 📈 예상 개선 효과

| 항목 | 현재 | 개선 후 (예상) |
|------|------|----------------|
| **Mobile Performance** | 56 | 85+ |
| **Desktop Performance** | 74 | 95+ |
| **FCP (Mobile)** | 10.6s | < 2s |
| **LCP (Mobile)** | 38.6s | < 3s |
| **Total Size** | 6,910 KiB | < 3,000 KiB |

---

## ✅ 우선순위 체크리스트

### 1주차 (즉시 개선)
- [ ] JavaScript defer 속성 추가
- [ ] 이미지에 loading="lazy" 추가
- [ ] font-display: swap 추가
- [ ] CSS/JS 압축 활성화

### 2주차 (중요 개선)
- [ ] Critical CSS 추출 및 인라인화
- [ ] 사용하지 않는 CSS 제거 (PurgeCSS)
- [ ] 이미지 WebP 변환
- [ ] Third-party 스크립트 지연 로딩

### 3주차 (고급 최적화)
- [ ] CDN 도입 고려
- [ ] 서비스 워커 캐싱
- [ ] HTTP/2 최적화
- [ ] 코드 스플리팅

---

## 🛠️ 추천 도구

1. **이미지 최적화**: [Squoosh](https://squoosh.app/), [ImageOptim](https://imageoptim.com/)
2. **Critical CSS 추출**: [Critical](https://github.com/addyosmani/critical)
3. **CSS 제거**: [PurgeCSS](https://purgecss.com/)
4. **성능 모니터링**: [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

## 📚 참고 자료

- [Web.dev - Fast load times](https://web.dev/fast/)
- [Jekyll Performance Guide](https://jekyllrb.com/docs/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
