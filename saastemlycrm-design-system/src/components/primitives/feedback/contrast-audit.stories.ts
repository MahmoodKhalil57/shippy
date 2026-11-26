import preview from "#.storybook/preview";
import { html } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import { expect, spyOn, waitFor } from "storybook/test";
import { cssLuminance, rgba } from "../../../lib/base/legibility.ts";
import { afterNextPaint, whenIdle } from "../../../lib/base/work-queue.ts";
import "./contrast-audit.ts";
import "../actions/button.ts";
import "../actions/icon-button.ts";
import "../typography/text.ts";
import type { UiContrastAudit } from "./contrast-audit.ts";

const meta = preview.type<{ args: { text: string } }>().meta({
  title: "Primitives/Feedback/Contrast audit",
  component: "ui-contrast-audit",
  args: { text: "Muted body text, which the audit measures like any other." },
  argTypes: { text: { control: "text", description: "Sample text on the page for the audit to measure." } },
  render: (args) => html`
    <ui-button color="primary" @click=${() => window.dispatchEvent(new Event("ui-contrast-audit"))}
      >Toggle audit</ui-button
    >
    <ui-text variant="body-sm" color="muted">${args.text}</ui-text>
    <ui-contrast-audit></ui-contrast-audit>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Toggle audit opens the report panel; its Close button removes it again." } },
  },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.queryByRole("dialog", { name: "Contrast audit" })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Toggle audit" }));
    const panel = await canvas.findByRole("dialog", { name: "Contrast audit" });
    await expect(panel).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Re-run" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(canvas.queryByRole("dialog", { name: "Contrast audit" })).toBeNull());
  },
});

export const RunOnThisPage = meta.story({
  name: "Run on this page",
  parameters: {
    docs: {
      description: {
        story:
          "A developer tool: it renders nothing until a ui-contrast-audit event on window (or ?audit in the URL) toggles it, then outlines every text contrast, filled-button and layout issue on the page and lists them in a panel at the bottom-start corner.",
      },
    },
  },
  render: () => {
    const audit = createRef<UiContrastAudit>();
    return html`
      <ui-button color="primary" @click=${() => window.dispatchEvent(new Event("ui-contrast-audit"))}
        >Toggle audit</ui-button
      >
      <ui-button variant="outlined" @click=${() => audit.value?.run()}>Run again</ui-button>
      <ui-button variant="text" @click=${() => audit.value?.close()}>Close</ui-button>
      <ui-text variant="body-sm" color="muted">Muted body text, which the audit measures like any other.</ui-text>
      <ui-contrast-audit ${ref(audit)}></ui-contrast-audit>
    `;
  },
});

const faint = "text-on-surface/10";

interface Shell extends HTMLElement {
  backdropAt?: () => number[] | null;
}

const boxes = (audit: Element) => [...audit.querySelectorAll<HTMLElement>(":scope > div:not([role=dialog])")];
const boxLabels = (audit: Element) => boxes(audit).map((b) => b.textContent?.trim());

export const EveryKindOfIssue = meta.story({
  name: "Every kind of issue",
  parameters: {
    docs: {
      description: {
        story:
          "A page with faint text, a caption over an image, too many filled buttons on the page and on a dialog, a line that escapes, a cramped column and squeezed labels: the audit outlines each one on screen and lists them all.",
      },
    },
  },
  render: () => html`
    <ui-contrast-audit></ui-contrast-audit>
    <main style="overflow-x: auto">
      <p data-faint>Pipeline summary for the quarter</p>
      <ui-app-shell style="display: block"
        ><div data-frame style="display: block">
          <span data-caption>Caption over the cover photo</span>
        </div></ui-app-shell
      >
      <div style="display: flex; gap: 0.5rem">
        <ui-button color="primary">Save</ui-button>
        <ui-button color="primary">Send</ui-button>
        <ui-icon-button variant="filled" icon="plus" label="Add contact"></ui-icon-button>
      </div>
      <span style="display: inline-block; white-space: nowrap"
        >${"A single line that never wraps and runs past the edge of the page. ".repeat(6)}</span
      >
      <div style="display: grid; grid-template-columns: 4rem 0 1rem 1fr">
        <p>Notes about this customer wrap in a narrow column.</p>
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">Hidden status</span>
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">Squeezed status</span>
      </div>
      <dialog open aria-label="Filters">
        <ui-button color="primary">Apply</ui-button>
        <ui-button color="primary">Save view</ui-button>
        <ui-button color="primary">Share</ui-button>
      </dialog>
      <div style="padding-block-start: 150vh"><ui-button color="primary">Export</ui-button></div>
    </main>
  `,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const audit = canvasElement.querySelector("ui-contrast-audit")!;
    const text = canvasElement.querySelector<HTMLElement>("[data-faint]")!;
    const caption = canvasElement.querySelector<HTMLElement>("[data-caption]")!;
    const shell = canvasElement.querySelector<Shell>("ui-app-shell")!;
    shell.backdropAt = () => [cssLuminance(getComputedStyle(caption).color)];
    text.classList.add(faint);
    try {
      await expect(rgba(getComputedStyle(text).color)[3]).toBeLessThan(0.5);
      await expect(audit.measure().map((i) => i.element)).toContain(text);

      window.dispatchEvent(new Event("ui-contrast-audit"));
      const panel = await canvas.findByRole("dialog", { name: "Contrast audit" });
      await expect(panel).toHaveTextContent(/text elements? fails? WCAG AA · 1 over the background image/);
      await expect(panel).toHaveTextContent("4 filled buttons on the page");
      await expect(panel).toHaveTextContent("3 filled buttons on a dialog");
      await expect(panel).toHaveTextContent(/layout problems at \d+px/);
      for (const kind of ["escapes", "page-scroll", "cramped", "squeezed"])
        await expect(canvas.getAllByRole("button", { name: new RegExp(`^${kind}`) }).length).toBeGreaterThan(0);
      await expect(canvas.getByRole("button", { name: /^filled Add contact$/ })).toBeVisible();
      await expect(canvas.getByRole("button", { name: /^filled Save$/ })).toBeVisible();

      const labels = boxLabels(audit);
      await expect(labels).toContain("cramped");
      await expect(labels).toContain("filled");
      await expect(labels.filter((l) => l === "squeezed")).toHaveLength(1);
      await expect(labels.filter((l) => l === "filled")).toHaveLength(6);

      const scroll = spyOn(Element.prototype, "scrollIntoView").mockImplementation(() => undefined);
      const scrolledTo = async (target: Element) => {
        await expect(scroll).toHaveBeenLastCalledWith({ block: "center", behavior: "smooth" });
        await expect(scroll.mock.contexts.at(-1)).toBe(target);
      };
      try {
        await userEvent.click(canvas.getByRole("button", { name: /Caption over the cover photo/ }));
        await scrolledTo(caption);
        await waitFor(() => expect(boxes(audit).filter((b) => b.classList.contains("ring-4"))).toHaveLength(1));
        await userEvent.click(canvas.getByRole("button", { name: /^cramped/ }));
        await scrolledTo(canvasElement.querySelector("main > div > p")!);
        await userEvent.click(canvas.getByRole("button", { name: /^filled Export$/ }));
        await scrolledTo(canvasElement.querySelector("main > div:last-child .btn")!);
      } finally {
        scroll.mockRestore();
      }

      scrollTo(0, document.documentElement.scrollHeight);
      try {
        await waitFor(() => expect(boxLabels(audit)).not.toContain("cramped"));
        await expect(boxLabels(audit).filter((l) => l === "filled").length).toBeGreaterThan(0);
      } finally {
        scrollTo(0, 0);
      }
      await waitFor(() => expect(boxLabels(audit)).toContain("cramped"));

      shell.backdropAt = () => null;
      await userEvent.click(canvas.getByRole("button", { name: "Re-run" }));
      const report = () => canvas.getByRole("dialog", { name: "Contrast audit" });
      await waitFor(() => expect(report()).not.toHaveTextContent("over the background image"));
      await expect(report()).toHaveTextContent(/fails? WCAG AA/);

      text.classList.remove(faint);
      await userEvent.click(canvas.getByRole("button", { name: "Re-run" }));
      await waitFor(() => expect(report()).toHaveTextContent("Everything on screen passes WCAG AA"));
    } finally {
      text.classList.remove(faint);
      audit.close();
    }
    await waitFor(() => expect(canvas.queryByRole("dialog", { name: "Contrast audit" })).toBeNull());
  },
});

export const RunsFromTheUrl = meta.story({
  name: "Runs from the URL",
  parameters: {
    docs: {
      description: {
        story:
          "With ?audit in the URL an audit connected before the page loads waits for load, fonts and an idle moment, then opens; one removed before then never runs.",
      },
    },
  },
  render: () => html`<ui-text variant="body-md">Pipeline summary for the quarter</ui-text>`,
  play: async ({ canvasElement }) => {
    const original = location.href;
    const url = new URL(original);
    url.searchParams.set("audit", "");
    history.replaceState(history.state, "", url);
    const early = document.createElement("ui-contrast-audit");
    const removed = document.createElement("ui-contrast-audit");
    try {
      Object.defineProperty(document, "readyState", { configurable: true, get: () => "loading" });
      try {
        canvasElement.append(early);
      } finally {
        delete (document as { readyState?: unknown }).readyState;
      }
      await afterNextPaint();
      await expect(early.querySelector("[role=dialog]")).toBeNull();
      dispatchEvent(new Event("load"));
      await waitFor(() => expect(early.querySelector("[role=dialog]")).not.toBeNull());

      canvasElement.append(removed);
      removed.remove();
      await document.fonts.ready;
      await afterNextPaint();
      await new Promise<void>((done) => whenIdle(done, done));
      await afterNextPaint();
      await expect(removed.querySelector("[role=dialog]")).toBeNull();
    } finally {
      history.replaceState(history.state, "", original);
      early.remove();
    }
  },
});

export const ToggleEvent = meta.story({
  name: "Toggle event",
  play: async ({ canvas }) => {
    window.dispatchEvent(new Event("ui-contrast-audit"));
    await canvas.findByRole("dialog", { name: "Contrast audit" });
    window.dispatchEvent(new Event("ui-contrast-audit"));
    await waitFor(() => expect(canvas.queryByRole("dialog", { name: "Contrast audit" })).toBeNull());
  },
});
