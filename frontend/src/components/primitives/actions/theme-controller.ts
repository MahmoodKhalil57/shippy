import { cva, type VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement, uid, type Renderable } from "../../base/light-element.ts";
import { button } from "./button.ts";
import { SCHEMES, type Scheme } from "./schemes.ts";
import { dropdown, dropdownContent, dropdownPanel } from "./dropdown.ts";
import { swap, swapOff, swapOn } from "./swap.ts";
import { checkbox } from "../forms/checkbox.ts";
import { fieldset, fieldsetLabel } from "../forms/fieldset.ts";
import { radio } from "../forms/radio.ts";
import { toggle } from "../forms/toggle.ts";
import { join, joinItem } from "../layout/join.ts";
import { iconSvg, type IconName } from "../media/icon.ts";

/**
 * Theme Controller: Sets the page theme from a checked checkbox or radio input.
 *
 * Purpose: Actions · Kind: primitive
 * Docs: https://daisyui.com/components/theme-controller/
 *
 * A primitive because `theme-controller` has to sit on the native input
 * itself: daisyUI's theme CSS switches themes from
 * `:root:has(input.theme-controller:checked)`. The input is dressed with the
 * Toggle / Checkbox / Swap / Radio / Button / Join / Dropdown / Fieldset recipes.
 *
 * Pure CSS: when an `input.theme-controller` with `value="<theme>"` is checked,
 * daisyUI applies that theme to the page via `:has()`. Only themes enabled in
 * the daisyUI plugin config exist (default: `light`, `dark`), so enable more in
 * `src/styles/theme.css` (e.g. `@plugin "daisyui" { themes: light --default, dark --prefersdark, synthwave; }`).
 */
export const themeController = cva("theme-controller", {
  variants: {
    /** Which control carries the `theme-controller` class. */
    as: {
      toggle: toggle(),
      checkbox: checkbox(),
      swap: "",
      /** A ghost icon button cycling system → dark → light (app headers); see `cycle` below. */
      cycle: "",
      /** A ghost icon button opening the colour-scheme menu (app headers); see `scheme` below. */
      scheme: "",
      /** A ghost icon button opening the background-image picker (app headers); see `background` below. */
      background: "",
      radio: radio({ size: "sm" }),
      buttons: button({ class: joinItem() }),
      dropdown: button({ size: "sm", block: true, variant: "ghost", justify: "start" }),
    },
  },
  defaultVariants: { as: "toggle" },
});

/** The `cycle` look: a ghost circle button sized like the header's other actions. */
export const themeControllerIcon = cva("btn btn-ghost btn-circle");
/** The `cycle` icon: each new one pops in with a turn, on M3's expressive fast spatial spring (it bounces). */
export const themeControllerGlyph = cva(
  "grid place-items-center transition-[scale,rotate,opacity] duration-(--duration-spatial-fast) ease-spatial-fast starting:-rotate-90 starting:scale-40 starting:opacity-0 motion-reduce:transition-none",
);

/** `background`: the picker panel (a glass dropdown), its tiles, and their parts. */
export const themeControllerBackgrounds = cva(
  "flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2 p-3 max-h-[min(30rem,75dvh)] overflow-y-auto [--scrollbar-inset:var(--radius-box)]",
);
export const themeControllerBackgroundsHead = cva(
  "flex items-baseline justify-between gap-2 px-1 text-sm font-semibold",
);
export const themeControllerBackgroundsCredit = cva("text-xs font-normal text-base-content/60");
export const themeControllerBackgroundGrid = cva("grid grid-cols-2 gap-2");
export const themeControllerBackground = cva(
  "group/tile relative isolate grid aspect-[16/10] cursor-pointer place-items-center overflow-hidden rounded-field bg-base-200 text-base-content/70 ring-1 ring-base-content/10 transition-[box-shadow,scale] duration-(--duration-spatial-fast) ease-spatial-fast hover:ring-2 hover:ring-primary/50 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none",
  {
    variants: {
      active: { true: "ring-2 ring-primary hover:ring-primary" },
      upload: { true: "border-2 border-dashed border-base-content/20 bg-transparent ring-0" },
    },
  },
);
export const themeControllerBackgroundImage = cva("absolute inset-0 -z-10 size-full object-cover");
export const themeControllerBackgroundLabel = cva(
  "absolute inset-x-0 bottom-0 bg-neutral/65 px-2 py-1 text-start text-xs font-medium text-neutral-content",
);
export const themeControllerBackgroundEmpty = cva("flex flex-col items-center gap-1 text-xs font-medium");
export const themeControllerBackgroundCheck = cva(
  "absolute top-1.5 end-1.5 grid size-5 place-items-center rounded-full bg-primary text-primary-content",
);
export const themeControllerFile = cva("sr-only");

/** A background image offered by `as="background"`: a full-size `src` and a small `thumb`. */
export interface BackgroundImage {
  id: string;
  label: string;
  src: string;
  thumb?: string;
}

/** Show a background image behind the app (`null` for none); the shell paints `--app-background`. */
export function applyBackground(src: string | null) {
  const root = document.documentElement.style;
  if (src) {
    root.setProperty("--app-background", `url("${src}")`);
    root.setProperty("--app-background-wash", "35%");
  } else {
    root.removeProperty("--app-background");
    root.removeProperty("--app-background-wash");
  }
}

/** An uploaded image, scaled to at most `max` px on its long side, as a JPEG data URL (fits localStorage). */
async function shrinkImage(file: File, max = 2048): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * k);
  canvas.height = Math.round(bitmap.height * k);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

/** `scheme`: the menu (a glass dropdown panel, scrolling), each entry, and its swatches. */
export const themeControllerSchemes = cva(
  "menu max-h-[min(24rem,70dvh)] w-64 flex-nowrap overflow-y-auto p-1.5 [--scrollbar-inset:var(--radius-box)]",
);
export const themeControllerScheme = cva("flex items-center gap-3", {
  variants: { active: { true: "menu-active" } },
});
export const themeControllerSwatches = cva("flex shrink-0 -space-x-1.5");
/** One swatch: a scheme's own colour (from the registry), so not a theme token. */
export const themeControllerSwatch = cva("size-4 rounded-full ring-2 ring-base-100");
export const themeControllerSchemeLabel = cva("min-w-0 flex-1 truncate text-start");

/** `cycle` mode: the order, and each theme's icon. `system` follows the OS (no `data-theme`). */
const CYCLE = ["system", "dark", "light"] as const;
type CycleTheme = (typeof CYCLE)[number];
const CYCLE_ICON: Record<CycleTheme, IconName> = { system: "contrast", dark: "moon", light: "sun" };

/** Apply a colour scheme to the page: `data-scheme` on <html> (none for daisyUI's own, `default`). */
export function applyScheme(id: string) {
  if (id && id !== "default") document.documentElement.dataset.scheme = id;
  else delete document.documentElement.dataset.scheme;
}

/** Apply a `cycle` theme to the page: `data-theme` on <html> (none for `system`). */
export function applyTheme(theme: string) {
  if (theme === "dark" || theme === "light") document.documentElement.dataset.theme = theme;
  else delete document.documentElement.dataset.theme;
}

export type ThemeControllerVariants = VariantProps<typeof themeController>;
export type ThemeControllerAs = NonNullable<ThemeControllerVariants["as"]>;

const STORAGE_KEY = "ui-theme";
const SCHEME_KEY = "ui-scheme";
/** `background`: the chosen image's id, and its URL (read before the first paint, see index.html). */
const BACKGROUND_KEY = "ui-background";
const BACKGROUND_SRC_KEY = "ui-background-src";

/**
 * @example <ui-theme-controller theme="dark"></ui-theme-controller>          <!-- toggle -->
 * @example <ui-theme-controller as="swap" theme="dark" persist></ui-theme-controller>
 * @example <ui-theme-controller as="toggle" theme="dark" off-label="Light" on-label="Dark"></ui-theme-controller>
 * @example <ui-theme-controller as="radio" .themes=${["light", "dark", "cupcake"]}></ui-theme-controller>
 * @example <ui-theme-controller as="dropdown" label="Theme" .themes=${["light", "dark"]}></ui-theme-controller>
 * @example <ui-theme-controller as="cycle" persist></ui-theme-controller>
 * @example <ui-theme-controller as="scheme" persist></ui-theme-controller>
 *
 * - `toggle` / `checkbox` / `swap`: one input, checked = `theme`, unchecked = page default.
 * - `radio` / `buttons` / `dropdown`: one input per entry in `themes`; `value` is the selected one.
 * - `cycle`: one button stepping system → dark → light (`value`), setting `data-theme` on <html>.
 *   The new theme is revealed by a circle growing from the click point (View Transitions, on M3's
 *   expressive slow spatial spring; see `::view-transition-new(root)` in src/index.css), and the
 *   icon pops in with a bounce. index.html applies the saved theme before first paint.
 * - `scheme`: a menu of colour schemes (`schemes`, default: the tweakcn set in ./schemes.ts, plus
 *   daisyUI's own as "Default"), each with swatches for the current light/dark mode; picking one
 *   sets `data-scheme` on <html> (src/styles/schemes.css) with the same reveal. Saved separately
 *   (`ui-scheme`), so any scheme works with System / Dark / Light.
 * `persist` remembers the choice in localStorage. `ui-change` (detail: { theme }) fires on change.
 */
@customElement("ui-theme-controller")
export class UiThemeController extends LightElement {
  @property() as: ThemeControllerAs = "toggle";
  /** Theme applied while checked (single-input modes). */
  @property() theme = "dark";
  /** Themes offered by the multi-choice modes ("default" = page default). */
  @property({ attribute: false }) themes: string[] = ["default", "light", "dark"];
  /** `scheme` mode: the colour schemes offered (besides "default"). */
  @property({ attribute: false }) schemes: Scheme[] = SCHEMES;
  /** `background` mode: the images offered (besides none and your own upload). */
  @property({ attribute: false }) backgrounds: BackgroundImage[] = [];
  /** Selected theme (multi-choice modes) or "" for the page default. */
  @property() value = "";
  @property({ type: Boolean }) checked = false;
  @property() name = uid("theme");
  /** Remember the selection in localStorage. */
  @property({ type: Boolean }) persist = false;

  /** Text before / after the toggle. */
  @property({ attribute: "off-label" }) offLabel: Renderable = "";
  @property({ attribute: "on-label" }) onLabel: Renderable = "";
  /** Dropdown trigger text. */
  @property() label: Renderable = "Theme";

  connectedCallback() {
    super.connectedCallback();
    if (!this.persist) return;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(this._key);
    } catch {
      /* storage unavailable */
    }
    if (saved == null) return;
    if (this.as === "background") {
      this.value = saved;
      return;
    }
    if (this.as === "scheme") {
      this.value = this.schemes.some((x) => x.id === saved) ? saved : "default";
      applyScheme(this.value);
    } else if (this.as === "cycle") {
      this.value = (CYCLE as readonly string[]).includes(saved) ? saved : "system";
      applyTheme(this.value);
    } else if (this._multi) this.value = saved;
    else this.checked = saved === this.theme;
  }

  private get _key() {
    return this.as === "scheme" ? SCHEME_KEY : this.as === "background" ? BACKGROUND_KEY : STORAGE_KEY;
  }

  private get _multi() {
    return this.as === "radio" || this.as === "buttons" || this.as === "dropdown";
  }

  private _changed(theme: string) {
    if (this.persist) {
      try {
        localStorage.setItem(this._key, theme);
      } catch {
        /* storage unavailable */
      }
    }
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { theme }, bubbles: true }));
  }

  /** A theme reveal is playing; clicks wait until it's done. */
  #revealing = false;

  /**
   * Run `apply` revealed by a circle growing from the click point (View Transitions; the CSS is
   * `::view-transition-new(root)` in src/index.css). While a reveal plays, further changes are
   * ignored until it finishes. A keyboard "click" has no position, so it starts from `from`'s centre.
   */
  private async _reveal(e: MouseEvent, from: Element, apply: () => void) {
    if (this.#revealing) return;
    const doc = document as Document & {
      startViewTransition?: (update: () => Promise<void>) => { finished: Promise<void> };
    };
    if (!doc.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
    const box = from.getBoundingClientRect();
    const x = e.detail ? e.clientX : box.x + box.width / 2;
    const y = e.detail ? e.clientY : box.y + box.height / 2;
    const root = document.documentElement.style;
    root.setProperty("--theme-reveal-x", `${x}px`);
    root.setProperty("--theme-reveal-y", `${y}px`);
    root.setProperty("--theme-reveal-r", `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`);
    this.#revealing = true;
    try {
      await doc.startViewTransition(async () => {
        apply();
        await this.updateComplete;
      }).finished;
    } catch {
      /* skipped (e.g. the page changed): the change is applied either way */
    } finally {
      this.#revealing = false;
    }
  }

  /** `cycle`: step to the next theme (system → dark → light), revealed from the click point. */
  private _cycle(e: MouseEvent) {
    const current = (CYCLE as readonly string[]).includes(this.value) ? (this.value as CycleTheme) : "system";
    const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length]!;
    void this._reveal(e, this.querySelector("button")!, () => {
      applyTheme(next);
      this.value = next;
      this._changed(next);
    });
  }

  /** `scheme`: switch to a colour scheme, revealed from the click point; the menu closes. */
  private _pickScheme(e: MouseEvent, id: string) {
    const entry = e.currentTarget as HTMLElement;
    void this._reveal(e, entry, () => {
      (document.activeElement as HTMLElement | null)?.blur();
      applyScheme(id);
      this.value = id;
      this._changed(id);
    });
  }

  /** `background`: show an image (or none), revealed from the click point; the picker closes. */
  private _pickBackground(e: MouseEvent, id: string, src: string | null) {
    const from = (e.currentTarget as HTMLElement | null) ?? this;
    void this._reveal(e, from, () => {
      (document.activeElement as HTMLElement | null)?.blur();
      applyBackground(src);
      if (this.persist) {
        try {
          if (src) localStorage.setItem(BACKGROUND_SRC_KEY, src);
          else localStorage.removeItem(BACKGROUND_SRC_KEY);
        } catch {
          /* too big for storage (or storage off): shown for this visit only */
        }
      }
      this.value = id;
      this._changed(id);
    });
  }

  private async _upload(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file?.type.startsWith("image/")) return;
    const src = await shrinkImage(file);
    this._pickBackground(new MouseEvent("click"), "custom", src);
  }

  private _backgroundMenu() {
    const current = this.value || "none";
    const check = (id: string) =>
      id === current
        ? html`<span class=${themeControllerBackgroundCheck()}>${iconSvg("check", { size: "xs" })}</span>`
        : nothing;
    const custom = current === "custom";
    return html`<div class=${dropdown({ align: "end" })}>
      <div
        tabindex="0"
        role="button"
        class=${themeControllerIcon()}
        aria-label="Background image"
        title="Background image"
      >
        ${iconSvg("wallpaper", { size: "md" })}
      </div>
      <div
        tabindex="-1"
        class=${dropdownContent({ class: dropdownPanel({ surface: "glass", rounded: true, shadow: "lg", class: themeControllerBackgrounds() }) })}
      >
        <div class=${themeControllerBackgroundsHead()}>
          <span>Background</span><span class=${themeControllerBackgroundsCredit()}>Photos: Pexels</span>
        </div>
        <div class=${themeControllerBackgroundGrid()} role="listbox" aria-label="Background image">
          <button
            type="button"
            role="option"
            aria-selected=${current === "none"}
            class=${themeControllerBackground({ active: current === "none" })}
            @click=${(e: MouseEvent) => this._pickBackground(e, "none", null)}
          >
            <span class=${themeControllerBackgroundEmpty()}>${iconSvg("no-image", { size: "lg" })}No image</span>
            ${check("none")}
          </button>
          ${this.backgrounds.map(
            (b) =>
              html`<button
                type="button"
                role="option"
                aria-selected=${current === b.id}
                class=${themeControllerBackground({ active: current === b.id })}
                @click=${(e: MouseEvent) => this._pickBackground(e, b.id, b.src)}
              >
                <img class=${themeControllerBackgroundImage()} src=${b.thumb ?? b.src} alt="" loading="lazy" />
                <span class=${themeControllerBackgroundLabel()}>${b.label}</span>
                ${check(b.id)}
              </button>`,
          )}
          <label class=${themeControllerBackground({ active: custom, upload: !custom })}>
            <input class=${themeControllerFile()} type="file" accept="image/*" @change=${this._upload} />
            <span class=${themeControllerBackgroundEmpty()}>
              ${iconSvg("upload", { size: "lg" })}${custom ? "Replace your image" : "Upload your own"}
            </span>
            ${check("custom")}
          </label>
        </div>
      </div>
    </div>`;
  }

  private _schemeMenu() {
    const current = this.schemes.some((x) => x.id === this.value) ? this.value : "default";
    const dark = getComputedStyle(document.documentElement).colorScheme.includes("dark");
    const entry = (id: string, label: string, swatches: unknown) =>
      html`<li>
        <button
          type="button"
          class=${themeControllerScheme({ active: id === current })}
          aria-current=${id === current ? "true" : nothing}
          @click=${(e: MouseEvent) => this._pickScheme(e, id)}
        >
          <span class=${themeControllerSwatches()}>${swatches}</span>
          <span class=${themeControllerSchemeLabel()}>${label}</span>
          ${id === current ? iconSvg("check", { size: "sm" }) : nothing}
        </button>
      </li>`;
    const swatch = (color: string) =>
      html`<span class=${themeControllerSwatch()} style=${styleMap({ background: color })}></span>`;
    const active = this.schemes.find((x) => x.id === current);
    return html`<div class=${dropdown({ align: "end" })}>
      <div
        tabindex="0"
        role="button"
        class=${themeControllerIcon()}
        aria-label=${`Colour scheme: ${active?.label ?? "Default"}`}
        title=${`Colour scheme: ${active?.label ?? "Default"}`}
      >
        ${iconSvg("palette", { size: "md" })}
      </div>
      <ul
        tabindex="-1"
        class=${dropdownContent({ class: dropdownPanel({ surface: "glass", rounded: true, shadow: "lg", class: themeControllerSchemes() }) })}
      >
        ${entry("default", "Default", iconSvg("contrast", { size: "sm" }))}
        ${this.schemes.map((x) => {
          const sw = dark ? x.dark : x.light;
          return entry(x.id, x.label, [sw.base, sw.primary, sw.secondary, sw.accent].map(swatch));
        })}
      </ul>
    </div>`;
  }

  private _single() {
    return html`<input
      type="checkbox"
      class=${themeController({ as: this.as })}
      value=${this.theme}
      aria-label="Toggle ${this.theme} theme"
      .checked=${this.checked}
      @change=${(e: Event) => {
        this.checked = (e.target as HTMLInputElement).checked;
        this._changed(this.checked ? this.theme : "");
      }}
    />`;
  }

  private _choice(theme: string, labelled: boolean) {
    const input = html`<input
      type="radio"
      name=${this.name}
      class=${themeController({ as: this.as })}
      value=${theme}
      aria-label=${theme}
      .checked=${this.value === theme}
      @change=${() => {
        this.value = theme;
        this._changed(theme);
      }}
    />`;
    return labelled ? html`<label class=${fieldsetLabel({ control: true })}>${input} ${theme}</label>` : input;
  }

  render() {
    switch (this.as) {
      case "checkbox":
        return this._single();
      case "background":
        return this._backgroundMenu();
      case "scheme":
        return this._schemeMenu();
      case "cycle": {
        const current = (CYCLE as readonly string[]).includes(this.value) ? (this.value as CycleTheme) : "system";
        const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length]!;
        const label = `Theme: ${current}. Switch to ${next}`;
        return html`<button
          type="button"
          class=${themeControllerIcon()}
          aria-label=${label}
          title=${label}
          @click=${this._cycle}
        >
          ${keyed(current, html`<span class=${themeControllerGlyph()}>${iconSvg(CYCLE_ICON[current], { size: "md" })}</span>`)}
        </button>`;
      }
      case "swap":
        return html`<label class=${swap({ variant: "rotate" })}>
          ${this._single()}
          <span class=${swapOff()}>${iconSvg("sun", { size: "2xl" })}</span>
          <span class=${swapOn()}>${iconSvg("moon", { size: "2xl" })}</span>
        </label>`;
      case "radio":
        return html`<fieldset class=${fieldset()}>${this.themes.map((t) => this._choice(t, true))}</fieldset>`;
      case "buttons":
        return html`<div class=${join({ direction: "vertical" })}>
          ${this.themes.map((t) => this._choice(t, false))}
        </div>`;
      case "dropdown":
        return html`<div class=${dropdown()}>
          <div tabindex="0" role="button" class=${button()}>
            ${this.label} ${iconSvg("chevron-down", { size: "xs" })}
          </div>
          <ul
            tabindex="-1"
            class=${dropdownContent({
              class: dropdownPanel({ surface: "base-300", rounded: true, width: "52", padding: "2", shadow: "2xl" }),
            })}
          >
            ${this.themes.map((t) => html`<li>${this._choice(t, false)}</li>`)}
          </ul>
        </div>`;
      default: {
        const sw = this._single();
        return this.offLabel || this.onLabel
          ? html`<label class=${fieldsetLabel({ control: true })}>
              ${this.offLabel ? html`<span>${this.offLabel}</span>` : nothing} ${sw}
              ${this.onLabel ? html`<span>${this.onLabel}</span>` : nothing}
            </label>`
          : sw;
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-theme-controller": UiThemeController;
  }
}
