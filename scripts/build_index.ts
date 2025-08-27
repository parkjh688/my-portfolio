// scripts/build_index.ts
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { pipeline } from "@xenova/transformers";
import { corpus } from "../src/data/corpus";

function hash(obj: any) {
  return crypto.createHash("sha1").update(JSON.stringify(obj)).digest("hex");
}

async function withRetry<T>(fn: () => Promise<T>, tries = 3, ms = 1200): Promise<T> {
  let lastErr: any;
  for (let i = 0; i < tries; i++) {
    try { return await fn(); } 
    catch (e) { lastErr = e; if (i < tries - 1) await new Promise(r => setTimeout(r, ms)); }
  }
  throw lastErr;
}

async function main() {
  const outDir = path.join(process.cwd(), "public/index");
  fs.mkdirSync(outDir, { recursive: true });

  // 1) 해시 스킵(선택)
  const currHash = hash(corpus);
  const hashFile = path.join(outDir, ".corpus.hash");
  if (fs.existsSync(hashFile) && fs.readFileSync(hashFile, "utf8") === currHash) {
    console.log("No corpus changes. Skip embedding build.");
    return;
  }

  // 2) 파이프라인 로드(리비전 고정 권장)
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/multilingual-e5-small",
    { revision: "main" } // 필요하면 커밋 SHA
  );

  const ids: string[] = [];
  const titles: string[] = [];
  const texts: string[] = [];
  const metas: any[] = [];
  const embeddings: number[][] = [];
  let dim = -1;

  for (const doc of corpus) {
    const input = `${doc.title}\n${doc.text}`;

    const out = await withRetry(() => extractor(input, { pooling: "mean", normalize: true }));
    const vec: number[] = Array.from((out as any).data ?? out);

    if (dim === -1) dim = vec.length;
    if (vec.length !== dim) throw new Error(`Embedding dim mismatch for ${doc.id}: ${vec.length} vs ${dim}`);

    ids.push(doc.id);
    titles.push(doc.title);
    texts.push(doc.text);
    metas.push({ lang: doc.lang, ...(doc.meta || {}) });
    embeddings.push(vec);

    console.log(`Embedded: ${doc.id} (${vec.length}d)`);
  }

  fs.writeFileSync(path.join(outDir, "ids.json"), JSON.stringify(ids));
  fs.writeFileSync(path.join(outDir, "titles.json"), JSON.stringify(titles));
  fs.writeFileSync(path.join(outDir, "texts.json"), JSON.stringify(texts));
  fs.writeFileSync(path.join(outDir, "meta.json"), JSON.stringify(metas));
  fs.writeFileSync(path.join(outDir, "embeddings.json"), JSON.stringify(embeddings));
  fs.writeFileSync(path.join(outDir, "dim.json"), JSON.stringify({ dim }));

  fs.writeFileSync(hashFile, currHash); // 해시 저장
  console.log(`\n✓ Saved ${ids.length} docs (${dim}d) → public/index/*.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });