import { describe, expect, it } from "vite-plus/test";
import {
  designProblems,
  MAX_HEADING,
  MAX_INVERSE_TILES,
  MAX_STATS,
  MAX_TILE_BLOCKS,
  tileProblems,
} from "./design-check.ts";
import type { Stat, ViewBlock } from "./schema.ts";

const text = (t = "Hello"): ViewBlock => ({ type: "text", text: t });
const table: ViewBlock = { type: "table", columns: [{ key: "a", label: "A" }], rows: [] };
const long = "x".repeat(MAX_HEADING + 1);
const figure = (s: Partial<Stat> = {}): Stat => ({ label: "Paid", value: "12", ...s });

describe("tile rules", () => {
  it("keeps tables out of small tiles, wherever they are nested", () => {
    for (const blocks of [
      [table],
      [{ type: "card", blocks: [table] } as ViewBlock],
      [{ type: "card", blocks: [{ type: "grid", blocks: [table] }] } as ViewBlock],
      [{ type: "card", blocks: [{ type: "split", main: [], side: [table] }] } as ViewBlock],
      [{ type: "card", blocks: [{ type: "split", main: [table], side: [] }] } as ViewBlock],
    ])
      expect(tileProblems([{ title: "T", size: "s", blocks }], "home")).toContain(
        "home › T: a table in an `s` tile; make it `m` or wider",
      );
    expect(tileProblems([{ title: "T", size: "m", blocks: [table] }], "home")).toEqual([]);
    expect(tileProblems([{ title: "T", size: "s", blocks: [text()] }], "home")).toEqual([]);
  });

  it("asks for grids and splits to be widgets of their own", () => {
    expect(
      tileProblems(
        [
          {
            title: "T",
            blocks: [
              { type: "grid", blocks: [] },
              { type: "split", main: [], side: [] },
            ],
          },
        ],
        "p",
      ),
    ).toEqual([
      "p › T: a grid at the top of a tile; make its parts widgets of their own",
      "p › T: a split at the top of a tile; make its parts widgets of their own",
    ]);
  });

  it("caps the blocks per tile size", () => {
    expect(MAX_TILE_BLOCKS).toEqual({ s: 4, m: 6, l: 8, full: 8 });
    const many = (n: number) => Array.from({ length: n }, () => text());
    expect(tileProblems([{ title: "T", size: "s", blocks: many(4) }], "p")).toEqual([]);
    expect(tileProblems([{ title: "T", size: "s", blocks: many(5) }], "p")).toEqual([
      "p › T: 5 blocks in an `s` tile (at most 4); keep it about one thing",
    ]);
    expect(tileProblems([{ title: "T", blocks: many(9) }], "p")).toEqual([
      "p › T: 9 blocks in a tile (at most 8); keep it about one thing",
    ]);
  });

  it("asks untitled tiles for a title unless their blocks stand alone", () => {
    expect(
      tileProblems(
        [
          {
            blocks: [
              { type: "stats", items: [] },
              { type: "empty", heading: "None" },
            ],
          },
        ],
        "p",
      ),
    ).toEqual([]);
    expect(tileProblems([{ title: " ", emphasis: "tinted", blocks: [text(), text(), table] }], "p")).toEqual([
      "p › untitled tile: text, table without a title; give the widget a `title`",
      "p › untitled tile: `emphasis` on an untitled tile does nothing; give the widget a `title`",
    ]);
  });

  it("allows one inverse tile per board", () => {
    const inverse = (title: string) => ({ title, emphasis: "inverse" as const, blocks: [text()] });
    expect(MAX_INVERSE_TILES).toBe(1);
    expect(tileProblems([inverse("A"), { emphasis: "inverse", blocks: [] }], "p")).toEqual([
      "p › untitled tile: `emphasis` on an untitled tile does nothing; give the widget a `title`",
    ]);
    expect(tileProblems([inverse("A"), inverse("B")], "p")).toEqual([
      "p: 2 inverse tiles (A, B); keep the one the screen is about, make the others `tinted` or plain",
    ]);
  });
});

describe("designProblems", () => {
  it("splits blocks into tiles by card when no tiles are given", () => {
    expect(
      designProblems(
        [
          { type: "card", heading: "Week", blocks: [text()] },
          { type: "card", blocks: [text()] },
          { type: "grid", blocks: [{ type: "split", main: [text()], side: [table] }] },
        ],
        "p",
      ),
    ).toEqual([
      "p › untitled tile: card without a title; give the widget a `title`",
      "p › untitled tile: text without a title; give the widget a `title`",
      "p › untitled tile: table without a title; give the widget a `title`",
    ]);
  });

  it("keeps button labels short", () => {
    const action = { label: "Send the reminder to everyone now" };
    const all: ViewBlock[] = [
      { type: "actions", items: [action] },
      { type: "card", heading: "C", blocks: [text()], actions: [action] },
      { type: "alert", tone: "warning", text: "Late", actions: [action] },
      { type: "list", items: [{ headline: "A", actions: [action] }, { headline: "B" }] },
      { type: "entries", items: [{ heading: "E", actions: [action] }, { heading: "F" }] },
    ];
    const found = designProblems(all, "p", [{ title: "T", blocks: [] }]);
    expect(found.filter((p) => p.includes("is 6 words"))).toHaveLength(5);
    expect(designProblems([{ type: "actions", items: [{ label: "Send it" }] }], "p", [])).toEqual([]);
  });

  it("checks cards", () => {
    const deep: ViewBlock = {
      type: "card",
      heading: long,
      blocks: [{ type: "card", blocks: [{ type: "card", heading: "Third", count: 2, blocks: [] }] }],
    };
    expect(designProblems([deep], "p", [])).toEqual([
      `p › ${long}: heading is ${long.length} characters`,
      `p › ${long} › card › Third: a card three levels deep; flatten it or use \`entries\``,
    ]);
    expect(designProblems([{ type: "card", blocks: [] }], "p", [])).toEqual([
      "p › card: an empty card; give its widget an empty state (`empty`)",
    ]);
  });

  it("walks grids and splits and checks heading blocks", () => {
    expect(
      designProblems(
        [
          { type: "grid", blocks: [{ type: "heading", text: long }] },
          { type: "split", main: [{ type: "heading", text: "Short" }], side: [{ type: "heading", text: long }] },
        ],
        "p",
        [],
      ),
    ).toEqual([`p: heading block is ${long.length} characters`, `p: heading block is ${long.length} characters`]);
  });

  it("asks each figure for context and its own tile", () => {
    const bare = designProblems(
      [{ type: "stats", items: [figure(), figure({ label: "Due", value: "None" })] }],
      "p",
      [],
    );
    expect(bare).toEqual([
      "p: 2 figures in one tile; make each its own widget (`figures`, or `metrics`/`counts`)",
      'p › "Paid": a bare figure; give it a trend (`trend`), a change (`delta`) or its part of a whole or a target (`share`)',
    ]);
    const told = [
      figure({ trend: { labels: ["a"], values: [1] } }),
      figure({ delta: { text: "+1", dir: "up" } }),
      figure({ share: { value: 0.5 } }),
    ];
    expect(designProblems([{ type: "stats", items: [told[0]!] }], "p", [])).toEqual([]);
    expect(designProblems([{ type: "stats", size: "sm", items: told }], "p", [])).toEqual([]);
    const crowd = Array.from({ length: MAX_STATS + 1 }, () => figure());
    expect(designProblems([{ type: "stats", size: "sm", items: crowd }], "p", [])).toEqual([
      `p: ${MAX_STATS + 1} stats in a row; keep the ${MAX_STATS} that matter`,
    ]);
  });

  it("checks entries for long headings and repeats", () => {
    const said = "The van is booked for Thursday";
    expect(
      designProblems(
        [
          {
            type: "entries",
            items: [
              {
                heading: long,
                text: said,
                facts: [
                  { label: "Van", value: { text: said } },
                  { label: "Driver", value: null },
                  { label: "Count", value: 3 },
                ],
                notes: [said, "short", "short"],
                notice: { text: said },
              },
              { heading: "Plain" },
            ],
          },
        ],
        "p",
        [],
      ),
    ).toEqual([
      `p › "${long}": heading is ${long.length} characters; put the detail in meta or facts`,
      `p › "${long}": "${said.toLowerCase()}" is said twice`,
    ]);
  });

  it("turns idle info alerts into notes", () => {
    const text = "x".repeat(60);
    expect(designProblems([{ type: "alert", tone: "info", text }], "p", [])).toEqual([
      `p: an info alert with nothing to do ("${text.slice(0, 50)}…"); make it a note()`,
    ]);
    expect(
      designProblems(
        [
          { type: "alert", tone: "info", text, actions: [{ label: "Open" }] },
          { type: "alert", tone: "warning", text },
        ],
        "p",
        [],
      ),
    ).toEqual([]);
  });
});
