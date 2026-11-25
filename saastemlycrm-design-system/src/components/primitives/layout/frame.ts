import { cssTime } from "../../base/css-time.ts";
import { tileH, tileW } from "../../base/tiles.ts";
import type { VariantProps } from "class-variance-authority";
import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { backdrop } from "./algebra.ts";
import { button } from "../actions/button.ts";
import { iconButton } from "../actions/icon-button.ts";
import { iconSvg, type IconName } from "../media/icon.ts";
import { menuFoldTween, type MenuFoldTween } from "../navigation/menu.ts";
import { motion } from "../../base/motion-queue.ts";
import { m } from "../../../i18n/index.ts";

export const appShellLayer = rcva("pointer-events-none absolute", {
  variants: {
    kind: {
      live: "-z-10 inset-0 overflow-hidden [--clips:media] text-on-surface-variant",
      backdrop: "-z-10 inset-0 frame-liquid",
      shell: "-z-10 inset-0 frame-matte",
    },
  },
});

export const appShell = rcva(
  "group/shell @container/frame relative isolate grid h-dvh [--main-radius:var(--radius-lg)] grid grid-rows-[repeat(var(--frame-quarter-rows,12),calc(var(--tile-h)/4))_minmax(0,1fr)] grid-cols-[repeat(4,calc(var(--tile-w)/4))_var(--frame-slack,0px)_repeat(var(--frame-inner-quarters,16),calc(var(--tile-w)/4))_var(--frame-slack,0px)_repeat(4,var(--frame-end-quarter,calc(var(--tile-w)/4)))] overflow-hidden [--clips:frame] " +
    backdrop +
    " text-on-surface",
  {
    variants: {
      settling: { true: "[&_*]:transition-none!" },
      compact: { true: "[--frame-gap:0px]" },
    },
  },
);

export const appShellHeader = rcva(
  "[grid-area:1/1/5/-1] w-full grid grid-cols-subgrid grid-rows-[var(--frame-header)] min-h-(--frame-header) items-center",
);
export const appShellHeaderStart = rcva(
  "[grid-row:1] [grid-column:1/span_4] @min-[40rem]/frame:[grid-column:1/span_16] flex flex-row flex-wrap max-w-full min-w-0 items-center gap-1",
);
export const appShellBrand = rcva(
  "w-fit gap-2 rounded-full ps-[calc((var(--frame-rail)_-_2rem)/2)] pe-3 min-w-0 [overflow-wrap:anywhere] text-title-md tracking-tight",
);
export const appShellBrandName = rcva("@max-[40rem]/frame:sr-only");
export const appShellBrandMark = rcva("grid size-8 place-items-center rounded-full bg-primary/15 text-primary");
export const appShellSearch = rcva(
  "[grid-row:1] [grid-column:6/span_4] @min-[40rem]/frame:[grid-column:18/-18] @container w-full flex flex-row flex-wrap max-w-full min-w-0 justify-center",
);
export const appShellSearchBox = rcva("w-full max-w-[calc(8*var(--tile-w))] grid justify-items-center");
export const appShellActions = rcva(
  "[grid-row:1] [grid-column:6/var(--frame-actions-end,-1)] justify-self-end grid grid-flow-col auto-cols-(--tile-w) justify-items-center items-center @max-[27rem]/frame:[&>[data-fold]]:hidden @min-[27rem]/frame:[&>[data-fold-only]]:hidden",
);

export const appShellLift = rcva("relative", {
  variants: {
    side: { start: "", end: "" },
    lifted: { true: "z-50 [transition:z-index_0s]", false: "z-auto" },
  },
  compoundVariants: [
    {
      side: "start",
      lifted: false,
      class:
        "[transition:z-index_0s_allow-discrete_var(--duration-spatial)] group-data-[start-groups-open]/shell:[transition:z-index_0s_allow-discrete_calc(var(--settle-spatial)_+_var(--duration-spatial))]",
    },
    {
      side: "end",
      lifted: false,
      class:
        "[transition:z-index_0s_allow-discrete_var(--duration-spatial)] group-data-[end-groups-open]/shell:[transition:z-index_0s_allow-discrete_calc(var(--settle-spatial)_+_var(--duration-spatial))]",
    },
  ],
});

export const appShellColumn = rcva(
  "group/column flex min-h-0 shrink-0 flex-col transition-[width] ease-spatial duration-(--duration-spatial) motion-reduce:transition-none",
  {
    variants: {
      side: {
        start: "[grid-area:5/1/-2/5] group-data-[drag-start]/shell:transition-none",
        end: "[grid-area:5/-5/-2/-1] justify-self-end group-data-[drag-end]/shell:transition-none",
      },
      push: {
        true: "delay-0",
        false: "delay-0 data-[groups-open]:delay-(--settle-spatial) data-[drag]:delay-0!",
      },
      merged: { true: "w-0!", false: "" },
    },
    compoundVariants: [
      { side: "start", push: false, class: "w-[calc(var(--frame-rail)_+_var(--drag-start,0px))]" },
      { side: "end", push: false, class: "w-[calc(var(--frame-rail)_+_var(--drag-end,0px))]" },
      { side: "start", push: true, class: "w-[calc(var(--frame-nav)_+_var(--drag-start-o,0px))]" },
      { side: "end", push: true, class: "w-[calc(var(--frame-aside)_+_var(--drag-end-o,0px))]" },
    ],
  },
);

export const appShellPanel = rcva(
  "flex h-full min-h-0 flex-col gap-0 overflow-hidden [--clips:frame] border-transparent px-[calc((var(--frame-rail)_-_2.75rem)/2)] motion-reduce:transition-none",
  {
    variants: {
      side: {
        start: "-ms-(--frame-edge) border-s-(length:--frame-edge) group-data-[drag-start]/shell:transition-none",
        end: "-me-(--frame-edge) border-e-(length:--frame-edge) group-data-[drag-end]/shell:transition-none",
      },
      open: { true: "", false: "" },
      sheet: { true: "", false: "" },
      merged: { true: "", false: "" },
    },
    compoundVariants: [
      { merged: true, open: false, class: "invisible" },
      {
        sheet: false,
        class:
          "w-[calc(100%_+_var(--frame-edge))] transition-[padding] ease-spatial duration-(--duration-spatial) delay-0 group-data-[groups-open]/column:delay-(--settle-spatial) group-data-[drag]/column:delay-0!",
      },
      { sheet: true, open: false, class: "w-[calc(var(--frame-rail)_+_var(--frame-edge))]" },
      {
        sheet: true,
        open: true,
        class:
          "fixed inset-y-0 z-40 max-w-full liquid-glass pt-(--frame-header) pb-1 shadow-elevation-1 [transition:width_var(--duration-spatial)_var(--ease-spatial),position_0s_allow-discrete,z-index_0s_allow-discrete]",
      },
      {
        sheet: true,
        open: true,
        side: "start",
        class: "start-0 ms-0 w-[calc(var(--frame-nav)_+_var(--frame-edge))] rounded-e-xl-increased",
      },
      {
        sheet: true,
        open: true,
        side: "end",
        merged: false,
        class: "end-0 me-0 w-[calc(var(--frame-aside)_+_var(--frame-edge))] rounded-s-xl-increased",
      },
      {
        sheet: true,
        open: true,
        side: "end",
        merged: true,
        class: "start-0 ms-0 w-[calc(var(--frame-aside)_+_var(--frame-edge))] rounded-e-xl-increased",
      },
      {
        sheet: true,
        open: false,
        class:
          "[transition:all_0s_allow-discrete_var(--duration-spatial),width_var(--duration-spatial)_var(--ease-spatial)_0s] group-data-[groups-open]/column:[transition:all_0s_allow-discrete_calc(var(--settle-spatial)_+_var(--duration-spatial)),width_var(--duration-spatial)_var(--ease-spatial)_var(--settle-spatial)]",
      },
    ],
  },
);

export const appShellWell = rcva("[grid-row:1/-3] flex flex-col relative min-h-0");

export const appShellMain = rcva(
  "@container/main w-full min-h-0 flex-1 overflow-x-clip overflow-y-auto overscroll-contain py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-(--main-radius)",
  { variants: { compact: { true: "rounded-s-lg rounded-e-none" } } },
);

export const appShellLip = rcva("pointer-events-none absolute inset-0 z-10 rounded-(--main-radius) frame-lip", {
  variants: { compact: { true: "rounded-s-lg rounded-e-none" } },
});

export const appShellGlint = rcva("pointer-events-none absolute top-0 start-0 w-screen h-dvh frame-glint");

export const appShellDragHandle = rcva(
  "absolute inset-y-0 z-20 w-4 shrink-0 cursor-col-resize touch-none rounded-full touch-target",
  {
    variants: {
      side: {
        start: "start-0 -translate-x-1/2 rtl:translate-x-1/2",
        end: "end-0 translate-x-1/2 rtl:-translate-x-1/2",
      },
    },
  },
);

export const appShellPage = rcva("");

export const appShellCenter = rcva(
  "[grid-area:5/5/-1/-5] relative grid grid-rows-subgrid grid-cols-[minmax(0,1fr)] min-w-(--main-min) min-h-0 [transition:margin-inline-start_var(--duration-spatial)_var(--ease-spatial)_var(--push-start-delay,0s),margin-inline-end_var(--duration-spatial)_var(--ease-spatial)_var(--push-end-delay,0s)] motion-reduce:transition-none group-data-[drag-start]/shell:transition-none group-data-[drag-end]/shell:transition-none",
  {
    variants: {
      pushStart: {
        true: "ms-[calc(var(--frame-nav)_-_var(--frame-rail)_+_var(--drag-start-o,0px))]",
        false:
          "ms-(--drag-start) group-data-[start-groups-open]/shell:[--push-start-delay:var(--settle-spatial)] data-[drag-start]:[--push-start-delay:initial]!",
      },
      pushEnd: {
        true: "me-[calc(var(--frame-aside)_-_var(--frame-rail)_+_var(--drag-end-o,0px))]",
        false:
          "me-(--drag-end) group-data-[end-groups-open]/shell:[--push-end-delay:var(--settle-spatial)] data-[drag-end]:[--push-end-delay:initial]!",
      },
    },
  },
);

export const appShellPageFooter = rcva(
  "[grid-row:-3/-1] shrink-0 min-w-0 content-center overflow-hidden [--clips:text] [overflow-wrap:anywhere] text-center text-body-sm leading-none opacity-65",
);

export const appShellToggle = rcva("shrink-0 group/toggle my-[calc((var(--tile-h)*0.75_-_2.5rem)/2)]", {
  variants: {
    column: { start: "ms-0.5", end: "me-0.5 self-end" },
  },
});

export const appShellBackdrop = rcva(
  "fixed inset-0 z-30 bg-scrim/32 transition-opacity ease-effects duration-(--duration-effects) starting:opacity-0 motion-reduce:transition-none",
);

export const appShellFooter = rcva(
  "flex flex-col justify-center gap-1 ps-1 h-(--tile-h) min-h-(--tile-h) max-h-(--tile-h) overflow-y-clip [--clips:text] [&>*>*+*]:[transition:opacity_var(--duration-effects)_var(--ease-effects)_var(--settle-spatial)] [&>*>*+*]:starting:opacity-0 motion-reduce:[&>*>*+*]:[transition:none]",
);

export const appShellRailGroups = rcva("grid min-h-0 flex-1 [&>*]:[grid-area:1/1]");

export const appShellRailGroup = rcva("flex min-h-0 flex-col gap-3 motion-reduce:transition-none!", {
  variants: {
    shown: {
      true: "translate-x-0 opacity-100 [transition:translate_var(--duration-spatial)_var(--ease-spatial),opacity_var(--duration-effects)_var(--ease-effects),visibility_0s]",
      false:
        "invisible pointer-events-none opacity-0 [transition:translate_var(--duration-spatial)_var(--ease-spatial),opacity_var(--duration-effects)_var(--ease-effects),visibility_0s_var(--duration-spatial)]",
    },
    place: { start: "", end: "" },
  },
  compoundVariants: [
    { shown: false, place: "start", class: "-translate-x-full rtl:translate-x-full" },
    { shown: false, place: "end", class: "translate-x-full rtl:-translate-x-full" },
  ],
});

export const appShellSlot = rcva("flex min-h-0 w-full flex-col gap-[calc(var(--tile-h)*0.25)]", {
  variants: {
    hidden: { true: "hidden" },
    scroll: {
      true: "flex-1 overflow-x-hidden overflow-y-auto overscroll-contain py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    },
  },
});

export const appShellNavList = rcva("motion-reduce:transition-none", {
  variants: {
    side: {
      start:
        "data-[drag-done]:[transition:none]! data-[drag]:[&_[data-menu-fold]]:transition-none! data-[drag]:[&_summary]:after:transition-none! data-[drag]:visible data-[drag]:[--menu-collapse:0] data-[drag]:[--menu-expanded:0] data-[drag]:[transition:none]! data-[drag]:[&_details::details-content]:[block-size:0]! data-[drag]:[&_li]:grow-0! w-[calc(var(--frame-nav)_-_var(--frame-rail)_+_2.75rem)]! max-w-none",
      end: "data-[drag-done]:[transition:none]! data-[drag]:[&_[data-menu-fold]]:transition-none! data-[drag]:[&_summary]:after:transition-none! data-[drag]:visible data-[drag]:[--menu-collapse:0] data-[drag]:[--menu-expanded:0] data-[drag]:[transition:none]! data-[drag]:[&_details::details-content]:[block-size:0]! data-[drag]:[&_li]:grow-0! w-[calc(var(--frame-aside)_-_var(--frame-rail)_+_2.75rem)]! max-w-none",
    },
    state: {
      shown: `[--clips:fold] visible [--menu-collapse:0] [--menu-expanded:1] [transition:visibility_0s,--menu-collapse_0s_var(--settle-spatial),--menu-expanded_0s_var(--settle-spatial)] [&_li>details>ul]:overflow-hidden [&_li>details>ul]:transition-[block-size] [&_li>details>ul]:duration-(--duration-spatial) [&_li>details>ul]:ease-spatial [&_li>details>ul]:delay-(--settle-spatial) [&_li>details>ul]:starting:[block-size:0] motion-reduce:[&_li>details>ul]:transition-none`,
      hidden: `[--clips:fold] invisible [--menu-collapse:1] [--menu-expanded:0] [transition:visibility_0s_var(--settle-spatial),--menu-collapse_0s,--menu-expanded_0s] group-data-[groups-open]/column:[transition:visibility_0s_calc(var(--settle-spatial)_*_2),--menu-collapse_0s_var(--settle-spatial),--menu-expanded_0s] [&_li>details>ul]:overflow-hidden [&_li>details>ul]:[block-size:0] [&_li>details>ul]:transition-[block-size] [&_li>details>ul]:duration-(--duration-spatial) [&_li>details>ul]:ease-spatial [&_li>details>ul]:delay-0 motion-reduce:[&_li>details>ul]:transition-none`,
    },
  },
});
export const appShellNavRail = rcva(
  "transition-[visibility] duration-0 motion-reduce:delay-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  {
    variants: {
      side: {
        start: "data-[drag]:invisible data-[drag]:[transition:none] data-[drag-done]:[transition:none]!",
        end: "data-[drag]:invisible data-[drag]:[transition:none] data-[drag-done]:[transition:none]!",
      },
      state: {
        shown:
          "visible delay-(--settle-spatial) group-data-[groups-open]/column:delay-[calc(var(--settle-spatial)_*_2)]",
        hidden: "invisible delay-0",
      },
    },
  },
);

export const appShellStack = rcva("grid w-full min-h-0 grid-cols-[minmax(0,1fr)] [&>*]:[grid-area:1/1]", {
  variants: {
    fill: { true: "flex-1 grid-rows-[minmax(0,1fr)]" },
  },
});

for (const [name, initialValue] of [
  ["--frame-rail", "48px"],
  ["--frame-gap", "2px"],
  ["--frame-edge", "2px"],
] as const) {
  try {
    CSS.registerProperty({ name, syntax: "<length>", inherits: true, initialValue });
  } catch {}
}

for (const [name, syntax, initialValue] of [
  ["--drag-start", "<length>", "0px"],
  ["--drag-end", "<length>", "0px"],
  ["--drag-start-o", "<length>", "0px"],
  ["--drag-end-o", "<length>", "0px"],
  ["--push-start-delay", "<time>", "0s"],
  ["--push-end-delay", "<time>", "0s"],
] as const) {
  try {
    CSS.registerProperty({ name, syntax, inherits: false, initialValue });
  } catch {}
}

export type FrameColumnVariants = VariantProps<typeof appShellColumn>;

export type PageTransition = "top-level" | "forward" | "backward" | "lateral-forward" | "lateral-backward";

@customElement("ui-frame")
export class UiFrame extends LightElement {
  @property() scrim = "";
  @property() windowScrim = "";
  @property({ attribute: false }) background: Renderable = nothing;
  @property({ type: Boolean }) settling = false;
  @property({ type: Number }) cols = 6;
  @property({ type: Boolean }) compact = false;

  render() {
    return html`<div
      data-frame
      class=${appShell({ settling: this.settling, compact: this.compact })}
      style=${styleMap({
        "--app-scrim": this.scrim || undefined,
        "--app-window-scrim": this.windowScrim || undefined,
        "--frame-cols": String(this.cols),
        "--frame-slack": `max(0px, calc((100vw - ${this.cols} * var(--tile-w)) / 2))`,
        "--frame-pad-x":
          "calc(var(--frame-slack) + clamp(0px, (var(--tile-w) / 2 - 0.01px - var(--frame-slack)) * 10000, var(--tile-w) / 2))",
        "--frame-inner-quarters": String(4 * Math.max(1, this.cols - (this.compact ? 1 : 2))),
        "--frame-end-quarter": this.compact ? "0px" : undefined,
        "--frame-actions-end": this.compact ? "-6" : undefined,
      })}
    >
      ${
        this.background === nothing || !this.background
          ? nothing
          : html`<div class=${appShellLayer({ kind: "live" })} aria-hidden="true" data-frame-layer data-frame-live>
              ${this.background}
            </div>`
      }
      <div class=${appShellLayer({ kind: "backdrop" })} aria-hidden="true" data-frame-layer data-frame-backdrop></div>
      <div class=${appShellLayer({ kind: "shell" })} aria-hidden="true" data-frame-layer data-frame-shell></div>
      ${this.content}
    </div>`;
  }

  #window: HTMLElement | null = null;
  #sizes = new ResizeObserver(() => this.#cut());

  watchWindow(window: HTMLElement) {
    this.#window = window;
    this.#sizes.observe(window);
    this.#cut();
  }

  protected firstUpdated() {
    this.#sizes.observe(this.querySelector("[data-frame]")!);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#sizes.disconnect();
  }

  #cut() {
    const frame = this.querySelector<HTMLElement>("[data-frame]");
    const shell = this.querySelector<HTMLElement>("[data-frame-shell]");
    const backdrop = this.querySelector<HTMLElement>("[data-frame-backdrop]");
    const window = this.#window;
    if (!frame || !shell) return;
    if (!window?.isConnected) {
      shell.style.clipPath = "";
      if (backdrop) backdrop.style.clipPath = "";
      return;
    }
    const f = frame.getBoundingClientRect();
    const r = window.getBoundingClientRect();
    const c = getComputedStyle(window);
    const [tl, tr, br, bl] = [
      c.borderTopLeftRadius,
      c.borderTopRightRadius,
      c.borderBottomRightRadius,
      c.borderBottomLeftRadius,
    ].map((v) => Math.min(parseFloat(v) || 0, r.width / 2, r.height / 2));
    const n = (v: number) => Math.round(v * 100) / 100;
    const tile = tileH(parseFloat(getComputedStyle(document.documentElement).fontSize) / 16);
    frame.style.setProperty("--frame-quarter-rows", String(4 * Math.max(3, Math.floor(f.height / tile + 1e-6))));
    const [x, y, w, h] = [r.left - f.left, r.top - f.top, r.width, r.height].map(n);
    const hole =
      `M${n(x + tl!)} ${y}H${n(x + w - tr!)}A${tr} ${tr} 0 0 1 ${n(x + w)} ${n(y + tr!)}` +
      `V${n(y + h - br!)}A${br} ${br} 0 0 1 ${n(x + w - br!)} ${n(y + h)}` +
      `H${n(x + bl!)}A${bl} ${bl} 0 0 1 ${x} ${n(y + h - bl!)}V${n(y + tl!)}A${tl} ${tl} 0 0 1 ${n(x + tl!)} ${y}Z`;
    shell.style.clipPath = `path("${hole}")`;
    if (backdrop) backdrop.style.clipPath = `path(evenodd, "M0 0H${n(f.width)}V${n(f.height)}H0Z${hole}")`;
  }
}

@customElement("ui-frame-header")
export class UiFrameHeader extends LightElement {
  @property() brand: Renderable = "";
  @property({ attribute: "brand-href" }) brandHref?: string;
  @property({ attribute: "brand-icon" }) brandIcon?: IconName;
  @property({ type: Boolean, attribute: "lift-start" }) liftStart = false;
  @property({ type: Boolean, attribute: "lift-end" }) liftEnd = false;

  render() {
    const brand = this.brand
      ? html`<a class=${button({ variant: "text", class: appShellBrand() })} href=${ifDefined(this.brandHref)}
          >${this.brandIcon ? html`<span class=${appShellBrandMark()}>${iconSvg(this.brandIcon, { size: "md" })}</span>` : nothing}<span
            class=${appShellBrandName()}
            >${this.brand}</span
          ></a
        >`
      : nothing;
    return html`<header class=${appShellHeader()} data-frame-region>
      <div class=${appShellHeaderStart({ class: appShellLift({ side: "start", lifted: this.liftStart }) })}>
        ${brand} ${this.slotted("start")}
      </div>
      <div class=${appShellSearch({ class: appShellLift({ side: "start", lifted: this.liftStart }) })}>
        <div class=${appShellSearchBox()}>${this.slotted("search")}</div>
      </div>
      <div class=${appShellActions({ class: appShellLift({ side: "end", lifted: this.liftEnd }) })}>
        ${this.slotted("actions")}
      </div>
    </header>`;
  }
}

const listFolds = new WeakMap<Element, MenuFoldTween>();
const columnFolds = new WeakSet<MenuFoldTween>();

@customElement("ui-frame-column")
export class UiFrameColumn extends LightElement {
  @property() side: "start" | "end" = "start";
  @state() private _groupsOpen = false;
  #onToggle = () => {
    const open = !!this.querySelector("details[open]");
    if (open !== this._groupsOpen) this._groupsOpen = open;
    this.closest("[data-frame]")?.toggleAttribute(`data-${this.side}-groups-open`, open);
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("toggle", this.#onToggle, true);
    queueMicrotask(this.#onToggle);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("toggle", this.#onToggle, true);
  }
  @property() label = "";
  @property({ type: Boolean }) open = false;
  @property({ type: Boolean }) sheet = false;
  @property({ attribute: "list-slot" }) listSlot = "list";
  @property({ attribute: "rail-slot" }) railSlot = "rail";
  @property({ attribute: "footer-slot" }) footerSlot = "footer";
  @property({ attribute: false }) railNodes?: Node[];
  @property({ attribute: false }) extraRailNodes?: Node[];
  @property({ attribute: "rail-view" }) railView: "own" | "extra" = "own";
  @property({ attribute: "extra-label" }) extraLabel = "";
  @property({ type: Boolean }) merged = false;

  prepareSheet() {
    const panel = this.querySelector("[data-frame-panel]");
    if (!panel) return;
    void getComputedStyle(panel).width;
    for (const a of panel.getAnimations())
      if (a instanceof CSSTransition && a.transitionProperty === "width") a.finish();
  }

  private _ask(open: boolean) {
    this.dispatchEvent(new CustomEvent("ui-column-toggle", { detail: { open } }));
  }

  protected updated(changed: PropertyValues<this>) {
    if (changed.has("open") && changed.get("open") !== undefined) this.#fold(this.open);
  }

  #fold(open: boolean) {
    const list = this.querySelector<HTMLElement>("[data-frame-list]");
    const rail = this.querySelector<HTMLElement>("[data-frame-rail]");
    const panel = this.querySelector<HTMLElement>("[data-frame-panel]");
    const region = this.querySelector<HTMLElement>("[data-frame-region]");
    if (!list || !rail || !panel || !region) return;
    const current = listFolds.get(list);
    if (list.hasAttribute("data-drag") && !(current && columnFolds.has(current))) return;
    current?.cancel();
    listFolds.delete(list);
    if (!open && this._groupsOpen) {
      list.removeAttribute("data-drag");
      rail.removeAttribute("data-drag");
      return;
    }
    list.setAttribute("data-drag", "");
    rail.setAttribute("data-drag", "");
    const tile = tileW(parseFloat(getComputedStyle(document.documentElement).fontSize) / 16);
    const from = (panel.getBoundingClientRect().width - tile) / (3 * tile);
    const fold = menuFoldTween(list);
    fold.seek(from);
    listFolds.set(list, fold);
    columnFolds.add(fold);
    const spring = [region, panel]
      .flatMap((el) => el.getAnimations())
      .find((a) => a instanceof CSSTransition && a.transitionProperty === "width");
    if (spring) fold.follow(spring, open ? 1 : 0);
    else fold.seek(open ? 1 : 0);
    if (spring) void motion.input([spring]);
    void (async () => {
      await spring?.finished.catch(() => undefined);
      if (listFolds.get(list) !== fold) return;
      const swap = open ? [] : [list, rail];
      for (const el of swap) el.setAttribute("data-drag-done", "");
      list.removeAttribute("data-drag");
      rail.removeAttribute("data-drag");
      await new Promise((r) => requestAnimationFrame(r));
      for (const el of swap) el.removeAttribute("data-drag-done");
      const settling = list.getAnimations({ subtree: true }).filter((a) => a instanceof CSSTransition);
      await Promise.all(settling.map((a) => a.finished.catch(() => undefined)));
      if (listFolds.get(list) === fold) {
        fold.cancel();
        listFolds.delete(list);
      }
    })();
  }

  render() {
    const { side, open, sheet, merged } = this;
    const what = this.label.toLowerCase();
    const extra = !!this.extraRailNodes?.length;
    const showExtra = extra && this.railView === "extra";
    const switches = extra && !open;
    const toggle = switches
      ? html`<button
          type="button"
          class=${iconButton({ class: appShellToggle({ column: side }) })}
          aria-label=${m.frame_show_icons({ what: showExtra ? what : this.extraLabel.toLowerCase() })}
          @click=${() => this.dispatchEvent(new CustomEvent("ui-rail-switch", { detail: { view: showExtra ? "own" : "extra" } }))}
        >
          ${iconSvg("swap", { size: "md" })}
        </button>`
      : html`<button
          type="button"
          class=${iconButton({ class: appShellToggle({ column: merged ? "start" : side }) })}
          aria-label=${open ? m.frame_collapse({ what }) : m.frame_expand({ what })}
          aria-expanded=${open ? "true" : "false"}
          @click=${() => this._ask(!open)}
        >
          ${iconSvg(side === "start" ? "menu" : "menu-panel", { size: "md" })}
        </button>`;
    const panel = html`<div class=${appShellPanel({ side, open, sheet, merged })} data-frame-panel>
      ${toggle}
      <div class=${appShellStack({ fill: true })}>
        <div
          class=${appShellSlot({ scroll: true, class: appShellNavList({ side, state: open ? "shown" : "hidden" }) })}
          data-frame-list
        >
          ${this.slotted(this.listSlot)}
        </div>
        <div
          class=${appShellSlot({ scroll: true, class: appShellNavRail({ side, state: open ? "hidden" : "shown" }) })}
          data-frame-rail
        >
          ${
            extra
              ? html`<div class=${appShellRailGroups()}>
                  <div class=${appShellRailGroup({ shown: !showExtra, place: "start" })} ?inert=${showExtra}>
                    ${this.railNodes ?? this.slotted(this.railSlot)}
                  </div>
                  <div class=${appShellRailGroup({ shown: showExtra, place: "end" })} ?inert=${!showExtra}>
                    ${this.extraRailNodes}
                  </div>
                </div>`
              : (this.railNodes ?? this.slotted(this.railSlot))
          }
        </div>
      </div>
      ${this.hasSlotted(this.footerSlot) ? html`<div class=${appShellFooter()}>${this.slotted(this.footerSlot)}</div>` : nothing}
    </div>`;
    const column =
      side === "start"
        ? html`<nav
            class=${appShellColumn({ side, push: open && !sheet, merged })}
            aria-label=${this.label}
            data-frame-region
            ?data-groups-open=${this._groupsOpen}
          >
            ${panel}
          </nav>`
        : html`<aside
            class=${appShellColumn({ side, push: open && !sheet, merged })}
            aria-label=${this.label}
            data-frame-region
            ?data-groups-open=${this._groupsOpen}
          >
            ${panel}
          </aside>`;
    return html`${column}${open && sheet ? html`<div class=${appShellBackdrop()} @click=${() => this._ask(false)}></div>` : nothing}`;
  }
}

const motionTokens = new Map<string, string>();

const SLIDE = 30;

@customElement("ui-frame-main")
export class UiFrameMain extends LightElement {
  @property({ type: Boolean }) compact = false;
  @property({ type: Boolean, attribute: "push-start" }) pushStart = false;
  @property({ type: Boolean, attribute: "push-end" }) pushEnd = false;
  #pageAnimation?: Animation;

  pageTransition(kind: PageTransition) {
    const page = this.querySelector("main > div");
    if (!(page instanceof HTMLElement)) return;
    const token = (name: string) => {
      let v = motionTokens.get(name);
      if (v === undefined)
        motionTokens.set(name, (v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()));
      return v;
    };
    const ms = (name: string) => cssTime(token(name));
    const rtl = (this.closest("[dir]")?.getAttribute("dir") ?? document.dir) === "rtl" ? -1 : 1;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = (x: number) => `${x * rtl}px 0`;
    const [keyframes, options]: [Keyframe[], KeyframeAnimationOptions] = reduce
      ? [[{ opacity: 0 }, { opacity: 1 }], { duration: ms("--duration-short4"), easing: token("--ease-standard") }]
      : kind === "top-level"
        ? [
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: ms("--duration-medium1"), easing: token("--ease-emphasized-decelerate") },
          ]
        : kind === "forward" || kind === "backward"
          ? [
              [
                { opacity: 0, translate: from(kind === "forward" ? SLIDE : -SLIDE) },
                { opacity: 1, offset: 0.35 },
                { opacity: 1, translate: "0 0" },
              ],
              { duration: ms("--duration-medium2"), easing: token("--ease-emphasized-decelerate") },
            ]
          : [
              [{ translate: from(kind === "lateral-forward" ? SLIDE * 4 : -SLIDE * 4) }, { translate: "0 0" }],
              { duration: ms("--duration-medium2"), easing: token("--ease-emphasized-decelerate") },
            ];
    this.#pageAnimation?.cancel();
    this.#pageAnimation = page.animate(keyframes, options);
    void motion.input([this.#pageAnimation]);
  }

  #springs() {
    const frame = this.#frame();
    const boxes = [
      this.querySelector<HTMLElement>(":scope > div"),
      ...(frame?.querySelectorAll<HTMLElement>("[data-frame-region]:is(nav, aside), [data-frame-panel]") ?? []),
    ];
    return boxes
      .flatMap((el) => el?.getAnimations() ?? [])
      .filter((a): a is CSSTransition => a instanceof CSSTransition && /^(?:width|margin)/.test(a.transitionProperty));
  }

  protected updated(changed: PropertyValues<this>) {
    const moved = (k: "pushStart" | "pushEnd") => changed.has(k) && changed.get(k) !== undefined;
    if (!moved("pushStart") && !moved("pushEnd")) return;
    requestAnimationFrame(() => this.#expect());
  }

  #expect() {
    const springs = this.#springs();
    const settled = motion.input(springs);
    const center = this.querySelector<HTMLElement>(":scope > div");
    let delta = 0;
    let timing: { until: number; duration: number; easing: string } | undefined;
    const now = center ? getComputedStyle(center) : undefined;
    for (const a of springs) {
      if ((a.effect as KeyframeEffect | null)?.target !== center || !a.transitionProperty.startsWith("margin"))
        continue;
      const t = (a.effect as KeyframeEffect).getTiming();
      const at = Number(a.currentTime ?? 0);
      const wait = Number(t.delay ?? 0) - at;
      timing = {
        until: performance.now() + Math.max(0, wait),
        duration: Number(t.duration ?? 0) + Math.min(0, wait),
        easing: t.easing ?? "ease",
      };
      const frames = (a.effect as KeyframeEffect).getKeyframes();
      const end = parseFloat(
        String(Object.entries(frames.at(-1) ?? {}).find(([k]) => k.startsWith("margin"))?.[1] ?? 0),
      );
      const from = parseFloat(now?.getPropertyValue(a.transitionProperty) ?? "") || 0;
      delta += end - from;
    }
    if (!delta) return;
    type Expecting = HTMLElement & { expectWidth?: (d: number, s: Promise<unknown>, t?: typeof timing) => void };
    for (const board of this.querySelectorAll<Expecting>("main > div ui-board"))
      if (!board.parentElement?.closest("ui-board")) board.expectWidth?.(delta, settled, timing);
  }

  @property({ attribute: "start-label" }) startLabel = "";
  @property({ attribute: "end-label" }) endLabel = "";

  #drag?: { side: "start" | "end"; x: number; open: boolean; dx: number; id: number };

  #folds: Partial<Record<"start" | "end", MenuFoldTween>> = {};

  #span() {
    return 3 * tileW(parseFloat(getComputedStyle(document.documentElement).fontSize) / 16);
  }

  #frame() {
    return this.closest("[data-frame]") as HTMLElement | null;
  }

  #targets(side: "start" | "end") {
    const column = this.#frame()?.querySelector<HTMLElement>(
      side === "start" ? "nav[data-frame-region]" : "aside[data-frame-region]",
    );
    return {
      column,
      center: this.querySelector<HTMLElement>(":scope > div"),
      list: column?.querySelector<HTMLElement>("[data-frame-list]") ?? null,
    };
  }

  #listDrag(side: "start" | "end", on: boolean) {
    const { column, center } = this.#targets(side);
    for (const el of column?.querySelectorAll("[data-frame-list], [data-frame-rail]") ?? [])
      el.toggleAttribute("data-drag", on);
    column?.toggleAttribute("data-drag", on);
    center?.toggleAttribute(`data-drag-${side}`, on);
  }

  #set(side: "start" | "end", name: string, value: string | null) {
    const t = this.#targets(side);
    for (const el of [t.column, t.center]) {
      if (value === null) el?.style.removeProperty(name);
      else el?.style.setProperty(name, value);
    }
  }

  #open(side: "start" | "end") {
    return side === "start" ? this.pushStart : this.pushEnd;
  }

  #ask(side: "start" | "end", open: boolean) {
    this.dispatchEvent(new CustomEvent("ui-frame-drag", { detail: { side, open }, bubbles: true, composed: true }));
  }

  #down = (side: "start" | "end", e: PointerEvent) => {
    if (e.button !== 0) return;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    this.#drag = { side, x: e.clientX, open: this.#open(side), dx: 0, id: e.pointerId };
    this.#frame()?.setAttribute(`data-drag-${side}`, "");
    this.#listDrag(side, true);
    this.#folds[side]?.cancel();
    const list = this.#targets(side).list;
    if (list) listFolds.get(list)?.cancel();
    const fold = list ? menuFoldTween(list) : undefined;
    fold?.seek(this.#open(side) ? 1 : 0);
    this.#folds[side] = fold;
    if (list && fold) listFolds.set(list, fold);
    (e.currentTarget as HTMLElement).setAttribute("data-dragging", "");
  };

  #move = (e: PointerEvent) => {
    const d = this.#drag;
    if (!d || e.pointerId !== d.id) return;
    const rtl = getComputedStyle(this).direction === "rtl" ? -1 : 1;
    const raw = (e.clientX - d.x) * rtl * (d.side === "start" ? 1 : -1);
    const span = this.#span();
    d.dx = d.open ? Math.min(0, Math.max(-span, raw)) : Math.min(span, Math.max(0, raw));
    this.#set(d.side, `--drag-${d.side}${d.open ? "-o" : ""}`, `${d.dx}px`);
    this.#folds[d.side]?.seek((d.open ? span + d.dx : d.dx) / span);
  };

  #up = (e: PointerEvent) => {
    const d = this.#drag;
    if (!d || e.pointerId !== d.id) return;
    this.#drag = undefined;
    (e.currentTarget as HTMLElement).removeAttribute("data-dragging");
    const half = this.#span() / 2;
    const open = d.open ? d.dx > -half : d.dx > half;
    const frame = this.#frame();
    const name = `--drag-${d.side}${d.open ? "-o" : ""}`;
    frame?.removeAttribute(`data-drag-${d.side}`);
    if (open !== d.open) this.#set(d.side, name, `${d.open ? -this.#span() : this.#span()}px`);
    else this.#set(d.side, name, null);
    const fold = this.#folds[d.side];
    const handBack = async () => {
      const swap = open
        ? []
        : [...(this.#targets(d.side).column?.querySelectorAll("[data-frame-list], [data-frame-rail]") ?? [])];
      for (const el of swap) el.setAttribute("data-drag-done", "");
      this.#listDrag(d.side, false);
      this.#set(d.side, name, null);
      const list = this.#targets(d.side).list;
      await new Promise((r) => requestAnimationFrame(r));
      for (const el of swap) el.removeAttribute("data-drag-done");
      const settling = (list?.getAnimations({ subtree: true }) ?? []).filter((a) => a instanceof CSSTransition);
      await Promise.all(settling.map((a) => a.finished.catch(() => undefined)));
      if (this.#folds[d.side] === fold) {
        fold?.cancel();
        delete this.#folds[d.side];
        if (list && listFolds.get(list) === fold) listFolds.delete(list);
      }
    };
    if (open !== d.open) this.#ask(d.side, open);
    const column = frame?.querySelector<HTMLElement>(
      d.side === "start" ? "nav[data-frame-region]" : "aside[data-frame-region]",
    );
    const widthMoves = () =>
      (column?.getAnimations() ?? []).filter((a) => a instanceof CSSTransition && a.transitionProperty === "width");
    const spring = widthMoves()[0];
    if (spring) fold?.follow(spring, open ? 1 : 0);
    else fold?.seek(open ? 1 : 0);
    void (async () => {
      for (let i = 0; i < 2; i++) await new Promise((r) => requestAnimationFrame(r));
      const moving = widthMoves();
      if (this.#folds[d.side] === fold && moving[0] && moving[0] !== spring) fold?.follow(moving[0], open ? 1 : 0);
      await Promise.all(moving.map((a) => a.finished.catch(() => undefined)));
      if (this.#drag?.side !== d.side) await handBack();
    })();
  };

  #key = (side: "start" | "end", e: KeyboardEvent) => {
    const rtl = getComputedStyle(this).direction === "rtl";
    const toward = (side === "start") !== rtl ? "ArrowRight" : "ArrowLeft";
    const away = toward === "ArrowRight" ? "ArrowLeft" : "ArrowRight";
    const open = this.#open(side);
    if (e.key === "Enter" || e.key === " ") this.#ask(side, !open);
    else if (e.key === toward && !open) this.#ask(side, true);
    else if (e.key === away && open) this.#ask(side, false);
    else return;
    e.preventDefault();
  };

  #handle(side: "start" | "end") {
    const label = side === "start" ? this.startLabel : this.endLabel;
    const open = this.#open(side);
    return html`<div
      class=${appShellDragHandle({ side })}
      role="separator"
      aria-orientation="vertical"
      tabindex="0"
      aria-label=${
        label
          ? open
            ? m.frame_resize_to_close({ what: label.toLowerCase() })
            : m.frame_resize_to_open({ what: label.toLowerCase() })
          : m.frame_resize()
      }
      aria-valuemin="0"
      aria-valuemax="1"
      aria-valuenow=${open ? 1 : 0}
      title=${
        label
          ? open
            ? m.frame_drag_to_close({ what: label.toLowerCase() })
            : m.frame_drag_to_open({ what: label.toLowerCase() })
          : ""
      }
      @pointerdown=${(e: PointerEvent) => this.#down(side, e)}
      @mousedown=${(e: MouseEvent) => e.preventDefault()}
      @pointermove=${this.#move}
      @pointerup=${this.#up}
      @pointercancel=${this.#up}
      @keydown=${(e: KeyboardEvent) => this.#key(side, e)}
    ></div>`;
  }

  protected firstUpdated() {
    const main = this.querySelector("main");
    const frame = this.closest("ui-frame") as UiFrame | null;
    if (main && frame) frame.watchWindow(main);
  }

  render() {
    return html`<div class=${appShellCenter({ pushStart: this.pushStart, pushEnd: this.pushEnd })}>
      <div class=${appShellWell()}>
        <main class=${appShellMain({ compact: this.compact })}>
          <div class=${appShellPage()}>${this.slotted()}</div>
        </main>
        <div class=${appShellLip({ compact: this.compact })} aria-hidden="true" data-frame-lip>
          <div class=${appShellGlint()}></div>
        </div>
      </div>
      ${this.hasSlotted("footer") ? html`<footer class=${appShellPageFooter()} data-frame-region>${this.slotted("footer")}</footer>` : nothing}
      ${this.#handle("start")} ${this.compact ? nothing : this.#handle("end")}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-frame": UiFrame;
    "ui-frame-header": UiFrameHeader;
    "ui-frame-column": UiFrameColumn;
    "ui-frame-main": UiFrameMain;
  }
}
