/**
 * Visual regression: one viewport screenshot per docs page.
 *
 * Pages are crawled from the home index (no hardcoded slug list), rendered
 * with pinned test fonts (system stacks differ per OS), and diffed against
 * committed baselines. Regenerate with `npm run test:visual:update`.
 *
 * Tolerance is calibrated, not guessed: same-font cross-OS rasterization
 * noise measures ~0.02, a recolored hero card measures 0.13. The 0.03 gate
 * passes the former and fails the latter; sub-3% nudges (copy edits, 1px
 * shifts) are below what cross-OS pixel diffing can see. Mobile shots get
 * 0.06: the same absolute glyph noise over a 3x smaller viewport measured
 * 0.04.
 */
import { expect, test, type Page } from '@playwright/test';
import { visualTestFontCSS } from './fonts';

const SHOT = { animations: 'disabled' as const, maxDiffPixelRatio: 0.03 };
const MOBILE_SHOT = { animations: 'disabled' as const, maxDiffPixelRatio: 0.06 };

/** Inject test fonts and wait until they apply before shooting. */
async function settle(page: Page): Promise<void> {
    await page.addStyleTag({ content: visualTestFontCSS() });
    // fonts.ready alone is racy: faces load lazily on first use, so force
    // every face used by the docs and wait for all three explicitly.
    await page.evaluate(() =>
        Promise.all([
            document.fonts.load('400 12px VisualSans', 'x'),
            document.fonts.load('600 12px VisualSans', 'x'),
            document.fonts.load('400 12px VisualMono', 'x'),
        ]).then(() => undefined),
    );
    // Hard gate: a silent fallback-font shot would poison the baseline.
    expect(await page.evaluate(() => document.fonts.check('400 12px VisualSans'))).toBe(true);
}

async function shoot(page: Page, hash: string, name: string, shot = SHOT): Promise<void> {
    await page.goto(hash);
    await page.waitForLoadState('networkidle');
    await settle(page);
    await expect(page).toHaveScreenshot(name, shot);
}

test('home', async ({ page }) => {
    await shoot(page, '/#/', 'home.png');
});

test('component pages', async ({ page }) => {
    await page.goto('/#/');
    await page.waitForLoadState('networkidle');
    const slugs: string[] = await page.$$eval('.si-docs-index a', (links) =>
        [...new Set(links.map((a) => (a.getAttribute('href') ?? '').replace(/^#\//, '')).filter(Boolean))],
    );
    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
        await test.step(slug, async () => {
            await shoot(page, `/#/${slug}`, `${slug}.png`);
        });
    }
});

test('mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await shoot(page, '/#/', 'home-mobile.png', MOBILE_SHOT);
    await shoot(page, '/#/split-pane', 'split-pane-mobile.png', MOBILE_SHOT);
});
