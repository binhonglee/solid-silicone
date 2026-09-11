/**
 * `<SearchOverlay>` — spotlight-style search overlay (the commit-search shape).
 *
 * Steals the app's commit-search overlay mechanics as a shared primitive: an
 * input header filters items live, ArrowUp/ArrowDown move the selection,
 * Enter picks it, Escape closes, and the selected row scrolls into view.
 * The caller owns the open signal and the query signal; this owns the
 * selection index, the filter, and the keyboard wiring. Mount it once inside
 * an `<OverlayHost>` (like the commit-search island) and drive `open`.
 *
 * Empty queries show every item by default (`showAllOnEmpty`); pass `false`
 * for commit-search behavior (a prompt until the user types).
 */
import { For, Show, createEffect, createMemo, createSignal, onMount } from 'solid-js';
import type { JSX } from 'solid-js';
import { CloseButton } from './CloseButton';
import { EmptyState } from './EmptyState';
import { OverlayHost } from './OverlayHost';
import { SearchField } from './SearchField';
import { Kbd } from './dataDisplay';

export interface SearchOverlayItem {
    /** Stable value passed to `onSelect`. */
    value: string;
    /** Visible row label. */
    label: string;
    /** Right-side meta, e.g. a category. Matched by the filter. */
    hint?: string;
    /** Extra match text (slugs, descriptions). Never rendered. */
    keywords?: string;
}

export interface SearchOverlayProps {
    /** Base id: backdrop, panel, input, and list derive their ids from it. */
    id: string;
    /** Reactive open state; drives the host display toggle. */
    open: () => boolean;
    /** Called on backdrop click, the close button, and Escape. */
    onClose: () => void;
    /** Controlled query text. */
    query: string;
    /** Query writer. */
    onQueryChange: (query: string) => void;
    /** Full item set; the overlay filters it live. */
    items: readonly SearchOverlayItem[];
    /** Called with the picked item's value. */
    onSelect: (value: string) => void;
    /** Accessible label for the panel and the input (default "Search"). */
    label?: string;
    /** Input placeholder. */
    placeholder?: string;
    /** Text shown when the query matches nothing (default "No matches."). */
    emptyText?: string;
    /** Text shown for an empty query when `showAllOnEmpty` is false. */
    promptText?: string;
    /** Show every item for an empty query (default true). */
    showAllOnEmpty?: boolean;
}

/** Case-insensitive AND-word match across label, hint, and keywords. Pure. */
export function filterSearchItems(
    items: readonly SearchOverlayItem[],
    query: string,
    showAllOnEmpty = true,
): SearchOverlayItem[] {
    const words = query.trim().toLowerCase().split(/\s+/).filter((word) => word.length > 0);
    if (words.length === 0) {
        return showAllOnEmpty ? [...items] : [];
    }
    return items.filter((item) => {
        const haystack = `${item.label} ${item.hint ?? ''} ${item.keywords ?? ''}`.toLowerCase();
        return words.every((word) => haystack.includes(word));
    });
}

/** Clamped index step for arrow-key navigation. Pure. */
export function moveSearchIndex(current: number, delta: number, count: number): number {
    if (count <= 0) {
        return 0;
    }
    return Math.max(0, Math.min(count - 1, current + delta));
}

export function SearchOverlay(props: SearchOverlayProps): JSX.Element {
    let input: HTMLInputElement | undefined;
    let panel: HTMLDivElement | undefined;
    const [selectedIndex, setSelectedIndex] = createSignal(0);

    const filtered = createMemo(() =>
        filterSearchItems(props.items, props.query, props.showAllOnEmpty !== false),
    );

    // A new query or item set restarts the selection at the top.
    createEffect(() => {
        props.query;
        props.items;
        setSelectedIndex(0);
    });

    const focusInput = (): void => {
        requestAnimationFrame(() => {
            input?.focus();
            input?.select();
        });
    };

    onMount(() => {
        // The host may already be open on first mount.
        if (props.open()) {
            focusInput();
        }
    });

    // Retarget focus every time the overlay opens.
    createEffect(() => {
        if (props.open()) {
            focusInput();
        }
    });

    // Keep the selected row scrolled into view.
    createEffect(() => {
        selectedIndex();
        filtered();
        panel?.querySelector('[data-search-active="true"]')?.scrollIntoView({ block: 'nearest' });
    });

    const pick = (index: number): void => {
        const item = filtered()[index];
        if (item) {
            props.onSelect(item.value);
        }
    };

    const onKeyDown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
            event.preventDefault();
            props.onClose();
            return;
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSelectedIndex((prev) => moveSearchIndex(prev, 1, filtered().length));
            return;
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelectedIndex((prev) => moveSearchIndex(prev, -1, filtered().length));
            return;
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            pick(selectedIndex());
        }
    };

    const status = (): string => {
        if (props.query.trim() === '') {
            return `${props.items.length} ${props.items.length === 1 ? 'item' : 'items'}`;
        }
        const count = filtered().length;
        return count === 0 ? (props.emptyText ?? 'No matches.') : `${count} ${count === 1 ? 'match' : 'matches'}`;
    };

    return (
        <OverlayHost id={`${props.id}-overlay`} open={props.open}>
            <div id={`${props.id}-backdrop`} class="overlay-backdrop" data-action="close" onClick={() => props.onClose()} />
            <div
                id={`${props.id}-panel`}
                class="overlay-panel si-search-panel"
                role="dialog"
                aria-modal="true"
                aria-label={props.label ?? 'Search'}
                onKeyDown={onKeyDown}
                ref={(el) => {
                    panel = el;
                }}
            >
                <div class="si-search-header">
                    <SearchField
                        id={`${props.id}-input`}
                        ref={(el) => {
                            input = el;
                        }}
                        placeholder={props.placeholder ?? 'Search…'}
                        autocomplete="off"
                        spellcheck={false}
                        aria-label={props.label ?? 'Search'}
                        value={props.query}
                        onInput={(e) => props.onQueryChange(e.currentTarget.value)}
                    />
                    <CloseButton id={`${props.id}-close`} label="Close search" onClick={() => props.onClose()} />
                </div>
                <div id={`${props.id}-status`} class="si-search-status">{status()}</div>
                <div id={`${props.id}-list`} class="si-search-list" role="listbox" aria-label={props.label ?? 'Search'}>
                    <Show
                        when={filtered().length > 0}
                        fallback={
                            <EmptyState>
                                {props.query.trim() === '' && props.showAllOnEmpty === false
                                    ? (props.promptText ?? 'Start typing to search.')
                                    : (props.emptyText ?? 'No matches.')}
                            </EmptyState>
                        }
                    >
                        <For each={filtered()}>
                            {(item, i) => (
                                <button
                                    type="button"
                                    class="si-search-item"
                                    classList={{ active: i() === selectedIndex() }}
                                    data-search-active={i() === selectedIndex() ? 'true' : undefined}
                                    role="option"
                                    aria-selected={i() === selectedIndex() ? 'true' : 'false'}
                                    onClick={() => props.onSelect(item.value)}
                                    onMouseEnter={() => setSelectedIndex(i())}
                                >
                                    <span class="si-search-label">{item.label}</span>
                                    <Show when={item.hint !== undefined}>
                                        <span class="si-search-hint">{item.hint}</span>
                                    </Show>
                                </button>
                            )}
                        </For>
                    </Show>
                </div>
                <div class="si-search-footer">
                    <span><Kbd>Up/Down</Kbd> navigate</span>
                    <span><Kbd>Enter</Kbd> select</span>
                    <span><Kbd>Esc</Kbd> close</span>
                </div>
            </div>
        </OverlayHost>
    );
}
