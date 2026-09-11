/** Cascade guard: shared classes precede app overrides; silicone.css loads tokens first. */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(here, '..', 'src', 'styles', 'silicone.css'), 'utf8');
const componentsCss = readFileSync(join(here, '..', 'src', 'styles', 'new_components.css'), 'utf8');

describe('silicone.css layer order', () => {
    it('defines :root aliases before component classes', () => {
        expect(css.indexOf(':root')).toBeGreaterThanOrEqual(0);
        expect(css.indexOf(':root')).toBeLessThan(css.indexOf('.btn'));
    });
    it('keeps overlay chrome before dialogs and menus', () => {
        expect(css.indexOf('.overlay-host')).toBeLessThan(css.indexOf('.dialog-card'));
        expect(css.indexOf('.btn')).toBeLessThan(css.indexOf('.menu'));
    });
    it('keeps .empty-state available', () => {
        expect(css).toContain('.empty-state');
    });
    it('scopes the dropdown trigger above generic .btn chrome', () => {
        // Host apps load their own .btn copy after this sheet; a bare
        // .si-dropdown-trigger (0,1,0) loses the justify/gap tie and the
        // value renders centered. The doubled selector (0,2,0) must stay.
        expect(componentsCss).toContain('.si-dropdown .si-dropdown-trigger');
        expect(componentsCss).not.toMatch(/^\.si-dropdown-trigger\s*\{/m);
    });
});
