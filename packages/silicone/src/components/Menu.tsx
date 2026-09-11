/**
 * `<Menu>` / `<MenuItem>` / `<MenuSeparator>` — the design-system popup menu.
 *
 * One look for every dropdown, row menu, and right-click menu. Styling lives
 * on the shared `.menu*` classes in `assets/webview/style.css`; a call site's
 * historical class (e.g. `refs-new-dropdown`) stays on as a selector hook and
 * carries ONLY positioning (top/right/z-index), never box styling.
 *
 * The primitives are presentational: open/close state, outside-click, and
 * Escape handling stay with the owner (each menu coordinates those with its
 * own trigger and app state). `<Menu show={...}>` toggles inline display for
 * owners that keep the node mounted; owners using `<Show>` just omit `show`.
 *
 * For right-click menus positioned at the cursor, pass `fixed` and a
 * `style` with left/top — see FilesView's row context menu.
 */
import { createEffect, createSignal, onCleanup, splitProps } from 'solid-js';
import type { Accessor, JSX, Setter } from 'solid-js';

export interface MenuProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /** Position fixed (cursor-anchored context menus) instead of absolute. */
    fixed?: boolean;
    /** Reactive visibility; toggles inline display (flex when visible). */
    show?: boolean;
}

export function Menu(props: MenuProps): JSX.Element {
    const [local, rest] = splitProps(props, ['fixed', 'show', 'class', 'classList', 'style']);
    const classes = (): string => {
        const parts = ['menu'];
        if (local.fixed) {parts.push('menu--fixed');}
        if (local.class) {parts.push(local.class);}
        return parts.join(' ');
    };
    const style = (): JSX.CSSProperties | string | undefined => {
        if (local.show === undefined) {return local.style;}
        const display = { display: local.show ? 'flex' : 'none' };
        if (typeof local.style === 'object' && local.style) {
            return { ...local.style, ...display };
        }
        return display;
    };
    return <div role="menu" {...rest} class={classes()} classList={local.classList} style={style()} />;
}

export interface MenuItemProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Destructive action styling (error foreground). */
    danger?: boolean;
}

export function MenuItem(props: MenuItemProps): JSX.Element {
    const [local, rest] = splitProps(props, ['danger', 'class', 'classList']);
    const classes = (): string => {
        const parts = ['menu-item'];
        if (local.danger) {parts.push('danger');}
        if (local.class) {parts.push(local.class);}
        return parts.join(' ');
    };
    return <button type="button" role="menuitem" {...rest} class={classes()} classList={local.classList} />;
}

export function MenuSeparator(props: { class?: string }): JSX.Element {
    return <div class={props.class ? `menu-sep ${props.class}` : 'menu-sep'} role="separator"></div>;
}

/**
 * The caret on every menu/dropdown trigger button. One rendering (a small
 * down-pointing chevron matching <Chevron>'s iconography) — never the ▼ text
 * character, whose weight varies by platform font.
 */
export function DropdownArrow(): JSX.Element {
    return (
        <span class="dropdown-arrow" aria-hidden="true">
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 7L8 3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </span>
    );
}

export interface MenuState {
    open: Accessor<boolean>;
    setOpen: Setter<boolean>;
    /** Trigger handler: stops propagation and toggles. */
    toggle: (event: MouseEvent) => void;
    close: () => void;
}

/**
 * Open-state for a menu: a signal plus the standard dismissal wiring —
 * while open, any document click outside the menu (per `isInside`) closes
 * it, as does Escape. Owners with extra coordination (multi-menu exclusivity,
 * dialogs layered above) keep their own wiring; everyone else uses this.
 */
export function createMenuState(isInside: (target: Element) => boolean): MenuState {
    const [open, setOpen] = createSignal(false);
    createEffect(() => {
        if (!open()) {return;}
        const onDocClick = (event: MouseEvent): void => {
            const target = event.target;
            if (target instanceof Element && isInside(target)) {return;}
            setOpen(false);
        };
        const onKey = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };
        document.addEventListener('click', onDocClick);
        document.addEventListener('keydown', onKey);
        onCleanup(() => {
            document.removeEventListener('click', onDocClick);
            document.removeEventListener('keydown', onKey);
        });
    });
    return {
        open,
        setOpen,
        toggle: event => {
            event.stopPropagation();
            setOpen(value => !value);
        },
        close: () => setOpen(false),
    };
}
