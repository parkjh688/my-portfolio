// scripts/build_index.ts
import fs from "fs";
import path from "path";
import { pipeline } from "@xenova/transformers";
import { corpus } from "../src/data/corpus";

type Meta = Record<string, unknown>;
type ExtractOut = number[] | { data?: Float32Array };

function toVec(out: unknown): number[] {
  if (Array.isArray(out) && out.every((n) => typeof n === "number")) {
    return out as number[];
  }
  if (out && typeof out === "object" && "data" in out) {
    const d = (out as { data?: unknown }).data;
    if (d instanceof Float32Array) return Array.from(d);
    if (Array.isArray(d) && d.every((n) => typeof n === "number")) {
      return d as number[];
    }
  }
  throw new Error("Invalid embedding output shape");
}

async function main() {
  const extractor = await pipeline("feature-extraction", "Xenova/multilingual-e5-small");

  const ids: string[] = [];
  const titles: string[] = [];
  const texts: string[] = [];
  const metas: Meta[] = [];
  const embeddings: number[][] = [];

  let dim = -1;

  for (const doc of corpus) {
    const input = `${doc.title}\n${doc.text}`;
    const out = (await extractor(input, {
      pooling: "mean",
      normalize: true,
    })) as unknown as ExtractOut;

    const vec = toVec(out);

    if (dim === -1) dim = vec.length;
    if (vec.length !== dim) {
      throw new Error(`Embedding dim mismatch for ${doc.id}: got ${vec.length}, expected ${dim}`);
    }

    ids.push(doc.id);
    titles.push(doc.title);
    texts.push(doc.text);
    metas.push({ lang: doc.lang, ...(doc.meta ?? {}) });
    embeddings.push(vec);

    console.log(`Embedded: ${doc.id} (${vec.length}d)`);
  }

  const outDir = path.join(process.cwd(), "public/index");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "ids.json"), JSON.stringify(ids));
  fs.writeFileSync(path.join(outDir, "titles.json"), JSON.stringify(titles));
  fs.writeFileSync(path.join(outDir, "texts.json"), JSON.stringify(texts));
  fs.writeFileSync(path.join(outDir, "meta.json"), JSON.stringify(metas));
  fs.writeFileSync(path.join(outDir, "embeddings.json"), JSON.stringify(embeddings));
  fs.writeFileSync(path.join(outDir, "dim.json"), JSON.stringify({ dim }));

  console.log(`\n✓ Saved ${ids.length} docs (${dim}d) → public/index/*.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});