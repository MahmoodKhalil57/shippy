import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn, waitFor } from "storybook/test";
import { testDashboard, withDashboard, type TestDashboard } from "../../../.storybook/dashboard.ts";
import { ApiError } from "../../lib/api/errors.ts";
import type { Access } from "../../lib/dashboard/context.ts";
import "./edit-view.ts";
import { config, data, fullAccess, maya, readOnlyAccess, seedUsers } from "../../../.storybook/fixtures/views.ts";

interface Args {
  slug: string;
  docId: string;
  globalSlug: string;
  tab: string;
  access: Access;
  embedded: boolean;
  tile: boolean;
  onSaved: (e: Event) => void;
}

const make = (extra?: (d: TestDashboard) => void) => () => {
  const d = testDashboard({ config, seedUsers, data: data() });
  extra?.(d);
  return d;
};
const dashboardOf = (el: HTMLElement) =>
  (el.querySelector("dashboard-edit-view")!.closest("dashboard-provider") as unknown as { dashboard: TestDashboard })
    .dashboard;
const loaded = (el: HTMLElement) =>
  waitFor(async () => {
    const view = el.querySelector("dashboard-edit-view")!;
    await expect(view.querySelector("ui-doc-form, ui-alert, demo-activity-tab")).not.toBeNull();
    await expect(view.querySelector(":scope > ui-empty-state[loading]")).toBeNull();
  });

const meta = preview.meta({
  title: "Views/Edit view",
  component: "dashboard-edit-view",
  decorators: [withDashboard(make())],
  parameters: { layout: "fullscreen" },
  args: {
    slug: "deals",
    docId: "d1",
    globalSlug: "",
    tab: "",
    access: fullAccess,
    embedded: false,
    tile: false,
    onSaved: fn(),
  },
  argTypes: {
    slug: { control: "select", options: ["deals", "companies", "files", "users"] },
    docId: { control: "text" },
    globalSlug: { control: "select", options: ["", "settings"] },
    tab: { control: "select", options: ["", "activity", "history"] },
    access: { control: false },
    onSaved: { table: { disable: true } },
  },
  render: (a: Args) =>
    html`<dashboard-edit-view
      .slug=${a.slug}
      .docId=${a.docId}
      .globalSlug=${a.globalSlug}
      .tab=${a.tab}
      .access=${a.access}
      .user=${maya}
      ?embedded=${a.embedded}
      ?tile=${a.tile}
      @dashboard-doc-saved=${a.onSaved}
    ></dashboard-edit-view>`,
});

export const Playground = meta.story({});

export const Create = meta.story({
  args: { docId: "" },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await loaded(canvasElement);
    await waitFor(() => expect(canvas.getByRole("heading", { name: "Create new Deal" })).toBeVisible());
    await userEvent.type(canvas.getByRole("textbox", { name: /Title/ }), "Fleet tracking");
    await userEvent.click(canvas.getByRole("button", { name: "Create" }));
    const d = dashboardOf(canvasElement);
    await waitFor(() => expect(d.navigations).toEqual([{ to: "/collections/deals/doc-1", replace: true }]));
    await expect(d.notices).toEqual([{ message: "Created", tone: "success", action: undefined }]);
  },
});

export const Edit = meta.story({
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await loaded(canvasElement);
    await waitFor(() => expect(canvas.getByRole("heading", { name: "Warehouse fit-out" })).toBeVisible());
    await expect(canvas.getByRole("button", { name: "Saved" })).toBeDisabled();
    await userEvent.clear(canvas.getByRole("textbox", { name: /Title/ }));
    await userEvent.type(canvas.getByRole("textbox", { name: /Title/ }), "Warehouse fit-out, phase two");
    await waitFor(() => expect(canvas.getByText("Unsaved changes")).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const d = dashboardOf(canvasElement);
    await waitFor(() => expect(args.onSaved).toHaveBeenCalledOnce());
    await expect(d.notices.map((n) => n.message)).toEqual(["Updated"]);
    await waitFor(() => expect(canvas.getByRole("heading", { name: "Warehouse fit-out, phase two" })).toBeVisible());
  },
});

export const SaveWithKeyboard = meta.story({
  name: "Save with Ctrl+S",
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await loaded(canvasElement);
    await userEvent.type(canvas.getByRole("textbox", { name: /Notes/ }), " Signed off.");
    await userEvent.keyboard("{Control>}s{/Control}");
    await waitFor(() => expect(args.onSaved).toHaveBeenCalledOnce());
    await expect(dashboardOf(canvasElement).notices.map((n) => n.message)).toEqual(["Updated"]);
  },
});

export const UnsavedChanges = meta.story({
  play: async ({ canvas, canvasElement, userEvent }) => {
    await loaded(canvasElement);
    await userEvent.type(canvas.getByRole("textbox", { name: /Notes/ }), " Call back on Monday.");
    await waitFor(() => expect(canvas.getByText("Unsaved changes")).toBeVisible());
    await expect(canvas.getByRole("button", { name: "Save" })).toBeEnabled();
    const leave = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(leave);
    await expect(leave.defaultPrevented).toBe(true);
  },
});

export const ReadOnly = meta.story({
  name: "Read only",
  args: { access: readOnlyAccess },
  play: async ({ canvas, canvasElement }) => {
    await loaded(canvasElement);
    await waitFor(() => expect(canvas.getByText("Read only")).toBeVisible());
    await expect(canvas.queryByRole("button", { name: /Save|Delete/ })).toBeNull();
  },
});

export const FieldErrors = meta.story({
  name: "Field errors from the server",
  decorators: [
    withDashboard(
      make((d) => {
        d.data.update = () =>
          Promise.reject(
            new ApiError(400, [
              {
                message: "The following fields are invalid: title, amount",
                data: {
                  errors: [
                    { path: "title", message: "This title is already used by another deal." },
                    { path: "amount", message: "Amount must be positive." },
                  ],
                },
              },
            ]),
          );
      }),
    ),
  ],
  play: async ({ canvas, canvasElement, userEvent }) => {
    await loaded(canvasElement);
    await userEvent.type(canvas.getByRole("textbox", { name: /Notes/ }), " Updated terms.");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(canvas.getByText("2 fields need attention")).toBeVisible());
    await expect(canvas.getAllByText("This title is already used by another deal.").length).toBeGreaterThan(0);
    await expect(dashboardOf(canvasElement).notices[0]!.tone).toBe("error");
  },
});

export const Delete = meta.story({
  play: async ({ canvas, canvasElement, userEvent }) => {
    await loaded(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Delete" }));
    const dialog = await canvas.findByRole("dialog", { name: "Delete Warehouse fit-out?" });
    await expect(dialog).toBeVisible();
    await userEvent.click(canvas.getAllByRole("button", { name: "Delete" }).at(-1)!);
    const d = dashboardOf(canvasElement);
    await waitFor(() => expect(d.navigations).toEqual([{ to: "/collections/deals", replace: true }]));
    await expect(d.notices.map((n) => n.message)).toEqual(["Deleted"]);
  },
});

export const CancelDelete = meta.story({
  name: "Delete, cancelled",
  play: async ({ canvas, canvasElement, userEvent }) => {
    await loaded(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Delete" }));
    const dialog = await canvas.findByRole("dialog", { name: "Delete Warehouse fit-out?" });
    await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(dialog).not.toHaveAttribute("open"));
    await expect(dashboardOf(canvasElement).navigations).toEqual([]);
  },
});

export const ActivityTab = meta.story({
  name: "Custom edit tab",
  args: { tab: "activity" },
  play: async ({ canvas, canvasElement }) => {
    await loaded(canvasElement);
    await expect(canvas.getByRole("tab", { name: "Activity" })).toHaveAttribute("aria-selected", "true");
    await waitFor(() => expect(canvas.getByText("Calls and emails for deals d1.")).toBeVisible());
  },
});

export const MissingTab = meta.story({
  name: "Custom edit tab, not loaded",
  args: { tab: "history" },
  play: async ({ canvas, canvasElement }) => {
    await loaded(canvasElement);
    await waitFor(() => expect(canvas.getByText("This screen is loading.")).toBeVisible());
  },
});

export const Tabs = meta.story({
  name: "Details tab with sections",
  play: async ({ canvas, canvasElement }) => {
    await loaded(canvasElement);
    await expect(canvas.getByRole("tab", { name: "Details" })).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tab", { name: "Activity" })).toHaveAttribute(
      "href",
      "/collections/deals/d1/activity",
    );
  },
});

export const Global = meta.story({
  args: { slug: "", docId: "", globalSlug: "settings" },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await loaded(canvasElement);
    await waitFor(() => expect(canvas.getByRole("heading", { name: "Workspace settings" })).toBeVisible());
    await userEvent.clear(canvas.getByRole("textbox", { name: /Workspace name/i }));
    await userEvent.type(canvas.getByRole("textbox", { name: /Workspace name/i }), "Head office");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(dashboardOf(canvasElement).notices.map((n) => n.message)).toEqual(["Updated"]));
  },
});

export const SidebarFields = meta.story({
  name: "Sidebar fields",
  play: async ({ canvas, canvasElement }) => {
    await loaded(canvasElement);
    await waitFor(() => expect(canvas.getByText(/Created/)).toBeVisible());
    await waitFor(() => expect(canvas.getByRole("combobox", { name: /Owner/ })).toBeVisible());
  },
});

export const Upload = meta.story({
  args: { slug: "files", docId: "f1" },
  play: async ({ canvas, canvasElement }) => {
    await loaded(canvasElement);
    await waitFor(() => expect(canvas.getByRole("img", { name: "Floor plan of the warehouse" })).toBeVisible());
  },
});

export const Account = meta.story({
  args: { slug: "users", docId: "u1" },
  play: async ({ canvas, canvasElement }) => {
    await loaded(canvasElement);
    await waitFor(() => expect(canvas.getByLabelText(/New password/)).toBeVisible());
  },
});

export const NotFound = meta.story({
  name: "Not found",
  args: { docId: "missing" },
  play: async ({ canvas, canvasElement }) => {
    await loaded(canvasElement);
    await waitFor(() => expect(canvas.getByRole("alert")).toBeVisible());
    await expect(dashboardOf(canvasElement).notices.map((n) => n.tone)).toEqual(["error"]);
  },
});

export const Tile = meta.story({
  args: { tile: true },
  play: async ({ canvas, canvasElement }) => {
    await loaded(canvasElement);
    await expect(canvas.getByRole("button", { name: "Saved" })).toBeDisabled();
    await waitFor(() => expect(canvas.getByRole("button", { name: "Delete" })).toBeVisible());
  },
});

export const Embedded = meta.story({
  args: { embedded: true },
  play: async ({ canvas, canvasElement }) => {
    await loaded(canvasElement);
    await expect(canvas.queryByRole("button", { name: "Save" })).toBeNull();
    await expect(canvas.getByRole("textbox", { name: /Title/ })).toHaveValue("Warehouse fit-out");
  },
});
