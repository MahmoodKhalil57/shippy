/**
 * The cases' shared `where`s and order (../pages/home.ts, ../pages/aside.ts, ../pages/control-room.ts).
 * `$user.id` is the signed-in user.
 */

export type Where = Record<string, unknown>;

/** Every case not yet settled, lost or expired. */
export const LIVE: Where = { stage: { not_in: ["Lost", "Expired", "Closed — settled"] } };
/** The signed-in user's own (owned by them). */
export const mine = (w: Where): Where => ({ and: [{ owner: { equals: "$user.id" } }, w] });
/** A queue's order: the worst risk first (the stored `riskRank`), urgent first, then the soonest deadline. */
export const BY_RISK = "riskRank,-urgent,deadline";
