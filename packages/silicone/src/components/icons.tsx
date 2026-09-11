/**
 * Solid Silicone icon set — the single home for every reusable SVG glyph.
 *
 * Before this module the same glyphs were hand-inlined across the render and
 * shell trees: the worktree mark lived in five files, the branch mark in four,
 * the AI "sparkle" in four, and there were three different gears and two
 * different refresh/search icons that had quietly drifted apart. Everything now
 * has exactly one definition here so a glyph looks the same everywhere and is
 * changed in one place.
 *
 * Conventions:
 * - Each icon is a presentational SolidJS component taking `size` (square,
 *   sets width+height) and an optional `class` selector hook. Icons are
 *   decorative (`aria-hidden`); the accessible label belongs on the button or
 *   control that wraps them.
 * - `currentColor` throughout, so an icon inherits its context's text color.
 * - Two visual families coexist on purpose: compact filled/stroked 16px marks
 *   for inline UI, and the larger 24px line-art marks used by the activity
 *   rail (grouped under "Activity rail icons" below).
 *
 * Carets are still role-based (see AGENTS.md): `<DropdownArrow>` (in Menu.tsx)
 * for menu triggers and `<Chevron>` for in-place disclosure. The `Triangle*`
 * marks here are the solid graph-expander glyphs, not general-purpose carets.
 */
import type { JSX } from 'solid-js';

export interface IconProps {
    /** Square size in px (sets both width and height). */
    size?: number;
    /** Extra class(es) — selector hook / positioning, not restyling. */
    class?: string;
}

// --- Close / carets / plus ------------------------------------------------

/** The X close/dismiss mark. */
export function Close(props: IconProps): JSX.Element {
    return (
        <svg width={props.size ?? 12} height={props.size ?? 12} viewBox="0 0 64 64" class={props.class} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <line x1="0" y1="0" x2="64" y2="64" stroke="currentColor" stroke-width="12" stroke-linecap="round" />
            <line x1="64" y1="0" x2="0" y2="64" stroke="currentColor" stroke-width="12" stroke-linecap="round" />
        </svg>
    );
}

/** Right-pointing disclosure chevron (rotated 90° by callers when expanded). */
export function Chevron(props: IconProps): JSX.Element {
    return (
        <svg width={props.size ?? 10} height={props.size ?? 10} viewBox="0 0 10 10" fill="none" class={props.class} aria-hidden="true"><path d="M3.5 2L7 5L3.5 8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>
    );
}

/** Down-pointing chevron used by expand-in-place rows that rotate on open. */
export function ChevronDown(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 24 24" width={props.size ?? 14} height={props.size ?? 14} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={props.class} aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

/** Plus / add. */
export function Plus(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 16 16" width={props.size ?? 14} height={props.size ?? 14} fill="currentColor" class={props.class} aria-hidden="true">
            <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2z" />
        </svg>
    );
}

// --- Git objects ----------------------------------------------------------








// --- Actions --------------------------------------------------------------

/** AI "sparkle" — the assist/generate mark. */
export function Sparkle(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 16 16" width={props.size ?? 12} height={props.size ?? 12} class={props.class} aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" d="M8 1.5L9.5 6 14 8l-4.5 2L8 14.5 6.5 10 2 8l4.5-2z" />
        </svg>
    );
}

/** Refresh — the canonical circular-arrow. Add a spin class to animate. */
export function Refresh(props: IconProps): JSX.Element {    return (
        <svg viewBox="0 0 24 24" width={props.size ?? 14} height={props.size ?? 14} fill="none" class={props.class} aria-hidden="true">
            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.8273 3 17.3387 4.3036 19 6.31579" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M16 7L20 8L21 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
}

/** Search — magnifying glass. */
export function Search(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 16 16" width={props.size ?? 14} height={props.size ?? 14} class={props.class} aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M7 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM10.5 10.5 14 14" />
        </svg>
    );
}

/** Settings — gear. */
export function Settings(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 16 16" width={props.size ?? 14} height={props.size ?? 14} class={props.class} aria-hidden="true">
            <path fill="currentColor" d="M9.1 4.4L8.6 2H7.4l-.5 2.4l-.7.3l-2-1.3l-.9.8l1.3 2l-.2.7l-2.4.5v1.2l2.4.5l.3.8-1.3 2l.8.8l2-1.3l.8.3l.4 2.3h1.2l.5-2.4l.8-.3l2 1.3l.8-.8-1.3-2l.3-.8l2.3-.4V7.4l-2.4-.5l-.3-.8l1.3-2l-.8-.8-2 1.3zM9.4 8a1.4 1.4 0 1 1-2.8 0a1.4 1.4 0 0 1 2.8 0" />
        </svg>
    );
}

/** Overflow "hamburger" menu — three bars. */
export function MenuBars(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 24 24" width={props.size ?? 14} height={props.size ?? 14} fill="currentColor" class={props.class} aria-hidden="true">
            <path d="M4 7h16v2H4V7zm0 4h16v2H4v-2zm0 4h16v2H4v-2z" />
        </svg>
    );
}

/** Favorite/star. Pass `filled` for the "on" state. */
export function Star(props: IconProps & { filled?: boolean }): JSX.Element {
    return (
        <svg viewBox="0 0 16 16" width={props.size ?? 12} height={props.size ?? 12} fill={props.filled ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.5" class={props.class} aria-hidden="true">
            <path d="M8 1.5l2.1 4.2 4.6.7-3.3 3.2.8 4.6L8 12l-4.2 2.2.8-4.6-3.3-3.2 4.6-.7L8 1.5z" />
        </svg>
    );
}

// --- Sync / transfer ------------------------------------------------------





// --- Status ---------------------------------------------------------------

/** Filled info circle. */
export function InfoCircle(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 24 24" width={props.size ?? 16} height={props.size ?? 16} fill="currentColor" class={props.class} aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
    );
}

/** Filled warning triangle. */
export function Warning(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 24 24" width={props.size ?? 14} height={props.size ?? 14} fill="currentColor" class={props.class} aria-hidden="true">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
    );
}

/** Filled check-in-circle — the ref "in sync" badge glyph. */
export function CheckCircle(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 16 16" width={props.size ?? 9} height={props.size ?? 9} fill="currentColor" class={props.class} aria-hidden="true"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.78 5.97-4.5 4.5a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.47 3.97-3.97a.75.75 0 1 1 1.06 1.06z" /></svg>
    );
}

/** Plain checkmark — the checked state of toggle menu items. */
export function Check(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 16 16" width={props.size ?? 12} height={props.size ?? 12} fill="none" class={props.class} aria-hidden="true">
            <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
}

// --- Graph expanders (solid triangles) ------------------------------------

/** Solid up-triangle (graph "show above"). */
export function TriangleUp(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 16 16" width={props.size ?? 12} height={props.size ?? 12} fill="currentColor" class={props.class} aria-hidden="true">
            <path d="M8 4l-5 5h10L8 4z" />
        </svg>
    );
}

/** Solid down-triangle (graph "show below" / expand). */
export function TriangleDown(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 16 16" width={props.size ?? 12} height={props.size ?? 12} fill="currentColor" class={props.class} aria-hidden="true">
            <path d="M8 12l5-5H3l5 5z" />
        </svg>
    );
}

/** GitHub brand mark for repository links. */
export function GitHub(props: IconProps): JSX.Element {
    return (
        <svg viewBox="0 0 24 24" width={props.size ?? 14} height={props.size ?? 14} fill="currentColor" class={props.class} aria-hidden="true">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    );
}

// --- Product icons (GitGraph, Files, Entire, Terminal, Settings rail, window controls) stay in the host app. They are product chrome, not generic primitives. No new generic glyphs below this line.
