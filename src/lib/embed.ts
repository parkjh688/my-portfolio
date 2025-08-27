// src/lib/embed.ts
import { pipeline } from "@xenova/transformers";

let embedder: any;
export async function embedQuery(q: string) {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/multilingual-e5-small");
  }
  // e5 규칙: 쿼리는 "query: " 접두사
  const out = await embedder("query: " + q, {
    pooling: "mean",     // ★ 토큰 평균 풀링을 내부에서 수행
    normalize: true      // ★ L2 정규화도 내부에서
  });

  // out은 보통 Tensor(1, D) 형태. data가 벡터 하나다.
  const data: Float32Array = out.data ?? out; // 일부 버전은 바로 Float32Array
  return new Float32Array(data); // 길이 384가 되어야 정상
}