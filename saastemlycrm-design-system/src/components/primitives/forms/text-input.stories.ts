import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./field.ts";
import "./text-input.ts";

const sample = { name: "Harbor Street Supplies", email: "alex.morgan@example.com", short: "AB" };

type FieldArgs = {
  fieldLabel: string;
  fieldHint: string;
  error: string;
  onInput: (e: Event) => void;
  onChange: (e: Event) => void;
};

const meta = preview.type<{ args: FieldArgs }>().meta({
  title: "Primitives/Forms/Text input",
  component: "ui-text-input",
  args: {
    fieldLabel: "Company name",
    fieldHint: "As it appears on invoices.",
    error: "",
    inputId: "ti-playground",
    type: "text",
    name: "company",
    value: "",
    placeholder: "Company name",
    color: undefined,
    variant: undefined,
    size: "md",
    width: "full",
    icon: undefined,
    leading: "",
    trailing: "",
    tabular: false,
    validator: false,
    disabled: false,
    required: false,
    readonly: false,
    minlength: undefined,
    maxlength: undefined,
    pattern: "",
    patternTitle: "",
    min: "",
    max: "",
    step: "",
    autocomplete: "organization",
    inputmode: undefined,
    suggestions: [],
    validatorHint: "",
    hintOnInvalid: false,
    onInput: fn(),
    onChange: fn(),
  },
  argTypes: {
    fieldLabel: { control: "text", description: "Label of the surrounding ui-field." },
    fieldHint: { control: "text", description: "Hint of the surrounding ui-field." },
    error: { control: "text", description: "Error of the surrounding ui-field." },
    inputId: { control: "text" },
    type: {
      control: "select",
      options: [
        "text",
        "email",
        "password",
        "search",
        "url",
        "tel",
        "number",
        "date",
        "time",
        "datetime-local",
        "month",
        "week",
      ],
    },
    name: { control: "text" },
    value: { control: "text" },
    placeholder: { control: "text" },
    color: {
      control: "select",
      options: [undefined, "neutral", "primary", "secondary", "accent", "info", "success", "warning", "error"],
    },
    variant: { control: "inline-radio", options: [undefined, "ghost"] },
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
    width: { control: "select", options: ["fill", "auto", "64", "xs", "sm", "md", "lg", "full"] },
    icon: { control: "select", options: [undefined, "file", "user", "mail", "key", "phone", "link"] },
    leading: { control: "text" },
    trailing: { control: "text" },
    minlength: { control: { type: "number", min: 0, step: 1 } },
    maxlength: { control: { type: "number", min: 0, step: 1 } },
    pattern: { control: "text" },
    patternTitle: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
    step: { control: "text" },
    autocomplete: { control: "text" },
    inputmode: {
      control: "select",
      options: [undefined, "text", "numeric", "decimal", "tel", "email", "url", "search", "none"],
    },
    suggestions: { control: "object" },
    validatorHint: { control: "text" },
    onInput: { table: { category: "events" } },
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
      ?readonly=${args.readonly}
    >
      <ui-text-input
        input-id=${ifDefined(args.inputId)}
        type=${ifDefined(args.type)}
        name=${ifDefined(args.name)}
        value=${ifDefined(args.value)}
        placeholder=${ifDefined(args.placeholder || undefined)}
        color=${ifDefined(args.color)}
        variant=${ifDefined(args.variant)}
        size=${ifDefined(args.size)}
        width=${ifDefined(args.width)}
        icon=${ifDefined(args.icon)}
        leading=${ifDefined(args.leading || undefined)}
        trailing=${ifDefined(args.trailing || undefined)}
        minlength=${ifDefined(args.minlength)}
        maxlength=${ifDefined(args.maxlength)}
        pattern=${ifDefined(args.pattern || undefined)}
        pattern-title=${ifDefined(args.patternTitle || undefined)}
        min=${ifDefined(args.min || undefined)}
        max=${ifDefined(args.max || undefined)}
        step=${ifDefined(args.step || undefined)}
        autocomplete=${ifDefined(args.autocomplete)}
        inputmode=${ifDefined(args.inputmode)}
        validator-hint=${ifDefined(args.validatorHint)}
        .suggestions=${args.suggestions ?? []}
        ?tabular=${args.tabular}
        ?validator=${args.validator}
        ?hint-on-invalid=${args.hintOnInvalid}
        ?disabled=${args.disabled}
        ?required=${args.required}
        ?readonly=${args.readonly}
        @input=${args.onInput}
        @change=${args.onChange}
      ></ui-text-input>
    </ui-field>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the input; typing fires input, leaving it fires change." } },
  },
  play: async ({ canvas, userEvent, args, canvasElement }) => {
    const input = canvas.getByLabelText("Company name");
    await expect(input).toHaveValue("");
    await userEvent.click(input);
    await expect(input).toHaveFocus();
    await userEvent.type(input, sample.name);
    await expect(input).toHaveValue(sample.name);
    await expect(canvasElement.querySelector("ui-text-input")?.value).toBe(sample.name);
    await expect(args.onInput).toHaveBeenCalledTimes(sample.name.length);
    await expect(args.onChange).not.toHaveBeenCalled();
    await userEvent.tab();
    await expect(args.onChange).toHaveBeenCalledOnce();
    await userEvent.clear(input);
    await expect(input).toHaveValue("");
    await userEvent.click(input);
    await userEvent.paste(sample.email);
    await expect(input).toHaveValue(sample.email);
    await userEvent.keyboard("{Backspace}");
    await expect(input).toHaveValue(sample.email.slice(0, -1));
  },
});

export const Filled = meta.story({
  name: "Filled",
  args: { value: sample.name },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Company name");
    await expect(input).toHaveValue(sample.name);
    await userEvent.type(input, " Ltd");
    await expect(input).toHaveValue(`${sample.name} Ltd`);
  },
});

export const RequiredAndInvalid = meta.story({
  name: "Required, invalid with message",
  args: {
    required: true,
    validator: true,
    minlength: 3,
    color: "error",
    error: "Enter the company name.",
    validatorHint: "At least 3 characters.",
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Company name");
    await expect(input).toBeRequired();
    await expect(input).toBeInvalid();
    await expect(canvas.getByText("Required")).toBeInTheDocument();
    await expect(canvas.getByRole("status")).toHaveTextContent("Enter the company name.");
    await expect(canvas.getByText("At least 3 characters.")).toBeInTheDocument();
    await userEvent.type(input, sample.name);
    await expect(input).toBeValid();
  },
});

export const EmailType = meta.story({
  name: "Email",
  args: {
    fieldLabel: "Email",
    fieldHint: "",
    type: "email",
    icon: "mail",
    name: "email",
    placeholder: "",
    autocomplete: "email",
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("textbox", { name: "Email" });
    await expect(input).toHaveAttribute("type", "email");
    await userEvent.type(input, "alex.morgan");
    await expect(input).toBeInvalid();
    await userEvent.type(input, "@example.com");
    await expect(input).toHaveValue(sample.email);
    await expect(input).toBeValid();
  },
});

export const Pattern = meta.story({
  name: "Pattern",
  args: {
    fieldLabel: "Postcode",
    fieldHint: "",
    placeholder: "",
    pattern: "[0-9]{5}",
    patternTitle: "Five digits",
    inputmode: "numeric",
    tabular: true,
    width: "64",
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("textbox", { name: "Postcode" });
    await expect(input).toHaveAttribute("title", "Five digits");
    await userEvent.type(input, "30A12");
    await expect(input).toBeInvalid();
    await userEvent.clear(input);
    await userEvent.type(input, "30512");
    await expect(input).toBeValid();
  },
});

export const LeadingAndTrailing = meta.story({
  name: "Leading and trailing",
  args: { fieldLabel: "Website", fieldHint: "", placeholder: "", type: "url", leading: "https://", trailing: ".com" },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText("https://")).toBeInTheDocument();
    await expect(canvas.getByText(".com")).toBeInTheDocument();
    const input = canvas.getByLabelText("Website");
    await userEvent.type(input, "example");
    await expect(input).toHaveValue("example");
  },
});

export const Disabled = meta.story({
  name: "Disabled",
  args: { disabled: true, value: sample.name },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByLabelText("Company name")).toBeDisabled();
    await expect(args.onInput).not.toHaveBeenCalled();
  },
});

export const ReadOnly = meta.story({
  name: "Read-only",
  args: { readonly: true, value: sample.name },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByLabelText("Company name");
    await expect(input).toHaveAttribute("readonly");
    await userEvent.type(input, "x");
    await expect(input).toHaveValue(sample.name);
    await expect(args.onInput).not.toHaveBeenCalled();
  },
});

export const AccessibleName = meta.story({
  name: "Accessible name",
  args: { placeholder: "" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Company name" })).toHaveAttribute("id", "ti-playground");
  },
});

export const InAField = meta.story({
  name: "In a field",
  parameters: {
    docs: {
      description: { story: "Inside a field the input takes the full width and gets its name from the field's label." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="First name" control-id="ti-first">
      <ui-text-input input-id="ti-first" width="full" placeholder="Alex" autocomplete="given-name"></ui-text-input>
    </ui-field>
    <ui-field label="Last name" required filled control-id="ti-last">
      <ui-text-input input-id="ti-last" width="full" required value="Morgan" autocomplete="family-name"></ui-text-input>
    </ui-field>
  `,
  play: async ({ canvas }) => {
    const first = canvas.getByRole("textbox", { name: "First name" });
    await expect(first).toHaveAccessibleName("First name");
    await expect(first).not.toHaveAttribute("aria-label");
    await expect(first).toHaveAttribute("placeholder", "Alex");
    await expect(canvas.getByRole("textbox", { name: "Last name" })).toHaveValue("Morgan");
  },
});

export const FieldLabelBeatsPlaceholder = meta.story({
  name: "Field label beats placeholder and leading text",
  parameters: {
    docs: {
      description: { story: "The field's label names the input; placeholder and leading text never override it." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Company name" control-id="ti-company">
      <ui-text-input input-id="ti-company" width="full" placeholder="Harbor Street Supplies"></ui-text-input>
    </ui-field>
    <ui-field label="Website" control-id="ti-site">
      <ui-text-input input-id="ti-site" width="full" leading="https://" placeholder="example.com"></ui-text-input>
    </ui-field>
  `,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Company name" })).toHaveAccessibleName("Company name");
    const site = canvas.getByRole("textbox", { name: /^Website/ });
    await expect(site).not.toHaveAttribute("aria-label");
    await expect(site).toHaveAttribute("id", "ti-site");
  },
});

export const TypesAndIcons = meta.story({
  name: "Types and icons",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-field label="Email" control-id="ti-email">
      <ui-text-input
        input-id="ti-email"
        type="email"
        icon="mail"
        width="full"
        value="alex.morgan@example.com"
      ></ui-text-input>
    </ui-field>
    <ui-field label="Password" control-id="ti-password">
      <ui-text-input
        input-id="ti-password"
        type="password"
        icon="key"
        width="full"
        value="correct-horse-battery"
      ></ui-text-input>
    </ui-field>
    <ui-field label="Phone" control-id="ti-phone">
      <ui-text-input input-id="ti-phone" type="tel" icon="phone" width="full" placeholder="+1 555 0100"></ui-text-input>
    </ui-field>
    <ui-field label="Website" control-id="ti-url">
      <ui-text-input
        input-id="ti-url"
        type="url"
        icon="link"
        width="full"
        placeholder="https://example.com"
      ></ui-text-input>
    </ui-field>
    <ui-field label="Contact person" control-id="ti-user">
      <ui-text-input input-id="ti-user" icon="user" width="full" value="Priya Patel"></ui-text-input>
    </ui-field>
    <ui-field label="Delivery date" control-id="ti-date">
      <ui-text-input input-id="ti-date" type="date" width="full" value="2026-12-03"></ui-text-input>
    </ui-field>
    <ui-field label="Pickup time" control-id="ti-time">
      <ui-text-input input-id="ti-time" type="time" width="full" value="14:30"></ui-text-input>
    </ui-field>
  `,
});

export const LeadingAndTrailingText = meta.story({
  name: "Leading and trailing text",
  parameters: {
    docs: { description: { story: "Numbers set tabular figures so amounts line up in a column." } },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Unit price" control-id="ti-price">
      <ui-text-input
        input-id="ti-price"
        type="number"
        inputmode="decimal"
        tabular
        leading="$"
        width="full"
        value="49.90"
        step="0.01"
      ></ui-text-input>
    </ui-field>
    <ui-field label="Parcel weight" control-id="ti-weight">
      <ui-text-input
        input-id="ti-weight"
        type="number"
        tabular
        trailing="kg"
        width="full"
        value="2.4"
        step="0.1"
      ></ui-text-input>
    </ui-field>
    <ui-field label="Discount" control-id="ti-discount">
      <ui-text-input
        input-id="ti-discount"
        type="number"
        tabular
        trailing="%"
        width="full"
        placeholder="0"
      ></ui-text-input>
    </ui-field>
    <ui-field label="Profile address" control-id="ti-handle">
      <ui-text-input
        input-id="ti-handle"
        leading="https://"
        trailing=".example.com"
        width="full"
        value="alex"
      ></ui-text-input>
    </ui-field>
  `,
});

export const Sizes = meta.story({
  name: "Sizes",
  render: () => html`
    <ui-text-input size="xs" placeholder="Extra small"></ui-text-input>
    <ui-text-input size="sm" placeholder="Small"></ui-text-input>
    <ui-text-input size="md" placeholder="Medium"></ui-text-input>
    <ui-text-input size="lg" placeholder="Large"></ui-text-input>
    <ui-text-input size="xl" placeholder="Extra large"></ui-text-input>
  `,
});

export const Colours = meta.story({
  name: "Colours",
  render: () => html`
    <ui-text-input color="neutral" placeholder="Neutral"></ui-text-input>
    <ui-text-input color="primary" placeholder="Primary"></ui-text-input>
    <ui-text-input color="secondary" placeholder="Secondary"></ui-text-input>
    <ui-text-input color="accent" placeholder="Accent"></ui-text-input>
    <ui-text-input color="info" placeholder="Info"></ui-text-input>
    <ui-text-input color="success" placeholder="Success"></ui-text-input>
    <ui-text-input color="warning" placeholder="Warning"></ui-text-input>
    <ui-text-input color="error" placeholder="Error"></ui-text-input>
    <ui-text-input variant="ghost" placeholder="Ghost"></ui-text-input>
  `,
});

export const Widths = meta.story({
  name: "Widths",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-text-input width="64" placeholder="Postcode"></ui-text-input>
    <ui-text-input width="xs" placeholder="City"></ui-text-input>
    <ui-text-input width="sm" placeholder="Region"></ui-text-input>
    <ui-text-input width="md" placeholder="Street"></ui-text-input>
    <ui-text-input width="lg" placeholder="Company address"></ui-text-input>
    <ui-text-input width="full" placeholder="Full width"></ui-text-input>
  `,
});

export const States = meta.story({
  name: "States",
  parameters: {
    docs: {
      description: { story: "Read-only stays focusable and selectable; disabled is skipped by Tab and not submitted." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Customer number" readonly control-id="ti-readonly">
      <ui-text-input input-id="ti-readonly" width="full" readonly value="CUS-10482"></ui-text-input>
    </ui-field>
    <ui-field label="Account owner" control-id="ti-disabled">
      <ui-text-input input-id="ti-disabled" width="full" disabled value="Jordan Blake"></ui-text-input>
    </ui-field>
    <ui-field label="Postcode" required filled error="Enter a five-digit postcode." control-id="ti-invalid">
      <ui-text-input input-id="ti-invalid" width="full" color="error" value="9021"></ui-text-input>
    </ui-field>
  `,
});

export const Suggestions = meta.story({
  name: "Suggestions",
  parameters: {
    docs: { description: { story: "Suggestions come from a datalist, so the browser offers them as the user types." } },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="City" control-id="ti-city">
      <ui-text-input
        input-id="ti-city"
        width="full"
        placeholder="Start typing a city"
        .suggestions=${["Springfield", "Riverside", "Fairview", "Lakewood", "Greenville"]}
      ></ui-text-input>
    </ui-field>
  `,
});

export const BuiltInLabelAndFieldset = meta.story({
  name: "Built-in label and fieldset",
  parameters: {
    docs: {
      description: {
        story: "Without a field wrapper the input can draw its own fieldset with a legend, label and hint.",
      },
    },
    canvas: "column",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Company registration number" })).toHaveAttribute(
      "placeholder",
      "12345678",
    );
    await expect(canvas.getByRole("textbox", { name: "Work email" })).toHaveValue("ops@example.com");
  },
  render: () => html`
    <ui-text-input
      legend="Billing"
      label="Company registration number"
      hint="Printed on your certificate of incorporation."
      width="full"
      field-width="full"
      placeholder="12345678"
    ></ui-text-input>
    <ui-text-input
      legend="Contact"
      label="Work email"
      type="email"
      icon="mail"
      width="full"
      field-width="full"
      field-surface="base-200"
      value="ops@example.com"
    ></ui-text-input>
  `,
});

export const FloatingLabel = meta.story({
  name: "Floating label",
  parameters: {
    docs: { description: { story: "The label sits in the placeholder until the input has a value or focus." } },
    canvas: "column",
  },
  render: () => html`
    <ui-text-input floating label="Reference" width="full" placeholder="Reference"></ui-text-input>
    <ui-text-input floating label="Reference" width="full" placeholder="Reference" value="PO-2291"></ui-text-input>
  `,
});

export const NativeValidation = meta.story({
  name: "Native validation",
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Username" })).toHaveValue("Alex Morgan");
    await expect(canvas.getByRole("textbox", { name: "Email" })).toBeValid();
  },
  parameters: {
    docs: {
      description: {
        story:
          "With validator on, the browser's own check colours the input and reveals the validator hint when the value is invalid.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-text-input
      legend="Username"
      validator
      required
      pattern="[a-z0-9-]{3,20}"
      pattern-title="3 to 20 lowercase letters, numbers or dashes"
      validator-hint="Use 3 to 20 lowercase letters, numbers or dashes."
      hint-on-invalid
      width="full"
      field-width="full"
      value="Alex Morgan"
    ></ui-text-input>
    <ui-text-input
      legend="Email"
      validator
      required
      type="email"
      icon="mail"
      validator-hint="Enter a valid email address."
      hint-on-invalid
      width="full"
      field-width="full"
      value="alex.morgan@example.com"
    ></ui-text-input>
  `,
});

export const OwnLabelAndValidity = meta.story({
  name: "Own label and validity",
  parameters: {
    docs: {
      description: {
        story:
          "aria-label names the input over its legend; without a caption or placeholder the leading text names it; focus, checkValidity and reportValidity reach the inner input.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-text-input aria-label="Order number" legend="Lookup" required></ui-text-input>
    <ui-text-input leading="https://" width="full"></ui-text-input>
    <ui-text-input floating placeholder="City"></ui-text-input>
  `,
  play: async ({ canvas, userEvent, canvasElement }) => {
    const order = canvas.getByRole("textbox", { name: "Order number" });
    await expect(order).not.toHaveAttribute("aria-labelledby");
    const host = canvasElement.querySelector("ui-text-input")!;
    host.focus();
    await expect(order).toHaveFocus();
    await expect(host.checkValidity()).toBe(false);
    await expect(host.reportValidity()).toBe(false);
    await userEvent.type(order, sample.short);
    await expect(host.checkValidity()).toBe(true);
    await expect(host.reportValidity()).toBe(true);
    await expect(canvas.getByRole("textbox", { name: "https://" })).toHaveAttribute("aria-label", "https://");
    const city = canvas.getByRole("textbox", { name: "City" });
    await expect(city.closest("label")).toHaveTextContent("City");
    const unrendered = document.createElement("ui-text-input");
    unrendered.focus();
    await expect(unrendered.checkValidity()).toBe(true);
    await expect(unrendered.reportValidity()).toBe(true);
  },
});
