import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./field.ts";
import "./scale.ts";

type FieldArgs = { fieldLabel: string; error: string; required: boolean; onChange: (e: CustomEvent) => void };

const meta = preview.type<{ args: FieldArgs }>().meta({
  title: "Primitives/Forms/Scale",
  component: "ui-scale",
  args: {
    fieldLabel: "How easy was checkout?",
    error: "",
    required: false,
    label: "How easy was checkout?",
    value: undefined,
    min: 1,
    max: 5,
    low: "Very hard",
    high: "Very easy",
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    fieldLabel: { control: "text", description: "Label of the surrounding ui-field." },
    error: { control: "text", description: "Error of the surrounding ui-field." },
    required: { control: "boolean", description: "Marks the surrounding ui-field as required." },
    label: { control: "text", description: "Accessible name of the step group." },
    value: { control: { type: "number", min: 0, max: 10, step: 1 } },
    min: { control: { type: "number", min: 0, max: 10, step: 1 } },
    max: { control: { type: "number", min: 1, max: 10, step: 1 } },
    low: { control: "text" },
    high: { control: "text" },
    onChange: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-field label=${ifDefined(args.fieldLabel)} error=${ifDefined(args.error)} ?required=${args.required}>
      <ui-scale
        label=${ifDefined(args.label)}
        value=${ifDefined(args.value ?? undefined)}
        min=${ifDefined(args.min)}
        max=${ifDefined(args.max)}
        low=${ifDefined(args.low)}
        high=${ifDefined(args.high)}
        ?disabled=${args.disabled}
        @ui-change=${args.onChange}
      ></ui-scale>
    </ui-field>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Click a step, or use arrows, Home and End to move the answer." } } },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("radiogroup", { name: "How easy was checkout?" })).toBeInTheDocument();
    await expect(canvas.getByText("Very hard")).toBeInTheDocument();
    await expect(canvas.getByText("Very easy")).toBeInTheDocument();
    const step = (name: string) => canvas.getByRole("radio", { name });
    await userEvent.click(step("2"));
    await expect(step("2")).toHaveAttribute("aria-checked", "true");
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: 2 } }));
    step("2").focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(step("3")).toHaveAttribute("aria-checked", "true");
    await expect(step("3")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(step("2")).toHaveAttribute("aria-checked", "true");
    await expect(step("2")).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect(step("5")).toHaveAttribute("aria-checked", "true");
    await expect(step("5")).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(step("5")).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{Home}");
    await expect(step("1")).toHaveAttribute("aria-checked", "true");
    await expect(args.onChange).toHaveBeenCalledTimes(5);
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: 1 } }));
  },
});

export const KeysFromNoAnswer = meta.story({
  name: "Keys from no answer",
  parameters: {
    docs: { description: { story: "With no answer yet, keys start from the lowest step; other keys do nothing." } },
  },
  play: async ({ canvas, userEvent, args }) => {
    const step = (name: string) => canvas.getByRole("radio", { name });
    step("1").focus();
    await userEvent.keyboard("x");
    await expect(step("1")).toHaveAttribute("aria-checked", "false");
    await expect(args.onChange).not.toHaveBeenCalled();
    await userEvent.keyboard("{ArrowUp}");
    await expect(step("2")).toHaveAttribute("aria-checked", "true");
    await expect(step("2")).toHaveFocus();
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: 2 } }));
  },
});

export const ClickKeepsFocus = meta.story({
  name: "Click keeps focus",
  parameters: { docs: { description: { story: "Clicking a step updates it in place, so focus stays on it." } } },
  play: async ({ canvas, userEvent }) => {
    const two = canvas.getByRole("radio", { name: "2" });
    await userEvent.click(two);
    await expect(two).toHaveAttribute("aria-checked", "true");
    await expect(two).toHaveFocus();
    const four = canvas.getByRole("radio", { name: "4" });
    await userEvent.click(four);
    await expect(four).toHaveAttribute("aria-checked", "true");
    await expect(four).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("radio", { name: "5" })).toHaveFocus();
  },
});

export const NamedByField = meta.story({
  name: "Named by the field label",
  parameters: {
    docs: {
      description: { story: "Without its own label, the step group takes its name from the field via input-id." },
    },
  },
  render: () => html`
    <ui-field label="How easy was checkout?" control-id="scale-field">
      <ui-scale input-id="scale-field" low="Very hard" high="Very easy"></ui-scale>
    </ui-field>
  `,
  play: async ({ canvas }) => {
    const group = canvas.getByRole("radiogroup", { name: "How easy was checkout?" });
    await expect(group).toHaveAttribute("id", "scale-field");
  },
});

export const ZeroToTenFilled = meta.story({
  name: "Zero to ten, filled",
  args: {
    fieldLabel: "How likely are you to recommend us?",
    label: "How likely are you to recommend us?",
    min: 0,
    max: 10,
    value: 8,
    low: "Not at all likely",
    high: "Extremely likely",
  },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getAllByRole("radio")).toHaveLength(11);
    const eight = canvas.getByRole("radio", { name: "8" });
    await expect(eight).toHaveAttribute("aria-checked", "true");
    await expect(eight).toHaveAttribute("tabindex", "0");
    eight.focus();
    await userEvent.keyboard("{Home}");
    await expect(canvas.getByRole("radio", { name: "0" })).toHaveAttribute("aria-checked", "true");
  },
});

export const RequiredWithError = meta.story({
  name: "Required with error",
  args: { required: true, error: "Pick a score from 1 to 5.", fieldLabel: "Satisfaction", label: "Satisfaction" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Required")).toBeInTheDocument();
    await expect(canvas.getByRole("status")).toHaveTextContent("Pick a score from 1 to 5.");
    for (const step of canvas.getAllByRole("radio")) await expect(step).toHaveAttribute("aria-checked", "false");
  },
});

export const Disabled = meta.story({
  name: "Disabled",
  args: { disabled: true, value: 3 },
  play: async ({ canvas, args }) => {
    for (const step of canvas.getAllByRole("radio")) await expect(step).toBeDisabled();
    await expect(canvas.getByRole("radio", { name: "3" })).toHaveAttribute("aria-checked", "true");
    await expect(args.onChange).not.toHaveBeenCalled();
  },
});

export const InAField = meta.story({
  name: "In a field",
  parameters: {
    docs: {
      description: { story: "Steps form a radio group: arrow keys move the answer, Home and End jump to the ends." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="How easy was checkout?">
      <ui-scale label="How easy was checkout?" low="Very hard" high="Very easy"></ui-scale>
    </ui-field>
    <ui-field label="How easy was checkout?" filled>
      <ui-scale label="How easy was checkout?" low="Very hard" high="Very easy" value="4"></ui-scale>
    </ui-field>
  `,
});

export const ZeroToTen = meta.story({
  name: "Zero to ten",
  parameters: {
    docs: { description: { story: "Steps up to the answer fill in, getting deeper towards the top of the scale." } },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="How likely are you to recommend us to a friend?">
      <ui-scale
        label="How likely are you to recommend us to a friend?"
        min="0"
        max="10"
        low="Not at all likely"
        high="Extremely likely"
        value="8"
      ></ui-scale>
    </ui-field>
  `,
});

export const WithoutEndLabels = meta.story({
  name: "Without end labels",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-field label="Priority">
      <ui-scale label="Priority" min="1" max="3" value="1"></ui-scale>
    </ui-field>
  `,
});

export const RequiredAndDisabled = meta.story({
  name: "Required and disabled",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-field label="Satisfaction" required error="Pick a score from 1 to 5.">
      <ui-scale label="Satisfaction" low="Unhappy" high="Delighted"></ui-scale>
    </ui-field>
    <ui-field label="Satisfaction" readonly>
      <ui-scale label="Satisfaction" low="Unhappy" high="Delighted" value="3" disabled></ui-scale>
    </ui-field>
  `,
});
