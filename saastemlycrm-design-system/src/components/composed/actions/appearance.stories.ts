import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn, waitFor, type Mock } from "storybook/test";
import "./appearance.ts";
import { getLocale, overwriteGetLocale } from "../../../lib/i18n/paraglide/runtime.js";
import { LIVE_BACKGROUNDS, STORAGE, type LiveBackground } from "../../../lib/base/appearance.ts";
import { SCHEMES, type Scheme } from "../../../styles/schemes.ts";
import type { AppearanceKind, BackgroundImage, UiAppearance } from "./appearance.ts";

const swatch = (from: string, to: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="160" height="100" fill="url(#g)"/></svg>`,
  )}`;

const backgrounds: BackgroundImage[] = [
  { id: "dawn", label: "Dawn", src: swatch("#f6d365", "#fda085"), thumb: swatch("#fda085", "#f6d365") },
  { id: "ocean", label: "Ocean", src: swatch("#4facfe", "#00f2fe") },
];

const schemes: Scheme[] = [
  {
    id: "harbour",
    label: "Harbour",
    light: { base: "#ffffff", primary: "#1d4ed8", secondary: "#e2e8f0", accent: "#bae6fd" },
    dark: { base: "#0f172a", primary: "#60a5fa", secondary: "#1e293b", accent: "#0369a1" },
  },
  {
    id: "meadow",
    label: "Meadow",
    light: { base: "#fefce8", primary: "#15803d", secondary: "#ecfccb", accent: "#fde68a" },
    dark: { base: "#052e16", primary: "#4ade80", secondary: "#14532d", accent: "#a16207" },
  },
];

const credit = { text: "Photos by the design team" };

type AppearanceArgs = {
  kind: AppearanceKind;
  schemes?: Scheme[];
  backgrounds: BackgroundImage[];
  live?: LiveBackground[];
  credit: string;
  value: string;
  persist: boolean;
  onChange: Mock<(detail: { theme: string }) => void>;
};

const root = document.documentElement;
const stateKeys = Object.values(STORAGE);

const keepGlobals = () => {
  const stored = stateKeys.map((k) => [k, localStorage.getItem(k)] as const);
  const data = { theme: root.dataset.theme, scheme: root.dataset.scheme, background: root.dataset.background };
  const style = root.getAttribute("style");
  Object.defineProperty(document, "startViewTransition", { value: undefined, configurable: true, writable: true });
  return () => {
    try {
      delete (document as { startViewTransition?: unknown }).startViewTransition;
      for (const [k, v] of stored) {
        if (v == null) localStorage.removeItem(k);
        else localStorage.setItem(k, v);
      }
    } finally {
      for (const [k, v] of Object.entries(data)) {
        if (v == null) delete root.dataset[k];
        else root.dataset[k] = v;
      }
      if (style == null) root.removeAttribute("style");
      else root.setAttribute("style", style);
      window.dispatchEvent(new Event("ui-background"));
    }
  };
};

const seed = (values: Partial<Record<keyof typeof STORAGE, string>>) => () => {
  for (const k of stateKeys) localStorage.removeItem(k);
  for (const [k, v] of Object.entries(values)) localStorage.setItem(STORAGE[k as keyof typeof STORAGE], v);
};

const changed = (args: AppearanceArgs) => (e: CustomEvent<{ theme: string }>) => args.onChange(e.detail);

const appearanceOf = (el: HTMLElement) => el.querySelector<UiAppearance>("ui-appearance")!;

const imageFile = async () => {
  const canvas = new OffscreenCanvas(64, 32);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#336699";
  ctx.fillRect(0, 0, 64, 32);
  return new File([await canvas.convertToBlob({ type: "image/png" })], "mine.png", { type: "image/png" });
};

const choosing = async (choose: (input: HTMLInputElement) => void | Promise<void>, act: () => Promise<void>) => {
  const click = HTMLInputElement.prototype.click;
  const opened: HTMLInputElement[] = [];
  HTMLInputElement.prototype.click = function (this: HTMLInputElement) {
    if (this.type === "file") opened.push(this);
    else click.call(this);
  };
  try {
    await act();
    await waitFor(() => expect(opened).toHaveLength(1));
    await expect(opened[0]).toHaveAttribute("accept", "image/*");
    await choose(opened[0]!);
  } finally {
    HTMLInputElement.prototype.click = click;
  }
};

const give = (input: HTMLInputElement, file: File) => {
  const data = new DataTransfer();
  data.items.add(file);
  input.files = data.files;
  input.dispatchEvent(new Event("change"));
};

const meta = preview.type<{ args: AppearanceArgs }>().meta({
  title: "Composed/Actions/Appearance",
  component: "ui-appearance",
  args: {
    kind: "theme",
    schemes,
    backgrounds,
    live: undefined,
    credit: "",
    value: "",
    persist: false,
    onChange: fn(),
  },
  argTypes: {
    kind: { control: "inline-radio", options: ["theme", "scheme", "background", "language", "all"] },
    schemes: { control: "object", description: "The colour schemes offered; defaults to the built-in schemes." },
    backgrounds: { control: "object", description: "The background images offered." },
    live: {
      control: "check",
      options: ["live-waves", "live-magnet-lines"],
      description: "The live backgrounds offered; defaults to all of them.",
    },
    credit: { control: "text", description: "A credit line for the background images." },
    value: { control: "text", description: "The current choice." },
    persist: { control: "boolean", description: "Remembers the choice in local storage and restores it." },
    onChange: { table: { category: "events" } },
  },
  beforeEach: () => keepGlobals(),
  render: (args) => html`
    <ui-appearance
      kind=${ifDefined(args.kind)}
      .schemes=${args.schemes ?? SCHEMES}
      .backgrounds=${args.backgrounds}
      .live=${args.live ?? LIVE_BACKGROUNDS.map((b) => b.id)}
      credit=${args.credit}
      value=${args.value}
      ?persist=${args.persist}
      @ui-change=${changed(args)}
    ></ui-appearance>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "The theme button cycles system, dark and light." } } },
  beforeEach: seed({}),
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole("button", { name: "Theme: System. Switch to Dark" });
    await userEvent.click(button);
    await waitFor(() => expect(root.dataset.theme).toBe("dark"));
    await expect(args.onChange).toHaveBeenLastCalledWith({ theme: "dark" });
    await expect(await canvas.findByRole("button", { name: "Theme: Dark. Switch to Light" })).toHaveFocus();
    await userEvent.click(canvas.getByRole("button", { name: "Theme: Dark. Switch to Light" }));
    await waitFor(() => expect(root.dataset.theme).toBe("light"));
    await userEvent.click(await canvas.findByRole("button", { name: "Theme: Light. Switch to System" }));
    await waitFor(() => expect(root.dataset.theme).toBeUndefined());
    await expect(await canvas.findByRole("button", { name: "Theme: System. Switch to Dark" })).toBeVisible();
    await expect(args.onChange).toHaveBeenCalledTimes(3);
    await expect(localStorage.getItem(STORAGE.theme)).toBeNull();
  },
});

export const ThemeRemembered = meta.story({
  name: "Theme, remembered",
  args: { persist: true },
  beforeEach: seed({ theme: "dark" }),
  play: async ({ canvas, userEvent, args }) => {
    await expect(root.dataset.theme).toBe("dark");
    const button = canvas.getByRole("button", { name: "Theme: Dark. Switch to Light" });
    await userEvent.click(button);
    await waitFor(() => expect(localStorage.getItem(STORAGE.theme)).toBe("light"));
    await expect(root.dataset.theme).toBe("light");
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(args.onChange).toHaveBeenCalledWith({ theme: "light" });
  },
});

export const ThemeUnknownSaved = meta.story({
  name: "Theme, unknown saved value",
  args: { persist: true },
  beforeEach: seed({ theme: "sepia" }),
  play: async ({ canvas, canvasElement }) => {
    await expect(root.dataset.theme).toBeUndefined();
    await expect(appearanceOf(canvasElement).value).toBe("system");
    await expect(canvas.getByRole("button", { name: "Theme: System. Switch to Dark" })).toBeVisible();
  },
});

export const ColourScheme = meta.story({
  name: "Colour scheme",
  args: { kind: "scheme", persist: true },
  beforeEach: seed({}),
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Colour scheme: Default" });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const harbour = await canvas.findByRole("button", { name: "Harbour" });
    await waitFor(() => expect(harbour).toBeVisible());
    await expect(canvas.getByRole("button", { name: "Meadow" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Default" })).toBeVisible();
    await userEvent.click(harbour);
    await waitFor(() => expect(root.dataset.scheme).toBe("harbour"));
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(args.onChange).toHaveBeenCalledWith({ theme: "harbour" });
    await expect(localStorage.getItem(STORAGE.scheme)).toBe("harbour");
    await expect(await canvas.findByRole("button", { name: "Colour scheme: Harbour" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  },
});

export const SchemeRememberedDark = meta.story({
  name: "Colour scheme, remembered in dark",
  args: { kind: "scheme", persist: true },
  globals: { theme: "dark" },
  beforeEach: seed({ scheme: "meadow" }),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(root.dataset.scheme).toBe("meadow");
    const trigger = canvas.getByRole("button", { name: "Colour scheme: Meadow" });
    await userEvent.click(trigger);
    const meadow = await canvas.findByRole("button", { name: "Meadow" });
    await waitFor(() => expect(meadow).toBeVisible());
    const colors = canvasElement.querySelectorAll("ui-swatches");
    await expect((colors[1] as HTMLElement & { colors: string[] }).colors).toEqual(Object.values(schemes[1]!.dark));
    await userEvent.click(canvas.getByRole("button", { name: "Default" }));
    await waitFor(() => expect(root.dataset.scheme).toBeUndefined());
    await expect(localStorage.getItem(STORAGE.scheme)).toBe("default");
  },
});

export const SchemeUnknownSaved = meta.story({
  name: "Colour scheme, unknown saved value",
  args: { kind: "scheme", persist: true },
  globals: { theme: "light" },
  beforeEach: seed({ scheme: "retired" }),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(root.dataset.scheme).toBeUndefined();
    await expect(appearanceOf(canvasElement).value).toBe("default");
    await userEvent.click(canvas.getByRole("button", { name: "Colour scheme: Default" }));
    await waitFor(() => expect(canvas.getByRole("button", { name: "Harbour" })).toBeVisible());
    const colors = canvasElement.querySelectorAll("ui-swatches");
    await expect((colors[0] as HTMLElement & { colors: string[] }).colors).toEqual(Object.values(schemes[0]!.light));
  },
});

export const Background = meta.story({
  name: "Background",
  args: { kind: "background", persist: true, credit: credit.text },
  beforeEach: seed({}),
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Background image" });
    await userEvent.click(trigger);
    await waitFor(() => expect(canvas.getByText(credit.text)).toBeVisible());
    await expect(canvas.getByText("Background")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "No image" })).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("button", { name: "Upload your own" })).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(canvas.getByRole("button", { name: "Ocean" }));
    await waitFor(() => expect(root.style.getPropertyValue("--app-background")).toBe(`url("${backgrounds[1]!.src}")`));
    await expect(localStorage.getItem(STORAGE.background)).toBe("ocean");
    await expect(localStorage.getItem(STORAGE.backgroundSrc)).toBe(backgrounds[1]!.src);
    await expect(args.onChange).toHaveBeenLastCalledWith({ theme: "ocean" });
    await userEvent.click(trigger);
    await waitFor(() => expect(canvas.getByRole("button", { name: "Ocean" })).toHaveAttribute("aria-pressed", "true"));
    await userEvent.click(canvas.getByRole("button", { name: "Waves" }));
    await waitFor(() => expect(root.dataset.background).toBe("live-waves"));
    await expect(root.style.getPropertyValue("--app-background")).toBe("");
    await expect(localStorage.getItem(STORAGE.backgroundSrc)).toBeNull();
    await userEvent.click(trigger);
    await userEvent.click(await canvas.findByRole("button", { name: "No image" }));
    await waitFor(() => expect(root.dataset.background).toBeUndefined());
    await expect(localStorage.getItem(STORAGE.background)).toBe("none");
    await expect(args.onChange).toHaveBeenCalledTimes(3);
  },
});

export const BackgroundUpload = meta.story({
  name: "Background, upload",
  args: { kind: "background", live: ["live-magnet-lines"] },
  beforeEach: seed({}),
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Background image" });
    await userEvent.click(trigger);
    await waitFor(() => expect(canvas.getByRole("button", { name: "Magnet lines" })).toBeVisible());
    await expect(canvas.queryByRole("button", { name: "Waves" })).toBeNull();
    await choosing(
      (input) => void input.dispatchEvent(new Event("cancel")),
      () => userEvent.click(canvas.getByRole("button", { name: "Upload your own" })),
    );
    await choosing(
      (input) => give(input, new File(["notes"], "notes.txt", { type: "text/plain" })),
      () => userEvent.click(canvas.getByRole("button", { name: "Upload your own" })),
    );
    await expect(args.onChange).not.toHaveBeenCalled();
    await choosing(
      async (input) => give(input, await imageFile()),
      () => userEvent.click(canvas.getByRole("button", { name: "Upload your own" })),
    );
    await waitFor(() => expect(args.onChange).toHaveBeenCalledOnce());
    await expect(args.onChange).toHaveBeenCalledWith({ theme: "custom" });
    await expect(root.style.getPropertyValue("--app-background")).toMatch(/^url\("data:image\/jpeg/);
    await expect(localStorage.getItem(STORAGE.background)).toBeNull();
    await userEvent.click(trigger);
    await expect(await canvas.findByRole("button", { name: "Replace your image" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
});

export const BackgroundRememberedLive = meta.story({
  name: "Background, remembered live",
  args: { kind: "background", persist: true },
  beforeEach: seed({ background: "live-magnet-lines" }),
  play: async ({ canvas, userEvent }) => {
    await expect(root.dataset.background).toBe("live-magnet-lines");
    await userEvent.click(canvas.getByRole("button", { name: "Background image" }));
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Magnet lines" })).toHaveAttribute("aria-pressed", "true"),
    );
    await expect(canvas.queryByText(credit.text)).toBeNull();
  },
});

export const BackgroundRememberedImage = meta.story({
  name: "Background, remembered image",
  args: { kind: "background", persist: true },
  beforeEach: seed({ background: "custom" }),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(appearanceOf(canvasElement).value).toBe("custom");
    await expect(root.dataset.background).toBeUndefined();
    await userEvent.click(canvas.getByRole("button", { name: "Background image" }));
    await expect(await canvas.findByRole("button", { name: "Replace your image" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
});

export const Language = meta.story({
  name: "Language",
  args: { kind: "language", persist: true },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await expect(appearanceOf(canvasElement).value).toBe("en");
    const trigger = canvas.getByRole("button", { name: "Language: English" });
    await userEvent.click(trigger);
    const english = await canvas.findByRole("button", { name: /English.*Current language/ });
    await waitFor(() => expect(english).toBeVisible());
    await expect(canvas.getByRole("button", { name: /العربية.*Arabic/ })).toBeVisible();
    await expect(canvas.getByText("Language", { selector: "span" })).toBeVisible();
    await userEvent.click(english);
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(args.onChange).toHaveBeenCalledWith({ theme: "en" });
    await expect(root.lang).toBe("en");
  },
});

export const All = meta.story({
  name: "All settings",
  args: { kind: "all", persist: true, credit: credit.text },
  beforeEach: seed({}),
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Display settings" });
    await userEvent.click(trigger);
    await waitFor(() => expect(canvas.getByRole("button", { name: "System" })).toBeVisible());
    await expect(canvas.getByText(credit.text)).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Default" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Dark" }));
    await waitFor(() => expect(root.dataset.theme).toBe("dark"));
    await expect(localStorage.getItem(STORAGE.theme)).toBe("dark");
    await expect(appearanceOf(canvasElement).value).toBe("");
    await userEvent.click(trigger);
    await userEvent.click(await canvas.findByRole("button", { name: "Meadow" }));
    await waitFor(() => expect(root.dataset.scheme).toBe("meadow"));
    await userEvent.click(trigger);
    await userEvent.click(await canvas.findByRole("button", { name: "Dawn" }));
    await waitFor(() => expect(root.style.getPropertyValue("--app-background")).toBe(`url("${backgrounds[0]!.src}")`));
    await userEvent.click(trigger);
    await userEvent.click(await canvas.findByRole("button", { name: /English/ }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ theme: "en" });
    await expect(args.onChange.mock.calls.map(([d]) => d.theme)).toEqual(["dark", "meadow", "dawn", "en"]);
  },
});

export const AllRemembered = meta.story({
  name: "All settings, remembered",
  args: { kind: "all", persist: true },
  beforeEach: seed({ theme: "light", scheme: "harbour", background: "dawn" }),
  play: async ({ canvas, userEvent }) => {
    await expect(root.dataset.scheme).toBeUndefined();
    await userEvent.click(canvas.getByRole("button", { name: "Display settings" }));
    await waitFor(() => expect(canvas.getByRole("button", { name: "Dawn" })).toHaveAttribute("aria-pressed", "true"));
    await expect(canvas.getByRole("button", { name: "No image" })).toHaveAttribute("aria-pressed", "false");
  },
});

export const Controller = meta.story({
  name: "Options and select",
  parameters: { docs: { description: { story: "options() lists the choices and select() applies one by id." } } },
  args: { kind: "background" },
  beforeEach: seed({ theme: "dark" }),
  render: (args) => html`
    <ui-appearance kind="theme" @ui-change=${changed(args)}></ui-appearance>
    <ui-appearance kind="scheme" .schemes=${schemes} @ui-change=${changed(args)}></ui-appearance>
    <ui-appearance kind="background" .backgrounds=${backgrounds} @ui-change=${changed(args)}></ui-appearance>
    <ui-appearance kind="language"></ui-appearance>
    <ui-appearance kind="all" @ui-change=${changed(args)}></ui-appearance>
  `,
  play: async ({ canvasElement, args }) => {
    const [theme, scheme, background, language, all] = [
      ...canvasElement.querySelectorAll<UiAppearance>("ui-appearance"),
    ];
    await expect(theme!.options()).toEqual({
      selected: "system",
      choices: [
        { id: "system", label: "System" },
        { id: "dark", label: "Dark" },
        { id: "light", label: "Light" },
      ],
    });
    await expect(scheme!.options()).toEqual({
      selected: "default",
      choices: [
        { id: "default", label: "Default" },
        { id: "harbour", label: "Harbour" },
        { id: "meadow", label: "Meadow" },
      ],
    });
    await expect(background!.options().choices.map((c) => c.id)).toEqual([
      "none",
      "dawn",
      "ocean",
      "live-waves",
      "live-magnet-lines",
    ]);
    await expect(background!.options().selected).toBe("none");
    await expect(language!.options()).toEqual({
      selected: "en",
      choices: [
        { id: "en", label: "English" },
        { id: "ar", label: "العربية" },
      ],
    });
    await expect(all!.options().selected).toBe("dark");
    await expect(all!.options().choices.map((c) => c.id)).toEqual(["system", "dark", "light"]);

    await expect(await theme!.select("sepia")).toBe(false);
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(await scheme!.select("meadow")).toBe(true);
    await expect(root.dataset.scheme).toBe("meadow");
    await expect(scheme!.options().selected).toBe("meadow");
    await expect(await background!.select("ocean")).toBe(true);
    await expect(root.style.getPropertyValue("--app-background")).toBe(`url("${backgrounds[1]!.src}")`);
    await expect(await background!.select("none")).toBe(true);
    await expect(root.style.getPropertyValue("--app-background")).toBe("");
    await expect(await background!.select("live-waves")).toBe(true);
    await expect(root.dataset.background).toBe("live-waves");
    await expect(await all!.select("none")).toBe(false);
    await expect(await all!.select("light")).toBe(true);
    await expect(root.dataset.theme).toBe("light");
    await expect(args.onChange.mock.calls.map(([d]) => d.theme)).toEqual([
      "meadow",
      "ocean",
      "none",
      "live-waves",
      "light",
    ]);
  },
});

export const LanguageArabic = meta.story({
  name: "Language, in Arabic",
  args: { kind: "language" },
  beforeEach: () => {
    const original = getLocale;
    overwriteGetLocale(() => "ar");
    return () => {
      overwriteGetLocale(original);
    };
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "اللغة: العربية" }));
    const arabic = await canvas.findByRole("button", { name: /العربية.*اللغة الحالية/ });
    await waitFor(() => expect(arabic).toBeVisible());
    await expect(canvas.getByRole("button", { name: /English.*الإنجليزية/ })).toBeVisible();
    await userEvent.click(arabic);
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(args.onChange).toHaveBeenCalledWith({ theme: "ar" });
  },
});
