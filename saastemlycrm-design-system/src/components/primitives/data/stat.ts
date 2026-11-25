import type { VariantProps } from "class-variance-authority";
import { styleMap } from "lit/directives/style-map.js";
import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cssTime } from "../../base/css-time.ts";
import { figureAt, readFigure, settle } from "../../base/count-up.ts";
import { motion } from "../../base/motion-queue.ts";
import { m } from "../../../i18n/index.ts";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { card, cardBody, cardLinkIcon } from "../containers/card.ts";
import { fixedWidth, padEnd, row, rowFill, rowGrow, rowLine, stack, text } from "../layout/algebra.ts";
import { iconSvg } from "../media/icon.ts";
import { tag } from "./tag.ts";
import { percentText } from "./visual-math.ts";

export const statSurface = rcva("border", {
  variants: {
    fill: { true: "grow basis-0 min-h-0 overflow-hidden [--clips:surface]", false: "" },
    lift: { true: "hover:translate-y-0!", false: "" },
    surface: {
      tonal: "border-transparent bg-surface-container",
      outlined: "border-outline-variant bg-surface",
      main: "border-transparent",
    },
  },
  defaultVariants: { surface: "tonal" },
});
export const statBody = rcva("gap-1");
export const statLabel = rcva(`${text.label} line-clamp-2 text-label-md text-on-surface-variant`, {
  variants: { link: { true: padEnd["6"] } },
});
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
export const statMeta = rcva(`${row} items-center gap-x-2 gap-y-1`);
export const statDelta = rcva("tabular-nums");
const WORD_JOINER = String.fromCharCode(0x2060);
export const statDeltaText = rcva(`${text.label} [&>svg]:inline [&>svg]:me-1 [&>svg]:align-[-0.125em]`);
export const statNote = rcva(`${text.label} ${rowFill} line-clamp-2 text-body-sm text-on-surface-variant`);
export const statDense = rcva(`${row} items-center gap-3`);
export const statDenseText = rcva(`${stack} ${rowLine} gap-0`);
export const statDenseLine = rcva(`${text.label} truncate`, {
  variants: { kind: { label: "text-label-md text-on-surface-variant", note: "text-body-sm text-on-surface-variant" } },
});

export const statShare = rcva(`${stack} gap-1`);
export const statShareTrack = rcva(
  "h-1.5 w-full overflow-hidden [--clips:bar] rounded-full bg-surface-container-highest",
);
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

export const statTrendBand = rcva(`${stack} grow basis-0 min-h-12 w-full pt-2`);

export const statTrend = rcva(`${fixedWidth["16"]} ms-auto`);

export const statMini = rcva(`${stack} @container w-full gap-1`);
export const statMiniLabel = rcva(`${text.line} text-label-md text-on-surface-variant`);
export const statMiniFigure = rcva(`${row} items-center gap-3`);
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
export const statMiniPicture = rcva(`${rowGrow} ${row} items-center justify-end @max-[7rem]:hidden`);

export type StatVariants = VariantProps<typeof statValue>;
export type StatDeltaDir = "up" | "down" | "flat";
export type StatDeltaTone = "neutral" | "success" | "warning" | "error";

const DELTA_ICON = { up: "arrow-up", down: "arrow-down", flat: "minus" } as const;
const DELTA_WORD: Record<StatDeltaDir, () => string> = {
  up: () => m.stat_delta_up(),
  down: () => m.stat_delta_down(),
  flat: () => m.stat_delta_flat(),
};

@customElement("ui-stat")
export class UiStat extends LightElement {
  @property() label: Renderable = "";
  @property() value: Renderable = "";
  @property() note: Renderable = "";
  @property() tone: StatVariants["tone"];
  @property() size: StatVariants["size"];
  @property() href?: string;
  @property({ type: Boolean }) main = false;
  @property({ type: Boolean }) outlined = false;
  @property({ type: Boolean }) fill = false;
  @property({ type: Boolean }) mini = false;
  @property() delta = "";
  @property({ attribute: "delta-dir" }) deltaDir: StatDeltaDir = "up";
  @property({ attribute: "delta-tone" }) deltaTone: StatDeltaTone = "neutral";
  @property({ type: Number }) share?: number;
  @property({ attribute: "share-text" }) shareText = "";
  @state() private _counting?: string;
  #shown?: number;
  #frame = 0;

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
            >${iconSvg(DELTA_ICON[this.deltaDir], { size: "xs" }, { label: DELTA_WORD[this.deltaDir]() })}${WORD_JOINER}<bdi
              >${this.delta}</bdi
            ></span
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

  #share() {
    if (this.share === undefined || !Number.isFinite(this.share)) return nothing;
    const p = Math.round(Math.min(1, Math.max(0, this.share)) * 100);
    return html`<div class=${statShare()}>
      <span class=${statShareTrack()} aria-hidden="true"
        ><span class=${statShareFill({ tone: this.tone ?? "neutral" })} style=${styleMap({ "--share": `${p}%` })}></span
      ></span>
      <p class=${statShareText()}>${this.shareText || percentText(p)}</p>
    </div>`;
  }

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
            aria-label=${this.shareText || percentText(p)}
            title=${this.shareText || percentText(p)}
            ><span
              class=${statShareFill({ tone: this.tone ?? "neutral" })}
              style=${styleMap({ "--share": `${p}%` })}
            ></span
          ></span>`
        : this.delta
          ? html`<span class=${tag({ tone: this.deltaTone, size: "sm", class: statDelta() })} title=${this.delta}
              ><span class=${statDeltaText()}
                >${iconSvg(DELTA_ICON[this.deltaDir], { size: "xs" }, { label: DELTA_WORD[this.deltaDir]() })}${WORD_JOINER}<bdi
                  >${this.delta}</bdi
                ></span
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
