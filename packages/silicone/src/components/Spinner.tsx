/**
 * `<Spinner>` — the loading spinner.
 *
 * One `.spinner` class + one `ds-spin` keyframes for every busy indicator
 * (button loading states, hydration placeholders). Inherits `currentColor`,
 * so it picks up the surrounding text/button color.
 */
import type { JSX } from 'solid-js';

export function Spinner(props: { size?: number; class?: string }): JSX.Element {
    const px = (): string | undefined => (props.size ? `${props.size}px` : undefined);
    return (
        <span
            class={props.class ? `spinner ${props.class}` : 'spinner'}
            style={props.size ? { width: px(), height: px() } : undefined}
            aria-hidden="true"
        ></span>
    );
}
