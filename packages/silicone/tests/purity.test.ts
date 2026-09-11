/** Purity guards: no app DOM ids, no git-only aliases in shipped CSS; icon split holds. */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(here, '..', 'src', 'styles', 'silicone.css'), 'utf8');
const icons = readFileSync(join(here, '..', 'src', 'components', 'icons.tsx'), 'utf8');
const gitIcons = readFileSync(join(here, '..', 'src', 'components', 'gitIcons.tsx'), 'utf8');
const menu = readFileSync(join(here, '..', 'src', 'components', 'Menu.tsx'), 'utf8');

describe('css purity', () => {
    it('has no app DOM ids', () => {
        for (const id of ['#commit-graph', '#sidebar', '#app', '#header', '#controls', '#main-content']) {
            expect(css).not.toContain(id);
        }
    });
    it('has no git-only aliases', () => {
        for (const token of ['--branch-color', '--stack-accent', '--stack-base', '--commit-diff-syntax-', '--current-commit']) {
            expect(css).not.toContain(token);
        }
    });
    it('keeps @supports fallback for color-mix/rgb-from', () => {
        expect(css).toContain('@supports');
    });
});

describe('icon split', () => {
    it('keeps git glyphs out of the generic set', () => {
        for (const name of ['Worktree', 'SplitRight', 'SplitDown', 'Branch', 'Tag', 'Repo', 'Stash', 'Push', 'Pull', 'Download', 'PushArrow']) {
            expect(icons).not.toContain(`function ${name}(`);
            expect(gitIcons).toContain(`function ${name}(`);
        }
    });
    it('keeps generic glyphs in the generic set', () => {
        for (const name of ['Close', 'Chevron', 'Plus', 'Search', 'Check', 'Star']) {
            expect(icons).toContain(`function ${name}`);
        }
    });
});

describe('menu dismissal guard', () => {
    it('checks Element, not HTMLElement', () => {
        expect(menu).toContain('instanceof Element');
        expect(menu).not.toContain('instanceof HTMLElement');
    });
});
