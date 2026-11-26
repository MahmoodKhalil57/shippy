import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn, type Mock } from "storybook/test";
import "./field.ts";
import "./text-input.ts";
import "./textarea.ts";

const sample = { note: "Please leave the parcel with the neighbour at number 12 if nobody answers." };

const answer = (call: unknown[] = []) => (call[0] as CustomEvent<{ accept: boolean }>).detail.accept;

type ControlArgs = {
  value: string;
  onSuggest: Mock<(e: CustomEvent) => void>;
  onSuggestion: Mock<(e: CustomEvent) => void>;
};

const meta = preview.type<{ args: ControlArgs }>().meta({
  title: "Primitives/Forms/Field",
  component: "ui-field",
  args: {
    value: "",
    label: "Company size",
    controlId: "field-playground",
    required: false,
    filled: false,
    valid: false,
    readonly: false,
    hint: "Count everyone on the payroll.",
    about: "Used to suggest a plan.",
    error: "",
    count: undefined,
    max: undefined,
    suggestable: true,
    suggesting: false,
    suggestion: "",
    suggestNote: "",
    onSuggest: fn(),
    onSuggestion: fn(),
  },
  argTypes: {
    value: { control: "text", description: "Value of the slotted text input." },
    label: { control: "text" },
    controlId: { control: "text" },
    hint: { control: "text" },
    about: { control: "text" },
    error: { control: "text" },
    count: { control: { type: "number", min: 0, step: 1 } },
    max: { control: { type: "number", min: 1, step: 1 } },
    suggestion: { control: "text" },
    suggestNote: { control: "text" },
    onSuggest: { table: { category: "events" } },
    onSuggestion: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-field
      label=${ifDefined(args.label)}
      control-id=${ifDefined(args.controlId)}
      hint=${ifDefined(args.hint)}
      about=${ifDefined(args.about)}
      error=${ifDefined(args.error)}
      suggestion=${ifDefined(args.suggestion)}
      suggest-note=${ifDefined(args.suggestNote)}
      .count=${args.count}
      .max=${args.max}
      ?required=${args.required}
      ?filled=${args.filled}
      ?valid=${args.valid}
      ?readonly=${args.readonly}
      ?suggestable=${args.suggestable}
      ?suggesting=${args.suggesting}
      @ui-suggest=${args.onSuggest}
      @ui-suggestion=${args.onSuggestion}
    >
      <ui-text-input
        input-id=${ifDefined(args.controlId)}
        width="full"
        value=${ifDefined(args.value)}
        ?required=${args.required}
        ?readonly=${args.readonly}
      ></ui-text-input>
    </ui-field>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: { story: "Every control drives the field: label, help popover, suggest button and messages." },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole("textbox", { name: "Company size" });
    await userEvent.click(canvas.getByText("Company size"));
    await expect(input).toHaveFocus();
    await userEvent.type(input, "48");
    await expect(input).toHaveValue("48");
    const help = canvas.getByRole("button", { name: "About Company size" });
    await expect(help).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(help);
    await expect(await canvas.findByRole("button", { name: "About Company size", expanded: true })).toBe(help);
    await expect(canvas.getAllByText("Count everyone on the payroll.")[0]).toBeInTheDocument();
    await expect(canvas.getByText("Used to suggest a plan.").closest("[popover]")?.matches(":popover-open")).toBe(true);
    await userEvent.click(help);
    await expect(await canvas.findByRole("button", { name: "About Company size", expanded: false })).toBe(help);
    const suggest = canvas.getByRole("button", { name: "Suggest Company size" });
    await expect(suggest).toHaveAttribute("aria-busy", "false");
    await userEvent.click(suggest);
    await expect(args.onSuggest).toHaveBeenCalledOnce();
  },
});

export const RequiredEmpty = meta.story({
  name: "Required, empty",
  args: { required: true },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText("Required")).toBeInTheDocument();
    const input = canvas.getByRole("textbox", { name: "Company size" });
    await expect(input).toBeInvalid();
    await userEvent.type(input, "12");
    await expect(input).toBeValid();
  },
});

export const RequiredFilled = meta.story({
  name: "Required, filled",
  args: { required: true, filled: true, value: "12" },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText("Required")).not.toBeInTheDocument();
    await expect(canvas.getByRole("textbox", { name: "Company size" })).toHaveValue("12");
  },
});

export const ErrorState = meta.story({
  name: "Error",
  args: { required: true, filled: true, value: "lots", error: "Enter a whole number." },
  play: async ({ canvas }) => {
    const status = canvas.getByRole("status");
    await expect(status).toHaveTextContent("Enter a whole number.");
    await expect(status).toHaveAttribute("aria-live", "polite");
  },
});

export const CountOver = meta.story({
  name: "Count over the limit",
  args: { count: sample.note.length, max: 60, value: sample.note, suggestable: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(`${sample.note.length} / 60`)).toBeInTheDocument();
  },
});

export const Suggesting = meta.story({
  name: "Suggesting",
  args: { suggesting: true },
  play: async ({ canvas, userEvent, args }) => {
    const suggest = canvas.getByRole("button", { name: "Suggest Company size" });
    await expect(suggest).toHaveAttribute("aria-busy", "true");
    await expect(suggest).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(suggest);
    await expect(args.onSuggest).not.toHaveBeenCalled();
  },
});

export const SuggestionOffered = meta.story({
  name: "Suggestion offered",
  args: { suggestion: "50 to 99" },
  play: async ({ canvas, userEvent, args }) => {
    const take = canvas.getByRole("button", { name: "Suggested: 50 to 99. Use it" });
    await expect(canvas.queryByRole("textbox", { name: "Company size" })).not.toBeInTheDocument();
    await userEvent.click(take);
    await expect(args.onSuggestion).toHaveBeenCalledOnce();
    await expect(answer(args.onSuggestion.mock.calls[0])).toBe(true);
    take.focus();
    await userEvent.keyboard("{Escape}");
    await expect(answer(args.onSuggestion.mock.calls[1])).toBe(false);
    await expect(canvas.getByRole("button", { name: "Suggest Company size" })).toHaveFocus();
    await userEvent.click(canvas.getByRole("button", { name: "Dismiss the suggestion" }));
    await expect(answer(args.onSuggestion.mock.calls[2])).toBe(false);
  },
});

export const SuggestNote = meta.story({
  name: "Suggest note",
  args: { suggestNote: "No suggestion yet: add a company first." },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("No suggestion yet: add a company first.")).toBeInTheDocument();
  },
});

export const ReadOnlyField = meta.story({
  name: "Read-only field",
  args: { readonly: true, value: "120", hint: "", about: "" },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("textbox", { name: "Company size" });
    await expect(canvas.queryByRole("button", { name: "Suggest Company size" })).not.toBeInTheDocument();
    await userEvent.type(input, "5");
    await expect(input).toHaveValue("120");
  },
});

export const Valid = meta.story({
  name: "Valid",
  args: { valid: true, filled: true, value: "120" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Company size" })).toBeValid();
    await expect(canvas.queryByRole("status")).not.toBeInTheDocument();
  },
});

export const LabelAndControl = meta.story({
  name: "Label and control",
  parameters: {
    docs: {
      description: { story: "The label is tied to the control through control-id, so clicking it focuses the input." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Full name" control-id="field-name">
      <ui-text-input input-id="field-name" width="full" placeholder="Jane Cooper"></ui-text-input>
    </ui-field>
    <ui-field label="Email" control-id="field-email">
      <ui-text-input
        input-id="field-email"
        type="email"
        icon="mail"
        width="full"
        value="jane.cooper@example.com"
      ></ui-text-input>
    </ui-field>
  `,
});

export const Required = meta.story({
  name: "Required",
  parameters: {
    docs: { description: { story: "The Required pill shows until the field is filled, then gives way to the value." } },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Delivery address" required control-id="field-address-empty">
      <ui-text-input
        input-id="field-address-empty"
        width="full"
        required
        placeholder="Street and house number"
      ></ui-text-input>
    </ui-field>
    <ui-field label="Delivery address" required filled control-id="field-address-filled">
      <ui-text-input
        input-id="field-address-filled"
        width="full"
        required
        value="221 Maple Avenue, Springfield"
      ></ui-text-input>
    </ui-field>
  `,
});

export const Help = meta.story({
  name: "Help",
  parameters: {
    docs: {
      description: {
        story:
          "Hint and about text open in a popover from the help button; the hint is also read as the field's description.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field
      label="Phone"
      hint="Used only by the courier on the day of delivery."
      about="We never share your number for marketing."
      control-id="field-phone"
    >
      <ui-text-input input-id="field-phone" type="tel" icon="phone" width="full" value="+1 555 0134"></ui-text-input>
    </ui-field>
  `,
});

export const Validation = meta.story({
  name: "Validation",
  parameters: {
    docs: {
      description: {
        story: "An error is announced politely and marks the field with a warning; a valid field shows a check.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Email" required filled valid control-id="field-valid">
      <ui-text-input input-id="field-valid" type="email" width="full" value="sam.lee@example.com"></ui-text-input>
    </ui-field>
    <ui-field
      label="Email"
      required
      filled
      error="Enter an email address like name@example.com."
      control-id="field-invalid"
    >
      <ui-text-input input-id="field-invalid" type="email" color="error" width="full" value="sam.lee@"></ui-text-input>
    </ui-field>
  `,
});

export const CharacterCount = meta.story({
  name: "Character count",
  parameters: {
    docs: { description: { story: "The count turns amber within 10% of the limit and red past it." } },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Order note" .count=${sample.note.length} .max=${200} control-id="field-count-ok">
      <ui-textarea input-id="field-count-ok" width="full" rows="3" .value=${sample.note}></ui-textarea>
    </ui-field>
    <ui-field label="Short note" .count=${sample.note.length} .max=${80} control-id="field-count-near">
      <ui-textarea input-id="field-count-near" width="full" rows="3" .value=${sample.note}></ui-textarea>
    </ui-field>
    <ui-field
      label="Gift message"
      .count=${sample.note.length}
      .max=${60}
      error="Keep the gift message to 60 characters."
      control-id="field-count-over"
    >
      <ui-textarea input-id="field-count-over" color="error" width="full" rows="3" .value=${sample.note}></ui-textarea>
    </ui-field>
  `,
});

export const ReadOnly = meta.story({
  name: "Read-only",
  parameters: {
    docs: {
      description: {
        story: "A read-only field keeps its label colour and drops the focus bar and the suggest button.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Order number" readonly suggestable control-id="field-readonly">
      <ui-text-input input-id="field-readonly" width="full" readonly value="ORD-48213"></ui-text-input>
    </ui-field>
  `,
});

export const Suggestions = meta.story({
  name: "Suggestions",
  parameters: {
    docs: {
      description: {
        story:
          "The suggest button asks for an answer; an offered suggestion covers the control until it is used or dismissed with Escape.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Company size" suggestable control-id="field-suggest">
      <ui-text-input input-id="field-suggest" width="full" placeholder="Number of employees"></ui-text-input>
    </ui-field>
    <ui-field label="Company size" suggestable suggesting control-id="field-suggesting">
      <ui-text-input input-id="field-suggesting" width="full" placeholder="Number of employees"></ui-text-input>
    </ui-field>
    <ui-field label="Job title" suggestable suggestion="Operations Manager" control-id="field-suggestion">
      <ui-text-input input-id="field-suggestion" width="full" placeholder="Job title"></ui-text-input>
    </ui-field>
    <ui-field
      label="Job title"
      suggestable
      suggest-note="No suggestion yet: add a company first."
      control-id="field-suggest-note"
    >
      <ui-text-input input-id="field-suggest-note" width="full" placeholder="Job title"></ui-text-input>
    </ui-field>
  `,
});

export const UnlabelledAndPartialHelp = meta.story({
  name: "Unlabelled and partial help",
  parameters: {
    docs: {
      description: {
        story:
          "Without a label the help and suggest buttons use generic names; help shows only the hint or only the about text that is set; a count without max is a plain number; a suggestion moves focus to it only from this field's own suggest button.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field data-testid="reference" hint="Shown on the invoice." suggestable>
      <ui-text-input aria-label="Reference"></ui-text-input>
    </ui-field>
    <ui-field data-testid="notes" label="Notes" about="Only your team sees this." .count=${12}>
      <ui-text-input aria-label="Notes text"></ui-text-input>
    </ui-field>
  `,
  play: async ({ canvas }) => {
    const reference = canvas.getByTestId("reference") as HTMLElementTagNameMap["ui-field"];
    const notes = canvas.getByTestId("notes") as HTMLElementTagNameMap["ui-field"];
    await expect(reference.querySelector("label")).toBeNull();
    const about = canvas.getByRole("button", { name: "About this field" });
    await expect(reference.querySelector("[popover]")).toHaveTextContent("Shown on the invoice.");
    await expect(reference.querySelectorAll("[popover] p")).toHaveLength(1);
    await expect(about).toHaveAttribute("aria-expanded", "false");
    const label = canvas.getByText("Notes");
    await expect(label).not.toHaveAttribute("for");
    await expect(label).not.toHaveAttribute("id");
    await expect(canvas.getByRole("button", { name: "About Notes" })).toBeInTheDocument();
    await expect(notes.querySelectorAll("[popover] p")).toHaveLength(1);
    await expect(notes.querySelector("[popover]")).toHaveTextContent("Only your team sees this.");
    await expect(notes).toHaveTextContent("12");
    await expect(notes).not.toHaveTextContent("/");

    const suggest = canvas.getByRole("button", { name: "Suggest an answer" });
    suggest.focus();
    notes.suggestable = true;
    notes.suggestion = "Leave at reception";
    await notes.updateComplete;
    await expect(suggest).toHaveFocus();
    reference.suggestion = "INV-0042";
    await reference.updateComplete;
    await expect(canvas.getByRole("button", { name: "Suggested: INV-0042. Use it" })).toHaveFocus();
  },
});
