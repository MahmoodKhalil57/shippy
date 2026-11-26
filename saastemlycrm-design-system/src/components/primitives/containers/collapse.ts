import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { uid } from "../../../lib/base/uid.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../../lib/base/variants.ts";
import { text } from "../../../styles/algebra.ts";

export const collapse = rcva("collapse !visible", {
  variants: {
    icon: {
      arrow: "collapse-arrow",
      plus: "collapse-plus",
    },
    force: {
      open: "collapse-open",
      close: "collapse-close",
    },
    bordered: { true: "border border-outline-variant" },
    surface: { true: "bg-surface" },
    color: {
      primary: "bg-primary text-primary-content focus:bg-secondary focus:text-secondary-content",
    },
  },
  defaultVariants: { bordered: true },
});

export const collapseTitle = rcva("collapse-title font-semibold", {
  variants: {
    iconPosition: {
      start:
        "after:start-3 after:end-auto ps-[min(32px,max(0px,calc(100%_-_7rem)))] pe-[min(16px,max(0px,calc(100%_-_7rem)))]",
      end: "",
    },
    color: {
      primary: "bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content",
    },
  },
});
export const collapseContent = rcva(`collapse-content ${text.prose} text-body-md`, {
  variants: {
    color: {
      primary: "bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content",
    },
    raised: { true: "z-1" },
  },
});
export const collapseToggle = rcva("peer");
export const collapseOutside = rcva("fixed inset-0 hidden peer-checked:block");

export type CollapseVariants = VariantProps<typeof collapse>;

export type CollapseMode = "focus" | "checkbox" | "radio" | "details";

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
  @property({ type: Boolean, attribute: "close-outside" }) closeOutside = false;
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
      surface: this.color && !checkbox ? false : this.bordered,
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
                aria-labelledby=${`${this._id}-title`}
                autocomplete="off"
                .checked=${this.open}
                @change=${(e: Event) => this._toggle((e.target as HTMLInputElement).checked)}
              />
              ${this.closeOutside ? html`<label for=${this._id} class=${collapseOutside()}></label>` : nothing}`
          : nothing
      }
      <div id=${`${this._id}-title`} class=${titleCls}>${title}</div>
      <div class=${contentCls}>${this.slotted()}</div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-collapse": UiCollapse;
  }
}
