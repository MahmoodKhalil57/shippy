import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { api } from "../../cms/client.ts";
import { text } from "../../cms/runtime/util.ts";
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
  /** Unread notifications, as lines for "While you were away" (summarised on the device). */
  @state() private unread = "";

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private async _load() {
    try {
      this.home = await api.get<Home>("/home");
      const { docs } = await api
        .find("notifications", { where: { read: { equals: false } }, sort: "-at", limit: 20, depth: 0 })
        .catch(() => ({ docs: [] }));
      this.unread = docs.map((n) => `${text(n.kind)}: ${text(n.title)} — ${text(n.detail)}`).join("\n");
    } catch (e) {
      this.error = (e as Error).message;
    }
  }

  private _tile(t: HomeTile) {
    return html`<ui-stat
      size="lg"
      .href=${t.href}
      .label=${t.label}
      .value=${t.value}
      .note=${t.note ?? ""}
      .tone=${t.tone && t.tone !== "info" ? t.tone : undefined}
    >
      ${
        t.trend
          ? html`<ui-chart
              slot="trend"
              kind="spark"
              .label=${`${t.label}, by week`}
              .labels=${t.trend.labels}
              .series=${[{ name: t.label, values: t.trend.values }]}
              .format=${FORMAT[t.trend.unit]}
            ></ui-chart>`
          : nothing
      }
    </ui-stat>`;
  }

  private _chart(c: HomeChart) {
    return html`<ui-card .heading=${c.title}>
      <ui-text variant="body-md" color="muted">${c.sub}</ui-text>
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
    return html`<ui-list-item .headline=${i.title} .supporting=${i.sub} .href=${i.href}>
      <ui-badge slot="leading" dot .tone=${STATUS[i.tone]} .label=${i.tone}></ui-badge>
      ${i.badge ? html`<ui-tag slot="trailing" .tone=${i.tone === "error" ? "error" : "neutral"}>${i.badge}</ui-tag>` : nothing}
    </ui-list-item>`;
  }

  private _list(l: Extract<HomeWidget, { kind: "lists" }>["lists"][number]) {
    return html`<ui-card .count=${l.items.length} .subhead=${l.sub ?? ""}>
      <span slot="heading">${l.title}</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap
        >${l.href ? html`<ui-button size="xs" variant="text" .href=${l.href}>${l.hrefLabel ?? "All"}</ui-button>` : nothing}</ui-flex
      >
      ${
        l.items.length
          ? html`<ui-list>${l.items.map((i) => this._item(i))}</ui-list>`
          : html`<ui-text variant="body-md" color="muted">${l.empty}</ui-text>`
      }
    </ui-card>`;
  }

  private _queue(q: Extract<HomeWidget, { kind: "queue" }>) {
    const columns: TableColumn<HomeCase & Record<string, unknown>>[] = [
      {
        key: "caseId",
        label: "Case",
        render: (c) => html`<ui-link .href=${c.href}>${c.caseId}</ui-link>`,
        supporting: (c) => (c.urgent ? { text: "Urgent", tone: "error" } : ""),
      },
      {
        key: "customer",
        label: "Customer · vessel",
        render: (c) => c.customer,
        supporting: (c) => `${c.vessel} · ${c.port}`,
      },
      {
        key: "stage",
        label: "Stage",
        render: (c) =>
          html`<ui-flex gap="2" align="center">
            <ui-badge dot .tone=${c.tone} .label=${c.risk}></ui-badge>
            <ui-text variant="label-lg">${c.stage}</ui-text>
          </ui-flex>`,
        supporting: (c) => c.wait ?? "",
      },
      {
        key: "lines",
        label: "Lines",
        render: (c) => {
          const l = c.lines;
          if (!l) return html`<ui-text variant="body-md" color="muted">—</ui-text>`;
          const total = l.ready + l.waiting + l.blocked + l.noOffer;
          return html`<ui-gauge
            tone=${l.blocked ? "warning" : "success"}
            width="xs"
            .value=${l.ready}
            .max=${total}
            .label=${`${l.ready} of ${total} lines ready`}
          ></ui-gauge>`;
        },
        supporting: (c) => {
          const l = c.lines;
          if (!l) return "";
          const total = l.ready + l.waiting + l.blocked + l.noOffer;
          return `${l.ready}/${total} ready${l.blocked ? ` · ${l.blocked} blocked` : ""}`;
        },
      },
      {
        key: "deadline",
        label: "Deadline",
        render: (c) => c.deadline,
        supporting: (c) => (c.overdue ? { text: c.due, tone: "error" } : c.due),
      },
      {
        key: "next",
        label: "Next action · blocker",
        render: (c) => c.next,
        supporting: (c) =>
          c.blocker ? { text: `⚑ ${c.blocker}`, tone: c.tone === "error" ? "error" : undefined } : "",
      },
      ...(q.owners
        ? [
            {
              key: "owner",
              label: "Owner",
              render: (c: HomeCase) => html`<ui-text variant="body-md">${c.owner}</ui-text>`,
            },
          ]
        : []),
      ...(q.value
        ? [
            {
              key: "value",
              label: "Value",
              render: (c: HomeCase) =>
                html`<ui-text variant="body-md" align="end"
                  >${c.value === undefined ? "—" : `USD ${c.value.toLocaleString("en-US")}`}</ui-text
                >`,
            },
          ]
        : []),
    ];
    return html`<ui-card .count=${q.cases.length}>
      <span slot="heading">${q.title}</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap
        ><ui-button size="xs" variant="text" .href=${q.href}>All cases</ui-button></ui-flex
      >
      <ui-text variant="body-sm" color="muted">${q.sub}</ui-text>
      ${
        q.cases.length
          ? html`<ui-table
              size="sm"
              hover
              .columns=${columns}
              .rows=${q.cases as unknown as Record<string, unknown>[]}
            ></ui-table>`
          : html`<ui-empty-state size="sm">No live cases.</ui-empty-state>`
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
    if (this.error)
      return html`<ui-empty-state
        tone="error"
        heading="This page couldn't load"
        .description=${this.error}
      ></ui-empty-state>`;
    const h = this.home;
    if (!h) return html`<ui-empty-state loading></ui-empty-state>`;
    return html`<ui-flex direction="col" gap="6">
      <ui-page-header>
        <span slot="eyebrow">${h.eyebrow}</span>
        <span slot="heading">${h.greeting}</span>
        <span slot="subtitle">${h.subtitle}</span>
        <ui-ai-summary
          label="While you were away"
          context="Unread notifications for someone back at their desk at a ship chandler: say what needs them first."
          .text=${this.unread}
        ></ui-ai-summary>
        <ui-flex slot="actions" gap="2" wrap>
          ${h.actions.map(
            (a) =>
              html`<ui-button size="xs" .href=${a.href} .variant=${a.primary ? "filled" : "tonal"}
                >${a.label}</ui-button
              >`,
          )}
        </ui-flex>
      </ui-page-header>
      ${h.widgets.map((w) => this._widget(w))}
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-home": DashboardHome;
  }
}
