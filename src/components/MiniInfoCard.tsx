// src/components/MiniInfoCard.tsx
import Link from "next/link";
import { colorForTag } from "@/lib/tagColors";

export default function MiniInfoCard({
  title,
  meta,
  right,
  href,
  tags,
  note,
}: {
  title: string;
  meta?: string;
  right?: string;
  href?: string;
  tags?: string[];
  note?: string;
}) {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    href ? (
      <Link
        href={href}
        className="block h-full hover:bg-gray-50 dark:hover:bg-neutral-900/60 rounded-2xl transition"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel="noreferrer"
      >
        {children}
      </Link>
    ) : (
      <div className="h-full">{children}</div>
    );

  return (
    <Wrapper>
      <div className="h-full rounded-2xl border p-4 flex flex-col">
        {/* 상단: 제목/메타 + 연도 */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold leading-6">{title}</h3>
            {meta && <p className="mt-1 text-sm text-gray-600">{meta}</p>}
          </div>
          {right && <span className="text-xs text-gray-500 shrink-0">{right}</span>}
        </div>

        {/* 본문 설명 */}
        {note && (
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{note}</p>
        )}

        {/* 태그들 */}
        {tags?.length ? (
        <div className="mt-auto pt-3 flex flex-wrap gap-2">
            {tags.map((t) => (
            <span
                key={t}
                className={`rounded-full border px-2 py-0.5 text-xs ${colorForTag(t)}`}
            >
                {t}
            </span>
            ))}
        </div>
        ) : null}
      </div>
    </Wrapper>
  );
}