/**
 * `<SearchField>` — the design-system search box.
 *
 * One bordered box shared by the Files, Settings, and Entire search bars: a
 * leading search icon, a transparent borderless input, and an optional
 * trailing slot for controls (a clear button, a mode toggle). Focus-within
 * shows the shared glow (see "Design system: search field" in
 * `assets/webview/style.css`).
 *
 * Like the other form primitives it is deliberately thin: input attributes
 * pass straight through to the `<input>`, so a signal seeds `value`, `onInput`
 * writes back, and handlers read the live value. `containerClass`/`class` are
 * selector hooks (tests, per-surface sizing), not restyling points.
 */
import { splitProps } from 'solid-js';
import type { JSX } from 'solid-js';
import { Search } from './icons';

export interface SearchFieldProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
    /** Extra class on the wrapping box — sizing/positioning hook only. */
    containerClass?: string;
    /** Reactive modifiers on the wrapping box (e.g. an active-search flag). */
    containerClassList?: Record<string, boolean | undefined>;
    /** Trailing controls after the input (clear button, mode toggle). */
    trailing?: JSX.Element;
    /** Leading icon size in px (default 13). */
    iconSize?: number;
}

export function SearchField(props: SearchFieldProps): JSX.Element {
    const [local, rest] = splitProps(props, [
        'containerClass',
        'containerClassList',
        'trailing',
        'iconSize',
        'class',
        'type',
        'onKeyDown',
    ]);

    // Run the caller's key handler first (clear-on-Escape, submit-on-Enter),
    // then unfocus the field on Escape so the shortcut always drops focus.
    const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (event) => {
        const handler = local.onKeyDown;
        if (Array.isArray(handler)) {
            (handler[0] as (data: unknown, event: KeyboardEvent) => void)(handler[1], event);
        } else if (typeof handler === 'function') {
            (handler as (event: KeyboardEvent) => void)(event);
        }
        if (event.key === 'Escape' && !event.defaultPrevented) {
            event.currentTarget.blur();
        }
    };

    return (
        <div
            class={local.containerClass ? `search-field ${local.containerClass}` : 'search-field'}
            classList={local.containerClassList ?? {}}
            role="search"
        >
            <span class="search-field-icon">
                <Search size={local.iconSize ?? 13} />
            </span>
            <input
                type={local.type ?? 'text'}
                {...rest}
                onKeyDown={onKeyDown}
                class={local.class ? `search-field-input ${local.class}` : 'search-field-input'}
            />
            {local.trailing}
        </div>
    );
}
