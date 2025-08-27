// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { HfInference, InferenceClientProviderApiError, InferenceClientError } from "@huggingface/inference";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_CHAT_MODEL = process.env.HF_CHAT_MODEL || "Qwen/Qwen2.5-1.5B-Instruct";
const DEFAULT_TG_MODEL   = process.env.HF_TG_MODEL   || "google/gemma-2-2b-it";

// ---------- 타입 & 타입가드 ----------
type HFChatChoice = {
  message?: { content?: string };
  delta?: { content?: string };
};
type HFChatResponse = { choices?: HFChatChoice[] };

function isRecord(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === "object";
}
function isHFChatResponse(x: unknown): x is HFChatResponse {
  return (
    isRecord(x) &&
    Array.isArray(x.choices) &&
    (x.choices.length === 0 ||
      isRecord(x.choices[0]) &&
      (isRecord(x.choices[0].message) || isRecord(x.choices[0].delta)))
  );
}
function extractChatText(resp: HFChatResponse): string {
  const c = resp.choices?.[0];
  const a = (c?.message?.content ?? c?.delta?.content);
  return typeof a === "string" ? a : "";
}

type TGObj = { generated_text?: string };
type TGResp = TGObj | TGObj[];

function extractTGText(x: unknown): string {
  if (isRecord(x) && typeof (x as TGObj).generated_text === "string") {
    return (x as TGObj).generated_text!;
  }
  if (Array.isArray(x) && x.length > 0 && isRecord(x[0]) && typeof (x[0] as TGObj).generated_text === "string") {
    return (x[0] as TGObj).generated_text!;
  }
  return "";
}

// ---------- 핸들러 ----------
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const prompt = isRecord(body) && typeof body.prompt === "string" ? body.prompt : null;
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required and must be a string" }, { status: 400 });
    }

    const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
    if (!HF_TOKEN) {
      return NextResponse.json({ error: "HuggingFace API key not configured" }, { status: 500 });
    }

    const hf = new HfInference(HF_TOKEN);

    // 1) Chat Completion 우선 시도
    try {
      const chatResp = await hf.chatCompletion({
        model: DEFAULT_CHAT_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 220,
        temperature: 0.3,
      });

      const text = isHFChatResponse(chatResp) ? extractChatText(chatResp) : "";
      if (text) {
        return NextResponse.json({ text, model: DEFAULT_CHAT_MODEL });
      }
      // 비정형 응답이면 폴백으로 진행
    } catch (err) {
      // provider/모델 이슈만 폴백, 그 외는 에러 전파
      if (!(err instanceof InferenceClientProviderApiError || err instanceof InferenceClientError)) {
        throw err;
      }
    }

    // 2) 폴백: textGeneration
    const tgResp = await hf.textGeneration({
      model: DEFAULT_TG_MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 220,
        temperature: 0.3,
        top_p: 0.95,
        return_full_text: false,
      },
    });

    const fallbackText = extractTGText(tgResp);
    return NextResponse.json({ text: fallbackText, model: DEFAULT_TG_MODEL });
  } catch (error: unknown) {
    const msg = isRecord(error) && typeof error.message === "string" ? error.message : "Unknown error";

    if (msg.toLowerCase().includes("loading")) {
      return NextResponse.json({ error: "Model is loading, try again." }, { status: 503 });
    }
    if (msg.toLowerCase().includes("rate")) {
      return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
    }
    if (msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("does not exist")) {
      return NextResponse.json({ error: "Model not found or not available." }, { status: 404 });
    }
    return NextResponse.json({ error: `Internal server error: ${msg}` }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
export async function GET() {
  return NextResponse.json({ ok: true });
}