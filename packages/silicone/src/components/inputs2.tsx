/** Inputs round 2: Switch, Radio, RadioGroup, Slider. */
import { splitProps } from 'solid-js';
import type { JSX } from 'solid-js';
import { Button, ButtonGroup } from './Button';

export function Switch(props: JSX.InputHTMLAttributes<HTMLInputElement> & { label?: JSX.Element }): JSX.Element {
    const [local, rest] = splitProps(props, ['class', 'label']);
    return (
        <label class={local.class ? `si-switch ${local.class}` : 'si-switch'}>
            <input type="checkbox" role="switch" {...rest} />
            <span class="si-switch-track" aria-hidden="true"><span class="si-switch-thumb" aria-hidden="true" /></span>
            {local.label !== undefined && <span class="si-switch-label">{local.label}</span>}
        </label>
    );
}

export function Radio(props: JSX.InputHTMLAttributes<HTMLInputElement> & { label: JSX.Element }): JSX.Element {
    const [local, rest] = splitProps(props, ['class', 'label']);
    return (
        <label class={local.class ? `si-radio ${local.class}` : 'si-radio'}>
            <input type="radio" {...rest} />
            <span>{local.label}</span>
        </label>
    );
}

export function RadioGroup(props: { children: JSX.Element; class?: string; label?: string }): JSX.Element {
    return (
        <div class={props.class ? `si-radio-group ${props.class}` : 'si-radio-group'} role="radiogroup" aria-label={props.label}>
            {props.children}
        </div>
    );
}

export function Slider(props: JSX.InputHTMLAttributes<HTMLInputElement>): JSX.Element {
    const [local, rest] = splitProps(props, ['class']);
    return <input type="range" {...rest} class={local.class ? `si-slider ${local.class}` : 'si-slider'} />;
}

export function SegmentedControl<T extends string>(props: { options: readonly { value: T; label: string }[]; value: T; onChange: (value: T) => void; label?: string }): JSX.Element {
    return (
        <ButtonGroup aria-label={props.label}>
            {props.options.map((opt) => (
                <Button segment active={opt.value === props.value} aria-pressed={opt.value === props.value} onClick={() => props.onChange(opt.value)}>
                    {opt.label}
                </Button>
            ))}
        </ButtonGroup>
    );
}

/** File input styling hook: the native input keeps behavior; the class carries the shared chrome. */
export function FileInput(props: JSX.InputHTMLAttributes<HTMLInputElement>): JSX.Element {
    const [local, rest] = splitProps(props, ['class']);
    return <input type="file" {...rest} class={local.class ? `si-file-input ${local.class}` : 'si-file-input'} />;
}
