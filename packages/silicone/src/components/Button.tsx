/**
 * `<Button>` / `<ButtonGroup>` — the design-system buttons.
 *
 * Every action button renders through `<Button>` so padding, radius, variant
 * colors, hover, and disabled treatment stay consistent. Styling lives on the
 * shared `.btn*` classes in `assets/webview/style.css`; call sites pick a
 * `variant` (and optionally `size`) instead of styling buttons ad hoc. An
 * extra `class` is allowed only as a selector hook (ids/classes that existing
 * CSS layout, tests, or delegated handlers key off), never to restyle.
 *
 * `<ButtonGroup>` is the segmented-control wrapper (`.btn-group`); its
 * children are plain buttons with the `.btn-segment` class, typically
 * rendered via `<Button segment active=...>`.
 */
import { splitProps } from 'solid-js';
import type { JSX } from 'solid-js';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Visual variant. Defaults to "secondary" (neutral action). */
    variant?: ButtonVariant;
    /** "sm" for compact row actions. */
    size?: 'sm';
    /** Render as a segment of a <ButtonGroup> instead of a standalone button. */
    segment?: boolean;
    /** Active state for segments. */
    active?: boolean;
}

export function Button(props: ButtonProps): JSX.Element {
    const [local, rest] = splitProps(props, ['variant', 'size', 'segment', 'active', 'class', 'classList']);
    const classes = (): string => {
        if (local.segment) {
            const seg = ['btn-segment'];
            if (local.active) {seg.push('active');}
            if (local.class) {seg.push(local.class);}
            return seg.join(' ');
        }
        const parts = ['btn', `btn-${local.variant ?? 'secondary'}`];
        if (local.size === 'sm') {parts.push('btn-sm');}
        if (local.class) {parts.push(local.class);}
        return parts.join(' ');
    };
    return <button type="button" {...rest} class={classes()} classList={local.classList} />;
}

export function ButtonGroup(props: { children: JSX.Element; class?: string; role?: JSX.HTMLAttributes<HTMLDivElement>['role']; 'aria-label'?: string }): JSX.Element {
    return (
        <div
            class={props.class ? `btn-group ${props.class}` : 'btn-group'}
            role={props.role}
            aria-label={props['aria-label']}
        >
            {props.children}
        </div>
    );
}
