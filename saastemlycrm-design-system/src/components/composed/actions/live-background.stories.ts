import preview from "#.storybook/preview";
import { html } from "lit";
import { expect } from "storybook/test";
import { liveBackground } from "./live-background.ts";
import "../../primitives/forms/choice-tile.ts";
import "../../primitives/layout/box.ts";
import "../../primitives/layout/grid.ts";
import type { LiveBackground } from "../../../lib/base/appearance.ts";
import type { UiMagnetLines } from "../../primitives/media/magnet-lines.ts";
import type { UiWaves } from "../../primitives/media/waves.ts";

type LiveArgs = { id?: LiveBackground; preview: boolean };

const meta = preview.type<{ args: LiveArgs }>().meta({
  title: "Composed/Actions/Live background",
  args: { id: "live-waves", preview: false },
  argTypes: {
    id: {
      control: "inline-radio",
      options: [undefined, "live-waves", "live-magnet-lines"],
      description: "The live background to draw; none draws nothing.",
    },
    preview: { control: "boolean", description: "Draws the small, still version used on a picker tile." },
  },
  render: (args) => html`<ui-box height="64" width="full">${liveBackground(args.id, args.preview)}</ui-box>`,
});

const waves = (el: HTMLElement) => el.querySelector<UiWaves>("ui-waves");
const magnets = (el: HTMLElement) => el.querySelector<UiMagnetLines>("ui-magnet-lines");

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Pick a live background and whether it is the tile preview." } } },
  play: async ({ canvasElement }) => {
    const el = waves(canvasElement)!;
    await expect(el).toBeInTheDocument();
    await expect(el.spacing).toBe(28);
    await expect(el.lineWidth).toBe(2.75);
    await expect(el.mouseRadius).toBe(140);
    await expect(el.clickRipple).toBe(true);
    await expect(el.intro).toBe(false);
    await expect(el.querySelector("canvas")).toHaveAttribute("aria-hidden", "true");
    await expect(magnets(canvasElement)).toBeNull();
  },
});

export const WavesPreview = meta.story({
  name: "Waves preview",
  args: { preview: true },
  render: (args) => html`
    <ui-grid cols="2" gap="2">
      <ui-choice-tile label="Waves">${liveBackground(args.id, args.preview)}<!----></ui-choice-tile>
    </ui-grid>
  `,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("button", { name: "Waves" })).toBeVisible();
    const el = waves(canvasElement)!;
    await expect(el.spacing).toBe(9);
    await expect(el.lineWidth).toBe(1);
    await expect(el.mouseRadius).toBe(60);
    await expect(el.clickRipple).toBe(false);
  },
});

export const MagnetLines = meta.story({
  name: "Magnet lines",
  args: { id: "live-magnet-lines" },
  play: async ({ canvasElement }) => {
    const el = magnets(canvasElement)!;
    await expect(el.spacing).toBe(56);
    await expect(el).toHaveAttribute("line-width", "4");
    await expect(el.radius).toBe(340);
    await expect(el.idle).toBe(true);
    await expect(el.clickPulse).toBe(false);
    await expect(el.intro).toBe(true);
    await expect(waves(canvasElement)).toBeNull();
  },
});

export const MagnetLinesPreview = meta.story({
  name: "Magnet lines preview",
  args: { id: "live-magnet-lines", preview: true },
  play: async ({ canvasElement }) => {
    const el = magnets(canvasElement)!;
    await expect(el.spacing).toBe(20);
    await expect(el).toHaveAttribute("line-width", "1.5");
    await expect(el.radius).toBe(120);
    await expect(el.clickPulse).toBe(false);
    await expect(el.intro).toBe(false);
  },
});

export const None = meta.story({
  name: "None",
  args: { id: undefined },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("ui-box")).toBeInTheDocument();
    await expect(waves(canvasElement)).toBeNull();
    await expect(magnets(canvasElement)).toBeNull();
  },
});
