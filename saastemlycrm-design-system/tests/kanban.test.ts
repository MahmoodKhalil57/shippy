import { describe, expect, it } from "vite-plus/test";
import { byColumn, columnOf, moved, NONE, valueOf } from "../src/components/base/kanban.ts";

/**
 * The kanban board's arithmetic (src/components/base/kanban.ts), over every case of a finite
 * domain: every board of up to 3 columns, every record value a field can hold (each column's, one
 * the board has no column for, an empty string, null, undefined, a non-string), every list of up
 * to 3 records, and every move of every record to every column.
 */

const BOARDS = [[], ["a"], ["a", "b"], ["a", "b", "c"]];
const VALUES = ["a", "b", "c", "other", "", null, undefined, 3];
type Rec = { id: number; v: unknown };

/** Every list of `n` records over `VALUES`. */
function* lists(n: number): Generator<Rec[]> {
  if (n === 0) return void (yield []);
  for (const rest of lists(n - 1)) for (const v of VALUES) yield [...rest, { id: n, v }];
}
const all = function* () {
  for (const columns of BOARDS) for (let n = 0; n <= 3; n++) for (const recs of lists(n)) yield { columns, recs };
};
const set = (r: Rec, v: string | null): Rec => ({ ...r, v });

describe("the kanban's columns", () => {
  it("put every value in one of the board's columns, or in none", () => {
    for (const columns of BOARDS)
      for (const v of VALUES) {
        const key = columnOf(v, columns);
        expect(key === NONE || columns.includes(key)).toBe(true);
        // A column's own value is in that column; any other value is in none.
        expect(key).toBe(typeof v === "string" && columns.includes(v) ? v : NONE);
      }
  });

  it("hold every record exactly once, in the records' order", () => {
    let boards = 0;
    for (const { columns, recs } of all()) {
      const cols = byColumn(recs, (r) => r.v, columns);
      const ids = cols.flatMap((c) => c.items.map((r) => r.id)).sort((a, b) => a - b);
      expect(ids).toEqual(recs.map((r) => r.id));
      // The board's own columns always show, in order; the none column only when it holds a record.
      expect(cols.slice(0, columns.length).map((c) => c.key)).toEqual(columns);
      expect(cols.length).toBe(columns.length + (recs.some((r) => columnOf(r.v, columns) === NONE) ? 1 : 0));
      for (const c of cols) expect(c.items.map((r) => r.id)).toEqual(c.items.map((r) => r.id).sort((a, b) => a - b));
      boards++;
    }
    expect(boards).toBe(BOARDS.length * (1 + 8 + 64 + 512));
  });
});

describe("moving a card", () => {
  it("puts that record in the column it was dropped on, and changes no other", () => {
    for (const { columns, recs } of all())
      for (const r of recs)
        for (const to of [...columns, NONE]) {
          const after = moved(recs, (x) => x.id === r.id, to, set);
          expect(after.length).toBe(recs.length);
          for (const [i, x] of after.entries()) {
            if (x.id === r.id) expect(columnOf(x.v, columns)).toBe(to);
            else expect(x).toBe(recs[i]);
          }
        }
  });

  it("is undone by the opposite move: the columns are as they were", () => {
    for (const { columns, recs } of all()) {
      const before = byColumn(recs, (r) => r.v, columns).map((c) => [c.key, c.items.map((r) => r.id)]);
      for (const r of recs) {
        const from = columnOf(r.v, columns);
        for (const to of [...columns, NONE]) {
          const there = moved(recs, (x) => x.id === r.id, to, set);
          const back = moved(there, (x) => x.id === r.id, from, set);
          expect(byColumn(back, (x) => x.v, columns).map((c) => [c.key, c.items.map((x) => x.id)])).toEqual(before);
        }
      }
    }
  });

  it("saves no value for the none column", () => {
    expect(valueOf(NONE)).toBeNull();
    for (const c of ["a", "b", "c"]) expect(valueOf(c)).toBe(c);
  });
});
