/**
 * Typography profile registry.
 *
 * Independent from color scheme (data-scheme) and light/dark preference (data-theme).
 * Add a profile by creating styles/typography/<id>.css and registering the
 * id in TYPOGRAPHIES below.
 */

export const DEFAULT_TYPOGRAPHY = 'system';

export const TYPOGRAPHIES = ['system'] as const;
export type TypographyId = (typeof TYPOGRAPHIES)[number];

export function normalizeTypography(typography: string | undefined): TypographyId {
    if (typography && (TYPOGRAPHIES as readonly string[]).includes(typography)) {
        return typography as TypographyId;
    }
    return DEFAULT_TYPOGRAPHY;
}

export function buildTypographyStylesheetLinkTags(indent = '    '): string {
    return TYPOGRAPHIES.map(
        (profile) => `${indent}<link href="./typography/${profile}.css" rel="stylesheet">`,
    ).join('\n');
}
