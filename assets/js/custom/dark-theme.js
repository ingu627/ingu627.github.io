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

const heroPanels = document.querySelectorAll('[data-hero-dark][data-hero-light]');

function syncLogos(isDark) {
  for (const img of logoImages) {
    const wanted = isDark ? img.dataset.logoDark : img.dataset.logoLight;
    if (wanted && img.getAttribute('src') !== wanted) img.setAttribute('src', wanted);
  }
  // The home banner is artwork too: dark plate with light strokes for the dark
  // theme, light plate with dark strokes for the light one.
  for (const el of heroPanels) {
    const url = isDark ? el.dataset.heroDark : el.dataset.heroLight;
    const next = url ? 'url("' + url + '")' : '';
    if (next && el.style.backgroundImage !== next) el.style.backgroundImage = next;
  }
}

function setDarkMode(isDark) {
  if (darkTheme) darkTheme.media = isDark === true ? 'all' : 'print';
  if (defaultTheme) defaultTheme.disabled = isDark === true;
  // Swap the logo before touching storage: in private mode or with site data
  // blocked, localStorage throws, and an exception here used to leave the dark
  // logo on the light theme (and to break every later toggle click).
  syncLogos(isDark === true);
  try {
    localStorage.setItem('theme', isDark ? 'dark' : 'dirt');
  } catch (e) { /* storage unavailable: the theme just will not persist */ }
}

if (darkTheme && defaultTheme) {
  let currentTheme = null;
  try { currentTheme = localStorage.getItem('theme'); } catch (e) { /* blocked */ }
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