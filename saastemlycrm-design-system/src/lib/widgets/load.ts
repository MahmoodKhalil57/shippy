import { localizeConfig } from "../i18n/index.ts";
import type { DataPort } from "../dashboard/context.ts";
import type { Project } from "../dashboard/project.ts";
import { expand } from "./data.ts";
import type { Source, Widget, WidgetScope } from "./widget.ts";

export async function loadSource(
  s: Source,
  scope: WidgetScope,
  data: DataPort,
  nested: (s: Source) => Promise<unknown> = (x) => loadSource(x, scope, data),
): Promise<unknown> {
  if ("all" in s)
    return Object.fromEntries(await Promise.all(Object.entries(s.all).map(async ([k, x]) => [k, await nested(x)])));
  if ("endpoint" in s) return localizeConfig(await data.get(s.endpoint, s.query));
  if ("find" in s)
    return data.find(s.find, {
      where: s.where as never,
      sort: s.sort,
      limit: s.limit,
      depth: s.depth,
      select: s.select as never,
      joins: s.joins as never,
    });
  if ("count" in s) return (await data.count(s.count, s.where as never)).totalDocs;
  if ("global" in s) return data.findGlobal(s.global, { depth: s.depth });
  if (!scope.doc) throw new Error("This widget needs a document.");
  return data.findByID(scope.doc.slug, scope.doc.id, { depth: s.depth ?? 1, joins: s.joins as never });
}

export function leaves(list: Widget[], scope: WidgetScope, project: Project): Widget[] {
  return list.flatMap((w) => {
    if (w.visible && !w.visible(scope)) return [];
    if (w.grid) return leaves(w.grid, scope, project);
    if (w.split) return leaves([...w.split.main, ...w.split.side], scope, project);
    return [expand(w, scope, project)];
  });
}
