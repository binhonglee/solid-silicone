/**
 * `<OverlayHost>` — the shared overlay container ("island" root).
 *
 * Every overlay island renders one of these as its `#{id}` container. It owns
 * the container-level concerns that used to be copy-pasted per overlay:
 *
 * - the `.overlay-host` class (fullscreen absolute layer, flex-centering the
 *   panel; per-overlay CSS only sets `z-index`), and
 * - toggling the container's inline `display` between `none` and `flex` from
 *   the overlay's reactive open signal (inline style, because frozen selector
 *   tests and the legacy contract read `el.style.display`).
 *
 * Children are the overlay's inner shell — usually an `<Overlay>`.
 *
 * The display toggle is a declarative style binding (not a ref plus effect),
 * so it never depends on ref/effect ordering: the compiler may flush the
 * open signal before element refs resolve, which threw on first mount.
 */
import type { JSX } from 'solid-js';

export interface OverlayHostProps {
    /** Container id, e.g. "diff-overlay". */
    id: string;
    /** Reactive open state; drives the container's inline display toggle. */
    open: () => boolean;
    /** Extra class appended after `overlay-host`. */
    class?: string;
    /** Receives the container element (for overlays that need the node). */
    hostRef?: (el: HTMLDivElement) => void;
    children: JSX.Element;
}

export function OverlayHost(props: OverlayHostProps): JSX.Element {
    return (
        <div
            id={props.id}
            class={props.class ? `overlay-host ${props.class}` : 'overlay-host'}
            style={{ display: props.open() ? 'flex' : 'none' }}
            ref={(element) => {
                props.hostRef?.(element);
            }}
        >
            {props.children}
        </div>
    );
}
