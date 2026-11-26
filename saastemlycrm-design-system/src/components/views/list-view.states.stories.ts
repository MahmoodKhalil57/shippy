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
  readAccess,
  seen,
  user,
  type ListViewArgs,
} from "../../../.storybook/fixtures/list-view.ts";
import "./list-view.ts";

const meta = preview.type<{ args: ListViewArgs }>().meta({
  title: "Views/List View/States",
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

export const Empty = meta.story({
  decorators: [withDashboard(dashboard({ data: { docs: {} } }))],
  play: async ({ canvas }) => {
    await seen(() => canvas.findByText("No tasks yet"));
    await seen(() => canvas.getByText("Create the first one."));
    await seen(() => canvas.getByText("No records"));
    await expect(canvas.getByRole("button", { name: /Export CSV/ })).toBeDisabled();
  },
});

export const EmptyCards = meta.story({
  name: "Empty cards",
  args: { layout: "cards" },
  decorators: [withDashboard(dashboard({ data: { docs: {} } }))],
  play: async ({ canvas }) => {
    await seen(() => canvas.findByText("No tasks yet"));
  },
});

export const Loading = meta.story({
  decorators: [withDashboard(dashboard({ slow: true }))],
  play: async ({ canvas }) => {
    await seen(() => canvas.findByText("Loading…"));
    await expect(canvas.getByRole("combobox", { name: "Rows" })).toBeDisabled();
  },
});

export const LoadingCards = meta.story({
  name: "Loading cards",
  args: { layout: "cards" },
  decorators: [withDashboard(dashboard({ slow: true }))],
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelectorAll("ui-skeleton")).toHaveLength(6));
  },
});

export const ErrorState = meta.story({
  name: "Error",
  decorators: [withDashboard(dashboard({ failing: true }))],
  play: async ({ canvas, canvasElement }) => {
    const d = dashboardOf(canvasElement);
    await waitFor(() =>
      expect(d.notices.at(-1)).toMatchObject({ message: "The server is unreachable.", tone: "error" }),
    );
    await seen(() => canvas.findByText("Loading…"));
  },
});

export const ReadOnly = meta.story({
  name: "Read only",
  args: { access: readAccess, layout: "board" },
  play: async ({ canvas }) => {
    await seen(() => canvas.findByRole("group", { name: "Tasks by status" }));
    await expect(canvas.queryByRole("link", { name: /Create new/ })).toBeNull();
    await expect(canvas.queryByRole("button", { name: /^Move / })).toBeNull();
  },
});

export const AccessDenied = meta.story({
  name: "Access denied",
  args: { access: { canAccessAdmin: true, collections: {}, globals: {} } },
  play: async ({ canvas }) => {
    await seen(() => canvas.findByRole("link", { name: "Draft the launch plan" }));
    await expect(canvas.queryByRole("checkbox", { name: "Select all" })).toBeNull();
    await expect(canvas.queryByRole("link", { name: /Create new/ })).toBeNull();
  },
});
