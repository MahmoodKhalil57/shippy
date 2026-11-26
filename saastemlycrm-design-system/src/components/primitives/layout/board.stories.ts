import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import { readFits, type UiBoard } from "./board.ts";
import { lanesFor } from "../../../lib/base/board.ts";
import { tileH } from "../../../lib/base/tiles.ts";
import { cssTime } from "../../../lib/base/css-time.ts";
import "./box.ts";
import "./flex.ts";
import type { BoardItem } from "./board.ts";

const tile = (heading: string, body: string) =>
  html`<ui-box surface="base-200" rounded="box" padding="3" height="full">
    <ui-flex direction="col" gap="1">
      <strong>${heading}</strong>
      <span>${body}</span>
    </ui-flex>
  </ui-box>`;

const lines = (heading: string, count: number) =>
  html`<ui-box surface="base-200" rounded="box" padding="3">
    <ui-flex direction="col" gap="1">
      <strong>${heading}</strong>
      ${Array.from({ length: count }, (_, i) => html`<span>Order ${10480 + i} is ready to ship.</span>`)}
    </ui-flex>
  </ui-box>`;

const sizes: BoardItem[] = [
  { key: "small", size: "s", rows: 2, content: tile("Small", "Six tiles wide.") },
  { key: "medium", size: "m", rows: 2, content: tile("Medium", "Twelve tiles wide.") },
  { key: "large", size: "l", rows: 3, content: tile("Large", "Eighteen tiles wide.") },
  { key: "full", size: "full", rows: 2, content: tile("Full", "Spans every lane.") },
];

const fitted: BoardItem[] = [
  { key: "two", size: "s", rows: "fit", content: lines("Two orders", 2) },
  { key: "five", size: "s", rows: "fit", content: lines("Five orders", 5) },
  { key: "eight", size: "s", rows: "fit", content: lines("Eight orders", 8) },
];

const packed: BoardItem[] = [
  { key: "revenue", size: "m", rows: 3, content: tile("Revenue", "This month so far.") },
  { key: "orders", size: "s", rows: 2, content: tile("Orders", "Placed today.") },
  { key: "returns", size: "s", rows: 2, content: tile("Returns", "Awaiting inspection.") },
  { key: "stock", size: "s", rows: 4, content: tile("Low stock", "Items below their reorder level.") },
  { key: "notes", size: "s", rows: 2, content: tile("Notes", "Shared with the team.") },
  { key: "add", size: "s", rows: 2, drop: true, content: "Add a tile" },
];

const generated = (count: number, size: BoardItem["size"], rows: number): BoardItem[] =>
  Array.from({ length: count }, (_, i) => ({
    key: `tile-${i + 1}`,
    size,
    rows,
    content: tile(`Tile ${i + 1}`, "A generated tile."),
  }));

const tileOf = async (find: Promise<HTMLElement>) => (await find).closest<HTMLElement>("[data-board-tile]")!;

const meta = preview.type<{ args: { count: number; size: BoardItem["size"]; rows: number } }>().meta({
  title: "Primitives/Layout/Board",
  component: "ui-board",
  args: {
    count: 4,
    size: "s",
    rows: 2,
    fit: false,
  },
  argTypes: {
    count: { control: { type: "number", min: 1, max: 12, step: 1 }, description: "How many tiles to place." },
    size: { control: "inline-radio", options: ["s", "m", "l", "full"], description: "Each tile's size." },
    rows: { control: { type: "number", min: 1, max: 6, step: 1 }, description: "Each tile's height in rows." },
    fit: { control: "boolean" },
    items: { table: { disable: true } },
  },
  render: (args) => html`<ui-board ?fit=${args.fit} .items=${generated(args.count, args.size, args.rows)}></ui-board>`,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Count, size and rows generate the tiles; fit stretches the lanes." } },
    canvas: "column",
  },
  play: async ({ canvas }) => {
    for (const i of [1, 2, 3, 4]) {
      const el = await tileOf(canvas.findByText(`Tile ${i}`));
      await expect(el).toHaveAttribute("data-key", `tile-${i}`);
      await expect(el).toHaveAttribute("data-size", "s");
      await expect(el.style.getPropertyValue("--rows")).toBe("8");
    }
    await expect(canvas.queryByText("Tile 5")).not.toBeInTheDocument();
  },
});

export const FullWidthTiles = meta.story({
  name: "Full width tiles",
  args: { size: "full", count: 2, rows: 1 },
  parameters: { canvas: "column" },
  play: async ({ canvas }) => {
    const one = await tileOf(canvas.findByText("Tile 1"));
    const two = await tileOf(canvas.findByText("Tile 2"));
    await expect(one).toHaveAttribute("data-size", "full");
    await expect(two.getBoundingClientRect().top).toBeGreaterThanOrEqual(one.getBoundingClientRect().bottom - 1);
  },
});

export const FittedLanes = meta.story({
  name: "Fitted lanes",
  args: { fit: true, size: "m" },
  parameters: { canvas: "column" },
  play: async ({ canvas, canvasElement }) => {
    await canvas.findByText("Tile 1");
    const lanes = canvasElement.querySelector<HTMLElement>("[data-board-lanes]")!;
    await waitFor(() => expect(lanes.style.getPropertyValue("--tile-w")).toMatch(/px$/));
    const board = canvasElement.querySelector<UiBoard>("ui-board")!;
    const placed = board.placed().get("tile-2")!;
    const rect = board.rectOf(placed)!;
    const shown = (await tileOf(canvas.findByText("Tile 2"))).getBoundingClientRect();
    await near(rect.left, shown.left);
    await near(rect.width, shown.width);
    await expect(Math.floor(board.cellAt({ x: rect.left + 2, y: rect.top + 2 })!.lane)).toBe(placed.lane);
  },
});

export const TileSizes = meta.story({
  name: "Tile sizes",
  parameters: {
    docs: {
      description: { story: "Sizes are spans of tile lanes; on a narrow board a tile shrinks to the lanes there are." },
    },
    canvas: "column",
  },
  render: () => html`<ui-board .items=${sizes}></ui-board>`,
});

export const Packing = meta.story({
  name: "Packing",
  parameters: {
    docs: {
      description: {
        story:
          "Tiles are packed to leave as few gaps as possible and scaled to the lanes the board has; a drop tile marks where a new one would go.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-board .items=${packed}></ui-board>`,
});

export const RowsThatFitTheirContent = meta.story({
  name: "Rows that fit their content",
  parameters: {
    docs: { description: { story: "A fit tile measures its content and takes as many rows as that needs." } },
    canvas: "column",
  },
  render: () => html`<ui-board .items=${fitted}></ui-board>`,
});

export const LanesThatFillTheWidth = meta.story({
  name: "Lanes that fill the width",
  parameters: {
    docs: {
      description: {
        story: "With fit, lanes stretch so the board fills its width exactly instead of leaving a remainder.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-board fit .items=${sizes}></ui-board>`,
});

const FIT_KEY = "ui-board-fit";

const boardIn = (canvasElement: HTMLElement, selector = "ui-board") => canvasElement.querySelector<UiBoard>(selector)!;

const tileEl = (board: UiBoard, key: string) =>
  board.querySelector<HTMLElement>(`[data-board-tile][data-key="${key}"]`)!;

const scale = () => parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;

const near = (a: number, b: number) => expect(Math.abs(a - b)).toBeLessThan(1.5);

const withRoot = async (property: string, value: string, run: () => Promise<void>) => {
  const root = document.documentElement;
  const was = root.style.getPropertyValue(property);
  root.style.setProperty(property, value);
  try {
    await run();
  } finally {
    if (was) root.style.setProperty(property, was);
    else root.style.removeProperty(property);
  }
};

const recordAnimations = (el: HTMLElement) => {
  const made: { keyframes: Keyframe[]; options: KeyframeAnimationOptions }[] = [];
  Object.defineProperty(el, "animate", {
    configurable: true,
    value: (keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
      made.push({ keyframes, options });
      return HTMLElement.prototype.animate.call(el, keyframes, options);
    },
  });
  return { made, stop: () => delete (el as { animate?: unknown }).animate };
};

const fixedWidth = (px: number, content: unknown) =>
  html`<div style=${`inline-size: ${px}px`}><div>${content}</div></div>`;

export const RememberedFitRows = meta.story({
  name: "Remembered fit rows",
  parameters: {
    docs: {
      description: {
        story:
          "A fit tile with a remember key stores the rows it measured, and the next board with that key starts at that height.",
      },
    },
    canvas: "column",
  },
  render: () =>
    html`<ui-board
      .items=${
        [
          { key: "two", size: "s", rows: "fit", remember: "story-two", content: lines("Two orders", 2) },
          {
            key: "five",
            size: "s",
            rows: "fit",
            remember: "story-five",
            flush: true,
            content: lines("Five orders", 5),
          },
          { key: "plain", size: "s", rows: "fit", content: lines("Plain", 3) },
        ] satisfies BoardItem[]
      }
    ></ui-board>`,
  play: async ({ canvas, canvasElement }) => {
    const saved = localStorage.getItem(FIT_KEY);
    try {
      localStorage.setItem(FIT_KEY, JSON.stringify([["a", 3], ["b", 0], ["c", 1.5], [4, 2], "x", ["d", 7]]));
      await expect(readFits()).toEqual([
        ["a", 3],
        ["d", 7],
      ]);
      localStorage.setItem(FIT_KEY, JSON.stringify({ a: 3 }));
      await expect(readFits()).toEqual([]);
      localStorage.setItem(FIT_KEY, "{");
      await expect(readFits()).toEqual([]);
      localStorage.removeItem(FIT_KEY);
      await expect(readFits()).toEqual([]);
      const board = boardIn(canvasElement);
      await canvas.findByText("Five orders");
      const five = tileEl(board, "five");
      await expect(five.querySelector("[data-fit]")).toHaveAttribute("data-flush");
      await expect(tileEl(board, "two").querySelector("[data-fit]")).not.toHaveAttribute("data-flush");
      await waitFor(() => expect(new Map(readFits()).get("story-five")).toBeGreaterThan(1));
      const remembered = new Map(readFits());
      await expect(remembered.get("story-two")).toBeGreaterThanOrEqual(1);
      await expect(five.style.getPropertyValue("--rows")).toBe(String(4 * remembered.get("story-five")!));
      await expect(remembered.has("plain")).toBe(false);
      const again = document.createElement("ui-board");
      again.items = [{ key: "again", size: "s", rows: "fit", remember: "story-five", content: "Short" }];
      canvasElement.append(again);
      await expect(await again.updateComplete).toBe(true);
      await expect(tileEl(again, "again").style.getPropertyValue("--rows")).toBe(
        String(4 * remembered.get("story-five")!),
      );
      await waitFor(() => expect(new Map(readFits()).get("story-five")).toBe(1));
      again.remove();
    } finally {
      if (saved === null) localStorage.removeItem(FIT_KEY);
      else localStorage.setItem(FIT_KEY, saved);
    }
  },
});

export const ExpectedWidth = meta.story({
  name: "Expected width",
  parameters: {
    docs: {
      description: {
        story:
          "Told a panel will take room from it, a board lays out for the width it will have and returns when the spring settles.",
      },
    },
    canvas: "column",
  },
  render: () =>
    fixedWidth(800, html`<div style="display: contents"><ui-board .items=${generated(3, "s", 2)}></ui-board></div>`),
  play: async ({ canvas, canvasElement }) => {
    const board = boardIn(canvasElement);
    await canvas.findByText("Tile 3");
    const lanes = lanesFor(800, scale());
    await waitFor(() => expect(board.lanes).toBe(lanes));
    let settle!: () => void;
    const settled = new Promise<void>((r) => (settle = r));
    board.expectWidth(0, settled);
    board.expectWidth(1, settled);
    await expect(board.lanes).toBe(lanes);
    const timing = { until: performance.now() + 20, duration: 321, easing: "linear" };
    const two = recordAnimations(tileEl(board, "tile-2"));
    try {
      board.expectWidth(400, settled, timing);
      await expect(board.lanes).toBe(lanesFor(400, scale()));
      await waitFor(() => expect(two.made.some((m) => m.options.duration === 321)).toBe(true));
      const sprung = two.made.find((m) => m.options.duration === 321)!;
      await expect(sprung.options.easing).toBe("linear");
      await expect(Number(sprung.options.delay)).toBeGreaterThanOrEqual(0);
    } finally {
      two.stop();
    }
    let later!: () => void;
    board.expectWidth(300, new Promise<void>((r) => (later = r)), timing);
    await expect(board.lanes).toBe(lanesFor(500, scale()));
    settle();
    await settled;
    await expect(board.lanes).toBe(lanesFor(500, scale()));
    later();
    await waitFor(() => expect(board.lanes).toBe(lanes));
    const parent = board.parentElement!;
    board.remove();
    board.expectWidth(400, new Promise(() => undefined));
    await expect(board.lanes).toBe(lanesFor(400, scale()));
    parent.append(board);
  },
});

export const LanesWhileHidden = meta.story({
  name: "Lanes while hidden",
  parameters: {
    docs: {
      description: {
        story: "A hidden or zero-width board waits for room before it lays out, then picks its lanes from the width.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <div hidden data-hidden><ui-board data-later .items=${generated(2, "s", 2)}></ui-board></div>
    <div style="inline-size: 0"><ui-board data-narrow .items=${generated(1, "s", 2)}></ui-board></div>
  `,
  play: async ({ canvasElement }) => {
    const later = boardIn(canvasElement, "[data-later]");
    const narrow = boardIn(canvasElement, "[data-narrow]");
    await later.updateComplete;
    await narrow.updateComplete;
    await expect(later.lanes).toBe(0);
    await expect(narrow.lanes).toBe(0);
    await expect(tileEl(narrow, "tile-1").style.getPropertyValue("--lane")).toBe("");
    canvasElement.querySelector<HTMLElement>("[data-hidden]")!.hidden = false;
    await waitFor(() => expect(later.lanes).toBeGreaterThan(0));
    await waitFor(() => expect(tileEl(later, "tile-1").style.getPropertyValue("--lane")).toBe("1"));
    const width = later.querySelector<HTMLElement>("[data-board-lanes]")!.getBoundingClientRect().width;
    await withRoot("font-size", "0px", async () => {
      later.parentElement!.style.inlineSize = `${Math.round(width / 2)}px`;
      await waitFor(() => expect(later.lanes).toBe(lanesFor(Math.round(width / 2), 1)));
    });
  },
});

export const HoldAndDrop = meta.story({
  name: "Hold and drop",
  parameters: {
    docs: {
      description: {
        story:
          "A held tile lifts out of the board and follows the pointer while a mark shows where it will land; dropping slides it home.",
      },
    },
    canvas: "column",
  },
  render: () => fixedWidth(900, html`<ui-board .items=${generated(4, "s", 2)}></ui-board>`),
  play: async ({ canvas, canvasElement }) => {
    const loose = document.createElement("ui-board");
    await expect(loose.cellAt({ x: 0, y: 0 })).toBeNull();
    await expect(loose.rectOf({ lane: 0, span: 1, row: 0, rows: 1 })).toBeNull();
    await expect(() => loose.hold("tile-1", "move", { x: 0, y: 0 })).not.toThrow();
    const board = boardIn(canvasElement);
    await canvas.findByText("Tile 4");
    await waitFor(() => expect(board.lanes).toBe(lanesFor(900, scale())));
    const one = tileEl(board, "tile-1");
    const p = board.placed().get("tile-1")!;
    const r = board.rectOf(p)!;
    const t = one.getBoundingClientRect();
    await near(r.left, t.left);
    await near(r.top, t.top);
    await near(r.width, t.width);
    const cell = board.cellAt({ x: r.left + 5, y: r.top + 5 })!;
    await expect(cell.lanes).toBe(board.lanes);
    await expect(Math.floor(cell.lane)).toBe(p.lane);
    await expect(Math.floor(cell.row)).toBe(p.row);
    await expect(cell.inside).toBe(true);
    await expect(board.cellAt({ x: r.left - 50, y: r.top })!.inside).toBe(false);
    board.carry(true);
    board.follow({ x: 1, y: 1 });
    board.drop();
    board.hold("missing", "move", { x: 0, y: 0 });
    await expect(board.querySelector("[data-held], [data-out]")).toBeNull();
    board.hold("tile-1", "move", { x: r.left + 10, y: r.top + 10 });
    await expect(one).toHaveAttribute("data-held");
    await expect(one).toHaveAttribute("popover", "manual");
    await expect(one.matches(":popover-open")).toBe(true);
    await expect(one.style.getPropertyValue("--lift-x")).toBe(`${r.left}px`);
    await waitFor(() => expect(board.querySelector("[data-board-drop]")).not.toBeNull());
    board.follow({ x: r.left + 110, y: r.top + 60 });
    await expect(one.style.getPropertyValue("--lift-x")).toBe(`${r.left + 100}px`);
    await expect(one.style.getPropertyValue("--lift-y")).toBe(`${r.top + 50}px`);
    board.carry(true);
    await expect(one).toHaveAttribute("data-out");
    board.carry(false);
    await expect(one).not.toHaveAttribute("data-out");
    board.follow({ x: r.left + 110, y: r.top + 60 }, { width: 300, height: 200 });
    await expect(one.style.getPropertyValue("--held-w")).toBe("300px");
    const mark = board.querySelector<HTMLElement>("[data-board-drop]")!;
    const marked = recordAnimations(mark);
    const tall = { ...generated(1, "s", 4)[0]!, key: "tile-1" };
    board.items = [tall, ...generated(4, "s", 2).slice(1)];
    await waitFor(() => expect(mark.style.getPropertyValue("--rows")).toBe("16"));
    await waitFor(() => expect(marked.made.some((m) => m.keyframes[0]!.height !== m.keyframes[1]!.height)).toBe(true));
    const wide = { key: "wide", size: "full" as const, rows: 2, content: tile("Wide", "Above.") };
    board.items = [wide, tall, ...generated(4, "s", 2).slice(1)];
    await waitFor(() => expect(mark.style.getPropertyValue("--row")).not.toBe("1"));
    await waitFor(() => expect(marked.made.some((m) => "translate" in m.keyframes[0]!)).toBe(true));
    marked.stop();
    await expect(one).toHaveAttribute("data-held");
    await withRoot("--ease-spatial", "initial", async () => {
      board.drop();
      await waitFor(() => expect(one).not.toHaveAttribute("data-held"));
      await expect(one).not.toHaveAttribute("popover");
      await expect(one.style.getPropertyValue("--lift-x")).toBe("");
      const dropped = one.getAnimations().map((a) => a.effect as KeyframeEffect);
      await expect(dropped.some((k) => "translate" in k.getKeyframes()[0]!)).toBe(true);
      await expect(dropped.some((k) => k.getKeyframes()[0]!.width === "300px")).toBe(true);
      await expect(dropped.every((k) => k.getTiming().easing === "ease")).toBe(true);
    });
    await waitFor(() => expect(board.querySelector("[data-board-drop]")).toBeNull());
    const two = tileEl(board, "tile-2");
    const r2 = board.rectOf(board.placed().get("tile-2")!)!;
    board.hold("tile-2", "resize", { x: r2.right, y: r2.bottom });
    board.follow({ x: r2.right, y: r2.bottom + 100 }, { width: r2.width, height: r2.height + 100 });
    await expect(two.style.getPropertyValue("--lift-x")).toBe(`${r2.left}px`);
    await withRoot("--ease-spatial-fast", "initial", async () => {
      board.items = [
        wide,
        tall,
        ...generated(4, "s", 2).slice(1),
        ...generated(1, "m", 2).map((t) => ({ ...t, key: "extra" })),
      ];
      await waitFor(() => expect(board.querySelector('[data-key="extra"]')).not.toBeNull());
    });
    board.drop();
    board.items = [tall, wide, ...generated(4, "s", 2).slice(1)];
    await waitFor(() => expect(two).not.toHaveAttribute("data-held"));
    await waitFor(() =>
      expect(
        two
          .getAnimations()
          .some((a) => (a.effect as KeyframeEffect).getKeyframes()[0]!.height === `${r2.height + 100}px`),
      ).toBe(true),
    );
    const three = tileEl(board, "tile-3");
    await waitFor(() => expect(three.getAnimations()).toHaveLength(0), { timeout: 3000 });
    const r3 = three.getBoundingClientRect();
    board.hold("tile-3", "resize", { x: r3.right, y: r3.bottom });
    const heldW = parseFloat(three.style.getPropertyValue("--held-w"));
    const heldH = parseFloat(three.style.getPropertyValue("--held-h"));
    board.follow({ x: r3.right, y: r3.bottom + 60 }, { width: heldW, height: heldH + 60 });
    board.drop();
    await waitFor(() => expect(three).not.toHaveAttribute("data-held"));
    const grown = three.getAnimations().map((a) => (a.effect as KeyframeEffect).getKeyframes());
    await expect(grown.some((k) => k[0]!.height === `${heldH + 60}px` && k[0]!.width === `${heldW}px`)).toBe(true);
  },
});

export const HoldToResize = meta.story({
  name: "Hold to resize",
  parameters: { canvas: "column" },
  render: () =>
    html`<div dir="rtl">${fixedWidth(900, html`<ui-board .items=${generated(3, "s", 2)}></ui-board>`)}</div>`,
  play: async ({ canvas, canvasElement }) => {
    const board = boardIn(canvasElement);
    await canvas.findByText("Tile 3");
    await waitFor(() => expect(board.lanes).toBe(lanesFor(900, scale())));
    const two = tileEl(board, "tile-2");
    const r = two.getBoundingClientRect();
    const p = board.placed().get("tile-2")!;
    await near(board.rectOf(p)!.right, r.right);
    const cell = board.cellAt({ x: r.right - 5, y: r.top + 5 })!;
    await expect(Math.floor(cell.lane)).toBe(p.lane);
    board.hold("tile-2", "resize", { x: r.left, y: r.bottom });
    board.follow({ x: r.left - 200, y: r.bottom + 100 }, { width: r.width + 200, height: r.height + 100 });
    await expect(two.style.getPropertyValue("--lift-x")).toBe(`${r.right - (r.width + 200)}px`);
    await expect(two.style.getPropertyValue("--lift-y")).toBe(`${r.top}px`);
    await withRoot("--duration-spatial", "0ms", async () => {
      board.drop();
      await waitFor(() => expect(two).not.toHaveAttribute("data-held"));
      await expect(two.getAnimations()).toHaveLength(0);
    });
    board.hold("tile-3", "move", { x: r.left, y: r.top });
    board.items = generated(2, "s", 2);
    await waitFor(() => expect(board.querySelector('[data-key="tile-3"]')).toBeNull());
    board.follow({ x: 5, y: 5 });
    board.drop();
    await waitFor(() => expect(board.querySelector("[data-board-drop]")).toBeNull());
    board.hold("tile-1", "move", { x: r.left, y: r.top });
    const one = tileEl(board, "tile-1");
    board.items = generated(1, "s", 2);
    board.drop();
    board.items = [];
    await waitFor(() => expect(one.isConnected).toBe(false));
    await expect(board.placed().size).toBe(0);
  },
});

export const TilesSlide = meta.story({
  name: "Tiles slide",
  parameters: {
    docs: {
      description: {
        story: "When tiles change order or size they slide and grow to their new places instead of jumping.",
      },
    },
    canvas: "column",
  },
  render: () =>
    fixedWidth(
      900,
      html`<ui-board
        .items=${
          [
            ...generated(3, "s", 2),
            { key: "fit", size: "s", rows: "fit", content: lines("Fit", 2) },
            { key: "words", size: "s", rows: 2, content: "Plain words" },
            { key: "gone", size: "s", rows: 2, away: true, content: "Away" },
          ] satisfies BoardItem[]
        }
      ></ui-board>`,
    ),
  play: async ({ canvas, canvasElement }) => {
    const board = boardIn(canvasElement);
    await canvas.findByText("Tile 3");
    await waitFor(() => expect(board.lanes).toBe(lanesFor(900, scale())));
    const gone = tileEl(board, "gone");
    await expect(gone).toHaveAttribute("data-empty");
    await expect(gone.style.getPropertyValue("--lane")).toBe("");
    await expect(board.placed().has("gone")).toBe(false);
    const one = tileEl(board, "tile-1");
    const three = tileEl(board, "tile-3");
    const content = three.querySelector<HTMLElement>("ui-box > div")!;
    const duration = cssTime(getComputedStyle(document.documentElement).getPropertyValue("--duration-spatial"));
    const pins: string[] = [];
    const pinWatch = new MutationObserver(() => pins.push(content.style.getPropertyValue("flex-shrink")));
    pinWatch.observe(content, { attributes: true, attributeFilter: ["style"] });
    const stopOne = recordAnimations(one);
    const stopThree = recordAnimations(three);
    const words = tileEl(board, "words");
    const stopWords = recordAnimations(words);
    try {
      board.items = [
        { ...generated(3, "s", 2)[2]!, rows: 4 },
        ...generated(2, "s", 2),
        { key: "words", size: "s", rows: 3, content: "Plain words" },
        { key: "gone", size: "s", rows: 2, away: true, content: "Away" },
      ];
      await waitFor(() => expect(stopWords.made.some((m) => "height" in m.keyframes[0]!)).toBe(true));
      await expect(words.style.getPropertyValue("--rows")).toBe("12");
      await waitFor(() => expect(stopOne.made.some((m) => "translate" in m.keyframes[0]!)).toBe(true));
      const slide = stopOne.made.find((m) => "translate" in m.keyframes[0]!)!;
      await expect(String(slide.keyframes[0]!.translate)).toMatch(/^-?\d+(\.\d+)?px /);
      await expect(slide.options.duration).toBe(duration);
      await waitFor(() => expect(stopThree.made.some((m) => "width" in m.keyframes[0]!)).toBe(true));
      await expect(stopThree.made.find((m) => "width" in m.keyframes[0]!)!.keyframes[1]!.height).toBe(
        `${4 * tileH(scale())}px`,
      );
      await waitFor(() => expect(pins).toContain("0"));
      board.items = [{ ...generated(3, "s", 2)[2]!, rows: 6 }, ...generated(2, "s", 2)];
      await waitFor(() => expect(three.style.getPropertyValue("--rows")).toBe("24"));
      await waitFor(() => expect(board.querySelector('[data-key="fit"]')).toBeNull());
      const growing = () =>
        three.getAnimations().filter((a) => "width" in (a.effect as KeyframeEffect).getKeyframes()[0]!);
      for (const a of growing()) a.finish();
      await waitFor(() => expect(content.style.getPropertyValue("flex-shrink")).toBe(""));
      await withRoot("--duration-spatial", "0ms", async () => {
        const before = stopOne.made.length;
        board.items = generated(3, "s", 2);
        await waitFor(() => expect(three.style.getPropertyValue("--rows")).toBe("8"));
        await expect(stopOne.made).toHaveLength(before);
      });
    } finally {
      pinWatch.disconnect();
      stopOne.stop();
      stopThree.stop();
      stopWords.stop();
    }
    board.items = generated(2, "s", 2);
    board.remove();
    await board.updateComplete;
    await expect(board.isConnected).toBe(false);
    canvasElement.querySelector("div > div")!.append(board);
    board.items = generated(3, "m", 2);
    await waitFor(() => expect(tileEl(board, "tile-3").style.getPropertyValue("--lane")).not.toBe(""));
  },
});

export const OpenedRows = meta.story({
  name: "Opened rows",
  parameters: {
    docs: { description: { story: "A tile can ask for more rows while it is opened and give them back after." } },
    canvas: "column",
  },
  play: async ({ canvas }) => {
    const one = await tileOf(canvas.findByText("Tile 1"));
    canvas.getByText("Tile 1").dispatchEvent(new CustomEvent("ui-tile-rows", { detail: { rows: 6 }, bubbles: true }));
    await waitFor(() => expect(one.style.getPropertyValue("--rows")).toBe("24"));
    canvas
      .getByText("Tile 1")
      .dispatchEvent(new CustomEvent("ui-tile-rows", { detail: { rows: null }, bubbles: true }));
    await waitFor(() => expect(one.style.getPropertyValue("--rows")).toBe("8"));
  },
});

export const ArrangedTiles = meta.story({
  name: "Arranged tiles",
  parameters: {
    docs: {
      description: {
        story:
          "Tiles placed by hand keep their lanes, scaled from the board they were arranged on; one arranged on a far wider board flows instead.",
      },
    },
    canvas: "column",
  },
  render: () =>
    fixedWidth(
      800,
      html`<ui-board
        .items=${
          [
            {
              key: "here",
              size: "s",
              rows: 2,
              at: 2,
              atRow: 0,
              arrangedAt: lanesFor(800, scale()),
              content: tile("Here", "Same lanes."),
            },
            {
              key: "scaled",
              size: "s",
              rows: 2,
              span: 6,
              at: 10,
              atRow: 3,
              arrangedAt: 2 * lanesFor(800, scale()),
              content: tile("Scaled", "Half the lanes."),
            },
            {
              key: "wide",
              size: "s",
              rows: 2,
              span: 4,
              at: 20,
              arrangedAt: 4 * lanesFor(800, scale()),
              content: tile("Wide", "Flows."),
            },
            { key: "loose", size: "s", rows: "fit", content: lines("Loose", 2) },
            { key: "pinned", size: "s", rows: 2, at: 0, content: tile("Pinned", "No row.") },
            { key: "kept", size: "s", rows: "fit", remember: "story-kept", at: 0, atRow: 9, content: lines("Kept", 1) },
            {
              key: "spanless",
              size: "s",
              rows: 2,
              at: 8,
              atRow: 12,
              arrangedAt: 2 * lanesFor(800, scale()),
              content: tile("Spanless", "Scaled."),
            },
          ] satisfies BoardItem[]
        }
      ></ui-board>`,
    ),
  play: async ({ canvas, canvasElement }) => {
    const board = boardIn(canvasElement);
    await canvas.findByText("Here");
    await waitFor(() => expect(board.lanes).toBe(lanesFor(800, scale())));
    await waitFor(() => expect(board.placed().get("here")?.lane).toBe(2));
    await expect(board.placed().get("here")!.row).toBe(0);
    await expect(board.placed().get("scaled")).toMatchObject({ lane: 5, span: 3 });
    await expect(board.placed().get("wide")!.span).toBe(4);
    await expect(board.placed().get("pinned")!.lane).toBe(0);
    await expect(tileEl(board, "here").style.getPropertyValue("--lane")).toBe("9");
    await expect(board.placed().get("spanless")!.lane).toBe(4);
    await expect(board.placed().get("kept")!.lane).toBe(0);
    canvas.getByText("Here").dispatchEvent(new CustomEvent("ui-tile-rows", { detail: { rows: 5 }, bubbles: true }));
    await waitFor(() => expect(tileEl(board, "here").style.getPropertyValue("--rows")).toBe("20"));
  },
});

export const SpanLimits = meta.story({
  name: "Span limits",
  parameters: {
    docs: {
      description: { story: "A tile's span stretches with the lanes but never past its own or its bounds' limit." },
    },
    canvas: "column",
  },
  render: () =>
    fixedWidth(
      1000,
      html`<ui-board
        .items=${
          [
            { key: "capped", size: "l", rows: 2, maxSpan: 4, content: tile("Capped", "Four lanes at most.") },
            {
              key: "bounded",
              size: "l",
              rows: "fit",
              bounds: { minSpan: 1, maxSpan: 5, minRows: 1, maxRows: 4 },
              content: lines("Bounded", 2),
            },
            { key: "fixed", size: "s", rows: 2, fixed: true, maxSpan: 2, content: tile("Fixed", "Keeps its span.") },
            { key: "full", size: "full", rows: 1, maxSpan: 2, content: tile("Full", "Every lane.") },
            {
              key: "rowed",
              size: "m",
              rows: 2,
              bounds: { minSpan: 1, maxSpan: 3, minRows: 1, maxRows: 4 },
              content: tile("Rowed", "Fixed rows."),
            },
          ] satisfies BoardItem[]
        }
      ></ui-board>`,
    ),
  play: async ({ canvas, canvasElement }) => {
    const board = boardIn(canvasElement);
    await canvas.findByText("Capped");
    await waitFor(() => expect(board.lanes).toBe(lanesFor(1000, scale())));
    await waitFor(() => expect(board.placed().get("capped")?.span).toBe(4));
    await expect(board.placed().get("bounded")!.span).toBeLessThanOrEqual(5);
    await expect(board.placed().get("fixed")!.span).toBeGreaterThan(2);
    await expect(board.placed().get("full")!.span).toBe(board.lanes);
    await expect(board.placed().get("rowed")!.span).toBeLessThanOrEqual(3);
  },
});
