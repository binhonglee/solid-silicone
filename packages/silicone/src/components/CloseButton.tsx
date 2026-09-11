/**
 * `<CloseButton>` — THE close/dismiss button.
 *
 * Every dismissable surface (overlays, sidebar, toasts, inline "clear"
 * affordances) renders this instead of a hand-rolled `<button><Close/></button>`
 * so the icon, sizing, hover treatment, and aria wiring stay consistent with
 * zero per-call-site styling. Styling comes from the shared `.close-btn` class
 * in `assets/webview/style.css`; call sites may append an extra class only to
 * hook surface-specific selectors (tests, positioning), never to restyle the
 * button itself.
 */
import type { JSX } from 'solid-js';
import { Close } from './icons';

export interface CloseButtonProps {
    onClick: (event: MouseEvent) => void;
    /** Optional element id (existing selectors/tests key off per-surface ids). */
    id?: string;
    /** Accessible label + tooltip. Defaults to "Close". */
    label?: string;
    /** Extra class appended after `close-btn` (selector hooks only). */
    class?: string;
    /** Icon size in px (default 12, matching <Close/>). */
    size?: number;
}

export function CloseButton(props: CloseButtonProps): JSX.Element {
    const label = (): string => props.label ?? 'Close';
    return (
        <button
            type="button"
            id={props.id}
            class={props.class ? `close-btn ${props.class}` : 'close-btn'}
            title={label()}
            aria-label={label()}
            onClick={event => props.onClick(event)}
        >
            <Close size={props.size} />
        </button>
    );
}
