export function isRecord(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === "object";
}

export function toNumberArray(x: unknown): number[] {
  if (Array.isArray(x)) return x.map(Number);
  // { data: Float32Array | number[] } 형태
  if (isRecord(x) && "data" in x) {
    const d = (x as { data: unknown }).data;
    if (Array.isArray(d)) return (d as unknown[]).map(Number);
    if (d instanceof Float32Array) return Array.from(d);
  }
  throw new Error("Invalid embedding output shape");
}