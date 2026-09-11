/**
 * `<Dialog>` — the shared confirm/prompt dialog card.
 *
 * The confirm-dialog family (rebase, uncommit, amend, create/rename/delete
 * ref, push/fetch/open-repo errors, squash, …) all share the same structure:
 * a fullscreen root that toggles `display`, a dim scrim, and a centered card
 * with a title, message/body content, and a right-aligned action row. This
 * primitive renders that structure with the design-system `.dialog-*` classes
 * (see "Design system: dialogs" in `assets/webview/style.css`) while emitting
 * the caller's historical element ids — the id naming across dialogs predates
 * the design system and is load-bearing for handlers/tests, so every id is
 * passed in rather than derived.
 *
 * Actions should be `<Button>`s. Error boxes inside `children` use the shared
 * `.dialog-error` class. Bodies that need width/height beyond the default
 * card add a per-dialog id rule (sizing only) in style.css.
 *
 * Escape handling stays with the dialog's owner (handlers/dialogs.ts wiring),
 * matching the overlay convention.
 */
import type { JSX } from 'solid-js';

export interface DialogProps {
    /** Fullscreen container id (e.g. "rebase-confirmation"). */
    rootId: string;
    /** Card id (e.g. "rebase-dialog" / "create-ref-content"). */
    cardId: string;
    /** Scrim id (e.g. "rebase-overlay"). */
    scrimId: string;
    /** Reactive open state; toggles the root's display. */
    open: () => boolean;
    /** Scrim click handler (usually cancel). Omit for an inert scrim. */
    onScrimClick?: () => void;
    /** Title content; `titleId` preserves a historical title id. */
    title: JSX.Element;
    titleId?: string;
    /** Body content: message paragraph(s), inputs, extra rows. */
    children: JSX.Element;
    /** Action row content (Buttons); `actionsId` preserves the row id. */
    actions: JSX.Element;
    actionsId?: string;
    /** Extra class on the card (selector hook / sizing variant). */
    cardClass?: string;
    /** Display value when open (default "block"; blocking overlay needs "flex"). */
    display?: 'block' | 'flex';
}

export function Dialog(props: DialogProps): JSX.Element {
    return (
        <div id={props.rootId} class="dialog-root" style={{ display: props.open() ? (props.display ?? 'block') : 'none' }}>
            <div id={props.scrimId} class="dialog-scrim" onClick={() => props.onScrimClick?.()}></div>
            <div
                id={props.cardId}
                class={props.cardClass ? `dialog-card ${props.cardClass}` : 'dialog-card'}
                role="dialog"
                aria-modal="true"
                aria-labelledby={props.titleId}
            >
                <h3 id={props.titleId} class="dialog-title">{props.title}</h3>
                {props.children}
                <div id={props.actionsId} class="dialog-actions">{props.actions}</div>
            </div>
        </div>
    );
}
