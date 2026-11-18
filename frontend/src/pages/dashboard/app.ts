import { text } from "../../cms/runtime/util.ts";
import { LightElement } from "../../components/base/light-element.ts";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { API_ROUTE, api, startMockBackend } from "../../cms/client.ts";
import type { Doc } from "../../cms/types.ts";
import type { MenuItem } from "../../components/primitives/navigation/menu.ts";
import "../../components/index.ts";
import "./auth-views.ts";
import "./overview.ts";
import "./edit-view.ts";
import "./list-view.ts";
import "./mock-data.ts";
import {
  dashboardPath,
  config,
  globalLabel,
  humanize,
  labels,
  navigate,
  isDashboardPath,
  parseRoute,
  toast,
  userSlug,
  type Route,
} from "./shared.ts";

/**
 * The dashboard: manages the in-browser mock backend's data, like Payload's
 * admin panel (views, URLs, auth flow), generated from src/cms/config.ts and
 * built from `ui-*` components. Served at the site root.
 */

export type Access = Awaited<ReturnType<typeof api.access>>;

@customElement("dashboard-app")
export class DashboardApp extends LightElement {
  @state() private route: Route = parseRoute(location.pathname);
  @state() private user: (Doc & { collection: string }) | null = null;
  @state() private access: Access | null = null;
  @state() private ready = false;
  @state() private failure = "";

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("popstate", this._onRoute);
    // Dashboard links navigate in-app instead of reloading the page.
    this.addEventListener("click", this._onClick);
    this.addEventListener("dashboard-auth", () => void this._refresh());
    void this._start();
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this._onRoute);
    super.disconnectedCallback();
  }

  private _onRoute = () => {
    this.route = parseRoute(location.pathname);
    void this._guard();
  };

  private _onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.composedPath().find((n): n is HTMLAnchorElement => n instanceof HTMLAnchorElement);
    if (!a || a.target === "_blank" || a.hasAttribute("download") || a.origin !== location.origin) return;
    if (!isDashboardPath(a.pathname)) return;
    e.preventDefault();
    navigate(a.pathname + a.search);
  };

  private async _start() {
    try {
      await startMockBackend();
      await this._refresh();
      this.ready = true;
    } catch (e) {
      this.failure = (e as Error).message;
    }
  }

  private async _refresh() {
    this.user = (await api.me(userSlug)).user;
    this.access = await api.access();
    await this._guard();
  }

  /** Logged out: login (or create-first-user when there are no users). Logged in: away from those. */
  private async _guard() {
    const open = this.route.name === "login" || this.route.name === "create-first-user";
    if (!this.user && !open) {
      const { initialized } = await api.init(userSlug);
      navigate(dashboardPath(initialized ? "login" : "create-first-user"), true);
    } else if (this.user && open) navigate(dashboardPath(), true);
    document.title = `${this._title()} ${config.admin?.meta?.titleSuffix ?? "· Dashboard"}`;
  }

  private _title() {
    const r = this.route;
    if (r.name === "list" || r.name === "create" || r.name === "edit") {
      const c = config.collections.find((x) => x.slug === r.slug)!;
      return r.name === "list" ? labels(c).plural : `${r.name === "create" ? "Create" : "Edit"} ${labels(c).singular}`;
    }
    if (r.name === "global") return humanize(r.slug);
    return humanize(r.name);
  }

  private async _logout() {
    await api.logout(userSlug);
    toast("You have been logged out.", "info");
    await this._refresh();
  }

  private _menu(): MenuItem[] {
    const r = this.route;
    const here = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);
    const groups = new Map<string, MenuItem[]>();
    for (const c of config.collections) {
      if (c.admin?.hidden === true || this.access?.collections[c.slug]?.read.permission === false) continue;
      const group = typeof c.admin?.group === "string" ? c.admin.group : "Collections";
      const href = dashboardPath("collections", c.slug);
      groups.set(group, [...(groups.get(group) ?? []), { label: labels(c).plural, href, active: here(href) }]);
    }
    const globals = (config.globals ?? [])
      .filter((g) => this.access?.globals[g.slug]?.read.permission !== false)
      .map((g) => {
        const href = dashboardPath("globals", g.slug);
        return { label: globalLabel(g), href, active: here(href) };
      });
    return [
      { label: "Dashboard", href: dashboardPath(), active: r.name === "dashboard" },
      ...[...groups].flatMap(([group, items]) => [{ label: group, heading: true }, ...items]),
      ...(globals.length ? [{ label: "Globals", heading: true }, ...globals] : []),
      { label: "Mock backend", heading: true },
      { label: "Mock data", href: dashboardPath("mock-data"), active: r.name === "mock-data" },
      { label: "API", href: `${API_ROUTE}/access` },
      { label: "Account", href: dashboardPath("account"), active: r.name === "account" },
      { label: "Log out", value: "logout" },
    ];
  }

  private _view() {
    const r = this.route;
    const access = this.access!;
    switch (r.name) {
      case "dashboard":
        return html`<dashboard-overview .access=${access}></dashboard-overview>`;
      case "list":
        return html`<dashboard-list-view .slug=${r.slug} .access=${access}></dashboard-list-view>`;
      case "create":
        return html`<dashboard-edit-view .slug=${r.slug} .access=${access}></dashboard-edit-view>`;
      case "edit":
        return html`<dashboard-edit-view .slug=${r.slug} .docId=${r.id} .access=${access}></dashboard-edit-view>`;
      case "global":
        return html`<dashboard-edit-view .globalSlug=${r.slug} .access=${access}></dashboard-edit-view>`;
      case "account":
        return html`<dashboard-edit-view
          .slug=${userSlug}
          .docId=${this.user!.id}
          .access=${access}
        ></dashboard-edit-view>`;
      case "mock-data":
        return html`<dashboard-mock-data></dashboard-mock-data>`;
      default:
        return html`<ui-flex direction="col" align="start" gap="4">
          <ui-heading level="1" size="2xl">Nothing found</ui-heading>
          <ui-text color="muted">There's no dashboard page at this address.</ui-text>
          <ui-button href=${dashboardPath()} color="primary">Back to the dashboard</ui-button>
        </ui-flex>`;
    }
  }

  render() {
    if (this.failure) {
      return html`<ui-container padding-x="4" padding-y="12">
        <ui-alert color="error" heading="The mock backend couldn't start" .description=${this.failure}></ui-alert>
      </ui-container>`;
    }
    if (!this.ready) {
      return html`<ui-flex justify="center" padding="16"><ui-loading size="lg"></ui-loading></ui-flex>`;
    }
    const toaster = html`<ui-toast position="top" align="end"></ui-toast>`;
    if (!this.user) {
      return html`${
        this.route.name === "create-first-user"
          ? html`<dashboard-first-user></dashboard-first-user>`
          : html`<dashboard-login></dashboard-login>`
      }${toaster}`;
    }

    return html`
      <ui-drawer force-open="lg" button-hide="lg" button="☰" button-look="icon">
        <ui-container width="6xl" padding-x="4 md:8" padding-y="6 md:10">${this._view()}</ui-container>
        <ui-flex slot="side" direction="col" gap="2" padding="4" full-height>
          <ui-flex align="center" gap="3" padding="2">
            <ui-avatar
              .initials=${text(this.user.initials ?? this.user.email ?? "?").slice(0, 2)}
              size="sm"
            ></ui-avatar>
            <ui-flex direction="col">
              <ui-text weight="semibold" size="sm">${text(this.user.name ?? this.user.email)}</ui-text>
              <ui-text size="xs" color="muted">${text(this.user.email)}</ui-text>
            </ui-flex>
          </ui-flex>
          <ui-menu
            width="full"
            .items=${this._menu()}
            @ui-select=${(e: CustomEvent<{ item: MenuItem }>) => e.detail.item.value === "logout" && this._logout()}
          ></ui-menu>
          <ui-flex justify="between" align="center" padding="2">
            <ui-text size="xs" color="muted">Theme</ui-text>
            <ui-theme-controller as="swap" theme="dark" persist></ui-theme-controller>
          </ui-flex>
        </ui-flex>
      </ui-drawer>
      ${toaster}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-app": DashboardApp;
  }
}
