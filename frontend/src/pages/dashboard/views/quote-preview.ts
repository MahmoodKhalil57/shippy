import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../../cms/client.ts";
import type { QuoteView } from "../../../cms/endpoints/commercial.ts";
import type { Doc } from "../../../cms/types.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import type { TableColumn } from "../../../components/primitives/data/table.ts";
import "../../../components/index.ts";
import type { Access } from "../app.ts";
import { dashboardPath, navigate, toast } from "../shared.ts";
import { aiBadge, amount, day, egp, loadingBlock, pct } from "./commercial-kit.ts";

/**
 * Quotation tab "Preview & send" (/collections/quotations/:id/preview): the quotation as Golden
 * Sea's customer receives it, in their own layout (ported from their sample PDF): EGP or the
 * quote currency, English or Arabic (right-to-left), versions (older ones superseded, kept for
 * audit) and decision states. Actions follow the rules: request approval, approve / return
 * (management only), send (a draft email someone confirms), revise, record the customer's
 * decision, print, and the AI portal-submission check. Data: /api/commercial/quotations/:id/*.
 */

type Lang = "en" | "ar";
interface Line {
  lineNo?: number;
  partNo?: string;
  description?: string;
  unit?: string;
  qty?: number;
  unitPrice?: number;
  lead?: string;
  alternative?: boolean;
}
type LineRow = Line & { s: string; price: number; total: number } & Record<string, unknown>;
interface PortalRow {
  field: string;
  portal: string;
  quote: string;
  matches: boolean;
}

/** The customer-facing wording, in both languages. */
const T = {
  en: {
    title: "QUOTATION",
    no: "Quotation No.",
    ref: "Your ref",
    date: "Date",
    client: "Client Information",
    company: "Company",
    attention: "Attention",
    vessel: "Vessel",
    port: "Delivery port",
    intro: "We are pleased to furnish our quotation as below:",
    s: "S.",
    part: "Part Number",
    desc: "Description",
    uom: "UOM",
    qty: "QTY",
    price: (c: string) => `Price/${c}`,
    total: (c: string) => `Total/${c}`,
    grand: (c: string) => `Total in ${c}`,
    discount: (p: number) => `Less discount ${p}%`,
    remarks: "Remarks:",
    delivery: (port: string, eta: string) => `Delivery: on board at ${port} on arrival (${eta}).`,
    vat: "Prices are exclusive of Value Added Tax (VAT).",
    qtyRule: "QTY in the quote can’t be reduced; prices are based on the QTY listed.",
    valid: (d: string) => `Valid until ${d}; may be renewed thereafter upon mutual agreement.`,
    pay: (t: string) => `Payment terms: ${t}.`,
    wish: "Wish our offer wins your approvals ☺",
    prepared: "Prepared by",
    approved: "Approved by",
    brand: "FOR TRADING & MARKETING · EST. 2011",
    draft: (v: number) => `DRAFT — not yet approved. Will be issued as version ${v}.`,
  },
  ar: {
    title: "عرض سعر",
    no: "رقم العرض",
    ref: "مرجعكم",
    date: "التاريخ",
    client: "بيانات العميل",
    company: "الشركة",
    attention: "عناية",
    vessel: "السفينة",
    port: "ميناء التسليم",
    intro: "يسعدنا أن نقدم لكم عرض أسعارنا كما يلي:",
    s: "م",
    part: "رقم القطعة",
    desc: "الوصف",
    uom: "الوحدة",
    qty: "الكمية",
    price: (c: string) => `السعر/${c}`,
    total: (c: string) => `الإجمالي/${c}`,
    grand: (c: string) => `الإجمالي بال${c}`,
    discount: (p: number) => `خصم ${p}%`,
    remarks: "ملاحظات:",
    delivery: (port: string, eta: string) => `التسليم: على متن السفينة في ${port} عند الوصول (${eta}).`,
    vat: "الأسعار لا تشمل ضريبة القيمة المضافة.",
    qtyRule: "لا يمكن تخفيض الكميات الواردة في العرض، والأسعار مبنية على الكميات المذكورة.",
    valid: (d: string) => `العرض سارٍ حتى ${d}، ويمكن تجديده بعد ذلك باتفاق الطرفين.`,
    pay: (t: string) => `شروط الدفع: ${t}.`,
    wish: "نتمنى أن ينال عرضنا موافقتكم ☺",
    prepared: "أعدّه",
    approved: "اعتمده",
    brand: "للتجارة والتسويق · تأسست 2011",
    draft: (v: number) => `مسودة — لم تُعتمد بعد. ستصدر كنسخة ${v}.`,
  },
};

const STEPS = ["Prepared", "Approval requested", "Approved", "Sent"];
const DECISIONS = ["Won", "Partially won", "Revision requested", "Lost"] as const;

@customElement("gs-quote-preview")
export class GsQuotePreview extends LightElement {
  @property({ attribute: false }) access?: Access;
  @property({ attribute: false }) user?: Doc & { collection: string };
  @property({ attribute: false }) slug?: string;
  @property({ attribute: false }) docId?: string;

  @state() private view: QuoteView | null = null;
  @state() private error = "";
  @state() private egpView = false;
  @state() private language: Lang = "en";
  @state() private modal: "" | "approve" | "return" | "send" | "revise" | "decision" = "";
  @state() private text = "";
  @state() private method: "email" | "portal" = "email";
  @state() private decision: (typeof DECISIONS)[number] = "Won";
  @state() private busy = false;
  @state() private checking = false;
  @state() private portal: PortalRow[] | null = null;

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private get _base() {
    return `/commercial/quotations/${encodeURIComponent(this.docId ?? "")}`;
  }

  private async _load() {
    try {
      this.view = await api.get<QuoteView>(this._base);
      const sub = this.view.quotation.submission as { portalCheck?: PortalRow[] } | undefined;
      if (sub?.portalCheck?.length) this.portal = sub.portalCheck;
    } catch (e) {
      this.error = (e as Error).message;
    }
  }

  private async _act(action: string, body: Record<string, unknown> = {}, done = "") {
    this.busy = true;
    try {
      this.view = await api.post<QuoteView>(`${this._base}/${action}`, body);
      if (done) toast(done);
      this.modal = "";
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = false;
    }
  }

  private async _decide(decision: "Approve" | "Reject") {
    const id = this.view?.approvalId;
    if (!id) return;
    this.busy = true;
    try {
      await api.post(`/commercial/approvals/${encodeURIComponent(id)}/decide`, { decision, reason: this.text });
      toast(
        decision === "Approve" ? "Approved — the quotation can be sent." : "Returned to the preparer with your reason.",
      );
      this.modal = "";
      await this._load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = false;
    }
  }

  private async _revise() {
    this.busy = true;
    try {
      const r = await api.post<{ id: string }>(`${this._base}/revise`, { reason: this.text });
      toast("New version created — the previous one is kept for audit.");
      this.modal = "";
      navigate(dashboardPath("collections", "quotations", r.id, "preview"));
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = false;
    }
  }

  private async _portalCheck() {
    this.checking = true;
    try {
      await new Promise((r) => setTimeout(r, 1100));
      const r = await api.post<{ rows: PortalRow[]; view: QuoteView }>(`${this._base}/portal-check`);
      this.portal = r.rows;
      this.view = r.view;
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.checking = false;
    }
  }

  /* ------------------------------------------------------------ the document */

  private _paper(v: QuoteView) {
    const q = v.quotation;
    const t = T[this.language];
    const cur = this.egpView ? "EGP" : String(q.currency ?? "USD");
    const rate = this.egpView ? v.fx : 1;
    const lines = ((q.lines as Line[] | undefined) ?? []).map(
      (l, i) =>
        ({
          ...l,
          s: String(i + 1).padStart(2, "0"),
          price: (l.unitPrice ?? 0) * rate,
          total: (l.qty ?? 0) * (l.unitPrice ?? 0) * rate,
        }) as LineRow,
    );
    const gross = lines.reduce((s, l) => s + l.total, 0);
    const discount = Number(q.discountPct) || 0;
    const total = gross * (1 - discount / 100);
    const d = this.egpView ? 0 : 2;
    const draft = !["Approved", "Submitted"].includes(String(q.status)) && q.status !== "Superseded";
    const columns: TableColumn<LineRow>[] = [
      { key: "s", label: t.s },
      { key: "partNo", label: t.part },
      {
        key: "description",
        label: t.desc,
        render: (l) => html`<ui-text variant="body-md" dir="ltr">${l.description}</ui-text>`,
      },
      { key: "unit", label: t.uom, render: (l) => html`<ui-text variant="body-md" uppercase>${l.unit}</ui-text>` },
      { key: "qty", label: t.qty },
      {
        key: "price",
        label: t.price(cur),
        render: (l) => html`<ui-text variant="body-md">${amount(l.price, d)}</ui-text>`,
      },
      {
        key: "total",
        label: t.total(cur),
        render: (l) => html`<ui-text variant="body-md">${amount(l.total, d)}</ui-text>`,
      },
    ];
    const created = new Date(String(q.createdAt ?? new Date().toISOString()));
    const ymd = `${String(created.getUTCDate()).padStart(2, "0")}/${String(created.getUTCMonth() + 1).padStart(2, "0")}/${created.getUTCFullYear()}`;
    return html`<ui-box
      surface="base-100"
      border
      rounded="box"
      padding="6"
      lang=${this.language}
      dir=${this.language === "ar" ? "rtl" : "ltr"}
    >
      <ui-flex direction="col" gap="5">
        ${draft ? html`<ui-alert color="warning" variant="soft">${t.draft(Number(q.version) || 1)}</ui-alert>` : nothing}
        ${q.status === "Superseded" ? html`<ui-alert color="info" variant="soft">Superseded — kept for audit. Not valid for ordering.</ui-alert>` : nothing}
        <ui-flex justify="between" align="start" gap="4" wrap>
          <ui-flex direction="col" gap="0">
            <ui-heading level="2" variant="headline-sm" color="primary" tracking="wide">GOLDEN SEA</ui-heading>
            <ui-text variant="body-sm" color="muted" uppercase>${t.brand}</ui-text>
          </ui-flex>
          <ui-flex direction="col" gap="1" align="end">
            <ui-heading level="2" variant="headline-sm" color="primary">${t.title}</ui-heading>
            <ui-text variant="body-md" color="primary">${t.no}: ${q.number}</ui-text>
            <ui-text variant="body-md">${t.ref}: ${v.case.customerRef || "—"}</ui-text>
            <ui-text variant="body-md" color="primary">${t.date}: ${ymd}</ui-text>
          </ui-flex>
        </ui-flex>
        <ui-flex direction="col" gap="0">
          <ui-box surface="primary" padding="2" rounded="field"
            ><ui-text variant="title-sm">${t.client}</ui-text></ui-box
          >
          <ui-table
            size="sm"
            .columns=${[
              {
                key: "k",
                render: (r: Record<string, unknown>) =>
                  html`<ui-text variant="title-sm" color="primary">${r.k}</ui-text>`,
              },
              { key: "v" },
            ]}
            .rows=${[
              { k: t.company, v: v.case.customer },
              { k: t.attention, v: `${v.case.attention}${v.case.email ? ` · ${v.case.email}` : ""}` },
              { k: t.vessel, v: `${v.case.vessel}${v.case.imo ? ` (IMO ${v.case.imo})` : ""}` },
              { k: t.port, v: `${v.case.port} · ETA ${day(v.case.eta, true)}` },
            ]}
          ></ui-table>
        </ui-flex>
        <ui-text emphasized color="primary">${t.intro}</ui-text>
        <ui-table size="sm" .columns=${columns} .rows=${lines}></ui-table>
        <ui-flex direction="col" gap="1">
          ${
            discount
              ? html`<ui-flex justify="between" gap="2" padding="2">
                  <ui-text variant="body-md">${t.discount(discount)}</ui-text>
                  <ui-text variant="body-md">− ${amount(gross - total, d)}</ui-text>
                </ui-flex>`
              : nothing
          }
          <ui-box surface="primary" padding="2" rounded="field">
            <ui-flex justify="between" gap="2">
              <ui-text emphasized>${t.grand(cur)} (excl. VAT)</ui-text>
              <ui-text emphasized>${amount(total, d)}</ui-text>
            </ui-flex>
          </ui-box>
          ${this.egpView ? html`<ui-text variant="body-sm" color="muted">Converted at ${q.currency}/EGP ${v.fx.toFixed(2)} (approved rate on the quotation).</ui-text>` : nothing}
        </ui-flex>
        <ui-flex direction="col" gap="2">
          <ui-text emphasized italic>${t.remarks}</ui-text>
          <ui-list
            .items=${[
              t.delivery(v.case.port, day(v.case.eta)),
              t.vat,
              t.qtyRule,
              t.valid(day(String(q.validUntil ?? ""))),
              t.pay(String(q.paymentTerms ?? "—")),
              ...(q.remarks ? String(q.remarks).split("\n") : []),
            ].map((x) => ({ heading: x }))}
            .framed=${false}
          ></ui-list>
          <ui-text variant="body-md" italic>${t.wish}</ui-text>
        </ui-flex>
        <ui-flex justify="between" align="end" gap="4" wrap>
          <ui-text variant="body-sm" color="muted"
            >${t.prepared}: ${v.preparedBy || "—"}${v.approvedBy ? ` · ${t.approved}: ${v.approvedBy}` : ""}</ui-text
          >
          <ui-text variant="body-sm" italic
            >${v.approvedBy ? `${v.approvedBy} — authorised signature` : "Signature on approval"}</ui-text
          >
        </ui-flex>
        <ui-box surface="accent" padding="3" rounded="field">
          <ui-flex direction="col" gap="0">
            <ui-text variant="body-sm" dir="ltr">+20 10 0000 0000 · Sales@goldensea.com.eg</ui-text>
            <ui-text variant="body-sm" dir="ltr">6th of October City, Giza Governorate · demo document</ui-text>
          </ui-flex>
        </ui-box>
      </ui-flex>
    </ui-box>`;
  }

  /* ------------------------------------------------------------ the frame around it */

  private _status(v: QuoteView) {
    const q = v.quotation;
    const items = [
      ...STEPS.map((label) => ({ label })),
      {
        label: v.step === 4 ? v.stepLabel : "Customer decision",
        color: (v.stepLabel === "Lost" ? "error" : v.stepLabel === "Revision requested" ? "warning" : undefined) as
          | "error"
          | "warning"
          | undefined,
      },
    ];
    return html`<ui-card variant="border" shadow="false" heading="Decision state">
      <ui-steps scrollable color="primary" .current=${v.step} .items=${items}></ui-steps>
      <ui-flex gap="2" align="center" wrap>
        <ui-badge size="sm" variant="soft" color="primary">${q.number}</ui-badge>
        <ui-badge size="sm" variant="soft">${q.status}</ui-badge>
        ${q.decision ? html`<ui-text variant="body-md" color="muted">${q.decision}</ui-text>` : nothing}
        ${
          (q.submission as { submittedAt?: string; method?: string } | undefined)?.submittedAt
            ? html`<ui-text variant="body-md" color="muted"
                >· sent ${day(String((q.submission as { submittedAt: string }).submittedAt), true)} via
                ${(q.submission as { method?: string }).method}</ui-text
              >`
            : nothing
        }
      </ui-flex>
      ${v.approvals.map(
        (a) =>
          html`<ui-flex gap="2" align="baseline" wrap>
            <ui-status size="xs" .color=${a.tone} .label=${a.status}></ui-status>
            <ui-text variant="body-md"><strong>${a.type}:</strong> ${a.progress}</ui-text>
          </ui-flex>`,
      )}
      ${
        v.why.approve && v.approvalId && !v.can.approve
          ? html`<ui-text variant="body-sm" color="muted">${v.why.approve}</ui-text>`
          : nothing
      }
      <ui-flex slot="actions" gap="2" wrap>
        ${
          v.can.requestApproval
            ? html`<ui-button
                size="sm"
                color="primary"
                ?disabled=${this.busy}
                @click=${() => void this._act("request-approval", {}, "Approval requested from Karim Balbaa.")}
                >Request approval</ui-button
              >`
            : nothing
        }
        ${
          v.can.approve
            ? html`<ui-button size="sm" variant="soft" color="error" @click=${() => this._open("return")}
                  >Return</ui-button
                >
                <ui-button size="sm" color="success" @click=${() => this._open("approve")}>Approve</ui-button>`
            : nothing
        }
        ${v.can.send ? html`<ui-button size="sm" color="primary" @click=${() => this._open("send")}>Send to customer</ui-button>` : nothing}
        ${v.can.decide ? html`<ui-button size="sm" variant="soft" @click=${() => this._open("decision")}>Record customer decision</ui-button>` : nothing}
        ${v.can.revise ? html`<ui-button size="sm" variant="soft" @click=${() => this._open("revise")}>Create revision</ui-button>` : nothing}
        <ui-button size="sm" variant="ghost" @click=${() => window.print()}>Print</ui-button>
      </ui-flex>
    </ui-card>`;
  }

  private _open(m: GsQuotePreview["modal"]) {
    this.text = "";
    if (m === "send") {
      const v = this.view!;
      this.method =
        v.case.portal && /portal/i.test(v.case.portal) && !/Nordvik/.test(v.case.customer) ? "portal" : "email";
      this.text = [
        `Dear ${v.case.attention},`,
        "",
        `Please find attached our quotation ${v.quotation.number} for ${v.case.vessel} (your ref. ${v.case.customerRef || "—"}), delivery on board at ${v.case.port}.`,
        `Valid until ${day(String(v.quotation.validUntil ?? ""))}. Prices exclude VAT.`,
        "",
        "Best regards,",
        typeof this.user?.name === "string" ? this.user.name : "",
        "Golden Sea for Trading & Marketing",
      ].join("\n");
    }
    this.modal = m;
  }

  private _modal(v: QuoteView) {
    if (!this.modal) return nothing;
    const close = () => (this.modal = "");
    const q = v.quotation;
    const reasonBox = (label: string, placeholder: string) =>
      html`<ui-textarea
          .label=${label}
          .placeholder=${placeholder}
          .value=${this.text}
          @input=${(e: Event) => (this.text = (e.target as HTMLTextAreaElement).value)}
        ></ui-textarea>
        <ui-ai-tools
          tools="formal shorter proofread translate"
          .value=${this.text}
          @ui-change=${(e: CustomEvent<{ value: string }>) => (this.text = e.detail.value)}
        ></ui-ai-tools>`;
    const body = {
      approve: html`<ui-flex direction="col" gap="3">
        <ui-text variant="body-md"
          >Approve ${q.number} (${q.currency} ${amount(Number(q.totalExVat) || 0)} excl.
          VAT)${v.internal?.marginPct !== undefined ? ` at ${pct(v.internal.marginPct)} margin` : ""}. It can then be
          sent to the customer.</ui-text
        >
        ${v.internal?.exceptions ? html`<ui-alert color="warning" variant="soft">${v.internal.exceptions}</ui-alert>` : nothing}
        ${reasonBox("Comment (optional)", "e.g. OK — confirm the launch cost before sending")}
      </ui-flex>`,
      return: html`<ui-flex direction="col" gap="3">
        <ui-text variant="body-md"
          >Return ${q.number} to the preparer. A reason is required and goes on the case timeline.</ui-text
        >
        ${reasonBox("Reason", "e.g. Re-check line 3 — margin too thin for a new supplier")}
      </ui-flex>`,
      send: html`<ui-flex direction="col" gap="3">
        <ui-flex gap="2" align="center" wrap
          >${aiBadge()}<ui-text variant="body-sm" color="muted">Nothing is sent until you confirm.</ui-text></ui-flex
        >
        <ui-join label="Submission method">
          <ui-button
            size="sm"
            .color=${this.method === "email" ? "primary" : undefined}
            @click=${() => (this.method = "email")}
            >Email from Odoo</ui-button
          >
          <ui-button
            size="sm"
            .color=${this.method === "portal" ? "primary" : undefined}
            @click=${() => (this.method = "portal")}
            >Customer portal</ui-button
          >
        </ui-join>
        ${
          this.method === "email"
            ? html`<ui-mockup-window>
                <ui-flex direction="col" gap="2" padding="4">
                  <ui-text variant="body-md"><strong>To:</strong> ${v.case.email || "customer"}</ui-text>
                  <ui-text variant="body-md"
                    ><strong>Subject:</strong> Quotation ${q.number} — ${v.case.vessel} — ref.
                    ${v.case.customerRef}</ui-text
                  >
                  <ui-text variant="body-md"><strong>Attachment:</strong> ${q.number}.pdf</ui-text>
                  ${reasonBox("Message", "")}
                </ui-flex>
              </ui-mockup-window>`
            : html`<ui-alert color="info" variant="soft"
                >Enter the quotation in ${v.case.portal || "the customer's portal"}, then upload the confirmation
                screenshot below — the submission is only complete when it matches the approved quote.</ui-alert
              >`
        }
      </ui-flex>`,
      revise: html`<ui-flex direction="col" gap="3">
        <ui-text variant="body-md"
          >Creates version ${(v.versions.at(-1)?.version ?? 1) + 1} as a draft with the same lines; ${q.number} is kept
          for audit and marked superseded.</ui-text
        >
        ${reasonBox("What changes", "e.g. Customer asked for ESAB on line 1")}
      </ui-flex>`,
      decision: html`<ui-flex direction="col" gap="3">
        <ui-text variant="body-md">The customer's decision on ${q.number}. No response never means lost.</ui-text>
        <ui-join label="Decision">
          ${DECISIONS.map(
            (d) =>
              html`<ui-button
                size="sm"
                .color=${this.decision === d ? (d === "Lost" ? "error" : "primary") : undefined}
                @click=${() => (this.decision = d)}
                >${d}</ui-button
              >`,
          )}
        </ui-join>
        ${reasonBox(this.decision === "Lost" ? "Lost reason" : "Note", "e.g. PO NSM-PO-77231 received for lines 1–3")}
      </ui-flex>`,
    }[this.modal];
    const heading = {
      approve: `Approve ${q.number}`,
      return: `Return ${q.number}`,
      send: `Send ${q.number}`,
      revise: `Revise ${q.number}`,
      decision: "Customer decision",
    }[this.modal];
    const confirm = {
      approve: () => void this._decide("Approve"),
      return: () => void this._decide("Reject"),
      send: () =>
        void this._act(
          "send",
          { method: this.method, to: v.case.email },
          this.method === "email"
            ? `${q.number} sent to ${v.case.email}.`
            : `${q.number} marked as entered in the portal.`,
        ),
      revise: () => void this._revise(),
      decision: () =>
        void this._act(
          "decision",
          { decision: this.decision, note: this.text },
          `Decision recorded: ${this.decision}.`,
        ),
    }[this.modal];
    const label = { approve: "Approve", return: "Return", send: "Send", revise: "Create revision", decision: "Record" }[
      this.modal
    ];
    const needsText = this.modal === "return" || (this.modal === "decision" && this.decision === "Lost");
    return html`<ui-modal open width="wide" .heading=${heading} @ui-close=${close}>
      ${body}
      <ui-button slot="actions" variant="ghost" @click=${close}>Cancel</ui-button>
      <ui-button
        slot="actions"
        .color=${this.modal === "return" ? "error" : "primary"}
        ?disabled=${this.busy || (needsText && !this.text.trim())}
        @click=${confirm}
        >${this.busy ? "Working…" : label}</ui-button
      >
    </ui-modal>`;
  }

  private _portalCard(v: QuoteView) {
    if (!v.can.portalCheck && !this.portal) return nothing;
    const diffs = this.portal?.filter((r) => !r.matches) ?? [];
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" gap="2" align="center" wrap>Portal submission check ${aiBadge("AI check")}</ui-flex>
      <ui-text variant="body-md" color="muted"
        >For customers who buy through a procurement portal: upload the confirmation screenshot and the AI compares it
        with the approved quotation. The submission is complete only when every field matches.</ui-text
      >
      ${this.checking ? html`<ui-flex gap="3" align="center"><ui-loading size="sm" color="secondary"></ui-loading><ui-text color="muted">Reading the screenshot…</ui-text></ui-flex>` : nothing}
      ${
        this.portal && !this.checking
          ? html`<ui-table
                size="sm"
                .columns=${[
                  { key: "field", label: "Field" },
                  { key: "portal", label: "Portal" },
                  { key: "quote", label: "Approved quote" },
                  {
                    key: "matches",
                    label: "",
                    render: (r: Record<string, unknown>) =>
                      html`<ui-badge size="sm" variant="soft" .color=${r.matches ? "success" : "error"}
                        >${r.matches ? "Match" : "Difference"}</ui-badge
                      >`,
                  },
                ]}
                .rows=${this.portal as unknown as Record<string, unknown>[]}
              ></ui-table>
              ${
                diffs.length
                  ? html`<ui-alert color="warning" variant="soft"
                      >Not marked complete: ${diffs.map((r) => r.field.toLowerCase()).join(", ")} differ. Correct it in
                      the portal or record the customer's agreement.</ui-alert
                    >`
                  : html`<ui-alert color="success" variant="soft">All fields match — submission complete.</ui-alert>`
              }`
          : nothing
      }
      <ui-button
        slot="actions"
        size="sm"
        variant="soft"
        ?disabled=${this.checking}
        @click=${() => void this._portalCheck()}
        >${this.portal ? "Check again" : "Upload screenshot & compare"}</ui-button
      >
    </ui-card>`;
  }

  render() {
    if (this.error) return html`<ui-alert color="error" variant="soft">${this.error}</ui-alert>`;
    const v = this.view;
    if (!v) return loadingBlock("Preparing the quotation…");
    const q = v.quotation;
    return html`<ui-flex direction="col" gap="4">
      ${this._status(v)}
      <ui-flex justify="between" align="center" gap="3" wrap>
        <ui-flex gap="2" align="center" wrap>
          <ui-join label="Currency">
            <ui-button size="sm" .color=${!this.egpView ? "primary" : undefined} @click=${() => (this.egpView = false)}
              >${q.currency}</ui-button
            >
            <ui-button size="sm" .color=${this.egpView ? "primary" : undefined} @click=${() => (this.egpView = true)}
              >EGP</ui-button
            >
          </ui-join>
          <ui-join label="Language">
            <ui-button
              size="sm"
              .color=${this.language === "en" ? "primary" : undefined}
              @click=${() => (this.language = "en")}
              >English</ui-button
            >
            <ui-button
              size="sm"
              .color=${this.language === "ar" ? "primary" : undefined}
              @click=${() => (this.language = "ar")}
              >العربية</ui-button
            >
          </ui-join>
        </ui-flex>
        <ui-text variant="body-sm" color="muted"
          >Customer-facing: supplier names, costs and margins are never printed.</ui-text
        >
      </ui-flex>
      ${this._paper(v)}
      <ui-grid fit="md" gap="4">
        <ui-card variant="border" shadow="false" heading="Versions">
          <ui-flex direction="col" gap="2">
            ${v.versions.map(
              (x) =>
                html`<ui-flex justify="between" align="center" gap="2" wrap>
                  <ui-link .href=${dashboardPath("collections", "quotations", x.id, "preview")} color="primary"
                    ><ui-text variant="body-md" ?emphasized=${x.id === q.id}>${x.number}</ui-text></ui-link
                  >
                  <ui-flex gap="2" align="center">
                    <ui-badge
                      size="sm"
                      variant="soft"
                      .color=${x.status === "Superseded" ? "neutral" : x.status === "Approved" || x.status === "Submitted" ? "success" : "warning"}
                      >${x.status}${x.status === "Superseded" ? " · kept for audit" : ""}</ui-badge
                    >
                    <ui-text variant="body-sm" color="muted">${q.currency} ${amount(x.totalExVat)}</ui-text>
                  </ui-flex>
                </ui-flex>`,
            )}
          </ui-flex>
        </ui-card>
        ${
          v.internal
            ? html`<ui-card variant="border" shadow="false" heading="Internal — never printed">
                <ui-flex direction="col" gap="1">
                  <ui-text variant="body-md">Landed cost: ${egp(v.internal.landedCostEGP ?? 0)}</ui-text>
                  <ui-text variant="body-md">Gross profit: ${egp(v.internal.grossProfitEGP ?? 0)}</ui-text>
                  <ui-text
                    variant="body-md"
                    .color=${(v.internal.marginPct ?? 0) < v.minMarginPct ? "warning" : "success"}
                    >Margin: ${pct(v.internal.marginPct ?? 0)} (minimum ${v.minMarginPct}%)</ui-text
                  >
                  ${v.internal.exceptions ? html`<ui-text variant="body-sm" color="muted">${v.internal.exceptions}</ui-text>` : nothing}
                </ui-flex>
                ${
                  v.case.id
                    ? html`<ui-button
                        slot="actions"
                        size="sm"
                        variant="ghost"
                        .href=${`/collections/cases/${v.case.id}/pricing`}
                        >Pricing</ui-button
                      >`
                    : nothing
                }
              </ui-card>`
            : nothing
        }
        ${this._portalCard(v)}
      </ui-grid>
      ${this._modal(v)}
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-quote-preview": GsQuotePreview;
  }
}
