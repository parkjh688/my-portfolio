// components/ProjectCard.tsx
import Link from "next/link";
import type { Project } from "@/data/projects";
import { colorForTag } from "@/lib/tagColors";

export default function ProjectCard({ p }: { p: Project }) {
  return (
    <Link
      href={`/projects/${p.slug}`}
      className="block rounded-2xl border p-5 hover:shadow-md transition"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">{p.title}</h3>
        {p.period && <span className="text-xs text-gray-500">{p.period}</span>}
      </div>
      <p className="mt-1 text-sm text-gray-600">
        {p.company}
      </p>
      <p className="mt-3 text-sm">{p.summary}</p>

      {p.tags && (
        <div className="mt-3 flex flex-wrap gap-2">
          {p.tags.slice(0, 6).map((t) => (
            <span
              key={t}
              className={`rounded-full border px-2 py-0.5 text-xs ${colorForTag(t)}`}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}