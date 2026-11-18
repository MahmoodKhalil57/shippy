import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LightElement } from "../../components/base/light-element.ts";
import "../../components/index.ts";
import { StoreController, endTour, tour } from "../../stores/index.ts";
import { seedUsers } from "./demo-users.ts";
import { roleLabel } from "./demo-users.ts";
import { navigate } from "./shared.ts";
import { TOURS, type TourStep, type TourTarget } from "./tours.ts";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** An element's first box (component hosts are `display: contents`). */
const boxOf = (el: Element): Element | null => {
  let e: Element | null = el;
  while (e && getComputedStyle(e).display === "contents") e = e.firstElementChild;
  return e;
};
const visible = (el: Element) => {
  const r = boxOf(el)?.getBoundingClientRect();
  return !!r && r.width > 0 && r.height > 0;
};

/** The smallest visible element matching the target (so a card wins over the page around it). */
function find(t: TourTarget): Element | null {
  const matches = [...document.querySelectorAll(t.sel ?? "ui-card")].filter(
    (e) => !e.closest("ui-coachmark") && (e.textContent ?? "").includes(t.text) && visible(e),
  );
  return matches.sort((a, b) => (a.textContent ?? "").length - (b.textContent ?? "").length)[0] ?? null;
}

/** Waits until `get` returns something (or gives up after `ms`). */
async function waitFor<T>(get: () => T | null, ms = 9000): Promise<T | null> {
  const end = performance.now() + ms;
  for (;;) {
    const v = get();
    if (v || performance.now() > end) return v;
    await sleep(100);
  }
}

/**
 * Plays the running guided tour (the `tour` store): for each step it signs in as the step's user,
 * goes to its page, opens a side column or clicks a button if asked, then spotlights the target
 * with `<ui-coachmark>`. The dashboard gives it `switchTo` (sign in as a seeded user) and
 * `openPanel` (open a side column).
 */
@customElement("dashboard-tour")
export class DashboardTour extends LightElement {
  @property({ attribute: false }) userId = "";
  @property({ attribute: false }) switchTo: (id: string) => Promise<void> = async () => {};
  @property({ attribute: false }) openPanel: (panel: "aside" | "nav") => Promise<void> = async () => {};
  @state() private target: Element | null = null;
  @state() private busy = false;
  #tour = new StoreController(this, tour);
  /** Bumped per step, so a slow step that's been skipped doesn't spotlight anything. */
  #run = 0;
  #shown = "";

  protected updated() {
    const { active, step } = this.#tour.value;
    const key = active == null ? "" : `${active}:${step}`;
    if (key !== this.#shown) {
      this.#shown = key;
      if (active != null) void this._play(step);
      else this.target = null;
    }
  }

  private get _tour() {
    return TOURS.find((t) => t.id === this.#tour.value.active);
  }

  private async _play(index: number) {
    const step = this._tour?.steps[index];
    if (!step) return;
    const run = ++this.#run;
    this.busy = true;
    this.target = null;
    try {
      await this._prepare(step);
      const target = step.target ? await waitFor(() => find(step.target!)) : null;
      if (run !== this.#run) return;
      boxOf(target ?? document.body)?.scrollIntoView({ block: "center", behavior: "smooth" });
      // Let the smooth scroll settle before the spotlight measures it.
      await sleep(target ? 350 : 0);
      if (run !== this.#run) return;
      this.target = target;
    } finally {
      if (run === this.#run) this.busy = false;
    }
  }

  private async _prepare(step: TourStep) {
    if (step.as && step.as !== this.userId) await this.switchTo(step.as);
    if (step.go && location.pathname !== step.go) navigate(step.go);
    if (step.open) await this.openPanel(step.open);
    if (step.click) {
      const button = await waitFor(
        () =>
          [...document.querySelectorAll("button, a")].find(
            (b) => !b.closest("ui-coachmark") && (b.textContent ?? "").includes(step.click!) && visible(b),
          ) ?? null,
      );
      (button as HTMLElement | null)?.click();
      await sleep(step.wait ?? 900);
    }
  }

  private _go(delta: number) {
    const t = this._tour;
    if (!t) return;
    const step = Math.min(t.steps.length - 1, Math.max(0, this.#tour.value.step + delta));
    tour.set({ step });
  }

  render() {
    const t = this._tour;
    const { step } = this.#tour.value;
    const s = t?.steps[step];
    if (!t || !s) return nothing;
    const who = seedUsers.find((u) => u.id === this.userId);
    return html`<ui-coachmark
      open
      .target=${this.target}
      .eyebrow=${`${t.title}${who ? ` · signed in as ${who.name ?? who.email} (${roleLabel(who.role)})` : ""}`}
      .heading=${s.title}
      .step=${step + 1}
      .total=${t.steps.length}
      .busy=${this.busy}
      @ui-next=${() => this._go(1)}
      @ui-back=${() => this._go(-1)}
      @ui-close=${() => endTour()}
      @ui-finish=${() => endTour(true)}
      >${s.body}</ui-coachmark
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-tour": DashboardTour;
  }
}
