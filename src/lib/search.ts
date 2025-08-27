// src/lib/search.ts
import { getIndex } from "./index-store";

export type SearchHit = { id: string; score: number };

function cosine(a: Float32Array, b: Float32Array): number {
  const len = Math.min(a.length, b.length);
  let s = 0;
  for (let i = 0; i < len; i++) s += a[i] * b[i];
  return s;
}

/**
 * Top-K 검색
 * @param qv 쿼리 벡터 (정규화된 Float32Array)
 * @param k 반환 개수 (기본값 5)
 */
export function topK(qv: Float32Array, k = 5): SearchHit[] {
  const { ids, vecs } = getIndex(); // index-store.ts에서 반환한 IndexStore 기반

  const scored: SearchHit[] = ids.map((id, i) => {
    const s = cosine(qv, vecs[i]);
    return { id, score: Number.isFinite(s) ? s : -Infinity };
  });

  return scored.sort((x, y) => y.score - x.score).slice(0, k);
}