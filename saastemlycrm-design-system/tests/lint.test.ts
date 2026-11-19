import { RuleTester } from "vite-plus/lint/plugins-dev";
import { describe, expect, it } from "vite-plus/test";
import plugin, { isTitleCase, recommended } from "../lint/index.js";

// The design system's lint rules for a project (lint/index.js), run through oxlint's RuleTester.
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const tester = new RuleTester({ languageOptions: { parserOptions: { lang: "ts" } } });
const rule = (name: string) => plugin.rules[name]!;
const WIDGET = "/project/src/widgets/screen.ts";
const ENDPOINT = "/project/src/endpoints/screen.ts";

tester.run("prefer-entries", rule("prefer-entries"), {
  valid: [
    `block("entries", { items: rows.map((r) => ({ heading: r.name })) });`,
    // A board: each column card holds a list, so it is a container, not an entry.
    `block("grid", { blocks: cols.map((c) => block("card", { heading: c.stage, blocks: [block("list", { items: [] })] })) });`,
    `block("grid", { blocks: [block("card", { heading: "One" }), block("card", { heading: "Two" })] });`,
    `block("grid", { blocks: rows.map((r) => block("stats", { items: [] })) });`,
  ],
  invalid: [
    {
      code: `block("grid", { blocks: rows.map((r) => block("card", { heading: r.name, blocks: [block("text", { text: r.note })] })) });`,
      errors: [{ messageId: "preferEntries" }],
    },
    {
      code: `block("grid", { blocks: [...rows.map((r) => { return block("card", { heading: r.name }); })] });`,
      errors: [{ messageId: "preferEntries" }],
    },
    {
      // Through the file's own function, with spread-in actions.
      code: `function drop(d, x) { const actions = []; return block("card", { heading: x.n, blocks: [block("details", { items: [] }), ...actions] }); }
block("grid", { blocks: d.rows.map((x) => drop(d, x)) });`,
      errors: [{ messageId: "preferEntries" }],
    },
    {
      code: `const card = (r) => block("card", { heading: r.name });
block("grid", { blocks: rows.map(card) });`,
      errors: [{ messageId: "preferEntries" }],
    },
    {
      code: `const cards = rows.map((r) => block("card", { heading: r.name, blocks: [note(r.note)] }));\nblock("grid", { blocks: cards });`,
      errors: [{ message: /block\("entries", \{ items \}\)/ }],
    },
  ],
});

tester.run("no-local-block-helpers", rule("no-local-block-helpers"), {
  valid: [
    // Computes something: a real helper, not an alias.
    `const money = (n: number) => block("text", { text: n.toFixed(2) });`,
    `const on = (w) => ({ source: data, ...w });`,
    `function render(rows) { const a = rows.length; return block("text", { text: String(a) }); }`,
    // Not top level.
    `const x = { render: (t) => block("text", { text: t, muted: true }) };`,
  ],
  invalid: [
    {
      code: `const muted = (text: string) => block("text", { text, muted: true, variant: "body-sm" });`,
      errors: [{ message: /note\(text\)/ }],
    },
    {
      code: `export function heading(text) { return block("text", { text, variant: "title-md" }); }`,
      errors: [{ messageId: "noLocalBlockHelpers" }],
    },
    {
      code: `const tag = ({ label, tone } = {}) => block("tags", { items: [{ label, tone }] } as const);`,
      errors: [{ messageId: "noLocalBlockHelpers" }],
    },
  ],
});

tester.run("widgets-are-pure", rule("widgets-are-pure"), {
  valid: [
    {
      code: `import { block } from "saastemlycrm-design-system/contracts";\nimport { where } from "saastemlycrm-design-system/payload";\nimport type { Doc } from "payload";\nimport { type X } from "lit";\nimport { fmt } from "./format.ts";`,
      filename: WIDGET,
    },
    // Not a widget file.
    { code: `import { html } from "lit"; fetch("/x"); Date.now();`, filename: "/project/src/app/view.ts" },
    // Property keys and local variables are not the browser's globals.
    { code: `const document = { window: 1 }; block("document", { document });`, filename: WIDGET },
    { code: `import { fmt } from "my-format";`, filename: WIDGET, options: [{ allow: ["my-format"] }] },
    { code: `const d = new Date(row.date);`, filename: WIDGET },
  ],
  invalid: [
    { code: `import { html } from "lit";`, filename: WIDGET, errors: [{ messageId: "import" }] },
    {
      code: `import { block } from "saastemlycrm-design-system/contracts";`,
      filename: WIDGET,
      options: [{ allow: ["other"] }],
      errors: [{ messageId: "import" }],
    },
    {
      code: `export const w = { render: () => { fetch("/api"); const t = Date.now() + Math.random(); return window.innerWidth + localStorage.length + document.title; } };`,
      filename: WIDGET,
      errors: [
        { messageId: "impure", data: { what: "fetch()" } },
        { messageId: "impure", data: { what: "Date.now" } },
        { messageId: "impure", data: { what: "Math.random" } },
        { messageId: "impure", data: { what: "window" } },
        { messageId: "impure", data: { what: "localStorage" } },
        { messageId: "impure", data: { what: "document" } },
      ],
    },
    { code: `const now = new Date();`, filename: "C:\\project\\src\\widgets\\x.ts", errors: [{ messageId: "impure" }] },
  ],
});

tester.run("endpoints-return-data", rule("endpoints-return-data"), {
  valid: [
    {
      code: `import type { ViewBlock } from "saastemlycrm-design-system/contracts"; const x = { a: 1 };`,
      filename: ENDPOINT,
    },
    { code: `import { tones } from "saastemlycrm-design-system/contracts"; tones({});`, filename: ENDPOINT },
    // A local function called block is not the contracts' helper.
    { code: `const block = (n) => n; block(1);`, filename: ENDPOINT },
    { code: `import { block } from "saastemlycrm-design-system/contracts"; block("text", {});`, filename: WIDGET },
  ],
  invalid: [
    {
      code: `import { block, note as n } from "saastemlycrm-design-system/contracts";\nexport const get = () => [block("text", { text: "x" }), n("y")];`,
      filename: ENDPOINT,
      errors: [
        { messageId: "endpointsReturnData", data: { name: "block" } },
        { messageId: "endpointsReturnData", data: { name: "note" } },
        { messageId: "endpointsReturnData", data: { name: "block" } },
        { messageId: "endpointsReturnData", data: { name: "note" } },
      ],
    },
    {
      code: `import * as c from "saastemlycrm-design-system/contracts"; c.widgets({ widgets: [] });`,
      filename: ENDPOINT,
      errors: [{ messageId: "endpointsReturnData", data: { name: "widgets" } }],
    },
  ],
});

tester.run("sentence-case-titles", rule("sentence-case-titles"), {
  valid: [
    `block("card", { heading: "Open purchase orders" });`,
    `const w = { title: "Prospects by stage", render: () => [] };`,
    // Two words, acronyms and numbers don't make Title Case.
    `block("card", { heading: "Golden Sea" });`,
    `block("card", { heading: "Open RFQs" });`,
    `block("card", { heading: "Q3 RFQ KPIs" });`,
    { code: `const w = { title: "Ask Golden Sea", render: () => [] };`, options: [{ properNouns: ["Golden Sea"] }] },
    // Not in a block or a widget (a collection's field label).
    `const field = { name: "po", label: "Customer Purchase Order" };`,
  ],
  invalid: [
    {
      code: `block("card", { heading: "Open Purchase Orders" });`,
      errors: [{ message: /"Open purchase orders"/ }],
    },
    {
      code: `const w = { title: "Next Steps This Week", render: () => [] };`,
      errors: [{ messageId: "sentenceCase" }],
    },
    {
      code: `block("stats", { items: [{ label: "Open RFQs By Stage", value: "1" }] });`,
      errors: [{ message: /"Open RFQs by stage"/ }],
    },
    { code: `const x = { subhead: "Waiting On Supplier" };`, errors: [{ messageId: "sentenceCase" }] },
  ],
});

tester.run("max-blocks", rule("max-blocks"), {
  valid: [
    `const w = { render: () => [a, b, c, d, e, f] };`,
    `const w = { render: () => block("entries", { items: [1, 2, 3, 4, 5, 6, 7, 8] }) };`,
    { code: `const w = { render: () => [a, b, c] };`, options: [{ max: 3 }] },
  ],
  invalid: [
    { code: `const w = { render: () => [a, b, c, d, e, f, g] };`, errors: [{ messageId: "maxBlocks" }] },
    {
      code: `const w = { render(d) { if (d) return [a]; return [a, b, c, d]; } };`,
      options: [{ max: 3 }],
      errors: [{ message: /split the widget or use a richer block/ }],
    },
  ],
});

describe("recommended", () => {
  it("turns on every rule of the plugin and the import boundary", () => {
    for (const name of Object.keys(plugin.rules)) expect(recommended).toHaveProperty(`saastemly/${name}`);
    expect(recommended).toHaveProperty("no-restricted-imports");
  });
  it("isTitleCase", () => {
    expect(isTitleCase("Open Purchase Orders")).toBe(true);
    expect(isTitleCase("Open purchase orders")).toBe(false);
  });
});

tester.run("no-raw-hrefs", rule("no-raw-hrefs"), {
  valid: [
    { code: `const href = doc("cases", id, "pricing");`, filename: WIDGET },
    { code: `const call = { path: "/commercial/approvals" };`, filename: ENDPOINT },
    { code: `const tab = { path: "/overview" };`, filename: WIDGET },
    { code: "const v = `/approvals?x=${y}`;", filename: WIDGET },
    // Tests assert the exact paths.
    { code: `expect(href).toBe("/collections/cases");`, filename: "/project/tests/links.test.ts" },
  ],
  invalid: [
    { code: `const href = "/collections/cases";`, filename: WIDGET, errors: [{ messageId: "noRawHrefs" }] },
    {
      code: "const href = `/collections/cases/${id}/pricing`;",
      filename: ENDPOINT,
      errors: [{ messageId: "noRawHrefs" }],
    },
    { code: `const href = "/globals/fx-rates";`, filename: WIDGET, errors: [{ messageId: "noRawHrefs" }] },
  ],
});
