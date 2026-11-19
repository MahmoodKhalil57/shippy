import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { iconSvg, type IconName } from "../media/icon.ts";

/**
 * Tag: a short label for a record's state or kind ("Paid", "On hold", "Phase 2", "Supplier").
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * A tag says what something is; it isn't a control and isn't a count (counts and "new" dots are
 * `<ui-badge>`). The `tone` carries meaning, never decoration (Apple: colour sparingly, for status;
 * M3: container colour roles):
 *   neutral   a kind or a fact (the default)       info      in progress, informational
 *   success   done, approved, paid                  warning   waiting, needs attention
 *   error     a problem, blocked, overdue           primary   the app's own emphasis (selected, "you")
 * It's filled with the tone's container colour and its matching ink (src/styles/theme.css), so it
 * reads at AA in every scheme. `variant="outline"` is a quieter neutral label for facts that sit
 * beside status tags (a phase, a type). One label, a few words, sentence case.
 */
export const tag = rcva(
  "inline-flex max-w-full shrink-0 items-center gap-1 rounded-sm align-middle whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "bg-surface-container-high text-on-surface-variant",
        primary: "bg-primary-container text-on-primary-container",
        info: "bg-info-container text-on-info-container",
        success: "bg-success-container text-on-success-container",
        warning: "bg-warning-container text-on-warning-container",
        error: "bg-error-container text-on-error-container",
      },
      /** Outlined, no fill: a quieter label beside status tags, in the tone's ink. */
      variant: {
        soft: "",
        outline: "border border-current/25 bg-transparent!",
      },
      size: {
        sm: "h-5 px-1.5 text-label-md",
        md: "h-6 px-2 text-label-lg",
      },
    },
    defaultVariants: { tone: "neutral", variant: "soft", size: "sm" },
  },
);
/** The text, ending in "…" when the tag is squeezed. */
export const tagText = rcva("min-w-0 truncate");

export type TagVariants = VariantProps<typeof tag>;
export type Tone = NonNullable<TagVariants["tone"]>;
export const TONES: readonly Tone[] = ["neutral", "primary", "info", "success", "warning", "error"];

/**
 * @example <ui-tag tone="success">Paid</ui-tag>
 * @example <ui-tag .tone=${statusColor(bill.status)}>${bill.status}</ui-tag>
 * @example <ui-tag variant="outline">Phase 2</ui-tag>
 * @example <ui-tag tone="warning" icon="warning">Needs review</ui-tag>
 */
@customElement("ui-tag")
export class UiTag extends LightElement {
  @property() tone: TagVariants["tone"];
  @property() variant: TagVariants["variant"];
  @property() size: TagVariants["size"];
  /** A leading icon from the registry (a status icon, a channel…). */
  @property() icon?: IconName;
  /** Text label; authored children take precedence. */
  @property() label = "";

  render() {
    return html`<span class=${tag({ tone: this.tone, variant: this.variant, size: this.size })}
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
