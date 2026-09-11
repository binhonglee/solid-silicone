/** Markdown stays safe by default; resolveMode picks bundled without DOM host. */
import { describe, expect, it } from 'vitest';
import { renderSimpleMarkdown } from '../src/components/Markdown';
import { normalizeThemePreference } from '../src/theme/theme';
import { hasVsCodeHost, resolveThemeSource } from '../src/theme/resolveMode';
import { mapColorCustomizations } from '../src/theme/vscodeHost';

describe('markdown', () => {
    it('escapes raw HTML', () => {
        const html = renderSimpleMarkdown('<script>alert(1)</script>');
        expect(html).not.toContain('<script>');
        expect(html).toContain('&lt;script&gt;');
    });
    it('renders headings, bold, code, links', () => {
        const html = renderSimpleMarkdown('# Hi\n\n**bold** and `code` and [x](https://example.com)');
        expect(html).toContain('<h1>');
        expect(html).toContain('<strong>bold</strong>');
        expect(html).toContain('<code>code</code>');
        expect(html).toContain('<a href="https://example.com"');
    });
});

describe('theme prefs', () => {
    it('accepts system/light/dark and rejects test hooks', () => {
        expect(normalizeThemePreference('system')).toBe('system');
        expect(normalizeThemePreference('test')).toBeUndefined();
        expect(normalizeThemePreference('test-dark')).toBeUndefined();
    });
    it('auto resolves to bundled without a host marker', () => {
        expect(hasVsCodeHost()).toBe(false);
        expect(resolveThemeSource('auto')).toBe('bundled');
        expect(resolveThemeSource('auto', { host: true })).toBe('vscode');
        expect(resolveThemeSource('bundled')).toBe('bundled');
        expect(resolveThemeSource('vscode')).toBe('vscode');
    });
    it('maps color IDs from dots to hyphens', () => {
        expect(
            mapColorCustomizations({
                'editor.background': '#1e1e1e',
                'list.activeSelectionBackground': '#04395e',
            }),
        ).toEqual({
            '--vscode-editor-background': '#1e1e1e',
            '--vscode-list-activeSelectionBackground': '#04395e',
        });
    });
});
