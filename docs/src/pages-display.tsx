/** Docs pages: data display primitives. */
import { createSignal } from 'solid-js';
import type { JSX } from 'solid-js';
import { Avatar, Badge, Card, Cluster, DisclosureButton, Divider, EmptyState, Kbd, Link, Markdown, Stack, Table } from 'solid-silicone';
import * as icons from 'solid-silicone';
import type { ComponentDoc } from './doc-model';

function DisclosureDemo() {
    const [expanded, setExpanded] = createSignal(false);
    return (
        <Stack gap="sm">
            <div>
                <DisclosureButton expanded={expanded()} label="Details" onClick={() => setExpanded((v) => !v)} />
            </div>
            {expanded() && <p class="si-docs-hint">Hidden body.</p>}
        </Stack>
    );
}

const iconEntries: [string, (p: { size?: number }) => unknown][] = [
    ['Worktree', icons.Worktree], ['Branch', icons.Branch], ['Tag', icons.Tag], ['Sparkle', icons.Sparkle],
    ['Refresh', icons.Refresh], ['Search', icons.Search], ['Settings', icons.Settings], ['Repo', icons.Repo],
    ['Stash', icons.Stash], ['Push', icons.Push], ['Pull', icons.Pull], ['Star', icons.Star],
];

export const displayPages: ComponentDoc[] = [
    {
        slug: 'avatar',
        name: 'Avatar',
        description: 'User mark. Shows the photo when src exists, otherwise initials computed from the name.',
        importSpec: "import { Avatar } from 'solid-silicone';",
        usage: '<Avatar name="Ada Lovelace" />',
        preview: () => (
            <Cluster>
                <Avatar name="Ada Lovelace" />
                <Avatar name="Grace Hopper" />
                <Avatar name="Alan Turing" size={36} />
            </Cluster>
        ),
        variants: [
            {
                title: 'Sizes',
                description: 'Default 28px suits rows and comments. Scale up for profile headers.',
                demo: () => (
                    <Cluster>
                        <Avatar name="Ada Lovelace" size={20} />
                        <Avatar name="Ada Lovelace" size={28} />
                        <Avatar name="Ada Lovelace" size={44} />
                    </Cluster>
                ),
            },
        ],
        api: [
            {
                name: 'Avatar',
                description: 'Image avatar with initials fallback.',
                props: [
                    { name: 'name', type: 'string', defaultValue: '-', description: 'Full name; drives initials and alt text. Required.' },
                    { name: 'src', type: 'string', defaultValue: '-', description: 'Photo URL. Falls back to initials.' },
                    { name: 'size', type: 'number', defaultValue: '28', description: 'Square size in px.' },
                ],
            },
        ],
        related: [{ slug: 'badge', label: 'Badge' }],
    },
    {
        slug: 'badge',
        name: 'Badge',
        description: 'Small status pill for counts, ref names, and state flags. Surfaces keep semantic colors on their own class.',
        importSpec: "import { Badge } from 'solid-silicone';",
        usage: '<Badge>3 ahead</Badge>',
        preview: () => (
            <Cluster>
                <Badge>New</Badge>
                <Badge>3 ahead</Badge>
                <Badge>main</Badge>
            </Cluster>
        ),
        variants: [
            {
                title: 'Clickable badges',
                description: 'Pass onClick for badges that navigate, e.g. ref badges that jump to a commit.',
                demo: () => (
                    <Cluster>
                        <Badge onClick={() => {}}>v2.1.0</Badge>
                        <Badge dataRef="main">main</Badge>
                    </Cluster>
                ),
            },
        ],
        api: [
            {
                name: 'Badge',
                description: 'Pill with badge geometry.',
                props: [
                    { name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Pill content. Required.' },
                    { name: 'onClick', type: '(event: MouseEvent) => void', defaultValue: '-', description: 'Makes the badge clickable.' },
                    { name: 'title', type: 'string', defaultValue: '-', description: 'Tooltip text.' },
                    { name: 'dataRef', type: 'string', defaultValue: '-', description: 'Ref selector hook.' },
                    { name: 'dataTag', type: 'string', defaultValue: '-', description: 'Tag selector hook.' },
                ],
            },
        ],
        related: [{ slug: 'avatar', label: 'Avatar' }, { slug: 'kbd', label: 'Kbd' }],
    },
    {
        slug: 'card',
        name: 'Card',
        description: 'Titled content panel. Groups one idea: install steps, settings clusters, summary blocks.',
        importSpec: "import { Card } from 'solid-silicone';",
        usage: '<Card title="Install">\n  <p>One package, one provider.</p>\n</Card>',
        preview: () => (
            <Card title="Install">
                <p>One package, one provider, every VS Code theme.</p>
            </Card>
        ),
        variants: [
            {
                title: 'Untitled',
                description: 'Omit title for a plain panel.',
                demo: () => (
                    <Card>
                        <p>Body without a header.</p>
                    </Card>
                ),
            },
        ],
        api: [
            {
                name: 'Card',
                description: 'Section panel with optional title.',
                props: [
                    { name: 'title', type: 'JSX.Element', defaultValue: '-', description: 'Header title.' },
                    { name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Body content. Required.' },
                ],
            },
        ],
        related: [{ slug: 'empty-state', label: 'EmptyState' }],
    },
    {
        slug: 'table',
        name: 'Table',
        description: 'Read-only data table for string grids: teams, refs, settings summaries. Complex cells belong in app code.',
        importSpec: "import { Table } from 'solid-silicone';",
        usage: '<Table columns={[\'Name\', \'Role\']} rows={[[\'Ada\', \'Eng\']]} />',
        preview: () => <Table columns={['Name', 'Role']} rows={[['Ada', 'Eng'], ['Grace', 'Ops']]} />,
        variants: [
            {
                title: 'More rows',
                description: 'Rows render in order. Keep columns short; wide tables scroll the page.',
                demo: () => <Table columns={['Branch', 'Ahead']} rows={[['main', '0'], ['feature/docs', '3']]} />,
            },
        ],
        api: [
            {
                name: 'Table',
                description: 'Semantic table with thead scope attributes.',
                props: [
                    { name: 'columns', type: 'string[]', defaultValue: '-', description: 'Header labels. Required.' },
                    { name: 'rows', type: 'string[][]', defaultValue: '-', description: 'Body cells. Required.' },
                ],
            },
        ],
        related: [{ slug: 'card', label: 'Card' }],
    },
    {
        slug: 'kbd',
        name: 'Kbd',
        description: 'Keyboard hint mark. String children render as structured chords: key pills joined by a dimmed plus that can never read as a pressed key.',
        importSpec: "import { Kbd } from 'solid-silicone';",
        usage: '<p>Press <Kbd>Ctrl+K</Kbd> to search.</p>',
        preview: () => (
            <p>Press <Kbd>Ctrl+K</Kbd> to search, <Kbd>Esc</Kbd> to dismiss.</p>
        ),
        variants: [
            {
                title: 'Chords',
                description: 'Join keys with plus inside one Kbd. Each key renders semibold; the connector renders dimmed and hidden from screen readers.',
                demo: () => (
                    <Cluster>
                        <Kbd>Cmd+T</Kbd>
                        <Kbd>Ctrl+Shift+W</Kbd>
                    </Cluster>
                ),
            },
            {
                title: 'Literal Plus key',
                description: 'A trailing or leading plus is the Plus key itself and renders as its own pill, e.g. Ctrl++ is Ctrl plus Plus.',
                demo: () => (
                    <Cluster>
                        <Kbd>Ctrl++</Kbd>
                        <Kbd>+</Kbd>
                    </Cluster>
                ),
            },
            {
                title: 'Alternatives',
                description: 'Separate platform alternatives with slash runs. The separator renders dimmed between the chords.',
                demo: () => <Kbd>Cmd+T / Ctrl+T</Kbd>,
            },
        ],
        api: [
            {
                name: 'Kbd',
                description: 'Inline kbd mark.',
                props: [{ name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Key names. Required.' }],
            },
        ],
        related: [{ slug: 'badge', label: 'Badge' }],
    },
    {
        slug: 'link',
        name: 'Link',
        description: 'Themed anchor. Breadcrumb and nav links build on it; body links get the link color plus hover underline.',
        importSpec: "import { Link } from 'solid-silicone';",
        usage: '<Link href="https://github.com/binhonglee/solid-silicone">GitHub repo</Link>',
        preview: () => <Link href="https://github.com/binhonglee/solid-silicone">GitHub repo</Link>,
        variants: [
            {
                title: 'Inline links',
                description: 'Links inherit surrounding text size, so they sit naturally in paragraphs.',
                demo: () => <p>Read the <Link href="#/link">Link docs</Link> before styling anchors by hand.</p>,
            },
        ],
        api: [
            {
                name: 'Link',
                description: 'Anchor with shared link chrome. Extends all anchor attributes.',
                props: [{ name: 'href', type: 'string', defaultValue: '-', description: 'Target URL.' }],
            },
        ],
        related: [{ slug: 'breadcrumb', label: 'Breadcrumb' }],
    },
    {
        slug: 'divider',
        name: 'Divider',
        description: 'Rule between sections. Takes an optional centered label for grouped menus and sidebars.',
        importSpec: "import { Divider } from 'solid-silicone';",
        usage: '<Divider />\n<Divider label="Actions" />',
        preview: () => (
            <Stack gap="sm">
                <Divider />
                <Divider label="Actions" />
            </Stack>
        ),
        variants: [
            {
                title: 'Labeled',
                description: 'The label renders in a centered separator with the separator role.',
                demo: () => <Divider label="Danger zone" />,
            },
        ],
        api: [
            {
                name: 'Divider',
                description: 'hr, or labeled separator.',
                props: [{ name: 'label', type: 'string', defaultValue: '-', description: 'Centered label text.' }],
            },
        ],
        related: [{ slug: 'card', label: 'Card' }],
    },
    {
        slug: 'empty-state',
        name: 'EmptyState',
        description: 'The nothing-here placeholder. Pair a headline with one next action.',
        importSpec: "import { EmptyState } from 'solid-silicone';",
        usage: '<EmptyState>\n  <strong>No worktrees</strong>\n  <p>Create the first one to start.</p>\n</EmptyState>',
        preview: () => (
            <EmptyState>
                <strong>Nothing here</strong>
                <p>Create the first item.</p>
            </EmptyState>
        ),
        variants: [
            {
                title: 'With action',
                description: 'End with the control that resolves the state.',
                demo: () => (
                    <EmptyState>
                        <strong>No results</strong>
                        <p>Try a different search.</p>
                    </EmptyState>
                ),
            },
        ],
        api: [
            {
                name: 'EmptyState',
                description: 'Centered placeholder block.',
                props: [{ name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Headline plus guidance. Required.' }],
            },
        ],
        related: [{ slug: 'card', label: 'Card' }, { slug: 'spinner', label: 'Spinner' }],
    },
    {
        slug: 'markdown',
        name: 'Markdown',
        description: 'Rendered-markdown box for commit bodies, help text, and these docs. Handles headings, bold, code, and fenced blocks.',
        importSpec: "import { Markdown } from 'solid-silicone';",
        usage: '<Markdown text={"# Hello\\n\\n**Bold** plus `code`."} />',
        preview: () => <Markdown text={'# Hello\n\n**Bold** plus `code`.'} />,
        variants: [
            {
                title: 'Fenced code',
                description: 'Fences render as code blocks, which is how install snippets display.',
                demo: () => <Markdown text={'Run the install:\n\n```bash\nnpm i solid-silicone\n```'} />,
            },
        ],
        api: [
            {
                name: 'Markdown',
                description: 'Simple markdown renderer.',
                props: [
                    { name: 'text', type: 'string', defaultValue: '-', description: 'Markdown source. Required.' },
                    { name: 'class', type: 'string', defaultValue: '-', description: 'Extra classes, e.g. scroll.' },
                    { name: 'id', type: 'string', defaultValue: '-', description: 'Element id.' },
                ],
            },
        ],
        related: [{ slug: 'card', label: 'Card' }],
    },
    {
        slug: 'disclosure-button',
        name: 'DisclosureButton',
        description: 'Expand/collapse chevron on rows and sections. Rotates 90 degrees when expanded.',
        importSpec: "import { DisclosureButton } from 'solid-silicone';",
        usage: 'const [expanded, setExpanded] = createSignal(false);\n<DisclosureButton expanded={expanded()} label="Details" onClick={() => setExpanded((v) => !v)} />',
        preview: () => <DisclosureDemo />,
        variants: [
            {
                title: 'Controlled expansion',
                description: 'Own the expanded signal so the chevron and the revealed body stay in sync.',
                demo: () => <DisclosureDemo />,
            },
        ],
        api: [
            {
                name: 'DisclosureButton',
                description: 'Chevron button with aria-expanded. Extends button attributes.',
                props: [
                    { name: 'expanded', type: 'boolean', defaultValue: '-', description: 'Open state. Required.' },
                    { name: 'label', type: 'string', defaultValue: '-', description: 'Accessible label and tooltip.' },
                    { name: 'chevronSize', type: 'number', defaultValue: '16', description: 'Chevron size in px.' },
                ],
            },
        ],
        related: [{ slug: 'accordion', label: 'Accordion' }],
    },
    {
        slug: 'icons',
        name: 'Icons',
        description: 'One definition per glyph, imported as SolidJS components. Draw in currentColor; the label belongs on the wrapping control.',
        importSpec: "import { Branch, Worktree, Refresh } from 'solid-silicone';",
        usage: '<Branch size={14} />',
        preview: () => (
            <Cluster>
                {iconEntries.map(([label, Icon]) => (
                    <span title={label} style={{ display: 'inline-flex' }}>{(Icon as (p: { size?: number }) => JSX.Element)({ size: 18 })}</span>
                ))}
            </Cluster>
        ),
        variants: [
            {
                title: 'Git glyphs',
                description: 'Worktree, branch, tag, stash, push, and pull marks live beside the generic set.',
                demo: () => (
                    <Cluster>
                        <span style={{ display: 'inline-flex' }}>{icons.Worktree({ size: 18 })}</span>
                        <span style={{ display: 'inline-flex' }}>{icons.Branch({ size: 18 })}</span>
                        <span style={{ display: 'inline-flex' }}>{icons.Stash({ size: 18 })}</span>
                    </Cluster>
                ),
            },
        ],
        api: [
            {
                name: 'Icon',
                description: 'Every glyph shares this contract. Never hand-inline an svg in app code.',
                props: [
                    { name: 'size', type: 'number', defaultValue: 'glyph default', description: 'Square size in px.' },
                    { name: 'class', type: 'string', defaultValue: '-', description: 'Selector hook, not restyling.' },
                ],
            },
        ],
        related: [{ slug: 'button', label: 'Button' }],
    },
];
