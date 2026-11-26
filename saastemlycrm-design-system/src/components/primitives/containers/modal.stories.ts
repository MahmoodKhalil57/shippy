import preview from "#.storybook/preview";
import { html, type TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";
import { expect, fn, waitFor } from "storybook/test";
import { afterNextPaint } from "../../../lib/base/work-queue.ts";
import "./modal.ts";
import "../actions/button.ts";
import "../typography/text.ts";
import "../forms/text-input.ts";
import type { UiModal } from "./modal.ts";
import type { LocalizedString } from "../../../lib/i18n/paraglide/runtime.js";

const localized = (text: string) => text as LocalizedString;

const close = (e: Event) => (e.currentTarget as UiModal).close("confirm");

const trigger = (label: string, modal: Ref<UiModal>, body: TemplateResult) => html`
  <ui-button variant="outlined" @click=${() => modal.value?.show()}>${label}</ui-button>
  ${body}
`;

const meta = preview
  .type<{
    args: {
      text: string;
      onOpen: (e: Event) => void;
      onClose: (e: Event) => void;
      onConfirm: (e: Event) => void;
    };
  }>()
  .meta({
    title: "Primitives/Containers/Modal",
    component: "ui-modal",
    args: {
      heading: "Send invoice?",
      text: "Ana Silva will get Invoice INV-0042 by email.",
      placement: "middle",
      width: "default",
      open: false,
      backdropClose: true,
      closeButton: true,
      sections: false,
      confirmLabel: "Send",
      confirmTone: "primary",
      confirmDisabled: false,
      cancelLabel: localized("Cancel"),
      onOpen: fn(),
      onClose: fn(),
      onConfirm: fn(),
    },
    argTypes: {
      heading: { control: "text" },
      text: { control: "text", description: "The modal's content." },
      placement: { control: "inline-radio", options: ["middle", "spotlight"] },
      width: { control: "inline-radio", options: ["default", "wide", "palette"] },
      backdropClose: { control: "boolean" },
      confirmLabel: { control: "text" },
      confirmTone: { control: "inline-radio", options: ["primary", "error"] },
      cancelLabel: { control: "text" },
      onOpen: { table: { category: "events" } },
      onClose: { table: { category: "events" } },
      onConfirm: { table: { category: "events" } },
    },
    render: (args) => {
      const modal = createRef<UiModal>();
      return html`
        <ui-button variant="outlined" @click=${() => modal.value?.show()}>Open dialog</ui-button>
        <ui-modal
          ${ref(modal)}
          heading=${ifDefined(args.heading as string | undefined)}
          placement=${ifDefined(args.placement)}
          width=${ifDefined(args.width)}
          ?open=${args.open}
          backdrop-close=${args.backdropClose === false ? "false" : "true"}
          ?close-button=${args.closeButton}
          ?sections=${args.sections}
          confirm-label=${ifDefined(args.confirmLabel)}
          confirm-tone=${ifDefined(args.confirmTone)}
          ?confirm-disabled=${args.confirmDisabled}
          cancel-label=${ifDefined(args.cancelLabel)}
          @ui-open=${args.onOpen}
          @ui-close=${args.onClose}
          @ui-confirm=${args.onConfirm}
        >
          <ui-text variant="body-md">${args.text}</ui-text>
        </ui-modal>
      `;
    },
  });

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: {
        story:
          "Every control drives the modal; the button opens it, confirm calls onConfirm and closes it unless the ui-confirm event is cancelled.",
      },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));
    const dialog = await canvas.findByRole("dialog", { name: "Send invoice?" });
    await waitFor(() => expect(args.onOpen).toHaveBeenCalledOnce());
    await expect(dialog).toBeVisible();
    await waitFor(() => expect(canvas.getByRole("heading", { name: "Send invoice?" })).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: "Send" }));
    await expect(args.onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(args.onClose).toHaveBeenCalledOnce());
    await expect((dialog as HTMLDialogElement).returnValue).toBe("confirm");
    await waitFor(() => expect(dialog).not.toBeVisible());
  },
});

export const CancelledConfirmStaysOpen = meta.story({
  name: "Cancelled confirm stays open",
  parameters: {
    docs: {
      description: {
        story: "A ui-confirm listener that calls preventDefault keeps the modal open, e.g. to validate or await work.",
      },
    },
  },
  args: { onConfirm: fn((e: Event) => e.preventDefault()) },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));
    const dialog = await canvas.findByRole("dialog", { name: "Send invoice?" });
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: "Send" }));
    await expect(args.onConfirm).toHaveBeenCalledOnce();
    await expect(dialog).toBeVisible();
    await expect(args.onClose).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(dialog).not.toBeVisible());
  },
});

export const ActionButtonsClose = meta.story({
  name: "Action buttons close",
  parameters: {
    docs: {
      description: {
        story: "Plain buttons in the actions slot close the modal too, with their value as the return value.",
      },
    },
  },
  args: { confirmLabel: "" },
  render: (args) => {
    const modal = createRef<UiModal>();
    return trigger(
      "Rename report",
      modal,
      html`<ui-modal ${ref(modal)} heading="Rename report" @ui-close=${args.onClose}>
        <ui-text variant="body-md">Pick how to keep the report.</ui-text>
        <ui-button slot="actions" variant="text" value="cancel">Cancel</ui-button>
        <ui-button slot="actions" color="primary" value="save">Save</ui-button>
      </ui-modal>`,
    );
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Rename report" }));
    const dialog = await canvas.findByRole("dialog", { name: "Rename report" });
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(args.onClose).toHaveBeenCalledOnce());
    await expect((dialog as HTMLDialogElement).returnValue).toBe("save");
    await waitFor(() => expect(dialog).not.toBeVisible());
  },
});

export const CloseButton = meta.story({
  name: "Close button",
  args: { confirmLabel: "", heading: "Invoice INV-0042" },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));
    const dialog = await canvas.findByRole("dialog", { name: "Invoice INV-0042" });
    await expect(dialog).toBeVisible();
    const closeButtons = canvas.getAllByRole("button", { name: "Close" });
    await userEvent.click(closeButtons[0]!);
    await waitFor(() => expect(args.onClose).toHaveBeenCalledOnce());
    await waitFor(() => expect(dialog).not.toBeVisible());
  },
});

export const ConfirmDisabled = meta.story({
  name: "Confirm disabled",
  args: { heading: "Archive workspace?", confirmLabel: "Archive", confirmDisabled: true, confirmTone: "error" },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));
    await canvas.findByRole("dialog", { name: "Archive workspace?" });
    await expect(canvas.getByRole("button", { name: "Archive" })).toBeDisabled();
    await expect(args.onConfirm).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(args.onClose).toHaveBeenCalledOnce());
  },
});

export const Basic = meta.story({
  name: "Basic",
  parameters: {
    docs: {
      description: {
        story: "Each button opens a modal dialog; Escape, the close button or a click on the backdrop closes it.",
      },
    },
  },
  render: () => {
    const plain = createRef<UiModal>();
    const closable = createRef<UiModal>();
    return html`
      ${trigger(
        "Heading and text",
        plain,
        html`<ui-modal ${ref(plain)} heading="Quarterly report">
          <ui-text variant="body-md">Revenue grew 12% against the previous quarter, led by renewals.</ui-text>
        </ui-modal>`,
      )}
      ${trigger(
        "With close button",
        closable,
        html`<ui-modal ${ref(closable)} heading="Invoice INV-0042" close-button>
          <ui-text variant="body-md">Issued to Ana Silva for 1,240.00, due on Friday.</ui-text>
        </ui-modal>`,
      )}
    `;
  },
});

export const Confirmation = meta.story({
  name: "Confirmation",
  parameters: {
    docs: {
      description: {
        story:
          "confirm-label adds a cancel and a confirm button; confirm fires ui-confirm and the page decides when to close.",
      },
    },
  },
  render: () => {
    const send = createRef<UiModal>();
    const remove = createRef<UiModal>();
    const blocked = createRef<UiModal>();
    return html`
      ${trigger(
        "Send invoice",
        send,
        html`<ui-modal ${ref(send)} heading="Send invoice?" confirm-label="Send" @ui-confirm=${close}>
          <ui-text variant="body-md">Ana Silva will get Invoice INV-0042 by email.</ui-text>
        </ui-modal>`,
      )}
      ${trigger(
        "Delete contact",
        remove,
        html`<ui-modal
          ${ref(remove)}
          heading="Delete contact?"
          confirm-label="Delete"
          confirm-tone="error"
          cancel-label="Keep contact"
          @ui-confirm=${close}
        >
          <ui-text variant="body-md">This removes Ana Silva and her notes. It cannot be undone.</ui-text>
        </ui-modal>`,
      )}
      ${trigger(
        "Confirm disabled",
        blocked,
        html`<ui-modal ${ref(blocked)} heading="Archive workspace?" confirm-label="Archive" confirm-disabled>
          <ui-text variant="body-md">Archive is unavailable while invoices are still open.</ui-text>
        </ui-modal>`,
      )}
    `;
  },
});

export const CustomActions = meta.story({
  name: "Custom actions",
  parameters: {
    docs: {
      description: {
        story:
          "The actions slot sits in a dialog form, so each submit button closes the modal with its value as the return value.",
      },
    },
  },
  render: () => {
    const modal = createRef<UiModal>();
    return trigger(
      "Rename report",
      modal,
      html`<ui-modal ${ref(modal)} heading="Rename report">
        <ui-text-input label="Name" value="Quarterly report"></ui-text-input>
        <ui-button slot="actions" type="submit" variant="text" value="cancel">Cancel</ui-button>
        <ui-button slot="actions" type="submit" variant="tonal" value="draft">Save as draft</ui-button>
        <ui-button slot="actions" type="submit" color="primary" value="save">Save</ui-button>
      </ui-modal>`,
    );
  },
});

export const Sections = meta.story({
  name: "Sections",
  parameters: {
    docs: { description: { story: "sections gives the modal a fixed header and footer around a scrolling body." } },
  },
  render: () => {
    const modal = createRef<UiModal>();
    return trigger(
      "Terms of service",
      modal,
      html`<ui-modal ${ref(modal)} sections close-button>
        <ui-text slot="header" variant="title-lg">Terms of service</ui-text>
        ${Array.from(
          { length: 12 },
          (_, i) =>
            html`<ui-text variant="body-md"
              >Section ${i + 1}. Invoices are payable within 30 days. Late payments add a monthly fee, and accounts more
              than 60 days overdue may be paused.</ui-text
            >`,
        )}
        <ui-button slot="footer" color="primary" @click=${() => modal.value?.close()}>Accept</ui-button>
      </ui-modal>`,
    );
  },
});

export const WidthAndPlacement = meta.story({
  name: "Width and placement",
  parameters: { docs: { description: { story: "spotlight places the box near the top, as a command palette does." } } },
  render: () => {
    const wide = createRef<UiModal>();
    const palette = createRef<UiModal>();
    return html`
      ${trigger(
        "Wide",
        wide,
        html`<ui-modal ${ref(wide)} width="wide" heading="Import contacts" close-button>
          <ui-text variant="body-md">Map each column of your file to a contact field before importing.</ui-text>
        </ui-modal>`,
      )}
      ${trigger(
        "Spotlight palette",
        palette,
        html`<ui-modal ${ref(palette)} width="palette" placement="spotlight">
          <ui-text-input label="Search" placeholder="Search invoices, contacts and reports"></ui-text-input>
        </ui-modal>`,
      )}
    `;
  },
});

export const NoBackdropClose = meta.story({
  name: "No backdrop close",
  parameters: {
    docs: { description: { story: "With backdrop-close set to false only Escape or a button closes it." } },
  },
  render: () => {
    const modal = createRef<UiModal>();
    return trigger(
      "Unsaved changes",
      modal,
      html`<ui-modal
        ${ref(modal)}
        heading="Leave without saving?"
        backdrop-close="false"
        confirm-label="Leave"
        confirm-tone="error"
        @ui-confirm=${close}
      >
        <ui-text variant="body-md">Your edits to Invoice INV-0042 will be lost.</ui-text>
      </ui-modal>`,
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Unsaved changes" }));
    const dialog = await canvas.findByRole("dialog", { name: "Leave without saving?" });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(canvas.queryByRole("button", { name: "Close" })).toBeNull();
    dialog.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    dialog.click();
    await afterNextPaint();
    await expect(dialog).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Leave" }));
    await waitFor(() => expect(dialog).not.toBeVisible());
  },
});

export const OpenOnLoad = meta.story({
  name: "Open on load",
  parameters: {
    docs: {
      description: {
        story:
          "A modal only renders as a full-page overlay, so this one opens with the page; press Escape to close it and see the stories above.",
      },
    },
  },
  render: () => html`
    <ui-modal open heading="Welcome back, Ana" close-button confirm-label="Continue" @ui-confirm=${close}>
      <ui-text variant="body-md">You have 3 invoices due this week.</ui-text>
    </ui-modal>
  `,
});

export const BackdropPress = meta.story({
  name: "Backdrop press",
  parameters: {
    docs: {
      description: {
        story:
          "A press that starts and ends on the backdrop closes the modal; one that starts inside the box does not.",
      },
    },
  },
  args: { confirmLabel: "", closeButton: false },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));
    const dialog = await canvas.findByRole("dialog", { name: "Send invoice?" });
    await waitFor(() => expect(dialog).toBeVisible());
    const text = canvas.getByText("Ana Silva will get Invoice INV-0042 by email.");
    text.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    dialog.click();
    text.click();
    await afterNextPaint();
    await expect(dialog).toBeVisible();
    await expect(args.onClose).not.toHaveBeenCalled();
    dialog.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    dialog.click();
    await waitFor(() => expect(args.onClose).toHaveBeenCalledOnce());
    await waitFor(() => expect(dialog).not.toBeVisible());
  },
});

export const InterruptedTransitions = meta.story({
  name: "Interrupted transitions",
  parameters: {
    docs: {
      description: {
        story:
          "Opening and closing again before the next paint settles on the last request, and the modal re-labels itself while open.",
      },
    },
  },
  args: { closeButton: false },
  play: async ({ canvas, canvasElement, args }) => {
    const modal = canvasElement.querySelector("ui-modal")!;
    const dialog = canvasElement.querySelector("dialog")!;
    modal.show();
    await modal.updateComplete;
    modal.close();
    await modal.updateComplete;
    await afterNextPaint();
    await afterNextPaint();
    await expect(dialog.open).toBe(false);
    await expect(args.onOpen).not.toHaveBeenCalled();

    modal.show();
    await waitFor(() => expect(args.onOpen).toHaveBeenCalledOnce());
    await expect(dialog.open).toBe(true);
    modal.heading = "Send invoice now?";
    await modal.updateComplete;
    await expect(canvas.getByRole("dialog", { name: "Send invoice now?" })).toBe(dialog);

    modal.close();
    await modal.updateComplete;
    await expect(dialog).toHaveAttribute("data-closing");
    modal.show();
    await modal.updateComplete;
    await afterNextPaint();
    await afterNextPaint();
    await expect(dialog).not.toHaveAttribute("data-closing");
    await expect(dialog.open).toBe(true);
    await expect(args.onClose).not.toHaveBeenCalled();

    modal.close();
    await modal.updateComplete;
    modal.show();
    await modal.updateComplete;
    modal.close("later");
    await modal.updateComplete;
    await waitFor(() => expect(args.onClose).toHaveBeenCalledOnce());
    await expect(args.onClose).toHaveBeenCalledWith(expect.objectContaining({ detail: { returnValue: "later" } }));
    await expect(dialog.open).toBe(false);
    await expect(dialog).not.toHaveAttribute("data-closing");
  },
});

export const ActionEdgeCases = meta.story({
  name: "Action edge cases",
  parameters: {
    docs: {
      description: {
        story:
          "A cancelled click, a click between buttons, a disabled button or a reset button leave the modal open; a native submit button closes it with its value.",
      },
    },
  },
  render: (args) => {
    const modal = createRef<UiModal>();
    return trigger(
      "Edit note",
      modal,
      html`<ui-modal ${ref(modal)} @ui-close=${args.onClose}>
        <span slot="heading">Edit <em>note</em></span>
        <ui-text variant="body-md">Notes are visible to your team.</ui-text>
        <ui-button slot="actions" variant="text" value="keep" @click=${(e: Event) => e.preventDefault()}
          >Keep editing</ui-button
        >
        <ui-button slot="actions" variant="text" value="later" disabled>Later</ui-button>
        <ui-button slot="actions" type="reset" variant="text">Reset</ui-button>
        <ui-button slot="actions" type="submit" color="primary" value="save">Save</ui-button>
      </ui-modal>`,
    );
  },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Edit note" }));
    const dialog = await canvas.findByRole("dialog");
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(dialog).not.toHaveAttribute("aria-label");
    await expect(canvas.getByRole("heading", { name: "Edit note" })).toContainElement(canvas.getByText("note"));
    await userEvent.click(canvas.getByRole("button", { name: "Keep editing" }));
    canvasElement.querySelector<HTMLElement>(".modal-action form")!.click();
    canvas.getByText("Later").dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await userEvent.click(canvas.getByRole("button", { name: "Reset" }));
    await afterNextPaint();
    await expect(dialog).toBeVisible();
    await expect(args.onClose).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(args.onClose).toHaveBeenCalledOnce());
    await expect((dialog as HTMLDialogElement).returnValue).toBe("save");
  },
});

export const SectionsBodyOnly = meta.story({
  name: "Sections, body only",
  args: { sections: true, confirmLabel: "", closeButton: false },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));
    const dialog = await canvas.findByRole("dialog", { name: "Send invoice?" });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(canvasElement.querySelector(".modal-box")!.children).toHaveLength(2);
    await waitFor(() => expect(canvas.getByText("Ana Silva will get Invoice INV-0042 by email.")).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(dialog).not.toBeVisible());
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
    const el = document.createElement("ui-modal");
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
