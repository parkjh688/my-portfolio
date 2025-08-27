// app/api/embed/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pipeline } from "@xenova/transformers";
import { toNumberArray, isRecord } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 파이프라인 함수 타입 (입력/옵션만 좁혀줌)
type EmbedderFn = (
  input: string,
  options?: { pooling?: "mean" | "max"; normalize?: boolean; truncate?: boolean }
) => Promise<unknown>;

let _embedder: EmbedderFn | null = null;
async function getEmbedder(): Promise<EmbedderFn> {
  if (_embedder) return _embedder;
  const p = (await pipeline(
    "feature-extraction",
    "Xenova/multilingual-e5-small"
  )) as unknown as EmbedderFn;
  _embedder = p;
  return p;
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const text = isRecord(body) && typeof body.text === "string" ? body.text : null;
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const embedder = await getEmbedder();
    const out = await embedder("query: " + text, {
      pooling: "mean",
      normalize: true,
      truncate: true,
    });

    // 다양한 반환 모양을 숫자 배열로 정규화
    const vec = toNumberArray(out); // length = 384
    return NextResponse.json(vec);
  } catch (e: unknown) {
    const msg =
      isRecord(e) && typeof e.message === "string" ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}