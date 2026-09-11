import { createContext, createMemo, createRoot, createSignal, onMount, useContext, type Accessor } from 'solid-js';
import {
    applyThemeSettings,
    DEFAULT_COLOR_SCHEME,
    DEFAULT_TYPOGRAPHY,
    normalizeColorScheme,
    normalizeTypography,
    resolveTheme,
    setThemeChangeHandler,
    type ColorSchemeId,
    type ResolvedTheme,
    type ThemePreference,
    type TypographyId,
} from './theme';

export interface ThemeSettingsPatch {
    theme?: ThemePreference | string;
    lightColorScheme?: string;
    darkColorScheme?: string;
    typography?: string;
    appFont?: string | null;
    monoFont?: string | null;
}

export interface ThemeApi {
    preference: Accessor<ThemePreference>;
    resolved: Accessor<ResolvedTheme>;
    lightColorScheme: Accessor<ColorSchemeId>;
    darkColorScheme: Accessor<ColorSchemeId>;
    typography: Accessor<TypographyId>;
    appFont: Accessor<string>;
    monoFont: Accessor<string>;
    setPreference: (preference: ThemePreference) => void;
    setLightColorScheme: (scheme: ColorSchemeId) => void;
    setDarkColorScheme: (scheme: ColorSchemeId) => void;
    setTypography: (typography: TypographyId) => void;
    setAppFont: (font: string | null | undefined) => void;
    setMonoFont: (font: string | null | undefined) => void;
    /** Sync reactive signals from backend settings without touching the DOM. */
    syncFromSettings: (settings: ThemeSettingsPatch) => void;
    applySettings: (settings: ThemeSettingsPatch) => void;
    /**
     * Apply current signals to the DOM and start OS tracking. Called by
     * `ThemeProvider` on mount. Owns the singleton theme-change slot. No-op
     * outside a browser.
     */
    ensureBrowserSync: () => void;
}

function createThemeApi(): ThemeApi {
    const [preference, setPreferenceSignal] = createSignal<ThemePreference>('system');
    const [lightColorScheme, setLightColorSchemeSignal] = createSignal<ColorSchemeId>(DEFAULT_COLOR_SCHEME);
    const [darkColorScheme, setDarkColorSchemeSignal] = createSignal<ColorSchemeId>(DEFAULT_COLOR_SCHEME);
    const [typography, setTypographySignal] = createSignal<TypographyId>(DEFAULT_TYPOGRAPHY);
    const [appFont, setAppFontSignal] = createSignal<string>('');
    const [monoFont, setMonoFontSignal] = createSignal<string>('');
    // OS theme for `system` preference. The engine's media-query listener only
    // touches the DOM plus a callback, so mirror it into a signal here. The
    // store owns the singleton handler slot while mounted.
    const [systemTheme, setSystemTheme] = createSignal<ResolvedTheme>('light');
    let handlerInstalled = false;

    const resolved = createMemo(() =>
        preference() === 'system' ? systemTheme() : (preference() as ResolvedTheme),
    );

    /** Apply current signals to the DOM once and start OS tracking. Browser only. */
    const ensureBrowserSync = (): void => {
        if (handlerInstalled || typeof document === 'undefined') {
            return;
        }
        handlerInstalled = true;
        setThemeChangeHandler((next) => setSystemTheme(next));
        applyThemeSettings({
            theme: preference(),
            lightColorScheme: lightColorScheme(),
            darkColorScheme: darkColorScheme(),
            typography: typography(),
        });
    };

    const syncFromSettings: ThemeApi['syncFromSettings'] = (settings) => {
        if (settings.theme === 'system' || settings.theme === 'light' || settings.theme === 'dark') {
            setPreferenceSignal(settings.theme);
        }
        if (settings.lightColorScheme !== undefined) {
            setLightColorSchemeSignal(normalizeColorScheme(settings.lightColorScheme, 'light'));
        }
        if (settings.darkColorScheme !== undefined) {
            setDarkColorSchemeSignal(normalizeColorScheme(settings.darkColorScheme, 'dark'));
        }
        if (settings.typography !== undefined) {
            setTypographySignal(normalizeTypography(settings.typography));
        }
        if (settings.appFont !== undefined) {
            setAppFontSignal(settings.appFont ?? '');
        }
        if (settings.monoFont !== undefined) {
            setMonoFontSignal(settings.monoFont ?? '');
        }
    };

    const applySettings: ThemeApi['applySettings'] = (settings) => {
        syncFromSettings(settings);
        applyThemeSettings({
            theme: settings.theme,
            lightColorScheme: settings.lightColorScheme,
            darkColorScheme: settings.darkColorScheme,
            typography: settings.typography,
            appFont: settings.appFont,
            monoFont: settings.monoFont,
        });
    };

    const setPreference = (next: ThemePreference): void => {
        setPreferenceSignal(next);
        applyThemeSettings({ theme: next });
    };

    const setLightColorScheme = (scheme: ColorSchemeId): void => {
        setLightColorSchemeSignal(scheme);
        applyThemeSettings({ lightColorScheme: scheme });
    };

    const setDarkColorScheme = (scheme: ColorSchemeId): void => {
        setDarkColorSchemeSignal(scheme);
        applyThemeSettings({ darkColorScheme: scheme });
    };

    const setTypography = (next: TypographyId): void => {
        setTypographySignal(next);
        applyThemeSettings({ typography: next });
    };

    const setAppFont = (font: string | null | undefined): void => {
        setAppFontSignal(font ?? '');
        applyThemeSettings({ appFont: font });
    };

    const setMonoFont = (font: string | null | undefined): void => {
        setMonoFontSignal(font ?? '');
        applyThemeSettings({ monoFont: font });
    };

    return {
        preference,
        resolved,
        lightColorScheme,
        darkColorScheme,
        typography,
        appFont,
        monoFont,
        setPreference,
        setLightColorScheme,
        setDarkColorScheme,
        setTypography,
        setAppFont,
        setMonoFont,
        syncFromSettings,
        applySettings,
        ensureBrowserSync,
    };
}

const ThemeContext = createContext<Accessor<ThemeApi>>();
const sharedThemeApi = createRoot(createThemeApi);

/** Keep the shared theme store aligned when settings arrive before the panel mounts. */
export function syncThemeContextFromSettings(settings: ThemeSettingsPatch): void {
    sharedThemeApi.syncFromSettings(settings);
}

export function ThemeProvider(props: { children: import('solid-js').JSX.Element }): import('solid-js').JSX.Element {
    onMount(() => {
        sharedThemeApi.ensureBrowserSync();
    });
    return (
        <ThemeContext.Provider value={() => sharedThemeApi}>
            {props.children}
        </ThemeContext.Provider>
    );
}

/** Reactive theme store for settings UI and other Solid surfaces. */
export function useTheme(): Accessor<ThemeApi> {
    const ctx = useContext(ThemeContext);
    return ctx ?? (() => sharedThemeApi);
}
