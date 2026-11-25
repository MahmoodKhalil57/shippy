export type Where = Record<string, unknown>;

export const LIVE: Where = { stage: { not_in: ["Lost", "Expired", "Closed — settled"] } };
export const mine = (w: Where): Where => ({ and: [{ owner: { equals: "$user.id" } }, w] });
export const BY_RISK = "riskRank,-urgent,deadline";
