import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { ICON_COLLECTIONS } from "../plugins/icons.ts";

/**
 * Icons come only from the allowed Iconify collections (plugins/icons.ts), through the registry in
 * src/components/primitives/media/icon.ts. Nothing else draws its own SVG.
 */
const SRC = path.resolve(import.meta.dirname, "../src");
const REGISTRY = path.join(SRC, "components/primitives/media/icon.ts");

const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(path.join(dir, e.name)) : e.name.endsWith(".ts") ? [path.join(dir, e.name)] : [],
  );
/** Source without comments, so docs may still mention `<svg>`. */
const code = (file: string) =>
  readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

describe("icons", () => {
  it("only the icon registry renders an <svg>; nothing hand-draws icons", () => {
    const offenders = files(SRC)
      .filter((f) => f !== REGISTRY)
      .filter((f) => /<svg[\s>]|\bsvg`|<path\s/.test(code(f)))
      .map((f) => path.relative(SRC, f));
    expect(offenders).toEqual([]);
  });

  it("icons are imported only from the allowed collections", () => {
    const imports = files(SRC).flatMap((f) => [...code(f).matchAll(/from "~icons\/([^/"]+)\//g)].map((m) => m[1]));
    expect(imports.length).toBeGreaterThan(0);
    expect(imports.filter((c) => !(ICON_COLLECTIONS as readonly string[]).includes(c!))).toEqual([]);
  });
});
