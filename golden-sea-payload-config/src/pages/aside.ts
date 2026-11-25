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

const forRole =
  (r?: string) =>
  ({ user }: WidgetScope) =>
    r ? user.role === r : !ROLES.includes(user.role ?? "");

const ROWS = 6;

const desk = (role: string | undefined, act: Counter[], watch: Counter[]): Widget => {
  const items = [...act, ...watch].map((x) => ({ ...x, note: undefined }));
  return {
    title: m.page_aside_your_desk(),
    visible: forRole(role),
    size: "full",
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
  desk("management", [myDecisions, exceptions], [liveCases, awaitingApproval]),
  desk("finance-director", [myDecisions, overdue], [toCollect, bills]),
  desk("operations", [billsOnHold, exceptions], [deliveries, toCollect]),
  desk("sales", [awaitingCustomer, draftQuotes], [myLiveCases, pipeline]),
  desk("office-admin", [inbox, exceptions], [followUps, liveCases]),
  desk(undefined, [rfqsWaiting, myTasks], [myLiveCases, awaitingSupplier]),
];
