/** Unit tests for the Dropdown type-ahead matcher and open-scroll math. */
import { describe, expect, it } from 'vitest';
import { centeredScrollTop, findOptionByPrefix } from '../src/components/Dropdown';

const OPTIONS = [
    { value: 'main', label: 'main' },
    { value: 'develop', label: 'develop' },
    { value: 'feature/docs', label: 'feature/docs' },
] as const;

describe('findOptionByPrefix', () => {
    it('returns -1 for an empty prefix', () => {
        expect(findOptionByPrefix(OPTIONS, '')).toBe(-1);
    });
    it('matches the start of the label, case-insensitively', () => {
        expect(findOptionByPrefix(OPTIONS, 'd')).toBe(1);
        expect(findOptionByPrefix(OPTIONS, 'FEA')).toBe(2);
    });
    it('returns the first match and -1 when nothing matches', () => {
        expect(findOptionByPrefix(OPTIONS, 'f')).toBe(2);
        expect(findOptionByPrefix(OPTIONS, 'xyz')).toBe(-1);
    });
    it('does not match mid-label text', () => {
        expect(findOptionByPrefix(OPTIONS, 'evel')).toBe(-1);
    });
});

describe('centeredScrollTop', () => {
    it('centers an item below the fold', () => {
        // Panel viewport runs 100..300 (top 100, 1px border, height 200);
        // a 20px item at 400 lands with its center on the viewport center.
        expect(centeredScrollTop(0, 100, 1, 200, 400, 20)).toBe(209);
    });
    it('gives the same target for the same visual position when scrolled', () => {
        expect(centeredScrollTop(100, 100, 1, 200, 300, 20)).toBe(209);
    });
    it('subtracts the panel border', () => {
        expect(centeredScrollTop(0, 100, 0, 200, 400, 20)).toBe(210);
    });
    it('clamps the top end at zero', () => {
        expect(centeredScrollTop(0, 100, 1, 200, 105, 20)).toBe(0);
    });
});
