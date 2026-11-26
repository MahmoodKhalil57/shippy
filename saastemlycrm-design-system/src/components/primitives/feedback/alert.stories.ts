import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./alert.ts";
import "../actions/button.ts";
import "../media/icon.ts";

const meta = preview.type<{ args: { onClose: (e: Event) => void } }>().meta({
  title: "Primitives/Feedback/Alert",
  component: "ui-alert",
  args: {
    tone: "info",
    heading: "Sync in progress",
    description: "Contacts will update within a few minutes.",
    icon: true,
    dismissible: true,
    dismissed: false,
    onClose: fn(),
  },
  argTypes: {
    tone: { control: "inline-radio", options: ["info", "success", "warning", "error"] },
    heading: { control: "text" },
    description: { control: "text" },
    icon: { control: "boolean" },
    onClose: { table: { category: "events" } },
  },
  parameters: { canvas: "column" },
  render: (args) => html`
    <ui-alert
      tone=${ifDefined(args.tone)}
      heading=${ifDefined(args.heading as string | undefined)}
      description=${ifDefined(args.description as string | undefined)}
      icon=${args.icon === false ? "false" : "true"}
      ?dismissible=${args.dismissible}
      ?dismissed=${args.dismissed}
      @ui-close=${args.onClose}
    ></ui-alert>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the alert; dismissing it calls onClose." } } },
  play: async ({ canvas, userEvent, args }) => {
    const status = canvas.getByRole("status");
    await expect(status).toHaveTextContent("Sync in progress");
    await expect(status).toHaveTextContent("Contacts will update within a few minutes.");
    await userEvent.click(canvas.getByRole("button", { name: "Dismiss" }));
    await expect(args.onClose).toHaveBeenCalledOnce();
    await expect(canvas.queryByRole("status")).toBeNull();
  },
});

export const ErrorState = meta.story({
  name: "Error",
  args: {
    tone: "error",
    heading: "Payment failed",
    description: "The card ending 4242 was declined.",
    dismissible: false,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("Payment failed");
    await expect(canvas.queryByRole("button", { name: "Dismiss" })).toBeNull();
  },
});

export const CanceledDismiss = meta.story({
  name: "Canceled dismiss",
  args: { tone: "warning", heading: "Payment due soon", description: "Invoice INV-0042 is due in 3 days." },
  render: (args) => html`
    <ui-alert
      tone=${ifDefined(args.tone)}
      heading=${ifDefined(args.heading as string | undefined)}
      description=${ifDefined(args.description as string | undefined)}
      dismissible
      @ui-close=${(e: Event) => {
        e.preventDefault();
        args.onClose(e);
      }}
    ></ui-alert>
  `,
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Dismiss" }));
    await expect(args.onClose).toHaveBeenCalledOnce();
    await expect(canvas.getByRole("alert")).toHaveTextContent("Payment due soon");
  },
});

export const DismissedState = meta.story({
  name: "Dismissed, from args",
  args: { dismissed: true },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("status")).toBeNull();
  },
});

export const Tones = meta.story({
  name: "Tones",
  parameters: {
    docs: {
      description: { story: "Info and success are announced politely as a status; warning and error use role alert." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-alert
      tone="info"
      heading="Sync in progress"
      description="Contacts will update within a few minutes."
    ></ui-alert>
    <ui-alert tone="success" heading="Invoice sent" description="Ana Silva received Invoice INV-0042."></ui-alert>
    <ui-alert tone="warning" heading="Payment due soon" description="Invoice INV-0042 is due in 3 days."></ui-alert>
    <ui-alert tone="error" heading="Payment failed" description="The card ending 4242 was declined."></ui-alert>
  `,
});

export const Content = meta.story({
  name: "Content",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-alert heading="Heading only"></ui-alert>
    <ui-alert tone="info" description="A description with no heading, for a short one-line notice."></ui-alert>
    <ui-alert tone="success">Slotted content works in place of a description.</ui-alert>
  `,
  play: async ({ canvas }) => {
    const [untoned] = canvas.getAllByRole("status");
    await expect(untoned).toHaveTextContent("Heading only");
    await expect(untoned).toHaveClass("bg-info-container");
  },
});

export const ActionsAndDismiss = meta.story({
  name: "Actions and dismiss",
  parameters: {
    docs: { description: { story: "The dismiss button fires a cancelable ui-close and then hides the alert." } },
    canvas: "column",
  },
  render: () => html`
    <ui-alert tone="warning" heading="Your trial ends in 5 days" description="Choose a plan to keep your data.">
      <ui-button slot="actions" size="xs" color="primary">Choose a plan</ui-button>
      <ui-button slot="actions" size="xs" variant="text">Remind me later</ui-button>
    </ui-alert>
    <ui-alert tone="info" heading="New: quarterly report" description="Find it under Reports." dismissible></ui-alert>
    <ui-alert tone="error" heading="Import failed" description="Row 14 has no email address." dismissible>
      <ui-button slot="actions" size="xs" variant="outlined">Download errors</ui-button>
    </ui-alert>
  `,
});

export const Icons = meta.story({
  name: "Icons",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-alert
      tone="info"
      icon="false"
      heading="No icon"
      description="icon set to false leaves the space empty."
    ></ui-alert>
    <ui-alert tone="success" heading="Custom icon" description="Any icon can replace the tone's own.">
      <ui-icon slot="icon" name="sparkles"></ui-icon>
    </ui-alert>
  `,
});

export const Dismissed = meta.story({
  name: "Dismissed",
  parameters: { docs: { description: { story: "A dismissed alert renders nothing, so this canvas is empty." } } },
  render: () => html`<ui-alert tone="info" heading="Already dismissed" dismissed></ui-alert>`,
});
