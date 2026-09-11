/**
 * `<Dropdown>` — button-triggered option picker (the fancier select).
 *
 * Ports the app's composed listbox pattern (SidebarHeader view-mode picker):
 * a Button trigger showing the current value plus a DropdownArrow opens a
 * Menu of options. Long lists scroll inside the menu past about eleven rows.
 *
 * Keyboard support is native-speed: Enter/Space/arrows on the trigger open
 * the menu, arrows/Home/End move real DOM focus between option buttons (so
 * Enter/Space pick and focused rows scroll into view for free), printable
 * keys type-ahead to the first label match, Escape closes back onto the
 * trigger, and Tab closes while leaving focus alone.
 *
 * The menu is fixed-positioned from the trigger's viewport rect (the graph
 * header mechanism), so scrollable or clipped ancestors can never strand it
 * or cut it off. It re-anchors on scroll and resize while open.
 */
import { For, Show, createEffect, onCleanup } from 'solid-js';
import type { JSX } from 'solid-js';
import { Button } from './Button';
import { DropdownArrow, Menu, MenuItem, createMenuState } from './Menu';

export interface DropdownOption<T extends string> {
    value: T;
    label: string;
    /** Per-option inline style on the menu row (e.g. a font-face preview). */
    style?: JSX.CSSProperties;
}

export interface DropdownProps<T extends string> {
    options: readonly DropdownOption<T>[];
    value: T;
    onChange: (value: T) => void;
    /** Accessible label for the trigger and the listbox. */
    label?: string;
    id?: string;
    class?: string;
    disabled?: boolean;
}

/** First option whose label starts with the typed prefix. Pure. Returns -1. */
export function findOptionByPrefix<T extends string>(
    options: readonly DropdownOption<T>[],
    prefix: string,
): number {
    const needle = prefix.toLowerCase();
    if (needle.length === 0) {
        return -1;
    }
    return options.findIndex((opt) => opt.label.toLowerCase().startsWith(needle));
}

/** Panel scrollTop that centers an item row in the visible list. Pure: the
    caller passes measured rects, so tests pin the math without layout. The
    lower clamp is local; the browser clamps the top end on assignment. */
export function centeredScrollTop(
    scrollTop: number,
    panelTop: number,
    panelBorderTop: number,
    panelClientHeight: number,
    itemTop: number,
    itemHeight: number,
): number {
    const itemOffset = itemTop - panelTop - panelBorderTop + scrollTop;
    return Math.max(0, itemOffset - (panelClientHeight - itemHeight) / 2);
}

/** Window timer handle for the type-ahead buffer reset. */
type TypeTimer = ReturnType<typeof setTimeout>;

/** Which side of its trigger a fixed menu sits on. */
export type FixedMenuSide = 'below' | 'above';

/** Anchor a fixed menu below its trigger, clamped to the viewport. Opens
    above only when below would overflow. Returns the side used. */
function positionFixedMenu(anchor: HTMLElement, menu: HTMLElement): FixedMenuSide {
    const anchorRect = anchor.getBoundingClientRect();
    menu.style.minWidth = `${anchorRect.width}px`;
    menu.style.top = `${anchorRect.bottom + 4}px`;
    menu.style.left = `${anchorRect.left}px`;
    const menuRect = menu.getBoundingClientRect();
    if (menuRect.right > window.innerWidth - 8) {
        menu.style.left = `${Math.max(8, window.innerWidth - menuRect.width - 8)}px`;
    }
    const below = anchorRect.bottom + 4 + menuRect.height;
    if (below > window.innerHeight - 8) {
        menu.style.top = `${Math.max(8, anchorRect.top - menuRect.height - 4)}px`;
        return 'above';
    }
    return 'below';
}

/** Track the trigger vertically on scroll, keeping the side chosen at open.
    Never flips or clamps: flipping mid-scroll jumps the menu across the
    trigger near viewport edges, and clamping pins it on screen after the
    trigger scrolls away. The horizontal placement stays as opened, so the
    right-edge clamp survives horizontal scrolling. */
function followFixedMenu(anchor: HTMLElement, menu: HTMLElement, side: FixedMenuSide): void {
    const anchorRect = anchor.getBoundingClientRect();
    if (side === 'above') {
        menu.style.top = `${anchorRect.top - menu.getBoundingClientRect().height - 4}px`;
    } else {
        menu.style.top = `${anchorRect.bottom + 4}px`;
    }
}

export function Dropdown<T extends string>(props: DropdownProps<T>): JSX.Element {
    let container: HTMLDivElement | undefined;
    let trigger: HTMLButtonElement | undefined;
    let menu: HTMLDivElement | undefined;
    let typeBuffer = '';
    let typeTimer: TypeTimer | undefined;
    const state = createMenuState((target) => container?.contains(target) ?? false);
    const current = (): string =>
        props.options.find((opt) => opt.value === props.value)?.label ?? props.value;

    const optionButtons = (): HTMLButtonElement[] =>
        menu ? [...menu.querySelectorAll<HTMLButtonElement>('.menu-item')] : [];

    const selectedIndex = (): number =>
        Math.max(
            0,
            props.options.findIndex((opt) => opt.value === props.value),
        );

    const focusOption = (index: number): void => {
        const buttons = optionButtons();
        if (buttons.length === 0) {
            return;
        }
        buttons[Math.max(0, Math.min(buttons.length - 1, index))]?.focus();
    };

    /** Pick a value, close, and put focus back on the trigger (native-select shape). */
    const pick = (value: T): void => {
        props.onChange(value);
        state.close();
        trigger?.focus();
    };

    /** Open the menu, then land focus on one option row. A seed starts the
        type-ahead reset timer so a later keystroke restarts after a pause. */
    const openAndFocus = (index: number, seed = ''): void => {
        if (typeTimer !== undefined) {
            clearTimeout(typeTimer);
        }
        typeBuffer = seed;
        if (seed) {
            typeTimer = setTimeout(() => {
                typeBuffer = '';
            }, 500);
        }
        state.setOpen(true);
        queueMicrotask(() => focusOption(index));
    };

    /** Extend the type-ahead buffer, restarting from the latest key when the
        extended prefix matches nothing (repeated letters cycle instead of
        wedging the buffer until timeout). Returns the match index or -1. */
    const advanceTypeahead = (char: string): number => {
        if (typeTimer !== undefined) {
            clearTimeout(typeTimer);
        }
        typeBuffer += char;
        let at = findOptionByPrefix(props.options, typeBuffer);
        if (at < 0) {
            typeBuffer = char;
            at = findOptionByPrefix(props.options, typeBuffer);
        }
        typeTimer = setTimeout(() => {
            typeBuffer = '';
        }, 500);
        return at;
    };

    const onTriggerKeyDown = (event: KeyboardEvent): void => {
        if (props.disabled || state.open()) {
            return;
        }
        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowUp') {
            // preventDefault also blocks the button's native click, so the
            // menu opens instead of toggling twice.
            event.preventDefault();
            openAndFocus(event.key === 'ArrowUp' ? props.options.length - 1 : selectedIndex());
            return;
        }
        // Closed-trigger type-ahead (native-select parity): open at the
        // first match and seed the buffer so continued typing extends it.
        if (event.key.length === 1 && event.key !== ' ' && !event.metaKey && !event.ctrlKey && !event.altKey) {
            event.preventDefault();
            const char = event.key.toLowerCase();
            const at = findOptionByPrefix(props.options, char);
            openAndFocus(at >= 0 ? at : selectedIndex(), at >= 0 ? char : '');
        }
    };

    const onMenuKeyDown = (event: KeyboardEvent): void => {
        const buttons = optionButtons();
        if (buttons.length === 0) {
            return;
        }
        const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
        if (event.key === 'Escape') {
            event.preventDefault();
            state.close();
            trigger?.focus();
            return;
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            focusOption(current + 1);
            return;
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            focusOption(current - 1);
            return;
        }
        if (event.key === 'Home') {
            event.preventDefault();
            focusOption(0);
            return;
        }
        if (event.key === 'End') {
            event.preventDefault();
            focusOption(buttons.length - 1);
            return;
        }
        if (event.key === 'Tab') {
            state.close();
            return;
        }
        // Enter/Space fall through: the focused option button picks natively.
        // (Space is excluded below so it never feeds the type-ahead buffer.)
        if (event.key.length === 1 && event.key !== ' ' && !event.metaKey && !event.ctrlKey && !event.altKey) {
            const at = advanceTypeahead(event.key.toLowerCase());
            if (at >= 0) {
                event.preventDefault();
                focusOption(at);
            }
        }
    };

    // Position after render (measurable here) and follow while open. The
    // side is chosen once: re-choosing per scroll tick flips the menu
    // across the trigger near viewport edges, and clamping pins it on
    // screen after the trigger scrolls away. Resize re-chooses instead,
    // since the viewport itself changed shape.
    createEffect(() => {
        if (!state.open()) {return;}
        const anchor = trigger;
        const panel = menu;
        if (!anchor || !panel) {return;}
        let side = positionFixedMenu(anchor, panel);
        // Long lists open with the current value centered. Rect-delta math
        // scrolls only the panel: scrollIntoView block:'center' would also
        // yank the page, since the fixed menu already sits in the viewport.
        const active = panel.querySelector('.menu-item.active');
        if (active && panel.scrollHeight > panel.clientHeight) {
            const panelRect = panel.getBoundingClientRect();
            const itemRect = active.getBoundingClientRect();
            panel.scrollTop = centeredScrollTop(
                panel.scrollTop,
                panelRect.top,
                panel.clientTop,
                panel.clientHeight,
                itemRect.top,
                itemRect.height,
            );
        }
        const follow = (): void => {
            if (state.open() && trigger && menu) {followFixedMenu(trigger, menu, side);}
        };
        const replace = (): void => {
            if (state.open() && trigger && menu) {side = positionFixedMenu(trigger, menu);}
        };
        window.addEventListener('scroll', follow, true);
        window.addEventListener('resize', replace);
        onCleanup(() => {
            window.removeEventListener('scroll', follow, true);
            window.removeEventListener('resize', replace);
        });
    });

    // The accessible name carries label plus value (native-select parity):
    // a static label would hide the current value from assistive tech, and
    // pick() refocuses the trigger so the new value announces on change.
    const accessibleName = (): string =>
        props.label ? `${props.label}: ${current()}` : current();

    // Listbox id for aria-controls; only stable when the caller passes id.
    const menuId = (): string | undefined => (props.id ? `${props.id}-menu` : undefined);

    return (
        <div ref={(el) => { container = el; }} class={props.class ? `si-dropdown ${props.class}` : 'si-dropdown'}>
            <Button
                ref={(el) => { trigger = el; }}
                id={props.id}
                class="si-dropdown-trigger"
                variant="secondary"
                aria-haspopup="listbox"
                aria-expanded={state.open() ? 'true' : 'false'}
                aria-controls={menuId()}
                aria-label={accessibleName()}
                title={props.label}
                disabled={props.disabled}
                onClick={state.toggle}
                onKeyDown={onTriggerKeyDown}
            >
                <span class="si-dropdown-value">{current()}</span>
                <DropdownArrow />
            </Button>
            <Show when={state.open()}>
                <Menu ref={(el) => { menu = el; }} id={menuId()} class="si-dropdown-menu" fixed role="listbox" aria-label={props.label} onKeyDown={onMenuKeyDown}>
                    <For each={props.options}>
                        {(opt) => (
                            <MenuItem
                                class={opt.value === props.value ? 'active' : undefined}
                                role="option"
                                aria-selected={opt.value === props.value ? 'true' : 'false'}
                                style={opt.style}
                                onClick={() => pick(opt.value)}
                            >
                                {opt.label}
                            </MenuItem>
                        )}
                    </For>
                </Menu>
            </Show>
        </div>
    );
}
