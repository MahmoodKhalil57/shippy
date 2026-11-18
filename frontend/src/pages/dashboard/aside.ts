import type { Where } from "payload";
import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../cms/client.ts";
import type { Doc } from "../../cms/types.ts";
import { LightElement } from "../../components/base/light-element.ts";
import type { IconName } from "../../components/primitives/media/icon.ts";
import type { MenuItem } from "../../components/primitives/navigation/menu.ts";
import "../../components/index.ts";
import {
  StoreController,
  bookmarks,
  isBookmarked,
  notifications,
  preferences,
  startTour,
  tour,
} from "../../stores/index.ts";
import { TOURS } from "./tours.ts";
import type { Access } from "./app.ts";
import { text } from "../../cms/runtime/util.ts";
import { dashboardPath, formatDate, loadBookmarks, toggleBookmark } from "./shared.ts";

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
const KIND_COLOR: Record<string, MenuItem["badgeColor"]> = {
  Approval: "warning",
  Alert: "error",
  Payment: "success",
  Reply: "info",
  Reminder: "info",
};

interface Widget {
  label: string;
  slug: string;
  where: Where;
  href?: string;
  /** Draw a non-zero count as needing attention. */
  alert?: boolean;
}

/** What each counter means, under its label. */
const WIDGET_HINTS: Record<string, string> = {
  "Decisions waiting for me": "Approvals routed to you that you haven't decided",
  "Live cases": "Every case not yet settled, lost or expired",
  "Awaiting internal approval": "Cases held for a margin, deposit or other approval",
  "Integration exceptions": "Failed mailbox, e-invoice or AI steps waiting for a person",
  "Invoices to collect": "Customer invoices with a balance still open",
  "Supplier bills": "Bills to match against the PO and goods received",
  Payments: "Payments in and out on record",
  "Deliveries in progress": "Drops planned or on the way to a vessel",
  "My live cases": "Cases you own that are still open",
  "Awaiting customer decision": "Quotes sent, waiting for the customer",
  "My pipeline": "Prospects you're working on",
  "Quotations in draft": "Quotes being prepared, not yet sent",
  "Inbox to triage": "New messages and uncertain matches to check",
  "Open follow-ups": "Reminders, calls and messages still to do",
  "Awaiting supplier": "Cases waiting for supplier replies",
  "Supplier RFQs awaiting reply": "Requests suppliers haven't answered yet",
  "My open tasks": "Your follow-ups that are still open",
};

/** A bookmark's kind, from its address: a record, a list, settings or a screen. */
const bookmarkKind = (href: string) =>
  /^\/collections\/[^/]+\/[^/]+/.test(href)
    ? "Record"
    : href.startsWith("/collections/")
      ? "List"
      : href.startsWith("/globals/")
        ? "Settings"
        : "Screen";

const LIVE: Where = { stage: { not_in: ["Lost", "Expired", "Closed — settled"] } };
const PENDING: Where = { status: { not_in: ["Approved", "Rejected"] } };

/** The side panel's counters for each role (signed-in user `me`): what that role steers by. */
export function roleWidgets(role: string, me: string): Widget[] {
  const mine = (w: Where): Where => ({ and: [{ owner: { equals: me } }, w] });
  const myDecisions: Widget = {
    label: "Decisions waiting for me",
    slug: "approvals",
    where: { and: [PENDING, { approvers: { in: [me] } }, { "decisions.user": { not_equals: me } }] },
    alert: true,
  };
  const exceptions: Widget = {
    label: "Integration exceptions",
    slug: "integration-exceptions",
    where: { status: { in: ["Open", "Waiting for review"] } },
    alert: true,
  };
  const toCollect: Widget = {
    label: "Invoices to collect",
    slug: "invoices",
    where: { status: { in: ["Open", "Partially paid", "Overdue"] } },
  };
  const bills: Widget = { label: "Supplier bills", slug: "supplier-bills", where: {} };
  const inbox: Widget = {
    label: "Inbox to triage",
    slug: "intake-messages",
    where: { status: { in: ["New", "Needs review"] } },
    alert: true,
  };
  switch (role) {
    case "management":
      return [
        myDecisions,
        { label: "Live cases", slug: "cases", where: LIVE },
        {
          label: "Awaiting internal approval",
          slug: "cases",
          where: { wait: { equals: "Awaiting internal approval" } },
        },
        exceptions,
      ];
    case "finance-director":
      return [myDecisions, toCollect, bills, { label: "Payments", slug: "payments", where: {} }];
    case "operations":
      return [
        { label: "Deliveries in progress", slug: "deliveries", where: { status: { not_equals: "Delivered" } } },
        bills,
        toCollect,
        exceptions,
      ];
    case "sales":
      return [
        { label: "My live cases", slug: "cases", where: mine(LIVE) },
        {
          label: "Awaiting customer decision",
          slug: "cases",
          where: mine({ wait: { equals: "Awaiting customer decision" } }),
        },
        { label: "My pipeline", slug: "opportunities", where: { owner: { equals: me } } },
        { label: "Quotations in draft", slug: "quotations", where: { status: { equals: "Draft" } } },
      ];
    case "office-admin":
      return [
        inbox,
        { label: "Open follow-ups", slug: "tasks", where: { status: { equals: "Open" } } },
        { label: "Live cases", slug: "cases", where: LIVE },
        exceptions,
      ];
    default:
      return [
        { label: "My live cases", slug: "cases", where: mine(LIVE) },
        { label: "Awaiting supplier", slug: "cases", where: { wait: { equals: "Awaiting supplier" } } },
        {
          label: "Supplier RFQs awaiting reply",
          slug: "supplier-rfqs",
          where: { status: { equals: "Awaiting reply" } },
          alert: true,
        },
        { label: "My open tasks", slug: "tasks", where: mine({ status: { equals: "Open" } }) },
      ];
  }
}
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
        badgeColor: read ? undefined : KIND_COLOR[text(n.kind)],
      };
    });
    this.unread = unread.length;

    // Widgets: the counters this role steers by.
    const widgets = roleWidgets(text(user.role), user.id);
    const counts = await Promise.all(widgets.map((w) => count(w.slug, w.where)));
    this.widgets = widgets.map((w, i) => ({
      card: true,
      label: w.label,
      description: WIDGET_HINTS[w.label],
      badge: String(counts[i]),
      badgeColor: counts[i] && w.alert ? "warning" : undefined,
      href: w.href ?? dashboardPath("collections", w.slug),
    }));
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
      tours: TOURS.map((t) => {
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
