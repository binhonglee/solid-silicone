/** Extended coverage for the safe markdown renderer. */
import { describe, expect, it } from 'vitest';
import { renderSimpleMarkdown } from '../src/components/Markdown';

describe('renderSimpleMarkdown blocks', () => {
    it('renders empty input as empty output', () => {
        expect(renderSimpleMarkdown('')).toBe('');
    });
    it('renders h2 and h3 headings', () => {
        expect(renderSimpleMarkdown('## Title')).toContain('<h2>Title</h2>');
        expect(renderSimpleMarkdown('### Title')).toContain('<h3>Title</h3>');
    });
    it('treats a hash without a space as a paragraph', () => {
        expect(renderSimpleMarkdown('#Hi')).toBe('<p>#Hi</p>');
    });
    it('joins consecutive lines into one paragraph', () => {
        expect(renderSimpleMarkdown('one\ntwo')).toBe('<p>one two</p>');
    });
    it('splits paragraphs on blank lines', () => {
        expect(renderSimpleMarkdown('one\n\ntwo')).toBe('<p>one</p>\n<p>two</p>');
    });
    it('renders fenced code blocks with escaped content', () => {
        const html = renderSimpleMarkdown('```bash\nnpm i x <y>\n```');
        expect(html).toContain('<pre><code>');
        expect(html).toContain('npm i x &lt;y&gt;');
        expect(html).not.toContain('<y>');
    });
    it('closes an unclosed fence at the end of input', () => {
        expect(renderSimpleMarkdown('```\ncode')).toContain('<pre><code>code</code></pre>');
    });
});

describe('renderSimpleMarkdown inline', () => {
    it('renders emphasis', () => {
        expect(renderSimpleMarkdown('*hi*')).toContain('<em>hi</em>');
    });
    it('escapes ampersands', () => {
        expect(renderSimpleMarkdown('a & b')).toContain('a &amp; b');
    });
    it('escapes HTML inside code spans', () => {
        const html = renderSimpleMarkdown('`<b>`');
        expect(html).toContain('<code>&lt;b&gt;</code>');
    });
    it('leaves non-http links as plain text', () => {
        const html = renderSimpleMarkdown('[x](javascript:alert(1))');
        expect(html).not.toContain('<a');
        expect(html).toContain('[x](');
    });
    it('renders inline code inside bold', () => {
        expect(renderSimpleMarkdown('**a `b` c**')).toContain('<strong>a <code>b</code> c</strong>');
    });
    it('renders heading inline markup', () => {
        expect(renderSimpleMarkdown('# **bold** head')).toContain('<h1><strong>bold</strong> head</h1>');
    });
});
