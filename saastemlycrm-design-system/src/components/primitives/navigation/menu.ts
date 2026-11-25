import { cssTime } from "../../base/css-time.ts";
import type { VariantProps } from "class-variance-authority";
import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { inlineRow, stack, row, text } from "../layout/algebra.ts";
import { isRtl } from "../../base/reading.ts";

export const menu = rcva(
  "menu [&_.menu-active]:bg-primary-container [&_.menu-active]:text-on-surface [&_.menu-active]:shadow-none",
  {
    variants: {
      size: {
        xs: "menu-xs",
        sm: "menu-sm",
        md: "menu-md",
        lg: "menu-lg",
        xl: "menu-xl",
      },
      direction: {
        vertical: "menu-vertical",
        horizontal: "menu-horizontal",
      },
      nowrap: { true: "[&>li]:max-w-full [&_li>*]:min-w-0" },
      paged: { true: "menu-paged" },
      surface: { true: "bg-surface-container" },
      rounded: { true: "rounded-box" },
      flush: { true: "p-0 [&_li>*]:rounded-none" },
      width: {
        sm: "w-56 max-w-full",
        xs: "w-full max-w-xs",
        full: "w-full",
        grow: "w-full grow",
        auto: "w-auto",
        max: "w-max max-w-full",
      },
      iconSize: {
        sm: "[&_li>:is(a,button,summary)_svg]:size-4 [&_li>details>summary_svg]:size-4",
        md: "[&_li>:is(a,button,summary)_svg]:size-5 [&_li>details>summary_svg]:size-5",
      },
      nav: {
        true: "[&>li]:max-w-full py-0 gap-0 [&_li]:my-0 [&_ul]:my-0 [&_ul]:py-0 [&_li>:is(a,button):not([data-card])]:h-[calc(var(--tile-h)*0.75_-_4px)] [&_li>:is(a,button):not([data-card])]:my-0.5 [&_li>:is(a,button):not([data-card])]:py-0 [&_li>:is(a,button):not([data-card])]:content-center [&_li>details>summary]:h-[calc(var(--tile-h)*0.75_-_4px)] [&_li>details>summary]:my-0.5 [&_li>details>summary]:py-0 [&_li>details>summary]:content-center [&>li>:is(a,button)_svg]:size-5 [&>li>details>summary_svg]:size-5 px-0 text-label-lg [&_.menu-title]:text-on-surface-variant [&_.menu-title]:h-[calc(var(--tile-h)*0.25)] [&_.menu-title]:py-0 [&_.menu-title]:leading-[calc(var(--tile-h)*0.25)] [&_.menu-title]:text-label-md [&_.menu-title]:select-none [&_.menu-title]:pointer-events-none [interpolate-size:allow-keywords] [--clips:fold] [&_details::details-content]:overflow-hidden [&_details::details-content]:[block-size:0] [&_details::details-content]:[transition:block-size_var(--duration-spatial)_var(--ease-spatial),content-visibility_var(--duration-spatial)_allow-discrete] [&_details[open]::details-content]:[block-size:auto] motion-reduce:[&_details::details-content]:transition-none",
      },
      fold: {
        true: "relative isolate [anchor-scope:all] supports-[anchor-name:--a]:[&_.menu-active]:bg-transparent [&_summary]:after:[opacity:calc(1_-_var(--menu-collapse,0))] [&_summary]:after:[transition:opacity_var(--duration-effects-fast)_var(--ease-effects-fast),rotate_var(--duration-spatial-fast)_var(--ease-spatial-fast),translate_var(--duration-spatial-fast)_var(--ease-spatial-fast)] motion-reduce:[&_summary]:after:transition-none",
      },
      rail: { true: "[&_li>:is(a,button)]:w-11 [&_li>details>summary]:w-11 [&_.menu-active]:bg-primary/20" },
      panes: {
        true: "min-h-0 flex-1 [&>li]:min-h-[calc(var(--tile-h)*0.75)] [&>li]:flex-[0_1_2.625rem] [&>li]:max-h-max [&>li]:[transition:flex-grow_var(--duration-spatial)_var(--ease-spatial)] motion-reduce:[&>li]:transition-none [&>li:has(>details[open])]:flex-[1_1_2.625rem] [&>li>details]:h-full [&>li>details::details-content]:[block-size:calc(100%_-_calc(var(--tile-h)*0.75))] [&>li>details[open]::details-content]:[block-size:calc(100%_-_calc(var(--tile-h)*0.75))] [&>li>details>ul]:max-h-full [&>li>details>ul]:overflow-y-auto [&>li>details>ul]:overscroll-contain",
      },
    },
    defaultVariants: { surface: true, rounded: true, iconSize: "md" },
  },
);

export const menuSplit = rcva("relative");
export const menuIconAction = rcva(
  `${inlineRow} touch-target state-layer absolute start-0 top-0.5 z-1 h-[calc(var(--tile-h)*0.75_-_4px)] w-11 cursor-pointer items-center justify-center rounded-inner text-current hover:bg-transparent`,
);

export const menuTitle = rcva("menu-title");

export const menuGroupContent = rcva("ms-0! ps-0! before:hidden!");

export const menuContent = rcva(
  "block w-full p-0 whitespace-normal *:block! *:w-full *:bg-transparent! *:text-inherit! *:shadow-none! *:outline-none! [--focus:fill] *:cursor-auto! [opacity:calc(1_-_var(--menu-collapse,0))] [transition:opacity_var(--duration-effects-fast)_var(--ease-effects-fast)] motion-reduce:transition-none",
);

export const menuLi = rcva("", {
  variants: {
    disabled: { true: "menu-disabled" },
  },
});

export const menuLink = rcva("rounded-inner", {
  variants: {
    active: { true: "menu-active" },
    focus: { true: "menu-focus" },
    anchor: {
      page: "[details[open]:not([data-opening])_&]:[anchor-name:--menu-target]",
      root: "[anchor-name:--menu-active-root] [details:not([open])>&]:[anchor-name:--menu-active-root,--menu-target] [details[data-opening]>&]:[anchor-name:--menu-active-root,--menu-target] [details:not([open])>&]:text-primary [@container_style(--menu-expanded:0)]:text-primary [transition:color_var(--duration-effects)_var(--ease-effects)]",
      both: "[anchor-name:--menu-active-root,--menu-target]",
    },
    split: {
      true: "gap-x-5 [clip-path:inset(0_0_0_calc(2.75rem_+_2px)_round_var(--radius-field))] rtl:[clip-path:inset(0_calc(2.75rem_+_2px)_0_0_round_var(--radius-field))]",
    },
    card: {
      true: "my-1 flex flex-col inline-flex! max-w-full items-stretch! gap-0.5 rounded-box border border-outline-variant bg-surface/50 w-full px-[min(12px,max(0px,calc((100%_-_7rem)/2)))] py-2 whitespace-normal hover:bg-surface",
    },
  },
});

export const menuIndicator = rcva(
  "pointer-events-none absolute -z-10 m-0 rounded-field opacity-100 bg-primary/20 [position-anchor:--menu-target] [position-visibility:anchors-valid] top-[anchor(top)] start-[anchor(start)] h-[anchor-size(height)] w-[anchor-size(width)] [transition:top_var(--duration-spatial)_var(--ease-spatial),inset-inline-start_var(--duration-spatial)_var(--ease-spatial),width_var(--duration-spatial)_var(--ease-spatial),height_var(--duration-spatial)_var(--ease-spatial)] [@container_style(--menu-expanded:0)]:[position-anchor:--menu-active-root] [@container_style(--menu-collapse:1)]:[position-anchor:--menu-active-root] [@container_style(--menu-collapse:1)]:w-11 not-supports-[anchor-name:--a]:hidden motion-reduce:transition-none",
);

export const menuNavLabel = rcva(
  `inline-block ${text.line} [opacity:calc(1_-_var(--menu-collapse,0))] [translate:calc(var(--menu-collapse,0)_*_-1rem)_0] [transition:opacity_var(--duration-effects-fast)_var(--ease-effects-fast),translate_var(--duration-spatial-fast)_var(--ease-spatial-fast)] motion-reduce:transition-none`,
);

export function menuFoldTween(list: Element) {
  const length = 1000;
  const rtl = getComputedStyle(list).direction === "rtl";
  const parts: { animation: Animation; frame: (p: number) => Keyframe; scale: EffectTiming }[] = [];
  const add = (el: Element, frame: (p: number) => Keyframe, pseudoElement?: string) => {
    const keyframes = [frame(0), frame(1)];
    const animation = el.animate(keyframes, { duration: length, fill: "both", pseudoElement });
    animation.pause();
    parts.push({ animation, frame, scale: animation.effect!.getTiming() });
  };
  const top = (el: Element) => !el.closest("details > ul");
  for (const el of list.querySelectorAll("[data-menu-fold]")) {
    if (!top(el)) continue;
    if (el.getAttribute("data-menu-fold") === "label") add(el, (p) => ({ opacity: p, translate: `${p - 1}rem 0` }));
    else add(el, (p) => ({ opacity: p }));
  }
  for (const el of list.querySelectorAll("li > details > summary"))
    if (top(el)) add(el, (p) => ({ opacity: p }), "::after");
  const highlight = list.querySelector("[data-menu-highlight]");
  if (highlight) {
    const round = getComputedStyle(highlight).borderStartStartRadius;
    const cut = (p: number) => `calc((100% - 2.75rem) * ${1 - p})`;
    add(highlight, (p) => ({
      clipPath: rtl ? `inset(0 0 0 ${cut(p)} round ${round})` : `inset(0 ${cut(p)} 0 0 round ${round})`,
    }));
  }
  let at = 0;
  let following = false;
  return {
    seek(p: number) {
      at = Math.min(1, Math.max(0, p));
      for (const { animation, frame, scale } of parts) {
        if (following) {
          (animation.effect as KeyframeEffect).setKeyframes([frame(0), frame(1)]);
          animation.effect?.updateTiming({ delay: scale.delay, duration: length, easing: scale.easing });
        }
        animation.pause();
        animation.currentTime = at * length;
      }
      following = false;
    },
    follow(lead: Animation, to: number) {
      const timing = lead.effect?.getTiming();
      if (!timing) return this.seek(to);
      for (const { animation, frame } of parts) {
        (animation.effect as KeyframeEffect).setKeyframes([frame(at), frame(to)]);
        animation.effect?.updateTiming({
          delay: timing.delay,
          duration: timing.duration as number,
          easing: timing.easing,
        });
        animation.pause();
        animation.currentTime = 0;
      }
      following = true;
      at = to;
      const join = () => {
        if (!following || lead.startTime === null) return;
        for (const { animation } of parts) animation.startTime = lead.startTime;
      };
      if (lead.startTime !== null) join();
      else void lead.ready.then(join, () => undefined);
    },
    cancel() {
      for (const { animation } of parts) animation.cancel();
    },
  };
}
export type MenuFoldTween = ReturnType<typeof menuFoldTween>;

export const menuRailHeading = rcva(`invisible block ${text.line}`);

export const menuCardHead = rcva(`${row} items-start gap-2`);
export const menuCardTitle = rcva("min-w-0 flex-1 text-label-lg leading-snug [overflow-wrap:break-word]");
export const menuCardDescription = rcva("leading-snug text-on-surface-variant [.menu-active_&]:text-on-surface", {
  variants: {
    lines: { wrap: `${text.label} text-body-sm`, one: `${text.line} text-body-sm` },
  },
  defaultVariants: { lines: "wrap" },
});
export const menuCardBody = rcva(
  `${stack} gap-0.5 [opacity:calc(1_-_var(--menu-collapse,0))] [transition:opacity_var(--duration-effects-fast)_var(--ease-effects-fast)] motion-reduce:transition-none`,
);

export const menuBadge = rcva("badge badge-xs", {
  variants: {
    color: {
      neutral: "badge-neutral",
      primary: "badge-primary",
      secondary: "badge-secondary",
      accent: "badge-accent",
      info: "badge-info",
      success: "badge-success",
      warning: "badge-warning",
      error: "badge-error",
    },
    card: { true: "mt-0.5 min-w-0 truncate" },
    end: { true: "ms-auto" },
  },
});

export const menuDropdown = rcva("menu-dropdown", {
  variants: {
    show: { true: "menu-dropdown-show" },
  },
});

export const menuDropdownToggle = rcva("menu-dropdown-toggle", {
  variants: {
    show: { true: "menu-dropdown-show" },
  },
});

export type MenuVariants = VariantProps<typeof menu>;
export type MenuBadgeVariants = VariantProps<typeof menuBadge>;

export interface MenuItem {
  label?: Renderable;
  href?: string;
  icon?: Renderable;
  iconAction?: { label: string; pressed?: boolean };
  card?: boolean;
  description?: Renderable;
  oneLine?: boolean;
  badge?: Renderable;
  badgeColor?: MenuBadgeVariants["color"];
  active?: boolean;
  focus?: boolean;
  disabled?: boolean;
  heading?: boolean;
  children?: MenuItem[];
  open?: boolean;
  value?: unknown;
  content?: Renderable;
}

type MenuLinkAnchor = NonNullable<VariantProps<typeof menuLink>["anchor"]>;

const hasActive = (item: MenuItem): boolean => !!item.active || !!item.children?.some(hasActive);

export type MenuSubmenuMode = "static" | "details" | "js";

@customElement("ui-menu")
export class UiMenu extends LightElement {
  @property({ attribute: false }) items: MenuItem[] = [];
  @property() size: MenuVariants["size"];
  @property() direction: MenuVariants["direction"];
  @property({ converter: responsiveBoolean }) paged: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) nowrap: Responsive<boolean> = false;
  @property({ type: Boolean }) panes = false;
  @property({ converter: responsiveBoolean }) surface: Responsive<boolean> = true;
  @property({ converter: responsiveBoolean }) rounded: Responsive<boolean> = true;
  @property({ converter: responsiveBoolean }) flush: Responsive<boolean> = false;
  @property() width: MenuVariants["width"];
  @property({ attribute: "icon-size" }) iconSize: MenuVariants["iconSize"] = "md";
  @property() submenu: MenuSubmenuMode = "details";
  @property({ type: Boolean, attribute: "icon-only" }) iconOnly = false;
  @property() tooltip: "top" | "right" | "bottom" | "none" = "right";
  @property() layout: "list" | "nav" | "rail" = "list";
  protected updated() {
    this.querySelector(".menu-focus")?.scrollIntoView({ block: "nearest" });
    this._follow();
  }

  #followUntil = 0;
  #following = false;

  private _follow(ms = 900) {
    if (this.layout !== "nav" || this.panes) return;
    this.#followUntil = performance.now() + ms;
    if (this.#following) return;
    this.#following = true;
    let flip = false;
    const tick = () => {
      const highlight = this.querySelector<HTMLElement>("[data-menu-highlight]");
      if (!highlight || !this.isConnected || performance.now() > this.#followUntil) {
        highlight?.style.removeProperty("margin-top");
        this.#following = false;
        return;
      }
      flip = !flip;
      highlight.style.marginTop = flip ? "0.001px" : "0px";
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  openGroup(path: number[]) {
    const details = this.querySelector<HTMLDetailsElement>(`details[data-menu-path="${path.join(".")}"]`);
    if (details && !details.open) details.open = true;
  }

  private _shown = new WeakMap<MenuItem, boolean>();

  private _select(item: MenuItem, path: number[], e: Event) {
    if (item.disabled) {
      e.preventDefault();
      return;
    }
    this.dispatchEvent(new CustomEvent("ui-select", { detail: { item, path }, bubbles: true }));
  }

  private _label(item: MenuItem): TemplateResult {
    if (this.layout === "rail") {
      return html`${item.icon ?? nothing}`;
    }
    if (item.card) {
      return html`<span class=${menuCardBody()} data-menu-fold="fade">
        <span class=${menuCardHead()}>
          ${item.icon ?? nothing}
          <span class=${menuCardTitle()}>${item.label ?? nothing}</span>
          ${item.badge != null ? html`<span class=${menuBadge({ color: item.badgeColor, card: true })}>${item.badge}</span>` : nothing}
        </span>
        ${item.description != null ? html`<span class=${menuCardDescription({ lines: item.oneLine ? "one" : "wrap" })}>${item.description}</span>` : nothing}
      </span>`;
    }
    const text = this.iconOnly && item.icon ? nothing : (item.label ?? nothing);
    const label =
      this.layout === "nav" && text !== nothing
        ? html`<span class=${menuNavLabel()} data-menu-fold="label">${text}</span>`
        : text;
    return html`${item.icon ?? nothing} ${label}
    ${item.badge != null ? html`<span class=${menuBadge({ color: item.badgeColor, end: this.layout === "nav" })} data-menu-fold="fade">${item.badge}</span>` : nothing}`;
  }

  private _link(item: MenuItem, path: number[]) {
    const rail = this.layout === "rail";
    const iconOnly = rail || (this.iconOnly && !!item.icon);
    const side = rail ? "right" : iconOnly && this.tooltip !== "none" ? this.tooltip : undefined;
    const tipSide = side === "right" && isRtl(this) ? "left" : side;
    const cls = menuLink({
      active: item.active,
      focus: item.focus,
      anchor: this._anchor(item, path),
      card: !!item.card && !rail,
    });
    const dataTip = tipSide && typeof item.label === "string" ? item.label : undefined;
    const ariaLabel = iconOnly && typeof item.label === "string" ? item.label : undefined;
    if (item.href && !item.disabled) {
      return html`<a
        class=${cls}
        href=${item.href}
        ?data-card=${!!item.card && !rail}
        data-tip=${ifDefined(dataTip)}
        data-tip-side=${ifDefined(dataTip ? tipSide : undefined)}
        aria-label=${ifDefined(ariaLabel)}
        aria-current=${ifDefined(item.active ? "page" : undefined)}
        @click=${(e: Event) => this._select(item, path, e)}
        >${this._label(item)}</a
      >`;
    }
    return html`<button
      type="button"
      class=${cls}
      ?disabled=${!!item.disabled}
      ?data-card=${!!item.card && !rail}
      data-tip=${ifDefined(dataTip)}
      data-tip-side=${ifDefined(dataTip ? tipSide : undefined)}
      aria-label=${ifDefined(ariaLabel)}
      @click=${(e: Event) => this._select(item, path, e)}
    >
      ${this._label(item)}
    </button>`;
  }

  private _opening = (e: Event) => {
    const details = (e.currentTarget as HTMLElement).parentElement;
    if (!(details instanceof HTMLDetailsElement)) return;
    this._follow();
    if (details.open) return;
    details.setAttribute("data-opening", "");
    const ms = cssTime(getComputedStyle(details).getPropertyValue("--duration-short2"), 100);
    setTimeout(() => details.removeAttribute("data-opening"), ms);
  };

  private _toggled(item: MenuItem, path: number[], e: Event) {
    const open = (e.currentTarget as HTMLDetailsElement).open;
    this.dispatchEvent(new CustomEvent("ui-toggle", { detail: { item, path, open }, bubbles: true }));
  }

  private _anchor(item: MenuItem, path: number[]): MenuLinkAnchor | undefined {
    if (this.layout !== "nav") return undefined;
    const top = path.length === 1;
    if (item.active) return top ? "both" : "page";
    return top && hasActive(item) ? "root" : undefined;
  }

  private _list(items: MenuItem[], path: number[]): unknown {
    return items.map((item, i) => this._li(item, [...path, i]));
  }

  private _li(item: MenuItem, path: number[]): TemplateResult {
    const li = menuLi({ disabled: item.disabled });

    if (item.heading && !item.children) {
      return this.layout === "rail"
        ? html`<li class=${menuTitle()} aria-hidden="true"><span class=${menuRailHeading()}>${item.label}</span></li>`
        : html`<li class=${menuTitle()}><span class=${menuNavLabel()} data-menu-fold="label">${item.label}</span></li>`;
    }
    if (item.heading && item.children) {
      return html`<li>
        <h2 class=${menuTitle()}><span class=${menuNavLabel()} data-menu-fold="label">${item.label}</span></h2>
        <ul>
          ${this._list(item.children, path)}
        </ul>
      </li>`;
    }
    if (item.content !== undefined && this.layout !== "rail") {
      return html`<li class=${menuContent()}>${item.content}</li>`;
    }
    if (!item.children) {
      return html`<li class=${li}>${this._link(item, path)}</li>`;
    }

    if (this.submenu === "static") {
      return html`<li class=${li}>
        ${this._link(item, path)}
        <ul>
          ${this._list(item.children, path)}
        </ul>
      </li>`;
    }

    if (this.submenu === "js") {
      const show = this._shown.get(item) ?? !!item.open;
      const toggle = () => {
        this._shown.set(item, !show);
        this.requestUpdate();
      };
      return html`<li class=${li}>
        <span
          class=${menuDropdownToggle({ show })}
          role="button"
          tabindex="0"
          aria-expanded=${show ? "true" : "false"}
          @click=${toggle}
          @keydown=${(e: KeyboardEvent) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggle())}
          >${this._label(item)}</span
        >
        <ul class=${menuDropdown({ show })}>
          ${this._list(item.children, path)}
        </ul>
      </li>`;
    }

    return html`<li class=${item.iconAction ? `${li} ${menuSplit()}` : li}>
      ${
        item.iconAction
          ? html`<button
              type="button"
              class=${menuIconAction()}
              aria-label=${item.iconAction.label}
              aria-pressed=${item.iconAction.pressed ? "true" : "false"}
              data-tip=${item.iconAction.label}
              data-tip-side="bottom"
              @click=${() =>
                this.dispatchEvent(
                  new CustomEvent("ui-icon-action", { detail: { item }, bubbles: true, composed: true }),
                )}
            >
              ${item.icon}
            </button>`
          : nothing
      }
      <details
        data-menu-path=${path.join(".")}
        ?open=${!!item.open}
        @toggle=${(e: Event) => this._toggled(item, path, e)}
      >
        <summary
          class=${menuLink({ anchor: this._anchor(item, path), split: !!item.iconAction })}
          @click=${this._opening}
        >
          ${this._label(item)}
        </summary>
        <ul class=${item.children.every((c) => c.content !== undefined) ? menuGroupContent() : ""}>
          ${this._list(item.children, path)}
        </ul>
      </details>
    </li>`;
  }

  render() {
    return html`<ul
      class=${menu({
        size: this.size,
        direction: this.direction,
        paged: this.paged,
        nowrap: this.nowrap,
        panes: this.panes,
        surface: this.surface,
        rounded: this.rounded,
        flush: this.flush,
        width: this.width,
        iconSize: this.iconSize,
        nav: this.layout !== "list",
        fold: this.layout === "nav" && !this.panes,
        rail: this.layout === "rail",
      })}
    >
      ${this.items.length ? this._list(this.items, []) : this.content}
      ${this.layout === "nav" && !this.panes ? html`<li class=${menuIndicator()} role="presentation" data-menu-highlight></li>` : nothing}
    </ul>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-menu": UiMenu;
  }
}
