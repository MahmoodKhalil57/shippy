import { chart, figures, gauges, header, steps, table, text, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/inbox-history.ts";
import { history } from "../queries/inbox-history.ts";

/**
 * Inbox history (`/inbox-history`): the deck's "We organise your past" moment. Every mailbox is
 * scanned (dry run) and de-duplicated; "Organise" turns years of emails into customers (ship
 * managers), vessels (IMO, fleet, ports), suppliers (who quoted what) and dated prices — even
 * where no PO followed. What the organiser is unsure of waits in a review queue, and nothing is
 * saved before management (Karim Balbaa) approves the import.
 * Data and actions: /api/inbox-history (../endpoints/sourcing.ts). Each widget is a design-system
 * kind given a query and a formatter (../format/inbox-history.ts). Every tile is there from the
 * start: what "Organise" finds fills them, it never adds them.
 */
const NOT_ORGANISED = "Press Organise to read them from the kept messages.";

export const inboxHistoryPage = widgets({
  header: header({ data: history, format: fmt.historyHeader }),
  // The import's progress and its years in one column, its checks beside them, then what it found.
  widgets: [
    steps({
      title: "Import progress",
      size: "m",
      skeleton: "text",
      data: history,
      format: fmt.importProgress,
    }),
    chart({
      title: "Messages per year",
      size: "m",
      skeleton: "chart",
      data: history,
      format: fmt.messagesPerYear,
    }),
    gauges({
      title: "De-duplication",
      size: "s",
      data: history,
      format: fmt.dedup,
    }),
    figures({ data: history, labels: fmt.KEPT, format: fmt.kept }),
    // Organise, then management's approval, then what was saved: one tile through every stage.
    text({
      title: "Organise and approve",
      size: "s",
      rows: 4,
      skeleton: "text",
      data: history,
      format: fmt.importNext,
    }),
    // What the organiser wasn't sure of (the history import's messages), each with its proposal,
    // confirmed or rejected by a person and changeable until the import is approved (the
    // collection's actions). None before "Organise".
    {
      title: "Uncertain items",
      subhead: "Reviewed with you before they are saved: confirm the proposal or reject it.",
      size: "s",
      rows: 12,
      records: {
        collection: "intake-messages",
        where: { source: { equals: "History import" } },
        sort: "receivedAt",
        limit: 20,
        layout: "entries",
        columns: ["subject", "mailbox", "receivedAt", "fromName"],
        text: "history.question",
        facts: ["history.proposal", "match.reviewedBy"],
        tags: ["history.kind", "history.confidencePct", "history.decision"],
        empty: "Nothing to review yet. What the organiser isn't sure of comes here after Organise.",
      },
    },
    table({
      title: "Mailboxes imported",
      size: "l",
      skeleton: "table",
      data: history,
      format: fmt.mailboxes,
    }),
    // What "Organise" found: each figure "—" and each table its empty state until then.
    figures({ data: history, labels: fmt.FOUND_TOTALS, format: fmt.foundTotals }),
    table({
      title: "Customers — ship managers",
      size: "l",
      skeleton: "table",
      data: history,
      empty: { when: (d) => !d.organised, heading: "No customers found yet.", description: NOT_ORGANISED },
      format: fmt.foundCustomers,
    }),
    table({
      title: "Vessels — IMO, fleet, ports",
      size: "l",
      skeleton: "table",
      data: history,
      empty: { when: (d) => !d.organised, heading: "No vessels found yet.", description: NOT_ORGANISED },
      format: fmt.foundVessels,
    }),
    table({
      title: "Suppliers — who quoted what",
      size: "l",
      skeleton: "table",
      data: history,
      empty: { when: (d) => !d.organised, heading: "No suppliers found yet.", description: NOT_ORGANISED },
      format: fmt.foundSuppliers,
    }),
    table({
      title: "Dated prices — even with no PO",
      size: "l",
      skeleton: "table",
      data: history,
      empty: { when: (d) => !d.organised, heading: "No dated prices found yet.", description: NOT_ORGANISED },
      format: fmt.foundPrices,
    }),
  ],
});
