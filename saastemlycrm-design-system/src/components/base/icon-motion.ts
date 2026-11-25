export const ON_TIME_MS = 25;
export const START_PER_FRAME = 2;
export const MAX_WAIT_MS = 400;

export interface Pace {
  start: number[];
  skip: number[];
}

export function pace(frameMs: number, waited: readonly number[]): Pace {
  if (frameMs <= ON_TIME_MS) return { start: waited.slice(0, START_PER_FRAME).map((_, i) => i), skip: [] };
  return { start: [], skip: waited.flatMap((w, i) => (w >= MAX_WAIT_MS ? [i] : [])) };
}

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
