/** Docs pages: action controls. */
import { createSignal } from 'solid-js';
import { Button, ButtonGroup, CloseButton, Cluster, SegmentedControl } from 'solid-silicone';
import type { ComponentDoc } from './doc-model';

function SegmentedDemo() {
    const [range, setRange] = createSignal('Week');
    return (
        <SegmentedControl
            options={[{ value: 'Day', label: 'Day' }, { value: 'Week', label: 'Week' }, { value: 'Month', label: 'Month' }]}
            value={range()}
            onChange={setRange}
            label="Range"
        />
    );
}

const button: ComponentDoc = {
    slug: 'button',
    name: 'Button',
    description: 'Triggers an action. Four variants cover primary calls to destructive confirms, plus a compact size for row actions.',
    importSpec: "import { Button } from 'solid-silicone';",
    usage: '<Button variant="primary" onClick={save}>\n  Save changes\n</Button>',
    preview: () => (
        <Cluster>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger">Danger</Button>
        </Cluster>
    ),
    variants: [
        {
            title: 'Variants',
            description: 'Primary is the single main action per surface. Secondary is the default. Outline suits quiet toolbars. Danger confirms destructive work.',
            demo: () => (
                <Cluster>
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="danger">Danger</Button>
                </Cluster>
            ),
        },
        {
            title: 'Small',
            description: 'Use size="sm" for compact row and table actions where a full button would dominate.',
            demo: () => (
                <Cluster>
                    <Button variant="secondary" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">View</Button>
                    <Button variant="danger" size="sm">Delete</Button>
                </Cluster>
            ),
        },
        {
            title: 'Button group',
            description: 'Wrap segments in ButtonGroup for split actions and toggle clusters.',
            demo: () => (
                <ButtonGroup aria-label="Export">
                    <Button segment active>CSV</Button>
                    <Button segment>JSON</Button>
                    <Button segment>Markdown</Button>
                </ButtonGroup>
            ),
        },
    ],
    api: [
        {
            name: 'Button',
            description: 'A native button with shared chrome. Forwards all button attributes (disabled, type, aria-*).',
            props: [
                { name: 'variant', type: '"primary" | "secondary" | "outline" | "danger"', defaultValue: '"secondary"', description: 'Visual weight of the action.' },
                { name: 'size', type: '"sm"', defaultValue: '-', description: 'Compact height for row actions.' },
                { name: 'segment', type: 'boolean', defaultValue: 'false', description: 'Render as a segment of a ButtonGroup.' },
                { name: 'active', type: 'boolean', defaultValue: 'false', description: 'Selected state for segments.' },
                { name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Label content.' },
            ],
        },
        {
            name: 'ButtonGroup',
            description: 'Row container that fuses segment borders into one control.',
            props: [
                { name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Segment buttons.' },
                { name: 'aria-label', type: 'string', defaultValue: '-', description: 'Accessible label for the group.' },
            ],
        },
    ],
    related: [{ slug: 'segmented-control', label: 'SegmentedControl' }, { slug: 'close-button', label: 'CloseButton' }],
};

const closeButton: ComponentDoc = {
    slug: 'close-button',
    name: 'CloseButton',
    description: 'The one dismiss button. Every overlay close, toast dismiss, and sidebar collapse uses it, so the glyph stays identical.',
    importSpec: "import { CloseButton } from 'solid-silicone';",
    usage: '<CloseButton label="Close panel" onClick={close} />',
    preview: () => <CloseButton label="Close" onClick={() => {}} />,
    variants: [
        {
            title: 'Sizes',
            description: 'Default 12px suits headers and toasts. Step up for touch-sized dialog corners.',
            demo: () => (
                <Cluster>
                    <CloseButton label="Close" onClick={() => {}} />
                    <CloseButton label="Close" size={16} onClick={() => {}} />
                    <CloseButton label="Close" size={20} onClick={() => {}} />
                </Cluster>
            ),
        },
    ],
    api: [
        {
            name: 'CloseButton',
            description: 'Icon button with the shared close glyph. Label doubles as tooltip and accessible name.',
            props: [
                { name: 'onClick', type: '(event: MouseEvent) => void', defaultValue: '-', description: 'Dismiss handler. Required.' },
                { name: 'label', type: 'string', defaultValue: '"Close"', description: 'Accessible label and tooltip.' },
                { name: 'size', type: 'number', defaultValue: '12', description: 'Icon size in px.' },
                { name: 'id', type: 'string', defaultValue: '-', description: 'Element id for selector hooks.' },
                { name: 'class', type: 'string', defaultValue: '-', description: 'Extra class for selector hooks.' },
            ],
        },
    ],
    related: [{ slug: 'button', label: 'Button' }, { slug: 'dialog', label: 'Dialog' }],
};

const segmentedControl: ComponentDoc = {
    slug: 'segmented-control',
    name: 'SegmentedControl',
    description: 'Picks one option from a short list. A controlled ButtonGroup where exactly one segment stays active.',
    importSpec: "import { SegmentedControl } from 'solid-silicone';",
    usage: 'const [range, setRange] = createSignal(\'Week\');\n<SegmentedControl\n  options={[{ value: \'Day\', label: \'Day\' }, { value: \'Week\', label: \'Week\' }]}\n  value={range()}\n  onChange={setRange}\n  label="Range"\n/>',
    preview: () => <SegmentedDemo />,
    variants: [
        {
            title: 'Controlled selection',
            description: 'Own the value signal. The control is stateless, so the selection can drive queries or filters elsewhere.',
            demo: () => <SegmentedDemo />,
        },
    ],
    api: [
        {
            name: 'SegmentedControl',
            description: 'Generic over the option value type. Renders one Button segment per option.',
            props: [
                { name: 'options', type: 'readonly { value: T; label: string }[]', defaultValue: '-', description: 'Segments to render. Required.' },
                { name: 'value', type: 'T', defaultValue: '-', description: 'Selected value. Required.' },
                { name: 'onChange', type: '(value: T) => void', defaultValue: '-', description: 'Selection handler. Required.' },
                { name: 'label', type: 'string', defaultValue: '-', description: 'Accessible label for the group.' },
            ],
        },
    ],
    related: [{ slug: 'button', label: 'Button' }, { slug: 'tabs', label: 'Tabs' }],
};

export const actionPages: ComponentDoc[] = [button, closeButton, segmentedControl];
