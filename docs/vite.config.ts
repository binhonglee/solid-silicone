import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const siliconeSrc = fileURLToPath(new URL('../packages/silicone/src/index.ts', import.meta.url));
const siliconeCss = fileURLToPath(new URL('../packages/silicone/src/styles/all.css', import.meta.url));

export default defineConfig({
    plugins: [solid()],
    base: './',
    build: { outDir: 'dist' },
    resolve: {
        // One solid-js runtime for the whole bundle. Without this the docs
        // sources and the aliased library sources resolve their own nested
        // solid-js copies; signals then stop crossing the boundary (overlays
        // never open) and ref/effect ordering breaks on first mount.
        dedupe: ['solid-js'],
        // Point the docs app at package source so `npm run dev` works with
        // no prior `npm run build --workspace=solid-silicone`. Production
        // consumers still resolve `dist` through the package exports map.
        alias: [
            { find: /^solid-silicone$/, replacement: siliconeSrc },
            { find: /^solid-silicone\/styles\.css$/, replacement: siliconeCss },
        ],
    },
});
