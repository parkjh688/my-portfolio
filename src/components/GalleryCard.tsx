// src/components/GalleryCard.tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type GalleryImage = { src: string; alt?: string };

export default function GalleryCard({
  title,
  subtitle,
  images,
  caption,
  className,
  size = 200, // 정사각형 한 변 길이(px)
  rounded = "rounded-xl", // "rounded-full"로 바꾸면 동그란 아바타
}: {
  title?: string;
  subtitle?: string;
  images: GalleryImage[];
  caption?: ReactNode;
  className?: string;
  size?: number;
  rounded?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const lastX = useRef<number | null>(null);

  const count = images?.length ?? 0;
  const go = (n: number) => setIdx((p) => (n + count) % count);
  const next = () => go(idx + 1);
  const prev = () => go(idx - 1);

  // 키보드 이동
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, count]);

  // 드래그/스와이프
  const onDown = (x: number) => {
    startX.current = x;
    lastX.current = x;
    setIsDragging(true);
  };
  const onMove = (x: number) => {
    if (!isDragging || startX.current == null) return;
    lastX.current = x;
  };
  const onUp = () => {
    if (!isDragging || startX.current == null || lastX.current == null) {
      setIsDragging(false);
      return;
    }
    const delta = lastX.current - startX.current;
    const threshold = 40;
    if (delta < -threshold) next();
    if (delta > threshold) prev();
    setIsDragging(false);
    startX.current = null;
    lastX.current = null;
  };

  if (!images || images.length === 0) return null;

  return (
    <div
        className={`mx-auto max-w-xs rounded-2xl border shadow-sm bg-white dark:bg-neutral-900 ${className ?? ""}`}
        aria-label={title}
    >
      {(title || subtitle) && (
        <div className="px-5 pt-5 text-center">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* 갤러리: 정사각형 아바타 카드 */}
        <div
        className="relative mt-4 select-none flex items-center justify-center px-5 overflow-hidden" // ← overflow-hidden 추가
        onMouseDown={(e) => onDown(e.clientX)}
        onMouseMove={(e) => onMove(e.clientX)}
        onMouseLeave={onUp}
        onMouseUp={onUp}
        onTouchStart={(e) => onDown(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onUp}
        >
        {/* 슬라이드 트랙 (가로 스크롤) */}
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${idx * 100}%)`, width: `${count * 100}%` }}
        >
          {images.map((img, i) => (
            <div key={i} className="min-w-full flex justify-center">
              {/* 정사각형 컨테이너 */}
              <div
                className={`relative ${rounded} overflow-hidden`}
                style={{ width: size, height: size }}
              >
                <Image
                  src={img.src}
                  alt={img.alt || title || `Slide ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes={`${size}px`}
                  priority={i === 0}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 좌우 버튼 (여러 장일 때만) */}
        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border bg-white/80 backdrop-blur px-3 py-2 text-sm hover:bg-white dark:bg-black/50"
            >
              ◀
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border bg-white/80 backdrop-blur px-3 py-2 text-sm hover:bg-white dark:bg-black/50"
            >
              ▶
            </button>
          </>
        )}
      </div>

      {/* 점 네비게이션 */}
      {count > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 w-2 rounded-full border ${
                i === idx ? "bg-black dark:bg-white" : "bg-white/70 dark:bg-black/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* 캡션 */}
      {caption && (
        <div className="mt-2 px-3 py-2 text-center text-sm text-gray-700 dark:text-gray-300 border-t">
        {caption}
        </div>
      )}
    </div>
  );
}