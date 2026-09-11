/**
 * Solid Silicone git icons — version-control glyphs split from the generic set.
 * Import only when the app needs them. Generic UI glyphs stay in `./icons`.
 * Product rail/window glyphs stay in the host app.
 */
import type { JSX } from 'solid-js';
import type { IconProps } from './icons';

/** Worktree — the branching/split-tree mark. */
export function Worktree(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 16 16" width={props.size ?? 14} height={props.size ?? 14} fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class={props.class} aria-hidden="true">
            <path d="M8 1v6M8 7L4 11M8 7l4 4M4 11v4M8 7v8M12 11v4" />
        </svg>
    );
}
/** Split the current pane vertically, placing the new pane to the right. */
export function SplitRight(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 16 16" width={props.size ?? 14} height={props.size ?? 14} fill="none" stroke="currentColor" stroke-width="1.25" class={props.class} aria-hidden="true">
            <rect x="1.5" y="2" width="13" height="12" rx="1.5" />
            <path d="M8 2v12M10.5 8h2M11.5 7v2" stroke-linecap="round" />
        </svg>
    );
}
/** Split the current pane horizontally, placing the new pane below. */
export function SplitDown(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 16 16" width={props.size ?? 14} height={props.size ?? 14} fill="none" stroke="currentColor" stroke-width="1.25" class={props.class} aria-hidden="true">
            <rect x="1.5" y="2" width="13" height="12" rx="1.5" />
            <path d="M1.5 8h13M7 11h2M8 10v2" stroke-linecap="round" />
        </svg>
    );
}
/** Branch — the fork/merge nodes mark. */
export function Branch(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 16 16" width={props.size ?? 14} height={props.size ?? 14} fill="currentColor" class={props.class} aria-hidden="true">
            <path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25z" />
        </svg>
    );
}
/** Tag. */
export function Tag(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 16 16" width={props.size ?? 14} height={props.size ?? 14} fill="currentColor" class={props.class} aria-hidden="true">
            <path d="M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.752 1.752 0 0 1 1 7.775zM6 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
        </svg>
    );
}
/** Repository — the bookmarked-book mark. */
export function Repo(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 16 16" width={props.size ?? 14} height={props.size ?? 14} fill="currentColor" class={props.class} aria-hidden="true">
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
        </svg>
    );
}
/** Stash — box with a plus. */
export function Stash(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 16 16" width={props.size ?? 14} height={props.size ?? 14} fill="currentColor" class={props.class} aria-hidden="true">
            <path d="M7.5 11.5v-3h-3v-1h3v-3h1v3h3v1h-3v3h-1zm-4.5-6h10v7h-10v-7zm1-1h8v-1h-8v1zm1-2h6v-1h-6v1z" />
        </svg>
    );
}
/** Push — cloud with an up arrow. */
export function Push(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 24 24" width={props.size ?? 16} height={props.size ?? 16} fill="currentColor" class={props.class} aria-hidden="true">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
        </svg>
    );
}
/** Pull — cloud with a down arrow. */
export function Pull(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 24 24" width={props.size ?? 14} height={props.size ?? 14} fill="currentColor" class={props.class} aria-hidden="true">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
        </svg>
    );
}
/** Download — tray with a down arrow (squash-into). */
export function Download(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 24 24" width={props.size ?? 16} height={props.size ?? 16} fill="currentColor" class={props.class} aria-hidden="true">
            <path d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z" />
        </svg>
    );
}
/** Small upload arrow over a bar — the ref "ahead/push" badge glyph. */
export function PushArrow(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 16 16" width={props.size ?? 9} height={props.size ?? 9} fill="currentColor" class={props.class} aria-hidden="true"><path d="M8 1.5 4.25 5.25l1.06 1.06L7.25 4.4V10h1.5V4.4l1.94 1.91 1.06-1.06L8 1.5zM3 12.5h10V14H3z" /></svg>
    );
}
