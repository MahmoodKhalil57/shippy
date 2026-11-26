import { describe, expect, it } from "vite-plus/test";
import { viewElement } from "./view-element.ts";
import { fullAccess, maya } from "../../../.storybook/fixtures/views.ts";

describe("viewElement", () => {
  it("returns nothing for a tag that isn't defined", () => {
    expect(viewElement("demo-unknown-view", { access: fullAccess, user: maya })).toBeNull();
  });

  it("creates the element once and hands it fresh props", () => {
    const first = viewElement("demo-activity-tab", { access: fullAccess, user: maya, slug: "deals", docId: "d1" });
    expect(first).toBeInstanceOf(HTMLElement);
    expect(first).toMatchObject({ slug: "deals", docId: "d1", access: fullAccess, user: maya });
    const readOnly = { ...fullAccess, canAccessAdmin: false };
    const again = viewElement("demo-activity-tab", { access: readOnly, user: maya, slug: "deals", docId: "d1" });
    expect(again).toBe(first);
    expect(again).toMatchObject({ access: readOnly });
  });

  it("makes a new element when the props or the user change, and forgets the old one", () => {
    const d1 = viewElement("demo-activity-tab", { access: fullAccess, user: maya, slug: "deals", docId: "d1" });
    const d2 = viewElement("demo-activity-tab", { access: fullAccess, user: maya, slug: "deals", docId: "d2" });
    expect(d2).not.toBe(d1);
    const other = viewElement("demo-activity-tab", {
      access: fullAccess,
      user: { ...maya, id: "u2" },
      slug: "deals",
      docId: "d2",
    });
    expect(other).not.toBe(d2);
    expect(viewElement("demo-activity-tab", { access: fullAccess, user: maya, slug: "deals", docId: "d1" })).not.toBe(
      d1,
    );
  });
});
