/**
 * `<TextInput>` / `<TextArea>` / `<Checkbox>` — the design-system form fields.
 *
 * Text fields render with the shared `.text-input` class (see "Design system:
 * text inputs" in `assets/webview/style.css`); search-in-toolbar fields use
 * `<input class="overlay-search-input">` via the overlay chrome instead.
 *
 * These are deliberately thin: the app's inputs use one-way seams (a signal
 * seeds `value`, `onInput` writes back, submit handlers read live values), so
 * the primitives only standardize classes/typing and pass everything else
 * through. An extra `class` is a selector hook, not a restyle.
 */
import { splitProps } from 'solid-js';
import type { JSX } from 'solid-js';

export function TextInput(props: JSX.InputHTMLAttributes<HTMLInputElement>): JSX.Element {
    const [local, rest] = splitProps(props, ['class', 'type']);
    return (
        <input
            type={local.type ?? 'text'}
            {...rest}
            class={local.class ? `text-input ${local.class}` : 'text-input'}
        />
    );
}

export function TextArea(props: JSX.TextareaHTMLAttributes<HTMLTextAreaElement>): JSX.Element {
    const [local, rest] = splitProps(props, ['class']);
    return <textarea {...rest} class={local.class ? `text-input ${local.class}` : 'text-input'} />;
}

export interface CheckboxProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
    /** Visible label text rendered next to the box. */
    label: JSX.Element;
    /** Extra class on the wrapping <label> (selector hook). */
    labelClass?: string;
}

export function Checkbox(props: CheckboxProps): JSX.Element {
    const [local, rest] = splitProps(props, ['label', 'labelClass']);
    return (
        <label class={local.labelClass ? `checkbox ${local.labelClass}` : 'checkbox'}>
            <input type="checkbox" {...rest} />
            <span>{local.label}</span>
        </label>
    );
}
