import { defineConfig } from 'vitest/config';

export default defineConfig({
    // Vitest 5 (vite 8/oxc) honors tsconfig `jsx: preserve`, so .tsx imports
    // arrive untransformed. Compile JSX with the automatic runtime against
    // solid-js instead: these node-env tests exercise pure helpers only and
    // never mount components, so no DOM is needed.
    oxc: { jsx: { runtime: 'automatic', importSource: 'solid-js' } },
    test: {
        environment: 'node',
        include: ['tests/**/*.test.ts'],
    },
});
