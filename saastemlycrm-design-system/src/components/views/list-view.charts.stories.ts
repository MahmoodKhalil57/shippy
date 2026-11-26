import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn } from "storybook/test";
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
  title: "Views/List View/Charts",
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

export const Calendar = meta.story({
  args: { layout: "calendar" },
  play: async ({ canvas, userEvent }) => {
    await seen(() => canvas.findByText("March 2026"));
    await seen(() => canvas.findByText("12 by due"));
    await userEvent.click(canvas.getByRole("button", { name: "Next month" }));
    await seen(() => canvas.findByText("April 2026"));
    await seen(() => canvas.findByText("0 by due"));
    await expect(param("month")).toBe("2026-04");
    await userEvent.click(canvas.getByRole("button", { name: "This month" }));
    await seen(() => canvas.findByText("March 2026"));
    await userEvent.click(canvas.getByRole("button", { name: "Previous month" }));
    await seen(() => canvas.findByText("February 2026"));
  },
});

export const Timeline = meta.story({
  args: { layout: "timeline" },
  play: async ({ canvas }) => {
    await seen(() => canvas.findByRole("link", { name: "Set up error alerts" }));
    await seen(() => canvas.getByText("24 Mar 2026"));
  },
});

export const Heatmap = meta.story({
  args: { layout: "heatmap" },
  play: async ({ canvas }) => {
    await seen(() => canvas.findByText("12 tasks in 12 weeks by due"));
  },
});

export const Chart = meta.story({
  args: { layout: "chart" },
  play: async ({ canvas }) => {
    await seen(() => canvas.findByRole("img", { name: /Tasks by due/ }));
  },
});

export const Ranking = meta.story({
  args: { layout: "ranking" },
  play: async ({ canvas }) => {
    const list = await canvas.findByRole("list", { name: "Tasks by amount" });
    await expect(list.querySelector("li")).toHaveTextContent("Set up error alerts");
  },
});

export const Treemap = meta.story({
  args: { layout: "treemap" },
  play: async ({ canvas }) => {
    await seen(() => canvas.findByRole("link", { name: /Set up error alerts/ }));
  },
});

export const Scatter = meta.story({
  args: { layout: "scatter" },
  play: async ({ canvas }) => {
    await seen(() => canvas.findByRole("list", { name: "Tasks: effort and score" }));
  },
});

export const Layouts = meta.story({
  name: "Switching layouts",
  play: async ({ canvas, canvasElement, userEvent }) => {
    const view = await canvas.findByRole("combobox", { name: "View" });
    await userEvent.selectOptions(view, "cards");
    await seen(() => canvas.findByRole("list", { name: "Tasks" }));
    const d = dashboardOf(canvasElement);
    await expect(Object.values(d.stores.preferences.get().listView)).toEqual(["cards"]);
    await expect(param("view")).toBe("cards");
  },
});
