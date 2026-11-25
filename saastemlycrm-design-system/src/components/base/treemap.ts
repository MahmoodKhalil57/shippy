export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const worst = (areas: number[], side: number): number => {
  const s = areas.reduce((t, a) => t + a, 0);
  const s2 = s * s;
  const side2 = side * side;
  return Math.max(...areas.map((a) => Math.max((side2 * a) / s2, s2 / (side2 * a))));
};

export function squarify(values: number[], width: number, height: number): Rect[] {
  const out: Rect[] = values.map(() => ({ x: 0, y: 0, w: 0, h: 0 }));
  const total = values.reduce((t, v) => t + (v > 0 ? v : 0), 0);
  if (total <= 0 || width <= 0 || height <= 0) return out;
  const scale = (width * height) / total;
  const order = values
    .map((v, i) => [v, i] as const)
    .filter(([v]) => v > 0)
    .sort((a, b) => b[0] - a[0] || a[1] - b[1])
    .map(([, i]) => i);
  const area = (i: number) => values[i]! * scale;
  let x = 0;
  let y = 0;
  let w = width;
  let h = height;
  let at = 0;
  while (at < order.length) {
    const side = Math.min(w, h);
    const strip = [order[at]!];
    let areas = [area(order[at]!)];
    let next = at + 1;
    while (next < order.length) {
      const tried = [...areas, area(order[next]!)];
      if (worst(tried, side) > worst(areas, side)) break;
      strip.push(order[next]!);
      areas = tried;
      next++;
    }
    const last = next >= order.length;
    const sum = areas.reduce((t, a) => t + a, 0);
    const across = w >= h;
    const thick = last ? (across ? w : h) : sum / side;
    let along = across ? y : x;
    const end = across ? y + h : x + w;
    strip.forEach((i, k) => {
      const len = k === strip.length - 1 ? end - along : (areas[k]! / sum) * side;
      out[i] = across ? { x, y: along, w: thick, h: len } : { x: along, y, w: len, h: thick };
      along += len;
    });
    if (across) {
      x += thick;
      w -= thick;
    } else {
      y += thick;
      h -= thick;
    }
    at = next;
  }
  return out;
}
