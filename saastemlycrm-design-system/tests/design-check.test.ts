import { describe, expect, it } from "vite-plus/test";
import {
  block,
  designProblems,
  note,
  tileProblems,
  type Action,
  type DrawnTile,
  type ViewBlock,
} from "../src/contracts/index.ts";

/** The data-driven design rules (src/app/widgets/design-check.ts), each grounded in M3 or the HIG. */

/** One block in a titled widget, as the screen check draws it. */
const one = (b: ViewBlock) => designProblems([block("card", { heading: "Widget", blocks: [b] })], "screen");

describe("designProblems", () => {
  it("passes a screen built the intended way", () => {
    expect(
      designProblems(
        [
          block("choice", { param: "view", label: "View", value: "all", options: [{ value: "all", label: "All" }] }),
          block("card", {
            heading: "Requests",
            blocks: [
              note("What this is for."),
              block("entries", {
                items: [
                  {
                    heading: "Quote v1",
                    facts: [{ label: "Total", value: "USD 1,790" }],
                    actions: [{ label: "Approve", main: true }],
                  },
                ],
              }),
            ],
          }),
        ],
        "screen",
      ),
    ).toEqual([]);
  });

  it("flags button labels past four words (M3 Buttons: ideally 1–3)", () => {
    expect(one(block("actions", { items: [{ label: "Request approval from the manager" }] }))[0]).toMatch(/5 words/);
    expect(one(block("actions", { items: [{ label: "Request approval" }] }))).toEqual([]);
  });

  it("flags an info alert with nothing to do (HIG Alerts)", () => {
    expect(one(block("alert", { tone: "info", text: "Just so you know." }))[0]).toMatch(/note\(\)/);
    const act: Action = { label: "Open", href: "/x" };
    expect(one(block("alert", { tone: "info", text: "Act on this.", actions: [act] }))).toEqual([]);
    expect(one(block("alert", { tone: "warning", text: "Careful." }))).toEqual([]);
  });

  it("flags headings that wrap past two lines (HIG Alerts)", () => {
    expect(one(block("card", { heading: "x".repeat(91), blocks: [note("y")] }))[0]).toMatch(/91 characters/);
  });

  it("flags an entry that says the same thing twice", () => {
    const same = "New supplier asks for a 50% advance";
    const problems = one(
      block("entries", { items: [{ heading: "Quote", facts: [{ label: "Exceptions", value: same }], notes: [same] }] }),
    );
    expect(problems[0]).toMatch(/said twice/);
  });

  it("flags cards three levels deep and empty cards", () => {
    const deep = block("card", { blocks: [block("card", { blocks: [block("card", { blocks: [note("x")] })] })] });
    expect(one(deep).some((p) => /three levels deep/.test(p))).toBe(true);
    expect(one(block("card", { heading: "Empty", blocks: [] }))[0]).toMatch(/empty card/);
  });
});

describe("tileProblems", () => {
  const tile = (size: DrawnTile["size"], blocks: ViewBlock[], title: string | null = "Orders") =>
    tileProblems([{ title: title ?? undefined, size, blocks }], "screen");
  const table = block("table", { columns: [{ key: "a", label: "A" }], rows: [{ a: "1" }] });
  const text = note("A line.");

  it("flags a table in an `s` tile, however deep (HIG Lists and tables; M3 Layout)", () => {
    expect(tile("s", [table])[0]).toMatch(/table in an `s` tile/);
    expect(tile("s", [block("card", { blocks: [table] })])[0]).toMatch(/table in an `s` tile/);
    expect(tile("m", [table])).toEqual([]);
    expect(tile(undefined, [table])).toEqual([]);
  });

  it("flags a grid or split at a tile's top, not deeper (M3 Cards: the board is the grid)", () => {
    expect(tile("m", [block("grid", { blocks: [text, text] })])[0]).toMatch(/a grid at the top/);
    expect(tile("m", [block("split", { main: [text], side: [text] })])[0]).toMatch(/a split at the top/);
    expect(tile("m", [block("card", { blocks: [block("grid", { blocks: [text, text] })] })])).toEqual([]);
  });

  it("flags more blocks than the tile's size holds (M3 Cards: a single subject)", () => {
    const n = (k: number) => Array.from({ length: k }, () => text);
    expect(tile("s", n(4))).toEqual([]);
    expect(tile("s", n(5))[0]).toMatch(/5 blocks in an `s` tile \(at most 4\)/);
    expect(tile("m", n(6))).toEqual([]);
    expect(tile("m", n(7))[0]).toMatch(/at most 6/);
    expect(tile("l", n(8))).toEqual([]);
    expect(tile("full", n(9))[0]).toMatch(/at most 8/);
    expect(tile(undefined, n(9))[0]).toMatch(/at most 8/);
  });

  it("flags an untitled tile unless it steers the screen or alerts (HIG Lists and tables)", () => {
    expect(tile("s", [text], null)[0]).toMatch(/text without a title/);
    expect(tile("s", [text], " ")[0]).toMatch(/without a title/);
    const choice = block("choice", {
      param: "view",
      label: "View",
      value: "all",
      options: [{ value: "all", label: "All" }],
    });
    const actions = block("actions", { items: [{ label: "New" }] });
    const alert = block("alert", { tone: "warning", text: "Careful." });
    expect(tile("full", [choice, actions, alert], null)).toEqual([]);
    expect(tile("full", [choice, text], null)[0]).toMatch(/text without a title/);
    // A strip of key figures stands on the page: every figure carries its own label.
    expect(tile("full", [block("stats", { items: [{ label: "Open", value: "3" }] })], null)).toEqual([]);
  });

  it("flags a second inverse tile on a screen (M3: inverse roles are applied selectively)", () => {
    const board = (...emphasis: DrawnTile["emphasis"][]) =>
      tileProblems(
        emphasis.map((e, i) => ({ title: `Tile ${i + 1}`, size: "s", emphasis: e, blocks: [text] })),
        "screen",
      );
    expect(board("inverse")).toEqual([]);
    expect(board("inverse", "tinted", "tinted", undefined)).toEqual([]);
    expect(board("inverse", undefined, "inverse")).toEqual([
      "screen: 2 inverse tiles (Tile 1, Tile 3); keep the one the screen is about, make the others `tinted` or plain",
    ]);
    // Every placement of the three surfaces on a board of up to four tiles: flagged exactly when
    // more than one is inverse.
    const SURFACES: DrawnTile["emphasis"][] = [undefined, "tinted", "inverse"];
    const boards = (n: number): DrawnTile["emphasis"][][] =>
      n === 0 ? [[]] : boards(n - 1).flatMap((b) => SURFACES.map((s) => [...b, s]));
    for (const b of [1, 2, 3, 4].flatMap(boards))
      expect(board(...b).length, b.join()).toBe(b.filter((e) => e === "inverse").length > 1 ? 1 : 0);
  });

  it("flags an emphasis on an untitled tile: it has no surface to change", () => {
    const stats = block("stats", { items: [{ label: "Open", value: "3" }] });
    expect(tileProblems([{ size: "full", emphasis: "tinted", blocks: [stats] }], "screen")[0]).toMatch(
      /`emphasis` on an untitled tile/,
    );
    expect(tileProblems([{ title: "Figures", size: "m", emphasis: "tinted", blocks: [stats] }], "screen")).toEqual([]);
  });
});

describe("designProblems' tiles", () => {
  const text = note("A line.");
  it("reads them from the drawn blocks: headed cards, inside grids and splits, and bare blocks", () => {
    const grid = block("card", { heading: "Inner", blocks: [block("grid", { blocks: [text] })] });
    const problems = designProblems(
      [block("split", { main: [grid], side: [block("details", { items: [{ label: "Open", value: "3" }] })] })],
      "screen",
    );
    expect(problems).toEqual([
      "screen › Inner: a grid at the top of a tile; make its parts widgets of their own",
      "screen › untitled tile: details without a title; give the widget a `title`",
    ]);
  });

  it("uses the tiles it's given instead, with their sizes", () => {
    const table = block("table", { columns: [{ key: "a", label: "A" }], rows: [{ a: "1" }] });
    const drawn = [block("card", { heading: "Orders", blocks: [table] })];
    expect(designProblems(drawn, "screen")).toEqual([]);
    expect(designProblems(drawn, "screen", [{ title: "Orders", size: "s", blocks: [table] }])[0]).toMatch(
      /table in an `s` tile/,
    );
  });
});

describe("Action", () => {
  it("can't be both the main action and destructive (HIG Buttons)", () => {
    // @ts-expect-error main and tone "error" don't go together
    const bad: Action = { label: "Delete", main: true, tone: "error" };
    expect(bad.label).toBe("Delete");
  });
});
