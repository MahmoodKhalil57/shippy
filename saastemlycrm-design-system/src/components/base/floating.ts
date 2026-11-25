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

export interface FloatOptions {
  placement?: Placement;
  fallbacks?: Placement[];
  gap?: number;
  anchor?: () => ReferenceElement | null | undefined;
}

const BREAKPOINT_REM: Record<string, number> = { sm: 40, md: 48, lg: 64, xl: 80, "2xl": 96 };
export function atBreakpoint(bp: string): boolean {
  const max = bp.startsWith("max-");
  const rem = BREAKPOINT_REM[max ? bp.slice(4) : bp];
  if (rem == null) return true;
  return matchMedia(max ? `(width < ${rem}rem)` : `(width >= ${rem}rem)`).matches;
}

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

export function placementOf(side?: string | null, align?: string | null): Placement {
  const s = atWidth(side) ?? "bottom";
  const a = atWidth(align) ?? "start";
  const sideOk = s === "top" || s === "bottom" || s === "left" || s === "right" ? s : "bottom";
  return (a === "center" ? sideOk : `${sideOk}-${a === "end" ? "end" : "start"}`) as Placement;
}

const ORIGIN: Record<string, string> = { top: "bottom", bottom: "top", left: "right", right: "left" };
const originOf = (placement: Placement) => {
  const [side, align] = placement.split("-") as [string, string | undefined];
  const across = side === "top" || side === "bottom";
  const along =
    align === "start" ? (across ? "left" : "top") : align === "end" ? (across ? "right" : "bottom") : "center";
  return across ? `${along} ${ORIGIN[side]}` : `${ORIGIN[side]} ${along}`;
};

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

export const floating = directive(FloatDirective);
