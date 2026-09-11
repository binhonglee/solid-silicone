/** Package manifest stays publishable and single-runtime safe. */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(join(here, '..', 'package.json'), 'utf8')) as {
    name?: string;
    version?: string;
    license?: string;
    files?: string[];
    peerDependencies?: Record<string, string>;
    exports?: Record<string, unknown>;
};

describe('package manifest', () => {
    it('identifies the published package', () => {
        expect(manifest.name).toBe('solid-silicone');
        expect(manifest.version).toMatch(/^\d+\.\d+\.\d+$/);
        expect(manifest.license).toBe('MIT');
        expect(manifest.files).toContain('dist');
    });
    it('keeps solid-js a peer dependency (one runtime per host app)', () => {
        expect(manifest.peerDependencies?.['solid-js']).toMatch(/1\.9/);
    });
    it('exposes the component, style, icon, scheme, and metadata entries', () => {
        const keys = Object.keys(manifest.exports ?? {});
        for (const key of ['.', './styles.css', './gitIcons', './schemes/*', './package.json']) {
            expect(keys).toContain(key);
        }
    });
});
