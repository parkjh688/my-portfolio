// app/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { projects } from "@/data/projects";

import Link from "next/link";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props) {
  const p = projects.find((x) => x.slug === params.slug);
  return {
    title: p ? `${p.title} – Junghyun Park` : "Project – Junghyun Park",
    description: p?.summary,
  };
}

export default function ProjectDetail({ params }: Props) {
  const p = projects.find((x) => x.slug === params.slug);
  if (!p) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      {/* <a href="/" className="text-sm underline">← Back</a> */}
      <Link href="/">← Back</Link>

      <h1 className="mt-4 text-2xl font-bold">{p.title}</h1>
      <p className="mt-1 text-gray-600">
        {p.company} {p.period ? `· ${p.period}` : ""}
      </p>

      {/* 태그 */}
      {p.tags?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border px-2 py-0.5 text-xs text-gray-600"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {/* 요약 */}
      <p className="mt-6">{p.summary}</p>

      {/* 상세(마크다운으로 렌더링) */}
      {p.details?.length ? (
        <ul className="mt-4 list-disc space-y-2 pl-6">
          {p.details.map((line, i) => (
            <li key={i} className="text-base leading-7">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                    a: ({ ...props }) => (
                        <a {...props} className="underline" target="_blank" rel="noreferrer" />
                    ),
                    strong: ({ ...props }) => (
                        <strong className="font-semibold" {...props} />
                    ),
                    em: ({ ...props }) => <em className="italic" {...props} />,
                    }}
                >
                    {line}
                </ReactMarkdown>
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}