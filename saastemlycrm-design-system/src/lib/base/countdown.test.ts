import { describe, it, expect } from "vite-plus/test";
import { DAY_MS, HOUR_MS, MINUTE_MS, timeLeft } from "./countdown";

const now = 1_700_000_000_000;
const left = (ms: number, from?: number) => timeLeft(now + ms, now, from);

describe("timeLeft before the due time", () => {
  it("shows whole days from three days on", () => {
    expect(left(3 * DAY_MS + 5 * HOUR_MS).text).toBe("3 d left");
  });

  it("shows days with hours under three days", () => {
    expect(left(2 * DAY_MS + 5 * HOUR_MS).text).toBe("2 d 5 h left");
    expect(left(DAY_MS + 30 * MINUTE_MS).text).toBe("1 d left");
  });

  it("shows hours with minutes under a day", () => {
    expect(left(5 * HOUR_MS + 7 * MINUTE_MS).text).toBe("5 h 7 min left");
    expect(left(HOUR_MS + 30_000).text).toBe("1 h left");
  });

  it("shows minutes, then under a minute", () => {
    expect(left(59 * MINUTE_MS + 59_000).text).toBe("59 min left");
    expect(left(MINUTE_MS).text).toBe("1 min left");
    expect(left(59_999).text).toBe("under 1 min left");
    expect(left(1).overdue).toBe(false);
  });

  it("reports due now at exactly zero", () => {
    expect(left(0)).toEqual({ text: "due now", overdue: false, share: 0 });
  });
});

describe("timeLeft share", () => {
  it("is the remaining fraction of the span since the start", () => {
    expect(left(HOUR_MS, now - HOUR_MS).share).toBe(0.5);
    expect(left(HOUR_MS, now - 3 * HOUR_MS).share).toBe(0.25);
  });

  it("is full without a start, and capped when the start is in the future", () => {
    expect(left(HOUR_MS).share).toBe(1);
    expect(left(HOUR_MS, now + HOUR_MS / 2).share).toBe(1);
    expect(left(HOUR_MS, now + 2 * HOUR_MS).share).toBe(1);
  });
});

describe("timeLeft after the due time", () => {
  it("counts overdue days, hours and minutes", () => {
    expect(left(-2 * DAY_MS - HOUR_MS)).toEqual({ text: "overdue 2 d", overdue: true, share: 0 });
    expect(left(-DAY_MS).text).toBe("overdue 1 d");
    expect(left(-3 * HOUR_MS - 1).text).toBe("overdue 3 h");
    expect(left(-HOUR_MS).text).toBe("overdue 1 h");
    expect(left(-4 * MINUTE_MS).text).toBe("overdue 4 min");
  });

  it("is just overdue under a minute", () => {
    expect(left(-1).text).toBe("just overdue");
    expect(left(-MINUTE_MS + 1).text).toBe("just overdue");
  });
});
