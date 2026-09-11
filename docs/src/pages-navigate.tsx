/** Docs pages: navigation primitives. */
import { createSignal } from 'solid-js';
import { Breadcrumb, Pagination, Stack, Stepper, Tabs } from 'solid-silicone';
import type { ComponentDoc } from './doc-model';

function TabsDemo() {
    const [tab, setTab] = createSignal('one');
    return <Tabs tabs={[{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }, { value: 'three', label: 'Three' }]} value={tab()} onChange={setTab} label="Demo tabs" />;
}

function PaginationDemo() {
    const [page, setPage] = createSignal(2);
    return <Pagination page={page()} pageCount={5} onChange={setPage} />;
}

export const navigatePages: ComponentDoc[] = [
    {
        slug: 'tabs',
        name: 'Tabs',
        description: 'Tab row for switching views. Controlled tablist with arrow-key friendly native buttons.',
        importSpec: "import { Tabs } from 'solid-silicone';",
        usage: 'const [tab, setTab] = createSignal(\'one\');\n<Tabs\n  tabs={[{ value: \'one\', label: \'One\' }, { value: \'two\', label: \'Two\' }]}\n  value={tab()}\n  onChange={setTab}\n  label="Views"\n/>',
        preview: () => <TabsDemo />,
        variants: [
            {
                title: 'Controlled tabs',
                description: 'Own the value signal and render the matching panel beside the row.',
                demo: () => <TabsDemo />,
            },
        ],
        api: [
            {
                name: 'Tabs',
                description: 'Generic over the tab value type.',
                props: [
                    { name: 'tabs', type: 'readonly { value: T; label: string }[]', defaultValue: '-', description: 'Tabs to render. Required.' },
                    { name: 'value', type: 'T', defaultValue: '-', description: 'Selected tab. Required.' },
                    { name: 'onChange', type: '(value: T) => void', defaultValue: '-', description: 'Selection handler. Required.' },
                    { name: 'label', type: 'string', defaultValue: '-', description: 'Accessible label for the tablist.' },
                ],
            },
        ],
        related: [{ slug: 'segmented-control', label: 'SegmentedControl' }, { slug: 'breadcrumb', label: 'Breadcrumb' }],
    },
    {
        slug: 'breadcrumb',
        name: 'Breadcrumb',
        description: 'Location trail. Linked ancestors plus a current page marked with aria-current.',
        importSpec: "import { Breadcrumb } from 'solid-silicone';",
        usage: '<Breadcrumb items={[{ label: \'Home\', href: \'#/\' }, { label: \'Button\' }]} />',
        preview: () => <Breadcrumb items={[{ label: 'Home', href: '#/' }, { label: 'Components' }, { label: 'Button' }]} />,
        variants: [
            {
                title: 'Depth',
                description: 'Two to four crumbs read best. Collapse deeper trails in app code.',
                demo: () => <Breadcrumb items={[{ label: 'Home', href: '#/' }, { label: 'Library' }]} />,
            },
        ],
        api: [
            {
                name: 'Breadcrumb',
                description: 'nav with an ordered list trail.',
                props: [
                    { name: 'items', type: '{ label: string; href?: string }[]', defaultValue: '-', description: 'Crumbs; href-less last item is current. Required.' },
                ],
            },
        ],
        related: [{ slug: 'link', label: 'Link' }, { slug: 'tabs', label: 'Tabs' }],
    },
    {
        slug: 'pagination',
        name: 'Pagination',
        description: 'Page switcher with Prev/Next plus numbered buttons. Ends disable at the bounds.',
        importSpec: "import { Pagination } from 'solid-silicone';",
        usage: 'const [page, setPage] = createSignal(1);\n<Pagination page={page()} pageCount={8} onChange={setPage} />',
        preview: () => <PaginationDemo />,
        variants: [
            {
                title: 'Bounds',
                description: 'Prev disables on page one, Next on the last page. The current page carries aria-current.',
                demo: () => <PaginationDemo />,
            },
        ],
        api: [
            {
                name: 'Pagination',
                description: 'nav with page buttons.',
                props: [
                    { name: 'page', type: 'number', defaultValue: '-', description: 'Current 1-based page. Required.' },
                    { name: 'pageCount', type: 'number', defaultValue: '-', description: 'Total pages. Required.' },
                    { name: 'onChange', type: '(page: number) => void', defaultValue: '-', description: 'Page handler. Required.' },
                    { name: 'label', type: 'string', defaultValue: '"Pagination"', description: 'Accessible nav label.' },
                ],
            },
        ],
        related: [{ slug: 'tabs', label: 'Tabs' }],
    },
    {
        slug: 'stepper',
        name: 'Stepper',
        description: 'Progress through ordered steps. Done steps fill with the theme green; the current step carries aria-current.',
        importSpec: "import { Stepper } from 'solid-silicone';",
        usage: '<Stepper steps={[\'Pick\', \'Edit\', \'Ship\']} current={1} />',
        preview: () => <Stepper steps={['Pick', 'Edit', 'Ship']} current={1} />,
        variants: [
            {
                title: 'Position',
                description: 'current is zero-based. Steps before it read done, after it read upcoming.',
                demo: () => (
                    <Stack gap="sm">
                        <Stepper steps={['Pick', 'Edit', 'Ship']} current={0} />
                        <Stepper steps={['Pick', 'Edit', 'Ship']} current={2} />
                    </Stack>
                ),
            },
        ],
        api: [
            {
                name: 'Stepper',
                description: 'Ordered list of steps.',
                props: [
                    { name: 'steps', type: 'string[]', defaultValue: '-', description: 'Step labels. Required.' },
                    { name: 'current', type: 'number', defaultValue: '-', description: 'Zero-based current step. Required.' },
                ],
            },
        ],
        related: [{ slug: 'progress', label: 'Progress' }, { slug: 'tabs', label: 'Tabs' }],
    },
];
