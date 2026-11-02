import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoteDetail } from "@/components/note-detail";
import { getNote, getNotesByType } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getNotesByType("quant").map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote("quant", slug);
  return { title: note ? note.title : "量化笔记" };
}

export default async function QuantDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNote("quant", slug);
  if (!note) notFound();

  return <NoteDetail note={note} backHref="/quant" />;
}
