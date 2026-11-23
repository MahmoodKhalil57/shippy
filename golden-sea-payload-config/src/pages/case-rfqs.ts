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
          { label: "Supplier RFQs", where: caseSupplierRfqs, note: "From 1 customer RFQ", main: true },
          { label: "Replied", where: repliedRfqs, note: "Offers captured automatically", tone: "success" },
          {
            label: "Waiting",
            where: waitingRfqs,
            note: "Reminders scheduled",
            tone: { some: "warning", none: "success" },
          },
          { label: "Declined · no response", where: closedRfqs, note: "Two reminders, then the owner is alerted" },
        ],
      },
    },
    // The replies themselves are intake messages (../collections/sourcing.ts): matched ones, and
    // the ones waiting for a person with the collection's decisions ("Confirm offer", a "Link to…"
    // per candidate case, "Not related").
    {
      title: "Replies matched",
      subhead: "Matched by reference, thread and sender — even when the supplier changed the subject.",
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
      title: "Needs a person",
      subhead: "Anything the AI isn't sure of waits here — nothing uncertain is applied on its own.",
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
        empty: "Nothing waiting for a person.",
      },
    },
    list.each({
      data: rfqs,
      size: "s",
      skeleton: "list",
      // One new supplier is what a case usually brings; more share its tile, behind "Show all".
      tiles: 1,
      empty: { heading: "No new suppliers from replies yet." },
      items: (d) => d.newSuppliers,
      key: (s: fmt.NewSupplier) => s.id,
      title: (s: fmt.NewSupplier) => s.name,
      format: fmt.newSupplier,
    }),
    // Every supplier RFQ of the case (the collection's own records: its status tones, where its
    // reminders stand, "Remind now" while it waits), with the presenter's "Simulate replies".
    {
      title: "Supplier RFQs",
      subhead: "Each supplier sees only the lines they can quote — never the client, the vessel or the client's files.",
      size: "l",
      head: () => ({ actions: [simulateReplies] }),
      records: {
        collection: "supplier-rfqs",
        where: caseSupplierRfqs,
        sort: "reference",
        limit: 50,
        columns: ["reference", "supplier", "lineNos", "sentAt", "status", "reminderState", "lastEvent"],
        supporting: { supplier: "category", sentAt: "dueAt" },
        labels: { lineNos: "Lines", sentAt: "Sent · due" },
        empty: "No supplier RFQs yet — draft them below.",
      },
    },
    timeline({
      title: "Replies arriving",
      size: "m",
      data: rfqs,
      empty: { when: (d) => !d.arrivals.length, heading: "No supplier replies yet." },
      format: fmt.replyArrivals,
    }),
    text({
      title: "Reminders and escalation",
      size: "m",
      data: rfqs,
      format: fmt.reminderRule,
    }),
    steps.each({
      data: rfqs,
      size: "m",
      // Usually one supplier is still being chased; any others share its tile, behind "Show all".
      tiles: 1,
      empty: { heading: "No supplier is being chased." },
      items: (d) => d.rfqs.filter(fmt.chased),
      key: (r: CaseRfqRow) => `${r.id}-reminders`,
      title: (r: CaseRfqRow) => `${r.supplier.name} · ${r.reference}`,
      format: fmt.reminderSchedule,
    }),
    list({
      title: "Draft supplier RFQs",
      size: "m",
      data: rfqs,
      format: fmt.rfqLines,
    }),
    list({
      title: "Drafted supplier RFQs",
      size: "l",
      data: rfqs,
      empty: {
        when: (d) => !d.plan?.drafts.length,
        heading: "No drafts waiting to be sent.",
        description: "Draft RFQs keeps them here to check before they go out.",
      },
      format: fmt.rfqDrafts,
    }),
    message.each({
      data: rfqs,
      size: "l",
      // The first draft's email; the others follow it in the same tile, behind "Show all".
      tiles: 1,
      empty: { heading: "No draft emails to preview." },
      items: (d) => d.plan?.drafts ?? [],
      key: (r: RfqDraft) => `${r.reference}-preview`,
      title: (r: RfqDraft) => `${r.supplierName} · ${r.reference}`,
      format: fmt.rfqDraftEmail,
    }),
  ],
});
