import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, uid, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Drawer: Grid layout that shows or hides a sidebar on the left or right.
 *
 * Purpose: Layout & page structure · Kind: primitive
 * Docs: https://daisyui.com/components/drawer/
 *
 * Structure: `.drawer` > `.drawer-toggle` (hidden checkbox) + `.drawer-content`
 * (page) + `.drawer-side` (> `.drawer-overlay` + sidebar panel).
 * Responsive (docs): `force-open="lg"` -> `lg:drawer-open` (always visible on
 * large screens, toggled on small ones).
 *
 * State variants (Tailwind prefixes usable inside the drawer):
 * `is-drawer-open:` and `is-drawer-close:`. The icon-only panel uses them, and
 * `ui-menu` has a matching `collapse="drawer"` mode.
 */
export const drawer = rcva("drawer", {
  variants: {
    placement: {
      start: "",
      end: "drawer-end",
    },
    /** Force the sidebar open; responsive, e.g. `"lg"`. */
    forceOpen: { true: "drawer-open" },
  },
});

export const drawerToggle = rcva("drawer-toggle");
export const drawerContent = rcva("drawer-content", {
  variants: {
    /** `column`: flex column; `center`: centered column (docs "Drawer sidebar"). */
    layout: {
      default: "",
      column: "flex flex-col",
      center: "flex flex-col items-center justify-center",
    },
  },
});
export const drawerSide = rcva("drawer-side", {
  variants: {
    /** Let the collapsed icon-only sidebar overflow (for tooltips). */
    iconOnly: { true: "is-drawer-close:overflow-visible" },
  },
});
export const drawerOverlay = rcva("drawer-overlay");
/** The sidebar panel inside `.drawer-side`. */
export const drawerPanel = rcva("min-h-full bg-base-200", {
  variants: {
    panel: {
      /** Docs default: 20rem wide, padded. */
      default: "w-80 p-4",
      /** Collapses to icons when closed instead of hiding (docs icon-only example). */
      "icon-only": "flex flex-col items-start is-drawer-close:w-14 is-drawer-open:w-64",
    },
  },
  defaultVariants: { panel: "default" },
});
/** The open/close button (a `<label for>` the toggle). */
export const drawerButton = rcva("btn drawer-button", {
  variants: {
    look: {
      default: "",
      primary: "btn-primary",
      /** Square ghost icon button (docs navbar / icon-only examples). */
      icon: "btn-square btn-ghost",
    },
    /** Hide the button, e.g. `"lg"` where the sidebar is forced open. */
    hide: { true: "hidden" },
  },
});
/** Sizes an icon placed in the drawer button. */
export const drawerButtonIcon = rcva("inline-flex [&>svg]:my-1.5 [&>svg]:inline-block [&>svg]:size-4");

export type DrawerVariants = VariantProps<typeof drawer>;
export type DrawerContentVariants = VariantProps<typeof drawerContent>;
export type DrawerPanelVariants = VariantProps<typeof drawerPanel>;
export type DrawerButtonVariants = VariantProps<typeof drawerButton>;

/**
 * @example
 * <ui-drawer force-open="lg" content-layout="center" button="Open drawer" button-look="primary" button-hide="lg">
 *   Page content
 *   <ui-menu slot="side" .items=${[{ label: "Sidebar Item 1" }, { label: "Sidebar Item 2" }]}></ui-menu>
 * </ui-drawer>
 * @example
 * <ui-drawer force-open="lg" panel="icon-only">
 *   <ui-navbar>…<ui-button data-drawer-toggle variant="ghost" shape="square">☰</ui-button>…</ui-navbar>
 *   <ui-menu slot="side" collapse="drawer" .items=${[…]}></ui-menu>
 * </ui-drawer>
 *
 * Children without a slot go into `.drawer-content`; `slot="side"` children go
 * into the sidebar panel. `button` renders the open/close button at the top of
 * the content; any inner element with `data-drawer-toggle` also toggles the
 * drawer. Escape closes an open drawer. Fires `ui-change` with `{ open }`.
 */
@customElement("ui-drawer")
export class UiDrawer extends LightElement {
  @property() placement: DrawerVariants["placement"];
  @property({ attribute: "force-open", converter: responsiveBoolean }) forceOpen: Responsive<boolean> = false;
  @property({ attribute: "content-layout" }) contentLayout: DrawerContentVariants["layout"];
  @property() panel: DrawerPanelVariants["panel"] = "default";
  /** Label of the built-in open/close button (none when empty). */
  @property() button: Renderable = "";
  @property({ attribute: "button-look" }) buttonLook: DrawerButtonVariants["look"];
  @property({ attribute: "button-hide", converter: responsiveBoolean }) buttonHide: Responsive<boolean> = false;
  /** Checkbox state: is the sidebar shown (on screens where it can be hidden)? */
  @property({ type: Boolean, reflect: true }) open = false;
  /** Id of the hidden checkbox, for `<label for>` toggles. */
  @property({ attribute: "toggle-id" }) toggleId = uid("drawer");

  show() {
    this._set(true);
  }
  hide() {
    this._set(false);
  }
  toggle() {
    this._set(!this.open);
  }

  private _set(open: boolean) {
    if (this.open === open) return;
    this.open = open;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { open }, bubbles: true }));
  }

  private _onClick = (e: Event) => {
    const t = (e.target as Element).closest?.("[data-drawer-toggle]");
    if (t && this.contains(t)) this.toggle();
  };

  private _onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this.open) this.hide();
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this._onClick);
    this.addEventListener("keydown", this._onKey);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this._onClick);
    this.removeEventListener("keydown", this._onKey);
  }

  render() {
    const iconOnly = this.panel === "icon-only";
    return html`<div class=${drawer({ placement: this.placement, forceOpen: this.forceOpen })}>
      <input
        id=${this.toggleId}
        type="checkbox"
        class=${drawerToggle()}
        .checked=${this.open}
        @change=${(e: Event) => this._set((e.target as HTMLInputElement).checked)}
      />
      <div class=${drawerContent({ layout: this.contentLayout })}>
        ${
          this.button
            ? html`<label
                for=${this.toggleId}
                aria-label=${typeof this.button === "string" ? nothing : "open sidebar"}
                class=${drawerButton({ look: this.buttonLook, hide: this.buttonHide })}
                ><span class=${drawerButtonIcon()}>${this.button}</span></label
              >`
            : nothing
        }
        ${this.slotted()}
      </div>
      <div class=${drawerSide({ iconOnly })}>
        <label for=${this.toggleId} aria-label="close sidebar" class=${drawerOverlay()}></label>
        <div class=${drawerPanel({ panel: this.panel })}>${this.slotted("side")}</div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-drawer": UiDrawer;
  }
}
