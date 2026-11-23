import { afterAll, describe, expect, it } from "vite-plus/test";

/**
 * A suggestion is only ever an answer the field can hold: one of its options, a number, a yes or
 * no, a real `YYYY-MM-DD` date, or nothing. Whatever the model answers (here a fake Prompt API that
 * answers what it's told to), `suggest` passes on that or null, never something else.
 */

let answer: unknown = null;
let asked: { schema?: unknown; input?: unknown } = {};
const session = {
  prompt: (input: unknown, o?: { responseConstraint?: unknown }) => {
    asked = { input, schema: o?.responseConstraint };
    return Promise.resolve(JSON.stringify({ value: answer }));
  },
  destroy: () => {},
};
const g = globalThis as Record<string, unknown>;
g.LanguageModel = { availability: () => Promise.resolve("available"), create: () => Promise.resolve(session) };
afterAll(() => delete g.LanguageModel);

const { suggest } = await import("../src/agent/built-in-ai.ts");
const ask = (value: unknown, field: Parameters<typeof suggest>[0]) => {
  answer = value;
  return suggest(field, "case", { Customer: "Nordvik" }, "2026-11-17");
};

describe("suggest", () => {
  it("keeps a choice to the field's options, and limits the model to them", async () => {
    const field = { label: "Port", type: "string" as const, options: ["Port Said", "Damietta"] };
    expect(await ask("Damietta", field)).toBe("Damietta");
    expect(asked.schema).toMatchObject({
      properties: { value: { type: "string", enum: ["Port Said", "Damietta", "(no answer)"] } },
    });
    expect(await ask("Alexandria", field)).toBeNull();
    expect(await ask("(no answer)", field)).toBeNull();
  });

  it("passes only a value of the field's type", async () => {
    expect(await ask(12, { label: "Lines", type: "number" })).toBe(12);
    expect(await ask("12", { label: "Lines", type: "number" })).toBeNull();
    expect(await ask(true, { label: "Urgent", type: "boolean" })).toBe(true);
    expect(await ask("yes", { label: "Urgent", type: "boolean" })).toBeNull();
    expect(await ask("  Purchasing manager ", { label: "Who", type: "string" })).toBe("Purchasing manager");
  });

  it("passes a date only as YYYY-MM-DD", async () => {
    const field = { label: "ETA", type: "string" as const, format: "date" as const };
    expect(await ask("2026-11-20", field)).toBe("2026-11-20");
    expect(await ask("next Friday", field)).toBeNull();
  });

  it("gives nothing for an empty answer, and tells the model what the form already says", async () => {
    expect(await ask(null, { label: "Who", type: "string" })).toBeNull();
    expect(await ask("", { label: "Who", type: "string" })).toBeNull();
    expect(String(asked.input)).toContain("- Customer: Nordvik");
  });
});
