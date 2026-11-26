import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn } from "storybook/test";
import "./confirmation.ts";
import type { LocalizedString } from "../../../lib/i18n/paraglide/runtime.js";
import "../layout/box.ts";
import type { UiConfirmation } from "./confirmation.ts";

const answer = (e: Event) => {
  const el = e.currentTarget as UiConfirmation;
  el.state = e.type === "ui-approve" ? "approved" : "denied";
};

const card = (content: unknown) => html`<ui-box width="md">${content}</ui-box>`;

const localized = (text: string) => text as LocalizedString;

const meta = preview.type<{ args: { details: string; onApprove: () => void; onDeny: () => void } }>().meta({
  title: "Primitives/Ai/Confirmation",
  component: "ui-confirmation",
  args: {
    label: "Cancel order 10482?",
    description: "The assistant wants to cancel this order and refund the card it was paid with.",
    details: "Two items, refunded in full.",
    state: "requested",
    approveLabel: localized("Cancel order"),
    denyLabel: localized("Keep order"),
    onApprove: fn(),
    onDeny: fn(),
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    details: { control: "text", description: "Extra detail shown under the description (its content)." },
    state: { control: "inline-radio", options: ["requested", "approved", "denied"] },
    approveLabel: { control: "text" },
    denyLabel: { control: "text" },
    onApprove: { table: { category: "events" } },
    onDeny: { table: { category: "events" } },
  },
  render: (args) =>
    card(
      html`<ui-confirmation
        label=${args.label}
        description=${args.description}
        state=${args.state}
        approve-label=${args.approveLabel}
        deny-label=${args.denyLabel}
        @ui-approve=${args.onApprove}
        @ui-deny=${args.onDeny}
        >${args.details}</ui-confirmation
      >`,
    ),
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the confirmation; each button fires its event." } },
  },
  play: async ({ canvas, userEvent, args }) => {
    const dialog = canvas.getByRole("alertdialog", { name: "Confirmation" });
    await expect(dialog).toHaveTextContent("Cancel order 10482?");
    await expect(dialog).toHaveTextContent("Two items, refunded in full.");
    await userEvent.click(canvas.getByRole("button", { name: "Cancel order" }));
    await expect(args.onApprove).toHaveBeenCalledOnce();
    await expect(args.onDeny).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "Keep order" }));
    await expect(args.onDeny).toHaveBeenCalledOnce();
    await expect(args.onApprove).toHaveBeenCalledOnce();
  },
});

export const Approved = meta.story({
  name: "Approved",
  args: { state: "approved" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("group", { name: "Confirmation" })).toHaveTextContent("Allowed");
    await expect(canvas.queryByRole("button")).not.toBeInTheDocument();
    await expect(canvas.queryByRole("alertdialog")).not.toBeInTheDocument();
  },
});

export const Denied = meta.story({
  name: "Denied",
  args: { state: "denied", details: "" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("group", { name: "Confirmation" })).toHaveTextContent("Not allowed");
    await expect(canvas.queryByRole("button")).not.toBeInTheDocument();
  },
});

export const Requested = meta.story({
  name: "Requested",
  parameters: {
    docs: {
      description: {
        story: "The assistant waits here until the person allows or denies the action; try either button.",
      },
    },
  },
  render: () =>
    card(
      html`<ui-confirmation
        label="Cancel order 10482?"
        description="The assistant wants to cancel this order and refund the card it was paid with."
        @ui-approve=${answer}
        @ui-deny=${answer}
      ></ui-confirmation>`,
    ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Allow" }));
    await expect(await canvas.findByRole("group", { name: "Confirmation" })).toHaveTextContent("Allowed");
  },
});

export const WithDetails = meta.story({
  name: "With details",
  render: () =>
    card(
      html`<ui-confirmation
        label="Change the delivery address"
        description="The parcel hasn't left the warehouse yet, so the address can still change."
        approve-label="Change address"
        deny-label="Keep current"
        @ui-approve=${answer}
        @ui-deny=${answer}
      >
        From 14 Station Road to 3 Mill Lane, apartment 2.
      </ui-confirmation>`,
    ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Keep current" }));
    await expect(await canvas.findByRole("group", { name: "Confirmation" })).toHaveTextContent("Not allowed");
  },
});

export const Answered = meta.story({
  name: "Answered",
  parameters: { docs: { description: { story: "Once answered, the buttons give way to the outcome." } } },
  render: () => html`
    ${card(
      html`<ui-confirmation
        state="approved"
        label="Cancel order 10482?"
        description="Refund to the card it was paid with."
      ></ui-confirmation>`,
    )}
    ${card(
      html`<ui-confirmation
        state="denied"
        label="Cancel order 10482?"
        description="Refund to the card it was paid with."
      ></ui-confirmation>`,
    )}
  `,
});

export const WithoutDescription = meta.story({
  name: "Without description",
  args: { description: "" },
  play: async ({ canvas }) => {
    const dialog = canvas.getByRole("alertdialog", { name: "Confirmation" });
    await expect(dialog).toHaveTextContent("Cancel order 10482?");
    await expect(dialog).not.toHaveTextContent("The assistant wants to cancel");
    await expect(dialog).toHaveTextContent("Two items, refunded in full.");
  },
});
