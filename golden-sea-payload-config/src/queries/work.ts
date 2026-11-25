export const openTasks = { status: { equals: "Open" } };
export const dueToday = { ...openTasks, due: { less_than: "$today+1d" } };
export const toTriage = { status: { in: ["New", "Needs review"] } };
