// The `~icons` module types (../../../icons.d.ts) travel with this file into apps that compile it.
// oxlint-disable-next-line typescript/triple-slash-reference
/// <reference path="../../../icons.d.ts" />
import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { ref } from "lit/directives/ref.js";
import { holdIcon } from "../../base/icon-motion.ts";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { inlineRow } from "../layout/algebra.ts";
import type { IconName } from "./icon-names.ts";
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
import iSwap from "~icons/line-md/arrows-horizontal";
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
import iCopy from "~icons/material-symbols-light/content-copy-outline";
import iThumbUp from "~icons/material-symbols-light/thumb-up-outline";
import iThumbDown from "~icons/material-symbols-light/thumb-down-outline";
import iRetry from "~icons/material-symbols-light/refresh-rounded";
import iEdit from "~icons/material-symbols-light/edit-outline";
import iStop from "~icons/material-symbols-light/stop-rounded";
import iExternal from "~icons/material-symbols-light/open-in-new";
import iArrowDown from "~icons/material-symbols-light/arrow-downward-rounded";
import iArrowUp from "~icons/material-symbols-light/arrow-upward-rounded";
import iFilter from "~icons/material-symbols-light/filter-list-rounded";
import iColumns from "~icons/material-symbols-light/view-column-outline-rounded";
import iTable from "~icons/material-symbols-light/table-rows-outline-rounded";
import iThinking from "~icons/material-symbols-light/neurology-outline";
import iTool from "~icons/material-symbols-light/build-outline";
import iBlock from "~icons/material-symbols-light/block";
import iGlobe from "~icons/material-symbols-light/language";
import iMic from "~icons/material-symbols-light/mic-outline";
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
export const icon = rcva("inline-block", {
  variants: {
    size: {
      xs: "size-3 shrink-0",
      sm: "size-4 shrink-0",
      md: "size-5 shrink-0",
      lg: "size-6 shrink-0",
      xl: "size-8 shrink-0",
      "2xl": "size-10 shrink-0",
      em: "size-[1.2em] shrink-0",
    },
    color: {
      current: "",
      "base-content": "text-on-surface",
      muted: "text-on-surface-variant",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      neutral: "text-neutral",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
    },
    /**
     * Pops in with a turn when it appears, on M3's expressive fast spatial spring (it bounces):
     * for an icon that changes with a state (render a new one, e.g. with `keyed`, to replay it).
     */
    pop: {
      true: "[transition:scale_var(--duration-spatial-fast)_var(--ease-spatial-fast),rotate_var(--duration-spatial-fast)_var(--ease-spatial-fast),opacity_var(--duration-effects-fast)_var(--ease-effects-fast)] starting:-rotate-90 starting:scale-40 starting:opacity-0 motion-reduce:transition-none",
    },
  },
  defaultVariants: { size: "md", color: "current" },
});

/** Wrapper for an authored `<svg>`: sizes the SVG to the icon box. */
export const iconSlot = rcva(`${inlineRow} items-center justify-center *:size-full`);

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
  /** Swap one thing for another, side to side (a rail's two icon groups). */
  swap: iSwap,
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
  copy: iCopy,
  "thumb-up": iThumbUp,
  "thumb-down": iThumbDown,
  retry: iRetry,
  edit: iEdit,
  stop: iStop,
  external: iExternal,
  "arrow-down": iArrowDown,
  "arrow-up": iArrowUp,
  filter: iFilter,
  columns: iColumns,
  table: iTable,
  thinking: iThinking,
  tool: iTool,
  block: iBlock,
  globe: iGlobe,
  mic: iMic,
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
} as const satisfies Record<IconName, unknown>;

export type { IconName };

/**
 * A named icon as an SVG template, for use inside other primitives. `label` makes it an image
 * with an accessible name; otherwise it's decorative. `class` replaces the size/colour recipe
 * when a primitive sizes its icons itself.
 */
/** Icon copies rendered so far, for unique ids inside icons. */
let iconCopies = 0;

export function iconSvg(name: IconName, variants: IconVariants = {}, opts: { label?: string; class?: string } = {}) {
  const { viewBox, body, animated } = ICONS[name];
  const uid = `icon-${++iconCopies}`; // unique ids inside this copy (see plugins/icons.ts)
  return html`<svg
    class=${opts.class ?? icon(variants)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox=${viewBox}
    role=${opts.label ? "img" : nothing}
    aria-label=${ifDefined(opts.label)}
    aria-hidden=${opts.label ? nothing : "true"}
    ${animated ? ref(holdIcon) : nothing}
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
  /** Pop in with a turn when it appears (see the `pop` variant). */
  @property({ type: Boolean }) pop = false;

  render() {
    if (this.name && this.name in ICONS) {
      return iconSvg(this.name, { size: this.size, color: this.color, pop: this.pop }, { label: this.label });
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
