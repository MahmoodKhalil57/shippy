import { frames, SCREENS } from "saastemlycrm-design-system/src/lib/dashboard/tiling.ts";
import { page } from "vite-plus/test/browser";
import { describe, expect, it } from "vite-plus/test";
import { people, personNamed, seeds } from "../project.ts";
import type { TourDoc } from "../tours/compile.ts";
import { currentPath, inPageBackend, signInAs, type Backend, type Direction } from "./visit.ts";

const PATIENCE_MS = 15_000;
const DESKTOP = SCREENS[4]!;

interface Player extends HTMLElement {
  busy: boolean;
  target: Element | null;
}

async function settledStop(wanted: boolean): Promise<Player | null> {
  const until = performance.now() + PATIENCE_MS;
  let still = 0;
  while (performance.now() < until) {
    await frames(1);
    const player = document.querySelector<Player>("dashboard-tour");
    const done = !!player && !player.busy && (!wanted || !!player.target);
    still = done ? still + 1 : 0;
    if (still >= 3) return player;
  }
  return null;
}

export async function walk(backend: Backend, tour: TourDoc, dir: Direction): Promise<string[]> {
  backend.store.restore();
  await page.viewport(DESKTOP.width, DESKTOP.height);
  const lang = dir === "rtl" ? "ar" : "en";
  const first = tour.steps.find((s) => s.as)?.as;
  const dashboard = await signInAs(first ? personNamed(first) : people()[0]!, dir);
  const found: string[] = [];
  for (const [i, stop] of tour.steps.entries()) {
    dashboard.stores.tour.set({ active: tour.id, step: i });
    const player = await settledStop(!!stop.target);
    const where = `${tour.id} stop ${i + 1} "${stop.title[lang]}"`;
    if (!player) {
      found.push(
        stop.target
          ? `${where}: the tour never found "${stop.target.text[lang]}" at ${currentPath()}`
          : `${where}: the tour never finished getting ready`,
      );
      continue;
    }
    const heading = player.querySelector("ui-coachmark")?.textContent ?? "";
    if (!heading.includes(stop.title[lang])) found.push(`${where}: the tour shows another title`);
  }
  dashboard.stores.tour.set({ active: null, step: 0 });
  return found;
}

export function everyTour(dir: Direction) {
  const tours = (seeds.collections.tours ?? []) as unknown as TourDoc[];
  const backend = inPageBackend();
  describe(`Tours, ${dir}`, () => {
    it.each(tours.map((t) => [t.title.en, t] as const))(
      "%s points at something real at every stop",
      async (_, tour) => {
        const found = await walk(await backend, tour, dir);
        expect(found.length, [`${found.length} problems:`, ...found].join("\n")).toBe(0);
      },
      600_000,
    );
  });
}
