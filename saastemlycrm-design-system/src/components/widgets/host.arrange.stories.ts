import preview from "#.storybook/preview";
import { html } from "lit";
import { expect } from "storybook/test";
import { m } from "../../lib/i18n/index.ts";
import { frames } from "../../lib/dashboard/tiling.ts";
import { tileH, tileW } from "../../lib/base/tiles.ts";
import { pageOf, WIDGET_KINDS } from "../../../.storybook/fixtures/widgets.ts";
import {
  arrangeOf,
  boardOf,
  buttonOf,
  handleOf,
  hostBench,
  keysOf,
  note,
  settle,
  tileOf,
  type El,
} from "../../../.storybook/fit/widgets.ts";
import type { AppWidgets, TileArrange } from "./host.ts";
import "./host.ts";
import { visit } from "../../../.storybook/address.ts";

const bench = hostBench();
const board = () => bench.boards();

const meta = preview.meta({
  component: "app-widgets",
  decorators: [bench.decorator],
  beforeEach: bench.setup,
  parameters: { layout: "fullscreen" },
});

const abc = pageOf(note("A"), note("B"), note("C"));
const step = (root: Element, key: string, to: string) =>
  handleOf(root, key).dispatchEvent(new CustomEvent("ui-step", { detail: { to }, bubbles: true }));

export const KeyboardSteps = meta.story({
  name: "Step, hide, show and reset tiles from the keyboard",
  render: () => boardOf(abc),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    step(host, "0", "earlier");
    step(host, "2", "later");
    await expect(board().test).toBeUndefined();
    step(host, "1", "earlier");
    await settle(host);
    await expect(keysOf(host)).toEqual(["1", "0", "2", "arranged"]);
    step(host, "2", "start");
    await settle(host);
    await expect(board().test!.order).toEqual(["2", "1", "0"]);
    step(host, "2", "later");
    await settle(host);
    await expect(board().test!.order).toEqual(["1", "2", "0"]);
    handleOf(host, "0").dispatchEvent(new CustomEvent("ui-hide", { bubbles: true }));
    await settle(host);
    await expect(keysOf(host)).toEqual(["1", "2", "arranged"]);
    buttonOf(host, m.widget_host_show_hidden({ count: 1 }))!.click();
    await settle(host);
    await expect(board().test!.hidden).toEqual([]);
    buttonOf(host, m.widget_host_reset_layout())!.click();
    await settle(host);
    await expect(board().test).toBeUndefined();
    await expect(keysOf(host)).toEqual(["0", "1", "2"]);
  },
});

export const PinnedSwap = meta.story({
  name: "Stepping swaps pinned spots",
  beforeEach: () => {
    bench.dashboard.stores.preferences.set({
      boards: {
        test: { order: ["0", "1", "2"], pins: { "0": { lane: 0, row: 0 }, "1": { lane: 6, row: 0 }, "2": 12 } },
      },
    });
  },
  render: () => boardOf(abc),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    step(host, "1", "earlier");
    await settle(host);
    await expect(board().test!.pins).toEqual({ "0": { lane: 6, row: 0 }, "1": { lane: 0, row: 0 }, "2": 12 });
    step(host, "2", "earlier");
    await settle(host);
    await expect(board().test!.pins).toEqual({ "0": 12, "1": { lane: 0, row: 0 }, "2": { lane: 6, row: 0 } });
    const first = keysOf(host)[0]!;
    arrangeOf(host, first).arrange.step("start");
    await settle(host);
    await expect(board().test!.order![0]).toBe(first);
  },
});

export const HeaderStays = meta.story({
  name: "A header stays in place while tiles move",
  render: () => boardOf({ header: { heading: "Top" }, widgets: [note("A"), note("B")] }),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    await expect(arrangeOf(host, "0").arrange.lands("header")).toBe(false);
    await expect(arrangeOf(host, "0").arrange.lands("0")).toBe(false);
    await expect(arrangeOf(host, "0").arrange.lands("1")).toBe(true);
    await expect(arrangeOf(host, "0").arrange.lands("arranged")).toBe(false);
    step(host, "1", "start");
    await settle(host);
    await expect(board().test!.order).toEqual(["header", "1", "0"]);
  },
});

export const KeyboardResize = meta.story({
  name: "Resize from the keyboard within bounds",
  beforeEach: () => {
    bench.dashboard.stores.preferences.set({ boards: { test: { sizes: { "0": "m", "1": "l" } } } });
  },
  render: () => boardOf(abc),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    await expect(tileOf(host, "0").getBoundingClientRect().width).toBeCloseTo(12 * tileW(), 0);
    handleOf(host, "0").dispatchEvent(
      new CustomEvent("ui-resize-step", { detail: { span: 1, rows: 1 }, bubbles: true }),
    );
    await settle(host);
    await expect(board().test!.widths!["0"]).toBe(13);
    await expect(board().test!.rows!["0"]).toBe(9);
    await expect(board().test!.sizes).toEqual({ "1": "l" });
    const lone = document.createElement("app-arrange") as HTMLElement & { arrange?: TileArrange };
    host.append(lone);
    lone.arrange = arrangeOf(host, "1").arrange;
    const kept = board().test!.widths!["1"];
    await frames(1);
    lone
      .querySelector("ui-tile-arrange")!
      .dispatchEvent(new CustomEvent("ui-resize-step", { detail: { span: 1, rows: 0 } }));
    await expect(board().test!.widths!["1"]).toBe(kept);
    lone.remove();
  },
});

export const CloseGaps = meta.story({
  name: "Close gaps between pinned tiles",
  beforeEach: () => {
    bench.dashboard.stores.preferences.set({
      boards: {
        test: {
          rows: { "1": 16 },
          pins: { "0": { lane: 0, row: 0 }, "1": { lane: 6, row: 0 }, "2": { lane: 0, row: 12 } },
        },
      },
    });
  },
  render: () => boardOf(abc),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    await settle(host);
    buttonOf(host, m.widget_host_compact())!.click();
    await settle(host);
    await expect(board().test!.pins!["2"]).toEqual({ lane: 0, row: 8 });
    await expect(board().test!.lanes).toBe(24);
    await expect(buttonOf(host, m.widget_host_compact())).toBeUndefined();
  },
});

export const EmptyBoard = meta.story({
  name: "Nothing to arrange on an empty board",
  render: () => boardOf(pageOf()),
  play: async ({ canvasElement }) => {
    const { host, el } = await bench.ready(canvasElement);
    await expect(keysOf(host)).toEqual([]);
    el.dropTarget(true);
    el.dropTarget(true);
    await settle(host);
    await expect(keysOf(host)).toEqual(["drop"]);
    await expect(host.textContent).toContain(m.widget_host_keep_here());
    el.dropTarget(false);
    await settle(host);
    await expect(keysOf(host)).toEqual([]);
  },
});

export const PerScreen = meta.story({
  name: "The layout is remembered per screen",
  beforeEach: () => visit("/customers/c%201/tasks/t1"),
  render: () => boardOf(pageOf(note("A"), note("B")), { board: "", params: { id: "c 1" }, docId: "t1" }),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    step(host, "1", "start");
    await settle(host);
    await expect(Object.keys(board())).toEqual(["/customers/:id/tasks/:id"]);
  },
});

export const SavedSizesRefit = meta.story({
  name: "Saved sizes that no longer fit",
  beforeEach: () => {
    bench.dashboard.stores.preferences.set({
      boards: { test: { sizes: { "0": "full" }, rows: { "0": 99 }, lanes: 12, pins: { "0": 3 } } },
    });
  },
  render: () => boardOf(pageOf(WIDGET_KINDS.find((d) => d.name === "stats")!.widget)),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    const r = tileOf(host, "0").getBoundingClientRect();
    await expect(Math.round(r.height / tileH())).toBe(6);
  },
});

export const ArrangeCalls = meta.story({
  name: "What the arrange calls are given",
  beforeEach: () => {
    bench.dashboard.stores.preferences.set({ boards: { test: { pins: { "0": { lane: 0, row: 0 } } } } });
  },
  render: () => boardOf({ header: { heading: "Top" }, widgets: [note("A"), note("B"), note("C")] }),
  play: async ({ canvasElement }) => {
    const { host, el } = await bench.ready(canvasElement);
    const a = arrangeOf(host, "0").arrange;
    type Box = { lane: number; row: number; span: number; rows: number };
    const placed = el.querySelector<El & { placed(): ReadonlyMap<string, Box> }>("ui-board")!.placed();
    a.move("header", "start", placed, 24, 0);
    a.move("1", "start", new Map(), 24, 0);
    a.move("1", "start", new Map([["0", placed.get("0")!]]), 24, 0);
    a.place(3, 3, new Map(), 24);
    await expect(board().test).toEqual({ pins: { "0": { lane: 0, row: 0 } } });
    a.move("1", "end", new Map([...placed].filter(([key]) => key !== "2")), 24, 0);
    a.resize(8, 9, placed);
    a.resize(8, 9, placed);
    a.resize(9, 9);
    await settle(host);
    await expect(Math.round(tileOf(host, "0").getBoundingClientRect().width / tileW())).toBe(9);
    a.commit();
    a.commit();
    await settle(host);
    await expect(board().test!.widths!["0"]).toBe(9);
    await expect(board().test!.order).toBeDefined();
    const b = arrangeOf(host, "1").arrange;
    b.resize(7, 8);
    b.commit();
    await settle(host);
    await expect(board().test!.widths!["1"]).toBe(7);
    b.hide();
    await settle(host);
    b.step("start");
    await expect(board().test!.order!.includes("1")).toBe(true);
  },
});

export const HiddenBoard = meta.story({
  name: "A hidden board waits for lanes",
  render: () => html`<div hidden><app-widgets board="hidden" .page=${pageOf(note("A"))}></app-widgets></div>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector<AppWidgets>("app-widgets")!;
    await el.updateComplete;
    await frames(3);
    const a = el.querySelector<HTMLElement & { arrange: TileArrange }>("app-arrange")!.arrange;
    a.resize(8, 9);
    a.commit();
    await expect(board().hidden).toEqual({ widths: { "0": 8 }, rows: { "0": 9 }, sizes: {} });
  },
});

const loose: TileArrange = {
  key: "x",
  label: "Loose",
  first: true,
  last: true,
  lands: () => true,
  move: () => undefined,
  place: () => undefined,
  resize: () => undefined,
  commit: () => undefined,
  cancel: () => undefined,
  step: () => undefined,
  hide: () => undefined,
};
const event = (type: string, detail: object) => new CustomEvent(type, { detail, bubbles: true });

export const OffTheBoard = meta.story({
  name: "Arranging off the board",
  render: () => html`<app-arrange><span>Inside</span></app-arrange>`,
  play: async ({ canvasElement }) => {
    type Arrange = HTMLElement & { arrange?: TileArrange; updateComplete: Promise<unknown> };
    const bare = canvasElement.querySelector<Arrange>("app-arrange")!;
    await bare.updateComplete;
    await expect(bare.textContent).toContain("Inside");
    bare.arrange = loose;
    await bare.updateComplete;
    const grip = bare.querySelector("ui-tile-arrange")!;
    await expect((grip as unknown as El).resizable).toBe(false);
    grip.dispatchEvent(event("ui-drag", { phase: "start", x: 0, y: 0, dx: 0, dy: 0 }));
    grip.dispatchEvent(event("ui-drag", { phase: "move", x: 0, y: 0, dx: 0, dy: 0 }));
    grip.dispatchEvent(event("ui-resize", { phase: "start", x: 0, y: 0, dx: 0, dy: 0 }));
    grip.dispatchEvent(event("ui-resize-step", { span: 1, rows: 0 }));
    bare.arrange = {
      ...loose,
      bounds: { size: "s", rows: 2, minSize: "s", maxSize: "full", minRows: 1, maxRows: 4 },
    };
    await bare.updateComplete;
    const cell = document.createElement("div");
    cell.dataset.boardTile = "";
    cell.dataset.key = "x";
    bare.parentElement!.append(cell);
    cell.append(bare);
    await bare.updateComplete;
    const again = bare.querySelector("ui-tile-arrange")!;
    again.dispatchEvent(event("ui-resize", { phase: "start", x: 0, y: 0, dx: 0, dy: 0 }));
    again.dispatchEvent(event("ui-resize-step", { span: 1, rows: 0 }));
    again.dispatchEvent(event("ui-drag", { phase: "start", x: 0, y: 0, dx: 0, dy: 0 }));
    await expect(bare.isConnected).toBe(true);
  },
});
