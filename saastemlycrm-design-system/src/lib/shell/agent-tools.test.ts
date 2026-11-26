import { afterEach, describe, expect, it } from "vite-plus/test";
import type { Doc, MockConfig } from "../contracts/config.ts";
import "../../components/index.ts";
import type { Access, Site } from "../dashboard/context.ts";
import type { SeedUser } from "../dashboard/project.ts";
import type { MemoryData } from "../dashboard/memory.ts";
import { widgets, type Widget } from "../widgets/widget.ts";
import { dashboardTools, nameScore, trim, type AgentHost } from "./agent-tools.ts";
import { access, config, crud, docs, maya, shell, site } from "../../../.storybook/fixtures/shell.ts";

const orders = {
  slug: "orders",
  labels: { singular: "Order", plural: "Orders" },
  admin: {
    useAsTitle: "code",
    group: "Sales",
    description: "Customer orders.",
    components: {
      views: {
        edit: {
          notes: {
            Component: {
              path: "app-widgets",
              clientProps: {
                page: {
                  header: { render: () => ({ heading: "Order notes" }) },
                  widgets: [{ size: "s", render: () => ({ type: "text", text: "Single block" }) }],
                },
              },
            },
            path: "/notes",
            tab: { label: "Notes" },
          },
          files: { Component: "demo-files-tab", path: "/files", tab: { label: "Files" } },
          broken: { Component: 42, path: "/broken" },
        },
      },
    },
  },
  custom: {
    edit: {
      before: [
        {
          title: "Summary",
          size: "full",
          render: () => Array.from({ length: 5 }, (_, i) => ({ type: "text", text: `${i}`.repeat(200) })),
        },
      ],
    },
  },
  fields: [
    { name: "code", type: "text", required: true, label: "Code" },
    { name: "lines", type: "array", fields: [{ name: "sku", type: "text" }] },
    { name: "body", type: "blocks", blocks: [{ slug: "note", fields: [{ name: "text", type: "text" }] }] },
    { name: "tags", type: "select", hasMany: true, options: ["a", { label: "B", value: "b" }] },
    { name: "owner", type: "relationship", relationTo: "users", admin: { readOnly: true } },
  ],
};

const header = { heading: "Good morning", subtitle: "Three things today" };
const blocks = (text: string) => [{ type: "text" as const, text }];
const home: Widget[] = [
  { title: "Open invoices", size: "m", source: { find: "invoices" }, render: () => blocks("Three open") },
  { size: "s", source: { find: "invoices" }, render: () => blocks("Same source") },
  { size: "s", source: { count: "customers" }, render: () => blocks("Customers counted") },
  { size: "s", render: () => blocks("No source") },
  { title: "Failing", size: "s", source: { endpoint: "/missing" }, render: () => blocks("never") },
  {
    title: "Tagged",
    size: "s",
    head: () => ({ tags: [{ label: "Urgent" }], count: 4 }),
    render: () => [blocks("With head")[0]!],
  },
  { title: "Plain head", size: "s", head: () => ({}), render: () => null },
  { title: "Empty list", size: "s", empty: { when: () => true, heading: "Nothing yet" }, render: () => null },
  { size: "s", empty: { when: () => true, heading: "Untitled empty" }, render: () => null },
  { title: "Not empty", size: "s", empty: { heading: "Never shown" }, render: () => blocks("Shown") },
  {
    size: "m",
    each: {
      tiles: 2,
      items: () => ["North", "South"],
      key: (i: string) => i,
      title: (i: string) => `Region ${i}`,
      render: (i: string) => blocks(`Sales in ${i}`),
    },
  } as Widget,
  { size: "s", header: { source: { count: "invoices" }, render: (n) => ({ heading: `Invoices: ${String(n)}` }) } },
  { size: "s", header: { render: () => ({ heading: "Header without data" }) } },
  { size: "s", header: { heading: "Plain header" } },
  {
    title: "Throws",
    size: "s",
    render: () => {
      throw new Error("bad widget");
    },
  },
];

const testConfig = {
  ...config,
  collections: [...config.collections, orders],
  admin: {
    ...config.admin,
    components: {
      views: {
        ...config.admin!.components!.views,
        dashboard: {
          Component: widgets({ header: { source: { count: "invoices" }, render: () => header }, widgets: home }),
        },
        orders: {
          Component: widgets({ widgets: [{ collection: { collection: "orders" }, size: "full" }] }),
          path: "/collections/orders",
          nav: "auto",
        },
        order: {
          Component: widgets({
            widgets: [{ document: { collection: "orders", id: "$param.id", key: "o" }, size: "full" }],
          }),
          path: "/collections/orders/:id",
        },
        welcome: {
          Component: widgets({
            widgets: [{ document: { collection: "orders", id: "o-welcome", tab: "notes" }, size: "full" }],
          }),
          path: "/welcome",
          meta: { title: "Welcome order" },
        },
        missing: {
          Component: widgets({ widgets: [{ document: { collection: "orders", id: "$param.other" }, size: "full" }] }),
          path: "/missing/:id",
        },
        board: {
          Component: widgets({ widgets: [{ size: "s", render: () => blocks("Board") }] }),
          path: "/board",
          nav: { group: "Insights", label: "Board" },
        },
      },
    },
  },
} as unknown as MockConfig;

const fullAccess: Access = {
  ...access,
  collections: { ...access.collections, orders: crud() },
};

const contexts: { remove(): void }[] = [];
afterEach(() => {
  for (const c of contexts.splice(0)) c.remove();
});

function harness({
  at = "/",
  user = { ...maya, collection: "users" } as (Doc & { collection: string }) | null,
  allowed = fullAccess as Access | null,
  data = {} as MemoryData,
  project = testConfig,
  logins = undefined as SeedUser[] | undefined,
  site: own = undefined as Partial<Site> | undefined,
  navigation = [
    {
      label: "Sales",
      items: [
        { label: "Invoices", href: "/collections/invoices" },
        { label: "Dashboard", href: "/" },
        { label: "Heading only" },
      ],
    },
  ],
} = {}) {
  const s = shell({
    at,
    config: project,
    seedUsers: logins,
    site: own,
    access: allowed ?? undefined,
    data: {
      docs: {
        ...docs(),
        orders: [
          { id: "o1", code: "ORD-0142", lines: [], tags: ["a"], owner: "u1" },
          { id: "o-welcome", code: "ORD-0001" },
        ] as Doc[],
      },
      endpoints: {
        "POST /ask": () => ({
          answer: "Two invoices are late.",
          points: ["INV-1001"],
          sources: [{ label: "INV-1001", href: "/collections/invoices/i1" }],
        }),
        "GET /invoices/summary": () => ({ open: 2 }),
        "POST /invoices/i1/remind": (body) => ({ sent: true, body }),
      },
      ...data,
    },
  });
  const switched: string[] = [];
  const panels: [string, boolean][] = [];
  const host: AgentHost = {
    user: () => user,
    access: () => allowed,
    title: () => "Invoices",
    address: s.address,
    navigation: () => navigation,
    switchUser: (id) => {
      switched.push(id);
      return Promise.resolve(id === "u2");
    },
    setPanel: (panel, open) => {
      panels.push([panel, open]);
      s.dashboard.stores.preferences.set(panel === "aside" ? { asideOpen: open } : { navOpen: open });
      return Promise.resolve();
    },
    appearance: () => ({
      theme: { selected: "system", choices: [{ id: "dark", label: "Dark" }] },
      scheme: { selected: "default", choices: [] },
      background: { selected: "", choices: [] },
    }),
    setAppearance: (_kind, id) => Promise.resolve(id === "dark"),
  };
  const tools = dashboardTools(s.dashboard, host);
  const run = (name: string, input: Record<string, unknown> = {}) => tools.find((t) => t.name === name)!.execute(input);
  const calls = () => (s.dashboard.data as unknown as { calls: { method: string; args: unknown[] }[] }).calls;
  return { s, host, tools, run, switched, panels, calls };
}

describe("agent tools", () => {
  it("trims long values, deep objects and long lists", () => {
    expect(trim("x".repeat(601))).toBe(`${"x".repeat(600)}… (601 chars)`);
    expect(trim("short")).toBe("short");
    expect(trim(Array.from({ length: 27 }, (_, i) => i))).toHaveLength(26);
    expect(trim([1, 2])).toEqual([1, 2]);
    let deep: Record<string, unknown> = { leaf: 1 };
    for (let i = 0; i < 10; i++) deep = { deep };
    expect(JSON.stringify(trim(deep))).toContain('"…"');
    expect(trim(7)).toBe(7);
    expect(trim(null)).toBe(null);
  });

  it("scores names", () => {
    expect(nameScore("go to invoices", "Invoices")).toBe(100);
    expect(nameScore("invoice", "invoices")).toBe(100);
    expect(nameScore("inv", "invoices list")).toBe(75);
    expect(nameScore("overdue invoices", "invoices due")).toBe(30);
    expect(nameScore("anything", "")).toBe(0);
    expect(nameScore("zebra", "invoices")).toBe(0);
  });

  it("offers only the sign-in tools when signed out", async () => {
    const { tools, run, switched } = harness({ user: null, at: "/login" });
    expect(tools.map((t) => t.name)).toEqual(["get_screen", "list_demo_users", "switch_user"]);
    expect(await run("get_screen")).toMatchObject({
      signedInAs: null,
      content: { kind: "login", description: expect.stringContaining("Signed out") },
    });
    expect(await run("list_demo_users")).toEqual([
      { id: "u1", name: "Maya Patel", role: "Manager", current: false },
      { id: "u2", name: "Jordan Lee", role: "Accounts", current: false },
    ]);
    await expect(run("switch_user", { id: "u9" })).rejects.toThrow('No demo user "u9"');
    expect(await run("switch_user", { id: "u2" })).toMatchObject({ url: "/login" });
    expect(switched).toEqual(["u9", "u2"]);
  });

  it("describes every kind of screen", async () => {
    const screen = async (at: string, extra: Parameters<typeof harness>[0] = {}) =>
      ((await harness({ at, ...extra }).run("get_screen")) as { content: Record<string, unknown> }).content;
    expect(await screen("/")).toMatchObject({ kind: "dashboard", widgets: expect.any(Array) });
    expect(await screen("/", { user: null })).toEqual({
      kind: "dashboard",
      description: "The home page: the signed-in user's day.",
    });
    expect(await screen("/collections/invoices")).toMatchObject({
      kind: "list",
      totalDocs: 3,
      columns: ["number", "customer", "amount", "status", "updatedAt"],
    });
    const failing = harness({ at: "/collections/invoices" });
    failing.s.dashboard.data.find = () => Promise.reject(new Error("offline"));
    expect(((await failing.run("get_screen")) as { content: unknown }).content).toMatchObject({
      kind: "list",
      error: "offline",
    });
    expect(await screen("/collections/invoices/create")).toMatchObject({ kind: "create form", label: "Invoice" });
    expect(await screen("/collections/invoices/i1")).toMatchObject({ kind: "record", id: "i1" });
    expect(await screen("/collections/orders/o1?o[tab]=notes")).toMatchObject({
      kind: "record (Notes tab)",
      tabData: { widgets: [] },
    });
    expect(await screen("/collections/orders/o1?o=plain")).toMatchObject({ kind: "record" });
    expect(await screen("/welcome")).toMatchObject({ kind: "record (Notes tab)", id: "o-welcome" });
    expect(await screen("/missing/x")).toMatchObject({ kind: "create form", collection: "orders" });
    expect(await screen("/reports")).toMatchObject({
      kind: "screen",
      title: "Reports",
      description: "Monthly figures.",
    });
    expect(await screen("/board")).toMatchObject({ kind: "screen", widgets: [] });
    expect(await screen("/globals/settings?settings[tab]=x")).toMatchObject({
      kind: "settings",
      data: { workspaceName: "North office" },
    });
    expect(await screen("/account")).toMatchObject({ kind: "account", user: { id: "u1" } });
    expect(await screen("/create-first-user", { user: null })).toMatchObject({ kind: "create-first-user" });
    expect(await screen("/nowhere")).toEqual({ kind: "not found" });
  });

  it("reports the layout and who is signed in", async () => {
    const { run, s } = harness({ at: "/collections/invoices?q=x" });
    s.dashboard.stores.tour.set({ active: "t1" });
    expect(await run("get_screen")).toMatchObject({
      url: "/collections/invoices?q=x",
      title: "Invoices",
      signedInAs: { id: "u1", name: "Maya Patel", email: "maya@example.com", role: "Manager" },
      layout: { navigationOpen: false, sidePanelOpen: false, unreadNotifications: 0, runningTour: "t1" },
    });
  });

  it("lists pages and navigates by name, path or record", async () => {
    const { run, s } = harness();
    expect(await run("list_pages")).toMatchObject({
      home: "/",
      groups: [
        {
          group: "Sales",
          pages: [
            { label: "Invoices", path: "/collections/invoices" },
            { label: "Dashboard" },
            { label: "Heading only" },
          ],
        },
      ],
      recordTabs: [
        { collection: "invoices", tabs: [{ tab: "history", label: "History" }] },
        {
          collection: "orders",
          tabs: [
            { tab: "notes", label: "Notes" },
            { tab: "files", label: "Files" },
          ],
        },
      ],
      account: "/account",
    });
    await run("navigate", { path: "/collections/invoices?invoices[q]=x" });
    await run("navigate", { path: "customers" });
    await run("navigate", { path: "INV-1001 history" });
    await run("navigate", { path: "ORD-0142" });
    await run("navigate", { path: "workspace settings" });
    await run("navigate", { path: "board" });
    await run("navigate", { path: "" });
    expect(s.dashboard.navigations.map((n) => n.to)).toEqual([
      "/collections/invoices?invoices[q]=x",
      "/collections/customers",
      "/collections/invoices/i1/history",
      "/collections/orders/o1",
      "/globals/settings",
      "/board",
      "/",
    ]);
    await expect(run("navigate", { path: "/nowhere/7" })).rejects.toThrow("No page matches");
    await expect(run("navigate", { path: "zebra crossing" })).rejects.toThrow(
      'No page matches "zebra crossing". Call list_pages',
    );
    await expect(run("navigate", { path: "zebra invoice" })).rejects.toThrow(
      "Closest: invoices (/collections/invoices), Invoices (/collections/invoices).",
    );
    await expect(run("navigate", { path: "/collections/payments?q=1" })).rejects.toThrow("No page matches");
  });

  it("finds a record page even when one collection fails", async () => {
    const { run, s } = harness();
    const find = s.dashboard.data.find;
    s.dashboard.data.find = (slug, options) =>
      slug === "customers" ? Promise.reject(new Error("down")) : find(slug, options);
    await run("navigate", { path: "INV-1002" });
    expect(s.dashboard.navigations.at(-1)?.to).toBe("/collections/invoices/i2");
    await expect(run("navigate", { path: "XYZ-9999" })).rejects.toThrow("No page matches");
  });

  it("changes layout and appearance", async () => {
    const { run, panels } = harness();
    expect(await run("set_layout", { panel: "aside", open: true })).toEqual({
      navigationOpen: false,
      sidePanelOpen: true,
    });
    expect(await run("set_layout", { panel: "nav", open: "yes" })).toEqual({
      navigationOpen: false,
      sidePanelOpen: true,
    });
    expect(panels).toEqual([
      ["aside", true],
      ["nav", false],
    ]);
    expect(await run("get_appearance")).toMatchObject({ theme: { selected: "system" } });
    expect(await run("set_appearance", { kind: "theme", id: "dark" })).toMatchObject({ selected: "system" });
    await expect(run("set_appearance", { kind: "theme", id: "neon" })).rejects.toThrow(`"neon" isn't a theme choice`);
    await expect(run("set_appearance", { kind: "font", id: "dark" })).rejects.toThrow(`"dark" isn't a font choice`);
  });

  it("checks accessibility through the contrast checker", async () => {
    const { run } = harness();
    await expect(run("check_accessibility")).rejects.toThrow("The contrast checker isn't on this page.");
    const audit = document.createElement("ui-contrast-audit");
    audit.measure = () => [
      { text: "Faint", ratio: 2.345, required: 4.5, color: "#999", background: "#fff", overImage: false } as never,
    ];
    document.body.append(audit);
    contexts.push(audit);
    expect(await run("check_accessibility")).toEqual({
      passes: false,
      failures: [
        { text: "Faint", ratio: 2.35, required: 4.5, color: "#999", background: "#fff", overBackgroundImage: false },
      ],
    });
    audit.measure = () => [];
    expect(await run("check_accessibility")).toEqual({ passes: true, failures: [] });
  });

  it("describes the schema", async () => {
    const { run } = harness({
      allowed: { ...fullAccess, globals: { settings: { read: { permission: true }, update: { permission: false } } } },
    });
    expect(await run("describe_schema", { collection: "orders" })).toMatchObject({
      slug: "orders",
      singular: "Order",
      titleField: "code",
      tabs: ["Notes", "Files"],
      fields: [
        { name: "code", type: "text", label: "Code", required: true },
        { name: "lines", type: "array", fields: [{ name: "sku", type: "text" }] },
        { name: "body", type: "blocks", blocks: [{ slug: "note", fields: [{ name: "text", type: "text" }] }] },
        { name: "tags", type: "select", hasMany: true, options: ["a", "b"] },
        { name: "owner", type: "relationship", relationTo: "users", readOnly: true },
      ],
    });
    await expect(run("describe_schema", { collection: "ghosts" })).rejects.toThrow('Unknown collection "ghosts"');
    const all = (await run("describe_schema")) as {
      collections: { slug: string; group?: string; description?: string }[];
      globals: unknown[];
    };
    expect(all.collections.find((c) => c.slug === "customers")).toMatchObject({
      group: "Sales",
      description: "Companies that buy from us.",
    });
    expect(all.collections.find((c) => c.slug === "payments")).toMatchObject({
      group: undefined,
      description: undefined,
      canCreate: false,
    });
    expect(all.globals).toEqual([
      { slug: "settings", label: "Workspace settings", fields: ["workspaceName"], canUpdate: false },
    ]);
    const none = harness({ allowed: null });
    expect(await none.run("describe_schema")).toEqual({ collections: [], globals: [] });
  });

  it("reads and writes records", async () => {
    const { run, calls } = harness();
    expect(
      await run("find_documents", {
        collection: "invoices",
        where: { status: { equals: "draft" } },
        sort: "-number",
        limit: 500,
        page: 1,
      }),
    ).toMatchObject({
      totalDocs: 1,
      docs: [{ id: "i2" }],
    });
    expect(await run("find_documents", { collection: "invoices", where: ["bad"], limit: "x" })).toMatchObject({
      totalDocs: 3,
    });
    expect(
      calls()
        .filter((c) => c.method === "find")
        .map((c) => c.args[1]),
    ).toEqual([
      { where: { status: { equals: "draft" } }, sort: "-number", limit: 50, page: 1, depth: 0 },
      { where: undefined, sort: undefined, limit: 10, page: 1, depth: 0 },
    ]);
    expect(await run("count_documents", { collection: "invoices" })).toEqual({ totalDocs: 3 });
    expect(await run("get_document", { collection: "invoices", id: "i1" })).toMatchObject({
      path: "/collections/invoices/i1",
      document: { number: "INV-1001" },
    });
    expect(await run("create_document", { collection: "customers", data: { name: "Lakeside Farm" } })).toMatchObject({
      doc: { name: "Lakeside Farm" },
    });
    expect(await run("create_document", { collection: "customers" })).toMatchObject({
      doc: { id: expect.any(String) },
    });
    expect(await run("update_document", { collection: "customers", id: "c1", data: { city: "Hull" } })).toMatchObject({
      doc: { city: "Hull" },
    });
    expect(await run("update_document", { collection: "customers", id: "c1" })).toMatchObject({
      doc: { city: "Hull" },
    });
    expect(await run("delete_document", { collection: "customers", id: "c2" })).toMatchObject({ doc: { id: "c2" } });
    expect(await run("get_settings", { global: "settings" })).toEqual({ workspaceName: "North office" });
    await expect(run("get_settings", { global: "nope" })).rejects.toThrow('Unknown global "nope"');
    expect(await run("update_settings", { global: "settings", data: { workspaceName: "South" } })).toMatchObject({
      result: { workspaceName: "South" },
    });
    expect(await run("update_settings", { global: "settings" })).toMatchObject({ result: { workspaceName: "South" } });
    await expect(run("update_settings", { global: "nope" })).rejects.toThrow('Unknown global "nope"');
    expect(await run("mark_notification_read", { id: "n1" })).toMatchObject({ doc: { read: true } });
  });

  it("calls workflows and the assistant", async () => {
    const { run } = harness();
    expect(await run("list_workflows")).toEqual([
      { method: "get", path: "/invoices/summary" },
      { method: "post", path: "/invoices/:id/remind" },
    ]);
    expect(await run("call_workflow", { method: "get", path: "/invoices/summary" })).toEqual({ open: 2 });
    expect(await run("call_workflow", { method: "post", path: "/invoices/i1/remind", body: { note: "Soon" } })).toEqual(
      { sent: true, body: { note: "Soon" } },
    );
    expect(await run("call_workflow", { method: "post", path: "/invoices/i1/remind" })).toEqual({
      sent: true,
      body: {},
    });
    await expect(run("call_workflow", { method: "post", path: "/invoices/summary" })).rejects.toThrow(
      "No POST /invoices/summary workflow",
    );
    await expect(run("call_workflow", { method: "delete", path: "/x" })).rejects.toThrow("No GET /x workflow");
    expect(await run("ask_assistant", { question: "Who is late?" })).toMatchObject({
      answer: "Two invoices are late.",
    });
  });

  it("reports my work, bookmarks and tours", async () => {
    const { run, s } = harness();
    const count = s.dashboard.data.count;
    s.dashboard.data.count = (slug, where) =>
      slug === "customers" ? Promise.reject(new Error("down")) : count(slug, where);
    expect(await run("get_my_work")).toMatchObject({
      widgets: [
        { label: "Overdue", count: 1, needsAttention: true, collection: "invoices" },
        { label: "Drafts", count: 1, needsAttention: undefined },
        { label: "To call", count: 0 },
      ],
      unreadNotifications: [{ id: "n1" }, { id: "n2" }],
    });
    const blind = harness({
      allowed: { ...fullAccess, collections: { invoices: crud(), customers: crud(false, false) } },
    });
    expect(await blind.run("get_my_work")).toMatchObject({
      unreadNotifications: [],
      widgets: [{ label: "Overdue" }, { label: "Drafts" }],
    });
    expect(await run("get_bookmarks")).toEqual([]);
    expect(await run("toggle_bookmark", {})).toEqual([{ id: "doc-1", href: "/", label: "Invoices" }]);
    expect(await run("toggle_bookmark", { path: "/collections/invoices", label: "All invoices" })).toHaveLength(2);
    expect(await run("list_tours")).toEqual([
      { id: "t1", title: "Getting around", summary: "Where things live.", steps: 3, cast: [], done: false },
      { id: "t2", title: "Approvals", summary: "Who signs what.", steps: 1, cast: ["u1"], done: false },
    ]);
    expect(await run("start_tour", { id: "t2" })).toEqual({ started: "Approvals", steps: ["Ask"] });
    expect(s.dashboard.stores.tour.get()).toMatchObject({ active: "t2", step: 0 });
    await expect(run("start_tour", { id: "t9" })).rejects.toThrow('No tour "t9"');
  });

  it("describes the screen in a few lines", async () => {
    const text = async (at: string, extra: Parameters<typeof harness>[0] = {}) =>
      (await harness({ at, ...extra }).run("what_is_on_screen")) as string;
    const day = await text("/");
    expect(day).toContain("Page: Invoices (/)");
    expect(day).toContain("Signed in as Maya Patel — Manager");
    expect(day).toContain("About this page: The home page");
    expect(day).toContain("Good morning");
    expect(day).toContain("Open invoices:");
    expect(day).toContain("Tagged · Urgent (4):");
    expect(day).toContain("Empty list: Nothing yet");
    expect(day).toContain("Untitled empty");
    expect(day).toContain("Region North:");
    expect(day).toContain("Invoices: 3");
    expect(day).toContain("Plain header");
    expect(day).not.toContain("bad widget");
    const list = await text("/collections/invoices");
    expect(list).toContain("A list of Invoices: 3 in all.");
    expect(list).toContain("- INV-1001 · INV-1001 · Harbor Logistics · 1,200 · Overdue");
    const down = harness({ at: "/collections/invoices" });
    down.s.dashboard.data.find = () => Promise.reject(new Error("offline"));
    expect(await down.run("what_is_on_screen")).toContain("A list of Invoices: 0 in all.");
    const record = await text("/collections/invoices/i1");
    expect(record).toContain("A invoice: INV-1001");
    expect(record).toContain("[History tab]");
    expect(record).toContain("Tabs: Details, History");
    expect(await text("/collections/orders/o1?o[tab]=notes")).toContain("Tabs: Details, Notes");
    expect(await text("/reports")).toContain("A screen: Reports.");
    expect(await text("/globals/settings")).toContain("Settings: Workspace settings.");
    expect(await text("/account")).not.toContain("About this page");
  });

  it("reads my day from the side panel when there is no home screen", async () => {
    const bare = {
      ...config,
      admin: { ...config.admin, custom: { ...config.admin!.custom, aside: [] } },
    } as MockConfig;
    expect(await harness({ project: config }).run("my_day")).toContain("- Overdue: 1");
    expect(await harness({ project: bare }).run("my_day")).toBe("Nothing on the home page for this person.");
    expect(await harness().run("my_day")).toContain("Good morning");
  });

  it("finds records and their status", async () => {
    const { run, s } = harness();
    expect(await run("find", { query: "Harbor" })).toBe(
      "- Harbor Logistics (Customer) → /collections/customers/c1\n- INV-1001 (Invoice) → /collections/invoices/i1\n- INV-1003 (Invoice) → /collections/invoices/i3",
    );
    expect(await run("find", { query: "  " })).toBe('Nothing matches "  ".');
    const status = (await run("record_status", { record: "INV-1002" })) as string;
    expect(status).toContain("INV-1002 (invoice)");
    expect(status).toContain("- customer: Riverside Bakery");
    expect(status).toContain("Page: /collections/invoices/i2");
    expect(await run("record_status", { record: "Jordan" })).toContain("Jordan Lee (user)");
    await expect(run("record_status", { record: "nobody" })).rejects.toThrow('No record matches "nobody"');
    const find = s.dashboard.data.find;
    s.dashboard.data.find = (slug, options) =>
      slug === "invoices" ? Promise.reject(new Error("down")) : find(slug, options);
    expect(await run("find", { query: "INV" })).toBe('Nothing matches "INV".');
  });

  it("picks the main record from the site or the collections", async () => {
    const plain = harness({
      allowed: { ...fullAccess, collections: { ...fullAccess.collections, invoices: crud(false, false) } },
    });
    expect(await plain.run("record_status", { record: "ORD-0142" })).toContain("ORD-0142 (order)");
    const none = harness({ allowed: { ...fullAccess, collections: { customers: crud() } } });
    expect(await none.run("record_status", { record: "Harbor" })).toContain("Harbor Logistics (customer)");
  });

  it("answers from the records and the guide", async () => {
    const { run, s } = harness();
    expect(await run("ask_records", { question: "Who is late?" })).toBe(
      "Two invoices are late.\n- INV-1001\nSources: INV-1001 (/collections/invoices/i1)",
    );
    const quiet = harness({
      data: { endpoints: { "POST /ask": () => ({ answer: "Nothing late.", points: [], sources: [] }) } },
    });
    expect(await quiet.run("ask_records", { question: "Late?" })).toBe("Nothing late.");
    expect(await run("platform_guide", { topic: "overdue billing" })).toBe(
      "Invoices: Invoices are under Sales.\n\nYour role — Managers approve invoices.",
    );
    const other = harness({ user: { id: "u2", email: "jordan@example.com", role: "accounts", collection: "users" } });
    expect(await other.run("platform_guide", { topic: "zebra" })).toBe("Topics: Invoices; Customers.");
    expect(await run("open_page", { page: "customers" })).toBe("Opened: Invoices (/collections/customers).");
    expect(s.dashboard.navigations.at(-1)?.to).toBe("/collections/customers");
  });

  it("copes with nameless people and a bare project", async () => {
    const sam = { id: "u3", email: "sam@example.com", role: "accounts", collection: "users" };
    expect(await harness({ user: sam }).run("get_screen")).toMatchObject({ signedInAs: { name: "sam@example.com" } });
    expect(await harness({ user: sam }).run("what_is_on_screen")).toContain("Signed in as sam@example.com — Accounts");
    const nameless = harness({
      logins: [{ id: "u4", email: "lee@example.com", password: "lee-pass", role: "manager" }],
    });
    expect(await nameless.run("list_demo_users")).toEqual([
      { id: "u4", name: "lee@example.com", role: "Manager", current: false },
    ]);
    const bare = { collections: config.collections, admin: { user: "users" } } as unknown as MockConfig;
    const b = harness({ project: bare, allowed: { ...fullAccess, globals: {} } });
    expect(await b.run("list_workflows")).toEqual([]);
    expect(await b.run("describe_schema")).toMatchObject({ globals: [] });
    expect(await b.run("my_day")).toBe("Nothing on the home page for this person.");
    await b.run("navigate", { path: "my account" });
    expect(b.s.dashboard.navigations.at(-1)?.to).toBe("/account");
    const hidden = harness({ allowed: { ...fullAccess, globals: {} } });
    await hidden.run("navigate", { path: "workspace settings" });
    expect(hidden.s.dashboard.navigations.at(-1)?.to).toBe("/globals/settings");
  });

  it("reads record tabs within a budget", async () => {
    const { run, s } = harness({ at: "/collections/orders/o1?o[tab]=notes" });
    const notes = (await run("what_is_on_screen")) as string;
    expect(notes).toContain("Order notes");
    expect(notes).toContain("Single block");
    expect(notes).not.toContain("[Files tab]");
    const whole = (await harness({ at: "/collections/orders/o1" }).run("what_is_on_screen")) as string;
    expect(whole).toContain("0".repeat(199));
    expect(whole).not.toContain("Order notes");
    await run("navigate", { path: "ORD-0142 files" });
    expect(s.dashboard.navigations.at(-1)?.to).toBe("/collections/orders/o1/files");
  });

  it("clips long answers", async () => {
    const long = harness({
      site: { ...site(), guide: () => Promise.resolve([{ topic: "Invoices", keywords: "", text: "x".repeat(2000) }]) },
    });
    const text = (await long.run("platform_guide", { topic: "invoices" })) as string;
    expect(text).toHaveLength(1501);
    expect(text.endsWith("…")).toBe(true);
  });
});
