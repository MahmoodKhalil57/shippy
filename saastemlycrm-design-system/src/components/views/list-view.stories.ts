import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn, waitFor } from "storybook/test";
import { withDashboard } from "../../../.storybook/dashboard.ts";
import {
  clearUrl,
  dashboard,
  fullAccess,
  LAYOUTS,
  readAccess,
  seen,
  user,
  type ListViewArgs,
} from "../../../.storybook/fixtures/list-view.ts";
import "./list-view.ts";

const meta = preview.type<{ args: ListViewArgs }>().meta({
  title: "Views/List View",
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

export const Playground = meta.story({
  play: async ({ canvas, args }) => {
    await seen(() => canvas.findByRole("link", { name: "Draft the launch plan" }));
    await seen(() => canvas.getByRole("heading", { name: "Tasks" }));
    await expect(canvas.getByRole("link", { name: "+ Create new Task" })).toHaveAttribute(
      "href",
      "/collections/tasks/create",
    );
    await seen(() => canvas.getByText("1–10 of 12"));
    await waitFor(() => expect(args.onCount).toHaveBeenCalled());
    await expect((args.onCount as ReturnType<typeof fn>).mock.calls.at(-1)![0].detail).toEqual({ count: 12 });
  },
});

export const Tile = meta.story({
  name: "In a tile",
  args: { tile: true, layout: "list" },
  play: async ({ canvas }) => {
    await seen(() => canvas.findByRole("link", { name: "+ New task" }));
    await expect(canvas.queryByRole("heading", { name: "Tasks" })).toBeNull();
  },
});

export const Minimal = meta.story({
  name: "Plain collection",
  args: { slug: "notes", heading: "Meeting notes", subhead: "Everything written down after a meeting." },
  play: async ({ canvas }) => {
    await seen(() => canvas.findByRole("heading", { name: "Meeting notes" }));
    await seen(() => canvas.getByText("Everything written down after a meeting."));
    const view = canvas.getByRole("combobox", { name: "View" }) as HTMLSelectElement;
    await expect([...view.options].map((o) => o.value)).toEqual(["table", "cards", "list", "compact", "focus"]);
  },
});
