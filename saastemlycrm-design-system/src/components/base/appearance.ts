/**
 * The page's appearance, applied to <html>: theme (light / dark / system), colour scheme and
 * background image, each optionally remembered, and the circular reveal that plays when one
 * changes. Shared by `<ui-appearance>` (src/components/composed/actions/appearance.ts) and
 * index.html's first-paint script (same storage keys).
 */
import { m } from "../../i18n/index.ts";

/** Themes in the order the theme button steps through them. `system` follows the OS (no `data-theme`). */
export const THEMES = ["system", "dark", "light"] as const;
export type ThemeChoice = (typeof THEMES)[number];

/** localStorage keys. `ui-background-src` is read before the first paint (index.html). */
export const STORAGE = {
  theme: "ui-theme",
  scheme: "ui-scheme",
  background: "ui-background",
  backgroundSrc: "ui-background-src",
} as const;

export function remembered(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null; // storage unavailable
  }
}

export function remember(key: string, value: string | null) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* storage unavailable, or the value too big (a large upload): kept for this visit only */
  }
}

/** Apply a theme: `data-theme` on <html> (none for `system`). */
export function applyTheme(theme: string) {
  if (theme === "dark" || theme === "light") document.documentElement.dataset.theme = theme;
  else delete document.documentElement.dataset.theme;
}

/** Apply a colour scheme: `data-scheme` on <html> (none for daisyUI's own, `default`). */
export function applyScheme(id: string) {
  if (id && id !== "default") document.documentElement.dataset.scheme = id;
  else delete document.documentElement.dataset.scheme;
}

/**
 * Live backgrounds: animated effects drawn behind the app instead of a photo (`<ui-waves>`,
 * `<ui-magnet-lines>`); the app shell renders the one chosen (`liveBackground`,
 * src/components/composed/actions/live-background.ts).
 */
export const LIVE_BACKGROUNDS = [
  { id: "live-waves", label: () => m.appearance_background_live_waves() },
  { id: "live-magnet-lines", label: () => m.appearance_background_live_magnet_lines() },
] as const;
export type LiveBackground = (typeof LIVE_BACKGROUNDS)[number]["id"];
export const isLiveBackground = (id: string | null | undefined): id is LiveBackground =>
  LIVE_BACKGROUNDS.some((b) => b.id === id);

/** The live background chosen now (`data-background` on <html>), if any. */
export const liveBackgroundNow = (): LiveBackground | undefined => {
  const id = document.documentElement.dataset.background;
  return isLiveBackground(id) ? id : undefined;
};

/**
 * Show a background behind the app: an image (`src`), a live effect (`live`, `data-background` on
 * <html>), or neither. The app shell paints `--app-background` and renders the live effect.
 */
export function applyBackground(src: string | null, live?: LiveBackground | null) {
  const root = document.documentElement.style;
  if (src) root.setProperty("--app-background", `url("${src}")`);
  else root.removeProperty("--app-background");
  if (live) document.documentElement.dataset.background = live;
  else delete document.documentElement.dataset.background;
  // The app shell re-measures its text contrast against the new image.
  window.dispatchEvent(new Event("ui-background"));
}

/** Whether the page is in dark mode now (its resolved `color-scheme`). */
export const isDark = () => getComputedStyle(document.documentElement).colorScheme.includes("dark");

/** An uploaded image, scaled to at most `max` px on its long side, as a JPEG data URL (fits localStorage). */
export async function shrinkImage(file: File, max = 2048): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * k);
  canvas.height = Math.round(bitmap.height * k);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

let revealing = false;

/**
 * Run `apply` revealed by a circle growing from `from` (a point on screen) until it covers the
 * page — View Transitions; the animation is `::view-transition-new(root)` in src/index.css, on M3's
 * expressive slow spatial spring. While one plays, further changes wait for it. Without View
 * Transitions, or with Reduce motion, `apply` just runs.
 */
export async function reveal(from: { x: number; y: number }, apply: () => void | Promise<void>) {
  if (revealing) return;
  const doc = document as Document & {
    startViewTransition?: (update: () => Promise<void>) => { finished: Promise<void> };
  };
  if (!doc.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
  const { x, y } = from;
  const root = document.documentElement.style;
  root.setProperty("--theme-reveal-x", `${x}px`);
  root.setProperty("--theme-reveal-y", `${y}px`);
  root.setProperty("--theme-reveal-r", `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`);
  revealing = true;
  try {
    await doc.startViewTransition(async () => {
      await apply();
    }).finished;
  } catch {
    /* skipped (e.g. the page changed): the change is applied either way */
  } finally {
    revealing = false;
  }
}
