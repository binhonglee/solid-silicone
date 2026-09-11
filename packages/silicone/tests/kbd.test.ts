/** Chord splitters keep literal Plus keys distinct from join separators. */
import { describe, expect, it } from 'vitest';
import { splitChordAlternatives, splitChordKeys } from '../src/components/dataDisplay';

describe('splitChordKeys', () => {
    it('splits joins on plus', () => {
        expect(splitChordKeys('Ctrl+K')).toEqual(['Ctrl', 'K']);
    });
    it('keeps a lone plus as one key', () => {
        expect(splitChordKeys('+')).toEqual(['+']);
        expect(splitChordKeys('++')).toEqual(['+']);
    });
    it('reads a trailing plus as the Plus key', () => {
        expect(splitChordKeys('Ctrl++')).toEqual(['Ctrl', '+']);
    });
    it('reads a leading plus as the Plus key', () => {
        expect(splitChordKeys('+Ctrl')).toEqual(['+', 'Ctrl']);
    });
    it('drops empty chords', () => {
        expect(splitChordKeys('  ')).toEqual([]);
    });
});

describe('splitChordAlternatives', () => {
    it('splits on slash runs', () => {
        expect(splitChordAlternatives('Cmd+T / Ctrl+T')).toEqual(['Cmd+T', 'Ctrl+T']);
    });
    it('keeps single chords whole', () => {
        expect(splitChordAlternatives('Esc')).toEqual(['Esc']);
    });
});
