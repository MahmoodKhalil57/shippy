import type { Doc, MockConfig } from "../../src/lib/contracts/config.ts";
import type { MemoryData } from "../../src/lib/dashboard/memory.ts";
import * as k from "../../src/lib/widgets/kinds.ts";
import { query } from "../../src/lib/widgets/kinds.ts";
import type { Stat, ViewBlock, ViewBlocks } from "../../src/lib/widgets/schema.ts";
import { tileSizeOf } from "../../src/lib/widgets/tile.ts";
import type { TileKind } from "../../src/lib/widgets/tile-kind.ts";
import { widgets, type Widget, type WidgetPage } from "../../src/lib/widgets/widget.ts";

export const TODAY = "2026-03-16T09:00:00.000Z";

const money = { unit: "money" as const, currency: "USD" };

const base = {
  collections: [
    {
      slug: "users",
      auth: true,
      admin: { useAsTitle: "name" },
      fields: [
        { name: "name", type: "text", required: true },
        {
          name: "role",
          type: "select",
          options: [
            { label: "Manager", value: "manager" },
            { label: "Accounts", value: "accounts" },
          ],
        },
      ],
    },
    {
      slug: "customers",
      admin: { useAsTitle: "name" },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "city", type: "text" },
        {
          name: "tier",
          type: "select",
          options: [
            { label: "Standard", value: "standard" },
            { label: "Priority", value: "priority" },
          ],
        },
        { name: "owner", type: "relationship", relationTo: "users" },
      ],
    },
    {
      slug: "invoices",
      admin: { useAsTitle: "number" },
      custom: {
        actions: [
          {
            label: "Send reminder",
            call: { path: "/invoices/remind", body: { id: "$row.id" } },
            when: { status: { equals: "overdue" } },
            done: "Reminder sent",
          },
        ],
      },
      fields: [
        { name: "number", type: "text", required: true },
        { name: "customer", type: "relationship", relationTo: "customers" },
        { name: "amount", type: "number", custom: { number: money } },
        {
          name: "status",
          type: "select",
          options: [
            { label: "Draft", value: "draft" },
            { label: "Sent", value: "sent" },
            { label: "Paid", value: "paid" },
            { label: "Overdue", value: "overdue" },
          ],
        },
        { name: "issuedAt", type: "date" },
        { name: "dueDate", type: "date" },
        { name: "note", type: "textarea" },
      ],
    },
    {
      slug: "tasks",
      admin: { useAsTitle: "title" },
      fields: [
        { name: "title", type: "text", required: true },
        {
          name: "status",
          type: "select",
          options: [
            { label: "Open", value: "open" },
            { label: "In progress", value: "doing" },
            { label: "Done", value: "done" },
          ],
        },
        { name: "assignee", type: "relationship", relationTo: "users" },
        { name: "dueDate", type: "date" },
        { name: "detail", type: "textarea" },
      ],
    },
  ],
  globals: [
    {
      slug: "settings",
      label: "Workspace settings",
      fields: [
        { name: "workspaceName", type: "text" },
        { name: "reminderDays", type: "number" },
      ],
    },
  ],
} as unknown as MockConfig;

const doc = (d: Record<string, unknown>) => d as Doc;

const people = [
  { id: "u1", name: "Maya Patel", role: "manager" },
  { id: "u2", name: "Jordan Lee", role: "accounts" },
];

const customers = [
  { id: "c1", name: "Harbor Logistics", city: "Portland", tier: "priority", owner: people[0] },
  { id: "c2", name: "Riverside Bakery", city: "Austin", tier: "standard", owner: people[1] },
  { id: "c3", name: "Northwind Clinic", city: "Denver", tier: "priority", owner: people[0] },
  { id: "c4", name: "Juniper Studio", city: "Boston", tier: "standard", owner: people[1] },
];

const statuses = [
  "paid",
  "sent",
  "overdue",
  "paid",
  "draft",
  "paid",
  "overdue",
  "sent",
  "paid",
  "paid",
  "sent",
  "paid",
];

const invoices = statuses.map((status, i) =>
  doc({
    id: `i${i + 1}`,
    number: `INV-${String(1040 + i)}`,
    customer: customers[i % customers.length],
    amount: 420 + ((i * 1375) % 4200),
    status,
    issuedAt: new Date(Date.UTC(2025, 9 + Math.floor(i / 2), 3 + i)).toISOString(),
    dueDate: new Date(Date.UTC(2025, 10 + Math.floor(i / 2), 3 + i)).toISOString(),
    note: status === "overdue" ? "Customer asked for a copy of the signed order." : "",
    createdAt: new Date(Date.UTC(2025, 9 + Math.floor(i / 2), 3 + i)).toISOString(),
    updatedAt: new Date(Date.UTC(2026, 2, 1 + i)).toISOString(),
  }),
);

const tasks = [
  ["Call back about the late delivery", "open", 0, "2026-03-17"],
  ["Prepare the quarterly report", "doing", 1, "2026-03-20"],
  ["Renew the insurance policy", "open", 0, "2026-03-24"],
  ["Order spare parts for the van", "done", 1, "2026-03-10"],
  ["Review the new supplier contract", "doing", 0, "2026-03-19"],
].map(([title, status, who, due], i) =>
  doc({
    id: `t${i + 1}`,
    title,
    status,
    assignee: people[who as number],
    dueDate: `${due as string}T00:00:00.000Z`,
    detail: "Notes from the last meeting are in the shared folder.",
    updatedAt: `2026-03-${String(10 + i).padStart(2, "0")}T10:00:00.000Z`,
  }),
);

export const seed = (): MemoryData => ({
  docs: {
    users: people.map((p) => doc(p)),
    customers: customers.map((c) => doc(c)),
    invoices,
    tasks,
  },
  globals: { settings: { workspaceName: "Main office", reminderDays: 7 } },
});

export const user = { id: "u1", name: "Maya Patel", role: "manager", collection: "users" } as Doc;

const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

const trend = (values: number[]): Stat["trend"] => ({ labels: months, values, format: money });

export interface Declaration {
  name: string;
  kind: TileKind | "page";
  widget: Widget;
}

const stat = (label: string, value: string, values: number[]): Stat => ({
  label,
  value,
  trend: trend(values),
  delta: { text: "+12% vs last month", dir: "up", good: true },
});

export const WIDGET_KINDS: Declaration[] = [
  {
    name: "stats",
    kind: "stats",
    widget: {
      size: "s",
      metrics: {
        collection: "invoices",
        items: [{ label: "Overdue invoices", where: { status: { equals: "overdue" } }, tone: "error" }],
      },
    },
  },
  {
    name: "text",
    kind: "text",
    widget: k.text({
      title: "This week",
      size: "s",
      skeleton: "text",
      format: () => ({
        text: "Two invoices are overdue and one delivery is late. Everything else is on track for the month.",
      }),
    }),
  },
  {
    name: "list",
    kind: "list",
    widget: {
      title: "Tasks due soon",
      size: "s",
      records: {
        collection: "tasks",
        columns: ["title", "assignee", "dueDate"],
        layout: "list",
        sort: "dueDate",
        dot: "status",
        limit: 5,
      },
    },
  },
  {
    name: "card",
    kind: "card",
    widget: k.details({
      title: "Workspace",
      size: "s",
      skeleton: "card",
      data: query.global<{ workspaceName: string; reminderDays: number }>("settings"),
      format: (s) => ({
        items: [
          { label: "Name", value: s.workspaceName },
          { label: "Reminders after", value: `${s.reminderDays} days` },
          { label: "Currency", value: "US dollar" },
        ],
      }),
    }),
  },
  {
    name: "entries",
    kind: "entries",
    widget: {
      title: "Overdue invoices",
      size: "m",
      records: {
        collection: "invoices",
        where: { status: { equals: "overdue" } },
        columns: ["number", "customer", "status", "dueDate"],
        facts: ["amount"],
        text: "note",
        layout: "entries",
      },
    },
  },
  {
    name: "chart",
    kind: "chart",
    widget: {
      title: "Invoiced by month",
      size: "m",
      breakdown: { collection: "invoices", by: "issuedAt", bucket: "month", sum: "amount", chart: "bars" },
    },
  },
  {
    name: "table",
    kind: "table",
    widget: {
      title: "Recent invoices",
      size: "l",
      records: {
        collection: "invoices",
        columns: ["number", "customer", "amount", "status", "dueDate"],
        sort: "-issuedAt",
        limit: 6,
      },
    },
  },
];

type Format<K extends keyof ViewBlocks> = Omit<ViewBlocks[K], "type">;

const block = <K extends keyof ViewBlocks>(type: K, kind: TileKind, title: string, body: Format<K>): Declaration => ({
  name: type,
  kind,
  widget: k.kind(type)({
    title,
    size: tileSizeOf([{ type, ...body } as ViewBlock]),
    skeleton: kind,
    format: () => body as never,
  }),
});

const inCard = (name: string, title: string, inner: ViewBlock): Declaration => ({
  name,
  kind: "card",
  widget: k.kind("card")({
    title,
    size: tileSizeOf([inner]),
    skeleton: "card",
    format: () => ({ blocks: [inner] }),
  }),
});

const parts = [
  { label: "Harbor Logistics", value: 18200, valueText: "$18,200" },
  { label: "Northwind Clinic", value: 9400, valueText: "$9,400" },
  { label: "Riverside Bakery", value: 6100, valueText: "$6,100" },
  { label: "Juniper Studio", value: 2300, valueText: "$2,300" },
];

const days = Array.from({ length: 28 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 1, 16 + i));
  const value = (i * 7) % 5;
  return { label: d.toISOString().slice(0, 10), value, valueText: `${value} invoices` };
});

export const BLOCK_KINDS: Declaration[] = [
  block("card", "card", "Next delivery", {
    heading: "Harbor Logistics",
    subhead: "Thursday, 9:00",
    blocks: [{ type: "text", text: "Two pallets of packaging, dock 3." }],
  }),
  block("entries", "entries", "Follow-ups", {
    items: [
      { heading: "Harbor Logistics", meta: ["Portland", "Priority"], text: "Asked for a revised quote." },
      { heading: "Riverside Bakery", meta: ["Austin"], text: "Wants weekly deliveries from April." },
    ],
  }),
  inCard("grid", "Two regions", {
    type: "grid",
    blocks: [
      { type: "text", text: "West: 14 open orders." },
      { type: "text", text: "East: 9 open orders." },
    ],
  }),
  inCard("split", "Orders and notes", {
    type: "split",
    main: [{ type: "text", text: "Fourteen orders are waiting to ship." }],
    side: [{ type: "text", text: "Dock 2 is closed on Friday." }],
  }),
  block("stats", "stats", "Paid this month", { items: [stat("Paid this month", "$24,800", [9, 12, 11, 15, 18, 24])] }),
  block("text", "text", "Note", { text: "The office is closed on Monday for the holiday." }),
  block("heading", "text", "Section", { text: "Deliveries this week" }),
  block("table", "table", "Top customers", {
    columns: [
      { key: "name", label: "Customer" },
      { key: "city", label: "City" },
      { key: "total", label: "Invoiced", align: "end" },
    ],
    rows: customers.map((c, i) => ({ name: c.name, city: c.city, total: parts[i]!.valueText })),
  }),
  block("list", "list", "Open tasks", {
    items: tasks.map((t) => ({ headline: String(t.title), supporting: "Due this week" })),
  }),
  block("details", "card", "Customer", {
    items: [
      { label: "Name", value: "Harbor Logistics" },
      { label: "City", value: "Portland" },
      { label: "Owner", value: "Maya Patel" },
    ],
  }),
  block("gauges", "list", "Targets", {
    items: [
      { label: "Collected", value: 72, max: 100, valueText: "72%" },
      { label: "On-time deliveries", value: 91, max: 100, valueText: "91%", tone: "success" },
    ],
  }),
  block("steps", "list", "Onboarding", {
    items: [{ label: "Account" }, { label: "Billing" }, { label: "First order" }, { label: "Review" }],
    current: 1,
  }),
  block("chart", "chart", "Payments", {
    chart: {
      kind: "line",
      labels: months,
      series: [{ name: "Payments", values: [8200, 9100, 8700, 10400, 11200, 12600] }],
      format: money,
    },
    label: "Payments by month",
  }),
  block("ring", "list", "By customer", { parts, total: "$36,000", center: "invoiced", label: "Invoiced by customer" }),
  block("funnel", "list", "Pipeline", {
    stages: [
      { label: "Leads", value: 120 },
      { label: "Qualified", value: 64 },
      { label: "Proposal", value: 28 },
      { label: "Won", value: 11 },
    ],
    label: "Pipeline",
  }),
  block("heatmap", "chart", "Invoices per day", { days, summary: "Busiest on Mondays", label: "Invoices per day" }),
  block("bullet", "list", "Collections", {
    items: [{ label: "Collected", value: 72, max: 100, target: 85, valueText: "72%", targetText: "85% target" }],
  }),
  block("dial", "stats", "Margin", {
    value: 31,
    max: 50,
    valueText: "31%",
    caption: "of a 50% ceiling",
    label: "Margin",
    zones: [
      { to: 15, tone: "error" },
      { to: 25, tone: "warning" },
      { to: 50, tone: "success" },
    ],
  }),
  block("waffle", "stats", "Paid on time", {
    value: 68,
    max: 100,
    valueText: "68%",
    caption: "of invoices",
    label: "Paid on time",
  }),
  block("share", "list", "Revenue mix", { parts, total: "$36,000", label: "Revenue by customer" }),
  block("treemap", "chart", "Revenue map", { items: parts, total: "$36,000", label: "Revenue by customer" }),
  block("waterfall", "chart", "Margin build-up", {
    steps: [
      { label: "Revenue", value: 36000 },
      { label: "Materials", value: -14000 },
      { label: "Labour", value: -9000 },
      { label: "Margin", value: 13000, total: true },
    ],
    format: money,
    label: "Margin build-up",
  }),
  block("quadrant", "chart", "Customers by value", {
    points: customers.map((c, i) => ({ label: c.name, x: 2 + i * 2, y: 9 - i * 2 })),
    xLabel: "Orders",
    yLabel: "Average value",
    label: "Customers by value",
  }),
  block("countdown", "list", "Deadlines", {
    items: [
      { label: "Tax filing", due: "2026-04-15T00:00:00.000Z" },
      { label: "Insurance renewal", due: "2026-03-24T00:00:00.000Z" },
    ],
    now: TODAY,
    label: "Deadlines",
  }),
  block("month", "chart", "March", {
    month: "2026-03",
    today: "2026-03-16",
    events: [
      { date: "2026-03-17", label: "Delivery" },
      { date: "2026-03-24", label: "Renewal", tone: "warning" },
    ],
    label: "March",
  }),
  block("whatif", "chart", "Price change", {
    inputs: [{ key: "price", label: "Price change", min: -20, max: 20, step: 1, value: 5, format: { unit: "pct" } }],
    compute: (v) => [{ label: "Revenue", value: `$${(36000 * (1 + v.price! / 100)).toFixed(0)}` }],
    label: "Price change",
  }),
  block("alert", "text", "Heads up", { tone: "warning", text: "Two invoices are more than 30 days late." }),
  block("empty", "text", "Inbox", { heading: "Nothing waiting", description: "New requests show up here." }),
  block("tags", "text", "Labels", { items: [{ label: "Priority" }, { label: "Wholesale", tone: "info" }] }),
  block("actions", "text", "Quick actions", {
    items: [
      { label: "New invoice", href: "/collections/invoices/create" },
      { label: "Export", call: { path: "/invoices/export" } },
    ],
  }),
  block("choice", "text", "Period", {
    param: "period",
    label: "Period",
    value: "month",
    options: [
      { value: "week", label: "Week" },
      { value: "month", label: "Month" },
    ],
  }),
  block("timeline", "list", "Activity", {
    items: [
      { time: "09:10", heading: "Invoice sent", text: "INV-1041 to Riverside Bakery" },
      { time: "11:45", heading: "Payment received", text: "INV-1040 from Harbor Logistics" },
    ],
  }),
  block("divider", "text", "Divider", {}),
  block("custom", "text", "Read aloud", {
    element: "ui-speak",
    key: "speak",
    props: { text: "Two invoices are overdue." },
  }),
  block("attach", "card", "Proof of delivery", {
    action: { label: "Attach" },
    heading: "Attach proof of delivery",
    file: { name: "proof", legend: "Proof of delivery", upload: { collection: "files" } },
    call: { path: "/deliveries/proof" },
    confirmLabel: "Attach",
  }),
  block("form", "card", "Reminder settings", {
    fields: [
      { type: "number", name: "reminderDays", label: "Remind after (days)" },
      { type: "text", name: "workspaceName", label: "Workspace name" },
    ],
    value: { reminderDays: 7, workspaceName: "Main office" },
    save: { path: "/settings/save" },
  }),
  block("gantt", "chart", "Schedule", {
    label: "Job",
    periods: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    rows: [
      { label: "Kitchen refit", from: 0, to: 2, tone: "info", tag: "Crew A" },
      { label: "Office paint", from: 2, to: 4, tone: "success" },
    ],
  }),
  block("message", "card", "Latest email", {
    meta: ["From: Riverside Bakery", "Today, 08:12"],
    subject: "Weekly order",
    body: "Hello, could we add two more boxes of flour to Thursday's delivery? Thanks.",
  }),
  block("settings", "card", "Notifications", {
    items: [
      { label: "Email me when an invoice is paid", value: true, call: { path: "/settings/paid" } },
      {
        label: "Digest",
        value: "daily",
        options: [
          { label: "Daily", value: "daily" },
          { label: "Weekly", value: "weekly" },
        ],
        call: { path: "/settings/digest" },
      },
    ],
  }),
  block("tiles", "card", "Shortcuts", {
    items: [
      { heading: "Invoices", text: "Send, chase and record payments." },
      { heading: "Customers", text: "Contacts, terms and history." },
    ],
  }),
  block("document", "card", "Quote", {
    issuer: { name: "Main office" },
    title: "Quote Q-204",
    meta: [{ text: "16 March 2026" }],
    columns: [
      { key: "item", label: "Item" },
      { key: "total", label: "Total" },
    ],
    lines: [
      { item: "Shelving units", total: "$1,200" },
      { item: "Installation", total: "$300" },
    ],
    total: { label: "Total", value: "$1,500" },
  }),
  block("ask", "card", "Ask about invoices", {
    endpoint: "/ask/invoices",
    suggestions: ["Which invoices are late?", "Who owes the most?"],
  }),
];

export const pageOf = (...list: Widget[]): WidgetPage => ({ widgets: list });

const kind = (name: string) => WIDGET_KINDS.find((d) => d.name === name)!.widget;

export const reportsPage: WidgetPage = pageOf(kind("chart"), kind("list"), kind("text"));

export const homePage: WidgetPage = {
  header: { heading: "Good morning", subtitle: "Here is what needs you today." },
  widgets: [kind("stats"), kind("table"), kind("entries")],
};

export const customerPage: WidgetPage = pageOf({ title: "Customer", size: "s", fields: { fields: ["name", "city"] } });

export const config = {
  ...base,
  admin: {
    user: "users",
    custom: { today: TODAY },
    components: {
      views: {
        dashboard: { Component: widgets(homePage), path: "/" },
        reports: { Component: widgets(reportsPage), path: "/reports", meta: { title: "Reports" } },
        customer: { Component: widgets(customerPage), path: "/customers/:id" },
        settings: { Component: "app-settings", path: "/settings" },
      },
    },
  },
} as unknown as MockConfig;

import type { ViewContext } from "../../src/components/widgets/registry.ts";
import type { Action } from "../../src/lib/widgets/schema.ts";
import { testDashboard, type TestDashboard } from "../dashboard.ts";

export interface BlockArgs {
  run: (action: Action) => Promise<void> | void;
  setParam: (param: string, value: string) => void;
  reload: () => void;
  mount: (element: string, props: Record<string, unknown>, key?: string) => HTMLElement;
}

export const mountElement = (element: string, props: Record<string, unknown>) =>
  Object.assign(document.createElement(element), props);

let staged: TestDashboard | undefined;

export const stagedDashboard = () => staged!;

export const stagedCalls = () => (staged!.data as unknown as { calls: { method: string; args: unknown[] }[] }).calls;

export function blockContext(
  args: BlockArgs,
  { data = {}, params = {}, inCard }: { data?: MemoryData; params?: Record<string, string>; inCard?: boolean } = {},
): ViewContext {
  staged = testDashboard({ config, data });
  return {
    dashboard: staged,
    run: args.run,
    setParam: args.setParam,
    reload: args.reload,
    mount: args.mount,
    params,
    ...(inCard ? { inCard } : {}),
  };
}
