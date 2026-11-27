export interface CanvasItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  content: HTMLElement;
}

export interface CanvasView {
  x: number;
  y: number;
  zoom: number;
}

export interface CanvasNear {
  entered: string[];
  left: string[];
  zoom: number;
}

export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 4;
const STEP = 1.25;
const PAN_STEP = 64;
const FIT_PADDING = 48;
const LABEL_SPACE = 40;
const ANIMATION_MS = 220;
const NEAR_MARGIN = 0.5;

const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
const editable = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

const STYLE = `
:host {
  --canvas-bg: #eef0f3;
  --canvas-dot: #c9ced6;
  --canvas-ink: #1d2733;
  --canvas-muted: #5b6673;
  --canvas-panel: #ffffff;
  --canvas-line: #d5dae1;
  --canvas-focus: #2563eb;
  --canvas-live: #15803d;
  display: block;
  position: relative;
  overflow: hidden;
  contain: strict;
  color: var(--canvas-ink);
  font: 13px/1.4 system-ui, sans-serif;
}
@media (prefers-color-scheme: dark) {
  :host {
    --canvas-bg: #14181d;
    --canvas-dot: #2c333c;
    --canvas-ink: #e4e8ee;
    --canvas-muted: #9aa5b1;
    --canvas-panel: #1f252c;
    --canvas-line: #353d47;
    --canvas-focus: #7aa7ff;
    --canvas-live: #4ade80;
  }
}
.viewport {
  position: absolute;
  inset: 0;
  outline: none;
  touch-action: none;
  cursor: default;
  background-color: var(--canvas-bg);
  background-image: radial-gradient(circle, var(--canvas-dot) 1px, transparent 1.5px);
  background-size: var(--grid) var(--grid);
  background-position: var(--grid-x) var(--grid-y);
}
.viewport:focus-visible {
  box-shadow: inset 0 0 0 2px var(--canvas-focus);
}
.layer {
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
  will-change: transform;
}
.item {
  position: absolute;
}
.label {
  position: absolute;
  left: 0;
  bottom: 100%;
  padding-bottom: 16px;
  white-space: nowrap;
  color: var(--canvas-muted);
  font-weight: 500;
  user-select: none;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-inline-start: 8px;
  padding: 0 6px;
  border: 1px solid var(--canvas-line);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.badge[data-live] {
  border-color: currentColor;
  color: var(--canvas-live);
}
.badge[data-live]::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.overlay {
  position: absolute;
  inset: 0;
  display: none;
  cursor: grab;
}
:host([panning]) .overlay,
:host([pan-ready]) .overlay {
  display: block;
}
:host([panning]) .overlay,
:host([panning]) .viewport {
  cursor: grabbing;
}
.controls {
  position: absolute;
  right: 16px;
  bottom: 16px;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border: 1px solid var(--canvas-line);
  border-radius: 10px;
  background: var(--canvas-panel);
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.08);
}
.controls button {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.controls button:hover {
  background: var(--canvas-line);
}
.controls button:focus-visible {
  outline: 2px solid var(--canvas-focus);
  outline-offset: 1px;
}
.controls output {
  min-width: 48px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.hint {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
`;

type GestureEvent = Event & { scale: number; clientX: number; clientY: number };

export class ExplodeCanvas extends HTMLElement {
  #view: CanvasView = { x: 0, y: 0, zoom: 1 };
  #items = new Map<string, { item: CanvasItem; el: HTMLElement }>();
  #viewport: HTMLDivElement;
  #layer: HTMLDivElement;
  #overlay: HTMLDivElement;
  #readout: HTMLOutputElement;
  #frame = 0;
  #animation = 0;
  #fitted = false;
  #space = false;
  #pointers = new Map<number, { x: number; y: number }>();
  #drag: { id: number; x: number; y: number } | null = null;
  #pinch: { distance: number; x: number; y: number } | null = null;
  #gestureScale = 1;
  #near = new Set<string>();
  #size = { width: 0, height: 0 };
  #resize = new ResizeObserver(() => {
    this.#size = { width: this.clientWidth, height: this.clientHeight };
    if (this.#fitted || !this.#size.width || !this.#size.height || !this.#items.size) {
      this.#apply(this.#view);
      return;
    }
    this.#fitted = true;
    this.#set(this.#fitView());
  });

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = `<style>${STYLE}</style>
<div class="viewport" part="viewport" tabindex="0" role="application" aria-roledescription="canvas" aria-label="Canvas" aria-describedby="hint">
  <div class="layer" part="layer"></div>
  <div class="overlay"></div>
</div>
<p class="hint" id="hint">Drag the background, or hold Space and drag, to pan. Scroll to pan, Control or Command with scroll to zoom. Arrow keys pan, plus and minus zoom, 0 resets, 1 fits all items.</p>
<div class="controls" role="toolbar" aria-label="Zoom">
  <button type="button" data-action="out" aria-label="Zoom out">−</button>
  <output aria-label="Zoom level" aria-live="polite">100%</output>
  <button type="button" data-action="in" aria-label="Zoom in">+</button>
  <button type="button" data-action="fit" aria-label="Fit all items">Fit</button>
</div>`;
    this.#viewport = root.querySelector(".viewport")!;
    this.#layer = root.querySelector(".layer")!;
    this.#overlay = root.querySelector(".overlay")!;
    this.#readout = root.querySelector("output")!;
    root.querySelector(".controls")!.addEventListener("click", (e) => {
      const action = (e.target as HTMLElement).closest("button")?.dataset.action;
      if (action === "in") this.zoomBy(STEP);
      else if (action === "out") this.zoomBy(1 / STEP);
      else if (action === "fit") this.fit();
    });
    this.#viewport.addEventListener("pointerdown", this.#onPointerDown);
    this.#viewport.addEventListener("pointermove", this.#onPointerMove);
    this.#viewport.addEventListener("pointerup", this.#onPointerUp);
    this.#viewport.addEventListener("pointercancel", this.#onPointerUp);
    this.#viewport.addEventListener("auxclick", (e) => e.button === 1 && e.preventDefault());
    this.#viewport.addEventListener("wheel", this.#onWheel, { passive: false });
    this.#viewport.addEventListener("keydown", this.#onKeyDown);
    this.#viewport.addEventListener("gesturestart", this.#onGestureStart);
    this.#viewport.addEventListener("gesturechange", this.#onGestureChange);
  }

  connectedCallback() {
    window.addEventListener("keydown", this.#onSpaceDown);
    window.addEventListener("keyup", this.#onSpaceUp);
    window.addEventListener("blur", this.#onBlur);
    this.#resize.observe(this);
    this.#render();
  }

  disconnectedCallback() {
    window.removeEventListener("keydown", this.#onSpaceDown);
    window.removeEventListener("keyup", this.#onSpaceUp);
    window.removeEventListener("blur", this.#onBlur);
    this.#resize.disconnect();
    cancelAnimationFrame(this.#frame);
    cancelAnimationFrame(this.#animation);
  }

  get view(): CanvasView {
    return { ...this.#view };
  }

  get items(): CanvasItem[] {
    return [...this.#items.values()].map((i) => i.item);
  }

  get near(): string[] {
    return [...this.#near];
  }

  show(view: CanvasView) {
    this.#fitted = true;
    this.#set(view);
  }

  add(item: CanvasItem): HTMLElement {
    this.removeItem(item.id);
    const el = document.createElement("div");
    el.className = "item";
    el.dataset.id = item.id;
    el.style.left = `${item.x}px`;
    el.style.top = `${item.y}px`;
    el.style.width = `${item.width}px`;
    el.style.height = `${item.height}px`;
    if (item.label) {
      const label = document.createElement("div");
      label.className = "label";
      label.textContent = item.label;
      el.append(label);
    }
    el.append(item.content);
    this.#layer.append(el);
    this.#items.set(item.id, { item, el });
    this.#apply(this.#view);
    return el;
  }

  mark(id: string, text: string | null, live = false) {
    const label = this.#items.get(id)?.el.querySelector(".label");
    if (!label) return;
    let badge = label.querySelector<HTMLElement>(".badge");
    if (!text) {
      badge?.remove();
      return;
    }
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "badge";
      label.append(badge);
    }
    badge.textContent = text;
    badge.toggleAttribute("data-live", live);
  }

  removeItem(id: string) {
    this.#items.get(id)?.el.remove();
    this.#items.delete(id);
    this.#near.delete(id);
  }

  panBy(dx: number, dy: number) {
    this.#set({ ...this.#view, x: this.#view.x + dx, y: this.#view.y + dy });
  }

  zoomBy(factor: number, at?: { x: number; y: number }) {
    this.#animate(this.#zoomed(this.#target().zoom * factor, at, this.#target()));
  }

  zoomTo(zoom: number, at?: { x: number; y: number }) {
    this.#animate(this.#zoomed(zoom, at, this.#target()));
  }

  reset() {
    const fit = this.#fitView();
    const cx = this.clientWidth / 2;
    const cy = this.clientHeight / 2;
    const wx = (cx - fit.x) / fit.zoom;
    const wy = (cy - fit.y) / fit.zoom;
    this.#animate({ zoom: 1, x: cx - wx, y: cy - wy });
  }

  fit(instant = false) {
    this.#fitted = true;
    if (instant) this.#set(this.#fitView());
    else this.#animate(this.#fitView());
  }

  #bounds() {
    const all = this.items;
    if (!all.length) return { x: 0, y: 0, width: 0, height: 0 };
    const left = Math.min(...all.map((i) => i.x));
    const top = Math.min(...all.map((i) => i.y - (i.label ? LABEL_SPACE : 0)));
    const right = Math.max(...all.map((i) => i.x + i.width));
    const bottom = Math.max(...all.map((i) => i.y + i.height));
    return { x: left, y: top, width: right - left, height: bottom - top };
  }

  #fitView(): CanvasView {
    const b = this.#bounds();
    const w = this.clientWidth;
    const h = this.clientHeight;
    if (!b.width || !b.height || !w || !h) return { x: w / 2, y: h / 2, zoom: 1 };
    const zoom = clampZoom(Math.min(1, (w - FIT_PADDING * 2) / b.width, (h - FIT_PADDING * 2) / b.height));
    return { zoom, x: (w - b.width * zoom) / 2 - b.x * zoom, y: (h - b.height * zoom) / 2 - b.y * zoom };
  }

  #zoomed(zoom: number, at: { x: number; y: number } | undefined, from: CanvasView): CanvasView {
    const z = clampZoom(zoom);
    const p = at ?? { x: this.clientWidth / 2, y: this.clientHeight / 2 };
    const k = z / from.zoom;
    return { zoom: z, x: p.x - (p.x - from.x) * k, y: p.y - (p.y - from.y) * k };
  }

  #goal: CanvasView | null = null;
  #target = () => this.#goal ?? this.#view;

  #animate(to: CanvasView) {
    cancelAnimationFrame(this.#animation);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return this.#set(to);
    const from = { ...this.#view };
    this.#goal = to;
    let start: number | undefined;
    const step = (now: number) => {
      start ??= now;
      const t = Math.min(1, (now - start) / ANIMATION_MS);
      const e = 1 - (1 - t) ** 3;
      const zoom = Math.exp(Math.log(from.zoom) + (Math.log(to.zoom) - Math.log(from.zoom)) * e);
      const s = from.zoom === to.zoom ? e : (zoom - from.zoom) / (to.zoom - from.zoom);
      this.#apply({ zoom, x: from.x + (to.x - from.x) * s, y: from.y + (to.y - from.y) * s });
      if (t < 1) this.#animation = requestAnimationFrame(step);
      else this.#goal = null;
    };
    this.#animation = requestAnimationFrame(step);
  }

  #set(view: CanvasView) {
    cancelAnimationFrame(this.#animation);
    this.#goal = null;
    this.#apply(view);
  }

  #apply(view: CanvasView) {
    this.#view = { ...view, zoom: clampZoom(view.zoom) };
    if (!this.#frame) this.#frame = requestAnimationFrame(() => this.#render());
  }

  #render() {
    this.#frame = 0;
    const { x, y, zoom } = this.#view;
    this.#layer.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
    const grid = 24 * zoom;
    this.#viewport.style.setProperty("--grid", `${grid}px`);
    this.#viewport.style.setProperty("--grid-x", `${x % grid}px`);
    this.#viewport.style.setProperty("--grid-y", `${y % grid}px`);
    const text = `${Math.round(zoom * 100)}%`;
    if (this.#readout.value !== text) this.#readout.value = text;
    this.dispatchEvent(new CustomEvent("canvas-view", { detail: this.view }));
    this.#cull();
  }

  #cull() {
    const { width, height } = this.#size;
    if (!width || !height) return;
    const { x, y, zoom } = this.#view;
    const left = (-width * NEAR_MARGIN - x) / zoom;
    const top = (-height * NEAR_MARGIN - y) / zoom;
    const right = (width * (1 + NEAR_MARGIN) - x) / zoom;
    const bottom = (height * (1 + NEAR_MARGIN) - y) / zoom;
    const entered: string[] = [];
    const gone = new Set(this.#near);
    for (const [id, { item }] of this.#items) {
      const near =
        item.x < right && item.x + item.width > left && item.y - LABEL_SPACE < bottom && item.y + item.height > top;
      if (!near) continue;
      gone.delete(id);
      if (this.#near.has(id)) continue;
      this.#near.add(id);
      entered.push(id);
    }
    for (const id of gone) this.#near.delete(id);
    if (!entered.length && !gone.size) return;
    const detail: CanvasNear = { entered, left: [...gone], zoom };
    this.dispatchEvent(new CustomEvent("canvas-near", { detail }));
  }

  #local(e: { clientX: number; clientY: number }) {
    const r = this.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  #onBackground(e: PointerEvent) {
    const t = e.composedPath()[0];
    return t === this.#viewport || t === this.#layer || t === this.#overlay;
  }

  #onPointerDown = (e: PointerEvent) => {
    const middle = e.button === 1;
    if (!middle && e.button !== 0) return;
    if (!middle && !this.#space && !this.#onBackground(e)) return;
    e.preventDefault();
    this.#viewport.focus({ preventScroll: true });
    this.#viewport.setPointerCapture(e.pointerId);
    this.#pointers.set(e.pointerId, this.#local(e));
    cancelAnimationFrame(this.#animation);
    this.#goal = null;
    if (this.#pointers.size === 2) {
      this.#drag = null;
      this.#pinch = this.#pinchOf();
    } else {
      this.#drag = { id: e.pointerId, ...this.#local(e) };
    }
    this.toggleAttribute("panning", true);
  };

  #pinchOf() {
    const [a, b] = [...this.#pointers.values()] as [{ x: number; y: number }, { x: number; y: number }];
    return { distance: Math.hypot(a.x - b.x, a.y - b.y) || 1, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  }

  #onPointerMove = (e: PointerEvent) => {
    if (!this.#pointers.has(e.pointerId)) return;
    const p = this.#local(e);
    this.#pointers.set(e.pointerId, p);
    if (this.#pinch && this.#pointers.size >= 2) {
      const next = this.#pinchOf();
      const zoomed = this.#zoomed(this.#view.zoom * (next.distance / this.#pinch.distance), next, this.#view);
      this.#apply({ ...zoomed, x: zoomed.x + next.x - this.#pinch.x, y: zoomed.y + next.y - this.#pinch.y });
      this.#pinch = next;
      return;
    }
    if (!this.#drag || this.#drag.id !== e.pointerId) return;
    this.#apply({ ...this.#view, x: this.#view.x + p.x - this.#drag.x, y: this.#view.y + p.y - this.#drag.y });
    this.#drag = { id: e.pointerId, ...p };
  };

  #onPointerUp = (e: PointerEvent) => {
    if (!this.#pointers.delete(e.pointerId)) return;
    if (this.#viewport.hasPointerCapture(e.pointerId)) this.#viewport.releasePointerCapture(e.pointerId);
    this.#pinch = null;
    const [rest] = [...this.#pointers];
    this.#drag = rest ? { id: rest[0], ...rest[1] } : null;
    if (!this.#pointers.size) this.toggleAttribute("panning", false);
  };

  #onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? this.clientHeight : 1;
    if (e.ctrlKey || e.metaKey) {
      const factor = Math.exp((-e.deltaY * unit) / 300);
      this.#set(this.#zoomed(this.#view.zoom * factor, this.#local(e), this.#view));
      return;
    }
    const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
    const dy = e.shiftKey && !e.deltaX ? 0 : e.deltaY;
    this.#set({ ...this.#view, x: this.#view.x - dx * unit, y: this.#view.y - dy * unit });
  };

  #onGestureStart = (e: Event) => {
    e.preventDefault();
    this.#gestureScale = 1;
  };

  #onGestureChange = (e: Event) => {
    const g = e as GestureEvent;
    e.preventDefault();
    const factor = g.scale / this.#gestureScale;
    this.#gestureScale = g.scale;
    this.#set(this.#zoomed(this.#view.zoom * factor, this.#local(g), this.#view));
  };

  #onKeyDown = (e: KeyboardEvent) => {
    if (e.target !== this.#viewport || e.altKey || e.ctrlKey || e.metaKey) return;
    const step = e.shiftKey ? PAN_STEP * 4 : PAN_STEP;
    const pans: Record<string, [number, number]> = {
      ArrowLeft: [step, 0],
      ArrowRight: [-step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    };
    const pan = pans[e.key];
    if (pan) {
      const t = this.#target();
      this.#animate({ ...t, x: t.x + pan[0], y: t.y + pan[1] });
    } else if (e.key === "+" || e.key === "=") this.zoomBy(STEP);
    else if (e.key === "-" || e.key === "_") this.zoomBy(1 / STEP);
    else if (e.key === "0") this.reset();
    else if (e.key === "1") this.fit();
    else return;
    e.preventDefault();
  };

  #onSpaceDown = (e: KeyboardEvent) => {
    if (e.code !== "Space" || editable(e.composedPath()[0] ?? null)) return;
    const target = e.composedPath()[0];
    if (target instanceof HTMLButtonElement) return;
    e.preventDefault();
    if (this.#space) return;
    this.#space = true;
    this.toggleAttribute("pan-ready", true);
  };

  #onSpaceUp = (e: KeyboardEvent) => {
    if (e.code !== "Space") return;
    this.#space = false;
    this.toggleAttribute("pan-ready", false);
  };

  #onBlur = () => {
    this.#space = false;
    this.toggleAttribute("pan-ready", false);
  };
}

if (!customElements.get("explode-canvas")) customElements.define("explode-canvas", ExplodeCanvas);

declare global {
  interface HTMLElementTagNameMap {
    "explode-canvas": ExplodeCanvas;
  }
}
