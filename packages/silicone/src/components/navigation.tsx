/** Navigation: Tabs, Breadcrumb, Pagination, Stepper. */
import { For, Show } from 'solid-js';
import type { JSX } from 'solid-js';

export function Tabs<T extends string>(props: { tabs: readonly { value: T; label: string }[]; value: T; onChange: (value: T) => void; label?: string }): JSX.Element {
    return (
        <div class="si-tabs" role="tablist" aria-label={props.label}>
            <For each={props.tabs}>
                {(t) => (
                    <button type="button" role="tab" aria-selected={t.value === props.value} class={t.value === props.value ? 'si-tab active' : 'si-tab'} onClick={() => props.onChange(t.value)}>
                        {t.label}
                    </button>
                )}
            </For>
        </div>
    );
}

export function Breadcrumb(props: { items: { label: string; href?: string }[] }): JSX.Element {
    return (
        <nav class="si-breadcrumb" aria-label="Breadcrumb">
            <ol>
                <For each={props.items}>
                    {(item, i) => (
                        <li>
                            <Show when={i() > 0}><span class="si-breadcrumb-sep" aria-hidden="true">/</span></Show>
                            {item.href === undefined ? <span aria-current="page">{item.label}</span> : <a href={item.href}>{item.label}</a>}
                        </li>
                    )}
                </For>
            </ol>
        </nav>
    );
}

export function Pagination(props: { page: number; pageCount: number; onChange: (page: number) => void; label?: string }): JSX.Element {
    const pages = (): number[] => Array.from({ length: props.pageCount }, (_, i) => i + 1);
    return (
        <nav class="si-pagination" aria-label={props.label ?? 'Pagination'}>
            <button type="button" disabled={props.page <= 1} onClick={() => props.onChange(props.page - 1)}>Prev</button>
            <For each={pages()}>
                {(p) => (
                    <button type="button" aria-current={p === props.page ? 'page' : undefined} class={p === props.page ? 'active' : undefined} onClick={() => props.onChange(p)}>
                        {p}
                    </button>
                )}
            </For>
            <button type="button" disabled={props.page >= props.pageCount} onClick={() => props.onChange(props.page + 1)}>Next</button>
        </nav>
    );
}

export function Stepper(props: { steps: string[]; current: number }): JSX.Element {
    return (
        <ol class="si-stepper">
            <For each={props.steps}>
                {(step, i) => (
                    <li class={i() < props.current ? 'done' : i() === props.current ? 'current' : undefined} aria-current={i() === props.current ? 'step' : undefined}>
                        <span class="si-step-dot" aria-hidden="true">{i() + 1}</span> {step}
                    </li>
                )}
            </For>
        </ol>
    );
}
