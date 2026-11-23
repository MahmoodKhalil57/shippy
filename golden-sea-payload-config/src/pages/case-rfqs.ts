import { list, message, steps, text, timeline, widgets } from "saastemlycrm-design-system/contracts";
import { simulateReplies } from "../actions/sourcing.ts";
import type { CaseRfqRow, RfqDraft } from "../endpoints/sourcing.ts";
import * as fmt from "../format/sourcing.ts";
import {
  caseSupplierRfqs,
  closedRfqs,
  repliedRfqs,
  repliesOnCase,
  repliesToReview,
  rfqs,
  waitingRfqs,
} from "../queries/sourcing.ts";
import { m } from "../i18n/paraglide/messages.js";

/**
 * Case tab "Supplier RFQs": the case's lines go out to suppliers (split by category or as the
 * full list) in an anonymised RFQ (no client, vessel or customer files). Statuses, the reminder
 * schedule (stops on reply, escalation after two reminders), and the presenter's "Simulate
 * replies": replies matched by reference even with a changed subject, a new supplier saved on the
 * spot with its dated price, offers created for the Compare tab, and anything uncertain left for a
 * person (the replies are intake messages, read with no code, with that collection's decisions). "Draft RFQs" picks the lines and drafts one anonymised RFQ per supplier ("How to send"
 * is the `send` parameter); the drafts stay on the server (the payload's `plan`) to preview,
 * remove one by one, and send after a confirmation.
 * Data: GET /api/sourcing/cases/:id; actions: POST /api/sourcing/cases/:id/plan, …/plan/remove,
 * …/plan/discard, …/send, /api/case-rfqs/:id/simulate-replies, /api/inbox/:id/review
 * (../endpoints/sourcing.ts). The RFQs themselves, their figures and "Remind now" are the
 * supplier-rfqs collection's (../collections/sourcing.ts), read with no code; the rest is a
 * design-system kind given a query and a formatter (../format/sourcing.ts).
 */
export const caseRfqs = widgets({
  params: { send: "split" },
  // The figures with what needs a look beside them, the RFQs, then reminders (the rule, then each
  // supplier's schedule), drafting, and the drafts (the list, then each email).
  widgets: [
    // The case's supplier RFQs in four numbers, straight from the collection.
    {
      size: "s",
      metrics: {
        collection: "supplier-rfqs",
        items: [
          { label: m.page_rfqs_supplier_rfqs(), where: caseSupplierRfqs, note: m.page_rfqs_from_one(), main: true },
          { label: m.page_rfqs_replied(), where: repliedRfqs, note: m.page_rfqs_replied_note(), tone: "success" },
          {
            label: m.page_rfqs_waiting(),
            where: waitingRfqs,
            note: m.page_rfqs_waiting_note(),
            tone: { some: "warning", none: "success" },
          },
          { label: m.page_rfqs_closed(), where: closedRfqs, note: m.page_rfqs_closed_note() },
        ],
      },
    },
    // The replies themselves are intake messages (../collections/sourcing.ts): matched ones, and
    // the ones waiting for a person with the collection's decisions ("Confirm offer", a "Link to…"
    // per candidate case, "Not related").
    {
      title: m.page_rfqs_matched_title(),
      subhead: m.page_rfqs_matched_subhead(),
      size: "s",
      collection: {
        collection: "intake-messages",
        key: "replies-matched",
        layout: "list",
        where: repliesOnCase,
        sort: "-receivedAt",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
    {
      title: m.page_rfqs_review_title(),
      subhead: m.page_rfqs_review_subhead(),
      size: "s",
      head: () => ({ countTone: "warning" }),
      records: {
        collection: "intake-messages",
        where: repliesToReview,
        sort: "-receivedAt",
        layout: "entries",
        columns: ["subject", "fromName", "receivedAt"],
        tags: ["match.confidencePct"],
        notes: "match.basis",
        notice: "uncertain",
        empty: m.page_rfqs_review_empty(),
      },
    },
    list.each({
      data: rfqs,
      size: "s",
      skeleton: "list",
      // One new supplier is what a case usually brings; more share its tile, behind "Show all".
      tiles: 1,
      empty: { heading: m.page_rfqs_no_new_suppliers() },
      items: (d) => d.newSuppliers,
      key: (s: fmt.NewSupplier) => s.id,
      title: (s: fmt.NewSupplier) => s.name,
      format: fmt.newSupplier,
    }),
    // Every supplier RFQ of the case (the collection's own records: its status tones, where its
    // reminders stand, "Remind now" while it waits), with the presenter's "Simulate replies".
    {
      title: m.page_rfqs_supplier_rfqs(),
      subhead: m.page_rfqs_list_subhead(),
      size: "l",
      head: () => ({ actions: [simulateReplies] }),
      records: {
        collection: "supplier-rfqs",
        where: caseSupplierRfqs,
        sort: "reference",
        limit: 50,
        columns: ["reference", "supplier", "lineNos", "sentAt", "status", "reminderState", "lastEvent"],
        supporting: { supplier: "category", sentAt: "dueAt" },
        labels: { lineNos: m.page_rfqs_lines(), sentAt: m.page_rfqs_sent_due() },
        empty: m.page_rfqs_list_empty(),
      },
    },
    timeline({
      title: m.page_rfqs_arrivals_title(),
      size: "m",
      data: rfqs,
      empty: { when: (d) => !d.arrivals.length, heading: m.page_rfqs_no_replies() },
      format: fmt.replyArrivals,
    }),
    text({
      title: m.page_rfqs_reminders_title(),
      size: "m",
      data: rfqs,
      format: fmt.reminderRule,
    }),
    steps.each({
      data: rfqs,
      size: "m",
      // Usually one supplier is still being chased; any others share its tile, behind "Show all".
      tiles: 1,
      empty: { heading: m.page_rfqs_none_chased() },
      items: (d) => d.rfqs.filter(fmt.chased),
      key: (r: CaseRfqRow) => `${r.id}-reminders`,
      title: (r: CaseRfqRow) => `${r.supplier.name} · ${r.reference}`,
      format: fmt.reminderSchedule,
    }),
    list({
      title: m.page_rfqs_draft_title(),
      size: "m",
      data: rfqs,
      format: fmt.rfqLines,
    }),
    list({
      title: m.page_rfqs_drafted_title(),
      size: "l",
      data: rfqs,
      empty: {
        when: (d) => !d.plan?.drafts.length,
        heading: m.page_rfqs_no_drafts(),
        description: m.page_rfqs_no_drafts_description(),
      },
      format: fmt.rfqDrafts,
    }),
    message.each({
      data: rfqs,
      size: "l",
      // The first draft's email; the others follow it in the same tile, behind "Show all".
      tiles: 1,
      empty: { heading: m.page_rfqs_no_previews() },
      items: (d) => d.plan?.drafts ?? [],
      key: (r: RfqDraft) => `${r.reference}-preview`,
      title: (r: RfqDraft) => `${r.supplierName} · ${r.reference}`,
      format: fmt.rfqDraftEmail,
    }),
  ],
});
