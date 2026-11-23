import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { catalogProblems, messageInputs, staleMessages } from "../src/testing/i18n.ts";
import { intlTag, isLocalized, localize, localizeConfig } from "../src/i18n/index.ts";
import { localeText } from "../vite/i18n.ts";

const root = path.join(import.meta.dirname, "..");

describe("interface text (messages/*.json)", () => {
  it("says every message in every language, with the same inputs", () => {
    expect(catalogProblems(root)).toEqual([]);
  });

  it("is compiled: src/i18n/paraglide is what the catalogs give", async () => {
    expect(await staleMessages(root)).toEqual([]);
  }, 60_000);

  it("reads a message's inputs, not its plural branches' words", () => {
    expect(messageInputs("{count, plural, one {record} other {# records of {kind}}}")).toEqual(["count", "kind"]);
    expect(messageInputs("Collapse {what}")).toEqual(["what"]);
    // A select's branch of one word is text, not an input.
    expect(messageInputs("{kind, select, estimate {Estimate} other {{name}}}")).toEqual(["kind", "name"]);
    expect(messageInputs("{n, plural, offset:1 =0 {none} one {# item} other {# items}}")).toEqual(["n"]);
    expect(messageInputs("It''s '{literal}' and {x, number}")).toEqual(["x"]);
  });
});

describe("Payload's localized text", () => {
  it("reads a label in a language, else English, else the first given", () => {
    expect(localize({ en: "Quotation", ar: "عرض سعر" }, "ar")).toBe("عرض سعر");
    expect(localize({ en: "Quotation" }, "ar")).toBe("Quotation");
    expect(localize("Plain", "ar")).toBe("Plain");
    expect(localize(undefined, "ar")).toBe("");
  });

  it("reads a whole config in one language, leaving data and functions", () => {
    const hook = () => 1;
    const config = {
      collections: [
        {
          slug: "quotations",
          labels: { singular: { en: "Quotation", ar: "عرض سعر" }, plural: { en: "Quotations", ar: "عروض الأسعار" } },
          fields: [
            {
              name: "status",
              type: "select",
              options: [{ value: "draft", label: { en: "Draft", ar: "مسودة" } }],
              admin: { description: { en: "Where it is", ar: "أين هو" } },
            },
          ],
          hooks: { afterRead: [hook] },
        },
      ],
      custom: { notText: { en: 1 } },
    };
    localizeConfig(config, "ar");
    expect(config.collections[0]!.labels).toEqual({ singular: "عرض سعر", plural: "عروض الأسعار" });
    expect(config.collections[0]!.fields[0]!.options[0]!.label).toBe("مسودة");
    expect(config.collections[0]!.fields[0]!.admin.description).toBe("أين هو");
    expect(config.collections[0]!.hooks.afterRead[0]).toBe(hook);
    expect(config.custom.notText).toEqual({ en: 1 });
    expect(isLocalized({ en: "a", fr: "b" })).toBe(false);
  });

  it("writes Arabic numbers in Latin digits", () => {
    expect(new Intl.NumberFormat(intlTag("number", "ar")).format(1234.5)).toBe("1,234.5");
  });
});

describe("a one-language build's config text (localeText)", () => {
  const plugin = localeText("ar", ["en", "ar"], /config\.ts$/);
  const run = (code: string) => (plugin.transform(code, "/p/config.ts") as { code: string } | undefined)?.code ?? code;

  it("keeps only the build's language, in the same shape", () => {
    const out = run(
      `const f = { label: { en: "Stage", ar: "المرحلة" }, hint: { en: \`Due \${d}\`, ar: \`الموعد \${d}\` } };`,
    );
    expect(out).toContain('label: __lt("المرحلة")');
    expect(out).toContain("hint: __lt(`الموعد ${d}`)");
    expect(out).not.toContain("Stage");
    expect(out).toContain('import { __lt } from "virtual:locale-text"');
    const helper = plugin.load("\0virtual:locale-text") as string;
    expect(helper).toBe('export const __lt = (s) => ({ "en": s, "ar": s });');
  });

  it("leaves what isn't text in every language: other keys, other values, other files", () => {
    for (const code of [
      `const a = { en: "x" };`,
      `const b = { en: "x", ar: "y", fr: "z" };`,
      `const c = { en: 1, ar: 2 };`,
      `const d = { en: "x", [k]: "y" };`,
    ])
      expect(run(code)).toBe(code);
    expect(plugin.transform(`const e = { en: "x", ar: "y" };`, "/p/other.ts")).toBeUndefined();
    expect(
      localeText(undefined, ["en", "ar"], /./).transform(`const e = { en: "x", ar: "y" };`, "/p/config.ts"),
    ).toBeUndefined();
  });
});
