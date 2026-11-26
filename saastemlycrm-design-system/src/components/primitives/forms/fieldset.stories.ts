import preview from "#.storybook/preview";
import { html, render } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "../actions/button.ts";
import "./checkbox.ts";
import "./field.ts";
import { fieldLabels, fieldsetField, groupName, legendLabel } from "./fieldset.ts";
import "./text-input.ts";
import "./radio.ts";

const sizes = ["Small", "Large"];

const meta = preview.type<{ args: { onInput: (e: Event) => void; onAction: (e: Event) => void } }>().meta({
  title: "Primitives/Forms/Fieldset",
  component: "ui-fieldset",
  args: {
    legend: "Shipping address",
    hint: "We only deliver within the country.",
    surface: "base-100",
    width: "full",
    disabled: false,
    name: "shipping",
    onInput: fn(),
    onAction: fn(),
  },
  argTypes: {
    legend: { control: "text" },
    hint: { control: "text" },
    surface: { control: "inline-radio", options: ["base-100", "base-200"] },
    width: { control: "select", options: ["auto", "64", "xs", "sm", "md", "lg", "full"] },
    name: { control: "text" },
    onInput: { table: { category: "events" } },
    onAction: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-fieldset
      legend=${ifDefined(args.legend)}
      hint=${ifDefined(args.hint)}
      surface=${ifDefined(args.surface)}
      width=${ifDefined(args.width)}
      name=${ifDefined(args.name)}
      ?disabled=${args.disabled}
      @input=${args.onInput}
    >
      <ui-field label="Street" control-id="fs-play-street">
        <ui-text-input input-id="fs-play-street" width="full" value="48 Elm Street"></ui-text-input>
      </ui-field>
      <ui-field label="City" control-id="fs-play-city">
        <ui-text-input input-id="fs-play-city" width="full"></ui-text-input>
      </ui-field>
      <ui-button slot="actions" color="primary" @click=${args.onAction}>Save address</ui-button>
    </ui-fieldset>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the fieldset; its fields and action work inside it." } },
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("group", { name: "Shipping address" })).toBeInTheDocument();
    await expect(canvas.getByText("We only deliver within the country.")).toBeInTheDocument();
    const city = canvas.getByLabelText("City");
    await userEvent.type(city, "Fairview");
    await expect(city).toHaveValue("Fairview");
    await expect(args.onInput).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "Save address" }));
    await expect(args.onAction).toHaveBeenCalledOnce();
  },
});

export const DisabledControls = meta.story({
  name: "Disabled controls",
  args: { disabled: true, legend: "Payment card", hint: "Managed by your account administrator." },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole("group", { name: "Payment card" })).toBeDisabled();
    await expect(canvas.getByLabelText("Street")).toBeDisabled();
    await expect(canvas.getByLabelText("City")).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Save address" })).toBeDisabled();
    await expect(args.onAction).not.toHaveBeenCalled();
  },
});

export const WithoutLegend = meta.story({
  name: "Without legend",
  args: { legend: "", hint: "", surface: "base-200" },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.queryByRole("group", { name: "Shipping address" })).not.toBeInTheDocument();
    const street = canvas.getByLabelText("Street");
    await userEvent.clear(street);
    await userEvent.type(street, "12 Oak Lane");
    await expect(street).toHaveValue("12 Oak Lane");
  },
});

export const LegendAndHint = meta.story({
  name: "Legend and hint",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-fieldset legend="Shipping address" hint="We only deliver within the country." width="full">
      <ui-field label="Street" control-id="fs-street">
        <ui-text-input input-id="fs-street" width="full" value="48 Elm Street"></ui-text-input>
      </ui-field>
      <ui-field label="City" control-id="fs-city">
        <ui-text-input input-id="fs-city" width="full" value="Fairview"></ui-text-input>
      </ui-field>
      <ui-field label="Postcode" control-id="fs-postcode">
        <ui-text-input input-id="fs-postcode" width="64" value="30512"></ui-text-input>
      </ui-field>
    </ui-fieldset>
  `,
});

export const Surfaces = meta.story({
  name: "Surfaces",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-fieldset legend="On the page surface" surface="base-100" width="full">
      <ui-field label="Contact name" control-id="fs-surface-1">
        <ui-text-input input-id="fs-surface-1" width="full" value="Taylor Reed"></ui-text-input>
      </ui-field>
    </ui-fieldset>
    <ui-fieldset legend="On a container surface" surface="base-200" width="full">
      <ui-field label="Contact name" control-id="fs-surface-2">
        <ui-text-input input-id="fs-surface-2" width="full" value="Taylor Reed"></ui-text-input>
      </ui-field>
    </ui-fieldset>
  `,
});

export const Widths = meta.story({
  name: "Widths",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-fieldset legend="Small" surface="base-200" width="sm">
      <ui-text-input aria-label="Coupon code" width="full" placeholder="Coupon code"></ui-text-input>
    </ui-fieldset>
    <ui-fieldset legend="Medium" surface="base-200" width="md">
      <ui-text-input aria-label="Coupon code" width="full" placeholder="Coupon code"></ui-text-input>
    </ui-fieldset>
    <ui-fieldset legend="Large" surface="base-200" width="lg">
      <ui-text-input aria-label="Coupon code" width="full" placeholder="Coupon code"></ui-text-input>
    </ui-fieldset>
  `,
});

export const ActionsAndARichLegend = meta.story({
  name: "Actions and a rich legend",
  parameters: {
    docs: {
      description: {
        story:
          "Children in the legend slot replace the legend text; children in the actions slot sit under the fields.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-fieldset surface="base-200" width="full">
      <span slot="legend">Billing contact <strong>(required)</strong></span>
      <ui-field label="Email" required filled control-id="fs-billing">
        <ui-text-input
          input-id="fs-billing"
          type="email"
          icon="mail"
          width="full"
          value="accounts@example.com"
        ></ui-text-input>
      </ui-field>
      <ui-checkbox label="Send copies of invoices to this address" checked></ui-checkbox>
      <ui-button slot="actions" color="primary">Save contact</ui-button>
    </ui-fieldset>
  `,
});

export const Disabled = meta.story({
  name: "Disabled",
  parameters: {
    docs: { description: { story: "Disabling the fieldset disables every control inside it at once." } },
    canvas: "column",
  },
  render: () => html`
    <ui-fieldset
      legend="Payment card"
      hint="Managed by your account administrator."
      surface="base-200"
      width="full"
      disabled
    >
      <ui-field label="Name on card" control-id="fs-disabled-name">
        <ui-text-input input-id="fs-disabled-name" width="full" value="Casey Nolan"></ui-text-input>
      </ui-field>
      <ui-field label="Card number" control-id="fs-disabled-card">
        <ui-text-input input-id="fs-disabled-card" width="full" tabular value="•••• •••• •••• 4242"></ui-text-input>
      </ui-field>
      <ui-button slot="actions" variant="outlined">Update card</ui-button>
    </ui-fieldset>
  `,
});

export const ArrayLegend = meta.story({
  name: "Array legend",
  parameters: {
    docs: { description: { story: "A legend given as parts renders them; an empty list draws no legend." } },
  },
  render: () => html`
    <ui-fieldset data-testid="parts" .legend=${["Billing", " contact"]}>
      <ui-text-input aria-label="Billing email"></ui-text-input>
    </ui-fieldset>
    <ui-fieldset data-testid="none" .legend=${[]}>
      <ui-text-input aria-label="Coupon"></ui-text-input>
    </ui-fieldset>
  `,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("group", { name: "Billing contact" })).toBeInTheDocument();
    await expect(canvas.getByTestId("none").querySelector("legend")).toBeNull();
  },
});

export const CaptionHelpers = meta.story({
  name: "Caption helpers",
  parameters: {
    docs: {
      description: {
        story:
          "The helpers that controls use for captions: a legend names a control only without its own label, a group control falls back from aria-label to label, legend and an enclosing ui-field, and fieldsetField draws only the parts it is given.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-text-input legend="Lookup"></ui-text-input>
    <ui-text-input legend="Delivery" label="Instructions"></ui-text-input>
    <ui-radio .label=${html`<span>Size</span>`} legend="Cup size" .options=${sizes} value="Small"></ui-radio>
    <ui-field label="Seats" control-id="fs-seats"><input id="fs-seats" type="number" /></ui-field>
    <div data-testid="scratch"></div>
  `,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("textbox", { name: "Lookup" })).toHaveAttribute("aria-labelledby");
    await expect(canvas.getByRole("textbox", { name: "Instructions" })).not.toHaveAttribute("aria-labelledby");
    await expect(canvas.getByRole("radiogroup", { name: "Cup size" })).toBeInTheDocument();
    await expect(legendLabel({ controlId: "x" })).toBeUndefined();

    const seats = canvas.getByRole("spinbutton", { name: "Seats" });
    await expect(groupName(seats, { controlId: "fs-seats" })).toEqual({ labelledby: "fs-seats-label" });
    await expect(groupName(seats, { controlId: "other" })).toEqual({});
    await expect(groupName(seats, { ariaLabel: "Count", controlId: "fs-seats" })).toEqual({ label: "Count" });
    await expect(groupName(seats, { label: "Guests", controlId: "fs-seats" })).toEqual({ label: "Guests" });
    await expect(fieldLabels(canvasElement, "fs-seats")).toBe(false);

    const foreign = document.implementation.createHTMLDocument("");
    const outer = foreign.createElement("ui-field");
    outer.setAttribute("label", "Seats");
    outer.setAttribute("control-id", "seats");
    const inner = foreign.createElement("span");
    outer.append(inner);
    await expect(fieldLabels(inner, "seats")).toBe(true);
    await expect(fieldLabels(inner, "other")).toBe(false);

    const scratch = canvas.getByTestId("scratch");
    const part = (into: string) => {
      const el = document.createElement("div");
      el.dataset.part = into;
      scratch.append(el);
      return el;
    };
    const full = part("full");
    render(
      fieldsetField(
        { legend: "Delivery", label: "Notes", hint: "Optional." },
        html`<input aria-label="Delivery notes" />`,
      ),
      full,
    );
    await expect(full.querySelector("legend")).not.toHaveAttribute("id");
    await expect(full.querySelector("label")).not.toHaveAttribute("for");
    await expect(full).toHaveTextContent("Optional.");
    const hinted = part("hinted");
    render(
      fieldsetField({ validatorHint: "Five digits.", hintOnInvalid: true }, html`<input aria-label="Postcode" />`),
      hinted,
    );
    await expect(hinted.querySelector("fieldset")).toBeNull();
    await expect(hinted.querySelector("input + p")).toHaveTextContent("Five digits.");
    const labelled = part("labelled");
    render(fieldsetField({ label: "Notes", controlId: "fs-notes" }, html`<input id="fs-notes" />`), labelled);
    await expect(labelled.querySelector("legend")).toBeNull();
    await expect(canvas.getByRole("textbox", { name: "Notes" })).toHaveAttribute("id", "fs-notes");
    const bare = part("bare");
    render(fieldsetField({}, html`<input aria-label="Code" />`), bare);
    await expect(bare.children).toHaveLength(1);
    await expect(bare.firstElementChild!.tagName).toBe("INPUT");
  },
});
