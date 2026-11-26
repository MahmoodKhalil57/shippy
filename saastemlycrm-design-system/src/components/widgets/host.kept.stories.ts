import preview from "#.storybook/preview";
import { expect } from "storybook/test";
import { ApiError } from "../../lib/api/errors.ts";
import { m } from "../../lib/i18n/index.ts";
import { config, homePage, pageOf, reportsPage } from "../../../.storybook/fixtures/widgets.ts";
import {
  arrangeOf,
  boardOf,
  handleOf,
  hostBench,
  keysOf,
  note,
  settle,
  tileOf,
  withView,
  type El,
} from "../../../.storybook/fit/widgets.ts";
import * as k from "../../lib/widgets/kinds.ts";
import { widgets, type Widget, type WidgetPage } from "../../lib/widgets/widget.ts";
import "./host.ts";

const bench = hostBench();
const board = () => bench.boards();
const keep = (added: { view: string; key: string; item?: string }[]) =>
  bench.dashboard.stores.preferences.set({ boards: { home: { added } } });

const meta = preview.meta({
  component: "app-widgets",
  decorators: [bench.decorator],
  beforeEach: bench.setup,
  parameters: { layout: "fullscreen" },
});

export const KeptSmall = meta.story({
  name: "Widgets kept from other screens as small tiles",
  beforeEach: () =>
    keep([
      { view: "reports", key: "0" },
      { view: "reports", key: "1" },
      { view: "dashboard", key: "0", item: "Overdue invoices" },
      { view: "reports", key: "9" },
      { view: "missing", key: "0" },
    ]),
  render: () => boardOf(pageOf(note("Mine")), { board: "home" }),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    await expect(keysOf(host)).toEqual(["0", "pin:reports/0", "pin:reports/1", "pin:dashboard/0:Overdue invoices"]);
    await expect(tileOf(host, "pin:reports/0").querySelector<El>("ui-stat")!.mini).toBe(true);
    await expect(tileOf(host, "pin:reports/1").querySelector("ui-list")).toBeTruthy();
    await expect(tileOf(host, "pin:dashboard/0:Overdue invoices").querySelector<El>("ui-stat")!.label).toBe(
      "Overdue invoices",
    );
    handleOf(host, "pin:reports/1").dispatchEvent(new CustomEvent("ui-hide", { bubbles: true }));
    await settle(host);
    await expect(board().home!.added).toHaveLength(4);
    await expect(board().home!.hidden).toBeUndefined();
  },
});

const quiet: WidgetPage = pageOf(k.ask({ title: "Ask", size: "m", format: () => ({ endpoint: "/ask" }) }));

export const KeptLink = meta.story({
  name: "A kept widget with nothing small links to its screen",
  beforeEach: () => {
    bench.make({}, withView({ help: { Component: widgets(quiet), path: "/help" } }));
    keep([{ view: "help", key: "0" }]);
  },
  render: () => boardOf(pageOf(), { board: "home" }),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    const link = tileOf(host, "pin:help/0").querySelector<El>("ui-list-item")!;
    await expect(link.href).toBe("/help");
    await expect(link.headline).toBe(m.widget_mini_open({ label: "Ask" }));
  },
});

const atReports = () => history.replaceState(null, "", "/reports");

export const KeepableReports = meta.story({
  name: "Tiles that can be kept elsewhere",
  beforeEach: atReports,
  render: () => boardOf(reportsPage, { board: "" }),
  play: async ({ canvasElement }) => {
    const { el } = await bench.ready(canvasElement);
    await expect(el.pinRefOf("0")).toEqual({ view: "reports", key: "0", item: undefined });
    await expect(el.pinRefOf("header")).toBeUndefined();
    await expect(el.pinRefOf("nope")).toBeUndefined();
  },
});

export const KeepableHome = meta.story({
  name: "Items of a home tile that can be kept elsewhere",
  beforeEach: atReports,
  render: () => boardOf(homePage, { board: "" }),
  play: async ({ canvasElement }) => {
    const { el } = await bench.ready(canvasElement);
    await expect(el.pinRefOf("0")).toEqual({ view: "dashboard", key: "0", item: "Overdue invoices" });
  },
});

const customer = config.admin!.components!.views!.customer!.Component as unknown as {
  clientProps: { page: WidgetPage };
};

export const NotKeepable = meta.story({
  name: "Tiles that cannot be kept elsewhere",
  beforeEach: atReports,
  render: () => boardOf(homePage, { board: "x" }),
  play: async ({ canvasElement }) => {
    const { el } = await bench.ready(canvasElement);
    await expect(el.pinRefOf("0")).toBeUndefined();
    await expect((await bench.show(homePage, { board: "", docId: "d" })).el.pinRefOf("0")).toBeUndefined();
    const other = await bench.show(pageOf(note("A"), { collection: { collection: "tasks" }, size: "full" }), {
      board: "",
    });
    await expect(other.el.pinRefOf("0")).toBeUndefined();
    await expect(other.el.pinRefOf("1")).toBeUndefined();
    const withParams = await bench.show(customer.clientProps.page, { board: "" });
    await expect(withParams.el.pinRefOf("0")).toBeUndefined();
  },
});

const nested: WidgetPage = pageOf(
  { grid: [note("G0"), note("G1")] },
  { split: { main: [note("Main")], side: [note("Side")] } },
  { collection: { collection: "customers" }, size: "full" },
  { document: { collection: "customers", id: "c1" }, size: "full" },
);

export const KeptNested = meta.story({
  name: "Kept widgets inside grids, splits and around lists",
  beforeEach: () => {
    bench.make({}, withView({ deep: { Component: widgets(nested), path: "/deep" } }));
    keep(["0.1", "1.m0", "1.s0", "2.b0", "2.a0", "3.b0", "9.0", "0.9.1"].map((key) => ({ view: "deep", key })));
  },
  render: () => boardOf(pageOf(), { board: "home" }),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    await expect(keysOf(host).filter((x) => x.startsWith("pin:"))).toEqual([
      "pin:deep/0.1",
      "pin:deep/1.m0",
      "pin:deep/1.s0",
      "pin:deep/2.b0",
      "pin:deep/2.a0",
      "pin:deep/3.b0",
    ]);
    await expect(tileOf(host, "pin:deep/2.a0").textContent).toContain("After the list");
  },
});

const slotted = k.stats.each<null, string>({
  size: "s",
  tiles: 1,
  empty: { heading: "None" },
  data: k.query.endpoint("/no"),
  items: () => [],
  key: (x) => x,
  title: () => "",
  format: () => null,
});
const slotPage = pageOf({ ...slotted, each: { ...slotted.each!, slots: () => ["east", "west"] } } as Widget);
const countsPage = pageOf({ size: "s", counts: { collection: "tasks", field: "status" } });
const slotViews = withView({
  slots: { Component: widgets(slotPage), path: "/slots" },
  counts: { Component: widgets(countsPage), path: "/counts" },
});
const refuse = { endpoints: { "GET /no": () => Promise.reject(new ApiError(403, [])) } };

export const SlotNames = meta.story({
  name: "Slots named while loading or refused",
  beforeEach: () => {
    bench.make(refuse, slotViews);
  },
  render: () => boardOf(slotPage),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    await expect(arrangeOf(host, "0").arrange.label).toBe("east");
    await expect(arrangeOf(host, "0:west").arrange.label).toBe("west");
  },
});

export const KeptItems = meta.story({
  name: "One item of a kept widget",
  beforeEach: () => {
    bench.make(refuse, slotViews);
    keep([
      { view: "slots", key: "0", item: "west" },
      { view: "counts", key: "0", item: "In progress" },
    ]);
  },
  render: () => boardOf(pageOf(), { board: "home" }),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    await expect(keysOf(host)).toEqual(["pin:slots/0:west", "pin:counts/0:In progress"]);
    await expect(tileOf(host, "pin:counts/0:In progress").querySelector<El>("ui-stat")!.label).toBe("In progress");
  },
});

const untitled: WidgetPage = pageOf(k.ask({ size: "m", format: () => ({ endpoint: "/ask" }) }));

export const MissingScreens = meta.story({
  name: "A missing settings screen and an untitled kept widget",
  beforeEach: () => {
    bench.make({}, withView({ help: { Component: widgets(untitled), path: "/help" } }));
    keep([{ view: "help", key: "0" }]);
  },
  render: () => boardOf(pageOf({ global: { global: "gone" }, size: "full" }), { board: "home" }),
  play: async ({ canvasElement }) => {
    const { host } = await bench.ready(canvasElement);
    await expect(tileOf(host, "0").querySelector<El>("ui-tile")!.heading).toBe("gone");
    await expect(tileOf(host, "pin:help/0").querySelector<El>("ui-list-item")!.headline).toBe(
      m.widget_mini_open({ label: m.widget_host_its_screen() }),
    );
  },
});
