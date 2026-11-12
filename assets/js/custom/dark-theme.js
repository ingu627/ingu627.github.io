/* Dark theme toggle.
 *
 * main_dark.css is linked with media="print" so it never blocks the first paint
 * and never flashes dark for light-theme visitors; this script is the only thing
 * that makes it apply.
 */
const defaultTheme = document.querySelector('link[rel="stylesheet"][href*="main.css"]');
const darkTheme = document.querySelector('link[rel="stylesheet"][href*="main_dark.css"]');

// The logo ships in two renders (dark plate / light plate). Elements carrying
// both data attributes follow the active theme; the HTML default is the dark one.
const logoImages = document.querySelectorAll('img[data-logo-dark][data-logo-light]');

function syncLogos(isDark) {
  for (const img of logoImages) {
    const wanted = isDark ? img.dataset.logoDark : img.dataset.logoLight;
    if (wanted && img.getAttribute('src') !== wanted) img.setAttribute('src', wanted);
  }
}

function setDarkMode(isDark) {
  if (darkTheme) darkTheme.media = isDark === true ? 'all' : 'print';
  if (defaultTheme) defaultTheme.disabled = isDark === true;
  localStorage.setItem('theme', isDark ? 'dark' : 'dirt');
  syncLogos(isDark === true);
}

if (darkTheme && defaultTheme) {
  let currentTheme = localStorage.getItem('theme');
  let isDarkMode = false;
  if (currentTheme) {
    isDarkMode = currentTheme === 'dark';
  } else {
    isDarkMode = matchMedia('(prefers-color-scheme: dark)').matches;
  }

  setDarkMode(isDarkMode);

  let toggleThemeBtn = document.getElementById('toggle_dark_theme');
  if (toggleThemeBtn) {
    toggleThemeBtn.checked = isDarkMode;
    toggleThemeBtn.addEventListener('click', (e) => setDarkMode(e.target.checked));
  }
}