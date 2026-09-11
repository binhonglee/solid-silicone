/** clampSplitWidth keeps both panes usable at any container size. */
import { describe, expect, it } from 'vitest';
import { clampSplitWidth, drawerMediaQuery } from '../src/components/SplitPane';

describe('clampSplitWidth', () => {
    it('passes sane widths through', () => {
        expect(clampSplitWidth(280, 200, 200, 1000)).toBe(280);
    });
    it('clamps to the sized minimum', () => {
        expect(clampSplitWidth(50, 200, 200, 1000)).toBe(200);
    });
    it('clamps to container minus the other minimum', () => {
        expect(clampSplitWidth(900, 200, 200, 1000)).toBe(800);
    });
    it('honors an explicit maximum', () => {
        expect(clampSplitWidth(900, 200, 200, 2000, 640)).toBe(640);
    });
    it('never inverts when the container is tiny', () => {
        expect(clampSplitWidth(100, 200, 200, 100)).toBe(200);
    });
    it('falls back for garbage input', () => {
        expect(clampSplitWidth(NaN, 200, 200, 1000)).toBe(200);
    });
});

describe('drawerMediaQuery', () => {
    it('activates below the breakpoint width', () => {
        expect(drawerMediaQuery(760)).toBe('(max-width: 760px)');
        expect(drawerMediaQuery(1024)).toBe('(max-width: 1024px)');
    });
});
