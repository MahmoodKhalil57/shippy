import {
  alert,
  chart,
  figures,
  gauges,
  header,
  steps,
  table,
  text,
  widgets,
} from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/inbox-history.ts";
import { history } from "../queries/inbox-history.ts";

/**
 * Inbox history (`/inbox-history`): the deck's "We organise your past" moment. Every mailbox is
 * scanned (dry run) and de-duplicated; "Organise" turns years of emails into customers (ship
 * managers), vessels (IMO, fleet, ports), suppliers (who quoted what) and dated prices — even
 * where no PO followed. What the organiser is unsure of waits in a review queue, and nothing is
 * saved before management (Karim Balbaa) approves the import.
 * Data and actions: /api/inbox-history (../endpoints/sourcing.ts). Each widget is a design-system
 * kind given a query and a formatter (../format/inbox-history.ts).
 */
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
    figures({ data: history, format: fmt.kept }),
    text({
      title: "Import approval",
      size: "s",
      skeleton: "text",
      data: history,
      hidden: (d) => d.approved,
      // An import waits for approval until it's given: it holds its place while loading.
      expect: "shown",
      format: fmt.importApproval,
    }),
    alert({
      title: "Import approval",
      size: "s",
      skeleton: "text",
      data: history,
      hidden: (d) => !d.approved,
      format: fmt.importApproved,
    }),
    text({
      title: "Years of emails, RFQs, offers and quotes · scattered",
      size: "s",
      skeleton: "text",
      data: history,
      hidden: (d) => d.organised,
      // Until someone organises the import, which is where it starts: it holds its place while loading.
      expect: "shown",
      format: fmt.organiseCall,
    }),
    // What the organiser wasn't sure of (the history import's messages), each with its proposal,
    // confirmed or rejected by a person and changeable until the import is approved (the
    // collection's actions). None before "Organise".
    {
      title: "Uncertain items",
      subhead: "Reviewed with you before they are saved — confirm the proposal or reject it.",
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
        hideEmpty: true,
      },
    },
    table({
      title: "Mailboxes imported",
      size: "l",
      skeleton: "table",
      data: history,
      format: fmt.mailboxes,
    }),
    figures({ data: history, hidden: (d) => !d.organised, format: fmt.foundTotals }),
    table({
      title: "Customers — ship managers",
      size: "l",
      skeleton: "table",
      data: history,
      hidden: (d) => !d.organised,
      format: fmt.foundCustomers,
    }),
    table({
      title: "Vessels — IMO, fleet, ports",
      size: "l",
      skeleton: "table",
      data: history,
      hidden: (d) => !d.organised,
      format: fmt.foundVessels,
    }),
    table({
      title: "Suppliers — who quoted what",
      size: "l",
      skeleton: "table",
      data: history,
      hidden: (d) => !d.organised,
      format: fmt.foundSuppliers,
    }),
    table({
      title: "Dated prices — even with no PO",
      size: "l",
      skeleton: "table",
      data: history,
      hidden: (d) => !d.organised,
      format: fmt.foundPrices,
    }),
  ],
});
