import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ApiError, api } from "../../../cms/client.ts";
import type { CmpLine, CmpOffer, CmpPart, Compare } from "../../../cms/endpoints/commercial.ts";
import type { Doc } from "../../../cms/types.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import type { TableColumn } from "../../../components/primitives/data/table.ts";
import "../../../components/index.ts";
import type { Access } from "../app.ts";
import { toast } from "../shared.ts";
import { aiBadge, amount, day, egp, flagList, hiddenForRole, loadingBlock, money, TONE } from "./commercial-kit.ts";

/**
 * Case tab "Compare offers" (/collections/cases/:id/compare): every offer checked against the
 * customer's original line, normalised to EGP per base unit at the approved FX rate. Toggle unit
 * price ↔ landed cost (freight to the vessel's port included): the cheapest unit price is not
 * always the cheapest on board. Own Alexandria stock and agency pricelists sit next to supplier
 * offers; deviations block or flag offers; the best fit is recommended; a person selects (one
 * offer or a split) and gives a reason when it isn't the best fit. Data: /api/commercial/cases/:id/*.
 */

type Mode = "unit" | "landed";
type Row = CmpOffer & { rank: number } & Record<string, unknown>;

interface Choice {
  line: CmpLine;
  parts: CmpPart[];
  split: boolean;
}

@customElement("gs-case-compare")
export class GsCaseCompare extends LightElement {
  @property({ attribute: false }) access?: Access;
  @property({ attribute: false }) user?: Doc & { collection: string };
  @property({ attribute: false }) slug?: string;
  @property({ attribute: false }) docId?: string;

  @state() private data: Compare | null = null;
  @state() private error = "";
  @state() private restricted = false;
  @state() private mode: Mode = "unit";
  @state() private choice: Choice | null = null;
  @state() private reason = "";
  @state() private busy = false;
  @state() private correction: { offer: CmpOffer; draft?: Draft } | null = null;
  @state() private accepting: CmpLine | null = null;
  @state() private acceptNote = "Customer email 17 Nov 10:12 — “500 ml cans OK”, attached";

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private get _base() {
    return `/commercial/cases/${encodeURIComponent(this.docId ?? "")}`;
  }

  private async _load() {
    try {
      this.data = await api.get<Compare>(`${this._base}/compare`);
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) this.restricted = true;
      else this.error = (e as Error).message;
    }
  }

  /* ------------------------------------------------------------ actions */

  private _open(line: CmpLine, parts: CmpPart[], split = false) {
    this.choice = { line, parts: parts.map((p) => ({ ...p })), split };
    this.reason = "";
  }

  private _isBest(c: Choice) {
    const { line, parts } = c;
    if (parts.length === 1) return parts[0].offer === line.best;
    const s = line.split?.parts ?? [];
    return (
      s.length === parts.filter((p) => p.qty > 0).length &&
      s.every((x) => parts.some((p) => p.offer === x.offer && p.qty === x.qty))
    );
  }

  private async _confirmSelect() {
    const c = this.choice;
    if (!c) return;
    this.busy = true;
    try {
      this.data = await api.post<Compare>(`${this._base}/select`, {
        lineNo: c.line.lineNo,
        parts: c.parts.filter((p) => p.qty > 0),
        reason: this.reason,
      });
      toast(`Line ${c.line.lineNo}: selection saved to the case.`);
      this.choice = null;
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = false;
    }
  }

  private async _openCorrection(offer: CmpOffer) {
    this.correction = { offer };
    try {
      await new Promise((r) => setTimeout(r, 900));
      const draft = await api.post<Draft>(`${this._base}/correction`, { offer: offer.id });
      this.correction = { offer, draft };
    } catch (e) {
      toast((e as Error).message, "error");
      this.correction = null;
    }
  }

  private async _sendCorrection() {
    const c = this.correction;
    if (!c?.draft) return;
    this.busy = true;
    try {
      const draft = await api.post<Draft>(`${this._base}/correction`, { offer: c.offer.id, send: true });
      this.correction = { ...c, draft };
      toast("Correction request sent. The offer stays blocked until a corrected version arrives.");
      await this._load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = false;
    }
  }

  private async _accept() {
    const line = this.accepting;
    if (!line) return;
    this.busy = true;
    try {
      this.data = await api.post<Compare>(`${this._base}/accept`, { lineNo: line.lineNo, note: this.acceptNote });
      toast(`Line ${line.lineNo}: customer acceptance recorded.`);
      this.accepting = null;
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = false;
    }
  }

  /* ------------------------------------------------------------ rendering */

  private _metric(o: CmpOffer) {
    return this.mode === "unit" ? o.unitPerBase : o.landedPerBase;
  }

  private _columns(line: CmpLine): TableColumn<Row>[] {
    const selected = new Map(line.selection.parts.map((p) => [p.offer, p.qty]));
    const unitLabel = this.mode === "unit" ? `Unit price · EGP / ${line.baseUnit}` : `Landed · EGP / ${line.baseUnit}`;
    return [
      {
        key: "supplier",
        label: "Supplier",
        render: (o) =>
          html`<ui-flex direction="col" gap="1">
            <ui-flex gap="2" align="center" wrap>
              <ui-text variant="title-sm" .color=${o.superseded ? "muted" : undefined}>${o.supplier}</ui-text>
              <ui-text variant="body-sm" color="muted">v${o.version}</ui-text>
              ${
                o.kind === "stock"
                  ? html`<ui-tag tone="success">Own stock</ui-tag>`
                  : o.kind === "agency"
                    ? html`<ui-tag tone="info">Agency</ui-tag>`
                    : nothing
              }
              ${o.id === line.best ? html`<ui-tag tone="success">Best fit</ui-tag>` : nothing}
              ${
                this.mode === "unit" && o.id === line.cheapestUnit && o.id !== line.best
                  ? html`<ui-tag variant="outline" tone="warning">Cheapest unit price</ui-tag>`
                  : nothing
              }
              ${
                selected.has(o.id)
                  ? html`<ui-tag tone="primary">Selected${selected.size > 1 ? ` × ${selected.get(o.id)}` : ""}</ui-tag>`
                  : nothing
              }
            </ui-flex>
            <ui-text variant="body-sm" color="muted">${o.supplierNote}</ui-text>
          </ui-flex>`,
      },
      {
        key: "offered",
        label: "Offered",
        render: (o) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text variant="body-md">${o.offered}</ui-text>
            <ui-text variant="body-sm" .color=${o.coverage < 1 ? "warning" : "muted"}
              >${Math.round(o.coverage * 100)}% of requested${o.expiry ? ` · exp. ${o.expiry}` : ""}</ui-text
            >
          </ui-flex>`,
      },
      {
        key: "price",
        label: "Price (as offered)",
        render: (o) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text variant="body-md">${money(o.price, o.currency)}</ui-text>
            <ui-text variant="body-sm" color="muted">per ${o.per} · total ${egp(o.goodsEGP)}</ui-text>
          </ui-flex>`,
      },
      {
        key: "metric",
        label: unitLabel,
        render: (o) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text variant="title-sm" emphasized .color=${o.rank === 0 && !o.blocked ? "success" : undefined}
              >${amount(this._metric(o))}</ui-text
            >
            <ui-text variant="body-sm" color="muted"
              >${
                this.mode === "landed"
                  ? `${o.freightEGP ? `+ ${egp(o.freightEGP)}` : "no freight"} · ${o.freightNote}`
                  : `landed ${amount(o.landedPerBase)}`
              }</ui-text
            >
          </ui-flex>`,
      },
      {
        key: "lead",
        label: "Lead",
        render: (o) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text
              variant="body-md"
              .color=${o.flags.some((f) => f.type === "Lead time vs ETA" && f.tone === "error") ? "error" : undefined}
              >${o.leadDays} d</ui-text
            >
            <ui-text variant="body-sm" color="muted">ready ${day(o.readyBy)}</ui-text>
          </ui-flex>`,
      },
      {
        key: "terms",
        label: "Valid · terms · basis",
        render: (o) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text variant="body-sm"
              >${o.validUntil ? `Valid to ${day(o.validUntil)}` : "No expiry"} · ${o.terms || "—"}</ui-text
            >
            <ui-text variant="body-sm" color="muted">${o.basis}</ui-text>
          </ui-flex>`,
      },
      {
        key: "checks",
        label: "Checks",
        render: (o) =>
          html`<ui-flex direction="col" gap="2">
            ${flagList(o.flags)}
            <ui-flex gap="1" wrap>
              ${
                o.blocked
                  ? nothing
                  : html`<ui-button
                      size="xs"
                      variant="tonal"
                      toggle
                      ?selected=${selected.has(o.id)}
                      ?disabled=${selected.size === 1 && selected.has(o.id)}
                      @click=${() => this._open(line, [{ offer: o.id, qty: line.qty }])}
                      >${selected.size === 1 && selected.has(o.id) ? "Selected" : "Select"}</ui-button
                    >`
              }
              ${
                o.correctable
                  ? html`<ui-button size="xs" variant="tonal" @click=${() => this._openCorrection(o)}
                      >Correction request</ui-button
                    >`
                  : nothing
              }
              ${
                o.needsAcceptance && selected.has(o.id) && !line.selection.customerAccepted
                  ? html`<ui-button size="xs" variant="tonal" color="primary" @click=${() => (this.accepting = line)}
                      >Record customer acceptance</ui-button
                    >`
                  : nothing
              }
              ${
                o.needsAcceptance && selected.has(o.id) && line.selection.customerAccepted
                  ? html`<ui-tag tone="success">Customer accepted in writing</ui-tag>`
                  : nothing
              }
            </ui-flex>
          </ui-flex>`,
      },
    ];
  }

  private _rows(line: CmpLine): Row[] {
    const sorted = [...line.offers].sort(
      (a, b) => Number(a.blocked) - Number(b.blocked) || this._metric(a) - this._metric(b),
    );
    return sorted.map((o, i) => ({ ...o, rank: i }) as Row);
  }

  private _selectionText(line: CmpLine) {
    const parts = line.selection.parts;
    if (!parts.length) return "";
    const name = (id: string) => line.offers.find((o) => o.id === id)?.supplier ?? id;
    return parts.map((p) => `${name(p.offer)} × ${p.qty}`).join(" + ");
  }

  /**
   * An on-device second look at the current offers against the request (same item, brand or
   * approved equivalent, unit, pack size): things to check, never a verdict — the rules above and
   * a person decide.
   */
  private _offerCheck(line: CmpLine) {
    const offers = line.offers.filter((o) => !o.superseded).slice(0, 6);
    if (!offers.length) return nothing;
    const text = [
      `Requested: ${line.description} — ${line.requested}. Rules: ${line.rules}.`,
      ...offers.map(
        (o, i) => `Offer ${i + 1} from ${o.supplier}: ${o.offered}. Supplier note: ${o.supplierNote || "none"}.`,
      ),
    ].join("\n");
    const questions = offers.map((o, i) => ({
      id: `offer${i + 1}`,
      prompt: `Does offer ${i + 1} (${o.supplier}) match the requested item: the same product, brand or an approved equivalent, unit and pack size?`,
      yes: `${o.supplier}: matches the request`,
      no: `${o.supplier}: may differ from the request — check`,
    }));
    return html`<ui-ai-check
      label="Check offers against the request"
      .text=${text}
      .questions=${questions}
    ></ui-ai-check>`;
  }

  private _line(line: CmpLine) {
    const best = line.offers.find((o) => o.id === line.best);
    const selected = this._selectionText(line);
    return html`<ui-card>
      <span slot="heading">L${line.lineNo} · ${line.description}</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap
        ><ui-tag .tone=${TONE[line.statusTone]}>${line.status}</ui-tag></ui-flex
      >
      <ui-text variant="body-md" color="muted">Requested: ${line.requested} · ${line.rules}</ui-text>
      ${this._offerCheck(line)}
      ${
        line.missing
          ? html`<ui-alert tone="warning"
              >Not sent to suppliers yet: ${line.missing}. Waiting for the customer's answer.</ui-alert
            >`
          : nothing
      }
      ${
        line.offers.length
          ? html`<ui-table size="sm" hover .columns=${this._columns(line)} .rows=${this._rows(line)}></ui-table>`
          : nothing
      }
      ${
        line.others.length
          ? html`<ui-flex direction="col" gap="1">
              ${line.others.map(
                (o) =>
                  html`<ui-flex gap="2" align="baseline" wrap>
                    <ui-badge dot .tone=${TONE[o.tone]} .label=${o.tone}></ui-badge>
                    <ui-text variant="label-md" emphasized>${o.supplier}</ui-text>
                    <ui-tag .tone=${TONE[o.tone]}>${o.status}</ui-tag>
                    <ui-text variant="body-sm" color="muted">${o.note}</ui-text>
                  </ui-flex>`,
              )}
            </ui-flex>`
          : nothing
      }
      ${
        best || line.split
          ? html`<ui-alert tone="success">
              <ui-flex direction="col" gap="1">
                <ui-flex gap="2" align="center" wrap><strong>Recommendation</strong>${aiBadge("Suggested")}</ui-flex>
                ${
                  line.split
                    ? html`<span
                        >Split sourcing: ${line.split.text} — ${egp(line.split.costEGP)}
                        landed${
                          line.split.savesEGP ? `, saves ${egp(line.split.savesEGP)} vs the best single supplier` : ""
                        },
                        all before ETA.</span
                      >`
                    : html`<span
                        >${best!.supplier} v${best!.version}: ${amount(best!.landedPerBase)} EGP / ${line.baseUnit}
                        landed — lowest cost on board among offers that pass every check.</span
                      >`
                }
              </ui-flex>
            </ui-alert>`
          : line.offers.length
            ? html`<ui-alert tone="warning">No offer passes every check yet — no recommendation.</ui-alert>`
            : nothing
      }
      ${
        selected
          ? html`<ui-text variant="body-md"
              ><strong>Selected:</strong> ${selected}${line.selection.reason ? ` · ${line.selection.reason}` : ""}${
                line.selection.inferred ? " (from the line status)" : ""
              }</ui-text
            >`
          : nothing
      }
      ${
        line.split || line.offers.filter((o) => !o.blocked).length > 1
          ? html`<ui-flex slot="actions" gap="2" wrap>
              ${
                line.split
                  ? html`<ui-button
                      size="xs"
                      color="primary"
                      variant="tonal"
                      @click=${() => this._open(line, line.split!.parts, true)}
                      >Use split ${line.split.text}</ui-button
                    >`
                  : nothing
              }
              <ui-button
                size="xs"
                variant="text"
                @click=${() =>
                  this._open(
                    line,
                    line.offers
                      .filter((o) => !o.blocked)
                      .map((o) => ({
                        offer: o.id,
                        qty: line.split?.parts.find((p) => p.offer === o.id)?.qty ?? 0,
                      })),
                    true,
                  )}
                >Split across suppliers…</ui-button
              >
            </ui-flex>`
          : nothing
      }
    </ui-card>`;
  }

  private _choiceModal() {
    const c = this.choice;
    if (!c) return nothing;
    const best = this._isBest(c);
    const total = c.parts.reduce((s, p) => s + (p.qty || 0), 0);
    const name = (id: string) => c.line.offers.find((o) => o.id === id);
    const cost = c.parts.reduce(
      (s, p) => s + (name(p.offer)?.landedPerBase ?? 0) * p.qty * (c.line.baseQty / c.line.qty),
      0,
    );
    return html`<ui-modal
      open
      width="wide"
      .heading=${`Line ${c.line.lineNo}: ${c.split ? "split sourcing" : "select offer"}`}
      @ui-close=${() => (this.choice = null)}
    >
      <ui-flex direction="col" gap="3">
        <ui-text variant="body-md" color="muted">${c.line.description} · requested ${c.line.requested}</ui-text>
        ${
          c.split
            ? html`<ui-flex direction="col" gap="2">
                ${c.parts.map(
                  (p, i) =>
                    html`<ui-flex gap="3" align="center" wrap>
                      <ui-flex direction="col" gap="0" grow shrink>
                        <ui-text variant="title-sm">${name(p.offer)?.supplier} v${name(p.offer)?.version}</ui-text>
                        <ui-text variant="body-sm" color="muted"
                          >${amount(name(p.offer)?.landedPerBase ?? 0)} EGP / ${c.line.baseUnit} landed · up to
                          ${Math.floor((name(p.offer)?.baseQty ?? 0) / (c.line.baseQty / c.line.qty))}
                          ${c.line.unit}</ui-text
                        >
                      </ui-flex>
                      <ui-text-input
                        type="number"
                        size="sm"
                        width="auto"
                        min="0"
                        .value=${String(p.qty)}
                        .label=${`Quantity from ${name(p.offer)?.supplier}`}
                        @input=${(e: Event) => {
                          const parts = [...c.parts];
                          parts[i] = { ...p, qty: Number((e.target as HTMLInputElement).value) || 0 };
                          this.choice = { ...c, parts };
                        }}
                      ></ui-text-input>
                    </ui-flex>`,
                )}
                <ui-text variant="body-md" .color=${total === c.line.qty ? "success" : "warning"}
                  >${total} of ${c.line.qty} ${c.line.unit} · ${egp(cost)} landed</ui-text
                >
              </ui-flex>`
            : html`<ui-text variant="body-md"
                >${name(c.parts[0].offer)?.supplier} v${name(c.parts[0].offer)?.version} × ${c.line.qty} ${c.line.unit}
                · ${egp(cost)} landed</ui-text
              >`
        }
        ${
          best
            ? html`<ui-alert tone="success">This is the best-fit choice. A reason is optional.</ui-alert>`
            : html`<ui-alert tone="warning"
                >Not the best-fit offer: give a reason. It's kept on the case and shown to the approver.</ui-alert
              >`
        }
        <ui-textarea
          label="Reason"
          placeholder="e.g. Delta is our approved helmet supplier; Nile only has 10 in stock"
          .value=${this.reason}
          @input=${(e: Event) => (this.reason = (e.target as HTMLTextAreaElement).value)}
        ></ui-textarea>
      </ui-flex>
      <ui-button slot="actions" variant="text" @click=${() => (this.choice = null)}>Cancel</ui-button>
      <ui-button
        slot="actions"
        color="primary"
        ?disabled=${this.busy || (!best && !this.reason.trim()) || total < c.line.qty}
        @click=${(e: Event) => {
          e.preventDefault();
          void this._confirmSelect();
        }}
        >${this.busy ? "Saving…" : "Save selection"}</ui-button
      >
    </ui-modal>`;
  }

  private _correctionModal() {
    const c = this.correction;
    if (!c) return nothing;
    return html`<ui-modal open width="wide" heading="Correction request" @ui-close=${() => (this.correction = null)}>
      ${
        c.draft
          ? html`<ui-flex direction="col" gap="3">
              <ui-flex gap="2" align="center" wrap>
                ${aiBadge()}
                <ui-tag .tone=${c.draft.sent ? "success" : "warning"}>${c.draft.status}</ui-tag>
              </ui-flex>
              <ui-mockup-window>
                <ui-flex direction="col" gap="2" padding="4">
                  <ui-text variant="body-md"><strong>To:</strong> ${c.draft.to}</ui-text>
                  <ui-text variant="body-md"><strong>Subject:</strong> ${c.draft.subject}</ui-text>
                  <ui-divider></ui-divider>
                  <ui-ai-text .text=${c.draft.body} translatable></ui-ai-text>
                </ui-flex>
              </ui-mockup-window>
              <ui-text variant="body-sm" color="muted"
                >The client is never named to the supplier. v1 stays on the case for audit; only a corrected version can
                be priced.</ui-text
              >
            </ui-flex>`
          : html`<ui-flex gap="3" align="center"
              ><ui-loading size="sm" color="primary"></ui-loading
              ><ui-text color="muted">AI is drafting the request…</ui-text></ui-flex
            >`
      }
      <ui-button slot="actions" variant="text" @click=${() => (this.correction = null)}>Close</ui-button>
      ${
        c.draft && !c.draft.sent
          ? html`<ui-button
              slot="actions"
              color="primary"
              ?disabled=${this.busy}
              @click=${(e: Event) => {
                e.preventDefault();
                void this._sendCorrection();
              }}
              >Send to supplier</ui-button
            >`
          : nothing
      }
    </ui-modal>`;
  }

  private _acceptModal() {
    const line = this.accepting;
    if (!line) return nothing;
    return html`<ui-modal open heading="Record customer acceptance" @ui-close=${() => (this.accepting = null)}>
      <ui-flex direction="col" gap="3">
        <ui-text variant="body-md"
          >Line ${line.lineNo} uses an alternative pack. The quotation can only show it as accepted with the customer's
          written confirmation.</ui-text
        >
        <ui-textarea
          label="Evidence"
          .value=${this.acceptNote}
          @input=${(e: Event) => (this.acceptNote = (e.target as HTMLTextAreaElement).value)}
        ></ui-textarea>
      </ui-flex>
      <ui-button slot="actions" variant="text" @click=${() => (this.accepting = null)}>Cancel</ui-button>
      <ui-button
        slot="actions"
        color="primary"
        ?disabled=${this.busy || !this.acceptNote.trim()}
        @click=${(e: Event) => {
          e.preventDefault();
          void this._accept();
        }}
        >Record acceptance</ui-button
      >
    </ui-modal>`;
  }

  render() {
    if (this.restricted)
      return hiddenForRole(
        "Supplier offers carry supplier costs, so Sales sees the selling prices on the quotation instead. Supply chain, finance and management compare offers.",
      );
    if (this.error)
      return html`<ui-empty-state
        tone="error"
        heading="This page couldn't load"
        .description=${this.error}
      ></ui-empty-state>`;
    const d = this.data;
    if (!d) return loadingBlock("Comparing offers…");
    const selected = d.lines.filter((l) => l.selection.parts.length).length;
    return html`<ui-flex direction="col" gap="4">
      <ui-card heading="How offers are compared">
        <ui-text variant="body-md" color="muted"
          >Each offer is checked against the original line and normalised to the requested base unit (EA / L / kg) in
          EGP at the approved FX rate, keeping the supplier's own units and currency. Landed cost adds the freight to
          ${d.port} (lane rates, import costs for agency lines). AI suggests matches and deviations; technical
          equivalence is a person's decision.</ui-text
        >
        <ui-flex justify="between" align="center" gap="3" wrap>
          <ui-flex gap="2" wrap>
            <ui-tag tone="info">${d.fxLabel}</ui-tag>
            <ui-tag>ETA ${day(d.eta)} · ${d.daysToEta} days</ui-tag>
            <ui-tag .tone=${selected ? "success" : undefined}>${selected} of ${d.lines.length} lines selected</ui-tag>
          </ui-flex>
          <ui-button-group
            label="Compare by"
            size="xs"
            .value=${this.mode}
            .options=${[
              { value: "unit", label: "Unit price" },
              { value: "landed", label: "Landed cost" },
            ]}
            @ui-change=${(e: CustomEvent<{ value: string }>) => (this.mode = e.detail.value as typeof this.mode)}
          ></ui-button-group>
        </ui-flex>
      </ui-card>
      ${d.lines.map((l) => this._line(l))}
      <ui-flex justify="end" gap="2" wrap>
        <ui-button color="primary" .href=${`/collections/cases/${d.id}/pricing`}>Continue to pricing</ui-button>
      </ui-flex>
      ${this._choiceModal()} ${this._correctionModal()} ${this._acceptModal()}
    </ui-flex>`;
  }
}

interface Draft {
  to: string;
  subject: string;
  body: string;
  status: string;
  sent: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-case-compare": GsCaseCompare;
  }
}
