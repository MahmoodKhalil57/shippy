import { html, nothing } from "lit";
import { drawInTurn } from "./paint-queue.ts";
import { yieldToMain } from "../../components/base/work-queue.ts";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../api/client.ts";
import type { Doc, FieldLike } from "../../contracts/config.ts";
import { LightElement } from "../../components/base/light-element.ts";
import "../../components/index.ts";
import { toast } from "../shared.ts";
import { action as actionButton, tag } from "./blocks.ts";
import { expand } from "./data.ts";
import { orderColumns } from "../../components/base/columns.ts";
import type { BoardItem } from "../../components/primitives/layout/board.ts";
import { preferences, StoreController } from "../../stores/index.ts";
import { inCard, renderBlocks, type ViewContext } from "./registry.ts";
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

/** What a tile's layout menu does (personal arrangement of a board). */
export interface TileArrange {
  size: TileSize;
  first: boolean;
  last: boolean;
  /** Something on this board was arranged by hand (offer Reset). */
  arranged: boolean;
  hidden: number;
  act(what: "start" | "earlier" | "later" | "hide" | "unhide" | "reset" | TileSize): void;
}

const SIZE_LABEL: Record<TileSize, string> = {
  s: "Small · 1 lane",
  m: "Medium · 2 lanes",
  l: "Large · 3 lanes",
  full: "Full width",
};

@customElement("app-widgets")
export class AppWidgets extends LightElement {
  #prefs = new StoreController(this, preferences);
  @property({ attribute: false }) page: WidgetPage = { widgets: [] };
  /** In an edit tab: the document's id and collection. */
  @property() docId = "";
  @property() slug = "";
  @property({ attribute: false }) user?: Doc;
  /** Bumped on every reload: each widget refetches when it changes. */
  @state() version = 0;
  /** Each widget's size once it has drawn (null: hidden), by its key on the board. */
  @state() private sizes = new Map<string, TileSize | null>();
  @state() private header: ViewHeader | null = null;
  @state() private pending: Action | null = null;
  @state() private draft: Record<string, unknown> = {};
  @state() private busy = false;
  @state() private failed = "";
  #cache = new Map<string, Promise<unknown>>();
  #mounted = new Map<string, HTMLElement>();
  #headerFor = -1;

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
    return {
      user,
      doc: this.docId ? { id: this.docId, slug: this.slug } : undefined,
      params: { ...this.page.params, ...Object.fromEntries(new URLSearchParams(location.search)) },
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
      // Another page's header is never shown on this one: it loads afresh (a skeleton meanwhile).
      this.header = null;
      this.#headerFor = -1;
    }
    const h = this.page.header;
    if (!h || !("render" in h)) this.header = h ?? null;
    else if (!h.source) this.header = h.render(null, this.scope);
    else if (this.#headerFor !== this.version) {
      this.#headerFor = this.version;
      const version = this.version;
      this.fetch(h.source)
        .then((d) => version === this.version && (this.header = h.render(d, this.scope)))
        .catch(() => (this.header = null));
    }
  }

  /**
   * The screen's widgets as the board's tiles, in order. A `grid` or `split` lays out nothing of its
   * own any more: its widgets are tiles too (a split's main ones `l` and its side ones `s`, unless
   * they say). A widget that's hidden for this user, or once its data is in, takes no tile.
   */
  #tiles(): BoardItem[] {
    const out: BoardItem[] = [];
    const tile = (key: string, size: TileSize, w: Widget) =>
      out.push({
        key,
        size,
        content: html`<app-widget
          .widget=${expand(w, this.scope)}
          .host=${this}
          .version=${this.version}
          .memory=${`${this.#boardKey}|${key}`}
          .report=${(s: TileSize | null) => this.#report(key, s)}
        ></app-widget>`,
      });
    const add = (w: Widget, key: string, fallback?: TileSize) => {
      if (w.visible && !w.visible(this.scope)) return;
      if (w.grid) return w.grid.forEach((x, i) => add(x, `${key}.${i}`, fallback));
      if (w.split) {
        w.split.main.forEach((x, i) => add(x, `${key}.m${i}`, "l"));
        w.split.side.forEach((x, i) => add(x, `${key}.s${i}`, "s"));
        return;
      }
      if (this.sizes.get(key) === null) return;
      const size = w.size ?? fallback ?? "s";
      // One tile per item, once the data is in; a loading tile until then.
      if (w.each) {
        const got = this.#eachData(key, w);
        if (!got) return out.push({ key, size, content: html`<ui-tile .size=${size} loading></ui-tile>` });
        if (got.refused || w.hidden?.(got.data as never, this.scope)) return;
        for (const t of eachTiles(w, got.data as never, this.scope)) tile(`${key}:${t.key}`, size, t.widget as Widget);
        return;
      }
      tile(key, size, w);
    };
    this.page.widgets.forEach((w, i) => add(w, String(i)));
    return this.#arranged(out);
  }

  /** This screen's board in the preferences: its path, a document's id as `:id`. */
  get #boardKey() {
    const path = location.pathname;
    return this.docId ? path.replace(`/${encodeURIComponent(this.docId)}`, "/:id") : path;
  }

  /**
   * The tiles as someone arranged them: hidden ones left out, their sizes, their order (lenient:
   * a tile added later keeps its place after the one it followed). Then each titled tile gets
   * its layout menu. The board's rules place the result like any other.
   */
  #arranged(items: BoardItem[]): BoardItem[] {
    const mine = this.#prefs.value.boards[this.#boardKey] ?? {};
    const hidden = new Set(mine.hidden ?? []);
    const shown = orderColumns(
      items.filter((it) => !hidden.has(it.key)).map((it) => ({ ...it, size: mine.sizes?.[it.key] ?? it.size })),
      mine.order ?? [],
    );
    const keys = shown.map((it) => it.key);
    const arranged = !!(mine.order?.length || mine.hidden?.length || Object.keys(mine.sizes ?? {}).length);
    return shown.map((it, i) => ({
      ...it,
      content: html`<app-arrange
        .arrange=${
          {
            size: it.size,
            first: i === 0,
            last: i === shown.length - 1,
            arranged,
            hidden: hidden.size,
            act: (what: Parameters<TileArrange["act"]>[0]) => this.#arrange(it.key, keys, what),
          } satisfies TileArrange
        }
        >${it.content}</app-arrange
      >`,
    }));
  }

  #arrange(key: string, keys: string[], what: Parameters<TileArrange["act"]>[0]) {
    const board = this.#boardKey;
    preferences.set((p) => {
      const mine = { ...p.boards[board] };
      const order = [...keys];
      const at = order.indexOf(key);
      if (what === "start" || what === "earlier" || what === "later") {
        order.splice(at, 1);
        order.splice(what === "start" ? 0 : what === "earlier" ? Math.max(0, at - 1) : at + 1, 0, key);
        mine.order = order;
      } else if (what === "hide") mine.hidden = [...(mine.hidden ?? []), key];
      else if (what === "unhide") mine.hidden = [];
      else if (what === "reset")
        return { boards: Object.fromEntries(Object.entries(p.boards).filter(([k]) => k !== board)) };
      else mine.sizes = { ...mine.sizes, [key]: what };
      return { boards: { ...p.boards, [board]: mine } };
    });
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

  #header() {
    const h = this.docId ? null : this.header;
    if (!h) {
      // A header still loading takes its place as a skeleton of its height, so the board under it
      // doesn't drop when the words arrive.
      const loading = !this.docId && !!this.page.header && "render" in this.page.header && !!this.page.header.source;
      return loading ? html`<ui-page-header loading></ui-page-header>` : nothing;
    }
    return html`<ui-page-header .heading=${h.heading} .eyebrow=${h.eyebrow ?? ""} .subtitle=${h.subtitle ?? ""}>
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
          ? html`<ui-flex slot="actions" gap="2" wrap>${h.actions.map((a) => actionButton(a, this.ctx))}</ui-flex>`
          : nothing
      }
    </ui-page-header>`;
  }

  render() {
    return html`<ui-flex direction="col" gap="6"
        >${this.#header()}<ui-board .items=${this.#tiles()}></ui-board
      ></ui-flex>
      ${this.#dialog()}`;
  }
}

/**
 * A tile's layout menu (personal arrangement), handed to the widget inside: Move to start /
 * earlier / later, its size, Hide, and Show hidden / Reset layout for the board.
 */
@customElement("app-arrange")
export class AppArrange extends LightElement {
  @property({ attribute: false }) arrange?: TileArrange;

  protected updated() {
    for (const w of this.querySelectorAll("app-widget")) (w as AppWidget).arrange = this.arrange;
  }

  render() {
    return html`${this.content}`;
  }
}

/** The layout menu in a tile's header. */
export function arrangeMenu(a: TileArrange | undefined, title: string) {
  if (!a) return nothing;
  const items = [
    ...(a.first
      ? []
      : [
          { label: "Move to start", value: "start" },
          { label: "Move earlier", value: "earlier" },
        ]),
    ...(a.last ? [] : [{ label: "Move later", value: "later" }]),
    ...(["s", "m", "l", "full"] as TileSize[]).map((s, i) => ({
      label: SIZE_LABEL[s],
      value: s,
      checked: a.size === s,
      separator: i === 0,
    })),
    { label: "Hide this tile", value: "hide", separator: true },
    ...(a.hidden ? [{ label: `Show hidden tiles (${a.hidden})`, value: "unhide" }] : []),
    ...(a.arranged ? [{ label: "Reset layout", value: "reset", destructive: true }] : []),
  ];
  return html`<ui-dropdown
    mode="popover"
    align="end"
    trigger-variant="text"
    trigger-size="xs"
    trigger-shape="round"
    .triggerLabel=${`${title}: layout`}
    .items=${items}
    @ui-select=${(e: CustomEvent<{ item: { value: Parameters<TileArrange["act"]>[0] } }>) => {
      e.stopPropagation();
      a.act(e.detail.item.value);
    }}
    ><span slot="trigger">⋯</span></ui-dropdown
  >`;
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
  /** Its tile's layout menu (set by `<app-arrange>`). */
  @property({ attribute: false }) arrange?: TileArrange;
  /** Where its tile's last height is kept (the screen and the tile): its skeleton waits at it. */
  @property({ attribute: false }) memory = "";
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
    const source = this.widget.source;
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
    return nothing;
  }

  protected updated() {
    if (this.#size !== undefined) this.report?.(this.#size);
  }

  render() {
    const w = this.widget;
    const scope = this.host.scope;
    if (this.state === "denied" && !w.denied) return this.#sized(null);
    if (this.state === "ready" && w.hidden?.(this.data as never, scope)) return this.#sized(null);
    if (this.state === "ready") this.#sized(w.size ?? "s");
    const blocks = this.state === "ready" ? asBlocks(w.render?.(this.data as never, scope)) : [];
    // Every widget is a tile; a titled one is a surface its content knows it's in (cards become
    // panels, entries become rows). An untitled one steers the screen: a bare tile.
    const ctx = w.title ? inCard(this.host.ctx) : this.host.ctx;
    const body =
      this.state === "loading"
        ? nothing
        : this.state === "denied"
          ? html`<ui-alert tone="info">${w.denied}</ui-alert>`
          : this.state === "error"
            ? html`<ui-alert tone="error" heading="This couldn't load">${this.message}</ui-alert>`
            : renderBlocks(blocks, ctx);
    const head = this.state === "ready" ? w.head?.(this.data as never, scope) : undefined;
    const subhead = head?.subhead ?? w.subhead ?? "";
    // One trailing group, there from the first render: a slotted element is routed to the header
    // when the tile first draws, so what arrives with the data (tags, actions, the layout menu)
    // goes inside it rather than beside it.
    const trailing = w.title
      ? html`<ui-flex slot="trailing" gap="1" align="center" wrap
          >${head?.tags?.map(tag)}${head?.actions?.map((a) => actionButton(a, this.host.ctx))}${arrangeMenu(
            this.arrange,
            w.title,
          )}</ui-flex
        >`
      : nothing;
    return html`<ui-tile
      .size=${w.size}
      .heading=${w.title ?? ""}
      .subhead=${subhead}
      .count=${head?.count}
      .countTone=${head?.countTone}
      .emphasis=${w.title ? w.emphasis : undefined}
      ?loading=${this.state === "loading"}
      ?bare=${!w.title}
      .kind=${w.skeleton}
      .waitHeight=${tileHeights.get(this.memory)}
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
