/** Category index plus slug lookup for the docs router. */
import type { ComponentDoc, DocCategory } from './doc-model';
import { actionPages } from './pages-actions';
import { formPages } from './pages-forms';
import { menuOverlayPages } from './pages-menus-overlays';
import { feedbackPages } from './pages-feedback';
import { displayPages } from './pages-display';
import { navigatePages } from './pages-navigate';
import { floatingPages, layoutPages } from './pages-floating-layout';

export const CATEGORIES: DocCategory[] = [
    { id: 'actions', label: 'Actions', pages: actionPages },
    { id: 'forms', label: 'Forms', pages: formPages },
    { id: 'menus-overlays', label: 'Menus & Overlays', pages: menuOverlayPages },
    { id: 'feedback', label: 'Feedback', pages: feedbackPages },
    { id: 'display', label: 'Display', pages: displayPages },
    { id: 'navigate', label: 'Navigate', pages: navigatePages },
    { id: 'floating', label: 'Floating', pages: floatingPages },
    { id: 'layout', label: 'Layout', pages: layoutPages },
];

const bySlug = new Map<string, ComponentDoc>();
for (const category of CATEGORIES) {
    for (const page of category.pages) {
        bySlug.set(page.slug, page);
    }
}

export function findPage(slug: string): ComponentDoc | undefined {
    return bySlug.get(slug);
}

export function pageCount(): number {
    return bySlug.size;
}
