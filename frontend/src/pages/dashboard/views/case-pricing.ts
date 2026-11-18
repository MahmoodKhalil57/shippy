import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ApiError, api } from "../../../cms/client.ts";
import type { Pricing, PricingRow } from "../../../cms/endpoints/commercial.ts";
import type { Doc } from "../../../cms/types.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import type { TableColumn } from "../../../components/primitives/data/table.ts";
import "../../../components/index.ts";
import type { Access } from "../app.ts";
import { toast } from "../shared.ts";
import { amount, egp, flagList, flagRow, hiddenForRole, loadingBlock, money, pct } from "./commercial-kit.ts";

/**
 * Case tab "Pricing" (/collections/cases/:id/pricing): the selected offers become landed costs
 * (shared charges — launch, freight, bank charges… — allocated by value, quantity or equally),
 * a margin per line (shown next to its markup), an optional customer discount and the selling
 * price in the quote currency at the approved FX rate. Policy checks come from the
 * pricing-policy global; "Request approval" snapshots the quotation and creates a real approval
 * for Karim Balbaa. Sales never sees this: the endpoint refuses and the tab says why.
 */

type Row = PricingRow & Record<string, unknown>;

const ALLOCATION = [
  { label: "By line value", value: "value" },
  { label: "By quantity", value: "qty" },
  { label: "Equal per line", value: "lines" },
];

@customElement("gs-case-pricing")
export class GsCasePricing extends LightElement {
  @property({ attribute: false }) access?: Access;
  @property({ attribute: false }) user?: Doc & { collection: string };
  @property({ attribute: false }) slug?: string;
  @property({ attribute: false }) docId?: string;

  @state() private data: Pricing | null = null;
  @state() private error = "";
  @state() private restricted = false;
  @state() private quoteId = "";
  @state() private asking = false;
  @state() private note = "";
  @state() private busy = false;

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private get _base() {
    return `/commercial/cases/${encodeURIComponent(this.docId ?? "")}`;
  }

  private async _load() {
    try {
      this.data = await api.get<Pricing>(`${this._base}/pricing`);
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        this.restricted = true;
        // Sales still reaches the quotation (selling prices only).
        const q = await api
          .find("quotations", { where: { case: { equals: this.docId } }, sort: "-version", limit: 1, depth: 0 })
          .catch(() => null);
        this.quoteId = q?.docs[0]?.id ?? "";
      } else this.error = (e as Error).message;
    }
  }

  private async _save(patch: Record<string, unknown>) {
    try {
      this.data = await api.post<Pricing>(`${this._base}/pricing`, patch);
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  private async _request() {
    this.busy = true;
    try {
      const r = await api.post<{ approval: Doc; quotation: Doc }>(`${this._base}/request-approval`, {
        note: this.note,
      });
      toast(`Approval requested: ${String(r.approval.title)}`);
      this.asking = false;
      await this._load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = false;
    }
  }

  private _columns(P: Pricing): TableColumn<Row>[] {
    const cur = P.currency;
    return [
      { key: "lineNo", label: "#", render: (r) => html`<ui-text size="sm">L${r.lineNo}</ui-text>` },
      {
        key: "description",
        label: "Line · selected supplier(s)",
        render: (r) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text size="sm" weight="medium">${r.description}</ui-text>
            <ui-text size="xs" color="muted">${r.sourcing}</ui-text>
          </ui-flex>`,
      },
      { key: "costEGP", label: "Supplier cost", render: (r) => html`<ui-text size="sm">${egp(r.costEGP)}</ui-text>` },
      { key: "allocEGP", label: "+ Shared", render: (r) => html`<ui-text size="sm">${egp(r.allocEGP)}</ui-text>` },
      {
        key: "landedEGP",
        label: "Landed",
        render: (r) => html`<ui-text size="sm" weight="semibold">${egp(r.landedEGP)}</ui-text>`,
      },
      {
        key: "marginPct",
        label: "Margin %",
        render: (r) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text-input
              type="number"
              size="xs"
              width="auto"
              step="0.5"
              min="-50"
              max="90"
              tabular
              .value=${String(r.marginPct)}
              .label=${`Margin for line ${r.lineNo}`}
              @change=${(e: Event) =>
                void this._save({ margins: { [r.lineNo]: Number((e.target as HTMLInputElement).value) || 0 } })}
            ></ui-text-input>
            <ui-text size="xs" .color=${r.marginPct < r.minPct ? "warning" : "muted"}
              >target ${r.targetPct}% · min ${r.minPct}%</ui-text
            >
          </ui-flex>`,
      },
      { key: "markupPct", label: "Markup", render: (r) => html`<ui-text size="sm">${pct(r.markupPct)}</ui-text>` },
      {
        key: "sellQuote",
        label: `Sell (${cur})`,
        render: (r) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text size="sm" weight="semibold">${money(r.sellQuote, cur)}</ui-text>
            <ui-text size="xs" color="muted">${egp(r.sellEGP)}</ui-text>
          </ui-flex>`,
      },
      {
        key: "unitQuote",
        label: `Unit (${cur})`,
        render: (r) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text size="sm">${amount(r.unitQuote)}</ui-text>
            <ui-text size="xs" color="muted">× ${r.quoteQty} ${r.quoteUnit}</ui-text>
          </ui-flex>`,
      },
      { key: "checks", label: "Checks", render: (r) => flagList(r.checks, "OK") },
    ];
  }

  private _tile(label: string, value: string, note: string, color?: "success" | "error" | "warning") {
    return html`<ui-card variant="border" size="sm" shadow="false">
      <ui-flex direction="col" gap="1">
        <ui-text size="sm" color="muted" truncate>${label}</ui-text>
        <ui-text size="2xl" weight="semibold" leading="tight" .color=${color}>${value}</ui-text>
        <ui-text size="xs" color="muted" clamp="2">${note}</ui-text>
      </ui-flex>
    </ui-card>`;
  }

  private _approval(P: Pricing) {
    const q = P.quotation;
    const a = P.approval;
    const pending = a && !["Approved", "Rejected"].includes(a.status);
    const status =
      a?.status === "Approved"
        ? html`<ui-alert color="success" variant="soft">${q?.number} approved — ready to send.</ui-alert>`
        : a?.status === "Rejected"
          ? html`<ui-alert color="error" variant="soft"
              >${q?.number} was returned. Adjust the pricing and request again.</ui-alert
            >`
          : pending
            ? html`<ui-alert color="info" variant="soft"
                >${a.title} · ${a.status}. Karim Balbaa decides in Approvals.</ui-alert
              >`
            : nothing;
    return html`<ui-card variant="border" shadow="false" heading="Approval">
      <ui-text size="sm" color="muted"
        >Rule: every customer quotation, discounts above ${P.policy.maxDiscountPct}% and margin exceptions go to Karim
        Balbaa. Exceptions travel with the request.</ui-text
      >
      ${
        P.exceptions.length
          ? html`<ui-alert color="warning" variant="soft"
              >${P.exceptions.length} exception${P.exceptions.length === 1 ? "" : "s"} — shown to the approver as
              “${P.approvalType}”.</ui-alert
            >`
          : html`<ui-alert color="success" variant="soft">No exceptions — standard approval.</ui-alert>`
      }
      ${status}
      <ui-flex slot="actions" gap="2" wrap>
        ${
          q
            ? html`<ui-button size="sm" variant="soft" .href=${`/collections/quotations/${q.id}/preview`}
                >Preview ${q.number}</ui-button
              >`
            : nothing
        }
        ${pending ? html`<ui-button size="sm" variant="soft" href="/approvals">Open approvals</ui-button>` : nothing}
        <ui-button
          size="sm"
          color="primary"
          ?disabled=${Boolean(pending) || !P.rows.length}
          @click=${() => {
            this.note = "";
            this.asking = true;
          }}
          >Request approval from Karim Balbaa</ui-button
        >
      </ui-flex>
    </ui-card>`;
  }

  private _askModal(P: Pricing) {
    if (!this.asking) return nothing;
    return html`<ui-modal open width="wide" heading="Request approval" @ui-close=${() => (this.asking = false)}>
      <ui-flex direction="col" gap="3">
        <ui-text size="sm"
          >Creates the customer quotation (${P.rows.length} priced lines, ${money(P.totals.sellQuote, P.currency)} excl.
          VAT, margin ${pct(P.totals.marginPct)}) and a <strong>${P.approvalType}</strong> approval for Karim Balbaa.
          Nothing is sent to the customer until it's approved and someone sends it.</ui-text
        >
        ${P.exceptions.length ? html`<ui-flex direction="col" gap="1">${P.exceptions.map((x) => flagRow({ tone: "warning", text: x }))}</ui-flex>` : nothing}
        <ui-textarea
          label="Note for the approver"
          placeholder="e.g. Helmets split to make the ETA; launch estimate confirmed tomorrow"
          .value=${this.note}
          @input=${(e: Event) => (this.note = (e.target as HTMLTextAreaElement).value)}
        ></ui-textarea>
      </ui-flex>
      <ui-button slot="actions" variant="ghost" @click=${() => (this.asking = false)}>Cancel</ui-button>
      <ui-button slot="actions" color="primary" ?disabled=${this.busy} @click=${() => void this._request()}
        >${this.busy ? "Requesting…" : "Request approval"}</ui-button
      >
    </ui-modal>`;
  }

  render() {
    if (this.restricted)
      return hiddenForRole(
        "Soaad Amer (Sales) sees selling prices on the quotation; supplier costs, landed costs and margins are restricted to supply chain, finance and management.",
        this.quoteId ? { label: "View quotation", href: `/collections/quotations/${this.quoteId}/preview` } : undefined,
      );
    if (this.error) return html`<ui-alert color="error" variant="soft">${this.error}</ui-alert>`;
    const P = this.data;
    if (!P) return loadingBlock("Pricing lines…");
    const t = P.totals;
    const estimates = P.charges.filter((c) => c.status === "Estimate").length;
    return html`<ui-flex direction="col" gap="4">
      <ui-grid fit="xs" gap="4">
        ${this._tile("Landed cost (priced lines)", egp(t.landedEGP), `incl. ${egp(P.chargesEGP)} shared charges · ${estimates ? `${estimates} estimate` : "all confirmed"}`)}
        ${this._tile(`Selling total (${P.currency}, excl. VAT)`, money(t.sellQuote, P.currency, 0), `${egp(t.sellEGP)} at ${P.currency}/EGP ${P.fx.toFixed(2)}${P.discountPct ? ` · after ${P.discountPct}% discount` : ""}`)}
        ${this._tile("Expected gross profit", egp(t.profitEGP), `Margin ${pct(t.marginPct)} · markup ${pct(t.markupPct)}`, t.profitEGP < 0 ? "error" : t.marginPct < P.policy.minPct ? "warning" : "success")}
        ${this._tile("Recoverable input VAT", egp(t.inputVatEGP), "14% on local supplier bills — excluded from cost")}
        ${this._tile("Lines priced", `${P.rows.length} / ${P.rows.length + P.unpriced.length}`, P.unpriced.length ? `${P.unpriced.length} to follow as a revision` : "all lines priced")}
      </ui-grid>

      <ui-card variant="border" shadow="false">
        <ui-flex slot="heading" justify="between" align="center" gap="2" wrap full-width>
          <span>Line pricing</span>
          <ui-button size="xs" variant="ghost" href="/globals/pricing-policy">Pricing policy</ui-button>
        </ui-flex>
        <ui-text size="sm" color="muted"
          >Policy: target ${P.policy.targetPct}%, minimum ${P.policy.minPct}% (per store where set), discounts above
          ${P.policy.maxDiscountPct}% need approval. ${P.fxLabel}.</ui-text
        >
        <ui-flex gap="3" align="end" wrap>
          <ui-select
            size="sm"
            label="Shared charges allocated"
            .options=${ALLOCATION}
            .value=${P.allocation}
            @change=${(e: Event) => void this._save({ allocation: (e.target as HTMLSelectElement).value })}
          ></ui-select>
          <ui-text-input
            type="number"
            size="sm"
            width="auto"
            min="0"
            max="20"
            step="0.5"
            label="Customer discount %"
            .value=${String(P.discountPct)}
            @change=${(e: Event) => void this._save({ discountPct: Number((e.target as HTMLInputElement).value) || 0 })}
          ></ui-text-input>
        </ui-flex>
        <ui-table size="sm" .columns=${this._columns(P)} .rows=${P.rows as Row[]}></ui-table>
        ${
          P.unpriced.length
            ? html`<ui-flex direction="col" gap="1">
                ${P.unpriced.map(
                  (u) =>
                    html`<ui-text size="xs" color="muted"
                      >L${u.lineNo} · ${u.description} — ${u.status}: no cost yet, excluded from this version.</ui-text
                    >`,
                )}
              </ui-flex>`
            : nothing
        }
      </ui-card>

      <ui-grid fit="md" gap="4">
        <ui-card variant="border" shadow="false" heading="Margin vs markup">
          <ui-text size="sm" color="muted"
            >Same profit, two ways to read it — Golden Sea's policy is set on margin.</ui-text
          >
          <ui-grid fit="xs" gap="3">
            <ui-flex direction="col" gap="0">
              <ui-text size="xs" color="muted" uppercase>Margin = profit ÷ selling price</ui-text>
              <ui-text size="2xl" weight="semibold">${pct(t.marginPct)}</ui-text>
              <ui-text size="xs" color="muted">${egp(t.profitEGP)} ÷ ${egp(t.sellEGP)}</ui-text>
            </ui-flex>
            <ui-flex direction="col" gap="0">
              <ui-text size="xs" color="muted" uppercase>Markup = profit ÷ landed cost</ui-text>
              <ui-text size="2xl" weight="semibold">${pct(t.markupPct)}</ui-text>
              <ui-text size="xs" color="muted">${egp(t.profitEGP)} ÷ ${egp(t.landedEGP)}</ui-text>
            </ui-flex>
          </ui-grid>
          <ui-text size="xs" color="muted"
            >A 25% margin is a 33.3% markup: pricing “cost + 25%” would land at a 20% margin.</ui-text
          >
        </ui-card>

        <ui-card variant="border" shadow="false" heading="Price build-up per line">
          <ui-text size="sm" color="muted">Supplier cost + shared charges + gross profit = selling price (EGP)</ui-text>
          <ui-chart
            kind="bars"
            stacked
            label="Price build-up per line"
            .labels=${P.rows.map((r) => `L${r.lineNo}`)}
            .series=${[
              { name: "Supplier cost", values: P.rows.map((r) => Math.round(r.costEGP)) },
              { name: "Shared charges", values: P.rows.map((r) => Math.round(r.allocEGP)) },
              { name: "Gross profit", values: P.rows.map((r) => Math.max(0, Math.round(r.profitEGP))) },
            ]}
            .format=${(v: number) => egp(v)}
          ></ui-chart>
        </ui-card>
      </ui-grid>

      <ui-grid fit="md" gap="4">
        <ui-card variant="border" shadow="false" heading="Shared charges">
          <ui-text size="sm" color="muted"
            >Allocated ${ALLOCATION.find((a) => a.value === P.allocation)?.label.toLowerCase()}. Estimates are marked;
            actuals replace them at close.</ui-text
          >
          <ui-flex direction="col" gap="2">
            ${P.charges.map(
              (c) =>
                html`<ui-flex justify="between" align="center" gap="2" wrap>
                  <ui-text size="sm">${c.label}</ui-text>
                  <ui-flex gap="2" align="center">
                    <ui-badge
                      size="sm"
                      variant="soft"
                      .color=${c.status === "Estimate" ? "warning" : c.status === "Confirmed" ? "success" : "neutral"}
                      >${c.status}</ui-badge
                    >
                    <ui-text size="sm" weight="semibold">${egp(c.amountEGP)}</ui-text>
                  </ui-flex>
                </ui-flex>`,
            )}
            <ui-divider></ui-divider>
            <ui-flex justify="between" gap="2">
              <ui-text size="sm" weight="semibold">Total shared</ui-text>
              <ui-text size="sm" weight="semibold">${egp(P.chargesEGP)}</ui-text>
            </ui-flex>
          </ui-flex>
          <ui-text size="xs" color="muted"
            >VAT: supply to a foreign vessel in transit is expected at 0% — finance confirms. The quotation shows prices
            excl. VAT.</ui-text
          >
        </ui-card>

        <ui-card variant="border" shadow="false" heading="Policy checks">
          <ui-flex direction="col" gap="1">
            ${
              P.exceptions.length
                ? P.exceptions.map((x) =>
                    flagRow({ tone: /negative|expired|misses/i.test(x) ? "error" : "warning", text: x }),
                  )
                : html`<ui-text size="sm" color="success">Within policy.</ui-text>`
            }
          </ui-flex>
        </ui-card>

        ${this._approval(P)}
      </ui-grid>
      ${this._askModal(P)}
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-case-pricing": GsCasePricing;
  }
}
