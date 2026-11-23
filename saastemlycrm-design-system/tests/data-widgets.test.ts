import { beforeAll, describe, expect, it } from "vite-plus/test";
import { formats, tones, type MockConfig } from "../src/contracts/index.ts";
import { setProject } from "../src/app/config.ts";
import { eachSlots, eachTiles, type Widget, type WidgetScope } from "../src/app/widgets/widget.ts";

/**
 * The no-code data widgets (src/app/widgets/data.ts) read their meaning from the Payload config:
 * - `records`: dotted columns through relationships and groups, labelled by the last field; money
 *   in each document's own currency; the collection's `custom.actions` on exactly the documents
 *   they apply to and the roles they name (every role × every document checked), with `$row.…`
 *   filled from the document; `keep` filtering on values as read;
 * - `metrics`: a count, or the sum of a fixed-currency field, its tone by whether there are any;
 * - `breakdown`: groups in a select's option order, stacked series, sums, and the same numbers as a
 *   table with totals;
 * - `$today±Nd` in a query: that day;
 * - what the config says a value means: `toneWhen`, `href`, `gauge`; list tags, dots and master–detail
 *   `select`; entry facts, notes and notices; sorting by virtual fields; `hideEmpty`; actions repeated
 *   per array row (`each`); a global's array rows with their own actions; `fields` by dotted path with
 *   the document's actions; metric notes (`$count`, `$sum`) and shared currencies; `sort: "value"`;
 *   links that keep `$row.…` placeholders.
 */

const config: MockConfig = {
  collections: [
    { slug: "users", auth: true, fields: [{ name: "role", type: "select", options: ["finance", "sales"] }] },
    {
      slug: "customers",
      admin: { useAsTitle: "name" },
      fields: [
        { name: "name", type: "text" },
        {
          name: "rule",
          type: "select",
          label: "Contact rule",
          options: [
            { label: "Follow-ups allowed", value: "allowed" },
            { label: "Do not chase", value: "never" },
          ],
        },
      ],
    },
    {
      slug: "invoices",
      admin: { useAsTitle: "number" },
      custom: {
        actions: [
          {
            label: "Remind",
            when: { "customer.rule": { equals: "allowed" }, balance: { greater_than: 0 } },
            roles: ["finance"],
            call: { path: "/remind", body: { invoice: "$row.id" } },
            done: "Reminded $row.customer.name about $row.number.",
          },
          {
            label: "Link to $item.case",
            each: "matches",
            itemWhen: { score: { greater_than: 50 } },
            call: { path: "/link", body: { invoice: "$row.id", case: "$item.case", at: "$index" } },
          },
        ],
      },
      fields: [
        { name: "number", type: "text" },
        { name: "customer", type: "relationship", relationTo: "customers" },
        { name: "currency", type: "select", options: ["EGP", "USD"] },
        { name: "balance", type: "number", custom: formats.money("currency") },
        { name: "balanceUsd", type: "number", virtual: true, custom: formats.money("USD") },
        {
          name: "age",
          type: "select",
          options: ["Not due", "Late"],
          custom: tones({ "Not due": "success", Late: "error" }),
        },
        { name: "eInvoice", type: "group", fields: [{ name: "status", type: "text" }] },
        {
          name: "daysLate",
          type: "number",
          custom: { toneWhen: [{ when: { daysLate: { greater_than: 30 } }, tone: "error" }], href: "/late/$row.id" },
        },
        { name: "paid", type: "number", custom: { gauge: { max: "total" } } },
        { name: "total", type: "number" },
        { name: "history", type: "textarea" },
        {
          name: "warning",
          type: "text",
          custom: { toneWhen: [{ when: { daysLate: { greater_than: 0 } }, tone: "warning" }] },
        },
        {
          name: "matches",
          type: "array",
          fields: [
            { name: "case", type: "text" },
            { name: "score", type: "number" },
          ],
        },
      ],
    },
  ],
  globals: [
    {
      slug: "integrations",
      fields: [
        {
          name: "connections",
          type: "array",
          custom: {
            actions: [
              {
                label: "Reconnect $row.name",
                when: { status: { equals: "Expired" } },
                call: { path: "/reconnect", body: { name: "$row.name", owner: "$parent.owner" } },
              },
            ],
          },
          fields: [
            { name: "name", type: "text" },
            {
              name: "status",
              type: "select",
              options: ["Connected", "Expired"],
              custom: tones({ Connected: "success", Expired: "error" }),
            },
          ],
        },
        { name: "owner", type: "text" },
      ],
    },
  ],
} as unknown as MockConfig;

const allowed = { id: "c1", name: "Atlas", rule: "allowed" };
const never = { id: "c2", name: "Nordvik", rule: "never" };
const docs = [
  {
    id: "i1",
    number: "INV-1",
    customer: allowed,
    currency: "EGP",
    balance: 1000,
    balanceUsd: 20,
    age: "Late",
    eInvoice: { status: "Valid" },
  },
  {
    id: "i2",
    number: "INV-2",
    customer: never,
    currency: "USD",
    balance: 50,
    balanceUsd: 50,
    age: "Not due",
    eInvoice: { status: "Submitted" },
  },
  {
    id: "i3",
    number: "INV-3",
    customer: allowed,
    currency: "USD",
    balance: 0,
    balanceUsd: 0,
    age: "Not due",
    eInvoice: {},
  },
];
const scope = (role: string): WidgetScope => ({ user: { id: "u", role }, params: {} });

let expand: (w: Widget, scope: WidgetScope) => Widget;
let actionsFor: typeof import("../src/app/widgets/data.ts").actionsFor;
let actionsOfAll: typeof import("../src/app/widgets/data.ts").actionsOf;
let fill: typeof import("../src/app/widgets/widget.ts").fill;
let setToday: typeof import("../src/app/widgets/widget.ts").setToday;
beforeAll(async () => {
  setProject({ config });
  ({ expand, actionsFor, actionsOf: actionsOfAll } = await import("../src/app/widgets/data.ts"));
  ({ fill, setToday } = await import("../src/app/widgets/widget.ts"));
});

const draw = (w: Widget, data: unknown, role = "finance") => {
  const x = expand(w, scope(role)) as { render(d: unknown, s: WidgetScope): unknown };
  return x.render(data, scope(role)) as Record<string, any>;
};

describe("records", () => {
  const w: Widget = {
    size: "l",
    records: {
      collection: "invoices",
      columns: ["number", "balance", "customer.rule", "eInvoice.status"],
      supporting: { number: "customer" },
    },
  };

  it("reads dotted columns by their last field, money in each document's currency", () => {
    const t = draw(w, { docs, totalDocs: 3 });
    expect(t.columns.map((c: { label: string }) => c.label)).toEqual([
      "Number",
      "Balance",
      "Contact rule",
      "Status",
      "",
    ]);
    expect(t.rows[0].balance).toBe("EGP 1,000");
    expect(t.rows[1].balance).toBe("USD 50");
    expect(t.rows[0]["customer.rule"]).toBe("Follow-ups allowed");
    expect(t.rows[1]["eInvoice.status"]).toBe("Submitted");
  });

  it("offers the collection's actions on exactly the documents and roles they name, filled in", () => {
    const problems: string[] = [];
    for (const role of ["finance", "sales", "other"])
      for (const d of docs) {
        const got = actionsFor("invoices", d, scope(role));
        const want = role === "finance" && d.customer.rule === "allowed" && d.balance > 0;
        if (got.length !== (want ? 1 : 0)) problems.push(`${role} ${d.id}: ${got.length}`);
        if (want && (got[0]!.call?.body as { invoice?: string } | undefined)?.invoice !== d.id)
          problems.push(`${d.id}: body`);
        if (want && got[0]!.done !== `Reminded ${d.customer.name} about ${d.number}.`) problems.push(`${d.id}: done`);
      }
    expect(problems).toEqual([]);
    const t = draw(w, { docs, totalDocs: 3 });
    expect(t.rows.map((r: { __actions: unknown }) => !!r.__actions)).toEqual([true, false, false]);
  });

  it("keeps only documents matching `keep` as read", () => {
    const keep: Widget = {
      size: "l",
      records: { collection: "invoices", columns: ["number"], keep: { balance: { greater_than: 0 } } },
    };
    expect(draw(keep, { docs, totalDocs: 3 }).rows.length).toBe(2);
  });
});

describe("metrics", () => {
  it("counts, or adds up a fixed-currency field, toned by whether there are any", () => {
    const w: Widget = {
      size: "s",
      metrics: {
        collection: "invoices",
        items: [
          { label: "Open", where: { balance: { greater_than: 0 } }, tone: { some: "warning", none: "success" } },
          { label: "Owed", sum: "balanceUsd" },
        ],
      },
    };
    const x = expand(w, scope("finance")) as {
      each: { items(d: unknown, s: WidgetScope): { value: string; tone?: string }[] };
    };
    const got = x.each.items({ m0: 2, m1: { docs, totalDocs: 3 } }, scope("finance"));
    expect(got.map((f) => [f.value, f.tone])).toEqual([
      ["2", "warning"],
      ["USD 70", undefined],
    ]);
    expect(x.each.items({ m0: 0, m1: { docs: [], totalDocs: 0 } }, scope("finance"))[0]!.tone).toBe("success");
  });
});

describe("breakdown", () => {
  const w = (as?: "table"): Widget => ({
    size: "m",
    breakdown: { collection: "invoices", by: "customer", stack: "age", sum: "balanceUsd", as },
  });

  it("groups by a field, stacks by a select in its option order, adds up a field", () => {
    const c = draw(w(), { docs }).chart;
    expect(c.labels).toEqual(["Atlas", "Nordvik"]);
    expect(c.series).toEqual([
      { name: "Not due", values: [0, 50] },
      { name: "Late", values: [20, 0] },
    ]);
    expect(c.stacked).toBe(true);
  });

  it("draws the same numbers as a table with totals, largest first", () => {
    const t = draw(w("table"), { docs });
    expect(t.rows.map((r: Record<string, any>) => [r.__x.text, r.s0, r.s1, r.__total.text])).toEqual([
      ["Nordvik", "USD 50", "—", "USD 50"],
      ["Atlas", "—", "USD 20", "USD 20"],
    ]);
  });
});

describe("relative dates", () => {
  it("are days from the project's today", () => {
    setToday("2026-11-17T09:30:00.000Z");
    const s = scope("finance");
    expect(fill({ a: "$today", b: "$today-30d", c: "$today+2w" }, s)).toEqual({
      a: "2026-11-17T00:00:00.000Z",
      b: "2026-10-18T00:00:00.000Z",
      c: "2026-12-01T00:00:00.000Z",
    });
  });
});

describe("what the config says a value means", () => {
  const late = { ...docs[0]!, daysLate: 45, paid: 30, total: 120, warning: "Check the bank", history: "Sent\nChased" };
  const early = { ...docs[1]!, daysLate: 0, paid: 0, total: 0, warning: "None" };

  it("tones a value by its document, links it elsewhere, and draws a number as a bar of another field", () => {
    const w: Widget = { size: "l", records: { collection: "invoices", columns: ["number", "daysLate", "paid"] } };
    const t = draw(w, { docs: [late, early], totalDocs: 2 });
    expect(t.rows[0].daysLate).toEqual({ text: "45", tone: "error", href: "/late/i1", gauge: undefined });
    expect(t.rows[1].daysLate).toEqual({ text: "0", tone: undefined, href: "/late/i2", gauge: undefined });
    expect(t.rows[0].paid).toEqual({
      text: "30",
      tone: undefined,
      href: undefined,
      gauge: { value: 30, max: 120, tone: undefined },
    });
    // No max: no bar.
    expect(t.rows[1].paid).toBe("0");
  });

  it("gives list items tags and a dot, and entries facts, notes and a notice", () => {
    const list = draw(
      {
        size: "s",
        records: { collection: "invoices", columns: ["number"], layout: "list", tags: ["age"], dot: "daysLate" },
      },
      { docs: [late], totalDocs: 1 },
    );
    expect(list.items[0]).toMatchObject({ headline: "INV-1", dot: "error", tags: [{ label: "Late", tone: "error" }] });
    const entries = draw(
      {
        size: "m",
        records: {
          collection: "invoices",
          columns: ["number", "age"],
          layout: "entries",
          facts: ["balance", "customer.rule"],
          notes: "history",
          notice: "warning",
        },
      },
      { docs: [late], totalDocs: 1 },
    );
    expect(entries.items[0]).toMatchObject({
      status: { label: "Late", tone: "error" },
      facts: [
        { label: "Balance", value: "EGP 1,000" },
        { label: "Contact rule", value: "Follow-ups allowed" },
      ],
      notes: ["Sent", "Chased"],
      notice: { text: "Check the bank", tone: "warning" },
    });
  });

  it("makes a list a master: picking an item sets the screen parameter, the picked one shows selected", () => {
    const w: Widget = {
      size: "s",
      records: { collection: "invoices", columns: ["number"], layout: "list", select: { param: "inv" } },
    };
    const x = expand(w, scope("finance")) as { render(d: unknown, s: WidgetScope): Record<string, any> };
    const l = x.render({ docs, totalDocs: 3 }, { ...scope("finance"), params: { inv: "i2" } });
    expect(l.items.map((i: { select: { value: string }; selected: boolean }) => [i.select.value, i.selected])).toEqual([
      ["i1", false],
      ["i2", true],
      ["i3", false],
    ]);
  });

  it("sorts by a virtual field as read", () => {
    const w = expand(
      { size: "l", records: { collection: "invoices", columns: ["number"], sort: "-balanceUsd" } },
      scope("finance"),
    ) as unknown as {
      source: { sort?: string; limit: number };
      render(d: unknown, s: WidgetScope): Record<string, any>;
    };
    expect(w.source.sort).toBeUndefined();
    expect(w.source.limit).toBe(0);
    expect(
      w.render({ docs, totalDocs: 3 }, scope("finance")).rows.map((r: { number: { text: string } }) => r.number.text),
    ).toEqual(["INV-2", "INV-1", "INV-3"]);
  });

  it("repeats an action once per array row it applies to, filled from the row", () => {
    const d = {
      ...docs[0]!,
      matches: [
        { case: "GS-1", score: 80 },
        { case: "GS-2", score: 20 },
        { case: "GS-3", score: 60 },
      ],
    };
    const got = actionsFor("invoices", d, scope("sales")).filter((a) => a.label.startsWith("Link"));
    expect(got.map((a) => [a.label, a.call?.body])).toEqual([
      ["Link to GS-1", { invoice: "i1", case: "GS-1", at: 0 }],
      ["Link to GS-3", { invoice: "i1", case: "GS-3", at: 2 }],
    ]);
  });

  it("draws a global's array rows, with the array's own actions ($row the row, $parent the global)", () => {
    const w: Widget = {
      size: "l",
      records: { global: "integrations", field: "connections", columns: ["name", "status"] },
    };
    const x = expand(w, scope("finance")) as {
      source: unknown;
      render(d: unknown, s: WidgetScope): Record<string, any>;
    };
    expect(x.source).toEqual({ global: "integrations", depth: 1 });
    const g = {
      owner: "Karim",
      connections: [
        { id: "a", name: "Mail", status: "Connected" },
        { id: "b", name: "WhatsApp", status: "Expired" },
      ],
    };
    const t = x.render(g, scope("finance"));
    expect(
      t.rows.map((r: Record<string, any>) => [r.name, r.status.text, r.__actions?.actions?.[0]?.call?.body ?? null]),
    ).toEqual([
      ["Mail", "Connected", null],
      ["WhatsApp", "Expired", { name: "WhatsApp", owner: "Karim" }],
    ]);
  });

  it("shows a document's fields by dotted path, with the document's actions", () => {
    const s: WidgetScope = { ...scope("finance"), doc: { id: "i1", slug: "invoices" } };
    const x = expand({ size: "s", fields: { fields: ["number", "customer.rule", "eInvoice.status"] } }, s) as {
      render(d: unknown, s: WidgetScope): Record<string, any>[];
    };
    const [details, actions] = x.render(docs[0], s);
    expect(details!.items.map((i: { label: string; value: unknown }) => [i.label, i.value])).toEqual([
      ["Number", "INV-1"],
      ["Contact rule", "Follow-ups allowed"],
      ["Status", "Valid"],
    ]);
    expect(actions!.items.map((a: { label: string }) => a.label)).toEqual(["Remind"]);
  });
});

describe("metrics notes and currencies", () => {
  it("fills $count and $sum, and keeps a currency every document shares", () => {
    const w: Widget = {
      size: "s",
      metrics: { collection: "invoices", items: [{ label: "Owed", sum: "balance", note: "$count invoices · $sum" }] },
    };
    const x = expand(w, scope("finance")) as {
      each: { items(d: unknown, s: WidgetScope): { value: string; note?: string }[] };
    };
    const usd = docs.filter((d) => d.currency === "USD");
    expect(x.each.items({ m0: { docs: usd, totalDocs: 2 } }, scope("finance"))[0]).toMatchObject({
      value: "USD 50",
      note: "2 invoices · USD 50",
    });
    // Mixed currencies: a bare number.
    expect(x.each.items({ m0: { docs, totalDocs: 3 } }, scope("finance"))[0]!.value).toBe("1,050");
  });
});

describe("breakdown order", () => {
  it("puts the largest groups first with sort: value", () => {
    const c = draw(
      { size: "m", breakdown: { collection: "invoices", by: "customer", sum: "balanceUsd", sort: "value" } },
      { docs },
    ).chart;
    expect(c.labels).toEqual(["Nordvik", "Atlas"]);
  });
});

describe("links with placeholders", () => {
  it("keep `$row.…` as it is, to be filled per document", async () => {
    const { links } = await import("../src/app/widgets/links.ts");
    const link = links();
    expect(link.doc("cases", "$row.case", "order")).toContain("/collections/cases/$row.case");
    expect(link.doc("cases", "a b")).toContain("/collections/cases/a%20b");
  });
});

describe("timeline", () => {
  it("reads the first column as the time, the second as the heading, `text` and a toned `dot`", () => {
    const t = draw(
      {
        size: "m",
        records: {
          collection: "invoices",
          columns: ["number", "customer"],
          layout: "timeline",
          text: "history",
          dot: "age",
        },
      },
      { docs: [{ ...docs[0]!, history: "Sent" }], totalDocs: 1 },
    );
    expect(t.items[0]).toEqual({ time: "INV-1", heading: "Atlas", text: "Sent", tone: "error" });
  });
});

describe("fixes", () => {
  it("repeats an action over an array at a dotted path, every row", () => {
    const d = {
      ...docs[0]!,
      deep: {
        rows: [
          { case: "A", score: 90 },
          { case: "B", score: 95 },
        ],
      },
    };
    const all = actionsOfAll([{ label: "Link $item.case", each: "deep.rows" }], d, scope("finance"));
    expect(all.map((a) => a.label)).toEqual(["Link A", "Link B"]);
  });

  it("has a tile per figure before the data, whatever the data holds", () => {
    const x = expand(
      { size: "s", metrics: { collection: "invoices", items: [{ label: "Owed", sum: "balanceUsd" }] } },
      scope("finance"),
    );
    expect(eachSlots(x, scope("finance"))).toEqual(["Owed"]);
    for (const data of [{ m0: { docs: [], totalDocs: 0 } }, { m0: { docs, totalDocs: 3 } }])
      expect(eachTiles(x, data as never, scope("finance")).map((t) => t.key)).toEqual(["Owed"]);
  });
});
