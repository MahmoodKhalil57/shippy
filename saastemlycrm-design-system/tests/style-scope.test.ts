import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";

/**
 * `:has()` over descendants marks every element under its subject "affected by :has()": the
 * browser re-checks it on any change below, and a page coming in under the frame restyled the whole
 * frame (2,000+ elements per slice of tiles). So:
 *
 * - a primitive's `has-[…]` / `group-has-[…]` looks only at direct children (`has-[>…]`), unless the
 *   primitive is one small box whose subtree is a handful of elements (`SMALL`);
 * - daisyUI's rules on the root that look into the whole document stay excluded (theme.css).
 *
 * State that lives deeper (a group open in a column) is a `data-*` flag set by the component.
 */
const PRIMITIVES = path.resolve(import.meta.dirname, "../src/components/primitives");
/** Components whose `:has()` subject is one small box (a card, a row). */
const SMALL = new Set(["data/kanban.ts", "data/table.ts"]);

const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(path.join(dir, e.name)) : e.name.endsWith(".ts") ? [path.join(dir, e.name)] : [],
  );

describe("style scope", () => {
  it("no primitive's :has() looks past its subject's children (outside small boxes)", () => {
    const wide: string[] = [];
    for (const file of files(PRIMITIVES)) {
      const rel = path.relative(PRIMITIVES, file).split(path.sep).join("/");
      if (SMALL.has(rel)) continue;
      const src = readFileSync(file, "utf8");
      for (const m of src.matchAll(/(?:group-|peer-)?has-\[([^\]]*)\]/g))
        if (!m[1]!.startsWith(">")) wide.push(`${rel}: ${m[0]}`);
      // A selector's `:has(` has something inside (prose mentioning `:has()` doesn't count).
      for (const m of src.matchAll(/:has\(([^)]+)\)/g)) if (!m[1]!.trim().startsWith(">")) wide.push(`${rel}: ${m[0]}`);
    }
    expect(wide).toEqual([]);
  });

  it("daisyUI's whole-document root rules are excluded", () => {
    const theme = readFileSync(path.resolve(import.meta.dirname, "../src/styles/theme.css"), "utf8");
    const plugin = /@plugin\s+"daisyui"\s*\{([^}]*)\}/.exec(theme)?.[1] ?? "";
    for (const name of ["themecontroller", "rootscrolllock", "rootscrollgutter"]) expect(plugin).toContain(name);
  });
});
