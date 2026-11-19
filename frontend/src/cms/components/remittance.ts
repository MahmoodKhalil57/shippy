import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Extracted } from "../../agent/built-in-ai.ts";
import { LightElement } from "../../components/base/light-element.ts";
import "../../components/index.ts";

/**
 * "Match a remittance" on the cash view (src/cms/views/cash.ts): a pasted payment advice is read
 * on this device (`ui-ai-extract`), then matched to the open invoices — plain matching, not the
 * model: by number (also just its digits), or by an equal balance. A person records the payment.
 */

export interface OpenInvoice {
  id: string;
  number: string;
  customerName: string;
  balance: number;
  currency: string;
  /** The balance as shown ("USD 12,400.00"). */
  open: string;
}

const FIELDS = [
  {
    id: "invoices",
    label: "Invoice numbers",
    hint: "every invoice number mentioned, comma-separated",
  },
  { id: "amount", label: "Amount paid", type: "number" as const },
  { id: "currency", label: "Currency" },
  { id: "payer", label: "Paid by" },
  { id: "date", label: "Payment date" },
];

export function matchRemittance(invoices: OpenInvoice[], values: Extracted): OpenInvoice[] {
  const digits = (s: string) => s.replace(/\D/g, "");
  const tokens = String(values.invoices ?? "")
    .split(/[\s,;]+/)
    .map((t) => t.trim().toLowerCase())
    .filter((t) => digits(t).length >= 3);
  const amount = typeof values.amount === "number" ? values.amount : Number(values.amount);
  const byNumber = invoices.filter((r) =>
    tokens.some((t) => r.number.toLowerCase().includes(t) || digits(r.number).endsWith(digits(t))),
  );
  const byAmount = Number.isFinite(amount) ? invoices.filter((r) => Math.abs(r.balance - amount) < 1) : [];
  return [...new Set([...byNumber, ...byAmount])];
}

@customElement("gs-remittance-match")
export class GsRemittanceMatch extends LightElement {
  @property({ attribute: false }) invoices: OpenInvoice[] = [];
  @state() private found: OpenInvoice[] | null = null;

  render() {
    const m = this.found;
    return html`<ui-flex direction="col" gap="3">
      <ui-ai-extract
        source="paste"
        label="Read and match"
        placeholder="Paste the remittance or payment advice…"
        what="customer remittance advice or payment email"
        pickable
        use-label="Match to open invoices"
        .fields=${FIELDS}
        @ui-select=${(e: CustomEvent<{ values: Extracted }>) =>
          (this.found = matchRemittance(this.invoices, e.detail.values))}
      ></ui-ai-extract>
      ${
        m
          ? m.length
            ? html`<ui-flex direction="col" gap="2">
                <ui-text variant="title-sm"
                  >Looks like it pays ${m.length === 1 ? "this invoice" : `these ${m.length} invoices`}:</ui-text
                >
                ${m.map(
                  (r) =>
                    html`<ui-flex gap="2" align="center" wrap>
                      <ui-link .href=${`/collections/invoices/${r.id}`}>${r.number}</ui-link>
                      <ui-text variant="body-md">${r.customerName}</ui-text>
                      <ui-text variant="body-md" color="muted">${r.open} open</ui-text>
                    </ui-flex>`,
                )}
              </ui-flex>`
            : html`<ui-alert tone="warning"
                >No open invoice matches these numbers or this amount — check the remittance by hand.</ui-alert
              >`
          : nothing
      }
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-remittance-match": GsRemittanceMatch;
  }
}
