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
import { m } from "../i18n/paraglide/messages.js";

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

/** Board rows while it loads: the title and four counts, each label at most two lines (the list clamps it there). */
const ROWS = 6;

/** One role's card: what they act on, then what they watch; a line each, no notes. */
const desk = (role: string | undefined, act: Counter[], watch: Counter[]): Widget => {
  const items = [...act, ...watch].map((x) => ({ ...x, note: undefined }));
  return {
    title: m.page_aside_your_desk(),
    visible: forRole(role),
    size: "full",
    // As tall as its four lines (a label wraps to two at most): never cut, nothing left over.
    rows: ROWS,
    skeleton: "list",
    counts: { collection: items[0]!.collection, layout: "list", items },
  };
};

const awaitingApproval: Counter = {
  label: m.page_aside_held(),
  collection: "cases",
  where: { wait: { equals: "Awaiting internal approval" } },
  note: m.page_aside_held_note(),
};
const overdue: Counter = {
  label: m.page_aside_overdue(),
  collection: "invoices",
  where: overdueInvoices,
  note: m.page_aside_overdue_note(),
  tone: "warning",
};
const billsOnHold: Counter = {
  label: m.page_aside_bills_on_hold(),
  collection: "supplier-bills",
  where: { status: { equals: "On hold" } },
  note: m.page_aside_bills_on_hold_note(),
  tone: "warning",
};
const deliveries: Counter = {
  label: m.page_aside_deliveries(),
  collection: "deliveries",
  where: { status: { not_equals: "Delivered" } },
  note: m.page_aside_deliveries_note(),
};
const awaitingCustomer: Counter = {
  label: m.page_aside_awaiting_customer(),
  collection: "cases",
  where: mine({ wait: { equals: "Awaiting customer decision" } }),
  note: m.page_aside_awaiting_customer_note(),
  tone: "warning",
};
const draftQuotes: Counter = {
  label: m.page_aside_draft_quotes(),
  collection: "quotations",
  where: { status: { equals: "Draft" } },
  note: m.page_aside_draft_quotes_note(),
};
const pipeline: Counter = {
  label: m.page_aside_pipeline(),
  collection: "opportunities",
  where: { owner: { equals: "$user.id" } },
  note: m.page_aside_pipeline_note(),
};
const inbox: Counter = {
  label: m.page_aside_inbox(),
  collection: "intake-messages",
  where: toTriage,
  note: m.page_aside_inbox_note(),
  tone: "warning",
};
const followUps: Counter = {
  label: m.page_aside_follow_ups(),
  collection: "tasks",
  where: openTasks,
  note: m.page_aside_follow_ups_note(),
};
const rfqsWaiting: Counter = {
  label: m.page_aside_rfqs_waiting(),
  collection: "supplier-rfqs",
  where: { status: { equals: "Awaiting reply" } },
  note: m.page_aside_rfqs_waiting_note(),
  tone: "warning",
};
const myTasks: Counter = {
  label: m.page_aside_my_tasks(),
  collection: "tasks",
  where: mine(openTasks),
  note: m.page_aside_my_tasks_note(),
};
const awaitingSupplier: Counter = {
  label: m.page_aside_awaiting_supplier(),
  collection: "cases",
  where: { wait: { equals: "Awaiting supplier" } },
  note: m.page_aside_awaiting_supplier_note(),
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
