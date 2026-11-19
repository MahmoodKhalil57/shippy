import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import {
  applyBackground,
  applyScheme,
  applyTheme,
  isDark,
  remember,
  remembered,
  reveal,
  shrinkImage,
  STORAGE,
  THEMES,
  type ThemeChoice,
} from "../../base/appearance.ts";
import { LightElement } from "../../base/light-element.ts";
import { pickFile } from "../../base/pick-file.ts";
import { SCHEMES, type Scheme } from "../../../styles/schemes.ts";
import "../../primitives/actions/button.ts";
import "../../primitives/actions/icon-button.ts";
import "../../primitives/actions/dropdown.ts";
import "../../primitives/data/swatches.ts";
import "../../primitives/forms/choice-tile.ts";
import "../../primitives/layout/box.ts";
import "../../primitives/layout/flex.ts";
import "../../primitives/layout/grid.ts";
import type { IconName } from "../../primitives/media/icon.ts";
import "../../primitives/media/icon.ts";
import type { MenuItem } from "../../primitives/navigation/menu.ts";
import "../../primitives/navigation/menu.ts";
import "../../primitives/typography/text.ts";

/**
 * Appearance: the app header's look controls, one per `kind` —
 * - `theme`: a button stepping System → Dark → Light (`data-theme` on <html>; System follows the OS);
 *   its icon pops in with a bounce.
 * - `scheme`: a menu of colour schemes (the tweakcn set in src/styles/schemes.ts plus daisyUI's own,
 *   "Default"), each with its swatches for the current light / dark mode (`data-scheme` on <html>).
 * - `background`: a picker of background images (`backgrounds`), "No image", or the person's own
 *   upload (scaled down, kept in the browser), painted behind the app shell.
 * Every change is revealed by a circle growing from where it was clicked
 * (src/components/base/appearance.ts). `persist` remembers it (index.html applies the saved
 * theme and image before the first paint).
 *
 * Purpose: Actions · Kind: composed (Button / Dropdown / Menu / Swatches / Choice tile / Grid / Icon)
 *
 * `ui-change` { theme } fires on a change (the chosen id). `options()` / `select(id)` do the same
 * from code (an agent's tools).
 */

/** A background image offered by `kind="background"`: a full-size `src` and a small `thumb`. */
export interface BackgroundImage {
  id: string;
  label: string;
  src: string;
  thumb?: string;
}

export type AppearanceKind = "theme" | "scheme" | "background";

const THEME_ICON: Record<ThemeChoice, IconName> = { system: "contrast", dark: "moon", light: "sun" };

/**
 * @example <ui-appearance kind="theme" persist></ui-appearance>
 * @example <ui-appearance kind="scheme" persist></ui-appearance>
 * @example <ui-appearance kind="background" persist credit="Photos: Pexels" .backgrounds=${images}></ui-appearance>
 */
@customElement("ui-appearance")
export class UiAppearance extends LightElement {
  @property({ reflect: true }) kind: AppearanceKind = "theme";
  /** `scheme`: the colour schemes offered (besides "Default"). */
  @property({ attribute: false }) schemes: Scheme[] = SCHEMES;
  /** `background`: the images offered (besides none and your own upload). */
  @property({ attribute: false }) backgrounds: BackgroundImage[] = [];
  /** `background`: photo credit, shown in the picker's heading. */
  @property() credit = "";
  /** The chosen id: a theme, a scheme, or a background (`none`, `custom` for an upload). */
  @property() value = "";
  @property({ type: Boolean }) persist = false;

  /** Where the last click was, so the reveal grows from it (a keyboard press: from this control). */
  #from: { x: number; y: number } | null = null;

  private get _key() {
    return STORAGE[this.kind === "theme" ? "theme" : this.kind];
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("pointerdown", (e) => (this.#from = { x: e.clientX, y: e.clientY }));
    if (!this.persist) return;
    const saved = remembered(this._key);
    if (saved == null) return;
    if (this.kind === "background") this.value = saved;
    else if (this.kind === "scheme") {
      this.value = this.schemes.some((x) => x.id === saved) ? saved : "default";
      applyScheme(this.value);
    } else {
      this.value = (THEMES as readonly string[]).includes(saved) ? saved : "system";
      applyTheme(this.value);
    }
  }

  private get _none() {
    return this.kind === "background" ? "none" : this.kind === "theme" ? "system" : "default";
  }

  /** The choices this control offers, and which one is selected (for code: an agent's tools). */
  options(): { selected: string; choices: { id: string; label: string }[] } {
    const choices =
      this.kind === "theme"
        ? THEMES.map((id) => ({ id, label: id }))
        : this.kind === "scheme"
          ? [{ id: "default", label: "Default" }, ...this.schemes.map((s) => ({ id: s.id, label: s.label }))]
          : [{ id: "none", label: "No image" }, ...this.backgrounds.map((b) => ({ id: b.id, label: b.label }))];
    return { selected: this.value || this._none, choices };
  }

  /** Select a choice from code, exactly as picking it would. False when `id` isn't one of `options()`. */
  async select(id: string): Promise<boolean> {
    if (!this.options().choices.some((c) => c.id === id)) return false;
    this.#from = null;
    await this._pick(id, id === "none" ? null : (this.backgrounds.find((b) => b.id === id)?.src ?? null));
    return true;
  }

  /** Apply a choice (revealed), remember it, close any menu, and say so. */
  private async _pick(id: string, src: string | null = null) {
    const box = this.getBoundingClientRect();
    const from = this.#from ?? { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    this.#from = null;
    await reveal(from, async () => {
      this.querySelector("ui-dropdown")?.hide();
      if (this.kind === "theme") applyTheme(id);
      else if (this.kind === "scheme") applyScheme(id);
      else {
        applyBackground(src);
        if (this.persist) remember(STORAGE.backgroundSrc, src);
      }
      this.value = id;
      if (this.persist) remember(this._key, id);
      this.dispatchEvent(new CustomEvent("ui-change", { detail: { theme: id }, bubbles: true }));
      await this.updateComplete;
    });
  }

  private _theme() {
    const current = (THEMES as readonly string[]).includes(this.value) ? (this.value as ThemeChoice) : "system";
    const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length]!;
    return html`<ui-icon-button .label=${`Theme: ${current}. Switch to ${next}`} @click=${() => void this._pick(next)}>
      ${keyed(current, html`<ui-icon name=${THEME_ICON[current]} size="md" pop></ui-icon>`)}
    </ui-icon-button>`;
  }

  private _scheme() {
    const current = this.schemes.some((x) => x.id === this.value) ? this.value : "default";
    const dark = isDark();
    const label = `Colour scheme: ${this.schemes.find((x) => x.id === current)?.label ?? "Default"}`;
    const items: MenuItem[] = [
      {
        label: "Default",
        value: "default",
        active: current === "default",
        icon: html`<ui-icon name="contrast" size="sm"></ui-icon>`,
      },
      ...this.schemes.map((x) => {
        const sw = dark ? x.dark : x.light;
        return {
          label: x.label,
          value: x.id,
          active: x.id === current,
          icon: html`<ui-swatches .colors=${[sw.base, sw.primary, sw.secondary, sw.accent]}></ui-swatches>`,
        };
      }),
    ];
    return html`<ui-dropdown
      mode="popover"
      align="end"
      panel="card"
      panel-width="64"
      trigger-variant="text"
      trigger-shape="round"
      trigger-spaced="false"
      .triggerLabel=${label}
    >
      <ui-icon slot="trigger" name="palette" size="md"></ui-icon>
      <ui-box max-height="96">
        <ui-menu
          width="full"
          surface="false"
          .items=${items}
          @ui-select=${(e: CustomEvent<{ item: MenuItem }>) => {
            e.stopPropagation();
            void this._pick(String(e.detail.item.value));
          }}
        ></ui-menu>
      </ui-box>
    </ui-dropdown>`;
  }

  private async _upload() {
    const file = await pickFile("image/*");
    if (!file?.type.startsWith("image/")) return;
    await this._pick("custom", await shrinkImage(file));
  }

  private _background() {
    const current = this.value || "none";
    const custom = current === "custom";
    return html`<ui-dropdown
      mode="popover"
      align="end"
      panel="card"
      panel-width="80"
      trigger-variant="text"
      trigger-shape="round"
      trigger-spaced="false"
      .triggerLabel=${"Background image"}
    >
      <ui-icon slot="trigger" name="wallpaper" size="md"></ui-icon>
      <ui-box max-height="96">
        <ui-flex direction="col" gap="2">
          <ui-flex justify="between" align="baseline" gap="2">
            <ui-text as="span" variant="title-sm">Background</ui-text>
            ${this.credit ? html`<ui-text as="span" variant="body-sm" color="muted">${this.credit}</ui-text>` : nothing}
          </ui-flex>
          <ui-grid cols="2" gap="2">
            <ui-choice-tile
              icon="no-image"
              label="No image"
              ?selected=${current === "none"}
              @click=${() => void this._pick("none", null)}
            ></ui-choice-tile>
            ${this.backgrounds.map(
              (b) =>
                html`<ui-choice-tile
                  .image=${b.thumb ?? b.src}
                  .label=${b.label}
                  ?selected=${current === b.id}
                  @click=${() => void this._pick(b.id, b.src)}
                ></ui-choice-tile>`,
            )}
            <ui-choice-tile
              icon="upload"
              .label=${custom ? "Replace your image" : "Upload your own"}
              dashed
              ?selected=${custom}
              @click=${() => void this._upload()}
            ></ui-choice-tile>
          </ui-grid>
        </ui-flex>
      </ui-box>
    </ui-dropdown>`;
  }

  render() {
    return this.kind === "scheme" ? this._scheme() : this.kind === "background" ? this._background() : this._theme();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-appearance": UiAppearance;
  }
}
