/**
 * Trend history behind the role dashboards (GET /api/home): weekly and monthly series that a
 * real deployment reads from its reporting tables. Illustrative figures for the demo; today's
 * counts on the dashboards come from the live collections, these only draw the trends.
 */
export const history = {
  weeks: [
    "1 Sep",
    "8 Sep",
    "15 Sep",
    "22 Sep",
    "29 Sep",
    "6 Oct",
    "13 Oct",
    "20 Oct",
    "27 Oct",
    "3 Nov",
    "10 Nov",
    "17 Nov",
  ],
  inquiries: [9, 11, 8, 12, 10, 13, 14, 11, 15, 16, 14, 17],
  quoted: [7, 8, 6, 9, 8, 10, 11, 9, 12, 13, 11, 12],
  won: [2, 3, 2, 4, 3, 3, 5, 3, 4, 6, 4, 3],
  /** Median days from RFQ received to quote sent. */
  turnaround: [3.1, 2.9, 3.0, 2.7, 2.6, 2.4, 2.2, 2.3, 2.0, 1.9, 1.8, 1.6],
  /** Median minutes to acknowledge an RFQ (automation went live 6 Oct). */
  ackMinutes: [175, 160, 190, 150, 140, 22, 12, 8, 6, 5, 4, 4],
  /** Manual touches per RFQ. */
  touches: [36, 35, 37, 34, 33, 24, 19, 16, 14, 12, 11, 10],
  /** RFQs received outside Sun–Thu 08:00–17:00, routed to the on-call person. */
  afterHours: [3, 4, 2, 5, 4, 6, 5, 7, 6, 8, 7, 9],

  months: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
  /** Customer POs incl. partial awards, USD thousands. */
  wonValueK: [38, 42, 35, 51, 58, 61],
  /** Gross profit, EGP thousands: expected at quote time, and actual as costs are billed (Nov in progress). */
  gpExpectedK: [290, 310, 280, 360, 395, 412],
  gpActualK: [270, 301, 262, 344, 371, 268],
  lostReasons: [
    ["Price", 9],
    ["Lead time", 5],
    ["No supplier", 2],
    ["Cancelled", 2],
    ["Late quote", 1],
  ] as [string, number][],

  /** Receivables by age, USD thousands (all customers). */
  ageingKeys: ["Not due", "1–30 d", "31–60 d", "60+ d"],
  ageing: [41.7, 12.6, 3.1, 1.4],
  /** Receivables outstanding at each week's end, USD thousands (the last is the sum of `ageing`). */
  receivablesK: [49.2, 51, 47.8, 52.6, 55.1, 53.4, 56, 54.2, 57.9, 60.3, 61.5, 58.8],
  cashWeeks: ["24 Nov", "1 Dec", "8 Dec", "15 Dec", "22 Dec", "29 Dec", "5 Jan", "12 Jan"],
  /** Expected customer receipts and committed supplier payments, EGP thousands. */
  receiptsK: [180, 240, 150, 310, 220, 260, 190, 280],
  paymentsK: [210, 160, 230, 180, 250, 170, 200, 190],

  /** Cases per waiting state, by week. */
  waitTrend: {
    "Awaiting supplier": [4, 5, 3, 6, 5, 7, 6, 5, 6, 8, 7, 2],
    "Awaiting corrected offer": [1, 0, 1, 2, 1, 1, 2, 0, 1, 1, 2, 1],
    "Awaiting internal approval": [3, 2, 4, 3, 2, 3, 4, 2, 3, 3, 2, 2],
    "Awaiting customer decision": [5, 6, 4, 6, 7, 5, 6, 7, 5, 6, 4, 3],
    "Awaiting delivery or payment": [3, 4, 4, 3, 5, 4, 3, 4, 5, 3, 4, 2],
  } as Record<string, number[]>,
  /** The signed-in owner's median quote turnaround, last 8 weeks. */
  myTurnaround: [2.8, 2.6, 2.7, 2.2, 2.0, 1.7, 1.5, 1.4],

  /* ---------------------------------------------------------------- control room (GET /api/control-room) */
  /** Value of customer POs ÷ value quoted, % by month the RFQ arrived (Nov still open). */
  conversion: [27, 29, 26, 31, 28, 36],
  /** Inquiries to wins over the last 90 days. */
  funnel: [
    ["Inquiries received", 64],
    ["Validated", 58],
    ["Sent to suppliers", 55],
    ["Quoted", 47],
    ["Won (full or partial)", 16],
  ] as [string, number][],
  /** Actual gross margin %, last 90 days, by store (policy minimum 15%). */
  marginByStore: [
    ["Provision stores", 29.4],
    ["Safety stores", 27.3],
    ["Cabin stores", 25.6],
    ["Deck stores", 23.9],
    ["Engine stores", 21.2],
    ["Electrical stores", 19.8],
    ["Spare-parts clearance (fees)", 41.0],
  ] as [string, number][],
  /** Sales by where the goods came from, EGP thousands per month (`months`). */
  sourceKeys: ["Agency pricelist", "Own stock", "Bought to order"],
  sourceByMonth: {
    "Agency pricelist": [62, 70, 58, 81, 92, 99],
    "Own stock": [48, 51, 44, 57, 63, 66],
    "Bought to order": [180, 191, 170, 214, 236, 247],
  } as Record<string, number[]>,
  /** Gross margin %, last 90 days, by source. */
  sourceMargin: [
    ["Agency pricelist", 31.5],
    ["Own stock", 27.8],
    ["Bought to order", 19.4],
  ] as [string, number][],
  /** Receivables by customer and age (`ageingKeys`), USD thousands. */
  ageingByCustomer: [
    ["Nordvik Ship Management", [12.4, 3.1, 0, 0]],
    ["Helios Bulk Carriers", [8.0, 4.2, 0, 0]],
    ["Atlas Tankers", [6.5, 0, 2.1, 1.4]],
    ["Mare Nostrum Shipping", [5.2, 1.8, 0, 0]],
    ["Delta Offshore Services", [9.6, 3.5, 1.0, 0]],
  ] as [string, number[]][],
  /** Deliveries to vessels by outcome, last 6 weeks (the last six `weeks`). */
  deliveryOutcomes: {
    "On time": [8, 7, 9, 7, 9, 6],
    Partial: [1, 2, 1, 2, 1, 2],
    Late: [1, 0, 1, 1, 0, 1],
  } as Record<string, number[]>,
};

/**
 * Inquiries per day for the 12 weeks to today (illustrative, like the series above): each week's
 * inquiries spread over its days by how the week usually runs (the Sun–Thu working week busiest,
 * Friday and Saturday near quiet) with a fixed day-to-day wobble, so the same 84 days come back
 * every time. A day is `{ date, value }`, oldest first.
 */
export function inquiriesDaily(today: Date): { date: string; value: number }[] {
  // Sun … Sat: how much of a week's inquiries a day takes.
  const share = [0.21, 0.21, 0.2, 0.19, 0.15, 0.01, 0.03];
  const wobble = [1, 0.8, 1.25, 0.9, 1.1, 0.7, 1.3, 1.05, 0.85, 1.2, 0.95];
  const DAY = 86_400_000;
  const end = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const weeks = history.weeks.map((w) => Date.parse(`${w} 2026 UTC`));
  return Array.from({ length: 84 }, (_, i) => {
    const t = end - (83 - i) * DAY;
    // The week it falls in (before the first, the first's).
    const k = Math.max(0, weeks.filter((w) => w <= t).length - 1);
    const day = new Date(t).getUTCDay();
    const value = Math.max(0, Math.round(history.inquiries[k]! * share[day]! * wobble[i % wobble.length]!));
    return { date: new Date(t).toISOString().slice(0, 10), value };
  });
}
