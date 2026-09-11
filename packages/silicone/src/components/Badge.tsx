/**
 * `<Badge>` — the small status pill.
 *
 * Shared geometry for every badge/pill (worktree main/active, file status
 * letters, reflog action tags, push state). Base look comes from the
 * `.badge` class (VS Code badge colors); surfaces layer their semantic
 * color/shape variants through their historical class, which stays on as a
 * modifier — but the size/padding/radius/typography come from here.
 */
import type { JSX } from 'solid-js';

export function Badge(props: {
    children: JSX.Element;
    class?: string;
    id?: string;
    title?: string;
    /** Reactive class toggles (e.g. worktree main/active) — passed through. */
    classList?: { [key: string]: boolean | undefined };
    /** Inline style passthrough (e.g. show/hide toggles owned by the caller). */
    style?: JSX.CSSProperties | string;
    /** Click handler for badges that navigate (e.g. ref badges). */
    onClick?: (event: MouseEvent) => void;
    /** Selector hooks preserved from historical badge markup. */
    dataRef?: string;
    dataTag?: string;
}): JSX.Element {
    return (
        <span
            id={props.id}
            class={props.class ? `badge ${props.class}` : 'badge'}
            classList={props.classList}
            style={props.style}
            title={props.title}
            data-ref={props.dataRef}
            data-tag={props.dataTag}
            onClick={props.onClick}
        >
            {props.children}
        </span>
    );
}
