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
  title: "Views/List View/Records",
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

export const Table = meta.story({
  args: { layout: "table", extra: { columns: ["title", "status", "owner", "project", "amount", "comments", "due"] } },
  play: async ({ canvas }) => {
    await seen(() => canvas.findByRole("table"));
    await seen(() => canvas.getByRole("columnheader", { name: /Title/ }));
    await expect(canvas.getAllByRole("link", { name: "Avery Stone" })[0]).toHaveAttribute(
      "href",
      "/collections/people/p1",
    );
  },
});

export const Cards = meta.story({
  args: { layout: "cards" },
  play: async ({ canvas }) => {
    const cards = await canvas.findByRole("list", { name: "Tasks" });
    await expect(cards.querySelectorAll("li")).toHaveLength(10);
    await seen(() => canvas.getByRole("combobox", { name: "Sort" }));
  },
});

export const List = meta.story({
  args: { layout: "list" },
  play: async ({ canvas }) => {
    await seen(() => canvas.findByRole("list", { name: "Tasks" }));
    await expect(canvas.getByRole("link", { name: /Fix the sign-in bug/ })).toHaveAttribute(
      "href",
      "/collections/tasks/t3",
    );
  },
});

export const Compact = meta.story({
  args: { layout: "compact" },
  play: async ({ canvas }) => {
    await seen(() => canvas.findByRole("list", { name: "Tasks" }));
  },
});

export const Focus = meta.story({
  args: { layout: "focus" },
  play: async ({ canvas, userEvent }) => {
    await seen(() => canvas.findByText("1 of 10"));
    await expect(canvas.getByRole("button", { name: "Previous" })).toBeDisabled();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await seen(() => canvas.findByText("2 of 10"));
    canvas.getByRole("button", { name: "Previous" }).focus();
    await userEvent.keyboard("{End}");
    await seen(() => canvas.findByText("10 of 10"));
    await expect(canvas.getByRole("button", { name: "Next" })).toBeDisabled();
    await userEvent.keyboard("{ArrowLeft}");
    await seen(() => canvas.findByText("9 of 10"));
    await userEvent.keyboard("{Home}");
    await seen(() => canvas.findByText("1 of 10"));
    canvas.getByRole("button", { name: "Next" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    await seen(() => canvas.findByText("2 of 10"));
    await userEvent.keyboard("a");
    await seen(() => canvas.getByText("2 of 10"));
  },
});

export const Groups = meta.story({
  args: { layout: "groups" },
  play: async ({ canvas }) => {
    await seen(() => canvas.findByRole("list", { name: "Planned" }));
    await seen(() => canvas.getByRole("list", { name: "In progress" }));
    await seen(() => canvas.getByRole("list", { name: "Done" }));
  },
});

export const Board = meta.story({
  args: { layout: "board" },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await seen(() => canvas.findByRole("group", { name: "Tasks by status" }));
    await userEvent.click(canvas.getByRole("button", { name: "Move Draft the launch plan" }));
    await userEvent.click(await canvas.findByRole("menuitem", { name: "Move to Done" }));
    const d = dashboardOf(canvasElement);
    await waitFor(() => expect(d.notices.at(-1)?.message).toBe("Draft the launch plan → Done"));
    await expect((await d.data.findByID("tasks", "t1")).status).toBe("done");
    d.notices.at(-1)!.action!.onClick();
    await waitFor(() => expect(d.notices.at(-1)?.message).toBe("Draft the launch plan → Planned"));
    await expect(d.notices.at(-1)!.action).toBeUndefined();
  },
});
