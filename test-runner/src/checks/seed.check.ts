import type { FieldLike } from "mock-runner/server";
import { describe, expect, it } from "vite-plus/test";
import { backend } from "../backend.ts";
import { optionValues, targetsOf, valuesAt } from "../fields.ts";
import { project, seeds } from "../project.ts";

const idsOf = (slug: string) => new Set((seeds.collections[slug] ?? []).map((d) => String(d.id)));

const linked = (value: unknown): { to?: string; id: string }[] =>
  [value].flat().flatMap((v) => {
    if (typeof v === "string" || typeof v === "number") return [{ id: String(v) }];
    if (v && typeof v === "object") {
      const o = v as { relationTo?: string; value?: unknown; id?: string | number };
      if (o.relationTo) return linked(o.value).map((l) => ({ ...l, to: o.relationTo }));
      if (o.id !== undefined) return [{ id: String(o.id) }];
    }
    return [];
  });

const seeded = project.collections.filter((c) => seeds.collections[c.slug]).map((c) => [c.slug, c] as const);

describe("The seed", () => {
  it("loads every document", async () => {
    expect((await backend()).skipped).toEqual([]);
  });

  it("fills only collections and globals the config has", () => {
    const collections = Object.keys(seeds.collections).filter((s) => !project.collections.some((c) => c.slug === s));
    const globals = Object.keys(seeds.globals).filter((s) => !(project.globals ?? []).some((g) => g.slug === s));
    expect([...collections, ...globals]).toEqual([]);
  });

  describe.each(seeded)("Collection %s", (slug, c) => {
    const docs = seeds.collections[slug]!;
    const fields = c.fields as unknown as FieldLike[];

    it("gives every record its own id", () => {
      const ids = docs.map((d) => d.id).filter((id) => id !== undefined);
      expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    });

    it("links only to seeded records", () => {
      const broken: string[] = [];
      for (const doc of docs)
        valuesAt(doc, fields, (field, value) => {
          const targets = targetsOf(field);
          if (!targets.length) return;
          for (const l of linked(value)) {
            const to = l.to ?? (targets.length === 1 ? targets[0] : undefined);
            const known = to ? idsOf(to).has(l.id) : targets.some((t) => idsOf(t).has(l.id));
            if (!known) broken.push(`${String(doc.id)}.${field.name} → ${to ?? targets.join("|")}/${l.id}`);
          }
        });
      expect(broken).toEqual([]);
    });

    it("uses only the choices its fields offer", () => {
      const off: string[] = [];
      for (const doc of docs)
        valuesAt(doc, fields, (field, value) => {
          if (field.type !== "select" && field.type !== "radio") return;
          const offered = optionValues(field);
          for (const v of [value].flat())
            if (!offered.includes(String(v))) off.push(`${String(doc.id)}.${field.name}: ${String(v)}`);
        });
      expect(off).toEqual([]);
    });
  });
});
