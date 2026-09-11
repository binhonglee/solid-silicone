/** Docs pages: form controls. */
import { createSignal } from 'solid-js';
import { Checkbox, Cluster, Dropdown, FileInput, Radio, RadioGroup, SearchField, Slider, Stack, Switch, TextArea, TextInput } from 'solid-silicone';
import type { ComponentDoc } from './doc-model';

function DropdownDemo() {
    const [branch, setBranch] = createSignal('main');
    return (
        <Dropdown
            label="Branch"
            options={[{ value: 'main', label: 'main' }, { value: 'develop', label: 'develop' }, { value: 'feature/docs', label: 'feature/docs' }]}
            value={branch()}
            onChange={setBranch}
        />
    );
}

function LongDropdownDemo() {
    const [value, setValue] = createSignal('branch-20');
    const options = Array.from({ length: 30 }, (_, i) => {
        const name = `branch-${String(i + 1).padStart(2, '0')}`;
        return { value: name, label: name };
    });
    return <Dropdown label="Branch" options={options} value={value()} onChange={setValue} />;
}

export const formPages: ComponentDoc[] = [
    {
        slug: 'text-input',
        name: 'TextInput',
        description: 'Single-line text field. Carries the shared input chrome; behavior stays 100 percent native.',
        importSpec: "import { TextInput } from 'solid-silicone';",
        usage: '<TextInput placeholder="Repository name" aria-label="Repository name" />',
        preview: () => <TextInput placeholder="Repository name" aria-label="Repository name" />,
        variants: [
            {
                title: 'Types',
                description: 'The type prop passes through, so password, email, and number fields keep native behavior.',
                demo: () => (
                    <Stack gap="sm">
                        <TextInput placeholder="Name" aria-label="Name" />
                        <TextInput type="password" placeholder="Token" aria-label="Token" />
                        <TextInput type="number" placeholder="Port" aria-label="Port" />
                    </Stack>
                ),
            },
            {
                title: 'Disabled',
                description: 'Disabled and read-only states ride the native attributes with themed styling.',
                demo: () => (
                    <Stack gap="sm">
                        <TextInput placeholder="Editable" aria-label="Editable" />
                        <TextInput placeholder="Locked" aria-label="Locked" disabled />
                    </Stack>
                ),
            },
        ],
        api: [
            {
                name: 'TextInput',
                description: 'Native input with the shared text-input class. Extends all input attributes.',
                props: [
                    { name: 'type', type: 'string', defaultValue: '"text"', description: 'Native input type.' },
                    { name: 'placeholder', type: 'string', defaultValue: '-', description: 'Hint text.' },
                    { name: 'disabled', type: 'boolean', defaultValue: '-', description: 'Native disabled state.' },
                    { name: 'class', type: 'string', defaultValue: '-', description: 'Extra class for selector hooks.' },
                ],
            },
        ],
        related: [{ slug: 'text-area', label: 'TextArea' }, { slug: 'search-field', label: 'SearchField' }],
    },
    {
        slug: 'text-area',
        name: 'TextArea',
        description: 'Multi-line text field with the same chrome as TextInput. Used for commit bodies, bios, and notes.',
        importSpec: "import { TextArea } from 'solid-silicone';",
        usage: '<TextArea placeholder="Commit message" aria-label="Commit message" rows={4} />',
        preview: () => <TextArea placeholder="Commit message" aria-label="Commit message" rows={3} />,
        variants: [
            {
                title: 'Rows',
                description: 'Size with the native rows attribute. The field grows no chrome of its own.',
                demo: () => (
                    <Stack gap="sm">
                        <TextArea placeholder="One thought" aria-label="Short" rows={2} />
                        <TextArea placeholder="Full description" aria-label="Long" rows={5} />
                    </Stack>
                ),
            },
        ],
        api: [
            {
                name: 'TextArea',
                description: 'Native textarea with the shared text-input class. Extends all textarea attributes.',
                props: [
                    { name: 'rows', type: 'number', defaultValue: '-', description: 'Visible line count.' },
                    { name: 'placeholder', type: 'string', defaultValue: '-', description: 'Hint text.' },
                    { name: 'disabled', type: 'boolean', defaultValue: '-', description: 'Native disabled state.' },
                ],
            },
        ],
        related: [{ slug: 'text-input', label: 'TextInput' }],
    },
    {
        slug: 'search-field',
        name: 'SearchField',
        description: 'The shell search box: bordered box, leading search icon, transparent input, optional trailing slot for a clear button or mode toggle.',
        importSpec: "import { SearchField } from 'solid-silicone';",
        usage: '<SearchField placeholder="Search files" aria-label="Search files" />',
        preview: () => <SearchField placeholder="Search components" aria-label="Search components" />,
        variants: [
            {
                title: 'Trailing slot',
                description: 'Drop a clear button or toggle into trailing. Per-surface CSS may only size the box, never restyle it.',
                demo: () => (
                    <SearchField placeholder="Search with action" aria-label="Search with action" trailing={<button type="button">All</button>} />
                ),
            },
        ],
        api: [
            {
                name: 'SearchField',
                description: 'Search input with icon chrome. Extends all input attributes.',
                props: [
                    { name: 'trailing', type: 'JSX.Element', defaultValue: '-', description: 'Controls after the input.' },
                    { name: 'containerClass', type: 'string', defaultValue: '-', description: 'Sizing hook on the wrapping box.' },
                    { name: 'iconSize', type: 'number', defaultValue: '13', description: 'Leading icon size in px.' },
                ],
            },
        ],
        related: [{ slug: 'text-input', label: 'TextInput' }],
    },
    {
        slug: 'checkbox',
        name: 'Checkbox',
        description: 'Labeled checkbox. The label wraps the box, so the whole row toggles.',
        importSpec: "import { Checkbox } from 'solid-silicone';",
        usage: '<Checkbox label="Subscribe to releases" />',
        preview: () => (
            <Stack gap="sm">
                <Checkbox label="Subscribe to releases" />
                <Checkbox label="Pre-checked" checked />
            </Stack>
        ),
        variants: [
            {
                title: 'States',
                description: 'Checked, unchecked, and disabled ride native attributes. The box is custom-drawn: a circle that fills with the theme checkbox color.',
                demo: () => (
                    <Stack gap="sm">
                        <Checkbox label="Unchecked" />
                        <Checkbox label="Checked" checked />
                        <Checkbox label="Disabled" disabled />
                    </Stack>
                ),
            },
            {
                title: 'Indeterminate',
                description: 'Set the indeterminate flag for partial selection, e.g. some files staged. Renders a dash in the filled circle.',
                demo: () => (
                    <Checkbox label="Partially staged" ref={(el) => { el.indeterminate = true; }} />
                ),
            },
        ],
        api: [
            {
                name: 'Checkbox',
                description: 'Native checkbox plus label. Extends all input attributes.',
                props: [
                    { name: 'label', type: 'JSX.Element', defaultValue: '-', description: 'Visible label text. Required.' },
                    { name: 'checked', type: 'boolean', defaultValue: '-', description: 'Native checked state.' },
                    { name: 'labelClass', type: 'string', defaultValue: '-', description: 'Extra class on the label.' },
                ],
            },
        ],
        related: [{ slug: 'switch', label: 'Switch' }, { slug: 'radio-group', label: 'RadioGroup' }],
    },
    {
        slug: 'switch',
        name: 'Switch',
        description: 'On/off toggle for settings and feature flags. Renders a checkbox with role="switch" semantics.',
        importSpec: "import { Switch } from 'solid-silicone';",
        usage: '<Switch label="Enable auto-fetch" />',
        preview: () => (
            <Stack gap="sm">
                <Switch label="Enable auto-fetch" />
                <Switch label="Dark mode" checked />
            </Stack>
        ),
        variants: [
            {
                title: 'Label position',
                description: 'The label sits beside the track. Omit it for a bare switch with an aria-label.',
                demo: () => (
                    <Cluster>
                        <Switch label="With label" />
                        <Switch aria-label="Bare switch" />
                    </Cluster>
                ),
            },
        ],
        api: [
            {
                name: 'Switch',
                description: 'Native checkbox styled as a sliding switch. Extends all input attributes.',
                props: [
                    { name: 'label', type: 'JSX.Element', defaultValue: '-', description: 'Label beside the track.' },
                    { name: 'checked', type: 'boolean', defaultValue: '-', description: 'On state.' },
                    { name: 'disabled', type: 'boolean', defaultValue: '-', description: 'Native disabled state.' },
                ],
            },
        ],
        related: [{ slug: 'checkbox', label: 'Checkbox' }],
    },
    {
        slug: 'radio-group',
        name: 'RadioGroup',
        description: 'One-of-many choice. Radios share a native name; the group carries the radiogroup role.',
        importSpec: "import { Radio, RadioGroup } from 'solid-silicone';",
        usage: '<RadioGroup label="Theme">\n  <Radio name="theme" label="Light" />\n  <Radio name="theme" label="Dark" />\n</RadioGroup>',
        preview: () => (
            <RadioGroup label="Theme">
                <Radio name="demo-theme" label="Light" />
                <Radio name="demo-theme" label="Dark" />
                <Radio name="demo-theme" label="System" />
            </RadioGroup>
        ),
        variants: [
            {
                title: 'Grouped choice',
                description: 'Keep 2 to 5 options. Longer lists belong in a Dropdown; compact single-tap choices belong in a SegmentedControl.',
                demo: () => (
                    <RadioGroup label="Fetch interval">
                        <Radio name="demo-fetch" label="5 minutes" />
                        <Radio name="demo-fetch" label="15 minutes" />
                        <Radio name="demo-fetch" label="Never" />
                    </RadioGroup>
                ),
            },
        ],
        api: [
            {
                name: 'RadioGroup',
                description: 'Fieldset-like wrapper with radiogroup semantics.',
                props: [
                    { name: 'children', type: 'JSX.Element', defaultValue: '-', description: 'Radio options. Required.' },
                    { name: 'label', type: 'string', defaultValue: '-', description: 'Accessible group label.' },
                ],
            },
            {
                name: 'Radio',
                description: 'One native radio plus label. Extends all input attributes.',
                props: [
                    { name: 'label', type: 'JSX.Element', defaultValue: '-', description: 'Option label. Required.' },
                    { name: 'name', type: 'string', defaultValue: '-', description: 'Native group name.' },
                ],
            },
        ],
        related: [{ slug: 'checkbox', label: 'Checkbox' }, { slug: 'dropdown', label: 'Dropdown' }, { slug: 'segmented-control', label: 'SegmentedControl' }],
    },
    {
        slug: 'dropdown',
        name: 'Dropdown',
        description: 'Button-triggered option picker for visible choices of any length. Ports the sidebar view-mode pattern: value label plus arrow opens a listbox menu. Long lists scroll inside the menu.',
        importSpec: "import { Dropdown } from 'solid-silicone';",
        usage: 'const [branch, setBranch] = createSignal(\'main\');\n<Dropdown\n  label="Branch"\n  options={[{ value: \'main\', label: \'main\' }, { value: \'develop\', label: \'develop\' }]}\n  value={branch()}\n  onChange={setBranch}\n/>',
        preview: () => <DropdownDemo />,
        variants: [
            {
                title: 'Controlled value',
                description: 'Own the value signal. Picking an option calls onChange and closes the menu; Escape and outside clicks dismiss.',
                demo: () => <DropdownDemo />,
            },
            {
                title: 'Long lists',
                description: 'The menu shows about eleven rows and scrolls the rest. Opening centers the current value.',
                demo: () => <LongDropdownDemo />,
            },
            {
                title: 'Keyboard',
                description: 'Enter, Space, or arrows on the trigger open the menu. Typing on a focused trigger opens at the first label match. Arrows, Home, and End move between options, typing extends the match, Enter or Space picks, and Escape closes back onto the trigger. The trigger announces label plus current value.',
                demo: () => <DropdownDemo />,
            },
        ],
        api: [
            {
                name: 'Dropdown',
                description: 'Generic over the option value type. Owns its open state.',
                props: [
                    { name: 'options', type: 'readonly { value: T; label: string }[]', defaultValue: '-', description: 'Options of any length; the menu scrolls past about eleven rows. Required.' },
                    { name: 'value', type: 'T', defaultValue: '-', description: 'Selected value. Required.' },
                    { name: 'onChange', type: '(value: T) => void', defaultValue: '-', description: 'Selection handler. Required.' },
                    { name: 'label', type: 'string', defaultValue: '-', description: 'Accessible label; the trigger announces it plus the current value.' },
                    { name: 'disabled', type: 'boolean', defaultValue: '-', description: 'Disables the trigger.' },
                ],
            },
        ],
        related: [{ slug: 'radio-group', label: 'RadioGroup' }, { slug: 'menu', label: 'Menu' }, { slug: 'segmented-control', label: 'SegmentedControl' }],
    },
    {
        slug: 'slider',
        name: 'Slider',
        description: 'Range input for numeric settings like volume, zoom, or panel opacity.',
        importSpec: "import { Slider } from 'solid-silicone';",
        usage: '<Slider aria-label="Zoom" min={50} max={200} value={100} />',
        preview: () => <Slider aria-label="Zoom" min={0} max={100} value={40} />,
        variants: [
            {
                title: 'Bounds',
                description: 'Native min, max, and step shape the range. Pair with a value readout for precision.',
                demo: () => (
                    <Stack gap="sm">
                        <Slider aria-label="Coarse" min={0} max={100} value={25} />
                        <Slider aria-label="Stepped" min={0} max={10} step={1} value={7} />
                    </Stack>
                ),
            },
        ],
        api: [
            {
                name: 'Slider',
                description: 'Native range input. Extends all input attributes.',
                props: [
                    { name: 'min', type: 'number', defaultValue: '-', description: 'Range start.' },
                    { name: 'max', type: 'number', defaultValue: '-', description: 'Range end.' },
                    { name: 'step', type: 'number', defaultValue: '-', description: 'Step increment.' },
                    { name: 'value', type: 'number', defaultValue: '-', description: 'Current value.' },
                ],
            },
        ],
        related: [{ slug: 'dropdown', label: 'Dropdown' }],
    },
    {
        slug: 'file-input',
        name: 'FileInput',
        description: 'File picker with shared input chrome. The native input keeps behavior; the class carries the look.',
        importSpec: "import { FileInput } from 'solid-silicone';",
        usage: '<FileInput aria-label="Attach patch" accept=".patch,.diff" />',
        preview: () => <FileInput aria-label="Attach file" />,
        variants: [
            {
                title: 'Accepted types',
                description: 'Use accept to hint the picker. Multiple files ride the multiple attribute.',
                demo: () => <FileInput aria-label="Attach patch" accept=".patch,.diff" multiple />,
            },
        ],
        api: [
            {
                name: 'FileInput',
                description: 'Native file input. Extends all input attributes.',
                props: [
                    { name: 'accept', type: 'string', defaultValue: '-', description: 'Accepted MIME types or extensions.' },
                    { name: 'multiple', type: 'boolean', defaultValue: '-', description: 'Allow several files.' },
                ],
            },
        ],
        related: [{ slug: 'text-input', label: 'TextInput' }, { slug: 'button', label: 'Button' }],
    },
];
