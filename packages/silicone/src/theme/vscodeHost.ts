/**
 * VS Code extension host helper.
 *
 * A VS Code extension copies its theme colors into the webview by posting
 * theme variables. Call `applyVsCodeThemeVariables` with the color map from
 * the extension host. Keys are CSS variable names (`--vscode-*`). Values are
 * raw color strings. Empty values remove the override so bundled fallbacks
 * apply.
 */

export function applyVsCodeThemeVariables(colors: Record<string, string | undefined>): void {
    const root = document.documentElement;
    // Explicit origin marker: bundled schemes define the same variables, so
    // `resolveMode` must not probe values to detect a host.
    root.setAttribute('data-si-host', 'vscode');
    for (const [key, value] of Object.entries(colors)) {
        if (!key.startsWith('--vscode-')) {
            continue;
        }
        if (value === undefined || value === '') {
            root.style.removeProperty(key);
        } else {
            root.style.setProperty(key, value);
        }
    }
}

/** Clear the host marker (tests, host detach). */
export function clearVsCodeHostMarker(): void {
    document.documentElement.removeAttribute('data-si-host');
}

/**
 * Map `workbench.colorCustomizations` color IDs to webview variables.
 * Color IDs use dots (`editor.background`); CSS variables use hyphens
 * (`--vscode-editor-background`).
 */
export function mapColorCustomizations(customizations: Record<string, string>): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(customizations)) {
        out[`--vscode-${key.replace(/\./g, '-')}`] = value;
    }
    return out;
}
