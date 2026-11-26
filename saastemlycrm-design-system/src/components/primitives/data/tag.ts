import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { inlineRow } from "../../../styles/algebra.ts";
import { iconSvg, type IconName } from "../media/icon.ts";

export const tag = rcva(`${inlineRow} items-center gap-1 rounded-sm align-middle`, {
  variants: {
    hue: {
      "0": "bg-chart-1/20 text-on-surface",
      "1": "bg-chart-2/20 text-on-surface",
      "2": "bg-chart-3/20 text-on-surface",
      "3": "bg-chart-4/20 text-on-surface",
      "4": "bg-chart-5/20 text-on-surface",
      "5": "bg-chart-6/20 text-on-surface",
    },
    tone: {
      neutral: "bg-surface-container-high text-on-surface-variant",
      primary: "bg-primary-container text-on-primary-container",
      info: "bg-info-container text-on-info-container",
      success: "bg-success-container text-on-success-container",
      warning: "bg-warning-container text-on-warning-container",
      error: "bg-error-container text-on-error-container",
    },
    variant: {
      soft: "",
      outline: "border border-current/25 bg-transparent!",
    },
    size: {
      sm: "min-h-5 px-1.5 py-0.5 text-label-md",
      md: "min-h-6 px-2 py-0.5 text-label-lg",
    },
  },
  defaultVariants: { tone: "neutral", variant: "soft", size: "sm" },
});
export const tagText = rcva("min-w-0 [overflow-wrap:break-word] [text-wrap:balance]");

export type TagVariants = VariantProps<typeof tag>;
export type Tone = NonNullable<TagVariants["tone"]>;
export const TONES: readonly Tone[] = ["neutral", "primary", "info", "success", "warning", "error"];

@customElement("ui-tag")
export class UiTag extends LightElement {
  @property() tone: TagVariants["tone"];
  @property() variant: TagVariants["variant"];
  @property() size: TagVariants["size"];
  @property() icon?: IconName;
  @property() label = "";
  @property({ type: Number }) hue?: number;

  render() {
    const hue = this.hue === undefined ? undefined : (String(((this.hue % 6) + 6) % 6) as "0");
    return html`<span class=${tag({ tone: hue ? undefined : this.tone, hue, variant: this.variant, size: this.size })}
      >${this.icon ? iconSvg(this.icon, { size: "xs" }) : nothing}<span class=${tagText()}
        >${this.hasContent ? this.content : this.label}</span
      ></span
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-tag": UiTag;
  }
}
