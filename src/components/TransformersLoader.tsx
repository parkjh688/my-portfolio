// src/components/TransformersLoader.tsx
"use client";
import Script from "next/script";

export default function TransformersLoader() {
  return (
    <Script
      id="xenova-transformers-loader"
      type="module"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (async () => {
            // ---- 절대 URL 매핑 (버전 고정) ----
            const BASE = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.0/dist/';
            const ABS = {
              'ort-wasm.wasm':              BASE + 'ort-wasm.wasm',
              'ort-wasm-simd.wasm':         BASE + 'ort-wasm-simd.wasm',
              'ort-wasm-threaded.wasm':     BASE + 'ort-wasm-threaded.wasm',
              'ort-wasm-simd-threaded.wasm':BASE + 'ort-wasm-simd-threaded.wasm',
            };

            // 0) ORT 전역을 먼저 설정 (가장 중요)
            globalThis.ort = globalThis.ort || {};
            globalThis.ort.env = globalThis.ort.env || {};
            globalThis.ort.env.wasm = Object.assign(globalThis.ort.env.wasm || {}, {
              // 폴더 문자열 대신 "파일별 절대 URL" 매핑을 직접 명시
              wasmPaths: ABS,
              proxy: false,
              numThreads: 1,
              simd: false,
              fetchOptions: { mode: 'cors', credentials: 'omit' },
            });

            // 1) transformers 로드 → 전역 고정
            if (!globalThis.transformers) {
              const m = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@latest/dist/transformers.min.js');
              const mod = m?.pipeline ? m : (m?.default?.pipeline ? m.default : null);
              if (!mod) throw new Error('transformers loaded but pipeline not found');
              globalThis.transformers = mod;
            }

            // 2) transformers 쪽 env도 동일하게 보수 설정
            const t   = globalThis.transformers;
            const env = t.env;

            env.allowRemoteModels = true;
            env.useBrowserCache   = true;

            env.backends = env.backends || {};
            env.backends.onnx  = env.backends.onnx  || { enabled: true };
            env.backends.webgpu = { enabled: false };
            env.backends.webnn  = { enabled: false };
            env.backends.tfjs   = { enabled: false };
            env.backends.tflite = { enabled: false };

            env.backends.onnx.wasm = Object.assign(env.backends.onnx.wasm || {}, {
              // 여기서도 "파일별 절대 URL" 매핑을 그대로 사용
              wasmPaths: ABS,
              proxy: false,
              numThreads: 1,
              simd: false,
              fetchOptions: { mode: 'cors', credentials: 'omit' },
            });

            // 디버그: 실제로 내려받을 URL을 미리 찍어보기
            try {
              const r = await fetch(ABS['ort-wasm.wasm'], { mode: 'cors' });
              console.log('[ORT prefetch]', ABS['ort-wasm.wasm'], r.status, r.headers.get('content-type'));
            } catch (e) {
              console.warn('[ORT prefetch failed]', e);
            }

            console.log('[TransformersLoader] ready', {
              ort: globalThis.ort?.env?.wasm,
              onnx: env.backends?.onnx?.wasm
            });
          })().catch(e => console.error('[TransformersLoader] import/config error', e));
        `,
      }}
    />
  );
}