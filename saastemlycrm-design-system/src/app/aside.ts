import type { Where } from "payload";
import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { DASHBOARD_ROUTE, api } from "../api/client.ts";
import type { Doc, Tour } from "../contracts/config.ts";
import { LightElement } from "../components/base/light-element.ts";
import type { IconName } from "../components/primitives/media/icon.ts";
import type { MenuItem } from "../components/primitives/navigation/menu.ts";
import "../components/index.ts";
import {
  StoreController,
  bookmarks,
  isBookmarked,
  notifications,
  preferences,
  startTour,
  tour,
} from "../stores/index.ts";
import type { Access } from "./app.ts";
import { text } from "../payload/util.ts";
import {
  collectionOf,
  dashboardPath,
  dataFields,
  fieldsOf,
  formatDate,
  loadBookmarks,
  settings,
  toggleBookmark,
} from "./shared.ts";
import { loadTours } from "./site.ts";
import { fill, leaves } from "./widgets/host.ts";
import type { WidgetScope } from "./widgets/widget.ts";

/** The side panel's sections, in order (ids are remembered in `preferences.asideCollapsed`). */
export const ASIDE_SECTIONS = [
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "bookmarks", label: "Bookmarks", icon: "star" },
  { id: "widgets", label: "Widgets", icon: "grid" },
  { id: "tours", label: "Tours", icon: "compass" },
] as const satisfies readonly { id: string; label: string; icon: IconName }[];
export type AsideSection = (typeof ASIDE_SECTIONS)[number]["id"];

/** A section's icon; the bell carries the unread count, so it shows even when the section (or the panel) is closed. */
const icon = (name: IconName, count = 0) =>
  count
    ? html`<ui-indicator item=${count > 99 ? "99+" : String(count)} badge="warning" size="xs"
        ><ui-icon name=${name}></ui-icon
      ></ui-indicator>`
    : html`<ui-icon name=${name}></ui-icon>`;

/** The side panel's rail: one icon per section (selecting one opens the panel on it). */
export const asideRail = (unread = 0): MenuItem[] =>
  ASIDE_SECTIONS.map((s) => ({
    label: unread && s.id === "notifications" ? `${s.label} (${unread})` : s.label,
    icon: icon(s.icon, s.id === "notifications" ? unread : 0),
    value: s.id,
  }));

/** Expands a section (the shell opens the panel itself, choosing push or sheet). */
export const expandAsideSection = (id: AsideSection) =>
  preferences.set((p) => ({ asideCollapsed: (p.asideCollapsed ?? []).filter((x) => x !== id) }));

const BOOKMARK_THIS = "bookmark-this";
const NOTIFICATION = "notification:";
const TOUR = "tour:";
/** A notification kind's badge colour: the tone of its value on the `kind` field (`custom.tones`). */
const kindField = () => {
  const c = collectionOf("notifications");
  return c ? dataFields(fieldsOf(c)).find((f) => f.name === "kind") : undefined;
};
const kindColor = (kind: string): MenuItem["badgeColor"] => {
  const f = kindField();
  const tone = f?.custom?.tones?.[kind];
  return tone && tone !== "neutral" && tone !== "primary" ? tone : undefined;
};

/** The side panel's counters for this user: the `counts` items of `admin.custom.aside` they see. */
function counters(user: Doc) {
  const scope: WidgetScope = { user: user as WidgetScope["user"], params: {} };
  return leaves(settings.aside ?? [], scope).flatMap((w) => {
    const spec = w.counts;
    if (!spec || !("items" in spec)) return [];
    return spec.items.map((x) => ({ ...x, collection: x.collection ?? spec.collection, where: fill(x.where, scope) }));
  });
}

/** A bookmark's kind, from its address: a record, a list, settings or a screen. */
const bookmarkKind = (href: string) => {
  const path = href.slice(href.startsWith(DASHBOARD_ROUTE) ? DASHBOARD_ROUTE.length : 0);
  return /^\/collections\/[^/]+\/[^/]+/.test(path)
    ? "Record"
    : path.startsWith("/collections/")
      ? "List"
      : path.startsWith("/globals/")
        ? "Settings"
        : "Screen";
};

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
  @state() private tours: Tour[] = [];
  @state() private notifications: MenuItem[] = [];
  @state() private widgets: MenuItem[] = [];
  @state() private loaded = false;
  @state() private unread = 0;
  /** Whose bookmarks are in the store. */
  #bookmarksFor = "";
  #bookmarks = new StoreController(this, bookmarks);
  #prefs = new StoreController(this, preferences);
  #tour = new StoreController(this, tour);

  updated(changed: Map<string, unknown>) {
    if (changed.has("path") || changed.has("user")) void this._load();
  }

  private _can = (slug: string) => this.access.collections[slug]?.read.permission === true;

  private async _load() {
    const user = this.user;
    const find = async (slug: string, where: Where, sort?: string, limit = 5): Promise<Doc[]> =>
      this._can(slug) ? (await api.find(slug, { where, sort, limit, depth: 0 }).catch(() => ({ docs: [] }))).docs : [];
    const count = async (slug: string, where: Where) =>
      this._can(slug) ? (await api.count(slug, where).catch(() => ({ totalDocs: 0 }))).totalDocs : 0;

    // Notifications: the signed-in user's own (access returns only theirs), unread first.
    const [unread, recent] = await Promise.all([
      find("notifications", { read: { equals: false } }, "-at", 20),
      find("notifications", { read: { equals: true } }, "-at", 3),
    ]);
    this.notifications = [...unread, ...recent].map((n) => {
      const read = n.read === true;
      return {
        card: true,
        label: text(n.title),
        description: [text(n.detail), formatDate(n.at)].filter(Boolean).join(" · "),
        href: text(n.href) || undefined,
        value: `${NOTIFICATION}${n.id}`,
        badge: read ? "Read" : text(n.kind),
        badgeColor: read ? undefined : kindColor(text(n.kind)),
      };
    });
    this.unread = unread.length;

    // Widgets: the counters this role steers by.
    const widgets = counters(user);
    const counts = await Promise.all(widgets.map((w) => count(w.collection, w.where as Where)));
    this.widgets = widgets.map((w, i) => ({
      card: true,
      label: w.label,
      description: w.note,
      badge: String(counts[i]),
      badgeColor: counts[i] && w.tone === "warning" ? "warning" : undefined,
      href: dashboardPath("collections", w.collection),
    }));
    this.tours = await loadTours();
    // Bookmarks: the signed-in user's own.
    if (this.#bookmarksFor !== user.id) {
      this.#bookmarksFor = user.id;
      await loadBookmarks();
    }
    this.loaded = true;
    notifications.set({ unread: this.unread });
  }

  /** Opening a notification marks it read. */
  private async _open(item: MenuItem) {
    const value = typeof item.value === "string" ? item.value : "";
    if (value === BOOKMARK_THIS) return void toggleBookmark({ href: this.path, label: this.pageTitle });
    if (value.startsWith(TOUR)) return startTour(value.slice(TOUR.length));
    if (!value.startsWith(NOTIFICATION)) return;
    await api.update("notifications", value.slice(NOTIFICATION.length), { read: true }).catch(() => undefined);
    void this._load();
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
        {
          card: true,
          label: here ? "Remove this page" : "Bookmark this page",
          description: here ? "Take it off your bookmarks" : this.pageTitle || undefined,
          value: BOOKMARK_THIS,
        },
        ...marks.map((b) => ({
          card: true,
          label: b.label,
          description: bookmarkKind(b.href),
          href: b.href,
          active: b.href === this.path,
        })),
      ],
      widgets: this.loaded ? this.widgets : loading,
      // Guided tours, with a tick once shown.
      tours: this.tours.map((t) => {
        const done = this.#tour.value.completed.includes(t.id);
        return {
          card: true,
          label: t.title,
          description: t.summary,
          badge: done ? "Done" : `${t.steps.length} steps`,
          badgeColor: done ? ("success" as const) : undefined,
          value: `${TOUR}${t.id}`,
          active: this.#tour.value.active === t.id,
        };
      }),
    };
    // Notifications show their count on the bell; bookmarks next to the label.
    const counts: Partial<Record<AsideSection, number>> = { bookmarks: marks.length };
    return ASIDE_SECTIONS.map((s) => ({
      label: s.label,
      icon: icon(s.icon, s.id === "notifications" ? this.unread : 0),
      value: s.id,
      badge: counts[s.id] || undefined,
      open: !collapsed.includes(s.id),
      children: children[s.id],
    }));
  }

  render() {
    return html`<ui-menu
      layout="nav"
      panes
      width="full"
      surface="false"
      .items=${this._sections()}
      @ui-toggle=${(e: CustomEvent<{ item: MenuItem; open: boolean }>) =>
        this._remember(e.detail.item.value as AsideSection, e.detail.open)}
      @ui-select=${(e: CustomEvent<{ item: MenuItem }>) => void this._open(e.detail.item)}
    ></ui-menu>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-aside": DashboardAside;
  }
}
