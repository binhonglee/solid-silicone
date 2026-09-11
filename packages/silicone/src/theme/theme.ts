/**
 * Appearance handling: color scheme, typography, and light/dark preference.
 *
 * Color palettes: styles/schemes/*.css  → data-scheme + data-theme
 * Typography:     styles/typography/*.css → data-typography
 */

import {
    DEFAULT_COLOR_SCHEME,
    normalizeColorScheme,
    type ColorSchemeId,
} from './themeManifest.js';
import {
    DEFAULT_TYPOGRAPHY,
    normalizeTypography,
    type TypographyId,
} from './typographyManifest.js';

export {
    COLOR_SCHEMES,
    COLOR_SCHEME_DEFINITIONS,
    DEFAULT_COLOR_SCHEME,
    colorSchemesForMode,
    defaultColorSchemeForMode,
    normalizeColorScheme,
    type ColorSchemeId,
    type ColorSchemeDefinition,
    type ThemeMode,
} from './themeManifest.js';
export { TYPOGRAPHIES, DEFAULT_TYPOGRAPHY, normalizeTypography, type TypographyId } from './typographyManifest.js';
export {
    APPEARANCE_BOOTSTRAP_SCRIPT,
    buildAppearanceStylesheetLinkTags,
    buildSchemeStylesheetLinkTags,
    buildTypographyStylesheetLinkTags,
} from './appearanceManifest.js';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeSettings {
    theme?: ThemePreference | string;
    /** Color scheme applied when the resolved theme is light. */
    lightColorScheme?: string;
    /** Color scheme applied when the resolved theme is dark. */
    darkColorScheme?: string;
    typography?: string;
    /** User-selected app (UI) font family. Empty string / undefined clears the override. */
    appFont?: string | null;
    /** User-selected monospace (editor) font family. Empty string / undefined clears the override. */
    monoFont?: string | null;
}

/**
 * Apply (or clear) a font-family override as an inline custom property on the
 * document root. Inline styles outrank the typography profile stylesheet, so a
 * non-empty value wins; clearing it restores the profile default.
 *
 * @returns true when the property value changed.
 */
function applyFontOverride(property: string, value: string | null | undefined): boolean {
    const root = document.documentElement;
    const next = (value ?? '').trim();
    const current = root.style.getPropertyValue(property);
    if (current === next) {
        return false;
    }
    if (next) {
        root.style.setProperty(property, next);
    } else {
        root.style.removeProperty(property);
    }
    return true;
}

export function normalizeThemePreference(theme: string | undefined): ThemePreference | undefined {
    if (theme === 'system' || theme === 'light' || theme === 'dark') {
        return theme;
    }
    return undefined;
}

export function getSystemTheme(): ResolvedTheme {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
    if (preference === 'light' || preference === 'dark') {
        return preference;
    }
    return getSystemTheme();
}

let systemThemeMediaQuery: MediaQueryList | null = null;
let systemThemeListener: ((event: MediaQueryListEvent) => void) | null = null;
let activeThemePreference: ThemePreference = 'system';
let activeLightColorScheme: ColorSchemeId = DEFAULT_COLOR_SCHEME;
let activeDarkColorScheme: ColorSchemeId = DEFAULT_COLOR_SCHEME;
let activeTypography: TypographyId = DEFAULT_TYPOGRAPHY;
let onThemeResolved: ((theme: ResolvedTheme) => void) | null = null;

/** Color scheme that applies for the given resolved (light/dark) theme. */
function schemeForResolvedTheme(resolvedTheme: ResolvedTheme): ColorSchemeId {
    return resolvedTheme === 'dark' ? activeDarkColorScheme : activeLightColorScheme;
}

/**
 * Apply the resolved theme plus its matching color scheme to the document.
 *
 * @returns true when any data-* attribute or inline colorScheme changed.
 */
export function applyResolvedTheme(resolvedTheme: ResolvedTheme): boolean {
    const root = document.documentElement;
    const colorScheme = schemeForResolvedTheme(resolvedTheme);
    let changed = false;
    if (root.getAttribute('data-theme') !== resolvedTheme) {
        changed = true;
    }
    if (root.getAttribute('data-scheme') !== colorScheme) {
        changed = true;
    }
    root.setAttribute('data-theme', resolvedTheme);
    root.setAttribute('data-scheme', colorScheme);
    root.style.colorScheme = resolvedTheme;
    return changed;
}

export function setThemeChangeHandler(handler: ((theme: ResolvedTheme) => void) | null): void {
    onThemeResolved = handler;
}

function clearSystemThemeListener(): void {
    // Remove the listener from the EXACT MediaQueryList it was added to. Each
    // `matchMedia()` call returns a NEW MediaQueryList (WebKit included), so
    // calling it again here would remove nothing and leak a listener — and
    // `watchSystemTheme` runs on every settings apply (the in-app call plus the
    // backend echo), so leaked listeners would accumulate and publish
    // `themeChanged` several times on a single OS appearance flip.
    if (systemThemeMediaQuery && systemThemeListener) {
        systemThemeMediaQuery.removeEventListener('change', systemThemeListener);
    }
    systemThemeMediaQuery = null;
    systemThemeListener = null;
}

function watchSystemTheme(preference: ThemePreference): void {
    activeThemePreference = preference;
    clearSystemThemeListener();

    if (preference !== 'system' || typeof window.matchMedia !== 'function') {
        return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (): void => {
        if (activeThemePreference !== 'system') {
            return;
        }
        // OS flipped light/dark: re-resolve and swap to the scheme for that mode.
        const resolvedTheme = getSystemTheme();
        applyResolvedTheme(resolvedTheme);
        onThemeResolved?.(resolvedTheme);
    };
    systemThemeMediaQuery = mediaQuery;
    systemThemeListener = listener;
    mediaQuery.addEventListener('change', listener);
}

/**
 * Apply appearance settings. Only fields present in `settings` are updated;
 * omitted values leave the current data-* attributes untouched.
 *
 * @returns true when any appearance attribute changed.
 */
export function applyThemeSettings(settings: ThemeSettings): boolean {
    let changed = false;
    const root = document.documentElement;

    if (settings.typography !== undefined) {
        const typography = normalizeTypography(settings.typography);
        if (root.getAttribute('data-typography') !== typography) {
            changed = true;
        }
        root.setAttribute('data-typography', typography);
        activeTypography = typography;
    }

    // Only `undefined` means "field absent, leave untouched". The backend sends
    // `null` (serialized from a cleared Option) to mean "reset to default", which
    // applyFontOverride handles via `value ?? ''`.
    if (settings.appFont !== undefined) {
        changed = applyFontOverride('--vscode-font-family', settings.appFont) || changed;
    }

    if (settings.monoFont !== undefined) {
        changed = applyFontOverride('--vscode-editor-font-family', settings.monoFont) || changed;
    }

    let schemesChanged = false;
    if (settings.lightColorScheme !== undefined) {
        activeLightColorScheme = normalizeColorScheme(settings.lightColorScheme, 'light');
        schemesChanged = true;
    }
    if (settings.darkColorScheme !== undefined) {
        activeDarkColorScheme = normalizeColorScheme(settings.darkColorScheme, 'dark');
        schemesChanged = true;
    }

    if (settings.theme !== undefined) {
        const themePreference = normalizeThemePreference(settings.theme);
        if (themePreference !== undefined) {
            activeThemePreference = themePreference;
        }
    }

    // The applied color scheme depends on the resolved light/dark theme, so
    // re-resolve whenever the preference or either scheme changed.
    if (settings.theme !== undefined || schemesChanged) {
        const resolvedTheme = resolveTheme(activeThemePreference);
        if (applyResolvedTheme(resolvedTheme)) {
            changed = true;
        }
        watchSystemTheme(activeThemePreference);
    }

    // Notify listeners from the ONE function every appearance path flows
    // through — an in-app light/dark switch, a scheme change, or a font change.
    // Previously only the OS-appearance listener called this handler, so live
    // surfaces (the terminal panes, the CodeMirror preview) restyled on a
    // system flip but NEVER on an in-app change. `theme.ts` stays free of bus
    // imports; the handler hook is set by the shell after boot.
    if (changed) {
        onThemeResolved?.(resolveTheme(activeThemePreference));
    }

    return changed;
}
