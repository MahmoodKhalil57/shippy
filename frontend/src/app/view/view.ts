import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../cms/client.ts";
import { LightElement } from "../../components/base/light-element.ts";
import type { FieldLike } from "../../cms/types.ts";
import "../../components/index.ts";
import { toast } from "../shared.ts";
import { action as actionButton, tag } from "./blocks.ts";
// More blocks: the app's own (./blocks/*.ts) and the project's (src/cms/components/*.ts), each
// registering itself with `defineBlock`.
import.meta.glob("./blocks/*.ts", { eager: true });
import.meta.glob("../../cms/components/*.ts", { eager: true });
import { renderBlocks, type ViewContext } from "./registry.ts";
import type { Action, View } from "./schema.ts";

/**
 * Draws a `View` (./schema.ts) that an endpoint returns: `src` is its path below /api, e.g.
 * `/views/case-profit/<id>`. Handles loading, errors and a refusal (403), runs actions
 * (navigation, confirmation, a small form, the request, a snackbar, a reload) and keeps the
 * view's `choice` parameters in the page URL, so a reload or a shared link shows the same thing.
 *
 * Project elements in `custom` blocks are kept across reloads; they fire `app-view-reload` to
 * ask for fresh data.
 */
@customElement("app-view")
export class AppView extends LightElement {
  /** The endpoint, below /api. In an edit tab, `:id` is the document's id. */
  @property() src = "";
  /** Set in an edit tab: the document's id. The tab sits under the document's own header. */
  @property() docId = "";
  @state() private view: View | null = null;
  @state() private error = "";
  @state() private denied = false;
  @state() private pending: Action | null = null;
  @state() private draft: Record<string, unknown> = {};
  @state() private busy = false;
  @state() private failed = "";
  #mounted = new Map<string, HTMLElement>();
  #loaded = "";

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("app-view-reload", this.#onReload);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("app-view-reload", this.#onReload);
  }
  #onReload = (e: Event) => {
    e.stopPropagation();
    void this.load();
  };

  protected willUpdate() {
    if (this.src && this.path !== this.#loaded) {
      this.#loaded = this.path;
      this.#mounted.clear();
      this.view = null;
      void this.load();
    }
  }

  private get path() {
    return this.src.replace(":id", encodeURIComponent(this.docId));
  }

  private get params(): Record<string, string> {
    return Object.fromEntries(new URLSearchParams(location.search));
  }

  async load() {
    try {
      this.error = "";
      this.denied = false;
      this.view = await api.get<View>(this.path, this.params);
    } catch (e) {
      this.denied = (e as { status?: number }).status === 403;
      this.error = (e as Error).message;
    }
  }

  private ctx: ViewContext = {
    run: (a) => this.run(a),
    setParam: (param, value) => {
      const url = new URL(location.href);
      url.searchParams.set(param, value);
      history.replaceState(history.state, "", url);
      void this.load();
    },
    reload: () => void this.load(),
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

  run(a: Action) {
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
      return;
    }
    void this.call(a);
  }

  private async call(a: Action, values: Record<string, unknown> = {}) {
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
      if (a.reply && typeof r?.href === "string") return this.run({ label: a.label, href: r.href });
      await this.load();
    } catch (e) {
      const msg = (e as Error).message || "That didn't work.";
      if (this.pending) this.failed = msg;
      else toast(msg, "error");
    } finally {
      this.busy = false;
    }
  }

  private _confirm() {
    const a = this.pending;
    if (!a) return;
    const missing = (a.fields ?? []).filter(
      (f) => f.required && (this.draft[f.name] === undefined || this.draft[f.name] === ""),
    );
    if (missing.length) {
      this.failed = `Fill in ${missing.map((f) => f.label ?? f.name).join(", ")}.`;
      return;
    }
    void this.call(a, this.draft);
  }

  private _dialog() {
    const a = this.pending;
    return html`<ui-modal
      .open=${!!a}
      .heading=${a?.confirm?.heading ?? a?.prompt ?? a?.label ?? ""}
      .confirmLabel=${a?.confirm?.label ?? a?.label ?? ""}
      .confirmTone=${a?.confirm?.tone ?? a?.tone ?? "primary"}
      ?confirm-disabled=${this.busy}
      @ui-confirm=${() => this._confirm()}
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
                  if (e.target === e.currentTarget) this.draft = e.detail.value;
                }}
              ></ui-doc-form>`
            : nothing
        }
        ${
          a?.assist
            ? html`<ui-ai-tools
                .tools=${a.assist.tools}
                .value=${typeof this.draft[a.assist.field] === "string" ? this.draft[a.assist.field] : ""}
                @ui-change=${(e: CustomEvent<{ value: string }>) =>
                  (this.draft = { ...this.draft, [a.assist!.field]: e.detail.value })}
              ></ui-ai-tools>`
            : nothing
        }
        ${this.failed ? html`<ui-alert tone="error">${this.failed}</ui-alert>` : nothing}
      </ui-flex>
    </ui-modal>`;
  }

  render() {
    if (this.denied)
      return html`<ui-empty-state
        icon="shield"
        heading="Not available to your role"
        .description=${this.error || "Ask an administrator if you need this."}
      ></ui-empty-state>`;
    if (this.error)
      return html`<ui-empty-state
        tone="error"
        heading="This page couldn't load"
        .description=${this.error}
      ></ui-empty-state>`;
    const v = this.view;
    if (!v) return html`<ui-empty-state loading></ui-empty-state>`;
    const h = this.docId ? undefined : v.header;
    return html`<ui-flex direction="col" gap="6">
        ${
          h
            ? html`<ui-page-header .heading=${h.heading} .eyebrow=${h.eyebrow ?? ""} .subtitle=${h.subtitle ?? ""}>
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
                        >${h.actions.map((a) => actionButton(a, this.ctx))}</ui-flex
                      >`
                    : nothing
                }
              </ui-page-header>`
            : nothing
        }
        ${renderBlocks(v.blocks, this.ctx)}
      </ui-flex>
      ${this._dialog()}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-view": AppView;
  }
}
