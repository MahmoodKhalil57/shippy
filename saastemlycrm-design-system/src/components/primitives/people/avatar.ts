import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { m } from "../../../i18n/index.ts";

export const avatar = rcva("avatar", {
  variants: {
    presence: {
      online: "avatar-online",
      offline: "avatar-offline",
    },
    placeholder: { true: "avatar-placeholder" },
  },
});

export const avatarImage = rcva("", {
  variants: {
    size: {
      xs: "w-8",
      sm: "w-12",
      md: "w-16",
      lg: "w-20 max-w-full",
      xl: "w-24 max-w-full",
      "2xl": "w-32 max-w-full",
    },
    shape: {
      square: "",
      circle: "rounded-full",
      rounded: "rounded-xs",
      "rounded-xl": "rounded-md",
      squircle: "mask mask-squircle",
      hexagon: "mask mask-hexagon-2",
      triangle: "mask mask-triangle",
      heart: "mask mask-heart",
    },
    ring: {
      primary: "ring-primary ring-offset-base-100 ring-2 ring-offset-2",
      secondary: "ring-secondary ring-offset-base-100 ring-2 ring-offset-2",
      accent: "ring-accent ring-offset-base-100 ring-2 ring-offset-2",
      neutral: "ring-neutral ring-offset-base-100 ring-2 ring-offset-2",
    },
    placeholder: { true: "", false: "" },
    tone: { neutral: "", secondary: "" },
  },
  compoundVariants: [
    { placeholder: true, tone: "neutral", class: "bg-neutral text-neutral-content" },
    { placeholder: true, tone: "secondary", class: "bg-secondary-container text-on-secondary-container" },
  ],
  defaultVariants: { size: "xl", shape: "circle", placeholder: false, tone: "neutral" },
});

export const avatarInitials = rcva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "",
      md: "text-xl",
      lg: "text-2xl",
      xl: "text-3xl",
      "2xl": "text-4xl",
    },
  },
  defaultVariants: { size: "xl" },
});

export const avatarGroup = rcva("avatar-group", {
  variants: {
    overlap: {
      sm: "-space-x-3",
      md: "-space-x-6",
      lg: "-space-x-8",
    },
  },
  defaultVariants: { overlap: "md" },
});

export type AvatarVariants = VariantProps<typeof avatar> & VariantProps<typeof avatarImage>;
export type AvatarImageVariants = VariantProps<typeof avatarImage>;
export type AvatarGroupVariants = VariantProps<typeof avatarGroup>;

export interface AvatarData {
  src?: string;
  alt?: string;
  initials?: string;
  presence?: AvatarVariants["presence"];
}

export const avatarTemplate = (
  a: AvatarData,
  opts: Pick<AvatarVariants, "size" | "shape" | "ring"> & { tone?: AvatarImageVariants["tone"] } = {},
) => {
  const placeholder = !a.src;
  return html`<div class=${avatar({ presence: a.presence, placeholder })}>
    <div class=${avatarImage({ size: opts.size, shape: opts.shape, ring: opts.ring, placeholder, tone: opts.tone })}>
      ${
        a.src
          ? html`<img src=${a.src} alt=${a.alt ?? ""} />`
          : html`<span class=${avatarInitials({ size: opts.size })} aria-label=${a.alt ?? nothing}
              >${a.initials ?? ""}</span
            >`
      }
    </div>
  </div>`;
};

@customElement("ui-avatar")
export class UiAvatar extends LightElement {
  @property() src?: string;
  @property() alt = "";
  @property() initials?: string;
  @property() presence: AvatarVariants["presence"];
  @property() size: AvatarVariants["size"];
  @property() shape: AvatarVariants["shape"];
  @property() ring: AvatarVariants["ring"];
  @property() tone: AvatarImageVariants["tone"];

  render() {
    if (!this.src && !this.initials && this.hasContent) {
      return html`<div class=${avatar({ presence: this.presence, placeholder: true })}>
        <div
          class=${avatarImage({ size: this.size, shape: this.shape, ring: this.ring, placeholder: true, tone: this.tone })}
        >
          ${this.slotted()}
        </div>
      </div>`;
    }
    return avatarTemplate(
      { src: this.src, alt: this.alt, initials: this.initials, presence: this.presence },
      { size: this.size, shape: this.shape, ring: this.ring, tone: this.tone },
    );
  }
}

@customElement("ui-avatar-group")
export class UiAvatarGroup extends LightElement {
  @property({ attribute: false }) avatars: AvatarData[] = [];
  @property({ type: Number }) max = 0;
  @property() size: AvatarVariants["size"] = "sm";
  @property() shape: AvatarVariants["shape"];
  @property() ring: AvatarVariants["ring"];
  @property() overlap: AvatarGroupVariants["overlap"];

  render() {
    const shown = this.max > 0 ? this.avatars.slice(0, this.max) : this.avatars;
    const rest = this.avatars.length - shown.length;
    const opts = { size: this.size, shape: this.shape, ring: this.ring };
    return html`<div class=${avatarGroup({ overlap: this.overlap })}>
      ${
        this.avatars.length
          ? repeat(
              shown,
              (_, i) => i,
              (a) => avatarTemplate(a, opts),
            )
          : this.content
      }
      ${rest > 0 ? avatarTemplate({ initials: `+${rest}`, alt: m.avatar_more({ count: rest }) }, opts) : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-avatar": UiAvatar;
    "ui-avatar-group": UiAvatarGroup;
  }
}
