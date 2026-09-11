/** Token contract stays in sync with tokens.css. */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { REQUIRED_TOKENS, SI_ALIASES } from '../src/theme/tokenContract';

const here = dirname(fileURLToPath(import.meta.url));
const stylesDir = join(here, '..', 'src', 'styles');
const tokensCss = readFileSync(join(stylesDir, 'tokens.css'), 'utf8');
const cssFiles = ['silicone.css', 'new_components.css', 'markdown.css'].map((f) =>
    readFileSync(join(stylesDir, f), 'utf8'),
);

describe('token contract', () => {
    it('lists only --vscode-* tokens', () => {
        for (const t of REQUIRED_TOKENS) {
            expect(t.token.startsWith('--vscode-')).toBe(true);
        }
    });
    it('defines every --si-* alias in tokens.css', () => {
        for (const alias of SI_ALIASES) {
            expect(tokensCss).toContain(alias);
        }
    });
    it('covers buttons, inputs, badges, ANSI colors, fonts', () => {
        const names = REQUIRED_TOKENS.map((t) => t.token);
        for (const token of [
            '--vscode-button-background',
            '--vscode-input-background',
            '--vscode-badge-background',
            '--vscode-terminal-ansiRed',
            '--vscode-editor-font-family',
        ]) {
            expect(names).toContain(token);
        }
    });
    it('uses no bare host token in shipped CSS (every var() has a fallback)', () => {
        const bare = /var\(--vscode-[a-zA-Z-]+\)/;
        for (const css of cssFiles) {
            expect(css).not.toMatch(bare);
        }
    });
    it('picks a readable success foreground per scheme and mode', () => {
        const picks = readFileSync(join(stylesDir, 'on-success.css'), 'utf8');
        // Bright dark-mode greens take dark text (dracula white contrast is 1.4:1).
        expect(picks).toContain(':root[data-scheme="dracula"][data-theme="dark"]');
        expect(picks).toMatch(/dracula.*dark[\s\S]*?--si-on-success: #181a18/);
        // Dark light-mode greens keep white text.
        expect(picks).toMatch(/github.*light[\s\S]*?--si-on-success: #ffffff/);
    });
});
