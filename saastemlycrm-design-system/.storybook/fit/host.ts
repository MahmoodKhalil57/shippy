import { expect } from "storybook/test";
import { vi } from "vite-plus/test";
import { tileCases } from "../../src/lib/dashboard/tiling.ts";
import { BLOCK_KINDS, WIDGET_KINDS } from "../fixtures/widgets.ts";
import { inShard } from "./shards.ts";
import { DIRECTIONS, fitAll, LANES } from "./widgets.ts";

export const HOST_SHARDS = 16;
const KINDS = [...WIDGET_KINDS, ...BLOCK_KINDS];

export const hostFit = (shard: number) => {
  vi.setConfig({ testTimeout: 600_000 });
  return {
    name: `Fits every tile, shard ${shard + 1} of ${HOST_SHARDS}`,
    play: async () => {
      for (const d of KINDS.filter(inShard(HOST_SHARDS, shard))) {
        const report = await fitAll(d);
        const all = tileCases(report.bounds, LANES);
        await expect(report.failures.filter(([, found]) => found.length)).toEqual([]);
        await expect(report.sizes).toEqual(report.wanted);
        await expect(report.spans).toEqual([...new Set(all.map((c) => c.span))]);
        await expect(report.cases).toBe(all.length * DIRECTIONS.length);
      }
    },
  };
};
