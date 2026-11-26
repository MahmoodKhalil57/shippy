import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { m } from "../../../lib/i18n/index.ts";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { inlineRow } from "../../../styles/algebra.ts";

export const badge = rcva(`${inlineRow} items-center justify-center rounded-full align-middle tabular-nums`, {
  variants: {
    kind: {
      count: "h-4 min-w-4 px-1 text-label-sm wrap-normal",
      dot: "size-1.5 shrink-0",
    },
    tone: {
      neutral: "",
      primary: "",
      info: "",
      success: "",
      warning: "",
      error: "",
    },
  },
  compoundVariants: [
    { kind: "count", tone: "neutral", class: "bg-surface-container-highest text-on-surface" },
    { kind: "count", tone: "primary", class: "bg-primary text-primary-content" },
    { kind: "count", tone: "info", class: "bg-info-container text-on-info-container" },
    { kind: "count", tone: "success", class: "bg-success-container text-on-success-container" },
    { kind: "count", tone: "warning", class: "bg-warning-container text-on-warning-container" },
    { kind: "count", tone: "error", class: "bg-error text-error-content" },
    { kind: "dot", tone: "neutral", class: "bg-outline" },
    { kind: "dot", tone: "primary", class: "bg-primary" },
    { kind: "dot", tone: "info", class: "bg-info" },
    { kind: "dot", tone: "success", class: "bg-success" },
    { kind: "dot", tone: "warning", class: "bg-warning" },
    { kind: "dot", tone: "error", class: "bg-error" },
  ],
  defaultVariants: { kind: "count", tone: "neutral" },
});

export type BadgeVariants = VariantProps<typeof badge>;

@customElement("ui-badge")
export class UiBadge extends LightElement {
  @property({ type: Number }) count?: number;
  @property({ type: Number }) max = 99;
  @property({ type: Boolean, attribute: "show-zero" }) showZero = false;
  @property({ type: Boolean }) dot = false;
  @property() tone: BadgeVariants["tone"];
  @property() label?: string;

  render() {
    if (this.dot)
      return html`<span
        class=${badge({ kind: "dot", tone: this.tone })}
        role="img"
        aria-label=${this.label ?? m.badge_status()}
      ></span>`;
    const n = this.count;
    if (n === undefined || !Number.isFinite(n) || (n === 0 && !this.showZero)) return nothing;
    const text = n > this.max ? `${this.max}+` : String(n);
    return html`<span class=${badge({ kind: "count", tone: this.tone })} aria-label=${this.label ?? text}
      >${text}</span
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-badge": UiBadge;
  }
}
