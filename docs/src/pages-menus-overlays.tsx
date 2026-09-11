/** Docs pages: menus and overlays. */
import { createSignal } from 'solid-js';
import { Button, Cluster, Dialog, Menu, MenuItem, MenuSeparator, Overlay, OverlayHost, SearchOverlay, Stack } from 'solid-silicone';
import type { ComponentDoc } from './doc-model';

function DialogDemo(props: { ns: string }) {
    const [open, setOpen] = createSignal(false);
    return (
        <Stack gap="sm">
            <Cluster>
                <Button variant="primary" onClick={() => setOpen(true)}>Open dialog</Button>
            </Cluster>
            <Dialog
                rootId={`${props.ns}-dialog`}
                scrimId={`${props.ns}-dialog-scrim`}
                cardId={`${props.ns}-dialog-card`}
                open={open}
                onScrimClick={() => setOpen(false)}
                title="Discard changes?"
                actions={<Button variant="danger" onClick={() => setOpen(false)}>Discard</Button>}
            >
                <p>Uncommitted work in this file will be lost.</p>
            </Dialog>
        </Stack>
    );
}

function OverlayDemo(props: { ns: string }) {
    const [open, setOpen] = createSignal(false);
    return (
        <Stack gap="sm">
            <Cluster>
                <Button variant="secondary" onClick={() => setOpen(true)}>Open overlay</Button>
            </Cluster>
            <OverlayHost id={`${props.ns}-overlay`} open={open}>
                <Overlay id={`${props.ns}-demo`} title="Commit details" onClose={() => setOpen(false)}>
                    <p>Full-height panel for rich content like diffs and history.</p>
                </Overlay>
            </OverlayHost>
        </Stack>
    );
}

const SEARCH_DEMO_ITEMS = [
    { value: 'button', label: 'Button', hint: 'Actions', keywords: 'press click' },
    { value: 'menu', label: 'Menu', hint: 'Menus & Overlays', keywords: 'dropdown popup' },
    { value: 'dialog', label: 'Dialog', hint: 'Menus & Overlays', keywords: 'confirm prompt' },
    { value: 'overlay', label: 'Overlay', hint: 'Menus & Overlays', keywords: 'modal panel' },
    { value: 'search-field', label: 'SearchField', hint: 'Forms', keywords: 'input filter' },
    { value: 'text-input', label: 'TextInput', hint: 'Forms', keywords: 'input field' },
    { value: 'switch', label: 'Switch', hint: 'Forms', keywords: 'toggle boolean' },
    { value: 'table', label: 'Table', hint: 'Display', keywords: 'rows columns' },
];

function SearchOverlayDemo(props: { ns: string }) {
    const [open, setOpen] = createSignal(false);
    const [query, setQuery] = createSignal('');
    return (
        <Stack gap="sm">
            <Cluster>
                <Button variant="primary" onClick={() => { setQuery(''); setOpen(true); }}>Search components</Button>
            </Cluster>
            <SearchOverlay
                id={`${props.ns}-search`}
                open={open}
                onClose={() => setOpen(false)}
                query={query()}
                onQueryChange={setQuery}
                items={SEARCH_DEMO_ITEMS}
                onSelect={() => setOpen(false)}
                label="Search components"
                placeholder="Search components…"
            />
        </Stack>
    );
}

export const menuOverlayPages: ComponentDoc[] = [
    {
        slug: 'menu',
        name: 'Menu',
        description: 'Dropdown and context menu. Presentational primitives: the owner keeps open state, outside-click, and Escape handling.',
        importSpec: "import { Menu, MenuItem, MenuSeparator } from 'solid-silicone';",
        usage: '<Menu>\n  <MenuItem>Rename</MenuItem>\n  <MenuItem danger>Delete</MenuItem>\n  <MenuSeparator />\n  <MenuItem>Duplicate</MenuItem>\n</Menu>',
        preview: () => (
            <Menu>
                <MenuItem>Rename branch</MenuItem>
                <MenuItem danger>Delete branch</MenuItem>
                <MenuSeparator />
                <MenuItem>Copy name</MenuItem>
            </Menu>
        ),
        variants: [
            {
                title: 'Danger items',
                description: 'Mark destructive actions with danger. They render in the error foreground.',
                demo: () => (
                    <Menu>
                        <MenuItem>First</MenuItem>
                        <MenuItem danger>Delete</MenuItem>
                    </Menu>
                ),
            },
            {
                title: 'Grouped items',
                description: 'Separate action groups with MenuSeparator. Combine with fixed for cursor-anchored context menus.',
                demo: () => (
                    <Menu>
                        <MenuItem>Cut</MenuItem>
                        <MenuItem>Copy</MenuItem>
                        <MenuItem>Paste</MenuItem>
                        <MenuSeparator />
                        <MenuItem danger>Delete</MenuItem>
                    </Menu>
                ),
            },
        ],
        api: [
            {
                name: 'Menu',
                description: 'Menu container. Extends div attributes.',
                props: [
                    { name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Menu items and separators.' },
                    { name: 'fixed', type: 'boolean', defaultValue: 'false', description: 'Fixed instead of absolute positioning. Either way the owner anchors the menu: inline coordinates for fixed, a positioned ancestor for absolute.' },
                    { name: 'show', type: 'boolean', defaultValue: '-', description: 'Reactive visibility toggle.' },
                ],
            },
            {
                name: 'MenuItem',
                description: 'One native button row. Extends button attributes.',
                props: [
                    { name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Item label.' },
                    { name: 'danger', type: 'boolean', defaultValue: 'false', description: 'Destructive styling.' },
                ],
            },
            {
                name: 'MenuSeparator',
                description: 'Divider row between item groups. Takes no props.',
                props: [],
            },
        ],
        related: [{ slug: 'dialog', label: 'Dialog' }, { slug: 'popover', label: 'Popover' }],
    },
    {
        slug: 'dialog',
        name: 'Dialog',
        description: 'Confirm and prompt card: scrim, card, title, body, and actions. Every historical element id is passed in because handlers and tests key off them.',
        importSpec: "import { Dialog } from 'solid-silicone';",
        usage: 'const [open, setOpen] = createSignal(false);\n<Dialog\n  rootId="confirm"\n  scrimId="confirm-scrim"\n  cardId="confirm-card"\n  open={open}\n  onScrimClick={() => setOpen(false)}\n  title="Discard changes?"\n  actions={<Button variant="danger" onClick={discard}>Discard</Button>}\n>\n  <p>Uncommitted work will be lost.</p>\n</Dialog>',
        preview: () => <DialogDemo ns="preview" />,
        variants: [
            {
                title: 'Scrim dismissal',
                description: 'Pass onScrimClick for cancel-on-backdrop. Omit it for a modal that forces a choice.',
                demo: () => <DialogDemo ns="variant" />,
            },
        ],
        api: [
            {
                name: 'Dialog',
                description: 'Confirm card family. Render it inline; visibility rides the root display toggle.',
                props: [
                    { name: 'rootId', type: 'string', defaultValue: '-', description: 'Fullscreen container id. Required.' },
                    { name: 'scrimId', type: 'string', defaultValue: '-', description: 'Scrim id. Required.' },
                    { name: 'cardId', type: 'string', defaultValue: '-', description: 'Card id. Required.' },
                    { name: 'open', type: '() => boolean', defaultValue: '-', description: 'Reactive open state. Required.' },
                    { name: 'title', type: 'JSX.Element', defaultValue: '-', description: 'Card title. Required.' },
                    { name: 'actions', type: 'JSX.Element', defaultValue: '-', description: 'Action buttons row.' },
                    { name: 'onScrimClick', type: '() => void', defaultValue: '-', description: 'Backdrop click handler.' },
                    { name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Card body.' },
                ],
            },
        ],
        related: [{ slug: 'overlay', label: 'Overlay' }, { slug: 'menu', label: 'Menu' }],
    },
    {
        slug: 'overlay',
        name: 'Overlay',
        description: 'Full modal shell inside an OverlayHost island: backdrop, panel, header with close, optional stacked header rows and toolbar, body, footer.',
        importSpec: "import { Overlay, OverlayHost } from 'solid-silicone';",
        usage: 'const [open, setOpen] = createSignal(false);\n<OverlayHost id="details" open={open}>\n  <Overlay id="details" title="Commit details" onClose={() => setOpen(false)}>\n    <p>Body content.</p>\n  </Overlay>\n</OverlayHost>',
        preview: () => <OverlayDemo ns="preview" />,
        variants: [
            {
                title: 'Header actions',
                description: 'Slot extra controls between the title and the close button, or stack meta rows under the header.',
                demo: () => (
                    <OverlayHost id="docs-overlay-static" open={() => false}>
                        <Overlay id="docs-static" title="Closed example" onClose={() => {}}>
                            <p>Hosts toggle inline display from the open signal.</p>
                        </Overlay>
                    </OverlayHost>
                ),
            },
        ],
        api: [
            {
                name: 'OverlayHost',
                description: 'The island root. Owns the fullscreen layer and the display toggle.',
                props: [
                    { name: 'id', type: 'string', defaultValue: '-', description: 'Container id. Required.' },
                    { name: 'open', type: '() => boolean', defaultValue: '-', description: 'Reactive open state. Required.' },
                    { name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Overlay shell. Required.' },
                ],
            },
            {
                name: 'Overlay',
                description: 'Modal shell: backdrop, panel, header, body, optional footer.',
                props: [
                    { name: 'id', type: 'string', defaultValue: '-', description: 'Base id; inner ids derive from it. Required.' },
                    { name: 'title', type: 'JSX.Element', defaultValue: '-', description: 'Header title. Required.' },
                    { name: 'onClose', type: '() => void', defaultValue: '-', description: 'Backdrop and close-button handler. Required.' },
                    { name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Body content. Required.' },
                    { name: 'headerActions', type: 'JSX.Element', defaultValue: '-', description: 'Controls beside the close button.' },
                    { name: 'headerStack', type: 'JSX.Element', defaultValue: '-', description: 'Rows stacked under the title.' },
                ],
            },
        ],
        related: [{ slug: 'dialog', label: 'Dialog' }],
    },
    {
        slug: 'search-overlay',
        name: 'SearchOverlay',
        description: 'Spotlight-style search overlay. Steals the commit-search shape: input header, live filtering, arrow plus Enter plus Escape keys, selected-row scroll. This docs site search bar runs on it.',
        importSpec: "import { SearchOverlay } from 'solid-silicone';",
        usage: 'const [open, setOpen] = createSignal(false);\nconst [query, setQuery] = createSignal(\'\');\n<SearchOverlay\n  id="search"\n  open={open}\n  onClose={() => setOpen(false)}\n  query={query()}\n  onQueryChange={setQuery}\n  items={[{ value: \'button\', label: \'Button\', hint: \'Actions\' }]}\n  onSelect={(value) => goTo(value)}\n/>',
        preview: () => <SearchOverlayDemo ns="preview" />,
        variants: [
            {
                title: 'Owned state',
                description: 'The caller owns the open and query signals. Reset the query when opening, like commit search does. Empty queries show every item; pass showAllOnEmpty={false} for a type-to-search prompt instead.',
                demo: () => <SearchOverlayDemo ns="variant" />,
            },
        ],
        api: [
            {
                name: 'SearchOverlay',
                description: 'Full island: host, backdrop, titleless panel, input header, results, footer hints. Mount once; drive open.',
                props: [
                    { name: 'id', type: 'string', defaultValue: '-', description: 'Base id; backdrop, panel, input, list derive from it. Required.' },
                    { name: 'open', type: '() => boolean', defaultValue: '-', description: 'Reactive open state. Required.' },
                    { name: 'onClose', type: '() => void', defaultValue: '-', description: 'Backdrop, close button, and Escape handler. Required.' },
                    { name: 'query', type: 'string', defaultValue: '-', description: 'Controlled query text. Required.' },
                    { name: 'onQueryChange', type: '(query: string) => void', defaultValue: '-', description: 'Query writer. Required.' },
                    { name: 'items', type: 'readonly SearchOverlayItem[]', defaultValue: '-', description: 'Full item set; the overlay filters it live. Required.' },
                    { name: 'onSelect', type: '(value: string) => void', defaultValue: '-', description: 'Picked item value. Required.' },
                    { name: 'label', type: 'string', defaultValue: "'Search'", description: 'Panel and input label.' },
                    { name: 'placeholder', type: 'string', defaultValue: "'Search…'", description: 'Input placeholder.' },
                    { name: 'showAllOnEmpty', type: 'boolean', defaultValue: 'true', description: 'Show every item for an empty query.' },
                ],
            },
            {
                name: 'SearchOverlayItem',
                description: 'One searchable row. The filter matches label, hint, and keywords; only label and hint render.',
                props: [
                    { name: 'value', type: 'string', defaultValue: '-', description: 'Stable value for onSelect. Required.' },
                    { name: 'label', type: 'string', defaultValue: '-', description: 'Visible row label. Required.' },
                    { name: 'hint', type: 'string', defaultValue: '-', description: 'Right-side meta, e.g. a category.' },
                    { name: 'keywords', type: 'string', defaultValue: '-', description: 'Extra match text, never rendered.' },
                ],
            },
        ],
        related: [{ slug: 'overlay', label: 'Overlay' }, { slug: 'search-field', label: 'SearchField' }, { slug: 'menu', label: 'Menu' }],
    },
];
