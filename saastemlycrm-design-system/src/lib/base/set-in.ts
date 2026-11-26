type Data = Record<string, unknown>;
type Path = (string | number)[];

const isObj = (v: unknown): v is Data => typeof v === "object" && v !== null && !Array.isArray(v);

export function setIn(root: Data, path: Path, value: unknown): Data {
  const [head, ...rest] = path;
  const copy: Data | unknown[] = Array.isArray(root) ? [...(root as unknown[])] : { ...root };
  const current = (copy as Record<string | number, unknown>)[head];
  (copy as Record<string | number, unknown>)[head] = rest.length
    ? setIn(
        (isObj(current) || Array.isArray(current) ? current : typeof rest[0] === "number" ? [] : {}) as Data,
        rest,
        value,
      )
    : value;
  return copy as Data;
}
