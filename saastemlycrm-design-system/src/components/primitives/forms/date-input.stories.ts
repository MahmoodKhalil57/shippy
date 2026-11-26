import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn, type Mock } from "storybook/test";
import "./date-input.ts";
import "./field.ts";

const day = { today: "2026-11-25" };

type FieldArgs = { fieldLabel: string; error: string; onChange: Mock<(e: CustomEvent) => void> };

const changed = (call: unknown[] = []) => (call[0] as CustomEvent<{ value: string }>).detail.value;

const meta = preview.type<{ args: FieldArgs }>().meta({
  title: "Primitives/Forms/Date input",
  component: "ui-date-input",
  args: {
    fieldLabel: "Follow-up date",
    error: "",
    label: "Follow-up date",
    inputId: "di-playground",
    today: day.today,
    value: "",
    time: false,
    future: false,
    min: "",
    max: "",
    required: false,
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    fieldLabel: { control: "text", description: "Label of the surrounding ui-field." },
    error: { control: "text", description: "Error of the surrounding ui-field." },
    label: { control: "text", description: "Accessible name of the date input." },
    inputId: { control: "text" },
    today: { control: "text", description: "The day quick picks and relative text count from (YYYY-MM-DD)." },
    value: { control: "text", description: "YYYY-MM-DD, or YYYY-MM-DDTHH:MM with time." },
    min: { control: "text" },
    max: { control: "text" },
    onChange: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-field
      label=${ifDefined(args.fieldLabel)}
      error=${ifDefined(args.error)}
      control-id=${ifDefined(args.inputId)}
      ?required=${args.required}
      ?filled=${!!args.value}
      ?readonly=${args.disabled}
    >
      <ui-date-input
        input-id=${ifDefined(args.inputId)}
        label=${ifDefined(args.label)}
        today=${ifDefined(args.today)}
        value=${ifDefined(args.value)}
        min=${ifDefined(args.min || undefined)}
        max=${ifDefined(args.max || undefined)}
        ?time=${args.time}
        ?future=${args.future}
        ?required=${args.required}
        ?disabled=${args.disabled}
        @ui-change=${args.onChange}
      ></ui-date-input>
    </ui-field>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: { story: "Quick picks set the date from today; typing a full date works too; Clear empties it." },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByLabelText("Follow-up date");
    await expect(input).toHaveAttribute("type", "date");
    await expect(canvas.getByRole("group", { name: "Quick picks for Follow-up date" })).toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Tomorrow" }));
    await expect(input).toHaveValue("2026-11-26");
    await expect(changed(args.onChange.mock.calls[0])).toBe("2026-11-26");
    await expect(canvas.getByText(/tomorrow/)).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "In a week" }));
    await expect(input).toHaveValue("2026-12-02");
    await expect(canvas.getByText(/in 7 days/)).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Today" }));
    await expect(input).toHaveValue(day.today);
    await expect(canvas.getByText(/today/)).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Clear" }));
    await expect(input).toHaveValue("");
    await expect(changed(args.onChange.mock.calls[3])).toBe("");
    await userEvent.type(input, "2026-12-15");
    await expect(input).toHaveValue("2026-12-15");
    await expect(changed(args.onChange.mock.calls.at(-1))).toBe("2026-12-15");
    await expect(canvas.getByText(/in 20 days/)).toBeInTheDocument();
  },
});

export const FilledInThePast = meta.story({
  name: "Filled, in the past",
  args: { fieldLabel: "Invoice date", label: "Invoice date", value: "2026-11-12" },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Invoice date")).toHaveValue("2026-11-12");
    await expect(canvas.getByText(/13 days ago/)).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  },
});

export const FutureLate = meta.story({
  name: "Future, late",
  args: { fieldLabel: "Due date", label: "Due date", future: true, value: "2026-11-20" },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText(/5 days ago/)).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "In a week" }));
    await expect(canvas.getByLabelText("Due date")).toHaveValue("2026-12-02");
    await expect(canvas.getByText(/in 7 days/)).toBeInTheDocument();
  },
});

export const WithTime = meta.story({
  name: "With time",
  args: {
    fieldLabel: "Delivery window starts",
    label: "Delivery window starts",
    time: true,
    value: "2026-11-27T14:30",
  },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByLabelText("Delivery window starts");
    await expect(input).toHaveAttribute("type", "datetime-local");
    await expect(canvas.getByText(/14:30/)).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Tomorrow" }));
    await expect(input).toHaveValue("2026-11-26T14:30");
    await expect(changed(args.onChange.mock.calls[0])).toBe("2026-11-26T14:30");
  },
});

export const RequiredWithError = meta.story({
  name: "Required with error",
  args: { fieldLabel: "Start date", label: "Start date", required: true, error: "Choose a start date." },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Start date");
    await expect(input).toBeRequired();
    await expect(input).toBeInvalid();
    await expect(canvas.getByRole("status")).toHaveTextContent("Choose a start date.");
    await userEvent.click(canvas.getByRole("button", { name: "Today" }));
    await expect(input).toBeValid();
    await expect(canvas.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  },
});

export const Bounds = meta.story({
  name: "Bounds",
  args: { fieldLabel: "Ship by", label: "Ship by", min: "2026-11-26", max: "2026-12-31" },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Ship by");
    await userEvent.click(canvas.getByRole("button", { name: "Today" }));
    await expect(input).toBeInvalid();
    await userEvent.click(canvas.getByRole("button", { name: "Tomorrow" }));
    await expect(input).toBeValid();
  },
});

export const Disabled = meta.story({
  name: "Disabled",
  args: { fieldLabel: "Signed on", label: "Signed on", disabled: true, value: "2026-10-14" },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByLabelText("Signed on")).toBeDisabled();
    await expect(canvas.queryByRole("group", { name: "Quick picks for Signed on" })).not.toBeInTheDocument();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
});

export const EmptyAndQuickPicks = meta.story({
  name: "Empty and quick picks",
  parameters: {
    docs: {
      description: {
        story: "Today, Tomorrow and In a week set the date in one press; the chosen pick is highlighted.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Follow-up date" control-id="di-empty">
      <ui-date-input input-id="di-empty" label="Follow-up date" today=${day.today}></ui-date-input>
    </ui-field>
    <ui-field label="Follow-up date" control-id="di-tomorrow">
      <ui-date-input
        input-id="di-tomorrow"
        label="Follow-up date"
        today=${day.today}
        value="2026-11-26"
      ></ui-date-input>
    </ui-field>
  `,
});

export const Filled = meta.story({
  name: "Filled",
  parameters: {
    docs: { description: { story: "Below the input the date is spelled out with how far it is from today." } },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Invoice date" control-id="di-filled">
      <ui-date-input input-id="di-filled" label="Invoice date" today=${day.today} value="2026-11-12"></ui-date-input>
    </ui-field>
    <ui-field label="Renewal date" control-id="di-week">
      <ui-date-input input-id="di-week" label="Renewal date" today=${day.today} value="2026-12-02"></ui-date-input>
    </ui-field>
  `,
});

export const FutureDates = meta.story({
  name: "Future dates",
  parameters: {
    docs: { description: { story: "With future set, a date in the past is flagged with a warning." } },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Due date" control-id="di-late">
      <ui-date-input input-id="di-late" label="Due date" today=${day.today} future value="2026-11-20"></ui-date-input>
    </ui-field>
    <ui-field label="Due date" control-id="di-ontime">
      <ui-date-input input-id="di-ontime" label="Due date" today=${day.today} future value="2026-12-10"></ui-date-input>
    </ui-field>
  `,
});

export const DateAndTime = meta.story({
  name: "Date and time",
  parameters: {
    docs: { description: { story: "A quick pick keeps the time already entered, or uses 09:00." } },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Delivery window starts" control-id="di-time">
      <ui-date-input
        input-id="di-time"
        label="Delivery window starts"
        time
        today=${day.today}
        value="2026-11-27T14:30"
      ></ui-date-input>
    </ui-field>
  `,
});

export const BoundsRequiredAndDisabled = meta.story({
  name: "Bounds, required and disabled",
  parameters: {
    docs: { description: { story: "A required date has no Clear button; a disabled one hides the quick picks." } },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Ship by" control-id="di-bounds">
      <ui-date-input
        input-id="di-bounds"
        label="Ship by"
        today=${day.today}
        min="2026-11-25"
        max="2026-12-31"
        value="2026-12-01"
      ></ui-date-input>
    </ui-field>
    <ui-field label="Start date" required filled control-id="di-required">
      <ui-date-input
        input-id="di-required"
        label="Start date"
        required
        today=${day.today}
        value="2026-12-01"
      ></ui-date-input>
    </ui-field>
    <ui-field label="Signed on" readonly control-id="di-disabled">
      <ui-date-input
        input-id="di-disabled"
        label="Signed on"
        disabled
        today=${day.today}
        value="2026-10-14"
      ></ui-date-input>
    </ui-field>
    <ui-field label="Start date" required error="Choose a start date." control-id="di-invalid">
      <ui-date-input input-id="di-invalid" label="Start date" required today=${day.today}></ui-date-input>
    </ui-field>
  `,
});

export const WithoutTodayOrLabel = meta.story({
  name: "Without today or label",
  parameters: {
    docs: {
      description: {
        story:
          "Without today the picks count from the real date; a time field picks 09:00 when no time is set; picking the same day again fires nothing; a ui-field labels the input by id.",
      },
    },
  },
  render: (args) => html`
    <ui-field label="Follow-up" control-id="di-free">
      <ui-date-input input-id="di-free" time @ui-change=${args.onChange}></ui-date-input>
    </ui-field>
    <ui-date-input label="Reminder" today="2026-03-02" value="2026-03-03"></ui-date-input>
  `,
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByLabelText("Follow-up");
    await expect(input).not.toHaveAttribute("aria-label");
    await expect(input).toHaveAttribute("type", "datetime-local");
    const today = canvas.getAllByRole("button", { name: "Today" })[0]!;
    await expect(canvas.getByRole("group", { name: "Quick picks" })).toContainElement(today);
    await userEvent.click(today);
    const expected = `${new Date().toISOString().slice(0, 10)}T09:00`;
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: expected } }));
    await expect(input).toHaveValue(expected);
    await userEvent.click(today);
    await expect(args.onChange).toHaveBeenCalledOnce();
    const reminder = canvas.getByLabelText("Reminder");
    await expect(reminder).not.toHaveAttribute("id");
    await expect(reminder).toHaveValue("2026-03-03");
    await expect(canvas.getByRole("group", { name: "Quick picks for Reminder" })).toBeVisible();
  },
});
