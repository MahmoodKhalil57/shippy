import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./empty-state.ts";
import "../actions/button.ts";
import { ICON_NAMES } from "../../../lib/base/icon-names.ts";
import type { LocalizedString } from "../../../lib/i18n/paraglide/runtime.js";

const localized = (text: string) => text as LocalizedString;

const meta = preview.type<{ args: { actionText: string; onAction: () => void } }>().meta({
  title: "Primitives/Feedback/Empty state",
  component: "ui-empty-state",
  args: {
    heading: "No invoices yet",
    description: "Invoices you create or import show up here.",
    icon: "inbox",
    size: "md",
    tone: "neutral",
    loading: false,
    label: localized("Loading invoices"),
    actionText: "New invoice",
    onAction: fn(),
  },
  argTypes: {
    heading: { control: "text" },
    description: { control: "text" },
    icon: { control: "select", options: [undefined, ...ICON_NAMES] },
    size: { control: "inline-radio", options: ["sm", "md"] },
    tone: { control: "inline-radio", options: ["neutral", "error"] },
    label: { control: "text" },
    actionText: { control: "text", description: "The label of the button in the actions slot." },
    onAction: { table: { category: "events" } },
  },
  parameters: { canvas: "column" },
  render: (args) => html`
    <ui-empty-state
      heading=${ifDefined(args.heading as string | undefined)}
      description=${ifDefined(args.description as string | undefined)}
      icon=${ifDefined(args.icon)}
      size=${ifDefined(args.size)}
      tone=${ifDefined(args.tone)}
      ?loading=${args.loading}
      label=${ifDefined(args.label)}
    >
      <ui-button slot="actions" color="primary" @click=${args.onAction}>${args.actionText}</ui-button>
    </ui-empty-state>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the empty state; its action calls onAction." } } },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText("No invoices yet")).toBeVisible();
    await expect(canvas.getByText("Invoices you create or import show up here.")).toBeVisible();
    await expect(canvas.queryByRole("alert")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "New invoice" }));
    await expect(args.onAction).toHaveBeenCalledOnce();
  },
});

export const ErrorTone = meta.story({
  name: "Error tone",
  args: {
    tone: "error",
    icon: undefined,
    heading: "Couldn't load the report",
    description: "Check your connection and try again.",
    actionText: "Retry",
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("Couldn't load the report");
    await userEvent.click(canvas.getByRole("button", { name: "Retry" }));
    await expect(args.onAction).toHaveBeenCalledOnce();
  },
});

export const LoadingStatus = meta.story({
  name: "Loading status",
  args: { loading: true, heading: "Loading invoices", description: "" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status", { name: "Loading invoices" })).toBeInTheDocument();
  },
});

export const LoadingIsBusy = meta.story({
  name: "Loading marks its region busy",
  args: { loading: true, heading: "", description: "" },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("ui-empty-state > div")).toHaveAttribute("aria-busy", "true");
  },
});

export const SmallSize = meta.story({
  name: "Small size",
  args: { size: "sm", heading: "No contacts match this filter", description: "", icon: "users" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("No contacts match this filter")).toBeVisible();
  },
});

export const Medium = meta.story({
  name: "Medium",
  parameters: {
    docs: { description: { story: "The default size: centred, with an optional icon, description and actions." } },
    canvas: "column",
  },
  render: () => html`
    <ui-empty-state icon="inbox" heading="No invoices yet" description="Invoices you create or import show up here.">
      <ui-button slot="actions" color="primary">New invoice</ui-button>
      <ui-button slot="actions" variant="outlined">Import</ui-button>
    </ui-empty-state>
    <ui-empty-state heading="No results" description="Try a different search or clear the filters."></ui-empty-state>
  `,
});

export const Small = meta.story({
  name: "Small",
  parameters: {
    docs: { description: { story: "Small is start-aligned and drops the icon, for inside a list or a tile." } },
    canvas: "column",
  },
  render: () => html`
    <ui-empty-state size="sm" icon="users" heading="No contacts match this filter"></ui-empty-state>
    <ui-empty-state size="sm" heading="Nothing scheduled" description="Meetings you book appear here."></ui-empty-state>
  `,
});

export const ErrorState = meta.story({
  name: "Error",
  parameters: {
    docs: { description: { story: "The error tone uses role alert and falls back to a warning icon." } },
    canvas: "column",
  },
  render: () => html`
    <ui-empty-state tone="error" heading="Couldn't load the report" description="Check your connection and try again.">
      <ui-button slot="actions" variant="outlined">Retry</ui-button>
    </ui-empty-state>
    <ui-empty-state size="sm" tone="error" heading="Couldn't load contacts"></ui-empty-state>
  `,
});

export const Loading = meta.story({
  name: "Loading",
  parameters: {
    docs: { description: { story: "loading replaces the icon with a progress indicator announced by its label." } },
    canvas: "column",
  },
  render: () => html`
    <ui-empty-state loading label="Loading invoices" heading="Loading invoices"></ui-empty-state>
    <ui-empty-state size="sm" loading label="Loading contacts" heading="Loading contacts"></ui-empty-state>
  `,
});

export const SlottedHeading = meta.story({
  name: "Slotted heading",
  parameters: { canvas: "column" },
  render: () => html`<ui-empty-state icon="search">No matches for "Quarterly report"</ui-empty-state>`,
});

export const ActionOnly = meta.story({
  name: "Action only",
  args: { heading: "", description: "", icon: "inbox", actionText: "New invoice" },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const state = canvasElement.querySelector("ui-empty-state")!;
    await expect(state.querySelectorAll("p")).toHaveLength(0);
    await expect(state.querySelector("svg")).not.toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "New invoice" }));
    await expect(args.onAction).toHaveBeenCalledOnce();
  },
});
