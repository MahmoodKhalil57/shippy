import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn, waitFor } from "storybook/test";
import { testDashboard, withDashboard, type TestDashboard } from "../../../.storybook/dashboard.ts";
import type { LocalAiState } from "../../lib/agent/ai-polyfill.ts";
import type { AiPort } from "../../lib/dashboard/context.ts";
import "./auth-views.ts";
import { config, data, seedUsers } from "../../../.storybook/fixtures/views.ts";

const users = seedUsers.map((u) => ({
  collection: "users",
  email: u.email,
  password: u.password,
  doc: { id: u.id, name: u.name, email: u.email, role: u.role },
}));

const polyfill = (state: LocalAiState, download: () => Promise<void> = () => Promise.resolve()) => {
  let now = state;
  return {
    localAiState: fn(() => Promise.resolve(now)),
    useLocalModel: fn(async () => {
      await download();
      now = "local";
    }),
  } as unknown as AiPort["polyfill"];
};

const dashboard = (options: { seeded?: boolean; ai?: AiPort["polyfill"]; loginIntro?: string } = {}) =>
  testDashboard({
    config,
    seedUsers: options.seeded === false ? [] : seedUsers,
    data: data({
      users: [
        ...users,
        {
          collection: "users",
          email: "guest@example.com",
          password: "demo1234",
          doc: { id: "g1", email: "guest@example.com" } as never,
        },
      ],
    }),
    ai: { polyfill: options.ai ?? polyfill("off") },
    site: options.loginIntro
      ? { branding: { name: "Sample workspace", icon: "grid", backgrounds: [], loginIntro: options.loginIntro } }
      : {},
  });
const dashboardOf = (el: HTMLElement) =>
  (el.querySelector("dashboard-login")!.closest("dashboard-provider") as unknown as { dashboard: TestDashboard })
    .dashboard;

const meta = preview.meta({
  title: "Views/Login",
  component: "dashboard-login",
  decorators: [withDashboard(() => dashboard())],
  parameters: { layout: "fullscreen" },
  args: { onAuth: fn() },
  argTypes: { onAuth: { table: { disable: true } } },
  render: (a: { onAuth: () => void }) => html`<dashboard-login @dashboard-auth=${a.onAuth}></dashboard-login>`,
});

export const Playground = meta.story({});

export const SeedUser = meta.story({
  name: "Demo user filled in",
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await expect(canvas.getByRole("textbox", { name: "Email" })).toHaveValue("maya@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    await expect(await canvas.findByText("maya@example.com")).toBeVisible();
    await waitFor(() => expect(canvas.getByRole("textbox", { name: "Authenticator code" })).toHaveFocus());
    await userEvent.keyboard("123456");
    await waitFor(() => expect(args.onAuth).toHaveBeenCalledOnce());
    const d = dashboardOf(canvasElement);
    await expect(d.notices.map((n) => n.message)).toEqual(["Welcome back."]);
    await expect((d.data as unknown as { calls: { method: string; args: unknown[] }[] }).calls.at(-1)).toEqual({
      method: "login",
      args: ["users", "maya@example.com", "maya-pass"],
    });
  },
});

export const OtherRole = meta.story({
  name: "Another seed user",
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const email = canvas.getByRole("textbox", { name: "Email" });
    await userEvent.clear(email);
    await userEvent.type(email, "  jordan@example.com ");
    await userEvent.keyboard("{Enter}");
    await expect(await canvas.findByText("jordan@example.com")).toBeVisible();
    await waitFor(() => expect(canvas.getByRole("textbox", { name: "Authenticator code" })).toHaveFocus());
    await userEvent.keyboard("654321");
    await waitFor(() => expect(args.onAuth).toHaveBeenCalledOnce());
    await expect(
      (dashboardOf(canvasElement).data as unknown as { calls: { args: unknown[] }[] }).calls.at(-1)!.args,
    ).toEqual(["users", "jordan@example.com", "jordan-pass"]);
  },
});

export const WrongPassword = meta.story({
  name: "Wrong password",
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const email = canvas.getByRole("textbox", { name: "Email" });
    await userEvent.clear(email);
    await userEvent.type(email, "stranger@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    await waitFor(() => expect(canvas.getByRole("textbox", { name: "Authenticator code" })).toHaveFocus());
    await userEvent.keyboard("111111");
    await expect(await canvas.findByText("The email or password provided is incorrect.")).toBeVisible();
    await expect(args.onAuth).not.toHaveBeenCalled();
    const calls = (dashboardOf(canvasElement).data as unknown as { calls: unknown[] }).calls;
    const tries = calls.length;
    await userEvent.click(canvas.getByRole("button", { name: "Verify and log in" }));
    await waitFor(() => expect(calls.length).toBe(tries + 1));
    await expect(await canvas.findByText("The email or password provided is incorrect.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Change" }));
    await expect(await canvas.findByRole("textbox", { name: "Email" })).toHaveValue("stranger@example.com");
    await expect(canvas.queryByText("The email or password provided is incorrect.")).toBeNull();
  },
});

export const DemoPassword = meta.story({
  name: "Demo password",
  decorators: [withDashboard(() => dashboard({ seeded: false, loginIntro: "Use the guest account to look around." }))],
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText("Use the guest account to look around.")).toBeVisible();
    const email = canvas.getByRole("textbox", { name: "Email" });
    await expect(email).toHaveValue("");
    await userEvent.type(email, "guest@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    await waitFor(() => expect(canvas.getByRole("textbox", { name: "Authenticator code" })).toHaveFocus());
    await userEvent.keyboard("123456");
    await waitFor(() => expect(args.onAuth).toHaveBeenCalledOnce());
  },
});

export const Verifying = meta.story({
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    await expect(await canvas.findByRole("heading", { name: "Verify it's you" })).toBeVisible();
    await expect(canvas.getByRole("textbox", { name: "Authenticator code" })).toHaveFocus();
  },
});

export const Passkey = meta.story({
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    await userEvent.click(await canvas.findByRole("button", { name: "Use a passkey" }));
    await expect(canvas.getByRole("button", { name: /Waiting for your device/ })).toBeDisabled();
    for (const a of canvasElement.querySelector("dashboard-login")!.getAnimations()) a.finish();
    await waitFor(() => expect(args.onAuth).toHaveBeenCalledOnce());
  },
});

export const AiOff = meta.story({
  name: "AI option, off",
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByText("Turn on AI features"));
    await userEvent.click(await canvas.findByRole("button", { name: "Download (800 MB)" }));
    await expect(await canvas.findByText("This browser uses the downloaded model.")).toBeVisible();
    await expect(canvas.queryByRole("button", { name: /Download/ })).toBeNull();
    await expect(dashboardOf(canvasElement).ai.polyfill.useLocalModel).toHaveBeenCalledOnce();
  },
});

export const AiDownloading = meta.story({
  name: "AI option, downloading",
  decorators: [withDashboard(() => dashboard({ ai: polyfill("off", () => new Promise(() => undefined)) }))],
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("Turn on AI features"));
    await userEvent.click(await canvas.findByRole("button", { name: "Download (800 MB)" }));
    await expect(await canvas.findByRole("button", { name: "Loading…" })).toBeDisabled();
  },
});

export const AiDownloadFails = meta.story({
  name: "AI option, download fails",
  decorators: [withDashboard(() => dashboard({ ai: polyfill("off", () => Promise.reject(new Error("offline"))) }))],
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("Turn on AI features"));
    await userEvent.click(await canvas.findByRole("button", { name: "Download (800 MB)" }));
    await expect(await canvas.findByRole("button", { name: "Download (800 MB)" })).toBeEnabled();
  },
});

export const AiNative = meta.story({
  name: "AI option, on-device AI on",
  decorators: [withDashboard(() => dashboard({ ai: polyfill("native") }))],
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("Turn on AI features"));
    await expect(await canvas.findByText("Chrome's on-device AI is on in this browser.")).toBeVisible();
    await expect(canvas.queryByRole("button", { name: /Download/ })).toBeNull();
  },
});
