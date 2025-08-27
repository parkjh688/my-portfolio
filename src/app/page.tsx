// src/app/page.tsx
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import GalleryCard from "@/components/GalleryCard";
import MiniInfoCard from "@/components/MiniInfoCard";
import { publications, talks } from "@/data/extras";
import AgentClient from "@/components/AgentClient";


export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Junghyun Park — ML Engineer</h1>
        <p className="mt-2 text-gray-600">
          Multimodal LLM · Image Retrieval · Vision & Text Analysis · Generative AI
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <Link href="mailto:parkjh688@gmail.com" className="underline">Email</Link>
          <Link href="https://www.linkedin.com/in/junghyun-eden/" className="underline" target="_blank">LinkedIn</Link>
          <Link href="/resume.pdf" className="underline">Resume (PDF)</Link>
          <span className="inline-flex items-center gap-1 text-gray-500">
            <span className="leading-none">📍</span>
            <span>Based in Sydney</span>
          </span>
        </div>
      </header>

      {/* 소개 섹션: 왼쪽(프로필) + 오른쪽(에이전트) */}
      <section className="mb-10 flex items-stretch gap-6">
        <div className="w-[320px]">
          <GalleryCard
            title="Hello, I'm Junghyun"
            images={[
              { src: "/profile/me1.jpeg", alt: "Profile 1" },
              { src: "/profile/me2.jpeg", alt: "Profile 2" },
              { src: "/profile/me3.jpeg", alt: "Profile 3" },
            ]}
            caption={
              <>
                <span className="font-semibold">Half ML engineer, half pizza critic,</span>
                <span className="block font-bold uppercase">full-time animal friend!</span>
              </>
            }
            size={200}
            rounded="rounded-xl"
          />
        </div>

        {/* 오른쪽: 에이전트 영역 */}
        <div className="flex-1 rounded-2xl border p-5">
          <h3 className="text-lg font-semibold">Chat Agent</h3>
          <p className="mt-1 text-sm text-gray-600">
            (브라우저에서 로컬 추론). 페이지 진입 시 모델을 미리 다운로드합니다.
          </p>

          {/* ✅ 여기서만 AgentClient를 클라이언트로 렌더 */}
          <div className="mt-3">
            <AgentClient />
          </div>
        </div>
      </section>

      {/* 아래: 프로젝트 */}
      <h2 className="mb-4 text-lg font-semibold">Projects</h2>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.slug} p={p} />
        ))}
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold">Publications</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {publications.map((p) => (
            <MiniInfoCard
              key={p.title}
              title={p.title}
              meta={p.venue}
              right={p.year}
              href={p.href}
              tags={p.tags}
            />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold">Talks & Events</h2>
        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2">
          {talks.map((t) => (
            <MiniInfoCard
              key={`${t.event}-${t.title}-${t.year}`}
              title={t.title}
              meta={`${t.event}${t.role ? ` · ${t.role}` : ""}`}
              right={t.year}
              href={t.href}
              tags={t.tags}
              note={t.note}
            />
          ))}
        </div>
      </section>
    </main>
  );
}