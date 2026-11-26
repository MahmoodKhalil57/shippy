import { describe, expect, it } from "vite-plus/test";
import type { ViewBlock } from "./schema.ts";
import { loadingSize, tileSizeOf } from "./tile.ts";
import type { Widget } from "./widget.ts";

const of = (type: string, extra: object = {}) => ({ type, ...extra }) as ViewBlock;
const MEDIUM = [
  "chart",
  "heatmap",
  "treemap",
  "waterfall",
  "quadrant",
  "whatif",
  "entries",
  "timeline",
  "tiles",
  "steps",
  "ask",
  "grid",
  "split",
];

describe("tile sizes", () => {
  it("sizes a tile by its widest block", () => {
    for (const t of ["table", "gantt", "document", "form", "settings", "message"])
      expect(tileSizeOf([of(t)])).toBe("l");
    for (const t of MEDIUM) expect(tileSizeOf([of(t)])).toBe("m");
    expect(tileSizeOf([of("stats", { items: [1, 2, 3] })])).toBe("m");
    expect(tileSizeOf([of("stats", { items: [1] })])).toBe("s");
    expect(tileSizeOf([of("choice")])).toBe("full");
    expect(tileSizeOf([of("card", { blocks: [of("text"), of("chart")] })])).toBe("m");
    expect(tileSizeOf([of("text"), of("table"), of("chart")])).toBe("l");
    expect(tileSizeOf([])).toBe("s");
  });

  it("guesses the size of a widget that is still loading", () => {
    const w = (x: object) => ({ size: "s", ...x }) as Widget;
    expect(loadingSize(w({ skeleton: "table" }))).toBe("l");
    for (const skeleton of ["chart", "entries", "stats"]) expect(loadingSize(w({ skeleton }))).toBe("m");
    expect(loadingSize(w({ records: { columns: [], layout: "list" } }))).toBe("s");
    expect(loadingSize(w({ records: { columns: [] } }))).toBe("l");
    expect(loadingSize(w({ counts: { collection: "x", field: "y" } }))).toBe("m");
    expect(loadingSize(w({}))).toBe("s");
  });
});
