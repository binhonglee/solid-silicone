/**
 * `<EmptyState>` — the shared "nothing here" placeholder.
 *
 * Lists, overlays, and panels render this instead of a per-surface
 * `*-empty` div so empty states read the same everywhere. Styling lives on
 * the `.empty-state` class in `assets/webview/style.css`; the optional extra
 * `class` keeps a surface's historical `*-empty` selector hook alive.
 */
import type { JSX } from 'solid-js';

export function EmptyState(props: { children: JSX.Element; class?: string; id?: string }): JSX.Element {
    return (
        <div id={props.id} class={props.class ? `empty-state ${props.class}` : 'empty-state'}>
            {props.children}
        </div>
    );
}
