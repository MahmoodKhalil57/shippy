import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import { mount, testDashboard, type TestDashboard } from "../../../.storybook/dashboard.ts";
import { config, data, fullAccess, maya, readOnlyAccess, seedUsers } from "../../../.storybook/fixtures/views.ts";
import { ApiError } from "../../lib/api/errors.ts";
import type { Access } from "../../lib/dashboard/context.ts";
import type { DashboardEditView } from "./edit-view.ts";
import "./edit-view.ts";
import { visit } from "../../../.storybook/address.ts";

interface Setup {
  slug?: string;
  docId?: string;
  globalSlug?: string;
  tab?: string;
  access?: Access;
  tile?: boolean;
  embedded?: boolean;
  user?: typeof maya | null;
  spec?: unknown;
  stateKey?: string;
  cfg?: typeof config;
  dashboard?: (d: TestDashboard) => void;
}

interface Opened {
  host: HTMLElement;
  view: DashboardEditView;
  d: TestDashboard;
  inner: Record<string, unknown>;
  remove: () => void;
}

const template = (s: Setup) =>
  html`<dashboard-edit-view
    .slug=${s.slug ?? "deals"}
    .docId=${s.docId ?? "d1"}
    .globalSlug=${s.globalSlug ?? ""}
    .tab=${s.tab ?? ""}
    .access=${s.access ?? fullAccess}
    .user=${s.user === undefined ? maya : s.user}
    .spec=${s.spec ?? null}
    .stateKey=${s.stateKey ?? ""}
    ?tile=${s.tile ?? false}
    ?embedded=${s.embedded ?? false}
  ></dashboard-edit-view>`;

const dashboardFor = (s: Setup) => {
  const d = testDashboard({ config: s.cfg ?? config, seedUsers, data: data() });
  s.dashboard?.(d);
  return d;
};

const loaded = (host: HTMLElement) =>
  waitFor(() => {
    const v = host.querySelector<DashboardEditView>("dashboard-edit-view")!;
    return expect(
      !!v.querySelector("ui-doc-form, ui-alert, demo-activity-tab, ui-tabs") &&
        !v.querySelector("ui-empty-state[loading]"),
    ).toBe(true);
  });

async function opened(host: HTMLElement, remove = () => {}): Promise<Opened> {
  await loaded(host);
  const view = host.querySelector<DashboardEditView>("dashboard-edit-view")!;
  const d = (view.closest("dashboard-provider") as unknown as { dashboard: TestDashboard }).dashboard;
  return { host, view, d, inner: view as unknown as Record<string, unknown>, remove };
}

async function open(s: Setup): Promise<Opened> {
  const { host, remove } = await mount(template(s), dashboardFor(s), 1280);
  return opened(host, remove);
}

const calls = (d: TestDashboard) => (d.data as unknown as { calls: { method: string; args: unknown[] }[] }).calls;
const settle = async (view: DashboardEditView) => {
  await waitFor(() => expect((view as unknown as { saving: boolean }).saving).toBe(false));
  await waitFor(() => expect(view.querySelector("ui-empty-state[loading]")).toBeNull());
  await view.updateComplete;
};
const hero = (host: HTMLElement) =>
  host.querySelector("ui-record-hero") as unknown as {
    record: { key: string; title: string; supporting?: string; status?: { label: string } };
    tags: { label: string }[];
    figures: { label: string; value: string }[];
    links: { label: string; href?: string; count?: number }[];
    meta: string;
  };

const at = (url: string) => () => visit(url);

const meta = preview.meta({
  component: "dashboard-edit-view",
  parameters: { layout: "fullscreen" },
});

const on = (s: Setup, play: (m: Opened) => Promise<void>, beforeEach?: () => void) => ({
  beforeEach,
  render: () => html`<dashboard-provider .dashboard=${dashboardFor(s)}>${template(s)}</dashboard-provider>`,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => play(await opened(canvasElement)),
});

export const RelationIds = meta.story({
  name: "Sends relation ids back, however deep",
  ...on({ slug: "orders", docId: "o1" }, async (m) => {
    m.view.save();
    await settle(m.view);
    const sent = calls(m.d).find((c) => c.method === "update")!.args[2] as Record<string, unknown>;
    await expect(sent).toMatchObject({
      lines: [{ supplier: "c1", quantity: 3 }],
      shipping: { carrier: "c2" },
      returns: "none",
      address: { city: "Leeds", contact: "u1" },
      billing: null,
      content: [
        { blockType: "note", author: "u2" },
        { blockType: "retired", body: "Old block" },
      ],
      extras: "none",
      sections: null,
      attachment: "f1",
      related: [
        { relationTo: "deals", value: "d1" },
        { relationTo: "companies", value: "c2" },
      ],
      approval: { code: "A-7" },
      followUp: "d1",
    });
  }),
});

export const RelatedOptions = meta.story({
  name: "Related records with file details",
  ...on({ slug: "orders", docId: "o1" }, async (m) => {
    const relations = m.inner.relations as Record<string, { value: string; description?: string; image?: string }[]>;
    await expect(relations.secrets).toEqual([]);
    await expect(relations.files!.map((o) => [o.value, o.description, !!o.image])).toEqual([
      ["f1", "image/png · 2 kB", true],
      ["f2", "application/pdf · 3.3 MB", false],
      ["f3", "text/plain · 300 byte", false],
      ["f4", "text/csv", false],
    ]);
    await expect(calls(m.d).some((c) => c.method === "find" && c.args[0] === "secrets")).toBe(false);
  }),
});

export const OrderSummary = meta.story({
  name: "Order summary in a tile",
  ...on({ slug: "orders", docId: "o1", tile: true }, async (m) => {
    const h = hero(m.host);
    await expect(h.record).toMatchObject({ key: "o1", title: "PO-1042" });
    await expect(h.record.status).toBeUndefined();
    await expect(h.figures).toEqual([{ label: "Order total", value: "EUR 1,250" }]);
    await expect(h.links).toEqual([
      { label: "Follow Up: Warehouse fit-out", href: "/collections/deals/d1" },
      { label: "Deals", count: 3, href: undefined },
    ]);
    await expect(h.meta).toBe("");
    const steps = m.host.querySelector("ui-steps") as unknown as { current: number; items: { label: string }[] };
    await expect(steps.items.map((i) => i.label)).toEqual(["Draft", "Packed", "Shipped"]);
    await expect(steps.current).toBe(1);
    const joins = m.inner.joins as Record<string, { rows: { cells: Record<string, string> }[] }>;
    await expect(joins.deals!.rows.map((r) => r.cells.company)).toEqual(["Harbor Logistics", "c9", "Riverside Bakery"]);
  }),
});

export const SparseOrder = meta.story({
  name: "Sparse order in a tile",
  ...on({ slug: "orders", docId: "o2", tile: true }, async (m) => {
    await expect(hero(m.host).links).toEqual([]);
    await expect((m.host.querySelector("ui-steps") as unknown as { current: number }).current).toBe(-1);
    await expect(m.inner.joins).toEqual({});
  }),
});

export const CompanyJoins = meta.story({
  name: "Company with joined deals",
  ...on({ slug: "companies", docId: "c1", embedded: true }, async (m) => {
    const filtered = "/collections/deals?filters[0][field]=company&filters[0][operator]=equals&filters[0][value]=c1";
    await expect(hero(m.host).links.map((l) => [l.label, l.count, l.href])).toEqual([
      ["Deals", 2, filtered],
      ["Open deals", 1, filtered],
    ]);
    const joins = m.inner.joins as Record<
      string,
      { columns: { key: string; label: string }[]; rows: { cells: Record<string, string> }[]; createHref?: string }
    >;
    await expect(joins.deals!.columns.map((c) => c.label)).toEqual(["Title", "Status", "Stage", "Deal value"]);
    await expect(joins.openDeals!.columns.map((c) => c.key)).toEqual(["title", "owner", "amount", "updatedAt"]);
    await expect(joins.openDeals!.rows[0]!.cells).toEqual({
      title: "Delivery vans",
      owner: "u2",
      amount: "USD 1,200",
      updatedAt: "—",
    });
    await expect(joins.deals!.createHref).toBe("/collections/deals/create");
    const ro = await open({ slug: "companies", docId: "c1", access: readOnlyAccess });
    try {
      await expect((ro.inner.joins as Record<string, { createHref?: string }>).deals!.createHref).toBeUndefined();
      await expect(ro.host.textContent).toContain("Organisations you sell to.");
    } finally {
      ro.remove();
    }
  }),
});

export const SettingSummary = meta.story({
  name: "Setting summary and its tabs",
  ...on({ slug: "", docId: "", globalSlug: "settings", tile: true }, async (m) => {
    const h = hero(m.host);
    await expect(h.record).toMatchObject({ key: "settings", supporting: "Defaults used across the workspace." });
    await expect(h.figures).toEqual([{ label: "Tax Rate", value: "20" }]);
    await expect(m.host.querySelector("ui-tabs")).not.toBeNull();
    for (const tile of [false, true]) {
      const tab = await open({ slug: "", docId: "", globalSlug: "settings", tab: "audit", tile });
      try {
        await waitFor(() => expect(tab.host.textContent).toContain("Calls and emails for settings"));
      } finally {
        tab.remove();
      }
    }
    const page = await open({ slug: "", docId: "", globalSlug: "settings" });
    try {
      await expect(page.host.querySelector("app-widgets")).not.toBeNull();
    } finally {
      page.remove();
    }
  }),
});

export const SignedOut = meta.story({
  name: "Form, not a tab, when signed out",
  ...on({ tab: "activity", user: null }, async (m) => {
    await expect(m.host.querySelector("demo-activity-tab")).toBeNull();
    await expect(m.host.querySelector("ui-doc-form")).not.toBeNull();
  }),
});

export const TabFromAddress = meta.story({
  name: "Follows its own tab in the address",
  ...on(
    { stateKey: "deal", tile: true },
    async (m) => {
      await expect(m.host.querySelector("demo-activity-tab")).not.toBeNull();
      visit("?deal=plain");
      window.dispatchEvent(new PopStateEvent("popstate"));
      await waitFor(() => expect(m.host.querySelector("demo-activity-tab")).toBeNull());
      visit("?deal[tab][x]=1");
      window.dispatchEvent(new PopStateEvent("popstate"));
      await m.view.updateComplete;
      await expect(m.inner.urlTab).toBe("");
      const spec = await open({ spec: { collection: "deals", id: "d1", tab: "activity" }, tile: true });
      try {
        await expect(spec.host.querySelector("demo-activity-tab")).not.toBeNull();
      } finally {
        spec.remove();
      }
    },
    at("?deal[tab]=activity"),
  ),
});

const HIDE = ["summary", "tabs", "around", "sidebar", "delete", "header"];

export const HiddenParts = meta.story({
  name: "Hides the parts a spec hides",
  ...on({ spec: { collection: "deals", id: "d1", hide: HIDE } }, async (m) => {
    await expect(m.host.querySelector("ui-record-hero, ui-tabs, app-widgets, ui-breadcrumbs")).toBeNull();
    await expect(m.host.querySelector("ui-button[color=error]")).toBeNull();
    await expect(m.host.textContent).not.toContain("Created");
    const tile = await open({ tile: true, spec: { collection: "deals", id: "d1", home: true, hide: HIDE } });
    try {
      await expect(tile.host.querySelector("ui-breadcrumbs, ui-button[color=error]")).toBeNull();
    } finally {
      tile.remove();
    }
    const home = await open({ tile: true, spec: { collection: "deals", id: "d1", home: true } });
    try {
      await expect(home.host.querySelector("ui-breadcrumbs")).not.toBeNull();
    } finally {
      home.remove();
    }
  }),
});

export const HomeNamesThePage = meta.story({
  name: "A home screen names the page with its one heading",
  ...on({ tile: true, spec: { collection: "deals", id: "d1", home: true } }, async (m) => {
    const titles = (host: HTMLElement) => [...host.querySelectorAll("h1")].map((h) => h.textContent!.trim());
    await expect(titles(m.host)).toEqual([hero(m.host).record.title]);
    const views: Setup[] = [
      { tile: true, docId: "", spec: { collection: "deals", id: "create", home: true } },
      { tile: true, spec: { collection: "deals", id: "d1", home: true, hide: ["summary"] } },
      { tile: true, tab: "history", spec: { collection: "deals", id: "d1", home: true } },
      { tile: true, slug: "", docId: "", globalSlug: "settings", spec: { global: "settings", home: true } },
    ];
    for (const s of views) {
      const view = await open(s);
      try {
        await expect(titles(view.host)).toHaveLength(1);
        await expect(view.host.querySelector("h1")).toBeVisible();
      } finally {
        view.remove();
      }
    }
    const plain = await open({ tile: true, spec: { collection: "deals", id: "d1" } });
    try {
      await expect(titles(plain.host)).toEqual([]);
    } finally {
      plain.remove();
    }
  }),
});

export const SaveShortcut = meta.story({
  name: "Saves with Ctrl+S or Cmd+S on the details tab",
  ...on({}, async (m) => {
    const press = (init: KeyboardEventInit) => window.dispatchEvent(new KeyboardEvent("keydown", init));
    press({ key: "a", ctrlKey: true });
    press({ key: "s" });
    await expect(calls(m.d).filter((c) => c.method === "update")).toHaveLength(0);
    press({ key: "S", metaKey: true, cancelable: true });
    press({ key: "s", ctrlKey: true });
    m.view.save();
    await settle(m.view);
    await expect(calls(m.d).filter((c) => c.method === "update")).toHaveLength(1);
    m.view.tab = "activity";
    await m.view.updateComplete;
    press({ key: "s", ctrlKey: true });
    await settle(m.view);
    await expect(calls(m.d).filter((c) => c.method === "update")).toHaveLength(1);
  }),
});

export const LeaveUnchanged = meta.story({
  name: "Lets the page close when nothing changed",
  ...on({}, async () => {
    const leave = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(leave);
    await expect(leave.defaultPrevented).toBe(false);
  }),
});

export const AccountPage = meta.story({
  name: "Account page with a new password",
  ...on(
    {
      slug: "users",
      docId: "u1",
      dashboard: (d) => {
        const update = d.data.update;
        d.data.update = (...args) =>
          (args[2] as { password?: string }).password === "short"
            ? Promise.reject(
                new ApiError(400, [
                  { message: "Invalid", data: { errors: [{ path: "password", message: "Too short." }] } },
                ]),
              )
            : update(...args);
      },
    },
    async (m) => {
      await expect(m.host.querySelector("ui-breadcrumbs")!.textContent).toContain("Account");
      await expect(m.host.querySelector("ui-button[color=error]")).toBeNull();
      const input = m.host.querySelector<HTMLInputElement>("input[type=password]")!;
      input.value = "short";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      m.view.save();
      await settle(m.view);
      await expect(m.host.textContent).toContain("Too short.");
      input.value = "a-much-longer-passphrase";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      m.view.save();
      await settle(m.view);
      const sent = calls(m.d)
        .filter((c) => c.method === "update")
        .at(-1)!.args[2];
      await expect(sent).toMatchObject({ password: "a-much-longer-passphrase" });
    },
    at("/account"),
  ),
});

export const CreateRequired = meta.story({
  name: "Asks for a password and a file when creating",
  ...on({ slug: "users", docId: "" }, async (m) => {
    await expect(m.host.textContent).toContain("Password *");
    const file = await open({ slug: "files", docId: "" });
    try {
      await expect(file.host.textContent).toContain("File *");
      const input = file.host.querySelector("ui-file-input")!;
      const picked = new File(["a,b"], "rates.csv", { type: "text/csv" });
      input.dispatchEvent(new CustomEvent("ui-change", { detail: { files: [picked] } }));
      await expect(file.inner.file).toBe(picked);
      await expect(file.inner.dirty).toBe(true);
      input.dispatchEvent(new CustomEvent("ui-change", { detail: { files: null } }));
      await expect(file.inner.file).toBeNull();
      file.view.save();
      await settle(file.view);
      await expect(file.d.navigations).toEqual([{ to: "/collections/files/doc-1", replace: true }]);
    } finally {
      file.remove();
    }
  }),
});

export const FailedSaveAndDelete = meta.story({
  name: "Reports a failed save or delete",
  ...on(
    {
      dashboard: (d) => {
        d.data.update = () => Promise.reject(new Error("Network down"));
        d.data.delete = () => Promise.reject(new Error("Locked by another user"));
      },
    },
    async (m) => {
      m.view.save();
      await settle(m.view);
      await expect(m.inner.errors).toEqual({});
      m.inner.confirmDelete = true;
      await m.view.updateComplete;
      m.host.querySelector("ui-modal[heading^=Delete]")!.dispatchEvent(new CustomEvent("ui-confirm"));
      await waitFor(() => expect(m.d.notices.length).toBe(2));
      await expect(m.d.notices.map((n) => [n.message, n.tone])).toEqual([
        ["Network down", "error"],
        ["Locked by another user", "error"],
      ]);
      await expect(m.d.navigations).toEqual([]);
    },
  ),
});

let finish = () => {};

export const Saving = meta.story({
  name: "Saving… while a save is on its way",
  ...on(
    {
      tile: true,
      dashboard: (d) => {
        const update = d.data.update;
        d.data.update = (...args) => new Promise((done) => (finish = () => done(update(...args))));
      },
    },
    async (m) => {
      m.view.save();
      await m.view.updateComplete;
      await expect(m.host.querySelector("ui-button[type=submit]")!.textContent).toContain("Saving…");
      m.view.save();
      finish();
      await settle(m.view);
      await expect(calls(m.d).filter((c) => c.method === "update")).toHaveLength(1);
    },
  ),
});

export const NestedChanges = meta.story({
  name: "Ignores changes from nested forms",
  ...on({}, async (m) => {
    const form = m.host.querySelector("ui-doc-form")!;
    form.firstElementChild!.dispatchEvent(
      new CustomEvent("ui-change", { bubbles: true, detail: { path: ["title"], fieldValue: "Nested" } }),
    );
    await expect(m.inner.dirty).toBe(false);
    form.dispatchEvent(new CustomEvent("ui-change", { detail: { path: ["title"], fieldValue: "Direct" } }));
    await expect(m.inner.dirty).toBe(true);
    await expect((m.inner.value as { title: string }).title).toBe("Direct");
  }),
});

export const HostState = meta.story({
  name: "Tells its host what it shows, once per change",
  ...on({ docId: "", embedded: true }, async (m) => {
    const seen: string[] = [];
    m.view.addEventListener("dashboard-doc-state", (e) =>
      seen.push((e as CustomEvent<{ title: string }>).detail.title),
    );
    m.view.requestUpdate();
    await m.view.updateComplete;
    await expect(seen).toEqual([]);
    m.view.docId = "d3";
    await settle(m.view);
    await expect(seen.at(-1)).toBe("Delivery vans");
    const global: string[] = [];
    const g = await open({ slug: "", docId: "", globalSlug: "settings", tile: true });
    try {
      g.view.addEventListener("dashboard-doc-state", (e) =>
        global.push((e as CustomEvent<{ title: string }>).detail.title),
      );
      g.inner.dirty = true;
      await g.view.updateComplete;
      await expect(global).toEqual([""]);
    } finally {
      g.remove();
    }
  }),
});

export const NoStageField = meta.story({
  name: "Skips the stage bar when its field is missing",
  ...on(
    {
      slug: "companies",
      docId: "c1",
      cfg: {
        ...config,
        collections: config.collections.map((c) =>
          c.slug === "companies" ? { ...c, custom: { edit: { steps: { field: "tier" } } } } : c,
        ),
      } as typeof config,
    },
    async (m) => {
      await expect(m.host.querySelector("ui-steps")).toBeNull();
    },
  ),
});

export const EmbeddedNew = meta.story({
  name: "Embeds a new record without a side column",
  ...on({ slug: "companies", docId: "", embedded: true }, async (m) => {
    await expect(m.host.querySelectorAll("ui-doc-form")).toHaveLength(1);
    await expect(m.host.querySelector("ui-record-hero")).toBeNull();
  }),
});

export const SkippedStage = meta.story({
  name: "Skipped stage in a tile",
  ...on({ docId: "d2", tile: true }, async (lost) => {
    const tag = lost.host.querySelector("ui-steps")!.parentElement!.querySelector("ui-tag") as unknown as {
      tone: string;
      textContent: string;
    };
    await expect(tag.textContent).toBe("lost");
    await expect((lost.host.querySelector("ui-steps") as unknown as { tone: string }).tone).toBe("error");
    lost.inner.dirty = true;
    await lost.view.updateComplete;
    await expect(lost.host.textContent).toContain("Unsaved changes");
    lost.host.querySelector<HTMLElement>("ui-button[color=error] button")!.click();
    await lost.view.updateComplete;
    await expect(lost.inner.confirmDelete).toBe(true);
    lost.host.querySelector("form")!.requestSubmit();
    await settle(lost.view);
    await expect(calls(lost.d).filter((c) => c.method === "update")).toHaveLength(1);
    const embedded = await open({ embedded: true });
    try {
      embedded.host.querySelector("form")!.requestSubmit();
      await settle(embedded.view);
      await expect(calls(embedded.d).filter((c) => c.method === "update")).toHaveLength(1);
    } finally {
      embedded.remove();
    }
  }),
});

const deleteOnly: Access = {
  ...fullAccess,
  collections: {
    ...fullAccess.collections,
    deals: { ...fullAccess.collections.deals!, update: { permission: false } },
  },
};

export const TileDeleteOnly = meta.story({
  name: "Delete without save in a tile",
  ...on({ tile: true, access: deleteOnly }, async (m) => {
    await expect(m.host.querySelector("ui-button[color=error]")).not.toBeNull();
    await expect(m.host.querySelector("ui-button[type=submit]")).toBeNull();
    const tab = await open({ tile: true, tab: "history" });
    try {
      await expect(tab.host.querySelector("ui-tabs")).not.toBeNull();
      await expect(tab.host.querySelector("ui-doc-form, ui-alert")).toBeNull();
    } finally {
      tab.remove();
    }
  }),
});
