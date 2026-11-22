import type { VariantProps } from "class-variance-authority";
import { styleMap } from "lit/directives/style-map.js";
import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cssTime } from "../../base/css-time.ts";
import { figureAt, readFigure, settle } from "../../base/count-up.ts";
import { motion } from "../../base/motion-queue.ts";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { card, cardBody, cardLinkIcon } from "../containers/card.ts";
import { fixedWidth, padEnd, row, rowFill, rowGrow, rowLine, stack, text } from "../layout/algebra.ts";
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
 * - **Share:** `share` (0 to 1) is the figure's part of a whole or its way to a target, drawn as a
 *   bar under it in the figure's tone (else `chart-1`) with its words (`share-text`, "30% of 10
 *   cases"; else the percentage): a figure is never a number alone. It grows from nothing as it
 *   comes in (a transition from `@starting-style`; none with Reduce motion).
 * - `tone` colours the value when it means something (overdue, on target), in the tone's readable
 *   ink. With `href` the whole stat opens the list behind it.
 *
 * Cells fill their row's height, so a row of stats reads as one strip.
 */
export const statSurface = rcva("border", {
  variants: {
    /** The whole of its tile (a figure that is a widget of its own): its tile's box, clipping the rest. */
    fill: { true: "grow basis-0 min-h-0 overflow-hidden", false: "" },
    /** A filling figure that links: its tile lifts it on hover with its handles (`tileArrange`), not it alone. */
    lift: { true: "hover:translate-y-0!", false: "" },
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
    size: { sm: "grow-0 text-title-lg", md: "text-headline-sm", lg: "text-headline-md" },
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
/**
 * `sm`: the figure on one line, for a tile one row high (a side panel's counters): the label and
 * the note stacked at the start, a line each (cut with "…"), and the figure at the end. No
 * sparkline, no delta chip, no link arrow (the whole cell still links).
 */
export const statDense = rcva(`${row} items-center gap-3`);
/** The label and note: they take what the figure leaves (basis 0, so the row never wraps) and cut the rest. */
export const statDenseText = rcva(`${stack} ${rowLine} gap-0`);
export const statDenseLine = rcva(`${text.label} truncate`, {
  variants: { kind: { label: "text-label-md text-on-surface-variant", note: "text-body-sm text-on-surface-variant" } },
});

/** The share: a track as wide as the cell, filled `--share` of the way in the figure's tone. */
export const statShare = rcva(`${stack} gap-1`);
export const statShareTrack = rcva("h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest");
export const statShareFill = rcva(
  "block h-full w-(--share) max-w-full rounded-full [transition:width_var(--duration-long2)_var(--ease-emphasized-decelerate)] starting:w-0 motion-reduce:transition-none",
  {
    variants: {
      tone: {
        neutral: "bg-chart-1",
        success: "bg-success",
        warning: "bg-warning",
        error: "bg-error",
        info: "bg-info",
        primary: "bg-primary",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);
export const statShareText = rcva(`${text.line} text-label-sm tabular-nums text-on-surface-variant`);

/**
 * A figure that is its tile (`fill`) draws its trend as a band across the tile's foot, as wide as
 * the tile, so the room under the figure is the trend, never empty space.
 */
export const statTrendBand = rcva(`${stack} grow basis-0 min-h-12 w-full pt-2`);

/** The sparkline's column (the trend slot), at the end of the figure's line. */
export const statTrend = rcva(`${fixedWidth["16"]} ms-auto`);

/**
 * A mini figure (`mini`: a side panel's kept widget), two lines in two tiles whatever it holds: its
 * label, cut to one line; then its value and one picture of it taking the rest of the line, the
 * first it has of its sparkline, its share (a track, its words its accessible name) or its change.
 */
export const statMini = rcva(`${stack} @container w-full gap-1`);
export const statMiniLabel = rcva(`${text.line} text-label-md text-on-surface-variant`);
export const statMiniFigure = rcva(`${row} items-center gap-3`);
/** One line, never broken inside ("1.6 / d"); a title size in a panel under 7rem. */
export const statMiniValue = rcva(`${text.line} tabular-nums text-headline-sm @max-[7rem]:text-title-lg`, {
  variants: {
    tone: {
      neutral: "text-on-surface",
      success: "text-success-ink",
      warning: "text-warning-ink",
      error: "text-error-ink",
      info: "text-info-ink",
      primary: "text-primary-ink",
    },
  },
  defaultVariants: { tone: "neutral" },
});
/** What the value leaves of its line: the sparkline, the share's track or the change chip. */
/** Left out in a panel under 7rem, where the value needs the line. */
export const statMiniPicture = rcva(`${rowGrow} ${row} items-center justify-end @max-[7rem]:hidden`);

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
  /** `lg` for a page's headline figures; `sm` the figure on one line (a tile one row high). */
  @property() size: StatVariants["size"];
  /** The whole stat links to the records behind the figure. */
  @property() href?: string;
  /** The headline figure of its row: the tinted surface. */
  @property({ type: Boolean }) main = false;
  /** On the page itself rather than in a tile: a small outlined card. */
  @property({ type: Boolean }) outlined = false;
  /** Fills its tile, whatever it holds (a figure that is a widget of its own). */
  @property({ type: Boolean }) fill = false;
  /** A side panel's mini figure: its label and change on one line, the value and sparkline on the next. */
  @property({ type: Boolean }) mini = false;
  /** The change against the previous period, in words ("+21%", "−0.4 d"). */
  @property() delta = "";
  /** Which way it moved: the chip's arrow. */
  @property({ attribute: "delta-dir" }) deltaDir: StatDeltaDir = "up";
  /** What the movement means: the chip's ink. */
  @property({ attribute: "delta-tone" }) deltaTone: StatDeltaTone = "neutral";
  /** Its part of a whole, or its way to a target: 0 to 1, a bar under the figure. */
  @property({ type: Number }) share?: number;
  /** The share in words ("30% of 10 cases"); else the percentage. */
  @property({ attribute: "share-text" }) shareText = "";
  /** The figure part of the way to `value` while it counts (`count-up.ts`); undefined once there. */
  @state() private _counting?: string;
  /** The number it last showed: a new value counts from it (the first from 0). */
  #shown?: number;
  #frame = 0;

  /**
   * A figure counts to its value as it comes in, and from its old value to a new one: ambient motion
   * (src/components/base/motion-queue.ts), a carrier animation of M3's long duration whose progress
   * each animation frame reads, so the queue can hold it or skip it to the end like any other. None
   * with Reduce motion, and none for a value that isn't a figure.
   */
  protected willUpdate(changed: Map<string, unknown>) {
    if (!changed.has("value") || typeof this.value !== "string") return;
    const to = readFigure(this.value);
    if (!to) return;
    const from = this.#shown ?? 0;
    this.#shown = to.value;
    if (from === to.value || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const duration = cssTime(getComputedStyle(document.documentElement).getPropertyValue("--duration-long2"), 500);
    const carrier = this.animate([{ opacity: 1 }, { opacity: 1 }], { duration });
    void motion.add([carrier], "ambient", this);
    cancelAnimationFrame(this.#frame);
    this._counting = figureAt(from, to, 0);
    const tick = () => {
      const t = Number(carrier.currentTime ?? 0) / duration;
      if (carrier.playState === "finished" || t >= 1) {
        this._counting = undefined;
        return;
      }
      this._counting = figureAt(from, to, settle(t));
      this.#frame = requestAnimationFrame(tick);
    };
    this.#frame = requestAnimationFrame(tick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    cancelAnimationFrame(this.#frame);
  }

  render() {
    if (this.mini) return this.#mini();
    if (this.size === "sm") return this.#dense();
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
        <p class=${statValue({ size: this.size, tone: this.tone })}>${this._counting ?? this.value}</p>
        ${this.hasSlotted("trend") && !this.fill ? html`<div class=${statTrend()}>${this.slotted("trend")}</div>` : nothing}
      </div>
      ${this.#share()}
      ${
        this.delta || this.note
          ? html`<div class=${statMeta()}>
              ${chip} ${this.note ? html`<p class=${statNote()}>${this.note}</p>` : nothing}
            </div>`
          : nothing
      }
      ${this.fill && this.hasSlotted("trend") ? html`<div class=${statTrendBand()}>${this.slotted("trend")}</div>` : nothing}
    </div>`;
    const cls = card({
      variant: null,
      size: "sm",
      link: !!this.href,
      class: statSurface({
        surface: this.main ? "main" : this.outlined ? "outlined" : "tonal",
        fill: this.fill,
        lift: this.fill && !!this.href,
      }),
    });
    const surface = this.main ? "tinted" : nothing;
    return this.href
      ? html`<a href=${this.href} class=${cls} data-surface=${surface} ?data-tile-lift=${this.fill}
          >${body}<span class=${cardLinkIcon()} aria-hidden="true">${iconSvg("arrow-right", { size: "sm" })}</span></a
        >`
      : html`<div class=${cls} data-surface=${surface}>${body}</div>`;
  }

  /** The share bar and its words, when it has one. */
  #share() {
    if (this.share === undefined || !Number.isFinite(this.share)) return nothing;
    const p = Math.round(Math.min(1, Math.max(0, this.share)) * 100);
    return html`<div class=${statShare()}>
      <span class=${statShareTrack()} aria-hidden="true"
        ><span class=${statShareFill({ tone: this.tone ?? "neutral" })} style=${styleMap({ "--share": `${p}%` })}></span
      ></span>
      <p class=${statShareText()}>${this.shareText || `${p}%`}</p>
    </div>`;
  }

  /**
   * Two lines (`mini`): the label; the value and one picture of it, its sparkline, else its share's
   * track, else its change chip. Its words (the share's, the change's) are the picture's name.
   */
  #mini() {
    const p =
      this.share === undefined || !Number.isFinite(this.share)
        ? undefined
        : Math.round(Math.min(1, Math.max(0, this.share)) * 100);
    const picture = this.hasSlotted("trend")
      ? this.slotted("trend")
      : p !== undefined
        ? html`<span
            class=${statShareTrack()}
            role="img"
            aria-label=${this.shareText || `${p}%`}
            title=${this.shareText || `${p}%`}
            ><span
              class=${statShareFill({ tone: this.tone ?? "neutral" })}
              style=${styleMap({ "--share": `${p}%` })}
            ></span
          ></span>`
        : this.delta
          ? html`<span class=${tag({ tone: this.deltaTone, size: "sm", class: statDelta() })} title=${this.delta}
              ><span class=${statDeltaText()}
                >${iconSvg(DELTA_ICON[this.deltaDir], { size: "xs" }, { label: DELTA_WORD[this.deltaDir] })}${WORD_JOINER}${this.delta}</span
              ></span
            >`
          : nothing;
    const body = html`<div class=${cardBody({ class: statMini() })}>
      <p class=${statMiniLabel()} title=${typeof this.label === "string" ? this.label : nothing}>${this.label}</p>
      <div class=${statMiniFigure()}>
        <p class=${statMiniValue({ tone: this.tone })}>${this._counting ?? this.value}</p>
        ${picture === nothing ? nothing : html`<div class=${statMiniPicture()}>${picture}</div>`}
      </div>
    </div>`;
    const cls = card({
      variant: null,
      size: "sm",
      link: !!this.href,
      class: statSurface({ surface: this.main ? "main" : this.outlined ? "outlined" : "tonal" }),
    });
    const surface = this.main ? "tinted" : nothing;
    return this.href
      ? html`<a href=${this.href} class=${cls} data-surface=${surface}>${body}</a>`
      : html`<div class=${cls} data-surface=${surface}>${body}</div>`;
  }

  /** One line: the label and note at the start, the figure at the end (`size="sm"`). */
  #dense() {
    const body = html`<div class=${cardBody({ class: statDense() })}>
      <div class=${statDenseText()}>
        <p class=${statDenseLine({ kind: "label" })}>${this.label}</p>
        ${this.note ? html`<p class=${statDenseLine({ kind: "note" })}>${this.note}</p>` : nothing}
      </div>
      ${this.hasSlotted("trend") ? html`<div class=${statTrend()}>${this.slotted("trend")}</div>` : nothing}
      <p class=${statValue({ size: "sm", tone: this.tone })}>${this._counting ?? this.value}</p>
    </div>`;
    const cls = card({
      variant: null,
      size: "xs",
      link: !!this.href,
      class: statSurface({
        surface: this.main ? "main" : this.outlined ? "outlined" : "tonal",
        fill: this.fill,
        lift: this.fill && !!this.href,
      }),
    });
    const surface = this.main ? "tinted" : nothing;
    return this.href
      ? html`<a href=${this.href} class=${cls} data-surface=${surface} ?data-tile-lift=${this.fill}>${body}</a>`
      : html`<div class=${cls} data-surface=${surface}>${body}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-stat": UiStat;
  }
}
