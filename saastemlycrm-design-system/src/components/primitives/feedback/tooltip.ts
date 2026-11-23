import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { atBreakpoint, floating as float, place, placementOf } from "../../base/floating.ts";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, type Breakpoint } from "../../base/variants.ts";
import { floatingFit, floatingHeight, floatMotion, inlineRow, stack, text } from "../layout/algebra.ts";

/**
 * Tooltip: a short description of what something is or does, on hover and keyboard focus
 * (M3 tooltips; Apple: help tags).
 *
 * Purpose: Feedback & system status · Kind: primitive
 *
 * Every tooltip is a popover in the top layer (clipped by no scrolling box, a rail included),
 * placed by Floating UI beside what it describes and flipping to stay in the window, in the clear
 * glass of the floating layer:
 *
 * - **Plain** (a few words naming a control, "Bookmark this page"): any element with `data-tip`
 *   gets one, on `data-tip-side` (default `top`). One tip serves the whole page: it moves to
 *   whatever is pointed at or reached with Tab. From the pointer it waits a moment before showing
 *   (a CSS delay: brushing past shows nothing); from the keyboard it shows at once; a press, the
 *   pointer leaving, focus leaving or Escape hides it. Icon buttons (`<ui-icon-button label>`),
 *   a message's actions and icon-only menu items use it. The control's own name is its label, so
 *   the tip isn't announced twice.
 * - **Rich** (`<ui-tooltip variant="rich">`: a title, a sentence or two, at most one action in
 *   `slot="action"`): its own panel, linked to the first focusable child by `aria-describedby`,
 *   which stays open while the pointer or focus is in it, so its action can be reached. Never the
 *   only place important information lives (M3). `<ui-tooltip>` plain does the same for content
 *   that isn't a single control.
 *
 * `placement` / `align` are responsive; `from` makes it a tooltip only from a breakpoint up.
 */
export const tooltipHost = rcva(inlineRow);
export const tooltipPanel = rcva(
  `${floatingFit["6"]} ${floatingHeight.fit} ${floatMotion} liquid-glass-clear rounded-field px-2 py-1 text-on-surface`,
  {
    variants: {
      variant: {
        plain: `${text.label} pointer-events-none text-body-sm`,
        rich: `${stack} ${text.label} items-start gap-1 rounded-md px-3 py-3 text-start text-body-md text-on-surface-variant`,
      },
      /** From the pointer: a moment before it shows (brushing past shows nothing). */
      delayed: { true: "open:delay-(--duration-medium2)", false: "" },
    },
    defaultVariants: { variant: "plain", delayed: false },
  },
);
export const tooltipHeading = rcva(`${text.label} text-title-sm text-on-surface`);
export const tooltipText = rcva(text.label);
export type TooltipVariants = { placement?: "top" | "bottom" | "left" | "right"; align?: "start" | "center" | "end" };

/* ------------------------------------------------------------------ the page's one plain tip */

type Side = "top" | "bottom" | "left" | "right";
let tipEl: HTMLElement | undefined;
let tipFor: HTMLElement | undefined;
let stopTip: (() => void) | undefined;

const sharedTip = () => {
  if (tipEl) return tipEl;
  tipEl = document.createElement("div");
  // A hint (Popover API): it never closes an open menu or dialog, and Escape closes it first.
  tipEl.popover = "hint";
  if (tipEl.popover !== "hint") tipEl.popover = "manual";
  tipEl.setAttribute("role", "tooltip");
  tipEl.dataset.floating = "";
  tipEl.id = "ui-tip";
  document.body.append(tipEl);
  return tipEl;
};

function showTip(target: HTMLElement, fromPointer: boolean) {
  const words = target.dataset.tip;
  if (!words) return;
  const el = sharedTip();
  if (tipFor === target && el.matches(":popover-open")) return;
  hideTip();
  tipFor = target;
  el.className = tooltipPanel({ variant: "plain", delayed: fromPointer });
  el.textContent = words;
  el.showPopover();
  stopTip = place(target, el, { placement: (target.dataset.tipSide as Side | undefined) ?? "top", gap: 6 });
}

function hideTip() {
  stopTip?.();
  stopTip = undefined;
  tipFor = undefined;
  if (tipEl?.matches(":popover-open")) tipEl.hidePopover();
}

const tipTarget = (e: Event) =>
  e.target instanceof Element ? e.target.closest<HTMLElement>("[data-tip]:not([data-tip=''])") : null;

if (typeof document !== "undefined") {
  document.addEventListener("pointerover", (e) => {
    if (e.pointerType === "touch") return;
    const t = tipTarget(e);
    if (t) showTip(t, true);
  });
  document.addEventListener("pointerout", (e) => {
    if (!tipFor) return;
    const to = e.relatedTarget as Node | null;
    if (!to || !tipFor.contains(to)) hideTip();
  });
  document.addEventListener("focusin", (e) => {
    const t = tipTarget(e);
    if (t && e.target instanceof Element && e.target.matches(":focus-visible")) showTip(t, false);
  });
  document.addEventListener("focusout", () => hideTip());
  document.addEventListener("pointerdown", () => hideTip(), true);
  document.addEventListener("keydown", (e) => e.key === "Escape" && hideTip());
}

/* ------------------------------------------------------------------ <ui-tooltip> */

let ids = 0;

/**
 * @example <ui-tooltip tip="Bookmark this page"><ui-button …>…</ui-button></ui-tooltip>
 * @example
 * <ui-tooltip variant="rich" heading="Landed cost" tip="Supplier price plus freight, duty and handling, per unit.">
 *   <ui-link slot="action" href="/globals/pricing-policy">Pricing policy</ui-link>
 *   <ui-text>Landed</ui-text>
 * </ui-tooltip>
 *
 * Children are the trigger.
 */
@customElement("ui-tooltip")
export class UiTooltip extends LightElement {
  @property() tip: Renderable = "";
  @property() heading: Renderable = "";
  @property() variant: "plain" | "rich" = "plain";
  @property() placement?: string;
  @property() align?: string;
  /** Only be a tooltip from this breakpoint up. */
  @property() from?: Breakpoint;

  private _id = `ui-tip-${++ids}`;
  /** Shown by the pointer (a moment's delay) rather than by the keyboard. */
  @state() private _byPointer = false;

  private get _panel() {
    return this.querySelector<HTMLElement>(`#${this._id}`);
  }
  private get _host() {
    return this.querySelector<HTMLElement>("[data-tip-host]");
  }

  #show(byPointer: boolean) {
    if (this.from && !atBreakpoint(this.from)) return;
    this._byPointer = byPointer;
    const panel = this._panel;
    if (panel && !panel.matches(":popover-open")) panel.showPopover();
  }
  #hide = () => {
    const panel = this._panel;
    if (panel?.matches(":popover-open")) panel.hidePopover();
  };
  /** Leaving for somewhere that's neither the trigger nor the panel (a rich tip keeps its action reachable). */
  #leave = (e: PointerEvent | FocusEvent) => {
    const to = e.relatedTarget as Node | null;
    if (to && (this._host?.contains(to) || this._panel?.contains(to))) return;
    this.#hide();
  };

  protected updated() {
    const target = this.querySelector<HTMLElement>(
      "[data-tip-host] :is(a, button, input, select, textarea, [tabindex]):not([role=tooltip] *)",
    );
    if (target && !target.getAttribute("aria-describedby")?.includes(this._id))
      target.setAttribute("aria-describedby", `${target.getAttribute("aria-describedby") ?? ""} ${this._id}`.trim());
  }

  render() {
    const rich = this.variant === "rich";
    return html`<div
      class=${tooltipHost()}
      data-tip-host
      @pointerenter=${(e: PointerEvent) => e.pointerType !== "touch" && this.#show(true)}
      @pointerleave=${this.#leave}
      @focusin=${(e: FocusEvent) => (e.target as Element).matches(":focus-visible") && this.#show(false)}
      @focusout=${this.#leave}
      @keydown=${(e: KeyboardEvent) => e.key === "Escape" && this.#hide()}
    >
      ${this.slotted()}
      <div
        class=${tooltipPanel({ variant: this.variant, delayed: this._byPointer })}
        popover="manual"
        role="tooltip"
        id=${this._id}
        ${float({ placement: placementOf(this.placement ?? "top", this.align ?? "center"), gap: rich ? 2 : 6, anchor: () => this._host })}
        @pointerleave=${this.#leave}
        @focusout=${this.#leave}
      >
        ${rich && this.heading ? html`<span class=${tooltipHeading()}>${this.heading}</span>` : nothing}
        <span class=${tooltipText()}>${this.tip}</span>
        ${rich ? this.slotted("action") : nothing}
      </div>
    </div>`;
  }
}

export type TooltipRecipe = VariantProps<typeof tooltipPanel>;

declare global {
  interface HTMLElementTagNameMap {
    "ui-tooltip": UiTooltip;
  }
}
