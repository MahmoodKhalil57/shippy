import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../api/client.ts";
import type { Doc, FieldLike } from "../../contracts/config.ts";
import { LightElement } from "../../components/base/light-element.ts";
import "../../components/index.ts";
import { toast } from "../shared.ts";
import { action as actionButton, tag } from "./blocks.ts";
import { expand } from "./data.ts";
import { inCard, renderBlocks, type ViewContext } from "./registry.ts";
import type { Action, ViewBlock, ViewHeader } from "./schema.ts";
import { fill, type Source, type Widget, type WidgetPage, type WidgetScope } from "./widget.ts";
// More blocks: the app's own (./blocks/*.ts), each registering itself with `defineBlock`.
import.meta.glob("./blocks/*.ts", { eager: true });

/**
 * Draws a screen of widgets (./widget.ts): `<app-widgets .page=${{ header, params, widgets }}>`,
 * set from the config by `widgets({ … })` through Payload's component slots.
 *
 * Each widget loads its own data and shows a skeleton until it arrives; the same request made by
 * several widgets goes out once. The host runs actions (navigation, a confirmation or a small
 * form, the request, a snackbar, then every widget reloads) and keeps the screen's parameters
 * in the URL, so a reload or a shared link shows the same thing. Elements placed by `custom`
 * blocks are kept across reloads and may fire `app-widgets-reload` to ask for fresh data.
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

@customElement("app-widgets")
export class AppWidgets extends LightElement {
  @property({ attribute: false }) page: WidgetPage = { widgets: [] };
  /** In an edit tab: the document's id and collection. */
  @property() docId = "";
  @property() slug = "";
  @property({ attribute: false }) user?: Doc;
  /** Bumped on every reload: each widget refetches when it changes. */
  @state() version = 0;
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

  run(action: Action) {
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
    void this.#call(a);
  }

  async #call(a: Action, values: Record<string, unknown> = {}) {
    if (!a.call) return;
    this.busy = true;
    try {
      const r = await api.call<{ message?: unknown; href?: unknown } | null>(a.call.method ?? "POST", a.call.path, {
        ...a.call.body,
        ...values,
      });
      this.pending = null;
      const said = a.reply && typeof r?.message === "string" ? r.message : "";
      if (a.done || said) toast(a.done ?? said);
      if (a.reply && typeof r?.href === "string") {
        // Another page draws itself; the same page (only its parameters changed) reloads.
        const same = new URL(r.href, location.href).pathname === location.pathname;
        this.run({ label: a.label, href: r.href });
        if (!same) return;
      }
      this.reload();
    } catch (e) {
      const msg = (e as Error).message || "That didn't work.";
      if (this.pending) this.failed = msg;
      else toast(msg, "error");
    } finally {
      this.busy = false;
    }
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

  protected willUpdate() {
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

  #widget(w: Widget): TemplateResult | typeof nothing {
    if (w.visible && !w.visible(this.scope)) return nothing;
    if (w.grid) return html`<ui-grid fit="md" gap="4">${w.grid.map((x) => this.#widget(x))}</ui-grid>`;
    if (w.split)
      return html`<ui-grid
        sidebar
        gap="4"
        .items=${[
          {
            role: "main",
            content: html`<ui-flex direction="col" gap="4">${w.split.main.map((x) => this.#widget(x))}</ui-flex>`,
          },
          {
            role: "side",
            content: html`<ui-flex direction="col" gap="4">${w.split.side.map((x) => this.#widget(x))}</ui-flex>`,
          },
        ]}
      ></ui-grid>`;
    return html`<app-widget .widget=${expand(w, this.scope)} .host=${this} .version=${this.version}></app-widget>`;
  }

  #header() {
    const h = this.docId ? null : this.header;
    if (!h) return nothing;
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
        >${this.#header()} ${this.page.widgets.map((w) => this.#widget(w))}</ui-flex
      >
      ${this.#dialog()}`;
  }
}

/** One widget: loads its data, shows a skeleton meanwhile, then its blocks (in a card when it has a title). */
@customElement("app-widget")
export class AppWidget extends LightElement {
  @property({ attribute: false }) widget!: Widget;
  @property({ attribute: false }) host!: AppWidgets;
  @property({ type: Number }) version = 0;
  @state() private state: "loading" | "ready" | "denied" | "error" = "loading";
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
      this.data = data;
      this.state = "ready";
    } catch (e) {
      if (version !== this.version) return;
      this.state = (e as { status?: number }).status === 403 ? "denied" : "error";
      this.message = (e as Error).message;
    }
  }

  #skeleton() {
    switch (this.widget.skeleton) {
      case "stats":
        return html`<ui-grid fit="xs" gap="4"
          >${[0, 1, 2].map(() => html`<ui-skeleton shape="block"></ui-skeleton>`)}</ui-grid
        >`;
      case "table":
      case "list":
        return html`<ui-flex direction="col" gap="3"
          >${[0, 1, 2, 3].map(() => html`<ui-skeleton shape="line"></ui-skeleton>`)}</ui-flex
        >`;
      case "entries":
        return html`<ui-grid fit="md" gap="4"
          >${[0, 1].map(() => html`<ui-skeleton shape="block"></ui-skeleton>`)}</ui-grid
        >`;
      case "text":
        return html`<ui-flex direction="col" gap="2"
          ><ui-skeleton shape="line"></ui-skeleton><ui-skeleton shape="line" width="52"></ui-skeleton
        ></ui-flex>`;
      default:
        return html`<ui-skeleton shape="block"></ui-skeleton>`;
    }
  }

  render() {
    const w = this.widget;
    const scope = this.host.scope;
    if (this.state === "denied" && !w.denied) return nothing;
    if (this.state === "ready" && w.hidden?.(this.data as never, scope)) return nothing;
    const blocks = this.state === "ready" ? asBlocks(w.render?.(this.data as never, scope)) : [];
    // A titled widget of entries is a section (a heading over the entries' cards), never a card
    // around cards; any other titled widget is a card, and what it draws knows it's in one.
    const section = !!w.title && (w.skeleton === "entries" || blocks.some((b) => b.type === "entries"));
    const ctx = w.title && !section ? inCard(this.host.ctx) : this.host.ctx;
    const body =
      this.state === "loading"
        ? this.#skeleton()
        : this.state === "denied"
          ? html`<ui-alert tone="info">${w.denied}</ui-alert>`
          : this.state === "error"
            ? html`<ui-alert tone="error" heading="This couldn't load">${this.message}</ui-alert>`
            : renderBlocks(blocks, ctx);
    if (!w.title) return body;
    const head = this.state === "ready" ? w.head?.(this.data as never, scope) : undefined;
    const subhead = head?.subhead ?? w.subhead ?? "";
    const trailing = (slot?: string) =>
      head?.tags?.length || head?.actions?.length
        ? html`<ui-flex slot=${slot ?? nothing} gap="2" align="center" wrap
            >${head.tags?.map(tag)}${head.actions?.map((a) => actionButton(a, this.host.ctx))}</ui-flex
          >`
        : nothing;
    if (section)
      return html`<ui-flex direction="col" gap="3">
        <ui-flex direction="col" gap="1">
          <ui-flex gap="2" align="center" justify="between" wrap>
            <ui-flex gap="2" align="center">
              <ui-heading level="2" variant="title-lg">${w.title}</ui-heading>
              ${
                head?.count !== undefined
                  ? html`<ui-badge show-zero .count=${head.count} .tone=${head.countTone}></ui-badge>`
                  : nothing
              }
            </ui-flex>
            ${trailing()}
          </ui-flex>
          ${subhead ? html`<ui-text variant="body-md" color="muted">${subhead}</ui-text>` : nothing}
        </ui-flex>
        ${body}
      </ui-flex>`;
    return html`<ui-card .subhead=${subhead} .count=${head?.count} .countTone=${head?.countTone}>
      <span slot="heading">${w.title}</span>
      ${trailing("trailing")} ${body}
    </ui-card>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-widgets": AppWidgets;
    "app-widget": AppWidget;
  }
}
