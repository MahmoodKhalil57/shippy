import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import "./app.ts";
import { appShell, calls, current, ready, tool, withShell } from "../../../.storybook/fixtures/shell.ts";

const meta = preview.type<{ args: { at: string } }>().meta({
  title: "Shell/App/Auth",
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

export const SignedOut = meta.story({
  name: "Signed out: the login route",
  parameters: { shell: { user: null } },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole("textbox", { name: "Email" })).toBeVisible();
    await waitFor(() => expect(current.dashboard.navigations).toEqual([{ to: "/login", replace: true }]));
    await waitFor(() => expect(document.title).toBe("Login · Workspace"));
  },
});

export const FirstUser = meta.story({
  name: "No users yet: create the first one",
  parameters: { shell: { user: null, data: { initialized: false } } },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole("button", { name: "Create" })).toBeVisible();
    await expect(current.dashboard.navigations).toEqual([{ to: "/create-first-user", replace: true }]);
  },
});

export const SignedInOnLogin = meta.story({
  name: "Signed in on the login page goes home",
  args: { at: "/login" },
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    await expect(current.dashboard.navigations).toEqual([{ to: "/", replace: true }]);
  },
});

export const LogOut = meta.story({
  name: "Log out",
  play: async ({ canvasElement, canvas, userEvent }) => {
    await ready(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "ma" }));
    await userEvent.click(await canvas.findByRole("button", { name: "Log out" }));
    await waitFor(() => expect(current.dashboard.notices.map((n) => n.message)).toEqual(["You have been logged out."]));
    await expect(await canvas.findByRole("textbox", { name: "Email" })).toBeVisible();
  },
});

export const SwitchUser = meta.story({
  name: "Switch to another demo user",
  play: async ({ canvasElement, canvas, userEvent }) => {
    await ready(canvasElement);
    await appShell(canvasElement).toggleNav(true);
    await userEvent.click(
      await canvas.findByRole("button", { name: "MA · Switch user (demo) — signed in as Maya Patel" }),
    );
    await userEvent.click(await canvas.findByRole("button", { name: /Jordan Lee/ }));
    await waitFor(() => expect(current.dashboard.notices.at(-1)?.message).toBe("Signed in as Jordan Lee (Accounts)"));
    await expect(
      calls()
        .filter((c) => c.method === "login")
        .map((c) => c.args),
    ).toEqual([["users", "jordan@example.com", "jordan-pass"]]);
  },
});

export const BackendDown = meta.story({
  name: "Backend unreachable",
  parameters: { shell: { fail: "Service unavailable" } },
  play: async ({ canvas, canvasElement }) => {
    await expect(await canvas.findByRole("alert")).toHaveTextContent("Service unavailable");
    await expect(canvasElement.querySelector("ui-alert")?.getAttribute("heading")).toBe(
      "The mock backend couldn't start",
    );
  },
});

export const SwitchFails = meta.story({
  name: "Switching user fails",
  parameters: {
    shell: {
      seedUsers: [
        { id: "u1", name: "Maya Patel", email: "maya@example.com", password: "maya-pass", role: "manager" },
        { id: "u9", email: "ghost@example.com", password: "x", role: "accounts" },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    current.dashboard.data.login = () => Promise.reject(new Error("Locked"));
    await canvasElement.querySelector("dashboard-tour")!.switchTo("u9");
    await expect(current.dashboard.notices.at(-1)).toMatchObject({
      message: "Couldn't switch to ghost@example.com: Locked",
      tone: "error",
    });
  },
});

let release = () => {};
export const Loading = meta.story({
  decorators: [
    (story) => {
      const me = current.dashboard.data.me;
      const gate = new Promise<void>((resolve) => (release = resolve));
      current.dashboard.data.me = (slug) => gate.then(() => me(slug));
      return story();
    },
  ],
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("ui-loading")).not.toBeNull();
    await expect(canvasElement.querySelector("ui-app-shell")).toBeNull();
    release();
    await ready(canvasElement);
    await expect(canvasElement.querySelector("ui-loading[variant=morph]")).toBeNull();
  },
});

export const Nameless = meta.story({
  name: "A user without a name signs out and back in",
  args: { at: "/reports" },
  parameters: { shell: { user: { id: "u3", email: "sam@example.com", role: "accounts" } } },
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    await expect(current.dashboard.ai.webmcp.agentContext()?.name).toBe("sam@example.com");
    canvasElement.querySelector("dashboard-command")!.onLogout!();
    await waitFor(() => expect(current.dashboard.notices.at(-1)?.message).toBe("You have been logged out."));
    await waitFor(() => expect(current.dashboard.ai.webmcp.agentTools().length).toBe(3));
    await tool("switch_user", { id: "u3" });
    await waitFor(() =>
      expect(current.dashboard.notices.at(-1)?.message).toBe("Signed in as sam@example.com (Accounts)"),
    );
  },
});
