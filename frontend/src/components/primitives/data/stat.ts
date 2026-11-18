import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { iconSvg, type IconName } from "../media/icon.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { button, type ButtonVariants } from "../actions/button.ts";

/**
 * Stat: Shows numbers and data in a block.
 *
 * Purpose: Data & metrics · Kind: primitive
 * Docs: https://daisyui.com/components/stat/
 *
 * `stats` is the container; each `stat` block has title/value/desc parts, plus
 * an optional figure (icon/avatar) and actions (buttons). All variants are
 * responsive, e.g. the docs' `direction="vertical lg:horizontal"`.
 */
export const stats = rcva("stats", {
  variants: {
    direction: {
      horizontal: "stats-horizontal",
      vertical: "stats-vertical",
    },
    shadow: { true: "shadow" },
    /** Background + border ("With custom colors and button"). */
    surface: { true: "bg-base-100 border border-base-300" },
  },
  defaultVariants: { shadow: true },
});

export const statItem = rcva("stat", {
  variants: {
    centered: { true: "place-items-center" },
  },
});

const textColor = {
  neutral: "text-neutral",
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
} as const;

export const statTitle = rcva("stat-title");
export const statValue = rcva("stat-value", { variants: { color: textColor } });
export const statDesc = rcva("stat-desc", { variants: { color: textColor } });
export const statFigure = rcva("stat-figure", { variants: { color: textColor } });
export const statActions = rcva("stat-actions");
/** Figure icon, as in the docs (`inline-block h-8 w-8 stroke-current`). */
export const statIcon = rcva("inline-block h-8 w-8 stroke-current");
/** Figure avatar, as in the docs. */
export const statAvatar = rcva("avatar", { variants: { online: { true: "avatar-online" } } });
export const statAvatarImage = rcva("w-16 rounded-full");

export type StatVariants = VariantProps<typeof stats>;
export type StatColor = keyof typeof textColor;

/** The docs' stat figures, as system icons. */
const STAT_ICONS = {
  heart: "heart",
  bolt: "bolt",
  info: "info",
  adjustments: "settings",
  archive: "archive",
} as const satisfies Record<string, IconName>;
export type StatIconName = keyof typeof STAT_ICONS;

export interface StatAction {
  label: Renderable;
  color?: ButtonVariants["color"];
  onClick?: () => void;
}

export interface StatEntry {
  heading?: Renderable;
  value: Renderable;
  desc?: Renderable;
  /** Built-in icon name or any template for the side figure. */
  figure?: StatIconName | Exclude<Renderable, string>;
  /** Avatar image for the side figure (docs: "Tasks done"). */
  avatar?: { src: string; alt?: string; online?: boolean };
  valueColor?: StatColor;
  descColor?: StatColor;
  figureColor?: StatColor;
  /** Show the value above the title (as in the docs' avatar example). */
  valueFirst?: boolean;
  /** Small buttons under the value. */
  actions?: StatAction[];
}

/**
 * @example
 * <ui-stat direction="vertical lg:horizontal" .items=${[
 *   { heading: "Total Likes", value: "25.6K", desc: "21% more than last month", figure: "heart", figureColor: "primary", valueColor: "primary" },
 *   { heading: "Tasks done", value: "86%", desc: "31 tasks remaining", descColor: "secondary", valueFirst: true,
 *     avatar: { src: "/a.webp", online: true }, figureColor: "secondary" },
 *   { heading: "Account balance", value: "$89,400", actions: [{ label: "Add funds", color: "success" }] },
 * ]}></ui-stat>
 *
 * Without `items`, authored children (hand-written `stat` blocks) are rendered inside `stats`.
 */
@customElement("ui-stat")
export class UiStat extends LightElement {
  @property({ attribute: false }) items: StatEntry[] = [];
  @property() direction: StatVariants["direction"];
  @property({ converter: responsiveBoolean }) shadow: Responsive<boolean> = true;
  @property({ converter: responsiveBoolean }) surface: Responsive<boolean> = false;
  /** Center the content of every stat block. */
  @property({ converter: responsiveBoolean }) centered: Responsive<boolean> = false;

  private _figure(s: StatEntry) {
    if (s.avatar) {
      return html`<div class=${statAvatar({ online: s.avatar.online })}>
        <div class=${statAvatarImage()}><img alt=${s.avatar.alt ?? ""} src=${s.avatar.src} /></div>
      </div>`;
    }
    if (typeof s.figure === "string" && s.figure in STAT_ICONS) {
      return iconSvg(STAT_ICONS[s.figure as StatIconName], {}, { class: statIcon() });
    }
    return s.figure;
  }

  private _item(s: StatEntry) {
    const title = s.heading !== undefined ? html`<div class=${statTitle()}>${s.heading}</div>` : nothing;
    const value = html`<div class=${statValue({ color: s.valueColor })}>${s.value}</div>`;
    return html`<div class=${statItem({ centered: this.centered })}>
      ${
        s.figure !== undefined || s.avatar
          ? html`<div class=${statFigure({ color: s.figureColor })}>${this._figure(s)}</div>`
          : nothing
      }
      ${s.valueFirst ? html`${value}${title}` : html`${title}${value}`}
      ${s.desc !== undefined ? html`<div class=${statDesc({ color: s.descColor })}>${s.desc}</div>` : nothing}
      ${
        s.actions?.length
          ? html`<div class=${statActions()}>
              ${s.actions.map(
                (a) =>
                  html`<button
                    type="button"
                    class=${button({ size: "xs", color: a.color })}
                    @click=${() => a.onClick?.()}
                  >
                    ${a.label}
                  </button>`,
              )}
            </div>`
          : nothing
      }
    </div>`;
  }

  render() {
    return html`<div class=${stats({ direction: this.direction, shadow: this.shadow, surface: this.surface })}>
      ${this.items.length ? this.items.map((s) => this._item(s)) : this.content}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-stat": UiStat;
  }
}
