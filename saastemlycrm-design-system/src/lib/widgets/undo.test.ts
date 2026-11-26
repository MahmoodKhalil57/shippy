import { describe, expect, it } from "vite-plus/test";
import { doneText, undoOf } from "./undo.ts";

describe("undo", () => {
  const undo = { path: "/undo", body: { id: 1 } };

  it("takes the reply's undo, falls back on the action's, and honours null", () => {
    expect(undoOf({ undo: { path: "/back" } }, { undo })).toEqual({ path: "/back" });
    expect(undoOf({ undo: { path: "/back", body: { a: 1 } } }, {})).toEqual({ path: "/back", body: { a: 1 } });
    expect(undoOf({ undo: null }, { undo })).toBeUndefined();
    for (const bad of [{ path: "back" }, { path: 3 }, { path: "/x", body: null }, { path: "/x", body: "y" }, "x"])
      expect(undoOf({ undo: bad }, { undo })).toBe(undo);
    expect(undoOf(null, { undo })).toBe(undo);
    expect(undoOf("done", {})).toBeUndefined();
    expect(undoOf({}, {})).toBeUndefined();
  });

  it("says what was done", () => {
    expect(doneText({ message: "Sent" }, { label: "Send", done: "All sent" }, false)).toBe("All sent");
    expect(doneText({ message: "Sent" }, { label: "Send", reply: true }, false)).toBe("Sent");
    expect(doneText({ message: 3 }, { label: "Send", reply: true }, true)).toBe("Send");
    expect(doneText({ message: "Sent" }, { label: "Send" }, true)).toBe("Sent");
    expect(doneText(null, { label: "Send" }, false)).toBe("");
  });
});
