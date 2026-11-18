import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import iCheck from "~icons/line-md/confirm";
import iX from "~icons/line-md/close";
import iInfo from "~icons/material-symbols-light/info-outline";
import iWarning from "~icons/line-md/alert";
import iError from "~icons/line-md/close-circle";
import iSuccess from "~icons/line-md/confirm-circle";
import iChevronDown from "~icons/line-md/chevron-down";
import iChevronLeft from "~icons/line-md/chevron-left";
import iChevronRight from "~icons/line-md/chevron-right";
import iMenu from "~icons/line-md/menu";
import iMenuPanel from "~icons/line-md/menu-fold-left";
import iSearch from "~icons/line-md/search";
import iSun from "~icons/line-md/sunny-outline";
import iMoon from "~icons/line-md/moon";
import iHome from "~icons/line-md/home";
import iSettings from "~icons/material-symbols-light/tune";
import iUser from "~icons/line-md/account";
import iUsers from "~icons/material-symbols-light/group-outline";
import iHeart from "~icons/line-md/heart";
import iStar from "~icons/line-md/star";
import iPlus from "~icons/line-md/plus";
import iMinus from "~icons/line-md/minus";
import iArrowLeft from "~icons/line-md/arrow-left";
import iArrowRight from "~icons/line-md/arrow-right";
import iMail from "~icons/line-md/email";
import iBell from "~icons/line-md/bell";
import iGrid from "~icons/line-md/grid-3";
import iInbox from "~icons/material-symbols-light/inbox-outline";
import iBriefcase from "~icons/line-md/briefcase";
import iTruck from "~icons/material-symbols-light/local-shipping-outline";
import iBanknotes from "~icons/material-symbols-light/payments-outline";
import iCube from "~icons/material-symbols-light/deployed-code-outline";
import iClipboard from "~icons/line-md/clipboard-list";
import iTrendingUp from "~icons/material-symbols-light/trending-up";
import iDatabase from "~icons/material-symbols-light/database-outline";
import iPlay from "~icons/line-md/play";
import iFile from "~icons/line-md/document";
import iKey from "~icons/material-symbols-light/key-outline";
import iPhone from "~icons/line-md/phone";
import iLink from "~icons/line-md/link";
import iBolt from "~icons/material-symbols-light/bolt-outline";
import iArchive from "~icons/material-symbols-light/archive-outline";
import iAnchor from "~icons/material-symbols-light/anchor";

/**
 * Icon: a sized, coloured inline SVG icon.
 *
 * Purpose: Media & visual effects · Kind: primitive (Shippy, not daisyUI)
 *
 * The system's icons, by name (`ICONS`), or any authored `<svg>` sized by the same variants.
 * Every icon comes from an Iconify collection through unplugin-icons (plugins/icons.ts): line-md
 * (animated outline icons, preferred), material-symbols-light, devicon and logos only. Each is
 * imported on its own, so only the icons listed here reach the bundle. `iconSvg()` is exported so
 * other primitives render the same icons. Every variant is responsive, e.g. `size="sm md:lg"`.
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

/** The system's icons, by name. To add one, import it from an allowed collection above. */
export const ICONS = {
  check: iCheck,
  x: iX,
  info: iInfo,
  warning: iWarning,
  error: iError,
  success: iSuccess,
  "chevron-down": iChevronDown,
  "chevron-left": iChevronLeft,
  "chevron-right": iChevronRight,
  menu: iMenu,
  /** Bars with an arrow: opens a side panel. */
  "menu-panel": iMenuPanel,
  search: iSearch,
  sun: iSun,
  moon: iMoon,
  home: iHome,
  settings: iSettings,
  user: iUser,
  users: iUsers,
  heart: iHeart,
  star: iStar,
  plus: iPlus,
  minus: iMinus,
  "arrow-left": iArrowLeft,
  "arrow-right": iArrowRight,
  mail: iMail,
  bell: iBell,
  grid: iGrid,
  inbox: iInbox,
  briefcase: iBriefcase,
  truck: iTruck,
  banknotes: iBanknotes,
  cube: iCube,
  clipboard: iClipboard,
  "trending-up": iTrendingUp,
  database: iDatabase,
  play: iPlay,
  file: iFile,
  key: iKey,
  phone: iPhone,
  link: iLink,
  bolt: iBolt,
  archive: iArchive,
  anchor: iAnchor,
} as const;

export type IconName = keyof typeof ICONS;

/**
 * A named icon as an SVG template, for use inside other primitives. `label` makes it an image
 * with an accessible name; otherwise it's decorative. `class` replaces the size/colour recipe
 * when a primitive sizes its icons itself.
 */
export function iconSvg(name: IconName, variants: IconVariants = {}, opts: { label?: string; class?: string } = {}) {
  const { viewBox, body } = ICONS[name];
  return html`<svg
    class=${opts.class ?? icon(variants)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox=${viewBox}
    role=${opts.label ? "img" : nothing}
    aria-label=${ifDefined(opts.label)}
    aria-hidden=${opts.label ? nothing : "true"}
  >
    ${body}
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

  render() {
    if (this.name && this.name in ICONS) {
      return iconSvg(this.name, { size: this.size, color: this.color }, { label: this.label });
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
