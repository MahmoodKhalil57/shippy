export function luminance(r: number, g: number, b: number): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

export interface Luma {
  width: number;
  height: number;
  data: Float32Array;
}

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
  return [r!, g!, b!, a! / 255];
}

export const cssLuminance = (color: string) => {
  const [r, g, b] = rgba(color);
  return luminance(r, g, b);
};
