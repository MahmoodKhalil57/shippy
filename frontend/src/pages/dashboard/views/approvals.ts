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
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" direction="col" gap="1" full-width>
        <ui-flex gap="2" align="center" wrap>
          <ui-badge size="sm" variant="soft" color="primary">${a.type}</ui-badge>
          <ui-badge size="sm" variant="soft" .color=${TONE[a.tone]}>${a.status}</ui-badge>
          ${a.twoPerson ? html`<ui-badge size="sm" variant="outline" color="warning">Two-person rule</ui-badge>` : nothing}
          ${a.case ? html`<ui-text size="xs" color="muted">${a.case.caseId} · ${a.case.vessel}</ui-text>` : nothing}
        </ui-flex>
        <span>${a.title}</span>
      </ui-flex>
      <ui-text size="xs" color="muted"
        >Requested by ${a.requestedBy}${a.requestedAt ? ` · ${day(a.requestedAt, true)}` : ""}</ui-text
      >
      <ui-flex direction="col" gap="2">
        ${a.evidence.map(
          (e) =>
            html`<ui-flex gap="2" align="baseline" wrap>
              <ui-text size="xs" color="muted" uppercase>${e.label}</ui-text>
              <ui-text size="sm" .color=${e.tone && e.tone !== "neutral" && e.tone !== "info" ? e.tone : undefined}
                >${e.value}</ui-text
              >
            </ui-flex>`,
        )}
      </ui-flex>
      <ui-divider></ui-divider>
      <ui-flex direction="col" gap="1">
        <ui-flex gap="2" align="center" wrap>
          ${a.approvers.map(
            (p) =>
              html`<ui-badge
                size="sm"
                variant=${p.decision ? "soft" : "outline"}
                .color=${p.decision === "Approve" ? "success" : p.decision === "Reject" ? "error" : undefined}
                >${p.name}${p.decision ? (p.decision === "Approve" ? " ✓" : " ✕") : ""}</ui-badge
              >`,
          )}
        </ui-flex>
        <ui-text size="sm" weight="medium">${a.progress}</ui-text>
        ${a.approvers
          .filter((p) => p.reason)
          .map((p) => html`<ui-text size="xs" color="muted" italic>${p.name}: “${p.reason}”</ui-text>`)}
        <ui-text size="xs" color="muted">Who decides: ${a.rule}</ui-text>
        ${!done && !a.canDecide ? html`<ui-alert color="info" variant="soft">${a.why}</ui-alert>` : nothing}
      </ui-flex>
      <ui-flex slot="actions" gap="2" wrap>
        ${a.links.map((l) => html`<ui-button size="sm" variant="ghost" .href=${l.href}>${l.label}</ui-button>`)}
        ${
          a.canDecide
            ? html`<ui-button
                  size="sm"
                  variant="soft"
                  color="error"
                  @click=${() => {
                    this.reason = "";
                    this.deciding = { card: a, decision: "Reject" };
                  }}
                  >Return</ui-button
                >
                <ui-button
                  size="sm"
                  color="success"
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
        <ui-text size="sm" weight="semibold">${d.card.title}</ui-text>
        ${
          approve &&
          d.card.twoPerson &&
          d.card.needed - d.card.approvers.filter((p) => p.decision === "Approve").length > 1
            ? html`<ui-alert color="info" variant="soft"
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
        <ui-text size="xs" color="muted"
          >Recorded under your name with the time, on the request and the case timeline.</ui-text
        >
      </ui-flex>
      <ui-button slot="actions" variant="ghost" @click=${() => (this.deciding = null)}>Cancel</ui-button>
      <ui-button
        slot="actions"
        .color=${approve ? "success" : "error"}
        ?disabled=${this.busy || (!approve && !this.reason.trim())}
        @click=${() => void this._decide()}
        >${this.busy ? "Saving…" : approve ? "Approve" : "Return"}</ui-button
      >
    </ui-modal>`;
  }

  private _section(heading: string, sub: string, cards: ApprovalCard[], empty: string) {
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" gap="2" align="center"
        >${heading}<ui-badge size="sm" variant="soft">${cards.length}</ui-badge></ui-flex
      >
      <ui-text size="sm" color="muted">${sub}</ui-text>
      ${
        cards.length
          ? html`<ui-grid fit="md" gap="4">${cards.map((c) => this._card(c))}</ui-grid>`
          : html`<ui-text size="sm" color="muted">${empty}</ui-text>`
      }
    </ui-card>`;
  }

  render() {
    if (this.error) return html`<ui-alert color="error" variant="soft">${this.error}</ui-alert>`;
    const q = this.queue;
    if (!q) return loadingBlock("Loading approvals…");
    const mine = q.pending.filter((a) => a.canDecide);
    const others = q.pending.filter((a) => !a.canDecide);
    const first = typeof this.user?.name === "string" ? this.user.name.split(" ")[0] : "";
    return html`<ui-flex direction="col" gap="6">
      <ui-flex justify="between" align="end" gap="4" wrap>
        <ui-flex direction="col" gap="1" shrink>
          <ui-text size="xs" color="muted" weight="medium" uppercase>Approvals</ui-text>
          <ui-heading level="1" size="page"
            >${mine.length ? `${mine.length} decision${mine.length === 1 ? "" : "s"} waiting for you` : "Nothing waiting for you"}</ui-heading
          >
          <ui-text color="muted"
            >${first ? `${first}, every` : "Every"} quotation, margin exception, payment, alternative item, bank-detail
            change and FX rate needs a named person. AI never approves.</ui-text
          >
        </ui-flex>
        <ui-flex gap="2" wrap>
          <ui-button size="sm" variant="soft" href="/globals/approval-rules">Approval rules</ui-button>
        </ui-flex>
      </ui-flex>
      <ui-grid fit="xs" gap="4">
        ${[
          { label: "Waiting for you", value: mine.length, note: "You are a listed approver" },
          { label: "Waiting for others", value: others.length, note: "You can see the evidence, not decide" },
          { label: "Two-person requests", value: q.pending.filter((a) => a.twoPerson).length, note: "Finance + CEO" },
          { label: "Decided", value: q.decided.length, note: "Kept with the record for audit" },
        ].map(
          (t) =>
            html`<ui-card variant="border" size="sm" shadow="false">
              <ui-flex direction="col" gap="1">
                <ui-text size="sm" color="muted" truncate>${t.label}</ui-text>
                <ui-text size="3xl" weight="semibold" leading="tight">${t.value}</ui-text>
                <ui-text size="xs" color="muted">${t.note}</ui-text>
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
