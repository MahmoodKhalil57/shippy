import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./chip.ts";
import type { UiChip } from "./chip.ts";

const meta = preview
  .type<{ args: { text: string; onPress: (e: Event) => void; onRemove: (e: Event) => void } }>()
  .meta({
    title: "Primitives/Data/Chip",
    component: "ui-chip",
    args: {
      text: "Region: West",
      variant: "filter",
      size: "sm",
      pressable: true,
      removable: true,
      removeLabel: "Clear region filter" as UiChip["removeLabel"],
      disabled: false,
      onPress: fn(),
      onRemove: fn(),
    },
    argTypes: {
      text: { control: "text", description: "The chip's label (its content)." },
      variant: { control: "inline-radio", options: ["input", "filter"] },
      size: { control: "inline-radio", options: ["sm", "md"] },
      removeLabel: { control: "text" },
      onPress: { table: { category: "events" } },
      onRemove: { table: { category: "events" } },
    },
    render: (args) => html`
      <ui-chip
        variant=${ifDefined(args.variant)}
        size=${ifDefined(args.size)}
        ?pressable=${args.pressable}
        ?removable=${args.removable}
        remove-label=${ifDefined(args.removeLabel)}
        ?disabled=${args.disabled}
        @ui-press=${args.onPress}
        @ui-remove=${args.onRemove}
        >${args.text}</ui-chip
      >
    `,
  });

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: {
        story: "Every control drives the chip; the label fires ui-press and the remove button ui-remove.",
      },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Region: West" }));
    await expect(args.onPress).toHaveBeenCalledOnce();
    await expect(args.onRemove).not.toHaveBeenCalled();
    const remove = canvas.getByRole("button", { name: "Clear region filter" });
    remove.focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onRemove).toHaveBeenCalledOnce();
    await expect(args.onPress).toHaveBeenCalledOnce();
  },
});

export const RemoveOnly = meta.story({
  name: "Removable input",
  args: {
    variant: "input",
    pressable: false,
    text: "Wholesale",
    removeLabel: "Remove Wholesale" as UiChip["removeLabel"],
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.queryByRole("button", { name: "Wholesale" })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Remove Wholesale" }));
    await expect(args.onRemove).toHaveBeenCalledOnce();
  },
});

export const DisabledChip = meta.story({
  name: "Disabled",
  args: { disabled: true, text: "Owner: Anyone" },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole("button", { name: "Owner: Anyone" })).toBeDisabled();
    await expect(canvas.queryByRole("button", { name: "Clear region filter" })).toBeNull();
    await expect(args.onPress).not.toHaveBeenCalled();
  },
});

export const InputChips = meta.story({
  name: "Input chips",
  render: () => html`
    <ui-chip>Wholesale</ui-chip>
    <ui-chip>Net 30</ui-chip>
    <ui-chip size="md">North region</ui-chip>
    <ui-chip size="md">Priority account</ui-chip>
  `,
});

export const Removable = meta.story({
  name: "Removable",
  parameters: {
    docs: {
      description: {
        story: "The remove button fires ui-remove and is named by remove-label; a disabled chip hides it.",
      },
    },
  },
  render: () => html`
    <ui-chip removable remove-label="Remove Wholesale">Wholesale</ui-chip>
    <ui-chip removable size="md" remove-label="Remove Net 30">Net 30</ui-chip>
    <ui-chip removable disabled>Archived</ui-chip>
  `,
});

export const FilterChips = meta.story({
  name: "Filter chips",
  render: () => html`
    <ui-chip variant="filter" pressable>Status: Open</ui-chip>
    <ui-chip variant="filter" pressable removable remove-label="Clear region filter">Region: West</ui-chip>
    <ui-chip variant="filter" size="md" pressable removable remove-label="Clear amount filter"
      >Amount over 5,000</ui-chip
    >
    <ui-chip variant="filter" pressable disabled>Owner: Anyone</ui-chip>
  `,
});

export const Pressable = meta.story({
  name: "Pressable",
  parameters: {
    docs: { description: { story: "A pressable chip renders its label as a button that fires ui-press." } },
  },
  render: () => html`
    <ui-chip pressable>Show paid</ui-chip>
    <ui-chip pressable removable remove-label="Remove Overdue">Overdue</ui-chip>
    <ui-chip pressable disabled>Unavailable</ui-chip>
  `,
});

export const LongLabels = meta.story({
  name: "Long labels",
  render: () => html`
    <ui-chip removable remove-label="Remove filter"
      >Invoices issued in the last quarter to customers in the eastern sales region</ui-chip
    >
    <ui-chip variant="filter" pressable removable remove-label="Clear filter"
      >Orders shipped late from the central warehouse</ui-chip
    >
  `,
});
