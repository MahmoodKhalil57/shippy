import { expect } from "storybook/test";

export const inShard = (count: number, index: number) => (_: unknown, i: number) => i % count === index;

export const shardFiles = (stem: string, count: number) =>
  Array.from({ length: count }, (_, i) => `./${stem}.${i + 1}.stories.ts`).sort();

export const shardGuard = (others: Record<string, unknown>, stem: string, count: number) => ({
  name: "The shards cover every case",
  play: async () => {
    await expect([`./${stem}.1.stories.ts`, ...Object.keys(others)].sort()).toEqual(shardFiles(stem, count));
  },
});
