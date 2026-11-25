import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { atBreakpoint, floating as float, place, placementOf } from "../../base/floating.ts";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, type Breakpoint } from "../../base/variants.ts";
import { floatingFit, floatingHeight, floatMotion, inlineRow, stack, text } from "../layout/algebra.ts";

export const tooltipHost = rcva(inlineRow);
export const tooltipPanel = rcva(
  `${floatingFit["6"]} ${floatingHeight.fit} ${floatMotion} liquid-glass-clear rounded-field px-2 py-1 text-on-surface`,
  {
    variants: {
      variant: {
        plain: `${text.label} pointer-events-none text-body-sm`,
        rich: `${stack} ${text.label} items-start gap-1 rounded-md px-3 py-3 text-start text-body-md text-on-surface-variant`,
      },
      delayed: { true: "open:delay-(--duration-medium2)", false: "" },
    },
    defaultVariants: { variant: "plain", delayed: false },
  },
);
export const tooltipHeading = rcva(`${text.label} text-title-sm text-on-surface`);
export const tooltipText = rcva(text.label);
export type TooltipVariants = { placement?: "top" | "bottom" | "left" | "right"; align?: "start" | "center" | "end" };

type Side = "top" | "bottom" | "left" | "right";
let tipEl: HTMLElement | undefined;
let tipFor: HTMLElement | undefined;
let stopTip: (() => void) | undefined;

const sharedTip = () => {
  if (tipEl) return tipEl;
  tipEl = document.createElement("div");
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

let ids = 0;

@customElement("ui-tooltip")
export class UiTooltip extends LightElement {
  @property() tip: Renderable = "";
  @property() heading: Renderable = "";
  @property() variant: "plain" | "rich" = "plain";
  @property() placement?: string;
  @property() align?: string;
  @property() from?: Breakpoint;

  private _id = `ui-tip-${++ids}`;
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
