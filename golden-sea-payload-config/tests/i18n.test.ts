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
