import { html, nothing } from "lit";
import { localizeConfig } from "../../i18n/index.ts";
import { drawInTurn } from "./paint-queue.ts";
import { yieldToMain } from "../../components/base/work-queue.ts";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../api/client.ts";
import type { Doc, FieldLike } from "../../contracts/config.ts";
import type { Access } from "../app.ts";
import { LightElement } from "../../components/base/light-element.ts";
import "../../components/index.ts";
import {
  addressOf,
  dashboardPath,
  collectionOf,
  collectionSettings,
  componentOf,
  dashboardView,
  globalLabel,
  formFields,
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

const EDGE_SNAP = 24;
const EDGE_REACH = 80;
const SPOT_SNAP = 2;
export const SETTLE_FRAMES = 8;
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
import { intl, m } from "../../i18n/index.ts";
import { inCard, renderBlocks, type ViewContext } from "./registry.ts";
import { miniBlocks, miniFigure, miniOpen, miniRows } from "./mini.ts";
import type { Action, UndoCall, ViewBlock, ViewHeader } from "./schema.ts";
import type { TileSize } from "./tile.ts";
import { doneText, undoOf, type ActionReply } from "./undo.ts";
import {
  eachSlots,
  eachTiles,
  fill,
  KEPT_LINE,
  type Source,
  type Widget,
  type WidgetPage,
  type WidgetScope,
} from "./widget.ts";
import.meta.glob("./blocks/*.ts", { eager: true });

export { fill };

export async function loadSource(
  s: Source,
  scope: WidgetScope,
  nested: (s: Source) => Promise<unknown> = (x) => loadSource(x, scope),
): Promise<unknown> {
  if ("all" in s)
    return Object.fromEntries(await Promise.all(Object.entries(s.all).map(async ([k, x]) => [k, await nested(x)])));
  if ("endpoint" in s) return localizeConfig(await api.get(s.endpoint, s.query));
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

const PAGE_ROWS = 12;

const FORM_HEAD_ROWS = 3;
const FORM_FIELD_ROWS = 1.5;
const FORM_MAX_ROWS = 40;
function pageRows(w: Widget): number {
  if (w.collection) return PAGE_ROWS;
  const config = w.document ? collectionOf(w.document.collection) : w.global ? globalOf(w.global.global) : undefined;
  const fields = config ? formFields(config as never).length : 0;
  return Math.min(FORM_MAX_ROWS, Math.max(PAGE_ROWS, Math.ceil(FORM_HEAD_ROWS + fields * FORM_FIELD_ROWS)));
}

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

const sourceOf = (w: Widget): Source | undefined =>
  w.source ?? (w.header && "render" in w.header ? w.header.source : undefined);

export interface PinRef {
  view: string;
  key: string;
  item?: string;
}

function viewPage(view: string): { page: WidgetPage; path: string; title: string } | undefined {
  if (view === "dashboard") {
    const page = componentOf(dashboardView()?.Component)?.props.page as WidgetPage | undefined;
    return page && { page, path: "/", title: m.widget_dashboard() };
  }
  const v = rootViews().find((r) => r.key === view);
  const page = v && (componentOf(v.Component)?.props.page as WidgetPage | undefined);
  return v && page && { page, path: v.path, title: titleOfView(v) };
}

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

export interface TileArrange {
  key: string;
  label: string;
  bounds?: TileBounds;
  first: boolean;
  last: boolean;
  lands(over: string): boolean;
  move(over: string, edge: BoardEdge, placed: ReadonlyMap<string, Placed>, lanes: number, lane: number): void;
  place(lane: number, row: number, placed: ReadonlyMap<string, Placed>, lanes: number): void;
  resize(span: number, rows: number, placed?: ReadonlyMap<string, Placed>): void;
  commit(): void;
  cancel(): void;
  step(to: "start" | "earlier" | "later"): void;
  hide(): void;
}

@customElement("app-widgets")
export class AppWidgets extends LightElement {
  #prefs = new StoreController(this, preferences, undefined, {
    changed: (s, p) => s.boards[this.#boardKey] !== p.boards[this.#boardKey],
  });
  @property({ attribute: false }) page: WidgetPage = { widgets: [] };
  @property({ attribute: false }) params: Record<string, string> = {};
  @property() docId = "";
  @property() slug = "";
  @property({ attribute: false }) user?: Doc;
  @property() board = "";
  @property({ type: Boolean }) fit = false;
  @property({ attribute: false }) access?: Access;
  @state() private live: {
    order?: string[];
    pins?: Record<string, number | { lane: number; row: number }>;
    widths?: Record<string, number>;
    heights?: Record<string, number>;
    key?: string;
    span?: number;
    rows?: number;
  } | null = null;
  #keys: string[] = [];
  @state() version = 0;
  @state() private sizes = new Map<string, TileSize | null>();
  @state() private pending: Action | null = null;
  @state() private draft: Record<string, unknown> = {};
  @state() private busy = false;
  @state() private failed = "";
  #cache = new Map<string, Promise<unknown>>();
  #mounted = new Map<string, HTMLElement>();
  #sources = new Map<string, { base: string; item?: string }>();
  #pins = new Map<string, PinRef>();
  @state() private dropping = false;

  dropTarget(on: boolean) {
    if (this.dropping !== on) this.dropping = on;
  }

  pinRefOf(tileKey: string): PinRef | undefined {
    if (this.docId || this.board || tileKey === "header") return undefined;
    const source = this.#sources.get(tileKey);
    if (!source) return undefined;
    const w = widgetAt(this.page, source.base);
    if (!w || w.collection || w.document || w.global || w.header) return undefined;
    const views = [{ key: "dashboard", path: "/" }, ...rootViews()];
    const view = views.find((v) => viewPage(v.key)?.page === this.page);
    if (!view || pathParams(view.path).length) return undefined;
    return { view: view.key, key: source.base, item: source.item };
  }

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

  async refresh() {
    this.reload();
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

  async #call(a: Action, values: Record<string, unknown> = {}) {
    if (!a.call) return;
    this.busy = true;
    let r: ActionReply | null;
    try {
      r = await api.call<ActionReply | null>(a.call.method ?? "POST", a.call.path, { ...a.call.body, ...values });
    } catch (e) {
      const msg = (e as Error).message || m.widget_failed();
      if (this.pending) this.failed = msg;
      else toast(msg, "error");
      return;
    } finally {
      this.busy = false;
    }
    this.pending = null;
    const undo = undoOf(r, a);
    const message = doneText(r, a, !!undo);
    if (message)
      toast(message, "success", undo && { label: m.widget_undo(), undo: true, onClick: () => void this.#undo(undo) });
    if (a.reply && typeof r?.href === "string") {
      const same = new URL(r.href, location.href).pathname === location.pathname;
      void this.run({ label: a.label, href: r.href });
      if (!same) return;
    }
    await this.refresh();
  }

  async #undo(u: UndoCall) {
    try {
      const r = await api.call<ActionReply | null>(u.method ?? "POST", u.path, u.body ?? {});
      toast(u.done ?? (typeof r?.message === "string" && r.message ? r.message : m.widget_undone()));
    } catch (e) {
      toast((e as Error).message || m.widget_undo_failed(), "error");
    }
    for (const host of this.isConnected ? [this] : document.querySelectorAll("app-widgets")) void host.refresh();
  }

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
      this.failed = m.widget_fill_in({ fields: intl.list().format(missing.map((f) => f.label ?? f.name)) });
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
                .useLabel=${m.widget_fill_in_button()}
                .source=${a.extract.source ?? "paste"}
                .label=${a.extract.label}
                .what=${a.extract.what}
                .placeholder=${a.extract.placeholder ?? m.widget_paste_placeholder()}
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

  protected willUpdate(changed: Map<PropertyKey, unknown>) {
    if (changed.has("page") && changed.get("page") !== undefined) {
      this.sizes = new Map();
    }
  }

  #bounds = new Map<string, TileBounds>();
  #labels = new Map<string, string>();
  #fixed = new Set<string>();

  #tiles(): WidgetItem[] {
    const out: WidgetItem[] = [];
    const tile = (key: string, size: TileSize, w: Widget) => {
      const memory = `${this.#boardKey}|${key}`;
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
      const pinned = this.#pins.get(this.#sources.get(key)?.base ?? key);
      const mini = !!pinned;
      const b = mini
        ? (() => {
            const rows = this.#sources.get(key)?.item !== undefined ? 2 : miniRows(!!w.title, skeletonOf(w));
            return boundsOf({ size: "full", minSize: "full", rows, minRows: rows, maxRows: rows });
          })()
        : boundsOf({
            ...w,
            size,
            rows: w.rows ?? (page ? pageRows(w) : defaultRows(skeletonOf(w), size)),
            kind: page ? "table" : skeletonOf(w),
          });
      this.#bounds.set(key, b);
      out.push({
        key,
        size: b.size,
        rows: b.rows,
        reflow: mini ? 1 : reflowOf(skeletonOf(w)),
        bounds: b,
        fixed: !!w.header,
        maxSpan: w.maxWidth,
        maxRows: w.maxRows,
        span: w.width && Math.min(w.maxWidth ?? w.width, Math.max(w.minWidth ?? w.width, w.width)),
        content: html`<app-widget
          .widget=${expand(w, this.scope)}
          .host=${this}
          .version=${this.version}
          .memory=${memory}
          .report=${(s: TileSize | null) => this.#report(key, s)}
          .mini=${mini}
          .open=${pinned ? viewPage(pinned.view)?.path : undefined}
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
      if (w.collection || w.document || w.global) {
        aroundOf(w, "before").forEach((x, i) => add(x, `${key}.b${i}`));
        if (this.sizes.get(key) !== null) tile(key, w.size ?? fallback ?? "full", w);
        aroundOf(w, "after").forEach((x, i) => add(x, `${key}.a${i}`));
        return;
      }
      if (this.sizes.get(key) === null) return;
      if ((w.counts && !w.title) || w.metrics) w = expand(w, this.scope);
      const size = w.size ?? fallback ?? "s";
      if (w.each) {
        const got = this.#eachData(key, w);
        if (!got || got.refused) {
          const slots = eachSlots(w, this.scope);
          slots.forEach((slot, i) => {
            const k = i === 0 ? key : `${key}:${slot}`;
            if (only !== undefined && slot !== only) return;
            this.#sources.set(k, { base: key, item: slot });
            tile(k, size, w);
            out[out.length - 1]!.content = got?.refused
              ? html`<ui-tile .size=${size} .heading=${w.title ?? ""} ?bare=${!w.title}
                  ><ui-alert tone="info">${w.denied ?? m.widget_denied()}</ui-alert></ui-tile
                >`
              : html`<ui-tile
                  .size=${size}
                  .heading=${w.title ?? ""}
                  .subhead=${w.each!.subhead ? KEPT_LINE : ""}
                  ?bare=${!w.title}
                  .kind=${w.skeleton}
                  loading
                ></ui-tile>`;
            if (!w.title && w.each!.slots) this.#labels.set(k, w.each!.name?.(slot, this.scope) ?? slot);
          });
          return;
        }
        eachTiles(w, got.data as never, this.scope).forEach((t, i) => {
          if (only !== undefined && t.key !== only) return;
          const k = i === 0 || only !== undefined ? key : `${key}:${t.key}`;
          this.#sources.set(k, { base: key, item: t.key });
          tile(k, size, t.widget as Widget);
          if (!t.widget.title) this.#labels.set(k, w.each!.name?.(t.key, this.scope) ?? t.key);
        });
        return;
      }
      this.#sources.set(key, { base: key });
      tile(key, size, w);
    };
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
    return this.dropping
      ? [
          {
            key: "drop",
            size: "full" as const,
            rows: 2,
            drop: true,
            content: m.widget_host_keep_here(),
          },
          ...tiles,
        ]
      : tiles;
  }

  get #boardKey() {
    if (this.board) return this.board;
    let path = location.pathname;
    for (const [name, value] of Object.entries(this.params))
      path = path.replace(`/${encodeURIComponent(value)}`, `/:${name}`);
    return this.docId ? path.replace(`/${encodeURIComponent(this.docId)}`, "/:id") : path;
  }

  #arranged(items: WidgetItem[]): WidgetItem[] {
    const mine = this.#prefs.value.boards[this.#boardKey] ?? {};
    const live = this.live;
    const hidden = new Set(mine.hidden ?? []);
    const within = (it: WidgetItem) => {
      const b = this.#bounds.get(it.key);
      if (!b) return it;
      const now = live?.key === it.key ? live : undefined;
      const want = mine.sizes?.[it.key];
      const size = want && sizesWithin(b).includes(want) ? want : it.size;
      const kept = now?.rows ?? live?.heights?.[it.key] ?? mine.rows?.[it.key];
      const rows = Math.min(b.maxRows, Math.max(b.minRows, kept ?? it.rows));
      const width = now?.span ?? live?.widths?.[it.key] ?? mine.widths?.[it.key];
      const span = width ?? (want && want !== it.size ? undefined : it.span);
      const pin = (live?.pins ?? mine.pins)?.[it.key];
      const at = typeof pin === "number" ? pin : pin?.lane;
      const atRow = typeof pin === "number" ? undefined : pin?.row;
      const bounds = width !== undefined || kept !== undefined || want ? undefined : it.bounds;
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
        label: this.#labels.get(it.key) || m.widget_host_tile(),
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
      return this.#fixed.has(it.key)
        ? it
        : { ...it, content: html`<app-arrange .arrange=${arrange}>${it.content}<!----></app-arrange>` };
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
                  >${m.widget_host_show_hidden({ count: hidden.size })}</ui-button
                >`
              : nothing
          }
          ${
            Object.keys(mine.pins ?? {}).length && this._gaps
              ? html`<ui-button size="xs" variant="text" @click=${() => this.#compact()}
                  >${m.widget_host_compact()}</ui-button
                >`
              : nothing
          }
          ${
            arranged
              ? html`<ui-button size="xs" variant="text" @click=${() => this.#reset()}
                  >${m.widget_host_reset_layout()}</ui-button
                >`
              : nothing
          }
        </ui-flex>`,
      },
    ];
  }

  #boxes(placed: ReadonlyMap<string, Placed>): Map<string, Box> {
    return new Map([...placed].filter(([k]) => this.#keys.includes(k)));
  }

  #show(spots: Map<string, Spot>, placed: ReadonlyMap<string, Placed>) {
    const pins = Object.fromEntries(spots);
    const at = (k: string) => pins[k] ?? { lane: Infinity, row: Infinity };
    const order = this.#pinned([...this.#keys].sort((a, b) => at(a).row - at(b).row || at(a).lane - at(b).lane));
    const { widths, heights } = this.#keepAll(placed);
    this.live = { ...this.live, order, pins, widths, heights };
  }

  #keepAll(placed: ReadonlyMap<string, Placed>) {
    const mine = [...this.#boxes(placed)];
    return {
      pins: Object.fromEntries(mine.map(([k, p]) => [k, { lane: p.lane, row: p.row }])),
      widths: Object.fromEntries(mine.map(([k, p]) => [k, p.span])),
      heights: Object.fromEntries(mine.map(([k, p]) => [k, p.rows])),
    };
  }

  #keep(change: (mine: NonNullable<ReturnType<typeof preferences.get>["boards"][string]>) => object) {
    const board = this.#boardKey;
    preferences.set((p) => ({ boards: { ...p.boards, [board]: change({ ...p.boards[board] }) } }));
  }

  @state() private _gaps = false;

  protected updated() {
    const board = this.querySelector<UiBoard>(":scope > ui-board");
    if (!board) return;
    void board.updateComplete.then(() => {
      if (!board.lanes) return;
      const boxes = this.#boxes(board.placed());
      const gaps = [...compact(boxes, this.#fixed)].some(([k, spot]) => boxes.get(k)?.row !== spot.row);
      if (gaps !== this._gaps) this._gaps = gaps;
    });
  }

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
            sizes: Object.fromEntries(Object.entries(m.sizes ?? {}).filter(([k]) => k !== live.key)),
          }
        : {}),
    }));
  }

  #step(key: string, to: "start" | "earlier" | "later") {
    const order = [...this.#keys];
    const at = order.indexOf(key);
    if (at < 0) return;
    order.splice(at, 1);
    order.splice(to === "start" ? 0 : to === "earlier" ? Math.max(0, at - 1) : at + 1, 0, key);
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

  #pinned(order: string[]) {
    const fixed = this.#keys.flatMap((k, i) => (this.#fixed.has(k) ? [[k, i] as const] : []));
    const rest = order.filter((k) => !this.#fixed.has(k));
    for (const [k, i] of fixed) rest.splice(Math.min(i, rest.length), 0, k);
    return rest;
  }

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
    return html`<ui-board .items=${this.#tiles()} ?fit=${this.fit}></ui-board> ${this.#dialog()}`;
  }
}

type DragTo =
  | { over: string; edge: BoardEdge; lane: number }
  | { lane: number; row: number }
  | { span: number; rows: number };

@customElement("app-arrange")
export class AppArrange extends LightElement {
  @property({ attribute: false }) arrange?: TileArrange;
  #from?: {
    cell: HTMLElement;
    board?: UiBoard | null;
    width: number;
    height: number;
    placed: ReadonlyMap<string, Placed>;
    to?: DragTo;
    grab?: { lane: number; row: number };
    aim?: DragTo;
    still: number;
    frame?: number;
    ref?: PinRef;
    out?: AppWidgets;
  };

  #metrics() {
    const scale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
    const tw = tileW(scale);
    const lanes = this.#from?.cell.parentElement?.clientWidth ?? tw;
    return { tw, th: tileH(scale), lanes: Math.max(1, Math.floor(lanes / tw + 0.05)) };
  }

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

  #stop(phase: "end" | "cancel") {
    const a = this.arrange!;
    const from = this.#from;
    if (from?.frame !== undefined) cancelAnimationFrame(from.frame);
    if (from?.out) {
      from.out.dropTarget(false);
      this.#from = undefined;
      a.cancel();
      from.board?.drop();
      if (phase === "end" && from.ref && from.out.pin(from.ref)) toast(m.widget_host_kept({ name: a.label }));
      return;
    }
    if (phase === "end" && from && from.frame !== undefined) this.#preview(from.aim);
    this.#from = undefined;
    if (phase === "end" && from?.to) a.commit();
    else a.cancel();
    from?.board?.drop();
  }

  #settle = () => {
    const from = this.#from;
    if (!from) return;
    if (++from.still >= SETTLE_FRAMES) this.#preview(from.aim);
    from.frame = requestAnimationFrame(this.#settle);
  };

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
    const edges = this.#edgesNear(d);
    const close = edges[0] && (edges[0].inside || edges[0].distance <= EDGE_SNAP) ? edges[0] : undefined;
    const spot = close ? undefined : this.#emptySpot(d);
    const far = !close && !spot && edges[0] && edges[0].distance <= EDGE_REACH ? edges[0] : undefined;
    const pick = close ?? far;
    if (spot) return this.#aim(spot);
    if (!pick || !a.lands(pick.key)) return this.#aim(undefined);
    const here = from.board?.cellAt({ x: d.x, y: d.y });
    const lane = here ? Math.round(here.lane - (from.grab?.lane ?? 0)) : 0;
    this.#aim({ over: pick.key, edge: pick.edge, lane });
  };

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
    return out.sort((a, b) => a.distance - b.distance);
  }

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
        if (lane < 0 || row < 0 || lane + me.span > here.lanes || !free(lane, row)) continue;
        if (lane === me.lane && row === me.row) continue;
        const far = Math.hypot(lane - lane0, row - row0);
        if (far <= SPOT_SNAP && (!best || far < best.far)) best = { lane, row, far };
      }
    best ??= {
      lane: Math.max(0, Math.min(here.lanes - me.span, Math.round(lane0))),
      row: Math.max(0, Math.round(row0)),
      far: 0,
    };
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

const tileHeights = new Map<string, number>();

@customElement("app-widget")
export class AppWidget extends LightElement {
  @property({ attribute: false }) widget!: Widget;
  @property({ attribute: false }) host!: AppWidgets;
  @property({ type: Number }) version = 0;
  @property({ attribute: false }) report?: (size: TileSize | null) => void;
  @property({ attribute: false }) memory = "";
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
    if (this.data === null) this.state = "loading";
    try {
      const data = await this.host.fetch(source);
      if (version !== this.version) return;
      const show = () => {
        this.data = data;
        this.state = "ready";
      };
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

  #sized(size: TileSize | null) {
    this.#size = size;
    if (size === null && this.memory) tileHeights.set(this.memory, 0);
    return nothing;
  }

  protected updated() {
    if (this.#size !== undefined) this.report?.(this.#size);
  }

  @state() private count?: number;
  @state() private docTitle = "";

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
        .ctx=${this.host.ctx}
        .scope=${this.host.scope}
        @dashboard-list-count=${(e: CustomEvent<{ count: number }>) => (this.count = e.detail.count)}
      ></dashboard-list-view>`;
    } else if (w.document) {
      const d = this.#same("document", fill(w.document, scope));
      if (!d.home) heading ||= this.docTitle;
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
      if (!g.home) heading ||= global ? globalLabel(global) : g.global;
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
    const list = w.collection ? this.#same("collection", fill(w.collection, this.host.scope)) : undefined;
    const listPage =
      list && !list.home && !list.hide?.includes("all")
        ? addressOf(`/collections/${encodeURIComponent(list.collection)}`)
        : null;
    const bare = !!((w.collection ?? w.document ?? w.global)?.hide as string[] | undefined)?.includes("header");
    return html`<ui-tile
      .size=${w.size}
      ?bare=${bare}
      scrolls
      .heading=${bare ? "" : heading}
      .subhead=${w.subhead ?? ""}
      .count=${this.count}
      .emphasis=${w.emphasis}
      .kind=${skeletonOf(w)}
      @ui-tile-height=${(e: CustomEvent<{ height: number }>) => {
        e.stopPropagation();
        if (this.memory) tileHeights.set(this.memory, e.detail.height);
      }}
      >${
        listPage && !bare
          ? html`<ui-button
              slot="trailing"
              size="xs"
              variant="text"
              href=${dashboardPath("collections", list!.collection)}
              >${m.widget_host_all()}</ui-button
            >`
          : nothing
      }${body}</ui-tile
    >`;
  }

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
    if (this.state === "ready") this.#sized(w.size ?? "s");
    const nothingToShow = this.state === "ready" && !!w.empty?.when?.(this.data as never, scope);
    const all =
      this.state !== "ready"
        ? []
        : nothingToShow
          ? [{ type: "empty", heading: w.empty!.heading, description: w.empty!.description } as ViewBlock]
          : asBlocks(w.render?.(this.data as never, scope));
    const cut = this.mini ? miniBlocks(all) : all;
    const figure = this.mini ? miniFigure(cut, w.title) : undefined;
    const blocks =
      figure ??
      (this.mini && this.state === "ready" && !cut.length && this.open
        ? miniOpen(this.open, w.title ?? m.widget_host_its_screen())
        : cut);
    const title = figure ? undefined : w.title;
    const ctx = title ? inCard(this.host.ctx) : this.host.ctx;
    const body =
      this.state === "loading"
        ? nothing
        : this.state === "denied"
          ? html`<ui-alert tone="info">${w.denied ?? m.widget_denied()}</ui-alert>`
          : this.state === "error"
            ? html`<ui-alert tone="error" .heading=${m.widget_load_failed()}>${this.message}</ui-alert>`
            : renderBlocks(blocks, ctx);
    const head = this.state === "ready" ? w.head?.(this.data as never, scope) : undefined;
    const subhead = this.mini ? "" : head?.subhead || w.subhead || "";
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
