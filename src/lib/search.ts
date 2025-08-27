// src/lib/search.ts
import { getIndex } from "./index-store";

function cosine(a: Float32Array, b: Float32Array) {
  const len = Math.min(a.length, b.length);
  let s = 0;
  for (let i = 0; i < len; i++) s += a[i] * b[i];
  return s;
}

export function topK(qv: Float32Array, k = 5) {
  const { IDS, VECS } = getIndex();
  const scored = IDS.map((id, i) => {
    const s = cosine(qv, VECS[i]);
    return { id, score: Number.isFinite(s) ? s : -Infinity };
  })
  .sort((x, y) => y.score - x.score)
  .slice(0, k);
  return scored;
}