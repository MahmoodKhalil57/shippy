import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import { vi } from "vite-plus/test";
import { testDashboard, type TestDashboard } from "../dashboard.ts";
import { fitMatrix, type FitState } from "./views.ts";
import { config, data, seedUsers } from "../fixtures/views.ts";
import type { LocalAiState } from "../../src/lib/agent/ai-polyfill.ts";
import { ApiError } from "../../src/lib/api/errors.ts";
import type { AiPort } from "../../src/lib/dashboard/context.ts";
import "../../src/components/views/auth-views.ts";

const polyfill = (state: LocalAiState) =>
  ({
    localAiState: () => Promise.resolve(state),
    useLocalModel: () => Promise.resolve(),
  }) as unknown as AiPort["polyfill"];

const login = (name: string, ai: LocalAiState, then: (host: HTMLElement) => Promise<unknown>): FitState => ({
  name,
  dashboard: () => testDashboard({ config, seedUsers, data: data(), ai: { polyfill: polyfill(ai) } }),
  render: () => html`<dashboard-login></dashboard-login>`,
  ready: then,
});

const openAi = async (host: HTMLElement) => {
  const details = host.querySelector("details")!;
  details.open = true;
  await waitFor(() => expect(host.querySelector("ui-tag[lang=en] > *")?.checkVisibility()).toBe(true));
};
const verifyStep = async (host: HTMLElement) => {
  host.querySelector("form")!.requestSubmit();
  await waitFor(() => expect(!!host.querySelector("ui-otp")).toBe(true));
};
const failedLogin = async (host: HTMLElement) => {
  const input = host.querySelector<HTMLInputElement>("input[type=email]")!;
  input.value = "a-very-long-address-that-nobody-uses@subdomain.example.com";
  await verifyStep(host);
  const otp = host.querySelector<HTMLInputElement>("ui-otp input")!;
  otp.value = "123456";
  otp.dispatchEvent(new Event("input", { bubbles: true }));
  await waitFor(() => expect(!!host.querySelector("ui-alert[tone=error]")).toBe(true));
};

const firstUser = (name: string, fail?: (d: TestDashboard) => void): FitState => ({
  name,
  dashboard: () => {
    const d = testDashboard({ config, data: { initialized: false } });
    fail?.(d);
    return d;
  },
  render: () => html`<dashboard-first-user></dashboard-first-user>`,
  ready: async (host) => {
    if (!fail) return;
    host.querySelector("form")!.noValidate = true;
    host.querySelector("form")!.requestSubmit();
    await waitFor(() => expect(host.textContent).toContain("Use at least 12 characters."));
  },
});

const STATES: FitState[] = [
  login("email step", "off", () => Promise.resolve()),
  login("ai option open", "off", openAi),
  login("ai option on", "native", openAi),
  login("ai option local", "local", openAi),
  login("verify step", "off", verifyStep),
  login("wrong password", "off", failedLogin),
  firstUser("first user"),
  firstUser("first user with errors", (d) => {
    d.data.firstRegister = () =>
      Promise.reject(
        new ApiError(400, [
          {
            message: "Invalid",
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
];

export const AUTH_SHARDS = 2;

export const authFit = (shard: number) => {
  vi.setConfig({ testTimeout: 600_000 });
  return {
    name: `Fits every screen, shard ${shard + 1} of 2`,
    play: async () => {
      await expect(await fitMatrix(STATES, 2, shard)).toEqual([]);
    },
  };
};
