import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoteDetail } from "@/components/note-detail";
import { getNotesByType, type Note } from "@/lib/content";

export const dynamicParams = false;

/** 财报 + 招股书共用路由：slug 在两类目录间不可重名（见 AGENTS.md 约定） */
function findReadingNote(slug: string): Note | undefined {
  return (
    getNotesByType("report").find((n) => n.slug === slug) ??
    getNotesByType("prospectus").find((n) => n.slug === slug)
  );
}

export function generateStaticParams() {
  const slugs = new Set<string>();
  for (const n of getNotesByType("report")) slugs.add(n.slug);
  for (const n of getNotesByType("prospectus")) slugs.add(n.slug);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = findReadingNote(slug);
  return { title: note ? note.title : "精读笔记" };
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = findReadingNote(slug);
  if (!note) notFound();

  return <NoteDetail note={note} backHref="/archive" />;
}
