import {
  autoUpdate,
  computePosition,
  flip,
  hide,
  offset,
  shift,
  size,
  type Placement,
  type ReferenceElement,
} from "@floating-ui/dom";
import { nothing } from "lit";
import { Directive, directive, PartType, type ElementPart, type PartInfo } from "lit/directive.js";

/**
 * Every floating panel in the design system (a field's help, a menu, a combobox's list, a tile's
 * menu, a chart's tip, a tooltip) is placed by Floating UI (`@floating-ui/dom`), the same way:
 *
 * - **Where:** at its `placement` beside its anchor, `gap` px off it. When that side hasn't the
 *   room, it flips to the opposite side, then to `fallbacks`. It's shifted along its side to stay
 *   8px inside the window, and hidden while its anchor is scrolled out of sight.
 * - **How big:** it may be no bigger than the room on its side (`--float-max-w` / `--float-max-h`,
 *   which `floatingHeight` and `floating` read). `--anchor-w` is its anchor's width, for a list as
 *   wide as its field.
 * - **Growing from its anchor:** `--float-origin` is the edge that touches the anchor, for a
 *   panel's `origin-(--float-origin)` scale-in. `data-placement` says the side it ended up on.
 * - **Kept there:** while it's open, `autoUpdate` follows its anchor through scrolling, resizing and
 *   layout shifts (observers, no polling). Closed, nothing runs.
 *
 * The panel itself is a Popover API popover (`popover`): the top layer, so no box clips it and it
 * rises over everything; Escape and a click outside close it; focus returns to its trigger. The
 * directive only places it: `<div popover ${floating({ placement: "top-start" })}>`. Its anchor is
 * the element whose `popovertarget` names it, or `anchor()` when given.
 */
export interface FloatOptions {
  /** The preferred side and alignment (Floating UI's: `top`, `bottom-start`, `right-end`…). */
  placement?: Placement;
  /** Where to go, in order, when neither the preferred side nor its opposite has the room. */
  fallbacks?: Placement[];
  /** Pixels between the panel and its anchor. */
  gap?: number;
  /** The anchor, when it isn't the element whose `popovertarget` names the panel. */
  anchor?: () => ReferenceElement | null | undefined;
}

/** Tailwind's breakpoints (rem), for a responsive `side` / `align` ("start md:end"). */
const BREAKPOINT_REM: Record<string, number> = { sm: 40, md: 48, lg: 64, xl: 80, "2xl": 96 };
/** Whether the window is at a breakpoint now (`md`: 48rem and up; `max-md`: under 48rem). */
export function atBreakpoint(bp: string): boolean {
  const max = bp.startsWith("max-");
  const rem = BREAKPOINT_REM[max ? bp.slice(4) : bp];
  if (rem == null) return true;
  return matchMedia(max ? `(width < ${rem}rem)` : `(width >= ${rem}rem)`).matches;
}

/** The value of a responsive token list at the window's width now ("start md:end" → "end" from 48rem). */
export function atWidth(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  let out: string | undefined;
  for (const token of value.trim().split(/\s+/)) {
    const i = token.indexOf(":");
    if (i < 0) {
      out ??= token;
      continue;
    }
    const bp = token.slice(0, i);
    const max = bp.startsWith("max-");
    if (BREAKPOINT_REM[max ? bp.slice(4) : bp] == null) continue;
    if (atBreakpoint(bp)) out = token.slice(i + 1);
  }
  return out;
}

/** A side (top / bottom / left / right) and an alignment (start / center / end) as one placement. */
export function placementOf(side?: string | null, align?: string | null): Placement {
  const s = atWidth(side) ?? "bottom";
  const a = atWidth(align) ?? "start";
  const sideOk = s === "top" || s === "bottom" || s === "left" || s === "right" ? s : "bottom";
  return (a === "center" ? sideOk : `${sideOk}-${a === "end" ? "end" : "start"}`) as Placement;
}

/** The edge that touches the anchor, for a scale-in from it. */
const ORIGIN: Record<string, string> = { top: "bottom", bottom: "top", left: "right", right: "left" };
const originOf = (placement: Placement) => {
  const [side, align] = placement.split("-") as [string, string | undefined];
  const across = side === "top" || side === "bottom";
  const along =
    align === "start" ? (across ? "left" : "top") : align === "end" ? (across ? "right" : "bottom") : "center";
  return across ? `${along} ${ORIGIN[side]}` : `${ORIGIN[side]} ${along}`;
};

/**
 * Place `panel` beside `anchor` now and while either moves; returns the stop. The first placing
 * happens before the panel is painted (it's hidden until then), so it never flashes elsewhere.
 */
export function place(anchor: ReferenceElement, panel: HTMLElement, o: FloatOptions = {}): () => void {
  const padding = 8;
  panel.style.visibility = "hidden";
  const update = async () => {
    const { x, y, placement, middlewareData } = await computePosition(anchor, panel, {
      strategy: "fixed",
      placement: o.placement ?? "bottom-start",
      middleware: [
        offset(o.gap ?? 4),
        flip({ padding, fallbackPlacements: o.fallbacks, fallbackStrategy: "initialPlacement" }),
        shift({ padding }),
        size({
          padding,
          apply({ availableWidth, availableHeight, rects }) {
            panel.style.setProperty("--float-max-w", `${Math.max(0, availableWidth)}px`);
            panel.style.setProperty("--float-max-h", `${Math.max(0, availableHeight)}px`);
            panel.style.setProperty("--anchor-w", `${rects.reference.width}px`);
          },
        }),
        hide({ padding }),
      ],
    });
    panel.style.left = `${x}px`;
    panel.style.top = `${y}px`;
    panel.style.setProperty("--float-origin", originOf(placement));
    panel.dataset.placement = placement;
    panel.style.visibility = middlewareData.hide?.referenceHidden ? "hidden" : "";
  };
  return autoUpdate(anchor, panel, update);
}

/** The element whose `popovertarget` names `panel`, in the same tree. */
const triggerOf = (panel: HTMLElement) =>
  panel.id
    ? (panel.getRootNode() as Document | ShadowRoot).querySelector<HTMLElement>(
        `[popovertarget="${CSS.escape(panel.id)}"]`,
      )
    : null;

class FloatDirective extends Directive {
  #panel?: HTMLElement;
  #options: FloatOptions = {};
  #stop?: () => void;

  constructor(part: PartInfo) {
    super(part);
    if (part.type !== PartType.ELEMENT) throw new Error("floating() goes on the popover element itself.");
  }

  render(_options?: FloatOptions) {
    return nothing;
  }

  override update(part: ElementPart, [options]: [FloatOptions?]) {
    this.#options = options ?? {};
    const panel = part.element as HTMLElement;
    if (panel !== this.#panel) {
      this.#panel = panel;
      panel.dataset.floating = "";
      // Before it shows: hidden, so its first frame is already in place. Shown: placed, and kept
      // there until it hides.
      panel.addEventListener("beforetoggle", (e) => {
        if ((e as ToggleEvent).newState === "open") panel.style.visibility = "hidden";
      });
      panel.addEventListener("toggle", (e) => {
        this.#stop?.();
        this.#stop = undefined;
        if ((e as ToggleEvent).newState !== "open") return;
        const anchor = this.#options.anchor?.() ?? triggerOf(panel);
        if (anchor) this.#stop = place(anchor, panel, this.#options);
        else panel.style.visibility = "";
      });
    }
    return nothing;
  }
}

/** Place this popover with Floating UI while it's open (see `FloatOptions`). */
export const floating = directive(FloatDirective);
