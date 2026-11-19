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
import iChart from "~icons/material-symbols-light/monitoring";
import iCompass from "~icons/line-md/compass";
import iSparkles from "~icons/material-symbols-light/stars";
import iShield from "~icons/line-md/security";
import iChat from "~icons/material-symbols-light/forum-outline";
import iSend from "~icons/material-symbols-light/send-rounded";
import iAssistant from "~icons/material-symbols-light/smart-toy-outline";
import iCloud from "~icons/material-symbols-light/cloud-outline";
import iDevice from "~icons/material-symbols-light/computer-outline";
import iUnfold from "~icons/material-symbols-light/unfold-more";
import iUpload from "~icons/material-symbols-light/upload";
import iPrint from "~icons/material-symbols-light/print-outline";
import iTranslate from "~icons/material-symbols-light/translate";
import iSync from "~icons/material-symbols-light/cloud-sync-outline";
import iHistory from "~icons/material-symbols-light/history";
import iFlag from "~icons/material-symbols-light/flag";
import iRoute from "~icons/material-symbols-light/route";
import iFile from "~icons/line-md/document";
import iKey from "~icons/material-symbols-light/key-outline";
import iPhone from "~icons/line-md/phone";
import iLink from "~icons/line-md/link";
import iBolt from "~icons/material-symbols-light/bolt-outline";
import iArchive from "~icons/material-symbols-light/archive-outline";
import iAnchor from "~icons/material-symbols-light/anchor";
import iContrast from "~icons/line-md/light-dark";
import iPalette from "~icons/material-symbols-light/palette-outline";
import iWallpaper from "~icons/material-symbols-light/wallpaper";
import iNoImage from "~icons/material-symbols-light/hide-image-outline";
import iPasskey from "~icons/material-symbols-light/passkey";

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
  /** Dashboards and analytics. */
  chart: iChart,
  /** Guided tours. */
  compass: iCompass,
  /** AI: drafted or read by the assistant. */
  sparkles: iSparkles,
  shield: iShield,
  chat: iChat,
  send: iSend,
  assistant: iAssistant,
  cloud: iCloud,
  device: iDevice,
  unfold: iUnfold,
  upload: iUpload,
  print: iPrint,
  translate: iTranslate,
  sync: iSync,
  history: iHistory,
  flag: iFlag,
  route: iRoute,
  file: iFile,
  key: iKey,
  phone: iPhone,
  link: iLink,
  bolt: iBolt,
  archive: iArchive,
  anchor: iAnchor,
  /** Half light, half dark: "follow the system". */
  contrast: iContrast,
  palette: iPalette,
  /** Background image picker. */
  wallpaper: iWallpaper,
  "no-image": iNoImage,
  passkey: iPasskey,
} as const;

export type IconName = keyof typeof ICONS;

/**
 * A named icon as an SVG template, for use inside other primitives. `label` makes it an image
 * with an accessible name; otherwise it's decorative. `class` replaces the size/colour recipe
 * when a primitive sizes its icons itself.
 */
/** Icon copies rendered so far, for unique ids inside icons. */
let iconCopies = 0;

export function iconSvg(name: IconName, variants: IconVariants = {}, opts: { label?: string; class?: string } = {}) {
  const { viewBox, body } = ICONS[name];
  const uid = `icon-${++iconCopies}`; // unique ids inside this copy (see plugins/icons.ts)
  return html`<svg
    class=${opts.class ?? icon(variants)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox=${viewBox}
    role=${opts.label ? "img" : nothing}
    aria-label=${ifDefined(opts.label)}
    aria-hidden=${opts.label ? nothing : "true"}
  >
    ${body(uid)}
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
