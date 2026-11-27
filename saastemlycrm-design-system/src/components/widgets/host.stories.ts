import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn, waitFor } from "storybook/test";
import { testDashboard, withDashboard, type TestDashboard } from "../../../.storybook/dashboard.ts";
import { ApiError } from "../../lib/api/errors.ts";
import { m } from "../../lib/i18n/index.ts";
import type { MemoryData } from "../../lib/dashboard/memory.ts";
import {
  config,
  homePage,
  pageOf,
  reportsPage,
  seed,
  user,
  WIDGET_KINDS,
} from "../../../.storybook/fixtures/widgets.ts";
import * as k from "../../lib/widgets/kinds.ts";
import type { Widget, WidgetPage } from "../../lib/widgets/widget.ts";
import "./host.ts";

let current: TestDashboard;
const dashboard = (data: MemoryData = {}, prepare?: (d: TestDashboard) => void) =>
  withDashboard(() => {
    current = testDashboard({
      config,
      data: { ...seed(), ...data, endpoints: { ...seed().endpoints, ...data.endpoints } },
    });
    prepare?.(current);
    return current;
  });
const boards = () => current.stores.preferences.get().boards;

const note = (title: string, text: string): Widget =>
  k.text({ title, size: "s", skeleton: "text", format: () => ({ text }) });
const notes = pageOf(
  note("Deliveries", "Three vans leave before nine."),
  note("Payments", "Two invoices were paid this morning."),
  note("Staff", "Jordan is off on Friday."),
);
const kinds = WIDGET_KINDS.map((d) => d.name);

const meta = preview.type<{ args: { kinds: string[]; header: boolean; fit: boolean; board: string } }>().meta({
  title: "Widgets/Widgets",
  component: "app-widgets",
  decorators: [dashboard()],
  parameters: { layout: "fullscreen" },
  args: { kinds: ["stats", "chart", "list", "table"], header: true, fit: false, board: "playground" },
  argTypes: {
    kinds: { control: "check", options: kinds, description: "Widgets on the page." },
    header: { control: "boolean", description: "Show a page header." },
    fit: { control: "boolean", description: "Fit the lanes to the width." },
    board: { control: "text", description: "Where the layout is remembered." },
  },
  render: (args) => {
    const page: WidgetPage = {
      header: args.header ? { heading: "Today", subtitle: "What needs you this morning." } : undefined,
      widgets: args.kinds.map((name) => WIDGET_KINDS.find((d) => d.name === name)!.widget),
    };
    return html`<app-widgets .page=${page} .user=${user} board=${args.board} ?fit=${args.fit}></app-widgets>`;
  },
});

export const Playground = meta.story({
  play: async ({ canvas }) => {
    await waitFor(async () => expect(await canvas.findByRole("heading", { name: "Today" })).toBeVisible());
    await waitFor(async () => expect(await canvas.findByText("Tasks due soon")).toBeVisible());
  },
});

const page = (p: WidgetPage, board = "story") =>
  html`<app-widgets .page=${p} .user=${user} board=${board}></app-widgets>`;

export const Arrange = meta.story({
  name: "Arrange with the keyboard",
  render: () => page(notes),
  play: async ({ canvas, userEvent }) => {
    const grip = await canvas.findByRole("button", { name: "Move Payments" });
    grip.focus();
    await userEvent.keyboard("{ArrowLeft}");
    await waitFor(() => expect(boards().story?.order).toEqual(["1", "0", "2"]));
    const reset = await canvas.findByRole("button", { name: m.widget_host_reset_layout() });
    await userEvent.click(reset);
    await waitFor(() => expect(boards().story).toBeUndefined());
  },
});

export const Resize = meta.story({
  name: "Resize with the keyboard",
  render: () => page(notes),
  play: async ({ canvas, userEvent }) => {
    const corner = await canvas.findByRole("button", { name: "Resize Deliveries" });
    corner.focus();
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => expect(boards().story?.rows?.["0"]).toBeGreaterThan(2));
  },
});

export const HideAndShow = meta.story({
  name: "Hide and show a tile",
  render: () => page(notes),
  play: async ({ canvas, userEvent }) => {
    const grip = await canvas.findByRole("button", { name: "Move Staff" });
    grip.focus();
    await userEvent.keyboard("{Delete}");
    await waitFor(() => expect(canvas.queryByText("Jordan is off on Friday.")).toBeNull());
    await userEvent.click(await canvas.findByRole("button", { name: m.widget_host_show_hidden({ count: 1 }) }));
    await waitFor(async () => expect(await canvas.findByText("Jordan is off on Friday.")).toBeVisible());
  },
});

export const Kept = meta.story({
  name: "Widgets kept from other screens",
  decorators: [
    dashboard({}, (d) =>
      d.stores.preferences.set({
        boards: {
          story: {
            added: [
              { view: "reports", key: "0" },
              { view: "reports", key: "1" },
            ],
          },
        },
      }),
    ),
  ],
  render: () => page(homePage),
  play: async ({ canvas, userEvent }) => {
    await waitFor(async () => expect(await canvas.findByRole("heading", { name: "Good morning" })).toBeVisible());
    const grip = await canvas.findByRole("button", { name: "Move Tasks due soon" });
    grip.focus();
    await userEvent.keyboard("{Delete}");
    await waitFor(() => expect(boards().story?.added).toEqual([{ view: "reports", key: "0" }]));
  },
});

export const Reports = meta.story({
  name: "A screen whose widgets can be kept",
  render: () => html`<app-widgets .page=${reportsPage} .user=${user}></app-widgets>`,
  play: async ({ canvas }) => {
    await waitFor(async () => expect(await canvas.findByRole("heading", { name: "Invoiced by month" })).toBeVisible());
  },
});

const remind = fn(() => ({ message: "Reminders sent", undo: { path: "/reminders/cancel" } }));
const cancel = fn(() => ({ message: "Reminders cancelled" }));

export const Undo = meta.story({
  name: "Run an action and undo it",
  decorators: [dashboard({ endpoints: { "POST /reminders": remind, "POST /reminders/cancel": cancel } })],
  render: () =>
    page(
      pageOf(
        k.actions({
          title: "Overdue invoices",
          size: "s",
          format: () => ({ items: [{ label: "Send reminders", call: { path: "/reminders" } }] }),
        }),
      ),
    ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole("button", { name: "Send reminders" }));
    await waitFor(() => expect(remind).toHaveBeenCalledOnce());
    await waitFor(() => expect(current.notices.at(-1)?.message).toBe("Reminders sent"));
    const notice = current.notices.at(-1)!;
    notice.action!.onClick();
    await waitFor(() => expect(cancel).toHaveBeenCalledOnce());
    await waitFor(() => expect(current.notices.at(-1)?.message).toBe("Reminders cancelled"));
  },
});

export const Empty = meta.story({
  name: "Empty",
  render: () =>
    page(
      pageOf({
        ...k.list({ title: "Follow-ups", size: "s", skeleton: "list", format: () => ({ items: [] }) }),
        empty: { when: () => true, heading: "Nothing to follow up", description: "New follow-ups show up here." },
      } as Widget),
    ),
  play: async ({ canvas }) => {
    await waitFor(async () => expect(await canvas.findByText("Nothing to follow up")).toBeVisible());
  },
});

const emptyFormat = fn(() => ({ head: { tags: [{ label: "Draft" }] }, items: [] }));

export const EmptyUnread = meta.story({
  name: "Empty without formatting its data",
  render: () =>
    page(
      pageOf({
        ...k.list({ title: "Draft lines", size: "s", skeleton: "list", format: emptyFormat }),
        empty: { when: () => true, heading: "No draft yet" },
      } as Widget),
    ),
  play: async ({ canvas }) => {
    await waitFor(async () => expect(await canvas.findByText("No draft yet")).toBeVisible());
    await expect(canvas.queryByText("Draft")).toBeNull();
    await expect(emptyFormat).not.toHaveBeenCalled();
  },
});

export const Denied = meta.story({
  name: "Denied",
  decorators: [
    dashboard({ endpoints: { "GET /payroll": () => Promise.reject(new ApiError(403, [{ message: "Forbidden" }])) } }),
  ],
  render: () =>
    page(
      pageOf(
        k.text({
          title: "Payroll",
          size: "s",
          data: k.query.endpoint("/payroll"),
          denied: "Only managers can see payroll.",
          format: () => ({ text: "" }),
        }),
      ),
    ),
  play: async ({ canvas }) => {
    await waitFor(async () => expect(await canvas.findByText("Only managers can see payroll.")).toBeVisible());
  },
});

export const ErrorState = meta.story({
  name: "Error",
  render: () =>
    page(
      pageOf(
        k.text({ title: "Forecast", size: "s", data: k.query.endpoint("/forecast"), format: () => ({ text: "" }) }),
      ),
    ),
  play: async ({ canvas }) => {
    await waitFor(async () => expect(await canvas.findByText(m.widget_load_failed())).toBeVisible());
    await waitFor(() => expect(canvas.getByText("Not Found")).toBeVisible());
  },
});
