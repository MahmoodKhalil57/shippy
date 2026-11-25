import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { row, stack, text } from "../layout/algebra.ts";
import { iconSvg, type IconName } from "../media/icon.ts";
import { loading as loadingRecipe } from "./loading.ts";
import { m } from "../../../i18n/index.ts";

export const emptyState = rcva(`${stack}`, {
  variants: {
    size: {
      sm: "items-start gap-1 py-2",
      md: "items-center gap-2 w-full px-[min(16px,max(0px,calc((100%_-_7rem)/2)))] py-12 text-center",
    },
  },
  defaultVariants: { size: "md" },
});
export const emptyStateIcon = rcva("mb-1 grid place-items-center rounded-full", {
  variants: {
    tone: {
      neutral: "bg-surface-container-high text-on-surface-variant",
      error: "bg-error-container text-on-error-container",
    },
    size: { sm: "hidden", md: "size-12" },
  },
  defaultVariants: { tone: "neutral" },
});
export const emptyStateHeading = rcva(`${text.label}`, {
  variants: {
    size: { sm: "text-body-md text-on-surface-variant", md: "text-title-md text-on-surface" },
    tone: { neutral: "", error: "text-error-ink!" },
  },
});
export const emptyStateDescription = rcva(`${text.prose} max-w-[50ch] text-body-md text-on-surface-variant`);
export const emptyStateActions = rcva(`${row} mt-2 justify-center gap-2`);

export type EmptyStateVariants = VariantProps<typeof emptyState>;

@customElement("ui-empty-state")
export class UiEmptyState extends LightElement {
  @property() heading: Renderable = "";
  @property() description: Renderable = "";
  @property() icon?: IconName;
  @property() size: EmptyStateVariants["size"];
  @property() tone: "neutral" | "error" = "neutral";
  @property({ type: Boolean }) loading = false;
  @property() label = m.empty_state_loading();

  render() {
    const size = this.size ?? "md";
    const heading = this.heading || (this.hasContent ? this.slotted() : "");
    const icon = this.icon ?? (this.tone === "error" ? "warning" : undefined);
    return html`<div class=${emptyState({ size })} role=${this.tone === "error" ? "alert" : nothing}>
      ${
        this.loading
          ? html`<span
              class=${loadingRecipe({ variant: "morph", size: size === "sm" ? "sm" : "lg", color: "primary" })}
              role="status"
              aria-label=${this.label}
            ></span>`
          : icon
            ? html`<span class=${emptyStateIcon({ tone: this.tone, size })}>${iconSvg(icon, { size: "lg" })}</span>`
            : nothing
      }
      ${heading ? html`<p class=${emptyStateHeading({ size, tone: this.tone })}>${heading}</p>` : nothing}
      ${this.description ? html`<p class=${emptyStateDescription()}>${this.description}</p>` : nothing}
      ${this.hasSlotted("actions") ? html`<div class=${emptyStateActions()}>${this.slotted("actions")}</div>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-empty-state": UiEmptyState;
  }
}
