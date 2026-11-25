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
import { m } from "../i18n/index.ts";
import { collectionOf, dataFields, fieldsOf, formatDate, loadBookmarks, settings, toggleBookmark } from "./shared.ts";
import { loadTours } from "./site.ts";
import { fill } from "./widgets/host.ts";
import type { Widget, WidgetScope } from "./widgets/widget.ts";

export const ASIDE_SECTIONS = [
  { id: "notifications", icon: "bell" },
  { id: "bookmarks", icon: "star" },
  { id: "widgets", icon: "grid" },
  { id: "tours", icon: "compass" },
] as const satisfies readonly { id: string; icon: IconName }[];
export type AsideSection = (typeof ASIDE_SECTIONS)[number]["id"];

export const asideLabel = (id: AsideSection): string =>
  ({
    notifications: m.aside_notifications,
    bookmarks: m.aside_bookmarks,
    widgets: m.aside_widgets,
    tours: m.aside_tours,
  })[id]();

const icon = (name: IconName, count = 0) =>
  count
    ? html`<ui-indicator item=${count > 99 ? "99+" : String(count)} badge="warning" size="xs"
        ><ui-icon name=${name}></ui-icon
      ></ui-indicator>`
    : html`<ui-icon name=${name}></ui-icon>`;

export const asideRail = (unread = 0): MenuItem[] =>
  ASIDE_SECTIONS.map((s) => ({
    label: unread && s.id === "notifications" ? m.aside_notifications_unread({ count: unread }) : asideLabel(s.id),
    icon: icon(s.icon, s.id === "notifications" ? unread : 0),
    value: s.id,
  }));

export type Attention = Record<string, number>;

export const expandAsideSection = (id: AsideSection) =>
  preferences.set((p) => ({ asideCollapsed: (p.asideCollapsed ?? []).filter((x) => x !== id) }));

const NOTIFICATION = "notification:";
const TOUR = "tour:";
const kindField = () => {
  const c = collectionOf("notifications");
  return c ? dataFields(fieldsOf(c)).find((f) => f.name === "kind") : undefined;
};
const kindColor = (kind: string): MenuItem["badgeColor"] => {
  const f = kindField();
  const tone = f?.custom?.tones?.[kind];
  return tone && tone !== "neutral" && tone !== "primary" ? tone : undefined;
};

function attentionCounters(user: Doc) {
  const scope: WidgetScope = { user: user as WidgetScope["user"], params: {} };
  const visible = (list: Widget[]): Widget[] =>
    list.flatMap((w) => {
      if (w.visible && !w.visible(scope)) return [];
      if (w.grid) return visible(w.grid);
      if (w.split) return visible([...w.split.main, ...w.split.side]);
      return [w];
    });
  return visible(settings.aside ?? []).flatMap((w) => {
    const spec = w.counts;
    if (!spec || !("items" in spec)) return [];
    return spec.items
      .filter((x) => x.tone === "warning")
      .map((x) => ({ ...x, collection: x.collection ?? spec.collection, where: fill(x.where, scope) }));
  });
}

const bookmarkKind = (href: string) => {
  const path = href.slice(href.startsWith(DASHBOARD_ROUTE) ? DASHBOARD_ROUTE.length : 0);
  return /^\/collections\/[^/]+\/[^/]+/.test(path)
    ? m.aside_bookmark_record()
    : path.startsWith("/collections/")
      ? m.aside_bookmark_list()
      : path.startsWith("/globals/")
        ? m.aside_bookmark_settings()
        : m.aside_bookmark_screen();
};

const loading = (): MenuItem[] => [{ label: m.aside_loading(), disabled: true }];

@customElement("dashboard-aside")
export class DashboardAside extends LightElement {
  @property({ attribute: false }) access!: Access;
  @property({ attribute: false }) user!: Doc;
  @property() path = "";
  @property() pageTitle = "";
  @state() private tours: Tour[] = [];
  @state() private notifications: MenuItem[] = [];
  @state() private loaded = false;
  @state() private unread = 0;
  #bookmarksFor = "";
  #bookmarks = new StoreController(this, bookmarks);
  #prefs = new StoreController(this, preferences, undefined, { keys: ["asideCollapsed"] });
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
        badge: read ? m.aside_notification_read() : text(n.kind),
        badgeColor: read ? undefined : kindColor(text(n.kind)),
      };
    });
    this.unread = unread.length;

    const flagged = attentionCounters(user);
    const counts = await Promise.all(flagged.map((w) => count(w.collection, w.where as Where)));
    const attention: Attention = {};
    flagged.forEach((w, i) => {
      if (counts[i]) attention[w.collection] = (attention[w.collection] ?? 0) + counts[i];
    });
    this.dispatchEvent(new CustomEvent("dashboard-attention", { detail: attention, bubbles: true }));
    this.tours = await loadTours();
    if (this.#bookmarksFor !== user.id) {
      this.#bookmarksFor = user.id;
      await loadBookmarks();
    }
    this.loaded = true;
    notifications.set({ unread: this.unread });
  }

  private async _open(item: MenuItem) {
    const value = typeof item.value === "string" ? item.value : "";
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
        ? loading()
        : this.notifications.length
          ? this.notifications
          : [{ label: m.aside_caught_up(), disabled: true }],
      bookmarks: marks.length
        ? marks.map((b) => ({
            card: true,
            label: b.label,
            description: bookmarkKind(b.href),
            href: b.href,
            active: b.href === this.path,
          }))
        : [{ label: m.aside_bookmarks_empty(), disabled: true }],
      widgets: [
        {
          content: html`<app-widgets
            board="aside"
            fit
            .page=${{ widgets: settings.aside ?? [] }}
            .user=${this.user}
            .access=${this.access}
          ></app-widgets>`,
        },
      ],
      tours: this.tours.map((t) => {
        const done = this.#tour.value.completed.includes(t.id);
        return {
          card: true,
          label: t.title,
          description: t.summary,
          badge: done ? m.aside_tour_done() : m.aside_tour_steps({ count: t.steps.length }),
          badgeColor: done ? ("success" as const) : undefined,
          value: `${TOUR}${t.id}`,
          active: this.#tour.value.active === t.id,
        };
      }),
    };
    const counts: Partial<Record<AsideSection, number>> = { bookmarks: marks.length };
    return ASIDE_SECTIONS.map((s) => ({
      label: asideLabel(s.id),
      icon: icon(s.id === "bookmarks" && here ? "star-filled" : s.icon, s.id === "notifications" ? this.unread : 0),
      iconAction:
        s.id === "bookmarks"
          ? { label: here ? m.aside_bookmark_remove() : m.aside_bookmark_add(), pressed: here }
          : undefined,
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
      @ui-icon-action=${(e: CustomEvent<{ item: MenuItem }>) =>
        e.detail.item.value === "bookmarks" && void toggleBookmark({ href: this.path, label: this.pageTitle })}
    ></ui-menu>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-aside": DashboardAside;
  }
}
