import preview from "#.storybook/preview";
import { html, render } from "lit";
import { expect, waitFor } from "storybook/test";
import { atBreakpoint, atWidth, floating, place, placementOf, type FloatOptions } from "./floating.ts";

const atViewport = async (px: number, run: () => Promise<void> | void) => {
  const real = window.matchMedia;
  window.matchMedia = ((q: string) => {
    const [, op, rem] = /\(width (<|>=) ([\d.]+)rem\)/.exec(q)!;
    const edge = Number(rem) * 16;
    return { matches: op === "<" ? px < edge : px >= edge } as MediaQueryList;
  }) as typeof window.matchMedia;
  try {
    await run();
  } finally {
    window.matchMedia = real;
  }
};

const box = (root: HTMLElement, style: string) => {
  const el = document.createElement("div");
  el.setAttribute("style", `position:fixed;margin:0;padding:0;border:0;${style}`);
  root.append(el);
  return el;
};

const placed = async (panel: HTMLElement) => {
  await waitFor(() => expect(panel.dataset.placement).toBeTruthy());
  return panel.dataset.placement;
};

const mount = (root: HTMLElement) => {
  const el = document.createElement("div");
  root.append(el);
  return el;
};

const view = (id: string, options?: FloatOptions) =>
  html`<button popovertarget=${id} style="position:fixed;left:50px;top:50px;width:60px;height:20px;padding:0;border:0">
      Menu
    </button>
    <div id=${id} popover style="margin:0;width:40px;height:40px" ${options ? floating(options) : floating()}></div>`;

let demo = 0;

const meta = preview.meta({
  render: () => {
    const id = `floating-demo-${++demo}`;
    return html`<button popovertarget=${id}>Open menu</button>
      <div id=${id} popover ${floating({ placement: "bottom-start" })}>Menu panel</div>`;
  },
});

export const BreakpointsMatchViewport = meta.story({
  name: "atBreakpoint: min and max breakpoints",
  play: async () => {
    await atViewport(800, async () => {
      await expect(atBreakpoint("sm")).toBe(true);
      await expect(atBreakpoint("md")).toBe(true);
      await expect(atBreakpoint("lg")).toBe(false);
      await expect(atBreakpoint("max-lg")).toBe(true);
      await expect(atBreakpoint("max-md")).toBe(false);
      await expect(atBreakpoint("2xl")).toBe(false);
    });
  },
});

export const UnknownBreakpoints = meta.story({
  name: "atBreakpoint: unknown breakpoints are always on",
  play: async () => {
    await atViewport(0, async () => {
      await expect(atBreakpoint("huge")).toBe(true);
      await expect(atBreakpoint("max-huge")).toBe(true);
    });
  },
});

export const RealMediaQueries = meta.story({
  name: "atBreakpoint: real media queries",
  play: async () => {
    await expect(atBreakpoint("sm")).toBe(matchMedia("(width >= 40rem)").matches);
  },
});

export const EmptyWidthValues = meta.story({
  name: "atWidth: empty values",
  play: async () => {
    await expect(atWidth(undefined)).toBeUndefined();
    await expect(atWidth(null)).toBeUndefined();
    await expect(atWidth("")).toBeUndefined();
  },
});

export const WidthOverrides = meta.story({
  name: "atWidth: breakpoints override the plain value",
  play: async () => {
    await atViewport(1100, async () => {
      await expect(atWidth("top")).toBe("top");
      await expect(atWidth(" top bottom ")).toBe("top");
      await expect(atWidth("top md:bottom")).toBe("bottom");
      await expect(atWidth("top md:bottom lg:left")).toBe("left");
      await expect(atWidth("top xl:bottom")).toBe("top");
      await expect(atWidth("top max-md:bottom")).toBe("top");
      await expect(atWidth("sm:right")).toBe("right");
      await expect(atWidth("xl:right")).toBeUndefined();
    });
  },
});

export const UnknownPrefixes = meta.story({
  name: "atWidth: unknown prefixes are ignored",
  play: async () => {
    await atViewport(1100, async () => {
      await expect(atWidth("hover:top left")).toBe("left");
      await expect(atWidth("max-foo:top")).toBeUndefined();
    });
  },
});

export const DefaultPlacement = meta.story({
  name: "placementOf: defaults to bottom-start",
  play: async () => {
    await expect(placementOf()).toBe("bottom-start");
    await expect(placementOf(null, null)).toBe("bottom-start");
  },
});

export const SideAndAlignment = meta.story({
  name: "placementOf: side with alignment",
  play: async () => {
    await expect(placementOf("top", "end")).toBe("top-end");
    await expect(placementOf("left", "center")).toBe("left");
    await expect(placementOf("right", "start")).toBe("right-start");
    await expect(placementOf("bottom", "middle")).toBe("bottom-start");
  },
});

export const PlacementFallbacks = meta.story({
  name: "placementOf: unknown sides and breakpoints",
  play: async () => {
    await atViewport(1100, async () => {
      await expect(placementOf("inside", "end")).toBe("bottom-end");
      await expect(placementOf("top md:left", "start lg:end")).toBe("left-end");
    });
  },
});

export const PlaceBelowAnchor = meta.story({
  name: "place: below the anchor, sized to the room",
  play: async ({ canvasElement }) => {
    const anchor = box(canvasElement, "left:100px;top:100px;width:80px;height:20px");
    const panel = box(canvasElement, "width:50px;height:30px");
    const stop = place(anchor, panel);
    await expect(panel.style.visibility).toBe("hidden");
    try {
      await expect(await placed(panel)).toBe("bottom-start");
      await expect(panel.style.left).toBe("100px");
      await expect(panel.style.top).toBe("124px");
      await expect(panel.style.visibility).toBe("");
      await expect(panel.style.getPropertyValue("--float-origin")).toBe("left top");
      await expect(panel.style.getPropertyValue("--anchor-w")).toBe("80px");
      await expect(panel.style.getPropertyValue("--float-max-h")).toBe(`${innerHeight - 124 - 8}px`);
      await expect(parseFloat(panel.style.getPropertyValue("--float-max-w"))).toBeGreaterThan(0);
    } finally {
      stop();
      anchor.remove();
      panel.remove();
    }
  },
});

export const TransformOrigin = meta.story({
  name: "place: transform origin opposite the side",
  play: async ({ canvasElement }) => {
    const cases: [FloatOptions["placement"], string][] = [
      ["top-start", "left bottom"],
      ["top", "center bottom"],
      ["bottom-end", "right top"],
      ["left-start", "right top"],
      ["left-end", "right bottom"],
      ["right", "left center"],
    ];
    for (const [placement, origin] of cases) {
      const anchor = box(canvasElement, "left:300px;top:300px;width:40px;height:40px");
      const panel = box(canvasElement, "width:20px;height:20px");
      const stop = place(anchor, panel, { placement, gap: 10 });
      try {
        await expect(await placed(panel)).toBe(placement);
        await expect(panel.style.getPropertyValue("--float-origin")).toBe(origin);
      } finally {
        stop();
        anchor.remove();
        panel.remove();
      }
    }
  },
});

export const CustomGap = meta.story({
  name: "place: the given gap",
  play: async ({ canvasElement }) => {
    const anchor = box(canvasElement, "left:300px;top:300px;width:40px;height:40px");
    const panel = box(canvasElement, "width:20px;height:20px");
    const stop = place(anchor, panel, { placement: "top-start", gap: 10 });
    try {
      await placed(panel);
      await expect(panel.style.top).toBe("270px");
    } finally {
      stop();
      anchor.remove();
      panel.remove();
    }
  },
});

export const StopsBeforeLanding = meta.story({
  name: "place: a stopped placement writes nothing",
  play: async ({ canvasElement }) => {
    const anchor = box(canvasElement, "left:300px;top:300px;width:40px;height:40px");
    const panel = box(canvasElement, "width:20px;height:20px");
    place(anchor, panel, { placement: "top-start" })();
    try {
      await new Promise<number>((done) => requestAnimationFrame(done));
      await new Promise<number>((done) => requestAnimationFrame(done));
      await expect(panel.dataset.placement).toBeUndefined();
      await expect(panel.style.left).toBe("");
    } finally {
      anchor.remove();
      panel.remove();
    }
  },
});

export const FlipsToFallback = meta.story({
  name: "place: flips to a fallback without room",
  play: async ({ canvasElement }) => {
    const anchor = box(canvasElement, `left:100px;top:${innerHeight - 30}px;width:40px;height:20px`);
    const panel = box(canvasElement, "width:40px;height:100px");
    const stop = place(anchor, panel, { placement: "bottom-start", fallbacks: ["top-end"] });
    try {
      await expect(await placed(panel)).toBe("top-end");
    } finally {
      stop();
      anchor.remove();
      panel.remove();
    }
  },
});

export const HiddenWhileClipped = meta.story({
  name: "place: hidden while the anchor is clipped",
  play: async ({ canvasElement }) => {
    const clip = box(canvasElement, "left:0;top:0;width:100px;height:50px;overflow:hidden");
    const anchor = document.createElement("div");
    anchor.setAttribute("style", "margin-top:200px;width:20px;height:20px");
    clip.append(anchor);
    const panel = box(canvasElement, "width:20px;height:20px");
    const stop = place(anchor, panel);
    try {
      await placed(panel);
      await expect(panel.style.visibility).toBe("hidden");
    } finally {
      stop();
      clip.remove();
      panel.remove();
    }
  },
});

export const AnchorsToTrigger = meta.story({
  name: "floating: anchors to its popover trigger",
  render: () => view("float-trigger"),
  play: async ({ canvasElement }) => {
    const panel = canvasElement.querySelector<HTMLElement>("[popover]")!;
    await expect(panel.dataset.floating).toBe("");
    panel.showPopover();
    try {
      await expect(await placed(panel)).toBe("bottom-start");
      await expect(panel.style.left).toBe("50px");
      await expect(panel.style.top).toBe("74px");
      await expect(panel.style.visibility).toBe("");
    } finally {
      panel.hidePopover();
    }
  },
});

export const ReopensWithLatestOptions = meta.story({
  name: "floating: latest options on reopen",
  render: () => html`<div data-testid="host"></div>`,
  play: async ({ canvas }) => {
    const root = canvas.getByTestId("host");
    render(view("float-reopen", { placement: "bottom-start" }), root);
    const panel = root.querySelector<HTMLElement>("[popover]")!;
    panel.showPopover();
    await placed(panel);
    panel.hidePopover();
    delete panel.dataset.placement;
    render(view("float-reopen", { placement: "right-start", gap: 0 }), root);
    panel.showPopover();
    try {
      await waitFor(() => expect(panel.dataset.placement).toBe("right-start"));
      await waitFor(() => expect(panel.style.left).toBe("110px"));
    } finally {
      panel.hidePopover();
    }
  },
});

export const HiddenWhileOpening = meta.story({
  name: "floating: hidden while opening",
  render: () => view("float-opening", { anchor: () => null }),
  play: async ({ canvasElement }) => {
    const panel = canvasElement.querySelector<HTMLElement>("[popover]")!;
    const seen: string[] = [];
    panel.addEventListener("beforetoggle", () => seen.push(panel.style.visibility), { capture: false });
    panel.showPopover();
    try {
      await expect(seen).toEqual(["hidden"]);
    } finally {
      panel.hidePopover();
    }
  },
});

export const ExplicitAnchor = meta.story({
  name: "floating: prefers an explicit anchor",
  render: () => html`<div data-testid="host"></div>`,
  play: async ({ canvas, canvasElement }) => {
    const root = canvas.getByTestId("host");
    const other = box(canvasElement, "left:200px;top:200px;width:30px;height:30px");
    render(view("float-explicit", { anchor: () => other }), root);
    const panel = root.querySelector<HTMLElement>("[popover]")!;
    panel.showPopover();
    try {
      await placed(panel);
      await expect(panel.style.left).toBe("200px");
      await expect(panel.style.top).toBe("234px");
    } finally {
      panel.hidePopover();
      other.remove();
    }
  },
});

export const WithoutAnchor = meta.story({
  name: "floating: unplaced without anchor or trigger",
  render: () =>
    html`<div popover ${floating()}></div>
      <div id="float-lonely" popover ${floating()}></div>`,
  play: async ({ canvasElement }) => {
    for (const panel of canvasElement.querySelectorAll<HTMLElement>("[popover]")) {
      panel.showPopover();
      await waitFor(() => expect(panel.style.visibility).toBe(""));
      await expect(panel.dataset.placement).toBeUndefined();
      panel.hidePopover();
    }
  },
});

export const MisplacedDirective = meta.story({
  name: "Error: not on an element",
  play: async ({ canvasElement }) => {
    await expect(() => render(html`<div>${floating()}</div>`, mount(canvasElement))).toThrow(
      "floating() goes on the popover element itself.",
    );
  },
});
