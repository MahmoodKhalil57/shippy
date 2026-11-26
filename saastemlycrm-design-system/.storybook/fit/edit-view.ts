import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import { vi } from "vite-plus/test";
import { testDashboard, type TestDashboard } from "../dashboard.ts";
import { fitMatrix, type FitState } from "./views.ts";
import { config, data, fullAccess, maya, readOnlyAccess, seedUsers } from "../fixtures/views.ts";
import { ApiError } from "../../src/lib/api/errors.ts";
import type { Access } from "../../src/lib/dashboard/context.ts";
import type { DashboardEditView } from "../../src/components/views/edit-view.ts";
import "../../src/components/views/edit-view.ts";

const view = (host: HTMLElement) => host.querySelector<DashboardEditView>("dashboard-edit-view")!;
const loaded = (host: HTMLElement) =>
  waitFor(() => {
    const v = view(host);
    return expect(
      !!v.querySelector("ui-doc-form, ui-alert, demo-activity-tab") && !v.querySelector("ui-empty-state[loading]"),
    ).toBe(true);
  });

interface Setup {
  slug?: string;
  docId?: string;
  globalSlug?: string;
  tab?: string;
  access?: Access;
  tile?: boolean;
  embedded?: boolean;
  dashboard?: (d: TestDashboard) => void;
  act?: (host: HTMLElement) => Promise<unknown>;
}

const state = (name: string, s: Setup): FitState => ({
  name,
  dashboard: () => {
    const d = testDashboard({ config, seedUsers, data: data() });
    s.dashboard?.(d);
    return d;
  },
  render: () =>
    html`<dashboard-edit-view
      .slug=${s.slug ?? "deals"}
      .docId=${s.docId ?? "d1"}
      .globalSlug=${s.globalSlug ?? ""}
      .tab=${s.tab ?? ""}
      .access=${s.access ?? fullAccess}
      .user=${maya}
      ?tile=${s.tile ?? false}
      ?embedded=${s.embedded ?? false}
    ></dashboard-edit-view>`,
  ready: async (host) => {
    await loaded(host);
    await s.act?.(host);
  },
});

const invalid = (d: TestDashboard) => {
  d.data.update = () =>
    Promise.reject(
      new ApiError(400, [
        {
          message: "The following fields are invalid: title, amount",
          data: {
            errors: [
              { path: "title", message: "This title is already used by another deal." },
              { path: "amount", message: "Amount must be positive." },
              { path: "lines.0.price", message: "Price is required." },
              { path: "notes", message: "Notes are too long." },
            ],
          },
        },
      ]),
    );
};
const saveFails = async (host: HTMLElement) => {
  view(host).save();
  await waitFor(() => expect(!!host.querySelector("ui-alert[tone=error]")).toBe(true));
};

const STATES: FitState[] = [
  state("create", { docId: "" }),
  state("edit", {}),
  state("read-only", { access: readOnlyAccess }),
  state("field errors", { dashboard: invalid, act: saveFails }),
  state("custom tab", { tab: "activity" }),
  state("missing tab", { tab: "history" }),
  state("global", { slug: "", docId: "", globalSlug: "settings" }),
  state("image upload", { slug: "files", docId: "f1" }),
  state("file upload", { slug: "files", docId: "f2" }),
  state("new upload", { slug: "files", docId: "" }),
  state("account", { slug: "users", docId: "u1" }),
  state("company with joins", { slug: "companies", docId: "c1" }),
  state("not found", { docId: "missing" }),
  state("tile", { tile: true }),
  state("tile read-only", { tile: true, access: readOnlyAccess }),
  state("tile with errors", { tile: true, dashboard: invalid, act: saveFails }),
  state("tile tab", { tile: true, tab: "activity" }),
  state("embedded", { embedded: true }),
];

export const EDIT_SHARDS = 4;

export const editFit = (shard: number) => {
  vi.setConfig({ testTimeout: 600_000 });
  return {
    name: `Fits every screen, shard ${shard + 1} of 4`,
    play: async () => {
      await expect(await fitMatrix(STATES, 4, shard)).toEqual([]);
    },
  };
};
