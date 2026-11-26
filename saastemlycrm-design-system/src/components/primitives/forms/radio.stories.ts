import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./field.ts";
import "./radio.ts";
import type { RadioOption } from "./radio.ts";

const delivery: RadioOption[] = [
  { label: "Standard, 3 to 5 days", value: "standard" },
  { label: "Express, next day", value: "express" },
  { label: "Collect from store", value: "collect" },
  { label: "Same day (unavailable)", value: "same-day", disabled: true },
];

const contact: RadioOption[] = ["Email", "Phone", "Text message"];

const meta = preview.type<{ args: { onChange: (e: Event) => void } }>().meta({
  title: "Primitives/Forms/Radio",
  component: "ui-radio",
  args: {
    legend: "Delivery",
    options: delivery,
    value: "standard",
    name: "delivery",
    color: "primary",
    size: "md",
    direction: "vertical",
    checked: false,
    disabled: false,
    required: false,
    validator: false,
    label: "",
    hint: "",
    validatorHint: "",
    onChange: fn(),
  },
  argTypes: {
    options: { control: "object" },
    value: { control: "text" },
    name: { control: "text" },
    label: { control: "text", description: "Label of a single radio (used when options is empty)." },
    legend: { control: "text" },
    hint: { control: "text" },
    validatorHint: { control: "text" },
    color: {
      control: "select",
      options: ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "error"],
    },
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
    direction: { control: "inline-radio", options: ["vertical", "horizontal"] },
    fieldSurface: { control: "inline-radio", options: ["base-100", "base-200"] },
    fieldWidth: { control: "select", options: ["auto", "64", "xs", "sm", "md", "lg", "full"] },
    onChange: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-radio
      .options=${args.options ?? []}
      value=${ifDefined(args.value)}
      name=${ifDefined(args.name)}
      label=${ifDefined(args.label)}
      legend=${ifDefined(args.legend)}
      hint=${ifDefined(args.hint)}
      validator-hint=${ifDefined(args.validatorHint)}
      color=${ifDefined(args.color)}
      size=${ifDefined(args.size)}
      direction=${ifDefined(args.direction)}
      field-surface=${ifDefined(args.fieldSurface)}
      field-width=${ifDefined(args.fieldWidth)}
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      ?required=${args.required}
      ?validator=${args.validator}
      @change=${args.onChange}
    ></ui-radio>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the group; click or arrow keys move the choice." } },
  },
  play: async ({ canvas, userEvent, args, canvasElement }) => {
    const standard = canvas.getByRole("radio", { name: "Standard, 3 to 5 days" });
    const express = canvas.getByRole("radio", { name: "Express, next day" });
    const collect = canvas.getByRole("radio", { name: "Collect from store" });
    await expect(canvas.getByRole("group", { name: "Delivery" })).toBeInTheDocument();
    await expect(standard).toBeChecked();
    await expect(canvas.getByRole("radio", { name: "Same day (unavailable)" })).toBeDisabled();
    await userEvent.click(express);
    await expect(express).toBeChecked();
    await expect(standard).not.toBeChecked();
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(canvasElement.querySelector("ui-radio")?.value).toBe("express");
    await userEvent.keyboard("{ArrowDown}");
    await expect(collect).toBeChecked();
    await expect(collect).toHaveFocus();
    await expect(canvasElement.querySelector("ui-radio")?.value).toBe("collect");
    await userEvent.keyboard("{ArrowUp}");
    await expect(express).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(3);
    await userEvent.click(canvas.getByText("Standard, 3 to 5 days"));
    await expect(standard).toBeChecked();
  },
});

export const Empty = meta.story({
  name: "Empty",
  args: { value: "" },
  play: async ({ canvas }) => {
    for (const radio of canvas.getAllByRole("radio")) await expect(radio).not.toBeChecked();
  },
});

export const Horizontal = meta.story({
  name: "Horizontal",
  args: { legend: "Preferred contact", options: contact, value: "Email", direction: "horizontal", name: "contact" },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("radio", { name: "Email" })).toBeChecked();
    await userEvent.click(canvas.getByRole("radio", { name: "Text message" }));
    await expect(canvas.getByRole("radio", { name: "Text message" })).toBeChecked();
    await expect(canvas.getByRole("radio", { name: "Email" })).not.toBeChecked();
  },
});

export const Disabled = meta.story({
  name: "Disabled",
  args: { disabled: true },
  play: async ({ canvas, args }) => {
    for (const radio of canvas.getAllByRole("radio")) await expect(radio).toBeDisabled();
    await expect(canvas.getByRole("radio", { name: "Standard, 3 to 5 days" })).toBeChecked();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
});

export const RequiredWithValidator = meta.story({
  name: "Required with validator",
  args: { value: "", required: true, validator: true, validatorHint: "Choose how you want to receive your order." },
  play: async ({ canvas, userEvent }) => {
    const standard = canvas.getByRole("radio", { name: "Standard, 3 to 5 days" });
    await expect(standard).toBeRequired();
    await expect(standard).toBeInvalid();
    await expect(canvas.getByText("Choose how you want to receive your order.")).toBeInTheDocument();
    await userEvent.click(standard);
    await expect(standard).toBeValid();
  },
});

export const Single = meta.story({
  name: "Single",
  args: { options: [], legend: "", value: "", name: "terms", label: "Use my billing address" },
  play: async ({ canvas, userEvent, args }) => {
    const radio = canvas.getByRole("radio", { name: "Use my billing address" });
    await expect(radio).not.toBeChecked();
    await userEvent.click(radio);
    await expect(radio).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledOnce();
  },
});

export const SingleNaming = meta.story({
  name: "Single, naming",
  parameters: {
    docs: {
      description: {
        story:
          "A single radio takes its name from its text content, from aria-label (its text then describes it), or from its legend.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-radio name="ship" value="store">Collect in store</ui-radio>
    <ui-radio name="pay" aria-label="Billing address" label="Same as delivery"></ui-radio>
    <ui-radio name="gift" legend="Gift wrap"></ui-radio>
  `,
  play: async ({ canvas, userEvent }) => {
    const store = canvas.getByRole("radio", { name: "Collect in store" });
    await expect(store).toHaveAttribute("value", "store");
    await userEvent.click(canvas.getByText("Collect in store"));
    await expect(store).toBeChecked();
    const billing = canvas.getByRole("radio", { name: "Billing address" });
    await expect(billing).toHaveAccessibleDescription("Same as delivery");
    const gift = canvas.getByRole("radio", { name: "Gift wrap" });
    await expect(gift).toHaveAttribute("value", "on");
    await expect(gift.closest("label")).toBeNull();
  },
});

export const Group = meta.story({
  name: "Group",
  parameters: {
    docs: { description: { story: "Options share one name, so arrow keys move the choice within the group." } },
    canvas: "column",
  },
  render: () => html`
    <ui-radio legend="Delivery" value="express" .options=${delivery}></ui-radio>
    <ui-radio legend="Preferred contact" direction="horizontal" value="Email" .options=${contact}></ui-radio>
  `,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("radiogroup", { name: "Delivery" })).toBeInTheDocument();
    await expect(canvas.getByRole("radiogroup", { name: "Preferred contact" })).toBeInTheDocument();
  },
});

export const GroupAriaLabel = meta.story({
  name: "Group named by aria-label",
  parameters: { docs: { description: { story: "In options mode aria-label names the radiogroup." } } },
  render: () => html`<ui-radio aria-label="Invoice format" value="PDF" .options=${["PDF", "CSV"]}></ui-radio>`,
  play: async ({ canvas }) => {
    const group = canvas.getByRole("radiogroup", { name: "Invoice format" });
    await expect(group).toHaveAccessibleName("Invoice format");
    await expect(canvas.getByRole("radio", { name: "PDF" })).toBeChecked();
  },
});

export const InAField = meta.story({
  name: "In a field",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-field label="Preferred contact" required filled control-id="radio-contact">
      <ui-radio input-id="radio-contact" direction="horizontal" value="Phone" .options=${contact}></ui-radio>
    </ui-field>
    <ui-field label="Delivery" required error="Choose how you want to receive your order." control-id="radio-delivery">
      <ui-radio input-id="radio-delivery" required color="error" .options=${delivery}></ui-radio>
    </ui-field>
  `,
  play: async ({ canvas }) => {
    const contactGroup = canvas.getByRole("radiogroup", { name: "Preferred contact" });
    await expect(contactGroup).toHaveAttribute("id", "radio-contact");
    await expect(canvas.getByRole("radiogroup", { name: "Delivery" })).toHaveAttribute("id", "radio-delivery");
  },
});

export const Colours = meta.story({
  name: "Colours",
  render: () => html`
    <ui-radio checked color="neutral" label="Neutral"></ui-radio>
    <ui-radio checked color="primary" label="Primary"></ui-radio>
    <ui-radio checked color="secondary" label="Secondary"></ui-radio>
    <ui-radio checked color="accent" label="Accent"></ui-radio>
    <ui-radio checked color="info" label="Info"></ui-radio>
    <ui-radio checked color="success" label="Success"></ui-radio>
    <ui-radio checked color="warning" label="Warning"></ui-radio>
    <ui-radio checked color="error" label="Error"></ui-radio>
  `,
});

export const Sizes = meta.story({
  name: "Sizes",
  render: () => html`
    <ui-radio checked size="xs" label="Extra small"></ui-radio>
    <ui-radio checked size="sm" label="Small"></ui-radio>
    <ui-radio checked size="md" label="Medium"></ui-radio>
    <ui-radio checked size="lg" label="Large"></ui-radio>
    <ui-radio checked size="xl" label="Extra large"></ui-radio>
  `,
});

export const States = meta.story({
  name: "States",
  render: () => html`
    <ui-radio label="Unchecked"></ui-radio>
    <ui-radio checked label="Checked"></ui-radio>
    <ui-radio disabled label="Disabled"></ui-radio>
    <ui-radio disabled checked label="Disabled, checked"></ui-radio>
    <ui-radio disabled value="Email" direction="horizontal" .options=${contact}></ui-radio>
  `,
});

export const FieldsetSurfaceAndHint = meta.story({
  name: "Fieldset surface and hint",
  parameters: { canvas: "column" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("radiogroup", { name: "Invoice format" })).toBeInTheDocument();
    await expect(canvas.getByRole("radio", { name: "PDF" })).toBeChecked();
    await expect(canvas.getByRole("radiogroup", { name: "Billing cycle" })).toBeInTheDocument();
  },
  render: () => html`
    <ui-radio
      legend="Invoice format"
      hint="Sent with every order confirmation."
      field-surface="base-200"
      field-width="full"
      value="PDF"
      .options=${["PDF", "CSV", "Paper copy"]}
    ></ui-radio>
    <ui-radio
      legend="Billing cycle"
      validator
      required
      validator-hint="Choose a billing cycle."
      field-width="full"
      direction="horizontal"
      .options=${["Monthly", "Quarterly", "Yearly"]}
    ></ui-radio>
  `,
});
