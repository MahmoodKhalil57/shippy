import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./checkbox.ts";
import "./field.ts";

const meta = preview.type<{ args: { onChange: (e: Event) => void } }>().meta({
  title: "Primitives/Forms/Checkbox",
  component: "ui-checkbox",
  args: {
    label: "Email me when an order ships",
    color: "primary",
    size: "md",
    checked: false,
    indeterminate: false,
    disabled: false,
    required: false,
    validator: false,
    labelStart: false,
    name: "notify",
    value: "on",
    legend: "",
    hint: "",
    validatorHint: "",
    onChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    color: {
      control: "select",
      options: ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "error"],
    },
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
    name: { control: "text" },
    value: { control: "text" },
    legend: { control: "text" },
    hint: { control: "text" },
    validatorHint: { control: "text" },
    fieldSurface: { control: "inline-radio", options: ["base-100", "base-200"] },
    fieldWidth: { control: "select", options: ["auto", "64", "xs", "sm", "md", "lg", "full"] },
    onChange: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-checkbox
      label=${ifDefined(args.label)}
      color=${ifDefined(args.color)}
      size=${ifDefined(args.size)}
      name=${ifDefined(args.name)}
      value=${ifDefined(args.value)}
      legend=${ifDefined(args.legend)}
      hint=${ifDefined(args.hint)}
      validator-hint=${ifDefined(args.validatorHint)}
      field-surface=${ifDefined(args.fieldSurface)}
      field-width=${ifDefined(args.fieldWidth)}
      ?checked=${args.checked}
      ?indeterminate=${args.indeterminate}
      ?disabled=${args.disabled}
      ?required=${args.required}
      ?validator=${args.validator}
      ?label-start=${args.labelStart}
      @change=${args.onChange}
    ></ui-checkbox>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the checkbox; toggling it fires change." } } },
  play: async ({ canvas, userEvent, args }) => {
    const box = canvas.getByRole("checkbox", { name: "Email me when an order ships" });
    await expect(box).not.toBeChecked();
    await userEvent.click(box);
    await expect(box).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(box).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(box).not.toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(2);
    await userEvent.click(canvas.getByText("Email me when an order ships"));
    await expect(box).toBeChecked();
  },
});

export const Checked = meta.story({
  name: "Checked",
  args: { checked: true },
  play: async ({ canvas, userEvent, args }) => {
    const box = canvas.getByRole("checkbox", { name: "Email me when an order ships" });
    await expect(box).toBeChecked();
    await userEvent.click(box);
    await expect(box).not.toBeChecked();
    await expect(args.onChange).toHaveBeenCalledOnce();
  },
});

export const Indeterminate = meta.story({
  name: "Indeterminate",
  args: { indeterminate: true, label: "Select all orders" },
  play: async ({ canvas, userEvent }) => {
    const box = canvas.getByRole("checkbox", { name: "Select all orders" });
    await expect(box).toBePartiallyChecked();
    await userEvent.click(box);
    await expect(box).not.toBePartiallyChecked();
    await expect(box).toBeChecked();
  },
});

export const Disabled = meta.story({
  name: "Disabled",
  args: { disabled: true, checked: true },
  play: async ({ canvas, args }) => {
    const box = canvas.getByRole("checkbox", { name: "Email me when an order ships" });
    await expect(box).toBeDisabled();
    await expect(box).toBeChecked();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
});

export const RequiredWithValidator = meta.story({
  name: "Required with validator",
  args: {
    required: true,
    validator: true,
    label: "I agree to the terms of sale",
    validatorHint: "Accept the terms to place your order.",
  },
  play: async ({ canvas, userEvent }) => {
    const box = canvas.getByRole("checkbox", { name: "I agree to the terms of sale" });
    await expect(box).toBeRequired();
    await expect(box).toBeInvalid();
    await expect(canvas.getByText("Accept the terms to place your order.")).toBeInTheDocument();
    await userEvent.click(box);
    await expect(box).toBeValid();
  },
});

export const WithLegendAndHint = meta.story({
  name: "With legend and hint",
  args: { legend: "Notifications", hint: "You can change this later.", fieldSurface: "base-100", fieldWidth: "full" },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("group", { name: "Notifications" })).toBeInTheDocument();
    await expect(canvas.getByText("You can change this later.")).toBeInTheDocument();
    const box = canvas.getByRole("checkbox", { name: "Email me when an order ships" });
    await userEvent.click(box);
    await expect(box).toBeChecked();
  },
});

export const States = meta.story({
  name: "States",
  parameters: {
    docs: { description: { story: "Indeterminate shows a dash until the box is clicked, then becomes checked." } },
  },
  render: () => html`
    <ui-checkbox label="Unchecked"></ui-checkbox>
    <ui-checkbox checked label="Checked"></ui-checkbox>
    <ui-checkbox indeterminate label="Some selected"></ui-checkbox>
    <ui-checkbox disabled label="Disabled"></ui-checkbox>
    <ui-checkbox disabled checked label="Disabled, checked"></ui-checkbox>
  `,
});

export const Colours = meta.story({
  name: "Colours",
  render: () => html`
    <ui-checkbox checked color="neutral" label="Neutral"></ui-checkbox>
    <ui-checkbox checked color="primary" label="Primary"></ui-checkbox>
    <ui-checkbox checked color="secondary" label="Secondary"></ui-checkbox>
    <ui-checkbox checked color="accent" label="Accent"></ui-checkbox>
    <ui-checkbox checked color="info" label="Info"></ui-checkbox>
    <ui-checkbox checked color="success" label="Success"></ui-checkbox>
    <ui-checkbox checked color="warning" label="Warning"></ui-checkbox>
    <ui-checkbox checked color="error" label="Error"></ui-checkbox>
  `,
});

export const Sizes = meta.story({
  name: "Sizes",
  render: () => html`
    <ui-checkbox checked size="xs" label="Extra small"></ui-checkbox>
    <ui-checkbox checked size="sm" label="Small"></ui-checkbox>
    <ui-checkbox checked size="md" label="Medium"></ui-checkbox>
    <ui-checkbox checked size="lg" label="Large"></ui-checkbox>
    <ui-checkbox checked size="xl" label="Extra large"></ui-checkbox>
  `,
});

export const LabelPlacementAndContent = meta.story({
  name: "Label placement and content",
  parameters: {
    docs: {
      description: {
        story: "A label can sit before the box, come from the element's children, or be only an aria-label.",
      },
    },
  },
  render: () => html`
    <ui-checkbox label-start label="Label first"></ui-checkbox>
    <ui-checkbox checked>Send me the <strong>weekly</strong> order summary</ui-checkbox>
    <ui-checkbox aria-label="Select order ORD-48213"></ui-checkbox>
  `,
});

export const InAField = meta.story({
  name: "In a field",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-field label="Notifications" control-id="cb-ships">
      <ui-checkbox input-id="cb-ships" checked label="Email me when an order ships"></ui-checkbox>
    </ui-field>
    <ui-field label="Terms" required error="Accept the terms to place your order." control-id="cb-terms">
      <ui-checkbox input-id="cb-terms" required color="error" label="I agree to the terms of sale"></ui-checkbox>
    </ui-field>
  `,
  play: async ({ canvas, userEvent }) => {
    const ships = canvas.getByRole("checkbox", { name: /^Notifications/ });
    await expect(ships).toHaveAttribute("id", "cb-ships");
    await expect(canvas.getByText("Notifications", { selector: "label" })).toHaveAttribute("for", "cb-ships");
    await userEvent.click(canvas.getByText("Terms", { selector: "label" }));
    await expect(canvas.getByRole("checkbox", { name: /^Terms/ })).toBeChecked();
  },
});

export const AriaLabelAndVisibleLabel = meta.story({
  name: "Aria-label with a visible label",
  parameters: {
    docs: { description: { story: "aria-label names the checkbox; the visible label then describes it." } },
  },
  render: () => html`<ui-checkbox aria-label="Newsletter" label="Yes, send it weekly"></ui-checkbox>`,
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: "Newsletter" });
    await expect(box).toHaveAccessibleName("Newsletter");
    await expect(box).toHaveAccessibleDescription("Yes, send it weekly");
  },
});

export const FieldsetWithLegendAndHint = meta.story({
  name: "Fieldset with legend and hint",
  parameters: { canvas: "column" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("checkbox", { name: "Send me news and offers" })).not.toBeChecked();
    await expect(canvas.getByRole("checkbox", { name: "I confirm the billing details are correct" })).toBeRequired();
  },
  render: () => html`
    <ui-checkbox
      legend="Marketing"
      label="Send me news and offers"
      hint="You can unsubscribe at any time."
      field-surface="base-200"
      field-width="full"
    ></ui-checkbox>
    <ui-checkbox
      legend="Consent"
      validator
      required
      label="I confirm the billing details are correct"
      validator-hint="Confirm the billing details to continue."
      field-width="full"
    ></ui-checkbox>
  `,
});

export const NamedByLegend = meta.story({
  name: "Named by legend",
  parameters: {
    docs: { description: { story: "A checkbox with only a legend is named by it; focus() moves focus to the box." } },
  },
  render: () => html`<ui-checkbox legend="Gift wrap" name="gift"></ui-checkbox>`,
  play: async ({ canvas, canvasElement }) => {
    const gift = canvas.getByRole("checkbox", { name: "Gift wrap" });
    await expect(gift).toHaveAttribute("aria-labelledby");
    await expect(gift.closest("label")).toBeNull();
    canvasElement.querySelector("ui-checkbox")!.focus();
    await expect(gift).toHaveFocus();
    const unrendered = document.createElement("ui-checkbox");
    await expect(() => unrendered.focus()).not.toThrow();
  },
});
