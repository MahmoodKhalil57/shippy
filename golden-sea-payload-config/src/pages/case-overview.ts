import { custom, gauges, steps, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/case-overview.ts";
import { caseOverview as overview } from "../queries/case-overview.ts";

/**
 * Case tab "Overview": the case at a glance. Where it is on the 16-step flow, how far each line
 * really is (partials never read as done), the next action and blocker, owner and backup with an
 * AI-drafted handover a person confirms ("Reassign"), the clarification log, the
 * customer's contact rule, the open tasks and the activity timeline (automatic vs human vs alert,
 * with the rule that fired).
 *
 * What the case says on its own is read from the cases collection with no code: its next action,
 * blocker (red on a blocked case) and due date (`due`, red once passed), its line counts as bars
 * (`lineCount`), owner and backup with the collection's "Reassign" action, the last handover note,
 * its lines (`items`: each status in its bucket's tone, the AI's read amber under 85%) and its
 * clarifications (`reply`: "Waiting" in amber while open), the customer's contact rule and what it
 * means (`customer.contactRule`, `customer.contactNote`), its open tasks and its activity log (the
 * activities collection, each entry's `byline` naming the rule or the person). What spans the
 * case's purchase orders, receipts, deliveries and invoices, its place on the lifecycle and the
 * on-device summary of its timeline read GET /api/case-overview/:id (../endpoints/platform.ts),
 * each a design-system kind given a formatter (../format/case-overview.ts).
 */
export const caseOverview = widgets({
  // 3 lanes: m + s, then a row of s, then the tables, then m + s.
  // The lifecycle across the top, the short facts in a row under it (owner and tasks, the shortest,
  // in one column), the line status with the rest of them beside it, then the logs.
  widgets: [
    steps({
      title: "Lifecycle — first email to last payment",
      // Across the screen: the steps read as one strip.
      size: "full",
      data: overview,
      format: fmt.lifecycle,
    }),
    // The case's own fields: what's next, what blocks it, when the quote is due (`due` counts
    // from the demo's day), the vessel and the value (never shown to Sales: the field's access).
    {
      title: "Next action",
      size: "s",
      fields: {
        fields: ["nextAction", "blocker", "deadline", "due", "vesselPort", "eta", "customerRef", "value"],
        layout: "inline",
        actions: false,
      },
    },
    // Each line on its own: how many are ready, waiting, blocked or without an offer, each a bar of
    // all of them. A case with some lines ready is that share done, never "done" until every line is.
    {
      title: "Line progress",
      subhead: "Each line moves on its own. A case is never “done” until every line is.",
      size: "s",
      hidden: (d) => !(d as { lineCount?: unknown }).lineCount,
      fields: {
        fields: [
          "lineCount.readyPct",
          "lineCount.ready",
          "lineCount.waiting",
          "lineCount.blocked",
          "lineCount.noOffer",
        ],
        actions: false,
      },
    },
    // Who owns the case and backs them up, with the cases collection's "Reassign" (to whoever may
    // hand it over: the AI drafts the note, a person edits and confirms it).
    {
      title: "Owner & backup",
      size: "s",
      fields: { fields: ["owner", "backup"] },
    },
    {
      title: "Last handover note",
      size: "s",
      hidden: (d) => !(d as { handoverNote?: string }).handoverNote,
      fields: { fields: ["handoverNote"], actions: false },
    },
    // The case's open tasks, soonest due first.
    {
      title: "Open tasks",
      size: "s",
      records: {
        collection: "tasks",
        where: { case: { equals: "$doc.id" }, status: { equals: "Open" } },
        sort: "due",
        columns: ["title", "channel", "owner", "due"],
        layout: "list",
        empty: "Nothing open.",
      },
    },
    // Every line of the case with its status and, where the AI read it, how sure it was.
    {
      title: "Line status",
      size: "l",
      records: {
        doc: true,
        field: "items",
        columns: ["lineNo", "description", "status", "aiRead"],
        labels: { lineNo: "#", description: "Line" },
        hideEmpty: true,
      },
    },
    gauges({
      title: "After the order",
      size: "s",
      data: overview,
      hidden: ({ fulfilment: f }) => !f.started,
      format: fmt.fulfilment,
    }),
    // The customer's contact rule, read through the case, and what it means: strict customers get
    // internal reminders only.
    {
      title: "Customer contact rule",
      size: "s",
      fields: { fields: ["customer", "customer.contactRule", "customer.contactNote"], actions: false },
    },
    // Questions and answers per line, to the customer, a supplier or internal: clear lines keep
    // moving while one waits.
    {
      title: "Clarifications log",
      subhead:
        "Questions and answers per line, to the customer, a supplier or internal. Clear lines keep moving while one waits.",
      size: "l",
      records: {
        doc: true,
        field: "clarifications",
        columns: ["lineNo", "to", "question", "reply"],
        supporting: { to: "via", question: "askedBy", reply: "answeredAt" },
        labels: { lineNo: "Line", to: "To · via" },
        empty: "No clarifications on this case.",
      },
    },
    // The case's audit trail, newest first: every automatic step names the rule that fired, every
    // human step the person (the activities' own `byline`).
    {
      title: "Activity timeline — audit trail",
      subhead:
        "Every automatic step names the rule that fired; every human step names the person. Nothing is edited after the fact.",
      size: "m",
      records: {
        collection: "activities",
        where: { case: { equals: "$doc.id" } },
        sort: "-at",
        limit: 100,
        columns: ["at", "byline"],
        text: "text",
        dot: "kind",
        layout: "timeline",
        empty: "Nothing logged yet.",
      },
    },
    custom({
      title: "Case summary",
      size: "s",
      data: overview,
      format: fmt.timelineSummary,
    }),
  ],
});
