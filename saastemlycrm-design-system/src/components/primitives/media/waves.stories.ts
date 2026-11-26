import preview from "#.storybook/preview";
import { html, type TemplateResult } from "lit";
import { expect, spyOn, waitFor } from "storybook/test";
import "./waves.ts";
import type { UiWaves } from "./waves.ts";
import "../forms/choice-tile.ts";
import "../layout/grid.ts";
import "../layout/box.ts";
import "../containers/card.ts";

const panes = (...tiles: [label: string, waves: TemplateResult][]) =>
  html`<ui-grid fit="md" gap="4">
    ${tiles.map(([label, waves]) => html`<ui-choice-tile label=${label}>${waves}</ui-choice-tile>`)}
  </ui-grid>`;

const canvasOf = (el: HTMLElement) => el.querySelector<HTMLCanvasElement>("ui-waves canvas")!;

const meta = preview.meta({
  title: "Primitives/Media/Waves",
  component: "ui-waves",
  args: {
    lineColor: "currentColor",
    accentColor: "",
    backgroundColor: "transparent",
    lineStyle: "solid",
    spacing: 10,
    lineWidth: 1,
    rotation: 0,
    amplitude: 32,
    scale: 1,
    twist: 1,
    speed: 1,
    variation: 0,
    mouseInteraction: true,
    mouseRadius: 175,
    mouseStrength: 1,
    bounce: 0.5,
    returnDuration: 1.4,
    clickRipple: true,
    intro: true,
    fade: 0,
    opacity: 1,
    lightMode: false,
    paused: false,
    dpr: 1,
  },
  argTypes: {
    lineColor: { control: "color" },
    accentColor: { control: "color" },
    backgroundColor: { control: "color" },
    lineStyle: { control: "inline-radio", options: ["solid", "dashed"] },
    spacing: { control: { type: "number", min: 2, max: 60, step: 1 } },
    lineWidth: { control: { type: "number", min: 0.25, max: 8, step: 0.25 } },
    rotation: { control: { type: "range", min: 0, max: 360, step: 1 } },
    amplitude: { control: { type: "range", min: 0, max: 128, step: 1 } },
    scale: { control: { type: "range", min: 0.05, max: 4, step: 0.05 } },
    twist: { control: { type: "range", min: 0, max: 4, step: 0.1 } },
    speed: { control: { type: "range", min: 0, max: 4, step: 0.1 } },
    variation: { control: { type: "number", min: 0, max: 20, step: 1 } },
    mouseRadius: { control: { type: "number", min: 20, max: 600, step: 5 } },
    mouseStrength: { control: { type: "range", min: 0, max: 4, step: 0.1 } },
    bounce: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    returnDuration: { control: { type: "range", min: 0.2, max: 6, step: 0.1 } },
    fade: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    dpr: { control: { type: "number", min: 1, max: 2, step: 0.5 } },
  },
  render: (args) =>
    html`<ui-card
      ><ui-box height="64"></ui-box
      ><ui-waves
        line-color=${args.lineColor}
        accent-color=${args.accentColor}
        background-color=${args.backgroundColor}
        line-style=${args.lineStyle}
        spacing=${args.spacing}
        line-width=${args.lineWidth}
        rotation=${args.rotation}
        amplitude=${args.amplitude}
        scale=${args.scale}
        twist=${args.twist}
        speed=${args.speed}
        variation=${args.variation}
        mouse-interaction=${String(args.mouseInteraction)}
        mouse-radius=${args.mouseRadius}
        mouse-strength=${args.mouseStrength}
        bounce=${args.bounce}
        return-duration=${args.returnDuration}
        click-ripple=${String(args.clickRipple)}
        intro=${String(args.intro)}
        fade=${args.fade}
        opacity=${args.opacity}
        ?light-mode=${args.lightMode}
        ?paused=${args.paused}
        dpr=${args.dpr}
      ></ui-waves
    ></ui-card>`,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the waves, which fill the card they sit in." } },
    canvas: "column",
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement);
    await expect(canvas).toHaveAttribute("aria-hidden", "true");
    const box = canvas.parentElement!;
    await waitFor(() => expect(canvas.width).toBe(Math.max(1, Math.round(box.clientWidth))));
    await expect(canvas.height).toBe(Math.max(1, Math.round(box.clientHeight)));
  },
});

export const OwnBackground = meta.story({
  name: "Own background",
  args: { lineColor: "#ffffff", backgroundColor: "#1f2a44", accentColor: "#7dd3fc" },
  parameters: { canvas: "column" },
  play: async ({ canvasElement }) => {
    const box = canvasOf(canvasElement).parentElement!;
    await expect(getComputedStyle(box).backgroundColor).toBe("rgb(31, 42, 68)");
  },
});

export const SharpOnDenseScreens = meta.story({
  name: "Sharp on dense screens",
  args: { dpr: 2 },
  parameters: { canvas: "column" },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement);
    const box = canvas.parentElement!;
    await waitFor(() => expect(canvas.width).toBe(Math.max(1, Math.round(box.clientWidth * 2))));
  },
});

export const Lines = meta.story({
  name: "Lines",
  parameters: {
    docs: { description: { story: "Waves fill the nearest positioned box; here each one sits in a preview tile." } },
    canvas: "column",
  },
  render: () =>
    panes(
      ["Solid", html`<ui-waves line-color="currentColor"></ui-waves>`],
      [
        "Dashed, wide and thick",
        html`<ui-waves line-color="currentColor" line-style="dashed" spacing="20" line-width="2"></ui-waves>`,
      ],
    ),
});

export const Motion = meta.story({
  name: "Motion",
  parameters: {
    docs: {
      description: {
        story: "Amplitude, twist and speed shape the flow; variation picks a different but repeatable pattern.",
      },
    },
    canvas: "column",
  },
  render: () =>
    panes(
      ["Still until touched", html`<ui-waves line-color="currentColor" amplitude="0" twist="0" speed="0"></ui-waves>`],
      ["Lively", html`<ui-waves line-color="currentColor" amplitude="64" twist="2" speed="2"></ui-waves>`],
      ["Variation 3", html`<ui-waves line-color="currentColor" variation="3"></ui-waves>`],
    ),
});

export const RotationAndScale = meta.story({
  name: "Rotation and scale",
  parameters: { canvas: "column" },
  render: () =>
    panes(
      ["Rotated 90°, scale 0.4", html`<ui-waves line-color="currentColor" rotation="90" scale="0.4"></ui-waves>`],
      ["Rotated 45°, scale 2", html`<ui-waves line-color="currentColor" rotation="45" scale="2"></ui-waves>`],
    ),
});

export const ColourAndFade = meta.story({
  name: "Colour and fade",
  parameters: {
    docs: { description: { story: "The accent colour heats the lines around the pointer." } },
    canvas: "column",
  },
  render: () =>
    panes(
      ["Accent near the pointer", html`<ui-waves line-color="currentColor" accent-color="#e0592a"></ui-waves>`],
      [
        "Own background",
        html`<ui-waves line-color="#ffffff" background-color="#1f2a44" accent-color="#7dd3fc"></ui-waves>`,
      ],
      ["Faded ends, lower opacity", html`<ui-waves line-color="currentColor" fade="1" opacity="0.6"></ui-waves>`],
    ),
});

export const Pointer = meta.story({
  name: "Pointer",
  parameters: {
    docs: {
      description: { story: "Move over a tile to bend the lines and click to send a ripple; paused waves hold still." },
    },
    canvas: "column",
  },
  render: () =>
    panes(
      [
        "Wide reach, no ripple",
        html`<ui-waves
          line-color="currentColor"
          mouse-radius="320"
          mouse-strength="2"
          return-duration="3"
          click-ripple="false"
        ></ui-waves>`,
      ],
      ["Paused", html`<ui-waves line-color="currentColor" paused></ui-waves>`],
    ),
});

export const OwnPositioning = meta.story({
  name: "Own positioning",
  parameters: {
    docs: {
      description: {
        story:
          "With no positioned box around it, the waves fill their parent in the flow instead of the page, in the theme's text colour by default.",
      },
    },
  },
  render: () => html`<ui-box width="64" height="32"><ui-waves intro="false"></ui-waves></ui-box>`,
  play: async ({ canvasElement }) => {
    const box = canvasElement.querySelector("ui-box > div")!.getBoundingClientRect();
    const waves = canvasElement.querySelector<HTMLElement>("[data-waves]")!;
    await waitFor(() => expect(Math.round(waves.getBoundingClientRect().height)).toBe(Math.round(box.height)));
    await expect(Math.round(waves.getBoundingClientRect().width)).toBe(Math.round(box.width));
    await expect(getComputedStyle(waves).position).toBe("relative");
    await expect(canvasElement.querySelector("ui-waves")!.lineColor).toBe("currentColor");
  },
});

export const ContextLoss = meta.story({
  name: "Context loss",
  parameters: {
    docs: {
      description: { story: "When the GPU drops the WebGL context the waves pause and start again on restore." },
    },
  },
  render: () => html`<ui-card><ui-box height="32"></ui-box><ui-waves intro="false"></ui-waves></ui-card>`,
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement);
    const gl = canvas.getContext("webgl2")!;
    const lose = gl.getExtension("WEBGL_lose_context")!;
    let kept: boolean | undefined;
    canvas.addEventListener("webglcontextlost", (e) => (kept = e.defaultPrevented), { once: true });
    lose.loseContext();
    await waitFor(() => expect(gl.isContextLost()).toBe(true));
    await waitFor(() => expect(kept).toBe(true));
    lose.restoreContext();
    await waitFor(() => expect(gl.isContextLost()).toBe(false), { timeout: 3000 });
  },
});

const host = () => html`<div data-host style="position: relative; block-size: 8rem"></div>`;

const mount = async (root: HTMLElement, attrs: Record<string, string> = {}) => {
  const el = document.createElement("ui-waves");
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  root.querySelector("[data-host]")!.append(el);
  await el.updateComplete;
  return el;
};

const frames = async (count: number) => {
  for (let i = 0; i < count; i++) await new Promise<number>((done) => requestAnimationFrame(done));
};

const glOf = (el: HTMLElement) => el.querySelector("canvas")!.getContext("webgl2")!;

const uniform = (el: HTMLElement, name: string) => {
  const gl = glOf(el);
  const program = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram;
  return gl.getUniform(program, gl.getUniformLocation(program, name)!);
};

const fieldPeak = (el: HTMLElement) => {
  const gl = glOf(el);
  gl.getExtension("EXT_color_buffer_float");
  const [cols, rows] = uniform(el, "uFieldSize") as Int32Array;
  const texture = gl.getParameter(gl.TEXTURE_BINDING_2D) as WebGLTexture;
  const buffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  const values = new Float32Array(cols! * rows! * 4);
  gl.readPixels(0, 0, cols!, rows!, gl.RGBA, gl.FLOAT, values);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(buffer);
  let peak = 0;
  for (const [i, v] of values.entries())
    if (i % 4 < 2) peak = Math.max(peak, Number.isFinite(v) ? Math.abs(v) : Infinity);
  return peak;
};

const boxOf = (el: HTMLElement) => el.querySelector("[data-waves]")!.getBoundingClientRect();

const sweep = async (el: HTMLElement, steps = 8) => {
  const r = boxOf(el);
  for (let i = 0; i < steps; i++) {
    dispatchEvent(new PointerEvent("pointermove", { clientX: r.left + 20 + i * 15, clientY: r.top + r.height / 2 }));
    await frames(1);
  }
};

const press = (el: HTMLElement, x: number, y: number, pointerType = "mouse") => {
  const r = boxOf(el);
  dispatchEvent(new PointerEvent("pointerdown", { clientX: r.left + x, clientY: r.top + y, pointerType }));
};

const still = { intro: "false", speed: "0", amplitude: "0", "return-duration": "0.2", bounce: "0" };

const close = async (actual: ArrayLike<number>, expected: number[]) => {
  for (const [i, v] of expected.entries()) await expect(actual[i]).toBeCloseTo(v, 2);
};

export const PointerField = meta.story({
  name: "Pointer field",
  parameters: {
    canvas: "column",
    docs: {
      description: {
        story:
          "A moving pointer pushes the lines aside and they spring back once it leaves; a barely-there strength nudges them without settling the field.",
      },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const el = await mount(canvasElement, { ...still, "mouse-radius": "60" });
    await frames(2);
    await expect(fieldPeak(el)).toBe(0);
    await sweep(el);
    await waitFor(() => expect(fieldPeak(el)).toBeGreaterThan(0.5));
    document.documentElement.dispatchEvent(new PointerEvent("pointerleave"));
    await waitFor(() => expect(fieldPeak(el)).toBe(0), { timeout: 4000 });

    const faint = await mount(canvasElement, { ...still, "mouse-strength": "0.0001" });
    await sweep(faint);
    await waitFor(() => expect(fieldPeak(faint)).toBeGreaterThan(0));
    await expect(fieldPeak(faint)).toBeLessThan(0.02);
    document.documentElement.dispatchEvent(new PointerEvent("pointerleave"));
    await waitFor(() => expect(fieldPeak(faint)).toBe(0), { timeout: 4000 });
  },
});

export const Ripples = meta.story({
  name: "Ripples",
  parameters: {
    canvas: "column",
    docs: {
      description: {
        story:
          "A press inside sends a ripple that fades out; presses outside, with click-ripple off or while paused send none, and at most six ripples run at once.",
      },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const el = await mount(canvasElement, still);
    await frames(2);
    press(el, 24, 24);
    await waitFor(() => expect(fieldPeak(el)).toBeGreaterThan(0.5));
    await waitFor(() => expect(fieldPeak(el)).toBe(0), { timeout: 4000 });

    for (let i = 0; i < 7; i++) press(el, 30 + i * 10, 40, "touch");
    dispatchEvent(new PointerEvent("pointerup", { pointerType: "touch" }));
    dispatchEvent(new PointerEvent("pointerup", { pointerType: "mouse" }));
    await waitFor(() => expect(fieldPeak(el)).toBeGreaterThan(0.5));
    await expect(Number.isFinite(fieldPeak(el))).toBe(true);
    await waitFor(() => expect(fieldPeak(el)).toBe(0), { timeout: 6000 });

    press(el, -40, 24);
    await frames(4);
    await expect(fieldPeak(el)).toBe(0);
    el.clickRipple = false;
    await el.updateComplete;
    press(el, 24, 24);
    await frames(4);
    await expect(fieldPeak(el)).toBe(0);
    el.clickRipple = true;
    el.paused = true;
    await el.updateComplete;
    press(el, 24, 24);
    dispatchEvent(new PointerEvent("pointermove", { clientX: 0, clientY: 0 }));
    await frames(4);
    await expect(fieldPeak(el)).toBe(0);
  },
});

export const ReducedMotion = meta.story({
  name: "Reduced motion",
  parameters: {
    canvas: "column",
    docs: {
      description: {
        story: "With reduced motion the waves skip the intro, hold their flow still and ignore the pointer.",
      },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const real = window.matchMedia;
    window.matchMedia = (query: string) =>
      Object.defineProperty(real.call(window, query), "matches", { value: query.includes("reduced-motion") });
    let el: UiWaves;
    try {
      el = await mount(canvasElement);
    } finally {
      window.matchMedia = real;
    }
    await frames(2);
    await expect(uniform(el, "uReveal")).toBe(1e6);
    await expect(uniform(el, "uAmplitude")).toBe(32);
    const drift = [...(uniform(el, "uDrift") as Float32Array)];
    await sweep(el);
    press(el, 24, 24);
    await frames(4);
    await close(uniform(el, "uDrift") as Float32Array, drift);
    await expect(fieldPeak(el)).toBe(0);
  },
});

export const ColoursAndStyles = meta.story({
  name: "Colours and styles",
  parameters: {
    canvas: "column",
    docs: {
      description: {
        story:
          "Light mode deepens the line colour into ink, the accent defaults to the line colour, an unknown line style draws solid and a dashed line keeps flowing even without amplitude.",
      },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const ink = await mount(canvasElement, { "line-color": "#ffffff", "light-mode": "", "line-style": "dotted" });
    const depth = Math.pow(0.045, 1 / 2.2);
    await waitFor(() => close(uniform(ink, "uColor") as Float32Array, [depth, depth, depth]));
    await close(uniform(ink, "uAccent") as Float32Array, [depth, depth, depth]);
    await expect(uniform(ink, "uStyle")).toBe(0);

    const dashed = await mount(canvasElement, { intro: "false", amplitude: "0", "line-style": "dashed" });
    await expect(uniform(dashed, "uStyle")).toBe(1);
    const flow = uniform(dashed, "uFlow");
    await waitFor(() => expect(uniform(dashed, "uFlow")).not.toBe(flow));
  },
});

export const VertexBudget = meta.story({
  name: "Vertex budget",
  parameters: {
    canvas: "column",
    docs: {
      description: { story: "Dense, very tall waves sample each line more coarsely to stay within the vertex budget." },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const dense = await mount(canvasElement, { spacing: "2", amplitude: "3000", intro: "false" });
    await waitFor(() => expect(uniform(dense, "uStep")).toBeGreaterThan(4));
    const normal = await mount(canvasElement, { intro: "false" });
    await expect(uniform(normal, "uStep")).toBe(4);
  },
});

export const PixelRatio = meta.story({
  name: "Pixel ratio",
  parameters: {
    canvas: "column",
    docs: {
      description: {
        story:
          "Without a dpr the canvas follows the screen's pixel ratio, capped at 2; changing dpr resizes it, and other changes redraw a still canvas at once.",
      },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const own = Object.getOwnPropertyDescriptor(window, "devicePixelRatio");
    Object.defineProperty(window, "devicePixelRatio", { configurable: true, value: 3 });
    let el: UiWaves;
    try {
      el = await mount(canvasElement, still);
      const canvas = el.querySelector("canvas")!;
      const box = canvas.parentElement!;
      await waitFor(() => expect(canvas.width).toBe(Math.round(box.clientWidth * 2)));
    } finally {
      if (own) Object.defineProperty(window, "devicePixelRatio", own);
      else delete (window as { devicePixelRatio?: number }).devicePixelRatio;
    }
    const canvas = el.querySelector("canvas")!;
    el.dpr = 1;
    await el.updateComplete;
    await expect(canvas.width).toBe(Math.max(1, Math.round(canvas.parentElement!.clientWidth)));
    const raf = spyOn(window, "requestAnimationFrame");
    try {
      let calls = -1;
      await waitFor(
        () => {
          const now = raf.mock.calls.length;
          const idle = now === calls;
          calls = now;
          return expect(idle).toBe(true);
        },
        { timeout: 4000, interval: 100 },
      );
    } finally {
      raf.mockRestore();
    }
    el.opacity = 0.4;
    await el.updateComplete;
    await expect(uniform(el, "uOpacity")).toBeCloseTo(0.4);
  },
});

export const Visibility = meta.story({
  name: "Visibility",
  parameters: {
    canvas: "column",
    docs: {
      description: {
        story: "The flow stops while the page is hidden or the waves are scrolled out of view, and resumes after.",
      },
    },
  },
  render: () =>
    html`<div data-host style="position: relative; block-size: 8rem"></div>
      <div data-spacer style="block-size: 300vh"></div>
      <div data-far style="position: relative; block-size: 8rem"></div>`,
  play: async ({ canvasElement }) => {
    const el = await mount(canvasElement, { intro: "false" });
    await frames(2);
    const own = Object.getOwnPropertyDescriptor(document, "hidden");
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    let held = 0;
    try {
      await frames(2);
      held = (uniform(el, "uDrift") as Float32Array)[0]!;
      document.dispatchEvent(new Event("visibilitychange"));
      await frames(3);
      await expect((uniform(el, "uDrift") as Float32Array)[0]).toBe(held);
    } finally {
      if (own) Object.defineProperty(document, "hidden", own);
      else delete (document as { hidden?: boolean }).hidden;
    }
    document.dispatchEvent(new Event("visibilitychange"));
    await waitFor(() => expect((uniform(el, "uDrift") as Float32Array)[0]).not.toBeCloseTo(held, 4));

    const far = document.createElement("ui-waves");
    far.setAttribute("intro", "false");
    canvasElement.querySelector("[data-far]")!.append(far);
    await far.updateComplete;
    await waitFor(async () => {
      const before = (uniform(far, "uDrift") as Float32Array)[0];
      await frames(2);
      await expect((uniform(far, "uDrift") as Float32Array)[0]).toBe(before);
    });
    try {
      canvasElement.querySelector("[data-far]")!.scrollIntoView();
      const before = (uniform(far, "uDrift") as Float32Array)[0]!;
      await waitFor(() => expect((uniform(far, "uDrift") as Float32Array)[0]).not.toBeCloseTo(before, 4));
    } finally {
      scrollTo(0, 0);
    }
  },
});

export const Lifecycle = meta.story({
  name: "Lifecycle",
  parameters: {
    canvas: "column",
    docs: {
      description: {
        story:
          "Moving the waves keeps one running renderer, re-attaching them after removal starts on a fresh canvas, and removal during a lost context is safe.",
      },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>("[data-host]")!;
    const el = await mount(canvasElement, { intro: "false" });
    const first = el.querySelector("canvas")!;
    const advances = async () => {
      const drift = (uniform(el, "uDrift") as Float32Array)[0]!;
      await waitFor(() => expect((uniform(el, "uDrift") as Float32Array)[0]).not.toBeCloseTo(drift, 4));
    };
    root.append(el);
    root.append(el);
    await el.updateComplete;
    await frames(2);
    await expect(el.querySelectorAll("canvas")).toHaveLength(1);
    await expect(el.querySelector("canvas")).toBe(first);
    await expect(glOf(el).isContextLost()).toBe(false);
    await advances();

    root.append(el);
    el.remove();
    await frames(2);
    root.append(el);
    await el.updateComplete;
    await expect(el.querySelector("canvas")).toBe(first);
    await advances();

    const old = glOf(el);
    el.remove();
    await expect(old.isContextLost()).toBe(true);
    root.append(el);
    await el.updateComplete;
    await frames(1);
    await expect(el.querySelector("canvas")).not.toBe(first);
    await expect(glOf(el).isContextLost()).toBe(false);
    await advances();

    const gl = glOf(el);
    gl.getExtension("WEBGL_lose_context")!.loseContext();
    await waitFor(() => expect(gl.isContextLost()).toBe(true));
    el.remove();
    root.append(el);
    await el.updateComplete;
    await frames(1);
    await expect(glOf(el)).not.toBe(gl);
    await expect(glOf(el).isContextLost()).toBe(false);
    await advances();
  },
});

export const WithoutWebGL = meta.story({
  name: "Without WebGL",
  parameters: {
    canvas: "column",
    docs: {
      description: {
        story:
          "Without a WebGL 2 context, with one already lost, or when the shaders fail to link, the waves leave the canvas blank.",
      },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    const lost = document.createElement("canvas").getContext("webgl2")!;
    lost.getExtension("WEBGL_lose_context")!.loseContext();
    await waitFor(() => expect(lost.isContextLost()).toBe(true));
    const cases: (() => WebGL2RenderingContext | null)[] = [() => null, () => lost];
    for (const replacement of cases) {
      const stub = function (this: HTMLCanvasElement, type: string, options?: unknown) {
        return type === "webgl2" ? replacement() : getContext.call(this, type as "2d", options as undefined);
      };
      HTMLCanvasElement.prototype.getContext = stub as typeof getContext;
      let el: UiWaves;
      try {
        el = await mount(canvasElement);
      } finally {
        HTMLCanvasElement.prototype.getContext = getContext;
      }
      await frames(2);
      await expect(el.querySelector("canvas")!.width).toBe(300);
      el.remove();
    }

    const linked = WebGL2RenderingContext.prototype.getProgramParameter;
    WebGL2RenderingContext.prototype.getProgramParameter = function (program, name) {
      return name === this.LINK_STATUS ? false : linked.call(this, program, name);
    };
    let el: UiWaves;
    try {
      el = await mount(canvasElement);
    } finally {
      WebGL2RenderingContext.prototype.getProgramParameter = linked;
    }
    await frames(2);
    const canvas = el.querySelector("canvas")!;
    await expect(canvas.width).toBe(300);
    await expect(canvas.getContext("webgl2")!.getParameter(WebGL2RenderingContext.CURRENT_PROGRAM)).toBeNull();
  },
});

export const Intro = meta.story({
  name: "Intro",
  parameters: {
    canvas: "column",
    docs: {
      description: { story: "The intro reveals the lines from the middle out, then swells them to full amplitude." },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const el = await mount(canvasElement);
    await frames(2);
    const early = uniform(el, "uReveal") as number;
    await expect(early).toBeLessThan(1e6);
    await waitFor(() => expect(uniform(el, "uReveal") as number).toBeGreaterThan(early));
    await waitFor(() => expect(uniform(el, "uAmplitude")).toBe(32), { timeout: 5000 });
    const reveal = uniform(el, "uReveal");
    await frames(2);
    await expect(uniform(el, "uAmplitude")).toBe(32);
    await expect(uniform(el, "uReveal")).toBe(reveal);
  },
});

export const ThemeChange = meta.story({
  name: "Theme change",
  parameters: {
    canvas: "column",
    docs: { description: { story: "Lines in the text colour follow the theme when it switches." } },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const el = await mount(canvasElement, still);
    await frames(2);
    const before = [...(uniform(el, "uColor") as Float32Array)];
    const root = document.documentElement;
    const theme = root.getAttribute("data-theme");
    const next = getComputedStyle(root).colorScheme.includes("dark") ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      await waitFor(() => expect([...(uniform(el, "uColor") as Float32Array)]).not.toEqual(before));
    } finally {
      if (theme === null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", theme);
    }
    await waitFor(() => expect([...(uniform(el, "uColor") as Float32Array)]).toEqual(before));
  },
});
