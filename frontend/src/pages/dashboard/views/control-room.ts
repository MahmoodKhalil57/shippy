import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../../cms/client.ts";
import type { Briefing } from "../../../cms/endpoints/assistant.ts";
import type {
  ControlRoom,
  CrChart,
  CrRanked,
  CrSection,
  CrSuppliers,
  CrTile,
  CrWidget,
  Period,
  Unit,
} from "../../../cms/endpoints/control-room.ts";
import { MONEY_ROLES } from "../../../cms/endpoints/insights-shared.ts";
import type { Doc } from "../../../cms/types.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import type { TableColumn } from "../../../components/primitives/data/table.ts";
import "../../../components/index.ts";
import type { Access } from "../app.ts";
import "./ask.ts";

/**
 * The control room (/control-room) — "The business, live. Briefed at 07:00." for Karim Balbaa
 * and Mohamed Helmy: the 07:00 AI briefing (GET /api/briefing, "Summarise" re-reads the live
 * records), "Ask Golden Sea" (<gs-ask>, POST /api/ask) and the management dashboards
 * (GET /api/control-room): pipeline & conversion, speed & workload, profit & cash (management
 * and finance only) and delivery & suppliers, with one period filter above the charts.
 */

const FORMAT: Record<Unit, (v: number) => string> = {
  count: (v) => Math.round(v).toLocaleString("en-US"),
  days: (v) => `${v.toFixed(1)} d`,
  minutes: (v) => `${Math.round(v)} min`,
  "usd-k": (v) => `USD ${v.toFixed(v < 10 ? 1 : 0)}k`,
  "egp-k": (v) => `EGP ${Math.round(v)}k`,
  pct: (v) => `${v.toFixed(1)}%`,
};

/** The briefing's "reading" pause before a refreshed summary appears. */
const READING_MS = 1000;

@customElement("gs-control-room")
export class GsControlRoom extends LightElement {
  @property({ attribute: false }) access?: Access;
  @property({ attribute: false }) user?: Doc & { collection: string };
  @state() private data: ControlRoom | null = null;
  @state() private brief: Briefing | null = null;
  @state() private period: Period = "12w";
  @state() private summarising = false;
  @state() private error = "";

  connectedCallback() {
    super.connectedCallback();
    void this._load();
    void this._brief();
  }

  private async _load() {
    try {
      this.data = await api.get<ControlRoom>("/control-room", { period: this.period });
    } catch (e) {
      this.error = (e as Error).message;
    }
  }

  private async _brief(refresh = false) {
    try {
      if (refresh) this.summarising = true;
      const [b] = await Promise.all([
        api.get<Briefing>("/briefing", refresh ? { refresh: 1 } : undefined),
        new Promise((r) => setTimeout(r, refresh ? READING_MS : 0)),
      ]);
      this.brief = b;
    } catch (e) {
      this.error = (e as Error).message;
    } finally {
      this.summarising = false;
    }
  }

  private _setPeriod(p: Period) {
    if (p === this.period) return;
    this.period = p;
    void this._load();
  }

  /* ---------------------------------------------------------------- pieces */

  private _tile(t: CrTile) {
    return html`<ui-card variant="border" size="sm" shadow="false" .href=${t.href}>
      <ui-flex direction="col" gap="1">
        <ui-text variant="body-md" color="muted" truncate>${t.label}</ui-text>
        <ui-text variant="headline-md" leading="tight" .color=${t.tone}>${t.value}</ui-text>
        <ui-text variant="body-sm" color="muted" clamp="2">${t.note}</ui-text>
      </ui-flex>
      ${
        t.trend
          ? html`<ui-chart
              kind="spark"
              .label=${`${t.label}, trend`}
              .labels=${t.trend.labels}
              .series=${[{ name: t.label, values: t.trend.values }]}
              .format=${FORMAT[t.trend.unit]}
            ></ui-chart>`
          : nothing
      }
    </ui-card>`;
  }

  private _briefing() {
    const b = this.brief;
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" full-width wrap>
        <ui-flex gap="2" align="center" wrap>
          <span>07:00 · daily AI briefing</span>
          <ui-badge
            size="sm"
            variant="soft"
            color="primary"
            .icon=${html`<ui-icon name="sparkles" size="xs"></ui-icon>`}
            >AI draft</ui-badge
          >
        </ui-flex>
        <ui-speak
          .text=${b && !this.summarising ? [b.greeting, ...b.items.map((i) => i.text)].join(". ") : ""}
        ></ui-speak>
        <ui-button size="xs" variant="soft" ?disabled=${this.summarising} @click=${() => void this._brief(true)}
          ><ui-icon name="sparkles" size="sm"></ui-icon>Summarise</ui-button
        >
      </ui-flex>
      ${
        !b || this.summarising
          ? html`<ui-flex gap="2" align="center" padding="4">
              <ui-loading variant="dots" size="sm" label="Reading"></ui-loading>
              <ui-text variant="body-md" color="muted"
                >Reading cases, approvals, supplier replies, invoices and FX…</ui-text
              >
            </ui-flex>`
          : html`<ui-flex direction="col" gap="3">
              <ui-text emphasized>${b.greeting}</ui-text>
              ${b.items.map(
                (i) =>
                  html`<ui-flex gap="3" align="start">
                    <ui-status size="sm" .color=${i.tone} .label=${i.tone}></ui-status>
                    <ui-flex direction="col" gap="1" grow shrink>
                      <ui-text variant="body-md">${i.text}</ui-text>
                      <ui-flex gap="1" wrap>
                        ${i.sources.map((s) => html`<ui-button size="xs" variant="ghost" .href=${s.href}>${s.label}</ui-button>`)}
                      </ui-flex>
                    </ui-flex>
                  </ui-flex>`,
              )}
              <ui-text variant="body-sm" color="muted"
                >${b.at === "07:00" ? "Written at 07:00" : `Summarised again at ${b.at}`} from ${b.read} live records. A
                draft to read — nothing is sent, priced or paid.</ui-text
              >
            </ui-flex>`
      }
    </ui-card>`;
  }

  private _chart(c: CrChart) {
    return html`<ui-card variant="border" shadow="false" .heading=${c.title}>
      <ui-text variant="body-sm" color="muted">${c.sub}</ui-text>
      <ui-chart
        .kind=${c.type}
        .label=${c.title}
        .labels=${c.labels}
        .series=${c.series}
        .format=${FORMAT[c.unit]}
        .target=${c.target}
        .targetLabel=${c.targetLabel ?? ""}
        ?highlight-last=${Boolean(c.highlightLast)}
      ></ui-chart>
    </ui-card>`;
  }

  private _ranked(r: CrRanked) {
    const max = Math.max(1, ...r.rows.map((x) => x.value), r.minimum ?? 0);
    return html`<ui-card variant="border" shadow="false" .heading=${r.title}>
      <ui-text variant="body-sm" color="muted">${r.sub}</ui-text>
      <ui-flex direction="col" gap="3">
        ${r.rows.map((row) => {
          const low = r.minimum !== undefined && row.value < r.minimum;
          return html`<ui-flex direction="col" gap="1">
            <ui-flex justify="between" gap="2" align="end">
              ${
                row.href
                  ? html`<ui-link variant="hover" .href=${row.href}
                      ><ui-text variant="body-md" truncate>${row.label}</ui-text></ui-link
                    >`
                  : html`<ui-text variant="body-md" truncate>${row.label}</ui-text>`
              }
              <ui-text variant="label-lg" .color=${low ? "error" : undefined}>${FORMAT[r.unit](row.value)}</ui-text>
            </ui-flex>
            <ui-progress
              width="full"
              .color=${low ? "error" : "primary"}
              .value=${row.value}
              .max=${max}
              .label=${`${row.label}: ${FORMAT[r.unit](row.value)}`}
            ></ui-progress>
            ${row.note ? html`<ui-text variant="body-sm" color="muted">${row.note}</ui-text>` : nothing}
          </ui-flex>`;
        })}
      </ui-flex>
    </ui-card>`;
  }

  private _suppliers(s: CrSuppliers) {
    type Row = CrSuppliers["rows"][number] & Record<string, unknown>;
    const columns: TableColumn<Row>[] = [
      {
        key: "name",
        label: "Supplier",
        render: (r) =>
          html`<ui-link variant="hover" .href=${r.href}><ui-text variant="label-lg">${r.name}</ui-text></ui-link>`,
      },
      {
        key: "onTime",
        label: "On time",
        render: (r) =>
          r.onTime === undefined
            ? html`<ui-text variant="body-md" color="muted">No deliveries yet</ui-text>`
            : html`<ui-flex direction="col" gap="1">
                <ui-text variant="body-md" .color=${r.onTime < 85 ? "warning" : undefined}>${r.onTime}%</ui-text>
                <ui-progress
                  width="xs"
                  .color=${r.onTime < 85 ? "warning" : "success"}
                  .value=${r.onTime}
                  .max=${100}
                  .label=${`${r.name} on time ${r.onTime}%`}
                ></ui-progress>
              </ui-flex>`,
      },
      {
        key: "replyHrs",
        label: "Avg reply",
        render: (r) =>
          html`<ui-text variant="body-md" .color=${(r.replyHrs ?? 0) > 24 ? "warning" : undefined}
            >${r.replyHrs === undefined ? "—" : `${r.replyHrs} h`}</ui-text
          >`,
      },
      {
        key: "open",
        label: "Open RFQs",
        render: (r) => html`<ui-text variant="body-md">${r.open || "—"}</ui-text>`,
      },
    ];
    return html`<ui-card variant="border" shadow="false" .heading=${s.title}>
      <ui-text variant="body-sm" color="muted">${s.sub}</ui-text>
      <ui-table size="sm" hover .columns=${columns} .rows=${s.rows as Row[]}></ui-table>
    </ui-card>`;
  }

  private _widget(w: CrWidget) {
    if (w.kind === "chart") return this._chart(w);
    if (w.kind === "ranked") return this._ranked(w);
    return this._suppliers(w);
  }

  private _section(s: CrSection) {
    return html`<ui-flex direction="col" gap="3">
      <ui-flex direction="col" gap="0">
        <ui-heading level="2" variant="title-md">${s.title}</ui-heading>
        <ui-text variant="body-md" color="muted">${s.sub}</ui-text>
      </ui-flex>
      <ui-grid fit="md" gap="4">${s.widgets.map((w) => this._widget(w))}</ui-grid>
    </ui-flex>`;
  }

  render() {
    if (this.error) return html`<ui-alert color="error" variant="soft">${this.error}</ui-alert>`;
    const d = this.data;
    const role = typeof this.user?.role === "string" ? this.user.role : "";
    const money = MONEY_ROLES.includes(role);
    return html`<ui-flex direction="col" gap="6">
      <ui-flex justify="between" align="end" gap="4" wrap>
        <ui-flex direction="col" gap="1" shrink>
          <ui-text variant="label-md" color="muted" uppercase>Control room · for Karim Balbaa & Mohamed Helmy</ui-text>
          <ui-heading level="1" variant="page">The business, live.</ui-heading>
          <ui-text color="muted"
            >Briefed at 07:00 from every case, quote, delivery and payment — and answers to any question about
            them.</ui-text
          >
        </ui-flex>
        <ui-flex gap="2" wrap>
          <ui-button size="sm" variant="soft" href="/approvals">Approvals</ui-button>
          ${money ? html`<ui-button size="sm" variant="soft" href="/cash">Receivables & payables</ui-button>` : nothing}
          <ui-button size="sm" color="primary" href="/collections/cases">All cases</ui-button>
        </ui-flex>
      </ui-flex>

      ${
        d
          ? html`<ui-grid fit="xs" gap="4">${d.tiles.map((t) => this._tile(t))}</ui-grid>`
          : html`<ui-flex justify="center" padding="4"><ui-loading color="primary"></ui-loading></ui-flex>`
      }

      <ui-grid fit="md" gap="4">
        ${this._briefing()}
        <ui-card variant="border" shadow="false">
          <ui-flex slot="heading" gap="2" align="center" wrap>
            <span>Ask Golden Sea</span>
            <ui-badge size="sm" variant="soft" color="primary" .icon=${html`<ui-icon name="chat" size="xs"></ui-icon>`}
              >Assistant</ui-badge
            >
          </ui-flex>
          <gs-ask></gs-ask>
        </ui-card>
      </ui-grid>

      <ui-flex justify="between" align="center" gap="3" wrap>
        <ui-flex direction="col" gap="0">
          <ui-heading level="2" variant="title-lg">Management dashboards</ui-heading>
          <ui-text variant="body-md" color="muted"
            >Today's numbers from the live records; trends from the reporting history.</ui-text
          >
        </ui-flex>
        <ui-flex gap="1" wrap>
          ${(d?.periods ?? []).map(
            (p) =>
              html`<ui-button
                size="sm"
                .variant=${p.value === this.period ? undefined : "ghost"}
                .color=${p.value === this.period ? "primary" : undefined}
                .current=${p.value === this.period ? "true" : undefined}
                @click=${() => this._setPeriod(p.value)}
                >${p.label}</ui-button
              >`,
          )}
        </ui-flex>
      </ui-flex>

      ${d ? d.sections.map((s) => this._section(s)) : nothing}
      ${
        d && !d.money
          ? html`<ui-card variant="border" shadow="false" heading="Profit & cash">
              <ui-text variant="body-md" color="muted"
                >Gross profit, margins, receivables and cash flow are shown to management and finance only.</ui-text
              >
            </ui-card>`
          : nothing
      }
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-control-room": GsControlRoom;
  }
}
