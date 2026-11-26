import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./field.ts";
import "./switch.ts";

const meta = preview.type<{ args: { onChange: (e: Event) => void } }>().meta({
  title: "Primitives/Forms/Switch",
  component: "ui-switch",
  args: {
    label: "Pause new order emails",
    size: "md",
    checked: false,
    disabled: false,
    labelStart: false,
    name: "away",
    legend: "",
    hint: "",
    onChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    size: { control: "inline-radio", options: ["sm", "md"] },
    name: { control: "text" },
    legend: { control: "text" },
    hint: { control: "text" },
    onChange: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-switch
      label=${ifDefined(args.label)}
      size=${ifDefined(args.size)}
      name=${ifDefined(args.name)}
      legend=${ifDefined(args.legend)}
      hint=${ifDefined(args.hint)}
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      ?label-start=${args.labelStart}
      @change=${args.onChange}
    ></ui-switch>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the switch; click or Space flips it." } } },
  play: async ({ canvas, userEvent, args }) => {
    const toggle = canvas.getByRole("switch", { name: "Pause new order emails" });
    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(toggle).not.toBeChecked();
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    await expect(args.onChange).toHaveBeenCalledTimes(2);
    await userEvent.click(canvas.getByText("Pause new order emails"));
    await expect(toggle).toBeChecked();
  },
});

export const On = meta.story({
  name: "On",
  args: { checked: true },
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch", { name: "Pause new order emails" });
    await expect(toggle).toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).not.toBeChecked();
  },
});

export const Disabled = meta.story({
  name: "Disabled",
  args: { disabled: true, checked: true },
  play: async ({ canvas, args }) => {
    const toggle = canvas.getByRole("switch", { name: "Pause new order emails" });
    await expect(toggle).toBeDisabled();
    await expect(toggle).toBeChecked();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
});

export const WithLegendAndHint = meta.story({
  name: "With legend and hint",
  args: { legend: "Away mode", hint: "Orders still arrive; you just won't be emailed about them." },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("group", { name: "Away mode" })).toBeInTheDocument();
    await expect(canvas.getByText("Orders still arrive; you just won't be emailed about them.")).toBeInTheDocument();
    const toggle = canvas.getByRole("switch", { name: "Pause new order emails" });
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
  },
});

export const States = meta.story({
  name: "States",
  parameters: { docs: { description: { story: "The switch is announced as a switch with its on or off state." } } },
  render: () => html`
    <ui-switch label="Off"></ui-switch>
    <ui-switch checked label="On"></ui-switch>
    <ui-switch disabled label="Disabled"></ui-switch>
    <ui-switch disabled checked label="Disabled, on"></ui-switch>
  `,
});

export const Sizes = meta.story({
  name: "Sizes",
  render: () => html`
    <ui-switch checked size="sm" label="Small"></ui-switch>
    <ui-switch checked size="md" label="Medium"></ui-switch>
  `,
});

export const LabelPlacementAndContent = meta.story({
  name: "Label placement and content",
  render: () => html`
    <ui-switch label-start checked label="Label first"></ui-switch>
    <ui-switch>Show <strong>archived</strong> orders</ui-switch>
    <ui-switch aria-label="Enable two-factor sign-in" checked></ui-switch>
  `,
});

export const InAField = meta.story({
  name: "In a field",
  parameters: {
    docs: { description: { story: "In a field the switch's own label shows the current value." } },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Taxable" control-id="sw-taxable">
      <ui-switch input-id="sw-taxable" checked label="Yes"></ui-switch>
    </ui-field>
    <ui-field label="Gift wrap" control-id="sw-gift">
      <ui-switch input-id="sw-gift" label="No"></ui-switch>
    </ui-field>
  `,
  play: async ({ canvas, userEvent }) => {
    const gift = canvas.getByRole("switch", { name: /^Gift wrap/ });
    await expect(gift).toHaveAttribute("id", "sw-gift");
    await userEvent.click(canvas.getByText("Gift wrap", { selector: "label" }));
    await expect(gift).toBeChecked();
    await expect(canvas.getByRole("switch", { name: /^Taxable/ })).toBeChecked();
  },
});

export const AriaLabelAndVisibleLabel = meta.story({
  name: "Aria-label with a visible label",
  parameters: {
    docs: {
      description: { story: "aria-label names the switch; its visible label (the current value) describes it." },
    },
  },
  render: () => html`<ui-switch aria-label="Notifications" checked label="Yes"></ui-switch>`,
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch", { name: "Notifications" });
    await expect(toggle).toHaveAccessibleName("Notifications");
    await expect(toggle).toHaveAccessibleDescription("Yes");
    await userEvent.click(canvas.getByText("Yes"));
    await expect(toggle).not.toBeChecked();
  },
});

export const FieldsetWithLegendAndHint = meta.story({
  name: "Fieldset with legend and hint",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-switch
      legend="Away mode"
      label="Pause new order emails"
      hint="Orders still arrive; you just won't be emailed about them."
    ></ui-switch>
  `,
});

export const NamedByLegend = meta.story({
  name: "Named by legend",
  parameters: {
    docs: { description: { story: "A switch with only a legend is named by it; focus() moves focus to the switch." } },
  },
  render: () => html`<ui-switch legend="Auto-renew" name="renew"></ui-switch>`,
  play: async ({ canvas, canvasElement }) => {
    const renew = canvas.getByRole("switch", { name: "Auto-renew" });
    await expect(renew).toHaveAttribute("aria-labelledby");
    await expect(renew.closest("label")).toBeNull();
    canvasElement.querySelector("ui-switch")!.focus();
    await expect(renew).toHaveFocus();
    const unrendered = document.createElement("ui-switch");
    await expect(() => unrendered.focus()).not.toThrow();
  },
});
