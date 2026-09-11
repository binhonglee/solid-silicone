/**
 * `<SplitPane>` — the shared resizable two-pane layout.
 *
 * The sidebar, the placeholder details pane, and the Entire session list all
 * grew their own divider math around `beginPaneDrag`. This component owns the
 * shared shape: two panes plus a draggable divider, pixel width with min/max
 * clamps against the container, optional localStorage persistence, and arrow
 * key resizing on the divider. Each pane scrolls through its own content CSS;
 * the panes only guarantee they can shrink (min 0) inside the flex row.
 *
 * `side` picks the sized pane: 'first' sizes the left pane (session lists),
 * 'second' sizes the right pane (sidebars, details panes).
 *
 * Below `drawerBreakpoint` the first pane collapses into an overlay drawer:
 * hidden off-canvas with a menu button at the container's top left that
 * morphs into a close button while open, plus a default close button inside
 * the pane's top right corner, a scrim, and Escape to close. Set
 * `showDrawerToggle` false to place the toggle elsewhere (a top bar) and
 * drive the drawer through `drawerOpen`/`onDrawerOpenChange` instead, and
 * `showDrawerClose` false to drop the in-pane close when the toggle itself
 * morphs into the close button.
 * The drawer is designed for nav-style first panes; the sized width is
 * ignored in drawer mode and the divider hides.
 */
import { createSignal, onCleanup, onMount } from 'solid-js';
import type { JSX } from 'solid-js';
import { Close, MenuBars } from './icons';
import { beginPaneDrag } from './paneResize';

/** Clamp a sized-pane width between its minimum, its maximum, and the container. */
export function clampSplitWidth(sized: number, minSized: number, minOther: number, container: number, maxSized = Infinity): number {
    if (!Number.isFinite(sized)) {return minSized;}
    const max = Math.min(maxSized, Math.max(minSized, container - minOther));
    return Math.max(minSized, Math.min(max, sized));
}

/** Media query that activates drawer mode below the breakpoint width. */
export function drawerMediaQuery(breakpoint: number): string {
    return `(max-width: ${breakpoint}px)`;
}

function loadStoredWidth(key: string | undefined, fallback: number): number {
    if (key === undefined) {return fallback;}
    try {
        const raw = localStorage.getItem(key);
        const parsed = raw === null ? NaN : Number(raw);
        if (Number.isFinite(parsed) && parsed > 0) {return parsed;}
    } catch { /* private mode: fall through to the default */ }
    return fallback;
}

export interface SplitPaneProps {
    /** First pane content. Sized when side is 'first', fills otherwise. */
    first: JSX.Element;
    /** Second pane content. Sized when side is 'second', fills otherwise. */
    second: JSX.Element;
    /** Which pane the divider sizes. Defaults to 'first'. */
    side?: 'first' | 'second';
    /** Accessible names for the panes and the divider. */
    firstLabel?: string;
    secondLabel?: string;
    /** Element ids for the panes (existing selectors/tests key off them). */
    firstId?: string;
    secondId?: string;
    /** Uncontrolled starting width of the sized pane in px. */
    initialPaneWidth?: number;
    /** Minimum first-pane width in px. */
    minFirst?: number;
    /** Minimum second-pane width in px. */
    minSecond?: number;
    /** Maximum first-pane width in px. */
    maxFirst?: number;
    /** Maximum second-pane width in px. */
    maxSecond?: number;
    /** Controlled width of the sized pane in px. Pair with onPaneWidthChange. */
    paneWidth?: number;
    /** Controlled width handler. */
    onPaneWidthChange?: (width: number) => void;
    /** localStorage key for persistence (uncontrolled mode only). */
    storageKey?: string;
    /** Body class during drags (cursor/user-select). Defaults to si-split-resizing. */
    bodyClass?: string;
    /** Viewport width in px below which the first pane becomes an overlay drawer. Omit to disable. */
    drawerBreakpoint?: number;
    /** Accessible label for the drawer toggle while the drawer is closed. Defaults to 'Open navigation'. */
    drawerToggleLabel?: string;
    /** Render the floating drawer toggle. Set false when the toggle lives elsewhere (top bar, header); pair with controlled drawerOpen. Defaults to true. */
    showDrawerToggle?: boolean;
    /** Render the default close button inside the pane top right. Set false when the toggle already morphs into a close button. Defaults to true. */
    showDrawerClose?: boolean;
    /** Controlled drawer open state (drawer mode only). Pair with onDrawerOpenChange. */
    drawerOpen?: boolean;
    /** Controlled drawer open handler. */
    onDrawerOpenChange?: (open: boolean) => void;
    /** Extra classes: container and pane hooks (selector hooks only). */
    class?: string;
    firstClass?: string;
    secondClass?: string;
    /** Inline styles for the panes (e.g. an initial display state). */
    firstStyle?: JSX.CSSProperties | string;
    secondStyle?: JSX.CSSProperties | string;
}

const KEY_STEP = 16;

export function SplitPane(props: SplitPaneProps): JSX.Element {
    const secondSide = (): boolean => props.side === 'second';
    const minSized = (): number => (secondSide() ? (props.minSecond ?? 200) : (props.minFirst ?? 200));
    const minOther = (): number => (secondSide() ? (props.minFirst ?? 200) : (props.minSecond ?? 200));
    const maxSized = (): number => (secondSide() ? (props.maxSecond ?? Infinity) : (props.maxFirst ?? Infinity));
    const [internal, setInternal] = createSignal(
        loadStoredWidth(props.storageKey, props.paneWidth ?? props.initialPaneWidth ?? 280),
    );
    const width = (): number => props.paneWidth ?? internal();
    const [percent, setPercent] = createSignal(50);

    // Drawer mode: viewport-driven, evaluated on mount (SSR renders desktop).
    const [drawerViewport, setDrawerViewport] = createSignal(false);
    const [internalDrawerOpen, setInternalDrawerOpen] = createSignal(false);
    const drawer = (): boolean => props.drawerBreakpoint !== undefined && drawerViewport();
    const drawerOpen = (): boolean => props.drawerOpen ?? internalDrawerOpen();
    const setDrawerOpen = (open: boolean): void => {
        if (props.drawerOpen === undefined) {setInternalDrawerOpen(open);}
        props.onDrawerOpenChange?.(open);
    };

    let container: HTMLDivElement | undefined;
    let handle: HTMLDivElement | undefined;

    /** Sized-pane style: the measured width wins over any width in the base. */
    const sizedStyle = (base: JSX.CSSProperties | string | undefined): JSX.CSSProperties | string | undefined => {
        const widthText = `${width()}px`;
        if (base === undefined) {return { width: widthText };}
        if (typeof base === 'string') {return `${base};width:${widthText}`;}
        return { ...base, width: widthText };
    };

    /** Single funnel for every width change: clamp, publish, track percent. */
    const applyWidth = (raw: number, persist: boolean): void => {
        const box = container?.getBoundingClientRect();
        // A zero/missing box (detached DOM, layout-free tests) means the
        // container cannot bound the width: fall back to unbounded.
        const avail = box && box.width > 0 ? box.width : Infinity;
        const next = clampSplitWidth(raw, minSized(), minOther(), avail, maxSized());
        if (props.paneWidth === undefined) {setInternal(next);}
        props.onPaneWidthChange?.(next);
        if (box && box.width > 0) {setPercent(Math.round((next / box.width) * 100));}
        if (persist && props.storageKey !== undefined) {
            try {localStorage.setItem(props.storageKey, String(Math.round(next)));} catch { /* ignore */ }
        }
    };

    const startResize = (event: MouseEvent): void => {
        const grip = handle;
        if (!container || !grip) {return;}
        // Delta drag: the pane edge follows the cursor from the grab point,
        // so no layout read is needed per move.
        const startX = event.clientX;
        const startWidth = width();
        const direction = secondSide() ? -1 : 1;
        beginPaneDrag(event, {
            handle: grip,
            bodyClass: props.bodyClass ?? 'si-split-resizing',
            onMove: (move) => applyWidth(startWidth + direction * (move.clientX - startX), false),
            onEnd: () => applyWidth(width(), true),
        });
    };

    const onHandleKey = (event: KeyboardEvent): void => {
        const box = container?.getBoundingClientRect();
        if (!box) {return;}
        const grow = secondSide() ? KEY_STEP : -KEY_STEP;
        let next: number | undefined;
        if (event.key === 'ArrowLeft') {next = width() + grow;}
        else if (event.key === 'ArrowRight') {next = width() - grow;}
        else if (event.key === 'Home') {next = minSized();}
        else if (event.key === 'End') {next = box.width - minOther();}
        if (next === undefined) {return;}
        event.preventDefault();
        applyWidth(next, true);
    };

    onMount(() => {
        // Sync the clamped width and percent once real layout exists.
        applyWidth(width(), false);
        if (props.drawerBreakpoint === undefined) {return;}
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {return;}
        const query = window.matchMedia(drawerMediaQuery(props.drawerBreakpoint));
        const onChange = (): void => {
            setDrawerViewport(query.matches);
            // Leaving drawer mode never leaves a stale open drawer behind.
            if (!query.matches) {setDrawerOpen(false);}
        };
        onChange();
        if (typeof query.addEventListener === 'function') {query.addEventListener('change', onChange);}
        else {query.addListener(onChange);}
        onCleanup(() => {
            if (typeof query.removeEventListener === 'function') {query.removeEventListener('change', onChange);}
            else {query.removeListener(onChange);}
        });
    });
    onCleanup(() => { container = undefined; handle = undefined; });

    const containerClass = (): string => {
        const parts = ['si-split'];
        if (secondSide()) {parts.push('si-split-flip');}
        if (drawer()) {parts.push('si-split-drawer');}
        if (drawer() && drawerOpen()) {parts.push('si-split-drawer-open');}
        if (props.class) {parts.push(props.class);}
        return parts.join(' ');
    };

    /** First-pane style: drawer mode drops the sized width for the drawer CSS width. */
    const firstStyle = (): JSX.CSSProperties | string | undefined => {
        if (drawer()) {return props.firstStyle;}
        return secondSide() ? props.firstStyle : sizedStyle(props.firstStyle);
    };

    const onContainerKey = (event: KeyboardEvent): void => {
        if (event.key === 'Escape' && drawer() && drawerOpen()) {setDrawerOpen(false);}
    };

    return (
        <div ref={(el) => { container = el; }} class={containerClass()} onKeyDown={onContainerKey}>
            {drawer() && props.showDrawerToggle !== false && (
                <button
                    type="button"
                    class="si-split-drawer-toggle"
                    aria-expanded={drawerOpen()}
                    aria-label={drawerOpen() ? 'Close navigation' : (props.drawerToggleLabel ?? 'Open navigation')}
                    onClick={() => setDrawerOpen(!drawerOpen())}
                >
                    {drawerOpen() ? <Close size={14} /> : <MenuBars size={16} />}
                </button>
            )}
            <div
                id={props.firstId}
                class={props.firstClass ? `si-split-first ${props.firstClass}` : 'si-split-first'}
                role={props.firstLabel === undefined ? undefined : 'region'}
                aria-label={props.firstLabel}
                aria-hidden={drawer() && !drawerOpen() ? true : undefined}
                style={firstStyle()}
            >
                {drawer() && props.showDrawerClose !== false && (
                    <button
                        type="button"
                        class="si-split-drawer-close"
                        aria-label="Close navigation"
                        onClick={() => setDrawerOpen(false)}
                    >
                        <Close size={14} />
                    </button>
                )}
                {props.first}
            </div>
            {drawer() && drawerOpen() && (
                <div class="si-split-scrim" aria-hidden="true" onClick={() => setDrawerOpen(false)} />
            )}
            <div
                ref={(el) => { handle = el; }}
                class="si-split-handle resize-handle"
                role="separator"
                aria-orientation="horizontal"
                aria-label={props.secondLabel === undefined ? 'Resize panes' : `Resize ${props.firstLabel ?? 'panes'}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent()}
                tabindex={0}
                onMouseDown={startResize}
                onKeyDown={onHandleKey}
            />
            <div
                id={props.secondId}
                class={props.secondClass ? `si-split-second ${props.secondClass}` : 'si-split-second'}
                role={props.secondLabel === undefined ? undefined : 'region'}
                aria-label={props.secondLabel}
                style={secondSide() ? sizedStyle(props.secondStyle) : props.secondStyle}
            >
                {props.second}
            </div>
        </div>
    );
}
