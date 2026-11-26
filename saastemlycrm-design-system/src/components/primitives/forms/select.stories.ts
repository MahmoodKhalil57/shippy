import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./field.ts";
import "./select.ts";
import type { SelectOption } from "./select.ts";

const countries: SelectOption[] = ["Canada", "Ireland", "New Zealand", "United Kingdom", "United States"];

const statuses: SelectOption[] = [
  { label: "Draft", value: "draft", tone: "neutral" },
  { label: "Confirmed", value: "confirmed", tone: "primary" },
  { label: "Shipped", value: "shipped", tone: "info" },
  { label: "Delivered", value: "delivered", tone: "success" },
  { label: "Delayed", value: "delayed", tone: "warning" },
  { label: "Cancelled", value: "cancelled", tone: "error" },
];

const teams: SelectOption[] = [
  { label: "Sales", value: "sales", hue: 0 },
  { label: "Support", value: "support", hue: 1 },
  { label: "Finance", value: "finance", hue: 2 },
  { label: "Operations", value: "operations", hue: 3 },
  { label: "Marketing", value: "marketing", hue: 4 },
  { label: "Legal", value: "legal", hue: 5 },
];

const shipping: SelectOption[] = [
  { label: "Standard, 3 to 5 days", value: "standard" },
  { label: "Express, next day", value: "express" },
  { label: "Same day (unavailable in your area)", value: "same-day", disabled: true },
];

const sizes: SelectOption[] = ["Small", "Medium", "Large"];

const regions: SelectOption[] = [{ label: "North" }, { label: "South" }];

const currencies: SelectOption[] = ["EUR", "USD"];

type FieldArgs = {
  fieldLabel: string;
  fieldHint: string;
  error: string;
  onChange: (e: Event) => void;
};

const meta = preview.type<{ args: FieldArgs }>().meta({
  title: "Primitives/Forms/Select",
  component: "ui-select",
  args: {
    fieldLabel: "Country",
    fieldHint: "",
    error: "",
    inputId: "sel-playground",
    options: countries,
    value: "",
    placeholder: "Choose a country",
    name: "country",
    color: undefined,
    variant: undefined,
    size: "md",
    width: "full",
    pickerHeight: undefined,
    native: false,
    validator: false,
    disabled: false,
    required: false,
    readonly: false,
    autocomplete: "country-name",
    leading: "",
    validatorHint: "",
    hintOnInvalid: false,
    onChange: fn(),
  },
  argTypes: {
    fieldLabel: { control: "text", description: "Label of the surrounding ui-field." },
    fieldHint: { control: "text", description: "Hint of the surrounding ui-field." },
    error: { control: "text", description: "Error of the surrounding ui-field." },
    inputId: { control: "text" },
    options: { control: "object" },
    value: { control: "text" },
    placeholder: { control: "text" },
    name: { control: "text" },
    color: {
      control: "select",
      options: [undefined, "neutral", "primary", "secondary", "accent", "info", "success", "warning", "error"],
    },
    variant: { control: "inline-radio", options: [undefined, "ghost"] },
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
    width: { control: "select", options: ["auto", "64", "xs", "sm", "md", "lg", "full"] },
    pickerHeight: { control: "inline-radio", options: [undefined, "26", "40", "60", "80"] },
    autocomplete: { control: "text" },
    leading: { control: "text" },
    validatorHint: { control: "text" },
    onChange: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-field
      label=${ifDefined(args.fieldLabel)}
      hint=${ifDefined(args.fieldHint)}
      error=${ifDefined(args.error)}
      control-id=${ifDefined(args.inputId)}
      ?required=${args.required}
      ?filled=${!!args.value}
    >
      <ui-select
        input-id=${ifDefined(args.inputId)}
        .options=${args.options ?? []}
        value=${ifDefined(args.value)}
        placeholder=${ifDefined(args.placeholder || undefined)}
        name=${ifDefined(args.name)}
        color=${ifDefined(args.color)}
        variant=${ifDefined(args.variant)}
        size=${ifDefined(args.size)}
        width=${ifDefined(args.width)}
        picker-height=${ifDefined(args.pickerHeight)}
        autocomplete=${ifDefined(args.autocomplete)}
        leading=${ifDefined(args.leading || undefined)}
        validator-hint=${ifDefined(args.validatorHint)}
        ?native=${args.native}
        ?validator=${args.validator}
        ?hint-on-invalid=${args.hintOnInvalid}
        ?disabled=${args.disabled}
        ?required=${args.required}
        ?readonly=${args.readonly}
        @change=${args.onChange}
      ></ui-select>
    </ui-field>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the select; choosing an option fires change." } } },
  play: async ({ canvas, userEvent, args, canvasElement }) => {
    const select = canvas.getByLabelText("Country");
    await expect(select).toHaveValue("");
    await expect(canvas.getByRole("option", { name: "Choose a country" })).toBeDisabled();
    await userEvent.selectOptions(select, "Ireland");
    await expect(select).toHaveValue("Ireland");
    await expect(canvas.getByRole("option", { name: "Ireland" })).toHaveProperty("selected", true);
    await expect(canvasElement.querySelector("ui-select")?.value).toBe("Ireland");
    await expect(args.onChange).toHaveBeenCalledOnce();
    await userEvent.selectOptions(select, "New Zealand");
    await expect(select).toHaveValue("New Zealand");
    await expect(args.onChange).toHaveBeenCalledTimes(2);
  },
});

export const Filled = meta.story({
  name: "Filled",
  args: { value: "Ireland" },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Country")).toHaveValue("Ireland");
  },
});

export const DisabledOption = meta.story({
  name: "Disabled option",
  args: { fieldLabel: "Shipping", options: shipping, value: "standard", placeholder: "", autocomplete: "off" },
  play: async ({ canvas, userEvent, args }) => {
    const select = canvas.getByRole("combobox", { name: "Shipping" });
    await expect(canvas.getByRole("option", { name: "Same day (unavailable in your area)" })).toBeDisabled();
    await userEvent.selectOptions(select, "express");
    await expect(select).toHaveValue("express");
    await expect(args.onChange).toHaveBeenCalledOnce();
  },
});

export const RequiredAndInvalid = meta.story({
  name: "Required, invalid with message",
  args: {
    required: true,
    validator: true,
    color: "error",
    error: "Choose the country to ship to.",
    validatorHint: "Pick a country.",
  },
  play: async ({ canvas, userEvent }) => {
    const select = canvas.getByLabelText("Country");
    await expect(select).toBeRequired();
    await expect(select).toBeInvalid();
    await expect(canvas.getByText("Required")).toBeInTheDocument();
    await expect(canvas.getByRole("status")).toHaveTextContent("Choose the country to ship to.");
    await userEvent.selectOptions(select, "Canada");
    await expect(select).toBeValid();
  },
});

export const Disabled = meta.story({
  name: "Disabled",
  args: { disabled: true, value: "Canada" },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByLabelText("Country")).toBeDisabled();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
});

export const ReadOnly = meta.story({
  name: "Read-only",
  args: { readonly: true, value: "Canada" },
  parameters: { docs: { description: { story: "Read-only keeps the choice fixed but focusable and submitted." } } },
  play: async ({ canvas, userEvent, args }) => {
    const select = canvas.getByRole("combobox", { name: "Country" });
    await expect(select).toHaveAttribute("aria-readonly", "true");
    await expect(select).toBeEnabled();
    await userEvent.selectOptions(select, "Ireland");
    await expect(select).toHaveValue("Canada");
    await expect(args.onChange).not.toHaveBeenCalled();
  },
});

export const NoValueNoPlaceholder = meta.story({
  name: "No value and no placeholder",
  args: { placeholder: "" },
  parameters: {
    docs: {
      description: {
        story: "The browser shows the first option; the value property stays empty until the user chooses.",
      },
    },
  },
  play: async ({ canvas, userEvent, canvasElement }) => {
    const host = canvasElement.querySelector("ui-select")!;
    const select = canvas.getByRole("combobox", { name: "Country" });
    await expect(select).toHaveValue("Canada");
    await expect(host.selectedValue).toBe("Canada");
    await expect(host.value).toBe("");
    await userEvent.selectOptions(select, "Ireland");
    await expect(host.value).toBe("Ireland");
  },
});

export const ToneDots = meta.story({
  name: "Tone dots",
  args: { fieldLabel: "Order status", options: statuses, value: "shipped", placeholder: "", autocomplete: "off" },
  play: async ({ canvas, userEvent }) => {
    const select = canvas.getByRole("combobox", { name: "Order status" });
    await expect(select).toHaveValue("shipped");
    await userEvent.selectOptions(select, canvas.getByRole("option", { name: "Delivered" }));
    await expect(select).toHaveValue("delivered");
  },
});

export const LeadingText = meta.story({
  name: "Leading text",
  args: { fieldLabel: "Size", options: sizes, value: "Medium", placeholder: "", leading: "Size", autocomplete: "off" },
  play: async ({ canvas, userEvent }) => {
    const select = canvas.getByLabelText("Size", { selector: "select" });
    await userEvent.selectOptions(select, "Large");
    await expect(select).toHaveValue("Large");
  },
});

export const HueDots = meta.story({
  name: "Hue dots",
  args: { fieldLabel: "Team", options: teams, value: "support", placeholder: "", autocomplete: "off" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("combobox", { name: "Team" })).toHaveValue("support");
    await expect(canvas.getAllByRole("option")).toHaveLength(6);
  },
});

export const InAField = meta.story({
  name: "In a field",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-field label="Country" control-id="sel-empty">
      <ui-select input-id="sel-empty" width="full" placeholder="Choose a country" .options=${countries}></ui-select>
    </ui-field>
    <ui-field label="Country" required filled control-id="sel-filled">
      <ui-select input-id="sel-filled" width="full" required value="Ireland" .options=${countries}></ui-select>
    </ui-field>
  `,
  play: async ({ canvas }) => {
    const [empty, filled] = canvas.getAllByRole("combobox");
    await expect(empty).toHaveAccessibleName("Country");
    await expect(empty).not.toHaveAttribute("aria-label");
    await expect(filled).toHaveAccessibleName("Country");
  },
});

export const OptionDots = meta.story({
  name: "Option dots",
  parameters: {
    docs: {
      description: { story: "Options can carry a status tone or a chart hue, drawn as a dot before the label." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Order status" control-id="sel-tone">
      <ui-select input-id="sel-tone" width="full" value="shipped" .options=${statuses}></ui-select>
    </ui-field>
    <ui-field label="Team" control-id="sel-hue">
      <ui-select input-id="sel-hue" width="full" value="support" .options=${teams}></ui-select>
    </ui-field>
  `,
});

export const DisabledOptionAndLeadingText = meta.story({
  name: "Disabled option and leading text",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-field label="Shipping method" control-id="sel-disabled-option">
      <ui-select input-id="sel-disabled-option" width="full" value="standard" .options=${shipping}></ui-select>
    </ui-field>
    <ui-select
      leading="Sort by"
      width="full"
      value="Newest"
      .options=${["Newest", "Oldest", "Highest total"]}
    ></ui-select>
  `,
});

export const Sizes = meta.story({
  name: "Sizes",
  render: () => html`
    <ui-select size="xs" aria-label="Extra small" .options=${sizes}></ui-select>
    <ui-select size="sm" aria-label="Small" .options=${sizes}></ui-select>
    <ui-select size="md" aria-label="Medium" .options=${sizes}></ui-select>
    <ui-select size="lg" aria-label="Large" .options=${sizes}></ui-select>
    <ui-select size="xl" aria-label="Extra large" .options=${sizes}></ui-select>
  `,
});

export const Colours = meta.story({
  name: "Colours",
  render: () => html`
    <ui-select color="neutral" placeholder="Neutral" .options=${sizes}></ui-select>
    <ui-select color="primary" placeholder="Primary" .options=${sizes}></ui-select>
    <ui-select color="secondary" placeholder="Secondary" .options=${sizes}></ui-select>
    <ui-select color="accent" placeholder="Accent" .options=${sizes}></ui-select>
    <ui-select color="info" placeholder="Info" .options=${sizes}></ui-select>
    <ui-select color="success" placeholder="Success" .options=${sizes}></ui-select>
    <ui-select color="warning" placeholder="Warning" .options=${sizes}></ui-select>
    <ui-select color="error" placeholder="Error" .options=${sizes}></ui-select>
    <ui-select variant="ghost" placeholder="Ghost" .options=${sizes}></ui-select>
  `,
});

export const States = meta.story({
  name: "States",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-field label="Warehouse" control-id="sel-disabled">
      <ui-select
        input-id="sel-disabled"
        width="full"
        disabled
        value="North"
        .options=${["North", "South", "East"]}
      ></ui-select>
    </ui-field>
    <ui-field
      label="Payment terms"
      required
      error="Choose payment terms before sending the invoice."
      control-id="sel-invalid"
    >
      <ui-select
        input-id="sel-invalid"
        width="full"
        required
        color="error"
        placeholder="Choose terms"
        .options=${["Due on receipt", "Net 15", "Net 30", "Net 60"]}
      ></ui-select>
    </ui-field>
  `,
});

export const OptionsAsContent = meta.story({
  name: "Options as content",
  parameters: {
    docs: { description: { story: "Without options the element's own option children are used." } },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Language" control-id="sel-content">
      <ui-select input-id="sel-content" width="full" value="fr">
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="es">Spanish</option>
      </ui-select>
    </ui-field>
  `,
});

export const BuiltInLabelFloatingLabelAndValidation = meta.story({
  name: "Built-in label, floating label and validation",
  parameters: { canvas: "column" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("combobox", { name: "Sales region" })).toHaveValue("Europe");
    await expect(canvas.getByRole("combobox", { name: "Currency" })).toBeInTheDocument();
    await expect(canvas.getByRole("combobox", { name: "Priority" })).toBeRequired();
  },
  render: () => html`
    <ui-select
      legend="Region"
      label="Sales region"
      hint="Decides which team receives new leads."
      width="full"
      field-width="full"
      field-surface="base-200"
      value="Europe"
      .options=${["Americas", "Europe", "Asia Pacific"]}
    ></ui-select>
    <ui-select
      floating
      label="Currency"
      placeholder="Currency"
      width="full"
      .options=${["US dollar", "Euro", "Pound sterling"]}
    ></ui-select>
    <ui-select
      legend="Priority"
      validator
      required
      placeholder="Choose a priority"
      validator-hint="Pick a priority."
      hint-on-invalid
      width="full"
      field-width="full"
      .options=${["Low", "Normal", "High", "Urgent"]}
    ></ui-select>
  `,
});

export const PickerHeightAndNativePicker = meta.story({
  name: "Picker height and native picker",
  parameters: {
    docs: { description: { story: "Picker height caps the open list; native keeps the platform's own dropdown." } },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Team (short list)" control-id="sel-picker">
      <ui-select input-id="sel-picker" width="full" picker-height="26" value="sales" .options=${teams}></ui-select>
    </ui-field>
    <ui-field label="Country (native)" control-id="sel-native">
      <ui-select input-id="sel-native" width="full" native value="Canada" .options=${countries}></ui-select>
    </ui-field>
  `,
});

export const MethodsAndDefaults = meta.story({
  name: "Methods and defaults",
  parameters: {
    docs: {
      description: {
        story:
          "An option without a value submits its label; focus, checkValidity, reportValidity and selectedValue reach the inner select; a floating label falls back to the placeholder.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-select aria-label="Region" required placeholder="Choose a region" .options=${regions}></ui-select>
    <ui-select floating placeholder="Currency" .options=${currencies}></ui-select>
  `,
  play: async ({ canvas, userEvent, canvasElement }) => {
    const host = canvasElement.querySelector("ui-select")!;
    const region = canvas.getByRole("combobox", { name: "Region" });
    host.focus();
    await expect(region).toHaveFocus();
    await expect(host.checkValidity()).toBe(false);
    await expect(host.reportValidity()).toBe(false);
    await expect(host.selectedValue).toBe("");
    await userEvent.selectOptions(region, "North");
    await expect(region).toHaveValue("North");
    await expect(host.value).toBe("North");
    await expect(host.selectedValue).toBe("North");
    await expect(host.checkValidity()).toBe(true);
    await expect(host.reportValidity()).toBe(true);
    const currency = canvas.getByRole("combobox", { name: "Currency" });
    await expect(currency.closest("label")).toHaveTextContent("Currency");
    const unrendered = document.createElement("ui-select");
    unrendered.value = "South";
    unrendered.focus();
    await expect(unrendered.selectedValue).toBe("South");
    await expect(unrendered.checkValidity()).toBe(true);
    await expect(unrendered.reportValidity()).toBe(true);
  },
});
