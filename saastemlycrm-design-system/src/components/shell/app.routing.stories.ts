import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import type { Route } from "../../lib/dashboard/project.ts";
import { pageTransitionOf } from "./app.ts";
import { app, current, ready, settled, withShell } from "../../../.storybook/fixtures/shell.ts";

const meta = preview.type<{ args: { at: string } }>().meta({
  title: "Shell/App/Routing",
  component: "dashboard-app",
  decorators: [withShell],
  parameters: { layout: "fullscreen" },
  args: { at: "/" },
  argTypes: {
    at: {
      control: "select",
      options: [
        "/",
        "/collections/invoices",
        "/collections/invoices/i1",
        "/globals/settings",
        "/reports",
        "/account",
        "/nowhere",
      ],
      description: "The address the dashboard opens at.",
    },
  },
  render: () => html`<dashboard-app .address=${current.address}></dashboard-app>`,
});

const view = (key: string, params: Record<string, string> = {}): Route => ({ name: "view", key, params });
export const Address = meta.story({
  name: "A list address goes to its place",
  args: { at: "/collections/invoices?q=INV" },
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    await waitFor(() =>
      expect(current.dashboard.navigations).toEqual([{ to: "/collections/invoices?invoices[q]=INV", replace: true }]),
    );
  },
});

export const Routes = meta.story({
  name: "Follows routes and redirects addresses",
  play: async ({ canvasElement }) => {
    await expect(pageTransitionOf({ name: "dashboard" }, { name: "dashboard" })).toBeUndefined();
    await expect(pageTransitionOf(view("invoice", { id: "1" }), view("invoice", { id: "2" }))).toBe("lateral-forward");
    await expect(pageTransitionOf(view("invoices"), view("invoice", { id: "1" }))).toBe("forward");
    await expect(pageTransitionOf(view("invoice", { id: "1" }), { name: "dashboard" })).toBe("backward");
    await expect(pageTransitionOf({ name: "dashboard" }, { name: "account" })).toBe("top-level");
    await ready(canvasElement);
    current.dashboard.navigate("/collections/invoices");
    current.dashboard.navigate("/collections/customers");
    await waitFor(() => expect(document.title).toBe("Customers · Workspace"));
    current.dashboard.navigate("/collections/customers?q=Harbor");
    await waitFor(() =>
      expect(current.dashboard.navigations.at(-1)).toEqual({
        to: "/collections/customers?customers[q]=Harbor",
        replace: true,
      }),
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
    await settled(app(canvasElement));
    await expect(document.title).toBe("Customers · Workspace");
  },
});

export const Links = meta.story({
  name: "Dashboard links open in place, others go to the browser",
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    const el = app(canvasElement);
    const stop = (e: Event) => e.preventDefault();
    window.addEventListener("click", stop);
    try {
      const click = (href: string, init: MouseEventInit = {}, attrs: Record<string, string> = {}) => {
        const a = document.createElement("a");
        a.href = href;
        for (const [k, v] of Object.entries(attrs)) a.setAttribute(k, v);
        a.textContent = "link";
        el.append(a);
        a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, composed: true, ...init }));
        a.remove();
      };
      const before = current.dashboard.navigations.length;
      const prevented = new MouseEvent("click", { bubbles: true, cancelable: true });
      prevented.preventDefault();
      el.dispatchEvent(prevented);
      click("/collections/invoices", { button: 1 });
      click("/collections/invoices", { metaKey: true });
      click("/collections/invoices", { ctrlKey: true });
      click("/collections/invoices", { shiftKey: true });
      click("/collections/invoices", { altKey: true });
      click("/collections/invoices", {}, { target: "_blank" });
      click("/collections/invoices", {}, { download: "" });
      click("https://example.org/collections/invoices");
      click("/api/users");
      const span = document.createElement("span");
      el.append(span);
      span.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      span.remove();
      await expect(current.dashboard.navigations.length).toBe(before);
      click("/collections/invoices?invoices[q]=x");
      await expect(current.dashboard.navigations.at(-1)).toEqual({
        to: "/collections/invoices?invoices[q]=x",
        replace: false,
      });
    } finally {
      window.removeEventListener("click", stop);
    }
  },
});
