import type { Widget, WidgetScope } from "saastemlycrm-design-system/contracts";
import { overdueInvoices } from "../queries/cash.ts";
import {
  bills,
  exceptions,
  liveCases,
  myDecisions,
  myLiveCases,
  ROLES,
  toCollect,
  type Counter,
} from "../queries/aside.ts";
import { mine } from "../queries/cases.ts";
import { openTasks, toTriage } from "../queries/work.ts";

/**
 * The side panel's widgets (its Widgets section): for each role, one card the panel's width with
 * four counts, a row each (the count's label, up to two lines, the count at its end, opening its list). The panel
 * is narrow and shares its height with notifications and bookmarks, so a count's note stays on
 * screens with room for it, not here.
 *
 * The first two are what this person has to act on, amber while there are any (they also feed the
 * navigation's attention badges); the last two are what's in motion that they steer by.
 *
 * Widgets like any screen's (no-code `counts`, `layout: "list"`), shown by role with `visible`;
 * the panel draws them on a board of its own. The counts several roles share are
 * ../queries/aside.ts's.
 */

/** Shown to one role only (or, with no role named, to everyone without counters of their own). */
const forRole =
  (r?: string) =>
  ({ user }: WidgetScope) =>
    r ? user.role === r : !ROLES.includes(user.role ?? "");

/** Board rows for the title and four counts, each label at most two lines (the list clamps it there). */
const ROWS = 6;

/** One role's card: what they act on, then what they watch; a line each, no notes. */
const desk = (role: string | undefined, act: Counter[], watch: Counter[]): Widget => {
  const items = [...act, ...watch].map((x) => ({ ...x, note: undefined }));
  return {
    title: "Your desk",
    visible: forRole(role),
    size: "full",
    rows: ROWS,
    minRows: ROWS,
    maxRows: ROWS,
    skeleton: "list",
    counts: { collection: items[0]!.collection, layout: "list", items },
  };
};

const awaitingApproval: Counter = {
  label: "Held for approval",
  collection: "cases",
  where: { wait: { equals: "Awaiting internal approval" } },
  note: "Cases waiting on a margin, deposit or other approval",
};
const overdue: Counter = {
  label: "Overdue invoices",
  collection: "invoices",
  where: overdueInvoices,
  note: "Past their due date with a balance open",
  tone: "warning",
};
const billsOnHold: Counter = {
  label: "Bills on hold",
  collection: "supplier-bills",
  where: { status: { equals: "On hold" } },
  note: "PO, receipt and bill don't match yet",
  tone: "warning",
};
const deliveries: Counter = {
  label: "Deliveries in progress",
  collection: "deliveries",
  where: { status: { not_equals: "Delivered" } },
  note: "Drops planned or on the way to a vessel",
};
const awaitingCustomer: Counter = {
  label: "Waiting on customers",
  collection: "cases",
  where: mine({ wait: { equals: "Awaiting customer decision" } }),
  note: "Your quotes sent, waiting for a decision",
  tone: "warning",
};
const draftQuotes: Counter = {
  label: "Quotes to finish",
  collection: "quotations",
  where: { status: { equals: "Draft" } },
  note: "Drafts not yet sent",
};
const pipeline: Counter = {
  label: "My pipeline",
  collection: "opportunities",
  where: { owner: { equals: "$user.id" } },
  note: "Prospects you're working on",
};
const inbox: Counter = {
  label: "Inbox to triage",
  collection: "intake-messages",
  where: toTriage,
  note: "New messages and uncertain matches",
  tone: "warning",
};
const followUps: Counter = {
  label: "Open follow-ups",
  collection: "tasks",
  where: openTasks,
  note: "Calls, messages and reminders to do",
};
const rfqsWaiting: Counter = {
  label: "RFQs awaiting reply",
  collection: "supplier-rfqs",
  where: { status: { equals: "Awaiting reply" } },
  note: "Suppliers who haven't answered yet",
  tone: "warning",
};
const myTasks: Counter = {
  label: "My open tasks",
  collection: "tasks",
  where: mine(openTasks),
  note: "Your follow-ups still open",
};
const awaitingSupplier: Counter = {
  label: "Waiting on suppliers",
  collection: "cases",
  where: { wait: { equals: "Awaiting supplier" } },
  note: "Cases held for supplier replies",
};

export const aside: Widget[] = [
  // Management: decisions and exceptions; the live book and what's held for approval.
  desk("management", [myDecisions, exceptions], [liveCases, awaitingApproval]),
  // The Financial Director: decisions and overdue money; what's open both ways.
  desk("finance-director", [myDecisions, overdue], [toCollect, bills]),
  // Operations: bills that don't match and failed steps; deliveries and money to collect.
  desk("operations", [billsOnHold, exceptions], [deliveries, toCollect]),
  // Sales: quotes with customers and drafts to finish; their cases and pipeline.
  desk("sales", [awaitingCustomer, draftQuotes], [myLiveCases, pipeline]),
  // The office manager: the inbox and failed steps; follow-ups and the live book.
  desk("office-admin", [inbox, exceptions], [followUps, liveCases]),
  // Everyone else (the sourcing desk): supplier replies and their tasks; their cases and what waits on suppliers.
  desk(undefined, [rfqsWaiting, myTasks], [myLiveCases, awaitingSupplier]),
];
