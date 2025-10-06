# PageSpeed 최적화 적용 완료 ✅

## 적용된 개선 사항

### 1. ⚡ Render Blocking 개선
- **head.html**: CSS 비동기 로딩 (`preload` + `onload`)
- **head.html**: DNS prefetch 및 preconnect 추가
- **scripts.html**: JavaScript에 `defer` 속성 추가

### 2. 🔤 웹폰트 최적화
- **customImport.scss**: `font-display: swap` 추가
- FOIT(Flash of Invisible Text) 방지

### 3. 🗜️ 압축 최적화
- **_config.yml**: Sass sourcemap 비활성화
- **_config.yml**: HTML 압축 최적화 (comments, endings, startings, blanklines 제거)

---

## 📋 다음 단계 (수동 작업 필요)

### 1. 이미지 최적화 (중요도: ⭐⭐⭐)

#### A. WebP 변환
```bash
# ImageMagick 설치 (macOS)
brew install imagemagick

# 이미지 일괄 변환
cd /Users/hyunseokjung/ingu627.github.io/assets/images
for file in *.jpg *.png; do
  convert "$file" -quality 80 "${file%.*}.webp"
done
```

#### B. Markdown 파일에 lazy loading 추가
기존:
```markdown
![Alt text](image.jpg)
```

개선:
```markdown
![Alt text](image.jpg){: loading="lazy"}
```

또는 HTML:
```html
<img src="image.jpg" alt="..." loading="lazy" width="800" height="600">
```

### 2. Google Analytics 지연 로딩 (중요도: ⭐⭐)

`_includes/analytics.html` 수정:
```html
<script>
window.addEventListener('load', function() {
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id={{ site.analytics.google.tracking_id }}';
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '{{ site.analytics.google.tracking_id }}');
});
</script>
```

### 3. 댓글 시스템 지연 로딩 (중요도: ⭐⭐)

Utterances는 이미 lazy loading이 되어 있지만, 버튼 클릭으로 로딩하려면:

`_includes/comments-providers/utterances.html`:
```html
<div id="utterances-container"></div>
<button id="load-comments" onclick="loadUtterances()">댓글 불러오기</button>

<script>
function loadUtterances() {
  var script = document.createElement('script');
  script.src = "https://utteranc.es/client.js";
  script.setAttribute("repo", "{{ site.repository }}");
  script.setAttribute("issue-term", "{{ site.comments.utterances.issue_term | default: 'pathname' }}");
  script.setAttribute("theme", "{{ site.comments.utterances.theme | default: 'github-light' }}");
  script.setAttribute("crossorigin", "anonymous");
  script.setAttribute("async", true);
  document.getElementById('utterances-container').appendChild(script);
  document.getElementById('load-comments').style.display = 'none';
}
</script>
```

### 4. 이미지 크기 명시 (CLS 개선, 중요도: ⭐)

모든 이미지에 width/height 속성 추가:
```html
<img src="image.jpg" alt="..." width="800" height="600" loading="lazy">
```

### 5. Critical CSS 추출 (고급, 중요도: ⭐)

```bash
# Critical CSS 도구 설치
npm install -g critical

# Critical CSS 추출
critical https://ingu627.github.io/ --base _site --inline > _includes/critical.css
```

그 후 `_includes/head.html`에 인라인:
```html
<style>
  {% include critical.css %}
</style>
```

---

## 🧪 테스트 방법

### 로컬 테스트
```bash
cd /Users/hyunseokjung/ingu627.github.io
bundle exec jekyll serve
```

브라우저에서 `http://localhost:4000` 접속 후:
1. 개발자 도구 → Network 탭 → 리소스 로딩 순서 확인
2. Lighthouse 탭 → 성능 측정

### 배포 후 테스트
```bash
git add .
git commit -m "feat: PageSpeed 최적화 - CSS/JS defer, font-display, compression"
git push origin main
```

5-10분 후 [PageSpeed Insights](https://pagespeed.web.dev/) 재측정

---

## 📊 예상 개선 효과

| 메트릭 | 현재 (Mobile) | 예상 개선 | 목표 |
|--------|---------------|-----------|------|
| **Performance** | 56 | 75-80 | 90+ |
| **FCP** | 10.6s | 3-4s | < 1.8s |
| **LCP** | 38.6s | 8-10s | < 2.5s |
| **TBT** | 0ms | 0ms | ✅ |
| **CLS** | 0 | 0 | ✅ |

추가 최적화 (이미지 WebP + lazy loading) 적용 시:
- Performance: **85-90** 예상
- LCP: **3-5s** 예상

---

## 📝 체크리스트

### 즉시 적용됨 ✅
- [x] CSS 비동기 로딩
- [x] JavaScript defer
- [x] font-display: swap
- [x] HTML/CSS 압축
- [x] DNS prefetch/preconnect

### 수동 작업 필요 ⏳
- [ ] 이미지 WebP 변환
- [ ] 이미지 lazy loading 추가
- [ ] Google Analytics 지연 로딩
- [ ] 이미지 width/height 명시
- [ ] Critical CSS 추출 (선택사항)

---

## 🔗 참고 자료

- [Web.dev - Fast load times](https://web.dev/fast/)
- [Jekyll Performance](https://jekyllrb.com/docs/performance/)
- [Minimal Mistakes 문서](https://mmistakes.github.io/minimal-mistakes/)
