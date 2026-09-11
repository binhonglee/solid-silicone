/** One-per-component page shell: preview, usage, variants, API. */
import { For, Show } from 'solid-js';
import type { JSX } from 'solid-js';
import { Link, Stack, Table } from 'solid-silicone';
import type { ComponentDoc } from './doc-model';
import CodeBlock from './CodeBlock';

export default function ComponentDocPage(props: { doc: ComponentDoc }): JSX.Element {
    const doc = (): ComponentDoc => props.doc;
    return (
        <Stack gap="lg" class="si-docs-page">
            <div>
                <h1>{doc().name}</h1>
                <p class="si-docs-lead">{doc().description}</p>
            </div>
            <section>
                <h2>Preview</h2>
                <div class="si-docs-demo"><div class="si-docs-demo-body">{doc().preview()}</div></div>
            </section>
            <section>
                <h2>Usage</h2>
                <p class="si-docs-hint">Install the package once (<code>npm i solid-silicone</code> plus the base CSS and one scheme stylesheet), then import per component:</p>
                <CodeBlock language="tsx" code={doc().importSpec + '\n\n' + doc().usage} />
            </section>
            <For each={doc().variants}>
                {(v) => (
                    <section>
                        <h2>{v.title}</h2>
                        <p class="si-docs-hint">{v.description}</p>
                        <div class="si-docs-demo"><div class="si-docs-demo-body">{v.demo()}</div></div>
                    </section>
                )}
            </For>
            <section>
                <h2>API Reference</h2>
                <For each={doc().api}>
                    {(section) => (
                        <div class="si-docs-api">
                            <h3><code>{section.name}</code></h3>
                            <p class="si-docs-hint">{section.description}</p>
                            <Table
                                columns={['Prop', 'Type', 'Default', 'Description']}
                                rows={section.props.map((p) => [p.name, p.type, p.defaultValue, p.description])}
                            />
                        </div>
                    )}
                </For>
            </section>
            <Show when={doc().related !== undefined && doc().related!.length > 0}>
                <section>
                    <h2>Related</h2>
                    <ul class="si-docs-related">
                        <For each={doc().related!}>{(r) => <li><Link href={`#/${r.slug}`}>{r.label}</Link></li>}</For>
                    </ul>
                </section>
            </Show>
        </Stack>
    );
}
