import preview from "#.storybook/preview";
import { html, type TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, spyOn, waitFor } from "storybook/test";
import "./magnet-lines.ts";
import type { UiMagnetLines } from "./magnet-lines.ts";
import "../layout/box.ts";
import "../layout/flex.ts";
import "../layout/grid.ts";

const panes = (...tiles: [label: string, lines: TemplateResult][]) =>
  html`<ui-grid fit="sm" gap="4">
    ${tiles.map(
      ([label, lines]) =>
        html`<ui-flex direction="col" gap="1">
          <span>${label}</span>
          <ui-box border rounded="box" height="64" overflow="hidden">${lines}</ui-box>
        </ui-flex>`,
    )}
  </ui-grid>`;

const canvasOf = (el: HTMLElement) => el.querySelector<HTMLCanvasElement>("ui-magnet-lines canvas")!;

const range = (min: number, max: number, step: number) => ({ control: { type: "range" as const, min, max, step } });

const meta = preview.meta({
  title: "Primitives/Media/Magnet lines",
  component: "ui-magnet-lines",
  args: {
    lineColor: "currentColor",
    accentColor: "",
    spacing: 30,
    rows: undefined,
    columns: undefined,
    lineWidth: 2,
    lineHeight: 18,
    baseAngle: -10,
    mode: "orbit",
    shape: "line",
    rainbow: false,
    radius: 200,
    fade: 0.65,
    edgeFade: 0,
    stretch: 0.4,
    reach: 0,
    scatter: 0,
    inertia: 0.35,
    bounce: 0.3,
    ripple: 0.3,
    clickPulse: true,
    intro: true,
    idle: false,
    tiltX: 0,
    tiltY: 0,
    maxDevicePixelRatio: 1,
  },
  argTypes: {
    lineColor: { control: "color" },
    accentColor: { control: "color" },
    spacing: { control: { type: "number", min: 4, max: 120, step: 1 } },
    rows: { control: { type: "number", min: 1, max: 400, step: 1 } },
    columns: { control: { type: "number", min: 1, max: 400, step: 1 } },
    lineWidth: { control: { type: "number", min: 0.5, max: 12, step: 0.5 } },
    lineHeight: { control: { type: "number", min: 2, max: 64, step: 1 } },
    baseAngle: range(-180, 180, 1),
    mode: { control: "inline-radio", options: ["orbit", "attract", "spiral", "dipole"] },
    shape: { control: "inline-radio", options: ["line", "arrow", "needle"] },
    radius: { control: { type: "number", min: 1, max: 800, step: 10 } },
    fade: range(0, 1, 0.05),
    edgeFade: range(0, 1, 0.05),
    stretch: range(0, 2, 0.05),
    reach: { control: { type: "number", min: 0, max: 400, step: 10 } },
    scatter: range(0, 1, 0.05),
    inertia: range(0, 1, 0.05),
    bounce: range(0, 1, 0.05),
    ripple: range(0, 1, 0.05),
    tiltX: range(-70, 70, 1),
    tiltY: range(-70, 70, 1),
    maxDevicePixelRatio: { control: { type: "number", min: 1, max: 3, step: 0.5 } },
  },
  render: (args) =>
    html`<ui-box border rounded="box" height="64" overflow="hidden"
      ><ui-magnet-lines
        line-color=${args.lineColor}
        accent-color=${args.accentColor}
        spacing=${args.spacing}
        rows=${ifDefined(args.rows)}
        columns=${ifDefined(args.columns)}
        line-width=${args.lineWidth}
        line-height=${args.lineHeight}
        base-angle=${args.baseAngle}
        mode=${args.mode}
        shape=${args.shape}
        ?rainbow=${args.rainbow}
        radius=${args.radius}
        fade=${args.fade}
        edge-fade=${args.edgeFade}
        stretch=${args.stretch}
        reach=${args.reach}
        scatter=${args.scatter}
        inertia=${args.inertia}
        bounce=${args.bounce}
        ripple=${args.ripple}
        click-pulse=${String(args.clickPulse)}
        intro=${String(args.intro)}
        ?idle=${args.idle}
        tilt-x=${args.tiltX}
        tilt-y=${args.tiltY}
        max-device-pixel-ratio=${args.maxDevicePixelRatio}
      ></ui-magnet-lines
    ></ui-box>`,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the lines." } }, canvas: "column" },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement);
    await expect(canvas).toHaveAttribute("aria-hidden", "true");
    const box = canvas.parentElement!;
    await waitFor(() => expect(canvas.style.width).toBe(`${box.clientWidth}px`));
    await expect(canvas.width).toBe(Math.round(box.clientWidth));
    await expect(canvas.height).toBe(Math.round(box.clientHeight));
  },
});

export const SharpOnDenseScreens = meta.story({
  name: "Sharp on dense screens",
  args: { maxDevicePixelRatio: 2 },
  parameters: { canvas: "column" },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement);
    const box = canvas.parentElement!;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    await waitFor(() => expect(canvas.width).toBe(Math.max(1, Math.round(box.clientWidth * ratio))));
  },
});

export const FixedGrid = meta.story({
  name: "Fixed grid",
  args: { rows: 8, columns: 12, shape: "needle", mode: "dipole" },
  parameters: { canvas: "column" },
  play: async ({ canvasElement }) => {
    const lines = canvasElement.querySelector("ui-magnet-lines")!;
    await expect(lines).toHaveAttribute("rows", "8");
    await expect(lines).toHaveAttribute("columns", "12");
    await waitFor(() => expect(canvasOf(canvasElement).width).toBeGreaterThan(1));
  },
});

export const Modes = meta.story({
  name: "Modes",
  parameters: {
    docs: {
      description: {
        story: "Lines fill their box and turn toward the pointer; the mode decides how they gather around it.",
      },
    },
    canvas: "column",
  },
  render: () =>
    panes(
      ["Orbit", html`<ui-magnet-lines line-color="currentColor" mode="orbit"></ui-magnet-lines>`],
      ["Attract", html`<ui-magnet-lines line-color="currentColor" mode="attract"></ui-magnet-lines>`],
      ["Spiral", html`<ui-magnet-lines line-color="currentColor" mode="spiral"></ui-magnet-lines>`],
      ["Dipole", html`<ui-magnet-lines line-color="currentColor" mode="dipole"></ui-magnet-lines>`],
    ),
});

export const Shapes = meta.story({
  name: "Shapes",
  parameters: { canvas: "column" },
  render: () =>
    panes(
      ["Line", html`<ui-magnet-lines line-color="currentColor" shape="line"></ui-magnet-lines>`],
      ["Arrow", html`<ui-magnet-lines line-color="currentColor" shape="arrow"></ui-magnet-lines>`],
      [
        "Needle",
        html`<ui-magnet-lines
          line-color="currentColor"
          shape="needle"
          spacing="24"
          line-width="1.5"
          line-height="16"
        ></ui-magnet-lines>`,
      ],
    ),
});

export const ColourAndDensity = meta.story({
  name: "Colour and density",
  parameters: {
    docs: {
      description: {
        story: "A fixed row and column count overrides spacing, so the grid keeps its count at any size.",
      },
    },
    canvas: "column",
  },
  render: () =>
    panes(
      [
        "Accent near the pointer",
        html`<ui-magnet-lines line-color="currentColor" accent-color="#e0592a" radius="260"></ui-magnet-lines>`,
      ],
      ["Rainbow", html`<ui-magnet-lines line-color="currentColor" rainbow></ui-magnet-lines>`],
      [
        "Eight by twelve",
        html`<ui-magnet-lines
          line-color="currentColor"
          rows="8"
          columns="12"
          line-width="3"
          line-height="12"
        ></ui-magnet-lines>`,
      ],
    ),
});

export const Behaviour = meta.story({
  name: "Behaviour",
  parameters: {
    docs: {
      description: { story: "Idle lines keep drifting with no pointer nearby; tilt leans the whole field in 3D." },
    },
    canvas: "column",
  },
  render: () =>
    panes(
      ["Idle", html`<ui-magnet-lines line-color="currentColor" idle></ui-magnet-lines>`],
      [
        "Tilted, scattered",
        html`<ui-magnet-lines
          line-color="currentColor"
          tilt-x="35"
          tilt-y="-20"
          scatter="0.5"
          edge-fade="0.6"
        ></ui-magnet-lines>`,
      ],
    ),
});

const host = () => html`<div data-host style="block-size: 16rem"></div>`;
const column = { canvas: "column" };

const mount = async (root: HTMLElement, attrs: Record<string, string> = {}) => {
  const el = document.createElement("ui-magnet-lines");
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  root.querySelector("[data-host]")!.append(el);
  await el.updateComplete;
  return el;
};

const frames = async (count: number) => {
  for (let i = 0; i < count; i++) await new Promise<number>((done) => requestAnimationFrame(done));
};

const elapse = async (ms: number) => {
  const until = performance.now() + ms;
  while (performance.now() < until) await new Promise<number>((done) => requestAnimationFrame(done));
};

const glOf = (el: HTMLElement) => el.querySelector("canvas")!.getContext("webgl2")!;

const uniform = (el: HTMLElement, name: string) => {
  const gl = glOf(el);
  const program = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram;
  return gl.getUniform(program, gl.getUniformLocation(program, name)!);
};

const attribute = (el: HTMLElement, index: number) => {
  const gl = glOf(el);
  const buffer = gl.getVertexAttrib(index, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING) as WebGLBuffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  const data = new Float32Array((gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE) as number) / 4);
  gl.getBufferSubData(gl.ARRAY_BUFFER, 0, data);
  return data;
};

const states = (el: HTMLElement) => attribute(el, 2);
const centers = (el: HTMLElement) => attribute(el, 1);
const count = (el: HTMLElement) => states(el).length / 4;
const boxOf = (el: HTMLElement) => el.querySelector("[data-magnet-lines]")!.getBoundingClientRect();

const nearest = (el: HTMLElement, x: number, y: number) => {
  const c = centers(el);
  const r = boxOf(el);
  let best = 0;
  for (let i = 0; i < c.length / 2; i++)
    if (
      Math.hypot(c[i * 2]! + r.width / 2 - x, c[i * 2 + 1]! + r.height / 2 - y) <
      Math.hypot(c[best * 2]! + r.width / 2 - x, c[best * 2 + 1]! + r.height / 2 - y)
    )
      best = i;
  return best;
};

const move = (el: HTMLElement, x: number, y: number, type = "pointermove") => {
  const r = boxOf(el);
  dispatchEvent(new PointerEvent(type, { clientX: r.left + x, clientY: r.top + y }));
};

const settled = { intro: "false", ripple: "0" };

const expectClose = async (actual: ArrayLike<number>, expected: number[]) => {
  for (const [i, v] of expected.entries()) await expect(actual[i]).toBeCloseTo(v, 3);
};

export const GridSizing = meta.story({
  name: "Grid sizing",
  parameters: {
    ...column,
    docs: {
      description: {
        story:
          "Spacing sets the grid, a row or column count overrides it and keeps the box's aspect, the grid caps at 30,000 lines, and resizing keeps the lines already placed.",
      },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const el = await mount(canvasElement, settled);
    await frames(2);
    const { width, height } = boxOf(el);
    const byCells = (columns: number, rows: number) => Math.max(1, columns) * Math.max(1, rows);
    await expect(count(el)).toBe(byCells(Math.round(width / 30), Math.round(height / 30)));
    el.spacing = 0;
    await el.updateComplete;
    await frames(2);
    await expect(count(el)).toBe(byCells(Math.round(width / 30), Math.round(height / 30)));
    el.columns = 10;
    await el.updateComplete;
    await frames(2);
    await expect(count(el)).toBe(byCells(10, Math.round((10 * height) / width)));
    el.columns = undefined;
    el.rows = 4;
    await el.updateComplete;
    await frames(2);
    await expect(count(el)).toBe(byCells(Math.round((4 * width) / height), 4));
    el.rows = 400;
    el.columns = 400;
    await el.updateComplete;
    await frames(2);
    await expect(count(el)).toBe(Math.floor(400 / Math.sqrt((400 * 400) / 30000)) ** 2);

    el.rows = 4;
    el.columns = 4;
    await el.updateComplete;
    await frames(2);
    const hostBox = canvasElement.querySelector<HTMLElement>("[data-host]")!;
    hostBox.style.blockSize = "20rem";
    try {
      await waitFor(() => expect(boxOf(el).height).toBeGreaterThan(height));
      await frames(3);
      await expect(count(el)).toBe(16);
      el.rows = 5;
      await el.updateComplete;
      await frames(2);
      await expect(count(el)).toBe(20);
    } finally {
      hostBox.style.blockSize = "";
    }
  },
});

export const LineSize = meta.story({
  name: "Line size",
  parameters: {
    ...column,
    docs: { description: { story: "Line length and width take numbers, numeric strings or CSS lengths." } },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const css = await mount(canvasElement, { ...settled, "line-height": "1.5rem", "line-width": "0.25rem" });
    await frames(2);
    await expectClose(uniform(css, "uLine") as Float32Array, [12, 2]);
    css.lineHeight = " 10 ";
    css.lineWidth = 3;
    await css.updateComplete;
    await frames(2);
    await expectClose(uniform(css, "uLine") as Float32Array, [5, 1.5]);
  },
});

export const ColoursShapesAndModes = meta.story({
  name: "Colours, shapes and modes",
  parameters: {
    ...column,
    docs: {
      description: {
        story:
          "The accent defaults to the line colour (a needle's to red), the head grows with the shape, and an unknown shape or mode falls back to a line orbiting the pointer.",
      },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const el = await mount(canvasElement, { ...settled, "line-color": "rgb(51, 102, 153)" });
    await frames(2);
    await expectClose(uniform(el, "uColor") as Float32Array, [0.2, 0.4, 0.6]);
    await expectClose(uniform(el, "uAccent") as Float32Array, [0.2, 0.4, 0.6]);
    await expect(uniform(el, "uAccentMix")).toBe(0);
    await expect(uniform(el, "uRainbow")).toBe(0);
    for (const [shape, head, index] of [
      ["arrow", 0.32, 1],
      ["needle", 0.16, 2],
      ["blob", 0, 0],
    ] as const) {
      el.setAttribute("shape", shape);
      await el.updateComplete;
      await frames(2);
      await expect(uniform(el, "uHead")).toBeCloseTo(head);
      await expect(uniform(el, "uShape")).toBe(index);
    }
    el.shape = "needle";
    await el.updateComplete;
    await frames(2);
    await expectClose(uniform(el, "uAccent") as Float32Array, [0xf4 / 255, 0x3f / 255, 0x5e / 255]);
    el.accentColor = "#ffffff";
    el.rainbow = true;
    await el.updateComplete;
    await frames(2);
    await expectClose(uniform(el, "uAccent") as Float32Array, [1, 1, 1]);
    await expect(uniform(el, "uAccentMix")).toBe(1);
    await expect(uniform(el, "uRainbow")).toBe(1);
    el.remove();

    const orbit = await mount(canvasElement, { ...settled, mode: "orbit", inertia: "0" });
    await frames(3);
    const unknown = await mount(canvasElement, { ...settled, mode: "swirl", inertia: "0" });
    await frames(3);
    await expect([...states(unknown)]).toEqual([...states(orbit)]);
    orbit.remove();
    for (const mode of ["attract", "spiral"]) {
      const other = await mount(canvasElement, { ...settled, mode, inertia: "0" });
      await frames(3);
      await expect([...states(other)]).not.toEqual([...states(unknown)]);
      other.remove();
    }
    unknown.remove();

    const dipole = await mount(canvasElement, { ...settled, mode: "dipole", rows: "1", columns: "1" });
    await frames(3);
    await expect(Number.isFinite(states(dipole)[0])).toBe(true);
  },
});

export const PointerAndPulses = meta.story({
  name: "Pointer and pulses",
  parameters: {
    ...column,
    docs: {
      description: {
        story:
          "Lines near the pointer light up and turn with it; a press inside sends a pulse that spins and flashes the lines as it passes, at most six at once, and presses outside, beyond the horizon or with click-pulse off send none.",
      },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const el = await mount(canvasElement, { intro: "false", mode: "dipole" });
    move(el, 10, 10);
    move(el, 10, 10, "pointerdown");
    await frames(3);
    await expect(Math.max(...states(el).filter((_, i) => i % 4 === 2))).toBe(0);

    const { width, height } = boxOf(el);
    for (let i = 0; i < 10; i++) {
      move(el, 20 + i * 30, height / 2);
      await frames(1);
    }
    const near = nearest(el, 20 + 9 * 30, height / 2);
    await waitFor(() => expect(states(el)[near * 4 + 1]).toBeGreaterThan(0.9));
    const far = nearest(el, width - 10, 10);
    await expect(states(el)[far * 4 + 1]).toBeLessThan(states(el)[near * 4 + 1]!);

    const flash = () => Math.max(...states(el).filter((_, i) => i % 4 === 2));
    for (let i = 0; i < 7; i++) move(el, width / 2, height / 2, "pointerdown");
    await waitFor(() => expect(flash()).toBeGreaterThan(0.1));
    await waitFor(() => expect(flash()).toBe(0), { timeout: 8000 });

    move(el, width + 40, height / 2, "pointerdown");
    await frames(4);
    await expect(flash()).toBe(0);
    el.clickPulse = false;
    await el.updateComplete;
    move(el, width / 2, height / 2, "pointerdown");
    await frames(4);
    await expect(flash()).toBe(0);
    document.documentElement.dispatchEvent(new PointerEvent("pointerleave"));
    await frames(2);

    const tilted = await mount(canvasElement, { intro: "false", "tilt-x": "70" });
    await frames(2);
    const before = [...states(tilted)];
    move(tilted, width / 2, -100000);
    move(tilted, width / 2, -100000, "pointerdown");
    await frames(3);
    await expect([...states(tilted)]).toEqual(before);
  },
});

export const IdleWander = meta.story({
  name: "Idle wander",
  parameters: {
    ...column,
    docs: {
      description: {
        story:
          "Idle lines follow a wandering point until the pointer arrives, and again once it has been away a while.",
      },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const el = await mount(canvasElement, { ...settled, idle: "" });
    await frames(2);
    const first = states(el)[0];
    await waitFor(() => expect(states(el)[0]).not.toBeCloseTo(first!, 4));
    const { width, height } = boxOf(el);
    move(el, width / 2, height / 2);
    move(el, width + 200, height / 2);
    await frames(2);
    const away = states(el)[0]!;
    await waitFor(() => expect(states(el)[0]).not.toBeCloseTo(away, 2), { timeout: 4000 });
  },
});

export const ReachAndInertia = meta.story({
  name: "Reach and inertia",
  parameters: {
    ...column,
    docs: {
      description: {
        story:
          "With a reach, lines beyond it rest at the base angle; without inertia lines snap to the pointer at once, and ripple delays far lines.",
      },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const reach = await mount(canvasElement, { ...settled, reach: "60", inertia: "0" });
    await frames(2);
    const { width, height } = boxOf(reach);
    move(reach, 10, 10);
    const far = nearest(reach, width - 10, height - 10);
    await waitFor(() => expect(states(reach)[far * 4]).toBeCloseTo(((-10 + 90) * Math.PI) / 180, 3), {
      timeout: 4000,
    });
    reach.remove();

    const snap = await mount(canvasElement, { intro: "false", inertia: "0", ripple: "0.5" });
    await frames(2);
    move(snap, width / 2, height / 2);
    await frames(2);
    move(snap, width / 2 + 40, height / 2);
    const line = nearest(snap, 10, 10);
    await waitFor(
      async () => {
        const angle = states(snap)[line * 4]!;
        await frames(2);
        await expect(states(snap)[line * 4]).toBeCloseTo(angle, 3);
      },
      { timeout: 4000 },
    );
  },
});

export const IntroReveal = meta.story({
  name: "Intro reveal",
  parameters: {
    ...column,
    docs: {
      description: {
        story:
          "The intro fades the lines in from the centre and turns them from their rest angle, then the lines go still; a window resize wakes them to re-measure.",
      },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const raf = spyOn(window, "requestAnimationFrame");
    try {
      const el = await mount(canvasElement, { ripple: "0", inertia: "0" });
      await frames(2);
      const shown = () => states(el).filter((_, i) => i % 4 === 3);
      await expect(Math.min(...shown())).toBeLessThan(1);
      await waitFor(() => expect(Math.min(...shown())).toBe(1), { timeout: 4000 });
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
      const idle = raf.mock.calls.length;
      window.dispatchEvent(new Event("resize"));
      await waitFor(() => expect(raf.mock.calls.length).toBeGreaterThan(idle));
    } finally {
      raf.mockRestore();
    }
  },
});

export const ReducedMotion = meta.story({
  name: "Reduced motion",
  parameters: {
    ...column,
    docs: { description: { story: "With reduced motion there is no intro, no spring and no pulse." } },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const real = window.matchMedia;
    window.matchMedia = (query: string) =>
      Object.defineProperty(real.call(window, query), "matches", { value: query.includes("reduced-motion") });
    let el: UiMagnetLines;
    try {
      el = await mount(canvasElement, { idle: "" });
    } finally {
      window.matchMedia = real;
    }
    await frames(2);
    await expect(Math.min(...states(el).filter((_, i) => i % 4 === 3))).toBe(1);
    const { width, height } = boxOf(el);
    move(el, width / 2, height / 2, "pointerdown");
    await frames(4);
    await expect(Math.max(...states(el).filter((_, i) => i % 4 === 2))).toBe(0);
  },
});

export const TiltCulling = meta.story({
  name: "Tilt culling",
  parameters: {
    ...column,
    docs: {
      description: {
        story:
          "A tilted field draws only the lines in view, and when more than 30,000 are in view it keeps the nearest.",
      },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const steep = await mount(canvasElement, { ...settled, "tilt-x": "70", "tilt-y": "40" });
    await frames(2);
    await expect(count(steep)).toBeGreaterThan(0);
    steep.remove();
    const dense = await mount(canvasElement, {
      ...settled,
      "tilt-x": "60",
      "tilt-y": "30",
      columns: "400",
      rows: "75",
    });
    await frames(2);
    await expect(count(dense)).toBe(30000);
  },
});

export const WrapsLongSpins = meta.story({
  name: "Wraps long spins",
  parameters: {
    ...column,
    docs: { description: { story: "A pointer circling a line many times keeps its angle within range." } },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const el = await mount(canvasElement, { ...settled, columns: "1", rows: "1", inertia: "0.05" });
    await frames(2);
    const { width, height } = boxOf(el);
    for (const way of [1, -1]) {
      for (let step = 0; step < 24 * 9; step++) {
        const turn = way * (step / 24) * Math.PI * 2;
        move(el, width / 2 + Math.cos(turn) * 40, height / 2 + Math.sin(turn) * 40);
        await elapse(16);
      }
      await expect(Math.abs(states(el)[0]!)).toBeLessThan(40);
    }
  },
});

export const VisibilityAndTheme = meta.story({
  name: "Visibility and theme",
  parameters: {
    ...column,
    docs: {
      description: {
        story:
          "The lines pause while the page is hidden or scrolled out of view, and lines in the text colour follow a theme switch.",
      },
    },
  },
  render: () =>
    html`<div data-host style="block-size: 16rem"></div>
      <div style="block-size: 300vh"></div>
      <div data-far style="block-size: 16rem"></div>`,
  play: async ({ canvasElement }) => {
    const el = await mount(canvasElement, { ...settled, "line-color": "currentColor", idle: "" });
    await frames(2);
    const own = Object.getOwnPropertyDescriptor(document, "visibilityState");
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
    let held = 0;
    try {
      document.dispatchEvent(new Event("visibilitychange"));
      await frames(2);
      held = states(el)[0]!;
      await frames(3);
      await expect(states(el)[0]).toBe(held);
    } finally {
      if (own) Object.defineProperty(document, "visibilityState", own);
      else delete (document as { visibilityState?: string }).visibilityState;
    }
    document.dispatchEvent(new Event("visibilitychange"));
    await waitFor(() => expect(states(el)[0]).not.toBe(held));

    const before = [...(uniform(el, "uColor") as Float32Array)];
    const root = document.documentElement;
    const theme = root.getAttribute("data-theme");
    root.setAttribute("data-theme", getComputedStyle(root).colorScheme.includes("dark") ? "light" : "dark");
    try {
      await waitFor(() => expect([...(uniform(el, "uColor") as Float32Array)]).not.toEqual(before));
    } finally {
      if (theme === null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", theme);
    }
    await waitFor(() => expect([...(uniform(el, "uColor") as Float32Array)]).toEqual(before));

    const far = document.createElement("ui-magnet-lines");
    far.setAttribute("idle", "");
    canvasElement.querySelector("[data-far]")!.append(far);
    await far.updateComplete;
    try {
      canvasElement.querySelector("[data-far]")!.scrollIntoView();
      await waitFor(() => expect(count(far)).toBeGreaterThan(0));
      const seen = states(far)[0]!;
      await waitFor(() => expect(states(far)[0]).not.toBe(seen));
    } finally {
      scrollTo(0, 0);
    }
  },
});

export const Lifecycle = meta.story({
  name: "Lifecycle",
  parameters: {
    ...column,
    docs: {
      description: {
        story:
          "Moving the lines keeps one renderer, re-attaching them after removal starts on a fresh canvas, and a lost context pauses them until it is restored.",
      },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>("[data-host]")!;
    const el = await mount(canvasElement, { idle: "" });
    await frames(2);
    const first = el.querySelector("canvas")!;
    root.append(el);
    root.append(el);
    await el.updateComplete;
    await frames(2);
    await expect(el.querySelector("canvas")).toBe(first);
    const moved = states(el)[0];
    await waitFor(() => expect(states(el)[0]).not.toBe(moved));

    root.append(el);
    el.remove();
    await frames(2);
    root.append(el);
    await el.updateComplete;
    await frames(2);
    await expect(el.querySelector("canvas")).toBe(first);

    const old = glOf(el);
    el.remove();
    await expect(old.isContextLost()).toBe(true);
    root.append(el);
    await el.updateComplete;
    await frames(2);
    await expect(el.querySelector("canvas")).not.toBe(first);
    await expect(count(el)).toBeGreaterThan(0);

    const gl = glOf(el);
    const lose = gl.getExtension("WEBGL_lose_context")!;
    let kept: boolean | undefined;
    gl.canvas.addEventListener("webglcontextlost", (e) => (kept = e.defaultPrevented), { once: true });
    lose.loseContext();
    await waitFor(() => expect(kept).toBe(true));
    lose.restoreContext();
    await waitFor(() => expect(gl.isContextLost()).toBe(false));
    await waitFor(() => expect(count(el)).toBeGreaterThan(0));
    await expect(Math.min(...states(el).filter((_, i) => i % 4 === 3))).toBe(1);
    el.remove();
    await expect(gl.isContextLost()).toBe(true);
    root.append(el);
    await el.updateComplete;
    await frames(2);
    await expect(count(el)).toBeGreaterThan(0);
  },
});

const COMPLETION = 0x91b1;

export const WithoutWebGL = meta.story({
  name: "Without WebGL",
  parameters: {
    ...column,
    docs: {
      description: {
        story:
          "Without WebGL 2 the canvas stays blank; a program that fails to link logs the shader or program log and draws nothing.",
      },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, options?: unknown) {
      return type === "webgl2" ? null : getContext.call(this, type as "2d", options as undefined);
    } as typeof getContext;
    let blank: UiMagnetLines;
    try {
      blank = await mount(canvasElement);
    } finally {
      HTMLCanvasElement.prototype.getContext = getContext;
    }
    await frames(2);
    await expect(blank.querySelector("canvas")!.width).toBe(300);
    blank.remove();

    const proto = WebGL2RenderingContext.prototype;
    const programParameter = proto.getProgramParameter;
    const shaderParameter = proto.getShaderParameter;
    const errors = spyOn(console, "error").mockImplementation(() => undefined);
    try {
      for (const shaderFails of [true, false]) {
        proto.getProgramParameter = function (program, name) {
          return name === this.LINK_STATUS ? false : programParameter.call(this, program, name);
        };
        proto.getShaderParameter = function (shader, name) {
          if (name !== this.COMPILE_STATUS) return shaderParameter.call(this, shader, name);
          return !(shaderFails && shaderParameter.call(this, shader, this.SHADER_TYPE) === this.VERTEX_SHADER);
        };
        let broken: UiMagnetLines;
        try {
          broken = await mount(canvasElement);
        } finally {
          proto.getProgramParameter = programParameter;
          proto.getShaderParameter = shaderParameter;
        }
        await frames(2);
        await expect(broken.querySelector("canvas")!.width).toBe(300);
        await expect(errors).toHaveBeenCalledTimes(1);
        errors.mockClear();
        broken.remove();
      }
    } finally {
      errors.mockRestore();
    }
  },
});

export const ParallelCompile = meta.story({
  name: "Parallel compile",
  parameters: {
    ...column,
    docs: {
      description: {
        story:
          "Where the GPU compiles shaders in the background the lines wait for it without blocking, pause while hidden, and drop a program that fails.",
      },
    },
  },
  render: host,
  play: async ({ canvasElement }) => {
    const proto = WebGL2RenderingContext.prototype;
    const getExtension = proto.getExtension;
    const programParameter = proto.getProgramParameter;
    const polls = new WeakMap<WebGLProgram, number>();
    let ready = 3;
    let links = true;
    proto.getExtension = function (this: WebGL2RenderingContext, name: string) {
      return name === "KHR_parallel_shader_compile"
        ? { COMPLETION_STATUS_KHR: COMPLETION }
        : (getExtension as (this: WebGL2RenderingContext, name: string) => unknown).call(this, name);
    } as typeof getExtension;
    proto.getProgramParameter = function (program, name) {
      if (name === COMPLETION) {
        const seen = (polls.get(program) ?? 0) + 1;
        polls.set(program, seen);
        return seen >= ready;
      }
      if (name === this.LINK_STATUS && !links) return false;
      return programParameter.call(this, program, name);
    };
    const errors = spyOn(console, "error").mockImplementation(() => undefined);
    try {
      const el = await mount(canvasElement, settled);
      await expect(glOf(el).getParameter(WebGL2RenderingContext.CURRENT_PROGRAM)).toBeNull();
      await waitFor(() => expect(glOf(el).getParameter(WebGL2RenderingContext.CURRENT_PROGRAM)).not.toBeNull());
      await expect(count(el)).toBeGreaterThan(0);

      const root = canvasElement.querySelector<HTMLElement>("[data-host]")!;
      ready = 6;
      const mover = await mount(canvasElement, settled);
      root.append(mover);
      await mover.updateComplete;
      await waitFor(() => expect(count(mover)).toBeGreaterThan(0));
      mover.remove();
      el.remove();

      ready = 1000;
      const paused = await mount(canvasElement, settled);
      await frames(2);
      const own = Object.getOwnPropertyDescriptor(document, "visibilityState");
      Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
      try {
        document.dispatchEvent(new Event("visibilitychange"));
        await frames(3);
        ready = 0;
        await frames(3);
        await expect(glOf(paused).getParameter(WebGL2RenderingContext.CURRENT_PROGRAM)).toBeNull();
      } finally {
        if (own) Object.defineProperty(document, "visibilityState", own);
        else delete (document as { visibilityState?: string }).visibilityState;
      }
      document.dispatchEvent(new Event("visibilitychange"));
      await waitFor(() => expect(glOf(paused).getParameter(WebGL2RenderingContext.CURRENT_PROGRAM)).not.toBeNull());
      paused.remove();

      ready = 1000;
      let doomed: WebGL2RenderingContext | undefined;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => doomed!.getExtension("WEBGL_lose_context")!.loseContext()),
      );
      const dropped = await mount(canvasElement, settled);
      const gl = glOf(dropped);
      doomed = gl;
      await frames(3);
      await expect(gl.isContextLost()).toBe(true);
      await expect(gl.getParameter(WebGL2RenderingContext.CURRENT_PROGRAM)).toBeNull();
      dropped.remove();

      ready = 1;
      links = false;
      const failed = await mount(canvasElement, settled);
      await frames(3);
      await expect(glOf(failed).getParameter(WebGL2RenderingContext.CURRENT_PROGRAM)).toBeNull();
      await expect(errors).toHaveBeenCalled();
      failed.remove();
    } finally {
      proto.getExtension = getExtension;
      proto.getProgramParameter = programParameter;
      errors.mockRestore();
    }
  },
});
