/**
 * Theme mode resolution for solid-silicone.
 *
 * - `vscode`: read host `--vscode-*` variables. Load no bundled scheme CSS.
 * - `bundled`: use the bundled scheme (`data-scheme`) for both modes.
 * - `auto`: use host variables when a real host is present, else bundled.
 *
 * Host detection uses an explicit origin marker, NOT computed variable
 * values: bundled scheme stylesheets define the same `--vscode-*` variables,
 * so probing values cannot distinguish a host from an active bundled scheme.
 * `applyVsCodeThemeVariables` sets the marker for compatible shells. Native
 * VS Code webviews also carry `vscode-light` / `vscode-dark` body classes.
 */

export type SiliconeThemeMode = 'vscode' | 'bundled' | 'auto';

export const VSCODE_HOST_MARKER = 'data-si-host';

function hasMarker(): boolean {
    if (typeof document === 'undefined') {
        return false;
    }
    if (document.documentElement.getAttribute(VSCODE_HOST_MARKER) === 'vscode') {
        return true;
    }
    const body = document.body;
    if (body && (body.classList.contains('vscode-light') || body.classList.contains('vscode-dark'))) {
        return true;
    }
    return false;
}

/** Return true when an explicit VS Code host marker is present. */
export function hasVsCodeHost(assumeHost?: boolean): boolean {
    if (assumeHost !== undefined) {
        return assumeHost;
    }
    return hasMarker();
}

/** Resolve the effective source of theme tokens. */
export function resolveThemeSource(mode: SiliconeThemeMode, opts?: { host?: boolean }): 'vscode' | 'bundled' {
    if (mode === 'vscode') {
        return 'vscode';
    }
    if (mode === 'bundled') {
        return 'bundled';
    }
    return hasVsCodeHost(opts?.host) ? 'vscode' : 'bundled';
}
