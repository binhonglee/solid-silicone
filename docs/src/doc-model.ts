/** Shared model for one-per-component docs pages. */
import type { JSX } from 'solid-js';

export interface PropRow {
    name: string;
    type: string;
    defaultValue: string;
    description: string;
}

export interface VariantDoc {
    title: string;
    description: string;
    /** Thunk so demo state constructs on render, never at module load. */
    demo: () => JSX.Element;
}

export interface ApiSection {
    name: string;
    description: string;
    props: PropRow[];
}

export interface RelatedLink {
    slug: string;
    label: string;
}

export interface ComponentDoc {
    /** URL slug: the page lives at `#/slug`. */
    slug: string;
    name: string;
    description: string;
    /** Single-line import, e.g. `import { Button } from 'solid-silicone';` */
    importSpec: string;
    /** Fenced usage snippet shown under Usage. */
    usage: string;
    /** Hero demo shown under Preview. Thunk, like variants. */
    preview: () => JSX.Element;
    variants: VariantDoc[];
    api: ApiSection[];
    related?: RelatedLink[];
}

export interface DocCategory {
    id: string;
    label: string;
    pages: ComponentDoc[];
}
