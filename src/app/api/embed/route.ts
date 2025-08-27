// // app/api/embed/route.ts
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   try {
//     const { text } = await request.json();
//     if (!text || typeof text !== 'string') {
//       return NextResponse.json({ error: 'Text is required' }, { status: 400 });
//     }

//     const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
//     if (!HF_TOKEN) return NextResponse.json({ error: 'HF token missing' }, { status: 500 });

//     const r = await fetch(
//       'https://router.huggingface.co/hf-inference/models/intfloat/multilingual-e5-small/pipeline/feature-extraction',
//       {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${HF_TOKEN}`,
//           'Content-Type': 'application/json',
//           'x-wait-for-model': 'true',
//         },
//         body: JSON.stringify({
//           inputs: `query: ${text}`,
//           normalize: true,
//           truncate: true,
//         }),
//       }
//     );

//     if (!r.ok) {
//       const msg = await r.text();
//       return NextResponse.json({ error: `HF ${r.status}: ${msg}` }, { status: r.status });
//     }

//     let data = await r.json();           // data: number[] | number[][]
//     const vec = Array.isArray(data[0]) ? data[0] : data;

//     // 안전성 체크
//     if (!Array.isArray(vec) || typeof vec[0] !== 'number') {
//       return NextResponse.json({ error: 'Unexpected embedding shape' }, { status: 500 });
//     }

//     // 👉 여기! 벡터 배열만 반환
//     return NextResponse.json(vec);
//   } catch (e: any) {
//     return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
//   }
// }
// app/api/embed/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pipeline } from "@xenova/transformers";

// Edge Runtime에서는 WASM/파일 접근 제약이 있으니 Node.js 런타임으로 고정
export const runtime = "nodejs";
// 캐싱/SSR 조건에 영향받지 않도록
export const dynamic = "force-dynamic";

// 전역 싱글톤으로 파이프라인 재사용 (핫리로드/서버리스 콜드스타트 대비)
let _embedder: any;
async function getEmbedder() {
  if (_embedder) return _embedder;
  // multilingual-e5-small: 384차원, 한글/영문 모두 적합
  _embedder = await pipeline("feature-extraction", "Xenova/multilingual-e5-small");
  return _embedder;
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const embedder = await getEmbedder();

    // E5 규칙: 쿼리는 "query: " 접두사
    const out = await embedder("query: " + text, {
      pooling: "mean",   // 토큰 평균 풀링
      normalize: true,   // L2 정규화
      truncate: true,    // (선택) 너무 긴 입력 잘라내기
    });

    // out 은 보통 Tensor(1, D) -> .data 가 Float32Array
    const data: Float32Array = (out as any).data ?? out;
    if (!(data instanceof Float32Array)) {
      return NextResponse.json({ error: "Unexpected embedding output" }, { status: 500 });
    }

    // JSON 직렬화를 위해 일반 배열로 반환
    return NextResponse.json(Array.from(data)); // 길이 384
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}