import type { Doc } from "../contracts/config.ts";
import type { Access } from "./app.ts";

import "./widgets/host.ts";

export interface ViewProps {
  access: Access;
  user: Doc & { collection: string };
  slug?: string;
  docId?: string;
}

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
