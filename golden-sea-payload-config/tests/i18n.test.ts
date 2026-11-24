import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { catalogProblems, LANGUAGE_KEY, staleMessages } from "saastemlycrm-design-system/testing";
import config from "../src/config.ts";

const root = path.join(import.meta.dirname, "..");

describe("Golden Sea's interface text (messages/*.json)", () => {
  it("says every message in English and Arabic, with the same inputs", () => {
    expect(catalogProblems(root)).toEqual([]);
  });

  it("is compiled: src/i18n/paraglide is what the catalogs give", async () => {
    expect(await staleMessages(root)).toEqual([]);
  }, 60_000);

  it("sets the page's language before the first paint from the key the runtime reads", () => {
    const html = readFileSync(path.join(root, "index.html"), "utf8");
    expect(html).toContain(`localStorage.getItem("${LANGUAGE_KEY}")`);
    const codes = config.localization!.locales.map((l) => (typeof l === "string" ? l : l.code));
    expect(html).toContain(`const languages = ${JSON.stringify(codes).replace(/,/g, ", ")};`);
  });
});

describe("guided tours in every language", () => {
  it("find their targets and buttons by on-screen words given in English and Arabic", async () => {
    const { readFileSync: read } = await import("node:fs");
    const tours = JSON.parse(read(path.join(root, "src/seed/tours.json"), "utf8")) as {
      id: string;
      steps: { click?: unknown; target?: { text?: unknown } }[];
    }[];
    const problems: string[] = [];
    const both = (v: unknown) =>
      !!v &&
      typeof v === "object" &&
      ["en", "ar"].every(
        (l) => typeof (v as Record<string, unknown>)[l] === "string" && (v as Record<string, string>)[l]!.trim(),
      );
    for (const t of tours)
      t.steps.forEach((s, i) => {
        if (s.click !== undefined && !both(s.click)) problems.push(`${t.id} step ${i + 1}: click`);
        if (s.target && !both(s.target.text)) problems.push(`${t.id} step ${i + 1}: target`);
      });
    expect(problems).toEqual([]);
  });
});
