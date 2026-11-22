import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";

/**
 * How Golden Sea's screens are written (AGENTS.md, "Widgets"), checked on every file:
 *
 * - widgets are the design system's generic kinds (`chart`, `table`, `list`, `entries`…). The
 *   config has no widgets of its own: there is no `src/widgets`;
 * - a page (`src/pages/<page>.ts`) declares its widgets: a kind, where it goes, a query
 *   (`src/queries`) and a formatter (`src/format`). It never draws: no `render`, `source` or
 *   `block(`;
 * - a formatter (`src/format/<domain>.ts`) is the business logic: data in, what a kind draws out.
 *   It doesn't know where its data comes from (no queries) and builds no blocks itself;
 * - pages and formatters import only the contracts, formats, queries (pages only), actions,
 *   links and the endpoints' types.
 */

const root = path.resolve(import.meta.dirname, "../src");
const files = (dir: string): string[] =>
  existsSync(dir)
    ? readdirSync(dir).flatMap((n) => {
        const p = path.join(dir, n);
        return statSync(p).isDirectory() ? files(p) : p.endsWith(".ts") ? [p] : [];
      })
    : [];
const rel = (p: string) => path.relative(root, p).replaceAll("\\", "/");
const imports = (src: string) => [...src.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
/** Endpoints are for their types only: a page or a formatter never runs server code. */
const valueImportsFromEndpoints = (src: string) =>
  [...src.matchAll(/import\s+(type\s+)?\{[^}]*\}\s+from\s+"(\.\.?\/(?:\.\.\/)?endpoints\/[^"]+)"/g)]
    .filter((m) => !m[1])
    .map((m) => m[2]!);

const pages = files(path.join(root, "pages"));
const formats = files(path.join(root, "format"));

describe("screens", () => {
  it("have no widgets of their own: widgets are the design system's kinds", () => {
    expect(files(path.join(root, "widgets")).map(rel)).toEqual([]);
  });

  it("are pages that declare widgets and never draw", () => {
    const problems: string[] = [];
    for (const p of pages) {
      const src = readFileSync(p, "utf8");
      for (const [what, re] of [
        ["render", /^\s*render\s*[:(]/m],
        ["source", /^\s*source\s*:/m],
        ["block(", /(?<![.\w])block\(/],
      ] as const)
        if (re.test(src)) problems.push(`${rel(p)}: ${what}`);
      for (const i of imports(src))
        if (
          !/^saastemlycrm-design-system\/contracts$|^\.\.\/(format|queries|actions|endpoints)\/[^/]+\.ts$|^\.\.\/links\.ts$/.test(
            i,
          )
        )
          problems.push(`${rel(p)}: imports ${i}`);
      for (const i of valueImportsFromEndpoints(src)) problems.push(`${rel(p)}: imports values from ${i}`);
    }
    expect(pages.length).toBeGreaterThan(0);
    expect(problems).toEqual([]);
  });

  it("put the business logic in formatters, which don't know where their data comes from", () => {
    const problems: string[] = [];
    for (const p of formats) {
      const src = readFileSync(p, "utf8");
      if (/(?<![.\w])block\(/.test(src)) problems.push(`${rel(p)}: block(`);
      for (const i of imports(src))
        if (
          !/^saastemlycrm-design-system\/contracts$|^\.\/[^/]+\.ts$|^\.\.\/(actions|endpoints)\/[^/]+\.ts$|^\.\.\/links\.ts$/.test(
            i,
          )
        )
          problems.push(`${rel(p)}: imports ${i}`);
      for (const i of valueImportsFromEndpoints(src)) problems.push(`${rel(p)}: imports values from ${i}`);
    }
    expect(problems).toEqual([]);
  });
});
