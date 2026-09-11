# Solid Silicone

Plug-and-play SolidJS design system. Inside VS Code it follows the active theme; everywhere else it ships 16 bundled schemes.

## Install

```bash
npm i solid-silicone
```

Import the CSS once, before app CSS:

```ts
import 'solid-silicone/styles.css';
```

Wrap the app in the theme provider:

```tsx
import { ThemeProvider } from 'solid-silicone';

<ThemeProvider>{app}</ThemeProvider>
```

## VS Code themes

Each component reads `--vscode-*` variables first. It falls back to `--si-*` tokens. It falls back to bundled schemes.

Modes:

- `vscode`: read host variables. Load no scheme CSS.
- `bundled`: use `data-scheme` plus `data-theme`.
- `auto`: use host variables when present, else bundled. See `resolveThemeSource`.

Load one scheme:

```ts
import 'solid-silicone/schemes/dracula.css';
```

Or load all schemes via `buildAppearanceStylesheetLinkTags`.

## Docs

Open `docs/` for the landing page plus component browser. It shows each component in each scheme. Start it with no prior build step:

```bash
npm install
npm run dev --workspace=silicone-docs
```

## Develop

```bash
npm install
npm test --workspace=solid-silicone
npm run lint --workspace=solid-silicone
npm run build --workspace=solid-silicone
```

Layout:

- `packages/silicone/src/components`: the primitives.
- `packages/silicone/src/styles`: tokens plus layered chrome.
- `packages/silicone/src/theme`: schemes, typography, and host resolution.
- `packages/silicone/tests`: unit plus structural guard tests.
- `docs/src`: the component browser app.
