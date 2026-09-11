/** Floating/expandable: Tooltip, Popover, Accordion. Presentational; owners keep open state (same contract as Menu). */
import { Show, createSignal } from 'solid-js';
import type { JSX } from 'solid-js';
import { Chevron } from './icons';

export function Tooltip(props: { tip: string; children: JSX.Element }): JSX.Element {
    return (
        <span class="si-tooltip-wrap">
            {props.children}
            <span class="si-tooltip" role="tooltip">{props.tip}</span>
        </span>
    );
}

export function Popover(props: { open: boolean; children: JSX.Element; class?: string }): JSX.Element {
    return (
        <Show when={props.open}>
            <div class={props.class ? `si-popover ${props.class}` : 'si-popover'} role="dialog">{props.children}</div>
        </Show>
    );
}

export function Accordion(props: { title: JSX.Element; children: JSX.Element; open?: boolean }): JSX.Element {
    const [open, setOpen] = createSignal(props.open ?? false);
    return (
        <div class="si-accordion">
            <button type="button" class="si-accordion-trigger" aria-expanded={open()} onClick={() => setOpen((v) => !v)}>
                <Chevron size={10} class={open() ? 'expanded' : undefined} />
                {props.title}
            </button>
            <Show when={open()}><div class="si-accordion-panel">{props.children}</div></Show>
        </div>
    );
}
