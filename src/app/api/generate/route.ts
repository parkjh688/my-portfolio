// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { HfInference, InferenceClientProviderApiError, InferenceClientError } from '@huggingface/inference';

const DEFAULT_CHAT_MODEL = process.env.HF_CHAT_MODEL || 'Qwen/Qwen2.5-1.5B-Instruct'; // 챗 지원
const DEFAULT_TG_MODEL   = process.env.HF_TG_MODEL   || 'google/gemma-2-2b-it';        // text-generation 폴백용

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required and must be a string' }, { status: 400 });
    }

    const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
    if (!HF_TOKEN) {
      return NextResponse.json({ error: 'HuggingFace API key not configured' }, { status: 500 });
    }

    const hf = new HfInference(HF_TOKEN);

    // 1) 우선 Chat Completion (챗 지원 모델)
    try {
      const chat = await hf.chatCompletion({
        model: DEFAULT_CHAT_MODEL,
        messages: [{ role: 'user', content: prompt }],
        // OpenAI 호환 파라미터
        max_tokens: 220,
        temperature: 0.3,
      });

      const text =
        chat?.choices?.[0]?.message?.content ??
        chat?.choices?.[0]?.delta?.content ??
        '';

      if (text && typeof text === 'string') {
        return NextResponse.json({ text, model: DEFAULT_CHAT_MODEL });
      }
      // 예상치 못한 응답 구조면 폴백
    } catch (err) {
      // provider 불가/모델 미지원/로딩 등은 폴백으로 넘김
      if (err instanceof InferenceClientProviderApiError || err instanceof InferenceClientError) {
        // 계속 진행해서 폴백 시도
      } else {
        throw err; // 기타 에러는 상위 catch로
      }
    }

    // 2) 폴백: textGeneration (인스트럭션 모델을 프롬프트로 직접 호출)
    const tg = await hf.textGeneration({
      model: DEFAULT_TG_MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 220,
        temperature: 0.3,
        top_p: 0.95,
        return_full_text: false, // 프롬프트 제외하고 생성분만
      },
    });

    // huggingface.js는 provider에 따라 배열/객체 둘 다 가능성이 있어 안전 처리
    const fallbackText =
      (tg as any)?.generated_text ??
      ((Array.isArray(tg) && tg[0]?.generated_text) ? tg[0].generated_text : '');

    return NextResponse.json({ text: fallbackText || '', model: DEFAULT_TG_MODEL });

  } catch (error: any) {
    const msg = typeof error?.message === 'string' ? error.message : String(error);
    // 흔한 상황 별 상태코드 매핑
    if (msg.includes('loading'))   return NextResponse.json({ error: 'Model is loading, try again.' }, { status: 503 });
    if (msg.toLowerCase().includes('rate')) return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
    if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('does not exist')) {
      return NextResponse.json({ error: 'Model not found or not available.' }, { status: 404 });
    }
    return NextResponse.json({ error: `Internal server error: ${msg}` }, { status: 500 });
  }
}