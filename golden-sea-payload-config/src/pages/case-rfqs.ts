import { list, message, steps, text, timeline, widgets } from "saastemlycrm-design-system/contracts";
import { replyActions } from "../actions/sourcing.ts";
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

export const caseRfqs = widgets({
  params: { send: "split" },
  widgets: [
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
      tiles: 1,
      empty: { heading: m.page_rfqs_no_new_suppliers() },
      items: (d) => d.newSuppliers,
      key: (s: fmt.NewSupplier) => s.id,
      title: (s: fmt.NewSupplier) => s.name,
      format: fmt.newSupplier,
    }),
    {
      title: m.page_rfqs_supplier_rfqs(),
      subhead: m.page_rfqs_list_subhead(),
      size: "l",
      head: () => ({ actions: replyActions() }),
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
      tiles: 1,
      empty: { heading: m.page_rfqs_no_previews() },
      items: (d) => d.plan?.drafts ?? [],
      key: (r: RfqDraft) => `${r.reference}-preview`,
      title: (r: RfqDraft) => `${r.supplierName} · ${r.reference}`,
      format: fmt.rfqDraftEmail,
    }),
  ],
});
