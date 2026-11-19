import type { Endpoint } from "payload";
import { stringify } from "qs-esm";
import { block, type Tone, type View } from "../../app/view/schema.ts";
import config from "../config.ts";
import type { FieldLike } from "../types.ts";

/**
 * A count per value of a select field, above a collection's list: put
 * `viewEndpoint("/views/summary/<slug>/<field>")` in the collection's
 * `admin.components.beforeList`. Each count opens the list filtered to that value, in the
 * value's tone (`custom.tones`). Counts respect the user's read access.
 */

const find = (fields: FieldLike[], name: string): FieldLike | undefined => {
  for (const f of fields) {
    if (f.name === name) return f;
    const inner = f.fields
      ? find(f.fields, name)
      : f.tabs
        ? find(
            f.tabs.flatMap((t) => t.fields),
            name,
          )
        : undefined;
    if (inner) return inner;
  }
  return undefined;
};

export const viewEndpoints: Endpoint[] = [
  {
    // GET /api/views/summary/:slug/:field
    path: "/views/summary/:slug/:field",
    method: "get",
    handler: async (req) => {
      const slug = String(req.routeParams?.slug);
      const name = String(req.routeParams?.field);
      const c = config.collections.find((x) => x.slug === slug);
      const f = c && find(c.fields as FieldLike[], name);
      if (!c || !f || f.type !== "select")
        return Response.json({ errors: [{ message: "No such select field." }] }, { status: 404 });
      const skip = new Set((req.query?.skip as string | undefined)?.split(",") ?? []);
      const options = (f.options ?? [])
        .map((o) => (typeof o === "string" ? { value: o, label: o } : { value: o.value, label: String(o.label) }))
        .filter((o) => !skip.has(o.value));
      const counts = await Promise.all(
        options.map((o) =>
          req.payload
            .count({ collection: slug as never, where: { [name]: { equals: o.value } }, req, overrideAccess: false })
            .then((r) => r.totalDocs)
            .catch(() => 0),
        ),
      );
      const href = (value: string) =>
        `/collections/${slug}${stringify(
          { filters: [{ field: name, operator: "equals", value }] },
          { addQueryPrefix: true, encodeValuesOnly: true },
        )}`;
      const view: View = {
        blocks: [
          block("stats", {
            size: "md",
            items: options
              .map((o, i) => ({ o, n: counts[i] ?? 0 }))
              .filter(({ n }) => n > 0)
              .map(({ o, n }) => ({
                label: o.label,
                value: String(n),
                href: href(o.value),
                tone: f.custom?.tones?.[o.value] as Tone | undefined,
              })),
          }),
        ],
      };
      return Response.json(view);
    },
  },
];
