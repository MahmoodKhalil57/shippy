import { text } from "../../cms/runtime/util.ts";
import { LightElement } from "../../components/base/light-element.ts";
import { html, nothing } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { API_ROUTE, api, startMockBackend } from "../../cms/client.ts";
import type { Doc } from "../../cms/types.ts";
import type { MenuItem } from "../../components/primitives/navigation/menu.ts";
import type { IconName } from "../../components/primitives/media/icon.ts";
import { StoreController, preferences, notifications } from "../../stores/index.ts";
import "../../components/index.ts";
import "./auth-views.ts";
import "./home.ts";
import "./tour.ts";
import { viewElement } from "./views.ts";
import "./edit-view.ts";
import "./list-view.ts";
import "./mock-data.ts";
import "./command.ts";
import { asideRail, expandAsideSection, type AsideSection } from "./aside.ts";
import { roleLabel, roleLogins, seedUsers, type SeedUser } from "./demo-users.ts";
import {
  dashboardPath,
  config,
  globalLabel,
  humanize,
  labels,
  navigate,
  rootViews,
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
    if (r.name === "view") return rootViews().find((v) => v.key === r.key)?.meta?.title ?? humanize(r.key);
    return humanize(r.name);
  }

  /** Guided tours: sign in as a seeded user by id (a tour step's `as`). */
  private _switchToId = async (id: string) => {
    const u = seedUsers.find((x) => x.id === id);
    if (u) await this._switchTo(u);
  };

  /** Guided tours: open a side column (its sections hold the step's target). */
  private _openPanel = async (panel: "aside" | "nav") => {
    await (panel === "aside" ? this._shell?.toggleAside(true) : this._shell?.toggleNav(true));
  };

  /**
   * Demo: become another user in place (sign out, sign in as them behind the scenes; no login
   * page). Users keep their own role — this changes who you are, never anyone's role.
   */
  private async _switchTo(u: SeedUser) {
    if (u.email === this.user?.email) return;
    try {
      // Signing in replaces the session; no logout first, so a failure leaves you signed in.
      await api.login(userSlug, u.email, u.password);
      toast(`Signed in as ${u.name ?? u.email} (${roleLabel(u.role)})`, "info");
      await this._refresh();
    } catch (e) {
      toast(`Couldn't switch to ${u.name ?? u.email}: ${(e as Error).message}`, "error");
    }
  }

  /**
   * Demo user switcher, docked in the navigation's footer (never over the menu): the current
   * user's avatar opens a "Switch user" card — one seeded user per role, name and role on two
   * lines, the current one highlighted.
   */
  private _userSwitcher() {
    if (!this.user || !roleLogins.length) return nothing;
    const initials = (user: object) => {
      const u = user as Record<string, unknown>;
      return text(u.initials ?? u.name ?? u.email ?? "?")
        .slice(0, 2)
        .toUpperCase();
    };
    const items: MenuItem[] = roleLogins.map((u) => ({
      icon: html`<ui-avatar size="xs" .initials=${initials(u)}></ui-avatar>`,
      label: html`<ui-flex direction="col" gap="0" shrink>
        <ui-text as="div" size="sm" weight="semibold" truncate>${u.name ?? u.email}</ui-text>
        <ui-text as="div" size="xs" color="muted" truncate>${roleLabel(u.role)}</ui-text>
      </ui-flex>`,
      active: u.email === this.user?.email,
      value: u.email,
    }));
    return html`<ui-dropdown
      slot="nav-footer"
      mode="popover"
      side="top"
      align="start"
      panel="card"
      panel-width="72"
      panel-shadow="lg"
      trigger-variant="ghost"
      trigger-shape="circle"
      trigger-spaced="false"
      .label=${`Switch user (demo) — signed in as ${text(this.user.name ?? this.user.email)}`}
      .heading=${html`<ui-flex align="center" justify="between" gap="2"
        >Switch user <ui-badge size="xs" variant="soft" color="primary">Demo</ui-badge></ui-flex
      >`}
    >
      <ui-avatar slot="trigger" size="xs" .initials=${initials(this.user)}></ui-avatar>
      <ui-menu
        width="full"
        surface="false"
        nowrap
        .items=${items}
        @ui-select=${(e: CustomEvent<{ item: MenuItem }>) => {
          const u = roleLogins.find((x) => x.email === e.detail.item.value);
          if (u) void this._switchTo(u);
        }}
      ></ui-menu>
    </ui-dropdown>`;
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
    // Custom views go first in their group (they're the purpose-built screens).
    for (const v of [...rootViews()].reverse()) {
      if (!v.nav) continue;
      const href = dashboardPath(v.path.slice(1));
      groups.set(v.nav.group, [{ label: v.nav.label, href, active: here(href) }, ...(groups.get(v.nav.group) ?? [])]);
    }
    groups.set("Mock backend", [
      { label: "Mock data", href: dashboardPath("mock-data"), active: this.route.name === "mock-data" },
      { label: "API", href: `${API_ROUTE}/access` },
    ]);
    // The order work flows in: from the first email to the last payment, then insight and setup.
    const ORDER = [
      "Sourcing desk",
      "Commercial",
      "Fulfilment",
      "Finance",
      "Insights",
      "Growth",
      "Work",
      "Directory",
      "Catalogue",
      "Team",
      "Configuration",
      "Mock backend",
    ];
    const rank = (g: string) => (ORDER.indexOf(g) + 1 || ORDER.length) - 1;
    return [...groups]
      .sort(([a], [b]) => rank(a) - rank(b))
      .map(([label, items]) => ({ label, items, active: items.some((i) => i.active) }));
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
        return html`<dashboard-home></dashboard-home>`;
      case "list":
        return html`<dashboard-list-view .slug=${r.slug} .access=${access}></dashboard-list-view>`;
      case "create":
        return html`<dashboard-edit-view .slug=${r.slug} .access=${access}></dashboard-edit-view>`;
      case "edit":
        return html`<dashboard-edit-view
          .slug=${r.slug}
          .docId=${r.id}
          .tab=${r.tab ?? ""}
          .access=${access}
          .user=${this.user}
        ></dashboard-edit-view>`;
      case "view": {
        const view = rootViews().find((v) => v.key === r.key)!;
        return (
          viewElement(view.Component, { access, user: this.user! }) ??
          html`<ui-alert color="info" heading=${view.meta?.title ?? view.key}>This screen is loading.</ui-alert>`
        );
      }
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
        ${this._userSwitcher()}
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
        <ui-container width="6xl" padding-x="fluid" padding-y="fluid"
          >${
            // Keyed by user: switching users mounts the page afresh, so it loads their data.
            keyed(user.id, this._view())
          }</ui-container
        >
      </ui-app-shell>
      ${toaster}
      <dashboard-tour .userId=${user.id} .switchTo=${this._switchToId} .openPanel=${this._openPanel}></dashboard-tour>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-app": DashboardApp;
  }
}
