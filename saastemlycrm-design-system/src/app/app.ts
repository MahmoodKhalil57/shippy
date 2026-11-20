import { text } from "../payload/util.ts";
import { LightElement } from "../components/base/light-element.ts";
import { html, nothing } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { api, backendReady, withBase } from "../api/client.ts";
import type { Doc } from "../contracts/config.ts";
import type { MenuItem } from "../components/primitives/navigation/menu.ts";
import type { IconName } from "../components/primitives/media/icon.ts";
import type { PageTransition } from "../components/composed/layout/app-shell.ts";
import { StoreController, preferences, notifications } from "../stores/index.ts";
import "../components/index.ts";
import "./auth-views.ts";
import "./home.ts";
import "./tour.ts";
import "./agent.ts";
import { viewElement } from "./views.ts";
import "./edit-view.ts";
import "./list-view.ts";
import "./command.ts";
import { provideAgentContext, provideTools } from "../agent/webmcp.ts";
import { restoreLocalModel } from "../agent/ai-polyfill.ts";
import { dashboardTools, type AgentHost, type Appearance } from "./agent-tools.ts";
import { asideRail, expandAsideSection, type AsideSection } from "./aside.ts";
import { roleLabel, roleLogins, seedUsers, type SeedUser } from "./demo-users.ts";
import {
  dashboardPath,
  collectionOf,
  config,
  editTabs,
  globalLabel,
  humanize,
  labels,
  navigate,
  rootViews,
  groupIcon,
  settings,
  isDashboardPath,
  parseRoute,
  toast,
  userSlug,
  type Route,
  componentOf,
  dashboardView,
} from "./shared.ts";
import { loadSite, resetSite, site } from "./site.ts";

/**
 * Which of M3's transition patterns moving from one page to another is (`ui-app-shell`'s
 * `pageTransition`): into a record from its list (or anywhere) is forward and back to its list
 * backward, another tab of the same record lateral, and everything else (the navigation's
 * destinations) top-level. Nothing plays when only the query changes.
 */
function pageTransitionOf(from: Route, to: Route): PageTransition | undefined {
  const same = (a: Route, b: Route) => JSON.stringify(a) === JSON.stringify(b);
  if (same(from, to)) return undefined;
  const record = (r: Route) => (r.name === "edit" || r.name === "create" ? r : undefined);
  const a = record(from);
  const b = record(to);
  if (a?.name === "edit" && b?.name === "edit" && a.slug === b.slug && a.id === b.id) {
    const tabs = editTabs(collectionOf(a.slug)!).map((t) => t.key);
    return tabs.indexOf(b.tab ?? "") >= tabs.indexOf(a.tab ?? "") ? "lateral-forward" : "lateral-backward";
  }
  if (b) return "forward";
  if (a && to.name === "list" && to.slug === a.slug) return "backward";
  return "top-level";
}

/**
 * The dashboard: manages the in-browser mock backend's data, like Payload's
 * admin panel (views, URLs, auth flow), generated from src/cms/config.ts and
 * built from `ui-*` components. Served at the site root.
 */

export type Access = Awaited<ReturnType<typeof api.access>>;

const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`;
/** Background photos offered in the header (the `branding` global), with thumbnails. */
const backgrounds = () =>
  site().branding.backgrounds.map(({ path, label }) => ({
    id: path.split("/").pop()!,
    label,
    src: asset(`${path}.jpg`),
    thumb: asset(`${path}-thumb.jpg`),
  }));

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
    const from = this.route;
    this.route = parseRoute(location.pathname);
    void this._guard();
    const kind = pageTransitionOf(from, this.route);
    if (kind) void this.updateComplete.then(() => this._shell?.pageTransition(kind));
  };

  private _onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.composedPath().find((n): n is HTMLAnchorElement => n instanceof HTMLAnchorElement);
    if (!a || a.target === "_blank" || a.hasAttribute("download") || a.origin !== location.origin) return;
    // Links written from the site root (`/collections/…`) belong under the base path too.
    const path = withBase(a.pathname);
    if (!isDashboardPath(path)) return;
    e.preventDefault();
    navigate(path + a.search);
  };

  private async _start() {
    // The downloadable on-device model, if the person chose it on this browser (no Chrome flags).
    void restoreLocalModel();
    try {
      await backendReady();
      await this._refresh();
      this.ready = true;
    } catch (e) {
      this.failure = (e as Error).message;
    }
  }

  private async _refresh() {
    this.user = (await api.me(userSlug)).user;
    // The brand (and, signed in, the assistant) come from the project's data.
    resetSite();
    await loadSite();
    this.access = await api.access();
    await this._guard();
    // The agent's tools follow who's signed in: only what this user may see and do.
    provideTools(dashboardTools(this.#agentHost));
    provideAgentContext(() =>
      this.user
        ? {
            name: text(this.user.name ?? this.user.email),
            role: roleLabel(text(this.user.role)),
            roleId: text(this.user.role),
            page: this._title(),
            path: location.pathname,
          }
        : null,
    );
  }

  /** The running app, as the WebMCP tools see it (./agent-tools.ts): state and actions, never the DOM. */
  #agentHost: AgentHost = {
    user: () => this.user,
    access: () => this.access,
    title: () => this._title(),
    navigation: () => [
      { label: "Home", items: [{ label: "Dashboard", href: dashboardPath() }] },
      ...this._groups().map((g) => ({
        label: g.label,
        items: g.items.map((i) => ({ label: text(i.label), href: i.href })),
      })),
    ],
    switchUser: async (id) => {
      const u = seedUsers.find((x) => x.id === id);
      if (!u) return false;
      await this._switchTo(u);
      return true;
    },
    setPanel: async (panel, open) => {
      await (panel === "aside" ? this._shell?.toggleAside(open) : this._shell?.toggleNav(open));
    },
    appearance: () => ({
      theme: this._controller("theme")?.options() ?? { selected: "", choices: [] },
      scheme: this._controller("scheme")?.options() ?? { selected: "", choices: [] },
      background: this._controller("background")?.options() ?? { selected: "", choices: [] },
    }),
    setAppearance: async (kind, id) => (await this._controller(kind)?.select(id)) ?? false,
  };

  /** The header's theme controllers (signed in only). */
  private _controller(kind: Appearance) {
    return this.querySelector<HTMLElementTagNameMap["ui-appearance"]>(`ui-appearance[kind="${kind}"]`);
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
        <ui-text as="div" variant="title-sm" truncate>${u.name ?? u.email}</ui-text>
        <ui-text as="div" variant="body-sm" color="muted" truncate>${roleLabel(u.role)}</ui-text>
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
      panel-elevation="2"
      trigger-variant="text"
      trigger-shape="round"
      trigger-spaced="false"
      .label=${`Switch user (demo) — signed in as ${text(this.user.name ?? this.user.email)}`}
      .heading=${html`<ui-flex align="center" justify="between" gap="2"
        >Switch user <ui-tag tone="primary">Demo</ui-tag></ui-flex
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
    // Groups in the project's order (`admin.custom.nav.groups`), others after.
    const ORDER = (settings.nav?.groups ?? []).map((g) => g.label);
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
          icon: this._icon(groupIcon(g.label)),
          open: this.#openedGroups.has(g.label),
          children: g.items,
        };
      }),
    ];
  }

  /**
   * The collapsed rail: Dashboard (a page: it links), then one entry per section. A section's icon
   * opens the navigation with that section expanded (`_openSection`), rather than jumping to its
   * first page: what's in it is the choice.
   */
  private _rail(): MenuItem[] {
    return [
      { label: "Dashboard", icon: this._icon("home"), href: dashboardPath(), active: this.route.name === "dashboard" },
      ...this._groups().map((g, i) => ({
        label: g.label,
        icon: this._icon(groupIcon(g.label)),
        active: g.active,
        // Its place in the open navigation (`_menu`: Dashboard first).
        value: { section: g.label, path: [i + 1] },
      })),
    ];
  }

  /** A section's rail icon: open the navigation (pushing or as a sheet) with that section expanded. */
  private async _openSection(section: { section: string; path: number[] }) {
    this.#openedGroups.add(section.section);
    this.requestUpdate();
    await this._shell?.toggleNav(true);
    await this.updateComplete;
    this.querySelector<HTMLElementTagNameMap["ui-menu"]>('ui-menu[slot="nav"]')?.openGroup(section.path);
  }

  private _view() {
    const r = this.route;
    const access = this.access!;
    switch (r.name) {
      case "dashboard": {
        const comp = componentOf(dashboardView()?.Component);
        return (
          (comp && this.user && viewElement(comp.tag, { ...comp.props, access, user: this.user })) ??
          html`<dashboard-home .access=${access}></dashboard-home>`
        );
      }
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
        const comp = componentOf(view.Component);
        return (
          (comp && viewElement(comp.tag, { ...comp.props, access, user: this.user! })) ??
          html`<ui-alert tone="info" heading=${view.meta?.title ?? view.key}>This screen is loading.</ui-alert>`
        );
      }
      case "global":
        return html`<dashboard-edit-view
          .globalSlug=${r.slug}
          .tab=${r.tab ?? ""}
          .access=${access}
          .user=${this.user}
        ></dashboard-edit-view>`;
      case "account":
        return html`<dashboard-edit-view
          .slug=${userSlug}
          .docId=${this.user!.id}
          .access=${access}
        ></dashboard-edit-view>`;
      default:
        return html`<ui-empty-state
          icon="compass"
          heading="Nothing found"
          description="There's no dashboard page at this address."
        >
          <ui-button slot="actions" href=${dashboardPath()} color="primary">Back to the dashboard</ui-button>
        </ui-empty-state>`;
    }
  }

  render() {
    if (this.failure) {
      return html`<ui-container padding-x="4" padding-y="12">
        <ui-alert tone="error" heading="The mock backend couldn't start" .description=${this.failure}></ui-alert>
      </ui-container>`;
    }
    if (!this.ready) {
      return html`<ui-flex justify="center" padding="16"
        ><ui-loading variant="morph" size="lg" color="primary"></ui-loading
      ></ui-flex>`;
    }
    const toaster = html`<ui-snackbar></ui-snackbar>`;
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
        .brand=${site().branding.name}
        .brandIcon=${site().branding.icon as IconName}
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
          <ui-appearance
            kind="background"
            persist
            .credit=${site().branding.backgroundCredit ?? ""}
            .backgrounds=${backgrounds()}
          ></ui-appearance>
          <ui-appearance kind="scheme" persist></ui-appearance>
          <ui-appearance kind="theme" persist></ui-appearance>
          <ui-dropdown
            align="end"
            panel="card"
            panel-elevation="2"
            trigger-variant="text"
            trigger-shape="round"
            trigger-spaced="false"
            .heading=${text(user.name ?? user.email)}
          >
            <ui-avatar slot="trigger" .initials=${initials} size="xs"></ui-avatar>
            <ui-text variant="body-sm" color="muted">${text(user.email)}</ui-text>
            <ui-menu
              width="full"
              surface="false"
              .items=${profile}
              @ui-select=${(e: CustomEvent<{ item: MenuItem }>) => e.detail.item.value === "logout" && this._logout()}
            ></ui-menu>
          </ui-dropdown>
        </ui-flex>
        <ui-menu slot="nav" layout="nav" width="full" surface="false" .items=${this._menu()}></ui-menu>
        <ui-menu
          slot="rail"
          layout="rail"
          surface="false"
          .items=${this._rail()}
          @ui-select=${(e: CustomEvent<{ item: MenuItem }>) => {
            const v = e.detail.item.value as { section: string; path: number[] } | undefined;
            if (v?.section) void this._openSection(v);
          }}
        ></ui-menu>
        ${this._userSwitcher()}
        ${
          site().branding.poweredBy
            ? html`<ui-text slot="footer" variant="body-sm" color="muted"
                >This Demo Powered by <strong>${site().branding.poweredBy}</strong></ui-text
              >`
            : nothing
        }
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
      <ui-contrast-audit></ui-contrast-audit>
      <dashboard-agent></dashboard-agent>
      <dashboard-tour .userId=${user.id} .switchTo=${this._switchToId} .openPanel=${this._openPanel}></dashboard-tour>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-app": DashboardApp;
  }
}
