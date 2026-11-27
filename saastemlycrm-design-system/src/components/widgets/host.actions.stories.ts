import preview from "#.storybook/preview";
import { expect, spyOn } from "storybook/test";
import { m } from "../../lib/i18n/index.ts";
import { frames } from "../../lib/dashboard/tiling.ts";
import { pageOf, user } from "../../../.storybook/fixtures/widgets.ts";
import { boardOf, hostBench, note, type El } from "../../../.storybook/fit/widgets.ts";
import type { AppWidgets } from "./host.ts";
import type { Widget } from "../../lib/widgets/widget.ts";
import "./host.ts";
import { here, visit } from "../../../.storybook/address.ts";

const bench = hostBench();

const meta = preview.meta({
  component: "app-widgets",
  decorators: [bench.decorator],
  beforeEach: bench.setup,
  parameters: { layout: "fullscreen" },
});

const doc: Widget = { document: { collection: "customers", id: "$param.id" }, size: "full" };
const atCustomer = () => visit("/customers/c1?tab=open");

export const ScopeFromAddress = meta.story({
  name: "Scope from the page and the address",
  beforeEach: atCustomer,
  render: () => boardOf({ params: { id: "c1", extra: "1" }, widgets: [doc] }, { params: { more: "2" } }),
  play: async ({ canvasElement }) => {
    const { el } = await bench.ready(canvasElement);
    await expect(el.scope).toMatchObject({
      doc: { id: "c1", slug: "customers" },
      params: { id: "c1", extra: "1", tab: "open", more: "2" },
    });
  },
});

export const ScopeOnCreate = meta.story({
  name: "No document while creating one",
  beforeEach: atCustomer,
  render: () => boardOf({ params: { id: "create" }, widgets: [doc] }),
  play: async ({ canvasElement }) => {
    const { el } = await bench.ready(canvasElement);
    await expect(el.scope.doc).toBeUndefined();
  },
});

export const ScopeOnDocument = meta.story({
  name: "Scope on a document",
  beforeEach: atCustomer,
  render: () => boardOf(pageOf(note("A")), { docId: "t1", slug: "tasks" }),
  play: async ({ canvasElement }) => {
    const { el } = await bench.ready(canvasElement);
    await expect(el.scope.doc).toEqual({ id: "t1", slug: "tasks" });
    await expect(el.scope.user).toBe(user);
    const nobody = document.createElement("app-widgets") as AppWidgets;
    nobody.dashboard = bench.dashboard;
    await expect(nobody.scope.user).toEqual({ id: "" });
  },
});

export const Cache = meta.story({
  name: "Sources cached until reloaded",
  render: () => boardOf(pageOf(note("A"))),
  play: async ({ canvasElement }) => {
    const { el } = await bench.ready(canvasElement);
    const a = el.fetch({ count: "tasks" });
    await expect(el.fetch({ count: "tasks" })).toBe(a);
    const version = el.version;
    el.querySelector("ui-board")!.dispatchEvent(new CustomEvent("app-widgets-reload", { bubbles: true }));
    await expect(el.version).toBe(version + 1);
    await expect(el.fetch({ count: "tasks" })).not.toBe(a);
    await el.refresh();
    await expect(el.version).toBe(version + 2);
  },
});

export const Context = meta.story({
  name: "A context for blocks",
  beforeEach: () => visit("/reports?period=week"),
  render: () => boardOf(pageOf(note("A"))),
  play: async ({ canvasElement }) => {
    const { el } = await bench.ready(canvasElement);
    const ctx = el.ctx;
    await expect(ctx.dashboard).toBe(bench.dashboard);
    await expect(ctx.params).toEqual({ period: "week" });
    void ctx.run({ label: "Open", href: "/x" });
    await expect(bench.dashboard.navigations).toEqual([{ to: "/x", replace: false }]);
    await expect(ctx.params).toEqual({});
    const version = el.version;
    ctx.setParam("period", "month");
    await expect(bench.dashboard.navigations.at(-1)).toEqual({ to: "/x?period=month", replace: true });
    await expect(here()).toEqual({ pathname: "/x", search: "?period=month" });
    await expect(el.version).toBe(version + 1);
    ctx.reload();
    await expect(el.version).toBe(version + 2);
    await expect(ctx.mount("x-unknown-element", {})).toBe(ctx.mount("x-unknown-element", {}));
    const speak = ctx.mount("ui-speak", { text: "Hi" }, "k") as El;
    await expect(ctx.mount("ui-speak", { text: "Again" }, "k")).toBe(speak);
    await expect(speak.text).toBe("Again");
    await expect(ctx.mount("ui-speak", {})).not.toBe(speak);
  },
});

export const RunActions = meta.story({
  name: "Print, follow links and run calls with undo",
  beforeEach: () => {
    bench.make({
      endpoints: {
        "POST /send": () => ({ message: "Sent", undo: { path: "/unsend" } }),
        "POST /unsend": () => ({ message: "Back" }),
        "PATCH /quiet": () => null,
        "POST /plain": () => ({}),
        "POST /fail": () => Promise.reject(new Error("")),
        "DELETE /undo-fail": () => Promise.reject(new Error("Nope")),
        "POST /undo-silent": () => Promise.reject(new Error("")),
        "POST /go": () => ({ href: "/elsewhere" }),
        "POST /stay": () => ({ href: "/reports?x=1" }),
      },
    });
    visit("/reports");
  },
  render: () => boardOf(pageOf(note("A"))),
  play: async ({ canvasElement }) => {
    const { el } = await bench.ready(canvasElement);
    const dashboard = bench.dashboard;
    const print = spyOn(window, "print").mockImplementation(() => undefined);
    void el.run({ label: "Print", print: true });
    await expect(print).toHaveBeenCalled();
    print.mockRestore();
    void el.run({ label: "Open", href: "/collections/$user.id" });
    await expect(dashboard.navigations).toEqual([{ to: "/collections/u1", replace: false }]);
    await el.run({ label: "Nothing" });
    await el.run({ label: "Send", call: { path: "/send" } });
    const sent = dashboard.notices.at(-1)!;
    await expect(sent).toMatchObject({
      message: "Sent",
      tone: "success",
      action: { label: m.widget_undo(), undo: true },
    });
    sent.action!.onClick();
    await frames(3);
    await expect(dashboard.notices.at(-1)).toMatchObject({ message: "Back" });
    await el.run({
      label: "Quiet",
      call: { method: "PATCH", path: "/quiet" },
      undo: { path: "/undo-silent", done: "Undone" },
    });
    dashboard.notices.at(-1)!.action!.onClick();
    await frames(3);
    await expect(dashboard.notices.at(-1)).toMatchObject({ message: m.widget_undo_failed(), tone: "error" });
    await el.run({
      label: "Quiet",
      call: { method: "PATCH", path: "/quiet" },
      undo: { path: "/unsend", done: "Undone" },
    });
    dashboard.notices.at(-1)!.action!.onClick();
    await frames(3);
    await expect(dashboard.notices.at(-1)).toMatchObject({ message: "Undone" });
    await el.run({ label: "Plain", call: { path: "/plain" }, undo: { path: "/plain" } });
    dashboard.notices.at(-1)!.action!.onClick();
    await frames(3);
    await expect(dashboard.notices.at(-1)).toMatchObject({ message: m.widget_undone() });
    await el.run({
      label: "Undo fails",
      call: { path: "/plain" },
      undo: { method: "DELETE", path: "/undo-fail", body: { a: 1 } },
    });
    const failing = dashboard.notices.at(-1)!;
    el.remove();
    failing.action!.onClick();
    await frames(3);
    await expect(dashboard.notices.at(-1)).toMatchObject({ message: "Nope", tone: "error" });
    const count = dashboard.notices.length;
    await el.run({ label: "Silent", call: { path: "/plain" } });
    await expect(dashboard.notices).toHaveLength(count);
    await el.run({ label: "Fail", call: { path: "/fail" } });
    await expect(dashboard.notices.at(-1)).toMatchObject({ message: m.widget_failed(), tone: "error" });
    await el.run({ label: "Go", call: { path: "/go" }, reply: true });
    await expect(dashboard.navigations.at(-1)).toEqual({ to: "/elsewhere", replace: false });
    visit("/reports");
    const version = el.version;
    await el.run({ label: "Stay", call: { path: "/stay" }, reply: true });
    await expect(dashboard.navigations.at(-1)).toEqual({ to: "/reports?x=1", replace: false });
    await expect(el.version).toBe(version + 1);
  },
});

export const Ask = meta.story({
  name: "Ask before running, with fields, prefill, assist and extraction",
  beforeEach: () => {
    bench.make({
      endpoints: {
        "POST /lookup": (body) => ({ city: `City of ${(body as { customer: string }).customer}` }),
        "POST /broken-lookup": () => Promise.reject(new Error("Lookup failed")),
        "POST /save": (body) => ({ message: "Saved", got: body }),
        "POST /refuse": () => Promise.reject(new Error("Refused")),
      },
    });
  },
  render: () => boardOf(pageOf(note("A"))),
  play: async ({ canvasElement }) => {
    const { el } = await bench.ready(canvasElement);
    const modal = () => el.querySelector<El & { open: boolean }>(":scope > ui-modal")!;
    const confirm = async () => {
      modal().dispatchEvent(new CustomEvent("ui-confirm", { cancelable: true }));
      await frames(3);
      await el.updateComplete;
    };
    void el.run({
      label: "Book",
      confirm: { heading: "Book it?", text: "It costs money.", label: "Book now", tone: "error" },
      call: { path: "/save" },
    });
    await el.updateComplete;
    await expect(modal()).toMatchObject({
      open: true,
      heading: "Book it?",
      confirmLabel: "Book now",
      confirmTone: "error",
    });
    await expect(modal().textContent).toContain("It costs money.");
    await confirm();
    await expect(modal().open).toBe(false);
    await expect(bench.calls().filter((c) => c.method === "call")).toHaveLength(1);
    await el.updateComplete;
    void el.run({
      label: "Ship",
      prompt: "Ship where?",
      tone: "error",
      fields: [
        { type: "text", name: "customer", label: "Customer", required: true, defaultValue: "" },
        { type: "text", name: "city", required: true },
        { type: "textarea", name: "notes" },
      ],
      prefill: { when: "customer", into: "city", call: { path: "/lookup" } },
      assist: { field: "notes", tools: "proofread" },
      extract: {
        label: "Read",
        what: "an order",
        fields: [{ id: "who", label: "Who" }],
        into: { who: { field: "customer" }, more: { field: "notes", append: true }, none: { field: "city" } },
      },
      call: { path: "/save", body: { id: 1 } },
    });
    await el.updateComplete;
    await expect(modal()).toMatchObject({ heading: "Ship where?", confirmLabel: "Ship", confirmTone: "error" });
    await confirm();
    await expect(modal().textContent).toContain(m.widget_fill_in({ fields: "Customer and city" }));
    const form = modal().querySelector("ui-doc-form")!;
    form.firstElementChild?.dispatchEvent(new CustomEvent("ui-change", { detail: { value: {} }, bubbles: true }));
    form.dispatchEvent(
      new CustomEvent("ui-change", { detail: { value: { customer: "Harbor", city: "", notes: "" } } }),
    );
    await frames(3);
    await el.updateComplete;
    await expect((form as unknown as El).value).toMatchObject({ customer: "Harbor", city: "City of Harbor" });
    form.dispatchEvent(
      new CustomEvent("ui-change", { detail: { value: { customer: "Harbor", city: "City of Harbor", notes: "" } } }),
    );
    const lastTools = () => [...modal().querySelectorAll<El>("ui-ai-tools")].at(-1)!;
    const tools = lastTools();
    tools.dispatchEvent(new CustomEvent("ui-change", { detail: { value: "Fragile" } }));
    await el.updateComplete;
    await expect(lastTools().value).toBe("Fragile");
    const extract = modal().querySelector("ui-ai-extract")!;
    await expect((extract as unknown as El).placeholder).toBe(m.widget_paste_placeholder());
    extract.dispatchEvent(
      new CustomEvent("ui-select", { detail: { values: { who: "Riverside", more: "Leave at door", none: "" } } }),
    );
    extract.dispatchEvent(new CustomEvent("ui-select", { detail: { values: { more: "Ring twice" } } }));
    await el.updateComplete;
    await confirm();
    const save = bench
      .calls()
      .filter((c) => c.method === "call")
      .at(-1)!;
    await expect(save.args).toEqual([
      "POST",
      "/save",
      { id: 1, customer: "Riverside", city: "City of Harbor", notes: "Fragile\nLeave at door\nRing twice" },
    ]);
    await expect(modal().open).toBe(false);
    void el.run({
      label: "Look",
      fields: [{ type: "text", name: "customer", defaultValue: "Harbor" }],
      prefill: { when: "customer", into: "city", from: "town", call: { path: "/broken-lookup" } },
      call: { path: "/refuse" },
    });
    await frames(3);
    await el.updateComplete;
    await expect(modal().textContent).toContain("Lookup failed");
    await confirm();
    await expect(modal().textContent).toContain("Refused");
    modal().dispatchEvent(new CustomEvent("ui-close"));
    await el.updateComplete;
    void el.run({
      label: "Look",
      fields: [{ type: "text", name: "customer", defaultValue: "Harbor" }],
      prefill: { when: "customer", into: "city", from: "town", call: { path: "/lookup" } },
    });
    void el.run({ label: "Other", fields: [{ type: "text", name: "customer", defaultValue: "Bakery" }] });
    await frames(3);
    await el.updateComplete;
    await expect((modal().querySelector("ui-doc-form") as unknown as El).value).toEqual({ customer: "Bakery" });
    modal().dispatchEvent(new CustomEvent("ui-close"));
    await el.updateComplete;
    modal().dispatchEvent(new CustomEvent("ui-confirm", { cancelable: true }));
    void el.run({
      label: "Blank",
      fields: [{ type: "text", name: "customer" }],
      prefill: { when: "customer", into: "city", call: { path: "/lookup" } },
    });
    await frames(2);
    await expect(bench.calls().filter((c) => c.method === "post")).toHaveLength(3);
  },
});
