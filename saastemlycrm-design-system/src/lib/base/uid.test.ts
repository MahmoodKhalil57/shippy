import { describe, expect, it } from "vite-plus/test";
import { uid } from "./uid.ts";

describe("uid", () => {
  it("returns unique prefixed ids", () => {
    const a = uid();
    const b = uid();
    expect(a).toMatch(/^ui-\d+$/);
    expect(a).not.toBe(b);
    expect(uid("field")).toMatch(/^field-\d+$/);
  });
});
