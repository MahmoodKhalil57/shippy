import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../../cms/client.ts";
import type {
  CaseProfit,
  CloseCheck,
  LineState,
  ProfitClaim,
  ProfitFx,
  ProfitLine,
} from "../../../cms/endpoints/profit.ts";
import { egp, formatDateTime, pct, signed } from "../../../cms/endpoints/insights-shared.ts";
import type { Doc } from "../../../cms/types.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import type { TableColumn } from "../../../components/primitives/data/table.ts";
import "../../../components/index.ts";
import { toast } from "../shared.ts";
import type { Access } from "../app.ts";

/**
 * Case tab "Profit & close" (/collections/cases/<id>/profit): the gross profit expected when the
 * quotation was approved against the actual once costs are billed, the FX differences on the
 * customer's receipts, claims, and the close checklist — the case closes only when every check
 * is green. Data and actions: /api/case-profit/:id (src/cms/endpoints/profit.ts). Sales never
 * sees this tab's numbers (the endpoint refuses).
 */

type Pending =
  | { kind: "actuals" }
  | { kind: "receipt"; reference: string }
  | { kind: "claim"; claim: ProfitClaim }
  | { kind: "close" };

const STATE_COLOR: Record<LineState, "success" | "warning" | "neutral" | "info"> = {
  Confirmed: "success",
  Billed: "warning",
  Estimate: "neutral",
  "Not applicable": "info",
};
const STATE_LABEL: Record<LineState, string> = {
  Confirmed: "Actual",
  Billed: "Billed — to confirm",
  Estimate: "Estimate",
  "Not applicable": "Not applicable",
};

type Row = Record<string, unknown> & {
  label: string;
  detail: string;
  expected: number;
  actual?: number;
  state?: LineState;
  note?: string;
  href?: string;
  total?: boolean;
};

@customElement("gs-case-profit")
export class GsCaseProfit extends LightElement {
  @property({ attribute: false }) access?: Access;
  @property({ attribute: false }) user?: Doc & { collection: string };
  @property() slug = "cases";
  @property() docId = "";
  @state() private p: CaseProfit | null = null;
  @state() private error = "";
  @state() private denied = false;
  @state() private pending: Pending | null = null;
  @state() private busy = false;

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private async _load() {
    try {
      this.p = await api.get<CaseProfit>(`/case-profit/${encodeURIComponent(this.docId)}`);
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (status === 403) this.denied = true;
      else this.error = (e as Error).message;
    }
  }

  private async _confirm() {
    const p = this.p;
    const job = this.pending;
    if (!p || !job) return;
    this.busy = true;
    const base = `/case-profit/${encodeURIComponent(p.id)}`;
    try {
      if (job.kind === "actuals") {
        this.p = await api.post<CaseProfit>(`${base}/actuals`);
        toast("Actual costs confirmed — estimates replaced on the case");
      } else if (job.kind === "receipt") {
        this.p = await api.post<CaseProfit>(`${base}/receipt`, { reference: job.reference });
        toast(`Receipt ${job.reference} recorded and allocated to ${p.receipt?.number}`);
      } else if (job.kind === "claim") {
        this.p = await api.post<CaseProfit>(`${base}/claims/${encodeURIComponent(job.claim.ref)}`);
        toast(`Credit note ${job.claim.creditNote} recorded — claim ${job.claim.ref} settled`);
      } else {
        this.p = await api.post<CaseProfit>(`${base}/close`);
        toast(`${p.caseId} closed — supplier prices and on-time results fed back`);
      }
      this.pending = null;
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = false;
    }
  }

  /* ---------------------------------------------------------------- sections */

  private _tile(label: string, value: string, note: string, color?: "success" | "error" | "warning") {
    return html`<ui-card variant="border" size="sm" shadow="false">
      <ui-flex direction="col" gap="1">
        <ui-text size="sm" color="muted" truncate>${label}</ui-text>
        <ui-text size="2xl" weight="semibold" leading="tight" .color=${color}>${value}</ui-text>
        <ui-text size="xs" color="muted" clamp="2">${note}</ui-text>
      </ui-flex>
    </ui-card>`;
  }

  private _tiles(p: CaseProfit) {
    const diff = p.actual.profit - p.expected.profit;
    const open = p.checks.filter((k) => !k.ok).length;
    return html`<ui-grid fit="xs" gap="4">
      ${this._tile("Expected gross profit", egp(p.expected.profit), `at quotation · ${pct(p.expected.margin)} margin`)}
      ${this._tile(
        p.actual.final ? "Actual gross profit" : "Actual gross profit so far",
        egp(p.actual.profit),
        `${pct(p.actual.margin)} margin · ${p.actual.final ? "final — every cost is actual" : `${open} close check${open === 1 ? "" : "s"} open`}`,
        p.actual.margin < 15 ? "error" : undefined,
      )}
      ${this._tile(
        "Difference",
        signed(Math.round(diff), egp),
        `${signed(p.actual.margin - p.expected.margin, (n) => `${n.toFixed(1)} pts`)} of margin`,
        diff < 0 ? "error" : "success",
      )}
      ${this._tile(
        "FX difference",
        p.currency === "EGP" ? "—" : signed(Math.round(p.fxTotal), egp),
        p.currency === "EGP"
          ? "invoiced in EGP"
          : `quoted at ${p.quoteRate.toFixed(2)} · today ${p.currentRate.toFixed(2)} EGP/${p.currency}`,
        p.fxTotal < 0 ? "error" : undefined,
      )}
    </ui-grid>`;
  }

  private _costs(p: CaseProfit) {
    const money = (v?: number) => html`<ui-text size="sm" align="end">${v === undefined ? "—" : egp(v)}</ui-text>`;
    const columns: TableColumn<Row>[] = [
      {
        key: "label",
        label: "Cost",
        render: (r) =>
          html`<ui-flex direction="col" gap="0">
            ${
              r.href
                ? html`<ui-link .href=${r.href} variant="hover"
                    ><ui-text size="sm" .weight=${r.total ? "semibold" : "medium"}>${r.label}</ui-text></ui-link
                  >`
                : html`<ui-text size="sm" .weight=${r.total ? "semibold" : "medium"}>${r.label}</ui-text>`
            }
            ${r.detail ? html`<ui-text size="xs" color="muted">${r.detail}</ui-text>` : nothing}
            ${r.note ? html`<ui-text size="xs" color="warning">${r.note}</ui-text>` : nothing}
          </ui-flex>`,
      },
      { key: "expected", label: "Expected", render: (r) => money(r.expected) },
      { key: "actual", label: "Actual", render: (r) => money(r.actual) },
      {
        key: "difference",
        label: "Difference",
        render: (r) => {
          if (r.actual === undefined) return html`<ui-text size="sm" align="end" color="muted">—</ui-text>`;
          const d = r.actual - r.expected;
          return html`<ui-text size="sm" align="end" .color=${d > 0 ? "error" : d < 0 ? "success" : "muted"}
            >${signed(Math.round(d), egp)}</ui-text
          >`;
        },
      },
      {
        key: "state",
        label: "Status",
        render: (r) =>
          r.state
            ? html`<ui-badge size="sm" variant="soft" .color=${STATE_COLOR[r.state]}>${STATE_LABEL[r.state]}</ui-badge>`
            : nothing,
      },
    ];
    const rows: Row[] = p.lines.map((l: ProfitLine) => ({ ...l }));
    rows.push({
      label: "Total cost",
      detail: "",
      expected: p.expected.cost,
      actual: p.actual.cost,
      total: true,
    });
    const action = p.checks.find((k) => k.key === "actuals")?.action;
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" full-width wrap>
        <span>Expected vs actual cost</span>
        ${
          action
            ? html`<ui-button size="xs" color="primary" @click=${() => (this.pending = { kind: "actuals" })}
                >Confirm actuals</ui-button
              >`
            : nothing
        }
      </ui-flex>
      <ui-text size="xs" color="muted"
        >Costs as estimated when the quotation was approved, and as billed. Bills replace estimates once a person
        confirms them; nothing changes on its own.</ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${rows}></ui-table>
    </ui-card>`;
  }

  private _revenue(p: CaseProfit) {
    const columns: TableColumn<ProfitFx & Record<string, unknown>>[] = [
      {
        key: "label",
        label: "Receipt",
        render: (r) =>
          html`<ui-flex direction="col" gap="0">
            ${
              r.href
                ? html`<ui-link .href=${r.href} variant="hover"
                    ><ui-text size="sm" weight="medium">${r.label}</ui-text></ui-link
                  >`
                : html`<ui-text size="sm" weight="medium">${r.label}</ui-text>`
            }
            <ui-text size="xs" color="muted">${r.amount}</ui-text>
          </ui-flex>`,
      },
      {
        key: "rate",
        label: "Rate",
        render: (r) =>
          html`<ui-text size="sm" align="end">${r.rate.toFixed(2)}</ui-text
            ><ui-text size="xs" color="muted" align="end">quoted ${r.quoteRate.toFixed(2)}</ui-text>`,
      },
      {
        key: "difference",
        label: "FX difference",
        render: (r) =>
          html`<ui-text
            size="sm"
            align="end"
            .color=${r.difference < 0 ? "error" : r.difference > 0 ? "success" : "muted"}
            >${signed(Math.round(r.difference), egp)}</ui-text
          >`,
      },
      {
        key: "realised",
        label: "",
        render: (r) =>
          html`<ui-badge size="sm" variant="soft" .color=${r.realised ? "success" : "neutral"}
            >${r.realised ? "Realised" : "Unrealised"}</ui-badge
          >`,
      },
    ];
    return html`<ui-card variant="border" shadow="false" heading="FX differences">
      <ui-text size="xs" color="muted"
        >Revenue is booked at the quotation's rate (${p.quoteRate.toFixed(2)} EGP/${p.currency}); each receipt converts
        at the bank's actual rate. Expected revenue ${egp(p.expected.revenue)} · actual
        ${egp(p.actual.revenue)}.</ui-text
      >
      ${
        p.currency === "EGP"
          ? html`<ui-text size="sm">Invoiced in EGP — no exchange-rate difference.</ui-text>`
          : p.fx.length
            ? html`<ui-table
                size="sm"
                .columns=${columns}
                .rows=${p.fx as (ProfitFx & Record<string, unknown>)[]}
              ></ui-table>`
            : html`<ui-text size="sm" color="muted">No receipts yet.</ui-text>`
      }
    </ui-card>`;
  }

  private _claims(p: CaseProfit) {
    return html`<ui-card variant="border" shadow="false" heading="Claims">
      ${
        p.claims.length
          ? html`<ui-flex direction="col" gap="3">
              ${p.claims.map(
                (c) =>
                  html`<ui-flex gap="3" align="start" wrap>
                    <ui-status
                      size="sm"
                      .color=${c.settled ? "success" : "warning"}
                      .label=${c.settled ? "settled" : "open"}
                    ></ui-status>
                    <ui-flex direction="col" gap="0" grow shrink>
                      <ui-text size="sm" weight="medium">${c.ref} · ${c.title}</ui-text>
                      <ui-text size="xs" color="muted">${egp(c.amount)} against ${c.against} · ${c.note}</ui-text>
                      ${
                        c.settled
                          ? html`<ui-text size="xs" color="success"
                              >Settled by credit note
                              ${c.href ? html`<ui-link .href=${c.href}>${c.creditNote}</ui-link>` : c.creditNote}</ui-text
                            >`
                          : nothing
                      }
                    </ui-flex>
                    ${
                      !c.settled && p.canAct
                        ? html`<ui-button
                            size="xs"
                            variant="soft"
                            @click=${() => (this.pending = { kind: "claim", claim: c })}
                            >Record credit note</ui-button
                          >`
                        : nothing
                    }
                  </ui-flex>`,
              )}
            </ui-flex>`
          : html`<ui-text size="sm" color="muted">No claims on this case.</ui-text>`
      }
      <ui-ai-read-file
        label="Describe damage from a photo"
        image-prompt="This photo shows goods delivered to a ship. Describe any damage for a claim: which items, how many, what is damaged (dents, leaks, broken seals, wet cartons), and any visible labels, part numbers or batch numbers. Write only what you can see."
        audio-prompt="This voice note describes goods delivered to a ship. Write down the damage or shortage for a claim: which items, how many, and what is wrong."
      ></ui-ai-read-file>
    </ui-card>`;
  }

  private _check(k: CloseCheck, p: CaseProfit) {
    const open = () => {
      if (k.action === "actuals") this.pending = { kind: "actuals" };
      else if (k.action === "receipt") this.pending = { kind: "receipt", reference: "TRX-77984" };
      else if (k.action === "claim") {
        const claim = p.claims.find((c) => !c.settled);
        if (claim) this.pending = { kind: "claim", claim };
      }
    };
    return html`<ui-flex gap="3" align="start" wrap>
      <ui-icon
        .name=${k.ok ? "success" : "warning"}
        size="md"
        .color=${k.ok ? "success" : "warning"}
        .label=${k.ok ? "Done" : "Open"}
      ></ui-icon>
      <ui-flex direction="col" gap="1" grow shrink>
        <ui-text size="sm" weight="medium">${k.label}</ui-text>
        <ui-text size="xs" color="muted">${k.detail}</ui-text>
        ${
          k.sources.length
            ? html`<ui-flex gap="1" wrap>
                ${k.sources.map((s) => html`<ui-button size="xs" variant="ghost" .href=${s.href}>${s.label}</ui-button>`)}
              </ui-flex>`
            : nothing
        }
      </ui-flex>
      ${
        !k.ok && k.action && !p.closed
          ? html`<ui-button size="xs" variant="soft" color="primary" @click=${open}>${k.actionLabel}</ui-button>`
          : nothing
      }
    </ui-flex>`;
  }

  private _checklist(p: CaseProfit) {
    const done = p.checks.filter((k) => k.ok).length;
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" full-width wrap>
        <span>Close checklist</span>
        <ui-badge size="sm" variant="soft" .color=${done === p.checks.length ? "success" : "warning"}
          >${done} of ${p.checks.length} green</ui-badge
        >
      </ui-flex>
      <ui-text size="xs" color="muted"
        >The case closes only when quantities, documents, claims and balances reconcile.</ui-text
      >
      <ui-progress
        width="full"
        .color=${done === p.checks.length ? "success" : "warning"}
        .value=${done}
        .max=${p.checks.length}
        .label=${`${done} of ${p.checks.length} checks green`}
      ></ui-progress>
      <ui-flex direction="col" gap="4">${p.checks.map((k) => this._check(k, p))}</ui-flex>
      ${
        p.closed
          ? nothing
          : html`<ui-flex gap="3" align="center" wrap>
              <ui-button color="primary" ?disabled=${!p.canClose} @click=${() => (this.pending = { kind: "close" })}
                >Close case</ui-button
              >
              <ui-text size="xs" color="muted"
                >${
                  p.canClose
                    ? "Every check is green."
                    : p.canAct
                      ? "Turn every check green to close."
                      : "Management and finance close cases."
                }</ui-text
              >
            </ui-flex>`
      }
    </ui-card>`;
  }

  private _modal(p: CaseProfit) {
    const job = this.pending;
    let heading = "";
    let body: unknown = nothing;
    let confirm = "Confirm";
    if (job?.kind === "actuals") {
      heading = "Replace estimates with actuals";
      confirm = "Confirm actuals";
      const billed = p.lines.filter((l) => l.kind === "charge" && l.state === "Billed");
      body = html`<ui-flex direction="col" gap="2">
        <ui-text size="sm">These billed amounts replace the estimates on the case's shared charges:</ui-text>
        ${billed.map(
          (l) =>
            html`<ui-flex justify="between" gap="3" wrap>
              <ui-text size="sm">${l.label} <ui-text as="span" size="xs" color="muted">(${l.detail})</ui-text></ui-text>
              <ui-text size="sm" weight="medium">${egp(l.expected)} → ${egp(l.actual ?? 0)}</ui-text>
            </ui-flex>`,
        )}
      </ui-flex>`;
    } else if (job?.kind === "receipt" && p.receipt) {
      heading = `Record receipt for ${p.receipt.number}`;
      confirm = "Record receipt";
      body = html`<ui-flex direction="col" gap="3">
        <ui-text size="sm"
          >${p.receipt.currency} ${p.receipt.amount.toLocaleString("en-US")} received from
          ${p.customer}${
            p.receipt.currency === "EGP" ? "" : ` at ${p.receipt.rate.toFixed(2)} EGP/${p.receipt.currency}`
          }.</ui-text
        >
        <ui-text-input
          legend="Bank reference"
          size="sm"
          width="full"
          .value=${job.reference}
          @input=${(e: Event) => (this.pending = { kind: "receipt", reference: (e.target as HTMLInputElement).value })}
        ></ui-text-input>
        <ui-text size="xs" color="muted"
          >Recorded after the bank movement — the platform never initiates transfers.</ui-text
        >
      </ui-flex>`;
    } else if (job?.kind === "claim") {
      heading = `Settle claim ${job.claim.ref}`;
      confirm = "Record credit note";
      body = html`<ui-flex direction="col" gap="2">
        <ui-text size="sm">${job.claim.title}. ${job.claim.note}</ui-text>
        <ui-text size="sm"
          >Credit note <strong>${job.claim.creditNote}</strong> from ${job.claim.against} for
          <strong>${egp(job.claim.amount)}</strong> is booked against the replacement cost.</ui-text
        >
      </ui-flex>`;
    } else if (job?.kind === "close") {
      heading = `Close ${p.caseId}?`;
      confirm = "Close case";
      body = html`<ui-flex direction="col" gap="2">
        <ui-text size="sm"
          >Actual gross profit <strong>${egp(p.actual.profit)}</strong> (${pct(p.actual.margin)}) against
          ${egp(p.expected.profit)} expected (${pct(p.expected.margin)}).</ui-text
        >
        <ui-text size="sm">Supplier prices, lead times and on-time results feed back to the supplier records.</ui-text>
      </ui-flex>`;
    }
    return html`<ui-modal heading=${heading} .open=${Boolean(job)} @ui-close=${() => (this.pending = null)}>
      ${body}
      <ui-flex slot="actions" gap="2">
        <ui-button variant="ghost" @click=${() => (this.pending = null)}>Cancel</ui-button>
        <ui-button color="primary" ?disabled=${this.busy} @click=${() => void this._confirm()}>${confirm}</ui-button>
      </ui-flex>
    </ui-modal>`;
  }

  render() {
    if (this.denied)
      return html`<ui-alert color="info" variant="soft" heading="Profit & close"
        >Costs, margins and profit aren't shown to Sales. The case owner and finance see this tab.</ui-alert
      >`;
    if (this.error) return html`<ui-alert color="error" variant="soft">${this.error}</ui-alert>`;
    const p = this.p;
    if (!p)
      return html`<ui-flex justify="center" padding="8"><ui-loading size="lg" color="primary"></ui-loading></ui-flex>`;
    return html`<ui-flex direction="col" gap="6">
      ${
        p.closed
          ? html`<ui-alert color="success" variant="soft" heading="Case closed — settled"
              >${p.closedAt ? `Closed ${formatDateTime(p.closedAt)}. ` : ""}Actual profit recorded; supplier prices and
              on-time results fed back to the supplier records.</ui-alert
            >`
          : nothing
      }
      ${
        p.costed
          ? html`${this._tiles(p)}
              <ui-grid
                sidebar
                gap="4"
                .items=${[
                  { role: "main", content: this._costs(p) },
                  {
                    role: "side",
                    content: html`<ui-flex direction="col" gap="4">${this._revenue(p)} ${this._claims(p)}</ui-flex>`,
                  },
                ]}
              ></ui-grid>`
          : html`<ui-alert color="info" variant="soft" heading="Expected profit is fixed at the customer PO"
              >${p.caseId} is at “${p.stage}”. The expected profit is taken from the approved quotation once the
              customer's PO is confirmed; actuals follow as supplier bills arrive.</ui-alert
            >`
      }
      ${this._checklist(p)} ${this._modal(p)}
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-case-profit": GsCaseProfit;
  }
}
