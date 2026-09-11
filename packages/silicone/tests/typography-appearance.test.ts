/** Typography and bootstrap manifests keep their shape. */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
    APPEARANCE_BOOTSTRAP_SCRIPT,
    buildAppearanceStylesheetLinkTags,
} from '../src/theme/appearanceManifest';
import { DEFAULT_TYPOGRAPHY, TYPOGRAPHIES, buildTypographyStylesheetLinkTags, normalizeTypography } from '../src/theme/typographyManifest';

describe('normalizeTypography', () => {
    it('passes registered profiles through and falls back to system', () => {
        expect(TYPOGRAPHIES.length).toBeGreaterThan(0);
        expect(normalizeTypography('system')).toBe('system');
        expect(normalizeTypography('nope')).toBe(DEFAULT_TYPOGRAPHY);
        expect(normalizeTypography(undefined)).toBe(DEFAULT_TYPOGRAPHY);
    });
});

describe('buildTypographyStylesheetLinkTags', () => {
    it('emits one link per profile', () => {
        const tags = buildTypographyStylesheetLinkTags();
        expect(tags.split('\n')).toHaveLength(TYPOGRAPHIES.length);
        expect(tags).toContain('<link href="./typography/system.css" rel="stylesheet">');
    });
});

describe('appearance bootstrap', () => {
    it('sets scheme, typography, and theme attributes with an OS fallback', () => {
        expect(APPEARANCE_BOOTSTRAP_SCRIPT).toContain('data-scheme');
        expect(APPEARANCE_BOOTSTRAP_SCRIPT).toContain('data-typography');
        expect(APPEARANCE_BOOTSTRAP_SCRIPT).toContain('data-theme');
        expect(APPEARANCE_BOOTSTRAP_SCRIPT).toContain('prefers-color-scheme');
    });
    it('combines typography and scheme link tags', () => {
        const tags = buildAppearanceStylesheetLinkTags();
        expect(tags).toContain('./typography/system.css');
        expect(tags).toContain('./schemes/github.css');
    });
    it('ships every typography profile file the manifest lists', () => {
        const here = dirname(fileURLToPath(import.meta.url));
        for (const profile of TYPOGRAPHIES) {
            expect(existsSync(join(here, '..', 'src', 'styles', 'typography', `${profile}.css`))).toBe(true);
        }
    });
});
