import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn, type Mock, userEvent } from "storybook/test";
import "./field.ts";
import "./otp.ts";
import type { LocalizedString } from "../../../lib/i18n/paraglide/runtime.js";

const say = (text: string) => text as LocalizedString;

type FieldArgs = {
  fieldLabel: string;
  fieldHint: string;
  error: string;
  onChange: Mock<(e: CustomEvent) => void>;
  onComplete: Mock<(e: CustomEvent) => void>;
};

const detail = (call: unknown[] = []) => (call[0] as CustomEvent<{ value: string }>).detail;

const meta = preview.type<{ args: FieldArgs }>().meta({
  title: "Primitives/Forms/One-time code",
  component: "ui-otp",
  args: {
    fieldLabel: "Verification code",
    fieldHint: "We sent a 6-digit code to your email.",
    error: "",
    label: say("Verification code"),
    length: 6,
    value: "",
    name: "code",
    alphanumeric: false,
    joined: false,
    size: "md",
    color: "primary",
    required: true,
    disabled: false,
    focusOnShow: false,
    onChange: fn(),
    onComplete: fn(),
  },
  argTypes: {
    fieldLabel: { control: "text", description: "Label of the surrounding ui-field." },
    fieldHint: { control: "text", description: "Hint of the surrounding ui-field." },
    error: { control: "text", description: "Error of the surrounding ui-field." },
    label: { control: "text", description: "Accessible name of the code input." },
    length: { control: { type: "number", min: 1, max: 10, step: 1 } },
    value: { control: "text" },
    name: { control: "text" },
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
    color: {
      control: "select",
      options: ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "error"],
    },
    onChange: { table: { category: "events" } },
    onComplete: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-field label=${ifDefined(args.fieldLabel)} hint=${ifDefined(args.fieldHint)} error=${ifDefined(args.error)}>
      <ui-otp
        label=${ifDefined(args.label)}
        length=${ifDefined(args.length)}
        value=${ifDefined(args.value)}
        name=${ifDefined(args.name)}
        size=${ifDefined(args.size)}
        color=${ifDefined(args.color)}
        required=${args.required ? "" : "false"}
        ?alphanumeric=${args.alphanumeric}
        ?joined=${args.joined}
        ?disabled=${args.disabled}
        ?focus-on-show=${args.focusOnShow}
        @ui-change=${args.onChange}
        @ui-complete=${args.onComplete}
      ></ui-otp>
    </ui-field>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Type or paste the code; ui-complete fires once every box is filled." } },
  },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole("textbox", { name: "Verification code" });
    await expect(input).toBeRequired();
    await expect(input).not.toHaveAttribute("maxlength");
    await userEvent.click(input.closest("label")!);
    await expect(input).toHaveFocus();
    await userEvent.keyboard("12");
    await expect(input).toHaveValue("12");
    await expect(input).toBeInvalid();
    await expect(args.onChange).toHaveBeenCalledTimes(2);
    await expect(detail(args.onChange.mock.calls[1])).toEqual({ value: "12" });
    await expect(args.onComplete).not.toHaveBeenCalled();
    await userEvent.keyboard("{Backspace}");
    await expect(input).toHaveValue("1");
    await userEvent.clear(input);
    await userEvent.paste("482913");
    await expect(input).toHaveValue("482913");
    await expect(input).toBeValid();
    await expect(args.onComplete).toHaveBeenCalledOnce();
    await expect(detail(args.onComplete.mock.calls[0])).toEqual({ value: "482913" });
  },
});

export const Filled = meta.story({
  name: "Filled",
  args: { value: "104729" },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Verification code" });
    await expect(input).toHaveValue("104729");
    await expect(input).toBeValid();
  },
});

export const Alphanumeric = meta.story({
  name: "Alphanumeric",
  args: { alphanumeric: true, label: say("Recovery code"), fieldLabel: "Recovery code", fieldHint: "" },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole("textbox", { name: "Recovery code" });
    await expect(input).toHaveAttribute("inputmode", "text");
    await userEvent.click(input.closest("label")!);
    await userEvent.keyboard("k7-q2xm");
    await expect(input).toHaveValue("k7q2xm");
    await expect(args.onComplete).toHaveBeenCalledOnce();
  },
});

export const Optional = meta.story({
  name: "Optional",
  args: { required: false, length: 4, fieldHint: "" },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Verification code" });
    await expect(input).not.toBeRequired();
    await expect(input).toBeValid();
  },
});

export const Disabled = meta.story({
  name: "Disabled",
  args: { disabled: true, value: "381" },
  play: async ({ canvas, args }) => {
    const input = canvas.getByRole("textbox", { name: "Verification code" });
    await expect(input).toBeDisabled();
    await expect(input).toHaveValue("381");
    await expect(args.onChange).not.toHaveBeenCalled();
  },
});

export const ErrorState = meta.story({
  name: "Error",
  args: { color: "error", value: "552019", error: "That code has expired. Request a new one." },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("That code has expired. Request a new one.");
    await expect(canvas.getByRole("textbox", { name: "Verification code" })).toHaveValue("552019");
  },
});

export const FocusOnShow = meta.story({
  name: "Focus on show",
  args: { focusOnShow: true, fieldHint: "" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Verification code" })).toHaveFocus();
  },
});

export const InAField = meta.story({
  name: "In a field",
  parameters: {
    docs: {
      description: {
        story:
          "Paste or type the code; non-digits are dropped, Arabic-Indic digits become Latin, and ui-complete fires once every box is filled.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field
      label="Verification code"
      hint="We sent a 6-digit code to alex.morgan@example.com."
      control-id="otp-field"
    >
      <ui-otp length="6" input-id="otp-field"></ui-otp>
    </ui-field>
  `,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("textbox", { name: "Verification code" });
    await expect(input).toHaveAttribute("id", "otp-field");
    await expect(input).not.toHaveAttribute("aria-label");
    await userEvent.click(canvas.getByText("Verification code", { selector: "label" }));
    await expect(input).toHaveFocus();
  },
});

export const PasteWithSeparators = meta.story({
  name: "Paste with separators",
  parameters: {
    docs: {
      description: { story: "A pasted code with spaces or dashes still fills every box; separators are dropped." },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole("textbox", { name: "Verification code" });
    await userEvent.click(input.closest("label")!);
    await expect(input).toHaveFocus();
    await userEvent.paste("482 913");
    await expect(input).toHaveValue("482913");
    await expect(input).toBeValid();
    await expect(detail(args.onComplete.mock.calls[0])).toEqual({ value: "482913" });
    await userEvent.clear(input);
    await userEvent.paste("104-729");
    await expect(input).toHaveValue("104729");
    await userEvent.clear(input);
    await userEvent.paste("1234567890");
    await expect(input).toHaveValue("123456");
  },
});

export const DigitsOnly = meta.story({
  name: "Digits only",
  parameters: {
    docs: { description: { story: "Typing letters and symbols leaves only the digits, Arabic-Indic ones as Latin." } },
  },
  render: () => html`<ui-otp label="Verification code"></ui-otp>`,
  play: async ({ canvasElement }) => {
    const otp = canvasElement.querySelector("ui-otp")!;
    const input = otp.querySelector("input")!;
    const changes = fn();
    const completed = fn();
    otp.addEventListener("ui-change", changes);
    otp.addEventListener("ui-complete", completed);
    await userEvent.click(otp.querySelector("label")!);
    await userEvent.keyboard("4a2-b9٣");
    await expect(otp.value).toBe("4293");
    await expect(input.value).toBe("4293");
    await expect(changes).toHaveBeenCalled();
    await expect(completed).toHaveBeenCalledOnce();
  },
});

export const LengthsAndValues = meta.story({
  name: "Lengths and values",
  render: () => html`
    <ui-otp label="Empty, four digits"></ui-otp>
    <ui-otp label="Partly filled" value="48"></ui-otp>
    <ui-otp label="Filled" value="4821"></ui-otp>
    <ui-otp length="6" label="Six digits" value="104729"></ui-otp>
  `,
});

export const LettersAndDigits = meta.story({
  name: "Letters and digits",
  render: () => html` <ui-otp length="6" alphanumeric label="Recovery code" value="K7Q2XM"></ui-otp> `,
});

export const Joined = meta.story({
  name: "Joined",
  render: () => html`
    <ui-otp joined label="Joined, empty"></ui-otp>
    <ui-otp joined length="6" label="Joined, filled" value="905113"></ui-otp>
  `,
});

export const Sizes = meta.story({
  name: "Sizes",
  render: () => html`
    <ui-otp size="xs" label="Extra small" value="12"></ui-otp>
    <ui-otp size="sm" label="Small" value="12"></ui-otp>
    <ui-otp size="md" label="Medium" value="12"></ui-otp>
    <ui-otp size="lg" label="Large" value="12"></ui-otp>
    <ui-otp size="xl" label="Extra large" value="12"></ui-otp>
  `,
});

export const Colours = meta.story({
  name: "Colours",
  render: () => html`
    <ui-otp color="neutral" label="Neutral" value="7"></ui-otp>
    <ui-otp color="primary" label="Primary" value="7"></ui-otp>
    <ui-otp color="secondary" label="Secondary" value="7"></ui-otp>
    <ui-otp color="accent" label="Accent" value="7"></ui-otp>
    <ui-otp color="info" label="Info" value="7"></ui-otp>
    <ui-otp color="success" label="Success" value="7"></ui-otp>
    <ui-otp color="warning" label="Warning" value="7"></ui-otp>
    <ui-otp color="error" label="Error" value="7"></ui-otp>
  `,
});

export const States = meta.story({
  name: "States",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-field label="Verification code">
      <ui-otp disabled length="6" label="Verification code" value="381"></ui-otp>
    </ui-field>
    <ui-field label="Verification code" error="That code has expired. Request a new one.">
      <ui-otp color="error" length="6" label="Verification code" value="552019"></ui-otp>
    </ui-field>
  `,
});
