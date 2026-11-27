import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, describe, expect, test } from "vite-plus/test";
import { readHash, readId, readPath, takeReads, watchReads, writeReads } from "./reads.ts";

const dir = mkdtempSync(path.join(tmpdir(), "impact-reads-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe("readHash", () => {
  test("changes exactly when what the read saw changes, for every kind and every before/after state", () => {
    const states = ["absent", "a", "b"] as const;
    for (const kind of ["file", "dir", "exists"] as const)
      for (const before of states)
        for (const after of states) {
          const target = path.join(dir, `${kind}-${before}-${after}`);
          const put = (state: (typeof states)[number]) => {
            rmSync(target, { recursive: true, force: true });
            if (state === "absent") return;
            if (kind === "dir") {
              mkdirSync(target);
              writeFileSync(path.join(target, state), "");
            } else writeFileSync(target, state);
          };
          const id = readId(kind, target);
          expect(readPath(id)).toBe(target.split(path.sep).join("/"));
          put(before);
          const first = readHash(id);
          put(after);
          const second = readHash(id);
          const seenBefore = kind === "exists" ? before !== "absent" : before;
          const seenAfter = kind === "exists" ? after !== "absent" : after;
          expect([kind, before, after, first === second]).toEqual([kind, before, after, seenBefore === seenAfter]);
        }
  });

  test("ignores ids that are not reads", () => {
    expect(readHash("/src/x.css")).toBeUndefined();
    expect(readPath("/src/x.css")).toBeUndefined();
  });
});

describe("watchReads", () => {
  test("records reads, listings and existence checks through every wrapped entry point, and skips node_modules", async () => {
    const file = path.join(dir, "seen.json");
    writeFileSync(file, "{}");
    mkdirSync(path.join(dir, "node_modules"), { recursive: true });
    const hidden = path.join(dir, "node_modules", "x.json");
    writeFileSync(hidden, "{}");
    watchReads();
    readFileSync(file, "utf8");
    readFileSync(hidden, "utf8");
    readdirSync(dir);
    existsSync(path.join(dir, "nope"));
    await readFile(file, "utf8");
    const coverage = path.join(dir, "coverage-1.json");
    writeReads(coverage);
    expect(takeReads(coverage).sort()).toEqual(
      [readId("file", file), readId("dir", dir), readId("exists", path.join(dir, "nope"))].sort(),
    );
    writeReads(coverage);
    expect(takeReads(coverage)).toEqual([]);
    expect(takeReads(path.join(dir, "never.json"))).toEqual([]);
  });
});
