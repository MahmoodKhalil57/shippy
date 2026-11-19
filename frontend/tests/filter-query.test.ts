import { describe, expect, it } from "vite-plus/test";
import { filterComplete, filterWhere, type FilterField } from "../src/components/base/filter-query.ts";

/** The filter builder's conditions as Payload `where` queries. */
const fields: FilterField[] = [
  { name: "stage", label: "Stage", type: "select", options: [{ label: "Won", value: "won" }] },
  { name: "value", label: "Value", type: "number" },
  { name: "deadline", label: "Deadline", type: "date" },
  { name: "caseId", label: "Case", type: "text" },
  { name: "urgent", label: "Urgent", type: "boolean" },
];

describe("filterWhere", () => {
  it("makes one condition a plain where, several an and / or", () => {
    expect(filterWhere([{ field: "caseId", operator: "like", value: "0142" }], "and", fields)).toEqual({
      caseId: { like: "0142" },
    });
    expect(
      filterWhere(
        [
          { field: "stage", operator: "in", value: ["won"] },
          { field: "urgent", operator: "equals", value: true },
        ],
        "or",
        fields,
      ),
    ).toEqual({ or: [{ stage: { in: ["won"] } }, { urgent: { equals: true } }] });
  });

  it("types values: numbers as numbers, dates as whole days", () => {
    expect(filterWhere([{ field: "value", operator: "greater_than", value: "9000" }], "and", fields)).toEqual({
      value: { greater_than: 9000 },
    });
    const after = filterWhere(
      [{ field: "deadline", operator: "greater_than", value: "2026-11-12" }],
      "and",
      fields,
    ) as {
      deadline: { greater_than: string };
    };
    expect(new Date(after.deadline.greater_than).getDate()).toBe(12); // the end of that day, local time
    expect(new Date(after.deadline.greater_than).getHours()).toBe(23);
  });

  it("leaves out conditions with nothing to filter by", () => {
    expect(filterComplete({ field: "stage", operator: "in", value: [] })).toBe(false);
    expect(filterComplete({ field: "caseId", operator: "exists", value: false })).toBe(true);
    expect(filterWhere([{ field: "caseId", operator: "like", value: " " }], "and", fields)).toBeUndefined();
  });
});
