import { html, nothing } from "lit";
import { drawInTurn } from "./paint-queue.ts";
import { yieldToMain } from "../../components/base/work-queue.ts";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../api/client.ts";
import type { Doc, FieldLike } from "../../contracts/config.ts";
import type { Access } from "../app.ts";
import { LightElement } from "../../components/base/light-element.ts";
import "../../components/index.ts";
import {
  collectionOf,
  collectionSettings,
  componentOf,
  dashboardView,
  globalLabel,
  globalOf,
  labels,
  rootViews,
  titleOfView,
  toast,
} from "../shared.ts";
import { pathParams } from "./places.ts";
import { action as actionButton, tag } from "./blocks.ts";
import { expand } from "./data.ts";
import { orderColumns } from "../../components/base/columns.ts";
import type { BoardEdge, BoardItem, UiBoard } from "../../components/primitives/layout/board.ts";

/**
 * Drag targets' magnets, against where the tiles were when the drag began: an edge within
 * `EDGE_SNAP` px of the pointer wins; else a free spot within `SPOT_SNAP` tiles of where the tile
 * is shown; else an edge within `EDGE_REACH` px.
 */
const EDGE_SNAP = 24;
const EDGE_REACH = 80;
const SPOT_SNAP = 2;
/**
 * Frames a moved tile's target must hold before the board re-arranges for it (gridstack's `pause`):
 * swept across the board, the tile passes over targets without setting every tile it crosses
 * moving; held over one for about 130ms at 60Hz, the board makes room. Counted in animation frames,
 * never timed.
 */
export const SETTLE_FRAMES = 8;
/** A widget's tile: its height is always whole tiles it declares (never measured). */
type WidgetItem = BoardItem & { rows: number };
import {
  boundsOf,
  defaultRows,
  reflowOf,
  resizeTo,
  sizesWithin,
  type Placed,
  type TileBounds,
} from "../../components/base/board.ts";
import { compact, insert, putAt, type Box, type Spot } from "../../components/base/arrange.ts";
import { tileH, tileW } from "../../components/base/tiles.ts";
import type { TileDrag } from "../../components/primitives/containers/tile.ts";
import { preferences, StoreController } from "../../stores/index.ts";
import { inCard, renderBlocks, type ViewContext } from "./registry.ts";
import { miniBlocks, miniFigure, miniOpen, miniRows } from "./mini.ts";
import type { Action, UndoCall, ViewBlock, ViewHeader } from "./schema.ts";
import type { TileSize } from "./tile.ts";
import { doneText, undoOf, type ActionReply } from "./undo.ts";
import { eachTiles, fill, type Source, type Widget, type WidgetPage, type WidgetScope } from "./widget.ts";
// More blocks: the app's own (./blocks/*.ts), each registering itself with `defineBlock`.
import.meta.glob("./blocks/*.ts", { eager: true });

/**
 * Draws a screen of widgets (./widget.ts): `<app-widgets .page=${{ header, params, widgets }}>`,
 * set from the config by `widgets({ … })` through Payload's component slots.
 *
 * Each widget loads its own data and shows a skeleton until it first arrives; the same request
 * made by several widgets goes out once. The host runs actions: navigation, or a confirmation or
 * a small form, then the request, with the pressed button busy until the screen shows the
 * result; a snackbar that names what happened and offers Undo when there is a way back; and a
 * refresh in place (every widget keeps what it shows until its new data is in). It keeps the
 * screen's parameters in the URL, so a reload or a shared link shows the same thing. Elements
 * placed by `custom` blocks are kept across reloads and may fire `app-widgets-reload` to ask for
 * fresh data.
 */

export { fill };

/**
 * Load a source whose placeholders are filled, as the signed-in user, through the REST API.
 * `nested` loads the parts of an `all` (the host passes its cached fetch).
 */
export async function loadSource(
  s: Source,
  scope: WidgetScope,
  nested: (s: Source) => Promise<unknown> = (x) => loadSource(x, scope),
): Promise<unknown> {
  if ("all" in s)
    return Object.fromEntries(await Promise.all(Object.entries(s.all).map(async ([k, x]) => [k, await nested(x)])));
  if ("endpoint" in s) return api.get(s.endpoint, s.query);
  if ("find" in s)
    return api.find(s.find, {
      where: s.where as never,
      sort: s.sort,
      limit: s.limit,
      depth: s.depth,
      select: s.select as never,
      joins: s.joins as never,
    });
  if ("count" in s) return (await api.count(s.count, s.where as never)).totalDocs;
  if ("global" in s) return api.findGlobal(s.global, { depth: s.depth });
  if (!scope.doc) throw new Error("This widget needs a document.");
  return api.findByID(scope.doc.slug, scope.doc.id, { depth: s.depth ?? 1, joins: s.joins as never });
}

/** A page's widgets, flattened: the ones this person sees, with data widgets expanded. */
export function leaves(list: Widget[], scope: WidgetScope): Widget[] {
  return list.flatMap((w) => {
    if (w.visible && !w.visible(scope)) return [];
    if (w.grid) return leaves(w.grid, scope);
    if (w.split) return leaves([...w.split.main, ...w.split.side], scope);
    return [expand(w, scope)];
  });
}

const asBlocks = (b: ViewBlock | ViewBlock[] | null | undefined): ViewBlock[] =>
  b ? (Array.isArray(b) ? b : [b]) : [];

/** A collection's list's or a form's height in tiles unless its widget says (`rows`). */
const PAGE_ROWS = 12;

/** A widget's skeleton: what it says, else a collection's list loads as a table and a form as a card. */
const skeletonOf = (w: Widget): Widget["skeleton"] =>
  w.skeleton ??
  (w.collection
    ? "table"
    : w.breakdown
      ? w.breakdown.as === "table"
        ? "table"
        : "chart"
      : w.records
        ? w.records.layout === "list" || w.records.layout === "timeline"
          ? "list"
          : w.records.layout === "entries"
            ? "entries"
            : "table"
        : w.document || w.global
          ? "card"
          : w.header
            ? "text"
            : undefined);

/** Where a widget's data comes from: its `source`, or its header's. */
const sourceOf = (w: Widget): Source | undefined =>
  w.source ?? (w.header && "render" in w.header ? w.header.source : undefined);

/**
 * The widgets around a collection's list (`admin.components.beforeList` / `afterList`, when they
 * are screens of widgets) or above a document's or global's form (`custom.edit.before`), unless
 * the widget hides them (`around`).
 */
/** A widget kept in another board's Widgets (`preferences.boards[…].added`): where it's from. */
export interface PinRef {
  view: string;
  key: string;
  item?: string;
}

/** A view's screen of widgets and its path: the dashboard's (`dashboard`), or a root view's by its key. */
function viewPage(view: string): { page: WidgetPage; path: string; title: string } | undefined {
  if (view === "dashboard") {
    const page = componentOf(dashboardView()?.Component)?.props.page as WidgetPage | undefined;
    return page && { page, path: "/", title: "Dashboard" };
  }
  const v = rootViews().find((r) => r.key === view);
  const page = v && (componentOf(v.Component)?.props.page as WidgetPage | undefined);
  return v && page && { page, path: v.path, title: titleOfView(v) };
}

/**
 * The widget at a tile's key on a screen (the keys `#tiles` gives: an index into the page's
 * widgets, then `.i` into a grid, `.m i` / `.s i` into a split's main or side, `.b i` / `.a i` into
 * the widgets before or after a collection's).
 */
function widgetAt(page: WidgetPage, key: string): Widget | undefined {
  const [first, ...rest] = key.split(".");
  let w: Widget | undefined = page.widgets[Number(first)];
  for (const seg of rest) {
    if (!w) return undefined;
    const i = Number(seg.replace(/^[msba]/, ""));
    w =
      seg[0] === "m"
        ? w.split?.main[i]
        : seg[0] === "s"
          ? w.split?.side[i]
          : seg[0] === "b"
            ? aroundOf(w, "before")[i]
            : seg[0] === "a"
              ? aroundOf(w, "after")[i]
              : w.grid?.[i];
  }
  return w;
}

/** For a widget drawn per item, the one item a kept copy shows (by its key). */
const onlyItem = new WeakMap<Widget, string>();

function aroundOf(w: Widget, where: "before" | "after"): Widget[] {
  const hidden = (w.collection ?? w.document ?? w.global)?.hide as string[] | undefined;
  if (hidden?.includes("around")) return [];
  if (w.collection) {
    const c = collectionOf(w.collection.collection);
    const list = (c?.admin?.components as Record<string, unknown> | undefined)?.[`${where}List`];
    return (Array.isArray(list) ? list : []).flatMap(
      (x) => (componentOf(x)?.props.page as WidgetPage | undefined)?.widgets ?? [],
    );
  }
  if (where === "after") return [];
  const owner = w.document ? collectionOf(w.document.collection) : globalOf(w.global!.global);
  return (owner && collectionSettings(owner).edit?.before) ?? [];
}

/**
 * What arranging a tile by hand does (`<app-arrange>`: its grab bar and resize corner). Moving and
 * resizing show live while the pointer drags (`move`, `resize`) and are kept when it lets go
 * (`commit`), or dropped (`cancel`: Escape). The keyboard steps it (`step`, and `resize` then
 * `commit`), or hides it.
 */
export interface TileArrange {
  key: string;
  /** Its name for the handles' labels ("Messages"). */
  label: string;
  /** Its widget's bounds (a resize stays inside them); none for a tile with no widget's bounds. */
  bounds?: TileBounds;
  first: boolean;
  last: boolean;
  /** Whether going before or after `over` would change its place (never around a fixed tile). */
  /** Whether it can go by `over` (never by a fixed tile, nor by itself). */
  lands(over: string): boolean;
  /**
   * Take the place of `over`, pushing it the opposite way from the edge it was dropped by: by its
   * start or top edge, `over` moves on (towards the end, or down); by its end or bottom edge, `over`
   * moves back (towards the start, or up), and where there's no room for that, this one goes after
   * it instead (beside it, or under it). `me` and `them` are where both are now, in tiles.
   */
  move(over: string, edge: BoardEdge, placed: ReadonlyMap<string, Placed>, lanes: number, lane: number): void;
  /**
   * Put it in space at this lane and row: where it fits, nothing else moves; where it only partly
   * fits (a squeeze), the row makes room for it and what's still in the way goes down (`putAt`).
   */
  place(lane: number, row: number, placed: ReadonlyMap<string, Placed>, lanes: number): void;
  /** Resize it to this (`placed`: where every tile is now, kept on the board's first arrangement). */
  resize(span: number, rows: number, placed?: ReadonlyMap<string, Placed>): void;
  commit(): void;
  cancel(): void;
  step(to: "start" | "earlier" | "later"): void;
  hide(): void;
}

@customElement("app-widgets")
export class AppWidgets extends LightElement {
  #prefs = new StoreController(this, preferences);
  @property({ attribute: false }) page: WidgetPage = { widgets: [] };
  /** The root view's path parameters (`/cases/:id`): `$param.id`. */
  @property({ attribute: false }) params: Record<string, string> = {};
  /** In an edit tab: the document's id and collection. */
  @property() docId = "";
  @property() slug = "";
  @property({ attribute: false }) user?: Doc;
  /**
   * The board's own name in the preferences (how someone arranged it), when it isn't a screen's: a
   * side panel's widgets (`"aside"`). Left out, the screen's path.
   */
  @property() board = "";
  /** Its board fills its own box exactly (`UiBoard.fit`): a side panel's. */
  @property({ type: Boolean }) fit = false;
  /** What this person may do (a view of widgets gets it from the app). */
  @property({ attribute: false }) access?: Access;
  /** A tile being moved or resized by hand: shown as it goes, kept when the pointer lets go. */
  @state() private live: {
    order?: string[];
    /** Where every tile is put, while one is being placed by hand. */
    pins?: Record<string, number | { lane: number; row: number }>;
    /** Every tile's width and rows, once the board is arranged by hand (from the default layout). */
    widths?: Record<string, number>;
    heights?: Record<string, number>;
    key?: string;
    span?: number;
    rows?: number;
  } | null = null;
  /** The tiles' keys in their current order (what a move rearranges). */
  #keys: string[] = [];
  /** Bumped on every reload: each widget refetches when it changes. */
  @state() version = 0;
  /** Each widget's size once it has drawn (null: hidden), by its key on the board. */
  @state() private sizes = new Map<string, TileSize | null>();
  @state() private pending: Action | null = null;
  @state() private draft: Record<string, unknown> = {};
  @state() private busy = false;
  @state() private failed = "";
  #cache = new Map<string, Promise<unknown>>();
  #mounted = new Map<string, HTMLElement>();
  /** Each tile's widget on this screen: its key there (`widgetAt`) and, drawn per item, its item. */
  #sources = new Map<string, { base: string; item?: string }>();
  /** The tiles kept here from other screens (`added`), drawn as their mini versions: what each is. */
  #pins = new Map<string, PinRef>();
  /** A tile from another board is being dragged over this one: it shows where it can be let go. */
  @state() private dropping = false;

  /** Something dragged from another board is over this one (`true`), or has left it. */
  dropTarget(on: boolean) {
    if (this.dropping !== on) this.dropping = on;
  }

  /**
   * What a tile of this screen is, for keeping it on another board (`PinRef`): its view and key.
   * None for a screen whose widgets need its path's parameters or a document (a case's, a record's).
   */
  pinRefOf(tileKey: string): PinRef | undefined {
    if (this.docId || this.board || tileKey === "header") return undefined;
    const source = this.#sources.get(tileKey);
    if (!source) return undefined;
    // A widget drawn from blocks (a collection's list, a document's form or a global stay on their screen).
    const w = widgetAt(this.page, source.base);
    if (!w || w.collection || w.document || w.global || w.header) return undefined;
    const views = [{ key: "dashboard", path: "/" }, ...rootViews()];
    const view = views.find((v) => viewPage(v.key)?.page === this.page);
    if (!view || pathParams(view.path).length) return undefined;
    return { view: view.key, key: source.base, item: source.item };
  }

  /** Keeps a widget from another screen here (`added`), once. */
  pin(ref: PinRef) {
    const same = (r: PinRef) => r.view === ref.view && r.key === ref.key && r.item === ref.item;
    if ((this.#prefs.value.boards[this.#boardKey]?.added ?? []).some(same)) return false;
    this.#keep((m) => ({ ...m, added: [...(m.added ?? []), ref] }));
    return true;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("app-widgets-reload", this.#onReload);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("app-widgets-reload", this.#onReload);
  }
  #onReload = (e: Event) => {
    e.stopPropagation();
    this.reload();
  };

  get scope(): WidgetScope {
    const user = (this.user ?? { id: "" }) as WidgetScope["user"];
    // The document the screen is about: an edit tab's, else its document widget's (a record's page).
    const page = this.page.widgets.find((w) => w.document)?.document;
    const params = { ...this.page.params, ...Object.fromEntries(new URLSearchParams(location.search)), ...this.params };
    const id = page ? fill(page.id, { user, params }) : "";
    return {
      user,
      doc: this.docId
        ? { id: this.docId, slug: this.slug }
        : page && id && id !== "create"
          ? { id, slug: page.collection }
          : undefined,
      params: { ...this.page.params, ...Object.fromEntries(new URLSearchParams(location.search)), ...this.params },
    };
  }

  /** Fetch a source (placeholders filled), once per reload however many widgets ask. */
  fetch(source: Source): Promise<unknown> {
    const s = fill(source, this.scope);
    const key = JSON.stringify(s);
    let p = this.#cache.get(key);
    if (!p) {
      p = this.#load(s);
      this.#cache.set(key, p);
    }
    return p;
  }

  #load(s: Source): Promise<unknown> {
    return loadSource(s, this.scope, (x) => this.fetch(x));
  }

  reload() {
    this.#cache.clear();
    this.version++;
  }

  /**
   * Reload, and settle once the new data is in. Every widget keeps what it shows until its own
   * answer arrives (skeletons are for the first load), so the screen changes in place, once.
   * Every source is asked again: the host can't know what an endpoint changed.
   */
  async refresh() {
    this.reload();
    // Widgets ask for their data as they update, in microtasks: a task later every request is out.
    await yieldToMain();
    await Promise.allSettled(this.#cache.values());
  }

  ctx: ViewContext = {
    run: (a) => this.run(a),
    setParam: (param, value) => {
      const url = new URL(location.href);
      url.searchParams.set(param, value);
      history.replaceState(history.state, "", url);
      this.reload();
    },
    reload: () => this.reload(),
    get params() {
      return Object.fromEntries(new URLSearchParams(location.search));
    },
    mount: (element, props, key) => {
      if (!customElements.get(element)) return nothing;
      const id = key ? `${element}#${key}` : element;
      let el = this.#mounted.get(id);
      if (!el) {
        el = document.createElement(element);
        this.#mounted.set(id, el);
      }
      Object.assign(el, props);
      return el;
    },
  };

  // ---------------------------------------------------------------- actions

  /**
   * Run an action. A call that goes out at once returns a promise that settles when the screen
   * shows its result (the pressed button is busy until then, ./blocks.ts); navigating, printing
   * or opening a dialog first returns nothing.
   */
  run(action: Action): Promise<void> | void {
    const a = fill(action, this.scope);
    if (a.print) return window.print();
    if (a.href) {
      history.pushState(null, "", a.href);
      dispatchEvent(new PopStateEvent("popstate"));
      return;
    }
    if (a.confirm || a.fields?.length) {
      this.failed = "";
      this.draft = Object.fromEntries((a.fields ?? []).map((f) => [f.name, f.defaultValue]));
      this.pending = a;
      if (a.prefill) void this.#prefill(a.prefill, this.draft[a.prefill.when]);
      return;
    }
    return this.#call(a);
  }

  /**
   * Send an action's call and answer at once: the snackbar says what happened (`done`, or the
   * endpoint's `message` with `reply`) and offers Undo when there is a way back, then the
   * widgets refresh in place. Whether there is one is the server's to say: a reply's
   * `undo: { path, body }` wins over the action's own, and `undo: null` takes it away (./schema.ts
   * `Reversal` has the rule for which actions get Undo and which keep their dialog).
   */
  async #call(a: Action, values: Record<string, unknown> = {}) {
    if (!a.call) return;
    this.busy = true;
    let r: ActionReply | null;
    try {
      r = await api.call<ActionReply | null>(a.call.method ?? "POST", a.call.path, { ...a.call.body, ...values });
    } catch (e) {
      const msg = (e as Error).message || "That didn't work.";
      if (this.pending) this.failed = msg;
      else toast(msg, "error");
      return;
    } finally {
      this.busy = false;
    }
    this.pending = null;
    const undo = undoOf(r, a);
    const message = doneText(r, a, !!undo);
    if (message) toast(message, "success", undo && { label: "Undo", undo: true, onClick: () => void this.#undo(undo) });
    if (a.reply && typeof r?.href === "string") {
      // Another page draws itself; the same page (only its parameters changed) reloads.
      const same = new URL(r.href, location.href).pathname === location.pathname;
      void this.run({ label: a.label, href: r.href });
      if (!same) return;
    }
    await this.refresh();
  }

  /**
   * Undo: send the call that takes the action back, say so, and show the result (HIG Undo and
   * redo: "Show the results of an undo"). The endpoint decides whether it still can: once the
   * thing has moved on, its refusal is what the snackbar says. The person may have gone to
   * another page since, so whichever screens are showing refresh.
   */
  async #undo(u: UndoCall) {
    try {
      const r = await api.call<ActionReply | null>(u.method ?? "POST", u.path, u.body ?? {});
      toast(u.done ?? (typeof r?.message === "string" && r.message ? r.message : "Undone"));
    } catch (e) {
      toast((e as Error).message || "That couldn't be undone.", "error");
    }
    for (const host of this.isConnected ? [this] : document.querySelectorAll("app-widgets")) void host.refresh();
  }

  /** An action's `prefill`: ask the server for a field's value when another field changes. */
  async #prefill(p: NonNullable<Action["prefill"]>, value: unknown) {
    if (value === undefined || value === "" || value === null) return;
    this.busy = true;
    try {
      const r = await api.post<Record<string, unknown>>(p.call.path, { ...p.call.body, [p.when]: value });
      if (this.pending && this.draft[p.when] === value) this.draft = { ...this.draft, [p.into]: r[p.from ?? p.into] };
    } catch (e) {
      this.failed = (e as Error).message;
    } finally {
      this.busy = false;
    }
  }

  #confirm() {
    const a = this.pending;
    if (!a) return;
    const missing = (a.fields ?? []).filter(
      (f) => f.required && (this.draft[f.name] === undefined || this.draft[f.name] === ""),
    );
    if (missing.length) {
      this.failed = `Fill in ${missing.map((f) => f.label ?? f.name).join(", ")}.`;
      return;
    }
    void this.#call(a, this.draft);
  }

  #dialog() {
    const a = this.pending;
    const assisted = a?.assist ? this.draft[a.assist.field] : undefined;
    return html`<ui-modal
      .open=${!!a}
      .heading=${a?.confirm?.heading ?? a?.prompt ?? a?.label ?? ""}
      .confirmLabel=${a?.confirm?.label ?? a?.label ?? ""}
      .confirmTone=${a?.confirm?.tone ?? a?.tone ?? "primary"}
      ?confirm-disabled=${this.busy}
      @ui-confirm=${() => this.#confirm()}
      @ui-close=${() => (this.pending = null)}
    >
      <ui-flex direction="col" gap="3">
        ${a?.confirm?.text ? html`<ui-text variant="body-md" pre-line>${a.confirm.text}</ui-text>` : nothing}
        ${
          a?.fields?.length
            ? html`<ui-doc-form
                .fields=${a.fields as unknown as FieldLike[]}
                .value=${this.draft}
                @ui-change=${(e: CustomEvent<{ value: Record<string, unknown> }>) => {
                  if (e.target !== e.currentTarget) return;
                  const before = this.draft;
                  this.draft = e.detail.value;
                  const p = a?.prefill;
                  if (p && e.detail.value[p.when] !== before[p.when]) void this.#prefill(p, e.detail.value[p.when]);
                }}
              ></ui-doc-form>`
            : nothing
        }
        ${
          a?.assist
            ? html`<ui-ai-tools
                .tools=${a.assist.tools}
                .value=${typeof assisted === "string" ? assisted : ""}
                @ui-change=${(e: CustomEvent<{ value: string }>) =>
                  (this.draft = { ...this.draft, [a.assist!.field]: e.detail.value })}
              ></ui-ai-tools>`
            : nothing
        }
        ${
          a?.extract
            ? html`<ui-ai-extract
                pickable
                use-label="Fill in"
                .source=${a.extract.source ?? "paste"}
                .label=${a.extract.label}
                .what=${a.extract.what}
                .placeholder=${a.extract.placeholder ?? "Paste the message here…"}
                .fields=${a.extract.fields}
                @ui-select=${(e: CustomEvent<{ values: Record<string, string | number | null> }>) => {
                  const next = { ...this.draft };
                  for (const [id, to] of Object.entries(a.extract!.into)) {
                    const v = e.detail.values[id];
                    if (v === null || v === undefined || v === "") continue;
                    const now = next[to.field];
                    next[to.field] = to.append && typeof now === "string" && now ? `${now}\n${v}` : v;
                  }
                  this.draft = next;
                }}
              ></ui-ai-extract>`
            : nothing
        }
        ${this.failed ? html`<ui-alert tone="error">${this.failed}</ui-alert>` : nothing}
      </ui-flex>
    </ui-modal>`;
  }

  // ---------------------------------------------------------------- drawing

  protected willUpdate(changed: Map<PropertyKey, unknown>) {
    // Another page: the sizes its widgets told the board belong to the old one.
    if (changed.has("page") && changed.get("page") !== undefined) {
      this.sizes = new Map();
    }
  }

  /**
   * The screen's widgets as the board's tiles, in order. A `grid` or `split` lays out nothing of its
   * own any more: its widgets are tiles too (a split's main ones `l` and its side ones `s`, unless
   * they say). A widget that's hidden for this user, or once its data is in, takes no tile.
   */
  /** Each tile's size bounds, by key (filled as the tiles are built). */
  #bounds = new Map<string, TileBounds>();
  /** Each tile's name for its handles (its widget's title, its list's collection), by key. */
  #labels = new Map<string, string>();
  /**
   * Tiles people can't arrange: a screen's header stays where the screen put it and its size (no
   * handles, and no tile moves in front of it).
   */
  #fixed = new Set<string>();

  #tiles(): WidgetItem[] {
    const out: WidgetItem[] = [];
    const tile = (key: string, size: TileSize, w: Widget) => {
      const memory = `${this.#boardKey}|${key}`;
      const last = tileHeights.get(memory);
      // Its size in cells and the bounds it may be resized within (Android's target / min / max):
      // what it says, else its kind's. The same loading and loaded.
      // A collection's list or a form: 12 tiles high unless it says (a toolbar, about ten rows, a pager).
      const page = w.collection || w.document || w.global;
      if (w.header) this.#fixed.add(key);
      else this.#fixed.delete(key);
      this.#labels.set(
        key,
        w.title ??
          (w.collection
            ? labels(collectionOf(w.collection.collection) ?? ({ slug: w.collection.collection } as never)).plural
            : w.header
              ? "header"
              : ""),
      );
      const mini = this.#pins.has(key);
      const b = mini
        ? (() => {
            // Exactly its mini rows: the default layout never bends a mini version.
            // One item of a widget drawn per item is a figure (`expand`): one line.
            const rows = this.#sources.get(key)?.item !== undefined ? 1 : miniRows(!!w.title, skeletonOf(w));
            return boundsOf({ size: "full", minSize: "full", rows, minRows: rows, maxRows: rows });
          })()
        : boundsOf({ ...w, size, rows: w.rows ?? (page ? PAGE_ROWS : defaultRows(skeletonOf(w), size)) });
      this.#bounds.set(key, b);
      out.push({
        key,
        size: b.size,
        rows: b.rows,
        // A mini version keeps its rows however narrow (its lines are already cut to fit).
        reflow: mini ? 1 : reflowOf(skeletonOf(w)),
        // The default layout bends it inside its bounds (the header: the board's width, always).
        bounds: b,
        fixed: !!w.header,
        // Stretched past its target only as far as it says.
        maxSpan: w.maxWidth,
        maxRows: w.maxRows,
        // An exact width in tiles, inside its own bounds.
        span: w.width && Math.min(w.maxWidth ?? w.width, Math.max(w.minWidth ?? w.width, w.width)),
        // Until it has drawn, a tile that draws nothing while loading (`<app-widget>`'s render: hidden
        // last time, or a widget that may hide and doesn't `expect` to show) takes no lanes, so the
        // tiles before it never move for it.
        away: !this.sizes.has(key) && (last === 0 || (last === undefined && !!w.hidden && w.expect !== "shown")),
        content: html`<app-widget
          .widget=${expand(w, this.scope)}
          .host=${this}
          .version=${this.version}
          .memory=${memory}
          .report=${(s: TileSize | null) => this.#report(key, s)}
          .mini=${mini}
          .open=${mini ? viewPage(this.#pins.get(key)!.view)?.path : undefined}
        ></app-widget>`,
      });
    };
    const add = (w: Widget, key: string, fallback?: TileSize) => {
      if (w.visible && !w.visible(this.scope)) return;
      const only = onlyItem.get(w);
      if (w.grid) return w.grid.forEach((x, i) => add(x, `${key}.${i}`, fallback));
      if (w.split) {
        w.split.main.forEach((x, i) => add(x, `${key}.m${i}`, "l"));
        w.split.side.forEach((x, i) => add(x, `${key}.s${i}`, "s"));
        return;
      }
      // A collection's, document's or global's widget is a tile like any other; the widgets around
      // it (a collection's `beforeList` / `afterList`, a document's `custom.edit.before`) are tiles
      // of this board beside it.
      if (w.collection || w.document || w.global) {
        aroundOf(w, "before").forEach((x, i) => add(x, `${key}.b${i}`));
        if (this.sizes.get(key) !== null) tile(key, w.size ?? fallback ?? "full", w);
        aroundOf(w, "after").forEach((x, i) => add(x, `${key}.a${i}`));
        return;
      }
      if (this.sizes.get(key) === null) return;
      // An untitled `counts` is one widget per count (`figures`): expanded here, so each is a tile.
      if ((w.counts && !w.title) || w.metrics) w = expand(w, this.scope);
      const size = w.size ?? fallback ?? "s";
      // One tile per item, once the data is in; a loading tile until then.
      if (w.each) {
        const got = this.#eachData(key, w);
        if (!got)
          return out.push({
            key,
            size,
            rows: w.rows ?? defaultRows(w.skeleton, size),
            // One that may come to nothing (`hidden`, not `expect`ed) holds no place while loading.
            away: !!w.hidden && w.expect !== "shown",
            content: html`<ui-tile .size=${size} loading></ui-tile>`,
          });
        if (got.refused || w.hidden?.(got.data as never, this.scope)) return;
        // The first item takes the loading tile's key, so it's the same tile on the board (in its
        // place, its box), not one that goes and another that comes.
        eachTiles(w, got.data as never, this.scope).forEach((t, i) => {
          // A kept copy of one item shows that item alone, in its own key.
          if (only !== undefined && t.key !== only) return;
          const k = i === 0 || only !== undefined ? key : `${key}:${t.key}`;
          this.#sources.set(k, { base: key, item: t.key });
          tile(k, size, t.widget as Widget);
          // An untitled item (a figure) is named by its key (the figure's label) on its handles.
          if (!t.widget.title) this.#labels.set(k, t.key);
        });
        return;
      }
      this.#sources.set(key, { base: key });
      tile(key, size, w);
    };
    // The screen's header is a widget like the rest: the first, the board's width.
    if (this.page.header && !this.docId)
      add(
        {
          header: this.page.header,
          size: "full",
          rows: this.page.headerRows ?? ("rows" in this.page.header ? this.page.header.rows : undefined) ?? 2,
        } as Widget,
        "header",
      );
    this.page.widgets.forEach((w, i) => add(w, String(i)));
    // Widgets kept here from other screens, as their mini versions, after this board's own.
    this.#pins.clear();
    for (const ref of this.#prefs.value.boards[this.#boardKey]?.added ?? []) {
      const found = viewPage(ref.view);
      const w = found && widgetAt(found.page, ref.key);
      if (!w) continue;
      const key = `pin:${ref.view}/${ref.key}${ref.item !== undefined ? `:${ref.item}` : ""}`;
      const copy = { ...w } as Widget;
      if (ref.item !== undefined) onlyItem.set(copy, ref.item);
      this.#pins.set(key, ref);
      add(copy, key);
    }
    const tiles = this.#arranged(out);
    // Something from another board over this one: where it can be let go, first, in view.
    return this.dropping
      ? [
          {
            key: "drop",
            size: "full" as const,
            rows: 2,
            drop: true,
            content: "Keep it here",
          },
          ...tiles,
        ]
      : tiles;
  }

  /** This screen's board in the preferences: its path, a document's id as `:id`. */
  get #boardKey() {
    if (this.board) return this.board;
    let path = location.pathname;
    // One board per view, whichever record its path names (`/cases/:id`).
    for (const [name, value] of Object.entries(this.params))
      path = path.replace(`/${encodeURIComponent(value)}`, `/:${name}`);
    return this.docId ? path.replace(`/${encodeURIComponent(this.docId)}`, "/:id") : path;
  }

  /**
   * The tiles as someone arranged them: hidden ones left out, their widths and heights (inside
   * their widgets' bounds), their order (lenient: a tile added later keeps its place after the one
   * it followed), and what's being moved or resized right now (`live`). Each gets its grab bar and
   * resize corner (`<app-arrange>`); once anything is arranged, a row at the end offers the hidden
   * tiles back and the board's own layout. The board's rules place the result like any other.
   */
  #arranged(items: WidgetItem[]): WidgetItem[] {
    const mine = this.#prefs.value.boards[this.#boardKey] ?? {};
    const live = this.live;
    const hidden = new Set(mine.hidden ?? []);
    const within = (it: WidgetItem) => {
      const b = this.#bounds.get(it.key);
      if (!b) return it;
      const now = live?.key === it.key ? live : undefined;
      // A size someone chose (from before tiles were resized by hand) still holds.
      const want = mine.sizes?.[it.key];
      const size = want && sizesWithin(b).includes(want) ? want : it.size;
      const kept = now?.rows ?? live?.heights?.[it.key] ?? mine.rows?.[it.key];
      const rows = Math.min(b.maxRows, Math.max(b.minRows, kept ?? it.rows));
      const width = now?.span ?? live?.widths?.[it.key] ?? mine.widths?.[it.key];
      const span = width ?? (want && want !== it.size ? undefined : it.span);
      // Placed by hand at a lane (free placement), unless it's being moved somewhere else now.
      const pin = (live?.pins ?? mine.pins)?.[it.key];
      const at = typeof pin === "number" ? pin : pin?.lane;
      const atRow = typeof pin === "number" ? undefined : pin?.row;
      // Sized by hand: the default layout keeps that size.
      const bounds = width !== undefined || kept !== undefined || want ? undefined : it.bounds;
      // Kept places and widths were set on a board this many tiles across (shown live, on this one).
      const arrangedAt = live?.pins || live?.key ? undefined : mine.lanes;
      return { ...it, size, rows, span, at, atRow, bounds, arrangedAt };
    };
    const shown = orderColumns(items.filter((it) => !hidden.has(it.key)).map(within), live?.order ?? mine.order ?? []);
    this.#keys = shown.map((it) => it.key);
    const arranged = !!(
      mine.order?.length ||
      Object.keys(mine.pins ?? {}).length ||
      mine.hidden?.length ||
      Object.keys(mine.sizes ?? {}).length ||
      Object.keys(mine.widths ?? {}).length ||
      Object.keys(mine.rows ?? {}).length
    );
    const tiles = shown.map((it, i) => {
      const arrange: TileArrange = {
        key: it.key,
        label: this.#labels.get(it.key) || "tile",
        bounds: this.#bounds.get(it.key),
        first: i === 0,
        last: i === shown.length - 1,
        lands: (over) => !this.#fixed.has(over) && over !== it.key,
        move: (over, edge, placed, lanes, near) => {
          if (this.#fixed.has(over) || !placed.has(it.key) || !placed.has(over)) return;
          this.#show(insert(this.#boxes(placed), it.key, over, edge, lanes, near, this.#fixed), placed);
        },
        place: (lane, row, placed, lanes) => {
          if (!placed.has(it.key)) return;
          this.#show(putAt(this.#boxes(placed), it.key, { lane, row }, lanes, this.#fixed), placed);
        },
        resize: (span, rows, placed) => {
          const l = this.live;
          if (l?.key === it.key && l.span === span && l.rows === rows) return;
          // The first arrangement keeps every other tile where the default layout put it.
          const keep = !(l?.pins ?? mine.pins) && placed ? this.#keepAll(placed) : {};
          this.live = { ...l, ...keep, key: it.key, span, rows };
        },
        commit: () => this.#commit(),
        cancel: () => (this.live = null),
        step: (to) => this.#step(it.key, to),
        hide: () => {
          const ref = this.#pins.get(it.key);
          if (ref)
            this.#keep((m) => ({
              ...m,
              added: (m.added ?? []).filter((r) => !(r.view === ref.view && r.key === ref.key && r.item === ref.item)),
            }));
          else this.#keep((m) => ({ ...m, hidden: [...(m.hidden ?? []), it.key] }));
        },
      };
      // A fixed tile (the screen's header) gets no handles.
      return this.#fixed.has(it.key)
        ? it
        : // The comment ends the content's part: a part that's its parent's last child runs to the
          // end of whatever parent its nodes are moved into (`<ui-tile-arrange>`'s box), so swapping
          // the content (a loading tile for its first item) cleared the handles after it.
          { ...it, content: html`<app-arrange .arrange=${arrange}>${it.content}<!----></app-arrange>` };
    });
    if (!arranged && !hidden.size) return tiles;
    return [
      ...tiles,
      {
        key: "arranged",
        size: "full" as const,
        rows: 1,
        content: html`<ui-flex justify="end" align="center" gap="2" wrap>
          ${
            hidden.size
              ? html`<ui-button size="xs" variant="text" @click=${() => this.#keep((m) => ({ ...m, hidden: [] }))}
                  >Show ${hidden.size} hidden ${hidden.size === 1 ? "tile" : "tiles"}</ui-button
                >`
              : nothing
          }
          ${
            Object.keys(mine.pins ?? {}).length
              ? html`<ui-button size="xs" variant="text" @click=${() => this.#compact()}>Compact</ui-button>`
              : nothing
          }
          ${
            arranged
              ? html`<ui-button size="xs" variant="text" @click=${() => this.#reset()}>Reset layout</ui-button>`
              : nothing
          }
        </ui-flex>`,
      },
    ];
  }

  /** The board's tiles where they are now (`UiBoard.placed`), the ones this screen arranges. */
  #boxes(placed: ReadonlyMap<string, Placed>): Map<string, Box> {
    return new Map([...placed].filter(([k]) => this.#keys.includes(k)));
  }

  /**
   * Shows the board arranged by hand: every tile pinned where `spots` puts it (free placement, so
   * nothing else moves unless it was pushed: ../../components/base/arrange.ts), its order theirs
   * down the board (top to bottom, start to end).
   */
  #show(spots: Map<string, Spot>, placed: ReadonlyMap<string, Placed>) {
    const pins = Object.fromEntries(spots);
    const at = (k: string) => pins[k] ?? { lane: Infinity, row: Infinity };
    const order = this.#pinned([...this.#keys].sort((a, b) => at(a).row - at(b).row || at(a).lane - at(b).lane));
    const { widths, heights } = this.#keepAll(placed);
    this.live = { ...this.live, order, pins, widths, heights };
  }

  /**
   * Every tile as it is now (`UiBoard.placed`): its place, width and rows. Arranged by hand, a board
   * keeps the default layout's sizes as well as its places (the default layout bends them).
   */
  #keepAll(placed: ReadonlyMap<string, Placed>) {
    const mine = [...this.#boxes(placed)];
    return {
      pins: Object.fromEntries(mine.map(([k, p]) => [k, { lane: p.lane, row: p.row }])),
      widths: Object.fromEntries(mine.map(([k, p]) => [k, p.span])),
      heights: Object.fromEntries(mine.map(([k, p]) => [k, p.rows])),
    };
  }

  /** Changes this board's arrangement in the preferences. */
  #keep(change: (mine: NonNullable<ReturnType<typeof preferences.get>["boards"][string]>) => object) {
    const board = this.#boardKey;
    preferences.set((p) => ({ boards: { ...p.boards, [board]: change({ ...p.boards[board] }) } }));
  }

  /** Closes the gaps left on a board arranged by hand: every tile up as far as it goes in its lanes (`compact`). */
  #compact() {
    const board = this.querySelector<UiBoard>(":scope > ui-board");
    if (!board?.lanes) return;
    const placed = board.placed();
    const pins = Object.fromEntries(compact(this.#boxes(placed), this.#fixed));
    const { widths, heights } = this.#keepAll(placed);
    this.#keep((m) => ({
      ...m,
      pins,
      widths: { ...m.widths, ...widths },
      rows: { ...m.rows, ...heights },
      lanes: board.lanes,
    }));
  }

  #reset() {
    const board = this.#boardKey;
    preferences.set((p) => ({ boards: Object.fromEntries(Object.entries(p.boards).filter(([k]) => k !== board)) }));
  }

  /** Keeps what a drag showed: the order, or a tile's width and height. */
  #commit() {
    const live = this.live;
    this.live = null;
    if (!live) return;
    const lanes = this.querySelector<UiBoard>(":scope > ui-board")?.lanes;
    this.#keep((m) => ({
      ...m,
      ...(lanes ? { lanes } : {}),
      ...(live.order ? { order: live.order } : {}),
      ...(live.pins ? { pins: live.pins } : {}),
      ...(live.widths ? { widths: { ...m.widths, ...live.widths } } : {}),
      ...(live.heights ? { rows: { ...m.rows, ...live.heights } } : {}),
      ...(live.key && live.span !== undefined
        ? {
            widths: { ...m.widths, ...live.widths, [live.key]: live.span },
            rows: { ...m.rows, ...live.heights, [live.key]: live.rows! },
            // A width set by hand replaces a size chosen before.
            sizes: Object.fromEntries(Object.entries(m.sizes ?? {}).filter(([k]) => k !== live.key)),
          }
        : {}),
    }));
  }

  /** Moves a tile from the keyboard: to the start, or a place earlier or later. */
  #step(key: string, to: "start" | "earlier" | "later") {
    const order = [...this.#keys];
    const at = order.indexOf(key);
    if (at < 0) return;
    order.splice(at, 1);
    order.splice(to === "start" ? 0 : to === "earlier" ? Math.max(0, at - 1) : at + 1, 0, key);
    // Placed by hand: it trades places with the tile it steps past (the first one, to the start).
    const keys = this.#keys.filter((k) => !this.#fixed.has(k));
    const i = keys.indexOf(key);
    const other = to === "start" ? keys[0] : to === "earlier" ? keys[i - 1] : keys[i + 1];
    this.#keep((m) => {
      const pins = { ...m.pins };
      if (other && other !== key && pins[key] !== undefined && pins[other] !== undefined)
        [pins[key], pins[other]] = [pins[other]!, pins[key]!];
      return { ...m, order: this.#pinned(order), ...(m.pins ? { pins } : {}) };
    });
  }

  /** An order with every fixed tile (the screen's header) back where it was: the rest move around it. */
  #pinned(order: string[]) {
    const fixed = this.#keys.flatMap((k, i) => (this.#fixed.has(k) ? [[k, i] as const] : []));
    const rest = order.filter((k) => !this.#fixed.has(k));
    for (const [k, i] of fixed) rest.splice(Math.min(i, rest.length), 0, k);
    return rest;
  }

  /**
   * An `each` widget's data, loaded once per version. Null only until it first arrives: on a
   * refresh its tiles stay as they are until the new data is in (no loading tile in between).
   */
  @state() private each = new Map<string, { version: number; data?: unknown; refused?: boolean }>();
  #eachData(key: string, w: Widget) {
    const got = this.each.get(key);
    const last = got && ("data" in got || got.refused) ? got : null;
    if (got?.version === this.version) return last;
    const version = this.version;
    this.each.set(key, { ...got, version });
    if (!w.source) {
      this.each.set(key, { version, data: null });
      return this.each.get(key)!;
    }
    this.fetch(w.source)
      .then((data) => version === this.version && (this.each = new Map(this.each).set(key, { version, data })))
      .catch(() => version === this.version && (this.each = new Map(this.each).set(key, { version, refused: true })));
    return last;
  }

  #report(key: string, size: TileSize | null) {
    if (this.sizes.get(key) === size) return;
    this.sizes = new Map(this.sizes).set(key, size);
  }

  render() {
    // Everything on the screen is a tile on the board, the header first.
    return html`<ui-board .items=${this.#tiles()} ?fit=${this.fit}></ui-board> ${this.#dialog()}`;
  }
}

/**
 * A tile arranged by hand (`<ui-tile-arrange>`: its grab bar and resize corner), and what that does
 * to the board, as gridstack does it: the board holds the tile (`UiBoard.hold`), lifted over the
 * others and following the pointer, and the board is re-arranged live, each time the place it would
 * land changes: the other tiles glide out of its way and a dashed mark shows its place. Dragged by
 * another tile's edge, it goes by that edge; over empty space, where its corner is. Its corner
 * dragged, it follows the pointer in px inside its widget's bounds, and its place takes the whole
 * tiles and rows nearest that size (`resizeTo`). Let go, it springs into its place, which is kept;
 * Escape, or letting go with no place, puts everything back (`TileArrange`). The keyboard steps it,
 * resizes it a tile at a time, or hides it.
 *
 * Every target is worked out against where the tiles were when the drag began (`placed`), never
 * where they're gliding to: the arrangement shown is a function of the pointer alone, so tiles
 * making room never move the target out from under it (no feedback, no flicker).
 */
/** Where a dragged tile goes if let go now: by a tile's edge, at a spot (moving), or its tiles (resizing). */
type DragTo =
  | { over: string; edge: BoardEdge; lane: number }
  | { lane: number; row: number }
  | { span: number; rows: number };

@customElement("app-arrange")
export class AppArrange extends LightElement {
  @property({ attribute: false }) arrange?: TileArrange;
  /** The tile's cell, its board and size when a drag began, and the tile it's over. */
  #from?: {
    cell: HTMLElement;
    board?: UiBoard | null;
    width: number;
    height: number;
    /** Every tile's place when the drag began: what targets are worked out against. */
    placed: ReadonlyMap<string, Placed>;
    /**
     * Where it goes if let go now (shown live): by a tile's edge, at a lane and row in empty space
     * (moving), or its tiles (resizing).
     */
    to?: DragTo;
    /** Where in the tile it was grabbed, in tiles from its top start corner. */
    grab?: { lane: number; row: number };
    /** Moving: where the pointer aims now, and for how many frames it has aimed there (`SETTLE_FRAMES`). */
    aim?: DragTo;
    still: number;
    /** The frame that counts them, while a tile is moved. */
    frame?: number;
    /** What it is, kept on another board (none when it can't be: `pinRefOf`). */
    ref?: PinRef;
    /** Another board it's over now, that keeps it if let go (a side panel's Widgets). */
    out?: AppWidgets;
  };

  #metrics() {
    const scale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
    const tw = tileW(scale);
    const lanes = this.#from?.cell.parentElement?.clientWidth ?? tw;
    return { tw, th: tileH(scale), lanes: Math.max(1, Math.floor(lanes / tw + 0.05)) };
  }

  /**
   * A drag beginning: the board holds the tile; its size and every tile's place are read once (later
   * moves are measured from them).
   */
  #start(e: CustomEvent<TileDrag>, how: "move" | "resize") {
    if (e.detail.phase !== "start") return !this.#from;
    const cell = this.closest<HTMLElement>("[data-board-tile]");
    if (!cell) return true;
    const board = cell.closest<UiBoard>("ui-board");
    const placed = new Map(board?.placed() ?? []);
    this.#from = { cell, board, width: cell.offsetWidth, height: cell.offsetHeight, placed, still: 0 };
    if (how === "move") {
      this.#from.frame = requestAnimationFrame(this.#settle);
      this.#from.ref = this.closest<AppWidgets>("app-widgets")?.pinRefOf(cell.dataset.key!);
    }
    const here = board?.cellAt({ x: e.detail.x, y: e.detail.y });
    const p = placed.get(cell.dataset.key!);
    if (here && p) this.#from.grab = { lane: here.lane - p.lane, row: here.row - p.row };
    board?.hold(cell.dataset.key!, how, { x: e.detail.x, y: e.detail.y });
    return true;
  }

  /** Let go (the arrangement shown is kept) or cancelled (put back): the board springs the tile into its place. */
  #stop(phase: "end" | "cancel") {
    const a = this.arrange!;
    const from = this.#from;
    if (from?.frame !== undefined) cancelAnimationFrame(from.frame);
    // Over another board's Widgets: kept there; here it springs back to its place.
    if (from?.out) {
      from.out.dropTarget(false);
      this.#from = undefined;
      a.cancel();
      from.board?.drop();
      if (phase === "end" && from.ref && from.out.pin(from.ref)) toast(`${a.label} is in your widgets`);
      return;
    }
    // Let go before its target settled: it still goes where the pointer aims.
    if (phase === "end" && from && from.frame !== undefined) this.#preview(from.aim);
    this.#from = undefined;
    if (phase === "end" && from?.to) a.commit();
    else a.cancel();
    from?.board?.drop();
  }

  /**
   * Shows the board as letting go now would leave it, when that has changed: by a tile's edge, at a
   * spot, or (no target) as it was.
   */
  /** Each frame of a move: once the pointer has aimed at one target for `SETTLE_FRAMES`, the board shows it. */
  #settle = () => {
    const from = this.#from;
    if (!from) return;
    if (++from.still >= SETTLE_FRAMES) this.#preview(from.aim);
    from.frame = requestAnimationFrame(this.#settle);
  };

  /** Where the pointer aims a moved tile now: counted from 0 again when that changes. */
  #aim(to: DragTo | undefined) {
    const from = this.#from!;
    if (JSON.stringify(to) === JSON.stringify(from.aim)) return;
    from.aim = to;
    from.still = 0;
  }

  #preview(to: DragTo | undefined) {
    const from = this.#from!;
    const a = this.arrange!;
    if (JSON.stringify(to) === JSON.stringify(from.to)) return;
    from.to = to;
    const lanes = this.#metrics().lanes;
    if (!to) a.cancel();
    else if ("over" in to) a.move(to.over, to.edge, from.placed, lanes, to.lane);
    else if ("row" in to) a.place(to.lane, to.row, from.placed, lanes);
  }

  #onDrag = (e: CustomEvent<TileDrag>) => {
    e.stopPropagation();
    const a = this.arrange;
    if (!a || this.#start(e, "move")) return;
    const d = e.detail;
    if (d.phase === "end" || d.phase === "cancel") return this.#stop(d.phase);
    const from = this.#from!;
    from.board?.follow({ x: d.x, y: d.y });
    // Over another board that keeps widgets (a side panel's Widgets, `board` named): it shows
    // where it can be let go, and this board shows itself as it was.
    const over = from.ref
      ? (document.elementFromPoint(d.x, d.y)?.closest<AppWidgets>("app-widgets") ?? undefined)
      : undefined;
    const out = over && over.board && over !== this.closest("app-widgets") ? over : undefined;
    if (out !== from.out) {
      from.out?.dropTarget(false);
      out?.dropTarget(true);
      from.board?.carry(!!out);
      from.out = out;
    }
    if (out) return this.#aim(undefined);
    // Where it'd go, with magnets, so a target holds from a little way off:
    // 1. an edge of another tile within EDGE_SNAP px of the pointer (or the edge nearest it, over a tile);
    // 2. else empty space: where its top start corner is, or the nearest free spot within SPOT_SNAP tiles;
    // 3. else the nearest edge within EDGE_REACH px.
    const edges = this.#edgesNear(d);
    const close = edges[0] && (edges[0].inside || edges[0].distance <= EDGE_SNAP) ? edges[0] : undefined;
    const spot = close ? undefined : this.#emptySpot(d);
    const far = !close && !spot && edges[0] && edges[0].distance <= EDGE_REACH ? edges[0] : undefined;
    const pick = close ?? far;
    if (spot) return this.#aim(spot);
    if (!pick || !a.lands(pick.key)) return this.#aim(undefined);
    // The lane its top start corner is at now (the pointer less where it was grabbed).
    const here = from.board?.cellAt({ x: d.x, y: d.y });
    const lane = here ? Math.round(here.lane - (from.grab?.lane ?? 0)) : 0;
    this.#aim({ over: pick.key, edge: pick.edge, lane });
  };

  /**
   * The edges of the board's other tiles where they were when the drag began, nearest the pointer
   * first: each tile's start, end, top and bottom edges as segments, the distance from the pointer
   * to each (0 inside the tile, where the nearest edge in the tile's own proportions comes first).
   */
  #edgesNear(d: TileDrag) {
    const from = this.#from!;
    const held = from.cell.dataset.key;
    const rtl = getComputedStyle(from.cell).direction === "rtl";
    const out: { key: string; edge: BoardEdge; distance: number; inside: boolean }[] = [];
    for (const [key, p] of from.placed) {
      if (key === held) continue;
      const r = from.board?.rectOf(p);
      if (!r?.width) continue;
      const inside = d.x >= r.left && d.x <= r.right && d.y >= r.top && d.y <= r.bottom;
      // Outside: the distance to each side's segment; inside: how far into the tile, in proportion.
      const along = (lo: number, hi: number, v: number) => (v < lo ? lo - v : v > hi ? v - hi : 0);
      const sides: [keyof DOMRect & ("left" | "right" | "top" | "bottom"), number][] = inside
        ? [
            ["left", (d.x - r.left) / r.width],
            ["right", (r.right - d.x) / r.width],
            ["top", (d.y - r.top) / r.height],
            ["bottom", (r.bottom - d.y) / r.height],
          ]
        : [
            ["left", Math.hypot(d.x - r.left, along(r.top, r.bottom, d.y))],
            ["right", Math.hypot(d.x - r.right, along(r.top, r.bottom, d.y))],
            ["top", Math.hypot(d.y - r.top, along(r.left, r.right, d.x))],
            ["bottom", Math.hypot(d.y - r.bottom, along(r.left, r.right, d.x))],
          ];
      for (const [side, distance] of sides) {
        const edge: BoardEdge =
          side === "top" || side === "bottom" ? side : (side === "left") !== rtl ? "start" : "end";
        out.push({ key, edge, distance: inside ? distance - 1 : distance, inside });
      }
    }
    // Inside a tile beats any outside edge (its distances are below 0).
    return out.sort((a, b) => a.distance - b.distance);
  }

  /**
   * Over empty space on the board (where the tiles were when the drag began): the lane and row the
   * tile's top start corner would be at (where the pointer is, less where the tile was grabbed),
   * or, if its tiles there aren't free, the nearest spot within `SPOT_SNAP` tiles that is, or else
   * that same spot as a squeeze (it partly fits; the row makes room).
   */
  #emptySpot(d: TileDrag): { lane: number; row: number } | undefined {
    const from = this.#from!;
    const board = from.board;
    const key = from.cell.dataset.key!;
    const here = board?.cellAt({ x: d.x, y: d.y });
    const me = from.placed.get(key);
    if (!board || !here?.inside || !me) return undefined;
    const lane0 = here.lane - (from.grab?.lane ?? 0);
    const row0 = here.row - (from.grab?.row ?? 0);
    const others = [...from.placed].filter(([k]) => k !== key);
    const free = (lane: number, row: number) =>
      !others.some(
        ([, q]) => q.row < row + me.rows && q.row + q.rows > row && q.lane < lane + me.span && q.lane + q.span > lane,
      );
    let best: { lane: number; row: number; far: number } | undefined;
    for (let dl = -SPOT_SNAP; dl <= SPOT_SNAP; dl++)
      for (let dr = -SPOT_SNAP; dr <= SPOT_SNAP; dr++) {
        const lane = Math.round(lane0) + dl;
        const row = Math.round(row0) + dr;
        // Its own place isn't a target to snap to (letting go anywhere with no target puts it back):
        // near it, it squeezes where it's shown instead.
        if (lane < 0 || row < 0 || lane + me.span > here.lanes || !free(lane, row)) continue;
        if (lane === me.lane && row === me.row) continue;
        const far = Math.hypot(lane - lane0, row - row0);
        if (far <= SPOT_SNAP && (!best || far < best.far)) best = { lane, row, far };
      }
    // None free near: a squeeze, where it's shown (the pointer is over empty space, so it partly
    // fits); the row makes room for it (`putAt`).
    best ??= {
      lane: Math.max(0, Math.min(here.lanes - me.span, Math.round(lane0))),
      row: Math.max(0, Math.round(row0)),
      far: 0,
    };
    // Where it already is: nothing to do.
    if (best.lane === me.lane && best.row === me.row) return undefined;
    return { lane: best.lane, row: best.row };
  }

  #onResize = (e: CustomEvent<TileDrag>) => {
    e.stopPropagation();
    const a = this.arrange;
    if (!a?.bounds || this.#start(e, "resize")) return;
    const d = e.detail;
    if (d.phase === "end" || d.phase === "cancel") return this.#stop(d.phase);
    const from = this.#from!;
    const { tw, th, lanes } = this.#metrics();
    const b = a.bounds;
    // Free between tiles while it's dragged, inside its bounds in px; its place, the nearest whole
    // tiles and rows, shown live: the board re-placed around them as they change.
    const most = Math.min(lanes, b.maxSpan ?? lanes);
    const width = Math.min(most * tw, Math.max(Math.min(most, b.minSpan ?? 1) * tw, from.width + d.dx));
    const height = Math.min(b.maxRows * th, Math.max(b.minRows * th, from.height + d.dy));
    const r = resizeTo(b, lanes, width / tw, height / th);
    from.board?.follow({ x: d.x, y: d.y }, { width, height });
    if (from.to && "span" in from.to && from.to.span === r.span && from.to.rows === r.rows) return;
    from.to = { span: r.span, rows: r.rows };
    a.resize(r.span, r.rows, from.placed);
  };

  #onResizeStep = (e: CustomEvent<{ span: number; rows: number }>) => {
    e.stopPropagation();
    const a = this.arrange;
    const cell = this.closest<HTMLElement>("[data-board-tile]");
    if (!a?.bounds || !cell) return;
    this.#from = { cell, width: cell.offsetWidth, height: cell.offsetHeight, placed: new Map(), still: 0 };
    const { tw, th, lanes } = this.#metrics();
    const r = resizeTo(
      a.bounds,
      lanes,
      Math.round(cell.offsetWidth / tw) + e.detail.span,
      Math.round(cell.offsetHeight / th) + e.detail.rows,
    );
    a.resize(r.span, r.rows, cell.closest<UiBoard>("ui-board")?.placed());
    a.commit();
    this.#from = undefined;
  };

  render() {
    const a = this.arrange;
    if (!a) return html`${this.content}`;
    return html`<ui-tile-arrange
      .label=${a.label}
      ?resizable=${!!a.bounds}
      @ui-drag=${this.#onDrag}
      @ui-resize=${this.#onResize}
      @ui-resize-step=${this.#onResizeStep}
      @ui-step=${(e: CustomEvent<{ to: "start" | "earlier" | "later" }>) => {
        e.stopPropagation();
        if (e.detail.to === "later" ? !a.last : !a.first) a.step(e.detail.to);
      }}
      @ui-hide=${(e: Event) => {
        e.stopPropagation();
        a.hide();
      }}
      >${this.content}</ui-tile-arrange
    >`;
  }
}

/**
 * Each tile's height when it last showed, by screen and tile (this session): a skeleton waits at it,
 * so coming back to a screen moves nothing when the data arrives.
 */
const tileHeights = new Map<string, number>();

/** One widget: loads its data, shows a skeleton meanwhile, then its blocks (in a card when it has a title). */
@customElement("app-widget")
export class AppWidget extends LightElement {
  @property({ attribute: false }) widget!: Widget;
  @property({ attribute: false }) host!: AppWidgets;
  @property({ type: Number }) version = 0;
  /** Tells the board the size this widget's tile takes, or null when it shows nothing. */
  @property({ attribute: false }) report?: (size: TileSize | null) => void;
  /** Where its tile's last height is kept (the screen and the tile): its skeleton waits at it. */
  @property({ attribute: false }) memory = "";
  /** Drawn as its mini version (kept on another board: src/app/widgets/mini.ts), opening `open`. */
  @property({ type: Boolean }) mini = false;
  @property({ attribute: false }) open?: string;
  @state() private state: "loading" | "ready" | "denied" | "error" = "loading";
  #size: TileSize | null | undefined;
  @state() private data: unknown = null;
  @state() private message = "";
  #loaded = -1;

  protected willUpdate() {
    if (this.version !== this.#loaded) {
      this.#loaded = this.version;
      void this.#load(this.version);
    }
  }

  async #load(version: number) {
    const source = sourceOf(this.widget);
    if (!source) {
      this.state = "ready";
      return;
    }
    // Keep showing the last data while it refreshes; a skeleton only the first time.
    if (this.data === null) this.state = "loading";
    try {
      const data = await this.host.fetch(source);
      if (version !== this.version) return;
      const show = () => {
        this.data = data;
        this.state = "ready";
      };
      // A first load waits its turn, top of the page first (./paint-queue.ts); a refresh shows at once.
      if (this.state === "loading")
        drawInTurn(this, async () => {
          if (version !== this.version || this.state !== "loading") return;
          show();
          await this.updateComplete;
        });
      else show();
    } catch (e) {
      if (version !== this.version) return;
      this.state = (e as { status?: number }).status === 403 ? "denied" : "error";
      this.message = (e as Error).message;
    }
  }

  /** Remember the tile's size; it goes to the board after this render (`updated`). */
  #sized(size: TileSize | null) {
    this.#size = size;
    // Hidden this time: next time it doesn't hold a skeleton's place (see `render`).
    if (size === null && this.memory) tileHeights.set(this.memory, 0);
    return nothing;
  }

  protected updated() {
    if (this.#size !== undefined) this.report?.(this.#size);
  }

  /** A collection's list: how many records it holds now (`dashboard-list-count`). */
  @state() private count?: number;
  /** A document's form: its title once it has loaded (`dashboard-doc-state`). */
  @state() private docTitle = "";

  /**
   * A collection's list, a document's form or a global's, in its tile: the tile's header is the
   * widget's title (else the collection's, the record's or the global's name), the list's count
   * and the layout menu; the list or the form draws only its body (`tile`), so it is the tile's box,
   * what it holds fades past it and "Show all" asks for more rows, like any widget.
   */
  /**
   * The same object as last time when its content is the same: a page widget's spec is filled in
   * afresh on every render (`fill`), and a new object would read as a new query to the list or form
   * it's handed to (they reload and show their skeleton). So moving or resizing tiles, which
   * re-renders the board, never reloads them.
   */
  #steady = new Map<string, { json: string; value: unknown }>();
  #same<T>(slot: string, value: T): T {
    const json = JSON.stringify(value);
    const was = this.#steady.get(slot);
    if (was?.json === json) return was.value as T;
    this.#steady.set(slot, { json, value });
    return value;
  }

  #pageTile(w: Widget) {
    const scope = this.host.scope;
    let heading = w.title ?? "";
    let body: unknown = nothing;
    if (w.collection) {
      const c = this.#same("collection", fill(w.collection, scope));
      const col = collectionOf(c.collection);
      heading ||= col ? labels(col).plural : c.collection;
      body = html`<dashboard-list-view
        tile
        .slug=${c.collection}
        .stateKey=${c.key ?? c.collection}
        .spec=${c}
        .access=${this.host.access}
        .user=${this.host.user}
        @dashboard-list-count=${(e: CustomEvent<{ count: number }>) => (this.count = e.detail.count)}
      ></dashboard-list-view>`;
    } else if (w.document) {
      const d = this.#same("document", fill(w.document, scope));
      heading ||= this.docTitle;
      body = html`<dashboard-edit-view
        tile
        .slug=${d.collection}
        .docId=${d.id === "create" ? "" : (d.id ?? "")}
        .stateKey=${d.key ?? d.collection}
        .spec=${d}
        .access=${this.host.access}
        .user=${this.host.user}
        @dashboard-doc-state=${(e: CustomEvent<{ title: string }>) => (this.docTitle = e.detail.title)}
      ></dashboard-edit-view>`;
    } else {
      const g = w.global!;
      const global = globalOf(g.global);
      heading ||= global ? globalLabel(global) : g.global;
      body = html`<dashboard-edit-view
        tile
        .globalSlug=${g.global}
        .stateKey=${g.key ?? g.global}
        .spec=${g}
        .access=${this.host.access}
        .user=${this.host.user}
      ></dashboard-edit-view>`;
    }
    this.#sized(w.size ?? "full");
    // `hide: ["header"]`: a bare tile, its body alone.
    const bare = !!((w.collection ?? w.document ?? w.global)?.hide as string[] | undefined)?.includes("header");
    return html`<ui-tile
      .size=${w.size}
      ?bare=${bare}
      .heading=${bare ? "" : heading}
      .subhead=${w.subhead ?? ""}
      .count=${this.count}
      .emphasis=${w.emphasis}
      .kind=${skeletonOf(w)}
      @ui-tile-height=${(e: CustomEvent<{ height: number }>) => {
        e.stopPropagation();
        if (this.memory) tileHeights.set(this.memory, e.detail.height);
      }}
      >${body}</ui-tile
    >`;
  }

  /**
   * The screen's header in its tile: a bare tile (its words are the screen's, not a card's), the
   * same box while its words load (a skeleton of the header) and once they're in.
   */
  #headerTile(w: Widget) {
    const spec = w.header!;
    const h =
      "render" in spec
        ? this.state === "ready"
          ? spec.render(this.data, this.host.scope)
          : null
        : (spec as ViewHeader);
    this.#sized(w.size ?? "full");
    return html`<ui-tile .size=${w.size} bare kind="text"
      >${
        !h
          ? html`<ui-page-header loading></ui-page-header>`
          : html`<ui-page-header .heading=${h.heading} .eyebrow=${h.eyebrow ?? ""} .subtitle=${h.subtitle ?? ""}>
              ${h.tags?.length ? html`<ui-flex slot="status" gap="2" wrap>${h.tags.map(tag)}</ui-flex>` : nothing}
              ${
                h.summary
                  ? html`<ui-ai-summary
                      .label=${h.summary.label}
                      .context=${h.summary.context}
                      .text=${h.summary.text}
                    ></ui-ai-summary>`
                  : nothing
              }
              ${
                h.actions?.length
                  ? html`<ui-flex slot="actions" gap="2" wrap
                      >${h.actions.map((a) => actionButton(a, this.host.ctx))}</ui-flex
                    >`
                  : nothing
              }
            </ui-page-header>`
      }</ui-tile
    >`;
  }

  render() {
    const w = this.widget;
    const scope = this.host.scope;
    if (w.header) return this.#headerTile(w);
    if (w.collection || w.document || w.global) return this.#pageTile(w);
    // While loading, a tile that was hidden last time (or, on a first visit, a widget that may hide
    // itself once its data is in and doesn't say it usually shows: `expect`) holds no skeleton,
    // and a tile that draws nothing takes no lanes on the board: one that then vanished moved the
    // tiles after it. If it does show, it comes in (a fade) and the tiles after it make room.
    if (this.state === "loading") {
      const last = tileHeights.get(this.memory);
      if (last === 0 || (last === undefined && w.hidden && w.expect !== "shown")) return nothing;
    }
    if (this.state === "denied" && !w.denied) return this.#sized(null);
    if (this.state === "ready" && w.hidden?.(this.data as never, scope)) return this.#sized(null);
    if (this.state === "ready") this.#sized(w.size ?? "s");
    const all = this.state === "ready" ? asBlocks(w.render?.(this.data as never, scope)) : [];
    const cut = this.mini ? miniBlocks(all) : all;
    // A mini figure or chart: its one line alone, bare, named by the widget's title (`miniRows` gives it a tile).
    const one = this.mini && (!w.title || skeletonOf(w) === "stats" || skeletonOf(w) === "chart");
    const figure = this.mini ? miniFigure(cut, w.title) : undefined;
    const blocks =
      figure ??
      (this.mini && this.state === "ready" && !cut.length && this.open
        ? miniOpen(this.open, w.title ?? "its screen")
        : cut);
    const title = one || figure ? undefined : w.title;
    // Every widget is a tile; a titled one is a surface its content knows it's in (cards become
    // panels, entries become rows). An untitled one steers the screen: a bare tile.
    const ctx = title ? inCard(this.host.ctx) : this.host.ctx;
    const body =
      this.state === "loading"
        ? nothing
        : this.state === "denied"
          ? html`<ui-alert tone="info">${w.denied}</ui-alert>`
          : this.state === "error"
            ? html`<ui-alert tone="error" heading="This couldn't load">${this.message}</ui-alert>`
            : renderBlocks(blocks, ctx);
    const head = this.state === "ready" ? w.head?.(this.data as never, scope) : undefined;
    // A mini version: its title and count, no subhead, tags or actions.
    const subhead = this.mini ? "" : (head?.subhead ?? w.subhead ?? "");
    // One trailing group, there from the first render: a slotted element is routed to the header
    // when the tile first draws, so what arrives with the data (tags, actions, the layout menu)
    // goes inside it rather than beside it.
    const trailing = title
      ? html`<ui-flex slot="trailing" gap="1" align="center" wrap
          >${this.mini ? nothing : head?.tags?.map(tag)}${
            this.mini ? nothing : head?.actions?.map((a) => actionButton(a, this.host.ctx))
          }</ui-flex
        >`
      : nothing;
    return html`<ui-tile
      .size=${w.size}
      .heading=${title ?? ""}
      .subhead=${subhead}
      .count=${head?.count}
      .countTone=${head?.countTone}
      .emphasis=${title ? w.emphasis : undefined}
      ?loading=${this.state === "loading"}
      ?bare=${!title}
      .kind=${w.skeleton}
      @ui-tile-height=${(e: CustomEvent<{ height: number }>) => {
        e.stopPropagation();
        if (this.memory) tileHeights.set(this.memory, e.detail.height);
      }}
      >${trailing} ${body}</ui-tile
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-widgets": AppWidgets;
    "app-widget": AppWidget;
    "app-arrange": AppArrange;
  }
}
