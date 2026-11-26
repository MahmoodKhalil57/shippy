import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fireEvent, fn } from "storybook/test";
import "./field.ts";
import "./stepper.ts";

type FieldArgs = { fieldLabel: string; error: string; required: boolean; onChange: (e: CustomEvent) => void };

const meta = preview.type<{ args: FieldArgs }>().meta({
  title: "Primitives/Forms/Stepper",
  component: "ui-stepper",
  args: {
    fieldLabel: "Quantity",
    error: "",
    required: false,
    label: "Quantity",
    value: 3,
    min: 1,
    max: 10,
    step: 1,
    unit: "boxes",
    placeholder: "1",
    disabled: false,
    inputId: "stepper-playground",
    onChange: fn(),
  },
  argTypes: {
    fieldLabel: { control: "text", description: "Label of the surrounding ui-field." },
    error: { control: "text", description: "Error of the surrounding ui-field." },
    required: { control: "boolean", description: "Marks the surrounding ui-field as required." },
    label: { control: "text", description: "Accessible name of the number input." },
    value: { control: { type: "number", step: 1 } },
    min: { control: { type: "number", step: 1 } },
    max: { control: { type: "number", step: 1 } },
    step: { control: { type: "number", min: 1, step: 1 } },
    unit: { control: "text" },
    placeholder: { control: "text" },
    inputId: { control: "text" },
    onChange: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-field
      label=${ifDefined(args.fieldLabel)}
      error=${ifDefined(args.error)}
      control-id=${ifDefined(args.inputId)}
      ?required=${args.required}
    >
      <ui-stepper
        input-id=${ifDefined(args.inputId)}
        label=${ifDefined(args.label)}
        value=${ifDefined(args.value ?? undefined)}
        min=${ifDefined(args.min)}
        max=${ifDefined(args.max)}
        step=${ifDefined(args.step)}
        unit=${ifDefined(args.unit)}
        placeholder=${ifDefined(args.placeholder)}
        ?disabled=${args.disabled}
        @ui-change=${args.onChange}
      ></ui-stepper>
    </ui-field>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Buttons step the value; typed values are clamped when the input loses focus." } },
  },
  play: async ({ canvas, userEvent, args }) => {
    const input = () => canvas.getByRole("spinbutton", { name: "Quantity" });
    const less = canvas.getByRole("button", { name: "Less Quantity" });
    const more = canvas.getByRole("button", { name: "More Quantity" });
    await expect(input()).toHaveValue(3);
    await userEvent.click(more);
    await expect(input()).toHaveValue(4);
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: 4 } }));
    await userEvent.click(less);
    await userEvent.click(less);
    await expect(input()).toHaveValue(2);
    await userEvent.clear(input());
    await userEvent.type(input(), "7");
    await userEvent.tab();
    await expect(input()).toHaveValue(7);
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: 7 } }));
    await userEvent.clear(input());
    await userEvent.type(input(), "40");
    await userEvent.tab();
    await expect(input()).toHaveValue(10);
    await expect(more).toBeDisabled();
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: 10 } }));
    await userEvent.clear(input());
    await userEvent.tab();
    await expect(input()).toHaveValue(null);
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: null } }));
  },
});

export const Empty = meta.story({
  name: "Empty",
  args: { value: undefined, unit: "" },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole("spinbutton", { name: "Quantity" });
    await expect(input).toHaveValue(null);
    await expect(input).toHaveAttribute("placeholder", "1");
    await userEvent.click(canvas.getByRole("button", { name: "More Quantity" }));
    await expect(canvas.getByRole("spinbutton", { name: "Quantity" })).toHaveValue(2);
    await expect(args.onChange).toHaveBeenCalledOnce();
  },
});

export const AtMinimum = meta.story({
  name: "At minimum",
  args: { value: 1 },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("button", { name: "Less Quantity" })).toBeDisabled();
    await userEvent.click(canvas.getByRole("button", { name: "More Quantity" }));
    await expect(canvas.getByRole("spinbutton", { name: "Quantity" })).toHaveValue(2);
    await expect(canvas.getByRole("button", { name: "Less Quantity" })).toBeEnabled();
  },
});

export const Disabled = meta.story({
  name: "Disabled",
  args: { disabled: true, value: 4 },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole("spinbutton", { name: "Quantity" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Less Quantity" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "More Quantity" })).toBeDisabled();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
});

export const ErrorState = meta.story({
  name: "Error",
  args: {
    fieldLabel: "Guests",
    label: "Guests",
    min: 0,
    value: 0,
    unit: "",
    required: true,
    error: "Add at least one guest.",
  },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Add at least one guest.");
    await expect(canvas.getByText("Required")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "More Guests" }));
    await expect(canvas.getByRole("spinbutton", { name: "Guests" })).toHaveValue(1);
  },
});

export const InAField = meta.story({
  name: "In a field",
  parameters: {
    docs: {
      description: {
        story:
          "Typed values are clamped to the bounds when the input loses focus; the buttons step from the minimum when empty.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Quantity" control-id="st-empty">
      <ui-stepper input-id="st-empty" label="Quantity" min="1" placeholder="1"></ui-stepper>
    </ui-field>
    <ui-field label="Quantity" filled control-id="st-filled">
      <ui-stepper input-id="st-filled" label="Quantity" min="1" max="99" value="3"></ui-stepper>
    </ui-field>
  `,
});

export const UnitsAndSteps = meta.story({
  name: "Units and steps",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-field label="Payment due" control-id="st-days">
      <ui-stepper input-id="st-days" label="Payment due" min="0" step="7" value="14" unit="days"></ui-stepper>
    </ui-field>
    <ui-field label="Seats" control-id="st-seats">
      <ui-stepper input-id="st-seats" label="Seats" min="5" step="5" value="25" unit="seats"></ui-stepper>
    </ui-field>
  `,
});

export const AtTheBounds = meta.story({
  name: "At the bounds",
  parameters: {
    docs: { description: { story: "The minus button disables at the minimum and the plus button at the maximum." } },
  },
  render: () => html`
    <ui-stepper label="Boxes at minimum" min="1" max="10" value="1" unit="boxes"></ui-stepper>
    <ui-stepper label="Boxes at maximum" min="1" max="10" value="10" unit="boxes"></ui-stepper>
  `,
});

export const DisabledAndInvalid = meta.story({
  name: "Disabled and invalid",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-field label="Pallets" readonly control-id="st-disabled">
      <ui-stepper input-id="st-disabled" label="Pallets" value="4" disabled></ui-stepper>
    </ui-field>
    <ui-field label="Guests" required error="Add at least one guest." control-id="st-invalid">
      <ui-stepper input-id="st-invalid" label="Guests" min="0" value="0"></ui-stepper>
    </ui-field>
  `,
});

export const Unbounded = meta.story({
  name: "Unbounded",
  parameters: {
    docs: {
      description: {
        story:
          "Without min, max, value or label the stepper counts from zero in both directions, its buttons read Less and More, and setting the same value fires nothing.",
      },
    },
  },
  render: (args) => html`
    <ui-field label="Adjustment" control-id="st-free">
      <ui-stepper input-id="st-free" @ui-change=${args.onChange}></ui-stepper>
    </ui-field>
  `,
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole("spinbutton", { name: "Adjustment" });
    await expect(input).not.toHaveAttribute("aria-label");
    await userEvent.click(canvas.getByRole("button", { name: "More" }));
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: 1 } }));
    const less = canvas.getByRole("button", { name: "Less" });
    await userEvent.click(less);
    await userEvent.click(less);
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: -1 } }));
    await expect(canvas.getByRole("spinbutton", { name: "Adjustment" })).toHaveValue(-1);
    await fireEvent.change(canvas.getByRole("spinbutton", { name: "Adjustment" }), { target: { value: "-1" } });
    await expect(args.onChange).toHaveBeenCalledTimes(3);
    await fireEvent.change(canvas.getByRole("spinbutton", { name: "Adjustment" }), { target: { value: "250" } });
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: 250 } }));
  },
});
