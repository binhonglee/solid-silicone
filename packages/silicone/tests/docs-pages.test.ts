/**
 * Docs page model stays complete: every routed page carries the sections
 * ComponentDocPage renders (import, usage, preview). Static text scan so the
 * node test run never mounts Solid components.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const pagesDir = join(here, '..', '..', '..', 'docs', 'src');
const sources = readdirSync(pagesDir)
    .filter((f) => f.startsWith('pages-') && f.endsWith('.tsx'))
    .map((f) => readFileSync(join(pagesDir, f), 'utf8'))
    .join('\n');

function pageSlugs(source: string): string[] {
    return [...source.matchAll(/^ {4,8}slug: '([^']+)'/gm)].map((m) => m[1]);
}

describe('docs pages', () => {
    it('routes every page at a unique kebab-case slug', () => {
        const slugs = pageSlugs(sources);
        expect(slugs.length).toBeGreaterThanOrEqual(40);
        expect(new Set(slugs).size).toBe(slugs.length);
        for (const slug of slugs) {
            expect(slug).toMatch(/^[a-z0-9-]+$/);
        }
    });
    it('gives every page an import, a usage snippet, and a preview', () => {
        const slugs = pageSlugs(sources);
        const count = (key: string): number => sources.split(`${key}:`).length - 1;
        expect(count('importSpec')).toBe(slugs.length);
        expect(count('usage')).toBe(slugs.length);
        expect(count('preview')).toBe(slugs.length);
    });
    it('imports demos only from the package entry, Solid, or the doc model', () => {
        for (const match of sources.matchAll(/from '([^']+)'/g)) {
            expect(['solid-silicone', 'solid-js', './doc-model']).toContain(match[1]);
        }
    });
});
