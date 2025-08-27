import { embedQuery } from "../src/lib/embed";
import { topK } from "../src/lib/search";
import { getDocById } from "../src/lib/index-store";

(async () => {
  const q = process.argv.slice(2).join(" ") || "Favorite Mario character";
  const qv = await embedQuery(q);
  console.log("qv len:", qv.length, "hasNaN:", qv.some((x) => !Number.isFinite(x)));
  const results = topK(qv, 5);
  for (const r of results) {
    const doc = getDocById(r.id)!;
    console.log(`- ${doc.title} [${r.id}]  score=${r.score}`);
  }
})();