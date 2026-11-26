import { consume } from "@lit/context";
import type { Where } from "payload";
import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Doc, Tour } from "../../lib/contracts/config.ts";
import { LightElement } from "../base/light-element.ts";
import type { IconName } from "../primitives/media/icon.ts";
import type { MenuItem } from "../primitives/navigation/menu.ts";
import "../index.ts";
import { text } from "../../lib/payload/util.ts";
import { m } from "../../lib/i18n/index.ts";
import { dashboardContext, type Access, type Dashboard } from "../../lib/dashboard/context.ts";
import { dataFields, fieldsOf, formatDate } from "../../lib/dashboard/project.ts";
import { asideCounts } from "../../lib/shell/aside-counts.ts";
import { isBookmarked, loadBookmarks, startTour, toggleBookmark, Watch } from "../../lib/shell/stores.ts";

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

const countText = (count: number) => (count > 99 ? "99+" : String(count));
const icon = (name: IconName, count = 0) =>
  count
    ? html`<ui-indicator item=${countText(count)} badge="warning" size="xs"
        ><ui-icon name=${name}></ui-icon
      ></ui-indicator>`
    : html`<ui-icon name=${name}></ui-icon>`;

export const asideRail = (unread = 0): MenuItem[] =>
  ASIDE_SECTIONS.map((s) => ({
    label: unread && s.id === "notifications" ? `${asideLabel(s.id)} ${countText(unread)}` : asideLabel(s.id),
    icon: icon(s.icon, s.id === "notifications" ? unread : 0),
    value: s.id,
  }));

export type Attention = Record<string, number>;

export const expandAsideSection = (d: Dashboard, id: AsideSection) =>
  d.stores.preferences.set((p) => ({ asideCollapsed: p.asideCollapsed.filter((x) => x !== id) }));

const NOTIFICATION = "notification:";
const TOUR = "tour:";

const loading = (): MenuItem[] => [{ label: m.aside_loading(), disabled: true }];

@customElement("dashboard-aside")
export class DashboardAside extends LightElement {
  @consume({ context: dashboardContext, subscribe: true }) @state() private dashboard!: Dashboard;
  @property({ attribute: false }) access!: Access;
  @property({ attribute: false }) user!: Doc;
  @property() path = "";
  @property() pageTitle = "";
  @state() private tours: Tour[] = [];
  @state() private notifications: MenuItem[] = [];
  @state() private loaded = false;
  @state() private unread = 0;
  #bookmarksFor = "";
  #bookmarks = new Watch(this, () => this.dashboard.stores.bookmarks);
  #prefs = new Watch(this, () => this.dashboard.stores.preferences, ["asideCollapsed"]);
  #tour = new Watch(this, () => this.dashboard.stores.tour);

  updated(changed: Map<string, unknown>) {
    if (changed.has("path") || changed.has("user")) void this._load();
  }

  private _can = (slug: string) => this.access.collections[slug]?.read.permission === true;

  private _kindColor(kind: string): MenuItem["badgeColor"] {
    const c = this.dashboard.project.collectionOf("notifications")!;
    const tone = dataFields(fieldsOf(c)).find((f) => f.name === "kind")?.custom?.tones?.[kind];
    return tone && tone !== "neutral" && tone !== "primary" ? tone : undefined;
  }

  private _bookmarkKind(href: string) {
    const { base } = this.dashboard.project;
    const path = href.slice(base.length);
    return /^\/collections\/[^/]+\/[^/]+/.test(path)
      ? m.aside_bookmark_record()
      : path.startsWith("/collections/")
        ? m.aside_bookmark_list()
        : path.startsWith("/globals/")
          ? m.aside_bookmark_settings()
          : m.aside_bookmark_screen();
  }

  private async _load() {
    const d = this.dashboard;
    const user = this.user;
    const find = async (where: Where, limit: number): Promise<Doc[]> =>
      this._can("notifications")
        ? (await d.data.find("notifications", { where, sort: "-at", limit, depth: 0 }).catch(() => ({ docs: [] }))).docs
        : [];
    const count = async (slug: string, where: Where) =>
      this._can(slug) ? (await d.data.count(slug, where).catch(() => ({ totalDocs: 0 }))).totalDocs : 0;

    const [unread, recent] = await Promise.all([
      find({ read: { equals: false } }, 20),
      find({ read: { equals: true } }, 3),
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
        badgeColor: read ? undefined : this._kindColor(text(n.kind)),
      };
    });
    this.unread = unread.length;

    const flagged = asideCounts(d, user).filter((x) => x.tone === "warning");
    const counts = await Promise.all(flagged.map((w) => count(w.collection, w.where as Where)));
    const attention: Attention = {};
    flagged.forEach((w, i) => {
      if (counts[i]) attention[w.collection] = (attention[w.collection] ?? 0) + counts[i];
    });
    this.dispatchEvent(new CustomEvent("dashboard-attention", { detail: attention, bubbles: true }));
    this.tours = await d.site.tours();
    if (this.#bookmarksFor !== user.id) {
      this.#bookmarksFor = user.id;
      await loadBookmarks(d);
    }
    this.loaded = true;
    d.stores.notifications.set({ unread: this.unread });
  }

  private async _open(item: MenuItem) {
    const value = typeof item.value === "string" ? item.value : "";
    if (value.startsWith(TOUR)) return startTour(this.dashboard, value.slice(TOUR.length));
    if (!value.startsWith(NOTIFICATION)) return;
    await this.dashboard.data
      .update("notifications", value.slice(NOTIFICATION.length), { read: true })
      .catch(() => undefined);
    void this._load();
  }

  private _remember(id: AsideSection, open: boolean) {
    this.dashboard.stores.preferences.set((p) => {
      const rest = p.asideCollapsed.filter((x) => x !== id);
      return { asideCollapsed: open ? rest : [...rest, id] };
    });
  }

  private _sections(): MenuItem[] {
    const d = this.dashboard;
    const collapsed = this.#prefs.value.asideCollapsed;
    const here = isBookmarked(d, this.path);
    const marks = this.#bookmarks.value.items;
    const tour = this.#tour.value;
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
            description: this._bookmarkKind(b.href),
            href: b.href,
            active: b.href === this.path,
          }))
        : [{ label: m.aside_bookmarks_empty(), disabled: true }],
      widgets: [
        {
          content: html`<app-widgets
            board="aside"
            fit
            .page=${{ widgets: d.project.settings.aside ?? [] }}
            .user=${this.user}
            .access=${this.access}
          ></app-widgets>`,
        },
      ],
      tours: this.tours.map((t) => {
        const done = tour.completed.includes(t.id);
        return {
          card: true,
          label: t.title,
          description: t.summary,
          badge: done ? m.aside_tour_done() : m.aside_tour_steps({ count: t.steps.length }),
          badgeColor: done ? ("success" as const) : undefined,
          value: `${TOUR}${t.id}`,
          active: tour.active === t.id,
        };
      }),
    };
    return ASIDE_SECTIONS.map((s) => ({
      label: asideLabel(s.id),
      icon: icon(s.id === "bookmarks" && here ? "star-filled" : s.icon, s.id === "notifications" ? this.unread : 0),
      iconAction:
        s.id === "bookmarks"
          ? { label: here ? m.aside_bookmark_remove() : m.aside_bookmark_add(), pressed: here }
          : undefined,
      value: s.id,
      badge: (s.id === "bookmarks" && marks.length) || undefined,
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
        e.detail.item.value === "bookmarks" &&
        void toggleBookmark(this.dashboard, { href: this.path, label: this.pageTitle })}
    ></ui-menu>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-aside": DashboardAside;
  }
}
