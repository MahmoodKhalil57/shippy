import { html, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LightElement, uid } from "../../base/light-element.ts";
import type { ButtonVariants } from "../../primitives/actions/button.ts";
import type { JoinVariants } from "../../primitives/layout/join.ts";
import "../../primitives/actions/button.ts";
import "../../primitives/layout/join.ts";
import "../../primitives/media/icon.ts";
import { pageSlots, type PageSlot } from "../../base/page-slots.ts";
import { m } from "../../../i18n/index.ts";

export type PaginationMode = "numbers" | "radio" | "prev-next";

interface PageButton {
  active?: boolean;
  disabled?: boolean;
  current?: string;
  label?: string;
  onClick?: () => void;
}

@customElement("ui-pagination")
export class UiPagination extends LightElement {
  @property({ type: Number, reflect: true }) page = 1;
  @property({ type: Number }) total = 1;
  @property({ type: Number }) siblings = 1;
  @property() mode: PaginationMode = "numbers";
  @property() direction: JoinVariants["direction"];
  @property() size: ButtonVariants["size"];
  @property() color: ButtonVariants["color"];
  @property() variant: ButtonVariants["variant"];
  @property({ type: Boolean, attribute: "prev-next" }) prevNext = false;
  @property({ attribute: "prev-label" }) prevLabel = "";
  @property({ attribute: "next-label" }) nextLabel = "";
  @property() name = uid("page");
  @property() label = m.pagination_label();

  @state() private _narrow = false;
  private _fullWidth = 0;
  private _resize = new ResizeObserver(() => this._fit());

  connectedCallback() {
    super.connectedCallback();
    if (this.parentElement) this._resize.observe(this.parentElement);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resize.disconnect();
  }

  protected updated() {
    const nav = this.querySelector("nav");
    if (nav && !this._narrow) this._resize.observe(nav);
  }

  private _fit() {
    if (this.mode !== "numbers" || !this.parentElement) return;
    if (!this._narrow) this._fullWidth = this.querySelector("nav")?.scrollWidth ?? 0;
    const narrow = this._fullWidth > this.parentElement.clientWidth;
    if (narrow !== this._narrow) this._narrow = narrow;
  }

  go(page: number) {
    const p = Math.min(Math.max(1, page), Math.max(1, this.total));
    if (p === this.page) return;
    this.page = p;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { page: p }, bubbles: true }));
  }

  protected pages(): PageSlot[] {
    return pageSlots(this.page, this.total, this.siblings);
  }

  private _button(content: string | number | TemplateResult, o: PageButton = {}): TemplateResult {
    return html`<ui-button
      .size=${this.size}
      .color=${o.active ? this.color : undefined}
      .variant=${this.variant}
      toggle
      .selected=${!!o.active}
      .disabled=${!!o.disabled}
      .current=${o.current}
      .label=${o.label}
      @click=${() => o.onClick?.()}
      >${content}</ui-button
    >`;
  }

  private _arrow(dir: -1 | 1) {
    const text = dir < 0 ? this.prevLabel : this.nextLabel;
    const icon = html`<ui-icon name=${dir < 0 ? "chevron-left" : "chevron-right"} size="sm"></ui-icon>`;
    return this._button(text || icon, {
      disabled: dir < 0 ? this.page <= 1 : this.page >= this.total,
      label: dir < 0 ? m.pagination_previous() : m.pagination_next(),
      onClick: () => this.go(this.page + dir),
    });
  }

  render() {
    if (this.mode === "prev-next") {
      return html`<ui-join as="nav" .label=${this.label} equal> ${this._arrow(-1)} ${this._arrow(1)} </ui-join>`;
    }

    if (this.mode === "radio") {
      return html`<ui-join .label=${this.label} .direction=${this.direction}>
        ${Array.from({ length: Math.max(1, this.total) }, (_, i) => i + 1).map(
          (p) =>
            html`<ui-button
              type="radio"
              .size=${this.size}
              .variant=${this.variant}
              .name=${this.name}
              .value=${String(p)}
              .label=${String(p)}
              .checked=${p === this.page}
              @change=${() => this.go(p)}
            ></ui-button>`,
        )}
      </ui-join>`;
    }

    if (this._narrow)
      return html`<ui-join as="nav" .label=${this.label}>
        ${this._arrow(-1)}
        ${this._button(`${this.page} / ${Math.max(1, this.total)}`, {
          active: true,
          current: "page",
          label: m.pagination_page_of({ page: this.page, total: Math.max(1, this.total) }),
        })}
        ${this._arrow(1)}
      </ui-join>`;

    return html`<ui-join as="nav" .label=${this.label} .direction=${this.direction}>
      ${this.prevNext ? this._arrow(-1) : ""}
      ${this.pages().map((p) =>
        typeof p === "object"
          ? this._button("…", {
              label: m.pagination_pages_range({ from: p.from, to: p.to }),
              onClick: () => this.go(Math.round((p.from + p.to) / 2)),
            })
          : this._button(p, {
              active: p === this.page,
              current: p === this.page ? "page" : undefined,
              onClick: () => this.go(p),
            }),
      )}
      ${this.prevNext ? this._arrow(1) : ""}
    </ui-join>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-pagination": UiPagination;
  }
}
