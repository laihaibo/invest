import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { NoteCard } from "@/components/note-card";
import { formatDateCN, getAllDates, getNotesByDate } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllDates().map((date) => ({ date }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  return { title: formatDateCN(date) };
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const notes = valid ? getNotesByDate(date) : [];
  if (!valid || notes.length === 0) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <Link
          href="/calendar"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          返回日历
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          {formatDateCN(date)}
        </h1>
        <p className="text-sm text-muted-foreground">
          共 {notes.length} 篇笔记
        </p>
      </header>
      <div className="space-y-4">
        {notes.map((n) => (
          <NoteCard key={n.slug} note={n} />
        ))}
      </div>
    </div>
  );
}
