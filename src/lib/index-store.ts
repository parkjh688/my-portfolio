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
export async function loadIndex(
  prefix = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
): Promise<IndexStore> {
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

/** 캐시된 인덱스를 즉시 반환 (loadIndex 실행 후 사용 가능) */
export function getIndex(): IndexStore {
  if (!cache) throw new Error("Index not loaded yet. Call loadIndex() first.");
  return cache;
}

/** id로 문서를 가져오기 (동기). loadIndex() 이후에만 사용 가능 */
export function getDocById(id: string): {
  id: string;
  title: string;
  text: string;
  meta: Meta;
} | null {
  if (!cache) throw new Error("Index not loaded yet. Call loadIndex() first.");
  const i = cache.ids.indexOf(id);
  if (i < 0) return null;
  return { id: cache.ids[i], title: cache.titles[i], text: cache.texts[i], meta: cache.meta[i] as Meta };
}

/** id로 문서를 가져오기 (비동기). 내부에서 필요한 경우 loadIndex 호출 */
export async function getDocByIdAsync(
  id: string,
  prefix = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
) {
  if (!cache) await loadIndex(prefix);
  return getDocById(id);
}