/** Unit tests for the SearchOverlay pure helpers (filter plus index step). */
import { describe, expect, it } from 'vitest';
import { filterSearchItems, moveSearchIndex } from '../src/components/SearchOverlay';
import type { SearchOverlayItem } from '../src/components/SearchOverlay';

const ITEMS: SearchOverlayItem[] = [
    { value: 'button', label: 'Button', hint: 'Actions', keywords: 'btn press' },
    { value: 'search-field', label: 'SearchField', hint: 'Forms' },
    { value: 'search-overlay', label: 'SearchOverlay', hint: 'Menus & Overlays' },
];

describe('filterSearchItems', () => {
    it('returns every item for an empty query', () => {
        expect(filterSearchItems(ITEMS, '')).toHaveLength(3);
        expect(filterSearchItems(ITEMS, '   ')).toHaveLength(3);
    });
    it('returns nothing for an empty query when show-all is off', () => {
        expect(filterSearchItems(ITEMS, '', false)).toHaveLength(0);
    });
    it('matches case-insensitively across label, hint, and keywords', () => {
        expect(filterSearchItems(ITEMS, 'search').map((i) => i.value)).toEqual(['search-field', 'search-overlay']);
        expect(filterSearchItems(ITEMS, 'BTN').map((i) => i.value)).toEqual(['button']);
        expect(filterSearchItems(ITEMS, 'overlays').map((i) => i.value)).toEqual(['search-overlay']);
    });
    it('requires every word to match', () => {
        expect(filterSearchItems(ITEMS, 'search forms').map((i) => i.value)).toEqual(['search-field']);
        expect(filterSearchItems(ITEMS, 'search nothing-here')).toHaveLength(0);
    });
});

describe('moveSearchIndex', () => {
    it('clamps at both ends', () => {
        expect(moveSearchIndex(0, -1, 3)).toBe(0);
        expect(moveSearchIndex(2, 1, 3)).toBe(2);
    });
    it('steps inside the range', () => {
        expect(moveSearchIndex(0, 1, 3)).toBe(1);
        expect(moveSearchIndex(2, -1, 3)).toBe(1);
    });
    it('returns zero for an empty list', () => {
        expect(moveSearchIndex(0, 1, 0)).toBe(0);
    });
});
