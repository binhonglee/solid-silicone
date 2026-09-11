/** Shipped CSS keeps every surface the components depend on. */
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { COLOR_SCHEMES } from '../src/theme/themeManifest';

const here = dirname(fileURLToPath(import.meta.url));
const stylesDir = join(here, '..', 'src', 'styles');
const read = (name: string): string => readFileSync(join(stylesDir, name), 'utf8');

describe('layer order', () => {
    it('loads tokens before every other layer in the dev entry', () => {
        const all = read('all.css');
        const order = ['tokens.css', 'silicone.css', 'new_components.css', 'markdown.css'].map((f) => all.indexOf(f));
        expect(order.every((i) => i >= 0)).toBe(true);
        expect([...order].sort((a, b) => a - b)).toEqual(order);
    });
});

describe('dropdown surface', () => {
    it('caps long menus with scroll', () => {
        const css = read('new_components.css');
        expect(css).toContain('.si-dropdown-menu');
        expect(css).toContain('overflow-y: auto');
    });
    it('scopes the trigger above generic button chrome', () => {
        expect(read('new_components.css')).toContain('.si-dropdown .si-dropdown-trigger');
    });
});

describe('split drawer surface', () => {
    it('styles the drawer, toggle, in-pane close, and scrim', () => {
        const css = read('new_components.css');
        for (const cls of ['.si-split-drawer', '.si-split-drawer-open', '.si-split-drawer-toggle', '.si-split-drawer-close', '.si-split-scrim']) {
            expect(css).toContain(cls);
        }
    });
    it('parks the closed drawer off-canvas outside the tab order', () => {
        const css = read('new_components.css');
        expect(css).toContain('translateX(-105%)');
        expect(css).toContain('visibility: hidden');
    });
    it('hides the divider in drawer mode', () => {
        expect(read('new_components.css')).toContain('.si-split-drawer > .si-split-handle');
    });
});

describe('search overlay surface', () => {
    it('styles panel, list, rows, and footer hints', () => {
        const css = read('new_components.css');
        for (const cls of ['.si-search-panel', '.si-search-header', '.si-search-status', '.si-search-list', '.si-search-item', '.si-search-footer']) {
            expect(css).toContain(cls);
        }
    });
});

describe('shared chrome', () => {
    it('keeps overlay, menu, button, and dialog classes', () => {
        const css = read('silicone.css');
        for (const cls of ['.overlay-host', '.overlay-panel', '.overlay-backdrop', '.menu', '.menu-item', '.btn', '.btn-secondary', '.dialog-card', '.empty-state']) {
            expect(css).toContain(cls);
        }
    });
    it('keeps the markdown scope', () => {
        expect(read('markdown.css')).toContain('.md-content');
    });
});

describe('scheme files', () => {
    it('ships one CSS file per registered scheme id', () => {
        const files = readdirSync(join(stylesDir, 'schemes'));
        for (const id of COLOR_SCHEMES) {
            expect(files).toContain(`${id}.css`);
        }
    });
});
