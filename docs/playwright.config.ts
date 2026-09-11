import { defineConfig } from '@playwright/test';

/** Visual regression for the docs site. Serves the built bundle and
 * screenshots every component page; baselines live in __snapshots__. */
export default defineConfig({
    testDir: './tests/visual',
    snapshotPathTemplate: './tests/visual/__snapshots__/{arg}{ext}',
    workers: 1,
    timeout: 300_000,
    expect: { timeout: 10_000 },
    reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
    use: {
        baseURL: 'http://127.0.0.1:4173',
        viewport: { width: 1280, height: 800 },
    },
    webServer: {
        command: 'npm run preview -- --port 4173 --strictPort --host 127.0.0.1',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
