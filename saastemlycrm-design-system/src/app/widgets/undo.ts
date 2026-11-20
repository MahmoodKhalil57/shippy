import type { Action, UndoCall } from "./schema.ts";

/**
 * Undo as part of the action contract (./schema.ts `Reversal`): which call, if any, takes a
 * finished action back. Pure, so the rule is checked over every case (tests/undo.test.ts).
 */

/** What an endpoint may answer an action with (all optional; anything else in the reply is its data). */
export interface ActionReply {
  /** What happened, for the snackbar (shown when the action has `reply` and no `done`). */
  message?: unknown;
  /** Where to go next (with `reply`). */
  href?: unknown;
  /** The call that takes it back, or `null`: it can't be taken back (any more). */
  undo?: unknown;
}

const isCall = (u: unknown): u is UndoCall =>
  !!u &&
  typeof u === "object" &&
  typeof (u as UndoCall).path === "string" &&
  (u as UndoCall).path.startsWith("/") &&
  ((u as UndoCall).body === undefined || (typeof (u as UndoCall).body === "object" && (u as UndoCall).body !== null));

/**
 * The way back from an action, given what its endpoint answered. The server's word wins, because
 * it knows whether the thing can still be taken back: a reply's `undo` call is the one offered,
 * and a reply's `undo: null` means none, even when the action declares one. Only when the reply
 * says nothing about undo (or something that isn't a call) does the action's own `undo` apply.
 */
export function undoOf(reply: unknown, action: Pick<Action, "undo">): UndoCall | undefined {
  const said = reply && typeof reply === "object" && "undo" in reply ? (reply as ActionReply).undo : undefined;
  if (said === null) return undefined;
  return isCall(said) ? said : action.undo;
}

/** What the snackbar says after an action: its `done`, else (with `reply`) the endpoint's `message`. */
export function doneText(reply: unknown, action: Pick<Action, "done" | "reply" | "label">, undo: boolean): string {
  const m = reply && typeof reply === "object" ? (reply as ActionReply).message : undefined;
  const said = typeof m === "string" ? m : "";
  // Something that can be undone is always named, so Undo never stands alone.
  return action.done || (action.reply ? said : "") || (undo ? said || action.label : "");
}
