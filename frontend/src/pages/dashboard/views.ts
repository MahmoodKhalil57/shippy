import type { Doc } from "../../cms/types.ts";
import type { Access } from "./app.ts";

/**
 * Custom views (Payload `admin.components.views`): each is a custom element in ./views, named by
 * its config's `Component`. Importing this module registers them all.
 */
import.meta.glob("./views/*.ts", { eager: true });

/** What every custom view receives. Edit tabs also get the document's collection and id. */
export interface ViewProps {
  access: Access;
  user: Doc & { collection: string };
  slug?: string;
  docId?: string;
}

/**
 * The element for a custom view, created once per view, document and user (so re-rendering the
 * app keeps it, and switching user or document starts it afresh). `null` until it's defined.
 */
const mounted = new Map<string, HTMLElement>();
export function viewElement(tag: string, props: ViewProps): HTMLElement | null {
  if (!customElements.get(tag)) return null;
  const key = `${tag}|${props.slug ?? ""}|${props.docId ?? ""}|${props.user.id}`;
  let el = mounted.get(key);
  if (!el) {
    mounted.clear();
    el = document.createElement(tag);
    mounted.set(key, el);
  }
  Object.assign(el, props);
  return el;
}
