export interface Box {
  lane: number;
  row: number;
  span: number;
  rows: number;
}
export type Edge = "start" | "end" | "top" | "bottom";
export type Spot = { lane: number; row: number };

const overlaps = (a: Box, b: Box) =>
  a.row < b.row + b.rows && a.row + a.rows > b.row && a.lane < b.lane + b.span && a.lane + a.span > b.lane;

export function settle(boxes: Map<string, Box>, movers: string[], fixed: ReadonlySet<string>) {
  const still = new Set<string>();
  const queue = [...movers];
  const blocker = (key: string, m: Box) =>
    [...boxes].find(([k, o]) => k !== key && (fixed.has(k) || still.has(k)) && overlaps(o, m))?.[1];
  while (queue.length) {
    const key = queue.shift()!;
    let m = boxes.get(key)!;
    for (let hit = blocker(key, m); hit; hit = blocker(key, m)) m = { ...m, row: hit.row + hit.rows };
    boxes.set(key, m);
    for (const [k, o] of boxes) {
      if (k === key || fixed.has(k) || still.has(k) || !overlaps(o, m)) continue;
      boxes.set(k, { ...o, row: m.row + m.rows });
      queue.push(k);
    }
    still.add(key);
  }
}

function makeRoom(boxes: Map<string, Box>, mover: string, at: number, lanes: number, fixed: ReadonlySet<string>) {
  const moved = new Set<string>();
  const wrapped: string[] = [];
  const way = new Map<string, "back" | "on" | "off">();
  const queue = [mover];
  while (queue.length) {
    const key = queue.shift()!;
    if (way.get(key) === "off") continue;
    const m = boxes.get(key)!;
    for (const [k, o] of [...boxes].sort(([, a], [, b]) => a.lane - b.lane)) {
      if (k === key || k === mover || fixed.has(k) || way.get(k) === "off" || !overlaps(o, m)) continue;
      const go = way.get(k) ?? (key === mover ? (o.lane < at ? "back" : "on") : (way.get(key) as "back" | "on"));
      const lane = go === "back" ? m.lane - o.span : m.lane + m.span;
      if (go === "back" && lane < 0) continue;
      if (go === "on" && lane + o.span > lanes) {
        way.set(k, "off");
        wrapped.push(k);
        continue;
      }
      way.set(k, go);
      boxes.set(k, { ...o, lane });
      moved.add(k);
      queue.push(k);
    }
  }
  if (wrapped.length) {
    const row = Math.max(
      ...[mover, ...moved].filter((k) => !wrapped.includes(k)).map((k) => boxes.get(k)!.row + boxes.get(k)!.rows),
    );
    let next = 0;
    for (const k of wrapped) {
      const b = boxes.get(k)!;
      boxes.set(k, { ...b, lane: Math.min(next, lanes - b.span), row });
      next += b.span;
      moved.add(k);
    }
  }
  return [...moved];
}

export function insert(
  places: ReadonlyMap<string, Box>,
  mover: string,
  target: string,
  edge: Edge,
  lanes: number,
  near: number,
  fixed: ReadonlySet<string>,
): Map<string, Spot> {
  const boxes = new Map([...places].map(([k, b]) => [k, { ...b }]));
  const me = boxes.get(mover)!;
  const them = boxes.get(target)!;
  boxes.delete(mover);
  const moved: string[] = [];
  if (edge === "start" || edge === "end") {
    const at = edge === "start" ? them.lane : them.lane + them.span;
    const row = them.row;
    const band: Box = { lane: 0, row, span: lanes, rows: me.rows };
    const line = [...boxes].filter(([, b]) => overlaps(b, band));
    const before = line.filter(([, b]) => b.lane < at).sort(([, a], [, b]) => b.lane - a.lane);
    let room = 0;
    if (edge === "end") {
      let limit = at;
      for (const [k, b] of before) {
        if (fixed.has(k)) {
          room += limit - (b.lane + b.span);
          limit = -1;
          break;
        }
        room += limit - (b.lane + b.span);
        limit = b.lane;
      }
      if (limit >= 0) room += limit;
    }
    const back = Math.min(me.span, Math.max(0, room));
    const lane = Math.max(0, Math.min(lanes - me.span, at - back));
    boxes.set(mover, { ...me, lane, row });
    moved.push(...makeRoom(boxes, mover, at, lanes, fixed));
  } else {
    const lane = Math.max(0, Math.min(lanes - me.span, near));
    const at = edge === "top" ? them.row : them.row + them.rows;
    const column = [...boxes]
      .filter(([, b]) => b.lane < lane + me.span && b.lane + b.span > lane && b.row + b.rows <= at)
      .sort(([, a], [, b]) => b.row + b.rows - (a.row + a.rows));
    let room = 0;
    if (edge === "bottom") {
      const wall = Math.max(0, ...column.filter(([k]) => fixed.has(k)).map(([, b]) => b.row + b.rows));
      const covered = new Set<number>();
      for (const [k, b] of column)
        if (!fixed.has(k) && b.row >= wall) for (let r = b.row; r < b.row + b.rows; r++) covered.add(r);
      room = at - wall - covered.size;
    }
    const up = Math.min(me.rows, Math.max(0, room));
    const row = at - up;
    boxes.set(mover, { ...me, lane, row });
    if (up) {
      let limit = row;
      for (const [k, b] of column) {
        if (fixed.has(k)) break;
        if (b.row + b.rows > limit) {
          boxes.set(k, { ...b, row: limit - b.rows });
          moved.push(k);
        }
        limit = Math.min(limit, boxes.get(k)!.row);
      }
    }
  }
  settle(boxes, [mover, ...moved], fixed);
  return new Map([...boxes].map(([k, b]) => [k, { lane: b.lane, row: b.row }]));
}

export function putAt(
  places: ReadonlyMap<string, Box>,
  mover: string,
  spot: Spot,
  lanes: number,
  fixed: ReadonlySet<string>,
) {
  const boxes = new Map([...places].map(([k, b]) => [k, { ...b }]));
  boxes.set(mover, { ...boxes.get(mover)!, ...spot });
  const moved = makeRoom(boxes, mover, spot.lane, lanes, fixed);
  settle(boxes, [mover, ...moved], fixed);
  return new Map([...boxes].map(([k, b]) => [k, { lane: b.lane, row: b.row }]));
}

export function compact(places: ReadonlyMap<string, Box>, fixed: ReadonlySet<string>): Map<string, Spot> {
  const order = [...places].sort(([, a], [, b]) => a.row - b.row || a.lane - b.lane);
  const done: Box[] = [];
  const out = new Map<string, Spot>();
  for (const [k, b] of order) {
    let row = b.row;
    if (!fixed.has(k)) while (row > 0 && !done.some((d) => overlaps(d, { ...b, row: row - 1 }))) row--;
    done.push({ ...b, row });
    out.set(k, { lane: b.lane, row });
  }
  return out;
}
