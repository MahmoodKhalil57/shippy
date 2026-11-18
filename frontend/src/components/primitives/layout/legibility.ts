/**
 * Legible chrome over any background image.
 *
 * A wash of one colour can't guarantee contrast: a photo can be bright sky at the top and dark
 * sea at the bottom. So for each region the app shell draws text in (header, side columns), we
 * look at the image pixels actually behind it, choose light or dark ink — whichever needs less
 * help — and add the least scrim (a tint behind the region) that keeps even the brightest (or
 * darkest) 10% of those pixels at the target contrast ratio (WCAG relative luminance).
 *
 * Pure functions; `app-shell` feeds them the image (`lumaOf`) and its regions' rectangles.
 */

/** Relative luminance (WCAG) of one 0–255 sRGB channel triple. */
export function luminance(r: number, g: number, b: number): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG contrast ratio between two relative luminances. */
export const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/** An image as a small grid of luminances. */
export interface Luma {
  width: number;
  height: number;
  data: Float32Array;
}

/** Downscale an image (≤ `size` px on its long side) and read its luminances. */
export function lumaOf(image: HTMLImageElement, size = 128): Luma {
  const k = Math.min(1, size / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * k));
  const height = Math.max(1, Math.round(image.naturalHeight * k));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(image, 0, 0, width, height);
  const px = ctx.getImageData(0, 0, width, height).data;
  const data = new Float32Array(width * height);
  for (let i = 0; i < data.length; i++) data[i] = luminance(px[i * 4]!, px[i * 4 + 1]!, px[i * 4 + 2]!);
  return { width, height, data };
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Luminances behind `rect`, for an image drawn `background-size: cover; background-position:
 * center` over `frame` (both in the same coordinates). Samples a grid of up to `steps`² points.
 */
export function sampleBehind(luma: Luma, frame: Rect, rect: Rect, steps = 20): number[] {
  const scale = Math.max(frame.width / luma.width, frame.height / luma.height);
  const ox = frame.x + (frame.width - luma.width * scale) / 2;
  const oy = frame.y + (frame.height - luma.height * scale) / 2;
  const out: number[] = [];
  for (let j = 0; j < steps; j++) {
    for (let i = 0; i < steps; i++) {
      const x = rect.x + ((i + 0.5) / steps) * rect.width;
      const y = rect.y + ((j + 0.5) / steps) * rect.height;
      const u = Math.min(luma.width - 1, Math.max(0, Math.floor((x - ox) / scale)));
      const v = Math.min(luma.height - 1, Math.max(0, Math.floor((y - oy) / scale)));
      out.push(luma.data[v * luma.width + u]!);
    }
  }
  return out;
}

/**
 * How strong a scrim (of luminance `scrimL`) over the image must be for text of luminance `inkL`
 * to reach `target` contrast — judged on the 90th percentile of the pixels when the ink is the
 * lighter one (the brightest pixels are the risk), the 10th when it's the darker one — between
 * `floor` (a hint of the surface, so the frame reads as one) and `cap`.
 */
export function scrimFor(
  samples: number[],
  inkL: number,
  scrimL: number,
  target = 5,
  floor = 0.12,
  cap = 0.94,
  percentile = 0.9,
): number {
  const sorted = [...samples].sort((a, b) => a - b);
  const at = (p: number) => sorted[Math.min(sorted.length - 1, Math.max(0, Math.round(p * (sorted.length - 1))))] ?? 0;
  let alpha = 0;
  if (inkL >= scrimL) {
    // Light ink: the backdrop may be at most this bright.
    const max = (inkL + 0.05) / target - 0.05;
    const worst = at(percentile);
    if (worst > max) alpha = (worst - max) / (worst - scrimL);
  } else {
    // Dark ink: the backdrop must be at least this bright.
    const min = target * (inkL + 0.05) - 0.05;
    const worst = at(1 - percentile);
    if (worst < min) alpha = (min - worst) / (scrimL - worst);
  }
  return Math.min(cap, Math.max(floor, alpha));
}

/** Any CSS colour (oklch, color-mix…) as sRGB 0–255 + alpha 0–1, via a canvas. */
let paint: CanvasRenderingContext2D | null = null;
export function rgba(color: string): [number, number, number, number] {
  paint ??= Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", {
    willReadFrequently: true,
  });
  if (!paint) return [0, 0, 0, 0];
  paint.clearRect(0, 0, 1, 1);
  paint.fillStyle = "#000";
  paint.fillStyle = color;
  paint.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = paint.getImageData(0, 0, 1, 1).data;
  // getImageData returns un-premultiplied channels.
  return [r!, g!, b!, a! / 255];
}

/** Relative luminance of a CSS colour (its alpha ignored). */
export const cssLuminance = (color: string) => {
  const [r, g, b] = rgba(color);
  return luminance(r, g, b);
};
