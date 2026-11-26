import { describe, expect, it } from "vite-plus/test";
import { formatDate } from "./project.ts";

describe("formatDate away from UTC", () => {
  it("runs in a fixed non-UTC zone", () => {
    expect(new Date("2026-03-02T00:00:00.000Z").getHours()).toBe(4);
  });

  it("shows only the day for a local midnight that isn't UTC midnight", () => {
    const localMidnight = new Date(2026, 2, 2, 0, 0).toISOString();
    expect(localMidnight).toBe("2026-03-01T20:00:00.000Z");
    expect(formatDate(localMidnight)).toBe("02 Mar 2026");
  });

  it("shows the time for a moment that is midnight in neither zone", () => {
    expect(formatDate(new Date(2026, 2, 2, 14, 30).toISOString())).toBe("02 Mar 2026, 14:30");
  });
});
