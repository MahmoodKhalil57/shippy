import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn, waitFor } from "storybook/test";
import "./accordion.ts";
import "../../primitives/containers/collapse.ts";
import type { AccordionItem, UiAccordion } from "./accordion.ts";

const faq = {
  shipping: { heading: "How long does shipping take?", content: "Orders arrive within three to five working days." },
  returns: { heading: "Can I return an order?", content: "Unused items can be returned within thirty days." },
  payment: { heading: "Which payment methods work?", content: "Cards and bank transfers are both accepted." },
};

const items: AccordionItem[] = Object.values(faq);
const withOpen: AccordionItem[] = [faq.shipping, { ...faq.returns, open: true }, { ...faq.payment, open: true }];

type AccordionArgs = {
  items: AccordionItem[];
  mode: "radio" | "details";
  icon?: "arrow" | "plus";
  joined: boolean;
  bordered: boolean;
  name?: string;
  onChange: (detail: { index: number }) => void;
};

const changed = (args: AccordionArgs) => (e: CustomEvent<{ index: number }>) => args.onChange(e.detail);

const meta = preview.type<{ args: AccordionArgs }>().meta({
  title: "Composed/Containers/Accordion",
  component: "ui-accordion",
  args: {
    items,
    mode: "radio",
    icon: "arrow",
    joined: false,
    bordered: true,
    name: undefined,
    onChange: fn(),
  },
  argTypes: {
    items: { control: "object", description: "The sections, each with a heading, content and optional open flag." },
    mode: { control: "inline-radio", options: ["radio", "details"] },
    icon: { control: "inline-radio", options: [undefined, "arrow", "plus"] },
    joined: { control: "boolean", description: "Joins the sections into one surface." },
    bordered: { control: "boolean" },
    name: { control: "text", description: "The group name that keeps one section open." },
    onChange: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-accordion
      .items=${args.items}
      mode=${ifDefined(args.mode)}
      icon=${ifDefined(args.icon)}
      ?joined=${args.joined}
      bordered=${args.bordered ? "true" : "false"}
      name=${ifDefined(args.name)}
      @ui-change=${changed(args)}
    ></ui-accordion>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the accordion; opening a section reports it." } } },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const shipping = canvas.getByRole("radio", { name: faq.shipping.heading });
    const returns = canvas.getByRole("radio", { name: faq.returns.heading });
    await expect(shipping).not.toBeChecked();
    await expect(returns).not.toBeChecked();
    await userEvent.click(shipping);
    await expect(shipping).toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith({ index: 0 });
    await expect(canvas.getByText(faq.shipping.content)).toBeVisible();
    await userEvent.click(returns);
    await expect(returns).toBeChecked();
    await expect(shipping).not.toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith({ index: 1 });
    await expect(args.onChange).toHaveBeenCalledTimes(2);
    await expect(shipping).toHaveAttribute("name", returns.getAttribute("name")!);
    const accordion = canvasElement.querySelector<UiAccordion>("ui-accordion")!;
    accordion.joined = true;
    await expect(await canvas.findByRole("radio", { name: faq.returns.heading })).toBeChecked();
    await expect(canvasElement.querySelector("ui-join")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("radio", { name: faq.shipping.heading }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ index: 0 });
    await expect(args.onChange).toHaveBeenCalledTimes(3);
  },
});

export const InitiallyOpen = meta.story({
  name: "Initially open",
  args: { items: withOpen, name: "faq" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("radio", { name: faq.returns.heading })).toBeChecked();
    await expect(canvas.getByRole("radio", { name: faq.payment.heading })).not.toBeChecked();
    await expect(canvas.getByRole("radio", { name: faq.shipping.heading })).toHaveAttribute("name", "faq");
    await expect(canvas.getByText(faq.returns.content)).toBeVisible();
  },
});

export const Details = meta.story({
  name: "Details",
  args: { mode: "details", icon: "plus", items: withOpen, name: "faq-details" },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const panels = [...canvasElement.querySelectorAll("details")];
    await expect(panels).toHaveLength(3);
    await expect(panels[1]).toHaveAttribute("open");
    await expect(panels[2]).not.toHaveAttribute("open");
    await userEvent.click(canvas.getByText(faq.payment.heading));
    await waitFor(() => expect(panels[2]).toHaveAttribute("open"));
    await waitFor(() => expect(panels[1]).not.toHaveAttribute("open"));
    await waitFor(() => expect(args.onChange).toHaveBeenCalledOnce());
    await expect(args.onChange).toHaveBeenCalledWith({ index: 2 });
    await userEvent.click(canvas.getByText(faq.payment.heading));
    await waitFor(() => expect(panels[2]).not.toHaveAttribute("open"));
    await expect(args.onChange).toHaveBeenCalledOnce();
  },
});

export const Joined = meta.story({
  name: "Joined",
  args: { joined: true, bordered: false, icon: undefined },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await expect(canvasElement.querySelector("ui-join")).toBeInTheDocument();
    await expect(canvasElement.querySelector("ui-flex")).toBeNull();
    await userEvent.click(canvas.getByRole("radio", { name: faq.payment.heading }));
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(args.onChange).toHaveBeenCalledWith({ index: 2 });
  },
});

export const Composed = meta.story({
  name: "Own sections",
  args: { items: [] },
  render: (args) => html`
    <ui-accordion @ui-change=${changed(args)}>
      <ui-collapse mode="details" heading=${faq.shipping.heading}>${faq.shipping.content}</ui-collapse>
      <ui-collapse mode="details" heading=${faq.returns.heading}>${faq.returns.content}</ui-collapse>
    </ui-accordion>
  `,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const panels = [...canvasElement.querySelectorAll("details")];
    await expect(panels).toHaveLength(2);
    await expect(canvasElement.querySelector("ui-accordion > ui-flex ui-collapse")).toBeInTheDocument();
    await userEvent.click(canvas.getByText(faq.returns.heading));
    await waitFor(() => expect(panels[1]).toHaveAttribute("open"));
    await expect(canvas.getByText(faq.returns.content)).toBeVisible();
  },
});
