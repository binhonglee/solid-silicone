/**
 * `<Overlay>` — the shared modal-overlay shell.
 *
 * All modal overlays share the same inner structure: a backdrop, a panel
 * (role=dialog), a header with a title + optional actions + close button, and
 * a body. This primitive renders that inner shell — to be mounted INTO an
 * existing `#{id}` container (see `<OverlayHost>`) — and emits both:
 *
 * - the conventional `{id}-backdrop`, `{id}-panel`, `{id}-header`,
 *   `{id}-title`, `{id}-close`, `{id}-body` ids, so existing selectors and
 *   tests keep matching, and
 * - the design-system `.overlay-*` classes, which carry ALL the shared
 *   chrome styling (see "Design system: overlay chrome" in
 *   `assets/webview/style.css`). Per-overlay CSS should only set sizing
 *   (width/height) and layout that is genuinely specific to that overlay.
 *
 * It owns the genuinely-shared, non app-coordinated behaviors: backdrop-click
 * to close and the close button (rendered via `<CloseButton>` so every overlay
 * closes the same way). It does NOT manage the container's visibility
 * (`<OverlayHost>` / the caller toggles `display` on the container) and does
 * NOT handle Escape (overlays coordinate Escape themselves). Slots:
 *
 * - `headerActions`: extra controls between the title and the close button.
 * - `headerStack`: rows rendered inside the header, under the title row
 *   (e.g. a meta line + search input); switches the header to stacked layout.
 * - `belowHeader`: a toolbar row between the header and the body.
 * - `footer`: a footer row after the body.
 *
 * The global overlay scroll lock keys off overlay open signals, so an
 * `<Overlay>` participates in scroll locking with no extra wiring.
 */
import type { JSX } from 'solid-js';
import { Show } from 'solid-js';
import { CloseButton } from './CloseButton';

export interface OverlayProps {
    /** Base id, e.g. "diff-overlay". Inner element ids are derived from it. */
    id: string;
    /** Header title content. */
    title: JSX.Element;
    /** Called on backdrop click or the close button. */
    onClose: () => void;
    /** Body content. */
    children: JSX.Element;
    /** Extra header controls, rendered between the title and the close button. */
    headerActions?: JSX.Element;
    /** Rows rendered inside the header under the title row (stacked header). */
    headerStack?: JSX.Element;
    /** Optional content rendered under the header (e.g. a search/toolbar row). */
    belowHeader?: JSX.Element;
    /** Optional footer content, rendered after the body as `{id}-footer`. */
    footer?: JSX.Element;
    /** Accessible label for the close button (default "Close"). */
    closeLabel?: string;
    /** Extra class on the panel element. */
    panelClass?: string;
    /** Extra class on the body element. */
    bodyClass?: string;
    /** Disable backdrop-click-to-close (default enabled). */
    closeOnBackdrop?: boolean;
}

export function Overlay(props: OverlayProps): JSX.Element {
    const onBackdrop = (): void => {
        if (props.closeOnBackdrop !== false) {
            props.onClose();
        }
    };

    const titleRow = (
        <>
            <h3 id={`${props.id}-title`} class="overlay-title">{props.title}</h3>
            <div class="overlay-header-actions">
                {props.headerActions}
                <CloseButton
                    id={`${props.id}-close`}
                    label={props.closeLabel ?? 'Close'}
                    onClick={() => props.onClose()}
                />
            </div>
        </>
    );

    return (
        <>
            <div id={`${props.id}-backdrop`} class="overlay-backdrop" data-action="close" onClick={onBackdrop}></div>
            <div
                id={`${props.id}-panel`}
                class={props.panelClass ? `overlay-panel ${props.panelClass}` : 'overlay-panel'}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`${props.id}-title`}
            >
                <div
                    id={`${props.id}-header`}
                    classList={{ 'overlay-header': true, 'overlay-header--stack': props.headerStack !== undefined }}
                >
                    <Show when={props.headerStack !== undefined} fallback={titleRow}>
                        <div class="overlay-title-row">{titleRow}</div>
                        {props.headerStack}
                    </Show>
                </div>
                {props.belowHeader}
                <div
                    id={`${props.id}-body`}
                    class={props.bodyClass ? `overlay-body ${props.bodyClass}` : 'overlay-body'}
                >{props.children}</div>
                <Show when={props.footer !== undefined}>
                    <div id={`${props.id}-footer`} class="overlay-footer">{props.footer}</div>
                </Show>
            </div>
        </>
    );
}
