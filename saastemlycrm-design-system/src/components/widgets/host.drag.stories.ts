import preview from "#.storybook/preview";
import { expect } from "storybook/test";
import { m } from "../../lib/i18n/index.ts";
import { frames } from "../../lib/dashboard/tiling.ts";
import { tileH, tileW } from "../../lib/base/tiles.ts";
import { homePage, pageOf, reportsPage } from "../../../.storybook/fixtures/widgets.ts";
import {
  arrangeOf,
  boardOf,
  handleOf,
  hostBench,
  keysOf,
  note,
  settle,
  tileOf,
} from "../../../.storybook/fit/widgets.ts";
import { SETTLE_FRAMES } from "./host.ts";
import type { Widget } from "../../lib/widgets/widget.ts";
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
const centre = (el: Element) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};
const corner = (el: Element) => {
  const r = el.getBoundingClientRect();
  return { x: r.right, y: r.bottom };
};
const drag = (root: Element, key: string, type = "ui-drag") => {
  const at = handleOf(root, key);
  const point = type === "ui-drag" ? centre : corner;
  let from = point(tileOf(root, key));
  const send = (phase: string, x: number, y: number) =>
    at.dispatchEvent(new CustomEvent(type, { detail: { phase, x, y, dx: x - from.x, dy: y - from.y }, bubbles: true }));
  return {
    start: () => send("start", from.x, from.y),
    to: (x: number, y: number) => send("move", x, y),
    end: (x: number, y: number) => send("end", x, y),
    cancel: (x: number, y: number) => send("cancel", x, y),
    reset: () => (from = point(tileOf(root, key))),
  };
};
const send = (root: Element, key: string, phase: string, x: number, y: number, type = "ui-drag", dx = 0) =>
  handleOf(root, key).dispatchEvent(new CustomEvent(type, { detail: { phase, x, y, dx, dy: 0 }, bubbles: true }));
const atReports = () => visit("/reports");

export const MoveNext = meta.story({
  name: "Move a tile next to another",
  render: () => boardOf(abc),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    const d = drag(host, "2");
    d.start();
    d.start();
    const a = tileOf(host, "0").getBoundingClientRect();
    d.to(a.left + 4, a.top + a.height / 2);
    await frames(SETTLE_FRAMES + 2);
    d.to(a.left + 4, a.top + a.height / 2);
    d.end(a.left + 4, a.top + a.height / 2);
    await settle(host);
    await expect(board().test!.order!.indexOf("2")).toBeLessThan(board().test!.order!.indexOf("0"));
    await expect(board().test!.lanes).toBe(24);
  },
});

export const DropInSpace = meta.story({
  name: "Drop a tile into an empty spot",
  render: () => boardOf(abc),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    const d = drag(host, "0");
    d.start();
    const lanes = host.querySelector("[data-board-lanes]")!.getBoundingClientRect();
    const x = lanes.left + 20 * tileW();
    const y = lanes.top + 6 * tileH();
    d.to(x, y);
    d.end(x, y);
    await settle(host);
    await expect(board().test!.pins!["0"]).toMatchObject({ row: expect.any(Number) });
  },
});

export const DropNothing = meta.story({
  name: "Let go far away or cancel",
  render: () => boardOf(abc),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    const d = drag(host, "1");
    d.start();
    d.to(-500, -500);
    d.end(-500, -500);
    await settle(host);
    await expect(board().test).toBeUndefined();
    d.reset();
    d.start();
    const a = tileOf(host, "0").getBoundingClientRect();
    d.to(a.left + 2, a.top + 2);
    d.cancel(a.left + 2, a.top + 2);
    await settle(host);
    await expect(board().test).toBeUndefined();
    handleOf(host, "1").dispatchEvent(
      new CustomEvent("ui-drag", { detail: { phase: "move", x: 0, y: 0, dx: 0, dy: 0 } }),
    );
  },
});

export const AimRightToLeft = meta.story({
  name: "Aim from the far side in a right-to-left board",
  globals: { dir: "rtl" },
  render: () => boardOf(abc),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    const d = drag(host, "0");
    d.start();
    const c = tileOf(host, "2").getBoundingClientRect();
    d.to(c.left + c.width / 2, c.bottom + 30);
    await frames(SETTLE_FRAMES + 2);
    d.to(c.right - 2, c.top + c.height / 2);
    await frames(SETTLE_FRAMES + 2);
    d.end(c.right - 2, c.top + c.height / 2);
    await settle(host);
    await expect(board().test!.order!.indexOf("0")).toBeLessThan(board().test!.order!.indexOf("2"));
  },
});

export const ResizeCorner = meta.story({
  name: "Resize a tile by its corner",
  render: () => boardOf(abc),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    const d = drag(host, "0", "ui-resize");
    d.start();
    const from = tileOf(host, "0").getBoundingClientRect();
    const span = Math.round(from.width / tileW()) + 2;
    const tall = Math.round(from.height / tileH()) + 1;
    d.to(from.right + 2 * tileW(), from.bottom + tileH());
    d.to(from.right + 2 * tileW() + 3, from.bottom + tileH());
    d.end(from.right + 2 * tileW(), from.bottom + tileH());
    await settle(host);
    await expect(board().test!.widths!["0"]).toBe(span);
    await expect(board().test!.rows!["0"]).toBe(tall);
    const before = board().test!.widths!["1"];
    const again = drag(host, "1", "ui-resize");
    again.start();
    again.cancel(0, 0);
    await settle(host);
    await expect(board().test!.widths!["1"]).toBe(before);
  },
});

export const HeaderOnly = meta.story({
  name: "A header alone has nothing to drag",
  render: () => boardOf({ header: { heading: "Top" }, widgets: [] }),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    await expect(host.querySelector("app-arrange")).toBeNull();
  },
});

export const KeepOnOtherBoard = meta.story({
  name: "Keep a widget by dragging it onto another board",
  beforeEach: atReports,
  render: () => boardOf(reportsPage, { board: "" }, 12 * tileW()),
  play: async ({ canvasElement }) => {
    const { host: from } = await bench.ready(canvasElement);
    const { host: to, el: target } = await bench.show(homePage, { board: "home" }, 12 * tileW());
    const d = drag(from, "0");
    d.start();
    const r = to.getBoundingClientRect();
    d.to(r.left + 20, r.top + 20);
    await settle(to);
    await expect(keysOf(to)[0]).toBe("drop");
    d.to(r.left + 20, r.top + 20);
    d.end(r.left + 20, r.top + 20);
    await settle(to);
    await expect(board().home!.added).toEqual([{ view: "reports", key: "0", item: undefined }]);
    await expect(bench.dashboard.notices.at(-1)!.message).toBe(m.widget_host_kept({ name: "Invoiced by month" }));
    await expect(target.pin({ view: "reports", key: "0", item: undefined })).toBe(false);
    const again = drag(from, "0");
    again.start();
    again.to(r.left + 20, r.top + 20);
    again.to(-400, -400);
    again.end(-400, -400);
    await settle(to);
    await expect(keysOf(to)[0]).not.toBe("drop");
  },
});

export const AimFromAbove = meta.story({
  name: "Aim at a tile from above and let go of it",
  render: () => boardOf(pageOf(note("A"), note("B"))),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    const from = centre(tileOf(host, "0"));
    send(host, "0", "start", from.x, from.y);
    const b = tileOf(host, "1").getBoundingClientRect();
    send(host, "0", "move", b.left + b.width / 2, b.top - 40);
    await frames(SETTLE_FRAMES + 2);
    send(host, "0", "move", -900, -900);
    await frames(SETTLE_FRAMES + 2);
    send(host, "0", "end", -900, -900);
    await settle(host);
    await expect(board().test).toBeUndefined();
  },
});

const half = (text: string) => ({ ...note(text), width: 12 }) as Widget;

export const NoFreeSpot = meta.story({
  name: "No free spot to move into",
  render: () => boardOf(pageOf(half("A"), half("B"), { ...note("C"), width: 24 } as Widget)),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    const a = centre(tileOf(host, "0"));
    send(host, "0", "start", a.x, a.y);
    send(host, "0", "move", a.x + 1, a.y + 1);
    send(host, "0", "end", a.x + 1, a.y + 1);
    await settle(host);
    await expect(board().test).toBeUndefined();
  },
});

export const NearestFreeSpot = meta.story({
  name: "The nearest free spot",
  render: () => boardOf(pageOf(half("A"), half("B"))),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    const s = centre(tileOf(host, "0"));
    const b = tileOf(host, "1").getBoundingClientRect();
    send(host, "0", "start", s.x, s.y);
    send(host, "0", "move", b.left + b.width / 2, b.bottom + 30);
    send(host, "0", "end", b.left + b.width / 2, b.bottom + 30);
    await settle(host);
    await expect(board().test!.pins!["0"]).toMatchObject({ lane: 12 });
  },
});

export const NearestToPointer = meta.story({
  name: "Move into the free spot nearest the pointer",
  render: () => boardOf(pageOf(note("A"), { ...note("Tall"), rows: 16, maxRows: 16 } as Widget)),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    const a = centre(tileOf(host, "0"));
    send(host, "0", "start", a.x, a.y);
    send(host, "0", "move", a.x, a.y + 6 * tileH());
    send(host, "0", "end", a.x, a.y + 6 * tileH());
    await settle(host);
    await expect(board().test!.pins!["0"]).toMatchObject({ lane: 0 });
  },
});

export const NoWidthFloor = meta.story({
  name: "Resize a tile with no width floor",
  render: () => boardOf(pageOf({ ...note("Wide"), size: "full", minSize: "full" } as Widget)),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    await expect(arrangeOf(host, "0").arrange.bounds!.minSpan).toBeUndefined();
    const r = tileOf(host, "0").getBoundingClientRect();
    send(host, "0", "start", r.right, r.bottom, "ui-resize");
    send(host, "0", "move", r.right - 30 * tileW(), r.bottom, "ui-resize", -30 * tileW());
    send(host, "0", "end", r.right - 30 * tileW(), r.bottom, "ui-resize", -30 * tileW());
    await settle(host);
    await expect(board().test!.widths!["0"]).toBe(1);
  },
});

export const KeepOnce = meta.story({
  name: "Keep nothing when cancelled or already kept",
  beforeEach: atReports,
  render: () => boardOf(reportsPage, { board: "" }, 12 * tileW()),
  play: async ({ canvasElement }) => {
    const { host: from } = await bench.ready(canvasElement);
    const { host: to } = await bench.show(homePage, { board: "home" }, 12 * tileW());
    const r = to.getBoundingClientRect();
    const start = centre(tileOf(from, "1"));
    send(from, "1", "start", start.x, start.y);
    send(from, "1", "move", r.left + 20, r.top + 20);
    send(from, "1", "cancel", r.left + 20, r.top + 20);
    await settle(to);
    await expect(board().home).toBeUndefined();
    for (let i = 0; i < 2; i++) {
      send(from, "1", "start", start.x, start.y);
      send(from, "1", "move", r.left + 20, r.top + 20);
      send(from, "1", "end", r.left + 20, r.top + 20);
      await settle(to);
    }
    await expect(board().home!.added).toHaveLength(1);
    await expect(bench.dashboard.notices).toHaveLength(1);
  },
});
