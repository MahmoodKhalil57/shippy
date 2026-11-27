import type { FieldLike } from "mock-runner/server";
import { describe, expect, it } from "vite-plus/test";
import { everyField, optionValues, targetsOf } from "../fields.ts";
import { backend } from "../backend.ts";
import { authCollection, project } from "../project.ts";

const collections = project.collections;
const globals = project.globals ?? [];
const slugs = new Set(collections.map((c) => c.slug));
const fieldsOf = (fields: unknown) => everyField(fields as FieldLike[]);
const repeated = (names: string[]) => names.filter((n, i) => names.indexOf(n) !== i);
const brokenLinks = (fields: unknown) =>
  fieldsOf(fields).flatMap(({ path, field }) =>
    targetsOf(field)
      .filter((t) => !slugs.has(t))
      .map((t) => `${path} → ${t}`),
  );

describe("The config", () => {
  it("names every collection and global once", () => {
    expect(repeated([...collections.map((c) => c.slug), ...globals.map((g) => g.slug)])).toEqual([]);
  });

  it("signs people in through a collection with accounts", () => {
    expect(authCollection().auth).toBeTruthy();
  });

  describe.each(collections.map((c) => [c.slug, c] as const))("Collection %s", (_, c) => {
    it("titles its records with a field it has", async () => {
      const title = c.admin?.useAsTitle;
      const fields = everyField((await backend()).engine.fields(c.slug)).map((f) => f.path);
      if (title && title !== "id") expect(fields).toContain(title);
    });

    it("links only to collections that exist", () => {
      expect(brokenLinks(c.fields)).toEqual([]);
    });

    it("offers each choice once", () => {
      const twice = fieldsOf(c.fields).flatMap(({ path, field }) =>
        repeated(optionValues(field)).map((v) => `${path}: ${v}`),
      );
      expect(twice).toEqual([]);
    });
  });

  describe.each(globals.map((g) => [g.slug, g] as const))("Global %s", (_, g) => {
    it("links only to collections that exist", () => {
      expect(brokenLinks(g.fields)).toEqual([]);
    });
  });
});
