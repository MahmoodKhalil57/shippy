import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { formatViolations, widthViolations } from "./check.ts";

export const PRIMITIVES = path.resolve(import.meta.dirname, "../../src/components/primitives");
export const EXEMPT = new Set(["layout/algebra.ts"]);

const files = (d: string): string[] =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(path.join(d, e.name)) : e.name.endsWith(".ts") ? [path.join(d, e.name)] : [],
  );

export function allViolations() {
  const out = new Map<string, ReturnType<typeof widthViolations>>();
  for (const f of files(PRIMITIVES)) {
    const rel = path.relative(PRIMITIVES, f).split(path.sep).join("/");
    if (EXEMPT.has(rel)) continue;
    const vs = widthViolations(readFileSync(f, "utf8"), f);
    if (vs.length) out.set(rel, vs);
  }
  return out;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const all = allViolations();
  let n = 0;
  for (const [file, vs] of all) {
    console.log(formatViolations(file, vs));
    n += vs.length;
  }
  console.log(`\n${n} violations in ${all.size} files`);
  process.exit(n ? 1 : 0);
}
