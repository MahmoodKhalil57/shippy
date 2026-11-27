import { describe, expect, it } from "vite-plus/test";
import { browserPlace, memoryPlace } from "./address.ts";

const popped = () => {
  const heard: string[] = [];
  const listen = () => heard.push("popstate");
  window.addEventListener("popstate", listen);
  return { heard, stop: () => window.removeEventListener("popstate", listen) };
};

describe("memoryPlace", () => {
  it("starts where it is told and resolves each move against the current address", () => {
    const place = memoryPlace("/deals?x=1");
    expect(place.address()).toEqual({ pathname: "/deals", search: "?x=1" });
    place.go("?y=2", true);
    expect(place.address()).toEqual({ pathname: "/deals", search: "?y=2" });
    place.go("/deals/d1", false);
    expect(place.address()).toEqual({ pathname: "/deals/d1", search: "" });
    expect(memoryPlace().address()).toEqual({ pathname: "/", search: "" });
  });

  it("goes back one entry, drops the entries after a new move and tells the app", () => {
    const place = memoryPlace("/a");
    const pop = popped();
    try {
      place.go("/b", false);
      place.go("/c", false);
      place.back();
      expect(place.address().pathname).toBe("/b");
      place.go("/d", false);
      place.back();
      expect(place.address().pathname).toBe("/b");
      place.back();
      place.back();
      expect(place.address().pathname).toBe("/a");
      expect(pop.heard).toEqual(["popstate", "popstate", "popstate"]);
    } finally {
      pop.stop();
    }
  });

  it("starts over at a new address", () => {
    const place = memoryPlace("/a");
    place.go("/b", false);
    place.reset("/c?open=1");
    expect(place.address()).toEqual({ pathname: "/c", search: "?open=1" });
    place.back();
    expect(place.address().pathname).toBe("/c");
  });
});

describe("browserPlace", () => {
  it("reads, pushes, replaces and goes back through the browser history", async () => {
    const start = location.pathname + location.search;
    const length = history.length;
    try {
      browserPlace.go("/place/one?q=1", false);
      expect(browserPlace.address()).toEqual({ pathname: "/place/one", search: "?q=1" });
      expect(history.length).toBe(length + 1);
      browserPlace.go("/place/two", true);
      expect(browserPlace.address()).toEqual({ pathname: "/place/two", search: "" });
      expect(history.length).toBe(length + 1);
      const back = new Promise((resolve) => window.addEventListener("popstate", resolve, { once: true }));
      browserPlace.back();
      await back;
      expect(browserPlace.address().pathname).toBe(start.split("?")[0]);
    } finally {
      history.replaceState(null, "", start);
    }
  });
});
