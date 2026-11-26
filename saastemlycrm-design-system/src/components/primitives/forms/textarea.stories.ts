import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./field.ts";
import "./textarea.ts";

const sample = {
  note: "Ring the bell twice. The side gate is unlocked between 9 and 5.",
  json: '{\n  "orderId": "ORD-48213",\n  "items": [\n    { "sku": "MUG-01", "qty": 2 }\n  ]\n}',
  typed: "Leave it with the neighbour.",
};

type FieldArgs = {
  fieldLabel: string;
  fieldHint: string;
  error: string;
  fieldMax: number | undefined;
  onInput: (e: Event) => void;
  onChange: (e: Event) => void;
};

const meta = preview.type<{ args: FieldArgs }>().meta({
  title: "Primitives/Forms/Textarea",
  component: "ui-textarea",
  args: {
    fieldLabel: "Delivery instructions",
    fieldHint: "",
    error: "",
    fieldMax: undefined,
    inputId: "ta-playground",
    name: "instructions",
    value: "",
    placeholder: "Anything the courier should know",
    rows: 3,
    color: undefined,
    variant: undefined,
    size: "md",
    width: "full",
    height: undefined,
    mono: false,
    validator: false,
    minlength: undefined,
    maxlength: undefined,
    disabled: false,
    required: false,
    readonly: false,
    autocomplete: "off",
    validatorHint: "",
    hintOnInvalid: false,
    onInput: fn(),
    onChange: fn(),
  },
  argTypes: {
    fieldLabel: { control: "text", description: "Label of the surrounding ui-field." },
    fieldHint: { control: "text", description: "Hint of the surrounding ui-field." },
    error: { control: "text", description: "Error of the surrounding ui-field." },
    fieldMax: {
      control: { type: "number", min: 1, step: 1 },
      description: "Character budget the field counts against.",
    },
    inputId: { control: "text" },
    name: { control: "text" },
    value: { control: "text" },
    placeholder: { control: "text" },
    rows: { control: { type: "number", min: 1, max: 20, step: 1 } },
    color: {
      control: "select",
      options: [undefined, "neutral", "primary", "secondary", "accent", "info", "success", "warning", "error"],
    },
    variant: { control: "inline-radio", options: [undefined, "ghost"] },
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
    width: { control: "select", options: ["auto", "64", "xs", "sm", "md", "lg", "full"] },
    height: { control: "select", options: [undefined, "16", "24", "32", "48", "64"] },
    minlength: { control: { type: "number", min: 0, step: 1 } },
    maxlength: { control: { type: "number", min: 0, step: 1 } },
    autocomplete: { control: "text" },
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
      .count=${args.fieldMax ? (args.value ?? "").length : undefined}
      .max=${args.fieldMax}
      ?required=${args.required}
      ?readonly=${args.readonly}
    >
      <ui-textarea
        input-id=${ifDefined(args.inputId)}
        name=${ifDefined(args.name)}
        .value=${args.value ?? ""}
        placeholder=${ifDefined(args.placeholder || undefined)}
        rows=${ifDefined(args.rows)}
        color=${ifDefined(args.color)}
        variant=${ifDefined(args.variant)}
        size=${ifDefined(args.size)}
        width=${ifDefined(args.width)}
        height=${ifDefined(args.height)}
        minlength=${ifDefined(args.minlength)}
        maxlength=${ifDefined(args.maxlength)}
        autocomplete=${ifDefined(args.autocomplete)}
        validator-hint=${ifDefined(args.validatorHint)}
        ?mono=${args.mono}
        ?validator=${args.validator}
        ?hint-on-invalid=${args.hintOnInvalid}
        ?disabled=${args.disabled}
        ?required=${args.required}
        ?readonly=${args.readonly}
        @input=${args.onInput}
        @change=${args.onChange}
      ></ui-textarea>
    </ui-field>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the textarea; typing fires input, leaving it fires change." } },
  },
  play: async ({ canvas, userEvent, args, canvasElement }) => {
    const box = canvas.getByLabelText("Delivery instructions");
    await expect(box).toHaveAttribute("placeholder", "Anything the courier should know");
    await userEvent.type(box, "Leave it{Enter}with the neighbour.");
    await expect(box).toHaveValue("Leave it\nwith the neighbour.");
    await expect(canvasElement.querySelector("ui-textarea")?.value).toBe("Leave it\nwith the neighbour.");
    await expect(args.onInput).toHaveBeenCalled();
    await expect(args.onChange).not.toHaveBeenCalled();
    await userEvent.tab();
    await expect(args.onChange).toHaveBeenCalledOnce();
    await userEvent.clear(box);
    await expect(box).toHaveValue("");
    await userEvent.click(box);
    await userEvent.paste(sample.note);
    await expect(box).toHaveValue(sample.note);
  },
});

export const Filled = meta.story({
  name: "Filled with count",
  args: { value: sample.note, fieldMax: 120, maxlength: 120 },
  play: async ({ canvas, userEvent }) => {
    const box = canvas.getByLabelText("Delivery instructions");
    await expect(box).toHaveValue(sample.note);
    await expect(canvas.getByText(`${sample.note.length} / 120`)).toBeInTheDocument();
    await userEvent.type(box, " Thanks!");
    await expect(box).toHaveValue(`${sample.note} Thanks!`);
  },
});

export const MaxLength = meta.story({
  name: "Max length",
  args: { maxlength: 10, placeholder: "" },
  play: async ({ canvas, userEvent }) => {
    const box = canvas.getByLabelText("Delivery instructions");
    await userEvent.type(box, sample.typed);
    await expect(box).toHaveValue(sample.typed.slice(0, 10));
  },
});

export const RequiredAndInvalid = meta.story({
  name: "Required, invalid with message",
  args: {
    required: true,
    validator: true,
    minlength: 10,
    color: "error",
    error: "Add instructions for the courier.",
    validatorHint: "At least 10 characters.",
  },
  play: async ({ canvas, userEvent }) => {
    const box = canvas.getByLabelText("Delivery instructions");
    await expect(box).toBeRequired();
    await expect(box).toBeInvalid();
    await expect(canvas.getByText("Required")).toBeInTheDocument();
    await expect(canvas.getByRole("status")).toHaveTextContent("Add instructions for the courier.");
    await expect(canvas.getByText("At least 10 characters.")).toBeInTheDocument();
    await userEvent.type(box, sample.typed);
    await expect(box).toBeValid();
  },
});

export const CodeMono = meta.story({
  name: "Monospace code",
  args: { fieldLabel: "Order JSON", mono: true, rows: 6, value: sample.json, placeholder: "" },
  play: async ({ canvas, userEvent }) => {
    const box = canvas.getByRole("textbox", { name: "Order JSON" });
    await expect(box).toHaveValue(sample.json);
    await userEvent.clear(box);
    await userEvent.click(box);
    await userEvent.paste(sample.json);
    await expect(box).toHaveValue(sample.json);
  },
});

export const Disabled = meta.story({
  name: "Disabled",
  args: { disabled: true, value: sample.note },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByLabelText("Delivery instructions")).toBeDisabled();
    await expect(args.onInput).not.toHaveBeenCalled();
  },
});

export const ReadOnly = meta.story({
  name: "Read-only",
  args: { readonly: true, value: sample.note },
  play: async ({ canvas, userEvent, args }) => {
    const box = canvas.getByLabelText("Delivery instructions");
    await expect(box).toHaveAttribute("readonly");
    await userEvent.type(box, "x");
    await expect(box).toHaveValue(sample.note);
    await expect(args.onInput).not.toHaveBeenCalled();
  },
});

export const InAField = meta.story({
  name: "In a field",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-field label="Delivery instructions" control-id="ta-empty">
      <ui-textarea
        input-id="ta-empty"
        width="full"
        rows="3"
        placeholder="Anything the courier should know"
      ></ui-textarea>
    </ui-field>
    <ui-field label="Delivery instructions" .count=${sample.note.length} .max=${120} control-id="ta-filled">
      <ui-textarea input-id="ta-filled" width="full" rows="3" maxlength="120" .value=${sample.note}></ui-textarea>
    </ui-field>
  `,
  play: async ({ canvas }) => {
    const [empty, filled] = canvas.getAllByRole("textbox");
    await expect(empty).toHaveAccessibleName("Delivery instructions");
    await expect(empty).not.toHaveAttribute("aria-label");
    await expect(filled).toHaveAccessibleName("Delivery instructions");
  },
});

export const TextAsContent = meta.story({
  name: "Text as content",
  parameters: {
    docs: { description: { story: "Text placed inside the element becomes its starting value." } },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Return reason" control-id="ta-content">
      <ui-textarea input-id="ta-content" width="full" rows="3"
        >The jacket arrived in the wrong size. I would like an exchange for a medium.</ui-textarea
      >
    </ui-field>
  `,
});

export const Sizes = meta.story({
  name: "Sizes",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-textarea size="xs" width="full" placeholder="Extra small"></ui-textarea>
    <ui-textarea size="sm" width="full" placeholder="Small"></ui-textarea>
    <ui-textarea size="md" width="full" placeholder="Medium"></ui-textarea>
    <ui-textarea size="lg" width="full" placeholder="Large"></ui-textarea>
    <ui-textarea size="xl" width="full" placeholder="Extra large"></ui-textarea>
  `,
});

export const Colours = meta.story({
  name: "Colours",
  render: () => html`
    <ui-textarea color="neutral" placeholder="Neutral"></ui-textarea>
    <ui-textarea color="primary" placeholder="Primary"></ui-textarea>
    <ui-textarea color="secondary" placeholder="Secondary"></ui-textarea>
    <ui-textarea color="accent" placeholder="Accent"></ui-textarea>
    <ui-textarea color="info" placeholder="Info"></ui-textarea>
    <ui-textarea color="success" placeholder="Success"></ui-textarea>
    <ui-textarea color="warning" placeholder="Warning"></ui-textarea>
    <ui-textarea color="error" placeholder="Error"></ui-textarea>
    <ui-textarea variant="ghost" placeholder="Ghost"></ui-textarea>
  `,
});

export const Heights = meta.story({
  name: "Heights",
  render: () => html`
    <ui-textarea height="16" placeholder="16"></ui-textarea>
    <ui-textarea height="24" placeholder="24"></ui-textarea>
    <ui-textarea height="32" placeholder="32"></ui-textarea>
    <ui-textarea height="48" placeholder="48"></ui-textarea>
    <ui-textarea height="64" placeholder="64"></ui-textarea>
  `,
});

export const Code = meta.story({
  name: "Code",
  parameters: {
    docs: {
      description: { story: "Mono keeps whitespace, uses two-space tabs and scrolls sideways instead of wrapping." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Webhook payload" control-id="ta-mono">
      <ui-textarea input-id="ta-mono" mono width="full" rows="7" .value=${sample.json}></ui-textarea>
    </ui-field>
  `,
});

export const States = meta.story({
  name: "States",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-field label="Internal note" readonly control-id="ta-readonly">
      <ui-textarea
        input-id="ta-readonly"
        width="full"
        rows="2"
        readonly
        value="Customer prefers email over phone calls."
      ></ui-textarea>
    </ui-field>
    <ui-field label="Internal note" control-id="ta-disabled">
      <ui-textarea
        input-id="ta-disabled"
        width="full"
        rows="2"
        disabled
        value="Locked while the order is being packed."
      ></ui-textarea>
    </ui-field>
    <ui-field
      label="Cancellation reason"
      required
      error="Tell us why the order is being cancelled."
      control-id="ta-invalid"
    >
      <ui-textarea input-id="ta-invalid" width="full" rows="2" required color="error"></ui-textarea>
    </ui-field>
  `,
});

export const BuiltInLabelAndFloatingLabel = meta.story({
  name: "Built-in label and floating label",
  parameters: { canvas: "column" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "What could we do better?" })).toBeInTheDocument();
    await expect(canvas.getByRole("textbox", { name: "Order notes" })).toBeInTheDocument();
    await expect(canvas.getByRole("textbox", { name: "Bio" })).toBeRequired();
  },
  render: () => html`
    <ui-textarea
      legend="Feedback"
      label="What could we do better?"
      hint="Optional. Your answer is anonymous."
      width="full"
      field-width="full"
      field-surface="base-200"
      rows="3"
    ></ui-textarea>
    <ui-textarea floating label="Order notes" placeholder="Order notes" width="full" rows="3"></ui-textarea>
    <ui-textarea
      legend="Bio"
      validator
      required
      minlength="20"
      validator-hint="Write at least 20 characters."
      hint-on-invalid
      width="full"
      field-width="full"
      rows="3"
      value="Too short."
    ></ui-textarea>
  `,
});

export const OwnLabelAndValidity = meta.story({
  name: "Own label and validity",
  parameters: {
    docs: {
      description: {
        story:
          "An aria-label names the textarea over its legend; focus, checkValidity and reportValidity reach the inner textarea.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-textarea aria-label="Reply" legend="Message" required width="full" rows="2"></ui-textarea>
    <ui-textarea floating placeholder="Order notes" width="full" rows="2"></ui-textarea>
  `,
  play: async ({ canvas, userEvent, canvasElement }) => {
    const reply = canvas.getByRole("textbox", { name: "Reply" });
    await expect(reply).not.toHaveAttribute("aria-labelledby");
    const host = canvasElement.querySelector("ui-textarea")!;
    host.focus();
    await expect(reply).toHaveFocus();
    await expect(host.checkValidity()).toBe(false);
    await expect(host.reportValidity()).toBe(false);
    await userEvent.type(reply, sample.typed);
    await expect(host.checkValidity()).toBe(true);
    await expect(host.reportValidity()).toBe(true);
    const floating = canvas.getByRole("textbox", { name: "Order notes" });
    await expect(floating.closest("label")).toHaveTextContent("Order notes");
    const detached = document.createElement("ui-textarea");
    detached.focus();
    await expect(detached.checkValidity()).toBe(true);
    await expect(detached.reportValidity()).toBe(true);
  },
});
