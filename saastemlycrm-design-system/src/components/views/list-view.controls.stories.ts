import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn, waitFor } from "storybook/test";
import { withDashboard } from "../../../.storybook/dashboard.ts";
import {
  clearUrl,
  dashboard,
  dashboardOf,
  fullAccess,
  LAYOUTS,
  param,
  readAccess,
  seen,
  user,
  type ListViewArgs,
} from "../../../.storybook/fixtures/list-view.ts";
import "./list-view.ts";

const meta = preview.type<{ args: ListViewArgs }>().meta({
  title: "Views/List View/Controls",
  component: "dashboard-list-view",
  decorators: [withDashboard(dashboard())],
  parameters: { layout: "fullscreen" },
  beforeEach: clearUrl,
  args: {
    slug: "tasks",
    layout: "table",
    tile: false,
    heading: "",
    subhead: "",
    access: fullAccess,
    onCount: fn(),
  },
  argTypes: {
    slug: { control: "inline-radio", options: ["tasks", "notes"], description: "The collection to list." },
    layout: { control: "select", options: LAYOUTS, description: "How the records are laid out." },
    tile: { control: "boolean", description: "Drawn inside a dashboard tile, without the page header." },
    heading: { control: "text", description: "Replaces the collection's plural label as the page heading." },
    subhead: { control: "text", description: "Replaces the collection's description under the heading." },
    access: {
      control: "inline-radio",
      options: ["full", "read"],
      mapping: { full: fullAccess, read: readAccess },
      description: "What the signed-in user may do with the collection.",
    },
    extra: { table: { disable: true } },
    onCount: { table: { category: "events" } },
  },
  render: (a) =>
    html`<dashboard-list-view
      .slug=${a.slug}
      .stateKey=${"list"}
      .spec=${{ collection: a.slug, layout: a.layout, home: !a.tile, ...a.extra }}
      ?tile=${a.tile}
      .heading=${a.heading}
      .subhead=${a.subhead}
      .access=${a.access}
      .user=${user}
      @dashboard-list-count=${a.onCount}
    ></dashboard-list-view>`,
});

export const Search = meta.story({
  decorators: [
    withDashboard(
      dashboard({
        ai: {
          builtIn: { toEnglish: fn((q: string) => Promise.resolve(q === "rapport" ? "report" : q)) } as never,
        },
      }),
    ),
  ],
  play: async ({ canvas, userEvent }) => {
    const search = await canvas.findByRole("searchbox", { name: "Search by title" });
    await userEvent.type(search, "rapport");
    await seen(() => canvas.findByRole("link", { name: "Prepare the quarterly report" }));
    await waitFor(() => expect(canvas.queryByRole("link", { name: "Draft the launch plan" })).toBeNull());
    await seen(() => canvas.getByText("1–1 of 1"));
    await expect(param("q")).toBe("rapport");
  },
});

export const Filters = meta.story({
  name: "Filtered to nothing",
  args: { extra: { filters: [{ field: "title", operator: "like", value: "holiday" }] } },
  play: async ({ canvas, userEvent }) => {
    await seen(() => canvas.findByText("No tasks match"));
    await userEvent.click(canvas.getByRole("button", { name: "Clear search and filters" }));
    await seen(() => canvas.findByRole("link", { name: "Draft the launch plan" }));
  },
});

export const Sort = meta.story({
  play: async ({ canvas, userEvent }) => {
    await canvas.findByRole("link", { name: "Draft the launch plan" });
    await userEvent.click(canvas.getByRole("button", { name: /^Amount/ }));
    await waitFor(() => expect(canvas.getAllByRole("row")[1]).toHaveTextContent("Draft the launch plan"));
    await userEvent.click(canvas.getByRole("button", { name: /^Amount/ }));
    await waitFor(() => expect(canvas.getAllByRole("row")[1]).toHaveTextContent("Set up error alerts"));
    await expect(param("sort")).toBe("-amount");
  },
});

export const SortCards = meta.story({
  name: "Sort cards",
  args: { layout: "cards" },
  play: async ({ canvas, userEvent }) => {
    const sort = await canvas.findByRole("combobox", { name: "Sort" });
    await userEvent.selectOptions(sort, "-amount");
    const cards = await canvas.findByRole("list", { name: "Tasks" });
    await waitFor(() => expect(cards.querySelector("li")).toHaveTextContent("Set up error alerts"));
  },
});

export const Paging = meta.story({
  play: async ({ canvas, userEvent }) => {
    await seen(() => canvas.findByText("1–10 of 12"));
    await userEvent.click(canvas.getByRole("button", { name: "Next page" }));
    await seen(() => canvas.findByText("11–12 of 12"));
    await expect(param("page")).toBe("2");
    await userEvent.selectOptions(canvas.getByRole("combobox", { name: "Rows" }), "25");
    await seen(() => canvas.findByText("1–12 of 12"));
  },
});

export const BulkDelete = meta.story({
  name: "Selection and bulk delete",
  play: async ({ canvas, canvasElement, userEvent }) => {
    await canvas.findByRole("link", { name: "Draft the launch plan" });
    await userEvent.click(canvas.getByRole("checkbox", { name: "Select row 1" }));
    await seen(() => canvas.findByText("1 selected"));
    await userEvent.click(canvas.getByRole("button", { name: "Clear selection" }));
    await waitFor(() => expect(canvas.queryByText("1 selected")).toBeNull());
    await userEvent.click(canvas.getByRole("checkbox", { name: "Select all" }));
    await seen(() => canvas.findByText("10 selected"));
    await userEvent.click(canvas.getByRole("button", { name: "Select all 12 tasks" }));
    await seen(() => canvas.findByText("12 selected"));
    await userEvent.click(canvas.getByRole("button", { name: "Delete 12" }));
    await seen(() => canvas.findByRole("dialog", { name: "Delete 12 Tasks?" }));
    await userEvent.click(canvas.getByRole("button", { name: "Delete" }));
    await seen(() => canvas.findByText("No tasks yet"));
    await expect(dashboardOf(canvasElement).notices.at(-1)).toMatchObject({ message: "Deleted", tone: "success" });
  },
});

export const ColumnPicking = meta.story({
  name: "Column picking",
  play: async ({ canvas, canvasElement, userEvent }) => {
    await canvas.findByRole("link", { name: "Draft the launch plan" });
    await userEvent.click(canvas.getByRole("button", { name: /^Columns \(/ }));
    await userEvent.click(await canvas.findByRole("checkbox", { name: "Notes" }));
    await seen(() => canvas.findByRole("columnheader", { name: /Notes/ }));
    const prefs = dashboardOf(canvasElement).stores.preferences.get();
    await expect(Object.values(prefs.listColumns)[0]).not.toContain("notes");
  },
});

export const Density = meta.story({
  play: async ({ canvas, canvasElement, userEvent }) => {
    await canvas.findByRole("link", { name: "Draft the launch plan" });
    await userEvent.click(canvas.getByRole("button", { name: /^Columns \(/ }));
    await userEvent.click(await canvas.findByRole("radio", { name: "Compact" }));
    await waitFor(() => expect(canvasElement.querySelector("ui-table")).toHaveAttribute("density", "-1"));
    await expect(dashboardOf(canvasElement).stores.preferences.get().listDensity).toBe("-1");
  },
});
