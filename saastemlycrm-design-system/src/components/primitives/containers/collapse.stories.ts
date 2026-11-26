import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "./collapse.ts";

const meta = preview.type<{ args: { text: string; onToggle: (e: Event) => void } }>().meta({
  title: "Primitives/Containers/Collapse",
  component: "ui-collapse",
  args: {
    heading: "Payment terms",
    text: "Payment is due 30 days after the invoice date.",
    mode: "checkbox",
    icon: "arrow",
    iconPosition: "end",
    force: undefined,
    color: undefined,
    bordered: true,
    open: false,
    closeOutside: false,
    name: undefined,
    onToggle: fn(),
  },
  argTypes: {
    heading: { control: "text" },
    text: { control: "text", description: "The panel's content." },
    mode: { control: "inline-radio", options: ["focus", "checkbox", "radio", "details"] },
    icon: { control: "inline-radio", options: [undefined, "arrow", "plus"] },
    iconPosition: { control: "inline-radio", options: ["start", "end"] },
    force: { control: "inline-radio", options: [undefined, "open", "close"] },
    color: { control: "inline-radio", options: [undefined, "primary"] },
    bordered: { control: "boolean" },
    name: { control: "text" },
    onToggle: { table: { category: "events" } },
  },
  parameters: { canvas: "column" },
  render: (args) => html`
    <ui-collapse
      heading=${ifDefined(args.heading as string | undefined)}
      mode=${ifDefined(args.mode)}
      icon=${ifDefined(args.icon)}
      icon-position=${ifDefined(args.iconPosition)}
      force=${ifDefined(args.force)}
      color=${ifDefined(args.color)}
      bordered=${args.bordered === false ? "false" : "true"}
      ?open=${args.open}
      ?close-outside=${args.closeOutside}
      name=${ifDefined(args.name)}
      @ui-toggle=${args.onToggle}
      >${args.text}</ui-collapse
    >
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the collapse; toggling it calls onToggle." } } },
  play: async ({ canvas, userEvent, args }) => {
    const toggle = canvas.getByRole("checkbox", { name: "Payment terms" });
    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await expect(args.onToggle).toHaveBeenCalledOnce();
    await expect(canvas.getByText("Payment is due 30 days after the invoice date.")).toBeVisible();
    await userEvent.keyboard(" ");
    await expect(toggle).not.toBeChecked();
    await expect(args.onToggle).toHaveBeenCalledTimes(2);
  },
});

export const OpenDetails = meta.story({
  name: "Open details",
  args: { mode: "details", open: true },
  play: async ({ canvas, userEvent, args }) => {
    const panel = canvas.getByRole("group");
    await expect(panel).toHaveAttribute("open");
    await expect(canvas.getByText("Payment is due 30 days after the invoice date.")).toBeVisible();
    await userEvent.click(canvas.getByText("Payment terms"));
    await expect(panel).not.toHaveAttribute("open");
    await expect(args.onToggle).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { open: false } }));
  },
});

export const RadioAccordionItem = meta.story({
  name: "Radio item",
  args: { mode: "radio", name: "terms", icon: "plus" },
  play: async ({ canvas, userEvent, args }) => {
    const radio = canvas.getByRole("radio", { name: "Payment terms" });
    await expect(radio).not.toBeChecked();
    await userEvent.click(radio);
    await expect(radio).toBeChecked();
    await expect(args.onToggle).toHaveBeenCalledOnce();
  },
});

export const ForcedOpen = meta.story({
  name: "Forced open",
  args: { mode: "focus", force: "open" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Payment is due 30 days after the invoice date.")).toBeVisible();
  },
});

export const Icons = meta.story({
  name: "Icons",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-collapse mode="checkbox" icon="arrow" heading="Arrow icon" open>
      Payment is due 30 days after the invoice date.
    </ui-collapse>
    <ui-collapse mode="checkbox" icon="plus" heading="Plus icon"> Late payments add a 2% fee each month. </ui-collapse>
    <ui-collapse mode="checkbox" icon="arrow" icon-position="start" heading="Icon at the start">
      The icon can sit before the title instead of after it.
    </ui-collapse>
    <ui-collapse mode="checkbox" heading="No icon">A plain title with no indicator.</ui-collapse>
  `,
});

export const Modes = meta.story({
  name: "Modes",
  parameters: {
    docs: {
      description: {
        story: "focus opens while the collapse has focus; checkbox toggles on click; details uses a native disclosure.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-collapse mode="focus" icon="arrow" heading="Focus: opens while focused, closes on blur">
      Tab away and this closes again.
    </ui-collapse>
    <ui-collapse mode="checkbox" icon="arrow" heading="Checkbox: click to toggle">
      Stays open until the title is clicked again.
    </ui-collapse>
    <ui-collapse mode="details" icon="arrow" heading="Details: native disclosure" open>
      Works with find-in-page and reports ui-toggle.
    </ui-collapse>
  `,
});

export const Accordion = meta.story({
  name: "Accordion",
  parameters: {
    docs: { description: { story: "Radio or details collapses sharing a name keep at most one panel open." } },
    canvas: "column",
  },
  render: () => html`
    <ui-collapse mode="radio" name="billing-faq" icon="plus" heading="How do I change my plan?" open>
      Open Billing, choose a plan and confirm. The change applies from the next cycle.
    </ui-collapse>
    <ui-collapse mode="radio" name="billing-faq" icon="plus" heading="Can I get a refund?">
      Refunds are available within 14 days of a charge.
    </ui-collapse>
    <ui-collapse mode="radio" name="billing-faq" icon="plus" heading="Where are my receipts?">
      Every receipt is under Billing, then History.
    </ui-collapse>
    <ui-collapse mode="details" name="team-faq" icon="arrow" heading="Who can invite people?" open>
      Owners and admins.
    </ui-collapse>
    <ui-collapse mode="details" name="team-faq" icon="arrow" heading="How many seats are included?">
      Five seats on every plan.
    </ui-collapse>
  `,
});

export const ForcedState = meta.story({
  name: "Forced state",
  parameters: {
    docs: { description: { story: "force pins the collapse open or closed whatever the user does." } },
    canvas: "column",
  },
  render: () => html`
    <ui-collapse mode="focus" force="open" icon="arrow" heading="Always open">
      This panel cannot be closed.
    </ui-collapse>
    <ui-collapse mode="focus" force="close" icon="arrow" heading="Always closed"> This text never shows. </ui-collapse>
  `,
});

export const ColourAndBorder = meta.story({
  name: "Colour and border",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-collapse mode="checkbox" color="primary" icon="arrow" heading="Primary, changes colour when open">
      Useful for a single emphasised section.
    </ui-collapse>
    <ui-collapse mode="focus" color="primary" icon="arrow" heading="Primary in focus mode">
      Switches to secondary while focused.
    </ui-collapse>
    <ui-collapse mode="checkbox" bordered="false" icon="arrow" heading="Without a border" open>
      Sits flat on the surface behind it.
    </ui-collapse>
  `,
});

export const CloseByClickingOutside = meta.story({
  name: "Close by clicking outside",
  parameters: {
    docs: {
      description: { story: "With close-outside an open checkbox collapse closes when you click anywhere outside it." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-collapse mode="checkbox" close-outside icon="arrow" heading="Quarterly report notes">
      Click outside this panel to close it.
    </ui-collapse>
  `,
});

export const SlottedTitle = meta.story({
  name: "Slotted title",
  render: (args) => html`
    <ui-collapse mode="checkbox" icon="arrow" @ui-toggle=${args.onToggle}>
      <span slot="title">Shipping <strong>options</strong></span>
      Orders ship within two business days.
    </ui-collapse>
  `,
  play: async ({ canvas, userEvent, args }) => {
    const toggle = canvas.getByRole("checkbox", { name: "Shipping options" });
    await expect(canvas.getByText("options").tagName).toBe("STRONG");
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await expect(args.onToggle).toHaveBeenCalledWith(expect.objectContaining({ detail: { open: true } }));
  },
});
