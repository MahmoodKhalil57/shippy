import { fieldContractProblems } from "saastemlycrm-design-system/testing";
import { describe, expect, it } from "vite-plus/test";
import { config, seeds } from "./backend.ts";

/**
 * Every field owes the person filling it in a hint (short, the longer story in `custom.about`) and,
 * when typed or picked into, a placeholder; every seed document passes its collection's schema
 * (`zodOf`, derived from the fields), and so do mock documents drawn by faker from those schemas
 * (the design system's `fieldContractProblems`). Each line names the collection and field path.
 */

describe("fields", () => {
  it("every field has a hint and a placeholder, and the seeds and mocks fit the schemas", () => {
    const problems = fieldContractProblems({ config: config as never, seeds: seeds.collections as never, mocks: 20 });
    expect(problems.map((p) => `${p.at}: ${p.problem}`)).toEqual([]);
  });
});
