import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { card, cardBody, cardLinkIcon } from "../containers/card.ts";
import { fixedWidth, padEnd, row, rowFill, text } from "../layout/algebra.ts";
import { iconSvg } from "../media/icon.ts";
import { tag } from "./tag.ts";

/**
 * Stat: one key figure — what it is, the number, how it moved, a line of context, and its trend
 * (Apple: "gauges" / large-title numerals; M3: display / headline type for numerals).
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * - **Surface:** in a tile it is a tonal cell (a filled surface, no outline), so a row of stats
 *   isn't boxes in a box; `outlined` is for a row that stands on the page itself, each figure a
 *   small card like the tiles around it. `main` tints the one figure the row is about (M3: one
 *   prominent item; at most one per row): the tinted surface re-scopes the colour roles for what
 *   is inside (`surface-tinted`, src/styles/theme.css), so the label, the figure, the chip and
 *   the sparkline read on it without a rule of their own.
 * - **Label:** up to two lines, then cut: "Awaiting internal approval" reads in full in a narrow cell.
 * - **Delta:** `delta` is the change against the previous period ("+21%", "−0.4 d"), drawn as a
 *   chip with an arrow for its direction (`delta-dir`) in the ink of what it means (`delta-tone`):
 *   the arrow and the words say it, never the colour alone (WCAG 1.4.1; HIG Color: "Avoid relying
 *   solely on color to differentiate between objects, indicate interactivity, or communicate
 *   essential information").
 * - **Trend:** a sparkline in the `trend` slot (`<ui-chart kind="spark" slot="trend">`) sits at
 *   the end of the figure's own line, in a 4rem column; where a long figure leaves it no room in a
 *   narrow cell, it goes under the figure.
 * - `tone` colours the value when it means something (overdue, on target), in the tone's readable
 *   ink. With `href` the whole stat opens the list behind it.
 *
 * Cells fill their row's height, so a row of stats reads as one strip.
 */
export const statSurface = rcva("border", {
  variants: {
    surface: {
      tonal: "border-transparent bg-surface-container",
      outlined: "border-outline-variant bg-surface",
      /** The tinted surface itself comes from `data-surface` (src/styles/theme.css). */
      main: "border-transparent",
    },
  },
  defaultVariants: { surface: "tonal" },
});
/** The cell's parts, 4dp apart (the card body's own gap is 8dp). */
export const statBody = rcva("gap-1");
/** The label: two lines before it is cut; clear of the link arrow on a linked stat. */
export const statLabel = rcva(`${text.label} line-clamp-2 text-label-md text-on-surface-variant`, {
  variants: { link: { true: padEnd["6"] } },
});
/** The figure's line: the figure takes the room its digits need, the sparkline its 4rem at the end. */
export const statFigure = rcva(`${row} items-end gap-x-3 gap-y-1`);
export const statValue = rcva(`${text.label} grow tabular-nums`, {
  variants: {
    size: { md: "text-headline-sm", lg: "text-headline-md" },
    tone: {
      neutral: "text-on-surface",
      success: "text-success-ink",
      warning: "text-warning-ink",
      error: "text-error-ink",
      info: "text-info-ink",
      primary: "text-primary-ink",
    },
  },
  defaultVariants: { size: "md", tone: "neutral" },
});
/** The delta chip and the note, on one line when both fit. */
export const statMeta = rcva(`${row} items-center gap-x-2 gap-y-1`);
export const statDelta = rcva("tabular-nums");
/**
 * The chip's words with the arrow inline before them, joined to the first word by a word joiner
 * (U+2060: no line break on either side), so the arrow never sits on a line of its own; the rest of
 * the words wrap after it like any text.
 */
/** U+2060: forbids a line break on either side of it. */
const WORD_JOINER = String.fromCharCode(0x2060);
export const statDeltaText = rcva(`${text.label} [&>svg]:inline [&>svg]:me-1 [&>svg]:align-[-0.125em]`);
export const statNote = rcva(`${text.label} ${rowFill} line-clamp-2 text-body-sm text-on-surface-variant`);
/** The sparkline's column (the trend slot), at the end of the figure's line. */
export const statTrend = rcva(`${fixedWidth["16"]} ms-auto`);

export type StatVariants = VariantProps<typeof statValue>;
/** Which way a figure moved against the previous period. */
export type StatDeltaDir = "up" | "down" | "flat";
/** What that movement means: good news, bad news, or neither. */
export type StatDeltaTone = "neutral" | "success" | "warning" | "error";

const DELTA_ICON = { up: "arrow-up", down: "arrow-down", flat: "minus" } as const;
const DELTA_WORD = { up: "Up", down: "Down", flat: "No change" } as const;

/**
 * @example <ui-stat label="Overdue" .value=${"USD 96,400"} note="2 invoices · oldest 12 days" tone="error"></ui-stat>
 * @example
 * <ui-stat main label="Inquiries" .value=${62} delta="+29%" delta-dir="up" delta-tone="success" note="vs the 4 weeks before">
 *   <ui-chart slot="trend" kind="spark" …></ui-chart>
 * </ui-stat>
 */
@customElement("ui-stat")
export class UiStat extends LightElement {
  @property() label: Renderable = "";
  @property() value: Renderable = "";
  @property() note: Renderable = "";
  @property() tone: StatVariants["tone"];
  /** `lg` for a page's headline figures. */
  @property() size: StatVariants["size"];
  /** The whole stat links to the records behind the figure. */
  @property() href?: string;
  /** The headline figure of its row: the tinted surface. */
  @property({ type: Boolean }) main = false;
  /** On the page itself rather than in a tile: a small outlined card. */
  @property({ type: Boolean }) outlined = false;
  /** The change against the previous period, in words ("+21%", "−0.4 d"). */
  @property() delta = "";
  /** Which way it moved: the chip's arrow. */
  @property({ attribute: "delta-dir" }) deltaDir: StatDeltaDir = "up";
  /** What the movement means: the chip's ink. */
  @property({ attribute: "delta-tone" }) deltaTone: StatDeltaTone = "neutral";

  render() {
    const chip = this.delta
      ? html`<span class=${tag({ tone: this.deltaTone, class: statDelta() })}
          ><span class=${statDeltaText()}
            >${iconSvg(DELTA_ICON[this.deltaDir], { size: "xs" }, { label: DELTA_WORD[this.deltaDir] })}${WORD_JOINER}${this.delta}</span
          ></span
        >`
      : nothing;
    const body = html`<div class=${cardBody({ class: statBody() })}>
      <p class=${statLabel({ link: !!this.href })}>${this.label}</p>
      <div class=${statFigure()}>
        <p class=${statValue({ size: this.size, tone: this.tone })}>${this.value}</p>
        ${this.hasSlotted("trend") ? html`<div class=${statTrend()}>${this.slotted("trend")}</div>` : nothing}
      </div>
      ${
        this.delta || this.note
          ? html`<div class=${statMeta()}>
              ${chip} ${this.note ? html`<p class=${statNote()}>${this.note}</p>` : nothing}
            </div>`
          : nothing
      }
    </div>`;
    const cls = card({
      variant: null,
      size: "sm",
      link: !!this.href,
      class: statSurface({ surface: this.main ? "main" : this.outlined ? "outlined" : "tonal" }),
    });
    const surface = this.main ? "tinted" : nothing;
    return this.href
      ? html`<a href=${this.href} class=${cls} data-surface=${surface}
          >${body}<span class=${cardLinkIcon()} aria-hidden="true">${iconSvg("arrow-right", { size: "sm" })}</span></a
        >`
      : html`<div class=${cls} data-surface=${surface}>${body}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-stat": UiStat;
  }
}
