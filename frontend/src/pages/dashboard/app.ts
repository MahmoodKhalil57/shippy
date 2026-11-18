import { text } from "../../cms/runtime/util.ts";
import { LightElement } from "../../components/base/light-element.ts";
import { html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { API_ROUTE, api, startMockBackend } from "../../cms/client.ts";
import type { Doc } from "../../cms/types.ts";
import type { MenuItem } from "../../components/primitives/navigation/menu.ts";
import type { IconName } from "../../components/primitives/media/icon.ts";
import { StoreController, preferences, notifications } from "../../stores/index.ts";
import "../../components/index.ts";
import "./auth-views.ts";
import "./overview.ts";
import "./edit-view.ts";
import "./list-view.ts";
import "./mock-data.ts";
import "./command.ts";
import { asideRail, expandAsideSection, type AsideSection } from "./aside.ts";
import {
  dashboardPath,
  config,
  globalLabel,
  humanize,
  labels,
  navigate,
  GROUP_ICONS,
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
  @query("ui-app-shell") private _shell?: HTMLElementTagNameMap["ui-app-shell"];
  @state() private failure = "";
  #prefs = new StoreController(this, preferences);
  /** Navigation groups that have held the current page (kept open: navigating never closes a group). */
  #openedGroups = new Set<string>();
  #unread = new StoreController(this, notifications);

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

  /** Navigation: collection groups (`admin.group`) and globals, as collapsible groups with icons. */
  private _groups() {
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
    if (globals.length) groups.set("Configuration", [...(groups.get("Configuration") ?? []), ...globals]);
    groups.set("Mock backend", [
      { label: "Mock data", href: dashboardPath("mock-data"), active: this.route.name === "mock-data" },
      { label: "API", href: `${API_ROUTE}/access` },
    ]);
    return [...groups].map(([label, items]) => ({ label, items, active: items.some((i) => i.active) }));
  }

  private _icon = (name: IconName) => html`<ui-icon name=${name}></ui-icon>`;

  /** The expanded navigation. */
  private _menu(): MenuItem[] {
    return [
      { label: "Dashboard", icon: this._icon("home"), href: dashboardPath(), active: this.route.name === "dashboard" },
      ...this._groups().map((g) => {
        // Navigating opens the group of the page you went to, and never closes one (the user
        // closes groups by hand).
        if (g.active) this.#openedGroups.add(g.label);
        return {
          label: g.label,
          icon: this._icon(GROUP_ICONS[g.label] ?? "grid"),
          open: this.#openedGroups.has(g.label),
          children: g.items,
        };
      }),
    ];
  }

  /** The collapsed rail: one entry per group, linking to its first page. */
  private _rail(): MenuItem[] {
    return [
      { label: "Dashboard", icon: this._icon("home"), href: dashboardPath(), active: this.route.name === "dashboard" },
      ...this._groups().map((g) => ({
        label: g.label,
        icon: this._icon(GROUP_ICONS[g.label] ?? "grid"),
        href: g.items[0]?.href,
        active: g.active,
      })),
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

    const user = this.user;
    const initials = text(user.initials ?? user.email ?? "?").slice(0, 2);
    const profile: MenuItem[] = [
      { label: "Account", href: dashboardPath("account"), active: this.route.name === "account" },
      { label: "Log out", value: "logout" },
    ];
    const { navOpen, asideOpen } = this.#prefs.value;
    return html`
      <ui-app-shell
        brand="Golden Sea"
        brand-icon="anchor"
        brand-href=${dashboardPath()}
        ?nav-open=${navOpen}
        ?aside-open=${asideOpen}
        aside-label="Side panel"
        @ui-change=${(e: CustomEvent<{ nav: boolean; aside: boolean }>) => {
          // Only the shell's own change: `ui-change` from anything inside it (the theme toggle,
          // inputs…) bubbles here too and isn't about the columns.
          if (e.target !== e.currentTarget) return;
          preferences.set({ navOpen: e.detail.nav, asideOpen: e.detail.aside });
        }}
      >
        <dashboard-command
          slot="search"
          .access=${this.access}
          .path=${location.pathname}
          .pageTitle=${this._title()}
          .onLogout=${() => void this._logout()}
        ></dashboard-command>
        <ui-flex slot="actions" align="center" gap="1">
          <ui-theme-controller as="scheme" persist></ui-theme-controller>
          <ui-theme-controller as="cycle" persist></ui-theme-controller>
          <ui-dropdown
            align="end"
            panel="card"
            panel-shadow="lg"
            trigger-variant="ghost"
            trigger-shape="circle"
            trigger-spaced="false"
            .heading=${text(user.name ?? user.email)}
          >
            <ui-avatar slot="trigger" .initials=${initials} size="xs"></ui-avatar>
            <ui-text size="xs" color="muted">${text(user.email)}</ui-text>
            <ui-menu
              width="full"
              surface="false"
              .items=${profile}
              @ui-select=${(e: CustomEvent<{ item: MenuItem }>) => e.detail.item.value === "logout" && this._logout()}
            ></ui-menu>
          </ui-dropdown>
        </ui-flex>
        <ui-menu slot="nav" layout="nav" width="full" surface="false" .items=${this._menu()}></ui-menu>
        <ui-menu slot="rail" layout="rail" surface="false" .items=${this._rail()}></ui-menu>
        <ui-menu
          slot="aside-rail"
          layout="rail"
          surface="false"
          .items=${asideRail(this.#unread.value.unread)}
          @ui-select=${(e: CustomEvent<{ item: MenuItem }>) => {
            expandAsideSection(e.detail.item.value as AsideSection);
            void this._shell?.toggleAside(true);
          }}
        ></ui-menu>
        <dashboard-aside
          slot="aside"
          .access=${this.access}
          .user=${user}
          .path=${location.pathname}
          .pageTitle=${this._title()}
        ></dashboard-aside>
        <ui-container width="6xl" padding-x="fluid" padding-y="fluid">${this._view()}</ui-container>
      </ui-app-shell>
      ${toaster}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-app": DashboardApp;
  }
}
