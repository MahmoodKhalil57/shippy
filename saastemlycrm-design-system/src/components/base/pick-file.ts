/**
 * Asks the person for a file with the browser's own picker (nothing is uploaded) and resolves
 * with it, or null when they cancel. For components that offer "choose a photo" from a button of
 * their own, without a file input in their markup.
 */
export function pickFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.addEventListener("change", () => resolve(input.files?.[0] ?? null), { once: true });
    input.addEventListener("cancel", () => resolve(null), { once: true });
    input.click();
  });
}
