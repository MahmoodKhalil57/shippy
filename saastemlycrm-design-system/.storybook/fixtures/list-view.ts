import { html, type TemplateResult } from "lit";
import type { CollectionConfig } from "payload";
import { expect, waitFor } from "storybook/test";
import { mount, testDashboard, type TestDashboard } from "../dashboard.ts";
import type { Doc, MockConfig } from "../../src/lib/contracts/config.ts";
import {
  collectionPage,
  documentPage,
  type CollectionViewSpec,
  type WidgetScope,
} from "../../src/lib/widgets/widget.ts";
import type { Access, AiPort, Dashboard } from "../../src/lib/dashboard/context.ts";
import type { MemoryData } from "../../src/lib/dashboard/memory.ts";
import { frames } from "../../src/lib/dashboard/tiling.ts";
import type { ViewContext } from "../../src/components/widgets/registry.ts";
import type { DashboardListView } from "../../src/components/views/list-view.ts";
import { here, visit } from "../address.ts";

export const TODAY = "2026-03-16";

const people: CollectionConfig = {
  slug: "people",
  auth: true,
  admin: { useAsTitle: "name" },
  fields: [{ name: "name", type: "text" }],
};

const projects: CollectionConfig = {
  slug: "projects",
  admin: { useAsTitle: "name" },
  fields: [{ name: "name", type: "text" }],
};

const comments: CollectionConfig = {
  slug: "comments",
  fields: [{ name: "body", type: "text" }],
};

export const tasks: CollectionConfig = {
  slug: "tasks",
  labels: { singular: "Task", plural: "Tasks" },
  admin: { useAsTitle: "title", description: "Work planned for the team." },
  custom: {
    list: { board: "status", calendar: "due", figure: "amount", eyebrow: "project", scatter: ["effort", "score"] },
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Planned", value: "planned" },
        { label: "In progress", value: "active" },
        { label: "Done", value: "done" },
        { label: "Blocked", value: "blocked" },
        { label: "Archived", value: "archived" },
      ],
    },
    { name: "priority", type: "select", options: ["Low", "Medium", "High"] },
    { name: "amount", type: "number", custom: { number: { unit: "money", currency: "USD" } } },
    { name: "effort", type: "number" },
    { name: "score", type: "number" },
    { name: "due", type: "date" },
    { name: "owner", type: "relationship", relationTo: "people" },
    { name: "project", type: "relationship", relationTo: "projects" },
    { name: "notes", type: "textarea" },
    { name: "urgent", type: "checkbox" },
    { name: "code", type: "code" },
    { name: "location", type: "point" },
    { name: "comments", type: "join", collection: "comments", on: "task" },
    { name: "secret", type: "text", hidden: true },
  ],
} as CollectionConfig;

export const notes: CollectionConfig = {
  slug: "notes",
  timestamps: false,
  fields: [{ name: "heading", type: "text" }],
};

const VIEWS = {
  tasks: collectionPage("tasks"),
  task: documentPage("tasks"),
  notes: collectionPage("notes"),
};

export const config: MockConfig = {
  collections: [tasks, notes, people, projects, comments],
  admin: { components: { views: VIEWS as never }, custom: { today: TODAY } },
};

const person = (id: string, name: string) => ({ id, name });
const OWNERS = [person("p1", "Avery Stone"), person("p2", "Jordan Lee"), person("p3", "Riley Park")];
const PROJECTS = [
  { id: "r1", name: "Website refresh" },
  { id: "r2", name: "Mobile app" },
];

const TITLES = [
  "Draft the launch plan",
  "Review the pricing page",
  "Fix the sign-in bug",
  "Write release notes",
  "Plan the team offsite",
  "Update the help center",
  "Prepare the quarterly report",
  "Interview design candidates",
  "Clean up the backlog",
  "Test the checkout flow",
  "Order new laptops",
  "Set up error alerts",
];
const STATUSES = ["planned", "active", "done", "blocked", "planned", "archived"];
const PRIORITIES = ["Low", "Medium", "High"];

export const taskDocs: Doc[] = TITLES.map((title, i) => ({
  id: `t${i + 1}`,
  title,
  status: STATUSES[i % STATUSES.length],
  priority: PRIORITIES[i % PRIORITIES.length],
  amount: (i + 1) * 250,
  effort: (i % 5) + 1,
  score: ((i * 7) % 10) + 1,
  due: `2026-03-${String(2 + i * 2).padStart(2, "0")}T00:00:00.000Z`,
  owner: OWNERS[i % OWNERS.length],
  project: PROJECTS[i % PROJECTS.length],
  notes: `Notes for ${title.toLowerCase()}.`,
  urgent: i % 4 === 0,
  comments: { docs: [], totalDocs: i % 3 },
  createdAt: `2026-02-${String(1 + i).padStart(2, "0")}T09:30:00.000Z`,
  updatedAt: `2026-03-${String(1 + i).padStart(2, "0")}T14:00:00.000Z`,
}));

export const noteDocs: Doc[] = ["Kickoff agenda", "Retro notes", "Hiring plan"].map((heading, i) => ({
  id: `n${i + 1}`,
  heading,
}));

export const seed = () => ({
  docs: {
    tasks: taskDocs,
    notes: noteDocs,
    people: OWNERS.map((o) => ({ ...o })),
    projects: PROJECTS.map((p) => ({ ...p })),
  } as Record<string, Doc[]>,
});

const all = {
  create: { permission: true },
  read: { permission: true },
  update: { permission: true },
  delete: { permission: true },
};
const readOnly = {
  create: { permission: false },
  read: { permission: true },
  update: { permission: false },
  delete: { permission: false },
};

export const fullAccess: Access = {
  canAccessAdmin: true,
  collections: { tasks: all, notes: all, people: all, projects: all },
  globals: {},
};

export const readAccess: Access = {
  canAccessAdmin: true,
  collections: { tasks: readOnly, notes: readOnly, people: readOnly, projects: readOnly },
  globals: {},
};

export const user = { id: "p1", collection: "people", name: "Avery Stone" } as Doc & { collection: string };

export const LAYOUTS = [
  "table",
  "cards",
  "list",
  "compact",
  "focus",
  "groups",
  "board",
  "calendar",
  "timeline",
  "heatmap",
  "chart",
  "ranking",
  "treemap",
  "scatter",
] as const;

export interface ListOptions {
  slug?: string;
  spec?: Partial<CollectionViewSpec> | null;
  tile?: boolean;
  access?: Access;
  data?: MemoryData;
  config?: MockConfig;
  stateKey?: string;
  ctx?: ViewContext | null;
  scope?: WidgetScope | null;
  ai?: Partial<AiPort>;
  base?: string;
  prepare?: (d: TestDashboard) => void;
  dashboard?: TestDashboard;
}

export interface Peek {
  result: { docs: Doc[]; totalDocs: number } | null;
  loading: boolean;
  query: {
    q: string;
    sort: string;
    page: number;
    limit: string;
    filters: unknown[];
    match: string;
    view?: string;
    month?: string;
  };
  openId: string;
  sheetId: string;
  leaving: unknown;
  selected: number[];
  allMatching: boolean;
  confirming: boolean;
  focusAt: number;
  doc: { loading: boolean } | null;
}
export const peek = (v: DashboardListView) => v as unknown as Peek;

export const listDashboard = (o: ListOptions = {}) => {
  const d =
    o.dashboard ?? testDashboard({ config: o.config ?? config, data: o.data ?? seed(), ai: o.ai, base: o.base });
  o.prepare?.(d);
  return d;
};

export const listTemplate = (o: ListOptions = {}) => {
  const slug = o.slug ?? "tasks";
  const spec = o.spec === null ? null : { collection: slug, ...o.spec };
  return html`<dashboard-list-view
    .slug=${slug}
    .stateKey=${o.stateKey ?? "k"}
    .spec=${spec}
    ?tile=${o.tile ?? false}
    .access=${o.access ?? fullAccess}
    .user=${user}
    .ctx=${o.ctx ?? null}
    .scope=${o.scope ?? null}
  ></dashboard-list-view>`;
};

export const listRender =
  (o: ListOptions = {}) =>
  () =>
    html`<dashboard-provider .dashboard=${listDashboard(o)}>${listTemplate(o)}</dashboard-provider>`;

export const settled = async (view: DashboardListView) => {
  await waitFor(() => expect(peek(view).loading).toBe(false));
  await view.updateComplete;
};

export interface Shown {
  dashboard: TestDashboard;
  view: DashboardListView;
  host: HTMLElement;
}

export async function shown(host: HTMLElement): Promise<Shown> {
  const view = host.querySelector("dashboard-list-view")!;
  await settled(view);
  const dashboard = (view.closest("dashboard-provider") as unknown as { dashboard: TestDashboard }).dashboard;
  return { dashboard, view, host };
}

const mounted: (() => void)[] = [];

export const unmount = () => {
  for (const remove of mounted.splice(0)) remove();
};

export async function mountList(template: TemplateResult, dashboard: TestDashboard) {
  const m = await mount(template, dashboard);
  mounted.push(m.remove);
  return m;
}

export async function show(o: ListOptions = {}): Promise<Shown> {
  const { host } = await mountList(listTemplate(o), listDashboard(o));
  return shown(host);
}

let clickPrevented = false;
export const lastClickPrevented = () => clickPrevented;

export const listPage = () => {
  const onClick = (e: MouseEvent) => {
    clickPrevented = e.defaultPrevented;
    e.preventDefault();
  };
  document.addEventListener("click", onClick);
  return async () => {
    await frames(3);
    unmount();
    document.removeEventListener("click", onClick);
  };
};

export const urlWith = (query: string) => visit(`${here().pathname}?${query}`);
export const at = (query: string) => () => urlWith(query);
export const own = () => new URLSearchParams(here().search);
export const ids = (v: DashboardListView) => peek(v).result!.docs.map((d) => d.id);
export const titles = (v: DashboardListView) => peek(v).result!.docs.map((d) => d.title);
export const fire = (el: Element, type: string, detail?: unknown) =>
  el.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, cancelable: true }));
export const calls = (d: Dashboard, method: string) =>
  (d.data as unknown as { calls: { method: string; args: unknown[] }[] }).calls.filter((c) => c.method === method);
export const pop = () => window.dispatchEvent(new PopStateEvent("popstate"));
export const poppedBack = () =>
  new Promise<void>((resolve) => window.addEventListener("popstate", () => resolve(), { once: true }));
export const doc = (id: string, patch: Record<string, unknown> = {}): Doc =>
  ({ ...seed().docs.tasks!.find((d) => d.id === "t1")!, id, ...patch }) as Doc;
export const withTasks = (docs: Doc[]) => ({ docs: { ...seed().docs, tasks: docs } });

export interface ListViewArgs {
  slug: string;
  layout: (typeof LAYOUTS)[number];
  tile: boolean;
  heading: string;
  subhead: string;
  access: Access;
  extra?: Partial<CollectionViewSpec>;
  onCount: (e: CustomEvent<{ count: number }>) => void;
}

export const dashboard =
  (options: { data?: MemoryData; ai?: Partial<AiPort>; slow?: boolean; failing?: boolean } = {}) =>
  () => {
    const d = testDashboard({ config, data: options.data ?? seed(), ai: options.ai });
    if (options.slow) d.data.find = () => new Promise(() => {});
    if (options.failing) d.data.find = () => Promise.reject(new Error("The server is unreachable."));
    return d;
  };
export const dashboardOf = (el: HTMLElement) =>
  ([...el.querySelectorAll("dashboard-provider")].at(-1) as unknown as { dashboard: TestDashboard }).dashboard;
export const seen = (find: () => HTMLElement | Promise<HTMLElement>) =>
  waitFor(async () => expect(await find()).toBeVisible());
export const param = (key: string) => new URLSearchParams(here().search).get(`list[${key}]`);

export const clearUrl = () => {
  const query = new URLSearchParams([...new URLSearchParams(here().search)].filter(([k]) => !k.startsWith("list[")));
  visit(`${here().pathname}?${query}`);
};
