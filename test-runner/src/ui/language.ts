export type Direction = "ltr" | "rtl";

export function speak(dir: Direction) {
  localStorage.setItem("ui-language", dir === "rtl" ? "ar" : "en");
  document.documentElement.dir = dir;
  document.documentElement.lang = dir === "rtl" ? "ar" : "en";
}
