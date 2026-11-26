import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import {
  applyBackground,
  applyScheme,
  applyTheme,
  isDark,
  isLiveBackground,
  LIVE_BACKGROUNDS,
  type LiveBackground,
  remember,
  remembered,
  reveal,
  shrinkImage,
  STORAGE,
  THEMES,
  type ThemeChoice,
} from "../../../lib/base/appearance.ts";
import { LightElement } from "../../base/light-element.ts";
import { LANGUAGES, LOCALES, locale, m, setLanguage, type Locale } from "../../../lib/i18n/index.ts";
import { pickFile } from "../../../lib/base/pick-file.ts";
import { liveBackground } from "./live-background.ts";
import { SCHEMES, type Scheme } from "../../../styles/schemes.ts";
import "../../primitives/actions/button.ts";
import "../../primitives/actions/icon-button.ts";
import "../../primitives/actions/dropdown.ts";
import "../../primitives/data/swatches.ts";
import "../../primitives/forms/choice-tile.ts";
import "../../primitives/layout/box.ts";
import "../../primitives/people/avatar.ts";
import "../../primitives/layout/flex.ts";
import "../../primitives/layout/grid.ts";
import type { IconName } from "../../primitives/media/icon.ts";
import "../../primitives/media/icon.ts";
import type { MenuItem } from "../../primitives/navigation/menu.ts";
import "../../primitives/navigation/menu.ts";
import "../../primitives/typography/text.ts";

export interface BackgroundImage {
  id: string;
  label: string;
  src: string;
  thumb?: string;
}

export type AppearanceKind = "theme" | "scheme" | "background" | "language" | "all";

const GATHERED = ["theme", "language", "scheme", "background"] as const;
type Single = (typeof GATHERED)[number];
type Stored = Exclude<Single, "language">;

const NONE: Record<Stored, string> = { theme: "system", scheme: "default", background: "none" };

const THEME_ICON: Record<ThemeChoice, IconName> = { system: "contrast", dark: "moon", light: "sun" };
const THEME_NAME: Record<ThemeChoice, () => string> = {
  system: () => m.appearance_theme_system(),
  dark: () => m.appearance_theme_dark(),
  light: () => m.appearance_theme_light(),
};

@customElement("ui-appearance")
export class UiAppearance extends LightElement {
  @property({ reflect: true }) kind: AppearanceKind = "theme";
  @property({ attribute: false }) schemes: Scheme[] = SCHEMES;
  @property({ attribute: false }) backgrounds: BackgroundImage[] = [];
  @property({ attribute: false }) live: readonly LiveBackground[] = LIVE_BACKGROUNDS.map((b) => b.id);
  @property() credit = "";
  @property() value = "";
  @property({ type: Boolean }) persist = false;

  #from: { x: number; y: number } | null = null;

  #keyOf(kind: Stored) {
    return STORAGE[kind];
  }

  #valueOf(kind: Stored): string {
    return kind === this.kind ? this.value : (remembered(this.#keyOf(kind)) ?? "");
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("pointerdown", (e) => (this.#from = { x: e.clientX, y: e.clientY }));
    if (this.kind === "language") this.value = locale();
    if (!this.persist || this.kind === "language" || this.kind === "all") return;
    const saved = remembered(this.#keyOf(this.kind));
    if (saved == null) return;
    if (this.kind === "background") {
      this.value = saved;
      if (isLiveBackground(saved)) applyBackground(null, saved);
    } else if (this.kind === "scheme") {
      this.value = this.schemes.some((x) => x.id === saved) ? saved : "default";
      applyScheme(this.value);
    } else {
      this.value = (THEMES as readonly string[]).includes(saved) ? saved : "system";
      applyTheme(this.value);
    }
  }

  options(): { selected: string; choices: { id: string; label: string }[] } {
    const kind: Single = this.kind === "all" ? "theme" : this.kind;
    if (kind === "language")
      return { selected: locale(), choices: LOCALES.map((id) => ({ id, label: LANGUAGES[id].name })) };
    const choices =
      kind === "theme"
        ? THEMES.map((id) => ({ id, label: THEME_NAME[id]() }))
        : kind === "scheme"
          ? [
              { id: "default", label: m.appearance_scheme_default() },
              ...this.schemes.map((s) => ({ id: s.id, label: s.label })),
            ]
          : [
              { id: "none", label: m.appearance_background_none() },
              ...this.backgrounds.map((b) => ({ id: b.id, label: b.label })),
              ...this.#live().map((b) => ({ id: b.id, label: b.label() })),
            ];
    return { selected: this.#valueOf(kind) || NONE[kind], choices };
  }

  async select(id: string): Promise<boolean> {
    if (!this.options().choices.some((c) => c.id === id)) return false;
    this.#from = null;
    await this._pick(id, id === "none" ? null : (this.backgrounds.find((b) => b.id === id)?.src ?? null));
    return true;
  }

  #live() {
    return LIVE_BACKGROUNDS.filter((b) => this.live.includes(b.id));
  }

  private async _pick(id: string, src: string | null = null, kind: Single = this.kind === "all" ? "theme" : this.kind) {
    if (kind === "language") {
      this.dispatchEvent(new CustomEvent("ui-change", { detail: { theme: id }, bubbles: true }));
      return setLanguage(id as Locale);
    }
    const box = this.getBoundingClientRect();
    const from = this.#from ?? { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    this.#from = null;
    await reveal(from, async () => {
      this.querySelector("ui-dropdown")?.hide();
      if (kind === "theme") applyTheme(id);
      else if (kind === "scheme") applyScheme(id);
      else {
        applyBackground(src, isLiveBackground(id) ? id : null);
        if (this.persist) remember(STORAGE.backgroundSrc, src);
      }
      if (kind === this.kind) this.value = id;
      if (this.persist) remember(this.#keyOf(kind), id);
      this.dispatchEvent(new CustomEvent("ui-change", { detail: { theme: id }, bubbles: true }));
      await this.updateComplete;
    });
  }

  private _theme() {
    const current = (THEMES as readonly string[]).includes(this.value) ? (this.value as ThemeChoice) : "system";
    const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length]!;
    return html`<ui-icon-button
      .label=${m.appearance_theme_label({ current: THEME_NAME[current](), next: THEME_NAME[next]() })}
      @click=${() => void this._pick(next)}
    >
      ${keyed(current, html`<ui-icon name=${THEME_ICON[current]} size="md" pop></ui-icon>`)}
    </ui-icon-button>`;
  }

  #schemeItems(): MenuItem[] {
    const value = this.#valueOf("scheme");
    const current = this.schemes.some((x) => x.id === value) ? value : "default";
    const dark = isDark();
    return [
      {
        label: m.appearance_scheme_default(),
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
  }

  private _scheme() {
    const current = this.schemes.some((x) => x.id === this.value) ? this.value : "default";
    const label = m.appearance_scheme_label({
      name: this.schemes.find((x) => x.id === current)?.label ?? m.appearance_scheme_default(),
    });
    const items = this.#schemeItems();
    return html`<ui-dropdown
      mode="popover"
      align="end"
      panel="card"
      panel-width="5"
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
    await this._pick("custom", await shrinkImage(file), "background");
  }

  #backgroundTiles() {
    const current = this.#valueOf("background") || "none";
    const custom = current === "custom";
    const pick = (id: string, src: string | null) => void this._pick(id, src, "background");
    return html`<ui-grid cols="2" gap="2">
      <ui-choice-tile
        icon="no-image"
        .label=${m.appearance_background_none()}
        ?selected=${current === "none"}
        @click=${() => pick("none", null)}
      ></ui-choice-tile>
      ${this.backgrounds.map(
        (b) =>
          html`<ui-choice-tile
            .image=${b.thumb ?? b.src}
            .label=${b.label}
            ?selected=${current === b.id}
            @click=${() => pick(b.id, b.src)}
          ></ui-choice-tile>`,
      )}
      ${this.#live().map(
        (b) =>
          html`<ui-choice-tile .label=${b.label()} ?selected=${current === b.id} @click=${() => pick(b.id, null)}
            >${liveBackground(b.id, true)}<!----></ui-choice-tile
          >`,
      )}
      <ui-choice-tile
        icon="upload"
        .label=${custom ? m.appearance_background_replace() : m.appearance_background_upload()}
        dashed
        ?selected=${custom}
        @click=${() => void this._upload()}
      ></ui-choice-tile>
    </ui-grid>`;
  }

  private _background() {
    return html`<ui-dropdown
      mode="popover"
      align="end"
      panel="card"
      panel-width="6"
      trigger-variant="text"
      trigger-shape="round"
      trigger-spaced="false"
      .triggerLabel=${m.appearance_background_label()}
    >
      <ui-icon slot="trigger" name="wallpaper" size="md"></ui-icon>
      <ui-box max-height="96">
        <ui-flex direction="col" gap="2">
          <ui-flex justify="between" align="baseline" gap="2">
            <ui-text as="span" variant="title-sm">${m.appearance_background_heading()}</ui-text>
            ${this.credit ? html`<ui-text as="span" variant="body-sm" color="muted">${this.credit}</ui-text>` : nothing}
          </ui-flex>
          ${this.#backgroundTiles()}
        </ui-flex>
      </ui-box>
    </ui-dropdown>`;
  }

  #languageItems(): MenuItem[] {
    const current = locale();
    const MARK: Record<Locale, string> = { en: "EN", ar: "ع" };
    const NAME: Record<Locale, () => string> = {
      en: () => m.appearance_language_en(),
      ar: () => m.appearance_language_ar(),
    };
    return LOCALES.map((id) => ({
      icon: html`<ui-avatar initials=${MARK[id]} size="xs" shape="circle" tone="secondary"></ui-avatar>`,
      label: html`<ui-flex direction="col" gap="0">
        <ui-text as="span" variant="label-lg" lang=${id}>${LANGUAGES[id].name}</ui-text>
        <ui-text as="span" variant="body-sm" color="muted"
          >${id === current ? m.appearance_language_current() : NAME[id]()}</ui-text
        >
      </ui-flex>`,
      value: id,
      active: id === current,
    }));
  }

  private _all() {
    const theme = this.#valueOf("theme");
    const themeNow = (THEMES as readonly string[]).includes(theme) ? (theme as ThemeChoice) : "system";
    const section = (kind: Single, items: MenuItem[]) =>
      html`<ui-menu
        width="full"
        surface="false"
        .items=${items}
        @ui-select=${(e: CustomEvent<{ item: MenuItem }>) => {
          e.stopPropagation();
          void this._pick(String(e.detail.item.value), null, kind);
        }}
      ></ui-menu>`;
    return html`<ui-dropdown
      mode="popover"
      align="end"
      panel="card"
      panel-width="5"
      trigger-variant="text"
      trigger-shape="round"
      trigger-spaced="false"
      .triggerLabel=${m.appearance_all_label()}
    >
      <ui-icon slot="trigger" name="settings" size="md"></ui-icon>
      <ui-box max-height="96">
        <ui-flex direction="col" gap="3">
          ${section("theme", [
            { label: m.appearance_theme_heading(), heading: true },
            ...THEMES.map((id) => ({
              label: THEME_NAME[id](),
              value: id,
              active: id === themeNow,
              icon: html`<ui-icon name=${THEME_ICON[id]} size="sm"></ui-icon>`,
            })),
          ])}
          ${section("language", [{ label: m.appearance_language_heading(), heading: true }, ...this.#languageItems()])}
          ${section("scheme", [{ label: m.appearance_scheme_heading(), heading: true }, ...this.#schemeItems()])}
          <ui-flex direction="col" gap="2">
            <ui-flex justify="between" align="baseline" gap="2">
              <ui-text as="span" variant="title-sm">${m.appearance_background_heading()}</ui-text>
              ${this.credit ? html`<ui-text as="span" variant="body-sm" color="muted">${this.credit}</ui-text>` : nothing}
            </ui-flex>
            ${this.#backgroundTiles()}
          </ui-flex>
        </ui-flex>
      </ui-box>
    </ui-dropdown>`;
  }

  private _language() {
    const current = locale();
    const items: MenuItem[] = [{ label: m.appearance_language_heading(), heading: true }, ...this.#languageItems()];
    return html`<ui-dropdown
      mode="popover"
      align="end"
      panel="card"
      panel-width="4"
      trigger-variant="text"
      trigger-shape="round"
      trigger-spaced="false"
      .triggerLabel=${m.appearance_language_label({ name: LANGUAGES[current].name })}
    >
      <ui-icon slot="trigger" name="translate" size="md"></ui-icon>
      <ui-menu
        width="full"
        surface="false"
        .items=${items}
        @ui-select=${(e: CustomEvent<{ item: MenuItem }>) => {
          e.stopPropagation();
          void this._pick(String(e.detail.item.value));
        }}
      ></ui-menu>
    </ui-dropdown>`;
  }

  render() {
    if (this.kind === "all") return this._all();
    return this.kind === "scheme"
      ? this._scheme()
      : this.kind === "background"
        ? this._background()
        : this.kind === "language"
          ? this._language()
          : this._theme();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-appearance": UiAppearance;
  }
}
