/** Color scheme registry stays consistent and mode-aware. */
import { describe, expect, it } from 'vitest';
import {
    COLOR_SCHEMES,
    COLOR_SCHEME_DEFINITIONS,
    buildSchemeStylesheetLinkTags,
    colorSchemesForMode,
    defaultColorSchemeForMode,
    normalizeColorScheme,
} from '../src/theme/themeManifest';

describe('scheme registry', () => {
    it('gives every definition a unique id, a label, and at least one mode', () => {
        const ids = COLOR_SCHEME_DEFINITIONS.map((d) => d.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (const d of COLOR_SCHEME_DEFINITIONS) {
            expect(d.id.length).toBeGreaterThan(0);
            expect(d.label.length).toBeGreaterThan(0);
            expect(d.modes.length).toBeGreaterThan(0);
            for (const mode of d.modes) {
                expect(['light', 'dark']).toContain(mode);
            }
        }
    });
    it('lists every definition id in COLOR_SCHEMES order', () => {
        expect([...COLOR_SCHEMES]).toEqual(COLOR_SCHEME_DEFINITIONS.map((d) => d.id));
    });
    it('lists definitions in alphabetical order', () => {
        const ids = COLOR_SCHEME_DEFINITIONS.map((d) => d.id);
        expect([...ids].sort()).toEqual(ids);
    });
});

describe('colorSchemesForMode', () => {
    it('splits dark-only and light-only schemes', () => {
        const light = colorSchemesForMode('light').map((d) => d.id);
        const dark = colorSchemesForMode('dark').map((d) => d.id);
        expect(light).toHaveLength(6);
        expect(dark).toHaveLength(14);
        expect(dark).toContain('dracula');
        expect(light).not.toContain('dracula');
        expect(light).toContain('catppuccin-latte');
        expect(dark).not.toContain('catppuccin-latte');
    });
});

describe('scheme defaults and normalization', () => {
    it('defaults both modes to the global default', () => {
        expect(defaultColorSchemeForMode('light')).toBe('atom-one');
        expect(defaultColorSchemeForMode('dark')).toBe('atom-one');
    });
    it('passes valid ids through and falls back per mode', () => {
        expect(normalizeColorScheme('dracula', 'dark')).toBe('dracula');
        expect(normalizeColorScheme('dracula', 'light')).toBe('atom-one');
        expect(normalizeColorScheme('nope', 'dark')).toBe('atom-one');
        expect(normalizeColorScheme(undefined, 'light')).toBe('atom-one');
    });
});

describe('buildSchemeStylesheetLinkTags', () => {
    it('emits one link per scheme with the default indent', () => {
        const tags = buildSchemeStylesheetLinkTags();
        expect(tags.split('\n')).toHaveLength(COLOR_SCHEMES.length);
        expect(tags).toContain('<link href="./schemes/dracula.css" rel="stylesheet">');
    });
    it('honors a custom indent', () => {
        expect(buildSchemeStylesheetLinkTags('  ').split('\n')[0]?.startsWith('  <link')).toBe(true);
    });
});
