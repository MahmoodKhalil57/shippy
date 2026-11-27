const BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export const vlq = (n: number) => {
  let v = n < 0 ? (-n << 1) | 1 : n << 1;
  let out = "";
  do {
    let digit = v & 31;
    v >>>= 5;
    if (v) digit |= 32;
    out += BASE64[digit];
  } while (v);
  return out;
};

export const FIXTURE = `import { call } from "./call.ts";
const top = 1;
function decl(a = 2) { return 3; }
const arrow = (b = 4) => 5;
const expr = function named() { return 6; };
class Box {
  field = 7;
  static shared = 8;
  #secret = 9;
  ["computed"] = 10;
  handler = () => 11;
  constructor() { this.x = 12; }
  method() { return () => 13; }
  get value() { return 14; }
  set value(v) { void (v + 15); }
  static make() { return 16; }
}
const object = {
  run() { return 17; },
  get size() { return 18; },
  set size(v) { void (v + 19); },
  plain: () => 20,
};
call(() => 21);
export default () => 22;
`;

export const UNITS: [string, string][] = [
  ["top", ""],
  ["function", "decl"],
  ["arrow", "arrow"],
  ["function", "named"],
  ["field", "Box.field"],
  ["field", "Box.#secret"],
  ["field", "Box.handler"],
  ["arrow", "Box.handler > value"],
  ["constructor", "Box.constructor"],
  ["method", "Box.method"],
  ["arrow", "Box.method > arrow"],
  ["getter", "Box.get value"],
  ["setter", "Box.set value"],
  ["method", "Box.static make"],
  ["method", "run"],
  ["getter", "get size"],
  ["setter", "set size"],
  ["arrow", "plain"],
  ["arrow", "call()"],
  ["arrow", "default"],
];
