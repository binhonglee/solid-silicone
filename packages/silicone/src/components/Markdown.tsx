/**
 * `<Markdown>` — the design-system rendered-markdown box.
 *
 * Renders a safe subset (paragraphs, headings, bold, italic, inline code,
 * fenced code, links) with HTML escaped by default.
 * Styling lives on `.md-content` in `styles/markdown.css`.
 */
import type { JSX } from 'solid-js';

function escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderInline(text: string): string {
    let out = escapeHtml(text);
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/(^|\W)\*([^*\n]+)\*/g, '$1<em>$2</em>');
    out = out.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    out = out.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" rel="noreferrer">$1</a>');
    return out;
}

/** Minimal safe markdown renderer. Exported for tests. */
export function renderSimpleMarkdown(text: string): string {
    const lines = (text ?? '').split('\n');
    const blocks: string[] = [];
    let inFence = false;
    let fence: string[] = [];
    let para: string[] = [];
    const flushPara = (): void => {
        if (para.length > 0) {
            blocks.push(`<p>${renderInline(para.join(' '))}</p>`);
            para = [];
        }
    };
    for (const line of lines) {
        if (line.trim().startsWith('```')) {
            if (inFence) {
                blocks.push(`<pre><code>${escapeHtml(fence.join('\n'))}</code></pre>`);
                fence = [];
                inFence = false;
            } else {
                flushPara();
                inFence = true;
            }
            continue;
        }
        if (inFence) {
            fence.push(line);
            continue;
        }
        if (line.trim() === '') {
            flushPara();
            continue;
        }
        const heading = line.match(/^(#{1,3})\s+(.*)$/);
        if (heading) {
            flushPara();
            const level = heading[1].length;
            blocks.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
            continue;
        }
        para.push(line.trim());
    }
    if (inFence) {
        blocks.push(`<pre><code>${escapeHtml(fence.join('\n'))}</code></pre>`);
    }
    flushPara();
    return blocks.join('\n');
}

export function Markdown(props: {
    text: string;
    /** Extra classes (selector hook / layout, e.g. "scroll"). */
    class?: string;
    id?: string;
}): JSX.Element {
    return (
        <div
            id={props.id}
            class={props.class ? `md-content ${props.class}` : 'md-content'}
            innerHTML={renderSimpleMarkdown(props.text ?? '')}
        ></div>
    );
}
