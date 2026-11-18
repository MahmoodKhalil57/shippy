import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { api } from "../../cms/client.ts";
import type { Home, HomeCase, HomeChart, HomeItem, HomeTile, HomeUnit, HomeWidget } from "../../cms/endpoints/home.ts";
import { LightElement } from "../../components/base/light-element.ts";
import type { TableColumn } from "../../components/primitives/data/table.ts";
import "../../components/index.ts";

/**
 * The dashboard's home (Payload: `admin.components.views.dashboard`): the signed-in user's day,
 * tailored to their role by GET /api/home (src/cms/endpoints/home.ts). The endpoint picks the
 * widgets; this view lays them out — header, KPI tiles with trends, decision / briefing /
 * follow-up lists, the case queue and charts — from `ui-*` elements only.
 */

/** How each unit reads in tiles, tooltips and axes. */
const FORMAT: Record<HomeUnit, (v: number) => string> = {
  count: (v) => Math.round(v).toLocaleString("en-US"),
  days: (v) => `${v.toFixed(1)} d`,
  minutes: (v) => `${Math.round(v)} min`,
  "usd-k": (v) => `USD ${v.toFixed(v < 10 ? 1 : 0)}k`,
  "egp-k": (v) => `EGP ${Math.round(v)}k`,
  pct: (v) => `${v.toFixed(1)}%`,
};

type Tone = HomeItem["tone"];
const STATUS: Record<Tone, "error" | "warning" | "info" | "success" | "neutral"> = {
  error: "error",
  warning: "warning",
  info: "info",
  success: "success",
  neutral: "neutral",
};

@customElement("dashboard-home")
export class DashboardHome extends LightElement {
  @state() private home: Home | null = null;
  @state() private error = "";

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private async _load() {
    try {
      this.home = await api.get<Home>("/home");
    } catch (e) {
      this.error = (e as Error).message;
    }
  }

  private _tile(t: HomeTile) {
    return html`<ui-card variant="border" size="sm" shadow="false" .href=${t.href}>
      <ui-flex direction="col" gap="1">
        <ui-text size="sm" color="muted" truncate>${t.label}</ui-text>
        <ui-text size="3xl" weight="semibold" leading="tight" .color=${t.tone && t.tone !== "info" ? t.tone : undefined}
          >${t.value}</ui-text
        >
        ${t.note ? html`<ui-text size="xs" color="muted" clamp="2">${t.note}</ui-text>` : nothing}
      </ui-flex>
      ${
        t.trend
          ? html`<ui-chart
              kind="spark"
              .label=${`${t.label}, by week`}
              .labels=${t.trend.labels}
              .series=${[{ name: t.label, values: t.trend.values }]}
              .format=${FORMAT[t.trend.unit]}
            ></ui-chart>`
          : nothing
      }
    </ui-card>`;
  }

  private _chart(c: HomeChart) {
    return html`<ui-card variant="border" shadow="false" .heading=${c.title}>
      <ui-text size="sm" color="muted">${c.sub}</ui-text>
      <ui-chart
        .kind=${c.kind}
        .label=${c.title}
        .labels=${c.labels}
        .series=${c.series}
        .format=${FORMAT[c.unit]}
        .target=${c.target}
        .targetLabel=${c.targetLabel ?? ""}
        ?highlight-last=${c.highlightLast}
      ></ui-chart>
    </ui-card>`;
  }

  private _item(i: HomeItem) {
    return html`<ui-flex gap="3" align="start">
      <ui-status size="sm" .color=${STATUS[i.tone]} .label=${i.tone}></ui-status>
      <ui-flex direction="col" gap="0" grow shrink>
        ${
          i.href
            ? html`<ui-link variant="hover" .href=${i.href}
                ><ui-text size="sm" weight="medium">${i.title}</ui-text></ui-link
              >`
            : html`<ui-text size="sm" weight="medium">${i.title}</ui-text>`
        }
        <ui-text size="xs" color="muted" clamp="2">${i.sub}</ui-text>
      </ui-flex>
      ${
        i.badge
          ? html`<ui-badge size="sm" variant="soft" .color=${i.tone === "error" ? "error" : "neutral"}
              >${i.badge}</ui-badge
            >`
          : nothing
      }
    </ui-flex>`;
  }

  private _list(l: Extract<HomeWidget, { kind: "lists" }>["lists"][number]) {
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" full-width>
        <ui-flex gap="2" align="center"
          >${l.title}<ui-badge size="sm" variant="soft">${l.items.length}</ui-badge></ui-flex
        >
        ${l.href ? html`<ui-button size="xs" variant="ghost" .href=${l.href}>${l.hrefLabel ?? "All"}</ui-button>` : nothing}
      </ui-flex>
      ${l.sub ? html`<ui-text size="xs" color="muted">${l.sub}</ui-text>` : nothing}
      <ui-flex direction="col" gap="3">
        ${l.items.length ? l.items.map((i) => this._item(i)) : html`<ui-text size="sm" color="muted">${l.empty}</ui-text>`}
      </ui-flex>
    </ui-card>`;
  }

  private _queue(q: Extract<HomeWidget, { kind: "queue" }>) {
    const columns: TableColumn<HomeCase & Record<string, unknown>>[] = [
      {
        key: "caseId",
        label: "Case",
        render: (c) =>
          html`<ui-flex direction="col" gap="0">
            <ui-link .href=${c.href} color="primary"
              ><ui-text size="sm" weight="semibold" truncate>${c.caseId}</ui-text></ui-link
            >
            ${c.urgent ? html`<ui-text size="xs" color="error">Urgent</ui-text>` : nothing}
          </ui-flex>`,
      },
      {
        key: "customer",
        label: "Customer · vessel",
        render: (c) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text size="sm">${c.customer}</ui-text>
            <ui-text size="xs" color="muted">${c.vessel} · ${c.port}</ui-text>
          </ui-flex>`,
      },
      {
        key: "stage",
        label: "Stage",
        render: (c) =>
          html`<ui-flex direction="col" gap="1" align="start">
            <ui-flex gap="2" align="center">
              <ui-status size="sm" .color=${c.tone} .label=${c.risk}></ui-status>
              <ui-text size="sm" weight="medium">${c.stage}</ui-text>
            </ui-flex>
            ${c.wait ? html`<ui-text size="xs" color="muted">${c.wait}</ui-text>` : nothing}
          </ui-flex>`,
      },
      {
        key: "lines",
        label: "Lines",
        render: (c) => {
          const l = c.lines;
          if (!l) return html`<ui-text size="sm" color="muted">—</ui-text>`;
          const total = l.ready + l.waiting + l.blocked + l.noOffer;
          return html`<ui-flex direction="col" gap="1">
            <ui-progress
              color=${l.blocked ? "warning" : "success"}
              width="xs"
              .value=${l.ready}
              .max=${total}
              .label=${`${l.ready} of ${total} lines ready`}
            ></ui-progress>
            <ui-text size="xs" color="muted"
              >${l.ready}/${total} ready${l.blocked ? ` · ${l.blocked} blocked` : ""}</ui-text
            >
          </ui-flex>`;
        },
      },
      {
        key: "deadline",
        label: "Deadline",
        render: (c) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text size="sm">${c.deadline}</ui-text>
            <ui-text size="xs" .color=${c.overdue ? "error" : "muted"}>${c.due}</ui-text>
          </ui-flex>`,
      },
      {
        key: "next",
        label: "Next action · blocker",
        render: (c) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text size="sm">${c.next}</ui-text>
            ${c.blocker ? html`<ui-text size="xs" .color=${c.tone === "error" ? "error" : "muted"}>⚑ ${c.blocker}</ui-text>` : nothing}
          </ui-flex>`,
      },
      ...(q.owners
        ? [{ key: "owner", label: "Owner", render: (c: HomeCase) => html`<ui-text size="sm">${c.owner}</ui-text>` }]
        : []),
      ...(q.value
        ? [
            {
              key: "value",
              label: "Value",
              render: (c: HomeCase) =>
                html`<ui-text size="sm" align="end"
                  >${c.value === undefined ? "—" : `USD ${c.value.toLocaleString("en-US")}`}</ui-text
                >`,
            },
          ]
        : []),
    ];
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" full-width>
        <ui-flex gap="2" align="center"
          >${q.title}<ui-badge size="sm" variant="soft">${q.cases.length}</ui-badge></ui-flex
        >
        <ui-button size="xs" variant="ghost" .href=${q.href}>All cases</ui-button>
      </ui-flex>
      <ui-text size="xs" color="muted">${q.sub}</ui-text>
      ${
        q.cases.length
          ? html`<ui-table
              size="sm"
              hover
              .columns=${columns}
              .rows=${q.cases as unknown as Record<string, unknown>[]}
            ></ui-table>`
          : html`<ui-text size="sm" color="muted">No live cases.</ui-text>`
      }
    </ui-card>`;
  }

  private _widget(w: HomeWidget) {
    switch (w.kind) {
      case "tiles":
        return html`<ui-grid fit="xs" gap="4">${w.tiles.map((t) => this._tile(t))}</ui-grid>`;
      case "charts":
        return html`<ui-grid fit="md" gap="4">${w.charts.map((c) => this._chart(c))}</ui-grid>`;
      case "lists":
        return html`<ui-grid fit="md" gap="4">${w.lists.map((l) => this._list(l))}</ui-grid>`;
      case "queue":
        return this._queue(w);
    }
  }

  render() {
    if (this.error) return html`<ui-alert color="error" variant="soft">${this.error}</ui-alert>`;
    const h = this.home;
    if (!h)
      return html`<ui-flex justify="center" padding="8"><ui-loading size="lg" color="primary"></ui-loading></ui-flex>`;
    return html`<ui-flex direction="col" gap="6">
      <ui-flex justify="between" align="end" gap="4" wrap>
        <ui-flex direction="col" gap="1" shrink>
          <ui-text size="xs" color="muted" weight="medium" uppercase>${h.eyebrow}</ui-text>
          <ui-heading level="1" size="page">${h.greeting}</ui-heading>
          <ui-text color="muted">${h.subtitle}</ui-text>
        </ui-flex>
        <ui-flex gap="2" wrap>
          ${h.actions.map(
            (a) =>
              html`<ui-button
                size="sm"
                .href=${a.href}
                .color=${a.primary ? "primary" : undefined}
                .variant=${a.primary ? undefined : "soft"}
                >${a.label}</ui-button
              >`,
          )}
        </ui-flex>
      </ui-flex>
      ${h.widgets.map((w) => this._widget(w))}
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-home": DashboardHome;
  }
}
