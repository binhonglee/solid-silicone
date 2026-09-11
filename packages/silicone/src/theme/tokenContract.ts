/**
 * Token contract for solid-silicone.
 *
 * Each component reads `--vscode-*` variables first. Each entry lists the
 * fallback used when the host (VS Code webview or bundled scheme) does not
 * define the token. Keep this list in sync with `styles/tokens.css`.
 */

export interface TokenFallback {
    /** CSS variable name, e.g. `--vscode-editor-background`. */
    token: string;
    /** Fallback value or variable, e.g. `var(--si-surface)` or `#ffffff`. */
    fallback: string;
}

export const REQUIRED_TOKENS: readonly TokenFallback[] = [
    { token: '--vscode-editor-background', fallback: 'var(--si-surface)' },
    { token: '--vscode-editor-foreground', fallback: 'var(--si-text)' },
    { token: '--vscode-foreground', fallback: 'var(--si-text)' },
    { token: '--vscode-panel-border', fallback: 'var(--si-border)' },
    { token: '--vscode-editorWidget-background', fallback: 'var(--si-surface-raised)' },
    { token: '--vscode-editorWidget-border', fallback: 'var(--si-border)' },
    { token: '--vscode-focusBorder', fallback: 'var(--si-focus)' },
    { token: '--vscode-list-hoverBackground', fallback: 'var(--si-hover)' },
    { token: '--vscode-list-activeSelectionBackground', fallback: 'var(--si-active)' },
    { token: '--vscode-list-activeSelectionForeground', fallback: 'var(--si-text)' },
    { token: '--vscode-button-background', fallback: 'var(--si-accent)' },
    { token: '--vscode-button-foreground', fallback: 'var(--si-on-accent)' },
    { token: '--vscode-button-hoverBackground', fallback: 'var(--si-accent-hover)' },
    { token: '--vscode-button-secondaryBackground', fallback: 'var(--si-surface-raised)' },
    { token: '--vscode-button-secondaryForeground', fallback: 'var(--si-text)' },
    { token: '--vscode-button-secondaryHoverBackground', fallback: 'var(--si-hover)' },
    { token: '--vscode-input-background', fallback: 'var(--si-surface)' },
    { token: '--vscode-input-foreground', fallback: 'var(--si-text)' },
    { token: '--vscode-input-border', fallback: 'var(--si-border)' },
    { token: '--vscode-input-placeholderForeground', fallback: 'var(--si-muted)' },
    { token: '--vscode-dropdown-background', fallback: 'var(--si-surface)' },
    { token: '--vscode-dropdown-foreground', fallback: 'var(--si-text)' },
    { token: '--vscode-dropdown-border', fallback: 'var(--si-border)' },
    { token: '--vscode-inputValidation-errorBackground', fallback: 'var(--si-danger-bg)' },
    { token: '--vscode-inputValidation-errorForeground', fallback: 'var(--si-danger)' },
    { token: '--vscode-inputValidation-errorBorder', fallback: 'var(--si-danger)' },
    { token: '--vscode-badge-background', fallback: 'var(--si-active)' },
    { token: '--vscode-badge-foreground', fallback: 'var(--si-text)' },
    { token: '--vscode-descriptionForeground', fallback: 'var(--si-muted)' },
    { token: '--vscode-disabledForeground', fallback: 'var(--si-muted)' },
    { token: '--vscode-textLink-foreground', fallback: 'var(--si-accent)' },
    { token: '--vscode-errorForeground', fallback: 'var(--si-danger)' },
    { token: '--vscode-errorBackground', fallback: 'var(--si-danger-bg)' },
    { token: '--vscode-terminal-ansiRed', fallback: 'var(--si-danger)' },
    { token: '--vscode-terminal-ansiGreen', fallback: 'var(--si-success)' },
    { token: '--vscode-terminal-ansiYellow', fallback: 'var(--si-warning)' },
    { token: '--vscode-terminal-ansiBlue', fallback: 'var(--si-accent)' },
    { token: '--vscode-terminal-ansiMagenta', fallback: 'var(--si-magenta)' },
    { token: '--vscode-terminal-ansiCyan', fallback: 'var(--si-cyan)' },
    { token: '--vscode-font-family', fallback: 'var(--si-font-sans)' },
    { token: '--vscode-editor-font-family', fallback: 'var(--si-font-mono)' },
    { token: '--vscode-editor-font-size', fallback: '12px' },
    { token: '--vscode-font-size', fallback: '13px' },
];

/** Convention: `--si-*` aliases exist only where no `--vscode-*` token fits. */
export const SI_ALIASES: readonly string[] = [
    '--si-surface',
    '--si-surface-raised',
    '--si-text',
    '--si-muted',
    '--si-border',
    '--si-hover',
    '--si-active',
    '--si-accent',
    '--si-accent-hover',
    '--si-on-accent',
    '--si-success',
    '--si-on-success',
    '--si-focus',
    '--si-warning',
    '--si-danger',
    '--si-danger-bg',
    '--si-magenta',
    '--si-cyan',
    '--si-font-sans',
    '--si-font-mono',
    '--si-radius',
];
