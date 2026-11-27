export const EXPLODE_PATH = "explode";
export const FRAME_PATH = "explode/frame";
export const CHECKPOINTS_PATH = "explode/checkpoints";
export const CHECKPOINTS_MANIFEST = "explode/checkpoints.json";
export const SVG_FILE = "explode.svg";
export const EMBEDDED_SVG_FILE = "explode.embedded.svg";
export const HOT_EVENT = "mock-runner:explode";
export const OPAQUE = "opaque";
export const BLANK_ROUTE = `/${FRAME_PATH}`;
export const SIZES = [
  { width: 320, height: 640 },
  { width: 423, height: 640 },
  { width: 424, height: 640 },
  { width: 635, height: 640 },
  { width: 636, height: 640 },
  { width: 741, height: 640 },
  { width: 742, height: 640 },
];
export const FRAME_GAP = 80;
export const ROW_GAP = 120;
export const LABEL_SPACE = 40;
export const SCHEMES = ["light", "dark"] as const;
export const TIERS = ["2x", "1x"] as const;
export type Scheme = (typeof SCHEMES)[number];
export type Tier = (typeof TIERS)[number];

export interface ExplodeFrame {
  id: string;
  route: string;
  width: number;
  height: number;
  as?: string;
}

export interface PlacedFrame extends ExplodeFrame {
  x: number;
  y: number;
  label: string;
}

export interface CheckpointShot {
  file: string;
  hash: string;
  bytes: number;
}

export type FrameShots = Record<Scheme, Record<Tier, CheckpointShot>>;

export interface ManifestFrame extends PlacedFrame {
  shots?: FrameShots;
  renders?: Partial<Record<Scheme, string>>;
}

export interface CheckpointManifest {
  builtAt: string;
  source: string;
  deviceScaleFactor: number;
  width: number;
  height: number;
  frames: ManifestFrame[];
}

const slugOf = (route: string) =>
  route
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase() || "home";

export function framesOf(routes: string[], sizes = SIZES, as?: string): ExplodeFrame[] {
  return routes.flatMap((route) =>
    sizes.map(({ width, height }) => ({
      id: route === BLANK_ROUTE ? `${width}x${height}` : `${slugOf(route)}-${width}x${height}`,
      route,
      width,
      height,
      ...(as ? { as } : {}),
    })),
  );
}

export const defaultFrames = () => framesOf([BLANK_ROUTE]);

export function labelOf(frame: ExplodeFrame) {
  const size = `${frame.width} × ${frame.height}`;
  const where = frame.route === BLANK_ROUTE ? "" : `${frame.route} · `;
  return `${where}${size}${frame.as ? ` · ${frame.as}` : ""}`;
}

export function layout(frames: ExplodeFrame[], gap = FRAME_GAP, rowGap = ROW_GAP): PlacedFrame[] {
  const rows = new Map<string, ExplodeFrame[]>();
  for (const frame of frames) {
    const key = `${frame.route}\n${frame.as ?? ""}`;
    rows.set(key, [...(rows.get(key) ?? []), frame]);
  }
  const placed: PlacedFrame[] = [];
  let y = 0;
  for (const row of rows.values()) {
    let x = 0;
    for (const frame of row) {
      placed.push({ ...frame, x, y, label: labelOf(frame) });
      x += frame.width + gap;
    }
    y += Math.max(...row.map((f) => f.height)) + LABEL_SPACE + rowGap;
  }
  return placed;
}

export function boundsOf(frames: PlacedFrame[]) {
  if (!frames.length) return { width: 0, height: 0 };
  return {
    width: Math.max(...frames.map((f) => f.x + f.width)),
    height: Math.max(...frames.map((f) => f.y + f.height)),
  };
}

export function frameSearch(route: string, as?: string | null) {
  const params = new URLSearchParams();
  if (route !== BLANK_ROUTE) params.set("route", route);
  if (as) params.set("as", as);
  const search = params.toString();
  return search ? `?${search}` : "";
}

export function shellRendered(doc: Document = document) {
  return (
    !!doc.querySelector("ui-app-shell header") &&
    !!doc.querySelector("ui-app-shell nav") &&
    !doc.querySelector("ui-frame[settling]")
  );
}

export function shellSettled(doc: Document = document) {
  return (
    !!doc.querySelector("ui-app-shell header") &&
    !!doc.querySelector("ui-app-shell nav") &&
    !doc.querySelector("ui-frame[settling]") &&
    !doc.querySelector("[aria-busy='true'], ui-loading, ui-skeleton")
  );
}

declare global {
  interface Window {
    explode?: {
      ready: Promise<void>;
      route(): string;
      go(route: string): Promise<void>;
      settle(): Promise<true>;
      shot(route: string): Promise<string>;
    };
  }
}

export async function renderKey(): Promise<string | null> {
  const parts: string[] = [];
  let opaque = false;
  const active = document.activeElement;
  const REFS =
    /^(id|for|form|list|headers|popovertarget|anchor|aria-(controls|labelledby|describedby|owns|activedescendant|details|errormessage|flowto))$/;
  const sheet = (s: CSSStyleSheet) => {
    try {
      return [...s.cssRules].map((r) => r.cssText).join("");
    } catch {
      return s.href ?? "";
    }
  };
  const walk = (node: Node) => {
    if (node instanceof Text) {
      parts.push(`"${node.data}`);
      return;
    }
    if (node instanceof Element) {
      parts.push(`<${node.tagName}`);
      if (node.matches("canvas, video, iframe, object, embed")) {
        const box = node.getBoundingClientRect();
        if (box.width > 0 && box.height > 0) opaque = true;
      }
      for (const a of node.attributes) {
        const value = (
          REFS.test(a.name) || (a.value.startsWith("#") && a.name.endsWith("href"))
            ? a.value.replace(/\d+/g, "#")
            : a.name === "style"
              ? a.value.replace(/(--[a-z][\w-]*?-)\d+/gi, "$1#").replace(/margin-top:\s*0(\.001)?px;?\s*/g, "")
              : a.value
        ).replace(/url\(#[^)]*\)/g, (ref) => ref.replace(/\d+/g, "#"));
        parts.push(` ${a.name}=${value}`);
      }
      if (node instanceof HTMLInputElement) parts.push(` .value=${node.value} .checked=${node.checked}`);
      if (node instanceof HTMLTextAreaElement || node instanceof HTMLSelectElement) parts.push(` .value=${node.value}`);
      if (node instanceof HTMLImageElement) parts.push(` .src=${node.currentSrc} .ok=${node.complete}`);
      if (node instanceof HTMLStyleElement && node.sheet) parts.push(` .css=${sheet(node.sheet)}`);
      if (node instanceof HTMLLinkElement && node.sheet) parts.push(` .css=${sheet(node.sheet)}`);
      if (node.scrollTop || node.scrollLeft) parts.push(` .scroll=${node.scrollTop},${node.scrollLeft}`);
      if (node === active) parts.push(" .focus");
      const root = node.shadowRoot;
      if (root) {
        parts.push(" #shadow");
        for (const s of root.adoptedStyleSheets) parts.push(sheet(s));
        for (const child of root.childNodes) walk(child);
      }
      parts.push(">");
    }
    for (const child of node.childNodes) walk(child);
  };
  for (const s of document.adoptedStyleSheets) parts.push(sheet(s));
  walk(document.documentElement);
  parts.push(`|${[...document.fonts].map((f) => `${f.family}:${f.weight}:${f.style}:${f.status}`).join(",")}`);
  parts.push(`|${innerWidth}x${innerHeight}@${devicePixelRatio}|${matchMedia("(prefers-color-scheme: dark)").matches}`);
  if (opaque) return null;
  const text = parts
    .join("")
    .replaceAll(location.origin, "")
    .replace(/([?&])t=\d+&?/g, "$1")
    .replace(/blob:[^\s"')]+/g, "blob:");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}
