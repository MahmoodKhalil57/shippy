import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { createRef, ref } from "lit/directives/ref.js";
import { expect, fn, waitFor } from "storybook/test";
import { afterNextPaint } from "../../../lib/base/work-queue.ts";
import "./sheet.ts";
import "../actions/button.ts";
import "../actions/icon-button.ts";
import "../typography/text.ts";
import "../forms/text-input.ts";
import type { UiSheet } from "./sheet.ts";
import type { LocalizedString } from "../../../lib/i18n/paraglide/runtime.js";

const localized = (text: string) => text as LocalizedString;

const meta = preview
  .type<{
    args: {
      text: string;
      onOpen: (e: Event) => void;
      onClose: (e: Event) => void;
      onDismiss: (e: Event) => void;
    };
  }>()
  .meta({
    title: "Primitives/Containers/Sheet",
    component: "ui-sheet",
    args: {
      heading: "Ana Silva",
      subhead: "Account manager",
      label: "",
      text: "Looks after 14 customers and usually replies within a day.",
      size: "md",
      open: false,
      closeLabel: localized("Close"),
      onOpen: fn(),
      onClose: fn(),
      onDismiss: fn(),
    },
    argTypes: {
      heading: { control: "text" },
      subhead: { control: "text" },
      label: { control: "text" },
      text: { control: "text", description: "The sheet's content." },
      size: { control: "inline-radio", options: ["md", "lg"] },
      closeLabel: { control: "text" },
      onOpen: { table: { category: "events" } },
      onClose: { table: { category: "events" } },
      onDismiss: { table: { category: "events" } },
    },
    render: (args) => {
      const sheet = createRef<UiSheet>();
      return html`
        <ui-button variant="outlined" @click=${() => sheet.value?.show()}>Open sheet</ui-button>
        <ui-sheet
          ${ref(sheet)}
          heading=${ifDefined(args.heading as string | undefined)}
          subhead=${ifDefined(args.subhead as string | undefined)}
          label=${ifDefined(args.label)}
          size=${ifDefined(args.size)}
          ?open=${args.open}
          close-label=${ifDefined(args.closeLabel)}
          @ui-open=${args.onOpen}
          @ui-close=${args.onClose}
          @ui-dismiss=${args.onDismiss}
        >
          <ui-text variant="body-md">${args.text}</ui-text>
        </ui-sheet>
      `;
    },
  });

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: { story: "Every control drives the sheet; the button opens it and the close button dismisses it." },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open sheet" }));
    const dialog = await canvas.findByRole("dialog", { name: "Ana Silva" });
    await waitFor(() => expect(args.onOpen).toHaveBeenCalledOnce());
    await waitFor(() => expect(canvas.getByRole("heading", { name: "Ana Silva" })).toBeVisible());
    await expect(canvas.getByText("Account manager")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
    await expect(args.onDismiss).toHaveBeenCalledOnce();
    await waitFor(() => expect(args.onClose).toHaveBeenCalledOnce());
    await waitFor(() => expect(dialog).not.toBeVisible());
  },
});

export const LabelledUntitled = meta.story({
  name: "Labelled, untitled",
  args: { heading: "", subhead: "", label: "Filters", closeLabel: localized("Close filters"), size: "lg" },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open sheet" }));
    await canvas.findByRole("dialog", { name: "Filters" });
    await expect(canvas.queryByRole("heading")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Close filters" }));
    await waitFor(() => expect(args.onClose).toHaveBeenCalledOnce());
  },
});

export const Sizes = meta.story({
  name: "Sizes",
  parameters: {
    docs: {
      description: {
        story:
          "Each button opens a side sheet from the inline end; Escape, the close button or the backdrop dismisses it.",
      },
    },
  },
  render: () => {
    const medium = createRef<UiSheet>();
    const large = createRef<UiSheet>();
    return html`
      <ui-button variant="outlined" @click=${() => medium.value?.show()}>Medium</ui-button>
      <ui-sheet ${ref(medium)} heading="Ana Silva" subhead="Account manager">
        <ui-text variant="body-md">Looks after 14 customers and usually replies within a day.</ui-text>
      </ui-sheet>
      <ui-button variant="outlined" @click=${() => large.value?.show()}>Large</ui-button>
      <ui-sheet ${ref(large)} size="lg" heading="Quarterly report" subhead="1 July to 30 September">
        <ui-text variant="body-md">Revenue grew 12% against the previous quarter, led by renewals.</ui-text>
      </ui-sheet>
    `;
  },
});

export const TrailingAndActions = meta.story({
  name: "Trailing and actions",
  parameters: {
    docs: {
      description: {
        story:
          "Trailing content sits beside the close button; the actions footer stays pinned below the scrolling body.",
      },
    },
  },
  render: () => {
    const sheet = createRef<UiSheet>();
    return html`
      <ui-button variant="outlined" @click=${() => sheet.value?.show()}>Edit Invoice INV-0042</ui-button>
      <ui-sheet ${ref(sheet)} heading="Invoice INV-0042" subhead="Draft, not yet sent">
        <ui-icon-button slot="trailing" icon="print" label="Print" size="xs"></ui-icon-button>
        <ui-text-input label="Customer" value="Ana Silva"></ui-text-input>
        <ui-text-input label="Amount" value="1,240.00"></ui-text-input>
        <ui-text-input label="Due date" type="date" value="2026-12-04"></ui-text-input>
        <ui-button slot="actions" variant="text" @click=${() => sheet.value?.close()}>Cancel</ui-button>
        <ui-button slot="actions" color="primary" @click=${() => sheet.value?.close()}>Save invoice</ui-button>
      </ui-sheet>
    `;
  },
});

export const GuardedDismiss = meta.story({
  name: "Guarded dismiss",
  parameters: {
    docs: {
      description: {
        story: "Dismissing fires a cancelable ui-dismiss; this sheet cancels it and only closes from its own buttons.",
      },
    },
  },
  render: () => {
    const sheet = createRef<UiSheet>();
    return html`
      <ui-button variant="outlined" @click=${() => sheet.value?.show()}>Unsaved note</ui-button>
      <ui-sheet
        ${ref(sheet)}
        heading="New note"
        close-label="Close note"
        @ui-dismiss=${(e: Event) => e.preventDefault()}
      >
        <ui-text variant="body-md">Escape and the backdrop are ignored until the note is saved or discarded.</ui-text>
        <ui-button slot="actions" variant="text" @click=${() => sheet.value?.close()}>Discard</ui-button>
        <ui-button slot="actions" color="primary" @click=${() => sheet.value?.close()}>Save note</ui-button>
      </ui-sheet>
    `;
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Unsaved note" }));
    const dialog = await canvas.findByRole("dialog", { name: "New note" });
    await waitFor(() => expect(dialog).toBeVisible());
    const cancel = new Event("cancel", { cancelable: true });
    dialog.dispatchEvent(cancel);
    await expect(cancel.defaultPrevented).toBe(true);
    await userEvent.click(canvas.getByRole("button", { name: "Close note" }));
    await afterNextPaint();
    await expect(dialog).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Discard" }));
    await waitFor(() => expect(dialog).not.toBeVisible());
  },
});

export const Untitled = meta.story({
  name: "Untitled",
  parameters: {
    docs: { description: { story: "Without a heading the sheet needs a label for its accessible name." } },
  },
  render: () => {
    const sheet = createRef<UiSheet>();
    return html`
      <ui-button variant="outlined" @click=${() => sheet.value?.show()}>Filters</ui-button>
      <ui-sheet ${ref(sheet)} label="Filters">
        <ui-text-input label="Customer name"></ui-text-input>
      </ui-sheet>
    `;
  },
});

export const OpenOnLoad = meta.story({
  name: "Open on load",
  parameters: {
    docs: {
      description: {
        story:
          "A sheet only renders as a full-page overlay, so this one opens with the page; press Escape to close it and see the stories above.",
      },
    },
  },
  render: () => html`
    <ui-sheet open heading="Ana Silva" subhead="Account manager">
      <ui-text variant="body-md">Looks after 14 customers and usually replies within a day.</ui-text>
    </ui-sheet>
  `,
});

export const EscapeAndBackdrop = meta.story({
  name: "Escape and backdrop",
  parameters: {
    docs: {
      description: {
        story:
          "Escape and a press that starts and ends on the backdrop dismiss the sheet; cancel or close events bubbling from its content and presses that start inside it are ignored.",
      },
    },
  },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open sheet" }));
    const dialog = await canvas.findByRole("dialog", { name: "Ana Silva" });
    await waitFor(() => expect(dialog).toBeVisible());
    const text = canvas.getByText("Looks after 14 customers and usually replies within a day.");

    const inner = new Event("cancel", { bubbles: true, cancelable: true });
    text.dispatchEvent(inner);
    text.dispatchEvent(new Event("close", { bubbles: true }));
    await expect(inner.defaultPrevented).toBe(false);
    await expect(args.onDismiss).not.toHaveBeenCalled();
    await expect(args.onClose).not.toHaveBeenCalled();

    text.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    dialog.click();
    dialog.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    text.click();
    await expect(args.onDismiss).not.toHaveBeenCalled();
    dialog.click();
    await expect(args.onDismiss).toHaveBeenCalledOnce();
    await waitFor(() => expect(args.onClose).toHaveBeenCalledOnce());
    await waitFor(() => expect(dialog).not.toBeVisible());

    const sheet = canvasElement.querySelector("ui-sheet")!;
    sheet.show();
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(canvasElement.querySelector<HTMLElement>(".modal-backdrop")!);
    await expect(args.onDismiss).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(args.onClose).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(dialog).not.toBeVisible());

    sheet.show();
    await waitFor(() => expect(dialog).toBeVisible());
    const escape = new Event("cancel", { cancelable: true });
    dialog.dispatchEvent(escape);
    await expect(escape.defaultPrevented).toBe(true);
    await expect(args.onDismiss).toHaveBeenCalledTimes(3);
    await waitFor(() => expect(args.onClose).toHaveBeenCalledTimes(3));
  },
});

export const InterruptedTransitions = meta.story({
  name: "Interrupted transitions",
  parameters: {
    docs: {
      description: {
        story:
          "Opening and closing again before the next paint settles on the last request, and the sheet re-labels itself while open.",
      },
    },
  },
  play: async ({ canvas, canvasElement, args }) => {
    const sheet = canvasElement.querySelector("ui-sheet")!;
    const dialog = canvasElement.querySelector("dialog")!;
    sheet.show();
    await sheet.updateComplete;
    sheet.close();
    await sheet.updateComplete;
    await afterNextPaint();
    await afterNextPaint();
    await expect(dialog.open).toBe(false);
    await expect(args.onOpen).not.toHaveBeenCalled();

    sheet.show();
    await waitFor(() => expect(args.onOpen).toHaveBeenCalledOnce());
    sheet.heading = "Ana Silva, lead";
    await sheet.updateComplete;
    await expect(canvas.getByRole("dialog", { name: "Ana Silva, lead" })).toBe(dialog);

    sheet.close();
    await sheet.updateComplete;
    await expect(dialog).toHaveAttribute("data-closing");
    sheet.show();
    await sheet.updateComplete;
    await afterNextPaint();
    await afterNextPaint();
    await expect(dialog).not.toHaveAttribute("data-closing");
    await expect(dialog.open).toBe(true);
    await expect(args.onClose).not.toHaveBeenCalled();

    sheet.close();
    await sheet.updateComplete;
    sheet.show();
    await sheet.updateComplete;
    sheet.close();
    await sheet.updateComplete;
    await waitFor(() => expect(args.onClose).toHaveBeenCalledOnce());
    await expect(dialog.open).toBe(false);
    await expect(dialog).not.toHaveAttribute("data-closing");
    await expect(args.onDismiss).not.toHaveBeenCalled();
  },
});

export const Naming = meta.story({
  name: "Naming",
  parameters: {
    docs: {
      description: {
        story:
          "A heading, even a rich one, names the sheet; without one the label does, and a subhead alone adds no empty heading.",
      },
    },
  },
  render: () => html`
    <ui-sheet .heading=${html`Ana <em>Silva</em>`}>
      <ui-text variant="body-md">Account manager.</ui-text>
    </ui-sheet>
    <ui-sheet subhead="12 results" label="Search results">
      <ui-text variant="body-md">Contacts matching the search.</ui-text>
    </ui-sheet>
    <ui-sheet>
      <ui-text variant="body-md">Nothing to name this one.</ui-text>
    </ui-sheet>
  `,
  play: async ({ canvasElement }) => {
    const [rich, subheaded, bare] = canvasElement.querySelectorAll("dialog");
    const heading = rich!.querySelector("h2")!;
    await expect(rich).toHaveAttribute("aria-labelledby", heading.id);
    await expect(heading).toHaveTextContent("Ana Silva");
    await expect(rich).not.toHaveAttribute("aria-label");
    await expect(subheaded).toHaveAttribute("aria-label", "Search results");
    await expect(subheaded!.querySelector("h2")).toBeNull();
    await expect(subheaded).toHaveTextContent("12 results");
    await expect(bare).not.toHaveAttribute("aria-label");
    await expect(bare).not.toHaveAttribute("aria-labelledby");
  },
});

export const RemovedWhileOpening = meta.story({
  name: "Removed while opening",
  parameters: {
    docs: {
      description: {
        story: "Taken off the page before it finishes opening, it stays closed and announces nothing.",
      },
    },
  },
  render: () => html`<div></div>`,
  play: async ({ canvasElement }) => {
    const opened = fn();
    const el = document.createElement("ui-sheet");
    el.heading = "Short-lived";
    el.addEventListener("ui-open", opened);
    canvasElement.append(el);
    await el.updateComplete;
    el.open = true;
    await el.updateComplete;
    el.remove();
    await afterNextPaint();
    await afterNextPaint();
    await expect(el.querySelector("dialog")?.open ?? el.renderRoot.querySelector("dialog")?.open).toBe(false);
    await expect(opened).not.toHaveBeenCalled();
  },
});
