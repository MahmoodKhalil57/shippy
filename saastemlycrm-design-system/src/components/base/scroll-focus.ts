import { nothing } from "lit";
import { AsyncDirective, directive, PartType, type ElementPart, type PartInfo } from "lit/async-directive.js";

export interface ScrollFocusOptions {
  /** Accessible name the region gets while it scrolls; with it the region is also a `region` landmark unless it has a role. */
  label?: string;
}

const scrolls = (overflow: string) => overflow === "auto" || overflow === "scroll";

/** True when the element is a scroll container whose content overflows it. */
export function overflows(el: HTMLElement): boolean {
  const style = getComputedStyle(el);
  return (
    (scrolls(style.overflowY) && el.scrollHeight > el.clientHeight + 1) ||
    (scrolls(style.overflowX) && el.scrollWidth > el.clientWidth + 1)
  );
}

/**
 * Makes a scroll container keyboard-focusable (tabindex=0, and a named region when given a label)
 * only while its content actually overflows, so keyboard users can scroll it.
 */
class ScrollFocusDirective extends AsyncDirective {
  #el?: HTMLElement;
  #label?: string;
  #ownRole = false;
  #resize?: ResizeObserver;
  #mutate?: MutationObserver;

  constructor(part: PartInfo) {
    super(part);
    if (part.type !== PartType.ELEMENT) throw new Error("scrollFocus() goes on the scroll container itself.");
  }

  render(_options?: ScrollFocusOptions) {
    return nothing;
  }

  override update(part: ElementPart, [options]: [ScrollFocusOptions?]) {
    const el = part.element as HTMLElement;
    this.#label = options?.label;
    if (el !== this.#el) {
      this.#stop();
      this.#el = el;
      this.#start();
    }
    this.#check();
    return this.render(options);
  }

  #start() {
    const el = this.#el!;
    const resize = new ResizeObserver(() => this.#check());
    const watchChildren = () => {
      for (const child of el.children) resize.observe(child);
    };
    this.#resize = resize;
    this.#mutate = new MutationObserver(() => {
      watchChildren();
      this.#check();
    });
    resize.observe(el);
    watchChildren();
    this.#mutate.observe(el, { childList: true, subtree: true, characterData: true });
  }

  #stop() {
    this.#resize?.disconnect();
    this.#mutate?.disconnect();
    this.#resize = undefined;
    this.#mutate = undefined;
  }

  #check() {
    const el = this.#el!;
    if (!el.isConnected) return;
    const on = overflows(el);
    const set = (name: string, value: string | undefined) => {
      if (value === undefined) {
        if (el.hasAttribute(name)) el.removeAttribute(name);
      } else if (el.getAttribute(name) !== value) el.setAttribute(name, value);
    };
    set("tabindex", on ? "0" : undefined);
    if (this.#label !== undefined) {
      set("aria-label", on && this.#label ? this.#label : undefined);
      if (on && this.#label && !el.hasAttribute("role")) {
        el.setAttribute("role", "region");
        this.#ownRole = true;
      } else if (this.#ownRole && !(on && this.#label)) {
        el.removeAttribute("role");
        this.#ownRole = false;
      }
    }
  }

  protected override disconnected() {
    this.#stop();
  }

  protected override reconnected() {
    this.#start();
    this.#check();
  }
}

export const scrollFocus = directive(ScrollFocusDirective);
