// 본문 이미지 지연 로딩: 외부(GitHub) 호스팅 이미지가 많은 구형 글의 초기 로딩 비용을 줄인다.
// 본문 첫 이미지는 LCP 후보이므로 즉시 로딩을 유지한다.
(function () {
  function apply() {
    var root = document.querySelector(".page__content") || document.querySelector("article") || document.body;
    var imgs = root.querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (i === 0) continue;
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
      if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
