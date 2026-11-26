import { describe, expect, it } from "vite-plus/test";
import { testDashboard } from "../../../.storybook/dashboard.ts";
import { config, seed, WIDGET_KINDS } from "../../../.storybook/fixtures/widgets.ts";
import * as k from "./kinds.ts";
import { leaves, loadSource } from "./load.ts";
import type { Widget, WidgetScope } from "./widget.ts";

const note = (text: string): Widget => k.text({ title: text, size: "s", format: () => ({ text }) });
const kind = (name: string) => WIDGET_KINDS.find((d) => d.name === name)!.widget;

describe("sources and leaves", () => {
  const scope: WidgetScope = { user: { id: "u1" }, params: {} };

  it("loads every kind of source", async () => {
    const { data } = testDashboard({
      config,
      data: { ...seed(), endpoints: { ...seed().endpoints, "GET /stats": (_, q) => ({ q }) } },
    });
    expect(await loadSource({ endpoint: "/stats", query: { y: "1" } }, scope, data)).toEqual({ q: { y: "1" } });
    expect(await loadSource({ count: "tasks", where: { status: { equals: "open" } } }, scope, data)).toBe(2);
    expect((await loadSource({ find: "tasks", limit: 1 }, scope, data)) as { docs: unknown[] }).toMatchObject({
      totalDocs: 5,
    });
    expect(await loadSource({ global: "settings" }, scope, data)).toMatchObject({ workspaceName: "Main office" });
    expect(await loadSource({ all: { a: { count: "tasks" }, b: { count: "users" } } }, scope, data)).toEqual({
      a: 5,
      b: 2,
    });
    await expect(loadSource({ doc: true }, scope, data)).rejects.toThrow("This widget needs a document.");
    expect(await loadSource({ doc: true }, { ...scope, doc: { id: "t1", slug: "tasks" } }, data)).toMatchObject({
      id: "t1",
    });
  });

  it("flattens grids and splits and drops hidden widgets", () => {
    const { project } = testDashboard({ config, data: seed() });
    const a = note("A");
    const b = note("B");
    const list = leaves(
      [{ grid: [a, { split: { main: [b], side: [kind("list")] } }] }, { ...a, visible: () => false } as Widget],
      scope,
      project,
    );
    expect(list.map((w) => w.title)).toEqual(["A", "B", "Tasks due soon"]);
    expect(list[2]!.render).toBeTypeOf("function");
  });
});
