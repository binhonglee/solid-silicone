/** Concatenate style layers into dist/silicone.css plus copy schemes/typography. */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, '..', 'src', 'styles');
const dist = join(here, '..', 'dist');
mkdirSync(join(dist, 'schemes'), { recursive: true });
mkdirSync(join(dist, 'typography'), { recursive: true });

const parts = ['tokens.css', 'silicone.css', 'new_components.css', 'markdown.css', 'on-success.css'].map((f) =>
    readFileSync(join(src, f), 'utf8'),
);
writeFileSync(join(dist, 'silicone.css'), parts.join('\n'));
for (const f of ['tokens.css', 'markdown.css', 'new_components.css', 'on-success.css']) {
    copyFileSync(join(src, f), join(dist, f));
}
for (const dir of ['schemes', 'typography']) {
    const { readdirSync } = await import('node:fs');
    for (const f of readdirSync(join(src, dir))) {
        copyFileSync(join(src, dir, f), join(dist, dir, f));
    }
}
console.log('silicone.css built');
