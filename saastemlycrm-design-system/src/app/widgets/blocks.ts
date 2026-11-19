import { html, nothing } from "lit";
import type { IconName } from "../../components/primitives/media/icon.ts";
import type { TableColumn, TableSupporting } from "../../components/primitives/data/table.ts";
import "../../components/index.ts";
import { defineBlock, inCard, renderBlocks, type ViewContext } from "./registry.ts";
import { formatNumber, type Action, type Cell, type Tag } from "./schema.ts";

/**
 * The built-in blocks (./schema.ts `ViewBlocks`), drawn with the design system's `ui-*`
 * elements only. Importing this module registers them.
 */

const icon = (name?: string) => (name ? (name as IconName) : undefined);

export const tag = (t: Tag) => html`<ui-tag .tone=${t.tone ?? "neutral"} .icon=${icon(t.icon)}>${t.label}</ui-tag>`;

/** A filled action is primary, a destructive one is in the error colour. */
const actionColor = (a: Action) => (a.tone === "error" ? "error" : a.variant === "filled" ? "primary" : undefined);

export const action = (a: Action, ctx: ViewContext, size: "xs" | "sm" = "xs") =>
  html`<ui-button
    size=${size}
    .variant=${a.variant ?? "tonal"}
    .color=${actionColor(a)}
    .href=${a.href}
    ?disabled=${a.disabled}
    @click=${a.href ? undefined : () => ctx.run(a)}
    >${a.icon ? html`<ui-icon .name=${icon(a.icon)} size="sm"></ui-icon>` : nothing}${a.label}</ui-button
  >`;

const withReason = (a: Action, ctx: ViewContext) =>
  a.disabled && a.reason
    ? html`<ui-flex direction="col" gap="1"
        >${action(a, ctx)}<ui-text variant="body-sm" color="muted">${a.reason}</ui-text></ui-flex
      >`
    : action(a, ctx);

const isLink = (a: Action) => !!a.href && !a.call && !a.print;

/**
 * A row of actions in one order everywhere, so a screen can't get the hierarchy wrong: links
 * first, as text buttons (past two, the rest go in "More"), then the other actions with the main
 * one last. At most one is filled: an earlier filled one is drawn tonal.
 */
export function actionBar(items: Action[] | undefined, ctx: ViewContext) {
  if (!items?.length) return nothing;
  const links = items.filter(isLink).map((a): Action => ({ ...a, variant: "text" }));
  const rest = items.filter((a) => !isLink(a));
  const main = rest.map((a) => a.variant).lastIndexOf("filled");
  const ordered = rest
    .map((a, i): Action => (a.variant === "filled" && i !== main ? { ...a, variant: "tonal" } : a))
    .filter((_, i) => i !== main);
  if (main >= 0) ordered.push(rest[main]!);
  const shown = links.length > 2 ? links.slice(0, 1) : links;
  const more = links.length > 2 ? links.slice(1) : [];
  const linkRow = html`${shown.map((a) => withReason(a, ctx))}${
    more.length
      ? html`<ui-dropdown
          label="More"
          trigger-variant="text"
          trigger-size="xs"
          align="start"
          .items=${more.map((a) => ({ label: a.label, href: a.href }))}
        ></ui-dropdown>`
      : nothing
  }`;
  const buttons = ordered.map((a) => withReason(a, ctx));
  if (!links.length || !ordered.length)
    return html`<ui-flex gap="2" align="center" wrap>${links.length ? linkRow : buttons}</ui-flex>`;
  return html`<ui-flex gap="2" align="center" justify="between" wrap>
    <ui-flex gap="1" align="center" wrap>${linkRow}</ui-flex>
    <ui-flex gap="2" align="center" wrap>${buttons}</ui-flex>
  </ui-flex>`;
}

/** A cell value as text, a link, a tag, a dot and text, or text over a gauge. */
export function cell(c: Cell, ctx?: ViewContext) {
  if (c === null || c === undefined || c === "") return html`<ui-text as="span" color="muted">—</ui-text>`;
  if (typeof c === "string" || typeof c === "number") return html`${c}`;
  if (c.switch) {
    const s = c.switch;
    return html`<ui-switch
      size="sm"
      .checked=${s.value}
      aria-label=${c.text}
      ?disabled=${!s.call || !ctx}
      @change=${(e: Event) =>
        s.call &&
        ctx?.run({
          label: c.text,
          call: { ...s.call, body: { ...s.call.body, value: (e.target as HTMLInputElement).checked } },
          done: s.done,
          reply: true,
        })}
    ></ui-switch>`;
  }
  const color = c.tone && c.tone !== "neutral" && c.tone !== "primary" ? c.tone : undefined;
  let body = c.tag
    ? html`<ui-tag .tone=${c.tone ?? "neutral"}>${c.text}</ui-tag>`
    : html`<ui-text as="span" variant="body-md" .color=${color} ?mono=${c.mono} ?emphasized=${c.strong}
        >${c.text}</ui-text
      >`;
  if (c.href && !c.tag) body = html`<ui-link .href=${c.href}>${body}</ui-link>`;
  if (c.dot)
    body = html`<ui-flex inline gap="2" align="center"
      ><ui-badge dot .tone=${c.dot} .label=${c.text}></ui-badge>${body}</ui-flex
    >`;
  if (c.gauge)
    body = html`<ui-flex direction="col" gap="1"
      >${body}<ui-gauge
        width="xs"
        .tone=${c.gauge.tone ?? "primary"}
        .value=${c.gauge.value}
        .max=${c.gauge.max}
        .label=${c.gauge.label ?? c.text}
      ></ui-gauge
    ></ui-flex>`;
  if (c.tags?.length)
    body = html`<ui-flex inline gap="2" align="center" wrap>${c.text ? body : nothing}${c.tags.map(tag)}</ui-flex>`;
  if (c.marks?.length)
    body = html`<ui-flex direction="col" gap="1"
      >${c.text || c.tags?.length ? body : nothing}${c.marks.map(
        (m) =>
          html`<ui-flex gap="2" align="baseline"
            ><ui-badge dot .tone=${m.tone ?? "neutral"} .label=${m.tone ?? "neutral"}></ui-badge
            ><ui-text variant="body-sm" .color=${m.tone === "error" ? "error" : undefined}>${m.text}</ui-text></ui-flex
          >`,
      )}</ui-flex
    >`;
  if (c.actions?.length && ctx)
    body = html`<ui-flex gap="2" align="center" wrap
      >${c.text || c.tags?.length || c.marks?.length ? body : nothing}${c.actions.map((a) => action(a, ctx))}</ui-flex
    >`;
  return body;
}

const supporting = (c: Cell): TableSupporting => {
  if (c === null || c === undefined) return "";
  if (typeof c === "string" || typeof c === "number") return String(c);
  const tone = c.tone === "error" || c.tone === "warning" || c.tone === "success" ? c.tone : undefined;
  return tone ? { text: c.text, tone } : c.text;
};

// Inside a card, a card is a filled panel (M3: no cards in cards).
defineBlock(
  "card",
  (b, ctx) =>
    html`<ui-card
      .variant=${ctx.inCard ? "filled" : b.variant}
      .size=${ctx.inCard ? "sm" : undefined}
      .subhead=${b.subhead ?? ""}
      .count=${b.count}
      .countTone=${b.countTone}
    >
      ${b.heading ? html`<span slot="heading">${b.heading}</span>` : nothing}
      ${
        b.tags?.length || b.actions?.length
          ? html`<ui-flex slot="trailing" gap="2" align="center" wrap
              >${b.tags?.map(tag)}${b.actions?.map((a) => action(a, ctx))}</ui-flex
            >`
          : nothing
      }
      ${renderBlocks(b.blocks, inCard(ctx))}
    </ui-card>`,
);

defineBlock("grid", (b, ctx) => html`<ui-grid .fit=${b.fit ?? "md"} gap="4">${renderBlocks(b.blocks, ctx)}</ui-grid>`);

defineBlock(
  "split",
  (b, ctx) =>
    html`<ui-grid
      sidebar
      gap="4"
      .items=${[
        { role: "main", content: html`<ui-flex direction="col" gap="4">${renderBlocks(b.main, ctx)}</ui-flex>` },
        { role: "side", content: html`<ui-flex direction="col" gap="4">${renderBlocks(b.side, ctx)}</ui-flex>` },
      ]}
    ></ui-grid>`,
);

defineBlock(
  "stats",
  (b) =>
    // Balanced rows: all in one row when they fit, else in even rows (never one left over).
    html`<ui-grid
      .balance=${b.items.length >= 2 && b.items.length <= 6 ? (String(b.items.length) as "2") : undefined}
      .fit=${b.items.length >= 2 && b.items.length <= 6 ? undefined : "xs"}
      gap="4"
      >${b.items.map(
        (s) =>
          html`<ui-stat
            .size=${b.size ?? "lg"}
            .href=${s.href}
            .label=${s.label}
            .value=${s.value}
            .note=${s.note ?? ""}
            .tone=${s.tone && s.tone !== "info" && s.tone !== "primary" ? s.tone : undefined}
          >
            ${
              s.trend
                ? html`<ui-chart
                    slot="trend"
                    kind="spark"
                    .label=${`${s.label}, trend`}
                    .labels=${s.trend.labels}
                    .series=${[{ name: s.label, values: s.trend.values }]}
                    .format=${(v: number) => formatNumber(v, s.trend?.format)}
                  ></ui-chart>`
                : nothing
            }
          </ui-stat>`,
      )}</ui-grid
    >`,
);

defineBlock("text", (b) => {
  const text = html`<ui-text .variant=${b.variant ?? "body-md"} .color=${b.muted ? "muted" : undefined} pre-line
    >${b.text}</ui-text
  >`;
  return b.speak
    ? html`<ui-flex direction="col" gap="2"
        >${text}<ui-speak .text=${b.text} .lang=${typeof b.speak === "string" ? b.speak : "en-GB"}></ui-speak
      ></ui-flex>`
    : text;
});

defineBlock("table", (b, ctx) => {
  const columns: TableColumn[] = b.columns.map((c, i) => ({
    key: c.key,
    label: c.label,
    align: c.align,
    render: (row) => cell(row[c.key] as Cell, ctx),
    supporting: c.supporting ? (row) => supporting(row[c.supporting!] as Cell) : undefined,
    fixed: i === 0,
  }));
  return b.rows.length
    ? html`<ui-table .size=${b.size ?? "sm"} hover ?footer=${b.totals} .columns=${columns} .rows=${b.rows}></ui-table>`
    : html`<ui-empty-state size="sm">${b.empty ?? "Nothing here yet."}</ui-empty-state>`;
});

defineBlock("list", (b, ctx) =>
  b.items.length
    ? html`<ui-list .variant=${b.variant}>
        ${b.items.map(
          (i) =>
            html`<ui-list-item
              .headline=${i.headline}
              .supporting=${i.supporting ?? ""}
              .overline=${i.overline ?? ""}
              .href=${i.href}
              ?action=${!!i.select}
              ?selected=${i.selected ?? (!!i.select && ctx.params[i.select.param] === i.select.value)}
              @click=${i.select ? () => ctx.setParam(i.select!.param, i.select!.value) : undefined}
            >
              ${
                i.dot
                  ? html`<ui-badge slot="leading" dot .tone=${i.dot} .label=${i.dot}></ui-badge>`
                  : i.icon
                    ? html`<ui-icon slot="leading" .name=${icon(i.icon)}></ui-icon>`
                    : nothing
              }
              ${
                i.trailing !== undefined || i.tags?.length || i.actions?.length
                  ? html`<ui-flex slot="trailing" gap="2" align="center" wrap
                      >${i.tags?.map(tag)}${i.trailing !== undefined ? cell(i.trailing) : nothing}${i.actions?.map(
                        (a) => action(a, ctx),
                      )}</ui-flex
                    >`
                  : nothing
              }
            </ui-list-item>`,
        )}
      </ui-list>`
    : html`<ui-empty-state size="sm">${b.empty ?? "Nothing here yet."}</ui-empty-state>`,
);

defineBlock(
  "details",
  (b) =>
    html`<ui-description-list
      .layout=${b.layout}
      .items=${b.items.map((i) => ({ label: i.label, value: cell(i.value), note: i.note, noteTone: i.noteTone }))}
    ></ui-description-list>`,
);

defineBlock(
  "gauges",
  (b) =>
    html`<ui-flex direction="col" gap="3"
      >${b.items.map((g) => {
        const bar = g.href
          ? html`<ui-gauge
              .tone=${g.tone ?? "primary"}
              .valueText=${g.valueText ?? ""}
              .value=${g.value}
              .max=${g.max}
              .label=${g.a11y ?? `${g.label}: ${g.valueText ?? g.value}`}
              ><ui-link slot="heading" variant="hover" .href=${g.href}>${g.label}</ui-link></ui-gauge
            >`
          : html`<ui-gauge
              .tone=${g.tone ?? "primary"}
              .heading=${g.label}
              .valueText=${g.valueText ?? ""}
              .value=${g.value}
              .max=${g.max}
              .label=${g.a11y ?? `${g.label}: ${g.valueText ?? g.value}`}
            ></ui-gauge>`;
        return g.note
          ? html`<ui-flex direction="col" gap="1"
              >${bar}<ui-text variant="body-sm" color="muted">${g.note}</ui-text></ui-flex
            >`
          : bar;
      })}</ui-flex
    >`,
);

defineBlock(
  "steps",
  (b) =>
    html`<ui-steps
      ?scrollable=${b.direction !== "vertical"}
      .direction=${b.direction}
      .tone=${b.tone ?? "primary"}
      .current=${b.current}
      .items=${b.items}
    ></ui-steps>`,
);

defineBlock("chart", (b) => {
  const chart = html`<ui-chart
    .kind=${b.chart.kind}
    .label=${b.title ?? b.label ?? "Chart"}
    .labels=${b.chart.labels}
    .series=${b.chart.series}
    .format=${(v: number) => formatNumber(v, b.chart.format)}
    .target=${b.chart.target}
    .targetLabel=${b.chart.targetLabel ?? ""}
    ?highlight-last=${b.chart.highlightLast}
    ?stacked=${b.chart.stacked}
  ></ui-chart>`;
  return b.title
    ? html`<ui-card .heading=${b.title}>
        ${b.subhead ? html`<ui-text variant="body-md" color="muted">${b.subhead}</ui-text>` : nothing} ${chart}
      </ui-card>`
    : chart;
});

defineBlock(
  "alert",
  (b, ctx) =>
    html`<ui-alert .tone=${b.tone ?? "info"} .heading=${b.heading ?? ""} .description=${b.text}>
      ${
        b.actions?.length
          ? html`<ui-flex slot="actions" gap="2" wrap>${b.actions.map((a) => action(a, ctx))}</ui-flex>`
          : nothing
      }
    </ui-alert>`,
);

defineBlock(
  "empty",
  (b) =>
    html`<ui-empty-state
      .heading=${b.heading}
      .description=${b.description ?? ""}
      .icon=${icon(b.icon)}
      .tone=${b.tone ?? "neutral"}
    ></ui-empty-state>`,
);

defineBlock("tags", (b) => html`<ui-flex gap="2" align="center" wrap>${b.items.map(tag)}</ui-flex>`);

defineBlock("actions", (b, ctx) => actionBar(b.items, ctx));

defineBlock(
  "choice",
  (b, ctx) =>
    html`<ui-button-group
      size="xs"
      .label=${b.label}
      .value=${ctx.params[b.param] ?? b.value}
      .options=${b.options.map((o) => ({ value: o.value, label: o.label, icon: icon(o.icon) }))}
      @ui-change=${(e: CustomEvent<{ value: string }>) => ctx.setParam(b.param, e.detail.value)}
    ></ui-button-group>`,
);

defineBlock(
  "timeline",
  (b) =>
    html`<ui-timeline
      direction="vertical"
      compact
      .items=${b.items.map((i) => ({
        end: { time: i.time, heading: i.heading, text: i.text },
        done: i.done,
        box: "none",
        icon: i.icon
          ? html`<ui-icon
              .name=${icon(i.icon)}
              .color=${i.tone ?? "primary"}
              size="sm"
              .label=${i.heading ?? ""}
            ></ui-icon>`
          : undefined,
      }))}
    ></ui-timeline>`,
);

defineBlock("divider", () => html`<ui-divider></ui-divider>`);

defineBlock("custom", (b, ctx) => html`${ctx.mount(b.element, b.props ?? {}, b.key)}`);
