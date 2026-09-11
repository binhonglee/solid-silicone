/**
 * Color scheme registry.
 *
 * Palettes live in styles/schemes/*.css and are selected via
 * data-scheme + data-theme on :root.
 *
 * A scheme declares which light/dark modes it provides a palette for. The
 * settings UI offers each scheme only for the modes it supports, and a scheme
 * that is invalid for a mode falls back to the default for that mode. This lets
 * a scheme ship a CSS file that only targets light or only dark.
 */

export type ThemeMode = 'light' | 'dark';

export interface ColorSchemeDefinition {
    readonly id: string;
    readonly label: string;
    /** Light/dark modes this scheme provides a palette for. */
    readonly modes: readonly ThemeMode[];
}

export const COLOR_SCHEME_DEFINITIONS = [
    { id: 'atom-one', label: 'Atom One', modes: ['light', 'dark'] },
    { id: 'catppuccin-frappe', label: 'Catppuccin Frappé', modes: ['dark'] },
    { id: 'catppuccin-latte', label: 'Catppuccin Latte', modes: ['light'] },
    { id: 'catppuccin-macchiato', label: 'Catppuccin Macchiato', modes: ['dark'] },
    { id: 'catppuccin-mocha', label: 'Catppuccin Mocha', modes: ['dark'] },
    { id: 'dracula', label: 'Dracula', modes: ['dark'] },
    { id: 'github', label: 'GitHub', modes: ['light', 'dark'] },
    { id: 'material-darker', label: 'Material Darker', modes: ['dark'] },
    { id: 'material-lighter', label: 'Material Lighter', modes: ['light'] },
    { id: 'material-ocean', label: 'Material Ocean', modes: ['dark'] },
    { id: 'material-oceanic', label: 'Material Oceanic', modes: ['dark'] },
    { id: 'material-palenight', label: 'Material Palenight', modes: ['dark'] },
    { id: 'navigator', label: 'Navigator', modes: ['light', 'dark'] },
    { id: 'nerv', label: 'NERV', modes: ['dark'] },
    { id: 'nord', label: 'Nord', modes: ['dark'] },
    { id: 'solarized', label: 'Solarized', modes: ['light', 'dark'] },
] as const satisfies readonly ColorSchemeDefinition[];

export type ColorSchemeId = (typeof COLOR_SCHEME_DEFINITIONS)[number]['id'];

export const DEFAULT_COLOR_SCHEME: ColorSchemeId = 'atom-one';

/** Every registered scheme id (each ships a CSS file that must be loaded). */
export const COLOR_SCHEMES: readonly ColorSchemeId[] = COLOR_SCHEME_DEFINITIONS.map(
    (definition) => definition.id,
);

/** Schemes that provide a palette for the given light/dark mode. */
export function colorSchemesForMode(mode: ThemeMode): ColorSchemeDefinition[] {
    // Widen the per-entry literal tuple (`as const`) so `includes` accepts either mode.
    return COLOR_SCHEME_DEFINITIONS.filter((definition) =>
        (definition.modes as readonly ThemeMode[]).includes(mode),
    );
}

/** Default scheme for a mode: the global default when valid, else the first supported scheme. */
export function defaultColorSchemeForMode(mode: ThemeMode): ColorSchemeId {
    const supported = colorSchemesForMode(mode);
    if (supported.some((definition) => definition.id === DEFAULT_COLOR_SCHEME)) {
        return DEFAULT_COLOR_SCHEME;
    }
    return (supported[0]?.id as ColorSchemeId | undefined) ?? DEFAULT_COLOR_SCHEME;
}

/**
 * Validate a persisted scheme id against the schemes available for `mode`,
 * falling back to that mode's default when it is unknown or unsupported.
 */
export function normalizeColorScheme(scheme: string | undefined, mode: ThemeMode): ColorSchemeId {
    if (scheme && colorSchemesForMode(mode).some((definition) => definition.id === scheme)) {
        return scheme as ColorSchemeId;
    }
    return defaultColorSchemeForMode(mode);
}

export function buildSchemeStylesheetLinkTags(indent = '    '): string {
    return COLOR_SCHEMES.map(
        (scheme) => `${indent}<link href="./schemes/${scheme}.css" rel="stylesheet">`,
    ).join('\n');
}
