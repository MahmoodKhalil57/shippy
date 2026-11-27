import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import {
  APIError,
  clone,
  forbidden,
  isObject,
  notFound,
  objectId,
  plural,
  singular,
  text,
  unauthorized,
} from "./index.ts";

afterEach(() => vi.restoreAllMocks());

describe("APIError", () => {
  it("defaults to a 400 named APIError without data", () => {
    const e = new APIError("Bad input");
    expect(e).toBeInstanceOf(Error);
    expect([e.message, e.status, e.data, e.name]).toEqual(["Bad input", 400, undefined, "APIError"]);
  });

  it("keeps the status, data and name it is given", () => {
    const e = new APIError("Conflict", 409, { field: "email" }, "ConflictError");
    expect([e.message, e.status, e.data, e.name]).toEqual(["Conflict", 409, { field: "email" }, "ConflictError"]);
  });

  it("builds the not found, forbidden and unauthorized errors Payload sends", () => {
    expect([notFound().status, notFound().name, notFound().message]).toEqual([404, "NotFound", "Not Found"]);
    expect([forbidden().status, forbidden().name, forbidden().message]).toEqual([
      403,
      "Forbidden",
      "You are not allowed to perform this action.",
    ]);
    expect([unauthorized().status, unauthorized().name, unauthorized().message]).toEqual([
      401,
      "UnauthorizedError",
      "Unauthorized, you must be logged in to make this request.",
    ]);
  });
});

describe("objectId", () => {
  it("starts with the second it was made in, padded to eight hex digits, and ends with 16 random hex digits", () => {
    vi.spyOn(Date, "now").mockReturnValue(1_700_000_000_000);
    vi.spyOn(crypto, "getRandomValues").mockImplementation((a) => {
      new Uint8Array(a.buffer, a.byteOffset, a.byteLength).set([0, 1, 15, 16, 127, 128, 254, 255]);
      return a;
    });
    expect(objectId()).toBe("6553f100" + "00010f107f80feff");
    vi.mocked(Date.now).mockReturnValue(16_000);
    expect(objectId()).toBe("00000010" + "00010f107f80feff");
  });

  it("makes a 24 character hex id from real randomness", () => {
    expect(objectId()).toMatch(/^[0-9a-f]{24}$/);
  });
});

describe("isObject", () => {
  it("accepts plain objects and rejects null, arrays, blobs, files and primitives", () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
    expect(isObject(null)).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject(new Blob(["x"]))).toBe(false);
    expect(isObject(new File(["x"], "a.txt"))).toBe(false);
    expect(isObject("text")).toBe(false);
    expect(isObject(3)).toBe(false);
    expect(isObject(undefined)).toBe(false);
  });
});

describe("clone", () => {
  it("copies deeply", () => {
    const source = { a: { b: [1, 2] }, d: new Date(0) };
    const copy = clone(source);
    expect(copy).toEqual(source);
    expect(copy.a).not.toBe(source.a);
    expect(copy.a.b).not.toBe(source.a.b);
  });
});

describe("singular", () => {
  it("uses the label when it is text", () => {
    expect(singular("people", { singular: "Person" })).toBe("Person");
  });

  it("derives a word from the slug otherwise", () => {
    expect(singular("companies")).toBe("Company");
    expect(singular("addresses")).toBe("Addresse");
    expect(singular("business")).toBe("Business");
    expect(singular("invoices")).toBe("Invoice");
    expect(singular("line-items")).toBe("Line item");
    expect(singular("tax_rates")).toBe("Tax rate");
    expect(singular("staff")).toBe("Staff");
    expect(singular("orders", { singular: { en: "Order" } })).toBe("Order");
    expect(singular("orders", {})).toBe("Order");
  });
});

describe("plural", () => {
  it("uses the label when it is text and the spaced, capitalised slug otherwise", () => {
    expect(plural("people", { plural: "People" })).toBe("People");
    expect(plural("line_items")).toBe("Line items");
    expect(plural("tax-rates", { plural: { en: "Tax rates" } })).toBe("Tax rates");
    expect(plural("")).toBe("");
  });
});

describe("text", () => {
  it("turns every kind of value into text", () => {
    expect(text("abc")).toBe("abc");
    expect(text(12.5)).toBe("12.5");
    expect(text(true)).toBe("true");
    expect(text(false)).toBe("false");
    expect(text(10n)).toBe("10");
    expect(text(null)).toBe("");
    expect(text(undefined)).toBe("");
    expect(text({ a: [1] })).toBe('{"a":[1]}');
  });
});
