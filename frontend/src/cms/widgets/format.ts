/** Formats the project's widgets share. */

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const dayFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

/** A date as the dashboard shows it: a date at midnight shows as just the day. */
export const formatDate = (v?: unknown) => {
  if (typeof v !== "string" || !v) return "";
  const d = new Date(v);
  return d.getHours() === 0 && d.getMinutes() === 0 ? dayFmt.format(d) : dateFmt.format(d);
};
