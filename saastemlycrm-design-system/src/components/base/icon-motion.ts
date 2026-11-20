/**
 * Paces animated icons (line-md's SMIL `<animate>`s). An inline SVG's animations start the moment it
 * is inserted, and SMIL runs on the main thread: a page with dozens of icons started dozens of
 * animations in the frame it appeared, and the frame rate dropped just as the page came in.
 *
 * Instead every animated icon is held at its first moment (`pauseAnimations()` on insertion, before
 * it is painted) and queued once it is in view (an IntersectionObserver: an icon off screen or in a
 * closed menu waits until it shows). A frame-paced consumer starts them a few at a time:
 *
 * - on a frame that came on time it starts the oldest `START_PER_FRAME` waiting icons;
 * - on a late frame (one was dropped) it starts none, and every icon that has waited longer than
 *   `MAX_WAIT_MS` skips its animation: it jumps to its finished drawing (`setCurrentTime`), so the
 *   queue gets back on schedule while the rest still animate once frames are on time again;
 * - with Reduce motion, every icon shows its finished drawing at once.
 *
 * The decision per frame is `pace`, a pure function proved over every case of a finite domain by
 * tests/icon-motion.test.ts. The consumer is paced by animation frames, never by timers.
 */

/** A frame no later than this (ms since the previous one) is on schedule: 1.5 frames at 60 Hz. */
export const ON_TIME_MS = 25;
/** Icons started per on-time frame. */
export const START_PER_FRAME = 2;
/** An icon that has waited this long (ms) while frames run late skips its animation. */
export const MAX_WAIT_MS = 400;

/** What one frame does with the waiting icons (indexes into `waited`, oldest first). */
export interface Pace {
  start: number[];
  skip: number[];
}

/**
 * This frame's decision: `frameMs` since the previous frame, `waited` how long (ms) each waiting
 * icon has waited, oldest first. On time: start the first `START_PER_FRAME`. Late: start none, skip
 * every one that has waited `MAX_WAIT_MS` or more.
 */
export function pace(frameMs: number, waited: readonly number[]): Pace {
  if (frameMs <= ON_TIME_MS) return { start: waited.slice(0, START_PER_FRAME).map((_, i) => i), skip: [] };
  return { start: [], skip: waited.flatMap((w, i) => (w >= MAX_WAIT_MS ? [i] : [])) };
}

/** Far past any line-md animation's end: seeking there shows the finished drawing (`fill="freeze"`). */
const FINISHED_S = 3600;

interface Waiting {
  svg: SVGSVGElement;
  since: number;
}

const held = new WeakSet<SVGSVGElement>();
const waiting: Waiting[] = [];
let lastFrame = 0;
let running = false;
let seen: IntersectionObserver | undefined;

const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

function finish(svg: SVGSVGElement) {
  svg.setCurrentTime(FINISHED_S);
  svg.unpauseAnimations();
}

function frame(now: number) {
  const frameMs = lastFrame ? now - lastFrame : 0;
  lastFrame = now;
  // Gone from the page while waiting: nothing to do for it.
  for (let i = waiting.length - 1; i >= 0; i--) if (!waiting[i]!.svg.isConnected) waiting.splice(i, 1);
  const { start, skip } = pace(
    frameMs,
    waiting.map((w) => now - w.since),
  );
  for (const i of start) waiting[i]!.svg.unpauseAnimations();
  for (const i of skip) finish(waiting[i]!.svg);
  const done = new Set([...start, ...skip]);
  for (let i = waiting.length - 1; i >= 0; i--) if (done.has(i)) waiting.splice(i, 1);
  if (waiting.length) requestAnimationFrame(frame);
  else {
    running = false;
    lastFrame = 0;
  }
}

function enqueue(svg: SVGSVGElement) {
  if (reduced()) return finish(svg);
  waiting.push({ svg, since: performance.now() });
  if (!running) {
    running = true;
    requestAnimationFrame(frame);
  }
}

/**
 * Hold an animated icon at its first moment and queue it once it is in view. For `iconSvg`'s ref:
 * called with the `<svg>` as it is committed (before it is painted); each copy is held once.
 */
export function holdIcon(el: Element | undefined): void {
  if (!(el instanceof SVGSVGElement) || held.has(el)) return;
  held.add(el);
  el.pauseAnimations();
  el.setCurrentTime(0);
  seen ??= new IntersectionObserver((entries) => {
    for (const e of entries)
      if (e.isIntersecting) {
        seen!.unobserve(e.target);
        enqueue(e.target as SVGSVGElement);
      }
  });
  seen.observe(el);
}
