import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Badge: Shows the status of specific data.
 *
 * Purpose: Data & metrics · Kind: primitive
 * Docs: https://daisyui.com/components/badge/
 *
 * Inside headings/buttons it scales with the text; an empty badge renders as a dot.
 * All variants are responsive (e.g. `size="sm lg:lg"`).
 */
export const badge = rcva("badge", {
  variants: {
    variant: {
      outline: "badge-outline",
      dash: "badge-dash",
      soft: "badge-soft",
      ghost: "badge-ghost",
    },
    color: {
      neutral: "badge-neutral",
      primary: "badge-primary",
      secondary: "badge-secondary",
      accent: "badge-accent",
      info: "badge-info",
      success: "badge-success",
      warning: "badge-warning",
      error: "badge-error",
    },
    size: {
      xs: "badge-xs",
      sm: "badge-sm",
      md: "badge-md",
      lg: "badge-lg",
      xl: "badge-xl",
    },
  },
});

/** Icon sized to the badge text, as in the docs' "Badge with icon". */
export const badgeIcon = rcva("size-[1em]");

export type BadgeVariants = VariantProps<typeof badge>;

/** The docs' status icons. */
export type BadgeIconName = "info" | "success" | "warning" | "error";
const BADGE_ICON_NAMES: readonly string[] = ["info", "success", "warning", "error"] satisfies BadgeIconName[];

/** Render one of the badge status icons (the system's `info` / `success` / `warning` / `error`). */
export const badgeIconSvg = (name: BadgeIconName) => iconSvg(name, {}, { class: badgeIcon() });

/**
 * @example <ui-badge color="primary" variant="soft" size="sm">New</ui-badge>
 * @example <ui-badge color="success" icon="success">Success</ui-badge>
 * @example <ui-badge color="primary" size="xs"></ui-badge>  (empty dot)
 * @example <ui-badge size="sm lg:lg">Responsive</ui-badge>
 */
@customElement("ui-badge")
export class UiBadge extends LightElement {
  @property() variant: BadgeVariants["variant"];
  @property() color: BadgeVariants["color"];
  @property() size: BadgeVariants["size"];
  /** Leading icon: one of the docs' status icons, or any template (`.icon=${...}`). */
  @property() icon?: BadgeIconName | Exclude<Renderable, string>;
  /** Text label; authored children take precedence. */
  @property() label = "";

  private _icon() {
    if (this.icon == null || this.icon === "") return nothing;
    return typeof this.icon === "string" && BADGE_ICON_NAMES.includes(this.icon as BadgeIconName)
      ? badgeIconSvg(this.icon as BadgeIconName)
      : this.icon;
  }

  render() {
    return html`<span class=${badge({ variant: this.variant, color: this.color, size: this.size })}
      >${this._icon()}${this.hasContent ? this.content : this.label}</span
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-badge": UiBadge;
  }
}
