import type { CodexEvent, TurnOptions } from "../../src/lib/agent/codex.ts";
import type { LocalAiState } from "../../src/lib/agent/ai-polyfill.ts";
import type { Doc, MockConfig, Tour } from "../../src/lib/contracts/config.ts";
import type { Decorator } from "@storybook/web-components-vite";
import { expect, waitFor } from "storybook/test";
import { testDashboard, withDashboard, type TestDashboard } from "../dashboard.ts";
import type { DashboardApp } from "../../src/components/shell/app.ts";
import { frames } from "../../src/lib/dashboard/tiling.ts";
import type { Access, AiPort, GuideTopic, Site } from "../../src/lib/dashboard/context.ts";
import type { MemoryData } from "../../src/lib/dashboard/memory.ts";
import type { SeedUser } from "../../src/lib/dashboard/project.ts";
import { collectionPage, documentPage, globalPage } from "../../src/lib/widgets/widget.ts";
import type { Address } from "../../src/lib/shell/agent-tools.ts";

const perm = (permission: boolean) => ({ permission });
export const crud = (create = true, read = true, update = true, remove = true) => ({
  create: perm(create),
  read: perm(read),
  update: perm(update),
  delete: perm(remove),
});

export const config = {
  collections: [
    {
      slug: "users",
      auth: true,
      admin: { useAsTitle: "name", group: "Team" },
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
      admin: { useAsTitle: "name", group: "Sales", description: "Companies that buy from us." },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "city", type: "text" },
      ],
    },
    {
      slug: "invoices",
      admin: {
        useAsTitle: "number",
        group: "Sales",
        listSearchableFields: ["customer"],
        components: {
          views: {
            edit: {
              history: {
                Component: {
                  path: "app-widgets",
                  clientProps: { page: { widgets: [{ title: "Payments", source: { find: "payments" } }] } },
                },
                path: "/history",
                tab: { label: "History" },
              },
            },
          },
        },
      },
      custom: {
        edit: { before: [{ title: "Totals", source: { count: "invoices" } }] },
      },
      fields: [
        { name: "number", type: "text", required: true },
        { name: "customer", type: "text" },
        { name: "amount", type: "number" },
        {
          name: "status",
          type: "select",
          options: [
            { label: "Draft", value: "draft" },
            { label: "Sent", value: "sent" },
            { label: "Overdue", value: "overdue" },
          ],
        },
      ],
    },
    {
      slug: "payments",
      admin: { hidden: true, useAsTitle: "reference" },
      fields: [{ name: "reference", type: "text" }],
    },
    {
      slug: "notifications",
      admin: { hidden: true, useAsTitle: "title" },
      fields: [
        { name: "title", type: "text" },
        { name: "detail", type: "text" },
        {
          name: "kind",
          type: "select",
          options: ["Reminder", "Alert", "Note"],
          custom: { tones: { Reminder: "warning", Alert: "error", Note: "neutral" } },
        },
        { name: "read", type: "checkbox" },
        { name: "at", type: "date" },
        { name: "href", type: "text" },
      ],
    },
    {
      slug: "bookmarks",
      admin: { hidden: true },
      fields: [
        { name: "href", type: "text" },
        { name: "label", type: "text" },
      ],
    },
  ],
  globals: [
    {
      slug: "settings",
      label: "Workspace settings",
      admin: { group: "Configuration", description: "Defaults used across the workspace." },
      fields: [{ name: "workspaceName", type: "text" }],
    },
  ],
  endpoints: [
    { method: "get", path: "/invoices/summary" },
    { method: "post", path: "/invoices/:id/remind" },
    "not-an-endpoint",
  ],
  admin: {
    user: "users",
    meta: { titleSuffix: "· Workspace" },
    custom: {
      today: "2026-03-16",
      search: { synonyms: [["invoice", "statement"]] },
      nav: {
        groups: [
          { label: "Sales", icon: "chart", section: "Work" },
          { label: "Insights", section: "Work" },
          { label: "Configuration", icon: "settings" },
        ],
      },
      aside: [
        {
          title: "Needs attention",
          counts: {
            collection: "invoices",
            items: [
              { label: "Overdue", where: { status: { equals: "overdue" } }, tone: "warning" },
              { label: "Drafts", where: { status: { equals: "draft" } } },
            ],
          },
        },
        { title: "Hidden for others", visible: () => false, text: "Nothing" },
        {
          grid: [
            {
              split: {
                main: [
                  {
                    title: "Reminders",
                    counts: {
                      collection: "customers",
                      items: [{ label: "To call", where: { city: { equals: "$user.name" } }, tone: "warning" }],
                    },
                  },
                ],
                side: [{ title: "Totals", counts: { collection: "invoices", field: "status" } }],
              },
            },
          ],
        },
      ],
    },
    components: {
      views: {
        invoices: collectionPage("invoices"),
        invoice: documentPage("invoices"),
        customers: collectionPage("customers", { nav: { group: "Sales", label: "Customers" } }),
        settings: globalPage("settings"),
        reports: {
          Component: "demo-missing-screen",
          path: "/reports",
          meta: { title: "Reports", description: "Monthly figures." },
          nav: { group: "Insights", label: "Reports" },
        },
      },
    },
  },
} as unknown as MockConfig;

export const seedUsers: SeedUser[] = [
  { id: "u1", name: "Maya Patel", email: "maya@example.com", password: "maya-pass", role: "manager" },
  { id: "u2", name: "Jordan Lee", email: "jordan@example.com", password: "jordan-pass", role: "accounts" },
  { id: "u3", email: "sam@example.com", password: "sam-pass", role: "accounts" },
];

const doc = (d: Record<string, unknown>) => d as Doc;
export const maya = doc({ id: "u1", name: "Maya Patel", email: "maya@example.com", role: "manager" });
export const jordan = doc({ id: "u2", name: "Jordan Lee", email: "jordan@example.com", role: "accounts" });

export const access: Access = {
  canAccessAdmin: true,
  collections: {
    users: crud(),
    customers: crud(),
    invoices: crud(),
    payments: crud(false, true, false, false),
    notifications: crud(false, true, true, false),
    bookmarks: crud(),
  },
  globals: { settings: { read: perm(true), update: perm(true) } },
};

export const docs = (): Record<string, Doc[]> => ({
  users: [maya, jordan],
  customers: [
    doc({ id: "c1", name: "Harbor Logistics", city: "Leeds" }),
    doc({ id: "c2", name: "Riverside Bakery", city: "York" }),
  ],
  invoices: [
    doc({ id: "i1", number: "INV-1001", customer: "Harbor Logistics", amount: 1200, status: "overdue" }),
    doc({ id: "i2", number: "INV-1002", customer: "Riverside Bakery", amount: 300, status: "draft" }),
    doc({ id: "i3", number: "INV-1003", customer: "Harbor Logistics", amount: 950, status: "sent" }),
  ],
  payments: [doc({ id: "p1", reference: "PAY-77" })],
  notifications: [
    doc({
      id: "n1",
      title: "Invoice overdue",
      detail: "INV-1001 is 5 days late",
      kind: "Reminder",
      read: false,
      at: "2026-03-15T09:00:00.000Z",
      href: "/collections/invoices/i1",
    }),
    doc({ id: "n2", title: "Quarter closed", kind: "Note", read: false }),
    doc({ id: "n3", title: "Welcome aboard", kind: "Alert", read: true, at: "2026-03-01T00:00:00.000Z" }),
  ],
  bookmarks: [],
});

export const globals = () => ({ settings: { workspaceName: "North office" } });

export const tours: Tour[] = [
  {
    id: "t1",
    title: "Getting around",
    summary: "Where things live.",
    steps: [
      { title: "Your day", body: "Start here every morning." },
      { title: "Invoices", body: "Every invoice, newest first.", go: "/collections/invoices" },
      { title: "Done", body: "That is the tour." },
    ],
  },
  {
    id: "t2",
    title: "Approvals",
    summary: "Who signs what.",
    steps: [{ title: "Ask", body: "Ask a manager.", as: "u1" }],
  },
];

export const guide: GuideTopic[] = [
  { topic: "Invoices", keywords: "billing, overdue, payment", text: "Invoices are under Sales." },
  { topic: "Customers", keywords: "companies, clients", text: "Customers are under Sales." },
];

export const site = (): Partial<Site> => ({
  branding: {
    name: "North office",
    icon: "grid",
    poweredBy: "Workspace cloud",
    backgrounds: [{ path: "backgrounds/dunes", label: "Dunes" }],
    backgroundCredit: "Photo by a staff member",
  },
  assistant: {
    name: "Helper",
    business: "a wholesale supplier",
    ask: "/ask",
    roleNotes: [
      { role: "manager", note: "Managers approve invoices.", suggestions: ["Which invoices should I approve?"] },
    ],
    suggestions: ["Which invoices are overdue?"],
    businessKeywords: [],
    examples: [],
    mainRecord: "invoices",
  },
  tours: () => Promise.resolve(tours),
  guide: () => Promise.resolve(guide),
});

export const CODEX_MODELS = [
  { id: "luna", label: "Luna" },
  { id: "aibrowser", label: "Device model" },
] as const;

export type Turn = (message: string, options: TurnOptions) => Promise<string>;

export interface FakeAi {
  ai: Partial<AiPort>;
  turns: { message: string; model?: string }[];
  warmed: string[];
  resets: number;
  changes: number;
  setTurn(turn: Turn): void;
  setLocal(state: LocalAiState): void;
  failDownload(message: string): void;
}

export function fakeAi({ model = "luna", local = "native" as LocalAiState } = {}): FakeAi {
  let turn: Turn = async () => "Done.";
  let state = local;
  let failure = "";
  const fake: FakeAi = {
    ai: {},
    turns: [],
    warmed: [],
    resets: 0,
    changes: 0,
    setTurn: (t) => (turn = t),
    setLocal: (s) => (state = s),
    failDownload: (message) => (failure = message),
  };
  class CodexConversation {
    reset() {
      fake.resets++;
    }
    modelChanged() {
      fake.changes++;
    }
    warmUp(id: string) {
      fake.warmed.push(id);
    }
    send(message: string, options: TurnOptions) {
      fake.turns.push({ message, model: options.model });
      return turn(message, options);
    }
  }
  fake.ai = {
    codex: {
      CODEX_MODELS,
      CodexConversation,
      codexConfig: () => ({ apiKey: "", model }),
    } as unknown as AiPort["codex"],
    polyfill: {
      AI_CHANGE: "test-ai-change",
      localAiState: () => Promise.resolve(state),
      useLocalModel: async () => {
        if (failure) throw new Error(failure);
        state = "local";
      },
      restoreLocalModel: () => Promise.resolve(),
    } as unknown as AiPort["polyfill"],
  };
  return fake;
}

export type { CodexEvent };

export interface ShellOptions {
  at?: string;
  user?: Doc | null;
  access?: Access;
  data?: MemoryData;
  seedUsers?: SeedUser[];
  config?: MockConfig;
  ai?: FakeAi;
  site?: Partial<Site>;
  fail?: string;
}

export interface Shell {
  dashboard: TestDashboard;
  ai: FakeAi;
  address: () => Address;
}

export function shell({
  at = "/",
  user = maya,
  access: allowed = access,
  data = {},
  seedUsers: logins = seedUsers,
  config: project = config,
  ai = fakeAi(),
  site: own = site(),
  fail,
}: ShellOptions = {}): Shell {
  const dashboard = testDashboard({
    config: project,
    seedUsers: logins,
    site: own,
    ai: ai.ai,
    data: {
      docs: docs(),
      globals: globals(),
      users: logins.map((u) => ({
        collection: "users",
        email: u.email,
        password: u.password,
        doc: doc({ id: u.id, name: u.name, email: u.email, role: u.role }),
      })),
      user: user && { ...user, collection: "users" },
      access: allowed,
      ...data,
    },
  });
  if (fail) dashboard.data.me = () => Promise.reject(new Error(fail));
  let here = new URL(at, "http://localhost");
  dashboard.navigate = (to, replace = false) => {
    dashboard.navigations.push({ to, replace });
    here = new URL(dashboard.project.withBase(to), here);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };
  return { dashboard, ai, address: () => ({ pathname: here.pathname, search: here.search }) };
}

export let current: Shell;
export const withShell: Decorator = (story, context) => {
  const options = { ...(context.parameters.shell as ShellOptions | undefined), at: context.args.at as string };
  current = shell(options);
  return withDashboard(() => current.dashboard)(story, context);
};

export const calls = () =>
  (current.dashboard.data as unknown as { calls: { method: string; args: unknown[] }[] }).calls;
export const appShell = (root: HTMLElement) => root.querySelector("ui-app-shell")!;
export const ready = async (root: HTMLElement) => {
  await waitFor(() => expect(appShell(root)).toBeTruthy());
  await appShell(root).updateComplete;
};
export const app = (root: HTMLElement) => root.querySelector<DashboardApp>("dashboard-app")!;
export const settled = async (el: DashboardApp) => {
  await el.updateComplete;
  await frames(2);
  await el.updateComplete;
};
export const tool = (name: string, input: Record<string, unknown> = {}) =>
  current.dashboard.ai.webmcp
    .agentTools()
    .find((t) => t.name === name)!
    .execute(input);
export const auth = (root: HTMLElement) =>
  app(root).dispatchEvent(new CustomEvent("dashboard-auth", { bubbles: true }));
