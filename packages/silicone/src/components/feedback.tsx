/** Feedback: Alert, Toast, Progress, Skeleton. */
import { Show, splitProps } from 'solid-js';
import type { JSX } from 'solid-js';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export function Alert(props: { tone?: AlertTone; title?: JSX.Element; children: JSX.Element; class?: string }): JSX.Element {
    return (
        <div class={props.class ? `si-alert si-alert-${props.tone ?? 'info'} ${props.class}` : `si-alert si-alert-${props.tone ?? 'info'}`} role="alert">
            <Show when={props.title !== undefined}><div class="si-alert-title">{props.title}</div></Show>
            <div class="si-alert-body">{props.children}</div>
        </div>
    );
}

export function Toast(props: { title?: JSX.Element; children?: JSX.Element; class?: string; onClose?: () => void }): JSX.Element {
    const [local, rest] = splitProps(props, ['class', 'title', 'children', 'onClose']);
    return (
        <div class={local.class ? `si-toast ${local.class}` : 'si-toast'} role="status" {...rest}>
            {local.title !== undefined && <div class="si-toast-title">{local.title}</div>}
            {local.children}
            {local.onClose !== undefined && (
                <button type="button" class="si-toast-close" aria-label="Dismiss" onClick={() => local.onClose?.()}>×</button>
            )}
        </div>
    );
}

export function Progress(props: { value: number; max?: number; class?: string; label?: string }): JSX.Element {
    const max = (): number => props.max ?? 100;
    const pct = (): number => Math.min(100, Math.max(0, (props.value / max()) * 100));
    return (
        <div class={props.class ? `si-progress ${props.class}` : 'si-progress'} role="progressbar" aria-valuenow={props.value} aria-valuemin={0} aria-valuemax={max()} aria-label={props.label}>
            <div class="si-progress-bar" style={{ width: `${pct()}%` }} />
        </div>
    );
}

export function Skeleton(props: { class?: string; width?: string; height?: string }): JSX.Element {
    return <div class={props.class ? `si-skeleton ${props.class}` : 'si-skeleton'} aria-hidden="true" style={{ width: props.width, height: props.height }} />;
}
