import { m } from "../i18n/index.ts";

export const THEMES = ["system", "dark", "light"] as const;
export type ThemeChoice = (typeof THEMES)[number];

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
    return null;
  }
}

export function remember(key: string, value: string | null) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
}

export function applyTheme(theme: string) {
  if (theme === "dark" || theme === "light") document.documentElement.dataset.theme = theme;
  else delete document.documentElement.dataset.theme;
}

export function applyScheme(id: string) {
  if (id && id !== "default") document.documentElement.dataset.scheme = id;
  else delete document.documentElement.dataset.scheme;
}

export const LIVE_BACKGROUNDS = [
  { id: "live-waves", label: () => m.appearance_background_live_waves() },
  { id: "live-magnet-lines", label: () => m.appearance_background_live_magnet_lines() },
] as const;
export type LiveBackground = (typeof LIVE_BACKGROUNDS)[number]["id"];
export const isLiveBackground = (id: string | null | undefined): id is LiveBackground =>
  LIVE_BACKGROUNDS.some((b) => b.id === id);

export const liveBackgroundNow = (): LiveBackground | undefined => {
  const id = document.documentElement.dataset.background;
  return isLiveBackground(id) ? id : undefined;
};

export function applyBackground(src: string | null, live?: LiveBackground | null) {
  const root = document.documentElement.style;
  if (src) root.setProperty("--app-background", `url("${src}")`);
  else root.removeProperty("--app-background");
  if (live) document.documentElement.dataset.background = live;
  else delete document.documentElement.dataset.background;
  window.dispatchEvent(new Event("ui-background"));
}

export const isDark = () => getComputedStyle(document.documentElement).colorScheme.includes("dark");

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
  } finally {
    revealing = false;
  }
}
