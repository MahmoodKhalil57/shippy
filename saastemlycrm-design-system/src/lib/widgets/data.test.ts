import { describe, expect, it } from "vite-plus/test";
import { testDashboard } from "../../../.storybook/dashboard.ts";
import type { Doc, MockConfig } from "../contracts/config.ts";
import { m } from "../i18n/index.ts";
import { actionsFor, actionsOf, expand } from "./data.ts";
import { loadSource } from "./load.ts";
import type { ViewBlock, ViewBlocks } from "./schema.ts";
import { eachTiles, fill, type Widget, type WidgetScope } from "./widget.ts";

const config = {
  collections: [
    { slug: "users", auth: true, admin: { useAsTitle: "name" }, fields: [{ name: "name", type: "text" }] },
    {
      slug: "files",
      upload: true,
      admin: { useAsTitle: "filename" },
      fields: [{ name: "filename", type: "text" }],
    },
    {
      slug: "customers",
      admin: { useAsTitle: "name" },
      fields: [
        { name: "name", type: "text" },
        { name: "city", type: "text" },
      ],
    },
    {
      slug: "orders",
      admin: { useAsTitle: "code" },
      custom: {
        actions: [
          { label: "Ship", call: { path: "/ship", body: { id: "$row.id" } }, when: { status: { equals: "ready" } } },
          { label: "Approve", roles: ["manager"], call: { path: "/approve" } },
          {
            label: "Pack $item.sku",
            each: "lines",
            itemWhen: { packed: { equals: false } },
            call: {
              path: "/pack",
              body: { order: "$row", line: "$index", sku: "$item.sku", none: "$row.nothing.deep" },
            },
          },
        ],
      },
      fields: [
        { name: "code", type: "text" },
        {
          name: "status",
          type: "select",
          custom: { tones: { ready: "info" } },
          options: [
            { label: "Ready", value: "ready" },
            { label: "Shipped", value: "shipped" },
            { label: "Cancelled", value: "cancelled" },
          ],
        },
        { name: "size", type: "select", options: ["Small", "Large"] },
        { name: "labels", type: "select", hasMany: true, options: ["Gift", "Fragile"] },
        { name: "customer", type: "relationship", relationTo: "customers" },
        { name: "owner", type: "relationship", relationTo: "users" },
        { name: "watchers", type: "relationship", relationTo: "users", hasMany: true },
        { name: "photo", type: "upload", relationTo: "files" },
        { name: "total", type: "number", custom: { number: { unit: "money", currency: "USD" } } },
        { name: "price", type: "number", custom: { number: { unit: "money", currencyField: "currency" } } },
        { name: "currency", type: "text" },
        { name: "done", type: "number", custom: { gauge: { max: "planned" } } },
        { name: "planned", type: "number" },
        {
          name: "score",
          type: "number",
          custom: { gauge: { max: 10 }, toneWhen: [{ when: { score: { less_than: 3 } }, tone: "error" }] },
        },
        { name: "link", type: "text", custom: { href: "/track/$row.code" } },
        { name: "rank", type: "number", virtual: true },
        { name: "notes", type: "textarea" },
        { name: "steps", type: "array", fields: [{ name: "text", type: "text" }] },
        {
          name: "lines",
          type: "array",
          fields: [
            { name: "sku", type: "text" },
            { name: "packed", type: "checkbox" },
          ],
        },
        { name: "address", type: "group", fields: [{ name: "street", type: "text" }] },
        { name: "shippedAt", type: "date" },
        { name: "pickedAt", type: "date" },
        { name: "ref", type: "relationship", relationTo: ["customers", "users"] },
        { name: "meta", type: "group" },
        {
          name: "phase",
          type: "select",
          options: [{ label: "Packing", value: "packing" }],
          custom: { tones: { packing: "warning" }, href: "/phase/$row.id" },
        },
      ],
    },
  ],
  globals: [
    {
      slug: "rates",
      fields: [
        {
          name: "bands",
          type: "array",
          label: "Rate bands",
          custom: { actions: [{ label: "Edit $row.name", call: { path: "/band" } }] },
          fields: [
            { name: "name", type: "text" },
            { name: "rate", type: "number" },
          ],
        },
        { name: "plain", type: "array", fields: [{ name: "x", type: "text" }] },
        { name: "loose", type: "array" },
        { name: "title", type: "text" },
      ],
    },
  ],
} as unknown as MockConfig;

const doc = (d: Record<string, unknown>) => d as Doc;
const usd = (amount: string) => m.number_money({ currency: "USD", amount });
const maya = { id: "u1", name: "Maya Patel" };
const orders = [
  doc({
    id: "o1",
    code: "A-1",
    status: "ready",
    size: "Large",
    labels: ["Gift", "Fragile"],
    customer: { id: "c1", name: "Harbor", city: "Portland" },
    owner: maya,
    watchers: [maya],
    photo: { id: "f1", filename: "box.png" },
    total: 120,
    price: 30,
    currency: "EUR",
    done: 3,
    planned: 4,
    score: 2,
    link: "Track",
    rank: 2,
    notes: "First line\nSecond line",
    steps: [{ text: "Wrap" }, "Tape", { n: 1 }, null],
    lines: [
      { sku: "S1", packed: true },
      { sku: "S2", packed: false },
    ],
    address: { street: "1 Pier Rd" },
    shippedAt: "2026-01-05T00:00:00.000Z",
    pickedAt: "2026-01-03T00:00:00.000Z",
    ref: { relationTo: "customers", value: { id: "c1", name: "Harbor" } },
    phase: "packing",
  }),
  doc({
    id: "o2",
    code: "",
    labels: [],
    status: "cancelled",
    size: "Tiny",
    customer: "c2",
    owner: "u1",
    total: 80,
    price: 20,
    currency: "EUR",
    done: 1,
    planned: 0,
    score: 8,
    rank: 1,
    shippedAt: "2026-02-10T00:00:00.000Z",
  }),
  doc({
    id: "o3",
    code: "C-3",
    status: "shipped",
    total: 0,
    price: 5,
    currency: "USD",
    shippedAt: "bad",
    pickedAt: "bad",
  }),
];

const dashboard = () =>
  testDashboard({
    config,
    data: {
      docs: { orders, customers: [doc({ id: "c1", name: "Harbor" })] },
      globals: {
        rates: {
          bands: [
            { id: "b1", name: "Low", rate: 1 },
            { name: "High", rate: 2 },
          ],
          plain: [],
          title: "Rates",
        },
      },
    },
  });

const scope: WidgetScope = { user: { id: "u1", role: "manager" }, params: { pick: "o2" } };

async function draw(w: Widget, s: WidgetScope = scope) {
  const d = dashboard();
  const e = expand(w, s, d.project);
  const data = e.source ? await loadSource(fill(e.source, s), s, d.data) : null;
  const tiles = e.each ? eachTiles(e, data, s).map((t) => [t.widget.render(data, s)].flat()) : undefined;
  return {
    e,
    data,
    head: e.head?.(data, s),
    blocks: [e.render?.(data, s) ?? []].flat() as ViewBlock[],
    tiles,
  };
}

const first = <K extends keyof ViewBlocks>(blocks: ViewBlock[], type: K) =>
  blocks.find((b) => b.type === type) as ViewBlocks[K];

describe("actions", () => {
  it("filters by role and condition and expands each item", () => {
    const d = dashboard();
    const all = actionsFor("orders", orders[0]!, scope, d.project);
    expect(all.map((a) => a.label)).toEqual(["Ship", "Approve", "Pack S2"]);
    expect(all[0]!.call!.body).toEqual({ id: "o1" });
    expect(all[2]!.call!.body).toEqual({ order: orders[0], line: 1, sku: "S2", none: undefined });
    expect(actionsFor("orders", orders[1]!, { ...scope, user: { id: "u2" } }, d.project)).toEqual([]);
    expect(actionsFor("missing", orders[0]!, scope, d.project)).toEqual([]);
    expect(
      actionsOf([{ label: "Go $parent.id $row.missing", href: "/x" }], orders[2]!, scope, doc({ id: "p" })),
    ).toEqual([{ label: "Go p ", href: "/x" }]);
    expect(actionsOf([{ label: "Each", each: "lines.none", call: { path: "/x" } }], orders[0]!, scope)).toEqual([]);
    expect(actionsOf([{ label: "$row.customer for $row.total", href: "/x" }], orders[0]!, scope)).toEqual([
      { label: "c1 for 120", href: "/x" },
    ]);
  });
});

describe("filling actions", () => {
  it("walks lists, plain values and missing paths", () => {
    const [a] = actionsOf(
      [
        {
          label: "Pack $item now",
          each: "lines",
          call: { path: "/pack", body: { list: ["$row.id", 3, true], at: "$index.x", whole: "$item" } },
        },
      ],
      orders[0]!,
      scope,
    );
    expect(a).toEqual({
      label: "Pack  now",
      call: { path: "/pack", body: { list: ["o1", 3, true], at: undefined, whole: { sku: "S1", packed: true } } },
    });
    expect(actionsOf([{ label: "Deep", each: "code.x", call: { path: "/x" } }], orders[0]!, scope)).toEqual([]);
  });
});

describe("records", () => {
  const records = (r: object, extra: object = {}) =>
    ({ title: "Orders", size: "l", records: { collection: "orders", ...r }, ...extra }) as Widget;

  it("draws a table with links, tags, people, gauges and actions", async () => {
    const { blocks, head, e } = await draw(
      records(
        {
          columns: [
            "code",
            "status",
            "size",
            "labels",
            "customer",
            "owner",
            "watchers",
            "photo",
            "total",
            "price",
            "done",
            "score",
            "link",
            "customer.city",
            "address.street",
            "updatedAt",
          ],
          supporting: { code: "notes" },
          labels: { total: "Amount", price: "" },
          more: true,
        },
        { head: () => ({ count: 99 }) },
      ),
    );
    expect(e.skeleton).toBe("table");
    expect(head).toEqual({
      count: 99,
      actions: [{ label: m.widget_data_all({ what: "orders" }), href: "/collections/orders", variant: "text" }],
    });
    const table = first(blocks, "table");
    expect(table.columns.map((c) => c.key)).toContain("__actions");
    expect(table.columns.find((c) => c.key === "total")).toMatchObject({ label: "Amount", align: "end" });
    expect(table.columns.find((c) => c.key === "total")!.hideLabel).toBeUndefined();
    expect(table.columns.find((c) => c.key === "price")).toMatchObject({ label: "Price", hideLabel: true });
    expect(table.columns.find((c) => c.key === "code")).toMatchObject({ supporting: "code__2" });
    expect(table.columns.find((c) => c.key === "customer.city")).toMatchObject({ label: "City" });
    const [a, b, c] = table.rows;
    expect(a!.code).toEqual({ text: "A-1", href: "/collections/orders/o1" });
    expect(b!.code).toEqual({ text: "o2", href: "/collections/orders/o2" });
    expect(a!.code__2).toBe("First line\nSecond line");
    expect(a!.status).toMatchObject({ text: "Ready", tag: true, tone: "info" });
    expect(b!.status).toMatchObject({ text: "Cancelled", tag: true, tone: "neutral" });
    expect(a!.size).toEqual({ text: "Large", tag: true, hue: 1 });
    expect(b!.size).toBe("Tiny");
    expect(a!.customer).toEqual({ text: "Harbor", href: "/collections/customers/c1" });
    expect(b!.customer).toBe("c2");
    expect(a!.owner).toEqual({ text: "Maya Patel", person: true, href: "/collections/users/u1" });
    expect(b!.owner).toEqual({ text: "u1", person: true, href: undefined });
    expect(a!.watchers).toBe("Maya Patel");
    expect(a!.photo).toEqual({ text: "box.png", href: "/collections/files/f1" });
    expect(a!.total).toBe(usd("120"));
    expect(a!.done).toEqual({
      text: "3",
      tone: undefined,
      href: undefined,
      gauge: { value: 3, max: 4, tone: undefined },
    });
    expect(b!.done).toBe("1");
    expect(a!.score).toMatchObject({ tone: "error", gauge: { value: 2, max: 10, tone: "error" } });
    expect(a!.link).toMatchObject({ text: "Track", href: "/track/A-1" });
    expect(a!["customer.city"]).toBe("Portland");
    expect(a!["address.street"]).toBe("1 Pier Rd");
    expect(c!.total).toBe(usd("0"));
    expect(a!.__actions).toMatchObject({
      text: "",
      actions: [{ label: "Ship" }, { label: "Approve" }, { label: "Pack S2" }],
    });
    const quiet = await draw(records({ columns: ["code"] }), { ...scope, user: { id: "u2" } });
    expect(first(quiet.blocks, "table").rows[2]!.__actions).toBeNull();
    expect(quiet.head).toEqual({ count: 3, actions: [] });
  });

  it("reads through relations, groups and plain fields", async () => {
    const { blocks } = await draw(
      records({
        columns: ["code", "ref", "ref.name", "meta.x", "code.x", "customer.city.zip", "phase"],
        actions: false,
      }),
    );
    const table = first(blocks, "table");
    expect(table.columns.find((c) => c.key === "meta.x")).toMatchObject({ label: "X" });
    const [a, b] = table.rows;
    expect(a!.ref).toBe("c1");
    expect(a!.phase).toEqual({ text: "Packing", tone: "warning", tag: true });
    expect(b!["customer.city.zip"]).toBeNull();
  });

  it("drops actions on request and numbers untitled rows", async () => {
    const { blocks } = await draw(records({ columns: ["labels", "status"], actions: false, empty: "No orders" }));
    const table = first(blocks, "table");
    expect(table.empty).toBe("No orders");
    expect(table.columns.map((c) => c.key)).toEqual(["labels", "status"]);
    expect(table.rows[1]!.labels).toEqual({ text: "#2", href: "/collections/orders/o2" });
  });

  it("sorts virtual fields here and keeps only matching rows", async () => {
    const { blocks, head, e } = await draw(
      records({ columns: ["code"], sort: "rank", limit: 2, keep: { total: { greater_than: 10 } } }),
    );
    expect(e.source).toMatchObject({ limit: 0, sort: undefined });
    expect(first(blocks, "table").rows.map((r) => (r.code as { href: string }).href)).toEqual([
      "/collections/orders/o2",
      "/collections/orders/o1",
    ]);
    expect(head).toMatchObject({ count: 2 });
    const plain = await draw(records({ columns: ["code"], sort: "-rank" }));
    expect(plain.e.source).toMatchObject({ limit: 0 });
    const keepOnly = await draw(records({ columns: ["code"], keep: { status: { equals: "ready" } } }));
    expect(keepOnly.head).toMatchObject({ count: 1 });
    const server = await draw(records({ columns: ["code"], sort: "-code", where: { status: { not_equals: "x" } } }));
    expect(server.e.source).toMatchObject({ sort: "-code", limit: 10 });
  });

  it("draws a list with dots, tags and selection", async () => {
    const { blocks, e } = await draw(
      records({ columns: ["code", "customer", "notes"], layout: "list", dot: "status", tags: ["labels", "notes"] }),
    );
    expect(e.skeleton).toBe("list");
    const list = first(blocks, "list");
    expect(list.items[0]).toMatchObject({
      headline: "A-1",
      supporting: "Harbor · First line\nSecond line",
      href: "/collections/orders/o1",
      dot: "info",
      tags: [{ label: "Gift, Fragile" }, { label: "First line\nSecond line" }],
    });
    expect(list.items[0]!.actions).toHaveLength(3);
    expect(list.items[2]!.actions).toHaveLength(1);
    const picked = await draw(records({ columns: ["code"], layout: "list", select: { param: "pick" } }));
    expect(first(picked.blocks, "list").items[1]).toMatchObject({
      select: { param: "pick", value: "o2" },
      selected: true,
    });
    expect(first(picked.blocks, "list").items[0]).toMatchObject({ href: undefined, selected: false });
    const byCode = await draw(
      records({ columns: ["code"], layout: "list", select: { param: "pick", value: "customer" } }),
    );
    expect(first(byCode.blocks, "list").items.map((i) => i.select!.value)).toEqual(["c1", "c2", ""]);
  });

  it("draws a timeline", async () => {
    const { blocks, e } = await draw(
      records({ columns: ["total", "code"], layout: "timeline", dot: "status", text: "notes" }),
    );
    expect(e.skeleton).toBe("list");
    const t = first(blocks, "timeline");
    expect(t.items[0]).toMatchObject({ heading: "A-1", text: "First line\nSecond line", tone: "info" });
    expect(t.items[1]).toMatchObject({ heading: undefined, text: undefined });
    const bare = await draw(records({ columns: [], layout: "timeline" }));
    expect(first(bare.blocks, "timeline").items[0]).toEqual({
      time: undefined,
      heading: undefined,
      text: undefined,
      tone: undefined,
    });
  });

  it("draws entries with status, facts, notes and notices", async () => {
    const { blocks, e } = await draw(
      records({
        columns: ["code", "status", "customer", "notes"],
        layout: "entries",
        text: "notes",
        facts: ["total", "photo", "planned"],
        notes: "steps",
        notice: "status",
        tags: ["size"],
        empty: "None",
      }),
    );
    expect(e.skeleton).toBe("entries");
    const list = first(blocks, "entries");
    expect(list.empty).toBe("None");
    const [a, b, c] = list.items;
    expect(a).toMatchObject({
      id: "o1",
      heading: "A-1",
      status: { label: "Ready", tone: "info" },
      meta: ["Harbor", "First line\nSecond line"],
      text: "First line\nSecond line",
      notes: ["Wrap", "Tape"],
      notice: { text: "Ready", tone: "info" },
      tags: [{ label: "Large" }],
    });
    expect(a!.facts!.map((f) => f.label)).toEqual(["Total", "Photo", "Planned"]);
    expect(a!.actions).toHaveLength(3);
    expect(b).toMatchObject({ notes: undefined, text: undefined });
    expect(c).toMatchObject({ facts: [{ label: "Total", value: usd("0") }], tags: [] });
    const notesText = await draw(
      records({ columns: ["code"], layout: "entries", notes: "notes", notice: "notes", actions: false }),
    );
    const n = first(notesText.blocks, "entries").items[0]!;
    expect(n).toMatchObject({ notes: ["First line", "Second line"], notice: { tone: "info" }, actions: undefined });
    const plain = await draw(records({ columns: ["code"], layout: "entries", actions: false }));
    expect(first(plain.blocks, "entries").items[0]).toMatchObject({
      status: undefined,
      text: undefined,
      notice: undefined,
    });
    const tones = await draw({
      title: "Scores",
      size: "l",
      records: { collection: "orders", columns: ["code", "score"], layout: "entries", notice: "score" },
    });
    expect(first(tones.blocks, "entries").items[0]).toMatchObject({
      status: { label: "2", tone: "error" },
      notice: { tone: "error" },
    });
  });

  it("reads the rows of an array field", async () => {
    const { blocks, head, e } = await draw(
      records({ collection: undefined, global: "rates", field: "bands", columns: ["name", "rate"] }),
    );
    expect(e.source).toEqual({ global: "rates", depth: 1 });
    expect(head).toEqual({ count: 2, actions: [] });
    const table = first(blocks, "table");
    expect(table.rows.map((r) => r.name)).toEqual(["Low", "High"]);
    expect(table.rows[1]!.__actions).toMatchObject({ actions: [{ label: "Edit High" }] });
    const plain = await draw(
      records({ collection: undefined, global: "rates", field: "plain", columns: ["x"], more: true }),
    );
    expect(plain.head).toEqual({ count: 0, actions: [] });
    const onDoc = await draw(
      records({ collection: undefined, doc: true, field: "lines", columns: ["sku"], layout: "list" }),
      {
        ...scope,
        doc: { id: "o1", slug: "orders" },
      },
    );
    expect(onDoc.e.source).toEqual({ doc: true, depth: 1 });
    expect(first(onDoc.blocks, "list").items.map((i) => i.headline)).toEqual(["S1", "S2"]);
    const loose = await draw(records({ collection: undefined, global: "rates", field: "loose", columns: ["x"] }));
    expect(first(loose.blocks, "table").rows).toEqual([]);
    const none = await draw(records({ collection: undefined, doc: true, field: "lines", columns: ["sku"] }), {
      ...scope,
      doc: { id: "o9", slug: "orders" },
    }).catch((err: Error) => err.message);
    expect(none).toBe("Not Found");
  });

  it("explains what is missing", async () => {
    const said = async (r: object, s: WidgetScope = scope) =>
      (first((await draw(records(r), s)).blocks, "alert") as { text: string }).text;
    expect(await said({ collection: undefined, global: "missing", field: "x", columns: [] })).toBe(
      'No global "missing".',
    );
    expect(await said({ collection: undefined, doc: true, field: "x", columns: [] })).toBe(
      "Not on a document's screen.",
    );
    expect(
      await said(
        { collection: undefined, doc: true, field: "x", columns: [] },
        { ...scope, doc: { id: "1", slug: "missing" } },
      ),
    ).toBe("Not on a document's screen.");
    expect(await said({ collection: undefined, global: "rates", field: "title", columns: [] })).toBe(
      '"title" isn\'t an array field.',
    );
    expect(await said({ collection: "missing", columns: [] })).toBe('No collection "missing".');
    expect(await said({ collection: undefined, columns: [] })).toBe('No collection "".');
  });
});

describe("metrics", () => {
  it("counts, sums and shares", async () => {
    const { tiles, e } = await draw({
      size: "s",
      metrics: {
        collection: "orders",
        items: [
          {
            label: "Ready",
            where: { status: { equals: "ready" } },
            tone: { some: "warning", none: "success" },
            note: "$count ready",
            main: true,
          },
          { label: "Value", sum: "total", note: "$sum in all" },
          { label: "Euro", sum: "price", where: { currency: { equals: "EUR" } } },
          { label: "Mixed", sum: "price" },
          { label: "Large", keep: { size: { equals: "Large" } }, tone: "info" },
          { label: "Customers", collection: "customers" },
          { label: "Gone", collection: "missing", where: { a: 1 } },
          { label: "Late", where: { status: { equals: "late" } }, tone: { some: "error", none: "success" } },
        ],
      },
    });
    expect(e.skeleton).toBe("stats");
    const stats = tiles!.map((t) => (t[0] as ViewBlocks["stats"]).items[0]!);
    expect(stats[0]).toMatchObject({
      label: "Ready",
      value: "1",
      note: "1 ready",
      tone: "warning",
      main: true,
      href: "/collections/orders",
    });
    expect(stats[0]!.share!.value).toBeCloseTo(1 / 3);
    expect(stats[1]).toMatchObject({ value: usd("200"), note: `${usd("200")} in all`, share: undefined });
    expect(stats[2]).toMatchObject({ value: m.number_money({ currency: "EUR", amount: "50" }) });
    expect(stats[2]!.share!.text).toBe(m.widget_share_of_all({ pct: 91, noun: "orders" }));
    expect(stats[3]!.value).toBe("55");
    expect(stats[4]).toMatchObject({ value: "1", tone: undefined });
    expect(stats[5]).toMatchObject({ value: "1", href: "/collections/customers" });
    expect(stats[6]).toMatchObject({ value: "0", share: undefined });
    expect(stats[7]).toMatchObject({ value: "0", tone: "success" });
  });

  it("sums nothing when nothing is found", async () => {
    const { tiles } = await draw({
      size: "s",
      metrics: {
        collection: "orders",
        items: [{ label: "None", sum: "total", where: { status: { equals: "late" } } }],
      },
    });
    expect((tiles![0]![0] as ViewBlocks["stats"]).items[0]).toMatchObject({ value: usd("0") });
  });
});

describe("breakdown", () => {
  const breakdown = (b: object, extra: object = {}) =>
    ({ title: "By status", size: "m", breakdown: { collection: "orders", ...b }, ...extra }) as Widget;

  it("charts counts by a field, stacked or summed", async () => {
    const { blocks, e } = await draw(breakdown({ by: "status" }));
    expect(e.skeleton).toBe("chart");
    const c = first(blocks, "chart");
    expect(c).toMatchObject({
      label: "By status",
      chart: { kind: "bars", stacked: false, labels: ["Ready", "Shipped", "Cancelled"] },
    });
    expect(c.chart.series).toEqual([{ name: "Orders", values: [1, 1, 1] }]);
    const stacked = await draw(
      breakdown({
        by: "customer",
        stack: "status",
        sum: "total",
        sort: "value",
        top: 1,
        keep: { total: { greater_than: 0 } },
      }),
    );
    const sc = first(stacked.blocks, "chart");
    expect(sc.chart).toMatchObject({
      stacked: true,
      labels: ["Harbor"],
      format: { unit: "money", currency: "USD", compact: true },
    });
    const priced = await draw(breakdown({ by: "size", sum: "price" }, { title: undefined }));
    const pc = first(priced.blocks, "chart");
    expect(pc.label).toBe("Orders");
    expect(pc.chart.labels).toEqual(["Large", "Tiny"]);
    expect(pc.chart.format).toBeUndefined();
  });

  it("buckets dates by day, week and month", async () => {
    const months = first((await draw(breakdown({ by: "shippedAt", bucket: "month" }))).blocks, "chart");
    expect(months.chart.kind).toBe("line");
    expect(months.chart.labels).toHaveLength(2);
    const weeks = first((await draw(breakdown({ by: "shippedAt", bucket: "week", chart: "bars" }))).blocks, "chart");
    expect(weeks.chart).toMatchObject({ kind: "bars" });
    expect(weeks.chart.labels).toHaveLength(2);
    const days = first((await draw(breakdown({ by: "shippedAt" }))).blocks, "chart");
    expect(days.chart.labels).toHaveLength(2);
    const picked = first((await draw(breakdown({ by: "pickedAt", bucket: "month" }))).blocks, "chart");
    expect(picked.chart.labels).toHaveLength(1);
    const repeated = first((await draw(breakdown({ by: "currency", sum: "planned" }))).blocks, "chart");
    expect(repeated.chart).toMatchObject({ labels: ["EUR", "USD"], series: [{ values: [4, 0] }] });
    const blank = first((await draw(breakdown({ by: "notes" }))).blocks, "chart");
    expect(blank.chart.labels).toEqual(["First line\nSecond line"]);
  });

  it("shows parts as a ring, share bar, treemap or table", async () => {
    const ring = first((await draw(breakdown({ by: "status", as: "ring" }))).blocks, "ring");
    expect(ring).toMatchObject({ label: "By status", total: "3", center: "orders" });
    expect(ring.parts[0]).toMatchObject({ value: 1, valueText: "1" });
    expect(ring.parts.map((p) => p.href)).toContain(
      "/collections/orders?filters[0][field]=status&filters[0][operator]=equals&filters[0][value]=ready",
    );
    const money = first(
      (await draw(breakdown({ by: "customer", as: "ring", sum: "total" }, { title: undefined }))).blocks,
      "ring",
    );
    expect(money).toMatchObject({ label: "Orders", total: usd("200"), center: m.widget_data_in_all() });
    expect(money.parts[0]!.href).toContain("value]=c1");
    const share = await draw(breakdown({ by: "status", as: "share" }));
    expect(share.e.skeleton).toBe("list");
    expect(first(share.blocks, "share")).toMatchObject({ label: "Orders", total: "3" });
    const tree = first((await draw(breakdown({ by: "status", as: "treemap", sum: "price" }))).blocks, "treemap");
    expect(tree).toMatchObject({ label: "By status", total: "55" });
    const dated = first((await draw(breakdown({ by: "shippedAt", bucket: "month", as: "ring" }))).blocks, "ring");
    expect(dated.parts.every((p) => p.href === undefined)).toBe(true);
    const table = await draw(breakdown({ by: "status", stack: "size", as: "table", sum: "total" }));
    expect(table.e.skeleton).toBe("table");
    const t = first(table.blocks, "table");
    expect(t.columns.map((c) => c.key)).toEqual(["__x", "s0", "s1", "__total"]);
    expect(t.rows[0]).toMatchObject({ __x: { text: "Ready", strong: true }, __total: { strong: true } });
    expect(t.rows.at(-1)!.s0).toBe("—");
    const single = first((await draw(breakdown({ by: "status", as: "table" }))).blocks, "table");
    expect(single.columns.map((c) => c.key)).toEqual(["__x", "s0"]);
    expect(single.rows[0]!.s0).toBe("1");
    const euros = first((await draw(breakdown({ by: "status", as: "table", sum: "price" }))).blocks, "table");
    expect(euros.rows[0]!.s0).toBe("30");
  });

  it("explains a missing collection", async () => {
    const { blocks } = await draw(breakdown({ collection: "missing", by: "x" }));
    expect(first(blocks, "alert")).toMatchObject({ tone: "error", text: 'No collection "missing".' });
  });
});

describe("counts", () => {
  it("counts each option of a field as figures with shares", async () => {
    const { tiles } = await draw({ size: "s", counts: { collection: "orders", field: "status", skip: ["shipped"] } });
    const stats = tiles!.map((t) => (t[0] as ViewBlocks["stats"]).items[0]!);
    expect(stats.map((s) => [s.label, s.value, s.tone])).toEqual([
      ["Ready", "1", undefined],
      ["Cancelled", "1", undefined],
    ]);
    expect(stats[0]!.href).toContain("value]=ready");
    expect(stats[0]!.share!.text).toBe(m.widget_share_of_total({ pct: 50, total: 2, noun: "orders" }));
    const none = await draw({ size: "s", counts: { collection: "orders", field: "missing" } });
    expect(none.tiles).toEqual([]);
    const unknown = await draw({ size: "s", counts: { collection: "gone", field: "x" } });
    expect(unknown.e.source).toEqual({ all: {} });
  });

  it("counts given items as a list or a funnel", async () => {
    const items = [
      { label: "Ready", where: { status: { equals: "ready" } }, tone: "error" as const, note: "Waiting" },
      { label: "People", where: {}, collection: "customers", tone: "info" as const },
      { label: "Late", where: { status: { equals: "late" } }, tone: "warning" as const },
    ];
    const list = await draw({ title: "Queue", size: "s", counts: { collection: "orders", layout: "list", items } });
    expect(list.e.skeleton).toBe("list");
    expect(first(list.blocks, "list")).toMatchObject({
      variant: "divided",
      items: [
        {
          headline: "Ready",
          supporting: "Waiting",
          href: "/collections/orders",
          value: { text: "1", strong: true, tone: "error" },
        },
        { headline: "People", href: "/collections/customers", value: { text: "1", tone: undefined } },
        { headline: "Late", value: { text: "0", tone: undefined } },
      ],
    });
    const funnel = await draw({
      title: "Flow",
      size: "s",
      skeleton: "chart",
      counts: { collection: "orders", layout: "funnel", items },
    });
    expect(funnel.e.skeleton).toBe("chart");
    expect(first(funnel.blocks, "funnel")).toMatchObject({
      label: "Flow",
      stages: [{ label: "Ready", value: 1 }, { value: 1 }, { value: 0 }],
    });
    const plainFunnel = await draw({
      title: "Flow",
      size: "s",
      counts: { collection: "orders", layout: "funnel", items },
    });
    expect(plainFunnel.e.skeleton).toBe("list");
    const figures = await draw({ size: "s", counts: { collection: "orders", items } });
    expect((figures.tiles![0]![0] as ViewBlocks["stats"]).items[0]).toMatchObject({ tone: "error", share: undefined });
    const named = await draw({
      size: "s",
      counts: { collection: "orders", field: "status", layout: "list" },
      title: "S",
    });
    expect(first(named.blocks, "list").items[0]!.value).toMatchObject({ tone: undefined });
    const toned = await draw({
      title: "T",
      size: "s",
      skeleton: "list",
      counts: { collection: "orders", field: "status", layout: "funnel" },
    });
    expect(toned.e.skeleton).toBe("list");
  });
});

describe("fields", () => {
  it("lists a document's fields with its actions", async () => {
    const s = { ...scope, doc: { id: "o1", slug: "orders" } };
    const { blocks, e } = await draw(
      {
        title: "Order",
        size: "s",
        fields: { fields: ["code", "status", "customer.city", "address.street", "customer.missing"], layout: "inline" },
      },
      s,
    );
    expect(e.skeleton).toBe("text");
    expect(first(blocks, "details")).toMatchObject({
      layout: "inline",
      items: [
        { label: "Code", value: "A-1" },
        { label: "Status", value: { text: "Ready" } },
        { label: "City", value: "Portland" },
        { label: "Street", value: "1 Pier Rd" },
      ],
    });
    expect(first(blocks, "actions").items).toHaveLength(3);
    const quiet = await draw(
      { title: "Order", size: "s", skeleton: "card", fields: { fields: ["notes"], actions: false } },
      s,
    );
    expect(quiet.e.skeleton).toBe("card");
    expect(quiet.blocks.map((b) => b.type)).toEqual(["details"]);
    const empty = await draw(
      { title: "Order", size: "s", fields: { fields: ["total"] } },
      { ...s, user: { id: "u2" }, doc: { id: "o3", slug: "orders" } },
    );
    expect(empty.blocks.map((b) => b.type)).toEqual(["details"]);
  });

  it("shows plain labels off a document's screen", async () => {
    const d = dashboard();
    const e = expand({ title: "Order", size: "s", fields: { fields: ["code"] } }, scope, d.project);
    expect([e.render!(doc({ id: "x", code: "Z" }) as never, scope)].flat()).toEqual([
      { type: "details", layout: undefined, items: [{ label: "Code", value: "Z" }] },
    ]);
  });
});

describe("expand", () => {
  it("leaves drawing widgets alone", () => {
    const d = dashboard();
    const w: Widget = { size: "s", render: () => null };
    expect(expand(w, scope, d.project)).toBe(w);
  });
});
