/** Highlighted code block for docs snippets (usage, install). */
import type { JSX } from 'solid-js';
import hljs from 'highlight.js/lib/core';
import type { HLJSApi, Language, Mode } from 'highlight.js';
import bash from 'highlight.js/lib/languages/bash';
import typescript from 'highlight.js/lib/languages/typescript';

/**
 * Minimal TSX grammar: the typescript grammar plus a tag mode, so JSX
 * markup highlights as tags instead of operators. Attribute `{...}`
 * expressions recurse into full TypeScript (nested braces included), and
 * nested components inside expressions highlight too.
 *
 * Two sharp edges, both handled:
 * - TypeScript's operator mode is begin-only (no end, no scope): it swallows
 *   the rest of the input into its own `contains`, so any JSX after `; + ,
 *   = ( {` never matches the tag. It contributes no spans itself, so it is
 *   filtered out (regex literals after `=` highlight as plain text instead;
 *   no snippet needs them). If a future highlight.js reshapes that mode and
 *   the find below misses, highlighting degrades to plain TypeScript.
 * - The tag requires a name (`<>`, `</>`, or `<Name`), so a `<` comparison
 *   inside an expression never false-matches.
 */
function tsxLanguage(hljsApi: HLJSApi): Language {
    const ts = hljsApi.getLanguage('typescript');
    const baseContains = (ts.contains ?? []).filter(
        (m) => !(m.scope === undefined && typeof m.begin === 'string' && m.begin.includes('|;|')),
    );
    const expression: Mode = {
        begin: /\{/,
        end: /\}/,
        keywords: ts.keywords,
        contains: [],
    };
    const tag: Mode = {
        scope: 'tag',
        begin: /<>|<\/>|<\/?[A-Za-z][A-Za-z0-9._:-]*/,
        end: /\/?>/,
        contains: [
            { scope: 'attr', begin: /[A-Za-z0-9._:-]+/, relevance: 0 },
            { scope: 'string', begin: /"/, end: /"/ },
            { scope: 'string', begin: /'/, end: /'/ },
            expression,
        ],
    };
    expression.contains = [tag, ...baseContains, expression];
    return {
        name: 'TSX',
        keywords: ts.keywords,
        contains: [tag, ...baseContains],
    };
}

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('tsx', tsxLanguage);

function escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default function CodeBlock(props: { code: string; language: string }): JSX.Element {
    const html = (): string => {
        try {
            return hljs.highlight(props.code, { language: props.language }).value;
        } catch {
            return escapeHtml(props.code);
        }
    };
    return (
        <pre class="si-docs-code"><code class={`hljs language-${props.language}`} innerHTML={html()} /></pre>
    );
}
