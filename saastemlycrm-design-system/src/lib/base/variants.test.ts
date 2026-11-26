import { describe, it, expect } from "vite-plus/test";
import { BREAKPOINTS, booleanAttribute, isOn, parseResponsive, rcva, responsiveBoolean } from "./variants";

const sizes = { sm: "btn-sm", md: "btn-md", lg: "btn-lg" };
const flag = { true: "btn-block", false: "" };

describe("parseResponsive", () => {
  it("returns null for a plain option value", () => {
    expect(parseResponsive("md", sizes)).toBeNull();
  });

  it("splits a base value from breakpoint-prefixed values", () => {
    expect(parseResponsive("sm md:lg xl:sm", sizes)).toEqual({
      base: "sm",
      at: [
        ["md", "lg"],
        ["xl", "sm"],
      ],
    });
    expect(parseResponsive("  max-md:sm  ", sizes)).toEqual({ base: undefined, at: [["max-md", "sm"]] });
  });

  it("treats unknown prefixes and leading colons as a base value", () => {
    expect(parseResponsive("hover:lg", sizes)).toEqual({ base: "hover:lg", at: [] });
    expect(parseResponsive(":lg", sizes)).toEqual({ base: ":lg", at: [] });
  });

  it("reads bare breakpoints and words as booleans for boolean variants", () => {
    expect(parseResponsive("md", flag)).toEqual({ base: undefined, at: [["md", "true"]] });
    expect(parseResponsive("false lg:true", flag)).toEqual({ base: false, at: [["lg", "true"]] });
    expect(parseResponsive("yes", { false: "" })).toEqual({ base: true, at: [] });
  });

  it("knows every breakpoint", () => {
    for (const bp of BREAKPOINTS) expect(parseResponsive(`${bp}:lg`, sizes)!.at).toEqual([[bp, "lg"]]);
  });
});

describe("rcva", () => {
  const button = rcva("btn", {
    variants: { size: { sm: "btn-sm", md: "btn-md px-4", lg: "btn-lg" }, wide: flag },
    defaultVariants: { size: "md" },
  });

  it("applies the base class and defaults", () => {
    expect(button()).toBe("btn btn-md px-4");
    expect(button({ size: "sm" })).toBe("btn btn-sm");
  });

  it("prefixes every class of a responsive value with its breakpoint", () => {
    expect(button({ size: "sm lg:md" })).toBe("btn btn-sm lg:btn-md lg:px-4");
    expect(button({ size: "md:lg" })).toBe("btn btn-md px-4 md:btn-lg");
  });

  it("supports responsive booleans", () => {
    expect(button({ wide: true })).toBe("btn btn-md px-4 btn-block");
    expect(button({ wide: "md" })).toBe("btn btn-md px-4 md:btn-block");
    expect(button({ wide: "md:false" })).toBe("btn btn-md px-4");
  });

  it("appends class and className and ignores unknown or non-string values", () => {
    expect(button({ class: "a", className: "b" })).toBe("btn btn-md px-4 a b");
    expect(button({ size: null })).toBe("btn");
    expect(button({ other: "x" } as never)).toBe("btn btn-md px-4");
  });

  it("works without a config", () => {
    expect(rcva("base")()).toBe("base");
    expect(rcva("base")({ class: "x" })).toBe("base x");
  });
});

describe("responsiveBoolean", () => {
  it("reads attributes", () => {
    expect(responsiveBoolean.fromAttribute(null)).toBe(false);
    expect(responsiveBoolean.fromAttribute("false")).toBe(false);
    expect(responsiveBoolean.fromAttribute("")).toBe(true);
    expect(responsiveBoolean.fromAttribute("true")).toBe(true);
    expect(responsiveBoolean.fromAttribute("md")).toBe("md");
  });

  it("writes attributes", () => {
    expect(responsiveBoolean.toAttribute(false)).toBeNull();
    expect(responsiveBoolean.toAttribute(true)).toBe("");
    expect(responsiveBoolean.toAttribute("lg:true")).toBe("lg:true");
  });
});

describe("booleanAttribute", () => {
  it("round-trips with an explicit false", () => {
    expect(booleanAttribute.fromAttribute(null)).toBe(false);
    expect(booleanAttribute.fromAttribute("false")).toBe(false);
    expect(booleanAttribute.fromAttribute("")).toBe(true);
    expect(booleanAttribute.toAttribute(true)).toBe("");
    expect(booleanAttribute.toAttribute(false)).toBe("false");
  });
});

describe("isOn", () => {
  it("is on for true and responsive values", () => {
    expect(isOn(true)).toBe(true);
    expect(isOn("md")).toBe(true);
    expect(isOn(false)).toBe(false);
    expect(isOn("false")).toBe(false);
    expect(isOn(null)).toBe(false);
    expect(isOn(undefined)).toBe(false);
  });
});
