/**
 * `<DisclosureButton>` — the expand/collapse chevron button.
 *
 * Every expandable row (stash entries, stash/reflog files, reflog groups, …)
 * renders this instead of a hand-rolled chevron button, so the hit target,
 * rotation transition, and aria wiring stay consistent. Styling lives on the
 * shared `.disclosure-toggle` class; the chevron points right and rotates 90°
 * when `expanded`. Historical per-surface classes stay on as selector hooks.
 */
import { splitProps } from 'solid-js';
import type { JSX } from 'solid-js';
import { Chevron } from './icons';

export interface DisclosureButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    expanded: boolean;
    /** Accessible label (also the tooltip). */
    label?: string;
    /** Chevron size in px (default 16). */
    chevronSize?: number;
}

export function DisclosureButton(props: DisclosureButtonProps): JSX.Element {
    const [local, rest] = splitProps(props, ['expanded', 'label', 'chevronSize', 'class']);
    const classes = (): string => {
        const parts = ['disclosure-toggle'];
        if (local.expanded) {parts.push('expanded');}
        if (local.class) {parts.push(local.class);}
        return parts.join(' ');
    };
    return (
        <button
            type="button"
            {...rest}
            class={classes()}
            aria-expanded={local.expanded ? 'true' : 'false'}
            aria-label={local.label}
            title={local.label}
        >
            <Chevron size={local.chevronSize ?? 16} />
        </button>
    );
}
