/** Docs pages: floating primitives and layout primitives. */
import { createSignal, For } from 'solid-js';
import type { JSX } from 'solid-js';
import { Accordion, Button, Cluster, Popover, SplitPane, Stack, Tooltip } from 'solid-silicone';
import type { ComponentDoc } from './doc-model';

function SplitPaneDemo(props: { storageKey?: string; side?: 'first' | 'second'; drawerBreakpoint?: number }) {
    const rows = (prefix: string): string[] => Array.from({ length: 40 }, (_, i) => `${prefix} row ${i + 1}`);
    const list = (prefix: string): JSX.Element => (
        <div class="si-docs-split-list">
            <For each={rows(prefix)}>{(row) => <span>{row}</span>}</For>
        </div>
    );
    return (
        <div class="si-docs-split-box">
            <SplitPane
                first={list('Sessions')}
                second={list('Detail')}
                side={props.side}
                firstLabel="Sessions"
                secondLabel="Detail"
                initialPaneWidth={220}
                minFirst={140}
                minSecond={160}
                storageKey={props.storageKey}
                drawerBreakpoint={props.drawerBreakpoint}
            />
        </div>
    );
}

function PopoverDemo() {
    const [open, setOpen] = createSignal(true);
    return (
        <Stack gap="sm">
            <Cluster>
                <Button variant="secondary" onClick={() => setOpen((v) => !v)}>Toggle popover</Button>
            </Cluster>
            <Popover open={open()}>
                <p class="si-docs-hint">Pinned detour content.</p>
            </Popover>
        </Stack>
    );
}

export const floatingPages: ComponentDoc[] = [
    {
        slug: 'tooltip',
        name: 'Tooltip',
        description: 'Hover hint for icon buttons and truncated labels. Pure CSS, no positioning code.',
        importSpec: "import { Tooltip } from 'solid-silicone';",
        usage: '<Tooltip tip="Fetch all remotes">\n  <Button variant="secondary">Fetch</Button>\n</Tooltip>',
        preview: () => (
            <Tooltip tip="Helpful tip">
                <Button variant="secondary">Hover me</Button>
            </Tooltip>
        ),
        variants: [
            {
                title: 'On controls',
                description: 'Wrap any single child. Keep tips under a line.',
                demo: () => (
                    <Cluster>
                        <Tooltip tip="Create branch"><Button variant="secondary">New</Button></Tooltip>
                        <Tooltip tip="Push to origin"><Button variant="secondary">Push</Button></Tooltip>
                    </Cluster>
                ),
            },
        ],
        api: [
            {
                name: 'Tooltip',
                description: 'Hover wrapper with role="tooltip".',
                props: [
                    { name: 'tip', type: 'string', defaultValue: '-', description: 'Hint text. Required.' },
                    { name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Trigger element. Required.' },
                ],
            },
        ],
        related: [{ slug: 'popover', label: 'Popover' }],
    },
    {
        slug: 'popover',
        name: 'Popover',
        description: 'Pinned floating panel for detour content. The owner keeps the open signal; the popover only shows it.',
        importSpec: "import { Popover } from 'solid-silicone';",
        usage: 'const [open, setOpen] = createSignal(false);\n<Popover open={open()}>\n  <p>Detour content.</p>\n</Popover>',
        preview: () => <PopoverDemo />,
        variants: [
            {
                title: 'Owned state',
                description: 'Toggle from any trigger. Positioning and dismissal stay with the owner.',
                demo: () => <PopoverDemo />,
            },
        ],
        api: [
            {
                name: 'Popover',
                description: 'Conditional panel with role="dialog".',
                props: [
                    { name: 'open', type: 'boolean', defaultValue: '-', description: 'Visibility. Required.' },
                    { name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Panel content. Required.' },
                ],
            },
        ],
        related: [{ slug: 'tooltip', label: 'Tooltip' }, { slug: 'menu', label: 'Menu' }],
    },
    {
        slug: 'accordion',
        name: 'Accordion',
        description: 'Self-managed expander for details blocks. Owns its open signal; the trigger carries aria-expanded.',
        importSpec: "import { Accordion } from 'solid-silicone';",
        usage: '<Accordion title="Advanced options">\n  <p>Hidden body.</p>\n</Accordion>',
        preview: () => (
            <Accordion title="Details">
                <p>Hidden body.</p>
            </Accordion>
        ),
        variants: [
            {
                title: 'Default open',
                description: 'Pass open to start expanded.',
                demo: () => (
                    <Accordion title="Pre-expanded" open>
                        <p>Visible from the start.</p>
                    </Accordion>
                ),
            },
        ],
        api: [
            {
                name: 'Accordion',
                description: 'Trigger plus collapsible panel.',
                props: [
                    { name: 'title', type: 'JSX.Element', defaultValue: '-', description: 'Trigger label. Required.' },
                    { name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Panel body. Required.' },
                    { name: 'open', type: 'boolean', defaultValue: 'false', description: 'Initial open state.' },
                ],
            },
        ],
        related: [{ slug: 'disclosure-button', label: 'DisclosureButton' }],
    },
];

export const layoutPages: ComponentDoc[] = [
    {
        slug: 'split-pane',
        name: 'SplitPane',
        description: 'Resizable two-pane layout. Drag the divider to size the first pane; both panes scroll through their own content. Unifies the sidebar, details, and session-list dividers.',
        importSpec: "import { SplitPane } from 'solid-silicone';",
        usage: '<SplitPane\n  first={<SessionList />}\n  second={<SessionDetail />}\n  firstLabel="Sessions"\n  secondLabel="Detail"\n  initialPaneWidth={280}\n  storageKey="sessions-list-width"\n/>',
        preview: () => <SplitPaneDemo />,
        variants: [
            {
                title: 'Persisted width',
                description: 'Pass storageKey to remember the width across reloads. Values validate on load; garbage falls back to the initial width.',
                demo: () => <SplitPaneDemo storageKey="silicone-docs-split-demo" />,
            },
            {
                title: 'Keyboard resizing',
                description: 'Focus the divider and use Left/Right (Home/End jump to the minimums). The divider exposes its fill percent to assistive tech.',
                demo: () => <SplitPaneDemo />,
            },
            {
                title: 'Right-side pane',
                description: 'Side="second" sizes the right pane instead, for sidebars and details panes. Drag and arrow directions mirror.',
                demo: () => <SplitPaneDemo side="second" />,
            },
            {
                title: 'Overlay drawer on small screens',
                description: 'drawerBreakpoint collapses the first pane into an overlay drawer below that viewport width: a menu toggle that morphs into a close button, a default close inside the pane top right, a scrim, and Escape to close. Set showDrawerToggle false to place the toggle elsewhere (this site keeps it in the top bar) and drive drawerOpen yourself. Shrink the viewport below 760px to try it.',
                demo: () => <SplitPaneDemo drawerBreakpoint={760} />,
            },
        ],
        api: [
            {
                name: 'SplitPane',
                description: 'Flex row with a divider. Uncontrolled by default; pass paneWidth plus onPaneWidthChange for controlled mode.',
                props: [
                    { name: 'first', type: 'JSX.Element', defaultValue: '-', description: 'Left pane content. Required.' },
                    { name: 'second', type: 'JSX.Element', defaultValue: '-', description: 'Right pane content. Required.' },
                    { name: 'side', type: '"first" | "second"', defaultValue: '"first"', description: 'Which pane the divider sizes.' },
                    { name: 'initialPaneWidth', type: 'number', defaultValue: '280', description: 'Starting width of the sized pane in px.' },
                    { name: 'minFirst', type: 'number', defaultValue: '200', description: 'Minimum first-pane width.' },
                    { name: 'minSecond', type: 'number', defaultValue: '200', description: 'Minimum second-pane width.' },
                    { name: 'maxFirst', type: 'number', defaultValue: '-', description: 'Maximum first-pane width in px.' },
                    { name: 'maxSecond', type: 'number', defaultValue: '-', description: 'Maximum second-pane width in px.' },
                    { name: 'firstId', type: 'string', defaultValue: '-', description: 'Element id for the first pane.' },
                    { name: 'secondId', type: 'string', defaultValue: '-', description: 'Element id for the second pane.' },
                    { name: 'firstStyle', type: 'CSSProperties | string', defaultValue: '-', description: 'Inline style for the first pane.' },
                    { name: 'secondStyle', type: 'CSSProperties | string', defaultValue: '-', description: 'Inline style for the second pane.' },
                    { name: 'paneWidth', type: 'number', defaultValue: '-', description: 'Controlled width of the sized pane in px.' },
                    { name: 'onPaneWidthChange', type: '(width: number) => void', defaultValue: '-', description: 'Controlled width handler.' },
                    { name: 'storageKey', type: 'string', defaultValue: '-', description: 'localStorage persistence key.' },
                    { name: 'bodyClass', type: 'string', defaultValue: '"si-split-resizing"', description: 'Body class during drags.' },
                    { name: 'firstLabel', type: 'string', defaultValue: '-', description: 'Accessible pane and divider names.' },
                    { name: 'secondLabel', type: 'string', defaultValue: '-', description: 'Accessible pane name.' },
                    { name: 'drawerBreakpoint', type: 'number', defaultValue: '-', description: 'Viewport px below which the first pane becomes an overlay drawer.' },
                    { name: 'drawerToggleLabel', type: 'string', defaultValue: '"Open navigation"', description: 'Accessible label for the drawer toggle while closed.' },
                    { name: 'showDrawerToggle', type: 'boolean', defaultValue: 'true', description: 'False hides the floating toggle for custom placement; pair with controlled drawerOpen.' },
                    { name: 'showDrawerClose', type: 'boolean', defaultValue: 'true', description: 'False hides the in-pane close when the toggle already morphs into one.' },
                    { name: 'drawerOpen', type: 'boolean', defaultValue: '-', description: 'Controlled drawer open state.' },
                    { name: 'onDrawerOpenChange', type: '(open: boolean) => void', defaultValue: '-', description: 'Controlled drawer open handler.' },
                ],
            },
        ],
        related: [{ slug: 'stack', label: 'Stack' }, { slug: 'cluster', label: 'Cluster' }],
    },
    {
        slug: 'stack',
        name: 'Stack',
        description: 'Vertical rhythm primitive. One gap scale for every column layout instead of ad-hoc margins.',
        importSpec: "import { Stack } from 'solid-silicone';",
        usage: '<Stack gap="md">\n  <Card title="One">…</Card>\n  <Card title="Two">…</Card>\n</Stack>',
        preview: () => (
            <Stack gap="sm">
                <div class="si-docs-demo"><div class="si-docs-demo-body">First</div></div>
                <div class="si-docs-demo"><div class="si-docs-demo-body">Second</div></div>
            </Stack>
        ),
        variants: [
            {
                title: 'Gaps',
                description: 'sm for tight groups, md for sections, lg for page blocks.',
                demo: () => (
                    <Stack gap="lg">
                        <div class="si-docs-demo"><div class="si-docs-demo-body">Loose</div></div>
                        <Stack gap="sm">
                            <div class="si-docs-demo"><div class="si-docs-demo-body">Tight one</div></div>
                            <div class="si-docs-demo"><div class="si-docs-demo-body">Tight two</div></div>
                        </Stack>
                    </Stack>
                ),
            },
        ],
        api: [
            {
                name: 'Stack',
                description: 'Vertical flex column. Forwards div attributes.',
                props: [
                    { name: 'gap', type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: 'Spacing step.' },
                    { name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Stacked content. Required.' },
                ],
            },
        ],
        related: [{ slug: 'cluster', label: 'Cluster' }],
    },
    {
        slug: 'cluster',
        name: 'Cluster',
        description: 'Horizontal row primitive with wrapping. The one way to line up buttons, badges, and marks.',
        importSpec: "import { Cluster } from 'solid-silicone';",
        usage: '<Cluster>\n  <Button variant="primary">Save</Button>\n  <Button variant="secondary">Cancel</Button>\n</Cluster>',
        preview: () => (
            <Cluster>
                <Button variant="primary">Save</Button>
                <Button variant="secondary">Cancel</Button>
            </Cluster>
        ),
        variants: [
            {
                title: 'Wrapping rows',
                description: 'Items wrap onto new lines instead of overflowing narrow panels.',
                demo: () => (
                    <Cluster>
                        <Button variant="secondary">One</Button>
                        <Button variant="secondary">Two</Button>
                        <Button variant="secondary">Three</Button>
                        <Button variant="secondary">Four</Button>
                    </Cluster>
                ),
            },
        ],
        api: [
            {
                name: 'Cluster',
                description: 'Wrapping horizontal flex row. Forwards div attributes.',
                props: [
                    { name: 'gap', type: '"sm" | "md" | "lg"', defaultValue: '"sm"', description: 'Spacing step.' },
                    { name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Row content. Required.' },
                ],
            },
        ],
        related: [{ slug: 'stack', label: 'Stack' }, { slug: 'button', label: 'Button' }],
    },
];
