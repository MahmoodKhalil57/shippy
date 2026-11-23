import { html, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LightElement, uid } from "../../base/light-element.ts";
import type { ButtonVariants } from "../../primitives/actions/button.ts";
import type { JoinVariants } from "../../primitives/layout/join.ts";
import "../../primitives/actions/button.ts";
import "../../primitives/layout/join.ts";
import "../../primitives/media/icon.ts";
import { pageSlots, type PageSlot } from "../../base/page-slots.ts";

/**
 * Pagination: Group of buttons for moving between related content.
 *
 * Purpose: Navigation · Kind: composed (Join + Button)
 * Docs: https://daisyui.com/components/pagination/
 *
 * daisyUI has no pagination class: it's a Join of Buttons (or radio inputs
 * styled as Buttons). Built only from `ui-join` and `ui-button`.
 */

/** `numbers`: page buttons with ellipses; `radio`: radio inputs (form value); `prev-next`: only previous/next. */
export type PaginationMode = "numbers" | "radio" | "prev-next";

interface PageButton {
  active?: boolean;
  disabled?: boolean;
  current?: string;
  label?: string;
  onClick?: () => void;
}

/**
 * @example <ui-pagination page="2" total="10" size="sm"></ui-pagination>
 * @example <ui-pagination mode="prev-next" variant="outline" page="3" total="10"></ui-pagination>
 * @example <ui-pagination mode="radio" name="page" total="4"></ui-pagination>
 *
 * Pages are 1-based. Long ranges collapse to `1 … 4 5 6 … 99`: always `siblings × 2 + 5` buttons
 * once there are more pages than that (`pageSlots`, proved by tests/page-slots.test.ts), so hundreds of pages take the same room as seven. Each "…" is a
 * button too: it jumps to the middle of the pages it leaves out ("Pages 7 to 93"). The previous and
 * next buttons are chevrons (mirrored right to left) with their names for assistive tech, unless
 * `prev-label` / `next-label` say otherwise. Fires `ui-change` with `{ page }`.
 *
 * Fluid: when the page numbers don't fit the row it's in (a phone-width card), it shows
 * « 3 / 12 » instead, and the numbers again once the row is wide enough.
 */
@customElement("ui-pagination")
export class UiPagination extends LightElement {
  @property({ type: Number, reflect: true }) page = 1;
  @property({ type: Number }) total = 1;
  /** Pages shown on each side of the current page before collapsing. */
  @property({ type: Number }) siblings = 1;
  @property() mode: PaginationMode = "numbers";
  @property() direction: JoinVariants["direction"];
  @property() size: ButtonVariants["size"];
  @property() color: ButtonVariants["color"];
  @property() variant: ButtonVariants["variant"];
  /** Show « / » buttons around the numbers. */
  @property({ type: Boolean, attribute: "prev-next" }) prevNext = false;
  /** Text for the previous / next buttons instead of their chevrons. */
  @property({ attribute: "prev-label" }) prevLabel = "";
  @property({ attribute: "next-label" }) nextLabel = "";
  /** Radio group name (radio mode). */
  @property() name = uid("page");
  @property() label = "Pagination";

  /** The numbers don't fit: show the current page of the total between the arrows. */
  @state() private _narrow = false;
  /** The width the numbers need, measured when they were last shown. */
  private _fullWidth = 0;
  private _resize = new ResizeObserver(() => this._fit());

  connectedCallback() {
    super.connectedCallback();
    // The host has no box (`display: contents`): the room is the parent's.
    if (this.parentElement) this._resize.observe(this.parentElement);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resize.disconnect();
  }

  protected updated() {
    // The buttons draw after this element does: watch the numbers' own size too.
    const nav = this.querySelector("nav");
    // Measured in the observer's callback (observing reports at once, after the browser's own
    // layout), never here: reading sizes right after a render laid the whole page out again.
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

  /** Page numbers to show, with runs of pages left out (src/components/base/page-slots.ts). */
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
    // Right to left, previous points right.
    const back = dir < 0 !== (this.closest("[dir]")?.getAttribute("dir") === "rtl");
    const icon = html`<ui-icon name=${back ? "chevron-left" : "chevron-right"} size="sm"></ui-icon>`;
    return this._button(text || icon, {
      disabled: dir < 0 ? this.page <= 1 : this.page >= this.total,
      label: dir < 0 ? "Previous page" : "Next page",
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
          label: `Page ${this.page} of ${Math.max(1, this.total)}`,
        })}
        ${this._arrow(1)}
      </ui-join>`;

    return html`<ui-join as="nav" .label=${this.label} .direction=${this.direction}>
      ${this.prevNext ? this._arrow(-1) : ""}
      ${this.pages().map((p) =>
        typeof p === "object"
          ? this._button("…", {
              label: `Pages ${p.from} to ${p.to}`,
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
