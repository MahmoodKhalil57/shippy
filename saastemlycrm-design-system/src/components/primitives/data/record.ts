import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { m } from "../../../lib/i18n/index.ts";
import { LightElement } from "../../base/light-element.ts";
import { monogramHue, monogramLetters } from "../../../lib/base/monogram.ts";
import { motion } from "../../../lib/base/motion-queue.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { iconSvg } from "../media/icon.ts";
import { fixed, grid, inlineRow, inset, row, rowEnd, rowFill, stack, text } from "../../../styles/algebra.ts";
import type { Tone } from "./tag.ts";

export interface RecordFact {
  label: string;
  value: string;
}

export interface RecordItem {
  key: string;
  title: string;
  href?: string;
  eyebrow?: string;
  monogram?: string;
  supporting?: string;
  status?: { label: string; tone: Tone };
  figure?: RecordFact;
  facts?: RecordFact[];
  person?: string;
  progress?: number;
  actions?: unknown;
}

export interface RecordLink {
  label: string;
  count?: number;
  href?: string;
}

const HUE = {
  0: "bg-chart-1/25",
  1: "bg-chart-2/25",
  2: "bg-chart-3/25",
  3: "bg-chart-4/25",
  4: "bg-chart-5/25",
  5: "bg-chart-6/25",
} as const;
type Hue = keyof typeof HUE;

export const recordMonogram = rcva(
  "grid shrink-0 place-items-center rounded-field font-medium tracking-wide text-on-surface select-none",
  {
    variants: {
      hue: HUE,
      size: {
        xs: `${fixed["6"]} ${text.label} text-label-sm`,
        sm: `${fixed["9"]} ${text.label} text-label-lg`,
        md: `${fixed["11"]} ${text.label} text-title-sm`,
        lg: `${fixed["16"]} ${text.label} text-title-lg`,
      },
    },
    defaultVariants: { hue: 0, size: "md" },
  },
);

const TONE_TAG = {
  neutral: "bg-surface-container-high text-on-surface-variant",
  primary: "bg-primary-container text-on-primary-container",
  info: "bg-info-container text-on-info-container",
  success: "bg-success-container text-on-success-container",
  warning: "bg-warning-container text-on-warning-container",
  error: "bg-error-container text-on-error-container",
} as const;
export const recordStatus = rcva(
  `${inlineRow} ${text.label} items-center gap-1 rounded-sm px-1.5 py-0.5 text-label-md`,
  { variants: { tone: TONE_TAG }, defaultVariants: { tone: "neutral" } },
);
const TONE_DOT = {
  neutral: "bg-outline",
  primary: "bg-primary",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
} as const;
export const recordDot = rcva(`${fixed["1.5"]} rounded-full`, { variants: { tone: TONE_DOT } });

const ENTER =
  "[animation:cell-in_var(--duration-medium4)_var(--ease-emphasized-decelerate)_both] [animation-delay:calc(min(var(--i),12)*var(--duration-short1))] motion-reduce:[animation:none]";

export const recordCards = rcva(`${grid.sm} w-full gap-4`);
export const recordCard = rcva(
  `${stack} group/record relative h-full gap-3 overflow-hidden rounded-box border border-outline-variant bg-surface-container-low ${inset["4"]} pt-5 pb-4 text-on-surface ${ENTER}`,
  {
    variants: {
      link: {
        true: "cursor-pointer has-[[data-record-link]:focus-visible]:outline-2 has-[[data-record-link]:focus-visible]:-outline-offset-2 has-[[data-record-link]:focus-visible]:outline-primary [transition:translate_var(--duration-spatial-fast)_var(--ease-spatial-fast),box-shadow_var(--duration-effects-fast)_var(--ease-effects-fast),border-color_var(--duration-effects-fast)_var(--ease-effects-fast)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevation-2 motion-reduce:transition-none",
        false: "",
      },
    },
  },
);
export const recordStripe = rcva("pointer-events-none absolute inset-x-0 top-0 h-1", {
  variants: { tone: TONE_DOT },
});
export const recordHead = rcva(`${row} items-start gap-3`);
export const recordNames = rcva(`${stack} ${rowFill} gap-0.5`);
export const recordEyebrow = rcva(`${text.line} text-label-md text-on-surface-variant`);
export const recordTitle = rcva(`${text.label} line-clamp-2 text-title-md text-on-surface`);
export const recordSupporting = rcva(`${text.label} line-clamp-2 text-body-sm text-on-surface-variant`);
export const recordFigure = rcva(`${stack} gap-0`);
export const recordFigureLabel = rcva(`${text.line} text-label-md text-on-surface-variant`);
export const recordFigureValue = rcva(`${text.label} text-headline-sm tabular-nums text-on-surface`);
export const recordFacts = rcva(`${grid.pairs} gap-x-4 gap-y-2`);
export const recordFact = rcva(`${stack} gap-0`);
export const recordFactLabel = rcva(`${text.line} text-label-sm text-on-surface-variant`);
export const recordFactValue = rcva(`${text.label} line-clamp-2 text-body-md text-on-surface`);
export const recordTrack = rcva("h-1 w-full overflow-hidden [--clips:bar] rounded-full bg-surface-container-highest");
export const recordFill = rcva(
  "block h-full w-(--p) max-w-full rounded-full bg-chart-1 [transition:width_var(--duration-long2)_var(--ease-emphasized-decelerate)] starting:w-0 motion-reduce:transition-none",
);
export const recordFoot = rcva(`${row} ${text.label} mt-auto items-center gap-2 text-body-sm text-on-surface-variant`);
export const recordPerson = rcva(`${rowFill} truncate text-body-sm text-on-surface-variant`);
export const recordInitials = rcva(
  `${fixed["6"]} grid place-items-center rounded-full bg-surface-container-highest text-label-sm text-on-surface`,
);
export const recordGo = rcva(
  `${rowEnd} text-primary opacity-0 -translate-x-1 [transition:opacity_var(--duration-short4)_var(--ease-standard),translate_var(--duration-short4)_var(--ease-standard)] group-hover/record:translate-x-0 group-hover/record:opacity-100 group-has-[[data-record-link]:focus-visible]/record:translate-x-0 group-has-[[data-record-link]:focus-visible]/record:opacity-100 motion-reduce:transition-none rtl:translate-x-1`,
);

export const recordList = rcva(`${stack} w-full gap-1`);
export const recordRow = rcva(
  `${row} group/record relative items-center gap-x-3 gap-y-1 rounded-field ${inset["2"]} py-2 text-on-surface ${ENTER}`,
  {
    variants: {
      link: {
        true: "cursor-pointer touch-target state-layer has-[[data-record-link]:focus-visible]:outline-2 has-[[data-record-link]:focus-visible]:-outline-offset-2 has-[[data-record-link]:focus-visible]:outline-primary",
        false: "",
      },
    },
  },
);
export const recordRowNames = rcva(`${stack} ${rowFill} gap-0.5`);
export const recordRowTitle = rcva(`${text.label} line-clamp-2 text-body-lg text-on-surface`);
export const recordRowSupporting = rcva(`${text.line} text-body-sm text-on-surface-variant`);
export const recordRowEnd = rcva(`${row} ${rowEnd} items-center justify-end gap-x-3 gap-y-1`);
export const recordRowChevron = rcva("text-on-surface-variant");
export const recordRowFigure = rcva(`${text.label} text-title-sm tabular-nums text-on-surface`);

export const recordChips = rcva(`${row} w-full items-center gap-2`);
export const recordChip = rcva(
  `${inlineRow} ${text.label} group/record max-w-full items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-low ps-0.5 pe-3 py-0.5 text-label-lg text-on-surface ${ENTER}`,
  {
    variants: {
      link: {
        true: "cursor-pointer touch-target state-layer has-[[data-record-link]:focus-visible]:outline-2 has-[[data-record-link]:focus-visible]:-outline-offset-2 has-[[data-record-link]:focus-visible]:outline-primary [transition:border-color_var(--duration-short4)_var(--ease-standard)] hover:border-primary/40 motion-reduce:transition-none",
        false: "",
      },
    },
  },
);
export const recordChipName = rcva(`${text.line} max-w-56`);

export const recordHero = rcva(`${stack} w-full gap-4`);
export const recordHeroHead = rcva(`${row} items-center gap-4`);
export const recordHeroTitle = rcva(`${text.label} text-headline-sm text-on-surface`);
export const recordHeroTags = rcva(`${row} items-center gap-2`);
export const recordHeroFigures = rcva(`${grid.xs} gap-3`);
export const recordHeroFigure = rcva(`${stack} gap-0.5 rounded-field bg-surface-container ${inset["3"]} py-3 ${ENTER}`);
export const recordHeroLinks = rcva(`${row} items-center gap-2`);
export const recordHeroLink = rcva(
  `${inlineRow} ${text.label} items-center gap-1.5 rounded-full border border-outline-variant px-3 py-1 text-label-lg text-on-surface [transition:border-color_var(--duration-short4)_var(--ease-standard)] touch-target state-layer hover:border-primary/40 motion-reduce:transition-none`,
);
export const recordHeroCount = rcva(
  `${inlineRow} ${text.label} min-w-5 justify-center rounded-full bg-secondary-container px-1.5 text-label-sm tabular-nums text-on-secondary-container`,
);
export const recordHeroMeta = rcva(`${text.label} text-body-sm text-on-surface-variant`);

const monogram = (name: string, size: "xs" | "sm" | "md" | "lg") =>
  html`<span class=${recordMonogram({ hue: monogramHue(name) as Hue, size })} aria-hidden="true"
    >${monogramLetters(name)}</span
  >`;

const status = (s: RecordItem["status"]) =>
  s
    ? html`<span class=${recordStatus({ tone: s.tone })}
        ><span class=${recordDot({ tone: s.tone })} aria-hidden="true"></span>${s.label}</span
      >`
    : nothing;

const initials = (name: string) => monogramLetters(name);

export const recordLink = rcva(
  "text-inherit no-underline outline-none [--focus:host] after:absolute after:inset-0 after:content-['']",
);
export const recordActions = rcva(`${row} relative z-10 items-center gap-1`);

/** The title is the record's link, stretched over the whole box, so its name starts with the visible title. */
const titled = (r: RecordItem) =>
  r.href
    ? html`<a
        class=${recordLink()}
        href=${r.href}
        aria-label=${r.status ? m.record_named({ title: r.title, status: r.status.label }) : nothing}
        data-record-link
        >${r.title}</a
      >`
    : r.title;

const box = (cls: string, i: number, body: TemplateResult) =>
  html`<div class=${cls} style=${styleMap({ "--i": String(i) })}>${body}</div>`;
const actionsOf = (r: RecordItem) => (r.actions ? html`<span class=${recordActions()}>${r.actions}</span>` : nothing);

abstract class RecordsBase extends LightElement {
  #shown = false;
  protected abstract get count(): number;
  protected updated() {
    if (this.#shown || !this.count) return;
    this.#shown = true;
    const enter = this.getAnimations({ subtree: true }).filter(
      (a) => a instanceof CSSAnimation && a.animationName === "cell-in",
    );
    void motion.add(enter, "ambient", this);
  }
}

@customElement("ui-record-cards")
export class UiRecordCards extends RecordsBase {
  @property({ attribute: false }) records: RecordItem[] = [];
  @property() label = "";
  protected get count() {
    return this.records.length;
  }

  render() {
    return html`<ul class=${recordCards()} aria-label=${this.label || nothing}>
      ${this.records.map((r, i) => {
        const body = html`${r.status ? html`<span class=${recordStripe({ tone: r.status.tone })}></span>` : nothing}
          <span class=${recordHead()}>
            ${monogram(r.monogram ?? r.title, "md")}
            <span class=${recordNames()}>
              ${r.eyebrow ? html`<span class=${recordEyebrow()}>${r.eyebrow}</span>` : nothing}
              <span class=${recordTitle()}>${titled(r)}</span>
              ${r.supporting ? html`<span class=${recordSupporting()}>${r.supporting}</span>` : nothing}
            </span>
          </span>
          ${r.status ? html`<span class=${row}>${status(r.status)}</span>` : nothing}
          ${
            r.figure
              ? html`<span class=${recordFigure()}>
                  <span class=${recordFigureLabel()}>${r.figure.label}</span>
                  <span class=${recordFigureValue()}>${r.figure.value}</span>
                </span>`
              : nothing
          }
          ${
            r.facts?.length
              ? html`<dl class=${recordFacts()}>
                  ${r.facts.map(
                    (f) =>
                      html`<div class=${recordFact()}>
                        <dt class=${recordFactLabel()}>${f.label}</dt>
                        <dd class=${recordFactValue()}>${f.value}</dd>
                      </div>`,
                  )}
                </dl>`
              : nothing
          }
          ${
            r.progress !== undefined
              ? html`<span class=${recordTrack()} aria-hidden="true"
                  ><span
                    class=${recordFill()}
                    style=${styleMap({ "--p": `${Math.round(Math.min(1, Math.max(0, r.progress)) * 100)}%` })}
                  ></span
                ></span>`
              : nothing
          }
          <span class=${recordFoot()}>
            ${
              r.person
                ? html`<span class=${recordInitials()} aria-hidden="true">${initials(r.person)}</span
                    ><span class=${recordPerson()}>${r.person}</span>`
                : nothing
            }
            ${actionsOf(r)}
            ${r.href ? html`<span class=${recordGo()} aria-hidden="true">${iconSvg("arrow-right", { size: "sm" })}</span>` : nothing}
          </span>`;
        return html`<li class=${stack}>${box(recordCard({ link: !!r.href }), i, body)}</li>`;
      })}
    </ul>`;
  }
}

@customElement("ui-record-list")
export class UiRecordList extends RecordsBase {
  @property({ attribute: false }) records: RecordItem[] = [];
  @property() label = "";
  protected get count() {
    return this.records.length;
  }

  render() {
    return html`<ul class=${recordList()} aria-label=${this.label || nothing}>
      ${this.records.map((r, i) => {
        const under = [r.eyebrow, r.supporting, ...(r.facts ?? []).map((f) => f.value)].filter(Boolean).join(" · ");
        const body = html`${monogram(r.monogram ?? r.title, "sm")}
          <span class=${recordRowNames()}>
            <span class=${recordRowTitle()}>${titled(r)}</span>
            ${under ? html`<span class=${recordRowSupporting()}>${under}</span>` : nothing}
            ${
              r.progress !== undefined
                ? html`<span class=${recordTrack()} aria-hidden="true"
                    ><span
                      class=${recordFill()}
                      style=${styleMap({ "--p": `${Math.round(Math.min(1, Math.max(0, r.progress)) * 100)}%` })}
                    ></span
                  ></span>`
                : nothing
            }
          </span>
          <span class=${recordRowEnd()}>
            ${
              r.person
                ? html`<span class=${recordInitials()} title=${r.person} aria-hidden="true"
                    >${initials(r.person)}</span
                  >`
                : nothing
            }
            ${status(r.status)} ${r.figure ? html`<span class=${recordRowFigure()}>${r.figure.value}</span>` : nothing}
            ${actionsOf(r)}
            ${r.href && !r.actions ? html`<span class=${recordRowChevron()} aria-hidden="true">${iconSvg("chevron-right", { size: "sm" })}</span>` : nothing}
          </span>`;
        return html`<li class=${stack}>${box(recordRow({ link: !!r.href }), i, body)}</li>`;
      })}
    </ul>`;
  }
}

@customElement("ui-record-chips")
export class UiRecordChips extends RecordsBase {
  @property({ attribute: false }) records: RecordItem[] = [];
  @property() label = "";
  protected get count() {
    return this.records.length;
  }

  render() {
    return html`<ul class=${recordChips()} aria-label=${this.label || nothing}>
      ${this.records.map((r, i) => {
        const body = html`${monogram(r.monogram ?? r.title, "xs")}<span class=${recordChipName()}>${titled(r)}</span>${
            r.status ? html`<span class=${recordDot({ tone: r.status.tone })} aria-hidden="true"></span>` : nothing
          }`;
        return html`<li class=${inlineRow}>${box(recordChip({ link: !!r.href }), i, body)}</li>`;
      })}
    </ul>`;
  }
}

@customElement("ui-record-hero")
export class UiRecordHero extends RecordsBase {
  @property({ attribute: false }) record?: RecordItem;
  @property({ attribute: false }) tags: { label: string; tone: Tone }[] = [];
  @property({ attribute: false }) figures: RecordFact[] = [];
  @property({ attribute: false }) links: RecordLink[] = [];
  @property() meta = "";
  @property({ type: Number }) level?: 1;
  protected get count() {
    return this.figures.length;
  }

  render() {
    const r = this.record;
    if (!r) return nothing;
    return html`<section class=${recordHero()} aria-label=${r.title}>
      <div class=${recordHeroHead()}>
        ${monogram(r.monogram ?? r.title, "lg")}
        <span class=${recordNames()}>
          ${r.eyebrow ? html`<span class=${recordEyebrow()}>${r.eyebrow}</span>` : nothing}
          ${
            this.level === 1
              ? html`<h1 class=${recordHeroTitle()}>${r.title}</h1>`
              : html`<span class=${recordHeroTitle()}>${r.title}</span>`
          }
          ${r.supporting ? html`<span class=${recordSupporting()}>${r.supporting}</span>` : nothing}
        </span>
      </div>
      ${
        r.status || this.tags.length
          ? html`<div class=${recordHeroTags()}>${status(r.status)}${this.tags.map((t) => status(t))}</div>`
          : nothing
      }
      ${
        this.figures.length
          ? html`<dl class=${recordHeroFigures()}>
              ${this.figures.map(
                (f, i) =>
                  html`<div class=${recordHeroFigure()} style=${styleMap({ "--i": String(i) })}>
                    <dt class=${recordFigureLabel()}>${f.label}</dt>
                    <dd class=${recordFigureValue()}>${f.value}</dd>
                  </div>`,
              )}
            </dl>`
          : nothing
      }
      ${
        this.links.length
          ? html`<nav class=${recordHeroLinks()} aria-label=${m.record_related()}>
              ${this.links.map((l) => {
                const inner = html`${l.label}${
                  l.count !== undefined ? html`<span class=${recordHeroCount()}>${l.count}</span>` : nothing
                }`;
                return l.href
                  ? html`<a class=${recordHeroLink()} href=${l.href}>${inner}</a>`
                  : html`<span class=${recordHeroLink()}>${inner}</span>`;
              })}
            </nav>`
          : nothing
      }
      ${actionsOf(r)} ${this.meta ? html`<p class=${recordHeroMeta()}>${this.meta}</p>` : nothing}
    </section>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-record-cards": UiRecordCards;
    "ui-record-list": UiRecordList;
    "ui-record-chips": UiRecordChips;
    "ui-record-hero": UiRecordHero;
  }
}
