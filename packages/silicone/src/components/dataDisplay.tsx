/** Data display: Avatar, Card, Table, Kbd, Link, Divider. */
import { For, Show, splitProps } from 'solid-js';
import type { JSX } from 'solid-js';

export function Avatar(props: { name: string; src?: string; size?: number; class?: string }): JSX.Element {
    const initials = (): string =>
        props.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || '?';
    const size = (): number => props.size ?? 28;
    return props.src ? (
        <img src={props.src} alt={props.name} width={size()} height={size()} class={props.class ? `si-avatar ${props.class}` : 'si-avatar'} style={{ width: `${size()}px`, height: `${size()}px` }} />
    ) : (
        <span class={props.class ? `si-avatar si-avatar-fallback ${props.class}` : 'si-avatar si-avatar-fallback'} role="img" aria-label={props.name} style={{ width: `${size()}px`, height: `${size()}px` }}>
            {initials()}
        </span>
    );
}

export function Card(props: { children: JSX.Element; class?: string; title?: JSX.Element }): JSX.Element {
    return (
        <section class={props.class ? `si-card ${props.class}` : 'si-card'}>
            {props.title !== undefined && <h3 class="si-card-title">{props.title}</h3>}
            {props.children}
        </section>
    );
}

export function Table(props: { columns: string[]; rows: string[][]; class?: string }): JSX.Element {
    return (
        <table class={props.class ? `si-table ${props.class}` : 'si-table'}>
            <thead><tr><For each={props.columns}>{(c) => <th scope="col">{c}</th>}</For></tr></thead>
            <tbody><For each={props.rows}>{(r) => <tr><For each={r}>{(c) => <td>{c}</td>}</For></tr>}</For></tbody>
        </table>
    );
}

/**
 * Split one chord (no ` / `) into its key tokens.
 *
 * A literal Plus key rides as a trailing or leading `+` (for example
 * `Ctrl++` is Ctrl plus the Plus key). Empty segments from the split are
 * dropped and re-added as a single `+` key, so a future literal Plus
 * renders as a key pill rather than a separator and can never be confused
 * with the `+` that joins keys.
 */
export function splitChordKeys(chord: string): string[] {
    const text = chord.trim();
    if (!text) {return [];}
    if (text === '+' || text === '++') {return ['+'];}
    const keys = text.split('+').filter(part => part !== '');
    if (text.endsWith('+')) {keys.push('+');}
    if (text.startsWith('+')) {keys.unshift('+');}
    return keys;
}

/** Split a full label into alternative chords on ` / `. */
export function splitChordAlternatives(label: string): string[] {
    return label.split(' / ').map(part => part.trim()).filter(part => part.length > 0);
}

export function Kbd(props: { children: JSX.Element }): JSX.Element {
    // String children render as structured chords: key pills joined by a
    // dimmed `+`, so the connector can never read as a pressed key. A
    // literal Plus key (Ctrl++) renders as its own pill instead.
    if (typeof props.children === 'string') {
        const raw = props.children;
        return (
            <kbd class="si-kbd" aria-label={raw}>
                <For each={splitChordAlternatives(raw)}>
                    {(chord, altIndex) => (
                        <>
                            <Show when={altIndex() > 0}>
                                <span class="si-kbd-alt" aria-hidden="true"> / </span>
                            </Show>
                            <For each={splitChordKeys(chord)}>
                                {(key, keyIndex) => (
                                    <>
                                        <Show when={keyIndex() > 0}>
                                            <span class="si-kbd-sep" aria-hidden="true">+</span>
                                        </Show>
                                        <span class="si-kbd-key">{key}</span>
                                    </>
                                )}
                            </For>
                        </>
                    )}
                </For>
            </kbd>
        );
    }
    return <kbd class="si-kbd">{props.children}</kbd>;
}

export function Link(props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>): JSX.Element {
    const [local, rest] = splitProps(props, ['class']);
    return <a {...rest} class={local.class ? `si-link ${local.class}` : 'si-link'} />;
}

export function Divider(props: { class?: string; label?: string }): JSX.Element {
    return props.label === undefined ? (
        <hr class={props.class ? `si-divider ${props.class}` : 'si-divider'} />
    ) : (
        <div class={props.class ? `si-divider-label ${props.class}` : 'si-divider-label'} role="separator"><span>{props.label}</span></div>
    );
}
