import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

/**
 * The going-to-production flags (src/flags.ts): every use is an `if (FLAG) { … } else { … }` whose
 * else is what production runs: `IS_TEMP_MOCK`'s throws `TempMockError` (until the polished logic
 * melts the if/else away), `IS_MOCK`'s is the real connection or throws `NotConnectedError`.
 */

const src = path.join(import.meta.dirname, "../src");
const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) return f === "i18n" ? [] : files(p);
    return p.endsWith(".ts") ? [p] : [];
  });

/** The block that starts at `open` (a `{`): its text, braces balanced (strings and comments skipped). */
function block(code: string, open: number): { body: string; end: number } {
  let depth = 0;
  for (let i = open; i < code.length; i++) {
    const c = code[i]!;
    if (c === "/" && code[i + 1] === "/") i = code.indexOf("\n", i);
    else if (c === "/" && code[i + 1] === "*") i = code.indexOf("*/", i) + 1;
    else if (c === '"' || c === "'" || c === "`") {
      for (i++; i < code.length && code[i] !== c; i++) if (code[i] === "\\") i++;
    } else if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return { body: code.slice(open + 1, i), end: i };
  }
  return { body: code.slice(open), end: code.length };
}

/** Each use of `flag` in a file: well-formed or the problem with it. */
function uses(code: string, flag: "IS_TEMP_MOCK" | "IS_MOCK", rel: string) {
  const out: { at: string; problem?: string; mock?: string; prod?: string }[] = [];
  const re = new RegExp(`\\b${flag}\\b`, "g");
  for (const m of code.matchAll(re)) {
    const line = code.slice(0, m.index).split("\n").length;
    const at = `${rel}:${line}`;
    const before = code.slice(0, m.index);
    // The import of it, and its mention in a comment, aren't uses.
    if (/import\s*\{[^}]*$/.test(before) || /\/\/[^\n]*$/.test(before) || /\/\*(?![\s\S]*\*\/)/.test(before)) continue;
    if (!before.endsWith("if (")) {
      out.push({ at, problem: `${flag} used outside \`if (${flag}) { … } else { … }\`` });
      continue;
    }
    const open = code.indexOf("{", m.index);
    if (code.slice(m.index + flag.length, open).trim() !== ")") {
      out.push({ at, problem: `\`if (${flag})\` combined with another condition` });
      continue;
    }
    const then = block(code, open);
    const rest = code.slice(then.end + 1);
    const elseAt = /^\s*else\s*\{/.exec(rest);
    if (!elseAt) {
      out.push({ at, problem: `\`if (${flag})\` without an else (what production runs)` });
      continue;
    }
    const other = block(code, then.end + 1 + elseAt[0].length - 1);
    out.push({ at, mock: then.body, prod: other.body });
  }
  return out;
}

describe("going-to-production flags", () => {
  const all = files(src)
    .filter((f) => !f.endsWith(`${path.sep}flags.ts`))
    .map((f) => ({ rel: path.relative(src, f).split(path.sep).join("/"), code: readFileSync(f, "utf8") }));

  it("IS_TEMP_MOCK: temporary logic, its else throwing TempMockError until the polished logic melts it", () => {
    const problems: string[] = [];
    for (const { rel, code } of all)
      for (const u of uses(code, "IS_TEMP_MOCK", rel)) {
        if (u.problem) problems.push(`${u.at}: ${u.problem}`);
        else if (!/throw new TempMockError\(/.test(u.prod!))
          problems.push(`${u.at}: its else must throw TempMockError`);
        else if (!/TODO replace temporary mock logic/.test(u.mock!))
          problems.push(`${u.at}: its branch needs the TODO`);
      }
    expect(problems).toEqual([]);
  });

  it("IS_MOCK: a simulated third party, its else the real connection or NotConnectedError", () => {
    const problems: string[] = [];
    for (const { rel, code } of all)
      for (const u of uses(code, "IS_MOCK", rel)) {
        if (u.problem) problems.push(`${u.at}: ${u.problem}`);
        else if (!u.prod!.trim()) problems.push(`${u.at}: its else is empty (connect, or throw NotConnectedError)`);
      }
    expect(problems).toEqual([]);
  });

  it("finds its uses (the check isn't vacuous)", () => {
    const count = (flag: "IS_TEMP_MOCK" | "IS_MOCK") =>
      all.reduce((n, { rel, code }) => n + uses(code, flag, rel).filter((u) => !u.problem).length, 0);
    expect(count("IS_TEMP_MOCK")).toBeGreaterThan(0);
    expect(count("IS_MOCK")).toBeGreaterThan(0);
  });
});

describe("the flags' values", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });
  const load = () => import("../src/flags.ts");

  it("are on by default: the demo runs as it is", async () => {
    vi.stubEnv("IS_MOCK", "");
    vi.stubEnv("IS_TEMP_MOCK", "");
    const f = await load();
    expect([f.IS_MOCK, f.IS_TEMP_MOCK]).toEqual([true, true]);
  });

  it("read the environment: a polished mock, and production", async () => {
    vi.stubEnv("IS_TEMP_MOCK", "false");
    expect((await load()).IS_TEMP_MOCK).toBe(false);
    vi.resetModules();
    vi.stubEnv("IS_MOCK", "0");
    const f = await load();
    expect([f.IS_MOCK, f.IS_TEMP_MOCK]).toEqual([false, false]);
  });

  it("refuse production running temporary mock logic", async () => {
    vi.stubEnv("IS_MOCK", "false");
    vi.stubEnv("IS_TEMP_MOCK", "true");
    await expect(load()).rejects.toThrow(/can't run temporary mock logic/);
  });
});
