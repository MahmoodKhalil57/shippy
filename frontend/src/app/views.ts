import type { Doc } from "../cms/types.ts";
import type { Access } from "./app.ts";

/**
 * Custom views (Payload `admin.components.views`): the element named by the config's `Component`,
 * usually `app-view` drawing a view endpoint (src/app/view). Project elements register themselves
 * from src/cms/components.
 */
import "./view/view.ts";

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
export function viewElement(tag: string, props: ViewProps & Record<string, unknown>): HTMLElement | null {
  if (!customElements.get(tag)) return null;
  const { access: _a, user: _u, ...rest } = props;
  const key = `${tag}|${JSON.stringify(rest)}|${props.user.id}`;
  let el = mounted.get(key);
  if (!el) {
    mounted.clear();
    el = document.createElement(tag);
    mounted.set(key, el);
  }
  Object.assign(el, props);
  return el;
}
