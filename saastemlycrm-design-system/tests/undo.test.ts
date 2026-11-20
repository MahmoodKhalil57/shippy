import { describe, expect, it } from "vite-plus/test";
import type { Action, UndoCall } from "../src/app/widgets/schema.ts";
import { doneText, undoOf } from "../src/app/widgets/undo.ts";

/**
 * Undo in the action contract (src/app/widgets/schema.ts `Reversal`, src/app/widgets/undo.ts).
 * The rules are small and total, so they're checked over every case rather than sampled:
 * every kind of thing a reply can say about undo, against an action with and without its own.
 */

const mine: UndoCall = { path: "/things/1/restore", body: { value: "before" } };
const servers: UndoCall = { path: "/things/1/withdraw", body: {} };

/** Every kind of `undo` a reply can carry: [what it is, the value, what it means]. */
const SAID: [string, unknown, "call" | "none" | "silent"][] = [
  ["a call", servers, "call"],
  ["a call without a body", { path: "/things/1/withdraw" }, "call"],
  ["null", null, "none"],
  ["undefined", undefined, "silent"],
  ["a string", "/things/1/withdraw", "silent"],
  ["a number", 1, "silent"],
  ["true", true, "silent"],
  ["an empty object", {}, "silent"],
  ["an array", [servers], "silent"],
  ["a path that isn't text", { path: 7 }, "silent"],
  ["a path outside the API", { path: "https://elsewhere.example/x" }, "silent"],
  ["a body that isn't an object", { path: "/things/1/withdraw", body: "x" }, "silent"],
  ["a null body", { path: "/things/1/withdraw", body: null }, "silent"],
];
const ACTIONS: [string, Pick<Action, "undo">][] = [
  ["declares none", {}],
  ["declares its own", { undo: mine }],
];

describe("which call takes an action back", () => {
  for (const [what, said, means] of SAID)
    for (const [has, action] of ACTIONS)
      it(`reply says ${what}, action ${has}`, () => {
        const got = undoOf({ ok: true, undo: said }, action);
        if (means === "call") expect(got).toBe(said);
        else if (means === "none") expect(got).toBeUndefined();
        else expect(got).toBe(action.undo);
      });

  // A reply that isn't an object, or has no `undo` key, says nothing: the action's own applies.
  for (const reply of [null, undefined, "", "ok", 0, [], {}, { message: "Saved" }])
    for (const [has, action] of ACTIONS)
      it(`reply ${JSON.stringify(reply) ?? "undefined"}, action ${has}`, () => {
        expect(undoOf(reply, action)).toBe(action.undo);
      });
});

describe("what the snackbar says", () => {
  const label = "Approve";
  for (const done of [undefined, "Approved"])
    for (const reply of [false, true])
      for (const message of [undefined, "Approved: quote 12", 5])
        for (const undo of [false, true])
          it(`done ${done ?? "—"}, reply ${reply}, message ${String(message)}, undo ${undo}`, () => {
            const text = doneText({ message }, { done, reply, label }, undo);
            const said = typeof message === "string" ? message : "";
            // Its own words first; else the endpoint's, when the action lets it answer.
            if (done) expect(text).toBe(done);
            else if (reply && said) expect(text).toBe(said);
            // Something that can be undone is always named: Undo never stands alone.
            else if (undo) expect(text).toBe(said || label);
            else expect(text).toBe("");
            if (undo) expect(text).not.toBe("");
          });
});

describe("an action asks first or can be undone, never both", () => {
  it("is refused by the type", () => {
    const call = { path: "/things/1/archive" };
    const undoable: Action = { label: "Archive", call, undo: mine };
    const asked: Action = { label: "Send", call, confirm: { heading: "Send it?", label: "Send" } };
    // A form (fields) isn't a confirmation: it may be undone.
    const form: Action = { label: "Return", call, fields: [{ type: "textarea", name: "reason" }], undo: mine };
    // @ts-expect-error an action that declares `undo` can't also `confirm`
    const both: Action = { label: "Send", call, confirm: { heading: "Send it?", label: "Send" }, undo: mine };
    expect([undoable, asked, form, both]).toHaveLength(4);
  });
});
