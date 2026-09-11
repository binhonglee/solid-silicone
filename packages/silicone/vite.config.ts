import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
    plugins: [solid()],
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'SolidSilicone',
            formats: ['es', 'cjs'],
            fileName: (format) => (format === 'es' ? 'solid-silicone.js' : 'solid-silicone.cjs'),
        },
        rollupOptions: {
            external: ['solid-js', 'solid-js/web', 'solid-js/store'],
        },
    },
});
