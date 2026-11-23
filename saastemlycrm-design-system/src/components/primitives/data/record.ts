import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement } from "../../base/light-element.ts";
import { monogramHue, monogramLetters } from "../../base/monogram.ts";
import { motion } from "../../base/motion-queue.ts";
import { rcva } from "../../base/variants.ts";
import { iconSvg } from "../media/icon.ts";
import { fixed, grid, inlineRow, inset, row, rowEnd, rowGrow, rowLine, stack, text } from "../layout/algebra.ts";
import type { Tone } from "./tag.ts";

/**
 * Records: a collection's documents drawn as things rather than rows. Three elements share one
 * shape (`RecordItem`):
 * - `<ui-record-cards>`: a grid of cards, each with the record's monogram, its status as a stripe
 *   along the top and a tag, a headline figure, its facts and the person on it;
 * - `<ui-record-list>`: rich rows, a monogram, the name and a line under it (its facts), the status
 *   and the figure at the end;
 * - `<ui-record-chips>`: the compressed wall: each record a pill (its monogram, name and status
 *   dot), as many to a line as fit;
 * - `<ui-record-hero>`: one record's summary above its form: a large monogram, the name, its status
 *   tags, its figures as a row of tiles and links to what's related (its orders, its vessels).
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * The rules they follow:
 * - **A monogram is identity, not status:** its letters and one of the six chart hues come from the
 *   name (src/components/base/monogram.ts, proved by tests/monogram.test.ts), so the same customer
 *   is the same colour on every page; its letters stay in the text colour.
 * - **Status is the tone's container colour with its ink**, as a tag (`ui-tag`'s roles), and on a
 *   card a stripe in the tone along the top edge too; the words always say it.
 * - **Alive:** a card lifts a level on hover (a spring), its edge picks up the primary colour and its
 *   arrow slides in; a row takes the hover state layer; they come in one after the other (a fade
 *   and rise, handed to the motion queue as ambient motion, none with Reduce motion).
 * - A record with `href` is a link (the whole card or row); a list for assistive tech, each named
 *   by its title and status; `label` names the whole.
 */

export interface RecordFact {
  label: string;
  value: string;
}

export interface RecordItem {
  key: string;
  title: string;
  href?: string;
  /** A short line over the title (a reference, a type). */
  eyebrow?: string;
  /** What its monogram is drawn from (the customer an invoice is for); the title by default. */
  monogram?: string;
  /** A line under the title. */
  supporting?: string;
  status?: { label: string; tone: Tone };
  /** The one number that matters (an amount, a count), drawn large. */
  figure?: RecordFact;
  facts?: RecordFact[];
  /** The person on it (an owner, a requester). */
  person?: string;
  /** A share done, 0 to 1 (a delivery's lines received). */
  progress?: number;
  /**
   * What people can do to it (its buttons, drawn by the owner): on a card at its foot, on a row at
   * its end, above the link that covers the rest of it.
   */
  actions?: unknown;
}

/** A link to what's related to a record (its orders, its vessels), with how many. */
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

/** Comes in: a fade and rise, one after the other (`--i`), queued as ambient motion. */
const ENTER =
  "[animation:cell-in_var(--duration-medium4)_var(--ease-emphasized-decelerate)_both] [animation-delay:calc(min(var(--i),12)*var(--duration-short1))] motion-reduce:[animation:none]";

// ---------------------------------------------------------------- cards

export const recordCards = rcva(`${grid.sm} w-full gap-4`);
export const recordCard = rcva(
  `${stack} group/record relative h-full gap-3 overflow-hidden rounded-box border border-outline-variant bg-surface-container-low ${inset["4"]} pt-5 pb-4 text-on-surface ${ENTER}`,
  {
    variants: {
      link: {
        true: "cursor-pointer [transition:translate_var(--duration-spatial-fast)_var(--ease-spatial-fast),box-shadow_var(--duration-effects-fast)_var(--ease-effects-fast),border-color_var(--duration-effects-fast)_var(--ease-effects-fast)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevation-2 motion-reduce:transition-none",
        false: "",
      },
    },
  },
);
/** The status along the card's top edge. */
export const recordStripe = rcva("pointer-events-none absolute inset-x-0 top-0 h-1", {
  variants: { tone: TONE_DOT },
});
export const recordHead = rcva(`${row} items-start gap-3`);
export const recordNames = rcva(`${stack} ${rowGrow} gap-0.5`);
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
export const recordPerson = rcva(`${rowLine} text-body-sm text-on-surface-variant`);
export const recordInitials = rcva(
  `${fixed["6"]} grid place-items-center rounded-full bg-surface-container-highest text-label-sm text-on-surface`,
);
/** The arrow that slides in on hover. */
export const recordGo = rcva(
  `${rowEnd} text-primary opacity-0 -translate-x-1 [transition:opacity_var(--duration-short4)_var(--ease-standard),translate_var(--duration-short4)_var(--ease-standard)] group-hover/record:translate-x-0 group-hover/record:opacity-100 group-focus-visible/record:opacity-100 motion-reduce:transition-none rtl:rotate-180`,
);

// ---------------------------------------------------------------- rows

export const recordList = rcva(`${stack} w-full gap-1`);
export const recordRow = rcva(
  `${row} group/record relative items-center gap-x-3 gap-y-1 rounded-field ${inset["2"]} py-2 text-on-surface ${ENTER}`,
  {
    variants: {
      link: {
        true: "cursor-pointer touch-target state-layer",
        false: "",
      },
    },
  },
);
export const recordRowTitle = rcva(`${text.line} text-body-lg text-on-surface`);
export const recordRowSupporting = rcva(`${text.line} text-body-sm text-on-surface-variant`);
export const recordRowEnd = rcva(`${row} ${rowEnd} items-center justify-end gap-x-3 gap-y-1`);
export const recordRowFigure = rcva(`${text.label} text-title-sm tabular-nums text-on-surface`);

// ---------------------------------------------------------------- chips

export const recordChips = rcva(`${row} w-full items-center gap-2`);
export const recordChip = rcva(
  `${inlineRow} ${text.label} group/record max-w-full items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-low ps-0.5 pe-3 py-0.5 text-label-lg text-on-surface ${ENTER}`,
  {
    variants: {
      link: {
        true: "cursor-pointer touch-target state-layer [transition:border-color_var(--duration-short4)_var(--ease-standard)] hover:border-primary/40 motion-reduce:transition-none",
        false: "",
      },
    },
  },
);
export const recordChipName = rcva(`${text.line} max-w-56`);

// ---------------------------------------------------------------- hero

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

// ---------------------------------------------------------------- parts

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

/** The link over a record with buttons: it covers the box, under the buttons. */
export const recordCover = rcva("absolute inset-0 z-0 rounded-field");
/** Its buttons, above the cover. */
export const recordActions = rcva(`${row} relative z-10 items-center gap-1`);

/**
 * A link when it has an address, else a plain box. A record with buttons is a box with a link over
 * it (buttons can't sit inside a link), its buttons on top.
 */
const box = (r: RecordItem, cls: string, i: number, label: string, body: TemplateResult) => {
  const style = styleMap({ "--i": String(i) });
  if (r.href && r.actions)
    return html`<div class=${cls} style=${style}>
      <a class=${recordCover()} href=${r.href} aria-label=${label}></a>${body}
    </div>`;
  return r.href
    ? html`<a class=${cls} href=${r.href} aria-label=${label} style=${style}>${body}</a>`
    : html`<div class=${cls} aria-label=${label} style=${style}>${body}</div>`;
};
const actionsOf = (r: RecordItem) => (r.actions ? html`<span class=${recordActions()}>${r.actions}</span>` : nothing);

const named = (r: RecordItem) => (r.status ? `${r.title}, ${r.status.label}` : r.title);

/** Hands the entrance animations to the motion queue once, when the first records are drawn. */
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

/**
 * @example <ui-record-cards label="Customers" .records=${[{ key: "1", title: "Delta Offshore Services", status: { label: "Follow-ups allowed", tone: "success" }, facts: [{ label: "Country", value: "Egypt" }] }]}></ui-record-cards>
 */
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
              <span class=${recordTitle()}>${r.title}</span>
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
                      html`<span class=${recordFact()}
                        ><dt class=${recordFactLabel()}>${f.label}</dt>
                        <dd class=${recordFactValue()}>${f.value}</dd></span
                      >`,
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
        return html`<li class=${stack}>${box(r, recordCard({ link: !!r.href }), i, named(r), body)}</li>`;
      })}
    </ul>`;
  }
}

/**
 * @example <ui-record-list label="Tasks" .records=${[{ key: "1", title: "Chase Port Said Welding", supporting: "Due tomorrow", status: { label: "Open", tone: "warning" } }]}></ui-record-list>
 */
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
        // The facts go on the line under the name, so the name keeps the row's room.
        const under = [r.eyebrow, r.supporting, ...(r.facts ?? []).map((f) => f.value)].filter(Boolean).join(" · ");
        const body = html`${monogram(r.monogram ?? r.title, "sm")}
          <span class=${recordNames()}>
            <span class=${recordRowTitle()}>${r.title}</span>
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
            ${r.href && !r.actions ? html`<span class="text-on-surface-variant rtl:rotate-180" aria-hidden="true">${iconSvg("chevron-right", { size: "sm" })}</span>` : nothing}
          </span>`;
        return html`<li class=${stack}>${box(r, recordRow({ link: !!r.href }), i, named(r), body)}</li>`;
      })}
    </ul>`;
  }
}

/**
 * @example <ui-record-chips label="Customers" .records=${[{ key: "1", title: "Atlas Tankers", status: { label: "Do not chase", tone: "error" } }]}></ui-record-chips>
 */
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
        const body = html`${monogram(r.monogram ?? r.title, "xs")}<span class=${recordChipName()}>${r.title}</span>${
            r.status ? html`<span class=${recordDot({ tone: r.status.tone })} aria-hidden="true"></span>` : nothing
          }`;
        return html`<li class=${inlineRow}>
          ${box({ ...r, actions: undefined }, recordChip({ link: !!r.href }), i, named(r), body)}
        </li>`;
      })}
    </ul>`;
  }
}

/**
 * @example <ui-record-hero .record=${{ key: "1", title: "Delta Offshore Services", eyebrow: "Customer", status: { label: "Follow-ups allowed", tone: "success" } }} .figures=${[{ label: "Open invoices", value: "USD 14.1k" }]} .links=${[{ label: "Vessels", count: 1, href: "#" }]}></ui-record-hero>
 */
@customElement("ui-record-hero")
export class UiRecordHero extends RecordsBase {
  @property({ attribute: false }) record?: RecordItem;
  /** More tags beside the status (its other toned fields). */
  @property({ attribute: false }) tags: { label: string; tone: Tone }[] = [];
  /** Its figures, each a tile. */
  @property({ attribute: false }) figures: RecordFact[] = [];
  @property({ attribute: false }) links: RecordLink[] = [];
  /** A line at the end ("Updated 17 Nov 2026, 09:12"). */
  @property() meta = "";
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
          <span class=${recordHeroTitle()}>${r.title}</span>
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
                  html`<span class=${recordHeroFigure()} style=${styleMap({ "--i": String(i) })}
                    ><dt class=${recordFigureLabel()}>${f.label}</dt>
                    <dd class=${recordFigureValue()}>${f.value}</dd></span
                  >`,
              )}
            </dl>`
          : nothing
      }
      ${
        this.links.length
          ? html`<nav class=${recordHeroLinks()} aria-label="Related">
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
