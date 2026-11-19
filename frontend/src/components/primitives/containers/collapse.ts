import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, uid, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Collapse: Shows and hides content.
 *
 * Purpose: Content containers & disclosure · Kind: primitive
 * Docs: https://daisyui.com/components/collapse/
 */
/**
 * `!visible`: Tailwind v4 also has a `collapse` utility (`visibility: collapse`), and on some pages
 * it wins over daisyUI's component, hiding the whole thing; this keeps it visible.
 */
export const collapse = rcva("collapse !visible", {
  variants: {
    icon: {
      arrow: "collapse-arrow",
      plus: "collapse-plus",
    },
    /** Force the state regardless of focus/checkbox (not supported by `<details>`). */
    force: {
      open: "collapse-open",
      close: "collapse-close",
    },
    /** Default border + background used throughout the daisyUI examples. */
    bordered: { true: "bg-base-100 border border-base-300" },
    /** Custom colours that switch while focused ("custom colors ... with focus"). */
    color: {
      primary: "bg-primary text-primary-content focus:bg-secondary focus:text-secondary-content",
    },
  },
  defaultVariants: { bordered: true },
});

export const collapseTitle = rcva("collapse-title font-semibold", {
  variants: {
    /** Move the arrow/plus icon to the start ("moving collapse icon to the start"). */
    iconPosition: { start: "after:start-5 after:end-auto pe-4 ps-12", end: "" },
    /** Custom colours that switch while the checkbox is checked. */
    color: {
      primary: "bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content",
    },
  },
});
export const collapseContent = rcva("collapse-content text-sm", {
  variants: {
    color: {
      primary: "bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content",
    },
    /** Above the click-outside overlay. */
    raised: { true: "z-1" },
  },
});
/** Hidden checkbox driving the peer-checked colours / overlay. */
export const collapseToggle = rcva("peer");
/** Full-screen label that closes a checkbox collapse when clicking outside it. */
export const collapseOutside = rcva("fixed inset-0 hidden peer-checked:block");

export type CollapseVariants = VariantProps<typeof collapse>;

/**
 * How the open state is driven:
 * - `focus`: opens while focused, closes when focus leaves.
 * - `checkbox`: toggles on click (hidden checkbox).
 * - `radio`: like `checkbox`, but collapses sharing a `name` open one at a time
 *   and can't all be closed (the docs' accordion).
 * - `details`: native `<details>/<summary>`; content is searchable with Ctrl+F.
 *   With a shared `name`, one opens at a time.
 */
export type CollapseMode = "focus" | "checkbox" | "radio" | "details";

/**
 * @example
 * <ui-collapse heading="Click to open" icon="arrow" mode="checkbox">
 *   Hidden content
 * </ui-collapse>
 *
 * @example <ui-collapse heading="Colours" color="primary">Changes colour while open</ui-collapse>
 * @example <ui-collapse heading="Close by clicking outside" mode="checkbox" close-outside>…</ui-collapse>
 *
 * The title can be rich markup instead: `<span slot="title">…</span>`.
 * Native `change` (checkbox mode) and the `ui-toggle` event (all modes) bubble out.
 * `color` switches colour while open: on focus in `focus` mode, on the checkbox
 * in `checkbox` mode (not supported by `details`).
 */
@customElement("ui-collapse")
export class UiCollapse extends LightElement {
  @property() heading: Renderable = "";
  @property() mode: CollapseMode = "focus";
  @property() icon: CollapseVariants["icon"];
  @property() force: CollapseVariants["force"];
  @property() color: CollapseVariants["color"];
  @property({ attribute: "icon-position" }) iconPosition: VariantProps<typeof collapseTitle>["iconPosition"];
  @property({ converter: responsiveBoolean }) bordered: Responsive<boolean> = true;
  @property({ type: Boolean, reflect: true }) open = false;
  /** Checkbox mode: clicking anywhere outside closes it. */
  @property({ type: Boolean, attribute: "close-outside" }) closeOutside = false;
  /** Group name (`radio` / `details` modes). */
  @property() name?: string;

  private _id = uid("collapse");

  private _title() {
    return this.hasSlotted("title") ? this.slotted("title") : this.heading;
  }

  private _toggle(open: boolean) {
    this.open = open;
    this.dispatchEvent(new CustomEvent("ui-toggle", { detail: { open }, bubbles: true }));
  }

  render() {
    const input = this.mode === "checkbox" || this.mode === "radio" ? this.mode : undefined;
    const checkbox = !!input;
    const cls = collapse({
      icon: this.icon,
      force: this.force,
      bordered: this.bordered,
      color: checkbox ? undefined : this.color,
    });
    const title = this._title();
    const titleCls = collapseTitle({ iconPosition: this.iconPosition, color: checkbox ? this.color : undefined });
    const contentCls = collapseContent({
      color: checkbox ? this.color : undefined,
      raised: checkbox && this.closeOutside,
    });

    if (this.mode === "details") {
      return html`<details
        class=${cls}
        name=${ifDefined(this.name)}
        ?open=${this.open}
        @toggle=${(e: Event) => this._toggle((e.target as HTMLDetailsElement).open)}
      >
        <summary class=${collapseTitle({ iconPosition: this.iconPosition })}>${title}</summary>
        <div class=${collapseContent()}>${this.slotted()}</div>
      </details>`;
    }

    return html`<div class=${cls} tabindex=${this.mode === "focus" ? "0" : nothing}>
      ${
        checkbox
          ? html`<input
                id=${this._id}
                type=${input}
                name=${ifDefined(this.name)}
                class=${this.color || this.closeOutside ? collapseToggle() : nothing}
                aria-label=${ifDefined(typeof title === "string" && title ? title : undefined)}
                autocomplete="off"
                .checked=${this.open}
                @change=${(e: Event) => this._toggle((e.target as HTMLInputElement).checked)}
              />
              ${this.closeOutside ? html`<label for=${this._id} class=${collapseOutside()}></label>` : nothing}`
          : nothing
      }
      <div class=${titleCls}>${title}</div>
      <div class=${contentCls}>${this.slotted()}</div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-collapse": UiCollapse;
  }
}
