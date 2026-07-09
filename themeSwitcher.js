class ThemeSwitch extends HTMLElement {
    static theme;

    constructor() {
        super();

        this.addEventListener('click', () => {
            const wasDark = ThemeSwitch.theme === 'dark';
            ThemeSwitch.theme = wasDark ? 'light' : 'dark';
            localStorage.setItem(themeStorageKey, ThemeSwitch.theme);
            ThemeSwitch.reflectColorSchemePreference();
            this.setContent(!wasDark);
        });
    }

    setContent(isDark) {
        if (isDark) {
            this.textContent = '🌞';
        }
        else {
            this.textContent = '🌚';
        }
    }

    static getThemeColorPreference() {
        const stored = localStorage.getItem(themeStorageKey);
        if (stored) { return stored; }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    static reflectColorSchemePreference() {
        document.firstElementChild.style.setProperty('color-scheme', ThemeSwitch.theme);

        document.getElementById('themeSwitcher')?.setAttribute('theme', ThemeSwitch.theme);
    }
}
customElements.define('theme-switch', ThemeSwitch);


const themeStorageKey = 'theme';
ThemeSwitch.theme = ThemeSwitch.getThemeColorPreference();

ThemeSwitch.reflectColorSchemePreference(); // initial set to either remembered value, or user's preference
