import { describe, expect, it } from "vite-plus/test";
import { boundsOf, KIND_BOUNDS, TILE_SIZES, type TileKind } from "../src/components/base/board.ts";
import { MINI_PARTS, miniBlocks, miniFigure } from "../src/app/widgets/mini.ts";
import type { ViewBlock } from "../src/app/widgets/schema.ts";

/** A side panel's mini versions (src/app/widgets/mini.ts) and every kind's tile bounds (board.ts). */

const one = (b: ViewBlock) => miniBlocks([b]);

describe("mini versions", () => {
  it("draws a figure as a mini figure, its note left out and its sparkline kept", () => {
    const [b] = one({
      type: "stats",
      items: [
        { label: "Live", value: "4", note: "cases", trend: { labels: ["a", "b"], values: [1, 2] } },
        { label: "Other", value: "1" },
      ],
    });
    expect(b).toMatchObject({ type: "stats", mini: true, items: [{ label: "Live", value: "4", note: undefined }] });
    expect((b as Extract<ViewBlock, { type: "stats" }>).items[0]!.trend?.values).toEqual([1, 2]);
    expect(miniFigure([b!], "Live cases")?.[0]).toMatchObject({ mini: true, items: [{ label: "Live cases" }] });
  });

  it("draws a chart over time as its latest value, the series its sparkline, the change its delta", () => {
    const [b] = one({
      type: "chart",
      chart: { kind: "bars", labels: ["3 Nov", "10 Nov", "17 Nov"], series: [{ name: "Quotes", values: [4, 6, 5] }] },
    });
    expect(b).toMatchObject({
      type: "stats",
      mini: true,
      items: [{ label: "Quotes", value: "5", trend: { values: [4, 6, 5] }, delta: { dir: "down" } }],
    });
  });

  it("draws bars of categories as one share bar of the largest, the rest as Other", () => {
    const labels = ["Draft", "Sent", "Won", "Lost", "Expired", "Void"];
    const [b] = one({
      type: "chart",
      chart: { kind: "bars", labels, series: [{ name: "Value", values: [1, 6, 5, 4, 3, 2] }] },
    });
    expect(b?.type).toBe("share");
    const parts = (b as Extract<ViewBlock, { type: "share" }>).parts;
    expect(parts).toHaveLength(MINI_PARTS);
    expect(parts.map((p) => p.label)).toEqual(["Sent", "Won", "Lost", "Other"]);
    expect(parts.at(-1)!.value).toBe(1 + 3 + 2);
  });

  it("draws a dial and a waffle as a figure with its share of the most", () => {
    expect(one({ type: "dial", value: 30, max: 40, label: "Margin" })[0]).toMatchObject({
      items: [{ label: "Margin", share: { value: 0.75 } }],
    });
    expect(one({ type: "waffle", value: 40, label: "Done" })[0]).toMatchObject({
      items: [{ label: "Done", share: { value: 0.4 } }],
    });
  });

  it("writes dates as a short day and month", () => {
    const [b] = one({
      type: "month",
      today: "2026-11-01",
      events: [{ label: "Arrives", date: "2026-11-18" }],
    } as ViewBlock);
    expect((b as Extract<ViewBlock, { type: "list" }>).items[0]!.value).toBe("18 Nov");
  });
});

describe("tile bounds by kind", () => {
  const kinds = Object.keys(KIND_BOUNDS) as TileKind[];
  it("keeps every widget's own size inside its bounds, min ≤ target ≤ max both ways, for every kind", () => {
    // Every kind, size, row count (1–40) and width (none, 1–24): exhaustive over that domain.
    for (const kind of kinds)
      for (const size of TILE_SIZES)
        for (let rows = 1; rows <= 40; rows++)
          for (const width of [undefined, ...Array.from({ length: 24 }, (_, i) => i + 1)]) {
            const b = boundsOf({ size, rows, width, kind });
            expect(b.minRows).toBeLessThanOrEqual(b.rows);
            expect(b.rows).toBeLessThanOrEqual(b.maxRows);
            const span = width ?? (size === "full" ? undefined : { s: 6, m: 12, l: 18 }[size]);
            if (span !== undefined && b.minSpan !== undefined) expect(b.minSpan).toBeLessThanOrEqual(span);
            if (span !== undefined && b.maxSpan !== undefined) expect(b.maxSpan).toBeGreaterThanOrEqual(span);
            if (b.minSpan !== undefined && b.maxSpan !== undefined) expect(b.minSpan).toBeLessThanOrEqual(b.maxSpan);
          }
  });

  it("gives a kind's bounds where the widget gives none, and the widget's where it does", () => {
    expect(boundsOf({ size: "s", rows: 3, width: 4, kind: "stats" })).toMatchObject({
      minSpan: 3,
      maxSpan: 8,
      minRows: 2,
      maxRows: 6,
    });
    expect(boundsOf({ size: "m", rows: 8, kind: "table" })).toMatchObject({ minSpan: 8, minRows: 5 });
    expect(boundsOf({ size: "s", rows: 3, kind: "stats", minWidth: 2, maxRows: 4 })).toMatchObject({
      minSpan: 2,
      maxRows: 4,
    });
  });
});
