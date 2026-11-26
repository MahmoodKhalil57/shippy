import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn, waitFor } from "storybook/test";
import { testDashboard, withDashboard, type TestDashboard } from "../../../.storybook/dashboard.ts";
import { ApiError } from "../../lib/api/errors.ts";
import "./auth-views.ts";
import { config } from "../../../.storybook/fixtures/views.ts";

const make = (extra?: (d: TestDashboard) => void) => () => {
  const d = testDashboard({ config, data: { initialized: false } });
  extra?.(d);
  return d;
};
const dashboardOf = (el: HTMLElement) =>
  (el.querySelector("dashboard-first-user")!.closest("dashboard-provider") as unknown as { dashboard: TestDashboard })
    .dashboard;

const meta = preview.meta({
  title: "Views/First user",
  component: "dashboard-first-user",
  decorators: [withDashboard(make())],
  parameters: { layout: "fullscreen" },
  args: { onAuth: fn() },
  argTypes: { onAuth: { table: { disable: true } } },
  render: (a: { onAuth: () => void }) =>
    html`<dashboard-first-user @dashboard-auth=${a.onAuth}></dashboard-first-user>`,
});

export const Playground = meta.story({});

export const Register = meta.story({
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await waitFor(() => expect(canvas.getByRole("heading", { name: "Create the first user" })).toBeVisible());
    await userEvent.type(canvas.getByRole("textbox", { name: /Email/ }), "owner@example.com");
    await userEvent.type(canvas.getByRole("textbox", { name: /Name/ }), "Alex Morgan");
    await userEvent.type(canvas.getByLabelText(/Password/), "a-long-passphrase");
    await userEvent.click(canvas.getByRole("button", { name: "Create" }));
    await waitFor(() => expect(args.onAuth).toHaveBeenCalledOnce());
    const d = dashboardOf(canvasElement);
    await expect(d.notices.map((n) => n.message)).toEqual(["Account created."]);
    await expect((d.data as unknown as { calls: { method: string; args: unknown[] }[] }).calls.at(-1)).toEqual({
      method: "firstRegister",
      args: ["users", { email: "owner@example.com", name: "Alex Morgan", password: "a-long-passphrase" }],
    });
  },
});

export const ServerErrors = meta.story({
  name: "Field errors from the server",
  decorators: [
    withDashboard(
      make((d) => {
        d.data.firstRegister = () =>
          Promise.reject(
            new ApiError(400, [
              {
                message: "The following fields are invalid: email, password",
                data: {
                  errors: [
                    { path: "email", message: "This email is already registered." },
                    { path: "password", message: "Use at least 12 characters." },
                  ],
                },
              },
            ]),
          );
      }),
    ),
  ],
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await userEvent.type(canvas.getByRole("textbox", { name: /Email/ }), "owner@example.com");
    await userEvent.type(canvas.getByRole("textbox", { name: /Name/ }), "Alex Morgan");
    await userEvent.type(canvas.getByLabelText(/Password/), "short");
    await userEvent.click(canvas.getByRole("button", { name: "Create" }));
    await waitFor(() => expect(canvas.getByText("Use at least 12 characters.")).toBeVisible());
    await waitFor(() => expect(canvas.getByText("This email is already registered.")).toBeVisible());
    await expect(args.onAuth).not.toHaveBeenCalled();
    await expect(dashboardOf(canvasElement).notices.map((n) => n.tone)).toEqual(["error"]);
  },
});

export const Offline = meta.story({
  name: "Server unreachable",
  decorators: [
    withDashboard(
      make((d) => {
        d.data.firstRegister = () => Promise.reject(new Error("Failed to fetch"));
      }),
    ),
  ],
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.type(canvas.getByRole("textbox", { name: /Email/ }), "owner@example.com");
    await userEvent.type(canvas.getByRole("textbox", { name: /Name/ }), "Alex Morgan");
    await userEvent.type(canvas.getByLabelText(/Password/), "a-long-passphrase");
    await userEvent.click(canvas.getByRole("button", { name: "Create" }));
    const d = dashboardOf(canvasElement);
    await waitFor(() => expect(d.notices).toEqual([{ message: "Failed to fetch", tone: "error", action: undefined }]));
  },
});

export const OwnFormOnly = meta.story({
  name: "Keeps only changes from its own form",
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector("ui-doc-form")!;
    form.firstElementChild!.dispatchEvent(
      new CustomEvent("ui-change", { bubbles: true, detail: { value: { name: "Nested" } } }),
    );
    form.dispatchEvent(new CustomEvent("ui-change", { detail: { value: { name: "Alex Morgan" } } }));
    const view = canvasElement.querySelector("dashboard-first-user") as unknown as { value: Record<string, unknown> };
    await expect(view.value).toEqual({ name: "Alex Morgan" });
  },
});
