import { describe, expect, it } from "vite-plus/test";
import { booleanBindings, recipeVariants, responsiveSafelist, responsiveTokens } from "../plugins/recipes.ts";
import { isOn, parseResponsive, rcva, responsiveBoolean } from "../src/components/base/variants.ts";

const menu = rcva("menu", {
  variants: {
    size: { xs: "menu-xs", sm: "menu-sm", lg: "menu-lg" },
    direction: { vertical: "menu-vertical", horizontal: "menu-horizontal" },
    open: { true: "drawer-open" },
    surface: { true: "bg-base-200 rounded-box" },
  },
  defaultVariants: { direction: "vertical" },
});

const tokens = (s: string) => s.split(/\s+/).filter(Boolean).sort();

describe("rcva", () => {
  it("behaves like cva for plain values", () => {
    expect(tokens(menu())).toEqual(["menu", "menu-vertical"]);
    expect(tokens(menu({ size: "sm", open: true }))).toEqual(["drawer-open", "menu", "menu-sm", "menu-vertical"]);
    expect(tokens(menu({ size: "lg" }))).toEqual(["menu", "menu-lg", "menu-vertical"]);
  });

  it("adds breakpoint-prefixed classes for responsive enum values", () => {
    expect(tokens(menu({ direction: "vertical lg:horizontal" }))).toEqual([
      "lg:menu-horizontal",
      "menu",
      "menu-vertical",
    ]);
    expect(tokens(menu({ size: "xs md:sm xl:lg" }))).toEqual([
      "md:menu-sm",
      "menu",
      "menu-vertical",
      "menu-xs",
      "xl:menu-lg",
    ]);
  });

  it("keeps the default when only breakpoints are given", () => {
    expect(tokens(menu({ direction: "lg:horizontal" }))).toEqual(["lg:menu-horizontal", "menu", "menu-vertical"]);
  });

  it("treats a bare breakpoint on a boolean variant as 'on from here'", () => {
    expect(tokens(menu({ open: "lg" }))).toEqual(["lg:drawer-open", "menu", "menu-vertical"]);
    expect(tokens(menu({ surface: "md" }))).toEqual(["md:bg-base-200", "md:rounded-box", "menu", "menu-vertical"]);
    expect(tokens(menu({ open: "true" }))).toEqual(["drawer-open", "menu", "menu-vertical"]);
  });

  it("supports max-width breakpoints", () => {
    expect(tokens(menu({ open: "max-md" }))).toEqual(["max-md:drawer-open", "menu", "menu-vertical"]);
    expect(tokens(menu({ direction: "horizontal max-sm:vertical" }))).toEqual([
      "max-sm:menu-vertical",
      "menu",
      "menu-horizontal",
    ]);
  });

  it("parses specs", () => {
    expect(parseResponsive("sm", { sm: "", lg: "" })).toBeNull();
    expect(parseResponsive("sm lg:lg", { sm: "", lg: "" })).toEqual({ base: "sm", at: [["lg", "lg"]] });
    expect(parseResponsive("lg", { true: "" })).toEqual({ base: undefined, at: [["lg", "true"]] });
  });
});

describe("responsiveBoolean converter", () => {
  it("maps attributes", () => {
    expect(responsiveBoolean.fromAttribute(null)).toBe(false);
    expect(responsiveBoolean.fromAttribute("")).toBe(true);
    expect(responsiveBoolean.fromAttribute("true")).toBe(true);
    expect(responsiveBoolean.fromAttribute("false")).toBe(false);
    expect(responsiveBoolean.fromAttribute("lg")).toBe("lg");
    expect(isOn("lg")).toBe(true);
    expect(isOn(false)).toBe(false);
  });
});

describe("plugin recipe analysis", () => {
  const source = `
    const a = rcva("menu", { variants: {
      size: { xs: "menu-xs", lg: "menu-lg" },
      direction: { vertical: "menu-vertical", horizontal: \`menu-horizontal\` },
      open: { true: ["drawer-open"] },
      computed: { x: other() },
    }, defaultVariants: { size: "xs" } });`;

  it("extracts static variant options", () => {
    expect(recipeVariants(source, "a.ts")).toEqual([
      {
        size: { xs: "menu-xs", lg: "menu-lg" },
        direction: { vertical: "menu-vertical", horizontal: "menu-horizontal" },
        open: { true: "drawer-open" },
        computed: {},
      },
    ]);
  });

  it("finds responsive tokens", () => {
    const found = responsiveTokens(
      `<ui-menu direction="vertical lg:horizontal" size="sm md:lg" force-open="lg"> .wrap=\${"md"} { grow: "max-sm" } x:y 3xl:no`,
    );
    expect([...found].sort()).toEqual(
      [
        "lg:horizontal",
        "md:lg",
        "force-open|lg",
        "forceOpen|lg",
        "wrap|md",
        "grow|max-sm",
        // bare "sm" in size="sm ..." is recorded too; it only matters for boolean variants fed by `size`
        "size|sm",
      ].sort(),
    );
  });

  it("maps attributes and properties to the boolean variants they feed", () => {
    const component = `
      class X extends LightElement {
        @property({ attribute: "force-open", converter: responsiveBoolean }) forceOpen = false;
        @property({ converter: responsiveBoolean }) side = false;
        @property({ type: Boolean }) plain = false;
        render() { return drawer({ open: this.forceOpen, side: this.side, plain: this.plain }); }
      }`;
    const bindings = booleanBindings(component, "x.ts");
    expect([...bindings.get("open")!].sort()).toEqual(["force-open", "forceOpen", "open"]);
    expect([...bindings.get("side")!].sort()).toEqual(["side"]);
    expect([...bindings.get("plain")!]).toEqual(["plain"]);
  });

  it("safelists enums and booleans only where used", () => {
    const recipes = recipeVariants(source, "a.ts");
    const bindings = new Map([["open", new Set(["open", "forceOpen", "force-open"])]]);
    expect(responsiveSafelist(recipes, new Set(["lg:horizontal", "md:lg"]), bindings)).toEqual([
      "lg:menu-horizontal",
      "md:menu-lg",
    ]);
    expect(responsiveSafelist(recipes, new Set(["force-open|lg", "open|max-md"]), bindings)).toEqual([
      "lg:drawer-open",
      "max-md:drawer-open",
    ]);
    // an unrelated attribute with a bare breakpoint doesn't switch the boolean on
    expect(responsiveSafelist(recipes, new Set(["size|lg"]), bindings)).toEqual([]);
  });
});
