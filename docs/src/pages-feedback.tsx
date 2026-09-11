/** Docs pages: feedback primitives. */
import { Alert, Cluster, Progress, Skeleton, Spinner, Stack, Toast } from 'solid-silicone';
import type { ComponentDoc } from './doc-model';

export const feedbackPages: ComponentDoc[] = [
    {
        slug: 'alert',
        name: 'Alert',
        description: 'Callout for user attention. Four tones map to the theme palette, with an optional title row.',
        importSpec: "import { Alert } from 'solid-silicone';",
        usage: '<Alert tone="warning" title="Uncommitted changes">\n  Stash or commit before switching branches.\n</Alert>',
        preview: () => (
            <Alert tone="info" title="Heads up">
                You can add components and dependencies to your app using the package manager.
            </Alert>
        ),
        variants: [
            {
                title: 'Tones',
                description: 'Info, success, warning, and danger cover notices through errors.',
                demo: () => (
                    <Stack gap="sm">
                        <Alert tone="info" title="Info">Heads up.</Alert>
                        <Alert tone="success" title="Done">It worked.</Alert>
                        <Alert tone="warning" title="Careful">Check this.</Alert>
                        <Alert tone="danger" title="Error">It failed.</Alert>
                    </Stack>
                ),
            },
            {
                title: 'Without title',
                description: 'Omit title for a single-line notice.',
                demo: () => <Alert tone="success">Branch created.</Alert>,
            },
        ],
        api: [
            {
                name: 'Alert',
                description: 'Notice box with role="alert".',
                props: [
                    { name: 'tone', type: '"info" | "success" | "warning" | "danger"', defaultValue: '"info"', description: 'Color and emphasis.' },
                    { name: 'title', type: 'JSX.Element', defaultValue: '-', description: 'Title row above the body.' },
                    { name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Body content. Required.' },
                ],
            },
        ],
        related: [{ slug: 'toast', label: 'Toast' }],
    },
    {
        slug: 'toast',
        name: 'Toast',
        description: 'Transient status notice. Renders inline here; apps stack them in a toast region with timers.',
        importSpec: "import { Toast } from 'solid-silicone';",
        usage: '<Toast title="Saved" onClose={dismiss}>\n  Changes are live.\n</Toast>',
        preview: () => <Toast title="Saved">Changes are live.</Toast>,
        variants: [
            {
                title: 'Dismissible',
                description: 'Pass onClose to add the dismiss button. Without it the toast is purely informational.',
                demo: () => (
                    <Stack gap="sm">
                        <Toast title="Saved">Changes are live.</Toast>
                        <Toast title="Syncing" onClose={() => {}}>Pulling remote refs.</Toast>
                    </Stack>
                ),
            },
        ],
        api: [
            {
                name: 'Toast',
                description: 'Status card with role="status".',
                props: [
                    { name: 'title', type: 'JSX.Element', defaultValue: '-', description: 'Title row.' },
                    { name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Body content.' },
                    { name: 'onClose', type: '() => void', defaultValue: '-', description: 'Adds a dismiss button.' },
                ],
            },
        ],
        related: [{ slug: 'alert', label: 'Alert' }, { slug: 'spinner', label: 'Spinner' }],
    },
    {
        slug: 'progress',
        name: 'Progress',
        description: 'Determinate progress bar with full progressbar semantics for fetch, clone, and push operations.',
        importSpec: "import { Progress } from 'solid-silicone';",
        usage: '<Progress value={done} max={total} label="Cloning repository" />',
        preview: () => <Progress value={60} label="Cloning repository" />,
        variants: [
            {
                title: 'Values',
                description: 'Values clamp to 0-100 percent. Set max for non-percent scales.',
                demo: () => (
                    <Stack gap="sm">
                        <Progress value={15} label="Starting" />
                        <Progress value={60} label="Halfway" />
                        <Progress value={100} label="Done" />
                    </Stack>
                ),
            },
        ],
        api: [
            {
                name: 'Progress',
                description: 'Bar with role="progressbar" and value attributes.',
                props: [
                    { name: 'value', type: 'number', defaultValue: '-', description: 'Current amount. Required.' },
                    { name: 'max', type: 'number', defaultValue: '100', description: 'Scale maximum.' },
                    { name: 'label', type: 'string', defaultValue: '-', description: 'Accessible label.' },
                ],
            },
        ],
        related: [{ slug: 'spinner', label: 'Spinner' }, { slug: 'skeleton', label: 'Skeleton' }],
    },
    {
        slug: 'skeleton',
        name: 'Skeleton',
        description: 'Loading placeholder that holds layout while content streams in. Pair one per pending block.',
        importSpec: "import { Skeleton } from 'solid-silicone';",
        usage: '<Skeleton width="60%" height="14px" />',
        preview: () => (
            <Stack gap="sm">
                <Skeleton width="40%" height="14px" />
                <Skeleton width="85%" height="14px" />
                <Skeleton width="65%" height="14px" />
            </Stack>
        ),
        variants: [
            {
                title: 'Shapes',
                description: 'Size with width and height. Blocks, lines, and avatar squares all work.',
                demo: () => (
                    <Cluster>
                        <Skeleton width="48px" height="48px" />
                        <Stack gap="sm">
                            <Skeleton width="180px" height="14px" />
                            <Skeleton width="120px" height="14px" />
                        </Stack>
                    </Cluster>
                ),
            },
        ],
        api: [
            {
                name: 'Skeleton',
                description: 'aria-hidden placeholder block.',
                props: [
                    { name: 'width', type: 'string', defaultValue: '-', description: 'CSS width.' },
                    { name: 'height', type: 'string', defaultValue: '-', description: 'CSS height.' },
                ],
            },
        ],
        related: [{ slug: 'spinner', label: 'Spinner' }, { slug: 'progress', label: 'Progress' }],
    },
    {
        slug: 'spinner',
        name: 'Spinner',
        description: 'Indeterminate loading mark. The only spin animation in the codebase.',
        importSpec: "import { Spinner } from 'solid-silicone';",
        usage: '<Cluster>\n  <Spinner />\n  <span>Loading history</span>\n</Cluster>',
        preview: () => (
            <Cluster>
                <Spinner />
                <span>Loading</span>
            </Cluster>
        ),
        variants: [
            {
                title: 'Sizes',
                description: 'Default fits inline text. Step up for panel-level loading states.',
                demo: () => (
                    <Cluster>
                        <Spinner />
                        <Spinner size={20} />
                        <Spinner size={28} />
                    </Cluster>
                ),
            },
        ],
        api: [
            {
                name: 'Spinner',
                description: 'aria-hidden animated mark.',
                props: [
                    { name: 'size', type: 'number', defaultValue: '-', description: 'Square size in px.' },
                ],
            },
        ],
        related: [{ slug: 'skeleton', label: 'Skeleton' }, { slug: 'progress', label: 'Progress' }],
    },
];
