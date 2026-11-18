import type { VariantProps } from "class-variance-authority";
import { html, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

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

const BADGE_ICONS: Record<BadgeIconName, { viewBox: string; body: unknown }> = {
  info: {
    viewBox: "0 0 24 24",
    body: svg`<g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></circle><path d="m12,17v-5.5c0-.276-.224-.5-.5-.5h-1.5" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></path><circle cx="12" cy="7.25" r="1.25" fill="currentColor" stroke-width="2"></circle></g>`,
  },
  success: {
    viewBox: "0 0 24 24",
    body: svg`<g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></circle><polyline points="7 13 10 16 17 8" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></polyline></g>`,
  },
  warning: {
    viewBox: "0 0 18 18",
    body: svg`<g fill="currentColor"><path d="M7.638,3.495L2.213,12.891c-.605,1.048,.151,2.359,1.362,2.359H14.425c1.211,0,1.967-1.31,1.362-2.359L10.362,3.495c-.605-1.048-2.119-1.048-2.724,0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><line x1="9" y1="6.5" x2="9" y2="10" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></line><path d="M9,13.569c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Z" fill="currentColor" data-stroke="none" stroke="none"></path></g>`,
  },
  error: {
    viewBox: "0 0 24 24",
    body: svg`<g fill="currentColor"><rect x="1.972" y="11" width="20.056" height="2" transform="translate(-4.971 12) rotate(-45)" fill="currentColor" stroke-width="0"></rect><path d="m12,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Zm0-20C7.038,3,3,7.037,3,12s4.038,9,9,9,9-4.037,9-9S16.962,3,12,3Z" stroke-width="0" fill="currentColor"></path></g>`,
  },
};

/** Render one of the built-in badge icons. */
export const badgeIconSvg = (name: BadgeIconName) =>
  html`<svg class=${badgeIcon()} xmlns="http://www.w3.org/2000/svg" viewBox=${BADGE_ICONS[name].viewBox}>
    ${BADGE_ICONS[name].body}
  </svg>`;

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
    return typeof this.icon === "string" && this.icon in BADGE_ICONS
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
