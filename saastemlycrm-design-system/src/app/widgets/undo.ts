import type { Action, UndoCall } from "./schema.ts";

export interface ActionReply {
  message?: unknown;
  href?: unknown;
  undo?: unknown;
}

const isCall = (u: unknown): u is UndoCall =>
  !!u &&
  typeof u === "object" &&
  typeof (u as UndoCall).path === "string" &&
  (u as UndoCall).path.startsWith("/") &&
  ((u as UndoCall).body === undefined || (typeof (u as UndoCall).body === "object" && (u as UndoCall).body !== null));

export function undoOf(reply: unknown, action: Pick<Action, "undo">): UndoCall | undefined {
  const said = reply && typeof reply === "object" && "undo" in reply ? (reply as ActionReply).undo : undefined;
  if (said === null) return undefined;
  return isCall(said) ? said : action.undo;
}

export function doneText(reply: unknown, action: Pick<Action, "done" | "reply" | "label">, undo: boolean): string {
  const m = reply && typeof reply === "object" ? (reply as ActionReply).message : undefined;
  const said = typeof m === "string" ? m : "";
  return action.done || (action.reply ? said : "") || (undo ? said || action.label : "");
}
