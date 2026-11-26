import type { Doc } from "../contracts/config.ts";
import type { Dashboard } from "../dashboard/context.ts";
import { fill, type Widget, type WidgetScope } from "../widgets/widget.ts";

export function asideCounts(d: Dashboard, user: Doc) {
  const scope: WidgetScope = { user: user as WidgetScope["user"], params: {} };
  const visible = (list: Widget[]): Widget[] =>
    list.flatMap((w) => {
      if (w.visible && !w.visible(scope)) return [];
      if (w.grid) return visible(w.grid);
      if (w.split) return visible([...w.split.main, ...w.split.side]);
      return [w];
    });
  return visible(d.project.settings.aside ?? []).flatMap((w) => {
    const spec = w.counts;
    if (!spec || !("items" in spec)) return [];
    return spec.items.map((x) => ({ ...x, collection: x.collection ?? spec.collection, where: fill(x.where, scope) }));
  });
}
