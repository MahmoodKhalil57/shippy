import preview from "#.storybook/preview";
import { html } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import { expect, fn, waitFor } from "storybook/test";
import "./snackbar.ts";
import "../actions/button.ts";
import "../forms/text-input.ts";
import { afterNextPaint } from "../../../lib/base/work-queue.ts";
import type { SnackbarOptions, UiSnackbar } from "./snackbar.ts";

const bar = createRef<UiSnackbar>();

const push = (message: string, options?: SnackbarOptions) => () => bar.value?.push(message, options);

const meta = preview
  .type<{
    args: {
      message: string;
      tone: "neutral" | "success" | "error";
      timeout?: number;
      actionLabel: string;
      undo: boolean;
      onAction: () => void;
      onClose: (e: Event) => void;
    };
  }>()
  .meta({
    title: "Primitives/Feedback/Snackbar",
    component: "ui-snackbar",
    args: {
      message: "Contact archived",
      tone: "neutral",
      timeout: undefined,
      actionLabel: "Undo",
      undo: true,
      onAction: fn(),
      onClose: fn(),
    },
    argTypes: {
      message: { control: "text", description: "The message passed to push()." },
      tone: { control: "inline-radio", options: ["neutral", "success", "error"] },
      timeout: {
        control: { type: "number", min: 0, step: 500 },
        description: "Milliseconds before it leaves; 0 stays.",
      },
      actionLabel: { control: "text", description: "The action's label; empty for no action." },
      undo: { control: "boolean", description: "Whether the action also runs on Ctrl+Z or Cmd+Z." },
      onAction: { table: { category: "events" } },
      onClose: { table: { category: "events" } },
    },
    render: (args) => {
      const snackbar = createRef<UiSnackbar>();
      const show = () =>
        snackbar.value?.push(args.message, {
          tone: args.tone,
          timeout: args.timeout,
          action: args.actionLabel ? { label: args.actionLabel, undo: args.undo, onClick: args.onAction } : undefined,
        });
      return html`
        <ui-snackbar ${ref(snackbar)} @ui-close=${args.onClose}></ui-snackbar>
        <ui-button variant="outlined" @click=${show}>Show snackbar</ui-button>
      `;
    },
  });

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: {
        story: "Every control shapes the next push(); Show snackbar pushes it, and its action runs onAction.",
      },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Show snackbar" }));
    await expect(await canvas.findByText("Contact archived")).toBeInTheDocument();
    await userEvent.keyboard("{Alt>}g{/Alt}");
    const undo = canvas.getByRole("button", { name: "Undo" });
    await expect(undo).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onAction).toHaveBeenCalledOnce();
    await expect(args.onClose).toHaveBeenCalledOnce();
    await waitFor(() => expect(canvas.queryByText("Contact archived")).toBeNull());
  },
});

export const UndoShortcut = meta.story({
  name: "Undo shortcut",
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Show snackbar" }));
    await canvas.findByText("Contact archived");
    await userEvent.keyboard("{Control>}z{/Control}");
    await expect(args.onAction).toHaveBeenCalledOnce();
    await waitFor(() => expect(canvas.queryByText("Contact archived")).toBeNull());
  },
});

export const ErrorStays = meta.story({
  name: "Error stays",
  args: { message: "Couldn't send the invoice. Check the email address.", tone: "error", actionLabel: "" },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Show snackbar" }));
    const status = canvas.getByRole("status");
    await expect(status).toHaveAttribute("aria-live", "assertive");
    await expect(await canvas.findByText("Couldn't send the invoice. Check the email address.")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Dismiss" }));
    await expect(args.onClose).toHaveBeenCalledOnce();
    await waitFor(() => expect(canvas.queryByText("Couldn't send the invoice. Check the email address.")).toBeNull());
  },
});

export const EscapeDismisses = meta.story({
  name: "Escape dismisses",
  args: { message: "Sync paused", timeout: 0, actionLabel: "" },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Show snackbar" }));
    await canvas.findByText("Sync paused");
    canvas.getByRole("button", { name: "Dismiss" }).focus();
    await userEvent.keyboard("{Escape}");
    await expect(args.onClose).toHaveBeenCalledOnce();
    await waitFor(() => expect(canvas.queryByText("Sync paused")).toBeNull());
  },
});

export const Tones = meta.story({
  name: "Tones",
  parameters: {
    docs: {
      description: {
        story: "A snackbar opens from push(); each button shows one at the bottom of the viewport, replacing the last.",
      },
    },
  },
  render: () => html`
    <ui-snackbar ${ref(bar)}></ui-snackbar>
    <ui-button variant="outlined" @click=${push("Draft saved")}>Neutral</ui-button>
    <ui-button variant="outlined" @click=${push("Invoice INV-0042 sent to Ana Silva", { tone: "success" })}
      >Success</ui-button
    >
    <ui-button
      variant="outlined"
      @click=${push("Couldn't send the invoice. Check the email address.", { tone: "error" })}
      >Error</ui-button
    >
  `,
});

export const TimedDismissal = meta.story({
  name: "Timed dismissal",
  args: { message: "Reconnected", timeout: 600, actionLabel: "" },
  parameters: {
    docs: {
      description: {
        story: "The lifetime runs as a Web Animation timer: hovering the message stops it, leaving restarts it.",
      },
    },
  },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const bar = canvasElement.querySelector("ui-snackbar")!;
    await userEvent.click(canvas.getByRole("button", { name: "Show snackbar" }));
    const text = await canvas.findByText("Reconnected");
    await expect(bar.getAnimations()).toHaveLength(1);
    await userEvent.hover(text);
    await expect(bar.getAnimations()).toHaveLength(0);
    await userEvent.unhover(text);
    await expect(bar.getAnimations()).toHaveLength(1);
    await waitFor(() => expect(args.onClose).toHaveBeenCalledOnce(), { timeout: 3000 });
    await waitFor(() => expect(canvas.queryByText("Reconnected")).toBeNull(), { timeout: 3000 });
  },
});

export const Lifetime = meta.story({
  name: "Lifetime",
  parameters: {
    docs: {
      description: {
        story:
          "Plain messages leave after a reading time that grows with their length and pauses on hover or focus; errors and messages with an action stay until dismissed.",
      },
    },
  },
  render: () => html`
    <ui-button variant="outlined" @click=${push("Copied")}>Short message</ui-button>
    <ui-button
      variant="outlined"
      @click=${push(
        "Quarterly report exported. It includes revenue, pipeline and renewals for every team in the workspace.",
      )}
      >Long message</ui-button
    >
    <ui-button variant="outlined" @click=${push("Reconnected", { timeout: 1500 })}>Custom timeout</ui-button>
    <ui-button variant="outlined" @click=${push("Sync paused", { timeout: 0 })}>Stays until dismissed</ui-button>
  `,
});

export const Actions = meta.story({
  name: "Actions",
  parameters: {
    docs: {
      description: {
        story:
          "Alt+G moves focus to the action; an undo action also runs on Ctrl+Z or Cmd+Z when no field or dialog has focus.",
      },
    },
  },
  render: () => html`
    <ui-button
      variant="outlined"
      @click=${push("Contact archived", { action: { label: "Undo", undo: true, onClick: push("Contact restored") } })}
      >With undo</ui-button
    >
    <ui-button
      variant="outlined"
      @click=${push("New version available", { action: { label: "Reload", onClick: () => undefined } })}
      >With action</ui-button
    >
  `,
});

const duration = (el: Element) => el.getAnimations()[0]?.effect?.getTiming().duration;

export const ReadingTime = meta.story({
  name: "Reading time",
  parameters: {
    docs: {
      description: {
        story:
          "Without a timeout a message stays 4s plus 1s for every 20 characters past 40, at most 10s; each push replaces the last and closes it.",
      },
    },
  },
  render: (args) => html`<ui-snackbar @ui-close=${args.onClose}></ui-snackbar>`,
  play: async ({ canvas, canvasElement, args }) => {
    const bar = canvasElement.querySelector("ui-snackbar")!;
    const status = canvas.getByRole("status");
    const first = bar.push("Copied");
    await canvas.findByText("Copied");
    await expect(duration(bar)).toBe(4000);
    await expect(status.querySelector("svg")).toBeNull();
    await expect(status).toHaveAttribute("aria-live", "polite");

    const second = bar.push("Report exported. ".repeat(5), { tone: "success" });
    await expect(args.onClose).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { id: first } }));
    await canvas.findByText(/Report exported/);
    await expect(duration(bar)).toBe(7000);
    await expect(status.querySelector("svg")).not.toBeNull();
    await expect(canvas.queryByText("Copied")).toBeNull();

    bar.push("Report exported. ".repeat(20));
    await expect(args.onClose).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { id: second } }));
    await expect(duration(bar)).toBe(10_000);

    const linked = bar.push(html`Invoice sent. <a href="#invoice">View invoice</a>`);
    await expect(duration(bar)).toBe(4000);
    const link = await canvas.findByRole("link", { name: "View invoice" });
    link.focus();
    await expect(bar.getAnimations()).toHaveLength(0);
    link.blur();
    await expect(bar.getAnimations()).toHaveLength(1);

    await expect(args.onClose).toHaveBeenCalledTimes(3);
    bar.dismiss(linked + 1);
    await expect(args.onClose).toHaveBeenCalledTimes(3);
    await expect(link).toBeInTheDocument();
    bar.dismiss();
    await expect(args.onClose).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { id: linked } }));
    await expect(bar.getAnimations()).toHaveLength(0);
    bar.dismiss();
    await expect(args.onClose).toHaveBeenCalledTimes(4);
    await waitFor(() => expect(canvas.queryByRole("link")).toBeNull());
  },
});

export const UndoWhileBusy = meta.story({
  name: "Undo while typing or in a dialog",
  parameters: {
    docs: {
      description: {
        story: "Ctrl+Z belongs to the field being typed in or to an open dialog, so the undo action ignores it there.",
      },
    },
  },
  render: (args) => html`
    <ui-snackbar @ui-close=${args.onClose}></ui-snackbar>
    <ui-text-input label="Note"></ui-text-input>
    <dialog aria-label="Draft">Draft in progress</dialog>
  `,
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const bar = canvasElement.querySelector("ui-snackbar")!;
    const dialog = canvasElement.querySelector("dialog")!;
    bar.push("Contact archived", { action: { label: "Undo", undo: true, onClick: args.onAction } });
    await canvas.findByText("Contact archived");
    const note = canvas.getByLabelText("Note");
    await userEvent.click(note);
    await userEvent.keyboard("{Control>}z{/Control}");
    await expect(args.onAction).not.toHaveBeenCalled();
    note.blur();
    dialog.show();
    try {
      await userEvent.keyboard("{Control>}z{/Control}");
      await expect(args.onAction).not.toHaveBeenCalled();
      await expect(canvas.getByText("Contact archived")).toBeInTheDocument();
    } finally {
      dialog.close();
    }
    await userEvent.keyboard("{Control>}z{/Control}");
    await expect(args.onAction).toHaveBeenCalledOnce();
    await waitFor(() => expect(canvas.queryByText("Contact archived")).toBeNull());
  },
});

export const MovedAndDetached = meta.story({
  name: "Moved and detached",
  parameters: {
    docs: {
      description: {
        story:
          "Moving the snackbar keeps its message on screen and its timer running; a message pushed before it is attached starts its timer on attach.",
      },
    },
  },
  render: (args) => html`<ui-snackbar @ui-close=${args.onClose}></ui-snackbar>`,
  play: async ({ canvas, canvasElement, args }) => {
    const bar = canvasElement.querySelector("ui-snackbar")!;
    bar.push("Reconnected", { timeout: 400 });
    await canvas.findByText("Reconnected");
    const box = bar.querySelector<HTMLElement>("[data-snackbar]")!;
    await expect(box.matches(":popover-open")).toBe(true);
    canvasElement.append(bar);
    await expect(box.matches(":popover-open")).toBe(false);
    await bar.updateComplete;
    await expect(box.matches(":popover-open")).toBe(true);
    await expect(bar.getAnimations()).toHaveLength(1);
    await waitFor(() => expect(args.onClose).toHaveBeenCalledOnce(), { timeout: 3000 });

    const loose = document.createElement("ui-snackbar");
    loose.push("Draft saved", { timeout: 400 });
    await afterNextPaint();
    await expect(loose.getAnimations()).toHaveLength(0);
    canvasElement.append(loose);
    try {
      await expect(loose.getAnimations()).toHaveLength(1);
      await loose.updateComplete;
      await expect(loose.querySelector("[data-snackbar]")).toHaveTextContent("Draft saved");
      await expect(loose.querySelector("[data-snackbar]")!.matches(":popover-open")).toBe(true);
      await loose.getAnimations()[0]!.finished;
      await waitFor(() => expect(loose.querySelector("[data-snackbar]")).not.toHaveTextContent("Draft saved"));
    } finally {
      loose.remove();
    }
  },
});
