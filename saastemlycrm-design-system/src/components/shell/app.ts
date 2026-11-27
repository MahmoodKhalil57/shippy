import { consume } from "@lit/context";
import { text } from "../../lib/payload/util.ts";
import { yieldToMain } from "../../lib/base/work-queue.ts";
import { LightElement } from "../base/light-element.ts";
import { html, nothing } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import type { Doc } from "../../lib/contracts/config.ts";
import type { MenuItem } from "../primitives/navigation/menu.ts";
import type { IconName } from "../primitives/media/icon.ts";
import type { PageTransition } from "../composed/layout/app-shell.ts";
import "../index.ts";
import "../views/auth-views.ts";
import "../views/home.ts";
import "../views/edit-view.ts";
import "../views/list-view.ts";
import "./tour.ts";
import "./agent.ts";
import "./aside.ts";
import "./command.ts";
import { viewElement } from "../../lib/dashboard/view-element.ts";
import { viewWidgets } from "../../lib/widgets/places.ts";
import { dashboardContext, type Access, type Dashboard } from "../../lib/dashboard/context.ts";
import { componentOf, dataFields, fieldsOf, type Route, type SeedUser } from "../../lib/dashboard/project.ts";
import { dashboardTools, type AgentHost, type Appearance } from "../../lib/shell/agent-tools.ts";
import { asideRail, expandAsideSection, type AsideSection, type Attention } from "./aside.ts";
import { Watch } from "../../lib/shell/stores.ts";
import { followLanguage, keepLanguage, m, savedLanguage } from "../../lib/i18n/index.ts";

export type { Access };

const around = (say: (input: string) => string) => say("\u0000").split("\u0000") as [string, string];

export function pageTransitionOf(from: Route, to: Route): PageTransition | undefined {
  if (JSON.stringify(from) === JSON.stringify(to)) return undefined;
  const params = (r: Route) => (r.name === "view" ? Object.keys(r.params).length : 0);
  if (from.name === "view" && to.name === "view" && from.key === to.key) return "lateral-forward";
  if (params(to) > params(from)) return "forward";
  if (params(from) > params(to)) return "backward";
  return "top-level";
}

const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`;

const initialsOf = (user: object) => {
  const u = user as Record<string, unknown>;
  return text(u.initials ?? u.name ?? u.email)
    .slice(0, 2)
    .toUpperCase();
};

@customElement("dashboard-app")
export class DashboardApp extends LightElement {
  @consume({ context: dashboardContext, subscribe: true }) @state() private dashboard!: Dashboard;
  @state() private route: Route = { name: "dashboard" };
  @state() private user: (Doc & { collection: string }) | null = null;
  @state() private access: Access | null = null;
  @state() private ready = false;
  @query("ui-app-shell") private _shell!: HTMLElementTagNameMap["ui-app-shell"];
  @state() private failure = "";
  #prefs = new Watch(this, () => this.dashboard.stores.preferences, ["navOpen", "asideOpen", "navExpanded"]);
  #openedGroups = new Set<string>();
  #unread = new Watch(this, () => this.dashboard.stores.notifications);
  @state() private attention: Attention = {};

  connectedCallback() {
    super.connectedCallback();
    this.route = this._parse();
    window.addEventListener("popstate", this._onRoute);
    this.addEventListener("click", this._onClick);
    this.addEventListener("dashboard-auth", this._onAuth);
    void this._start();
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this._onRoute);
    this.removeEventListener("click", this._onClick);
    this.removeEventListener("dashboard-auth", this._onAuth);
    super.disconnectedCallback();
  }

  private _parse() {
    const { pathname, search } = this.dashboard.address();
    return this.dashboard.project.parseRoute(pathname, search);
  }

  private _onAuth = () => void this._refresh();

  @state() private _leaving = false;
  #turn = 0;
  private _onRoute = async () => {
    const from = this.route;
    const next = this._parse();
    if (next.name === "address" && next.to && this.user)
      return this.dashboard.navigate(`${this.dashboard.project.base}${next.to}`, true);
    const kind = pageTransitionOf(from, next);
    if (kind) {
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
    const { project, navigate } = this.dashboard;
    const path = project.withBase(a.pathname);
    if (!project.isDashboardPath(path)) return;
    e.preventDefault();
    navigate(path + a.search);
  };

  private async _start() {
    void this.dashboard.ai.polyfill.restoreLocalModel();
    try {
      this.ready = await this._refresh();
    } catch (e) {
      this.failure = (e as Error).message;
    }
  }

  #keepLanguage?: () => void;

  private async _refresh() {
    const d = this.dashboard;
    const { project, data } = d;
    const slug = project.userSlug;
    this.user = (await data.me(slug)).user;
    this.#keepLanguage?.();
    this.#keepLanguage = undefined;
    const people = project.collectionOf(slug);
    const user = this.user;
    if (user && people && dataFields(fieldsOf(people)).some((f) => f.name === "language")) {
      const saved = savedLanguage();
      if (!saved && followLanguage(user.language)) return false;
      if (saved && user.language !== saved) void data.update(slug, user.id, { language: saved }).catch(() => undefined);
      this.#keepLanguage = keepLanguage((l) => data.update(slug, user.id, { language: l }));
    }
    this.access = await data.access();
    await this._guard();
    d.ai.webmcp.provideTools(dashboardTools(d, this.#agentHost));
    d.ai.webmcp.provideAgentContext(() =>
      this.user
        ? {
            name: text(this.user.name ?? this.user.email),
            role: project.roleLabel(text(this.user.role)),
            roleId: text(this.user.role),
            page: this._title(),
            path: this.dashboard.address().pathname,
          }
        : null,
    );
    return true;
  }

  #agentHost: AgentHost = {
    user: () => this.user,
    access: () => this.access,
    title: () => this._title(),
    address: () => this.dashboard.address(),
    navigation: () => [
      {
        label: m.app_nav_home(),
        items: [{ label: m.app_nav_dashboard(), href: this.dashboard.project.dashboardPath() }],
      },
      ...this._groups().map((g) => ({
        label: g.label,
        items: g.items.map((i) => ({ label: text(i.label), href: i.href })),
      })),
    ],
    switchUser: async (id) => {
      const u = this.dashboard.project.seedUsers.find((x) => x.id === id);
      if (!u) return false;
      await this._switchTo(u);
      return true;
    },
    setPanel: async (panel, open) => {
      await (panel === "aside" ? this._shell.toggleAside(open) : this._shell.toggleNav(open));
    },
    appearance: () => ({
      theme: this._controller("theme").options(),
      scheme: this._controller("scheme").options(),
      background: this._controller("background").options(),
    }),
    setAppearance: async (kind, id) => this._controller(kind).select(id),
  };

  private _controller(kind: Appearance) {
    return this.querySelector<HTMLElementTagNameMap["ui-appearance"]>(`ui-appearance[kind="${kind}"]`)!;
  }

  private async _guard() {
    const { project, navigate } = this.dashboard;
    const open = this.route.name === "login" || this.route.name === "create-first-user";
    if (!this.user && !open) {
      const { initialized } = await this.dashboard.data.init(project.userSlug);
      navigate(project.dashboardPath(initialized ? "login" : "create-first-user"), true);
    } else if (this.user && open) navigate(project.dashboardPath(), true);
    else if (this.user && this.route.name === "address" && this.route.to)
      navigate(`${project.base}${this.route.to}`, true);
    document.title = `${this._title()} ${project.config.admin?.meta?.titleSuffix ?? m.app_title_suffix()}`;
  }

  private _title() {
    const r = this.route;
    const { project } = this.dashboard;
    if (r.name === "view") return project.titleOfView(project.rootViews().find((x) => x.key === r.key)!);
    if (r.name === "address" || r.name === "not-found") return m.app_title_not_found();
    const titles: Record<"dashboard" | "login" | "create-first-user" | "account", () => string> = {
      dashboard: () => m.app_nav_dashboard(),
      login: () => m.app_title_login(),
      "create-first-user": () => m.app_title_create_first_user(),
      account: () => m.app_title_account(),
    };
    return titles[r.name]();
  }

  private _switchToId = async (id: string) => {
    const u = this.dashboard.project.seedUsers.find((x) => x.id === id);
    if (u) await this._switchTo(u, true);
  };

  private _openPanel = async (panel: "aside" | "nav") => {
    await (panel === "aside" ? this._shell.toggleAside(true) : this._shell.toggleNav(true));
  };

  private async _switchTo(u: SeedUser, quiet = false) {
    if (u.email === this.user?.email) return;
    const { project, data, notify } = this.dashboard;
    try {
      await data.login(project.userSlug, u.email, u.password);
      if (!quiet) notify(m.app_switched_user({ name: u.name ?? u.email, role: project.roleLabel(u.role) }), "info");
      await this._refresh();
    } catch (e) {
      notify(m.app_switch_user_failed({ name: u.name ?? u.email, error: (e as Error).message }), "error");
    }
  }

  private _userSwitcher(user: Doc, expanded: boolean) {
    const { project } = this.dashboard;
    if (!project.roleLogins.length) return nothing;
    const items: MenuItem[] = project.roleLogins.map((u) => ({
      icon: html`<ui-avatar size="xs" .initials=${initialsOf(u)}></ui-avatar>`,
      label: html`<ui-flex direction="col" gap="0" shrink>
        <ui-text as="div" variant="title-sm" truncate>${u.name ?? u.email}</ui-text>
        <ui-text as="div" variant="body-sm" color="muted" truncate>${project.roleLabel(u.role)}</ui-text>
      </ui-flex>`,
      active: u.email === user.email,
      value: u.email,
    }));
    const name = text(user.name ?? user.email);
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
        .label=${`${initialsOf(user)} · ${m.app_switch_user_label({ name })}`}
        .heading=${html`<ui-flex align="center" justify="between" gap="2"
          >${m.app_switch_user_heading()} <ui-tag tone="primary">${m.app_demo_tag()}</ui-tag></ui-flex
        >`}
      >
        <ui-avatar slot="trigger" size="xs" .initials=${initialsOf(user)}></ui-avatar>
        <ui-menu
          width="full"
          surface="false"
          nowrap
          .items=${items}
          @ui-select=${(e: CustomEvent<{ item: MenuItem }>) =>
            void this._switchTo(project.roleLogins.find((x) => x.email === e.detail.item.value)!)}
        ></ui-menu> </ui-dropdown
      >${
        expanded
          ? html`<ui-flex direction="col" gap="0" fill>
              <ui-text as="div" variant="label-lg" align="start" truncate>${name}</ui-text>
              <ui-text as="div" variant="body-sm" color="muted" align="start" truncate
                >${project.roleLabel(text(user.role))}</ui-text
              >
            </ui-flex>`
          : nothing
      }</ui-flex
    >`;
  }

  private async _logout() {
    const { project, data, notify } = this.dashboard;
    await data.logout(project.userSlug);
    notify(m.app_logged_out(), "info");
    await this._refresh();
  }

  private _groups() {
    const { project } = this.dashboard;
    const { pathname } = this.dashboard.address();
    const here = (path: string) => pathname === path || pathname.startsWith(`${path}/`);
    const groups = new Map<string, MenuItem[]>();
    const access = this.access!;
    for (const v of project.rootViews()) {
      const nav = project.navOf(v);
      if (!nav || v.path.includes(":")) continue;
      const shown = viewWidgets(v);
      const slugs = shown.flatMap((w) => (w.collection ? [w.collection.collection] : []));
      const globals = shown.flatMap((w) => (w.global ? [w.global.global] : []));
      const readable =
        slugs.some((c) => access.collections[c]?.read.permission !== false) ||
        globals.some((g) => access.globals[g]?.read.permission !== false);
      if ((slugs.length || globals.length) && !readable) continue;
      const href = project.dashboardPath(...v.path.slice(1).split("/"));
      const count = slugs.reduce((n, c) => n + (this.attention[c] ?? 0), 0);
      const badge = count ? { badge: String(count), badgeColor: "warning" as const } : {};
      groups.set(nav.group, [
        ...(groups.get(nav.group) ?? []),
        { label: nav.label, href, active: here(href), ...badge },
      ]);
    }
    const order = (project.settings.nav?.groups ?? []).map((g) => g.label);
    const rank = (g: string) => (order.indexOf(g) + 1 || order.length) - 1;
    return [...groups]
      .sort(([a], [b]) => rank(a) - rank(b))
      .map(([label, items]) => ({ label, items, active: items.some((i) => i.active) }));
  }

  private _icon = (name: IconName) => html`<ui-icon name=${name}></ui-icon>`;

  private _groupIcon(label: string, attention: boolean) {
    const name = this.dashboard.project.groupIcon(label);
    return attention
      ? html`<ui-indicator
          ><ui-badge slot="item" dot tone="warning" label=${m.app_needs_attention()}></ui-badge
          ><ui-icon name=${name}></ui-icon
        ></ui-indicator>`
      : this._icon(name);
  }

  private _nav(): { menu: MenuItem[]; rail: MenuItem[] } {
    const { project } = this.dashboard;
    const dashboard: MenuItem = {
      label: m.app_nav_dashboard(),
      icon: this._icon("home"),
      href: project.dashboardPath(),
      active: this.route.name === "dashboard",
    };
    const menu: MenuItem[] = [dashboard];
    const rail: MenuItem[] = [dashboard];
    const sections = new Map((project.settings.nav?.groups ?? []).map((g) => [g.label, g.section]));
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
    await this._shell.toggleNav(true);
    await this.updateComplete;
    this.querySelector<HTMLElementTagNameMap["ui-menu"]>('ui-menu[slot="nav"]')!.openGroup(section.path);
  }

  private _view(user: Doc & { collection: string }, access: Access) {
    const r = this.route;
    const { project } = this.dashboard;
    switch (r.name) {
      case "dashboard": {
        const comp = componentOf(project.dashboardView()?.Component);
        return (
          (comp && viewElement(comp.tag, { ...comp.props, access, user })) ??
          html`<dashboard-home .access=${access}></dashboard-home>`
        );
      }
      case "view": {
        const view = project.rootViews().find((v) => v.key === r.key)!;
        const comp = componentOf(view.Component);
        return (
          (comp && viewElement(comp.tag, { ...comp.props, params: r.params, access, user })) ??
          html`<ui-alert tone="info" heading=${project.titleOfView(view)}>${m.app_view_loading()}</ui-alert>`
        );
      }
      case "account":
        return html`<dashboard-edit-view
          .slug=${project.userSlug}
          .docId=${user.id}
          .access=${access}
        ></dashboard-edit-view>`;
      default:
        return html`<ui-empty-state
          icon="compass"
          heading=${m.app_not_found_heading()}
          description=${m.app_not_found_description()}
        >
          <ui-button slot="actions" href=${project.dashboardPath()} color="primary"
            >${m.app_not_found_back()}</ui-button
          >
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
    const user = this.user;
    if (!user) {
      return html`${
        this.route.name === "create-first-user"
          ? html`<dashboard-first-user></dashboard-first-user>`
          : html`<dashboard-login></dashboard-login>`
      }${toaster}`;
    }

    const d = this.dashboard;
    const { project, site } = d;
    const { branding } = site;
    const access = this.access!;
    const path = this.dashboard.address().pathname;
    const title = this._title();
    const profile: MenuItem[] = [
      { label: m.app_title_account(), href: project.dashboardPath("account"), active: this.route.name === "account" },
      { label: m.app_log_out(), value: "logout" },
    ];
    const { navOpen, asideOpen, navExpanded } = this.#prefs.value;
    const nav = this._nav();
    const backgrounds = branding.backgrounds.map(({ path: file, label }) => ({
      id: file.split("/").pop()!,
      label,
      src: asset(`${file}.jpg`),
      thumb: asset(`${file}-thumb.jpg`),
    }));
    const [poweredBefore, poweredAfter] = around((name) => m.app_powered_by({ name }));
    return html`
      <ui-app-shell
        .brand=${branding.name}
        .brandIcon=${branding.icon as IconName}
        brand-href=${project.dashboardPath()}
        .navExpanded=${navExpanded}
        ?aside-open=${asideOpen}
        aside-label=${m.app_side_panel()}
        @dashboard-attention=${(e: CustomEvent<Attention>) => (this.attention = e.detail)}
        @ui-change=${(e: CustomEvent<{ nav: boolean; aside: boolean; expanded?: boolean }>) => {
          if (e.target !== e.currentTarget) return;
          const { nav: navOpen, aside: asideOpen, expanded } = e.detail;
          d.stores.preferences.set({
            navOpen,
            asideOpen,
            ...(expanded === undefined ? {} : { navExpanded: expanded }),
          });
        }}
      >
        <dashboard-command
          slot="search"
          .access=${access}
          .path=${path}
          .pageTitle=${title}
          .onLogout=${() => void this._logout()}
        ></dashboard-command>
        <ui-appearance
          slot="actions"
          kind="background"
          persist
          data-fold
          .credit=${branding.backgroundCredit ?? ""}
          .backgrounds=${backgrounds}
        ></ui-appearance>
        <ui-appearance slot="actions" kind="scheme" persist data-fold></ui-appearance>
        <ui-appearance slot="actions" kind="theme" persist data-fold></ui-appearance>
        <ui-appearance slot="actions" kind="language" data-fold></ui-appearance>
        <ui-appearance
          slot="actions"
          kind="all"
          persist
          data-fold-only
          .credit=${branding.backgroundCredit ?? ""}
          .backgrounds=${backgrounds}
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
          <ui-avatar slot="trigger" .initials=${text(user.initials ?? user.email).slice(0, 2)} size="xs"></ui-avatar>
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
            if (v) void this._openSection(v);
          }}
        ></ui-menu>
        ${this._userSwitcher(user, navOpen)}
        ${
          branding.poweredBy
            ? html`<ui-text slot="footer" variant="body-sm" color="muted"
                >${poweredBefore}<strong><bdi>${branding.poweredBy}</bdi></strong
                >${poweredAfter}</ui-text
              >`
            : nothing
        }
        <ui-menu
          slot="aside-rail"
          layout="rail"
          surface="false"
          .items=${asideRail(this.#unread.value.unread)}
          @ui-select=${(e: CustomEvent<{ item: MenuItem }>) => {
            expandAsideSection(d, e.detail.item.value as AsideSection);
            void this._shell.toggleAside(true);
          }}
        ></ui-menu>
        <dashboard-aside
          slot="aside"
          .access=${access}
          .user=${user}
          .path=${path}
          .pageTitle=${title}
        ></dashboard-aside>
        <ui-container width="full" padding-x="slack" padding-y="half"
          >${keyed(user.id, this._leaving ? nothing : this._view(user, access))}</ui-container
        >
      </ui-app-shell>
      ${toaster}
      <ui-contrast-audit></ui-contrast-audit>
      <dashboard-agent></dashboard-agent>
      <dashboard-tour
        .userId=${user.id}
        .path=${path}
        .switchTo=${this._switchToId}
        .openPanel=${this._openPanel}
      ></dashboard-tour>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-app": DashboardApp;
  }
}
