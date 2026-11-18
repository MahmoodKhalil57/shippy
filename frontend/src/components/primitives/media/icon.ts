import type { VariantProps } from "class-variance-authority";
import { html, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Icon: a sized, coloured inline SVG icon.
 *
 * Purpose: Media & visual effects · Kind: primitive (Shippy, not daisyUI)
 *
 * Built-in outline icons (24×24, `stroke="currentColor"`) for the glyphs the
 * daisyUI docs examples use, or any authored `<svg>` sized by the same
 * variants. `ICON_PATHS` / `iconSvg()` are exported so other primitives can
 * render the same glyphs. Every variant is responsive, e.g. `size="sm md:lg"`.
 */
export const icon = rcva("inline-block shrink-0", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8",
      "2xl": "size-10",
      em: "size-[1.2em]",
    },
    color: {
      current: "",
      "base-content": "text-base-content",
      muted: "text-base-content/70",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      neutral: "text-neutral",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
    },
  },
  defaultVariants: { size: "md", color: "current" },
});

/** Wrapper for an authored `<svg>`: sizes the SVG to the icon box. */
export const iconSlot = rcva("inline-grid place-items-center *:size-full");

export type IconVariants = VariantProps<typeof icon>;

/** Outline icon path data (24×24 viewBox, stroked). */
export const ICON_PATHS = {
  check: "M4.5 12.75l6 6 9-13.5",
  x: "M6 18 18 6M6 6l12 12",
  info: "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z",
  warning:
    "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
  error: "M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  success: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  "chevron-down": "M19.5 8.25l-7.5 7.5-7.5-7.5",
  "chevron-left": "M15.75 19.5L8.25 12l7.5-7.5",
  "chevron-right": "M8.25 4.5l7.5 7.5-7.5 7.5",
  menu: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5",
  search: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  sun: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z",
  moon: "M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z",
  home: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
  settings:
    "M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75",
  user: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  heart:
    "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
  star: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
  plus: "M12 4.5v15m7.5-7.5h-15",
  minus: "M19.5 12h-15",
  "arrow-left": "M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18",
  "arrow-right": "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3",
  mail: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
  bell: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0",
} as const;

export type IconName = keyof typeof ICON_PATHS;

/**
 * A built-in icon as an SVG template, for use inside other primitives.
 * `label` makes it an image with an accessible name; otherwise it's decorative.
 */
export function iconSvg(
  name: IconName,
  variants: IconVariants = {},
  opts: { label?: string; strokeWidth?: number } = {},
) {
  return html`<svg
    class=${icon(variants)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width=${opts.strokeWidth ?? 1.5}
    role=${opts.label ? "img" : nothing}
    aria-label=${ifDefined(opts.label)}
    aria-hidden=${opts.label ? nothing : "true"}
  >
    ${svg`<path stroke-linecap="round" stroke-linejoin="round" d=${ICON_PATHS[name]} />`}
  </svg>`;
}

/**
 * @example <ui-icon name="check" color="success"></ui-icon>
 * @example <ui-icon name="menu" size="md lg:lg" label="Open menu"></ui-icon>
 * @example <ui-icon size="em"><svg viewBox="0 0 24 24">…</svg></ui-icon>
 *
 * Without `name`, the authored `<svg>` is sized to the icon box.
 */
@customElement("ui-icon")
export class UiIcon extends LightElement {
  @property() name?: IconName;
  @property() size: IconVariants["size"];
  @property() color: IconVariants["color"];
  /** Accessible name; without it the icon is decorative (aria-hidden). */
  @property() label?: string;
  @property({ attribute: "stroke-width", type: Number }) strokeWidth = 1.5;

  render() {
    if (this.name && this.name in ICON_PATHS) {
      return iconSvg(
        this.name,
        { size: this.size, color: this.color },
        { label: this.label, strokeWidth: this.strokeWidth },
      );
    }
    return html`<span
      class=${icon({ size: this.size, color: this.color, class: iconSlot() })}
      role=${this.label ? "img" : nothing}
      aria-label=${ifDefined(this.label)}
      aria-hidden=${this.label ? nothing : "true"}
      >${this.content}</span
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-icon": UiIcon;
  }
}
