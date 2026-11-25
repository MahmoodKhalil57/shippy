import { text } from "../payload/util.ts";
import { yieldToMain } from "../components/base/work-queue.ts";
import { LightElement } from "../components/base/light-element.ts";
import { html, nothing } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { DASHBOARD_ROUTE, api, backendReady, withBase } from "../api/client.ts";
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
import { viewWidgets } from "./widgets/places.ts";
import "./edit-view.ts";
import "./list-view.ts";
import "./command.ts";
import { provideAgentContext, provideTools } from "../agent/webmcp.ts";
import { restoreLocalModel } from "../agent/ai-polyfill.ts";
import { dashboardTools, type AgentHost, type Appearance } from "./agent-tools.ts";
import { asideRail, expandAsideSection, type AsideSection, type Attention } from "./aside.ts";
import { roleLabel, roleLogins, seedUsers, type SeedUser } from "./demo-users.ts";
import {
  dashboardPath,
  config,
  humanize,
  navigate,
  navOf,
  rootViews,
  titleOfView,
  groupIcon,
  settings,
  isDashboardPath,
  parseRoute,
  toast,
  userSlug,
  type Route,
  collectionOf,
  componentOf,
  dashboardView,
  dataFields,
  fieldsOf,
} from "./shared.ts";
import { loadSite, resetSite, site } from "./site.ts";
import { followLanguage, keepLanguage, m, savedLanguage } from "../i18n/index.ts";

const around = (say: (input: string) => string) => say("\u0000").split("\u0000") as [string, string];

function pageTransitionOf(from: Route, to: Route): PageTransition | undefined {
  const same = (a: Route, b: Route) => JSON.stringify(a) === JSON.stringify(b);
  if (same(from, to)) return undefined;
  const params = (r: Route) => (r.name === "view" ? Object.keys(r.params).length : 0);
  if (from.name === "view" && to.name === "view" && from.key === to.key) return "lateral-forward";
  if (params(to) > params(from)) return "forward";
  if (params(from) > params(to)) return "backward";
  return "top-level";
}

export type Access = Awaited<ReturnType<typeof api.access>>;

const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`;
const backgrounds = () =>
  site().branding.backgrounds.map(({ path, label }) => ({
    id: path.split("/").pop()!,
    label,
    src: asset(`${path}.jpg`),
    thumb: asset(`${path}-thumb.jpg`),
  }));

@customElement("dashboard-app")
export class DashboardApp extends LightElement {
  @state() private route: Route = parseRoute(location.pathname, location.search);
  @state() private user: (Doc & { collection: string }) | null = null;
  @state() private access: Access | null = null;
  @state() private ready = false;
  @query("ui-app-shell") private _shell?: HTMLElementTagNameMap["ui-app-shell"];
  @state() private failure = "";
  #prefs = new StoreController(this, preferences, undefined, { keys: ["navOpen", "asideOpen", "navExpanded"] });
  #openedGroups = new Set<string>();
  #unread = new StoreController(this, notifications);
  @state() private attention: Attention = {};

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("popstate", this._onRoute);
    this.addEventListener("click", this._onClick);
    this.addEventListener("dashboard-auth", () => void this._refresh());
    void this._start();
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this._onRoute);
    super.disconnectedCallback();
  }

  @state() private _leaving = false;
  #turn = 0;
  private _onRoute = async () => {
    const from = this.route;
    const next = parseRoute(location.pathname, location.search);
    if (next.name === "address" && next.to && this.user) return navigate(`${DASHBOARD_ROUTE}${next.to}`, true);
    const kind = pageTransitionOf(from, next);
    if (JSON.stringify(from) !== JSON.stringify(next)) {
      const turn = ++this.#turn;
      this._leaving = true;
      await this.updateComplete;
      await yieldToMain();
      if (turn !== this.#turn) return;
    }
    this._leaving = false;
    this.route = next;
    void this._guard();
    if (kind) void this.updateComplete.then(() => this._shell?.pageTransition(kind));
  };

  private _onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.composedPath().find((n): n is HTMLAnchorElement => n instanceof HTMLAnchorElement);
    if (!a || a.target === "_blank" || a.hasAttribute("download") || a.origin !== location.origin) return;
    const path = withBase(a.pathname);
    if (!isDashboardPath(path)) return;
    e.preventDefault();
    navigate(path + a.search);
  };

  private async _start() {
    void restoreLocalModel();
    try {
      await backendReady();
      await this._refresh();
      this.ready = true;
    } catch (e) {
      this.failure = (e as Error).message;
    }
  }

  #keepLanguage?: () => void;

  private async _refresh() {
    this.user = (await api.me(userSlug)).user;
    this.#keepLanguage?.();
    this.#keepLanguage = undefined;
    const people = collectionOf(userSlug);
    const user = this.user;
    if (user && people && dataFields(fieldsOf(people)).some((f) => f.name === "language")) {
      const saved = savedLanguage();
      if (!saved && followLanguage(user.language)) return;
      if (saved && user.language !== saved)
        void api.update(userSlug, user.id, { language: saved }).catch(() => undefined);
      this.#keepLanguage = keepLanguage((l) => api.update(userSlug, user.id, { language: l }));
    }
    resetSite();
    await loadSite();
    this.access = await api.access();
    await this._guard();
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

  #agentHost: AgentHost = {
    user: () => this.user,
    access: () => this.access,
    title: () => this._title(),
    navigation: () => [
      { label: m.app_nav_home(), items: [{ label: m.app_nav_dashboard(), href: dashboardPath() }] },
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

  private _controller(kind: Appearance) {
    return this.querySelector<HTMLElementTagNameMap["ui-appearance"]>(`ui-appearance[kind="${kind}"]`);
  }

  private async _guard() {
    const open = this.route.name === "login" || this.route.name === "create-first-user";
    if (!this.user && !open) {
      const { initialized } = await api.init(userSlug);
      navigate(dashboardPath(initialized ? "login" : "create-first-user"), true);
    } else if (this.user && open) navigate(dashboardPath(), true);
    else if (this.user && this.route.name === "address" && this.route.to)
      navigate(`${DASHBOARD_ROUTE}${this.route.to}`, true);
    document.title = `${this._title()} ${config.admin?.meta?.titleSuffix ?? m.app_title_suffix()}`;
  }

  private _title() {
    const r = this.route;
    if (r.name === "view") {
      const v = rootViews().find((x) => x.key === r.key);
      return v ? titleOfView(v) : humanize(r.key);
    }
    if (r.name === "address" || r.name === "not-found") return m.app_title_not_found();
    const titles: Record<string, () => string> = {
      dashboard: () => m.app_nav_dashboard(),
      login: () => m.app_title_login(),
      "create-first-user": () => m.app_title_create_first_user(),
      account: () => m.app_title_account(),
    };
    return titles[r.name]?.() ?? humanize(r.name);
  }

  private _switchToId = async (id: string) => {
    const u = seedUsers.find((x) => x.id === id);
    if (u) await this._switchTo(u, true);
  };

  private _openPanel = async (panel: "aside" | "nav") => {
    await (panel === "aside" ? this._shell?.toggleAside(true) : this._shell?.toggleNav(true));
  };

  private async _switchTo(u: SeedUser, quiet = false) {
    if (u.email === this.user?.email) return;
    try {
      await api.login(userSlug, u.email, u.password);
      if (!quiet) toast(m.app_switched_user({ name: u.name ?? u.email, role: roleLabel(u.role) }), "info");
      await this._refresh();
    } catch (e) {
      toast(m.app_switch_user_failed({ name: u.name ?? u.email, error: (e as Error).message }), "error");
    }
  }

  private _userSwitcher(expanded: boolean) {
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
    return html`<ui-flex slot="nav-footer" align="center" gap="2"
      ><ui-dropdown
        mode="popover"
        side="top"
        align="start"
        panel="card"
        panel-width="6"
        panel-elevation="2"
        trigger-variant="text"
        trigger-shape="round"
        trigger-spaced="false"
        .label=${m.app_switch_user_label({ name: text(this.user.name ?? this.user.email) })}
        .heading=${html`<ui-flex align="center" justify="between" gap="2"
          >${m.app_switch_user_heading()} <ui-tag tone="primary">${m.app_demo_tag()}</ui-tag></ui-flex
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
        ></ui-menu> </ui-dropdown
      >${
        expanded
          ? html`<ui-flex direction="col" gap="0" fill>
              <ui-text as="div" variant="label-lg" align="start" truncate
                >${text(this.user.name ?? this.user.email)}</ui-text
              >
              <ui-text as="div" variant="body-sm" color="muted" align="start" truncate
                >${roleLabel(text(this.user.role))}</ui-text
              >
            </ui-flex>`
          : nothing
      }</ui-flex
    >`;
  }

  private async _logout() {
    await api.logout(userSlug);
    toast(m.app_logged_out(), "info");
    await this._refresh();
  }

  private _groups() {
    const here = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);
    const groups = new Map<string, MenuItem[]>();
    for (const v of rootViews()) {
      const nav = navOf(v);
      if (!nav || v.path.includes(":")) continue;
      const shown = viewWidgets(v);
      const slugs = shown.flatMap((w) => (w.collection ? [w.collection.collection] : []));
      const globals = shown.flatMap((w) => (w.global ? [w.global.global] : []));
      const readable =
        slugs.some((c) => this.access?.collections[c]?.read.permission !== false) ||
        globals.some((g) => this.access?.globals[g]?.read.permission !== false);
      if ((slugs.length || globals.length) && !readable) continue;
      const href = dashboardPath(v.path.slice(1));
      const count = slugs.reduce((n, c) => n + (this.attention[c] ?? 0), 0);
      const badge = count ? { badge: String(count), badgeColor: "warning" as const } : {};
      groups.set(nav.group, [
        ...(groups.get(nav.group) ?? []),
        { label: nav.label, href, active: here(href), ...badge },
      ]);
    }
    const ORDER = (settings.nav?.groups ?? []).map((g) => g.label);
    const rank = (g: string) => (ORDER.indexOf(g) + 1 || ORDER.length) - 1;
    return [...groups]
      .sort(([a], [b]) => rank(a) - rank(b))
      .map(([label, items]) => ({ label, items, active: items.some((i) => i.active) }));
  }

  private _icon = (name: IconName) => html`<ui-icon name=${name}></ui-icon>`;

  private _groupIcon(label: string, attention: boolean) {
    const name = groupIcon(label);
    return attention
      ? html`<ui-indicator
          ><ui-badge slot="item" dot tone="warning" label=${m.app_needs_attention()}></ui-badge
          ><ui-icon name=${name}></ui-icon
        ></ui-indicator>`
      : this._icon(name);
  }

  private _nav(): { menu: MenuItem[]; rail: MenuItem[] } {
    const dashboard: MenuItem = {
      label: m.app_nav_dashboard(),
      icon: this._icon("home"),
      href: dashboardPath(),
      active: this.route.name === "dashboard",
    };
    const menu: MenuItem[] = [dashboard];
    const rail: MenuItem[] = [dashboard];
    const sections = new Map((settings.nav?.groups ?? []).map((g) => [g.label, g.section]));
    let section: string | undefined;
    for (const g of this._groups()) {
      const heading = sections.get(g.label);
      if (heading && heading !== section) {
        menu.push({ label: heading, heading: true });
        rail.push({ label: heading, heading: true });
      }
      section = heading;
      if (g.active) this.#openedGroups.add(g.label);
      const attention = g.items.some((i) => i.badge != null);
      rail.push({
        label: g.label,
        icon: this._groupIcon(g.label, attention),
        active: g.active,
        value: { section: g.label, path: [menu.length] },
      });
      menu.push({
        label: g.label,
        icon: this._groupIcon(g.label, attention),
        open: this.#openedGroups.has(g.label),
        children: g.items,
      });
    }
    return { menu, rail };
  }

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
      case "view": {
        const view = rootViews().find((v) => v.key === r.key)!;
        const comp = componentOf(view.Component);
        return (
          (comp && viewElement(comp.tag, { ...comp.props, params: r.params, access, user: this.user! })) ??
          html`<ui-alert tone="info" heading=${titleOfView(view)}>${m.app_view_loading()}</ui-alert>`
        );
      }
      case "account":
        return html`<dashboard-edit-view
          .slug=${userSlug}
          .docId=${this.user!.id}
          .access=${access}
        ></dashboard-edit-view>`;
      default:
        return html`<ui-empty-state
          icon="compass"
          heading=${m.app_not_found_heading()}
          description=${m.app_not_found_description()}
        >
          <ui-button slot="actions" href=${dashboardPath()} color="primary">${m.app_not_found_back()}</ui-button>
        </ui-empty-state>`;
    }
  }

  render() {
    if (this.failure) {
      return html`<ui-container padding-x="4" padding-y="12">
        <ui-alert tone="error" heading=${m.app_backend_failed()} .description=${this.failure}></ui-alert>
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
      { label: m.app_title_account(), href: dashboardPath("account"), active: this.route.name === "account" },
      { label: m.app_log_out(), value: "logout" },
    ];
    const { navOpen, asideOpen, navExpanded } = this.#prefs.value;
    const nav = this._nav();
    return html`
      <ui-app-shell
        .brand=${site().branding.name}
        .brandIcon=${site().branding.icon as IconName}
        brand-href=${dashboardPath()}
        .navExpanded=${navExpanded}
        ?aside-open=${asideOpen}
        aside-label=${m.app_side_panel()}
        @dashboard-attention=${(e: CustomEvent<Attention>) => (this.attention = e.detail)}
        @ui-change=${(e: CustomEvent<{ nav: boolean; aside: boolean; expanded?: boolean }>) => {
          if (e.target !== e.currentTarget) return;
          const { nav: navOpen, aside: asideOpen, expanded } = e.detail;
          preferences.set({ navOpen, asideOpen, ...(expanded === undefined ? {} : { navExpanded: expanded }) });
        }}
      >
        <dashboard-command
          slot="search"
          .access=${this.access}
          .path=${location.pathname}
          .pageTitle=${this._title()}
          .onLogout=${() => void this._logout()}
        ></dashboard-command>
        <!-- On a header too narrow for four buttons, one menu holds them (the frame folds them). -->
        <ui-appearance
          slot="actions"
          kind="background"
          persist
          data-fold
          .credit=${site().branding.backgroundCredit ?? ""}
          .backgrounds=${backgrounds()}
        ></ui-appearance>
        <ui-appearance slot="actions" kind="scheme" persist data-fold></ui-appearance>
        <ui-appearance slot="actions" kind="theme" persist data-fold></ui-appearance>
        <ui-appearance slot="actions" kind="language" data-fold></ui-appearance>
        <ui-appearance
          slot="actions"
          kind="all"
          persist
          data-fold-only
          .credit=${site().branding.backgroundCredit ?? ""}
          .backgrounds=${backgrounds()}
        ></ui-appearance>
        <ui-dropdown
          slot="actions"
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
        <ui-menu slot="nav" layout="nav" width="full" surface="false" .items=${nav.menu}></ui-menu>
        <ui-menu
          slot="rail"
          layout="rail"
          surface="false"
          .items=${nav.rail}
          @ui-select=${(e: CustomEvent<{ item: MenuItem }>) => {
            const v = e.detail.item.value as { section: string; path: number[] } | undefined;
            if (v?.section) void this._openSection(v);
          }}
        ></ui-menu>
        ${this._userSwitcher(navOpen)}
        ${
          site().branding.poweredBy
            ? html`<ui-text slot="footer" variant="body-sm" color="muted"
                >${around((name) => m.app_powered_by({ name }))[0]}<strong
                  ><bdi>${site().branding.poweredBy}</bdi></strong
                >${around((name) => m.app_powered_by({ name }))[1]}</ui-text
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
        <ui-container width="full" padding-x="slack" padding-y="half"
          >${keyed(user.id, this._leaving ? nothing : this._view())}</ui-container
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
