# _config.yml 개선 사항 적용 완료

적용 일시: 2025-10-07

## ✅ 적용된 변경 사항

### 1. SEO 인증 코드 추가 (🔴 필수)
```yaml
# 기존: 비어있음
# 변경 후:
google_site_verification : "google892bd13e769859f8"
naver_site_verification  : "naver2f1ddca95d82110afdce071ed9dedab3"
```
- Google Search Console 인증 코드 적용 (google892bd13e769859f8.html에서 추출)
- Naver Search Advisor 인증 코드 적용 (naver 파일에서 추출)

### 2. Open Graph 이미지 설정 (🔴 필수)
```yaml
# 기존: og_image : 
# 변경 후:
og_image : "/assets/images/cr_ai_gpt_image_1.webp"
```
- 소셜 미디어 공유 시 표시될 기본 이미지 설정
- 기존 avatar 이미지 활용

### 3. Social Profile Links 추가 (🔴 필수)
```yaml
# 기존: 비어있음
# 변경 후:
social:
  type: "Person"
  name: "ingu627"
  links:
    - "https://github.com/ingu627"
    - "https://www.linkedin.com/in/ingu627"
    - "https://hub.docker.com/u/ingu627"
    - "mailto:ingu627@gmail.com"
```
- 구조화된 데이터(Schema.org) 추가로 SEO 개선
- Google이 소셜 프로필 연결 가능

### 4. 사이트 검색 기능 활성화 (🟡 권장)
```yaml
# 기존: search : # false
# 변경 후:
search                : true
search_full_content   : true
search_provider       : lunr
```
- 사이트 내 검색 기능 활성화
- 전체 콘텐츠 검색 가능

### 5. Teaser 기본 이미지 설정 (🟡 권장)
```yaml
# 기존: teaser : 
# 변경 후:
teaser : "/assets/images/abstract_gpt_image_1.webp"
```
- 포스트 썸네일 기본 이미지 설정
- 개별 포스트에 이미지 없을 때 사용

### 6. Atom Feed 경로 명시 (🟡 권장)
```yaml
# 기존: atom_feed.path : 
# 변경 후:
atom_feed:
  path: "/feed.xml"
  hide: false
```
- RSS 피드 경로 명시적 설정

### 7. Utterances 다크모드 지원 (🟡 권장)
```yaml
# 기존: theme: "github-light"
# 변경 후:
utterances:
  theme: "preferred-color-scheme"
  issue_term: "pathname"
  repo: "ingu627/ingu627.github.io"
```
- 시스템 다크/라이트 모드에 따라 자동 전환
- repo 명시적 설정

### 8. jekyll-seo-tag 플러그인 추가 (🟡 권장)
```yaml
plugins:
  - jekyll-paginate
  - jekyll-sitemap
  - jekyll-gist
  - jekyll-feed
  - jekyll-include-cache
  - jekyll-seo-tag  # 🆕 추가
```
- SEO 메타태그 자동 생성
- Gemfile에도 추가됨

### 9. Defaults 설정 확장 (🟢 개선)
```yaml
# _pages, _portfolio, _algorithms에 대한 기본값 추가
defaults:
  - scope:
      path: "_pages"
      type: pages
    values:
      layout: single
      author_profile: true
  
  - scope:
      path: "_portfolio"
      type: portfolio
    values:
      layout: single
      author_profile: false
      share: true
  
  - scope:
      path: "_algorithms"
      type: algorithms
    values:
      layout: single
      author_profile: true
      share: true
      toc: true
      toc_sticky: true
      comments: true
      related: true
```
- 컬렉션별 기본 설정 체계화

### 10. Twitter 관련 설정 정리
```yaml
twitter:
  username: # 사용하지 않음으로 주석 추가
```
- 트위터 미사용 명시

---

## 📋 다음 단계

### 1. Jekyll 재빌드 필수
```bash
# 의존성 업데이트
bundle install

# 로컬 테스트
bundle exec jekyll clean
bundle exec jekyll serve
```

### 2. 확인 사항
- [ ] 브라우저에서 http://localhost:4000 접속
- [ ] 검색 기능 작동 확인 (우측 상단 검색 아이콘)
- [ ] 포스트 썸네일 표시 확인
- [ ] 소셜 공유 버튼 클릭 시 OG 이미지 확인

### 3. Git Push 후 확인
```bash
git add _config.yml Gemfile
git commit -m "feat: SEO 최적화 및 검색 기능 활성화"
git push origin main
```

**GitHub Pages 빌드 완료 후 확인:**
- [ ] Google Search Console에서 사이트 인증 확인
- [ ] Naver Search Advisor에서 사이트 인증 확인
- [ ] Facebook Sharing Debugger에서 OG 이미지 확인: https://developers.facebook.com/tools/debug/
- [ ] LinkedIn Post Inspector에서 OG 이미지 확인: https://www.linkedin.com/post-inspector/

### 4. 추가 권장 작업 (선택)
- [ ] OG 이미지 전용 1200×630px 이미지 제작 (현재는 avatar 이미지 재사용)
- [ ] Bing Webmaster Tools 등록 및 인증 코드 추가
- [ ] robots.txt 확인 (이미 존재함)
- [ ] sitemap.xml 확인 (자동 생성됨)

---

## 📊 예상 효과

### SEO 개선
- ✅ Google/Naver 검색 엔진에 사이트 등록 가능
- ✅ 구조화된 데이터로 검색 결과 리치 스니펫 가능
- ✅ 소셜 미디어 공유 시 이미지/제목 자동 표시

### 사용자 경험
- ✅ 사이트 내 검색으로 콘텐츠 찾기 쉬워짐
- ✅ 다크모드 댓글 시스템 자동 전환
- ✅ 포스트 썸네일 일관성

### 성능
- ✅ jekyll-seo-tag로 메타태그 자동화 (수동 관리 불필요)
- ✅ 명시적 설정으로 빌드 에러 감소

---

## 🔍 트러블슈팅

### jekyll-seo-tag 빌드 오류 발생 시
```bash
# Gemfile.lock 제거 후 재설치
rm Gemfile.lock
bundle install
```

### 검색 기능이 안 보일 때
- masthead.html 파일에 검색 버튼 코드가 있는지 확인
- `_includes/masthead.html` 확인

### Utterances 테마가 안 바뀔 때
- 브라우저 캐시 삭제
- 시크릿 모드에서 테스트
- 시스템 설정 > 다크모드 전환 후 새로고침

---

## 📝 변경된 파일 목록
1. `_config.yml` - 주요 설정 파일
2. `Gemfile` - jekyll-seo-tag 추가
3. `CONFIG_CHANGES_APPLIED.md` (이 파일) - 변경 기록

---

## ⚠️ 주의사항

1. **인증 코드는 public**: 걱정 안 해도 됨 (원래 public HTML 파일로 제공됨)
2. **이미지 경로 확인**: 빌드 후 이미지 로딩 오류 없는지 확인
3. **캐시 삭제 필수**: 변경 사항 확인 시 브라우저 캐시 삭제 필요

---

생성일: 2025-10-07
마지막 수정: 2025-10-07
