import preview from "#.storybook/preview";
import { html, nothing, render } from "lit";
import { expect, waitFor } from "storybook/test";
import { overflows, scrollFocus, type ScrollFocusOptions } from "./scroll-focus.ts";

const notes = (count: number) =>
  Array.from(
    { length: count },
    (_, i) => html`<p>Note ${i + 1}: the order was packed, labelled and handed to the carrier for delivery.</p>`,
  );

const panel = (options: ScrollFocusOptions | undefined, count: number, role?: string) =>
  html`<div
    style="width:16rem;max-height:8rem;overflow-y:auto;padding:0.5rem;border:1px solid"
    role=${role ?? nothing}
    ${options ? scrollFocus(options) : scrollFocus()}
  >
    ${notes(count)}
  </div>`;

const scroller = (root: HTMLElement) => root.querySelector<HTMLElement>("div[style]")!;

const meta = preview.meta({
  render: () => panel({ label: "Delivery notes" }, 8),
});

export const Overflowing = meta.story({
  name: "Overflowing: focusable named region",
  play: async ({ canvas, userEvent }) => {
    const region = await canvas.findByRole("region", { name: "Delivery notes" });
    await expect(region).toHaveAttribute("tabindex", "0");
    await userEvent.tab();
    await expect(region).toHaveFocus();
  },
});

export const Fits = meta.story({
  name: "Fits: not focusable",
  render: () => panel({ label: "Delivery notes" }, 1),
  play: async ({ canvas, canvasElement }) => {
    const el = scroller(canvasElement);
    await expect(overflows(el)).toBe(false);
    await expect(el).not.toHaveAttribute("tabindex");
    await expect(el).not.toHaveAttribute("aria-label");
    await expect(el).not.toHaveAttribute("role");
    await expect(canvas.queryByRole("region")).toBeNull();
  },
});

export const WithoutLabel = meta.story({
  name: "Without a label: focusable only",
  render: () => panel(undefined, 8),
  play: async ({ canvasElement }) => {
    const el = scroller(canvasElement);
    await waitFor(() => expect(el).toHaveAttribute("tabindex", "0"));
    await expect(el).not.toHaveAttribute("role");
    await expect(el).not.toHaveAttribute("aria-label");
  },
});

export const EmptyLabel = meta.story({
  name: "Empty label: focusable, no region",
  render: () => panel({ label: "" }, 8),
  play: async ({ canvasElement }) => {
    const el = scroller(canvasElement);
    await waitFor(() => expect(el).toHaveAttribute("tabindex", "0"));
    await expect(el).not.toHaveAttribute("role");
    await expect(el).not.toHaveAttribute("aria-label");
  },
});

export const FollowsContent = meta.story({
  name: "Follows content that grows and shrinks",
  render: () => panel({ label: "Delivery notes" }, 1),
  play: async ({ canvas, canvasElement }) => {
    const el = scroller(canvasElement);
    await expect(el).not.toHaveAttribute("tabindex");
    el.append(...Array.from({ length: 7 }, () => el.querySelector("p")!.cloneNode(true)));
    const region = await canvas.findByRole("region", { name: "Delivery notes" });
    await expect(region).toBe(el);
    await expect(el).toHaveAttribute("tabindex", "0");
    [...el.querySelectorAll("p")].slice(1).forEach((p) => p.remove());
    await waitFor(() => expect(el).not.toHaveAttribute("tabindex"));
    await expect(el).not.toHaveAttribute("role");
    await expect(el).not.toHaveAttribute("aria-label");
  },
});

export const FollowsTextAndSize = meta.story({
  name: "Follows text edits and resizes",
  render: () => panel({ label: "Delivery notes" }, 1),
  play: async ({ canvasElement }) => {
    const el = scroller(canvasElement);
    const text = el.querySelector("p")!.firstChild as Text;
    text.data = "A much longer delivery note. ".repeat(20);
    await waitFor(() => expect(el).toHaveAttribute("tabindex", "0"));
    el.style.maxHeight = "none";
    await waitFor(() => expect(el).not.toHaveAttribute("tabindex"));
    el.querySelector("p")!.style.height = "20rem";
    el.style.maxHeight = "8rem";
    await waitFor(() => expect(el).toHaveAttribute("tabindex", "0"));
  },
});

export const KeepsGivenRole = meta.story({
  name: "Keeps a role it was given",
  render: () => panel({ label: "Delivery notes" }, 8, "group"),
  play: async ({ canvas, canvasElement }) => {
    const group = await canvas.findByRole("group", { name: "Delivery notes" });
    await expect(group).toHaveAttribute("tabindex", "0");
    [...group.querySelectorAll("p")].slice(1).forEach((p) => p.remove());
    await waitFor(() => expect(group).not.toHaveAttribute("tabindex"));
    await expect(group).toHaveAttribute("role", "group");
    await expect(group).not.toHaveAttribute("aria-label");
    await expect(scroller(canvasElement)).toBe(group);
  },
});

export const Sideways = meta.story({
  name: "Sideways overflow",
  render: () =>
    html`<div style="width:16rem;overflow-x:auto;border:1px solid" ${scrollFocus({ label: "Tracking line" })}>
      <p style="white-space:nowrap">${"A single long line that runs past the edge and scrolls sideways. ".repeat(4)}</p>
    </div>`,
  play: async ({ canvas }) => {
    const region = await canvas.findByRole("region", { name: "Tracking line" });
    await expect(region).toHaveAttribute("tabindex", "0");
    region.style.overflowX = "scroll";
    await expect(overflows(region)).toBe(true);
    region.style.overflowX = "hidden";
    await expect(overflows(region)).toBe(false);
    region.style.overflowX = "";
  },
});

export const NewLabel = meta.story({
  name: "Takes a new label on re-render",
  render: () => html`<div data-testid="host"></div>`,
  play: async ({ canvas }) => {
    const host = canvas.getByTestId("host");
    render(panel({ label: "Delivery notes" }, 8), host);
    const region = await canvas.findByRole("region", { name: "Delivery notes" });
    render(panel({ label: "Shipping notes" }, 8), host);
    await expect(region).toHaveAccessibleName("Shipping notes");
    render(panel({ label: "Shipping notes" }, 8), host);
    await expect(canvas.getByRole("region", { name: "Shipping notes" })).toBe(region);
    render(panel({ label: "" }, 8), host);
    await expect(region).not.toHaveAttribute("role");
    await expect(region).not.toHaveAttribute("aria-label");
    await expect(region).toHaveAttribute("tabindex", "0");
  },
});

export const Reconnects = meta.story({
  name: "Pauses while disconnected and resumes",
  render: () => html`<div data-testid="host"></div>`,
  play: async ({ canvas }) => {
    const host = canvas.getByTestId("host");
    const part = render(panel({ label: "Delivery notes" }, 1), host);
    const el = scroller(host);
    await expect(el).not.toHaveAttribute("tabindex");
    part.setConnected(false);
    el.append(...Array.from({ length: 7 }, () => el.querySelector("p")!.cloneNode(true)));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await expect(el).not.toHaveAttribute("tabindex");
    part.setConnected(true);
    await expect(el).toHaveAttribute("tabindex", "0");
    await expect(canvas.getByRole("region", { name: "Delivery notes" })).toBe(el);
  },
});

export const Detached = meta.story({
  name: "Waits while detached from the document",
  play: async ({ canvas }) => {
    const detached = document.createElement("div");
    render(panel({ label: "Delivery notes" }, 8), detached);
    const el = scroller(detached);
    await expect(el).not.toHaveAttribute("tabindex");
    el.append(document.createElement("p"));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await expect(el).not.toHaveAttribute("tabindex");
    await expect(await canvas.findByRole("region", { name: "Delivery notes" })).toHaveAttribute("tabindex", "0");
  },
});

export const ErrorState = meta.story({
  name: "Error",
  play: async ({ canvas }) => {
    const misplaced = () => render(html`<div class=${scrollFocus()}></div>`, document.createElement("div"));
    await expect(misplaced).toThrow("scrollFocus() goes on the scroll container itself.");
    await expect(canvas.getByRole("region", { name: "Delivery notes" })).toBeVisible();
  },
});
