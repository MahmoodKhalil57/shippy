import { motion as motionQueue } from "../../base/motion-queue.ts";
import { cssTime } from "../../base/css-time.ts";
import { tileH, tileW } from "../../base/tiles.ts";
import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import {
  clampRows,
  keepOrder,
  lanesFor,
  layoutLanes,
  place,
  rowsFor,
  scaleArranged,
  stretch,
  type Placed,
  type TileSize,
} from "../../base/board.ts";
import { pack, type PackInput } from "../../base/pack.ts";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { board as layout, inlineRow, text } from "./algebra.ts";
import { iconSvg } from "../media/icon.ts";

for (const name of [
  "--board-cols",
  "--board-quarters",
  "--lane",
  "--span",
  "--row",
  "--rows",
  "--lift-x",
  "--lift-y",
  "--held-w",
  "--held-h",
]) {
  try {
    CSS.registerProperty({ name, syntax: "*", inherits: false });
  } catch {}
}

export const boardBox = rcva(layout.box);
export const boardLanes = rcva(layout.lanes);
export const boardTile = rcva(
  `${layout.tile} ${layout.held} [transition:opacity_var(--duration-effects)_var(--ease-effects)] starting:opacity-0 motion-reduce:transition-none data-empty:absolute data-empty:start-0 data-empty:end-0 data-empty:invisible`,
  { variants: { inset: { true: layout.inset, false: "" }, skip: { true: layout.skip, false: "" } } },
);
export const boardDrop = rcva(layout.drop);
export const boardDropMark = rcva(
  "h-full rounded-box border-2 border-dashed border-primary bg-primary/12 [transition:opacity_var(--duration-effects-fast)_var(--ease-effects-fast)] starting:opacity-0 motion-reduce:transition-none",
  { variants: { target: { true: "grid place-items-center", false: "" } } },
);
export const boardDropLabel = rcva(`${inlineRow} ${text.line} items-center gap-2 text-label-lg text-primary`);
export type BoardEdge = "start" | "end" | "top" | "bottom";
export const boardFit = rcva(layout.fit);

const FIT_KEY = "ui-board-fit";
const FIT_KEPT = 400;
const fitMemory = new Map<string, number>(readFits());
function readFits(): [string, number][] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(FIT_KEY) ?? "[]");
    return Array.isArray(saved)
      ? saved.filter(
          (e): e is [string, number] =>
            Array.isArray(e) && typeof e[0] === "string" && Number.isInteger(e[1]) && e[1] > 0,
        )
      : [];
  } catch {
    return [];
  }
}
let fitSaving = false;
function rememberFit(key: string, rows: number) {
  if (fitMemory.get(key) === rows) return;
  fitMemory.delete(key);
  fitMemory.set(key, rows);
  if (fitSaving) return;
  fitSaving = true;
  queueMicrotask(() => {
    fitSaving = false;
    try {
      localStorage.setItem(FIT_KEY, JSON.stringify([...fitMemory].slice(-FIT_KEPT)));
    } catch {}
  });
}

const tokens = new Map<string, string>();
const motion = (name: string) => {
  let v = tokens.get(name);
  if (v === undefined) tokens.set(name, (v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()));
  return v;
};

export interface BoardItem {
  key: string;
  size: TileSize;
  rows: number | "fit";
  flush?: boolean;
  remember?: string;
  span?: number;
  reflow?: number;
  maxSpan?: number;
  maxRows?: number;
  bounds?: PackInput["bounds"];
  fixed?: boolean;
  at?: number;
  atRow?: number;
  arrangedAt?: number;
  content?: unknown;
  drop?: boolean;
  away?: boolean;
}

export interface BoardPoint {
  x: number;
  y: number;
}

interface SlidePlan {
  duration: number;
  delay: number;
  easing: string;
  tiles: {
    tile: HTMLElement;
    key: string;
    now: { x: number; y: number; span: number; rows: number; w: number; h: number };
    shown?: { w: number; h: number };
    inner: { w: number; h: number };
    content: HTMLElement | null;
  }[];
  mark?: { el: HTMLElement; now: { x: number; y: number; w: number; h: number } };
}

const sliding = new Set<UiBoard>();
const boards = new Set<UiBoard>();
async function flushSlides() {
  for (let pending = [...boards].filter((b) => b.isUpdatePending); pending.length;) {
    await Promise.all(pending.map((b) => b.updateComplete));
    pending = [...boards].filter((b) => b.isUpdatePending);
  }
  const batch = [...sliding];
  sliding.clear();
  UiBoard.slideAll(batch);
}
function slideSoon(board: UiBoard) {
  if (!sliding.size) void flushSlides();
  sliding.add(board);
}

@customElement("ui-board")
export class UiBoard extends LightElement {
  @property({ attribute: false }) items: BoardItem[] = [];
  @property({ type: Boolean }) fit = false;
  @state() private _laneW = 0;
  @state() private _lanes = 0;
  get lanes() {
    return this._lanes;
  }
  #width = 0;
  #expected?: number;

  #fitLanes() {
    if (!this.#width) return;
    const scale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
    if (this.fit) {
      const lanes = Math.max(1, Math.round(this.#width / tileW(scale)));
      if (lanes !== this._lanes) this._lanes = lanes;
      const w = this.#width / lanes;
      if (Math.abs(w - this._laneW) > 0.1) this._laneW = w;
      return;
    }
    const now = lanesFor(this.#width, scale);
    const lanes = this.#expected === undefined ? now : lanesFor(this.#expected, scale);
    if (lanes !== this._lanes) this._lanes = lanes;
  }

  expectWidth(delta: number, settled: Promise<unknown>, timing?: { until: number; duration: number; easing: string }) {
    this.#springTiming = timing;
    if (!this.#width || !delta) return;
    const then = this.#widthWhenPanelIs(delta);
    if (lanesFor(then, this.#scale()) === lanesFor(this.#width, this.#scale())) return;
    this.#expected = then;
    this.#springing = true;
    this.#fitLanes();
    void settled.then(() => {
      if (this.#expected !== then) return;
      this.#expected = undefined;
      this.#springing = false;
      this.#fitLanes();
    });
  }
  #springing = false;
  #springTiming?: { until: number; duration: number; easing: string };

  #scale() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
  }

  #widthWhenPanelIs(delta: number): number {
    const boxed = (from: Element | null | undefined) => {
      let e = from ?? null;
      while (e && getComputedStyle(e).display === "contents") e = e.parentElement;
      return e;
    };
    const box = boxed(this.parentElement);
    const parent = boxed(box?.parentElement);
    if (!box || !parent) return this.#width - delta;
    const probe = document.createElement("div");
    probe.style.cssText = `position:absolute;inset-block-start:0;inset-inline-start:0;visibility:hidden;contain:layout;inline-size:${Math.max(0, parent.clientWidth - delta)}px`;
    const copy = box.cloneNode(false) as HTMLElement;
    probe.append(copy);
    parent.append(probe);
    const cs = getComputedStyle(copy);
    const width = copy.clientWidth - parseFloat(cs.paddingInlineStart) - parseFloat(cs.paddingInlineEnd);
    probe.remove();
    return width;
  }

  @state() private _open = new Map<string, number>();
  @state() private _fit = new Map<string, number>();
  #fits = new ResizeObserver((entries) => {
    const scale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
    let next: Map<string, number> | undefined;
    for (const e of entries) {
      const el = e.target as HTMLElement;
      const key = el.dataset.fit!;
      const remember = el.dataset.remember || undefined;
      const inset = el.dataset.flush !== undefined ? 0 : 8;
      const rows = rowsFor((e.borderBoxSize?.[0]?.blockSize ?? e.contentRect.height) + inset, scale);
      if (remember) rememberFit(remember, rows);
      if ((next ?? this._fit).get(key) !== rows) (next ??= new Map(this._fit)).set(key, rows);
    }
    if (next) this._fit = next;
  });
  #fitting = new Set<Element>();

  #resize = new ResizeObserver((entries) => {
    const lanesEl = this._lanesEl;
    let resized = false;
    for (const e of entries)
      if (e.target === lanesEl && lanesEl.checkVisibility()) {
        resized = true;
        this.#width = e.borderBoxSize?.[0]?.inlineSize ?? e.contentRect.width;
        this.#fitLanes();
      }
    this._slide(resized);
  });
  #observed = new Set<Element>();
  #mark?: { x: number; y: number; w: number; h: number };
  #at = new Map<string, { x: number; y: number; span: number; rows: number; w: number; h: number }>();
  #sizing = new WeakMap<HTMLElement, Animation>();
  #held?: {
    key: string;
    how: "move" | "resize";
    grab: BoardPoint;
    corner: { left: number; right: number; top: number };
    pointer: BoardPoint;
    size?: { width: number; height: number };
    box: { width: number; height: number };
  };
  #dropping?: string;
  #arranging = false;
  @state() private _held?: string;

  #placed = new Map<string, Placed>();
  placed(): ReadonlyMap<string, Placed> {
    return this.#placed;
  }

  #cellSize() {
    const scale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
    return { w: this.fit && this._laneW ? this._laneW : tileW(scale), h: tileH(scale) };
  }

  cellAt(point: BoardPoint) {
    const lanes = this._lanesEl;
    if (!lanes) return null;
    const l = lanes.getBoundingClientRect();
    const { w, h } = this.#cellSize();
    const across = Math.max(1, this._lanes);
    const rtl = getComputedStyle(lanes).direction === "rtl";
    return {
      lanes: across,
      lane: (rtl ? l.right - point.x : point.x - l.left) / w,
      row: (point.y - l.top) / h,
      inside: point.x >= l.left && point.x <= l.right && point.y >= l.top && point.y <= l.bottom + h * 2,
    };
  }

  rectOf(p: Placed): DOMRect | null {
    const lanes = this._lanesEl;
    if (!lanes) return null;
    const l = lanes.getBoundingClientRect();
    const { w, h } = this.#cellSize();
    const rtl = getComputedStyle(lanes).direction === "rtl";
    const start = rtl ? l.right - (p.lane + p.span) * w : l.left + p.lane * w;
    return new DOMRect(start, l.top + p.row * h, p.span * w, p.rows * h);
  }

  #drawn: string[] = [];
  #inOrder(): BoardItem[] {
    this.#drawn = keepOrder(
      this.#drawn,
      this.items.map((it) => it.key),
    );
    const byKey = new Map(this.items.map((it) => [it.key, it]));
    return this.#drawn.map((k) => byKey.get(k)!);
  }

  #cell(key: string) {
    return this._tiles.find((t) => t.dataset.key === key);
  }

  hold(key: string, how: "move" | "resize", pointer: BoardPoint) {
    const cell = this.#cell(key);
    const lanes = this._lanesEl;
    if (!cell || !lanes) return;
    for (const a of cell.getAnimations()) a.cancel();
    const r = cell.getBoundingClientRect();
    const l = lanes.getBoundingClientRect();
    this.#held = {
      key,
      how,
      grab: { x: pointer.x - r.left, y: pointer.y - r.top },
      corner: { left: r.left - l.left, right: r.right - l.left, top: r.top - l.top },
      pointer,
      box: { width: r.width, height: r.height },
    };
    this.#lift();
    cell.style.setProperty("--grab", `${pointer.x - r.left}px ${pointer.y - r.top}px`);
    cell.toggleAttribute("data-held", true);
    cell.setAttribute("popover", "manual");
    try {
      cell.showPopover();
    } catch {}
    this._held = key;
  }

  carry(out: boolean) {
    const cell = this.#held && this.#cell(this.#held.key);
    cell?.toggleAttribute("data-out", out);
  }

  follow(pointer: BoardPoint, size?: { width: number; height: number }) {
    const h = this.#held;
    if (!h) return;
    h.pointer = pointer;
    if (size) h.size = size;
    this.#lift();
  }

  drop() {
    const h = this.#held;
    if (!h) return;
    const from = this.#cell(h.key)?.getBoundingClientRect();
    this.#held = undefined;
    this.#dropping = h.key;
    this.#arranging = true;
    requestAnimationFrame(() => {
      this._held = undefined;
      this.#dropping = undefined;
      this.#arranging = false;
      const cell = this.#cell(h.key);
      if (!cell || !from) return;
      cell.removeAttribute("popover");
      cell.removeAttribute("data-held");
      cell.removeAttribute("data-out");
      for (const p of ["--lift-x", "--lift-y", "--held-w", "--held-h", "--grab"]) cell.style.removeProperty(p);
      const to = cell.getBoundingClientRect();
      this.#remember(cell);
      const duration = cssTime(motion("--duration-spatial"));
      if (!duration) return;
      const easing = motion("--ease-spatial") || "ease";
      const sized = Math.abs(from.width - to.width) >= 1 || Math.abs(from.height - to.height) >= 1;
      const anims = [
        cell.animate([{ translate: `${from.left - to.left}px ${from.top - to.top}px` }, { translate: "0 0" }], {
          duration,
          easing,
          composite: "add",
        }),
      ];
      if (sized) {
        const grow = cell.animate(
          [
            { width: `${from.width}px`, height: `${from.height}px` },
            { width: `${to.width}px`, height: `${to.height}px` },
          ],
          { duration, easing },
        );
        this.#sizing.set(cell, grow);
        anims.push(grow);
      }
      void motionQueue.input(anims);
    });
  }

  #lift() {
    const h = this.#held;
    const lanes = this._lanesEl;
    const cell = h && this.#cell(h.key);
    if (!h || !lanes || !cell) return;
    const { width: w, height: ht } = h.size ?? h.box;
    let x: number;
    let y: number;
    if (h.how === "move") {
      x = h.pointer.x - h.grab.x;
      y = h.pointer.y - h.grab.y;
    } else {
      const l = lanes.getBoundingClientRect();
      const rtl = getComputedStyle(cell).direction === "rtl";
      x = l.left + (rtl ? h.corner.right - w : h.corner.left);
      y = l.top + h.corner.top;
    }
    x = Math.max(0, Math.min(x, innerWidth - w));
    y = Math.max(0, Math.min(y, innerHeight - Math.min(ht, innerHeight)));
    cell.style.setProperty("--lift-x", `${x}px`);
    cell.style.setProperty("--lift-y", `${y}px`);
    cell.style.setProperty("--held-w", `${w}px`);
    cell.style.setProperty("--held-h", `${ht}px`);
  }

  #remember(tile: HTMLElement) {
    const scale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
    const qw = this.#quarterW(scale);
    const qh = tileH(scale) / 4;
    const span = Number(tile.style.getPropertyValue("--span")) || 0;
    const rows = Number(tile.style.getPropertyValue("--rows")) || 0;
    this.#at.set(tile.dataset.key!, { ...this.#placeOf(tile), span, rows, w: span * qw, h: rows * qh });
  }

  #placeOf(el: HTMLElement) {
    const lanes = this._lanesEl;
    const at = (e: HTMLElement | null) => {
      let x = 0;
      let y = 0;
      for (; e; e = e.offsetParent as HTMLElement | null) {
        x += e.offsetLeft;
        y += e.offsetTop;
      }
      return { x, y };
    };
    const a = at(el);
    const o = lanes ? at(lanes) : { x: 0, y: 0 };
    return { x: a.x - o.x, y: a.y - o.y };
  }

  connectedCallback() {
    super.connectedCallback();
    boards.add(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    boards.delete(this);
    this.#resize.disconnect();
    this.#fits.disconnect();
    this.#fitting.clear();
    this.#observed.clear();
    this.#at.clear();
  }

  #looked = false;

  protected override async getUpdateComplete(): Promise<boolean> {
    const done = await super.getUpdateComplete();
    return done || super.getUpdateComplete();
  }

  private get _lanesEl() {
    return this.querySelector<HTMLElement>(":scope > div > [data-board-lanes]");
  }
  private get _tiles() {
    const lanes = this._lanesEl;
    return lanes ? [...lanes.children].filter((e): e is HTMLElement => e.hasAttribute("data-board-tile")) : [];
  }

  protected updated() {
    if (!this.#looked) {
      this.#looked = true;
      const lanes = this._lanesEl;
      const width = lanes?.checkVisibility() ? lanes.getBoundingClientRect().width : 0;
      if (width) {
        this.#width = width;
        this.#fitLanes();
      }
      this.requestUpdate();
    }
    const watch = [this._lanesEl, ...this._tiles].filter((e): e is HTMLElement => !!e);
    for (const el of watch)
      if (!this.#observed.has(el)) {
        this.#observed.add(el);
        this.#resize.observe(el);
      }
    for (const el of this.#observed)
      if (!el.isConnected) {
        this.#resize.unobserve(el);
        this.#observed.delete(el);
      }
    for (const tile of this._tiles) {
      const fit = tile.querySelector(":scope > [data-fit]");
      if (fit && !this.#fitting.has(fit)) {
        this.#fitting.add(fit);
        this.#fits.observe(fit);
      }
    }
    for (const el of this.#fitting)
      if (!el.isConnected) {
        this.#fits.unobserve(el);
        this.#fitting.delete(el);
      }
    if (this.#held) this.#lift();
    slideSoon(this);
  }

  private _slide(resized = false) {
    this.#play(this.#measure(), resized);
  }

  #quarterW(scale: number) {
    return (this.fit && this._laneW ? this._laneW : tileW(scale)) / 4;
  }

  #measure(): SlidePlan {
    const fast = this.#held ? "-fast" : "";
    const spring = this.#springing ? this.#springTiming : undefined;
    const duration = spring?.duration ?? cssTime(motion(`--duration-spatial${fast}`));
    const easing = spring?.easing ?? (motion(`--ease-spatial${fast}`) || "ease");
    const delay = spring ? Math.max(0, spring.until - performance.now()) : 0;
    const scale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
    const qw = this.#quarterW(scale);
    const qh = tileH(scale) / 4;
    const tiles: SlidePlan["tiles"] = [];
    for (const tile of this._tiles) {
      if (tile.hasAttribute("data-empty") || !tile.style.getPropertyValue("--lane")) continue;
      const span = Number(tile.style.getPropertyValue("--span")) || 0;
      const rows = Number(tile.style.getPropertyValue("--rows")) || 0;
      const now = { ...this.#placeOf(tile), span, rows, w: span * qw, h: rows * qh };
      const playing = this.#sizing.get(tile);
      const shown = playing?.playState === "running" ? { w: tile.offsetWidth, h: tile.offsetHeight } : undefined;
      const pad = getComputedStyle(tile);
      const inner = {
        w: now.w - parseFloat(pad.paddingInlineStart) - parseFloat(pad.paddingInlineEnd),
        h: now.h - parseFloat(pad.paddingBlockStart) - parseFloat(pad.paddingBlockEnd),
      };
      let content = tile.firstElementChild as HTMLElement | null;
      while (content && getComputedStyle(content).display === "contents")
        content = content.firstElementChild as HTMLElement | null;
      tiles.push({ tile, key: tile.dataset.key!, now, shown, inner, content });
    }
    const markEl = this._lanesEl?.querySelector<HTMLElement>(":scope > [data-board-drop]") ?? undefined;
    const mark = markEl && {
      el: markEl,
      now: { ...this.#placeOf(markEl), w: markEl.offsetWidth, h: markEl.offsetHeight },
    };
    return { duration, easing, delay, tiles, mark };
  }

  #play({ duration, easing, delay, tiles, mark }: SlidePlan, resized: boolean) {
    const seen = new Set<string>();
    const slides: Animation[] = [];
    for (const { tile, key, now, shown, inner, content } of tiles) {
      seen.add(key);
      const was = this.#at.get(key);
      this.#at.set(key, now);
      if (!was || !duration) continue;
      if (key === this.#held?.key) {
        this.#lift();
        continue;
      }
      if (key === this.#dropping) continue;
      if (was.span !== now.span || was.rows !== now.rows) {
        const from = shown ?? { w: was.w, h: was.h };
        this.#sizing.get(tile)?.cancel();
        const grow = tile.animate(
          [
            { width: `${from.w}px`, height: `${from.h}px` },
            { width: `${now.w}px`, height: `${now.h}px` },
          ],
          { duration, easing, delay, fill: "backwards" },
        );
        this.#sizing.set(tile, grow);
        if (content && inner.w > 0 && inner.h > 0) {
          content.style.setProperty("inline-size", `${inner.w}px`);
          content.style.setProperty("block-size", `${inner.h}px`);
          content.style.setProperty("flex-shrink", "0");
          const unpin = () => {
            if (this.#sizing.get(tile) !== grow) return;
            for (const p of ["inline-size", "block-size", "flex-shrink"]) content.style.removeProperty(p);
          };
          grow.finished.then(unpin, unpin);
        }
        slides.push(grow);
      }
      const dx = was.x - now.x;
      const dy = was.y - now.y;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
      slides.push(
        tile.animate([{ translate: `${dx}px ${dy}px` }, { translate: "0 0" }], {
          duration,
          easing,
          delay,
          fill: "backwards",
          composite: "add",
        }),
      );
    }
    if (mark) {
      const { el, now } = mark;
      const was = this.#mark;
      this.#mark = now;
      if (was && duration) {
        const dx = was.x - now.x;
        const dy = was.y - now.y;
        if (Math.abs(dx) >= 1 || Math.abs(dy) >= 1)
          slides.push(
            el.animate([{ translate: `${dx}px ${dy}px` }, { translate: "0 0" }], {
              duration,
              easing,
              composite: "add",
            }),
          );
        if (Math.abs(was.w - now.w) >= 1 || Math.abs(was.h - now.h) >= 1)
          slides.push(
            el.animate(
              [
                { width: `${was.w}px`, height: `${was.h}px` },
                { width: `${now.w}px`, height: `${now.h}px` },
              ],
              { duration, easing, delay, fill: "backwards" },
            ),
          );
      }
    } else this.#mark = undefined;
    for (const key of this.#at.keys()) if (!seen.has(key)) this.#at.delete(key);
    if (resized || this.#arranging || this.#held || this.#springing) void motionQueue.input(slides);
    else void motionQueue.add(slides, "follow", this);
  }

  static slideAll(boards: UiBoard[]) {
    const plans = boards.map((b) => [b, b.isConnected ? b.#measure() : undefined] as const);
    for (const [b, plan] of plans) if (plan) b.#play(plan, false);
  }

  private _rows(it: BoardItem) {
    const open = this._open.get(it.key);
    if (open) return open;
    if (it.rows === "fit") return this._fit.get(it.key) ?? (it.remember ? fitMemory.get(it.remember) : undefined) ?? 1;
    return clampRows(it.rows);
  }

  private _onRows(key: string, e: Event) {
    const rows = (e as CustomEvent<{ rows: number | null }>).detail.rows;
    const next = new Map(this._open);
    if (rows) next.set(key, clampRows(rows));
    else next.delete(key);
    this._open = next;
  }

  private _packed(shown: BoardItem[], lanes: number): Placed[] | undefined {
    if (shown.some((it) => it.at !== undefined)) return undefined;
    const at = layoutLanes(lanes);
    return stretch(this._packAt(shown, at), at, lanes).map((p, i) => {
      const it = shown[i]!;
      const most = Math.min(it.maxSpan ?? Infinity, it.bounds?.maxSpan ?? Infinity);
      return p.span > most && !it.fixed && it.size !== "full" ? { ...p, span: Math.max(1, most) } : p;
    });
  }

  private _packAt(shown: BoardItem[], lanes: number): Placed[] {
    return pack(
      shown.map((it) => {
        const rows =
          it.rows === "fit"
            ? (this._fit.get(it.key) ?? (it.remember ? fitMemory.get(it.remember) : undefined) ?? 1)
            : clampRows(it.rows);
        const bounds = it.bounds && (it.rows === "fit" ? { ...it.bounds, minRows: rows, maxRows: rows } : it.bounds);
        return { size: it.size, rows, span: it.span, reflow: it.reflow, bounds, fixed: it.fixed };
      }),
      lanes,
    );
  }

  render(): TemplateResult {
    const lanes = this._lanes;
    const shown = this.items.filter((it) => !it.away);
    const packed = lanes ? this._packed(shown, lanes) : undefined;
    const where = lanes
      ? place(
          shown.map((it, i) => {
            const p = packed?.[i];
            if (!p && it.at !== undefined && it.arrangedAt && it.arrangedAt !== lanes) {
              const s = scaleArranged(it.at, it.span ?? 1, it.arrangedAt, lanes);
              return {
                size: it.size,
                rows: this._rows(it),
                span: s.span,
                reflow: it.reflow,
                maxSpan: it.maxSpan,
                maxRows: it.maxRows,
                at: "at" in s ? s.at : undefined,
                atRow: "at" in s ? it.atRow : undefined,
              };
            }
            return {
              size: it.size,
              rows: p ? (this._open.get(it.key) ?? p.rows) : this._rows(it),
              span: p ? p.span : it.span,
              reflow: p ? 1 : it.reflow,
              maxSpan: it.maxSpan,
              maxRows: it.maxRows,
              at: p ? p.lane : it.at,
              atRow: p ? p.row : it.atRow,
            };
          }),
          lanes,
        )
      : [];
    const placeOf = new Map<string, Placed>(shown.map((it, i) => [it.key, where[i]!]));
    this.#placed = placeOf;
    const landing = this._held ? placeOf.get(this._held) : undefined;
    return html`<div class=${boardBox()}>
      <div
        class=${boardLanes()}
        style=${styleMap({
          "--board-cols": String(lanes || 1),
          "--board-quarters": String(4 * (lanes || 1)),
          "--tile-w": this.fit && this._laneW ? `${this._laneW}px` : undefined,
        })}
        data-board-lanes
      >
        ${
          landing
            ? html`<div
                class=${boardDrop()}
                data-board-drop
                aria-hidden="true"
                style=${styleMap({
                  "--lane": String(4 * landing.lane + 1),
                  "--span": String(4 * landing.span),
                  "--row": String(4 * landing.row + 1),
                  "--rows": String(4 * landing.rows),
                })}
              >
                <div class=${boardDropMark()}></div>
              </div>`
            : nothing
        }
        ${repeat(
          this.#looked ? this.#inOrder() : [],
          (it) => it.key,
          (it) => {
            const p = placeOf.get(it.key);
            return html`<div
              class=${boardTile({ inset: !it.flush, skip: !!p && it.rows !== "fit" && !it.drop })}
              data-board-tile
              data-key=${it.key}
              data-size=${it.size}
              ?data-empty=${!!it.away}
              style=${styleMap({
                "--lane": p ? String(4 * p.lane + 1) : undefined,
                "--span": p ? String(4 * p.span) : undefined,
                "--row": p ? String(4 * p.row + 1) : undefined,
                "--rows": String(4 * (p ? p.rows : this._rows(it))),
              })}
              @ui-tile-rows=${(e: Event) => this._onRows(it.key, e)}
            >
              ${
                it.drop
                  ? html`<div class=${boardDropMark({ target: true })}>
                      <span class=${boardDropLabel()}>${iconSvg("plus", { size: "sm" })}${it.content}</span>
                    </div>`
                  : it.rows === "fit"
                    ? html`<div
                        class=${boardFit()}
                        data-fit=${it.key}
                        data-remember=${it.remember ?? ""}
                        ?data-flush=${!!it.flush}
                      >
                        ${it.content}
                      </div>`
                    : it.content
              }
            </div>`;
          },
        )}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-board": UiBoard;
  }
}
