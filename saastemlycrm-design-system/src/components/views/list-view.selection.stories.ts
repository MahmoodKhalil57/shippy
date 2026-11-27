import preview from "#.storybook/preview";
import { expect, fn, spyOn, waitFor } from "storybook/test";
import {
  at,
  calls,
  doc,
  fire,
  listPage,
  listRender,
  peek,
  seed,
  settled,
  shown,
  withTasks,
} from "../../../.storybook/fixtures/list-view.ts";
import "./list-view.ts";
import { here } from "../../../.storybook/address.ts";

const meta = preview.meta({
  component: "dashboard-list-view",
  parameters: { layout: "fullscreen" },
  beforeEach: listPage,
  render: listRender(),
});

const button = (root: Element, text: string) =>
  [...root.querySelectorAll("ui-button")].find((b) => b.textContent!.includes(text))!;

export const DeleteSelected = meta.story({
  name: "Deletes the selected rows",
  play: async ({ canvasElement }) => {
    const { view, dashboard } = await shown(canvasElement);
    fire(view.querySelector("ui-table")!, "ui-select", { selected: [0, 2] });
    await view.updateComplete;
    button(view, "Delete 2").click();
    await view.updateComplete;
    await expect(peek(view).confirming).toBe(true);
    const modal = [...view.querySelectorAll("ui-modal")].at(-1)!;
    fire(modal, "ui-close");
    await view.updateComplete;
    await expect(peek(view).confirming).toBe(false);
    fire(modal, "ui-confirm");
    await waitFor(() => expect(dashboard.notices.at(-1)).toMatchObject({ message: "Deleted", tone: "success" }));
    await settled(view);
    await expect(peek(view).result!.totalDocs).toBe(10);
    await expect(calls(dashboard, "deleteMany")[0]!.args).toEqual(["tasks", { id: { in: ["t1", "t3"] } }]);
  },
});

const many = () => {
  const docs = seed();
  const extra = Array.from({ length: 30 }, (_, i) => doc(`m${i}`, { title: `Extra ${i}`, urgent: false }));
  return { docs: { ...docs.docs, tasks: [...docs.docs.tasks!, ...extra] } };
};

export const DeleteAllMatching = meta.story({
  name: "Deletes all matching records by their filter",
  beforeEach: at("k[filters][0][field]=urgent&k[filters][0][operator]=equals&k[filters][0][value]=false&k[limit]=25"),
  render: listRender({ data: many() }),
  play: async ({ canvasElement }) => {
    const { view, dashboard } = await shown(canvasElement);
    fire(view.querySelector("ui-table")!, "ui-select", { selected: [...Array(25).keys()] });
    await view.updateComplete;
    button(view, "Select all 39 matching").click();
    await view.updateComplete;
    await expect(view.textContent).toContain("39 selected");
    const deleteMany = fn(() =>
      Promise.resolve({ docs: [], errors: [{ id: "m1", message: "Locked" }], message: "Some were not deleted" }),
    );
    (dashboard.data as { deleteMany: unknown }).deleteMany = deleteMany;
    fire([...view.querySelectorAll("ui-modal")].at(-1)!, "ui-confirm");
    await waitFor(() =>
      expect(dashboard.notices.at(-1)).toMatchObject({ message: "Some were not deleted", tone: "warning" }),
    );
    await expect(deleteMany.mock.calls[0]).toEqual(["tasks", { urgent: { equals: false } }]);
    await settled(view);
    await expect(peek(view).allMatching).toBe(false);
  },
});

export const DeleteAllFails = meta.story({
  name: "Selects all records unfiltered, and reports a failed delete",
  play: async ({ canvasElement }) => {
    const { view, dashboard } = await shown(canvasElement);
    fire(view.querySelector("ui-table")!, "ui-select", { selected: [...Array(10).keys()] });
    await view.updateComplete;
    button(view, "Select all 12 tasks").click();
    await view.updateComplete;
    dashboard.data.deleteMany = () => Promise.reject(new Error("Not allowed"));
    fire([...view.querySelectorAll("ui-modal")].at(-1)!, "ui-confirm");
    await waitFor(() => expect(dashboard.notices.at(-1)).toMatchObject({ message: "Not allowed", tone: "error" }));
    const spy = fn(() => Promise.resolve({ docs: [], errors: [], message: "Deleted" }));
    (dashboard.data as { deleteMany: unknown }).deleteMany = spy;
    fire(view.querySelector("ui-table")!, "ui-select", { selected: [...Array(10).keys()] });
    await view.updateComplete;
    button(view, "Select all 12 tasks").click();
    await view.updateComplete;
    fire([...view.querySelectorAll("ui-modal")].at(-1)!, "ui-confirm");
    await waitFor(() => expect(spy).toHaveBeenCalledWith("tasks", { id: { exists: true } }));
  },
});

export const ExportCsv = meta.story({
  name: "Exports the shown columns as CSV",
  render: listRender({
    data: withTasks([doc("q1", { title: 'Say "hi", then\nleave' }), doc("q2", { title: "Plain" })]),
    spec: { columns: ["title", "comments"] },
  }),
  play: async ({ canvasElement }) => {
    const urls: string[] = [];
    const blobs: Blob[] = [];
    const create = spyOn(URL, "createObjectURL").mockImplementation((b) => {
      blobs.push(b as Blob);
      urls.push(`blob:${urls.length}`);
      return urls.at(-1)!;
    });
    const revoke = spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    const click = spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    try {
      const { view } = await shown(canvasElement);
      const exporter = button(view, "Export CSV");
      exporter.click();
      await waitFor(() => expect(click).toHaveBeenCalledTimes(1));
      await expect(await blobs[0]!.text()).toBe(
        'Title,Comments\n"Say ""hi"", then\nleave",0 comments\nPlain,0 comments',
      );
      exporter.click();
      await waitFor(() => expect(click).toHaveBeenCalledTimes(2));
      await expect(revoke).toHaveBeenCalledWith("blob:0");
      view.remove();
      await expect(revoke).toHaveBeenLastCalledWith("blob:1");
    } finally {
      create.mockRestore();
      revoke.mockRestore();
      click.mockRestore();
    }
  },
});

export const ColumnPrefs = meta.story({
  name: "Remembers column order, widths, visibility and density",
  play: async ({ canvasElement }) => {
    const { view, dashboard } = await shown(canvasElement);
    const prefs = () => dashboard.stores.preferences.get();
    fire(view.querySelector("ui-table")!, "ui-columns", { order: ["status", "title"], widths: { title: 200 } });
    const only = <T>(o: Record<string, T>) => Object.values(o)[0];
    await expect(only(prefs().listColumnOrder)).toEqual(["status", "title"]);
    await expect(only(prefs().listColumnWidths)).toEqual({ title: 200 });
    await view.updateComplete;
    const picker = view.querySelector("ui-column-picker")!;
    await expect((picker as unknown as { customized: boolean }).customized).toBe(true);
    fire(picker, "ui-change", { hidden: ["notes"], order: ["title", "status"], reset: false });
    await expect(only(prefs().listColumnWidths)).toEqual({ title: 200 });
    fire(picker, "ui-change", { hidden: ["notes"], order: [], reset: true });
    await expect(only(prefs().listColumnWidths)).toEqual({});
    await expect(only(prefs().listColumns)).toEqual(["notes"]);
    fire(picker, "ui-density", { density: "-2" });
    await view.updateComplete;
    await expect(view.querySelector("ui-table")!.getAttribute("density")).toBe("-2");
    dashboard.stores.preferences.set({ theme: "dark" });
    await settled(view);
    await expect(view.querySelectorAll("ui-table")).toHaveLength(1);
  },
});

export const PageColumnPrefs = meta.story({
  name: "Keeps column choices per page off the collection's home",
  render: listRender({ spec: { home: false } }),
  play: async ({ canvasElement }) => {
    const { view, dashboard } = await shown(canvasElement);
    fire(view.querySelector("ui-column-picker")!, "ui-change", { hidden: [], order: [], reset: false });
    await expect(Object.keys(dashboard.stores.preferences.get().listColumns)).toEqual([`tasks@${here().pathname}#k`]);
  },
});

export const SelectTags = meta.story({
  name: "Tags select values by meaning, position or as text",
  render: listRender({
    data: withTasks([
      doc("a", { status: "blocked", priority: "Odd" }),
      doc("b", { status: "", priority: "High" }),
      doc("c", { status: "unknown" }),
    ]),
    spec: { columns: ["title", "status", "priority"] },
  }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    const rows = [...view.querySelectorAll("tbody tr")];
    await expect(rows[0]!.querySelectorAll("ui-tag")).toHaveLength(1);
    await expect(rows[0]!.textContent).toContain("Odd");
    await expect(rows[1]!.querySelectorAll("ui-tag")).toHaveLength(1);
    await expect(rows[2]!.querySelector("ui-tag")!.textContent).toBe("unknown");
  },
});

export const RelatedLinks = meta.story({
  name: "Links the title and related records, with initials",
  render: listRender({
    data: withTasks([doc("a"), doc("b", { owner: null, project: "r1" })]),
    spec: { columns: ["title", "owner", "project", "comments", "amount"] },
  }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    const rows = [...view.querySelectorAll("tbody tr")];
    await expect(rows[0]!.querySelector("a[href='/collections/projects/r1']")).not.toBeNull();
    await expect(rows[1]!.querySelector("a[href='/collections/projects/r1']")).toBeNull();
    await expect(rows[0]!.textContent).toContain("AS");
  },
});
