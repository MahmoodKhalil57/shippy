import { describe, expect, it } from "vite-plus/test";
import { frames } from "../dashboard/tiling.ts";
import { drawInTurn } from "./paint-queue.ts";

describe("drawInTurn", () => {
  it("draws connected elements in document order, once each turn, and skips the rest", async () => {
    const root = document.createElement("div");
    const [a, b, gone] = [0, 1, 2].map(() => root.appendChild(document.createElement("span")));
    document.body.append(root);
    gone!.remove();
    const drawn: string[] = [];
    const draw = (name: string) => async () => {
      drawn.push(name);
    };
    drawInTurn(b!, draw("b"));
    drawInTurn(a!, draw("a"));
    drawInTurn(a!, draw("a again"));
    drawInTurn(gone!, draw("gone"));
    await frames(2);
    expect(drawn).toEqual(["a", "a again", "b"]);
    root.remove();
  });
});
