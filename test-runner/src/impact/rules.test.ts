import { describe, expect, test } from "vite-plus/test";
import { codeChanged, decide, summary, UNAVAILABLE, type Dependencies, type Facts, type Reason } from "./rules.ts";

const FACTS = [
  "all",
  "recorded",
  "affectedByChanges",
  "testChanged",
  "globalChanged",
  "failedLastTime",
  "codeChanged",
] as const;

function expected(f: Record<(typeof FACTS)[number], boolean>): Reason | undefined {
  if (f.all) return "all";
  if (!f.recorded) return f.affectedByChanges ? "new" : undefined;
  if (f.testChanged) return "test";
  if (f.globalChanged) return "global";
  if (f.failedLastTime) return "failed";
  if (f.codeChanged) return "code";
  return undefined;
}

describe("decide", () => {
  test("runs a test file exactly when the rule table says so, with the first matching reason, for all 128 combinations", async () => {
    for (let mask = 0; mask < 1 << FACTS.length; mask++) {
      const values = Object.fromEntries(FACTS.map((name, i) => [name, ((mask >> i) & 1) === 1])) as Record<
        (typeof FACTS)[number],
        boolean
      >;
      const asked: string[] = [];
      const lazy = (name: (typeof FACTS)[number]) => () => {
        asked.push(name);
        return Promise.resolve(values[name]);
      };
      const facts: Facts = {
        all: values.all,
        recorded: values.recorded,
        affectedByChanges: lazy("affectedByChanges"),
        testChanged: lazy("testChanged"),
        globalChanged: lazy("globalChanged"),
        failedLastTime: lazy("failedLastTime"),
        codeChanged: lazy("codeChanged"),
      };
      const reason = await decide(facts);
      expect([mask, reason]).toEqual([mask, expected(values)]);
      const order = values.recorded
        ? ["testChanged", "globalChanged", "failedLastTime", "codeChanged"]
        : ["affectedByChanges"];
      const stop = order.findIndex((name) => values[name as (typeof FACTS)[number]]);
      expect(asked).toEqual(values.all ? [] : order.slice(0, stop < 0 ? order.length : stop + 1));
    }
  });
});

type FileState = "same" | "unit changed" | "unit gone" | "extra unit" | "file gone";
type ModuleState = "same" | "changed" | "unavailable then" | "unavailable now";
const FILE_STATES: FileState[] = ["same", "unit changed", "unit gone", "extra unit", "file gone"];
const MODULE_STATES: ModuleState[] = ["same", "changed", "unavailable then", "unavailable now"];

describe("codeChanged", () => {
  test("is true exactly when a recorded unit or module differs or is gone, for every state of two files and two modules", async () => {
    for (const a of FILE_STATES)
      for (const b of FILE_STATES)
        for (const m of MODULE_STATES)
          for (const n of MODULE_STATES) {
            const files = { "a.ts": a, "b.ts": b } as const;
            const modules = { "/x.css": m, "/y.json": n } as const;
            const recorded: Dependencies = {
              units: { "a.ts": { "": "ta", f: "fa" }, "b.ts": { "": "tb", f: "fb" } },
              modules: Object.fromEntries(
                Object.entries(modules).map(([id, s]) => [id, s === "unavailable then" ? UNAVAILABLE : `h${id}`]),
              ),
            };
            const now = {
              units(file: string) {
                const state = files[file as keyof typeof files];
                const base = recorded.units[file]!;
                if (state === "file gone") return undefined;
                if (state === "unit changed") return new Map([...Object.entries(base), ["f", "other"]]);
                if (state === "unit gone") return new Map([["", base[""]!]]);
                if (state === "extra unit") return new Map([...Object.entries(base), ["g", "new"]]);
                return new Map(Object.entries(base));
              },
              module(id: string) {
                const state = modules[id as keyof typeof modules];
                if (state === "changed") return "different";
                if (state === "unavailable now") return UNAVAILABLE;
                return `h${id}`;
              },
            };
            const stale = [a, b].some((s) => s !== "same" && s !== "extra unit") || [m, n].some((s) => s !== "same");
            expect([a, b, m, n, await codeChanged(recorded, now)]).toEqual([a, b, m, n, stale]);
          }
  });
});

describe("summary", () => {
  test("lists the reasons in rule order", () => {
    expect(
      summary(
        4,
        10,
        new Map<Reason, number>([
          ["code", 2],
          ["new", 1],
          ["failed", 1],
        ]),
      ),
    ).toBe("ran 4 of 10 test files (reasons: 1 new, 1 failed, 2 code)");
    expect(summary(0, 10, new Map())).toBe("ran 0 of 10 test files (reasons: none)");
  });
});
