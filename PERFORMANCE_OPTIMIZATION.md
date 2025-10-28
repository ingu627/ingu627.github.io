# PageSpeed 성능 개선 방안

## 🎯 현재 문제점

### 모바일
- **Performance: 20점** (매우 나쁨)
- LCP: 16.7초 (목표: 2.5초 이하)
- TBT: 3,720ms
- CLS: 0.29

### 데스크톱
- **Performance: 41점** (나쁨)
- LCP: 5.7초
- TBT: 4,050ms
- CLS: 0.135

## ✅ 적용한 최적화

### 1. CSS 로딩 최적화
- ✅ `preload`를 `media="print"` + `onload` 방식으로 변경
- ✅ Font Awesome async 로딩
- ✅ Dark theme CSS 조건부 로딩

### 2. 광고 스크립트 지연 로딩
- ✅ Google Adsense 스크립트를 사용자 인터랙션 후 로딩
- ✅ 3초 딜레이 또는 사용자 액션 트리거 방식

### 3. 이미지 최적화
- ✅ `loading="lazy"` 속성 추가 (archive 썸네일)
- ✅ Hero 이미지에 `fetchpriority="high"` 설정
- ✅ `decoding="async"` 추가

### 4. DNS Prefetch 개선
- ✅ Google Ads 도메인 추가
- ✅ 주요 외부 리소스 preconnect

### 5. Favicon 최적화
- ✅ 불필요한 apple-touch-icon 크기 제거 (중복 제거)

### 6. Performance SCSS 추가
- ✅ CLS 방지 CSS 규칙
- ✅ 폰트 렌더링 최적화

## 📋 추가로 필요한 작업

### 즉시 적용 가능
1. **이미지 최적화**
   ```bash
   # WebP 포맷으로 변환
   find assets/images -name "*.jpg" -o -name "*.png" | while read img; do
     cwebp -q 80 "$img" -o "${img%.*}.webp"
   done
   ```

2. **캐시 설정 (_headers 파일 생성)**
   ```
   /assets/*
     Cache-Control: public, max-age=31536000, immutable
   
   /*.css
     Cache-Control: public, max-age=31536000, immutable
   
   /*.js
     Cache-Control: public, max-age=31536000, immutable
   ```

3. **불필요한 JavaScript 제거**
   - `banner.js` 파일 확인 및 최적화
   - 사용하지 않는 jQuery 플러그인 제거

### 중장기 개선
1. **CDN 사용**
   - Cloudflare Pages로 마이그레이션 고려
   - 또는 GitHub Pages + Cloudflare CDN 조합

2. **Critical CSS 인라인화**
   ```html
   <style>
   /* Above-the-fold critical CSS */
   body{margin:0;font-family:...}
   </style>
   ```

3. **코드 스플리팅**
   - 페이지별로 필요한 JS만 로드
   - Intersection Observer로 컴포넌트 lazy load

4. **서비스 워커 추가**
   ```javascript
   // sw.js - 오프라인 캐싱
   self.addEventListener('fetch', event => {
     event.respondWith(
       caches.match(event.request)
         .then(response => response || fetch(event.request))
     );
   });
   ```

## 🔍 성능 측정

변경 후 다시 측정:
```bash
# Lighthouse CLI
npm install -g lighthouse
lighthouse https://ingu627.github.io --view

# 또는 PageSpeed Insights
https://pagespeed.web.dev/analysis/https-ingu627-github-io/
```

## 📊 예상 개선 효과

| 지표 | 현재 (모바일) | 예상 개선 | 목표 |
|------|---------------|-----------|------|
| LCP  | 16.7s         | ~8s       | <2.5s |
| TBT  | 3,720ms       | ~1,500ms  | <200ms |
| CLS  | 0.29          | ~0.15     | <0.1 |
| Score| 20            | ~40-50    | >90 |

## 🚀 배포 후 체크리스트

- [ ] `bundle exec jekyll build` 로컬 빌드 확인
- [ ] Git commit & push
- [ ] GitHub Actions 빌드 성공 확인
- [ ] PageSpeed Insights 재측정
- [ ] Search Console Core Web Vitals 모니터링 (28일 후)
- [ ] 실제 사용자 데이터 확인

## 💡 추가 팁

1. **이미지 크기 제한**
   - 최대 너비 1200px로 리사이즈
   - 품질 80-85%로 압축

2. **폰트 최적화**
   - Google Fonts 대신 시스템 폰트 사용 고려
   - 또는 font-display: swap 적용

3. **Third-party 스크립트 감사**
   - Google Analytics 대신 가벼운 대안 (Plausible, Fathom)
   - 광고 스크립트 최소화

## 📚 참고 자료

- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse Scoring Guide](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)
- [Core Web Vitals](https://web.dev/vitals/)
