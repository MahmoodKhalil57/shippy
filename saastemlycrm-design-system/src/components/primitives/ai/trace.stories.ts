import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./trace.ts";
import "./markdown.ts";
import { ICON_NAMES } from "../../../lib/base/icon-names.ts";
import type { IconName } from "../media/icon.ts";
import type { TraceStatus } from "./trace.ts";

const meta = preview
  .type<{
    args: {
      status: TraceStatus;
      icon: IconName;
      label: string;
      description: string;
      open: boolean;
      details: string;
    };
  }>()
  .meta({
    title: "Primitives/Ai/Trace",
    component: "ui-trace",
    args: {
      status: "done",
      icon: "search",
      label: "Searched orders",
      description: "3 results",
      open: false,
      details: "Order 10482 shipped; orders 10475 and 10461 were delivered.",
    },
    argTypes: {
      status: { control: "inline-radio", options: ["running", "done", "error", "denied", "waiting"] },
      icon: { control: "select", options: ICON_NAMES, description: "The finished step's icon." },
      label: { control: "text" },
      description: { control: "text" },
      details: { control: "text", description: "Content that turns the step into a disclosure; empty for none." },
    },
    render: (args) => html`
      <ui-trace>
        <ui-trace-line icon="thinking" label="Thought for 4 seconds"></ui-trace-line>
        <ui-trace-line
          status=${ifDefined(args.status)}
          icon=${ifDefined(args.icon)}
          label=${args.label}
          description=${args.description}
          ?open=${args.open}
          >${args.details}</ui-trace-line
        >
      </ui-trace>
    `,
  });

const stepOf = (el: HTMLElement) => el.querySelectorAll<HTMLElement>("ui-trace-line")[1]!;

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: { story: "The controls drive the second step; with details its summary opens and closes it." },
    },
    canvas: "column",
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole("list")).toBeVisible();
    await expect(canvas.getAllByRole("listitem")).toHaveLength(2);
    const details = stepOf(canvasElement).querySelector("details")!;
    const content = canvas.getByText("Order 10482 shipped; orders 10475 and 10461 were delivered.");
    await expect(details.open).toBe(false);
    await expect(content).not.toBeVisible();
    await userEvent.click(canvas.getByText("Searched orders"));
    await expect(details.open).toBe(true);
    await expect(content).toBeVisible();
    await userEvent.click(canvas.getByText("Searched orders"));
    await expect(details.open).toBe(false);
    await expect(content).not.toBeVisible();
  },
});

export const Running = meta.story({
  name: "Running",
  args: { status: "running", label: "Checking the carrier", description: "Tracking 58213", details: "" },
  parameters: { canvas: "column" },
  play: async ({ canvas, canvasElement }) => {
    const step = stepOf(canvasElement);
    await expect(canvas.getByText("Checking the carrier")).toBeVisible();
    await expect(step.querySelector("details")).toBeNull();
    await expect(step.querySelector(".loading-spinner")).not.toBeNull();
  },
});

export const ErrorState = meta.story({
  name: "Error",
  args: { status: "error", label: "Refund failed", description: "The card has expired", details: "" },
  parameters: { canvas: "column" },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText("The card has expired")).toBeVisible();
    const step = stepOf(canvasElement);
    await expect(step.querySelector(".loading-spinner")).toBeNull();
    await expect(step.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  },
});

export const StartsOpen = meta.story({
  name: "Starts open",
  args: { open: true },
  parameters: { canvas: "column" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Order 10482 shipped; orders 10475 and 10461 were delivered.")).toBeVisible();
  },
});

export const Statuses = meta.story({
  name: "Statuses",
  parameters: {
    docs: {
      description: {
        story: "A running step shimmers with a spinner; error, denied and waiting steps use their own icons.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-trace>
      <ui-trace-line status="done" label="Looked up order" description="Order 10482"></ui-trace-line>
      <ui-trace-line status="running" label="Checking the carrier" description="Tracking 58213"></ui-trace-line>
      <ui-trace-line status="waiting" label="Waiting for approval" description="Cancel order"></ui-trace-line>
      <ui-trace-line status="denied" label="Cancel order" description="Not allowed"></ui-trace-line>
      <ui-trace-line status="error" label="Refund failed" description="The card has expired"></ui-trace-line>
    </ui-trace>
  `,
});

export const IconsForFinishedSteps = meta.story({
  name: "Icons for finished steps",
  parameters: {
    docs: { description: { story: "A finished step shows its own icon, a tick unless another is given." } },
    canvas: "column",
  },
  render: () => html`
    <ui-trace>
      <ui-trace-line icon="thinking" label="Thought for 4 seconds"></ui-trace-line>
      <ui-trace-line icon="search" label="Searched orders" description="3 results"></ui-trace-line>
      <ui-trace-line icon="globe" label="Read the carrier's delivery page"></ui-trace-line>
      <ui-trace-line icon="tool" label="Ran a refund check"></ui-trace-line>
      <ui-trace-line label="Done"></ui-trace-line>
    </ui-trace>
  `,
});

export const ExpandableSteps = meta.story({
  name: "Expandable steps",
  parameters: {
    docs: { description: { story: "A step with content becomes a disclosure; open shows it expanded." } },
    canvas: "column",
  },
  render: () => html`
    <ui-trace>
      <ui-trace-line icon="thinking" label="Thought for 6 seconds" open>
        <ui-markdown
          .text=${"The order shipped yesterday, so the address can't change. A pickup point is the closest alternative."}
        ></ui-markdown>
      </ui-trace-line>
      <ui-trace-line icon="search" label="Searched orders" description="3 results">
        <ui-markdown
          .text=${"- Order 10482, shipped\n- Order 10475, delivered\n- Order 10461, delivered"}
        ></ui-markdown>
      </ui-trace-line>
    </ui-trace>
  `,
});
