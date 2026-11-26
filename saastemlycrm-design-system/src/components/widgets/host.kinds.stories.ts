import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import { testDashboard, withDashboard } from "../../../.storybook/dashboard.ts";
import { config, seed, user, WIDGET_KINDS } from "../../../.storybook/fixtures/widgets.ts";
import "./host.ts";

const kinds = WIDGET_KINDS.map((d) => d.name);

const meta = preview.type<{ args: { kind: string } }>().meta({
  title: "Widgets/Widget",
  component: "app-widget",
  decorators: [withDashboard(() => testDashboard({ config, data: seed() }))],
  parameters: { layout: "fullscreen" },
  args: { kind: "table" },
  argTypes: { kind: { control: "select", options: kinds, description: "The kind of widget." } },
  render: ({ kind }) =>
    html`<app-widgets
      board=${`widget-${kind}`}
      .page=${{ widgets: [WIDGET_KINDS.find((d) => d.name === kind)!.widget] }}
      .user=${user}
    ></app-widgets>`,
});

export const Playground = meta.story({});

export const Stats = meta.story({
  args: { kind: "stats" },
  play: async ({ canvas }) => {
    await waitFor(async () => expect(await canvas.findByText("Overdue invoices")).toBeVisible());
  },
});

export const Text = meta.story({
  args: { kind: "text" },
  play: async ({ canvas }) => {
    await waitFor(async () => expect(await canvas.findByText(/Two invoices are overdue/)).toBeVisible());
  },
});

export const List = meta.story({
  args: { kind: "list" },
  play: async ({ canvas }) => {
    await waitFor(async () => expect(await canvas.findByText("Call back about the late delivery")).toBeVisible());
  },
});

export const Card = meta.story({
  args: { kind: "card" },
  play: async ({ canvas }) => {
    await waitFor(async () => expect(await canvas.findByText("Main office")).toBeVisible());
  },
});

export const Entries = meta.story({
  args: { kind: "entries" },
  play: async ({ canvas }) => {
    await expect((await canvas.findAllByText(/INV-10/)).length).toBeGreaterThan(0);
  },
});

export const Chart = meta.story({
  args: { kind: "chart" },
  play: async ({ canvas }) => {
    await waitFor(async () => expect(await canvas.findByRole("heading", { name: "Invoiced by month" })).toBeVisible());
  },
});

export const Table = meta.story({
  args: { kind: "table" },
  play: async ({ canvas }) => {
    await waitFor(async () => expect(await canvas.findByRole("table")).toBeVisible());
  },
});
