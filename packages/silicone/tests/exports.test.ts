/**
 * Export surface guard: every public name defined in a component or theme
 * module must be re-exported from the package index, so no primitive is
 * accidentally unimportable (the RadioGroup incident class).
 *
 * Fully static (reads source text, never imports .tsx) so it runs in the
 * node test environment without a DOM or JSX runtime.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = join(here, '..', 'src');
const indexSrc = readFileSync(join(srcDir, 'index.ts'), 'utf8');

// Modules re-exported wholesale: every name they define counts as covered.
const starModules = new Set(
    [...indexSrc.matchAll(/export\s+\*\s+from\s+'([^']+)'/g)].map((m) => m[1].replace(/^\.\//, '')),
);

function moduleCoveredByStar(dir: string, file: string): boolean {
    const base = file.replace(/\.(tsx|ts)$/, '');
    return starModules.has(`${dir}/${base}`);
}

function exportedNames(source: string): string[] {
    const names: string[] = [];
    const direct = /export\s+(?:async\s+)?(?:function|const|class|interface|type|enum)\s+(\w+)/g;
    let match: RegExpExecArray | null;
    while ((match = direct.exec(source)) !== null) {
        names.push(match[1]);
    }
    const grouped = /export\s*\{([^}]+)\}/g;
    while ((match = grouped.exec(source)) !== null) {
        for (const part of match[1].split(',')) {
            // Inline type modifiers (`export { type Foo }`) and aliases.
            const name = part.trim().replace(/^type\s+/, '').split(/\s+as\s+/).pop()?.trim();
            if (name) {
                names.push(name);
            }
        }
    }
    return [...new Set(names)];
}

describe('package export surface', () => {
    it('re-exports every component and theme definition', () => {
        const missing: string[] = [];
        for (const dir of ['components', 'theme']) {
            for (const file of readdirSync(join(srcDir, dir))) {
                if (!file.endsWith('.tsx') && !file.endsWith('.ts')) {
                    continue;
                }
                if (moduleCoveredByStar(dir, file)) {
                    continue;
                }
                const source = readFileSync(join(srcDir, dir, file), 'utf8');
                for (const name of exportedNames(source)) {
                    if (!new RegExp(`\\b${name}\\b`).test(indexSrc)) {
                        missing.push(`${dir}/${file}:${name}`);
                    }
                }
            }
        }
        expect(missing).toEqual([]);
    });
    it('never resurrects the removed Select primitive', () => {
        const inputs2Export = indexSrc.split('\n').find((line) => line.includes('./components/inputs2'));
        expect(inputs2Export).toBeDefined();
        expect(inputs2Export).not.toMatch(/\bSelect\b/);
    });
});
