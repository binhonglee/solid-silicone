/**
 * Appearance assets: color schemes + typography profiles + bootstrap HTML.
 */

import { DEFAULT_COLOR_SCHEME } from './themeManifest.js';
import { DEFAULT_TYPOGRAPHY } from './typographyManifest.js';
import { buildSchemeStylesheetLinkTags } from './themeManifest.js';
import { buildTypographyStylesheetLinkTags } from './typographyManifest.js';

export { DEFAULT_COLOR_SCHEME, COLOR_SCHEMES, normalizeColorScheme, buildSchemeStylesheetLinkTags } from './themeManifest.js';
export { DEFAULT_TYPOGRAPHY, TYPOGRAPHIES, normalizeTypography, buildTypographyStylesheetLinkTags } from './typographyManifest.js';

/**
 * Inline script for HTML bootstrap — sets defaults before CSS loads.
 *
 * Color scheme, typography, and OS light/dark are independent axes. Persisted
 * preferences hydrate later via applyThemeSettings.
 */
export const APPEARANCE_BOOTSTRAP_SCRIPT = `(function(){var d=document.documentElement,m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)');d.setAttribute('data-scheme','${DEFAULT_COLOR_SCHEME}');d.setAttribute('data-typography','${DEFAULT_TYPOGRAPHY}');d.setAttribute('data-theme',m&&m.matches?'dark':'light');})();`;

export function buildAppearanceStylesheetLinkTags(indent = '    '): string {
    return [
        buildTypographyStylesheetLinkTags(indent),
        buildSchemeStylesheetLinkTags(indent),
    ].join('\n');
}
