import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn, waitFor, type Mock } from "storybook/test";
import "./field.ts";
import "./combobox.ts";
import type { ComboboxOption } from "./combobox.ts";

const people: ComboboxOption[] = [
  { value: "u1", label: "Avery Brooks", description: "avery.brooks@example.com" },
  { value: "u2", label: "Dana Whitfield", description: "dana.whitfield@example.com" },
  { value: "u3", label: "Elliot Hughes", description: "elliot.hughes@example.com" },
  { value: "u4", label: "Morgan Ellis", description: "morgan.ellis@example.com" },
  { value: "u5", label: "Riley Chen", description: "riley.chen@example.com" },
];

const products: ComboboxOption[] = [
  { value: "mug", label: "Ceramic mug", group: "Kitchen" },
  { value: "kettle", label: "Electric kettle", group: "Kitchen" },
  { value: "board", label: "Chopping board", group: "Kitchen" },
  { value: "lamp", label: "Desk lamp", group: "Office" },
  { value: "chair", label: "Task chair", group: "Office" },
  { value: "notebook", label: "Lined notebook", group: "Office" },
  { value: "towel", label: "Bath towel", group: "Home" },
  { value: "candle", label: "Scented candle", group: "Home" },
];

const tags: ComboboxOption[] = [
  { value: "wholesale", label: "Wholesale" },
  { value: "priority", label: "Priority" },
  { value: "gift", label: "Gift" },
  { value: "fragile", label: "Fragile" },
];

type FieldArgs = { fieldLabel: string; error: string; required: boolean; onChange: Mock<(e: CustomEvent) => void> };

const changed = (call: unknown[] = []) => (call[0] as CustomEvent<{ value: string | string[] }>).detail.value;

const meta = preview.type<{ args: FieldArgs }>().meta({
  title: "Primitives/Forms/Combobox",
  component: "ui-combobox",
  args: {
    fieldLabel: "Account owner",
    error: "",
    required: false,
    ariaLabelText: "Account owner",
    options: people,
    value: "",
    placeholder: "Search people",
    multiple: false,
    creatable: false,
    clearable: false,
    disabled: false,
    readonly: false,
    color: undefined,
    size: "md",
    legend: "",
    label: "",
    hint: "",
    fieldWidth: undefined,
    inputmode: undefined,
    onChange: fn(),
  },
  argTypes: {
    fieldLabel: { control: "text", description: "Label of the surrounding ui-field." },
    error: { control: "text", description: "Error of the surrounding ui-field." },
    required: { control: "boolean", description: "Marks the surrounding ui-field as required." },
    ariaLabelText: { control: "text", name: "aria-label" },
    options: { control: "object" },
    value: { control: "object" },
    placeholder: { control: "text" },
    color: { control: "inline-radio", options: [undefined, "error"] },
    size: { control: "inline-radio", options: ["sm", "md"] },
    legend: { control: "text" },
    label: { control: "text" },
    hint: { control: "text" },
    fieldWidth: { control: "select", options: [undefined, "auto", "64", "xs", "sm", "md", "lg", "full"] },
    inputmode: { control: "select", options: [undefined, "text", "search", "email", "numeric"] },
    onChange: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-field label=${ifDefined(args.fieldLabel)} error=${ifDefined(args.error)} ?required=${args.required}>
      <ui-combobox
        aria-label=${ifDefined(args.ariaLabelText)}
        .options=${args.options ?? []}
        .value=${args.value ?? ""}
        placeholder=${ifDefined(args.placeholder)}
        color=${ifDefined(args.color)}
        size=${ifDefined(args.size)}
        legend=${ifDefined(args.legend)}
        label=${ifDefined(args.label)}
        hint=${ifDefined(args.hint)}
        field-width=${ifDefined(args.fieldWidth)}
        inputmode=${ifDefined(args.inputmode)}
        ?multiple=${args.multiple}
        ?creatable=${args.creatable}
        ?clearable=${args.clearable}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        @ui-change=${args.onChange}
      ></ui-combobox>
    </ui-field>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Type to filter; pick with arrows and Enter or with a click; Escape closes." } },
  },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole("combobox", { name: "Account owner" });
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(input);
    await expect(input).toHaveAttribute("aria-expanded", "true");
    await expect(await canvas.findAllByRole("option")).toHaveLength(5);
    await userEvent.type(input, "dana");
    await expect(canvas.getAllByRole("option")).toHaveLength(1);
    await expect(canvas.getByRole("option", { name: /Dana Whitfield/ })).toBeInTheDocument();
    await userEvent.keyboard("{Enter}");
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(changed(args.onChange.mock.calls[0])).toBe("u2");
    await expect(input).toHaveValue("Dana Whitfield");
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(input);
    await expect(input).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("option", { name: /Dana Whitfield/ })).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    await expect(changed(args.onChange.mock.calls[1])).toBe("u4");
    await expect(input).toHaveValue("Morgan Ellis");
    await userEvent.keyboard("{ArrowDown}");
    await expect(input).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{ArrowUp}");
    await expect(input).toHaveAttribute("aria-activedescendant", expect.stringMatching(/-2$/));
    await userEvent.keyboard("{Escape}");
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await expect(input).toHaveValue("Morgan Ellis");
    await userEvent.click(input);
    await userEvent.click(canvas.getByRole("option", { name: /Riley Chen/ }));
    await expect(changed(args.onChange.mock.calls[2])).toBe("u5");
    await expect(input).toHaveValue("Riley Chen");
    await expect(args.onChange).toHaveBeenCalledTimes(3);
    input.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{Escape}");
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await expect(args.onChange).toHaveBeenCalledTimes(3);
    await userEvent.keyboard("{ArrowDown}");
    await expect(input).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Tab}");
    await expect(input).toHaveAttribute("aria-expanded", "false");
  },
});

export const FilterByDescriptionAndGroup = meta.story({
  name: "Filter by description and group",
  args: { fieldLabel: "Product", ariaLabelText: "Product", options: products, placeholder: "Search products" },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("combobox", { name: "Product" });
    await userEvent.click(input);
    await userEvent.type(input, "office");
    await expect(canvas.getAllByRole("option")).toHaveLength(3);
    await expect(canvas.getByText("Office")).toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, "zzz");
    await expect(canvas.queryAllByRole("option")).toHaveLength(0);
    await expect(canvas.getByRole("status")).toHaveTextContent("No matches");
    await expect(canvas.queryByRole("listbox")).not.toBeInTheDocument();
    await userEvent.keyboard("{Enter}");
    await expect(input).toHaveAttribute("aria-expanded", "true");
    await expect(input).toHaveValue("zzz");
    await userEvent.keyboard("{Escape}");
    await expect(input).toHaveAttribute("aria-expanded", "false");
  },
});

export const MultiplePicks = meta.story({
  name: "Multiple picks",
  args: {
    fieldLabel: "Tags",
    ariaLabelText: "Tags",
    options: tags,
    value: ["priority"],
    multiple: true,
    placeholder: "",
  },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole("combobox", { name: "Tags" });
    await expect(canvas.getByText("Priority")).toBeInTheDocument();
    await userEvent.click(input);
    await expect(canvas.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
    await userEvent.type(input, "gi");
    await userEvent.keyboard("{Enter}");
    await expect(changed(args.onChange.mock.calls[0])).toEqual(["priority", "gift"]);
    await expect(input).toHaveValue("");
    await expect(input).toHaveFocus();
    await userEvent.click(canvas.getByRole("option", { name: "Fragile" }));
    await expect(changed(args.onChange.mock.calls[1])).toEqual(["priority", "gift", "fragile"]);
    await expect(canvas.getByRole("option", { name: "Fragile" })).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Backspace}");
    await expect(changed(args.onChange.mock.calls[2])).toEqual(["priority", "gift"]);
    await userEvent.click(canvas.getByRole("button", { name: "Remove Priority" }));
    await expect(changed(args.onChange.mock.calls[3])).toEqual(["gift"]);
    await expect(canvas.queryByRole("button", { name: "Remove Priority" })).not.toBeInTheDocument();
    await userEvent.click(input);
    await userEvent.click(await canvas.findByRole("option", { name: "Gift" }));
    await expect(changed(args.onChange.mock.calls[4])).toEqual([]);
    await expect(canvas.getByRole("option", { name: "Gift" })).toHaveAttribute("aria-selected", "false");
  },
});

export const CreatableEntry = meta.story({
  name: "Creatable entry",
  args: { fieldLabel: "Tags", ariaLabelText: "Tags", options: tags, value: [], multiple: true, creatable: true },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole("combobox", { name: "Tags" });
    await userEvent.click(input);
    await userEvent.type(input, "Seasonal");
    await expect(canvas.getByRole("option", { name: "Add “Seasonal”" })).toBeInTheDocument();
    await userEvent.keyboard("{Enter}");
    await expect(changed(args.onChange.mock.calls[0])).toEqual(["Seasonal"]);
    await expect(canvas.getByRole("button", { name: "Remove Seasonal" })).toBeInTheDocument();
  },
});

export const Clearable = meta.story({
  name: "Clearable",
  args: { value: "u4", clearable: true },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole("combobox", { name: "Account owner" });
    await expect(input).toHaveValue("Morgan Ellis");
    await userEvent.click(canvas.getByRole("button", { name: "Clear" }));
    await expect(changed(args.onChange.mock.calls[0])).toBe("");
    await expect(input).toHaveValue("");
    await expect(canvas.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  },
});

export const ErrorState = meta.story({
  name: "Error",
  args: { required: true, color: "error", error: "Choose who owns this account." },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Choose who owns this account.");
    await expect(canvas.getByText("Required")).toBeInTheDocument();
  },
});

export const Disabled = meta.story({
  name: "Disabled",
  args: { disabled: true, value: "u1" },
  play: async ({ canvas, args }) => {
    const input = canvas.getByRole("combobox", { name: "Account owner" });
    await expect(input).toBeDisabled();
    await expect(input).toHaveValue("Avery Brooks");
    await expect(args.onChange).not.toHaveBeenCalled();
  },
});

export const ReadOnly = meta.story({
  name: "Read-only",
  args: { readonly: true, value: "u3", clearable: true },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole("combobox", { name: "Account owner" });
    await expect(input).toHaveAttribute("readonly");
    await userEvent.click(input);
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await expect(canvas.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
});

export const SingleChoice = meta.story({
  name: "Single choice",
  parameters: {
    docs: {
      description: {
        story: "Typing filters by label, description and group; arrow keys move, Enter picks, Escape closes.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Account owner">
      <ui-combobox aria-label="Account owner" placeholder="Search people" .options=${people}></ui-combobox>
    </ui-field>
    <ui-field label="Account owner" required filled>
      <ui-combobox aria-label="Account owner" clearable value="u4" .options=${people}></ui-combobox>
    </ui-field>
  `,
});

export const GroupedOptions = meta.story({
  name: "Grouped options",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-field label="Product">
      <ui-combobox aria-label="Product" placeholder="Find a product" .options=${products}></ui-combobox>
    </ui-field>
  `,
});

export const MultipleChoice = meta.story({
  name: "Multiple choice",
  parameters: {
    docs: { description: { story: "Picked values show as chips; Backspace in an empty input removes the last one." } },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Watchers">
      <ui-combobox aria-label="Watchers" multiple .options=${people}></ui-combobox>
    </ui-field>
    <ui-field label="Watchers">
      <ui-combobox
        aria-label="Watchers"
        multiple
        clearable
        .value=${["u1", "u3", "u5"]}
        .options=${people}
      ></ui-combobox>
    </ui-field>
  `,
});

export const Creatable = meta.story({
  name: "Creatable",
  parameters: {
    docs: {
      description: { story: "With creatable, a typed value that matches nothing can be added as a new option." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Tags">
      <ui-combobox
        aria-label="Tags"
        multiple
        creatable
        placeholder="Type and press Enter"
        .value=${["priority", "Returning customer"]}
        .options=${tags}
      ></ui-combobox>
    </ui-field>
    <ui-field label="Alternate emails">
      <ui-combobox
        aria-label="Alternate emails"
        multiple
        creatable
        placeholder="Type an email and press Enter"
        .value=${["billing@example.com"]}
      ></ui-combobox>
    </ui-field>
  `,
});

export const Sizes = meta.story({
  name: "Sizes",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-combobox aria-label="Small" size="sm" placeholder="Small" .options=${people}></ui-combobox>
    <ui-combobox aria-label="Medium" size="md" placeholder="Medium" .options=${people}></ui-combobox>
  `,
});

export const States = meta.story({
  name: "States",
  parameters: {
    docs: { description: { story: "Read-only and disabled keep the chips but hide the remove buttons and the list." } },
    canvas: "column",
  },
  render: () => html`
    <ui-field label="Watchers" readonly>
      <ui-combobox aria-label="Watchers" multiple readonly .value=${["u1", "u2"]} .options=${people}></ui-combobox>
    </ui-field>
    <ui-field label="Account owner">
      <ui-combobox aria-label="Account owner" disabled value="u2" .options=${people}></ui-combobox>
    </ui-field>
    <ui-field label="Account owner" required error="Choose who owns this account.">
      <ui-combobox
        aria-label="Account owner"
        color="error"
        placeholder="Search people"
        .options=${people}
      ></ui-combobox>
    </ui-field>
  `,
});

export const BuiltInLabel = meta.story({
  name: "Built-in label",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-combobox
      legend="Assignment"
      label="Assignee"
      hint="The assignee is notified by email."
      field-width="full"
      placeholder="Search people"
      .options=${people}
    ></ui-combobox>
    <ui-combobox
      label="Reviewer"
      aria-label="Contract reviewer"
      field-width="full"
      placeholder="Search people"
      .options=${people}
    ></ui-combobox>
  `,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("combobox", { name: "Assignee" })).toBeInTheDocument();
    await expect(canvas.getByRole("combobox", { name: "Contract reviewer" })).toBeInTheDocument();
  },
});

export const NamedByField = meta.story({
  name: "Named by the field label",
  parameters: {
    docs: { description: { story: "input-id lets the field's control-id point its label at the combobox input." } },
  },
  render: () => html`
    <ui-field label="Account owner" control-id="cb-owner">
      <ui-combobox input-id="cb-owner" placeholder="Search people" .options=${people}></ui-combobox>
    </ui-field>
  `,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("combobox", { name: "Account owner" });
    await expect(input).toHaveAttribute("id", "cb-owner");
    await userEvent.click(canvas.getByText("Account owner", { selector: "label" }));
    await expect(input).toHaveFocus();
    await expect(input).toHaveAttribute("aria-expanded", "true");
  },
});

export const NoOptions = meta.story({
  name: "No options",
  parameters: {
    docs: {
      description: {
        story:
          "Without options the open list says there is nothing to choose, or invites typing when the combobox is creatable.",
      },
    },
  },
  render: () => html`
    <ui-combobox aria-label="Labels" creatable multiple></ui-combobox>
    <ui-combobox aria-label="Approver"></ui-combobox>
  `,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Labels" }));
    await waitFor(() => expect(canvas.getByText("Type to add")).toBeVisible());
    await userEvent.click(canvas.getByRole("combobox", { name: "Approver" }));
    await waitFor(() => expect(canvas.getByText("Nothing to choose from")).toBeVisible());
  },
});

export const ClosedBeforeItOpens = meta.story({
  name: "Closed before it opens",
  parameters: {
    docs: { description: { story: "Escape right after opening keeps the list closed once the update lands." } },
  },
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByRole("combobox", { name: "Account owner" });
    input.focus();
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await canvasElement.querySelector("ui-combobox")!.updateComplete;
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await expect(canvasElement.querySelector("[popover]")!.matches(":popover-open")).toBe(false);
  },
});
