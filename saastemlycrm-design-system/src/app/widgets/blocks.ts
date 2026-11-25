import { html, nothing } from "lit";
import type { IconName } from "../../components/primitives/media/icon-names.ts";
import type { TableColumn, TableSupporting } from "../../components/primitives/data/table.ts";
import "../../components/index.ts";
import { defineBlock, inCard, renderBlocks, type ViewContext } from "./registry.ts";
import { decimalsOf } from "../../components/base/chart.ts";
import { formatNumber, type Action, type Cell, type NumberFormat, type Tag, type ViewBlock } from "./schema.ts";
import { locale, m } from "../../i18n/index.ts";

const icon = (name?: IconName) => name;

export const tag = (t: Tag) => html`<ui-tag .tone=${t.tone ?? "neutral"} .icon=${icon(t.icon)}>${t.label}</ui-tag>`;

const isLink = (a: Action) => !!a.href && !a.call && !a.print;

const look = (a: Action, linkLook: "text" | "tonal") => (a.main ? "filled" : isLink(a) ? linkLook : "tonal");
const actionColor = (a: Action) => (a.tone === "error" ? "error" : a.main ? "primary" : undefined);

const DOUBLE_CLICK_MS = 500;
const finished = new WeakMap<Element, number>();
const press = (a: Action, ctx: ViewContext) => (e: Event) => {
  const button = e.currentTarget as HTMLElementTagNameMap["ui-button"];
  if (button.loading || performance.now() - (finished.get(button) ?? -DOUBLE_CLICK_MS) < DOUBLE_CLICK_MS) return;
  const running = ctx.run(a);
  if (!running) return;
  button.loading = true;
  void running.finally(() => {
    button.loading = false;
    finished.set(button, performance.now());
  });
};

export const action = (a: Action, ctx: ViewContext, size: "xs" | "sm" = "xs", linkLook: "text" | "tonal" = "tonal") =>
  html`<ui-button
    size=${size}
    .variant=${look(a, linkLook)}
    .color=${actionColor(a)}
    .href=${a.href}
    ?disabled=${a.disabled}
    @click=${a.href ? undefined : press(a, ctx)}
    >${a.icon ? html`<ui-icon .name=${icon(a.icon)} size="sm"></ui-icon>` : nothing}${a.label}</ui-button
  >`;

const withReason = (a: Action, ctx: ViewContext) =>
  a.disabled && a.reason
    ? html`<ui-flex direction="col" gap="1"
        >${action(a, ctx)}<ui-text variant="body-sm" color="muted">${a.reason}</ui-text></ui-flex
      >`
    : action(a, ctx);

export function actionBar(items: Action[] | undefined, ctx: ViewContext) {
  if (!items?.length) return nothing;
  const links = items.filter(isLink).map((a): Action => ({ ...a, main: false }));
  const rest = items.filter((a) => !isLink(a));
  const main = rest.map((a) => !!a.main).lastIndexOf(true);
  const ordered = rest
    .map((a, i): Action => (a.main && i !== main ? { ...a, main: false } : a))
    .filter((_, i) => i !== main);
  if (main >= 0) ordered.push(rest[main]!);
  const shown = links.length > 2 ? links.slice(0, 1) : links;
  const more = links.length > 2 ? links.slice(1) : [];
  const linkRow = html`${shown.map((a) => withReason(a, ctx))}${
    more.length
      ? html`<ui-dropdown
          .label=${m.widget_blocks_more()}
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

export const initialsOf = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? [words[0]!, words[words.length - 1]!] : words;
  return letters
    .map((w) => String.fromCodePoint(w.codePointAt(0)!))
    .join("")
    .toUpperCase();
};

export function cell(c: Cell, ctx?: ViewContext, inTable = false) {
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
          undo: { ...s.call, body: { ...s.call.body, value: s.value } },
        })}
    ></ui-switch>`;
  }
  if (c.tag) return html`<ui-tag .tone=${c.tone ?? "neutral"} .hue=${c.hue}>${c.text}</ui-tag>`;
  if (c.person) {
    const name = c.href ? html`<ui-link variant="hover" .href=${c.href}>${c.text}</ui-link>` : c.text;
    return inTable
      ? html`${name}`
      : html`<ui-flex inline gap="2" align="center"
          ><ui-avatar size="xs" .initials=${initialsOf(c.text)}></ui-avatar>${name}</ui-flex
        >`;
  }
  const color = c.tone && c.tone !== "neutral" && c.tone !== "primary" ? c.tone : undefined;
  let body = html`<ui-text
    as="span"
    .variant=${inTable ? undefined : "body-md"}
    .color=${color}
    ?mono=${c.mono}
    ?emphasized=${c.strong}
    >${c.text}</ui-text
  >`;
  if (c.href) body = html`<ui-link .href=${c.href}>${body}</ui-link>`;
  if (c.dot) {
    const pill = html`<ui-tag .tone=${c.dot}>${c.text}</ui-tag>`;
    body = c.href ? html`<ui-link .href=${c.href}>${pill}</ui-link>` : pill;
  }
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
    body = inTable
      ? inLine([...(c.text ? [body] : []), ...c.tags.map(tag)])
      : html`<ui-flex inline gap="2" align="center" wrap>${c.text ? body : nothing}${c.tags.map(tag)}</ui-flex>`;
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
  if (c.actions?.length && ctx) {
    const before = c.text || c.tags?.length || c.marks?.length ? [body] : [];
    body =
      inTable && !c.marks?.length
        ? inLine([...before, ...c.actions.map((a) => action({ ...a, main: false } as Action, ctx))])
        : html`<ui-flex gap="2" align="center" wrap
            >${before}${c.actions.map((a) => action(inTable ? ({ ...a, main: false } as Action) : a, ctx))}</ui-flex
          >`;
  }
  return body;
}

const inLine = (parts: unknown[]) => html`${parts.flatMap((part, i) => (i ? [" ", part] : [part]))}`;

const supporting = (c: Cell): TableSupporting => {
  if (c === null || c === undefined) return "";
  if (typeof c === "string" || typeof c === "number") return String(c);
  const tone = c.tone === "error" || c.tone === "warning" || c.tone === "success" ? c.tone : undefined;
  return tone ? { text: c.text, tone } : c.text;
};

defineBlock(
  "card",
  (b, ctx) =>
    html`<ui-card
      .variant=${ctx.inCard ? "filled" : undefined}
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

const WIDE = new Set(["chart", "table", "list", "card", "entries", "timeline", "message", "document"]);

defineBlock(
  "grid",
  (b, ctx) =>
    html`<ui-grid .fit=${b.blocks.some((x) => WIDE.has(x.type)) ? "md" : "sm"} gap="4"
      >${renderBlocks(b.blocks, ctx)}</ui-grid
    >`,
);

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

const stat = (
  s: Extract<ViewBlock, { type: "stats" }>["items"][number],
  b: Extract<ViewBlock, { type: "stats" }>,
  ctx: ViewContext,
  main: boolean,
  fill = false,
) =>
  html`<ui-stat
    ?main=${main}
    ?outlined=${!ctx.inCard}
    ?fill=${fill}
    ?mini=${!!b.mini}
    .size=${b.size ?? "lg"}
    .href=${s.href}
    .label=${s.label}
    .value=${s.value}
    .note=${s.note ?? ""}
    .tone=${s.tone}
    .delta=${s.delta?.text ?? ""}
    .deltaDir=${s.delta?.dir ?? "flat"}
    .deltaTone=${s.delta?.good === undefined ? "neutral" : s.delta.good ? "success" : "error"}
    .share=${s.share?.value}
    .shareText=${s.share?.text ?? ""}
  >
    ${
      s.trend
        ? html`<ui-chart
            slot="trend"
            kind="spark"
            .height=${fill ? "fill" : "spark"}
            .label=${`${s.label}, trend`}
            .labels=${s.trend.labels}
            .series=${[{ name: s.label, values: s.trend.values }]}
            .format=${(v: number) => formatNumber(v, s.trend?.format)}
          ></ui-chart>`
        : nothing
    }
  </ui-stat>`;

defineBlock("stats", (b, ctx) =>
  b.mini && b.items[0]
    ? stat(b.items[0], b, ctx, !!b.items[0].main)
    : b.items.length === 1 && !ctx.inCard
      ? stat(b.items[0]!, b, ctx, !!b.items[0]!.main, true)
      : html`<ui-grid
          .balance=${b.items.length >= 2 && b.items.length <= 6 ? (String(b.items.length) as "2") : undefined}
          .fit=${b.items.length >= 2 && b.items.length <= 6 ? undefined : "xs"}
          gap="3"
          >${b.items.map((s, i) => stat(s, b, ctx, !!s.main && b.items.findIndex((x) => x.main) === i))}</ui-grid
        >`,
);

defineBlock("heading", (b) => html`<ui-heading level="3" variant="title-sm">${b.text}</ui-heading>`);

defineBlock("text", (b) => {
  const text = html`<ui-text
    .variant=${b.muted ? "body-sm" : "body-md"}
    .color=${b.muted ? "muted" : undefined}
    pre-line
    >${b.text}</ui-text
  >`;
  return b.speak
    ? html`<ui-flex direction="col" gap="2"
        >${text}<ui-speak
          .text=${b.text}
          .lang=${typeof b.speak === "string" ? b.speak : locale() === "ar" ? "ar" : "en-GB"}
        ></ui-speak
      ></ui-flex>`
    : text;
});

defineBlock("table", (b, ctx) => {
  const columns: TableColumn[] = b.columns.map((c, i) => ({
    key: c.key,
    label: c.label,
    align: c.align,
    render: (row) => cell(row[c.key] as Cell, ctx, true),
    supporting: c.supporting ? (row) => supporting(row[c.supporting!] as Cell) : undefined,
    avatar: (row) => {
      const v = row[c.key] as Cell;
      return v && typeof v === "object" && v.person ? { initials: initialsOf(v.text) } : undefined;
    },
    fixed: i === 0,
  }));
  return b.rows.length
    ? html`<ui-table
        .size=${b.size ?? "sm"}
        lines="one"
        hover
        ?footer=${b.totals}
        .columns=${columns}
        .rows=${b.rows}
      ></ui-table>`
    : html`<ui-empty-state size="sm">${b.empty ?? m.widget_empty()}</ui-empty-state>`;
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
              .leadingText=${i.lead ?? ""}
              .trailingText=${i.value !== undefined ? cell(i.value) : ""}
              .lines=${i.lead ? "1" : "2"}
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
              ${i.tags?.length ? i.tags.map(tag) : nothing}
              ${
                i.trailing !== undefined || i.actions?.length
                  ? html`<ui-flex slot="trailing" gap="2" align="center" wrap
                      >${i.trailing !== undefined ? cell(i.trailing) : nothing}${i.actions?.map((a) => action(a, ctx))}</ui-flex
                    >`
                  : i.lead && i.href
                    ? html`<ui-icon slot="trailing" name="chevron-right" size="sm" color="muted"></ui-icon>`
                    : nothing
              }
            </ui-list-item>`,
        )}
      </ui-list>`
    : html`<ui-empty-state size="sm">${b.empty ?? m.widget_empty()}</ui-empty-state>`,
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

const chartTick = (v: number, step: number, f: NumberFormat = {}) => {
  if (v === 0) return "0";
  const compact = f.unit === "money" && (f.compact || step >= 1000);
  return formatNumber(v, { ...f, currency: undefined, compact, decimals: decimalsOf(compact ? step / 1000 : step) });
};

defineBlock("chart", (b) => {
  const chart = html`<ui-chart
    .kind=${b.chart.kind}
    .label=${b.title ?? b.label ?? m.widget_blocks_chart()}
    .labels=${b.chart.labels}
    .series=${b.chart.series}
    .format=${(v: number) => formatNumber(v, b.chart.format)}
    .tickFormat=${(v: number, step: number) => chartTick(v, step, b.chart.format)}
    .target=${b.chart.target}
    .targetLabel=${b.chart.targetLabel ?? ""}
    .ranges=${b.chart.ranges ?? []}
    .range=${b.chart.range}
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
  "ring",
  (b) =>
    html`<ui-ring
      .parts=${b.parts}
      .max=${b.max}
      .label=${b.label ?? ""}
      .centerLabel=${b.center ?? ""}
      .totalText=${b.total ?? ""}
    ></ui-ring>`,
);

defineBlock(
  "funnel",
  (b) =>
    html`<ui-funnel
      .stages=${b.stages}
      .label=${b.label ?? ""}
      .step=${b.step ?? m.widget_blocks_funnel_step()}
    ></ui-funnel>`,
);

defineBlock(
  "heatmap",
  (b) => html`<ui-heatmap .cells=${b.days} .label=${b.label ?? ""} .summary=${b.summary ?? ""}></ui-heatmap>`,
);

defineBlock(
  "bullet",
  (b) =>
    html`<ui-flex direction="col" gap="3"
      >${b.items.map(
        (i) =>
          html`<ui-bullet
            .heading=${i.label}
            .label=${i.label}
            .value=${i.value}
            .max=${i.max}
            .min=${i.min ?? 0}
            .target=${i.target}
            .bands=${i.bands}
            .valueText=${i.valueText ?? ""}
            .targetText=${i.targetText ?? ""}
            .lowerIsBetter=${!!i.lowerIsBetter}
          ></ui-bullet>`,
      )}</ui-flex
    >`,
);

defineBlock(
  "dial",
  (b) =>
    html`<ui-dial
      .value=${b.value}
      .min=${b.min ?? 0}
      .max=${b.max}
      .valueText=${b.valueText ?? ""}
      .caption=${b.caption ?? ""}
      .label=${b.label ?? ""}
      .zones=${b.zones}
    ></ui-dial>`,
);

defineBlock(
  "waffle",
  (b) =>
    html`<ui-waffle
      .value=${b.value ?? 0}
      .max=${b.max ?? 100}
      .valueText=${b.valueText ?? ""}
      .caption=${b.caption ?? ""}
      .label=${b.label ?? ""}
      .parts=${b.parts}
    ></ui-waffle>`,
);

defineBlock(
  "share",
  (b) => html`<ui-share-bar .parts=${b.parts} .total=${b.total} .label=${b.label ?? ""}></ui-share-bar>`,
);

defineBlock(
  "treemap",
  (b) => html`<ui-treemap .items=${b.items} .total=${b.total} .label=${b.label ?? ""}></ui-treemap>`,
);

defineBlock(
  "waterfall",
  (b) =>
    html`<ui-waterfall
      .steps=${b.steps}
      .fit=${b.fit ?? false}
      .label=${b.label ?? ""}
      .format=${(n: number) => formatNumber(n, b.format)}
    ></ui-waterfall>`,
);

defineBlock(
  "quadrant",
  (b) =>
    html`<ui-quadrant
      .points=${b.points}
      .xLabel=${b.xLabel}
      .yLabel=${b.yLabel}
      .xMid=${b.xMid}
      .yMid=${b.yMid}
      .xDomain=${b.xDomain}
      .yDomain=${b.yDomain}
      .quadrants=${b.quadrants}
      .invertY=${!!b.invertY}
      .label=${b.label ?? ""}
    ></ui-quadrant>`,
);

defineBlock(
  "countdown",
  (b) => html`<ui-countdown .items=${b.items} .now=${b.now} .label=${b.label ?? ""}></ui-countdown>`,
);

defineBlock(
  "month",
  (b) =>
    html`<ui-month
      .month=${b.month}
      .today=${b.today}
      .events=${b.events}
      .weekStart=${b.weekStart}
      .label=${b.label ?? ""}
    ></ui-month>`,
);

defineBlock(
  "whatif",
  (b) =>
    html`<ui-whatif
      .inputs=${b.inputs.map((i) => ({ ...i, format: (n: number) => formatNumber(n, i.format) }))}
      .compute=${b.compute}
      .label=${b.label ?? ""}
    ></ui-whatif>`,
);

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
