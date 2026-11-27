import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import { ApiError } from "../../lib/api/errors.ts";
import { m } from "../../lib/i18n/index.ts";
import { frames } from "../../lib/dashboard/tiling.ts";
import { tileW } from "../../lib/base/tiles.ts";
import { pageOf } from "../../../.storybook/fixtures/widgets.ts";
import {
  arrangeOf,
  boardOf,
  buttonOf,
  hostBench,
  itemsOf,
  keysOf,
  note,
  settle,
  tileOf,
  wide,
  type El,
} from "../../../.storybook/fit/widgets.ts";
import * as k from "../../lib/widgets/kinds.ts";
import type { AppWidgets } from "./host.ts";
import type { Widget, WidgetPage } from "../../lib/widgets/widget.ts";
import "./host.ts";

const bench = hostBench();

const meta = preview.meta({
  component: "app-widgets",
  decorators: [bench.decorator],
  beforeEach: bench.setup,
  parameters: { layout: "fullscreen" },
});

const states: WidgetPage = {
  header: {
    heading: "Accounts",
    eyebrow: "Finance",
    subtitle: "This month",
    tags: [{ label: "Live" }],
    actions: [{ label: "Export", href: "/export" }],
    summary: { label: "Summary", context: "c", text: "t" },
  },
  widgets: [
    k.list({
      title: "Open",
      subhead: "Today",
      size: "s",
      emphasis: "tinted",
      data: k.query.endpoint<{ n: number }>("/slow"),
      format: (d) => ({
        items: [{ headline: `Item ${d.n}` }],
        head: {
          count: 2,
          countTone: "error",
          tags: [{ label: "Hot" }],
          actions: [{ label: "All", href: "/all" }],
          subhead: "Updated now",
        },
      }),
    }),
    {
      ...k.text({ title: "Empty", size: "s", format: () => ({ text: "x" }) }),
      empty: { when: () => true, heading: "Nothing", description: "Add one" },
    } as Widget,
    k.text({ title: "Broken", size: "s", data: k.query.endpoint("/missing"), format: () => ({ text: "x" }) }),
    k.text({
      title: "Private",
      size: "s",
      data: k.query.endpoint("/denied"),
      denied: "Ask an admin",
      format: () => ({ text: "x" }),
    }),
    k.text({ title: "Hidden", size: "s", data: k.query.endpoint("/denied"), format: () => ({ text: "x" }) }),
    k.text({ size: "s", emphasis: "inverse", format: () => ({ text: "Untitled" }) }),
  ],
};

export const EveryState = meta.story({
  name: "A header and every state of a widget",
  beforeEach: () => {
    bench.make({
      endpoints: {
        "GET /denied": () => Promise.reject(new ApiError(403, [{ message: "Forbidden" }])),
        "GET /slow": () => ({ n: 1 }),
      },
    });
  },
  render: () => boardOf(states),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    await expect(keysOf(host)).toEqual(["header", "0", "1", "2", "3", "4", "5"]);
    await expect(tileOf(host, "header").querySelector("app-arrange")).toBeNull();
    const header = tileOf(host, "header").querySelector<El>("ui-page-header")!;
    await expect(header).toMatchObject({ heading: "Accounts", eyebrow: "Finance", subtitle: "This month" });
    await expect(header.querySelector("ui-ai-summary")).toBeTruthy();
    const open = tileOf(host, "0").querySelector<El>("ui-tile")!;
    await expect(open).toMatchObject({
      heading: "Open",
      subhead: "Updated now",
      count: 2,
      countTone: "error",
      emphasis: "tinted",
    });
    await expect(open.textContent).toContain("Hot");
    await expect(tileOf(host, "1").querySelector<El>("ui-empty-state")!.heading).toBe("Nothing");
    await expect(tileOf(host, "2").textContent).toContain("Not Found");
    await expect(tileOf(host, "2").querySelector<El>("ui-alert")!.heading).toBe(m.widget_load_failed());
    await expect(tileOf(host, "3").textContent).toContain("Ask an admin");
    await expect(tileOf(host, "4").textContent).toContain(m.widget_denied());
    await expect(tileOf(host, "5").querySelector<El>("ui-tile")).toMatchObject({
      bare: true,
      emphasis: undefined,
      heading: "",
    });
  },
});

const dataHeader = k.header<{ workspaceName: string }>({
  data: k.query.global("settings"),
  rows: 3,
  format: (s) => ({ heading: s.workspaceName }),
});

export const HeaderFromData = meta.story({
  name: "A header drawn from data with its own height",
  render: () => boardOf({ header: dataHeader, widgets: [note("A")] }),
  play: async ({ canvasElement }) => {
    const { host, el } = await bench.ready(canvasElement);
    await expect(tileOf(host, "header").querySelector<El>("ui-page-header")!.heading).toBe("Main office");
    await expect(itemsOf(el)).toEqual(expect.arrayContaining([expect.objectContaining({ key: "header", rows: 3 })]));
  },
});

export const HeaderRows = meta.story({
  name: "A header sized by the page",
  render: () => boardOf({ header: dataHeader, headerRows: 4, widgets: [] }),
  play: async ({ canvasElement }) => {
    const { el } = await bench.ready(canvasElement);
    await expect(itemsOf(el)[0]!.rows).toBe(4);
  },
});

export const FixedHeader = meta.story({
  name: "A fixed header",
  render: () => boardOf({ header: { heading: "Fixed" }, widgets: [] }),
  play: async ({ canvasElement }) => {
    const { el } = await bench.ready(canvasElement);
    await expect(itemsOf(el)[0]!.rows).toBe(2);
  },
});

export const HeaderOnDocument = meta.story({
  name: "No header on a document",
  render: () => boardOf({ header: dataHeader, widgets: [note("A")] }, { docId: "t1", slug: "tasks" }),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    await expect(keysOf(host)).toEqual(["0"]);
  },
});

let release: () => void = () => undefined;
let gate: Promise<void> = Promise.resolve();
let failNext = false;
const hold = () => {
  gate = new Promise<void>((r) => (release = r));
};

const later = k.stats.each<{ n: number }, number>({
  size: "s",
  tiles: 2,
  empty: { heading: "None" },
  data: k.query.endpoint("/later"),
  items: (d) => [d.n],
  key: String,
  title: () => "",
  subhead: () => "sub",
  format: (n) => ({ items: [{ label: "Count", value: String(n), share: { value: 0.5 } }] }),
});
const heldHeader = k.header<{ title: string }>({
  data: k.query.endpoint("/hold"),
  format: (d) => ({ heading: d.title }),
});

export const Loading = meta.story({
  name: "Loading until the data comes",
  beforeEach: () => {
    hold();
    bench.make({
      endpoints: {
        "GET /later": async () => (await gate, { n: 3 }),
        "GET /hold": async () => (await gate, { title: "Held" }),
      },
    });
  },
  render: () =>
    wide(
      html`<app-widgets
        board="later"
        .page=${{ header: heldHeader, widgets: [later, { ...later, title: "Titled" }, note("Now")] }}
      ></app-widgets>`,
    ),
  play: async ({ canvasElement }) => {
    const host = canvasElement;
    await frames(2);
    await waitFor(() => expect(host.querySelector("ui-page-header[loading]")).toBeTruthy());
    await expect(tileOf(host, "0").querySelector<El>("ui-tile")).toMatchObject({
      loading: true,
      bare: true,
      subhead: " ",
    });
    await expect(tileOf(host, "1").querySelector<El>("ui-tile")).toMatchObject({ loading: true, heading: "Titled" });
    release();
    await settle(host);
    await expect(tileOf(host, "header").querySelector<El>("ui-page-header")!.heading).toBe("Held");
    await expect(keysOf(host)).toEqual(["header", "0", "0:2", "1", "1:2", "2"]);
  },
});

const named = k.stats.each<null, string>({
  size: "s",
  tiles: 1,
  empty: { heading: "None" },
  items: () => ["one"],
  key: (x) => x,
  title: () => "",
  format: (x) => ({ items: [{ label: x, value: "1", share: { value: 1 } }] }),
});
const slots = { ...named, each: { ...named.each!, slots: () => ["north"], name: (s: string) => `${s} region` } };
const refused = k.stats.each({
  ...named,
  tiles: 2,
  data: k.query.endpoint("/no"),
  denied: "Not yours",
  items: () => [],
} as never);

export const NamedAndRefused = meta.story({
  name: "Named tiles and refused items",
  beforeEach: () => {
    bench.make({ endpoints: { "GET /no": () => Promise.reject(new ApiError(403, [])) } });
  },
  render: () =>
    boardOf(
      pageOf(
        named,
        slots as Widget,
        refused,
        { ...refused, title: "Titled" } as Widget,
        { ...slots, source: k.query.endpoint("/no") } as Widget,
      ),
    ),
  play: async ({ canvasElement }) => {
    const { host, el } = await bench.ready(canvasElement);
    await expect(keysOf(host)).toEqual(["0", "1", "2", "2:2", "3", "3:2", "4"]);
    await expect(tileOf(host, "2").textContent).toContain("Not yours");
    await expect(tileOf(host, "3").querySelector<El>("ui-tile")!.heading).toBe("Titled");
    await expect(itemsOf(el).map((i) => i.key)).toContain("4");
    await expect(arrangeOf(host, "1").arrange.label).toBe("north region");
    await expect(arrangeOf(host, "4").arrange.label).toBe("north region");
    await expect(arrangeOf(host, "0").arrange.label).toBe("1");
  },
});

const access = { canAccessAdmin: true, collections: {}, globals: {} };

export const Screens = meta.story({
  name: "List, document and settings screens as tiles",
  render: () =>
    boardOf(
      pageOf(
        { collection: { collection: "customers", key: "people" }, size: "full" },
        { collection: { collection: "invoices", home: true, hide: ["header"] }, size: "full" },
        { collection: { collection: "tasks", hide: ["all"] }, size: "full", title: "Work" },
        { collection: { collection: "missing", hide: ["around"] }, size: "full" },
        { document: { collection: "customers", id: "c1" }, size: "full" },
        { document: { collection: "tasks", id: "create", home: true }, size: "full" },
        { global: { global: "settings", key: "s" }, size: "full" },
        { global: { global: "missing", home: true }, size: "full", title: "Other" },
        { global: { global: "settings", hide: ["around", "header"] }, size: "full" },
      ),
      { access },
    ),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    await expect(keysOf(host)).toEqual(["0.b0", "0", "0.a0", "1", "2", "3", "4.b0", "4", "5", "6.b0", "6", "7", "8"]);
    const list = tileOf(host, "0").querySelector<El>("dashboard-list-view")!;
    await expect(list).toMatchObject({ slug: "customers", stateKey: "people", access });
    await expect(tileOf(host, "0").querySelector<El>("ui-tile")!.heading).toBe("Customers");
    await expect(buttonOf(tileOf(host, "0"), m.widget_host_all())!.getAttribute("href")).toBe("/collections/customers");
    list.dispatchEvent(new CustomEvent("dashboard-list-count", { detail: { count: 4 } }));
    await settle(host);
    await expect(tileOf(host, "0").querySelector<El>("ui-tile")!.count).toBe(4);
    await expect(tileOf(host, "1").querySelector<El>("ui-tile")).toMatchObject({ bare: true, heading: "" });
    await expect(buttonOf(tileOf(host, "2"), m.widget_host_all())).toBeUndefined();
    await expect(tileOf(host, "2").querySelector<El>("ui-tile")!.heading).toBe("Work");
    await expect(tileOf(host, "3").querySelector<El>("ui-tile")!.heading).toBe("missing");
    const docView = tileOf(host, "4").querySelector<El>("dashboard-edit-view")!;
    await expect(docView).toMatchObject({ slug: "customers", docId: "c1", stateKey: "customers" });
    docView.dispatchEvent(new CustomEvent("dashboard-doc-state", { detail: { title: "Harbor Logistics" } }));
    await settle(host);
    await expect(tileOf(host, "4").querySelector<El>("ui-tile")!.heading).toBe("Harbor Logistics");
    await expect(tileOf(host, "5").querySelector<El>("dashboard-edit-view")!.docId).toBe("");
    await expect(tileOf(host, "6").querySelector<El>("ui-tile")!.heading).toBe("Workspace settings");
    await expect(tileOf(host, "6").querySelector<El>("dashboard-edit-view")).toMatchObject({
      globalSlug: "settings",
      stateKey: "s",
    });
    await expect(tileOf(host, "7").querySelector<El>("ui-tile")!.heading).toBe("Other");
    await expect(tileOf(host, "7").querySelector<El>("dashboard-edit-view")!.stateKey).toBe("missing");
    await expect(tileOf(host, "8").querySelector<El>("ui-tile")!.bare).toBe(true);
  },
});

export const HomeTileNamesThePage = meta.story({
  name: "The home tile names the page",
  render: () =>
    boardOf(
      pageOf(
        { collection: { collection: "invoices", home: true }, size: "full" },
        { collection: { collection: "customers" }, size: "full" },
      ),
      { access },
    ),
  play: async ({ canvasElement }) => {
    await bench.ready(canvasElement);
    const h1 = [...canvasElement.querySelectorAll("h1")].map((h) => h.textContent!.trim());
    await expect(h1).toEqual(["Invoices"]);
    await expect([...canvasElement.querySelectorAll("ui-tile h2")].map((h) => h.textContent!.trim())).toContain(
      "Customers",
    );
  },
});

const split: Widget = {
  split: {
    main: [{ document: { collection: "customers", id: "c1", hide: ["around"] } } as Widget],
    side: [{ ...note("Side"), size: undefined } as unknown as Widget],
  },
};

export const GridsAndSplits = meta.story({
  name: "Grids, splits and hidden widgets",
  render: () =>
    boardOf(
      pageOf(
        { grid: [note("G0"), { ...note("Gone"), visible: () => false } as Widget] },
        split,
        { visible: () => false, grid: [note("Never")] },
        { title: "Quiet", size: "s", render: () => null },
        { title: "By status", size: "m", breakdown: { collection: "invoices", by: "status", as: "table" } },
        { title: "Counted", size: "s", counts: { collection: "tasks", field: "status" } },
        { ...note("No size"), size: undefined } as unknown as Widget,
        { document: { collection: "tasks", id: "t1" } } as Widget,
      ),
    ),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    await expect(keysOf(host)).toEqual(["0.0", "1.m0", "1.s0", "3", "4", "5", "5:In progress", "5:Done", "6", "7"]);
    await expect(tileOf(host, "7").getAttribute("data-size")).toBe("full");
    await expect(tileOf(host, "1.m0").getAttribute("data-size")).toBe("l");
    await expect(tileOf(host, "1.s0").getAttribute("data-size")).toBe("s");
    await expect(tileOf(host, "6").getAttribute("data-size")).toBe("s");
    await expect(tileOf(host, "3").querySelector("ui-tile")!.textContent!.trim()).toBe("Quiet");
    await expect(arrangeOf(host, "4").arrange.bounds).toMatchObject({ minSpan: 8 });
    await expect(tileOf(host, "5").querySelector<El>("ui-stat")!.label).toBe("Open");
  },
});

const gated = k.text({ title: "Gated", size: "s", data: k.query.endpoint("/gate"), format: () => ({ text: "Ready" }) });

export const Reloading = meta.story({
  name: "Reloading keeps what it shows and drops late answers",
  beforeEach: () => {
    hold();
    failNext = false;
    bench.make({
      endpoints: {
        "GET /gate": async () => {
          await gate;
          if (failNext) throw new Error("Late failure");
          return { n: 1 };
        },
      },
    });
  },
  render: () => wide(html`<app-widgets board="g" .page=${pageOf(gated)}></app-widgets>`, 12 * tileW()),
  play: async ({ canvasElement }) => {
    const host = canvasElement;
    const el = host.querySelector<AppWidgets>("app-widgets")!;
    await frames(2);
    el.reload();
    await frames(2);
    release();
    await settle(host);
    await expect(tileOf(host, "0").textContent).toContain("Ready");
    hold();
    failNext = true;
    el.reload();
    await frames(2);
    el.reload();
    await frames(2);
    release();
    await settle(host);
    await expect(tileOf(host, "0").textContent).toContain("Late failure");
    failNext = false;
    gate = Promise.resolve();
    el.reload();
    await settle(host);
    await expect(tileOf(host, "0").textContent).toContain("Ready");
  },
});

let fired = false;
const first = k.text({
  title: "First",
  size: "s",
  data: k.query.endpoint("/both"),
  format: () => {
    if (!fired) {
      fired = true;
      document.querySelector<AppWidgets>("app-widgets[board=draw]")!.reload();
    }
    return { text: "One" };
  },
});
const second = k.text({
  title: "Second",
  size: "s",
  data: k.query.endpoint("/both", { b: "1" }),
  format: () => ({ text: "Two" }),
});

export const Superseded = meta.story({
  name: "A draw replaced by a newer load",
  beforeEach: () => {
    hold();
    fired = false;
    bench.make({ endpoints: { "GET /both": async () => (await gate, { n: 1 }) } });
  },
  render: () => wide(html`<app-widgets board="draw" .page=${pageOf(first, second)}></app-widgets>`, 12 * tileW()),
  play: async ({ canvasElement }) => {
    const host = canvasElement;
    await frames(2);
    release();
    await settle(host);
    await expect(tileOf(host, "1").textContent).toContain("Two");
  },
});
