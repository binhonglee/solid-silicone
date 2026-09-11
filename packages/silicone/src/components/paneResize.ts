/**
 * `beginPaneDrag` — the shared drag choreography for resizable panes.
 *
 * The sidebar, hidden-commits details pane, and Entire session list all
 * resize the same way: on mousedown, attach document-level mousemove/mouseup
 * listeners, mark the handle (`.resizing`) and body (a per-surface class,
 * e.g. `sidebar-resizing`) while dragging, and detach + persist on release.
 * This helper owns that choreography; the caller keeps its own width math
 * (in `onMove`) and persistence (in `onEnd`).
 *
 * Call from the handle's mousedown handler. Handles get the shared
 * `.resize-handle` class for consistent hover/active styling; per-surface
 * classes carry only positioning.
 */
export interface PaneDragOptions {
    /** The drag handle; gets `.resizing` while dragging. */
    handle: HTMLElement;
    /** Class toggled on document.body during the drag (cursor/user-select). */
    bodyClass?: string;
    /** Called for every mousemove while dragging. */
    onMove: (event: MouseEvent) => void;
    /** Called once on release (persist the final size here). */
    onEnd?: () => void;
}

export function beginPaneDrag(event: MouseEvent, options: PaneDragOptions): void {
    event.preventDefault();
    options.handle.classList.add('resizing');
    if (options.bodyClass) {
        document.body.classList.add(options.bodyClass);
    }
    const onMove = (move: MouseEvent): void => {
        options.onMove(move);
    };
    const onUp = (): void => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        options.handle.classList.remove('resizing');
        if (options.bodyClass) {
            document.body.classList.remove(options.bodyClass);
        }
        options.onEnd?.();
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
}
