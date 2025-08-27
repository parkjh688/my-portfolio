// src/components/AgentClient.tsx
"use client";

import { useEffect, useRef, useState } from "react";

/* ========= Persona ========= */
const PERSONA_KO = process.env.NEXT_PUBLIC_PERSONA_KO || "정현";
const PERSONA_EN = process.env.NEXT_PUBLIC_PERSONA_EN || "Junghyun";

/* ========= Type guards / helpers ========= */
function isKorean(s: string) {
  return /[ㄱ-ㅎ가-힣]/.test(s);
}
function nameForQuestion(q: string) {
  return isKorean(q) ? PERSONA_KO : PERSONA_EN;
}
function isRecord(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === "object";
}
function messageFrom(e: unknown): string {
  return isRecord(e) && typeof (e as { message?: unknown }).message === "string"
    ? (e as { message: string }).message
    : String(e);
}

function cosine(a: Float32Array, b: Float32Array) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}
function l2normFloat32(v: Float32Array) {
  let s = 0;
  for (let i = 0; i < v.length; i++) s += v[i] * v[i];
  s = Math.sqrt(s) || 1;
  if (s !== 1) for (let i = 0; i < v.length; i++) v[i] /= s;
  return v;
}
function toFloat32(x: number[] | Float32Array): Float32Array {
  return x instanceof Float32Array ? x : Float32Array.from(x);
}
function parseEmbeddingPayload(payload: unknown): number[] {
  // 허용: number[] | {data:number[]} | {embedding:number[]} | {dim, embedding:number[]}
  if (Array.isArray(payload)) {
    // number[] 인지 확인
    if (payload.every((n) => typeof n === "number")) return payload as number[];
  }
  if (isRecord(payload) && Array.isArray(payload.data) && payload.data.every((n) => typeof n === "number")) {
    return payload.data as number[];
  }
  if (isRecord(payload) && Array.isArray(payload.embedding) && payload.embedding.every((n) => typeof n === "number")) {
    return payload.embedding as number[];
  }
  throw new Error("Embedding API returned wrong shape");
}

type Hit = { id: string; title: string; text: string; score: number };
type IndexMem = {
  ids: string[];
  titles: string[];
  texts: string[];
  meta: Record<string, unknown>[];
  vecs: Float32Array[];
  dim: number;
};

const logErr = (err: unknown) =>
  (process.env.NODE_ENV !== "production" ? console.warn : console.error)(err);

/* ========= Component ========= */
export default function AgentClient() {
  const [q, setQ] = useState<string>("");
  const [a, setA] = useState<string>("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [status, setStatus] = useState<string>("idle");
  const [index, setIndex] = useState<IndexMem | null>(null);
  const didInitIndex = useRef(false);

  /* 0) 인덱스 로드 */
  useEffect(() => {
    if (didInitIndex.current) return;
    didInitIndex.current = true;

    (async () => {
      try {
        setStatus("loading index…");

        const PREFIX = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
        const fetchJSON = async <T,>(path: string): Promise<T> => {
          const url = `${PREFIX}${path}`;
          const r = await fetch(url);
          if (!r.ok) throw new Error(`HTTP ${r.status} @ ${url}`);
          return (await r.json()) as T;
        };

        const [ids, titles, texts, meta, mat] = await Promise.all([
          fetchJSON<string[]>("/index/ids.json"),
          fetchJSON<string[]>("/index/titles.json"),
          fetchJSON<string[]>("/index/texts.json"),
          fetchJSON<Record<string, unknown>[]>("/index/meta.json"),
          fetchJSON<number[][]>("/index/embeddings.json"),
        ]);

        const dim = mat[0].length;
        const vecs = mat.map((row) => l2normFloat32(Float32Array.from(row)));

        setIndex({ ids, titles, texts, meta, vecs, dim });
        setStatus("ready");
      } catch (err) {
        logErr(err);
        setStatus("index load error");
        setA("인덱스 로드 오류: " + messageFrom(err));
      }
    })();
  }, []);

  /* 질문 실행 */
  async function ask() {
    try {
      if (!index) {
        setA("인덱스가 로드되지 않았습니다.");
        return;
      }

      const qClean = q?.trim() ?? "";
      if (!qClean) {
        setA("질문을 입력해 주세요.");
        return;
      }

      // 1) 쿼리 임베딩
      setStatus("embedding query…");
      const embedResponse = await fetch("/api/embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: qClean }),
      });

      if (!embedResponse.ok) {
        let errText = await embedResponse.text();
        try {
          const errJson = JSON.parse(errText) as unknown;
          if (isRecord(errJson) && typeof errJson.error === "string") {
            errText = errJson.error;
          }
        } catch {}
        throw new Error(`임베딩 API 오류 (${embedResponse.status}): ${errText}`);
      }

      const payload: unknown = await embedResponse.json();
      const vec = parseEmbeddingPayload(payload);
      const qv = l2normFloat32(toFloat32(vec));

      // 2) 검색 (Top-8 → 주제 필터 → 최상위 1개)
      setStatus("searching…");
      const scored = index.ids
        .map((_, i) => ({ i, s: cosine(qv, index.vecs[i]) }))
        .sort((a, b) => b.s - a.s);

      const top8: Hit[] = scored.slice(0, 8).map(({ i, s }) => ({
        id: index.ids[i],
        title: index.titles[i],
        text: index.texts[i],
        score: s,
      }));

      const qLower = qClean.toLowerCase();
      const topicRules = [
        { name: "movie", re: /(movie|film|영화|픽사|디즈니|마블|스파이더|애니)/i },
        { name: "game", re: /(game|게임|마리오|mario|닌텐도|bowser|쿠파)/i },
        { name: "food", re: /(food|음식|먹|피자|pizza|과일|fruit)/i },
        { name: "place", re: /(place|장소|사는|거주|도시|지역|surry|surry hills|sydney|호주)/i },
        { name: "music", re: /(music|노래|가수|song|artist)/i },
      ];
      const activeTopics = topicRules.filter((t) => t.re.test(qLower)).map((t) => t.name);

      function topicOf(h: Hit): string {
        const b = (h.id + " " + h.title + " " + h.text).toLowerCase();
        if (/(movie|film|영화|픽사|디즈니|spider-man|spiderman|애니)/i.test(b)) return "movie";
        if (/(game|게임|마리오|mario|닌텐도|bowser|쿠파)/i.test(b)) return "game";
        if (/(food|음식|피자|pizza|과일|fruit)/i.test(b)) return "food";
        if (/(surry|sydney|place|장소|거주|도시|지역)/i.test(b)) return "place";
        if (/(music|노래|가수|song|artist)/i.test(b)) return "music";
        return "misc";
      }

      let relevant = top8;
      if (activeTopics.length) {
        relevant = top8.filter((h) => activeTopics.includes(topicOf(h)));
        if (!relevant.length) relevant = [top8[0]];
      }

      const used = [relevant[0]];
      setHits(used);

      // 3) 컨텍스트 구성
      const blocks = used.map(
        (t, idx) => `[${idx + 1}] ${t.title} | ${t.id} | score=${t.score.toFixed(3)}\n${t.text}`
      );
      const context = blocks.join("\n\n");

      // 4) 프롬프트
      const NAME = nameForQuestion(qClean);
      const langLine = isKorean(qClean) ? "Answer in Korean only." : "Answer in English only.";
      const ragPrompt = `You are the agent for ${NAME}.
- Always answer in THIRD PERSON using the owner's name "${NAME}" (never use "I" or "my").
- Use ONLY the provided [Context] to answer anything about the owner (bio, favorites, preferences, projects).
- If information is missing in Context, say briefly that it's not found in the profile.
- ${langLine}
- Be concise (2–4 sentences).
- If your drafted answer accidentally uses first-person, REWRITE it to third-person with the name "${NAME}" before returning.

Question: ${qClean}

[Context]
${context}

Answer:`;

      setStatus("generating (with context)…");
      const generateResponse = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: ragPrompt }),
      });

      if (!generateResponse.ok) {
        let errText = await generateResponse.text();
        try {
          const errJson = JSON.parse(errText) as unknown;
          if (isRecord(errJson) && typeof errJson.error === "string") {
            errText = errJson.error;
          }
        } catch {}
        throw new Error(`생성 API 오류 (${generateResponse.status}): ${errText}`);
      }

      const gen: unknown = await generateResponse.json();
      let text =
        isRecord(gen) && typeof (gen as { text?: unknown }).text === "string"
          ? (gen as { text: string }).text
          : "";

      if (text.includes("Answer:")) text = text.split("Answer:").pop()?.trim() || text;
      text = text
        .replace(/(^|\n)\s*As an AI language model[^\n\.]*[\.\n]?/gi, "")
        .replace(/(^|\n)\s*저는 AI[^\n\.]*[\.\n]?/gi, "")
        .trim();

      setA(text || "(응답을 생성할 수 없습니다)");
      setStatus("done");
    } catch (err: unknown) {
      logErr(err);
      setA("오류: " + messageFrom(err));
      setStatus("error");
    }
  }

  const disabled = !index;

  return (
    <div className="flex h-full flex-col">
      <div className="text-xs text-gray-500">status: {status}</div>

      <div className="mt-2 flex gap-2">
        <input
          className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="질문을 입력하세요 (ko/en). 예: 좋아하는 영화는? Favorite Movie?"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !disabled && ask()}
          disabled={disabled}
        />
        <button
          onClick={ask}
          disabled={disabled}
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50 hover:bg-gray-50 disabled:hover:bg-transparent"
        >
          Ask
        </button>
      </div>

      {a && (
        <div className="mt-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-sm whitespace-pre-wrap">
          {a}
        </div>
      )}

      {hits.length > 0 && status === "done" && (
        <div className="mt-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3 text-xs text-gray-600 dark:text-gray-400">
          <div className="mb-1 font-medium">Sources</div>
          <ul className="list-disc pl-5">
            {hits.map((h, idx) => (
              <li key={h.id}>
                [{idx + 1}] {h.title} ({h.id}) — {h.score.toFixed(3)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}