import { describe, it, expect } from "vite-plus/test";
import { pickFile } from "./pick-file";

const capture = async (act: (input: HTMLInputElement) => void) => {
  const click = HTMLInputElement.prototype.click;
  const opened: HTMLInputElement[] = [];
  HTMLInputElement.prototype.click = function (this: HTMLInputElement) {
    opened.push(this);
  };
  try {
    const result = pickFile("image/*");
    const picker = opened[0]!;
    act(picker);
    return { result: await result, picker };
  } finally {
    HTMLInputElement.prototype.click = click;
  }
};

describe("pickFile", () => {
  it("opens a file input that accepts the given types", async () => {
    const { picker } = await capture((input) => input.dispatchEvent(new Event("cancel")));
    expect(picker.type).toBe("file");
    expect(picker.accept).toBe("image/*");
  });

  it("resolves with the chosen file", async () => {
    const file = new File(["x"], "photo.png", { type: "image/png" });
    const { result } = await capture((input) => {
      const data = new DataTransfer();
      data.items.add(file);
      input.files = data.files;
      input.dispatchEvent(new Event("change"));
    });
    expect(result).toBe(file);
  });

  it("resolves with null when the change carries no file", async () => {
    const { result } = await capture((input) => input.dispatchEvent(new Event("change")));
    expect(result).toBeNull();
  });

  it("resolves with null when the picker is cancelled", async () => {
    const { result } = await capture((input) => input.dispatchEvent(new Event("cancel")));
    expect(result).toBeNull();
  });
});
