const defaultTheme = document.getElementById('default-theme-style');
const darkTheme = document.getElementById('dark-theme-style');

const applyThemePreference = (isDark) => {
    if (!defaultTheme || !darkTheme) {
        return;
    }

    darkTheme.disabled = !isDark;
    defaultTheme.disabled = isDark;

    try {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (error) {
        /* noop */
    }

    window.__themePreference = isDark ? 'dark' : 'light';
};

const onStylesReady = (callback) => {
    if (!defaultTheme || !darkTheme) {
        return;
    }

    const isReady = () =>
        defaultTheme.rel === 'stylesheet' && darkTheme.rel === 'stylesheet';

    if (isReady()) {
        callback();
        return;
    }

    const waitForLoad = () => {
        if (isReady()) {
            darkTheme.removeEventListener('load', waitForLoad);
            defaultTheme.removeEventListener('load', waitForLoad);
            callback();
        }
    };

    darkTheme.addEventListener('load', waitForLoad);
    defaultTheme.addEventListener('load', waitForLoad);
};

onStylesReady(() => {
    let storedTheme = window.__themePreference;

    if (!storedTheme) {
        try {
            storedTheme = localStorage.getItem('theme');
        } catch (error) {
            storedTheme = null;
        }
    }

    const isDarkMode = storedTheme === 'dark';
    applyThemePreference(isDarkMode);

    const toggleThemeBtn = document.getElementById('toggle_dark_theme');

    if (toggleThemeBtn) {
        toggleThemeBtn.checked = isDarkMode;
        toggleThemeBtn.addEventListener('change', (event) => {
            applyThemePreference(event.target.checked);
        });
    }
});