import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn, type Mock } from "storybook/test";
import "./field.ts";
import "./file-input.ts";

const files = {
  notes: () => new File(["Deliver to the side door."], "notes.txt", { type: "text/plain" }),
  photo: () => new File(["image"], "dock.png", { type: "image/png" }),
};

type FieldArgs = { fieldLabel: string; fieldHint: string; error: string; onChange: Mock<(e: CustomEvent) => void> };

const meta = preview.type<{ args: FieldArgs }>().meta({
  title: "Primitives/Forms/File input",
  component: "ui-file-input",
  args: {
    fieldLabel: "Attachments",
    fieldHint: "",
    error: "",
    label: "Attachments",
    name: "attachments",
    accept: "",
    capture: undefined,
    variant: undefined,
    color: undefined,
    size: "md",
    multiple: false,
    required: false,
    disabled: false,
    legend: "",
    hint: "",
    onChange: fn(),
  },
  argTypes: {
    fieldLabel: { control: "text", description: "Label of the surrounding ui-field." },
    fieldHint: { control: "text", description: "Hint of the surrounding ui-field." },
    error: { control: "text", description: "Error of the surrounding ui-field." },
    label: { control: "text", description: "Accessible name of the file input." },
    name: { control: "text" },
    accept: { control: "text" },
    capture: { control: "inline-radio", options: [undefined, "user", "environment"] },
    variant: { control: "inline-radio", options: [undefined, "ghost"] },
    color: {
      control: "select",
      options: [undefined, "neutral", "primary", "secondary", "accent", "info", "success", "warning", "error"],
    },
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
    legend: { control: "text" },
    hint: { control: "text" },
    onChange: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-field
      label=${ifDefined(args.fieldLabel)}
      hint=${ifDefined(args.fieldHint)}
      error=${ifDefined(args.error)}
      ?required=${args.required}
    >
      <ui-file-input
        label=${ifDefined(args.label)}
        name=${ifDefined(args.name)}
        accept=${ifDefined(args.accept || undefined)}
        capture=${ifDefined(args.capture)}
        variant=${ifDefined(args.variant)}
        color=${ifDefined(args.color)}
        size=${ifDefined(args.size)}
        legend=${ifDefined(args.legend)}
        hint=${ifDefined(args.hint)}
        ?multiple=${args.multiple}
        ?required=${args.required}
        ?disabled=${args.disabled}
        @ui-change=${args.onChange}
      ></ui-file-input>
    </ui-field>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Choosing a file fires ui-change with the chosen files." } } },
  play: async ({ canvas, userEvent, args, canvasElement }) => {
    const input = canvas.getByLabelText("Attachments");
    await expect(input).toHaveAttribute("type", "file");
    await userEvent.upload(input, files.notes());
    await expect(args.onChange).toHaveBeenCalledOnce();
    const detail = (args.onChange.mock.calls[0]![0] as CustomEvent<{ files: FileList }>).detail;
    await expect(detail.files).toHaveLength(1);
    await expect(detail.files[0]?.name).toBe("notes.txt");
    await expect(canvasElement.querySelector("ui-file-input")?.files?.[0]?.type).toBe("text/plain");
  },
});

export const Multiple = meta.story({
  name: "Multiple",
  args: { multiple: true, fieldHint: "Up to five files, 10 MB each." },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByLabelText("Attachments");
    await expect(input).toHaveAttribute("multiple");
    await userEvent.upload(input, [files.notes(), files.photo()]);
    const detail = (args.onChange.mock.calls[0]![0] as CustomEvent<{ files: FileList }>).detail;
    await expect(Array.from(detail.files, (f) => f.name)).toEqual(["notes.txt", "dock.png"]);
  },
});

export const RequiredWithError = meta.story({
  name: "Required with error",
  args: {
    fieldLabel: "Signed contract",
    label: "Signed contract",
    required: true,
    color: "error",
    accept: "text/plain",
    error: "Upload the signed contract to continue.",
  },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByLabelText("Signed contract");
    await expect(input).toBeRequired();
    await expect(input).toBeInvalid();
    await expect(canvas.getByRole("status")).toHaveTextContent("Upload the signed contract to continue.");
    await userEvent.upload(input, files.notes());
    await expect(args.onChange).toHaveBeenCalledOnce();
  },
});

export const Disabled = meta.story({
  name: "Disabled",
  args: { disabled: true },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByLabelText("Attachments")).toBeDisabled();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
});

export const WithLegendAndHint = meta.story({
  name: "With legend and hint",
  args: {
    fieldLabel: "",
    legend: "Product photo",
    hint: "PNG or JPEG, at least 1200 pixels wide.",
    label: "Product photo",
    accept: "image/png,image/jpeg",
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("group", { name: "Product photo" })).toBeInTheDocument();
    await expect(canvas.getByText("PNG or JPEG, at least 1200 pixels wide.")).toBeInTheDocument();
    await userEvent.upload(canvas.getByLabelText("Product photo"), files.photo());
    await expect(args.onChange).toHaveBeenCalledOnce();
  },
});

export const InAField = meta.story({
  name: "In a field",
  parameters: { docs: { description: { story: "A change fires ui-change with the chosen files." } }, canvas: "column" },
  render: () => html`
    <ui-field label="Proof of delivery">
      <ui-file-input label="Proof of delivery" accept="image/*,application/pdf"></ui-file-input>
    </ui-field>
    <ui-field label="Attachments" hint="Up to five files, 10 MB each.">
      <ui-file-input label="Attachments" multiple></ui-file-input>
    </ui-field>
  `,
});

export const VariantsAndColours = meta.story({
  name: "Variants and colours",
  render: () => html`
    <ui-file-input label="Default"></ui-file-input>
    <ui-file-input variant="ghost" label="Ghost"></ui-file-input>
    <ui-file-input color="neutral" label="Neutral"></ui-file-input>
    <ui-file-input color="primary" label="Primary"></ui-file-input>
    <ui-file-input color="secondary" label="Secondary"></ui-file-input>
    <ui-file-input color="accent" label="Accent"></ui-file-input>
    <ui-file-input color="info" label="Info"></ui-file-input>
    <ui-file-input color="success" label="Success"></ui-file-input>
    <ui-file-input color="warning" label="Warning"></ui-file-input>
    <ui-file-input color="error" label="Error"></ui-file-input>
  `,
});

export const Sizes = meta.story({
  name: "Sizes",
  render: () => html`
    <ui-file-input size="xs" label="Extra small"></ui-file-input>
    <ui-file-input size="sm" label="Small"></ui-file-input>
    <ui-file-input size="md" label="Medium"></ui-file-input>
    <ui-file-input size="lg" label="Large"></ui-file-input>
    <ui-file-input size="xl" label="Extra large"></ui-file-input>
  `,
});

export const States = meta.story({
  name: "States",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-field label="Signed contract">
      <ui-file-input label="Signed contract" disabled></ui-file-input>
    </ui-field>
    <ui-field label="Signed contract" required error="Upload the signed contract to continue.">
      <ui-file-input label="Signed contract" color="error" required accept="application/pdf"></ui-file-input>
    </ui-field>
  `,
});

export const FieldsetWithLegendAndHint = meta.story({
  name: "Fieldset with legend and hint",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-file-input
      legend="Product photo"
      hint="PNG or JPEG, at least 1200 pixels wide."
      label="Product photo"
      accept="image/png,image/jpeg"
      capture="environment"
    ></ui-file-input>
    <ui-file-input legend="Signed contract" accept="application/pdf"></ui-file-input>
    <ui-file-input label="Receipt" hint="One PDF per expense."></ui-file-input>
  `,
  play: async ({ canvas }) => {
    const contract = canvas.getByRole("group", { name: "Signed contract" });
    await expect(contract).not.toHaveTextContent("One PDF per expense.");
    const upload = canvas.getByLabelText("Signed contract");
    await expect(upload).not.toHaveAttribute("aria-label");
    await expect(upload).toHaveAttribute("aria-labelledby");
    const receipt = canvas.getByLabelText("Receipt");
    await expect(receipt).not.toHaveAttribute("aria-labelledby");
    const hinted = receipt.closest("fieldset")!;
    await expect(hinted.querySelector("legend")).toBeNull();
    await expect(hinted).toHaveTextContent("One PDF per expense.");
  },
});
