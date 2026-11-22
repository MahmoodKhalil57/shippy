import { widgets, type RecordsSpec } from "saastemlycrm-design-system/contracts";
import * as link from "../links.ts";
import { decidedApprovals, openApprovals } from "../queries/approvals.ts";

/**
 * Approvals (/approvals): everything that needs an authorised person — quotations, margin
 * exceptions, deposits and payments, alternative items, bank-detail changes, FX rates. All of it
 * is the approvals collection's (../collections/commercial.ts): each request's evidence, how far
 * it has got, who decides and why you can't (its virtual fields, worked out for whoever reads it),
 * Approve / Return with a reason (its actions, for a listed approver who hasn't decided:
 * `canDecide`), and its links to the case, quotation, pricing, rates, supplier or PO behind it.
 * The collection's hooks enforce one decision per approver and the two-person rule; deciding
 * answers with how to take it back. No endpoint of its own, no formatter.
 */

/**
 * A request as an entry: its status, case, who asked and when; its type and the two-person rule as
 * tags; how far it has got and who decides; the evidence behind it, a line each; and, for one you
 * follow but can't decide, why (`notice`).
 */
const entry = (
  keep: Record<string, unknown> | undefined,
  where: Record<string, unknown>,
  empty: string,
  notice?: string,
): RecordsSpec => ({
  collection: "approvals",
  where,
  keep,
  sort: "-createdAt",
  limit: 50,
  layout: "entries",
  columns: ["status", "case", "requestedBy", "createdAt"],
  tags: ["type", "rule"],
  facts: ["progress", "whoDecides"],
  notes: "evidence",
  notice,
  empty,
});

export const approvalsPage = widgets({
  header: {
    eyebrow: "Approvals",
    heading: "Decisions that need a named person",
    subtitle:
      "Every quotation, margin exception, payment, alternative item, bank-detail change and FX rate needs a named person. AI never approves.",
    actions: [{ label: "Approval rules", href: link.global("approval-rules") }],
  },
  // The figures, then the queue's three parts: the same entries, each of a different slice.
  widgets: [
    // What kinds of decision are waiting, as one bar (each opening its list).
    {
      title: "What's waiting, by kind",
      size: "m",
      rows: 4,
      maxRows: 5,
      breakdown: { collection: "approvals", by: "type", as: "share" },
    },
    {
      size: "m",
      metrics: {
        collection: "approvals",
        items: [
          {
            label: "Waiting for you",
            where: openApprovals,
            keep: { canDecide: { equals: true } },
            note: "You are a listed approver",
            tone: { some: "warning", none: "success" },
            main: true,
          },
          {
            label: "Waiting for others",
            where: openApprovals,
            keep: { canDecide: { equals: false } },
            note: "You can see the evidence, not decide",
          },
          {
            label: "Two-person requests",
            where: { ...openApprovals, twoPerson: { equals: true } },
            note: "Finance + CEO",
          },
          { label: "Decided", where: decidedApprovals, note: "Kept with the record for audit" },
        ],
      },
    },
    {
      title: "Waiting for you",
      subhead: "Approve or return with a reason. Your decision is recorded under your name.",
      size: "m",
      records: entry({ canDecide: { equals: true } }, openApprovals, "Nothing needs your decision right now."),
    },
    {
      title: "Waiting for others",
      subhead: "Requests you can follow but not decide — each card says who can.",
      size: "m",
      records: entry({ canDecide: { equals: false } }, openApprovals, "No other open requests.", "why"),
    },
    {
      title: "Recently decided",
      subhead: "Approved and returned requests, with who decided and why.",
      size: "m",
      records: entry(undefined, decidedApprovals, "No decisions yet."),
    },
    // Every approval, pending first, as rich rows (switchable to cards or a table).
    {
      title: "All approvals",
      size: "full",
      rows: 10,
      minRows: 6,
      collection: {
        collection: "approvals",
        key: "all",
        layout: "list",
        sort: "status",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
  ],
});
