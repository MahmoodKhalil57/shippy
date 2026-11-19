import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../../cms/client.ts";
import type { ApprovalCard } from "../../../cms/endpoints/commercial.ts";
import type { Doc } from "../../../cms/types.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import "../../../components/index.ts";
import type { Access } from "../app.ts";
import { toast } from "../shared.ts";
import { TONE, day, loadingBlock } from "./commercial-kit.ts";

/**
 * Root view "Approvals" (/approvals): everything that needs an authorised person — quotations,
 * margin exceptions, deposits and payments, alternative items, bank-detail changes, FX rates.
 * Each card shows what is being decided and the evidence behind it, who decides and why you
 * can't (when you can't). Approve / Return with a reason go through the approvals collection,
 * whose hooks enforce one decision per approver and the two-person rule.
 */

interface Queue {
  pending: ApprovalCard[];
  decided: ApprovalCard[];
  mine: number;
}

@customElement("gs-approvals")
export class GsApprovals extends LightElement {
  @property({ attribute: false }) access?: Access;
  @property({ attribute: false }) user?: Doc & { collection: string };

  @state() private queue: Queue | null = null;
  @state() private error = "";
  @state() private deciding: { card: ApprovalCard; decision: "Approve" | "Reject" } | null = null;
  @state() private reason = "";
  @state() private busy = false;

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private async _load() {
    try {
      this.queue = await api.get<Queue>("/commercial/approvals");
    } catch (e) {
      this.error = (e as Error).message;
    }
  }

  private async _decide() {
    const d = this.deciding;
    if (!d) return;
    this.busy = true;
    try {
      const card = await api.post<ApprovalCard>(`/commercial/approvals/${encodeURIComponent(d.card.id)}/decide`, {
        decision: d.decision,
        reason: this.reason,
      });
      toast(
        card.status === "Approved"
          ? `Approved: ${card.title}`
          : card.status === "Rejected"
            ? `Returned: ${card.title}`
            : `Your approval is recorded — ${card.progress}.`,
      );
      this.deciding = null;
      await this._load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = false;
    }
  }

  private _card(a: ApprovalCard) {
    const done = ["Approved", "Rejected"].includes(a.status);
    const requested = `Requested by ${a.requestedBy}${a.requestedAt ? ` · ${day(a.requestedAt, true)}` : ""}`;
    return html`<ui-card
      .heading=${a.title}
      .subhead=${a.case ? `${a.case.caseId} · ${a.case.vessel} · ${requested}` : requested}
    >
      <ui-flex slot="trailing" gap="2" align="center" wrap>
        <ui-tag tone="primary">${a.type}</ui-tag>
        <ui-tag .tone=${TONE[a.tone]}>${a.status}</ui-tag>
        ${a.twoPerson ? html`<ui-tag variant="outline" tone="warning">Two-person rule</ui-tag>` : nothing}
      </ui-flex>
      <ui-ai-summary
        type="tldr"
        auto
        context="An approval request at a ship chandler: say in one sentence what is being asked and what matters for the decision."
        .text=${[a.title, a.type, ...a.evidence.map((e) => `${e.label}: ${e.value}`), a.progress].join("\n")}
      ></ui-ai-summary>
      <ui-description-list
        layout="inline"
        .items=${a.evidence.map((e) => ({
          label: e.label,
          value: e.value,
          tone: e.tone === "success" || e.tone === "warning" || e.tone === "error" ? e.tone : undefined,
        }))}
      ></ui-description-list>
      <ui-divider></ui-divider>
      <ui-flex direction="col" gap="1">
        <ui-flex gap="2" align="center" wrap>
          ${a.approvers.map(
            (p) =>
              html`<ui-tag
                variant=${p.decision ? "soft" : "outline"}
                .tone=${p.decision === "Approve" ? "success" : p.decision === "Reject" ? "error" : undefined}
                >${p.name}${p.decision ? (p.decision === "Approve" ? " ✓" : " ✕") : ""}</ui-tag
              >`,
          )}
        </ui-flex>
        <ui-text variant="label-lg">${a.progress}</ui-text>
        ${a.approvers
          .filter((p) => p.reason)
          .map((p) => html`<ui-text variant="body-sm" color="muted" italic>${p.name}: “${p.reason}”</ui-text>`)}
        <ui-text variant="body-sm" color="muted">Who decides: ${a.rule}</ui-text>
        ${!done && !a.canDecide ? html`<ui-alert tone="info">${a.why}</ui-alert>` : nothing}
      </ui-flex>
      <ui-flex slot="actions" gap="2" wrap>
        ${a.links.map((l) => html`<ui-button size="xs" variant="text" .href=${l.href}>${l.label}</ui-button>`)}
        ${
          a.canDecide
            ? html`<ui-button
                  size="xs"
                  variant="tonal"
                  color="error"
                  @click=${() => {
                    this.reason = "";
                    this.deciding = { card: a, decision: "Reject" };
                  }}
                  >Return</ui-button
                >
                <ui-button
                  size="xs"
                  color="primary"
                  @click=${() => {
                    this.reason = "";
                    this.deciding = { card: a, decision: "Approve" };
                  }}
                  >Approve</ui-button
                >`
            : nothing
        }
      </ui-flex>
    </ui-card>`;
  }

  private _modal() {
    const d = this.deciding;
    if (!d) return nothing;
    const approve = d.decision === "Approve";
    const others = d.card.approvers.filter((p) => !p.decision && p.id !== this.user?.id);
    return html`<ui-modal
      open
      .heading=${approve ? "Approve request" : "Return with a reason"}
      @ui-close=${() => (this.deciding = null)}
    >
      <ui-flex direction="col" gap="3">
        <ui-text variant="title-sm">${d.card.title}</ui-text>
        ${
          approve &&
          d.card.twoPerson &&
          d.card.needed - d.card.approvers.filter((p) => p.decision === "Approve").length > 1
            ? html`<ui-alert tone="info"
                >Two-person rule: after you, ${others.map((p) => p.name).join(" or ")} must also approve.</ui-alert
              >`
            : nothing
        }
        <ui-textarea
          .label=${approve ? "Comment (optional)" : "Reason (required)"}
          .placeholder=${approve ? "e.g. Call-back done on the number on file" : "e.g. Margin too thin — ask the customer to accept v1 prices"}
          .value=${this.reason}
          @input=${(e: Event) => (this.reason = (e.target as HTMLTextAreaElement).value)}
        ></ui-textarea>
        <ui-ai-tools
          tools="formal shorter proofread"
          .value=${this.reason}
          @ui-change=${(e: CustomEvent<{ value: string }>) => (this.reason = e.detail.value)}
        ></ui-ai-tools>
        <ui-text variant="body-sm" color="muted"
          >Recorded under your name with the time, on the request and the case timeline.</ui-text
        >
      </ui-flex>
      <ui-button slot="actions" variant="text" @click=${() => (this.deciding = null)}>Cancel</ui-button>
      <ui-button
        slot="actions"
        .color=${approve ? "primary" : "error"}
        ?disabled=${this.busy || (!approve && !this.reason.trim())}
        @click=${() => void this._decide()}
        >${this.busy ? "Saving…" : approve ? "Approve" : "Return"}</ui-button
      >
    </ui-modal>`;
  }

  private _section(heading: string, sub: string, cards: ApprovalCard[], empty: string) {
    return html`<ui-card .count=${cards.length}>
      <span slot="heading">${heading}</span>
      <ui-text variant="body-md" color="muted">${sub}</ui-text>
      ${
        cards.length
          ? html`<ui-grid fit="md" gap="4">${cards.map((c) => this._card(c))}</ui-grid>`
          : html`<ui-text variant="body-md" color="muted">${empty}</ui-text>`
      }
    </ui-card>`;
  }

  render() {
    if (this.error)
      return html`<ui-empty-state
        tone="error"
        heading="This page couldn't load"
        .description=${this.error}
      ></ui-empty-state>`;
    const q = this.queue;
    if (!q) return loadingBlock("Loading approvals…");
    const mine = q.pending.filter((a) => a.canDecide);
    const others = q.pending.filter((a) => !a.canDecide);
    const first = typeof this.user?.name === "string" ? this.user.name.split(" ")[0] : "";
    return html`<ui-flex direction="col" gap="6">
      <ui-page-header>
        <span slot="eyebrow">Approvals</span>
        <span slot="heading"
          >${mine.length ? `${mine.length} decision${mine.length === 1 ? "" : "s"} waiting for you` : "Nothing waiting for you"}</span
        >
        <span slot="subtitle"
          >${first ? `${first}, every` : "Every"} quotation, margin exception, payment, alternative item, bank-detail
          change and FX rate needs a named person. AI never approves.</span
        >
        <ui-flex slot="actions" gap="2" wrap>
          <ui-button size="xs" variant="tonal" href="/globals/approval-rules">Approval rules</ui-button>
        </ui-flex>
      </ui-page-header>
      <ui-grid fit="xs" gap="4">
        ${[
          { label: "Waiting for you", value: mine.length, note: "You are a listed approver" },
          { label: "Waiting for others", value: others.length, note: "You can see the evidence, not decide" },
          { label: "Two-person requests", value: q.pending.filter((a) => a.twoPerson).length, note: "Finance + CEO" },
          { label: "Decided", value: q.decided.length, note: "Kept with the record for audit" },
        ].map(
          (t) =>
            html`<ui-card size="sm">
              <ui-flex direction="col" gap="1">
                <ui-text variant="body-md" color="muted" truncate>${t.label}</ui-text>
                <ui-text variant="headline-md" leading="tight">${t.value}</ui-text>
                <ui-text variant="body-sm" color="muted">${t.note}</ui-text>
              </ui-flex>
            </ui-card>`,
        )}
      </ui-grid>
      ${this._section("Waiting for you", "Approve or return with a reason. Your decision is recorded under your name.", mine, "Nothing needs your decision right now.")}
      ${this._section("Waiting for others", "Requests you can follow but not decide — each card says who can.", others, "No other open requests.")}
      ${this._section("Recently decided", "Approved and returned requests, with who decided and why.", q.decided, "No decisions yet.")}
      ${this._modal()}
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-approvals": GsApprovals;
  }
}
