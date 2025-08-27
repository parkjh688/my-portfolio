// src/lib/embed.ts
import { isRecord } from "@/lib/types";

/** API가 돌려줄 수 있는 임베딩 응답 모양들 */
type EmbedAPIResponse =
  | number[]
  | { data: number[] }
  | { embedding: number[] }
  | { dim?: number; embedding: number[] };

function parseEmbedding(x: unknown): number[] {
  // number[]
  if (Array.isArray(x) && x.every((n) => typeof n === "number")) return x as number[];

  // { data: number[] }
  if (isRecord(x) && Array.isArray(x.data) && x.data.every((n) => typeof n === "number")) {
    return x.data as number[];
  }

  // { embedding: number[] } | { dim?: number; embedding: number[] }
  if (isRecord(x) && Array.isArray(x.embedding) && x.embedding.every((n) => typeof n === "number")) {
    return x.embedding as number[];
  }

  throw new Error("Invalid embedding response shape");
}

/** 서버 라우트(/api/embed)를 호출해 임베딩을 받아온다. */
export async function embed(text: string, endpoint = "/api/embed"): Promise<number[]> {
  const r = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!r.ok) {
    let msg = await r.text();
    try {
      const j = JSON.parse(msg) as unknown;
      if (isRecord(j) && typeof j.error === "string") msg = j.error;
    } catch {}
    throw new Error(`Embedding API ${r.status}: ${msg}`);
  }

  const payload = (await r.json()) as unknown as EmbedAPIResponse | unknown;
  return parseEmbedding(payload);
}

export async function embedQuery(text: string): Promise<Float32Array> {
  const res = await fetch("/api/embed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error(`Embedding API error: ${res.status}`);
  }

  const payload = await res.json();
  const arr: number[] = Array.isArray(payload)
    ? payload
    : payload.data || payload.embedding;

  return Float32Array.from(arr);
}