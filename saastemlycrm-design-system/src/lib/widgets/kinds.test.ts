import { describe, expect, it } from "vite-plus/test";
import * as k from "./kinds.ts";
import type { WidgetScope } from "./widget.ts";

const scope: WidgetScope = { user: { id: "u1" }, params: {} };

describe("query", () => {
  it("builds every source", () => {
    expect(k.query.endpoint("/stats")).toEqual({ endpoint: "/stats" });
    expect(k.query.endpoint("/stats", { year: "2026" })).toEqual({ endpoint: "/stats", query: { year: "2026" } });
    expect(k.query.find("invoices")).toEqual({ find: "invoices" });
    expect(k.query.find("invoices", { limit: 3 })).toEqual({ find: "invoices", limit: 3 });
    expect(k.query.count("invoices")).toEqual({ count: "invoices" });
    expect(k.query.count("invoices", { where: { a: 1 } })).toEqual({ count: "invoices", where: { a: 1 } });
    expect(k.query.doc()).toEqual({ doc: true });
    expect(k.query.doc({ depth: 2 })).toEqual({ doc: true, depth: 2 });
    expect(k.query.global("settings")).toEqual({ global: "settings" });
    expect(k.query.global("settings", { depth: 0 })).toEqual({ global: "settings", depth: 0 });
    expect(k.query.all({ a: k.query.doc() })).toEqual({ all: { a: { doc: true } } });
  });
});

describe("kind", () => {
  it("draws its block with the slots around it", () => {
    const w = k.list<{ n: number }>({
      title: "Tasks",
      size: "s",
      data: k.query.endpoint<{ n: number }>("/tasks"),
      format: (d) => ({
        items: [{ headline: `Task ${d.n}` }],
        note: "Due this week",
        tags: [{ label: "Urgent" }],
        choice: { param: "p", label: "Period", value: "w", options: [] },
        alerts: [{ text: "One is late", tone: "warning" }],
        actions: [{ label: "Add" }],
        head: { count: 1 },
      }),
    });
    expect(w.source).toEqual({ endpoint: "/tasks" });
    expect(w.head!({ n: 1 }, scope)).toEqual({ count: 1 });
    expect(w.render!({ n: 1 }, scope)).toEqual([
      { type: "text", text: "Due this week", muted: true },
      { type: "tags", items: [{ label: "Urgent" }] },
      { type: "choice", param: "p", label: "Period", value: "w", options: [] },
      { type: "alert", text: "One is late", tone: "warning" },
      { type: "list", items: [{ headline: "Task 1" }] },
      { type: "actions", items: [{ label: "Add" }] },
    ]);
  });

  it("draws nothing when the format has nothing", () => {
    const w = k.text({ size: "s", format: () => null });
    expect(w.render!(undefined as never, scope)).toBeNull();
    expect(w.head!(undefined as never, scope)).toEqual({});
    const two = k.text({
      size: "s",
      format: () => ({ text: "Hi", choice: [{ param: "a", label: "A", value: "1", options: [] }], tags: [] }),
    });
    expect(two.render!(undefined as never, scope)).toEqual([
      { type: "choice", param: "a", label: "A", value: "1", options: [] },
      { type: "text", text: "Hi" },
    ]);
  });

  it("makes one tile per item", () => {
    const w = k.stats.each<string[], string>({
      size: "s",
      tiles: 2,
      empty: { heading: "None" },
      items: (d) => d,
      key: (x) => x,
      title: (x) => x,
      subhead: (x) => `${x}!`,
      format: (x) => (x === "skip" ? null : { items: [{ label: x, value: "1" }], head: { count: 2 } }),
    });
    const e = w.each!;
    expect(e.subhead!("a", [], scope)).toBe("a!");
    expect(e.head!("a", [], scope)).toEqual({ count: 2 });
    expect(e.head!("skip", [], scope)).toEqual({});
    expect(e.render("a", [], scope)).toEqual([{ type: "stats", items: [{ label: "a", value: "1" }] }]);
    expect(e.render("skip", [], scope)).toBeNull();
  });

  it("names every block kind", () => {
    for (const [name, make] of Object.entries(k))
      if (typeof make === "function" && "each" in make) {
        const w = (make as ReturnType<typeof k.kind>)({ size: "s", format: () => ({}) as never });
        expect((w.render!(undefined as never, scope) as { type: string }[]).at(-1)!.type).toBe(name);
      }
  });
});

describe("assists and header", () => {
  it("draws assist elements with their slots", () => {
    const w = k.assists({
      size: "s",
      format: () => ({ items: [{ element: "ui-speak", key: "s", props: { text: "Hi" } }], note: "Read aloud" }),
    });
    expect(w.render!(undefined as never, scope)).toEqual([
      { type: "text", text: "Read aloud", muted: true },
      { type: "custom", element: "ui-speak", key: "s", props: { text: "Hi" } },
    ]);
    expect(w.head!(undefined as never, scope)).toEqual({});
    const none = k.assists({ size: "s", format: () => ({ items: [], head: { count: 1 } }) });
    expect(none.render!(undefined as never, scope)).toBeNull();
    expect(none.head!(undefined as never, scope)).toEqual({ count: 1 });
    expect(k.assists({ size: "s", format: () => null }).render!(undefined as never, scope)).toBeNull();
  });

  it("builds a header from data", () => {
    const h = k.header<{ name: string }>({
      data: k.query.doc(),
      rows: 3,
      format: (d) => ({ heading: d.name }),
    });
    expect(h).toMatchObject({ source: { doc: true }, rows: 3 });
    expect("render" in h && h.render({ name: "Harbor" }, scope)).toEqual({ heading: "Harbor" });
  });
});
