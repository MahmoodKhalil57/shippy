import type { Action, CollectionAction, CollectionSettings } from "saastemlycrm-design-system/contracts";
import { matches } from "saastemlycrm-design-system/payload";
import type { CollectionConfig } from "payload";

type Doc = Record<string, unknown>;

/** The value at a dotted path (`case.caseId`), through populated relationships and groups. */
const at = (v: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((x, k) => (x && typeof x === "object" ? (x as Doc)[k] : undefined), v);
const text = (x: unknown): string =>
  typeof x === "string" || typeof x === "number" ? String(x) : x && typeof x === "object" ? text((x as Doc).id) : "";

/** `$row.…`, `$item.…`, `$index` in an action's strings, filled as the dashboard fills them. */
function filled<T>(value: T, values: Record<string, unknown>): T {
  const roots = Object.keys(values).join("|");
  const whole = new RegExp(String.raw`^\$(${roots})(?:\.(\w+(?:\.\w+)*))?$`);
  const part = new RegExp(String.raw`\$(${roots})(?:\.(\w+(?:\.\w+)*))?`, "g");
  const get = (root: string, path?: string) => (path ? at(values[root], path) : values[root]);
  const walk = (v: unknown): unknown => {
    if (typeof v === "string") {
      const m = whole.exec(v);
      if (m) return get(m[1]!, m[2]);
      return v.replace(part, (_, root: string, path?: string) => text(get(root, path)));
    }
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    return v;
  };
  return walk(value) as T;
}

/**
 * What a person with this role can do to a document of this collection, as the dashboard offers it
 * wherever the collection's records show: its `custom.actions` that match the document (`when`) and
 * the role (`roles`), one per row of `each` (`itemWhen`), with `$row` / `$item` / `$index` filled.
 */
export function actionsOn(collection: CollectionConfig, doc: Doc, role: string): Action[] {
  return actionsFrom((collection.custom as CollectionSettings | undefined)?.actions, doc, role);
}

/**
 * The same for a row of an array field (a global's `connections`, `rules`, `shifts`): the array
 * field's own `custom.actions`, `$row` the row and `$parent` the document it's in.
 */
export function rowActionsOn(field: { custom?: unknown }, row: Doc, role: string, parent: Doc): Action[] {
  return actionsFrom((field.custom as CollectionSettings | undefined)?.actions, row, role, parent);
}

function actionsFrom(actions: CollectionAction[] | undefined, doc: Doc, role: string, parent?: Doc): Action[] {
  return (actions ?? []).flatMap((a) => {
    if (a.roles && !a.roles.includes(role)) return [];
    if (a.when && !matches(doc, a.when as never)) return [];
    const { when: _w, roles: _r, each, itemWhen, ...action } = a;
    const base = { row: doc, ...(parent ? { parent } : {}) };
    if (!each) return [filled(action as Action, base)];
    return ((at(doc, each) as Doc[] | undefined) ?? []).flatMap((item, index) =>
      itemWhen && !matches(item, itemWhen as never) ? [] : [filled(action as Action, { ...base, item, index })],
    );
  });
}
