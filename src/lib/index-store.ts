// src/lib/index-store.ts
type Meta = Record<string, unknown>;

export type IndexStore = {
  ids: string[];
  titles: string[];
  texts: string[];
  meta: Meta[];
  embeddings: number[][];
  dim: number;
};

function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((v) => typeof v === "string");
}
function isNumberMatrix(x: unknown): x is number[][] {
  return Array.isArray(x) && x.every((row) => Array.isArray(row) && row.every((n) => typeof n === "number"));
}
function isMetaArray(x: unknown): x is Meta[] {
  return Array.isArray(x) && x.every((v) => v && typeof v === "object");
}

async function fetchJSON<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} @ ${url}`);
  return (await r.json()) as T;
}

let cache: IndexStore | null = null;

/** public/index/*.json 로부터 인덱스를 로드 (메모리 캐시 포함) */
export async function loadIndex(prefix = process.env.NEXT_PUBLIC_BASE_PATH ?? ""): Promise<IndexStore> {
  if (cache) return cache;

  const [ids, titles, texts, meta, embeddings] = await Promise.all([
    fetchJSON<unknown>(`${prefix}/index/ids.json`),
    fetchJSON<unknown>(`${prefix}/index/titles.json`),
    fetchJSON<unknown>(`${prefix}/index/texts.json`),
    fetchJSON<unknown>(`${prefix}/index/meta.json`),
    fetchJSON<unknown>(`${prefix}/index/embeddings.json`),
  ]);

  if (!isStringArray(ids)) throw new Error("ids.json must be string[]");
  if (!isStringArray(titles)) throw new Error("titles.json must be string[]");
  if (!isStringArray(texts)) throw new Error("texts.json must be string[]");
  if (!isMetaArray(meta)) throw new Error("meta.json must be Record<string, unknown>[]");
  if (!isNumberMatrix(embeddings)) throw new Error("embeddings.json must be number[][]");

  const dim = embeddings[0]?.length ?? 0;
  if (dim <= 0) throw new Error("embeddings.json is empty or invalid");

  cache = { ids, titles, texts, meta, embeddings, dim };
  return cache;
}