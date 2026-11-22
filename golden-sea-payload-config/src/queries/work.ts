/** The work collections' shared `where`s (../pages/home.ts, ../pages/aside.ts). */

/** Follow-ups, reminders and calls still to do. */
export const openTasks = { status: { equals: "Open" } };
/** Of those, the ones due by the end of today (overdue ones included). */
export const dueToday = { ...openTasks, due: { less_than: "$today+1d" } };
/** New messages and uncertain matches to check. */
export const toTriage = { status: { in: ["New", "Needs review"] } };
