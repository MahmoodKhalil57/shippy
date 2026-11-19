import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { inlineRow } from "../layout/algebra.ts";

/**
 * Badge: a count or a dot (M3 badges): how many are waiting, or that something is new or in a
 * state. Not a label — a word or two describing a record is a `<ui-tag>`.
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * - **Count** (`count`): a small pill with a number, after a heading or a navigation item.
 *   Over `max` it reads "99+" (M3: at most 4 characters). Zero shows nothing unless `show-zero`.
 * - **Dot** (`dot`): a 6dp dot (M3's small badge) for "new", or for a row's state at a glance
 *   (`tone`), always with a `label` for assistive tech, since colour alone says nothing.
 * Tones are the tag tones; counts are neutral by default, "needs attention" counts `error`.
 */
export const badge = rcva(`${inlineRow} items-center justify-center rounded-full align-middle tabular-nums`, {
  variants: {
    kind: {
      // A count is at most 4 characters ("99+"): it stays on one line (no break inside it).
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

/**
 * @example <ui-badge .count=${cases.length}></ui-badge>
 * @example <ui-badge tone="error" .count=${unread} max="99"></ui-badge>
 * @example <ui-badge dot tone="warning" label="Needs review"></ui-badge>
 */
@customElement("ui-badge")
export class UiBadge extends LightElement {
  /** The number to show. */
  @property({ type: Number }) count?: number;
  /** Above this, show "max+". */
  @property({ type: Number }) max = 99;
  /** Show a zero count instead of nothing. */
  @property({ type: Boolean, attribute: "show-zero" }) showZero = false;
  /** A dot instead of a number. */
  @property({ type: Boolean }) dot = false;
  @property() tone: BadgeVariants["tone"];
  /** Accessible name (a dot's meaning, or what's counted: "3 unread"). */
  @property() label?: string;

  render() {
    if (this.dot)
      return html`<span
        class=${badge({ kind: "dot", tone: this.tone })}
        role="img"
        aria-label=${this.label ?? this.tone ?? "status"}
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
