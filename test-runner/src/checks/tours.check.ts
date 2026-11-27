/// <reference path="../virtual.d.ts" />
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { tours } from "virtual:test-runner/project";
import { compileTours, readTour } from "../tours/compile.ts";
import { places } from "../tours/places.ts";

const json = (value: unknown) => JSON.stringify(value, null, 2) + "\n";

describe.runIf(tours)("The tours", () => {
  const where = tours!;
  const files = readdirSync(where.features)
    .filter((f) => f.endsWith(".feature"))
    .sort();
  const read = files.map((f) =>
    readTour(f.replace(/^\d+-|\.feature$/g, ""), readFileSync(path.join(where.features, f), "utf8"), places),
  );
  const ar = JSON.parse(readFileSync(path.join(where.messages, "ar.json"), "utf8")) as Record<string, string>;
  const compiled = compileTours(read, ar);

  it("keep their English text in the message catalog", async () => {
    await expect(json(compiled.en)).toMatchFileSnapshot(path.join(where.messages, "en.json"));
  });

  it("have every text in Arabic", () => {
    expect(compiled.missing).toEqual([]);
  });

  it("are what the dashboard plays", async () => {
    await expect(json(compiled.docs)).toMatchFileSnapshot(where.seed);
  });
});
