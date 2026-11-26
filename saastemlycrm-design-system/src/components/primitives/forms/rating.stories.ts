import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./field.ts";
import "./rating.ts";

const words = ["Poor", "Fair", "Good", "Very good", "Excellent"];

type FieldArgs = { fieldLabel: string; error: string; onChange: (e: CustomEvent) => void };

const meta = preview.type<{ args: FieldArgs }>().meta({
  title: "Primitives/Forms/Rating",
  component: "ui-rating",
  args: {
    fieldLabel: "Delivery experience",
    error: "",
    label: "Delivery experience",
    value: undefined,
    max: 5,
    words: [],
    required: false,
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    fieldLabel: { control: "text", description: "Label of the surrounding ui-field." },
    error: { control: "text", description: "Error of the surrounding ui-field." },
    label: { control: "text", description: "Accessible name of the star group." },
    value: { control: { type: "number", min: 0, max: 10, step: 1 } },
    max: { control: { type: "number", min: 1, max: 10, step: 1 } },
    words: { control: "object" },
    onChange: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-field label=${ifDefined(args.fieldLabel)} error=${ifDefined(args.error)} ?required=${args.required}>
      <ui-rating
        label=${ifDefined(args.label)}
        value=${ifDefined(args.value ?? undefined)}
        max=${ifDefined(args.max)}
        .words=${args.words ?? []}
        ?required=${args.required}
        ?disabled=${args.disabled}
        @ui-change=${args.onChange}
      ></ui-rating>
    </ui-field>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Click a star, use arrows, Home and End; pressing the current star clears it." } },
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("radiogroup", { name: "Delivery experience" })).toBeInTheDocument();
    await expect(canvas.getByText("Not rated")).toBeInTheDocument();
    const star = (name: string) => canvas.getByRole("radio", { name });
    await userEvent.click(star("3 of 5"));
    await expect(star("3 of 5")).toHaveAttribute("aria-checked", "true");
    await expect(canvas.getByText("3 of 5", { selector: "span" })).toBeInTheDocument();
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: 3 } }));
    star("3 of 5").focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(star("4 of 5")).toHaveAttribute("aria-checked", "true");
    await expect(star("4 of 5")).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(star("3 of 5")).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(star("2 of 5")).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{End}");
    await expect(star("5 of 5")).toHaveAttribute("aria-checked", "true");
    await expect(star("5 of 5")).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect(star("1 of 5")).toHaveAttribute("aria-checked", "true");
    await expect(star("1 of 5")).toHaveFocus();
    await userEvent.click(star("1 of 5"));
    await expect(star("1 of 5")).toHaveAttribute("aria-checked", "false");
    await expect(canvas.getByText("Not rated")).toBeInTheDocument();
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: null } }));
    star("1 of 5").focus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(star("1 of 5")).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{ArrowUp}");
    await expect(star("2 of 5")).toHaveAttribute("aria-checked", "true");
    await expect(star("2 of 5")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(star("1 of 5")).toHaveAttribute("aria-checked", "true");
    const calls = (args.onChange as ReturnType<typeof fn>).mock.calls.length;
    await userEvent.keyboard("x");
    await expect(star("1 of 5")).toHaveFocus();
    await expect(args.onChange).toHaveBeenCalledTimes(calls);
  },
});

export const ClickKeepsFocus = meta.story({
  name: "Click keeps focus",
  parameters: { docs: { description: { story: "Clicking a star updates it in place, so focus stays on it." } } },
  play: async ({ canvas, userEvent }) => {
    const three = canvas.getByRole("radio", { name: "3 of 5" });
    await userEvent.click(three);
    await expect(three).toHaveAttribute("aria-checked", "true");
    await expect(three).toHaveFocus();
    const five = canvas.getByRole("radio", { name: "5 of 5" });
    await userEvent.click(five);
    await expect(five).toHaveAttribute("aria-checked", "true");
    await expect(five).toHaveFocus();
    await expect(three.isConnected).toBe(true);
    await userEvent.keyboard("{ArrowLeft}");
    await expect(canvas.getByRole("radio", { name: "4 of 5" })).toHaveFocus();
  },
});

export const NamedByField = meta.story({
  name: "Named by the field label",
  parameters: {
    docs: {
      description: { story: "Without its own label, the star group takes its name from the field via input-id." },
    },
  },
  render: () => html`
    <ui-field label="Delivery experience" control-id="rating-field">
      <ui-rating input-id="rating-field"></ui-rating>
    </ui-field>
  `,
  play: async ({ canvas }) => {
    const group = canvas.getByRole("radiogroup", { name: "Delivery experience" });
    await expect(group).toHaveAttribute("id", "rating-field");
    await expect(canvas.getByText("Delivery experience", { selector: "label" })).toHaveAttribute("for", "rating-field");
  },
});

export const Filled = meta.story({
  name: "Filled",
  args: { value: 4 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("radio", { name: "4 of 5" })).toHaveAttribute("aria-checked", "true");
    await expect(canvas.getByRole("radio", { name: "4 of 5" })).toHaveAttribute("tabindex", "0");
    await expect(canvas.getByRole("radio", { name: "1 of 5" })).toHaveAttribute("tabindex", "-1");
  },
});

export const WordsShown = meta.story({
  name: "Words shown",
  args: { words, value: 2, fieldLabel: "Packaging", label: "Packaging" },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText("Fair", { selector: "span" })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("radio", { name: "5: Excellent" }));
    await expect(canvas.getByText("Excellent", { selector: "span" })).toBeInTheDocument();
  },
});

export const Required = meta.story({
  name: "Required",
  args: { required: true, value: 3, error: "Rate your order before submitting the review." },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Rate your order before submitting the review.");
    const three = canvas.getByRole("radio", { name: "3 of 5" });
    await userEvent.click(three);
    await expect(three).toHaveAttribute("aria-checked", "true");
    await expect(args.onChange).not.toHaveBeenCalled();
  },
});

export const Disabled = meta.story({
  name: "Disabled",
  args: { disabled: true, value: 3 },
  play: async ({ canvas, args }) => {
    for (const star of canvas.getAllByRole("radio")) await expect(star).toBeDisabled();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
});

export const InAField = meta.story({
  name: "In a field",
  parameters: {
    docs: {
      description: {
        story:
          "Stars form a radio group: arrow keys change the rating, Home and End jump to the ends, and pressing the current star clears it unless required.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Delivery experience">
      <ui-rating label="Delivery experience"></ui-rating>
    </ui-field>
    <ui-field label="Product quality" filled>
      <ui-rating label="Product quality" value="4"></ui-rating>
    </ui-field>
  `,
});

export const WithWords = meta.story({
  name: "With words",
  parameters: {
    docs: {
      description: { story: "Words replace the default 'n of 5' text beside the stars and in each star's name." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Customer service">
      <ui-rating label="Customer service" value="5" .words=${words}></ui-rating>
    </ui-field>
    <ui-field label="Packaging">
      <ui-rating label="Packaging" value="2" .words=${words}></ui-rating>
    </ui-field>
  `,
});

export const Scales = meta.story({
  name: "Scales",
  render: () => html`
    <ui-rating label="Three stars" max="3" value="2"></ui-rating>
    <ui-rating label="Ten stars" max="10" value="7"></ui-rating>
  `,
});

export const RequiredAndDisabled = meta.story({
  name: "Required and disabled",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-field label="Overall rating" required error="Rate your order before submitting the review.">
      <ui-rating label="Overall rating" required></ui-rating>
    </ui-field>
    <ui-field label="Supplier rating" readonly>
      <ui-rating label="Supplier rating" disabled value="3" .words=${words}></ui-rating>
    </ui-field>
  `,
});
