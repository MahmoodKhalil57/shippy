import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, waitFor } from "storybook/test";
import "./tooltip.ts";
import "../actions/button.ts";
import "../actions/icon-button.ts";
import { BREAKPOINTS } from "../../../lib/base/variants.ts";

const meta = preview.type<{ args: { trigger: string } }>().meta({
  title: "Primitives/Feedback/Tooltip",
  component: "ui-tooltip",
  args: {
    trigger: "Send",
    tip: "Send Invoice INV-0042 by email",
    heading: "",
    variant: "plain",
    placement: "top",
    align: "center",
    from: undefined,
  },
  argTypes: {
    trigger: { control: "text", description: "The label of the button the tooltip describes." },
    tip: { control: "text" },
    heading: { control: "text", description: "Shown on a rich tooltip." },
    variant: { control: "inline-radio", options: ["plain", "rich"] },
    placement: { control: "inline-radio", options: ["top", "bottom", "left", "right"] },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    from: { control: "select", options: [undefined, ...BREAKPOINTS] },
  },
  render: (args) => html`
    <ui-tooltip
      tip=${ifDefined(args.tip as string | undefined)}
      heading=${ifDefined(args.heading as string | undefined)}
      variant=${ifDefined(args.variant)}
      placement=${ifDefined(args.placement)}
      align=${ifDefined(args.align)}
      from=${ifDefined(args.from)}
    >
      <ui-button variant="outlined">${args.trigger}</ui-button>
    </ui-tooltip>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the tooltip; keyboard focus opens it and Escape closes it." } },
  },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Send" });
    const tip = canvas.getByRole("tooltip", { hidden: true });
    await expect(tip).not.toBeVisible();
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await waitFor(() => expect(tip).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(tip).not.toBeVisible());
  },
});

export const DescribesNestedTrigger = meta.story({
  name: "Describes a nested trigger",
  parameters: {
    docs: {
      description: { story: "The button a nested ui-button renders gets the tip as its accessible description." },
    },
  },
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Send" })).toHaveAccessibleDescription(
        "Send Invoice INV-0042 by email",
      ),
    );
  },
});

export const HoverOpens = meta.story({
  name: "Hover opens",
  args: { placement: "bottom", align: "start" },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Send" });
    const tip = canvas.getByRole("tooltip", { hidden: true });
    await userEvent.hover(button);
    await waitFor(() => expect(tip).toBeVisible());
    await userEvent.unhover(button);
    await waitFor(() => expect(tip).not.toBeVisible());
  },
});

export const RichTip = meta.story({
  name: "Rich tip",
  args: {
    variant: "rich",
    trigger: "Net 30",
    heading: "Payment terms",
    tip: "Invoices are due 30 days after the issue date.",
  },
  play: async ({ canvas, userEvent }) => {
    const tip = canvas.getByRole("tooltip", { hidden: true });
    await userEvent.tab();
    await waitFor(() => expect(tip).toBeVisible());
    await expect(tip).toHaveTextContent("Payment terms");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(tip).not.toBeVisible());
  },
});

export const Plain = meta.story({
  name: "Plain",
  parameters: {
    docs: {
      description: {
        story:
          "Tooltips open on hover (after a short delay) or keyboard focus, close on Escape, and describe their trigger via aria-describedby.",
      },
    },
  },
  render: () => html`
    <ui-tooltip tip="Send Invoice INV-0042 by email">
      <ui-button variant="outlined">Send</ui-button>
    </ui-tooltip>
    <ui-tooltip tip="Archived contacts stay searchable">
      <ui-button variant="text">Archive</ui-button>
    </ui-tooltip>
  `,
});

export const Placement = meta.story({
  name: "Placement",
  render: () => html`
    <ui-tooltip tip="Above" placement="top"><ui-button variant="outlined">Top</ui-button></ui-tooltip>
    <ui-tooltip tip="Below" placement="bottom"><ui-button variant="outlined">Bottom</ui-button></ui-tooltip>
    <ui-tooltip tip="To the left" placement="left"><ui-button variant="outlined">Left</ui-button></ui-tooltip>
    <ui-tooltip tip="To the right" placement="right"><ui-button variant="outlined">Right</ui-button></ui-tooltip>
    <ui-tooltip tip="Aligned to the start" placement="bottom" align="start">
      <ui-button variant="outlined">Bottom start</ui-button>
    </ui-tooltip>
    <ui-tooltip tip="Aligned to the end" placement="bottom" align="end">
      <ui-button variant="outlined">Bottom end</ui-button>
    </ui-tooltip>
  `,
});

export const Rich = meta.story({
  name: "Rich",
  parameters: {
    docs: {
      description: {
        story: "A rich tooltip has a heading and an optional action, and stays open while the pointer moves into it.",
      },
    },
  },
  render: () => html`
    <ui-tooltip
      variant="rich"
      heading="Payment terms"
      tip="Invoices are due 30 days after the issue date. Late payments add a 2% monthly fee."
    >
      <ui-button variant="tonal">Net 30</ui-button>
      <ui-button slot="action" size="xs" variant="text">Change terms</ui-button>
    </ui-tooltip>
    <ui-tooltip variant="rich" heading="Lead score" tip="Based on visits, replies and deal size." placement="bottom">
      <ui-button variant="outlined">Score 82</ui-button>
    </ui-tooltip>
  `,
});

export const Breakpoint = meta.story({
  name: "Breakpoint",
  parameters: {
    docs: {
      description: {
        story:
          "With from set, the tooltip only opens at that breakpoint and wider; narrow this window below it to see it stay closed.",
      },
    },
  },
  render: () => html`
    <ui-tooltip tip="Only from the md breakpoint up" from="md">
      <ui-button variant="outlined">Wide screens only</ui-button>
    </ui-tooltip>
  `,
});

export const SharedTip = meta.story({
  name: "Shared tip",
  parameters: {
    docs: {
      description: {
        story: "Icon buttons and menu items use the shared data-tip tooltip, one floating element for the whole page.",
      },
    },
  },
  render: () => html`
    <ui-icon-button icon="edit" label="Edit"></ui-icon-button>
    <ui-icon-button icon="copy" label="Duplicate"></ui-icon-button>
    <ui-icon-button icon="trash" label="Delete" color="error"></ui-icon-button>
    <div style="padding-block-start: 6rem">
      <span data-tip="Export as a spreadsheet"><ui-button variant="outlined">Export</ui-button></span>
    </div>
  `,
  play: async ({ canvas, userEvent }) => {
    const tip = () => document.getElementById("ui-tip");
    const edit = canvas.getByRole("button", { name: "Edit" });
    const duplicate = canvas.getByRole("button", { name: "Duplicate" });
    const exporter = canvas.getByRole("button", { name: "Export" });

    edit.dispatchEvent(new PointerEvent("pointerover", { bubbles: true, pointerType: "touch" }));
    await expect(tip()?.matches(":popover-open") ?? false).toBe(false);

    await userEvent.hover(edit);
    const shared = tip()!;
    await expect(shared).toHaveAttribute("role", "tooltip");
    await expect(shared.popover).toBe("hint");
    await waitFor(() => expect(shared.matches(":popover-open")).toBe(true));
    await expect(shared).toHaveTextContent("Edit");
    await expect(shared.className).toContain("open:delay-");
    await waitFor(() =>
      expect(shared.getBoundingClientRect().top).toBeGreaterThanOrEqual(edit.getBoundingClientRect().bottom),
    );
    const inner = edit.firstElementChild ?? edit;
    inner.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    edit.dispatchEvent(new PointerEvent("pointerout", { bubbles: true, relatedTarget: inner }));
    await expect(shared.matches(":popover-open")).toBe(true);
    await expect(shared).toHaveTextContent("Edit");

    await userEvent.hover(duplicate);
    await expect(shared).toHaveTextContent("Duplicate");
    duplicate.dispatchEvent(new PointerEvent("pointerout", { bubbles: true }));
    await expect(shared.matches(":popover-open")).toBe(false);

    await userEvent.hover(exporter);
    await expect(shared).toHaveTextContent("Export as a spreadsheet");
    await waitFor(() =>
      expect(shared.getBoundingClientRect().bottom).toBeLessThanOrEqual(exporter.getBoundingClientRect().top + 1),
    );
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await expect(shared.matches(":popover-open")).toBe(false);
    await userEvent.unhover(exporter);
    exporter.focus({ focusVisible: false } as FocusOptions);
    await expect(exporter).toHaveFocus();
    await expect(shared.matches(":popover-open")).toBe(false);

    exporter.blur();
    await userEvent.tab();
    await expect(edit).toHaveFocus();
    await waitFor(() => expect(shared.matches(":popover-open")).toBe(true));
    await expect(shared.className).not.toContain("open:delay-");
    await expect(shared).toHaveTextContent("Edit");
    await userEvent.keyboard("{Escape}");
    await expect(shared.matches(":popover-open")).toBe(false);
    await userEvent.tab();
    await expect(duplicate).toHaveFocus();
    await waitFor(() => expect(shared).toHaveTextContent("Duplicate"));
    await expect(shared.matches(":popover-open")).toBe(true);
    (document.activeElement as HTMLElement).blur();
    await expect(shared.matches(":popover-open")).toBe(false);
  },
});

export const BreakpointGate = meta.story({
  name: "Breakpoint gate",
  args: { from: "md" },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Send" });
    const tip = canvas.getByRole("tooltip", { hidden: true });
    const real = window.matchMedia;
    const answer = (matches: boolean) => (query: string) =>
      Object.defineProperty(real.call(window, query), "matches", { value: matches });
    window.matchMedia = answer(false);
    try {
      await userEvent.hover(button);
      await expect(tip.matches(":popover-open")).toBe(false);
      await userEvent.unhover(button);
    } finally {
      window.matchMedia = real;
    }
    window.matchMedia = answer(true);
    try {
      await userEvent.hover(button);
      await waitFor(() => expect(tip).toBeVisible());
      await userEvent.unhover(button);
      await waitFor(() => expect(tip).not.toBeVisible());
    } finally {
      window.matchMedia = real;
    }
  },
});

export const RichStaysOpen = meta.story({
  name: "Rich stays open",
  parameters: {
    docs: {
      description: {
        story:
          "Moving from the trigger into a rich tip keeps it open; leaving the tip, or a touch, does not open or keep it.",
      },
    },
  },
  args: { variant: "rich", trigger: "Net 30", heading: "Payment terms", tip: "Due 30 days after the issue date." },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Net 30" });
    const tip = canvas.getByRole("tooltip", { hidden: true });
    const host = canvasElement.querySelector<HTMLElement>("[data-tip-host]")!;
    host.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "touch" }));
    await expect(tip.matches(":popover-open")).toBe(false);

    await userEvent.hover(button);
    await waitFor(() => expect(tip).toBeVisible());
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await expect(tip).toBeVisible();
    host.dispatchEvent(new PointerEvent("pointerleave", { relatedTarget: tip }));
    await expect(tip).toBeVisible();
    host.dispatchEvent(new FocusEvent("focusout", { relatedTarget: button }));
    await expect(tip).toBeVisible();
    tip.dispatchEvent(new PointerEvent("pointerleave", { relatedTarget: document.body }));
    await waitFor(() => expect(tip).not.toBeVisible());
  },
});
