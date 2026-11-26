import preview from "#.storybook/preview";
import type { Decorator } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect, fn, waitFor } from "storybook/test";
import { withDashboard } from "../../../.storybook/dashboard.ts";
import type { Tour } from "../../lib/contracts/config.ts";
import { frames } from "../../lib/dashboard/tiling.ts";
import { waitFor as waitUntil } from "./tour.ts";
import { shell, site, type Shell, type ShellOptions } from "../../../.storybook/fixtures/shell.ts";

let current: Shell;
const withShell: Decorator = (story, context) => {
  current = shell(context.parameters.shell as ShellOptions | undefined);
  const start = context.parameters.start as string | undefined;
  if (start) current.dashboard.stores.tour.set({ active: start, step: 0 });
  return withDashboard(() => current.dashboard)(story, context);
};

const guided: Tour[] = [
  {
    id: "guided",
    title: "Month end",
    summary: "Close the month.",
    steps: [
      { title: "The summary", body: "These are this month's figures.", target: { text: "Quarterly summary" } },
      { title: "Refresh", body: "Refresh the figures first.", click: "Refresh figures", wait: 0, open: "aside" },
      { title: "The list", body: "Every open item.", target: { text: "Open items", sel: "ui-card" }, open: "nav" },
    ],
  },
];

type Args = {
  userId: string;
  path: string;
  switchTo: (id: string) => Promise<void>;
  openPanel: (p: string) => Promise<void>;
};

const meta = preview.type<{ args: Args }>().meta({
  title: "Shell/Tour",
  component: "dashboard-tour",
  decorators: [withShell],
  parameters: { start: "t1" },
  args: { userId: "", path: "/", switchTo: fn(() => Promise.resolve()), openPanel: fn(() => Promise.resolve()) },
  argTypes: {
    userId: { control: "select", options: ["", "u1", "u2"], description: "The signed-in demo user." },
    path: { control: "text", description: "The page the tour starts on." },
    switchTo: { table: { category: "events" } },
    openPanel: { table: { category: "events" } },
  },
  render: (args) =>
    html`<dashboard-tour
      .userId=${args.userId}
      .path=${args.path}
      .switchTo=${args.switchTo}
      .openPanel=${args.openPanel}
    ></dashboard-tour>`,
});

const tour = () => current.dashboard.stores.tour.get();

export const Playground = meta.story({
  play: async ({ canvas, userEvent }) => {
    await waitFor(() => expect(canvas.getByText("Start here every morning.")).toBeVisible());
    await expect(canvas.getByText("Getting around")).toBeInTheDocument();
    await waitFor(() => expect(canvas.getByRole("button", { name: "Next" })).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await expect(await canvas.findByText("Every invoice, newest first.")).toBeInTheDocument();
    await waitFor(() =>
      expect(current.dashboard.navigations).toEqual([{ to: "/collections/invoices", replace: false }]),
    );
    await userEvent.click(await canvas.findByRole("button", { name: "Back" }));
    await waitFor(() => expect(tour().step).toBe(0));
  },
});

export const Finish = meta.story({
  name: "Finish the tour",
  args: { userId: "u1" },
  play: async ({ canvas, userEvent }) => {
    await expect(await canvas.findByText("Getting around · signed in as Maya Patel (Manager)")).toBeInTheDocument();
    current.dashboard.stores.tour.set({ step: 2 });
    await userEvent.click(await canvas.findByRole("button", { name: "Finish" }));
    await waitFor(() => expect(tour()).toEqual({ active: null, step: 0, completed: ["t1"] }));
    await expect(canvas.queryByText("That is the tour.")).toBeNull();
  },
});

export const Close = meta.story({
  name: "Close the tour",
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole("button", { name: "Skip" }));
    await waitFor(() => expect(tour()).toEqual({ active: null, step: 0, completed: [] }));
  },
});

export const SwitchUser = meta.story({
  name: "A step signed in as someone else",
  parameters: { start: "t2" },
  args: { userId: "u3" },
  play: async ({ canvas, args }) => {
    await waitFor(() => expect(canvas.getByText("Ask a manager.")).toBeVisible());
    await expect(args.switchTo).toHaveBeenCalledWith("u1");
    await waitFor(() => expect(canvas.getByText("Approvals · signed in as sam@example.com (Accounts)")).toBeVisible());
  },
});

const spot: Tour[] = [
  {
    id: "spot",
    title: "Spotlight",
    summary: "",
    steps: [
      { title: "Two cards", body: "The smaller one wins.", target: { text: "Totals" } },
      { title: "Late button", body: "Pressed once it shows.", click: "Show later" },
    ],
  },
  { id: "empty", title: "Empty", summary: "", steps: [] },
];

export const Closest = meta.story({
  name: "Waits for targets, picks the closest and skips missing steps",
  parameters: { start: "empty", shell: { site: { ...site(), tours: () => Promise.resolve(spot) } } },
  play: async ({ canvasElement }) => {
    await expect(await waitUntil(() => null, 0)).toBeNull();
    await expect(await waitUntil(() => "found", 1000)).toBe("found");
    const el = canvasElement.querySelector("dashboard-tour")!;
    await el.updateComplete;
    await frames(2);
    await expect(canvasElement.querySelector("ui-coachmark")).toBeNull();
    current.dashboard.stores.tour.set({ active: "spot", step: 0 });
    await frames(2);
    current.dashboard.stores.tour.set({ step: 1 });
    await frames(2);
    const card = (heading: string, body: string) => {
      const c = document.createElement("ui-card");
      c.setAttribute("heading", heading);
      c.textContent = body;
      canvasElement.prepend(c);
      return c;
    };
    card("Totals and more", "Totals for the year, broken down by month.");
    const small = card("Totals", "");
    const button = document.createElement("button");
    button.textContent = "Show later";
    let pressed = 0;
    button.addEventListener("click", () => pressed++);
    canvasElement.append(button);
    await waitFor(() => expect(pressed).toBe(1), { timeout: 3000 });
    await waitFor(() => expect(canvasElement.querySelector("ui-coachmark")?.busy).toBe(false), { timeout: 3000 });
    current.dashboard.stores.tour.set({ step: 0 });
    await waitFor(() => expect(canvasElement.querySelector("ui-coachmark")?.target).toBe(small), { timeout: 3000 });
  },
});

export const Targets = meta.story({
  name: "Spotlight, click and panels",
  parameters: { start: "guided", shell: { site: { ...site(), tours: () => Promise.resolve(guided) } } },
  render: (args) =>
    html`<ui-flex direction="col" gap="4">
      <ui-card heading="Quarterly summary"><ui-text>Revenue is up.</ui-text></ui-card>
      <ui-button @click=${args.openPanel}>Refresh figures</ui-button>
      <ui-card heading="Open items"><ui-text>Three items.</ui-text></ui-card>
      <dashboard-tour
        .userId=${args.userId}
        .path=${args.path}
        .switchTo=${args.switchTo}
        .openPanel=${args.openPanel}
      ></dashboard-tour>
    </ui-flex>`,
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const coachmark = () => canvasElement.querySelector("ui-coachmark")!;
    await waitFor(() => expect(coachmark().target).toHaveTextContent("Quarterly summary"));
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await waitFor(() => expect(args.openPanel).toHaveBeenCalledWith("aside"));
    await waitFor(() => expect(args.openPanel).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(coachmark().busy).toBe(false));
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await waitFor(() => expect(coachmark().target).toHaveTextContent("Open items"));
    await expect(args.openPanel).toHaveBeenLastCalledWith("nav");
  },
});
