/** Layout: Stack (vertical rhythm) and Cluster (wrapping row). */
import { splitProps } from 'solid-js';
import type { JSX } from 'solid-js';

export type StackGap = 'sm' | 'md' | 'lg';

export function Stack(props: { children: JSX.Element; gap?: StackGap; class?: string }): JSX.Element {
    const [local, rest] = splitProps(props, ['gap', 'class']);
    const gap = (): StackGap => local.gap ?? 'md';
    return (
        <div {...rest} class={local.class ? `si-stack si-stack-${gap()} ${local.class}` : `si-stack si-stack-${gap()}`}>
            {props.children}
        </div>
    );
}

export function Cluster(props: { children: JSX.Element; gap?: StackGap; class?: string }): JSX.Element {
    const [local, rest] = splitProps(props, ['gap', 'class']);
    const gap = (): StackGap => local.gap ?? 'sm';
    return (
        <div {...rest} class={local.class ? `si-cluster si-cluster-${gap()} ${local.class}` : `si-cluster si-cluster-${gap()}`}>
            {props.children}
        </div>
    );
}
