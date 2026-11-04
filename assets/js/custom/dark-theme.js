/* Dark theme toggle.
 *
 * main_dark.css is linked with media="print" so it never blocks the first paint
 * and never flashes dark for light-theme visitors; this script is the only thing
 * that makes it apply.
 */
const defaultTheme = document.querySelector('link[href*="main.css"]');
const darkTheme = document.querySelector('link[href*="main_dark.css"]');

function setDarkMode(isDark) {
  if (darkTheme) darkTheme.media = isDark === true ? 'all' : 'print';
  if (defaultTheme) defaultTheme.disabled = isDark === true;
  localStorage.setItem('theme', isDark ? 'dark' : 'dirt');
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