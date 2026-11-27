import "./canvas.ts";
import type { CanvasNear, CanvasView } from "./canvas.ts";
import {
  CHECKPOINTS_MANIFEST,
  CHECKPOINTS_PATH,
  FRAME_PATH,
  HOT_EVENT,
  frameSearch,
  shellRendered,
  type CheckpointManifest,
  type FrameShots,
  type ManifestFrame,
  type Scheme,
  type Tier,
} from "./pages.ts";

const BASE = import.meta.env.BASE_URL;
const VIEW_KEY = "mock-runner:explode-view";
const SHARP_ABOVE = 0.55;
const SOFT_BELOW = 0.45;
const AUTO_LIVE = 8;
const canvas = document.querySelector("explode-canvas")!;

const as = new URLSearchParams(location.search).get("as");
const dark = matchMedia("(prefers-color-scheme: dark)");
const scheme = (): Scheme => (dark.matches ? "dark" : "light");
const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

interface Screen {
  frame: ManifestFrame;
  phone: HTMLDivElement;
  image: HTMLImageElement | null;
  live: Promise<void> | null;
  woken: boolean;
}

const screens = new Map<string, Screen>();
let tier: Tier = "2x";

function phoneOf(width: number, height: number) {
  const phone = document.createElement("div");
  phone.tabIndex = 0;
  phone.setAttribute("role", "group");
  phone.setAttribute("aria-label", `Dashboard at ${width} by ${height}`);
  Object.assign(phone.style, {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: "28px",
    background: "#000",
    boxShadow: "0 0 0 8px #1b1f24, 0 0 0 9px #3a4048, 0 24px 48px rgb(0 0 0 / 0.25)",
  });
  return phone;
}

const shotUrl = (shots: FrameShots, wanted: Tier) => {
  const shot = shots[scheme()][wanted];
  return `${BASE}${CHECKPOINTS_PATH}/${shot.file}?v=${shot.hash}`;
};

async function rendered(frame: HTMLIFrameElement) {
  for (;;) {
    const doc = frame.contentDocument;
    if (doc && doc.URL !== "about:blank" && shellRendered(doc)) return;
    await nextFrame();
  }
}

function goLive(screen: Screen) {
  screen.live ??= (async () => {
    const { frame: f } = screen;
    canvas.mark(f.id, "Loading");
    const frame = document.createElement("iframe");
    frame.src = `${BASE}${FRAME_PATH}/${frameSearch(f.route, f.as ?? as)}`;
    frame.title = `Dashboard at ${f.width} by ${f.height}, signed in`;
    frame.width = String(f.width);
    frame.height = String(f.height);
    Object.assign(frame.style, { display: "block", width: "100%", height: "100%", border: "0", background: "#fff" });
    screen.phone.prepend(frame);
    await rendered(frame);
    screen.image?.remove();
    screen.image = null;
    canvas.mark(f.id, "Live", true);
  })();
  return screen.live;
}

function show(screen: Screen) {
  const { shots } = screen.frame;
  if (screen.live || !shots) return;
  if (!screen.image) {
    const image = document.createElement("img");
    image.alt = `Still of the dashboard at ${screen.frame.width} by ${screen.frame.height}`;
    image.width = screen.frame.width;
    image.height = screen.frame.height;
    image.draggable = false;
    image.decoding = "async";
    Object.assign(image.style, { position: "absolute", inset: "0", display: "block", width: "100%", height: "100%" });
    screen.image = image;
    screen.phone.append(image);
  }
  const src = shotUrl(shots, tier);
  const image = screen.image;
  if (image.dataset.want === src) return;
  image.dataset.want = src;
  if (!image.getAttribute("src")) {
    image.src = src;
    return;
  }
  const next = new Image();
  next.src = src;
  void next
    .decode()
    .catch(() => undefined)
    .then(() => {
      if (image.dataset.want === src) image.src = src;
    });
}

function hide(screen: Screen) {
  screen.image?.remove();
  screen.image = null;
}

const wakeQueue: Screen[] = [];
let waking: Promise<void> | null = null;

function wakeNear() {
  const near = canvas.near.map((id) => screens.get(id)).filter((s): s is Screen => !!s);
  const unlit = near.filter((s) => !s.frame.shots && !s.live);
  const lit = [...screens.values()].filter((s) => s.live && !s.woken).length;
  const room = Math.max(0, AUTO_LIVE - lit - wakeQueue.length);
  const { x: vx, y: vy, zoom } = canvas.view;
  const cx = canvas.clientWidth / 2;
  const cy = canvas.clientHeight / 2;
  const distance = (s: Screen) =>
    Math.hypot(vx + (s.frame.x + s.frame.width / 2) * zoom - cx, vy + (s.frame.y + s.frame.height / 2) * zoom - cy);
  for (const screen of unlit.sort((a, b) => distance(a) - distance(b)).slice(0, room)) {
    if (wakeQueue.includes(screen)) continue;
    canvas.mark(screen.frame.id, "Queued");
    wakeQueue.push(screen);
  }
  waking ??= (async () => {
    for (let next = wakeQueue.shift(); next; next = wakeQueue.shift()) await goLive(next);
    waking = null;
  })();
}

function place(frame: ManifestFrame) {
  const phone = phoneOf(frame.width, frame.height);
  const screen: Screen = { frame, phone, image: null, live: null, woken: false };
  const wake = () => {
    screen.woken = true;
    void goLive(screen);
  };
  phone.addEventListener("pointermove", (e) => {
    if (e.movementX || e.movementY) wake();
  });
  phone.addEventListener("focusin", wake);
  screens.set(frame.id, screen);
  canvas.add({
    id: frame.id,
    x: frame.x,
    y: frame.y,
    width: frame.width,
    height: frame.height,
    label: frame.label,
    content: phone,
  });
}

function apply(found: CheckpointManifest) {
  const ids = new Set(found.frames.map((f) => f.id));
  for (const [id] of screens) {
    if (ids.has(id)) continue;
    canvas.removeItem(id);
    screens.delete(id);
  }
  for (const frame of found.frames) {
    const screen = screens.get(frame.id);
    const moved =
      screen &&
      (screen.frame.x !== frame.x ||
        screen.frame.y !== frame.y ||
        screen.frame.width !== frame.width ||
        screen.frame.height !== frame.height ||
        screen.frame.route !== frame.route);
    if (!screen || moved) {
      if (screen) canvas.removeItem(frame.id);
      place(frame);
      continue;
    }
    screen.frame = frame;
  }
  const near = new Set(canvas.near);
  for (const [id, screen] of screens) if (near.has(id)) show(screen);
  wakeNear();
}

async function manifest(): Promise<CheckpointManifest | null> {
  const response = await fetch(`${BASE}${CHECKPOINTS_MANIFEST}`, { cache: "no-cache" }).catch(() => null);
  if (!response?.ok || !response.headers.get("content-type")?.includes("json")) return null;
  return (await response.json().catch(() => null)) as CheckpointManifest | null;
}

function saved(): CanvasView | null {
  try {
    const text = sessionStorage.getItem(VIEW_KEY);
    sessionStorage.removeItem(VIEW_KEY);
    return text ? (JSON.parse(text) as CanvasView) : null;
  } catch {
    return null;
  }
}

const tierFor = (zoom: number): Tier => (zoom > SHARP_ABOVE ? "2x" : zoom < SOFT_BELOW ? "1x" : tier);

canvas.addEventListener("canvas-near", (e) => {
  const { entered, left } = (e as CustomEvent<CanvasNear>).detail;
  for (const id of left) {
    const screen = screens.get(id);
    if (screen) hide(screen);
  }
  for (const id of entered) {
    const screen = screens.get(id);
    if (screen) show(screen);
  }
  if (entered.length) wakeNear();
});

canvas.addEventListener("canvas-view", (e) => {
  const { zoom } = (e as CustomEvent<CanvasView>).detail;
  const next = tierFor(zoom);
  if (next === tier) return;
  tier = next;
  for (const id of canvas.near) {
    const screen = screens.get(id);
    if (screen?.image) show(screen);
  }
});

dark.addEventListener("change", () => {
  for (const screen of screens.values()) if (screen.image) show(screen);
});

import.meta.hot?.on("vite:beforeFullReload", () => {
  try {
    sessionStorage.setItem(VIEW_KEY, JSON.stringify(canvas.view));
  } catch {
    return;
  }
});

import.meta.hot?.on(HOT_EVENT, () => {
  void manifest().then((found) => found && apply(found));
});

const view = saved();
if (view) canvas.show(view);
const found = await manifest();
if (found) apply(found);
if (!view && canvas.clientWidth && canvas.clientHeight) canvas.fit(true);
