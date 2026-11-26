import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { createRef, ref } from "lit/directives/ref.js";
import { expect, fn, waitFor } from "storybook/test";
import "./fab.ts";
import "./button.ts";
import "./button-group.ts";
import "../media/icon.ts";
import "../typography/text.ts";
import { iconSvg } from "../media/icon.ts";
import type { FabVariants, UiFab } from "./fab.ts";
import type { ButtonGroupOption } from "./button-group.ts";

const fab = createRef<UiFab>();

const colours: ButtonGroupOption[] = [
  { value: "primary", label: "Primary" },
  { value: "tonal", label: "Tonal" },
];
const sizes: ButtonGroupOption[] = [
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];
const modes: ButtonGroupOption[] = [
  { value: "panel", label: "Opens a panel" },
  { value: "action", label: "Single action" },
];

const picked = (e: Event) => (e as CustomEvent<{ value: string }>).detail.value;

const meta = preview
  .type<{
    args: { body: string; onToggle: (e: Event) => void; onMain: (e: Event) => void };
  }>()
  .meta({
    title: "Primitives/Actions/Floating action button",
    component: "ui-fab",
    args: {
      triggerLabel: "Assistant",
      color: "primary",
      size: "md",
      panel: true,
      open: false,
      heading: "Assistant",
      body: "Ask about an invoice, a customer or this quarter's pipeline.",
      onToggle: fn(),
      onMain: fn(),
    },
    argTypes: {
      triggerLabel: { control: "text" },
      color: { control: "inline-radio", options: ["primary", "tonal"] },
      size: { control: "inline-radio", options: ["md", "lg"] },
      heading: { control: "text" },
      body: { control: "text", description: "The panel's content." },
      onToggle: { table: { category: "events" } },
      onMain: { table: { category: "events" } },
    },
    render: (args) => html`
      <ui-fab
        trigger-label=${ifDefined(args.triggerLabel)}
        color=${ifDefined(args.color)}
        size=${ifDefined(args.size)}
        heading=${ifDefined(args.heading as string | undefined)}
        ?panel=${args.panel}
        ?open=${args.open}
        @ui-toggle=${args.onToggle}
        @ui-main=${args.onMain}
      >
        <ui-icon slot="trigger" name="assistant"></ui-icon>
        <ui-text variant="body-md">${args.body}</ui-text>
      </ui-fab>
    `,
  });

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the FAB; pressing it toggles its panel and calls onToggle." } },
  },
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Assistant" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(canvas.queryByRole("dialog", { name: "Assistant" })).toBeNull();
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const dialog = await canvas.findByRole("dialog", { name: "Assistant" });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(args.onToggle).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(args.onToggle).toHaveBeenCalledTimes(2);
    await expect(args.onMain).not.toHaveBeenCalled();
  },
});

export const SingleAction = meta.story({
  name: "Single action",
  args: { panel: false, triggerLabel: "New invoice", color: "tonal" },
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "New invoice" });
    await expect(trigger).not.toHaveAttribute("aria-expanded");
    await userEvent.click(trigger);
    await expect(args.onMain).toHaveBeenCalledOnce();
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onMain).toHaveBeenCalledTimes(2);
    await expect(args.onToggle).not.toHaveBeenCalled();
  },
});

export const OpenedPanel = meta.story({
  name: "Opened panel",
  args: { open: true, size: "lg" },
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Assistant" });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => expect(canvas.getByRole("dialog", { name: "Assistant" })).toBeVisible());
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(args.onToggle).toHaveBeenCalledOnce();
  },
});

export const PanelOpen = meta.story({
  name: "Panel, open",
  parameters: {
    docs: {
      description: {
        story:
          "The FAB docks to the bottom-end corner of the viewport, so this page shows a single one; pressing it toggles its panel.",
      },
    },
  },
  render: () => html`
    <ui-fab ${ref(fab)} panel open heading="Assistant" trigger-label="Assistant">
      <ui-icon slot="trigger" name="assistant"></ui-icon>
      <ui-text variant="body-md">Ask about an invoice, a customer or this quarter's pipeline.</ui-text>
      <ui-text variant="body-sm" color="muted">Invoice INV-0042 for Ana Silva is due in 3 days.</ui-text>
      <ui-button slot="footer" color="primary" wide>Start a conversation</ui-button>
    </ui-fab>
  `,
});

export const ColourSizeAndMode = meta.story({
  name: "Colour, size and mode",
  parameters: {
    docs: {
      description: {
        story:
          "These controls restyle the one FAB in the corner; as a single action it fires ui-main instead of opening a panel.",
      },
    },
  },
  render: () => html`
    <ui-button-group
      label="Colour"
      value="primary"
      .options=${colours}
      @ui-change=${(e: Event) => fab.value && (fab.value.color = picked(e) as FabVariants["color"])}
    ></ui-button-group>
    <ui-button-group
      label="Size"
      value="md"
      .options=${sizes}
      @ui-change=${(e: Event) => fab.value && (fab.value.size = picked(e) as FabVariants["size"])}
    ></ui-button-group>
    <ui-button-group
      label="Mode"
      value="panel"
      .options=${modes}
      @ui-change=${(e: Event) => fab.value && (fab.value.panel = picked(e) === "panel")}
    ></ui-button-group>
  `,
});

export const InlinePosition = meta.story({
  name: "Inline position",
  parameters: {
    docs: {
      description: {
        story: 'position="inline" keeps each FAB in the flow where it is placed, so several sit side by side.',
      },
    },
  },
  render: () => html`
    <ui-fab position="inline" trigger-label="New invoice">
      <ui-icon slot="trigger" name="plus"></ui-icon>
    </ui-fab>
    <ui-fab position="inline" color="tonal" trigger-label="New customer">
      <ui-icon slot="trigger" name="edit"></ui-icon>
    </ui-fab>
  `,
  play: async ({ canvas }) => {
    const first = canvas.getByRole("button", { name: "New invoice" });
    const second = canvas.getByRole("button", { name: "New customer" });
    await expect(getComputedStyle(first.parentElement!).position).toBe("relative");
    const a = first.getBoundingClientRect();
    const b = second.getBoundingClientRect();
    const overlap = a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    await expect(overlap).toBe(false);
  },
});

export const TriggerProperty = meta.story({
  name: "Trigger property",
  parameters: { docs: { description: { story: "Without a trigger slot the trigger property fills the button." } } },
  render: (args) => html`
    <ui-fab position="inline" trigger-label="Compose" .trigger=${iconSvg("edit")} @ui-main=${args.onMain}></ui-fab>
  `,
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Compose" });
    await expect(trigger.querySelector("svg")).not.toBeNull();
    await userEvent.click(trigger);
    await expect(args.onMain).toHaveBeenCalledOnce();
  },
});
