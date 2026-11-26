import { describe, expect, it } from "vite-plus/test";
import { m } from "../i18n/index.ts";
import { cellText, MINI_ITEMS, miniBlocks, miniFigure, miniOpen, miniRows } from "./mini.ts";
import type { ViewBlock } from "./schema.ts";

const one = (b: ViewBlock) => miniBlocks([b]);
const list = (...items: { headline: string; value?: unknown; href?: string }[]) => [
  { type: "list", variant: "divided", items },
];

describe("mini sizes", () => {
  it("gives figures one row and lists room for three", () => {
    expect(miniRows(true, "stats")).toBe(1);
    expect(miniRows(false, "chart")).toBe(1);
    expect(miniRows(true)).toBe(5);
    expect(miniRows(false, "table")).toBe(4);
  });

  it("reads a cell's words", () => {
    expect(cellText(null)).toBe("");
    expect(cellText(undefined)).toBe("");
    expect(cellText(3)).toBe("3");
    expect(cellText("a")).toBe("a");
    expect(cellText({ text: "b", tag: true })).toBe("b");
  });

  it("turns a lone figure into a titled mini figure", () => {
    const stats: ViewBlock = { type: "stats", items: [{ label: "Paid", value: "4" }] };
    expect(miniFigure([stats], "Paid this week")).toEqual([
      { ...stats, mini: true, items: [{ label: "Paid this week", value: "4" }] },
    ]);
    expect(miniFigure([stats])).toEqual([{ ...stats, mini: true, items: [{ label: "Paid", value: "4" }] }]);
    expect(miniFigure([stats, stats])).toBeUndefined();
    expect(miniFigure([{ type: "divider" }])).toBeUndefined();
    expect(miniFigure([{ type: "stats", items: [] }])).toBeUndefined();
    expect(miniOpen("/x", "Invoices")).toEqual(
      list({ headline: m.widget_mini_open({ label: "Invoices" }), href: "/x" }),
    );
  });
});

describe("miniBlocks", () => {
  it("opens cards, grids and splits", () => {
    const t: ViewBlock = { type: "text", text: "Hi", muted: true };
    expect(
      miniBlocks([
        { type: "card", blocks: [t] },
        { type: "grid", blocks: [t] },
      ]),
    ).toEqual([t, t]);
    expect(one({ type: "split", main: [t], side: [{ type: "divider" }] })).toEqual([t]);
  });

  it("keeps the main figure", () => {
    expect(
      one({
        type: "stats",
        items: [
          { label: "A", value: "1" },
          { label: "B", value: "2", main: true, note: "x" },
        ],
      }),
    ).toEqual([
      { type: "stats", size: "md", mini: true, items: [{ label: "B", value: "2", main: true, note: undefined }] },
    ]);
    expect(one({ type: "stats", items: [{ label: "A", value: "1" }] })[0]).toMatchObject({ items: [{ label: "A" }] });
    expect(one({ type: "stats", items: [] })).toEqual([]);
  });

  it("shows a timed chart as its last value and others as parts", () => {
    const series = (values: number[]) => [{ name: "Paid", values }];
    expect(one({ type: "chart", chart: { kind: "bars", labels: [], series: [] } })).toEqual([]);
    expect(one({ type: "chart", chart: { kind: "bars", labels: [], series: series([]) } })).toEqual([]);
    expect(one({ type: "chart", chart: { kind: "line", labels: ["Jan", "Feb"], series: series([3, 5]) } })).toEqual([
      {
        type: "stats",
        size: "md",
        mini: true,
        items: [
          {
            label: "Paid",
            value: "5",
            note: undefined,
            trend: { labels: ["Jan", "Feb"], values: [3, 5], format: undefined },
            delta: { text: "+2 vs Jan", dir: "up" },
          },
        ],
      },
    ]);
    const down = one({
      type: "chart",
      chart: { kind: "bars", highlightLast: true, labels: ["a", "b"], series: series([5, 3]) },
    });
    expect(down[0]).toMatchObject({ items: [{ delta: { text: "−2 vs a", dir: "down" } }] });
    const flat = one({ type: "chart", chart: { kind: "bars", ranges: [], labels: ["a"], series: series([5]) } });
    expect((flat[0] as { items: object[] }).items[0]).not.toHaveProperty("delta");
    const same = one({ type: "chart", chart: { kind: "bars", labels: ["W1", "W2"], series: series([4, 4]) } });
    expect((same[0] as { items: object[] }).items[0]).not.toHaveProperty("delta");
    expect(
      one({ type: "chart", title: "Mix", chart: { kind: "bars", labels: ["a", "b"], series: series([2]) } }),
    ).toEqual([{ type: "share", label: "Mix", parts: [{ label: "a", value: 2, valueText: "2" }] }]);
    expect(one({ type: "chart", label: "L", chart: { kind: "bars", labels: ["a"], series: series([0]) } })).toEqual([]);
  });

  it("folds many parts into other", () => {
    const parts = [5, 4, 3, 2, 1].map((value, i) => ({ label: `P${i}`, value }));
    expect(one({ type: "share", parts })).toEqual([
      {
        type: "share",
        parts: [...parts.slice(0, 3), { label: m.widget_mini_other(), value: 3 }],
      },
    ]);
    expect(one({ type: "treemap", label: "T", items: parts.slice(0, 2) })).toEqual([
      { type: "share", label: "T", parts: parts.slice(0, 2) },
    ]);
  });

  it("lists the first rows of tables and lists", () => {
    const table: ViewBlock = {
      type: "table",
      columns: [
        { key: "empty", label: "E" },
        { key: "name", label: "Name" },
        { key: "total", label: "Total" },
      ],
      rows: [
        { name: "A", total: "1", href: "/a" },
        { name: { text: "B", tag: true }, total: null },
        { name: "C", total: "3" },
        { name: "D", total: "4" },
        { name: "Sum", total: "8" },
      ],
      totals: true,
    };
    expect(one(table)).toEqual(
      list({ headline: "A", value: "1", href: "/a" }, { headline: "B" }, { headline: "C", value: "3" }),
    );
    expect(one({ type: "table", columns: [{ key: "n", label: "N" }], rows: [{ n: "x" }] })).toEqual(
      list({ headline: "x" }),
    );
    expect(one({ type: "table", columns: [{ key: "n", label: "N" }], rows: [{ n: "" }] })).toEqual(
      list({ headline: "" }),
    );
    expect(one({ type: "table", columns: [], rows: [] })).toEqual([]);
  });

  it("turns lists and timelines into rows", () => {
    expect(
      one({
        type: "list",
        items: [
          { headline: "A", value: "1", dot: "error" },
          { headline: "B", trailing: "2", lead: "09:00" },
          { headline: "C", lead: "10:00", href: "/c" },
        ],
      }),
    ).toEqual([
      {
        type: "list",
        variant: "divided",
        items: [
          { headline: "A", value: "1", dot: "error" },
          { headline: "B", value: "2" },
          { headline: "C", value: "10:00", href: "/c" },
        ],
      },
    ]);
    expect(one({ type: "entries", items: [{ heading: "E", href: "/e" }] })[0]).toMatchObject({
      items: [{ headline: "E", href: "/e" }],
    });
    expect(one({ type: "timeline", items: [{ heading: "H", time: "9:00" }, { text: "T" }, {}] })[0]).toMatchObject({
      items: [{ headline: "H", value: "9:00" }, { headline: "T" }, { headline: "" }],
    });
    expect(
      one({ type: "gantt", label: "G", periods: [], rows: [{ label: "R", from: 0, to: 1, tag: "A" }] })[0],
    ).toMatchObject({
      items: [{ headline: "R", value: "A" }],
    });
    expect(one({ type: "tiles", items: [{ heading: "T", overline: "O" }] })[0]).toMatchObject({
      items: [{ headline: "T", value: "O" }],
    });
    expect(
      (one({ type: "tiles", figure: true, items: [{ heading: "T", overline: "O" }] })[0] as { items: object[] })
        .items[0],
    ).toEqual({ headline: "T" });
    expect(one({ type: "list", items: [] })).toEqual([]);
  });

  it("reads rings as a share or parts", () => {
    expect(
      one({ type: "ring", max: 10, label: "Done", parts: [{ label: "A", value: 4, valueText: "4 of 10" }] }),
    ).toEqual([
      {
        type: "stats",
        size: "md",
        mini: true,
        items: [
          {
            label: "Done",
            value: "4 of 10",
            note: undefined,
            share: { value: 0.4, text: m.widget_share_of_max({ max: 10 }) },
          },
        ],
      },
    ]);
    expect(one({ type: "ring", max: 0, total: "all", parts: [{ label: "A", value: 4 }] })[0]).toMatchObject({
      items: [{ label: "A", value: "4", share: { value: 4, text: "all" } }],
    });
    expect(one({ type: "ring", max: 10, parts: [] })).toEqual([]);
    expect(one({ type: "ring", parts: [{ label: "A", value: 1 }] })).toEqual([
      { type: "share", parts: [{ label: "A", value: 1 }] },
    ]);
  });

  it("lists funnels, bullets, quadrants and countdowns", () => {
    expect(
      one({
        type: "funnel",
        stages: [
          { label: "A", value: 3 },
          { label: "B", value: 1, valueText: "one" },
        ],
      })[0],
    ).toMatchObject({
      items: [
        { headline: "A", value: "3" },
        { headline: "B", value: "one" },
      ],
    });
    expect(
      one({
        type: "bullet",
        items: [
          { label: "A", value: 3, max: 5 },
          { label: "B", value: 1, max: 2, valueText: "x" },
        ],
      })[0],
    ).toMatchObject({
      items: [
        { headline: "A", value: "3" },
        { headline: "B", value: "x" },
      ],
    });
    expect(
      one({ type: "quadrant", xLabel: "x", yLabel: "y", points: [{ label: "P", x: 1, y: 2, valueText: "v" }] })[0],
    ).toMatchObject({
      items: [{ headline: "P", value: "v" }],
    });
    expect(
      one({
        type: "countdown",
        items: [
          { label: "Later", due: "2026-05-02T00:00:00.000Z" },
          { label: "Soon", due: "2026-04-01" },
          { label: "Odd", due: "someday" },
        ],
      })[0],
    ).toMatchObject({ items: [{ headline: "Soon" }, { headline: "Later" }, { headline: "Odd", value: "someday" }] });
  });

  it("lists upcoming month events", () => {
    const events = [
      { date: "2026-03-20", label: "Later" },
      { date: "2026-03-02", label: "Past" },
      { date: "2026-03-17", label: "Next" },
    ];
    expect(one({ type: "month", month: "2026-03", today: "2026-03-16", events })[0]).toMatchObject({
      items: [{ headline: "Next" }, { headline: "Later" }],
    });
    expect((one({ type: "month", month: "2026-03", events })[0] as { items: object[] }).items).toHaveLength(MINI_ITEMS);
  });

  it("sums a heatmap by week", () => {
    const days = Array.from({ length: 8 }, (_, i) => ({ label: `d${i}`, value: 1 }));
    expect(one({ type: "heatmap", days })[0]).toMatchObject({
      items: [{ label: m.widget_total(), value: "8", trend: { labels: ["d0", "d7"], values: [7, 1] } }],
    });
    const week = one({ type: "heatmap", label: "Visits", days: days.slice(0, 3) })[0] as { items: object[] };
    expect(week.items[0]).toEqual({ label: "Visits", value: "3", note: undefined });
  });

  it("reads dials, waffles and waterfalls as figures", () => {
    expect(
      one({
        type: "dial",
        value: 30,
        max: 50,
        zones: [
          { to: 20, tone: "error" },
          { to: 50, tone: "success" },
        ],
      })[0],
    ).toMatchObject({
      items: [{ label: m.widget_mini_reading(), value: "30", tone: "success", share: { value: 0.6 } }],
    });
    const plain = one({ type: "dial", value: 5, min: 5, max: 5, valueText: "5", caption: "c", label: "L" })[0] as {
      items: object[];
    };
    expect(plain.items[0]).toEqual({ label: "L", value: "5", note: undefined, share: { value: 0, text: "c" } });
    expect(one({ type: "dial", value: 60, max: 50, zones: [{ to: 50, tone: "error" }] })[0]).toMatchObject({
      items: [{ share: { value: 1.2 } }],
    });
    expect(one({ type: "waffle" })[0]).toMatchObject({
      items: [{ label: m.widget_mini_share(), value: "0", share: { value: 0 } }],
    });
    expect(one({ type: "waffle", value: 5, max: 0, label: "W", valueText: "5%", caption: "c" })[0]).toMatchObject({
      items: [{ label: "W", value: "5%", share: { value: 5, text: "c" } }],
    });
    const steps = [
      { label: "Revenue", value: 100 },
      { label: "Costs", value: -40 },
      { label: "Margin", value: 60, total: true, valueText: "$60" },
      { label: "After", value: 5 },
    ];
    expect(one({ type: "waterfall", steps })[0]).toMatchObject({
      items: [{ label: "Margin", value: "$60", share: { value: 0.6 } }],
    });
    expect(one({ type: "waterfall", steps: steps.slice(0, 2) })[0]).toMatchObject({
      items: [{ label: "Costs", value: "-40", share: { value: 0 } }],
    });
    expect(
      (one({ type: "waterfall", steps: [{ label: "Only", value: 3, valueText: "3" }] })[0] as { items: object[] })
        .items[0],
    ).not.toHaveProperty("share");
    expect(
      (
        one({
          type: "waterfall",
          steps: [
            { label: "Zero", value: 0 },
            { label: "B", value: 2 },
          ],
        })[0] as { items: object[] }
      ).items[0],
    ).not.toHaveProperty("share");
    expect(one({ type: "waterfall", steps: [] })).toEqual([]);
  });

  it("keeps the first gauges and details, the current step and plain blocks", () => {
    const gauges = Array.from({ length: 5 }, (_, i) => ({ label: `G${i}`, value: i, max: 5 }));
    expect(one({ type: "gauges", items: gauges })).toEqual([{ type: "gauges", items: gauges.slice(0, MINI_ITEMS) }]);
    const details = gauges.map((g) => ({ label: g.label, value: "x" }));
    expect(one({ type: "details", items: details })).toEqual([
      { type: "details", items: details.slice(0, MINI_ITEMS) },
    ]);
    expect(one({ type: "steps", items: [{ label: "A" }, { label: "B" }], current: 1 })[0]).toMatchObject({
      type: "text",
      muted: true,
    });
    expect(one({ type: "steps", items: [], current: 0 })).toEqual([]);
    expect(one({ type: "alert", tone: "error", heading: "H", text: "T", actions: [{ label: "x" }] })).toEqual([
      { type: "alert", tone: "error", heading: "H", text: "T" },
    ]);
    const empty: ViewBlock = { type: "empty", heading: "None" };
    const tags: ViewBlock = { type: "tags", items: [] };
    expect(miniBlocks([empty, tags])).toEqual([empty, tags]);
    expect(one({ type: "text", text: "Hi", speak: true })).toEqual([{ type: "text", text: "Hi", muted: undefined }]);
    expect(one({ type: "divider" })).toEqual([]);
  });
});
