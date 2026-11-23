import { chart, figures, gauges, header, steps, table, text, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/inbox-history.ts";
import { history } from "../queries/inbox-history.ts";
import { m } from "../i18n/paraglide/messages.js";

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
const NOT_ORGANISED = m.page_history_not_organised();

export const inboxHistoryPage = widgets({
  header: header({ data: history, format: fmt.historyHeader }),
  // The import's progress and its years in one column, its checks beside them, then what it found.
  widgets: [
    steps({
      title: m.page_history_progress(),
      size: "m",
      skeleton: "text",
      data: history,
      format: fmt.importProgress,
    }),
    chart({
      title: m.page_history_per_year(),
      size: "m",
      skeleton: "chart",
      data: history,
      format: fmt.messagesPerYear,
    }),
    gauges({
      title: m.page_history_dedup(),
      size: "s",
      data: history,
      format: fmt.dedup,
    }),
    figures({ data: history, labels: fmt.KEPT, name: fmt.keptFigureName, format: fmt.kept }),
    // Organise, then management's approval, then what was saved: one tile through every stage.
    text({
      title: m.page_history_organise_approve(),
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
      title: m.page_history_uncertain_title(),
      subhead: m.page_history_uncertain_subhead(),
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
        empty: m.page_history_uncertain_empty(),
      },
    },
    table({
      title: m.page_history_mailboxes(),
      size: "l",
      skeleton: "table",
      data: history,
      format: fmt.mailboxes,
    }),
    // What "Organise" found: each figure "—" and each table its empty state until then.
    figures({ data: history, labels: fmt.FOUND_TOTALS, name: fmt.foundFigureName, format: fmt.foundTotals }),
    table({
      title: m.page_history_customers(),
      size: "l",
      skeleton: "table",
      data: history,
      empty: { when: (d) => !d.organised, heading: m.page_history_no_customers(), description: NOT_ORGANISED },
      format: fmt.foundCustomers,
    }),
    table({
      title: m.page_history_vessels(),
      size: "l",
      skeleton: "table",
      data: history,
      empty: { when: (d) => !d.organised, heading: m.page_history_no_vessels(), description: NOT_ORGANISED },
      format: fmt.foundVessels,
    }),
    table({
      title: m.page_history_suppliers(),
      size: "l",
      skeleton: "table",
      data: history,
      empty: { when: (d) => !d.organised, heading: m.page_history_no_suppliers(), description: NOT_ORGANISED },
      format: fmt.foundSuppliers,
    }),
    table({
      title: m.page_history_prices(),
      size: "l",
      skeleton: "table",
      data: history,
      empty: { when: (d) => !d.organised, heading: m.page_history_no_prices(), description: NOT_ORGANISED },
      format: fmt.foundPrices,
    }),
  ],
});
