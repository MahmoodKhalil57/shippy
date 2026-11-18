import type { Where } from "payload";
import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../cms/client.ts";
import type { Doc } from "../../cms/types.ts";
import { LightElement } from "../../components/base/light-element.ts";
import type { IconName } from "../../components/primitives/media/icon.ts";
import type { MenuItem } from "../../components/primitives/navigation/menu.ts";
import "../../components/index.ts";
import { StoreController, bookmarks, isBookmarked, preferences, toggleBookmark } from "../../stores/index.ts";
import type { Access } from "./app.ts";
import { dashboardPath, formatDate } from "./shared.ts";

/** The side panel's sections, in order (ids are remembered in `preferences.asideCollapsed`). */
export const ASIDE_SECTIONS = [
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "bookmarks", label: "Bookmarks", icon: "star" },
  { id: "widgets", label: "Widgets", icon: "grid" },
] as const satisfies readonly { id: string; label: string; icon: IconName }[];
export type AsideSection = (typeof ASIDE_SECTIONS)[number]["id"];

const icon = (name: IconName) => html`<ui-icon name=${name}></ui-icon>`;

/** The side panel's rail: one icon per section (selecting one opens the panel on it). */
export const asideRail = (): MenuItem[] =>
  ASIDE_SECTIONS.map((s) => ({ label: s.label, icon: icon(s.icon), value: s.id }));

/** Expands a section (the shell opens the panel itself, choosing push or sheet). */
export const expandAsideSection = (id: AsideSection) =>
  preferences.set((p) => ({ asideCollapsed: (p.asideCollapsed ?? []).filter((x) => x !== id) }));

const BOOKMARK_THIS = "bookmark-this";
const loading: MenuItem[] = [{ label: "Loading…", disabled: true }];

/**
 * The dashboard's side panel, built like the navigation: a `<ui-menu layout="nav">` whose groups
 * are the sections (notifications, bookmarks, widgets). Its rail is `asideRail()`.
 */
@customElement("dashboard-aside")
export class DashboardAside extends LightElement {
  @property({ attribute: false }) access!: Access;
  @property({ attribute: false }) user!: Doc;
  /** Current location (path + title); changing it refreshes the panel. */
  @property() path = "";
  @property() pageTitle = "";
  @state() private notifications: MenuItem[] = [];
  @state() private widgets: MenuItem[] = [];
  @state() private loaded = false;
  #bookmarks = new StoreController(this, bookmarks);
  #prefs = new StoreController(this, preferences);

  updated(changed: Map<string, unknown>) {
    if (changed.has("path") || changed.has("user")) void this._load();
  }

  private _can = (slug: string) => this.access.collections[slug]?.read.permission === true;

  private async _load() {
    const link = (slug: string, id: string) => dashboardPath("collections", slug, id);
    const find = async (slug: string, where: Where, sort?: string, limit = 5): Promise<Doc[]> =>
      this._can(slug) ? (await api.find(slug, { where, sort, limit, depth: 0 }).catch(() => ({ docs: [] }))).docs : [];
    const count = async (slug: string, where: Where) =>
      this._can(slug) ? (await api.count(slug, where).catch(() => ({ totalDocs: 0 }))).totalDocs : 0;

    const [approvals, alerts, exceptions] = await Promise.all([
      find("approvals", { status: { not_in: ["Approved", "Rejected"] } }, "-createdAt"),
      find("activities", { kind: { equals: "alert" } }, "-at"),
      find("integration-exceptions", { status: { in: ["Open", "Waiting for review"] } }, "-occurredAt"),
    ]);
    this.notifications = [
      ...approvals.map((a) => ({
        label: String(a.title),
        href: link("approvals", a.id),
        badge: "Approval",
        badgeColor: "warning" as const,
      })),
      ...exceptions.map((x) => ({
        label: String(x.summary),
        href: link("integration-exceptions", x.id),
        badge: String(x.source),
        badgeColor: "error" as const,
      })),
      ...alerts.map((a) => ({ label: String(a.text), href: link("activities", a.id), badge: formatDate(a.at) })),
    ];

    const [openCases, awaitingSupplier, myTasks, pending] = await Promise.all([
      count("cases", { stage: { not_in: ["Lost", "Expired", "Closed — settled"] } }),
      count("cases", { wait: { equals: "Awaiting supplier" } }),
      count("tasks", { and: [{ owner: { equals: this.user.id } }, { status: { equals: "Open" } }] }),
      count("approvals", { status: { not_in: ["Approved", "Rejected"] } }),
    ]);
    this.widgets = [
      { label: "Open cases", badge: String(openCases), href: dashboardPath("collections", "cases") },
      { label: "Awaiting supplier", badge: String(awaitingSupplier), href: dashboardPath("collections", "cases") },
      { label: "My open tasks", badge: String(myTasks), href: dashboardPath("collections", "tasks") },
      {
        label: "Pending approvals",
        badge: String(pending),
        badgeColor: pending ? "warning" : undefined,
        href: dashboardPath("collections", "approvals"),
      },
    ];
    this.loaded = true;
  }

  private _remember(id: AsideSection, open: boolean) {
    preferences.set((p) => {
      const rest = (p.asideCollapsed ?? []).filter((x) => x !== id);
      return { asideCollapsed: open ? rest : [...rest, id] };
    });
  }

  private _sections(): MenuItem[] {
    const collapsed = this.#prefs.value.asideCollapsed ?? [];
    const here = isBookmarked(this.path);
    const marks = this.#bookmarks.value.items;
    const children: Record<AsideSection, MenuItem[]> = {
      notifications: !this.loaded
        ? loading
        : this.notifications.length
          ? this.notifications
          : [{ label: "You're all caught up", disabled: true }],
      bookmarks: [
        { label: here ? "Remove this page" : "Bookmark this page", value: BOOKMARK_THIS },
        ...marks.map((b) => ({ label: b.label, href: b.href, active: b.href === this.path })),
      ],
      widgets: this.loaded ? this.widgets : loading,
    };
    const counts: Partial<Record<AsideSection, number>> = {
      notifications: this.notifications.length,
      bookmarks: marks.length,
    };
    return ASIDE_SECTIONS.map((s) => ({
      label: s.label,
      icon: icon(s.icon),
      value: s.id,
      badge: counts[s.id] || undefined,
      badgeColor: s.id === "notifications" ? ("warning" as const) : undefined,
      open: !collapsed.includes(s.id),
      children: children[s.id],
    }));
  }

  render() {
    return html`<ui-menu
      layout="nav"
      width="full"
      surface="false"
      .items=${this._sections()}
      @ui-toggle=${(e: CustomEvent<{ item: MenuItem; open: boolean }>) =>
        this._remember(e.detail.item.value as AsideSection, e.detail.open)}
      @ui-select=${(e: CustomEvent<{ item: MenuItem }>) =>
        e.detail.item.value === BOOKMARK_THIS && toggleBookmark({ href: this.path, label: this.pageTitle })}
    ></ui-menu>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-aside": DashboardAside;
  }
}
