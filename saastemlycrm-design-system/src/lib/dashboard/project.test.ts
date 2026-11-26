import { describe, expect, it } from "vite-plus/test";
import type { CollectionConfig, GlobalConfig } from "payload";
import type { FieldLike, MockConfig } from "../contracts/config.ts";
import {
  collectionSettings,
  columnsOf,
  componentOf,
  createProject,
  dataFields,
  editTabs,
  formatDate,
  formFields,
  globalLabel,
  groupOf,
  humanize,
  isToned,
  labels,
  numberText,
  splitSidebar,
  titleOf,
} from "./project.ts";

const page = (widgets: unknown[]) => ({ path: "dashboard-page", clientProps: { page: { widgets } } });

const invoices = {
  slug: "invoices",
  admin: { useAsTitle: "number", group: "Finance", defaultColumns: ["number", "status", "missing"] },
  labels: { singular: "Invoice", plural: "Invoices" },
  fields: [
    { name: "number", type: "text" },
    {
      name: "status",
      type: "select",
      options: [{ label: "Paid", value: "paid" }, "draft"],
      custom: { tones: { draft: "warning" } },
    },
    { name: "customer", type: "relationship", relationTo: "customers" },
    { name: "total", type: "number", custom: { number: { unit: "money", currencyField: "currency" } } },
    { name: "currency", type: "text" },
    { name: "notes", type: "textarea", admin: { position: "sidebar" } },
  ],
  custom: { list: { title: "Invoices" } },
} as unknown as CollectionConfig;
const customers = {
  slug: "customers",
  admin: { useAsTitle: "name" },
  fields: [
    { name: "name", type: "text" },
    { type: "row", fields: [{ name: "city", type: "text" }] },
    { type: "collapsible", fields: [{ name: "phone", type: "text" }] },
    { type: "tabs", tabs: [{ fields: [{ name: "email2", type: "email" }] }, { name: "extra", fields: [] }] },
    { name: "intro", type: "ui" },
    { name: "items", type: "array" },
    { name: "active", type: "checkbox" },
    { name: "since", type: "date" },
    { name: "meta", type: "json" },
  ],
} as unknown as CollectionConfig;
const users = {
  slug: "users",
  auth: true,
  fields: [
    { name: "name", type: "text" },
    { name: "role", type: "select", options: [{ label: "Manager", value: "manager" }] },
  ],
} as unknown as CollectionConfig;
const settingsGlobal = { slug: "settings", fields: [], admin: { group: "Setup" } } as unknown as GlobalConfig;
const branding = { slug: "branding", fields: [], label: "Brand" } as unknown as GlobalConfig;

const config = {
  collections: [invoices, customers, users],
  globals: [settingsGlobal, branding],
  admin: {
    custom: {
      today: "2026-03-02T00:00:00.000Z",
      nav: { groups: [{ label: "Finance", icon: "banknotes" }] },
      statusWords: { success: ["shipped"] },
    },
    components: {
      views: {
        dashboard: { path: "/", Component: page([]) },
        invoiceList: {
          path: "/collections/invoices",
          nav: "auto",
          Component: page([{ collection: { collection: "invoices" } }]),
        },
        invoice: { path: "/collections/invoices/:id", Component: page([{ document: { collection: "invoices" } }]) },
        settings: { path: "/globals/settings", nav: "auto", Component: page([{ global: { global: "settings" } }]) },
        brand: {
          path: "/globals/branding",
          nav: "auto",
          Component: page([{ grid: [{ global: { global: "branding" } }] }]),
        },
        reports: { path: "/reports", meta: { title: "Reports" }, nav: { group: "Insights", label: "Reports" } },
        nothing: { path: "/nothing", nav: "auto", Component: page([{ text: { body: "Hi" } }]) },
        loose: { path: "/loose", Component: page([{ document: { collection: "unknown" } }]) },
        twoParts: { path: "/a/:b/:c" },
      },
    },
  },
} as unknown as MockConfig;

describe("plain helpers", () => {
  it("name, label and title things", () => {
    expect(humanize("orderLines_total")).toBe("Order Lines total");
    expect(labels(invoices)).toEqual({ singular: "Invoice", plural: "Invoices" });
    expect(labels(customers)).toEqual({ singular: "Customer", plural: "Customers" });
    expect(labels({ slug: "categories" } as CollectionConfig)).toEqual({ singular: "Category", plural: "Categories" });
    expect(globalLabel(branding)).toBe("Brand");
    expect(globalLabel(settingsGlobal)).toBe("Settings");
    expect(titleOf(invoices, { id: "i1", number: "INV-1" })).toBe("INV-1");
    expect(titleOf(invoices, { id: "i1", number: "" })).toBe("i1");
    expect(titleOf(invoices, { number: null })).toBe("Untitled");
    expect(titleOf(invoices, null)).toBe("");
    expect(groupOf(invoices)).toBe("Finance");
    expect(groupOf(customers)).toBe("Collections");
  });

  it("flatten, split and pick fields", () => {
    expect(dataFields(customers.fields as unknown as FieldLike[]).map((f) => f.name)).toEqual([
      "name",
      "city",
      "phone",
      "email2",
      "items",
      "active",
      "since",
      "meta",
    ]);
    expect(formFields(users).map((f) => f.name)).toEqual(["email", "name", "role"]);
    expect(
      dataFields([{ type: "tabs" } as FieldLike, { type: "text" } as FieldLike, { type: "row" } as FieldLike]),
    ).toEqual([]);
    expect(formFields({ ...users, fields: [{ name: "email", type: "email" }] } as CollectionConfig)).toHaveLength(1);
    expect(formFields(invoices)).toHaveLength(6);
    const { main, sidebar } = splitSidebar(invoices.fields as unknown as FieldLike[]);
    expect(sidebar.map((f) => f.name)).toEqual(["notes"]);
    expect(main).toHaveLength(5);
    expect(columnsOf(invoices).map((f) => `${f.name}:${f.type}`)).toEqual([
      "number:text",
      "status:select",
      "missing:text",
    ]);
    expect(columnsOf(customers).map((f) => f.name)).toEqual(["name", "city", "phone", "email2", "updatedAt"]);
    expect(
      columnsOf({ slug: "x", fields: [] } as unknown as CollectionConfig).map((f) => `${f.name}:${f.type}`),
    ).toEqual(["id:text", "updatedAt:date"]);
    expect(isToned(invoices.fields[1] as unknown as FieldLike)).toBe(true);
    expect(isToned({ name: "stage", type: "select" })).toBe(true);
    expect(isToned({ name: "kind", type: "select" })).toBe(false);
    expect(isToned({ type: "select" } as FieldLike)).toBe(false);
    expect(isToned({ name: "status", type: "select", hasMany: true })).toBe(false);
    expect(collectionSettings(invoices)).toEqual({ list: { title: "Invoices" } });
    expect(collectionSettings(customers)).toEqual({});
  });

  it("format dates and numbers", () => {
    expect(formatDate("")).toBe("");
    expect(formatDate(5)).toBe("");
    expect(formatDate("not a date")).toBe("not a date");
    expect(formatDate("2026-03-02T00:00:00.000Z")).toMatch(/2026/);
    expect(formatDate("2026-03-02T00:30:00.000Z")).toMatch(/00:30/);
    const local = new Date(2026, 2, 2, 0, 0).toISOString();
    expect(formatDate(local)).toMatch(/2026/);
    expect(formatDate(new Date(2026, 2, 2, 14, 30).toISOString())).toMatch(/:/);
    expect(numberText({ name: "n", type: "number" }, 1234.5)).toBe("1,234.5");
    expect(numberText(invoices.fields[3] as unknown as FieldLike, 12, { currency: "EUR" })).toMatch(/12/);
    expect(
      numberText({ name: "n", type: "number", custom: { number: { unit: "money", currency: "USD" } } }, 3),
    ).toMatch(/3/);
    expect(numberText(invoices.fields[3] as unknown as FieldLike, 12, {})).toMatch(/12/);
  });

  it("read custom components and edit tabs", () => {
    expect(componentOf("ui-thing")).toEqual({ tag: "ui-thing", props: {} });
    expect(componentOf({ path: "ui-x", clientProps: { a: 1 } })).toEqual({ tag: "ui-x", props: { a: 1 } });
    expect(componentOf({ path: "ui-y" })).toEqual({ tag: "ui-y", props: {} });
    expect(componentOf({ nope: true })).toBeNull();
    expect(componentOf(undefined)).toBeNull();
    const withTabs = {
      slug: "cases",
      fields: [],
      admin: {
        components: {
          views: {
            edit: {
              pricing: { path: "/pricing", Component: "case-pricing", tab: { label: "Pricing" } },
              notes: { path: "/notes", Component: { path: "case-notes" } },
              broken: { Component: "no-path" },
              empty: undefined,
            },
          },
        },
      },
    } as unknown as CollectionConfig;
    expect(editTabs(withTabs)).toEqual([
      { key: "pricing", Component: "case-pricing", props: {}, path: "/pricing", label: "Pricing" },
      { key: "notes", Component: "case-notes", props: {}, path: "/notes", label: "notes" },
    ]);
    expect(editTabs(customers)).toEqual([]);
  });
});

describe("createProject", () => {
  const project = createProject({
    config,
    base: "/app",
    seedUsers: [
      { id: "u1", email: "Ana@example.com", password: "a1", role: "manager" },
      { id: "u2", email: "ben@example.com", password: "b2", role: "manager" },
      { id: "u3", email: "cy@example.com", password: "c3" },
      { id: "u4", email: "", password: "x" },
    ],
  });

  it("looks up collections, globals and the user collection", () => {
    expect(project.collectionOf("invoices")).toBe(invoices);
    expect(project.collectionOf("nope")).toBeUndefined();
    expect(project.globalOf("branding")).toBe(branding);
    expect(project.globalOf("nope")).toBeUndefined();
    expect(project.userSlug).toBe("users");
    expect(createProject({ config: { collections: [] } as unknown as MockConfig }).userSlug).toBe("users");
    expect(createProject({ config: { ...config, admin: { user: "staff" } } as MockConfig }).userSlug).toBe("staff");
    expect(project.settings.today).toBe("2026-03-02T00:00:00.000Z");
    expect(project.todayIso()).toBe("2026-03-02");
    expect(createProject({ config: { collections: [] } as unknown as MockConfig }).todayIso()).toBe(
      new Date().toISOString().slice(0, 10),
    );
    expect(project.dashboardView()).toMatchObject({ path: "/" });
  });

  it("writes cells as text", () => {
    const f = (name: string) =>
      dataFields(project.collectionOf("customers")!.fields as unknown as FieldLike[]).find((x) => x.name === name)!;
    const inv = (name: string) => (invoices.fields as unknown as FieldLike[]).find((x) => x.name === name)!;
    expect(project.cellText(inv("number"), null)).toBe("—");
    expect(project.cellText(inv("number"), "")).toBe("—");
    expect(project.cellText(inv("status"), "paid")).toBe("Paid");
    expect(project.cellText(inv("status"), "draft")).toBe("draft");
    expect(project.cellText(inv("customer"), { id: "c1", name: "Acme" })).toBe("Acme");
    expect(project.cellText(inv("customer"), { relationTo: "customers", value: { id: "c2", name: "Beta" } })).toBe(
      "Beta",
    );
    expect(project.cellText({ name: "x", type: "relationship", relationTo: ["a", "b"] }, { id: "z" })).toBe("z");
    expect(project.cellText({ name: "x", type: "relationship" }, { other: 1 })).toBe('{"other":1}');
    expect(project.cellText(f("since"), "2026-03-02T00:00:00.000Z")).toMatch(/2026/);
    expect(project.cellText(f("active"), true)).toBe("Yes");
    expect(project.cellText(f("active"), false)).toBe("No");
    expect(project.cellText(inv("total"), 5, { currency: "USD" })).toMatch(/5/);
    expect(project.cellText(inv("total"), "5")).toBe("5");
    expect(project.cellText(f("items"), [1, 2])).toMatch(/2/);
    expect(project.cellText(f("items"), "x")).toBe("—");
    expect(project.cellText({ name: "b", type: "blocks" }, [])).toMatch(/0/);
    expect(project.cellText(f("meta"), { a: 1 })).toBe('{"a":1}');
    expect(project.cellText({ name: "g", type: "group" }, { b: 2 })).toBe('{"b":2}');
    expect(project.cellText(f("name"), ["a", "b"])).toBe("a, b");
  });

  it("builds and recognises dashboard paths", () => {
    expect(project.dashboardPath("collections", "a b")).toBe("/app/collections/a%20b");
    expect(project.dashboardPath()).toBe("/app");
    expect(createProject({ config }).dashboardPath()).toBe("/");
    expect(project.withBase("/x")).toBe("/app/x");
    expect(project.withBase("/app")).toBe("/app");
    expect(project.withBase("/app/x")).toBe("/app/x");
    expect(project.withBase("x")).toBe("x");
    expect(createProject({ config }).withBase("/x")).toBe("/x");
    expect(project.isDashboardPath("/app")).toBe(true);
    expect(project.isDashboardPath("/app/collections")).toBe(true);
    expect(project.isDashboardPath("/app/api")).toBe(false);
    expect(project.isDashboardPath("/app/api/users")).toBe(false);
    expect(project.isDashboardPath("/app/logo.png")).toBe(false);
    expect(project.isDashboardPath("/elsewhere")).toBe(false);
    expect(createProject({ config }).isDashboardPath("/")).toBe(true);
  });

  it("parses routes", () => {
    expect(project.parseRoute("/elsewhere")).toEqual({ name: "not-found" });
    expect(project.parseRoute("/app")).toEqual({ name: "dashboard" });
    expect(project.parseRoute("/app/login")).toEqual({ name: "login" });
    expect(project.parseRoute("/app/create-first-user")).toEqual({ name: "create-first-user" });
    expect(project.parseRoute("/app/account")).toEqual({ name: "account" });
    expect(project.parseRoute("/app/login/extra")).toEqual({ name: "not-found" });
    expect(project.parseRoute("/app/reports")).toEqual({ name: "view", key: "reports", params: {} });
    expect(project.parseRoute("/app/a/one/two")).toEqual({
      name: "view",
      key: "twoParts",
      params: { b: "one", c: "two" },
    });
    expect(project.parseRoute("/app/collections/invoices/i%201")).toEqual({
      name: "view",
      key: "invoice",
      params: { id: "i 1" },
    });
    expect(project.parseRoute("/app/collections/invoices", "?q=paid")).toMatchObject({
      name: "address",
      href: "/collections/invoices?q=paid",
    });
    expect(project.parseRoute("/app/collections/invoices", "?other=1")).toEqual({
      name: "view",
      key: "invoiceList",
      params: {},
    });
    expect(project.parseRoute("/app/collections/customers")).toMatchObject({ name: "address" });
    expect(project.parseRoute("/app/globals/branding/extra")).toMatchObject({ name: "address" });
    expect(project.parseRoute("/app/somewhere")).toEqual({ name: "not-found" });
    expect(project.addressOf("/collections/invoices")).toBe(project.addressOf("/collections/invoices"));
    expect(project.places()).toBe(project.places());
    expect(project.rootViews().map((v) => v.key)).not.toContain("dashboard");
  });

  it("names views and their navigation", () => {
    const view = (key: string) => project.rootViews().find((v) => v.key === key)!;
    expect(project.navOf(view("invoiceList"))).toEqual({ group: "Finance", label: "Invoices" });
    expect(project.navOf(view("settings"))).toEqual({ group: "Setup", label: "Settings" });
    expect(project.navOf(view("brand"))).toEqual({ group: "Configuration", label: "Brand" });
    expect(project.navOf(view("reports"))).toEqual({ group: "Insights", label: "Reports" });
    expect(project.navOf(view("nothing"))).toBeUndefined();
    expect(project.titleOfView(view("reports"))).toBe("Reports");
    expect(project.titleOfView(view("invoiceList"))).toBe("Invoices");
    expect(project.titleOfView(view("invoice"))).toBe("Invoice");
    expect(project.titleOfView(view("loose"))).toBe("Loose");
    expect(project.titleOfView(view("twoParts"))).toBe("Two Parts");
    expect(project.titleOfView({ key: "plainPage", path: "/plain", Component: page([{ text: { body: "Hi" } }]) })).toBe(
      "Plain Page",
    );
    const bare = createProject({ config: { collections: [] } as unknown as MockConfig });
    expect(bare.rootViews()).toEqual([]);
    expect(bare.places().collections.size).toBe(0);
    expect(bare.parseRoute("/collections/x")).toEqual({ name: "not-found" });
    expect(project.groupIcon("Finance")).toBe("banknotes");
    expect(project.groupIcon("Other")).toBe("grid");
    expect(createProject({ config: { collections: [] } as unknown as MockConfig }).groupIcon("Finance")).toBe("grid");
  });

  it("tones statuses", () => {
    const status = (invoices.fields as unknown as FieldLike[])[1]!;
    expect(project.statusColor("Shipped")).toBe("success");
    expect(project.statusColor("overdue")).toBe("error");
    expect(project.statusColor("awaiting reply")).toBe("warning");
    expect(project.statusColor("new")).toBe("info");
    expect(project.statusColor("archived")).toBe("neutral");
    expect(project.statusColor("mystery")).toBe("neutral");
    expect(project.statusColor()).toBe("neutral");
    expect(project.toneOf(status, "draft", "Draft")).toBe("warning");
    expect(project.toneOf(status, "paid", "Paid")).toBe("success");
    expect(project.toneOf(status, "on_hold", "Mystery")).toBe("error");
    expect(project.toneOf(status, 7, "Mystery")).toBe("neutral");
  });

  it("knows the demo sign-ins", () => {
    expect(project.seedUsers.map((u) => u.id)).toEqual(["u1", "u2", "u3"]);
    expect(project.roleLogins.map((u) => u.id)).toEqual(["u1"]);
    expect(project.defaultLogin?.id).toBe("u1");
    expect(project.demoPassword("ana@example.com")).toBe("a1");
    expect(project.demoPassword("nobody@example.com")).toBe("demo1234");
    expect(project.roleLabel("manager")).toBe("Manager");
    expect(project.roleLabel(undefined)).toBe("");
    expect(createProject({ config: { collections: [] } as unknown as MockConfig }).roleLabel("x")).toBe("x");
  });
});
