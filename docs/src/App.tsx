/** Docs site: home plus one routed page per component (`#/slug`). */
import { For, Show, createMemo, createSignal, onCleanup, onMount } from 'solid-js';
import {
    COLOR_SCHEME_DEFINITIONS,
    Card,
    Close,
    DEFAULT_COLOR_SCHEME,
    Dropdown,
    GitHub,
    Kbd,
    Link,
    MenuBars,
    Search,
    SearchOverlay,
    SegmentedControl,
    SplitPane,
    Stack,
    applyThemeSettings,
} from 'solid-silicone';
import 'solid-silicone/styles.css';
import './docs.css';
import CodeBlock from './CodeBlock';
import ComponentDocPage from './ComponentDoc';
import { CATEGORIES, findPage, pageCount } from './all-pages';

/** Route is the hash path: '' for home, otherwise a component slug. */
function readRoute(): string {
    const hash = window.location.hash;
    return hash.startsWith('#/') ? hash.slice(2) : '';
}

export default function App() {
    const [route, setRoute] = createSignal(readRoute());
    const [scheme, setScheme] = createSignal(DEFAULT_COLOR_SCHEME);
    const [theme, setTheme] = createSignal<'light' | 'dark'>('dark');
    const [searchOpen, setSearchOpen] = createSignal(false);
    const [searchQuery, setSearchQuery] = createSignal('');
    const [navOpen, setNavOpen] = createSignal(false);

    const modKey = /mac|iphone|ipad/i.test(navigator.userAgent) ? 'Cmd' : 'Ctrl';

    /** Every component page as one flat search item. */
    const searchItems = createMemo(() =>
        CATEGORIES.flatMap((category) =>
            category.pages.map((p) => ({
                value: p.slug,
                label: p.name,
                hint: category.label,
                keywords: `${p.slug} ${p.description}`,
            })),
        ),
    );

    const openSearch = (): void => {
        setSearchQuery('');
        setSearchOpen(true);
    };

    const goToComponent = (slug: string): void => {
        setSearchOpen(false);
        window.location.hash = `#/${slug}`;
    };

    const applyAppearance = (nextScheme = scheme(), nextTheme = theme()): void => {
        if (nextTheme === 'light') {
            applyThemeSettings({ theme: 'light', lightColorScheme: nextScheme });
        } else {
            applyThemeSettings({ theme: 'dark', darkColorScheme: nextScheme });
        }
    };

    const schemeModes = (id: string): readonly string[] =>
        COLOR_SCHEME_DEFINITIONS.find((d) => d.id === id)?.modes ?? [];

    /** A theme offers a light/dark switch only when it ships both modes. */
    const hasBothModes = (): boolean => {
        const modes = schemeModes(scheme());
        return modes.includes('light') && modes.includes('dark');
    };

    const onSchemeChange = (id: string): void => {
        setScheme(id);
        // A light-only theme cannot render dark mode (and vice versa): fall
        // back to the mode the new theme actually ships.
        if (!schemeModes(id).includes(theme())) {
            const next = schemeModes(id).includes('dark') ? 'dark' : 'light';
            setTheme(next);
            applyAppearance(id, next);
        } else {
            applyAppearance(id, theme());
        }
    };

    onMount(() => {
        applyAppearance();
        const onHash = (): void => {
            // Legacy slug: Select merged into Dropdown.
            if (readRoute() === 'select') {
                window.location.hash = '#/dropdown';
                return;
            }
            setRoute(readRoute());
            setNavOpen(false);
            window.scrollTo(0, 0);
        };
        window.addEventListener('hashchange', onHash);
        onHash();
        // Global search shortcut (commit-search shape): Cmd/Ctrl+K toggles.
        // Never steal keystrokes from a focused field while closed.
        const onKey = (event: KeyboardEvent): void => {
            if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) {
                return;
            }
            if (searchOpen()) {
                event.preventDefault();
                setSearchOpen(false);
                return;
            }
            const target = event.target;
            if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
                return;
            }
            event.preventDefault();
            openSearch();
        };
        document.addEventListener('keydown', onKey);
        onCleanup(() => {
            window.removeEventListener('hashchange', onHash);
            document.removeEventListener('keydown', onKey);
        });
    });

    const page = (): ReturnType<typeof findPage> => (route() === '' ? undefined : findPage(route()));

    return (
        <div class="si-docs-shell">
            <header class="si-docs-topbar">
                <button
                    type="button"
                    class="si-split-drawer-toggle si-docs-nav-toggle"
                    aria-expanded={navOpen()}
                    aria-label={navOpen() ? 'Close navigation' : 'Open navigation'}
                    onClick={() => setNavOpen(!navOpen())}
                >
                    {navOpen() ? <Close size={14} /> : <MenuBars size={16} />}
                </button>
                <button type="button" class="si-docs-search-trigger" onClick={openSearch} aria-label={`Search components (${modKey}+K)`}>
                    <Search size={14} />
                    <span>Search components…</span>
                    <Kbd>{`${modKey}+K`}</Kbd>
                </button>
                <Link class="si-docs-github" href="https://github.com/binhonglee/solid-silicone" target="_blank" rel="noreferrer">
                    <GitHub size={14} />
                    <span>GitHub</span>
                </Link>
            </header>
            <SplitPane
                class="si-docs-root"
                drawerBreakpoint={760}
                drawerToggleLabel="Open navigation"
                showDrawerToggle={false}
                showDrawerClose={false}
                drawerOpen={navOpen()}
                onDrawerOpenChange={setNavOpen}
            first={
                <nav class="si-docs-nav" aria-label="Components">
                    <div class="si-docs-nav-pad">
                        <div class="si-docs-brand">
                            <strong><Link href="#/">Solid Silicone</Link></strong>
                            <span>SolidJS + VS Code themes</span>
                        </div>
                    </div>
                    <div class="si-docs-nav-scroll">
                        <For each={CATEGORIES}>
                            {(category) => (
                                <>
                                    <div class="si-docs-nav-group">{category.label}</div>
                                <For each={category.pages}>
                                    {(p) => (
                                        <Link href={`#/${p.slug}`} class={p.slug === route() ? 'active' : undefined}>
                                            {p.name}
                                        </Link>
                                    )}
                                </For>
                                </>
                            )}
                        </For>
                    </div>
                    <div class="si-docs-nav-pad">
                    <Stack gap="sm" class="si-docs-controls">
                        <div class="si-docs-field">
                            <span id="docs-theme-label">Theme</span>
                            <Dropdown
                                label="Theme"
                                options={COLOR_SCHEME_DEFINITIONS.map((d) => ({ value: d.id, label: d.label }))}
                                value={scheme()}
                                onChange={onSchemeChange}
                            />
                        </div>
                        <Show when={hasBothModes()}>
                            <div class="si-docs-field">
                                <SegmentedControl options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} value={theme()} onChange={(v) => { setTheme(v); applyAppearance(scheme(), v); }} label="Color mode" />
                            </div>
                        </Show>
                    </Stack>
                    </div>
                </nav>
            }
            second={
            <main class="si-docs-main">
                {route() === '' && (
                    <Stack gap="lg">
                        <div class="si-docs-hero">
                            <h1>Solid Silicone</h1>
                            <p>Plug-and-play SolidJS design system. Inside VS Code it follows the active theme; everywhere else it ships 16 bundled schemes. {pageCount()} components, one page each.</p>
                        </div>
                        <Card title="Install">
                            <Stack gap="sm">
                                <p class="si-docs-hint">Install one package. Wrap the app in one provider. The UI follows the active VS Code theme.</p>
                                <CodeBlock language="bash" code="npm i solid-silicone" />
                                <p class="si-docs-hint">Read <code>--vscode-*</code> variables when they exist. Fall back to bundled schemes when they do not.</p>
                            </Stack>
                        </Card>
                        <Card title="Theme contract">
                            <p>Use <Kbd>data-theme</Kbd> plus <Kbd>data-scheme</Kbd> on <Kbd>documentElement</Kbd>. Load <Kbd>silicone.css</Kbd> before app CSS. Pick a scheme on the left to preview every page.</p>
                        </Card>
                        <For each={CATEGORIES}>
                            {(category) => (
                                <Card title={category.label}>
                                    <ul class="si-docs-index">
                                        <For each={category.pages}>
                                            {(p) => (
                                                <li>
                                                    <Link href={`#/${p.slug}`}>{p.name}</Link>
                                                    <span>{p.description}</span>
                                                </li>
                                            )}
                                        </For>
                                    </ul>
                                </Card>
                            )}
                        </For>
                    </Stack>
                )}
                {route() !== '' && page() !== undefined && <ComponentDocPage doc={page()!} />}
                {route() !== '' && page() === undefined && (
                    <Stack gap="md">
                        <h1>Not found</h1>
                        <p class="si-docs-hint">No component lives at this URL. Pick one from the index.</p>
                        <p><Link href="#/">Back home</Link></p>
                    </Stack>
                )}
            </main>
            }
            firstLabel="Components"
            secondLabel="Docs"
            initialPaneWidth={280}
            minFirst={200}
            maxFirst={420}
            storageKey="silicone-docs-nav-width"
        />
            <SearchOverlay
                id="docs-search"
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
                query={searchQuery()}
                onQueryChange={setSearchQuery}
                items={searchItems()}
                onSelect={goToComponent}
                label="Search components"
                placeholder="Search components…"
            />
        </div>
    );
}
